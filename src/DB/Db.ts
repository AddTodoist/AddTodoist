import jwt from "jsonwebtoken";

type User = {
  twitterId: string;
  apiToken: string;
  projectId: string;
};

const encodeUser = (user: User) =>
  jwt.sign(user, "secret", { noTimestamp: true });

const decodeUser = (encodedUser: string) => jwt.verify(encodedUser, "secret");

let DB = {};

const user = {
  twitterId: "12456789",
  apiToken: "1234567895131845154654skdjfkljs_dasdasda",
  projectId: "123458756464",
};

const encodedUser = encodeUser(user);

DB["12456789"] = encodedUser;

console.log(DB);

console.log(decodeUser(DB["12456789"]));
