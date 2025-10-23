const express = require('express');
const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'UP', 
    timestamp: new Date().toISOString(),
    service: 'backend'
  });
});

module.exports = router;