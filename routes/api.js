"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {
    const { puzzle, coordinate, value } = req.body;
    if (solver.validate(puzzle) !== "valid") {
      res.json({ error: solver.validate(puzzle) });
      return;
    }
    if (!puzzle || !coordinate || !value) {
      res.json({ error: "Required field(s) missing" });
      return;
    }
    // get coordinate
    const row = coordinate.charAt(0);
    const col = coordinate.charAt(1);
    // console.log(coordinate.split("")[0], coordinate.split("")[1]);
    console.log(row, col);
    if (coordinate.length !== 2 || /[^A-I]/.test(row) || /[^1-9]/.test(col)) {
      res.json({ error: "Invalid coordinate" });
      return;
    }
    if (/[^1-9]/.test(value) || value.length !== 1) {
      return res.json({ error: "Invalid value" });
    }

    // // Check the value is already in the coordinate of the puzzle.
    // let index = (solver.letterToNumber(row) - 1) * 9 + (+col - 1);
    // if (puzzle[index] === value) return res.json({ valid: true });
    // console.log(puzzle[index], value);

    // // Check if the value violates the row, column and region rules of sudoku.
    // const validRowPlace = solver.checkRowPlacement(puzzle, row, col, value);
    // const validColPlace = solver.checkColPlacement(puzzle, row, col, value);
    // const validRegion = solver.checkRegionPlacement(puzzle, row, col, value);
    // if (validRowPlace && validColPlace && validRegion) {
    //   res.json({ 'valid': true });
    // } else {
    //   // Check for conflicts
    //   let conflicts = [];
    //   if (!validRowPlace) conflicts.push('row');
    //   if (!validColPlace) conflicts.push('column');
    //   if (!validRegion) conflicts.push('region');
    //   console.log(conflicts);
    //   return res.json({ valid: false, conflict: conflicts});
    // }
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
