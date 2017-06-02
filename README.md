# Requirements
1. Node JS (v8.0) (V8 is required)
2. Mysql (Ver 14.14 Distrib 5.7.18) (Recommended, not required);


# Instructions
  Created a script file for auto installing node and mysql for MAC environment

  1. just run `bash install_requirements` to install requirements
  2. Then please change `config.js` file and fill your mysql password;
  3. Lastly, run `npm start`.

  Then, application will be running on [localhost:8080](http://localhost:8080)

  ### Manual installing
  1. brew update
  2. brew doctor
  3. brew install mysql
  4. mysql.server restart
  5. mysql -u root -p -e "create database wave_test"
  6. brew install node@8


# Description
  Implemented dynamic front-end and back-end application using plain javascript(jquery as well), node.js and mysql.

  Instead of classic sql queries, I used `sequelize.js` to syncronize mysql into nodejs. This way, I could use more readable queries which is similar to mongo queries(native mongo, mongoose).

  Used asyncronous methods and error handlers...

  Proper project structure...

  Easy setup...

  Slightly better front-end design.

  Dynamic, reusable and readable functions...

  Ecmascript 6 and building tool...
