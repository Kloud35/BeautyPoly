namespace BeautyPoly.Models
{
    public class SaleItemCategory
    {
        public int SaleItemCategoryID { get; set; }
        public int? SaleID { get; set; }
        public int? CateID { get; set; }

        public virtual Sale? Sale { get; set; }
        public virtual Category? Category { get; set; }
    }
}
    