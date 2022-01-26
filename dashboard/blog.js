import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@8/src/sweetalert2.js";
import { baseUrl, notifyUser } from "../js/main.js";
const token = localStorage.getItem("token");

const getBlogs = () => {
  $.ajax({
    url: baseUrl + "api/v1/blogs",
    method: "GET",
    success: (data) => {
      let posts = data.data;
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
    console.log(result.value);
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
          notifyUser("Error happened", "error");
        },
      });
      notifyUser("The post is deleted", "info");
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire("Cancelled", "Your imaginary file is safe :)", "error");
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
