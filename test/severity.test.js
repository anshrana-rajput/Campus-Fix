const test = require('node:test');
const assert = require('node:assert/strict');
const { classifyProblemSeverity } = require('../src/severity');

test('classifies high severity for safety-critical issues', () => {
  assert.equal(classifyProblemSeverity('There is smoke and fire in lab 2'), 'high');
});

test('classifies medium severity for broken campus infrastructure', () => {
  assert.equal(classifyProblemSeverity('Broken seat in lecture hall'), 'medium');
  assert.equal(classifyProblemSeverity('AC not working in class 3A'), 'medium');
});

test('classifies low severity for non-urgent requests or empty input', () => {
  assert.equal(classifyProblemSeverity('Need wall repaint in corridor'), 'low');
  assert.equal(classifyProblemSeverity(''), 'low');
});
