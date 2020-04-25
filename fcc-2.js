const express = require("express");
const os = require("os");
const app = express();

require("dotenv").config();

const PORT = process.env.PORT || 3000;
const nwInterface = os.networkInterfaces();
let ip = "";

if (nwInterface.hasOwnProperty("eth0")) {
  ip = nwInterface.eth0[0].address;
} else if (nwInterface.hasOwnProperty("Loopback Pseudo-Interface 1")) {
  ip = nwInterface["Loopback Pseudo-Interface 1"][1].address;
}
app.set("trust proxy", true);
app.get("/api/whoami", (req, res) => {
  //   console.log(nwInterface);
  res.json({
    ipaddress: ip,
    language: req.headers["accept-language"],
    software: req.headers["user-agent"],
  });
});

app.listen(PORT, () => {
  console.log("Server Started Successfully");
});
