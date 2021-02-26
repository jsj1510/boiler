import React, { useState } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import SingleComment from './SingleComment';
import ReplyComment from './ReplyComment';

const Comment = ({ postId, commentList, refreshFunction }) => {
    const user = useSelector(state => state.user);

    const [commentValue, setCommentValue] = useState("");

    const handleClick = e => {
        setCommentValue(e.currentTarget.value);
    }

    const onSubmit = e => {
        e.preventDefault();
        setCommentValue("");

        const variables = {
            content: commentValue,
            writer: user.userData._id,
            postId: postId
        }

        axios.post('/api/comment/saveComment', variables)
        .then(response => {
            if (response.data.success) {
                console.log(response.data.result);
                refreshFunction(response.data.result);
            } else {
                alert('커멘트를 저장하지 못했습니다.');
            }
        })
    }

    return (
        <div>
            <br />
            <p> Replies </p>
            <hr />

            {/* 코멘트리스트 */}
            {commentList && commentList.map((comment, index) => (
                (!comment.responseTo &&
                    <React.Fragment>
                        <SingleComment 
                            refreshFunction={refreshFunction}
                            key={index} 
                            comment={comment} 
                            postId={postId}
                        />
                        <ReplyComment
                            refreshFunction={refreshFunction}
                            parentCommentId={comment.id}
                            commentList={commentList}
                            postId={postId}
                        />
                    </React.Fragment>
                )
            ))}
            {/* 루트코멘트 폼 */}

           
            <form style= {{ display : 'flex'}} onSubmit={onSubmit}>
                <textarea
                    style = {{ width : '100%', borderRadius: '5px'}}
                    onChange={handleClick}
                    value={commentValue}
                    placeholder = "코멘트를 작성해 주세요"
                />
                <br />
                <button style= {{ width:'20%', height:'52px'}} onClick={onSubmit} >Submit</button>
            </form>
        </div>
    );
};

export default withRouter(Comment);