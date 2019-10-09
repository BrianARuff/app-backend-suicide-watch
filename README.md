# [Additional .MD-Note-Files for this Application](https://github.com/BrianARuff/app-backend-suicide-watch/tree/master/MDs)

---

1. [View Site in Current Condition](https://elastic-shaw-7b0e0a.netlify.com/)
2. [Frontend of this Application](https://github.com/BrianARuff/app-frontend-suicide-watch)

---

## **Repository Name: app-backend-suicide-watch**
 
---

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
