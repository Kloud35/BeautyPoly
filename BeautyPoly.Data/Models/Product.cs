namespace BeautyPoly.Models
{
    public class Product
    {
        public int ProductID { get; set; }
        public int? CateID { get; set; }
        public string? ProductName { get; set; }
        public string? ProductCode { get; set; }
        public DateTime? CreateDate { get; set; }
        public DateTime? ModifiledDate { get; set; }
        public int? Status { get; set; }
        public bool? IsSale { get; set; }
        public bool? IsDelete { get; set; }
        public int? SaleID { get; set; }

        public virtual Category? Category { get; set; }
        public virtual IEnumerable<ProductImages>? ProductImages { get; set; }
        public virtual IEnumerable<SaleItemProduct>? SaleItemProducts { get; set; }
        public virtual IEnumerable<OptionDetails>? OptionDetails { get; set; }
        public virtual IEnumerable<ProductSkus>? ProductSkus { get; set; }
    }   
}
