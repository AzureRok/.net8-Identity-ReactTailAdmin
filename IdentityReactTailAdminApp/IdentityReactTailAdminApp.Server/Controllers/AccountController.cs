using System.Security.Claims;
using IdentityReactTailAdminApp.Server.Model.Data;
using IdentityReactTailAdminApp.Server.Model.Dto;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace IdentityReactTailAdminApp.Server.Controllers
{
    // Can also copy and customize the code from https://github.com/dotnet/aspnetcore/blob/main/src/Identity/Core/src/IdentityApiEndpointRouteBuilderExtensions.cs
    [ApiController]
    [Route("")]
    public class AccountController(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager) : ControllerBase
    {
        private const string DefaultRoleName = "test";

        [HttpPost("registerAdditionalData")]
        public async Task<IActionResult> Register([FromBody] RegistrationDto model)
        {
            if (!roleManager.Roles.Any(p => p.Name == DefaultRoleName))
            {
                await roleManager.CreateAsync(new IdentityRole(DefaultRoleName));
            }

            var user = new ApplicationUser
            {
                UserName = model.Email,
                Email = model.Email,
                FullName = model.FullName,
                // Set other properties
            };

            var result = await userManager.CreateAsync(user, model.Password);
            if (result.Succeeded)
            {
                _ = await userManager.AddToRoleAsync(user, DefaultRoleName);
                _ = await userManager.AddClaimAsync(user, new Claim("fullname", user.FullName));
                return Ok(new { Message = "Registration successful" });
            }

            return BadRequest(new { Errors = result.Errors });
        }
    }
}
