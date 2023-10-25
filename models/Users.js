const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create schema
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


const Datas = mongoose.model("datas", UserListSchema);

module.exports = Datas;