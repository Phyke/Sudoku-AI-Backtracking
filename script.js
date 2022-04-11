const isNotBlank = num => num != '_';
const ascendingOrder = (a, b) => parseInt(a)-parseInt(b);
const allTrue = bool => bool === true;

function allDiff(array) {
    const noDup = array.filter(isNotBlank).sort(ascendingOrder);
    return noDup.length == new Set(array).size;
}

class sudokuBoard {
    constructor(sudokuBoard_2DArray) {
        this.data = sudokuBoard_2DArray;
    }
    getRow(row) {
        return this.data[row];
    }
    getCol(col) {
        const colData = [];
        for (let row = 0; row < this.data.length; row++)
            colData.push(this.data[row][col]);
        return colData;
    }
    getSubSqr(row, col) {
        let rowIndex, colIndex;

        if      (row >= 0 && row <= 2) rowIndex = [0, 1, 2];
        else if (row >= 3 && row <= 5) rowIndex = [3, 4, 5];
        else if (row >= 6 && row <= 8) rowIndex = [6, 7, 8];

        if      (col >= 0 && col <= 2) colIndex = [0, 1, 2];
        else if (col >= 3 && col <= 5) colIndex = [3, 4, 5];
        else if (col >= 6 && col <= 8) colIndex = [6, 7, 8];
        
        const subSqrData = [];
        for (let i = 0; i < 3; i++)
            for (let j = 0; j < 3; j++)
                subSqrData.push(this.data[rowIndex[i]][colIndex[j]]);
        return subSqrData;
    }
}

const board01 = [   ['_','_','_','1','_','_','7','_','2'],
                    ['_','3','_','9','5','_','_','_','_'],
                    ['_','_','1','_','_','2','_','_','3'],
                    ['5','9','_','_','_','_','3','_','1'],
                    ['_','2','_','_','_','_','_','7','_'],
                    ['7','_','3','_','_','_','_','9','8'],
                    ['8','_','_','2','_','_','1','_','_'],
                    ['_','_','_','_','8','5','_','6','_'],
                    ['6','_','5','_','_','9','_','_','_']
                ];
/*                  ['9','5','6','1','3','8','7','4','2'],
                    ['2','3','7','9','5','4','8','1','6'],
                    ['4','8','1','6','7','2','9','5','3'],
                    ['5','9','4','8','6','7','3','2','1'],
                    ['1','2','8','5','9','3','6','7','4'],
                    ['7','6','3','4','2','1','5','9','8'],
                    ['8','7','9','2','4','6','1','3','5'],
                    ['3','1','2','7','8','5','4','6','9'],
                    ['6','4','5','3','1','9','2','8','7']*/

const board = new sudokuBoard(board01);
const DOMAIN_VALUES = ['1','2','3','4','5','6','7','8','9'];

function CSPs_Check(currentBoard) {
    const CSPs = [
        allDiff(currentBoard.getRow(0)), allDiff(currentBoard.getRow(0)), allDiff(currentBoard.getRow(0)),
        allDiff(currentBoard.getRow(3)), allDiff(currentBoard.getRow(4)), allDiff(currentBoard.getRow(5)),
        allDiff(currentBoard.getRow(6)), allDiff(currentBoard.getRow(7)), allDiff(currentBoard.getRow(8)),
        allDiff(currentBoard.getCol(0)), allDiff(currentBoard.getCol(1)), allDiff(currentBoard.getCol(2)),
        allDiff(currentBoard.getCol(3)), allDiff(currentBoard.getCol(4)), allDiff(currentBoard.getCol(5)),
        allDiff(currentBoard.getCol(6)), allDiff(currentBoard.getCol(7)), allDiff(currentBoard.getCol(8)),
        allDiff(currentBoard.getSubSqr(0,0)), allDiff(currentBoard.getSubSqr(0,3)), allDiff(currentBoard.getSubSqr(0,6)),
        allDiff(currentBoard.getSubSqr(3,0)), allDiff(currentBoard.getSubSqr(3,3)), allDiff(currentBoard.getSubSqr(3,6)),
        allDiff(currentBoard.getSubSqr(6,0)), allDiff(currentBoard.getSubSqr(6,3)), allDiff(currentBoard.getSubSqr(6,6))
    ];
    //console.log(currentBoard.getRow(0));
    //console.log(allDiff(currentBoard.getRow(0)));
    //console.log(CSPs);
    return CSPs.every(allTrue);
}

function isComplete(currentBoard) {
    for (let i = 0; i < 9; i++)
        for (let j = 0; j < 9; j++)
            if (currentBoard.data[i][j] == '_') return false;
    return CSPs_Check(currentBoard);
}

function getPossibleValue(currentBoard) {
    let possibleValues = [], rowIndex = null, colIndex = null;
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (currentBoard.data[i][j] == '_') {
                rowIndex = i;
                colIndex = j;
                possibleValues = DOMAIN_VALUES.slice();
                possibleValues = possibleValues.filter(n => !currentBoard.getRow(i).includes(n));
                possibleValues = possibleValues.filter(n => !currentBoard.getCol(j).includes(n));
                possibleValues = possibleValues.filter(n => !currentBoard.getSubSqr(i, j).includes(n));
                break;
            }
        }
    }
    //console.log([possibleValues, rowIndex, colIndex]);
    return [possibleValues, rowIndex, colIndex];
}

function backtrackingRecursive(currentBoard) {
    
    if (isComplete(currentBoard)) return currentBoard;

    let [possibleValues, rowIndex, colIndex] = getPossibleValue(currentBoard);

    if (possibleValues.length !== 0 && rowIndex !== null && colIndex !== null) {
        for (let assignValue of possibleValues) {
            currentBoard.data[rowIndex][colIndex] = assignValue;
            let result = backtrackingRecursive(board);
            if (result != false) return result;
            currentBoard.data[rowIndex][colIndex] = '_';
        }
    }
    return false;
}

const result = backtrackingRecursive(board);
for (let i = 0; i < 9; i++)
    console.log(JSON.stringify(result.data[i]));