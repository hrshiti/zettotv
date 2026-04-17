import React from 'react';
import { useNavigate } from 'react-router-dom';
import zetotvlogo from './assets/zetotvlogo-removebg-preview.png';

const Header = ({ currentUser, onLoginClick }) => {
    const navigate = useNavigate();

    return (
        <div className="mx-header">
            <div className="mx-header-left">
                <div className="brand-logo">
                    <img src={zetotvlogo} alt="ZetoTV" className="brand-logo-image" />
                </div>
            </div>
        </div>
    );
};

export default Header;
