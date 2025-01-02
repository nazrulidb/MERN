import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './HoldersDistribution.css';
const tradingHubAbi = require('../../common/constants/tradingHubABI.json');

const HoldersDistribution = ({ tokenAddress }) => {
    const [holders, setHolders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    //bsc
    // const TRADING_HUB =
    //     '0x6FA4134902678490698cDd80FB96B5580b03b2a9'.toLowerCase();

    //base
    const TRADING_HUB =
        '0xcF819F72D24F1802222D220Fa27Ac4A14455D5F3'.toLowerCase();

    const formatHolderDisplay = (holder) => {
        return {
            address: `${holder.holder.slice(0, 6)}...${holder.holder.slice(
                -4
            )}`,
            balance: ethers.utils.formatEther(holder.balance),
            percentage: (holder.percentage / 1000).toFixed(1)
        };
    };

    useEffect(() => {
        const fetchHolders = async () => {
            try {
                const provider = new ethers.providers.JsonRpcProvider(
                    'https://mainnet.base.org'
                );

                // const provider = new ethers.providers.JsonRpcProvider(
                //     'https://data-seed-prebsc-1-s1.binance.org:8545'
                // );
                const contract = new ethers.Contract(
                    TRADING_HUB,
                    tradingHubAbi,
                    provider
                );

                const holdersData = await contract.getTopHolders(
                    tokenAddress,
                    10
                );

                // Filter out trading hub and zero balances
                let formattedHolders = holdersData
                    .filter(
                        (holder) =>
                            holder.holder.toLowerCase() !== TRADING_HUB &&
                            parseFloat(
                                ethers.utils.formatEther(holder.balance)
                            ) > 0
                    )
                    .map(formatHolderDisplay)
                    .sort(
                        (a, b) => parseFloat(b.balance) - parseFloat(a.balance)
                    );

                setHolders(formattedHolders);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching holders:', error);
                setIsLoading(false);
            }
        };

        if (tokenAddress) {
            fetchHolders();
        }
    }, [tokenAddress]);

    const InfoIcon = () => (
        <svg
            className="info-banner-icon"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
    );

    if (isLoading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="holders-list">
            {holders.length === 0 ? (
                <div className="no-holders">No holders found</div>
            ) : (
                <>
                    {holders.length === 1 &&
                        parseFloat(holders[0].percentage) > 90 && (
                            <div className="info-message">
                                <span>
                                    ℹ️ This token was recently created. The
                                    current holder percentage will decrease as
                                    more users make purchases through the
                                    bonding curve.
                                </span>
                            </div>
                        )}
                    {holders.map((holder, index) => (
                        <div key={index} className="holder-item">
                            <div className="rank-info">
                                <span className="rank">#{index + 1}</span>
                                <span className="holder-address">
                                    {holder.address}
                                </span>
                            </div>
                            <div className="holder-stats">
                                <span className="token-amount">
                                    {parseFloat(
                                        holder.balance
                                    ).toLocaleString()}
                                </span>
                                <span className="percentage">
                                    {holder.percentage}%
                                </span>
                            </div>
                        </div>
                    ))}
                </>
            )}
        </div>
    );
};

export default HoldersDistribution;
