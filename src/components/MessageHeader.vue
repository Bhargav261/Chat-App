<template>
    <div class="text-2xs mt-1 flex items-center">
        <div v-if="isResponsive">
            <button @click="BackButton" class="mr-2">
                <font-awesome-icon icon="fa-chevron-left" />
            </button>
        </div>
        <div class="mr-2 text-white flex items-center justify-center h-10 w-10 rounded-full flex-shrink-0"
            :style="{ backgroundColor: selctedUserID.color }">
            {{ firstCharacter(selctedUserID.name) }}
        </div>
        <span class="text-gray-700 mr-3 font-semibold">{{ selctedUserID.name }}</span>
    </div>
</template>
  
<script>
import { ref, watch } from 'vue';
import { firstCharacter } from "@/helper/helper";

export default {
    name: 'MessageHeader',
    props: {
        selctedUserInfo: String,
        isResponsive: Boolean,
        updateSelctedUserID: Function,
    },
    setup(props) {
        const selctedUserID = ref(props?.selctedUserInfo);

        watch(() => props.selctedUserInfo, (newSelectedUserID) => {
            selctedUserID.value = newSelectedUserID
        });

        const BackButton = () => {
            props.updateSelctedUserID('')
        }

        return {
            firstCharacter,
            selctedUserID,
            BackButton
        };
    }
};
</script>