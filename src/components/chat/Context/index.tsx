import { MessageFilled } from "@ant-design/icons";
import { Alert, Input, Modal } from "antd";
import { AxiosResponse } from "axios";
import { Message as MessageStmp } from 'stompjs'
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";
import axiosInstance from "../../../config/axios";
import { SockJs } from "../../../config/SockJS";


const ContextChat = createContext({} as ContextProviderProps)

type ChatContextProp = {
    children: ReactNode
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

type PageMessage = {
    offset: number
    limit: number
    total?: number
    content: Message[]
}

type ContextProviderProps = {
    openModalFriend: () => void
    setMessages: (messages: Message[]) => void
    setCurrentFriend: (user: User) => void
    loadMessages: (friend: User) => void
    setIdParam: (id: string) => void
    friends: User[]
    currentFriend?: User,
    user?: User,
    messages: Message[]
}


export function ChatContext(this: any, { children }: ChatContextProp) {
    const sockClient = SockJs.getInstance()
    let [user, setUser] = useState<User>();
    const [modalIsOpen, setOpenModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [friends, setFriends] = useState<User[]>([]);
    const [friendEmail, setFriendEmail] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [currentFriend, setCurrentFriend] = useState<User>();
    const [messages, setMessages] = useState<Message[]>([{ id: "macadao" }] as Message[])
    const previousMessage = useRef([] as Message[])
    const [idParam, setIdParam] = useState<string>('')

    console.log("Componente carregado novamente")

    useEffect(() => {
        console.log("Mudou mensagem")
        previousMessage.current = messages;
    }, [messages])

    useEffect(() => {

        if (!idParam) return;

        getUserById(idParam as string)
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
    }, [idParam])

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

    const subscribeToReceiveMessages = (friendId: string) => {
        sockClient.subscribe(`/user/${user?.id}${friendId}/private`, subs)

        function subs(message?: MessageStmp) {
            const messageParsed = JSON.parse(message?.body || '') as Message
            setMessages([...previousMessage.current, messageParsed])
        }
    }


    function getUserById(id: string): Promise<AxiosResponse> {
        return axiosInstance.get(`/user/${id}`);
    }

    async function addFriendUSer(friend: User): Promise<User> {
        return axiosInstance.post(`/user/add-friend/${idParam}`, [friend])
            .then(({ data }) => {
                friends.push(friend)
                setFriends([...friends])
                subscribeToReceiveMessages(friend.id)
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

    async function loadMessages(friend: User) {
        axiosInstance.get<PageMessage>(`/messages/page/${user?.id}/${friend.id}`)
            .then(({ data }) => {
                setMessages([...data.content])
            })
    }


    return (
        <ContextChat.Provider value={{
            openModalFriend,
            setMessages,
            setCurrentFriend,
            loadMessages,
            setIdParam,
            friends,
            currentFriend,
            messages,
            user
        }}>
            {children}
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
        </ContextChat.Provider>
    )
}

export function useChatContext() {
    return useContext(ContextChat)
}