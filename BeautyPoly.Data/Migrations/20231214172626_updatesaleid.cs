using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BeautyPoly.Data.Migrations
{
    public partial class updatesaleid : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SaleID",
                table: "Products",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Img",
                table: "Posts",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Contents",
                table: "Posts",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(150)",
                oldNullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SaleID",
                table: "Products");

            migrationBuilder.AlterColumn<string>(
                name: "Img",
                table: "Posts",
                type: "nvarchar(100)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Contents",
                table: "Posts",
                type: "nvarchar(150)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);
        }
    }
}
