// app/erc20-balance/page.tsx

'use client'

import { ethers } from 'ethers';
import ERC20_ABI from '../const/ercABI'
import { useState } from 'react';
import mintConfig from '../const/mintConfig';

export default function Erc20BalancePage() {

  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState('');
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');

  const [loading, setLoading] = useState(false);

  //清空数据
  const clearData = () => {
    setLoading(false);
    setAddress('--');
    setBalance('--');
    setName('--');
    setSymbol('--');
  }

  const query = async () => {
    setLoading(true);

    setLoading(true);
    //1.创建 contract 对象
    //params 1.合约地址 2.合约abi 3.provider
    //主网及测试网seplolia provider
    const sepProvider = new ethers.JsonRpcProvider(`${process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL}`);

    // 2. 读取Sep合约的链上信息（IERC20接口合约）
    //测试网
    // 传钱包地址：查这个钱包有多少该 ERC20 代币（比如你的 MTK，核心用法）；
    // 传合约地址：查这个合约地址有多少该 ERC20 代币（比如 Uniswap 合约里的 USDT 储备，仅特殊场景用）；
    //❌ 绝对不要传「当前 ERC20 合约自己的地址」（比如你的 MTK 合约地址）：除非有人给这个合约转 MTK，否则余额永远是 0，无意义。
    const contractSep = new ethers.Contract(`${process.env.NEXT_PUBLIC_ERC20_CONTRACT_ADDRESS}`, ERC20_ABI, sepProvider);
    // const banace = await contractSep.balanceOf('vitalik.eth');
    const banace = await contractSep.balanceOf(`${process.env.NEXT_PUBLIC_BALANCE_ADDRESS}`);

    const name = await contractSep.name();
    const symbols = await contractSep.symbol();

    // console.log(`合约地址: ${process.env.NEXT_PUBLIC_ERC20_CONTRACT_ADDRESS}`)
    // setAddress(`${process.env.NEXT_PUBLIC_ERC20_CONTRACT_ADDRESS}`);
    setAddress(`${process.env.NEXT_PUBLIC_BALANCE_ADDRESS}`);
    setName(`${name}`);
    setSymbol(`${symbols}`);
    setBalance(`${ethers.formatEther(banace)}`);
    setLoading(false);
  }

  //给自己钱包铸币过程
  const mintTokenToSelf = async () => {
    try {

      if (mintConfig.privateKey === '') {
        console.log('请先配置环境变量PRIVATE_KEY');
        setLoading(false);
        return;
      }

      const rpcUrl = mintConfig.rpcUrl;
      if (rpcUrl === '') {
        console.log('请先配置环境变量NEXT_PUBLIC_ETH_RPC_URL');
        setLoading(false);
        return;
      }
      const contractAddress = mintConfig.contractAddress;
      if (contractAddress === '') {
        console.log('请先配置环境变量NEXT_PUBLIC_ERC20_CONTRACT_ADDRESS');
        setLoading(false);
        return;
      }

      setLoading(true);
      // 步骤1：初始化Provider（连接区块链节点）和Signer（签名者，需要私钥，用于支付Gas）
      const provider = new ethers.JsonRpcProvider(mintConfig.rpcUrl);
      // Signer必须用部署合约的钱包私钥（因为onlyOwner权限）
      const signer = new ethers.Wallet(mintConfig.privateKey, provider);
      console.log("当前拥有mint权限的账户：", signer.address);


      // 步骤2：定义合约ABI（仅需包含mint和balanceOf方法，无需完整ABI）
      const erc20API = ERC20_ABI;

      // 步骤3：实例化合约对象（传入合约地址、ABI、Signer——因为是写入操作，必须传Signer）
      const tokenContract = new ethers.Contract(
        mintConfig.contractAddress,
        erc20API,
        signer // 写入操作必须传Signer（只读操作传Provider即可）
      );

      // 步骤4：调用mint方法（写入操作，会消耗Gas）
      console.log(`开始给地址 ${mintConfig.mintToAddress} 铸造 ${ethers.formatEther(mintConfig.mintAmount)} MTK...`);
      const mintTx = await tokenContract.mint(mintConfig.mintToAddress, mintConfig.mintAmount);
      // 等待交易上链确认（必须等，否则可能交易未完成就查询余额）
      await mintTx.wait();
      console.log("铸造交易成功！交易哈希：", mintTx.hash);

      // 步骤5：验证铸造结果——查询接收地址的余额
      const rawBalance = await tokenContract.balanceOf(mintConfig.mintToAddress);
      const decimals = await tokenContract.decimals();
      const formattedBalance = ethers.formatUnits(rawBalance, decimals);
      console.log(`地址 ${mintConfig.mintToAddress} 的最新余额：${formattedBalance} MTK`);
      setBalance(formattedBalance);

      setLoading(false);

    } catch (error) {
      console.error('铸币失败>>>>Error minting tokens:', error);
      setLoading(false);
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">调用一个 ERC-20 合约的 balanceOf</h1>
      <p>合约查询（余额及其他信息测试-Use Contract）</p>
      <div className='flex flex-row items-center justify-center py-5'>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={query}>查询</button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-5" onClick={clearData}>清空</button>
      </div>
      {loading && <div className="text-center py-3">正在努力查询中...</div>}
      <div className='flex flex-col width-[800px]'>
        <p>合约地址: {address}</p>
        <p>名称: {name}</p>
        <p>代号: {symbol}</p>
        <p>测试网余额（Vitalik持仓）: {balance}</p>
      </div>

      <div>------------------------------------调用mint方法铸造代币(调用mint方法)----------------------------------------</div>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={mintTokenToSelf}>开始铸造代币</button>

      {loading && <div className="text-center py-3">正在努力铸造代币中...</div>}

    </div>
  );
}