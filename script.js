document.addEventListener('DOMContentLoaded', function() {
    fetchCompanies();

    const form = document.getElementById('add-company-form');
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        handleFormSubmission();
    });
});

function fetchCompanies() {
    fetch('companies.json')
        .then(response => response.json())
        .then(data => renderCompanies(data))
        .catch(error => console.error('Error fetching companies:', error));
}

function renderCompanies(companies) {
    const tableBody = document.getElementById('companies-table').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = '';

    companies.forEach(company => {
        const row = tableBody.insertRow();
        const nameCell = row.insertCell(0);
        const urlCell = row.insertCell(1);

        nameCell.textContent = company.name;
        urlCell.innerHTML = `<a href="${company.url}" target="_blank">${company.url}</a>`;
    });
}

function handleFormSubmission() {
    const companyName = document.getElementById('company-name').value;
    const companyUrl = document.getElementById('company-url').value;

    const issueData = {
        title: `New Company: ${companyName}`,
        body: `**Company Name:** ${companyName}\n**Company URL:** ${companyUrl}`,
        labels: ['new-company']
    };

    createGitHubIssue(issueData);
}

function createGitHubIssue(issueData) {
    const githubToken = 'YOUR_GITHUB_TOKEN'; // Replace with your GitHub token
    const repoOwner = 'getmanfred';
    const repoName = 'companies-with-public-salary';

    fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/issues`, {
        method: 'POST',
        headers: {
            'Authorization': `token ${githubToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(issueData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.html_url) {
            displaySuccessMessage(data.html_url);
        } else {
            console.error('Error creating issue:', data);
        }
    })
    .catch(error => console.error('Error creating issue:', error));
}

function displaySuccessMessage(issueUrl) {
    const form = document.getElementById('add-company-form');
    form.reset();

    const successMessage = document.createElement('p');
    successMessage.textContent = `Issue created successfully! You can view it here: ${issueUrl}`;
    form.appendChild(successMessage);
}
