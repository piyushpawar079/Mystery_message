import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.models";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request){

    await dbConnect()

    try {
        
        const { searchParams } = new URL(request.url)
        console.log(searchParams)
        const queryParam = {
            username: searchParams.get('username')
        }

        const result =  UsernameQuerySchema.safeParse(queryParam)
        console.log("This is the result: ", result)

        if (!result.success) {
            const usernameError = result.error.format().username?._errors || []
            return Response.json({
                success: false,
                message: usernameError?.length > 0 ? usernameError.join(', ') : 'Invalid username'
            }, {
                status: 400
            })
        }

        const { username } = result.data

        const existingUser = await UserModel.findOne({
            username, 
            isVerified: true
        })

        if (existingUser) {
            return Response.json({
                success: false,
                message: "Username already taken, please choose different username"
            }, {
                status: 402
            })
        }

        return Response.json({
            success: true,
            message: "Username is available to use"
        }, {
            status: 201
        })

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