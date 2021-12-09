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

firebase.initializeApp(firebaseConfig);

var postRef = firebase.database().ref("posts");
//   Get form data

$("#blog-form").on("submit", (e) => {
  e.preventDefault();
  var author = $("#author").val();
  var title = $("#title").val();
  var story = $("#story").val();

  //   console.log(author, title, story);
  savePost(author, title, story);
  $(".alert").text(`Dear ${author} a new post has been created.`);
  $("#blog-form").trigger("reset");
  setTimeout(() => {
    $(".alert").toggle(200);
  }, 4000);
});

// Save Post Method
var savePost = (author, title, story) => {
  var newPostRef = postRef.push();
  newPostRef.set({
    author: author,
    title: title,
    story: story,
  });
  console.log("New Post Created");
  $(".post-list-table").innerHTML = "";
  listPosts();
};

// CRUD Operations

var createPostElement = (title, author, ref) => {
  var element = `
    <tr>
        <td>${ref}</td>
        <td>${title}</td>
        <td>${author}</td>
        <td><a href="#none" class="edit" data-ref="${ref}">Edit</a>&nbsp;
        <a href="#delete" class="delete" data-ref="${ref}">Delete</a></td>
    </tr>
    
    `;
  return element;
};

// Read data

function listPosts() {
  postRef.on("value", (snapshot) => {
    $(".post-list-table tr").remove();
    console.log(snapshot.val());
    var post = snapshot.val();
    Object.keys(post).forEach((key) => {
      console.log(key);
      var title = post[key].title;
      var author = post[key].author;
      var title = post[key].story;
      // var title = post[key].title;

      var postElement = createPostElement(title, author, key);
      $(".post-list-table").append(postElement);
    });
  });
}
listPosts();

var deletePost = (key) => {
  postRef.remove(key);
};

$(".delete").click(function (e) {
  e.preventDefault;
  alert("clicked");
  var ref = $(this).data("ref");
  console.log(ref);
  post = postRef.get(ref);
  console.log(post);
});

$(".post-list-table").on("click", ".delete", function (e) {
  e.preventDefault();
  var ref = $(this).data("ref");
  var postRef = firebase.database().ref("posts/" + ref);
  postRef.get().then((snapshot) => {
    console.log(snapshot.val());
    var del = confirm("Are you sure to delete " + snapshot.val().title + "?");
    if (del) {
      postRef.remove();
      console.log("The post have been deleted");
      $(".post-list-table").innerHTML = "";
      listPosts();
    } else {
      console.log("Data remain intact");
    }
  });
});
