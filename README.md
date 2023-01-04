# hbrs-tampermonkey
## How to Install a Script
### Deutsch
- Verwende einen Browser der Tampermonkey unterstützt. Alle gängigen Browser auf Windows sollten funktionieren.
- Installiere [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en) (oder nutz [diesen link](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/) wenn du Firefox benutzt)
- Klicke den Link zu dem Script (siehe unten) welches du installieren möchtest (ein TamperMonkey tab sollte sich öffnen) und Klicke install
### English
- Use a Browser that supports Tampermonkey. All common browsers on Windows should work.
- Install [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en) (or use [this link](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/) if you are using firefox)
- Click the Link to the Script that you want to install (a TamperMonkey installation tab should open) and click install
## Scripts
- [Eva2 Timetable Cleaner](#Eva2)
- [FSLab Enhancer](#FSLab)
- [Praktomat Enhancer](#Praktomat)
## Eva2
[Script Link](https://openuserjs.org/install/Temm/HBRS_eva2_Timetable_Cleaner.user.js)
### [Deutsch] Nutzung
- Gehe auf die Seite https://eva2.inf.h-brs.de/stundenplan/
- Wähle "Anzeigen als" -> "Zeitraster" aus
- Wähle dein Semester/Studiengang aus und drücke Stundenplan anzeigen
- Du solltest auf der Stundenplan-Webseite nun einige Menüs sehen, um Kurse auszuwählen, welche gezeigt werden sollen. Standardmäßig sind alle Kurse ausgewählt.
- Mit STRG+Klick können mehrere Kurse von einem Menü ausgewählt werden
- Klicke "Apply Filter" um alle nicht ausgewählten Kurse zu entfernen
### [English] Usage
- Visit https://eva2.inf.h-brs.de/stundenplan/
- Select "Display as" -> "Grid"
- Select your Semester and click Display Timetable
- You should see some selection menus on the Timetable website. Unselected courses will be removed from the Timetable. All courses are selected by default.
- You can select multiple courses from the same selection menu with CTRL+Click
- Click "Apply Filter" to remove all Courses that are not selected
### Features
- Remove Courses from View
- Shrink rows by moving modules at the top of the day
- Click to manually hide a single module
### Planned Features
- [x] Save selected courses between page reloads
- [x] Move courses to the Top row of the day to reduce free space and visual clutter
- [ ] Highlight free time between courses
- [ ] Count total free time between courses

## FSLab
[Script Link](https://openuserjs.org/install/Temm/HBRS_FSLab_Speed.user.js)
### Features
- Fine Video Speed Control
- Subtitles

### Speed Usage
On all FSLab Course Video Links (lectures.fslab.de/course/\*/\*), an input box is added below the video. Enter a number to set the playback speed of the video. This can be any speed so you can set numbers like 1.3 which isn't possible with the player controls.
### Subtitles Usage
To enable subtitles, press the "CC" button on the bottom right in the player controls and select a language.
If there are no languages listed then I have not generated subtitles for your course, please contact me via Discord (@Temm#9188).

The subtitles may be very wrong. They are automatically generated with OpenAI's Whisper (large version) model.
I would put the VTT files in this repo so anyone can make changes and PR them to update the subtitles, but I would likely get into
copyright trouble if I publicly publish video transcripts without the professors permission.

## Praktomat
[Script Link](https://openuserjs.org/install/Temm/HBRS_FSLab_Speed.user.js)
### Features
- Uplad many files at once via a drag-and-drop area
### Usage
Just open an upload page and drag files into the drop area

## Lea
### Features
- Automatically stay logged in while idle on a page (Never click something and get thrown to the login page again)
- Automatically log in on the login page
### Usage
Just install the script.
Note that your username and password will be stored in your browser the first time you log into lea so the script can automatically log you in in the future. They are never sent anywhere else than to lea.