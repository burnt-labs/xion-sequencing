import {Bip39, EnglishMnemonic, Slip10, Slip10Curve, Slip10RawIndex} from "@cosmjs/crypto";
import {DirectSecp256k1Wallet, OfflineDirectSigner} from "@cosmjs/proto-signing";
import {MsgSendEncodeObject, SigningStargateClient, StdFee} from "@cosmjs/stargate";
import {xionConfig} from "./config";

async function derivePrivateKeyFromMnemonic(mnemonic: string): Promise<Uint8Array> {
    try {
        const seed = await Bip39.mnemonicToSeed(new EnglishMnemonic(mnemonic));
        const path = [
            Slip10RawIndex.hardened(44),
            Slip10RawIndex.hardened(118),
            Slip10RawIndex.hardened(0),
            Slip10RawIndex.normal(0),
            Slip10RawIndex.normal(0),
        ];
        const {privkey} = Slip10.derivePath(Slip10Curve.Secp256k1, seed, path);
        return privkey;
    } catch (error) {
        console.error("Error deriving private key from mnemonic", error);
        return Uint8Array.from([]);
    }
}

async function xionTxBankSend(recipient: string, amount: string, mnemonic: string) {
    try {
        const pkey = await derivePrivateKeyFromMnemonic(mnemonic);
        const signer: OfflineDirectSigner = await DirectSecp256k1Wallet.fromKey(
            pkey,
            "xion"
        );

        const client = await SigningStargateClient.connectWithSigner(
            xionConfig.rpcUrl,
            signer
        )

        const [account] = await signer.getAccounts()
        const senderAddress = account.address;

        const recipients = [recipient];
        const sendMsgs: MsgSendEncodeObject[] = recipients.map((recipientAddress: string) => ({
            typeUrl: "/cosmos.bank.v1beta1.MsgSend",
            value: {
                fromAddress: senderAddress,
                toAddress: recipientAddress,
                amount: [{
                    denom: 'uxion',
                    amount: amount,
                }],
            },
        }));

        const fee: StdFee = {
            amount: [{denom: "uxion", amount: "0"}],
            gas: "42424242",
        }

        const tx = await client.signAndBroadcast(senderAddress, sendMsgs, fee);
        console.log("txHash", tx.transactionHash);
        return
    } catch (error) {
        console.error("Error sending transaction", error);
        return null;
    }

}

export {xionTxBankSend}
