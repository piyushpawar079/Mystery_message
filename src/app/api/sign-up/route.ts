import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.models";
import bcrypt from "bcryptjs";
import { emailJSVerificationMail } from "@/helper/emailjsVarificationMail";


export async function POST(request: Request){

    await dbConnect()

    try {

        const {username, email, password} = await request.json()

        const existingVerifiedUser = await UserModel.findOne({
            username,
            isVarified: true
        })

        if (existingVerifiedUser) {
            return Response.json({
                success: false,
                message: 'User already exists'
            }, 
            {
                status: 400   
            })
        }
        
        const existingUserByEmail = await UserModel.findOne({
            email
        })

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
        
        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: "User already exists with this email"
                }, 
                {
                    status: 400    
                })
            }
            else{
                const hashedPassword = await bcrypt.hash(password, 10)
                existingUserByEmail.password = hashedPassword
                existingUserByEmail.verifyCode = verifyCode
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 2 * 60 * 60 * 1000)
                await existingUserByEmail.save()
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date(Date.now() + 2 * 60 * 60 * 1000)

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                message: []
            })

            await newUser.save()
        }

        // const emailResponse = await emailJSVerificationMail(email, verifyCode)
        // console.log(emailResponse)
        // if (!emailResponse.success) {
        //     return Response.json({
        //         success: false,
        //         message: emailResponse.message
        //     })
        // }

        return Response.json({
            success: true,
            message: 'User registered successfully. Please verify user email',
            verificationCode: verifyCode
        },
        {
            status: 201
        })

    } catch (error) {
        return Response.json({
            success: false,
            message: 'Error registering user'
        })
    }

}

