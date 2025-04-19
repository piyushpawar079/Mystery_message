'use client'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { messageSchema } from '@/schemas/messageSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import * as z from 'zod'
import { Loader2 } from 'lucide-react'
import { useParams } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

const SendingMessage = () => {

  const params = useParams()
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema)
  });

  const [message, setMessage] = useState('')
  const [isSendingMessage, setIsSendingMessage] = useState(false)
  const [messageStatus, setMessageStatus] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const onSubmit = async () => {
    setIsSendingMessage(true)
    setIsSuccess(false)
    try {
    if (message) {
        const response = await axios.post('/api/send-message',{
            username: params.username,
            content: message
        })
        console.log(response)
        setIsSuccess(response.data.success)
        setMessageStatus(response.data.message)
        toast(response.data.message)
    }
    } catch (error) {
        toast(`Something went wrong while sending message to the ${params.username}`)
    } finally{
        setIsSendingMessage(false)
    }
  }
  
return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">Send Anonymous Message</h1>
            <p className="text-sm text-gray-600 mb-6 text-center">
                Send an anonymous message to <span className="font-semibold">@{params.username}</span>
            </p>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        name="content"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        placeholder="Write your anonymous message here..."
                                        {...field}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            setMessage(e.target.value);
                                        }}
                                        className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </FormControl>
                                {isSendingMessage && (
                                    <div className="flex justify-center mt-2">
                                        <Loader2 className="animate-spin text-blue-500" />
                                    </div>
                                )}
                                {messageStatus && (
                                    <p
                                        className={`text-sm mt-2 text-center ${
                                            isSuccess ? 'text-green-500' : 'text-red-500'
                                        }`}
                                    >
                                        {messageStatus}
                                    </p>
                                )}
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition duration-200"
                        disabled={isSendingMessage}
                    >
                        {isSendingMessage ? 'Sending...' : 'Send it'}
                    </Button>
                </form>
            </Form>
        </div>
    </div>
);
}

export default SendingMessage