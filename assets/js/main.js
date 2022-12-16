import Board from "./board.js";
import ComputerBoard from './computer.js';

// set up some global variables
let playerBoard, computerBoard, playerUl, computerUl;

// once all html has been loaded set up the game
window.addEventListener('DOMContentLoaded', event => {
    startGame();

    // get the reset game button & add a listener
    const resetButton = document.getElementById('reset-button');
    resetButton.addEventListener('click', resetGame);
});

function startGame(){
    playerBoard = new Board(); // creates a new game board for player
    computerBoard = new ComputerBoard(); // creates a new game board for computer player

    // print the two boards to the console for debugging purposes if needed
    // console.log('player');
    // console.log(playerBoard.grid);
    // console.log('computer');
    // console.log(computerBoard.grid);

    // build & instert the ul elements for the two players
    playerUl = buildBoard(playerBoard, 'player');
    computerUl = buildBoard(computerBoard, 'computer');

    // attach a click listener to the computer board
    computerUl.addEventListener('click', handleBoardClick);
}

function resetGame(){
    // remove the playerUl and computerUl and then call start game to set it up again
    playerUl.remove();
    computerUl.remove();

    // if a winner div exists remove it
    const winnerDiv = document.querySelector('.winner-div');
    if(winnerDiv){
        winnerDiv.remove();
    }

    // call start game to set up and start a new game
    startGame();
}

function buildBoard(board, player){
    const rows = board.numRows;
    const cols = board.numCols;

    // make an unordered list to hold the cells
    const outer = document.createElement('ul');
    outer.setAttribute('class', 'game-board');
    outer.setAttribute('id', `${player}-board`);

    // go through the rows and columns and create a li element for each grid entry
    // put the row/column info in the id and the value at that spot in the data
    // set a class for all li so that all can be styled the same
    for(let i = 0; i < rows; i++){
        for(let j = 0; j < cols; j++){
            const inner = document.createElement('li');
            inner.setAttribute('class', 'board-space');
            inner.setAttribute('data-space-val', `${board.grid[i][j]}`);

            // if it's the computer's board add a hover class so we can indicate interactivity
            // and set id to c-row-col
            if(player === 'computer'){
                inner.classList.add('hover');
                inner.setAttribute('id', `c-${i}-${j}`);
            }
            // otherwise set id to p-row-col
            else{
                inner.setAttribute('id', `p-${i}-${j}`);
            }

            // put the created li in the ul
            outer.append(inner);
        }
    }

    // put the ul in the correct div
    const div = document.querySelector(`.${player}-board`);
    div.append(outer);

    // return a reference to the board ul element
    return outer;
}

function handleBoardClick(event){
    // get the event target and the id string from it
    const target = event.target;
    const clickLocation = target.id;

    // if the click location was an li (not the board itself)
    // and if the sepcified li is still interactable (has class hover)
    if(clickLocation !== 'computer-board' && target.classList.contains('hover')){
        // get the spaceVal from the dataset
        const value = target.dataset.spaceVal;

        // once things are clicked they will transition to either splash/explosion and the hover should be removed
        target.classList.remove('hover');

        // if the spaceVal is not null, then this is a hit
        if(value !== 'null'){
            // split the id string at the - to get the row and column, then tell the board to make a hit
            // the id will have a leading character b/c css id's shouldn't start with a number but we don't need it in this step
            const [player, row, col] = clickLocation.split('-');
            computerBoard.makeHit(row, col);

            // add the explosion class
            target.classList.add('explosion');
        }

        // otherwise it's a miss
        else{
            target.classList.add('splash');
        }

        // once a move has been made we need to check if the player has won
        // if they have call the win condition method
        if(computerBoard.isGameOver()){
            playerWins('player');
        }

        // otherwise tell the computer to take its turn
        else{
            computerTurn();
        }
    }
}

function computerTurn(){
    // have the computer make a move and return the string (should match an id on the player's board)
    const move = "p-" + computerBoard.generateMove();

    // get the li with the matching id and then get it's value
    const moveLi = document.querySelector(`#${move}`);
    const value = moveLi.dataset.spaceVal;

    // split the move string at the - to get the row and column
    // the id will have a leading character b/c css id's shouldn't start with a number but we don't need it in this step
    const [player, row, col] = move.split('-');

    // if the value is null tell the computer it missed and update the li's class
    if(value === 'null'){
        computerBoard.missPlayer(row, col);
        moveLi.classList.add('splash');
    }

    // otherwise tell the computer it hit and update the li's class
    else{
        computerBoard.hitPlayer(row, col);
        moveLi.classList.add('explosion');

        // if it's a hit we need to check if the computer has won
        if(computerBoard.computerWins()){
            playerWins('computer');
        }
    }
}

function playerWins(winner){
    // remove the event listener from the computerUl
    computerUl.removeEventListener('click', handleBoardClick);

    // call function to remove all hover li hovers
    removeAllHovers();

    // console.log(winner);

    // get the div based on the winner
    let div;
    if(winner === 'player'){
        div = document.querySelector('.computer-board');
    }
    else{
        div = document.querySelector('.player-board');
    }

    // make a div to hold the win messages
    const newDiv = document.createElement('div');
    newDiv.setAttribute('class', 'winner-div');

    // make an h3 to go in the div and set text based on winner
    const h3 = document.createElement('h3');
    if(winner === 'player'){
        h3.innerText = 'You Win!';
    }
    else{
        h3.innerText = 'Computer Wins!';
    }

    // make a p to go in the div and set text
    const p = document.createElement('p');
    p.innerText = `Please click 'reset game' to play again`;

    // put the h3 & p in the div
    newDiv.append(h3);
    newDiv.append(p);

    // put the newDiv in the computerDiv
    div.append(newDiv);
}

function removeAllHovers(){
    // get an array of all of the li elements on the page
    const liArray = document.querySelectorAll('li');

    for(let i = 0; i < liArray.length; i++){
        const li = liArray[i];
        if(li.classList.contains('hover')){
            li.classList.remove('hover');
        }
    }
}
