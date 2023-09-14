quick_draw_data_set = ["aircraft carrier", "airplane", /* ... */ "zigzag"];

function updateCanvas() {
 
  background(255);


  random_number = Math.floor(Math.random() * quick_draw_data_set.length);
  sketch = quick_draw_data_set[random_number];

  document.getElementById("sketchToBeDrawn").textContent = "Sketch To be Drawn: " + sketch;
}

timer_counter = 0;
timer_check = "";
drawn_sketch = "";
answer_holder = "";
score = 0;

function setup() {
  canvas = createCanvas(280, 280);
  canvas.center();
  background(255); 

  updateCanvas();

  draw = function() {
    check_sketch();
  };
}

function check_sketch() {
  timer_counter++;

  document.getElementById("timer").textContent = "Timer: " + timer_counter;

  if (timer_counter > 400) {
    timer_counter = 0;
    timer_check = "completed";

    if (timer_check === "completed" || answer_holder === "set") {
      timer_check = "";
      answer_holder = "";
      updateCanvas();
    }
  }
}

function preload() {
  classifier = ml5.imageClassifier("DoodleNet", () => {
    console.log("Model loaded.");
  });
}

function classifyCanvas() {
  classifier.classify(canvas, gotResult);
}

function gotResult(error, results) {
  if (error) {
    console.error(error);
    return;
  }

  drawn_sketch = results[0].label;

  document.getElementById("yourSketch").textContent = "Your Sketch: " + drawn_sketch;

  confidence = results[0].confidence * 100;

  document.getElementById("confidence").textContent = "Confidence: " + confidence.toFixed(2) + "%";

}
drawing = false;
prevX, prevY;

function setup() {
  

  canvas = createCanvas(250, 250);
  canvas.center();
  background(255);

  updateCanvas();


  draw = function() {
    check_sketch();
    if (drawing) {
      stroke(0); 
      strokeWeight(4); 
      line(prevX, prevY, mouseX, mouseY);
      prevX = mouseX;
      prevY = mouseY;
    }
  };

  canvas.mousePressed(() => {
    drawing = true;
    prevX = mouseX;
    prevY = mouseY;
  });
  canvas.mouseReleased(() => {
    drawing = false;
    classifyCanvas();
  });
}
