const { google } = require("googleapis");

// Get mails which don't have any replies...
exports.getUnrepliedMail = async (auth) => {
  console.log(`Checking for Unreplied Emails...`);

  const gmail = google.gmail({ version: "v1", auth });
  const response = await gmail.users.messages.list({
    userId: "me",
    labelIds: ["INBOX"],
    q: "-in:chats -from:me -has:userlabels",
  });

  return response.data.messages || [];
};

// Add label functions
exports.addLabel = async (auth, message, labelId) => {
  const gmail = google.gmail({ version: "v1", auth });
  await gmail.users.messages.modify({
    userId: "me",
    id: message.id,
    requestBody: {
      addLabelIds: [labelId],
      removeLabelIds: ["INBOX"],
    },
  });
};

// Create label function
exports.createLabel = async (auth, labelName) => {
  console.log(`Adding Label to Email...`);

  const gmail = google.gmail({ version: "v1", auth });

  try {
    const response = await gmail.users.labels.create({
      userId: "me",
      requestBody: {
        name: labelName,
        labelListVisibility: "labelShow",
        messageListVisibility: "show",
      },
    });

    return response.data.id;
  } catch (error) {
    if (error.code === 409) {
      const response = await gmail.users.labels.list({
        userId: "me",
      });

      const label = response.data.labels.find(
        (label) => label.name === labelName
      );

      return label.id;
    } else {
      throw error;
    }
  }
};

// send response function
exports.sendReply = async (auth, message) => {
  console.log("sending reply...");

  const gmail = google.gmail({ version: "v1", auth });
  const res = await gmail.users.messages.get({
    userId: "me",
    id: message.id,
    format: "metadata",
    metadataHeaders: ["Subject", "From"],
  });

  const subject = res.data.payload.headers.find(
    (header) => header.name === "Subject"
  ).value;

  const from = res.data.payload.headers.find(
    (header) => header.name === "From"
  ).value;

  const replyTo = from.match(/<(.*)>/)[1];
  const replySubject = subject.startsWith("Re:") ? subject : `Re: ${subject}`;
  const replyBody = `Hi, \n\n I'm currently on a vacation and will get back to you soon. \n\n Regrads, \n Nishu Saini`;

  const rawMessage = [
    `From: me`,
    `To: ${replyTo}`,
    `Subject: ${replySubject}`,
    `In-Reply-To: ${message.id}`,
    `References: ${message.id}`,
    "",
    replyBody,
  ].join("\n");

  const encodeMessage = Buffer.from(rawMessage)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  await gmail.users.messages.send({
    userId: "me",
    requestBody: {
      raw: encodeMessage,
    },
  });
};
