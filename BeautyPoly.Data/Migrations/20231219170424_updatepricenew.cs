using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BeautyPoly.Data.Migrations
{
    public partial class updatepricenew : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "PriceNew",
                table: "OrderDetails",
                type: "int",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PriceNew",
                table: "OrderDetails");
        }
    }
}
