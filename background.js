(async ()=>{
    let freezeNewsFeed = (await load('freeze_newsfeed')) ?? true
    console.log(freezeNewsFeed)
    if (freezeNewsFeed){
        chrome.webRequest.onBeforeRequest.addListener(
            function(details) { return {cancel: true}; },
            {urls: ["https://www.facebook.com/nw/","https://www.facebook.com/api/graphql/"]},
            ["blocking"]
        );
    }
})()