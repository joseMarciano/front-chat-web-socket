import './style.css'
import { Friend } from './Friend';
import { Layout } from "antd";
import { MenuOutlined, UserAddOutlined } from '@ant-design/icons';
import { Conversation } from './Conversation';
import { useChatContext } from './Context';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
const { Sider, Content } = Layout;


export function Chat() {
    const {
        friends,
        openModalFriend,
        setIdParam
    } = useChatContext();

    const { id } = useParams();

    useEffect(() => {
        setIdParam(id as string)
    }, [])

    return (
        <div className='wrapper_layout'>
            <Layout className="container_chat">
                <Sider theme='light' width={400} style={{
                    boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px'
                }}>
                    <header className='header_chat'>
                        <MenuOutlined />
                        <span>Chats</span>
                        <UserAddOutlined onClick={openModalFriend} />
                    </header>

                    <div className='container_friend_wrapper'>
                        {friends.map((friend) => <Friend key={friend.id} friend={friend} />)}
                    </div>

                </Sider>
                <Content>
                    <Conversation />
                </Content>
            </Layout>
        </div>
    )
}
