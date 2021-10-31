(async ()=>{
    let most_recent = (await load('most_recent')) ?? true
    if (most_recent === true && location.pathname === '/' && !location.search) {
        location.replace('https://www.facebook.com/?sk=h_chr')
    }
    //////////////////////////////////////////////////////////////////////////////
    let stringAds = (await load('string_ads')) ?? [
        "Post you may like",
        "Suggested for you",
        "Sponsored",
        "Videos just for you",
        "Your saved videos on Facebook Watch",
        "People You May Know",
        "Gợi ý cho bạn"
    ]
    let isRuning = false
    let meow = [] // total posts, btw i love cats
    let maxPost = (await load('amount')) ?? 30

    let limit_post = (await load('limit_post')) ?? true
    let remove_post = (await load('remove_post')) ?? true

    window.onscroll = function () {
        // called when the window is scrolled.
        removeAds()
    }
    let removeAds = () => {
        if (!isRuning && remove_post) {
            isRuning = true
            if (location.pathname === '/watch/') {
                meow = document.querySelectorAll('div[class="j83agx80 cbu4d94t"]')
            } else if (location.pathname === '/') {
                //đây là trang chủ
                meow = document.querySelectorAll('div[data-pagelet^="FeedUnit_"]');
            }
            meow.forEach((ele) => {
                Promise.all(stringAds.map(ads => { // mặc dù dùng loop thông thường mất khoảng hơn 100ms và promiseall mất có 1ms tuy đều không thể nhận ra bằng mắt nhưng thôi ksao
                    if (ele && ele.innerText.indexOf(ads) !== -1) {
                        ele.remove()
                        console.log("Meow meow đã xoá quảng cáo", ele.innerText.slice(0,20))
                    }
                })).then()
            })
            if (limit_post) {
                if (meow.length > maxPost) {
                    let dif = meow.length - maxPost;
                    for (let i = 0; i < dif; i++) {
                        meow[i].remove()
                    }
                }
            }

            isRuning = false
        }

    }

    let changeLink = () => {
        if (most_recent) {
            let atags = document.getElementsByTagName('a')
            for (const a of atags) {
                if (a.href === 'https://www.facebook.com/') {
                    a.href = 'https://www.facebook.com/?sk=h_chr'
                    a.onclick = () => {
                        location.replace('https://www.facebook.com/?sk=h_chr')
                    }
                }else if (a.href === 'https://www.facebook.com/watch/'){
                    a.onclick = () =>{
                        location.replace('https://www.facebook.com/watch/')
                    }
                }
            }
        }
    }
    let encryptName = name =>{
        return name.split('').sort(()=>0.5 - Math.random()).join('')
    }
    let hideName = ()=>{
        let span = document.querySelectorAll('div[data-pagelet="RightRail"] ul li a span')
        for (const name of span) {
            if (!name.isEncrypted){
                name.backup = name.innerText
                name.encrypt = encryptName(name.innerText)
                name.innerText = name.encrypt
                name.isEncrypted = true
                name.onmouseover = function () {
                    name.innerText = name.backup
                }
                name.onmouseout = function (){
                    name.innerText = name.encrypt
                }
            }
        }
    }
    window.onload = () => {
        // document.title = document.title.replaceAll("Facebook", "Hạnh Xấu Xí")
        changeLink()
        removeAds()
        setInterval(hideName, 5000)
    }
//let a = document.querySelectorAll('div[data-pagelet="RightRail"] ul li a span') lấy danh sách

})()