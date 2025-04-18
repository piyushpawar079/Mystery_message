import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth"{
    interface Session {
        user: {
            _id: string,
            isVerified: boolean,
            isAcceptingMessages: boolean,
            username: string,
            email: string
        } & DefaultSession
    } 
    interface User extends DefaultUser{
        _id: string,
        isVerified: boolean,
        isAcceptingMessages: boolean,
        username: string,
        email: string
    }
}

declare module 'next-auth/jwt'{
    interface JWT extends DefaultJWT{
        _id: string,
        isVerified: boolean,
        isAcceptingMessages: boolean,
        username: string,
        email: string
    }
}