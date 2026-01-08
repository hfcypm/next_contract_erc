import Link from "next/link";
import { LinkStyle } from "../components/LinkStyle";

export default function Home() {
  return (
    <div className="flex flex-col w-full min-h-screen items-center  bg-zinc-50 font-sans dark:bg-black">
      <LinkStyle href='/check-balance'>查询地址余额</LinkStyle>
      <LinkStyle href='/erc20-balance' className="mt-5"> 调用一个 ERC-20 合约的 balanceOf</LinkStyle>
      <LinkStyle href='/send-eth' className="mt-5">发送 ETH 到另一个地址</LinkStyle>
      <LinkStyle href='/listen-events' className="mt-5">监听 ERC-20 合约的 Transfer 事件</LinkStyle>
      <LinkStyle href='/erc20-transfer' className="mt-5">实现ERC20token的转账功能</LinkStyle>
    </div>
  );
}
