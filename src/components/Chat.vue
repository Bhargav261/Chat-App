<template>
    <div id="page-container" class="flex flex-col mx-auto w-full min-h-screen bg-gray-100">
        <main id="page-content" class="flex flex-auto flex-col max-w-full">
            <div class="bg-gray-100">
                <div class="container p-6 mx-auto">
                    <div class="flex flex-wrap bg-white height-message-block chat-min-height">
                        <Sidebar :selctedUserInfo="selctedUserID" :isResponsive="isResponsive" :updateSelctedUserID="updateSelctedUserID" />
                        <MessageList :selctedUserInfo="selctedUserID" :isResponsive="isResponsive" :updateSelctedUserID="updateSelctedUserID" />
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>
  
<script>
import Sidebar from './Sidebar.vue';
import { ref, onMounted } from 'vue';
import { useRouter } from "vue-router";
import MessageList from './MessageList.vue';
import { getUserDetails } from "@/helper/helper";
import { useResponsiveCheck } from '@/helper/useResponsiveCheck';


export default {
    name: 'UserChat',
    components: {
        Sidebar,
        MessageList,
    },
    setup() {
        const router = useRouter();
        const selctedUserID = ref('');
        const loggedInUser = getUserDetails();
        const loggedInUserId = ref(loggedInUser?.id || '');
        const { isResponsive } = useResponsiveCheck(770);

        const updateSelctedUserID = (newSelectedUserList) => {
            selctedUserID.value = newSelectedUserList;
        };

        onMounted(() => {
            if (!loggedInUserId.value) {
                router.push({ name: "Login" });
            }
        });

        return {
            selctedUserID,
            updateSelctedUserID,
            isResponsive
        };
    }
};
</script>

<style>
.height-message-block {
    min-height: 658px;
    max-height: 658px;
}

/* .chat-min-height{
    min-width: 740px
} */
</style>