import { baseUrl, notifyUser } from "./main.js";

const blogDiv = document.querySelector(".blog-list");

$.ajax({
  url: baseUrl + "api/v1/blogs",
  success: (response) => {
    console.log(response)
    let posts = response.data;
    if (posts.length == 0) {
    } else {
      renderBlogList(posts, blogDiv)
    }
  },
  error: (data) => {
    console.log(data);
    notifyUser(data.responseJSON.message, "error");
  },
});

$("body").on("click", ".btn-more", (e) => {
  const ref = e.target.getAttribute("data-ref");
  console.log(ref);
  localStorage.setItem("postID", ref);
});

export const renderBlogList = (posts, postDiv)=>{
    blogDiv.innerHTML = "";
    posts.forEach((post) => {
      let postDate = new Date(post.date);
      let postDiv = `
          <div class="blog-card">
          <div class="blog-image">
              <img src="${baseUrl + post.photoURL}" alt="">
              <div class="date-info">
                  <h2>${postDate.getDate()}-${
        postDate.toString().split(" ")[1]
      }</h2>
                  <hr>
                  <h2>${postDate.getFullYear()}</h2>
              </div>
          </div>
          <div class="blog-info">
              <a href="./pages/detail.html" class="title btn-more" data-ref="${
                post._id
              }">
                  <h2>${post.title}</h2>
              </a>
              <p>${post.summary}</p><br>
              <a href="./pages/detail.html" data-ref="${
                post._id
              }" class="btn btn-more" >Read more&nbsp;<i class="fa fa-fighter-jet" aria-hidden="true"></i></a><br>
          </div>
          <br>
      </div>
      <hr>
          
          `;
      blogDiv.innerHTML += postDiv;
    });
}
