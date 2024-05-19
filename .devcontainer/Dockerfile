# Using docker image from microsoft Ubuntu:jammy
FROM mcr.microsoft.com/devcontainers/base:jammy

# Update the OS
RUN apt-get update && apt-get upgrade -y

# Install the ping command
RUN apt-get -y install --no-install-recommends iputils-ping

# Download the script for HLF and change to executable
RUN curl -sSLO https://raw.githubusercontent.com/hyperledger/fabric/main/scripts/install-fabric.sh && chmod +x install-fabric.sh

# download the latest version of golang
RUN wget https://go.dev/dl/go1.22.1.linux-amd64.tar.gz && \
    tar -C /usr/local -xzf go1.22.1.linux-amd64.tar.gz && \
    rm go1.22.1.linux-amd64.tar.gz

# Set environment variables
ENV PATH="/usr/local/go/bin:$PATH"

# Ensure nvm is sourced properly for future RUN instructions
SHELL ["/bin/bash", "-c"]