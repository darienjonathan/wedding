import * as admin from 'firebase-admin'
import { Unpacked } from '~/types/common'

type BuildQueryArgs = {
  whereArgsArr: Parameters<FirebaseFirestore.Query['where']>[]
  orderByArgs: Parameters<FirebaseFirestore.Query['orderBy']> | null
  limitArgs: Parameters<FirebaseFirestore.Query['limit']>[0]
}

export const ARRAY_ARGUMENT_MAX_LENGTH = 10

class FirestoreQueryBuilder<T> {
  private whereArgsArr: BuildQueryArgs['whereArgsArr'] = []
  private orderByArgs: BuildQueryArgs['orderByArgs'] = null
  private limitArgs: BuildQueryArgs['limitArgs'] = 0

  public eq<K extends keyof T>(prop: K, val: T[K]): FirestoreQueryBuilder<T> {
    this.whereArgsArr.push([prop.toString(), '==', val])
    return this
  }

  public gt<K extends keyof T>(prop: K, val: T[K]): FirestoreQueryBuilder<T> {
    this.whereArgsArr.push([prop.toString(), '>', val])
    return this
  }

  public lt<K extends keyof T>(prop: K, val: T[K]): FirestoreQueryBuilder<T> {
    this.whereArgsArr.push([prop.toString(), '<', val])
    return this
  }

  public gte<K extends keyof T>(prop: K, val: T[K]): FirestoreQueryBuilder<T> {
    this.whereArgsArr.push([prop.toString(), '>=', val])
    return this
  }

  public lte<K extends keyof T>(prop: K, val: T[K]): FirestoreQueryBuilder<T> {
    this.whereArgsArr.push([prop.toString(), '<=', val])
    return this
  }

  public contains<K extends keyof T>(prop: K, val: Unpacked<T[K]>): FirestoreQueryBuilder<T> {
    this.whereArgsArr.push([prop.toString(), 'array-contains', val])
    return this
  }

  public in<K extends keyof T>(prop: K, val: Array<T[K]>): FirestoreQueryBuilder<T> {
    if (val.length > 0) {
      this.whereArgsArr.push([prop.toString(), 'in', val])
    }
    return this
  }

  public inIds(val: string[]): FirestoreQueryBuilder<T> {
    if (val.length > 0) {
      this.whereArgsArr.push([admin.firestore.FieldPath.documentId(), 'in', val])
    }
    return this
  }

  public orderBy(key: keyof T, dir: 'desc' | 'asc') {
    this.orderByArgs = [key.toString(), dir]
    return this
  }

  public limit(n: BuildQueryArgs['limitArgs']) {
    this.limitArgs = n
    return this
  }

  public build(ref: FirebaseFirestore.CollectionReference) {
    let currentRef: FirebaseFirestore.CollectionReference | FirebaseFirestore.Query = ref

    this.whereArgsArr.forEach(step => {
      currentRef = currentRef.where(...step)
    })
    if (this.orderByArgs) {
      const [orderKey, orderDir] = this.orderByArgs
      currentRef = currentRef.orderBy(String(orderKey), orderDir)
    }
    if (this.limitArgs && this.limitArgs > 0) {
      currentRef = currentRef.limit(this.limitArgs)
    }
    return currentRef
  }
}

export default FirestoreQueryBuilder
