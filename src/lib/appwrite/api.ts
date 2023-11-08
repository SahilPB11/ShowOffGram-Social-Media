import {ID, Query} from "appwrite"
import { INewPost, INewUser, IUpdatePost } from "@/types";
import { account, appwriteConfig, avatars, databases, storage } from "./config";

// creating account in auth
export async function createUserAccount(user: INewUser){
    try {
       const newAccount  = await account.create(
        ID.unique(),
        user.email,
        user.password,
        user.name
       )
       if(!newAccount) throw Error;
       const avatarUrl = avatars.getInitials(user.name);

       const newUser = await saveUserToDB({
        accountId: newAccount.$id,
        name: newAccount.name,
        email: newAccount.email,
        username: user.username,
        imageUrl: avatarUrl,
       })
       return newUser;
    } catch (error) {
        console.log(error);
        return error;
    }
}

// then saving it in a database
export async function saveUserToDB(user :{
    accountId: string,
    email:string,
    name: string,
    imageUrl: URL,
    username? : string
} ){
try {
    const newUser = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        ID.unique(),
        user,
    )
    return newUser;
} catch (error) {
    console.log(error);
    
}
}

export async function signInAccount(user:{email: string, password: string} ){
    try {
        const session = await account.createEmailSession(user.email, user.password);
        return session;
    } catch (error) {
        console.log(error);
        
    }
}
// here we ae getting the details about logdin user

export async function getAccount() {
    try {
      const currentAccount = await account.get();
  
      return currentAccount;
    } catch (error) {
      console.log(error);
    }
  }
export async function getCurrentUser(){
    try {
      const currentAccount = await getAccount();  
      if(!currentAccount) throw Error;

      const currentUser = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        [Query.equal('accountId', currentAccount?.$id)]
      );
      if(!currentUser) throw Error;
      
      return currentUser?.documents[0];
    } catch (error) {
        console.log(error);
        
    }
}

// SignOut unction from account
export async function signOutAccount(){
    try {
        const session = await account.deleteSession('current')
        return session;
    } catch (error) {
        console.log(error);
        
    }
}

// post function 
// here we are cfeating a post
export async function createPost(post: INewPost){
    try {
       // upload image to storage 
       const uploadedFle = await UploadFile(post.file[0]);

       if(!uploadedFle) throw Error;

       // get file url
       const fileUrl =  getFilePreview(uploadedFle.$id);
       if(!fileUrl ) {
        // if something was corruted we are deleteing the previous file
        await deleteFile(uploadedFle.$id);
        throw Error;
       }

       //convert tags into an array
       const tags = post.tags?.replace(/ /g,'').split(',') || [];

       // ready to save in database
       const newPost = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        ID.unique(),
       {
        creator: post.userId,
        caption: post.caption,
        imageUrl: fileUrl,
        imageId : uploadedFle.$id,
        location: post.location,
        tags: tags
       }
       )

       if(!newPost){
        await deleteFile(uploadedFle.$id);
        throw Error;
       }

       return newPost;

    } catch (error) {
        console.log(error);
        
    }
}

// here we are uploading a image in storage bucket
export async function UploadFile(file: File){
    try {
        const uploadedFle = await storage.createFile(appwriteConfig.storageId,
            ID.unique(), file);
            return uploadedFle;
    } catch (error) {
       console.log(error);
        
    }
}

// to find the img format and we are checking the format of file like its size and format jpg or png or otheres also 
export  function getFilePreview(fileId: string){
    try {
        const fileUrl= storage.getFilePreview(appwriteConfig.storageId,
            fileId, 2000, 2000, "top", 100,
            )
            if (!fileUrl) throw Error;
            return fileUrl;
    } catch (error) {
        console.log(error);
        
    }
}

// if something was corruted we are deleteing the previous file 
export async function deleteFile(fileId: string){
    try {
        await storage.deleteFile(appwriteConfig.storageId, fileId);
        return {status: 'ok'}
    } catch (error) {
        console.log(error);
        
    }
}

