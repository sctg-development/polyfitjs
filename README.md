# @sctg/polyfitjs

[![Build](https://github.com/sctg-development/polyfitjs/actions/workflows/build_publish.yaml/badge.svg)](https://github.com/sctg-development/polyfitjs/actions/workflows/build_publish.yaml)
[![npm version](https://badge.fury.io/js/@sctg%2Fpolyfitjs.svg)](https://badge.fury.io/js/@sctg%2Fpolyfitjs)

A TypeScript library for polynomial fitting.

## Star the project

**If you appreciate my work, please consider giving it a star! 🤩**

## Features

- Polynomial fitting up to n degrees
- Support for `Array`, `Float32Array` and `Float64Array`
- Correlation coefficient calculation
- Standard error calculation
- Polynomial expression generation

## Installation

```bash
npm install @sctg/polyfitjs
```

## Usage

### Creating a polynomial function

```typescript
import { Polyfit } from '@sctg/polyfitjs';

const x = [1, 2, 3, 4, 5];
const y = [0.01, 0.03, -0.02, 0.03, 0.02];
const poly = new Polyfit(x, y);
const solver = poly.getPolynomial(6);

// Using the solver
console.log(solver(1.17)); // Calculates y for x = 1.17
```

### Getting coefficients

```typescript
const terms = poly.computeCoefficients(6);
console.log(terms); // Shows polynomial coefficients
```

### Finding the best fit for a given correlation coefficient

```typescript
const terms = poly.computeBestFit(100,0.99); // Max degree, min correlation coefficient
console.log(terms); // Shows polynomial coefficients
```

### Computing statistical metrics

```typescript
const terms = poly.computeCoefficients(6);
const correlation = poly.correlationCoefficient(terms);
const stdError = poly.standardError(terms);
```

## Building

To build the project, run the following command:

```bash
  git clone git@github.com:sctg-development/polyfitjs.git
  cd polyfitjs
  npm ci
  npm run build
  npm test
```

## License

Copyright © 2023, P. Lutus and Ryan Fink.  
Modifications © 2025, SCTG Development.
Released under GPL v3 - [Details](https://www.gnu.org/licenses/gpl-3.0.en.html)

## Acknowledgments

Heavily inspired by Paul Lutus's work (<lutusp@arachnoid.com>) - [polysolve](http://www.arachnoid.com/polysolve)
