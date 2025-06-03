import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const CreateVideoData=mutation({
    args: {
         title:v.string(),
                topic:v.string(),
                script:v.string(),
                videoStyle:v.string(),
                caption:v.any(),
                voice:v.string(),
                uid:v.id('users'),
                createdBy:v.string(),
    },
    handler:async(convexToJson,args)=>{
        const result=await convexToJson.db.insert('videoData',{
            title:args.title,
            topic:args.topic,
            script:args.script,
            videoStyle:args.videoStyle,
            caption:args.caption,
            voice:args.voice,
            uid:args.uid,
            createdBy:args.createdBy,
            status: 'pending',
        })
        return result;
    }
})

export const UpdateVideoRecord=mutation({
    args:{
        recordId:v.id('videoData'),
        audioUrl:v.string(),
        images: v.array(v.string()),
        captionJson: v.any()
    },
    handler:async(ctx,args)=>{
        const result=await ctx.db.patch(args.recordId, {
            audioUrl: args.audioUrl,
            images: args.images,
            captionJson: args.captionJson,
            status: 'completed'
        })

        return result;
    }
})
