import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import dbConnect from "@/lib/dbConnect";
import bcrypt from "bcryptjs";
import UserModel from "@/models/User.models";

export const authOptions: NextAuthOptions = {
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: "Username", type: "text", placeholder: "Username" },
                password: { label: "Password", type: "password", placeholder: "Password"  },
                email: {label: "Email", type: "email", placeholder: "Email"}
            },
            async authorize(credentials: any): Promise<any> {
                if (!credentials) {
                    return null
                }
                await dbConnect()

                try {
                    const existingUser = await UserModel.findOne({
                        email: credentials.identifier
                    })

                    if (!existingUser) {
                        throw new Error('No user found with this email.')
                    }


                    if (!existingUser.isVerified) {
                        throw new Error("User is not verified")
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, existingUser.password)

                    if (!isPasswordCorrect) {
                        throw new Error("Invalid Password, please try again")
                    }

                    // return existingUser
                    return {
                        _id: existingUser._id?.toString(),
                        email: existingUser.email,
                        username: existingUser.username,
                        isVerified: existingUser.isVerified,
                        isAcceptingMessages: existingUser.isAcceptingMessages
                      }
                      

                } catch (error: any) {
                    throw new Error(error)
                }
            },
        })
    ],
    callbacks: {
        async jwt({ token, user }){

            if (user) {
                token._id = user._id?.toString()
                token.isAcceptingMessages = user.isAcceptingMessages
                token.isVerified = user.isVerified
                token.username = user.username
                token.email = user.email
            }

            return token
        },
        async session({ session, token }){
            
            if (session?.user) {
                session.user._id = token._id
                session.user.isAcceptingMessages = token.isAcceptingMessages
                session.user.isVerified = token.isVerified
                session.user.username = token.username
                session.user.email = token.email
            }            
            
            return session
        }
    },
    pages: {
        signIn: '/sign-in',
    },
    secret: process.env.NEXTAUTH_SECRET
}

