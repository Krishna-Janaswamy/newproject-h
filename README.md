## Quick start
- Make sure your Node.js and npm versions are up to date for `React 18`

- Install dependencies: `npm install` or `yarn`

- Start the server: `npm run dev` or `yarn dev`

- Views are on: `localhost:3000`

## Setup authentication (optional)


1. Open your project settings and activate **Email Magic Link** authentication.
This authentication method requires `redirect URIs` setup, so while in development you need to add `http://localhost:3000/sign-in/confirm`.
For production replace `localhost:3000` with your own domain.


## File Structure

Within the download you'll find the following directories and files:

```
material-kit-react

┌── .env.example
├── .eslintrc.json
├── .gitignore
├── CHANGELOG.md
├── LICENSE.md
├── next.config.js
├── package.json
├── README.md
├── public
└── src
	├── __mocks__
	├── components
	├── icons
	├── lib
	├── theme
	├── utils
	└── pages
		├── 404.js
		├── _app.js
		├── _document.js
		├── account.js
		├── customers.js
		├── index.js
		├── index.js
		├── products.js
		├── register.js
		└── settings.js
		└── sign-in
			├── confirm.js
			└── index.js
```

