var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var minePos = [];
var tempMinePos = []; //vi tri nhung o danh co
var numberMine;
var tempNumberMine; // bien nay de random boom
var grid;
var width;
var height;
var empty = [];
// var deletePos = [];
var usePos = []; //vi tri nhung o da ve ra, ke ca o trong.
var run = -1;
var level = document.getElementById("level").value;
var flagImg = document.getElementById("flagboom");
var boomImg = document.getElementById("boom");

window.onload = () => {
    render();
    randomMine();
    // for (mine of minePos) {
    //     ctx.clearRect(mine.x + 2, mine.y + 2, grid - 4, grid - 4);
    //     ctx.drawImage(boomImg, 80, 60, 550, 550, mine.x + 2, mine.y + 2, grid - 4, grid - 4);
    // }
}
var render = () => {
    if (level == 15) {
        grid = 30;
        width = height = level * grid;
        numberMine = 40;
        tempNumberMine = numberMine;
    } else {

    }

    document.getElementById("canvas").setAttribute("width", width);
    document.getElementById("canvas").setAttribute("height", height);
    document.getElementById("canvas").style.border = "3px solid #359df3";
    document.getElementById("canvas").style.background = "#d6dee6";

    ctx.strokeStyle = "#359df3";
    for (let i = grid; i < width; i += grid) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
    }
}

var randomMine = () => {
    if (tempNumberMine <= 0) {
        return;
    }
    do {
        var tempX = Math.floor(Math.random() * level) * grid;
        var tempY = Math.floor(Math.random() * level) * grid;
        var check = checkRandom(tempX, tempY);
    } while (!check)

    minePos.push({
        x: tempX,
        y: tempY
    });
    tempNumberMine--;
    randomMine();
}

var checkRandom = (tempX, tempY) => {
    for (let mine of minePos) {
        if (mine.x == tempX && mine.y == tempY) {
            return false;
        }
    }
    return true;
}

var lose = () => {
    for (mine of minePos) {
        ctx.clearRect(mine.x + 2, mine.y + 2, grid - 4, grid - 4);
        ctx.drawImage(boomImg, 80, 60, 550, 550, mine.x + 2, mine.y + 2, grid - 4, grid - 4);
    }
    alert("you lose");
    canvas.removeEventListener("mousedown", respondMouseClick);
}

var numberAroundMine = (canvas, evt, mouse) => {
    var mousePos = getMousePos(canvas, evt);
    for (var i = 0; i < width; i += grid) {
        if (mousePos.x - i >= 0 && mousePos.x - i < grid) {
            for (var j = 0; j < height; j += grid) {
                if (mousePos.y - j >= 0 && mousePos.y - j < grid) {
                    if (mouse == 0) {
                        for (let mine of minePos) {
                            if (mine.x == i && mine.y == j) {
                                lose();
                                return;
                            }
                        }
                        checkNumberAroundMine(i, j, 1);
                        return;
                    } else {
                        //9 la con so de kiem tra luc bam chuot phai.
                        drawNumber(9, i, j);
                        i = width;
                        j = height;
                        break;
                    }
                }
            }
        }
    }
}

var checkNumberAroundMine = (tempX, tempY, check) => {
    //bien check de kiem tra xem ham draw duoc goi truc tiep tu numberAroundMine hay tu repeat
    var arg1 = tempX - grid;
    var arg2 = tempY - grid;
    var count = 0;
    var loopi = 0;
    var loopj = 0;

    for (var i = arg2; loopi < 3; i += grid) {
        loopi++;
        loopj = 0;
        for (var j = arg1; loopj < 3; j += grid) {
            loopj++;
            if (i < 0 || j < 0) {
                continue;
            }
            if (j == tempX && i == tempY) {
                continue;
            }
            for (let mine of minePos) {
                if (mine.x == j && mine.y == i) {
                    count++;
                }
            }
        }
    }
    drawNumber(count, tempX, tempY, check);
}

