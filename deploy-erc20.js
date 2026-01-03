// 3. 配置核心参数（替换为你从 Remix 复制的 ERC20 合约 ABI 和字节码）
const ERC20_ABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "allowance",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "needed",
                "type": "uint256"
            }
        ],
        "name": "ERC20InsufficientAllowance",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "sender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "balance",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "needed",
                "type": "uint256"
            }
        ],
        "name": "ERC20InsufficientBalance",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "approver",
                "type": "address"
            }
        ],
        "name": "ERC20InvalidApprover",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "receiver",
                "type": "address"
            }
        ],
        "name": "ERC20InvalidReceiver",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "sender",
                "type": "address"
            }
        ],
        "name": "ERC20InvalidSender",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            }
        ],
        "name": "ERC20InvalidSpender",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "OwnableInvalidOwner",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "OwnableUnauthorizedAccount",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Approval",
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
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "internalType": "uint8",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "mint",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

const ERC20_BYTECODE = '0x608060405234801561000f575f5ffd5b50336040518060400160405280600c81526020017f4d794552433230546f6b656e00000000000000000000000000000000000000008152506040518060400160405280600381526020017f4d544b0000000000000000000000000000000000000000000000000000000000815250816003908161008c91906106db565b50806004908161009c91906106db565b5050505f73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff160361010f575f6040517f1e4fbdf700000000000000000000000000000000000000000000000000000000815260040161010691906107e9565b60405180910390fd5b61011e8161013d60201b60201c565b5061013833683635c9adc5dea0000061020060201b60201c565b6108bf565b5f60055f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690508160055f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610270575f6040517fec442f0500000000000000000000000000000000000000000000000000000000815260040161026791906107e9565b60405180910390fd5b6102815f838361028560201b60201c565b5050565b5f73ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16036102d5578060025f8282546102c9919061082f565b925050819055506103a3565b5f5f5f8573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205490508181101561035e578381836040517fe450d38c00000000000000000000000000000000000000000000000000000000815260040161035593929190610871565b60405180910390fd5b8181035f5f8673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2081905550505b5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16036103ea578060025f8282540392505081905550610434565b805f5f8473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f82825401925050819055505b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef8360405161049191906108a6565b60405180910390a3505050565b5f81519050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52604160045260245ffd5b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602260045260245ffd5b5f600282049050600182168061051957607f821691505b60208210810361052c5761052b6104d5565b5b50919050565b5f819050815f5260205f209050919050565b5f6020601f8301049050919050565b5f82821b905092915050565b5f6008830261058e7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82610553565b6105988683610553565b95508019841693508086168417925050509392505050565b5f819050919050565b5f819050919050565b5f6105dc6105d76105d2846105b0565b6105b9565b6105b0565b9050919050565b5f819050919050565b6105f5836105c2565b610609610601826105e3565b84845461055f565b825550505050565b5f5f905090565b610620610611565b61062b8184846105ec565b505050565b5b8181101561064e576106435f82610618565b600181019050610631565b5050565b601f8211156106935761066481610532565b61066d84610544565b8101602085101561067c578190505b61069061068885610544565b830182610630565b50505b505050565b5f82821c905092915050565b5f6106b35f1984600802610698565b1980831691505092915050565b5f6106cb83836106a4565b9150826002028217905092915050565b6106e48261049e565b67ffffffffffffffff8111156106fd576106fc6104a8565b5b6107078254610502565b610712828285610652565b5f60209050601f831160018114610743575f8415610731578287015190505b61073b85826106c0565b8655506107a2565b601f19841661075186610532565b5f5b8281101561077857848901518255600182019150602085019450602081019050610753565b868310156107955784890151610791601f8916826106a4565b8355505b6001600288020188555050505b505050505050565b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f6107d3826107aa565b9050919050565b6107e3816107c9565b82525050565b5f6020820190506107fc5f8301846107da565b92915050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f610839826105b0565b9150610844836105b0565b925082820190508082111561085c5761085b610802565b5b92915050565b61086b816105b0565b82525050565b5f6060820190506108845f8301866107da565b6108916020830185610862565b61089e6040830184610862565b949350505050565b5f6020820190506108b95f830184610862565b92915050565b61111c806108cc5f395ff3fe608060405234801561000f575f5ffd5b50600436106100cd575f3560e01c806370a082311161008a57806395d89b411161006457806395d89b41146101ff578063a9059cbb1461021d578063dd62ed3e1461024d578063f2fde38b1461027d576100cd565b806370a08231146101a7578063715018a6146101d75780638da5cb5b146101e1576100cd565b806306fdde03146100d1578063095ea7b3146100ef57806318160ddd1461011f57806323b872dd1461013d578063313ce5671461016d57806340c10f191461018b575b5f5ffd5b6100d9610299565b6040516100e69190610d95565b60405180910390f35b61010960048036038101906101049190610e46565b610329565b6040516101169190610e9e565b60405180910390f35b61012761034b565b6040516101349190610ec6565b60405180910390f35b61015760048036038101906101529190610edf565b610354565b6040516101649190610e9e565b60405180910390f35b610175610382565b6040516101829190610f4a565b60405180910390f35b6101a560048036038101906101a09190610e46565b61038a565b005b6101c160048036038101906101bc9190610f63565b6103a0565b6040516101ce9190610ec6565b60405180910390f35b6101df6103e5565b005b6101e96103f8565b6040516101f69190610f9d565b60405180910390f35b610207610420565b6040516102149190610d95565b60405180910390f35b61023760048036038101906102329190610e46565b6104b0565b6040516102449190610e9e565b60405180910390f35b61026760048036038101906102629190610fb6565b6104d2565b6040516102749190610ec6565b60405180910390f35b61029760048036038101906102929190610f63565b610554565b005b6060600380546102a890611021565b80601f01602080910402602001604051908101604052809291908181526020018280546102d490611021565b801561031f5780601f106102f65761010080835404028352916020019161031f565b820191905f5260205f20905b81548152906001019060200180831161030257829003601f168201915b5050505050905090565b5f5f6103336105d8565b90506103408185856105df565b600191505092915050565b5f600254905090565b5f5f61035e6105d8565b905061036b8582856105f1565b610376858585610684565b60019150509392505050565b5f6012905090565b610392610774565b61039c82826107fb565b5050565b5f5f5f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f20549050919050565b6103ed610774565b6103f65f61087a565b565b5f60055f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b60606004805461042f90611021565b80601f016020809104026020016040519081016040528092919081815260200182805461045b90611021565b80156104a65780601f1061047d576101008083540402835291602001916104a6565b820191905f5260205f20905b81548152906001019060200180831161048957829003601f168201915b5050505050905090565b5f5f6104ba6105d8565b90506104c7818585610684565b600191505092915050565b5f60015f8473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2054905092915050565b61055c610774565b5f73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16036105cc575f6040517f1e4fbdf70000000000000000000000000000000000000000000000000000000081526004016105c39190610f9d565b60405180910390fd5b6105d58161087a565b50565b5f33905090565b6105ec838383600161093d565b505050565b5f6105fc84846104d2565b90507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff81101561067e578181101561066f578281836040517ffb8f41b200000000000000000000000000000000000000000000000000000000815260040161066693929190611051565b60405180910390fd5b61067d84848484035f61093d565b5b50505050565b5f73ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16036106f4575f6040517f96c6fd1e0000000000000000000000000000000000000000000000000000000081526004016106eb9190610f9d565b60405180910390fd5b5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610764575f6040517fec442f0500000000000000000000000000000000000000000000000000000000815260040161075b9190610f9d565b60405180910390fd5b61076f838383610b0c565b505050565b61077c6105d8565b73ffffffffffffffffffffffffffffffffffffffff1661079a6103f8565b73ffffffffffffffffffffffffffffffffffffffff16146107f9576107bd6105d8565b6040517f118cdaa70000000000000000000000000000000000000000000000000000000081526004016107f09190610f9d565b60405180910390fd5b565b5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff160361086b575f6040517fec442f050000000000000000000000000000000000000000000000000000000081526004016108629190610f9d565b60405180910390fd5b6108765f8383610b0c565b5050565b5f60055f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690508160055f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b5f73ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff16036109ad575f6040517fe602df050000000000000000000000000000000000000000000000000000000081526004016109a49190610f9d565b60405180910390fd5b5f73ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610a1d575f6040517f94280d62000000000000000000000000000000000000000000000000000000008152600401610a149190610f9d565b60405180910390fd5b8160015f8673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f8573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f20819055508015610b06578273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92584604051610afd9190610ec6565b60405180910390a35b50505050565b5f73ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610b5c578060025f828254610b5091906110b3565b92505081905550610c2a565b5f5f5f8573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2054905081811015610be5578381836040517fe450d38c000000000000000000000000000000000000000000000000000000008152600401610bdc93929190611051565b60405180910390fd5b8181035f5f8673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2081905550505b5f73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610c71578060025f8282540392505081905550610cbb565b805f5f8473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f82825401925050819055505b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef83604051610d189190610ec6565b60405180910390a3505050565b5f81519050919050565b5f82825260208201905092915050565b8281835e5f83830152505050565b5f601f19601f8301169050919050565b5f610d6782610d25565b610d718185610d2f565b9350610d81818560208601610d3f565b610d8a81610d4d565b840191505092915050565b5f6020820190508181035f830152610dad8184610d5d565b905092915050565b5f5ffd5b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f610de282610db9565b9050919050565b610df281610dd8565b8114610dfc575f5ffd5b50565b5f81359050610e0d81610de9565b92915050565b5f819050919050565b610e2581610e13565b8114610e2f575f5ffd5b50565b5f81359050610e4081610e1c565b92915050565b5f5f60408385031215610e5c57610e5b610db5565b5b5f610e6985828601610dff565b9250506020610e7a85828601610e32565b9150509250929050565b5f8115159050919050565b610e9881610e84565b82525050565b5f602082019050610eb15f830184610e8f565b92915050565b610ec081610e13565b82525050565b5f602082019050610ed95f830184610eb7565b92915050565b5f5f5f60608486031215610ef657610ef5610db5565b5b5f610f0386828701610dff565b9350506020610f1486828701610dff565b9250506040610f2586828701610e32565b9150509250925092565b5f60ff82169050919050565b610f4481610f2f565b82525050565b5f602082019050610f5d5f830184610f3b565b92915050565b5f60208284031215610f7857610f77610db5565b5b5f610f8584828501610dff565b91505092915050565b610f9781610dd8565b82525050565b5f602082019050610fb05f830184610f8e565b92915050565b5f5f60408385031215610fcc57610fcb610db5565b5b5f610fd985828601610dff565b9250506020610fea85828601610dff565b9150509250929050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602260045260245ffd5b5f600282049050600182168061103857607f821691505b60208210810361104b5761104a610ff4565b5b50919050565b5f6060820190506110645f830186610f8e565b6110716020830185610eb7565b61107e6040830184610eb7565b949350505050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f6110bd82610e13565b91506110c883610e13565b92508282019050808211156110e0576110df611086565b5b9291505056fea26469706673582212200543b986fe2181c6627cafa0cf32d22e95413f54def474c7fe4e75ae0c5a040864736f6c634300081e0033'


