'use strict';

// Copyright © 2023, P. Lutus and Ryan Fink. Released under the GPL https://www.gnu.org/licenses/gpl-3.0.en.html
// Modification © 2025 Ronan Le Meillat for a working version with TypeScript

/**
* Polyfit
* @class
*/

export interface NumberArrayConstructor {
    new (length: number): NumberArray;
    new (buffer: ArrayBuffer, byteOffset?: number, length?: number): NumberArray;
    
    BYTES_PER_ELEMENT?: number;
}

export interface NumberArray {
    length: number;
    [index: number]: number;
}

/**
 * Polyfit polynomial fitment solver
 * note x and y must be arrays of the same type
 * @constructor
 * @param {number[]|Float32Array|Float64Array} x - x values
 * @param {number[]|Float32Array|Float64Array} y - y values
 * @returns {Polyfit}
 */
export class Polyfit {
    private x: NumberArray;
    private y: NumberArray;
    private FloatXArray: Float32ArrayConstructor|Float64ArrayConstructor;

    /**
     * Polyfit
     * @constructor
     * @param {number[]|Float32Array|Float64Array} x
     * @param {number[]|Float32Array|Float64Array} y
     */
    constructor(
        x : NumberArray,
        y : NumberArray
    ) {

        // Make sure we return an instance
        if (!(this instanceof Polyfit)) {
            return new Polyfit(x, y);
        }

        // Check that x any y are both arrays of the same type
        if (!((x instanceof Array && y instanceof Array) ||
             (x instanceof Float32Array && y instanceof Float32Array) ||
             (x instanceof Float64Array && y instanceof Float64Array) )
        ) {
            throw new Error('x and y must be arrays');
        }

        if (x instanceof Float32Array) {
            this.FloatXArray = Float32Array;
        } else if (x instanceof Float64Array) {
            this.FloatXArray = Float64Array;
        }

        // Make sure we have equal lengths
        if (x.length !== y.length) {
            throw new Error('x and y must have the same length');
        }

        this.x = x;
        this.y = y;

    }

    /**
     * Perform gauss-jordan division
     * 
     * @param {number[][]|Float32Array[]|Float64Array[]} matrix - gets modified
     * @param {number} row
     * @param {number} col
     * @param {number} numCols
     * @returns void
     */
    static gaussJordanDivide(
        matrix  : NumberArray[],
        row     : number,
        col     : number,
        numCols : number
    ): void {

        for (let i = col + 1; i < numCols; i++) {
            matrix[row][i] /= matrix[row][col];
        }

        matrix[row][col] = 1;

    }

    /**
     * Perform gauss-jordan elimination
     * 
     * @param {number[][]|Float64Array[]} matrix - gets modified
     * @param {number} row
     * @param {number} col
     * @param {number} numRows
     * @param {number} numCols
     * @returns void
     */
    static gaussJordanEliminate(
        matrix  : NumberArray[],
        row     : number,
        col     : number,
        numRows : number,
        numCols : number
    ): void {

        for (let i = 0; i < numRows; i++) {
            if (i !== row && matrix[i][col] !== 0) {
                for (let j = col + 1; j < numCols; j++) {
                    matrix[i][j] -= matrix[i][col] * matrix[row][j];
                }
                matrix[i][col] = 0;
            }
        }

    }

    /**
     * Perform gauss-jordan echelon method
     * 
     * @param {number[][]|Float32Array[]|Float64Array[]} matrix - gets modified
     * @returns {number[][]|Float32Array[]|Float64Array[]} matrix
     */
    static gaussJordanEchelonize(
        matrix: NumberArray[]
    ): NumberArray[] {

        const rows = matrix.length;
        const cols = matrix[0].length;
        let i = 0;
        let j = 0;
        let k: number;
        let swap: NumberArray;

        while (i < rows && j < cols) {
            k = i;
            // Look for non-zero entries in col j at or below row i
            while (k < rows && matrix[k][j] === 0) {
                k++;
            }
            // If an entry is found at row k
            if (k < rows) {
                // If k is not i, then swap row i with row k
                if (k !== i) {
                    swap = matrix[i];
                    matrix[i] = matrix[k];
                    matrix[k] = swap;
                }
                // If matrix[i][j] is != 1, divide row i by matrix[i][j]
                if (matrix[i][j] !== 1) {
                    Polyfit.gaussJordanDivide(matrix, i, j, cols);
                }
                // Eliminate all other non-zero entries
                Polyfit.gaussJordanEliminate(matrix, i, j, rows, cols);
                i++;
            }
            j++;
        }

        return matrix;

    }

    /**
     * Perform regression
     * 
     * @param {number} x
     * @param {number[]|Float32Array[]|Float64Array[]} terms
     * @returns {number}
     */
    static regress(
        x     : number,
        terms : NumberArray
    ): number {

        let a = 0;
        let exp = 0;

        for (let i = 0, len = terms.length; i < len; i++) {
            a += terms[i] * Math.pow(x, exp++);
        }

        return a;

    }

    /**
     * Compute correlation coefficient
     * 
     * @param {number[]|Float32Array[]|Float64Array[]} terms
     * @returns {number}
     */
    public correlationCoefficient(
        terms : NumberArray
    ): number {

        let r = 0;
        const n = this.x.length;
        let sx = 0;
        let sx2 = 0;
        let sy = 0;
        let sy2 = 0;
        let sxy = 0;
        let x: number;
        let y: number;

        for (let i = 0; i < n; i++) {
            x = Polyfit.regress(this.x[i], terms);
            y = this.y[i];
            sx += x;
            sy += y;
            sxy += x * y;
            sx2 += x * x;
            sy2 += y * y;
        }

        const div = Math.sqrt((sx2 - (sx * sx) / n) * (sy2 - (sy * sy) / n));

        if (div !== 0) {
            r = Math.pow((sxy - (sx * sy) / n) / div, 2);
        }

        return r;

    }

