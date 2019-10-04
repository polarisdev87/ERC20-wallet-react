Ethereum Wallet Application By Daniel Cagiao

Built By MERN Stack

How to use this projecgt

Requirements: NodeJS, MongoDB, NPM

Installation Guide:
    1. Install node on server
        sudo apt-get install node
    2. Getting inside of the project and install packages
        npm install
    3. Install pm2
        sudo npm install -g pm2
    4. Start using pm2
        pm2 start server
    5. Install nginx and set proxy pass
        sudo apt-get install nginx

        sudo nano /etc/nginx/sites-enabled/default

            location / {
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-NginX-Proxy true;
                proxy_pass http://localhost:8000/;
                proxy_ssl_session_reuse off;
                proxy_set_header Host $http_host;
                proxy_cache_bypass $http_upgrade;
                proxy_redirect off;
            }
    6. Run nginx
        sudo service nginx start
    
    7. Checking the server is running well
        curl http://localhost