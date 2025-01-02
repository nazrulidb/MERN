import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Side from '../home/sideContent/side/Side';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import {
    Grid,
    Typography,
    Card,
    CardContent,
    Button,
    Box,
    Paper
} from '@mui/material';
import MemeReviews from './ReviewsComponent/MemeReviews';
import Widget from '../common/widget/Widget';
import axios from 'axios';
import { useParams, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { faTwitter, faTelegram } from '@fortawesome/free-brands-svg-icons';
import { ethers } from 'ethers';
import tradingHubAbi from '../common/constants/tradingHubABI.json';
import MarketCapChart from './MarketCapChart'; // Import the MarketCapChart component
import './singlepage.css';
import BondingCurveProgress from '../common/bondingCurveProgress/BondingCurveProgress';
import MemeTokenProgress from '../common/memeTokenProgress/MemeTokenProgress';
import CoinDescription from './descriptionBox/CoinDescription';
import CoinHeader from './coinHeader/CoinHeader';
const placeholderImage = 'https://via.placeholder.com/50';

const SinglePage = ({ newMemeAddress, setNewMemeAddress }) => {
    const history = useHistory();
    const location = useLocation();
    const params = useParams();

    const { coinId } = useParams();
    // const { address } = useParams();

    const [coin, setCoin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newCoins, setNewCoins] = useState([]);
    const { id } = useParams();

    const { title, address } = location.state || {};

    const [currentCoin, setCurrentCoin] = useState();
    const [imgSrc, setImgSrc] = useState(placeholderImage);
    const [remainingEthCapacity, setRemainingEthCapacity] = useState('0');

    useEffect(() => {
        // Scroll to top whenever the component mounts or coinId changes
        window.scrollTo(0, 0);
    }, [coinId]);

    useEffect(() => {
        const fetchCoinData = async () => {
            try {
                // const provider = new ethers.providers.JsonRpcProvider(
                //     'https://sepolia.base.org'
                // );
                const provider = new ethers.providers.JsonRpcProvider(
                    'https://mainnet.base.org'
                );
                // const provider = new ethers.providers.JsonRpcProvider(
                //     'https://data-seed-prebsc-1-s1.binance.org:8545'
                // );

                //bsc
                // const contract = new ethers.Contract(
                //     '0x6FA4134902678490698cDd80FB96B5580b03b2a9',
                //     tradingHubAbi,
                //     provider
                // );

                const contract = new ethers.Contract(
                    '0xcF819F72D24F1802222D220Fa27Ac4A14455D5F3',
                    tradingHubAbi,
                    provider
                );

                const response = await axios.get(`/api/coins/${coinId}`);
                // Get token info instead of just tokens left for sale
                const tokenInfo = await contract.getTokenInfo(
                    response?.data?.address
                );
                const marketcap = tokenInfo.currentMarketCap;
                const remainingEthCapacity = tokenInfo.remainingEthCapacity;
                setRemainingEthCapacity(remainingEthCapacity);
                const bondingProgress = await contract.getBondingCurveProgress(
                    response?.data?.address
                );
                const bondingLiquidity =
                    await contract.getBondingCurveLiquidity(
                        response?.data?.address
                    );
                // const tokensLeftForSale = await contract.getTokensLeftForSale(
                //     response?.data?.address
                // );

                const formatMarketCap = (marketCap) => {
                    // Convert from Wei to Ether first
                    const marketCapInEther = parseFloat(
                        ethers.utils.formatEther(marketCap)
                    );

                    // Format the small numbers correctly
                    if (marketCapInEther < 1) {
                        return marketCapInEther.toFixed(3); // Show 3 decimal places for small numbers
                    }
                    // Rest of the formatting for larger numbers
                    else if (marketCapInEther >= 1e9) {
                        return (marketCapInEther / 1e9).toFixed(2) + 'B';
                    } else if (marketCapInEther >= 1e6) {
                        return (marketCapInEther / 1e6).toFixed(2) + 'M';
                    } else if (marketCapInEther >= 1e3) {
                        return (marketCapInEther / 1e3).toFixed(2) + 'K';
                    } else {
                        return marketCapInEther.toFixed(2);
                    }
                };

                const formattedMarketCap = formatMarketCap(marketcap);

                setCurrentCoin({
                    ...response.data,
                    formattedMarketCap: formattedMarketCap,
                    bondingProgress: bondingProgress,
                    bondingLiquidity: bondingLiquidity,
                    remainingEthCapacity:
                        ethers.utils.formatEther(remainingEthCapacity)
                });

                setCoin({
                    ...response.data,
                    formattedMarketCap: formattedMarketCap,
                    bondingProgress: bondingProgress,
                    bondingLiquidity: bondingLiquidity,
                    remainingEthCapacity:
                        ethers.utils.formatEther(remainingEthCapacity)
                });

                if (response.data.img) {
                    const imgSrc = `data:${
                        response.data.img.contentType
                    };base64,${arrayBufferToBase64(
                        response.data.img.data.data
                    )}`;
                    setImgSrc(imgSrc);
                }
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchCoinData();
    }, [coinId]);

    const handleGoBack = () => {
        history.goBack();
    };

    const handleShare = () => {
        const tweetText = `Check out this meme coin: ${
            currentCoin ? currentCoin.name : 'Amazing Coin'
        }! 🚀 #LootMarkets ${window.location.href}`;
        const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            tweetText
        )}`;

        window.open(tweetUrl, '_blank');
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

    return (
        <>
            <CssBaseline />
            <Container maxWidth="xxl">
                <Grid container spacing={4} className="single-page-grid">
                    <Grid item xs={12} md={9}>
                        <Box className="content-box">
                            {currentCoin && (
                                <CoinHeader
                                    imgSrc={imgSrc}
                                    currentCoin={currentCoin}
                                    coin={coin}
                                    handleShare={handleShare}
                                    handleGoBack={handleGoBack}
                                />
                            )}

                            {coin && <MarketCapChart currentCoin={coin} />}

                            {/* Description Box */}
                            {currentCoin && currentCoin.description && (
                                <CoinDescription
                                    name={currentCoin.name}
                                    description={currentCoin.description}
                                />
                            )}

                            {/* Bonding Curve Progress*/}
                            {coin && (
                                <BondingCurveProgress
                                    marketCap={coin.formattedMarketCap}
                                    bondingProgress={ethers.utils.formatEther(
                                        coin.bondingProgress
                                    )}
                                    bondingLiquidity={ethers.utils.formatEther(
                                        coin.bondingLiquidity
                                    )}
                                    remainingEthCapacity={
                                        coin.remainingEthCapacity
                                    } // Use the value from coin object
                                />
                                // <MemeTokenProgress
                                //     tokenAddress={coin.address}
                                // />
                            )}

                            <Box className="meme-reviews">
                                <MemeReviews
                                    coinId={coinId}
                                    coinAddress={coin}
                                />
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Box className="widget-side">
                            {coin && (
                                <Widget
                                    newMemeAddress={newMemeAddress}
                                    setNewMemeAddress={setNewMemeAddress}
                                    currentCoin={coin}
                                />
                            )}
                            <Side />
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

export default SinglePage;
