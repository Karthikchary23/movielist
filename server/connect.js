import sqlite3 from 'sqlite3';

const sql3 = sqlite3.verbose();

const db = new sql3.Database('./Database.db', (err) => {
    if (err) {
        console.log("Error Connecting Database: " + err.message);
        return;
    } else {
        console.log("Connected to Database");
    }
}) 

let sql = `Create Table IF NOT EXISTS Movies (
movie_id varchar(300) PRIMARY KEY ,
movie_title VARCHAR(500) NOT NULL,
movie_director TEXT NOT NULL,
movie_genre TEXT NOT NULL,
movie_release_year INTEGER NOT NULL,
movie_poster_url VARCHAR(200) NOT NULL,
movie_is_watched BOOLEAN DEFAULT FALSE,
movie_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`
db.run(sql,[], (err) => {
    if (err) {
        console.log("Error Creating Table: " + err.message);
        return
    } else {
        console.log("Table Created");
    }
})



export default db;