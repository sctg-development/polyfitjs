/**
* Polyfit
* @class
*/
interface NumberArrayConstructor {
    new (length: number): NumberArray;
    new (buffer: ArrayBuffer, byteOffset?: number, length?: number): NumberArray;
    BYTES_PER_ELEMENT?: number;
}
interface NumberArray {
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
declare class Polyfit {
    private x;
    private y;
    private FloatXArray;
    /**
     * Polyfit
     * @constructor
     * @param {number[]|Float32Array|Float64Array} x
     * @param {number[]|Float32Array|Float64Array} y
     */
    constructor(x: NumberArray, y: NumberArray);
    /**
     * Perform gauss-jordan division
     *
     * @param {number[][]|Float32Array[]|Float64Array[]} matrix - gets modified
     * @param {number} row
     * @param {number} col
     * @param {number} numCols
     * @returns void
     */
    static gaussJordanDivide(matrix: NumberArray[], row: number, col: number, numCols: number): void;
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
    static gaussJordanEliminate(matrix: NumberArray[], row: number, col: number, numRows: number, numCols: number): void;
    /**
     * Perform gauss-jordan echelon method
     *
     * @param {number[][]|Float32Array[]|Float64Array[]} matrix - gets modified
     * @returns {number[][]|Float32Array[]|Float64Array[]} matrix
     */
    static gaussJordanEchelonize(matrix: NumberArray[]): NumberArray[];
    /**
     * Perform regression
     *
     * @param {number} x
     * @param {number[]|Float32Array[]|Float64Array[]} terms
     * @returns {number}
     */
    static regress(x: number, terms: NumberArray): number;
    /**
     * Compute correlation coefficient
     *
     * @param {number[]|Float32Array[]|Float64Array[]} terms
     * @returns {number}
     */
    correlationCoefficient(terms: NumberArray): number;
    /**
     * Run standard error function
     *
     * @param {number[]|Float32Array[]|Float64Array[]} terms
     * @returns number
     */
    standardError(terms: NumberArray): number;
    /**
     * Compute coefficients for given data matrix
     *
     * @param {number} p
     * @returns {number[]|Float32Array|Float64Array}
     */
    computeCoefficients(p: number): NumberArray;
    /**
     * Using given degree of fitment, return a function that will calculate
     * the y for a given x
     *
     * @param {number} degree  > 0
     * @returns {Function}     f(x) =
     */
    getPolynomial(degree: number): (x: number) => number;
    /**
     * Convert the polynomial to a string expression, mostly useful for visual
     * debugging
     *
     * @param {number} degree
     * @returns {string}
     */
    toExpression(degree: number): string;
}

export { type NumberArray, type NumberArrayConstructor, Polyfit };
