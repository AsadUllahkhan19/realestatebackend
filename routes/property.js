const express = require("express");
const router = express.Router();
const yup = require("yup");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
require('dotenv').config();
const Users = require("../models/Users");
const Property = require("../models/Property");
// const imageUpload = require("../middlewares/Multer");
const verifyToken = require("../middlewares/UserVerify");
const Clicks = require("../models/Clicks");
const Impressions = require("../models/Impressions");

const LATITUDE = 24.466667;
const LONGITUDE = 54.366669;

router.post("/upload", async (req, res) => {
  try {
    console.log(req.body.bodyOfData);
    // if (req?.files.length < 1) {
    //   return res.status(400).send({ message: "image required" });
    // }
    // const fd = req?.files?.map((item) => {
    //   if (item.filename != "") {
    //     return item.filename;
    //   }
    // });
    // req.body = JSON.parse(req.body.bodyOfData);
    // req.body.upload.images = req.body.photos;
    const {
      typesAndPurpose,
      locationAndAddress,
      propertyDetails,
      rentalDetails,
      contactDetails,
      upload,
    } = req.body;
    // let videos = [];
    console.log(req?.body);
    // const fd = req?.files?.map((item) => {
    //     if (item.filename != '') {
    //         return item.filename;
    //     }
    // })
    // if (req?.body?.upload?.videos?.length > 0) {
    //     videos = req?.body?.upload?.videos;
    // }
    const propertyDetailsObj = {
      title: yup.string().required(),
      description: yup
        .string()
        .min(10, "Minimum length should be 10")
        .max(75, "Minimum length should be 75")
        .required(),
      areaSquare: yup.number().required(),
      completionStatus: yup.string().required(),
    };
    const rentalDetailsObj = {};
    if (typesAndPurpose?.category == "residential") {
      propertyDetailsObj.bedRooms = yup
        .number()
        .required()
        .min(1, "Must be more than 1")
        .positive();
      propertyDetailsObj.bathRooms = yup
        .number()
        .required()
        .min(1, "Must be more than 1")
        .positive();
    }
    if (typesAndPurpose?.purpose == "forSale") {
      propertyDetailsObj.InclusivePrice = yup.number().required().positive();
    }
    if (typesAndPurpose?.purpose == "forRent") {
      rentalDetailsObj.rent = yup.number().required();
      rentalDetailsObj.rentFrequency = yup.string().required();
    }

    // Yup Schema's
    const typeAndPurposeSchema = yup.object({
      category: yup.string().required(),
      subCategory: yup.string().required(),
      purpose: yup.string().required(),
    });
    const locationAndAddressSchema = yup.object({
      location: yup.string().required(),
    });
    const propertyDetailsShema = yup.object(propertyDetailsObj);

    const rentalDetailsScehma = yup.object(rentalDetailsObj);

    try {
      //Yup Schema Start

      // await typeAndPurposeSchema.validate(typesAndPurpose);
      // await locationAndAddressSchema.validate(locationAndAddress);
      // await propertyDetailsShema.validate(propertyDetails);
      // await rentalDetailsScehma.validate(rentalDetails);

      //Yup Schema End
      const finalObject = req.body;
      console.log(finalObject);
      // finalObject.upload.images = fd;
      // finalObject.upload.videos = videos;
      const saveProperty = new Property(finalObject);
      const createdData = await saveProperty.save();
      return res.send({ mesage: "succes", data: createdData });
    } catch (error) {
      return res.json({ message: error["errors"] });
    }
  } catch (error) {
    console.log("errr", error);
    return res.status(500).send({ message: error.message });
  }
});

