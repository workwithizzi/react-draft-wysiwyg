import { MongoClient } from "mongodb";

const MONGO_OPTIONS = {
	useUnifiedTopology: true,
	useNewUrlParser: true,
};

async function postContent(req, res) {
	const { name } = req.query;
	const client = await MongoClient.connect(process.env.MONGO_SRV, MONGO_OPTIONS);
	const db = client.db(process.env.DB_NAME);
	await db.collection("content").insertOne({ block: req.body, name });
	res.status(200).json({});
}

async function getContent(req, res) {
	const { name } = req.query;
	const client = await MongoClient.connect(process.env.MONGO_SRV, MONGO_OPTIONS);
	const db = client.db(process.env.DB_NAME);
	const data = await db.collection("content").find({ name }).toArray();
	console.log(data);
	res.status(200).json(data);
}

export default async(req, res) => {
	switch (req.method) {
	case "GET":
		await getContent(req, res);
		break;
	case "POST":
		console.log(req.body);
		await postContent(req, res);
		break;
	default:
		res.status(405).json({});
	}
};
