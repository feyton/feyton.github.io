import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@8/src/sweetalert2.js";

export const notifyUser = (message, type = "success", duration = 3000) => {
  Swal.fire({
    html: message,
    timer: duration,
    type: type,
  });
};
export const baseUrl = "https://atlp-backend-staging.herokuapp.com/";

$.ajaxSetup({
  timeout: 8000, //Time in milliseconds
});
$(document).ajaxStart(() => {
  displayLoader();
});
$(document).ajaxComplete(() => {
  displayLoader("hide");
});
$(document).ajaxError((error) => {
  switch (error.status) {
    case 500:
      notifyUser("Something happened on our end", "error");
      break;
    case 400:
      let data = error.responseJSON.data;
      let ul = document.createElement("ul");
      Object.keys(data).forEach((key) => {
        let el = `<li>${key}: ${data[key]}</li><br>`;
        ul.innerHTML += el;
      });
      notifyUser(ul, "error");
      break;
    case 409:
      notifyUser(errData.message, "error");
      break;
    case 0:
      notifyUser("The request has been timed out! Try again");
      break;
    default:
      break;
  }
});

export const handleAjaxError = (error) => {
  let errData = error.responseJSON;
  switch (error.status) {
    case 500:
      notifyUser("Something happened on our end", "error");
      break;
    case 400:
      let data = error.responseJSON.data;
      let ul = document.createElement("ul");
      Object.keys(data).forEach((key) => {
        let el = `<li>${key}: ${data[key]}</li><br>`;
        ul.innerHTML += el;
      });
      notifyUser(ul, "warning");
      break;
    case 409:
      notifyUser(errData.message, "error");
      break;
    case 404:
      notifyUser(errData.message, "error");
      break;
    case 0:
      notifyUser("The request has been timed out! Try again", "error");
      break;
    default:
      notifyUser("Something went wrong! Try again", "error");
      break;
  }
};

export const renewToken = () => {
  $.ajax({
    url: baseUrl + "api/v1/refresh",
    method: "GET",
    success: (data) => {
      console.log(data);
    },
    error: (error) => {},
  });
};
const loginUser = (data) => {
  $.ajax({
    url: baseUrl + "api/v1/accounts/login",
    method: "POST",
    data: data,
    success: (response) => {
      const user = {
        id: response.data._id,
        name: response.data.name,
        image: response.data.image,
      };
      hideModals();
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("authenticated", true);
      notifyUser(`Welcome <b>${user.name}</b>`);
      handleUserLoggedIn(user);
    },
    error: (data) => {
      const errData = data.responseJSON;
      switch (data.status) {
        case 400:
          let message = `<li class="error">${errData.message}</li>`;
          notifyUser(message, "error");
          break;
        default:
          notifyUser(errData.message);
          break;
          break;
      }
    },
  });
};

export const logoutUser = () => {
  $.ajax({
    method: "POST",
    data: {},
    url: baseUrl + "api/v1/accounts/logout",
    success: (response) => {
      notifyUser("You are logged out");
      setTimeout(() => {
        window.location.pathname = "/";
      }, 3000);
    },
    error: (data) => {
      const errData = data.responseJSON;
      switch (data.status) {
        case 403:
          notifyUser(errData.message);
          break;
        case 400:
          notifyUser(errData.data);
          break;

        default:
          notifyUser(errData.message);
          break;
          break;
      }
    },
    complete: () => {
      handleUserLoggedOut();
    },
  });
};

window.addEventListener("load", () => {
  const authState = localStorage.getItem("authenticated");
  if (authState && authState == "true") {
    let user = localStorage.getItem("user");
    handleUserLoggedIn(JSON.parse(user));
  }
});

// Menu Toggle Declarations
let header = document.querySelector("header nav .menu");
let menuDisplayed = false;
const toggle = document.querySelector(".menu-toggle");
let toggleHtml = document.querySelector(".toggle");
try {
  toggle.addEventListener("click", (e) => {
    e.preventDefault();
    if (menuDisplayed) {
      header.style.display = "none";
      toggleHtml.innerHTML = `<i class="fa fa-bars"></i>`;
      menuDisplayed = false;
    } else {
      header.style.display = "block";
      toggleHtml.innerHTML = `<i class="far fa-window-close"></i>`;
      menuDisplayed = true;
    }
  });
} catch (error) {
  console.warn(error);
}

