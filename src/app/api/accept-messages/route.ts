import UserModel from "@/models/User.models";
import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

export async function GET(request:Request) {
    
    await dbConnect()

    try {
        
    } catch (error) {
        console.error('Something went wrong while')
    }

}