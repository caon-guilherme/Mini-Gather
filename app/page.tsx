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

  // Camera & Interaction State
  const [zoom, setZoom] = useState(1);
  const camera = useRef({ x: 250, y: 250 });
  const isDragging = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // 0. Initialize persistent ID
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
      .on('presence', { event: 'join', key: id }, ({ newPresences }: { newPresences: any[] }) => {
        if (newPresences.length > 0 && newPresences[0].id !== id) {
          channel.send({
            type: 'broadcast',
            event: 'move',
            payload: { id, x: position.current.x, y: position.current.y, color: myColor.current }
          });
        }
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

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Apply Camera Transform
      const offsetX = canvas.width / 2 - camera.current.x * zoom;
      const offsetY = canvas.height / 2 - camera.current.y * zoom;
      ctx.setTransform(zoom, 0, 0, zoom, offsetX, offsetY);

      // Grid (Infinite-ish)
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      const gridRange = 2000;
      for (let x = -gridRange; x <= gridRange; x += 50) {
        ctx.beginPath(); ctx.moveTo(x, -gridRange); ctx.lineTo(x, gridRange); ctx.stroke();
      }
      for (let y = -gridRange; y <= gridRange; y += 50) {
        ctx.beginPath(); ctx.moveTo(-gridRange, y); ctx.lineTo(gridRange, y); ctx.stroke();
      }

      const drawPlayer = (x: number, y: number, color: string, label: string) => {
        ctx.shadowBlur = 15;
        ctx.shadowColor = color;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.roundRect(x - 15, y - 15, 30, 30, 8);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'white';
        ctx.font = `${12 / zoom}px Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(label, x, y - 25);
      };

      drawPlayer(position.current.x, position.current.y, myColor.current, 'You');

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
  }, [id, zoom]);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const dx = (e.clientX - lastMousePos.current.x) / zoom;
    const dy = (e.clientY - lastMousePos.current.y) / zoom;
    camera.current.x -= dx;
    camera.current.y -= dy;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => { isDragging.current = false; };
  const centerMap = () => { camera.current = { x: position.current.x, y: position.current.y }; };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#070707] font-sans text-white overflow-hidden">
      {/* Game Canvas Container */}
      <div className="relative w-full h-screen overflow-hidden cursor-grab active:cursor-grabbing"
           onMouseDown={handleMouseDown}
           onMouseMove={handleMouseMove}
           onMouseUp={handleMouseUp}
           onMouseLeave={handleMouseUp}>
        
        <canvas 
          ref={canvasRef} 
          width={typeof window !== 'undefined' ? window.innerWidth : 800} 
          height={typeof window !== 'undefined' ? window.innerHeight : 600} 
          className="bg-slate-950"
        />

        {/* Floating Controls (Top Right) */}
        <div className="absolute top-6 right-6 flex flex-col gap-2 pointer-events-auto">
          <button onClick={centerMap} className="p-3 bg-[#202124] hover:bg-[#3c4043] rounded-xl border border-white/10 shadow-2xl transition-all">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M3 12h3m12 0h3M12 3v3m0 12v3"/></svg>
          </button>
          <div className="flex flex-col rounded-xl border border-white/10 bg-[#202124] shadow-2xl overflow-hidden">
            <button onClick={() => setZoom(prev => Math.min(prev + 0.1, 2))} className="p-3 hover:bg-[#3c4043] border-b border-white/5 transition-all text-xl font-light">+</button>
            <button onClick={() => setZoom(prev => Math.max(prev - 0.1, 0.5))} className="p-3 hover:bg-[#3c4043] transition-all text-xl font-light">−</button>
          </div>
        </div>

        {/* Gather.town Style Bottom Toolbar */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1 p-1.5 rounded-2xl bg-[#202124]/95 border border-white/10 shadow-2xl backdrop-blur-xl pointer-events-auto">
          {/* User Profile Info */}
          <div className="flex items-center gap-3 px-4 py-2 hover:bg-white/5 rounded-xl cursor-pointer transition-all border-r border-white/5 mr-1">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold shadow-lg">
              {id.slice(0, 1).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-white/90 leading-none">User</span>
              <span className="text-[9px] text-emerald-400 font-medium">Disponível</span>
            </div>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/40"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
          </div>

          {/* Interactive Buttons (Mocked) */}
          <div className="flex items-center gap-1">
            <ToolbarButton active icon={<><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></>} />
            <ToolbarButton active icon={<><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></>} />
            <ToolbarButton icon={<><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></>} />
            <ToolbarButton icon={<><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></>} />
            <ToolbarButton icon={<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>} />
          </div>

          {/* Right Side Tools */}
          <div className="flex items-center gap-1 border-l border-white/5 ml-1 pl-1">
            <div className="relative group">
              <ToolbarButton icon={<><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></>} />
              <span className="absolute -top-2 -right-1 bg-blue-600 text-[8px] font-bold px-1 rounded-full border border-[#202124]">NOVO</span>
            </div>
            <ToolbarButton icon={<><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>} />
            <ToolbarButton icon={<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>} dot />
            <button className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-red-500/20 text-red-400 transition-all">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </button>
          </div>
        </div>

        {/* Status / Version Overlay */}
        <div className="absolute top-6 left-6 p-4 rounded-2xl bg-black/40 backdrop-blur-md border border-white/5 pointer-events-none">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Mini Gather Engine</span>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-white/90">Espaço de Usuário</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[9px] font-bold border border-emerald-500/20">{status}</span>
            </div>
            <div className="flex items-center gap-3 mt-2 text-[10px] text-white/50 font-medium">
              <span>{playerCount} Jogadores</span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span>REV: {process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || 'LOCAL-DEV'}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function ToolbarButton({ icon, active = false, dot = false }: { icon: React.ReactNode, active?: boolean, dot?: boolean }) {
  return (
    <button className={`relative flex items-center justify-center w-10 h-10 rounded-xl transition-all ${active ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-white/70 hover:text-white'}`}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {icon}
      </svg>
      {dot && <span className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-emerald-500 border-2 border-[#202124]" />}
    </button>
  );
}
