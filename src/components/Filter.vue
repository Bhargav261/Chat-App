<template>
    <nav class="flex items-center space-x-1 md:space-x-2">
        <a href="javascript:void(0)" @click="filterMessage('all')"
            class="text-sm	px-3 h-4 py-3 font-medium flex items-center space-x-2 py-2 rounded-md text-gray-500 hover:text-white hover:bg-violet-600 active:bg-violet"
            :class="{ 'text-white bg-violet-600': selectedFilter == 'all' }">
            All
        </a>
        <a href="javascript:void(0)" @click="filterMessage('today')"
            class="text-sm	px-3 h-4 py-3 font-medium flex items-center space-x-2 py-2 rounded-md text-gray-500 hover:text-white hover:bg-violet-600 active:bg-violet"
            :class="{ 'text-white bg-violet-600': selectedFilter == 'today' }">
            Today
        </a>
        <a href="javascript:void(0)" @click="filterMessage('7days')"
            class="text-sm px-3 h-4 py-3 font-medium flex items-center space-x-2 py-2 rounded-md text-gray-500 hover:text-white hover:bg-violet-600 active:bg-violet"
            :class="{ 'text-white bg-violet-600': selectedFilter == '7days' }">
            Last 7 days
        </a>
    </nav>
</template>
  
<script>
import { ref } from 'vue';

export default {
    name: 'FilterOptions',
    props: {
        selectedFilterInfo: String,
        updateFilter: Function,
    },
    setup(props) {

        const selectedFilter = ref(props?.selectedFilterInfo);

        //Logout
        const filterMessage = (filter) => {
            props.updateFilter(filter);
            selectedFilter.value = filter;
        }

        return {
            filterMessage,
            selectedFilter
        };
    }
};
</script>