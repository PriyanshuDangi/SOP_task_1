var myGameArea = {
  canvas: document.createElement('canvas'),
  start: function(){
      this.canvas.width = innerWidth;
      this.canvas.height = innerHeight;
      this.context = this.canvas.getContext('2d');
      this.context.textAlign = "center";
      this.frameNo = 0;
      document.body.insertBefore(this.canvas, document.body.childNodes[0]);
  },
  intervalFunction: function(){
      this.interval = setInterval(animate, 20);
  },
  clear: function(){
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  stop: function(){
      clearInterval(this.interval);
      canvasElement.removeEventListener('click', removeOnClick);
      canvasElement.removeEventListener('click', clickImage);
      endSound.play();
      backgroundMusic.pause();
      bestScoreFunction();
      if(bestScore){
          if(bestScore <  score){
              localStorage.setItem('ballburst', JSON.stringify(score));
              bestScore = score;
          }
      } else{
          localStorage.setItem('ballburst', JSON.stringify(score));
          bestScore = score;
      }
      var bestScoresObject = bestScores.concat(score);
      var bestScoresJSON = JSON.stringify(bestScoresObject);
      localStorage.setItem('ballburst', bestScoresJSON);            
      // bestScoreFunction();
      //to wait for play again
      setTimeout(() => {
          var ctx = this.context;
          ctx.fillStyle = "rgba(1,1,1,0.7)";
          ctx.textAlign = "center";
          var centerWidth = myGameArea.canvas.width/2;
          var centerHeight = myGameArea.canvas.height/2;
          ctx.fillRect(centerWidth - 135, centerHeight-50, 270, 100);
          ctx.font = "25px Consolas";
          ctx.fillStyle = "white";
          ctx.textContent = "center";
          ctx.fillText("Your score is " + score, centerWidth, centerHeight-20);
          ctx.fillText("Highest Score: " + bestScore, centerWidth, centerHeight +10); 
          ctx.font = "15px Consolas";
          setTimeout(() => {
              ctx.fillText("click anywhere to play again", centerWidth, centerHeight + 40);
              canvasElement.addEventListener('click', init);
          },700)
      }, 100);
  }
}

var canvasElement;
var c;

var mouse = {
  x: undefined,
  y: undefined
}

var colors = ["#FAE100", "#32DBF0", "#FF0181", "#900DFF"];

// canvasElement.addEventListener('click', removeOnClick);

function removeOnClick(event){
  mouse.x = event.clientX
  mouse.y = event.clientY
  particles.forEach(particle =>{
    particle.check()
  })
}


// var toggle;
//toggle the pause and play image on click
function clickImage(e){
    mouse.x = event.x;
    mouse.y = event.y;
    var toggle = pauseandplay.check();
    pauseandplay.update();
    if(toggle){
        canvasElement.removeEventListener('click', removeOnClick);
        if(pauseandplay.state == 0){ //pause
            clearInterval(myGameArea.interval);
            clearInterval(timer);
            // var c = myGameArea.context;
            c.fillStyle = "rgba(1,1,1,0.7)";
            c.fillRect(myGameArea.canvas.width/2 - 150, myGameArea.canvas.height/2-50, 300, 100);
            c.font = "40px Consolas";
            c.fillStyle = "white";
            c.textContent = "center";
            c.fillText("Paused", myGameArea.canvas.width/2, myGameArea.canvas.height/2-10);
            c.font = "15px Consolas";
            c.fillText("Click the icon again to resume", myGameArea.canvas.width/2, myGameArea.canvas.height/2+20);
        }else{ //play
            setTimeout(function(){
                canvasElement.addEventListener('click', removeOnClick);
                myGameArea.intervalFunction();
                if(timer){
                  endTimer();
                }
              
            }, 300);
        }
    }
    if(gauntlet.check() && gauntletCount == 1){
      // particles.splice(0, parseInt(particles.length/2));
      particles.forEach((particle, index) =>{
        if(index < particles.length/2){
          particles[index].removeArea();
        }
      })
      particles.splice(0, parseInt(particles.length/2));
      gauntletCount--;
    }
    if(felixFelicis.check()){
      var count = 5;
      bubbleGenration = 300;
      felixFelicisCount--;
      var interval = setInterval(() => {
        count--;
        bubbleGenration = 300;
      }, 1000);
      if(count == 0){
        clearInterval(interval);
      }
    }
}

function imageButton(src1, src2, x, y, width, height){
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.state = 1;

  this.image = new Image();
  this.draw = function(){
      // var c = myGameArea.context;
      c.drawImage(this.src, this.x, this.y, this.width, this.height);
  }
  this.update = function(){
      if(this.state == 1){
          this.src = src1;
      }else{
          this.src = src2;
      }
      this.draw();
  }
  this.check = function(){
          if(mouse.x - (this.x + this.width/2) <= this.width/2 && mouse.x - (this.x + this.width/2) >= -this.width/2 && mouse.y - (this.y + this.height/2) <= this.height/2 && mouse.y - (this.y + this.height/2) >= -this.height/2){
              this.state = this.state == 1 ? 0 : 1;
              return true;
          }
          return false;
  }
}

function powerup(src, sx, sy, x, y, type){
  this.src = src;
  this.sx = sx;
  this.sy = sy;
  this.sWidth = 640;
  this.sHeight = 1280;
  this.x = x;
  this.y = y;
  this.width = 50;
  this.height = 100;
  this.type = type;
  // this.image = new Image();

  this.draw = function(){
      var ctx = myGameArea.context;
      ctx.drawImage(this.src, this.sx, this.sy, this.sWidth, this.sHeight, this.x, this.y, this.width, this.height);
  }

  this.check = function(){
    if(mouse.x - (this.x + this.width/2) <= this.width/2 && mouse.x - (this.x + this.width/2) >= -this.width/2 && mouse.y - (this.y + this.height/2) <= this.height/2 && mouse.y - (this.y + this.height/2) >= -this.height/2){
      // this.state = this.state == 1 ? 0 : 1;
      return true;
    }
    return false;
  }
}

function rectangle(x, y, color, width, height, type){
  this.x = x;
  this.y = y;
  this.color = color;
  this.width = width;
  this.height = height;
  this.type = type;
  // this.dy = 0;

  this.draw = function(){
      var ctx = myGameArea.context;
      if(this.type == "score"){
          ctx.font = this.width + " " + this.height;
          ctx.fillStyle = this.color;
          ctx.fillText(score, this.x, this.y);
      } else if(this.type = "timeLeft"){
          ctx.fillStyle = this.color;
          // ctx.fillRect(this.x, this.y, 200, this.height);
          ctx.save();
          ctx.textAlign = "left";
          ctx.font = "25px serif";
          ctx.fillText("Time Left: " + time, this.x, this.y);
          ctx.restore();
          // ctx.fillRect(this.x + this.width/2 + 70, this.y, this.width/2 - 70, this.height);
      } else{
          ctx.fillStyle = this.color;
          ctx.fillRect(this.x, this.y, this.width, this.height);
      }
  }

  // this.update = function(){
  //     this.radians += this.velocity;
  //     if(this.y - this.yOnTap > 35){
  //         this.dy = 0;
  //     }
  //     this.y += this.dy;
  //     this.draw();
  // }
}

// Objects
class particle {
  constructor(x, y, radius, type) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = randomColor(colors)
    this.type = type
    this.velocity = {
      x: (Math.random() - 0.5) * 2,
      y: (Math.random() - 0.5) * 2
    }
    this.mass = 1
    this.opacity = 0
    this.firstTime = 0
    this.rockCount = 5; // for rocks
  }
  

  draw() {
    if(this.type == "rock"){
      c.beginPath()
      c.arc(this.x, this.y, this.radius, 0, Math.PI*2, false)
      c.fillStyle = "#808487"
      c.fill();
      c.closePath()
      c.beginPath()
      c.arc(this.x, this.y + 10, 3, 0, 2*Math.PI);
      c.stroke();
      c.closePath()
      c.beginPath()
      c.arc(this.x + 10, this.y , 3, 0, 2*Math.PI)
      c.stroke();
      c.closePath()
      c.beginPath()
      c.arc(this.x +20, this.y + 10, 3, 0, 2*Math.PI)
      c.stroke();
      c.closePath()
      c.stroke();
    }else{
      c.beginPath()
      c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
      // c.save()
      // c.globalAlpha = this.opacity
      if(everyInterval(20)){
        this.color = randomColor(colors);
      }
      c.fillStyle = this.color
      c.fill()
      // c.restore()
      // c.strokeStyle = this.color
      // c.stroke()
      c.closePath()
    }
    
  }

  update(particles) {
    for(let i =0; i < particles.length; i++){
      if(this == particles[i]){
        continue;
      }
        if(distance(this.x, this.y, particles[i].x, particles[i].y) - this.radius - particles[i].radius < 0){
            // console.log("collided");
            resolveCollision(this, particles[i])
        }
    }

    if(this.x - this.radius <= 0 || this.x + this.radius >= innerWidth){
      this.velocity.x = -this.velocity.x;
    }
    if(this.y - this.radius <= 0 || this.y + this.radius >= innerHeight){
      this.velocity.y = -this.velocity.y;
    }
    
    if(this.firstTime == 0){
      this.firstTime++;
      this.addArea();
    }

    //mouse collision detection
    // if(distance(mouse.x, mouse.y, this.x, this.y) < 100 && this.opacity < 0.2){
    //   // console.log(1)
    //   this.opacity += 0.02
    // }else if(this.opacity > 0){
    //   this.opacity -= 0.02
    //   this.opacity = Math.max(0, this.opacity)
    // }

    this.x += this.velocity.x;
    this.y += this.velocity.y;
    // this.check()
    this.draw()
  }

  check(){
    if(distance(mouse.x, mouse.y, this.x, this.y) <= this.radius){
      touchSound.play();
      if(this.type == "rock"){
        var index = particles.indexOf(this);
        this.rockCount--;
        if(this.rockCount == 0){
          particles.splice(index, 1);
          this.removeArea();
          score += 10;
        }
      }else{
        var index = particles.indexOf(this);
        score++;
        particles.splice(index, 1);
        this.removeArea();
      }
    }
  }

  addArea(){
    // myArea += Math.PI * this.radius * this.radius;
    myArea += 4 * this.radius * this.radius;
  }

  removeArea(){
    // myArea -= Math.PI * this.radius * this.radius;
    myArea -= 4 * this.radius * this.radius;
  }
}

