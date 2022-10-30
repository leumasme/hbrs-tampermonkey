// ==UserScript==
// @name         HBRS FSLab Speed
// @version      1.0
// @description  Finer speed control for FSLab videos
// @author       Temm
// @updateURL    https://openuserjs.org/meta/Temm/HBRS_FSLab_speed.meta.js
// @downloadURL  https://openuserjs.org/install/Temm/HBRS_FSLab_speed.user.js
// @match        https://lectures.fslab.de/course/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=https://lectures.fslab.de
// @grant        none
// @copyright    2022, Temm (https://openuserjs.org/users/Temm)
// @license      GPL-3.0-or-later
// ==/UserScript==

console.log("FSLab Speed Loaded, player: ", player != null);

let speed = localStorage.getItem("fslabspeed") ?? 1;
let pl = document.getElementById("player").parentElement;

let label = document.createElement("label");
label.innerText = "Speed: ";
pl.appendChild(label);

let input = document.createElement("input");
input.type = "number";
input.min = "0.01";
input.max = "20";
input.value = speed;
input.step = 0.05;
input.style.marginBottom = "0.5em";

player.setPlaybackRate(speed);

input.addEventListener("change", function() {
    player.setPlaybackRate(input.value);
    localStorage.setItem("fslabspeed", input.value);
})

pl.appendChild(input);