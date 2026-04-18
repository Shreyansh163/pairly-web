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



- Route and component structure:
Body
    navbar
    Route=/ => feed
    Route=/login => login
    Route=/connections => connections
    Route=/profile => profile

