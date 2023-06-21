const databaseConection = require("../db");
const HandleError = require("./handleError");
const Security = require("../services/securityProvider");
const security = new Security();
const CryptoJS = require("crypto-js");

async function getUsers() {
  const db = await databaseConection.GetConection();

  const users = await db.collection("Users").find({}).toArray();

  return users;
}

async function createUser(name, phone, email, password) {
  const db = await databaseConection.GetConection();

  const doesEmailExist = await db.collection("Users").findOne({
    email: email,
  });

  if (doesEmailExist) {
    throw new CreateUserException(CreateUserException.emailAlreadyInUser);
  }

  const newUser = {
    name: name,
    phone: phone,
    email: email,
    password: security.encryptData(password),
  };

  const createdUser = await db.collection("Users").insertOne(newUser);

  return createdUser;
}

async function loginByEmail(email, password) {
  let db = await databaseConection.GetConection();

  const user = await db.collection("Users").findOne({
    email: email,
  });
  if (user == null) {
    throw new LoginByEmailException(LoginByEmailException.errorIncorrectEmail);
  }
  const bytes = security.decryptData(user.password);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);

  if (originalText != password) {
    throw new LoginByEmailException(
      LoginByEmailException.errorIncorrectPassword
    );
  }

  return user;
}

class GetUsersException extends HandleError {
  static errorDataBase = "ERROR_DATABASE";
  constructor(code){
    super("Get users list", code);
  }
}

class LoginByEmailException extends HandleError {
  static errorIncorrectPassword = "INCORRECT_PASSWORD";
  static errorIncorrectEmail = "UNKNOWN_EMAIL";
  //Por seguridad es correcto?
  constructor(code) {
    super("Login By Email", code);
  }
}

class CreateUserException extends HandleError {
  static emailAlreadyInUser = "EMAIL_ALREADY_IN_USER";

  constructor(code) {
    super("Create User ", code);
  }
}

module.exports = {
  createUser,
  loginByEmail,
  getUsers,
  LoginByEmailException,
  CreateUserException,
  GetUsersException
};
