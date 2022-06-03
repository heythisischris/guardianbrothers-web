<script>
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import { _ } from "svelte-i18n";
    const Auth = aws_amplify_auth.Auth;
    let email,
        password = "";
    async function login() {
        if (!email || !password) {
            alert(`You must enter your email and password before logging in.`);
        } else {
            try {
                await Auth.signIn({
                    username: email,
                    password: password,
                });
                alert(`success!`);
            } catch (err) {
                alert(err);
            }
        }
    }
</script>

<div class="pageContainer" style="min-height:300px;">
    <div
        class="pageContainerInner"
        style="display:flex;flex-direction:column;align-items:center;"
    >
        <div class="field">
            <span>Email</span>
            <input type="email" bind:value={email} />
        </div>
        <div class="field">
            <span>Password</span>
            <input type="password" bind:value={password} />
        </div>
        <button
            on:click={() => {
                login();
            }}>Login</button
        >
    </div>
</div>

<style>
    .field,
    .field span {
        width: 100px;
    }
    .field input {
        width: 200px;
        padding: 5px;
    }
    button {
        all: unset;
        background-color: #000000;
        color: #ffffff;
        padding: 10px 20px;
        cursor: pointer;
        margin: 10px;
    }
</style>
