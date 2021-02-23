import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, withRouter } from 'react-router-dom';
import '../../../scss/Header.scss';
import {auth} from '../../../_actions/user_action';
import { useDispatch } from 'react-redux';


const Header = (props) => {
    const dispatch = useDispatch();
    const [login, setLogin] = useState(false);

    useEffect(() =>{
        dispatch(auth())
        .then((response) => {
            if (!response.payload.isAuth) {
                if(localStorage.getItem('userID')) {
                    localStorage.removeItem('userId');
                    setLogin(false);
                }
            } else {
                if (!localStorage.getItem('userID')) {
                    axios.get('api/users/logout')
                    .then((response) => {
                        if (response.data.sccess) {
                            setLogin(false);
                        }
                    })
                }
            }
        })

        if (localStorage.getItem('userID')) {
            setLogin(!login);
        }
    }, []);

    const onClickHandler = () => {
        localStorage.removeItem('userID');
        axios.get('/api/users/logout')
            .then((response) => {
                if(response.data.success){
                    props.history.push("/login")
                } else {
                    alert('로그아웃 실패!')
                }
            });
    };

    return (
        <header>
            <h1 className="header-title"><Link to="/">Home</Link></h1>
            <ul className="header-menu">
                {login ? <li><Link to="/" onClick={ onClickHandler }>Logout</Link></li>
                : <li><Link to="/login">Login</Link></li>}
                {login ? '' : <li><Link to="/register">Signup</Link></li>
                }
            </ul>
        </header>
    )
};

export default withRouter(Header);