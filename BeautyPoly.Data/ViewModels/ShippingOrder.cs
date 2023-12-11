﻿namespace BeautyPoly.Data.ViewModels
{
    public class ShippingOrder
    {
        public int service_id { get; set; }
        public int insurance_value { get; set; }
        public string coupon { get; set; }
        public int from_district_id { get; set; }
        public int to_district_id { get; set; }
        public string to_ward_code { get; set; }
        public int height { get; set; }
        public int length { get; set; }
        public int width { get; set; }
        public int weight { get; set; }

    }
}
