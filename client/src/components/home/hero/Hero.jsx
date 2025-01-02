import React, { useState, useEffect, useContext } from 'react';
import {
    ThemeProvider,
    Button,
    TextField,
    Modal,
    Box,
    Typography,
    Grid,
    Snackbar,
    Alert,
    CircularProgress,
    List,
    ListItem,
    ListItemText
} from '@mui/material';
import './hero.css';
import { createTheme, styled } from '@mui/material/styles';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useWeb3ModalAccount } from '@web3modal/ethers5/react';
import ConfirmationModal from './ConfirmationModal';

const tokenFactoryAbi = require('../../common/constants/tokenFactoryABI.json');

const theme = createTheme({
    palette: {
        primary: {
            main: '#fb4c35'
        },
        error: {
            main: '#fb4c35'
        }
    },
    components: {
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'black'
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'black'
                    }
                }
            }
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    '&.Mui-focused': {
                        color: 'black'
                    }
                }
            }
        },
        MuiSelect: {
            styleOverrides: {
                icon: {
                    color: 'black'
                }
            }
        },
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    '&.Mui-selected': {
                        backgroundColor: 'lightgray'
                    },
                    '&.Mui-selected:hover': {
                        backgroundColor: 'gray'
                    }
                }
            }
        },
        MuiFormHelperText: {
            styleOverrides: {
                root: {
                    color: 'rgba(255, 255, 255, 0.7)', // Default helper text color
                    '&.Mui-error': {
                        color: '#ff6b6b' // Error text color
                    },
                    fontSize: '0.875rem', // Slightly larger font size
                    marginTop: '4px'
                }
            }
        }
    }
});

// const CustomMenuItem = styled()(({ theme }) => ({
//     '&:hover': {
//         backgroundColor: theme.palette.action.hover
//     }
// }));

const ethers = require('ethers');

