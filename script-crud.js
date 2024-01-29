const taskListContainer = document.querySelector('.app__section-task-list');

const formTask = document.querySelector('.app__form-add-task');
const toggleFormTaskBtn = document.querySelector('.app__button--add-task');
const formLabel = document.querySelector('.app__form-label');
const textArea = document.querySelector('.app__form-textarea');
const cancelBtn = document.querySelector('.app__form-footer__button--cancel');
const deleteBtn = document.querySelector('.app__form-footer__button--delete');

const btnDeletarConcluidas = document.querySelector('#btn-remover-concluidas');
const btnDeletarTodas = document.querySelector('#btn-remover-todas');

const taskAtiveDescription = document.querySelector('.app__section-active-task-description');




const localStorageTarefas = localStorage.getItem('tarefas')
let tarefas = localStorageTarefas ? JSON.parse(localStorageTarefas) : [];

let taskIconSvg = `
<svg class="app_section-task-icon-status" width="24" height="24" viewBox="0 0 24 24"
fill="none" xmlns="http://www.w3.org/2000/svg"> <circle cx="12" cy="12" r="12" fill="white" />
    <svg width="24" height="24" viewBox="0 0 14 18" fill="none" 
        xmlns="http://www.w3.org/2000/svg">
        <path d="M6 11.1719L16.5938 0.578125L18 1.98438L6 13.9844L0.421875 8.40625L1.82812 7L6 11.1719Z"
        fill="black" />
    </svg>
</svg>
`;

const taskIconSvgConcluida = `
<svg class="app_section-task-icon-status" width="24" height="24" viewBox="0 0 24 24"
fill="none" xmlns="http://www.w3.org/2000/svg"> <circle cx="12" cy="12" r="12" fill="#02CDA1" />
    <svg width="24" height="24" viewBox="0 0 14 18" fill="none" 
        xmlns="http://www.w3.org/2000/svg">
        <path d="M6 11.1719L16.5938 0.578125L18 1.98438L6 13.9844L0.421875 8.40625L1.82812 7L6 11.1719Z"
        fill="white" />
    </svg>
</svg>
`;

let tarefaSelecionada = null;
let itemTarefaSelecionada = null;

let tarefaEmEdicao = null;
let paragraphEmEdicao = null;

const selecionaTarefa = (tarefa, elemento) => {

    if(tarefa.concluida) {
        return
    }

    document.querySelectorAll('.app__section-task-list-item-active').forEach(function (button) {
        button.classList.remove('app__section-task-list-item-active');
    });
        
if (tarefaSelecionada == tarefa) {
    taskAtiveDescription.textContent = null;
    itemTarefaSelecionada = null;
    tarefaSelecionada = null;
    
    return }   
    
    tarefaSelecionada = tarefa
    itemTarefaSelecionada = elemento
    taskAtiveDescription.textContent = tarefa.descricao
    elemento.classList.add('app__section-task-list-item-active')
    
}

const selecionaTarefaParaEditar = (tarefa, elemento) => {
    
    if(tarefaEmEdicao == tarefa) {
        limparForm()
        return
    }

    formLabel.textContent = 'Editando tarefa';
    tarefaEmEdicao = tarefa;
    paragraphEmEdicao = elemento;
    textArea.value = tarefa.descricao;
    formTask.classList.remove('hidden');
    

}

