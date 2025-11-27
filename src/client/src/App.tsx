import React, { useEffect, useState } from 'react';
import { socket } from './socket';
import { GameBoard } from './game-board';
import type { GameState } from "../shared/types";
import './styles.css';

interface GameOverPayload {
    finalScore: number;
}

export const App: React.FC = () => {
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [playerCount, setPlayerCount] = useState<number>(0);
    const [gameOver, setGameOver] = useState<GameOverPayload | null>(null);

    useEffect(() => {
        socket.on('gameState', (state: GameState) => {
            setGameState(state);
            if (!state.isGameOver) {
                setGameOver(null);
            }
        });

        socket.on('playerCount', (count: number) => {
            setPlayerCount(count);
        });

        socket.on('gameOver', (payload: GameOverPayload) => {
            setGameOver(payload);
        });

        socket.on('error', (msg: string) => {
            console.warn('Server error:', msg);
        });

        return () => {
            socket.off('gameState');
            socket.off('playerCount');
            socket.off('gameOver');
            socket.off('error');
        };
    }, []);

    const handleReset = () => {
        socket.emit('resetGame');
    };

    if (!gameState) {
        return <div className="app app--center">Loading game...</div>;
    }

    return (
        <div className="app">
            <header className="header">
                <h1>Shape & Color Game</h1>
                <div className="header__stats">
                    <div>Score: {gameState.score}</div>
                    <div>Players online: {playerCount}</div>
                </div>
                <button className="btn" onClick={handleReset}>
                    New Game
                </button>
            </header>

            <main>
                <GameBoard
                    board={gameState.board}
                    isGameOver={gameState.isGameOver}
                />
            </main>

            {gameOver && (
                <div className="modal">
                    <div className="modal__content">
                        <h2>Game Over</h2>
                        <p>Final score: {gameOver.finalScore}</p>
                        <button className="btn" onClick={() => setGameOver(null)}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
