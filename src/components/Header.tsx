'use client'

export function Header() {
    return (
        <header className="ui-overlay top-0 left-0 right-0 p-6">
            <div className="flex items-center justify-between">
                {/* Logo / Title */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center">
                        <span className="text-xl">🌍</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold text-white glow-text">
                            Global Positive Notes
                        </h1>
                        <p className="text-xs text-white/40">Spreading kindness worldwide</p>
                    </div>
                </div>

                {/* Right side info */}
                <div className="glass-subtle px-4 py-2 rounded-full">
                    <span className="text-sm text-white/60 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                        Live
                    </span>
                </div>
            </div>
        </header>
    )
}
