import React, { useState } from 'react';
import { Typography, Button, Form, message, Input} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Dropzone from 'react-dropzone';
import axios from 'axios';

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
    const [FilePath, setFilePath] = useState("")
    const [Duration, setDuration] = useState("")
    const [Thumbnail, setThumbnail] = useState("")

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

    const onDrop = (files) => {
        console.log(files);
        let formData = new FormData();
        const config = {
          header: { "content-type": "multipart/form-data" },
        };
        formData.append("file", files[0]);
    
        axios.post("/api/video/uploadfiles", formData, config).then((response) => {
          if (response.data.success) {
            console.log(response.data);
    
            let variable = {
              url: response.data.url,
              fileName: response.data.filename,
            };
            setFilePath(response.data.url)
    
            axios.post("/api/video/thumbnail", variable).then((response) => {
              if (response.data.success) {
                setDuration(response.data.fileDuration)
                setThumbnail(response.data.thumbsFilePath)
              } else {
                alert("썸네일 에러 발생");
              }
            });
          } else {
            alert("upload failed");
          }
        });
      };

    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Title level={2} > Upload Video</Title>
            </div>


            <Form onSubmit>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Dropzone
                        onDrop={onDrop}
                        multiple={false}
                        maxSize={800000000}>
                        {({ getRootProps, getInputProps }) => (
                            <div style={{ width: '300px', height: '240px', border: '1px solid lightgray', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                {...getRootProps()}
                            >
                                <input {...getInputProps()} />
                                <PlusOutlined type="plus" style={{ fontSize: '3rem' }} />

                            </div>
                        )}
                    </Dropzone>

                    {Thumbnail &&
                        <div>
                            <img src={`http://localhost:5000/${Thumbnail}`} alt="haha" />
                        </div>
                    }
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