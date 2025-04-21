import { resend } from '@/lib/resend'
import VerificationEmail from '../../emails/varificationEmails'
import { ApiResponse } from '@/types/ApiResponse'

export async function sendVarificationEmail(
    email: string, 
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject:'Varification code | Mistry Message ',
            react: VerificationEmail({ username, otp: verifyCode })
        })

        return {
            success: true,
            message: 'Varification email send succesfully'
        }
    } catch (emailError) {
        return {
            success: false,
            message: 'Error sending varification email'
        }

    }
}