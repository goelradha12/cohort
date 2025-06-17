import { db } from "../libs/db.js";

(async () => await db.User.create({
  data: {
    name: 'admin',
    email: 'admin@leetlab.com',
    password: 'password',
    role: 'ADMIN',
  },
}))();