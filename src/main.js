import App from "./App.svelte";
const Amplify = aws_amplify_core.Amplify
import awsconfig from "./aws-exports"
Amplify.configure(awsconfig)
new App({
  target: document.getElementById("app"),
  hydrate: true
});
