# DevTinder

- Create a Vite + React application.
- Remove unnecessary code and create a hello world app.
- Install tailwindcss.
- Install daisyUI (a component library supported by tailwind)
- Add navbar component to App.jsx
- Create a NavBar.jsx seperate component file and render it in App.jsx.
- Install react router dom
- Create BrowserRouter -> Routes -> Route=/ Body -> RouteChildren
- Create an Outlet in Body component.
- Create a footer
- Create a login page
- Install axios
- Install cors in backend - add middleware with configurations {origin: (frontend domain) and credentials: true} This will whitelist frontend domain even though it is http. This will fix the cors error.
- When you are making api call using axios, pass {withCredential: true}, it is necessary to store user token into cookie and use in other apis that needs the token.
- install react-redux @reduxjs/toolkit Read the docs: https://redux-toolkit.js.org/tutorials/quick-start

- configureStore => add a <Provider > to App.jsx
- createSlice -> userSlice.js => Add reducer to store

- Add ReduxDevTool extension in chrome.
- Used useDispatch() to dispatch the action to redux store.
- Login and see in reduxdevtool if your data is properly coming in the store.
- NavBar should update as soon as user logs in. Welcome {user} and photo should be visible only if user logs in.
- Used useNavigate() hook to redirect to Feed page once login is succesful.
- Refactored code: added util/constants file and moved all auxilliary components to component folder.

- If a user is logged in and page is refreshed, we get redirected to feed page, username and photo disappears. which shouldn't happen.
- Also if user is not logged in and page is refreshed again feed page appears while login page should appear.
- If a user is logged in, then no api call should be make again to visit profile as we can get that from redux store. Implemented.

- Implemented logout api - called logout api -> cleared the redu store -> redirected to login page. Tested if token is deleted from cookie.
- Implemented handling of invalid credential when user logs in and displayed error message on ui.

- Implemented Feed.jsx: implemented getFeed() function to get feed and then store it in the redux store. Before this step created redux store for feed: feedSlice.js -> appStore.js.
- Create a UserCard component and used it in Feed.jsx and sent user detail as a prop to that component.
- Destructured the user prop in UserCard component and displayed user details like photo, name, about etc.
- Also implemented interested and ignore button in the card.

- Implemented EditProfile.jsx component. Populated loggedInUser data in the form, integrated UserCard side by side to see rel time viual of how card looks. Create updateProfile function to call the api andupdate the data, then added the updated data to redux store by dispatching addUser action.
- If there is error due to invalid input, displayed the error at the bottom by setting the error sent by server to error state. Cleared the error at the start so that next updates should not show the error.
- If update is successful, displayed a toast at top-center with timeout of 3 seconds.
- Updated gender field with select option.

- Implemented Connections page, created connections button in navbar, linked it to connection route, called fetchConnections api, created a connection slice, linked it to redux app store, displayed connection on connections page.
- Implemented Requests page, created requests button in navbar, linked it to Requests route, called fetchRequests api, create a request slice, linked it to redux app store, displayed all requests on requests page.

- Implemented request review with the help of accept and reject button. Created reviewRequest function in which called reviewRequest backend api where dynamically passed accepted/rejected along with id.
- Updated removeRequest action in requestSlice and used in review request to remove the request once it is accepted or rejected.




- Route and component structure:
Body
    navbar
    Route=/ => feed
    Route=/login => login
    Route=/connections => connections
    Route=/profile => profile

