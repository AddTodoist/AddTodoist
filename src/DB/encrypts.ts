import jwt from "jsonwebtoken";

type User = {
  twitterId: string;
  apiToken: string;
  projectId: number;
};

export const encodeUser = (user: User) =>
  jwt.sign(user, "secret", { noTimestamp: true });

export const decodeUser = (encodedUser: string) =>
  jwt.verify(encodedUser, "secret");
