(async ()=>{
    window.chrome ??= chrome
    window.save ??= function (key, value) {
        let data = {}
        data[key] = value
        chrome.storage.sync.set(data)
    }
    window.load ??= async function (key){
        return await new Promise(resolve => {
            chrome.storage.sync.get([key], item =>{
                resolve(item[key])
            })
        })
    }
    window.reload ??= function (){
        chrome['runtime'].reload()
    }
    window.sendMessage ??= function (key, value) {
        let obj = {}
        obj[key] = value
        chrome['runtime'].sendMessage(obj)
    }
    window.onMessage = chrome['runtime']['onMessage']
})()