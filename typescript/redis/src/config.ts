export const xionConfig = {
    amount: 1,
    recipient: process.env.XION_RECIPIENT ?? "",
    mnemonic: process.env.XION_MNEMONIC ?? "",
    rpcUrl: process.env.XION_RPC_URL ?? "https://rpc.xion-testnet-1.burnt.com",
}
