import AboutView from '@/views/AboutView.vue'
import { shallowMount } from '@vue/test-utils'

describe('AboutView.vue', () => {
  test('renders inner text', () => {
    const wrapper = shallowMount(AboutView) //we can also do mount(compName, {shallow: true})
    expect(wrapper.text()).toContain('This is an about page')
  })
})
