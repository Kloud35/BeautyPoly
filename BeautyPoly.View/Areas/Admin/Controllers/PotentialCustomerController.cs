using BeautyPoly.Data.Models.DTO;
using BeautyPoly.Data.Repositories;
using BeautyPoly.Data.ViewModels;
using BeautyPoly.Models;
using BeautyPoly.View.Areas.Admin.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.CodeAnalysis;
using Newtonsoft.Json;

namespace BeautyPoly.View.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class PotentialCustomerController : Controller
    {
        private readonly HttpClient _httpClient;

        PotentialCustomersRepo _potentialCustomerRepo;
        LocationRepo _locationCustomerRepo;
        Provin _lstprovin = new Provin();
        District _lstDistrict = new District();
        public PotentialCustomerController(PotentialCustomersRepo potentialCustomersRepo, LocationRepo locationRepo)
        {
            _httpClient = new HttpClient();
            _httpClient.DefaultRequestHeaders.Add("token", "71f04310-864d-11ed-b09a-9a2a48e971b0");

            this._potentialCustomerRepo = potentialCustomersRepo;
            this._locationCustomerRepo = locationRepo;
            GetDataCache();
        }

        //[HttpGet("admin/potentialcustomer/getlistprovin")]
        //public JsonResult GetProvin() 
        //{
        //    HttpResponseMessage responseProvin = _httpClient.GetAsync("https://online-gateway.ghn.vn/shiip/public-api/master-data/province").Result;
        //    Provin lstprovin = new Provin();

        //    if (responseProvin.IsSuccessStatusCode)
        //    {
        //        string jsonData2 = responseProvin.Content.ReadAsStringAsync().Result;


        //        lstprovin = JsonConvert.DeserializeObject<Provin>(jsonData2);
        //    }
        //    return Json(lstprovin, new System.Text.Json.JsonSerializerOptions());

        //}


        [HttpGet("admin/potentialcustomer/getlistprovin")]
        public JsonResult GetProvin(int locationIndex)
        {
            HttpResponseMessage responseProvin = _httpClient.GetAsync("https://online-gateway.ghn.vn/shiip/public-api/master-data/province").Result;
            Provin lstprovin = new Provin();

            if (responseProvin.IsSuccessStatusCode)
            {
                string jsonData2 = responseProvin.Content.ReadAsStringAsync().Result;

                lstprovin = JsonConvert.DeserializeObject<Provin>(jsonData2);
            }

            return Json(lstprovin, new System.Text.Json.JsonSerializerOptions());
        }

        //Lấy địa chỉ quận huyện
        [HttpGet("admin/potentialcustomer/getlistcistrict")]
        public JsonResult GetListDistrict(int idProvin)
        {
            HttpResponseMessage responseDistrict = _httpClient.GetAsync("https://online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=" + idProvin).Result;
            District lstDistrict = new District();
            if (responseDistrict.IsSuccessStatusCode)
            {
                string jsonData2 = responseDistrict.Content.ReadAsStringAsync().Result;
                lstDistrict = JsonConvert.DeserializeObject<District>(jsonData2);
            }
            return Json(lstDistrict, new System.Text.Json.JsonSerializerOptions());
        }
        //Lấy địa chỉ phường xã
        [HttpGet("admin/potentialcustomer/getlistward")]

        public JsonResult GetListWard(int idWard)
        {


            HttpResponseMessage responseWard = _httpClient.GetAsync("https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=" + idWard).Result;

            Ward lstWard = new Ward();

            if (responseWard.IsSuccessStatusCode)
            {
                string jsonData2 = responseWard.Content.ReadAsStringAsync().Result;

                lstWard = JsonConvert.DeserializeObject<Ward>(jsonData2);
            }
            return Json(lstWard, new System.Text.Json.JsonSerializerOptions());
        }

        [Route("admin/potentialcustomer")]
        public IActionResult Index()
        {
            //Lấy địa chỉ tỉnh thành
            HttpResponseMessage responseProvin = _httpClient.GetAsync("https://online-gateway.ghn.vn/shiip/public-api/master-data/province").Result;

            Provin lstprovin = new Provin();

            if (responseProvin.IsSuccessStatusCode)
            {
                string jsonData2 = responseProvin.Content.ReadAsStringAsync().Result;


                lstprovin = JsonConvert.DeserializeObject<Provin>(jsonData2);
                ViewBag.Provin = new SelectList(lstprovin.data, "ProvinceID", "ProvinceName");
            }

            return View();
        }

        [HttpGet("admin/potentialcustomer/getall")]
        public IActionResult GetAll(string filter)
        {
            List<PotentialCustomer> list = _potentialCustomerRepo.GetAll(filter);
            return Json(list);
        }

        [HttpGet("admin/potentialcustomer/getlocation")]
        public IActionResult GetLocation(int CustomerID)
        {
            List<LocationCustomer> locations = _locationCustomerRepo.GetAllAsync().Result.ToList();
            locations = locations.Where(p => p.PotentialCustomerID == CustomerID).ToList();
            return Json(locations);
        }

        [HttpPost("admin/potentialcustomer/create")]
        public async Task<IActionResult> CreateOrUpdate([FromBody] CustomerDTO customerDTO)
        {

            var checkExists = await _potentialCustomerRepo.FirstOrDefaultAsync(p => p.PotentialCustomerCode.Trim() == customerDTO.PotentialCustomer.PotentialCustomerCode.Trim() && p.PotentialCustomerID != customerDTO.PotentialCustomer.PotentialCustomerID);
            if (checkExists != null)
            {
                return Json("Mã khách hàng đã tồn tại! Vui lòng nhập lại.", new System.Text.Json.JsonSerializerOptions());
            }

            PotentialCustomer customer = new PotentialCustomer();

            if (customerDTO.PotentialCustomer.PotentialCustomerID > 0)
            {
                customer = customerDTO.PotentialCustomer;
                customerDTO.PotentialCustomer.CreateDate = customer.CreateDate;
                await _potentialCustomerRepo.UpdateAsync(customer);
                foreach (var item in customerDTO.LocationCustomers)
                {
                    LocationCustomer locationCustomer = new LocationCustomer();
                    if (item.LocationCustomerID > 0)
                    {
                        locationCustomer = item;
                        locationCustomer.PotentialCustomerID = customer.PotentialCustomerID;

                        await _locationCustomerRepo.UpdateAsync(locationCustomer);
                    }
                    else
                    {
                        locationCustomer.ProvinceID = item.ProvinceID;
                        locationCustomer.DistrictID = item.DistrictID;
                        locationCustomer.WardID = item.WardID;
                        locationCustomer.Address = item.Address;
                        locationCustomer.IsDefault = item.IsDefault;
                        locationCustomer.IsDelete = item.IsDelete;
                        locationCustomer.PotentialCustomerID = customer.PotentialCustomerID;
                        await _locationCustomerRepo.InsertAsync(locationCustomer);
                    }
                }
            }
            else
            {
                customer.PotentialCustomerCode = customerDTO.PotentialCustomer.PotentialCustomerCode;
                customer.FullName = customerDTO.PotentialCustomer.FullName;
                customer.Birthday = customerDTO.PotentialCustomer.Birthday;
                //if (avatar != null)
                //{
                //    string extension = Path.GetExtension(avatar.FileName);
                //    string imageName = Utilities.SEOUrl(customer.FullName) + extension;
                //    customer.Avatar = await Utilities.UploadFile(avatar, @"avatarCustomer", imageName.ToLower());
                //}
                //if (string.IsNullOrEmpty(customer.Avatar)) customer.Avatar = "default.jpg";
                // customer.Avatar = customerDTO.potentialCustomer.Avatar;
                customer.Email = customerDTO.PotentialCustomer.Email;
                customer.Phone = customerDTO.PotentialCustomer.Phone;
                customer.CreateDate = DateTime.Now;
                customer.Password = "MQAyADMANAA1ADYA"; //=123456
                customer.IsActive = customerDTO.PotentialCustomer.IsActive;
                customer.IsDelete = customerDTO.PotentialCustomer.IsDelete;
                await _potentialCustomerRepo.InsertAsync(customer);
                if (customerDTO.LocationCustomers == null)
                {
                    return Json(1);
                }
                foreach (var item in customerDTO.LocationCustomers)
                {
                    LocationCustomer location = new LocationCustomer();
                    if (item.LocationCustomerID > 0)
                    {
                        location = item;
                        location.PotentialCustomerID = customer.PotentialCustomerID;
                        await _locationCustomerRepo.InsertAsync(location);
                    }
                    else
                    {
                        location.ProvinceID = item.ProvinceID;
                        location.DistrictID = item.DistrictID;
                        location.WardID = item.WardID;
                        location.Address = item.Address;
                        location.IsDefault = item.IsDefault;
                        location.IsDelete = item.IsDelete;
                        location.PotentialCustomerID = customer.PotentialCustomerID;
                        await _locationCustomerRepo.InsertAsync(location);
                    }
                }
                return Json(1);
            }
            return Json(1);

        }


        [HttpDelete("admin/potentialcustomer/delete")]
        public async Task<IActionResult> Delete([FromBody] int customerID)
        {

            await _potentialCustomerRepo.DeleteAsync(await _potentialCustomerRepo.GetByIdAsync(customerID));
            var location = _locationCustomerRepo.GetAllAsync().Result.Where(p => p.PotentialCustomerID == customerID);
            await _locationCustomerRepo.DeleteRangeAsync(location);
            return Json(1);
        }

        //[HttpGet("admin/potentialcustomer/getlocations")]
        //public IActionResult GetLocations(int CustomerID)
        //{
        //    List<LocationCustomer> locations = _locationCustomerRepo.GetAllAsync().Result.ToList();
        //    locations = locations.Where(p => p.PotentialCustomerID == CustomerID).ToList();

        //    return View("LocationView", locations);
        //}

        [HttpDelete("admin/potentialcustomer/deletelocation")]
        public async Task<IActionResult> DeleteLocation(int id_location)
        {
            try
            {
                var location = await _locationCustomerRepo.GetByIdAsync(id_location);
                if (location == null)
                {
                    return NotFound();
                }

                await _locationCustomerRepo.DeleteAsync(location);

                return Json(1);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // Customer
        [HttpPost("admin/potentialcustomer/locations")]
        public async Task<IActionResult> CreateOrUpdateLocation([FromBody] LocationCustomerDTO locationCustomerDTO)
        {
            var data = new LocationCustomer();
            data.PotentialCustomerID = locationCustomerDTO.PotentialCustomerID;
            data.Address = locationCustomerDTO.Address;
            data.WardID = locationCustomerDTO.WardID;
            data.DistrictID = locationCustomerDTO.DistrictID;
            data.ProvinceID = locationCustomerDTO.ProvinceID;
            data.IsDefault = locationCustomerDTO.IsDefault;
            data.IsDelete = locationCustomerDTO.IsDelete;
            await _locationCustomerRepo.InsertAsync(data);
            return Json(1);
        }
        [HttpPut("admin/potentialcustomer/locations")]
        public async Task<IActionResult> UpdateLocation([FromBody] LocationCustomerDTO locationCustomerDTO)
        {
            var data = new LocationCustomer();
            data.LocationCustomerID = locationCustomerDTO.LocationCustomerID;
            data.PotentialCustomerID = locationCustomerDTO.PotentialCustomerID;
            data.Address = locationCustomerDTO.Address;
            data.WardID = locationCustomerDTO.WardID;
            data.DistrictID = locationCustomerDTO.DistrictID;
            data.ProvinceID = locationCustomerDTO.ProvinceID;
            data.IsDefault = locationCustomerDTO.IsDefault;
            data.IsDelete = locationCustomerDTO.IsDelete;
            await _locationCustomerRepo.UpdateAsync(data);
            return Json(1);
        }
        [HttpGet("admin/potentialcustomer/locations")]
        public JsonResult Locations(int CustomerID)
        {
            List<LocationCustomer> locations = _locationCustomerRepo.GetAllAsync().Result.ToList();
            List<LocationCustomerViewModel> locationsResult = new List<LocationCustomerViewModel>();
            locations = locations.Where(p => p.PotentialCustomerID == CustomerID).ToList();

            locations.ForEach(p =>
            {
                var data = new LocationCustomerViewModel();
                data.ProvinceID = p.ProvinceID;
                data.DistrictID = p.DistrictID;
                data.WardID = p.WardID;
                data.Address = p.Address;
                data.IsDefault = p.IsDefault;
                data.IsDelete = p.IsDelete;
                data.LocationCustomerID = p.LocationCustomerID;
                data.PotentialCustomerID = (int)p.PotentialCustomerID;
                data.ProvinceName = _lstprovin.data.FirstOrDefault(x => x.ProvinceID == p.ProvinceID).ProvinceName;
                data.DistrictName = _lstDistrict.data.FirstOrDefault(x => x.DistrictID == p.DistrictID).DistrictName;
                HttpResponseMessage responseWard = _httpClient.GetAsync("https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=" + p.DistrictID).Result;
                Ward lstWard = new Ward();
                if (responseWard.IsSuccessStatusCode)
                {
                    string jsonData2 = responseWard.Content.ReadAsStringAsync().Result;
                    lstWard = JsonConvert.DeserializeObject<Ward>(jsonData2);
                }
                data.WardName = lstWard.data.FirstOrDefault(x => x.WardCode == p.WardID.ToString()).WardName;
                locationsResult.Add(data);
            });
            return Json(locationsResult);
        }



        private void GetDataCache()
        {
            HttpResponseMessage responseProvin = _httpClient.GetAsync("https://online-gateway.ghn.vn/shiip/public-api/master-data/province").Result;
            if (responseProvin.IsSuccessStatusCode)
            {
                string jsonData2 = responseProvin.Content.ReadAsStringAsync().Result;
                _lstprovin = JsonConvert.DeserializeObject<Provin>(jsonData2);
            }
            HttpResponseMessage responseDistrict = _httpClient.GetAsync("https://online-gateway.ghn.vn/shiip/public-api/master-data/district").Result;
            if (responseDistrict.IsSuccessStatusCode)
            {
                string jsonData2 = responseDistrict.Content.ReadAsStringAsync().Result;
                _lstDistrict = JsonConvert.DeserializeObject<District>(jsonData2);
            }
        }


    }
}
