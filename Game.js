class Game {
  constructor() {
    this.resetTitle = createElement("h2");
    this.resetButton = createButton("");

    this.leadeboardTitle = createElement("h2");

    this.leader1 = createElement("h2");
    this.leader2 = createElement("h2");
    this.playerMoving = false;

    this.leftKeyActive = false;
    this.blast = false; //C42//SA
  }

  getState() {
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", function(data) {
      gameState = data.val();
    });
  }
  update(state) {
    database.ref("/").update({
      gameState: state
    });
  }

  start() {
    player = new Player();
    playerCount = player.getCount();

    form = new Form();
    form.display();

    car1 = createSprite(width / 2 + 50, height - 100);
    car1.addImage("car1", car1_img);
    //life
    

    car1.addImage("blast", blastImage); //C42 //SA
    car1.addImage("car12",car12Image)
    car1.addImage("car13",car13Image)
    car1.addImage("car14",car14Image)
    car1.addImage("car15",car15Image)
    
    car2 = createSprite(width / 2 + 50, height - 100);
    car2.addImage("car2", car2_img);
    car2.scale = 1;

    car2.addImage("blast", blastImage); //C42//SA
    car2.addAnimation("car5",car5Image)
    car2.addAnimation("car6",car6Image)
    car2.addAnimation("car7",car7Image)
    car2.addAnimation("car8",car8Image)
   


    cars = [car1, car2];

    //fuels = new Group();
    powerCoins = new Group();
    obstacles = new Group(); //C41 //SA

    // Adding fuel sprite in the game
    //this.addSprites(fuels, 4, fuelImage, 0.02);

    // Adding coin sprite in the game
    this.addSprites(powerCoins, 18, powerCoinImage, 0.09);

    //C41 //BP //SA
    
        
               
   
      
   var obstaclesPositions = [
      { x : width , y: -height  , image : obstacle2Image },
      { x : width , y: -height  , image : obstacle1Image }
    ];

    //Adding obstacles sprite in the game
    this.addSprites(
      obstacles,
      obstaclesPositions.length,
      obstacle1Image,
      0.04,
      obstaclesPositions
    );
   
    }

  //C41 //SA
  addSprites(spriteGroup, numberOfSprites, spriteImage, scale,positions = [] ) {
    for (var i = 0; i < numberOfSprites; i++) {
      var x, y;

      //C41 //SA
      if (positions.length > 0) {
        x = positions[i].x;
        y = positions[i].y;
        spriteImage = positions[i].image;
      } else {
        x = random(width, width );
        y = random(-height , height );
      }
      var sprite = createSprite(x, y);
      sprite.addImage("sprite", spriteImage);

      sprite.scale = scale;
      spriteGroup.add(sprite);
    }
  }

  handleElements() {
    form.hide();
    form.titleImg.position(40, 50);
    form.titleImg.class("gameTitleAfterEffect");

    this.resetTitle.html("Reiniciar juego");
    this.resetTitle.class("resetText");
    this.resetTitle.position(width / 2 + 200, 40);

    this.resetButton.class("resetButton");
    this.resetButton.position(width / 2 + 230, 100);

    this.leadeboardTitle.html("Tabla de posiciones");
    this.leadeboardTitle.class("resetText");
    this.leadeboardTitle.position(width / 3 - 370, 130);

    this.leader1.class("leadersText");
    this.leader1.position(width / 3 - 370, 200);

    this.leader2.class("leadersText");
    this.leader2.position(width / 3 - 370, 240);
  }

  play() {
    this.handleElements();
    this.handleResetButton();

    Player.getPlayersInfo();
    player.getCarsAtEnd();

    if (allPlayers !== undefined) {
     

      //this.showFuelBar();
      this.showLife();
      this.showLeaderboard();

      //index of the array
      var index = 0;
      for (var plr in allPlayers) {
        //add 1 to the index for every loop
        index = index + 1;

        //use data form the database to display the cars in x and y direction
        var x = allPlayers[plr].positionX;
        var y = height - allPlayers[plr].positionY;

        //C42//TA
        var currentlife = allPlayers[plr].life;

        if (currentlife <= 0) {
          cars[index - 1].changeImage("blast");
          cars[index - 1].scale = 0.3;
        }

        cars[index - 1].position.x = x;
        cars[index - 1].position.y = y;

        if (index === player.index) {
          stroke(10);
          

        //  this.handleFuel(index);
          this.handlePowerCoins(index);
          this.handleCarACollisionWithCarB(index); //C41//BP//TA
          this.handleObstacleCollision(index); //C41//SA

          //C42//TA
          if (player.life <= 0) {
            this.blast = true;
            this.playerMoving = false;
          }

          // Changing camera position in y direction
         // camera.position.y = cars[index - 1].position.y;
        }
      }

      if (this.playerMoving) {
        player.positionY += 5;
        player.update();
      }

      // handling keyboard events
      this.handlePlayerControls();

      // Finshing Line
      const finshLine = height * 6 - 100;

      if (player.positionY > finshLine) {
        gameState = 2;
        player.rank += 1;
        Player.updateCarsAtEnd(player.rank);
        player.update();
        this.showRank();
      }

      drawSprites();
    }
  }

  /*handleFuel(index) {
    // Adding fuel
    cars[index - 1].overlap(fuels, function(collector, collected) {
      player.fuel = 185;
      //collected is the sprite in the group collectibles that triggered
      //the event
      collected.remove();
    });*/

    // Reducing Player car fuel
   // if (player.fuel > 0 && this.playerMoving) {
     // player.fuel -= 0.3;
    //}

    //if (player.fuel <= 0) {
      //gameState = 2;
      //this.gameOver();
   // }
  //}

  handlePowerCoins(index) {
    cars[index - 1].overlap(powerCoins, function(collector, collected) {
      player.score += 21;
      player.update();
      //collected is the sprite in the group collectibles that triggered
      //the event
      collected.remove();
    });
  }

  handleResetButton() {
    this.resetButton.mousePressed(() => {
      database.ref("/").set({
        carsAtEnd: 0,
        playerCount: 0,
        gameState: 0,
        palyers: {}
      });
      window.location.reload();
    });
  }

  /*showFuelBar() {
    push();
    image(fuelImage, width / 2 - 130, height - player.positionY - 350, 20, 20);
    fill("white");
    rect(width / 2 - 100, height - player.positionY - 350, 185, 20);
    fill("#ffc400");
    rect(width / 2 - 100, height - player.positionY - 350, player.fuel, 20);
    noStroke();
    pop();
  }*/

  showLife() {
    push();
    image(lifeImage, width / 2 - 130, height - player.positionY - 350, 20, 20);
    fill("black");
    rect(width / 2 - 100, height - player.positionY - 350, 185, 20);
    fill("#f50057");
    rect(width / 2 - 100, height - player.positionY- 350, player.life, 20);
    noStroke();
    pop();
  }

  showLeaderboard() {
    var leader1, leader2;
    var players = Object.values(allPlayers);
    if (
      (players[0].rank === 0 && players[1].rank === 0) ||
      players[0].rank === 1
    ) {
      // &emsp;    This tag is used for displaying four spaces.
      leader1 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;

      leader2 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;
    }

    if (players[1].rank === 1) {
      leader1 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;

      leader2 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;
    }

    this.leader1.html(leader1);
    this.leader2.html(leader2);
  }

  handlePlayerControls() {
    //C41 //TA
    if (!this.blast) {
      if (keyIsDown(UP_ARROW)&& player.positionY < width / 2 - 300 ) {
      
        player.positionY += 10;
        player.update();

        car1.changeAnimation("car13",car13Image);
         
        car2.changeAnimation("car7",car7Image);
    
        }

          
      

      if (keyIsDown(LEFT_ARROW) && player.positionX > width / 3 - 50) {
        this.leftKeyActive = false;
        player.positionX -= 5;
        player.update();

        car1.changeAnimation("car14",car14Image);

        car2.changeAnimation("car5",car5Image);
      
      }

      if (keyIsDown(RIGHT_ARROW) && player.positionX < width / 2 + 300) {
        this.leftKeyActive = false;
        player.positionX += 5;
        player.update();
        car1.changeAnimation("car12",car12Image);
        car2.changeAnimation("car6",car6Image);
      
      }

      if (keyIsDown(DOWN_ARROW) && player.positionY < width / 2 + 300) {
        this.leftKeyActive = false;
        player.positionY -= 5;
        player.update();

        car1.changeAnimation("car15",car15Image);
        //car2.changeAnimation("car7",car7Image);
     
      
      }

    if (keyIsDown(DOWN_ARROW) && player.positionY < width / 2 + 300) {
        this.leftKeyActive = false;
        player.positionY -= 5;
        player.update();

        
        //car2.changeAnimation("car7",car7Image);
        car2.changeAnimation("car8",car8Image);
      
      }

      
       
      
      
    }
  }

  //C41 //SA
  handleObstacleCollision(index) {
    if (cars[index - 1].collide(obstacles)) {
      //C41 //TA
      if (this.leftKeyActive) {
        player.positionX += 100;
      } else {
        player.positionX -= 100;
      }
      camera
      //C41 //SA
      //Reducing Player Life
      if (player.life > 0) {
        player.life -= 185 / 4;
      }

      player.update();
    }
  }

  //C41 //TA //Bp
  handleCarACollisionWithCarB(index) {
    if (index === 1) {
      if (cars[index - 1].collide(cars[1])) {
        if (this.leftKeyActive) {
          player.positionX += 100;
        } else {
          player.positionX -= 100;
        }

        //Reducing Player Life
        if (player.life > 0) {
          player.life -= 185 / 6;
        }

        player.update();
      }
    }
    if (index === 2) {
      if (cars[index - 1].collide(cars[0])) {
        if (this.leftKeyActive) {
          player.positionX += 100;
        } else {
          player.positionX -= 100;
        }

        //Reducing Player Life
        if (player.life > 0) {
          player.life -= 185 / 4;
        }

        player.update();
      }
    }
  }

  showRank() {
    swal({
      title: `¡Asombroso!${"\n"}Lugar${"\n"}${player.rank}`,
      text: "Llegaste a la linea final exitosamente.",
      imageUrl:
        "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
      imageSize: "100x100",
      confirmButtonText: "Ok"
    });
  }

  gameOver() {
    swal({
      title: `Juego acabado`,
      text: "¡Ups! Perdiste la carrera",
      imageUrl:
      "https://genesistoxical.com/wp-content/uploads/2021/08/Calavera_pixel_art_png.png",
        
      imageSize: "100x100",
      confirmButtonText: "Gracias por jugar"
    });
  }
  end() {
    console.log("Juego acabado");
  }
}
//score