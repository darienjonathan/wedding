import {
  CollectionReference,
  documentId,
  limit as limitFn,
  orderBy as orderByFn,
  Query,
  query,
  where,
} from 'firebase/firestore'
import { Unpacked } from '~/types/common'

export interface Queries {
  whereArgsArr: Parameters<typeof where>[]
  orderByArgs: Parameters<typeof orderByFn> | null
  limitArgs: number
}

const useFirestoreQueryBuilder = <T>(firestoreRef: CollectionReference<T>) => {
  const queries = reactive<Queries>({
    whereArgsArr: [],
    orderByArgs: null,
    limitArgs: 0,
  })

  const eq = <K extends keyof T>(prop: K, val: T[K]) => {
    queries.whereArgsArr.push([prop.toString(), '==', val])
  }

  const gt = <K extends keyof T>(prop: K, val: T[K]) => {
    queries.whereArgsArr.push([prop.toString(), '>', val])
  }

  const lt = <K extends keyof T>(prop: K, val: T[K]) => {
    queries.whereArgsArr.push([prop.toString(), '<', val])
  }

  const gteq = <K extends keyof T>(prop: K, val: T[K]) => {
    queries.whereArgsArr.push([prop.toString(), '>=', val])
  }

  const lteq = <K extends keyof T>(prop: K, val: T[K]) => {
    queries.whereArgsArr.push([prop.toString(), '<=', val])
  }

  const contains = <K extends keyof T>(prop: K, val: Unpacked<T[K]>) => {
    queries.whereArgsArr.push([prop.toString(), 'array-contains', val])
  }

  const inVals = <K extends keyof T>(prop: K, val: Array<T[K]>) => {
    if (val.length > 0) {
      queries.whereArgsArr.push([prop.toString(), 'in', val])
    }
  }

  const inIds = (val: string[]) => {
    if (val.length > 0) {
      queries.whereArgsArr.push([documentId(), 'in', val])
    }
  }

  const orderBy = (key: keyof T, dir: 'desc' | 'asc') => {
    queries.orderByArgs = [key.toString(), dir]
  }

  const limit = (n: number) => {
    queries.limitArgs = n
  }

  const build = (): Query<T> => {
    const whereQueryArr = queries.whereArgsArr.map(([fieldPath, opStr, val]) =>
      where(fieldPath, opStr, val)
    )
    const queryConstraints = [...whereQueryArr]
    if (queries.orderByArgs) queryConstraints.push(orderByFn(...queries.orderByArgs))
    if (queries.limitArgs) queryConstraints.push(limitFn(queries.limitArgs))
    return query(firestoreRef, ...queryConstraints.filter(q => q))
  }

  return {
    eq,
    gt,
    lt,
    gteq,
    lteq,
    contains,
    inVals,
    inIds,
    orderBy,
    limit,
    build,
  }
}

export default useFirestoreQueryBuilder
