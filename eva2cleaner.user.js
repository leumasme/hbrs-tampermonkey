// ==UserScript==
// @name         HBRS eva2 Timetable Cleaner
// @version      1.0
// @description  Clean up your HBRS eva2 timetable!
// @author       Temm
// @updateURL    https://openuserjs.org/meta/Temm/HBRS_eva2_Timetable_Cleaner.meta.js
// @downloadURL  https://openuserjs.org/install/Temm/HBRS_eva2_Timetable_Cleaner.user.js
// @match        https://eva2.inf.h-brs.de/stundenplan/anzeigen/*mode=grid*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=h-brs.de
// @grant        none
// @copyright    2022, Temm (https://openuserjs.org/users/Temm)
// @license      GPL-3.0-or-later
// ==/UserScript==
console.log("Loaded Timetable Cleaner!");
(function () {
    //#region Element Helper Functions
    /** @type {(s: string)=>HTMLElement} */
    const $ = document.querySelector.bind(document);
    /** @type {(s: string)=>NodeListOf<HTMLElement>} */
    const $$ = document.querySelectorAll.bind(document);
    //#endregion

    //#region Interface Helper Functions
    /** @argument {HTMLElement} module */
    function removeModule(module) {
        let length = module.getAttribute("colspan");
        for (let i = 0; i < length; i++) {
            module.before(empty.cloneNode())
        }
        module.remove();
    }

    /** @argument {HTMLElement} module */
    function findDayOfModule(module) {
        for (const day of days) {
            if (day.some(row => row.contains(module))) return day;
        }
    }
    /** @argument {HTMLElement} row */
    function findDayOfRow(row) {
        for (const day of days) {
            if (day.includes(row)) return day;
        }
    }

    function cleanEmptyRows() {
        let rows = $$("tr[class^='row']");
        rows.forEach((row) => {
            let children = Array.from(row.children);
            if (!children.some(cell => cell.classList.contains("object-cell-border"))) {
                console.log("Row has no modules");
                let dayLabel = findDayOfRow(row)[0].children[0];
                let day = findDayOfRow(row);
                // There are no modules in this row
                if (row.children[0].classList.contains("row-label-one")) {
                    console.log("Row has a day label")
                    // Day label found in row, it will have to be moved down before removing row
                    // This is the only row of the day, keep it.
                    if (day.length == 1) return;

                    day[1].children[0].before(dayLabel);
                }
                // There are no modules or day labels in this row, remove it
                console.log("Removing a row");
                // Reduce day label height so it doesnt overflow into next day
                console.log(dayLabel);
                dayLabel.setAttribute("rowspan", parseInt(dayLabel.getAttribute("rowspan")) - 1)
                row.remove();
                day.splice(day.indexOf(row), 1);
            }
        });
    }
    //#endregion

    //#region Data variables
    let empty = $(".cell-border").cloneNode();
    let modules = Array.from($$(".object-cell-border"));
    /** @type {HTMLElement[][]} */
    let days = Array.from($$(".container-fluid>table>tbody>tr:not(:first-child)")).reduce((reduced, elem) => {
        if (!Array.from(elem.classList).some(c => c.startsWith("row"))) return reduced;
        if (elem.children[0].classList.contains("row-label-one")) {
            // Day label found in row, new day started
            reduced.push([]);
        }
        reduced[reduced.length - 1].push(elem);
        return reduced;
    }, []);
    //#endregion

    console.log("Days:", days);

    let interface = document.createElement("div");

    //#region Module Data Processing and UI
    let rawData = {}
    const groupRegex = /Gr(?:\.| |\. )((?:alle)|[a-z0-9])/i;
    const typeRegex = /\((Ü|V|P)\)/i;
    for (let module of modules) {
        module = module.querySelector(".nobreak");
        let title = module.querySelector(".lvtitel").textContent;
        let cleanTitle = title;

        while (cleanTitle.includes("  ")) cleanTitle = cleanTitle.replace(/  /g, " ");
        cleanTitle = cleanTitle.replace(groupRegex, "").replace(typeRegex, "").trim();

        if (rawData[title]) continue;
        let roomtime = module.querySelector(".lvraumzeit").textContent;
        let date = module.querySelector(".lvdatum").textContent;
        let prof = module.querySelector(".lvwer").textContent;

        let moduleGroup = (groupRegex.exec(title) ?? [, null])[1];
        let moduleType = (typeRegex.exec(title) ?? [, null])[1];
        rawData[title] = {
            title, cleanTitle, gruppe: moduleGroup, typ: moduleType,
            roomtime, date, prof,
        }
    }

    let organizedData = {};
    for (let module of Object.values(rawData)) {
        if (!organizedData[module.cleanTitle]) organizedData[module.cleanTitle] = [];
        organizedData[module.cleanTitle].push(module);
    }

    let sortedModules = Object.values(organizedData).sort((a, b) => b.length - a.length);
    for (const module of sortedModules) {
        let select = document.createElement("select");
        select.multiple = true;
        select.id = "module-" + module[0].cleanTitle; // possibly cursed
        select.style.width = "400px";
        select.style.fontSize = "12px";
        select.size = 5;
        for (const submodule of module) {
            let option = document.createElement("option");
            option.value = submodule.title;
            option.text = submodule.title;
            option.selected = true;
            select.appendChild(option);
        }
        interface.appendChild(select);
    }
    //#endregion

    //#region UI Functionality
    let uiControls = document.createElement("div");
    uiControls.style.display = "inline-block";

    // let cleanupCheckbox = document.createElement("input");
    // cleanupCheckbox.type = "checkbox";
    // cleanupCheckbox.id = "cleanup";
    // cleanupCheckbox.checked = true;
    // uiControls.appendChild(cleanupCheckbox);

    // let cleanupLabel = document.createElement("label");
    // cleanupLabel.textContent = "Clean up rows (Sort Modules Upwards)";
    // cleanupLabel.setAttribute("for", "cleanup");
    // uiControls.appendChild(cleanupLabel);
    // uiControls.appendChild(document.createElement("br"));

    // let highlightCheckbox = document.createElement("input");
    // highlightCheckbox.type = "checkbox";
    // highlightCheckbox.id = "highlight";
    // highlightCheckbox.checked = true;
    // uiControls.appendChild(highlightCheckbox);

    // let highlightLabel = document.createElement("label");
    // highlightLabel.textContent = "Highlight free time";
    // highlightLabel.setAttribute("for", "highlight");
    // uiControls.appendChild(highlightLabel);
    // uiControls.appendChild(document.createElement("br"));

    let btn = document.createElement("button");
    btn.textContent = "Apply Filter";
    btn.onclick = () => {
        // Apply filters
        btn.disabled = true;
        console.log(modules.length)
        Array.from($$("select[id^='module-']")).map(s => Array.from(s.querySelectorAll("option:not(:checked)"))).flat().map(o => o.value).forEach(title => {
            let removedModules = modules.filter(m => m.querySelector(".lvtitel").textContent == title);
            for (const module of removedModules) {
                removeModule(module);
            }
        });
        $$("select[id^='module-']").forEach(s => s.disabled = true);
        
        cleanEmptyRows();
    }
    uiControls.appendChild(btn);


    interface.appendChild(uiControls);
    //#endregion

    $(".container-fluid").children[0].after(interface);

    //#region Debug utilities
    $$(".object-cell-border").forEach((o) => {
        o.addEventListener("click", () => {
            removeModule(o)
            cleanEmptyRows();
        });
    });
    //#endregion
})();