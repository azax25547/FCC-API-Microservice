const router = require("express").Router();
let Exercise = require("../models/exercise");
let User = require("../models/user");

const findUserById = (id, callback) => {
  User.find({ _id: id }, (err, res) => {
    callback(err, res);
  });
};


const getLogs = (res) => {
  const items = res.map(({ description, duration, date }) => ({
    description,
    duration,
    date: new Date(date).toDateString()
  }))
  return items
}


router.route("/add").post(async (req, res) => {
  let { uid, description, duration, date } = req.body;
  const user = await User.find({ _id: uid });
  if (user.length == 0)
    res.json("User doesn't exist")

  try {
    if (!date || date == "")
      date = new Date().toDateString();

    let exerciseData = {
      username: user[0].name,
      description,
      duration: parseInt(duration),
      _id: uid,
      date,
    };

    const newExercise = await Exercise({
      uid,
      description,
      duration,
      date: new Date(date).toDateString(),
    }).save();
    res.json(exerciseData)
  } catch (err) {
    res.json("Input a Valid Date Format")
  }


});

router.route("/log/").get(async (req, res) => {
  const userid = req.query.userId;
  const limit = parseInt(req.query.limit);
  let from = req.query.from;
  let to = req.query.to;
  let userData = {}

  const user = await User.find({ _id: userid })
  userData.username = user[0].name
  userData._id = user[0].id

  let exercises = await Exercise.find({ uid: userid })

  if (from && to) {
    from = from.split('-')
    to = to.split('-')
    exercises = await Exercise.find({ uid: userid, date: { $gte: new Date(from[0], from[1], from[2]), $lte: new Date(to[0], to[1], to[2]) } })
  }

  if (limit)
    exercises = exercises.slice(0, limit)

  userData.log = getLogs(exercises)
  userData.count = userData.log.length

  res.json(userData)
});


router.route("/users").get(async (req, res) => {
  try {
    const users = await User.find()
    // console.log(users)
    res.json(users)
  } catch (err) {
    console.log(err);
  }
})

module.exports = router;
