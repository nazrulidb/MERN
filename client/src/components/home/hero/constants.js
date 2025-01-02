const createNewMemeABI = {
    abi: [
        {
            type: 'constructor',
            inputs: [
                {
                    name: 'newFeeInEth',
                    type: 'uint256',
                    internalType: 'uint256'
                },
                {
                    name: 'newTradingHub',
                    type: 'address',
                    internalType: 'address'
                },
                {
                    name: 'newSupply',
                    type: 'uint256',
                    internalType: 'uint256'
                }
            ],
            stateMutability: 'nonpayable'
        },
        {
            type: 'function',
            name: 'createNewMeme',
            inputs: [
                {
                    name: 'tokenName',
                    type: 'string',
                    internalType: 'string'
                },
                {
                    name: 'symbol',
                    type: 'string',
                    internalType: 'string'
                }
            ],
            outputs: [
                {
                    name: '',
                    type: 'address',
                    internalType: 'address'
                }
            ],
            stateMutability: 'payable'
        },
        {
            type: 'function',
            name: 'feeInEth',
            inputs: [],
            outputs: [
                {
                    name: '',
                    type: 'uint256',
                    internalType: 'uint256'
                }
            ],
            stateMutability: 'view'
        },
        {
            type: 'function',
            name: 'getFee',
            inputs: [],
            outputs: [
                {
                    name: '',
                    type: 'uint256',
                    internalType: 'uint256'
                }
            ],
            stateMutability: 'view'
        },
        {
            type: 'function',
            name: 'getSupply',
            inputs: [],
            outputs: [
                {
                    name: '',
                    type: 'uint256',
                    internalType: 'uint256'
                }
            ],
            stateMutability: 'view'
        },
        {
            type: 'function',
            name: 'owner',
            inputs: [],
            outputs: [
                {
                    name: '',
                    type: 'address',
                    internalType: 'address'
                }
            ],
            stateMutability: 'view'
        },
        {
            type: 'function',
            name: 'renounceOwnership',
            inputs: [],
            outputs: [],
            stateMutability: 'nonpayable'
        },
        {
            type: 'function',
            name: 'setFee',
            inputs: [
                {
                    name: 'newFee',
                    type: 'uint256',
                    internalType: 'uint256'
                }
            ],
            outputs: [],
            stateMutability: 'nonpayable'
        },
        {
            type: 'function',
            name: 'setSupply',
            inputs: [
                {
                    name: 'newSupply',
                    type: 'uint256',
                    internalType: 'uint256'
                }
            ],
            outputs: [],
            stateMutability: 'nonpayable'
        },
        {
            type: 'function',
            name: 'supply',
            inputs: [],
            outputs: [
                {
                    name: '',
                    type: 'uint256',
                    internalType: 'uint256'
                }
            ],
            stateMutability: 'view'
        },
        {
            type: 'function',
            name: 'tokenToCreator',
            inputs: [
                {
                    name: 'token',
                    type: 'address',
                    internalType: 'address'
                }
            ],
            outputs: [
                {
                    name: 'creator',
                    type: 'address',
                    internalType: 'address'
                }
            ],
            stateMutability: 'view'
        },
        {
            type: 'function',
            name: 'tokens',
            inputs: [
                {
                    name: '',
                    type: 'uint256',
                    internalType: 'uint256'
                }
            ],
            outputs: [
                {
                    name: '',
                    type: 'address',
                    internalType: 'address'
                }
            ],
            stateMutability: 'view'
        },
        {
            type: 'function',
            name: 'tradingHub',
            inputs: [],
            outputs: [
                {
                    name: '',
                    type: 'address',
                    internalType: 'address'
                }
            ],
            stateMutability: 'view'
        },
        {
            type: 'function',
            name: 'transferOwnership',
            inputs: [
                {
                    name: 'newOwner',
                    type: 'address',
                    internalType: 'address'
                }
            ],
            outputs: [],
            stateMutability: 'nonpayable'
        },
        {
            type: 'function',
            name: 'withdrawFee',
            inputs: [],
            outputs: [],
            stateMutability: 'nonpayable'
        },
        {
            type: 'event',
            name: 'OwnershipTransferred',
            inputs: [
                {
                    name: 'previousOwner',
                    type: 'address',
                    indexed: true,
                    internalType: 'address'
                },
                {
                    name: 'newOwner',
                    type: 'address',
                    indexed: true,
                    internalType: 'address'
                }
            ],
            anonymous: false
        },
        {
            type: 'event',
            name: 'NewMemeCreated',
            inputs: [
                {
                    name: 'tokenAddress',
                    type: 'address',
                    indexed: true
                },
                { name: 'creator', type: 'address', indexed: true }
            ],
            anonymous: false
        },
        {
            type: 'error',
            name: 'NOT_ENOUGH_FEE_SENT',
            inputs: []
        },
        {
            type: 'error',
            name: 'OwnableInvalidOwner',
            inputs: [
                {
                    name: 'owner',
                    type: 'address',
                    internalType: 'address'
                }
            ]
        },
        {
            type: 'error',
            name: 'OwnableUnauthorizedAccount',
            inputs: [
                {
                    name: 'account',
                    type: 'address',
                    internalType: 'address'
                }
            ]
        },
        {
            type: 'error',
            name: 'TRANSFER_FAIL',
            inputs: []
        }
    ]
};
