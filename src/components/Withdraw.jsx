import React from 'react'

export default function Withdraw({provider,ticketMaster,balance}) {

    const handleWithdraw =async ()=>{
        const signer = await provider.getSigner();
        let txn = await ticketMaster.connect(signer).withdraw();
        await txn.wait(1);
    }
  return (
    <div>
     <button className='withdraw' onClick={handleWithdraw}>Balance:{balance}</button>
    </div>
  )
}
