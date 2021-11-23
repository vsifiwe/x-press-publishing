const express = require("express");
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database(
  process.env.TEST_DATABASE || "./database.sqlite"
);
const issuesRouter = express.Router({ mergeParams: true });

issuesRouter.param("issueId", (req, res, next, issueId) => {
  db.get(
    "SELECT * FROM Issue WHERE id = $issueId",
    { $issueId: issueId },
    (error, issue) => {
      if (error) {
        return next(error);
      }
      if (issue) {
        return next();
      } else {
        return res.sendStatus(404);
      }
    }
  );
});

issuesRouter.get("/", (req, res, next) => {
  db.all(
    `SELECT * FROM Issue WHERE series_id = ${req.params.seriesId}`,
    (err, issues) => {
      if (err) {
        return next(err);
      }
      res.send({ issues });
    }
  );
});

issuesRouter.post("/", (req, res, next) => {
  const name = req.body.name;
  const issueNumber = req.body.issueNumber;
  const publicationDate = req.body.publicationDate;
  const artistId = req.body.artistId;

  if (!name || !issueNumber || !publicationDate || !artistId) {
    return res.sendStatus(400);
  }

  db.get(`SELECT * FROM Artist WHERE id = ${artistId}`, (error, artist) => {
    if (error) {
      return next(error);
    }
    if (artist) {
      const sql =
        "INSERT INTO Issue (name, issue_number, publication_date, artist_id, series_id) VALUES ($name, $issueNumber, $publicationDate, $artistId, $seriesId)";

      const values = {
        $name: name,
        $issueNumber: issueNumber,
        $publicationDate: publicationDate,
        $artistId: artistId,
        $seriesId: req.params.seriesId,
      };
      db.run(sql, values, (error) => {
        if (error) {
          return next(error);
        }

        db.get(
          `SELECT * FROM Issue WHERE id = ${this.lastID}`,
          (error, issue) => {
            res.status(201).json({ issue: issue });
          }
        );
      });
    } else {
      return res.sendStatus(400);
    }
  });
});

issuesRouter.put("/:issueId", (req, res, next) => {
  const name = req.body.name;
  const issueNumber = req.body.issueNumber;
  const publicationDate = req.body.publicationDate;
  const artistId = req.body.artistId;

  if (!name || !issueNumber || !publicationDate || !artistId) {
    return res.sendStatus(400);
  }

  db.get(`SELECT * FROM Artist WHERE id = ${artistId}`, (error, artist) => {
    if (error) {
      return next(error);
    }
    if (artist) {
      const sql =
        "UPDATE Issue SET name = $name, issue_number = $issue_number, publication_date = $publication_date, artist_id = $artist_id, series_id = $series_id WHERE id = $id";

      const values = {
        $name: name,
        $issue_number: issueNumber,
        $publication_date: publicationDate,
        $artist_id: artistId,
        $series_id: req.params.seriesId,
        $id: req.params.issueId,
      };
      db.run(sql, values, (error) => {
        if (error) {
          return next(error);
        }

        db.get(
          `SELECT * FROM Issue WHERE id = ${req.params.issueId}`,
          (error, issue) => {
            res.status(200).json({ issue });
          }
        );
      });
    } else {
      return res.sendStatus(400);
    }
  });
});

issuesRouter.delete("/:issueId", (req, res, next) => {
  const sql = "DELETE FROM Issue WHERE id = $issueId";
  const values = { $issueId: req.params.issueId };

  db.run(sql, values, (error) => {
    if (error) {
      next(error);
    } else {
      res.sendStatus(204);
    }
  });
});

module.exports = issuesRouter;
