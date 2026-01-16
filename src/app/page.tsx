'use client'

import dynamic from 'next/dynamic'
import { NoteInput } from '@/components/NoteInput'
import { Header } from '@/components/Header'
import { ActiveNotes } from '@/components/ActiveNotes'

// Dynamic import to avoid SSR issues with Three.js
const GlobeScene = dynamic(() => import('@/components/GlobeScene'), {
    ssr: false,
    loading: () => (
        <div className="fixed inset-0 bg-black flex items-center justify-center">
            <div className="text-white/50 text-lg animate-pulse">Loading globe...</div>
        </div>
    ),
})

export default function Home() {
    return (
        <main className="relative min-h-screen overflow-hidden">
            {/* 3D Globe Background */}
            <div className="globe-container">
                <GlobeScene />
            </div>

            {/* UI Overlays */}
            <Header />
            <ActiveNotes />
            <NoteInput />
        </main>
    )
}
