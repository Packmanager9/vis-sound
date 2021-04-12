window.onload = function() {
  


    let tip = {}

    let spopholder
    let keysPressed = {};

document.addEventListener('keydown', (event) => {
   keysPressed[event.key] = true;
});

document.addEventListener('keyup', (event) => {
    delete keysPressed[event.key];
 });



    let tutorial_canvas = document.getElementById("tutorial");


    let tutorial_canvas_context = tutorial_canvas.getContext('2d');

 //   tutorial_canvas_context.scale(.1, .1);  // this scales the canvas
    tutorial_canvas.style.background = "#000000"


 const flex = tutorial_canvas.getBoundingClientRect();

 window.addEventListener('mousedown', e => {

    xs = e.clientX - flex.left;
    ys = e.clientY - flex.top;
      tip.x = xs
      tip.y = ys

      for(let f = 0; f< spops.length; f++){
          if(intersects(spops[f].body, tip)){
              if(spops[f].boom == 0){
                  spops[f].detonate()
              }
          }
      }

 })


    class Spop{
        constructor(body){
            this.body = body
            this.a = 1
            this.r = 255
            this.g = 255
            this.b = 255
            this.body.color = `rgba(255, 255, 255, ${this.a})`
            this.boom = 0
        }
        detonate(){

             spopholder = this
             if(spopholder.boom == 0){
                window.setInterval(function(){ 
                    spopholder.body.radius+=.05
                    if(spopholder.body.radius >= 65){
                        spopholder.body.radius = 65
                    }
                    spopholder.a-=0.00025
                    if(spopholder.a <= 0){
                        spopholder.a = 0
                    }
                    spopholder.body.color = `rgba(${spopholder.r}, ${spopholder.g}, ${spopholder.b}, ${spopholder.a})`
    
                }, 10) 
                spopholder.boom = 1
             }
        }
        draw(){
            this.body.draw()
        }
        move(){
            this.body.move()
        }

    }



    // can be drawn, or moved.
    class Rectangle {
        constructor(x, y, height, width, color) {
            this.x = x
            this.y = y
            this.height = height
            this.width = width
            this.color = color
            this.xmom = 0
            this.ymom = 0
        }
        draw(){
            tutorial_canvas_context.fillStyle = this.color
            tutorial_canvas_context.fillRect(this.x, this.y, this.width, this.height)
        }
        move(){

            this.x+=this.xmom
            this.y+=this.ymom

        }
    }

    // can be drawn, or moved with friction.  and richochet 
    class Circle{
        constructor(x, y, radius, color, xmom = 0, ymom = 0){
            this.x = x
            this.y = y
            this.radius = radius
            this.color = color
            this.xmom = xmom
            this.ymom = ymom
        }       
         draw(){
            tutorial_canvas_context.lineWidth = 1

            tutorial_canvas_context.strokeStyle = this.color
            tutorial_canvas_context.beginPath();
            tutorial_canvas_context.arc(this.x, this.y, this.radius, 0, (Math.PI*2), true)
            tutorial_canvas_context.fillStyle = this.color
           tutorial_canvas_context.fill()
            tutorial_canvas_context.stroke(); 
        }
        move(){

            this.xmom*=.9999
            this.ymom*=.9999   //friction

            this.x += this.xmom
            this.y += this.ymom

            if(this.x+this.radius > tutorial_canvas.width){

                if(this.xmom > 0){
                this.xmom *= -1
                }

            }
            if(this.y+this.radius > tutorial_canvas.height){
                if(this.ymom > 0){
                this.ymom *= -1
                }

            }
            if(this.x-this.radius < 0){
                if(this.xmom < 0){
                    this.xmom *= -1
                }

            }
            if(this.y-this.radius < 0){

                if(this.ymom < 0){
                    this.ymom *= -1
                }
        
            }

            // ^ this reflects balls off the wall
            // the internal checks make it always return to the screen

        }


    }

    // let x = 0
    // let y = 0

     let circ = new Circle(125, 200, 5, getRandomLightColor(), Math.random()-.5, Math.random()-.5)  // starts with ramndom velocities and color
     let rect = new Rectangle ( 200, 200, 50, 80, getRandomLightColor())
    // rect.ymom = 1

    // example objects


    let spops = []
    // let spop = new Spop(circ)
    // // spop.detonate()
    // spops.push(spop)


// interval, fill this with game logic 
    window.setInterval(function(){ 
        // tutorial_canvas_context.clearRect(0, 0, tutorial_canvas.width, tutorial_canvas.height)  // refreshes the image

    }, 1) // length of refresh interval




    // run on any object with x/y attributes in the timer to give them wasd controls
    function players(racer){
        if (keysPressed['w']) {
                racer.y -= .7
        }
        if (keysPressed['a']) {
            racer.x -= .7
        }
        if (keysPressed['s']) {
            racer.y += .7
        }
        if (keysPressed['d']) {
            racer.x += .7
        }
        if (keysPressed['f']) {
        }


        // any key combination can be made from a nested if statement, all keys can just be accessed by name (if you can find it)

    }





// can check if one circle contains the cneter of the other circle, and / or it can check if any constructed object with an x and y attribute is inside of a circle. With tinkering, this can check boundaries of two circles.
function intersects(circle, left) {
    var areaX = left.x - circle.x;
    var areaY = left.y - circle.y;
    return areaX * areaX + areaY * areaY <= circle.radius * circle.radius;
}

// random color that will be visible on  blac backgroung
function getRandomLightColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[(Math.floor(Math.random() * 15)+1)];
    }
    return color;
  }


