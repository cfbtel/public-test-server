#!/bin/bash
#########################
# CFBTEL install script #
# (C) 2020 CFBTEL       #
# by mo@cfbtel.com      #
#########################

if ! [ -x "$(command -v git)" ]; then
  sudo apt install -y git
fi

# if ! [ -x "$(command -v dig)" ]; then
#   sudo apt install -y dnsutil
# fi

# Variables
# serverAddress="$(dig +short myip.opendns.com @resolver1.opendns.com)"
defaultPort=8081
defaultUdpPort=33033

setup_node_npm() {
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"                   # This loads nvm
  [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion" # This loads nvm bash_completion
  nvm install --lts
  nvm use --lts
}

setup_pm2() {
  if [ $(npm list -g | grep -c "pm2") -eq 0 ]; then
    npm install -g pm2
  fi
}

setup_repo() {
  git clone https://mmdpy@bitbucket.org/mmdpy/public-test-server.git
  if [ -e "$(pwd)"/public-test-server/.env ]; then
    rm "$(pwd)"/public-test-server/.env
    touch "$(pwd)"/public-test-server/.env
  else
    touch "$(pwd)"/public-test-server/.env
  fi

  echo "PORT=${port:-$defaultPort}" >>"$(pwd)"/public-test-server/.env
  echo "UDP_PORT=${udpPort:-$defaultUdpPort}" >>"$(pwd)"/public-test-server/.env
  echo "TOKEN=*my3!Secure@token&" >>"$(pwd)"/public-test-server/.env
  # echo "ADDR=${serverAddress}" >>"$(pwd)"/public-test-server/.env

  cp "$(pwd)"/public-test-server/.env "$(pwd)"/public-test-server/udp
}

start_server() {
  # open ports on ufw firewall
  if [ -x "$(command -v ufw)" ]; then
    sudo ufw allow ${port:-$defaultPort}
    sudo ufw allow ${udpPort:-$defaultUdpPort}
  fi

  cd "$(pwd)"/public-test-server
  npm install
  pm2 stop speedtest-server
  pm2 delete speedtest-server
  npm start
  cd "$(pwd)"/udp
  npm install
  pm2 stop speedtest-udp
  pm2 delete speedtest-udp
  npm start
  pm2 startup
  pm2 save
}

welcome() {
  echo " "
  echo "#################################"
  echo "# CFBTEL SpeedTest Server Setup #"
  echo "#################################"
  echo " "
  echo "Please follow the instructions in order to setup your server."
  echo " "
  echo "Enter the download/upload port you specified in your dashbord"
  read -p '[Press Enter for Default: 8081]: ' port
  echo " "
  echo "Enter the UDP port you specified in your dashbord"
  read -p '[Press Enter for Default: 33033]: ' udpPort
  echo " "

  if which node >/dev/null; then
    # Node is installed
    setup_pm2
    setup_repo
    start_server
  else
    # node is not installed
    setup_node_npm
    setup_pm2
    setup_repo
    start_server
  fi
}

if [ -d ""$(pwd)"/public-test-server" ]; then
  # Exists
  echo " "
  echo "CFBTel Test Server has already been Installed."
  read -p 'Would you like to Reinstall/Update it? < yes | no > ' reInstall
  if [ "$reInstall" = "yes" ]; then
    rm -rf "$(pwd)"/public-test-server/
    welcome
  else
    exit 1
  fi
else
  # Not Exists
  welcome
fi
