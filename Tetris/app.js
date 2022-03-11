document.addEventListener('DOMContentLoaded',()=> {
    const scoreDisplay = document.querySelector('#score');
    const startBtn = document.querySelector('#start-button');
    const width = 10;

    const NUMROWS = 20;
    const NUMCOLS = 10;

    const jTet = [[-1,0],[0,0],[1,0],[1,1]];
    const iTet = [[-1,0],[0,0],[1,0],[2,0]];
    const oTet = [[-1,-1],[0,-1],[-1,0],[0,0]];
    const sTet = [[-1,1],[0,1],[0,0],[1,0]];
    const zTet = reflect(sTet);
    const lTet = reflect(jTet);
    const tTet = [[-1,0],[0,0],[1,0],[0,1]];
    const TETS = {j: jTet, i: iTet, o: oTet, s: sTet, z: zTet, l:lTet, t:tTet};
    const tetColorPalette = ['red', 'blue', 'purple', 'yellow', 'green'];

    function rotate(piece, theta=90){
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
    class Piece {
        constructor(color, type, loc, rot){
            this.color = color;
            this.type = type;
            this.loc = loc;
            this.rot = rot;
            this.cubies = rotate(TETS[this.type], this.rot).map((cubie) => math.add(cubie,this.loc))
            this.hasTriggeredASpawn = false;
        }
        updateCubies = (newLocation = this.loc) => {
            this.unDraw();
            this.cubies = this.cubies.map((cubie) => math.subtract(cubie, this.loc))
            this.loc = newLocation;
            this.cubies = this.cubies.map((cubie) => math.add(cubie,this.loc));
            this.draw();
        };
        rotate = (theta) => {
            console.log('Rotating Piece', this.rot, this.cubies);
            this.rot += theta;
            this.unDraw();
            this.cubies = this.cubies.map((cubie) => math.subtract(cubie, this.loc))
            this.cubies = rotate(this.cubies, theta);
            this.cubies = this.cubies.map((cubie) => math.add(cubie,this.loc));
            this.draw();
            console.log('Rotation Complete', this.rot, this.cubies);
            return this;
        };
        unDraw = () => {
            this.cubies.forEach((cubie) => {
                try {
                    let gridSquare = document.getElementById(`Cell(${cubie[0]},${cubie[1]})`);
                    gridSquare.classList.remove(`cubie-${this.color}`);
                    gridSquare.style.backgroundColor = "";
                } catch (TypeError){
                    //console.log(`Cubie ${cubie} not present on screen`);
                }
            });
        }
        draw = () => {
            this.cubies.forEach((cubie) => {
                try {
                    let gridSquare = document.getElementById(`Cell(${cubie[0]},${cubie[1]})`);
                    gridSquare.classList.add(`cubie-${this.color}`);
                    gridSquare.style.backgroundColor = this.color;
                } catch (TypeError) {
                    //console.log(`Cubie ${cubie} doesn't fit in the grid`);
                }
            });
        }
        move = (dir) => {
            //console.log(`Move Called in direction ${dir}`);
            let dirCheckBool = true;
            let nextCubieCoords = [];
            let nextCubieLoc = [];
            checkDir: for (i in this.cubies){
                let cubie = this.cubies[i];
                switch(dir){
                    case '2':
                        if (cubie[1]+1 < NUMROWS){
                            nextCubieCoords = [cubie[0], cubie[1]+1];
                            nextCubieLoc = [this.loc[0], this.loc[1]+1];
                        } else{
                            dirCheckBool = false;
                            break checkDir;
                        }
                        break;
                    case '4':
                        if (cubie[0]-1 >= 0){
                            nextCubieCoords = [cubie[0]-1, cubie[1]];
                            nextCubieLoc = [this.loc[0]-1, this.loc[1]];
                        } else{
                            dirCheckBool = false;
                            break checkDir;
                        }
                        break;
                    case '6':
                        if (cubie[0]+1 < NUMCOLS){
                            nextCubieCoords = [cubie[0]+1, cubie[1]];
                            nextCubieLoc = [this.loc[0]+1, this.loc[1]];
                        } else{
                            dirCheckBool = false;
                            break checkDir;
                        }
                        break;
                    case '8':
                        if (cubie[1]-1 >=0){
                            nextCubieCoords = [cubie[0], cubie[1]-1];
                            nextCubieLoc = [this.loc[0], this.loc[1]-1];
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
                    if (JSON.stringify(this.cubies).indexOf(JSON.stringify([nextCubieCoords[0],nextCubieCoords[1]])) != -1){ continue checkDir;}
                    dirCheckBool = false;
                }
                catch (TypeError){/*Looks like this error does throw despite minor efforts to precheck cells */}
            };
            if (dirCheckBool){
                this.updateCubies(nextCubieLoc);
            } else if (GRAVITY == dir){ //This is the case we were falling and can't move any more
                updateScore(this);
                if (!autoSpawnBool && !this.hasTriggeredASpawn){
                    this.hasTriggeredASpawn = true;
                    spawnRandomPiece();
                }
                if (gameOfLifeBool){
                    gameOfLifeTrigger(this);
                }
            }
            //throw {name: "NotImplementedError", message: `pieceMovement in direction ${dir}`}; 
        }
    }

    function spawnPiece(color, type, loc, rot){
        let piece = new Piece(color, type, loc, rot);

        let canSpawn = true;
        spawnCheck: for (i in piece.cubies){
            try{
                let cubie = piece.cubies[i];
                if (document.getElementById(`Cell(${cubie[0]},${cubie[1]})`).style.backgroundColor != "") {canSpawn = false; break spawnCheck;}
            } catch (TypeError){}
        }
        if (!canSpawn) {
            console.log(`Couldn't spawn piece of shape ${type} at location ${loc}`); 
            return;
        } else {
            console.log(`Spawned piece`, piece);
            pieces.push(piece);
            piece.draw();
            updatePlots();
            return piece;
        }
    }

    function keyCodeDownController(event){
        //console.log(`Keyboard Press heard`, event);
        switch (event.code){
            case ('ArrowUp'):
            case ('KeyW'):
            case ('Numpad8'):
                event.preventDefault();
                pieces[pieces.length -1].move('8');
                break;
            case ('ArrowDown'):
            case ('KeyS'):
            case ('Numpad2'):
                event.preventDefault();
                pieces[pieces.length -1].move('2');
                break;
            case ('ArrowLeft'):
            case ('KeyA'):
            case ('Numpad4'):
                event.preventDefault();
                pieces[pieces.length -1].move('4');
                break;
            case ('ArrowRight'):
            case ('KeyD'):
            case ('Numpad6'):
                event.preventDefault();
                pieces[pieces.length -1].move('6');
                break;
            case ('Tab'):
                //TODO PauseTheGame
                event.preventDefault();
                break;
            case ('Space'):
                event.preventDefault();
                pieces[pieces.length -1].rotate(90);
                break;
            case ('ShiftLeft'):
            case ('ShiftRight'):
                event.preventDefault();
                setMovementTimer(math.round(3 * fallSpeedText.innerHTML));
                break;
            }
    };
    document.addEventListener('keydown', keyCodeDownController);

    function keyCodeUpController(event){
        switch (event.code){
            case ('ShiftLeft'):
            case ('ShiftRight'):
                event.preventDefault();
                setMovementTimer();
                break;
        }
    }
    document.addEventListener('keyup', keyCodeUpController);

    let gameOfLifeCheckbox = document.getElementById("gameOfLifeCheckbox");
    let gameOfLifeBool = gameOfLifeCheckbox.checked;
    gameOfLifeCheckbox.addEventListener('change', (event) => {
        gameOfLifeBool = gameOfLifeCheckbox.checked;
    });

    function gameOfLifeTrigger(piece){
        //TODO 
    }

    const drawRandom = () => {spawnRandomPiece()};

    function fallPieces(){
        pieces.forEach((piece) => piece.move(GRAVITY));
        updatePlots();
    }

    let bottom = [];
    let top = [];
    function updateGravity(dir){
        bottom = [];
        top = [];
        switch(GRAVITY){
            case '2':
                for (i = 0; i < NUMCOLS; i++){
                    bottom.push([i,NUMROWS-1]);
                    top.push([i,0]);
                }
                break;
            case '4':
                for (i = 0; i < NUMROWS; i++){
                    bottom.push([0,i]);
                    top.push([NUMCOLS -1, i]);
                }
                break;
            case '6':
                for (i = 0; i < NUMROWS; i++){
                    bottom.push([NUMCOLS -1, i]);
                    top.push([0,i]);
                }
                break;
            case '8':
                for (i = 0; i < NUMCOLS; i++){
                    bottom.push([i,0]);
                    top.push([i,NUMROWS-1]);
                }
                break;
        }
    }

    let scoreHist = [];
    let totalScore = 0;
    let totalScorebyColor = {};
    function updateScore(piece = null){
        let rowsToCheck = new Set();
        let colsToCheck = new Set();
        if (GRAVITY == '2' || GRAVITY == '8'){
            if (piece) {
                piece.cubies.forEach((cubie) => {
                    rowsToCheck.add(cubie[1]);
                });
            } else {
                for (let i = 0; i < NUMROWS; i++){
                    rowsToCheck.add(i);
                }
            }
            for (let i = 0; i < NUMCOLS; i++){
                colsToCheck.add(i);
            }

            let fullRowsCount = 0;
            let fullRows = {};
            for (let i of rowsToCheck){
                if (i < 0){continue;}
                let fullRow = true;
                let colorsCountDict = {};
                checkFullRow: for (let j of colsToCheck){
                    try{
                        let cellColor = document.getElementById(`Cell(${j},${i})`).style.backgroundColor;
                        if (cellColor  == ""){
                            fullRow = false;
                            break checkFullRow;
                        } else {
                            colorsCountDict[cellColor] = colorsCountDict[cellColor]? colorsCountDict[cellColor] +1 : 1;
                        }
                    } catch (TypeError){}
                }
                if (fullRow){
                    fullRowsCount++;
                    fullRows[i] = Object.assign({},colorsCountDict);
                }
            }
            if (fullRowsCount){
                scoreHist.push(Object.assign({},{count: fullRowsCount, scoringCubies: fullRows}));
                //Clear Out Scoring Rows
                Object.keys(fullRows).forEach((row) => {
                    pieces.forEach((piece) => {
                        let indicesToDelete = [];
                        for (i in piece.cubies){
                            let cubie = piece.cubies[i];
                            if (cubie[1] == row){
                                indicesToDelete.push(i);
                            };
                        }
                        piece.unDraw();
                        indicesToDelete.sort((a,b) => b-a);
                        for (index of indicesToDelete){piece.cubies.splice(index,1);}
                        piece.draw();
                        // if (indicesToDelete) {console.log(`Piece with Deleted Components: `, piece);}
                    });
                });
                console.log(`Score History has been updated with: `, scoreHist[scoreHist.length -1]);
            }
            //Tally 
            totalScorebyColor = {};
            totalScore = 0;
            scoreHist.forEach((moment) => {
                //console.log(moment);
                Object.keys(moment.scoringCubies).forEach((row) => {
                    Object.keys(moment.scoringCubies[row]).forEach((color) => {
                        totalScorebyColor[color] = totalScorebyColor[color]? totalScorebyColor[color] + moment.scoringCubies[row][color] : moment.scoringCubies[row][color]; 
                        totalScore += moment.scoringCubies[row][color];
                    });
                });
            });

        } else if (GRAVITY == '4' || GRAVITY == '6'){
            if (piece) {
                piece.cubies.forEach((cubie) => {
                    colsToCheck.add(cubie[1]);
                });
            } else {
                for (let i = 0; i < NUMCOLS; i++){
                    colsToCheck.add(i);
                }
            }
            for (let i = 0; i < NUMROWS; i++){
                rowsToCheck.add(i);
            }
        }
        document.getElementById('score').innerHTML = totalScore;
        document.getElementById('scoreByColor').innerHTML = "";
        Object.keys(totalScorebyColor).forEach((color) => {
            document.getElementById('scoreByColor').innerHTML += `<span style="color:${color}"> ${totalScorebyColor[color]} </span>`;
        });
    }

    function updatePlots(plots = null){ //TODO: generalize to specify exactly which plots to update
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
        Plotly.restyle('piecesByColorPlot', pbcTrace);

        let pbtTrace = {
            x: [Object.keys(getCounts(pieceTypes))],
            y: [Object.values(getCounts(pieceTypes))],
            type: 'bar'
        }
        Plotly.restyle('piecesByTypePlot', pbtTrace);

        let cbcTrace = {
            x: [Object.keys(getCounts(cubiesColors))],
            y: [Object.values(getCounts(cubiesColors))],
            type: 'bar'
        }
        Plotly.restyle('cubiesByColorPlot', cbcTrace);
        
        if (scoreHist.length){
            console.log('scoreHist', scoreHist);
            let scoreHistColorTraces = [];
            let scoreHistColorPartialSumsTraces = [];
            let xaxis = getIndexArray(scoreHist);
            for (color of tetColorPalette){
                let yaxisRowSums = [];
                let yaxisRowPartialSums = [];
                for (i of xaxis){
                    let rowsSum = 0;
                    for (scoringRow of Object.values(scoreHist[i].scoringCubies)){
                        //console.log(`ScoringRow is:`, scoringRow);
                        rowsSum += scoringRow[color] ? scoringRow[color] : 0;
                    }
                    //console.log(`rowsSum is ${rowsSum} for the color: ${color}`);
                    yaxisRowSums.push(rowsSum);
                    yaxisRowPartialSums.push(!yaxisRowPartialSums.length ?
                        rowsSum : yaxisRowPartialSums[yaxisRowPartialSums.length -1] + rowsSum);
                }
                scoreHistColorTraces.push({
                    x: xaxis,
                    y: yaxisRowSums,
                    name: `History ${color}`,
                    mode: 'lines',
                    line: {
                        color: color,
                        size: 12,
                    }
                });
                scoreHistColorPartialSumsTraces.push({
                    x: xaxis,
                    y: yaxisRowPartialSums,
                    name: `Total: ${color}`,
                    mode: 'lines',
                    line: {
                        color: color,
                        size: 12,
                    }
                });
            }
            console.log('scoreHistColorTraces', scoreHistColorTraces);
            //Plotly.restyle('historyByColorPlot', scoreHistColorTraces);
            console.log('scoreHistColorPartialSumsTraces', scoreHistColorPartialSumsTraces);
            Plotly.react('totalByColorPlot', scoreHistColorPartialSumsTraces,document.getElementById('totalByColorPlot').layout);

            let scoreHistRowCounts = scoreHist.map(elem => elem.count);
            console.log('scoreHistRowCounts', scoreHistRowCounts);
        }
    }

    const getIndexArray = (arr) => {return arr.map(elem => arr.indexOf(elem));}
    const plotConfig = {responsive: true};
    Plotly.newPlot('piecesByColorPlot', [{x: tetColorPalette, y: 0, type: 'bar'}],
        {title: 'Colors of Pieces',height: 300, automargin:true, xaxis: {title: "Color"}, yaxis: {title: "Count"}},
        plotConfig );
    Plotly.newPlot('piecesByTypePlot', [{x: Object.keys(TETS), y: 0, type: 'bar'}],
        {title: 'Pieces by Type',height: 300, automargin:true, xaxis: {title: "Type"}, yaxis: {title: "Count"}},
        plotConfig );
    Plotly.newPlot('cubiesByColorPlot', [{x: tetColorPalette, y: 0, type: 'bar'}],
        {title: 'Colors of Squares',height: 300, automargin:true, xaxis: {title: "Color"}, yaxis: {title: "Count"}},
        plotConfig );
        
    // TODO: Combine these plots
    Plotly.newPlot('historyByColorPlot', [{x: 0, y: 0, type: 'line'}],
        {title: 'History of Scoring Squares by Color',height: 300, automargin:true, xaxis: {title: "Scoring Moments"}, yaxis: {title: "Count"}},
        plotConfig );
    Plotly.newPlot('totalByColorPlot', [{x: 0, y: 0, type: 'line'}],
        {title: 'Total of Scoring Squares by Color',height: 300, automargin:true, xaxis: {title: "Scoring Moments"}, yaxis: {title: "Total"}},
        plotConfig );

    // TODO: Combine these plots
    Plotly.newPlot('historyOfScoringCubies', [{x: 0, y: 0, type: 'line'}],
        {title: 'History of Scoring Rows',height: 300, automargin:true, xaxis: {title: "Scoring Moments"}, yaxis: {title: "Count"}},
        plotConfig );
    Plotly.newPlot('totalScoringCubies', [{x: 0, y: 0, type: 'line'}],
        {title: 'Total Scoring Rows',height: 300, automargin:true, xaxis: {title: "Scoring Moments"}, yaxis: {title: "Total"}},
        plotConfig );
    //TODO Run Counts for largest path, largest rectangles, largest contiguous space
    updatePlots();

    let gameRunning = false;
    let initialStart = false;
    let startPauseButton = document.getElementById('start-button');
    startPauseButton.addEventListener('click',startPause);
    let spawnTimer = 0;
    let movementTimer = 0;
    function startPause(){
        if (!initialStart){
            initialStart = true;
            startPauseButton.innerHTML = "Pause";
            drawRandom();
        }
        if (!gameRunning){
            gameRunning = true;
            startPauseButton.innerHTML = "Pause";
            setSpawnTimer();
            setMovementTimer();
        } else{
            gameRunning = false;
            startPauseButton.innerHTML = "Resume";
            clearInterval(spawnTimer);
            clearInterval(movementTimer);
        }
    }
    let spawnRateSlider = document.getElementById("spawnRateSlider");
    let spawnRateText = document.getElementById("spawnRateText");
    spawnRateText.innerHTML = spawnRateSlider.value; // Display the default slider value

    spawnRateSlider.oninput = function() {
        spawnRateText.innerHTML = this.value;
        setSpawnTimer();
    };

    let pieceSpeedSlider = document.getElementById("pieceSpeedSlider");
    let fallSpeedText = document.getElementById("fallSpeedText");
    fallSpeedText.innerHTML = pieceSpeedSlider.value; // Display the default slider value

    pieceSpeedSlider.oninput = function() {
        fallSpeedText.innerHTML = this.value;
        setMovementTimer();
    };

    function setMovementTimer (value = fallSpeedText.innerHTML){
        if (gameRunning){
            clearInterval(movementTimer);
            movementTimer = setInterval(fallPieces,1000 - value * 0.01 * 1000);
        }
    }

    let autoSpawnCheckbox = document.getElementById("autoSpawnCheckbox");
    let autoSpawnBool = autoSpawnCheckbox.checked;
    autoSpawnCheckbox.addEventListener('change', (event) => {
        autoSpawnBool = autoSpawnCheckbox.checked;
        setSpawnTimer();
    });
    function setSpawnTimer (value = spawnRateText.innerHTML){
        console.log(`AutoSpawn is set to ${autoSpawnBool}`);
        if (gameRunning && autoSpawnBool){
            clearInterval(spawnTimer);
            spawnTimer = setInterval(drawRandom,5000 - value * 0.01 * 5000);
        } else {
            clearInterval(spawnTimer);
        }
    }
});