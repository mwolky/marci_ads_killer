chrome.runtime.sendMessage({action:"get_list"});

function populateList(){
    chrome.runtime.onMessage.addListener((request,sender,sendResponse)=>{
        if(request.action === "provide_list"){
            let list = document.querySelector('.list');
            list.innerHTML = '';
            let urls = request.list;
            let urlsString = '';
            urls.forEach((url,i)=>{
                let div = document.createElement('div');
                div.classList.add('list__item');
                let p = document.createElement('p');
                let span = document.createElement('span');
                span.classList.add('list__cross');
                span.innerHTML = '&times;';
                span.addEventListener('click',()=>{
                    chrome.runtime.sendMessage({
                        action:"remove_from_list",
                        index:i
                    });
                });
                p.classList.add('list__p');
                p.textContent = url;
                p.appendChild(span);
                div.appendChild(p);
                list.appendChild(div);
            });
        }
    });
}

populateList();


let button = document.querySelector('.button');
let input = document.querySelector('.input');
button.addEventListener('click',(e)=>{
    e.preventDefault();
    chrome.runtime.sendMessage({
        action:"add",
        url:input.value
    });
    input.value = '';
});