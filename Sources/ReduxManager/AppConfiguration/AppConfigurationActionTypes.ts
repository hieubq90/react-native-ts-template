import { Action } from "redux";

export interface IAction<T> extends Action {
  payload?: T;
}

export const ActionTypes = {
  SAVE_APP_CONFIGURATION: "SAVE_APP_CONFIGURATION",
  DELETE_APP_CONFIGURATION: "DELETE_APP_CONFIGURATION"
};
