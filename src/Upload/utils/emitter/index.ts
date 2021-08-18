class Emitter {
  events: Map<Symbol, Function> = new Map();

  on(name: Symbol, action: Function) {
    if (typeof name === 'symbol') {
      this.events.set(name, action);
    }
  }

  emit(name: Symbol, ...args: any) {
    const action = this.events.get(name);
    action?.(name, ...args);
  }

  off(name: Symbol) {
    this.events.delete(name);
  }
}

export default Emitter;
