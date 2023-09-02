<template>
    <div id="page-container" class="flex flex-col mx-auto w-full min-h-screen bg-gray-100">
        <main id="page-content" class="flex flex-auto flex-col max-w-full">
            <div class="bg-gray-100">
                <div class="container p-6 mx-auto">
                    <div class="flex flex-wrap bg-white">
                        <!-- User List View -->
                        <div class="md:w-2/5 w-full pb-6 md:pb-0 border-r-2 relative">
                            <ul role="list" class="divide-y divide-gray-100">
                                <li class="flex justify-between gap-x-6 py-4 px-3 text-2xl">
                                    <h1 class="font-bold">Chat</h1>
                                </li>
                                <li class="flex justify-between gap-x-6 py-2 px-3 text-sm">
                                    <h1>Users</h1>
                                </li>
                                <li class="justify-between gap-x-6 py-5 px-3" v-if="!activeUserCount">
                                    <h1>Wating for more user join ...</h1>
                                </li>

                                <li v-for="userData in displayUserList" :key="userData.id"
                                    class="flex justify-between gap-x-6 py-5 px-3 cursor-pointer"
                                    @click="selectedUser(userData)">
                                    <div class="flex min-w-0 gap-x-4"
                                        v-if="userData.id !== loggedInUserId && userData.status">
                                        <div
                                            class="flex text-white items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                                            {{ firstCharacter(userData.name) }}
                                        </div>
                                        <div class="min-w-0 flex-auto">
                                            <p class="text-sm font-semibold leading-6 text-gray-900">
                                                {{ userData.name }}
                                            </p>
                                            <div class="text-color-blue"
                                                v-if="readMessageList[loggedInUserId] && readMessageList[loggedInUserId][userData.id]">
                                                New Message
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                            <div class="p-3 text-color-blue absolute bottom-0 w-full border-t">
                                <button @click="logout">
                                    <font-awesome-icon icon="fa-sign-out-alt" />
                                    <span class="ml-2">Logout</span>
                                </button>
                            </div>
                        </div>

                        <!-- Messaeg  List View -->
                        <div class="md:w-3/5 w-full border-r-2 border-white">
                            <div class="flex flex-col flex-auto flex-shrink-0 bg-gray-100 h-full" v-if="selctedUserID">
                                <div
                                    class=" h-16 relative flex justify-between items-center lg:space-x-4 md:space-x-4 space-x-0 p-3 bg-white">
                                    <div class="flex flex-col leading-tight">
                                        <div class="text-2xs mt-1 flex items-center">
                                            <div
                                                class="mr-2 text-white flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                                                {{ firstCharacter(selctedUserID.name) }}
                                            </div>
                                            <span class="text-gray-700 mr-3 font-bold">{{ selctedUserID.name }}</span>
                                        </div>
                                    </div>

                                    <div class="flex flex-col leading-tight filter p-2">

                                        <nav class="flex items-center space-x-1 md:space-x-2">
                                            <a href="javascript:void(0)" @click="filterMessage('all')"
                                                class="text-sm	px-3 h-4 py-3 font-medium flex items-center space-x-2 py-2 rounded-lg text-gray-500 hover:text-white hover:bg-indigo-500 active:bg-transparent"
                                                :class="{ 'text-white bg-indigo-500': selectedFilter == 'all' }">
                                                All
                                            </a>
                                            <a href="javascript:void(0)" @click="filterMessage('7days')"
                                                class="text-sm	px-3 h-4 py-3 font-medium flex items-center space-x-2 py-2 rounded-lg text-gray-500 hover:text-white hover:bg-indigo-500 active:bg-transparent"
                                                :class="{ 'text-white bg-indigo-500': selectedFilter == '7days' }">
                                                Today
                                            </a>
                                            <a href="javascript:void(0)" @click="filterMessage('today')"
                                                class="text-sm px-3 h-4 py-3 font-medium flex items-center space-x-2 py-2 rounded-lg text-gray-500 hover:text-white hover:bg-indigo-500 active:bg-transparent"
                                                :class="{ 'text-white bg-indigo-500': selectedFilter == 'today' }">
                                                Last 7 days
                                            </a>
                                        </nav>
                                    </div>
                                </div>
                                <div class="flex flex-col h-full overflow-x-auto mt-2">
                                    <div class="flex flex-col h-full height-card">
                                        <div class="grid grid-cols-12 gap-y-2">

                                            <div v-for="message in   messages  " :key="message.timestamp" :class="{
                                                'col-start-1 col-end-8 p-3 rounded-lg': message.sendrId != loggedInUserId,
                                                'col-start-6 col-end-13 p-3 rounded-lg': message.sendrId == loggedInUserId
                                            }">
                                                <div :class="{
                                                    'flex flex-row items-center': message.sendrId != loggedInUserId,
                                                    'flex items-center justify-start flex-row-reverse': message.sendrId == loggedInUserId
                                                }">
                                                    <div class="flex items-center justify-center h-10 w-10 rounded-full flex-shrink-0 shadow"
                                                        :class="{
                                                                'bg-white': message.sendrId != loggedInUserId,
                                                                'text-white bg-indigo-500': message.sendrId == loggedInUserId
                                                            }
                                                            ">
                                                        {{ firstCharacter(message.sender) }}
                                                    </div>


                                                    <div class="message-width" :class="{
                                                            'relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl ': message.sendrId != loggedInUserId,
                                                            'relative mr-3 text-white text-sm bg-indigo-500 py-2 px-4 shadow rounded-xl': message.sendrId == loggedInUserId
                                                        }
                                                        ">
                                                        <div>
                                                            {{ message.message }}
                                                        </div>
                                                        <div class="absolute text-xs bottom-0 -mb-5 ml-2 text-gray-500"
                                                            :class="{
                                                                    'left-0': message.sendrId != loggedInUserId,
                                                                    'bottom-0 right-0': message.sendrId == loggedInUserId
                                                                }
                                                                ">
                                                            {{ formatDate(message.timestamp) }}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="flex flex-row items-center h-16 bg-white w-full px-4">
                                    <div class="flex-grow ml-4">
                                        <div class="relative w-full">
                                            <input type="text" v-model="newMessage" @keyup.enter="sendMessage"
                                                placeholder="Write a message..."
                                                class="flex border-0 w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10" />
                                        </div>
                                    </div>
                                    <div class="ml-4">
                                        <button :disabled="!newMessage" @click="sendMessage"
                                            class="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 text-white rounded-full p-3 flex-shrink-0">
                                            <!-- <span>Send</span> -->
                                            <span>
                                                <svg class="w-4 h-4 transform rotate-45 -mt-px" fill="none"
                                                    stroke="currentColor" viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                                                </svg>
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div class="flex flex-col flex-auto flex-shrink-0 bg-white-100 h-full height-message-block"
                                v-if="!selctedUserID">
                                <div class="flex justify-center mt-10">
                                    <img class="rounded-full welcome-img"
                                        src="https://marketplace.canva.com/EAFEits4-uw/1/0/800w/canva-boy-cartoon-gamer-animated-twitch-profile-photo-r0bPCSjUqg0.jpg"
                                        alt="Profile Image">
                                </div>
                                <p class="flex items-center justify-center mt-5 text-2xl text-color-blue">
                                    Welcome to the chat, {{ loggedInUserName }}!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>
  
