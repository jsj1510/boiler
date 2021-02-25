import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Subscribe = (props) => {

    const [SubscribeNumber, setSubscribeNumber] = useState(0)
    const [Subscribed, setSubscribed] = useState(false)

    let variable = {
        userTo: props.userTo
    }

    useEffect(() => {
        
        axios.post('/api/subscribe/subscribeNumber', variable)
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
                setSubscribed(response.data.Subcribed)
            } else {
                alert('Failed to get Subscribed Information')
            }
        })

    }, [])    

    const onSubscribe = ( ) => {

        let subscribeVariables = {
                userTo : props.userTo,
                userFrom : props.userFrom
        }

        if(Subscribed) {
            //when we are already subscribed 
            axios.post('/api/subscribe/unSubscribe', subscribeVariables)
                .then(response => {
                    if(response.data.success){ 
                        setSubscribeNumber(SubscribeNumber - 1)
                        setSubscribed(!Subscribed)
                    } else {
                        alert('Failed to unsubscribe')
                    }
                })

        } else {
            // when we are not subscribed yet
            
            axios.post('/api/subscribe/subscribe', subscribeVariables)
                .then(response => {
                    if(response.data.success) {
                        setSubscribeNumber(SubscribeNumber + 1)
                        setSubscribed(!Subscribed)
                    } else {
                        alert('Failed to subscribe')
                    }
                })
        }

    }

    return (
        <>
            <button
                onClick={onSubscribe}
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
                {SubscribeNumber}, {Subscribed ? 'subscribed' : 'Subscribe'}
            </button>
        </>
    );
};

export default Subscribe;