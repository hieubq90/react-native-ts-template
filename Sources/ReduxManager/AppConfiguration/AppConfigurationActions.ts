import { Action } from "redux";
import { ActionTypes, IAction } from "./AppConfigurationActionTypes";

function saveAppConfiguration<T>(appConfiguration: T): IAction<T> {
  return {
    type: ActionTypes.SAVE_APP_CONFIGURATION,
    payload: appConfiguration
  };
}

function deleteAppConfiguration(): Action {
  return { type: ActionTypes.DELETE_APP_CONFIGURATION };
}

export default {
  saveAppConfiguration,
  deleteAppConfiguration
};
