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
let fingersTouching = false; // Flag, um Zustand der Fingerspitzen-Berührung zu verfolgen
const TOUCH_DISTANCE = 100; // Distanz in Pixeln, die als "Berührung" zählt

// Finger-Indizes für die Spitzen
const FINGER_TIPS = [4, 8, 12, 16]; // Daumen, Zeige-, Mittel-, Ringfinger

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
  
  // Berechne Distanz-Schwellenwerte
  MIN_DISTANCE = 100; // Minimale Distanz in Pixeln
  MAX_DISTANCE = 2000; // Maximale Distanz in Pixeln
  
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
  
  // Inkrementiere Frame-Zähler und wechsle Farbe alle 30 Frames (doppelt so schnell)
  frameCounter++;
  if (frameCounter >= 30) {
    frameCounter = 0;
    currentColor = random(RAINBOW_COLORS);
  }
  
  // Initialisiere Farbe beim ersten Frame
  if (currentColor === null) {
    currentColor = random(RAINBOW_COLORS);
  }

  // Spiegle die Darstellung horizontal (für intuitivere Interaktion)
  push();
  translate(width, 0);
  scale(-1, 1);

  //Zeige das Video (optional)
  image(video, 0, 0, video.width * ratio, video.height * ratio);
  
  // Zeichne nur, wenn das Modell bereit ist und Hände erkannt wurden
  if (isModelReady) {
    drawHandPoints();
    checkHandSweep(); // Prüfe auf Handbewegung über das Fenster
    checkHandMovement(); // Prüfe auf Handbewegung
    checkFingerTips(); // Prüfe auf Berührung zwischen Fingerspitzen beider Hände
    checkPalmPosition(); // Prüfe auf Handflächenposition zum Platzieren
    
    // Zeige roten Ellipse, wenn Fingerspitzen innerhalb Reichweite sind und nicht gefroren
    if (frozenEllipse === null) {
      drawTouchIndicator();
    } else {
      // Zeichne die gefrorene Ellipse
      drawFrozenEllipse();
    }
    
    // Zeichne alle platzierten Ellipsen
    drawPlacedEllipses();
    
    // HIER KÖNNEN EIGENE/Andere ZEICHNUNGEN Oder Interaktionen HINZUGEFÜGT WERDEN
    
  }
  
  pop();
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

// Speichert die Positionen der nächsten Fingerspitzen
let closestLeftTip = null;
let closestRightTip = null;
let closestDistance = Infinity; // Speichert die Distanz zwischen den nächsten Fingerspitzen
let MIN_DISTANCE = 10; // Minimale Distanz (wird in setup() berechnet)
let MAX_DISTANCE = 2000; // Maximale Distanz (wird in setup() berechnet)
let frameCounter = 0; // Zähler für Farbwechsel
let currentColor = null; // Aktuelle Ellipse-Farbe
let placedEllipses = []; // Array für alle platzierten Ellipsen
let canPlaceEllipse = false; // Flag, ob eine Ellipse platziert werden kann
let lastPlacedFrame = -1000; // Speichert den Frame, in dem die letzte Ellipse platziert wurde
let frozenEllipse = null; // Speichert die gefrorene Ellipse
let previousHandPositions = null; // Speichert die vorherigen Handpositionen
let stillFrameCount = 0; // Zählt, wie viele Frames die Hand still steht
const STILL_FRAMES_REQUIRED = 30; // 30 Frames bei 60 FPS = 0.5 Sekunde
let smoothedEllipseX = 0; // Geglättete X-Position
let smoothedEllipseY = 0; // Geglättete Y-Position
const SMOOTHING_FACTOR = 0.1; // Glättungsfaktor (0-1, niedriger = glatter)
let lastHandXPositions = {left: null, right: null}; // Speichert letzte X-Positionen der Hände

// Rainbow Farben
const RAINBOW_COLORS = [
  [255, 0, 0],     // Rot
  [255, 127, 0],   // Orange
  [255, 255, 0],   // Gelb
  [0, 255, 0],     // Grün
  [0, 0, 255],     // Blau
  [75, 0, 130],    // Indigo
  [148, 0, 211]    // Violett
];

/**
 * Prüft, ob Fingerspitzen (4, 8, 12, 16) beider Hände sich berühren
 */
