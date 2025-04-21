// import emailjs from 'emailjs-com';
// import { ApiResponse } from '@/types/ApiResponse';

// // Optional: store these in ENV for security
// const SERVICE_ID = process.env.SERVICE_ID!;
// const TEMPLATE_ID = process.env.TEMPLATE_ID!;
// const PUBLIC_KEY = process.env.PUBLIC_KEY!;

// export async function emailJSVerificationMail(
//   email: string,
//   verifyCode: string
// ): Promise<ApiResponse> {
//   try {
//     const templateParams = {
//       validation: "2hrs",
//       passcode: verifyCode,
//       email: email
//     };

//     const response = await emailjs.send(
//       SERVICE_ID,
//       TEMPLATE_ID,
//       templateParams,
//       PUBLIC_KEY
//     );

//     if (response.status === 200) {
//       return {
//         success: true,
//         message: 'Verification email sent successfully'
//       };
//     } else {
//       return {
//         success: false,
//         message: 'Failed to send verification email'
//       };
//     }
//   } catch (error) {
//     console.error('EmailJS Error:', error);
//     return {
//       success: false,
//       message: 'Error sending verification email'
//     };
//   }
// }

// utils/sendVerificationEmail.ts
import emailjs from '@emailjs/browser';

export const emailJSVerificationMail = async (email: string, code: string) => {
  try {
    const result = await emailjs.send(
        process.env.NEXT_PUBLIC_SERVICE_ID!!,
      process.env.NEXT_PUBLIC_TEMPLATE_ID!!,
      {
        validation: "2hrs",
        passcode: code,
        email: email
      },
      process.env.NEXT_PUBLIC_PUBLIC_KEY!!
    );
    return { success: true, result };
  } catch (error) {
    console.error('EmailJS error:', error);
    return { success: false, message: 'Error sending verification email' };
  }
};
