/*---
 * Hanna Züllig
 * Einfache Klasse um Zugriff auf Mikrophon über die WebAudio API zu ermöglichen 
 * Oder um eine Audiodatei zu laden
 * 
   * Bsp. Mikrofon
    micInstance = new Audio(); //Parameter übergibt Beschriftung des Buttons
    micInstance.createMicButton("Start Mic"); // Erstellt den Button für das Mikrofon
    getSoundLevel();// um die Umgebungs Lautstärke über das Mikrofon zu erfragen

    * Bsp. Audiodatei
    micInstance = new Audio(); 
    micInstance.createFileButton(); // Erstellt den Button um das Audio zu laden
    getSoundLevel(); // um die Lautstärke des AudioFiles zu erfragen
 */

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioCtx.createAnalyser();
analyser.minDecibels = -90;
analyser.maxDecibels = -30;
analyser.smoothingTimeConstant = 0.85;
analyser.fftSize = 128; //repraesentiert die Fenstergrösse des Ausschnitts, der analysiert wird, muss eine Zweierpotenz sein, https://developer.mozilla.org/de/docs/Web/API/AnalyserNode/fftSize
const bufferLength = analyser.frequencyBinCount;//Schnittstelle enthält die Gesamtanzahl der Datenpunkte, die für AudioContext sampleRate verfügbar sind.
const dataArray = new Uint8Array(bufferLength);



class Audio {
    constructor() {
        this.mic;
        this.started = false;
        this.val = null;
        this.source = null;
        this.btn = document.createElement('button');
        this.resumeBtn = null;



        this.OnEvent = OnEvent;
        var that = this;

        this.audioBuffer = null;
        this.startTime = 0;      // Zeitpunkt im Kontext
        this.pauseOffset = 0;    // Wo wir gestoppt haben



        async function OnEvent() {
            that.started = true;

            // Resume AudioContext if it's suspended (especially for Chrome)
            if (audioCtx.state === 'suspended') {
                await audioCtx.resume();
            }

            if (navigator.mediaDevices.getUserMedia) {
                console.log("getUserMedia supported.");
                const constraints = { audio: true, echoCancellation: true };
                try {
                    const stream = await navigator.mediaDevices.getUserMedia(constraints);
                    that.source = audioCtx.createMediaStreamSource(stream);
                    that.source.connect(analyser);

                    // Await the new async method
                    const avg = await that.listenMic();
                    console.log("Average Frequency Data:", avg);
                } catch (err) {
                    console.log("The following gUM error occurred: " + err);
                }
            } else {
                console.log("getUserMedia not supported on your browser!");
            }

            that.btn.style.display = "none";
        }
    }


    createMicButton(val) {
        this.val = val;

        this.btn.setAttribute("value", this.val);
        this.btn.innerHTML = this.val;
        this.btn.style.position = "absolute";
        this.btn.classList.add('micbtn');//ueber diese Klasse kann Button gestylt werden
        this.btn.style.top = "0px";
        this.btn.style.left = "0px";

        this.btn.addEventListener("click", this.OnEvent)
        document.body.append(this.btn);


    }


    createFileButton() {
        this.btn = document.createElement('input');
        this.btn.setAttribute("type", "file");
        this.btn.setAttribute("accept", "audio/*");
        this.btn.setAttribute("id", "micFileInput");

        this.btn.style.position = "absolute";
        this.btn.classList.add('filebtn');//ueber diese Klasse kann Button gestylt werden
        this.btn.style.top = "0px";
        this.btn.style.left = "0px";

        this.btn.addEventListener("change",
            async (event) => {
                const file = event.target.files[0];
                if (file) {
                    await this.loadAudioFile(file);
                }
            })
        document.body.append(this.btn);

    }



