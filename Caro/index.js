var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var number;
var xOro = 1;
var width;
var height;
var myArr = [];
var arrWinO = [];
var arrWinX = [];
var temp;
var countX = 0;
var countO = 0;

var render = () => {
    c.addEventListener("mousedown", draw);
    number = Number(document.getElementById("number").value);
    numWin = Number(document.getElementById("numWin").value);
    if (number < 3 || numWin < 3) {
        return;
    }
    if (numWin > number) {
        document.getElementById("info").innerHTML = "The numbers to win must be smaller than the number of grid";
        return;
    }
    if (number == 3) {
        width = 300;
        height = 300;
    } else {
        //rate = tỉ lệ giữa chiều rộng và số ô.
        var rate = (900 - 300) / (30 - 3);
        let tempWidth = 300 + Math.floor(rate) * (number - 3);
        width = height = Math.floor(tempWidth / number) * number
    }
    temp = Math.floor(width / number);
    document.getElementById("info").innerHTML = "&nbsp;";
    document.querySelector("input[type = 'submit']").disabled = true;
    document.getElementById("submit").style.background = "grey";
    document.getElementById("myCanvas").setAttribute("width", width);
    document.getElementById("myCanvas").setAttribute("height", height);
    document.getElementById("myCanvas").style.border = "2px solid #359df3";
    document.getElementById("myCanvas").style.background = "#d6dee6";

    ctx.strokeStyle = "#359df3";
    for (let i = 0; i < width; i += temp) {
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

var draw = evt => {
    var mousePos = getMousePos(c, evt);
    ctx.lineCap = "round";
    ctx.lineWidth = 4;
    loop:
        for (var i = temp; i <= width; i += temp) {
            if (mousePos.x < i) {
                for (var j = temp; j <= height; j += temp) {
                    if (mousePos.y < j) {
                        for (let k in myArr) {
                            if (myArr[k][0] == i && myArr[k][1] == j) {
                                return;
                            }
                        }
                        if (xOro) {
                            drawXO(i, j, "X", "#f70c0c");
                            myArr.push([i, j, 1]);
                        } else {
                            drawXO(i, j, "O", "#000");
                            myArr.push([i, j, 0]);
                        }
                        xOro == 1 ? xOro = 0 : xOro = 1;
                        break loop;
                    }
                }
            }
        }
    checkWinHorizontal();
}

var checkWinHorizontal = () => {
    let tempCheck = 1;
    let arg1, arg2;
    loop:
        for (var j = temp; j <= height; j += temp) {
            countX = 0;
            countO = 0;
            for (var i = temp; i <= width; i += temp) {
                if (tempCheck) {
                    arg1 = i;
                    arg2 = j;
                } else {
                    arg1 = j;
                    arg2 = i;
                }
                if (count(arg1, arg2)) {
                    return;
                }
            }
            if (i > width && j == height) {
                if (tempCheck) {
                    tempCheck = 0;
                    j = 0;
                    i = 0;
                    continue loop;
                }
            }
        }
    return checkWinDiagonal();
}

var checkWinDiagonal = () => {
    let arg1;
    let arg2;
    var diagonal = 0;
    loop:
        for (var j = temp; j <= height; j += temp) {
            countX = 0;
            countO = 0;
            for (var i = temp; i <= width; i += temp) {
                arg1 = i;
                arg2 = j;
                countX = 0;
                countO = 0;
                while (arg1 <= height && arg1 > 0 && arg2 <= width && arg2 > 0) {
                    if (count(arg1, arg2)) {
                        return;
                    }
                    if (diagonal) {
                        arg1 -= temp;
                        arg2 += temp;
                    } else {
                        arg1 += temp;
                        arg2 += temp;
                    }
                }
            }
            if (i > width && j == height) {
                if (diagonal == 0) {
                    diagonal = 1;
                    i = 0;
                    j = 0;
                    countX = 0;
                    countO = 0;
                    arrWinO.splice(0);
                    arrWinX.splice(0);
                    continue loop;
                }
            }
        }
    return;
}

var count = (arg1, arg2) => {
    let yes = 0;
    loop1:
        for (let k in myArr) {
            yes = 0;
            if (myArr[k][0] == arg1 && myArr[k][1] == arg2) {
                if (myArr[k].includes(1)) {
                    arrWinO.splice(0);
                    countX++;
                    countO = 0;
                    arrWinX.push([arg1, arg2]);
                } else {
                    arrWinX.splice(0);
                    countO++;
                    countX = 0;
                    arrWinO.push([arg1, arg2]);
                }
                yes = 1;
                if (countX == numWin || countO == numWin) {
                    countX == numWin ? showWin("X") : showWin("O");
                    return true;
                }
                break loop1;
            }
        }
    if (yes == 0) {
        countX = 0;
        countO = 0;
        arrWinO.splice(0);
        arrWinX.splice(0);
    }
}

var showWin = char => {
    console.log(arrWinO);
    console.log(arrWinX);
    let limit;
    char == "X" ? limit = arrWinX : limit = arrWinO;
    for (let i = 0; i < limit.length; i++) {
        if (char == "X") {
            drawXO(limit[i][0], limit[i][1], "X", "#e68b14");
        } else {
            drawXO(limit[i][0], limit[i][1], "O", "#e68b14");
        }
    }
    setTimeout(function () {
        if (confirm(char + " player win. Do you want to continue?") == true) {
            reset();
        } else {
            c.removeEventListener("mousedown", draw);
        }
    }, 100)
}

var reset = () => {
    countX = 0;
    countO = 0;
    xOro = 1;
    myArr = [];
    arrWinO = [];
    arrWinX = [];
    render();
}

var clearGame = () => {
    reset();
    ctx.clearRect(0, 0, c.width, c.height);
    document.getElementById("myCanvas").setAttribute("width", 0);
    document.getElementById("myCanvas").setAttribute("height", 0);
    document.getElementById("number").value = "";
    document.getElementById("numWin").value = "";
    document.querySelector("input[type = 'submit']").disabled = false;
    document.getElementById("submit").style.background = "orange";
}

var drawXO = (arg1, arg2, arg3, arg4) => {
    ctx.strokeStyle = arg4;
    if (arg3 == "X") {
        //arg1 - temp(width/number) sẽ trả về tọa độ gốc của vùng vừa click sau đó cộng thêm 8 để tạo khoảng cách vẽ với viền xung quanh.
        ctx.beginPath();
        ctx.moveTo(arg1 - temp + 8, arg2 - temp + 8);
        ctx.lineTo(arg1 - 8, arg2 - 8);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(arg1 - 8, arg2 - temp + 8);
        ctx.lineTo(arg1 - temp + 8, arg2 - 8);
        ctx.stroke();
    } else {
        ctx.beginPath();
        ctx.arc(arg1 - temp / 2, arg2 - temp / 2, (temp - 16) / 2, 0, 2 * Math.PI);
        ctx.stroke();
    }
}

var getMousePos = (c, evt) => {
    var rect = c.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

c.addEventListener("mousedown", draw);