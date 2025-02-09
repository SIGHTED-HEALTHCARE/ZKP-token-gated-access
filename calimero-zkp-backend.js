const express = require('express');
const bodyParser = require('body-parser');
const snarkjs = require('snarkjs');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());

app.post('/zkp/verify', async (req, res) => {
  const { proof, publicSignals } = req.body;

  const verificationKey = JSON.parse(fs.readFileSync('verification_key.json'));

  const isValid = await snarkjs.groth16.verify(verificationKey, publicSignals, proof);
  
  if (isValid) {
    res.json({ isValid: true });
  } else {
    res.json({ isValid: false });
  }
});

app.listen(3000, () => console.log('ZKP verification server running on port 3000'));
