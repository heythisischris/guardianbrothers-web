'use strict';

function noop() { }
function run(fn) {
    return fn();
}
function blank_object() {
    return Object.create(null);
}
function run_all(fns) {
    fns.forEach(run);
}
function is_function(thing) {
    return typeof thing === 'function';
}
function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}
function subscribe(store, ...callbacks) {
    if (store == null) {
        return noop;
    }
    const unsub = store.subscribe(...callbacks);
    return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function get_store_value(store) {
    let value;
    subscribe(store, _ => value = _)();
    return value;
}
function custom_event(type, detail) {
    const e = document.createEvent('CustomEvent');
    e.initCustomEvent(type, false, false, detail);
    return e;
}

let current_component;
function set_current_component(component) {
    current_component = component;
}
function get_current_component() {
    if (!current_component)
        throw new Error(`Function called outside component initialization`);
    return current_component;
}
function onMount(fn) {
    get_current_component().$$.on_mount.push(fn);
}
function onDestroy(fn) {
    get_current_component().$$.on_destroy.push(fn);
}
function createEventDispatcher() {
    const component = get_current_component();
    return (type, detail) => {
        const callbacks = component.$$.callbacks[type];
        if (callbacks) {
            // TODO are there situations where events could be dispatched
            // in a server (non-DOM) environment?
            const event = custom_event(type, detail);
            callbacks.slice().forEach(fn => {
                fn.call(component, event);
            });
        }
    };
}
function setContext(key, context) {
    get_current_component().$$.context.set(key, context);
}
function getContext(key) {
    return get_current_component().$$.context.get(key);
}

// source: https://html.spec.whatwg.org/multipage/indices.html
const boolean_attributes = new Set([
    'allowfullscreen',
    'allowpaymentrequest',
    'async',
    'autofocus',
    'autoplay',
    'checked',
    'controls',
    'default',
    'defer',
    'disabled',
    'formnovalidate',
    'hidden',
    'ismap',
    'loop',
    'multiple',
    'muted',
    'nomodule',
    'novalidate',
    'open',
    'playsinline',
    'readonly',
    'required',
    'reversed',
    'selected'
]);

const invalid_attribute_name_character = /[\s'">/=\u{FDD0}-\u{FDEF}\u{FFFE}\u{FFFF}\u{1FFFE}\u{1FFFF}\u{2FFFE}\u{2FFFF}\u{3FFFE}\u{3FFFF}\u{4FFFE}\u{4FFFF}\u{5FFFE}\u{5FFFF}\u{6FFFE}\u{6FFFF}\u{7FFFE}\u{7FFFF}\u{8FFFE}\u{8FFFF}\u{9FFFE}\u{9FFFF}\u{AFFFE}\u{AFFFF}\u{BFFFE}\u{BFFFF}\u{CFFFE}\u{CFFFF}\u{DFFFE}\u{DFFFF}\u{EFFFE}\u{EFFFF}\u{FFFFE}\u{FFFFF}\u{10FFFE}\u{10FFFF}]/u;
// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
// https://infra.spec.whatwg.org/#noncharacter
function spread(args, classes_to_add) {
    const attributes = Object.assign({}, ...args);
    if (classes_to_add) {
        if (attributes.class == null) {
            attributes.class = classes_to_add;
        }
        else {
            attributes.class += ' ' + classes_to_add;
        }
    }
    let str = '';
    Object.keys(attributes).forEach(name => {
        if (invalid_attribute_name_character.test(name))
            return;
        const value = attributes[name];
        if (value === true)
            str += " " + name;
        else if (boolean_attributes.has(name.toLowerCase())) {
            if (value)
                str += " " + name;
        }
        else if (value != null) {
            str += ` ${name}="${String(value).replace(/"/g, '&#34;').replace(/'/g, '&#39;')}"`;
        }
    });
    return str;
}
const escaped = {
    '"': '&quot;',
    "'": '&#39;',
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;'
};
function escape(html) {
    return String(html).replace(/["'&<>]/g, match => escaped[match]);
}
const missing_component = {
    $$render: () => ''
};
function validate_component(component, name) {
    if (!component || !component.$$render) {
        if (name === 'svelte:component')
            name += ' this={...}';
        throw new Error(`<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules`);
    }
    return component;
}
let on_destroy;
function create_ssr_component(fn) {
    function $$render(result, props, bindings, slots) {
        const parent_component = current_component;
        const $$ = {
            on_destroy,
            context: new Map(parent_component ? parent_component.$$.context : []),
            // these will be immediately discarded
            on_mount: [],
            before_update: [],
            after_update: [],
            callbacks: blank_object()
        };
        set_current_component({ $$ });
        const html = fn(result, props, bindings, slots);
        set_current_component(parent_component);
        return html;
    }
    return {
        render: (props = {}, options = {}) => {
            on_destroy = [];
            const result = { title: '', head: '', css: new Set() };
            const html = $$render(result, props, {}, options);
            run_all(on_destroy);
            return {
                html,
                css: {
                    code: Array.from(result.css).map(css => css.code).join('\n'),
                    map: null // TODO
                },
                head: result.title + result.head
            };
        },
        $$render
    };
}

const subscriber_queue = [];
/**
 * Creates a `Readable` store that allows reading by subscription.
 * @param value initial value
 * @param {StartStopNotifier}start start and stop notifications for subscriptions
 */
function readable(value, start) {
    return {
        subscribe: writable(value, start).subscribe,
    };
}
/**
 * Create a `Writable` store that allows both updating and reading by subscription.
 * @param {*=}value initial value
 * @param {StartStopNotifier=}start start and stop notifications for subscriptions
 */
function writable(value, start = noop) {
    let stop;
    const subscribers = [];
    function set(new_value) {
        if (safe_not_equal(value, new_value)) {
            value = new_value;
            if (stop) { // store is ready
                const run_queue = !subscriber_queue.length;
                for (let i = 0; i < subscribers.length; i += 1) {
                    const s = subscribers[i];
                    s[1]();
                    subscriber_queue.push(s, value);
                }
                if (run_queue) {
                    for (let i = 0; i < subscriber_queue.length; i += 2) {
                        subscriber_queue[i][0](subscriber_queue[i + 1]);
                    }
                    subscriber_queue.length = 0;
                }
            }
        }
    }
    function update(fn) {
        set(fn(value));
    }
    function subscribe(run, invalidate = noop) {
        const subscriber = [run, invalidate];
        subscribers.push(subscriber);
        if (subscribers.length === 1) {
            stop = start(set) || noop;
        }
        run(value);
        return () => {
            const index = subscribers.indexOf(subscriber);
            if (index !== -1) {
                subscribers.splice(index, 1);
            }
            if (subscribers.length === 0) {
                stop();
                stop = null;
            }
        };
    }
    return { set, update, subscribe };
}
function derived(stores, fn, initial_value) {
    const single = !Array.isArray(stores);
    const stores_array = single
        ? [stores]
        : stores;
    const auto = fn.length < 2;
    return readable(initial_value, (set) => {
        let inited = false;
        const values = [];
        let pending = 0;
        let cleanup = noop;
        const sync = () => {
            if (pending) {
                return;
            }
            cleanup();
            const result = fn(single ? values[0] : values, set);
            if (auto) {
                set(result);
            }
            else {
                cleanup = is_function(result) ? result : noop;
            }
        };
        const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
            values[i] = value;
            pending &= ~(1 << i);
            if (inited) {
                sync();
            }
        }, () => {
            pending |= (1 << i);
        }));
        inited = true;
        sync();
        return function stop() {
            run_all(unsubscribers);
            cleanup();
        };
    });
}

const LOCATION = {};
const ROUTER = {};

/**
 * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/history.js
 *
 * https://github.com/reach/router/blob/master/LICENSE
 * */

function getLocation(source) {
  return {
    ...source.location,
    state: source.history.state,
    key: (source.history.state && source.history.state.key) || "initial"
  };
}

function createHistory(source, options) {
  const listeners = [];
  let location = getLocation(source);

  return {
    get location() {
      return location;
    },

    listen(listener) {
      listeners.push(listener);

      const popstateListener = () => {
        location = getLocation(source);
        listener({ location, action: "POP" });
      };

      source.addEventListener("popstate", popstateListener);

      return () => {
        source.removeEventListener("popstate", popstateListener);

        const index = listeners.indexOf(listener);
        listeners.splice(index, 1);
      };
    },

    navigate(to, { state, replace = false } = {}) {
      state = { ...state, key: Date.now() + "" };
      // try...catch iOS Safari limits to 100 pushState calls
      try {
        if (replace) {
          source.history.replaceState(state, null, to);
        } else {
          source.history.pushState(state, null, to);
        }
      } catch (e) {
        source.location[replace ? "replace" : "assign"](to);
      }

      location = getLocation(source);
      listeners.forEach(listener => listener({ location, action: "PUSH" }));
    }
  };
}

// Stores history entries in memory for testing or other platforms like Native
function createMemorySource(initialPathname = "/") {
  let index = 0;
  const stack = [{ pathname: initialPathname, search: "" }];
  const states = [];

  return {
    get location() {
      return stack[index];
    },
    addEventListener(name, fn) {},
    removeEventListener(name, fn) {},
    history: {
      get entries() {
        return stack;
      },
      get index() {
        return index;
      },
      get state() {
        return states[index];
      },
      pushState(state, _, uri) {
        const [pathname, search = ""] = uri.split("?");
        index++;
        stack.push({ pathname, search });
        states.push(state);
      },
      replaceState(state, _, uri) {
        const [pathname, search = ""] = uri.split("?");
        stack[index] = { pathname, search };
        states[index] = state;
      }
    }
  };
}

// Global history uses window.history as the source if available,
// otherwise a memory history
const canUseDOM = Boolean(
  typeof window !== "undefined" &&
    window.document &&
    window.document.createElement
);
const globalHistory = createHistory(canUseDOM ? window : createMemorySource());

/**
 * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/utils.js
 *
 * https://github.com/reach/router/blob/master/LICENSE
 * */

const paramRe = /^:(.+)/;

const SEGMENT_POINTS = 4;
const STATIC_POINTS = 3;
const DYNAMIC_POINTS = 2;
const SPLAT_PENALTY = 1;
const ROOT_POINTS = 1;

/**
 * Check if `string` starts with `search`
 * @param {string} string
 * @param {string} search
 * @return {boolean}
 */
function startsWith(string, search) {
  return string.substr(0, search.length) === search;
}

/**
 * Check if `segment` is a root segment
 * @param {string} segment
 * @return {boolean}
 */
function isRootSegment(segment) {
  return segment === "";
}

/**
 * Check if `segment` is a dynamic segment
 * @param {string} segment
 * @return {boolean}
 */
function isDynamic(segment) {
  return paramRe.test(segment);
}

/**
 * Check if `segment` is a splat
 * @param {string} segment
 * @return {boolean}
 */
function isSplat(segment) {
  return segment[0] === "*";
}

/**
 * Split up the URI into segments delimited by `/`
 * @param {string} uri
 * @return {string[]}
 */
function segmentize(uri) {
  return (
    uri
      // Strip starting/ending `/`
      .replace(/(^\/+|\/+$)/g, "")
      .split("/")
  );
}

/**
 * Strip `str` of potential start and end `/`
 * @param {string} str
 * @return {string}
 */
function stripSlashes(str) {
  return str.replace(/(^\/+|\/+$)/g, "");
}

/**
 * Score a route depending on how its individual segments look
 * @param {object} route
 * @param {number} index
 * @return {object}
 */
function rankRoute(route, index) {
  const score = route.default
    ? 0
    : segmentize(route.path).reduce((score, segment) => {
        score += SEGMENT_POINTS;

        if (isRootSegment(segment)) {
          score += ROOT_POINTS;
        } else if (isDynamic(segment)) {
          score += DYNAMIC_POINTS;
        } else if (isSplat(segment)) {
          score -= SEGMENT_POINTS + SPLAT_PENALTY;
        } else {
          score += STATIC_POINTS;
        }

        return score;
      }, 0);

  return { route, score, index };
}

/**
 * Give a score to all routes and sort them on that
 * @param {object[]} routes
 * @return {object[]}
 */
function rankRoutes(routes) {
  return (
    routes
      .map(rankRoute)
      // If two routes have the exact same score, we go by index instead
      .sort((a, b) =>
        a.score < b.score ? 1 : a.score > b.score ? -1 : a.index - b.index
      )
  );
}

/**
 * Ranks and picks the best route to match. Each segment gets the highest
 * amount of points, then the type of segment gets an additional amount of
 * points where
 *
 *  static > dynamic > splat > root
 *
 * This way we don't have to worry about the order of our routes, let the
 * computers do it.
 *
 * A route looks like this
 *
 *  { path, default, value }
 *
 * And a returned match looks like:
 *
 *  { route, params, uri }
 *
 * @param {object[]} routes
 * @param {string} uri
 * @return {?object}
 */
function pick(routes, uri) {
  let match;
  let default_;

  const [uriPathname] = uri.split("?");
  const uriSegments = segmentize(uriPathname);
  const isRootUri = uriSegments[0] === "";
  const ranked = rankRoutes(routes);

  for (let i = 0, l = ranked.length; i < l; i++) {
    const route = ranked[i].route;
    let missed = false;

    if (route.default) {
      default_ = {
        route,
        params: {},
        uri
      };
      continue;
    }

    const routeSegments = segmentize(route.path);
    const params = {};
    const max = Math.max(uriSegments.length, routeSegments.length);
    let index = 0;

    for (; index < max; index++) {
      const routeSegment = routeSegments[index];
      const uriSegment = uriSegments[index];

      if (routeSegment !== undefined && isSplat(routeSegment)) {
        // Hit a splat, just grab the rest, and return a match
        // uri:   /files/documents/work
        // route: /files/* or /files/*splatname
        const splatName = routeSegment === "*" ? "*" : routeSegment.slice(1);

        params[splatName] = uriSegments
          .slice(index)
          .map(decodeURIComponent)
          .join("/");
        break;
      }

      if (uriSegment === undefined) {
        // URI is shorter than the route, no match
        // uri:   /users
        // route: /users/:userId
        missed = true;
        break;
      }

      let dynamicMatch = paramRe.exec(routeSegment);

      if (dynamicMatch && !isRootUri) {
        const value = decodeURIComponent(uriSegment);
        params[dynamicMatch[1]] = value;
      } else if (routeSegment !== uriSegment) {
        // Current segments don't match, not dynamic, not splat, so no match
        // uri:   /users/123/settings
        // route: /users/:id/profile
        missed = true;
        break;
      }
    }

    if (!missed) {
      match = {
        route,
        params,
        uri: "/" + uriSegments.slice(0, index).join("/")
      };
      break;
    }
  }

  return match || default_ || null;
}

/**
 * Check if the `path` matches the `uri`.
 * @param {string} path
 * @param {string} uri
 * @return {?object}
 */
function match(route, uri) {
  return pick([route], uri);
}

/**
 * Add the query to the pathname if a query is given
 * @param {string} pathname
 * @param {string} [query]
 * @return {string}
 */
function addQuery(pathname, query) {
  return pathname + (query ? `?${query}` : "");
}

/**
 * Resolve URIs as though every path is a directory, no files. Relative URIs
 * in the browser can feel awkward because not only can you be "in a directory",
 * you can be "at a file", too. For example:
 *
 *  browserSpecResolve('foo', '/bar/') => /bar/foo
 *  browserSpecResolve('foo', '/bar') => /foo
 *
 * But on the command line of a file system, it's not as complicated. You can't
 * `cd` from a file, only directories. This way, links have to know less about
 * their current path. To go deeper you can do this:
 *
 *  <Link to="deeper"/>
 *  // instead of
 *  <Link to=`{${props.uri}/deeper}`/>
 *
 * Just like `cd`, if you want to go deeper from the command line, you do this:
 *
 *  cd deeper
 *  # not
 *  cd $(pwd)/deeper
 *
 * By treating every path as a directory, linking to relative paths should
 * require less contextual information and (fingers crossed) be more intuitive.
 * @param {string} to
 * @param {string} base
 * @return {string}
 */
function resolve(to, base) {
  // /foo/bar, /baz/qux => /foo/bar
  if (startsWith(to, "/")) {
    return to;
  }

  const [toPathname, toQuery] = to.split("?");
  const [basePathname] = base.split("?");
  const toSegments = segmentize(toPathname);
  const baseSegments = segmentize(basePathname);

  // ?a=b, /users?b=c => /users?a=b
  if (toSegments[0] === "") {
    return addQuery(basePathname, toQuery);
  }

  // profile, /users/789 => /users/789/profile
  if (!startsWith(toSegments[0], ".")) {
    const pathname = baseSegments.concat(toSegments).join("/");

    return addQuery((basePathname === "/" ? "" : "/") + pathname, toQuery);
  }

  // ./       , /users/123 => /users/123
  // ../      , /users/123 => /users
  // ../..    , /users/123 => /
  // ../../one, /a/b/c/d   => /a/b/one
  // .././one , /a/b/c/d   => /a/b/c/one
  const allSegments = baseSegments.concat(toSegments);
  const segments = [];

  allSegments.forEach(segment => {
    if (segment === "..") {
      segments.pop();
    } else if (segment !== ".") {
      segments.push(segment);
    }
  });

  return addQuery("/" + segments.join("/"), toQuery);
}

/**
 * Combines the `basepath` and the `path` into one path.
 * @param {string} basepath
 * @param {string} path
 */
function combinePaths(basepath, path) {
  return `${stripSlashes(
    path === "/" ? basepath : `${stripSlashes(basepath)}/${stripSlashes(path)}`
  )}/`;
}

/* node_modules\svelte-routing\src\Router.svelte generated by Svelte v3.18.1 */

const Router = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let $base;
	let $location;
	let $routes;
	let { basepath = "/" } = $$props;
	let { url = null } = $$props;
	const locationContext = getContext(LOCATION);
	const routerContext = getContext(ROUTER);
	const routes = writable([]);
	$routes = get_store_value(routes);
	const activeRoute = writable(null);
	let hasActiveRoute = false; // Used in SSR to synchronously set that a Route is active.

	// If locationContext is not set, this is the topmost Router in the tree.
	// If the `url` prop is given we force the location to it.
	const location = locationContext || writable(url ? { pathname: url } : globalHistory.location);

	$location = get_store_value(location);

	// If routerContext is set, the routerBase of the parent Router
	// will be the base for this Router's descendants.
	// If routerContext is not set, the path and resolved uri will both
	// have the value of the basepath prop.
	const base = routerContext
	? routerContext.routerBase
	: writable({ path: basepath, uri: basepath });

	$base = get_store_value(base);

	const routerBase = derived([base, activeRoute], ([base, activeRoute]) => {
		// If there is no activeRoute, the routerBase will be identical to the base.
		if (activeRoute === null) {
			return base;
		}

		const { path: basepath } = base;
		const { route, uri } = activeRoute;

		// Remove the potential /* or /*splatname from
		// the end of the child Routes relative paths.
		const path = route.default
		? basepath
		: route.path.replace(/\*.*$/, "");

		return { path, uri };
	});

	function registerRoute(route) {
		const { path: basepath } = $base;
		let { path } = route;

		// We store the original path in the _path property so we can reuse
		// it when the basepath changes. The only thing that matters is that
		// the route reference is intact, so mutation is fine.
		route._path = path;

		route.path = combinePaths(basepath, path);

		if (typeof window === "undefined") {
			// In SSR we should set the activeRoute immediately if it is a match.
			// If there are more Routes being registered after a match is found,
			// we just skip them.
			if (hasActiveRoute) {
				return;
			}

			const matchingRoute = match(route, $location.pathname);

			if (matchingRoute) {
				activeRoute.set(matchingRoute);
				hasActiveRoute = true;
			}
		} else {
			routes.update(rs => {
				rs.push(route);
				return rs;
			});
		}
	}

	function unregisterRoute(route) {
		routes.update(rs => {
			const index = rs.indexOf(route);
			rs.splice(index, 1);
			return rs;
		});
	}

	if (!locationContext) {
		// The topmost Router in the tree is responsible for updating
		// the location store and supplying it through context.
		onMount(() => {
			const unlisten = globalHistory.listen(history => {
				location.set(history.location);
			});

			return unlisten;
		});

		setContext(LOCATION, location);
	}

	setContext(ROUTER, {
		activeRoute,
		base,
		routerBase,
		registerRoute,
		unregisterRoute
	});

	if ($$props.basepath === void 0 && $$bindings.basepath && basepath !== void 0) $$bindings.basepath(basepath);
	if ($$props.url === void 0 && $$bindings.url && url !== void 0) $$bindings.url(url);
	$base = get_store_value(base);
	$location = get_store_value(location);
	$routes = get_store_value(routes);

	 {
		{
			const { path: basepath } = $base;

			routes.update(rs => {
				rs.forEach(r => r.path = combinePaths(basepath, r._path));
				return rs;
			});
		}
	}

	 {
		{
			const bestMatch = pick($routes, $location.pathname);
			activeRoute.set(bestMatch);
		}
	}

	return `${$$slots.default ? $$slots.default({}) : ``}`;
});

