'use client'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import axios, { AxiosError, toFormData } from 'axios'
import { useEffect, useState } from 'react'
import { useDebounceCallback } from 'usehooks-ts'
import { toast } from "sonner"  
import { useRouter } from 'next/navigation'
import { signUpSchema } from '@/schemas/signUpSchema'
import { ApiError } from 'next/dist/server/api-utils'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { emailJSVerificationMail } from '@/helper/emailjsVarificationMail'

export default function Component() {

    const [username, setUsername] = useState("")
    const [usernameMessage, setUsernameMessage] = useState("")
    const [isCheckingUsername, setIsCheckingUsername] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const debounced = useDebounceCallback(setUsername, 400)
    const router = useRouter()

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        }
    })

    useEffect(() => {
        const checkUsernameUnique = async () => {
            setIsCheckingUsername(true)
            setUsernameMessage('')
            setIsSuccess(false)
            try {
                if(username){
                    const response = await axios.get(`api/check-username-unique?username=${username}`)
                    if (response.data.success) {
                        setUsernameMessage(response.data.message)
                        setIsSuccess(response.data.success)
                    } else {
                        console.log("This is the main error: ", response)
                    }
                }

            } catch (error) {
                const axiosError = error as AxiosError<ApiError>
                setUsernameMessage(
                    axiosError.response?.data.message ?? "Error checking the username"
                )
            }
            finally{
                setIsCheckingUsername(false)
            }
        }

        checkUsernameUnique()
    }
    , [username])

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {

        setIsCheckingUsername(true)
        setIsSuccess(false)
        setUsernameMessage('')
        try {
            const response = await axios.post('/api/sign-up', data)
            // toast(response.data.message)
            // setIsSuccess(response.data.success)
            // router.replace(`/verify-code/${username}`)
            // setIsSubmitting(false)


            const emailResult = await emailJSVerificationMail(data.email, response.data.verificationCode)


            if (!emailResult.success) {
            toast('Error sending verification email')
            return
            }

            toast(response.data.message)
            setIsSuccess(true)
            router.replace(`/verify-code/${data.username}`)

        } catch (error) {
            console.log(error)
            const axiosError = error as AxiosError<ApiError>
            const errorMessage = axiosError.response?.data.message 
            toast(errorMessage)
        } finally{
            setIsCheckingUsername(false)
        }        
    }
    
    return ( 
        <div className='flex justify-center items-center min-h-screen bg-gray-100'>
            <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
                <div className='text-center'>
                    <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>
                        Join Mystery Message
                    </h1>
                    <p className='mb-4'>
                        Sign Up to start your anonymous adventure
                    </p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                        <FormField
                        name="username"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input placeholder="Username"
                                {...field}
                                onChange={(e) => {
                                    field.onChange(e)
                                    debounced(e.target.value)
                                }}
                                />
                            </FormControl>
                            {
                                isCheckingUsername && 
                                <Loader2 className='animate-spin'/>
                            }
                            {
                                usernameMessage && 
                                <p className={`text-sm ${isSuccess ? 'text-green-500' : 'text-red-500'}`}>
                                    {usernameMessage}
                                </p>
                            }
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        name="email"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="Email"
                                {...field}
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        name="password"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type='password' placeholder="Password"
                                {...field}
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <Button>
                            { 
                                isSubmitting ? (
                                    <>
                                        <Loader2 className='mr-2 h-6 w-4 animate-spin' /> Please Wait
                                    </>
                                ) : ("Sign Up")
                            }
                        </Button>
                    </form>
                </Form>
                <div className='text-center mt-4'>
                    <p>
                        Already a member?{' '}
                        <Link href="/sign-in" className='text-blue-600 hover:text-blue-800'>
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