router.get("/get-property", async (req, res) => {
  try {
    const transform = () => {
      let result = [];
      if (req?.query?.category == "all") {
        let data = {};
        data["typesAndPurpose.category"] = {
          $in: ["residential", "commercial"],
        };
        result.push(data);
        // return result;
      }
      if (req?.query?.area != undefined) {
        let data = {};
        const minArea = req?.query?.area?.split('|')[0]
        const maxArea = req?.query?.area?.split('|')[1]

        if (minArea != '' && maxArea != '') {
          data["propertyDetails.areaSquare"] = { $lte: maxArea, $gte: minArea };
        } else if (minArea != '') {
          data["propertyDetails.areaSquare"] = { $gte: minArea };
        } else if (maxArea != '') {
          data["propertyDetails.areaSquare"] = { $lte: maxArea };
        }
        result.push(data);
      }
      if (req?.query?.bedRooms != undefined) {
        let data2 = {};;
        data2["amenities"] = {
          $elemMatch: {
            name: "bedRooms",
            value: req?.query?.bedRooms,
          },
        };
        result.push(data2);
      }
      if (req?.query?.purpose != undefined) {
        let data = {};
        data["typesAndPurpose.purpose"] = { $eq: req?.query?.purpose };
        result.push(data);
      }
      if (req?.query?.price != undefined) {
        let data = {};
        const minPrice = req?.query?.price?.split('|')[0]
        const maxPrice = req?.query?.price?.split('|')[1]
        if (minPrice != '' && maxPrice != '') {
          data["propertyDetails.InclusivePrice"] = { $lte: maxPrice, $gte: minPrice };
        } else if (minPrice != '') {
          data["propertyDetails.InclusivePrice"] = { $gte: minPrice };
        } else if (maxPrice != '') {
          data["propertyDetails.InclusivePrice"] = { $lte: maxPrice };
        }
        result.push(data);
      }
      if (req?.query?.subCategory != undefined) {
        let data = {};
        data["typesAndPurpose.subCategory"] = req?.query?.subCategory;
        result.push(data);
      }
      if (req?.query?.category != undefined && req?.query?.category != "all") {
        let data = {};
        data["typesAndPurpose.category"] = req?.query?.category;
        result.push(data);
      }
      if (req?.query?.bathRooms != undefined) {
        let data = {};
        data["amenities"] = {
          $elemMatch: {
            name: "bathRooms",
            value: req?.query?.bathRooms,
          },
        };
        result.push(data);
      }
      // ================================================================
      // if (req?.body?.subCategory != '') {
      //     let data = {};
      //     data.subCategory = req?.body?.subCategory;
      //     result.push(data);
      // }
      // if (req?.body?.purpose !== '') {
      //     let data = {};
      //     data.purpose = { '$eq': req?.body?.purpose };
      //     result.push(data);
      // }
      // if (req?.body?.InclusivePriceStart !== '') {
      //     let data = {};
      //     data.InclusivePrice = { '$gte': req?.body?.InclusivePriceStart, '$lte': req?.body?.InclusivePriceEnd };
      //     result.push(data);
      // }
      return result;
    };
    let savedUp = [];
    // if (transform().length < 1) {
    //   savedUp = await Property.find();
    // } else {
    savedUp = await Property.find({ $and: transform() }).select("_id propertyDetails.title propertyDetails.areaSquare propertyDetails.ownerShipStatus typesAndPurpose.category propertyDetails.inclusivePrice amenities contactDetails.email upload.images locationAndAddress propertyDetails.InclusivePrice");
    // }
    console.log("heh", savedUp);
    // console.log("query", transform());
    // .select('typesAndPurpose.purpose locationAndAddress.location propertyDetails.title propertyDetails.areaSquare propertyDetails.bedRooms propertyDetails.bathRooms propertyDetails.InclusivePrice locationAndAddress.address');
    return res.send({ message: "success", data: savedUp });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error.name });
  }
});

// router.get("/get-property", async (req, res) => {
//   try {
//     const transform = () => {
//       let result = [];
//       if (req?.query?.category == "all") {
//         let data = {};
//         data["typesAndPurpose.category"] = {
//           $in: ["residential", "commercial"],
//         };
//         result.push(data);
//         // return result;
//       }
//       if (req?.query?.area != undefined) {
//         let data = {};
//         const minArea = req?.query?.area?.split('|')[0]
//         const maxArea = req?.query?.area?.split('|')[1]

