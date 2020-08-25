import Vue from 'vue';
import get from 'lodash/get';

const toast = {
  error: (error) => {
    const message = get(error.response, 'data[0].error.message', 'Error');
    return Vue.toasted.error(message || 'Error', {
      icon: 'exclamation-triangle',
    });
  },
  success: (message) => {
    return Vue.toasted.success(message, {
      icon: 'check-circle',
    });
  },
};

export default toast;
