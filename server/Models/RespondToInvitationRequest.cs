namespace server.Models
{
    public class RespondToInvitationRequest
    {

            public int InvitationId { get; set; }
            public bool IsAccepted { get; set; } // true for accept, false for reject
        

    }
}
