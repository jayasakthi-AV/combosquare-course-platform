// src/components/lms/VideoPlayer.jsx
// ─────────────────────────────────────────────────────────────────
//  Custom HTML5 video player with:
//  • Anti-skip enforcement (can't seek past watched position)
//  • Progress saved to backend every 10 s
//  • Resume from last_position on mount
//  • Marks lesson complete at 95 % watch
// ─────────────────────────────────────────────────────────────────

import { useRef, useEffect, useState, useCallback } from 'react';
import { saveVideoProgress } from '../../services/lmsApi';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw } from 'lucide-react';

const SAVE_INTERVAL_MS = 10_000;   // save progress every 10 s
const COMPLETE_THRESHOLD = 95;     // % watched to mark complete

export default function VideoPlayer({
  courseId,
  lesson,              // { id, video_url, video_duration_secs, title }
  initialPosition = 0, // seconds — resume from here
  onComplete,          // () => void — called once when lesson completes
  onProgressUpdate,    // (percent, position) => void
}) {
  const videoRef       = useRef(null);
  const saveTimerRef   = useRef(null);
  const maxWatchedRef  = useRef(initialPosition); // furthest point ever reached
  const [playing, setPlaying]   = useState(false);
  const [muted,   setMuted]     = useState(false);
  const [current, setCurrent]   = useState(initialPosition);
  const [duration, setDuration] = useState(lesson.video_duration_secs || 0);
  const [volume,  setVolume]    = useState(1);
  const [completed, setCompleted] = useState(false);
  const [buffered, setBuffered] = useState(0);

  // ── Seek to resume position on mount ──────────────────────────
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onLoaded = () => {
      setDuration(v.duration);
      if (initialPosition > 0) {
        v.currentTime = initialPosition;
      }
    };
    v.addEventListener('loadedmetadata', onLoaded);
    return () => v.removeEventListener('loadedmetadata', onLoaded);
  }, [initialPosition]);


  // ── Anti-skip: block seeking forward past max watched ─────────
  const handleSeeking = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    // Allow only backward seeks or up to maxWatched + 3 s buffer
    if (v.currentTime > maxWatchedRef.current + 3) {
      v.currentTime = maxWatchedRef.current;
    }
  }, []);


  // ── Time update ───────────────────────────────────────────────
  const handleTimeUpdate = useCallback(() => {
    const v = videoRef.current;
    if (!v || !v.duration) return;

    const pos     = v.currentTime;
    const pct     = (pos / v.duration) * 100;
    const maxPct  = (maxWatchedRef.current / v.duration) * 100;

    // Advance max only forward
    if (pos > maxWatchedRef.current) {
      maxWatchedRef.current = pos;
    }

    setCurrent(pos);

    // Update buffer bar
    if (v.buffered.length > 0) {
      setBuffered((v.buffered.end(v.buffered.length - 1) / v.duration) * 100);
    }

    onProgressUpdate?.(Math.max(pct, maxPct), Math.floor(pos));

    // Mark complete
    if (!completed && maxPct >= COMPLETE_THRESHOLD) {
      setCompleted(true);
      onComplete?.();
    }
  }, [completed, onComplete, onProgressUpdate]);


  // ── Periodic save to backend ──────────────────────────────────
  const saveProgress = useCallback(async () => {
    if (!videoRef.current) return;
    const v    = videoRef.current;
    const pos  = Math.floor(maxWatchedRef.current);
    const pct  = v.duration ? (maxWatchedRef.current / v.duration) * 100 : 0;
    try {
      await saveVideoProgress(courseId, lesson.id, pct, pos);
    } catch {/* silent — don't interrupt playback */}
  }, [courseId, lesson.id]);

  useEffect(() => {
    saveTimerRef.current = setInterval(saveProgress, SAVE_INTERVAL_MS);
    return () => {
      clearInterval(saveTimerRef.current);
      saveProgress(); // save on unmount
    };
  }, [saveProgress]);


  // ── Controls ──────────────────────────────────────────────────
  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else          { v.pause(); setPlaying(false); }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const handleVolumeChange = (e) => {
    const v = videoRef.current;
    const val = parseFloat(e.target.value);
    if (v) v.volume = val;
    setVolume(val);
  };

  const handleProgressClick = (e) => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    const bar   = e.currentTarget;
    const rect  = bar.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    const target= ratio * v.duration;
    // Block forward seeking past max watched
    v.currentTime = Math.min(target, maxWatchedRef.current + 3);
  };

  const fullscreen = () => videoRef.current?.requestFullscreen?.();

  const fmt = (s) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const progressPct  = duration ? (current / duration) * 100 : 0;
  const maxPct       = duration ? (maxWatchedRef.current / duration) * 100 : 0;

  return (
    <div className="relative w-full bg-black rounded-2xl overflow-hidden shadow-2xl group">

      {/* Video element */}
      <video
        ref={videoRef}
        src={lesson.video_url}
        className="w-full aspect-video"
        onTimeUpdate={handleTimeUpdate}
        onSeeking={handleSeeking}
        onEnded={() => { setPlaying(false); saveProgress(); }}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        playsInline
      />

      {/* Overlay controls — visible on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">

        {/* Progress bar */}
        <div className="mb-3">
          {/* Buffer */}
          <div
            className="relative h-1.5 bg-white/20 rounded-full cursor-pointer mb-1"
            onClick={handleProgressClick}
          >
            <div
              className="absolute left-0 top-0 h-full bg-white/30 rounded-full"
              style={{ width: `${buffered}%` }}
            />
            {/* Max-watched ceiling */}
            <div
              className="absolute left-0 top-0 h-full bg-purple-400/50 rounded-full"
              style={{ width: `${maxPct}%` }}
            />
            {/* Current position */}
            <div
              className="absolute left-0 top-0 h-full bg-purple-500 rounded-full transition-all"
              style={{ width: `${progressPct}%` }}
            />
            {/* Thumb */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-md"
              style={{ left: `calc(${progressPct}% - 7px)` }}
            />
          </div>

          <div className="flex items-center justify-between text-white/70 text-xs">
            <span>{fmt(current)}</span>
            <span className="text-purple-300 text-[10px]">
              {maxPct < COMPLETE_THRESHOLD
                ? `Watched ${Math.round(maxPct)}% — can't skip ahead`
                : '✓ Fully watched'}
            </span>
            <span>{fmt(duration)}</span>
          </div>
        </div>

        {/* Button row */}
        <div className="flex items-center gap-4">
          <button onClick={togglePlay} className="text-white hover:text-purple-300 transition-colors">
            {playing
              ? <Pause size={22} fill="currentColor" />
              : <Play  size={22} fill="currentColor" />
            }
          </button>

          <button onClick={toggleMute} className="text-white hover:text-purple-300 transition-colors">
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>

          <input
            type="range" min={0} max={1} step={0.05} value={volume}
            onChange={handleVolumeChange}
            className="w-20 accent-purple-500"
          />

          <div className="flex-1" />

          {completed && (
            <span className="flex items-center gap-1 text-green-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
              Lesson Complete
            </span>
          )}

          <button onClick={fullscreen} className="text-white hover:text-purple-300 transition-colors">
            <Maximize size={18} />
          </button>
        </div>
      </div>

      {/* Big play overlay when paused */}
      {!playing && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all">
            <Play size={28} className="text-white ml-1" fill="white" />
          </div>
        </button>
      )}
    </div>
  );
}
