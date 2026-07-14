const Imap = require('imap');
const nodemailer = require('nodemailer');
const { simpleParser } = require('mailparser');

// Connect and wait for ready event
const imapConnect = (credentials) => {
  return new Promise((resolve, reject) => {
    const imap = new Imap({
      user: credentials.email,
      password: credentials.password,
      host: credentials.imapHost,
      port: credentials.imapPort || 993,
      tls: true,
      tlsOptions: { rejectUnauthorized: false },
      authTimeout: 15000,
    });

    imap.on('error', (err) => {
      console.error('[IMAP] Connection error:', err.message);
      reject(err);
    });

    imap.on('ready', () => {
      console.log('[IMAP] Connection ready');
      resolve(imap);
    });

    console.log(`[IMAP] Connecting to ${credentials.imapHost}:${credentials.imapPort || 993} as ${credentials.email}`);
    imap.openBox = imap.openBox.bind(imap);
    imap.search = imap.search.bind(imap);
    imap.getBoxes = imap.getBoxes.bind(imap);
    imap.fetch = imap.fetch.bind(imap);

    imap.connect();
  });
};

// Fetch emails from mailbox
const fetchEmails = async (req, res) => {
  const { credentials, mailbox = 'INBOX', count = 20 } = req.body;

  let imap;

  try {
    imap = await imapConnect(credentials);

    // Open mailbox
    await new Promise((resolve, reject) => {
      imap.openBox(mailbox, false, (err, box) => {
        if (err) {
          console.error('[IMAP] Failed to open box:', err.message);
          reject(err);
        } else {
          console.log(`[IMAP] Opened mailbox: ${mailbox}`);
          resolve(box);
        }
      });
    });

    // Search for all emails
    const results = await new Promise((resolve, reject) => {
      imap.search(['ALL'], (err, results) => {
        if (err) {
          console.error('[IMAP] Search failed:', err.message);
          reject(err);
        } else {
          console.log(`[IMAP] Found ${results.length} emails`);
          resolve(results);
        }
      });
    });

    const emails = [];

    if (results.length === 0) {
      imap.end();
      return res.json({ emails: [] });
    }

    // Fetch last 'count' emails
    const idsToFetch = results.slice(Math.max(0, results.length - count));
    console.log(`[IMAP] Fetching ${idsToFetch.length} emails`);

    const f = imap.fetch(idsToFetch, { bodies: '' });

    await new Promise((resolve, reject) => {
      let processed = 0;

      f.on('message', (msg, seqno) => {
        msg.on('body', (stream, info) => {
          simpleParser(stream, (err, parsed) => {
            if (err) {
              console.error(`[IMAP] Parse error for email ${seqno}:`, err.message);
              processed++;
              return;
            }

            emails.push({
              id: seqno,
              from: parsed.from?.text || 'Unknown',
              to: parsed.to?.text || '',
              subject: parsed.subject || '(No Subject)',
              text: parsed.text || '',
              html: parsed.html || '',
              date: parsed.date || new Date(),
            });

            processed++;
          });
        });
      });

      f.on('error', (err) => {
        console.error('[IMAP] Fetch error:', err.message);
        reject(err);
      });

      f.on('end', () => {
        setTimeout(() => {
          console.log(`[IMAP] Fetch complete, got ${emails.length} emails`);
          resolve();
        }, 500);
      });
    });

    imap.end();

    res.json({ emails: emails.reverse() });
  } catch (error) {
    console.error('[IMAP] Fatal error:', error.message);
    if (imap) {
      try {
        imap.destroy();
      } catch (e) {
        // ignore
      }
    }
    res.status(500).json({ error: error.message });
  }
};

// Send email
const sendEmail = async (req, res) => {
  try {
    const { credentials, to, subject, body, html } = req.body;

    console.log(`[SMTP] Sending email from ${credentials.email} to ${to}`);

    const transporter = nodemailer.createTransport({
      host: credentials.smtpHost,
      port: credentials.smtpPort || 465,
      secure: true,
      auth: {
        user: credentials.email,
        pass: credentials.password,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: credentials.email,
      to,
      subject,
      text: body,
      html: html || body,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('[SMTP] Email sent:', info.messageId);

    res.json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error('[SMTP] Send error:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// Get available mailboxes
const getMailboxes = async (req, res) => {
  const { credentials } = req.body;

  let imap;

  try {
    console.log(`[IMAP] Getting mailboxes from ${credentials.imapHost}:${credentials.imapPort || 993} as ${credentials.email}`);

    imap = await imapConnect(credentials);

    const boxes = await new Promise((resolve, reject) => {
      imap.getBoxes((err, boxes) => {
        if (err) {
          console.error('[IMAP] getBoxes error:', err.message);
          reject(err);
        } else {
          console.log('[IMAP] Got boxes');
          resolve(boxes);
        }
      });
    });

    imap.end();

    const boxList = [];
    const flattenBoxes = (boxObj) => {
      for (const [key, box] of Object.entries(boxObj)) {
        if (typeof box === 'object' && box.name) {
          boxList.push({
            name: box.name,
            path: box.name,
          });
          if (box.children && Object.keys(box.children).length > 0) {
            flattenBoxes(box.children);
          }
        }
      }
    };

    flattenBoxes(boxes);

    res.json({ mailboxes: boxList });
  } catch (error) {
    console.error('[IMAP] Mailbox error:', error.message);
    if (imap) {
      try {
        imap.destroy();
      } catch (e) {
        // ignore
      }
    }
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  fetchEmails,
  sendEmail,
  getMailboxes,
};
