# [Additional .MD-Note-Files for this Application](https://github.com/BrianARuff/app-backend-suicide-watch/tree/master/MDs)

---

1. [View Site in Current Condition](https://elastic-shaw-7b0e0a.netlify.com/)
2. [Frontend of this Application](https://github.com/BrianARuff/app-frontend-suicide-watch)

---

## **Repository Name: app-backend-suicide-watch**
 
---

### **Fix Proposals**

```
If user likes a post
	- add user to post liked
If user dislikes a post
	- add user to post disliked
If user id is in liked and is true
	- refuse to like again
If user id is in liked but is false
	- allow up vote

Table Articles
	- id
	- title
	- text
	- JSON of user ids for likes (I.E {324: true, 311: true}
	- likes
	- dislikes


Needed Updates
1. Update schema for Articles to include JSON entries for likes and dislikes
2. Update API for when user clicks like or dislike the backend checks the db for the validation needed for liking/disliking a comment.
```

##### **HERE IS A PIECE OF BAD ASCII ART FOR NO PARTICULAR REASON**
```
<-------------------->
  <-------------------->
    <-------------------->
      <-------------------->
        <-------------------->
          <-------------------->
            <-------------------->
          <-------------------->
        <-------------------->
      <-------------------->
    <-------------------->
  <-------------------->
<-------------------->
```
---

## **Branch prefix off master**
   - `app-be-sw-master`

### Git Scenarios:

1. You have just renamed a branch off of master to a new name. When you go to push it you get an error that says:
```
fatal: The upstream branch of your current branch does not match
the name of your current branch.  To push to the upstream branch
on the remote, use
```

This problem is solved with `git push --set-upstream <new-origin> <branch-to-track>`. An example of the output with that command will yield the following:

`git push --set-upstream origin app-be-sw--add_middleware`

```
Branch 'app-be-sw--add_middleware' set up to track remote branch 'app-be-sw--add_middleware' from 'origin'.
Everything up-to-date
```
