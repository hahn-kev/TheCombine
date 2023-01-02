# Docker multi-stage build.

# Define build arguments
ARG BUILD_TYPE=release

### STAGE 1: Compile the backend code
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS builder
WORKDIR /app

# Copy csproj and restore (fetch dependencies) as distinct layers.
COPY *.csproj ./
RUN dotnet restore

# Copy everything else and build.
COPY . ./
RUN dotnet publish -c Release -o build

### STAGE 2: Build debug base image
FROM mcr.microsoft.com/dotnet/sdk:6.0 as debug-build

ENV BUILD_TYPE=debug

# Install system dependencies.
RUN apt-get update \
  && apt-get install -y \
  # icu.net dependency: libdl.so
  libc6-dev \
  px \
  sudo \
  && rm -rf /var/lib/apt/lists/*

RUN dotnet tool install --tool-path /usr/local/bin dotnet-gcdump

### STAGE 3: Build release base image
FROM mcr.microsoft.com/dotnet/aspnet:6.0 as release-build

ENV BUILD_TYPE=release

# Install system dependencies.
RUN apt-get update \
  && apt-get install -y \
  # icu.net dependency: libdl.so
  libc6-dev \
  && rm -rf /var/lib/apt/lists/*

### STAGE 4: Complete backend image from selected base image
FROM ${BUILD_TYPE}-build
ENV ASPNETCORE_URLS=http://+:5000
ENV COMBINE_IS_IN_CONTAINER=1
ENV ASPNETCORE_ENVIRONMENT=Production
ENV DOTNET_PRINT_TELEMETRY_MESSAGE=false

# Set the home directory to the app user's home.
ENV HOME=/home/app
ENV APP_HOME=${HOME}/backend
ENV APP_FILES=${HOME}/.CombineFiles

# Create the home directory for the new app user.
RUN mkdir -p $HOME

# Create an app user so the program doesn't run as root.
RUN groupadd -r app && \
  useradd -r -g app -d $HOME -s /sbin/nologin -c "Docker image user" app

## Set up application install directory.
RUN mkdir $APP_HOME && \
  mkdir $APP_FILES && \
  # Give access to the entire home folder so the backend can create files and folders there.
  chown -R app:app $HOME
WORKDIR $APP_HOME

# Copy in the build application.
COPY --chown=app:app launch.sh ./
COPY --chown=app:app --from=builder /app/build ./

RUN echo "Build type: $BUILD_TYPE" > /home/app/build-type

# Change to the app user.
USER app

ENTRYPOINT ["./launch.sh"]
