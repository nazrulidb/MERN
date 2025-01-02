import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faDollarSign,
    faGlobe,
    faCopy,
    faCheck
} from '@fortawesome/free-solid-svg-icons';
import { faTwitter, faTelegram } from '@fortawesome/free-brands-svg-icons';
import './CoinHeader.css';
import { truncateAddress } from '../ReviewsComponent/utils';

const CoinHeader = ({
    imgSrc,
    currentCoin,
    coin,
    handleShare,
    handleGoBack
}) => {
    const [copied, setCopied] = useState(false);
    const contractAddress = currentCoin.address; // Replace with actual contract address
    // Helper function to ensure URLs have proper format
    const formatUrl = (url) => {
        if (!url) return '#';
        if (url.startsWith('http://') || url.startsWith('https://')) {
            return url;
        }
        return `https://${url}`;
    };

    const handleCopyAddress = async () => {
        try {
            await navigator.clipboard.writeText(contractAddress);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className="header-card">
            <div className="header-content">
                <div className="coin-info">
                    <img src={imgSrc} alt="Coin" className="coin-image" />
                    <div className="coin-details">
                        <h1 className="coin-name">
                            {currentCoin && currentCoin.name}
                        </h1>
                        <p className="coin-ticker">
                            Ticker: {currentCoin && currentCoin.ticker}
                        </p>
                        <p className="coin-marketcap">
                            Market Cap: ${coin && coin.formattedMarketCap}
                        </p>
                        <div
                            className="contract-address"
                            onClick={handleCopyAddress}
                        >
                            <span>CA: {truncateAddress(contractAddress)}</span>
                            <FontAwesomeIcon
                                icon={copied ? faCheck : faCopy}
                                className={`copy-icon ${
                                    copied ? 'copied' : ''
                                }`}
                            />
                        </div>
                    </div>

                    <div className="icon-links">
                        {coin?.twitter && (
                            <a
                                href={formatUrl(coin.twitter)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="icon-link"
                            >
                                <FontAwesomeIcon icon={faTwitter} size="lg" />
                            </a>
                        )}
                        {coin?.telegram && (
                            <a
                                href={formatUrl(coin.telegram)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="icon-link"
                            >
                                <FontAwesomeIcon icon={faTelegram} size="lg" />
                            </a>
                        )}
                        {coin?.website && (
                            <a
                                href={formatUrl(coin.website)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="icon-link"
                            >
                                <FontAwesomeIcon icon={faGlobe} size="lg" />
                            </a>
                        )}
                    </div>
                </div>
                <div className="button-group">
                    <button
                        onClick={handleShare}
                        className="action-button share-button"
                    >
                        Share
                    </button>
                    <button
                        onClick={handleGoBack}
                        className="action-button back-button"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CoinHeader;
