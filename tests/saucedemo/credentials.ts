export type Credentials = {
  username: string;
  password: string;
};
export type Account = {
  firstName: string;
  lastName: string;
}

export type User = {
  credentials: Credentials;
  account: Account
}