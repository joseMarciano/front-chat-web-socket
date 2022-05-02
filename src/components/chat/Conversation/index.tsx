import { Button, Input } from 'antd'
import './style.css'


type Friend = {
    id: string,
    name: string,
    email: string,
    friends: string[],
}

type ConversationProps = {
    friend?: Friend
}


export function Conversation({ friend }: ConversationProps) {

    if (!friend) return <></>

    return (
        <>
            <header className='header_conversation'>
                {friend.name}
            </header>
            <div className='content_conversation'>
                    <span>
                    testeskjsdflskdjfsdkljfslfjsldkfjsdlkfjsdlfjsdfklsjlfkjslfjsdlkfjsdlkfjsdklfsdkljl

                    </span>
                    <span className='self'>
                        testeskjsdflskdjfsdkljfslfjsldkfjsdlkfjsdlfjsdfklsjlfkjslfjsdlkfjsdlkfjsdklfsdkljl
                    </span>
            </div>

            <div className='input_conversation'>
                    <Input style={{ width: 'calc(100% - 200px)' }} />
                    <Button type="primary">Send</Button>
            </div>

        </>

    )
}
