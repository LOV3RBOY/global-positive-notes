'use client'

import dynamic from 'next/dynamic'
import { NoteInput } from '@/components/NoteInput'
import { Header } from '@/components/Header'
import { ActiveNotes } from '@/components/ActiveNotes'
import { useEffect } from 'react'
import { useNotesStore } from '@/store/notesStore'

// Dynamic import for globe (uses WebGL)
const GlobeScene = dynamic(() => import('@/components/GlobeScene'), {
    ssr: false,
    loading: () => (
        <div className="fixed inset-0 bg-black flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-2 border-white/10 border-t-white/40 rounded-full animate-spin" />
                <span className="text-white/30 text-sm font-light tracking-wide">Initializing globe...</span>
            </div>
        </div>
    ),
})

export default function Home() {
    const { setUserLocation } = useNotesStore()

    // Get user geolocation
    useEffect(() => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setUserLocation(pos.coords.latitude, pos.coords.longitude),
                () => setUserLocation(40.7128, -74.0060) // NYC fallback
            )
        }
    }, [setUserLocation])

    return (
        <main className="relative w-screen h-screen overflow-hidden bg-black">
            {/* 3D Globe */}
            <GlobeScene />

            {/* UI Overlays */}
            <Header />
            <ActiveNotes />
            <NoteInput />
        </main>
    )
}