//         if (minArea != '' && maxArea != '') {
//           data["propertyDetails.areaSquare"] = { $lte: maxArea, $gte: minArea };
//         } else if (minArea != '') {
//           data["propertyDetails.areaSquare"] = { $gte: minArea };
//         } else if (maxArea != '') {
//           data["propertyDetails.areaSquare"] = { $lte: maxArea };
//         }
//         result.push(data);
//       }
//       if (req?.query?.bedRooms != undefined) {
//         let data2 = {};;
//         data2["amenities"] = {
//           $elemMatch: {
//             name: "bedRooms",
//             value: req?.query?.bedRooms,
//           },
//         };
//         result.push(data2);
//       }
//       if (req?.query?.purpose != undefined) {
//         let data = {};
//         data["typesAndPurpose.purpose"] = { $eq: req?.query?.purpose };
//         result.push(data);
//       }
//       if (req?.query?.price != undefined) {
//         let data = {};
//         const minPrice = req?.query?.price?.split('|')[0]
//         const maxPrice = req?.query?.price?.split('|')[1]
//         if (minPrice != '' && maxPrice != '') {
//           data["propertyDetails.InclusivePrice"] = { $lte: maxPrice, $gte: minPrice };
//         } else if (minPrice != '') {
//           data["propertyDetails.InclusivePrice"] = { $gte: minPrice };
//         } else if (maxPrice != '') {
//           data["propertyDetails.InclusivePrice"] = { $lte: maxPrice };
//         }
//         result.push(data);
//       }
//       if (req?.query?.subCategory != undefined) {
//         let data = {};
//         data["typesAndPurpose.subCategory"] = req?.query?.subCategory;
//         result.push(data);
//       }
//       if (req?.query?.category != undefined && req?.query?.category != "all") {
//         let data = {};
//         data["typesAndPurpose.category"] = req?.query?.category;
//         result.push(data);
//       }
//       if (req?.query?.bathRooms != undefined) {
//         let data = {};
//         data["amenities"] = {
//           $elemMatch: {
//             name: "bathRooms",
//             value: req?.query?.bathRooms,
//           },
//         };
//         result.push(data);
//       }
//       // ================================================================
//       // if (req?.body?.subCategory != '') {
//       //     let data = {};
//       //     data.subCategory = req?.body?.subCategory;
//       //     result.push(data);
//       // }
//       // if (req?.body?.purpose !== '') {
//       //     let data = {};
//       //     data.purpose = { '$eq': req?.body?.purpose };
//       //     result.push(data);
//       // }
//       // if (req?.body?.InclusivePriceStart !== '') {
//       //     let data = {};
//       //     data.InclusivePrice = { '$gte': req?.body?.InclusivePriceStart, '$lte': req?.body?.InclusivePriceEnd };
//       //     result.push(data);
//       // }
//       return result;
//     };
//     let savedUp = [];
//     // if (transform().length < 1) {
//     //   savedUp = await Property.find();
//     // } else {
//     savedUp = await Property.find({ $and: transform() }).select("_id propertyDetails.title propertyDetails.areaSquare propertyDetails.ownerShipStatus typesAndPurpose.category propertyDetails.inclusivePrice amenities contactDetails.email upload.images locationAndAddress propertyDetails.InclusivePrice");
//     // }
//     // console.log("heh", savedUp);
//     console.log("query", transform());
//     // .select('typesAndPurpose.purpose locationAndAddress.location propertyDetails.title propertyDetails.areaSquare propertyDetails.bedRooms propertyDetails.bathRooms propertyDetails.InclusivePrice locationAndAddress.address');
//     return res.send({ message: "success", data: savedUp });
//   } catch (error) {
//     console.log(error);
//     res.status(400).send({ message: error.name });
//   }
// });

