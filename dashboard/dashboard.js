import { baseUrl, notifyUser } from "../js/main.js";
const token = localStorage.getItem("token");
const form = document.getElementById("post-create-form");
if (
  location.pathname == "/dashboard/create.html" ||
  location.pathname == "/dashboard/edit.html"
) {
  tinymce.init({
    selector: "#post-content",
    plugins:
      "advlist autolink lists link image charmap print preview hr anchor pagebreak",
    toolbar_mode: "floating",
    tinycomments_mode: "embedded",
    tinycomments_author: "Author name",
  });
  try {
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
        timeout: 20000,
        data: formData,
        success: () => {
          notifyUser("A new post has been created");
          setTimeout(() => {
            window.location.pathname = "/dashboard/blog.html";
          }, 3000);
        },
        error: (error) => {
          let data = error.responseJSON.data;
          let ul = document.createElement("ul");
          Object.keys(data).forEach((key) => {
            let el = `<li>${key}: ${data[key]}</li>`;
            ul.innerHTML += el;
          });
          notifyUser(ul, "error");
        },
      });
    });
  } catch (error) {
    console.warn(error);
  }
}

function toggleMenu() {
  let menuOpen = true;
  document.querySelector(".menu-close").addEventListener("click", () => {
    if (menuOpen) {
      menuOpen = false;
      document.querySelector(".side-menu").style.display = "none";
      document.querySelector(".menu-toggle").style.display = "flex";
      document.querySelector("main").style.gridTemplateColumns = "1fr";
    }
  });
  document.querySelector(".menu-toggle").addEventListener("click", () => {
    if (!menuOpen) {
      menuOpen = true;
      document.querySelector(".side-menu").style.display = "block";
      document.querySelector(".menu-toggle").style.display = "none";
      document.querySelector("main").style.gridTemplateColumns = "2fr 8fr";
    }
  });
}
toggleMenu();