// 1. 加载环境变量（从 .env 文件中读取 RPC URL 和私钥）
import { config } from 'dotenv';
config();


// 2. 导入 ethers.js v6 核心模块
import { ethers } from 'ethers';


// 4. 定义异步部署函数（区块链操作均为异步，需用 async/await）
async function deployERC20() {

    try {
        // 步骤 1：连接到 Sepolia 测试网 RPC（创建 Provider，只读通道）
        const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
        console.log(`✅ ------已成功连接到 Sepolia 测试网------`);

        // 步骤 2：用私钥初始化 Wallet（签名者，可写通道，用于支付 Gas 并签名部署交易）
        const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        console.log(`✅ ------已加载部署钱包账户：${wallet.address}------`);

        // 步骤 3：创建合约工厂（ContractFactory）—— ethers.js 部署合约的核心对象
        // 传入：ABI + 字节码 + 签名者（Wallet），三者缺一不可
        const factory = new ethers.ContractFactory(
            ERC20_ABI,
            ERC20_BYTECODE,
            wallet
        );
        console.log(`✅ ------已创建 ERC20 合约工厂------`);

        // 步骤 4：发送部署交易（调用 deploy() 方法，无需传入参数，合约构造函数已固定）
        const erc20Contract = await factory.deploy();
        console.log(`------部署交易已提交，等待上链确认...------`);

        // 步骤 5：等待交易上链完成，获取合约地址
        await erc20Contract.waitForDeployment();
        const contractAddress = await erc20Contract.getAddress();

        // 步骤 6：输出部署结果（关键信息，务必保存）
        console.log(`🎉 ERC20 合约部署成功！`);
        console.log(`📜 合约地址：${contractAddress}`);
        console.log(`🔍 可在 Sepolia Etherscan 查询：https://sepolia.etherscan.io/address/${contractAddress}`);

    } catch (error) {
        console.log(`------ERC20 合约部署失败！------`, error);
    }
}

// 5. 执行部署函数
deployERC20();

//参考：
//https://github.com/MetaNodeAcademy/Advanced4-frontend-upgrade/blob/main/Web3%E5%BC%80%E5%8F%91%E5%BA%93/ethers.js/06.%E9%83%A8%E7%BD%B2%E5%90%88%E7%BA%A6/%E9%83%A8%E7%BD%B2%E5%90%88%E7%BA%A6.md