'use client'

import { useState } from 'react';
import { Address } from 'viem';
import { useAccountEffect, useBalance } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';

// app/check-balance/page.tsx
export default function CheckBalancePage() {
  const [balance, setBalance] = useState('--');
  const [sepBalance, setSepBalance] = useState('--');
  const [isLoading, setLoading] = useState(false);
  //钱包链接状态
  const [isConnected, setConnected] = useState<boolean>(false);
  //当前的钱包地址
  const [connectAddress, setConnectAddress] = useState<string>('');

  const clearData = () => {
    setBalance('--');
    setSepBalance('--');
  }
  //-----------------------------wagmi--------------------------------
  //通过useAmount 获取当前的连接状态（如状态  地址信息）
  useAccountEffect({
    onConnect: (data) => {
      console.log('连接信息：', data.address);
      setConnected(true);
      setConnectAddress(data.address);
    },
    onDisconnect: () => {
      clearData();
      setConnected(false);
    },
  });

  //使用 useBalance 获取余额（主网）
  const { refetch: refetchMainnet } = useBalance({
    address: connectAddress as Address,
    chainId: mainnet.id,
  })
  //使用 useBalance 获取余额（Sepolia测试网）
  const { refetch: refetchSepolia } = useBalance({
    address: connectAddress as Address,
    chainId: sepolia.id,
  });

  //使用wagmi查询余额
  const handleClickWagmi = async () => {
    if (!isConnected) {
      alert('请先连接钱包')
      return;
    }
    if (!connectAddress) {
      alert('连接地址为空 请检查钱包连接状态！或者重试！')
      return;
    }
    setLoading(true);
    // 手动触发刷新
    const mainResult = await refetchMainnet();
    const sepResult = await refetchSepolia();
    // const [mainResult, sepResult] = await Promise.all([
    //   refetchMainnet(),
    //   refetchSepolia()
    // ]);

    console.log('wagmi Mainnet查询余额:', mainResult?.data?.value);
    console.log('wagmi Seplolia查询余额:', sepResult?.data?.value);

    // 更新显示的数据
    const mainValue = mainResult?.data?.formatted || '--';
    const mainSymbol = mainResult?.data?.symbol || '';
    setBalance(`${mainValue} ${mainSymbol}`);

    const sepValue = sepResult?.data?.formatted || '--';
    const sepSymbol = sepResult?.data?.symbol || '';
    setSepBalance(`${sepValue} ${sepSymbol}`);

    setLoading(false);
  }

  return (
    <div className="flex flex-col p-4 min-h-screen max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Wagmi查询地址余额</h1>

      <div className="flex flex-col items-center space-y-3 mb-6">
        <button
          onClick={handleClickWagmi}
          disabled={isLoading}
          className="w-48 h-10 rounded-md bg-blue-500 text-white text-center p-2 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {isLoading ? '查询中...' : '查询(wagmi)'}
        </button>

        <button
          onClick={clearData}
          className="w-48 h-10 rounded-md bg-blue-500 text-white text-center p-2 hover:bg-blue-600 transition-all duration-200"
        >
          清空数据
        </button>
      </div>

      {/* 固定宽度的加载提示，居中显示 */}
      <div className="flex justify-center mb-4 min-h-6">
        {isLoading && <div className="font-medium text-blue-600 animate-pulse">正在努力查询中...</div>}
      </div>

      {/* 固定布局，防止内容移动 */}
      <div className="flex flex-col space-y-6 min-h-30">
        <div className="flex justify-between items-center px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 min-h-12.5">
          <span className="font-semibold text-gray-700 w-32">ETH当前余额:</span>
          <span className={`text-right font-mono ${balance === '--' ? 'text-gray-500 italic' : 'text-red-500 font-medium'}`}>
            {balance}
          </span>
        </div>

        <div className="flex justify-between items-center px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 min-h-12.5">
          <span className="font-semibold text-gray-700 w-32">Sepolia余额:</span>
          <span className={`text-right font-mono ${sepBalance === '--' ? 'text-gray-500 italic' : 'text-red-500 font-medium'}`}>
            {sepBalance}
          </span>
        </div>
      </div>

    </div>
  );
}