db = db.getSiblingDB("shop");

db.users.insertMany([
  {
    _id: ObjectId("68c59cebf2b7f6e17ff9ea08"),
    name: "Igor",
    email: "test@example.com",
    cart: {
      items: [],
    },
  },
  {
    _id: ObjectId("68c49525baa988da36319592"),
    name: "Ben",
    email: "yees@example.com",
    cart: {
      items: [],
    },
  },
]);
