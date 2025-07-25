using Scalar.AspNetCore;
using Server.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddAllServices();

var app = builder.Build();

app.UseExceptionHandler();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}
else
{
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseDefaultFiles();
app.UseStaticFiles();
app.UseCors();
app.UseSession();
app.MapControllers();
app.Run();
