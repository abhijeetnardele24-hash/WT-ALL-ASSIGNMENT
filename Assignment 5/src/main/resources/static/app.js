const API_URL = '/api/results';

// DOM Elements
const resultForm = document.getElementById('resultForm');
const resultsBody = document.getElementById('resultsBody');
const refreshBtn = document.getElementById('refreshBtn');
const submitBtn = document.getElementById('submitBtn');
const loader = document.getElementById('loader');
const toast = document.getElementById('toast');

// Live Calculation Listeners
const subjects = [1, 2, 3, 4];
subjects.forEach(num => {
    const mseInput = document.getElementById(`sub${num}Mse`);
    const eseInput = document.getElementById(`sub${num}Ese`);
    const totalView = document.getElementById(`sub${num}TotalView`);

    const updateTotal = () => {
        const mse = parseFloat(mseInput.value) || 0;
        const ese = parseFloat(eseInput.value) || 0;
        totalView.textContent = mse + ese;
    };

    mseInput.addEventListener('input', updateTotal);
    eseInput.addEventListener('input', updateTotal);
});

// Fetch Results
const fetchResults = async () => {
    loader.classList.remove('hidden');
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        renderTable(data);
    } catch (error) {
        console.error('Error fetching results:', error);
    } finally {
        loader.classList.add('hidden');
    }
};

// Render Table
const renderTable = (data) => {
    resultsBody.innerHTML = '';
    
    if (data.length === 0) {
        resultsBody.innerHTML = '<tr><td colspan="9" style="text-align:center">No records found.</td></tr>';
        return;
    }

    data.forEach(result => {
        const tr = document.createElement('tr');
        
        // Helper to format grade CSS class
        let gradeClass = 'grade-f';
        if(result.grade.includes('O')) gradeClass = 'grade-o';
        else if(result.grade.includes('A+')) gradeClass = 'grade-a-plus';
        else if(result.grade.includes('A')) gradeClass = 'grade-a';
        else if(result.grade.includes('B+')) gradeClass = 'grade-b-plus';
        else if(result.grade.includes('B')) gradeClass = 'grade-b';
        else if(result.grade.includes('C')) gradeClass = 'grade-c';
        else if(result.grade.includes('P')) gradeClass = 'grade-p';

        tr.innerHTML = `
            <td><strong>${result.rollNumber}</strong></td>
            <td>${result.studentName}</td>
            <td>${result.sub1Total}</td>
            <td>${result.sub2Total}</td>
            <td>${result.sub3Total}</td>
            <td>${result.sub4Total}</td>
            <td><strong>${result.grandTotal}</strong> / 400</td>
            <td>${result.percentage.toFixed(2)}%</td>
            <td><span class="grade-badge ${gradeClass}">${result.grade}</span></td>
        `;
        resultsBody.appendChild(tr);
    });
};

// Submit Form
resultForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Saving...</span>';

    const payload = {
        studentName: document.getElementById('studentName').value,
        rollNumber: document.getElementById('rollNumber').value,
        sub1Mse: parseFloat(document.getElementById('sub1Mse').value),
        sub1Ese: parseFloat(document.getElementById('sub1Ese').value),
        sub2Mse: parseFloat(document.getElementById('sub2Mse').value),
        sub2Ese: parseFloat(document.getElementById('sub2Ese').value),
        sub3Mse: parseFloat(document.getElementById('sub3Mse').value),
        sub3Ese: parseFloat(document.getElementById('sub3Ese').value),
        sub4Mse: parseFloat(document.getElementById('sub4Mse').value),
        sub4Ese: parseFloat(document.getElementById('sub4Ese').value),
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            resultForm.reset();
            // Reset totals view
            subjects.forEach(num => {
                document.getElementById(`sub${num}TotalView`).textContent = '0';
            });
            showToast('Record saved successfully!');
            fetchResults();
        } else {
            showToast('Error saving record!', true);
        }
    } catch (error) {
        console.error('Submit error:', error);
        showToast('Network error!', true);
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>Calculate & Save Result</span>';
    }
});

// Toast Notification
const showToast = (message, isError = false) => {
    toast.textContent = message;
    toast.style.backgroundColor = isError ? '#ef4444' : 'var(--secondary-color)';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
};

// Listeners
refreshBtn.addEventListener('click', fetchResults);

// Initial Fetch
fetchResults();

// Theme Toggle Logic
const themeToggle = document.getElementById('themeToggle');
const iconSpan = themeToggle.querySelector('.icon');

// Check local storage for theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    iconSpan.textContent = '☀️';
}

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'dark') {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        iconSpan.textContent = '🌓';
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        iconSpan.textContent = '☀️';
    }
});
