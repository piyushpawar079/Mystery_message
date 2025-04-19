'use client'

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@react-email/components"

const NavBar = () => {

    const { data: session } = useSession()
    console.log(session)

  return (
    <nav className="p-4 md:p-6 shadow-md">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
            <a className="text-xl font-bold mb-4 md:mb-0" href={'/'}>
                Mystery Message
            </a>
            {
                session ? (
                    <>
                        <span className="mr-4 ">Welcome, {session.user.username}</span>
                        <Button className="w-full md:w-auto" onClick={() => signOut()} >Logout</Button>
                    </>
                ) : (
                    <Link href={'/sign-in'} className="cursor-pointer">
                        Login 
                    </Link>
                ) 
            }
        </div>
    </nav>
  )
}

export default NavBar