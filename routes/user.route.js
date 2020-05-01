const router = require("express").Router();
const { v4: uuidv4 } = require("uuid");
let User = require("../models/user");

const findUserByName = (name, callback) => {
  User.find({ name: name }, (err, res) => {
    callback(err, res);
  });
};

router.route("/new-user").post((req, res) => {
  const name = req.body.uid;
  const _id = uuidv4();

  findUserByName(name, (error, response) => {
    if (error) console.log(error);
    else {
      if (response.length == 0) {
        const newUser = new User({ name, _id });
        newUser
          .save()
          .then(res.json({ username: name, _id: _id }))
          .catch((err) => res.status(404).json("Error" + err));
      } else {
        res.json({ info: "user-exists" });
      }
    }
  });
});

module.exports = router;
