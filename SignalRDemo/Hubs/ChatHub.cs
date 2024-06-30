using Microsoft.AspNetCore.SignalR;
using SignalRDemo.Contexts;
using SignalRDemo.Models;

namespace SignalRDemo.Hubs
{
    public class ChatHub : Hub
    {
        private readonly ILogger<ChatHub> _logger;
        private readonly ChatDbContext _context;

        public ChatHub(ILogger<ChatHub> logger, ChatDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        //Send Individual Message
        public async Task Send(string user , string message)
        {
            await Clients.Others.SendAsync("ReceiveMessage" , user , message);

            Message msg = new Message()
            {
                MessageText = message,
                UserName = user
            };

            _context.Messages.Add(msg);

            await _context.SaveChangesAsync();

        }

        //Join Group 

        public async Task JoinGroup(string groupname , string userName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId ,  groupname);

            await Clients.OthersInGroup(groupname).SendAsync("NewMember", userName, groupname);

            _logger.LogInformation(Context.ConnectionId);


        }

        //Send Group
        public async Task SendToGroup(string groupName, string user, string message)
        {
            await Clients.Group(groupName).SendAsync("ReceiveMessageGroup", user, message);

            Message msg = new Message()
            {
                MessageText = message,
                UserName = user
            };

            _context.Messages.Add(msg);

            await _context.SaveChangesAsync();

        }
    }
}
