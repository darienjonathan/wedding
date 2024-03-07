import adminInstance from '~/lib/firebase/index'
import FirestoreQueryBuilder from '~/lib/firebase/firestore/FirestoreQueryBuilder'
import FirestoreTrigger from '~/lib/firebase/firestore/FirestoreTrigger'

const BULK_MAX_SIZE = 500

// eslint-disable-next-line @typescript-eslint/no-explicit-any
class FirestoreCollection<T extends Record<string, any>> {
  private static readonly firestore: FirebaseFirestore.Firestore = adminInstance.firestore()
  private path: string
  private _trigger: FirestoreTrigger<T>
  private parse: (data: FirebaseFirestore.DocumentData) => T

  public constructor(
    path: string,
    triggerPath: string,
    parse: (data: FirebaseFirestore.DocumentData) => T
  ) {
    this.path = path
    this._trigger = new FirestoreTrigger(triggerPath, parse)
    this.parse = parse
  }

  public static batch(): FirebaseFirestore.WriteBatch {
    return FirestoreCollection.firestore.batch()
  }

  public get trigger() {
    return this._trigger
  }

  private get ref() {
    return FirestoreCollection.firestore.collection(this.path)
  }

  public get newId() {
    return this.ref.doc().id
  }

  public getDocumentRef(id: string): FirebaseFirestore.DocumentReference {
    return this.ref.doc(id)
  }

  /**
   * delete documents inside collection using batch
   * https://firebase.google.com/docs/firestore/manage-data/delete-data#collections
   */
  private async deleteQueryBatch(
    query: FirebaseFirestore.CollectionReference | FirebaseFirestore.Query,
    resolve: () => void
  ) {
    const batch = FirestoreCollection.batch()
    const snapshot = await query.get()

    const batchSize = snapshot.size
    if (batchSize === 0) {
      // When there are no documents left, we are done
      resolve()
      return
    }

    // Delete documents in a batch
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref)
    })
    await batch.commit()

    // Recurse on the next process tick, to avoid
    // exploding the stack.
    process.nextTick(() => {
      this.deleteQueryBatch(query, resolve)
    })
  }

  private querySnapshotToMap(querySnapshot: FirebaseFirestore.QuerySnapshot): Map<string, T> {
    const m: Map<string, T> = new Map<string, T>()
    querySnapshot.forEach(queryDocSnapshot =>
      m.set(queryDocSnapshot.id, {
        ...this.parse(queryDocSnapshot.data()),
      })
    )
    return m
  }

  public async loadCollection(query?: FirestoreQueryBuilder<T>): Promise<Map<string, T>> {
    const q = query ? query.build(this.ref) : this.ref
    const querySnapshot = await q.get()
    return this.querySnapshotToMap(querySnapshot)
  }

  // public loadCollectionByIds(ids: string[]): Promise<Map<string, T>[]> {
  //   return Promise.all(
  //     chunk(ids, ARRAY_ARGUMENT_MAX_LENGTH).map((idChunk) =>
  //       this.loadCollection(new FirestoreQueryBuilder<T>().inIds(idChunk))
  //     )
  //   );
  // }

  public subscribeCollection(
    fn: (data: Map<string, T> | null) => void,
    query?: FirestoreQueryBuilder<T>
  ) {
    const q = query ? query.build(this.ref) : this.ref
    return q.onSnapshot(querySnapshot => {
      const data = querySnapshot.empty ? null : this.querySnapshotToMap(querySnapshot)
      fn(data)
    })
  }

  public async loadDocument(id: string): Promise<T> {
    const snapshot = await this.getDocumentRef(id).get()
    const data = this.parse(snapshot.data() || {})
    return data
  }

  public async loadDocumentByQuery(query?: FirestoreQueryBuilder<T>): Promise<
    | {
        id: string
        data: T
      }
    | undefined
  > {
    const q = query ? query.build(this.ref) : this.ref
    const querySnapshot = await q.get()
    if (querySnapshot.empty) return
    const map = this.querySnapshotToMap(querySnapshot)
    const item = [...map][0]
    return {
      id: [...item][0] as string,
      data: [...item][1] as T,
    }
  }

  public subscribeDocument(id: string, fn: (data: T | null) => void) {
    return this.ref.doc(id).onSnapshot(querySnapshot => {
      const data = querySnapshot.exists
        ? this.parse(querySnapshot.data() as FirebaseFirestore.DocumentData)
        : null
      fn(data)
    })
  }

  public async push(values: T) {
    await this.ref.doc().set(values)
  }

  public set(id: string, val: T) {
    return this.ref.doc(id).set(val)
  }

  public updateField<K extends keyof T>(id: string, key: K, val: T[K]) {
    return this.ref.doc(id).update({ [key]: val })
  }

  public bulkDelete(ids: string[]): Promise<FirebaseFirestore.WriteResult[]> {
    if (ids.length > BULK_MAX_SIZE) {
      const head = ids.slice(0, BULK_MAX_SIZE)
      const tail = ids.slice(BULK_MAX_SIZE)
      return this.bulkDelete(head).then(() => this.bulkDelete(tail))
    }

    const batch = FirestoreCollection.batch()
    ids.forEach(id => {
      const ref = this.ref.doc(id)
      batch.delete(ref)
    })
    return batch.commit()
  }

  public deleteThisCollection() {
    const ref = this.ref
    const query = new FirestoreQueryBuilder().limit(BULK_MAX_SIZE).build(ref)
    return new Promise((resolve, reject) => {
      this.deleteQueryBatch(query, resolve as () => void).catch(reject)
    })
  }

  public bulkInsert(data: T[]): Promise<FirebaseFirestore.WriteResult[]> {
    if (data.length > BULK_MAX_SIZE) {
      const head = data.slice(0, BULK_MAX_SIZE)
      const tail = data.slice(BULK_MAX_SIZE)
      return this.bulkInsert(head).then(() => this.bulkInsert(tail))
    }
    const batch = FirestoreCollection.batch()
    data.forEach(row => {
      const ref = this.ref.doc()
      batch.set(ref, row)
    })
    return batch.commit()
  }

  public bulkInsertMap(data: Map<string, T>): Promise<FirebaseFirestore.WriteResult[]> {
    if (data.size > BULK_MAX_SIZE) {
      const arr = [...data.entries()]
      const head = new Map<string, T>(arr.slice(0, BULK_MAX_SIZE))
      const tail = new Map<string, T>(arr.slice(BULK_MAX_SIZE))
      return this.bulkInsertMap(head).then(() => this.bulkInsertMap(tail))
    }
    const batch = FirestoreCollection.batch()
    ;[...data.entries()].forEach(([id, row]) => {
      const ref = this.ref.doc(id)
      batch.set(ref, row)
    })
    return batch.commit()
  }

  public async deleteDocument(id: string) {
    return this.ref.doc(id).delete()
  }

  public singleDocumentDatabase(key: string) {
    return {
      subscribe: (fn: (val: T | null) => void) => this.subscribeDocument(key, fn),
      set: (val: T) => this.set(key, val),
    }
  }
}

export default FirestoreCollection
