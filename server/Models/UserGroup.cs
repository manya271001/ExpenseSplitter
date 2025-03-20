using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace server.Models
{
    public class UserGroup
    {
        [Key, Column(Order = 0)]
        public int UserId { get; set; }
        [Required]
        public  NewUser User { get; set; }  

        [Key, Column(Order = 1)]
        public int GroupId { get; set; }
        [Required]

        [JsonIgnore]
        public  Group Group { get; set; }
        public decimal Balance { get; internal set; }
    }
}
