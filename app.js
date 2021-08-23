//-----------Require Express--------------------------------------------------
// const express = require("express");
import express from "express";
const app = express();
//-----------Require Lodash--------------------------------------------------
//handle of lower and upper case text
// const _ = require("lodash");
import _ from "lodash";

//-----------Require mongoose (Data base handler)-----------------------------
// const mongoose = require("mongoose");
import mongoose from "mongoose";

//-----------Require ejs (Embedded JavaScript template)----------------------
// let ejs = require("ejs");
import ejs from "ejs";
app.set("view engine", "ejs");

//------------Require path module (file and directory paths)------------------
// const path = require("path");
import path from "path";

//------------dotenv------------------
import dotenv from "dotenv";
dotenv.config();

//---------global const ------------------------------------------------------
// const getDate = require("./date");
import getDate from "./date.js";
// const date = require(__dirname + "/date.js");
const dateAndTime = getDate();

//---------bodyParser substitute (request and sending responses)---------------
app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

//---------create absolute path---------------
import { dirname } from "path";
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname + "/public")));

//----------add your own db at fruitsDB-----------------
import connectDB from "./config/db.js";
import defaultItems from "./constants.js";
connectDB();
//--------------Create New Schema-------------------------------------------------
// ItemSchema

//-------------Create New Mongoose Model -----------------------------------------
import List from "./model/ListModel.js";
import Item from "./model/ItemModel.js";
//---------Post request (handled incoming data)-----------------------------
app.post("/", async (req, res) => {
  const itemName = req.body.toDo;
  const listName = req.body.list;
  //   console.log(listName);
  //   return;

  const item = new Item({
    name: itemName,
  });

  if (listName === "Today") {
    item.save();
    res.redirect("/");
  } else {
    const foundList = await List.findOne({
      name: listName,
    });
    foundList.items.push(item);
    foundList.save();
    res.redirect("/" + listName);
    // List.findOne(
    //   {
    //     name: listName,
    //   },
    //   (err, foundList) => {
    //     if (err) {
    //       console.log(err);
    //     } else {
    //       foundList.items.push(item);
    //       foundList.save();
    //       res.redirect("/" + listName);
    //     }
    //   }
    // );
  }
});

//Delete data from the data base
app.post("/delete", async (req, res) => {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {
    await Item.findByIdAndDelete({ _id: checkedItemId });
    // Item.findByIdAndRemove(
    //   {
    //     _id: checkedItemId,
    //   },
    //   (err) => {
    //     if (!err) {
    //       console.log("Successfully deleted checked item");
    //     }
    //   }
    // );
    res.redirect("/");
  } else {
    await List.findOneAndUpdate(
      {
        name: listName,
      },
      {
        $pull: {
          items: {
            _id: checkedItemId,
          },
        },
      }
    );
    res.redirect("/" + listName);

    // List.findOneAndUpdate(
    //   {
    //     name: listName,
    //   },
    //   {
    //     $pull: {
    //       items: {
    //         _id: checkedItemId,
    //       },
    //     },
    //   },
    //   (err, foundList) => {
    //     if (!err) {
    //       res.redirect("/" + listName);
    //     }
    //   }
    // );
  }
});

//------------get requests -------------------------------------------------
app.get("/", async (req, res) => {
  //----------------------Using Model to create Objects------------------------

  const lists = await List.find({});

  //   const listOfProjects = lists.map((list) => {
  //     return list.name;
  //   });

  const listOfProjects = [];

  lists.forEach((list) => {
    listOfProjects.push(list.name);
  });

  const items = await Item.find({});

  res.render("list", {
    ToDoList: "Today",
    dateAndTime,
    newListItems: items,
    listOfProjects,
  });
});

app.get("/:customListName", async (req, res) => {
  const customListName = _.capitalize(req.params.customListName);

  //----------------------Using Model to create Objects------------------------
  let foundList = await List.findOne({
    name: customListName,
  });
  if (!foundList) {
    //create a new list
    foundList = new List({
      name: customListName,
      items: defaultItems,
    });
    foundList.save();
  }
  //Show an existing list

  const lists = await List.find({});
  const listOfProjects = [];
  lists.forEach((list) => {
    listOfProjects.push(list.name);
  });

  res.render("list", {
    ToDoList: foundList.name,
    newListItems: foundList.items,
    dateAndTime: dateAndTime,
    listOfProjects: listOfProjects,
  });
  //   List.findOne(
  //     {
  //       name: customListName,
  //     },
  //     async (err, foundList) => {
  //       if (!err) {
  //         if (!foundList) {
  //           //create a new list
  //           const list = new List({
  //             name: customListName,
  //             items: defaultItems,
  //           });
  //           list.save();
  //           res.redirect("/" + customListName);
  //         } else {
  //           //Show an existing list

  //           const lists = await List.find({});
  //           const listOfProjects = [];
  //           lists.forEach((list) => {
  //             listOfProjects.push(list.name);
  //           });

  //           const items = await Item.find({});

  //           res.render("list", {
  //             ToDoList: foundList.name,
  //             newListItems: foundList.items,
  //             dateAndTime: dateAndTime,
  //             listOfProjects: listOfProjects,
  //           });
  //         }
  //       }
  //     }
  //   );
});

app.get("/about", (req, res) => {
  res.render("about");
});

let port = process.env.PORT || 5000;
// if (port == null || port == "") {
//   port = 3000;
// }

app.listen(port, function (res, req) {
  console.log(`server started in port ${port}`);
});
