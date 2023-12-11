using BeautyPoly.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BeautyPoly.Configurations
{
    public class CategoryConfiguration : IEntityTypeConfiguration<Category>
    {
        public void Configure(EntityTypeBuilder<Category> builder)
        {
            builder.HasKey(p => p.CateId);
            builder.Property(p => p.CateCode).HasColumnType("nvarchar(50)");
            builder.Property(p => p.CateName).HasColumnType("nvarchar(100)");
            builder.Property(p => p.Description).HasColumnType("nvarchar(200)");

            builder.HasOne(p=>p.Categorys).WithMany(p => p.Categories).HasForeignKey(p => p.ParentID);
        }
    }
}
