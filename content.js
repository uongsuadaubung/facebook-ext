let stringAds = [
    "Post you may like",
    "Suggested for you",
    "Sponsored",
    "Videos just for you",
    "Your saved videos on Facebook Watch",
    "People You May Know",
    "Gợi ý cho bạn"
]
// chrome.storage.sync.set({'string_ads': stringAds})
let isRuning = false
let meow = []
let maxPost = 30
let most_recent
chrome.storage.sync.get(['most_recent', 'limit','string_ads'], (items) => {
    // alert(JSON.stringify(items))
    most_recent = items.most_recent ?? true
    maxPost = items.limit ?? 30
    if (most_recent === true && location.pathname === '/' && !location.search) {
        location.replace('https://www.facebook.com/?sk=h_chr')
    }
})

window.onscroll = function () {
    // called when the window is scrolled.
    this.removeAds()
}
removeAds = () => {
    if (!isRuning) {
        isRuning = true
        if (location.pathname === '/watch/') {
            meow = document.querySelectorAll('[class="j83agx80 cbu4d94t"]')
        } else if (location.pathname === '/') {
            //đây là trang chủ
            meow = document.querySelectorAll("[data-pagelet]");
        }
        meow.forEach((ele) => {
            Promise.all(stringAds.map(ads => {
                if (ele && ele.innerText.indexOf(ads) !== -1) {
                    ele.remove()
                    console.log("Meow mewo đã xoá quảng cáo")
                }
            }))
        })
        if (meow.length > maxPost) {
            let dif = meow.length - maxPost;
            for (let i = 0; i < dif; i++) {
                meow[i].remove()
            }
        }
        isRuning = false
    }

}

changeLink = () => {
    if (most_recent) {
        let atags = document.getElementsByTagName('a')
        for (const a of atags) {
            if (a.href === 'https://www.facebook.com/') {
                a.href = 'https://www.facebook.com/?sk=h_chr'
                a.onclick = () => { location.replace('https://www.facebook.com/?sk=h_chr') }
            }
        }
    }
}
window.onload = () => {
    document.title = document.title.replaceAll("Facebook", "Hạnh Xấu Xí")
    changeLink()
    removeAds()
}

