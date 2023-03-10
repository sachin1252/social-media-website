// // i this create login ,logout
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { error, success } = require("../utilss/responseWrapper");

const signupController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password || !name) {
      //return res.status(400).send("All fiels required");
      return res.send(error(400, "all fields are required"));
    }
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      //return res.status(409).send("User is already present");
      return res.send(error(409, "user is already present"));
    }

    const hassPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hassPassword,
    });

    // return res.status(201).json({
    //   user,
    // });
    return res.send(success(201, "user created successfully"));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      //return res.status(400).send("All fiels required");
      return res.send(error(400, "all fields are required"));
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      //return res.status(404).send("User is not present");
      return res.send(error(404, "user s not present"));
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      //return res.status(403).send("incorrect password");
      return res.send(error(403, "incorrect password"));
    }

    const accessToken = generateAccessToken({
      _id: user._id,
    });
    const refreshToken = generateRefreshToken({
      _id: user._id,
    });

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
    });
    //return res.json({ accessToken })
    //return res.json({ accessToken, refreshToken });
    return res.send(success(200, { accessToken }));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

// // this api will check the refreshtoken validity and generate the new access token use in front end

const refreshAccessTokenGenerator = async (req, res) => {
  //const { refreshToken } = req.body;
  const cookies = req.cookies;
  if (!cookies.jwt) {
    //return res.status(401).send("refresh token in cookie is required");
    return res.send(error(401, "refresh token in cookie is required"));
  }
  const refreshToken = cookies.jwt;
  console.log("refresh", refreshToken);

  // if (!refreshToken) {
  // return res.status(401).send("refresh token is required");
  // }
  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.Refresh_TOKEN_PRIVATE_KEY
    );
    const _id = decoded._id;
    const accessToken = generateAccessToken({ _id });
    //return res.status(201).json({accessToken});
    return res.send(success(201, { accessToken }));
  } catch (e) {
    console.log(e);
    //return res.status(401).send("invallid refresh token");
    return res.send(error(401, "invallid refresh token"));
  }
};
const logoutController = async (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
    });
    return res.send(success(200, "user logged out"));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

// // internal function can not be export
const generateAccessToken = (data) => {
  try {
    const token = jwt.sign(data, process.env.ACCESS_TOKEN_PRIVATE_KEY, {
      expiresIn: "1d",
    });
    console.log(token);
    return token;
  } catch (error) {
    console.log(error);
  }
};
const generateRefreshToken = (data) => {
  try {
    const token = jwt.sign(data, process.env.REFRESH_TOKEN_PRIVATE_KEY, {
      expiresIn: "1y",
    });
    console.log(token);
    return token;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  signupController,
  loginController,
  refreshAccessTokenGenerator,
  logoutController,
};

// // send to routers folder
