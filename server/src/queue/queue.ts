
type JobStatus = "pending" | "processing" | "success" | "failed";

const MAX_RETRIES = 3;


interface Job{
    id: string,
    email: string,
    amount: string,
    status: JobStatus,
    attemtps: number;

}

interface RetryQueue{
    jobId: string,
    attempt: number,
    processat:number
}


const jobs = new Map<string,Job>();
const queue:RetryQueue[]=[];

const getRandomResponse = () =>{
    const randomNumber = Math.random() * 10;
    if(randomNumber < 4) return 'success';
    if(randomNumber >=4 && randomNumber < 7) return "delayed";
    return "failure";
}

const getDelay = (attempt:number) =>{
    const delay = Math.pow(2,attempt-1)
}

const processRequest = async (jobid: string, attempt:number) =>{
    const job = jobs.get(jobid);
    if(!job)return;

    job.status = "processing";
    job.attemtps = attempt;
    jobs.set(jobid,job);

    const outcome = getRandomResponse();

    if(outcome === "failure"){
        
        if(attempt<MAX_RETRIES){
            const delay = getDelay(attempt)
        }

    }
}