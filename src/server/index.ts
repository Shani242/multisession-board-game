// src/server/index.ts
import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";

import type { GameState } from "../shared/types";
import { createInitialGameState } from "./generator";
import { handleCellClick } from "./game-logic";

type CellClickPayload = {
    row: number;
    col: number;
};

console.log("Server file loaded");

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
    },
});

let gameState: GameState = {
    board: [],
    score: 0,
    isGameOver: false,
    activePlayers: 0,
};
try {
    gameState = createInitialGameState();
    console.log("GameState created successfully");
} catch (err) {
    console.error("Failed to create initial game state:", err);
    process.exit(1);
}


io.on("connection", (socket: Socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.emit("gameState", gameState);

    gameState = {
        ...gameState,
        activePlayers: gameState.activePlayers + 1,
    };
    io.emit("playerCount", gameState.activePlayers);

    socket.on("cellClick", (payload: CellClickPayload) => {
        try {
            if (
                !payload ||
                typeof payload.row !== "number" ||
                typeof payload.col !== "number"
            ) {
                socket.emit("error", "Invalid cell coordinates");
                return;
            }

            const { row, col } = payload;
            const result = handleCellClick(gameState, row, col);

            if (!result.success) {
                if (result.reason === "cooldown") {
                    socket.emit("error", "Cell is in cooldown");
                    return;
                }
                if (result.reason === "invalid") {
                    socket.emit("error", "Invalid move");
                    return;
                }
                if (result.reason === "gameover") {
                    gameState = result.newState || gameState;
                    gameState.isGameOver = true;

                    io.emit("gameState", gameState);
                    io.emit("gameOver", { finalScore: gameState.score });
                    return;
                }
                return;
            }

            gameState = result.newState!;
            io.emit("gameState", gameState);
        } catch (error) {
            console.error("Error in cellClick:", error);
            socket.emit("error", "Server error");
        }
    });

    socket.on("resetGame", () => {
        try {
            const currentPlayers = gameState.activePlayers;
            gameState = createInitialGameState();
            gameState.activePlayers = currentPlayers;
            io.emit("gameState", gameState);
            console.log("Game reset");
        } catch (error) {
            console.error("Error in resetGame:", error);
            socket.emit("error", "Failed to reset game");
        }
    });

    socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
        gameState = {
            ...gameState,
            activePlayers: Math.max(0, gameState.activePlayers - 1),
        };
        io.emit("playerCount", gameState.activePlayers);
    });
});
console.log("A: before listen");

console.log("A: before listen");
console.log("typeof httpServer =", typeof httpServer);

const PORT = process.env.PORT || 4000;

httpServer.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
