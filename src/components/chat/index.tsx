import './style.css'
import { Friend } from './Friend';
import { Layout } from "antd";
import { MenuOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../config/axios';
const { Sider, Content } = Layout;

type User = {
    id: string,
    name: string,
    email: string,
    friends: string[],
}

export function Chat() {
    const [user, setUser] = useState<User>();
    const [friends, setFriends] = useState<User[]>([])
    const { id } = useParams();

    useEffect(() => {
        axiosInstance.get(`/user/${id}`)
            .then(({ data }) => {
                setUser(data)
                data.friends.forEach((friend: string) => {
                    axiosInstance.get(`/user/${friend}`).then(({ data }) => {
                        friends.push(data)
                        setFriends([...friends])
                    })
                })

            })
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
                    </header>

                    <div className='container_friend_wrapper'>
                        {friends.map((friend) => <Friend key={friend.id} friend={friend} />)}
                    </div>

                </Sider>
                <Content style={{
                    background: 'white'
                }} >Teste 2</Content>
            </Layout>
        </div>
    )
}