import { ref, onMounted, onUnmounted } from 'vue';

export function useResponsiveCheck(breakpoint) {
    const isResponsive = ref(window.innerWidth < breakpoint);

    const handleResize = () => {
        isResponsive.value = window.innerWidth < breakpoint;
    };

    onMounted(() => {
        window.addEventListener('resize', handleResize);
    });

    onUnmounted(() => {
        window.removeEventListener('resize', handleResize);
    });

    return { isResponsive };
}