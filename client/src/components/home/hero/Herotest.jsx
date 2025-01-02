import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSearch,
    faTimes,
    faSpinner,
    faPlus
} from '@fortawesome/free-solid-svg-icons';
import { useWeb3ModalAccount } from '@web3modal/ethers5/react';
import { ethers } from 'ethers';
import axios from 'axios';
import './hero.css';
const tokenFactoryAbi = require('../../common/constants/tokenFactoryABI.json');

const Header = ({ newMemeAddress, setNewMemeAddress }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState(null);
    const { address } = useWeb3ModalAccount();

    const [formData, setFormData] = useState({
        name: '',
        ticker: '',
        description: '',
        creator: address,
        twitter: '',
        website: '',
        telegram: '',
        img: null
    });

    useEffect(() => {
        if (searchQuery) {
            const fetchSearchResults = async () => {
                try {
                    const response = await axios.get('/api/search', {
                        params: { query: searchQuery }
                    });
                    setSearchResults(response.data);
                    setShowDropdown(true);
                } catch (error) {
                    console.error('Error searching:', error);
                }
            };
            fetchSearchResults();
        } else {
            setShowDropdown(false);
        }
    }, [searchQuery]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await createNewMeme(formData.name, formData.ticker);
            if (result) {
                const data = new FormData();
                Object.entries({
                    ...formData,
                    creator: address,
                    address: result.address
                }).forEach(([key, value]) => data.append(key, value));

                const response = await fetch('/api/coins', {
                    method: 'POST',
                    body: data
                });

                if (!response.ok) throw new Error('Failed to create coin');
                showNotification('Coin successfully created!', 'success');
                setIsModalOpen(false);
                resetForm();
            }
        } catch (error) {
            showNotification(error.message || 'Failed to create coin', 'error');
        } finally {
            setLoading(false);
        }
    };

    const createNewMeme = async (tokenName, symbol) => {
        if (!window.ethereum) throw new Error('MetaMask is not installed');

        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const contract = new ethers.Contract(
            '0xC16200176FE2E05B5804B263162a912EBA301F02',
            tokenFactoryAbi,
            signer
        );

        const tx = await contract.createNewMeme(tokenName, symbol, {
            value: ethers.utils.parseEther('0.01')
        });

        const receipt = await tx.wait();
        const event = receipt.events.find((e) => e.event === 'NewMemeCreated');

        if (event) {
            const newMemeAddress = event.args.token;
            setNewMemeAddress(newMemeAddress);
            return { success: true, address: newMemeAddress };
        }
        return false;
    };

    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 6000);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            ticker: '',
            description: '',
            creator: address,
            twitter: '',
            website: '',
            telegram: '',
            img: null
        });
    };

    return (
        <header className="header-container">
            <div className="header-content">
                <button
                    className="create-btn"
                    onClick={() => setIsModalOpen(true)}
                >
                    <FontAwesomeIcon icon={faPlus} />
                    Create New Coin
                </button>

                <div className="search-wrapper">
                    <div className="search-input-container">
                        <FontAwesomeIcon
                            icon={faSearch}
                            className="search-icon"
                        />
                        <input
                            type="text"
                            placeholder="Search coins..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                    </div>

                    {showDropdown && searchResults.length > 0 && (
                        <div className="search-results">
                            {searchResults.map((coin) => (
                                <Link
                                    key={coin._id}
                                    to={`/SinglePage/${coin._id}`}
                                    className="search-result-item"
                                    onClick={() => setShowDropdown(false)}
                                >
                                    <span className="coin-name">
                                        {coin.name}
                                    </span>
                                    <span className="coin-ticker">
                                        {coin.ticker}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {isModalOpen && (
                <div
                    className="modal-overlay"
                    onClick={() => !loading && setIsModalOpen(false)}
                >
                    <div
                        className="modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header">
                            <h2>Create New Coin</h2>
                            <button
                                className="close-modal"
                                onClick={() =>
                                    !loading && setIsModalOpen(false)
                                }
                            >
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="create-form">
                            <div className="form-grid">
                                <input
                                    type="text"
                                    placeholder="Coin Name"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            name: e.target.value
                                        })
                                    }
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Ticker"
                                    value={formData.ticker}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            ticker: e.target.value
                                        })
                                    }
                                    required
                                />
                                <textarea
                                    placeholder="Description"
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            description: e.target.value
                                        })
                                    }
                                    required
                                    className="span-full"
                                />
                                <input
                                    type="text"
                                    placeholder="Twitter URL"
                                    value={formData.twitter}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            twitter: e.target.value
                                        })
                                    }
                                />
                                <input
                                    type="text"
                                    placeholder="Website URL"
                                    value={formData.website}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            website: e.target.value
                                        })
                                    }
                                />
                                <input
                                    type="text"
                                    placeholder="Telegram URL"
                                    value={formData.telegram}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            telegram: e.target.value
                                        })
                                    }
                                />
                                <input
                                    type="file"
                                    accept="image/jpeg"
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            img: e.target.files[0]
                                        })
                                    }
                                    className="file-input span-full"
                                />
                            </div>

                            <button
                                type="submit"
                                className="submit-btn"
                                disabled={loading}
                            >
                                {loading ? (
                                    <FontAwesomeIcon icon={faSpinner} spin />
                                ) : (
                                    'Create Coin'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {notification && (
                <div className={`notification ${notification.type}`}>
                    {notification.message}
                </div>
            )}
        </header>
    );
};

export default Header;
