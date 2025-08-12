FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["Backend.csproj", "."]
RUN dotnet restore "Backend.csproj"
COPY . .
RUN dotnet publish "Backend.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
# Run Kestrel on 8080 so Traefik can target it
ENV ASPNETCORE_URLS=http://+:8080
COPY --from=build /app/publish .
# Health endpoint
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1:8080/api/health || exit 1
ENTRYPOINT ["dotnet", "Backend.dll"]