let isVertical = window.innerWidth < 1000

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});
let companies = [
    {
        logo: 'icon.png',
        name: "backblaze.com",
        currentPrice: 7,
        minPrice: 7,
        maxPrice: Infinity,
        maxFreeStorage: 0,
        maxFreeTransfer: 0,
        storagePrice: {
            hdd: 0.005,
            ssd: 0,
            single: 0,
            multi: 0
        },
        currentPriceOption: "hdd",
        transferPrice: 0.01
    },
    {
        logo: 'icon.png',
        name: "bunny.net",
        currentPrice: 0,
        minPrice: 0,
        maxPrice: 10,
        maxFreeStorage: 0,
        maxFreeTransfer: 0,
        storagePrice: {
            hdd: 0.01,
            ssd: 0.02,
            single: 0,
            multi: 0
        },
        currentPriceOption: "hdd",
        transferPrice: 0.01
    },
    {
        logo: 'icon.png',
        name: "scaleway.com",
        currentPrice: 0,
        minPrice: 0,
        maxPrice: Infinity,
        maxFreeStorage: 75,
        maxFreeTransfer: 75,
        storagePrice: {
            hdd: 0,
            ssd: 0,
            single: 0.03,
            multi: 0.06
        },
        currentPriceOption: "single",
        transferPrice: 0.02
    },
    {
        logo: 'icon.png',
        name: "vultr.com",
        currentPrice: 5,
        minPrice: 5,
        maxPrice: Infinity,
        maxFreeStorage: 0,
        maxFreeTransfer: 0,
        storagePrice: {
            hdd: 0.01,
            ssd: 0,
            single: 0,
            multi: 0
        },
        currentPriceOption: "hdd",
        transferPrice: 0.01
    },
]
function init(){
    let graphics = document.getElementById('graphics')
    graphics.innerHTML = ''
    companies.forEach(c=>{
        graphics.innerHTML += createCompany(c)
    })
    window.onresize = calculate
}
function calculate(){
    isVertical = window.innerWidth < 1000
    let transfer = Number(document.getElementById("transfer").value)
    let storage = Number(document.getElementById("storage").value)
    document.getElementById("storage-header").innerText = `STORAGE: ${storage}GB`
    document.getElementById("transfer-header").innerText = `TRANSFER: ${transfer}GB`
    companies = companies.map(c=>{
        let priceS = c.storagePrice[c.currentPriceOption] * ((storage - c.maxFreeStorage)>0?storage - c.maxFreeStorage: 0)
        let priceT = c.transferPrice * ((transfer - c.maxFreeTransfer)>0?transfer - c.maxFreeTransfer: 0) 
        let totalPrice = priceS+ priceT
        if(totalPrice>c.maxPrice) totalPrice = c.maxPrice
        if(totalPrice<c.minPrice) totalPrice = c.minPrice
        return {
            ...c,
            currentPrice: totalPrice
        }
    })
    init()
}
function changeCurPrice(n,v){
    let index = companies.findIndex(c => c.name === n)
    if(index !== -1){
        companies[index].currentPriceOption = v
        calculate()
    }
}
function createCompany(company) {
    let listOptions = Object.keys(company.storagePrice).filter(k => company.storagePrice[k] > 0)
    let price = company.currentPrice

    function createRadio( title ) {
        return `
            <div class="radio">
                <input id="radio-2" name="${company.name}" value="${title}" onchange="changeCurPrice(name,value)" type="radio" ${title === company.currentPriceOption? "checked": ""}>
                <label  for="radio-2" class="radio-label">${title.toUpperCase()}</label>
            </div>
        `
    }
    let style = isVertical? `style="width:30px;height:${price*10}px"` : `style="width:${price*10}px;height:30px"`
    return `
    <div class="company" >
    
    <div class="company-header" >
        
        <div class="head-wrapper">
        <span>${company.name}</span>
        <div class="company-checks">
            ${listOptions.length>1? listOptions.map(lo=>createRadio(lo)).join(' '):""}
        </div>
        </div>
        <img src="${company.logo}" />
    </div>
    
    <div class="company-price">
        <div class="price ${companies.some(c=>c.currentPrice < company.currentPrice && c.currentPrice > 0) ? "" : "min"}" data-value="${formatter.format(price)}" ${style} ></div>
        <div class="price-text" >${formatter.format(price)}</div>
    </div>
    
    </div>
    `
}