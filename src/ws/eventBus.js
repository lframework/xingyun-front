import Vue from 'vue'
import pullEvent from './constants/pullEvent'
import pushEvent from './/constants/pushEvent'
const eventBus = new Vue()
eventBus.$pullEvent = pullEvent
eventBus.$pushEvent = pushEvent

export default eventBus
