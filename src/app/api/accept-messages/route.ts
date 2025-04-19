import UserModel from "@/models/User.models";
import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

export async function GET(request:Request) {
    
    await dbConnect()

    try {

        const userSession = await getServerSession(authOptions)


        if (!userSession || !userSession.user) {
            return Response.json({
                success: false,
                message: 'Login first'
            }, 
            {
                status: 400
            })
        } 

        const userId = userSession.user._id

        const user = await UserModel.findById(userId)

        if (!user) {
            return Response.json({
                success: false,
                message: "User not found in the database"
            },
            {
                status: 404
            })
        }


        return Response.json({
            success: true,
            message: "User message acceptance prefference.",
            isAcceptingMessages: user.isAcceptingMessages
        },
        {
            status: 201
        })
        
    } catch (error) {
        console.error('Error in getting message acceptance status')

        return Response.json({
            success: false,
            message: "Error in getting message acceptance status"
        },
        {
            status: 500
        })
    }

}


// POST method to toggle accept message option
export async function POST(request: Request){

    await dbConnect()

    try {

        const userSession = await getServerSession(authOptions)
        const { acceptMessages } = await request.json()

        if (!userSession || !userSession.user) {
            return Response.json({
                success: false,
                message: 'Login first'
            }, 
            {
                status: 401
            })
        }        

        const userId = userSession.user._id

        const dbUser = await UserModel.findByIdAndUpdate(
            userId,
            {isAcceptingMessages: acceptMessages},
            {new: true}
        )

        if (!dbUser) {
            return Response.json({
                success: false,
                message: "User not found in the database"
            },
            {
                status: 404
            })
        }

        return Response.json({
            success: true,
            message: "Message acceptance status updated successfully",
            dbUser
        },
        {
            status: 200
        })
        
    } catch (error) {
        console.error('Failed to update user status for accept messages')

        return Response.json({
            success: false,
            message: "Failed to update user status for accept messages"
        },
        {
            status: 500
        })
    }
}