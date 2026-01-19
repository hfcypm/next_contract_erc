'use client'

import { useState } from 'react';
import { useAccountEffect, useReadContract } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import ERC20_ABI from '../../(task)/const/ercABI';
import { Address, formatEther } from 'viem';

export default function Erc20BalancePage() {

    const [address, setAddress] = useState('');
    const [balance, setBalance] = useState('--');
    const [loading, setLoading] = useState(false);

    //清空数据
    const clearData = () => {
        setLoading(false);
        setBalance('--');
    }
    //------------------------wagmi查询-------------------------------------
    // 配置钱包连接地址 查询合约是需要的
    useAccountEffect({
        onConnect: async (data) => {
            console.log('onConnect', data);
            setAddress(data?.address);
        }, onDisconnect: () => {
            clearData();
        }
    })
    //1. 构造配置对象
    const { refetch } = useReadContract({
        address: process.env.NEXT_PUBLIC_ERC20_CONTRACT_ADDRESS as Address,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [address],
        chainId: sepolia.id,
    });
    //2. 开始查询
    const queryWagmi = async () => {
        if (!address) {
            alert('请先断开或者连接钱包 当前钱包地址为空！');
            return;
        }
        setLoading(true);
        const { data: balance } = await refetch();
        // 修复：确保 balance 是 bigint 类型再传递给 formatEther
        if (balance !== undefined && balance !== null) {
            setBalance(`${formatEther(balance as bigint)} ETH`);
        } else {
            setBalance('-- ETH');
        }
        setLoading(false);
    }
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">调用一个 ERC-20 合约的 balanceOf</h1>
            <p>当前连接钱包地址: {address}</p>
            <p>合约查询（合约币 balanceOf）</p>
            <div>查询合约方法：balanceOf</div>
            <div className='flex flex-row py-5'>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={queryWagmi}>查询(wagmi)</button>
            </div>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={clearData}>清空</button>
            {loading && <div className="text-center py-3">正在努力查询中...</div>}
            <div className='flex flex-col width-[800px]'>
                <div>查询合约地址： {process.env.NEXT_PUBLIC_ERC20_CONTRACT_ADDRESS}</div>
                <p>测试网合约币余额: {balance}</p>
            </div>
        </div>
    );
}