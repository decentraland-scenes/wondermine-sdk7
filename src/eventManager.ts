export type EventConstructor<T> = new (...args: any[]) => T

export class EventManager {
  // eslint-disable-next-line @typescript-eslint/ban-types
  private readonly listeners = new Map<EventConstructor<any>, Array<{ listener: any; callback: Function }>>()

  public registerEvent(eventClass: EventConstructor<any>): void {
    if (!this.listeners.has(eventClass)) {
      this.listeners.set(eventClass, [])
    }
  }

  addListener<T, X>(eventClass: EventConstructor<T>, listener: X, listenerFunction: (this: X, event: T) => void): this {
    // Verifica si eventClass ya tiene una lista asociada en el mapa.
    let eventListeners = this.listeners.get(eventClass)

    // Si no existe, inicializa una nueva lista.
    if (eventListeners !== null) {
      eventListeners = []
      this.listeners.set(eventClass, eventListeners)
    }

    // Ahora que estamos seguros de que eventListeners es un arreglo, podemos usarlo.
    eventListeners.push({ listener, callback: listenerFunction })

    return this
  }

  // Remover un listener
  removeListener<X>(listener: X, eventClass: EventConstructor<any>): boolean {
    const eventListeners = this.listeners.get(eventClass)
    if (eventListeners == null) return false

    const initialLength = eventListeners.length
    const filteredListeners = eventListeners.filter((entry) => entry.listener !== listener)

    this.listeners.set(eventClass, filteredListeners)
    return filteredListeners.length !== initialLength
  }

  // Disparar un evento
  fireEvent<T extends object>(event: T): this {
    const eventClass = event.constructor as EventConstructor<T>
    const eventListeners = this.listeners.get(eventClass)
    if (eventListeners != null) {
      for (const { listener, callback } of eventListeners) {
        callback.call(listener, event)
      }
    }
    return this
  }
}
