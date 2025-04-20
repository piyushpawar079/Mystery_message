import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.models";

export async function GET(request: Request){

    await dbConnect()

    try {
        
        const all_users = await UserModel.find()

        if(!all_users){
            return Response.json({
                success: false,
                message: 'No user available to display'
            })
        }

        return Response.json({
            success: true,
            message: "Showing all the users.",
            users: all_users
        })

    } catch (error) {
        return Response.json({
            success: false,
            message: "error while fetching all the users from the database"
        })
    }

}