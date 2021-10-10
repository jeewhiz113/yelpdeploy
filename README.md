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
Now we are onto AWS:

-Search for EC2, and we set up key pair to SSH/Connect to the EC2 instance.  So on the left window pane, click Key Pairs, create a key pair and store the pem file on our local machine.

-Click on instances and click launch instances and search for Ubuntu, deploy on Ubuntu 20.04, select t2.micro then configure instance details, then 
 Add Tags of 'Name : YelpApp' then launch, then choose an existing key pair previously created.  YelpApp in this case.  Lastly Launch instance.


