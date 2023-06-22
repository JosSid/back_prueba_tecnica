class HandleError extends Error {
  static success = "SUCCESS";
  static incorrectParameters = "INCORRECT_PARAMETERS";
  static invalidToken = "INVALID_TOKEN";
  static expiredToken = "EXPIRED_TOKEN";
  static notEnoutghPermissions = "NOT_ENOUTGH_PERMISSIONS";
  static unknownError = "UNKNOWN_ERROR";
  static errorInvalidFormatId = "INVALID_FORMAT_ID";
  static emailAlreadyInUser = "EMAIL_ALREADY_IN_USER";
  static errorInvalidEmail = "ERROR_INVALID_EMAIL";

  constructor(petitionName, errorCode) {
    super("Error in " + petitionName + ": " + errorCode);

    this.code = errorCode;
  }
}

module.exports = HandleError;

