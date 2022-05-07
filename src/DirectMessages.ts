import { sendDirectMessage } from "./TWAPI.js";
//import Client from "todoist-rest-client";

type TWDirectMessage = {
  target: Object;
  sender_id: string;
  message_data: {
    text: string;
    entities: Object;
  };
};

const VALID_COMMANDS = [
  //"/help",
  "/init",
  "/project",
  //"/getconfig",
  //"/deleteall",
];

export const directMessageRecieved = (event) => {
  return (
    event.direct_message_events &&
    event.for_user_id === "1522266105271701505" &&
    event.direct_message_events[0].type === "message_create"
  );
};

export const handleDirectMessage = async (message: TWDirectMessage) => {
  const { text, entities } = message.message_data;
  const command = text.split(" ")[0];
  if (!VALID_COMMANDS.includes(command)) return;

  switch (command) {
    case "/init":
      return await sendDirectMessage(
        message.sender_id,
        initText(message.sender_id)
      );
    case "/project":
      return console.log("Successs!!");
  }
};

// const handleToken = async (message: TWDirectMessage) => {
//   const { text, entities } = message.message_data;
//   const token = text.split(" ")[1];
//   if (!token)
//     return await sendDirectMessage(
//       message.sender_id,
//       "🔴 No token was provided 🔴"
//     );

//   let projects;
//   try {
//     const todoistClient = Client(token);
//     projects = await todoistClient.project.getAll();
//     projects;
//   } catch {
//     return await sendDirectMessage(message.sender_id, "🔴 Invalid token 🔴");
//   }
//   createUser(
//     message.sender_id,
//     token,
//     projects.find((p) => p?.inbox_project === true).id
//   );

//   const projectsString = projects
//     .map((project, index) => `${index} - ${project.name}`)
//     .join("\n");

//   return await sendDirectMessage(
//     message.sender_id,
//     projectConfigHeader + projectsString + projectConfigFooter
//   );
// };

// const handleProject = async (message: TWDirectMessage) => {
//   console.log(DB);
//   const { text, entities } = message.message_data;
//   const projectNum = text.split(" ")[1];
//   const surenum = +projectNum;
//   if (isNaN(surenum))
//     return await sendDirectMessage(
//       message.sender_id,
//       "🔴 Invalid project number 🔴"
//     );

//   const user = DB.find((user) => user.id === message.sender_id);

//   const todoistClient = Client(user?.token);
//   const projects = await todoistClient.project.getAll();
//   if (surenum > projects.length)
//     return await sendDirectMessage(
//       message.sender_id,
//       "🔴 Invalid project number 🔴"
//     );

//   const project = projects[surenum];

//   const dbUserIndex = DB.findIndex((user) => user.id === message.sender_id);
//   DB[dbUserIndex]["projectId"] = project.id;

//   return await sendDirectMessage(
//     message.sender_id,
//     `🔴 Now the tweets will be saved to: ${project.name} 🔴`
//   );
// };

export const getMessage = (event): TWDirectMessage =>
  event.direct_message_events[0].message_create;

const initText = (userId) => `
🔴 Hi there! 🔴\n\
I'm SaveToTodoist bot and I'm here to help you save tweets and threads to your Todoist account.\n\
\nFirst of all, you must cofigure me for making me able to access your account.\n\n\
👉Follow this steps👈\n\
1. Go to https://todoist.com/oauth/authorize?client_id=${process.env.TODOIST_CLIENT_ID}&scope=data:read_write&state=${userId} and get your todoist account token\n\
2. Grant app permissions:\n\
3. When you are done I will come back to set up your projects cofiguration.`;

const DB = [{ id: "1", token: "test", projectId: 1234 }];

const createUser = (id, token, projectId) => {
  DB.push({ id, token, projectId });
};
