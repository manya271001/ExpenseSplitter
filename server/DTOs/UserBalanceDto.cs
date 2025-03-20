namespace server.DTOs
{
    public class UserBalanceDto
    {
        public int GroupId { get; set; }
        public decimal AmountOwed { get; set; }
        public decimal AmountReceivable { get; set; }
    }

}
