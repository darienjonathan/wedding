import FirestoreWrapper from '~/lib/firebase/firestore/Firestore'
import { Media, parseMedia } from '~/types/model/blog/media'
import { parsePost, parsePostComment, Post, PostComment } from '~/types/model/blog/post'
import { parseRole, Role } from '~/types/model/blog/role'
import { parseTag, Tag } from '~/types/model/blog/tag'
import { parseUser, parseUserInfo, User, UserInfo } from '~/types/model/user'
import { Invitee, parseInvitee, InviteeRSVP, parseInviteeRSVP } from '~/types/model/wedding/invitee'

const posts = () => new FirestoreWrapper<Post>('posts', 'posts/{postUid}', parsePost)
const postComments = (postId: string) =>
  new FirestoreWrapper<PostComment>(
    `posts/${postId}/comments`,
    'posts/{postUid}/comments/{commentUid}',
    parsePostComment
  )
const medias = () => new FirestoreWrapper<Media>('medias', 'medias/{mediaUid}', parseMedia)
const tags = () => new FirestoreWrapper<Tag>('tags', 'tags/{tagUid}', parseTag)
const users = () => new FirestoreWrapper<User>('users', 'users/{userUid}', parseUser)
const userInfo = () =>
  new FirestoreWrapper<UserInfo>('userInfo', 'userInfo/{userUid}', parseUserInfo)
const roles = () => new FirestoreWrapper<Role>('roles', 'roles/{roleUid}', parseRole)

// Wedding
const invitees = () =>
  new FirestoreWrapper<Invitee>('invitees', 'invitees/{inviteesUid}', parseInvitee)
const inviteeRSVP = () =>
  new FirestoreWrapper<InviteeRSVP>('inviteeRSVP', 'inviteeRSVP/{inviteeRSVPUid}', parseInviteeRSVP)

export { posts, postComments, medias, tags, users, userInfo, roles, invitees, inviteeRSVP }
