export type State = {
    state: any
    subscribers: Subscriber[]
}
export type SetStateFunction<Type> = (newState: Type) => void
export type Subscriber = (newState?: any) => void
