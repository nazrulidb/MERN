import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import TransactionModal from './TransactionModal';
import './BuySellWidget.css';
const tradingHubAbi = require('../../common/constants/tradingHubABI.json');
const tokenAbi = require('../../common/constants/tokenABI.json');

const BuySellWidget = ({ currentCoin }) => {
    const MIN_SELL_AMOUNT = ethers.utils.parseEther('0.00025');
    const [mode, setMode] = useState('buy');
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [isMigrated, setIsMigrated] = useState(false);
    const [userBalances, setUserBalances] = useState({
        eth: '0',
        token: '0'
    });
    const [minReceived, setMinReceived] = useState('0');
    const [notification, setNotification] = useState({
        show: false,
        type: 'success',
        message: ''
    });
    const [modal, setModal] = useState({
        isOpen: false,
        type: '',
        message: '',
        txHash: ''
    });

    useEffect(() => {
        const checkMigrationStatus = async () => {
            if (!window.ethereum || !currentCoin?.address) return;

            try {
                const provider = new ethers.providers.Web3Provider(
                    window.ethereum
                );
                //bnb
                // const tradingHubAddress =
                //     '0x6FA4134902678490698cDd80FB96B5580b03b2a9';

                //base
                const tradingHubAddress =
                    '0xcF819F72D24F1802222D220Fa27Ac4A14455D5F3';

                const contract = new ethers.Contract(
                    tradingHubAddress,
                    tradingHubAbi,
                    provider
                );

                const migrationStatus = await contract.tokenMigrated(
                    currentCoin.address
                );
                setIsMigrated(migrationStatus);
            } catch (error) {
                console.error('Error checking migration status:', error);
            }
        };

        checkMigrationStatus();
    }, [currentCoin]);

    useEffect(() => {
        const fetchBalances = async () => {
            if (!window.ethereum || !currentCoin?.address) return;

            try {
                const provider = new ethers.providers.Web3Provider(
                    window.ethereum
                );
                const signer = provider.getSigner();
                const address = await signer.getAddress();

                // Get ETH balance and format
                const ethBalance = await provider.getBalance(address);
                const formattedEthBalance = Number(
                    ethers.utils.formatEther(ethBalance)
                ).toFixed(4);

                // Get token balance and format
                const tokenContract = new ethers.Contract(
                    currentCoin.address,
                    tokenAbi,
                    provider
                );
                const tokenBalance = await tokenContract.balanceOf(address);
                const formattedTokenBalance = Number(
                    ethers.utils.formatEther(tokenBalance)
                ).toFixed(4);

                setUserBalances({
                    eth: formattedEthBalance,
                    token: formattedTokenBalance
                });
            } catch (error) {
                console.error('Error fetching balances:', error);
            }
        };

        fetchBalances();
        const interval = setInterval(fetchBalances, 10000);
        return () => clearInterval(interval);
    }, [currentCoin]);

    // Calculate minimum received amount
    useEffect(() => {
        const calculateMinReceived = async () => {
            if (!inputValue || !currentCoin?.address) return;

            try {
                const provider = new ethers.providers.Web3Provider(
                    window.ethereum
                );
                // const tradingHubAddress =
                //     '0x6FA4134902678490698cDd80FB96B5580b03b2a9';

                const tradingHubAddress =
                    '0xcF819F72D24F1802222D220Fa27Ac4A14455D5F3';
                const contract = new ethers.Contract(
                    tradingHubAddress,
                    tradingHubAbi,
                    provider
                );

                if (mode === 'buy') {
                    const marketCap = await contract.getBondingCurveLiquidity(
                        currentCoin.address
                    );
                    const tokenContract = new ethers.Contract(
                        currentCoin.address,
                        tokenAbi,
                        provider
                    );
                    const totalSupply = await tokenContract.totalSupply();

                    const currentEthCap = parseFloat(
                        ethers.utils.formatEther(marketCap)
                    );
                    const currentTokens = parseFloat(
                        ethers.utils.formatUnits(totalSupply, 18)
                    );
                    const buyAmount = parseFloat(inputValue);

                    // Calculate estimate with safety checks
                    let roughEstimate;
                    if (currentEthCap <= 0 || currentTokens <= 0) {
                        roughEstimate = 0;
                    } else {
                        // Apply curve factor for larger purchases
                        const scaleFactor = 1 + buyAmount / currentEthCap;
                        roughEstimate =
                            (currentTokens * buyAmount) /
                            (currentEthCap * scaleFactor);
                    }

                    // Apply 2% slippage
                    const minReceived = Math.max(0, roughEstimate * 0.98);

                    // Format to reasonable decimal places
                    setMinReceived(minReceived.toFixed(4));
                } else {
                    // For sells, handle both direct input and percentage clicks
                    const marketCap = await contract.getBondingCurveLiquidity(
                        currentCoin.address
                    );
                    const tokenContract = new ethers.Contract(
                        currentCoin.address,
                        tokenAbi,
                        provider
                    );
                    const userBalance = await tokenContract.balanceOf(
                        await provider.getSigner().getAddress()
                    );
                    const totalSupply = await tokenContract.totalSupply();
                    // Calculate sell amount
                    let sellAmount;
                    let percentageOfTotal;
                    if (inputValue.includes('%')) {
                        const percentage = parseFloat(inputValue) / 100;
                        sellAmount = userBalance
                            .mul(
                                ethers.BigNumber.from(
                                    Math.floor(percentage * 100)
                                )
                            )
                            .div(100);
                        percentageOfTotal = percentage;
                    } else {
                        sellAmount = ethers.utils.parseUnits(inputValue, 18);
                        percentageOfTotal = sellAmount
                            .mul(100)
                            .div(totalSupply);
                    }

                    // Calculate expected return based on market cap percentage
                    const marketCapBN = ethers.BigNumber.from(marketCap);
                    const expectedReturn = marketCapBN
                        .mul(percentageOfTotal)
                        .div(100);

                    // Apply 2% slippage tolerance
                    const minReceived = expectedReturn.mul(98).div(100);

                    setMinReceived(ethers.utils.formatEther(minReceived));
                }
            } catch (error) {
                console.error('Error calculating minimum received:', error);
                setMinReceived('0');
            }
        };

        calculateMinReceived();
    }, [inputValue, mode, currentCoin]);

    // Add handler for percentage buttons

    const handleModeChange = (newMode) => {
        setMode(newMode);
        setInputValue('');
    };

    const handleInputChange = (event) => {
        const value = event.target.value.replace(/[^0-9.]/g, '');
        // Validate input based on user's balance
        if (mode === 'buy') {
            if (Number(value) > Number(userBalances.eth)) {
                showNotification('error', 'Insufficient ETH balance');
                return;
            }
        } else {
            if (Number(value) > Number(userBalances.token)) {
                showNotification('error', 'Insufficient token balance');
                return;
            }
        }
        setInputValue(value);
    };

    const getQuickSelectValues = () => {
        if (mode === 'buy') {
            // Keep your existing buy values - this works well
            return [
                { label: '0.1 ETH', value: '0.1' },
                { label: '0.5 ETH', value: '0.5' },
                { label: '0.69 ETH', value: '0.69' },
                { label: '1 ETH', value: '1' },
                { label: '10 ETH', value: '10' }
            ];
        } else {
            // Improved sell percentage calculation
            return [25, 50, 75, 100].map((percentage) => ({
                label: `${percentage}%`,
                value: percentage,
                isPercentage: true
            }));
        }
    };

    const handleQuickSelect = async (item) => {
        try {
            if (mode === 'buy') {
                setInputValue(item.value);
            } else if (item.isPercentage) {
                const provider = new ethers.providers.Web3Provider(
                    window.ethereum
                );
                const tokenContract = new ethers.Contract(
                    currentCoin.address,
                    tokenAbi,
                    provider
                );

                // Get current balance
                const balance = await tokenContract.balanceOf(
                    await provider.getSigner().getAddress()
                );

                // Calculate token amount based on percentage
                const amount = balance.mul(item.value).div(100);

                // Format with proper decimals
                setInputValue(ethers.utils.formatUnits(amount, 18));
            }
        } catch (error) {
            console.error('Error handling quick select:', error);
        }
    };

    const makeBuyCall = async () => {
        setLoading(true);
        try {
            if (!window.ethereum) {
                throw new Error('MetaMask is not installed');
            }

            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            // Debug: Check user's ETH balance
            const address = await signer.getAddress();
            const balance = await provider.getBalance(address);

            //bsc
            // const contractAddress =
            //     '0x6FA4134902678490698cDd80FB96B5580b03b2a9';

            const contractAddress =
                '0xcF819F72D24F1802222D220Fa27Ac4A14455D5F3';

            const contract = new ethers.Contract(
                contractAddress,
                tradingHubAbi,
                signer
            );

            // Debug: Estimate gas before transaction
            const gasEstimate = await contract.estimateGas.buy(
                currentCoin.address,
                0,
                await signer.getAddress(),
                { value: ethers.utils.parseEther(inputValue) }
            );

            const tx = await contract.buy(
                currentCoin.address,
                0,
                await signer.getAddress(),
                {
                    value: ethers.utils.parseEther(inputValue),
                    gasLimit: gasEstimate.mul(120).div(100) // Add 20% buffer to gas estimate
                }
            );

            const receipt = await tx.wait();

            showNotification('success', 'Transaction successful!', tx.hash);

            // Save trade info
            const tradeInfo = {
                walletAddress: await signer.getAddress(),
                tradeType: 'Buy',
                amountETH: inputValue,
                tokenAddress: currentCoin.address,
                transactionId: tx.hash
            };

            await fetch('/api/trades/new', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(tradeInfo)
            });
        } catch (error) {
            console.error('Detailed Error:', {
                message: error.message,
                code: error.code,
                data: error.data,
                transaction: error.transaction,
                receipt: error.receipt
            });

            // More user-friendly error messages
            let errorMessage = 'Transaction failed!';
            if (error.code === 'INSUFFICIENT_FUNDS') {
                errorMessage = 'Insufficient funds for transaction!';
            } else if (error.code === 'UNPREDICTABLE_GAS_LIMIT') {
                errorMessage =
                    'Transaction would fail - please check input amounts';
            }

            showNotification('error', errorMessage);
        }
        setLoading(false);
    };

    const makeSellCall = async () => {
        try {
            if (!window.ethereum) {
                throw new Error('MetaMask is not installed');
            }

            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            // const contractAddress =
            //     '0x6FA4134902678490698cDd80FB96B5580b03b2a9';

            //base
            const contractAddress =
                '0xcF819F72D24F1802222D220Fa27Ac4A14455D5F3';

            const contractABI = {
                abi: tradingHubAbi
            };

            const contract = new ethers.Contract(
                contractAddress,
                contractABI.abi,
                signer
            );

            // console.log('This is the memeAddress', newMemeAddress);
            const tokenContract = new ethers.Contract(
                currentCoin.address,
                tokenAbi,
                signer
            ); // Assuming you
            // console.log('This is the token contracts', tokenContract);

            const token = currentCoin.address; // ENS name or address

            const receiver = await signer.getAddress(); // Get the connected wallet address
            // Convert input value to BigNumber with proper decimals
            const amountBigNumber = ethers.utils.parseEther(inputValue);

            if (isNaN(Number(inputValue))) {
                showNotification(
                    'error',
                    'Invalid amount. Please enter a valid number.'
                );
                return;
            }

            if (amountBigNumber.lt(MIN_SELL_AMOUNT)) {
                showNotification(
                    'error',
                    'Please enter an amount greater than 0.00025 ETH worth of tokens'
                );
                return;
            }

            // Check current allowance
            const allowance = await tokenContract.allowance(
                receiver,
                contract.address
            );

            // If allowance is less than the amount, approve the tradingHub contract
            if (allowance.lt(amountBigNumber)) {
                showNotification(
                    'info',
                    'Approving tokens... Please confirm the transaction in your wallet'
                );

                try {
                    const approveTx = await tokenContract.approve(
                        contract.address,
                        ethers.constants.MaxUint256
                    );
                    showNotification(
                        'info',
                        'Waiting for approval confirmation...'
                    );
                    await approveTx.wait();
                    showNotification(
                        'success',
                        'Approval successful! Starting sell transaction...'
                    );
                } catch (error) {
                    showNotification('error', 'Token approval failed');
                    setLoading(false);
                    return;
                }
            }

            // Show notification for sell transaction
            showNotification(
                'info',
                'Selling tokens... Please confirm the transaction in your wallet'
            );
            const tx = await contract.sell(
                tokenContract.address,
                receiver,
                amountBigNumber,
                { gasLimit: 1000000 }
            );

            showNotification(
                'info',
                'Waiting for sell transaction confirmation...'
            );
            await tx.wait();

            // Replace the setNotification with showNotification
            showNotification('success', 'Transaction successful!', tx.hash);

            // Save the trade information to the backend
            const tradeInfo = {
                walletAddress: receiver,
                tradeType: 'Sell',
                amountETH: 10, // Amount in tokens // Amount in tokens
                tokenAddress: token,
                transactionId: tx.hash
            };

            const response = await fetch('/api/trades/new', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(tradeInfo)
            });

            if (!response.ok) {
                throw new Error('Failed to save trade information');
            }
        } catch (error) {
            console.error('Error making sell call:', error);
            showNotification('error', 'Transaction failed!');
        } finally {
            setLoading(false); // Hide loading screen
        }
    };

    const showNotification = (type, message, txHash = '') => {
        setModal({
            isOpen: true,
            type,
            message,
            txHash
        });
    };
    const handleCloseModal = () => {
        setModal({
            isOpen: false,
            type: '',
            message: '',
            txHash: ''
        });
    };

    if (isMigrated) {
        return (
            <div className="widget-container migrated-notice">
                <div className="migration-message">
                    <h3>Trading Migrated to PancakeSwap</h3>
                    <p>
                        This token has been migrated and trading is now live on
                        PancakeSwap.
                    </p>
                    <a
                        href={`https://pancakeswap.finance/swap?outputCurrency=${currentCoin?.address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pancakeswap-button"
                    >
                        Trade on PancakeSwap
                    </a>
                </div>
            </div>
        );
    }

    const getPlaceholder = () => {
        if (mode === 'buy') {
            return 'Enter amount in ETH';
        }
        return `Enter amount in ${currentCoin?.ticker || 'tokens'}`;
    };

    return (
        <div className={`widget-container ${mode}-mode`}>
            <div className="mode-selector">
                <button
                    className={`mode-button buy-button ${
                        mode === 'buy' ? 'active' : ''
                    }`}
                    onClick={() => handleModeChange('buy')}
                >
                    Buy
                </button>
                <button
                    className={`mode-button sell-button ${
                        mode === 'sell' ? 'active' : ''
                    }`}
                    onClick={() => handleModeChange('sell')}
                >
                    Sell
                </button>
            </div>

            <div className={`widget-content ${mode}-content`}>
                <div className="balance-display">
                    <span>
                        {mode === 'buy' ? 'ETH' : currentCoin?.ticker} Balance:{' '}
                    </span>
                    <span>
                        {mode === 'buy' ? userBalances.eth : userBalances.token}
                    </span>
                </div>
                <input
                    type="text"
                    className="amount-input"
                    placeholder={getPlaceholder()}
                    value={inputValue}
                    onChange={handleInputChange}
                    disabled={
                        mode === 'buy'
                            ? Number(userBalances.eth) <= 0
                            : Number(userBalances.token) <= 0
                    }
                />
                {notification.show && (
                    <div
                        className={`notification-message ${notification.type}`}
                    >
                        {notification.message}
                    </div>
                )}

                <div className="quick-select-buttons">
                    {getQuickSelectValues().map((item, index) => (
                        <button
                            key={index}
                            className="quick-select-button"
                            onClick={() => handleQuickSelect(item)}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>

                <div className="min-received">
                    <div className="min-received-header">
                        <span>Estimated min received: </span>
                        <div className="tooltip">
                            ℹ️
                            <span className="tooltip-text">
                                Actual amount may vary based on bonding curve
                                price impact
                            </span>
                        </div>
                    </div>
                    <span className="min-received-amount">
                        {minReceived}{' '}
                        {mode === 'buy' ? currentCoin?.ticker : 'ETH'}
                    </span>
                </div>

                <button
                    className={`action-button ${mode}-action`}
                    onClick={() =>
                        mode === 'buy' ? makeBuyCall() : makeSellCall()
                    }
                    disabled={loading || !inputValue || Number(inputValue) <= 0}
                >
                    {loading ? (
                        <span className="loading-spinner"></span>
                    ) : (
                        `${mode === 'buy' ? 'BUY' : 'SELL'} ${
                            currentCoin?.ticker
                        }`
                    )}
                </button>
            </div>
            <TransactionModal
                isOpen={modal.isOpen}
                onClose={handleCloseModal}
                type={modal.type}
                message={modal.message}
                txHash={modal.txHash}
            />
        </div>
    );
};

export default BuySellWidget;
