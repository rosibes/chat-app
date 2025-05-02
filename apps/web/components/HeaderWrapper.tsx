'use client'
import { usePathname } from 'next/navigation'
import { Header } from './Header'
import { useEffect, useState } from 'react'

export function HeaderWrapper() {
    const pathname = usePathname()
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
        // Verifică token-ul la montare și la schimbarea rutei
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
        setIsAuthenticated(!!token)
    }, [pathname])

    if (pathname === '/signup' || pathname === '/signin') {
        return null
    }

    return <Header isAuthenticated={isAuthenticated} />
}