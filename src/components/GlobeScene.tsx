'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import createGlobe from 'cobe'
import { useNotesStore } from '@/store/notesStore'

export default function GlobeScene() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const pointerInteracting = useRef<number | null>(null)
    const pointerInteractionMovement = useRef(0)
    const phiRef = useRef(0)
    const widthRef = useRef(0)
    const globeRef = useRef<ReturnType<typeof createGlobe> | null>(null)

    const { flyingNotes, landedNotes } = useNotesStore()
    const [markers, setMarkers] = useState<Array<{ location: [number, number]; size: number }>>([])

    // Convert landed notes to markers
    useEffect(() => {
        const newMarkers = landedNotes.slice(-30).map(note => ({
            location: [note.lat, note.lng] as [number, number],
            size: 0.03 + Math.random() * 0.02,
        }))
        setMarkers(newMarkers)
    }, [landedNotes])

    // Handle resize
    useEffect(() => {
        const onResize = () => {
            if (canvasRef.current) {
                widthRef.current = canvasRef.current.offsetWidth
            }
        }
        window.addEventListener('resize', onResize)
        onResize()
        return () => window.removeEventListener('resize', onResize)
    }, [])

    // Initialize COBE globe
    useEffect(() => {
        if (!canvasRef.current) return

        let phi = 0
        const canvas = canvasRef.current

        // Set canvas size
        const size = Math.min(window.innerWidth, window.innerHeight) * 1.2
        canvas.width = size * 2
        canvas.height = size * 2
        canvas.style.width = `${size}px`
        canvas.style.height = `${size}px`

        globeRef.current = createGlobe(canvas, {
            devicePixelRatio: 2,
            width: size * 2,
            height: size * 2,
            phi: 0,
            theta: 0.2,
            dark: 1,
            diffuse: 1.2,
            mapSamples: 24000, // High sample count for detailed point-cloud
            mapBrightness: 8,
            baseColor: [0.15, 0.15, 0.18], // Dark base
            markerColor: [1, 0.8, 0.6], // Warm golden glow for markers
            glowColor: [0.08, 0.08, 0.12], // Subtle dark blue glow
            markers: markers,
            onRender: (state) => {
                // Smooth auto-rotation with pointer interaction
                if (!pointerInteracting.current) {
                    phi += 0.002
                }
                state.phi = phi + pointerInteractionMovement.current
                state.width = widthRef.current * 2
                state.height = widthRef.current * 2
            },
        })

        return () => {
            globeRef.current?.destroy()
        }
    }, [markers])

    // Pointer handlers for drag interaction
    const handlePointerDown = useCallback((e: React.PointerEvent) => {
        pointerInteracting.current = e.clientX - pointerInteractionMovement.current
        if (canvasRef.current) {
            canvasRef.current.style.cursor = 'grabbing'
        }
    }, [])

    const handlePointerUp = useCallback(() => {
        pointerInteracting.current = null
        if (canvasRef.current) {
            canvasRef.current.style.cursor = 'grab'
        }
    }, [])

    const handlePointerOut = useCallback(() => {
        pointerInteracting.current = null
        if (canvasRef.current) {
            canvasRef.current.style.cursor = 'grab'
        }
    }, [])

    const handlePointerMove = useCallback((e: React.PointerEvent) => {
        if (pointerInteracting.current !== null) {
            const delta = e.clientX - pointerInteracting.current
            pointerInteractionMovement.current = delta / 100
        }
    }, [])

    return (
        <div className="globe-canvas flex items-center justify-center">
            <canvas
                ref={canvasRef}
                className="cursor-grab"
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerOut={handlePointerOut}
                onPointerMove={handlePointerMove}
                style={{
                    maxWidth: '100vw',
                    maxHeight: '100vh',
                    aspectRatio: '1',
                }}
            />

            {/* Arc overlay for flying notes */}
            {flyingNotes.length > 0 && (
                <div className="fixed inset-0 pointer-events-none z-20">
                    <svg className="w-full h-full">
                        {flyingNotes.map((note, i) => (
                            <ArcPath key={note.id} note={note} index={i} />
                        ))}
                    </svg>
                </div>
            )}
        </div>
    )
}

// Animated arc component
function ArcPath({ note, index }: { note: any; index: number }) {
    const elapsed = Date.now() - note.timestamp
    const progress = Math.min(elapsed / 3000, 1) // 3 second flight

    // Simple bezier path (you'd calculate this from lat/lng in production)
    const cx = window.innerWidth / 2
    const cy = window.innerHeight / 2
    const startAngle = (note.startLng + 180) * (Math.PI / 180)
    const endAngle = (note.endLng + 180) * (Math.PI / 180)
    const radius = Math.min(window.innerWidth, window.innerHeight) * 0.3

    const x1 = cx + Math.cos(startAngle) * radius
    const y1 = cy + Math.sin(startAngle) * radius * 0.6
    const x2 = cx + Math.cos(endAngle) * radius
    const y2 = cy + Math.sin(endAngle) * radius * 0.6

    const midX = (x1 + x2) / 2
    const midY = Math.min(y1, y2) - 100 // Arc height

    const pathD = `M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`

    return (
        <g>
            <path
                d={pathD}
                fill="none"
                stroke={`rgba(255, 200, 150, ${0.6 - progress * 0.5})`}
                strokeWidth="2"
                strokeDasharray="5 3"
                style={{
                    filter: 'drop-shadow(0 0 6px rgba(255, 200, 150, 0.8))',
                }}
            />
            {/* Moving dot */}
            <circle
                cx={x1 + (x2 - x1) * progress}
                cy={y1 + (midY - y1) * 2 * progress * (1 - progress) + (y2 - y1) * progress * progress}
                r="4"
                fill="rgba(255, 220, 180, 1)"
                style={{
                    filter: 'drop-shadow(0 0 10px rgba(255, 200, 150, 1))',
                }}
            />
        </g>
    )
}
