const API_KEY = "";

//Regoster aervice-worker
if ("serviceWorker" in navigator){
    window.addEventListener("load",()=>{
        navigator.serviceWorker
        .register("./service-worker.js")
        .then(()=>{
            console.log("Service worker Registered");
        })
        .catch((error)=>{
            console.error("SW Registered Failed:",error)
        })
    })
}
//pwa installer
let deferredPrompt;

const installBtn = document.getElementById("installBtn");
window.addEventListener("beforeinstallprompt",(e) =>{
    e.preventDefault();
    deferredPrompt = e;
    if(installBtn){
    installBtn.style.display = "block";
    }
});
if(installBtn){
installBtn.addEventListener("click",async()=>{
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`install result: ${outcome}`);
    deferredPrompt = null;
    installBtn.style.display ="none";
});
}

window.addEventListener("appinstalled", ()=>{
    console.log("Talksy AI Installed");
    installBtn.style.display = "none";
});

//Chat element
const sendBtn = document.getElementById("sendBtn");
const userInput = document.getElementById("userInput");
const chatBox = document.getElementById("chatBox");

//Event listener
if (sendBtn) {
    sendBtn.addEventListener("click", sendMessage);
}
 if (userInput){ 
    userInput.addEventListener("keypress", (e)=>{
        if (e.key === "Enter"){
            sendMessage();
        }
    });
}
async function sendMessage(){
    const text = userInput.value.trim();
    if (!text) return;
    addUserMessage(text);
    userInput.value = "";

    const typing = document.createElement("div");
    typing.className = "bot-message";
    typing.id = "typing-indicator";
    typing.textContent = "Translating...";
    chatBox.appendChild(typing);
    scrollToBottom();

    try{
        const translatedText = await translateText(text);
        typing.remove()
            addBotMessage(translatedText);   
    }catch (error){
        console.error(error);
        typing.remove();
        addBotMessage(
            "Sorry, translation service is unavailable,"
        );
    }
}

//memory translated API
async function translateText(text){
    const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|fr`
    );
    if(!response.ok){
        throw new Error("Translation Request Failed");
    }
    const data = await response.json();
    return data.responseData.translatedText;
}

//user message
function addUserMessage(text){
    const message = document.createElement("div");
    message.className = "user-message";
    message.textContent = text;
    chatBox.appendChild(message);
    scrollToBottom();
}

function addBotMessage(text){
        const message = document.createElement("div");
    message.className = "bot-message";
    message.textContent = text;
    chatBox.appendChild(message);
    scrollToBottom();
    
}
function scrollToBottom(){
    chatBox.scrollTop = chatBox.scrollHeight;

}
