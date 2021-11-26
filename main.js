$(document).ready(function () {
  $(".contact-button").click(function (e) {
    e.preventDefault();
    alert("Button clicked");
  });
  $(".disabled").click(function (e) {
    e.preventDefault();
  });

  function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

  function checkCartCookie() {
    document.cookie = "cartItems = 0";
    let x = document.cookie;
  }
  function addToCart() {}
  function checkCartCookie() {
    let cartItems = getCookie("cartItems");
    if (username != "") {
      setCookie("cartItems", 0, 5);
    } else {
      return undefined;
    }
  }
});
