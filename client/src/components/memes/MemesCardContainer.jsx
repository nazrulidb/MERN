import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { faTelegram } from '@fortawesome/free-brands-svg-icons';
import { Box, CircularProgress } from '@mui/material';
import './memesCardsContainer.css';
import useMarketCapData from '../../hooks/useCoinMarketCapData';

const MemesCardContainer = ({ coins }) => {
    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const { isLoading, coinsWithMarketCap } = useMarketCapData(coins);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // This makes it scroll smoothly
        });
    };

    const updateItemsPerPage = () => {
        const width = window.innerWidth;
        setItemsPerPage(width <= 768 ? 5 : 10);
    };

    useEffect(() => {
        updateItemsPerPage();
        window.addEventListener('resize', updateItemsPerPage);
        return () => window.removeEventListener('resize', updateItemsPerPage);
    }, []);

    const totalPages = Math.ceil(coinsWithMarketCap.length / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const selectedCoins = coinsWithMarketCap.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    const arrayBufferToBase64 = (buffer) => {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    };

    return (
        <section className="memeCards">
            <div className="heading-container">
                <div className="heading-l-shape"></div>
                <h2 className="memes-container-heading">All the Loot</h2>
            </div>
            {isLoading ? (
                <div className="loading-container">
                    <div className="loading-spinner" />
                </div>
            ) : (
                <>
                    <div className="cards-container">
                        {selectedCoins.map((coin) => (
                            <Link
                                className="items"
                                to={`/SinglePage/${coin._id}`}
                                key={coin._id}
                            >
                                <div className="box">
                                    <div className="images">
                                        <div className="card-img">
                                            {coin.img && coin.img.data && (
                                                <img
                                                    src={`data:${
                                                        coin.img.contentType
                                                    };base64,${arrayBufferToBase64(
                                                        coin.img.data.data
                                                    )}`}
                                                    alt={coin.name}
                                                />
                                            )}
                                        </div>
                                    </div>
                                    <div className="text">
                                        <div className="title-social-container">
                                            <h1 className="card-coin-title">
                                                {coin.name}
                                            </h1>
                                            <div className="social-icons">
                                                {' '}
                                                {coin?.twitter && (
                                                    <a
                                                        href={
                                                            coin.twitter || '#'
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="icon-link"
                                                    >
                                                        {' '}
                                                        <FontAwesomeIcon
                                                            icon={faComment}
                                                        />{' '}
                                                    </a>
                                                )}{' '}
                                                {coin?.telegram && (
                                                    <a
                                                        href={
                                                            coin.telegram || '#'
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="icon-link"
                                                    >
                                                        {' '}
                                                        <FontAwesomeIcon
                                                            icon={faTelegram}
                                                        />{' '}
                                                    </a>
                                                )}{' '}
                                                {coin?.website && (
                                                    <a
                                                        href={
                                                            coin.website || '#'
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="icon-link"
                                                    >
                                                        {' '}
                                                        <FontAwesomeIcon
                                                            icon={faGlobe}
                                                        />{' '}
                                                    </a>
                                                )}{' '}
                                            </div>
                                        </div>
                                        <h2 className="ticker">
                                            {coin.ticker}
                                        </h2>
                                        <p className="description">
                                            {coin.description.length > 100
                                                ? `${coin.description.slice(
                                                      0,
                                                      100
                                                  )}...`
                                                : coin.description}
                                        </p>
                                        <div className="date">
                                            <span>
                                                MarketCap: ${coin.marketcap}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="pagination-container">
                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index + 1}
                                className={`page-button ${
                                    page === index + 1 ? 'active' : ''
                                }`}
                                onClick={() => {
                                    setPage(index + 1);
                                    scrollToTop();
                                }}
                                disabled={page === index + 1}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </section>
    );
};

export default MemesCardContainer;
