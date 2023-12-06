$(document).ready(function() {
    const ball = document.getElementById("ball");
    const paddle = document.getElementById("paddle");
    const box = document.querySelector(".box");
    const scoreTableBody = $("#scoreTable tbody");

    let ballX = box.offsetWidth / 2 - ball.offsetWidth / 2;
    let ballY = box.offsetHeight / 2 - ball.offsetHeight / 2;
    let ballSpeedX = 4;
    let ballSpeedY = 6;

    let lives = 3;
    let points = 0;
    let gameOver = false;
    let startTime = null;
    let playerName = null;

    // Function to prompt for player name before restarting the game
    function promptForName() {
        playerName = prompt("Enter your name:");

        // If the player entered a name, add it to the table
        if (playerName) {
            addPlayerToTable(playerName);
        }
    }

    // Function to add a player to the table
    function addPlayerToTable(playerName) {
        if (!gameOver) {
            scoreTableBody.append("<tr><td>" + playerName + "</td></tr>");
        }
    }

    // Function to unbind existing click event and bind a new one
    function bindRestartEvent() {
        $("#restartBtn").off("click").on("click", function() {
            promptForName();
            resetGame();
        });
    }

    // Function to reset the game to its initial state
    function resetGame() {
        // Reset game variables
        ballX = box.offsetWidth / 2 - ball.offsetWidth / 2;
        ballY = box.offsetHeight / 2 - ball.offsetHeight / 2;
        ballSpeedX = 4;
        ballSpeedY = 6;
        lives = 3;
        points = 0;
        gameOver = false;
        startTime = null;

        // Display initial lives, points, and timer
        $("#lives").text("Lives: " + lives);
        $("#points").text("Points: " + points);
        $("#timer").text("Time: 0s");

        // Clear the player name
        playerName = null;

        // Restart the game loop
        resetBall();
        startGameLoop();
    }

    // Function to start the game loop
    function startGameLoop() {
        
		// Set the interval to achieve 30 frames per second
        const interval = 1000 / 30; // 1000 milliseconds / 30 fps
        setInterval(update, interval);
    }

    // Function to update the game state
    function update() {
        // Game logic goes here

        if (!gameOver) {
            // Update ball position
            ballX += ballSpeedX;
            ballY += ballSpeedY;

            // Bounce off the walls
            if (ballX + ball.offsetWidth > box.offsetWidth || ballX < 0) {
                ballSpeedX = -ballSpeedX;
            }

            // Bounce off the ceiling and floor
            if (ballY + ball.offsetHeight > box.offsetHeight || ballY < 0) {
                ballSpeedY = -ballSpeedY;
            }

            // Check if the ball is touching the paddle
            if (
                ballX < paddle.offsetLeft + paddle.offsetWidth &&
                ballX + ball.offsetWidth > paddle.offsetLeft &&
                ballY + ball.offsetHeight > paddle.offsetTop &&
                ballY < paddle.offsetTop + paddle.offsetHeight
            ) {
                ballSpeedY = -ballSpeedY; // Change the direction of the ball vertically
                incrementPoints();
				
				 // Play the bouncing sound
				const bounceSound = document.getElementById("bounceSound");
				bounceSound.currentTime = 0; // Reset the sound to the beginning
				bounceSound.play();
            }

            // Check if the ball is out of the box
            if (ballY + ball.offsetHeight > box.offsetHeight) {
                lives--;

                if (lives <= 0) {
                    gameOver = true;
                    alert("Game Over!"); // You can replace this with your game over logic
                } else {
                    resetBall();
                }
            }

            // Update ball position
            ball.style.left = ballX + "px";
            ball.style.top = ballY + "px";

            // Display remaining lives, points, and timer (in seconds)
            $("#lives").text("Lives: " + lives);
            $("#points").text("Points: " + points);
            const currentTime = new Date().getTime();
            const elapsedTime = (currentTime - startTime) / 1000; // Convert to seconds
            $("#timer").text("Time: " + elapsedTime.toFixed(2) + "s");
        }
	}

    // Function to move the paddle
    function movePaddle(event) {
        // Move the paddle within the box
        const paddleX = Math.min(Math.max(event.clientX - box.getBoundingClientRect().left - paddle.offsetWidth / 2, 0), box.offsetWidth - paddle.offsetWidth);
        paddle.style.left = paddleX + "px";
    }

    // Function to reset the ball position
    function resetBall() {
        ballX = box.offsetWidth / 2 - ball.offsetWidth / 2;
        ballY = box.offsetHeight / 2 - ball.offsetHeight / 2;
        startTime = new Date().getTime();
    }

    // Function to increment points
    function incrementPoints() {
        points++;
    }

    // Event listener for mouse movement to move the paddle
    $(document).on("mousemove", movePaddle);

    // Call promptForName initially to get player's name
    promptForName();

    // Bind the restart event initially
    bindRestartEvent();

    // Start the game loop initially
    startGameLoop();
});
