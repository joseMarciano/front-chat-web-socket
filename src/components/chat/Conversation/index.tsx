import { Button, Input } from 'antd'
import { useState } from 'react'
import { sockClient } from '../../../config/SockJS'

import './style.css'


type Friend = {
    id: string,
    name: string,
    email: string,
    friends: string[],
}

type User = {
    id: string,
    name: string,
    email: string,
    friends: string[],
}

type Message = {
    id: string
    from: string
    to: string
    content: string
    date: Date
    status: string
}

type ConversationProps = {
    friend?: Friend,
    user?: User
    messages?: Message[]
    setMessages: (messages: Message[]) => void
}


export function Conversation({ friend, user, messages, setMessages }: ConversationProps) {
    const [message, setMessage] = useState('');
    if (!friend || !user) return <></>




    const sendMessageToFriend = () => {
        
        const body = {
            content: message,
            from: user.id,
            to: friend.id
        }
        sockClient.send('/app/send-message', { body })
        messages?.push(body as Message)

        setMessages([...messages as any] )
    }

    return (
        <>
            <header className='header_conversation'>
                {friend.name}
            </header>
            <div className='content_conversation'>
                { messages?.map((m, index) =>(
                    <span key={index} className={user.id === m.from ? 'self': ''}>
                        {m.content}
                    </span>
                ))}
            </div>

            <div className='input_conversation'>
                <Input style={{ width: 'calc(100% - 200px)' }} value={message} onChange={(e) => setMessage(e.target.value)} />
                <Button type="primary" onClick={sendMessageToFriend}>Send</Button>
            </div>

        </>

    )
}
