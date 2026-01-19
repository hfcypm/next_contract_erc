// app/send-eth/page.tsx
'use client'

import { useEffect, useState } from 'react';
import { Address, parseEther } from 'viem';
import { useAccountEffect, useBalance, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { sepolia } from 'wagmi/chains';

export default function SendEthPage() {

  //当前钱包连接的地址
  const [address1, setAddress1] = useState('');
  //目标地址
  const [address2, setAddress2] = useState('');

  //当前钱包的原生代币余额
  const [balance1, setBalance1] = useState('--');
  //用户输入的钱包地址余额
  const [balance2, setBalance2] = useState('--');

  //当前钱包转账后的余额
  const [afterBalance1, setAfterBalance1] = useState('--');
  //用户输入的钱包地址转账后的余额
  const [afterBalance2, setAfterBalance2] = useState('--');

  //加载待状态
  const [loading, setLoading] = useState(false);
  //钱包连接的状态
  const [isConnected, setConnect] = useState<boolean>(false);
  //转账之前 必须先查询当前连接钱包的余额 否则不让发起转账操作
  const [isQuery, setQuery] = useState<boolean>(false);

  //------------------------------------ wagmi查询 ------------------------------------
  //监听当前钱包连接的变化
  useAccountEffect({
    onConnect: (data) => {
      console.log('连接信息：', data);
      setAddress1(data.address);
      setConnect(true);
    }, onDisconnect: () => {
      setConnect(false);
      clearData();
    },
  });
  //查询地址钱包1的余额以及地址(仅在seploia测试网进行发送原生代币)
  //--------------------钱包1 当前连接钱包------------------------------------
  //1. 构造配置对象
  const { refetch: refetchBalance1 } = useBalance({
    address: address1 as Address,
    chainId: sepolia.id,
  });
  const { refetch: refetchAfterBalance1 } = useBalance({
    address: address1 as Address,
    chainId: sepolia.id,
  });
  //2. 开始查询
  const queryWagmi1 = async () => {
    const { data: balance } = await refetchBalance1();
    setBalance1(`${balance?.formatted || '--'}`);
  }
  //--------------------钱包2 用户输入的钱包地址----------------------------------
  //查询地址钱包2的余额以及地址
  //1. 构造配置对象
  const { refetch: refetchBalance2 } = useBalance({
    address: address2 as Address,
    chainId: sepolia.id,
  });
  const { refetch: refetchAfterBalance2 } = useBalance({
    address: address2 as Address,
    chainId: sepolia.id,
  });
  //2. 开始查询
  const queryWagmi2 = async () => {
    const { data: balance } = await refetchBalance2();
    setBalance2(`${balance?.formatted || '--'}`);
  }

  // 3. wagmi v2 发送交易核心Hook
  //交易
  // const { address: connectedAddress, isConnected } = useAccount();
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

  //监听交易确认状态(发送原生代币的时候)
  useEffect(() => {
    if (isConfirmed && hash) {
      alert(`交易成功！哈希值：${hash}`);
      Promise.all([queryAfterBalance1(), queryAfterBalance2()]);
      setLoading(false);
    }
  }, [isConfirmed, hash]);

  const query = async () => {
    if (!isConnected) {
      alert('请先连接钱包');
      return;
    }

    //当前钱包连接的地址
    if (!address1) {
      alert('未获取到当前钱包地址为空！检查当前钱包连接地址1，断开连接后重试！');
      return;
    }

    //当前用户输入的接收地址
    if (!address2) {
      alert('请输入钱包地址2');
      return;
    }

    //转账之前查询余额
    await Promise.all([queryWagmi1(), queryWagmi2()]);

    setQuery(true);
  }

  //wagmi方式 发送ETH 至 另外一个地址
  const transferWagmi = async () => {
    if (!isQuery) {
      alert('请先查询当前转账前钱包余额 进行钱包操作连接相操作！');
      return;
    }

    setLoading(true)
    //2. 地址1 发起 向地址2 转账 0.01 ETH
    sendTransaction({
      to: address2 as Address,
      value: parseEther("0.01"),
    })
    alert('转账已发送...请等待钱包确认弹窗......');
  }

  //wagmi方式 查询转账后的余额
  const queryAfterBalance1 = async () => {
    const { data: balance } = await refetchAfterBalance1();
    setAfterBalance1(`${balance?.formatted || '--'} ETH`);
  }
  const queryAfterBalance2 = async () => {
    const { data: balance } = await refetchAfterBalance2();
    setAfterBalance2(`${balance?.formatted || '--'} ETH`);
  }

  const clearData = () => {
    setLoading(false)
    setAddress2('');

    setBalance1('--');
    setBalance2('--');

    setAfterBalance1('--');
    setAfterBalance2('--');

    setQuery(false)
  }

  const onTargetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress2(e.target.value);
  }
  return (
    <div className="p-4">
      <h3 className="w-fit text-2xl font-bold mb-4">发送 ETH 到另一个地址(wagmi方式)</h3>
      <div className='flex flex-row mt-2'>
        <div>发送地址:</div>
        <input type="text" placeholder='请输入发送的目标地址' value={address2} onChange={onTargetChange} className='border-purple-300 border-2 rounded-sm ml-2 px-1' />
      </div>
      <div className='flex flex-row mt-2'>
        <div>发送数量: (默认0.01 ETH)</div>
      </div>
      <div className='flex flex-row mt-2'>
        <div className='text-red-500'>说明：从当前钱包连接地址发送目标地址0.01 ETH</div>
      </div>
      <div onClick={query} className='w-fit bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 mt-2 rounded-md'>1.查询当前转账前钱包余额</div>
      <div className='flex flex-row'>
        <button onClick={transferWagmi} className="bg-purple-500  hover:bg-purple-600 text-white px-4 py-2 mt-5 rounded-md">2.发送 ETH(wagmi)</button>
      </div>
      <button onClick={clearData} className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 mt-5 rounded-md" >3.清空 ETH</button>

      {loading ? <div className='mt-2'>加载中...</div> : null}

      <div className='flex flex-row mt-2'>
        <div className='flex flex-col w-md gap-4 rounded-lg bg-amber p-4 mt-2 border-2 border-gray-200 '>
          <h3 className="font-bold text-2xl">钱包1信息(当前连接的钱包)</h3>
          <div>地址: {address1}</div>
          <div>余额: {balance1} ETH</div>
          <div>转账后余额: {afterBalance1} ETH</div>
        </div>

        <div className='flex flex-col w-md gap-4 rounded-lg  bg-amber p-4  mt-2 border-2 border-gray-200 ml-4'>
          <h3 className="font-bold text-2xl">钱包2信息（用户输入发送的目标钱包）</h3>
          <div>地址: {address2}</div>
          <div>余额: {balance2} ETH</div>
          <div>转账后余额: {afterBalance2} ETH</div>
        </div>

      </div>

    </div>
  );
}