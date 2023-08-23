import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { allTasks, createTask, updateTask, removeTask, completeTask } from "../http/task-api";

/*
const taskStoreObject = {
    state: () => ({
        tasks: [],
        task: {
            id: 1,
            name: "first task",
            is_completed: false
        }
    }),
    getters: {
        completedTasks: (state) => state.tasks.filter(task => task.is_completed),
        uncompletedTasks() {
            return this.tasks.filter(task => !task.is_completed)
        },
        // uncompletedCount() {
        //     return this.uncompleted.length
        // }
    },
    actions: {
        async fetchAllTasks() {
            const { data } = await allTasks();
            this.tasks = data.data;
        }
    }
}
*/

export const useTaskStore = defineStore('taskStore', () => {
    // to define a state in this function, we may utilize the ref or reactive functions
    const tasks = ref([]);

    // for getter we may utilize the computed function
    const completedTasks = computed(() => tasks.value.filter(task => task.is_completed));
    const uncompletedTasks = computed(() => tasks.value.filter(task => !task.is_completed));

    // for action we may utilize the async/await function
    const fetchAllTasks = async () => {
        const { data } = await allTasks();
        tasks.value = data.data;
    }

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

    return {
        tasks,
        completedTasks,
        uncompletedTasks,
        fetchAllTasks,
        handleAddedTask,
        handleUpdatedTask,
        handleCompletedTask,
        handleRemovedTask
    };
})