# mvcwithsequelize
* To create mvc application use the following steps.
1) create the config folder and within the folder create the 'connection.js' file(see the content of this file below).
```javascript
// Dependencies
var Sequelize = require("sequelize");

// Creates mySQL connection using Sequelize, the empty string in the third argument spot is your password. This will create the `sequelize_task` database for your application
var sequelize = new Sequelize("sequelize_task", "root", "", {
  host: "localhost",
  port: 3306,
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

// Exports the connection for other files to use
module.exports = sequelize;

```
2) Create "models" folder and add the required model definitions for your application. Below is the code for "task" model.
```javascript
// Dependencies
// =============================================================

// This may be confusing but here Sequelize (capital) references the standard library
var Sequelize = require("sequelize");
// sequelize (lowercase) references our connection to the DB.
var sequelize = require("../config/connection.js");

// Creates a "Task" model that matches up with DB
var Task = sequelize.define("task", {
  task_name: Sequelize.STRING,
  task_description: Sequelize.TEXT,
  due_date: Sequelize.DATE, 
  status : Sequelize.STRING
});

// Syncs with DB
Task.sync();

// Makes the Task Model available for other files (will also create a table)
module.exports = Task;

```
3) Create the "controllers" folder and add the controllers for each of your models. Below is the code for the "taskControllers" for the task model.

```javascript
// *********************************************************************************
// taskControllers.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Requiring our models
var db = require("../models");

// Routes
// =============================================================
module.exports = function(app) {

  // GET route for getting all of the tasks
  app.get("/api/tasks", function(req, res) {
    // findAll returns all entries for a table when used with no options
    db.Task.findAll({}).then(function(dbTask) {
      // We have access to the tasks as an argument inside of the callback function
      var hbsObject = {
        tasks: dbTask
      };
      // We have access to the new task as an argument inside of the callback function
      res.render("index", hbsObject);
    });
  });

  // POST route for saving a new task
  app.post("/api/tasks", function(req, res) {
    // create takes an argument of an object describing the item we want to
    // insert into our table. In this case we just we pass in an object with a text
    // and complete property (req.body)
    db.Task.create({
      task_name: req.body.tname,
      task_description: req.body.tdesc,
      due_date: req.body.ddate,
      status: req.body.status
    }).then(function(dbTask) {
      res.json({ id: dbTask.insertId });
    })
      .catch(function(err) {
      // Whenever a validation or flag fails, an error is thrown
      // We can "catch" the error to prevent it from being "thrown", which could crash our node app
        res.json(err);
      });
  });

  // DELETE route for deleting tasks. We can get the id of the task to be deleted from
  // req.params.id
  app.delete("/api/tasks/:id", function(req, res) {
    // We just have to specify which task we want to destroy with "where"
    db.Task.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(dbTask) {
      res.json(dbTask);
    });

  });

  // PUT route for updating tasks. We can get the updated task data from req.body
  app.put("/api/tasks", function(req, res) {

    // Update takes in an object describing the properties we want to update, and
    // we use where to describe which objects we want to update
    db.Task.update({
      task_name: req.body.tname,
      task_description: req.body.tdesc,
      due_date: req.body.ddate,
      status: req.body.status
    }, {
      where: {
        id: req.body.id
      }
    }).then(function(dbTask) {
      res.json(dbTask);
    })
      .catch(function(err) {
      // Whenever a validation or flag fails, an error is thrown
      // We can "catch" the error to prevent it from being "thrown", which could crash our node app
        res.json(err);
      });
  });
};

```
4) Create the "server.js"file and here is an example for the task application.
```javascript
// *********************************************************************************
// Server.js - This file is the initial starting point for the Node/Express server.
// *********************************************************************************

// Dependencies
// =============================================================
var express = require("express");

// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 8080;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static directory
app.use(express.static("public"));

// Set Handlebars.
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars")
// Routes
// =============================================================
require("./app/controllers/taskController.js")(app);

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
```