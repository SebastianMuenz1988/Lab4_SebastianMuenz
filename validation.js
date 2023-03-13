function isValidUserObject(userObject) {
  if (!userObject || typeof userObject !== "object") {
    console.log("req.body is no object!");
    return false;
  }

  if (!isNonEmptyString(userObject.username)) {
    console.log("Username is missing!");
    return false;
  }

  if (!isNonEmptyString(userObject.password)) {
    console.log("Passowrd is missing!");
    return false;
  }

  return true;
}

function isNonEmptyString(s) {
  return typeof s === "string" && s !== "";
}

function isValidPassword(password) {
  // check if password is at least 8 characters long
  if (password.length < 8) {
    console.log("Password lenght <8 characters!");
    return false;
  }

  // check if password contains at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    console.log("Password contains no uppercase letter!");
    return false;
  }

  // check if password contains at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    console.log("Password contains no lowercase letter!");
    return false;
  }

  // check if password contains at least one digit
  if (!/\d/.test(password)) {
    console.log("Password contains no digit letter!");
    return false;
  }

  // check if password contains at least one special character
  if (!/[@$!%*?&#]/.test(password)) {
    console.log("Password contains no special character letter!");
    return false;
  }

  // if we've made it this far, the password is valid
  return true;
}

module.exports = { isValidUserObject, isValidPassword };