var backgroundMusic = document.getElementById('background');
var touchSound = document.getElementById('touch');
var endSound = document.getElementById('end');
var myArea;
var score;
var totalArea;
var pauseandplay;
var timeLeft;
var gauntlet;
var felixFelicis;
var sprites = document.getElementById('sprites');
var felixFelicisCount = 2;
var gauntletCount = 0;
var timer;
var time;
var firstTime = 0;
var img1 = document.getElementById('pause'); //pause
var img2 = document.getElementById('play'); //play

// Implementation
let particles
function init() {
  myGameArea.start();
  myGameArea.intervalFunction();
  canvasElement = myGameArea.canvas;
  c = myGameArea.context;
  canvasElement.addEventListener('click', removeOnClick);
  canvasElement.addEventListener('click', clickImage);
  totalArea = canvasElement.width*canvasElement.height;
  score = 0;
  myArea = 0;
  felixFelicisCount = 2
  gauntletCount = 0
  time = undefined
  firstTime = 0;
  particles = []
  for (let i = 0; i < 15; i++) {
    let radius = randomIntFromRange(20, 70);
    let x = randomIntFromRange(radius, innerWidth - radius);
    let y = randomIntFromRange(radius, innerHeight - radius);
    let color = randomColor(colors);

    if(i > 0){
      for(let j =0; j < particles.length; j++){
        if(distance(x, y, particles[j].x, particles[j].y) - radius - particles[j].radius < 0){
            x = randomIntFromRange(radius, innerWidth - radius);
            y = randomIntFromRange(radius, innerHeight - radius);
            j = -1;
        }
      }
    }
    particles.push(new particle(x, y, radius))
  }
  backgroundMusic.play();
  timeLeft = new rectangle(myGameArea.canvas.width/40, 70, "white", 200, 50, "timeLeft");
  myScore = new rectangle(myGameArea.canvas.width/30, 50, "white", "40px", "Consolas", "score");
  pauseandplay = new imageButton(img1, img2, myGameArea.canvas.width - 60, 30, 70, 70);
  gauntlet = new powerup(sprites, 0, 0, myGameArea.canvas.width/2, 15, "gauntlet");
  felixFelicis = new powerup(sprites, 640, 0, myGameArea.canvas.width - 130, 15, "felixFelicis");
  canvasElement.removeEventListener('click', init);
  bestScoreFunction();
}

