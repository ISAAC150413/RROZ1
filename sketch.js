
const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;

var canvas;

var ball ;
var backgroundImage, car1_img, car2_img, track;
var fuelImage, powerCoinImage, lifeImage; 
var obstaclesGroup, obstacle1Image, obstacle2Image;
var arboll;
var blastImage;                   //C42// SA
var database, gameState;
var form, player, playerCount;
var ground, groundImage, invisibleGround;

var car9,car10,car11;
var allPlayers, car1, car2,car12,car5,car6,car7,car13,car14,car15,car16,car17,car18,car20,car21,car22,car19,fuels, powerCoins, obstacles; 
var cars = [];

function preload() {
  backgroundImage = loadImage("./assets/background.png");
  arboll_img = loadImage ("arboll.png");
  car1_img = loadImage("./assets/car1.png");
  car2_img = loadImage("./assets/car2.png");
  track = loadImage("./assets/track.jpg");
  fuelImage = loadImage("./assets/fuel.png");
  powerCoinImage = loadImage("./assets/goldCoin.png");
  lifeImage = loadImage("./assets/life.png");
  obstacle1Image = loadImage("./assets/obstacle1.png"); 
  obstacle2Image = loadImage("./assets/obstacle2.png"); 

  groundImage = loadImage("./assets/ground2.png")

  blastImage = loadImage ("./assets/blast.png"); //C42 //SA
  car12Image = loadImage ("./assets/car12.png");
  car13Image = loadImage ("./assets/car13.png");
  car14Image = loadImage ("./assets/car14.png");
  car15Image = loadImage ("./assets/car15.png");
  car16Image = loadImage ("./assets/car16.png");

  car5Image = loadAnimation ("car5.png","car6.png","car7.png");
  car6Image = loadAnimation ("car9.png","car10.png","car11.png");
  car7Image = loadAnimation ("car17.png","car18.png","car19.png");
  car8Image = loadAnimation ("car20.png","car21.png","car22.png");
 
}

function setup() {
  ground = createSprite(200,560,100,50);
  ground.addImage("ground",groundImage);
  ground.x = ground.width/2 ;
   
  canvas = createCanvas(windowWidth, windowHeight);
  database = firebase.database();
  game = new Game();
  game.getState();
  game.start();
  
 //obstaclesGroup = createGroup();
 
  //invisibleGround = createSprite(200,500,700,10);
  //invisibleGround.visible = true;

  engine = Engine.create();
	world = engine.world;
	
 
    var ball_options ={
      isStatic : false,
      restitution : 0.2,
      friction : 0,
      density : 1.1
      
        }
    
      ball = Bodies.circle (100,200,20,ball_options);
     
      World.add(world,ball);
      
      Engine.run(engine);


}

function draw() {
  background(backgroundImage);
  //spawnObstacles();
 
    createSprite
  if (playerCount === 2) {
    game.update(1);
  }

  if (gameState === 1) {
    game.play();
  }
  //arboll = createSprite(90,360,20,50);
  //arboll.addImage("arboll,",arboll_img);
  //arboll.scale = 0.8;

  if (gameState === 2) {
    game.showLeaderboard();
    game.end();

  }
  ellipse(ball.position.x,ball.position.y,20);

 //car1.collide(invisibleGround);
 
  
 ground.velocityX = -(4 + 3/100)
 
 if (ground.x < 0){
  ground.x = ground.width/2;
}
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

/*function spawnObstacles(){
  if (frameCount % 60 === 0){
    var obstacle = createSprite(600,165,10,40);
    obstacle.velocityX = -(6 /100);
    
    
     var rand = Math.round(random(1,6));
     switch(rand) {
       case 1: obstacle.addImage(obstacle1Image);
               break;
       case 2: obstacle.addImage(obstacle2Image);
               break;
       
        
       default: break;
     }
    
           
     obstacle.scale = 0.1;
     obstacle.lifetime = 300;
 
     obstaclesGroup.add(obstacle);
  }
 }*/