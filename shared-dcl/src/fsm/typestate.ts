export class Transitions<T> {
  constructor(public fsm: FiniteStateMachine<T>) {}

  public fromStates: T[] | undefined
  public toStates:
    | T[]
    /**
     * Specify the end state(s) of a transition function
     */
    | undefined

  /**
   * Specify the end state(s) of a transition function
   */
  public to(...states: T[]): void {
    this.toStates = states
    this.fsm.addTransitions(this)
  }

  /**
   * Specify that any state in the state enum is value
   * Takes the state enum as an argument
   */
  public toAny(states: any): void {
    const toStates: T[] = []
    for (const s in states) {
      if (Object.prototype.hasOwnProperty.call(states, s) !== null) {
        toStates.push(states[s] as T)
      }
    }

    this.toStates = toStates
    this.fsm.addTransitions(this)
  }
}
export class TransitionFunction<T> {
  constructor(
    public fsm: FiniteStateMachine<T>,
    public from: T,
    public to: T
  ) {}
}
export class FiniteStateMachine<T> {
  public currentState: T
  private readonly _startState: T
  private readonly _allowImplicitSelfTransition: boolean
  private readonly _transitionFunctions: Array<TransitionFunction<T>> = []
  private _onCallbacks: Record<string, Array<(from: T, event?: any) => void>> = {}
  private _exitCallbacks: Record<string, Array<(to: T) => boolean>> = {}
  private _enterCallbacks: Record<string, Array<(from: T, event?: any) => boolean>> = {}
  private _invalidTransitionCallback: (to?: T, from?: T) => boolean = () => false

  constructor(startState: T, allowImplicitSelfTransition: boolean = false) {
    this.currentState = startState
    this._startState = startState
    this._allowImplicitSelfTransition = allowImplicitSelfTransition
  }

  public addTransitions(fcn: Transitions<T>): void {
    fcn.fromStates?.forEach((from) => {
      fcn.toStates?.forEach((to) => {
        if (!this._canGo(from, to)) {
          this._transitionFunctions.push(new TransitionFunction<T>(this, from, to))
        }
      })
    })
  }

  /**
   * Listen for the transition to this state and fire the associated callback
   */
  public on(state: T extends string | number | symbol ? T : never, callback: (from?: T, event?: any) => any): this {
    const key = state.toString()
    if (this._onCallbacks[key] == null) {
      this._onCallbacks[key] = []
    }
    this._onCallbacks[key].push(callback)
    return this
  }

  /**
   * Listen for the transition to this state and fire the associated callback, returning
   * false in the callback will block the transition to this state.
   */
  public onEnter(
    state: T extends string | number | symbol ? T : never,
    callback: (from?: T, event?: any) => boolean
  ): this {
    const key = state.toString()
    if (this._enterCallbacks[key] == null) {
      this._enterCallbacks[key] = []
    }
    this._enterCallbacks[key].push(callback)
    return this
  }

  /**
   * Listen for the transition to this state and fire the associated callback, returning
   * false in the callback will block the transition from this state.
   */
  public onExit(state: T extends string | number | symbol ? T : never, callback: (to?: T) => boolean): this {
    const key = state.toString()
    if (this._exitCallbacks[key] == null) {
      this._exitCallbacks[key] = []
    }
    this._exitCallbacks[key].push(callback)
    return this
  }

  /**
   * List for an invalid transition and handle the error, returning a falsy value will throw an
   * exception, a truthy one will swallow the exception
   */
  public onInvalidTransition(callback: (from?: T, to?: T) => boolean): this {
    if (this._invalidTransitionCallback == null) {
      this._invalidTransitionCallback = callback
    }
    return this
  }

  /**
   * Declares the start state(s) of a transition function, must be followed with a '.to(...endStates)'
   */
  public from(...states: T[]): Transitions<T> {
    const _transition = new Transitions<T>(this)
    _transition.fromStates = states
    return _transition
  }

  public fromAny(states: any): Transitions<T> {
    const fromStates: T[] = []
    for (const s in states) {
      if (Object.prototype.hasOwnProperty.call(states, s) !== null) {
        fromStates.push(states[s] as T)
      }
    }

    const _transition = new Transitions<T>(this)
    _transition.fromStates = fromStates
    return _transition
  }

  private _validTransition(from: T, to: T): boolean {
    return this._transitionFunctions.some((tf) => {
      return tf.from === from && tf.to === to
    })
  }

  /**
   * Check whether a transition between any two states is valid.
   *    If allowImplicitSelfTransition is true, always allow transitions from a state back to itself.
   *     Otherwise, check if it's a valid transition.
   */
  private _canGo(fromState: T, toState: T): boolean {
    return (this._allowImplicitSelfTransition && fromState === toState) || this._validTransition(fromState, toState)
  }

  /**
   * Check whether a transition to a new state is valid
   */
  public canGo(state: T): boolean {
    return this._canGo(this.currentState, state)
  }

  /**
   * Transition to another valid state
   */
  public go(state: T extends string | number | symbol ? T : never, event?: any): void {
    if (!this.canGo(state)) {
      if (this._invalidTransitionCallback == null || !this._invalidTransitionCallback(this.currentState, state)) {
        throw new Error(
          `Error: no transition function exists from state ${String(this.currentState)} to ${String(state)}`
        )
      }
    } else {
      this._transitionTo(state, event)
    }
  }

  /**
   * This method is availble for overridding for the sake of extensibility.
   * It is called in the event of a successful transition.
   */
  public onTransition(from: T, to: T): void {
    // pass, does nothing until overidden
  }

  /**
   * Reset the finite state machine back to the start state, DO NOT USE THIS AS A SHORTCUT for a transition.
   * This is for starting the fsm from the beginning.
   */
  // TODO
  //   public reset(options?: ResetOptions) {
  //     options = { ...DefaultResetOptions, ...(options || {}) }
  //     this.currentState = this._startState
  //     if (options.runCallbacks) {
  //       this._onCallbacks[this.currentState.toString()].forEach((fcn) => {
  //         fcn.call(this, null, null)
  //       })
  //     }
  //   }

  /**
   * Whether or not the current state equals the given state
   */
  public is(state: T): boolean {
    return this.currentState === state
  }

  private _transitionTo(state: T, event?: any): void {
    const currentStateKey = String(this.currentState)
    const nextStateKey = String(state)

    if (this._exitCallbacks[currentStateKey] == null) {
      this._exitCallbacks[currentStateKey] = []
    }

    if (this._enterCallbacks[nextStateKey] == null) {
      this._enterCallbacks[nextStateKey] = []
    }

    if (this._onCallbacks[nextStateKey] == null) {
      this._onCallbacks[nextStateKey] = []
    }

    const canExit = this._exitCallbacks[currentStateKey].reduce<boolean>((accum: boolean, next: (to: T) => boolean) => {
      return accum && next.call(this, state)
    }, true)

    const canEnter = this._enterCallbacks[nextStateKey].reduce<boolean>(
      (accum: boolean, next: (from: T) => boolean) => {
        return accum && next.call(this, this.currentState)
      },
      true
    )

    if (canExit && canEnter) {
      const old = this.currentState
      this.currentState = state
      this._onCallbacks[nextStateKey].forEach((fcn) => {
        fcn.call(this, old, event)
      })
      this.onTransition(old, state)
    }
  }
}
