let stringAds = [
    "Post you may like",
    "Suggested for you",
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
        meow = document.querySelectorAll("[data-pagelet]");
    
        meow.forEach((ele) => {
            Promise.all(stringAds.map(ads=>{
                if (ele.innerHTML.indexOf(ads) !== -1){
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
    let a = document.getElementsByTagName('a')
    a[0].onclick = () => {location.replace('https://www.facebook.com/?sk=h_chr')}
    a[1].onclick = () => {location.replace('https://www.facebook.com/?sk=h_chr')}
}
removeAds()
changeLink()
