var btnInscricao = document.getElementById("subscribeButtonIOS");
var btnExcluiInscricao = document.getElementById("unsubscribeButtonIOS");
var sw, sb;

if ('serviceWorker' in navigator) {

    let swRegistration = await navigator.serviceWorker.register('/js/service-worker.js');
    let pushManager = swRegistration.pushManager;

    if (!pushAtivo(pushManager)) {
        return;
    }

    var permissionState = await pushManager.permissionState({ userVisibleOnly: true });

    await permiteInscricaoBotoes();
  
}


async function iosInscricaoPush() {

    const response = await fetch('api/push/publickey');
    const publicKey = await response.json();

    let swRegistration = await navigator.serviceWorker.getRegistration();
    let pushManager = swRegistration.pushManager;

    if (!pushAtivo(pushManager)) {
        return;
    }

    let subscriptionOptions = {
        userVisibleOnly: true,
        applicationServerKey: publicKey
    };

    try {
        sb = await pushManager.subscribe(subscriptionOptions);
        await permiteInscricaoBotoes();
    } catch (error) {
        console.warn("Usuário negou a permissão", error);
    }
}

async function iosDeletaInscricaoPush() {
    sb.unsubscribe().then(async function () {
        sb = null;
        await permiteInscricaoBotoes();
    });
}


function pushAtivo(pushManager) {
    if (!pushManager) {
        return false;
    } else {
        return true;
    }
}

async function permiteInscricaoBotoes() {

    let swRegistration = await navigator.serviceWorker.register('/js/service-worker.js');
    let subscription = swRegistration.pushManager.getSubscription();

    if (subscription == null || subscription == undefined) {
        btnInscricao.disabled = false;
        btnInscricao.style.display = "block";

        btnExcluiInscricao.disabled = true;
        btnExcluiInscricao.style.display = "none";

    } else {
        btnInscricao.disabled = true;
        btnInscricao.style.display = "none";

        btnExcluiInscricao.disabled = false;
        btnExcluiInscricao.style.display = "block";
    }
}
