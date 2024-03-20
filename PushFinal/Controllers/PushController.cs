// PushController.cs

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using PushFinal.Context;
using PushFinal.Models;
using PushFinal.Utils.PushFinal.Utils;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Text.Json;
using WebPush;
using PushSubscription = WebPush.PushSubscription;

namespace Push.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PushController : ControllerBase
    {
        private readonly WebPushClient _client;
        private readonly ILogger<PushController> _logger;
        private readonly ApplicationDbContext _dbContext;
        private VapidDetails _vapidDetails;

        public PushController(ILogger<PushController> logger, ApplicationDbContext dbContext, IConfiguration configuration)
        {
            _logger = logger;
            _dbContext = dbContext;
            _client = new WebPushClient();

            var subject = configuration["VAPID:subject"];
            var publicKey = configuration["VAPID:publicKey"];
            var privateKey = configuration["VAPID:privateKey"];

            _vapidDetails = new VapidDetails(subject, publicKey, privateKey);
        }

        [HttpGet("publickey")]
        public async Task<IActionResult> ObtemChavePublica()
        {
            return Ok(new { _vapidDetails.PublicKey });
        }

        [HttpPost("send")]
        public async Task<IActionResult> EnviaNotificacao([FromBody] PushFinal.Models.PushSubscription subscription)
        {

            var notification = MensagensPush.TESTE;
            try
            {
                _client.SendNotification(subscription.ToWebPushSubscription(), notification, _vapidDetails);
                return Ok("Notificação enviada com sucesso.");
            }
            catch (WebPushException ex)
            {
                _logger.LogError($"Endpoint ID: {subscription.Endpoint}");
                _logger.LogError($"Error: {ex.Message}");
                return StatusCode(StatusCodes.Status500InternalServerError, "Erro ao enviar a notificação.");
            }

        }
    }
}
