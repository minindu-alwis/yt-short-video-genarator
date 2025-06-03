import axios from "axios";
import { inngest } from "./client";
import { createClient } from "@deepgram/sdk";
import { GenarateImageScript } from "@/configs/AiModel";

export const helloWorld = inngest.createFunction(
    { id: "hello-world" },
    { event: "test/hello.world" },
    async ({ event, step }) => {
        await step.sleep("wait-a-moment", "1s");
        return { message: `Hello ${event.data.email}!` };
    },
);

const ImagePromtScript = `Genarate Image promt of (style) style
with all details for each scene for 30 seconds video : script : {script}
- Just Give specifing image prompt depends on story line 
- don not give camera angle image promt
-follow the following schema and return JSON data (MAX 4-5 Images)
-[{
    imagePrompt:'',
    sceneContetnt: '<Script Content>'
}]`


const BASE_URL = 'https://aigurulab.tech';
export const GenarateVideoData = inngest.createFunction(
    { id: "genarate-video-data" },
    { event: "genarate-video-data" },
    async ({ event, step }) => {

        const { script, topic, title, caption, videoStyle, voice ,recordId} = event?.data;
        //Genarate Audio file MP3
        const GenarateAudioFile = await step.run(
            "GenarateAudioFile", async () => {

                // const result = await axios.post(BASE_URL + '/api/text-to-speech',
                //     {
                //         input: script,
                //         voice: voice
                //     },
                //     {
                //         headers: {
                //             'x-api-key': process.env.NEXT_PUBLIC_AIGURULAB_API_KEY, // Your API Key
                //             'Content-Type': 'application/json', // Content Type
                //         },
                //     })
                // console.log(result.data.audio) //Output Result: Audio Mp3 Url


                // return result.data.audio;
                return "https://firebasestorage.googleapis.com/v0/b/projects-2025-71366.firebasestorage.app/o/audio%2F1748785674547.mp3?alt=media&token=4e2f93a4-0006-4323-a4c3-438959b09454"
            });

        //Genarate Captions
        const GenaratedCaptions = await step.run(
            "genarateCaptions",
            async () => {
                const deepgram = createClient(process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY);

                const { result, error } = await deepgram.listen.prerecorded.transcribeUrl(
                    {
                        url: GenarateAudioFile,
                    },
                    // STEP 3: Configure Deepgram options for audio analysis
                    {
                        model: "nova-3",
                        smart_format: true,
                    }
                );
                return result.results?.channels[0]?.alternatives[0]?.words;
            }


        )

        //Genarate Image Promt From  Script
        const GenaratedImagePromts = await step.run(
            "geanarateImagePromt",
            async () => {
                const FINAL_PROMPT = ImagePromtScript.replace
                    ('{style}', videoStyle).replace('script', script);
                const result = await GenarateImageScript.sendMessage(FINAL_PROMPT);
                const resp = JSON.parse(result.response.text());

                return resp;
            }
        )
        //Gwnarate Images using ai

        const GenarateImages = await step.run(
            "genarateImages",
            async () => {
                let images = [];
                images = await Promise.all(
                    GenaratedImagePromts.map(async (element) => {
                        const result = await axios.post(BASE_URL + '/api/generate-image',
                            {
                                width: 1024,
                                height: 1024,
                                input: element?.imagePrompt,
                                model: 'sdxl',//'flux'
                                aspectRatio: "1:1"//Applicable to Flux model only
                            },
                            {
                                headers: {
                                    'x-api-key': process.env.NEXT_PUBLIC_AIGURULAB_API_KEY, // Your API Key
                                    'Content-Type': 'application/json', // Content Type
                                },
                            })
                        console.log(result.data.image) //Output Result: Base 64 Image
                            return result.data.image
                    })
                )
                return images;
                
            }
            
            
        )

        //Save All To database

        return GenarateImages;
    }
)



