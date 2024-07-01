document.addEventListener('DOMContentLoaded', () => {
    const addHabitForm = document.querySelector('#habit-add') as HTMLFormElement | null;
    const closeHabitFormButton = document.querySelector('#cancel') as HTMLButtonElement | null;
    const habitList = document.querySelector('.habits') as HTMLElement | null;
    const overlay = document.querySelector('.overlay') as HTMLElement | null;
    const habitDetails = document.querySelector('.habit-details') as HTMLElement | null;
    const closeDetailsButton = document.querySelector('#cancelbtn') as HTMLButtonElement | null;
    const overlayhabit = document.querySelector('#overlay') as HTMLElement | null;
    const loginForm = document.querySelector('#login-form') as HTMLFormElement | null;
    const registerForm = document.querySelector('#register-form') as HTMLFormElement | null;
    const logoutBtn = document.querySelector('#logout-btn') as HTMLButtonElement | null;

    let authToken: string = localStorage.getItem('authToken') ?? '';
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('authToken');
            authToken = '';
            
            logoutBtn.style.display = 'none';
            window.location.href = 'index.html';
            checkAuth();
        });
    }

    const checkAuth = () => {
        if (!authToken) {
            // Show login/register forms
            if (logoutBtn) logoutBtn.style.display = 'none';

        } else {
            // Show habits list
            
            if (logoutBtn) logoutBtn.style.display = 'block';
            fetchAndUpdateHabitList();
        }
    };

    // Login form handling
    if (loginForm) {
        loginForm.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            const emailInput = loginForm.querySelector('#login-email') as HTMLInputElement;
            const passwordInput = loginForm.querySelector('#login-password') as HTMLInputElement;

            fetch('http://localhost:3001/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: emailInput.value,
                    password: passwordInput.value
                })
            })
            .then(res => res.json())
            .then(data => {
                if (data.token) {
                    authToken = data.token;
                    localStorage.setItem('authToken', authToken);
                    checkAuth();
                } else {
                    console.error('Login failed:', data.error);
                }
            })
            .catch(error => {
                console.error('Error logging in:', error);
            });
        });
    }

    // Register form handling
    if (registerForm) {
        registerForm.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            const usernameInput = registerForm.querySelector('#register-username') as HTMLInputElement;
            const emailInput = registerForm.querySelector('#register-email') as HTMLInputElement;
            const passwordInput = registerForm.querySelector('#register-password') as HTMLInputElement;

            fetch('http://localhost:3001/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: usernameInput.value,
                    email: emailInput.value,
                    password: passwordInput.value
                })
            })
            .then(res => res.json())
            .then(data => {
                if (data.id) {
                    console.log('Registration successful. Please log in.');
                } else {
                    console.error('Registration failed:', data.error);
                }
            })
            .catch(error => {
                console.error('Error registering:', error);
            });
        });
    }
    

    // Add Habit Form handling
    if (addHabitForm && overlayhabit) {
        const addHabitButton = document.querySelector('#add-habit') as HTMLButtonElement | null;
        if (addHabitButton) {
            addHabitButton.addEventListener('click', (e: Event) => {
                e.preventDefault();
                addHabitForm.style.display = 'block';
                overlayhabit.style.display = 'block';
            });
        }

        if (closeHabitFormButton && overlay) {
            closeHabitFormButton.addEventListener('click', (e: Event) => {
                e.preventDefault();
                addHabitForm.style.display = 'none';
                overlayhabit.style.display = 'none';
            });
        }

        addHabitForm.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            const habitNameInput = addHabitForm.querySelector('#habit-name') as HTMLInputElement;
            const habitImageInput = addHabitForm.querySelector('#habit-icon') as HTMLInputElement;
            const descriptionInput = addHabitForm.querySelector('#habit-description') as HTMLInputElement;
            const startDateInput = addHabitForm.querySelector('#start-date') as HTMLInputElement;

            const habitName = habitNameInput ? habitNameInput.value : '';
            const habitImage = habitImageInput ? habitImageInput.value : '';
            const description = descriptionInput ? descriptionInput.value : '';
            const startDate = startDateInput ? startDateInput.value.split('T')[0] : '';

            fetch('http://localhost:3001/habits', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({
                    habitName,
                    habitImage,
                    description,
                    startDate
                })
            })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                addHabitForm.style.display = 'none';
                overlayhabit.style.display = 'none';
                fetchAndUpdateHabitList();
            })
            .catch(error => {
                console.error('Error adding habit:', error);
            });
        });
    }

    // Habit List handling
    const fetchAndUpdateHabitList = () => {
        if (habitList) {
            fetch('http://localhost:3001/habits', {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                habitList.innerHTML = '';
                data.forEach((habit: { id: string, habitName: string, habitImage: string, description: string, startDate: string, currentStreak: number }) => {
                    const habitElement = document.createElement('div');
                    habitElement.classList.add('habit');
                    habitElement.innerHTML = `
                        <ion-icon size="large" name="${habit.habitImage}"></ion-icon>
                        <h3>${habit.habitName}</h3>
                        <p>${habit.description}</p>
                        <p>Start Date: ${formatDate(habit.startDate)}</p>
                        <p>Current Streak: ${updateStreak(habit.startDate)} Day(s)</p>
                        <button class="details-btn" data-habit-id="${habit.id}" style="margin-left:5px;">See Details</button>
                        <button class="delete-btn" id="delete-btn" data-habit-id="${habit.id}" style="margin-left:5px;">Delete</button>

                    `;
                    habitList.appendChild(habitElement);
                });
            })
            .catch(error => {
                console.error('Error fetching habits:', error);
                if (error.message.includes('Unauthorized')) {
                    // authToken = null;
                    localStorage.removeItem('authToken');
                    checkAuth();
                }
            });
        }
    };
    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };
    // Habit Details handling
    if (habitList) {
        habitList.addEventListener('click', (e: Event) => {
            const target = e.target as HTMLElement;
            if (target && target.matches('.details-btn')) {
                e.preventDefault();
                const habitId = target.getAttribute('data-habit-id');
                if (habitId) {
                    fetch(`http://localhost:3001/habits/${habitId}`, {
                        headers: {
                            'Authorization': `Bearer ${authToken}`
                        }
                    })
                    .then(res => res.json())
                    .then(habit => {
                        console.log(habit);
                        habitDetails!.innerHTML = ''; // Clear previous details
                        const detailsElement = document.createElement('div');
                        detailsElement.classList.add('habit-detail');
                        detailsElement.innerHTML = `
                            <h3>${habit.habitName}</h3>
                            <p>${habit.description}</p>
                            <p>Start Date: ${formatDate(habit.startDate)}</p>
                            <p>Current Streak: ${updateStreak(habit.startDate)} Day(s)</p>
                            <button class='reset-btn' id='reset-btn' data-habit-id="${habit.id}">Reset</button>
                            <button class="close-details-btn" id="cancelbtn">Cancel</button>
                        `;
                        habitDetails!.appendChild(detailsElement);
                        habitDetails!.style.display = 'block';
                        overlay!.style.display = 'block';
                    })
                    .catch(error => {
                        console.error('Error fetching habit details:', error);
                    });
                }
            }
            if (target && target.matches('.delete-btn')) {
                e.preventDefault();
                const habitId = target.getAttribute('data-habit-id');
                if (habitId) {
                    fetch(`http://localhost:3001/habits/${habitId}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${authToken}`
                        }
                    })
                    .then(res => res.json())
                    .then(habit => {
                        console.log(habit);
                        fetchAndUpdateHabitList();
                    })
                    .catch(error => {
                        console.error('Error deleting habit:', error);
                    });
                }
            }
        });
    }

    // Close Details handling
    if (habitDetails) {
        habitDetails.addEventListener('click', (e: Event) => {
            const target = e.target as HTMLElement;
            if (target && target.matches('.close-details-btn')) {
                e.preventDefault();
                console.log('close details clicked');
                habitDetails.style.display = 'none';
                overlay!.style.display = 'none';
            }
            if (target && target.matches('.reset-btn')) {
                e.preventDefault();
                console.log('reset clicked');
                const habitId = target.getAttribute('data-habit-id');
                if (habitId) {
                    fetch(`http://localhost:3001/habits/${habitId}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${authToken}`
                        },
                        body: JSON.stringify({
                            startDate: new Date().toISOString().split('T')[0]
                        })
                    })
                    .then(res => res.json())
                    .then(habit => {
                        console.log(habit);
                        habitDetails.style.display = 'none';
                        overlay!.style.display = 'none';
                        fetchAndUpdateHabitList();
                    })
                    .catch(error => {
                        console.error('Error resetting habit:', error);
                    });
                }
            }
        });
    }

    checkAuth();
});

const updateStreak = (startDate: string): number => {
    const start = new Date(startDate);
    const today = new Date();
    
    start.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    const timeDiff = today.getTime() - start.getTime();
    
    const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
    
    return Math.max(0, daysDiff);
};