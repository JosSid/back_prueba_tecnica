const databaseConection = require("../../db");
const Security = require("../../services/securityProvider");
const security = new Security();
const CryptoJS = require("crypto-js");
const { ObjectId } = require("mongodb");
const jwt = require('jsonwebtoken');
const {
    GetUserByIdException,
    CreateUserException,
    UpdateUserException,
    DeleteUserException,
    LoginByEmailException
} = require('./userHandleError');

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

async function createUser(user) {

  const { phone, email } = user;

  const validEmail = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;

  const validPhone = /^\d{9}$/;

  if(!validEmail.test(email)){
    throw new CreateUserException(CreateUserException.errorInvalidEmail)
  }

  if(!validPhone.test(phone)) {
    throw new CreateUserException(CreateUserException.errorInvalidPhone)
  }

  const db = await databaseConection.GetConection();

  const doesEmailExist = await db.collection("Users").findOne({
    email: email,
  });

  if (doesEmailExist) {
    throw new CreateUserException(CreateUserException.emailAlreadyInUser);
  }

  const createdUser = await db.collection("Users").insertOne(user);

  return createdUser;
}

async function updateUser(id, body) {

  const user = await getUserById(id);
  
  const {name, email, phone, password} = body;

  const validEmail = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;

  const validPhone = /^\d{9}$/;

  if(email && !validEmail.test(email)){
    throw new UpdateUserException(UpdateUserException.errorInvalidEmail)
  }

  if(phone && !validPhone.test(phone)) {
    throw new CreateUserException(CreateUserException.errorInvalidPhone)
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
  objectUpdater.updatedAt = new Date().toUTCString();

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
    throw new LoginByEmailException(LoginByEmailException.errorIncorrectCredentials);
  }
  const bytes = security.decryptData(user.password);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);

  if (originalText != password) {
    throw new LoginByEmailException(
      LoginByEmailException.errorIncorrectCredentials
    );
  }

  const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {
    expiresIn: "1d"
  });

  return token;
}

module.exports = {
  createUser,
  loginByEmail,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
