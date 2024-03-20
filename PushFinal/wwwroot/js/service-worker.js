self.addEventListener('install', event => {
    console.log('Service Worker instalado com sucesso!');
});


self.addEventListener('push', function (event) {

    const body = event.data?.text() ?? ''

    console.log("Entrou no servicer worker e o evento de push foi ativado!");
    event.waitUntil(
        self.registration.showNotification('Atenção!', {
            body,
        })
    )
})

//setInterval(noticaPosicaoDoSw, 5000);

async function NotificaPosicaoDoSw() {
    if (sb) {
        try {
            await fetch('/api/push/send', {
                method: 'post',
                headers: {
                    'accept': 'application/json',
                    'content-type': 'application/json'
                },
                body: JSON.stringify(sb)
            });
            console.log('Enviando notificação do service worker.');
        } catch (error) {
            console.log('Erro ao enviar notificação para o client inscrito.', error);
        }
    } else {
        console.log('Usuário não cadastrado para receber notificações.');
    }
}
