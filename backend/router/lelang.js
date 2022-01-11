const express = require("express");
const app = express();
const { response } = require("../helper/wrapper");
const { toIsoString } = require("../helper/date");
const { lelangStatus } = require("../helper/enum");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const { lelang } = require("../models/index");
const { barang } = require("../models/index");
const { history_lelang } = require("../models/index");
const { runTime } = require("../helper/endTime");

app.get("/", auth("admin", "petugas", "masyarakat"), async (req, res) => {
  await lelang
    .findAll({
      include: ["barang"],
    })
    .then((result) => {
      return response(res, "success", result, "Success get data lelang", 200);
    })
    .catch((err) => {
      return response(res, "fail", err, "Failed get data lelang", 400);
    });
});

app.get("/:id", auth("admin", "petugas", "masyarakat"), async (req, res) => {
  const param = {
    id: req.params.id,
  };
  await lelang
    .findOne({ where: param })
    .then((result) => {
      return response(res, "success", result, "Success get data lelang", 200);
    })
    .catch((err) => {
      return response(res, "fail", err, "Failed get data lelang", 400);
    });
});

app.get(
  "/idBarang/:idBarang",
  auth("admin", "petugas", "masyarakat"),
  async (req, res) => {
    const param = {
      idBarang: req.params.idBarang,
    };
    await lelang
      .findOne({ where: param, include: ["barang"] })
      .then((result) => {
        return response(res, "success", result, "Success get data lelang", 200);
      })
      .catch((err) => {
        return response(res, "fail", err, "Failed get data lelang", 400);
      });
  }
);

app.post("/", auth("admin", "petugas"), async (req, res) => {
  const date = new Date(Date.now());
  const idBarang = {
    id: req.body.idBarang,
  };
  const resultBarang = await barang.findOne({ where: idBarang });
  const data = {
    idBarang: req.body.idBarang,
    tglLelang: toIsoString(date),
    hargaAkhir: resultBarang.dataValues.hargaAwal,
    idPetugas: req.body.idPetugas,
    status: req.body.status,
  };
  if (data.status === lelangStatus.DIBUKA) {
    let end = new Date(req.body.endTime);
    let timeStamp = end.getTime();
    data.endTime = end;
    await lelang
      .create(data)
      .then((result) => {
        runTime("* * * * * *", timeStamp, result.dataValues.id);
        return response(
          res,
          "success",
          result,
          "Success create data lelang",
          200
        );
      })
      .catch((err) => {
        return response(res, "fail", err, "Failed create data lelang", 400);
      });
  } else {
    await lelang
      .create(data)
      .then((result) => {
        return response(
          res,
          "success",
          result,
          "Success create data lelang",
          201
        );
      })
      .catch((err) => {
        return response(res, "fail", err, "Failed create data lelang", 400);
      });
  }
});

app.put("/", auth("admin", "petugas"), async (req, res) => {
  const date = new Date(Date.now());
  const idBarang = {
    id: req.body.idBarang,
  };
  const resultBarang = await barang.findOne({ where: idBarang });
  const param = {
    id: req.body.id,
  };
  const data = {
    idBarang: req.body.idBarang,
    tglLelang: toIsoString(date),
    hargaAkhir: resultBarang.dataValues.hargaAwal,
    idPetugas: req.body.idPetugas,
    status: req.body.status,
  };
  if (data.status === lelangStatus.DIBUKA) {
    let end = new Date(req.body.endTime);
    let timeStamp = end.getTime();
    data.endTime = end;
    await lelang
      .update(data, { where: param })
      .then((result) => {
        runTime("* * * * * *", timeStamp, param.id);
        return response(
          res,
          "success",
          result,
          "Success update data lelang",
          200
        );
      })
      .catch((err) => {
        return response(res, "fail", err, "Failed update data lelang", 400);
      });
  } else {
    await lelang
      .update(data, { where: param })
      .then((result) => {
        return response(
          res,
          "success",
          result,
          "Success create data lelang",
          201
        );
      })
      .catch((err) => {
        return response(res, "fail", err, "Failed create data lelang", 400);
      });
  }
});

app.post("/bid", auth("masyarakat"), async (req, res) => {
  const idLelang = {
    id: req.body.id,
  };
  const resultLelang = await lelang.findOne({ where: idLelang });
  const { hargaAkhir, status } = resultLelang.dataValues;
  const data = {
    idLelang: idLelang.id,
    idMasyarakat: req.body.idMasyarakat,
    penawaranHarga: req.body.penawaranHarga,
  };
  if (status === lelangStatus.DITUTUP) {
    return response(res, "fail", "", "Status is closed", 400);
  }
  if (data.penawaranHarga <= hargaAkhir) {
    return response(res, "fail", "", "bid must be higher", 400);
  }
  await history_lelang.create(data);
  await lelang
    .update(
      { hargaAkhir: data.penawaranHarga, idMasyarakat: data.idMasyarakat },
      { where: idLelang }
    )
    .then((result) => {
      return response(res, "success", result, "Success bid", 201);
    })
    .catch((err) => {
      return response(res, "fail", err, "Failed bid", 400);
    });
});

app.delete("/:id", async (req, res) => {
  const param = {
    id: req.params.id,
  };
  lelang
    .destroy({ where: param })
    .then((result) => {
      return response(
        res,
        "success",
        result,
        "Success delete data lelang",
        200
      );
    })
    .catch((err) => {
      return response(res, "fail", err, "Failed update data lelang", 400);
    });
});

module.exports = app;