    async listenMic() {
        // Wait a short time to let audio data populate
        await new Promise(resolve => setTimeout(resolve, 100));


        /*
        Die Methode getByteFrequencyData(array) füllt das übergebene Uint8Array mit Frequenz-Amplitudenwerten.
        Diese Werte stellen skalierten Dezibelwerte dar, wobei:
        0 dem analyser.minDecibels entspricht
        255 dem analyser.maxDecibels entspricht
        */
        analyser.getByteFrequencyData(dataArray);//Frequenzdaten bestehen aus ganzen Zahlen auf einer Skala von 0 bis 255
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
        }
        return Math.floor(sum / bufferLength);
    }


    async loadAudioFile(file) {
        const arrayBuffer = await file.arrayBuffer();
        this.audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

        if (this.source) {
            this.source.disconnect();
        }

        const bufferSource = audioCtx.createBufferSource();
        bufferSource.buffer = this.audioBuffer;
        bufferSource.loop = false;
        bufferSource.connect(analyser);
        bufferSource.connect(audioCtx.destination);
        bufferSource.start();

        this.source = bufferSource;

        this.startTime = audioCtx.currentTime;


        this.btn.style.display = "none";
        this.started = true;


        this.resumeBtn = document.createElement('button');
        this.resumeBtn.setAttribute("value", "Pause Audio");
        this.resumeBtn.innerHTML = "Pause Audio";
        this.resumeBtn.style.position = "absolute";
        this.resumeBtn.classList.add('micbtn');//ueber diese Klasse kann Button gestylt werden
        this.resumeBtn.style.top = "0px";
        this.resumeBtn.style.left = "0px";


        this.resumeBtn.addEventListener("click", () => this.stopstartAudio());
        document.body.append(this.resumeBtn);

    }


    stopstartAudio() {
        if (this.source && this.started) {


            this.source.stop();
            this.pauseOffset += audioCtx.currentTime - this.startTime; // Wie lang haben wir gespielt
            this.started = false;
            this.resumeBtn.setAttribute("value", "Start Audio");
            this.resumeBtn.innerHTML = "Start Audio";

        } else if (this.source && !this.started) {
            this.resume();
            this.started = true;

            this.resumeBtn.setAttribute("value", "Stop Audio");
            this.resumeBtn.innerHTML = "Stop Audio";
        }

    }

    resume() {

        if (!this.audioBuffer) return;

        // Falls bereits läuft: nicht doppelt starten
        if (this.started) return;

        this.source = audioCtx.createBufferSource();
        this.source.buffer = this.audioBuffer;
        this.source.connect(audioCtx.destination);
        this.source.connect(analyser);




        this.startTime = audioCtx.currentTime;


        this.source.start(0, this.pauseOffset); // Start bei gespeicherter Position


        this.started = true;

        this.source.onended = () => {
            this.started = false;
        };
    }

}

// Funktionen um von aussen auf die Klasse Audio zuzugreifen
// Zweck ist, dass die Klasse Audio nicht direkt instanziiert werden muss
// Klassen Syntax möglichst verbergen
//-----------------------------------------------------------


// asynchrone funktion, um die Lautstärke des Mikrofons zu erfragen
async function getSoundLevel(instance) {
    let level = await instance.listenMic();
    return level;
}

// asynchrone funktion, um ein File in die Audio klasse per Pfad zu laden
async function loadAudioFile(instance, file) {
    const response = await fetch(file);

    instance.btn.setAttribute("value", "Play Audio");
    instance.btn.innerHTML = "Play Audio";
    instance.btn.style.position = "absolute";
    instance.btn.classList.add('micbtn');//ueber diese Klasse kann Button gestylt werden
    instance.btn.style.top = "0px";
    instance.btn.style.left = "0px";

    instance.btn.addEventListener("click",
        async () => {
            await instance.loadAudioFile(response);
        }
    )
    document.body.append(instance.btn);


}

// kreiert eine Instanz der Klasse Audio und gibt diese zurück
function newCustomAudio() {
    let Instance = new Audio(); //Hier wird eine Instanz der Audio Klasse erstellt
    return Instance;
}


