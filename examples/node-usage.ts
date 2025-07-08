import { LytDB, NodeStorage } from "../dist";

interface User {
  id: number;
  name: string;
  email: string;
  active: boolean;
}

interface Product {
  sku: string;
  name: string;
  price: number;
}

async function demoNodeUsage() {
  //Initialize witn Node.js storage
  const db = new LytDB({ persist: true });
  const storage = new NodeStorage({ storageKey: "myApp" });
  await db.initPersistence(storage);

  //create tables
  db.createTable<User>({ name: "users" });
  db.createTable<Product>({ name: "products" });

  //Insert data
  db.insert("users", {
    id: 1,
    name: "Alice",
    email: "p9Nw0@example.com",
    active: true,
  });
  db.insert("users", {
    id: 2,
    name: "Bob",
    email: "3dP7o@example.com",
    active: false,
  });
  db.insert("products", {
    sku: "A123",
    name: "Product A",
    price: 10.99,
  });
  db.insert("products", {
    sku: "B456",
    name: "Product B",
    price: 19.99,
  });

  //Query data
  const activeUsers = db.findAll<User>("users", (user) => user.active);
  console.log(`Active users: `, activeUsers);

  //update data
  const updateCount = db.update<Product>(
    "products",
    (product) => product.price > 100,
    { price: 899 }
  );
  console.log(`Updated ${updateCount} products with price > 100`);

  //export/import data
  const exported = await db.exportToBlob();
  console.log(`exported DB size: ${exported.length} bytes`);

  //clear and import
  db.delete("users", () => true);
  db.delete("products", () => true);
  await db.importFromBlob(exported);
  console.log(`All users after import: `, db.findAll<User>("users"));
  console.log(`All products after import: `, db.findAll<Product>("products"));

  //save to persistence
  await db.save();
  console.log(`Database operations completed successfully.`);
}

demoNodeUsage().catch(console.error);
