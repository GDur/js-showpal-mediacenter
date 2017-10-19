# js-showpal-mediacenter

- NodeJS herunterladen und installieren
- Git herunterladen und installieren
- Browser herunterladen und installieren
- Das Projekt herunterladen durch Git via 
```cmd
git clone git@github.com:GDur/js-showpal-mediacenter.git
```
- in den Ordner wechseln 
```cmd
cd js-showpal-mediacenter
```
- Die Abhängigkeiten via NPM installieren 
```cmd
npm install
```
- Die *./src/config.json.dist*-Datei muss nun kopiert werden mit dem neuen Namen nach *./src/config.json*
- Hier wird der Pfad zu den Serien angepasst indem die *./src/config.json* mit einem  Texteditor geöffnet wird und der Wert *tvShowPath* entsprechend angepasst wird.
- Den Server starten durch Doppelklick auf die *start-server.bat*-Datei
- Das Mediacenter starten durch Doppelklick auf die *start.bat*-Datei
- im Browser die URL *localhost:3000* aufrufen


# todo
- Auf Snackbar klicken führt zu hinzugefügter Datei
- Markieren welche Folge zulezt aktiv war oder auch Folge anzeigen neben dem Play-button
