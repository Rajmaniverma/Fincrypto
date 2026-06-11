import { connectDB } from "@/lib/mongodb";
import User from "@/model/user";


export async function POST(req){
    try{
    await connectDB();
    const body = await req.json();
    const company = await User.findOne({
       Company_name: body.CompanyName,

    });
    if(!company){
        return Response.json({
            success:false,
            message:"Company not found",
        });
    }
    return Response.json({
        success:true,
        Graph:company.Graph,
        Candle:company.Candle
    });
}
    catch(error){
     return Response.json({
        success:false,
        message:error.message
     })
    }

}