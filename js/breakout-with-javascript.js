/*!
 * BreakOut with JavaScript
 * http://matt.weppler.me/breakout-with-javascript.html
 *
 * Released under the MIT license
 *
 * Date: 2013-07-03
 */
(function() {
  // for prototypal inheritance ()
  if (typeof Object.create !== 'function') {
    Object.create = function(o) {
      function F() {}
      F.prototype = o;
      return new F();
    };
  }

  var BreakOutWithJavaScript = (function(document, undefined) {
    // todos
    // todo: get better acquainted with the .arc method arguments
    // todo: get ball speed working
    // todo: add the ability to pause the game
    // todo: add touch events and ability to start game via touch ('Start' button?)
    // todo: have game object do collision detection?
    // todo: prevent paddle from going outside east/west boundary
    // todo: add more buffer to ball/paddle

    var colors = {
      'black':       '#000000',
      'brown':       '#a52a2a',
      'deeppink':    '#eb0093',
      'forestgreen': '#3c8218',
      'green':       '#00a308',
      'mediumblue':  '#0008db',
      'olivedrab':   '#76b900',
      'red':         '#ff1c0a',
      'white':       '#ffffff',
      'yellow':      '#fffd0a',
      'yellowgreen': '#8eb90a'
    },

    shape = {
      'fill':        undefined,
      'height':      undefined,
      'moveTo':      function(x, y) {
        this.xCoordinate = x;
        this.yCoordinate = y;
      },
      'name':        undefined,
      'radius':      undefined,
      'type':        undefined,
      'whereAmI':    function() {
        return this.name + ' is at x: ' + this.xCoordinate + ' - y: ' + this.yCoordinate;
      },
      'width':       undefined,
      'xCoordinate': undefined,
      'xDirection':  undefined,
      'yCoordinate': undefined,
      'yDirection':  undefined
    },

    game = {
      'active'        : false,
      'columnWidth'   : undefined,
      'loop'          : 0,
      'rowHeight'     : undefined,
      'timeStart'     : undefined,
      'timeActive'    : function() {
        return Date.now() - this.timeStart;
      },
      'updateBallSpeed': 0,
      'updateBallSpeedInterval': 10000,
      'updateBallSpeedStep': 2,
      'updateInterval': 10
    },

    ball = {
      'direction':    5,
      'setDirection': function(direction) {
        this.shape.xDirection = direction;
      },
      'setShape':     function() {
        ball.shape             = Object.create(shape);
        ball.shape.fill        = colors.white;
        ball.shape.name        = 'ball';
        ball.shape.radius      = 0;
        ball.shape.type        = 'arc';
        ball.shape.xCoordinate = 0;
        ball.shape.yCoordinate = 0;
        ball.shape.xDirection  = this.direction;
        ball.shape.yDirection  = this.speed;
      },
      'setSpeed':     function(speed) {
        this.shape.yDirection = speed;
      },
      'speed':        -5
    },

    brickCarrier = {
      'columns':         0,
      'height':          0,
      'bricks':          undefined,
      'padding':         0,
      'bricksRemaining': undefined,
      // rowColors should be set with a setLevel function
      'rowColors':       [colors.yellow, colors.yellowgreen, colors.olivedrab, colors.green, colors.forestgreen],
      'rows':            0,
      'width':           0
    },

    canvas = {
      '2dContext':   null,
      'element':     null,
      'maxX':        0,
      'minX':        0,
      'setShape':    function() {
        canvas.shape             = Object.create(shape);
        canvas.shape.fill        = colors.black;
        canvas.shape.name        = 'canvas';
        canvas.shape.height      = 0;
        canvas.shape.type        = 'rect';
        canvas.shape.width       = 0;
        canvas.shape.xCoordinate = 0;
        canvas.shape.yCoordinate = 0;
      }
    },

    paddle = {
      'deflectionAngle': 10,
      'isMovingLeft':    false,
      'isMovingRight':   false,
      'keyboardSpeed':   4,
      'setShape':        function() {
        paddle.shape             = Object.create(shape);
        paddle.shape.fill        = colors.white;
        paddle.shape.name        = 'paddle';
        paddle.shape.height      = 0;
        paddle.shape.stroke      = colors.olivedrab;
        paddle.shape.type        = 'rect';
        paddle.shape.width       = 0;
        paddle.shape.xCoordinate = 0;
        paddle.shape.yCoordinate = 0;
      }
    },

    touchEvents = {
      isMoving:         false,
      threshold:        20, // in pixels
      xCoordinateEnd:   0,
      xCoordinateStart: 0,
      xDistance:        0,
      yCoordinateEnd:   0,
      yCoordinateStart: 0,
      yDistance:        0
    },

    startButton = document.querySelector('#start-button'),

    loadLevel = function() {
      initializeCanvas();
      initializePaddle();
      initializeBall();
      initializeBricks();

      game.rowHeight   = brickCarrier.height + brickCarrier.padding;
      game.columnWidth = brickCarrier.width  + brickCarrier.padding;

      drawCanvas();
      drawMessage({ 'message': 'Press Enter' });
    },

    initializeBall = function() {
      ball.setShape();
      ball.shape.radius      = canvas.shape.width * 0.0250;
      ball.shape.xCoordinate = ball.shape.radius;
      ball.shape.yCoordinate = (canvas.shape.height - ball.shape.radius - (paddle.shape.height * 2));
      ball.setSpeed(canvas.shape.width * -0.01);
    },

    initializeBricks = function() {
      brickCarrier.columns = 5;
      brickCarrier.height  = canvas.shape.height * 0.05;
      brickCarrier.padding = 0.75;
      brickCarrier.rows    = 5;
      layoutBricks();
    },

    initializeCanvas = function() {
      canvas.element  = document.querySelector('#canvas');
      var buttonStyle = window.getComputedStyle(startButton);
      buttonHeight    = parseInt(buttonStyle.marginBottom, 10) + parseInt(buttonStyle.marginTop, 10) + startButton.clientHeight;
      canvas.setShape();
      canvas['2dContext']   = canvas.element.getContext('2d');
      canvas.element.height = window.innerHeight - buttonHeight;
      canvas.element.width  = window.innerWidth;
      canvas.shape.height   = canvas.element.height;
      canvas.shape.width    = canvas.element.width;
      canvas.minX           = canvas.element.offsetLeft;
      canvas.maxX           = canvas.minX + canvas.shape.width;
    },

    initializePaddle = function() {
      paddle.setShape();
      paddle.shape.height = canvas.shape.height * 0.040;
      paddle.shape.width = canvas.shape.width * 0.2;
      // center paddle in canvas
      paddle.shape.xCoordinate = (canvas.shape.width / 2) - (paddle.shape.width / 2);
      paddle.shape.yCoordinate = canvas.shape.height - paddle.shape.height;
    },

        // builds the initial bricks
    layoutBricks = function() {
      brickCarrier.width  = (canvas.shape.width / brickCarrier.columns) - 1;
      brickCarrier.bricks = new Array(brickCarrier.rows);
      for (var row = 0; row < brickCarrier.rows; row++) {
        brickCarrier.bricks[row] = new Array(brickCarrier.columns);
        for (var column = 0; column < brickCarrier.columns; column++) {
          var brick = brickCarrier.bricks[row][column] = Object.create(Object);
          brick.active               = 1;
          brick.shape                = Object.create(shape);
          brick.shape.fill        = brickCarrier.rowColors[row];
          brick.shape.height      = brickCarrier.height;
          brick.shape.name        = 'brick: ' + row + ', ' + column;
          brick.shape.type        = 'rect';
          brick.shape.width       = brickCarrier.width;
          brick.shape.xCoordinate = (column * (brickCarrier.width + brickCarrier.padding)) + brickCarrier.padding;
          brick.shape.yCoordinate = (row * (brickCarrier.height + brickCarrier.padding)) + brickCarrier.padding;
        }
      }
    },

    resumeGameLoop = function() {
      game.active = true;
      game.loop = setInterval(function() {
        drawCanvas();
        if (!brickCarrier.bricksRemaining) {
          drawMessage({ 'message': 'Cleared!' });
          resetGame();
        }
        detectCollision();
      }, game.updateInterval);
      gameMaintenance();
    },

    startGameLoop = function() {
      if (game.timeStart === undefined) {
        setTimeout(function() {
          game.timeStart = Date.now();
          resumeGameLoop();
        }, 1500); // start after a second and a half
      }
      startButton.classList.add('disabled');
    },

    gameMaintenance = function() {
      game.updateBallSpeed = setInterval(function() {
        var speed = (ball.shape.yDirection > 0) ? ball.shape.yDirection + game.updateBallSpeedStep : ball.shape.yDirection + -game.updateBallSpeedStep;
        ball.setSpeed(speed);
      }, game.updateBallSpeedInterval);
    },

    // clear the canvas
    clearCanvas = function() {
      canvas['2dContext'].clearRect(0, 0, canvas.shape.width, canvas.shape.height);
    },

    drawBricks = function() {
      brickCarrier.bricksRemaining = false;
      for (var row = 0; row < brickCarrier.rows; row++) {
        for (var columns = 0; columns < brickCarrier.columns; columns++) {
          if (brickCarrier.bricks[row][columns].active === 1) {
            drawShape(brickCarrier.bricks[row][columns].shape);
            brickCarrier.bricksRemaining = true;
          }
        }
      }
    },

    drawBall = function() {
      ball.shape.xCoordinate += ball.shape.xDirection;
      ball.shape.yCoordinate += ball.shape.yDirection;
      drawShape(ball.shape);
    },

    drawCanvas = function() {
      clearCanvas();
      drawShape(canvas.shape);
      drawBall();
      drawPaddle();
      drawBricks();
    },

    // requires an object with at least a message property
    drawMessage = function(messageObject) {
      align = (messageObject.font !== undefined) ? messageObject.textAlign : 'middle';
      base  = (messageObject.font !== undefined) ? messageObject.textBaseline : 'middle';
      font  = (messageObject.font !== undefined) ? messageObject.font : '20pt Arial';

      canvas['2dContext'].fillStyle    = colors.white;
      canvas['2dContext'].font         = font;
      canvas['2dContext'].textAlign    = align;
      canvas['2dContext'].textBaseline = base;

      messageWidth = canvas['2dContext'].measureText(messageObject.message).width;
      canvas['2dContext'].fillText(messageObject.message, ((canvas.shape.width / 2) - (messageWidth / 2)), (canvas.shape.height / 2));
    },

    drawPaddle = function() {
      //cpuControlPaddle();
      if (paddle.isMovingRight) {
        paddle.shape.xCoordinate += paddle.keyboardSpeed;
      } else if (paddle.isMovingLeft) {
        paddle.shape.xCoordinate -= paddle.keyboardSpeed;
      }
      drawShape(paddle.shape);
    },

    // requires a shape object
    drawShape = function(shapeObject) {
      canvas['2dContext'].beginPath();
      if (shapeObject.type === 'arc') {
        canvas['2dContext'].arc(shapeObject.xCoordinate, shapeObject.yCoordinate, shapeObject.radius, 0, Math.PI * 2, true);
      } else if (shapeObject.type === 'rect') {
        canvas['2dContext'].rect(shapeObject.xCoordinate, shapeObject.yCoordinate, shapeObject.width, shapeObject.height);
      } else {
        console.log('drawing unknown shape: ' + shapeObject.name);
      }
      canvas['2dContext'].closePath();
      if (shapeObject.lineWidth !== undefined) {
        canvas['2dContext'].lineWidth = shapeObject.lineWidth;
      }
      if (shapeObject.fill !== undefined) {
        canvas['2dContext'].fillStyle = shapeObject.fill;
        canvas['2dContext'].fill();
      }
      if (shapeObject.stroke !== undefined) {
        canvas['2dContext'].strokeStyle = shapeObject.stroke;
        canvas['2dContext'].stroke();
      }
    },

    // collision detection methods
    ballBetweenPaddleWidth = function() {
      var difficulty = 1;
      if (game.difficulty === 'easy') {
        difficulty = 2;
      } else if (game.difficulty === 'normal') {
        difficulty = 1;
      } else if (game.difficulty === 'hard') {
        difficulty = 0;
      }

      var paddleXCoord = paddle.shape.xCoordinate - difficulty,
          paddleYCoord = paddle.shape.xCoordinate + paddle.shape.width + difficulty;

      if (ball.shape.xCoordinate > paddleXCoord && ball.shape.xCoordinate < paddleYCoord) {
        return true;
      } else {
        return false;
      }
    },

    ballInBrickRange = function() {
      brickCoordinate = Math.ceil(brickCarrier.rows * game.rowHeight) / 1;
      topOfBallCoordinate = ball.shape.yCoordinate - ball.shape.radius;
      if (topOfBallCoordinate <= brickCoordinate) {
        return true;
      } else {
        return false;
      }
    },

    ballInEastBoundary = function() {
      if ((ball.shape.xCoordinate + ball.shape.radius) + ball.shape.xDirection > canvas.shape.width) {
        return true;
      } else {
        return false;
      }
    },

    ballInNorthBoundary = function() {
      if ((ball.shape.yCoordinate - ball.shape.radius) + ball.shape.yDirection < 0) {
        return true;
      } else {
        return false;
      }
    },

    ballInPaddleRow = function() {
      if ((ball.shape.yCoordinate + ball.shape.radius) + ball.shape.yDirection > (canvas.shape.height - paddle.shape.height)) {
        return true;
      } else {
        return false;
      }
    },

    ballInSouthBoundary = function() {
      if ((ball.shape.yCoordinate + ball.shape.radius) + ball.shape.yDirection > canvas.shape.height) {
        return true;
      } else {
        return false;
      }
    },

    ballInWestBoundary = function() {
      if ((ball.shape.xCoordinate - ball.shape.radius) + ball.shape.xDirection < 0) {
        return true;
      } else {
        return false;
      }
    },

    brickInRowColumnIsActive = function(row, column) {
      if (brickCarrier.bricks[row] !== undefined && brickCarrier.bricks[row][column].active === 1) {
        return true;
      } else {
        return false;
      }
    },

    detectCollision = function() {
      // detect if ball has collided with a brick
      var ballInRow    = Math.floor((ball.shape.yCoordinate - ball.shape.radius) / Math.ceil(game.rowHeight));
      var ballInColumn = Math.floor(ball.shape.xCoordinate / game.columnWidth);
      if (ballInRow >= 0 && ballInColumn >= 0 && ballInBrickRange() && brickInRowColumnIsActive(ballInRow, ballInColumn)) {
        brickCarrier.bricks[ballInRow][ballInColumn].active = 0;
        ball.shape.yDirection = -ball.shape.yDirection;
      }

      // detect if ball has collided with a wall
      if (ballInEastBoundary() || ballInWestBoundary()) {
        ball.shape.xDirection = -ball.shape.xDirection;
      }

      // detect if ball has collided with the ceiling or paddle or floor
      if (ballInNorthBoundary()) {
        ball.shape.yDirection = -ball.shape.yDirection;
      } else if (ballInPaddleRow()) {
        if (ballBetweenPaddleWidth()) {
          //move the ball differently based on where it hit the paddle
          ball.shape.xDirection = ((ball.shape.xCoordinate - (paddle.shape.xCoordinate + paddle.shape.width / 2)) / paddle.shape.width) * paddle.deflectionAngle;
          ball.shape.yDirection = -ball.shape.yDirection;
        } else if (ballInSouthBoundary()) {
          drawMessage({ 'message': 'You Dead!' });
          resetGame();
        }
      }
    },

    cpuControlPaddle = function () {
      // update the paddle x to near-center on the balls x coordinates
      if (ball.shape.yCoordinate >= paddle.shape.yCoordinate - 50) {
        var randNum = Math.floor(Math.random() * 10) + (paddle.shape.width / 3);
        var randNum2 = Math.floor(Math.random() * 3) + 1;
        if (randNum2 == 1) {
          randNum *= -1;
        } else if (randNum2 == 2) {
          randNum *= 1;
        } else {
          randNum = 0;
        }
        movePaddleToX(ball.shape.xCoordinate - (paddle.shape.width / 2) + randNum);
      }
    },

    // direct movement methods
    moveBallToXY = function(x, y) {
      ball.shape.xCoordinate = x;
      ball.shape.yCoordinate = y;
    },

    movePaddleToX = function(x) {
      paddle.shape.xCoordinate = x;
    },

    pauseGameLoop = function() {
      if (game.active) {
        game.active = false;
        clearInterval(game.loop);
        clearInterval(game.updateBallSpeed);
      } else {
        resumeGameLoop();
      }
    },

    resetGame = function() {
      clearInterval(game.loop);
      clearInterval(game.updateBallSpeed);
      game.timeStart = undefined;
      setTimeout(function() {
        game.active = false;
        paddle.setShape();
        ball.setShape();
        startButton.classList.remove('disabled');
        loadLevel();
      }, 5000);
    },

    // Keyboard Events
    onKeyDown = function(event) {
      if (event.keyCode === 39) {
        paddle.isMovingRight = true;
      } else if (event.keyCode === 37) {
        paddle.isMovingLeft = true;
      }
    },

    onKeyUp = function(event) {
      if (event.keyCode === 39) {
        paddle.isMovingRight = false;
      } else if (event.keyCode === 37) {
        paddle.isMovingLeft = false;
      }
    },

    // Mouse Events
    //onClick = function(event) {
      //console.log("mouse clicked");
      //if (event.pageX > canvas.minX && event.pageX < canvas.maxX) {
        //console.log("mouse clicked");
        //moveBallToXY();
      //}
    //},

    onMouseMove = function(event) {
      //if the mouse is moving between the canvas width
      if (event.pageX > canvas.minX && event.pageX < canvas.maxX && event.pageY < canvas.shape.height) {
        movePaddleToX(Math.max(event.pageX - canvas.minX - (paddle.shape.width / 2), 0));
      }
    },

    // Touch Events
    onTouchCancel = function(event) {
      event.preventDefault();
      ////touchEvents.isMoving = false;
      ////console.log('touchcancel: ' + 'x: ' + event.pageX + ' - y: ' + event.pageY);
      ////debugger
    },

    onTouchEnd = function(event) {
      event.preventDefault();
      ////touchEvents.isMoving = false;
      ////if (touchEvents.xDistance < touchEvents.threshold || touchEvents.yDistance < touchEvents.threshold) {
        //// didnt meet the distance threshold, do something
      ////} else {
        //// met the distance threshold, do something else
      ////}
      ////console.log('touchend: ' + 'x: ' + event.pageX + ' - y: ' + event.pageY);
      ////debugger
    },

    onTouchMove = function(event) {
      event.preventDefault();
      ////touchEvents.isMoving = true;
      ////touchEvents.xDistance = touchEvents.xCoordinateStart + event.pageX;
      ////touchEvents.yDistance = touchEvents.yCoordinateStart + event.pageY;
      ////touchEvents.xCoordinateEnd = event.pageX;
      ////touchEvents.yCoordinateEnd = event.pageY;
      ////console.log('touchmove: ' + 'x: ' + event.pageX + ' - y: ' + event.pageY);
      ////debugger
      if (event.pageX > canvas.minX && event.pageX < canvas.maxX) {
        paddle.shape.xCoordinate = Math.max(event.pageX - canvas.minX - (paddle.shape.width / 2), 0);
        //paddle.shape.xCoordinate = Math.min(canvas.shape.width - paddle.shape.width, paddle.shape.xCoordinate);
      }
    },

    onTouchStart = function(event) {
      event.preventDefault();
      ////touchEvents.isMoving = true;
      ////touchEvents.xCoordinateStart = event.pageX;
      ////touchEvents.yCoordinateStart = event.pageY;
      ////console.log('touchstart: ' + 'x: ' + event.pageX + ' - y: ' + event.pageY);
      ////debugger
    };

    document.body.onkeydown = function(event) {
      onKeyDown(event);
    };

    // todo: decide if this is necessary
    ////document.body.onkeypress = function(event) {
      ////onKeyPress(event);
    ////};

    document.body.onkeyup = function(event) {
      // pause/unpause the game
      if (event.keyCode === 80) {
        if (game.timeStart !== undefined) {
          pauseGameLoop();
        }
      }

      // start the game
      if (event.keyCode === 13) {
        if (game.timeStart === undefined) {
          startGameLoop();
        }
      } else {
        onKeyUp(event);
      }
    };

    document.body.onmousemove = function(event) {
      onMouseMove(event);
    };

    document.body.ontouchcancel = function(event) {
      onTouchCancel(event);
    };

    document.body.ontouchend = function(event) {
      onTouchEnd(event);
    };

    document.body.ontouchmove = function(event) {
      onTouchMove(event);
    };

    document.body.ontouchstart = function(event) {
      onTouchStart(event);
    };

    startButton.onclick = function(event) {
      if (game.timeStart === undefined) {
        startGameLoop();
      }
    };

    startButton.ontouchend = function(event) {
      if (game.timeStart === undefined) {
        startGameLoop();
      }
    };

    return {
      initialize: function() {
        loadLevel();
      },
      isGameActive: function() {
        return game.active;
      }
    };

  })(window.document);

  BreakOutWithJavaScript.initialize();
  console.log('press the enter key to begin');

})();

