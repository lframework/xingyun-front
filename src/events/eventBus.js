import { reactive } from 'vue';
import pullEvent from './constants/pullEvent';
import pushEvent from './constants/pushEvent';
import otherEvent from './constants/otherEvent';

let eventBus = null;

const getEventBus = () => {
  if (!eventBus) {
    eventBus = reactive({
      events: {},
      $on(event, callback) {
        if (!this.events[event]) {
          this.events[event] = [];
        }
        this.events[event].push(callback);
      },
      $emit(event, data) {
        if (this.events[event]) {
          this.events[event].forEach((callback) => {
            callback(data);
          });
        }
      },
      $pullEvent: pullEvent,
      $pushEvent: pushEvent,
      $otherEvent: otherEvent,
    });
  }
  return eventBus;
};

export default getEventBus();
