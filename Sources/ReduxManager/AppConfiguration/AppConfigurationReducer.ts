import { ActionTypes } from "./AppConfigurationActionTypes";
import { AsyncStorage } from "react-native";
import { persistReducer } from "redux-persist";
import { AppConfiguration } from "Models";

type State = {
  appConfiguration?: AppConfiguration;
};

const initialState: State = {};

const appConfigurationReducer = (
  state: object = initialState,
  action: {
    type: keyof typeof ActionTypes;
    payload?: State;
  }
) => {
  switch (action.type) {
    case ActionTypes.SAVE_APP_CONFIGURATION:
      return { ...state, appConfiguration: action.payload };
    case ActionTypes.DELETE_APP_CONFIGURATION:
      return { ...state, appConfiguration: null };
    default:
      return state;
  }
};

const persistConfig = {
  key: "appConfiguration",
  storage: AsyncStorage,
  whitelist: ["appConfiguration"]
};

const reducer = persistReducer(persistConfig, appConfigurationReducer);

export default { initialState, reducer };
