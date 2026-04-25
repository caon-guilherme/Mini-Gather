'use client';
// Build Trigger #4 - Full Stability Fix - 23:00

import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';

/**
 * Mini Gather - Multiplayer Basic Demo
 * Features:
 * - Fluid 60FPS movement
 * - Network interpolation
 * - Persistent ID
 */

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [playerCount, setPlayerCount] = useState(0);
  const [id, setId] = useState('...');
  const [status, setStatus] = useState('Connecting...');
  const [mounted, setMounted] = useState(false);
  
  const position = useRef({ x: 250, y: 250 });
  const myColor = useRef(`hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`);
  const keysPressed = useRef<Record<string, boolean>>({});
  const lastBroadcast = useRef(0);
  const playersRef = useRef<Record<string, { x: number; y: number; targetX: number; targetY: number; color: string }>>({});

  useEffect(() => {
    // 0. Initialize persistent ID (Session-based to allow multi-tab testing)
    let currentId = sessionStorage.getItem('mini-gather-id');
    if (!currentId) {
      currentId = Math.random().toString(36).slice(2);
      sessionStorage.setItem('mini-gather-id', currentId);
    }
    setId(currentId);
    setMounted(true);

  }, []);

  useEffect(() => {
    if (!mounted || id === '...') return;

    const channel = supabase.channel('room-1', {
      config: {
        broadcast: { self: false },
        presence: { key: id },
      },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const presentIds = Object.keys(state);
        setPlayerCount(presentIds.length);
        
        presentIds.forEach(pid => {
          if (pid === id) return;
          const presences = state[pid] as any[];
          if (presences && presences[0]) {
            const p = presences[0];
            if (!playersRef.current[pid]) {
              playersRef.current[pid] = { x: p.x || 250, y: p.y || 250, targetX: p.x || 250, targetY: p.y || 250, color: p.color };
            }
          }
        });

        Object.keys(playersRef.current).forEach(pid => {
          if (pid !== id && !presentIds.includes(pid)) delete playersRef.current[pid];
        });
      })
      .on('broadcast', { event: 'move' }, ({ payload }: { payload: any }) => {
        if (!playersRef.current[payload.id]) {
          playersRef.current[payload.id] = { x: payload.x, y: payload.y, targetX: payload.x, targetY: payload.y, color: payload.color };
        } else {
          playersRef.current[payload.id].targetX = payload.x;
          playersRef.current[payload.id].targetY = payload.y;
        }
      })
      .subscribe(async (status: string) => {
        if (status === 'SUBSCRIBED') {
          setStatus('Online');
          await channel.track({ id, x: position.current.x, y: position.current.y, color: myColor.current });
        }
      });

    return () => { supabase.removeChannel(channel); };
  }, [id, mounted]);

  useEffect(() => {
    if (id === '...') return;
    const handleDown = (e: KeyboardEvent) => { keysPressed.current[e.key.toLowerCase()] = true; };
    const handleUp = (e: KeyboardEvent) => { keysPressed.current[e.key.toLowerCase()] = false; };
    window.addEventListener('keydown', handleDown);
    window.addEventListener('keyup', handleUp);
    return () => {
      window.removeEventListener('keydown', handleDown);
      window.removeEventListener('keyup', handleUp);
    };
  }, [id]);

  useEffect(() => {
    if (id === '...') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = (time: number) => {
      const speed = 4;
      let moved = false;
      if (keysPressed.current['w'] || keysPressed.current['arrowup']) { position.current.y -= speed; moved = true; }
      if (keysPressed.current['s'] || keysPressed.current['arrowdown']) { position.current.y += speed; moved = true; }
      if (keysPressed.current['a'] || keysPressed.current['arrowleft']) { position.current.x -= speed; moved = true; }
      if (keysPressed.current['d'] || keysPressed.current['arrowright']) { position.current.x += speed; moved = true; }

      if (moved && time - lastBroadcast.current > 33) {
        supabase.channel('room-1').send({
          type: 'broadcast',
          event: 'move',
          payload: { id, x: position.current.x, y: position.current.y, color: myColor.current }
        });
        lastBroadcast.current = time;
      }

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      for (let x = 0; x <= canvas.width; x += 50) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y <= canvas.height; y += 50) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }

      // Render Me
      const drawPlayer = (x: number, y: number, color: string, label: string) => {
        ctx.shadowBlur = 15;
        ctx.shadowColor = color;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.roundRect(x - 15, y - 15, 30, 30, 8);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'white';
        ctx.font = '12px Inter, system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(label, x, y - 25);
      };

      drawPlayer(position.current.x, position.current.y, myColor.current, 'You');

      // Render Others
      Object.entries(playersRef.current).forEach(([pid, p]) => {
        if (pid === id) return;
        p.x += (p.targetX - p.x) * 0.15;
        p.y += (p.targetY - p.y) * 0.15;
        drawPlayer(p.x, p.y, p.color, `Player ${pid.slice(0, 4)}`);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [id]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 p-4 font-sans text-white">
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl shadow-blue-500/10">
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/50 px-6 py-3 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className={`h-2 w-2 rounded-full ${status === 'Online' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-amber-500 animate-pulse'}`} />
            <h1 className="text-sm font-semibold tracking-tight text-slate-200 uppercase">Mini Gather</h1>
          </div>
          <div className="flex items-center gap-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">
            <span>ID: {mounted ? id.slice(0, 6) : '......'}</span>
            <span className="h-3 w-[1px] bg-slate-800" />
            <span>Players: {playerCount}</span>
          </div>
        </div>

        <canvas 
          ref={canvasRef} 
          width={800} 
          height={600} 
          className="bg-slate-900"
        />

        <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between pointer-events-none">
          <div className="rounded-lg border border-slate-700/50 bg-slate-900/80 p-3 backdrop-blur-sm shadow-xl">
            <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">Controls</p>
            <div className="flex gap-2 text-xs font-mono text-slate-300">
              <span className="rounded bg-slate-800 px-1.5 py-0.5 border border-slate-700">WASD</span>
              <span className="text-slate-600">or</span>
              <span className="rounded bg-slate-800 px-1.5 py-0.5 border border-slate-700">ARROWS</span>
            </div>
          </div>
          
          <div className="text-right">
             <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Status</p>
             <div className="flex flex-col items-end gap-1">
               <p className="text-xs font-medium text-emerald-400">{status}</p>
               <p className="text-[8px] font-mono text-slate-600">
                 REV: {process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || 'LOCAL-DEV'}
               </p>
             </div>
          </div>
        </div>
      </div>
      
      <p className="mt-8 text-sm text-slate-500 animate-fade-in">
        Open this in another tab to see multiplayer in action.
      </p>
      
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
      `}</style>
    </main>
  );
}
