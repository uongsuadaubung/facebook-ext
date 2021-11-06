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

    let isAllowHideStories = (await load('hide_stories')) ?? true
/////////////////////////////////////////////////////////////////////////////////////function
    function hideStories() {
        let storyNode = document.querySelector('div[data-pagelet="Stories"]')
        storyNode.style.display = 'none'
    }

    function showStories() {
        let storyNode = document.querySelector('div[data-pagelet="Stories"]')
        storyNode.style.display = ''
    }

    async function removeAds () {
        if (!isRuning && isAllowRemovePost) {
            isRuning = true
            let notScanned = []
            if (location.pathname === '/watch/') {
                notScanned = document.querySelectorAll('div:not(.done)[class="j83agx80 cbu4d94t"]')
            } else if (location.pathname === '/') {
                //đây là trang chủ
                notScanned = document.querySelectorAll('div:not(.done)[data-pagelet^="FeedUnit_"]');
            }
            for (const ele of notScanned) {
                ele.classList.add("done");
                await Promise.all(stringAds.map(ads => { // mặc dù dùng loop thông thường mất khoảng hơn 100ms và promiseall mất có 1ms tuy đều không thể nhận ra bằng mắt nhưng thôi ksao
                    if (ele && ele.innerText.indexOf(ads) !== -1) {
                        ele.remove()
                        console.log("Meow meow đã xoá quảng cáo", ele.innerText.slice(0,20))
                    }
                }))
            }
            notScanned = null
            if (isLimitPost) {
                let scanned = []
                if (location.pathname === '/watch/') {
                    scanned = document.querySelectorAll('div.j83agx80.cbu4d94t.done')
                } else if (location.pathname === '/') {
                    scanned = document.querySelectorAll('div.done[data-pagelet^="FeedUnit_"]');
                }
                let dif = scanned.length - maxPost
                if (dif > 0) {
                    for (let i = 0; i < dif; i++) {
                        scanned[i].remove()
                    }
                }
                scanned = null
            }
            isRuning = false
        }

    }

    function changeLink() {
        if (most_recent) {
            let atags = document.getElementsByTagName('a')
            for (const a of atags) {
                if (a.href === 'https://www.facebook.com/') {
                    a.href = 'https://www.facebook.com/?sk=h_chr'
                    a.addEventListener('click', () => {
                        location.replace('https://www.facebook.com/?sk=h_chr')
                    } )
                } else if (a.href === 'https://www.facebook.com/watch/') {
                    a.addEventListener('click', () => {
                        location.replace('https://www.facebook.com/watch/')
                    })
                }
            }
        }
    }

    function encryptName(name) {
        return name.split('').sort(() => 0.5 - Math.random()).join('')
    }

    function hideName() {
        let span = document.querySelectorAll('div[data-pagelet="RightRail"] ul li a span')
        for (const name of span) {
            if (name.innerText) {
                let nodeDiv = name.parentNode
                while (nodeDiv.parentNode.nodeName !== 'A') {
                    nodeDiv = nodeDiv.parentNode
                }
                if (!nodeDiv.isEncrypted) {
                    nodeDiv.isEncrypted ??= true
                    nodeDiv.backupName ??= name.innerText
                    nodeDiv.encrypt ??= encryptName(nodeDiv.backupName)
                    name.innerText = nodeDiv.encrypt
                    name.MouseOver = function () {
                        nodeDiv.isHover = true
                        name.innerText = nodeDiv.backupName
                    }
                    name.MouseOut = function () {
                        nodeDiv.isHover = false
                        name.innerText = nodeDiv.encrypt
                    }
                    nodeDiv.addEventListener('mouseover', name.MouseOver)
                    nodeDiv.addEventListener('mouseout', name.MouseOut)

                } else if (nodeDiv.isEncrypted && !nodeDiv.isHover && name.innerText !== nodeDiv.encrypt) {
                    name.innerText = nodeDiv.encrypt
                }
            }
        }
    }

    function showName() {
        let span = document.querySelectorAll('div[data-pagelet="RightRail"] ul li a span')
        for (const name of span) {
            if (name.innerText) {
                let nodeDiv = name.parentNode
                while (nodeDiv.parentNode.nodeName !== 'A') {
                    nodeDiv = nodeDiv.parentNode
                }
                if (nodeDiv.isEncrypted) {
                    name.innerText = nodeDiv.backupName
                    nodeDiv.removeEventListener('mouseover', name.MouseOver)
                    nodeDiv.removeEventListener('mouseout', name.MouseOut)
                    delete nodeDiv.isEncrypted
                    delete nodeDiv.encrypt
                    delete nodeDiv.backupName
                    delete name.MouseOver
                    delete name.MouseOut

                }
            }
        }
    }

    function hideImage() {
        let images = document.querySelectorAll('div[data-pagelet="RightRail"] ul li a svg g image')
        for (const img of images) {
            let nodeA = img.parentNode // ở đây dùng nodeA mà bên trên không dùng vì tránh gán đè event
            while (nodeA.nodeName !== 'A') {
                nodeA = nodeA.parentNode
            }
            if (!nodeA.isHideImage) {
                nodeA.isHideImage ??= true
                nodeA.backupImage ??= img.getAttributeNS('http://www.w3.org/1999/xlink', 'href');
                img.setAttributeNS('http://www.w3.org/1999/xlink', 'href', "");
                img.MouseOver = function () {
                    nodeA.isHover = true
                    img.setAttributeNS('http://www.w3.org/1999/xlink', 'href', nodeA.backupImage);
                }
                img.MouseOut = function () {
                    nodeA.isHover = false
                    img.setAttributeNS('http://www.w3.org/1999/xlink', 'href', "");
                }
                nodeA.addEventListener('mouseover', img.MouseOver)
                nodeA.addEventListener('mouseout', img.MouseOut)
            } else if (nodeA.isHideImage || (!nodeA.isHover && img.getAttributeNS('http://www.w3.org/1999/xlink', 'href') !== "")) {
                img.setAttributeNS('http://www.w3.org/1999/xlink', 'href', "");
            }

        }
    }

    function showImage() {
        let images = document.querySelectorAll('div[data-pagelet="RightRail"] ul li a svg g image')
        for (const img of images) {
            let nodeA = img.parentNode // ở đây dùng nodeA mà bên trên không dùng vì tránh gán đè event
            while (nodeA.nodeName !== 'A') {
                nodeA = nodeA.parentNode
            }
            if (nodeA.isHideImage) {
                img.setAttributeNS('http://www.w3.org/1999/xlink', 'href', nodeA.backupImage);
                nodeA.removeEventListener('mouseover', img.MouseOver)
                nodeA.removeEventListener('mouseout', img.MouseOut)
                delete nodeA.isHideImage
                delete nodeA.backupImage
                delete img.MouseOver
                delete img.MouseOut
            }

        }
    }

    ///////////////////////////////////////////////////////////////////////////////event
    document.addEventListener('DOMContentLoaded', ()=>{
        removeAds()
        changeLink()
        if (isAllowHideStories){
            hideStories()
        }
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
    })

    window.addEventListener('scroll', () => {
        // called when the window is scrolled.
        removeAds()
    })
    sendMessage("todo","show")
    onMessage['addListener']( (request) => {
        switch (request.message) {
            case "most_recent":{ //worked restart require
                most_recent = request.value
                break
            }
            case "freeze_newsfeed":{ //worked
                location.reload()
                break
            }
            case "limit_post":{  //worked
                isLimitPost = request.value
                break
            }
            case "amount":{ // worked
                maxPost = request.value
                break
            }
            case "hide_contact":{ //worked
                isAllowHideContact = request.value
                if (isAllowHideContact){
                    //bật
                    // khi đang cho phép thì mới bật
                    if (isAllowHideContact_name){
                        hideName()
                    }
                    if (isAllowHideContact_image){
                        hideImage()
                    }
                }else {
                    //tắt
                    // khi đang cho phép thì mới tắt
                    if (isAllowHideContact_name){
                        showName()
                    }
                    if (isAllowHideContact_image){
                        showImage()
                    }
                }
                break
            }
            case "hide_contact_name":{ //worked
                isAllowHideContact_name = request.value
                if (isAllowHideContact_name){
                    hideName()
                }else {
                    showName()
                }
                break
            }
            case "hide_contact_image":{ //worked
                isAllowHideContact_image = request.value
                if (isAllowHideContact_image){
                    hideImage()
                }else {
                    showImage()
                }
                break
            }
            case "remove_post":{ //worked
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
    /////////////////////////////////////////////////
    //DOMContentLoaded: the browser fully loaded HTML, and the DOM tree is built, but external resources like pictures <img> and stylesheets may not yet have loaded.
    //load: not only HTML is loaded, but also all the external resources: images, styles etc.
    //beforeunload, unload: the user is leaving the page.
})()