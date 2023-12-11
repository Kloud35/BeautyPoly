using BeautyPoly.Common;
using BeautyPoly.DBContext;
using BeautyPoly.Models;

namespace BeautyPoly.Data.Repositories
{
    public class CategoryRepo : GenericRepo<Category>
    {
        public CategoryRepo(BeautyPolyDbContext dbContext) : base(dbContext)
        {
        }
        public List<Category> GetAllCate(string filter)
        {
            return SQLHelper<Category>.ProcedureToList("spGetCategory", new string[] { "@Keyword" }, new object[] { filter });
        }
    }
}
