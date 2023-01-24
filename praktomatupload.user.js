// ==UserScript==
// @name         Praktomat File Upload
// @version      1.0
// @description  Make file uploading to Praktomat easier
// @author       Temm
// @match        http*://praktomat.inf.h-brs.de/*/tasks/*/solutionupload/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=h-brs.de
// @grant        none
// @copyright    2022, Temm (https://openuserjs.org/users/Temm)
// @license      GPL-3.0-or-later
// @updateURL    https://openuserjs.org/meta/Temm/Praktomat_File_Upload.meta.js
// @downloadURL  https://openuserjs.org/install/Temm/Praktomat_File_Upload.user.js
// ==/UserScript==


console.log("Praktomat File Upload Loaded");


// Blatantly stolen from https://medium.com/creative-technology-concepts-code/creating-a-drag-drop-upload-area-bdbe891446a8
// and https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop
document.querySelector(".left > form").insertAdjacentHTML("afterend", `
<div class="area">
    <div id="areatext">
        Drag and drop files here
    </div>
    <div id="upload"></div>
</div>

<style>
.area {
    position: relative;
    width: 100%;
    aspect-ratio: 2/1;
    border: 4px dashed #000;
    background-position: center;
    background-repeat: no-repeat;
    background-size: 64px 64px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    filter: alpha(opacity=50);
    -khtml-opacity: 0.5;
    -moz-opacity: 0.5;
    opacity: 0.5;
    text-align: center;
}
.area:hover,
.area.dragging,
.area.uploading {
    filter: alpha(opacity=100);
    -khtml-opacity: 1;
    -moz-opacity: 1;
    opacity: 1;
}
#upload {
    margin: 0;
    width: 100%;
    height: 100%;
    border: none;
    cursor: pointer;
}
.area #upload:focus {
    outline: none;
}
#areatext {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 1.5em;
    font-weight: bold;
    color: #000;
    z-index: -1;
}
</style>
`)

var upload = document.getElementById("upload");
upload.addEventListener("dragenter", function (e) {
    upload.parentNode.className = "area dragging";
}, false);

upload.addEventListener("dragleave", function (e) {
    upload.parentNode.className = "area";
}, false);

upload.addEventListener("drop", (e) => {
    console.log('File(s) dropped');

    // Prevent default behavior (Prevent file from being opened)
    e.preventDefault();

    if (e.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        [...e.dataTransfer.items].forEach((item, i) => {
            // If dropped items aren't files, reject them
            if (item.kind === 'file') {
                const file = item.getAsFile();
                onFileAdded(file);
            }
        });
    } else {
        // Use DataTransfer interface to access the file(s)
        [...e.dataTransfer.files].forEach((file, i) => {
            onFileAdded(file);
        });
    }
}, false);

upload.addEventListener("dragover", (e) => {
    console.log('File(s) in drop zone');

    // Prevent default behavior (Prevent file from being opened)
    e.preventDefault();
})

function onFileAdded(file) {
    console.log("File added: " + file.name);
    console.log(file);

    // input type file that should not already have a file
    let inputElem = Array.from(document.querySelectorAll(".form-row.file.dynamic-form > input[type=file]")).filter((elem) => !elem.files.length)[0];
    if (!inputElem) {
        // If no input element is found, click the plus button to add a new one
        let plus = document.querySelector(".icon.icon-orange.ui-icon-circle-plus");
        plus.click();
        inputElem = Array.from(document.querySelectorAll(".form-row.file.dynamic-form > input[type=file]")).filter((elem) => !elem.files.length)[0];
        if (!inputElem) {
            console.log("Something went wrong, no input element found");
        }
    }

    let transfer = new DataTransfer();
    transfer.items.add(file);
    inputElem.files = transfer.files;
}