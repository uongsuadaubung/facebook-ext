(async ()=>{
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
})()