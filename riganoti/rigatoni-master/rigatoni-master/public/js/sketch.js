var total =50;
var systems;
var gravity;
var repeller;
function setup() {

  createCanvas(windowWidth,windowHeight);
  systems = [];
  for(var i =0;i<total;i++){
    systems.push(new Particle(createVector(floor(random(width)),floor(random(height)))));
  }

}

function draw() {
  
  background(51);
  for(var i=0;i<systems.length;i++){
    systems[i].show();

    for(var j=0;j<systems.length;j++){
      var distance = dist(systems[i].location.x,systems[i].location.y,systems[j].location.x,systems[j].location.y);
      strokeWeight(0.5);

      if(distance<200){
        var lineAlpha = map(distance,0,200,255,0);
        stroke(255,255,255,lineAlpha);
        line(systems[i].location.x,systems[i].location.y,systems[j].location.x,systems[j].location.y);

      }

    }
    systems[i].update();
  }




}
function mousePressed(){
systems.push(new Particle(createVector(mouseX,mouseY)));
}
