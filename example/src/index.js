function updateContent() {
    document.getElementById('app').innerHTML = `
        <h1>HMR Test</h1>
        <p>Last updated: ${new Date().toLocaleTimeString()}</p>
    `;
}

updateContent();
