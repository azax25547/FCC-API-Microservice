const router = require("express").Router();
// const { v4: uuidv4 } = require("uuid");
let Exercise = require("../models/exercise");
let User = require("../models/user");

const findUserById = (id, callback) => {
  User.find({ _id: id }, (err, res) => {
    callback(err, res);
  });
};

const findExerciseById = (uid, callback) => {
  Exercise.find({ uid: uid }, (err, res) => {
    callback(err, res);
  });
};

// const findExerciseFromDate = (from) => {
//   return Exercise.find({ date: { $gte: new Date(from) } });
// };

router.route("/add").post((req, res) => {
  const { uid, description, duration, date } = req.body;
  findUserById(uid, (error, response) => {
    if (error) console.log(error);
    // console.log(response);
    if (response.length > 0) {
      let exerciseData = {
        username: response[0].name,
        description,
        duration: parseInt(duration),
        _id: uid,
        date: new Date(date).toDateString(),
      };
      const newExercise = Exercise({
        uid,
        description,
        duration,
        date: new Date(date).toDateString(),
      });
      newExercise
        .save()
        .then(res.json(exerciseData))
        .catch((er) => console.log(er));
    } else {
      res.json("User does't exist");
    }
  });
});

router.route("/log/").get((req, res) => {
  const userid = req.query.userId;
  const limit = parseInt(req.query.limit);
  //   const from = req.query.from;
  //   const to = req.query.to;

  findExerciseById(userid, (error, response) => {
    if (error) console.log(error);
    if (response.length == 0) {
      res.json("User is not registered or not did any exercise");
    } else {
      findUserById(userid, (er, ress) => {
        if (er) console.log(er);
        if (limit) {
          response = response.slice(0, limit);
        }
        let userData = { count: 0, logs: [] };
        userData._id = ress.slice(0).pop()._id;
        userData.username = ress.slice(0).pop().name;
        userData.count = response.length;
        userData.logs = response;
        res.json(userData);
      });
      //   res.json(response);
    }
  });
});

module.exports = router;
