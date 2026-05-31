import React from 'react';
import '../styles/header.css';
import { getLiveDate } from '../../utils/helpers';

export const Header = ({ title }) => {
    return (
        <header className="header">
            <div className="header-left">
                <h1 className="page-title">{title}</h1>
            </div>
            <div className="header-right">
                <div className="live-date">{getLiveDate()}</div>
            </div>
        </header>
    );
};
