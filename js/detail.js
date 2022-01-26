import { baseUrl, notifyUser } from "./main.js";

const postID = localStorage.getItem("postID");
if (!postID) {
  notifyUser(
    "It seems like you just landed here. Let me get some posts",
    "info"
  );
  $.ajax({
    url: baseUrl + "api/v1/blogs",
    success: (response) => {
      let posts = response.data;
      if (posts.length == 0) {
        notifyUser("Nothing to see here yet!", "info");
      } else {
        let id = posts[0]._id;
        localStorage.setItem("postID", id);
        notifyUser("We are getting something for you.");
        setTimeout(() => {
          location.reload();
        }, 3000);
      }
    },
  });
} else {
  $.ajax({
    url: baseUrl + "api/v1/blogs/" + postID,
    success: (data) => {
      let post = data.data;
      renderPost(post);
    },
    error: (error) => {},
  });
}

const renderPost = (post) => {
  let date = new Date(post.date);
  let authdiv = `
  <div class="author-avatar"><img src="${
    baseUrl + post.author.image
  }" alt=""></div>


  <h2>${post.author.firstName}</h2>
  <p>${post.author.bio}</p>
  <button class="coffee">
      <span>Follow</span><span><a href="${
        post.author.facebook
      }" target="_blank" rel="noopener noreferrer"><i class="fab fa-facebook"></i></a><a href="${
    post.author.twitter
  }" target="_blank" rel="noopener noreferrer"><i class="fab fa-twitter"></i></a></span>
  </button>
  `;

  let template = `
    <div class="blog-image">
    <img src="${baseUrl + post.photoURL}"
        alt="">
    <div class="date-info">
        <h2>${date.getDate()}-${date.toString().split(" ")[1]}</h2>
        <hr>
        <h2>${date.getFullYear()}</h2>
    </div>
    </div>
    <div class="blog-info">
    <h2>${post.title}</h2>
    <div class="blog-detail-content">
    ${post.content}
    </div>
    
    </div>
    <br>
    `;
  document.getElementById("blog-div").innerHTML = template;
  document.getElementById("author-div").innerHTML = authdiv;
};

const renderComment = (comments) => {
  comments.forEach((comment) => {
    let commentDiv = `
        <li>
        <div class="user-info-comment">
            <img src="${comment.user.image}" alt=""><span>${comment.user.firstName}</span>
        </div>
        <p class="comment-content">${comment.body}</p>
        <div class="comment-footer">
            <span class="comment-date">25 June 2021</span> <span><i
                    class="fas fa-star fa-lg"></i>&nbsp;${comment.likes}</span>
        </div>

        <hr>
    </li>
        `;
  });
};
