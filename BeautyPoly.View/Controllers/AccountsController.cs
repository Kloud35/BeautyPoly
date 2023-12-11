using BeautyPoly.Data.Repositories;
using BeautyPoly.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace BeautyPoly.View.Controllers
{
    public class AccountsController : Controller
    {


        LoginAccountRepository _loginRepository;
        public AccountsController(LoginAccountRepository loginRepository)
        {
            _loginRepository = loginRepository;
        }
        [HttpPost("account/register")]
        public IActionResult Register([FromBody] PotentialCustomer model)
        {
            var check = _loginRepository.CreateCustomer(model);

            if (check == 1)
            {
                return Json(new { success = true });
            }
            else if (check == 2)
            {
                return Json(new { success = false });
            }
            else
            {
                return Json(new { success = false });
            }
        }
        [HttpPost("account/login")]
        public async Task<IActionResult> Login([FromBody] PotentialCustomer model)
        {
            var check = _loginRepository.Login(model);

            if (check != null)
            {
                // Your secret key for signing the token (keep it secret!)
                string secretKey = "pUPGPwLPV75oh909Fq+FidTseGoGfI9bl+tyCpHGOHk=";

                // Create a list of claims (you can customize this based on your needs)
                var claims = new[]
                {
                    new Claim("Name", check.FullName),
                    new Claim("Email", check.Email),
                    new Claim("Phone", check.Phone),
                    new Claim("DateOfBirth", check.Birthday.ToString()),
                    new Claim("Id", check.PotentialCustomerID.ToString()),
                    // Add any additional claims as needed
                };

                // Create the credentials used to sign the token
                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                // Create the token
                var token = new JwtSecurityToken(
                    issuer: "your_issuer",
                    audience: "your_audience",
                    claims: claims,
                    expires: DateTime.Now.AddMinutes(30), // Set the expiration time
                    signingCredentials: creds
                );

                // Serialize the token to a string
                var tokenString = new JwtSecurityTokenHandler().WriteToken(token);
                Console.WriteLine(tokenString);
                return Json(new { success = true, token = tokenString });
                //return RedirectToAction("Index", "Customer");
            }
            else
            {
                return Json(new { success = false, token = "" });
            }
        }
        [Authorize]

        public IActionResult Logout()
        {
            HttpContext.SignOutAsync("MyCookie");
            return RedirectToAction("Index", "Home");
        }

    }
}
