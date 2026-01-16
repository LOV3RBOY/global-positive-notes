import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
    title: 'Global Positive Notes Exchange',
    description: 'Send anonymous positive messages to random locations around the world. Spread kindness across the globe.',
    keywords: ['positive notes', 'kindness', 'global', '3D globe', 'anonymous messages'],
    openGraph: {
        title: 'Global Positive Notes Exchange',
        description: 'Send anonymous positive messages to random locations around the world.',
        type: 'website',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className="antialiased">
                {children}
            </body>
        </html>
    )
}