router.put("/upload", async (req, res) => {
  try {
    if (req?.body?.arrays && req?.body?.arrays?.length > 0) {
      const db = await Property.findByIdAndUpdate(
        "64f04ac7ab46955aa8032e37",
        { $set: { amenities: req.body.arrays } },
        { new: true }
      );
      return res.status(200).send({ message: "success", data: db });
    }
    return res
      .status(400)
      .send({ message: "success", data: "64f04ac7ab46955aa8032e37" });
  } catch (error) {
    console.log("errorss", error);
    return res.status(401).send({ message: error.message });
  }
});

router.put("/upload-media", async (req, res) => {
  try {
    let videos = [];
    const fd = req?.files?.map((item) => {
      if (item.filename != "") {
        return item.filename;
      }
    });
    if (req?.body?.videos?.length > 0) {
      videos = req?.body?.videos;
    }
    const uploadedData = await Property.findByIdAndUpdate(
      "64f04ac7ab46955aa8032e37",
      { $set: { images: fd, videos: videos } },
      { new: true }
    );
    return res.send({ message: "success", data: uploadedData });
  } catch (error) {
    return res.status(400).send({ message: error.name });
  }
});

// router.get("/get-property", async (req, res) => {
//   try {
//     // console.log(req.body)
//     const transform = () => {
//       let result = [];
//       if (req?.query?.purpose === undefined) {
//         return res.status(429).json({ message: "Purpose not defined." });
//       }
//       if (req?.query?.areaSquare !== undefined) {
//         let data = {};
//         data["propertyDetails.areaSquare"] = { $lte: req?.query?.areaSquare };
//         result.push(data);
//       }
//       if (req?.query?.bedRooms !== undefined) {
//         let data = {};
//         data["propertyDetails.bedRooms"] = req?.query?.bedRooms;
//         result.push(data);
//       }
//       if (req?.query?.purpose !== undefined) {
//         let data = {};
//         data["typesAndPurpose.purpose"] = { $eq: req?.query?.purpose };
//         result.push(data);
//       }
//       if (req?.query?.price !== undefined) {
//         let data = {};

//         data["propertyDetails.InclusivePrice"] = { $lte: req?.query?.price };
//         result.push(data);
//       }
//       if (req?.query?.subCategory !== undefined) {
//         console.log("hhhhh");
//         let data = {};
//         data["typesAndPurpose.subCategory"] = req?.query?.subCategory;
//         result.push(data);
//       }
//       if (req?.query?.category !== undefined) {
//         console.log("hhhhh");
//         let data = {};
//         data["typesAndPurpose.category"] = req?.query?.category;
//         result.push(data);
//       }
//       // if (req?.body?.subCategory != '') {
//       //     let data = {};
//       //     data.subCategory = req?.body?.subCategory;
//       //     result.push(data);
//       // }
//       // if (req?.body?.bathRooms !== '') {
//       //     let data = {};
//       //     data.bathRooms = { '$in': req?.body?.bathRooms };
//       //     result.push(data);
//       // }
//       // if (req?.body?.purpose !== '') {
//       //     let data = {};
//       //     data.purpose = { '$eq': req?.body?.purpose };
//       //     result.push(data);
//       // }
//       // if (req?.body?.InclusivePriceStart !== '') {
//       //     let data = {};
//       //     data.InclusivePrice = { '$gte': req?.body?.InclusivePriceStart, '$lte': req?.body?.InclusivePriceEnd };
//       //     result.push(data);
//       // }
//       return result;
//     };
//     // console.log('query', transform())
//     const savedUp = await Property.find({ $and: transform() });
//     // .select('typesAndPurpose.purpose locationAndAddress.location propertyDetails.title propertyDetails.areaSquare propertyDetails.bedRooms propertyDetails.bathRooms propertyDetails.InclusivePrice locationAndAddress.address');
//     return res.send({ message: "success", data: savedUp });
//   } catch (error) {
//     res.status(400).send({ message: error.name });
//   }
// });

