'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNotesStore } from '@/store/notesStore'

const MESSAGES = [
    "You are enough",
    "Someone believes in you",
    "Your presence matters",
    "You bring light to others",
    "Keep going, you're doing beautifully",
    "The world is better with you in it",
    "You are worthy of love",
    "Your story is still being written",
]

export function NoteInput() {
    const [message, setMessage] = useState('')
    const [isSending, setIsSending] = useState(false)
    const [recentlySent, setRecentlySent] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const { sendNote, totalSent } = useNotesStore()

    const handleSend = useCallback(async () => {
        if (isSending) return

        const text = message.trim() || MESSAGES[Math.floor(Math.random() * MESSAGES.length)]

        setIsSending(true)

        // Sophisticated delay for visual feedback
        await new Promise(resolve => setTimeout(resolve, 600))

        sendNote(text)
        setMessage('')
        setIsSending(false)
        setRecentlySent(true)

        // Reset the success state
        setTimeout(() => setRecentlySent(false), 2000)
    }, [message, sendNote, isSending])

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey && !isSending) {
            e.preventDefault()
            handleSend()
        }
    }

    // Focus input on mount
    useEffect(() => {
        const timer = setTimeout(() => inputRef.current?.focus(), 1000)
        return () => clearTimeout(timer)
    }, [])

    return (
        <div className="ui-layer bottom-16 left-1/2 -translate-x-1/2 w-full max-w-xl px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
            >
                {/* Input container */}
                <motion.div
                    className="input-container"
                    animate={{
                        scale: isSending ? 0.98 : 1,
                        opacity: isSending ? 0.8 : 1,
                    }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                    {/* Subtle accent indicator */}
                    <motion.div
                        className="w-1.5 h-1.5 rounded-full"
                        animate={{
                            backgroundColor: recentlySent
                                ? 'rgba(120, 200, 150, 0.8)'
                                : 'rgba(255, 215, 180, 0.5)',
                            boxShadow: recentlySent
                                ? '0 0 12px rgba(120, 200, 150, 0.5)'
                                : '0 0 8px rgba(255, 215, 180, 0.3)',
                        }}
                        transition={{ duration: 0.6 }}
                    />

                    {/* Input field */}
                    <input
                        ref={inputRef}
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Share something kind with the world..."
                        className="input-field"
                        maxLength={120}
                        disabled={isSending}
                    />

                    {/* Send button */}
                    <motion.button
                        onClick={handleSend}
                        disabled={isSending}
                        className="btn-primary"
                        whileTap={{ scale: 0.96 }}
                        transition={{ duration: 0.1 }}
                    >
                        <AnimatePresence mode="wait">
                            {isSending ? (
                                <motion.div
                                    key="loading"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.2 }}
                                    className="loader"
                                />
                            ) : (
                                <motion.span
                                    key="text"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    Send
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </motion.button>
                </motion.div>

                {/* Status text */}
                <motion.div
                    className="mt-6 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                >
                    <AnimatePresence mode="wait">
                        {recentlySent ? (
                            <motion.p
                                key="success"
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -4 }}
                                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                className="text-caption"
                                style={{ color: 'rgba(120, 200, 150, 0.7)' }}
                            >
                                Note sent across the globe
                            </motion.p>
                        ) : (
                            <motion.p
                                key="hint"
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -4 }}
                                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                className="text-caption"
                            >
                                Press Enter to send · {totalSent.toLocaleString()} notes shared
                            </motion.p>
                        )}
                    </AnimatePresence>
                </motion.div>
            </motion.div>
        </div>
    )
}
