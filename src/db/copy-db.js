// ! copies database collections and their documents

// * USAGE DURING PROD - setting up MongoDB Atlas database
// ^ run with   `mongosh "mongodb+srv://nodejs-course.tvid3w8.mongodb.net/" --username [username] src/db/copy-db.js`

const SRC_DB = "s13-shop"; // source sb
const DST_DB = "s14-shop"; // target db
const colls = ["users", "products", "orders"]; // which collections should be copied

for (const name of colls) {
  db.getSiblingDB(SRC_DB)
    .getCollection(name)
    .aggregate([
      { $match: {} },
      {
        $merge: {
          into: { db: DST_DB, coll: name },
          on: "_id",
          whenMatched: "replace",
          whenNotMatched: "insert",
        },
      },
    ]);
}

print("Done");
