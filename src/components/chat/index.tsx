import './style.css'
import { Friend } from './Friend';
import { Layout, Modal, Input, Alert } from "antd";
import { MenuOutlined, UserAddOutlined, MessageFilled } from '@ant-design/icons';
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
    const [modalIsOpen, setOpenModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [friends, setFriends] = useState<User[]>([]);
    const [friendEmail, setFriendEmail] = useState('');
    const [showAlert, setShowAlert] = useState(false);

    const { id } = useParams();

    useEffect(() => {
        getUserById(id as string)
        .then((data) => {
            data.friends.forEach((friend) => getUserById(friend).then((user) => {
                friends.push(user)
                setFriends([...friends])
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

        if(friend) {
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

    function getUserById(id: string): Promise<User> {
        return axiosInstance.get(`/user/${id}`)
            .then(({ data }) => {
                setUser(data)
                return data
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
        return axiosInstance.get(`/user/email`,{params: {
            email: email
        }})
            .then(({ data }) => {
                debugger
                return data
            })
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
                        {friends.map((friend) => <Friend key={friend.id} friend={friend} />)}
                    </div>

                </Sider>
                <Content>

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
                {showAlert && <Alert message="Email de amigo não encontrado" type="error" style={{marginBottom: 20}} />}
            <Input size="large" placeholder="put friend's email" prefix={<MessageFilled />} onChange={(e) => setFriendEmail(e.target.value)}/>
        </Modal>
    </>
    )
}
