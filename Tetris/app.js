

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
    const tetColorPalette = ['red', 'blue', 'purple', 'yellow', 'green'];

    function rotate(piece, theta){
        let tPrime = math.unit(theta, 'deg');
        let rotMat = [[math.cos(tPrime), -math.sin(tPrime)],
                      [math.sin(tPrime), math.cos(tPrime)]];
        
        return piece.map((cubie) => math.round(math.multiply(cubie, rotMat)));
    }
    //console.log(rotate(jTet, 90));

    defaultGrid(10,20);
    //Creates a default grid sized 16x16 
    function defaultGrid(x,y) {
        makeRows(y);
        makeColumns(x);
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
        let rows = document.getElementsByClassName("gridRow");
        for (i = 0; i < rows.length; i++) {
            for (j = 0; j < cellNum; j++) {
                let newCell = document.createElement("div");
                newCell.id = `Cell(${j},${i})`;
                rows[i].appendChild(newCell).className = "cell";
            };
        };
    };

    function getRandomPiece(){
    // Tetrominoes are of the scheme: 
        let piece = {
            color: tetColorPalette[Math.floor(Math.random() * tetColorPalette.length)],
            type: Object.keys(TETS)[Math.floor(Math.random() * Object.keys(TETS).length)],
            loc: [4,1],
            rot: math.floor(math.random()*4) * 90,
            cubies: []
        };
        //console.log(piece);
        piece.cubies = rotate(TETS[piece.type], piece.rot);
        piece.cubies = piece.cubies.map((cubie) => math.add(cubie,piece.loc));
        console.log(piece);
        return piece;
    }

    function draw(piece){
        //console.log(piece);
        piece.cubies.forEach((cubie) => {
            try {
                let gridSquare = document.getElementById(`Cell(${cubie[0]},${cubie[1]})`);
                gridSquare.classList.add(`cubie-${piece.color}`);
                gridSquare.style.backgroundColor = piece.color;
            } catch (TypeError) {
                console.log(`Cubie ${cubie} doesn't fit in the grid`);
            }
        });
    };

    function unDraw(piece){
        piece.cubies.forEach((cubie) => {
            let gridSquare = document.getElementById(`Cell(${cubie[0]},${cubie[1]})`);
            gridSquare.classList.remove(`cubie-${color}`);
        });
    }

    draw(getRandomPiece());
    draw(getRandomPiece());
    draw(getRandomPiece());
    draw(getRandomPiece());
    draw(getRandomPiece());
})