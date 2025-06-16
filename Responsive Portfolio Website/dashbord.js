// API Configuration
const API_BASE_URL = 'https://localhost:7170/api'; // Added missing base URL
let authToken = localStorage.getItem('authToken');

// Helper function for API calls
async function fetchWithAuth(endpoint, options = {}) {
    if (!options.headers) {
        options.headers = {};
    }

    options.headers['Authorization'] = `Bearer ${authToken}`;
    options.headers['Content-Type'] = 'application/json';

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

    if (response.status === 401) {
        // Token expired or invalid, redirect to login
        window.location.href = '/login.html';
        return;
    }

    return response;
}

// Login function
async function login(username, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Login failed');
        }

        const data = await response.json();
        localStorage.setItem('authToken', data.token);
        authToken = data.token;
        return true;
    } catch (err) {
        console.error('Login error:', err.message);
        throw err;
    }
}

// Dashboard Stats
async function loadDashboardStats() {
    try {
        const response = await fetchWithAuth(`/Dashboard/stats`);
        if (!response) return; // Handle case where fetchWithAuth redirected to login
        
        const stats = await response.json();
        
        document.querySelector('.card-primary .stat-card-value').textContent = stats.totalViews.toLocaleString();
        document.querySelector('.card-success .stat-card-value').textContent = stats.messagesCount;
        document.querySelector('.card-info .stat-card-value').textContent = stats.projectsCount;
        document.querySelector('.card-warning .stat-card-value').textContent = stats.avgTimeOnSite;
        
        // Update change indicators
        updateChangeIndicator('.card-primary .stat-card-change', stats.viewsChangePercent);
        updateChangeIndicator('.card-success .stat-card-change', stats.messagesChangePercent);
        updateChangeIndicator('.card-info .stat-card-change', stats.projectsChangePercent);
        updateChangeIndicator('.card-warning .stat-card-change', stats.timeChangePercent);
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
    }
}

function updateChangeIndicator(selector, percent) {
    const element = document.querySelector(selector);
    if (!element) return;
    
    element.textContent = `${percent > 0 ? '↑' : '↓'} ${Math.abs(percent)}% since last month`;
    element.classList.toggle('positive', percent > 0);
    element.classList.toggle('negative', percent < 0);
}
  $(document).ready(function() {
            loadProjects();
        });
  async function loadProjects() {
            try {
                const response = await fetch('https://localhost:7170/api/Projects');
                const projects = await response.json();
                
                let html = '';
                
                if (projects.length === 0) {
                    html = `<div class="alert alert-info">No projects found. Add your first project!</div>`;
                } else {
                    projects.forEach(project => {
                        const statusClass = getStatusClass(project.status);
                        const formattedDate = new Date(project.startDate).toLocaleDateString();
                        
                        html += `
                            <div class="card project-card">
                                <div class="project-header">
                                    <h5>${project.name}</h5>
                                </div>
                                <div class="project-body">
                                    <div class="d-flex justify-content-between mb-3">
                                        <span><i class="far fa-calendar-alt mr-2"></i>Started: ${formattedDate}</span>
                                        <span class="status-badge ${statusClass}">${project.status}</span>
                                    </div>
                                    <div class="mb-3">
                                        <div class="d-flex justify-content-between mb-1">
                                            <span>Progress</span>
                                            <span>${project.completion}%</span>
                                        </div>
                                        <div class="progress">
                                            <div class="progress-bar" role="progressbar" style="width: ${project.completion}%" 
                                                aria-valuenow="${project.completion}" aria-valuemin="0" aria-valuemax="100"></div>
                                        </div>
                                    </div>
                                    <div class="text-right">
                                        <button class="btn btn-sm btn-info action-btn" onclick="editProject(${project.id})">
                                            <i class="fas fa-edit"></i> Edit
                                        </button>
                                        <button class="btn btn-sm btn-primary action-btn" onclick="viewProject(${project.id})">
                                            <i class="fas fa-eye"></i> View
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `;
                    });
                }
                
                document.getElementById('projectsContainer').innerHTML = html;
            } catch (error) {
                console.error('Error loading projects:', error);
                document.getElementById('projectsContainer').innerHTML = `
                    <div class="alert alert-danger">Error loading projects. Please try again later.</div>
                `;
            }
        }
