import React, { useEffect, useState } from 'react';
import Side from '../home/sideContent/side/Side';
import '../home/sideContent/side/side.css';
import MemesCardContainer from './MemesCardContainer';
import { io } from 'socket.io-client';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import './memesCardsContainer.css';

export default function Memes() {
    const [coins, setCoins] = useState([]);
    const [newestCoins, setNewestCoins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [topMarketCap, setTopMarketCap] = useState([]);

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

        // const socket = io('http://localhost:5000'); // Specify the server URL
        // socket.on('new-coin', (newCoin) => {
        //     setCoins((prevCoins) => [newCoin, ...prevCoins]); // Add the new coin to the list
        //     setNewestCoins((prevCoins) => [newCoin, ...prevCoins.slice(0, 4)]); // Add the new coin to the newest coins list
        // });

        // return () => {
        //     socket.disconnect(); // Clean up the connection when the component unmounts
        // };
    }, []);

    return (
        <>
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
                <main>
                    <div className="container">
                        <section
                            className="mainContent details"
                            // style={{ width: '75%' }}
                        >
                            <MemesCardContainer coins={coins} />
                        </section>
                        <section className="sideContent">
                            <Side />
                        </section>
                    </div>
                </main>
            )}
        </>
    );
}
