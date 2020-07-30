module.exports = {
  resp: {
    json: (obj) => obj,
    status(status) {
      this.statusNumber = status;
      return this;
    },
    set: (name, value) => {
      this[name] = value;
    },
  },
  next: (dat) => dat,
};
