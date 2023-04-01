import { ReducerAction } from "./reducer";

export function deepFreeze (obj: Record<string, any>) {
  if (Object.isFrozen(obj) || typeof obj !== "object") {
    return obj;
  }
  Object.values(obj).forEach(deepFreeze);
  return Object.freeze(obj);
}

export default function createStore (initialState = {},  reducer = (state: any, action: ReducerAction) => state) {
  let store = deepFreeze(initialState);
  return {
    getState: (key?: string) => key ? store[key] : store,
    dispatch: (action: ReducerAction) => {
      const newState = reducer(store, action);
      store = deepFreeze(newState);
    }
  };
}