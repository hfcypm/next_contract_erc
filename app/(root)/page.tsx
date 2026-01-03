import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col w-full min-h-screen items-center  bg-zinc-50 font-sans dark:bg-black">
      <Link href="/check-balance" className="block bg-purple-200 text-black hover:bg-purple-300 px-4 py-2 rounded-md text-center transition-colors">
        查询地址余额
      </Link>
      <Link href="/send-eth" className="block bg-purple-200 text-black hover:bg-purple-300 px-4 py-2 rounded-md text-center transition-colors mt-5">
        发送 ETH 到另一个地址
      </Link>
      <Link href="/erc20-balance" className="block bg-purple-200 text-black hover:bg-purple-300 px-4 py-2 rounded-md text-center transition-colors mt-5">
        调用一个 ERC-20 合约的 balanceOf
      </Link>
      <Link href="/listen-events" className="block bg-purple-200 text-black hover:bg-purple-300 px-4 py-2 rounded-md text-center transition-colors mt-5">
        监听 ERC-20 合约的 Transfer 事件
      </Link>
      <Link href="/erc20-transfer" className="block bg-purple-200 text-black hover:bg-purple-300 px-4 py-2 rounded-md text-center transition-colors mt-5">
        实现ERC20token的转账功能
      </Link>
    </div>
  );
}
