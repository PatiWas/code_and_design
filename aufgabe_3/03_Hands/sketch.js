/**
 * HandPose Boilerplate mit ml5.js
 * 
 * Dieses Sketch erkennt Hände über die Webcam und zeichnet die erkannten Keypoints.
 * Es dient als Ausgangspunkt für eigene Hand-Tracking-Projekte.
 * 
 * Dokumentation: https://docs.ml5js.org/#/reference/handpose
 * 
 * Jede Hand hat 21 Keypoints (0-20):
 * - 0: Handgelenk
 * - 1-4: Daumen
 * - 5-8: Zeigefinger
 * - 9-12: Mittelfinger
 * - 13-16: Ringfinger
 * - 17-20: Kleiner Finger
 */

// Globale Variablen
let handpose;           // Das ml5.js HandPose-Modell
let video;              // Die Webcam
let hands = [];         // Array mit allen erkannten Händen
let ratio;              // Skalierungsfaktor zwischen Video und Canvas
let isModelReady = false; // Flag, ob das Modell geladen und Hände erkannt wurden
let currentFilterIndex = 0; // Index des aktuellen Filters (0 = kein Filter)
let lastFilterIndex = 0; // Speichert den letzten angewendeten Filter
let thumbTouchingIndex = false; // Flag, um Zustand des Kontakts zu verfolgen
const TOUCH_DISTANCE = 20; // Distanz in Pixeln, die als "Berührung" zählt

// Filter-Array mit verschiedenen Effekten
const FILTERS = [
  'NONE',        // 0: Kein Filter
  'GRAY',        // 1: Schwarzweiß
  'INVERT',      // 2: Invertiert
  'BLUR',        // 3: Unschärfe
  'POSTERIZE',   // 4: Posterize
  'SATURATE',    // 5: Sättigung erhöhen
];

const FILTER_NAMES = [
  'No Filter',
  'Black & White',
  'Inverted',
  'Blur',
  'Posterize',
  'Saturated',
];

/**
 * Lädt das HandPose-Modell vor dem Setup
 * Diese Funktion wird automatisch vor setup() ausgeführt
 */
function preload() {
  handpose = ml5.handPose();
}

/**
 * Initialisiert Canvas und Webcam
 */
function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1); // Performanceoptimierung
  
  // Webcam einrichten
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide(); // Versteckt das Standard-Video-Element
  
  // Berechne Skalierungsfaktor für Video-zu-Canvas-Anpassung
  ratio = width / video.width;
  
  // Starte Hand-Erkennung
  handpose.detectStart(video, gotHands);
}

/**
 * Hauptzeichnungs-Loop
 */
function draw() {
  background(0);

  // Spiegle die Darstellung horizontal (für intuitivere Interaktion)
  push();
  translate(width, 0);
  scale(-1, 1);

  //Zeige das Video (optional)
  image(video, 0, 0, video.width * ratio, video.height * ratio);
  
  // Zeichne nur, wenn das Modell bereit ist und Hände erkannt wurden
  if (isModelReady) {
    drawHandPoints();
    checkThumbIndexTouch(); // Prüfe auf Berührung zwischen Daumen und Zeigefinger
    
    // HIER KÖNNEN EIGENE/Andere ZEICHNUNGEN Oder Interaktionen HINZUGEFÜGT WERDEN
    
  }
  
  pop();
  
  // Wende aktuellen Filter an (nur wenn sich der Filter geändert hat)
  if (currentFilterIndex !== lastFilterIndex || currentFilterIndex > 0) {
    applyFilter(currentFilterIndex);
    lastFilterIndex = currentFilterIndex;
  }
  
  // Zeige aktuellen Filter-Namen
  displayFilterName();
}

/**
 * Callback-Funktion für HandPose-Ergebnisse
 * Wird automatisch aufgerufen, wenn neue Hand-Daten verfügbar sind
 * 
 * @param {Array} results - Array mit erkannten Händen
 */
