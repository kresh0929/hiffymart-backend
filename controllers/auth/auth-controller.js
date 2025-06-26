const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/user");

// ✅ REGISTER USER
const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return res.json({
        success: false,
        message: "User already exists with the same email! Please try again.",
      });
    }

    const hashPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      userName,
      email,
      password: hashPassword,
    });

    await newUser.save();

    res.status(200).json({
      success: true,
      message: "Registration successful",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred during registration.",
    });
  }
};

// ✅ LOGIN USER
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const checkUser = await User.findOne({ email });
    if (!checkUser) {
      return res.json({
        success: false,
        message: "User doesn't exist! Please register first.",
      });
    }

    const checkPasswordMatch = await bcrypt.compare(password, checkUser.password);
    if (!checkPasswordMatch) {
      return res.json({
        success: false,
        message: "Incorrect password! Please try again.",
      });
    }

    const token = jwt.sign(
      {
        id: checkUser._id,
        role: checkUser.role,
        email: checkUser.email,
        userName: checkUser.userName,
      },
      "CLIENT_SECRET_KEY",
      { expiresIn: "60m" }
    );

    // ✅ Set cookie for cross-origin
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,       // ✅ must be true on HTTPS (like Render)
      sameSite: "None",   // ✅ required for cross-origin cookies
    });

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token,
      user: {
        email: checkUser.email,
        role: checkUser.role,
        id: checkUser._id,
        userName: checkUser.userName,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred during login.",
    });
  }
};

// ✅ LOGOUT USER
const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,       // ✅ must match login
    sameSite: "None",   // ✅ must match login
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully!",
  });
};

// ✅ AUTH MIDDLEWARE
const authMiddleware = async (req, res, next) => {
  console.log("🍪 Incoming Cookies:", req.cookies); // Debug

  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized user!",
    });
  }

  try {
    const decoded = jwt.verify(token, "CLIENT_SECRET_KEY");
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized user!",
    });
  }
};

module.exports = { registerUser, loginUser, logoutUser, authMiddleware };
