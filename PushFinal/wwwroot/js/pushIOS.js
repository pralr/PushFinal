var btnInscricao = document.getElementById("subscribeButtonIOS");
var btnExcluiInscricao = document.getElementById("unsubscribeButtonIOS");
var sw, sb;

if ('serviceWorker' in navigator) {
    registraSw();
}

async function registraSw() {

    navigator.serviceWorker.register('/js/service-worker.js').then(async serviceWorker => {

        if (!pushAtivo(serviceWorker.pushManager)) {
            return;
        }

        subscription = await serviceWorker.pushManager.getSubscription();
        sw = serviceWorker;
        sb = subscription;

        await permiteInscricaoBotoes();

    })
}

async function iosInscricaoPush() {
    let pushManager = (await navigator.serviceWorker.register('/js/service-worker.js')).pushManager;
    let temPermissao = await pushManager.permissionState({ userVisibleOnly: true });
    if (temPermissao) {
        await criaSubscription(sb);
        await permiteInscricaoBotoes();
    }
}

async function criaSubscription(subscription) {
    if (!subscription) {
        const response = await fetch('api/push/publickey');
        const data = await response.json();
        sb = await sw.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: data.publicKey,
        });
    } else {
        console.log("Inscrição já existe ou registro do service worker não encontrado.");
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

async function obtemSubscription() {
    return await sw.pushManager.getSubscription();
}

async function permiteInscricaoBotoes() {
    let subscription = await obtemSubscription();
    if (subscription == null || subscription == undefined) {
        btnInscricao.disabled = false;
        btnExcluiInscricao.disabled = true;
    } else {
        btnInscricao.disabled = true;
        btnExcluiInscricao.disabled = false;
    }
}

