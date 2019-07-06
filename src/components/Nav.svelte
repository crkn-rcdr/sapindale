<script>
  export let segment;
  export let error;
</script>

<style>
  nav {
    border-bottom: 1px solid rgba(33, 33, 33, 0.1);
    font-weight: 300;
    padding: 0 1em;
  }

  ul {
    margin: 0;
    padding: 0;
    max-width: none;
  }

  /* clearfix */
  ul::after {
    content: "";
    display: block;
    clear: both;
  }

  li {
    display: block;
    float: left;
  }

  li.right {
    float: right;
  }

  .selected {
    position: relative;
    display: inline-block;
  }

  .selected::after {
    position: absolute;
    content: "";
    width: calc(100% - 1em);
    height: 2px;
    background-color: var(--brand-color);
    display: block;
    bottom: -1px;
  }

  li > * {
    text-decoration: none;
    padding: 1em 0.5em;
    display: block;
  }
</style>

<nav>
  <ul>
    <li>
      <a class={segment === undefined ? 'selected' : ''} href=".">Home</a>
    </li>
    <li>
      <a class={segment === 'deposit' ? 'selected' : ''} href="/deposit">
        Deposit from Preservation
      </a>
    </li>
    <li>
      <a class={segment === 'collection' ? 'selected' : ''} href="/collection">
        Collections
      </a>
    </li>
    <li class="right">
      <a href=".">Figure out auth button here</a>
    </li>
  </ul>
</nav>
