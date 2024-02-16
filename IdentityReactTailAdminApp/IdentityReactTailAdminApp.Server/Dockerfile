#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
#USER app
WORKDIR /app
EXPOSE 8080
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get install -y libpng-dev libjpeg-dev curl libxi6 build-essential libgl1-mesa-glx
RUN curl -sL https://deb.nodesource.com/setup_lts.x | bash -
RUN apt-get install -y nodejs


FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get install -y libpng-dev libjpeg-dev curl libxi6 build-essential libgl1-mesa-glx
RUN curl -sL https://deb.nodesource.com/setup_lts.x | bash -
RUN apt-get install -y nodejs
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["identityreacttailadminapp.client/nuget.config", "identityreacttailadminapp.client/"]
COPY ["IdentityReactTailAdminApp.Server/IdentityReactTailAdminApp.Server.csproj", "IdentityReactTailAdminApp.Server/"]
COPY ["identityreacttailadminapp.client/identityreacttailadminapp.client.esproj", "identityreacttailadminapp.client/"]
RUN dotnet restore "./IdentityReactTailAdminApp.Server/./IdentityReactTailAdminApp.Server.csproj"
COPY . .
WORKDIR "/src/IdentityReactTailAdminApp.Server"
RUN dotnet build "./IdentityReactTailAdminApp.Server.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./IdentityReactTailAdminApp.Server.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
USER app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "IdentityReactTailAdminApp.Server.dll"]