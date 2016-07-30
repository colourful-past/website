
# Setup steps to be done manually:
# - install Node.js + NPM
# - sudo npm install -g gulp-cli
# - sudo npm install -g tsd

SERVERS=( 52.42.187.96 52.41.100.249 )

for SERVER in "${SERVERS[@]}"
do
    echo "----------------------------------------"
    echo "Deploying to $SERVER"
    echo "----------------------------------------"

    ssh ubuntu@$SERVER /bin/bash -e <<REMOTE_COMMANDS
        cd /home/ubuntu
        sudo rm -rf website

        git clone git@github.com:colourful-past/website.git
        cd website

        npm install
        tsd install
        /usr/bin/gulp release

        sudo cp -f /home/ubuntu/website/deploy/nginx-config /etc/nginx/sites-available/website
        sudo ln -sf /etc/nginx/sites-available/website /etc/nginx/sites-enabled/website
        sudo rm -f /etc/nginx/sites-enabled/default
        sudo service nginx restart

        sudo cp -f /home/ubuntu/website/deploy/upstart.conf /etc/init/website.conf
        sudo service website restart

REMOTE_COMMANDS
