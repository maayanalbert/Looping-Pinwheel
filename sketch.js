// This is a template for creating a looping animation in p5.js (JavaScript). 
// When you press the 'F' key, this program will export a series of images into
// your default Downloads folder. These can then be made into an animated gif. 
// This code is known to work with p5.js version 0.6.0
// Prof. Golan Levin, 28 January 2018

// INSTRUCTIONS FOR EXPORTING FRAMES (from which to make a GIF): 
// 1. Run a local server, using instructions from here:
//    https://github.com/processing/p5.js/wiki/Local-server
// 2. Set the bEnableExport variable to true.
// 3. Set the myNickname variable to your name.
// 4. Run the program from Chrome, press 'f'. 
//    Look in your 'Downloads' folder for the generated frames.
// 5. Note: Retina screens may export frames at twice the resolution.


//===================================================
// User-modifiable global variables. 
var myNickname = "nickname";
var nFramesInLoop = 120;
var bEnableExport = true;
var dots = [];
var radius = 1200;
var dotSize = 45;
var worms = [];
var numWorms = 5
var colors = [[131, 78, 237], [50, 204, 204], [75, 206, 75], [252, 200, 86],
              [206, 80, 200]]
var curColor = [131, 78, 237]
var curColorInd = 0;

// Other global variables you don't need to touch.
var nElapsedFrames;
var bRecording;
var theCanvas;

//===================================================
function setup() {
  theCanvas = createCanvas(710, 400);
  bRecording = false;
  nElapsedFrames = 0;
  angleMode(DEGREES)

  for(j = 0; j <= numWorms; j++){
    var r = lerp(colors[0], 0, (j)/(numWorms));
    var g = lerp(colors[0], 0, (j)/(numWorms));
    var b = lerp(colors[0], 0, (j)/(numWorms));

    var color = [r, g, b] 
    var worm = new Worm(color)
    worm.setup()
    worms.push(worm)   
  }
}

//===================================================
function keyTyped() {
  if (bEnableExport) {
    if ((key === 'f') || (key === 'F')) {
      bRecording = true;
      nElapsedFrames = 0;
    }
  }
}

//===================================================
function draw() {
    translate(500, 500)
    scale(.7, .7)

  // Compute a percentage (0...1) representing where we are in the loop.
  var percentCompleteFraction = 0;
  if (bRecording) {
    percentCompleteFraction = float(nElapsedFrames) / float(nFramesInLoop);
  } else {
    percentCompleteFraction = float(frameCount % nFramesInLoop) / float(nFramesInLoop);
  }

  // Render the design, based on that percentage. 
  // This function renderMyDesign() is the one for you to change. 
  renderMyDesign(percentCompleteFraction);
  // If we're recording the output, save the frame to a file. 
  // Note that the output images may be 2x large if you have a Retina mac. 
  // You can compile these frames into an animated GIF using a tool like: 
  if (bRecording && bEnableExport) {
    var frameOutputFilename = myNickname + "_frame_" + nf(nElapsedFrames, 4) + ".png";
    print("Saving output image: " + frameOutputFilename);
    saveCanvas(theCanvas, frameOutputFilename, 'png');
    nElapsedFrames++;

    if (nElapsedFrames >= nFramesInLoop) {
      bRecording = false;
    }
  }
}

//===================================================
function renderMyDesign (percent) {
  //
  // THIS IS WHERE YOUR ART GOES. 
  // This is an example of a function that renders a temporally looping design. 
  // It takes a "percent", between 0 and 1, indicating where we are in the loop. 
  // Use, modify, or delete whatever you prefer from this example. 
  // This example uses several different graphical techniques. 
  // Remember to SKETCH FIRST!

  //----------------------
  



  // here, I set the background and some other graphical properties
  background(255);
  smooth();
  stroke(0, 0, 0);
  strokeWeight(2);

  
  if(percent == 0.75){
    curColorInd +=1;
    curColorInd = curColorInd % colors.length;
    curColor = colors[curColorInd];
  }

  for(j = 0; j < worms.length; j++){
    var r = lerp(curColor[0], 255, (j)/(numWorms));
    var g = lerp(curColor[1], 255, (j)/(numWorms));
    var b = lerp(curColor[2], 255, (j)/(numWorms));
    var color = [r, g, b];

    var worm = worms[j];
    worm.col = color
    worm.update((percent + .04 *j)%1, j);
  }

  
}

function Worm(c){
  this.dots = []
  this.col = c
  this.setup = function(){
    for(i = 0; i< 60; i++){
      dots.push(new Dot(i * .003))
    }
  }
  this.update = function(percent, sizeOff){
    for(i = 0; i < dots.length; i++){
      d = dots[i];
      d.calculatePos(percent);
      d.draw(this.col, sizeOff);
    }
  }
}

function Dot(off){
  this.offset = off
  this.x = 0
  this.y = 0
  this.radius = map(this.offset, 0, 1, 0, radius)
  this.angle = 0
  this.eased = 0

  this.calculatePos = function(percent){
    this.eased = quadraticInOut((percent + this.offset)%1);
    this.eased = (this.eased - 0.25)%1.0; // shifted by a half-loop, for fun
    this.angle = map(this.eased, 0, 1, 0, 360); 

    this.x = cos(this.angle)*this.radius + width/2;
    this.y = sin(this.angle)*this.radius + height/2;
  }

  this.draw = function(color, sizeOff){
    fill(color);
    noStroke();
    ellipse(this.x, this.y, dotSize + sizeOff*2, dotSize + sizeOff*2);
  }
}


// symmetric double-element sigmoid function (a is slope)
// See https://github.com/IDMNYU/p5.js-func/blob/master/lib/p5.func.js
// From: https://idmnyu.github.io/p5.js-func/
//===================================================

function gompertz(_x, _a){
    if(!_a) _a = 0.25; // default
    var min_param_a = 0.0 + Number.EPSILON;
    _a = max(_a, min_param_a);

    var b = -8.0;
    var c = 0 - _a*16.0;
    var _y = exp( b * exp(c * _x));

    var maxVal = exp(b * exp(c));
    var minVal = exp(b);
    _y = map(_y, minVal, maxVal, 0, 1);

    return(_y);
}

function quadraticInOut(_x) {
    if(_x < 0.5)
    {
      return(8 * _x * _x * _x * _x);
    }
    else
    {
      var _v = (_x - 1);
      return(-8 * _v * _v * _v * _v + 1);
    }
}
function sineOut(_x) {
    return(sin(_x * HALF_PI));
  }

function cubicIn(_x) {
    return(_x * _x * _x);
}
