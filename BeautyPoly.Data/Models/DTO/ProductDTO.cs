namespace BeautyPoly.Data.Models.DTO
{
    public class ProductDTO
    {
        public int ID { get; set; }
        public string? ProductName { get; set; }
        public string? ProductCode { get; set; }
        public int? CateID { get; set; }
        public int? SaleID { get; set; }
        public List<string>? Images { get; set; }
    }
}
