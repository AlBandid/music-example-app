import { shallowMount, RouterLinkStub } from '@vue/test-utils'
import SongItem from '@/components/SongItem.vue'

describe('Snapshots SongItem.vue', () => {
  test('renders correctly', () => {
    const song = {
      docID: 'doc1',
      modified_name: 'test',
      user_display_name: 'test',
      comment_count: 5,
    }

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

    expect(wrapper.element).toMatchSnapshot()
  })
})
