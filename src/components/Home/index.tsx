import './style.css'
import { useNavigate } from 'react-router-dom'
import { Form, Input, Button } from 'antd'
import httpClient from '../../config/axios'
import { useState } from 'react'

type FormFields = {
    name: string
    password: string
    email: string
}

export function Home() {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = (fields: FormFields) => {
        setIsLoading(true)
        httpClient.post('user', fields)
            .then((user) => {
                navigate(`/chat/${user.data.id}`)
            })
            .finally(() => setIsLoading(false))
    }

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo)
    }

    return (
        <div className='container_form'>
            <Form
                name="basic"
                labelCol={{
                    span: 8,
                }}
                wrapperCol={{
                    span: 16,
                }}
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    label="E-mail"
                    name="email"
                    rules={[
                        {
                            required: true,
                            type: 'email',
                            message: 'Please input your e-mail!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your name!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    wrapperCol={{
                        offset: 8,
                        span: 16,
                    }}
                >
                    <Button loading={isLoading} type="primary" htmlType="submit">
                        Enter
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}