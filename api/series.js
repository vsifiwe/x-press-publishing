const express = require("express");

const seriesRouter = express.Router();
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database(
  process.env.TEST_DATABASE || "./database.sqlite"
);
const issuesRouter = require("./issues");

seriesRouter.param("seriesId", (req, res, next, seriesId) => {
  db.get(
    "SELECT * FROM Series WHERE id = $seriesId",
    { $seriesId: seriesId },
    (error, series) => {
      if (error) {
        return next(error);
      }
      if (series) {
        req.series = series;
        return next();
      } else {
        return res.sendStatus(404);
      }
    }
  );
});

seriesRouter.get("/", (req, res, next) => {
  db.all("SELECT * FROM Series", (err, series) => {
    if (err) {
      return next(err);
    }
    res.send({ series });
  });
});

seriesRouter.get("/:seriesId", (req, res, next) => {
  res.send(req.series);
});

seriesRouter.post("/", (req, res, next) => {
  const name = req.body.name;
  const desc = req.body.description;

  if (!name || !desc) {
    return res.sendStatus(400);
  }

  const sql = "INSERT INTO Series (name, description) VALUES ($name, $desc)";
  const values = {
    $name: name,
    $desc: desc,
  };

  db.run(sql, values, function (error) {
    if (error) {
      return next(error);
    }

    db.get(
      `SELECT * FROM Series WHERE id = ${this.lastID}`,
      (error, series) => {
        res.status(201).json({ series: series });
      }
    );
  });
});

seriesRouter.put("/:seriesId", (req, res, next) => {
  const name = req.body.name;
  const desc = req.body.description;

  if (!name || !desc) {
    return res.sendStatus(400);
  }

  const sql =
    "UPDATE Series SET name = $name, description = $desc WHERE id = $seriesId";
  const values = {
    $name: name,
    $desc: desc,
    $seriesId: req.params.seriesId,
  };

  db.run(sql, values, (error) => {
    if (error) {
      return next(error);
    }

    db.get(
      `SELECT * FROM Series WHERE id = ${req.params.seriesId}`,
      (error, series) => {
        res.send({ series: series });
      }
    );
  });
});

seriesRouter.use("/:seriesId/issues", issuesRouter);

seriesRouter.delete("/:seriesId", (req, res, next) => {
  const sql = "SELECT * FROM Issue WHERE series_id = $seriesId";
  const values = { $seriesId: req.params.seriesId };
  db.get(sql, values, (error, issue) => {
    if (error) {
      next(error);
    } else if (issue) {
      res.sendStatus(400);
    } else {
      const sql1 = "DELETE FROM Series WHERE id = $seriesId";
      const values1 = { $seriesId: req.params.seriesId };

      db.run(sql1, values1, (error) => {
        if (error) {
          next(error);
        } else {
          res.sendStatus(204);
        }
      });
    }
  });
});

module.exports = seriesRouter;
