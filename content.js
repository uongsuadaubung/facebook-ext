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
    let maxPost = (await load('amount')) ?? 30

    let isLimitPost = (await load('limit_post')) ?? true
    let isAllowRemovePost = (await load('remove_post')) ?? true

    let isAllowHideContact = (await load('hide_contact')) ?? true
    let isAllowHideContact_name = (await load('hide_contact_name')) ?? true
    let isAllowHideContact_image = (await load('hide_contact_image')) ?? true


    let removeAds = () => {
        if (!isRuning && isAllowRemovePost) {
            isRuning = true
            let notScanned = []
            if (location.pathname === '/watch/') {
                notScanned = document.querySelectorAll('div:not(.done)[class="j83agx80 cbu4d94t"]')
            } else if (location.pathname === '/') {
                //đây là trang chủ
                notScanned = document.querySelectorAll('div:not(.done)[data-pagelet^="FeedUnit_"]');
            }
            notScanned.forEach((ele) => {
                ele.classList.add("done");
                Promise.all(stringAds.map(ads => { // mặc dù dùng loop thông thường mất khoảng hơn 100ms và promiseall mất có 1ms tuy đều không thể nhận ra bằng mắt nhưng thôi ksao
                    if (ele && ele.innerText.indexOf(ads) !== -1) {
                        ele.remove()
                        console.log("Meow meow đã xoá quảng cáo", ele.innerText.slice(0,20))
                    }
                })).then()
            })

            if (isLimitPost) {
                let scanned
                if (location.pathname === '/watch/') {
                    scanned = document.querySelectorAll('div.j83agx80.cbu4d94t.done')
                } else if (location.pathname === '/') {
                    scanned = document.querySelectorAll('div.done[data-pagelet^="FeedUnit_"]');
                }
                let dif = scanned.length + notScanned.length - maxPost
                if (dif > 0) {
                    for (let i = 0; i < dif; i++) {
                        scanned[i].remove()
                    }
                }
                scanned.length = 0
            }
            notScanned.length = 0
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
    let hideName = () => {
        let span = document.querySelectorAll('div[data-pagelet="RightRail"] ul li a span')
        for (const name of span) {
            if (name.innerText) {
                let nodeDiv = name.parentNode
                while (nodeDiv.parentNode.nodeName !== 'A') {
                    nodeDiv = nodeDiv.parentNode
                }
                if (!nodeDiv.isEncrypted || (!nodeDiv.isHover && name.innerText !== nodeDiv.encrypt)) {
                    nodeDiv.isEncrypted ??= true
                    nodeDiv.backupName ??= name.innerText
                    nodeDiv.encrypt ??= encryptName(nodeDiv.backupName)
                    name.innerText = nodeDiv.encrypt
                    nodeDiv.onmouseover = function () {
                        nodeDiv.isHover = true
                        name.innerText = nodeDiv.backupName
                    }
                    nodeDiv.onmouseout = function () {
                        nodeDiv.isHover = false
                        name.innerText = nodeDiv.encrypt
                    }
                }
            }
        }
    }
    let hideImage= () =>{
        let images = document.querySelectorAll('div[data-pagelet="RightRail"] ul li a svg g image')
        for (const img of images) {
            let nodeA = img.parentNode // ở đây dùng nodeA mà bên trên không dùng vì tránh gán đè event
            while (nodeA.nodeName !== 'A'){
                nodeA = nodeA.parentNode
            }
            if (!nodeA.isHideImage || (!nodeA.isHover && img.getAttributeNS('http://www.w3.org/1999/xlink', 'href') !== "")){
                nodeA.isHideImage ??= true
                nodeA.backupImage ??= img.getAttributeNS('http://www.w3.org/1999/xlink', 'href');
                img.setAttributeNS('http://www.w3.org/1999/xlink', 'href', "");
                nodeA.onmouseover = ()=>{
                    nodeA.isHover = true
                    img.setAttributeNS('http://www.w3.org/1999/xlink', 'href', nodeA.backupImage);
                }
                nodeA.onmouseout=()=>{
                    nodeA.isHover = false
                    img.setAttributeNS('http://www.w3.org/1999/xlink', 'href', "");
                }
            }

        }
    }
    window.onload = () => {
        // document.title = document.title.replaceAll("Facebook", "Hạnh Xấu Xí")
        changeLink()
        removeAds()

        if (location.pathname === '/' && isAllowHideContact && isAllowHideContact_image) {
            hideImage()
            setTimeout(hideImage,1000)
            setTimeout(hideImage,2000)
            // intervalHideImage = setInterval(hideImage, 1000)
        }
        if (location.pathname === '/' && isAllowHideContact && isAllowHideContact_name) {
            hideName()
            setTimeout(hideName,1000)
            setTimeout(hideName,2000)
            // intervalHideName = setInterval(hideName, 1000)
        }
    }
    window.onscroll = function () {
        // called when the window is scrolled.
        removeAds()
    }
    sendMessage("todo","show")
    onMessage['addListener']( request => {
        switch (request.message) {
            case "most_recent":{
                most_recent = request.value
                break
            }
            case "freeze_newsfeed":{
                location.reload()
                break
            }
            case "limit_post":{
                isLimitPost = request.value
                break
            }
            case "amount":{
                maxPost = request.value
                break
            }
            case "hide_contact":{
                isAllowHideContact = request.value
                break
            }
            case "hide_contact_name":{
                isAllowHideContact_name = request.value
                break
            }
            case "hide_contact_image":{
                isAllowHideContact_image = request.value
                break
            }
            case "remove_post":{
                isAllowRemovePost = request.value
                break
            }
            case "string_ads":{ //tested,worked
                if (request.method === 'add'){
                    stringAds.push(request.value)
                }else {
                    stringAds = stringAds.filter(i=> i!== request.value)
                }
                break
            }
        }

    });
    //TODO: sau khi nhận được event thì chạy lại 1 số thứ tương ứng
})()