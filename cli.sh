#!/bin/bash

set -e # Exit immediately if a command exits with a non-zero status
set -o pipefail # Cause a pipeline to return the status of the last command that exited with a non-zero status
# Constants
OS_TYPE=$(uname -o)
DOCKER_VERSION="24.0"
# OS_VERSION=$(grep -w "VERSION_ID" /etc/os-release | cut -d "=" -f 2 | tr -d '"')

# Function to display usage information
usage() {
    echo "Usage: $0 [options]"
    echo "Options:"
    echo "  -h, --help       Display this help message"
    echo "  -g, --greet      Greet the user"
    echo "  -t, --time       Display current time"
    echo "  -i, --install    Install the program"
    echo "  -u, --up         start the leploy compose"
    echo "  -d, --down       stop the leploy compose"
    echo "  -l, --list       List files in current directory"
    echo $OS_TYPE
    # echo $OS_VERSION
}

# Function to greet the user
greet() {
    # Check if .env file exists
if [ -f .env ]; then
    # Read the .env file line by line
    while IFS='=' read -r key value; do
        # Export each key-value pair as an environment variable
        export "$key"="$value"
    done < .env
fi

    echo "Hello, $USER!"
    echo $GITHUB_PERSONAL_TOKEN
}

installDocker(){
    if ! [ -x "$(command -v docker)" ]; then
        echo "Docker is not installed. Installing Docker."
        curl https://releases.rancher.com/install-docker/${DOCKER_VERSION}.sh | sh
        if [ -x "$(command -v docker)" ]; then
            echo "Docker installed successfully."
        else
            echo "Docker installation failed with Rancher script. Trying with official script."
            curl https://get.docker.com | sh -s -- --version ${DOCKER_VERSION}
            if [ -x "$(command -v docker)" ]; then
                echo "Docker installed successfully."
            else
                echo "Docker installation failed with official script."
                echo "Maybe your OS is not supported."
                echo "Please visit https://docs.docker.com/engine/install/ and install Docker manually to continue."
                exit 1
            fi
        fi
    fi 
    echo "Docker is installed."
}

install() {
    echo -e "-------------"
    echo -e "Welcome to leploy beta installer!"
    echo -e "This script will install everything for you."
    echo -e "(Source code: https://github.com/daniel-le97/leploy/blob/main/scripts/install.sh)\n"
    echo -e "-------------"

    installDocker
    INSTALL_DIR="./.data/compose"
   if [ ! -d "$INSTALL_DIR" ]; then
        echo "Creating directory $INSTALL_DIR."
        # mkdir -p $INSTALL_DIR
        # echo "Directory $INSTALL_DIR created."
    else
        echo "Directory $INSTALL_DIR already exists."
   fi
   home_dir=$HOME/leploy  # This will store the home directory of the current user in the variable 'home_dir'
   echo "Home directory: $home_dir/leploy"

}

isDockerRunning(){
    if ! docker info &> /dev/null; then
        echo "Docker is not running."
        exit 1
    fi
}

up(){
    isDockerRunning
    docker compose -f "docker-compose.yml" up -d
}
down(){
    isDockerRunning
    docker compose -f "docker-compose.yml" down
}

# Function to display current time
display_time() {
    echo "Current time: $(date +"%T")"
}

# Function to list files in the current directory
list_files() {
    echo "Files in current directory:"
    cd ./.data/compose
    ls
}

# Parse command-line arguments
while [[ $# -gt 0 ]]; do
    echo "Processing argument: $1"
    case $1 in
        -h|--help)
            usage
            exit 0
            ;;
        -g|--greet)
            greet
            ;;
        -u|--up)
            up
            ;;
        -d|--down)
            down
            ;;
        -t|--time)
            display_time
            ;;
        -l|--list)
            list_files
            ;;
        -i|--install)
            install
            ;;
        *)
            echo "Error: Unknown option: $1"
            usage
            exit 1
            ;;
    esac
    shift
done

# If no arguments provided, display usage information
# if [[ $# -eq 0 ]]; then
#     usage
# fi
