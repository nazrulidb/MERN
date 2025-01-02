import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { ethers } from 'ethers';
// import './WalletCard.css';

const WalletCard = () => {
    const [errorMessage, setErrorMessage] = useState(null);
    const [defaultAccount, setDefaultAccount] = useState(null);
    const [userBalance, setUserBalance] = useState(null);

    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', handleAccountsChanged);
        }
        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener(
                    'accountsChanged',
                    handleAccountsChanged
                );
            }
        };
    }, []);

    const handleAccountsChanged = async (accounts) => {
        if (accounts.length > 0) {
            await accountChangedHandler(
                new ethers.providers.Web3Provider(window.ethereum).getSigner()
            );
        } else {
            setDefaultAccount(null);
            setUserBalance(null);
        }
    };

    const connectWalletHandler = async () => {
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            try {
                await provider.send('eth_requestAccounts', []);
                await accountChangedHandler(provider.getSigner());
            } catch (error) {
                setErrorMessage(error.message);
            }
        } else {
            setErrorMessage('Please install MetaMask!');
        }
    };

    const disconnectWalletHandler = () => {
        setDefaultAccount(null);
        setUserBalance(null);
    };

    const accountChangedHandler = async (signer) => {
        const address = await signer.getAddress();
        setDefaultAccount(address);
        const balance = await signer.getBalance();
        setUserBalance(ethers.utils.formatEther(balance));
    };

    return (
        <div className="WalletCard">
            <Button
                style={{ background: defaultAccount ? '#A5CC82' : 'white' }}
                onClick={connectWalletHandler}
            >
                {defaultAccount ? 'Connected!' : 'Connect'}
            </Button>
            {defaultAccount && (
                <Button
                    style={{ background: '#FF6347', marginLeft: '10px' }}
                    onClick={disconnectWalletHandler}
                >
                    Disconnect
                </Button>
            )}
            {/* <div className="displayAccount">
                <h4 className="walletAddress">Address: {defaultAccount}</h4>
                <div className="balanceDisplay">
                    <h3>Wallet Amount: {userBalance}</h3>
                </div>
            </div> */}
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </div>
        // <div className="wallet-container">
        //     {defaultAccount ? (
        //         <div className="wallet-info">
        //             <span className="wallet-connected">
        //                 Connected: {truncateAddress(walletAddress)}
        //             </span>
        //             <button
        //                 className="disconnect-wallet-button"
        //                 onClick={disconnectWalletHandler}
        //             >
        //                 Disconnect Wallet
        //             </button>
        //         </div>
        //     ) : (
        //         <button
        //             className="connect-wallet-button"
        //             onClick={connectWallet}
        //         >
        //             Connect Wallet
        //         </button>
        //     )}
        // </div>
    );
};

export default WalletCard;
