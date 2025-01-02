import {
    useWeb3ModalAccount,
    useWeb3Modal,
    useWeb3ModalProvider
} from '@web3modal/ethers5/react';
import { defaultConfig, createWeb3Modal } from '@web3modal/ethers5/react';
import { ethers } from 'ethers';
import { useState, useEffect } from 'react';

const projectId = '3facda59c540cfeb141c91652aa13747';

// Environment detection (you can modify this based on your deployment setup)
const isDevelopment = process.env.NODE_ENV === 'development';

// Chain configurations
const mainnet = {
    chainId: 1,
    name: 'Ethereum',
    currency: 'ETH',
    explorerUrl: 'https://etherscan.io',
    rpcUrl: 'https://ethereum.publicnode.com'
};

const baseMainnet = {
    chainId: 8453,
    name: 'Base',
    currency: 'ETH',
    explorerUrl: 'https://basescan.org',
    rpcUrl: 'https://mainnet.base.org'
};

const baseSepolia = {
    chainId: 84532,
    name: 'Base Sepolia',
    currency: 'ETH',
    explorerUrl: 'https://sepolia.basescan.org',
    rpcUrl: 'https://sepolia.base.org'
};

const berachain = {
    chainId: 80084,
    name: 'Berachain Artio',
    currency: 'BERA',
    explorerUrl: 'https://artio.beratrail.io',
    rpcUrl: 'https://artio.rpc.berachain.com'
};

const bscTestnet = {
    chainId: 97,
    name: 'BSC Testnet',
    currency: 'tBNB',
    explorerUrl: 'https://testnet.bscscan.com',
    rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545'
};

// Select default chain based on environment
// Select default chain based on environment
const defaultChain = isDevelopment ? baseSepolia : baseMainnet;
const supportedChains = isDevelopment
    ? [mainnet, baseSepolia, berachain, bscTestnet]
    : [mainnet, baseMainnet, berachain, bscTestnet];

// Configure web3modal
createWeb3Modal({
    ethersConfig: defaultConfig({
        metadata: {
            name: 'Your App Name',
            description: 'Your App Description',
            url: window.location.host,
            icons: ['https://avatars.githubusercontent.com/u/37784886']
        },
        defaultChainId: defaultChain.chainId
    }),
    chains: supportedChains,
    defaultChain,
    projectId,
    themeMode: 'dark',
    featuredWalletIds: [
        'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96'
    ], // Trust Wallet ID
    includeWalletIds: undefined,
    enableExplorer: true,
    enableAccountView: true,
    enableNetworkView: true,
    mobileWallets: [
        {
            id: 'trust',
            name: 'Trust Wallet',
            links: {
                native: 'trust://',
                universal: 'https://link.trustwallet.com'
            }
        }
    ],
    walletImages: {
        trust: 'https://trustwallet.com/assets/images/favicon.png'
    }
});

const MetaMaskConnect = () => {
    const { address, chainId, isConnected } = useWeb3ModalAccount();
    const { open } = useWeb3Modal();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    }, []);

    const switchNetwork = async (targetChainId) => {
        if (!window.ethereum) {
            console.error('No wallet detected');
            return;
        }

        const networkConfigs = {
            1: {
                chainId: '0x1',
                chainName: 'Ethereum Mainnet',
                nativeCurrency: {
                    name: 'Ether',
                    symbol: 'ETH',
                    decimals: 18
                },
                rpcUrls: ['https://ethereum.publicnode.com'],
                blockExplorerUrls: ['https://etherscan.io']
            },
            8453: {
                chainId: '0x2105',
                chainName: 'Base',
                nativeCurrency: {
                    name: 'ETH',
                    symbol: 'ETH',
                    decimals: 18
                },
                rpcUrls: ['https://mainnet.base.org'],
                blockExplorerUrls: ['https://basescan.org']
            },
            84532: {
                chainId: '0x14A34',
                chainName: 'Base Sepolia',
                nativeCurrency: {
                    name: 'ETH',
                    symbol: 'ETH',
                    decimals: 18
                },
                rpcUrls: ['https://sepolia.base.org'],
                blockExplorerUrls: ['https://sepolia.basescan.org']
            },
            80084: {
                chainId: '0x138C4',
                chainName: 'Berachain Artio',
                nativeCurrency: {
                    name: 'BERA',
                    symbol: 'BERA',
                    decimals: 18
                },
                rpcUrls: ['https://artio.rpc.berachain.com'],
                blockExplorerUrls: ['https://artio.beratrail.io']
            },
            97: {
                chainId: '0x61',
                chainName: 'BSC Testnet',
                nativeCurrency: {
                    name: 'tBNB',
                    symbol: 'tBNB',
                    decimals: 18
                },
                rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
                blockExplorerUrls: ['https://testnet.bscscan.com']
            }
        };

        const config = networkConfigs[targetChainId];

        if (!config) {
            console.error('Invalid network configuration');
            return;
        }

        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: config.chainId }]
            });
        } catch (error) {
            if (error.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [config]
                    });
                } catch (addError) {
                    console.error('Error adding network:', addError);
                }
            }
            console.error('Error switching network:', error);
        }
    };

    const isValidChain = (currentChainId) => {
        const validChainIds = isDevelopment
            ? [1, 84532, 80084, 97] // Development chains
            : [1, 8453, 80084, 97]; // Production chains
        return validChainIds.includes(currentChainId);
    };

    return (
        <div className="wallet-container">
            <w3m-button />
            {isConnected && !isValidChain(chainId) && (
                <div className="network-warning">
                    <p>Please switch to a supported network</p>
                    {!isMobile && (
                        <>
                            <button
                                onClick={() =>
                                    switchNetwork(isDevelopment ? 84532 : 8453)
                                }
                                className="switch-network-button"
                            >
                                Switch to{' '}
                                {isDevelopment ? 'Base Sepolia' : 'Base'}
                            </button>
                            <button
                                onClick={() => switchNetwork(80084)}
                                className="switch-network-button"
                            >
                                Switch to Berachain
                            </button>
                            <button
                                onClick={() => switchNetwork(97)}
                                className="switch-network-button"
                            >
                                Switch to BSC Testnet
                            </button>
                        </>
                    )}
                    <button
                        onClick={() => switchNetwork(1)}
                        className="switch-network-button"
                    >
                        Switch to Ethereum Mainnet
                    </button>
                </div>
            )}
        </div>
    );
};

export default MetaMaskConnect;
