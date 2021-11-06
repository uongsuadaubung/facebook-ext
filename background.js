(async ()=>{
    let freezeNewsFeed = (await load('freeze_newsfeed')) ?? false
    let isAllowBlockOtherRequest = (await load('block_other_request')) ?? false
    let blockUrls = (await load('block_urls')) ?? ["nw/","api/graphql/"]
    //TODO: về sau làm nốt mục block other request
    if (freezeNewsFeed){
        chrome['webRequest']['onBeforeRequest']['addListener'](
            () => {return {cancel: true}},
            {urls: ["https://www.facebook.com/nw/","https://www.facebook.com/api/graphql/"]},
            ["blocking"]
        );
    }
    if (isAllowBlockOtherRequest){
        chrome['webRequest']['onBeforeRequest']['addListener'](
            details => {
                return {cancel: blockUrls.some(keyword => details.url.includes(keyword))};
            },
            {urls: ["<all_urls>"]},
            ["blocking"]
        );
    }
    onMessage['addListener'](message=>{
        if (message['todo'] === "show"){
            chrome['tabs']['query']({active:true, currentWindow:true}, tabs=>{
                tabs.length && chrome['pageAction']['show'](tabs[0].id)
            })
        }
        if (message['toContent']){
            chrome['tabs']['query']({active:true, currentWindow:true}, tabs=>{
                chrome['tabs']['sendMessage'](tabs[0].id, message['toContent'])
            })
        }
    })

})()