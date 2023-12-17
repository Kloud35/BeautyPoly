using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BeautyPoly.Data.Migrations
{
    public partial class updatelocation : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ProvinID",
                table: "LocationCustomers",
                newName: "ProvinceID");

            migrationBuilder.RenameColumn(
                name: "DistricID",
                table: "LocationCustomers",
                newName: "DistrictID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ProvinceID",
                table: "LocationCustomers",
                newName: "ProvinID");

            migrationBuilder.RenameColumn(
                name: "DistrictID",
                table: "LocationCustomers",
                newName: "DistricID");
        }
    }
}
