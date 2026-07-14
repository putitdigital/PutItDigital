# Email Client - cPanel Desktop & Mobile App

A lightweight email client for accessing cPanel-hosted email accounts on desktop (Electron) and mobile (React Native).

## Architecture

- **Backend**: Express.js with IMAP/SMTP using `imap-simple` and `nodemailer`
- **Desktop**: Electron + React
- **Mobile**: React Native (setup guide in separate section)

## Quick Start

### Prerequisites
- Node.js 18+
- npm/yarn
- cPanel email account with IMAP/SMTP enabled

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

Backend runs on `http://localhost:5000`

### Desktop Setup (Electron + React)

In a new terminal:

```bash
cd frontend
npm install
npm start
```

This starts both the React dev server (port 3000) and Electron.

### Docker Setup (Backend Only)

```bash
docker-compose up -d
```

## Configuration

### cPanel Mail Server Details

You'll need:
- **Email**: your-email@yourdomain.com
- **Password**: Your cPanel email password
- **IMAP Host**: `mail.yourdomain.com` (port 993, SSL)
- **SMTP Host**: `mail.yourdomain.com` (port 465, SSL)

These are typically the defaults for cPanel installations.

## API Endpoints

### POST `/api/email/fetch`
Fetch emails from a mailbox.

```json
{
  "credentials": {
    "email": "user@domain.com",
    "password": "password",
    "imapHost": "mail.domain.com",
    "imapPort": 993
  },
  "mailbox": "INBOX",
  "count": 50
}
```

### POST `/api/email/send`
Send an email.

```json
{
  "credentials": { ... },
  "to": "recipient@domain.com",
  "subject": "Hello",
  "body": "Message body"
}
```

### POST `/api/email/mailboxes`
List available mailboxes.

```json
{
  "credentials": { ... }
}
```

## Mobile Setup (React Native)

```bash
cd mobile
npm install
npx react-native run-android  # or run-ios
```

Mobile app connects to the same Express backend via API calls.

## Development

### Hot Reload

**Desktop**: Electron auto-reloads on file changes.

**Backend**: Uses `nodemon` — restart on src/ changes.

### Environment Variables

Create `.env` in backend folder:

```
PORT=5000
NODE_ENV=development
```

## Security Notes

- Credentials are passed in request body (HTTPS recommended for production)
- Consider implementing token-based auth (JWT) for sensitive deployments
- Never store plaintext passwords in config files
- Use environment variables for deployment

## Troubleshooting

### Backend fails to connect
- Verify cPanel mail server is running
- Check IMAP/SMTP ports are open
- Confirm email credentials are correct

### Electron shows blank screen
- Check React dev server is running on port 3000
- Run with: `DEBUG=*:* npm start`

### IMAP authentication fails
- Verify email account exists in cPanel
- Check "Enable IMAP" in cPanel email settings
- Try using full email address as username

## Next Steps

- Add authentication (JWT, OAuth)
- Implement email encryption
- Add attachments support
- Sync across devices
- Build mobile apps (iOS/Android)
- Deploy backend to server
