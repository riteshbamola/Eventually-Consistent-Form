import { Request, Response } from "express"

const keys = new Set<string>
export const handleForm = async (req:Request,res:Response) =>{
    const {id, email, amount} = req.body;

    if(!id || !email || !amount){
        return res.status(400).json({"message":"Bad Request"});
    }

    if(keys.has(id)){
        return res.status(200).json({"message":"Already Processed"});

    }
    

    const success = Math.random() * 10 > 4 ? true:false;

    if(success){

    }
}