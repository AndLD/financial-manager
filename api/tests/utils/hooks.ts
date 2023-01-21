import { SetStateFunction, State, Subscriber } from './types'

export function useState<Type>(initialState?: Type, ...subscribers: Subscriber[]): [State, SetStateFunction<Type>] {
    const state: State = {
        state: initialState,
        subscribers
    }

    function setState(newState: Type) {
        state.state = newState

        for (const sub of subscribers) {
            sub(newState)
        }
    }

    return [state, setState]
}

export function useEffect(subscriber: Subscriber, states: any[]) {
    for (const state of states) {
        state.subscribers.push(subscriber)
    }
}
