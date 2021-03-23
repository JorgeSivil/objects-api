const {HTTP_INTERNAL_SERVER_ERROR} = require("./httpCodes");
const ERROR_UNKNOWN = 0;
const ERROR_INVALID_PARAMETERS = 1;
const ERROR_OBJECT_ALREADY_EXISTS = 100;
const ERROR_OBJECT_DOES_NOT_EXIST = 101;
const ERROR_OBJECT_IS_ALREADY_ASSIGNED = 102;

const errorsDescriptions = {
  [ERROR_UNKNOWN]: 'Unknown error.',
  [ERROR_INVALID_PARAMETERS]: 'Request validation error.',
  [ERROR_OBJECT_ALREADY_EXISTS]: 'Object already exists.',
  [ERROR_OBJECT_DOES_NOT_EXIST]: 'Object does not exist.',
  [ERROR_OBJECT_IS_ALREADY_ASSIGNED]: 'Object is already assigned.',
}

class APIError extends Error {

  /**
   * @param {string} errorDescription
   * @param {number} errorCode
   * @param {number} httpStatusCode
   * @param {array} validationErrors
   */
  constructor(errorCode = ERROR_UNKNOWN, errorDescription = '', httpStatusCode = HTTP_INTERNAL_SERVER_ERROR, validationErrors = []) {
    super();
    this.errorCode = errorCode;
    this.errorDescription = errorDescription || errorsDescriptions[errorCode] || errorsDescriptions[ERROR_UNKNOWN];
    this.httpStatusCode = httpStatusCode;
    this.validationErrors = validationErrors;
  }
}

module.exports = {
  APIError,
  errorsDescriptions,
  ERROR_UNKNOWN,
  ERROR_INVALID_PARAMETERS,
  ERROR_OBJECT_ALREADY_EXISTS,
  ERROR_OBJECT_IS_ALREADY_ASSIGNED,
  ERROR_OBJECT_DOES_NOT_EXIST
};
