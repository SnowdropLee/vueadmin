import VueEventCalendar from './src/VueEventCalendar.vue';

/* istanbul ignore next */
VueEventCalendar.install = function(Vue) {
  Vue.component(VueEventCalendar.name, VueEventCalendar);
};

export default VueEventCalendar;
