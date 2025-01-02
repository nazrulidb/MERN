import React, { useEffect, useState } from 'react';
import './side.css';
import Slider from 'react-slick';
import Heading from '../../../common/heading/Heading';
import { gallery } from '../../../../dummyData';
import Tpost from '../Tpost/Tpost';
import NewCoins from '../social/NewCoins';
import KingOfHill from '../kingOfHill/KingofHill';
import useMarketCapData from '../../../../hooks/useCoinMarketCapData';
import LootBotCTA from './LootBotCTA';

const Side = () => {
    const [coins, setCoins] = useState([]);
    const [newestCoins, setNewestCoins] = useState([]);
    // const [topMarketCap, setTopMarketCap] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };
    const { isLoading, coinsWithMarketCap } = useMarketCapData(coins);
    // console.log(coinsWithMarketCap);

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

    function getTopFiveCoins(coins) {
        const sortedCoins = coins.sort((a, b) => {
            const marketCapA = parseFloat(a.marketcap);
            const marketCapB = parseFloat(b.marketcap);
            return marketCapB - marketCapA;
        });
        return sortedCoins.slice(0, 5);
    }

    const topMarketCap = getTopFiveCoins(coinsWithMarketCap);

    useEffect(() => {
        fetchCoins();
        fetchNewestCoins();
    }, []);

    return (
        <>
            <KingOfHill topMarketCap={topMarketCap} isLoading={isLoading} />
            <Tpost />
            {/* <Heading title="New Coins" /> */}
            <NewCoins newCoins={newestCoins} />
            {/* <Heading title="Telegram" />
            <LootBotCTA /> */}
        </>
    );
};

export default Side;
