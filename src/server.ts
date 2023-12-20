import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { graphqlHTTP } from "express-graphql";
import schema from "./graphql/graphql-schema.js";
import auth from "./middleware/auth.js";
import uploadRoute from "./upload/route.js";
import adminAuth from "./middleware/adminAuth.js";

const app: express.Application = express();

app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(cors());

app.use(auth);

app.use(adminAuth);

// app.get("/", (req: express.Request, res: express.Response) => {
// 	res.send("Hello, world!");
// });

app.use(
	"/graphql",
	graphqlHTTP({
		schema,
		graphiql: true,
	}),
);

app.use("/upload", uploadRoute);

export default app;
