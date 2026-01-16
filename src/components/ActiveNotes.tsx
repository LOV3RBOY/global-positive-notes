'use client'

import { motion } from 'framer-motion'
import { useNotesStore } from '@/store/notesStore'

export function ActiveNotes() {
    const { flyingNotes, landedNotes, totalSent } = useNotesStore()

    return (
        <motion.div
            className="ui-layer bottom-16 right-8"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
        >
            <div className="space-y-3">
                <div className="stat-row">
                    <span className="stat-label">Sent</span>
                    <motion.span
                        className="stat-value"
                        key={totalSent}
                        initial={{ opacity: 0.5, y: -2 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {totalSent.toLocaleString()}
                    </motion.span>
                </div>

                <div className="stat-row">
                    <span className="stat-label">In Transit</span>
                    <motion.span
                        className="stat-value"
                        key={flyingNotes.length}
                        animate={{
                            color: flyingNotes.length > 0
                                ? 'rgba(255, 215, 180, 0.9)'
                                : 'rgba(255, 255, 255, 0.64)'
                        }}
                    >
                        {flyingNotes.length}
                    </motion.span>
                </div>

                <div className="stat-row">
                    <span className="stat-label">Delivered</span>
                    <span className="stat-value">{landedNotes.length}</span>
                </div>
            </div>
        </motion.div>
    )
}
