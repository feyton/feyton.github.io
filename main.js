$(document).ready(() => {
  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyA7rdnDKUzQ6WJgceFUJ9U0KiixyW14a5A",
    authDomain: "blog-app-3fa1a.firebaseapp.com",
    databaseURL:
      "https://blog-app-3fa1a-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "blog-app-3fa1a",
    storageBucket: "blog-app-3fa1a.appspot.com",
    messagingSenderId: "1064759561001",
    appId: "1:1064759561001:web:efe0680512c34ad044c538",
  };
  var storyDiv = document.getElementById("story-div");
  // Initialize Firebase
  var app = firebase.initializeApp(firebaseConfig);
  var db = app.database();
  var auth = app.auth();
  // firebase.database().enablePersistence();
  // db.enablePersistence();
  console.log("Firebase Loaded");

  // Working with database

  const dbRef = db.ref();

  // /Reading Data
  var connectedRef = firebase.database().ref(".info/connected");
  connectedRef.on("value", (snap) => {
    if (snap.val() === true) {
      console.log("connected");
    } else {
      console.log("not connected");
    }
  });

  //
  dbRef
    .child("user-stories")
    .get()
    .then((snapshot) => {
      if (snapshot.exists()) {
        var stories = snapshot.val();
        console.log(Object.keys(stories));

        //   Adding chars to our list
        if (stories) {
          Object.keys(stories).forEach((key) => {
            var storyDiv = document.getElementById("story-div");
            storyDiv.innerHTML += `<li><span>${stories[key].name}:</span>&nbsp;<span>${stories[key].story}</span></li>`;
            console.log("Done");
          });
        } else {
          console.log("No data");
        }
      } else {
        storyDiv.innerHTML += `<li><span>${stories.name}:</span>&nbsp;<span>${stories.story}</span></li>`;
        console.log("Done");
      }
    })
    .catch((err) => {
      console.log(err);
    });

  var writeUserStory = (name, age, story) => {
    db.ref("user-stories/").push({
      id: 5,
      name: name,
      age: age,
      story: story,
    });
  };

  $("#form-submit").click((e) => {
    e.preventDefault();
    //   var form = document.querySelector("form");
    var data = $("#blog-form").serializeArray();
    var name = data[0].value;
    var age = data[1].value;
    var story = data[2].value;

    console.log(name, age, story);
    writeUserStory(name, age, story);
    storyDiv.innerHTML += `<li><span>${name}:</span>&nbsp;<span>${story}</span></li>`;
    console.log("Done sending");
    $("#blog-form").trigger("reset");
  });

  // User Auth Change Monitoring
  $(".btn-login").click(() => {
    $(".modal").toggle(200);
  });

  $(".close").click(() => {
    $(".modal").toggle(200);
  });

  // Authentication
  var uid;
  $("#login-form").submit((e) => {
    e.preventDefault();

    var email = $("#login-email").val();
    var password = $("#login-password").val();
    console.log(email, password);
    auth
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        var user = userCredential.user;
        handleLoggedInMarkup(user);
        $(".modal").toggle(200);
      })
      .catch((err) => {
        console.log("Something went wrong");
        handleLoginError(err["code"]);
      });
  });
  // Logging Out

  $(".btn-logout").click(function () {
    firebase
      .auth()
      .signOut()
      .then(() => {
        console.log("Signed Out");
        // Sign-out successful.
      })
      .catch((error) => {
        // An error happened.
      });
  });

  auth.onAuthStateChanged((user) => {
    if (user) {
      $(".log-in").css("display", "none");
      $("#logged-user").text(getUserName(user));
      $(".user-info").css("display", "block");
    } else {
      $(".log-in").css("display", "block");
      // $("#logged-user").text(getUserName(user));
      $(".user-info").css("display", "none");
    }
  });

  $(".btn-sign-up").click(() => {
    window.location.href = "signup.html";
  });
});

function handleLoggedInMarkup(user) {
  $(".log-in").css("display", "none");
  $("#logged-user").text(getUserName(user));
  $(".user-info").css("display", "block");
}

export function getUserName(user) {
  var db = firebase.database();
  db.ref()
    .child("users")
    .child(user.uid)
    .get()
    .then((snapshot) => {
      var name = snapshot.val()["displayName"];
      return name;
    })
    .catch((err) => {
      console.log("Something went wrong on our end");
    });
}

// Login with Google

var provider = new firebase.auth.GoogleAuthProvider();

$(".btn-google").click(function () {
  firebase
    .auth()
    .signInWithPopup(provider)
    .then((result) => {
      /** @type {firebase.auth.OAuthCredential} */
      var credential = result.credential;

      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      handleLoggedInMarkup(user);
      // ...
    })
    .catch((error) => {
      console.log(error);
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
});

function handleLoginError(code) {
  if (code == "auth/user-not-found") {
    alert("The user does not exist");
  } else if (code == "auth/wrong-password") {
    alert("Check your password and try again");
  } else if (code == "auth/invalid-email") {
    alert("Check your email address");
  }
}
