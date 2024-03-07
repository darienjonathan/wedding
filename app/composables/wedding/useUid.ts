import { getStringQueryValue } from '~~/utils/getStringQueryValue'

const UID_QUERY = 'uid'

const useUid = () => {
  const route = useRoute()

  const uid = ref<string>(getStringQueryValue(route.query[UID_QUERY]))

  return { uid }
}

export default useUid