var bubbleGenration = 150;
// Animation Loop
function animate() {
  c.clearRect(0, 0, myGameArea.canvas.width, myGameArea.canvas.height)
  frameNo++;

  if(everyInterval(bubbleGenration) && myArea <= 0.75 * totalArea){
    for (let i = 0; i < 5; i++) {
      let radius = randomIntFromRange(20, 70);
      let x = randomIntFromRange(radius, innerWidth - radius);
      let y = randomIntFromRange(radius, innerHeight - radius);
      let color = randomColor(colors);
  
      // if(i > 0){
        // for(let j =0; j < particles.length; j++){
        //   if(distance(x, y, particles[j].x, particles[j].y) - radius - particles[j].radius < 0){
        //       x = randomIntFromRange(radius, innerWidth - radius);
        //       y = randomIntFromRange(radius, innerHeight - radius);
        //       j = -1;
        //   }
        // }
      // }
      if(i == 0 && score > 40){
        particles.push(new particle(x, y, radius, "rock"))
      }else{
        particles.push(new particle(x, y, radius, color))
      }
      if(bubbleGenration > 70){
        bubbleGenration -= 10;
      }
    }
  }
  if(myArea >= 0.75 * totalArea && firstTime == 0){
    firstTime++;
    time = 10;
    endTimer();
  }else if(myArea < 0.75 * totalArea && firstTime){
    time = undefined;
    firstTime = 0;
    clearInterval(timer);
  }
  if(time == 0){
    // time = 10;
    clearInterval(timer);
    myGameArea.stop();
  }
  particles.forEach(particle => {
   particle.update(particles)
  })
  if(felixFelicisCount > 0){
    felixFelicis.draw();
  }
  if(everyInterval(1000) && gauntletCount === 0){
    gauntletCount = 1;
  }
  if(gauntletCount == 1){
    gauntlet.draw();
  }
  myScore.draw();
  pauseandplay.update();
  if(time !== undefined){
    timeLeft.draw();
  }
  // timeLeft.draw();
}

