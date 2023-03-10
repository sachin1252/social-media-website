const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { error } = require("../utilss/responseWrapper");

module.exports = async (req, res, next) => {
  if (
    !req.headers ||
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer")
  ) {
    //return res.status(401).send("authorization  header is required");
    return res.send(error(401, "authorization header is required"));
  }
  const accessToken = req.headers.authorization.split(" ")[1];
  try {
    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_PRIVATE_KEY
    );
    req._id = decoded._id;

    const user = await User.findById(req._id);
    if (!user) {
      return res.send(error(404, "User not found"));
    }

    next();
  } catch (e) {
    console.log(e);
    //return res.status(401).send("invallid access key");
    return res.send(error(401, "ivallid access key"));
  }
};
