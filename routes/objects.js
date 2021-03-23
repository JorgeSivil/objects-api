const router = require('express-promise-router')();
const Joi = require('joi');
const {
  HTTP_CONFLICT,
  HTTP_NOT_FOUND,
  HTTP_BAD_REQUEST,
  HTTP_CREATED,
  HTTP_OK,
  HTTP_UNPROCESSABLE_ENTITY
} = require("../errors/httpCodes");
const {
  APIError,
  ERROR_INVALID_PARAMETERS,
  ERROR_OBJECT_ALREADY_EXISTS,
  ERROR_OBJECT_DOES_NOT_EXIST,
  ERROR_OBJECT_IS_ALREADY_ASSIGNED
} = require("../errors/error");
const objectsStore = require('../stores/objects')();

const schema = Joi.object({
  id: Joi.number().min(1).required(),
});

/**
 * Assign an object.
 */
router.post('/:id/assign', async function (req, res) {
  const validationResults = schema.validate(req.params, {stripUnknown: true});

  if (validationResults.error) {
    throw new APIError(ERROR_INVALID_PARAMETERS, '', HTTP_BAD_REQUEST, validationResults.error.details);
  }

  const id = req.params.id;
  const object = objectsStore.get(id);

  if (!object) {
    throw new APIError(ERROR_OBJECT_DOES_NOT_EXIST, '', HTTP_UNPROCESSABLE_ENTITY);
  }

  if (object.isAssigned) {
    throw new APIError(ERROR_OBJECT_IS_ALREADY_ASSIGNED, '', HTTP_CONFLICT);
  }

  objectsStore.assign(id);

  res.setHeader('Content-Type', 'application/json');
  res.status(200).end(JSON.stringify({message: 'Object assigned.'}));
})

/**
 * Free an object.
 */
router.post('/:id/free', async function (req, res) {
  const validationResults = schema.validate(req.params, {stripUnknown: true});

  if (validationResults.error) {
    throw new APIError(ERROR_INVALID_PARAMETERS, '', HTTP_BAD_REQUEST, validationResults.error.details);
  }

  const id = req.params.id;
  const object = objectsStore.get(id);

  if (!object) {
    throw new APIError(ERROR_OBJECT_DOES_NOT_EXIST);
  }

  objectsStore.free(id);

  res.setHeader('Content-Type', 'application/json');
  res.status(HTTP_OK).end(JSON.stringify({message: 'Object freed.'}));
})

/**
 * Create an object
 */
router.post('/', async function (req, res) {
  const validationResults = schema.validate(req.body, {stripUnknown: true});

  if (validationResults.error) {
    throw new APIError(ERROR_INVALID_PARAMETERS, '', HTTP_BAD_REQUEST, validationResults.error.details);
  }

  const id = req.body.id;
  if (objectsStore.get(id)) {
    throw new APIError(ERROR_OBJECT_ALREADY_EXISTS, '', HTTP_CONFLICT);
  }

  objectsStore.set(id);
  res.status(HTTP_CREATED).end();
})

/**
 * Get an object.
 */
router.get('/:id', async function (req, res) {
  const validationResults = schema.validate(req.params);

  // If the ID is not a number, call next route. Also could have thrown an error, since it is the only route of its kind.
  if (validationResults.error) {
    return Promise.resolve("route");
  }

  const id = req.params.id;
  const object = objectsStore.get(id);

  if (!object) {
    throw new APIError(ERROR_OBJECT_DOES_NOT_EXIST, '', HTTP_NOT_FOUND);
  }

  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(object));
});

module.exports = router;
