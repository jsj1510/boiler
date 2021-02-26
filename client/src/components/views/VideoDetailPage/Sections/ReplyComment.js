import React, { useState, useEffect} from 'react';
import SingleComment from './SingleComment';



const ReplyComment = ({ commentList, parentCommentId, postId, refreshFunction }) => {
    const [childCommentNumber, setChildCommentNumber] = useState(0);
    const [openReplyComment, setOpenReplyComment] = useState(false);

    useEffect(() => {
        let commentNumber = 0;

        commentList.map(comment => {
            if (comment.responseTo === parentCommentId) {
                commentNumber++;
            }
        })
        setChildCommentNumber(commentNumber);
    }, [commentList, parentCommentId])

    const renderReplyComment = (parentCommentId) => 
            commentList.map((comment, index) => (
                <React.Fragment>
                {comment.responseTo === parentCommentId &&
                    <div style={{ width: '80%', marginLeft: '40px'}}>
                        <SingleComment
                            refreshFunction={refreshFunction} 
                            comment={comment}
                            postId={postId}
                        />
                        <ReplyComment
                            refreshFunction={refreshFunction} 
                            parentCommentId={comment._id} 
                            commentList={commentList} 
                            postId={postId} 
                        />
                    </div>
                }
                </React.Fragment>
        ));
        

        const onHandleChange = () => {
            setOpenReplyComment(!openReplyComment);
        }
    
    return (
        
        <div>
            {childCommentNumber > 0 &&
                <p style={{ fontSize: '14px', margin: 0, color:'gray' }} onClick={onHandleChange}>
                        View {childCommentNumber} more comment(s)
                </p>
            }

            {openReplyComment &&
               renderReplyComment(parentCommentId)
            }

        </div>
    );
};


export default ReplyComment;
