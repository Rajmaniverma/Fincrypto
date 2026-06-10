import { connectDB } from "@/lib/mongodb";
import User from "@/model/user";
import { NextResponse } from "next/server";

export async function GET(){
    await connectDB();
    const company = await User.find();
    return NextResponse.json({
        success:true,
        data:company
    })
}