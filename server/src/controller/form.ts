import { Request, Response } from "express"
import { pushJob, getJobStatus} from "../queue/queue";
const keys = new Set<string>
export const handleForm = async (req:Request,res:Response) =>{
    const {key, email, amount} = req.body;

    if(!key || !email || !amount){
        return res.status(400).json({"message":"Bad Request"});
    }

    if(isNaN(Number(amount)) || Number(amount) <= 0 )
        return res.status(400).json({"message":"Bad Request"});

    const job = pushJob(key,email,amount);
    res.status(202).json({
       "message":"Poll /form/:id for update"
    });

}

export const handleStatus = async(req:Request,res:Response) =>{
    const id = req.params.id as string;
    
    if (!id) {
        res.status(400).json({
            message: "Job ID is required"
        })
        return
    };

    const job =  getJobStatus(id);

    if (!job) {
        res.status(404).json({
            message: "Job not found"
        })
        return
    };

    res.status(200).json({
        status:   job.status,  
        jobId:    job.id,
        attempts: job.attemtps,
        email:    job.email,
        amount:   job.amount
    });
}