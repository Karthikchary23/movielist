import db from './connect.js';

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
app.use(express.json());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin: '*'
}));

app.get('/', (req,res) => {
    console.log("Working API");
    res.send("Welcome to Movies WatchList API's");
});
app.delete('/delete-movie/:movie_id', (req,res) => {
    const { movie_id } = req.params;
    if (!movie_id) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    res.set('Content-Type', 'application/json');
    const sql = `DELETE FROM Movies WHERE movie_id = ?`;
    const params = [movie_id];
    try{
        db.run(sql,params, (err) => {
            if (err) {
                console.log("Error Deleting Movie: "+ err.message);
                res.status(500).send({error: err.message});
                return;
            }
            let data = { message: "Movie Deleted Successfully"};
            res.status(201).send(JSON.stringify(data))
        })
    } catch(err) {
        console.log("Error Deleting Movie: "+ err.message);
        res.status(500).send({error: err.message});
    }
})

app.get('/get-all-movies', (req,res) => {
    res.set('Content-Type', 'application/json');
    const sql = `SELECT * FROM Movies`;
    console.log("Fetching Movies");
    console.log(sql);
    let data = [];
    try{
        db.all(sql, [], (err,rows) => {
        if(err) {
            
            console.log("Error Fetching Movies: "+ err.message);
            res.status(500).send({error: err.message});
            return;
        }
        rows.forEach((row)=> {
            data.push({
                movie_id: row.movie_id,
                movie_title: row.contact_name,
                movie_director: row.movie_director,
                movie_genre: row.movie_genre,
                movie_release_year: row.movie_release_year,
                movie_poster_url: row.movie_poster_url,
                movie_is_watched: row.movie_is_watched,
                movie_created_at: row.movie_created_at
            });
        })
        const content = JSON.stringify(data);
        console.log("Movies Fetched Successfully");
        console.log(content);
        res.status(200).send(content);
    })
    } catch(err) {
        console.log("Error Fetching Movies: "+ err.message);
        res.status(500).send({error: err.message});
    }
})


app.post('/add-movie', (req,res) => {
    const { movie_id,movie_title,movie_director,movie_genre,movie_release_year,movie_poster_url,movie_is_watched=false } = req.body;
    if (movie_id == null || movie_title == null || movie_director == null || movie_genre == null || movie_release_year == null || movie_poster_url == null) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    res.set('Content-Type', 'application/json');
    const sql = `INSERT INTO Movies (movie_id,movie_title,movie_director,movie_genre,movie_release_year,movie_poster_url,movie_is_watched) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const params = [movie_id,movie_title,movie_director,movie_genre,movie_release_year,movie_poster_url,movie_is_watched];
    try{
        db.run(sql,params, (err) => {
            if (err) {
                console.log("Error Adding Movies: "+ err.message);
                res.status(500).send({error: err.message});
                return;
            }
            let data = { message: "Movie Added Successfully"};
            res.status(201).send(JSON.stringify(data))
        })
    } catch(err) {
        console.log("Error Adding Movies: "+ err.message);
        res.status(500).send({error: err.message});
    }
})

app.get('/get-movie/:movie_id', (req,res) => {
    const { movie_id } = req.params;
    console.log("Fetching Movie with ID: "+ movie_id);
    if (!movie_id) {
        console.log('no movie_id');
        return res.status(400).json({ error: 'Missing required fields' });
    }
    res.set('Content-Type', 'application/json');
    const sql = `SELECT * FROM Movies WHERE movie_id = ?`;
    let data = [];
    try{
        db.all(sql, [movie_id], (err,rows) => {
        if(err) {
            console.log("Error Fetching Movie: "+ err.message);
            res.status(500).send({error: err.message});
            return;
        }
        rows.forEach((row)=> {
            data.push({
                movie_id: row.movie_id,
                
                movie_title: row.movie_title,
                movie_director: row.movie_director,
                movie_genre: row.movie_genre,
                movie_release_year: row.movie_release_year,
                movie_poster_url: row.movie_poster_url,
                movie_is_watched: row.movie_is_watched,
                movie_created_at: row.movie_created_at
            });
        })
        const content = JSON.stringify(data);
        // console.log("Movie Fetched Successfully");
        // console.log(JSON.parse(content));
        res.status(200).send(content);
    })
    } catch(err) {
        console.log("Error Fetching Movie: "+ err.message);
        res.status(500).send({error: err.message});
    }
});

app.put('/update-movie', (req,res) => {
    const { movie_id, movie_title, movie_director, movie_genre, movie_release_year, movie_poster_url, movie_is_watched = false } = req.body;
    if (movie_id == null || movie_title == null || movie_director == null || movie_genre == null || movie_release_year == null || movie_poster_url == null) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    res.set('Content-Type', 'application/json');
    const sql = `UPDATE Movies SET movie_title = ?, movie_director = ?, movie_genre = ?, movie_release_year = ?, movie_poster_url = ?, movie_is_watched = ? WHERE movie_id = ?`;
    const params = [movie_title, movie_director, movie_genre, movie_release_year, movie_poster_url, movie_is_watched, movie_id];
    try {
        db.run(sql, params, (err) => {
            if (err) {
                console.log("Error Updating Movie: " + err.message);
                res.status(500).send({ error: err.message });
                return;
            }
            let data = { message: "Movie Updated Successfully" };
            res.status(201).send(JSON.stringify(data));
        });
    } catch (err) {
        console.log("Error Updating Movie: " + err.message);
        res.status(500).send({ error: err.message });
    }
})

app.delete('/delete-movie', (req,res) => {
    const { movie_id } = req.body;
    if (!movie_id) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    res.set('Content-Type', 'application/json');
    const sql = `DELETE FROM Movies WHERE movie_id = ?`;
    const params = [movie_id];
    try{
        db.run(sql,params, (err) => {
            if (err) {
                console.log("Error Deleting Movie: "+ err.message);
                res.status(500).send({error: err.message});
                return;
            }
            let data = { message: "Movie Deleted Successfully"};
            res.status(201).send(JSON.stringify(data))
        })
    } catch(err) {
        console.log("Error Deleting Movie: "+ err.message);
        res.status(500).send({error: err.message});
    }
})

app.listen(4000, () => {
    console.log("Server is running on port 3000");
})

