export default [
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "contract ERC721Collection",
				"name": "_collectionAddress",
				"type": "address"
			}
		],
		"name": "addCollection",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "address",
				"name": "_voucherId",
				"type": "address"
			},
			{
				"internalType": "uint32",
				"name": "_index",
				"type": "uint32"
			}
		],
		"name": "addVoucherId",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "address[]",
				"name": "_voucherIds",
				"type": "address[]"
			},
			{
				"internalType": "uint32[]",
				"name": "_indexes",
				"type": "uint32[]"
			}
		],
		"name": "addVoucherIds",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "string",
				"name": "_voucherCode",
				"type": "string"
			},
			{
				"internalType": "bytes",
				"name": "_signature",
				"type": "bytes"
			},
			{
				"internalType": "bool",
				"name": "_isDcl",
				"type": "bool"
			}
		],
		"name": "craft",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "bool",
				"name": "_pauseIt",
				"type": "bool"
			}
		],
		"name": "pause",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "string",
				"name": "_voucherCode",
				"type": "string"
			}
		],
		"name": "removeVoucher",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "contract ERC721Collection",
				"name": "_collectionAddress",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_index",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "contract ERC721Collection",
				"name": "_address",
				"type": "address"
			}
		],
		"name": "CollectionAdded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_qty",
				"type": "uint256"
			}
		],
		"name": "Added",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "_voucherCode",
				"type": "string"
			}
		],
		"name": "Removed",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "_caller",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "_voucherId",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_wearIndex",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_tokenId",
				"type": "uint256"
			}
		],
		"name": "Crafted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_collIndex",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_wearableId",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "canMint",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "string",
				"name": "_voucherCode",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_wearableName",
				"type": "string"
			},
			{
				"internalType": "bytes",
				"name": "_signature",
				"type": "bytes"
			},
			{
				"internalType": "bool",
				"name": "_isDcl",
				"type": "bool"
			}
		],
		"name": "checkSender",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "string",
				"name": "word",
				"type": "string"
			}
		],
		"name": "encodeVoucher",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "erc721Collections",
		"outputs": [
			{
				"internalType": "contract ERC721Collection",
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "string",
				"name": "_voucherCode",
				"type": "string"
			}
		],
		"name": "getWearIndex",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "isOwner",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_collIndex",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_wearableId",
				"type": "string"
			}
		],
		"name": "remainingSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
]