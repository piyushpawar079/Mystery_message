import dbConnect from "@/lib/dbConnect";
import UserModel, { Message } from "@/models/User.models";

export async function POST(request: Request){

    await dbConnect()

    try {
        
        const { username, content } = await request.json()

        const user = await UserModel.findOne({ username })

        if (!user) {
            return Response.json({
                success: false,
                message: "User not found in the database"
            },
            {
                status: 404
            })
        }
        else if (!user.isAcceptingMessages){
            return Response.json({
                success: false,
                message: "User is not accepting messages currently"
            })
        }

        const newMessage = { content, createdAt: new Date()}

        user.message.push(newMessage as Message)

        await user.save()

        return Response.json({
            success: true,
            message: "Message send successfully"
        },
        {
            status: 201
        })

    } catch (error) {
        return Response.json({
            success: false,
            message: "Error while sending message"
        },
        {
            status: 500
        })
    }

}