import * as nodeCrypto from "crypto";



async function randomUUIDToBase64url(uuid:string, length = 6) {
    // Create a SHA-256 hash of the UUID
    const hash = nodeCrypto.createHash('SHA512').update(uuid).digest();
    const base64url = hash.toString('base64url')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
    .substring(0, length); // Take the first 6 characters

    return base64url;
}

// Example usage
const uuid = '20093a9b-1554-4675-a932-4f2113e4c35d'
console.log(uuid);
const result = await randomUUIDToBase64url(uuid);
console.log(result);

export { };
