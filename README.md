# Team Builder - A 'KitOrder' Replacement application

[![pipeline status](https://gitlab.com/garneau-dev/sugoi/team-builder/badges/develop/pipeline.svg)](https://gitlab.com/garneau-dev/sugoi/team-builder/commits/develop) [![coverage report](https://gitlab.com/garneau-dev/sugoi/team-builder/badges/develop/coverage.svg)](https://gitlab.com/garneau-dev/sugoi/team-builder/commits/develop)

### local-dev Setup instructions

- Make sure to have Node.js installed on your machine.
- Clone the repository to your local machine and switch to the `develop` branch
- Make two copies of the `.env.example` file in the root folder and title them `.env` and `.env.development`
- Fill in the following variables in the both files: (.env is used for the docker-compose file, .env.development is used for the containers during compose)

  - MONGO_INITDB_ROOT_USERNAME=`set as a root admin user name (anything you like)`
  - MONGO_INITDB_ROOT_PASSWORD=`any string for a password`
  - MONGO_INITDB_ROOT_ADMINSOURCE=`admin`
  - MONGO_INITDB_ROOT_EMAIL=`root user login email`
  - MONGO_INITDB_ROOT_PORT=`port for your DB (ie. 27018)`
  - MONGO_INITDB_ROOT_DB=`name of db to use (ie. teambuilder-dev)`
  - PORT=`port for the backend (ie. 5000)`
  - JWT_PRIVATE_KEY=`string used for encrypting/decrypting json web tokens`
  - GEOCODER_PROVIDER=`obtain geocoder API key and insert provider name here (ie. mapquest)`
  - GEOCODER_API_KEY=`insert GEOCODER API KEY from above provider here`
  - TIMEZONEDB_KEY=`obtain API from timezonedb.com and insert here`

  - _\* request API keys from Chad Sparrow [csparrow@sugoi.com](mailto:csparrow@sugoi.com) if needed_

---

### Installing Node.js Dependancies using Node Package Manager (NPM)

In order for the application and front end to run you'll need to then install all the dependancies listed in the `package.json` files in both the `root` folder _(backend)_ and the `client` folder _(frontend)._ which is super simple.

Use your terminal and navigate to the `root` folder where you'll will find the file `package.json`. It will be the same folder that you will find the application main entry file `index.js`. Once there, issue the following command:

```bash
  npm install
```

Once that is fully complete you should now have a `node_modules` folder in the `root`. Navigate to the `client` folder and issue the same _`npm install`_ command to also obtain the `'node_modules'` folder there as well.

When that is complete, navigate back to the `root` folder and issue the command:

```bash
  docker-compose -f docker-compose-dev.yml up -d
```

This will download the official MongoDB docker image, as well as the latest development docker image for the backend.

> commits pushed to Gitlab initiates the`.gitlab-ci.yml` file in the `root` directory and runs a CI/CD pipeline to create and replace images in the project image repository found here: [Gitlab Container Registry](https://gitlab.com/garneau-dev/sugoi/team-builder/container_registry)
>
> - commits pushed to the `master` branch using a tag _`(git tag v1.0.0)`_ will create an image with the version tag and overwrite the `latest` image. You can then always use the `latest` image in production, and have means to roll back to a previous tagged image when needed.
> - commits pushed to `develop` branch - image is created with `develop` tag

Once the docker-compose is complete you will have two docker containers running on your machine, one being the Node.js backend on the port you specified using the `PORT` env variable, and the MongoDB Database on the port you specified using the `MONDODB_INIT_ROOT_PORT` env variable.

A root user is created on the MongoDB container using the email/password combo you also specified in the env file above.

The Node.js backend container will automatically connect to the MongoDB container and be ready to transmit requested data.

All development mongoDB data is persisted to a volume created on your system by `volumes:` in the `docker-compose-dev.yml` file which you can view with:

```bash
  docker volume ls
```

##### \*\* DO NOT USE: _`'docker volume prune'`_ unless you have the containers running or you will lose all your development data.

> Highly recommend downloading and installing `Kitematic` to be able to view each container and its logs live without having to constantly issue docker commands to see them. Also download and install `MongoDB Compass` for a really great and easy to use UI application to work with MongoDB. You can use the username & password specified in the env file to login.

Next you will start up the front-end Vue.js development server by:

```
npm run client-dev
```

Navigate, in your browser, to [http://localhost:8080/](http://localhost:8080) and it should give you the main login screen of the application, which you can then login to using the email & password set in your env file.

> Any changes made in the folder `'client/src'` will trigger the frontend to be rebuilt and automatically update live.

> Any changes made in the `root` folder will trigger Node.js to restart the server (using nodemon).

---

When you are finished and want to close down development, simply navigate to the `root` folder and run:

```bash
  docker-compose -f docker-compose-dev.yml down --rmi all
```

This will shut down all the containers and delete all the images related to the app, so that you force to download the most up-to-date image from the repository.

> Volumes _(persisted data)_ are left behind and will stay until you prune or remove them.

If you have any troubles or questions, feel free to contact Chad Sparrow (csparrow@sugoi.com)
