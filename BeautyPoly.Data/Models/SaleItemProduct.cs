using BeautyPoly.Data.Repositories;

namespace BeautyPoly.Models
{
    public class SaleItemProduct
    {
        public int SaleItemProductID { get; set; }
        public int? SaleID { get; set; }
        public int? ProductID { get; set; }

        public virtual Sale? Sale { get; set; }
        public virtual Product? Product { get; set; }

    }
}
