const express = require("express");
const router = express.Router();

const SubCategory = require("../models/SubCategory");
// const subArray = require('../mockData/subCategory');
const subArray = require("../mockData/Rental");

router.get("/category", (req, res) => {
  try {
    return res.status(200).send({
      message: "Ok response",
      data: [
        { key: "commercial", value: "Commercial" },
        { key: "residential", value: "Residential" },
      ],
    });
  } catch (err) {
    return res.send({ message: err.name });
  }
});

router.get("/sub-category/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (id == "commercial") {
      const data1 = await SubCategory.find({ type: "commercial" });
      return res.send({ message: "success", data: data1 });
    } else if (id == "residential") {
      const data1 = await SubCategory.find({ type: "residential" });
      return res.send({ message: "success", data: data1 });
    } else {
      const data1 = await SubCategory.find();
      return res.send({ message: "success", data: data1 });
    }
  } catch (err) {
    return res.send({ message: err });
  }
});

router.get("/all-subCategory", async (req, res) => {
  try {
      const data1 = await SubCategory.find({});
      return res.send({ message: "success", data: data1 });
  } catch (err) {
    return res.send({ message: err });
  }
});

router.get("/purpose", (req, res) => {
  try {
    return res.json({
      message: "success",
      data: [
        { key: "forSale", value: "For Sale" },
        { key: "forRent", value: "For Rent" },
        { key: "offPlan", value: "Off Plan" },
      ],
    });
  } catch (error) {
    return res.send({ message: error.name });
  }
});

router.get("/ownership-status", (req, res) => {
  try {
    return res.send({
      message: "Ok !!",
      data: [
        { key: "freeHold", value: "free hold" },
        { key: "leaseHold", value: "lease hold" },
      ],
    });
  } catch (error) {
    return res.send({ message: error });
  }
});

router.get("/completion-status", (req, res) => {
  try {
    return res.send({
      message: "Ok !!",
      data: [
        { key: "ready", value: "Ready" },
        { key: "offPlan", value: "Off Plan" },
      ],
    });
  } catch (error) {
    return res.send({ message: error });
  }
});
router.get("/rent-frequency", async (req, res) => {
  try {
    return res.send({
      message: "Ok !!",
      data: [
        { key: "daily", value: "Daily" },
        { key: "weekly", value: "Weekly" },
        { key: "monthly", value: "Monthly" },
        { key: "yearly", value: "Yearly" },
      ],
    });
  } catch (error) {
    return res.send({ message: "ok!!" });
  }
});

router.get("/paid-by", async (req, res) => {
  try {
    return res.send({
      message: "Ok !!",
      data: [
        { key: "landLord", value: "Landlord" },
        { key: "tenant", value: "Tenant" },
        { key: "monthly", value: "Monthly" },
        { key: "yearly", value: "Yearly" },
      ],
    });
  } catch (error) {
    return res.send({ message: "ok!!" });
  }
});

router.get("/ownership-status", (req, res) => {
  try {
    return res.send({
      message: "Ok !!",
      data: [
        { key: "freeHold", value: "free hold" },
        { key: "leaseHold", value: "lease hold" },
      ],
    });
  } catch (error) {
    return res.send({ message: error });
  }
});

router.get("/rent-frequency", async (req, res) => {
  try {
    return res.send({
      message: "Ok !!",
      data: [
        { key: "daily", value: "Daily" },
        { key: "weekly", value: "Weekly" },
        { key: "monthly", value: "Monthly" },
        { key: "yearly", value: "Yearly" },
      ],
    });
  } catch (error) {
    return res.send({ message: "ok!!" });
  }
});

router.get("/paid-by", async (req, res) => {
  try {
    return res.send({
      message: "Ok !!",
      data: [
        { key: "landLord", value: "Landlord" },
        { key: "tenant", value: "Tenant" },
        { key: "monthly", value: "Monthly" },
        { key: "yearly", value: "Yearly" },
      ],
    });
  } catch (error) {
    return res.send({ message: "ok!!" });
  }
});

router.get("/", async (req, res) => {
  try {
    // const result = await SubCategory.insertMany(subArray)
    console.log(result);
    res.json(result);
    // return res.send({ message: 'ok !!', data: [] })
  } catch (error) {
    return res.send({ message: "ok!!" });
  }
});

module.exports = router;
