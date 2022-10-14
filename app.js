
const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const dbPath = path.join(__dirname, "userData.db");
const bcrypt = require("bcrypt");

const app = express();



app.use(express.json());
const database = null;

const initializeDbAndServer = async () => {
  try {
    database = await open({
        filename: dbPath,
        driver: sqlite3.Database
    });
    app.listen(3000, () =>
      console.log("server is running at http://localhost:3000")
    );
  } catch (e) {
    console.log(`Error Message: ${e.message}`);
    process.exit(1);
  }
};
initializeDbAndServer();

app.post("/register", async (request, response) => {
  const { username, name, password, gender, location } = request.body;
  const encryptPassword = await bcrypt.hash(password, 10);
  const getUserQuery = `SELECT * FROM user WHERE username = '${username}'`;
  const userDb = await database.get(getUserQuery);

  if (databaseUser === undefined ){
      const createUserQuery = `INSERT INTO user (username, name, password, gender, location) VALUES
      ('${username}', '${name}', '${encryptPassword}', '${gender}', '${location}');`;
        if (password.length > 4) {
            await database.run(createUserQuery);
            response.status(200);
            response.send("User created successfully");
        }else{
            response.status(400)
            response.send("Password is too short");
  } else {
      response.status(400);
      response.send("User already exits");
    }
  }
});

app.post("/login", async (request, response) => {
  const { username, password } = request.body;
  const encryptPassword = await bcrypt.hash(password, 10);
  const getUserQuery = `SELECT * FROM user username = '${username}'`;
  const userDb = await database.get(getUserQuery);
  if (username === undefined) {
    response.status(400);
    response.send("Invalid user");
  } else {
    const passwordCheck = await bcrypt.compare(password, userDb.password);
    if (passwordCheck === true) {
      response.status(200);
      response.send("Login success!");
    } else {
      response.status(400);
      response.send("Invalid password");
    }
  }
});

app.put("/change-password", (request, response) => {
    const { username, oldPassword, newPassword} = request.body;
    const userQuery = `SELECT * FROM user WHERE username = '${username}'`;
    const userDb = await database.get(userQuery);
    const encryptPassword = await bcrypt.hash(password, 10);
    const passwordCheck = await bcrypt.compare(password, userDb.password);
    if (userDb === undefined){
        response.status(400)
        response.send("Invalid user");
    }else {
        if (passwordCheck === true){
            if(password.length > 4){
                const hashedPassword = await bcrypt.hash(newPassword, 10);
                const updatedPasswordQuery = `UPDATE user SET password = '${hashedPassword}' WHERE username = '${username}';`;
                const user = await database.run(updatedPasswordQuery);
                response.send("Password updated");
            }else{
                response.status(400);
                response.send("Password is too short");
            }
        }else {
            response.status(400);
            response.send("Invalid current password");
        }


    }
    
})

module.exports = app;