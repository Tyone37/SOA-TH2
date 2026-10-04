const express = require('express');
const verifyToken = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', verifyToken, (req, res) => {
  res.send('Hello World');
});

module.exports = router;