/* node_modules\svelte-routing\src\Route.svelte generated by Svelte v3.18.1 */

const Route = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let $activeRoute;
	let $location;
	let { path = "" } = $$props;
	let { component = null } = $$props;
	const { registerRoute, unregisterRoute, activeRoute } = getContext(ROUTER);
	$activeRoute = get_store_value(activeRoute);
	const location = getContext(LOCATION);
	$location = get_store_value(location);

	const route = {
		path,
		// If no path prop is given, this Route will act as the default Route
		// that is rendered if no other Route in the Router is a match.
		default: path === ""
	};

	let routeParams = {};
	let routeProps = {};
	registerRoute(route);

	// There is no need to unregister Routes in SSR since it will all be
	// thrown away anyway.
	if (typeof window !== "undefined") {
		onDestroy(() => {
			unregisterRoute(route);
		});
	}

	if ($$props.path === void 0 && $$bindings.path && path !== void 0) $$bindings.path(path);
	if ($$props.component === void 0 && $$bindings.component && component !== void 0) $$bindings.component(component);
	$activeRoute = get_store_value(activeRoute);
	$location = get_store_value(location);

	 {
		if ($activeRoute && $activeRoute.route === route) {
			routeParams = $activeRoute.params;
		}
	}

	 {
		{
			const { path, component, ...rest } = $$props;
			routeProps = rest;
		}
	}

	return `${$activeRoute !== null && $activeRoute.route === route
	? `${component !== null
		? `${validate_component(component || missing_component, "svelte:component").$$render($$result, Object.assign({ location: $location }, routeParams, routeProps), {}, {})}`
		: `${$$slots.default
			? $$slots.default({ params: routeParams, location: $location })
			: ``}`}`
	: ``}`;
});

