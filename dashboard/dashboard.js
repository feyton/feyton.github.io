import { baseUrl, notifyUser } from "../js/main.js";

tinymce.init({
  selector: "#post-content",
  plugins:
    "advlist autolink lists link image charmap print preview hr anchor pagebreak",
  toolbar_mode: "floating",
  tinycomments_mode: "embedded",
  tinycomments_author: "Author name",
});

function toggleMenu() {
  let menuOpen = true;
  document.querySelector(".menu-close").addEventListener("click", () => {
    if (menuOpen) {
      console.log("Menu hidden");
      menuOpen = false;
      document.querySelector(".side-menu").style.display = "none";
      document.querySelector(".menu-toggle").style.display = "flex";
      document.querySelector("main").style.gridTemplateColumns = "1fr";
    }
  });
  document.querySelector(".menu-toggle").addEventListener("click", () => {
    if (!menuOpen) {
      console.log("Menu open");
      menuOpen = true;
      document.querySelector(".side-menu").style.display = "block";
      document.querySelector(".menu-toggle").style.display = "none";
      document.querySelector("main").style.gridTemplateColumns = "2fr 8fr";
    }
  });
}
toggleMenu();
const user = JSON.parse(localStorage.getItem("user"));
const token = localStorage.getItem("token");
const form = document.getElementById("post-create-form");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  $.ajax({
    url: baseUrl + "api/v1/blogs",
    method: "POST",
    processData: false,
    enctype: "multipart/form-data",
    contentType: false,
    beforeSend: (xhr) => {
      xhr.setRequestHeader("Authorization", "Bearer " + token);
    },
    data: formData,
    success: (data) => {
      notifyUser("A new post has been created");
      setTimeout(() => {
        window.location.pathname = "/dashboard/blog.html";
      }, 3000);
    },
    error: (error) => {
      console.log(error);
      let data = error.responseJSON.data;
      console.log(data);
      let ul = document.createElement("ul");
      Object.keys(data).forEach((key) => {
        let el = `<li>${key}: ${data[key]}</li>`;
        ul.innerHTML += el;
      });
      notifyUser(ul, "error");
    },
  });
});