var repeat = (tempX, tempY) => {
    var arg1 = tempX - grid;
    var arg2 = tempY - grid;
    var loopi = 0;
    var loopj = 0;

    for (var i = arg2; loopi < 3; i += grid) {
        loopi++;
        loopj = 0;
        loop:
        for (var j = arg1; loopj < 3; j += grid) {
            loopj++;
            if (i < 0 || j < 0) {
                continue;
            }
            if (i > width - grid || j > height - grid) {
                continue;
            }
            if (j == tempX && i == tempY) {
                continue;
            }
            for (let e of empty) {
                if (e.x == j && e.y == i) {
                    continue loop;
                }
            }
            for (let mine of minePos) {
                if (mine.x == j && mine.y == i) {
                    continue loop;
                }
            }
            empty.push({
                x: j,
                y: i
            })
        }
    }
    // debugger;
    for (let k = run + 1; k < empty.length; k++) {
        run = k;
        // console.log(empty[k]);
        // console.log(empty);
        checkNumberAroundMine(empty[k].x, empty[k].y, 0);
        if (k == empty.length - 1) {
            empty.splice(0);
            run = -1;
            return;
        }
    }
}

var drawNumber = (count, tempX, tempY, check) => {
    //if click minh tu click vao nhung o da co trong usePos thi ko lam gi het
    if(check) {
        for(pos of usePos) {
            if(pos.x == tempX && pos.y == tempY) {
                return;
            }
        }
    }
    if (count != 9) {
        ctx.fillStyle = "#8cf76c";
        ctx.fillRect(tempX, tempY, grid, grid);
        ctx.lineWidth = 4;
        ctx.strokeStyle = "#f5b237";
        ctx.strokeRect(tempX, tempY, grid, grid);
        //neu check = 1 thi add vao usePos vi do la gia tri click truc tiep, neu bang 0 thi xet neu co roi thi ko add nua
        if (check) {
            usePos.push({
                x: tempX,
                y: tempY
            })
            console.log(usePos);
        } else {
            for (let x in usePos) {
                let temp = 0;
                if (usePos[x].x == tempX && usePos[x].y == tempY) {
                    temp = 1;
                    break;
                }
                if (temp == 0 && x == usePos.length - 1) {
                    usePos.push({
                        x: tempX,
                        y: tempY
                    })
                    console.log(usePos);
                }
            }
        }
        if (count != 0) {
            switch (count) {
                case 1:
                    ctx.fillStyle = "purple"
                    break;
                case 2:
                    ctx.fillStyle = "blue";
                    break;
                case 3:
                    ctx.fillStyle = "red";
                    break;
                case 4:
                    ctx.fillStyle = "#FF1493";
                    break;
                case 5:
                    ctx.fillStyle = "IndianRed";
                    break;
                case 6:
                    ctx.fillStyle = "LightSeaGreen";
                    break;
                case 7:
                    ctx.fillStyle = "green";
                    break;
                case 8:
                    ctx.fillStyle = "Olive";
                    break;
            }
            ctx.font = "20px Arial";
            ctx.textAlign = "center";
            ctx.fillText(count, tempX + grid/2, tempY + grid/2 + 8);
            win();
        } else {
            repeat(tempX, tempY);
            win();
        }
    } else {
        var isFlag = 0;
        for (let x in tempMinePos) {
            if (tempX == tempMinePos[x].x && tempY == tempMinePos[x].y) {
                tempMinePos.splice(x, 1);
                ctx.fillStyle = "#d6dee6";
                ctx.fillRect(tempX + 2, tempY + 2, grid - 4, grid - 4);
                isFlag = 1;
                break;
            }
        }
        if (isFlag == 0) {
            for (let x in usePos) {
                if (tempX == usePos[x].x && tempY == usePos[x].y) {
                    isFlag = 1;
                    break;
                }
            }
        }
        if (isFlag == 0) {
            tempMinePos.push({
                x: tempX,
                y: tempY
            });
            ctx.drawImage(flagImg, 80, 60, 300, 350, tempX + 2, tempY + 2, grid - 4, grid - 4);
        }
    }
}

var win = () => {
    if (usePos.length == level * level - numberMine) {
        setTimeout(() => alert("You win"), 200);
        canvas.removeEventListener("mousedown", respondMouseClick);
    }
}

var getMousePos = (canvas, evt) => {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

var respondMouseClick = evt => {
    if (evt.button == 0) {
        numberAroundMine(canvas, evt, 0);
    } else if (evt.button == 2) {
        numberAroundMine(canvas, evt, 2);
    }
}

canvas.addEventListener("mousedown", respondMouseClick);
