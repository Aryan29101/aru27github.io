/**
 * DATA_NODE_V1.0 — GitHub Intelligence Synchronizer
 * Connects to the GitHub API to fetch real-time repository data
 * and populates the mission control diagnostics.
 */
async function updateGithubStats(username) {
    try {
        const response = await fetch(`https://api.github.com/users/${username}`);
        if (!response.ok) throw new Error('API_OFFLINE');
        const userData = await response.json();
        
        const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
        const repos = await reposResponse.json();
        
        const totalStars = repos.reduce((acc, repo) => acc + repo.stargazers_count, 0);
        const mostUsedLang = repos.length > 0 ? repos[0].language : 'Python';
        
        // --- Update UI Elements ---
        
        // 1. Accuracy Stat (Derived from Repos/Followers for visual variety)
        const accuracyEl = document.getElementById('stat-accuracy');
        if (accuracyEl) {
            const calculatedAccuracy = Math.min(99.9, 90 + (userData.public_repos / 2)).toFixed(1);
            accuracyEl.textContent = `${calculatedAccuracy}%`;
            // Update progress bar
            const bar = accuracyEl.parentElement.nextElementSibling.firstElementChild;
            if (bar) bar.style.width = `${calculatedAccuracy}%`;
        }

        // 2. Data Processed (Repo count)
        const dataProcessedEl = document.getElementById('stat-data');
        if (dataProcessedEl) {
            dataProcessedEl.textContent = `${userData.public_repos} REPOS`;
        }

        // 3. Inject Log into Terminal
        const terminalOutput = document.getElementById('terminal-output');
        if (terminalOutput) {
            const logEntry = document.createElement('div');
            logEntry.className = 'text-primary-fixed mt-1';
            logEntry.innerHTML = `> GITHUB_INTEL: SYNC_SUCCESS // ${userData.public_repos} NODES // ${totalStars} STARS // PRIMARY_LANG: ${mostUsedLang}`;
            
            // Remove 'await input' temporarily to append, then re-append it
            const awaitInput = Array.from(terminalOutput.children).find(el => el.textContent.includes('await input'));
            if (awaitInput) terminalOutput.removeChild(awaitInput);
            
            terminalOutput.appendChild(logEntry);
            
            if (awaitInput) terminalOutput.appendChild(awaitInput);
            
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
        }

        // 4. Success Sound
        if (typeof AudioSystem !== 'undefined') {
            setTimeout(() => AudioSystem.successSound(), 500);
        }

    } catch (error) {
        console.warn("GITHUB_SYNC_ERROR:", error.message);
        const terminalOutput = document.getElementById('terminal-output');
        if (terminalOutput) {
            const errorEntry = document.createElement('div');
            errorEntry.className = 'text-error mt-1';
            errorEntry.textContent = `> GITHUB_SYNC: ERROR_TIMEOUT // RETRYING_IN_300S`;
            terminalOutput.appendChild(errorEntry);
        }
    }
}

// Auto-run on Missions page
window.addEventListener('load', () => {
    const isMissionsPage = window.location.pathname.includes('missions');
    if (isMissionsPage) {
        const terminalOutput = document.getElementById('terminal-output');
        if (terminalOutput) {
            const startEntry = document.createElement('div');
            startEntry.className = 'opacity-50 mt-1';
            startEntry.textContent = `> GITHUB_SYNC: INITIALIZING_HANDSHAKE...`;
            terminalOutput.appendChild(startEntry);
        }
        // Small delay to ensure other terminal logs have printed
        setTimeout(() => updateGithubStats('Aryan29101'), 1000); 
    }
});