// Projects Table
async function loadProjects() {
    try {
        const response = await fetchWithAuth(`/Projects`);
        if (!response) return;
        
        const projects = await response.json();
        
        const tbody = document.querySelector('.table tbody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        projects.forEach(project => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${project.name}</td>
                <td>${new Date(project.startDate).toLocaleDateString()}</td>
                <td><span class="badge ${getStatusBadgeClass(project.status)}">${project.status}</span></td>
                <td>
                    <div class="progress" style="height: 10px;">
                        <div class="progress-bar ${getProgressBarClass(project.status)}" role="progressbar" 
                             style="width: ${project.completion}%;" 
                             aria-valuenow="${project.completion}" 
                             aria-valuemin="0" 
                             aria-valuemax="100"></div>
                    </div>
                </td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="viewProject(${project.id})"><i class="fas fa-eye"></i></button>
                    <button class="btn btn-sm btn-info" onclick="editProject(${project.id})"><i class="fas fa-edit"></i></button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

function getStatusBadgeClass(status) {
    switch(status.toLowerCase()) {
        case 'active': return 'badge-success';
        case 'planning': return 'badge-primary';
        case 'on hold': return 'badge-warning';
        case 'cancelled': return 'badge-danger';
        default: return 'badge-secondary';
    }
}

function getProgressBarClass(status) {
    switch(status.toLowerCase()) {
        case 'active': return 'bg-success';
        case 'planning': return 'bg-primary';
        case 'on hold': return 'bg-warning';
        case 'cancelled': return 'bg-danger';
        default: return 'bg-secondary';
    }
}

// Messages List
async function loadMessages() {
    try {
        const response = await fetchWithAuth(`/Messages`);
        if (!response) return;
        
        const messages = await response.json();
        
        const container = document.querySelector('.message-list');
        if (!container) return;
        
        container.innerHTML = '';
        
        messages.forEach(message => {
            const messageElement = document.createElement('div');
            messageElement.className = `message-item d-flex mb-3 ${message.isRead ? '' : 'unread'}`;
            messageElement.innerHTML = `
                <div class="message-avatar mr-3">
                    <img src="https://source.unsplash.com/random/60x60/?${message.senderName.includes(' ') ? 
                        message.senderName.split(' ')[0].toLowerCase() : 'user'}" 
                        class="rounded-circle" width="40" height="40">
                </div>
                <div class="message-content">
                    <div class="message-header d-flex justify-content-between">
                        <strong>${message.senderName}</strong>
                        <small class="text-muted">${formatTimeAgo(message.sentDate)}</small>
                    </div>
                    <div class="message-text">${message.content}</div>
                </div>
            `;
            container.appendChild(messageElement);
        });
    } catch (error) {
        console.error('Error loading messages:', error);
    }
}

function formatTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
}

// Skills Chart
async function loadSkills() {
    try {
        const response = await fetchWithAuth(`/Dashboard/skills`);
        if (!response) return;
        
        const skills = await response.json();
        
        const container = document.querySelector('.card-body');
        if (!container) return;
        
        container.innerHTML = '';
        
        skills.forEach(skill => {
            const skillElement = document.createElement('div');
            skillElement.className = 'skill-item mb-3';
            skillElement.innerHTML = `
                <div class="d-flex justify-content-between mb-1">
                    <span>${skill.name}</span>
                    <span>${skill.percentage}%</span>
                </div>
                <div class="progress" style="height: 10px;">
                    <div class="progress-bar ${getSkillProgressClass(skill.percentage)}" 
                         role="progressbar" 
                         style="width: ${skill.percentage}%;" 
                         aria-valuenow="${skill.percentage}" 
                         aria-valuemin="0" 
                         aria-valuemax="100"></div>
                </div>
            `;
            container.appendChild(skillElement);
        });
    } catch (error) {
        console.error('Error loading skills:', error);
    }
}

function getSkillProgressClass(percentage) {
    if (percentage >= 85) return 'bg-success';
    if (percentage >= 70) return 'bg-info';
    if (percentage >= 50) return 'bg-primary';
    return 'bg-warning';
}

// Charts
function initCharts() {
    // Traffic Chart
    const trafficCtx = document.getElementById('trafficChart');
    if (trafficCtx) {
        new Chart(trafficCtx.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Unique Visitors',
                    data: [1500, 1800, 2100, 1900, 2200, 2500, 2800, 2700, 3000, 3200, 3500, 3800],
                    backgroundColor: 'rgba(78, 115, 223, 0.05)',
                    borderColor: 'rgba(78, 115, 223, 1)',
                    pointBackgroundColor: 'rgba(78, 115, 223, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(78, 115, 223, 1)',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: true
                }]
            },
            options: {
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    // Traffic Sources Chart
    const sourcesCtx = document.getElementById('trafficSourcesChart');
    if (sourcesCtx) {
        new Chart(sourcesCtx.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['Direct', 'Social', 'Referral', 'Search'],
                datasets: [{
                    data: [35, 25, 20, 20],
                    backgroundColor: [
                        'rgba(78, 115, 223, 0.8)',
                        'rgba(28, 200, 138, 0.8)',
                        'rgba(54, 185, 204, 0.8)',
                        'rgba(246, 194, 62, 0.8)'
                    ],
                    hoverBackgroundColor: [
                        'rgba(78, 115, 223, 1)',
                        'rgba(28, 200, 138, 1)',
                        'rgba(54, 185, 204, 1)',
                        'rgba(246, 194, 62, 1)'
                    ],
                    hoverBorderColor: "rgba(234, 236, 244, 1)",
                }]
            },
            options: {
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                },
                cutout: '70%'
            }
        });
    }
}

