(async ()=>{
    let freezeNewsFeed = (await load('freeze_newsfeed')) ?? false
    let blockUrls = (await load('block_urls')) ?? ["nw/","api/graphql/"]
    if (freezeNewsFeed){
        // chrome['webRequest']['onBeforeRequest']['addListener'](
        //     ()=> { return {cancel: true}; },
        //     {urls: blockUrls},
        //     ["blocking"]
        // );
        chrome['webRequest']['onBeforeRequest']['addListener'](
            function(details) {
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