function createTask(tarefa) {
    const li = document.createElement('li');
    li.classList.add('app__section-task-list-item');

    const svgIcon = document.createElement('svg');
    svgIcon.innerHTML = taskIconSvg;
    

    const paragraph = document.createElement('p');
    paragraph.classList.add('app__section-task-list-item-description');
    paragraph.textContent = tarefa.descricao;

    const button = document.createElement('button');

    button.classList.add('app_button-edit');

    const editIcon = document.createElement('img');
    editIcon.setAttribute('src', './imagens/edit.png');

    button.appendChild(editIcon);

    button.addEventListener('click', (event) => {
        event.stopPropagation();
        selecionaTarefaParaEditar(tarefa, paragraph);      
    });


    li.onclick = () => {
        selecionaTarefa(tarefa, li)
    }

    svgIcon.addEventListener('click', (event) => {
        if(tarefa==tarefaSelecionada) {
            event.stopImmediatePropagation();
            button.setAttribute('disabled', true);
            li.classList.add('app__section-task-list-item-complete');
            tarefaSelecionada.concluida = true;
            updateLocalStorage();
            svgIcon.innerHTML = taskIconSvgConcluida;
        }

        
    });
    
    if(tarefa.concluida) {
        button.setAttribute('disabled', true)
        li.classList.add('app__section-task-list-item-complete');  
        svgIcon.innerHTML = taskIconSvgConcluida;
    }



    li.appendChild(svgIcon);
    li.appendChild(paragraph);
    li.appendChild(button);

    

    return li
};


tarefas.forEach(task => {
    const taskItem = createTask(task);
    taskListContainer.appendChild(taskItem);
});

toggleFormTaskBtn.addEventListener('click', () =>{
    formLabel.textContent = 'Descreva a tarefa';
    formTask.classList.toggle('hidden');
});

function limparForm() {
    tarefaEmEdicao = null;
    paragraphEmEdicao = null;    
    formTask.classList.add('hidden');
    textArea.value = "";
}

const updateLocalStorage = () => {
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
};

formTask.addEventListener('submit', (evento) => {
    evento.preventDefault();
    if(tarefaEmEdicao) {
        tarefaEmEdicao.descricao = textArea.value;
        paragraphEmEdicao.textContent = textArea.value;
    } else {
        const task = {
        descricao: textArea.value,
        concluida: false
    }
    tarefas.push(task);
    const taskItem = createTask(task);
    taskListContainer.appendChild(taskItem);
    }
    updateLocalStorage();
    limparForm();
});

cancelBtn.addEventListener('click', () => {
    limparForm();
});

deleteBtn.addEventListener('click', () =>{

    if(tarefaSelecionada) {
        const index = tarefas.indexOf(tarefaSelecionada)

        if(index !== -1) {
            tarefas.splice(index, 1);
        }

        itemTarefaSelecionada.remove();
        tarefas.filter(t => t!= tarefaselecionada);
        itemTarefaSelecionada = null;
        tarefaSelecionada = null;
        limparForm();
    }

    updateLocalStorage();
});


const removerTarefas = (somenteConcluidas) => {
    const seletor = somenteConcluidas ? '.app__section-task-list-item-complete' : '.app__section-task-list-item';
    document.querySelectorAll(seletor).forEach((element) => {
        element.remove()
    });

    tarefas = somenteConcluidas ? tarefas.filter(t => !t.concluida) : [];
    updateLocalStorage();
};

btnDeletarConcluidas.addEventListener('click', () => removerTarefas(true));
btnDeletarTodas.addEventListener('click', () => removerTarefas(false));


musicaAcabou.addEventListener('play', (e) => {

    if(tarefaSelecionada && document.querySelector('HTML').getAttribute('data-contexto') === "foco") {
        tarefaSelecionada.concluida = true;
        itemTarefaSelecionada.classList.add('app__section-task-list-item-complete');
        itemTarefaSelecionada.querySelector('button').setAttribute('disabled', true);
        updateLocalStorage();
        svgIcon.innerHTML = taskIconSvgConcluida;
    }
})

// document.addEventListener('TarefaFinalizada', function (e) {
//     if(tarefaSelecionada) {
//         tarefaSelecionada.concluida = true;
//         itemTarefaSelecionada.classList.add('app__section-task-list-item-complete');
//         itemTarefaSelecionada.querySelector('button').setAttribute('disabled', true);
//         updateLocalStorage();
//     }
// })