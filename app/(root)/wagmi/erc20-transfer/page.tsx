// app/erc20-transfer/page.tsx
'use client'
import React, { use, useState } from 'react';
import { useAccountEffect, useReadContract, useWaitForTransactionReceipt, useWatchContractEvent, useWriteContract } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import ERC20_ABI from '../../(task)/const/ercABI';
import { Address, formatEther, parseEther } from 'viem';

export default function Erc20TransferPage() {
    //当前钱包连接的地址
    const [walletAddress, setWalletAddress] = useState('');
    //加载状态
    const [loading, setLoading] = useState(false);
    //需要转账的目标地址
    const [targetAddress, setTargetAddress] = useState('');
    //需要转账的token数量
    const [transferAmount, setTransferAmount] = useState('');
    //地址发生改变的监听事件
    const dealAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTargetAddress(event.target.value);
    }
    //数量发生改变的监听事件
    const dealAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTransferAmount(event.target.value)
    }
    const [transferBalance, setTransferBalance] = useState('--');
    const [balance, setBalance] = useState('--');

    //-----------------------转账功能(使用wagmi方式)----------------------------------------
    // 连接钱包状态
    const [isConnected, setConnected] = useState<boolean>(false);
    useAccountEffect({
        onConnect(data) {
            console.log('连接钱包成功', data);
            setConnected(true);
            setWalletAddress(data.address);
            //开始查询当前合约币
            queryWagmi();
        },
        onDisconnect() {
            console.log('断开连接钱包成功');
            setConnected(false);
            setWalletAddress('');
            setBalance('')
            setTransferBalance('')
        },
    })
    const { refetch } = useReadContract({
        address: process.env.NEXT_PUBLIC_ERC20_CONTRACT_ADDRESS as Address,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [walletAddress],
        chainId: sepolia.id,
    });
    const queryWagmi = async () => {
        const { data: balance } = await refetch();
        // 修复：确保 balance 是 bigint 类型再传递给 formatEther
        if (balance !== undefined && balance !== null) {
            setBalance(`${formatEther(balance as bigint)} ETH`);
        } else {
            setBalance('-- ETH');
        }
    }
    //合约写入交易
    const { writeContract, data: hash } = useWriteContract()
    //监听写入的监听事件

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
        if (!walletAddress) {
            alert('当前钱包地址为空 请断开当前钱包或者重新尝试连接钱包！');
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
        try {
            //发送转账交易
            writeContract({
                address: process.env.NEXT_PUBLIC_ERC20_CONTRACT_ADDRESS as Address,
                abi: ERC20_ABI,
                functionName: 'transfer',
                args: [targetAddress, parseEther(transferAmount)],
                chainId: sepolia.id,
            })
            console.log('wagmi sepolia 转账已发送...请等待钱包的弹窗确认！！');
            setLoading(false);
            alert('转账已发送...请等待钱包的弹窗确认！！');
        } catch (e) {
            console.log('wagmi sepolia转账失败:', e);
            setLoading(false);
            alert('转账异常了..... 请检查操作..........');
        }
    }
    //监听合约的状态（useWatchContractEvent）
    useWatchContractEvent({
        // address: process.env.NEXT_PUBLIC_ERC20_CONTRACT_ADDRESS as Address,
        address: '0x82869541381Ab0155883718CEd9d9d1fcDFc2898',
        abi: ERC20_ABI,
        eventName: 'Transfer',
        chainId: sepolia.id,
        onLogs: (logs) => {
            console.log('转账事件已应答.....');
            console.log('监听合约状态:', logs);
        },
    });
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
            <div className='flex flex-row items-center mt-4'>
                <button onClick={wagmiTransfer} className="bg-red-500 text-white pl-6 pr-6 py-2 rounded-md">转账(wagmi)</button>
            </div>
            <div className="ml-3 font-bold text-red-500 mt-2">
                {loading && '正在努力转账中...'}
            </div>

            <div>------------------------------目标地址余额查询（钱包连接后自动查询当前地址对应合约值）-----------------------------------</div>
            <div className="font-bold text-red-500">
                当前钱包地对应合约中的余额: {balance}
            </div>
            <div className="font-bold text-green-500">
                用户输入的目标转账的地址余额: {transferBalance}
            </div>
        </div>
    );
}