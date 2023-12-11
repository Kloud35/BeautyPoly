using BeautyPoly.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BeautyPoly.Configurations
{
    public class SaleItemProductConfiguration : IEntityTypeConfiguration<SaleItemProduct>
    {
        public void Configure(EntityTypeBuilder<SaleItemProduct> builder)
        {
            builder.HasKey(p => p.SaleItemProductID);

            builder.HasOne(p=>p.Sale).WithMany(p=>p.SaleItemProducts).HasForeignKey(p=>p.SaleID);
            builder.HasOne(p=>p.Product).WithMany(p=>p.SaleItemProducts).HasForeignKey(p=>p.ProductID);
        }
    }
}
