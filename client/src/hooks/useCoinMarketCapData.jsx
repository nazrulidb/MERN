import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import tradingHubAbi from '../components/common/constants/tradingHubABI.json';

const useMarketCapData = (coins) => {
    const [coinsWithMarketCap, setCoinsWithMarketCap] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const updateMarketCap = async () => {
            if (!coins || coins.length === 0) {
                setIsLoading(false);
                return;
            }

            try {
                // Make sure your provider is correctly initialized
                const provider = new ethers.providers.JsonRpcProvider(
                    'https://mainnet.base.org'
                );

                // const provider = new ethers.providers.JsonRpcProvider(
                //     'https://data-seed-prebsc-1-s1.binance.org:8545'
                // );

                // Create contract with trading hub address

                //bsn
                // const contract = new ethers.Contract(
                //     '0x6FA4134902678490698cDd80FB96B5580b03b2a9', // Trading hub address
                //     tradingHubAbi,
                //     provider
                // );

                const contract = new ethers.Contract(
                    '0xcF819F72D24F1802222D220Fa27Ac4A14455D5F3', // Trading hub address
                    tradingHubAbi,
                    provider
                );

                const updatedCoins = await Promise.all(
                    coins.map(async (coin) => {
                        try {
                            // Use the contract to get marketcap for each coin address
                            const marketcap = await contract.tokenMarketCap(
                                coin.address
                            );

                            // Convert from Wei to Ether
                            const marketCapInEther = parseFloat(
                                ethers.utils.formatEther(marketcap)
                            );

                            return {
                                ...coin,
                                marketcap: marketCapInEther
                            };
                        } catch (error) {
                            console.error(
                                `Error fetching market cap for ${coin.address}:`,
                                error
                            );
                            return coin;
                        }
                    })
                );

                setCoinsWithMarketCap(updatedCoins);
            } catch (error) {
                console.error('Error updating market caps:', error);
            } finally {
                setIsLoading(false);
            }
        };

        updateMarketCap();
    }, [coins]);

    return { isLoading, coinsWithMarketCap };
};

export default useMarketCapData;
