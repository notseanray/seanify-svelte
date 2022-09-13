<script lang="ts">
  import CodeSnippet from "../components/code-snippet.svelte";
  import PageLayout from "../components/page-layout.svelte";
  import { useAuth0 } from "../services/auth0";
  import { checkUsername, newUser } from "../services/message.service.js";
  import { seanifyUser } from "../store.js";
  import { onMount } from "svelte";
  const { user, isAuthenticated } = useAuth0;
  let message = [];
  let warn = [];
  let validated = false;
  let ready = "";
  let token;
  const { getAccessToken } = useAuth0;
  onMount(async () => {
    token = await getAccessToken();
  });
  async function onSubmit(e) {
    validated = false;
    message.length = 0;
    warn.length = 0;
    ready = "";
    if (!$seanifyUser.username) {
      if ($user.nickname) {
        warn.push("no nickname provided, using auth0 credentials");
        $seanifyUser.username = $user.nickname;
      } else if ($user.name) {
        $seanifyUser.username = $user.nickname;
      } else {
        message.push("Invalid username");
      }
    }
    if (!$seanifyUser.display_name) {
      $seanifyUser.display_name = $seanifyUser.username;
      warn.push("no display name provided, using username");
    }
    if ($seanifyUser.username.length > 200) {
        message.push("username too long");
    }
    if ($seanifyUser.display_name.length > 200) {
        message.push("display name too long");
    }
    if (message.length > 0) {
      return;
    }
    const fetchUserRequest = await checkUsername($seanifyUser.username);
    if (!fetchUserRequest) {
      message.push("username already taken");
      return;
    }
    if (message.length > 0) {
      return;
    }
    validated = true;
    ready = "ready to send to server!";
  }
  async function send(_) {
    if (token && validated) {
      const user = await newUser(
        token,
        $seanifyUser.username,
        $seanifyUser.serverside,
        $seanifyUser.thumbnails,
        $seanifyUser.autoplay,
        $seanifyUser.allow_followers,
        $seanifyUser.public_account,
        $seanifyUser.activity,
        $seanifyUser.display_name,
        $seanifyUser.analytics
      );
      console.log(user);
    }
  }
</script>

{#if !($isAuthenticated && $user)}
  <slot />
{/if}

{#if $isAuthenticated && $user}
  <PageLayout>
    <div class="content-layout">
      <h1 id="page-title" class="content__title">Profile Page</h1>
      <div class="content__body">
        <p id="page-description">
          <span>
            You can use the <strong>ID Token</strong> to get the profile information
            of an authenticated user.
          </span>
          <span>
            <strong>Only authenticated users can access this page.</strong>
          </span>
        </p>
        <div class="profile-grid">
          <div class="profile__header">
            <img src={$user.picture} alt="Profile" class="profile__avatar" />
            <div class="profile__headline">
              <h2 class="profile__title">{$user.name}</h2>
              <span class="profile__description">{$user.email}</span>
            </div>
          </div>
          <div class="profile__details">
            <CodeSnippet
              title="auth0 credentials"
              code={JSON.stringify($user, null, 2)}
            />
            <form on:submit|preventDefault={onSubmit} class="text-zinc-500 formcontent p-4">
                <label for="name">username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  bind:value={$seanifyUser.username}
                />
                <label for="name">display name</label>
                <input
                  type="text"
                  id="display_name"
                  name="display_name"
                  bind:value={$seanifyUser.display_name}
                />
                <label for="name">server side</label>
                <input
                  type="checkbox"
                  id="serverside"
                  name="serverside"
                  bind:checked={$seanifyUser.serverside}
                />
                <label for="name">thumbnails</label>
                <input
                  type="checkbox"
                  id="thumbnails"
                  name="thumbnails"
                  bind:checked={$seanifyUser.thumbnails}
                />
                <label for="name">autoplay</label>
                <input
                  type="checkbox"
                  id="autoplay"
                  name="autoplay"
                  bind:checked={$seanifyUser.autoplay}
                />
                <label for="name">allow followers</label>
                <input
                  type="checkbox"
                  id="allow_followers"
                  name="allow_followers"
                  bind:checked={$seanifyUser.allow_followers}
                />
                <label for="name">public account</label>
                <input
                  type="checkbox"
                  id="public_account"
                  name="public_account"
                  bind:checked={$seanifyUser.public_account}
                />
                <label for="name">song activity</label>
                <input
                  type="checkbox"
                  id="activity"
                  name="activity"
                  bind:checked={$seanifyUser.activity}
                />
                <label for="name">analytics</label>
                <input
                  type="checkbox"
                  id="analytics"
                  name="analytics"
                  bind:checked={$seanifyUser.analytics}
                />
              <button class="border-2 rounded-lg p-2" type="">validate</button>
                {#if validated}
                  <form on:submit|preventDefault={send}>
                    <button class="border-2 rounded-lg p-2" type="submit"
                      >send to server</button
                    >
                  </form>
                {/if}
            </form>
            <p class="text-red-200">
              {message.join(", ")}
            </p>
            <p class="text-yellow-200">
              {warn.join(", ")}
            </p>
            <p class="text-green-200">
              {ready}
            </p>
            <CodeSnippet
              title="see what you are sending to the server"
              code={JSON.stringify($seanifyUser, null, 2)}
            />
          </div>
        </div>
      </div>
    </div>
  </PageLayout>
{/if}

<style>
  .formcontent {
    display: grid;
    grid-template-columns: 20% 20%;
    grid-column-gap: 20px;
  }
</style>
