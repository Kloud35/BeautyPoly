using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BeautyPoly.Data.Migrations
{
    public partial class updateremovebrand : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BrandDetails");

            migrationBuilder.DropTable(
                name: "SaleItemBrands");

            migrationBuilder.DropTable(
                name: "Brands");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Brands",
                columns: table => new
                {
                    BrandID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BrandCode = table.Column<string>(type: "varchar(50)", nullable: true),
                    BrandName = table.Column<string>(type: "nvarchar(100)", nullable: true),
                    CountryOfOrigin = table.Column<string>(type: "nvarchar(100)", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(200)", nullable: true),
                    IsDelete = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Brands", x => x.BrandID);
                });

            migrationBuilder.CreateTable(
                name: "BrandDetails",
                columns: table => new
                {
                    BrandDetailsID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BrandID = table.Column<int>(type: "int", nullable: true),
                    ProductID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BrandDetails", x => x.BrandDetailsID);
                    table.ForeignKey(
                        name: "FK_BrandDetails_Brands_BrandID",
                        column: x => x.BrandID,
                        principalTable: "Brands",
                        principalColumn: "BrandID");
                    table.ForeignKey(
                        name: "FK_BrandDetails_Products_ProductID",
                        column: x => x.ProductID,
                        principalTable: "Products",
                        principalColumn: "ProductID");
                });

            migrationBuilder.CreateTable(
                name: "SaleItemBrands",
                columns: table => new
                {
                    SaleItemBrandID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BrandID = table.Column<int>(type: "int", nullable: true),
                    SaleID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SaleItemBrands", x => x.SaleItemBrandID);
                    table.ForeignKey(
                        name: "FK_SaleItemBrands_Brands_BrandID",
                        column: x => x.BrandID,
                        principalTable: "Brands",
                        principalColumn: "BrandID");
                    table.ForeignKey(
                        name: "FK_SaleItemBrands_Sale_SaleID",
                        column: x => x.SaleID,
                        principalTable: "Sale",
                        principalColumn: "SaleID");
                });

            migrationBuilder.CreateIndex(
                name: "IX_BrandDetails_BrandID",
                table: "BrandDetails",
                column: "BrandID");

            migrationBuilder.CreateIndex(
                name: "IX_BrandDetails_ProductID",
                table: "BrandDetails",
                column: "ProductID");

            migrationBuilder.CreateIndex(
                name: "IX_SaleItemBrands_BrandID",
                table: "SaleItemBrands",
                column: "BrandID");

            migrationBuilder.CreateIndex(
                name: "IX_SaleItemBrands_SaleID",
                table: "SaleItemBrands",
                column: "SaleID");
        }
    }
}
