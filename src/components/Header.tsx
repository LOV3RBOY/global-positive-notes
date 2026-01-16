'use client'

export function Header() {
    return (
        <header className="ui-layer top-0 left-0 right-0 p-6">
            <div className="flex items-center justify-between">
                {/* Minimal logo */}
                <div className="flex items-center gap-3">
                    <span className="text-sm font-light tracking-wider text-white/60">
                        Global Positive Notes
                    </span>
                </div>

                {/* Right side - live indicator */}
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80 animate-subtle-pulse" />
                        <span className="text-xs text-white/40 font-light tracking-wide">Live</span>
                    </div>
                </div>
            </div>
        </header>
    )
}
