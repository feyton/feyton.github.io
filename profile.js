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
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var auth = firebase.auth();
console.log("firebase loaded");
var user = auth.currentUser;
// import("./main.js").then((getUserName) => {
//   var name = getUserName(user);

//   $(".user-name").text(name);
// });

console.log(user);
