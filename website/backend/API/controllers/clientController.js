const client = require('../models/clientModel');

exports.getAllclients = (req, res) => {
  client.getAllclients((err, clients) => {
    if (err) {
      console.error('[getAllclients] Error:', err);
      return res.status(500).json({
        error: err.message || JSON.stringify(err),
        code: err.code,
        type: err.constructor.name,
      });
    }
    res.status(200).json(clients);
  });
};

exports.getclientById = (req, res) => {
  const id = req.params.id;
  client.getclientById(id, (err, clientData) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!clientData) return res.status(404).json({ message: 'client not found' });
    res.status(200).json(clientData);
  });
};

exports.createclient = (req, res) => {
  const data = req.body;
  if (!data.name) return res.status(400).json({ error: 'Client name is required' });
  
  client.createclient(data, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Client created successfully', id: result.insertId });
  });
};

exports.updateclient = (req, res) => {
  const id = req.params.id;
  const data = req.body;
  client.updateclient(id, data, (err, affectedRows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (affectedRows === 0) return res.status(404).json({ message: 'client not found' });
    res.status(200).json({ message: 'client updated successfully' });
  });
};

exports.deleteclient = (req, res) => {
  const id = req.params.id;
  client.deleteclient(id, (err, affectedRows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (affectedRows === 0) return res.status(404).json({ message: 'client not found' });
    res.status(200).json({ message: 'client deleted successfully' });
  });
};
