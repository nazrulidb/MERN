import React, { useState, useEffect } from 'react';
// import Hero from './hero/Hero';
import MainPage from './mainContent/mainPage/MainPage';
import { io } from 'socket.io-client';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Hero from './hero/Hero';

const Homepages = ({ newMemeAddress, setNewMemeAddress }) => {
    const [coins, setCoins] = useState([]);
    const [newestCoins, setNewestCoins] = useState([]);
    const [topMarketCap, setTopMarketCap] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCoins = async () => {
        try {
            const response = await fetch('/api/coins');
            if (!response.ok) {
                throw new Error('Failed to fetch coins');
            }
            const data = await response.json();
            const uniqueCoins = Array.from(
                new Map(data.map((coin) => [coin._id, coin])).values()
            );
            setCoins(uniqueCoins);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
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

    const fetchTopMarketCap = async () => {
        try {
            const response = await fetch('/api/coins/market-cap');
            if (!response.ok) {
                throw new Error('Failed to fetch top market cap');
            }
            const data = await response.json();
            setTopMarketCap(data);
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchCoins();
        fetchNewestCoins();
        fetchTopMarketCap();
    }, []);

    return (
        <>
            <Hero
                coins={coins}
                newMemeAddress={newMemeAddress}
                setNewMemeAddress={setNewMemeAddress}
            />
            {loading ? (
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
            ) : error ? (
                <div>Error: {error}</div>
            ) : (
                <MainPage
                    coins={coins}
                    newCoins={newestCoins}
                    topMarketCap={topMarketCap}
                />
            )}
        </>
    );
};

export default Homepages;
