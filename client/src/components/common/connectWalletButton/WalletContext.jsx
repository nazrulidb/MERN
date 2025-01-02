import React, { createContext, useState, useEffect } from 'react';

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
    const [walletAddress, setWalletAddress] = useState('');

    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);

    const checkIfWalletIsConnected = async () => {
        try {
            const { ethereum } = window;

            if (!ethereum) {
                console.error('Make sure you have MetaMask installed!');
                return;
            }

            const accounts = await ethereum.request({ method: 'eth_accounts' });

            if (accounts.length !== 0) {
                const account = accounts[0];
                setWalletAddress(account);
            }
        } catch (error) {
            console.error(
                'An error occurred while checking the wallet connection',
                error
            );
        }
    };

    const connectWallet = async () => {
        try {
            const { ethereum } = window;

            if (!ethereum) {
                console.error('MetaMask not detected!');
                return;
            }

            const accounts = await ethereum.request({
                method: 'eth_requestAccounts'
            });

            if (accounts.length !== 0) {
                const account = accounts[0];
                setWalletAddress(account);
            }
        } catch (error) {
            console.error(
                'An error occurred while connecting to the wallet',
                error
            );
        }
    };

    const disconnectWallet = () => {
        setWalletAddress('');
    };

    return (
        <WalletContext.Provider
            value={{ walletAddress, connectWallet, disconnectWallet }}
        >
            {children}
        </WalletContext.Provider>
    );
};
