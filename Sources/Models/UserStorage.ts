export type UserProfile = {
  name: string;
};

export type UserDatabase = {
  data: any;
};

export type UserToken = {
  access_token: string;
  user_info: Array<{
    mobi_app_level: string;
    name: string;
    email: string;
  }>;
  message: string;
  errors: string;
};
