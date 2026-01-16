'use client'

import { useNotesStore } from '@/store/notesStore'

export function ActiveNotes() {
    const { flyingNotes, landedNotes, totalSent } = useNotesStore()

    return (
        <div className="ui-layer bottom-12 right-8">
            {/* Stats panel - minimal like Google Research */}
            <div className="stats-panel text-right space-y-1">
                <div>
                    <span className="label">Notes Sent</span>
                    <span className="value">{totalSent.toLocaleString()}</span>
                </div>
                <div>
                    <span className="label">In Flight</span>
                    <span className="value">{flyingNotes.length}</span>
                </div>
                <div>
                    <span className="label">Landed</span>
                    <span className="value">{landedNotes.length}</span>
                </div>
            </div>
        </div>
    )
}
