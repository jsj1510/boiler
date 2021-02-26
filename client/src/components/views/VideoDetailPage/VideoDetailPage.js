import React, { useEffect, useState } from 'react'
import { List, Avatar, Row, Col } from 'antd';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import SideVideo from './Sections/SideVideo';
import Subscriber from './Sections/Subscribe';
import Comment from './Sections/Comment';

function VideoDetailPage(props) {
    
    const videoId = props.match.params.videoId;
    const variable = {
        videoId : videoId,
    };
    const [videoDetail, setVideoDetail] = useState([]);
    // const [Comment, setComment] = useState(initialState)

    useEffect(() => {
        axios.post('/api/video/getVideoDetail', variable)
            .then(response => {
                if (response.data.success) {
                    setVideoDetail(response.data.videoDetail);
                } else {
                    alert('비디오 정보를 가져오는데 실패하였습니다.');
                }
            });
            console.log(Comment);
    }, [])

    // 비디오.writer가 있으면 lmage
    if(videoDetail.writer) {
        const subscribeButton = videoDetail.writer._id !== localStorage.getItem('userId') && < Subscriber userTo={ videoDetail.writer._id } userFrom={ localStorage.getItem('userId') } />
        return (
            <Row gutter={[16, 16]}>
                    <Col lg={18} xs={24}>
                        <div className="postPage" style={{ width: '100%', padding: '3rem 4em' }}>
                            <video style={{ width: '100%' }} src={`http://localhost:5000/${videoDetail.filePath}`} controls></video>
    
                            <List.Item
                                actions={[ subscribeButton ]} >

                                <List.Item.Meta
                                    avatar={<Avatar src={videoDetail.writer.image}/>}
                                    title={videoDetail.writer.name}
                                    description={videoDetail.description} 
                                />
                                <div></div>
                            </List.Item>
    
                            {/* 코멘트 */}
    
                            <Comment postId={videoId} />
    
                        </div>
                    </Col>
                    <Col lg={6} xs={24}>
    
                        <SideVideo />
    
                    </Col>
                </Row>
        );

    
    } else {
        return <div>...loading</div>;
    }
};

export default withRouter(VideoDetailPage);
