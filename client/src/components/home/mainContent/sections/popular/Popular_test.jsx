import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { faTelegram } from '@fortawesome/free-brands-svg-icons';
import useMarketCapData from '../../../../../hooks/useCoinMarketCapData';
import './Popular_test.css';

const Popular = ({ coins }) => {
    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const { isLoading, coinsWithMarketCap } = useMarketCapData(coins);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // This makes it scroll smoothly
        });
    };

    // Format market cap function
    const formatMarketCap = (marketCap) => {
        if (!marketCap) return '$0.00';

        // If marketCap is a string, parse it
        const value =
            typeof marketCap === 'string' ? parseFloat(marketCap) : marketCap;

        if (value < 0.01) {
            return `$${value.toFixed(4)}`;
        }
        return value >= 1000
            ? `$${(value / 1000).toFixed(1)}k`
            : `$${value.toFixed(3)}`;
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
        <section className="popular">
            <h2 className="popular-title">Loot Drop</h2>

            {isLoading ? (
                <div className="loading-container">
                    <div className="loading-spinner" />
                </div>
            ) : (
                <>
                    <div className="scroll-container">
                        {selectedCoins.map((coin) => (
                            <Link
                                className="items"
                                to={{
                                    pathname: `/SinglePage/${coin._id}`,
                                    // Pass both the formatted and raw market cap
                                    state: {
                                        title: coin.name,
                                        address: coin.address,
                                        marketCap: coin.marketcap
                                    }
                                }}
                                key={coin.address}
                            >
                                <div className="box">
                                    <div className="images">
                                        <div className="popular-card-img">
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
                                        <div className="title-social-card-container">
                                            <h1 className="card-coin-title">
                                                {coin.name}
                                            </h1>
                                            <div className="popular-icons">
                                                {' '}
                                                {coin?.twitter && (
                                                    <a
                                                        href={coin.twitter}
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
                                                        href={coin.telegram}
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
                                                        href={coin.website}
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
                                                MarketCap:{' '}
                                                {formatMarketCap(
                                                    coin.marketcap
                                                )}
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

export default Popular;
