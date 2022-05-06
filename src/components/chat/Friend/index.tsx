import { useChatContext } from '../Context'
import './style.css'


type FriendProps = {
    friend: any
}

export function Friend({ friend }: FriendProps) {
    const {
        setCurrentFriend,
        loadMessages
    } = useChatContext();

   


return (
    <section  onClick = {() => { setCurrentFriend(friend); loadMessages(friend) }} className='friend_container'>
        <div className='container_img_friend'>
            <div className="img_friend_border">
                <img className='img_friend' src={`${process.env.PUBLIC_URL}/logo192.png`} alt="img" />
            </div>
        </div>
        <div style={{
            width: '100%'
        }}>
            <h1 className='info_friend'>
                <span>{friend.name}</span>
                <span>
                    <time>15:30</time>
                </span>
            </h1>
            <p className="message_friend">
                Hello
            </p>
        </div>
    </section>
)
}