/* node_modules\svelte-routing\src\Link.svelte generated by Svelte v3.18.1 */

const Link = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let $base;
	let $location;
	let { to = "#" } = $$props;
	let { replace = false } = $$props;
	let { state = {} } = $$props;
	let { getProps = () => ({}) } = $$props;
	const { base } = getContext(ROUTER);
	$base = get_store_value(base);
	const location = getContext(LOCATION);
	$location = get_store_value(location);
	const dispatch = createEventDispatcher();
	let href, isPartiallyCurrent, isCurrent, props;

	if ($$props.to === void 0 && $$bindings.to && to !== void 0) $$bindings.to(to);
	if ($$props.replace === void 0 && $$bindings.replace && replace !== void 0) $$bindings.replace(replace);
	if ($$props.state === void 0 && $$bindings.state && state !== void 0) $$bindings.state(state);
	if ($$props.getProps === void 0 && $$bindings.getProps && getProps !== void 0) $$bindings.getProps(getProps);
	$base = get_store_value(base);
	$location = get_store_value(location);
	href = to === "/" ? $base.uri : resolve(to, $base.uri);
	isPartiallyCurrent = startsWith($location.pathname, href);
	isCurrent = href === $location.pathname;
	let ariaCurrent = isCurrent ? "page" : undefined;

	props = getProps({
		location: $location,
		href,
		isPartiallyCurrent,
		isCurrent
	});

	return `<a${spread([{ href: escape(href) }, { "aria-current": escape(ariaCurrent) }, props])}>
  ${$$slots.default ? $$slots.default({}) : ``}
</a>`;
});

