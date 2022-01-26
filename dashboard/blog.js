import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@8/src/sweetalert2.js";
import { baseUrl, notifyUser } from "../js/main.js";
const token = localStorage.getItem("token");

const getBlogs = (page, limit) => {
  const pageQ = page || 1;
  const limitQ = limit || 5;
  $.ajax({
    url: baseUrl + `api/v1/blogs?page=${pageQ}&limit=${limitQ}`,
    method: "GET",
    success: (data) => {
      let { posts, ...pagedata } = data.data;
      let postDiv = document.getElementById("post-items");
      postDiv.innerHTML = "";
      posts.forEach((post) => {
        let date = new Date(post.date);
        let postEl = `
            <div class="item" data-ref="${post._id}">
            <div class="checkbox">
                <input type="checkbox" name="checkbox">
            </div>
            <div class="star">
                <i class="far fa-star"></i>
            </div>
            <div class="post-title">
                <h6>${post.title}</h6>
            </div>
            <div class="post-date">
                <span>${date.toDateString()}</span>
            </div>
            <div class="post-actions">
                <a href="../pages/detail.html" data-ref="${
                  post._id
                }" class="btn-more"><i class="fas fa-eye"></i></a>
                <a href="#kd" data-ref="${
                  post._id
                }" class="btn-edit"><i class="fas fa-edit"></i></a>
                <a href="#kd" data-ref="${
                  post._id
                }" class="confirm delete"><i class="fas fa-trash"></i></a>

            </div>
        </div>
            `;
        postDiv.innerHTML += postEl;
      });
      handlePagination(pagedata);
    },
    error: (error) => {
      console.log(error);
    },
  });
};
getBlogs();

$("body").on("click", ".delete", (e) => {
  e.preventDefault();
  let ref = e.target.getAttribute("data-ref");
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "No, cancel!",
    reverseButtons: true,
  }).then((result) => {
    if (result.value) {
      console.log(ref);
      $.ajax({
        method: "DELETE",
        url: baseUrl + "api/v1/blogs/" + ref,
        beforeSend: (xhr) => {
          xhr.setRequestHeader("Authorization", "Bearer " + token);
        },
        success: (data) => {
          notifyUser("The post has been deleted");
          getBlogs();
        },
        error: (error) => {
          notifyUser(error.responseJSON.message, "error");
        },
      });
      notifyUser("The post is deleted", "info");
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire("Cancelled", "The post is left untouched", "error");
    }
  });
});

document.addEventListener("click", (e) => {
  if (e.target.matches(".btn-edit")) {
    notifyUser("Details loaded");
    const ref = e.target.getAttribute("data-ref");
    console.log(ref);
    localStorage.setItem("postEdit", ref);
  }
});

const searchResult = (term) => {
  $.ajax({
    url: baseUrl + `api/v1/blogs/search?q=${term}`,
    success: (response) => {
      console.log(response);
      if (response.data.length > 0) {
        $(".page-title").html(`Result for: <b>${term}</b>`);
        renderResult(response.data);
      } else {
        const postDiv = document.getElementById("post-items");
        postDiv.innerHTML = `<div class="center">
        <h2 class="mt-2 font-primary">Nothing is here now</h2>
    </div>`;
        $(".list-actions").hide();
        notifyUser("Nothing found for your search. Try again");
      }
    },
    error: (error) => {
      notifyUser("Something went wrong");
    },
  });
};

const renderResult = (posts) => {
  let postDiv = document.getElementById("post-items");
  postDiv.innerHTML = "";
  posts.forEach((post) => {
    let date = new Date(post.date);
    let postEl = `
        <div class="item" data-ref="${post._id}">
        <div class="checkbox">
            <input type="checkbox" name="checkbox">
        </div>
        <div class="star">
            <i class="far fa-star"></i>
        </div>
        <div class="post-title">
            <h6>${post.title}</h6>
        </div>
        <div class="post-date">
            <span>${date.toDateString()}</span>
        </div>
        <div class="post-actions">
            <a href="../pages/detail.html" data-ref="${
              post._id
            }" class="btn-more"><i class="fas fa-eye"></i></a>
            <a href="#kd" data-ref="${
              post._id
            }" class="btn-edit"><i class="fas fa-edit"></i></a>
            <a href="#kd" data-ref="${
              post._id
            }" class="confirm delete"><i class="fas fa-trash"></i></a>

        </div>
    </div>
        `;
    postDiv.innerHTML += postEl;
  });
};

$(".search-form").on("submit", (e) => {
  e.preventDefault();
  let form = e.target;
  let search = form.search.value;
  console.log(search);
  if (search == "") {
    notifyUser("The field can't be empty");
  } else {
    searchResult(search);
  }
});

const handlePagination = (pageData) => {
  let paginationDiv = document.querySelector(".pagination");
  paginationDiv.innerHTML = "";
  const page = pageData.page;
  if (pageData.hasPrevPage) {
    paginationDiv.innerHTML += `<span data-page="${pageData.prevPage}" class="page-nav"><i class="fas fa-angle-double-left"></i></span>`;
  }
  for (let i = 1; i <= pageData.totalPages; i++) {
    if (i == page) {
      paginationDiv.innerHTML += `
      <span  class="active">${page}</span>
      `;
    } else {
      paginationDiv.innerHTML += `
      <span data-page="${i}" class="page-nav">${i}</span>
      `;
    }
  }

  if (pageData.hasNextPage) {
    paginationDiv.innerHTML += `<span data-page="${pageData.nextPage}" class="page-nav"><i class="fas fa-angle-double-right"></i></span>`;
  }
};

document.addEventListener("click", (e) => {
  if (e.target.matches(".page-nav")) {
    let page = e.target.getAttribute("data-page");
    page = parseInt(page);
    getBlogs(page);
  }
});

let actionForm = document.querySelector(".post-mass-action");
actionForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let action = actionForm.option.value;
  let allIds = [];
  let selected = document.querySelectorAll("input[type='checkbox']");

  selected.forEach((box) => {
    let dataRef = box.parentElement.parentElement.getAttribute("data-ref");
    if (box.checked) {
      allIds.push(dataRef);
    }
  });
  console.log(allIds);
});
