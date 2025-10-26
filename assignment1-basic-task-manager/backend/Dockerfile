# Use the official .NET 8.0 runtime as base image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

# Use the .NET 8.0 SDK for building
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["TaskManagerApi.csproj", "."]
RUN dotnet restore "TaskManagerApi.csproj"
COPY . .
RUN dotnet build "TaskManagerApi.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "TaskManagerApi.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "TaskManagerApi.dll"]
