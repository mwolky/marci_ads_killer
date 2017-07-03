function messageList(action,data){
    chrome.runtime.sendMessage({
        action:action,
        list:data
    });
}
function setUrl(data){
    chrome.storage.local.set({adUrls:{urls:data}},()=>{
        messageList("provide_list",data);
    });
}
function areUrlsEmpty(response){
    return Object.keys(response).length === 0 ? [] : response.adUrls.urls;
}
chrome.runtime.onMessage.addListener((request,sender,sendResponse)=>{
    switch(request.action){
        case "verify":
            chrome.storage.local.get('adUrls',(response)=>{
                let adUrls = areUrlsEmpty(response);
                if(adUrls.length>0){
                    for(let i=0;i<adUrls.length;i++){
                        if(sender.url.indexOf(adUrls[i])===0){
                            chrome.tabs.remove(sender.tab.id);
                        }
                    }
                }
            });
            break;
        case "add":
            chrome.storage.local.get('adUrls',(response)=>{
                let adUrls = areUrlsEmpty(response);
                adUrls.push(request.url);
                setUrl(adUrls);
            })
            break;
        case "get_list":
            chrome.storage.local.get('adUrls',(response)=>{
                if(!(Object.keys(response).length === 0)){
                    messageList("provide_list",response.adUrls.urls);
                }
            });
            break;
        case "remove_from_list":
            chrome.storage.local.get('adUrls',(response)=>{
                let adUrls = areUrlsEmpty(response);
                adUrls.splice(request.index,1);
                setUrl(adUrls);
            })
            break;
    }
});