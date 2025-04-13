

const cache = new Map(key, value)

// frequently accessed toute as a key and cache the hydrated html page
const freURL = "http://localhost:3000/jobs"


cache.set(freURL, "")

if (exists) {
    return cache.get(freURL)
}

