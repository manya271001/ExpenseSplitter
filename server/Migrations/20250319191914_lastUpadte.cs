using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class lastUpadte : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "GroupId",
                table: "NewUsers",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "UserBalances",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    TotalOwed = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    TotalLent = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserBalances", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserBalances_NewUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "NewUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_NewUsers_GroupId",
                table: "NewUsers",
                column: "GroupId");

            migrationBuilder.CreateIndex(
                name: "IX_UserBalances_UserId",
                table: "UserBalances",
                column: "UserId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_NewUsers_Groups_GroupId",
                table: "NewUsers",
                column: "GroupId",
                principalTable: "Groups",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_NewUsers_Groups_GroupId",
                table: "NewUsers");

            migrationBuilder.DropTable(
                name: "UserBalances");

            migrationBuilder.DropIndex(
                name: "IX_NewUsers_GroupId",
                table: "NewUsers");

            migrationBuilder.DropColumn(
                name: "GroupId",
                table: "NewUsers");
        }
    }
}
