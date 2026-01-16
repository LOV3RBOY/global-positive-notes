'use client'

import { useState, useCallback, useRef } from 'react'
import { useNotesStore } from '@/store/notesStore'

export function NoteInput() {
    const [message, setMessage] = useState('')
    const [isAnimating, setIsAnimating] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const { sendNote, totalSent } = useNotesStore()

    const handleSend = useCallback(() => {
        const text = message.trim() || getRandomMessage()

        if (text) {
            setIsAnimating(true)
            sendNote(text)
            setMessage('')

            setTimeout(() => setIsAnimating(false), 800)
        }
    }, [message, sendNote])

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <div className="ui-layer bottom-12 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6">
            {/* Main input container */}
            <div className={`glass-minimal rounded-full p-2 transition-all duration-500 ${isAnimating ? 'scale-[0.98] opacity-80' : ''
                }`}>
                <div className="flex items-center gap-3">
                    {/* Search/input icon */}
                    <div className="pl-4">
                        <svg
                            className="w-5 h-5 text-white/40"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                        </svg>
                    </div>

                    {/* Input field */}
                    <input
                        ref={inputRef}
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Send a positive note to someone on Earth..."
                        className="flex-1 bg-transparent border-none outline-none text-white/90 text-sm placeholder:text-white/30 py-3"
                        maxLength={140}
                    />

                    {/* Send button */}
                    <button
                        onClick={handleSend}
                        disabled={isAnimating}
                        className={`btn-send flex items-center gap-2 ${isAnimating ? 'opacity-50' : ''
                            }`}
                    >
                        {isAnimating ? (
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white/80 rounded-full animate-spin" />
                        ) : (
                            <>
                                <span>Send</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Subtle helper text */}
            <p className="text-center text-[11px] text-white/20 mt-4 tracking-wide">
                Press Enter to send • {totalSent.toLocaleString()} notes sent worldwide
            </p>
        </div>
    )
}

function getRandomMessage(): string {
    const messages = [
        "You are loved ❤️",
        "You've got this",
        "Someone believes in you",
        "You make the world better",
        "Keep going, you're doing great",
        "You are enough",
        "Sending you strength",
        "Tomorrow holds promise",
        "You matter more than you know",
        "Your story isn't over yet",
    ]
    return messages[Math.floor(Math.random() * messages.length)]
}
