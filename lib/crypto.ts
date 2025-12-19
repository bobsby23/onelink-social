export interface KeyPair {
  publicKey: string // Base64-encoded public key
  privateKey: string // Base64-encoded private key (NEVER sent to server)
}

export interface EncryptedData {
  encryptedContent: string // Base64-encoded encrypted data
  iv: string // Base64-encoded initialization vector
  encryptedKey?: string // Base64-encoded encrypted AES key (for RSA)
}

/**
 * Generate RSA-OAEP key pair for user
 * Used for sharing encrypted content with friends
 */
export async function generateKeyPair(): Promise<KeyPair> {
  const keyPair = await crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true, // extractable
    ["encrypt", "decrypt"],
  )

  // Export public key
  const publicKeyBuffer = await crypto.subtle.exportKey("spki", keyPair.publicKey)
  const publicKeyBase64 = arrayBufferToBase64(publicKeyBuffer)

  // Export private key
  const privateKeyBuffer = await crypto.subtle.exportKey("pkcs8", keyPair.privateKey)
  const privateKeyBase64 = arrayBufferToBase64(privateKeyBuffer)

  return {
    publicKey: publicKeyBase64,
    privateKey: privateKeyBase64,
  }
}

/**
 * Generate AES-GCM key for content encryption
 */
export async function generateAESKey(): Promise<CryptoKey> {
  return await crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true, // extractable
    ["encrypt", "decrypt"],
  )
}

/**
 * Encrypt content using AES-GCM
 * Returns encrypted content + IV
 */
export async function encryptContent(content: string, key: CryptoKey): Promise<EncryptedData> {
  const encoder = new TextEncoder()
  const data = encoder.encode(content)

  // Generate random IV
  const iv = crypto.getRandomValues(new Uint8Array(12))

  // Encrypt
  const encryptedBuffer = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    data,
  )

  return {
    encryptedContent: arrayBufferToBase64(encryptedBuffer),
    iv: arrayBufferToBase64(iv),
  }
}

/**
 * Decrypt content using AES-GCM
 */
export async function decryptContent(encryptedData: EncryptedData, key: CryptoKey): Promise<string> {
  const encryptedBuffer = base64ToArrayBuffer(encryptedData.encryptedContent)
  const iv = base64ToArrayBuffer(encryptedData.iv)

  const decryptedBuffer = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    encryptedBuffer,
  )

  const decoder = new TextDecoder()
  return decoder.decode(decryptedBuffer)
}

/**
 * Encrypt AES key with RSA public key (for sharing with friends)
 */
export async function encryptKeyWithPublicKey(aesKey: CryptoKey, publicKeyBase64: string): Promise<string> {
  // Import public key
  const publicKeyBuffer = base64ToArrayBuffer(publicKeyBase64)
  const publicKey = await crypto.subtle.importKey(
    "spki",
    publicKeyBuffer,
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    false,
    ["encrypt"],
  )

  // Export AES key as raw
  const aesKeyBuffer = await crypto.subtle.exportKey("raw", aesKey)

  // Encrypt AES key with RSA
  const encryptedKeyBuffer = await crypto.subtle.encrypt(
    {
      name: "RSA-OAEP",
    },
    publicKey,
    aesKeyBuffer,
  )

  return arrayBufferToBase64(encryptedKeyBuffer)
}

/**
 * Decrypt AES key with RSA private key
 */
export async function decryptKeyWithPrivateKey(
  encryptedKeyBase64: string,
  privateKeyBase64: string,
): Promise<CryptoKey> {
  // Import private key
  const privateKeyBuffer = base64ToArrayBuffer(privateKeyBase64)
  const privateKey = await crypto.subtle.importKey(
    "pkcs8",
    privateKeyBuffer,
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    false,
    ["decrypt"],
  )

  // Decrypt AES key
  const encryptedKeyBuffer = base64ToArrayBuffer(encryptedKeyBase64)
  const aesKeyBuffer = await crypto.subtle.decrypt(
    {
      name: "RSA-OAEP",
    },
    privateKey,
    encryptedKeyBuffer,
  )

  // Import AES key
  return await crypto.subtle.importKey(
    "raw",
    aesKeyBuffer,
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"],
  )
}

/**
 * Full encryption flow for private content
 * 1. Generate AES key
 * 2. Encrypt content with AES
 * 3. Return encrypted data (to be stored in Supabase)
 */
export async function encryptPrivateContent(content: string): Promise<{
  encryptedBlob: string
  aesKey: CryptoKey
}> {
  const aesKey = await generateAESKey()
  const encryptedData = await encryptContent(content, aesKey)

  // Combine encrypted content + IV into single blob
  const blob = JSON.stringify({
    content: encryptedData.encryptedContent,
    iv: encryptedData.iv,
  })

  return {
    encryptedBlob: blob,
    aesKey: aesKey,
  }
}

/**
 * Full encryption flow for friends-only content
 * 1. Generate AES key
 * 2. Encrypt content with AES
 * 3. Encrypt AES key with friend's public key
 * 4. Return encrypted data + encrypted key
 */
export async function encryptForFriend(content: string, friendPublicKey: string): Promise<EncryptedData> {
  const aesKey = await generateAESKey()
  const encryptedData = await encryptContent(content, aesKey)
  const encryptedKey = await encryptKeyWithPublicKey(aesKey, friendPublicKey)

  return {
    encryptedContent: encryptedData.encryptedContent,
    iv: encryptedData.iv,
    encryptedKey: encryptedKey,
  }
}

/**
 * Full decryption flow for friends-only content
 * 1. Decrypt AES key with user's private key
 * 2. Decrypt content with AES key
 */
export async function decryptFromFriend(encryptedData: EncryptedData, userPrivateKey: string): Promise<string> {
  if (!encryptedData.encryptedKey) {
    throw new Error("Missing encrypted key for friend content")
  }

  const aesKey = await decryptKeyWithPrivateKey(encryptedData.encryptedKey, userPrivateKey)
  return await decryptContent(encryptedData, aesKey)
}

/**
 * Decrypt private content with stored AES key
 */
export async function decryptPrivateContent(encryptedBlob: string, aesKey: CryptoKey): Promise<string> {
  const parsed = JSON.parse(encryptedBlob)
  const encryptedData: EncryptedData = {
    encryptedContent: parsed.content,
    iv: parsed.iv,
  }

  return await decryptContent(encryptedData, aesKey)
}

// Utility functions
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ""
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes.buffer
}

/**
 * Store private key securely in browser (IndexedDB)
 */
export async function storePrivateKey(userId: string, privateKey: string): Promise<void> {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(`onelink_private_key_${userId}`, privateKey)
  } catch (error) {
    console.error("Failed to store private key:", error)
    throw new Error("Unable to store encryption key. Please enable local storage.")
  }
}

/**
 * Retrieve private key from browser storage
 */
export function getPrivateKey(userId: string): string | null {
  if (typeof window === "undefined") return null

  try {
    return localStorage.getItem(`onelink_private_key_${userId}`)
  } catch (error) {
    console.error("Failed to retrieve private key:", error)
    return null
  }
}

/**
 * Delete private key from browser storage (logout)
 */
export function deletePrivateKey(userId: string): void {
  if (typeof window === "undefined") return

  try {
    localStorage.removeItem(`onelink_private_key_${userId}`)
  } catch (error) {
    console.error("Failed to delete private key:", error)
  }
}
