<template>
    <!-- Messaeg  List View -->
    <div v-if="!isResponsive || selctedUserID" class="md:w-3/5 w-full border-r-2 border-l-2 border-white">
        <div class="flex flex-col flex-auto flex-shrink-0 bg-gray-100 h-full" v-if="selctedUserID">
            <div
                class=" h-16 pr-6 pt-14 pb-12 relative flex justify-between items-center lg:space-x-4 md:space-x-4 space-x-0 p-3 bg-white"
                :class="{'p-9':!isResponsive}"
                >
                <div class="flex flex-col leading-tight">
                    <MessageHeader :selctedUserInfo="selctedUserInfo" :isResponsive="isResponsive"
                        :updateSelctedUserID="updateSelctedUserID" />
                </div>

                <div class="flex flex-col leading-tight filter p-2">
                    <Filter :selectedFilterInfo="selectedFilter" :updateFilter="updateFilter" />
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
                                <div class="message-width" :class="{
                                    'relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-lg rounded-tl-none': message.sendrId != loggedInUserId,
                                    'relative mr-3 text-white text-sm bg-violet-600 py-2 px-4 shadow rounded-lg rounded-tr-none': message.sendrId == loggedInUserId
                                }
                                    ">
                                    <div>
                                        {{ message.message }}
                                    </div>
                                    <div class="w-80 absolute text-xs bottom-0 -mb-5 ml-2 text-gray-500" :class="{
                                        'left-0': message.sendrId != loggedInUserId,
                                        'bottom-0 right-0 text-right': message.sendrId == loggedInUserId
                                    }
                                        ">
                                        {{ message.sender + " - " + formatDate(message.timestamp) }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex flex-row items-center h-16 bg-white w-full px-4 py-12">
                <div class="flex-grow ml-4">
                    <div class="relative w-full">
                        <input type="text" ref="messageInput" v-model="newMessage" @keyup.enter="sendMessage"
                            placeholder="Write a message..."
                            class="flex text-opacity border-0 w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10" />
                    </div>
                </div>
                <div class="ml-4">
                    <button :disabled="!newMessage" @click="sendMessage"
                        class="flex items-center justify-center bg-gradient-to-r from-violet-400 to-violet-700 focus:from-violet-700 focus:to-violet-600 bg-violet-600 hover:bg-indigo-600 text-white rounded-full p-3 flex-shrink-0">
                        <span>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M0.649942 5.52552C0.561155 5.5551 0.482454 5.60901 0.42279 5.68111C0.363125 5.75321 0.324893 5.8406 0.312443 5.93336C0.299992 6.02611 0.313823 6.1205 0.352361 6.20578C0.3909 6.29106 0.452599 6.36381 0.530441 6.41576L4.95198 8.85316C5.03439 8.89857 5.12794 8.91981 5.22188 8.91443C5.31582 8.90905 5.40633 8.87728 5.48302 8.82276L10.1803 5.47319C10.4073 5.32116 10.6788 5.59269 10.5268 5.81967L7.17724 10.517C7.12272 10.5937 7.09095 10.6842 7.08557 10.7781C7.08019 10.8721 7.10143 10.9656 7.14684 11.048L9.58424 15.4696C9.63619 15.5474 9.70894 15.6091 9.79422 15.6476C9.8795 15.6862 9.97389 15.7 10.0666 15.6876C10.1594 15.6751 10.2468 15.6369 10.3189 15.5772C10.391 15.5175 10.4449 15.4388 10.4745 15.3501L15.0707 1.56148C15.0999 1.47343 15.1041 1.37899 15.0828 1.28871C15.0614 1.19843 15.0153 1.11586 14.9497 1.05026C14.8841 0.984661 14.8016 0.938605 14.7113 0.917247C14.621 0.895888 14.5266 0.900069 14.4385 0.929324L0.649942 5.52552Z"
                                    fill="white" />
                            </svg>

                        </span>
                    </button>
                </div>
            </div>
        </div>

        <div class="flex flex-col flex-auto flex-shrink-0 bg-white-100 h-full flex justify-center" v-if="!selctedUserID">
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
</template>
  
<script>
import { ref, watch } from 'vue';
import { initializeSocket } from "@/utils/socket";
import Filter from "./Filter.vue";
import { formatDate, getUserDetails, firstCharacter } from "@/helper/helper";
import MessageHeader from './MessageHeader.vue';

export default {
    name: 'MessageList',
    props: {
        selctedUserInfo: Number,
        isResponsive: Boolean,
        updateSelctedUserID: Function,
    },
    components: {
        Filter,
        MessageHeader
    },
    setup(props) {

        const messages = ref([]);
        const messageInput = ref(null);
        const newMessage = ref('');
        const selctedUserID = ref(props?.selctedUserInfo);
        const readMessageList = ref({});
        const selectedFilter = ref('all');
        const loggedInUser = getUserDetails();
        const loggedInUserId = ref(loggedInUser?.id || '');
        const loggedInUserName = ref(loggedInUser?.name || '');

        const updateFilter = (newFilterValue) => {
            selectedFilter.value = newFilterValue;
            filterMessage(newFilterValue);
        };

        watch(() => props.selctedUserInfo, (newSelectedUserID) => {
            selctedUserID.value = newSelectedUserID
            selectedUser(newSelectedUserID);
        });

        watch(() => messageInput.value, () => {
            if(messageInput.value){
                messageInput.value.focus();
                scrollToBottom();
            }
        });


        //Initilize Socket
        const socket = initializeSocket();

        //Get Particular User Message
        socket.on('getMessages', (getMessages) => {
            messages.value = getMessages;
            // scrollToBottom();
        });

        //New Message Add
        socket.on('newMessage', ({ message, authUserID, readMessage }) => {
            if (authUserID == loggedInUserId.value) {

                if (selctedUserID.value.id == message?.sendrId) {
                    messages.value.push(message);
                    socket.emit('updateReadMessageList', message);
                    readMessage[loggedInUserId.value][message?.sendrId] = false;
                }
            }

            readMessageList.value = readMessage
        });

        //Update User Status when Logout
        socket.on('updateUserStatus', (userID) => {

            if (selctedUserID.value.name == userID) {
                selctedUserID.value = ''
            }
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
            if (messageInput.value) {
                messageInput.value.focus();
            }
        }

        //Filters
        const filterMessage = (filter) => {
            const messageData = { reseverId: selctedUserID.value.id, senderID: loggedInUserId.value, filterMessageBy: filter };
            socket.emit('getMessage', messageData);
            selectedFilter.value = filter;
        }

        //Scroll Buttom
        const scrollToBottom = () => {
            const chatContainer = document.querySelector('.height-card');
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }

        return {
            messages,
            newMessage,
            sendMessage,
            formatDate,
            selectedUser,
            loggedInUserId,
            selectedFilter,
            filterMessage,
            readMessageList,
            loggedInUserName,
            selctedUserID,
            scrollToBottom,
            firstCharacter,
            updateFilter,
            messageInput
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

.text-opacity {
    -webkit-opacity: 0.5;
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

.welcome-img {
    width: 300px;
    height: 300px;
}

.filter {
    background: #f3f4f6;
    border-radius: 6px;
}
</style>