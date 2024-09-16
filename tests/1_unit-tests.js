const chai = require("chai");
const assert = chai.assert;

const Solver = require("../controllers/sudoku-solver.js");
let solver = new Solver();
const { puzzlesAndSolutions } = require('../controllers/puzzle-strings.js');

suite("Unit Tests", () => {
  const validPuzzleString = puzzlesAndSolutions[1][0];
  const invalidPuzzleString = '8910724342687519197254386.85479231219538467734162895926345179273891652851726943'
  const solvedPuzzle = puzzlesAndSolutions[1][1];

  test("valid puzzle string of 81 characters", () => {
    assert.equal(solver.validate(validPuzzleString), 'valid');
  });
  test('puzzle string with invalid characters (not 1-9 or .)', () => {
    const puzzleString = puzzlesAndSolutions[5][0];
    assert.isNotTrue(solver.validate(puzzleString) === 'valid');
  });
  test('puzzle string that is not 81 characters in length', () => {
    const puzzleString = '.7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6.';
    assert.notStrictEqual(solver.validate(puzzleString), 'valid');
  });
  test('valid row placement', () => {
    assert.isTrue(solver.checkRowPlacement(validPuzzleString, 'a', '2', '6'));
  });
  test(' invalid row placement', () => {
    assert.isFalse(solver.checkRowPlacement(validPuzzleString, 'a', '2', '5'));
  });
  test('valid column placement', () => {
    assert.isTrue(solver.checkColPlacement(validPuzzleString, 'a', '2', '3'));
  });
  test('invalid column placement', () => {
    assert.isFalse(solver.checkColPlacement(validPuzzleString, 'b', '2', '9'));
  });
  test('valid region (3x3 grid) placement', () => {
    assert.isTrue(solver.checkRegionPlacement(validPuzzleString, 'b', '2', '4'));
  });
  test('invalid region (3x3 grid) placement', () => {
    assert.isFalse(solver.checkRegionPlacement(validPuzzleString, 'e', '6', '4'));
  });
  test('Valid puzzle strings pass the solver', () => {
    assert.equal(solver.solveSudoku(validPuzzleString), solvedPuzzle);
  });
  test('Invalid puzzle strings fail the solver', () => {
    assert.isFalse(solver.solveSudoku(invalidPuzzleString));
  });
  test(' returns the expected solution for an incomplete puzzle', () => {
    assert.equal(solver.solveSudoku(validPuzzleString), solvedPuzzle);
  })
});
