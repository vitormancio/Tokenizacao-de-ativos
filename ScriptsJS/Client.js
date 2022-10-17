async function login(){
    let accounts = await ethereum.request({method: 'eth_requestAccounts'})
    userAddress = accounts[0]
    userWalletSpan.innerHTML = userAddress
    await getUsdtBalance()
    await getCars()
    await getTokensBalance()
    await getStore()
}

function getProvider(){
    if(!window.ethereum){
        console.log("Sem metamask instalada")
    }else{
        console.log("Processando...")
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    return provider
}


async function permissaoUsdt(address, count, price){
    const provider = getProvider()
    const signer = provider.getSigner()
    const contract = new ethers.Contract(usdtContract, [increaseAllowance, allowance], provider)
    contractSigner = contract.connect(signer)
    console.log(address, "AQUIIIII")
    
    const amount = document.getElementById("amount" + count)
    console.log(amount)
    const tx = await contractSigner.increaseAllowance(address, ethers.utils.parseUnits((amount.value * price).toString()))
    console.log(tx)
    while(true){
        const rtx = await contractSigner.allowance(userAddress, address)
        console.log("Processando")
        if(rtx["_hex"] != "0x00"){
            console.log("PERMISSÃO EM USDT APROVADA!!!")
            break
        }
    }
    return tx
}

async function enviarUsdt(address, count, price){
    await permissaoUsdt(address, count, price)

    const provider = getProvider()
    const signer = provider.getSigner()
    const contract = new ethers.Contract(address, [swap], provider)
    const contractSigner = contract.connect(signer)
    const amount = document.getElementById("amount" + count)
    console.log(amount.value, "aquiiiiiiiiiii")
    console.log(userAddress)
    console.log(address)
    const tx = await contractSigner.swap(ethers.utils.parseEther(amount.value), userAddress)

    console.log(tx)
}