<script>
import { useRouter } from "vue-router";
import { initializeSocket } from "@/utils/socket";
import { ref, onMounted, computed } from 'vue';
import { formatDate, getUserDetails, firstCharacter } from "@/helper/helper";

export default {
    name: 'UserChat',
    setup() {
        const messages = ref([]);
        const router = useRouter();
        const newMessage = ref('');
        const selctedUserID = ref('');
        const displayUserList = ref([]);
        const readMessageList = ref({});
        const selectedFilter = ref('all');
        const loggedInUser = getUserDetails();
        const loggedInUserId = ref(loggedInUser?.id || '');
        const loggedInUserName = ref(loggedInUser?.name || '');

        //Initilize Socket
        const socket = initializeSocket();

        //Get Particular User Message
        socket.on('getMessages', (getMessages) => {
            messages.value = getMessages;
        });

        //New Message Add
        socket.on('newMessage', ({ message, authUserID, readMessage }) => {
            if (authUserID == loggedInUserId.value) {

                if (selctedUserID.value.id == message?.sendrId) {
                    messages.value.push(message);
                    socket.emit('updateReadMessageList', message);
                    readMessage[loggedInUserId.value][message?.sendrId] = false;
                }

                const userIndex = displayUserList.value.findIndex(user => user.id == message?.sendrId);
                const removedElement = displayUserList.value.splice(userIndex, 1)[0];
                displayUserList.value.unshift(removedElement);
            }

            readMessageList.value = readMessage
        });

        //Get All Login User List
        socket.on('getUserList', ({ userList, readMessage }) => {
            const newUserList = userList.filter(userData => userData.id !== loggedInUserId.value && userData.status);
            displayUserList.value = newUserList;
            readMessageList.value = readMessage
        });

        //Add New User List
        socket.on('newUserDetail', (userDetail) => {

            const userIndex = displayUserList.value.findIndex(user => user.id == userDetail.id);

            if (userIndex !== -1) {
                displayUserList.value[userIndex].status = true;
            } else {
                displayUserList.value.push(userDetail);
            }
        });

        //Update User Status when Logout
        socket.on('updateUserStatus', (userID) => {

            const userIndex = displayUserList.value.findIndex(user => user.name == userID);

            if (userIndex !== -1) {
                displayUserList.value[userIndex].status = false;
            }

            if (selctedUserID.value.name == userID) {
                selctedUserID.value = ''
            }
        });

        //fetch User List
        onMounted(() => {
            if (!loggedInUserId.value) {
                router.push({ name: "Login" });
            }
            socket.emit('fetchUserList');
        });

        //Send Message
        const sendMessage = () => {
            if (newMessage.value.trim() === '') return;

            const message = {
                message: newMessage.value,
                timestamp: new Date(),
                sendrId: loggedInUserId.value,
                sender: loggedInUserName.value,
                receiverId: selctedUserID.value.id,
                receiver: selctedUserID.value.name
            };
            messages.value.push(message);
            socket.emit('sendMessage', message);
            newMessage.value = '';
            scrollToBottom();
        };

        //Select user for show particular message
        const selectedUser = (userID) => {
            const messageData = { reseverId: userID?.id, senderID: loggedInUserId.value, filterMessageBy: selectedFilter.value };
            socket.emit('getMessage', messageData);
            selctedUserID.value = userID;

            if (readMessageList.value[loggedInUserId.value] && readMessageList.value[loggedInUserId.value][userID?.id]) {
                readMessageList.value[loggedInUserId.value][userID?.id] = false;
                // socket.emit('updateReadMessageList', messageData);
            }
        }

        //Filters
        const filterMessage = (filter) => {
            const messageData = { reseverId: selctedUserID.value.id, senderID: loggedInUserId.value, filterMessageBy: filter };
            socket.emit('getMessage', messageData);
            selectedFilter.value = filter;
        }

        //Logout
        const logout = () => {
            socket.emit('logout', loggedInUserName.value);
            router.push({ name: "Login" });
            localStorage.clear();
        };

        //Scroll Buttom
        const scrollToBottom = () => {
            const chatContainer = document.querySelector('.height-card');
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }

        //Active User List
        const activeUserCount = computed(() => {
            return displayUserList.value.filter(user => user.status).length;
        });

        return {
            messages,
            newMessage,
            sendMessage,
            formatDate,
            displayUserList,
            selectedUser,
            loggedInUserId,
            selectedFilter,
            filterMessage,
            readMessageList,
            logout,
            loggedInUserName,
            selctedUserID,
            scrollToBottom,
            firstCharacter,
            activeUserCount
        };
    }
};
</script>


<style lang="scss">
@import "@/styles/variables";
@import "@/styles/components";

.my-component {
    @extend .my-component;
}

.text-color-blue {
    color: $primary-color;
}

.app {
    display: flex;
}

.message-column,
.users-column {
    flex: 1;
    padding: 20px;
    border: 1px solid #ccc;
    overflow-y: auto;
    max-height: 500px;
}

.message {
    margin-bottom: 10px;
    padding: 10px;
    background-color: #f5f5f5;
}

.user {
    margin-bottom: 5px;
}

.text-align-right {
    text-align: right;
}

.compose {
    padding: 10px;
    border-top: 1px solid #ccc;
}

.message-width {
    min-width: 135px;
}

.height-card {
    min-height: 450px;
    max-height: 450px;
    overflow: auto;
    flex-direction: column-reverse;
}

.height-message-block {
    min-height: 500px;
    max-height: 500px;
}

.welcome-img {
    width: 300px;
    height: 300px;
}

.filter {
    background: #f3f4f6;
    // padding: 10px;
    border-radius: 6px;
}
</style>