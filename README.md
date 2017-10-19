# js-showpal-mediacenter

- NodeJS herunterladen und installieren
- Git herunterladen und installieren
- Browser herunterladen und installieren
- Das Projekt herunterladen durch Git via \\cmd > \texttt{git clone GDur@bitbucket.org:GDur/js-showpal-media-server.git}
    die in der Anlage enthaltene Zipdatei (Die Git-Variante benötigt eine Einladung da das Projekt privat ist)
- In den Ordner wechseln \\cmd > \texttt{cd js-showpal-media-center}
- Die Abhängigkeiten via NPM installieren \\cmd > \texttt{npm install}
- Die \texttt{./src/config.json.dist}-Datei muss nun kopiert werden mit dem neuen Namen nach \texttt{./src/config.json}
- Hier wird der Pfad zu den Serien angepasst indem die \texttt{./src/config.json} mit einem  Texteditor geöffnet wird und der Wert \texttt{tvShowPath} entsprechend angepasst wird.
- Den Server starten durch Doppelklick auf die \texttt{start-server.bat}-Datei
- Das \gls{mc} starten durch Doppelklick auf die \texttt{start.bat}-Datei
- im Browser die URL localhost:3000 aufrufen


# todo
- auf snackbar klicken führt zu hinzugefügter datei
- markieren welche folge zulezt aktiv war oder auch folge anzeigen neben play button
