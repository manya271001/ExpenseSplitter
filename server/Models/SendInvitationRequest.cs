namespace server.Models
{
    public class SendInvitationRequest
    {
        public int GroupId { get; set; }
        public int InvitedUserId { get; set; }
         public string InvitedUserName { get; set; }

    }
}
