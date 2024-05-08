import firebase from "firebase/compat/app"
import { INewPost, INewUser, IUpdatePost, IUpdateUser, UserData } from "@/types";
import { auth, db, storage } from "./config";
import { DocumentData, collection, doc, getDoc, getDocs, getFirestore, limit, orderBy, query, startAfter, where } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// ================== CREATE USER ACCOUNT
export async function createUserAccount(user: INewUser) {
  try {
    // Create user account with email and password
    const newAccount = await auth.createUserWithEmailAndPassword(user.email.trim(), user.password.trim())


    const currentUser = auth.currentUser

    if (!currentUser) throw new Error('User is not found after creating account')

    const timestamp = firebase.firestore.FieldValue.serverTimestamp()

    // Save user details to Firestore
    await saveUserToDb({
      accountId: currentUser.uid,
      email: currentUser.email ?? '',
      name: user.name,
      username: user.username,
      imageUrl: '',
      createdAt: timestamp
    })
    if (!newAccount) throw Error

    // Local storage
    localStorage.setItem('isUserActive', 'true')


    return newAccount.user

  } catch (error) {
    console.log('Error in creating account: ', error);

  }

}

// ================== SAVE USER DATA TO DB
export async function saveUserToDb(user: {
  accountId?: string
  email?: string
  name?: string
  imageUrl?: string
  username?: string
  createdAt: firebase.firestore.FieldValue
}) {
  try {
    await db.collection('users').doc(user.accountId).set(
      user
    )

  } catch (error) {
    console.log('Error on saving user to db:', error);

  }
}

// ================== SIGN IN USER ACCOUNT
export async function signInAccount(credential: { email: string, password: string }) {
  try {
    const userCredential = await auth.signInWithEmailAndPassword(credential.email, credential.password)
    const user = userCredential.user
    return user
  } catch (error) {
    console.log('Error in sign in to the account:', error);

  }
}

// ================== GET ACCOUNT
export async function getAccount(): Promise<DocumentData> {
  const auth = getAuth()

  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe()
      if (user) {
        resolve(user)

      } else {
        reject(new Error('User is not signed in'))
      }
    })
  })
}

// ================== GET CURRENT USER
export async function getCurrentUser(): Promise<UserData | null | undefined> {
  try {
    const db = getFirestore()

    const currentAccount = await getAccount()

    if (!currentAccount) throw Error

    const docRef = doc(db, 'users', currentAccount.uid)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) new Error('get user data failed')

    return docSnap.data() as UserData

  } catch (error) {
    console.log('Failed to get current user: ', error);

  }
}

// ================== SIGN OUT ACOOUNT
export async function signOutAccount() {
  try {
    await auth.signOut()

    localStorage.setItem('isUserActive', 'false')

    return { status: 'ok' }
  } catch (error) {
    console.log(error);

  }
}

// ================== CREATE POST
export async function createPost(post: INewPost) {
  try {
    // Upload image to storage
    const uploadedFile = await uploadFile(post.file[0])

    if (!uploadedFile) throw new Error('Failed to upload file storage')

    // Convert tags in an array
    const tags = post.tags?.replace(/ /g, '').split(',') || []

    // Add timestamp
    const timestamp = firebase.firestore.FieldValue.serverTimestamp

    // Save post to database
    const newPost = await db.collection('posts').add({
      creator: post.userId,
      caption: post.caption,
      imageUrl: uploadedFile.imageUrl,
      imagePath: uploadedFile.imagePath,
      location: post.location,
      tags: tags,
      createdAt: timestamp(),
      likes: []
    })

    if (!newPost) {
      await deleteFile(uploadedFile.imagePath)
      throw new Error('Failed save post to database')
    }

    return newPost
  } catch (error) {
    console.log('Post was not created', error);

  }
}

// ================== UPLOAD FILE TO STORAGE
export async function uploadFile(file: File) {
  return new Promise<{ imageUrl: string, imagePath: string }>((resolve, reject) => {
    try {
      const timestamp = new Date().getTime()
      const fileName = `${timestamp}_${file.name}`
      const uploadTask = storage.ref(`images/${fileName}`).put(file)
      uploadTask.on(
        'state_changed',
        null,
        error => {
          reject(error)
        },
        () => {
          storage.ref('images').child(fileName).getDownloadURL().then((url: string) => {
            const imagePath = `images/${fileName}`
            resolve({ imagePath, imageUrl: url })
          })
        }
      )
    } catch (error) {
      reject(error)

    }

  })
}

// ================== DELETE FILE FROM STORAGE
export async function deleteFile(fileName: string) {
  try {
    const fileRef = storage.ref().child(fileName)
    await fileRef.delete()
  } catch (error) {
    console.log('Failed deleting file', error);

  }
}

