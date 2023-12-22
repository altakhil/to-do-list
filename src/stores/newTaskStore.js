import { defineStore } from 'pinia'

export const useNewTaskStore = defineStore('newTaskStore',{
    state: () => ({
        newTasks: [],
    }),
    actions:{
        initializeTasksFromLocalStorage() {
            const savedTasks = localStorage.getItem('newTasks')
            if (savedTasks) {
                this.newTasks = JSON.parse(savedTasks)
            }
        },
        updateLocalStorage() {
            localStorage.setItem('newTasks', JSON.stringify(this.newTasks))
        },
        async getTasks(){

            this.initializeTasksFromLocalStorage()
            window.addEventListener('beforeunload', this.updateLocalStorage)
        },
        removeUpdateListener() {
            window.removeEventListener('beforeunload', this.updateLocalStorage)
        },
        onUnmount() {
            this.removeUpdateListener()
        },
        async addTask(task){
            this.newTasks.push(task)
            this.updateLocalStorage()
        },
        async deleteTask(id){
            this.newTasks = this.newTasks.filter(t => t.id !== id)
            this.updateLocalStorage()
        },
        // Inside useNewTaskStore.js
        moveTask(taskId, originBlock, targetBlock) {
            const taskToMove = this.newTasks.find(
            task => task.id === taskId && task.block === originBlock
            );
            
            if (taskToMove) {
            taskToMove.block = targetBlock;
            this.updateLocalStorage(); // Update localStorage after changing block
            }
        }
  
          
          
    }
})
