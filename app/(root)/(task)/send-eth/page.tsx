// app/send-eth/page.tsx
'use client'

import { ethers } from 'ethers'
import { useState } from 'react';
import { useAccount, useBalance, useReadContract, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import ERC20_ABI from '../const/ercABI';
import { sepolia } from 'wagmi/chains';
import React from 'react';
import { Address, Chain, createPublicClient, http, WalletClient, createWalletClient, parseEther, fromBlobs } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { waitForTransactionReceipt } from 'viem/actions';

export default function SendEthPage() {

  const [address1, setAddress1] = useState('--');
  const [address2, setAddress2] = useState('--');

  const [balance1, setBalance1] = useState('--');
  const [balance2, setBalance2] = useState('--');

  const [afterBalance1, setAfterBalance1] = useState('--');
  const [afterBalance2, setAfterBalance2] = useState('--');

  const [loading, setLoading] = useState(false);
  // 发送 ETH 到另一个地址
  const transfer = async () => {
    setLoading(true);

    //1.创建第一个钱包
    const provider1 = new ethers.JsonRpcProvider(`${process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL}`);
    //参数 1：私钥 2：provider
    const wallet1 = new ethers.Wallet(`${process.env.NEXT_PUBLIC_PRIVATE_KEY}`, provider1);

    //2.创建第二个钱包
    const wallet2 = new ethers.Wallet(`${process.env.NEXT_PUBLIC_PRIVATE_KEY2}`, provider1);

    //3.获取以上两个钱包的地址
    const address1 = await wallet1.getAddress();
    const address2 = await wallet2.getAddress();
    console.log(`address1: ${address1}`);
    console.log(`address2: ${address2}`);


    setAddress1(address1);
    setAddress2(address2);

    //4.转账之前获取两个钱包的 ETH 余额
    const balance1 = await provider1.getBalance(address1);
    const balance2 = await provider1.getBalance(address2);

    console.log(`转账之前>>>>>balance1: ${ethers.formatEther(balance1)}`);
    console.log(`转账之前>>>>>balance2: ${ethers.formatEther(balance2)}`);

    setBalance1(ethers.formatEther(balance1));
    setBalance2(ethers.formatEther(balance2));


    //5.构造转账对象 从地址1 发送至 地址2
    const transaction = {
      to: `${address2}`,
      value: ethers.parseEther("0.01"),
    };

    //6.使用签名者类对象发送交易
    const transactionResponse = await wallet1.sendTransaction(transaction);

    //7.等待交易完成
    await transactionResponse.wait();

    //8.获取转转账后的余额
    const balance1After = await provider1.getBalance(address1);
    const balance2After = await provider1.getBalance(address2);
    console.log(`转账之后>>>>>balance1: ${ethers.formatEther(balance1After)} ETH`);
    console.log(`转账之后>>>>>balance2: ${ethers.formatEther(balance2After)} ETH`);

    setAfterBalance1(ethers.formatEther(balance1After));
    setAfterBalance2(ethers.formatEther(balance2After));

    alert('钱包1 向 钱包2 发送 0.01 ETH 成功！');

    setLoading(false);
  }

  //------------------------------------ wagmi查询 ------------------------------------
  //查询地址钱包1的余额以及地址
  //1. 构造配置对象
  const { refetch: refetchBalance1 } = useBalance({
    address: process.env.NEXT_PUBLIC_BALANCE_ADDRESS as `0x${string}`,
    chainId: sepolia.id,
  });

  const { refetch: refetchAfterBalance1 } = useBalance({
    address: process.env.NEXT_PUBLIC_BALANCE_ADDRESS as `0x${string}`,
    chainId: sepolia.id,
  });

  //2. 开始查询
  const queryWagmi1 = async () => {
    setAddress1(`${process.env.NEXT_PUBLIC_BALANCE_ADDRESS}`);
    const { data: balance } = await refetchBalance1();
    setBalance1(`${balance?.formatted || '--'} ETH`);
  }

  //查询地址钱包2的余额以及地址
  //1. 构造配置对象
  const { refetch: refetchBalance2 } = useBalance({
    address: process.env.NEXT_PUBLIC_BALANCE_ADDRESS2 as `0x${string}`,
    chainId: sepolia.id,
  });

  const { refetch: refetchAfterBalance2 } = useBalance({
    address: process.env.NEXT_PUBLIC_BALANCE_ADDRESS2 as `0x${string}`,
    chainId: sepolia.id,
  });

  //2. 开始查询
  const queryWagmi2 = async () => {
    setAddress2(`${process.env.NEXT_PUBLIC_BALANCE_ADDRESS2}`);
    const { data: balance } = await refetchBalance2();
    setBalance2(`${balance?.formatted || '--'} ETH`);
  }

  // 3. wagmi v2 发送交易核心Hook
  //交易
  const { address: connectedAddress, isConnected } = useAccount();
  // 当前连接钱包的余额
  const {
    data: hash,
    sendTransaction,
    isPending: isSending,
    error: sendError
  } = useSendTransaction()

  // 等待交易确认
  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: confirmError
  } = useWaitForTransactionReceipt({ hash })

  // 监听交易状态变化
  React.useEffect(() => {
    if (isConfirmed && hash) {
      setLoading(false);
      console.log('转账成功............');
      // 刷新发送方和接收方的余额
      queryAfterBalance1();
      queryAfterBalance2();
    }
  }, [isConfirmed, hash]);

  //wagmi方式 发送ETH 至 另外一个地址
  const transferWagmi = async () => {
    //1. 转账之前查询余额
    queryWagmi1();
    queryWagmi2();
    if (!isConnected) {
      alert('请先连接钱包');
      return;
    }
    setLoading(true);
    //2. 地址1 发起 向地址2 转账 0.01 ETH
    sendTransaction({
      to: `${process.env.NEXT_PUBLIC_BALANCE_ADDRESS2}` as `0x${string}`,
      value: ethers.parseEther("0.01"),
    })
    console.log("使用wagmi已发送...等待中......");
  }

  const queryAfterBalance1 = async () => {
    const { data: balance } = await refetchAfterBalance1();
    setAfterBalance1(`${balance?.formatted || '--'} ETH`);
  }
  const queryAfterBalance2 = async () => {
    const { data: balance } = await refetchAfterBalance2();
    setAfterBalance2(`${balance?.formatted || '--'} ETH`);
  }



  //------------------------------------ viem发送ETH ------------------------------------
  // 钱包状态
  // 钱包状态
  const [address, setAddress] = useState<Address | null>(null); // 当前钱包地址
  const [chain, setChain] = useState<Chain | null>(null); // 当前链
  const [isConnectedWallet, setConnectedWallet] = useState<boolean>(false);// 连接状态
  // 1. 创建加载配置（仅发sepolia测试网）
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(`${process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL}`),
  });

  // 2. 发送交易ETH（前提需要连接钱包） 再提前查询好余额 以便于对比
  const queryBlanceViem = async () => {
    if (!isConnectedWallet) {
      alert('请先连接钱包');
      return;
    }
    if (!address) {
      alert('连接钱包的地址为空.... 请示检查连接状态');
      return;
    }
    setLoading(true);
    try {
      //钱包1 余额
      const walletBalance = await publicClient.getBalance({
        address: address as Address,
      });
      setBalance1(`${ethers.formatEther(walletBalance)}`);
      //钱包2 余额
      const walletBalance2 = await publicClient.getBalance({
        address: process.env.NEXT_PUBLIC_BALANCE_ADDRESS2 as Address,
      });
      setBalance2(`${ethers.formatEther(walletBalance2)}`);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // 查询转账后的余额
  const queryBlanceAfterViem = async () => {
    try {
      //钱包1 余额
      const walletBalance = await publicClient.getBalance({
        address: address as Address,
      });
      setAfterBalance1(`${ethers.formatEther(walletBalance)}`);
      //钱包2 余额
      const walletBalance2 = await publicClient.getBalance({
        address: process.env.NEXT_PUBLIC_BALANCE_ADDRESS2 as Address,
      });
      setAfterBalance2(`${ethers.formatEther(walletBalance2)}`);
    } catch (error) {
      console.log(error);
    }
    setLoading(true);
  };
  //开始转账
  const sendETHViem = async () => {
    if (!isConnectedWallet) {
      alert('请先连接钱包');
      return;
    }
    if (!address) {
      alert('连接钱包的地址为空.... 请示检查连接状态');
      return;
    }
    setLoading(true);
    //-------viem真实发送ETH 数据------------------
    try {
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

      //构建发送交易对象
      const sendReqObj = {
        account,
        to: process.env.NEXT_PUBLIC_BALANCE_ADDRESS2 as Address,
        value: parseEther("0.01"),
        chain: sepolia,
      };
      //发送交易请求
      const sendHash = await walletClient.sendTransaction(sendReqObj);
      console.log('交易哈希:', sendHash);

      //等待交易完成
      const sendReceipt = await waitForTransactionReceipt(walletClient, {
        hash: sendHash
      });

      console.log('交易收据:', sendReceipt);
      //查询转账后的余额
      queryBlanceAfterViem();
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  //单独写一个连接钱包的方法
  const connectWallet = async () => {
    try {
      // 检测是否安装MetaMask
      if (!window.ethereum) {
        alert('未检测到MetaMask，请先安装!!!!!!!');
        return;
      }
      // 步骤1：请求钱包账户权限
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      }) as string[];
      if (!accounts.length) {
        alert(' 未获取到钱包账户');
        return;
      }
      const userAddress = accounts[0] as Address;
      //更新地址
      setAddress(userAddress);
      // 步骤2：获取当前链信息
      const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
      const chainId = parseInt(chainIdHex, 16);
      // 校验是否为Sepolia测试网（链ID：11155111）
      if (chainId !== sepolia.id) {
        alert(`请切换到Sepolia测试网（当前链ID：${chainId}）`);
        return;
      }
      //更新链
      setChain(sepolia);
      //更新连接状态
      setConnectedWallet(true);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };



  const clearData = () => {
    setAddress1('--');
    setAddress2('--');

    setBalance1('--');
    setBalance2('--');

    setAfterBalance1('--');
    setAfterBalance2('--');
  }
  return (
    <div className="p-4">
      <h1 className="w-fit text-2xl font-bold mb-4 border-2 border-purple-400">发送 ETH 到另一个地址(ethers)</h1>
      <div>内容说明</div>
      <h2 className="font-bold text-2xl mt-4">Signer签名者类</h2>
      <p>Web3.js 认为用户会在本地部署以太坊节点，私钥和网络连接状态由这个节点管理（实际并不是这样）；而在 ethers.js 中，Provider 提供器类管理网络连接状态，Signer 签名者类或 Wallet 钱包类管理密钥，安全且灵活。
        在 ethers 中，Signer 签名者类是以太坊账户的抽象，可用于对消息和交易进行签名，并将签名的交易发送到以太坊网络，并更改区块链状态。Signer 类是抽象类，不能直接实例化，我们需要使用它的子类：Wallet 钱包类。
      </p>
      <h2 className="font-bold text-2xl mt-4">Wallet钱包类</h2>
      <p>Wallet 类继承了 Signer 类，并且开发者可以像包含私钥的外部拥有帐户（EOA）一样，用它对交易和消息进行签名。</p>
      <div>--------------------------------------------------------</div>
      <div className='flex flex-row'>
        <button onClick={transfer} className="bg-purple-500  hover:bg-purple-600 text-white px-4 py-2 mt-5 rounded-md">发送 ETH(ethers)</button>
        <button onClick={transferWagmi} className="bg-purple-500  hover:bg-purple-600 text-white px-4 py-2 mt-5 rounded-md ml-2">发送 ETH(wagmi)</button>
        <button onClick={sendETHViem} className="bg-purple-500  hover:bg-purple-600 text-white px-4 py-2 mt-5 rounded-md ml-2">发送 ETH(viem)</button>
      </div>
      <button onClick={connectWallet} className="bg-purple-500  hover:bg-purple-600 text-white px-4 py-2 mt-5 rounded-md">连接钱包</button>
      <button onClick={queryBlanceViem} className="bg-purple-500  hover:bg-purple-600 text-white px-4 py-2 mt-5 rounded-md ml-2">查询转账前余额</button>
      <button onClick={clearData} className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 mt-5 rounded-md ml-2" >清空 ETH</button>

      {loading ? <div className='text-center'>加载中...</div> : null}

      <div className='flex flex-row mt-10 pb-20'>
        <div className='flex flex-col w-md gap-4 rounded-lg bg-amber p-4 mt-2 border-2 border-gray-200 '>
          <h3 className="font-bold text-2xl mt-4">钱包1信息</h3>
          <div>地址: {address1}</div>
          <div>余额: {balance1} ETH</div>
          <div>转账后余额: {afterBalance1} ETH</div>
        </div>

        <div className='flex flex-col w-md gap-4 rounded-lg  bg-amber p-4  mt-2 border-2 border-gray-200 ml-4'>
          <h3 className="font-bold text-2xl mt-4">钱包2信息</h3>
          <div>地址: {address2}</div>
          <div>余额: {balance2} ETH</div>
          <div>转账后余额: {afterBalance2} ETH</div>
        </div>

      </div>

    </div>
  );
}