// ================== GET RECENT POSTS
export async function getRecentPosts(): Promise<DocumentData | undefined> {
  try {
    const fetchedData = await db.collection('posts')
      .orderBy('createdAt', 'desc')
      .limit(21)
      .get()

    if (fetchedData.empty) throw new Error('No recent posts')

    const posts = fetchedData.docs.map((doc) => ({
      postId: doc.id,
      ...doc.data(),
    }))

    return posts
  } catch (error) {
    console.log('Failed to get recent posts', error);

  }
}

// ================== GET USER
export async function getUser(userId: string) {
  try {
    const user = await db.collection('users').doc(userId).get()
    const userData = user.data()
    return userData

  } catch (error) {
    console.log('user is not founded', error);

  }
}

// ================== LIKE POST
export async function likePost(postId: string, likesArray: string[]) {
  try {
    const docRef = db.collection('posts').doc(postId)
    const updatedPost = docRef.update({
      likes: likesArray
    })

    if (!updatedPost) throw new Error('Failed to like post')

    return updatedPost
  } catch (error) {
    console.log('Failed like post', error);

  }
}

// ================== SAVE POST
export async function savePost(postId: string, userId: string, currentUser: string) {
  try {
    await db.collection('users').doc(currentUser).collection('saves').add({
      creator: userId,
      postId: postId
    })

    return { status: 'ok' }
  } catch (error) {
    console.log('Error save post', error);

  }
}

// ================== GET SAVED POSTS
export async function getSavedPosts(userId: string) {
  try {
    const userRef = db.collection('users').doc(userId)
    const savedPostSnapshot = await userRef.collection('saves').get()

    const savedPostIds = savedPostSnapshot.docs.map((doc) => doc.data().postId)
    const savedPostsPromises = savedPostIds.map(postId => {
      if (postId) {
        return db.collection('posts').doc(postId).get()
      } else {
        return Promise.resolve(null)
      }
    })
    const savedPostsSnapshots = await Promise.all(savedPostsPromises)

    const savedPosts: DocumentData[] = []
    savedPostsSnapshots.forEach(doc => {
      if (doc.exists) {
        savedPosts.push({ postId: doc.id, ...doc.data() })
      }
    })

    return savedPosts

  } catch (error) {
    console.error('Error fetching saved posts', error)
    throw error
  }
}

// ================== CHECK HAS USER SAVE POST
export async function hasUserSavedPost(userId: string, postId: string) {
  try {
    if (userId) {

      const savesCollectionRef = db.collection('users').doc(userId).collection('saves')

      const querySnapshot = await savesCollectionRef.where('postId', '==', postId).get()

      return !querySnapshot.empty
    }

    return null
    // console.log(!querySnapshot.empty);
  } catch (error) {
    console.log('Error checking post', error);

  }
}

// ================== DELETE SAVED POST
export async function deleteSavedPost(postId: string, userId: string) {
  try {
    const querySnapshot = await db.collection('users').doc(userId).collection('saves').where('postId', '==', postId).get()

    if (!querySnapshot.empty) {
      const docTodelete = querySnapshot.docs[0]
      await docTodelete.ref.delete()
    }

    return { status: 'ok' }
  } catch (error) {
    console.log('failed to delete document', error);

  }
}

// ================== GET POST BY ID
export async function getPostById(postId: string): Promise<DocumentData | undefined> {
  try {
    const post = await db.collection('posts').doc(postId).get()

    if (post.exists) return ({ ...post.data(), postId: post.id })
  } catch (error) {
    console.log('failed to get post by id', error);
  }
}

// ================== UPDATE POST 
export async function updatePost(post: IUpdatePost): Promise<boolean> {
  const hasFileToUpdate = post.file.length > 0

  let image = {
    imageUrl: post.imageUrl,
    imagePath: post.imagePath
  }

  try {
    if (hasFileToUpdate) {
      // Upload new file to storage
      const uploadedFile = await uploadFile(post.file[0])
      if (!uploadedFile) throw new Error('failed upload file to strage')

      image = { ...image, imageUrl: uploadedFile.imageUrl, imagePath: uploadedFile.imagePath }
    }

    // Convert tags in an array
    const tags = post.tags?.replace(/ /g, '').split(',') || []

    // Add timestamp
    const timestamp = firebase.firestore.FieldValue.serverTimestamp

    // Update Post
    await db.collection('posts').doc(post.postId).update({
      caption: post.caption,
      updatedAt: timestamp(),
      imagePath: image.imagePath,
      imageUrl: image.imageUrl,
      location: post.location,
      tags: tags
    })

    // Delete old file after successfull update
    if (hasFileToUpdate) {
      await deleteFile(post.imagePath)
    }

    return true
  } catch (error) {
    await deleteFile(image.imagePath)
    console.error('Post was not updated', error);
    return false
  }
}

