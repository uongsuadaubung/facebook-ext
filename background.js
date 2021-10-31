(async ()=>{
    let freezeNewsFeed = (await load('freeze_newsfeed')) ?? false
    if (freezeNewsFeed){
        chrome.webRequest.onBeforeRequest.addListener(
            function(details) { return {cancel: true}; },
            {urls: ["https://www.facebook.com/nw/","https://www.facebook.com/api/graphql/"]},
            ["blocking"]
        );
    }
    chrome.runtime.onMessage.addListener(request=>{
        if (request.todo === "show"){
            chrome.tabs.query({active:true, currentWindow:true}, tabs=>{
                chrome.pageAction.show(tabs[0].id)
            })
        }
    })

})()