import {Task} from "./Task.js"

class TasksList {

    constructor()
    {
        this.tasksList = [];

    }

    getTasksList()
    {
        return this.tasksList;
    }

    getTasksNamesList()
    {
        let taskNamesLists = this.tasksList.map( (t) => {return t.getName();});
        return taskNamesLists;
    }

    getNextId()
    {
        let nextId = 1;
        let listLenght = this.tasksList.length;
        if (listLenght > 0)
        {
            nextId = this.tasksList[listLenght-1]["id"] + 1;
        }
        return nextId;
    }

    //js no soporta sobrecarga de metodos, not change to add.
    addTask(newTask)
    {
        let newTaskName = newTask.getName();
        let sentenceExpression = /\w+/;
        let hasNotOnlySpaces = newTaskName.match(sentenceExpression) != null;
        let nameNotEmpty = newTaskName !="";
        let id = this.getNextId();
        if(hasNotOnlySpaces && nameNotEmpty)
        {
            newTask['id'] = id;
            this.tasksList.push(newTask);
        }
    }

    add(newTaskName, description,category,deadline,isComplete)
    {
        let sentenceExpression = /\w+/;
        let hasNotOnlySpaces = newTaskName.match(sentenceExpression) != null;
        let nameNotEmpty = newTaskName !="";
        let id = this.getNextId();
        if(hasNotOnlySpaces && nameNotEmpty)
        {
            let newTask = new Task(id,newTaskName,description,category,deadline,isComplete);
            newTask.extractTags();
            this.tasksList.push(newTask);
        }
    }

    removeTask(taskId)
    {
        for(let i =0; i < this.tasksList.length; i++)
        {
            if(this.tasksList[i].hasSameId(taskId))
            {
                this.tasksList.splice(i, 1);
            }
        }
    }

    getTask(taskId)
    {
        let searchedTask = null;
        for(let task of this.tasksList)
        {
            if(task.hasSameId(taskId))
            {
                searchedTask = task;
            }
        }
        return searchedTask;
    }


    editTask(taskId,modifiedTask)
    {
        let taskToEdit = this.getTask(taskId);
        if (taskToEdit!=null)
        {
            taskToEdit.set(modifiedTask);
        }
    }

    filter(conditionLambda)
    {
        let filteredTaskList = new TasksList();
        filteredTaskList.tasksList = this.tasksList.filter(conditionLambda);
        return filteredTaskList;
    }

    filterTasksBy(taskFieldToMatch,pattern)
    {
        let patternRegExp = new RegExp(pattern, "i");
        let matchedTasks = this.filter((t)=>patternRegExp.test(t[taskFieldToMatch]));
        return matchedTasks;
    }

    //suggar syntax, not test neccesary
    filterByName(taskNamePattern)
    {
        let matchedTasks = this.filterTasksBy("name",taskNamePattern);
        return matchedTasks;
    }

    filterByDescription(description)
    {
        let matchedTasks = this.filterTasksBy("description",description);
        return matchedTasks;
    }

    filterByTag(tag)
    {
        let patternRegExp = new RegExp(tag, "i");
        let matchedTasks = this.filter((t)=>{
            return patternRegExp.test(t.getTagsStr());
        });
        return matchedTasks;
    }

    filterByCategory(category)
    {
        let matchedTasks = this.filterTasksBy("category",category);
        return matchedTasks;
    }

    searchByName(name)
    {
        for(let task of this.tasksList)
        {
            if(task.getName() == name) return task;
        }
    }

    CompleteTask(taskId,isChecked)
    {
        let statusTask = new Task(taskId,null,null,null,null,isChecked);
        this.editTask(taskId,statusTask);
    }

    filterByComplete(isComplete)
    {
        let matchedTasks = this.filterTasksBy("isComplete",isComplete);
        return matchedTasks;
    }

    filterByDeadline(deadline)
    {
        let matchedTasks = new TasksList();
        for(let task of this.tasksList)
        {
            if(task.getOnlyTheDate() == deadline) matchedTasks.addTask(task);
        }
        return matchedTasks;
    }

};

export {TasksList as TasksList}