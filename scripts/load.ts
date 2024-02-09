// Target URL to test
const start = Bun.nanoseconds()
const targetUrl = 'http://localhost:3000'

// Number of users
let requests = 0
const numUsers = 10

// Number of requests per user
const requestsPerUser = 1000

const totalRequests = numUsers * requestsPerUser

function updateProgressBar() {
  const percent = Math.floor((requests / totalRequests) * 100)
  const barLength = Math.floor((percent / 100) * 75)
  const progressBar = `[${'='.repeat(barLength)}${' '.repeat(75 - barLength)}] ${percent}%`

  process.stdout.clearLine(-1) // Use -1 for the default direction
  process.stdout.cursorTo(0)
  process.stdout.write(progressBar)
}

// Function to make a single request
async function makeRequest() {
  try {
    const response = await fetch(targetUrl)
    requests++
    updateProgressBar()
  }
  catch (error) {
    const err = error as Error
    console.error(`Request failed: ${err.message}`)
    // Additional error handling logic if needed
  }
}

// Function to simulate user making requests
async function simulateUser() {
  const requests = Array.from({ length: requestsPerUser }, makeRequest)
  await Promise.all(requests)
}

// Function to run load test
async function runLoadTest() {
  const users = Array.from({ length: numUsers }, simulateUser)
  await Promise.all(users)
  const end = Bun.nanoseconds()
  const timeTaken = (end - start) / 1e9
  const requestsPerSecond = numUsers * requestsPerUser / timeTaken
  console.log(`\nLoad test complete. Time taken: ${timeTaken.toFixed(2)} seconds. Requests per second: ${requestsPerSecond.toFixed(2)}`)
}

// Run the load test
await runLoadTest()
export {}
