import React, { useEffect, useState } from 'react'
import { List, Avatar, Row, Col } from 'antd';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

function VideoDetailPage(props) {
    
    const videoId = props.match.params.videoId; //비디오 url 가져오기
    const [videoDetail, setVideoDetail] = useState([]);
    const variable = {
        videoId : videoId,
    };

    useEffect(() => {
        axios.post('/api/video/getVideoDetail', variable)
            .then(response => {
                if (response.data.success) {
                    setVideoDetail(response.data.videoDetail);
                } else {
                    alert('비디오 정보를 가져오는데 실패하였습니다.');
                }
            });


    }, [])

    // 비디오.writer가 있으면 lmage
    if(videoDetail.writer) {
        return (
            <Row gutter={[16, 16]}>
                    <Col lg={18} xs={24}>
                        <div className="postPage" style={{ width: '100%', padding: '3rem 4em' }}>
                            <video style={{ width: '100%' }} src={`http://localhost:5000/${videoDetail.filePath}`} controls></video>
    
                            <List.Item
                                actions
                                >
                                
                                <List.Item.Meta
                                    avatar={<Avatar src={videoDetail.writer.image}/>}
                                    title={videoDetail.writer.name}
                                    description={videoDetail.description} 
                                />
                                <div></div>
                            </List.Item>
    
                            {/* 코멘트 */}
    
                          
    
                        </div>
                    </Col>
                    <Col lg={6} xs={24}>
    
                        side video
    
                    </Col>
                </Row>
        );

    
    } else {
        return <div>...loading</div>;
    }
};

export default withRouter(VideoDetailPage);
