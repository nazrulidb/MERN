import React from 'react';
import { Link } from 'react-router-dom';
import '../side/side.css';

const NewCoins = ({ newCoins }) => {
    return (
        <div className="new-coins-container">
            <h2 className="new-coins-title">Fresh Drops</h2>
            <div className="coins-list">
                {newCoins.map((coin, index) => (
                    <Link
                        key={coin._id}
                        to={`/SinglePage/${coin._id}`}
                        className="coin-card"
                    >
                        <div className="coin-info">
                            <span className="coin-name">{coin.name}</span>
                            <span className="coin-ticker">{coin.ticker}</span>
                        </div>
                        <div className="card-number">#{index + 1}</div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default NewCoins;