//  sub category count

router.get("/get-shops-count", async (req, res) => {
  try {
    const count = await Property.countDocuments({
      "typesAndPurpose.subCategory": "shop",
    });
    // const result = await Property.find({ 'typesAndPurpose.subCategory': 'shop' })
    return res.json({ message: "sucess", result: count });
  } catch (error) {
    console.log(error);
  }
});

router.get("/get-office-count", async (req, res) => {
  try {
    const count = await Property.countDocuments({
      "typesAndPurpose.subCategory": "office",
    });
    // const result = await Property.find({ 'typesAndPurpose.subCategory': 'office' });
    return res.status(200).json({ message: "sucess", result: count });
  } catch (error) {
    console.log(error);
  }
});

router.get("/get-warehouse-count", async (req, res) => {
  try {
    const count = await Property.countDocuments({
      "typesAndPurpose.subCategory": "warehouse",
    });
    // const result = await Property.find({ 'typesAndPurpose.category': 'commercial villa' });
    return res.status(200).json({ message: "sucess", result: count });
  } catch (error) {
    console.log(error);
  }
});

router.get("/get-residency-count", async (req, res) => {
  try {
    const count = await Property.countDocuments({
      "typesAndPurpose.category": "residential",
    });
    // const page = req.query.p || 0;
    // const propertyPerPage = 3;
    // const count = await Property.countDocuments({ 'typesAndPurpose.category': 'residential' });
    // const page_total = Math.floor((count - 1) / propertyPerPage) + 1;
    // const result = await Property.find({ 'typesAndPurpose.category': 'residential' })
    //     .skip(page * propertyPerPage)
    //     .limit(propertyPerPage);
    return res.status(200).json({ message: "success", result: count });
    // return res.status(200).json({ message: 'sucess', result: result, pageTotal: page_total });
  } catch (error) {
    console.log(error);
  }
});

router.get("/get-villa-count", async (req, res) => {
  try {
    const count = await Property.countDocuments({
      "typesAndPurpose.subCategory": "villa",
    });
    // const result = await Property.find({ 'typesAndPurpose.category': 'commercial villa' });
    return res.status(200).json({ message: "sucess", result: count });
  } catch (error) {
    console.log(error);
  }
});

router.get("/get-pentHouse-count", async (req, res) => {
  try {
    const count = await Property.countDocuments({
      "typesAndPurpose.subCategory": "pentHouse",
    });
    // const result = await Property.find({ 'typesAndPurpose.category': 'commercial villa' });
    return res.status(200).json({ message: "sucess", result: count });
  } catch (error) {
    console.log(error);
  }
});

router.get("/featured-property", async (req, res) => {
  try {
    const result = await Property.find({})
      .select(
        "propertyDetails.title propertyDetails.areaSquare propertyDetails.bedRooms propertyDetails.bathRooms contactDetails.email upload.images locationAndAddress.location locationAndAddress.address "
      )
      .skip(0)
      .limit(2);
    return res.status(200).send({ message: "success", data: result });
  } catch (error) {
    console.log(error);
  }
});

// router.get("/property-detials/:id", async (req, res) => {
//     try {
//         const result = await Property.findById(req.params.id);
//         // .skip(0)
//         // .limit(3);
//         return res.status(200).send({ message: "success", data: result });
//     } catch (error) {
//         console.log(error);
//     }
// });

router.get("/property-detials/:id", async (req, res) => {
  try {
    const result = await Property.findById(req.params.id);
    // .skip(0)
    // .limit(3);
    return res.status(200).send({ message: "success", data: result });
  } catch (error) {
    console.log(error);
  }
});

router.get("/add-clicks/:id", async (req, res) => {
  try {
    const data = await Property.findOneAndUpdate(
      { _id: req.params.id },
      { $inc: { clicks: 1 } }
    );
    return res.status(200).json({ message: "Success" });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ message: "problem here" });
  }
});

