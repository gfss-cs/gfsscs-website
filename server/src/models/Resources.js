import mongoose from 'mongoose';

const ResourceSchema = new mongoose.Schema({
  name: String,
  url: String,
  description: String,
  category: String, 
  subcategory: String,
  priority: Number
});

export default mongoose.model('resources', ResourceSchema);