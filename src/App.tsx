/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Github } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-bg-dark text-white relative overflow-hidden selection:bg-neon-pink">
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-cyan/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-pink/10 blur-[120px] rounded-full pointer-events-none" />
      
      {/* Header */}
      <header className="relative z-10 p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-lg bg-neon-cyan flex items-center justify-center box-glow-cyan rotate-12">
            <span className="font-black text-black text-xl">N</span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tighter leading-none glow-cyan">NEON RHYTHM</h1>
            <p className="text-[10px] text-white/40 uppercase tracking-[0.2em]">Pulse Interactive</p>
          </div>
        </motion.div>

        <div className="flex gap-4 items-center">
          <div className="hidden sm:flex flex-col items-end mr-4">
             <span className="text-[10px] text-white/30 uppercase tracking-widest">SYSTEM STATUS</span>
             <span className="text-[10px] text-neon-lime glow-lime font-mono">ONLINE // READY</span>
          </div>
          <button className="p-2 rounded-full border border-white/10 hover:bg-white/5 transition-colors">
            <Github className="w-5 h-5 text-white/60" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-center gap-12 min-h-[calc(100vh-100px)]">
        
        {/* Game Section (Center) */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex-1 flex justify-center"
        >
          <SnakeGame />
        </motion.section>

        {/* Info/Controls Section */}
        <motion.section 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full md:w-auto flex flex-col gap-8 items-center md:items-start"
        >
          <div className="space-y-4 text-center md:text-left">
            <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter text-white uppercase leading-none">
              THE <span className="text-neon-pink glow-pink underline decoration-2 underline-offset-8">PULSE</span><br />
              IS YOUR<br />
              ENTITY.
            </h2>
            <p className="max-w-[300px] text-white/40 text-sm leading-relaxed">
              Navigate the digital void. Consume the energy fragments. Maintain your momentum through the rhythmic waves.
            </p>
          </div>

          <MusicPlayer />

          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-1 h-12 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  className="w-full bg-neon-cyan/30"
                  animate={{ height: ["20%", "80%", "40%", "90%", "30%"] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
                />
              </div>
            ))}
          </div>
        </motion.section>
      </main>

      {/* Footer / Overlay Decor */}
      <div className="fixed bottom-6 left-6 z-10 pointer-events-none hidden md:block">
        <div className="flex flex-col gap-1 font-mono text-[10px] text-white/20">
          <span>LATENCY: 14MS</span>
          <span>FPS: 60</span>
          <span>BPM: 128</span>
        </div>
      </div>
    </div>
  );
}
