import './style.css'
import { sockClient } from '../../config/SockJS';
import { Friend } from './Friend';
import { Layout, Modal, Input, Alert } from "antd";
import { MenuOutlined, UserAddOutlined, MessageFilled } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../config/axios';
import { Conversation } from './Conversation';
import { AxiosResponse } from 'axios';
const { Sider, Content } = Layout;

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

export function Chat() {
    let [user, setUser] = useState<User>();
    const [modalIsOpen, setOpenModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [friends, setFriends] = useState<User[]>([]);
    const [friendEmail, setFriendEmail] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [currentFriend, setCurrentFriend] = useState<User>();
    const [messages, setMessages] = useState<Message[]>([])

    const { id } = useParams();

    useEffect(() => {
        getUserById(id as string)
            .then(({ data }) => {
                user = data as any
                setUser(data)
                return data
            })
            .then((data) => {
                data.friends.forEach((friend: string) => getUserById(friend).then(({ data }) => {
                    friends.push(data)
                    setFriends([...friends])
                    subscribeToReceiveMessages(data.id)
                }));
            });
    }, [])


    const openModalFriend = () => {
        setOpenModal(true)
    }

    const closeModalFriend = () => {
        setOpenModal(false)
    }

    const addFriend = async () => {
        setIsLoading(true)
        const friend = await getUserByEmail(friendEmail)

        if (friend) {
            setIsLoading(false)
            setOpenModal(false)
            setFriendEmail('')
            setShowAlert(false)

            await addFriendUSer(friend)

        } else {
            setShowAlert(true)
            setIsLoading(false)
        }
    }

    function getUserById(id: string): Promise<AxiosResponse> {
        return axiosInstance.get(`/user/${id}`);
    }

    function subscribeToReceiveMessages(friendId: string) {
        sockClient.subscribe(`/user/${user?.id}${friendId}/private`, (message) => {
            const messageReceived = JSON.parse(message?.body || '') as Message;

            messages.push(messageReceived)
            setMessages([...messages])
        

        })
    }

    async function addFriendUSer(friend: User): Promise<User> {
        return axiosInstance.post(`/user/add-friend/${id}`, [friend])
            .then(({ data }) => {
                friends.push(friend)
                setFriends([...friends])
                return data
            })
    }

    async function getUserByEmail(email: string): Promise<User> {
        return axiosInstance.get(`/user/email`, {
            params: {
                email: email
            }
        })
            .then(({ data }) => data)
    }

    return (<>
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
                        {friends.map((friend) => <Friend key={friend.id} friend={friend} onClick={() => setCurrentFriend(friend)} />)}
                    </div>

                </Sider>
                <Content>
                    <Conversation setMessages={setMessages} friend={currentFriend} user={user} messages={messages}/>
                </Content>
            </Layout>
        </div>
        <Modal
            title="Add friend"
            visible={modalIsOpen}
            onOk={addFriend}
            okText="Add"
            confirmLoading={isLoading}
            onCancel={closeModalFriend}
        >
            {showAlert && <Alert message="Email de amigo não encontrado" type="error" style={{ marginBottom: 20 }} />}
            <Input size="large" placeholder="put friend's email" prefix={<MessageFilled />} onChange={(e) => setFriendEmail(e.target.value)} />
        </Modal>
    </>
    )
}
