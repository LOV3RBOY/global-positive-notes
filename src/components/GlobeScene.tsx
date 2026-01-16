'use client'

import { useEffect, useRef, useCallback, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import createGlobe from 'cobe'
import { useNotesStore, Note } from '@/store/notesStore'

export default function GlobeScene() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const pointerInteracting = useRef<number | null>(null)
    const pointerInteractionMovement = useRef(0)
    const phiRef = useRef(0)
    const globeRef = useRef<ReturnType<typeof createGlobe> | null>(null)

    const { flyingNotes, landedNotes, setUserLocation } = useNotesStore()

    // Convert landed notes to globe markers
    const markers = useMemo(() =>
        landedNotes.slice(-40).map(note => ({
            location: [note.lat, note.lng] as [number, number],
            size: 0.02 + Math.random() * 0.015,
        })),
        [landedNotes]
    )

    // Get user location on mount
    useEffect(() => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setUserLocation(pos.coords.latitude, pos.coords.longitude),
                () => setUserLocation(40.7128, -74.0060)
            )
        }
    }, [setUserLocation])

    // Initialize globe
    useEffect(() => {
        if (!canvasRef.current) return

        let phi = 0
        let width = 0

        const onResize = () => {
            if (canvasRef.current) {
                width = canvasRef.current.offsetWidth
            }
        }
        window.addEventListener('resize', onResize)
        onResize()

        globeRef.current = createGlobe(canvasRef.current, {
            devicePixelRatio: 2,
            width: 1200,
            height: 1200,
            phi: 0,
            theta: 0.15,
            dark: 1,
            diffuse: 1.4,
            mapSamples: 32000,
            mapBrightness: 6,
            baseColor: [0.12, 0.12, 0.14],
            markerColor: [1.0, 0.85, 0.7],
            glowColor: [0.06, 0.06, 0.08],
            markers: markers,
            onRender: (state) => {
                if (!pointerInteracting.current) {
                    phi += 0.0015
                }
                state.phi = phi + pointerInteractionMovement.current
                state.width = width * 2
                state.height = width * 2
            },
        })

        return () => {
            window.removeEventListener('resize', onResize)
            globeRef.current?.destroy()
        }
    }, [markers])

    // Pointer handlers
    const onPointerDown = useCallback((e: React.PointerEvent) => {
        pointerInteracting.current = e.clientX - pointerInteractionMovement.current
        if (canvasRef.current) canvasRef.current.style.cursor = 'grabbing'
    }, [])

    const onPointerUp = useCallback(() => {
        pointerInteracting.current = null
        if (canvasRef.current) canvasRef.current.style.cursor = 'grab'
    }, [])

    const onPointerMove = useCallback((e: React.PointerEvent) => {
        if (pointerInteracting.current !== null) {
            const delta = e.clientX - pointerInteracting.current
            pointerInteractionMovement.current = delta / 150
            phiRef.current += delta / 150
        }
    }, [])

    return (
        <div className="globe-viewport">
            {/* Globe canvas */}
            <motion.canvas
                ref={canvasRef}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
                className="cursor-grab"
                onPointerDown={onPointerDown}
                onPointerUp={onPointerUp}
                onPointerOut={onPointerUp}
                onPointerMove={onPointerMove}
                style={{
                    width: '100%',
                    height: '100%',
                    maxWidth: '800px',
                    maxHeight: '800px',
                    contain: 'layout paint size',
                }}
            />

            {/* Flying notes visualization */}
            <AnimatePresence>
                {flyingNotes.map((note) => (
                    <FlyingNoteArc key={note.id} note={note} />
                ))}
            </AnimatePresence>
        </div>
    )
}

// Sophisticated arc animation for flying notes
function FlyingNoteArc({ note }: { note: Note }) {
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const startTime = note.timestamp
        const duration = 3000

        const animate = () => {
            const elapsed = Date.now() - startTime
            const p = Math.min(elapsed / duration, 1)
            setProgress(p)

            if (p < 1) {
                requestAnimationFrame(animate)
            }
        }

        requestAnimationFrame(animate)
    }, [note.timestamp])

    // Calculate arc path
    const cx = typeof window !== 'undefined' ? window.innerWidth / 2 : 600
    const cy = typeof window !== 'undefined' ? window.innerHeight / 2 : 400
    const radius = Math.min(cx, cy) * 0.35

    const startAngle = ((note.startLng + 180) / 360) * Math.PI * 2
    const endAngle = ((note.endLng + 180) / 360) * Math.PI * 2

    const x1 = cx + Math.cos(startAngle) * radius
    const y1 = cy + Math.sin(startAngle) * radius * 0.5
    const x2 = cx + Math.cos(endAngle) * radius
    const y2 = cy + Math.sin(endAngle) * radius * 0.5

    // Bezier control point for arc
    const cpX = (x1 + x2) / 2
    const cpY = Math.min(y1, y2) - 80

    // Current position on curve (quadratic bezier)
    const t = progress
    const currentX = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * cpX + t * t * x2
    const currentY = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * cpY + t * t * y2

    // Easing function for opacity
    const opacity = progress < 0.1
        ? progress * 10
        : progress > 0.9
            ? (1 - progress) * 10
            : 1

    return (
        <motion.div
            className="fixed inset-0 pointer-events-none z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <svg className="w-full h-full" style={{ overflow: 'visible' }}>
                {/* Trail path */}
                <motion.path
                    d={`M ${x1} ${y1} Q ${cpX} ${cpY} ${x2} ${y2}`}
                    fill="none"
                    stroke={`rgba(255, 215, 180, ${opacity * 0.15})`}
                    strokeWidth="1"
                    strokeDasharray="4 6"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: progress }}
                    transition={{ duration: 0.1, ease: "linear" }}
                />

                {/* Glowing particle */}
                <motion.circle
                    cx={currentX}
                    cy={currentY}
                    r="3"
                    fill={`rgba(255, 220, 190, ${opacity})`}
                    style={{
                        filter: `drop-shadow(0 0 4px rgba(255, 215, 180, ${opacity})) 
                     drop-shadow(0 0 8px rgba(255, 200, 160, ${opacity * 0.6}))`,
                    }}
                />
            </svg>
        </motion.div>
    )
}
