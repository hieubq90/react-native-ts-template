import axios, { AxiosPromise } from "axios";
export const ERROR_CODE_SUCCESS = 200;
export const ERROR_CODE_NOT_FOUND = 404;
export const ERROR_CODE_INVALID_REQUEST = 422;
export const ERROR_CODE_SERVER = 500;

const BASE_URL = "http://203.162.76.14:8080";

class Network {
  private static instance = new Network();
  private token: string = "";
  constructor() {
    if (Network.instance) {
      throw new Error(
        "Error: Instantiation failed: Use Network.getInstance() instead of new."
      );
    }
    Network.instance = this;
  }
  public static getInstance(): Network {
    return Network.instance;
  }

  getBaseUrl(): string {
    return BASE_URL;
  }

  setToken(token: string) {
    this.token = token;
  }

  getToken(): string {
    return this.token;
  }

  unAuthorizedRequest<T>(
    url: string,
    method: "POST" | "GET" = "GET",
    data?: object,
    header?: object
  ): AxiosPromise<T> {
    const response: AxiosPromise<T> = axios({
      method: method,
      url: url,
      baseURL: BASE_URL,
      data: data,
      timeout: 10000,
      headers: {
        ...header,
        "Content-Type": "application/json"
      }
    });
    return response;
  }

  authorizedRequest<T>(
    url: string,
    method: "POST" | "GET" = "GET",
    data?: object,
    header?: object
  ): AxiosPromise<T> {
    const response: AxiosPromise<T> = axios({
      method: method,
      url: url,
      baseURL: BASE_URL,
      data: data,
      timeout: 10000,
      headers: {
        ...header,
        "Content-Type": "application/json",
        "X-Token": this.token
      }
    });
    return response;
  }
}

export default Network.getInstance();
