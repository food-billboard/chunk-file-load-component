class Emitter {
  events: Map<Symbol, Set<Function>> = new Map();

  on(name: Symbol, action: Function) {
    if (typeof name === 'symbol') {
      let result = this.events.get(name);
      if (!result) result = new Set();
      result.add(action);
      this.events.set(name, result);
    }
  }

  emit(name: Symbol, ...args: any) {
    const action = this.events.get(name);
    action?.forEach((action) => {
      action?.(name, ...args);
    });
  }

  off(name: Symbol) {
    this.events.delete(name);
  }
}

export default Emitter;
