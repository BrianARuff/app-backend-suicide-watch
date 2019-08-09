# Response Status Codes

## 304 **Not Modified**
 - A 304 is kind of like saying we already have this information on the page, so instead of sending a 200 and doing a fetching all the already cached assets again, we will instead send a 304 and tell your browser that you are up-to-date with the API already, and to use the cached API results instead of refetching them.