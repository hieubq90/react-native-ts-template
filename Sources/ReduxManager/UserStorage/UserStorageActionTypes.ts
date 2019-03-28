import { Action } from "redux";

export interface IAction<T> extends Action {
  payload?: T;
}

export const ActionTypes = {
  SAVE_USER_TOKEN: "SAVE_USER_TOKEN",
  DELETE_USER_TOKEN: "DELETE_USER_TOKEN",
  SAVE_USER_PROFILE: "SAVE_USER_PROFILE",
  DELETE_USER_PROFILE: "DELETE_USER_PROFILE",
  SAVE_USER_DATABASE: "SAVE_USER_DATABASE",
  DELETE_USER_DATABASE: "DELETE_USER_DATABASE",
  SAVE_ALL: "SAVE_ALL",
  DELETE_ALL: "DELETE_ALL"
};
