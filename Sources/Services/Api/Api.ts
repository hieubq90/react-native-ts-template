import Network from "../Network/Network";
export type NetworkPromiseResponse<T> = Promise<T>;

function login<T>(email: string, password: string): NetworkPromiseResponse<T> {
  const body = { email, password };
  return new Promise((resolve, reject) => {
    Network.unAuthorizedRequest<T>("/app/api/login", "POST", body)
      .then(response => {
        console.log("response", response);
        const data = response.data;
        resolve(data);
      })
      .catch(error => {
        console.warn(error);
        reject("Login failed");
      });
  });
}

function extendToken<T>(token: string): NetworkPromiseResponse<T> {
  const body = { token };
  return new Promise((resolve, reject) => {
    Network.unAuthorizedRequest<T>("/app/api/login", "POST", body)
      .then(response => {
        console.log("response", response);
        const data = response.data;
        resolve(data);
      })
      .catch(error => {
        console.warn(error);
        reject("Login failed");
      });
  });
}

export default {
  login,
  extendToken
};
