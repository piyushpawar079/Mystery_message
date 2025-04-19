'use client'

import MessageCard from '@/components/MessageCard'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Message } from '@/models/User.models'
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { Loader2, RefreshCcw } from 'lucide-react'
import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

const Dashboard = () => {

  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId))
  }

  const { data: session } = useSession()

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema)
  })

  const { register, watch, setValue } = form

  const acceptMessages = watch('acceptMessages')

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true)

    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages')
      setValue('acceptMessages', response.data.isAcceptingMessages!!)
    } catch (error) {
      toast('Failed to load message settings')
    } finally{
      setIsSwitchLoading(false)
    }
  }, [setValue])

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsSwitchLoading(true)
    setIsLoading(true)

    try {
      const response = await axios.get('/api/get-messages')
      setMessages(response.data.messages)
      if(refresh){
        toast("Showing latest messages")
      }
    } catch (error) {
      toast('failed to load messages')
    } finally{
      setIsLoading(false)
      setIsSwitchLoading(false)
    }
  }
  , [setIsLoading, setMessages])

  useEffect(() => {
    if (!session || !session.user) return

    fetchMessages()
    fetchAcceptMessage()

  }, [session, setValue, fetchAcceptMessage, fetchMessages])


  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages',{ 
        acceptMessages: !acceptMessages
      })
      setValue('acceptMessages', !acceptMessages)
    } catch (error) {
      toast('failed to switch acceptance status')
    }
  }

  let profileURL = ''
  if (session && session.user) {
    const { username } = session?.user!!
    const baseURL = `${window.location.protocol}//${window.location.host}`
    profileURL = `${baseURL}/u/${username}`
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileURL)
    toast('URL Coppied to clipboard')
  }

  if (!session || !session.user) {
    return <div>Please login</div>
  }

  return (
    <div className='my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl'>
      <h1 className='mb-4 text-4xl font-bold'>User Dashboard</h1>
      <div className='mb-4'>
        <h2 className='mb-2 text-lg font-semibold'>
          Copy your unique link{' '}
        </h2>
        <div className='flex items-center'>
          <input 
            type="text" 
            value={profileURL}
            disabled
            className='input mr-2 p-2 input-bordered w-full'
          />
          <Button onClick={copyToClipboard}>COPY</Button>
        </div>
      </div>

      <div>
        <Switch
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className='ml-2'>
          Accept Message {acceptMessages ? 'On' : "Off"}
        </span>
      </div>
      
      <Separator />

      <Button 
        className='mt-4'
        variant={'outline'}
        onClick={(e) => {
          e.preventDefault()
          fetchMessages(true)
        }}
      >
        {
          isLoading ? (
            <Loader2 className='w-4 h-4 animate-spin'/>
          ) : (
            <RefreshCcw className='w-4 h-4'/> 
          )
        }
      </Button>

      <div className='mt-4 grid grid-cols-1 md:grid-cols-2 gap-6'>
        { messages.length > 0 ? (
            messages.map((message, index) => (
              <MessageCard 
                message={message}
                key={index}
                onMessageDelete={handleDeleteMessage}
              /> 
            ))
          ) : (
            <p>No Messages to display</p>
          )
        }
      </div>

    </div>
  )
}

export default Dashboard