using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class FINAL : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_NewUsers_Groups_GroupId",
                table: "NewUsers");

            migrationBuilder.DropIndex(
                name: "IX_NewUsers_GroupId",
                table: "NewUsers");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_NewUsers_GroupId",
                table: "NewUsers",
                column: "GroupId");

            migrationBuilder.AddForeignKey(
                name: "FK_NewUsers_Groups_GroupId",
                table: "NewUsers",
                column: "GroupId",
                principalTable: "Groups",
                principalColumn: "Id");
        }
    }
}
