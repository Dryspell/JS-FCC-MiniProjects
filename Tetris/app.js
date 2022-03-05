document.addEventListener('DOMContentLoaded',()=> {
    const scoreDisplay = document.querySelector('#score');
    const startBtn = document.querySelector('#start-button');
    const width = 10;

    const NUMROWS = 30;
    const NUMCOLS = 20;

    const jTet = [[0,1],[1,1],[2,1],[2,2]];
    const iTet = [[0,1],[1,1],[2,1],[3,1]];
    const oTet = [[0,0],[1,0],[0,1],[1,1]];
    const sTet = [[0,2],[1,2],[1,1],[2,1]];
    const zTet = reflect(sTet);
    const lTet = reflect(jTet);
    const tTet = [[0,1],[1,1],[2,1],[1,2]];
    const TETS = {j: jTet, i: iTet, o: oTet, s: sTet, z: zTet, l:lTet, t:tTet};
    const tetColorPalette = ['red', 'blue', 'purple', 'yellow', 'green'];

    function rotate(piece, theta){
        let tPrime = math.unit(theta, 'deg');
        let rotMat = [[math.cos(tPrime), -math.sin(tPrime)],
                      [math.sin(tPrime), math.cos(tPrime)]];
        return piece.map((cubie) => math.round(math.multiply(cubie, rotMat)));
    }

    function reflect(piece){
        let rotMat = [[-1, 0],
                      [0,1]];
        return piece.map((cubie) => math.round(math.multiply(cubie, rotMat)));
    }
    //console.log(rotate(jTet, 90));

    const gridName = 'gridContainer'
    const miniGridName = 'nextUpMiniGrid'

    makeGrid(NUMCOLS,NUMROWS,gridName);
    makeGrid(4,4, miniGridName);

    function makeGrid(x,y, container) {
        makeRows(y,container);
        makeColumns(x,container);
    }

    //Takes (rows, columns) input and makes a grid
    function makeRows(rowNum,container) {
        const gridContainer = document.getElementById(container);
        //Creates rows
        for (r = 0; r < rowNum; r++) {
            let row = document.createElement("div");
            gridContainer.appendChild(row).className = "gridRow";
        };
    };

    //Creates columns
    function makeColumns(cellNum,container) {
        const gridContainer = document.getElementById(container);
        let rows = gridContainer.getElementsByClassName("gridRow");
        for (i = 0; i < rows.length; i++) {
            for (j = 0; j < cellNum; j++) {
                let newCell = document.createElement("div");
                newCell.id = `Cell(${j},${i})`;
                if (container === miniGridName) {newCell.id += `-${container}`;}
                rows[i].appendChild(newCell).className = "cell";
            };
        };
    };

    let pieces = []
    function spawnRandomPiece(location = [math.random()*NUMCOLS,0]){
        return spawnPiece(color = tetColorPalette[Math.floor(Math.random() * tetColorPalette.length)],
            type = Object.keys(TETS)[Math.floor(Math.random() * Object.keys(TETS).length)],
            loc = math.round(location),
            rot = math.floor(math.random()*4) * 90
        );
    };
    
    let GRAVITY = '2';
    function spawnPiece(color, type, loc, rot){
        // Tetrominoes are of the scheme: 
        let piece = {
            color: color,
            type: type,
            loc: loc,
            rot: rot,
            cubies: [],
            updateCubies: (newLocation = piece.loc) => {
                piece.loc = newLocation;
                piece.cubies = rotate(TETS[type], rot).map((cubie) => math.add(cubie,newLocation));
            },
            move: (dir) => {
                //console.log(`Move Called in direction ${dir}`);
                //if (piece != pieces[pieces.length -1]){return;}
                let dirCheckBool = true;
                let nextCubieCoords = [];
                let nextCubieLoc = [];
                checkDir: for (i in piece.cubies){
                    let cubie = piece.cubies[i];
                    switch(dir){
                        case '2':
                            if (cubie[1]+1 < NUMROWS){
                                nextCubieCoords = [cubie[0], cubie[1]+1];
                                nextCubieLoc = [piece.loc[0], piece.loc[1]+1];
                            } else{
                                dirCheckBool = false;
                                break checkDir;
                            }
                            break;
                        case '4':
                            if (cubie[0]-1 >= 0){
                                nextCubieCoords = [cubie[0]-1, cubie[1]];
                                nextCubieLoc = [piece.loc[0]-1, piece.loc[1]];
                            } else{
                                dirCheckBool = false;
                                break checkDir;
                            }
                            break;
                        case '6':
                            if (cubie[0]+1 < NUMCOLS){
                                nextCubieCoords = [cubie[0]+1, cubie[1]];
                                nextCubieLoc = [piece.loc[0]+1, piece.loc[1]];
                            } else{
                                dirCheckBool = false;
                                break checkDir;
                            }
                            break;
                        case '8':
                            if (cubie[1]-1 >=0){
                                nextCubieCoords = [cubie[0], cubie[1]-1];
                                nextCubieLoc = [piece.loc[0], piece.loc[1]-1];
                            } else{
                                dirCheckBool = false;
                                break checkDir;
                            }
                            break;
                    }
                    //console.log(nextCubieCoords);
                    try {
                        let nextCubie = document.getElementById(`Cell(${nextCubieCoords[0]},${nextCubieCoords[1]})`);
                        //console.log(nextCubie)
                        if (nextCubie.style.backgroundColor == "") {continue checkDir;}
                        if (JSON.stringify(piece.cubies).indexOf(JSON.stringify([nextCubieCoords[0],nextCubieCoords[1]])) != -1){ continue checkDir;}
                        dirCheckBool = false;
                    }
                    catch (TypeError){console.log(`This error should never throw since we prechecked the existence of the cells`)}
                    //Looks like this error does throw...
                };
                if (dirCheckBool){
                    unDraw(piece);
                    piece.updateCubies(nextCubieLoc);
                    draw(piece);
                } else if (GRAVITY == dir){
                    gameOfLifeTrigger(piece);
                }
                //throw {name: "NotImplementedError", message: `pieceMovement in direction ${dir}`}; 
            }
        };
        
        piece.updateCubies();
        let canSpawn = true;
        spawnCheck: for (i in piece.cubies){
            try{
                let cubie = piece.cubies[i];
                if (document.getElementById(`Cell(${cubie[0]},${cubie[1]})`).style.backgroundColor != "") {canSpawn = false; break spawnCheck;}
            } catch (TypeError){

            }
        }
        if (!canSpawn) {
            console.log(`Couldn't spawn piece of shape ${type} at location ${loc}`); 
            return;
        } else {
            console.log(`Spawned piece`, piece);
            pieces.push(piece);
            updatePlots();
            return piece;
        }
    }

    function keyCodeController(event){
        //console.log(`Keyboard Press heard`, event);
        switch (event.code){
            case ('ArrowUp'):
            case ('Numpad8'):
                event.preventDefault();
                pieces[pieces.length -1].move('8');
                break;
            case ('ArrowDown'):
            case ('Numpad2'):
                event.preventDefault();
                pieces[pieces.length -1].move('2');
                break;
            case ('ArrowLeft'):
            case ('Numpad4'):
                event.preventDefault();
                pieces[pieces.length -1].move('4');
                break;
            case ('ArrowRight'):
            case ('Numpad6'):
                event.preventDefault();
                pieces[pieces.length -1].move('6');
                break;
            case ('Tab'):
                //TODO PauseTheGame
                break;
            case ('Space'):
                //TODO rotate the piece
                break;
            }
    };
    document.addEventListener('keyup', keyCodeController);

    function gameOfLifeTrigger(piece){
        //TODO 
    }

    function draw(piece){
        if (!piece) {return;}
        piece.cubies.forEach((cubie) => {
            try {
                let gridSquare = document.getElementById(`Cell(${cubie[0]},${cubie[1]})`);
                gridSquare.classList.add(`cubie-${piece.color}`);
                gridSquare.style.backgroundColor = piece.color;
            } catch (TypeError) {
                //console.log(`Cubie ${cubie} doesn't fit in the grid`);
            }
        });
    };

    function unDraw(piece){
        piece.cubies.forEach((cubie) => {
            try {
                let gridSquare = document.getElementById(`Cell(${cubie[0]},${cubie[1]})`);
                gridSquare.classList.remove(`cubie-${color}`);
                gridSquare.style.backgroundColor = "";
            } catch (TypeError){
                //console.log(`Cubie ${cubie} not present on screen`);
            }
        });
    }

    const drawRandom = () => draw(spawnRandomPiece());

    function fallPieces(){
        //TODO allow for gravity to be changed to any of the four (eight?) directions.
        pieces.forEach((piece) => piece.move(GRAVITY));
        updatePlots();
    }

    function updatePlots(){
        let pieceColors = pieces.map((piece) => piece.color);
        let pieceTypes = pieces.map((piece) => piece.type);
        let cubiesColors = [];
        document.querySelectorAll('.cell').forEach((cell) => cubiesColors.push(cell.style.backgroundColor));

        function getCounts(arr) {
            let counts = {};
            arr.forEach((elem) => {
                if (elem == "") {elem = "White"}
                if (counts[elem]) {counts[elem] = counts[elem]+1} else {counts[elem] = 1}
            });
            return counts;
        }

        let pbcTrace = {
            x: [Object.keys(getCounts(pieceColors))],
            y: [Object.values(getCounts(pieceColors))],
            type: 'bar'
        }

        let pbtTrace = {
            x: [Object.keys(getCounts(pieceTypes))],
            y: [Object.values(getCounts(pieceTypes))],
            type: 'bar'
        }

        let cbcTrace = {
            x: [Object.keys(getCounts(cubiesColors))],
            y: [Object.values(getCounts(cubiesColors))],
            type: 'bar'
        }

        Plotly.restyle('piecesByColorPlot', pbcTrace);
        Plotly.restyle('piecesByTypePlot', pbtTrace);
        Plotly.restyle('cubiesByColorPlot', cbcTrace);
    }

    layout = {title: 'Colors of Pieces'};
    Plotly.newPlot('piecesByColorPlot', [{x: tetColorPalette, y: 0, type: 'bar'}], {title: 'Colors of Pieces', height:333} );
    Plotly.newPlot('piecesByTypePlot', [{x: Object.keys(TETS), y: 0, type: 'bar'}], {title: 'Pieces by Type',height:333} );
    Plotly.newPlot('cubiesByColorPlot', [{x: tetColorPalette, y: 0, type: 'bar'}], {title: 'Colors of Squares',height:333} );
    //TODO Run Counts for largest path, largest rectangles, largest contiguous space
    updatePlots();

    movementTimer = setInterval(fallPieces, 500);
    drawRandom();
    spawnTimer = setInterval(drawRandom,2500);
});