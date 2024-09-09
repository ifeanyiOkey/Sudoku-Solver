class SudokuSolver {
  validate(puzzleString) {}

  checkRowPlacement(puzzleString, row, column, value) {}

  checkColPlacement(puzzleString, row, column, value) {}

  checkRegionPlacement(puzzleString, row, column, value) {}

  solveSudoku(puzzleString) {
    const N = 9;

    // Convert board string to a 2D array
    const board = puzzleString
      .split("")
      .map((c) => (c === "." ? 0 : parseInt(c)));
    const grid = [];
    for (let i = 0; i < N; i++) {
      grid.push(board.slice(i * N, i * N + N));
    }

    const findEmpty = () => {
      for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
          if (grid[i][j] === 0) {
            return [i, j];
          }
        }
      }
      return null;
    };

    const isValid = (num, row, col) => {
      // Check row
      for (let i = 0; i < N; i++) {
        if (grid[row][i] === num) {
          return false;
        }
      }

      // Check column
      for (let i = 0; i < N; i++) {
        if (grid[i][col] === num) {
          return false;
        }
      }

      // Check 3x3 grid
      const startRow = Math.floor(row / 3) * 3;
      const startCol = Math.floor(col / 3) * 3;

      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (grid[startRow + i][startCol + j] === num) {
            return false;
          }
        }
      }

      return true;
    };

    const solve = () => {
      const emptySpot = findEmpty();
      if (!emptySpot) {
        return true; // Puzzle solved
      }

      const [row, col] = emptySpot;

      for (let num = 1; num <= N; num++) {
        if (isValid(num, row, col)) {
          grid[row][col] = num;

          if (solve()) {
            return true;
          }

          grid[row][col] = 0; // Reset and backtrack
        }
      }

      return false; // Trigger backtracking
    };

    solve();
    // Convert solved 2D array back to board string
    return grid.flat().join("");
  }

  // Example usage
  // const boardString = "1.5..2.84..63.12.7.2..5.....9..1....8..2...6..3..9..4...8.3.7..4...7..6.5...2.";
  // const solvedBoard = solveSudoku(boardString);

  // console.log(solvedBoard);
}

module.exports = SudokuSolver;
