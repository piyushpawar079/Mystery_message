import UserModel from "@/models/User.models";
import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";

export async function GET(request:Request) {
    
    await dbConnect()

    try {

        const userSession = await getServerSession(authOptions)

        console.log(userSession)

        if (!userSession || !userSession.user) {
            return Response.json({
                success: false,
                message: 'Login first'
            }, 
            {
                status: 400
            })
        } 

        const userId = new mongoose.Types.ObjectId(userSession.user._id)

        const user = await UserModel.aggregate([
            {
                $match: {
                    _id: userId
                }
            },
            {
                $unwind: '$messages'
            },
            {
                $sort: {
                    'message.createdAt': -1
                }
            },
            {
                $group: {
                    _id: '$_id',
                    messages: {
                        $push: '$messages'
                    }
                }
            }
        ])

        if (!user || user.length == 0) {
            return Response.json({
                success: false,
                message: "User not found in the database"
            },
            {
                status: 404
            })
        }

        console.log("aggrigation pipeline response: ", user)

        return Response.json({
            success: true,
            message: "All Messages",
            messasges: user[0].messages
        },
        {
            status: 201
        })
        
    } catch (error) {
        console.error('Error in fetching all messages')

        return Response.json({
            success: false,
            message: "Error in fetching all messages"
        },
        {
            status: 500
        })
    }

}
