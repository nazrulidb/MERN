import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { WalletProvider } from '../src/components/common/connectWalletButton/WalletContext';

ReactDOM.render(
    <WalletProvider>
        <App />
    </WalletProvider>,
    document.getElementById('root')
);
