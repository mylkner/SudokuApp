using Server.Middleware;
using Server.Services;
using Server.Services.Interfaces;

namespace Server.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddAllServices(this IServiceCollection services)
    {
        services.AddServices();
        services.AddCustomMiddleware();
        return services;
    }

    public static IServiceCollection AddServices(this IServiceCollection services)
    {
        services.AddControllers();
        services.AddOpenApi();
        services.AddProblemDetails();
        services.AddDistributedMemoryCache();
        services.AddSession(options =>
        {
            options.Cookie.Name = "SessionId";
            options.IdleTimeout = TimeSpan.FromHours(4);
        });
        services.AddScoped<ISudokuService, SudokuService>();
        return services;
    }

    public static IServiceCollection AddCustomMiddleware(this IServiceCollection services)
    {
        services.AddExceptionHandler<ExceptionMiddleware>();
        services.AddCors(options =>
            options.AddDefaultPolicy(policy =>
                policy
                    .WithOrigins("http://localhost:5173")
                    .WithMethods("GET", "POST", "PUT", "DELETE")
                    .AllowAnyHeader()
                    .AllowCredentials()
            )
        );
        return services;
    }
}