function checkFingerTips() {
  // Prüfe nur, wenn zwei Hände erkannt wurden
  if (hands.length === 2) {
    let leftHand = hands[0];
    let rightHand = hands[1];
    
    let minDistance = Infinity;
    let closestLeft = null;
    let closestRight = null;
    
    // Vergleiche alle Fingerspitzen-Paare zwischen linker und rechter Hand
    for (let i = 0; i < FINGER_TIPS.length; i++) {
      for (let j = 0; j < FINGER_TIPS.length; j++) {
        let leftTip = leftHand.keypoints[FINGER_TIPS[i]];
        let rightTip = rightHand.keypoints[FINGER_TIPS[j]];
        
        let distance = getDistance(leftTip, rightTip);
        if (distance < minDistance) {
          minDistance = distance;
          closestLeft = leftTip;
          closestRight = rightTip;
        }
      }
    }
    
    // Speichere die nächsten Fingerspitzen und die Distanz
    closestLeftTip = closestLeft;
    closestRightTip = closestRight;
    closestDistance = minDistance;
    
    // Wenn minimale Distanz kleiner als TOUCH_DISTANCE und nicht bereits berührend
    if (minDistance < TOUCH_DISTANCE && !fingersTouching) {
      fingersTouching = true;
    }
    // Wenn minimale Distanz größer als MAX_DISTANCE oder größer als TOUCH_DISTANCE
    else if ((minDistance >= MAX_DISTANCE || minDistance >= TOUCH_DISTANCE) && fingersTouching) {
      fingersTouching = false;
    }
  } else {
    // Wenn nicht genau zwei Hände erkannt werden, Zustand zurücksetzen
    fingersTouching = false;
    closestLeftTip = null;
    closestRightTip = null;
    closestDistance = Infinity;
  }
}

/**
 * Prüft, ob eine Hand über das Fenster feegt (sweep gesture)
 * Wenn eine Hand von links nach rechts oder von rechts nach links swept, lösche alle Ellipsen
 */
function checkHandSweep() {
  if (hands.length > 0) {
    let leftHandX = null;
    let rightHandX = null;
    
    // Berechne durchschnittliche X-Position für jede erkannte Hand
    if (hands.length >= 1) {
      let sumX = 0;
      for (let keypoint of hands[0].keypoints) {
        sumX += keypoint.x;
      }
      leftHandX = sumX / hands[0].keypoints.length;
    }
    
    if (hands.length >= 2) {
      let sumX = 0;
      for (let keypoint of hands[1].keypoints) {
        sumX += keypoint.x;
      }
      rightHandX = sumX / hands[1].keypoints.length;
    }
    
    // Prüfe auf Sweep-Bewegung mit hoher Sensitivität
    if (leftHandX !== null && lastHandXPositions.left !== null) {
      let xDifference = abs(leftHandX - lastHandXPositions.left);
      // Wenn Hand sich sehr schnell nach links oder rechts bewegt (> 80 Pixel in einem Frame)
      if (xDifference > 80) {
        placedEllipses = []; // Lösche alle platzierten Ellipsen
        resetFrozenEllipse(); // Lösche auch die gefrorene Ellipse
      }
    }
    
    if (rightHandX !== null && lastHandXPositions.right !== null) {
      let xDifference = abs(rightHandX - lastHandXPositions.right);
      // Wenn Hand sich sehr schnell nach links oder rechts bewegt (> 80 Pixel in einem Frame)
      if (xDifference > 80) {
        placedEllipses = []; // Lösche alle platzierten Ellipsen
        resetFrozenEllipse(); // Lösche auch die gefrorene Ellipse
      }
    }
    
    // Speichere aktuelle Positionen für nächsten Frame
    lastHandXPositions.left = leftHandX;
    lastHandXPositions.right = rightHandX;
  }
}

/**
 * Prüft, ob alle Handpunkte für eine halbe Sekunde stillgestanden haben
 */
function checkHandMovement() {
  if (hands.length > 0 && frozenEllipse === null && closestLeftTip && closestRightTip && closestDistance >= MIN_DISTANCE && closestDistance <= MAX_DISTANCE) {
    // Sammle alle Keypoints beider Hände
    let allKeypoints = [];
    for (let hand of hands) {
      for (let keypoint of hand.keypoints) {
        allKeypoints.push(keypoint);
      }
    }
    
    // Beim ersten Frame speichere die Positionen
    if (previousHandPositions === null) {
      previousHandPositions = allKeypoints.map(p => ({x: p.x, y: p.y}));
      stillFrameCount = 0;
      return;
    }
    
    // Berechne dynamischen Schwellenwert basierend auf Fingerspitzen-Distanz
    // Je größer die Distanz, desto höher der Schwellenwert (mehr Toleranz)
    let movementThreshold = map(closestDistance, MIN_DISTANCE, MAX_DISTANCE, 2, 15);
    
    // Prüfe, ob alle Punkte sich um weniger als dynamischer Schwellenwert bewegt haben
    let allStill = true;
    for (let i = 0; i < allKeypoints.length; i++) {
      let distance = getDistance(allKeypoints[i], previousHandPositions[i]);
      if (distance > movementThreshold) {
        allStill = false;
        break;
      }
    }
    
    // Wenn alle Punkte still sind, inkrementiere den Zähler
    if (allStill) {
      stillFrameCount++;
      
      // Wenn genug Frames vergangen sind, friere die Ellipse ein
      if (stillFrameCount >= STILL_FRAMES_REQUIRED) {
        frozenEllipse = {
          x: smoothedEllipseX,
          y: smoothedEllipseY,
          size: map(closestDistance, MIN_DISTANCE, MAX_DISTANCE, 100, 5000),
          color: [...currentColor]
        };
        stillFrameCount = 0; // Setze Zähler zurück
      }
    } else {
      // Wenn die Hand sich bewegt, setze den Zähler zurück
      stillFrameCount = 0;
    }
    
    // Aktualisiere die vorherigen Positionen
    previousHandPositions = allKeypoints.map(p => ({x: p.x, y: p.y}));
  }
}

