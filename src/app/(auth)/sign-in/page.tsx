'use client'

import { useSession, signIn, signOut } from "next-auth/react"

export default function Component() {

    const { data: session } = useSession();
    console.log(session)

    if (session) {
        
        return (
            <>
                Signed In as {session.user.email} <br/>
                <button onClick={() => signOut()}>Sign-Out</button>
            </>
        )

    }

    const email = 'piyushpawar079@gmail.com'

    return ( 
        <>
            Not signed In<br/>
            <button onClick={() => signIn('email', {email})}>Sign-In</button>
        </>
    )

}
