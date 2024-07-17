// ==UserScript==
// @name         LEA Login Redirect
// @namespace    http://tampermonkey.net/
// @version      2024-07-17
// @description  Redirect to the previous page after LEA login screen
// @author       Temm
// @match        https://lea.hochschule-bonn-rhein-sieg.de/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hochschule-bonn-rhein-sieg.de
// @grant        unsafeWindow
// ==/UserScript==

(function () {
	if (window.location.pathname.endsWith("login.php")) {
        // On the Login page, we want to set the form target to the target ID of the page we were previously on
        // his doesn't work if the form isn't used and the page is just refreshed instead
        // (e.g. when logging in on a different tab) 
        // TODO: Make this work for refreshing too
		let lastTarget = window.sessionStorage.getItem("currentPage");
		if (!lastTarget) {
			console.log("[Tampermonkey]: Can't set login target, last page not known")
			return;
		}
		let form = document.querySelector("[name=formlogin]")
		let url = new URL(form.action)
		if (!url.searchParams.get("target")) url.searchParams.set("target", lastTarget)
		form.action = url.toString()
	} else {
        // On other pages, we store the target ID from the permalink textbox at the bottom of the page
        // window.sessionStorage is per-tab so this should not cause conflicts between tabs
		let permaLink = document.getElementById("current_perma_link");
		if (!permaLink) {
			console.log("[Tampermonkey]: Page has no Permalink textbox, can't update currentPage")
			window.sessionStorage.removeItem("currentPage");
			return;
		}
		let permaLinkTarget = new URL(permaLink.value).searchParams.get("target")
		if (!permaLinkTarget) throw new Error("[Tampermonkey]: Permalink has no target set")
		window.sessionStorage.setItem("currentPage", permaLinkTarget)
	}
})();