"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {
    const { puzzle, coordinate, value } = req.body;
    
    if (!puzzle || !coordinate || !value) 
      return res.json({ error: "Required field(s) missing" });
    
    // get coordinate
    const row = coordinate.charAt(0);
    const col = coordinate.charAt(1);
    // console.log(coordinate.split("")[0], coordinate.split("")[1]);
    console.log(row, col);
    // validate coordinate
    if (/[^A-I]/.test(row) || /[^1-9]/.test(col)) {
      return res.json({ error: "Invalid coordinate" });
    }
    // validate value
    if (/[^1-9]/.test(value) || value.length !== 1) {
      return res.json({ error: "Invalid value" });
    }

    if (puzzle.length != 81)
      return res.json({ error: "Expected puzzle to be 81 characters long" });
    if (puzzle.match(/[^\d.]/g)) 
      return res.json({ error: "Invalid characters in puzzle" });

    // Check the value is already in the coordinate of the puzzle.
    let index = (solver.letterToNumber(row) - 1) * 9 + (+col - 1);
    if (puzzle[index] === value) return res.json({ valid: true });
    console.log(puzzle[index], value);

    // Check if the value violates the row, column and region rules of sudoku.
    const validRowPlace = solver.checkRowPlacement(puzzle, row, col, value);
    const validColPlace = solver.checkColPlacement(puzzle, row, col, value);
    const validRegion = solver.checkRegionPlacement(puzzle, row, col, value);
    console.log(validRowPlace);
    console.log(validColPlace);
    console.log(validRegion);
    if (validRowPlace && validColPlace && validRegion) {
      res.json({ 'valid': true });
    } else {
      // Check for conflicts
      let conflicts = [];
      if (!validRowPlace) conflicts.push('row');
      if (!validColPlace) conflicts.push('column');
      if (!validRegion) conflicts.push('region');
      console.log(conflicts);
      return res.json({ valid: false, conflict: conflicts});
    }
  });

  app.route("/api/solve").post((req, res) => {
    const puzzle = req.body.puzzle;
    const validation = solver.validate(puzzle);
    if (validation !== "valid") {
      return res.json({ error: validation });
    }

    const solution = solver.solveSudoku(puzzle);
    if (!solution) {
      return res.json({ error: "Puzzle cannot be solved" });
    }
    return res.json({ solution });
  });
};
