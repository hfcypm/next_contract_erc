'use client'

import { ethers } from 'ethers';
import { useState } from 'react';
import { createPublicClient, http } from 'viem';
import { useBalance } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';

// 利用公共rpc节点连接以太坊网络
// 可以在 https://chainlist.org 上找到
const ALCHEMY_MAINNET_URL = 'https://rpc.ankr.com/eth';
const ALCHEMY_SEPOLIA_URL = 'https://rpc.sepolia.org';

// app/check-balance/page.tsx
export default function CheckBalancePage() {
  const [balance, setBalance] = useState('');
  const [sepBalance, setSepBalance] = useState('');
  const [isLoading, setLoading] = useState(false);

  const clearData = () => {
    setBalance('--');
    setSepBalance('--');
  }
  const handleClick = async () => {
    try {
      setLoading(true)
      //连接以太坊主网节点
      const provider = new ethers.JsonRpcProvider(`${process.env.NEXT_PUBLIC_ETH_RPC_URL}`);
      //连接Sepolia测试网节点
      const sepProvider = new ethers.JsonRpcProvider(`${process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL}`);

      //查询主网地址余额----使用钱包地址直接查询
      const balance = await provider.getBalance(`${process.env.NEXT_PUBLIC_BALANCE_ADDRESS}`);
      setBalance(`${ethers.formatEther(balance)} ETH`);

      //查询Sepolia测试网地址余额
      const sepBalance = await sepProvider.getBalance(`${process.env.NEXT_PUBLIC_BALANCE_ADDRESS}`);
      setSepBalance(`${ethers.formatEther(sepBalance)} ETH`);

      setLoading(false)
    } catch (error) {
      console.log(error);
      setLoading(false)
    }
  };

  //-----------------------------wagmi--------------------------------
  //主网查询余额
  const { data: mainnetData, refetch: refetchMainnet } = useBalance({
    address: process.env.NEXT_PUBLIC_BALANCE_ADDRESS as `0x${string}`,
    chainId: mainnet.id,
  });
  //测试网查询余额
  const { data: sepoliaData, refetch: refetchSepolia } = useBalance({
    address: process.env.NEXT_PUBLIC_BALANCE_ADDRESS as `0x${string}`,
    chainId: sepolia.id,
  });
  //使用wagmi查询余额
  const handleClickWagmi = async () => {
    setLoading(true)
    const [mainResult, sepResult] = await Promise.all([refetchMainnet(), refetchSepolia()]);
    console.log('wagmi Mainnet查询余额:', mainResult?.data?.value);
    setLoading(false);
    const value = mainResult?.data?.formatted || '--';
    const symbol = mainResult?.data?.symbol;
    setBalance(`${value} ${symbol}`);

    const sepValue = sepResult?.data?.formatted || '--';
    const sepSymbol = sepResult?.data?.symbol;
    setSepBalance(`${sepValue} ${sepSymbol}`);
    console.log('wagmi Seplolia查询余额:', sepResult?.data?.value);
  }

  //------------------------viem-------------------------------------
  //viem 查询原生币
  const handleClickViem = async () => {
    setLoading(true)
    // 1. 创建对应链的Public Client（核心：连接指定链的RPC）
    const mainClient = createPublicClient({
      chain: mainnet,
      transport: http(`${process.env.NEXT_PUBLIC_ETH_RPC_URL}`),
    });
    const sepClient = createPublicClient({
      chain: sepolia,
      transport: http(`${process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL}`),
    });
    // 2. 核心：查询原生币余额（返回bigint类型的wei值，避免精度丢失）
    const balance = await mainClient.getBalance({
      address: process.env.NEXT_PUBLIC_BALANCE_ADDRESS as `0x${string}`,
    });
    const sepBalance = await sepClient.getBalance({
      address: process.env.NEXT_PUBLIC_BALANCE_ADDRESS as `0x${string}`,
    });
    setBalance(`${ethers.formatEther(balance)} ETH`);
    setSepBalance(`${ethers.formatEther(sepBalance)} ETH`);
    setLoading(false)
  }

  return (
    <div className="flex flex-col p-4">

      <h1 className="text-2xl font-bold mb-4">查询地址余额</h1>
      <div className="flex flex-row">
        <div onClick={handleClick} className="w-fit h-fit rounded-md bg-blue-500 text-white text-center p-2">查询(ethers)</div>
        <div onClick={handleClickWagmi} className="w-fit h-fit rounded-md bg-blue-500 text-white text-center p-2 ml-2">查询(wagmi)</div>
        <div onClick={handleClickViem} className="w-fit h-fit rounded-md bg-blue-500 text-white text-center p-2 ml-2">查询(viem)</div>
      </div>

      <div onClick={clearData} className="w-fit h-fit rounded-md bg-blue-500 text-white text-center p-2 mt-2">清空数据</div>

      {isLoading && <div className="text-center">正在努力查询中...</div>}

      <div className="flex-col">
        <p className="my-5">ETH当前余额:{balance}</p>
        <p className="my-5">SEP当前余额:{sepBalance}</p>
      </div>

    </div>
  );
}