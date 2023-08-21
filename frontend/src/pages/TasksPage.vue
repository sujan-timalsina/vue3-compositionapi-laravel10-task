<template>
    <main style="min-height: 50vh; margin-top: 2rem;">
        <div class="container">
            <div class="row">
                <div class="col-md-8 offset-md-2">
                    <!-- Add new Task -->
                    <NewTask @added="handleAddedTask" />
                    <!-- List of uncompleted tasks -->
                    <Tasks :tasks="uncompletedTasks" @updated="handleUpdatedTask" @completed="handleCompletedTask"
                        @removed="handleRemovedTask" />

                    <!-- show toggle button  -->
                    <div class="text-center my-3" v-show="showToggleCompletedBtn">
                        <button class="btn btn-sm btn-secondary" @click="showCompletedTasks = !showCompletedTasks">
                            <span v-if="!showCompletedTasks">Show Completed</span>
                            <span v-else>Hide Completed</span>
                        </button>
                    </div>

                    <!-- list of completed tasks  -->
                    <Tasks :tasks="completedTasks" :show="completedTasksIsVisible && showCompletedTasks"
                        @updated="handleUpdatedTask" @completed="handleCompletedTask" @removed="handleRemovedTask" />
                </div>
            </div>
        </div>
    </main>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { storeToRefs } from "pinia";
import { allTasks, createTask, updateTask, completeTask, removeTask } from "../http/task-api";
import Tasks from "../components/tasks/Tasks.vue";
import NewTask from '../components/tasks/NewTask.vue';
import { useTaskStore } from "../stores/task"

const store = useTaskStore();
// const { task } = store; // we cannot destructure like this
// it will break reactivity of the state

//mutating state eg..
// store.task.name = "first task updated";
// store.task.is_completed = true;
/*
//$patch allows to mutate multiple state at the same time 
store.$patch({
    task: {
        name: "First task updating using $patch",
        is_completed: true
    }
})
*/

// to extract properties from the store while keeping its reactivity
// we can use storeToRefs function to destructure state and actions to keep reactivity
const { completedTasks, uncompletedTasks } = storeToRefs(store);

// we can simply destructure action without storeToRefs method
const { fetchAllTasks } = store;

const tasks = ref([]);

onMounted(async () => {
    // without pinia calling api here directly
    // const { data } = await allTasks();
    // tasks.value = data.data;

    // with pinia calling action here
    // that action will call api
    await fetchAllTasks();
    console.log(tasks.value);
    console.log(completedTasks.value);
    console.log(uncompletedTasks.value);
})

// const uncompletedTasks = computed(() => tasks.value.filter(task => !task.is_completed));
// const completedTasks = computed(() => tasks.value.filter(task => task.is_completed));

const showToggleCompletedBtn = computed(
    () => uncompletedTasks.value.length > 0 && completedTasks.value.length > 0
);

const completedTasksIsVisible = computed(() => uncompletedTasks.value.length == 0 || completedTasks.value.length > 0);
// const showCompletedTasks = ref(completedTasksIsVisible.value);
const showCompletedTasks = ref(false);

const handleAddedTask = async (newTask) => {
    const { data: createdTask } = await createTask(newTask);
    tasks.value.unshift(createdTask.data);
}

const handleUpdatedTask = async (task) => {
    const { data: updatedTask } = await updateTask(task.id, { name: task.name });

    const currentTask = tasks.value.find(item => item.id == task.id);
    currentTask.name = updatedTask.data.name;
}

const handleCompletedTask = async (task) => {
    const { data: updatedTask } = await completeTask(task.id, { is_completed: task.is_completed });

    const currentTask = tasks.value.find(item => item.id == task.id);
    currentTask.is_completed = updatedTask.data.is_completed;
}

const handleRemovedTask = async (task) => {
    await removeTask(task.id);
    const index = tasks.value.findIndex(item => item.id == task.id);
    tasks.value.splice(index, 1);
}
</script>