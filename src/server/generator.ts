import {
    Cell,
    GameState,
    Shape,
    Color,
} from '../shared/types';
import { isValidCombination } from './validation';

console.log('hey');

const SHAPES: Shape[] = ['triangle', 'square', 'diamond', 'circle'];
const COLORS: Color[] = ['red', 'green', 'blue', 'yellow'];

function createInitialBoard(): Cell[][] {
    while (true) {
        const board: Cell[][] = [];
        let failed = false;

        for (let r = 0; r < 3; r++) {
            const row: Cell[] = [];

            for (let c = 0; c < 6; c++) {
                const options: { shape: Shape; color: Color }[] = [];

                for (const shape of SHAPES) {
                    for (const color of COLORS) {
                        if (isValidCombination(board, r, c, shape, color)) {
                            options.push({ shape, color });
                        }
                    }
                }

                if (options.length === 0) {
                    failed = true;
                    break;
                }

                const choice = options[Math.floor(Math.random() * options.length)];
                row.push({
                    shape: choice.shape,
                    color: choice.color,
                    cooldown: 0,
                });
            }

            if (failed) break;
            board.push(row);
        }

        if (!failed && board.length === 3) {
            return board;
        }
    }
}

export function createInitialGameState(): GameState {
    return {
        board: createInitialBoard(),
        score: 0,
        isGameOver: false,
        activePlayers: 0,
    };
}