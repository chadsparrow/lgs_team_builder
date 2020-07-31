# Team Builder - A 'KitOrder' Replacement application

[![pipeline status](https://gitlab.com/garneau-dev/sugoi/team-builder/badges/develop/pipeline.svg?style=flat)](https://gitlab.com/garneau-dev/sugoi/team-builder/commits/develop)

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
  - SES_SMTP=`insert aws smtp`
  - SES_PORT=`insert aws port`
  - SES_AUTH_USERNAME=`insert aws accesskey id`
  - SES_AUTH_PASSWORD=`insert aws secret key id`

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

This will download the latest development docker image for the backend.

> commits pushed to Gitlab initiates the`.gitlab-ci.yml` file in the `root` directory and runs a CI/CD pipeline to create and replace images in the project image repository found here: [Gitlab Container Registry](https://gitlab.com/garneau-dev/sugoi/team-builder/container_registry)
>
> - commits pushed to the `master` branch using a tag _`(git tag v1.0.0)`_ will create an image with the version tag and overwrite the `latest` image. You can then always use the `latest` image in production, and have means to roll back to a previous tagged image when needed.
> - commits pushed to `develop` branch - image is created with `develop` tag

Once the docker-compose is complete you will have a docker container running on your machine. A Node.js backend on the port you specified using the `PORT` env variable.

A root user is created on the MongoDB Atlas cloud provider using the email/password combo you also specified in the env file above.

The Node.js backend container will automatically connect to the MongoDB Atlas Cloud and be ready to transmit requested data.

> Download and install `MongoDB Compass` for a really great and easy to use UI application to work with MongoDB Atlas. You can use the username & password specified in the env file to login.

[MongoDB Compass](https://www.mongodb.com/products/compass)

### Next you will start up the front-end Vue.js development server by:

```bash
npm run client-dev
```

Navigate, in your browser, to [http://localhost:8080/](http://localhost:8080) and it should give you the main login screen of the application, which you can then login to using the email & password set in your env file.

> Any changes made in the folder `'client/src'` will trigger the frontend to be rebuilt and automatically update live. As there is volume created pointing the containers files to the localhost repository files.

> Any changes made in the `root` folder will trigger Node.js to restart the server (using nodemon).

---

When you are finished and want to close down development, simply navigate to the `root` folder and run:

```bash
  docker-compose -f docker-compose-dev.yml down --rmi all
```

This will shut down all the Node.js container and delete the image so you are forced to download the most up-to-date image from the repository.

If you have any troubles or questions, feel free to contact Chad Sparrow (csparrow@sugoi.com)

Gitlab Runner created on WebSrv02 (Staging) using a docker executor - testing gitlab env vars