// Hiding menu when window is resized
window.addEventListener("resize", (e) => {
  let width = window.innerWidth;
  if (width < 575) {
    header.style.display = "none";
    toggleHtml.innerHTML = `<i class="fa fa-bars"></i>`;
    menuDisplayed = false;
  } else {
    header.style.display = "block";
    toggleHtml.innerHTML = `<i class="far fa-window-close"></i>`;
    menuDisplayed = true;
  }
});

const modalLinks = document.querySelectorAll(".modal-link");
modalLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const target = e.target.getAttribute("target");
    const modal = document.getElementById(target);
    modal.style.display = "block";
    document.querySelector("body").style.position = "fixed";
  });
});
export const hideModals = () => {
  const modals = document.querySelectorAll(".modal");
  modals.forEach((modal) => {
    modal.style.display = "none";
  });
  document.querySelector("body").style.position = "relative";
};

const closeButtons = document.querySelectorAll(".modal-close");
closeButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    e.preventDefault();
    hideModals();
  });
});

export const displayUploadProgressBar = (percent) => {
  document.querySelector(".juice").setAttribute("data-percent", percent + "%");
  document.querySelector(".juice").style.width = percent + "%";
};

export const displayLoader = (mode = "show", type = "standard") => {
  document.querySelector("body").style.position = "fixed";
  const loader = document.querySelector(".loader-div");
  if (mode == "show") {
    if (type == "standard") {
      let loaderContent = `
            <div class="loader standard">
            </div>
            `;
      loader.innerHTML = loaderContent;
      loader.style.display = "flex";
      setTimeout(() => {
        loader.style.display = "none";
        document.querySelector("body").style.position = "relative";
      }, 10000);
    } else if (type == "progress") {
      let loaderContent = `
            <div class="loader progress">
                <div class="juice" data-percent=0%></div>
            </div>
            `;
      loader.innerHTML = loaderContent;
      loader.style.display = "flex";
      setTimeout(() => {
        loader.style.display = "none";
        document.querySelector("body").style.position = "relative";
      }, 10000);
    }
  } else {
    loader.style.display = "none";
    document.querySelector("body").style.position = "relative";
  }
};

// About us page
const dropDowns = document.querySelectorAll(".drop-menu-item");
const aboutInfo = document.querySelectorAll(".about-info");
dropDowns.forEach((dropDown) => {
  dropDown.addEventListener("click", (e) => {
    e.preventDefault();
    let target = e.target.getAttribute("data-target");
    let itemId = e.target.getAttribute("id");
    aboutInfo.forEach((about) => {
      about.classList.add("d-none");
    });
    dropDowns.forEach((drop) => {
      drop.classList.remove("active");
    });
    document.getElementById(itemId).classList.add("active");
    document.querySelector(target).classList.remove("d-none");
  });
});

// Disabling all buttons
let disableds = document.querySelectorAll(".disabled");
disableds.forEach((disabled) => {
  disabled.addEventListener("click", (e) => {
    e.preventDefault();
  });
});

// Login Form
const checkLoginForm = () => {
  try {
    const form = document.querySelector("#login-form");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = form.email.value;
      const password = form.password.value;
      if (!email || !password) {
      } else {
        const data = { email: email, password: password };
        loginUser(data);
      }
    });
  } catch (error) {
    console.warn(error);
  }
};
checkLoginForm();

const handleUserLoggedIn = (user) => {
  document.querySelectorAll(".logged-in").forEach((el) => {
    el.style.display = "inherit";
  });
  document.querySelectorAll(".profile-picture").forEach((el) => {
    el.src = user.image;
  });
  document.querySelectorAll(".logged-out").forEach((el) => {
    el.style.display = "none";
  });
};
const handleUserLoggedOut = () => {
  document.querySelectorAll(".logged-in").forEach((el) => {
    el.style.display = "none";
  });
  document.querySelectorAll(".logged-out").forEach((el) => {
    el.style.display = "flex";
  });
  localStorage.clear();
};

const logoutButtons = document.querySelectorAll(".logout");
logoutButtons.forEach((btn) => {
  try {
    btn.addEventListener("click", () => {
      Swal.fire({
        title: "Are you sure?",
        text: "You will lose access to protected resources.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Log me out",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      }).then((result) => {
        if (result.value) {
          logoutUser();
        } else {
          Swal.fire("Cancelled", "Your session is still active", "info");
        }
      });
    });
  } catch (error) {
    console.warn(error);
  }
});
