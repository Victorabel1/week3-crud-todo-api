require('dotenv').config(); // to load environment variables from .env file
const express =require('express');
const app = express();

//Body parsing middleware
app.use(express.json()); 

//create database
let todos = [
  {id: 1, task: 'Learn Node.js', completed: false},
  {id: 2, task: 'Build CRUD API', completed: false},
  {id: 3, task: 'Learning Express', completed: false},
  {id: 4, task: 'Done Learning', completed: true},
]; // this is an array of object


//ROUTES
//get route
app.get('/todos', (req, res) => {
    res.status(200).json(todos); // get request to send array as json object not an ordinary tex
});

//Post route
app.post('/todos', (req, res) => {
    const newTodo = { id: todos.length + 1, ...req.body }; // Auto ID addition to continue in series
    todos.push(newTodo); //to add new items to the array in the in-memory data
    res.status(201).json(newTodo); //Echo back (sending as json)
});

//Patch or Update route - partial
app.patch('/todos/:id', (req, res) =>{
    const todo = todos.find((t) => t.id === parseInt(req.params.id)); //Array.find. parseInt is an inbuild function that is used to convert string to interger
    if (!todo) return res.status(404).json({message: 'Todo not Found'});
    Object.assign(todo, req.body); //Merge: e.g., {completed: true}. This will assign task and body but retain the existing id
    res.status(200).json(todo);
});


//Delete or Remove route
app.delete('/todos/:id', (req, res) =>{
    const id = parseInt(req.params.id);
    const initialLenght = todos.length;
    todos = todos.filter((t) => t.id !==id); //Array.filter() -non-destructive. Find todos not equal to our particular id
    if (todos.lenght ===initialLenght)
        return res.status(404).json({error: 'Not Found'});
    res.status(204).json({message: 'Todo Deleted Successfully'}); // can use res.status(204).send(); for a Silent success  
});

//another get route to return completed todos
app.get('/todos/completed', (req, res) =>{
    const completed = todos.filter((t) => t.completed);
    res.json(completed); //Custom read
});


// ASSIGNMENT: GET /todos/:id (Single read)
app.get('/todos/:id', (req, res) => {
    const todo = todos.find((t) => t.id === parseInt(req.params.id));
    if (!todo) return res.status(404).json({ message: 'Todo not Found' });
    res.status(200).json(todo);
});

// ASSIGNMENT: POST with Validation
app.post('/todos', (req, res) => {
    if (!req.body.task) {
        return res.status(400).json({ error: 'The "task" field is required.' });
    }     // Check if task exists
    const newTodo = { id: todos.length + 1, ...req.body };
    todos.push(newTodo);
    res.status(201).json(newTodo);
});

//ASSIGNMENT: GET /todos/active (BEFORE /todos/:id)
app.get('/todos/active', (req, res) => {
    const activeTodos = todos.filter((t) => !t.completed);
    res.status(200).json(activeTodos);
});


//error handler. In case there is an error gotten from server
app.use((err, req, res, next) => {
    res.status(500).json({error: 'Server Error'});
});

const PORT = process.env.PORT || 4000; //hide port number using env file and incase not written, fallback to 4000

app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
});

//Download, install and use Postman to test the API endpoints
//Use nodemon to auto restart server on every save