window.onload = function() {
    let most_recent_ele = document.getElementById("most_recent")
    let limit_ele = document.getElementById("limit")
    chrome.storage.sync.get(['most_recent','limit','string_ads'], (items)=>{ 
        let checked = items.most_recent
        let limit = items.limit
        // let ads = items.string_ads
        //1st time init
        if (checked === undefined || limit === undefined) {
            chrome.storage.sync.set({'most_recent': true})
            checked = true
            chrome.storage.sync.set({'limit': 30})
            limit = 30
        }
        if (checked) {
            most_recent_ele.checked = true
        }
        if (limit) {
            limit_ele.value = limit
        }
        // if (!ads) {
        //     ads = [
        //         "Post you may like",
        //         "Suggested for you",
        //         "Sponsored",
        //         "Videos just for you",
        //         "Your saved videos on Facebook Watch",
        //         "People You May Know",
        //         "Gợi ý cho bạn"
        //     ]
        // }else {
            
        // }
     });
    
    most_recent_ele.addEventListener("change", function() {
        chrome.storage.sync.set({'most_recent': most_recent.checked})
    })
    limit_ele.addEventListener("change", function() {
        chrome.storage.sync.set({'limit': Number(limit_ele.value)})
    })
}