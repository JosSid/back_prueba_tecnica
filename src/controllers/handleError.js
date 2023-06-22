class HandleError extends Error {
  static success = "SUCCESS";
  static incorrectParameters = "INCORRECT_PARAMETERS";
  static invalidToken = "INVALID_TOKEN";
  static expiredToken = "EXPIRED_TOKEN";
  static notEnoutghPermissions = "NOT_ENOUTGH_PERMISSIONS";
  static unknownError = "UNKNOWN_ERROR";
  static errorInvalidFormatId = "INVALID_FORMAT_ID";

  constructor(petitionName, errorCode) {
    super("Error in " + petitionName + ": " + errorCode);

    this.code = errorCode;
  }
}

module.exports = HandleError;