    /**
     * Run standard error function
     * 
     * @param {number[]|Float32Array[]|Float64Array[]} terms
     * @returns number
     */
    public standardError(
        terms : NumberArray
    ): number {

        let r = 0;
        const n = this.x.length;

        if (n > 2) {
            let a = 0;
            for (let i = 0; i < n; i++) {
                a += Math.pow((Polyfit.regress(this.x[i], terms) - this.y[i]), 2);
            }
            r = Math.sqrt(a / (n - 2));
        }

        return r;

    }

    /**
     * Try to find the best degree of fitment for the data
     * @param {number} maxDegree - the maximum degree to try
     * @param {number} correlation - the correlation to accept (optional) default 0.9
     */
    public computeBestFit(
        maxDegree: number,
        correlation?: number,
    ): NumberArray {
        
        if (correlation === undefined) {
            correlation = 0.9;
        }

        for (let i = 1; i <= maxDegree; i++) {
            const terms = this.computeCoefficients(i);
            const _correlation = this.correlationCoefficient(terms);
            if (_correlation > correlation ) {
                return terms;

            }
        }
        return [];
    }

    /**
     * Compute coefficients of a fitted polynomial for given data matrix
     * @example
     * const polyfit = new Polyfit(_x64, _y64);
     * const terms = polyfit.computeCoefficients(6);
     * const correlation = polyfit.correlationCoefficient(terms);
     * const stdError = polyfit.standardError(terms);
     * console.warn(
     *   `Polynomial fit: ${terms[5]}•x^5 + ${terms[4]}•x^4 + ${terms[3]}•x^3 + ` +
     *   `${terms[2]}•x^2 + ${terms[1]}•x + ${terms[0]}\n` +
     *   `Correlation coefficient: ${correlation}\n` +
     *   `Standard error: ${stdError}`
     * );
     * @param {number} p - degree of the polynomial
     * @returns {number[]|Float32Array|Float64Array}
     */
    public computeCoefficients(
        p : number
    ): NumberArray {

        const n = this.x.length;
        let r: number;
        let c: number;
        const rs = 2 * (++p) - 1;
        let i: number;

        const m: NumberArray[] = [];

        // Initialize array with 0 values
        if (this.FloatXArray) {
            // fast FloatXArray-Matrix init
            const bytesPerRow = (p+1) * this.FloatXArray.BYTES_PER_ELEMENT;
            const buffer = new ArrayBuffer(p * bytesPerRow);
            for (i = 0; i < p; i++) {
                if (this.FloatXArray.name === "Float32Array") {
                    m[i] = new Float32Array(buffer, i * bytesPerRow, p+1);
                } else {
                    m[i] = new Float64Array(buffer, i * bytesPerRow, p+1);
                }
            }
        } else {
            const zeroRow: number[] = [];
            for (i = 0; i <= p; i++) {
                zeroRow[i] = 0;
            }
            m[0] = zeroRow;
            for (i = 1; i < p; i++) {
                // copy zeroRow
                m[i] = [...zeroRow];
            }
        }

        const mpc = [n];

        for (i = 1; i < rs; i++) {
            mpc[i] = 0;
        }

        for (i = 0; i < n; i++) {
            const x = this.x[i];
            const y = this.y[i];

            // Process precalculation array
            for (r = 1; r < rs; r++) {
                mpc[r] += Math.pow(x, r);
            }
            // Process RH column cells
            m[0][p] += y;
            for (r = 1; r < p; r++) {
                m[r][p] += Math.pow(x, r) * y;
            }
        }

        // Populate square matrix section
        for (r = 0; r < p; r++) {
            for (c = 0; c < p; c++) {
                m[r][c] = mpc[r + c];
            }
        }

        Polyfit.gaussJordanEchelonize(m);

        const terms =
            this.FloatXArray && new this.FloatXArray(m.length) || <NumberArray>[];

        for (i = m.length - 1; i >= 0; i--) {
            terms[i] = m[i][p];
        }

        return terms;

    }

    /**
     * Using given degree of fitment, return a function that will calculate
     * the y for a given x with the computed coefficients
     * 
     * @param {number} degree  > 0
     * @returns {Function}     f(x) = 
     */
    public getPolynomial(
        degree : number
    ): (x: number) => number {

        if (isNaN(degree) || degree < 0) {
            throw new Error('Degree must be a positive integer');
        }

        const terms = this.computeCoefficients(degree);
        const eqParts: string[] = [];

        eqParts.push(terms[0].toPrecision());

        for (let i = 1, len = terms.length; i < len; i++) {
            eqParts.push(terms[i] + ' * Math.pow(x, ' + i + ')');
        }

        const expr = 'return ' + eqParts.join(' + ') + ';';

        /* jshint evil: true */
        return <(x: number) => number>new Function('x', expr);
        /* jshint evil: false */

    }

    /**
     * Convert the polynomial to a string expression, mostly useful for visual
     * debugging
     * 
     * @param {number} degree
     * @returns {string}
     */
    public toExpression(
        degree: number
    ): string {

        if (isNaN(degree) || degree < 0) {
            throw new Error('Degree must be a positive integer');
        }

        const terms = this.computeCoefficients(degree);
        const eqParts: string[] = [];
        const len = terms.length;

        eqParts.push(terms[0].toPrecision());

        for (let i = 1; i < len; i++) {
            eqParts.push(terms[i] + 'x^' + i);
        }

        return eqParts.join(' + ');

    }

}
