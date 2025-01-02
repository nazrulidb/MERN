import React from 'react';
import { Link } from 'react-router-dom';
import './kingOfHill.css';

const KingOfHill = ({ topMarketCap, isLoading }) => {
    const arrayBufferToBase64 = (buffer) => {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    };

    const formatValue = (value) => {
        // Format the dollar amount to a maximum of 6 decimal places
        const formattedDollar = parseFloat(value).toFixed(3);
        return `$${formattedDollar} / 30 ETH`;
    };

    return (
        <div className="hill-container">
            <h2 className="hill-title">Top of the Loot</h2>

            {isLoading ? (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                </div>
            ) : (
                <div className="hill-list">
                    {topMarketCap.map((coin, index) => {
                        const progress = (coin.marketcap / 30) * 100;

                        const value = `$${coin.marketcap}/30 ETH`;

                        const imgSrc = coin.img
                            ? `data:${
                                  coin.img.contentType
                              };base64,${arrayBufferToBase64(
                                  coin.img.data.data
                              )}`
                            : 'https://via.placeholder.com/50';

                        return (
                            <Link
                                key={coin._id}
                                to={`/SinglePage/${coin._id}`}
                                className="hill-item"
                            >
                                <span className="hill-rank">#{index + 1}</span>
                                <img
                                    src={imgSrc}
                                    alt={coin.name}
                                    className="hill-avatar"
                                />
                                <span className="hill-name">{coin.name}</span>
                                {/* <div className="progress-container">
                                    <div
                                        className="progress-bar"
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div> */}
                                <span className="hill-value">
                                    {' '}
                                    {formatValue(coin.marketcap)}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default KingOfHill;
