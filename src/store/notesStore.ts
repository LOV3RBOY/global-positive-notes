import { create } from 'zustand'

export interface Note {
    id: string
    message: string
    startLat: number
    startLng: number
    endLat: number
    endLng: number
    timestamp: number
    status: 'flying' | 'landed'
    color: string
}

export interface LandedNote {
    id: string
    message: string
    lat: number
    lng: number
    timestamp: number
}

interface NotesState {
    flyingNotes: Note[]
    landedNotes: LandedNote[]
    userLocation: { lat: number; lng: number } | null
    totalSent: number

    // Actions
    sendNote: (message: string) => void
    landNote: (id: string) => void
    removeFlying: (id: string) => void
    setUserLocation: (lat: number, lng: number) => void
}

// Generate random earth coordinates
const randomCoords = () => ({
    lat: (Math.random() - 0.5) * 160, // -80 to 80
    lng: (Math.random() - 0.5) * 360, // -180 to 180
})

// Generate a gradient color for the arc
const arcColors = [
    '#667eea', '#764ba2', '#f093fb', '#f5576c',
    '#4facfe', '#00f2fe', '#43e97b', '#38f9d7',
    '#fa709a', '#fee140', '#a8edea', '#fed6e3',
]

const randomColor = () => arcColors[Math.floor(Math.random() * arcColors.length)]

export const useNotesStore = create<NotesState>((set, get) => ({
    flyingNotes: [],
    landedNotes: [],
    userLocation: null,
    totalSent: 0,

    sendNote: (message: string) => {
        const state = get()
        const start = state.userLocation || randomCoords()
        const end = randomCoords()

        const newNote: Note = {
            id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            message,
            startLat: start.lat,
            startLng: start.lng,
            endLat: end.lat,
            endLng: end.lng,
            timestamp: Date.now(),
            status: 'flying',
            color: randomColor(),
        }

        set(state => ({
            flyingNotes: [...state.flyingNotes, newNote],
            totalSent: state.totalSent + 1,
        }))

        // Auto-land after flight duration (matches arc animation)
        setTimeout(() => {
            get().landNote(newNote.id)
        }, 3000)
    },

    landNote: (id: string) => {
        set(state => {
            const note = state.flyingNotes.find(n => n.id === id)
            if (!note) return state

            const landedNote: LandedNote = {
                id: note.id,
                message: note.message,
                lat: note.endLat,
                lng: note.endLng,
                timestamp: Date.now(),
            }

            return {
                flyingNotes: state.flyingNotes.filter(n => n.id !== id),
                landedNotes: [...state.landedNotes.slice(-50), landedNote], // Keep last 50
            }
        })
    },

    removeFlying: (id: string) => {
        set(state => ({
            flyingNotes: state.flyingNotes.filter(n => n.id !== id),
        }))
    },

    setUserLocation: (lat: number, lng: number) => {
        set({ userLocation: { lat, lng } })
    },
}))
