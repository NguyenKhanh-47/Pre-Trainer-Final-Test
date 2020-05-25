var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var minePos = [];
var numberMine = 0;
var temp;
var width;
var height;
var empty= [];
var deletePos = [];
var run = -1;
var level = document.getElementById("level").value;

window.onload = () => {
    render();
    randomMine();
    drawMine();
}
var render = () => {

    if (level == 10) {
        temp = 50;
        width = height = level * temp;
        numberMine = 10;
    }

    document.getElementById("canvas").setAttribute("width", width);
    document.getElementById("canvas").setAttribute("height", height);
    document.getElementById("canvas").style.border = "2px solid #359df3";
    document.getElementById("canvas").style.background = "#d6dee6";

    ctx.strokeStyle = "#359df3";
    for (let i = temp; i < width; i += temp) {
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
    if (numberMine <= 0) {
        return;
    }
    do {
        var tempX = Math.floor(Math.random() * level) * temp;
        var tempY = Math.floor(Math.random() * level) * temp;
        var check = checkRandom(tempX, tempY);
    } while (!check)

    minePos.push({
        x: tempX,
        y: tempY
    });
    numberMine--;
    randomMine();
}

var drawMine = () => {
    for (let mine of minePos) {
        ctx.beginPath();
        ctx.arc(mine.x + temp / 2, mine.y + temp / 2, (temp - 16) / 2, 0, 2 * Math.PI);
        ctx.stroke();
    }
}

var checkRandom = (tempX, tempY) => {
    for (let mine of minePos) {
        if (mine.x == tempX && mine.y == tempY) {
            return false;
        }
    }
    return true;
}

var numberAroundMine = (canvas, evt) => {
    var mousePos = getMousePos(canvas, evt);
    for (var i = 0; i < width; i += temp) {
        if (mousePos.x - i >= 0 && mousePos.x - i < temp) {
            for (var j = 0; j < height; j += temp) {
                if (mousePos.y - j >= 0 && mousePos.y - j < temp) {
                    for (let mine of minePos) {
                        if (mine.x == i && mine.y == j) {
                            alert("you lose");
                            canvas.removeEventListener("mousedown", respondMouseClick)
                            return;
                        }
                    }
                    checkNumberAroundMine(i, j);
                    return;
                }
            }
        }
    }
}

var checkNumberAroundMine = (tempX, tempY) => {
    var arg1 = tempX - temp;
    var arg2 = tempY - temp;
    var count = 0;
    var loopi = 0;
    var loopj = 0;

    for (var i = arg2; loopi < 3; i += temp) {
        loopi++;
        loopj = 0;
        for (var j = arg1; loopj < 3; j += temp) {
            loopj++;
            if (i < 0 || j < 0) {
                continue;
            }
            if (i == tempX && j == tempY) {
                continue;
            }
            for (let mine of minePos) {
                if (mine.x == j && mine.y == i) {
                    count++;
                }
            }
        }
    }
    drawNumber(count, tempX, tempY);
}

var repeat = (tempX, tempY) => {
    var arg1 = tempX - temp;
    var arg2 = tempY - temp;
    var loopi = 0;
    var loopj = 0;

    for (var i = arg2; loopi < 3; i += temp) {
        loopi++;
        loopj = 0;
        loop:
            for (var j = arg1; loopj < 3; j += temp) {
                loopj++;
                if (i < 0 || j < 0) {
                    continue;
                }
                if (j == tempX && i == tempY) {
                    continue;
                }
                for(let e of empty) {
                    if(e.x == j && e.y == i) {
                        continue loop;
                    }
                }
                // for(let dele of deletePos) {
                //     if(dele.x = j && dele.y == i) {
                //         continue loop;
                //     }
                // }
                empty.push({
                    x: j,
                    y: i
                })
            }
    }
    // for(let e of empty) {
    //     // console.log(e);
    //     // console.log(empty);
    //     // deletePos.push(e);
    //     // empty.shift();
    //     checkNumberAroundMine(e.x, e.y);
    // }
    //nếu hàm draw với count != 0 thì sẽ vẽ bình thường và xét k++ để tiếp tục vòng lặp. nhưng với count == 0 thì sẽ gọi lại hàm repeat do đó mảng empty đang xét sẽ bị xét lại từ phần tử đầu tiên. nên tạo một biến run để dù count bằng bao nhiêu thì vẫn đảm bảo mảng empty sẽ xét tuần tự các phần tử 
    for (let k = run + 1; k < empty.length; k++) {
        run = k;
        console.log(empty[k]);
        console.log(empty);
        checkNumberAroundMine(empty[k].x, empty[k].y);
    }
}

var drawNumber = (count, tempX, tempY) => {
    ctx.fillStyle = "#8cf76c";
    ctx.fillRect(tempX, tempY, temp, temp);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#f5b237";
    ctx.strokeRect(tempX, tempY, temp, temp);
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
                ctx.fillStyle = "green";
                break;

        }
        ctx.font = "25px Arial";
        ctx.textAlign = "center";
        ctx.fillText(count, tempX + 25, tempY + 35);
    } else {
        // run++;/
        repeat(tempX, tempY);
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
        numberAroundMine(canvas, evt);
    }
}

canvas.addEventListener("mousedown", respondMouseClick);



// var numberAroundMine = () => {
//     for (let i = 0; i < width; i += temp) {
//         loop:
//             for (let j = 0; j < height; j += temp) {
//                 for(let mine of minePos) {
//                     if(mine.x == j && mine.y == i) {
//                         continue loop;
//                     }
//                 }
//                 checkNumberAroundMine(j, i);
//             }
//     }
// }

// var checkNumberAroundMine = (tempj, tempi) => {
//     var arg1 = tempj - temp;
//     var arg2 = tempi - temp;
//     var count = 0;
//     var loopi = 0;
//     var loopj = 0;

//     for (var i = arg2; loopi < 3; i += temp) {
//         loopi++;
//         loopj = 0;
//         for (var j = arg1; loopj < 3; j += temp) {
//             loopj++;
//             if(i < 0 || j < 0) {
//                 continue;
//             }
//             if(i == tempi && j == tempj) {
//                 continue;
//             }
//             for(let mine of minePos) {
//                 if(mine.x == j && mine.y == i) {
//                     count++;
//                 }
//             }
//         }
//     }
//     if(count != 0) {
//         switch (count) {
//             case 1:
//                 ctx.fillStyle = "orange"
//                 break;
//             case 2: 
//                 ctx.fillStyle = "blue";
//                 break;
//             case 3:
//                 ctx.fillStyle = "red";
//                 break;
//             case 4: 
//                 ctx.fillStyle = "green";
//                 break; 

//         }
//         ctx.font = "25px Arial";
//         ctx.textAlign = "center";   
//         ctx.fillText(count, tempj + temp/2, tempi + temp/2 + temp/5);
//     }
// }