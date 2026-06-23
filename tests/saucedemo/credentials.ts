export type Credentials = {
  username: string;
  password: string;
};
export type Account = {
  firstName: string;
  lastName: string;
  zipCode: string;
}

export type User = {
  credentials: Credentials;
  account: Account;
}