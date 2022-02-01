import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@8/src/sweetalert2.js";
import {
  actionLogger,
  baseUrl,
  getOrSetItem,
  handleAjaxError,
  notifyUser,
} from "./main.js";
const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

const postID = localStorage.getItem("postID");
if (location.pathname == "/pages/detail.html") {
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
      error: (error) => {
        handleAjaxError(error);
      },
    });
  } else {
    $.ajax({
      url: baseUrl + "api/v1/blogs/" + postID,
      method: "GET",
      success: (response) => {
        let post = response.data.blog;
        renderPost(post);
        renderComment(response.data.comments);
      },
      error: (error) => {
        handleAjaxError(error);
      },
    });
  }
}

const renderPost = (post) => {
  let date = new Date(post.date);
  let authdiv = `
  <div class="author-avatar"><img src="${post.author.image}" alt=""></div>


  <h2>${post.author.firstName}</h2>
  <p>${post.author.bio}</p>
  <button class="coffee">
      <span>Follow</span><span><a href="${post.author.facebook}" target="_blank" rel="noopener noreferrer"><i class="fab fa-facebook"></i></a><a href="${post.author.twitter}" target="_blank" rel="noopener noreferrer"><i class="fab fa-twitter"></i></a></span>
  </button>
  `;

  let template = `
    <div class="blog-image">
    <img src="${post.photoURL}"
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
  let commentDiv = document.querySelector("#comment-div");
  comments.forEach((comment) => {
    let commentElement = `
        <li>
        <div class="user-info-comment">
            <img src="${comment.author.image}" alt=""><span>${
      comment.author.firstName
    }</span>
        </div>
        <p class="comment-content">${comment.body}</p>
        <div class="comment-footer">
            <span class="comment-date">${new Date(
              comment.date
            ).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}</span> <span><i
                    class="fas fa-star fa-lg like-comment" data-ref="${
                      comment._id
                    }"></i>&nbsp;${comment.likes}</span>
        </div>

        <hr>
    </li>
        `;
    commentDiv.innerHTML += commentElement;
  });
};

const saveComment = () => {
  let form = document.querySelector("#comment-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let formData = new FormData(e.target);
    if (form.body.value == "") {
      form.body.focus();
    } else if (form.body.value.length < 10 || form.body.value.length > 200) {
      notifyUser("At least 10 characters are required");
    } else {
      const blogId = localStorage.getItem("postID");
      $.ajax({
        url: baseUrl + "api/v1/blogs/comment/" + blogId,
        method: "POST",
        data: { body: form.body.value },
        beforeSend: (xhr) => {
          xhr.setRequestHeader("Authorization", "Bearer " + token);
        },
        success: (response) => {
          notifyUser("Your comment has been received.");
          displayComment(response.data);
          form.reset();
          actionLogger({ cat: "create", activity: "Added new comment" });
        },
        error: (error) => {
          handleAjaxError(error);
        },
      });
    }
  });
};
saveComment();
const displayComment = (comment) => {
  let commentDiv = document.querySelector("#comment-div");
  let commentElement = `
  <li>
  <div class="user-info-comment">
      <img src="${user.image}" alt=""><span class="bolder ">You</span>
  </div>
  <p class="comment-content">${comment.body}</p>
  <div class="comment-footer">
      <span class="comment-date">${new Date(comment.date).toLocaleDateString(
        "en-US",
        { day: "2-digit", month: "short", year: "numeric" }
      )}</span> <span><i
              class="fas fa-star fa-lg"></i>&nbsp;<b class="like-count">${
                comment.likes
              }<b></span>
  </div>

  <hr>
</li>
  `;
  commentDiv.innerHTML += commentElement;
};

$(document).on("click", ".like-comment", (e) => {
  const ref = e.target.getAttribute("data-ref");

  const likedComments = getOrSetItem("liked-comments");
  let likes = $(this).closest(".like-count").text();

  if (!likedComments.includes(ref)) {
    e.target.classList.toggle("animate");
    e.target.classList.add("fa-check");
    e.target.classList.remove("fa-star");
    likedComments.push(ref);
    console.log("Liked");

    $(this)
      .closest(".like-count")
      .text((likes += 1));
    localStorage.setItem("liked-comments", JSON.stringify(likedComments));
    actionLogger({ cat: "create", activity: "Liked a comment" });
    $.ajax({
      url: baseUrl + `api/v1/blogs/comment/${ref}?action=like`,
      beforeSend: (xhr) => {
        xhr.setRequestHeader("Authorization", "Bearer " + token);
      },
      success: (response) => {
        notifyUser("You like has been recorded");
      },
      error: (error) => {
        handleAjaxError(error);
      },
    });
  } else {
    Swal.fire({
      title: "Dislike comment",
      text: "You already liked the. This action will remove it from your favorites",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, dislike",
      cancelButtonText: "No",
      reverseButtons: true,
    }).then((result) => {
      if (result.value) {
        likedComments.pop(ref);
        console.log("Disliked");
        actionLogger({ cat: "delete", activity: "Disliked a comment" });
        localStorage.setItem("liked-comments", JSON.stringify(likedComments));
        $.ajax({
          url: baseUrl + `api/v1/blogs/comment/${ref}?action=dislike`,
          beforeSend: (xhr) => {
            xhr.setRequestHeader("Authorization", "Bearer " + token);
          },
          success: (response) => {
            notifyUser("Your like has been removed");
          },
          error: (error) => {
            handleAjaxError(error);
          },
        });
      } else {
      }
    });
  }
});
