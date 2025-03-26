import HomeView from '@/views/HomeView.vue'
import { shallowMount } from '@vue/test-utils'
import SongItem from '@/components/SongItem.vue'

describe('HomeView.vue', () => {
  test('renders list of songs', () => {
    // we need to mock the song list
    const songs = [{ docID: '0' }, { docID: '1' }, { docID: '2' }]
    const component = shallowMount(HomeView, {
      data() {
        return {
          songs,
        }
      },
      global: {
        // we need to mock a method for i18n
        mocks: {
          $t: (message) => message,
        },
      },
    })

    const items = component.findAllComponents(SongItem)
    expect(items).toHaveLength(songs.length)

    items.forEach((wrapper, i) => {
      expect(wrapper.props().song).toStrictEqual(songs[i])
    })
  })
})
