var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var img = document.getElementById("food");
var grid = 20;
var x = 180;
var y = 180;
var dx = grid;
var dy = 0;
var mod;
var snakeLength = [];
var maxLength = 1;
var food = {
    fx: 300,
    fy: 300
}
var interval;

var start = () => {
    document.getElementById("canvas").setAttribute("width", 400);
    document.getElementById("canvas").setAttribute("height", 400);
    document.addEventListener("keydown", checkKeyDown);
    var radios = document.getElementsByName("mod");
    for (var i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            mod = radios[i].value;
            console.log(mod);
            break;
        }
    }
    if (mod == 1) {
        document.getElementById("canvas").style.border = "15px solid blue";
    } else {
        document.getElementById("canvas").style.border = "2px solid blue";
    }
    document.getElementById("submit").disabled = true;
    document.getElementById("submit").style.background = "grey";

    interval = setInterval(() => {
        snake();
    }, 1000);
}

var newGame = () => {
    clearInterval(interval);
    x = 180;
    y = 180;
    dx = grid;
    dy = 0;
    maxLength = 1;
    snakeLength = [];
    food = {
        fx: 300,
        fy: 300
    }
    document.getElementById("submit").disabled = false;
    document.getElementById("submit").style.background = "orange";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.getElementById("canvas").setAttribute("width", 0);
    document.getElementById("canvas").setAttribute("height", 0);
    document.getElementById("canvas").style.border = "none";
    document.getElementById("info").innerHTML = "";
}

var randomFood = () => {
    //*20 vì có 20 ô. sau đó nhân với grid để lấy tọa độ 
    return Math.floor(Math.random() * 20) * grid;
}

var snake = () => {
    x += dx;
    y += dy;

    if (mod == 0) {
        if (x >= canvas.width) {
            x = 0;
        } else if (x < 0) {
            x = canvas.width - grid;
        }
        if (y >= canvas.height) {
            y = 0;
        } else if (y < 0) {
            y = canvas.height - grid;
        }
    } else {
        if (x >= canvas.width || x < 0 || y >= canvas.height || y < 0) {
            gameOver();
            return;
        }
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    snakeLength.unshift({
        x: x,
        y: y
    })
    if (snakeLength.length > maxLength) {
        snakeLength.pop();
    }

    for (let value of snakeLength) {
        ctx.fillStyle = "orange";
        ctx.fillRect(value.x, value.y, grid - 1, grid - 1);
    }

    ctx.drawImage(img, 0, 0, 450, 450, food.fx, food.fy, 20, 20);

    //ăn trái cây
    if (food.fx == snakeLength[0].x && food.fy == snakeLength[0].y) {
        maxLength++;
        document.getElementById("score").innerHTML = "Scores: " + (maxLength - 1);

        food.fx = randomFood();
        food.fy = randomFood();
        do {
            var check = checkFoodPos();
        } while (!check);
    }

    //kiểm tra rắn đè lên thân
    for (let i in snakeLength) {
        if(i != 0 && snakeLength[i].x == snakeLength[0].x && snakeLength[i].y == snakeLength[0].y) {
            gameOver();
            return;
        }
    }
}

var gameOver = () => {
    clearInterval(interval);
    document.getElementById("info").innerHTML = "Game Over";
    document.removeEventListener("keydown", checkKeyDown);
} 

var checkFoodPos = () => {
    for (let body of snakeLength) {
        if (food.fx == body.x && food.fy == body.y) {
            food.fx = randomFood();
            food.fy = randomFood();
            return false;
        }
    }
    return true;
}

var checkKeyDown = () => {
    var key = event.width || event.keyCode;
    if (key === 37 && dx === 0) {
        dx = -grid;
        dy = 0;
        snake();
    } else if (key === 38 && dy === 0) {
        dy = -grid;
        dx = 0;
        snake();
    } else if (key === 39 && dx === 0) {
        dx = grid;
        dy = 0;
        snake();
    } else if (key == 40 && dy === 0) {
        dy = grid;
        dx = 0;
        snake();
    }
}

