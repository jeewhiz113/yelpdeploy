# yelpdeploy

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

