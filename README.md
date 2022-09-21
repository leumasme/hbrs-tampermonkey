# hbrs-tampermonkey
## [Deutsch] Einführung zum Eva2 tool
### Installation
- Verwende einen Browser der Tampermonkey unterstützt. Alle gängigen Browser auf Windows sollten funktionieren.
- Installiere [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en) (oder nutz [diesen link](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/) wenn du Firefox benutzt)
- Klicke [hier](https://openuserjs.org/install/Temm/HBRS_eva2_Timetable_Cleaner.user.js), und drücke Install ([alternativer backup-link](https://github.com/leumasme/hbrs-tampermonkey/raw/main/eva2cleaner.user.js))
### Nutzung
- Gehe auf die Seite https://eva2.inf.h-brs.de/stundenplan/
- Wähle "Anzeigen als" -> "Zeitraster" aus
- Wähle dein Semester/Studiengang aus und drücke Stundenplan anzeigen
- Du solltest auf der Stundenplan-Webseite nun einige Menüs sehen, um Kurse auszuwählen, welche gezeigt werden sollen. Standardmäßig sind alle Kurse ausgewählt.
- Mit STRG+Klick können mehrere Kurse von einem Menü ausgewählt werden
- Klicke "Apply Filter" um alle nicht ausgewählten Kurse zu entfernen
## [English] Getting Startet: Eva2 timetable cleaner script
### How to install
- Use a Browser that supports Tampermonkey. All common browsers on Windows should work.
- Install [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en) (or use [this link](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/) if you are using firefox)
- Click [here](https://openuserjs.org/install/Temm/HBRS_eva2_Timetable_Cleaner.user.js) and click install ([alternative backup-link](https://github.com/leumasme/hbrs-tampermonkey/raw/main/eva2cleaner.user.js))
### How to use
- Visit https://eva2.inf.h-brs.de/stundenplan/
- Select "Display as" -> "Grid"
- Select your Semester and click Display Timetable
- You should see some selection menus on the Timetable website. Unselected courses will be removed from the Timetable. All courses are selected by default.
- You can select multiple courses from the same selection menu with CTRL+Click
- Click "Apply Filter" to remove all Courses that are not selected

## Planned Features
- [ ] Save selected courses between page reloads
- [ ] Move courses to the Top row of the day to reduce free space and visual clutter
- [ ] Highlight free time between courses
- [ ] Count total free time between courses