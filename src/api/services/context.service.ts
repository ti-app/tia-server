class Context {
  context: any = {};
  constructor() {
    this.context = {};
  }

  set(key: string, value: any) {
    this.context = {
      ...this.context,
      [key]: value,
    };
  }

  get(key: string) {
    return this.context[key];
  }
}

export default new Context();
