var loginModal = document.getElementById("loginModal");
var loginBtn = document.getElementById("loginBtn");
var registerModal = document.getElementById("registerModal");
var registerBtn = document.getElementById("registerBtn");
var newPostModal = document.getElementById("newPostModal");
var newPostBtn = document.getElementById("newPostBtn")
var loginSpan = document.getElementsByClassName("close")[0];
var registerSpan = document.getElementsByClassName("close")[1];
var newPostSpan = document.getElementsByClassName("close-new-post")[0];

try {
    loginBtn.onclick = function() {
        registerModal.style.display = "none";
        loginModal.style.display = "flex";
        newPostModal.style.display = "none";
    }
} catch {};

try {
    registerBtn.onclick = function() {
        loginModal.style.display = "none";
        registerModal.style.display = "flex";
        newPostModal.style.display = "none";
    }
} catch {};

try {
    newPostBtn.onclick = function() {
        try {
            loginModal.style.display = "none";
            registerModal.style.display = "none";
        } catch {}
        newPostModal.style.display = "flex";
    }
} catch {};

try {
    loginSpan.onclick = function() {
        loginModal.style.display = "none";
    }
} catch {};

try {
    registerSpan.onclick = function() {
        registerModal.style.display = "none";
    }
} catch {};

try {
    newPostSpan.onclick = function() {
        newPostModal.style.display = "none";
    }
} catch {};

window.onclick = function(event) {
    try {
        if (event.target == loginModal) {
            loginModal.style.display = "none";
        } else if (event.target == registerModal) {
            registerModal.style.display = "none";
        } else if (event.target == newPostModal) {
            newPostModal.style.display = "none";
        }
    } catch {};
};