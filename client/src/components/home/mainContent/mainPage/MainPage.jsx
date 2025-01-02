import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Discover from '../../discover/Discover';
import Side from '../../sideContent/side/Side';
import NFTS from '../sections/nfts/NFTS';
import Portfolios from '../sections/portfolios/Portfolios';
import Popular from '../sections/popular/Popular_test';
import Ppost from '../sections/Ppost/Ppost';
import './style.css';

const MainPage = ({ coins, newCoins, topMarketCap }) => {
    return (
        <>
            <main>
                <div className="container">
                    <section className="mainContent">
                        <Popular coins={coins} />
                        {/* <Ppost /> */}
                        {/* <NFTS /> */}
                        {/* <Portfolios /> */}
                    </section>
                    <section className="sideContent">
                        <Side />
                    </section>
                </div>
            </main>
        </>
    );
};

export default MainPage;
