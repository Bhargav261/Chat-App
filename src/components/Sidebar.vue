<template>
    <div v-if="!isResponsive || (isResponsive && !selctedUserID)" class="md:w-2/5 w-full pb-6 md:pb-0 border-05 relative">
        <ul role="list" class="ml-6 mt-6">
            <li class="flex justify-between gap-x-6 py-4 px-3 text-2xl">
                <h1 class="font-medium text-2xl tracking-wide">Chat</h1>
            </li>
            <li class="flex justify-between gap-x-6 py-2 px-3 text-sm">
                <h1 class="font-medium">Users</h1>
            </li>
            <li class="justify-between gap-x-6 py-5 px-3" v-if="!activeUserCount">
                <h1>Wating for more user join ...</h1>
            </li>
        </ul>
        <div>
            <ul role="list" class="ml-6 user-list-height">

                <li v-for="userData in displayUserList" :key="userData.id"
                    class="flex justify-between gap-x-6 py-3 px-3 cursor-pointer" @click="selectedUser(userData)">
                    <div class="flex min-w-0 gap-x-4" v-if="userData.id !== loggedInUserId && userData.status">
                        <div class="flex text-white items-center justify-center h-10 w-10 rounded-full flex-shrink-0"
                            :style="{ backgroundColor: userData.color }">
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
        </div>
        <Logout />
    </div>
</template>
  
<script>
import Logout from './Logout.vue';
import { useRouter } from "vue-router";
import { initializeSocket } from "@/utils/socket";
import { ref, onMounted, computed, watch } from 'vue';
import { formatDate, getUserDetails, firstCharacter } from "@/helper/helper";

export default {
    name: 'UserSidebar',
    components: {
        Logout
    },
    props: {
        selctedUserInfo: Number,
        isResponsive: Boolean,
        updateSelctedUserID: Function,
    },
    setup(props) {
        const messages = ref([]);
        const router = useRouter();
        const newMessage = ref('');
        const selctedUserID = ref(props.selctedUserInfo);
        const displayUserList = ref([]);
        const readMessageList = ref({});
        const selectedFilter = ref('all');
        const loggedInUser = getUserDetails();
        const loggedInUserId = ref(loggedInUser?.id || '');
        const loggedInUserName = ref(loggedInUser?.name || '');

        watch(() => props.selctedUserInfo, (newSelectedUserID) => {
            selctedUserID.value = newSelectedUserID
        });


        //Initilize Socket
        const socket = initializeSocket();

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
            console.log("userDetail :- ", userDetail);
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

            const newUserList = displayUserList.value.filter(userData => userData.id !== loggedInUserId.value && userData.status);
            displayUserList.value = newUserList;
        });

        //fetch User List
        onMounted(() => {
            if (!loggedInUserId.value) {
                router.push({ name: "Login" });
            }
            socket.emit('fetchUserList');
        });

        //Select user for show particular message
        const selectedUser = (userID) => {
            selctedUserID.value = userID;
            props.updateSelctedUserID(userID)

            if (readMessageList.value[loggedInUserId.value] && readMessageList.value[loggedInUserId.value][userID?.id]) {
                readMessageList.value[loggedInUserId.value][userID?.id] = false;
            }
        }

        //Logout
        const logout = () => {
            socket.emit('logout', loggedInUserName.value);
            router.push({ name: "Login" });
            localStorage.clear();
        };

        //Active User List
        const activeUserCount = computed(() => {
            return displayUserList.value.filter(user => user.status).length;
        });

        return {
            messages,
            newMessage,
            formatDate,
            displayUserList,
            selectedUser,
            loggedInUserId,
            selectedFilter,
            readMessageList,
            logout,
            loggedInUserName,
            selctedUserID,
            firstCharacter,
            activeUserCount
        };
    }
};
</script>


<style lang="scss">
@import "@/styles/variables";
@import "@/styles/components";

.text-color-blue {
    color: $primary-color;
}

.border-05 {
    border-right-width: 0.5px;
}

.user-list-height {
    height: 450px;
    overflow: auto;
}
</style>