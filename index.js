const express = require("express");
const { sendEmail } = require("./sendEmail");

const app = express();

app.get("/", sendEmail);

app.listen(5555, () => {
  console.log(`Server is running at port 5555`);
});
