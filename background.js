(async ()=>{
    let freezeNewsFeed = (await load('freeze_newsfeed')) ?? false
    if (freezeNewsFeed){
        chrome['webRequest']['onBeforeRequest']['addListener'](
            ()=> { return {cancel: true}; },
            {urls: ["https://www.facebook.com/nw/","https://www.facebook.com/api/graphql/"]},
            ["blocking"]
        );
    }
    chrome['runtime']['onMessage']['addListener'](message=>{
        if (message['todo'] === "show"){
            chrome['tabs']['query']({active:true, currentWindow:true}, tabs=>{
                chrome['pageAction']['show'](tabs[0].id)
            })
        }
        if (message['toContent']){
            chrome['tabs']['query']({active:true, currentWindow:true}, tabs=>{
                chrome['tabs']['sendMessage'](tabs[0].id, message['toContent'])
            })
        }
    })

})()