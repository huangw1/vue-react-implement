/**
 * @Author: huangw1
 * @Date: 2019-11-23 14:20
 */
import Vue from "../src";

window.vue = new Vue({
    data () {
        return {
            count: 0,
            test: 'test'
        }
    },

    methods: {
      addCount () {
          this.count++;
          this.test = 'click'
      }
    },

    render (h) {
        return h('div', {
            on: {
                click: this.addCount
            }
        }, `${this.test} -> ` + this.count);
    }
}).$mount(document.getElementById('app'));
