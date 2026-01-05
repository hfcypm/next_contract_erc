'use client'

import { ethers } from 'ethers';
import { useState } from 'react';

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

      //查询主网地址余额
      const balance = await provider.getBalance(`vitalik.eth`);
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
  return (
    <div className="flex flex-col items-center p-4">

      <h1 className="text-2xl font-bold mb-4">查询地址余额</h1>
      <div className="flex flex-row items-center">
        <div onClick={handleClick} className="w-fit h-fit rounded-md bg-blue-500 text-white text-center p-2">开始查询</div>
        <div onClick={clearData} className="w-fit h-fit mx-3 rounded-md bg-blue-500 text-white text-center p-2">清空数据</div>
      </div>

      {isLoading && <div className="text-center">正在努力查询中...</div>}

      <div className="flex-col items-center">
        <p className="my-5">ETH当前余额:{balance}</p>
        <p className="my-5">SEP当前余额:{sepBalance}</p>
      </div>

    </div>
  );
}