﻿using BeautyPoly.DBContext;
using BeautyPoly.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BeautyPoly.Data.Repositories
{
    public class ProductImagesRepo : GenericRepo<ProductImages>
    {
        public ProductImagesRepo(BeautyPolyDbContext dbContext) : base(dbContext)
        {
        }
    }
}
