'use client'

import {
Card,
CardContent,
CardHeader,
CardTitle,
} from "@/components/ui/card"

import {
AlertDialog,
AlertDialogAction,
AlertDialogCancel,
AlertDialogContent,
AlertDialogDescription,
AlertDialogFooter,
AlertDialogHeader,
AlertDialogTitle,
AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "./ui/button"
import { X } from "lucide-react"
import { Message } from "@/models/User.models"
import axios from "axios"
import { toast } from "sonner"

type MessageCardProps = {
    message: Message;
    onMessageDelete: (messageId: string) => void
}

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {

    const handleDeleteConfirmed = async () => {
        try {
            const response = await axios.delete(`/api/delete-message/${message._id}`)

            toast(response.data.message)

        } catch (error) {
            toast('Something went wrong while deleting a message')
        }
        onMessageDelete(message._id)
    }

  return (
    <Card>
    <CardHeader>
        <CardTitle className="mb-5 ">{message.content}</CardTitle>
        <AlertDialog>
        <AlertDialogTrigger asChild>
            <Button variant="outline"><X className="w-5 h-5" /></Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirmed}>Delete</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
        </AlertDialog>
    </CardHeader>
    <CardContent>
    </CardContent>
    </Card>

  )
}

export default MessageCard