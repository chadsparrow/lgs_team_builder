# Team Builder - A 'KitOrder' Replacement application

[![pipeline status](https://gitlab.com/garneau-dev/sugoi/team-builder/badges/develop/pipeline.svg)](https://gitlab.com/garneau-dev/sugoi/team-builder/commits/develop) [![coverage report](https://gitlab.com/garneau-dev/sugoi/team-builder/badges/develop/coverage.svg)](https://gitlab.com/garneau-dev/sugoi/team-builder/commits/develop)

### How to get local-dev environment up and running.

- Make sure you have Node.js installed on your machine.
- Clone the repository to your local machine and switch to the `'develop'` branch
- Make a copy of the `'.env-example'` file in the root folder and title it `'.env-development'`
- Fill in the following variables in the `'.env-development'` file:

  - MONGO_INITDB_ROOT_USERNAME=`set as a root admin user name (anything you like)`
  - MONGO_INITDB_ROOT_PASSWORD=`any string for a password`
  - MONGO_INITDB_ROOT_ADMINSOURCE=`admin`
  - MONGO_INITDB_ROOT_EMAIL=`root user login email`
  - MONGO_INITDB_ROOT_PORT=`port for your DB (ie. 27018)`
  - MONGO_INITDB_ROOT_DB=`name of db to use (ie. 'teambuilder-dev')`
  - PORT=`port for the backend (ie. 5001)`
  - JWT_PRIVATE_KEY=`string used for encrypting/decrypting json web tokens`
  - NODE_ENV=`current node environment (ie. 'development')`
  - GEOCODER_PROVIDER=`obtain geocoder API key and insert provider name here (ie. 'mapquest')`
  - GEOCODER_API_KEY=`insert GEOCODER API KEY from above provider here`
  - TIMEZONEDB_KEY=`obtain API from timezonedb.com and insert here`

  - _\* request API keys from Chad Sparrow [csparrow@sugoi.com](mailto:csparrow@sugoi.com) if needed_

---

### Installing Node.js Dependancies using Node Package Manager (NPM)

In order for the application and front end to run you'll need to then install all the dependancies listed in the `'package.json'` files in both the `'root'` folder _(server)_ and the `'client'` folder _front-end._ which is super simple.

Use your terminal and navigate to the `''root'` folder where you'll will find the file `'package.json'`. It will be the same folder that you will find the application main entry file `'server.js'`. Once there, issue the following command:

```bash
  npm install
```

Once that is fully complete you should now have a `'node_modules'` folder in the `root`. Navigate to the `'client'` folder and issue the same `npm install` command to also obtain the `'node_modules'` folder there as well.

When that is complete, navigate back to the `root` folder and issue the command:

```bash
  docker-compose -f docker-compose-dev.yml up -d
```

This will download the official MongoDB docker image, as well as the latest development docker image for the backend.

> Everytime you push commits to Gitlab, Gitlab reads the `.gitlab-ci.yml` file in the `root` directory and creates a CI/CD pipeline which automatically creates and replaces images in the project image repository found here: [Gitlab Container Registry](https://gitlab.com/garneau-dev/sugoi/team-builder/container_registry)
>
> - commits pushed to the master branch using a tag _`(ie. git tag v1.0.0)`_ will create images with the `'v1.0.0'` and `'latest'` tags
> - commits pushed to develop branch - image is created with `'develop'` tag

Once the docker-compose is complete you will have two docker containers running on your machine, one being the Node.js backend on the port you specified using the `PORT` env variable, and the MongoDB Database on the port you specified using the `MONDODB_INIT_ROOT_PORT` env variable. A root user is created using the email/password combo you also specified in the env file above.
The Node.js backend container will automatically connect to the MongoDB container and be ready to transmit requested data.

MongoDB data is persisted to a volume created on your system by the `docker-compose-dev.yml` file which you can view with:

```bash
  docker volume ls
```

> I highly recommend downloading and installing `'Kitematic'` to be able to view each container and its logs live without having to constantly issue docker commands to see them. Also download and install `'MongoDB Compass'` for an really great UI application to work with MongoDB.

Next, navigate to the `'client'` folder in terminal and issue the command:

```bash
  npm run serve
```

This will spin up the front-end SPA which is built using `Vue.js` and will be available on port `'8080'`

Navigate in your browser to [http://localhost:8080/](http://localhost:8080) and it should give you the main login screen which you can then login to using the admin email & password set in your env file.

---

> Any changes made in the folder `'client/src'` will trigger the frontend to be rebuilt and automatically update live.

> Any changes made in the `root` folder will trigger Node.js to restart the server (using nodemon).

---

When you are finished simply run the command in the `root`folder

```bash
  docker-compose -f docker-compose-dev.yml down --rmi all
```

This will shut down all the containers and delete all the images related to the app, so that you force to download the most up-to-date image from the repository.
