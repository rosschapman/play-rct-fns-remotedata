Hello AllTrails engineering!!! 👋👋👋

![](https://media.giphy.com/media/KDz4xUcEH67JzYbGZI/giphy-downsized.gif)

I'm excited to share with you some ideas that I explored while working on your coding challenge. Here's a brief visual demo: 

![](https://github.com/rosschapman/alltrails-challenge/blob/master/demo.gif)

You'll notice the page is unstyled. This was a sacrifice I made to focus more on the "backend of the frontend" -- I felt like I talked James' head off about some ideas on the phone so I wanted to make sure and showcase it here. All of the code is written from scratch in order to make these ideas more visible/readable for you. In turn, this also cut down on the time I had for polish. Here are the main focus areas of my work to reach the current stage of development:

1. Setting up a create-react-app project with Typescript and Prettier configs. This was my first time ever using create-react-app.
1. Creating a plain JS `GeoService` class that serves as a courier layer to the Google Places API. Note: this is an implementation that wraps the Places *node* SDK. I was able to leverage a proxy middlewhere within webpack's dev server to pass requests through and avoid CORS complaints <-- which is something new I learned.

1. Creating a `GeoServiceContainer` component that acts as a localized data provider and store. I'm new to React 16 so I decided not to jump into the Context API quite yet. Nonetheless, I actually find the render child prop pattern quite a suitable alternative for creating more localized context around a sub-group of components or "compound" component. I'd be interested to discuss the pros and cons with y'all.        
    1. Creating a finite state machine to manage events and side effects. This implementation is the first time I've tried this from scratch, though it's been an idea I've played with in a couple different formats to date. Think a reducer with rules. This format is based on Harel statecharts which is becoming somewhat of a defacto implementation for the community that is following the leadership of the xState maintainers. 
    
1. Implementing a view model based on the RemoteData pattern from Elm that maps to the state machine, constraining the UI to a finite set of possibilities. This is something I've wanted to try for a while. I think I like it -- at least what the outcome starts to imply. For example, while you'll notice a bit of redundancy across the `Render*` functional components, what you *don't* see is a scattershot of boolean flags for `isLoading` `isDisabled` `is...` An <a href="https://kentcdodds.com/blog/stop-using-isloading-booleans">article</a> from Kent Dodds early last month really encouraged me to think more this way.

1. Creating a lightweight caching strategy using `LocalStorage`: first cache initial nearby results on the first page load and cache all additional searches. Currently there is no eviction strategy, watch out!

1. Writing *some* tests for the GeoService and GeoServiceContainer state machine. There's only one of the latter, unfortunately. Overall the testing story has to remain a bit impressionistic because I bit off *a lot* to try in this project. I've added a Story to the Storybook for the `RemoteDataContainer` -- this serves as a basic smoke acceptance test for that UI behavior.

1. Storybook! I've never used it before. It was a bit tricky to setup with Typescript but I can see it being a really powerful tool.

## Usage

In the project directory, you can run:

### `HTTPS=true npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn storybook`

Launches Storybook.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
