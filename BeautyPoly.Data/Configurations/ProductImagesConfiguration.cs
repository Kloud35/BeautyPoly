using BeautyPoly.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BeautyPoly.Configurations
{
    public class ProductImagesConfiguration : IEntityTypeConfiguration<ProductImages>
    {
        public void Configure(EntityTypeBuilder<ProductImages> builder)
        {
            builder.HasKey(p => p.ProductImagesID);
            builder.Property(p => p.ProductImagesCode).HasColumnType("nvarchar(50)");
            builder.Property(p => p.Image).HasColumnType("nvarchar(100)");

            builder.HasOne(p=>p.Product).WithMany(p=>p.ProductImages).HasForeignKey(p=>p.ProductID);
        }
    }
}
