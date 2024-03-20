using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace PushFinal.Models
{
    public class Subscription
    {

        public Subscription() { }
        public Subscription(string userId, WebPush.PushSubscription subscription)
        {
            UserId = userId;
            Endpoint = subscription.Endpoint;
            TempoExpiracao = null;
            P256DH = subscription.P256DH;
            Auth = subscription.Auth;
        }

        public Subscription(string endpoint, string P256Dh, string auth)
        {
            Endpoint = endpoint;
            TempoExpiracao = null;
            P256DH = P256Dh;
            Auth = auth;
        }

        /// <summary>
        /// User id associado com uma inscrição push
        /// </summary>
        [Required]
        [ForeignKey("User")]
        public string UserId { get; set; }

        /// <summary>
        /// Endpoint associado a inscrição push
        /// </summary>
        [Required]
        public string Endpoint { get; set; }

        /// <summary>
        /// Tempo de expiração para inscrição, se há um, caso contrário, null
        /// </summary>
        public double? TempoExpiracao { get; set; }

        /// <summary>
        /// Chave pública
        /// <see href="https://en.wikipedia.org/wiki/Elliptic_curve_Diffie%E2%80%93Hellman">Elliptic curve Diffie–Hellman</see>
        /// public key on the P-256 curve (that is, the NIST secp256r1 elliptic curve).
        /// The resulting key is an uncompressed point in ANSI X9.62 format.
        /// </summary>
        [Required]
        [Key]
        public string P256DH { get; set; }

        /// <summary>
        /// Chave privada
        /// An authentication secret, as described in
        /// <see href="https://tools.ietf.org/html/draft-ietf-webpush-encryption-08">Mensagem encriptografada para Web Push</see>.
        /// </summary>
        [Required]
        public string Auth { get; set; }

        /// <summary>
        /// Converte a inscrição para a inscrição push no formato da biblioteca WebPush
        /// </summary>
        /// <returns>WebPush subscription</returns>
        public WebPush.PushSubscription ToWebPushSubscription()
        {
            return new WebPush.PushSubscription(Endpoint, P256DH, Auth);
        }
    }
}
