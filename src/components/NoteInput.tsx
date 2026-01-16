'use client'

import { useState, useCallback } from 'react'
import { useNotesStore } from '@/store/notesStore'

const placeholderMessages = [
    "You are loved ❤️",
    "You've got this!",
    "Someone is thinking of you",
    "You make the world better",
    "Keep shining ✨",
    "You are enough",
    "Sending you strength",
    "Tomorrow will be beautiful",
]

export function NoteInput() {
    const [message, setMessage] = useState('')
    const [isAnimating, setIsAnimating] = useState(false)
    const { sendNote, totalSent } = useNotesStore()

    const handleSend = useCallback(() => {
        const text = message.trim() || placeholderMessages[Math.floor(Math.random() * placeholderMessages.length)]

        if (text) {
            setIsAnimating(true)
            sendNote(text)
            setMessage('')

            // Reset animation state
            setTimeout(() => setIsAnimating(false), 1000)
        }
    }, [message, sendNote])

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <div className="ui-overlay bottom-8 left-1/2 -translate-x-1/2 w-full max-w-lg px-4">
            <div className={`glass glow-border p-6 transition-all duration-500 ${isAnimating ? 'scale-95 opacity-80' : ''}`}>
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium text-white/90">Send a Positive Note</h2>
                    <span className="text-sm text-white/40">
                        {totalSent.toLocaleString()} sent worldwide
                    </span>
                </div>

                {/* Input */}
                <div className="relative">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your message or press send for a random note..."
                        className="input-glass pr-24"
                        maxLength={140}
                    />

                    {/* Send Button */}
                    <button
                        onClick={handleSend}
                        disabled={isAnimating}
                        className={`absolute right-2 top-1/2 -translate-y-1/2 btn-glow py-2 px-4 text-sm ${isAnimating ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                    >
                        {isAnimating ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Sending
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                Send
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </span>
                        )}
                    </button>
                </div>

                {/* Helper text */}
                <p className="text-xs text-white/30 mt-3 text-center">
                    Your note will travel to a random location on Earth
                </p>
            </div>
        </div>
    )
}
