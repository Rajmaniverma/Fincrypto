import { connectDB } from "@/lib/mongodb";
import user from "@/model/user";


export async function POST(req){
    try{
        await connectDB();
        const body = await req.json();
        const User = await user.create({
           Company_name:body.Company_name,
           Graph:body.Graph,
           Candle:body.Candle
           


        });
       return Response.json({
    success: true,
    user: User,
    message: "send succesfully"
});

        
        

        }
        catch(err){
                return Response.json({
      success: false,
      error: err.message,
    });
    }
}