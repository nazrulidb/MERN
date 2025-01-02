import React from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faTelegram } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { faTwitter, faTelegram } from '@fortawesome/free-brands-svg-icons';
import './LootBotCTA.css';

const LootBotCTA = () => {
    return (
        <div className="cta-container">
            <div className="cta-content">
                <h2 className="cta-title">
                    <FontAwesomeIcon icon={faTelegram} className="title-icon" />
                    Snipe with LootBot!
                </h2>
                <div className="pulse-container">
                    <a
                        href="https://t.me/BondingTestBot"
                        className="cta-button"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <FontAwesomeIcon icon={faTelegram} size="lg" />
                        Loot Bot
                    </a>
                    <div className="pulse-ring"></div>
                </div>
            </div>
        </div>
    );
};

export default LootBotCTA;
