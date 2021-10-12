# yelpdeploy

-------
The general reference to this file is here: https://github.com/Sanjeev-Thiyagarajan/PERN-STACK-DEPLOYMENT
-------
This file is divided into two parts: The client, which is a react application and the server, which is an express/node server.

The react application hits the routes defined in the server.js file.  It allows users to add and delete a restaurant, and also add reviews for a specific restaurant.

The server for the application is hosted locally on port 4000 and the react app is hosted on 3000.  

The database is a postgres database and to connect to the postgres database, follow this link here: https://node-postgres.com/features/connecting

---------------

To run the app:
Step 1: Clone the repo to your local machine.  
Step 2: Open up the server folder in terminal and run: npm i and then npm start
Step 3: Open up the client folder in termina and run npm i and then npm start

---------------
Now we talk about deployment on AWS:

- We use NGINX to help us deploy on an Ubuntu Server.

- It is important to note that once the application is deployed, the Ubuntu server is going to think the react and express server are on the same machine, so there is no need, in fact it is wrong, to specify the backend route as localhost:4000.  Again, the same production code is going to think react and express are on the same machine.

- Idea: we purchase a domain and when that domain is hit, we configure Ubuntu (NGINX) serves up the react home page. We proceeds to forward (using NGINX) anything that starts with the /api to the express application.  So everything goes through NGINX.

---------------

- One change when copied to the production level from the local application.  When we set port = process.env.port || 4000, we are prepping the application for production already.

- One change that is crucial we need to make is in the the front end apis folder.  Since on the production level, Ubuntu is going to think the requests are coming from the same server, we need to change the baseURL in RestaurantFinder.js.  Again, on production, the localhost is not going to be reachable.  So we need to code: on production, we need to use one URL and if on development, we hit localhost.  And the NODE_ENV is the variable that makes that determination.


