import * as functions from 'firebase-functions'
import { QueryDocumentSnapshot, DocumentSnapshot } from 'firebase-functions/v1/firestore'
import { getFunctions } from '~/lib/firebase/functions'

type ChangeCallbackFunction<T> = (
  before: T,
  after: T,
  context: functions.EventContext,
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
) => any
type SnapshotCallbackFunction<T> = (
  data: T,
  context: functions.EventContext,
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
) => any

class FirestoreTrigger<T> {
  private triggerPath: string
  private parse: (data: FirebaseFirestore.DocumentData) => T

  public constructor(triggerPath: string, parse: (data: FirebaseFirestore.DocumentData) => T) {
    this.triggerPath = triggerPath
    this.parse = parse
  }

  private get documentPath() {
    return getFunctions().firestore.document(this.triggerPath)
  }

  private snapshotCallback<U>(
    snapshot: QueryDocumentSnapshot,
    context: functions.EventContext,
    callbackFn: SnapshotCallbackFunction<T | U | undefined>,
  ) {
    const data = snapshot.exists ? this.parse(snapshot.data() || {}) : undefined
    return callbackFn(data, context)
  }

  private changeCallback<U>(
    change: functions.Change<DocumentSnapshot>,
    context: functions.EventContext,
    callbackFn: ChangeCallbackFunction<T | U | undefined>,
  ) {
    const before = change.before.exists ? this.parse(change.before.data() || {}) : undefined
    const after = change.after.exists ? this.parse(change.after.data() || {}) : undefined
    return callbackFn(before, after, context)
  }

  public onCreate<U = T>(callbackFn: SnapshotCallbackFunction<T | U | undefined>) {
    return this.documentPath.onCreate((snapshot, context) =>
      this.snapshotCallback(snapshot, context, callbackFn),
    )
  }

  public onDelete<U = T>(callbackFn: SnapshotCallbackFunction<T | U | undefined>) {
    return this.documentPath.onDelete((snapshot, context) =>
      this.snapshotCallback(snapshot, context, callbackFn),
    )
  }

  public onWrite<U = T>(callbackFn: ChangeCallbackFunction<T | U | undefined>) {
    return this.documentPath.onWrite((change, context) =>
      this.changeCallback(change, context, callbackFn),
    )
  }

  public onUpdate<U = T>(callbackFn: ChangeCallbackFunction<T | U | undefined>) {
    return this.documentPath.onUpdate((change, context) =>
      this.changeCallback(change, context, callbackFn),
    )
  }
}

export default FirestoreTrigger
