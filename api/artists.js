const express = require("express");
const artistRouter = express.Router();
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database(
  process.env.TEST_DATABASE || "./database.sqlite"
);

artistRouter.param("artistId", (req, res, next, artistId) => {
  db.get(
    "SELECT * FROM Artist WHERE id = $artistId",
    { $artistId: artistId },
    (error, artist) => {
      if (error) {
        return next(error);
      }
      if (artist) {
        req.artist = artist;
        return next();
      } else {
        return res.sendStatus(404);
      }
    }
  );
});

artistRouter.get("/", (req, res, next) => {
  db.all(
    "SELECT * FROM Artist WHERE is_currently_employed = 1",
    (err, artists) => {
      if (err) {
        return next(err);
      }
      return res.status(200).json({ artists });
    }
  );
});

artistRouter.get("/:artistId", (req, res, next) => {
  res.send({ artist: req.artist });
});

artistRouter.post("/", (req, res, next) => {
  let name = req.body.artist.name;
  let dob = req.body.artist.dateOfBirth;
  let bio = req.body.artist.biography;
  let is_currently_employed = req.body.artist.is_currently_employed ? 1 : 0;

  if (!name || !dob || !bio) {
    return res.sendStatus(400);
  }

  const sql =
    "INSERT INTO Artist (name, date_of_birth, biography, is_currently_employed) VALUES ($name, $dateOfBirth, $biography, $isCurrentlyEmployed)";
  const values = {
    $name: name,
    $dateOfBirth: dob,
    $biography: bio,
    $isCurrentlyEmployed: is_currently_employed,
  };

  db.run(sql, values, function (error) {
    if (error) {
      return next(error);
    }

    db.get(
      `SELECT * FROM Artist WHERE Artist.id = ${this.lastID}`,
      (error, artist) => {
        res.status(201).json({ artist: artist });
      }
    );
  });
});

artistRouter.put("/:artistId", (req, res, next) => {
  let name = req.body.artist.name;
  let dob = req.body.artist.date_of_birth;
  let biography = req.body.artist.biography;
  let isCurrentlyEmployed = req.body.artist.is_currently_employed;

  if (!name || !dob || !biography || !isCurrentlyEmployed) {
    return res.sendStatus(400);
  }

  const sql =
    "UPDATE Artist SET name = $name, date_of_birth = $dateOfBirth, biography = $biography, is_currently_employed = $isCurrentlyEmployed WHERE id = $artistId";
  const values = {
    $name: name,
    $dateOfBirth: dob,
    $biography: biography,
    $isCurrentlyEmployed: isCurrentlyEmployed,
    $artistId: req.params.artistId,
  };

  db.run(sql, values, (error) => {
    if (error) {
      return next(error);
    }
    db.get(
      `SELECT * FROM Artist WHERE id = ${req.params.artistId}`,
      (error, artist) => {
        res.status(200).json({ artist: artist });
      }
    );
  });
});

artistRouter.delete("/:artistId", (req, res, next) => {
  const sql =
    "UPDATE Artist SET is_currently_employed = 0 WHERE id = $artistId";

  const values = {
    $artistId: req.params.artistId,
  };

  db.run(sql, values, (error) => {
    if (error) {
      return next(error);
    }

    db.get(
      `SELECT * FROM Artist WHERE id = ${req.params.artistId}`,
      (error, artist) => {
        res.status(200).json({ artist: artist });
      }
    );
  });
});

module.exports = artistRouter;
