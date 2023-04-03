
import { Task } from './Task.js';
import { TasksList } from './TasksList.js';

const taskListOutput = document.querySelector("#final-list-output");

let wrapper = document.querySelector('#final-list-output');

const formTasks = document.getElementById('formTasks');
const taskName = document.getElementById('task-name-input');
const taskDescription = document.getElementById('task-description-input');
const taskDeadline = document.getElementById('task-deadline-input');
const taskCategory = document.getElementById('category-select');

const searchInput = document.getElementById('search-input');
const taskTags = document.getElementById('task-tags-input');

const searchForm = document.getElementById('search-form');
const categoryInput = document.getElementById('category-input');
const deadlineInput = document.getElementById('deadline-input');
const completeInput = document.getElementById('complete-input');
const buttonEdit = document.getElementById('edit-task');
const btnSave = document.getElementById('btnSave');
const bttnFilterByName = document.getElementById('bttn-search-by-name');
const searchByNameBar = document.getElementById('search-by-name-bar');
const btnShowModal = document.getElementById('btnShowModal');
const taskModal = document.getElementById("task-modal");

function filterTaskByName()
{
    event.preventDefault();
    let matchingTasks = tasksList;
    if(searchByNameBar.value != "") matchingTasks = tasksList.filterByName(searchByNameBar.value);
    if(matchingTasks.getTasksList().length == 0) taskListOutput.innerHTML =  "No se encontraron coincidencias";
    else updateHtml(matchingTasks);
}

bttnFilterByName.addEventListener("click",filterTaskByName);

let tasksList = new TasksList();

let option="";

function clearInputValues()
{
    taskName.value = '';
    taskDescription.value = '';
    taskDeadline.value = '';
    taskTags.value = '';
    taskCategory.value = '';
}

//Search task by descriptions or tags
searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    let matchingTasks = tasksList;
    console.log('search: ' + '"' + searchInput.value + '"' + ', category: ' + '"' + categoryInput.value + '"' + ', deadline: ' + '"' + deadlineInput.value + '"');
    if(searchInput.value != "") matchingTasks = matchingTasks.filterByDescription(searchInput.value);
    if(categoryInput.value != 'All') matchingTasks = matchingTasks.filterByCategory(categoryInput.value);
    if(deadlineInput.value != null && deadlineInput.value != "") matchingTasks = matchingTasks.filterByDeadline(deadlineInput.value);
    if(completeInput.value != 'All') matchingTasks = matchingTasks.filterByComplete(completeInput.value);
    if(matchingTasks.getTasksList().length == 0) taskListOutput.innerHTML =  "No se encontraron coincidencias";
    else updateHtml(matchingTasks);
})

let taskId;

function fillTaskForm(task)
{
    taskName.value = task.getName();
    taskDescription.value = task.getDescription();
    taskDeadline.value=task.getDeadline();
    taskTags.value = task.getTagsStr();
    taskCategory.value = task["category"];
}

wrapper.addEventListener('click', (event) => {
    const isButton = event.target.nodeName === 'BUTTON';
    if (!isButton)
    {
        return;
    }
    let buttonId = event.target.id;

    let regExpEdit = /-edit-/;
    let regExpDelete = /-del-/;
    let isEdit = regExpEdit.test(buttonId)
    let isDelete = regExpDelete.test(buttonId)
    if(isEdit)
    {
        taskModal.style.display = "block";
        taskId = buttonId.split(regExpEdit)[1];
        let task = tasksList.getTask(taskId);
        fillTaskForm(task);
        buttonEdit.disabled = false;
        btnSave.disabled = true;
        buttonEdit.setAttribute("data-task-id",taskId);
    }
    else if(isDelete)
    {
        taskId= parseInt(buttonId.split(regExpDelete)[1]);
        tasksList.removeTask(taskId);
        updateHtml(tasksList);
    }
})

