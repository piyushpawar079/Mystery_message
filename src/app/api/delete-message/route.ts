import dbConnect from "@/lib/dbConnect";

export async function DELETE(request: Request){

    await dbConnect()

    try {
        
        const { searchParams } = new URL(request.url)
        const queryParam = {
            messageId: searchParams.get('messageId')
        }

        

    } catch (error) {   
        
    }

}