const { authenticate } = require("@google-cloud/local-auth");
const path = require("path");
const {
  createLabel,
  getUnrepliedMail,
  sendReply,
  addLabel,
} = require("./utils");

exports.sendEmail = async (req, res) => {
  const SCOPES = [
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/gmail.send",
    "https://www.googleapis.com/auth/gmail.labels",
    "https://mail.google.com/",
  ];

  const labelName = "Vacation-Mails";

  // Authenticate google account
  const auth = await authenticate({
    keyfilePath: path.join(__dirname, "credentials.json"),
    scopes: SCOPES,
  });

  const labelId = await createLabel(auth, labelName);
  console.log(`Label has been created ${labelId}`);

  // check for mails in every 45 to 120 seconds
  const main = async () => {
    try {
      const messages = await getUnrepliedMail(auth);

      console.log(`Found ${messages.length} unreplied messages`);

      for (const message of messages) {
        await sendReply(auth, message);
        console.log(`Sent reply to message with id ${message.id}`);

        await addLabel(auth, message, labelId);
        console.log(`Added label to message with id ${message.id}`);
      }
    } catch (error) {
      throw error;
    }
  };

  checkTime = () => {
    return Math.floor(Math.random() * (120 - 45 + 1) + 45) * 1000;
  };

  setInterval(main, checkTime());

  res.status(200).send("Email Responder is runninng...");
};
