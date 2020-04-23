(function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
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
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if (typeof $$scope.dirty === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function claim_element(nodes, name, attributes, svg) {
        for (let i = 0; i < nodes.length; i += 1) {
            const node = nodes[i];
            if (node.nodeName === name) {
                let j = 0;
                while (j < node.attributes.length) {
                    const attribute = node.attributes[j];
                    if (attributes[attribute.name]) {
                        j++;
                    }
                    else {
                        node.removeAttribute(attribute.name);
                    }
                }
                return nodes.splice(i, 1)[0];
            }
        }
        return svg ? svg_element(name) : element(name);
    }
    function claim_text(nodes, data) {
        for (let i = 0; i < nodes.length; i += 1) {
            const node = nodes[i];
            if (node.nodeType === 3) {
                node.data = '' + data;
                return nodes.splice(i, 1)[0];
            }
        }
        return text(data);
    }
    function claim_space(nodes) {
        return claim_text(nodes, ' ');
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
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

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    const seen_callbacks = new Set();
    function flush() {
        do {
            // first, call beforeUpdate functions
            // and update components
            while (dirty_components.length) {
                const component = dirty_components.shift();
                set_current_component(component);
                update(component.$$);
            }
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function claim_component(block, parent_nodes) {
        block && block.l(parent_nodes);
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if ($$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(children(options.target));
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
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
    const { navigate } = globalHistory;

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

    /**
     * Decides whether a given `event` should result in a navigation or not.
     * @param {object} event
     */
    function shouldNavigate(event) {
      return (
        !event.defaultPrevented &&
        event.button === 0 &&
        !(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
      );
    }

    /* node_modules\svelte-routing\src\Router.svelte generated by Svelte v3.18.1 */

    function create_fragment(ctx) {
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[16].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[15], null);

    	return {
    		c() {
    			if (default_slot) default_slot.c();
    		},
    		l(nodes) {
    			if (default_slot) default_slot.l(nodes);
    		},
    		m(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p(ctx, [dirty]) {
    			if (default_slot && default_slot.p && dirty & /*$$scope*/ 32768) {
    				default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[15], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[15], dirty, null));
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};
    }

    function instance($$self, $$props, $$invalidate) {
    	let $base;
    	let $location;
    	let $routes;
    	let { basepath = "/" } = $$props;
    	let { url = null } = $$props;
    	const locationContext = getContext(LOCATION);
    	const routerContext = getContext(ROUTER);
    	const routes = writable([]);
    	component_subscribe($$self, routes, value => $$invalidate(8, $routes = value));
    	const activeRoute = writable(null);
    	let hasActiveRoute = false; // Used in SSR to synchronously set that a Route is active.

    	// If locationContext is not set, this is the topmost Router in the tree.
    	// If the `url` prop is given we force the location to it.
    	const location = locationContext || writable(url ? { pathname: url } : globalHistory.location);

    	component_subscribe($$self, location, value => $$invalidate(7, $location = value));

    	// If routerContext is set, the routerBase of the parent Router
    	// will be the base for this Router's descendants.
    	// If routerContext is not set, the path and resolved uri will both
    	// have the value of the basepath prop.
    	const base = routerContext
    	? routerContext.routerBase
    	: writable({ path: basepath, uri: basepath });

    	component_subscribe($$self, base, value => $$invalidate(6, $base = value));

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

    	let { $$slots = {}, $$scope } = $$props;

    	$$self.$set = $$props => {
    		if ("basepath" in $$props) $$invalidate(3, basepath = $$props.basepath);
    		if ("url" in $$props) $$invalidate(4, url = $$props.url);
    		if ("$$scope" in $$props) $$invalidate(15, $$scope = $$props.$$scope);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$base*/ 64) {
    			// This reactive statement will update all the Routes' path when
    			// the basepath changes.
    			 {
    				const { path: basepath } = $base;

    				routes.update(rs => {
    					rs.forEach(r => r.path = combinePaths(basepath, r._path));
    					return rs;
    				});
    			}
    		}

    		if ($$self.$$.dirty & /*$routes, $location*/ 384) {
    			// This reactive statement will be run when the Router is created
    			// when there are no Routes and then again the following tick, so it
    			// will not find an active Route in SSR and in the browser it will only
    			// pick an active Route after all Routes have been registered.
    			 {
    				const bestMatch = pick($routes, $location.pathname);
    				activeRoute.set(bestMatch);
    			}
    		}
    	};

    	return [
    		routes,
    		location,
    		base,
    		basepath,
    		url,
    		hasActiveRoute,
    		$base,
    		$location,
    		$routes,
    		locationContext,
    		routerContext,
    		activeRoute,
    		routerBase,
    		registerRoute,
    		unregisterRoute,
    		$$scope,
    		$$slots
    	];
    }

    class Router extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance, create_fragment, safe_not_equal, { basepath: 3, url: 4 });
    	}
    }

    /* node_modules\svelte-routing\src\Route.svelte generated by Svelte v3.18.1 */

    const get_default_slot_changes = dirty => ({
    	params: dirty & /*routeParams*/ 2,
    	location: dirty & /*$location*/ 16
    });

    const get_default_slot_context = ctx => ({
    	params: /*routeParams*/ ctx[1],
    	location: /*$location*/ ctx[4]
    });

    // (40:0) {#if $activeRoute !== null && $activeRoute.route === route}
    function create_if_block(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*component*/ ctx[0] !== null) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	return {
    		c() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l(nodes) {
    			if_block.l(nodes);
    			if_block_anchor = empty();
    		},
    		m(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach(if_block_anchor);
    		}
    	};
    }

    // (43:2) {:else}
    function create_else_block(ctx) {
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[13].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], get_default_slot_context);

    	return {
    		c() {
    			if (default_slot) default_slot.c();
    		},
    		l(nodes) {
    			if (default_slot) default_slot.l(nodes);
    		},
    		m(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p(ctx, dirty) {
    			if (default_slot && default_slot.p && dirty & /*$$scope, routeParams, $location*/ 4114) {
    				default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[12], get_default_slot_context), get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, get_default_slot_changes));
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};
    }

    // (41:2) {#if component !== null}
    function create_if_block_1(ctx) {
    	let switch_instance_anchor;
    	let current;

    	const switch_instance_spread_levels = [
    		{ location: /*$location*/ ctx[4] },
    		/*routeParams*/ ctx[1],
    		/*routeProps*/ ctx[2]
    	];

    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return { props: switch_instance_props };
    	}

    	if (switch_value) {
    		var switch_instance = new switch_value(switch_props());
    	}

    	return {
    		c() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		l(nodes) {
    			if (switch_instance) claim_component(switch_instance.$$.fragment, nodes);
    			switch_instance_anchor = empty();
    		},
    		m(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*$location, routeParams, routeProps*/ 22)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*$location*/ 16 && { location: /*$location*/ ctx[4] },
    					dirty & /*routeParams*/ 2 && get_spread_object(/*routeParams*/ ctx[1]),
    					dirty & /*routeProps*/ 4 && get_spread_object(/*routeProps*/ ctx[2])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};
    }

    function create_fragment$1(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*$activeRoute*/ ctx[3] !== null && /*$activeRoute*/ ctx[3].route === /*route*/ ctx[7] && create_if_block(ctx);

    	return {
    		c() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l(nodes) {
    			if (if_block) if_block.l(nodes);
    			if_block_anchor = empty();
    		},
    		m(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p(ctx, [dirty]) {
    			if (/*$activeRoute*/ ctx[3] !== null && /*$activeRoute*/ ctx[3].route === /*route*/ ctx[7]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    					transition_in(if_block, 1);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach(if_block_anchor);
    		}
    	};
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $activeRoute;
    	let $location;
    	let { path = "" } = $$props;
    	let { component = null } = $$props;
    	const { registerRoute, unregisterRoute, activeRoute } = getContext(ROUTER);
    	component_subscribe($$self, activeRoute, value => $$invalidate(3, $activeRoute = value));
    	const location = getContext(LOCATION);
    	component_subscribe($$self, location, value => $$invalidate(4, $location = value));

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

    	let { $$slots = {}, $$scope } = $$props;

    	$$self.$set = $$new_props => {
    		$$invalidate(11, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ("path" in $$new_props) $$invalidate(8, path = $$new_props.path);
    		if ("component" in $$new_props) $$invalidate(0, component = $$new_props.component);
    		if ("$$scope" in $$new_props) $$invalidate(12, $$scope = $$new_props.$$scope);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$activeRoute*/ 8) {
    			 if ($activeRoute && $activeRoute.route === route) {
    				$$invalidate(1, routeParams = $activeRoute.params);
    			}
    		}

    		 {
    			const { path, component, ...rest } = $$props;
    			$$invalidate(2, routeProps = rest);
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		component,
    		routeParams,
    		routeProps,
    		$activeRoute,
    		$location,
    		activeRoute,
    		location,
    		route,
    		path,
    		registerRoute,
    		unregisterRoute,
    		$$props,
    		$$scope,
    		$$slots
    	];
    }

    class Route extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { path: 8, component: 0 });
    	}
    }

    /* node_modules\svelte-routing\src\Link.svelte generated by Svelte v3.18.1 */

    function create_fragment$2(ctx) {
    	let a;
    	let current;
    	let dispose;
    	const default_slot_template = /*$$slots*/ ctx[16].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[15], null);

    	let a_levels = [
    		{ href: /*href*/ ctx[0] },
    		{ "aria-current": /*ariaCurrent*/ ctx[2] },
    		/*props*/ ctx[1]
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	return {
    		c() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			this.h();
    		},
    		l(nodes) {
    			a = claim_element(nodes, "A", { href: true, "aria-current": true });
    			var a_nodes = children(a);
    			if (default_slot) default_slot.l(a_nodes);
    			a_nodes.forEach(detach);
    			this.h();
    		},
    		h() {
    			set_attributes(a, a_data);
    		},
    		m(target, anchor) {
    			insert(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			current = true;
    			dispose = listen(a, "click", /*onClick*/ ctx[5]);
    		},
    		p(ctx, [dirty]) {
    			if (default_slot && default_slot.p && dirty & /*$$scope*/ 32768) {
    				default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[15], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[15], dirty, null));
    			}

    			set_attributes(a, get_spread_update(a_levels, [
    				dirty & /*href*/ 1 && { href: /*href*/ ctx[0] },
    				dirty & /*ariaCurrent*/ 4 && { "aria-current": /*ariaCurrent*/ ctx[2] },
    				dirty & /*props*/ 2 && /*props*/ ctx[1]
    			]));
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(a);
    			if (default_slot) default_slot.d(detaching);
    			dispose();
    		}
    	};
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let $base;
    	let $location;
    	let { to = "#" } = $$props;
    	let { replace = false } = $$props;
    	let { state = {} } = $$props;
    	let { getProps = () => ({}) } = $$props;
    	const { base } = getContext(ROUTER);
    	component_subscribe($$self, base, value => $$invalidate(12, $base = value));
    	const location = getContext(LOCATION);
    	component_subscribe($$self, location, value => $$invalidate(13, $location = value));
    	const dispatch = createEventDispatcher();
    	let href, isPartiallyCurrent, isCurrent, props;

    	function onClick(event) {
    		dispatch("click", event);

    		if (shouldNavigate(event)) {
    			event.preventDefault();

    			// Don't push another entry to the history stack when the user
    			// clicks on a Link to the page they are currently on.
    			const shouldReplace = $location.pathname === href || replace;

    			navigate(href, { state, replace: shouldReplace });
    		}
    	}

    	let { $$slots = {}, $$scope } = $$props;

    	$$self.$set = $$props => {
    		if ("to" in $$props) $$invalidate(6, to = $$props.to);
    		if ("replace" in $$props) $$invalidate(7, replace = $$props.replace);
    		if ("state" in $$props) $$invalidate(8, state = $$props.state);
    		if ("getProps" in $$props) $$invalidate(9, getProps = $$props.getProps);
    		if ("$$scope" in $$props) $$invalidate(15, $$scope = $$props.$$scope);
    	};

    	let ariaCurrent;

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*to, $base*/ 4160) {
    			 $$invalidate(0, href = to === "/" ? $base.uri : resolve(to, $base.uri));
    		}

    		if ($$self.$$.dirty & /*$location, href*/ 8193) {
    			 $$invalidate(10, isPartiallyCurrent = startsWith($location.pathname, href));
    		}

    		if ($$self.$$.dirty & /*href, $location*/ 8193) {
    			 $$invalidate(11, isCurrent = href === $location.pathname);
    		}

    		if ($$self.$$.dirty & /*isCurrent*/ 2048) {
    			 $$invalidate(2, ariaCurrent = isCurrent ? "page" : undefined);
    		}

    		if ($$self.$$.dirty & /*getProps, $location, href, isPartiallyCurrent, isCurrent*/ 11777) {
    			 $$invalidate(1, props = getProps({
    				location: $location,
    				href,
    				isPartiallyCurrent,
    				isCurrent
    			}));
    		}
    	};

    	return [
    		href,
    		props,
    		ariaCurrent,
    		base,
    		location,
    		onClick,
    		to,
    		replace,
    		state,
    		getProps,
    		isPartiallyCurrent,
    		isCurrent,
    		$base,
    		$location,
    		dispatch,
    		$$scope,
    		$$slots
    	];
    }

    class Link extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { to: 6, replace: 7, state: 8, getProps: 9 });
    	}
    }

    /* src\components\NavLink.svelte generated by Svelte v3.18.1 */

    function create_default_slot(ctx) {
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	return {
    		c() {
    			if (default_slot) default_slot.c();
    		},
    		l(nodes) {
    			if (default_slot) default_slot.l(nodes);
    		},
    		m(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p(ctx, dirty) {
    			if (default_slot && default_slot.p && dirty & /*$$scope*/ 4) {
    				default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[2], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null));
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};
    }

    function create_fragment$3(ctx) {
    	let current;

    	const link = new Link({
    			props: {
    				to: /*to*/ ctx[0],
    				getProps,
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(link.$$.fragment);
    		},
    		l(nodes) {
    			claim_component(link.$$.fragment, nodes);
    		},
    		m(target, anchor) {
    			mount_component(link, target, anchor);
    			current = true;
    		},
    		p(ctx, [dirty]) {
    			const link_changes = {};
    			if (dirty & /*to*/ 1) link_changes.to = /*to*/ ctx[0];

    			if (dirty & /*$$scope*/ 4) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(link.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(link, detaching);
    		}
    	};
    }

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

    function instance$3($$self, $$props, $$invalidate) {
    	let { to = "" } = $$props;
    	let { $$slots = {}, $$scope } = $$props;

    	$$self.$set = $$props => {
    		if ("to" in $$props) $$invalidate(0, to = $$props.to);
    		if ("$$scope" in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	return [to, $$slots, $$scope];
    }

    class NavLink extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { to: 0 });
    	}
    }

    /* src\routes\Funds.svelte generated by Svelte v3.18.1 */

    function create_fragment$4(ctx) {
    	let div15;
    	let div14;
    	let div0;
    	let t0;
    	let t1;
    	let div13;
    	let div3;
    	let div1;
    	let t2;
    	let t3;
    	let div2;
    	let t4;
    	let t5;
    	let div6;
    	let div4;
    	let t6;
    	let t7;
    	let div5;
    	let t8;
    	let t9;
    	let div9;
    	let div7;
    	let t10;
    	let t11;
    	let div8;
    	let t12;
    	let t13;
    	let t14;
    	let div12;
    	let div10;
    	let t15;
    	let t16;
    	let div11;
    	let t17;
    	let t18;
    	let t19;
    	let div18;
    	let div17;
    	let div16;
    	let a0;
    	let t20;
    	let t21;
    	let a1;
    	let t22;
    	let t23;
    	let a2;
    	let t24;
    	let t25;
    	let a3;
    	let t26;
    	let t27;
    	let a4;
    	let t28;
    	let t29;
    	let a5;
    	let t30;
    	let t31;
    	let div26;
    	let div25;
    	let h10;
    	let t32;
    	let t33;
    	let div19;
    	let p0;
    	let t34;
    	let t35;
    	let p1;
    	let t36;
    	let br0;
    	let t37;
    	let br1;
    	let t38;
    	let br2;
    	let t39;
    	let t40;
    	let p2;
    	let t41;
    	let br3;
    	let t42;
    	let t43;
    	let i;
    	let p3;
    	let t44;
    	let t45;
    	let p4;
    	let t46;
    	let t47;
    	let p5;
    	let t48;
    	let t49;
    	let h11;
    	let t50;
    	let t51;
    	let div20;
    	let p6;
    	let t52;
    	let t53;
    	let h12;
    	let t54;
    	let t55;
    	let div21;
    	let p7;
    	let t56;
    	let br4;
    	let t57;
    	let br5;
    	let t58;
    	let br6;
    	let t59;
    	let br7;
    	let t60;
    	let br8;
    	let t61;
    	let br9;
    	let t62;
    	let br10;
    	let t63;
    	let br11;
    	let t64;
    	let br12;
    	let t65;
    	let br13;
    	let t66;
    	let br14;
    	let t67;
    	let h13;
    	let t68;
    	let t69;
    	let div22;
    	let p8;
    	let t70;
    	let t71;
    	let h14;
    	let t72;
    	let t73;
    	let div23;
    	let p9;
    	let t74;
    	let t75;
    	let h15;
    	let t76;
    	let t77;
    	let div24;
    	let p10;
    	let t78;
    	let br15;
    	let t79;
    	let br16;
    	let t80;
    	let br17;
    	let dispose;

    	return {
    		c() {
    			div15 = element("div");
    			div14 = element("div");
    			div0 = element("div");
    			t0 = text("Guardian Brother Equity Fund (GBH)");
    			t1 = space();
    			div13 = element("div");
    			div3 = element("div");
    			div1 = element("div");
    			t2 = text("Fund Asset");
    			t3 = space();
    			div2 = element("div");
    			t4 = text("$18.2k");
    			t5 = space();
    			div6 = element("div");
    			div4 = element("div");
    			t6 = text("Fund Strategy");
    			t7 = space();
    			div5 = element("div");
    			t8 = text("US Mid-Large Cap Stocks");
    			t9 = space();
    			div9 = element("div");
    			div7 = element("div");
    			t10 = text("NAV (Today)");
    			t11 = space();
    			div8 = element("div");
    			t12 = text("$");
    			t13 = text(/*navToday*/ ctx[0]);
    			t14 = space();
    			div12 = element("div");
    			div10 = element("div");
    			t15 = text("YTD Return");
    			t16 = space();
    			div11 = element("div");
    			t17 = text("$");
    			t18 = text(/*navReturn*/ ctx[1]);
    			t19 = space();
    			div18 = element("div");
    			div17 = element("div");
    			div16 = element("div");
    			a0 = element("a");
    			t20 = text("Overview");
    			t21 = space();
    			a1 = element("a");
    			t22 = text("Performance");
    			t23 = space();
    			a2 = element("a");
    			t24 = text("Fund Facts");
    			t25 = space();
    			a3 = element("a");
    			t26 = text("Holdings");
    			t27 = space();
    			a4 = element("a");
    			t28 = text("Portfolio Managers");
    			t29 = space();
    			a5 = element("a");
    			t30 = text("Fund & Expenses");
    			t31 = space();
    			div26 = element("div");
    			div25 = element("div");
    			h10 = element("h1");
    			t32 = text("Overview");
    			t33 = space();
    			div19 = element("div");
    			p0 = element("p");
    			t34 = text("We believe investing is about transparency, honesty, and accessibility\n        for all our investors at any time. We created this fund with the goal of\n        downside protection during market declines while seeking long term\n        capital appreciation. Our number one goal is to provide exceptional\n        returns while minimizing risk.");
    			t35 = space();
    			p1 = element("p");
    			t36 = text("Fund Strategy:\n        ");
    			br0 = element("br");
    			t37 = text("\n        • Fund Title Invest is mid-large cap U.S companies with long-term\n        competitive advantages and relevancy, quality management teams and\n        positive performance on fund’s criteria.\n        ");
    			br1 = element("br");
    			t38 = text("\n        • Our team focus in value investing. We only invest in companies that\n        have being rigorously monitored and have passed all our filters.\n        ");
    			br2 = element("br");
    			t39 = text("\n        • The fund seeks to be independent of the market’s conditions generating\n        income in any circumstances. Our main goal is to always be on top of the\n        markets.");
    			t40 = space();
    			p2 = element("p");
    			t41 = text("Risk\n        ");
    			br3 = element("br");
    			t42 = text("\n        • You may lose money by investing in the Fund. You should expect the\n        Fund's share price and total return to fluctuate within a wide range,\n        like the fluctuations of the overall stock market. The Fund's\n        performance could be hurt by: (read more)");
    			t43 = space();
    			i = element("i");
    			p3 = element("p");
    			t44 = text("Stock market risk: The chance that stock prices overall will decline.\n          Stock markets tend to move in cycles, with periods of rising prices\n          and periods of falling prices. Manager risk: The chance that, as a\n          result of poor security selection by the Advisor, the Fund may\n          underperform relative to benchmarks or other funds with similar\n          investment objectives. Investment style risk: The chance that returns\n          from the mix of small-, mid-, and large-cap stocks in the Fund's\n          portfolio will trail returns from the overall stock market.\n          Historically, small- and mid-cap stocks have been more volatile in\n          price than the large-cap stocks that dominate the overall stock\n          market, and they often perform quite differently. Additionally, from\n          time to time, growth stocks may be more volatile than the overall\n          stock market.");
    			t45 = space();
    			p4 = element("p");
    			t46 = text("Sector-focus risk: The chance that investing a significant portion of\n          the Fund’s assets in one sector of the market exposes the Fund to\n          greater market risk and potential monetary losses than if those assets\n          were spread among various sectors.");
    			t47 = space();
    			p5 = element("p");
    			t48 = text("Foreign securities risk: The chance that the value of foreign\n          securities will be adversely affected by the political and economic\n          environments and other overall economic conditions in the countries\n          where the Fund invests. Investing in foreign securities involves:\n          country risk, which is the chance that domestic events - such as\n          political upheaval, financial troubles, or natural disasters – will\n          weaken a country's securities markets; and currency risk, which is the\n          chance that the value of a foreign investment, measured in U.S.\n          dollars, will decrease because of unfavorable changes in currency\n          exchange rates. Small- and mid-cap stocks risk: The chance that small-\n          and mid-cap stocks may trade less frequently or in more limited volume\n          than those of larger, more established companies; may fluctuate in\n          value more; and, as a group, may suffer more severe price declines\n          during periods of generally declining stock prices.");
    			t49 = space();
    			h11 = element("h1");
    			t50 = text("Performance");
    			t51 = space();
    			div20 = element("div");
    			p6 = element("p");
    			t52 = text("This chart illustrates the performance of a hypothetical $10,000\n        investment in the Fund since its inception on 11/01/2004. Assumes\n        investment of dividends and capital gains, but does not reflect the\n        effect of any applicable sales charges or redemption fees. This chart\n        does not imply any future performance.");
    			t53 = space();
    			h12 = element("h1");
    			t54 = text("Fund Facts");
    			t55 = space();
    			div21 = element("div");
    			p7 = element("p");
    			t56 = text("• Fund Objective – Capital Appreciation and income\n        ");
    			br4 = element("br");
    			t57 = text("\n        • Fund Strategy – U.S Mid-Large Cap Long/Short Equity Fund\n        ");
    			br5 = element("br");
    			t58 = text("\n        • Ticker – FMB\n        ");
    			br6 = element("br");
    			t59 = text("\n        • Fund Asset – total fund’s assets\n        ");
    			br7 = element("br");
    			t60 = text("\n        • CUSIP – Not yet\n        ");
    			br8 = element("br");
    			t61 = text("\n        • Distribution Frequency – Quarterly\n        ");
    			br9 = element("br");
    			t62 = text("\n        • Minimum Initial Investment - $500\n        ");
    			br10 = element("br");
    			t63 = text("\n        • Minimum Subsequent Investment - $50\n        ");
    			br11 = element("br");
    			t64 = text("\n        • Gross Expense Ratio – 0.50%\n        ");
    			br12 = element("br");
    			t65 = text("\n        • NAV – of the current date\n        ");
    			br13 = element("br");
    			t66 = text("\n        • NAV Change from prior day -\n        ");
    			br14 = element("br");
    			t67 = space();
    			h13 = element("h1");
    			t68 = text("Holdings");
    			t69 = space();
    			div22 = element("div");
    			p8 = element("p");
    			t70 = text("Work in progress.");
    			t71 = space();
    			h14 = element("h1");
    			t72 = text("Portfolio Managers");
    			t73 = space();
    			div23 = element("div");
    			p9 = element("p");
    			t74 = text("Fernando Guardia Virreira is President and Portfolio Manager of FMB.\n        SEC-Registered investment advisor CRD- 305744");
    			t75 = space();
    			h15 = element("h1");
    			t76 = text("Fund & Expenses");
    			t77 = space();
    			div24 = element("div");
    			p10 = element("p");
    			t78 = text("Management Fee – 1% (Investment entry fee)\n        ");
    			br15 = element("br");
    			t79 = text("\n        Expense Ratio – 0.50% (Annual expense fee)\n        ");
    			br16 = element("br");
    			t80 = text("\n        Performance fees - 10% over return (quarterly)\n        ");
    			br17 = element("br");
    			this.h();
    		},
    		l(nodes) {
    			div15 = claim_element(nodes, "DIV", { class: true });
    			var div15_nodes = children(div15);
    			div14 = claim_element(div15_nodes, "DIV", { class: true, style: true });
    			var div14_nodes = children(div14);
    			div0 = claim_element(div14_nodes, "DIV", { style: true });
    			var div0_nodes = children(div0);
    			t0 = claim_text(div0_nodes, "Guardian Brother Equity Fund (GBH)");
    			div0_nodes.forEach(detach);
    			t1 = claim_space(div14_nodes);
    			div13 = claim_element(div14_nodes, "DIV", { style: true });
    			var div13_nodes = children(div13);
    			div3 = claim_element(div13_nodes, "DIV", {});
    			var div3_nodes = children(div3);
    			div1 = claim_element(div3_nodes, "DIV", {});
    			var div1_nodes = children(div1);
    			t2 = claim_text(div1_nodes, "Fund Asset");
    			div1_nodes.forEach(detach);
    			t3 = claim_space(div3_nodes);
    			div2 = claim_element(div3_nodes, "DIV", {});
    			var div2_nodes = children(div2);
    			t4 = claim_text(div2_nodes, "$18.2k");
    			div2_nodes.forEach(detach);
    			div3_nodes.forEach(detach);
    			t5 = claim_space(div13_nodes);
    			div6 = claim_element(div13_nodes, "DIV", {});
    			var div6_nodes = children(div6);
    			div4 = claim_element(div6_nodes, "DIV", {});
    			var div4_nodes = children(div4);
    			t6 = claim_text(div4_nodes, "Fund Strategy");
    			div4_nodes.forEach(detach);
    			t7 = claim_space(div6_nodes);
    			div5 = claim_element(div6_nodes, "DIV", {});
    			var div5_nodes = children(div5);
    			t8 = claim_text(div5_nodes, "US Mid-Large Cap Stocks");
    			div5_nodes.forEach(detach);
    			div6_nodes.forEach(detach);
    			t9 = claim_space(div13_nodes);
    			div9 = claim_element(div13_nodes, "DIV", {});
    			var div9_nodes = children(div9);
    			div7 = claim_element(div9_nodes, "DIV", {});
    			var div7_nodes = children(div7);
    			t10 = claim_text(div7_nodes, "NAV (Today)");
    			div7_nodes.forEach(detach);
    			t11 = claim_space(div9_nodes);
    			div8 = claim_element(div9_nodes, "DIV", {});
    			var div8_nodes = children(div8);
    			t12 = claim_text(div8_nodes, "$");
    			t13 = claim_text(div8_nodes, /*navToday*/ ctx[0]);
    			div8_nodes.forEach(detach);
    			div9_nodes.forEach(detach);
    			t14 = claim_space(div13_nodes);
    			div12 = claim_element(div13_nodes, "DIV", {});
    			var div12_nodes = children(div12);
    			div10 = claim_element(div12_nodes, "DIV", {});
    			var div10_nodes = children(div10);
    			t15 = claim_text(div10_nodes, "YTD Return");
    			div10_nodes.forEach(detach);
    			t16 = claim_space(div12_nodes);
    			div11 = claim_element(div12_nodes, "DIV", {});
    			var div11_nodes = children(div11);
    			t17 = claim_text(div11_nodes, "$");
    			t18 = claim_text(div11_nodes, /*navReturn*/ ctx[1]);
    			div11_nodes.forEach(detach);
    			div12_nodes.forEach(detach);
    			div13_nodes.forEach(detach);
    			div14_nodes.forEach(detach);
    			div15_nodes.forEach(detach);
    			t19 = claim_space(nodes);
    			div18 = claim_element(nodes, "DIV", { class: true });
    			var div18_nodes = children(div18);
    			div17 = claim_element(div18_nodes, "DIV", { class: true, style: true });
    			var div17_nodes = children(div17);
    			div16 = claim_element(div17_nodes, "DIV", { style: true });
    			var div16_nodes = children(div16);
    			a0 = claim_element(div16_nodes, "A", { href: true });
    			var a0_nodes = children(a0);
    			t20 = claim_text(a0_nodes, "Overview");
    			a0_nodes.forEach(detach);
    			t21 = claim_space(div16_nodes);
    			a1 = claim_element(div16_nodes, "A", { href: true });
    			var a1_nodes = children(a1);
    			t22 = claim_text(a1_nodes, "Performance");
    			a1_nodes.forEach(detach);
    			t23 = claim_space(div16_nodes);
    			a2 = claim_element(div16_nodes, "A", { href: true });
    			var a2_nodes = children(a2);
    			t24 = claim_text(a2_nodes, "Fund Facts");
    			a2_nodes.forEach(detach);
    			t25 = claim_space(div16_nodes);
    			a3 = claim_element(div16_nodes, "A", { href: true });
    			var a3_nodes = children(a3);
    			t26 = claim_text(a3_nodes, "Holdings");
    			a3_nodes.forEach(detach);
    			t27 = claim_space(div16_nodes);
    			a4 = claim_element(div16_nodes, "A", { href: true });
    			var a4_nodes = children(a4);
    			t28 = claim_text(a4_nodes, "Portfolio Managers");
    			a4_nodes.forEach(detach);
    			t29 = claim_space(div16_nodes);
    			a5 = claim_element(div16_nodes, "A", { href: true });
    			var a5_nodes = children(a5);
    			t30 = claim_text(a5_nodes, "Fund & Expenses");
    			a5_nodes.forEach(detach);
    			div16_nodes.forEach(detach);
    			div17_nodes.forEach(detach);
    			div18_nodes.forEach(detach);
    			t31 = claim_space(nodes);
    			div26 = claim_element(nodes, "DIV", { class: true });
    			var div26_nodes = children(div26);
    			div25 = claim_element(div26_nodes, "DIV", { class: true });
    			var div25_nodes = children(div25);
    			h10 = claim_element(div25_nodes, "H1", { id: true });
    			var h10_nodes = children(h10);
    			t32 = claim_text(h10_nodes, "Overview");
    			h10_nodes.forEach(detach);
    			t33 = claim_space(div25_nodes);
    			div19 = claim_element(div25_nodes, "DIV", { class: true });
    			var div19_nodes = children(div19);
    			p0 = claim_element(div19_nodes, "P", {});
    			var p0_nodes = children(p0);
    			t34 = claim_text(p0_nodes, "We believe investing is about transparency, honesty, and accessibility\n        for all our investors at any time. We created this fund with the goal of\n        downside protection during market declines while seeking long term\n        capital appreciation. Our number one goal is to provide exceptional\n        returns while minimizing risk.");
    			p0_nodes.forEach(detach);
    			t35 = claim_space(div19_nodes);
    			p1 = claim_element(div19_nodes, "P", {});
    			var p1_nodes = children(p1);
    			t36 = claim_text(p1_nodes, "Fund Strategy:\n        ");
    			br0 = claim_element(p1_nodes, "BR", {});
    			t37 = claim_text(p1_nodes, "\n        • Fund Title Invest is mid-large cap U.S companies with long-term\n        competitive advantages and relevancy, quality management teams and\n        positive performance on fund’s criteria.\n        ");
    			br1 = claim_element(p1_nodes, "BR", {});
    			t38 = claim_text(p1_nodes, "\n        • Our team focus in value investing. We only invest in companies that\n        have being rigorously monitored and have passed all our filters.\n        ");
    			br2 = claim_element(p1_nodes, "BR", {});
    			t39 = claim_text(p1_nodes, "\n        • The fund seeks to be independent of the market’s conditions generating\n        income in any circumstances. Our main goal is to always be on top of the\n        markets.");
    			p1_nodes.forEach(detach);
    			t40 = claim_space(div19_nodes);
    			p2 = claim_element(div19_nodes, "P", {});
    			var p2_nodes = children(p2);
    			t41 = claim_text(p2_nodes, "Risk\n        ");
    			br3 = claim_element(p2_nodes, "BR", {});
    			t42 = claim_text(p2_nodes, "\n        • You may lose money by investing in the Fund. You should expect the\n        Fund's share price and total return to fluctuate within a wide range,\n        like the fluctuations of the overall stock market. The Fund's\n        performance could be hurt by: (read more)");
    			p2_nodes.forEach(detach);
    			t43 = claim_space(div19_nodes);
    			i = claim_element(div19_nodes, "I", {});
    			var i_nodes = children(i);
    			p3 = claim_element(i_nodes, "P", {});
    			var p3_nodes = children(p3);
    			t44 = claim_text(p3_nodes, "Stock market risk: The chance that stock prices overall will decline.\n          Stock markets tend to move in cycles, with periods of rising prices\n          and periods of falling prices. Manager risk: The chance that, as a\n          result of poor security selection by the Advisor, the Fund may\n          underperform relative to benchmarks or other funds with similar\n          investment objectives. Investment style risk: The chance that returns\n          from the mix of small-, mid-, and large-cap stocks in the Fund's\n          portfolio will trail returns from the overall stock market.\n          Historically, small- and mid-cap stocks have been more volatile in\n          price than the large-cap stocks that dominate the overall stock\n          market, and they often perform quite differently. Additionally, from\n          time to time, growth stocks may be more volatile than the overall\n          stock market.");
    			p3_nodes.forEach(detach);
    			t45 = claim_space(i_nodes);
    			p4 = claim_element(i_nodes, "P", {});
    			var p4_nodes = children(p4);
    			t46 = claim_text(p4_nodes, "Sector-focus risk: The chance that investing a significant portion of\n          the Fund’s assets in one sector of the market exposes the Fund to\n          greater market risk and potential monetary losses than if those assets\n          were spread among various sectors.");
    			p4_nodes.forEach(detach);
    			t47 = claim_space(i_nodes);
    			p5 = claim_element(i_nodes, "P", {});
    			var p5_nodes = children(p5);
    			t48 = claim_text(p5_nodes, "Foreign securities risk: The chance that the value of foreign\n          securities will be adversely affected by the political and economic\n          environments and other overall economic conditions in the countries\n          where the Fund invests. Investing in foreign securities involves:\n          country risk, which is the chance that domestic events - such as\n          political upheaval, financial troubles, or natural disasters – will\n          weaken a country's securities markets; and currency risk, which is the\n          chance that the value of a foreign investment, measured in U.S.\n          dollars, will decrease because of unfavorable changes in currency\n          exchange rates. Small- and mid-cap stocks risk: The chance that small-\n          and mid-cap stocks may trade less frequently or in more limited volume\n          than those of larger, more established companies; may fluctuate in\n          value more; and, as a group, may suffer more severe price declines\n          during periods of generally declining stock prices.");
    			p5_nodes.forEach(detach);
    			i_nodes.forEach(detach);
    			div19_nodes.forEach(detach);
    			t49 = claim_space(div25_nodes);
    			h11 = claim_element(div25_nodes, "H1", { id: true });
    			var h11_nodes = children(h11);
    			t50 = claim_text(h11_nodes, "Performance");
    			h11_nodes.forEach(detach);
    			t51 = claim_space(div25_nodes);
    			div20 = claim_element(div25_nodes, "DIV", { class: true });
    			var div20_nodes = children(div20);
    			p6 = claim_element(div20_nodes, "P", {});
    			var p6_nodes = children(p6);
    			t52 = claim_text(p6_nodes, "This chart illustrates the performance of a hypothetical $10,000\n        investment in the Fund since its inception on 11/01/2004. Assumes\n        investment of dividends and capital gains, but does not reflect the\n        effect of any applicable sales charges or redemption fees. This chart\n        does not imply any future performance.");
    			p6_nodes.forEach(detach);
    			div20_nodes.forEach(detach);
    			t53 = claim_space(div25_nodes);
    			h12 = claim_element(div25_nodes, "H1", { id: true });
    			var h12_nodes = children(h12);
    			t54 = claim_text(h12_nodes, "Fund Facts");
    			h12_nodes.forEach(detach);
    			t55 = claim_space(div25_nodes);
    			div21 = claim_element(div25_nodes, "DIV", { class: true });
    			var div21_nodes = children(div21);
    			p7 = claim_element(div21_nodes, "P", {});
    			var p7_nodes = children(p7);
    			t56 = claim_text(p7_nodes, "• Fund Objective – Capital Appreciation and income\n        ");
    			br4 = claim_element(p7_nodes, "BR", {});
    			t57 = claim_text(p7_nodes, "\n        • Fund Strategy – U.S Mid-Large Cap Long/Short Equity Fund\n        ");
    			br5 = claim_element(p7_nodes, "BR", {});
    			t58 = claim_text(p7_nodes, "\n        • Ticker – FMB\n        ");
    			br6 = claim_element(p7_nodes, "BR", {});
    			t59 = claim_text(p7_nodes, "\n        • Fund Asset – total fund’s assets\n        ");
    			br7 = claim_element(p7_nodes, "BR", {});
    			t60 = claim_text(p7_nodes, "\n        • CUSIP – Not yet\n        ");
    			br8 = claim_element(p7_nodes, "BR", {});
    			t61 = claim_text(p7_nodes, "\n        • Distribution Frequency – Quarterly\n        ");
    			br9 = claim_element(p7_nodes, "BR", {});
    			t62 = claim_text(p7_nodes, "\n        • Minimum Initial Investment - $500\n        ");
    			br10 = claim_element(p7_nodes, "BR", {});
    			t63 = claim_text(p7_nodes, "\n        • Minimum Subsequent Investment - $50\n        ");
    			br11 = claim_element(p7_nodes, "BR", {});
    			t64 = claim_text(p7_nodes, "\n        • Gross Expense Ratio – 0.50%\n        ");
    			br12 = claim_element(p7_nodes, "BR", {});
    			t65 = claim_text(p7_nodes, "\n        • NAV – of the current date\n        ");
    			br13 = claim_element(p7_nodes, "BR", {});
    			t66 = claim_text(p7_nodes, "\n        • NAV Change from prior day -\n        ");
    			br14 = claim_element(p7_nodes, "BR", {});
    			p7_nodes.forEach(detach);
    			div21_nodes.forEach(detach);
    			t67 = claim_space(div25_nodes);
    			h13 = claim_element(div25_nodes, "H1", { id: true });
    			var h13_nodes = children(h13);
    			t68 = claim_text(h13_nodes, "Holdings");
    			h13_nodes.forEach(detach);
    			t69 = claim_space(div25_nodes);
    			div22 = claim_element(div25_nodes, "DIV", { class: true });
    			var div22_nodes = children(div22);
    			p8 = claim_element(div22_nodes, "P", {});
    			var p8_nodes = children(p8);
    			t70 = claim_text(p8_nodes, "Work in progress.");
    			p8_nodes.forEach(detach);
    			div22_nodes.forEach(detach);
    			t71 = claim_space(div25_nodes);
    			h14 = claim_element(div25_nodes, "H1", { id: true });
    			var h14_nodes = children(h14);
    			t72 = claim_text(h14_nodes, "Portfolio Managers");
    			h14_nodes.forEach(detach);
    			t73 = claim_space(div25_nodes);
    			div23 = claim_element(div25_nodes, "DIV", { class: true });
    			var div23_nodes = children(div23);
    			p9 = claim_element(div23_nodes, "P", {});
    			var p9_nodes = children(p9);
    			t74 = claim_text(p9_nodes, "Fernando Guardia Virreira is President and Portfolio Manager of FMB.\n        SEC-Registered investment advisor CRD- 305744");
    			p9_nodes.forEach(detach);
    			div23_nodes.forEach(detach);
    			t75 = claim_space(div25_nodes);
    			h15 = claim_element(div25_nodes, "H1", { id: true });
    			var h15_nodes = children(h15);
    			t76 = claim_text(h15_nodes, "Fund & Expenses");
    			h15_nodes.forEach(detach);
    			t77 = claim_space(div25_nodes);
    			div24 = claim_element(div25_nodes, "DIV", { class: true });
    			var div24_nodes = children(div24);
    			p10 = claim_element(div24_nodes, "P", {});
    			var p10_nodes = children(p10);
    			t78 = claim_text(p10_nodes, "Management Fee – 1% (Investment entry fee)\n        ");
    			br15 = claim_element(p10_nodes, "BR", {});
    			t79 = claim_text(p10_nodes, "\n        Expense Ratio – 0.50% (Annual expense fee)\n        ");
    			br16 = claim_element(p10_nodes, "BR", {});
    			t80 = claim_text(p10_nodes, "\n        Performance fees - 10% over return (quarterly)\n        ");
    			br17 = claim_element(p10_nodes, "BR", {});
    			p10_nodes.forEach(detach);
    			div24_nodes.forEach(detach);
    			div25_nodes.forEach(detach);
    			div26_nodes.forEach(detach);
    			this.h();
    		},
    		h() {
    			set_style(div0, "margin-top", "25px");
    			set_style(div0, "margin-bottom", "25px");
    			set_style(div13, "display", "flex");
    			set_style(div13, "flex-direction", "row");
    			set_style(div13, "justify-content", "space-between");
    			attr(div14, "class", "pageContainerInner");
    			set_style(div14, "color", "#ffffff");
    			set_style(div14, "font-size", "22px");
    			set_style(div14, "height", "400px");
    			attr(div15, "class", "pageContainerTop");
    			attr(a0, "href", "javascript:void(0)");
    			attr(a1, "href", "javascript:void(0)");
    			attr(a2, "href", "javascript:void(0)");
    			attr(a3, "href", "javascript:void(0)");
    			attr(a4, "href", "javascript:void(0)");
    			attr(a5, "href", "javascript:void(0)");
    			set_style(div16, "display", "flex");
    			set_style(div16, "flex-direction", "row");
    			set_style(div16, "justify-content", "space-between");
    			attr(div17, "class", "pageContainerInner");
    			set_style(div17, "color", "#000000");
    			set_style(div17, "font-size", "22px");
    			set_style(div17, "min-height", "auto");
    			attr(div18, "class", "pageContainerMiddle");
    			attr(h10, "id", "sectionOverview");
    			attr(div19, "class", "textBlock");
    			attr(h11, "id", "sectionPerformance");
    			attr(div20, "class", "textBlock");
    			attr(h12, "id", "sectionFundFacts");
    			attr(div21, "class", "textBlock");
    			attr(h13, "id", "sectionHoldings");
    			attr(div22, "class", "textBlock");
    			attr(h14, "id", "sectionPortfolioManagers");
    			attr(div23, "class", "textBlock");
    			attr(h15, "id", "sectionFundAndExpenses");
    			attr(div24, "class", "textBlock");
    			attr(div25, "class", "pageContainerInner");
    			attr(div26, "class", "pageContainer");
    		},
    		m(target, anchor) {
    			insert(target, div15, anchor);
    			append(div15, div14);
    			append(div14, div0);
    			append(div0, t0);
    			append(div14, t1);
    			append(div14, div13);
    			append(div13, div3);
    			append(div3, div1);
    			append(div1, t2);
    			append(div3, t3);
    			append(div3, div2);
    			append(div2, t4);
    			append(div13, t5);
    			append(div13, div6);
    			append(div6, div4);
    			append(div4, t6);
    			append(div6, t7);
    			append(div6, div5);
    			append(div5, t8);
    			append(div13, t9);
    			append(div13, div9);
    			append(div9, div7);
    			append(div7, t10);
    			append(div9, t11);
    			append(div9, div8);
    			append(div8, t12);
    			append(div8, t13);
    			append(div13, t14);
    			append(div13, div12);
    			append(div12, div10);
    			append(div10, t15);
    			append(div12, t16);
    			append(div12, div11);
    			append(div11, t17);
    			append(div11, t18);
    			insert(target, t19, anchor);
    			insert(target, div18, anchor);
    			append(div18, div17);
    			append(div17, div16);
    			append(div16, a0);
    			append(a0, t20);
    			append(div16, t21);
    			append(div16, a1);
    			append(a1, t22);
    			append(div16, t23);
    			append(div16, a2);
    			append(a2, t24);
    			append(div16, t25);
    			append(div16, a3);
    			append(a3, t26);
    			append(div16, t27);
    			append(div16, a4);
    			append(a4, t28);
    			append(div16, t29);
    			append(div16, a5);
    			append(a5, t30);
    			insert(target, t31, anchor);
    			insert(target, div26, anchor);
    			append(div26, div25);
    			append(div25, h10);
    			append(h10, t32);
    			append(div25, t33);
    			append(div25, div19);
    			append(div19, p0);
    			append(p0, t34);
    			append(div19, t35);
    			append(div19, p1);
    			append(p1, t36);
    			append(p1, br0);
    			append(p1, t37);
    			append(p1, br1);
    			append(p1, t38);
    			append(p1, br2);
    			append(p1, t39);
    			append(div19, t40);
    			append(div19, p2);
    			append(p2, t41);
    			append(p2, br3);
    			append(p2, t42);
    			append(div19, t43);
    			append(div19, i);
    			append(i, p3);
    			append(p3, t44);
    			append(i, t45);
    			append(i, p4);
    			append(p4, t46);
    			append(i, t47);
    			append(i, p5);
    			append(p5, t48);
    			append(div25, t49);
    			append(div25, h11);
    			append(h11, t50);
    			append(div25, t51);
    			append(div25, div20);
    			append(div20, p6);
    			append(p6, t52);
    			append(div25, t53);
    			append(div25, h12);
    			append(h12, t54);
    			append(div25, t55);
    			append(div25, div21);
    			append(div21, p7);
    			append(p7, t56);
    			append(p7, br4);
    			append(p7, t57);
    			append(p7, br5);
    			append(p7, t58);
    			append(p7, br6);
    			append(p7, t59);
    			append(p7, br7);
    			append(p7, t60);
    			append(p7, br8);
    			append(p7, t61);
    			append(p7, br9);
    			append(p7, t62);
    			append(p7, br10);
    			append(p7, t63);
    			append(p7, br11);
    			append(p7, t64);
    			append(p7, br12);
    			append(p7, t65);
    			append(p7, br13);
    			append(p7, t66);
    			append(p7, br14);
    			append(div25, t67);
    			append(div25, h13);
    			append(h13, t68);
    			append(div25, t69);
    			append(div25, div22);
    			append(div22, p8);
    			append(p8, t70);
    			append(div25, t71);
    			append(div25, h14);
    			append(h14, t72);
    			append(div25, t73);
    			append(div25, div23);
    			append(div23, p9);
    			append(p9, t74);
    			append(div25, t75);
    			append(div25, h15);
    			append(h15, t76);
    			append(div25, t77);
    			append(div25, div24);
    			append(div24, p10);
    			append(p10, t78);
    			append(p10, br15);
    			append(p10, t79);
    			append(p10, br16);
    			append(p10, t80);
    			append(p10, br17);

    			dispose = [
    				listen(a0, "click", /*click_handler*/ ctx[3]),
    				listen(a1, "click", /*click_handler_1*/ ctx[4]),
    				listen(a2, "click", /*click_handler_2*/ ctx[5]),
    				listen(a3, "click", /*click_handler_3*/ ctx[6]),
    				listen(a4, "click", /*click_handler_4*/ ctx[7]),
    				listen(a5, "click", /*click_handler_5*/ ctx[8])
    			];
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(div15);
    			if (detaching) detach(t19);
    			if (detaching) detach(div18);
    			if (detaching) detach(t31);
    			if (detaching) detach(div26);
    			run_all(dispose);
    		}
    	};
    }

    function goToSection(section) {
    	document.getElementById(section).scrollIntoView({
    		behavior: "smooth",
    		block: "start",
    		inline: "nearest"
    	});
    }

    function instance$4($$self) {
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
    	const click_handler = () => goToSection("sectionOverview");
    	const click_handler_1 = () => goToSection("sectionPerformance");
    	const click_handler_2 = () => goToSection("sectionFundFacts");
    	const click_handler_3 = () => goToSection("sectionHoldings");
    	const click_handler_4 = () => goToSection("sectionPortfolioManagers");
    	const click_handler_5 = () => goToSection("sectionFundAndExpenses");

    	return [
    		navToday,
    		navReturn,
    		navArray,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		click_handler_5
    	];
    }

    class Funds extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});
    	}
    }

    /* src\routes\Insights.svelte generated by Svelte v3.18.1 */

    function create_fragment$5(ctx) {
    	let div1;
    	let div0;
    	let t0;
    	let div4;
    	let div3;
    	let h1;
    	let t1;
    	let t2;
    	let div2;
    	let p;
    	let t3;

    	return {
    		c() {
    			div1 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div4 = element("div");
    			div3 = element("div");
    			h1 = element("h1");
    			t1 = text("Insights");
    			t2 = space();
    			div2 = element("div");
    			p = element("p");
    			t3 = text("Insights page");
    			this.h();
    		},
    		l(nodes) {
    			div1 = claim_element(nodes, "DIV", { class: true });
    			var div1_nodes = children(div1);
    			div0 = claim_element(div1_nodes, "DIV", { class: true, style: true });
    			children(div0).forEach(detach);
    			div1_nodes.forEach(detach);
    			t0 = claim_space(nodes);
    			div4 = claim_element(nodes, "DIV", { class: true });
    			var div4_nodes = children(div4);
    			div3 = claim_element(div4_nodes, "DIV", { class: true });
    			var div3_nodes = children(div3);
    			h1 = claim_element(div3_nodes, "H1", {});
    			var h1_nodes = children(h1);
    			t1 = claim_text(h1_nodes, "Insights");
    			h1_nodes.forEach(detach);
    			t2 = claim_space(div3_nodes);
    			div2 = claim_element(div3_nodes, "DIV", { class: true });
    			var div2_nodes = children(div2);
    			p = claim_element(div2_nodes, "P", {});
    			var p_nodes = children(p);
    			t3 = claim_text(p_nodes, "Insights page");
    			p_nodes.forEach(detach);
    			div2_nodes.forEach(detach);
    			div3_nodes.forEach(detach);
    			div4_nodes.forEach(detach);
    			this.h();
    		},
    		h() {
    			attr(div0, "class", "pageContainerInner");
    			set_style(div0, "color", "#ffffff");
    			set_style(div0, "font-size", "22px");
    			set_style(div0, "height", "400px");
    			attr(div1, "class", "pageContainerTop");
    			attr(div2, "class", "textBlock");
    			attr(div3, "class", "pageContainerInner");
    			attr(div4, "class", "pageContainer");
    		},
    		m(target, anchor) {
    			insert(target, div1, anchor);
    			append(div1, div0);
    			insert(target, t0, anchor);
    			insert(target, div4, anchor);
    			append(div4, div3);
    			append(div3, h1);
    			append(h1, t1);
    			append(div3, t2);
    			append(div3, div2);
    			append(div2, p);
    			append(p, t3);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(div1);
    			if (detaching) detach(t0);
    			if (detaching) detach(div4);
    		}
    	};
    }

    class Insights extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, null, create_fragment$5, safe_not_equal, {});
    	}
    }

    /* src\routes\Strategies.svelte generated by Svelte v3.18.1 */

    function create_fragment$6(ctx) {
    	let div1;
    	let div0;
    	let t0;
    	let div4;
    	let div3;
    	let h1;
    	let t1;
    	let t2;
    	let div2;
    	let p;
    	let t3;

    	return {
    		c() {
    			div1 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div4 = element("div");
    			div3 = element("div");
    			h1 = element("h1");
    			t1 = text("Strategies");
    			t2 = space();
    			div2 = element("div");
    			p = element("p");
    			t3 = text("Strategies page");
    			this.h();
    		},
    		l(nodes) {
    			div1 = claim_element(nodes, "DIV", { class: true });
    			var div1_nodes = children(div1);
    			div0 = claim_element(div1_nodes, "DIV", { class: true, style: true });
    			children(div0).forEach(detach);
    			div1_nodes.forEach(detach);
    			t0 = claim_space(nodes);
    			div4 = claim_element(nodes, "DIV", { class: true });
    			var div4_nodes = children(div4);
    			div3 = claim_element(div4_nodes, "DIV", { class: true });
    			var div3_nodes = children(div3);
    			h1 = claim_element(div3_nodes, "H1", {});
    			var h1_nodes = children(h1);
    			t1 = claim_text(h1_nodes, "Strategies");
    			h1_nodes.forEach(detach);
    			t2 = claim_space(div3_nodes);
    			div2 = claim_element(div3_nodes, "DIV", { class: true });
    			var div2_nodes = children(div2);
    			p = claim_element(div2_nodes, "P", {});
    			var p_nodes = children(p);
    			t3 = claim_text(p_nodes, "Strategies page");
    			p_nodes.forEach(detach);
    			div2_nodes.forEach(detach);
    			div3_nodes.forEach(detach);
    			div4_nodes.forEach(detach);
    			this.h();
    		},
    		h() {
    			attr(div0, "class", "pageContainerInner");
    			set_style(div0, "color", "#ffffff");
    			set_style(div0, "font-size", "22px");
    			set_style(div0, "height", "400px");
    			attr(div1, "class", "pageContainerTop");
    			attr(div2, "class", "textBlock");
    			attr(div3, "class", "pageContainerInner");
    			attr(div4, "class", "pageContainer");
    		},
    		m(target, anchor) {
    			insert(target, div1, anchor);
    			append(div1, div0);
    			insert(target, t0, anchor);
    			insert(target, div4, anchor);
    			append(div4, div3);
    			append(div3, h1);
    			append(h1, t1);
    			append(div3, t2);
    			append(div3, div2);
    			append(div2, p);
    			append(p, t3);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(div1);
    			if (detaching) detach(t0);
    			if (detaching) detach(div4);
    		}
    	};
    }

    class Strategies extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, null, create_fragment$6, safe_not_equal, {});
    	}
    }

    /* src\routes\About.svelte generated by Svelte v3.18.1 */

    function create_fragment$7(ctx) {
    	let div1;
    	let div0;
    	let t0;
    	let div4;
    	let div3;
    	let h1;
    	let t1;
    	let t2;
    	let div2;
    	let p;
    	let t3;

    	return {
    		c() {
    			div1 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div4 = element("div");
    			div3 = element("div");
    			h1 = element("h1");
    			t1 = text("About");
    			t2 = space();
    			div2 = element("div");
    			p = element("p");
    			t3 = text("About page");
    			this.h();
    		},
    		l(nodes) {
    			div1 = claim_element(nodes, "DIV", { class: true });
    			var div1_nodes = children(div1);
    			div0 = claim_element(div1_nodes, "DIV", { class: true, style: true });
    			children(div0).forEach(detach);
    			div1_nodes.forEach(detach);
    			t0 = claim_space(nodes);
    			div4 = claim_element(nodes, "DIV", { class: true });
    			var div4_nodes = children(div4);
    			div3 = claim_element(div4_nodes, "DIV", { class: true });
    			var div3_nodes = children(div3);
    			h1 = claim_element(div3_nodes, "H1", {});
    			var h1_nodes = children(h1);
    			t1 = claim_text(h1_nodes, "About");
    			h1_nodes.forEach(detach);
    			t2 = claim_space(div3_nodes);
    			div2 = claim_element(div3_nodes, "DIV", { class: true });
    			var div2_nodes = children(div2);
    			p = claim_element(div2_nodes, "P", {});
    			var p_nodes = children(p);
    			t3 = claim_text(p_nodes, "About page");
    			p_nodes.forEach(detach);
    			div2_nodes.forEach(detach);
    			div3_nodes.forEach(detach);
    			div4_nodes.forEach(detach);
    			this.h();
    		},
    		h() {
    			attr(div0, "class", "pageContainerInner");
    			set_style(div0, "color", "#ffffff");
    			set_style(div0, "font-size", "22px");
    			set_style(div0, "height", "400px");
    			attr(div1, "class", "pageContainerTop");
    			attr(div2, "class", "textBlock");
    			attr(div3, "class", "pageContainerInner");
    			attr(div4, "class", "pageContainer");
    		},
    		m(target, anchor) {
    			insert(target, div1, anchor);
    			append(div1, div0);
    			insert(target, t0, anchor);
    			insert(target, div4, anchor);
    			append(div4, div3);
    			append(div3, h1);
    			append(h1, t1);
    			append(div3, t2);
    			append(div3, div2);
    			append(div2, p);
    			append(p, t3);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(div1);
    			if (detaching) detach(t0);
    			if (detaching) detach(div4);
    		}
    	};
    }

    class About extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, null, create_fragment$7, safe_not_equal, {});
    	}
    }

    /* src\routes\Contact.svelte generated by Svelte v3.18.1 */

    function create_fragment$8(ctx) {
    	let div1;
    	let div0;
    	let t0;
    	let div4;
    	let div3;
    	let h1;
    	let t1;
    	let t2;
    	let div2;
    	let p;
    	let t3;

    	return {
    		c() {
    			div1 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div4 = element("div");
    			div3 = element("div");
    			h1 = element("h1");
    			t1 = text("Contact");
    			t2 = space();
    			div2 = element("div");
    			p = element("p");
    			t3 = text("Contact page");
    			this.h();
    		},
    		l(nodes) {
    			div1 = claim_element(nodes, "DIV", { class: true });
    			var div1_nodes = children(div1);
    			div0 = claim_element(div1_nodes, "DIV", { class: true, style: true });
    			children(div0).forEach(detach);
    			div1_nodes.forEach(detach);
    			t0 = claim_space(nodes);
    			div4 = claim_element(nodes, "DIV", { class: true });
    			var div4_nodes = children(div4);
    			div3 = claim_element(div4_nodes, "DIV", { class: true });
    			var div3_nodes = children(div3);
    			h1 = claim_element(div3_nodes, "H1", {});
    			var h1_nodes = children(h1);
    			t1 = claim_text(h1_nodes, "Contact");
    			h1_nodes.forEach(detach);
    			t2 = claim_space(div3_nodes);
    			div2 = claim_element(div3_nodes, "DIV", { class: true });
    			var div2_nodes = children(div2);
    			p = claim_element(div2_nodes, "P", {});
    			var p_nodes = children(p);
    			t3 = claim_text(p_nodes, "Contact page");
    			p_nodes.forEach(detach);
    			div2_nodes.forEach(detach);
    			div3_nodes.forEach(detach);
    			div4_nodes.forEach(detach);
    			this.h();
    		},
    		h() {
    			attr(div0, "class", "pageContainerInner");
    			set_style(div0, "color", "#ffffff");
    			set_style(div0, "font-size", "22px");
    			set_style(div0, "height", "400px");
    			attr(div1, "class", "pageContainerTop");
    			attr(div2, "class", "textBlock");
    			attr(div3, "class", "pageContainerInner");
    			attr(div4, "class", "pageContainer");
    		},
    		m(target, anchor) {
    			insert(target, div1, anchor);
    			append(div1, div0);
    			insert(target, t0, anchor);
    			insert(target, div4, anchor);
    			append(div4, div3);
    			append(div3, h1);
    			append(h1, t1);
    			append(div3, t2);
    			append(div3, div2);
    			append(div2, p);
    			append(p, t3);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(div1);
    			if (detaching) detach(t0);
    			if (detaching) detach(div4);
    		}
    	};
    }

    class Contact extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, null, create_fragment$8, safe_not_equal, {});
    	}
    }

    /* src\App.svelte generated by Svelte v3.18.1 */

    function create_default_slot_6(ctx) {
    	let img;
    	let img_src_value;
    	let t0;
    	let div2;
    	let div0;
    	let t1;
    	let t2;
    	let div1;
    	let t3;

    	return {
    		c() {
    			img = element("img");
    			t0 = space();
    			div2 = element("div");
    			div0 = element("div");
    			t1 = text("Guardian Brothers Holdings");
    			t2 = space();
    			div1 = element("div");
    			t3 = text("Invest in your future");
    			this.h();
    		},
    		l(nodes) {
    			img = claim_element(nodes, "IMG", {
    				style: true,
    				class: true,
    				alt: true,
    				src: true
    			});

    			t0 = claim_space(nodes);
    			div2 = claim_element(nodes, "DIV", { style: true });
    			var div2_nodes = children(div2);
    			div0 = claim_element(div2_nodes, "DIV", { style: true });
    			var div0_nodes = children(div0);
    			t1 = claim_text(div0_nodes, "Guardian Brothers Holdings");
    			div0_nodes.forEach(detach);
    			t2 = claim_space(div2_nodes);
    			div1 = claim_element(div2_nodes, "DIV", { style: true });
    			var div1_nodes = children(div1);
    			t3 = claim_text(div1_nodes, "Invest in your future");
    			div1_nodes.forEach(detach);
    			div2_nodes.forEach(detach);
    			this.h();
    		},
    		h() {
    			set_style(img, "margin-right", "10px");
    			attr(img, "class", "logo");
    			attr(img, "alt", "");
    			if (img.src !== (img_src_value = "/images/logo.svg")) attr(img, "src", img_src_value);
    			set_style(div0, "font-size", "36px");
    			set_style(div1, "font-size", "22px");
    			set_style(div2, "display", "flex");
    			set_style(div2, "flex-direction", "column");
    			set_style(div2, "justify-content", "center");
    		},
    		m(target, anchor) {
    			insert(target, img, anchor);
    			insert(target, t0, anchor);
    			insert(target, div2, anchor);
    			append(div2, div0);
    			append(div0, t1);
    			append(div2, t2);
    			append(div2, div1);
    			append(div1, t3);
    		},
    		d(detaching) {
    			if (detaching) detach(img);
    			if (detaching) detach(t0);
    			if (detaching) detach(div2);
    		}
    	};
    }

    // (80:14) <NavLink to="/">
    function create_default_slot_5(ctx) {
    	let t;

    	return {
    		c() {
    			t = text("Funds");
    		},
    		l(nodes) {
    			t = claim_text(nodes, "Funds");
    		},
    		m(target, anchor) {
    			insert(target, t, anchor);
    		},
    		d(detaching) {
    			if (detaching) detach(t);
    		}
    	};
    }

    // (81:14) <NavLink to="insights">
    function create_default_slot_4(ctx) {
    	let t;

    	return {
    		c() {
    			t = text("Insights");
    		},
    		l(nodes) {
    			t = claim_text(nodes, "Insights");
    		},
    		m(target, anchor) {
    			insert(target, t, anchor);
    		},
    		d(detaching) {
    			if (detaching) detach(t);
    		}
    	};
    }

    // (82:14) <NavLink to="strategies">
    function create_default_slot_3(ctx) {
    	let t;

    	return {
    		c() {
    			t = text("Strategies");
    		},
    		l(nodes) {
    			t = claim_text(nodes, "Strategies");
    		},
    		m(target, anchor) {
    			insert(target, t, anchor);
    		},
    		d(detaching) {
    			if (detaching) detach(t);
    		}
    	};
    }

    // (83:14) <NavLink to="about">
    function create_default_slot_2(ctx) {
    	let t;

    	return {
    		c() {
    			t = text("About");
    		},
    		l(nodes) {
    			t = claim_text(nodes, "About");
    		},
    		m(target, anchor) {
    			insert(target, t, anchor);
    		},
    		d(detaching) {
    			if (detaching) detach(t);
    		}
    	};
    }

    // (84:14) <NavLink to="contact">
    function create_default_slot_1(ctx) {
    	let t;

    	return {
    		c() {
    			t = text("Contact");
    		},
    		l(nodes) {
    			t = claim_text(nodes, "Contact");
    		},
    		m(target, anchor) {
    			insert(target, t, anchor);
    		},
    		d(detaching) {
    			if (detaching) detach(t);
    		}
    	};
    }

    // (32:0) <Router {url}>
    function create_default_slot$1(ctx) {
    	let div7;
    	let nav;
    	let div5;
    	let div4;
    	let div0;
    	let t0;
    	let div3;
    	let div1;
    	let a0;
    	let img0;
    	let img0_src_value;
    	let t1;
    	let a1;
    	let img1;
    	let img1_src_value;
    	let t2;
    	let a2;
    	let img2;
    	let img2_src_value;
    	let t3;
    	let div2;
    	let t4;
    	let t5;
    	let t6;
    	let t7;
    	let t8;
    	let t9;
    	let t10;
    	let t11;
    	let t12;
    	let t13;
    	let div6;
    	let t14;
    	let current;

    	const navlink0 = new NavLink({
    			props: {
    				to: "/",
    				$$slots: { default: [create_default_slot_6] },
    				$$scope: { ctx }
    			}
    		});

    	const navlink1 = new NavLink({
    			props: {
    				to: "/",
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			}
    		});

    	const navlink2 = new NavLink({
    			props: {
    				to: "insights",
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			}
    		});

    	const navlink3 = new NavLink({
    			props: {
    				to: "strategies",
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			}
    		});

    	const navlink4 = new NavLink({
    			props: {
    				to: "about",
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			}
    		});

    	const navlink5 = new NavLink({
    			props: {
    				to: "contact",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			}
    		});

    	const route0 = new Route({ props: { path: "/", component: Funds } });

    	const route1 = new Route({
    			props: { path: "insights", component: Insights }
    		});

    	const route2 = new Route({
    			props: {
    				path: "strategies",
    				component: Strategies
    			}
    		});

    	const route3 = new Route({
    			props: { path: "about", component: About }
    		});

    	const route4 = new Route({
    			props: { path: "contact", component: Contact }
    		});

    	return {
    		c() {
    			div7 = element("div");
    			nav = element("nav");
    			div5 = element("div");
    			div4 = element("div");
    			div0 = element("div");
    			create_component(navlink0.$$.fragment);
    			t0 = space();
    			div3 = element("div");
    			div1 = element("div");
    			a0 = element("a");
    			img0 = element("img");
    			t1 = space();
    			a1 = element("a");
    			img1 = element("img");
    			t2 = space();
    			a2 = element("a");
    			img2 = element("img");
    			t3 = space();
    			div2 = element("div");
    			create_component(navlink1.$$.fragment);
    			t4 = space();
    			create_component(navlink2.$$.fragment);
    			t5 = space();
    			create_component(navlink3.$$.fragment);
    			t6 = space();
    			create_component(navlink4.$$.fragment);
    			t7 = space();
    			create_component(navlink5.$$.fragment);
    			t8 = space();
    			create_component(route0.$$.fragment);
    			t9 = space();
    			create_component(route1.$$.fragment);
    			t10 = space();
    			create_component(route2.$$.fragment);
    			t11 = space();
    			create_component(route3.$$.fragment);
    			t12 = space();
    			create_component(route4.$$.fragment);
    			t13 = space();
    			div6 = element("div");
    			t14 = text("Copyright © 2020 Guardian Brothers Holdings Inc.");
    			this.h();
    		},
    		l(nodes) {
    			div7 = claim_element(nodes, "DIV", { class: true });
    			var div7_nodes = children(div7);
    			nav = claim_element(div7_nodes, "NAV", {});
    			var nav_nodes = children(nav);
    			div5 = claim_element(nav_nodes, "DIV", { class: true });
    			var div5_nodes = children(div5);
    			div4 = claim_element(div5_nodes, "DIV", { class: true });
    			var div4_nodes = children(div4);
    			div0 = claim_element(div4_nodes, "DIV", { class: true });
    			var div0_nodes = children(div0);
    			claim_component(navlink0.$$.fragment, div0_nodes);
    			div0_nodes.forEach(detach);
    			t0 = claim_space(div4_nodes);
    			div3 = claim_element(div4_nodes, "DIV", { style: true });
    			var div3_nodes = children(div3);
    			div1 = claim_element(div3_nodes, "DIV", { class: true });
    			var div1_nodes = children(div1);
    			a0 = claim_element(div1_nodes, "A", { target: true, href: true });
    			var a0_nodes = children(a0);
    			img0 = claim_element(a0_nodes, "IMG", { class: true, alt: true, src: true });
    			a0_nodes.forEach(detach);
    			t1 = claim_space(div1_nodes);
    			a1 = claim_element(div1_nodes, "A", { target: true, href: true });
    			var a1_nodes = children(a1);
    			img1 = claim_element(a1_nodes, "IMG", { class: true, alt: true, src: true });
    			a1_nodes.forEach(detach);
    			t2 = claim_space(div1_nodes);
    			a2 = claim_element(div1_nodes, "A", { target: true, href: true });
    			var a2_nodes = children(a2);
    			img2 = claim_element(a2_nodes, "IMG", { class: true, alt: true, src: true });
    			a2_nodes.forEach(detach);
    			div1_nodes.forEach(detach);
    			t3 = claim_space(div3_nodes);
    			div2 = claim_element(div3_nodes, "DIV", { class: true });
    			var div2_nodes = children(div2);
    			claim_component(navlink1.$$.fragment, div2_nodes);
    			t4 = claim_space(div2_nodes);
    			claim_component(navlink2.$$.fragment, div2_nodes);
    			t5 = claim_space(div2_nodes);
    			claim_component(navlink3.$$.fragment, div2_nodes);
    			t6 = claim_space(div2_nodes);
    			claim_component(navlink4.$$.fragment, div2_nodes);
    			t7 = claim_space(div2_nodes);
    			claim_component(navlink5.$$.fragment, div2_nodes);
    			div2_nodes.forEach(detach);
    			div3_nodes.forEach(detach);
    			div4_nodes.forEach(detach);
    			div5_nodes.forEach(detach);
    			nav_nodes.forEach(detach);
    			t8 = claim_space(div7_nodes);
    			claim_component(route0.$$.fragment, div7_nodes);
    			t9 = claim_space(div7_nodes);
    			claim_component(route1.$$.fragment, div7_nodes);
    			t10 = claim_space(div7_nodes);
    			claim_component(route2.$$.fragment, div7_nodes);
    			t11 = claim_space(div7_nodes);
    			claim_component(route3.$$.fragment, div7_nodes);
    			t12 = claim_space(div7_nodes);
    			claim_component(route4.$$.fragment, div7_nodes);
    			t13 = claim_space(div7_nodes);
    			div6 = claim_element(div7_nodes, "DIV", { class: true });
    			var div6_nodes = children(div6);
    			t14 = claim_text(div6_nodes, "Copyright © 2020 Guardian Brothers Holdings Inc.");
    			div6_nodes.forEach(detach);
    			div7_nodes.forEach(detach);
    			this.h();
    		},
    		h() {
    			attr(div0, "class", "navTitle");
    			attr(img0, "class", "socialIcon");
    			attr(img0, "alt", "linkedin");
    			if (img0.src !== (img0_src_value = "images/linkedin.svg")) attr(img0, "src", img0_src_value);
    			attr(a0, "target", "_blank");
    			attr(a0, "href", "https://www.linkedin.com/guardianbrothers/");
    			attr(img1, "class", "socialIcon");
    			attr(img1, "alt", "twitter");
    			if (img1.src !== (img1_src_value = "images/twitter.svg")) attr(img1, "src", img1_src_value);
    			attr(a1, "target", "_blank");
    			attr(a1, "href", "https://www.twitter.com/guardianbrothers/");
    			attr(img2, "class", "socialIcon");
    			attr(img2, "alt", "bandcamp");
    			if (img2.src !== (img2_src_value = "images/facebook.svg")) attr(img2, "src", img2_src_value);
    			attr(a2, "target", "_blank");
    			attr(a2, "href", "https://www.facebook.com/guardianbrothers/");
    			attr(div1, "class", "navSocial");
    			attr(div2, "class", "navLinks");
    			set_style(div3, "display", "flex");
    			set_style(div3, "flex-direction", "column");
    			set_style(div3, "justify-content", "center");
    			set_style(div3, "align-items", "flex-end");
    			attr(div4, "class", "navContainerInner");
    			attr(div5, "class", "navContainer");
    			attr(div6, "class", "footer");
    			attr(div7, "class", "container");
    		},
    		m(target, anchor) {
    			insert(target, div7, anchor);
    			append(div7, nav);
    			append(nav, div5);
    			append(div5, div4);
    			append(div4, div0);
    			mount_component(navlink0, div0, null);
    			append(div4, t0);
    			append(div4, div3);
    			append(div3, div1);
    			append(div1, a0);
    			append(a0, img0);
    			append(div1, t1);
    			append(div1, a1);
    			append(a1, img1);
    			append(div1, t2);
    			append(div1, a2);
    			append(a2, img2);
    			append(div3, t3);
    			append(div3, div2);
    			mount_component(navlink1, div2, null);
    			append(div2, t4);
    			mount_component(navlink2, div2, null);
    			append(div2, t5);
    			mount_component(navlink3, div2, null);
    			append(div2, t6);
    			mount_component(navlink4, div2, null);
    			append(div2, t7);
    			mount_component(navlink5, div2, null);
    			append(div7, t8);
    			mount_component(route0, div7, null);
    			append(div7, t9);
    			mount_component(route1, div7, null);
    			append(div7, t10);
    			mount_component(route2, div7, null);
    			append(div7, t11);
    			mount_component(route3, div7, null);
    			append(div7, t12);
    			mount_component(route4, div7, null);
    			append(div7, t13);
    			append(div7, div6);
    			append(div6, t14);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const navlink0_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				navlink0_changes.$$scope = { dirty, ctx };
    			}

    			navlink0.$set(navlink0_changes);
    			const navlink1_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				navlink1_changes.$$scope = { dirty, ctx };
    			}

    			navlink1.$set(navlink1_changes);
    			const navlink2_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				navlink2_changes.$$scope = { dirty, ctx };
    			}

    			navlink2.$set(navlink2_changes);
    			const navlink3_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				navlink3_changes.$$scope = { dirty, ctx };
    			}

    			navlink3.$set(navlink3_changes);
    			const navlink4_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				navlink4_changes.$$scope = { dirty, ctx };
    			}

    			navlink4.$set(navlink4_changes);
    			const navlink5_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				navlink5_changes.$$scope = { dirty, ctx };
    			}

    			navlink5.$set(navlink5_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(navlink0.$$.fragment, local);
    			transition_in(navlink1.$$.fragment, local);
    			transition_in(navlink2.$$.fragment, local);
    			transition_in(navlink3.$$.fragment, local);
    			transition_in(navlink4.$$.fragment, local);
    			transition_in(navlink5.$$.fragment, local);
    			transition_in(route0.$$.fragment, local);
    			transition_in(route1.$$.fragment, local);
    			transition_in(route2.$$.fragment, local);
    			transition_in(route3.$$.fragment, local);
    			transition_in(route4.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(navlink0.$$.fragment, local);
    			transition_out(navlink1.$$.fragment, local);
    			transition_out(navlink2.$$.fragment, local);
    			transition_out(navlink3.$$.fragment, local);
    			transition_out(navlink4.$$.fragment, local);
    			transition_out(navlink5.$$.fragment, local);
    			transition_out(route0.$$.fragment, local);
    			transition_out(route1.$$.fragment, local);
    			transition_out(route2.$$.fragment, local);
    			transition_out(route3.$$.fragment, local);
    			transition_out(route4.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(div7);
    			destroy_component(navlink0);
    			destroy_component(navlink1);
    			destroy_component(navlink2);
    			destroy_component(navlink3);
    			destroy_component(navlink4);
    			destroy_component(navlink5);
    			destroy_component(route0);
    			destroy_component(route1);
    			destroy_component(route2);
    			destroy_component(route3);
    			destroy_component(route4);
    		}
    	};
    }

    function create_fragment$9(ctx) {
    	let head;
    	let meta0;
    	let t0;
    	let title;
    	let t1;
    	let t2;
    	let meta1;
    	let t3;
    	let meta2;
    	let t4;
    	let meta3;
    	let t5;
    	let meta4;
    	let t6;
    	let meta5;
    	let t7;
    	let meta6;
    	let t8;
    	let meta7;
    	let t9;
    	let meta8;
    	let t10;
    	let meta9;
    	let t11;
    	let current;

    	const router = new Router({
    			props: {
    				url: /*url*/ ctx[0],
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			head = element("head");
    			meta0 = element("meta");
    			t0 = space();
    			title = element("title");
    			t1 = text("Guardian Brothers Holdings Inc.");
    			t2 = space();
    			meta1 = element("meta");
    			t3 = space();
    			meta2 = element("meta");
    			t4 = space();
    			meta3 = element("meta");
    			t5 = space();
    			meta4 = element("meta");
    			t6 = space();
    			meta5 = element("meta");
    			t7 = space();
    			meta6 = element("meta");
    			t8 = space();
    			meta7 = element("meta");
    			t9 = space();
    			meta8 = element("meta");
    			t10 = space();
    			meta9 = element("meta");
    			t11 = space();
    			create_component(router.$$.fragment);
    			this.h();
    		},
    		l(nodes) {
    			head = claim_element(nodes, "HEAD", {});
    			var head_nodes = children(head);
    			meta0 = claim_element(head_nodes, "META", { name: true, content: true });
    			t0 = claim_space(head_nodes);
    			title = claim_element(head_nodes, "TITLE", {});
    			var title_nodes = children(title);
    			t1 = claim_text(title_nodes, "Guardian Brothers Holdings Inc.");
    			title_nodes.forEach(detach);
    			t2 = claim_space(head_nodes);
    			meta1 = claim_element(head_nodes, "META", { charset: true });
    			t3 = claim_space(head_nodes);
    			meta2 = claim_element(head_nodes, "META", { name: true, content: true });
    			t4 = claim_space(head_nodes);
    			meta3 = claim_element(head_nodes, "META", { name: true, content: true });
    			t5 = claim_space(head_nodes);
    			meta4 = claim_element(head_nodes, "META", { property: true, content: true });
    			t6 = claim_space(head_nodes);
    			meta5 = claim_element(head_nodes, "META", { property: true, content: true });
    			t7 = claim_space(head_nodes);
    			meta6 = claim_element(head_nodes, "META", { property: true, content: true });
    			t8 = claim_space(head_nodes);
    			meta7 = claim_element(head_nodes, "META", { property: true, content: true });
    			t9 = claim_space(head_nodes);
    			meta8 = claim_element(head_nodes, "META", { name: true, content: true });
    			t10 = claim_space(head_nodes);
    			meta9 = claim_element(head_nodes, "META", { name: true, content: true });
    			head_nodes.forEach(detach);
    			t11 = claim_space(nodes);
    			claim_component(router.$$.fragment, nodes);
    			this.h();
    		},
    		h() {
    			attr(meta0, "name", "viewport");
    			attr(meta0, "content", "width=device-width, initial-scale=1.0, maximum-scale=1.0,\n    user-scalable=0");
    			attr(meta1, "charset", "utf-8");
    			attr(meta2, "name", "description");
    			attr(meta2, "content", "Guardian Brothers Holdings Inc.");
    			attr(meta3, "name", "author");
    			attr(meta3, "content", "Chris Aitken");
    			attr(meta4, "property", "og:url");
    			attr(meta4, "content", "guardianbrothers.com");
    			attr(meta5, "property", "og:type");
    			attr(meta5, "content", "website");
    			attr(meta6, "property", "og:title");
    			attr(meta6, "content", "Guardian Brothers Holdings Inc.");
    			attr(meta7, "property", "og:description");
    			attr(meta7, "content", "Guardian Brothers Holdings Inc.");
    			attr(meta8, "name", "apple-mobile-web-app-title");
    			attr(meta8, "content", "Guardian Brothers Holdings Inc.");
    			attr(meta9, "name", "application-name");
    			attr(meta9, "content", "Guardian Brothers Holdings Inc.");
    		},
    		m(target, anchor) {
    			insert(target, head, anchor);
    			append(head, meta0);
    			append(head, t0);
    			append(head, title);
    			append(title, t1);
    			append(head, t2);
    			append(head, meta1);
    			append(head, t3);
    			append(head, meta2);
    			append(head, t4);
    			append(head, meta3);
    			append(head, t5);
    			append(head, meta4);
    			append(head, t6);
    			append(head, meta5);
    			append(head, t7);
    			append(head, meta6);
    			append(head, t8);
    			append(head, meta7);
    			append(head, t9);
    			append(head, meta8);
    			append(head, t10);
    			append(head, meta9);
    			insert(target, t11, anchor);
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p(ctx, [dirty]) {
    			const router_changes = {};
    			if (dirty & /*url*/ 1) router_changes.url = /*url*/ ctx[0];

    			if (dirty & /*$$scope*/ 2) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(head);
    			if (detaching) detach(t11);
    			destroy_component(router, detaching);
    		}
    	};
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { url = "" } = $$props;

    	$$self.$set = $$props => {
    		if ("url" in $$props) $$invalidate(0, url = $$props.url);
    	};

    	return [url];
    }

    class App extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$5, create_fragment$9, safe_not_equal, { url: 0 });
    	}
    }

    new App({
      target: document.getElementById("app"),
      hydrate: true
    });

}());
//# sourceMappingURL=bundle.js.map
