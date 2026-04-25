'use client';
// Rebuild Trigger #2 - 22:20



import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';

/**
 * Mini Gather - Multiplayer Basic Demo
 * Features:
 * - Real-time movement via Supabase Broadcast
 * - Canvas rendering with smooth UI
 * - Responsive game world
 */

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [players, setPlayers] = useState<Record<string, { x: number; y: number; color: string }>>({});
  const [id, setId] = useState('...');
  const [status, setStatus] = useState('Connecting...');
  const [mounted, setMounted] = useState(false);
  
  const position = useRef({ x: 250, y: 250 });
  const myColor = useRef(`hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`);

  useEffect(() => {
    // 0. Initialize persistent ID
    let currentId = localStorage.getItem('mini-gather-id');
    if (!currentId) {
      currentId = Math.random().toString(36).slice(2);
      localStorage.setItem('mini-gather-id', currentId);
    }
    setId(currentId);
    setMounted(true);
  }, []);



  const keysPressed = useRef<Record<string, boolean>>({});
  const lastBroadcast = useRef(0);

  useEffect(() => {
    if (!mounted || id === '...') return;

    // 1. Setup Supabase Channel
    const channel = supabase.channel('room-1', {
      config: {
        broadcast: { self: false }, // Don't receive our own moves back
        presence: { key: id },
      },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        setPlayers(prev => {
          const next = { ...prev };
          const presentIds = Object.keys(state);
          
          presentIds.forEach(pid => {
            const presences = state[pid] as any[];
            if (presences && presences[0]) {
              const p = presences[0];
              if (!next[pid]) {
                next[pid] = { x: p.x || 250, y: p.y || 250, targetX: p.x || 250, targetY: p.y || 250, color: p.color };
              }
            }
          });

          Object.keys(next).forEach(pid => {
            if (!presentIds.includes(pid)) delete next[pid];
          });
          return next;
        });
      })
      .on('presence', { event: 'join', key: id }, ({ newPresences }: { newPresences: any[] }) => {
        if (newPresences.length > 0) {
          channel.send({
            type: 'broadcast',
            event: 'move',
            payload: { id, x: position.current.x, y: position.current.y, color: myColor.current }
          });
        }
      })
      .on('presence', { event: 'leave', key: id }, ({ leftPresences }: { leftPresences: any[] }) => {
        setPlayers(prev => {
          const next = { ...prev };
          leftPresences.forEach((p: any) => {
            delete next[p.presence_ref];
          });
          return next;
        });
      })
      .on('broadcast', { event: 'move' }, ({ payload }: { payload: any }) => {
        setPlayers(prev => ({
          ...prev,
          [payload.id]: { 
            ...(prev[payload.id] || { x: payload.x, y: payload.y, color: payload.color }),
            targetX: payload.x, 
            targetY: payload.y 
          }
        }));
      })
      .subscribe(async (status: string) => {
        if (status === 'SUBSCRIBED') {
          setStatus('Online');
          await channel.track({
            id,
            x: position.current.x,
            y: position.current.y,
            color: myColor.current,
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
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
      // 1. Update Local Position (60 FPS fluid)
      const speed = 4;
      let moved = false;
      if (keysPressed.current['w'] || keysPressed.current['arrowup']) { position.current.y -= speed; moved = true; }
      if (keysPressed.current['s'] || keysPressed.current['arrowdown']) { position.current.y += speed; moved = true; }
      if (keysPressed.current['a'] || keysPressed.current['arrowleft']) { position.current.x -= speed; moved = true; }
      if (keysPressed.current['d'] || keysPressed.current['arrowright']) { position.current.x += speed; moved = true; }

      // 2. Broadcast position (throttled to ~30Hz for performance)
      if (moved && time - lastBroadcast.current > 33) {
        supabase.channel('room-1').send({
          type: 'broadcast',
          event: 'move',
          payload: { id, x: position.current.x, y: position.current.y, color: myColor.current }
        });
        lastBroadcast.current = time;
      }

      // 3. Clear Canvas
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Grid
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      for (let x = 0; x <= canvas.width; x += 50) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y <= canvas.height; y += 50) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }

      // 4. Update & Draw Players
      setPlayers(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(pid => {
          const p = next[pid];
          // Interpolation for remote players
          if (pid !== id) {
            p.x += (p.targetX - p.x) * 0.15; // Smooth slide
            p.y += (p.targetY - p.y) * 0.15;
          } else {
            // My own position is updated by inputs
            p.x = position.current.x;
            p.y = position.current.y;
          }

          // Render
          ctx.shadowBlur = 15;
          ctx.shadowColor = p.color;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.roundRect(p.x - 15, p.y - 15, 30, 30, 8);
          ctx.fill();
          ctx.shadowBlur = 0;

          ctx.fillStyle = 'white';
          ctx.font = '12px Inter, system-ui, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(pid === id ? 'You' : `Player ${pid.slice(0, 4)}`, p.x, p.y - 25);
        });
        return next;
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
            <span>Players: {Object.keys(players).length}</span>
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
             <p className="text-xs font-medium text-emerald-400">{status}</p>
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
