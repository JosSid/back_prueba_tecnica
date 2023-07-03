const Security = require("../services/securityProvider");
const security = new Security();

class UserModel {
  constructor(name, email, phone, password) {
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.password = security.encryptData(password);
    this.createdAt = new Date().toUTCString();
    this.UpdatedAt = new Date().toUTCString();
  }
}

module.exports = UserModel;