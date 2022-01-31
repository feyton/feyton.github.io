import { handlePagination } from "../dashboard/blog.js";
import { baseUrl, notifyUser } from "./main.js";

const blogDiv = document.querySelector(".blog-list");

const loadIndexBlogs = () => {
  $.ajax({
    url: baseUrl + "api/v1/blogs",
    success: (response) => {
    
      let posts = response.data;
      if (posts.length == 0) {
      } else {
        renderBlogList(posts, blogDiv);
      }
    },
    error: (data) => {
      notifyUser(data.responseJSON.message, "error");
    },
  });
};

$("body").on("click", ".btn-more", (e) => {
  const ref = e.target.getAttribute("data-ref");
  localStorage.setItem("postID", ref);
});
if (
  window.location.pathname == "/" ||
  window.location.pathname == "/index.html"
) {
  loadIndexBlogs();
}
export const renderBlogList = (posts, postDiv, detailPage) => {
  let page;
  if (!detailPage) {
    detailPage = "./pages/detail.html";
  }
  postDiv.innerHTML = "";
  posts.forEach((post) => {
    let postDate = new Date(post.date);
    let postElement = `
          <div class="blog-card">
          <div class="blog-image">
              <img src="${post.photoURL}" alt="">
              <div class="date-info">
                  <h2>${postDate.getDate()}-${
      postDate.toString().split(" ")[1]
    }</h2>
                  <hr>
                  <h2>${postDate.getFullYear()}</h2>
              </div>
          </div>
          <div class="blog-info">
              <a href="${detailPage}" class="title btn-more" data-ref="${
      post._id
    }">
                  <h2>${post.title}</h2>
              </a>
              <p>${post.summary}</p><br>
              <a href="${detailPage}" data-ref="${
      post._id
    }" class="btn btn-more" >Read more&nbsp;<i class="fa fa-fighter-jet" aria-hidden="true"></i></a><br>
          </div>
          <br>
      </div>
      <hr>
          
          `;
    postDiv.innerHTML += postElement;
  });
};

export const loadBlogsForBlogger = (page, limit) => {
  const pageQ = page || 1;
  const limitQ = limit || 3;
  $.ajax({
    url: baseUrl + `api/v1/blogs?page=${pageQ}&limit=${limitQ}`,
    success: (data) => {
      let { posts, ...pagedata } = data.data;
      if (posts.length == 0) {
      } else {
        let postDiv = document.getElementById("blog-div");
        renderBlogList(posts, postDiv, "./detail.html");
        handlePagination(pagedata);
      }
    },
  });
};

if (window.location.pathname == "/pages/blog.html") {
  loadBlogsForBlogger();
  document.addEventListener("click", (e) => {
    if (e.target.matches(".page-nav")) {
      let page = e.target.getAttribute("data-page");
      page = parseInt(page);
      loadBlogsForBlogger(page);
    }
  });
}