router.get("/add-impression/:id", async (req, res) => {
  try {
    const data = await Property.findOneAndUpdate(
      { _id: req.params.id },
      { $inc: { impressions: 1 } }
    );
    return res.status(200).json({ message: "Success" });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ message: "problem here" });
  }
});

router.get("/add-lead", async (req, res) => {
  try {
    if (req?.query?.userId !== undefined) {
      console.log(req?.query?.propertyId, req?.query?.userId);
      const result = await Property.findOneAndUpdate(
        { _id: req?.query?.propertyId, ownerId: req?.query?.userId },
        {
          $inc: {
            leads: 1,
          },
        }
      );
      return res.status(200).json({ message: "success", data: result });
    }
    // else {
    //   const data = new Property({ propertyId: req?.query?.propertyId, clicks: 1 });
    //   const result = data.save()
    //   return res.status(200).json({ message: 'success', data: result });
    // }
  } catch (error) {
    console.log(error);
    return res.status(400).send({ message: "problem here" });
  }
});

router.get("/add-clicks-on-click", async (req, res) => {
  try {
    let yourDate = new Date();
    const newDate = yourDate.toISOString().split("T")[0];
    const data = new Clicks({
      propertyId: req?.query?.propertyId,
      userId: req?.query?.userId,
      clicks: 1,
      date: newDate,
    });
    const result = data.save();
    return res.status(200).json({ message: "success", data: result });
  } catch (error) {
    console.log("add_Clicks", error);
    return res.status(400).send({ message: "problem here" });
  }
});

router.get("/get-impressions-count/:email", async (req, res) => {
  try {
    const data = await Property.aggregate([
      { $match: { "contactDetails.email": { $eq: req.params.email } } },
      {
        $group: {
          _id: null,
          impressions: { $sum: "$impressions" },
          clicks: { $sum: "$clicks" },
          leads: { $sum: "$leads" },
        },
      },
      { $unset: ["_id"] },
    ]);
    return res.status(200).json({ message: "success", data: data });
  } catch (error) {
    return res.status(400);
  }
});

router.get("/property-list", async (req, res) => {
  try {
    const userEmail = req.query.userEmail;

    const result = await Property.find({ "contactDetails.email": userEmail });
    return res.status(200).send({ message: "success", data: result });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "error" });
  }
});

router.get("/get-user-clicks/:id", async (req, res) => {
  try {
    const data = await Clicks.find({ userId: req.params.id });
    return res.json({ message: "success", data: data });
  } catch (error) {
    return res.json({ message: error.name });
  }
});

router.post("/serach-property-by-searchbar", async (req, res) => {
  try {
    console.log(req.body.value);
    const data = await Property.find({
      "propertyDetails.title": { $regex: req.body.value, $options: "i" },
    });
    return res.json({ message: "success", data: data });
  } catch (error) {
    return res.json({ message: error.name });
  }
});

router.get("/add-impressions-on-view", async (req, res) => {
  try {
    let yourDate = new Date();
    const newDate = yourDate.toISOString().split("T")[0];
    if (req?.query?.propertyId === undefined) {
      return res.status(400).send({ message: "please add propertyId." })
    }
    if (req?.query?.userId === undefined) {
      return res.status(400).send({ message: "please add userId." })
    }
    const data = new Impressions({
      propertyId: req?.query?.propertyId,
      userId: req?.query?.userId,
      clicks: 1,
      date: newDate,
    });
    const result = data.save();
    return res.status(200).json({ message: "success", data: result });
  } catch (error) {
    console.log("from_impressionadd", error);
    return res.status(400).send({ message: "problem here" });
  }
});

router.get("/get-impressions-on-view/:id", async (req, res) => {
  try {
    const data = await Impressions.find({ userId: req.params.id });
    return res.status(200).json({ message: "success", data: data });
  } catch (error) {
    return res.status(400).send({ message: "problem here" });
  }
});

