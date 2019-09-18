class Context {
  constructor() {
    this.context = {};
  }

  set(key, value) {
    this.context = {
      ...this.context,
      [key]: value,
    };
  }

  get(key) {
    return this.context[key];
  }
}

module.exports = new Context();
