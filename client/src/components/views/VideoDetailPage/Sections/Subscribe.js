import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Subscribe(props) {
    const userTo = props.userTo;
    const userFrom = props.userFrom;

    const [SubscribeNumber, setSubscribeNumber] = useState(0)
    const [subscribed, setSubscribed] = useState(false);

    useEffect(() => {
        const variable = {
            userTo: props.userTo
        }
        const subscribedVariable = {
            userTo: props.userTo,
            userFrom: localStorage.getItem('userID'),
        }
        axios.post('/api/subscribe/subscribeNumber', variable)
            .then(response => {
                if (response.data.success) {
                    setSubscribeNumber(response.data.subscribeNumber)
                } else {
                    alert('구독자 수 정보를 받지 못했습니다.')
                }
            })
        
            axios.post('/api/subscribe/subscribed', subscribedVariable)
            .then(response => {
                if (response.data.success) {
                    setSubscribed(response.data.subscribed)
                } else {
                    alert('정보를 받아오지 못했습니다.')
                }
            })

    }, [])

    return (
        <div>
            <button 
            onClick
            style={{
                backgroundColor: `${subscribed ? '#AAAAAA' : '#CC0000'}`,
                borderRadius: '4px', color: 'white',
                padding: '10px 16px', fontWeight: '500', fontSize: '1rem', textTransform: 'uppercase'
            }}>
                {SubscribeNumber} {subscribed ? 'Subscribed' : 'Subscribe'}
            </button>
        </div>
    )
}


export default Subscribe;