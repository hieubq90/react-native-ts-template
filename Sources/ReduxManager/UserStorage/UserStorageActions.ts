import { Action } from "redux";
import { IAction, ActionTypes } from "./UserStorageActionTypes";

function saveUserToken<T>(userToken: T): IAction<T> {
  return {
    type: ActionTypes.SAVE_USER_TOKEN,
    payload: userToken
  };
}

function deleteUserToken(): Action {
  return { type: ActionTypes.DELETE_USER_TOKEN };
}

function saveUserProfile<T>(userProfile: T): IAction<T> {
  return {
    type: ActionTypes.SAVE_USER_PROFILE,
    payload: userProfile
  };
}

function deleteUserProfile(): Action {
  return { type: ActionTypes.DELETE_USER_PROFILE };
}

function saveUserDatabase<T>(userDatabase: T): IAction<T> {
  return { type: ActionTypes.SAVE_USER_DATABASE, payload: userDatabase };
}

function deleteUserDatabase(): Action {
  return { type: ActionTypes.DELETE_USER_DATABASE };
}

function deleteAll(): Action {
  return { type: ActionTypes.DELETE_ALL };
}

function saveAll<T>(data: T): IAction<T> {
  return {
    type: ActionTypes.SAVE_ALL,
    payload: data
  };
}

export default {
  saveUserToken,
  saveUserProfile,
  saveUserDatabase,
  deleteUserToken,
  deleteUserProfile,
  deleteUserDatabase,
  deleteAll,
  saveAll
};