const Hero = ({ coins, newMemeAddress, setNewMemeAddress }) => {
    const [open, setOpen] = useState(false);
    const [notification, setNotification] = useState({
        open: false,
        message: '',
        type: 'success',
        txHash: ''
    });
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

    const [loading, setLoading] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const [formErrors, setFormErrors] = useState({
        description: '',
        twitter: ''
    });

    const MIN_DESCRIPTION_LENGTH = 100;

    const validateForm = () => {
        const errors = {
            description: '',
            twitter: ''
        };
        let isValid = true;

        // Description validation
        if (formData.description.length < MIN_DESCRIPTION_LENGTH) {
            errors.description = `Description must be at least ${MIN_DESCRIPTION_LENGTH} characters`;
            isValid = false;
        }

// X/Twitter validation
if (!formData.twitter) {
    errors.twitter = 'X (Twitter) link is required';
    isValid = false;
} else if (!formData.twitter.includes('twitter.com/') && !formData.twitter.includes('x.com/')) {
    errors.twitter = 'Please enter a valid X or Twitter URL';
    isValid = false;
}

        setFormErrors(errors);
        return isValid;
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    useEffect(() => {
        if (searchQuery) {
            const fetchSearchResults = async () => {
                try {
                    const response = await axios.get('/api/search', {
                        params: { query: searchQuery }
                    });
                    setSearchResults(response.data);
                    setDropdownOpen(true);
                } catch (error) {
                    console.error('Error searching coins:', error);
                }
            };

            fetchSearchResults();
        } else {
            setDropdownOpen(false);
        }
    }, [searchQuery]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('/api/coins/search', {
                params: { query: searchQuery }
            });
            setSearchResults(response.data);
        } catch (error) {
            console.error('Error searching coins:', error);
            setNotification({
                open: true,
                message: 'Failed to search coins',
                severity: 'error'
            });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));

        // Clear error for the field being edited
        if (formErrors[name]) {
            setFormErrors((prev) => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type !== 'image/jpeg') {
            alert('Please upload a JPEG file.');
            return;
        }

        setFormData((prevState) => ({
            ...prevState,
            img: file
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const result = await createNewMeme(formData.name, formData.ticker);

            if (result) {
                const coinAddress = result.address;
                const updatedFormData = {
                    ...formData,
                    creator: address,
                    address: coinAddress
                };

                const data = new FormData();
                for (const key in updatedFormData) {
                    data.append(key, updatedFormData[key]);
                }

                const response = await fetch(`/api/coins`, {
                    method: 'POST',
                    body: data
                });

                if (!response.ok) {
                    throw new Error('Failed to create coin');
                }

                setOpen(false);
                setNotification({
                    open: true,
                    message: 'Coin successfully created!',
                    severity: 'success'
                });

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
            } else {
                throw new Error('Failed to create meme');
            }
        } catch (error) {
            console.error('Error:', error);
            setNotification({
                open: true,
                message: error.message || 'Failed to create coin',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const createNewMeme = async (tokenName, symbol) => {
        try {
            if (!window.ethereum) {
                throw new Error('MetaMask is not installed');
            }

            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            // const contractAddress =
            //     '0xDE726DA1Fa8DD5dE5Ca9018680753b15eaF4aE83';
            // const contractABI = { abi: tokenFactoryAbi };
            // const contract = new ethers.Contract(
            //     contractAddress,
            //     contractABI.abi,
            //     signer
            // );

            const contractAddress =
                '0x59202ffB7Db5a6DD45009f5bCccefE0679a943Fd';
            const contractABI = { abi: tokenFactoryAbi };
            const contract = new ethers.Contract(
                contractAddress,
                contractABI.abi,
                signer
            );

            const tx = await contract.createNewMeme(tokenName, symbol, {
                value: ethers.utils.parseEther('0.002')
            });

            // // Use the actual minimum fee instead of hardcoded value
            // const tx = await contract.createNewMeme(tokenName, symbol, {
            //     value: minimumFee, // Use the actual minimum fee from contract
            //     gasLimit: 500000
            // });

            const receipt = await tx.wait();

            const newMemeEvent = receipt.events?.find(
                (event) => event.event === 'NewMemeCreated'
            );

            if (newMemeEvent) {
                const newMemeAddress = newMemeEvent.args.token;
                setNewMemeAddress(newMemeAddress);
                setNotification({
                    open: true,
                    type: 'success',
                    message: 'Coin successfully created!',
                    txHash: tx.hash
                });
                return { success: true, address: newMemeAddress };
            }

            throw new Error(
                'NewMemeCreated event not found in transaction receipt'
            );
        } catch (error) {
            console.error('Error details:', error);
            throw error;
        }
    };

    const handleNotificationClose = () => {
        setNotification({ open: false, message: '', severity: 'success' });
    };

    return (
        <ThemeProvider theme={theme}>
            <section className="hero">
                <div className="make-container">
                    <div className="top-bar">
                        <Button
                            variant="contained"
                            color="error"
                            className="create-coin-button"
                            onClick={handleOpen}
                        >
                            Create New Coin
                        </Button>

                        <div className="search-bar">
                            <TextField
                                variant="outlined"
                                label="Search"
                                className="search-input"
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                            {dropdownOpen && (
                                <List className="search-results-list">
                                    {searchResults.map((coin) => (
                                        <Link
                                            key={coin._id}
                                            to={`/SinglePage/${coin._id}`}
                                            className="socLink"
                                        >
                                            <ListItem button>
                                                <ListItemText
                                                    primary={`${coin.name} (${coin.ticker})`}
                                                />
                                            </ListItem>
                                        </Link>
                                    ))}
                                </List>
                            )}
                        </div>
                    </div>
                </div>
                <Modal
                    className="modal-container-create"
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box className="modal-box">
                        <Typography
                            align="center"
                            variant="h6"
                            component="h2"
                            className="modal-title"
                        >
                            Create New Coin
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        margin="normal"
                                        label="Name"
                                        variant="outlined"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                    <TextField
                                        fullWidth
                                        margin="normal"
                                        label="Ticker"
                                        variant="outlined"
                                        name="ticker"
                                        value={formData.ticker}
                                        onChange={handleChange}
                                        required
                                    />

                                    <TextField
                                        fullWidth
                                        margin="normal"
                                        label="Description"
                                        variant="outlined"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        required
                                        error={!!formErrors.description}
                                        helperText={
                                            formErrors.description ||
                                            `Minimum ${MIN_DESCRIPTION_LENGTH} characters (${formData.description.length} current)`
                                        }
                                        FormHelperTextProps={{
                                            sx: {
                                                color: formErrors.description
                                                    ? '#ff6b6b'
                                                    : 'rgba(255, 255, 255, 0.7)',
                                                fontSize: '0.875rem'
                                            }
                                        }}
                                        multiline
                                        rows={4}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                <TextField
    fullWidth
    margin="normal"
    label="X (Twitter)"
    variant="outlined"
    name="twitter"
    value={formData.twitter}
    onChange={handleChange}
    placeholder="e.g., x.com/yourhandle or twitter.com/yourhandle"
    required
    error={!!formErrors.twitter}
    helperText={
        formErrors.twitter ||
        'Required - Please enter your X (Twitter) URL'
    }
    FormHelperTextProps={{
        sx: {
            color: formErrors.twitter
                ? '#ff6b6b'
                : 'rgba(255, 255, 255, 0.7)',
            fontSize: '0.875rem'
        }
    }}
/>
                                    <TextField
                                        fullWidth
                                        margin="normal"
                                        label="Website"
                                        variant="outlined"
                                        name="website"
                                        value={formData.website}
                                        onChange={handleChange}
                                        placeholder="e.g., yourwebsite.com"
                                    />
                                    <TextField
                                        fullWidth
                                        margin="normal"
                                        label="Telegram"
                                        variant="outlined"
                                        name="telegram"
                                        value={formData.telegram}
                                        onChange={handleChange}
                                        placeholder="e.g., t.me/yourgroup"
                                    />
                                    <TextField
                                        fullWidth
                                        margin="normal"
                                        label="Image"
                                        variant="standard"
                                        name="img"
                                        type="file"
                                        onChange={handleFileChange}
                                    />
                                </Grid>
                            </Grid>
                            <Typography
                                className="fee-notice"
                                variant="body2"
                                color="text.secondary"
                                align="center"
                                sx={{
                                    mt: 2,
                                    mb: 1,
                                    padding: '8px',
                                    backgroundColor: 'rgba(251, 76, 53, 0.1)',
                                    borderRadius: '4px',
                                    fontWeight: 500
                                }}
                            >
                                Creation fee: 0.002 ETH
                            </Typography>
                            <Box mt={2} className="submit-button-container">
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="error"
                                    disabled={loading}
                                    className="submit-button"
                                >
                                    {loading ? (
                                        <CircularProgress size={24} />
                                    ) : (
                                        'Create Coin'
                                    )}
                                </Button>
                            </Box>
                        </form>
                    </Box>
                </Modal>
                <ConfirmationModal
                    isOpen={notification.open}
                    onClose={() =>
                        setNotification({
                            open: false,
                            message: '',
                            type: 'success',
                            txHash: ''
                        })
                    }
                    type={notification.type}
                    message={notification.message}
                    txHash={notification.txHash}
                />
            </section>
        </ThemeProvider>
    );
};

export default Hero;
