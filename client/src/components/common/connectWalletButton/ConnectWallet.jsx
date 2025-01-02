// ConnectWallet.jsx
import React, { useContext } from 'react';
import { WalletContext } from './WalletContext';
import { truncateAddress } from './utils';
import './ConnectWallet.css'; // Import the CSS file

// import Capsule, { Environment, CapsuleModal } from "@usecapsule/react-sdk";
// // Import styles if using v3.5.0 or greater of `@usecapsule/react-sdk`
// import "@usecapsule/react-sdk/styles.css";

const ConnectWallet = () => {
    const { walletAddress, connectWallet, disconnectWallet } =
        useContext(WalletContext);

    return (
        <div className="wallet-container">
            <w3m-button />
            {/* {walletAddress ? (
                <div className="wallet-info">
                    <span className="wallet-connected">
                        Connected: {truncateAddress(walletAddress)}
                    </span>
                    <button
                        className="disconnect-wallet-button"
                        onClick={disconnectWallet}
                    >
                        Disconnect Wallet
                    </button>
                </div>
            ) : (
                <button
                    className="connect-wallet-button"
                    onClick={connectWallet}
                >
                    Connect Wallet
                </button>
            )} */}
        </div>
    );
};

export default ConnectWallet;

// import React, { useState, useEffect } from 'react';
// import { ethers } from 'ethers';
// import './ConnectWallet.css';  // Import the CSS file

// const ConnectWallet = () => {
//   const [walletAddress, setWalletAddress] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');

//   useEffect(() => {
//     checkIfWalletIsConnected();
//   }, []);

//   const checkIfWalletIsConnected = async () => {
//     try {
//       const { ethereum } = window;

//       if (!ethereum) {
//         setErrorMessage('Make sure you have MetaMask installed!');
//         return;
//       }

//       const accounts = await ethereum.request({ method: 'eth_accounts' });

//       if (accounts.length !== 0) {
//         const account = accounts[0];
//         setWalletAddress(account);
//       }
//     } catch (error) {
//       setErrorMessage('An error occurred while checking the wallet connection');
//       console.error(error);
//     }
//   };

//   const connectWallet = async () => {
//     try {
//       const { ethereum } = window;

//       if (!ethereum) {
//         setErrorMessage('MetaMask not detected!');
//         return;
//       }

//       const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

//       if (accounts.length !== 0) {
//         const account = accounts[0];
//         setWalletAddress(account);
//       }
//     } catch (error) {
//       setErrorMessage('An error occurred while connecting to the wallet');
//       console.error(error);
//     }
//   };

//   return (
//     <div>
//       {walletAddress ? (
//         <p>Connected: {walletAddress}</p>
//       ) : (
//         <button className="connect-wallet-button" onClick={connectWallet}>Connect Wallet</button>
//       )}
//       {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
//     </div>
//   );
// };

// export default ConnectWallet;
