import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './BondingCurveProgress.css';
const tradingHubAbi = require('../../common/constants/tradingHubABI.json');
const tokenAbi = require('../../common/constants/tokenABI.json');

const TRADING_HUB_ABI = [
    'function tokenData(address) view returns (uint256 currentMarketCapEther, bool migrated)',
    'function migrationEthValue() view returns (uint256)',
    'function tokenMigrated(address) view returns (bool)'
];

const ERC20_ABI = [
    'function totalSupply() view returns (uint256)',
    'function balanceOf(address) view returns (uint256)'
];

const MemeTokenProgress = ({ tokenAddress, tradingHubAddress }) => {
    const [tokenData, setTokenData] = useState({
        marketCap: 0,
        isMigrated: false,
        totalSupply: 0,
        migrationThreshold: 25000,
        currentBalance: 0
    });

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTokenData = async () => {
            if (!window.ethereum) {
                throw new Error('MetaMask is not installed');
            }

            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            try {
                const tradingHub = new ethers.Contract(
                    tradingHubAddress,
                    tradingHubAbi,
                    provider
                );
                const tokenContract = new ethers.Contract(
                    tokenAddress,
                    tokenAbi,
                    provider
                );

                const [tokenDataResult, migrationValue, totalSupply] =
                    await Promise.all([
                        tradingHub.tokenData(tokenAddress),
                        tradingHub.migrationEthValue(),
                        tokenContract.totalSupply()
                    ]);

                setTokenData({
                    marketCap: parseFloat(
                        ethers.utils.formatUnits(
                            tokenDataResult.currentMarketCapEther,
                            18
                        )
                    ),
                    isMigrated: tokenDataResult.migrated,
                    totalSupply: parseFloat(
                        ethers.utils.formatUnits(totalSupply, 18)
                    ),
                    migrationThreshold: parseFloat(
                        ethers.utils.formatUnits(migrationValue, 18)
                    )
                });

                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching token data:', error);
                setIsLoading(false);
            }
        };

        // Check if addresses are available before calling fetchTokenData
        if (tokenAddress && tradingHubAddress) {
            fetchTokenData();
        }
    }, [tokenAddress, tradingHubAddress]);

    const formatEth = (value) => {
        return value >= 1000
            ? `${(value / 1000).toFixed(1)}k`
            : value.toFixed(2);
    };

    const formatTokens = (value) => {
        return value.toLocaleString(undefined, {
            maximumFractionDigits: 0
        });
    };

    const progress = Math.min(
        (tokenData.marketCap / tokenData.migrationThreshold) * 100,
        100
    );
    const tokenPrice = tokenData.marketCap / tokenData.totalSupply;
    const tokensInBondingCurve = Math.max(
        0,
        tokenData.totalSupply - 200_000_000
    );

    if (isLoading) {
        return (
            <div className="token-progress-card">
                <div className="loading-skeleton">
                    <div className="loading-line"></div>
                    <div className="loading-line"></div>
                    <div className="loading-line"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="token-progress-card">
            {tokenData.isMigrated && (
                <div className="migration-alert">
                    <p>This token has been migrated to DEX</p>
                </div>
            )}

            <div className="progress-header">
                <h2 className="progress-title">Migration Progress</h2>
                <span className="progress-percentage">
                    {progress.toFixed(2)}%
                </span>
            </div>

            <div className="progress-container">
                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <div className="progress-labels">
                    <span>{formatEth(tokenData.marketCap)} ETH</span>
                    <span>{formatEth(tokenData.migrationThreshold)} ETH</span>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-item">
                    <div className="stat-label">
                        Current Token Price
                        <span className="info-icon">ℹ️</span>
                    </div>
                    <p className="stat-value">{tokenPrice.toFixed(8)} ETH</p>
                </div>

                <div className="stat-item right">
                    <div className="stat-label">Tokens Available</div>
                    <p className="stat-value">
                        {formatTokens(tokensInBondingCurve)}
                    </p>
                </div>
            </div>

            <div className="distribution-section">
                <h3 className="distribution-title">Token Distribution</h3>
                <div className="distribution-list">
                    <div className="distribution-item">
                        <span>Bonding Curve Pool</span>
                        <span>{formatTokens(tokensInBondingCurve)} tokens</span>
                    </div>
                    <div className="distribution-item">
                        <span>Reserved for DEX</span>
                        <span>200,000,000 tokens</span>
                    </div>
                    <div className="distribution-item total">
                        <span>Total Supply</span>
                        <span>
                            {formatTokens(tokenData.totalSupply)} tokens
                        </span>
                    </div>
                </div>
            </div>

            {progress >= 90 && !tokenData.isMigrated && (
                <div className="warning-alert">
                    <p>
                        Near migration threshold! After reaching{' '}
                        {formatEth(tokenData.migrationThreshold)} ETH, token
                        will migrate to DEX with 200M tokens for liquidity.
                    </p>
                </div>
            )}
        </div>
    );
};

export default MemeTokenProgress;
