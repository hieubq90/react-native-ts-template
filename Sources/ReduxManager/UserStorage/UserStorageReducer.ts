import { ActionTypes } from "./UserStorageActionTypes";
import { AsyncStorage } from "react-native";
import { persistReducer } from "redux-persist";
import { UserToken, UserProfile, UserDatabase } from "Models";
import { Action } from "redux";

type State = {
  userToken?: UserToken;
  userProfle?: UserProfile;
  userDatabase?: UserDatabase;
};

const initialState: State = {};

const userStorageReducer = (
  state: object = initialState,
  action: {
    type: keyof typeof ActionTypes;
    payload?: State;
  }
) => {
  switch (action.type) {
    case ActionTypes.SAVE_USER_TOKEN:
      return { ...state, userToken: action.payload };
    case ActionTypes.DELETE_USER_TOKEN:
      return { ...state, userToken: null, userProfile: null };
    case ActionTypes.SAVE_USER_PROFILE:
      return { ...state, userProfile: action.payload };
    case ActionTypes.DELETE_USER_PROFILE:
      return { ...state, userProfile: null };
    case ActionTypes.SAVE_USER_DATABASE:
      return { ...state, userDatabase: action.payload };
    case ActionTypes.DELETE_USER_DATABASE:
      return { ...state, userDatabase: null };
    case ActionTypes.DELETE_ALL:
      return {
        userDatabase: null,
        userProfile: null,
        userToken: null
      };
    case ActionTypes.SAVE_ALL:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

const persistConfig = {
  key: "userStorage",
  storage: AsyncStorage,
  blacklist: ["userDatabase"],
  whitelist: ["userToken", "userProfile"]
};

const reducer = persistReducer(persistConfig, userStorageReducer);

export default { initialState, reducer };
