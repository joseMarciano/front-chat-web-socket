import { Button, Input } from 'antd'
import { useState } from 'react'
import { SockJs } from '../../../config/SockJS'
import { useChatContext } from '../Context'

import './style.css'


type Message = {
    id: string
    from: string
    to: string
    content: string
    date: Date
    status: string
}


export function Conversation() {
    const sockClient = SockJs.getInstance()
    const [message, setMessage] = useState('');
    const { setMessages, messages, user, currentFriend } = useChatContext();

    if (!currentFriend || !user) return <></>

    const formatDate = (date?: string): string => {
        if(!date) return '';

        return new Intl.DateTimeFormat('pt-br', {
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(date))
    }

    const sendMessageToFriend = () => {

        const body = {
            content: message,
            from: user.id,
            date: new Date(),
            to: currentFriend.id
        }
        sockClient.send('/app/send-message', { body })
        messages?.push(body as Message)

        setMessages([...messages as any])

        setMessage('');
    }

    return (
        <>
            <header className='header_conversation'>
                {`From: ${user.name} | To: ${currentFriend.name}`}
            </header>
            <div className='content_conversation_wrapper'>
                <div className='content_conversation'>
                    {messages.map((m, index) => (
                        <span key={index} className={user.id === m.from ? 'container_conversation self' : 'container_conversation'}>
                            <p>
                                {m.content}
                            </p>
                           <time>
                               {formatDate(m.date as unknown as string)}
                           </time>
                        </span>
                    ))}
                </div>
            </div>
            <div className='input_conversation'>
                <Input style={{ width: 'calc(100% - 200px)' }} value={message} onChange={(e) => setMessage(e.target.value)} />
                <Button type="primary" onClick={sendMessageToFriend}>Send</Button>
            </div>

        </>

    )
}
