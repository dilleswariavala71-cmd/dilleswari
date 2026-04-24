/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSnake } from '../hooks/useSnake';
import { Trophy, RefreshCw } from 'lucide-react';

export default function SnakeGame() {
  const { gameState, resetGame, GRID_SIZE, hasStarted } = useSnake();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle High DPI
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const cellSize = rect.width / GRID_SIZE;

    // Clear background
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Grid (subtle)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Draw Food
    ctx.fillStyle = '#ff007f';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff007f';
    ctx.beginPath();
    ctx.arc(
      gameState.food.x * cellSize + cellSize / 2,
      gameState.food.y * cellSize + cellSize / 2,
      cellSize / 2.5,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Draw Snake
    gameState.snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#00f3ff' : '#00f3ff80';
      ctx.shadowBlur = index === 0 ? 20 : 10;
      ctx.shadowColor = '#00f3ff';
      
      const padding = 1;
      ctx.fillRect(
        segment.x * cellSize + padding,
        segment.y * cellSize + padding,
        cellSize - padding * 2,
        cellSize - padding * 2
      );
    });

    // Reset shadow for next frame
    ctx.shadowBlur = 0;

  }, [gameState, GRID_SIZE]);

  return (
    <div className="relative flex flex-col items-center">
      {/* Game Stats */}
      <div className="w-full max-w-[400px] flex justify-between mb-4 font-mono text-sm">
        <div className="flex items-center gap-2 text-neon-cyan">
          <span className="opacity-50">SCORE:</span>
          <span className="text-xl glow-cyan">{gameState.score.toString().padStart(4, '0')}</span>
        </div>
        <div className="flex items-center gap-2 text-neon-pink">
          <span className="opacity-50">HIGH:</span>
          <span className="text-xl glow-pink">{gameState.highScore.toString().padStart(4, '0')}</span>
        </div>
      </div>

      {/* Game Board */}
      <div className="relative p-1 rounded-sm neon-border-cyan box-glow-cyan bg-bg-dark">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="rounded-sm block"
        />

        {/* Start Overlay */}
        {!hasStarted && !gameState.isGameOver && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-2xl font-black text-white glow-cyan tracking-[0.3em] uppercase"
            >
              Press Arrow to Start
            </motion.div>
          </div>
        )}

        {/* Game Over Overlay */}
        <AnimatePresence>
          {gameState.isGameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center"
            >
              <Trophy className="w-12 h-12 text-neon-lime mb-4 glow-lime" />
              <h2 className="text-3xl font-bold text-white mb-2 tracking-tighter">GAME OVER</h2>
              <p className="text-neon-cyan mb-6 font-mono">FINAL SCORE: {gameState.score}</p>
              
              <button
                onClick={resetGame}
                className="flex items-center gap-2 px-6 py-3 bg-neon-pink text-white rounded-full font-bold hover:scale-105 active:scale-95 transition-transform box-glow-pink"
              >
                <RefreshCw className="w-5 h-5" />
                PLAY AGAIN
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 text-white/30 text-[10px] uppercase tracking-[0.2em] font-mono">
        Use Arrow Keys to Navigate
      </div>
    </div>
  );
}
