import { settings } from './settings.mjs'
import { getValuesFromTokenContract } from './token-amounts.mjs';
import StoryblokClient from "storyblok-js-client";
import BN from 'bn.js'
const spaceId = 151498;

let Storyblok = new StoryblokClient({
  oauthToken: "JiEmn9pWPHvqKrYP1xrIiQtt-112663-oxXgZz7dDgTbRfesm5Mh",
});

/*
Storyblok.post(`spaces/${spaceId}/stories`, {
  "story": {
    "name": "Story Name",
    "slug": "story-name",
    "content": {
      "component": "page",
      "body": []
    }
  },
  "publish": 1
}).then(response => {
  console.log(response)
}).catch(error => { 
  console.log(error)
})
*/

var one = '724000000000000000000000000'
var two = '72935729096878993617174838'
//one.add(two)
// one = one.div((new BN(10)).pow(new BN(18)))
// console.log(one.toString())
// const allValues = [one, two]

const ethValues = await getValuesFromTokenContract(settings.Ethereum.TokenAddresses, 'Ethereum')
const polygonValues = await getValuesFromTokenContract(settings.Polygon.TokenAddresses, 'Polygon')
const allValues = ethValues.concat(polygonValues)
// console.log(allValues)

// convert values
var totalSumLocked = allValues.reduce((prev, curr) => {
  return prev.add(new BN(curr))
}, new BN('0'))
// console.log(totalSumLocked)
const totalSumLockedWholeNumber = totalSumLocked.divRound((new BN(10)).pow(new BN(18)))
const maxSupply = (new BN(10)).pow(new BN(9))
const totalCirculating = maxSupply.sub(totalSumLockedWholeNumber)
console.log(totalCirculating.toString())

export async function send(req, res) { // this function will be launched when the API is called.
  try {
    res.send({ success: true, circulating: totalCirculating.toString() }) // send the lyrics
  } catch (err) {
    res.send(err) // send the thrown error
  }
}

// https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=0xdaC657ffD44a3B9d8aba8749830Bf14BEB66fF2D&address=0xc63bd01cfb9ce9837424f96c969e5435a9b9a46d&tag=latest&apikey=92ZJ8KGDNSKBHJA9I5JCV25F9WXX2BK4QC