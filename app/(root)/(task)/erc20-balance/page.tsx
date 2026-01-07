// app/erc20-balance/page.tsx

'use client'

import { ethers } from 'ethers';
import ERC20_ABI from '../const/ercABI'
import { useState } from 'react';

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
    //1.创建 contract 对象
    //params 1.合约地址 2.合约abi 3.provider
    //主网及测试网seplolia provider
    const sepProvider = new ethers.JsonRpcProvider(`${process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL}`);

    // 2. 读取Sep合约的链上信息（IERC20接口合约）
    //测试网
    const contractSep = new ethers.Contract(`${process.env.NEXT_PUBLIC_ERC20_CONTRACT_ADDRESS}`, ERC20_ABI, sepProvider);
    const banace = await contractSep.balanceOf('vitalik.eth');
    const name = await contractSep.name();
    const symbols = await contractSep.symbol();
    console.log(`合约地址: ${process.env.NEXT_PUBLIC_ERC20_CONTRACT_ADDRESS}`)
    setAddress(`${process.env.NEXT_PUBLIC_ERC20_CONTRACT_ADDRESS}`);
    setName(`${name}`);
    setSymbol(`${symbols}`);
    setBalance(`${banace}`);
    setLoading(false);
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

    </div>
  );
}