// checks if a square contains the centerpoint of a circle
function squarecircle(square, circle){

    let squareendh = square.y + square.height
    let squareendw = square.x + square.width

    if(square.x <= circle.x){
        if(square.y <= circle.y){
            if(squareendw >= circle.x){
                if(squareendh >= circle.y){
                    return true
                }
            }
        }
    }
    return false
}

// checks if two squares are intersecting ( not touching, for touching cnange the evaluations from ">" to ">=" etc)
function squaresquare(a, b){

    a.left = a.x
    b.left = b.x
    a.right = a.x + a.width
    b.right = b.x + b.width
    a.top = a.y 
    b.top = b.y
    a.bottom = a.y + a.height
    b.bottom = b.y + b.height



    if (a.left > b.right || a.top > b.bottom || 
        a.right < b.left || a.bottom < b.top)
    {
       return false
    }
    else
    {
        return true
    }
}





var file = document.getElementById("thefile");
var audio = document.getElementById("audio");

file.onchange = function() {
  var files = this.files;
  audio.src = URL.createObjectURL(files[0]);
  audio.load();
  audio.play();
  var context = new AudioContext();
  var src = context.createMediaElementSource(audio);
  var analyser = context.createAnalyser();
  var tutorial_canvas = document.getElementById("tutorial");
//   tutorial_canvas.width = window.innerWidth;
//   tutorial_canvas.height = window.innerHeight;
  var tutorial_canvas_context = tutorial_canvas.getContext("2d");

  src.connect(analyser);
  analyser.connect(context.destination);

  analyser.fftSize = 1024;

  var bufferLength = analyser.frequencyBinCount;

  for(let t = 0; t< bufferLength; t++){
        
    circ = new Rectangle(Math.random()*tutorial_canvas.width, Math.random()*tutorial_canvas.height, 5, 5, getRandomLightColor(), Math.random()-.5, Math.random()-.5)  // starts with ramndom velocities and color
    let spop = new Spop(circ)
    // spop.detonate()
    spops.push(spop)

}
  console.log(bufferLength);

  var dataArray = new Uint8Array(bufferLength);

  var WIDTH = tutorial_canvas.width;
  var HEIGHT = tutorial_canvas.height;

  var barWidth = (WIDTH / bufferLength) * 1;
  var barHeight;
  var x = 0;

  function renderFrame() {

    tutorial_canvas_context.fillStyle = "#000";
    tutorial_canvas_context.fillRect(0, 0, WIDTH, HEIGHT);

    requestAnimationFrame(renderFrame);

    for(let t = 0; t<spops.length; t++){
        spops[t].move()
        spops[t].draw()
    }
    for(let t = 0; t<spops.length; t++){
        if(spops[t].a < 0.01){
            spops.splice(t,1)
        }
        }
    
        for(let t = 0; t<spops.length; t++){
            for(let f = 0; f<spops.length; f++){
                // if(intersects(spops[t].body ,spops[f].body)){
                //     if(spops[t].boom == 1){
                //         spops[f].b = 0
                //         spops[f].g = 0
                //         spops[f].body.color = `rgba(${ spops[f].r}, ${ spops[f].g}, ${ spops[f].b}, ${ spops[f].a})`
                //         spops[f].detonate()
                //     }
                // }
            }
        }
    x = 0;

    analyser.getByteFrequencyData(dataArray);


    for (var i = 0; i < bufferLength; i++) {
      barHeight = (dataArray[i]*2)//*(Math.sqrt(i)/3);
      
      var r = barHeight + i
      var g = 40+(255- barHeight)
      var b = 255-(i)//255-(barHeight/1)+1;
      spops[i].body.height = (barHeight/1)+1
      spops[i].body.width = (tutorial_canvas.width/spops.length) 
      spops[i].body.color ="rgb(" + r + "," + g + "," + b + ")";
      tutorial_canvas_context.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
    //   tutorial_canvas_context.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

    spops[i].body.x = (tutorial_canvas.width/spops.length) *i
    spops[i].body.y = 350-(spops[i].body.height*.5)
      x += barWidth + 1;
    }
    // spops.sort((a, b) => (a.body.radius > b.body.radius) ? -1: 1 )
  }

  audio.playbackRate = .5
  audio.play();
  renderFrame();
};



  };