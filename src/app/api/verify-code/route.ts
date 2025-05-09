import UserModel from "@/models/User.models";
import dbConnect from "@/lib/dbConnect";

export async function POST(request:Request) {
    
    await dbConnect()

    try {

        const { username, code } = await request.json()
        const decodedUsername = decodeURIComponent(username)


        const existingUser = await UserModel.findOne({
            username
        })

        if (!existingUser) {
            return Response.json({
                success: false,
                message: "user doesn't exists"
            },
            {
                status: 405
            })
        }

        const isCodeCorrect = existingUser.verifyCode === code
        const isCodeValid = new Date(existingUser.verifyCodeExpiry).getTime() > new Date().getTime();

        if (!isCodeCorrect) {
            return Response.json({
                success: false,
                message: "Verification Code is not correct, please try again"
            },
            {
                status: 401
            })
        } else if (!isCodeValid){
            return Response.json({
                success: false,
                message: "Verification Code has expired, please generate a new verification code and try again"
            },
            {
                status: 401
            })
        }
        else{
            existingUser.isVerified = true
            await existingUser.save()
            return Response.json({
                success: false,
                message: "User verified successfully"
            },
            {
                status: 201
            })
        }
        
    } catch (error) {
        console.error("Error while verifying user code ", error)
        return Response.json({
            success: false,
            message: "Error while verifying user code"
        },
        {
            status: 500
        })
    }

}