import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.models";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export default async function GET(request: Request){
    await dbConnect()

    try {
        
        const { searchParams } = new URL(request.url)
        console.log(searchParams)
        const queryParam = {
            username: searchParams.get('username')
        }

    } catch (error) {
        console.error("Error while checking username ", error)
        return Response.json({
            success: false,
            message: "Error checking username"
        },
    {
        status: 500
    })
    }

}