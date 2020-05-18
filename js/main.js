var access = '';
var userData;
var SCOPE = 'https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/admin.directory.orgunit https://www.googleapis.com/auth/admin.directory.user';
function init() {
  gapi.load('auth2', function () {
    auth2 = gapi.auth2.getAuthInstance({
      client_id: '443946836961-ub8dup9hj3cs2098vbffsq1hv2kn9hhp.apps.googleusercontent.com',
      fetch_basic_profile: false,
      scope: SCOPE
    });
    gapi.signin2.render("g-signin-btn", {
      scope: 'email',
      width: 200,
      height: 50,
      longtitle: false,
      theme: 'dark',
      onsuccess: onSignIn,
      onfailure: null
    });
  });
}
function onSignIn(googleUser) {
  // get user profile information
  //console.log(googleUser.getBasicProfile())
  access = googleUser.getAuthResponse(true).access_token;
  //console.log(access);
  //console.log(googleUser.getBasicProfile().getCustomerId());
  window.location.href = "/intranet-gsuite/web/hello/home.html";
  localStorage.setItem("storageAccess", access);
}
function onFailure(error) {
}
function getUserData() {
  var userKey = document.getElementById("inputUser").value;
  var a = localStorage.getItem("storageAccess");
  if (!userKey == '') {
    var PATH = 'https://www.googleapis.com/admin/directory/v1/users/' + userKey + '?access_token=' + a;
    $.ajax({
      url: PATH,
      type: "GET",
      success: function (data) {
        userData = data;
        localStorage.setItem("storageUserData", userData);
        //console.log(userData);
      },
      error: function (error) {
        console.log("Something went wrong", error);
      }
    });
  }
}
function createUser() {
  var json = {
    "name": {
      "familyName": "",
      "givenName": "",
    },
    "password": "",
    "primaryEmail": "",
  }
  var familyName = document.getElementById("familyName").value;
  var givenName = document.getElementById("givenName").value;
  var password = document.getElementById("password").value;
  var primaryEmail = document.getElementById("primaryEmail").value;
  json.name.familyName = familyName;
  json.name.givenName = givenName;
  json.password = password;
  json.primaryEmail = primaryEmail;
  var a = localStorage.getItem("storageAccess");
  console.log(a);

  let PATH = 'https://www.googleapis.com/admin/directory/v1/users?access_token=' + a;
  $.ajax({
    url: PATH,
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(json),
    dataType: 'json',
    success: function (data) {
      console.log(data);
    },
    error: function (error) {
      console.log("Something went wrong", error);
    }
  });
}

function getOrgUnit() {
  getUserData();
  //var userrr = localStorage.getItem("storageUserData");
  var customerId = userData["customerId"];
  //var customerId = userDataJson.customerId;
  a = localStorage.getItem("storageAccess");
  let PATH = 'https://www.googleapis.com/admin/directory/v1/customer/' + customerId + '/orgunits?access_token=' + a;
  $.ajax({
    url: PATH,
    type: "GET",
    success: function (data) {
      console.log(data);
    },
    error: function (error) {
      console.log("Something went wrong", error);
    }
  });
}
