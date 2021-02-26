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
    const [Comments, setComments] = useState([]);

    useEffect(() => {
        axios.post('/api/video/getVideoDetail', variable)
            .then(response => {
                if (response.data.success) {
                    setVideoDetail(response.data.videoDetail);
                } else {
                    alert('비디오 정보를 가져오는데 실패하였습니다.');
                }
            });

        axios.post('/api/comment/getComments', variable)
        .then(response => {
            if(response.data.success) {
                setComments(response.data.comments)
                console.log(response.data.comments)
            } else {
                alert("코멘트 저장실패")
            }
        })
    }, [])

    const refreshFunction = (newComment) => {
        setComments(Comments.concat(newComment))
    }

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
    
                            <Comment refreshFunction={refreshFunction} commentList={Comments} postId={videoId} />
    
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
