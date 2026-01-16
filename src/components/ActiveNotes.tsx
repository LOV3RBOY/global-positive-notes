'use client'

import { useNotesStore } from '@/store/notesStore'

export function ActiveNotes() {
    const { flyingNotes, landedNotes } = useNotesStore()

    if (flyingNotes.length === 0 && landedNotes.length === 0) {
        return null
    }

    return (
        <div className="ui-overlay top-24 right-6 max-w-xs">
            {/* Flying notes indicator */}
            {flyingNotes.length > 0 && (
                <div className="glass-subtle p-4 rounded-2xl mb-3 animate-pulse">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#667eea] to-[#764ba2] flex items-center justify-center">
                            <svg className="w-4 h-4 text-white animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-white">
                                {flyingNotes.length} note{flyingNotes.length !== 1 ? 's' : ''} in flight
                            </p>
                            <p className="text-xs text-white/40">Traveling across the globe</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Recent landed notes */}
            {landedNotes.length > 0 && (
                <div className="glass-subtle p-4 rounded-2xl max-h-48 overflow-y-auto no-scrollbar">
                    <h3 className="text-xs font-medium text-white/60 uppercase tracking-wider mb-3">
                        Recent Arrivals
                    </h3>
                    <div className="space-y-2">
                        {landedNotes.slice(-3).reverse().map((note) => (
                            <div
                                key={note.id}
                                className="text-sm text-white/80 p-2 rounded-lg bg-white/5 truncate"
                            >
                                "{note.message}"
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
