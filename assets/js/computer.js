import Board from "./board.js";

export default class ComputerBoard extends Board{
    constructor(){
        super();
        this.playerShips = [5, 4, 3, 3, 2];
        this.playerGrid = this.populatePlayerGrid();
        this.playerRemaining = 17;
    }

    populatePlayerGrid(){
        // make a grid for the player grid
        const grid = [];

        // Initialize empty board of same size as computer's board
        // all null since currently don't know anything about player's board
        for (let i = 0; i < this.numRows; i++) {
            grid.push(Array(this.numCols).fill(null));
        }

        return grid;
    }

    // generate a move to do on player's board
    generateMove(){
        // get a random row and column between 0 and numRows-1/numCols-1
        let row = Math.floor(Math.random() * this.numRows);
        let col = Math.floor(Math.random() * this.numCols);

        // need to check if that space has already been done, if it has keep generating random ones until its not
        while(this.playerGrid[row][col] !== null){
            row = Math.floor(Math.random() * this.numRows);
            col = Math.floor(Math.random() * this.numCols);
        }

        // put the generated move in a string and return it
        return `${row}-${col}`;
    }

    // mark in the player board that it was a hit & decrease the number of hits left on player
    hitPlayer(row, col){
        this.playerGrid[row][col] = 'hit';
        this.playerRemaining--;
        console.log(this.playerRemaining);
    }

    // mark in the player board that it was a miss
    missPlayer(row, col){
        this.playerGrid[row][col] = 'miss';
    }

    // determine if computer has won
    computerWins(){
        return this.playerRemaining === 0;
    }
}
