
import { connectDB } from "./mongodb";

export async function GET() {
  await connectDB();

  return Response.json({
    message: "API working",
  });
}