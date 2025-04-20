'use client'

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { usePathname } from "next/navigation"

const NavBar = () => {
    const { data: session } = useSession()
    const pathname = usePathname()

    const navItems = [
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/users', label: 'Users' }
    ]

    const isActive = (path: string) => pathname === path

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold text-black hover:text-gray-700 transition">
                    Mystery Message
                </Link>

                {
                    session ? (
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600 hidden md:block">
                                Welcome, <span className="font-semibold text-black">{session.user.username}</span>
                            </span>

                            {navItems.map(({ href, label }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                                        isActive(href)
                                            ? 'bg-gray-400 text-white'
                                            : 'text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    {label}
                                </Link>
                            ))}

                            <button
                                onClick={() => signOut()}
                                className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-300 transition"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link
                            href="/sign-in"
                            className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-300 transition"
                        >
                            Login
                        </Link>
                    )
                }
            </div>
        </nav>
    )
}

export default NavBar
