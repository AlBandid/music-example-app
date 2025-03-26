import HomeView from '@/views/HomeView.vue'
import { shallowMount } from '@vue/test-utils'
import SongItem from '@/components/SongItem.vue'

describe('HomeView.vue', () => {
  // we need to mock the song list
  const songs = [{ docID: '0' }, { docID: '1' }, { docID: '2' }]

  test('renders list of songs', () => {
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
  })

  test('renders song.docID in id attribute', () => {
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
    items.forEach((wrapper, i) => {
      //expect(wrapper.props().song).toStrictEqual(songs[i])
      expect(wrapper.attributes().id).toBe(`song-id-${songs[i].docID}`)
    })
  })
})
