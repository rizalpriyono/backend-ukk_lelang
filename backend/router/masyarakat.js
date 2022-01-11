const express = require("express");
const app = express();
const { response } = require("../helper/wrapper");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const { masyarakat } = require("../models/index");
const { petugas } = require("../models/index");
const md5 = require("md5");

app.get("/", auth("admin", "petugas", "masyarakat"), async (req, res) => {
  await masyarakat
    .findAll()
    .then((result) => {
      return response(res, "success", result, "Success get data petugas", 200);
    })
    .catch((err) => {
      return response(res, "fail", err, "Failed get data petugas", 400);
    });
});

app.get("/:id", auth("admin", "petugas", "masyarakat"), async (req, res) => {
  const param = {
    id: req.params.id,
  };
  await masyarakat
    .findOne({ where: param })
    .then((result) => {
      return response(
        res,
        "success",
        result,
        "Success get data masyarakat",
        200
      );
    })
    .catch((err) => {
      return response(res, "fail", err, "Failed get data masyarakat", 400);
    });
});

app.post("/register", async (req, res) => {
  const data = {
    nama: req.body.nama,
    password: md5(req.body.password),
    telp: req.body.telp,
  };
  const param = {
    username: req.body.username,
  };
  const resultMasyarakat = await masyarakat.findOne({ where: param });
  const resultPetugas = await petugas.findOne({ where: param });
  if (resultMasyarakat || resultPetugas) {
    return response(res, "fail", "", "Username Already exist", 400);
  } else {
    data.username = param.username;
    await masyarakat
      .create(data)
      .then((result) => {
        return response(
          res,
          "success",
          result,
          "Success create data masyarakat",
          201
        );
      })
      .catch((err) => {
        return response(res, "fail", err, "Failed create data masyarakat", 400);
      });
  }
});

app.put("/", auth("masyarakat"), async (req, res) => {
  const param = {
    id: req.body.id,
  };
  const payload = {
    nama: req.body.nama,
    telp: req.body.telp,
  };
  const data = {};
  if (req.body.password) {
    payload.password = md5(req.body.password);
  }
  if (req.body.username) {
    data.username = req.body.username;
    const resultMasyarakat = await masyarakat.findOne({ where: data });
    const resultPetugas = await petugas.findOne({ where: data });
    if (resultMasyarakat || resultPetugas) {
      return response(res, "fail", "", "Username Already exist", 400);
    } else {
      payload.username = data.username;
      await masyarakat
        .update(payload, { where: param })
        .then((result) => {
          return response(
            res,
            "fail",
            result,
            "Success update data masyarakat",
            200
          );
        })
        .catch((err) => {
          return response(
            res,
            "fail",
            err,
            "Failed update data masyarakat",
            400
          );
        });
    }
  } else {
    payload.username = data.username;
    await masyarakat
      .update(payload, { where: param })
      .then((result) => {
        return response(
          res,
          "fail",
          result,
          "Success update data masyarakat",
          200
        );
      })
      .catch((err) => {
        return response(res, "fail", err, "Failed update data masyarakat", 400);
      });
  }
});

app.delete("/:id", auth("admin"), async (req, res) => {
  const param = {
    id: req.params.id,
  };
  masyarakat
    .destroy({ where: param })
    .then((result) => {
      return response(
        res,
        "success",
        result,
        "Success delete data masyarakat",
        200
      );
    })
    .catch((err) => {
      return response(res, "fail", err, "Failed delete data masyarakat", 400);
    });
});

module.exports = app;
