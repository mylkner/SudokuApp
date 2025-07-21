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
        services.AddSession();
        services.AddScoped<ISudokuService, SudokuService>();
        return services;
    }

    public static IServiceCollection AddCustomMiddleware(this IServiceCollection services)
    {
        services.AddExceptionHandler<ExceptionMiddleware>();
        return services;
    }
}
