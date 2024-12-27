// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
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
    db.Todo.findAll({}).then(function(dbTask) {
      // We have access to the tasks as an argument inside of the callback function
      var hbsObject = {
        tasks: dbTask
      };
      // We have access to the new todo as an argument inside of the callback function
      res.render("index", hbsObject);
    });
  });

  // POST route for saving a new todo
  app.post("/api/tasks", function(req, res) {
    // create takes an argument of an object describing the item we want to
    // insert into our table. In this case we just we pass in an object with a text
    // and complete property (req.body)
    db.Task.create({
      task_name: req.body.task_name,
      task_description: req.body.task_desc,
      due_date: req.body.due_date,
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

  // DELETE route for deleting tasks. We can get the id of the todo to be deleted from
  // req.params.id
  app.delete("/api/tasks/:id", function(req, res) {
    // We just have to specify which todo we want to destroy with "where"
    db.Task.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(dbTask) {
      res.json(dbTask);
    });

  });

  // PUT route for updating tasks. We can get the updated todo data from req.body
  app.put("/api/tasks", function(req, res) {

    // Update takes in an object describing the properties we want to update, and
    // we use where to describe which objects we want to update
    db.Task.update({
      task_name: req.body.task_name,
      task_description: req.body.task_desc,
      due_date: req.body.due_date,
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
