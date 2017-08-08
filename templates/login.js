document.addEventListener('DOMContentLoaded', function main() {

  var logIn = document.getElementById("login-button");

  logIn.addEventListener('click', function() {
    var userId = document.getElementById("user-id").value;
    var userPassword = document.getElementById("user-password").value;
    if (userId == "") {
      alert("Please enter a user ID.");
      location.reload(true);
    }
    else if (userPassword == 0) {
      alert("Please enter the user password.");
      location.reload(true);
    }
    else {
      localStorage.setItem("userid", userId);
      localStorage.setItem("password", userPassword);
      location.href = "/test";
    }
  });
});
