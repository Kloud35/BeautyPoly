using BeautyPoly.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BeautyPoly.Configurations
{
    public class SaleItemCategoryConfiguration : IEntityTypeConfiguration<SaleItemCategory>
    {
        public void Configure(EntityTypeBuilder<SaleItemCategory> builder)
        {
            builder.HasKey(p => p.SaleItemCategoryID);

            builder.HasOne(p => p.Sale).WithMany(p => p.SaleItemCategories).HasForeignKey(p => p.SaleID);
            builder.HasOne(p=>p.Category).WithMany(p=>p.SaleItemCategories).HasForeignKey(p=>p.CateID);
        }
    }
}
