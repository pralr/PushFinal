
var btnInscricao = document.getElementById("subscribeButton");
var btnExcluiInscricao = document.getElementById("unsubscribeButton");
var sw, sb;

if ('serviceWorker' in navigator && 'PushManager' in window) {
    navigator.serviceWorker.register('/js/service-worker.js').then(async serviceWorker => {
        subscription = await serviceWorker.pushManager.getSubscription();
        sw = serviceWorker;
        sb = subscription;
        await permiteInscricaoBotoes();

    })
}

async function androidInscricaoPush() {
    let temPermissao = await obtemPermissaoNotificacao();
    if (temPermissao) {
        await criaSubscription(sb);
        await permiteInscricaoBotoes();
    }
}

async function androidDeletaInscricaoPush() {
    sb.unsubscribe().then(async function () {
        sb = null;
        await permiteInscricaoBotoes();
    });
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

async function obtemSubscription() {
    return await sw.pushManager.getSubscription();
}

async function obtemPermissaoNotificacao() {
    try {
        let resultadoPermissao = await Notification.requestPermission();
        if (resultadoPermissao === 'granted') {
            permiteInscricaoBotoes();
            return true;
        } else if (resultadoPermissao === 'denied') {
            console.error('Permissão para notificações negada!');
            return false;
        } else {
            console.warn('Permissão para notificações não foi concedida nem negada.');
            return false;
        }
    } catch (error) {
        console.error('Erro ao solicitar permissão de notificação:', error);
    }
}