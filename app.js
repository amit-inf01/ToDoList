const express = require("express");
const bodyParser = require("body-parser");
const own = require(__dirname+"/date.js")
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://Amit0inf:Amit@zsefv@cluster0.w52bx.mongodb.net/todoappDB",{useNewUrlParser:true});

const itemsSchema={
  name: String
}
const Todo = mongoose.model("Item", itemsSchema);


const nameSchema ={
  name: String,
  items: [itemsSchema]
};
const Other = mongoose.model("Name",nameSchema);


const item1 = new Todo({
  name: "Wlcome to todoist!"
});
const item2 = new Todo({
  name: "Hit + to a new item"
})
const item3 = new Todo({
  name: "<-- Hit this to delete an item."
});

const Todos = [item1, item2, item3];




app.get("/", function(req, res) {
  Todo.find({},function(err,foundItems){
    if(foundItems.length===0){
      Todo.insertMany(Todos, function(err){
        if(err){
          console.log(err);
        }else{
          console.log("successfully added todos");
          res.redirect("/");
        }
      })
    }else{
     res.render("list", { dayName: "Today", newItem: foundItems , wButton: "general" });
}
  })
});

app.get("/:name",function(req,res){
  const urlName = _.capitalize(req.params.name);

  Other.findOne({name:urlName},function(err,founded){
    if(!err){
      if(!founded){
        const amit = new Other({
          name: urlName,
          items: Todos
        });
        amit.save();
          res.redirect("/"+urlName);
      }else{
        res.render("list", { dayName: founded.name, newItem: founded.items , wButton: urlName });
      }
    }
  } )
})






app.post("/",function(req,res){
  const button = req.body.button;
  if(button ==="general"){
    let todo = req.body.what;
    const todo1 = new Todo({
      name: todo
    })
    todo1.save();

    res.redirect("/")
  }else if(req.body.check){
    let List = req.body.list;
    let checkedID = req.body.check;
    if(List === "Today"){
      Todo.findByIdAndRemove(checkedID,function(err){
        if(err){
          console.log(err);
        }
        else{
          console.log("checked item deleted on todo");
          res.redirect("/");
        }
      })
    }else{
      Other.findOne({name:List},function(err,found){
        if(!err){
          found.items.forEach(function(element){
            if(element._id == checkedID){
              found.items.remove(element)
            }
          })
          found.save();
          res.redirect("/"+List);
        }})}
} else{
    Other.findOne({name: button},function(err,found){
      if(!err){
        let todo = req.body.what;
        const todo1 = new Todo({
          name: todo
        })
        found.items.push(todo1);
        found.save();
        res.redirect("/"+button)
      }
    })
  }
});



app.post("/delete",function(req,res){


  // Work.findByIdAndRemove(checkedID,function(err){
  //   if(err){
  //     console.log(err);
  //   }
  //   else{
  //     console.log("checked item deleted in work");
  //     res.redirect("/")
  //   }
  // })

})







app.listen(3000, function() {
  console.log("server at 3000");
})
