import { createStore } from 'vuex';

const store = createStore({
    state: {
        todos: [
            {
                title: "todo item a",
                completed: false
            },
            {
                title: "todo item b",
                completed: false
            },
        ],
        userDetails: { name: '', id: '' }
    },

    getters: {
        completedTodos(state) {
            return state.todos.filter(todo => {
                return todo.completed === true;
            }).length;
        },

        pendingTodos(state) {
            return state.todos.filter(todo => {
                return todo.completed === false;
            }).length;
        },

        getUserDetails(state) {
            return state.userDetails.name;
        }
    },

    mutations: {
        NEW_TODO(state, todoItem) {
            state.todos.push({
                title: todoItem,
                completed: false
            })
        },

        DELETE_TODO(state, todoItem) {
            let index = state.todos.indexOf(todoItem);
            state.todos.splice(index, 1);
        },

        TOGGLE_TODO_STATUS(state, todoItem) {
            todoItem.completed = !todoItem.completed;
        },

        STORE_USER_DETAILS(state, data) {
            state.userDetails = { name: data, id: data }
        }
    },

    actions: {
        addNewTodo({ commit }, todoItem) {
            commit('NEW_TODO', todoItem);
        },

        deleteTodo({ commit }, todoItem) {
            commit('DELETE_TODO', todoItem);
        },

        toggleTodoStatus({ commit }, todoItem) {
            commit('TOGGLE_TODO_STATUS', todoItem);
        },

        storeUserDetails({ commit }, data) {
            commit('STORE_USER_DETAILS', data);
        }
    }
});
export default store