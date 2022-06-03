<script>
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import { _ } from "svelte-i18n";
    const Auth = aws_amplify_auth.Auth;
    import { v4 as uuidv4 } from "uuid";
    let email,
        password,
        confirmPassword,
        firstName,
        lastName,
        address,
        phone = "";
    let agreeToTerms = false;
    async function signup() {
        if (!agreeToTerms) {
            alert(
                `You must agree to the Terms and Conditions and Privacy Policy before signing up.`
            );
        } else if ([email, firstName, lastName, address, phone].includes("")) {
            alert(`You must fill out all fields before signing up.`);
        } else if (password !== confirmPassword) {
            alert(`Make sure your passwords match.`);
        } else {
            try {
                await Auth.signUp({
                    username: uuidv4(),
                    password: password,
                    attributes: {
                        email: email,
                        given_name: firstName,
                        family_name: lastName,
                        address: address,
                        website: `${phone}`,
                    },
                });
                alert(`Success! Confirm your email address before logging in`);
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
        <div class="field">
            <span>Confirm Password</span>
            <input type="password" bind:value={confirmPassword} />
        </div>
        <div class="field">
            <span>First Name</span>
            <input type="text" bind:value={firstName} />
        </div>
        <div class="field">
            <span>Last Name</span>
            <input type="text" bind:value={lastName} />
        </div>
        <div class="field">
            <span>Address</span>
            <input type="text" bind:value={address} />
        </div>
        <div class="field">
            <span>Phone</span>
            <input type="number" bind:value={phone} />
        </div>

        <div class="termsField">
            <input type="checkbox" bind:value={agreeToTerms} />
            <span
                >I agree to the <a target="_blank" href="/termsofservice"
                    >Terms of Service</a
                >
                and
                <a target="_blank" href="/privacypolicy">Privacy Policy</a
                ></span
            >
        </div>
        <button
            on:click={() => {
                signup();
            }}>Signup</button
        >
    </div>
</div>

<style>
    .field,
    .termsField {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        margin: 10px;
    }
    .field span {
        width: 100px;
    }
    .field input {
        width: 200px;
        padding: 5px;
    }
    .termsField input {
        height: 16px;
        width: 16px;
        margin-right: 10px;
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
