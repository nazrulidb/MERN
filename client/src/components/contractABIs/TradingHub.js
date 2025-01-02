const TradingHubContractABI = {
    abi: [
        {
            inputs: [
                {
                    internalType: 'address',
                    name: 'newethUsdPriceFeed',
                    type: 'address'
                },
                {
                    internalType: 'uint256',
                    name: 'newMigrationUsdValue',
                    type: 'uint256'
                },
                {
                    internalType: 'address',
                    name: 'dexAddress',
                    type: 'address'
                }
            ],
            stateMutability: 'nonpayable',
            type: 'constructor'
        },
        {
            inputs: [],
            name: 'AMOUNT_SHOULD_BE_GREATRE_THAN_RESERVE_RATIO',
            type: 'error'
        },
        {
            inputs: [],
            name: 'INVALID_ARGS',
            type: 'error'
        },
        {
            inputs: [],
            name: 'NOT_ENOUGH_AMOUNT_OUT',
            type: 'error'
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: 'owner',
                    type: 'address'
                }
            ],
            name: 'OwnableInvalidOwner',
            type: 'error'
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: 'account',
                    type: 'address'
                }
            ],
            name: 'OwnableUnauthorizedAccount',
            type: 'error'
        },
        {
            inputs: [],
            name: 'TRANSFER_FAILED',
            type: 'error'
        },
        {
            inputs: [],
            name: 'WTF_IS_THIS_TOKEN',
            type: 'error'
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: 'address',
                    name: 'previousOwner',
                    type: 'address'
                },
                {
                    indexed: true,
                    internalType: 'address',
                    name: 'newOwner',
                    type: 'address'
                }
            ],
            name: 'OwnershipTransferred',
            type: 'event'
        },
        {
            stateMutability: 'payable',
            type: 'fallback'
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: 'token',
                    type: 'address'
                },
                {
                    internalType: 'uint256',
                    name: 'minimumAmountOut',
                    type: 'uint256'
                },
                {
                    internalType: 'address',
                    name: 'receiver',
                    type: 'address'
                }
            ],
            name: 'buy',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256'
                },
                {
                    internalType: 'bool',
                    name: '',
                    type: 'bool'
                }
            ],
            stateMutability: 'payable',
            type: 'function'
        },
        {
            inputs: [],
            name: 'ethUsdPriceFeed',
            outputs: [
                {
                    internalType: 'contract IPyth',
                    name: '',
                    type: 'address'
                }
            ],
            stateMutability: 'view',
            type: 'function'
        },
        {
            inputs: [],
            name: 'getEthUsdPriceFeed',
            outputs: [
                {
                    internalType: 'address',
                    name: '',
                    type: 'address'
                }
            ],
            stateMutability: 'view',
            type: 'function'
        },
        {
            inputs: [],
            name: 'getTokenFactory',
            outputs: [
                {
                    internalType: 'address',
                    name: '',
                    type: 'address'
                }
            ],
            stateMutability: 'view',
            type: 'function'
        },
        {
            inputs: [],
            name: 'migrationUsdValue',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256'
                }
            ],
            stateMutability: 'view',
            type: 'function'
        },
        {
            inputs: [],
            name: 'owner',
            outputs: [
                {
                    internalType: 'address',
                    name: '',
                    type: 'address'
                }
            ],
            stateMutability: 'view',
            type: 'function'
        },
        {
            inputs: [],
            name: 'renounceOwnership',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function'
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: 'token',
                    type: 'address'
                },
                {
                    internalType: 'address',
                    name: 'receiver',
                    type: 'address'
                },
                {
                    internalType: 'uint256',
                    name: 'amount',
                    type: 'uint256'
                }
            ],
            name: 'sell',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function'
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: 'newEthUsdPriceFeed',
                    type: 'address'
                }
            ],
            name: 'setEthUsdPriceFeed',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function'
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: 'newTokenFactory',
                    type: 'address'
                }
            ],
            name: 'setTokenFactory',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function'
        },
        {
            inputs: [],
            name: 'tokenFactory',
            outputs: [
                {
                    internalType: 'address',
                    name: '',
                    type: 'address'
                }
            ],
            stateMutability: 'view',
            type: 'function'
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: '',
                    type: 'address'
                }
            ],
            name: 'tokenMarketCap',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256'
                }
            ],
            stateMutability: 'view',
            type: 'function'
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: '',
                    type: 'address'
                }
            ],
            name: 'tokenMigrated',
            outputs: [
                {
                    internalType: 'bool',
                    name: '',
                    type: 'bool'
                }
            ],
            stateMutability: 'view',
            type: 'function'
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: 'newOwner',
                    type: 'address'
                }
            ],
            name: 'transferOwnership',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function'
        },
        {
            stateMutability: 'payable',
            type: 'receive'
        }
    ]
};

export default TradingHubContractABI;
