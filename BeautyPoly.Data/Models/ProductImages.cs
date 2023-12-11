namespace BeautyPoly.Models
{
    public class ProductImages
    {
        public int ProductImagesID { get; set; }
        public int? ProductID { get; set; }
        public string? ProductImagesCode { get; set; }
        public string? Image { get; set; }
        public bool? IsDefault { get; set; }
        public bool? IsDelete { get; set; }
        
        public virtual Product? Product { get; set; }
    }
}
