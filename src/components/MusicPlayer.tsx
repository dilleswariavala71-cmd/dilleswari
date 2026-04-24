/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Track } from '../types';

const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Pulse',
    artist: 'AI Synthwave',
    url: 'https://cdn.pixabay.com/audio/2022/10/30/audio_510b65f7c3.mp3', // Synthwave track
    duration: 180,
    cover: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=400&h=400&fit=crop',
  },
  {
    id: '2',
    title: 'Cyber Runner',
    artist: 'Digital Echo',
    url: 'https://cdn.pixabay.com/audio/2023/10/16/audio_f574d6824a.mp3', // High energy Cyberpunk
    duration: 145,
    cover: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&h=400&fit=crop',
  },
  {
    id: '3',
    title: 'Rhythm Engine',
    artist: 'Neural Beats',
    url: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c8c8a73484.mp3', // Techno beat
    duration: 210,
    cover: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=400&h=400&fit=crop',
  },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  }, []);

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = currentTrack.url;
      if (isPlaying) {
        audioRef.current.play().catch(() => {});
      }
    }
  }, [currentTrackIndex, currentTrack.url, isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => handleNext();

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [handleNext]);

  const progress = (currentTime / (audioRef.current?.duration || currentTrack.duration)) * 100;

  return (
    <div className="w-full max-w-[400px] p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-neon-pink/20 blur-[60px]" />
      
      <div className="flex gap-4 items-center">
        {/* Track Cover */}
        <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden group">
          <img 
            src={currentTrack.cover} 
            alt={currentTrack.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Music className="text-white w-6 h-6" />
          </div>
        </div>

        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-white truncate glow-cyan">{currentTrack.title}</h3>
          <p className="text-sm text-white/50 truncate uppercase tracking-widest">{currentTrack.artist}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-neon-cyan glow-cyan"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "linear", duration: 0.1 }}
          />
        </div>
        <div className="flex justify-between mt-2 font-mono text-[10px] text-white/40">
          <span>{Math.floor(currentTime / 60)}:{(Math.floor(currentTime % 60)).toString().padStart(2, '0')}</span>
          <span>{Math.floor(currentTrack.duration / 60)}:{(currentTrack.duration % 60).toString().padStart(2, '0')}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-4 flex items-center justify-between">
        <button className="text-white/40 hover:text-white transition-colors">
          <Volume2 className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-6">
          <button onClick={handlePrev} className="text-white hover:text-neon-cyan transition-colors transform active:scale-90">
            <SkipBack className="w-6 h-6 fill-current" />
          </button>
          
          <button 
            onClick={handlePlayPause}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-white text-black hover:bg-neon-pink hover:text-white transition-all transform active:scale-90 box-glow-pink"
          >
            {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
          </button>

          <button onClick={handleNext} className="text-white hover:text-neon-cyan transition-colors transform active:scale-90">
            <SkipForward className="w-6 h-6 fill-current" />
          </button>
        </div>

        <div className="w-5" /> {/* Spacer */}
      </div>

      <audio ref={audioRef} />
    </div>
  );
}
