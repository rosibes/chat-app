'use client'
import { useRouter } from "next/navigation"
import { Button } from "./Button"
import Link from "next/link"

export function Header({ isAuthenticated }: { isAuthenticated: boolean }) {
    const router = useRouter()

    const handleLogout = () => {
        localStorage.removeItem("token")
        router.push("/signin")
    }

    return (
        <header className="w-full p-4 bg-purple-600 text-white flex justify-between items-center">
            <Link href="/" className="text-xl font-bold  cursor-pointer">
                Welcome
            </Link>            {isAuthenticated && (
                <Button
                    text="Logout"
                    onClick={handleLogout}
                    color="red"
                    size="sm"
                />
            )}
        </header>
    )
}