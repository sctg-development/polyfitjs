/* eslint-disable @typescript-eslint/no-unused-vars */
// Copyright © 2023, P. Lutus and Ryan Fink. Released under the GPL https://www.gnu.org/licenses/gpl-3.0.en.html

/* ~ Deps ~ */

import 'should';
import {describe,it} from 'mocha';
import {Polyfit} from '../dist/index.js';

/* ~ Test data ~ */

const xd = [-1, 0, 1, 2, 3, 5, 7, 9];
const yd = [-1, 3, 2.5, 5, 4, 2, 5, 4];
const degree = 6;

describe('polyfit', function () {

  it('should throw an error if arrays not used', function (done) {
    try {
      const pf = new Polyfit();
    } catch (e) {
      done();
    }
  });

  it('should accept number Arrays', function (done) {
    const pf = new Polyfit([1, 0, 1], [2, 3, 4]);
    done();
  });

  it('should accept Float64Arrays', function (done) {
    const pf = new Polyfit(new Float64Array([1, 0, 1]), new Float64Array([2, 3, 4]));
    done();
  });

  it('should accept a Float32Arrays', function (done) {
    const pf = new Polyfit(new Float32Array([1, 0, 1]), new Float32Array([2, 3, 4]));
    done();
  });

  it('should throw an error if arrays not same length', function (done) {
    try {
      const pf = new Polyfit([1], [2, 3]);
    } catch (e) {
      done();
    }
  });

  it('should produce a correct equation', function (done) {
    const pf = new Polyfit(xd, yd);
    const eq = pf.getPolynomial(degree);
    eq(2).should.equal(4.08111112545548);
    eq(3).should.equal(4.502517353251342);
    // TODO: Add assertions
    done();
  });
  
  it('should produce a correct equation for Float32Arrays', function (done) {
    const pf = new Polyfit(new Float32Array(xd), new Float32Array(yd));
    const eq = pf.getPolynomial(degree);
    eq(2).should.equal(4.162711098790169);
    eq(3).should.equal(4.355647220509127);
    // TODO: Add assertions
    done();
  });
  
  it('should produce a correct equation for Float64Arrays', function (done) {
    const pf = new Polyfit(new Float64Array(xd), new Float64Array(yd));
    const eq = pf.getPolynomial(degree);
    eq(2).should.equal(4.08111112545548);
    eq(3).should.equal(4.502517353251342);
    // TODO: Add assertions
    done();
  });

  it('should produce a valid expression', function (done) {
    const pf = new Polyfit(xd, yd);
    const exp = pf.toExpression(degree);
    exp.should.equal('2.6937037085228717 + 0.9585108884477604x^1 + -1.150528829693737x^2 + 1.0886762123312619x^3 + -0.38856236522551396x^4 + 0.054575046507659646x^5 + -0.002598631007421001x^6');
    done();
  });

  it('should compute correlation coefficient correctly', function (done) {
    const pf = new Polyfit(xd, yd);
    const terms = pf.computeCoefficients(degree);
    pf.correlationCoefficient(terms).should.equal(0.9348988507857894);
    done();
  });

  it('should compute standard error correctly', function (done) {
    const pf = new Polyfit(xd, yd);
    const terms = pf.computeCoefficients(degree);
    pf.standardError(terms).should.equal(0.5434414879841104);
    done();
  });

  it('should be super fast', function (done) {
    const size = 1000000;
    const ArrayType = Array;
    const x = new ArrayType(size);
    const y = new ArrayType(size);
    for (let i = 0; i < size; i++) {
      x[i] = Math.random();
      y[i] = Math.random();
    }
    
    const start = process.hrtime();
    const pf = new Polyfit(x, y);
    pf.computeCoefficients(degree);
    const time = process.hrtime(start);
    
    done()
  });
  it('Should find the autofit the polynomial for a given set of data', function (done) {
    const pf = new Polyfit(xd, yd);
    const terms = pf.computeBestFit(100);
    terms.should.eql([
      2.6937037085228717,
      0.9585108884477604,
      -1.150528829693737,
      1.0886762123312619,
      -0.38856236522551396,
      0.054575046507659646,
      -0.002598631007421001
    ]);
    done();
  });
  it('Should find the autofit the polynomial for a given set of data and a specified correlation', function (done) {
    const pf = new Polyfit(xd, yd);
    const terms = pf.computeBestFit(100,0.99);
    terms.should.eql([
      2.999999997712511,
      -2.9424974926425946,
      0.5993530802528433,
      3.986915075693,
      -2.7724660881265044,
      0.7025214902871045,
      -0.0768869869287576,
      0.003060929212042978,
    ]);
    done();
  });

});
