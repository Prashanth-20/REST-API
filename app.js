const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "todoApplication.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

//GET Method

app.get("/todos/", async (request, response) => {
  const { status, priority, search_q } = request.query;
  const todoQuery = `
        SELECT 
            * 
        FROM 
            todo
        WHERE 
            status LIKE '${status}' OR 
            priority LIKE '${priority}'OR status LIKE '${status}' OR todo LIKE '%${search_q}%';`;

  const result = await db.all(todoQuery);
  response.send(result);
});

//GET Method

app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const getTodoQuery = `
    SELECT
      *
    FROM
      todo
    WHERE
      id LIKE ${todoId};`;
  const singleTodo = await db.all(getTodoQuery);
  response.send(singleTodo);
});

//POST Method

app.post("/todos/", async (request, response) => {
  const todoDetails = request.body;
  const { id, todo, priority, status } = todoDetails;

  const addTodoQuery = `
    INSERT INTO
      todo (id, todo, priority, status)
    VALUES
      (
         ${id},
        '${todo}',
        '${priority}',
        '${status}'
      );`;
  await db.run(addTodoQuery);
  response.send("Todo Successfully Added");
});

//PUT Method

app.put("/todos/:todoId", async (request, response) => {
  const { todoId } = request.params;
  const todosData = request.body;
  const { todo, priority, status } = todosData;

  const updateTodoQuery = `
   UPDATE
      todo
    SET
         todo = '${todo}',
         priority ='${priority}',
        status = '${status}'
    WHERE 
        id = ${todoId};`;

  await db.run(updateTodoQuery);
  response.send("Todo Updated");
});

//DELETE Method

app.delete("/todos/:todoId", async (request, response) => {
  const { todoId } = request.params;

  const deleteTodoQuery = `
    DELETE FROM todo
    WHERE id = ${todoId};`;
  await db.run(deleteTodoQuery);
  response.send("Todo Deleted");
});

module.exports = app;
