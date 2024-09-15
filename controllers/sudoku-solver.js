class SudokuSolver {
  validate(puzzleString) {
    if (!puzzleString) return "Required field missing";
    if (puzzleString.length !== 81)
      return "Expected puzzle to be 81 characters long";
    if (puzzleString.match(/[^\d.]/g)) return "Invalid characters in puzzle";
    return "valid";
  }

  letterToNumber(row) {
    switch (row.toUpperCase()) {
      case "A":
        return 1;
      case "B":
        return 2;
      case "C":
        return 3;
      case "D":
        return 4;
      case "E":
        return 5;
      case "F":
        return 6;
      case "G":
        return 7;
      case "H":
        return 8;
      case "I":
        return 9;
      default:
        return "none";
    }
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const board = this.stringToBoardArray(puzzleString);
    row = this.letterToNumber(row);
    // Check if value is already in the row
    for (let col = 0; col < 9; col++) {
      if (board[row - 1][col] == value) {
        return false;
      }
    }
    // Value can be placed in the row
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    const board = this.stringToBoardArray(puzzleString);
    row = this.letterToNumber(row);
    // Check if the value is already in the column
    for (let r = 0; r < 9; r++) {
      if (board[r][column - 1] == value) {
        return false;
      }
    }
    // Value can be placed in the column
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const board = this.stringToBoardArray(puzzleString);
    row = this.letterToNumber(row);
    // Find the starting row and column of the 3x3 region
    let startRow = Math.floor(row / 3) * 3;
    let startCol = Math.floor(column / 3) * 3;

    // Check if the value already exists in the 3x3 region
    for (let r = startRow; r < startRow + 3; r++) {
      for (let c = startCol; c < startCol + 3; c++) {
        // console.log(board[r][c]);
        if (board[r][c] == value) {
          return false;
        }
      }
    }
    // Value can be placed in the region
    return true;
  }

  stringToBoardArray(puzzleString) {
    // Convert board string into a 2D array
    let board = [];
    for (let i = 0; i < 9; i++) {
      board.push(
        puzzleString
          .slice(i * 9, (i + 1) * 9)
          .split("")
          .map((c) => (c === "." ? 0 : parseInt(c)))
      );
    }
    return board;
  }

  solveSudoku(puzzleString) {
    const board = this.stringToBoardArray(puzzleString);

    // Check if a number can be placed at board[row][col]
    function isValid(board, row, col, num) {
      for (let i = 0; i < 9; i++) {
        if (
          board[row][i] === num ||
          board[i][col] === num ||
          board[3 * Math.floor(row / 3) + Math.floor(i / 3)][
            3 * Math.floor(col / 3) + (i % 3)
          ] === num
        ) {
          return false;
        }
      }
      return true;
    }

    // Backtracking function to solve the Sudoku
    function solve() {
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (board[row][col] === 0) {
            for (let num = 1; num <= 9; num++) {
              if (isValid(board, row, col, num)) {
                board[row][col] = num;
                if (solve()) {
                  return true;
                }
                board[row][col] = 0; // Undo assignment
              }
            }
            return false; // Trigger backtracking
          }
        }
      }
      return true; // All cells filled correctly
    }

    if (!solve()) {
      return false; // Unsolvable
    }

    // Convert 2D array back to string format
    return board.flat().join("");
  }
}

module.exports = SudokuSolver;
