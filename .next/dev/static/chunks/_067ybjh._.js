(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/supabase.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "supabase",
    ()=>supabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-client] (ecmascript) <locals>");
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://hqdpxliuvteyuauepajn.supabase.co") || '';
const supabaseAnonKey = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ("TURBOPACK compile-time value", "sb_publishable_BA0WVqU9TznUCNCJsD2ykw_9cJ45oUt") || '';
const isPlaceholder = !supabaseUrl || !supabaseAnonKey || supabaseUrl === 'SEU_URL' || supabaseAnonKey === 'SUA_KEY';
// Mock client to prevent crashes during development if keys are missing
const mockSupabase = {
    channel: ()=>({
            on: ()=>({
                    subscribe: (cb)=>{
                        if (cb) cb('CHANNEL_ERROR');
                        return {
                            send: ()=>{}
                        };
                    }
                }),
            send: ()=>{},
            subscribe: ()=>({
                    send: ()=>{}
                })
        }),
    removeChannel: ()=>{}
};
const supabase = isPlaceholder ? mockSupabase : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseAnonKey);
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function Home() {
    _s();
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [players, setPlayers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [id, setId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('...');
    const [status, setStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('Connecting...');
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const position = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({
        x: 250,
        y: 250
    });
    const myColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(`hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Home.useEffect": ()=>{
            // 0. Initialize persistent ID
            let currentId = localStorage.getItem('mini-gather-id');
            if (!currentId) {
                currentId = Math.random().toString(36).slice(2);
                localStorage.setItem('mini-gather-id', currentId);
            }
            setId(currentId);
            setMounted(true);
        }
    }["Home.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Home.useEffect": ()=>{
            if (!mounted || id === '...') return;
            // 1. Setup Supabase Channel
            const channel = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].channel('room-1', {
                config: {
                    broadcast: {
                        self: true
                    },
                    presence: {
                        key: id
                    }
                }
            });
            channel.on('presence', {
                event: 'sync'
            }, {
                "Home.useEffect": ()=>{
                    const state = channel.presenceState();
                    setPlayers({
                        "Home.useEffect": (prev)=>{
                            const next = {
                                ...prev
                            };
                            const presentIds = Object.keys(state);
                            // Add/Update players from presence state
                            presentIds.forEach({
                                "Home.useEffect": (pid)=>{
                                    const presences = state[pid];
                                    if (presences && presences[0]) {
                                        const p = presences[0];
                                        // Only update if we don't have them or if they are new
                                        if (!next[pid]) {
                                            next[pid] = {
                                                x: p.x || 250,
                                                y: p.y || 250,
                                                color: p.color
                                            };
                                        }
                                    }
                                }
                            }["Home.useEffect"]);
                            // Remove players who are no longer present
                            Object.keys(next).forEach({
                                "Home.useEffect": (pid)=>{
                                    if (!presentIds.includes(pid)) delete next[pid];
                                }
                            }["Home.useEffect"]);
                            return next;
                        }
                    }["Home.useEffect"]);
                }
            }["Home.useEffect"]).on('presence', {
                event: 'join',
                key: id
            }, {
                "Home.useEffect": ({ newPresences })=>{
                    // When someone joins, send them our current position immediately
                    // so they don't have to wait for us to move
                    if (newPresences.length > 0) {
                        channel.send({
                            type: 'broadcast',
                            event: 'move',
                            payload: {
                                id,
                                ...position.current,
                                color: myColor.current
                            }
                        });
                    }
                }
            }["Home.useEffect"]).on('presence', {
                event: 'leave',
                key: id
            }, {
                "Home.useEffect": ({ leftPresences })=>{
                    setPlayers({
                        "Home.useEffect": (prev)=>{
                            const next = {
                                ...prev
                            };
                            leftPresences.forEach({
                                "Home.useEffect": (p)=>{
                                    delete next[p.presence_ref];
                                }
                            }["Home.useEffect"]);
                            return next;
                        }
                    }["Home.useEffect"]);
                }
            }["Home.useEffect"]).on('broadcast', {
                event: 'move'
            }, {
                "Home.useEffect": ({ payload })=>{
                    setPlayers({
                        "Home.useEffect": (prev)=>({
                                ...prev,
                                [payload.id]: {
                                    x: payload.x,
                                    y: payload.y,
                                    color: payload.color
                                }
                            })
                    }["Home.useEffect"]);
                }
            }["Home.useEffect"]).subscribe({
                "Home.useEffect": async (status)=>{
                    if (status === 'SUBSCRIBED') {
                        setStatus('Online');
                        // Track our presence with initial position
                        await channel.track({
                            id,
                            x: position.current.x,
                            y: position.current.y,
                            color: myColor.current,
                            online_at: new Date().toISOString()
                        });
                        // Initial broadcast
                        channel.send({
                            type: 'broadcast',
                            event: 'move',
                            payload: {
                                id,
                                ...position.current,
                                color: myColor.current
                            }
                        });
                    } else if (status === 'CHANNEL_ERROR') {
                        setStatus('Offline (Check Env)');
                    }
                }
            }["Home.useEffect"]);
            return ({
                "Home.useEffect": ()=>{
                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].removeChannel(channel);
                }
            })["Home.useEffect"];
        }
    }["Home.useEffect"], [
        id
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Home.useEffect": ()=>{
            if (id === '...') return;
            const handleKey = {
                "Home.useEffect.handleKey": (e)=>{
                    const step = 10;
                    let moved = false;
                    if (e.key === 'ArrowUp' || e.key === 'w') {
                        position.current.y -= step;
                        moved = true;
                    }
                    if (e.key === 'ArrowDown' || e.key === 's') {
                        position.current.y += step;
                        moved = true;
                    }
                    if (e.key === 'ArrowLeft' || e.key === 'a') {
                        position.current.x -= step;
                        moved = true;
                    }
                    if (e.key === 'ArrowRight' || e.key === 'd') {
                        position.current.x += step;
                        moved = true;
                    }
                    if (moved) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].channel('room-1').send({
                            type: 'broadcast',
                            event: 'move',
                            payload: {
                                id,
                                ...position.current,
                                color: myColor.current
                            }
                        });
                    }
                }
            }["Home.useEffect.handleKey"];
            window.addEventListener('keydown', handleKey);
            return ({
                "Home.useEffect": ()=>window.removeEventListener('keydown', handleKey)
            })["Home.useEffect"];
        }
    }["Home.useEffect"], [
        id
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Home.useEffect": ()=>{
            if (id === '...') return;
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            let animationFrameId;
            const render = {
                "Home.useEffect.render": ()=>{
                    // Clear with a nice background
                    ctx.fillStyle = '#0f172a'; // slate-900
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    // Draw Grid
                    ctx.strokeStyle = '#1e293b'; // slate-800
                    ctx.lineWidth = 1;
                    const gridSize = 50;
                    for(let x = 0; x <= canvas.width; x += gridSize){
                        ctx.beginPath();
                        ctx.moveTo(x, 0);
                        ctx.lineTo(x, canvas.height);
                        ctx.stroke();
                    }
                    for(let y = 0; y <= canvas.height; y += gridSize){
                        ctx.beginPath();
                        ctx.moveTo(0, y);
                        ctx.lineTo(canvas.width, y);
                        ctx.stroke();
                    }
                    // Draw Players
                    Object.entries(players).forEach({
                        "Home.useEffect.render": ([pid, p])=>{
                            const isMe = pid === id;
                            // Shadow/Glow
                            ctx.shadowBlur = 15;
                            ctx.shadowColor = p.color;
                            // Body
                            ctx.fillStyle = p.color;
                            ctx.beginPath();
                            ctx.roundRect(p.x - 15, p.y - 15, 30, 30, 8);
                            ctx.fill();
                            // Reset shadow
                            ctx.shadowBlur = 0;
                            // Label
                            ctx.fillStyle = 'white';
                            ctx.font = '12px Inter, system-ui, sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText(isMe ? 'You' : `Player ${pid.slice(0, 4)}`, p.x, p.y - 25);
                        }
                    }["Home.useEffect.render"]);
                    animationFrameId = requestAnimationFrame(render);
                }
            }["Home.useEffect.render"];
            render();
            return ({
                "Home.useEffect": ()=>cancelAnimationFrame(animationFrameId)
            })["Home.useEffect"];
        }
    }["Home.useEffect"], [
        players,
        id
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "jsx-b7dd064e1677abdb" + " " + "flex min-h-screen flex-col items-center justify-center bg-slate-950 p-4 font-sans text-white",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-b7dd064e1677abdb" + " " + "relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl shadow-blue-500/10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-b7dd064e1677abdb" + " " + "flex items-center justify-between border-b border-slate-800 bg-slate-900/50 px-6 py-3 backdrop-blur-md",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-b7dd064e1677abdb" + " " + "flex items-center gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-b7dd064e1677abdb" + " " + `h-2 w-2 rounded-full ${status === 'Online' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-amber-500 animate-pulse'}`
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 226,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        className: "jsx-b7dd064e1677abdb" + " " + "text-sm font-semibold tracking-tight text-slate-200 uppercase",
                                        children: "Mini Gather"
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 227,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 225,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-b7dd064e1677abdb" + " " + "flex items-center gap-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "jsx-b7dd064e1677abdb",
                                        children: [
                                            "ID: ",
                                            mounted ? id.slice(0, 6) : '......'
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 230,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "jsx-b7dd064e1677abdb" + " " + "h-3 w-[1px] bg-slate-800"
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 231,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "jsx-b7dd064e1677abdb",
                                        children: [
                                            "Players: ",
                                            Object.keys(players).length
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 232,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 229,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 224,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
                        ref: canvasRef,
                        width: 800,
                        height: 600,
                        className: "jsx-b7dd064e1677abdb" + " " + "bg-slate-900"
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 237,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-b7dd064e1677abdb" + " " + "absolute bottom-6 left-6 right-6 flex items-end justify-between pointer-events-none",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-b7dd064e1677abdb" + " " + "rounded-lg border border-slate-700/50 bg-slate-900/80 p-3 backdrop-blur-sm shadow-xl",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "jsx-b7dd064e1677abdb" + " " + "text-[10px] font-bold text-slate-500 uppercase mb-2",
                                        children: "Controls"
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 246,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-b7dd064e1677abdb" + " " + "flex gap-2 text-xs font-mono text-slate-300",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "jsx-b7dd064e1677abdb" + " " + "rounded bg-slate-800 px-1.5 py-0.5 border border-slate-700",
                                                children: "WASD"
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 248,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "jsx-b7dd064e1677abdb" + " " + "text-slate-600",
                                                children: "or"
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 249,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "jsx-b7dd064e1677abdb" + " " + "rounded bg-slate-800 px-1.5 py-0.5 border border-slate-700",
                                                children: "ARROWS"
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 250,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 247,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 245,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-b7dd064e1677abdb" + " " + "text-right",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "jsx-b7dd064e1677abdb" + " " + "text-[10px] font-bold text-slate-500 uppercase mb-1",
                                        children: "Status"
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 255,
                                        columnNumber: 14
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "jsx-b7dd064e1677abdb" + " " + "text-xs font-medium text-emerald-400",
                                        children: status
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 256,
                                        columnNumber: 14
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 254,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 244,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 223,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "jsx-b7dd064e1677abdb" + " " + "mt-8 text-sm text-slate-500 animate-fade-in",
                children: "Open this in another tab to see multiplayer in action."
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 261,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "b7dd064e1677abdb",
                children: "@keyframes fade-in{0%{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}.animate-fade-in{animation:1s ease-out forwards fade-in}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/page.tsx",
        lineNumber: 222,
        columnNumber: 5
    }, this);
}
_s(Home, "ojMWyUf3YSPQrygm40HLZ61rc0o=");
_c = Home;
var _c;
__turbopack_context__.k.register(_c, "Home");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_067ybjh._.js.map