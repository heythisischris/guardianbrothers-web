<script>
  import { Link } from "svelte-routing";

  export let to = "";

  function getProps({ location, href, isPartiallyCurrent, isCurrent }) {
    const isActive = href === "/" ? isCurrent : isPartiallyCurrent || isCurrent;

    // The object returned here is spread on the anchor element's attributes
    if (location.pathname === "/") {
      if (isActive) {
        return { class: "homeActive" };
      } else {
        return { class: "homeInactive" };
      }
    } else {
      if (isActive) {
        return { class: "active" };
      }
    }
    return {};
  }
</script>

<Link {to} {getProps}>
  <slot />
</Link>
