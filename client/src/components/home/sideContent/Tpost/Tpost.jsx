import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './tpost.css';

const TopMovers = () => {
    const [newestCoins, setNewestCoins] = useState([]);
    const [error, setError] = useState(null);

    const arrayBufferToBase64 = (buffer) => {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    };

    const fetchNewestCoins = async () => {
        try {
            const response = await fetch('/api/coins/newest');
            if (!response.ok) {
                throw new Error('Failed to fetch newest coins');
            }
            const data = await response.json();
            setNewestCoins(data);
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchNewestCoins();
    }, []);

    if (error) {
        return (
            <div className="tpost error-message">Failed to load top movers</div>
        );
    }

    return (
        <div className="tpost">
            <h2 className="tpost-title">Rapid Risers</h2>
            {newestCoins.slice(0, 3).map((coin) => (
                <div className="box" key={coin._id}>
                    <Link to={`/SinglePage/${coin._id}`} className="coin-link">
                        <div className="img">
                            {coin.img && coin.img.data ? (
                                <img
                                    src={`data:${
                                        coin.img.contentType
                                    };base64,${arrayBufferToBase64(
                                        coin.img.data.data
                                    )}`}
                                    alt={coin.name}
                                />
                            ) : (
                                <div className="placeholder-img" />
                            )}
                        </div>
                        <div className="text">
                            <h1>{coin.name}</h1>
                            <h2>{coin.ticker}</h2>
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default TopMovers;
