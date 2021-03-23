const express = require('express');
const indexRouter = require('./routes/index');
const {ERROR_UNKNOWN} = require("./errors/error");
const app = express()

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(indexRouter);

app.use(function (err, req, res, next) {
  const httpStatusCode = err?.httpStatusCode ?? 500;

  const errResponse = {
    error_code: err?.errorCode || ERROR_UNKNOWN,
    error_description: err?.errorDescription ?? 'Something broke!',
  };

  if (err?.validationErrors && err?.validationErrors.length) {
    errResponse.validation_errors = err?.validationErrors.map((error) => ({
      error: error.message,
      context: {key: error.context.key, value: error.context.value}
    }));
  }

  res.status(httpStatusCode).send(errResponse);
});

module.exports = app;
