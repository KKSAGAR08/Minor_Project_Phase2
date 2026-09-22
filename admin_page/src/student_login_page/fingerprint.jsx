import { useState } from "react";

export default function FingerprintRegister() {
  const [credential, setCredential] = useState(null);
  const [verified, setVerified] = useState(false);

  async function registerFingerprint() {
    try {
      // Example "dummy" options (normally come from backend)
      const publicKey = {
        challenge: new Uint8Array([
          0x8C, 0xFA, 0xB4, 0x3D, 0x12, 0x7A, 0x5E, 0x99,
        ]),
        rp: {
          id: window.location.hostname,
          name: "My React App",
        },
        user: {
          id: new Uint8Array([1, 2, 3, 4]), // unique user ID
          name: "testuser",
          displayName: "Test User",
        },
        pubKeyCredParams: [{ type: "public-key", alg: -7 }], // ES256
      };

      const cred = await navigator.credentials.create({ publicKey });

      console.log("Credential created:", cred);
      setCredential(cred);
      alert("Fingerprint registered!");
    } catch (err) {
      console.error("Error creating credential:", err);
      alert("Fingerprint/biometric not available or canceled.");
    }
  }

  async function verifyFingerprint() {
    try {
      if (!credential) {
        alert("Please register first!");
        return;
      }

      const publicKey = {
        challenge: new Uint8Array([
          0x11, 0x22, 0x33, 0x44, // random dummy challenge
        ]),
        rpId: window.location.hostname,
        allowCredentials: [
          {
            type: "public-key",
            id: new Uint8Array(
              credential.rawId ? new Uint8Array(credential.rawId) : []
            ),
          },
        ],
        userVerification: "required",
      };

      const assertion = await navigator.credentials.get({ publicKey });

      console.log("Assertion (login result):", assertion);
      setVerified(true);
      alert("Fingerprint verified!");
    } catch (err) {
      console.error("Error verifying credential:", err);
      alert("Verification failed or canceled.");
    }
  }

  return (
    <div className="p-6 space-y-4">
      <button
        onClick={registerFingerprint}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        Register Fingerprint
      </button>

      <button
        onClick={verifyFingerprint}
        className="px-4 py-2 bg-green-500 text-white rounded-lg"
      >
        Verify Fingerprint
      </button>

      {credential && (
        <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
          {JSON.stringify(credential,null,2)}
        </pre>
      )}

      {verified && <p className="text-green-600 font-semibold">✅ Verified!</p>}
    </div>
  );
}
