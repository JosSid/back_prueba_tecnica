const HandleError = require("../handleError");

class GetUsersException extends HandleError {
    static errorDataBase = "ERROR_DATABASE";
  
    constructor(code){
      super("Get users list", code);
    };
  };
  
  class GetUserByIdException extends HandleError {
    static userNotFound = "USER_NOT_FOUND";
    
    constructor(code) {
      super("Get user by id", code);
    };
  };
  
  class LoginByEmailException extends HandleError {
    static errorIncorrectCredentials = "INCORRECT_CREDENTIALS";
    constructor(code) {
      super("Login By Email", code);
    };
  };
  
  class CreateUserException extends HandleError {
  
    constructor(code) {
      super("Create User ", code);
    };
  };
  
  class UpdateUserException extends HandleError {
  
    constructor(code) {
      super("Update User ", code);
    };
  };
  
  class DeleteUserException extends HandleError {
  
    constructor(code) {
      super("Delete User ", code);
    };
  };

  module.exports = {
    LoginByEmailException,
    CreateUserException,
    GetUsersException,
    GetUserByIdException,
    UpdateUserException,
    DeleteUserException
  };