// Project Management Functions
async function saveProject() {
    const project = {
        name: document.getElementById('projectName').value,
        startDate: document.getElementById('startDate').value,
        status: document.getElementById('projectStatus').value,
        completion: parseInt(document.getElementById('completion').value)
    };

    try {
        const response = await fetchWithAuth('https://localhost:7170/api/Projects', {
            method: 'POST',
            body: JSON.stringify(project)
        });

        if (response && response.ok) {
            $('#addProjectModal').modal('hide');
            await loadProjects();
        } else {
            alert('Error saving project');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error saving project');
    }
}

async function editProject(id) {
    try {
        const response = await fetchWithAuth(`https://localhost:7170/api/Projects${id}`);
        if (!response) return;
        
        const project = await response.json();
        
        document.getElementById('editProjectId').value = project.id;
        document.getElementById('editProjectName').value = project.name;
        document.getElementById('editStartDate').value = project.startDate.split('T')[0];
        document.getElementById('editProjectStatus').value = project.status;
        document.getElementById('editCompletion').value = project.completion;
        
        $('#editProjectModal').modal('show');
    } catch (error) {
        console.error('Error loading project:', error);
        alert('Error loading project details');
    }
}

async function updateProject() {
    const project = {
        id: parseInt(document.getElementById('editProjectId').value),
        name: document.getElementById('editProjectName').value,
        startDate: document.getElementById('editStartDate').value,
        status: document.getElementById('editProjectStatus').value,
        completion: parseInt(document.getElementById('editCompletion').value)
    };

    try {
        const response = await fetchWithAuth(`https://localhost:7170/api/Projects${project.id}`, {
            method: 'PUT',
            body: JSON.stringify(project)
        });

        if (response && response.ok) {
            $('#editProjectModal').modal('hide');
            await loadProjects();
        } else {
            alert('Error updating project');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error updating project');
    }
}

async function deleteProject() {
    const id = document.getElementById('editProjectId').value;
    
    if (confirm('Are you sure you want to delete this project?')) {
        try {
            const response = await fetchWithAuth(`https://localhost:7170/api/Projects${id}`, {
                method: 'DELETE'
            });

            if (response && response.ok) {
                $('#editProjectModal').modal('hide');
                await loadProjects();
            } else {
                alert('Error deleting project');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error deleting project');
        }
    }
}

function viewProject(id) {
    alert(`Viewing project with ID: ${id}\nThis would show more detailed information in a real implementation.`);
}

function showAddProjectModal() {
    document.getElementById('projectForm').reset();
    $('#addProjectModal').modal('show');
}

// UI Event Handlers
function setupEventListeners() {
    // Sidebar Toggle
    document.getElementById('sidebarToggle')?.addEventListener('click', function() {
        document.body.classList.toggle('sidebar-toggled');
    });

    // User Dropdown
    document.getElementById('userDropdown')?.addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('userDropdownMenu').classList.toggle('show');
    });

    // Close dropdown when clicking outside
    window.addEventListener('click', function(e) {
        if (!e.target.matches('#userDropdown') && !e.target.closest('#userDropdown')) {
            const dropdown = document.getElementById('userDropdownMenu');
            if (dropdown?.classList.contains('show')) {
                dropdown.classList.remove('show');
            }
        }
    });

    // Collapse navigation items
    document.querySelectorAll('.nav-link[data-toggle="collapse"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            const targetElement = document.querySelector(target);
            if (targetElement) {
                targetElement.classList.toggle('show');
                this.classList.toggle('collapsed');
            }
        });
    });

    // Responsive sidebar toggle for mobile
    if (window.innerWidth < 768) {
        document.querySelector('.sidebar')?.classList.remove('show');
        document.getElementById('sidebarToggle')?.addEventListener('click', function() {
            document.querySelector('.sidebar')?.classList.toggle('show');
        });
    }
}

// Initialize the dashboard when the page loads
document.addEventListener('DOMContentLoaded', async function() {
    // Check if user is authenticated
    if (!authToken) {
        window.location.href = '/login.html';
        return;
    }
    
    setupEventListeners();
    
    try {
        await Promise.all([
            loadDashboardStats(),
            loadProjects(),
            loadMessages(),
            loadSkills()
        ]);
        initCharts();
    } catch (error) {
        console.error('Failed to load dashboard data:', error);
        // Handle error (e.g., show error message to user)
    }
});