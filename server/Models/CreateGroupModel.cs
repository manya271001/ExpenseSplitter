namespace server.Models
{
    public class CreateGroupModel
    {
        public string Name { get; set; }
        public int CreatedBy { get; set; }
        public List<int> MemberIds { get; set; }
        public int MaxMembers { get; set; }
        public decimal TotalBalance { get; set; }
        public bool IsActive { get; set; }
        public string? Description { get; internal set; }
    }
}
