const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");
const testPuzzleStrings =
  require("../controllers/puzzle-strings").puzzlesAndSolutions;

chai.use(chaiHttp);

suite("Functional Tests", () => {
  suite("POST /api/solve tests", () => {
    test("Solve a puzzle with valid puzzle string", (done) => {
      chai
        .request(server)
        .keepOpen()
        .post("/api/solve")
        .send({ puzzle: testPuzzleStrings[1][0] })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.solution, testPuzzleStrings[1][1]);
          done();
        });
    });
    test('Solve a puzzle with missing puzzle string', (done) => {
      chai
        .request(server)
        .keepOpen()
        .post('/api/solve')
        .send({})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Required field missing');
          done();
        });
    });
    test('Solve a puzzle with invalid characters', (done) => {
      chai
        .request(server)
        .keepOpen()
        .post('/api/solve')
        .send({ puzzle: testPuzzleStrings[5][0]})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Invalid characters in puzzle');
          done();
        });
    });
    test('Solve a puzzle with incorrect length', (done) => {
      chai
        .request(server)
        .keepOpen()
        .post('/api/solve')
        .send({ puzzle: testPuzzleStrings[6][0]})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
          done();
        });
    });
    test('Solve a puzzle that cannot be solved', (done) => {
      chai
        .request(server)
        .keepOpen()
        .post('/api/solve')
        .send({ puzzle: testPuzzleStrings[4][0]})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Puzzle cannot be solved');
          done();
        });
    });
  });
  suite('POST /api/check tests', () => {
    test('Check a puzzle placement with all fields', (done) => {
      chai
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({
          puzzle: testPuzzleStrings[0][0],
          coordinate: 'a8',
          value: '8'
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isTrue(res.body.valid);
          done();
        });
    });
    test('Check a puzzle placement with single placement conflict', (done) => {
      chai
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({
          puzzle: testPuzzleStrings[0][0],
          coordinate: 'a2',
          value: '7'
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isFalse(res.body.valid);
          assert.deepEqual(res.body.conflict, ['column']);
          done();
        });
    });
    test('Check a puzzle placement with multiple placement conflicts', (done) => {
      chai
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({
          puzzle: testPuzzleStrings[0][0],
          coordinate: 'b5',
          value: '5'
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isFalse(res.body.valid);
          assert.deepEqual(res.body.conflict, [ 'column', 'region' ]);
          done();
        });
    });
    test('Check a puzzle placement with all placement conflicts', (done) => {
      chai
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({
          puzzle: testPuzzleStrings[0][0],
          coordinate: 'b5',
          value: '2'
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isFalse(res.body.valid);
          assert.deepEqual(res.body.conflict, [ 'row', 'column', 'region' ]);
          done();
        });
    });
    test('Check a puzzle placement with missing required fields', (done) => {
      chai
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({
          puzzle: testPuzzleStrings[0][0],
          value: 8
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Required field(s) missing');
          done();
        });
    });
    test('Check a puzzle placement with invalid characters', (done) => {
      chai
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({
          puzzle: testPuzzleStrings[5][0],
          coordinate: 'A4',
          value: '6'
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Invalid characters in puzzle');
          done();
        });
    });
    test('Check a puzzle placement with incorrect length', (done) => {
      chai
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({
          puzzle: testPuzzleStrings[6][0],
          coordinate: 'b3',
          value: '9'
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
          done();
        });
    });
    test('Check a puzzle placement with invalid placement coordinate', (done) => {
      chai
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({
          puzzle: testPuzzleStrings[0][0],
          coordinate: '44',
          value: '9'
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Invalid coordinate');
          done();
        });
    });
    test('Check a puzzle placement with invalid placement value', (done) => {
      chai
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({
          puzzle: testPuzzleStrings[0][0],
          coordinate: 'e3',
          value: '33'
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'Invalid value');
          done();
        });
    });
  });
});
