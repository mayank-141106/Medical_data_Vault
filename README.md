# Medical Data Vault

## Overview

The Medical Data Vault is a decentralized application (dApp) designed to securely store and retrieve medical records using blockchain technology and IPFS (InterPlanetary File System). It allows healthcare providers to upload patient records as PDFs, store them on IPFS, and retrieve them using a unique Patient ID. Additionally, the application integrates Gemini AI to analyze medical records and generate AI-powered insights.

## Features

- **Secure File Upload:**
  - Upload medical records (PDFs) to IPFS.
  - Store IPFS hash and metadata on the blockchain.

- **Decentralized Storage:**
  - Files are stored on IPFS, ensuring data integrity and availability.

- **Patient Record Retrieval:**
  - Retrieve medical records using a unique Patient ID.
  - View PDFs directly from IPFS.

- **AI-Powered Insights:**
  - Analyze medical records using Gemini AI.
  - Generate summaries, diagnoses, and treatment recommendations.

- **User-Friendly Interface:**
  - Intuitive dashboard for uploading and retrieving records.
  - Clean and responsive design.

## Technologies Used

- **Frontend:**
  - HTML, CSS, JavaScript
  - Ethers.js for blockchain interaction
  - PDF.js for PDF text extraction
  - Google Generative AI for AI insights

- **Backend:**
  - Node.js with Express.js
  - Axios for API requests
  - CORS for cross-origin requests

- **Blockchain:**
  - Ethereum smart contract for storing IPFS hashes
  - Pinata for IPFS file storage

- **AI:**
  - Gemini AI for medical record analysis

## Problems Solved

- **Data Security:**
  - Medical records are stored on IPFS, ensuring decentralization and immutability.
  - Blockchain ensures tamper-proof storage of metadata.

- **Interoperability:**
  - Standardized PDF format for medical records ensures compatibility across systems.

- **AI Integration:**
  - Gemini AI provides actionable insights, reducing the time required for manual analysis.

- **User Experience:**
  - Simplified interface for healthcare providers to upload and retrieve records.

## Challenges Faced

- **PDF Text Extraction:**
  - Extracting text from PDFs required integrating PDF.js, which had compatibility issues with modern ES modules.

- **AI API Integration:**
  - Integrating Gemini AI required handling API keys securely and managing rate limits.

- **Blockchain Transactions:**
  - Handling gas fees and ensuring smooth interaction with the Ethereum blockchain was challenging.

- **CORS Issues:**
  - Cross-origin requests between the frontend and backend required proper CORS configuration.

- **Error Handling:**
  - Ensuring robust error handling for file uploads, AI analysis, and blockchain transactions was complex.
