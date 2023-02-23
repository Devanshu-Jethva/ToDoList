require("dotenv").config();
const express = require("express");
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// mongodb connection
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("connection successful");
}).catch((e) => {
  console.log(e);
});

// database schema
const itemSchema = {
  name: String
};
// database model following created schema - collection name(Items) in singular form as shown
const MyModel = mongoose.model('Item', itemSchema);
// 3 documents for our collection by targeting our model
const item1 = new MyModel({
  name: "Welcome to your ToDo list"
});
const item2 = new MyModel({
  name: "Hit the + to add new task"
});
const item3 = new MyModel({
  name: "<-- Hit this to delete task"
});
const defaultItems = [item1, item2, item3];



app.get("/", function (req, res) {

  MyModel.find({}, (e, foundItems) => {
    // console.log(foundItems);
    if (foundItems.length === 0) {
      MyModel.insertMany(defaultItems, (e) => {
        if (e) {
          console.log("unsuccessful");
        } else {
          console.log("successful");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", { listTitle: "Today", newListItems: foundItems });
    }

  })

});

app.post("/", function (req, res) {

  const item = new MyModel({
    name: req.body.newItem
  })

  item.save();
  res.redirect("/");
});

app.post("/delete", (req, res) => {
  const checkedId = req.body.checkbox;
  MyModel.findByIdAndRemove(checkedId, (e) => {
    if (e) {
      console.log(e);
    }
    else {
      res.redirect("/");
    }
  })
})

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