// init()

function endTimer(){
  timer = setInterval(() => {
    // console.log(time);
    time--;
    // timeLeft.draw();
  }, 1000);
}

// animate()
function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function randomColor(colors) {
  return colors[Math.floor(Math.random() * colors.length)]
}

var frameNo = 0;
function everyInterval(n){
  if((frameNo/n)%1 == 0){
    return true;
  }
  return false;
}

function distance(x1, y1, x2, y2) {
  const xDist = x2 - x1
  const yDist = y2 - y1

  return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2))
}

var bestScore;
// function bestScoreFunction(){
//     if(localStorage.getItem("ballburst")){
//        bestScore = parseInt(JSON.parse(localStorage.getItem("ballburst")));
//     }
// }

var bestScores;
function bestScoreFunction(){
    // difficulty = document.getElementById('difficulty').value;
    if(localStorage.getItem('ballburst')){
        bestScoresFull = JSON.parse(localStorage.getItem('ballburst'));
        bestScoresFull.sort(function(a, b){return b - a});
        bestScores = bestScoresFull.slice(0,5);
        bestScore = parseInt(bestScores[0]);
        //console.log(bestScores);
        var para = document.querySelectorAll('#highscore p');

        for(var par=0;par<5;par++){
        para[par].textContent = "";
        }

        bestScores.forEach((element, index )=> {
            para[index].textContent = bestScores[index]
        })
    }  else{
        bestScores = [];
        localStorage.setItem('ballburst', JSON.stringify(bestScores));
    }
}

function rotate(velocity, angle) {
  const rotatedVelocities = {
      x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
      y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
  };

  return rotatedVelocities;
}

function resolveCollision(particle, otherParticle) {
  const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
  const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

  const xDist = otherParticle.x - particle.x;
  const yDist = otherParticle.y - particle.y;

  // Prevent accidental overlap of particles
  if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

      // Grab angle between the two colliding particles
      const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);

      // Store mass in var for better readability in collision equation
      const m1 = particle.mass;
      const m2 = otherParticle.mass;

      // Velocity before equation
      const u1 = rotate(particle.velocity, angle);
      const u2 = rotate(otherParticle.velocity, angle);

      // Velocity after 1d collision equation
      const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
      const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };

      // Final velocity after rotating axis back to original location
      const vFinal1 = rotate(v1, -angle);
      const vFinal2 = rotate(v2, -angle);

      // Swap particle velocities for realistic bounce effect
      particle.velocity.x = vFinal1.x;
      particle.velocity.y = vFinal1.y;

      otherParticle.velocity.x = vFinal2.x;
      otherParticle.velocity.y = vFinal2.y;
  }
}


//to start the game on click play
function play(){
  var mainSection = document.getElementById('main');
  mainSection.style.display = "none";
  init();
}

function introduction(){
  var mainSection = document.querySelector('#main');
  mainSection.style.display = "none";
  var section = document.querySelector('#introduction');
  section.style.display = "block";
}
function back(){
  var section = document.querySelector('#introduction');
  section.style.display = "none";
  var mainSection = document.querySelector('#main');
  mainSection.style.display = "block";
}
function highscore(){
  var mainSection = document.querySelector('#main');
  mainSection.style.display = "none";
  bestScoreFunction();
  var highScoreSection = document.querySelector('#highscore');
  highScoreSection.style.display = "block";
}
function backHome(){
  var section = document.querySelector('#highscore');
  section.style.display = "none";
  var mainSection = document.querySelector('#main');
  mainSection.style.display = "block";
}