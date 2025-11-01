/* 
* Beachte im index.html muss die audio.js Klasse eingebunden werden, 
* sie ist nicht Teil der p5.js Bibliothek

* Das Beispiel zeigt wie man die audio Klasse benutzt, um ein Audiofile (mp3) zu laden und abzuspielen
* Die Lautstärke kann über die Funktion getSoundLevel() abgefragt werden.
* Rückgabewert ist ein Wert von 0 bis 255

* @author Hanna Zuellig, 2025

*/


let Instance;
let soundLevel = 0;
let font;
let soundFile = "assets/02_No-Surprises.mp3";//relativer Pfad zum Soundfile


function preload() {
  font = loadFont("assets/bianco_sans_new_bold-webfont.ttf");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont(font);


  /** 
  * BLOCK 1: nicht aendern
  * --------Im setup einmalig Zugriff auf Soundfile und Audio bereitstellen */
  Instance = newCustomAudio();
  //variante 1, soundfile über input button laden
  //Instance.createFileButton(); // Erstellt den Button um das Audio zu laden
  //variante 2, soundfile über pfad
  loadAudioFile(Instance, soundFile);
  /** --------- Ende Block 1 */
}

function draw() {
  blendMode(BLEND);//BlendMode zurücksetzen, damit die Farben nicht gemischt werden
  background(255);
  fill(255);

  
   /**
  * * BLOCK 2: nicht aendern
  * ------------
  * Hier wird geprüft, ob die Instanz micInstance existiert und ob sie gestartet wurde
  */
  if (Instance && Instance.started) {
    /**
    * In jedem Frame wird die aktuelle Lautstärke erfragt 
    * Werte die zurückkommen, gehen von 0 bis 255
    * der Wert wird in der Variable soundLevel gespeichert
    */

    getSoundLevel(Instance).then(level => {
      soundLevel = level;
    });
  }
  /* ------------ 
  Ende BLOCK 2 */

  let anzahlBalken = 10;
  let spaltenBreite = width / anzahlBalken; // Berechne die Breite der Spalten basierend auf der Anzahl der Balken
  let fontSize = map(soundLevel, 0, 255, 20, width); // Breite der Ellipsen basierend auf der Lautstärke


  blendMode(DIFFERENCE);// Setze den BlendMode auf DIFFERENCE, um die Farben zu invertieren

  textSize(fontSize); 
  textAlign(CENTER, CENTER); // Text zentriert ausrichten


  for (let i = 0; i < anzahlBalken; i++) {
    let xpos= i * spaltenBreite+spaltenBreite/2;
    let ypos = height ;

    let distanz = dist(mouseX, mouseY, xpos, ypos); // Berechne die Distanz zwischen Maus und Balken
    let maxDistanz = dist(0,0, width, height); //maximale Distanz ist die Diagonale
    
    let attract = map(distanz, 0, maxDistanz, 0.9, 0.1); // Berechne die Anziehungskraft basierend auf der Distanz, je grösser die Distanz, desto kleiner die Variable attract
    let yposAttract= ypos * attract;//die Originalposition wird multipliziert mit dem Faktor attract
    
    text("A",
      xpos, //x-position Text
      yposAttract, //y-position Text  
    ); 
  }


}



