import { ref, reactive, computed } from "vue";
import { defineStore } from "pinia";
import { allTasks } from "../http/task-api";

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

    return {
        tasks,
        completedTasks,
        uncompletedTasks,
        fetchAllTasks
    };
})