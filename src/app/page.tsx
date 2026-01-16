'use client'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { NoteInput } from '@/components/NoteInput'
import { Header } from '@/components/Header'
import { ActiveNotes } from '@/components/ActiveNotes'

const GlobeScene = dynamic(() => import('@/components/GlobeScene'), {
    ssr: false,
    loading: () => (
        <div className="globe-viewport">
            <motion.div
                className="flex flex-col items-center gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                <div className="loader" />
                <span className="text-label">Initializing</span>
            </motion.div>
        </div>
    ),
})

export default function Home() {
    return (
        <main className="relative w-screen h-screen overflow-hidden bg-black">
            {/* Subtle vignette overlay */}
            <div
                className="fixed inset-0 pointer-events-none z-5"
                style={{
                    background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)',
                }}
            />

            {/* 3D Globe */}
            <GlobeScene />

            {/* UI Layers */}
            <Header />
            <ActiveNotes />
            <NoteInput />
        </main>
    )
}
