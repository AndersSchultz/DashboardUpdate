import axios from 'axios';
import { settings } from './settings.mjs'

async function getValuesFromTokenContract(addressArray, chain) {

  const queryParams = { 
    module: "account",
    action: "tokenbalance",
    contractaddress: settings[chain].ContractAddress,
    address: '',
    tag: "latest",
    apikey: settings[chain].ApiKey
  }

  const tokenAmounts = []
  var failure = false
  for (let index = 0; index < addressArray.length; index++) {
    queryParams.address = addressArray[index]

    // const paramString = `?module=account&action=tokenbalance&contractaddress=${queryParams.contractaddress}&address=${address}&tag=latest&apikey=${queryParams.apikey}`
    // https://api.etherscan.io/api
    console.log(index)
    const { data } = await axios.get(settings[chain].ScanUrl, { params: queryParams })
    if (data.message === "OK") {
      tokenAmounts.push(data.result)      
      // console.log(data.result)
    } else {
      console.log(data)
      failure = true
    }
  }
  failure = true
  if (failure) {
    return []
  } 
  return tokenAmounts

}

export { getValuesFromTokenContract }