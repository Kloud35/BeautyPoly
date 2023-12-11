using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BeautyPoly.Data.Migrations
{
    public partial class updatedb111 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CartDetails_ProductDetails_ProductDetailsID",
                table: "CartDetails");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderDetails_ProductDetails_ProductDetailsID",
                table: "OrderDetails");

            migrationBuilder.DropIndex(
                name: "IX_OrderDetails_ProductDetailsID",
                table: "OrderDetails");

            migrationBuilder.DropIndex(
                name: "IX_CartDetails_ProductDetailsID",
                table: "CartDetails");

            migrationBuilder.DropColumn(
                name: "Alias",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "SalePrice",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "ProductPrice",
                table: "ProductDetails");

            migrationBuilder.DropColumn(
                name: "ProductQuantity",
                table: "ProductDetails");

            migrationBuilder.DropColumn(
                name: "Alias",
                table: "Categories");

            migrationBuilder.DropColumn(
                name: "Img",
                table: "Categories");

            migrationBuilder.DropColumn(
                name: "ProductDetailsID",
                table: "CartDetails");

            migrationBuilder.DropColumn(
                name: "CartDate",
                table: "Cart");

            migrationBuilder.DropColumn(
                name: "IsDelete",
                table: "Cart");

            migrationBuilder.DropColumn(
                name: "IsDelete",
                table: "Accounts");

            migrationBuilder.RenameColumn(
                name: "ProductDetailsID",
                table: "OrderDetails",
                newName: "Status");

            migrationBuilder.RenameColumn(
                name: "ExpirationDate",
                table: "Coupons",
                newName: "StartDate");

            migrationBuilder.RenameColumn(
                name: "Code",
                table: "Coupons",
                newName: "CouponCode");

            migrationBuilder.RenameColumn(
                name: "Ordersing",
                table: "Categories",
                newName: "Status");

            migrationBuilder.RenameColumn(
                name: "IsPublished",
                table: "Categories",
                newName: "IsSale");

            migrationBuilder.AddColumn<int>(
                name: "MaxValue",
                table: "Vouchers",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MinValue",
                table: "Vouchers",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Quantity",
                table: "Vouchers",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UseQuantity",
                table: "Vouchers",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreateDate",
                table: "Sale",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Quantity",
                table: "Sale",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "CapitalPrice",
                table: "ProductSkus",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Price",
                table: "ProductSkus",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Quantity",
                table: "ProductSkus",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ProductSkusID",
                table: "OrderDetails",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "DistricID",
                table: "LocationCustomers",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ProvinID",
                table: "LocationCustomers",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "WardID",
                table: "LocationCustomers",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "EndDate",
                table: "Coupons",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Quantity",
                table: "Coupons",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ProductSkusID",
                table: "CartDetails",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_OrderDetails_ProductSkusID",
                table: "OrderDetails",
                column: "ProductSkusID");

            migrationBuilder.CreateIndex(
                name: "IX_CartDetails_ProductSkusID",
                table: "CartDetails",
                column: "ProductSkusID");

            migrationBuilder.AddForeignKey(
                name: "FK_CartDetails_ProductSkus_ProductSkusID",
                table: "CartDetails",
                column: "ProductSkusID",
                principalTable: "ProductSkus",
                principalColumn: "ProductSkusID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_OrderDetails_ProductSkus_ProductSkusID",
                table: "OrderDetails",
                column: "ProductSkusID",
                principalTable: "ProductSkus",
                principalColumn: "ProductSkusID",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CartDetails_ProductSkus_ProductSkusID",
                table: "CartDetails");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderDetails_ProductSkus_ProductSkusID",
                table: "OrderDetails");

            migrationBuilder.DropIndex(
                name: "IX_OrderDetails_ProductSkusID",
                table: "OrderDetails");

            migrationBuilder.DropIndex(
                name: "IX_CartDetails_ProductSkusID",
                table: "CartDetails");

            migrationBuilder.DropColumn(
                name: "MaxValue",
                table: "Vouchers");

            migrationBuilder.DropColumn(
                name: "MinValue",
                table: "Vouchers");

            migrationBuilder.DropColumn(
                name: "Quantity",
                table: "Vouchers");

            migrationBuilder.DropColumn(
                name: "UseQuantity",
                table: "Vouchers");

            migrationBuilder.DropColumn(
                name: "CreateDate",
                table: "Sale");

            migrationBuilder.DropColumn(
                name: "Quantity",
                table: "Sale");

            migrationBuilder.DropColumn(
                name: "CapitalPrice",
                table: "ProductSkus");

            migrationBuilder.DropColumn(
                name: "Price",
                table: "ProductSkus");

            migrationBuilder.DropColumn(
                name: "Quantity",
                table: "ProductSkus");

            migrationBuilder.DropColumn(
                name: "ProductSkusID",
                table: "OrderDetails");

            migrationBuilder.DropColumn(
                name: "DistricID",
                table: "LocationCustomers");

            migrationBuilder.DropColumn(
                name: "ProvinID",
                table: "LocationCustomers");

            migrationBuilder.DropColumn(
                name: "WardID",
                table: "LocationCustomers");

            migrationBuilder.DropColumn(
                name: "EndDate",
                table: "Coupons");

            migrationBuilder.DropColumn(
                name: "Quantity",
                table: "Coupons");

            migrationBuilder.DropColumn(
                name: "ProductSkusID",
                table: "CartDetails");

            migrationBuilder.RenameColumn(
                name: "Status",
                table: "OrderDetails",
                newName: "ProductDetailsID");

            migrationBuilder.RenameColumn(
                name: "StartDate",
                table: "Coupons",
                newName: "ExpirationDate");

            migrationBuilder.RenameColumn(
                name: "CouponCode",
                table: "Coupons",
                newName: "Code");

            migrationBuilder.RenameColumn(
                name: "Status",
                table: "Categories",
                newName: "Ordersing");

            migrationBuilder.RenameColumn(
                name: "IsSale",
                table: "Categories",
                newName: "IsPublished");

            migrationBuilder.AddColumn<string>(
                name: "Alias",
                table: "Products",
                type: "nvarchar(150)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "SalePrice",
                table: "Products",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "ProductPrice",
                table: "ProductDetails",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ProductQuantity",
                table: "ProductDetails",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Alias",
                table: "Categories",
                type: "nvarchar(100)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Img",
                table: "Categories",
                type: "nvarchar(100)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ProductDetailsID",
                table: "CartDetails",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CartDate",
                table: "Cart",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDelete",
                table: "Cart",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDelete",
                table: "Accounts",
                type: "bit",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_OrderDetails_ProductDetailsID",
                table: "OrderDetails",
                column: "ProductDetailsID");

            migrationBuilder.CreateIndex(
                name: "IX_CartDetails_ProductDetailsID",
                table: "CartDetails",
                column: "ProductDetailsID");

            migrationBuilder.AddForeignKey(
                name: "FK_CartDetails_ProductDetails_ProductDetailsID",
                table: "CartDetails",
                column: "ProductDetailsID",
                principalTable: "ProductDetails",
                principalColumn: "ProductDetailsID");

            migrationBuilder.AddForeignKey(
                name: "FK_OrderDetails_ProductDetails_ProductDetailsID",
                table: "OrderDetails",
                column: "ProductDetailsID",
                principalTable: "ProductDetails",
                principalColumn: "ProductDetailsID");
        }
    }
}
