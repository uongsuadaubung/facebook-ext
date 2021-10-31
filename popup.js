window.onload = async function() {
    let most_recent_ele = document.getElementById("most_recent")
    let limit_amount_ele = document.getElementById("limit_amount")
    let limit_post_ele = document.getElementById("limit_post")
    let remove_post_ele = document.getElementById("remove_post")
    let btn_add_ele = document.getElementById("btn_add")
    let hide_contact_name_ele = document.getElementById("hide_contact_name")
    let hide_contact_image_ele = document.getElementById("hide_contact_image")
    let hide_contact = document.getElementById("hide_contact")

    ///////////////////////////////////////////////////////////////////////////////////////
    let isMostRecent = await load('most_recent')
    if (isMostRecent === undefined){
        save('most_recent', true)
        isMostRecent = true
    }
    if (isMostRecent) {
        most_recent_ele.checked = true
    }
    //////////////////////////////////////////////////////////////////////////////////////
    let isLimitPost = await load('limit_post')
    if (isLimitPost === undefined){
        save('limit_post', true)
        isLimitPost = true
    }
    if (isLimitPost){
        limit_post_ele.checked = true
        document.getElementById("group_limit_amount").classList.remove("d-none");
    }
    ////////////////////////////////////////////////////////////////////////////////////////////
    let amount = await load('amount')
    if ( amount === undefined){
        save('amount', 30)
        amount = 30
    }
    if (amount) {
        limit_amount_ele.value = amount
    }
    /////////////////////////////////////////////////////////////////////////////////////////////
    let isHideContact = await load('hide_contact')
    if (isHideContact === undefined){
        save('hide_contact', true)
        isHideContact = true
    }
    if (isHideContact){
        hide_contact.checked = true
        document.getElementById('group_contact').classList.remove('d-none')

    }
    //////////////////////////////////////////////////////////////////////////////////////////////
    let isHideContactName = await load('hide_contact_name')
    if (isHideContactName === undefined){
        save('hide_contact_name', true)
        isHideContactName = true
    }
    if (isHideContactName){
        hide_contact_name_ele.checked = true
    }
    //////////////////////////////////////////////////////////////////////////////////////////////
    let isHideContactImage = await load('hide_contact_image')
    if (isHideContactImage === undefined){
        save('hide_contact_image', true)
        isHideContactImage = true
    }
    if (isHideContactImage){
        hide_contact_image_ele.checked = true
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////
    let isRemovePost = await load('remove_post')
    if (isRemovePost === undefined) {
        save('remove_post', true)
        isRemovePost = true
    }
    if (isRemovePost){
        remove_post_ele.checked = true
        document.getElementById("group_keywords").classList.remove("d-none");
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////
    let string_ads = await load('string_ads')
    if (string_ads === undefined){
        string_ads =
            [
                "Post you may like",
                "Suggested for you",
                "Sponsored",
                "Videos just for you",
                "Your saved videos on Facebook Watch",
                "People You May Know",
                "Gợi ý cho bạn"
            ]
        save('string_ads', string_ads)
    }

    let addToTable = (value, method)=>{
        const table_ads_ele = document.getElementById("table_ads")
        const rowCount = table_ads_ele.rows.length;
        const row = table_ads_ele.insertRow(rowCount);
        row.id = 'row_' + rowCount
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const deletebtn = document.createElement("button")
        deletebtn.type = "button"
        deletebtn.innerText = "Xoá"
        deletebtn.className = "btn btn-danger btn-sm"
        deletebtn.onclick = ()=>{
            let index = string_ads.findIndex(i=>i===value)
            if (index!== -1){
                string_ads.splice(index,1)
                let row = document.getElementById('row_'+rowCount)
                row.parentNode.removeChild(row)
                save('string_ads', string_ads)
            }
        }
        if (method === 'add'){ // add || load
            string_ads.push(value)
            save('string_ads', string_ads)
        }
        cell1.innerHTML = value;
        cell2.appendChild(deletebtn)
    }
    for (const stringAd of string_ads) {
        addToTable(stringAd, 'load')
    }
    most_recent_ele.addEventListener("change", function() {
        save('most_recent', most_recent_ele.checked)
    })
    limit_amount_ele.addEventListener("change", function() {
        save('amount', Number(limit_amount_ele.value))
    })
    limit_post_ele.addEventListener("change", function() {
        let res = limit_post_ele.checked
        if (res){
            document.getElementById("group_limit_amount").classList.remove("d-none");
        }else {
            document.getElementById("group_limit_amount").classList.add("d-none");
        }
        save('limit_post', res)
    })
    hide_contact.addEventListener("change", function() {
        let res = hide_contact.checked
        if (res){
            document.getElementById("group_contact").classList.remove("d-none");
        }else {
            document.getElementById("group_contact").classList.add("d-none");
        }
        save('hide_contact', res)
    })

    hide_contact_name_ele.addEventListener('change',()=>{
        save('hide_contact_name', hide_contact_name_ele.checked)
    })
    hide_contact_image_ele.addEventListener('change',()=>{
        save('hide_contact_image', hide_contact_image_ele.checked)
    })

    remove_post_ele.addEventListener("change", function() {
        let res = remove_post_ele.checked
        if (res){
            document.getElementById("group_keywords").classList.remove("d-none");
        }else {
            document.getElementById("group_keywords").classList.add("d-none");
        }
        save('remove_post', res)
    })
    btn_add_ele.addEventListener('click', ()=>{
        let inputkeyword = document.getElementById('inputkeyword')
        let input = inputkeyword.value
        if (string_ads.findIndex(i=>i===input)!==-1){
            showAlert('Keyword đã tồn tại')
            return
        }
        if (input){
            addToTable(input, 'add')
            inputkeyword.value = ''
        }else {
            showAlert('Keyword phải chứa ký tự')
        }

    })
    let showAlert = (message, timeout = 2000)=>{
        let alert = document.getElementById('alert_danger')
        alert.classList.remove('d-none')
        alert.innerText = message
        setTimeout(()=>{
            alert.classList.add('d-none')
        },timeout)
    }
}