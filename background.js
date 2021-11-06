(async ()=>{
    let freezeNewsFeed = (await load('freeze_newsfeed')) ?? false
    let blockUrls = (await load('block_urls')) ?? []
    let freezeNewsFeedUrls = ["https://www.facebook.com/nw/","https://www.facebook.com/api/graphql/"]
    //TODO: về sau làm nốt mục block other request

    chrome['webRequest']['onBeforeRequest']['addListener'](
        details => {
            if (freezeNewsFeed && freezeNewsFeedUrls.some(keyword => details.url.includes(keyword))){
                return {cancel: true}
            }
            return {cancel: blockUrls.some(keyword => details.url.includes(keyword))};
        },
        {urls: ["<all_urls>"]},
        ["blocking"]
    );

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