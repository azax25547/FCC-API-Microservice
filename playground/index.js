const express = require("express");
require("dotenv").config();
const path = require("path");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");
// const mongodb = require("mongodb");

const app = express();

const PORT = 3000 || process.env.port;
// const absolutePath = path.join(__dirname, "/static/");

// app.use(express.static(absolutePath));

app.set("view engine", "hbs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Learn = require("./models/schema");
let appState = [];

const getDetailsFromDB = (done) => {
  Learn.find((err, res) => {
    done(err, res);
  });
};

const getDeatailFromDB = (name, done) => {
  Learn.findOne({ firstname: name }, (err, res) => {
    if (err) console.log(err);
    done(res);
  });
};

const getDetailById = (id, done) => {
  Learn.findById(id, (err, res) => {
    if (err) console.log(err);
    done(res);
  });
};

const findOneAndUpdate = (query, data, done) => {
  Learn.findOneAndUpdate(query, data, { new: true }, (err, res) => {
    if (err) console.log(err);
    done(res);
  });
};

app.get("/name", (req, response) => {
  //   res.sendFile(absolutePath);
  getDetailsFromDB((err, res) => {
    response.render("names", { res });
  });
});

// app.get("/name/:name", (req, res) => {
//   getDeatailFromDB(req.params.name, (response) => {
//     res.json(response);
//   });
// });

// app.get("/name/:id", (req, res) => {
//   getDetailById(req.params.id, (response) => {
//     // console.log(response);
//     res.json(response);
//   });
// });

app.get("/name/update/", (req, res) => {
  // getDetailById(req.query.id,(err,res) => {
  //   if(err) console.log(err);
  //   console.log(res)
  // })
  findOneAndUpdate(
    { _id: req.query.id },
    { firstname: req.query.firstname, lastname: req.query.lastname },
    (response) => {
      res.json(response);
    }
  );
});

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/create", (req, res) => {
  res.send("Data Created");
  Learn.create([
    { firstname: "Sadashiv", lastname: "pradhan" },
    { firstname: "Saikrishna", lastname: "Dora" },
  ])
    .then(() => {
      console.log("Data Created");
    })
    .catch((err) => console.log(err));
});

app.get("/json", (req, res, next) => {
  //   console.log(process.env.MESSAGE_STYLE);
  console.log(`${req.method} ${req.path} - ${req.ip}`);
  next();
});

/**
 * Middleware Chaining
 */
app.get(
  "/now",
  (req, res, next) => {
    req.time = new Date().toString();
    next();
  },
  (req, res) => {
    res.json({ time: req.time });
  }
);

/**
 * Req param
 */

app.get("/:word/echo", (req, res) => {
  res.json({ echo: req.params.word });
});

/**
 * Query Params
 */

app.get("/name", (req, res) => {
  res.json({ name: `${req.query.firstname} ${req.query.lastname}` });
});

/**
 * POST Requestes
 */
app.post("/", (req, res) => {
  let { firstname, lastname } = req.body;
  // console.log(firstname + " " + lastname);
  const document = new Learn({ firstname, lastname });
  document.save().then((res) => {
    console.log("File Saved in the Database");
    console.log(res);
  });
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log("Server is Running");
});

// console.log(process.env);
