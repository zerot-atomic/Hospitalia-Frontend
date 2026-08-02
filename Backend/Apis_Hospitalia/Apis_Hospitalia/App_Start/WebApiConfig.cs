using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using System.Web.Http.Cors;
using Apis_Hospitalia.Handlers;

namespace Apis_Hospitalia
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Activar CORS permitiendo todo (*)
            var cors = new EnableCorsAttribute("*", "*", "*");
            config.EnableCors(cors);
            
            // config.MessageHandlers.Add(new PreflightRequestsHandler());

            // Rutas de Web API
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
        }
    }
}
