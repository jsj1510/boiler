import React, { useState } from 'react';
import { Typography, Button, Form, message, Input, Icon} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Dropzone from 'react-dropzone';

const { Title } = Typography;
const { TextArea } = Input;

const PrivateOptions = [
    { value: 0, label: 'Private' },
    { value: 1, label: 'Public' }
]

const Catogory = [
    { value: 0, label: "Film & Animation" },
    { value: 1, label: "Autos & Vehicles" },
    { value: 2, label: "Music" },
    { value: 3, label: "Pets & Animals" },
    { value: 4, label: "Sports" },
]

function UploadVideoPage() {
    const [VideoTitle, setVideoTitle] = useState("");
    const [Description, setDescription] = useState("");
    const [Private, setPrivate] = useState(0)
    const [Categories, setCategories] = useState("Film & Animation")

    const onTitleChage = (event) => {
        setVideoTitle(event.currentTarget.value)
    }

    const onDescriptionChange = (event) => {
        setDescription(event.currentTarget.value)
    }

    const handleChangeOne = (event) => {
        setPrivate(event.currentTarget.value)
    }

    const handleChangeTwo = (event) => {
        setCategories(event.currentTarget.value)
    }

    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Title level={2} > Upload Video</Title>
            </div>

            <Form onSubmit>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        {/* 드롭존 */}
                        <Dropzone
                        onDrop
                        multiple
                        maxSize>
                        {({ getRootProps, getInputProps }) => (
                            <div style={{ width: '300px', height: '240px', border: '1px solid lightgray', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                {...getRootProps()}
                            >
                                <input {...getInputProps()} />
                                <PlusOutlined type='plus' style={{fontSize: '3rem'}}></PlusOutlined>
                            </div>
                        )}
                        </Dropzone>

                        {/* 썸네일 */}
                        <div>
                            <img src alt />
                        </div>
                </div>
            
            <br />
            <br />
            <label>Title</label>
            <Input 
                onChange={onTitleChage} 
                value= {VideoTitle}
            />

            <br />
            <br />
            
            <label>Description</label>
            <TextArea
                onChange={onDescriptionChange}
                value={Description}
            />
            </Form>
            <br />
            <br />

            <select onChange={handleChangeOne}>
                    {PrivateOptions.map((item, index) => (
                        <option key={index} value={item.value}>{item.label}</option>
                    ))}
            </select>
            <br />
            <br />
            <select onChange={handleChangeTwo}>
                    {Catogory.map((item, index) => (
                        <option key={index} value={item.label}>{item.label}</option>
                    ))}
            </select>
            <br />
            <br />
            <Button type="primary" size="large" onClick>
                    Submit
            </Button>
        </div>
    )
}

export default UploadVideoPage