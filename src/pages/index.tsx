import type { NextPage } from 'next'
import { useCallback } from 'react'
import { m } from 'framer-motion'
import { BN } from '@project-serum/anchor'
import { useWallet } from '@solana/wallet-adapter-react'

import { fade } from '../utils/transitions'
import StreamClient from 'solana/StreamClient'
import { getBN } from 'solana/utils'



const Home: NextPage = () => {
  const wallet = useWallet()

  const handleClick = useCallback(
    async (fun: string) => {
      if (!wallet.wallet) {
        alert('请先连接钱包，并切换到devnet网络')
        return
      }
      const stream = new StreamClient();
      if (fun == 'create') {
        const tx = await stream.create({
          sender: wallet, // Wallet/Keypair signing the transaction, creating and sending the stream.
          recipient: "7tm3grTbsBAchMfk1bpPDM8vvJA8N33BGMv4ay7NucFr", // Solana recipient address.
          mint: "HqbvAKBof3QuNZEk5W8aaiihFKokP4bVN1kLgEJCZrXB", // SPL Token mint.
          start: (new Date()).valueOf() / 1000, // Timestamp (in seconds) when the stream/token vesting starts.
          depositedAmount: getBN(100, 9), // depositing 100 tokens with 9 decimals mint.
          period: 1, // Time step (period) in seconds per which the unlocking occurs.
          cliff: (new Date()).valueOf() / 1000 + 10000, // Vesting contract "cliff" timestamp in seconds.
          cliffAmount: new BN(10), // Amount unlocked at the "cliff" timestamp.
          amountPerPeriod: getBN(5, 9), // Release rate: how many tokens are unlocked per each period.
          name: "Transfer to Jane Doe.", // The stream name or subject.
          canTopup: false, // setting to FALSE will effectively create a vesting contract.
          cancelableBySender: true, // Whether or not sender can cancel the stream.
          cancelableByRecipient: false, // Whether or not recipient can cancel the stream.
          transferableBySender: true, // Whether or not sender can transfer the stream.
          transferableByRecipient: false, // Whether or not recipient can transfer the stream.
          automaticWithdrawal: true, // Whether or not a 3rd party (e.g. cron job, "cranker") can initiate a token withdraw/transfer.
          withdrawalFrequency: 10, // Relevant when automatic withdrawal is enabled. If greater than 0 our withdrawor will take care of withdrawals. If equal to 0 our withdrawor will skip, but everyone else can initiate withdrawals.
          partner: null, //  (optional) Partner's wallet address (string | null).
        }).catch((error) => {
          console.log(error)
        })
        console.log(`create tx: ${tx}`)
      } else if (fun == 'withdraw') {
        const tx = await stream.withdraw({
          invoker: wallet,
          id: 'AAAAyotqTZZMAAAAmsD1JAgksT8NVAAAASfrGB5RAAAA',
          amount: getBN(100, 9),
        }).catch((error) => {
          console.log(error)
        })
        console.log(`withdraw tx: ${tx}`)
      } else if (fun == 'cancel') {
        const tx = await stream.cancel({
          invoker: wallet,
          id: 'AAAAyotqTZZMAAAAmsD1JAgksT8NVAAAASfrGB5RAAAA',
        }).catch((error) => {
          console.log(error)
        })
        console.log(`cancel tx: ${tx}`)
      } else if (fun == 'topup') {
        const tx = await stream.topup({
          invoker: wallet,
          id: 'AAAAyotqTZZMAAAAmsD1JAgksT8NVAAAASfrGB5RAAAA',
          amount: getBN(100, 9),
        }).catch((error) => {
          console.log(error)
        })
        console.log(`topup tx: ${tx}`)
      }
    },
    [wallet]
  )

  return (
    <m.div variants={fade}>
      <div>
        <button
          className="bg-blue-700 p-3 rounded-md"
          onClick={() => handleClick('create')}
        >
          create
        </button>
        <button
          className="bg-blue-700 p-3 rounded-md ml-2"
          onClick={() => handleClick('withdraw')}
        >
          withdraw
        </button>
        <button
          className="bg-blue-700 p-3 rounded-md ml-2"
          onClick={() => handleClick('cancel')}
        >
          cancel
        </button>
        <button
          className="bg-blue-700 p-3 rounded-md ml-2"
          onClick={() => handleClick('topup')}
        >
          topup
        </button>
      </div>
    </m.div>
  )
}

export default Home
