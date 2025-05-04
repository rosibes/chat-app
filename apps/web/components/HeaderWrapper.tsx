'use client'
import { usePathname } from 'next/navigation'
import { Header } from './Header'
import { useEffect, useState } from 'react'
import { isTokenExpired } from '../utils/token'

export function HeaderWrapper() {
    const pathname = usePathname()
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

        if (!token || isTokenExpired(token)) {
            setIsAuthenticated(false);
            localStorage.removeItem('token');
        } else {
            setIsAuthenticated(true);
        }
    }, [pathname])


    if (pathname === '/signup' || pathname === '/signin') {
        return null
    }

    return <Header isAuthenticated={isAuthenticated} />
}