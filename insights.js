window.addEventListener('message', (event) => {
    if (event.data.type === 'INSIGHTS_DATA') {
        const data = event.data.data;
        document.getElementById('patient-id').textContent = data.patientId;
        document.getElementById('report-date').textContent = data.timestamp;
        
        const container = document.getElementById('insights-container');
        container.innerHTML = formatInsights(data.insights);
    }
});

function formatInsights(text) {
    // Convert markdown-like formatting to HTML
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
        .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
        .replace(/## (.*)/g, '<h3>$1</h3>') // Headers
        .replace(/- (.*)/g, '<li>$1</li>') // List items
        .replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>') // Lists
        .replace(/\n/g, '<br>'); // New lines
}

// Handle page reloads
window.addEventListener('load', () => {
    if (!document.getElementById('patient-id').textContent) {
        document.getElementById('insights-container').innerHTML = 
            '<p style="color: #dc3545">No insights data found. Please generate insights from the dashboard.</p>';
    }
});