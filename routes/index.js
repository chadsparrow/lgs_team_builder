const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  return res.send([{ message: 'Welcome to the Team Builder API' }]);
});

module.exports = router;
