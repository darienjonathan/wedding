import useStorage from '~/composables/firebase/storage/useStorage'

const BASE_PATH = '/assets'

const useStorageItems = () => {
  const usePosts = () => useStorage(`${BASE_PATH}/posts`)
  const useImages = () => useStorage(`${BASE_PATH}/media/images`, ['image/jpeg', 'image/png'])
  const useVideos = () => useStorage(`${BASE_PATH}/media/videos`, ['video/mp4', 'video/quicktime'])
  return {
    usePosts,
    useImages,
    useVideos,
  }
}

export default useStorageItems
