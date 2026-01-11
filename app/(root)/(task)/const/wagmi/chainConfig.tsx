import { createConfig, http } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";


const config = createConfig({
    chains: [mainnet, sepolia],
    transports: {
        [mainnet.id]: http(),
        [sepolia.id]: http(),
    },
});

export default config;