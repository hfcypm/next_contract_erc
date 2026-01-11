import { ethers } from 'ethers'

const transferConfig = {
    // Sepolia测试网RPC（推荐用Alchemy/Infura，避免公共节点限流）
    // rpcUrl: "https://sepolia.infura.io/v3/你的Infura API Key",
    rpcUrl: process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || '',
    // 部署合约的钱包私钥（测试网私钥，主网绝对不要硬编码！）
    // privateKey: "你的钱包私钥（0x开头）",
    privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY || '',
    // 合约地址
    tokenContractAddress: process.env.NEXT_PUBLIC_ERC20_CONTRACT_ADDRESS || '',
    // 转账目标地址
    // recipientAddress: "接收方钱包地址（0x开头）",
    recipientAddress: '',
    // 转账数量-先默认给0.1 后面读取用户输入的地址
    amount: 0.1, // 转账0.1个代币（USDT）
    // decimal 小数位数
    decimal: 6,
}

export default transferConfig;
