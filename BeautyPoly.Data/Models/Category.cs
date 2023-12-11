namespace BeautyPoly.Models
{
    public class Category
    {
        public int CateId { get; set; }
        public int? ParentID { get; set; }
        public string? CateCode { get; set; }
        public string? CateName { get; set; }
        public string? Description { get; set; }
        public int? Status { get; set; }
        public bool? IsSale { get; set; }
        public bool? IsDelete { get; set; }

        public virtual Category? Categorys { get; set; }
        public virtual IEnumerable<Category>? Categories { get; set; }
        public virtual IEnumerable<Product>? Products { get; set; }
        public virtual IEnumerable<SaleItemCategory>? SaleItemCategories { get; set; }
    }
    public class TreeNode
    {
        public int id { get; set; }
        public string text { get; set; }
        public bool @checked { get; set; }
        public List<TreeNode> children { get; set; }
    }
}