/**
 * Zeichnet die gefrorene Ellipse
 */
function drawFrozenEllipse() {
  if (frozenEllipse) {
    fill(frozenEllipse.color[0], frozenEllipse.color[1], frozenEllipse.color[2], 127);
    noStroke();
    ellipse(frozenEllipse.x, frozenEllipse.y, frozenEllipse.size, frozenEllipse.size);
  }
}

/**
 * Setzt die gefrorene Ellipse zurück (wird durch Handflächenposition ausgelöst)
 */
function resetFrozenEllipse() {
  frozenEllipse = null;
  previousHandPositions = null;
  stillFrameCount = 0;
}

/**
 * Zeichnet einen Ellipse mit Regenbogenfarbe, der den nächsten Fingerspitzen folgt
 * Die Größe des Ellipse hängt von der Distanz zwischen den Fingerspitzen ab
 * Je größer die Distanz, desto größer der Ellipse
 */
function drawTouchIndicator() {
  if (closestLeftTip && closestRightTip && closestDistance >= MIN_DISTANCE && closestDistance <= MAX_DISTANCE) {
    // Berechne die Mittelpunkt zwischen den beiden nächsten Fingerspitzen
    let targetX = (closestLeftTip.x + closestRightTip.x) / 2 * ratio;
    let targetY = (closestLeftTip.y + closestRightTip.y) / 2 * ratio;
    
    // Glätte die Position für weniger Wackeln
    smoothedEllipseX = lerp(smoothedEllipseX, targetX, SMOOTHING_FACTOR);
    smoothedEllipseY = lerp(smoothedEllipseY, targetY, SMOOTHING_FACTOR);
    
    // Berechne die Größe basierend auf der Distanz (invertiert)
    // Bei MIN_DISTANCE (10) = minimale Größe (100)
    // Bei MAX_DISTANCE (2000) = maximale Größe (5000)
    let ellipseSize = map(closestDistance, MIN_DISTANCE, MAX_DISTANCE, 100, 5000);
    
    fill(currentColor[0], currentColor[1], currentColor[2], 127); // Regenbogenfarbe mit Opacity 0.5
    noStroke();
    
    // Zeichne den Ellipse mit berechneter Größe an der berechneten Position
    ellipse(smoothedEllipseX, smoothedEllipseY, ellipseSize, ellipseSize);
  }
}

/**
 * Prüft, ob beide Hände ihre Handfläche zeigen (Keypoints 0-3)
 */
function checkPalmPosition() {
  if (hands.length === 2) {
    let leftHand = hands[0];
    let rightHand = hands[1];
    
    // Berechne die durchschnittliche Position der Handfläche (Keypoints 0-3)
    let leftPalmPoints = [leftHand.keypoints[0], leftHand.keypoints[1], leftHand.keypoints[2], leftHand.keypoints[3]];
    let rightPalmPoints = [rightHand.keypoints[0], rightHand.keypoints[1], rightHand.keypoints[2], rightHand.keypoints[3]];
    
    // Berechne die Mittelpunkte der Handflächen
    let leftCenter = {x: 0, y: 0};
    let rightCenter = {x: 0, y: 0};
    
    for (let p of leftPalmPoints) {
      leftCenter.x += p.x;
      leftCenter.y += p.y;
    }
    leftCenter.x /= leftPalmPoints.length;
    leftCenter.y /= leftPalmPoints.length;
    
    for (let p of rightPalmPoints) {
      rightCenter.x += p.x;
      rightCenter.y += p.y;
    }
    rightCenter.x /= rightPalmPoints.length;
    rightCenter.y /= rightPalmPoints.length;
    
    // Prüfe, ob Handflächen sich nahe genug beieinander sind und ob genügend Frames vergangen sind
    let palmDistance = getDistance(leftCenter, rightCenter);
    
    if (palmDistance < 150 && frameCount - lastPlacedFrame > 30) {
      // Platziere die aktuelle Ellipse
      canPlaceEllipse = true;
      lastPlacedFrame = frameCount;
    } else {
      canPlaceEllipse = false;
    }
  } else {
    canPlaceEllipse = false;
  }
  
  // Wenn Bedingung erfüllt und wir noch eine aktive Ellipse haben, platziere sie
  if (canPlaceEllipse && frozenEllipse !== null) {
    // Platziere die gefrorene Ellipse
    let placedEllipse = {
      x: frozenEllipse.x,
      y: frozenEllipse.y,
      size: frozenEllipse.size,
      color: [...frozenEllipse.color]
    };
    
    placedEllipses.push(placedEllipse);
    canPlaceEllipse = false; // Verhindere mehrfaches Platzieren
    resetFrozenEllipse(); // Setze die gefrorene Ellipse zurück und bereit für neue Ellipse
  }
}

/**
 * Zeichnet alle platzierten Ellipsen
 */
function drawPlacedEllipses() {
  for (let ellipse of placedEllipses) {
    fill(ellipse.color[0], ellipse.color[1], ellipse.color[2], 127);
    noStroke();
    circle(ellipse.x, ellipse.y, ellipse.size);
  }
}