---------------
Now we are onto AWS: (reference here: https://github.com/Sanjeev-Thiyagarajan/PERN-STACK-DEPLOYMENT)

-Search for EC2, and we set up key pair to SSH/Connect to the EC2 instance.  So on the left window pane, click Key Pairs, create a key pair and store the pem file on our local machine.

-Click on instances and click launch instances and search for Ubuntu, deploy on Ubuntu 20.04, select t2.micro then configure instance details, then 
 Add Tags of 'Name : YelpApp' then launch, then choose an existing key pair previously created.  YelpApp in this case.  Lastly Launch instance.

-Go back to instances and wait till it says running(deployed).  Open up terminal.  Point it at the directory for which the .pem file is stored, make it so that it is only readable by the owner: chmod 400 xxxxx.pem 

-Next run ssh -i 'drag the pem file here' ubuntu@0.0.0.0, replace the 0.0.0.0 by the ip address of the ec2 instance.  If successful, we should see the terminal now pointing at ubuntu@ip-0-0-0-0:

-Next we update all packages: sudo apt update && sudo apt upgrade -y

-Next we install postgres: sudo apt install postgresql postgresql-contrib -y

-Next, if we try to run psql, it will say the user ubuntu does not exist.  Note that Postgres during installation created a user called 'postgres' and we need to connect to postgres by using this user, so we switch to the postgres user and run psql:

-sudo -i -u postgres
-psql

-Now we can create an ubuntu user in the postgres database: \q to quit out of the postgres user then createuser --interactive
-specify the name of the user: 'ubuntu'

-We check to make sure ubuntu as a user is created by: -psql and then \du

------
Login in using the newly created ubuntu user: \q => exit => whoami => psql -d postgres (-d flag allows us to specify the database to connect to, which in this case is postgres)

So after the above, we are logged in to postgres database as the user ubuntu! (\conninfo to reveal connection info)

-to create a password for the ubuntu user: ALTER user ubuntu PASSWORD 'root123';

-the set up is finished, now we create the schema for the db!

-------
We now try to migrate/create the DBs to postgres.  We can use the tool pg_dump to dump the db and import it to another postgres db.

-open a terminal pointing at a folder for which to store the data dump.  Type in: pg_dump -U postgres -f yelp.pgsql -C yelp (log in to postgres user, -f specifies a file we wish to dump the data to, which is yelp.psql, -C specifies that we want the create database commands in the dump and lastly, yelp specifies he database we wish to retrieve the data from. 

-Now we should have a file in the folder and we need to take that file and copy it over to the Ubuntu server. Copy the yelp.pgsql file to the production server:
-scp -i [path to pem file] [path to yelp.pgsql] username@[server-ip]:[directory to copy file to] and as an example: scp -i yelp.pem yelp.pgsql ubuntu@1.1.1.1:/home/ubuntu/

-Check that the file got copied successfully, in the ssh: cd ~ => cd /home/ubuntu => ls and we should see a yelp.pgsql

-Now we create the db using the file: we first make a db in the postgres server: psql -d postgres => create database yelp;
-Then quit out of the db => \q then to insert what we have in yelp.pgsql to the yelp Database => psql yelp < /home/ubuntu/yelp.pgsql

------- 
to check: psql -d yelp => \d => select * from restaurants;  Also note the default port for postsql is 5432.

-------
Next step is to copy our application code into our production server! (first quit out of the server)
-make a new directory on the ubuntu server: mkdir apps => cd apps => mkdir yelp-app => cd yelp-app, then copy code from our repo to our ubuntu server:
git clone [link] .  (do not forget about the space and the dot!)

-We now need to install node on our Ubuntu server.
Here is the link with the terminal commands, make sure this is done in the ssh connected to Ubuntu:
https://github.com/nodesource/distributions/blob/master/README.md

first command: curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
second command: sudo apt-get install -y nodejs

-------
-Now install the node modules in the server and client folders: run npm i on both folders.

-Next we use a process manager, and what this does is that if our app crashes, it will restart for us and also if there was a power outage on the aws server, it will automatically restart our node app on reboot.  So we install by: sudo npm install pm2 -g

-Next we start our node app using pm2: cd ~ => pm2 start apps/yelp-app/server/server.js
Note to stop a process, we do: pm2 stop 0, 0 corresponds to the id.  Also note we can spin up as many servers as we want by using the previous command.
To delete a process, we do pm2 delete 0.

To give our backend a proper name in the pm2 manager, we pass it a name flag: --name yelp-app

Lastly, we configure pm2 to automatically restart the application if the aws server reboots: => pm2 startup
Then with the returned sudo command, copy and paste it and hit enter (sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u ubuntu --hp /home/ubuntu)

Then pm2 startup is configured, to run when server reboots, once all the apps are enabled we run the command: pm2 save
And that saves all the apps currently running and will automatically power on all the processes when Ubuntu is powered back up

To test: sudo reboot => wait a little while and connect back to the ec2 server: ssh -i [.pem file location] ubuntu@1.1.1.1. => pm2 status and we should see the app is back online!

-------------
Now we move on to the front end:
- point the ssh to the client folder and run npm i to install all dependencies.
- Next we wish to do npm run build, then cd into the build folder and we should see an index.html page.  We will configure out EGINX to point to this index.html to serve up the front end to the client.

- Next we install nginx: sudo apt install nginx -y
- We configure nginx to be powered on whenever the system reboots: sudo systemctl enable nginx
- To verify: systemctl status nginx and check running active and .service is enabled.  (When the machine powers on, it brings nginx online as well).

-------------
Now configure nginx:
-Go back to root level: cd ~ => cd /etc/nginx/ => cd sites-available/ => ls

-We should see a default folder.  It is a server block and it processes the http/https requests.  To see this work, go to aws console, select the instance and under security groups, select launch-sizard-1(or 2 or 3), then hit edit inbound rules.  Add rule: allow http and allow https from any address (i.e. 0.0.0.0) and save.

-We then navigate to the public IP of this instance and should see: Welcome to nginx! and etc.... so this is being handled by the default server block in sites-available!

-We investigate the server block by typing the command: cat default.

A few words on the default server block:
  - server listens on port 80. (ipv4) 
  - on ipv6 (the most recent internet protocol), it listens on port 80 as well (listen[::])
  - Now the default_server option says if the server gets a request and it does not match any of the server block, then it will default to the one with the   
    default_server flag.
  - root /var/www/html tells the server what to return to the client initially, to investigate => cd /var/www/html/ => cat index.nginx-debian.html (One can see 
    the actual homepage code for nginx.
  - Then there is a list of files that nginx will look for to serve: index, index.html, index.htm and etc.  All we need is index.html so we are ok there!
  - Then the server_name_; this here just specifies the domain name of the application.  If we have a domain name, this is where we would put it.  The underscore 
    tell nginx that all requests reaches this server will be handled by this default block.
  - location /{} says if some route is not found, then we serve the 404 error.
 
--------------
Now we configure our file telling nginx what to do.

- We may as well copy default over to jee.digital (my cheap domain set up to test the deployment) => sudo cp default jee.digital
- We use a text editor: sudo vi jee.digital
- specify the root to point to the build folder: /home/ubuntu/apps/yelp-app/client/build;
- pass in jee.digital and www.jee.digital to the server_name specification, or we just put in the actual ip address of the machine.
- save the file by pressing esc and :wq then enter
- lastly, we wish to deploy those configuraions: sudo ln -s /etc/nginx/sites-available/jee.digital /etc/nginx/sites-enabled/
- then for the changes to take effect, we restart nginx: sudo systemctl restart nginx
- Now to check, we put the ip address on chrome and that should take the user directly to the index.html generated in the build folder!

--------------
Now we set up nginx for the backend:
-Reminder of what we want to do, if we get the root url, we want nginx to forward to react.  If we get requests that goes to /api, then we wish to forward to our express server.

So we copy and paste (usually a google search to get this):
         location /api {
            proxy_pass http://localhost:4000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
and insert it to our jee.digital server block.  This tells nginx that we will route /api to the localhost:3001 address.

-Also something that is singular to react, since it is a single page application, if we get a request that goes to /restaurants/2 to display the details of a restaurant, we need to have react handle that routing for us.  They are routes that actually changes the URL and react knows what page to load and where to go to retrieve the information for that page.  So the following code block specifies, all other requests, go try react.
        location / {
                try_files $uri /index.html;
        }
Now when we try a route like /restaurants/2, then we do not get a 404 error.  Nothing shows up on screen because the database isn't hooked up.

------------
Next we set up the environment variables for our server, to set up individual environment variables:
- export TEST="hello"
- To print out our environment variables => printenv or printenv | grep -i test (to find a specific one).
- to remove an environment variable, unset [name]
- to import environment variables from a file:
- step 1: go to home directory and create a file called it .env. (does not matter the directory, preferably not in our application code)
- vi .env
- step 2: copy and paste the .env file content on to the ubuntu server. (note to add export at the start of each variable and the values should be in quotations)
- go back to the directory and use => source .env => printenv | grep -i pg (to test)
- step 3: Now inserting export at the start of each environment variable and putting quotations around its value can     become too tedious a task when there are many to be loaded.  One way around this is to copy and paste the content 
  from the local env and use the following command (make sure we are pointing at the directory where the .env file is   located):=> set -o allexport; source .env; set +o allexport (we can then check they are loaded: printenv | grep -i     pg)

-----------

-One big issue, the environment variables do not persist through reload!  One can test it by just rebooting the server: sudo reboot => log back in to ubuntu and do a (printenv | grep pg) and we will see that the environment variables are all gone.

-The trick here is save the env variables to the .profile or the .bashrc, we will use the .profile
-=>ls -la (print out all hidden files and we should see a .profile and a .bashrc file.
-=>vi .profile then go to the bottom of the file and paste in the following command: 
-=> set -o allexport; source /home/ubuntu/.env; set +o allexport
-To test, quit out of the shell and reconnect and do a printenv

-----------

Now we set up the firewall for Ubuntu
- sudo ufw satus
- sudo ufw allow ssh
- sudo ufw allow http
- sudo ufw allow https
- sudo ufw enable
- sudo ufw status

-----------
Next we set up ssl or HTTPS:

Step by Step procedure is linked here:https://certbot.eff.org/lets-encrypt/ubuntufocal-nginx.html
Follow the instruction and you will see the locked icon on chrome and the site is secured!

----------
Debug our database, currently the app is not working!



