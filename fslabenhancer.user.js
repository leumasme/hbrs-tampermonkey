// ==UserScript==
// @name         HBRS FSLab Enhancer
// @version      1.2
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

const plugin = player.getPlugin("closed_captions");
console.log("FSLab Enhancer Loaded, subtitle plugin: ", window.plugin = plugin);

// Speed Control
let speed = localStorage.getItem("fslabspeed") ?? 1;
let pl = document.getElementById("player").parentElement;

let label = document.createElement("label");
label.innerText = "Speed: ";
pl.appendChild(label);

let input = document.createElement("input");
input.type = "number";
input.min = "0.05";
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
    vid.insertAdjacentHTML("afterbegin", `<track label="${name}" kind="subtitles" srclang="${lang}" src="https://raw.githubusercontent.com/leumasme/hbrs-tampermonkey/refs/heads/main/vtt/${course}/${lang}_${video}.mp4.vtt" />`)
}

let done = 0;
function langDone() {
    done++;
    if (done == Object.keys(languages).length) {
        plugin.onSubtitleAvailable()
        player.listenTo(plugin.container, "container:subtitle:changed", ({ id }) => {
            /** @type {{id: number, name: string, track: TextTrack}} */
            let track = plugin.container.closedCaptionsTracks.find(e => e.id == id);

            // Save last used language shortname
            localStorage.setItem("fslabsub", track.track.language);

            console.log("Subtitle Changed to ", track);
            displayTranscript(track.track);
        });
        let lang = localStorage.getItem("fslabsub");
        if (lang) {
            console.log("Re-Selecting Subtitle Language: " + lang);
            plugin.container.closedCaptionsTrackId = plugin.container.closedCaptionsTracks.find(e => e.track.language == lang).id;
        }
    }
}

document.querySelectorAll("video > track").forEach(e => {
    e.addEventListener("error", () => {
        console.log("%c Subtitles Language Unavailable: " + e.srclang + " ", "background: red; color: black");
        e.remove();
        langDone()
    })
    e.addEventListener("load", () => {
        console.log("%c Subtitles Language Available: " + e.srclang + " ", "background: #bada55; color: black");
        langDone()
    })
});

document.getElementById("player").style.display = "flex";
let transcript = document.createElement("div");
document.getElementById("player").insertAdjacentElement("beforeend", transcript);
// player is 1024px, transcript should take free space
transcript.style.flex = "1";
transcript.style.overflow = "auto";
transcript.style.padding = "1em";
transcript.style.backgroundColor = "rgba(0,0,0,0.7)";
transcript.style.color = "white";
transcript.style.display = "none";
// transcript should be 576px high, otherwise scrollable
transcript.style.maxHeight = "576px";

function displayTranscript(track) {
    // Clear the transcript element
    transcript.innerHTML = "";

    if (track == -1) {
        transcript.style.display = "none";
        return;
    };
    transcript.style.display = "block";
    transcript.parentElement.parentElement.style.maxWidth = "1900px"

    let frag = document.createDocumentFragment();
    for (let cue of track.cues) {
        let p = document.createElement("p");
        p.innerText = cue.text;
        frag.appendChild(p);
    }
    transcript.appendChild(frag);
}

// Current transcript line should be scrolled into view
setInterval(() => {
    let track = plugin.container.closedCaptionsTracks.find(e => e.id == plugin.container.closedCaptionsTrackId)?.track;
    if (!track) return;

    let cue = track.activeCues[0];
    if (!cue) return;

    let line = Array.from(transcript.children).find(e => e.innerText == cue.text);
    if (!line) return;

    // We can't use scrollIntoView here because it also scrolls the main page
    // line.scrollIntoView({ behavior: "smooth", block: "center" });
    transcript.scrollTop = line.offsetTop - transcript.offsetTop - transcript.clientHeight / 2 + line.clientHeight / 2;;

    // Remove the highlight from the previous line
    let prev = transcript.querySelector("p[style]");
    if (prev) prev.removeAttribute("style");

    // Highlight the line
    line.style.backgroundColor = "rgba(186, 186, 65,0.5)";
}, 200);
