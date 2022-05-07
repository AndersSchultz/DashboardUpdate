import { settings } from '../settings.mjs'
import { getValuesFromTokenContract } from '../token-amounts.mjs';
import BN from 'bn.js'

const ethValues = await getValuesFromTokenContract(settings.Ethereum.TokenAddresses, 'Ethereum')
const polygonValues = await getValuesFromTokenContract(settings.Polygon.TokenAddresses, 'Polygon')
const allValues = ethValues.concat(polygonValues)

var totalSumLocked = allValues.reduce((prev, curr) => {
  return prev.add(new BN(curr))
}, new BN('0'))

const totalSumLockedWholeNumber = totalSumLocked.divRound((new BN(10)).pow(new BN(18)))
const maxSupply = (new BN(10)).pow(new BN(9))
const totalCirculating = maxSupply.sub(totalSumLockedWholeNumber)
// console.log(totalCirculating.toString())

export default function handler(req, res) { 
  try {
    res.send({ success: true, circulating: totalCirculating.toString() })
  } catch (err) {
    res.send(err) // send the thrown error
  }
}
