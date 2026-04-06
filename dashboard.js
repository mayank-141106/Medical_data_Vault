// Import required libraries
import { ethers } from "https://cdn.jsdelivr.net/npm/ethers@5.7.2/dist/ethers.esm.min.js";

// Axios import
const axios = window.axios || await import("https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js");

// Pinata API credentials
const pinataApiKey = '118bc10c9471a3afe4a7';
const pinataSecretApiKey = '5c38d81b735f95e3d912c49f3a4289b76de7c463d684596f341d09ae34a5a1d2';

// Initialize ethers.js provider and signer
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

// Smart contract setup
const contractAddress = '0xF806743fE2915f293e507d8a81E71c1205A8596D';
const contractABI = [
  {
    "inputs": [
      { "name": "patientId", "type": "string" },
      { "name": "ipfsHash", "type": "string" }
    ],
    "name": "addRecord",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "name": "patientId", "type": "string" }
    ],
    "name": "getRecords",
    "outputs": [
      {
        "name": "",
        "type": "tuple[]",
        "components": [
          { "name": "patientId", "type": "string" },
          { "name": "ipfsHash", "type": "string" },
          { "name": "timestamp", "type": "uint256" }
        ]
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// Initialize contract
const contract = new ethers.Contract(contractAddress, contractABI, signer);

// DOM Elements
const fileInput = document.getElementById('file-input');
const uploadButton = document.getElementById('upload-btn');
const patientIdUpload = document.getElementById('patient-id-upload');
const patientIdRetrieve = document.getElementById('patient-id-retrieve');
const retrieveButton = document.getElementById('retrieve-btn');
const dataDisplay = document.getElementById('data-display');
const aiInsightsSection = document.getElementById('ai-insights');
const aiSummary = document.getElementById('ai-summary');
const aiInsightsButton = document.getElementById('ai-insights-btn');
const loadingOverlay = document.getElementById('loading-overlay');
let isMetaMaskPopupOpen = false;
let currentIpfsHash = null;

// Helper functions
function showLoader() {
  loadingOverlay.style.display = 'flex';
  document.body.classList.add('loading');
}

function hideLoader() {
  loadingOverlay.style.display = 'none';
  document.body.classList.remove('loading');
}

// MetaMask popup detection
window.addEventListener('blur', () => {
  if (loadingOverlay.style.display === 'flex') {
    isMetaMaskPopupOpen = true;
    loadingOverlay.style.display = 'none';
  }
});

window.addEventListener('focus', () => {
  if (isMetaMaskPopupOpen) {
    loadingOverlay.style.display = 'flex';
    isMetaMaskPopupOpen = false;
  }
});

// File upload handler
uploadButton.addEventListener('click', async () => {
  const file = fileInput.files[0];
  const patientId = patientIdUpload.value.trim();

  if (!file || !patientId) {
    alert(!file ? 'Please select a PDF file.' : 'Please enter Patient ID.');
    return;
  }

  // Validate PDF file
  if (file.type !== 'application/pdf') {
    alert('Only PDF files are allowed.');
    return;
  }

  // Validate file size (10MB)
  if (file.size > 10 * 1024 * 1024) {
    alert('File size must be less than 10MB.');
    return;
  }

  try {
    showLoader();
    const ipfsHash = await uploadToPinata(file);
    const tx = await contract.addRecord(patientId, ipfsHash);
    await tx.wait();
    alert('Record added successfully!');
    fileInput.value = ''; // Clear file input
    patientIdUpload.value = ''; // Clear patient ID
  } catch (error) {
    console.error('Upload error:', error);
    alert(error.message.includes('user rejected transaction') 
      ? 'Transaction cancelled' 
      : 'Upload failed');
  } finally {
    hideLoader();
  }
});

// Retrieve data handler
retrieveButton.addEventListener('click', async () => {
  const patientId = patientIdRetrieve.value.trim();

  if (!patientId) {
    alert('Please enter Patient ID.');
    return;
  }

  try {
    showLoader();
    const records = await contract.getRecords(patientId);
    
    if (records.length === 0) {
      alert('No records found');
      return;
    }

    const latestRecord = records[0];
    currentIpfsHash = latestRecord.ipfsHash;
    const timestamp = new Date(latestRecord.timestamp * 1000).toLocaleString();

    dataDisplay.innerHTML = `
      <strong>Patient ID:</strong> ${latestRecord.patientId}<br>
      <strong>Timestamp:</strong> ${timestamp}<br>
      <a href="https://ipfs.io/ipfs/${currentIpfsHash}" target="_blank">View PDF</a>
    `;

    aiInsightsSection.style.display = 'block';
    aiSummary.textContent = 'Click "Get AI Insights" to generate summary.';
  } catch (error) {
    console.error('Retrieval error:', error);
    alert('Failed to retrieve data');
  } finally {
    hideLoader();
  }
});

// AI Insights handler
aiInsightsButton.addEventListener('click', async () => {
  if (!currentIpfsHash) {
    alert('No file available for analysis.');
    return;
  }

  try {
    showLoader();
    const response = await fetch(`https://ipfs.io/ipfs/${currentIpfsHash}`);
    const pdfBlob = await response.blob();
    const text = await extractTextFromPDF(pdfBlob);
    const summary = await getAIInsights(text);
    aiSummary.textContent = JSON.parse(summary).candidates[0].content.parts[0].text;

  } catch (error) {
    console.error('AI analysis error:', error);
    alert('Failed to generate insights');
  } finally {
    hideLoader();
  }
});

// Pinata upload function
async function uploadToPinata(file) {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          pinata_api_key: pinataApiKey,
          pinata_secret_api_key: pinataSecretApiKey,
        },
      }
    );
    return response.data.IpfsHash;
  } catch (error) {
    console.error('Pinata upload error:', error);
    throw new Error('Failed to upload to IPFS');
  }
}

// PDF text extraction (Replace with actual implementation)
async function extractTextFromPDF(pdfBlob) {
  // Implementation example using PDF.js:
  const pdf = await pdfjsLib.getDocument(URL.createObjectURL(pdfBlob)).promise;
  let text = '';
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map(item => item.str).join(' ');
  }
  
  return text;
}

// AI Insights (Replace with actual API call)
async function getAIInsights(text) {
  try {
    // Make a POST request to the backend to generate insights
    const response = await axios.post('http://localhost:3000/api/generate-insights', {
      text: text.substring(0, 10000) // Limit input size to 10,000 characters
    });

    if (response.data.success) {
      return response.data.insights;
    }
    throw new Error('No insights generated');
  } catch (error) {
    console.error('AI Error:', error);
    throw new Error('Failed to generate insights: ' + error.message);
  }
}


// Logout functionality
document.querySelector('.logout-btn').addEventListener('click', () => {
  window.location.href = 'login.html';
}); 