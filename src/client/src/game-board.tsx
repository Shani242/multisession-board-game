import React from 'react';
import type { Cell as CellType } from "../shared/types";
import { Cell } from './cell';

interface GameBoardProps {
    board: CellType[][];
    isGameOver: boolean;
}

export function GameBoard({ board, isGameOver }: GameBoardProps) {
    return (
        <div className={`board ${isGameOver ? 'board--disabled' : ''}`}>
            {board.map((row, rowIndex) => (
                <div className="board__row" key={rowIndex}>
                    {row.map((cell, colIndex) => (
                        <Cell
                            key={`${rowIndex}-${colIndex}`}
                            row={rowIndex}
                            col={colIndex}
                            cell={cell}
                            disabled={isGameOver}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
};
