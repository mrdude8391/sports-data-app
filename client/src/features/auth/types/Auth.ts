export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = LoginPayload & {
  username: string;
};

export type User = {
  id: string;
  username: string;
  email: string;
  token: string;
};
