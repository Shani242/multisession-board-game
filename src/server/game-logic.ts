import {Color, GameState, Shape} from "../shared/types";
import { Board } from './validation';
import { isValidCombination, hasAnyValidCombination } from './validation';

const SHAPES: Shape[] = ['triangle', 'square', 'diamond', 'circle'];
const COLORS: Color[] = ['red', 'green', 'blue', 'yellow'];

export type CellClickReason = 'cooldown' | 'invalid' | 'gameover';

export interface CellClickResult {
    success: boolean;
    newState: GameState;
    reason?: CellClickReason;
}

function randomShape():Shape{
    return SHAPES[Math.floor(Math.random()*SHAPES.length)]
}

function randomColor():Color{
    return COLORS[Math.floor(Math.random()*COLORS.length)]
}

function cloneBoard(board: Board): Board {
    return board.map((row) => row.map((cell) => ({ ...cell })));
}

function decrementCooldowns(board: Board) {
    for (const row of board) {
        for (const cell of row) {
            if (cell.cooldown > 0) {
                cell.cooldown -= 1;
            }
        }
    }
}
export function handleCellClick(
    state: GameState,
    row: number,
    col: number
): CellClickResult {

    const board = cloneBoard(state.board);

    if (!board[row] || !board[row][col]) {
        return {
            success: false,
            newState: state,
            reason: 'invalid',
        };
    }

    if (board[row][col].cooldown > 0) {
        return {
            success: false,
            newState: state,
            reason: 'cooldown',
        };
    }

    if (!hasAnyValidCombination(board, row, col, SHAPES, COLORS)) {
        const newState: GameState = {
            ...state,
            isGameOver: true,
        };
        return {
            success: false,
            newState,
            reason: 'gameover',
        };
    }

    let attempts = 0;
    let updated = false;

    while (attempts < 100 && !updated) {
        const shape = randomShape();
        const color = randomColor();

        if (isValidCombination(board, row, col, shape, color)) {
            board[row][col].shape = shape;
            board[row][col].color = color;
            board[row][col].cooldown = 3;
            updated = true;
        } else {
            attempts++;
        }
    }

    if (!updated) {
        const newState: GameState = {
            ...state,
            isGameOver: true,
        };
        return {
            success: false,
            newState,
            reason: 'gameover',
        };
    }

    decrementCooldowns(board);

    const newState: GameState = {
        ...state,
        board,
        score: state.score + 1,
    };

    return {
        success: true,
        newState,
    };
}
