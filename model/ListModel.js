import { itemsSchema } from "./ItemModel.js";
import mongoose from "mongoose";
// ListSchema
const listSchema = {
  name: String,
  items: [itemsSchema],
};

const List = mongoose.model("List", listSchema);
export default List;
