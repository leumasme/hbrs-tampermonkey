// ==UserScript==
// @name         HBRS FSLab Enhancer
// @version      1.0
// @description  Finer speed control and Whisper Subtitles for FSLab videos
// @author       Temm
// @updateURL    https://openuserjs.org/meta/Temm/HBRS_FSLab_Enhancer.meta.js
// @downloadURL  https://openuserjs.org/install/Temm/HBRS_FSLab_Enhancer.user.js
// @match        https://lectures.fslab.de/course/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=https://lectures.fslab.de
// @grant        none
// @copyright    2022, Temm (https://openuserjs.org/users/Temm)
// @license      GPL-3.0-or-later
// ==/UserScript==

console.log("FSLab Enhancer Loaded, player: ", player != null);

// Speed Control
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

input.addEventListener("change", function () {
    player.setPlaybackRate(input.value);
    localStorage.setItem("fslabspeed", input.value);
})

pl.appendChild(input);

// Whisper Subtitles
let vid = document.querySelector("video");
let url = new URL(vid.src);
let [, course, video] = /\/cdn\/([0-9]+)\/([0-9]+)\//.exec(url.pathname);

let languages = { "de": "Deutsch", "en": "Englisch" };
for (let [lang, name] of Object.entries(languages)) {
    vid.insertAdjacentHTML("afterbegin", `<track label="${name}" kind="subtitles" srclang="${lang}" src="https://tf.2d.rocks/vtt/${course}/${lang}_${video}.mp4.vtt" />`)
}
let done = 0;
function langDone() {
    done++;
    if (done == Object.keys(languages).length) {
        player.getPlugin("closed_captions").onSubtitleAvailable()
    }
}
document.querySelectorAll("video > track").forEach(e => {
    e.addEventListener("error", () => {
        console.log("%c Subtitles Language Unavailable: "+e.srclang+" ", "background: red; color: black");
        e.remove();
        langDone()
    })
    e.addEventListener("load", () => {
        console.log("%c Subtitles Language Available: "+e.srclang+" ", "background: #bada55; color: black");
        langDone()
    })
});

