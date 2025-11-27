import React from 'react';
import type { Cell as CellType } from "../../shared/types";
import { socket } from './socket';

interface CellProps {
    row: number;
    col: number;
    cell: CellType;
    disabled: boolean;
}

export const Cell: React.FC<CellProps> = ({ row, col, cell, disabled }) => {
    const handleClick = () => {
        if (disabled) return;
        if (cell.cooldown > 0) return;
        socket.emit('cellClick', { row, col });
    };

    return (
        <button
            className="cell"
            onClick={handleClick}
            disabled={disabled || cell.cooldown > 0}
            style={{ backgroundColor: cell.color }}
        >
            <span className={`shape shape--${cell.shape}`} />
            {cell.cooldown > 0 && (
                <span className="cell__cooldown">{cell.cooldown}</span>
            )}
        </button>
    );
};

