import SongItem from '@/components/SongItem.vue'
import { shallowMount, RouterLinkStub } from '@vue/test-utils'

describe('SongItem.vue', () => {
  test('renders song.user_display_name', () => {
    const song = {
      user_display_name: 'test',
    }

    //we can also do mount(compName, {shallow: true})
    const wrapper = shallowMount(SongItem, {
      props: {
        song,
      },
      global: {
        components: {
          RouterLink: RouterLinkStub,
        },
      },
    })
    // we're looking for a specific part of the document, i.e. a text with a class text-gray-500
    const compositionAuthor = wrapper.find('.text-gray-500')
    // now we're checking this filtered wrapper
    expect(compositionAuthor.text()).toBe(song.user_display_name)
  })
})