// ================== DELETE POST
export async function deletePost(postId: string, imagePath: string) {
  if (!imagePath || !postId) throw Error

  try {
    await db.collection('posts').doc(postId).delete()

    await deleteFile(imagePath)

    return { status: 'ok' }
  } catch (error) {
    console.log('failed to delete post', error)
  }
}


export async function getInfinitePosts({ pageParam }: { pageParam: number | null }) {
  let postsQuery = query(
    collection(db, 'posts'),
    orderBy('createdAt', 'desc'),
    limit(6)
  )

  if (pageParam) {
    postsQuery = query(
      collection(db, 'posts'),
      orderBy('createdAt', 'desc'),
      startAfter(pageParam),
      limit(6)
    )
  }

  try {
    const querySnapshot = await getDocs(postsQuery)
    const posts: DocumentData[] = querySnapshot.docs.map(doc => ({ postId: doc.id, ...doc.data() }))

    return posts
  } catch (error) {
    console.log('failed get infinite posts', error);
    throw error
  }
}

// ================== SEARCH POSTS
export async function searchPosts(searchTerm: string): Promise<DocumentData | undefined> {
  try {
    const postQuery = query(
      collection(db, 'posts'),
      where('caption', '>=', searchTerm),
      where('caption', '<=', searchTerm + '\uf8ff')
    )

    const querySnapshot = await getDocs(postQuery)
    const posts = querySnapshot.docs.map(doc => ({ postId: doc.id, ...doc.data() }))

    return posts
  } catch (error) {
    console.error('Error searching posts', error);
  }
}

// ================== GET USERS
export async function getUsers(limitt?: number) {
  let userQuery = query(
    collection(db, 'users'),
    orderBy('createdAt', 'desc')
  )

  if (limitt) {
    userQuery = query(
      collection(db, 'users'),
      orderBy('createdAt', 'desc'),
      limit(limitt)
    )
  }

  try {
    const querySnapshot = await getDocs(userQuery)
    const users = querySnapshot.docs.map(doc => ({
      ...doc.data()
    }))

    return users
  } catch (error) {
    console.error('error getting all users', error)
  }
}

// ================== GET UERS'S POSTS 
export async function getUsersPosts(userId: string) {
  try {
    const collectionRef = db.collection('posts')
    const postsQuerySnapshot = await collectionRef.where('creator', '==', userId).get()
    const posts = postsQuerySnapshot.docs.map(doc => ({
      postId: doc.id,
      ...doc.data()
    }))

    return posts
  } catch (error) {
    console.error('failed getting users posts ', error);

  }
}

// ================== GET LIKED POSTS
export async function getLikedPosts(userId: string) {
  try {
    const docRef = db.collection('posts')
    const querySNapshot = await docRef.where('likes', 'array-contains', userId).get()
    const posts = querySNapshot.docs.map(doc => ({
      postId: doc.id,
      ...doc.data()
    }))

    return posts
  } catch (error) {
    console.error('failed get liked posts', error);

  }
}

// ================== UPDATE USER
export async function updateUser(user: IUpdateUser) {
  const hasFileToUpdate = user.file.length > 0
  try {
    let image = {
      imageUrl: user.imageUrl,
      imagePath: user?.imagePath
    }

    if (hasFileToUpdate) {
      // Upload new file to db
      const uploadedFile = await uploadFile(user.file[0])
      if (!uploadedFile) throw Error

      image = { ...image, imageUrl: uploadedFile.imageUrl, imagePath: uploadedFile.imagePath }
    }

    // Add timestamp
    const timestamp = firebase.firestore.FieldValue.serverTimestamp()

    // Update user data 
    const docRef = db.collection('users').doc(user.accountId)
    await docRef.update({
      name: user.name,
      bio: user?.bio,
      imageUrl: image?.imageUrl || '',
      imagePath: image?.imagePath || '',
      updatedAt: timestamp

    })

    const updatedDoc = await docRef.get()
    const updatedUser = updatedDoc.data()

    if (!updatedUser) {
      if (hasFileToUpdate) {
        await deleteFile(image.imagePath)
      }

      throw Error
    }

    // Delete old file after update
    if (user.imagePath && hasFileToUpdate) {
      await deleteFile(user.imagePath)
    }


    // After updating, retrieve the updated document

    return updatedUser

  } catch (error) {
    console.error('failed update user', error);

  }
}
