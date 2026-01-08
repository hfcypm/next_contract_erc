import { ethers } from "ethers";

const mintConfig = {
    // 部署合约的钱包私钥（测试网私钥，主网绝对不要硬编码！）
    // privateKey: "你的钱包私钥（0x开头）",
    privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY || '',
    // Sepolia测试网RPC（推荐用Alchemy/Infura，避免公共节点限流）
    // rpcUrl: "https://sepolia.infura.io/v3/你的Infura API Key",
    rpcUrl: process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || '',
    // 你部署的MyERC20Token合约地址（部署后在Remix/Etherscan上复制）
    // contractAddress: "0x你的合约地址（如0x123456...）",
    contractAddress: process.env.NEXT_PUBLIC_ERC20_CONTRACT_ADDRESS || '',
    // 接收代币的地址（给自己造币就填部署者钱包地址）
    // mintToAddress: "0x你的钱包地址（部署合约的那个地址）",
    mintToAddress: process.env.NEXT_PUBLIC_BALANCE_ADDRESS || '',
    // 要铸造的代币数量（比如铸造500个MTK，用ether单位自动转换为10^18最小单位）
    mintAmount: ethers.parseEther("1500") // 500 MTK = 500 * 10^18 最小单位
}

export default mintConfig;