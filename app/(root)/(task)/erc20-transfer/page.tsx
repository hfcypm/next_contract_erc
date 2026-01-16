// app/erc20-transfer/page.tsx
'use client'
import React, { use, useState } from 'react';
import transferConfig from '../const/transferConfig';
import { ethers } from 'ethers';
import ERC20_ABI from '../const/ercABI';
import { useAccountEffect, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { parseEther } from 'ethers/utils';
import { Address, createPublicClient, createWalletClient, http, parseUnits, WalletClient } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';


export default function Erc20TransferPage() {

  //加载状态
  const [loading, setLoading] = useState(false);
  //需要转账的目标地址
  const [targetAddress, setTargetAddress] = useState('');
  //需要转账的token数量
  const [transferAmount, setTransferAmount] = useState('');

  const dealAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTargetAddress(event.target.value);
  }

  const dealAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTransferAmount(event.target.value)
  }

  //转账功能(ethers)
  const transfer = async () => {
    if (!targetAddress) {
      alert('请输入目标地址');
      return;
    }
    if (!transferAmount) {
      alert('请输入转账数量');
      return;
    }
    //检查配置项目 地址及数量
    const config = transferConfig;
    config.recipientAddress = targetAddress
    config.amount = Number(transferAmount)

    console.log('用户的地址', config.recipientAddress);
    console.log('转账数量', config.amount);

    try {
      setLoading(true);

      //1.创建provider
      const provider = new ethers.JsonRpcProvider(`${config.rpcUrl}`);
      //2.创建wallet(使用私钥及 provider 创建) 签名信息
      const wallet = new ethers.Wallet(config.privateKey, provider);
      //3.加载合约相关信息
      const erc20Contract = new ethers.Contract(config.tokenContractAddress
        , ERC20_ABI, wallet
      );

      //4.开始转账
      console.log(` 开始转账>>>${config.amount}个代币到${config.recipientAddress}...`);
      const transferResult = await erc20Contract.transfer(config.recipientAddress, config.amount);

      //5.等待交易确认
      console.log(`交易已发送，哈希：${transferResult.hash}`);
      console.log("正在交易中...........");

      const receipt = await transferResult.wait();

      // 10. 校验交易结果 
      if (receipt.status === 1) {
        console.log('转账成功', transferResult);
        setLoading(false);
        alert('转账成功');
      } else {
        alert('转账异常了..... 请检查操作..........');
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  const [transferBalance, setTransferBalance] = useState('--');
  const [balance, setBalance] = useState('--');

  // 查询Sepolia测试网地址余额
  const query = async () => {
    setTransferBalance('--');
    setBalance('--');
    if (!targetAddress) {
      alert('请输入目标地址 再进行查询！');
      return;
    }
    //1.创建 contract 对象
    //params 1.合约地址 2.合约abi 3.provider
    //主网及测试网seplolia provider
    const sepProvider = new ethers.JsonRpcProvider(transferConfig.rpcUrl);

    // 2. 读取Sep合约的链上信息（IERC20接口合约）
    //测试网
    // 传钱包地址：查这个钱包有多少该 ERC20 代币（比如你的 MTK，核心用法）；
    // 传合约地址：查这个合约地址有多少该 ERC20 代币（比如 Uniswap 合约里的 USDT 储备，仅特殊场景用）；
    //❌ 绝对不要传「当前 ERC20 合约自己的地址」（比如你的 MTK 合约地址）：除非有人给这个合约转 MTK，否则余额永远是 0，无意义。
    const contractSep = new ethers.Contract(`${process.env.NEXT_PUBLIC_ERC20_CONTRACT_ADDRESS}`, ERC20_ABI, sepProvider);
    // const banace = await contractSep.balanceOf('vitalik.eth');
    // 转账的地址余额
    const transferBalance = await contractSep.balanceOf(`${process.env.NEXT_PUBLIC_BALANCE_ADDRESS}`);
    setTransferBalance(`${ethers.formatEther(transferBalance)}`);

    //转账后的地址余额
    const balance = await contractSep.balanceOf(targetAddress);
    setBalance(`${ethers.formatEther(balance)}`);
  }

  /////////
  //-----------------------转账功能(使用wagmi方式)----------------------------------------
  // 连接钱包状态
  const [isConnected, setConnected] = useState<boolean>(false);
  useAccountEffect({
    onConnect(data) {
      console.log('连接钱包成功', data);
      setConnected(true);
    },
    onDisconnect() {
      console.log('断开连接钱包成功');
      setConnected(false);
    },
  })

  //合约写入交易
  const { writeContract, data: hash } = useWriteContract()
  //确认状态可以使用以处理 view
  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed
  } = useWaitForTransactionReceipt({ hash });
  //发起转账功能
  const wagmiTransfer = async () => {
    if (!isConnected) {
      alert('请先连接钱包');
      return;
    }
    if (!targetAddress) {
      alert('请输入目标地址');
      return;
    }
    if (!transferAmount) {
      alert('请输入转账数量');
      return;
    }
    setLoading(true);
    console.log(` 开始转账>>>${transferConfig.amount}个代币到${transferConfig.recipientAddress}...`);

    try {
      //发送转账交易
      writeContract({
        address: process.env.NEXT_PUBLIC_ERC20_CONTRACT_ADDRESS as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'transfer',
        args: [targetAddress as `0x${string}`, parseEther(transferAmount)],
        chainId: sepolia.id,
      })
      console.log('wagmi sepolia转账成功');
      setLoading(false);
      alert('转账成功');
    } catch (e) {
      console.log('wagmi sepolia转账失败:', e);
      setLoading(false);
      alert('转账异常了..... 请检查操作..........');
    }
  }

  //-----------------------转账功能(使用viem方式)----------------------------------------
  const [userAddress, setUserAddress] = useState<Address>();
  const [isViemConnected, setViemConnected] = useState<boolean>(false);
  const viemTransfer = async () => {
    try {
      if (!isViemConnected) {
        alert('请先连接钱包');
        return;
      }
      if (!userAddress) {
        alert('地址为空 重新断开并连接钱包');
        return;
      }
      if (!targetAddress) {
        alert('请输入目标地址');
        return;
      }
      if (!transferAmount) {
        alert('请输入转账数量');
        return;
      }
      setLoading(true);
      //----------viem 开始转账------------------
      // 注意：这里需要使用私钥创建账户，而不是直接使用连接的钱包地址
      const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY;
      if (!privateKey) {
        alert('私钥为空 请检查环境变量 NEXT_PUBLIC_PRIVATE_KEY');
        return;
      }
      const account = privateKeyToAccount(`0x${privateKey.replace('0x', '')}`);
      //创建钱包及添加(当前连接钱包的私钥)
      const walletClient: WalletClient = createWalletClient({
        chain: sepolia,
        transport: http(process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL),
      });

      //组装一下交易转账的对象(转账必段的参数)
      // 关键：将用户输入的金额转换为代币最小单位（如USDC 0.1 → 100000）
      const publicClient = createPublicClient({
        chain: sepolia,
        transport: http()
      })
      const amountInWei = parseEther(transferAmount);
      console.log(` 开始转账>>>${transferAmount}个代币到${targetAddress}...`);

      console.log('转账的金额（单位：wei）:', amountInWei);

      const { request } = await publicClient.simulateContract({
        account,
        //合约地址
        address: process.env.NEXT_PUBLIC_ERC20_CONTRACT_ADDRESS as Address,
        abi: ERC20_ABI,
        functionName: 'transfer',
        //转账的钱包地址及数量
        args: [targetAddress as Address, amountInWei],
      });
      // 发送合约交易（MetaMask弹出签名框）
      console.log('viem sepolia 交易转账中....  请稍等..........');
      const hash = await walletClient.writeContract(request);
      // 等待交易确认 
      await publicClient.waitForTransactionReceipt({ hash });

      console.log('viem sepolia转账成功:', hash);
      setLoading(false);
      alert('转账成功');
    } catch (e) {
      console.log('viem sepolia转账失败:', e);
      setLoading(false);
      alert('转账异常了..... 请检查操作..........');
    }
  }

  //----------------使用viem 手动去连接一下钱包--------------------------
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('请先安装MetaMask钱包');
      return;
    }
    //获取权限
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    }) as string[];
    if (!accounts.length) {
      alert('未获取到钱包账户')
      return;
    }
    //获取当前钱包地址
    const userAddress = accounts[0] as Address;
    setUserAddress(userAddress);
    console.log('当前钱包地址：', userAddress);
    //获取当前链信息
    const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
    const chainId = parseInt(chainIdHex, 16);
    if (chainId !== sepolia.id) {
      alert('请先切换到Sepolia测试网络');
      return;
    }
    console.log('钱包连接成功 当前链信息：', chainId);
    setViemConnected(true);
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">实现ERC20token的转账功能</h1>
      <div className="flex flex-row items-center">
        <div>转账账户为自己的MetaMask钱包</div>
        <div className="font-bold ml-3 text-red-500">目标地址及转账数量需要自己输入</div>
      </div>
      <div>-----------------------------------------------------------------</div>
      <div className="flex flex-row items-center">
        <div className="text-red-500 font-bold">目标地址:</div>
        <input onChange={dealAddressChange} type="text" className="border-2 border-gray-300 p-2 rounded-md ml-3" />
      </div>
      <div className="flex flex-row items-center mt-2">
        <div className="text-red-500 font-bold">转账数量:</div>
        <input onChange={dealAmountChange} type="text" className="border-2 border-gray-300 p-2 rounded-md ml-3" />
      </div>
      <button onClick={connectWallet} className="bg-red-500 text-white pl-6 pr-6 py-2 rounded-md  mt-2 ">连接钱包</button>
      <div className='flex flex-row items-center mt-4'>
        <button onClick={transfer} className="bg-red-500 text-white pl-6 pr-6 py-2 rounded-md ">转账(ethers)</button>
        <button onClick={wagmiTransfer} className="bg-red-500 text-white pl-6 pr-6 py-2 rounded-md ml-3">转账(wagmi)</button>
        <button onClick={viemTransfer} className="bg-red-500 text-white pl-6 pr-6 py-2 rounded-md ml-3">转账(viem)</button>
      </div>
      <div className="ml-3 font-bold text-red-500 mt-2">
        {loading && '正在努力转账中...'}
      </div>

      <div>------------------------------目标地址余额查询（转账前先查询一下）-----------------------------------</div>
      <button onClick={query} className="bg-red-500 text-white pl-6 pr-6 py-2 rounded-md mt-2">查询转账及目标地址余额</button>
      <div className="ml-3 font-bold text-red-500 mt-1">
        转账的地址余额: {transferBalance}
      </div>
      <div className="ml-3 font-bold text-red-500 mt-1">
        目标地址余额: {balance}
      </div>
    </div>
  );
}