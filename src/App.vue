<template>
  <div>
    <form class="inputNewTask" @submit.prevent="handleSubmit">
      <input 
        type="text"
        placeholder="I need to..."
        v-model="newTask"
      >
      <button>+</button>
    </form>
    <div class="flex">
      <!-- New Tasks Section -->
      <div id = "new" class="col-4">
        <h3>New Tasks</h3>
        <draggable class="list-group" :list="newTasks" group="tasks" @change="updateBlock($event,'new')" :options="dragOptions" drag-class="drag" ghost-class="ghost">
          <template #item="{ element }">
            <div class="list-group-item" :key="element.id">
              <div class="taskDetail">
                {{ element.title }}
                <br>
                <div style="text-align:right;">
                    <button class="deleteTask" @click="deleteTask(element.id)">-</button>
                </div>
              </div>
            </div>
          </template>
        </draggable>
      </div>
      

      <div id="ongoing" class="col-4">
        <h3>Ongoing</h3>
        <Draggable class="list-group" :list="ongoingTasks" group="tasks" @change="updateBlock($event,'ongoing')" :options="dragOptions" drag-class="drag" ghost-class="ghost">
          <template #item="{ element }">
            <div class="list-group-item" :key="element.id">
              <div class="taskDetail">
                {{ element.title }}
                <br>
                <div style="text-align:right;">
                    <button class="deleteTask" @click="deleteTask(element.id)">-</button>
                </div>
              </div>
            </div>
          </template>
        </Draggable>
      </div>

      <div id="done" class="col-4">
        <h3>Done</h3>
        <Draggable class="list-group" :list="doneTasks" group="tasks" @change="updateBlock($event,'done')" :options="dragOptions" drag-class="drag" ghost-class="ghost">
          <template #item="{ element }">
            <div class="list-group-item" :key="element.id">
              <div class="taskDetail">
                {{ element.title }}
                <br>
                <div style="text-align:right;">
                    <button class="deleteTask" @click="deleteTask(element.id)">-</button>
                </div>
              </div>
            </div>
          </template>
        </Draggable>
      </div>
    </div>
    

  </div>
</template>

<script>
import Draggable from "vuedraggable";
import { useNewTaskStore } from "./stores/newTaskStore";
import { ref, onMounted } from "vue";

export default {
  components: {
    Draggable,
  },
  setup() {
    const newTaskStore = useNewTaskStore();

    const newTasks = ref([]);
    const ongoingTasks = ref([]);
    const doneTasks = ref([]);
    const newTask = ref('');

    const getTasks = async () => {
      await newTaskStore.getTasks();

      newTasks.value = newTaskStore.newTasks.filter((task) => task.block === "new");
      ongoingTasks.value = newTaskStore.newTasks.filter((task) => task.block === "ongoing");
      doneTasks.value = newTaskStore.newTasks.filter((task) => task.block === "done");
    };
    const updateBlock = async (event,newBlock) =>
    {
      let item = event.added || event.moved;
      let updatedId = item.element.id;
      (newTaskStore.newTasks.find(Task => Task.id === updatedId)).block = newBlock;
      newTaskStore.updateLocalStorage();

    }
    onMounted(getTasks);
    const handleSubmit = () => {
      if (newTask.value.length > 0) {
        newTaskStore.addTask({
          title: newTask.value,
          block: 'new',
          id: Math.floor(Math.random() * 10000)
        });
        newTask.value = '';
        getTasks();
      }
    };
    const deleteTask = (id) => {
      newTaskStore.deleteTask(id);
      getTasks();
    }

    const dragOptions = {
        draggingClass:"dragging-item",
    }
    return {
      newTasks,
      ongoingTasks,
      doneTasks,
      handleSubmit,
      newTask,
      updateBlock,
      deleteTask,
      dragOptions
    };
  }
};
</script>

<style>
    .body{
        background-color: rgb(32, 33, 33);
    }
  .flex{
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 10px;
  }

  .col-4
  {
    border-radius: 10px;
    padding: 10px;
    box-sizing: border-box;

  }

  #new{
    background-color: rgb(75, 76, 75);
  }
  #ongoing
  {
    background-color: rgb(65, 181, 173);
  }
  #done
  {
    background-color: rgb(37, 213, 40);
  }

  .taskDetail
  {
    margin: 15px;
    background-color: rgb(54, 54, 54);
    border-radius: 5px;
    padding: 20px;
    font-size:30px;
    color:white;
  }

  .inputNewTask
  {
    background-color: rgb(0, 203, 193);
    margin-bottom: 25px;
    border-radius: 10px;
    text-align: center;
    padding: 10px;
  }
  .inputNewTask input{
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Optional box shadow for depth */
    font-size: 30px;

    outline: none;
  }
  .inputNewTask input:focus{
    border-color: #66afe9; /* Change border color on focus */
    box-shadow: 0 0 5px #66afe9;
  }

  .inputNewTask button{
    padding: 10px 20px; /* Adjust padding as needed */
    font-size: 32px;
    font-weight: bold;
    border: none;
    border-radius: 5px;
    background-color: #3498db;
    color: #fff;
    cursor: pointer;
    transition: background-color 0.3s ease; /* Add a smooth transition effect */
    outline: none;
  }

  .inputNewTask button:hover{
    background-color: #2980b9;
  }
  .inputNewTask button:focus{
    background-color: #1f618d;
  }

  .col-4 h3{
    font-size: 2.5em; /* Adjust font size as needed */
    font-weight: bold;
    color: white; /* Adjust color */
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
    text-align: center;
  }

    .draggable-item {
        transition: transform 0.3s ease; /* Example transition for smoother movement */
    }

    .deleteTask
    {
        text-align: right;
        font-size: 20px;
        height: 30px;
        width: 30px;
        padding-right: 10px ;
    }
    .drag > div{
        transform: rotate(5deg);
    }
    .ghost
    {
        background-color: lightgray;
        border-radius: 6px;
    }
    .ghost>div{
        visibility: hidden;
    }
</style>
