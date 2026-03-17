# Async Form Submission App (Retry + Idempotency)

## Overview

This project is a **single-page web app** that simulates a real-world async API system with:

* Random API outcomes (success, failure, delayed)
* Automatic retry mechanism
* Idempotent request handling (no duplicates)
* Real-time UI state updates

---

## Tech Stack 
* Frontend - ReactJs
* Backend - Nodejs (TypeScript) + Express 


## How It Works

1. User submits form (`email`, `amount`)
2. UI immediately shows **pending**
3. Request is sent with a **unique job ID**
4. Backend processes request asynchronously
5. Frontend polls for status updates
6. UI updates to:

   * ✅ success
   * ❌ failed

---

## State Transitions

Each request follows this lifecycle:

```
           +-----------+
           |  pending  |
           +-----------+
                 |
                 v
           +-------------+
           | processing  |
           +-------------+
            /     |     \
           v      v      v
      success   failed   pending (retry)
```

### Explanation
```

* **pending → processing**

  * Job is picked by the worker

* **processing → success**

  * Request completes successfully

* **processing → failed**

  * Retries exhausted → terminal state

* **processing → pending (retry)**

  * Temporary failure → scheduled for retry

```

### States
```

* **pending**

  * Immediately shown after form submission
  * Also used when retry is scheduled

* **processing**

  * Backend is actively handling the request

* **success (terminal)**

  * Request completed successfully

* **failed (terminal)**

  * All retry attempts exhausted
```

## Retry Logic
```

The system automatically retries **temporary failures (503-like scenarios)**.

### Configuration

* Max retries: **3**
* Base delay: **500ms**
* Strategy: **Exponential Backoff**   

### How It Works

On failure:

1. Check:

   ```
   attempt < MAX_RETRIES
   ```

2. If retries remain:

   ```
   delay = BASE_DELAY * (2^(attempt - 1))
   ```

   * Job is rescheduled
   * State goes back to `pending`

3. If limit reached:

   * Job is marked as `failed`
```

## Duplicate Prevention (Idempotency)
```
### Problem

Users may:

* Double click submit
* Retry due to network issues

This can create duplicate records.

### Solution

Each request uses a **unique ID (idempotency key)**.

### Implementation

```ts
if (jobs.has(key)) {
    return jobs.get(key);
}
```

### Result

* Same request → same job
* No duplicate processing
* Safe retries from frontend

---

## UI Behavior

* On submit → instantly shows **Pending**
* Polls backend every second
* Stops polling when:

  * success
  * failed

---

## Mock API Behavior

The backend simulates real-world unpredictability:

* **Success (200)** → immediate success
* **Failure (503)** → triggers retry logic
* **Delayed success** → responds after 5–10 seconds

---

## How to Run

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd <project-folder>
```

---

### 2. Start Backend (Express + TypeScript)

```bash
cd server
npm install
npm run dev
```

* Runs on: `http://localhost:3000`

---

### 3. Start Frontend (React)

```bash
cd client
npm install
npm run dev
```

* Runs on: `http://localhost:5173` (or as shown in terminal)

---

### 4. Use the App

1. Open frontend in browser
2. Enter email + amount
3. Submit form
4. Observe:

   * Pending → Success / Failed
   * Automatic retries happening in background

---

## Important Note

This implementation uses:

* In-memory storage (`Map`, arrays)
* In-memory retry queue

### Why?

To keep the system simple and focused on logic.

### Production Alternatives

Replace in-memory components with:

* **Redis (Queues / Streams)** → for retries, delays, idempotency
* **Kafka** → for scalable event-driven processing

---

## Key Takeaways

* Async processing with polling
* Retry with exponential backoff
* Idempotent request handling
* Clear UI state management

---
