export default [
  {
    inputs: [
      {
        internalType: 'uint16',
        name: '_productId',
        type: 'uint16'
      },
      {
        internalType: 'bool',
        name: '_isActive',
        type: 'bool'
      }
    ],
    name: 'activateProduct',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint16',
        name: '_productId',
        type: 'uint16'
      },
      {
        internalType: 'string',
        name: '_productName',
        type: 'string'
      },
      {
        internalType: 'uint256',
        name: '_maxIssuance',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_defaultAttributes',
        type: 'uint256'
      },
      {
        internalType: 'bool',
        name: '_active',
        type: 'bool'
      }
    ],
    name: 'addProduct',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '_name',
        type: 'string'
      },
      {
        internalType: 'string',
        name: '_symbol',
        type: 'string'
      },
      {
        internalType: 'string',
        name: '_baseUri',
        type: 'string'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint16',
        name: '_productId',
        type: 'uint16'
      },
      {
        indexed: false,
        internalType: 'string',
        name: '_productName',
        type: 'string'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_maxIssuance',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_attributes',
        type: 'uint256'
      }
    ],
    name: 'AddProduct',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'approved',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256'
      }
    ],
    name: 'Approval',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'operator',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'approved',
        type: 'bool'
      }
    ],
    name: 'ApprovalForAll',
    type: 'event'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256'
      }
    ],
    name: 'approve',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'string',
        name: '_newBaseURI',
        type: 'string'
      }
    ],
    name: 'BaseURI',
    type: 'event'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_tokenId',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_attributes',
        type: 'uint256'
      }
    ],
    name: 'changeAttributes',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint16',
        name: '_productId',
        type: 'uint16'
      },
      {
        internalType: 'string',
        name: '_productName',
        type: 'string'
      },
      {
        internalType: 'uint256',
        name: '_maxIssuance',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_attributes',
        type: 'uint256'
      }
    ],
    name: 'changeProduct',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32'
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address'
      }
    ],
    name: 'grantRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: '_beneficiary',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: '_tokenId',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint16',
        name: '_productId',
        type: 'uint16'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_issuedId',
        type: 'uint256'
      }
    ],
    name: 'Issue',
    type: 'event'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_beneficiary',
        type: 'address'
      },
      {
        internalType: 'uint16',
        name: '_productId',
        type: 'uint16'
      },
      {
        internalType: 'uint256',
        name: '_attributes',
        type: 'uint256'
      }
    ],
    name: 'issueToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: '_beneficiaries',
        type: 'address[]'
      },
      {
        internalType: 'uint16[]',
        name: '_productIds',
        type: 'uint16[]'
      },
      {
        internalType: 'uint256[]',
        name: '_attributes',
        type: 'uint256[]'
      }
    ],
    name: 'issueTokens',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'pause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'account',
        type: 'address'
      }
    ],
    name: 'Paused',
    type: 'event'
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32'
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address'
      }
    ],
    name: 'renounceRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32'
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address'
      }
    ],
    name: 'revokeRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32'
      },
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'previousAdminRole',
        type: 'bytes32'
      },
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'newAdminRole',
        type: 'bytes32'
      }
    ],
    name: 'RoleAdminChanged',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address'
      }
    ],
    name: 'RoleGranted',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address'
      }
    ],
    name: 'RoleRevoked',
    type: 'event'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256'
      }
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256'
      },
      {
        internalType: 'bytes',
        name: '_data',
        type: 'bytes'
      }
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'operator',
        type: 'address'
      },
      {
        internalType: 'bool',
        name: 'approved',
        type: 'bool'
      }
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'uri',
        type: 'string'
      }
    ],
    name: 'setBaseURI',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256'
      }
    ],
    name: 'Transfer',
    type: 'event'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256'
      }
    ],
    name: 'transferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'unpause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'account',
        type: 'address'
      }
    ],
    name: 'Unpaused',
    type: 'event'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address'
      }
    ],
    name: 'balanceOf',
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
    name: 'baseURI',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'DEFAULT_ADMIN_ROLE',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256'
      }
    ],
    name: 'getApproved',
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
        internalType: 'uint256',
        name: '_tokenId',
        type: 'uint256'
      }
    ],
    name: 'getAttributes',
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
        internalType: 'uint16',
        name: '_productId',
        type: 'uint16'
      }
    ],
    name: 'getProduct',
    outputs: [
      {
        internalType: 'string',
        name: 'productName',
        type: 'string'
      },
      {
        internalType: 'uint256',
        name: 'maxIssuance',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'numIssued',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'attributes',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32'
      }
    ],
    name: 'getRoleAdmin',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32'
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address'
      }
    ],
    name: 'hasRole',
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
        name: '_owner',
        type: 'address'
      },
      {
        internalType: 'address',
        name: '_operator',
        type: 'address'
      }
    ],
    name: 'isApprovedForAll',
    outputs: [
      {
        internalType: 'bool',
        name: 'isOperator',
        type: 'bool'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint16',
        name: '',
        type: 'uint16'
      }
    ],
    name: 'issuable',
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
        internalType: 'uint16',
        name: '',
        type: 'uint16'
      }
    ],
    name: 'issued',
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
    name: 'MINTER_ROLE',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'name',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'OPERATOR_ROLE',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256'
      }
    ],
    name: 'ownerOf',
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
    name: 'paused',
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
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    name: 'productIds',
    outputs: [
      {
        internalType: 'uint16',
        name: '',
        type: 'uint16'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint16',
        name: '',
        type: 'uint16'
      }
    ],
    name: 'products',
    outputs: [
      {
        internalType: 'uint256',
        name: 'max',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'attributes',
        type: 'uint256'
      },
      {
        internalType: 'string',
        name: 'name',
        type: 'string'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint16',
        name: '_productId',
        type: 'uint16'
      }
    ],
    name: 'remainingSupply',
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
        internalType: 'bytes4',
        name: 'interfaceId',
        type: 'bytes4'
      }
    ],
    name: 'supportsInterface',
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
    inputs: [],
    name: 'symbol',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'index',
        type: 'uint256'
      }
    ],
    name: 'tokenByIndex',
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
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    name: 'tokenIssuedIds',
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
        name: 'owner',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'index',
        type: 'uint256'
      }
    ],
    name: 'tokenOfOwnerByIndex',
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
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    name: 'tokenProducts',
    outputs: [
      {
        internalType: 'uint16',
        name: '',
        type: 'uint16'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_tokenId',
        type: 'uint256'
      }
    ],
    name: 'tokenURI',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  }
]
