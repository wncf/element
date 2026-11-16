export default {
  data() {
    return {
      hoverOption: -1
    };
  },

  computed: {
    optionsAllDisabled() {
      return this.optionInstances.filter(option => option.visible).every(option => option.disabled);
    }
  },

  watch: {
    hoverIndex(val) {
      if (typeof val === 'number' && val > -1) {
        this.hoverOption = this.optionInstances[val] || {};
      }
      this.optionInstances.forEach(option => {
        option.hover = this.hoverOption === option;
      });
    }
  },

  methods: {
    navigateOptions(direction) {
      if (!this.visible) {
        this.visible = true;
        return;
      }
      if (this.optionInstances.length === 0 || this.filteredOptionsCount === 0) return;
      if (!this.optionsAllDisabled) {
        if (direction === 'next') {
          this.hoverIndex++;
          if (this.hoverIndex === this.optionInstances.length) {
            this.hoverIndex = 0;
          }
        } else if (direction === 'prev') {
          this.hoverIndex--;
          if (this.hoverIndex < 0) {
            this.hoverIndex = this.optionInstances.length - 1;
          }
        }
        const option = this.optionInstances[this.hoverIndex];
        if (option.disabled === true ||
          option.groupDisabled === true ||
          !option.visible) {
          this.navigateOptions(direction);
        }
        this.$nextTick(() => this.scrollToOption(this.hoverOption));
      }
    }
  }
};
