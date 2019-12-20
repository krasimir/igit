if (!('localStorage' in window)) {
  window.localStorage = {
    _data: {},
    setItem: function(id, val) {
      this._data[id] = String(val);
      return this._data[id];
    },
    getItem: function(id) {
      return this._data.hasOwnProperty(id) ? this._data[id] : undefined;
    },
    removeItem: function(id) {
      return delete this._data[id];
    },
    clear: function() {
      this._data = {};
      return this._data;
    }
  };
}

const API = {
  set(id, value) {
    localStorage.setItem(id, JSON.stringify(value));
  },
  get(id, defaultValue) {
    const value = localStorage.getItem(id);

    if (value) {
      try {
        return JSON.parse(value);
      } catch (error) {
        return defaultValue;
      }
    }
    return defaultValue;
  }
};

export default API;
