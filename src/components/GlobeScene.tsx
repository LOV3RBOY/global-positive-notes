'use client'

import { useEffect, useRef, useMemo, useCallback } from 'react'
import Globe, { GlobeMethods } from 'react-globe.gl'
import { useNotesStore } from '@/store/notesStore'
import * as THREE from 'three'

interface ArcData {
    startLat: number
    startLng: number
    endLat: number
    endLng: number
    color: string
}

interface PointData {
    lat: number
    lng: number
    size: number
    color: string
}

export default function GlobeScene() {
    const globeRef = useRef<GlobeMethods | undefined>(undefined)
    const containerRef = useRef<HTMLDivElement>(null)

    const { flyingNotes, landedNotes, setUserLocation } = useNotesStore()

    // Convert flying notes to arc data
    const arcsData: ArcData[] = useMemo(() =>
        flyingNotes.map(note => ({
            startLat: note.startLat,
            startLng: note.startLng,
            endLat: note.endLat,
            endLng: note.endLng,
            color: note.color,
        })),
        [flyingNotes]
    )

    // Convert landed notes to points data
    const pointsData: PointData[] = useMemo(() =>
        landedNotes.map(note => ({
            lat: note.lat,
            lng: note.lng,
            size: 0.4,
            color: '#4facfe',
        })),
        [landedNotes]
    )

    // Get user geolocation on mount
    useEffect(() => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation(position.coords.latitude, position.coords.longitude)
                },
                () => {
                    // Default to approximate center if denied
                    setUserLocation(37.7749, -122.4194) // San Francisco
                }
            )
        }
    }, [setUserLocation])

    // Configure globe on mount
    useEffect(() => {
        if (!globeRef.current) return

        const globe = globeRef.current

        // Set initial view
        globe.pointOfView({ lat: 20, lng: 0, altitude: 2.5 }, 0)

        // Configure controls for smooth damping
        const controls = globe.controls()
        if (controls) {
            controls.enableDamping = true
            controls.dampingFactor = 0.05
            controls.rotateSpeed = 0.5
            controls.zoomSpeed = 0.8
            controls.minDistance = 120
            controls.maxDistance = 500
            controls.enablePan = false
        }

        // Auto-rotate slowly
        globe.controls().autoRotate = true
        globe.controls().autoRotateSpeed = 0.3
    }, [])

    // Custom globe material for premium look
    const globeMaterial = useMemo(() => {
        return new THREE.MeshPhongMaterial({
            color: '#1a1a2e',
            emissive: '#0a0a15',
            emissiveIntensity: 0.1,
            shininess: 5,
            transparent: true,
            opacity: 0.95,
        })
    }, [])

    // Atmosphere configuration
    const atmosphereColor = '#4facfe'
    const atmosphereAltitude = 0.25

    return (
        <div ref={containerRef} className="w-full h-full">
            <Globe
                ref={globeRef}

                // Globe appearance
                globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
                bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"

                // Atmosphere
                atmosphereColor={atmosphereColor}
                atmosphereAltitude={atmosphereAltitude}
                showAtmosphere={true}

                // Globe material
                globeMaterial={globeMaterial}

                // Arcs (flying notes)
                arcsData={arcsData}
                arcColor={'color'}
                arcDashLength={0.5}
                arcDashGap={0.2}
                arcDashAnimateTime={2000}
                arcStroke={0.5}
                arcAltitudeAutoScale={0.4}
                arcsTransitionDuration={300}

                // Points (landed notes)
                pointsData={pointsData}
                pointLat="lat"
                pointLng="lng"
                pointColor="color"
                pointAltitude={0.01}
                pointRadius="size"
                pointsMerge={true}

                // Sizing
                width={typeof window !== 'undefined' ? window.innerWidth : 1200}
                height={typeof window !== 'undefined' ? window.innerHeight : 800}

                // Performance
                animateIn={true}
                waitForGlobeReady={true}
            />
        </div>
    )
}
