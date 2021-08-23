import Item from "./model/ItemModel.js";

export const item1 = new Item({
  name: "Clean the room",
});

export const item2 = new Item({
  name: "do the homework",
});

export const item3 = new Item({
  name: "play some games",
});

const defaultItems = [item1, item2, item3];

export default defaultItems;
