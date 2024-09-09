"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {});

  app.route("/api/solve").post((req, res) => {
    const puzzle = req.body.puzzle;
    if (!puzzle) return res.json({ error: "Required field missing" });
    if (puzzle.length !== 81) return res.json({ error: "Expected puzzle to be 81 characters long" });
    if (puzzle.match(/[^\d.]/g)) return res.json({ error: "Invalid characters in puzzle" });

    const solution = solver.solveSudoku(puzzle);
    if (!solver.solveSudoku(puzzle)) {
      return res.json({ error: 'Puzzle cannot be solved' })
    }
    return res.json({ solution });
  });
};
