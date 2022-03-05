                //DEPRECATED FALL HAS BEEN REPLACED WITH MOVE DIR
            // fall: () => {
            //     let freeToFallCheck = true;
            //     freefallcheck: for (i in piece.cubies) {
            //         let cubie = piece.cubies[i];
            //         if (cubie[1]>= NUMROWS -1){freeToFallCheck = false;}
            //         try {
            //             let downCell = document.getElementById(`Cell(${cubie[0]},${cubie[1]+1})`);
            //             if (downCell.style.backgroundColor == "") {continue freefallcheck;}
            //             if (JSON.stringify(piece.cubies).indexOf(JSON.stringify([cubie[0],cubie[1]+1])) != -1){ continue freefallcheck;}
                        
            //             // console.log(`FreeFall Failed,\n downcell bgC = ${downCell.style.backgroundColor},\n downcell in piece? ${!piece.cubies.includes([cubie[0],cubie[1]+1])}`);
            //             freeToFallCheck = false;
            //         } catch (TypeError){}
            //     };

            //     if (freeToFallCheck){ //console.log(`Piece at loc ${piece.loc} is Falling!`);
            //         unDraw(piece);
            //         piece.updateCubies([piece.loc[0], piece.loc[1]+1])
            //         draw(piece);
            //     } else {
            //         //console.log(`Piece at loc ${piece.loc} cannot fall`);
            //         gameOfLifeTrigger(piece);
            //     }
            // },
    
    
    // DEPRECATED FUNCTION FOR INDIVIDUAL FALLING CUBIES
    // function fallCubies(){
    //     console.log("Falling!");
    //     for (i = NUMROWS-2; i >= 0; i--){
    //         for (j = 0; j < NUMCOLS; j++){
    //             let gridSquare = document.getElementById(`Cell(${j},${i})`);
    //             let cellDown = document.getElementById(`Cell(${j},${i + 1})`);
    //             if (cellDown.style.backgroundColor == ""){
    //                 cellDown.style.backgroundColor = gridSquare.style.backgroundColor;
    //                 gridSquare.style.backgroundColor = "";
    //             } else {
    //                 //console.log(gridSquare.style.backgroundColor);
    //             }
    //         }
    //     }
    // }