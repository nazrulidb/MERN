import React from 'react';
import './CoinDescription.css';

const CoinDescription = ({ name, description }) => {
    return (
        <div className="description-container">
            <div className="description-content">
                <h2 className="description-title">{name}</h2>
                <p className="description-text">{description}</p>
            </div>
        </div>
    );
};

export default CoinDescription;
