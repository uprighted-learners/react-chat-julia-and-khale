const router = require("express").Router();
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//- [ ] Create user endpoint
router.post("/register", async (req, res) => {
    try {
      const { firstname, lastname, email, password, isAdmin } = req.body;
      const user = new User({
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: bcrypt.hashSync(password, 10),
        isAdmin: isAdmin,
});
      const newUser = await user.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: 7 * 24 * 60 * 60,
      });  
      res.json({
        message: "register endpoint",
        user: newUser,
        token: token,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
//- [ ] Login user endpoint 
router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const user = await User.findOne({ email: email });

      if (!user) {
        throw new Error("User does not exist");
      }

      const isPasswordAMatch = await bcrypt.compare(password, user.password);
      if (isPasswordAMatch === false) {
        throw new Error("Passwords do not match");
      }
  
      let token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: 7 * 24 * 60 * 60,
      });
      res.json({
        message: "signin endpoint",
        user: user,
        token: token,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});

module.exports = router;
