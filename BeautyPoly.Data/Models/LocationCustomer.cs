using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BeautyPoly.Models
{
    public class LocationCustomer
    {
        public int LocationCustomerID { get; set; }
        public int? PotentialCustomerID { get; set; }
        public int? ProvinID { get; set; }
        public int? DistricID { get; set; }
        public int? WardID { get; set; }
        public string? Address { get; set; }
        public bool? IsDefault { get; set; }
        public bool? IsDelete { get; set; }
        public virtual PotentialCustomer? PotentialCustomer { get; set; }
       
    }
}
