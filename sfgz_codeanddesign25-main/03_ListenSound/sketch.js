/* 
* Beachte im index.html muss die audio.js Klasse eingebunden werden, 
* sie ist nicht Teil der p5.js Bibliothek

* Das Beispiel zeigt wie man die audio Klasse benutzt, um ein Audiofile (mp3) zu laden und abzuspielen
* Die Lautstärke kann über die Funktion getSoundLevel() abgefragt werden.
* Rückgabewert ist ein Wert von 0 bis 255

* @author Hanna Zuellig, 2025

*/


let micInstance; // globale Variable für die Mikrofon Instanz
let soundLevel = 0;//von 0 bis 255
let threshold = 50; //Schwellenwert für Lautstärke
let drehwinkel = 0;


function setup() {
  createCanvas(windowWidth, windowHeight);


  /** 
  * BLOCK 1: nicht aendern */
  micInstance = new Audio(); //Parameter übergibt Beschriftung des Buttons
  micInstance.createMicButton("Start Mic"); // Erstellt den Button für das Mikrofon
  /** --------- Ende Block 1 */
}

function draw() {

  background(255, 10);

  /**
 * * BLOCK 2: nicht aendern
 * ------------
 * Hier wird geprüft, ob die Instanz micInstance existiert und ob sie gestartet wurde
 */
  if (micInstance && micInstance.started) {
    /**
    * In jedem Frame wird die aktuelle Lautstärke erfragt 
    * Werte die zurückkommen, gehen von 0 bis 255
    * der Wert wird in der Variable soundLevel gespeichert
    */

    getSoundLevel(micInstance).then(level => {
      soundLevel = level;
    });
  }
  /* ------------ 
  Ende BLOCK 2 */

  push();
  translate(width / 2, height / 2);
  rotate(drehwinkel);
  fill(0, 0, 255);
  rectMode(CENTER);
  rect(0, 0, 100, 100);
  

  if (soundLevel > threshold) {
    ellipse(200, 0, 50, 50);
  }
  pop();

  drehwinkel = drehwinkel + soundLevel / 255; //Drehgeschwindigkeit abhängig von Lautstärke


}



