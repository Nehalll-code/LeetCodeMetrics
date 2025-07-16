//it means that when the DOM is fully loaded, the script will execute.
// This is useful for ensuring that the script runs after all HTML elements are available.
document.addEventListener("DOMContentLoaded", function() {
    const searchButton = document.getElementById("search");
    const searchInput = document.getElementById("user-input");
    const statsContainer = document.querySelector(".stats-container");
    const easyCount = document.getElementById("easy-count");
    const mediumCount = document.getElementById("medium-count");
    const hardCount = document.getElementById("hard-count");
    const easyProgress = document.querySelector(".easy-progress");
    const mediumProgress = document.querySelector(".medium-progress");  
    const hardProgress = document.querySelector(".hard-progress");
    const progressItems = document.querySelectorAll(".progress-item");
    const progressCircles = document.querySelectorAll(".circle");
    const progressBar = document.querySelector(".progress");
    const cardStatsContainer = document.querySelector(".stats-cards");

    //return t or f based on regex exp
    function validateUsername(username) {
        // Basic validation: check if username is not empty and contains only alphanumeric characters
        if(!username.trim()){
            alert("Should not be empty");
            return false;
        }
        const regex = /^[a-zA-Z0-9_-]{1,15}$/; // Allow alphanumeric characters and underscores
        const IsMatching =  regex.test(username);
        if(!IsMatching){
            alert("Invalid username");
            return false;
        }
        return IsMatching;
    }

    async function fetchUserData(username) {
    const url = `https://leetcode-stats-api.herokuapp.com/${username}`;
    let parsedData = null;
    try {
        searchButton.textContent = "Searching...";
        searchButton.disabled = true;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Unavailable user data");
        }
        parsedData = await response.json();
        console.log("User data:", parsedData);
        displayUserStats(parsedData);
    } catch (error) {
        console.error("Error fetching user data:", error);
        alert("User not found");
        return;
    } finally {
        searchButton.textContent = "Fetch Stats";
        searchButton.disabled = false;

        if (parsedData) {
            statsContainer.classList.remove("hidden"); // Show the stats only after valid fetch
            setTimeout(() => statsContainer.classList.add("show"), 50); // Smooth fade-in
            cardStatsContainer.classList.remove("hidden"); // Show the stats cards
            setTimeout(() => cardStatsContainer.classList.add("show"), 50); // Smooth fade-in}
        }
    }
    }
    
    function updateProgress(solved,total,label,circle) {
        const progressdegree = (solved / total) * 360;
        circle.style.setProperty("--progress-degree", `${progressdegree}%`);
        label.textContent = `${solved} / ${total}`;
    }
    
    // Function to display user statistics
    function displayUserStats(parsedData) {
        const totalQuestions = parsedData.totalQuestions;
        const totalEasyQues = parsedData.totalEasy;
        const totalMediumQues = parsedData.totalMedium;
        const totalHardQues = parsedData.totalHard;
        //const totalSolved = totalEasyQues + totalMediumQues + totalHardQues
        const totalSolved = parsedData.totalSolved;
        const easySolved = parsedData.easySolved;
        const mediumSolved = parsedData.mediumSolved; 
        const hardSolved = parsedData.hardSolved;

        updateProgress(easySolved, totalEasyQues, easyCount, easyProgress);
        updateProgress(mediumSolved, totalMediumQues,mediumCount, mediumProgress);    
        updateProgress(hardSolved, totalHardQues, hardCount, hardProgress);

        const userStatsContainer = document.querySelector(".user-stats");
        userStatsContainer.innerHTML = `<h2>User Stats</h2>
        <p><strong>Total Solved:</strong> ${totalSolved} / ${totalQuestions}</p>
        <p><strong>Easy Solved:</strong> ${easySolved} / ${totalEasyQues}</p>
        <p><strong>Medium Solved:</strong> ${mediumSolved} / ${totalMediumQues}</p>
        <p><strong>Hard Solved:</strong> ${hardSolved} / ${totalHardQues}</p>`;

    }
    searchButton.addEventListener("click", function() {
        const username = searchInput.value;
        console.log("Searching for user:", username);
        statsContainer.classList.add("hidden");
        if (validateUsername(username)) {
            fetchUserData(username);
        }
    });
});
