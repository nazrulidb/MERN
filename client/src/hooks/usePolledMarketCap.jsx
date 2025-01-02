import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
const tradingHubAbi = require('../components/common/constants/tradingHubABI.json');

const usePolledMarketCap = (address, interval = 10000) => {
    const [marketCap, setMarketCap] = useState(null);

    useEffect(() => {
        const fetchMarketCap = async () => {
            try {
                const provider = new ethers.providers.JsonRpcProvider(
                    'https://mainnet.base.org'
                );

                // const provider = new ethers.providers.JsonRpcProvider(
                //     'https://data-seed-prebsc-1-s1.binance.org:8545'
                // );
                const contract = new ethers.Contract(
                    address,
                    tradingHubAbi,
                    provider
                );

                const marketcap = await contract.tokenMarketCap(address);
                const formattedMarketCap = parseFloat(
                    ethers.utils.formatEther(marketcap)
                );
                setMarketCap(formattedMarketCap);
            } catch (error) {
                console.error('Error fetching market cap:', error);
            }
        };

        // Fetch immediately
        fetchMarketCap();

        // Then set up polling
        const pollInterval = setInterval(fetchMarketCap, interval);

        return () => clearInterval(pollInterval);
    }, [address]);

    return marketCap;
};

export default usePolledMarketCap;