// fetch the posts from database
export async function getRecentPosts(){
    const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        [Query.orderDesc('$createdAt'), Query.limit(20)]
    )
    if(!posts) throw Error
    return posts
}

// update when we like 
export async function likePost(postId: string , likesArray: string[]){
    try {
        const updatedPost = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId,
            {
                likes: likesArray
            }
        )
        if(!updatedPost) throw Error;

        return updatedPost
    } catch (error) {
        console.log(error);
        
    }
}

// this is for save post functionality
export async function savePost(postId: string , userId: string){
    try {
        const updatedPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            ID.unique(),
            {
               user: userId,
               post: postId
            }
        )
        if(!updatedPost) throw Error;

        return updatedPost
    } catch (error) {
        console.log(error);
        
    }
}

// this is for delete Saved post functionality
export async function deleteSavedPost(savedRecordId: string){
    try {
        const statusCode = await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
           savedRecordId,
        )

        if(!statusCode) throw Error;

        return {status: "ok"}
    } catch (error) {
        console.log(error);
        
    }
}

// get post by id
export async function getPostById(postId: string){
    try {
        const post = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId
        )
        return post;
    } catch (error) {
        console.log(error);
        
    }
}

// update post 
export async function updatePost(post: IUpdatePost){
    const hasFileToUpdate = post.file.length > 0;
    try {
        let image = {
            imageUrl : post.imageUrl,
            imageId : post.imageId,
        }
        if(hasFileToUpdate){
                   // upload image to storage 
       const uploadedFle = await UploadFile(post.file[0]);
       if(!uploadedFle) throw Error;
              // get file url
              const fileUrl =  getFilePreview(uploadedFle.$id);
              if(!fileUrl ) {
               // if something was corruted we are deleteing the previous file
               await deleteFile(uploadedFle.$id);
               throw Error;
              }
              image = {...image, imageUrl: fileUrl, imageId: uploadedFle.$id}
        }
       //convert tags into an array
       const tags = post.tags?.replace(/ /g,'').split(',') || [];

       // ready to save in database
       const updatedPost = await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        post.postId,
       {
        caption: post.caption,
        imageUrl: image.imageUrl,
        imageId : image.imageId,
        location: post.location,
        tags: tags
       }
       )

       if(!updatedPost){
        await deleteFile(post.imageId);
        throw Error;
       }

       return updatedPost;

    } catch (error) {
        console.log(error);
        
    }
}

// delete a post 
export async function deletePost(postId : string, imageId : string){
    if(!postId || !imageId) throw Error;
    try {
        await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId,
        )

        return {status : "ok"}
    } catch (error) {
        console.log(error);
        
    }
}

// doing infinite scroling and fetching the data
export async function getInfinitePost({pageParam} : {pageParam: number}){
    const queries: any[] = [Query.orderDesc('$updatedAt'), Query.limit(5) ]
    if(pageParam){
        queries.push(Query.cursorAfter(pageParam.toString()));
    }

    try {
        const post = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            queries
        )
        if(!post) throw Error
        return post
    } catch (error) {
        console.log(error);
        
        
    }

}

// search a posts
export async function searchedPosts(searchTerm : string){
    try {
        const post = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            [Query.search('caption', searchTerm)]
        )
        if(!post) throw Error
        return post
    } catch (error) {
        console.log(error);
        
        
    }

}

// get user by post id
export async function getPostsByUserId(userId: string){
    try {
        const post = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            [Query.equal('creator', userId), Query.orderDesc("$createdAt")],
        )
        if(!post) throw Error;
        return post;
    } catch (error) {
        console.log(error);
        
    }
}

// ============================== GET USER BY ID
export async function getUserById(userId: string) {
    try {
      const user = await databases.getDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        userId
      );
  
      if (!user) throw Error;
  
      return user;
    } catch (error) {
      console.log(error);
    }
  }
