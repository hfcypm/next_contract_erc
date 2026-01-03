import { ConnectButton } from '@rainbow-me/rainbowkit'

const WalletHeader = () => {
    return (
        <div className='flex flex-col w-full items-center py-5'>
            <ConnectButton />
            <h2 className="text-2xl font-bold my-5">ERC20合约功能演示</h2>
            <div className='w-full h-0.5 bg-gray-300 mb-5' />
        </div>
    )
}

export default WalletHeader