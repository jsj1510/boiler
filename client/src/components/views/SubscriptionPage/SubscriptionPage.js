import React, { useEffect, useState} from 'react';
import axios from 'axios';
import { withRouter, Link } from 'react-router-dom';
import { Card, Avatar, Col, Typography, Row } from 'antd';
import moment from 'moment';
import '../../../scss/Duration.scss'

const { Title } = Typography;
const { Meta } = Card;

function LandingPage(props) {

    const [Videos, setVideos] = useState([])

    useEffect(() => {
        const subscriptionVaribles = { userFrom : localStorage.getItem('userId')
    }
        axios.post('/api/video/getSubscriptionVideos', subscriptionVaribles )
            .then(response => {
                if (response.data.success) {
                    console.log(response.data.videos)
                    setVideos(response.data.videos)
                } else {
                    alert('Failed to get Videos')
                }
            })
    }, []);
  
    const renderCards = Videos.map((video, index) => {

        var minutes = Math.floor(video.duration / 60);
        var seconds = Math.floor(video.duration - minutes * 60);
    
        return <Col key={index} lg={6} md={8} xs={24}>
                    <div style={{ position: 'relative' }}>
                        <Link to={`/video/${video._id}`}>
                            <img 
                                style={{width: '100%'}}
                                src={`http://localhost:5000/${video.thumbnail}`} 
                                alt="thumbnail"
                            />
                            <div className="duration">
                                <span>{minutes} : {seconds}</span>
                            </div>
                        </Link>
                    </div>
                <br />
                <Meta
                    avatar = { <Avatar src={video.writer.image} /> }
                    title = {video.title}
                    description = ""
                />
                <span>{video.writer.name}</span>
                <br/>
                <span style={{ marginLeft: '3rem' }}>
                    {video.views} views <span> - </span> {moment(video.createdAt).format("MMM Do YY")}
                </span>
            </Col>
    });

    return (
        <div style={{ width: '85%', margin: '3rem auto' }}>
            <Title level={2} > subscription </Title>
            <hr />

            <Row gutter={32, 16}>
                {renderCards}
            </Row>
        </div>
    )
};

export default withRouter(LandingPage);