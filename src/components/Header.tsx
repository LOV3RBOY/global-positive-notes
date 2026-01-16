'use client'

import { motion } from 'framer-motion'

export function Header() {
    return (
        <header className="ui-layer top-0 left-0 right-0 px-8 py-6">
            <motion.div
                className="flex items-center justify-between"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            >
                {/* Brand */}
                <div className="flex items-center gap-4">
                    <motion.div
                        className="w-1 h-1 rounded-full bg-[rgba(255,215,180,0.6)]"
                        animate={{
                            opacity: [0.4, 0.8, 0.4],
                            scale: [1, 1.2, 1],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                    <span className="text-display" style={{ color: 'var(--text-3)' }}>
                        Global Positive Notes
                    </span>
                </div>

                {/* Status */}
                <div className="flex items-center gap-3">
                    <motion.div
                        className="w-1 h-1 rounded-full"
                        style={{ backgroundColor: 'rgba(120, 200, 150, 0.7)' }}
                        animate={{
                            opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                    <span className="text-label">Live</span>
                </div>
            </motion.div>
        </header>
    )
}