wrapper.addEventListener('click',(event) => {
    const isCheck = event.target.type === 'checkbox';
    console.log(event.target.checked)
    const valorCheck = event.target.checked;
    console.log(valorCheck)
    if(!isCheck)
    {
        return;
    } else {
        let checkId = event.target.id;
        console.log(checkId)
        let regExpCheck = /-checkbox-/;
        taskId = checkId.split(regExpCheck)[1];
        console.log(taskId)
        tasksList.CompleteTask(taskId,valorCheck);
        console.log(tasksList);
    }
})

formTasks.addEventListener("submit",event=>{
    event.preventDefault();
    let task = new Task(null,taskName.value,taskDescription.value,taskCategory.value,taskDeadline.value);
    task.extractTags();
    task.addTags(taskTags.value);
    tasksList.addTask(task);
    updateHtml(tasksList);
    clearInputValues();
    taskModal.style.display = "none";
})

buttonEdit.addEventListener("click",()=>{
    let taskId = buttonEdit.getAttribute("data-task-id");
    let editedTask = new Task(null,taskName.value, taskDescription.value,taskCategory.value,taskDeadline.value)
    editedTask.extractTags();
    editedTask.addTags(taskTags.value);
    tasksList.editTask(taskId, editedTask);
    buttonEdit.disabled = true;
    updateHtml(tasksList);
    btnSave.disabled = false;
    clearInputValues();
    taskModal.style.display = "none";
});


function updateHtml(taskListToShow)
{
    let taskListHtml = getTasksListHtml(taskListToShow);
    taskListOutput.innerHTML =  taskListHtml;
}

function markCheckbox()
{
    document.querySelector('input[type="checkbox"]')
    console.log()
}

function introduceHtmlForTask(task, iteration)
{
    wrapper = document.getElementById('final-list-output');
    let checked = " ";
    if(task.isComplete)
    {
        checked = "checked"
    }
    let htmlListElement = `
    <div id="accordion-item-`+task["id"]+`" class="accordion-item">
        <input type="checkbox" name="" id="chb-checkbox-`+task["id"]+`" class="hidden-box" ${checked}>
        <label for="heading` + iteration + `" class="accordion-header check-label" id="heading` + iteration + `">       
            <button class="accordion-button check-label-text collapsed " type="button" data-bs-toggle="collapse" data-bs-target="#collapse` + iteration + `" aria-expanded="false" aria-controls="collapse` + iteration + `">
                `+ task["name"] +`
            </button>
        </label>
       
        <div id="collapse` + iteration + `" class="accordion-collapse collapse" aria-labelledby="heading` + iteration + `" data-bs-parent="#accordionExample">
            <div class="accordion-body">
                <div class="task-description">`
        + task["description"] + `
                </div>
                <div class="task-description">
                    Category: `+ task["category"] + `
                </div>
                <div class="task-description">
                    Tags: ` + task.getTagsStr() + `
                </div>
                <div class="task-deadline">
                    <strong>Deadline:</strong>` + task["deadline"] + `
                </div>
                <div class="btnsTasks">
                    <button id="bttn-edit-`+task["id"]+`" type="button" class="btn-edit btn btn-success py-0">Edit</button>
                    <button id="bttn-del-`+task["id"]+`" type="button" class="btn-del btn btn-danger py-0 px-1">Delete</button>
                </div>
            </div>
        </div>
    </div>
    `;
    return htmlListElement;
}

function getTasksListHtml(tasksList)
{
    let taskListHtml = "";
    let iteration = 0;
    tasksList.getTasksList().forEach(task => {
        taskListHtml = taskListHtml + (introduceHtmlForTask(task, iteration));
        iteration++;
    });
    return taskListHtml;
}

btnShowModal.addEventListener('click',(event) => {
    taskModal.style.display = "block";
})

btnCloserModal.addEventListener('click',(event) => {
    taskModal.style.display = "none";
})