/* src\components\NavLink.svelte generated by Svelte v3.18.1 */

function getProps({ location, href, isPartiallyCurrent, isCurrent }) {
	const isActive = href === "/"
	? isCurrent
	: isPartiallyCurrent || isCurrent;

	// The object returned here is spread on the anchor element's attributes
	if (isActive) {
		return { class: "active" };
	}

	return {};
}

const NavLink = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let { to = "" } = $$props;
	if ($$props.to === void 0 && $$bindings.to && to !== void 0) $$bindings.to(to);

	return `${validate_component(Link, "Link").$$render($$result, { to, getProps }, {}, {
		default: () => `
  ${$$slots.default ? $$slots.default({}) : ``}
`
	})}`;
});

/* src\routes\Funds.svelte generated by Svelte v3.18.1 */

const Funds = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let navArray = [
		8.77,
		9,
		8.24,
		9.54,
		10,
		7.6,
		9.7,
		9.8,
		9,
		8.67,
		8.5,
		8,
		8.34,
		9.28,
		10,
		10.23,
		10.5,
		10.32,
		10.73,
		10.32,
		11,
		10.45,
		10.34,
		11,
		10.7,
		11.1,
		11.12,
		11.45
	];

	let navToday = navArray[navArray.length - 1];
	let navReturn = `${(navToday / 10 - 1).toFixed(2)}% ($${(navToday - 10).toFixed(2)})`;

	return `<div class="${"pageContainerTop"}">
  <div class="${"pageContainerInner"}" style="${"color:#ffffff;font-size:22px;height:400px;"}">
    <div style="${"margin-top:25px;margin-bottom:25px;"}">
      Guardian Brother Equity Fund (GBH)
    </div>
    <div style="${"display:flex;flex-direction:row;justify-content:space-between;"}">
      <div>
        <div>Fund Asset</div>
        <div>$18.2k</div>
      </div>
      <div>
        <div>Fund Strategy</div>
        <div>US Mid-Large Cap Stocks</div>
      </div>
      <div>
        <div>NAV (Today)</div>
        <div>$${escape(navToday)}</div>
      </div>
      <div>
        <div>YTD Return</div>
        <div>$${escape(navReturn)}</div>
      </div>
    </div>
  </div>
</div>
<div class="${"pageContainerMiddle"}">
  <div class="${"pageContainerInner"}" style="${"color:#000000;font-size:22px;min-height:auto;"}">
    <div style="${"display:flex;flex-direction:row;justify-content:space-between;"}">
      <a href="${"javascript:void(0)"}">
        Overview
      </a>
      <a href="${"javascript:void(0)"}">
        Performance
      </a>
      <a href="${"javascript:void(0)"}">
        Fund Facts
      </a>
      <a href="${"javascript:void(0)"}">
        Holdings
      </a>
      <a href="${"javascript:void(0)"}">
        Portfolio Managers
      </a>
      <a href="${"javascript:void(0)"}">
        Fund &amp; Expenses
      </a>
    </div>
  </div>
</div>
<div class="${"pageContainer"}">
  <div class="${"pageContainerInner"}">
    <h1 id="${"sectionOverview"}">Overview</h1>
    <div class="${"textBlock"}">
      <p>
        We believe investing is about transparency, honesty, and accessibility
        for all our investors at any time. We created this fund with the goal of
        downside protection during market declines while seeking long term
        capital appreciation. Our number one goal is to provide exceptional
        returns while minimizing risk.
      </p>
      <p>
        Fund Strategy:
        <br>
        • Fund Title Invest is mid-large cap U.S companies with long-term
        competitive advantages and relevancy, quality management teams and
        positive performance on fund’s criteria.
        <br>
        • Our team focus in value investing. We only invest in companies that
        have being rigorously monitored and have passed all our filters.
        <br>
        • The fund seeks to be independent of the market’s conditions generating
        income in any circumstances. Our main goal is to always be on top of the
        markets.
      </p>
      <p>
        Risk
        <br>
        • You may lose money by investing in the Fund. You should expect the
        Fund&#39;s share price and total return to fluctuate within a wide range,
        like the fluctuations of the overall stock market. The Fund&#39;s
        performance could be hurt by: (read more)
      </p>
      <i>
        <p>
          Stock market risk: The chance that stock prices overall will decline.
          Stock markets tend to move in cycles, with periods of rising prices
          and periods of falling prices. Manager risk: The chance that, as a
          result of poor security selection by the Advisor, the Fund may
          underperform relative to benchmarks or other funds with similar
          investment objectives. Investment style risk: The chance that returns
          from the mix of small-, mid-, and large-cap stocks in the Fund&#39;s
          portfolio will trail returns from the overall stock market.
          Historically, small- and mid-cap stocks have been more volatile in
          price than the large-cap stocks that dominate the overall stock
          market, and they often perform quite differently. Additionally, from
          time to time, growth stocks may be more volatile than the overall
          stock market.
        </p>
        <p>
          Sector-focus risk: The chance that investing a significant portion of
          the Fund’s assets in one sector of the market exposes the Fund to
          greater market risk and potential monetary losses than if those assets
          were spread among various sectors.
        </p>
        <p>
          Foreign securities risk: The chance that the value of foreign
          securities will be adversely affected by the political and economic
          environments and other overall economic conditions in the countries
          where the Fund invests. Investing in foreign securities involves:
          country risk, which is the chance that domestic events - such as
          political upheaval, financial troubles, or natural disasters – will
          weaken a country&#39;s securities markets; and currency risk, which is the
          chance that the value of a foreign investment, measured in U.S.
          dollars, will decrease because of unfavorable changes in currency
          exchange rates. Small- and mid-cap stocks risk: The chance that small-
          and mid-cap stocks may trade less frequently or in more limited volume
          than those of larger, more established companies; may fluctuate in
          value more; and, as a group, may suffer more severe price declines
          during periods of generally declining stock prices.
        </p>
      </i>
    </div>
    <h1 id="${"sectionPerformance"}">Performance</h1>
    <div class="${"textBlock"}">
      <p>
        This chart illustrates the performance of a hypothetical $10,000
        investment in the Fund since its inception on 11/01/2004. Assumes
        investment of dividends and capital gains, but does not reflect the
        effect of any applicable sales charges or redemption fees. This chart
        does not imply any future performance.
      </p>
    </div>
    <h1 id="${"sectionFundFacts"}">Fund Facts</h1>
    <div class="${"textBlock"}">
      <p>
        • Fund Objective – Capital Appreciation and income
        <br>
        • Fund Strategy – U.S Mid-Large Cap Long/Short Equity Fund
        <br>
        • Ticker – FMB
        <br>
        • Fund Asset – total fund’s assets
        <br>
        • CUSIP – Not yet
        <br>
        • Distribution Frequency – Quarterly
        <br>
        • Minimum Initial Investment - $500
        <br>
        • Minimum Subsequent Investment - $50
        <br>
        • Gross Expense Ratio – 0.50%
        <br>
        • NAV – of the current date
        <br>
        • NAV Change from prior day -
        <br>
      </p>
    </div>
    <h1 id="${"sectionHoldings"}">Holdings</h1>
    <div class="${"textBlock"}">
      <p>Work in progress.</p>
    </div>
    <h1 id="${"sectionPortfolioManagers"}">Portfolio Managers</h1>
    <div class="${"textBlock"}">
      <p>
        Fernando Guardia Virreira is President and Portfolio Manager of FMB.
        SEC-Registered investment advisor CRD- 305744
      </p>
    </div>
    <h1 id="${"sectionFundAndExpenses"}">Fund &amp; Expenses</h1>
    <div class="${"textBlock"}">
      <p>
        Management Fee – 1% (Investment entry fee)
        <br>
        Expense Ratio – 0.50% (Annual expense fee)
        <br>
        Performance fees - 10% over return (quarterly)
        <br>
      </p>
    </div>
  </div>
</div>`;
});

