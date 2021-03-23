function ObjectsStore() {
  const store = {};

  const _get = (id) => {
    return store[id] || null;
  }

  const _create = (id) => {
    store[id] = {
      id,
      isAssigned: false
    }
  }

  const _delete = (id) => {
    delete store[id];
  }

  const _free = (id) => {
    store[id].isAssigned = false;
  }

  const _assign = (id) => {
    store[id].isAssigned = true;
  }

  return {
    get: _get,
    set: _create,
    assign: _assign,
    free: _free,
    delete: _delete,
  }
}

module.exports = ObjectsStore;
