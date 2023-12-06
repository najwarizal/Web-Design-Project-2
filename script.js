$(document).ready(function () {
    const ball = document.getElementById("ball");
    const paddle = document.getElementById("paddle");
    const box = document.querySelector(".box");
    const scoreTableBody = $("#scoreTable tbody");

    let ballX = box.offsetWidth / 2 - ball.offsetWidth / 2;
    let ballY = box.offsetHeight - paddle.offsetHeight - ball.offsetHeight; // Initially stick to the paddle
    let ballSpeedX = 0;
    let ballSpeedY = 0;

    let paddleX = box.offsetWidth / 2 - paddle.offsetWidth / 2;
    let paddleSpeed = 6;

    let lives = 3;
    let points = 0;
    let gameOver = false;
    let startTime = null;
    let playerName = null;
    let gameStarted = false;

    function promptForName() {
        playerName = prompt("Enter your name:");
        if (playerName) {
            addPlayerToTable(playerName);
        }
    }

    function addPlayerToTable(playerName) {
        if (!gameOver) {
            scoreTableBody.append("<tr><td>" + playerName + "</td></tr>");
        }
    }

    function bindRestartEvent() {
        $("#restartBtn").off("click").on("click", function () {
            promptForName();
            resetGame();
        });
    }

    function resetGame() {
        ballSpeedX = 0;
        ballSpeedY = 0;
        ballX = box.offsetWidth / 2 - ball.offsetWidth / 2;
        ballY = box.offsetHeight - paddle.offsetHeight - ball.offsetHeight; // Stick to the paddle
        paddleX = box.offsetWidth / 2 - paddle.offsetWidth / 2;
        lives = 3;
        points = 0;
        gameOver = false;
        startTime = null;
        playerName = null;
        gameStarted = false;
        $("#lives").text("Lives: " + lives);
        $("#points").text("Points: " + points);
        $("#timer").text("Time: 0s");
        resetBall();
        startGameLoop();
    }

    function startGameLoop() {
        const interval = 1000 / 30;
        setInterval(update, interval);
    }

    function update() {
        if (!gameOver) {
            paddleX = Math.min(Math.max(paddleX, 0), box.offsetWidth - paddle.offsetWidth);

            if (gameStarted) {
                ballX += ballSpeedX;
                ballY += ballSpeedY;

                if (ballX + ball.offsetWidth > box.offsetWidth || ballX < 0) {
                    ballSpeedX = -ballSpeedX;
                }

                if (ballY + ball.offsetHeight > box.offsetHeight || ballY < 0) {
                    ballSpeedY = -ballSpeedY;
                }

                if (
                    ballX < paddleX + paddle.offsetWidth &&
                    ballX + ball.offsetWidth > paddleX &&
                    ballY + ball.offsetHeight > box.offsetHeight - paddle.offsetHeight
                ) {
                    ballSpeedY = -ballSpeedY;
                    incrementPoints();

                    const bounceSound = document.getElementById("bounceSound");
                    bounceSound.currentTime = 0;
                    bounceSound.play();
                }

                if (ballY + ball.offsetHeight > box.offsetHeight) {
                    lives--;

                    if (lives <= 0) {
                        gameOver = true;
                        alert("Game Over!");
                    } else {
                        resetBall();
                    }
                }

                ball.style.left = ballX + "px";
                ball.style.top = ballY + "px";
            }

            paddle.style.left = paddleX + "px";

            if (gameStarted) {
                const currentTime = new Date().getTime();
                const elapsedTime = (currentTime - startTime) / 1000;
                $("#timer").text("Time: " + elapsedTime.toFixed(2) + "s");
            }
        }
    }

    function movePaddle(event) {
        paddleX = event.clientX - box.getBoundingClientRect().left - paddle.offsetWidth / 2;

        if (!gameStarted) {
            gameStarted = true;
            ballSpeedX = 4;
            ballSpeedY = 4;
            startTime = new Date().getTime();
        }
    }

    function resetBall() {
        ballX = box.offsetWidth / 2 - ball.offsetWidth / 2;
        ballY = box.offsetHeight - paddle.offsetHeight - ball.offsetHeight; // Stick to the paddle
        gameStarted = false;
    }

    function incrementPoints() {
        points++;
    }

    $(document).on("mousemove", movePaddle);

    promptForName();

    bindRestartEvent();

    startGameLoop();
	
});
