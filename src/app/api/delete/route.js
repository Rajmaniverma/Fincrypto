import { connectDB } from "@/lib/mongodb";
import User from "@/model/user";

export async function DELETE(){
    try{
    await connectDB();
  const data = await User.findOneAndDelete();
  

  return Response.json({
         success: true,
         user: data,
         message: "delete succesfully "
  });

}
catch(error){
    return Response.json({
        success:false,
        message:"delete unsuccesful"
    })
}
}