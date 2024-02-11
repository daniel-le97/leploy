#!/bin/bash
    set -e # Exit immediately if a command exits with a non-zero status
    set -o pipefail # Cause a pipeline to return the status of the last command that exited with a non-zero status

    echo -e "-------------"
    echo -e "Welcome to leploy beta installer!"
    echo -e "This script will install everything for you."
    echo -e "(Source code: https://github.com/daniel-le97/leploy/blob/main/scripts/install.sh)\n"
    echo -e "-------------"

    # constants
    DOCKER_VERSION="24.0"
    INSTALL_DIR=$HOME/leploy


    if ! [ -x "$(command -v docker)" ]; then
        echo "Docker is not installed. Installing Docker."
        curl https://releases.rancher.com/install-docker/"${DOCKER_VERSION}".sh | sh
        if ! [ -x "$(command -v docker)" ]; then
            echo "Docker installation failed with Rancher script. Trying with official script."
            curl https://get.docker.com | sh -s -- --version "${DOCKER_VERSION}"
        fi
        if ! [ -x "$(command -v docker)" ]; then
            echo "Docker installation failed with official script."
            echo "Maybe your OS is not supported."
            echo "Please visit https://docs.docker.com/engine/install/ and install Docker manually to continue."
            exit 1
        else
            echo "Docker installed successfully."
        fi
    else
        echo "Docker is installed."
    fi

    rm -rf $INSTALL_DIR
    # fetch cli script from github
    if [ ! -d "$INSTALL_DIR" ]; then

        echo "Creating directory $INSTALL_DIR."
        mkdir -p $INSTALL_DIR
        echo "Directory $INSTALL_DIR created."
        current_directory=$(pwd)/hello
        mkdir -p $current_directory
        echo "Current working directory is: $current_directory"
        tar -czvf leploy.tar.gz --exclude="/db" .data
        tar -xzvf leploy.tar.gz -C "$current_directory" --strip-components=1
        zip -r leploy.zip .data -9
        # rm -rf $current_directory/db
        
    fi



    