const firebaseConfig = {
  apiKey: "AIzaSyA7rdnDKUzQ6WJgceFUJ9U0KiixyW14a5A",
  authDomain: "blog-app-3fa1a.firebaseapp.com",
  projectId: "blog-app-3fa1a",
  storageBucket: "blog-app-3fa1a.appspot.com",
  messagingSenderId: "1064759561001",
  appId: "1:1064759561001:web:efe0680512c34ad044c538",
  databaseURL:
    "https://blog-app-3fa1a-default-rtdb.europe-west1.firebasedatabase.app",
};

var app = firebase.initializeApp(firebaseConfig);
var db = app.database();
console.log("Firebase Loaded");

$(document).on("load", () => {
  //   $(".animation").toggle();
});

// Create a user

$(document).ready(function () {
  // Checking auth state
  auth = firebase.auth();
  console.log("Checking");
  auth.onAuthStateChanged((user) => {
    if (user) {
      const newItem = document.createElement("h2");
      newItem.text =
        "Dear " + user.displayName + ", you are already logged in.";
      var formDiv = document.getElementById("form");
      formDiv.parentNode.removeChild(formDiv, newItem);
      console.log("logged");
      setTimeout(() => {
        window.location.href = "index.html";
      }, 5000);
    }
  });
  /////////////////////////////////

  userRef = firebase.database().ref("users/");
  $(".animation").css("display", "none");
  $confInput = $("#user-password-confirm");
  $(".input").each(function () {
    $(this).on("focus", function () {
      //   alert("focused");
      $(this).parent().next(".message-div").toggle(100, "linear");
    });
    $(this).on("blur", function () {
      $(this).parent().next(".message-div").toggle(100, "linear");
    });
  });

  // Email Validation
  var emailValidation = () => {
    $email = $("#user-email");
    // var emailValid = false;
    var emailRegex = /\S+@\S+\.\S+/;
    $email.on("keyup", () => {
      if ($email.val().match(emailRegex)) {
        $("#email-icon").addClass("valid");
        $("#email-valid").removeClass("invalid");
        $("#email-valid").addClass("valid");
        console.log("valid");
        // emailValid = true;
      } else {
        $("#email-icon").addClass("invalid");
        $("#email-valid").addClass("invalid");
        $("#email-valid").removeClass("valid");
        console.log("invalid");
      }
      // return emailValid;
    });
  };

  //   Form validation
  var validatePassword = () => {
    var lowerCaseLetter = /[a-z]/g;
    var upperCaseLetter = /[A-Z]/g;
    var numbers = /[0-9]/g;
    // var passwordValid = false;
    $("#user-password").on("keyup", function () {
      $("#password-icon").addClass("invalid");
      //   console.log($(this).val());
      if ($(this).val().match(lowerCaseLetter)) {
        $("#lower-case-valid").removeClass("invalid");
        $("#lower-case-valid").addClass("valid");
      } else {
        $("#lower-case-valid").removeClass("valid");
        $("#lower-case-valid").addClass("invalid");
      }
      if ($(this).val().match(upperCaseLetter)) {
        $("#upper-case").removeClass("invalid");
        $("#upper-case").addClass("valid");
      } else {
        $("#upper-case").removeClass("valid");
        $("#upper-case").addClass("invalid");
      }
      if ($(this).val().match(numbers)) {
        $("#number").removeClass("invalid");
        $("#number").addClass("valid");
      } else {
        $("#number").removeClass("valid");
        $("#number").addClass("invalid");
      }

      if (
        $(this).val().match(lowerCaseLetter) &&
        $(this).val().match(upperCaseLetter) &&
        $(this).val().match(numbers) &&
        $(this).val().length >= 6
      ) {
        $("#password-icon").removeClass("invalid");
        $confInput.prop("disabled", false);
        // return true;
      } else {
        // return false;
      }
    });
  };
  function validatePasswordConfirm() {
    $confInput = $("#user-password-confirm");
    $pass = $("#user-password").val();

    $confInput.on("keyup", function () {
      if ($("#user-password").val() == $(this).val()) {
        // console.log($(this).val());
        // confirmPasswordValid = true;
        $("#password-confirm-icon").addClass("valid");
        $("#confirm-password-list").addClass("valid");
        $("#confirm-password-list").removeClass("invalid");
        $("#form-submit").prop("disabled", false);
        // return true;
      } else {
        console.log($(this).val());
        console.log($("#user-password").val());
        $("#password-confirm-icon").addClass("invalid");
        $("#password-confirm-icon").removeClass("valid");
        $("#confirm-password-list").addClass("invalid");
        $("#confirm-password-list").removeClass("valid");
        // return false;
      }
    });
  }
  validatePassword();
  validatePasswordConfirm();
  emailValidation();

  function checkPass(pass) {
    var lowerCaseLetter = /[a-z]/g;
    var upperCaseLetter = /[A-Z]/g;
    var numbers = /[0-9]/g;
    if (
      pass.match(lowerCaseLetter) &&
      pass.match(upperCaseLetter) &&
      pass.match(numbers)
    ) {
      return true;
    }
    return false;
  }

  function checkEmail(email) {
    var emailRegex = /\S+@\S+\.\S+/;
    if (email.match(emailRegex)) {
      return true;
    }
    return false;
  }

  var validateSignUpForm = () => {
    var password = $("#user-password").val();
    var email = $("#user-email").val();
    var name = $("#user-name").val();

    if (checkEmail(email) && checkPass(password) && name.length >= 3) {
      console.log("Form is valid");
      submitData(name, email, password);
      console.log("You will be redirected in 5 seconds");
      setTimeout(() => {
        window.location.href = "index.html";
      }, 5000);

      return true;
    } else {
      console.log("Invalid form");
      return false;
    }
  };
  var auth = firebase.auth();
  // Form Submission function

  var submitData = (name, email, password) => {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((creadentials) => {
        var user = creadentials.user;
        console.log("User created");
        var uid = user.uid;
        firebase
          .database()
          .ref("users/" + uid)
          .set({
            displayName: name,
          });
      })
      .catch((err) => {
        console.log(err);
        alert("Something has gone wrong on our end.");
      });
  };

  $("#form").on("submit", function (e) {
    e.preventDefault();
    var valid = validateSignUpForm();

    if (valid) {
      console.log("Valid");
    } else {
      alert("Form is not valid");
      e.preventDefault();
    }
  });
});
