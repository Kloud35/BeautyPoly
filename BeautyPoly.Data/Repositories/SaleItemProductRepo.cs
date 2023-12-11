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
    public class SaleItemProductRepo : GenericRepo<SaleItemProduct>
    {
        public SaleItemProductRepo(BeautyPolyDbContext dbContext) : base(dbContext)
        {
        }
        public List<SaleItemProduct> GetAllSaleItemProduct(int Id)
        {
            List<SaleItemProduct> list = SQLHelper<SaleItemProduct>.ProcedureToList("spGetProductIsSale", new string[] { "@Id", "@Keyword" }, new object[] { Id, "" });
            return list;
        }
    }
}
