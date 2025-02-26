export default [
  {
    constant: true,
    inputs: [
      { internalType: 'address', name: '_collectionAddress', type: 'address' },
      { internalType: 'uint256', name: '_optionId', type: 'uint256' }
    ],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { internalType: 'address', name: '_collectionAddress', type: 'address' },
      {
        internalType: 'uint256[]',
        name: '_collectionOptionIds',
        type: 'uint256[]'
      },
      {
        internalType: 'uint256[]',
        name: '_collectionAvailableQtys',
        type: 'uint256[]'
      },
      {
        internalType: 'uint256[]',
        name: '_collectionPrices',
        type: 'uint256[]'
      }
    ],
    name: 'setCollectionData',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      { internalType: 'address', name: '_collectionAddress', type: 'address' },
      { internalType: 'uint256', name: '_optionId', type: 'uint256' },
      { internalType: 'uint256', name: '_amount', type: 'uint256' }
    ],
    name: 'canMint',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'acceptedToken',
    outputs: [{ internalType: 'contract IERC20', name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'isOwner',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { internalType: 'address', name: '_collectionAddress', type: 'address' },
      { internalType: 'uint256[]', name: '_optionIds', type: 'uint256[]' },
      { internalType: 'address', name: '_beneficiary', type: 'address' }
    ],
    name: 'buy',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      { internalType: 'address', name: '_collectionAddress', type: 'address' },
      { internalType: 'uint256', name: '_optionId', type: 'uint256' }
    ],
    name: 'itemByOptionId',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      { internalType: 'address', name: '_collectionAddress', type: 'address' },
      { internalType: 'uint256', name: '_optionId', type: 'uint256' }
    ],
    name: 'collectionData',
    outputs: [
      { internalType: 'uint256', name: 'availableQty', type: 'uint256' },
      { internalType: 'uint256', name: 'price', type: 'uint256' }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'contract IERC20',
        name: '_acceptedToken',
        type: 'address'
      },
      {
        internalType: 'address[]',
        name: '_collectionAddresses',
        type: 'address[]'
      },
      {
        internalType: 'uint256[][]',
        name: '_collectionOptionIds',
        type: 'uint256[][]'
      },
      {
        internalType: 'uint256[][]',
        name: '_collectionAvailableQtys',
        type: 'uint256[][]'
      },
      {
        internalType: 'uint256[][]',
        name: '_collectionPrices',
        type: 'uint256[][]'
      }
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: '_collectionAddress',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256[]',
        name: '_optionIds',
        type: 'uint256[]'
      },
      {
        indexed: false,
        internalType: 'address',
        name: '_beneficiary',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_price',
        type: 'uint256'
      }
    ],
    name: 'Bought',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: '_collectionAddress',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256[]',
        name: '_optionIds',
        type: 'uint256[]'
      },
      {
        indexed: false,
        internalType: 'uint256[]',
        name: '_availableQtys',
        type: 'uint256[]'
      },
      {
        indexed: false,
        internalType: 'uint256[]',
        name: '_prices',
        type: 'uint256[]'
      }
    ],
    name: 'SetCollectionData',
    type: 'event'
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
  }
]
