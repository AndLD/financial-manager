import { SetStateFunction, State } from './types'

export function useState<Type>(initialState?: Type): [State, SetStateFunction<Type>] {
    const state: State = {
        state: initialState
    }

    function setState(newState: Type) {
        state.state = newState
    }

    return [state, setState]
}
