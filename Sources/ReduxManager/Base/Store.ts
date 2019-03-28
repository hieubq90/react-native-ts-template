import { createStore, applyMiddleware, Store } from "redux";
import { persistStore } from "redux-persist";
import { middlewares } from "./Middleware";
import { initialState, reducer } from "./Reducer";

export type StoreState = typeof initialState;

const store = createStore(
  reducer,
  { appConfiguration: undefined, userStorage: undefined },
  applyMiddleware(...middlewares)
);

export const configStore = () => {
  const persistor = persistStore(store);
  return { store, persistor };
};

export function getStore(): Store<StoreState> {
  // @ts-ignore
  return store;
}
