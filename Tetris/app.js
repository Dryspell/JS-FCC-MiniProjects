

document.addEventListener('DOMContentLoaded',()=> {
    

    const gridContainer = document.getElementById("gridContainer");
    const scoreDisplay = document.querySelector('#score');
    const startBtn = document.querySelector('#start-button');
    const width = 10;

    const jTet = [[0,1],[1,1],[2,1],[2,2]];
    const iTet = [[0,1],[1,1],[2,1],[3,1]];
    const oTet = [[0,0],[1,0],[0,1],[1,1]];
    const sTet = [[0,2],[1,2],[1,1],[2,1]];
    const TETS = {j: jTet, i: iTet, o: oTet, s: sTet};

    function rotate(piece, theta){
        let tPrime = math.unit(theta, 'deg');
        let rotMat = [[math.cos(tPrime), -math.sin(tPrime)],
                      [math.sin(tPrime), math.cos(tPrime)]];
        
        return piece.map((cubie) => math.round(math.multiply(cubie, rotMat)));
    }
    console.log(rotate(jTet, 90));

    // let cells = document.getElementsByClassName("cell");

    defaultGrid();
    //Creates a default grid sized 16x16 
    function defaultGrid() {
        makeRows(20);
        makeColumns(10);
    }

    //Takes (rows, columns) input and makes a grid
    function makeRows(rowNum) {
        //Creates rows
        for (r = 0; r < rowNum; r++) {
            let row = document.createElement("div");
            gridContainer.appendChild(row).className = "gridRow";
        };
    };

    //Creates columns
    function makeColumns(cellNum) {
        console.log(cellNum)
        let rows = document.getElementsByClassName("gridRow");
        console.log(rows.length)
        for (i = 0; i < rows.length; i++) {
            for (j = 0; j < cellNum; j++) {
                let newCell = document.createElement("div");
                newCell.id = `Cell (${j},${i})`;
                rows[i].appendChild(newCell).className = "cell";
                //console.log([i,j])
            };

        };
    };
})