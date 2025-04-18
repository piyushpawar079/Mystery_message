'use client'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from "sonner"  
import { useRouter } from 'next/navigation'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { signInSchema } from '@/schemas/signInSchema'
import { signIn } from 'next-auth/react'

export default function Component() {

    const [isSubmitting, setIsSubmitting] = useState(false)

    const router = useRouter()

    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: '',
            password: ''
        }
    })

    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        setIsSubmitting(true)
        try {
            const result = await signIn('credentials', {
                identifier: data.identifier,
                password: data.password
            })
            console.log("This is the sign in result: ", result)
            if(result?.error){
                toast("There is some issue while loggin in.")
            }
            if(result?.url){
                router.replace('/dashboard')
            }
        } catch (error) {
            toast('Something went wrong while loggin In.')
        } finally{
            setIsSubmitting(false)
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
                        Sign In to start your anonymous adventure
                    </p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                        <FormField
                        name="identifier"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Email/Username</FormLabel>
                            <FormControl>
                                <Input placeholder="Email/Username"
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
                                ) : ("Sign In")
                            }
                        </Button>
                    </form>
                </Form>
                <div className='text-center mt-4'>
                    <p>
                        Want to make a new account?{' '}
                        <Link href="/sign-up" className='text-blue-600 hover:text-blue-800'>
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
