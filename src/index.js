const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;

  const user = users.find((user) => user.username === username);

  if (user) {
    request.user = user;
    next();
  } else {
      return response.status(404).json({ error: `Sorry, User ${username} not exists!` });
  }
}

function returnIndexTodoById(user, id) {
  return user.todos.findIndex((todo) => todo.id === id); 
}

app.post('/users', (request, response) => {
  // Complete aqui
  const { name, username } = request.body;

  if (users.some((user) => user.username === username)) {
    return response.status(400).json({ error: `Sorry, User ${username} already exists!` });
  }

  const user = {
    id :  uuidv4(),
    name,
    username,
    todos:[]
  }

  users.push(user);

  response.status(201).json(user);

});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui 
  const { user } = request;

  return response.status(200).json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;

  const { title, deadline } = request.body;

  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()

  }

  user.todos.push(todo);

  return response.status(201).json(todo);

});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { title, deadline } = request.body;
  const {id} = request.params;
  
  const todoIndex = returnIndexTodoById(user, id);

  if (todoIndex < 0) {
    return response.status(404).json({error: "Todo not found!"});
  }
  // DESSA FORMA, PERMITE QUE O USUÁRIO MUDE APENAS UM DOS DOIS ATRIBUTOS
  user.todos[todoIndex].title = title ? title : user.todos[todoIndex].title;
  user.todos[todoIndex].deadline = deadline ? new Date(deadline) : user.todos[todoIndex].deadline;

  return response.status(201).json(user.todos[todoIndex]);

});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { id } = request.params;

  const todoIndex = returnIndexTodoById(user, id);

  if (todoIndex < 0) {
    return response.status(404).json({error: "Todo not found!"});
  }
  
  user.todos[todoIndex].done = true;
  // user.todos = user.todos.map((todo) => todo.id === id ? {  ...todo, done: true } : todo);

  return response.json(user.todos[todoIndex]);

});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { id } = request.params;

  const todoIndex = returnIndexTodoById(user, id);

  if (todoIndex < 0) {
    return response.status(404).json({error: "Todo not found!"});
  }
  
  user.todos.splice(todoIndex, 1);

  return response.status(204).json(user.todos);

});

module.exports = app;