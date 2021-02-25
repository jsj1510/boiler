import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Subscribe = (props) => {

    const [SubscribeNumber, setSubscribeNumber] = useState(0)
    const [Subscribed, setSubscribed] = useState(false)

    let subscribeVariables = {
        userTo : props.userTo,
    }

    useEffect(() => {
        
        axios.post('/api/subscribe/subscribeNumber', subscribeVariables)
            .then(response => {
                if (response.data.success) {
                    setSubscribeNumber(response.data.subscribeNumber)
                } else {
                    alert('Failed to get subscriber Number')
                }
            })

        const subscribeNumberVariables = { userTo: props.userTo, userFrom: localStorage.getItem('userId')}
        axios.post('/api/subscribe/subscribed', subscribeNumberVariables)
        .then(response => {
            if (response.data.success) {
                setSubscribed(response.data.subcribed)
            } else {
                alert('Failed to get Subscribed Information')
            }
        })

    }, [])    

    return (
        <>
            <button
                style={{
                    backgroundColor: `${Subscribed ? '#AAAAAA' : '#CC0000'}`,
                    borderRadius: '4px',
                    color: '#fff',
                    padding: '10px 16px',
                    fontWeight: '500',
                    fontSize: '1rem',
                    textTransform: 'uppercase',
                    border: 'none',
                    outline: 'none',
                    cursor: 'pointer',
                }}
                
            >
                {SubscribeNumber}, {Subscribed ? 'subscribde' : 'Subscribe'}
            </button>
        </>
    );
};

export default Subscribe;