// Atualiza a adição da tarefa para usar o ícone de lata de lixo
function addTaskToMultipleDays() {
    const taskInput = document.getElementById('task-input-multiple');
    const taskValue = taskInput.value.trim();
    const dayCheckboxes = document.querySelectorAll('.day-checkbox:checked');

    if (taskValue === '') {
        alert('Por favor, insira uma tarefa.');
        return;
    }

    dayCheckboxes.forEach(checkbox => {
        const dayId = checkbox.value;
        const dayElement = document.getElementById(dayId);
        const taskList = dayElement.querySelector('.task-list');

        // Cria um novo item de tarefa
        const taskItem = document.createElement('li');
        taskItem.innerHTML = `<input type="checkbox" onchange="updateTaskState(this, '${dayId}')" /> ${taskValue} <button onclick="removeTask(this)" class="remove-button"><i class="fas fa-trash"></i></button>`;
        taskList.appendChild(taskItem);
    });

    taskInput.value = ''; // Limpa o campo de entrada
    saveAllTasks(); // Salva todas as tarefas após adicionar
}

// Remove a tarefa
function removeTask(button) {
    const taskItem = button.parentElement;
    const dayId = taskItem.parentElement.parentElement.id;
    taskItem.remove();
    updateProgress(dayId); // Atualiza o progresso do dia
    saveAllTasks(); // Salva todas as tarefas após remover
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

    // Atualiza a cor do progresso
    const progressElement = dayElement.querySelector('.progress');
    const taskCount = tasks.length;

    if (taskCount === 0) {
        progressElement.style.width = '0%';
        progressElement.style.backgroundColor = '#ffffff'; // Cor inicial
        return;
    }

    const progressPercentage = (completedTasks / taskCount) * 100;
    progressElement.style.width = `${progressPercentage}%`;

    // Atualiza a cor de fundo do dia
    if (completedTasks === taskCount) {
        dayElement.style.backgroundColor = 'green'; // Verde se todas as tarefas foram concluídas
    } else if (completedTasks > 0) {
        dayElement.style.backgroundColor = 'yellow'; // Amarelo se algumas tarefas estão concluídas
    } else {
        dayElement.style.backgroundColor = 'rgba(255, 235, 59, 1)'; // Cor padrão
    }
}

// Salva todas as tarefas no Local Storage
function saveAllTasks() {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    days.forEach(dayId => {
        const dayElement = document.getElementById(dayId);
        const taskItems = dayElement.querySelectorAll('.task-list li');

        const tasks = Array.from(taskItems).map(item => ({
            text: item.childNodes[1].textContent.trim(), // Apenas o texto da tarefa
            completed: item.querySelector('input[type="checkbox"]').checked,
        }));

        console.log(`Salvando tarefas para ${dayId}:`, tasks); // Verifica o que está sendo salvo
        localStorage.setItem(dayId, JSON.stringify(tasks));
    });
}

// Carrega as tarefas do Local Storage
function loadFromLocalStorage() {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    days.forEach(dayId => {
        const tasks = JSON.parse(localStorage.getItem(dayId)) || [];
        console.log(`Carregando tarefas para ${dayId}:`, tasks); // Verifica o que está sendo carregado
        tasks.forEach(task => {
            const dayElement = document.getElementById(dayId);
            const taskList = dayElement.querySelector('.task-list');

            // Cria um novo item de tarefa
            const taskItem = document.createElement('li');
            taskItem.innerHTML = `<input type="checkbox" onchange="updateTaskState(this, '${dayId}')" ${task.completed ? 'checked' : ''} /> ${task.text} <button onclick="removeTask(this)" class="remove-button"><i class="fas fa-trash"></i></button>`;
            taskList.appendChild(taskItem);
        });
        updateProgress(dayId); // Atualiza o progresso do dia após carregar as tarefas
    });
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
