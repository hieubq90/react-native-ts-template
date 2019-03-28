import Api from "../Api/Api";
import Network from "../Network/Network";
import { UserToken } from "Models";
import { UserStorageActions, getStore } from "ReduxManager";

function logout(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const store = getStore();
    store.dispatch(UserStorageActions.deleteAll());
    resolve(true);
  });
}

function loginAndCreateSession(
  username: string,
  password: string
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const store = getStore();
    const data = {
      userToken: { token: "dummyToken" }
    };
    store.dispatch(UserStorageActions.saveAll(data));
    resolve(true);
  });
  // return new Promise((resolve, reject) => {
  //   Api.login<UserToken>(username, password)
  //     .then(response => {
  //       const { access_token, user_info } = response;
  //       const { email, mobi_app_level, name } = user_info[0];
  //       Network.setToken(access_token);

  //       Promise.all([Api.getListSecurity<ListSecurity>()])
  //         .then(value => {
  //           const userDatabase = {
  //             listSecurity: value[0]
  //           };

  //           const store = getStore();
  //           const data = {
  //             userToken: response,
  //             userDatabase
  //           };
  //           store.dispatch(UserStorageActions.saveAll(data));
  //           resolve(true);
  //         })
  //         .catch(error => {
  //           reject(false);
  //           console.warn({ error });
  //         });
  //     })
  //     .catch(error => {
  //       reject(false);
  //       console.warn({ error });
  //     });
  // });
}

function createSession(token?: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const store = getStore();
    const { userStorage } = store.getState();
    const { userToken } = userStorage;
    if (userToken) {
      const data = {
        userToken: {
          ...userToken,
          token
        }
      };
      store.dispatch(UserStorageActions.saveAll(data));
      resolve(true);
    } else {
      reject("Fail to create session");
    }
  });

  // return new Promise((resolve, reject) => {
  //   const store = getStore();
  //   const { userStorage } = store.getState();
  //   const { userToken } = userStorage;
  //   if (userToken) {
  //     const { access_token, user_info } = userToken;
  //     const { email, mobi_app_level, name } = user_info[0];
  //     Network.setToken(access_token);
  //     Promise.all([Api.getListSecurity<ListSecurity>()])
  //       .then(value => {
  //         const userDatabase = {
  //           facilitiesAll: value[0],
  //           facilitiesComming: value[1],
  //           facilitiesFavourite: value[2],
  //           homeFacilitiesComming: value[3],
  //           homeFacilitiesAvailabel: value[4]
  //         };
  //         store.dispatch(UserStorageActions.saveUserDatabase(userDatabase));
  //         resolve(true);
  //       })
  //       .catch(error => {
  //         console.warn({ error });
  //       });
  //   } else {
  //     reject("User not logged");
  //   }
  // });
}

export default {
  logout,
  loginAndCreateSession,
  createSession
};
