# React App for expense tracking
This project uses vite framework to develop and deploy a react application to track my expenses.

## Vite Setup
Run the create command and follow the prompts
```
npm create vite@latest typescript-daily-accounts -- --template react
```

## Usage
Install dependencies with:

``` 
npm install
```

and run the dev script for development on localhost
```
npm run dev
```
### Deployment
Deploy with:
```
npm run build
```
After running build, upload the files index.html, favicon.png and assets/index-XXXX.js to AWS S3 
as a static host website

### Invocation

After successful deployment, you can check the URL created like http://XXXXX.s3-website.ap-south-1.amazonaws.com/
