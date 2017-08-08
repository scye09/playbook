document.addEventListener('DOMContentLoaded', function main() {

  var xhr = new XMLHttpRequest();

  function login(userid, pwd) {
    xhr.open('GET', '/annotations', false);
    xhr.setRequestHeader('Authorization', userid + ":" + pwd);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send();
    return xhr.status;
}

  function get_annotations(userid, pwd) {
    xhr.open('GET', '/annotations', false);
    xhr.setRequestHeader('Authorization', userid + ":" + pwd);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send();
    return xhr.responseText;
  }

  var logIn = document.getElementById("login-button");

  logIn.addEventListener('click', function() {
    var userId = document.getElementById("user-id").value;
    var userPassword = document.getElementById("user-password").value;
    if(login(userId, userPassword) != 200) {
        alert("Invalid login. Please try again.");
        location.reload(true);
      }
    else if (userId == "") {
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
      get_annotations(userId, userPassword);
    };

  });
});