function gotHands(results) {
  hands = results;
  
  // Setze Flag, sobald erste Hand erkannt wurde
  if (hands.length > 0) {
    isModelReady = true;
  }
}

/**
 * Zeichnet alle erkannten Hand-Keypoints
 * Jede Hand hat 21 Keypoints (siehe Kommentar oben)
 */
function drawHandPoints() {
  // Durchlaufe alle erkannten Hände (normalerweise max. 2)
  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];
    
    // Durchlaufe alle 21 Keypoints einer Hand
    for (let j = 0; j < hand.keypoints.length; j++) {
      let keypoint = hand.keypoints[j];
      
      // Zeichne Keypoint als grüner Kreis
      fill(0, 255, 0);
      noStroke();
      circle(keypoint.x * ratio, keypoint.y * ratio, 10);
    }
  }
}

/**
 * Berechnet die euklidische Distanz zwischen zwei Keypoints
 * 
 * @param {Object} point1 - Erster Punkt mit x und y Koordinaten
 * @param {Object} point2 - Zweiter Punkt mit x und y Koordinaten
 * @returns {Number} Distanz zwischen den beiden Punkten
 */
function getDistance(point1, point2) {
  let dx = point1.x - point2.x;
  let dy = point1.y - point2.y;
  return sqrt(dx * dx + dy * dy);
}

/**
 * Prüft, ob Daumenspitze (Keypoint 4) und Zeigefingerspitze (Keypoint 8) sich berühren
 * und toggelt den Filter bei Berührung
 */
function checkThumbIndexTouch() {
  // Prüfe nur, wenn mindestens eine Hand erkannt wurde
  if (hands.length > 0) {
    let hand = hands[0]; // Nutze die erste Hand
    
    // Hole die Keypoints für Daumenspitze (4) und Zeigefingerspitze (8)
    let thumbTip = hand.keypoints[4];
    let indexTip = hand.keypoints[8];
    
    // Berechne Distanz zwischen den beiden Punkten
    let distance = getDistance(thumbTip, indexTip);
    
    // Wenn Distanz kleiner als TOUCH_DISTANCE und nicht bereits berührend
    if (distance < TOUCH_DISTANCE && !thumbTouchingIndex) {
      thumbTouchingIndex = true;
      // Zyklus zum nächsten Filter
      currentFilterIndex = (currentFilterIndex + 1) % FILTERS.length;
    }
    // Wenn Distanz größer als TOUCH_DISTANCE und wurde zuvor berührt
    else if (distance >= TOUCH_DISTANCE && thumbTouchingIndex) {
      thumbTouchingIndex = false;
    }
  }
}

/**
 * Wendet den ausgewählten Filter auf das Canvas an
 * Filters werden effizient nur bei Bedarf angewendet
 * 
 * @param {Number} filterIndex - Index des anzuwendenden Filters
 */
function applyFilter(filterIndex) {
  let filterName = FILTERS[filterIndex];
  
  // NONE Filter - nichts tun
  if (filterName === 'NONE') {
    return;
  }
  
  // Wende Filter an basierend auf Name
  try {
    switch(filterName) {
      case 'GRAY':
        filter(GRAY);
        break;
      case 'INVERT':
        filter(INVERT);
        break;
      case 'BLUR':
        filter(BLUR, 3); // Kleinerer Radius für bessere Performance
        break;
      case 'POSTERIZE':
        filter(POSTERIZE, 4); // Posterize-Level
        break;
      case 'SATURATE':
        filter(SATURATE, 2.0);
        break;
    }
  } catch(e) {
    console.log('Filter error: ' + e);
  }
}

/**
 * Zeigt den Namen des aktuellen Filters auf dem Bildschirm
 */
function displayFilterName() {
  fill(255);
  textSize(24);
  textAlign(LEFT);
  text('Filter: ' + FILTER_NAMES[currentFilterIndex], 20, 40);
  
  // Zeige kleine Anleitung
  textSize(16);
  text('Touch thumb to index finger to cycle filters', 20, 70);
}

