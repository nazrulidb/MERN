import React from 'react';
import './BondingCurveProgress.css';
import { ethers } from 'ethers'; // Make sure ethers is imported

// const BondingCurveProgress = ({
//     marketCap,
//     bondingProgress,
//     bondingLiquidity,
//     remainingEthCapacity
// }) => {
//     console.log(
//         'Raw bondingProgress from contract:',
//         bondingProgress?.toString()
//     );
//     console.log('Raw marketCap:', marketCap?.toString());

//     // Use marketCap calculation since we know it's more reliable
//     const marketCapInEther = marketCap?._isBigNumber
//         ? parseFloat(ethers.utils.formatEther(marketCap))
//         : parseFloat(marketCap);

//     // Calculate progress percentage (marketCap out of 30 ETH)
//     const progress = Math.min((marketCapInEther / 0.1) * 100, 100);
//     const progressFormatted = progress.toFixed(5);

//     // const liquidityInEth = ethers.utils.formatEther(bondingLiquidity || '0');
//     // const remainingTokens = ethers.utils.formatEther(tokensLeftForSale || '0');

//     // Format marketCap for display
//     const formatMarketCap = (value) => {
//         if (value < 0.01) {
//             return value.toFixed(4); // Show more decimals for very small numbers
//         }
//         return value >= 1000
//             ? `${(value / 1000).toFixed(1)}k`
//             : value.toFixed(3);
//     };

//     return (
//         <div className="bonding-curve-container">
//             <h2>Bonding Curve Progress</h2>
//             <div className="info-message">
//                 🚀 Get ready for liftoff! At 30 ETH, we're graduating to
//                 PancakeSwap with enhanced liquidity and trading features! ✨
//             </div>
//             <div className="progress-bar">
//                 <div
//                     className="progress"
//                     style={{ width: `${bondingProgress}%` }}
//                 />
//                 <span className="current-value">{marketCap}</span>
//                 <span className="target-value">30ETH</span>
//             </div>
//             <div className="stats">
//                 <div className="stat">
//                     <span>Bonding Curve Liquidity</span>
//                     <span>{bondingLiquidity} ETH</span>
//                 </div>
//                 <div className="stat">
//                     <span>ETH Remaining Until Migration</span>
//                     <span>{Number(remainingEthCapacity).toFixed(4)} ETH</span>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default BondingCurveProgress;

const BondingCurveProgress = ({
    marketCap,
    bondingProgress,
    bondingLiquidity,
    remainingEthCapacity
}) => {
    const formatBigNumber = (value) => {
        if (!value) return '0';
        return Number(value).toFixed(4);
    };

    const formatProgress = (value) => {
        if (!value) return '0';
        return Number(formatBigNumber(value)).toFixed(5);
    };

    // Calculate progress percentage based on current market cap vs target (0.1 ETH)
    const calculateProgress = () => {
        const currentValue = Number(marketCap);
        const targetValue = 30; // Your test target value
        const progress = (currentValue / targetValue) * 100;
        // Clamp the value between 0 and 100
        return Math.min(Math.max(progress, 0), 100).toFixed(5);
    };

    const progressPercentage = calculateProgress();

    return (
        <div className="bonding-curve-container">
            <div className="bonding-curve-content">
                <div className="bonding-header">
                    <h2>Bonding Curve Progress</h2>
                    <span className="progress-percentage">
                        {progressPercentage}%
                    </span>
                </div>

                <div className="graduation-message">
                    <span className="graduation-emoji">🚀</span>
                    <p>
                        Get ready for liftoff! At 30 ETH, we're graduating to
                        PancakeSwap with enhanced liquidity and trading
                        features! ✨
                    </p>
                </div>

                <div className="progress-container">
                    <span className="progress-start">
                        {formatBigNumber(marketCap)} ETH
                    </span>
                    <span className="progress-end">30 ETH</span>
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{
                                width: `${progressPercentage}%`,
                                backgroundColor: '#0066ff' // Match the blue color from your screenshot
                            }}
                        />
                    </div>
                </div>

                <div className="info-container">
                    <div className="info-item">
                        <p className="info-label">Bonding Curve Liquidity</p>
                        <p className="info-value">
                            {formatBigNumber(bondingLiquidity)} ETH
                        </p>
                    </div>
                    <div className="info-item text-right">
                        <p className="info-label">
                            ETH Remaining Until Migration
                        </p>
                        <p className="info-value">
                            {formatBigNumber(remainingEthCapacity)} ETH
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BondingCurveProgress;
