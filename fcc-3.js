//dev dependencies
const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");

//db dependencies
const Url = require("./models/url");

//node dependencies
const dns = require("dns");
const path = require("path");

//initialize express
const app = express();

//require dotenv to get env variables
require("dotenv").config();

//express middlewares
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

const absolutepath = path.join(__dirname, "/static");
app.use(express.static(absolutepath));

//MongoDB Connection
mongoose.connect(process.env.MONGO_URL_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//PORT
const PORT = process.env.PORT || 3000;

//Functions
const checkDNS = (url, cb) => {
  dns.lookup(url, (err, address) => {
    cb(err, address);
  });
};

const getURLDetailByOUrl = (ourl, cb) => {
  Url.find({ original_url: ourl }, (err, res) => {
    cb(err, res);
  });
};

const getURLDetailBySUrl = (surl, cb) => {
  Url.find({ short_url: surl }, (err, res) => {
    cb(err, res);
  });
};

const getAllData = (cb) => {
  Url.find((err, res) => {
    cb(res);
  });
};

const saveData = (urlData) => {
  Url.create(urlData)
    .then(() => {
      console.log("Data Created");
    })
    .catch((err) => console.log(err));
};

//Routes

app.post("/api/shorturl/new", (req, response) => {
  const { url } = req.body;
  checkDNS(url, (dnserr) => {
    if (dnserr) response.json({ error: "invalid URL" });
    else {
      let urlData = {
        original_url: url,
        short_url: 1,
      };

      getURLDetailByOUrl(urlData.original_url, (error, res) => {
        if (error) console.log(error);
        else {
          if (res.length == 0) {
            getAllData((data) => {
              if (data.length == 0) {
                saveData(urlData);
              }
              let surl = data.slice(-1).pop().short_url + 1;
              urlData = { ...urlData, short_url: surl };
              saveData(urlData);
              response.json(urlData);
            });
          } else {
            getURLDetailByOUrl(urlData.original_url, (errors, alldata) => {
              if (errors) console.log(errors);
              else {
                let newData = alldata.slice(0).pop();
                response.json({
                  original_url: newData.original_url,
                  short_url: newData.short_url,
                });
              }
            });
          }
        }
      });
    }
  });
});

app.get("/api/shorturl/:id", (request, response) => {
  getURLDetailBySUrl(request.params.id, (err, res) => {
    if (err) console.log(err);
    else {
      let original_url = res.slice(0).pop().original_url;
      response.redirect("https://" + original_url);
    }
  });
});

//Listening Port
app.listen(PORT, () => {
  console.log("Server Started Successfully");
});
