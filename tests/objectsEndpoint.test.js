const request = require('supertest');
const app = require('../app');
const {HTTP_UNPROCESSABLE_ENTITY, HTTP_CONFLICT, HTTP_OK, HTTP_CREATED} = require("../errors/httpCodes");
const {
  errorsDescriptions,
  ERROR_OBJECT_ALREADY_EXISTS,
  ERROR_OBJECT_DOES_NOT_EXIST,
  ERROR_OBJECT_IS_ALREADY_ASSIGNED
} = require("../errors/error");

let agent;

beforeAll(async () => {
  agent = request(app);
});

describe('Creates an object', () => {
  test('It should create the object', async (done) => {
    const response = await agent.post('/objects').send({'id': 1});
    expect(response.statusCode).toBe(HTTP_CREATED);
    done();
  });

  test('It gets the recently created object', async (done) => {
    const response = await agent.get('/objects/1');
    expect(response.statusCode).toBe(HTTP_OK);
    expect(response.body).toStrictEqual({id: 1, isAssigned: false})
    done();
  });

  test('It errors if the object already exists.', async (done) => {
    const response = await agent.post('/objects').send({'id': 1});
    expect(response.statusCode).toBe(HTTP_CONFLICT);
    expect(response.body).toStrictEqual({
      error_code: ERROR_OBJECT_ALREADY_EXISTS,
      error_description: errorsDescriptions[ERROR_OBJECT_ALREADY_EXISTS]
    })
    done();
  });
});


describe('Assigns an object', () => {
  test('Object can be assigned', async (done) => {
    await agent.post('/objects').send({'id': 1});
    const response = await agent.post('/objects/1/assign');
    expect(response.statusCode).toBe(HTTP_OK);
    expect(response.body).toStrictEqual({message: 'Object assigned.'})
    done();
  });

  test('Object cannot be assigned twice', async (done) => {
    await agent.post('/objects').send({'id': 1});
    const response = await agent.post('/objects/1/assign');
    expect(response.statusCode).toBe(HTTP_CONFLICT);
    expect(response.body).toStrictEqual({
      error_code: ERROR_OBJECT_IS_ALREADY_ASSIGNED,
      error_description: errorsDescriptions[ERROR_OBJECT_IS_ALREADY_ASSIGNED]
    })
    done();
  });

  test('Object that does not exist cannot be assigned', async (done) => {
    const response = await agent.post('/objects/2/assign');
    expect(response.statusCode).toBe(HTTP_UNPROCESSABLE_ENTITY);
    expect(response.body).toStrictEqual({
      error_code: ERROR_OBJECT_DOES_NOT_EXIST,
      error_description: errorsDescriptions[ERROR_OBJECT_DOES_NOT_EXIST]
    })
    done();
  });
});

describe('Frees an object', () => {
  test('Object can be freed', async (done) => {
    await agent.post('/objects').send({'id': 1});

    await agent.post('/objects/1/assign');
    let getResponse = await agent.get('/objects/1');
    expect(getResponse.body).toStrictEqual({id: 1, isAssigned: true})

    const response = await agent.post('/objects/1/free');
    expect(response.statusCode).toBe(HTTP_OK);
    expect(response.body).toStrictEqual({message: 'Object freed.'})

    getResponse = await agent.get('/objects/1');
    expect(getResponse.body).toStrictEqual({id: 1, isAssigned: false})
    done();
  });
});
