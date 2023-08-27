<template>
    <div class="md:w-2/5 w-full pb-6 md:pb-0 border-r-2 relative">
        <!-- user list design -->
        <ul role="list" class="divide-y divide-gray-100">
            <li class="flex justify-between gap-x-6 py-5 px-3">
                <h1 class="font-bold">Users</h1>
            </li>

            <li class="flex justify-between gap-x-6 py-5 px-3" v-if="!displayUserList?.length">
                <h1>Wating for more user join ...</h1>
            </li>

            <li v-for="userData in displayUserList" :key="userData.id"
                class="flex justify-between gap-x-6 py-5 px-3 cursor-pointer" @click="selectedUser(userData)">
                <div class="flex min-w-0 gap-x-4" v-if="userData.id !== loggedInUserId && userData.status">
                    <div class="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
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
        <div class="p-2 text-color-blue absolute bottom-0 w-full">
            <button @click="logout">Logout</button>
        </div>
    </div>
</template>
  
<script>
import { ref, onMounted } from 'vue';
import { useRouter } from "vue-router";
import { getUserDetails, firstCharacter } from "@/helper/helper";
import { initializeSocket } from "@/utils/socket";

export default {
    name: 'UserList',
    props: ['selectedUserId'],
    setup() {
        const messages = ref([]);
        const router = useRouter();
        const newMessage = ref('');
        const selctedUserID = ref('');
        const displayUserList = ref([]);
        const loggedInUser = getUserDetails();
        const selectedFilter = ref('all');
        const readMessageList = ref({});
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
            if (authUserID == loggedInUserId.value && selctedUserID.value.id == message?.sendrId) {
                messages.value.push(message);
                socket.emit('updateReadMessageList', message);
                readMessage[loggedInUserId.value][message?.sendrId] = false;
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
        });

        onMounted(() => {
            if (!loggedInUserId.value) {
                router.push({ name: "Login" });
            }
            socket.emit('fetchUserList');
        });

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

        const selectedUser = (userID) => {
            const messageData = { reseverId: userID?.id, senderID: loggedInUserId.value, filterMessageBy: selectedFilter.value };
            socket.emit('getMessage', messageData);
            selctedUserID.value = userID;

            if (readMessageList.value[loggedInUserId.value] && readMessageList.value[loggedInUserId.value][userID?.id]) {
                readMessageList.value[loggedInUserId.value][userID?.id] = false;
                // socket.emit('updateReadMessageList', messageData);
            }
        }

        const filterMessage = (filter) => {
            const messageData = { reseverId: selctedUserID.value.id, senderID: loggedInUserId.value, filterMessageBy: filter };
            socket.emit('getMessage', messageData);
            selectedFilter.value = filter;
        }

        const formatDate = (timestamp) => {
            return new Date(timestamp).toLocaleString();
        };

        const logout = () => {
            socket.emit('logout', loggedInUserName.value);
            router.push({ name: "Login" });
            localStorage.clear();
        };

        const scrollToBottom = () => {
            const chatContainer = document.querySelector('.height-card');
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }



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
            firstCharacter
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
</style>