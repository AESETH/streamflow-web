import type { NextPage } from 'next'
import { useCallback } from 'react'
import { m } from 'framer-motion'
import { BN } from '@project-serum/anchor'
import { useWallet } from '@solana/wallet-adapter-react'

import { fade } from '../utils/transitions'
import StreamClient from 'solana/StreamClient'



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
          sender: wallet,
          recipient: 'HDRL6fpRmYSn36YWaWJaR6zhU6BYqjaWcybGTeABQQkz',
          mint: 'So11111111111111111111111111111111111111112',
          start: 1661404343,
          depositedAmount: new BN(10000),
          period: 1,
          cliff: 1,
          cliffAmount: new BN(1),
          amountPerPeriod: new BN(1),
          name: 'name',
          canTopup: true,
          cancelableBySender: false,
          cancelableByRecipient: false,
          transferableBySender: false,
          transferableByRecipient: false,
        }).catch((error) => {
          console.log(error)
        })
        console.log(`create tx: ${tx}`)
      } else if (fun == 'withdraw') {
        const tx = await stream.withdraw(wallet).catch((error) => {
          console.log(error.logs)
        })
        console.log(`withdraw tx: ${tx}`)
      } else if (fun == 'cancel') {
        const tx = await stream.cancel(wallet).catch((error) => {
          console.log(error.logs)
        })
        console.log(`cancel tx: ${tx}`)
      } else if (fun == 'topup') {
        const tx = await stream.topup(wallet).catch((error) => {
          console.log(error.logs)
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
