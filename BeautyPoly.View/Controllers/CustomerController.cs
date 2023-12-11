using BeautyPoly.Data.Repositories;
using BeautyPoly.Data.ViewModels.Customer;
using Microsoft.AspNetCore.Mvc;

namespace BeautyPoly.View.Controllers
{
    public class CustomerController : Controller
    {
        CustomerRepository _customerRepo;

        public CustomerController(CustomerRepository customerRepository)
        {
            _customerRepo = customerRepository;
        }

        public IActionResult EditCustomer()
        {
            var customerIdClaim = HttpContext.User.FindFirst("CustomerId");
            if (customerIdClaim != null)
            {
                //var customer = _customerRepo.GetByIdAsync(Convert.ToInt64(customerIdClaim.Value));
                //CustomerViewModel customerView = new CustomerViewModel();
                //customerView.CustomerId = customer.CustomerId;
                //customerView.FullName = customer.FullName;
                //customerView.Phone = customer.Phone;
                //customerView.Email = customer.Email;
                //customerView.DateBirth = customer.DateBirth;
                //customerView.Address = customer.Address;
                //customerView.Sex = customer.Sex;
                //return View(customerView);
                return View();
            }
            else
            {
                return NotFound();
            }
        }
        public IActionResult Index()
        {
            return View();
        }
    }
}
