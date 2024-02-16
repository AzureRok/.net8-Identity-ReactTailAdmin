using Microsoft.AspNetCore.Identity;

namespace IdentityReactTailAdminApp.Server.Model.Data
{
    public class ApplicationUser : IdentityUser
    {
        public string FullName { get; set; }
    }
}
