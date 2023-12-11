using BeautyPoly.Common;
using BeautyPoly.DBContext;
using BeautyPoly.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BeautyPoly.Data.Repositories
{
    public class SaleItemCateRepo : GenericRepo<SaleItemCategory>
    {
        public SaleItemCateRepo(BeautyPolyDbContext dbContext) : base(dbContext)
        {
        }
        public List<SaleItemCategory> GetAllSaleItemCate(int Id)
        {
            List<SaleItemCategory> list = SQLHelper<SaleItemCategory>.ProcedureToList("spGetCategoryIsSale", new string[] { "@Id" }, new object[] { Id });
            return list;
        }
    }
}
