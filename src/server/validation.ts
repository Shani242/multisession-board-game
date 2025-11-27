import {Cell,Color,GameState,Shape} from "../shared/types";


export type Board = Cell[][];
export function getAdjacentPositions(row: number, col: number, rows: number, cols: number) {
    const positions: { row: number; col: number }[] = [];
    if (row > 0) positions.push({ row: row - 1, col });
    if (row < rows - 1) positions.push({ row: row + 1, col });
    if (col > 0) positions.push({ row, col: col - 1 });
    if (col < cols - 1) positions.push({ row, col: col + 1 });
    return positions;
}

export function isValidCombination(
    board:Board,
    row:number,
    col:number,
    shape:Shape,
    color:Color
):boolean{
    if (!board.length) return true;
    const rows=board.length;
    const cols=board[0]?.length??0;
    const neighbors=getAdjacentPositions(row,col,rows,cols);
    for (const pos of neighbors){
        const neighborRow = board[pos.row];
        if (!neighborRow) continue;
        const neighbor = neighborRow[pos.col];
        if (!neighbor) continue;
        if (neighbor.shape === shape) return false;
        if (neighbor.color === color) return false;
    }
    return true;
}

export function hasAnyValidCombination(
    board:Board,
    row:number,
    col:number,
    shapes:Shape[],
    colors:Color[]
):boolean{
    for (const s of shapes){
        for(const c of colors){
            if(isValidCombination(board,row,col,s,c)){
                return true;
            }
        }
    }
    return false;
}