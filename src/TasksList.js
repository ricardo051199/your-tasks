import {Task,getTags} from "./Task.js"

class TasksList {

    constructor() {
        this.tasksList = [];

    }

    getTasksList()
    {
        return this.tasksList;
    }

    getTasksNamesList() {
        var taskNamesLists = this.tasksList.map( (t) => {return t.getName();});
        return taskNamesLists;
    }

    getNextId(){
        let nextId = 1;
        var listLenght = this.tasksList.length;
        if (listLenght > 0){
            nextId = this.tasksList[listLenght-1]["id"] + 1;
        }
        return nextId;
    }

    //js no soporta sobrecarga de metodos, not change to add.
    addTask(newTask){
        var newTaskName = newTask.getName();
        let sentenceExpression = new RegExp('\\w+');
        var hasNotOnlySpaces = newTaskName.match(sentenceExpression) != null;
        var nameNotEmpty = newTaskName !="";
        var id = this.getNextId();
        if(hasNotOnlySpaces && nameNotEmpty)
        {
            newTask['id'] = id;
            this.tasksList.push(newTask);
        }
    }

    add(newTaskName, description,category,deadline,isComplete){
        let sentenceExpression = new RegExp('\\w+');
        var hasNotOnlySpaces = newTaskName.match(sentenceExpression) != null;
        var nameNotEmpty = newTaskName !="";
        var id = this.getNextId();
        if(hasNotOnlySpaces && nameNotEmpty)
        {
            var newTask = new Task(id,newTaskName,description,category,deadline,isComplete);
            newTask.extractTags();
            this.tasksList.push(newTask);
        }
    }

    removeTask(taskId){
        for(var i =0; i < this.tasksList.length; i++) {
            if(this.tasksList[i].hasSameId(taskId)) {
                this.tasksList.splice(i, 1);
            }
        }
    }

    getTask(taskId)
    {
        var searchedTask = null;
        for(var i=0; i<this.tasksList.length; i++)
        {
            if(this.tasksList[i].hasSameId(taskId))
            {
                searchedTask = this.tasksList[i];
            }
        }
        return searchedTask;
    }


    editTask(taskId,modifiedTask){
        var taskToEdit = this.getTask(taskId);
        if (taskToEdit!=null)
        {
            taskToEdit.set(modifiedTask);
        }
    }

    filter(conditionLambda){
        var filteredTaskList = new TasksList();
        filteredTaskList.tasksList = this.tasksList.filter(conditionLambda);
        return filteredTaskList;
    }

    filterTasksBy(taskFieldToMatch,pattern){
        let patternRegExp = new RegExp(pattern, "i");
        var matchedTasks = new TasksList();
        matchedTasks = this.filter((t)=>patternRegExp.test(t[taskFieldToMatch]));
        return matchedTasks;
    }

    //suggar syntax, not test neccesary
    filterByName(taskNamePattern){
        var matchedTasks = this.filterTasksBy("name",taskNamePattern);
        return matchedTasks;
    }

    filterByDescription(description){
        var matchedTasks = this.filterTasksBy("description",description);
        return matchedTasks;
    }

    filterByTag(tag){
        let patternRegExp = new RegExp(tag, "i");
        var matchedTasks = this.filter((t)=>{
            return patternRegExp.test(t.getTagsStr());
        });
        return matchedTasks;
    }

    filterByCategory(category){
        var matchedTasks = this.filterTasksBy("category",category);
        return matchedTasks;
    }

    searchByName(name){
        for(var i=0; i<this.tasksList.length; i++)
        {
            if(this.tasksList[i].getName() == name) return this.tasksList[i];
        }
        return;
    }

    CompleteTask(taskId,isChecked){
        /*var status;
        if(isChecked===true){
            status=true;
        }else if(isChecked===false){
            status=false;
        }*/
        let statusTask = new Task(taskId,null,null,null,null,isChecked);
        this.editTask(taskId,statusTask);
    }

    filterByComplete(isComplete)
    {
        /*var tasksListIncompletes = [];
        tasksListIncompletes = this.tasksList.filter(function(Task){return Task.isComplete === false})
        return tasksListIncompletes;*/
        var matchedTasks = this.filterTasksBy("isComplete",isComplete);
        return matchedTasks;
    }

    filterByDeadline(deadline){
        var matchedTasks = new TasksList();
        for(var i = 0; i < this.tasksList.length; i++){
            if(this.tasksList[i].getOnlyTheDate() == deadline) matchedTasks.addTask(this.tasksList[i]);
        }
        return matchedTasks;
    }
};
export {TasksList as TasksList}