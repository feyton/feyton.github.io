import { baseUrl, notifyUser } from "./main.js";

const updateBtn = document.querySelector(".btn-update-profile");
const updateDiv = document.querySelector(".update-div");
updateBtn.addEventListener("click", (e) => {
  e.preventDefault();
  updateDiv.classList.toggle("d-none");
});

document.querySelector("#hideModal").addEventListener("click", (e) => {
  console.log("clicked");
  e.preventDefault();
  document.querySelector(".modal").style.display = "none";
});
document.querySelector(".update-picture").addEventListener("click", (e) => {
  e.preventDefault();
  document.querySelector(".modal").style.display = "flex";
});

const image = document.getElementById("user-image");
try {
  image.addEventListener("change", (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      document.querySelector(".image-div").innerHTML = `
        <img src="${e.target.result}" alt="uploaded image">`;
    };
    reader.readAsDataURL(file);
  });
} catch (error) {
  console.warn(error);
}

const loadUserProfile = (user) => {
  let template = `
    <div class="info">
    <span>First name:</span> <span class="">${user.firstName}</span>
    </div>
    <div class="info">
    <span>Last name:</span> <span class="">${user.lastName}</span>
    </div>
    <div class="info">
        <span>Facebook:</span> <span class="">${user.facebook}</span>
    </div>
    <div class="info">
        <span>Twitter:</span> <span class="">${user.twitter}</span>
    </div>
    <div class="info bio">
        <span>Bio:</span> <span class="">${user.bio}</span>
    </div>
    `;
  document.querySelector(".user-info-render").innerHTML = template;
};
const user = JSON.parse(localStorage.getItem("user"));
const token = localStorage.getItem("token");

if (user && token) {
  console.log("Logged in");
  // window.history.pushState("", "ATLP| Profile", "/accounts/profile");
  $.ajax({
    url: baseUrl + "api/v1/accounts/profile/" + user.id,
    beforeSend: (xhr) => {
      xhr.setRequestHeader("Authorization", "Bearer " + token);
    },
    success: (data) => {
      loadUserProfile(data.data);
      populateForm(data.data);
    },
    error: (error) => {
      notifyUser(error.responseJSON.message);
    },
  });
} else {
  console.log("Profile loaded");
  notifyUser("Login to view this page", "error", 4000);
  setTimeout(() => {
    location.pathname = "/";
  }, 4000);
}
let form = document.querySelector("#update-profile-form");
const populateForm = (user) => {
  form.firstName.value = user.firstName;
  form.bio.value = user.bio;
  form.lastName.value = user.lastName;
  form.facebook.value = user.facebook;
  form.twitter.value = user.twitter;
};
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  let data = {};
  for (var [key, value] of formData.entries()) {
    data[key] = value;
  }
  $.ajax({
    url: baseUrl + "api/v1/accounts/profile/" + user.id,
    method: "PUT",
    data: data,
    beforeSend: (xhr) => {
      xhr.setRequestHeader("Authorization", "Bearer " + token);
    },
    success: (data) => {
      notifyUser("Your profile has been updated");
      loadUserProfile(data.data);
      populateForm(data.data);
    },
    error: (error) => {},
  });
});

document
  .querySelector(".update-profile-picture")
  .addEventListener("submit", (e) => {
    e.preventDefault();
    let formData = new FormData(e.target);
    $.ajax({
      url: baseUrl + "api/v1/accounts/profile/" + user.id,
      method: "PUT",
      data: formData,
      contentType: false,
      processData: false,
      beforeSend: (xhr) => {
        xhr.setRequestHeader("Authorization", "Bearer " + token);
      },
      success: (response) => {
        notifyUser("Your profile has been updated");
        loadUserProfile(response.data);
        populateForm(response.data);
        const userData = {
          id: response.data._id,
          name: response.data.name,
          image: response.data.image,
        };
        localStorage.setItem("user", JSON.stringify(userData));
      },
      error: (error) => {},
    });
  });
