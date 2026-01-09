// app/send-eth/page.tsx
'use client'

import { ethers } from 'ethers'
import { useState } from 'react';

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

      <button onClick={transfer} className="bg-purple-500 text-white px-4 py-2 mt-5 rounded-md">发送 ETH</button>
      <button onClick={clearData} className="bg-purple-500 text-white px-4 py-2 mt-5 rounded-md ml-2">清空 ETH</button>

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