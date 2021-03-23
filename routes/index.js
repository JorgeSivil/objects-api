const router = require('express-promise-router')();

router.use('/objects', require('./objects'));

module.exports = router;
