const express = require("express");
const {
  createUser,
  CreateUserException,
  getUsers,
  loginByEmail,
  LoginByEmailException,
  GetUsersException
} = require("../controllers/userController");
const usersRouter = express.Router();

usersRouter.get("/", async (request, response) => {
  let response_users = null;
  let response_result = null;

  try {
    response_users = await getUsers();
    response_result = GetUsersException.success;
  } catch (error) {
    console.log(error.message);
    if (error.code != null) {
      response_result = error.code;
    } else {
      response_result = GetUsersException.unknownError;
    }
  }

  response.json({
    result: response_result,
    users: response_users,
  });
});

usersRouter.post("/", async (request, response) => {
  const name = request.body.name;
  const phone = request.body.phone;
  const email = request.body.email;
  const password = request.body.password;

  let response_user = null;
  let response_result = null;

  if (!name || !email || !password) {
    response_result = CreateUserException.incorrectParameters;
  } else {
    try {
      response_user = await createUser(name, phone, email, password);

      response_result = CreateUserException.success;
    } catch (error) {
      console.log("errorrrr", error);
      if (error.code != null) {
        response_result = error.code;
      } else {
        response_result = CreateUserException.unknownError;
      }
    }
  }

  response.json({
    user: response_user,
    result: response_result,
  });
});

usersRouter.post("/login", async (request, response) => {
  let email = request.body.email;
  let password = request.body.password;

  let response_user = null;
  let response_result = null;
  if (email == null || password == null) {
    response_result = LoginByEmailException.incorrectParameters;
  } else {
    try {
      response_user = await loginByEmail(email, password);

      response_result = LoginByEmailException.success;
    } catch (error) {
      console.log(error.message);
      if (error.code != null) {
        response_result = error.code;
      } else {
        response_result = LoginByEmailException.unknownError;
      }
    }
  }
  response.json({
    user: response_user,
    result: response_result,
  });
});
module.exports = usersRouter;
