import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const CreateNewUser = mutation({
    args:{
        name:v.string(),
        email:v.string(),
        pictureURL:v.string(),
    },
    handler:async(convexToJson,args) => {
        const user=await convexToJson.db.query('users')
        .filter((q)=>q.eq(q.field('email'),args.email))
        .collect();

        if(!user[0]?.email){
            const result=await convexToJson.db.insert('users',{
                name:args.name,
                email:args.email,
                pictureURL:args.pictureURL,
                credits:3
            })
            return result;
        }
        return user[0];
    }
})