/* src\routes\Insights.svelte generated by Svelte v3.18.1 */

const Insights = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	return `<div class="${"pageContainerTop"}">
  <div class="${"pageContainerInner"}" style="${"color:#ffffff;font-size:22px;height:400px;"}"></div>
</div>
<div class="${"pageContainer"}">
  <div class="${"pageContainerInner"}">

    <h1>Insights</h1>
    <div class="${"textBlock"}">
      <p>Insights page</p>
    </div>
  </div>
</div>`;
});

/* src\routes\Strategies.svelte generated by Svelte v3.18.1 */

const Strategies = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	return `<div class="${"pageContainerTop"}">
  <div class="${"pageContainerInner"}" style="${"color:#ffffff;font-size:22px;height:400px;"}"></div>
</div>
<div class="${"pageContainer"}">
  <div class="${"pageContainerInner"}">

    <h1>Strategies</h1>
    <div class="${"textBlock"}">
      <p>Strategies page</p>
    </div>
  </div>
</div>`;
});

/* src\routes\About.svelte generated by Svelte v3.18.1 */

const About = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	return `<div class="${"pageContainerTop"}">
  <div class="${"pageContainerInner"}" style="${"color:#ffffff;font-size:22px;height:400px;"}"></div>
</div>
<div class="${"pageContainer"}">
  <div class="${"pageContainerInner"}">

    <h1>About</h1>
    <div class="${"textBlock"}">
      <p>About page</p>
    </div>
  </div>
</div>`;
});

