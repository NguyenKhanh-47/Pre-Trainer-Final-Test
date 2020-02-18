var randomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
} 

function createTable() {
    var rows = document.getElementById("rows").value;
    var cols = document.getElementById("cols").value;
    var tbl = document.getElementsByTagName('table');
    cols = Number(cols);

    var tblbdy = document.createElement('tbody');
    var tblhea = document.createElement('thead');
    for (var i = 1; i <= cols + 1; i++) {
        var tblrw = document.createElement('th');
        var tbldata = document.createTextNode(i);
        tblrw.appendChild(tbldata);
        tblhea.appendChild(tblrw);
    }
    tbl[0].appendChild(tblhea);
    for (var i = 0; i < rows; i++) {
        var tblrw = document.createElement('tr');
        for (var j = 0; j <= cols; j++) {
            var tbltd = document.createElement('td');
            var tbldata = document.createTextNode(randomNumber(1, 1000));

            tbltd.appendChild(tbldata);
            tblrw.appendChild(tbltd);
        }

        tblbdy.appendChild(tblrw);
    }
    tbl[0].appendChild(tblbdy);
}