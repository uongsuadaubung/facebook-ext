let stringAds = [
    "Post you may like",
    "Suggested for you",
    "Sponsored",
    "Videos just for you",
    "Your saved videos on Facebook Watch",
    "People You May Know",
    "Gợi ý cho bạn"
]
let isRuning = false
let meow = []
const maxPost = 30
window.onscroll = function () {
    // called when the window is scrolled.
    this.removeAds()
}
removeAds = () => {
    if (!isRuning) {
        isRuning = true
        if (location.pathname === '/watch/') {
            meow = document.querySelectorAll('[class="j83agx80 cbu4d94t"]')
        }else if (location.pathname === '/') {
            //đây là trang chủ
            meow = document.querySelectorAll("[data-pagelet]");
        }
        meow.forEach((ele) => {
            Promise.all(stringAds.map(ads=>{
                if (ele && ele.innerText.indexOf(ads) !== -1){
                    ele.remove()
                    console.log("Meow mewo đã xoá quảng cáo")
                }
            }))
        })
        if (meow.length> maxPost) {
            let dif = meow.length - maxPost;
            for(let i = 0; i< dif; i++){
                meow[i].remove()
            }
        }
        isRuning = false
    }
    
}

changeLink = () => {
    let atags = document.getElementsByTagName('a')
    for (const a of atags) {
        if(a.href === 'https://www.facebook.com/'){
            a.href = 'https://www.facebook.com/?sk=h_chr'
            a.onclick = () => {location.replace('https://www.facebook.com/?sk=h_chr')}
        }
    }
}
window.onload = ()=>{
    removeAds()
    changeLink()
}

