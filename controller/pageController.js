const users = require("../models/users");

exports.getAboutPage = (req, res) => {
  res.render("about");
};

exports.getAddPage = (req, res) => {
  res.render("add");
};

exports.getEditPage = async (req, res) => {

};