
const wait = (ms:any) => new Promise(resolve => setTimeout(resolve, ms));   
type JobStatus = "pending" | "processing" | "success" | "failed";

const MAX_RETRIES = 3;
const BASE_DELAY = 500;

interface Job{
    id: string,
    email: string,
    amount: number,
    status: JobStatus,
    attemtps: number;

}

interface RetryQueue{
    jobId: string,
    attempt: number,
    retryAt:number
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
    const delay = Math.pow(2,attempt - 1);
    return delay;
}

const processRequest = async (jobid: string, attempt:number): Promise<void> =>{
    const job = jobs.get(jobid);
    if(!job)return;

    job.status = "processing";
    job.attemtps = attempt;
    jobs.set(jobid,job);

    console.log(`Processing: [${jobid}]`);

    const outcome = getRandomResponse();

    if(outcome === "failure"){
        
        if(attempt<MAX_RETRIES){
            const delay = BASE_DELAY * getDelay(attempt);
            const retryAt = Date.now() + delay;
            queue.push({jobId:job.id,attempt:attempt+1,retryAt:retryAt});
            job.status="pending";
            jobs.set(jobid,job);
        }else{
            job.status="failed";
            jobs.set(jobid,job);
        }
        console.log(`Failed: [${jobid}]`);
        return;
    }

    if(outcome == "delayed"){
        console.log(`Delayed : [${jobid}]`);
        const delay = Math.floor(Math.random() * 5000) + 5000;
        await wait(delay);

    }

    job.status = "success"
    jobs.set(jobid, job);
    console.log(`Success: [${jobid}]`);
}

const startWorker = ()=>{
    setInterval(async()=>{
        const now = Date.now();

        const toRetryIndexes = queue
            .map((item, index) => ({ item, index }))
            .filter(({ item }) => item.retryAt <= now)

        for (const { item, index } of toRetryIndexes) {
            queue.splice(index, 1)
            processRequest(item.jobId, item.attempt)
        }
    }, 1000)
}


export const pushJob = (key:string, email:string, amount:number):Job =>{

    if(jobs.has(key)){
        console.log(`Duplicate Found : [${key}]`);
        return jobs.get(key)!;
    }

    const job:Job ={
        id:key,
        email,
        amount,
        status:"pending",
        attemtps:0
    }

    jobs.set(key,job);
    processRequest(key,1).catch();
    return job;

}

export const getJobStatus = (jobId: string): Job | null => {
    return jobs.get(jobId) ?? null
}
startWorker()
console.log("Worker Started");