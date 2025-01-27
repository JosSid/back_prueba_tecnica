const express = require('express');
const {
  createUser,
  getUsers,
  deleteUser,
  updateUser,
  loginByEmail,
  getUserById,
} = require('./userService');

const {
  CreateUserException,
  LoginByEmailException,
  GetUsersException,
  GetUserByIdException,
  UpdateUserException,
  DeleteUserException,
} = require('./userHandleError');

const UserModel = require('../../models/userModel');

class UserController {
  async getUsersList (request, response) {
    let response_users = null;
    let response_result = null;
    let response_status = null;
  
    try {
      response_users = await getUsers();
      const usersWithoutPassword = response_users.map(({ password, ...user }) => user);
      response_users = usersWithoutPassword;
      response_result = GetUsersException.success;
      response_status = 200;
    } catch (error) {
      if (error.code != null) {
        response_result = error.code;
        response_status = 400;
      } else {
        response_result = GetUsersException.unknownError;
        response_status = 500;
      }
    }
  
    response.status(response_status).json({
      result: response_result,
      users: response_users,
    });
  };

  async getUser (request, response) {
    let response_user = null;
    let response_result = null;
    let response_status = null;
    try {
      response_user = await getUserById(request.params.id);
      if (response_user === null) {
        response_result = GetUserByIdException.userNotFound;
        response_status = 404;
      } else {
        const { password, ...userWithoutPassword } = response_user;
        response_user = userWithoutPassword;
        response_result = GetUserByIdException.success;
        response_status = 200;
      }
    } catch (error) {
      if (error.code != null) {
        response_result = error.code;
        response_status = 400;
      } else {
        response_result = GetUserByIdException.unknownError;
        response_status = 500;
      }
    }
  
    response.status(response_status).json({
      user: response_user,
      result: response_result,
    });
  }

  async createUser (request, response) {
    const name = request.body.name;
    const phone = request.body.phone;
    const email = request.body.email;
    const password = request.body.password;

    let response_user = null;
    let response_result = null;
    let response_status = null;
  
    if (!name || !email || !password) {
      response_result = CreateUserException.incorrectParameters;
      response_status = 400;
    } else {
      try {
        const userModel = new UserModel(name, email, phone, password);
  
        response_user = await createUser(userModel);
  
        response_result = CreateUserException.success;
  
        response_status = 201;
      } catch (error) {
        console.log('errorrrr', error);
        if (error.code != null) {
          response_result = error.code;
          response_status = 400;
        } else {
          response_result = CreateUserException.unknownError;
          response_status = 500;
        }
      }
    }
  
    response.status(response_status).json({
      user: response_user,
      result: response_result,
    });
  }

  async loginUser (request, response) {
    let email = request.body.email;
    let password = request.body.password;
  
    let response_user = null;
    let response_result = null;
    let response_status = null;
    if (email == null || password == null) {
      response_result = LoginByEmailException.incorrectParameters;
      response_status = 400;
    } else {
      try {
        response_user = await loginByEmail(email, password);
  
        response_result = LoginByEmailException.success;
        response_status = 200;
      } catch (error) {
        console.log(error.message);
        if (error.code != null) {
          response_result = error.code;
          response_status = 400;
        } else {
          response_result = LoginByEmailException.unknownError;
          response_status = 500;
        }
      }
    }
    response.status(response_status).json({
      token: response_user,
      result: response_result,
    });
  }

  async updateUser (request, response) {
    let response_user = null;
    let response_result = null;
    let response_status = null;
  
    try {
      response_user = await updateUser(request.params.id,request.body);
  
      response_result = UpdateUserException.success;
  
      response_status = 200;
    } catch(error) {
      console.log(error)
      if (error.code != null) {
        response_result = error.code;
        response_status = 400;
      } else {
        response_result = UpdateUserException.unknownError;
        response_status = 500;
      }
      
    }
  
    response.status(response_status).json({
      user: response_user,
      result: response_result
    });
    
  }

  async deleteUser (request, response) {
    let response_user = null;
    let response_result = null;
    let response_status = null;
  
    try {
      response_user = await deleteUser(request.params.id);
  
      response_result = DeleteUserException.success;
      response_status = 200;
    } catch (error) {
      console.log(error.message);
      if (error.code != null) {
        response_result = error.code;
        response_status = 400;
      } else {
        response_result = DeleteUserException.unknownError;
        response_status = 500;
      }
    }
  
    response.status(response_status).json({
      user: response_user,
      result: response_result,
    });
  }
}

module.exports = UserController;