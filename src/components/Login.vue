<template>
    <div id="page-container" class="flex flex-col mx-auto w-full min-h-screen bg-gray-100">
        <main id="page-content" class="flex flex-auto flex-col max-w-full">
            <div
                class="min-h-screen flex bg-white items-center justify-center relative overflow-hidden max-w-10xl mx-auto p-4 lg:p-8 w-full">
                <div
                    class="pattern-dots-md text-gray-300 absolute top-0 right-0 w-32 h-32 lg:w-48 lg:h-48 transform translate-x-16 translate-y-16">
                </div>
                <div
                    class="pattern-dots-md text-gray-300 absolute bottom-0 left-0 w-32 h-32 lg:w-48 lg:h-48 transform -translate-x-16 -translate-y-16">
                </div>

                <div class="py-6 lg:py-0 w-full md:w-8/12 lg:w-6/12 xl:w-4/12 relative">
                    <div class="mb-8 text-center">
                        <h1 class="text-4xl font-bold inline-flex items-center mb-1 space-x-3">
                            <img alt="Vue logo" src="@/assets/chatLogo.png">
                            <!-- Logo -->
                        </h1>
                    </div>

                    <div class="flex flex-col rounded-lg shadow-sm bg-white drop-shadow-2xl overflow-hidden">
                        <div class="p-5 lg:p-6 grow w-full">
                            <div class="sm:p-5 lg:px-10 lg:py-8 lg:pt-4">
                                <div class="space-y-3">
                                    <div class="text-center"><label class="text-2xl font-semibold">Log in</label></div>
                                    <div class="space-y-1">
                                        <label class="text-gray-400 text-xs">User name</label>
                                        <input
                                            class="block border border-gray-200 rounded-md px-5 py-3 leading-6 w-full focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                                            v-model="username" @keyup.enter="login" type="text"
                                            placeholder="" />
                                    </div>
                                    <div>
                                        <button type="submit" :disabled="!username" @click="login"
                                            class="text-xs inline-flex justify-center items-center space-x-2 border font-semibold focus:outline-none w-full px-4 py-2 leading-6 rounded-md border-indigo-700 bg-violet-700 text-white hover:text-white hover:bg-violet-800 hover:border-indigo-800 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 active:bg-indigo-700 active:border-indigo-700">
                                            {{ isLoading ? "Loading..." : "Log In" }}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>
  
<script>
import { mapGetters } from "vuex";
import { ref, onMounted } from 'vue';
import { useRouter } from "vue-router";
import { initializeSocket } from "@/utils/socket"
import { getUserDetails, storeUserDetails } from "@/helper/helper"


export default {
    name: 'UserLogin',
    computed: {
        ...mapGetters({
            completedTodos: "completedTodos",
            pendingTodos: "pendingTodos"
        }),
    },
    setup() {
        const router = useRouter();
        const username = ref('');
        const isLoading = ref(false);
        const loggedInUser = getUserDetails();
        const loggedInUserId = ref(loggedInUser?.id || '');

        //Initilize Socket
        const socket = initializeSocket();

        //Login Success Request
        socket.on('loginSuccessRequest', (data) => {
            isLoading.value = false;
            storeUserDetails(data)
            router.push({ name: "Chat" });
        });

        onMounted(() => {
            if (loggedInUserId?.value) {
                router.push({ name: "Chat" });
            }
            socket.emit('fetchUserList');
        });

        const login = () => {
            isLoading.value = true;
            socket.emit('loginRequest', username.value);
        };

        return {
            username,
            isLoading,
            login
        };
    },
};
</script>

<style lang="scss">
@import "@/styles/variables";
@import "@/styles/components";

.my-component {
    @extend .my-component;
}
</style>