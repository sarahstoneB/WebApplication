export default {
    data() {
        return {
            isLoadComplete: false,
            showSpinner: true
        };
    },

    computed: {
        done() {
            return this.isLoadComplete;
        }
    }
}