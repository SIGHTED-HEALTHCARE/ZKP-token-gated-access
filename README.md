# **SIGHTED: Zero-Knowledge Proofs (ZKPs) for Token Verification**

### **ZKP Use Case: Privacy-Preserving Healthcare Workflow**  

SIGHTED integrates **Zero-Knowledge Proofs (ZKPs)** to enable **privacy-preserving token verification** on the **Internet Computer (ICP)**. Users can prove token ownership or meet certain conditions (e.g., token balance > 100) without revealing their actual balance. This project uses **Circom** for ZKP circuit generation, **snarkjs** for proof verification, and **Calimero** as the backend for verifying proofs.


Goal: Allow each entity to verify certain conditions (like diagnosis results, treatment details, or coverage eligibility) without accessing the full medical record.

Workflow
Patient: Generates a ZKP proving a condition (e.g., “diagnosed with X”, or “covered for Y treatment”) without revealing actual medical data.
Primary Care Provider (PCP): Requests proof that the patient is eligible for a specific treatment.
Radiologist: Verifies imaging results using ZKP and confirms the diagnosis.
Insurance Company: Verifies that the patient’s treatment is covered without seeing the full diagnosis or treatment history.




---

## **Architecture Overview**

1. **ZKP Circuit (Circom)**  
   - The `greater_than_100.circom` circuit checks if a user's token balance exceeds a threshold without revealing the actual balance.  

2. **Calimero Backend (Node.js)**  
   - Hosts a **JSON-RPC API** for verifying ZKPs using `snarkjs`.  

3. **ICP Frontend (Motoko)**  
   - Sends HTTPS outcalls to the Calimero backend for proof verification and uses the response to grant or deny access to SIGHTED features.

---

## **Features**
- **Privacy-Preserving Verification**: Users can prove they meet token balance requirements without revealing sensitive data.  
- **Seamless Integration**: Utilizes HTTPS outcalls from ICP canisters to verify proofs via the Calimero API.  
- **Fast Verification**: Uses zk-SNARKs for fast proof generation and verification.  

---

## **Installation Instructions**

### Prerequisites
- **Circom** (ZKP circuit compiler)  
  [Circom GitHub](https://github.com/iden3/circom)  

- **snarkjs** (Proof generation and verification)  
  Install globally:  
  ```bash
  npm install -g circom snarkjs
  ```

- **DFX CLI** for deploying ICP canisters.  
  [Install DFX](https://internetcomputer.org/docs/current/developer-docs/setup/install/)  

- **Node.js** for running the Calimero backend.  
  ```bash
  sudo apt install nodejs npm
  ```

---

## **Setup and Usage**

### **1. Compile the ZKP Circuit**
Navigate to the `circuits` directory and compile the circuit.
```bash
circom greater_than_100.circom --r1cs --wasm --sym
```

### **2. Generate Proofs**
```bash
snarkjs groth16 setup greater_than_100.r1cs pot12_final.ptau circuit_0000.zkey
snarkjs zkey export verificationkey circuit_0000.zkey verification_key.json
snarkjs generatewitness greater_than_100.wasm input.json witness.wtns
snarkjs groth16 prove circuit_0000.zkey witness.wtns proof.json public.json
```

### **3. Start the Calimero Backend**
```bash
cd backend
node calimero-zkp-backend.js
```

### **4. Deploy the ICP Canister**
```bash
dfx start --background
dfx deploy
```

### **5. Verify ZKPs from ICP (Motoko)**
Use the Motoko function `verifyZkp` to send proof and public signals to the Calimero API.
```motoko
public func verifyZkp(proof: Text, publicSignals: Text): async Bool {
  let url = "https://api.calimero.network/zkp/verify";  // Calimero API endpoint
  let body = Text.concat("{\"proof\": ", proof, ", \"publicSignals\": ", publicSignals, "}");
  let headers = [("Content-Type", "application/json")];

  let response = await Http.post(url, headers, body);
  switch (response.status) {
    case (200) { return true; };
    case (_) { return false; };
  }
}
```

---

## **Project Structure**
```
/circuits                 # ZKP circuit definitions
  greater_than_100.circom
  verification_key.json
/backend                  # Calimero backend for proof verification
  calimero-zkp-backend.js
/src                      # ICP frontend with HTTPS outcalls for proof verification
  main.mo
/tests                    # Unit tests
README.md
```

---

## **API Reference**

### **Calimero JSON-RPC API**
#### **Endpoint: `/zkp/verify`**
**Method**: `POST`  
**Request Body**:
```json
{
  "proof": "proof_data_here",
  "publicSignals": "public_signals_here"
}
```

**Response** (`200 OK`):
```json
{
  "isValid": true
}
```

---

## **Development Workflow**

1. **Modify the Circom Circuit** to add new verification conditions.  
2. **Expand the Calimero Backend** to support additional ZKP verification methods.  
3. **Deploy and Test** using `dfx` and `snarkjs`.

---

## **Future Enhancements**
- **WebSocket Support** for real-time proof verification.  
- **zk-STARK Integration** for improved scalability and post-quantum security.  
- **Cross-Chain Privacy Proofs** for ICP and Calimero.  
