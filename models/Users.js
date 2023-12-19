const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//user schema
const UserListSchema = new Schema({
   seq: { 
      type: Number, 
      required: true, 
      unique: true 
   },
   otherList: {
      type: Number, 
      required: true, 
      unique: true 
   },
   name: { 
      type: String, 
      required: true 
   },
   target: Boolean,
 });

 //user schema
const EveryWorksSchema = new Schema({
   id: Number, 
   content: String,
   highlight: String
 });

 //user schema
const TargetWorksSchema = new Schema({
   id: Number, 
   content: String,
   highlight: String,
   checked: Boolean
 });



const Datas = mongoose.model("datas", UserListSchema);
const EveryWorks = mongoose.model("everyWorks", EveryWorksSchema);
const TargetWorks = mongoose.model("TargetWorks", TargetWorksSchema);

module.exports = { Datas, EveryWorks, TargetWorks };