/* src\routes\Contact.svelte generated by Svelte v3.18.1 */

const Contact = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	return `<div class="${"pageContainerTop"}">
  <div class="${"pageContainerInner"}" style="${"color:#ffffff;font-size:22px;height:400px;"}"></div>
</div>
<div class="${"pageContainer"}">
  <div class="${"pageContainerInner"}">

    <h1>Contact</h1>
    <div class="${"textBlock"}">
      <p>Contact page</p>
    </div>
  </div>
</div>`;
});

/* src\App.svelte generated by Svelte v3.18.1 */

const App = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
	let { url = "" } = $$props;
	if ($$props.url === void 0 && $$bindings.url && url !== void 0) $$bindings.url(url);

	return `<head>
  <meta name="${"viewport"}" content="${"width=device-width, initial-scale=1.0, maximum-scale=1.0,\n    user-scalable=0"}">
  <title>Guardian Brothers Holdings Inc.</title>
  <meta charset="${"utf-8"}">
  <meta name="${"description"}" content="${"Guardian Brothers Holdings Inc."}">
  <meta name="${"author"}" content="${"Chris Aitken"}">
  <meta property="${"og:url"}" content="${"guardianbrothers.com"}">
  <meta property="${"og:type"}" content="${"website"}">
  <meta property="${"og:title"}" content="${"Guardian Brothers Holdings Inc."}">
  <meta property="${"og:description"}" content="${"Guardian Brothers Holdings Inc."}">
  <meta name="${"apple-mobile-web-app-title"}" content="${"Guardian Brothers Holdings Inc."}">
  <meta name="${"application-name"}" content="${"Guardian Brothers Holdings Inc."}">
</head>
${validate_component(Router, "Router").$$render($$result, { url }, {}, {
		default: () => `
  <div class="${"container"}">
    <nav>
      <div class="${"navContainer"}">
        <div class="${"navContainerInner"}">
          <div class="${"navTitle"}">
            ${validate_component(NavLink, "NavLink").$$render($$result, { to: "/" }, {}, {
			default: () => `
              <img style="${"margin-right:10px;"}" class="${"logo"}" alt="${""}" src="${"/images/logo.svg"}">
              <div style="${"display:flex;flex-direction:column;justify-content:center;"}">
                <div style="${"font-size:36px;"}">Guardian Brothers Holdings</div>
                <div style="${"font-size:22px;"}">Invest in your future</div>
              </div>
            `
		})}
          </div>
          <div style="${"display:flex;flex-direction:column;justify-content:center;align-items:flex-end;"}">
            <div class="${"navSocial"}">
              <a target="${"_blank"}" href="${"https://www.linkedin.com/guardianbrothers/"}">
                <img class="${"socialIcon"}" alt="${"linkedin"}" src="${"images/linkedin.svg"}">
              </a>
              <a target="${"_blank"}" href="${"https://www.twitter.com/guardianbrothers/"}">
                <img class="${"socialIcon"}" alt="${"twitter"}" src="${"images/twitter.svg"}">
              </a>
              <a target="${"_blank"}" href="${"https://www.facebook.com/guardianbrothers/"}">
                <img class="${"socialIcon"}" alt="${"bandcamp"}" src="${"images/facebook.svg"}">
              </a>
            </div>
            <div class="${"navLinks"}">
              ${validate_component(NavLink, "NavLink").$$render($$result, { to: "/" }, {}, { default: () => `Funds` })}
              ${validate_component(NavLink, "NavLink").$$render($$result, { to: "insights" }, {}, { default: () => `Insights` })}
              ${validate_component(NavLink, "NavLink").$$render($$result, { to: "strategies" }, {}, { default: () => `Strategies` })}
              ${validate_component(NavLink, "NavLink").$$render($$result, { to: "about" }, {}, { default: () => `About` })}
              ${validate_component(NavLink, "NavLink").$$render($$result, { to: "contact" }, {}, { default: () => `Contact` })}
            </div>
          </div>
        </div>
      </div>
    </nav>
    ${validate_component(Route, "Route").$$render($$result, { path: "/", component: Funds }, {}, {})}
    ${validate_component(Route, "Route").$$render($$result, { path: "insights", component: Insights }, {}, {})}
    ${validate_component(Route, "Route").$$render(
			$$result,
			{
				path: "strategies",
				component: Strategies
			},
			{},
			{}
		)}
    ${validate_component(Route, "Route").$$render($$result, { path: "about", component: About }, {}, {})}
    ${validate_component(Route, "Route").$$render($$result, { path: "contact", component: Contact }, {}, {})}
    <div class="${"footer"}">Copyright © 2020 Guardian Brothers Holdings Inc.</div>
  </div>
`
	})}`;
});

module.exports = App;
