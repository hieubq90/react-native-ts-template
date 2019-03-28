import { combineReducers } from "redux";

import UserStorageReducer from "../UserStorage/UserStorageReducer";
import AppConfigurationReducer from "../AppConfiguration/AppConfigurationReducer";

export const initialState = {
  userStorage: UserStorageReducer.initialState,
  appConfiguration: AppConfigurationReducer.initialState
};

export const reducer = combineReducers({
  userStorage: UserStorageReducer.reducer,
  appConfiguration: AppConfigurationReducer.reducer
});
