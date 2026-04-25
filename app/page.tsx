'use client';
// Build Trigger #4 - Full Stability Fix - 23:00

import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type IAgoraRTC from 'agora-rtc-sdk-ng';

// Configuração da Agora.io
const AGORA_APP_ID = process.env.NEXT_PUBLIC_AGORA_APP_ID || '6439685d9c304b118e0b59793f663926';

/**
 * Mini Gather - Multiplayer Basic Demo
 * Features:
 * - Fluid 60FPS movement
 * - Network interpolation
 * - Persistent ID
 */

export default function Home() {
  console.log('Componente montado. AGORA_APP_ID:', AGORA_APP_ID);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [playerCount, setPlayerCount] = useState(0);
  const [id, setId] = useState('...');
  const [status, setStatus] = useState('Connecting...');
  const [mounted, setMounted] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const position = useRef({ x: 250, y: 250 });
  const myColor = useRef(`hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`);
  const keysPressed = useRef<Record<string, boolean>>({});
  const lastBroadcast = useRef(0);
  const playersRef = useRef<Record<string, { x: number; y: number; targetX: number; targetY: number; color: string; audioTrack?: any; isSpeaking?: boolean }>>({});

  // Agora Refs
  const agoraClient = useRef<any>(null);
  const localAudioTrack = useRef<any>(null);

  // Camera & Interaction State
  const [zoom, setZoom] = useState(1);
  const camera = useRef({ x: 250, y: 250 });
  const isDragging = useRef(false);
  const isFollowing = useRef(true); // Camera follows player by default
  const lastMousePos = useRef({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    // 0. Initialize persistent ID
    let currentId = sessionStorage.getItem('mini-gather-id');
    if (!currentId) {
      currentId = Math.random().toString(36).slice(2);
      sessionStorage.setItem('mini-gather-id', currentId);
    }
    setId(currentId);
    setMounted(true);

    // Handle Resize
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Agora Initialization
  useEffect(() => {
    if (!mounted || !AGORA_APP_ID || !id || id === '...') return;

    const initAgora = async () => {
      console.log("Iniciando Agora com ID:", AGORA_APP_ID);
      try {
        const AgoraRTC = (await import('agora-rtc-sdk-ng')).default as any;
        console.log("Agora SDK importado.");
        AgoraRTC.setLogLevel(2); // Avisos e Erros
        
        const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
        agoraClient.current = client;
        client.enableAudioVolumeIndicator(); // chamado na instância, não na classe
        console.log("Cliente criado e volume indicator ativado.");

        client.on('user-published', async (user: any, mediaType: any) => {
          console.log("Usuário remoto publicou áudio:", user.uid);
          await client.subscribe(user, mediaType);
          if (mediaType === 'audio') {
            const remoteAudioTrack = user.audioTrack;
            if (remoteAudioTrack) {
              remoteAudioTrack.play();
              if (playersRef.current[user.uid as string]) {
                playersRef.current[user.uid as string].audioTrack = remoteAudioTrack;
              }
            }
          }
        });

        client.on('user-unpublished', (user: any) => {
          console.log("Usuário remoto saiu do áudio:", user.uid);
          if (playersRef.current[user.uid as string]) {
            playersRef.current[user.uid as string].audioTrack = null;
          }
        });

        client.on('volume-indicator', (volumes: any[]) => {
          volumes.forEach((volume: any) => {
            const isUserSpeaking = volume.level > 10;
            if (volume.uid === id) {
              setIsSpeaking(isUserSpeaking);
            } else if (playersRef.current[volume.uid as string]) {
              playersRef.current[volume.uid as string].isSpeaking = isUserSpeaking;
            }
          });
        });

        console.log("Tentando entrar no canal 'main-room' com UID:", id);
        await client.join(AGORA_APP_ID, 'main-room', null, id);
        console.log("Conectado à Agora.io com sucesso!");
      } catch (e) {
        console.error('Falha crítica na Agora:', e);
      }
    };



    initAgora();
    return () => {
      if (agoraClient.current) {
        agoraClient.current.leave();
      }
    };
  }, [id, mounted]);

  // Mic Toggle
  const toggleMic = async () => {
    if (!AGORA_APP_ID) {
      alert("NEXT_PUBLIC_AGORA_APP_ID não configurado.");
      return;
    }

    // Se o cliente ainda não estiver pronto, inicializa agora
    if (!agoraClient.current) {
      try {
        console.log("Inicializando Agora no clique do mic...");
        const AgoraRTC = (await import('agora-rtc-sdk-ng')).default as any;
        const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
        agoraClient.current = client;

        client.on('user-published', async (user: any, mediaType: any) => {
          await client.subscribe(user, mediaType);
          if (mediaType === 'audio') {
            user.audioTrack?.play();
            if (playersRef.current[user.uid]) {
              playersRef.current[user.uid].audioTrack = user.audioTrack;
            }
          }
        });

        client.on('volume-indicator', (volumes: any[]) => {
          volumes.forEach((v: any) => {
            const speaking = v.level > 10;
            if (v.uid === id) setIsSpeaking(speaking);
            else if (playersRef.current[v.uid]) playersRef.current[v.uid].isSpeaking = speaking;
          });
        });

        client.enableAudioVolumeIndicator(); // chamado na instância, não na classe
        const currentId = sessionStorage.getItem('mini-gather-id') || id;
        await client.join(AGORA_APP_ID, 'main-room', null, currentId);
        console.log("Agora conectado via clique do mic!");
      } catch (e) {
        console.error("Falha ao inicializar Agora no clique:", e);
        alert("Não foi possível conectar ao servidor de áudio. Verifique o console (F12).");
        return;
      }
    }
    
    if (isMicOn) {
      if (localAudioTrack.current) {
        try {
          await agoraClient.current.unpublish(localAudioTrack.current);
          localAudioTrack.current.close();
          localAudioTrack.current = null;
        } catch (e) {
          console.error("Erro ao desativar mic:", e);
        }
      }
      setIsMicOn(false);
      setIsSpeaking(false);
    } else {
      const AgoraRTC = (await import('agora-rtc-sdk-ng')).default as any;
      try {
        const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        localAudioTrack.current = audioTrack;
        await agoraClient.current.publish(audioTrack);
        setIsMicOn(true);
      } catch (e) {
        alert("Erro ao acessar microfone. Verifique as permissões do navegador.");
        console.error('Mic Error:', e);
      }
    }
  };


  // Distance / Volume Logic
  useEffect(() => {
    const interval = setInterval(() => {
      Object.entries(playersRef.current).forEach(([pid, player]) => {
        if (player.audioTrack) {
          const dx = position.current.x - player.x;
          const dy = position.current.y - player.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          // Max distance for audio: 400px
          let volume = Math.max(0, 100 - (dist / 4)); 
          player.audioTrack.setVolume(Math.floor(volume));
        }
      });
    }, 200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!mounted || id === '...') return;

    const channel = supabase.channel('room-1', {
      config: {
        broadcast: { self: false },
        presence: { key: id },
      },
    });

    (channel as any)
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
              playersRef.current[pid] = { x: p.x || 0, y: p.y || 0, targetX: p.x || 0, targetY: p.y || 0, color: p.color };
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

      if (moved) {
        if (time - lastBroadcast.current > 33) {
          supabase.channel('room-1').send({
            type: 'broadcast',
            event: 'move',
            payload: { id, x: position.current.x, y: position.current.y, color: myColor.current }
          });
          lastBroadcast.current = time;
        }
        // When moving, follow player
        isFollowing.current = true;
      }

      // Smooth camera follow
      if (isFollowing.current) {
        camera.current.x += (position.current.x - camera.current.x) * 0.1;
        camera.current.y += (position.current.y - camera.current.y) * 0.1;
      }

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.imageSmoothingEnabled = false; // Crunchy pixels
      ctx.fillStyle = '#1a1c2c'; // Classic dark blue pixel-art background
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Apply Camera Transform
      const offsetX = canvas.width / 2 - camera.current.x * zoom;
      const offsetY = canvas.height / 2 - camera.current.y * zoom;
      ctx.setTransform(zoom, 0, 0, zoom, offsetX, offsetY);

      // Pixel Grid (Tiles)
      ctx.strokeStyle = '#252943';
      ctx.lineWidth = 2;
      const gridRange = 3000;
      for (let x = -gridRange; x <= gridRange; x += 50) {
        ctx.beginPath(); ctx.moveTo(x, -gridRange); ctx.lineTo(x, gridRange); ctx.stroke();
      }
      for (let y = -gridRange; y <= gridRange; y += 50) {
        ctx.beginPath(); ctx.moveTo(-gridRange, y); ctx.lineTo(gridRange, y); ctx.stroke();
      }

      const drawPlayer = (x: number, y: number, color: string, label: string, speaking: boolean = false) => {
        const px = Math.floor(x);
        const py = Math.floor(y);
        
        // Draw blocky character
        ctx.fillStyle = color;
        ctx.fillRect(px - 12, py - 12, 24, 24);
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fillRect(px - 8, py - 4, 16, 4);
        ctx.fillStyle = 'white';
        ctx.fillRect(px - 6, py - 4, 2, 2);
        ctx.fillRect(px + 4, py - 4, 2, 2);
        
        // Speech Bubble (Visual indicator)
        if (speaking) {
          ctx.fillStyle = 'white';
          ctx.beginPath();
          ctx.arc(px + 15, py - 20, 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#1a1c2c';
          ctx.font = '10px Arial';
          ctx.fillText('♪', px + 15, py - 16);
        }

        // Label
        ctx.fillStyle = 'white';
        ctx.font = `bold ${10 / zoom}px "Courier New", monospace`;
        ctx.textAlign = 'center';
        ctx.fillText(label.toUpperCase(), px, py - 22);
      };

      drawPlayer(position.current.x, position.current.y, myColor.current, 'You', isSpeaking);

      Object.entries(playersRef.current).forEach(([pid, p]) => {
        if (pid === id) return;
        p.x += (p.targetX - p.x) * 0.15;
        p.y += (p.targetY - p.y) * 0.15;
        drawPlayer(p.x, p.y, p.color, `Player ${pid.slice(0, 4)}`, p.isSpeaking);
      });



      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [id, zoom, dimensions]);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    isFollowing.current = false; // Stop following on drag
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
  const centerMap = () => { isFollowing.current = true; };

  const handleWheel = (e: React.WheelEvent) => {
    setZoom(prev => {
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      const next = Math.max(0.5, Math.min(prev + delta, 3));
      return next;
    });
  };

  return (
    <main className="fixed inset-0 flex flex-col items-center justify-center bg-[#070707] font-sans text-white overflow-hidden select-none">
      {/* Game Canvas Container */}
      <div className="relative w-full h-full overflow-hidden cursor-grab active:cursor-grabbing"
           onMouseDown={handleMouseDown}
           onMouseMove={handleMouseMove}
           onMouseUp={handleMouseUp}
           onMouseLeave={handleMouseUp}
           onWheel={handleWheel}>

        
        <canvas 
          ref={canvasRef} 
          width={dimensions.width} 
          height={dimensions.height} 
          className="block"
        />

        {/* Floating Controls (Bottom Right) */}
        <div className="absolute bottom-24 right-6 flex flex-col gap-2 pointer-events-auto">
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
              {mounted ? id.slice(0, 1).toUpperCase() : '?'}
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-white/90 leading-none">Player {mounted ? id.slice(0, 4) : '...'}</span>
              <span className="text-[9px] text-emerald-400 font-medium">Disponível</span>
            </div>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/40"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
          </div>

          {/* Interactive Buttons (Mocked) */}
          <div className="flex items-center gap-1">
            <button 
              onClick={toggleMic}
              className={`relative flex items-center justify-center w-10 h-10 rounded-xl transition-all ${isMicOn ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
                {!isMicOn && <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" />}
              </svg>
            </button>
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

function ToolbarButton({ icon, active = false, dot = false, onClick }: { icon: React.ReactNode, active?: boolean, dot?: boolean, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`relative flex items-center justify-center w-10 h-10 rounded-xl transition-all ${active ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-white/70 hover:text-white'}`}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {icon}
      </svg>
      {dot && <span className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-emerald-500 border-2 border-[#202124]" />}
    </button>
  );
}
