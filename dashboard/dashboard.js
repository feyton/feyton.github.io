import { baseUrl, handleAjaxError, notifyUser } from "../js/main.js";
let menuOpen = true;
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

window.addEventListener("load", (e) => {
  const width = window.innerWidth;
  if (width < 800) {
    const alreadyAccepted = localStorage.getItem("accept");
    if (alreadyAccepted) {
    } else {
      let accept = confirm(
        `For better experience, We recommend that you use a device with at least 1000 px. I understand`
      );
      if (accept) {
        localStorage.setItem("accept", true);
        alert("The experince may deteriorate");
      } else {
        alert("You will be redirected to the homepage");
        setTimeout(() => {
          window.location.pathname = "/";
        }, 3000);
      }
    }
  } else if (width < 1000) {
    console.log("Mini width");
    menuOpen = false;
    document.querySelector(".side-menu").style.display = "none";
    document.querySelector(".menu-toggle").style.display = "flex";
    document.querySelector("main").style.gridTemplateColumns = "1fr";
  }
});

const getTasks = () => {
  console.log("sending");
  $.ajax({
    url: baseUrl + "api/v1/tasks",
    beforeSend: (xhr) => {
      xhr.setRequestHeader("Authorization", "Bearer " + token);
    },
    success: (response) => {
      console.log(response);
      const tasks = response.data;
      if (tasks.length == 0) {
      } else {
        renderTasks(tasks);
      }
    },
    error: (error) => {
      handleAjaxError(error);
    },
  });
};
getTasks();

const renderTasks = (tasks) => {
  let targetDiv = $(".task-list");
  targetDiv.html("");
  tasks.forEach((task) => {
    let taskElement = `
    <div class="task-div">
      <span><input type="checkbox" name="complete task" id="" data-ref="${task._id}"></span>
      <span>${task.body}</span>
      <span>
          <i class="fa fa-edit task-edit" data-ref="${task._id}"></i>
          <i class="fa fa-trash task-delete" data-ref="${task._id}"></i>
      </span>
    </div>
    `;
    targetDiv.prepend(taskElement);
  });
};

if (location.pathname == "/dashboard/dashboard.html") {
  document.querySelector(".task-addition").addEventListener("click", () => {
    document.querySelector(".modal").style.display = "flex";
  });
  document.querySelector(".modal-close").addEventListener("click", () => {
    document.querySelector(".modal").style.display = "none";
  });

  $(".add-task-form").on("submit", (e) => {
    e.preventDefault();
    let body = e.target.body.value;
    if (body.length < 4) {
      notifyUser("Add activity");
    } else {
      $.ajax({
        url: baseUrl + "api/v1/tasks",
        beforeSend: (xhr) => {
          xhr.setRequestHeader("Authorization", "Bearer " + token);
        },
        method: "POST",
        data: { body: body },
        success: (response) => {
          notifyUser("Your task has been logged");
          $("form").trigger("reset");
          $(".modal").toggle(200);
          getTasks();
        },
        error: (error) => {
          handleAjaxError(error);
        },
      });
    }
  });
  $(document).on("click", ".task-delete", (e) => {
    const ref = e.target.getAttribute("data-ref");
    console.log(ref);
    $.ajax({
      url: baseUrl + "api/v1/tasks/" + ref,
      beforeSend: (xhr) => {
        xhr.setRequestHeader("Authorization", "Bearer " + token);
      },
      method: "DELETE",
      success: (response) => {
        notifyUser("The task has been deleted");
        getTasks();
      },
      error: (error) => {
        handleAjaxError(error);
      },
    });
  });
}
