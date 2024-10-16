import { NextResponse } from "next/server";
import { Posts } from "../../../(models)/db";

export async function GET(req, { params }) {
  try {
    const posts = await Posts();
    return NextResponse.json(posts);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error fetching posts" },
      { status: 500 }
    );
  }
}
