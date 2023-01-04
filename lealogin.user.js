// ==UserScript==
// @name         HBRS LEA Login
// @version      1.0
// @description  Auto-Login for LEA
// @author       Temm
// @match        http*://lea.hochschule-bonn-rhein-sieg.de/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=h-brs.de
// @grant        none
// @copyright    2022, Temm (https://openuserjs.org/users/Temm)
// @license      GPL-3.0-or-later
// @updateURL    https://openuserjs.org/meta/Temm/HBRS_LEA_Login.meta.js
// @downloadURL  https://openuserjs.org/install/Temm/HBRS_LEA_Login.user.js
// ==/UserScript==

console.log("LEA Login Tampermonkey Loaded");
let path = new URL(document.location).pathname;
if (path == "/login.php") {
    if (localStorage.username && localStorage.password) {
        console.log("Logging in with stored credentials");
        loginLea(localStorage.username, localStorage.password).then(()=> location.reload())
    } else {        
        // Login button has property name="cmd[doStandardAuthentication]"
        const loginBtn = document.querySelector("input[name='cmd[doStandardAuthentication]']");

        loginBtn.addEventListener("click", (e) => {
            localStorage.username = document.getElementById("username").value;
            localStorage.password = document.getElementById("password").value;
        })
    }
}

if (path == "/logout.php") {
    localStorage.removeItem("username");
    localStorage.removeItem("password");
}

async function loginLea(username, password) {
    console.log(localStorage.username, localStorage.password, username, password)
    let url = "https://lea.hochschule-bonn-rhein-sieg.de/ilias.php?lang=de&client_id=db_040811&cmd=post&cmdClass=ilstartupgui&cmdNode=yh&baseClass=ilStartUpGUI&rtoken="
    let res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "origin": "null"
        },
        body: "cmd[doStandardAuthentication]=Anmelden&username=" + username + "&password=" + password,
    });
    if (!res.redirected) {
        console.log("Login failed: "+res.status, res.redirected);
        throw new Error("Login failed");
    }
    return true;
}

if (localStorage.username && localStorage.password) {
    setInterval(() => loginLea(localStorage.username, localStorage.password), 1000 * 60 * 5);
}