import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/models/User.models";

export async function DELETE(request: Request){

    await dbConnect()

    try {
        
        const { searchParams } = new URL(request.url)
        const queryParam = {
            messageId: searchParams.get('messageId')
        }

        console.log(searchParams, queryParam)

        const sessions = await getServerSession(authOptions)
        console.log(sessions)
        if (!sessions || !sessions.user) {
            return Response.json({
                success: false,
                message: "Login First"
            })
        }

        const userId = sessions.user._id

        const user = await UserModel.findById(userId)

        if (!user) {
            return Response.json({
                success: false,
                message: "User not found in the database."
            })
        }

        console.log("This is the messages of a certain user", user.message)

        const filtered_messages = user.message.filter((message) => message._id.toString() !== queryParam.messageId )

        console.log("This are the filtered messages", filtered_messages)

        user.message = filtered_messages
        await user.save()

        return Response.json({
            success: true,
            message: "The message is deleted successfully"
        })

    } catch (error) {   
        return Response.json({
            success: false,
            message: "Something went wrong while deleting message"
        })
    }

}