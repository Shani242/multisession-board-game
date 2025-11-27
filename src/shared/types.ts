export type Shape = 'triangle' | 'square' | 'diamond' | 'circle';
export type Color = 'red' | 'green' | 'blue' | 'yellow';

export interface Cell {
    shape: Shape;
    color: Color;
    cooldown: number;
}

export interface GameState {
    board: Cell[][];
    score: number;
    isGameOver: boolean;
    activePlayers: number;
}


