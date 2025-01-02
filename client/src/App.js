import React, { useState } from 'react';
import Header from './components/common/header/Header';
import './App.css';
import Homepages from './components/home/Homepages';
import Footer from './components/common/footer/Footer';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import SinglePage from './components/singlePage/SinglePage';
import Memes from './components/memes/index';
import Portfolios from './components/portfolios/Portfolios';

import { createWeb3Modal, defaultConfig } from '@web3modal/ethers5/react';

const projectId = `${process.env.REACT_APP_WEB3_MODAL_PROJECT_ID}`;

// Chain configurations
const berachain = {
    chainId: 80084,
    name: 'Berachain bArtio',
    currency: 'BERA',
    explorerUrl: 'https://bartio.beratrail.io',
    rpcUrl: 'https://bartio.rpc.berachain.com'
};

const baseSepolia = {
    chainId: 84532,
    name: 'Base Sepolia',
    currency: 'ETH',
    explorerUrl: 'https://sepolia.basescan.org',
    rpcUrl: 'https://sepolia.base.org'
};

const metadata = {
    name: 'Loot Markets',
    description: '',
    url: '',
    icons: ['https://avatars.mywebsite.com/']
};

// Default chain configuration (you can set either network as default)
const defaultChain = baseSepolia;

const ethersConfig = defaultConfig({
    metadata,
    enableEIP6963: true,
    enableInjected: true,
    enableCoinbase: true,
    rpcUrl: defaultChain.rpcUrl,
    defaultChainId: defaultChain.chainId
});

// Initialize Web3Modal with multiple chains
createWeb3Modal({
    ethersConfig,
    chains: [berachain, baseSepolia],
    projectId,
    enableAnalytics: true,
    allWallets: 'HIDE'
});

// Chain-specific contract addresses
const contractAddresses = {
    [berachain.chainId]: {
        tokenFactory: 'YOUR_BERACHAIN_ADDRESS'
    },
    [baseSepolia.chainId]: {
        tokenFactory: '0x59202ffB7Db5a6DD45009f5bCccefE0679a943Fd' // Your Base Sepolia address
    }
};

const App = () => {
    const [newMemeAddress, setNewMemeAddress] = useState('');
    const [currentChainId, setCurrentChainId] = useState(defaultChain.chainId);

    // Function to get contract addresses based on current chain
    const getContractAddresses = () => {
        return (
            contractAddresses[currentChainId] ||
            contractAddresses[defaultChain.chainId]
        );
    };

    return (
        <>
            <Router>
                <Header />
                <Switch>
                    <Route
                        exact
                        path="/"
                        render={(props) => (
                            <Homepages
                                {...props}
                                newMemeAddress={newMemeAddress}
                                setNewMemeAddress={setNewMemeAddress}
                                currentChainId={currentChainId}
                                setCurrentChainId={setCurrentChainId}
                                contractAddresses={getContractAddresses()}
                            />
                        )}
                    />
                    <Route
                        path="/SinglePage/:coinId"
                        render={(props) => (
                            <SinglePage
                                {...props}
                                newMemeAddress={newMemeAddress}
                                setNewMemeAddress={setNewMemeAddress}
                                currentChainId={currentChainId}
                                setCurrentChainId={setCurrentChainId}
                                contractAddresses={getContractAddresses()}
                            />
                        )}
                    />
                    <Route
                        exact
                        path="/memes"
                        render={(props) => (
                            <Memes
                                {...props}
                                currentChainId={currentChainId}
                                setCurrentChainId={setCurrentChainId}
                                contractAddresses={getContractAddresses()}
                            />
                        )}
                    />
                    <Route
                        exact
                        path="/portfolios"
                        render={(props) => (
                            <Portfolios
                                {...props}
                                currentChainId={currentChainId}
                                setCurrentChainId={setCurrentChainId}
                                contractAddresses={getContractAddresses()}
                            />
                        )}
                    />
                </Switch>
                <Footer />
            </Router>
        </>
    );
};

export default App;

// import React, { useState } from 'react';
// import Header from './components/common/header/Header';
// import './App.css';
// import Homepages from './components/home/Homepages';
// import Footer from './components/common/footer/Footer';
// import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
// import SinglePage from './components/singlePage/SinglePage';
// import Memes from './components/memes/index';
// import Portfolios from './components/portfolios/Portfolios';

// import { createWeb3Modal, defaultConfig } from '@web3modal/ethers5/react';

// const projectId = `${process.env.REACT_APP_WEB3_MODAL_PROJECT_ID}`;

// const berchain = {
//     chainId: 80084,
//     name: 'Berachain bArtio',
//     currency: 'Bera',
//     explorerUrl: 'https://bartio.beratrail.io',
//     rpcUrl: 'https://bartio.rpc.berachain.com'
// };

// const metadata = {
//     name: 'Loot Markets',
//     description: '',
//     url: '',
//     icons: ['https://avatars.mywebsite.com/']
// };

// const ethersConfig = defaultConfig({
//     metadata,
//     enableEIP6963: true,
//     enableInjected: true,
//     enableCoinbase: true,
//     rpcUrl: 'https://bartio.rpc.berachain.com',
//     defaultChainId: 80084
// });

// createWeb3Modal({
//     ethersConfig,
//     chains: [berchain],
//     projectId,
//     enableAnalytics: true,
//     allWallets: 'HIDE'
// });

// const App = () => {
//     const [newMemeAddress, setNewMemeAddress] = useState('');
//     return (
//         <>
//             <Router>
//                 <Header />
//                 <Switch>
//                     <Route
//                         exact
//                         path="/"
//                         render={(props) => (
//                             <Homepages
//                                 {...props}
//                                 newMemeAddress={newMemeAddress}
//                                 setNewMemeAddress={setNewMemeAddress}
//                             />
//                         )}
//                     />
//                     {/* <Route exact path="/" component={Homepages} /> */}
//                     {/* <Route
//                         path="/"
//                         render={(props) => (
//                             <Homepages
//                                 {...props}
//                                 newMemeAddress={newMemeAddress}
//                                 setNewMemeAddress={setNewMemeAddress}
//                             />
//                         )}
//                     /> */}
//                     <Route
//                         path="/SinglePage/:coinId"
//                         render={(props) => (
//                             <SinglePage
//                                 {...props}
//                                 newMemeAddress={newMemeAddress}
//                                 setNewMemeAddress={setNewMemeAddress}
//                             />
//                         )}
//                     />
//                     <Route exact path="/memes" component={Memes} />
//                     <Route exact path="/portfolios" component={Portfolios} />
//                 </Switch>
//                 <Footer />
//             </Router>
//         </>
//     );
// };

// export default App;
