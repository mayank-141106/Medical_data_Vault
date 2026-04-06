
async function connectMetaMask() {
    // Check if MetaMask is installed
    console.log(window)
    if (typeof window.ethereum === 'undefined') {
        alert('MetaMask is not installed. Please install it to log in.');
        return;
    }

    try {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const userAddress = accounts[0];

        // Show success message
        alert(`Connected successfully with wallet: ${userAddress}`);
        console.log('Wallet Address:', userAddress);

        // Optionally, get the network ID for debugging
        const networkId = await window.ethereum.request({ method: 'net_version' });
        console.log('Network ID:', networkId);

        // Redirect or handle post-login logic
        // Example: window.location.href = 'dashboard.html';

    } catch (error) {
        if (error.code === 4001) {
            // User rejected the connection request
            alert('User rejected the connection request.');
        } else {
            console.error('MetaMask connection failed:', error);
            alert('MetaMask connection failed. Please try again.');
        }
    }
}
document.addEventListener("DOMContentLoaded", function () {
    const loginBtn = document.getElementById("login-btn");

    if (loginBtn) {
        loginBtn.addEventListener("click", async function () {
            if (typeof window.ethereum !== "undefined") {
                try {
                    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
                    const userAddress = accounts[0];
                    alert("Connected: " + userAddress);

                    // Redirect to dashboard after successful connection
                    window.location.href = "dashboard.html";
                } catch (error) {
                    console.error("User denied account access");
                }
            } else {
                alert("MetaMask is not installed. Please install it to use this feature.");
            }
        });
    }
});