router.post("/add-photos", async (req, res) => {
  try {
    console.log(req?.files);
    if (req?.files?.length < 1) {
      return res.status(400).send({ message: "image required" });
    }
    const fd = req?.files?.map((item) => {
      if (item.filename != "") {
        return item.filename;
      }
    });
    res.status(200).json({ message: "success", data: fd });
  } catch (error) {
    console.log(error);
  }
});

router.get("/delete-photo/:id", (req, res) => {
  try {
    fs.unlink(`./public/data/uploads/${req.params.id}`, (err) => {
      if (err) {
        console.log("from_callback", err);
        return res.status(400).json({ message: err.name });
      } else {
        console.log("\nDeleted file: " + req.params.id);
        return res.status(200).json({ message: "success" });

        // Get the files in current directory
        // after deletion
        // getFilesInDirectory();
      }
    });
  } catch (err) {
    console.log(err);
  }
});

router.post("/update-property", async (req, res) => {
  try {
    console.log(req.body._id, "checking_body", req.body.upload, req.body._id);
    const updatedResult = await Property.findByIdAndUpdate(
      req.body._id,

      {
        $set: {
          upload: req.body.upload,
          propertyDetails: req.body.propertyDetails,
          amenities: req.body.amenities,
          locationAndAddress: req.body.locationAndAddress,
          typesAndPurpose: req.body.typesAndPurpose
        },
      }

      // typesAndPurpose: ,
      // locationAndAddress: req.body.locationAndAddress,
      // propertyDetails: req.body.propertyDetails,
      // rentalDetails: req.body.rentalDetails,
      // contactDetails: req.body.contactDetails,
      // amenities: req.body.amenities,
      // upload: req.body.upload,
      // impressions: req.body.impressions,
      // clicks: req.body.clicks
    );
    console.log("datas", updatedResult);
    return res.status(200).send({ message: "success", data: updatedResult });
    // const data = await
  } catch (error) {
    console.log(error);
    return res.status(400).send({ message: error.name });
  }
});

router.get("/delete-property/:id", async (req, res) => {
  try {
    const result = await Property.findByIdAndDelete(req.params.id);
    return res
      .status(200)
      .json({ message: "Property deleted successfully", data: result });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.name });
  }
});

router.post('/location-suggestions', async (req, res) => {
  // console.log("WOrking");
  const axios = require("axios");
  const apikey = process.env.GOOGLE_API_KEY;
  
    const { value } = req.body;
    let addressList = [];
    try {
      const response = await axios.post(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${value}&location=${LATITUDE},${LONGITUDE}&radius=500&types=establishment&key=${apikey}`
      );
      if (response.data) {
        let Data = response.data["predictions"];

        for (let element of Data) {
          temp = {
            address: element["structured_formatting"]["main_text"],
            fulladdress: element["description"],
          };
          addressList.push(temp);
        }

        addressList.length !== 0
          ? res.status(200).send(addressList)
          : res.status(200).send([]);
          // console.log("Address list", addressList);
      } else {
      }
    } catch (error) {
      // Handle errors if the request fails
      res.status(500).send(error);
    }
})

router.get("/category-counts", async (req, res) => {
  // console.log("length requested before", req.params.category);
  try {
    const catLength = {
      commercial : (await Property.find({ 'typesAndPurpose.category': 'commercial' })).length,
      apartment : (await Property.find({ 'typesAndPurpose.subCategory': 'apartment' })).length,
      villa : (await Property.find({ 'typesAndPurpose.subCategory': 'villa' })).length,
      residential : (await Property.find({ 'typesAndPurpose.category': 'residential' })).length,
      townhouse : (await Property.find({ 'typesAndPurpose.subCategory': 'townHouse' })).length,
    }
    // const result = await Property.find({ 'typesAndPurpose.category': req.params.category });
    // .skip(0)
    // .limit(3);
    console.log("length requested after", catLength);
    return res.status(200).send({ message: "success", data: catLength });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
