const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const PORT = process.env.PORT || 3000;

// Skapa en MySQL-anslutning
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "annan"
});

// Anslut till MySQL-databasen
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL database as id ' + connection.threadId);
});

// Middleware för att tolka JSON-data i request body
app.use(bodyParser.json());

// GET - Hämta alla resurser
app.get('/users', (req, res) => {
    connection.query("SELECT * FROM users", (error, results, fields) => {
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        res.json(results);
    });
});

// GET - Hämta en specifik resurs baserad på ID
app.get('/users/:id', (req, res) => {
    const id = req.params.id;
    connection.query("SELECT * FROM users WHERE id = ?", [id], (error, results, fields) => {
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        if (results.length === 0) {
            res.status(404).json({ error: "Resource not found" });
            return;
        }
        res.json(results[0]);
    });
});

// POST - Skapa en ny resurs
app.post('/users', (req, res) => {
    const { name } = req.body;
    if (!name) {
        res.status(400).json({ error: "Name is required" });
        return;
    }
    connection.query("INSERT INTO users (name) VALUES (?)", [name], (error, results, fields) => {
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        res.json({ id: results.insertId, name: name });
    });
});

// PUT - Uppdatera en befintlig resurs baserad på ID
app.put('/users/:id', (req, res) => {
    const id = req.params.id;
    const { name } = req.body;
    if (!name) {
        res.status(400).json({ error: "Name is required" });
        return;
    }
    connection.query("UPDATE users SET name = ? WHERE id = ?", [name, id], (error, results, fields) => {
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        if (results.affectedRows === 0) {
            res.status(404).json({ error: "Resource not found" });
            return;
        }
        res.json({ id: id, name: name });
    });
});

// POST - Inloggning (placeholder)
app.post('/login', (req, res) => {
    // Implementera inloggning här
    // Returnera lämplig HTTP-status och användarinformation
});

// Dokumentation av API
app.get('/', (req, res) => {
    const documentation = `
        <h1>API Documentation</h1>
        <p>GET /users - Get all users</p>
        <p>GET /users/:id - Get user by ID</p>
        <p>POST /users - Create a new user</p>
        <p>PUT /users/:id - Update user by ID</p>
        <p>POST /login - User login</p>

        <p></p>

        <h2>GET /users - Get all users</h2>
<form action="/users" method="GET">
    <button type="submit">Get All Users</button>
</form>

<h2>GET /users/:id - Get user by ID</h2>
<form action="/users/" method="GET">
    <label for="id">User ID:</label>
    <input type="text" id="id" name="id">
    <button type="submit">Get User By ID</button>
</form>

<h2>POST /users - Create a new user</h2>
<form action="/users" method="POST">
    <label for="username">Name:</label>
    <input type="text" id="username" name="name">
    <label for="email">Email:</label>
    <input type="email" id="email" name="email">
    <label for="password">Password:</label>
    <input type="password" id="password" name="password">
    <button type="submit">Create User</button>
</form>

<h2>PUT /users/:id - Update user by ID</h2>
<form action="/users/" method="PUT">
    <label for="updateUserId">User ID:</label>
    <input type="text" id="updateUserId" name="id">
    <label for="updateUserName">New Name:</label>
    <input type="text" id="updateUserName" name="name">
    <label for="updateUserEmail">New Email:</label>
    <input type="email" id="updateUserEmail" name="email">
    <label for="updateUserPassword">New Password:</label>
    <input type="password" id="updateUserPassword" name="password">
    <button type="submit">Update User</button>
</form>

<h2>POST /login - User login</h2>
<form action="/login" method="POST">
    <label for="loginName">Name:</label>
    <input type="text" id="loginName" name="name">
    <label for="loginPassword">Password:</label>
    <input type="password" id="loginPassword" name="password">
    <button type="submit">Login</button>
</form>
    `;
    res.send(documentation);
});


// Starta servern
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
