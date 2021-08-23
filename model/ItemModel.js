import mongoose from "mongoose";
export const itemsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "specified name please"],
  },
});
const Item = mongoose.model("Item", itemsSchema);
export default Item;
