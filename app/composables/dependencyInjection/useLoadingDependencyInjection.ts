import { provide, inject } from 'vue'
import type { InjectionKey } from 'vue'

type LoadingType = 'default' | 'wedding'
const key: InjectionKey<LoadingType> = Symbol('loadingType')

export const useProvideLoading = (loadingType: LoadingType) => {
  provide<LoadingType>(key, loadingType)
}

export const useInjectLoading = () => {
  const loadingType = inject(key, 'default')

  return {
    loadingType,
  }
}
