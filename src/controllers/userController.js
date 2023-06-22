const databaseConection = require("../db");
const HandleError = require("./handleError");
const Security = require("../services/securityProvider");
const security = new Security();
const CryptoJS = require("crypto-js");
const { ObjectId } = require("mongodb");
const jwt = require('jsonwebtoken');

async function getUsers() {
  const db = await databaseConection.GetConection();

  const users = await db.collection("Users").find({}).toArray();

  return users;
}

async function getUserById(id) {
  const db = await databaseConection.GetConection();

  if (!ObjectId.isValid(id)) {
    throw new GetUserByIdException(GetUserByIdException.errorInvalidFormatId);
  }

  const user = await db.collection("Users").findOne({_id: new ObjectId(id)});

  return user;
}

async function createUser(name, phone, email, password) {

  const validEmail = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;

  if(!validEmail.test(email)){
    throw new CreateUserException(CreateUserException.errorInvalidEmail)
  }

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

async function updateUser(id, body) {

  const user = await getUserById(id);
  
  const {name, email, phone, password} = body;

  const validEmail = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;

  if(!validEmail.test(email)){
    throw new UpdateUserException(UpdateUserException.errorInvalidEmail)
  }

  const db = await databaseConection.GetConection();

  const doesEmailExist = await db.collection("Users").findOne({email: email});

  if (doesEmailExist && doesEmailExist._id.toString() !== new ObjectId(id).toString()){
    throw new UpdateUserException(UpdateUserException.emailAlreadyInUser);
  }

  const objectUpdater = {};

  name ? objectUpdater.name = name : objectUpdater;
  email ? objectUpdater.email = email : objectUpdater;
  phone ? objectUpdater.phone = phone : objectUpdater;
  password ? objectUpdater.password = security.encryptData(password) : objectUpdater;

  const updatedUser = await db.collection("Users").updateOne({_id: user._id},{$set : objectUpdater});

  return updatedUser
}

async function deleteUser(id) {

  if (!ObjectId.isValid(id)) {
    throw new DeleteUserException(DeleteUserException.errorInvalidFormatId);
  }

  const db = await databaseConection.GetConection();

  const deletedUser = await db.collection("Users").deleteOne({_id: new ObjectId(id)});

  return deletedUser;

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

  const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {
    expiresIn: "1d"
  });

  return token;
}

class GetUsersException extends HandleError {
  static errorDataBase = "ERROR_DATABASE";

  constructor(code){
    super("Get users list", code);
  }
}

class GetUserByIdException extends HandleError {
  static userNotFound = "USER_NOT_FOUND";
  
  constructor(code) {
    super("Get user by id", code);
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

  constructor(code) {
    super("Create User ", code);
  }
}

class UpdateUserException extends HandleError {

  constructor(code) {
    super("Update User ", code);
  }
}

class DeleteUserException extends HandleError {

  constructor(code) {
    super("Delete User ", code);
  }
  
}

module.exports = {
  createUser,
  loginByEmail,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  LoginByEmailException,
  CreateUserException,
  GetUsersException,
  GetUserByIdException,
  UpdateUserException,
  DeleteUserException
};
