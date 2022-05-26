<script>
  import { Link } from "svelte-routing";

  export let to = "";

  function getProps({ location, href, isPartiallyCurrent, isCurrent }) {
    const isActive = href === "/" ? isCurrent : isPartiallyCurrent || isCurrent;

    const authClass = ["/login", "/signup", "/account"].includes(href) ? `authLink` : ``;

    // The object returned here is spread on the anchor element's attributes
    if (["/","/hybridFund"].includes(location.pathname)) {
      if (isActive) {
        return { class: `homeActive ${authClass}` };
      } else {
        return { class: `homeInactive ${authClass}` };
      }
    } else {
      if (isActive) {
        return { class: `active ${authClass}` };
      }
    }
    return {class: `${authClass}`};
  }
</script>

<Link {to} {getProps}>
  <slot />
</Link>
