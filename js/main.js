'use strict'

const LIFE = '🐞';
const SUPER_LIFE = '🕷️';
const NUM_ROWS = 8;
const NUM_COLS = 8;
const GAME_FREQ = 1000;
var gBoard = [];
var gGameInterval = null;
var gIsGameOver = false;
var gElGameOverModal = document.querySelector('.over');

function initGame() {
    gBoard = initBoard();
    gIsGameOver = false;
    gElGameOverModal.style.display = 'none';
}

function gameRunPauseToggleBtn(button) {
    if (gIsGameOver) return;
    if (button.innerText === 'Run Game') {
        gGameInterval = setInterval(playGame, GAME_FREQ);
        button.innerText = 'Pause';
    } else {
        clearInterval(gGameInterval);
        button.innerText = 'Run Game';
    }
}

function cellClicked(elCell, ev) {
    if (gIsGameOver) return;
    var i = +elCell.dataset.i;
    var j = +elCell.dataset.j;
    if (ev.altKey) {
        clearNegs(i, j, gBoard);
    } else {
        if (gBoard[i][j] === LIFE) {
            gBoard[i][j] = SUPER_LIFE;
        } else {
            gBoard[i][j] = LIFE;
        }
        renderCell(i, j, gBoard);
    }
}

function playGame() {
    gBoard = runGeneration(gBoard);
    renderBoard(gBoard);
    if (isGameOver(gBoard)) {
        clearInterval(gGameInterval);
        gElGameOverModal.style.display = 'block';
        var elRunPauseBtn = document.querySelector('.pause');
        elRunPauseBtn.innerText = 'Run Game';
    }
}

function runGeneration(board) {
    var newBoard = copyMat(board);
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var numOfNegs = countNegs(i, j, board);
            if (numOfNegs < 3 || numOfNegs > 5) {
                if (board[i][j] === LIFE) newBoard[i][j] = '';
            } else if (board[i][j] === '') newBoard[i][j] = LIFE;
        }
    }
    return newBoard;
}

function renderBoard(board) {
    var strHTML = '';
    var elBoard = document.querySelector('.board');
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[0].length; j++) {
            var lifeClass = (board[i][j] === LIFE || board[i][j] === SUPER_LIFE) ? ' life' : '';
            strHTML += `<td class="cell cell-${i}-${j}${lifeClass}" data-i="${i}" data-j="${j}" onclick="cellClicked(this, event)">${board[i][j]}</td>`;
        }
        strHTML += '</tr>';
    }
    elBoard.innerHTML = strHTML;
}

function renderCell(posI, posJ, board) {
    var elCell = document.querySelector(`.cell-${posI}-${posJ}`);
    var lifeClass = (board[posI][posJ] === LIFE || board[posI][posJ] === SUPER_LIFE) ? ' life' : '';
    if (lifeClass) elCell.classList.add('life');
    else elCell.classList.remove('life');
    var strHTML = `<td class="cell${lifeClass}" data-i="${posI}" data-j="${posJ}" onclick="cellClicked(this, event)">${board[posI][posJ]}</td>`;
    elCell.innerHTML = strHTML;
}

function countNegs(posI, posJ, board) {
    var count = 0;
    for (var i = posI - 1; i <= posI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = posJ - 1; j <= posJ + 1; j++) {
            if (j < 0 || j >= board[0].length) continue;
            if (i === posI && j === posJ) continue;
            if (board[i][j] === LIFE || board[i][j] === SUPER_LIFE) count++;
        }
    }
    return count;
}

function clearNegs(posI, posJ, board) {
    var count = 0;
    for (var i = posI - 1; i <= posI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = posJ - 1; j <= posJ + 1; j++) {
            if (j < 0 || j >= board[0].length) continue;
            if (board[i][j] === LIFE) {
                board[i][j] = '';
                renderCell(i, j, board);
            }
        }
    }
    return count;
}

function isGameOver(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (board[i][j] === LIFE || board[i][j] === SUPER_LIFE) return false;
        }
    }
    gIsGameOver = true;
    return true;
}

function initBoard() {
    var board = [];
    for (var i = 0; i < NUM_ROWS; i++) {
        board[i] = [];
        for (var j = 0; j < NUM_COLS; j++) {
            board[i][j] = (Math.random() > 0.7) ? LIFE : '';
        }
    }
    renderBoard(board);
    return board;
}

function copyMat(mat) {
    var newMat = [];
    for (var i = 0; i < mat.length; i++) {
        newMat[i] = mat[i].slice();
    }
    return newMat;
}