import { CanvasView } from "./view/CanvasView";
import { Ball } from "./sprites/ball";
import { Brick } from "./sprites/brick";
import { Paddle } from "./sprites/paddle";
import { Collision } from "./collision";
//images

import paddle_image from "./images/paddle.png"
import ball_image from "./images/ball.png"
//level and colors 
import {
    PADDLE_SPEED,
    PADDLE_HEIGHT,
    PADDLE_STARTX,
    PADDLE_WIDTH,
    BALL_SIZE,
    BALL_SPEED,
    BALL_STARTX,
    BALL_STARTY,
    BRICK_IMAGES
} from "./setup";

//helpers
import { createBricks } from "./helpers"

let gameOver = false
let score = 0


function setGameOver(view: CanvasView) {
    view.drawInfo(`Game Over!`)
    gameOver = false
}


function setGameWin(view: CanvasView) {
    view.drawInfo(`Game Won!`)
    gameOver = false
}


function gameLoop(
    view: CanvasView,
    bricks: Brick[],
    paddle: Paddle,
    ball: Ball,
    collision: Collision
) {
    view.clear()
    console.log(`draw!`)
    view.drawBrick(bricks)
    view.drawSprite(paddle)
    view.drawSprite(ball)
    //Move ball
    ball.moveBall()


    //move paddle and check so it wont exit the playfield
    if (
        (paddle.isMovingLeft && paddle.pos.x > 0) ||
        (paddle.isMovingRight && paddle.pos.x < view.canvas.width - paddle.width)
    ) {
        paddle.movePaddle()
    }

    collision.checkBallCollision(ball, paddle, view)
    const collidingBrick = collision.isCollidingBricks(ball, bricks)


    if (collidingBrick) {
        score += 1
        view.drawScore(score)
    }

    //Game over when ball leaves playfield
    if (ball.pos.y > view.canvas.height) gameOver = true

    //if game won, set gameover and display win
    if (bricks.length === 0) return setGameWin(view)

    //return if gameover and dont run the requestAnimationFrame
    if (gameOver) return setGameOver(view)

    requestAnimationFrame(() => gameLoop(view, bricks, paddle, ball, collision))
}

function startGame(view: CanvasView) {
    //reset displays
    score = 0;
    view.drawInfo(``)
    view.drawScore(0)
    //create a collision instance 
    const collision = new Collision()
    //create all bricks
    const bricks = createBricks()
    //Create ball
    const ball = new Ball(
        BALL_SPEED,
        BALL_SIZE,
        { x: BALL_STARTX, y: BALL_STARTY },
        ball_image
    )
    //create a paddle
    const paddle = new Paddle(
        PADDLE_SPEED,
        PADDLE_WIDTH,
        PADDLE_HEIGHT,
        {
            x: PADDLE_STARTX,
            y: view.canvas.height - PADDLE_HEIGHT - 5
        },
        paddle_image
    )

    gameLoop(view, bricks, paddle, ball, collision)
}
//create a new view 

const view = new CanvasView(`#playField`)
view.initStartButton(startGame)
