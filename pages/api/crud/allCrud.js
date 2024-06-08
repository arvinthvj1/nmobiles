import { connectToDatabase } from "../MdbConnect/mongodb";
import { ObjectId } from "mongodb";
export default async function handler(req, res) {
  const { method, body } = req;
  const { collectionName, document, type, pipeline, filters } = body;
  if (method === "POST") {
    if (type == "insert") {
      if (!collectionName || !document) {
        return res.status(400).json({
          error: "Collection name and document are required for POST request.",
        });
      }
      try {
        const client = await connectToDatabase();
        const collection = client.db().collection(collectionName);
        
        // Check if a document with the same values already exists
        const existingDocument = await collection.findOne(document);
        if (existingDocument) {
          // Handle the case where a matching document is found
          return res.status(409).json({ message: 'Document with the same values already exists' });
        }
        
        // Fetch the counter for the current collection
        const countersCollection = client.db().collection("counters");
        const counterDoc = await countersCollection.findOneAndUpdate(
          { _id: collectionName },
          { $inc: { value: 1 } }, // Increment the counter value
          { upsert: true, returnOriginal: false }
        );
        
        // Use the counter value as the ID for the new document
        if (counterDoc?.value) {
          console.error("counterDoc.value", counterDoc);
          document.id = (counterDoc.value) + 1; // Directly access the incremented value
        } else {
          console.error("counterDoc.value is null:", counterDoc);
          document.id = 1; // Fallback to 1 if something goes wrong
        }
        
        // Insert the document into the collection
        const result = await collection.insertOne(document);
        return res.status(201).json(result);
        
      } catch (error) {
        console.error("Error processing request:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    } else if (type == "get") {
      console.log("entered get req")
      if (!collectionName || !pipeline) {
        return res.status(400).json({
          error: "Collection name and document are required for POST request.",
        });
      }
      console.log("entered get req");
      try {
        const client = await connectToDatabase();
        const collection = client.db().collection(collectionName);
        const result = await collection.aggregate(pipeline).toArray();
        return res.status(200).json(result);
      } catch (error) {
        console.error("Error processing request:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    } else if (type == "delete") {
      if (!collectionName || !filters) {
        return res.status(400).json({
          error: "Collection name and filter are required for DELETE request.",
        });
      }
      if (Object.keys(filters).includes("_id")) {
        console.log("_id object enetered");
        filters["_id"] = new ObjectId(filters["_id"]);
      }
      try {
        const client = await connectToDatabase();
        const collection = client.db().collection(collectionName);

        const result = await collection.deleteOne(filters);
        return res.status(200).json(result);
      } catch (error) {
        console.error("Error processing request:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    } else if (type === "update") {
      if (!collectionName || !filters || !filters._id) {
        return res.status(400).json({
          error:
            "Collection name, document, and document ID are required for PUT request.",
        });
      }
      const { _id, ...updatedDocument } = filters;
      console.log(filters);
      console.log("updated doc preview", updatedDocument);
      try {
        const client = await connectToDatabase();
        const collection = client.db().collection(collectionName);

        const filter = { _id: new ObjectId(_id) };
        const updateResult = await collection.updateOne(filter, {
          $set: updatedDocument,
        });

        if (updateResult.modifiedCount === 1) {
          return res
            .status(200)
            .json({ message: "Document updated successfully" });
        } else {
          return res.status(404).json({ error: "Document not found" });
        }
      } catch (error) {
        console.error("Error processing request:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
