import { settings } from '../settings.mjs'
import { getValuesFromTokenContract } from '../token-amounts.mjs';
import BN from 'bn.js'

const ethValues = await getValuesFromTokenContract(settings.Ethereum.TokenAddresses, 'Ethereum')
const polygonValues = await getValuesFromTokenContract(settings.Polygon.TokenAddresses, 'Polygon')
var allTokenAmountsReceived = ethValues.length > 0 && polygonValues.length > 0
// var output = { success: allTokenAmountsReceived }
var totalCirculating = 0
// convert values
if (allTokenAmountsReceived) {
  const allValues = ethValues.concat(polygonValues)
  var totalSumLocked = allValues.reduce((prev, curr) => {
    return prev.add(new BN(curr))
  }, new BN('0'))
  // console.log(totalSumLocked)
  const totalSumLockedWholeNumber = totalSumLocked.divRound((new BN(10)).pow(new BN(18)))
  const maxSupply = (new BN(10)).pow(new BN(9))
  totalCirculating = maxSupply.sub(totalSumLockedWholeNumber)
  // console.log(totalCirculating.toString())
  // output.circulating = totalCirculating.toString()
}
console.log(totalCirculating.toString())

export default function handler(req, res) { 
  try {
    if (allTokenAmountsReceived) {
      res.send(totalCirculating.toString())
    } else {
      res.status(500).send('Sorry, but did not get token amounts from scanners to fulfill the calculation! Please, try again later.')
    }
  } catch (err) {
    res.send(err) // send the thrown error
  }
}
