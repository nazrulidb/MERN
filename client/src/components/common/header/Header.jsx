import React, { useState, useEffect } from 'react';
import Pagination from '@mui/material/Pagination';
import Head from './Head';
import './header.css';
import { Link } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Modal,
    Box,
    List,
    ListItem,
    ListItemText,
    Tabs,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from '@mui/material';
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios'; // Add this import if you don't have it already
import { useWeb3ModalAccount } from '@web3modal/ethers5/react';
import MetaMaskConnect from '../connectWalletButton/MetaMaskConnect';
import ActivityModal from './ActivityModal';

const Header = () => {
    const [navbar, setNavbar] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [userCoins, setUserCoins] = useState([]);
    const [createdCoins, setCreatedCoins] = useState([]);
    const { address } = useWeb3ModalAccount();

    const [tabValue, setTabValue] = useState(0); // State for active tab
    const placeholderImage = 'https://via.placeholder.com/30';

    const [page, setPage] = useState(1);

    const [purchasedCoins, setPurchasedCoins] = useState([]);
    const [soldCoins, setSoldCoins] = useState([]);

    const handlePageChange = (event, value) => {
        setPage(value);
    };
    const handleModalOpen = () => setModalOpen(true);
    const handleModalClose = () => setModalOpen(false);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    useEffect(() => {
        const fetchUserCoins = async () => {
            try {
                if (address) {
                    const response = await axios.get(
                        `/api/user/${address}/coins`
                    );

                    setUserCoins(response.data.ownedCoins);
                    setCreatedCoins(response.data.createdCoins);
                    setPurchasedCoins(response.data.purchasedCoins);
                    setSoldCoins(response.data.soldCoins);
                }
            } catch (error) {
                console.error('Error fetching user coins:', error);
            }
        };

        fetchUserCoins();
    }, [address]);

    const formattedData = [
        ...createdCoins.map((coin) => ({ ...coin, tag: 'Created' })),
        ...purchasedCoins.map((coin) => ({ ...coin, tag: 'Purchased' })),
        ...soldCoins.map((coin) => ({ ...coin, tag: 'Sold' }))
    ];

    const itemsPerPage = 6;
    const startIndex = (page - 1) * itemsPerPage;

    const paginatedData = formattedData.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    const truncateAddress = (address) => {
        return address
            ? `${address.substring(0, 6)}...${address.substring(
                  address.length - 4
              )}`
            : '';
    };

    // Function to update createdCoins state when a new coin is created
    const handleNewCoinCreated = (newCoin) => {
        setCreatedCoins((prevCoins) => [...prevCoins, newCoin]);
    };

    return (
        <>
            <Head />
            <header>
                <div className="container paddingSmall">
                    <nav
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between'
                        }}
                    >
                        <ul
                            className={navbar ? 'navbar' : 'flex'}
                            onClick={() => setNavbar(false)}
                            style={{
                                alignItems: 'center'
                            }}
                        >
                            <li>
                                <Link to="/">Home</Link>
                            </li>
                            <li>
                                <Link to="/memes">Memes</Link>
                            </li>
                            <li>
                                {/* <Link to="/portfolios"> */}
                                {/* Portfolios (Coming Soon...) */}
                                {/* </Link> */}
                            </li>
                        </ul>
                        <div
                            style={{
                                display: 'flex'
                            }}
                        >
                            <MetaMaskConnect />
                            {/* <WalletCard /> */}
                            {/* <w3m-button /> */}
                            {/* <ConnectWallet /> */}
                            <IconButton
                                edge="end"
                                color="inherit"
                                aria-label="account of current user"
                                aria-haspopup="true"
                                onClick={handleModalOpen}
                                className="account-icon"
                            >
                                <FontAwesomeIcon icon={faUserCircle} />
                            </IconButton>
                        </div>

                        <button
                            className="barIcon"
                            onClick={() => setNavbar(!navbar)}
                        >
                            {navbar ? (
                                <i className="fa fa-times"></i>
                            ) : (
                                <i className="fa fa-bars"></i>
                            )}
                        </button>
                        <ActivityModal
                            isOpen={modalOpen}
                            onClose={handleModalClose}
                            address={address}
                            data={paginatedData}
                            page={page}
                            onPageChange={(newPage) => setPage(newPage)}
                            totalPages={Math.ceil(
                                createdCoins.length / itemsPerPage
                            )}
                        />
                    </nav>
                </div>
            </header>
        </>
    );
};

export default Header;
