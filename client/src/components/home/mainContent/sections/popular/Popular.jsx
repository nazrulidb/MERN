import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Heading from '../../../../common/heading/Heading';
import { Link } from 'react-router-dom';
import './Popular.css';
import {
    Box,
    Card,
    CardContent,
    CardMedia,
    CircularProgress,
    Grid,
    Pagination,
    Typography
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faDollarSign,
    faGlobe,
    faComment
} from '@fortawesome/free-solid-svg-icons';
import { faTwitter, faTelegram } from '@fortawesome/free-brands-svg-icons';
import useMarketCapData from '../../../../../hooks/useCoinMarketCapData';

const Popular = ({ coins }) => {
    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const { isLoading, coinsWithMarketCap } = useMarketCapData(coins);

    // Update items per page based on screen width
    const updateItemsPerPage = () => {
        const width = window.innerWidth;
        if (width <= 768) {
            setItemsPerPage(5); // Display 5 items per page on tablet and mobile
        } else {
            setItemsPerPage(10); // Display 10 items per page on desktop
        }
    };

    useEffect(() => {
        updateItemsPerPage();
        window.addEventListener('resize', updateItemsPerPage);
        return () => {
            window.removeEventListener('resize', updateItemsPerPage);
        };
    }, []);

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

    const totalPages = Math.ceil(coins.length / itemsPerPage);

    const handleChange = (event, value) => {
        setPage(value);
    };

    const arrayBufferToBase64 = (buffer) => {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    };

    // Slicing the coins array based on the current page
    const startIndex = (page - 1) * itemsPerPage;
    const selectedCoins = coinsWithMarketCap.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    return (
        <section className="popular">
            <Heading title="Popular" />
            <div className="content">
                {isLoading ? (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100vh'
                        }}
                    >
                        <CircularProgress />
                    </Box>
                ) : (
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
                                <div className="box shadow">
                                    <div className="images row">
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
                                    <div className="text row">
                                        <div
                                            className="title-social-card-container"
                                            // style={{
                                            //     display: 'flex',
                                            //     justifyContent: 'space-between'
                                            // }}
                                        >
                                            <h1 className="card-coin-title">
                                                {coin.name}
                                            </h1>
                                            <div className="popular-icons">
                                                <a
                                                    href={
                                                        coin
                                                            ? coin.twitter
                                                            : '#'
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="icon-link"
                                                    style={{
                                                        marginRight: '10px'
                                                    }}
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faComment}
                                                    />
                                                </a>
                                                <a
                                                    href={
                                                        coin
                                                            ? coin.twitter
                                                            : '#'
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="icon-link"
                                                    style={{
                                                        marginRight: '10px'
                                                    }}
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faTelegram}
                                                    />
                                                </a>
                                                <a
                                                    href={
                                                        coin
                                                            ? coin.twitter
                                                            : '#'
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="icon-link"
                                                    style={{
                                                        marginRight: '10px'
                                                    }}
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faGlobe}
                                                    />
                                                </a>
                                            </div>
                                        </div>
                                        <h2 className="ticker">
                                            {coin.ticker}
                                        </h2>
                                        <p className="description">
                                            {coin.description.length > 100
                                                ? `${coin.description.slice(
                                                      0,
                                                      25
                                                  )}...`
                                                : coin.description}
                                        </p>
                                        <div className="date">
                                            <i className="fa-solid fa-money-bill"></i>
                                            <label>
                                                MarketCap:{' '}
                                                {formatMarketCap(
                                                    coin.marketcap
                                                )}
                                            </label>
                                        </div>
                                        {/* <Box className="icon-links">
                                            <a
                                                href={coin ? coin.twitter : '#'}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="icon-link"
                                                style={{
                                                    marginRight: '10px'
                                                }}
                                            >
                                                <FontAwesomeIcon
                                                    icon={faTwitter}
                                                />
                                            </a>
                                            <a
                                                href={
                                                    coin ? coin.telegram : '#'
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="icon-link"
                                                style={{
                                                    marginRight: '10px'
                                                }}
                                            >
                                                <FontAwesomeIcon
                                                    icon={faTelegram}
                                                />
                                            </a>
                                            <a
                                                href={coin ? coin.website : '#'}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="icon-link"
                                            >
                                                <FontAwesomeIcon
                                                    icon={faGlobe}
                                                />
                                            </a>
                                        </Box> */}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handleChange}
                    color="primary"
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: '20px'
                    }}
                />
            </div>
        </section>
    );
};

export default Popular;
