(async ()=>{
    window.chrome ??= chrome
    window.save ??= function (key, value) {
        let data= {}
        data[key] = value
        chrome.storage.sync.set(data)
    }
    window.load ??= async (key)=>{
        return await new Promise(resolve => {
            chrome.storage.sync.get([key], item =>{
                resolve(item[key])
            })
        })
    }
    window.reload ??=  () => {
        chrome['runtime'].reload()
    }
    window.sendMessage ??= (key, value) => {
        let obj = {}
        obj[key] = value
        chrome['runtime'].sendMessage(obj)
    }
    window.onMessage = chrome['runtime']['onMessage']
})()