"use client"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { verifyCodeSchema } from '@/schemas/verifyCodeSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@react-email/components'
import axios, { AxiosError } from 'axios'
import { ApiError } from 'next/dist/server/api-utils'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

const VerifyCode = () => {

    const params = useParams()
    const router = useRouter()

    const form = useForm<z.infer<typeof verifyCodeSchema>>({
        resolver: zodResolver(verifyCodeSchema)
    })

    const onSubmit = async (data: z.infer<typeof verifyCodeSchema>) => {

        try {
            const response = await axios.post('/api/verify-code', {
                username: params.username,
                code: data.code
            })

            console.log(response)
            toast(response.data.message)

            router.replace('/sign-in')

        } catch (error) {
            console.log("This is the error ", error)
            const axiosError = error as AxiosError<ApiError>
            const errorMessage = axiosError.response?.data.message 
            toast(errorMessage)
        }

    }

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
        <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
            <div className='text-center'>
                <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>
                    Verify Your account
                </h1>
                <p className='mb-4'>
                    Enter the verification code sent to your email
                </p>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Verification Code</FormLabel>
                        <FormControl>
                            <Input placeholder="verification code" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <Button type="submit" className='cursor-pointer'>Submit</Button>
                </form>
            </Form>
        </div>
    </div>
  )
}

export default VerifyCode