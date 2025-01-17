
// Remove a tarefa
function removeTask(button, dayId) {
    const taskItem = button.parentElement;
    taskItem.remove();
    updateProgress(dayId); // Atualiza imediatamente o progresso
    saveAllTasks(); // Salva as tarefas
}

// Atualiza o estado da tarefa e salva
function updateTaskState(checkbox, dayId) {
    const taskItem = checkbox.parentElement; 
    const taskText = taskItem.childNodes[1].textContent.trim();
    const completed = checkbox.checked;

    // Salva o estado da tarefa
    saveAllTasks(); // Salva todas as tarefas após marcar/desmarcar
    updateProgress(dayId); // Atualiza o progresso do dia
}

// Atualiza o progresso do dia
function updateProgress(dayId) {
    const dayElement = document.getElementById(dayId);
    const tasks = dayElement.querySelectorAll('input[type="checkbox"]');
    const completedTasks = Array.from(tasks).filter(task => task.checked).length;
    const taskCount = tasks.length;

    if (taskCount === 0) {
        // Nenhuma tarefa
        dayElement.style.background = 'linear-gradient(to bottom, yellow 0%, yellow 100%)';
        return;
    }

    // Calcula o percentual concluído
    const progressPercentage = (completedTasks / taskCount) * 100;

    // Atualiza o fundo com gradiente
    dayElement.style.background = `linear-gradient(to bottom, green ${progressPercentage}%, yellow ${progressPercentage}%, yellow 100%)`;
}

// Salva todas as tarefas no Local Storage
function saveAllTasks() {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const allTasks = {};

    days.forEach(dayId => {
        const dayElement = document.getElementById(dayId);
        const taskItems = dayElement.querySelectorAll('.task-list li');

        const tasks = Array.from(taskItems).map(item => ({
            text: item.textContent.trim(), // Captura o texto da tarefa
            completed: item.querySelector('input[type="checkbox"]').checked // Estado da tarefa
        }));

        allTasks[dayId] = tasks; // Associa as tarefas ao dia correspondente
    });

    localStorage.setItem('tasks', JSON.stringify(allTasks)); // Salva todas as tarefas no Local Storage
}


// Carrega as tarefas do Local Storage
function loadFromLocalStorage() {
    const allTasks = JSON.parse(localStorage.getItem('tasks')) || {};
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    days.forEach(dayId => {
        const tasks = allTasks[dayId] || [];
        const dayElement = document.getElementById(dayId);
        const taskList = dayElement.querySelector('.task-list');

        // Limpa as tarefas existentes antes de carregar
        taskList.innerHTML = '';

        tasks.forEach(task => {
            // Cria um novo item de tarefa
            const taskItem = document.createElement('li');
            taskItem.innerHTML = `
                <input type="checkbox" onchange="handleTaskChange('${dayId}')" ${task.completed ? 'checked' : ''} />
                ${task.text} 
                <button onclick="removeTask(this, '${dayId}')" class="remove-button">
                    <i class="fas fa-trash"></i>
                </button>`;
            taskList.appendChild(taskItem);
        });

        updateProgress(dayId); // Atualiza o progresso do dia
    });
}

function addTaskToDay(dayId) {
    const dayElement = document.getElementById(dayId);
    const taskInput = dayElement.querySelector('.task-input');
    const taskValue = taskInput.value.trim();
    const taskList = dayElement.querySelector('.task-list');

    if (taskValue === '') {
        alert('Por favor, insira uma tarefa.');
        return;
    }

    // Cria um novo item de tarefa
    const taskItem = document.createElement('li');
    taskItem.innerHTML = `
        <input type="checkbox" onchange="handleTaskChange('${dayId}')" />
        ${taskValue} 
        <button onclick="removeTask(this, '${dayId}')" class="remove-button">
            <i class="fas fa-trash"></i>
        </button>`;
    taskList.appendChild(taskItem);

    taskInput.value = ''; // Limpa o campo de entrada
    updateProgress(dayId); // Atualiza imediatamente o progresso
    saveAllTasks(); // Salva as tarefas
}

function handleTaskChange(dayId) {
    updateProgress(dayId); // Atualiza o progresso do dia imediatamente
    saveAllTasks(); // Salva as tarefas
}

// Função para marcar todas as tarefas como não concluídas
function uncompleteAllTasks() {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    days.forEach(dayId => {
        const dayElement = document.getElementById(dayId);
        const tasks = dayElement.querySelectorAll('li input[type="checkbox"]');

        tasks.forEach(task => {
            task.checked = false; // Desmarca a tarefa
        });

        updateProgress(dayId); // Atualiza o progresso do dia
    });

    saveAllTasks(); // Salva o estado atualizado no Local Storage
}

// Evento do botão de reiniciar as tarefas como não concluídas
document.getElementById('uncomplete-all').addEventListener('click', uncompleteAllTasks);

// Carrega as tarefas do Local Storage ao carregar a página
window.onload = loadFromLocalStorage;