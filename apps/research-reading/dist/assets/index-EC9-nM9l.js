const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./ResearchDocumentEditor-C86Msm8q.js","./ResearchDocumentEditor-CjJV65_g.css"])))=>i.map(i=>d[i]);
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) return;
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) processPreload(link);
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") continue;
      for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
    }
  }).observe(document, {
    childList: true,
    subtree: true
  });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep) return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
var jsxRuntime = { exports: {} };
var reactJsxRuntime_production = {};
var hasRequiredReactJsxRuntime_production;
function requireReactJsxRuntime_production() {
  if (hasRequiredReactJsxRuntime_production) return reactJsxRuntime_production;
  hasRequiredReactJsxRuntime_production = 1;
  var REACT_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.transitional.element"), REACT_FRAGMENT_TYPE = /* @__PURE__ */ Symbol.for("react.fragment");
  function jsxProd(type, config, maybeKey) {
    var key = null;
    void 0 !== maybeKey && (key = "" + maybeKey);
    void 0 !== config.key && (key = "" + config.key);
    if ("key" in config) {
      maybeKey = {};
      for (var propName in config)
        "key" !== propName && (maybeKey[propName] = config[propName]);
    } else maybeKey = config;
    config = maybeKey.ref;
    return {
      $$typeof: REACT_ELEMENT_TYPE,
      type,
      key,
      ref: void 0 !== config ? config : null,
      props: maybeKey
    };
  }
  reactJsxRuntime_production.Fragment = REACT_FRAGMENT_TYPE;
  reactJsxRuntime_production.jsx = jsxProd;
  reactJsxRuntime_production.jsxs = jsxProd;
  return reactJsxRuntime_production;
}
var hasRequiredJsxRuntime;
function requireJsxRuntime() {
  if (hasRequiredJsxRuntime) return jsxRuntime.exports;
  hasRequiredJsxRuntime = 1;
  {
    jsxRuntime.exports = requireReactJsxRuntime_production();
  }
  return jsxRuntime.exports;
}
var jsxRuntimeExports = requireJsxRuntime();
var react = { exports: {} };
var react_production = {};
var hasRequiredReact_production;
function requireReact_production() {
  if (hasRequiredReact_production) return react_production;
  hasRequiredReact_production = 1;
  var REACT_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = /* @__PURE__ */ Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = /* @__PURE__ */ Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = /* @__PURE__ */ Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = /* @__PURE__ */ Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = /* @__PURE__ */ Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = /* @__PURE__ */ Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = /* @__PURE__ */ Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = /* @__PURE__ */ Symbol.for("react.suspense"), REACT_MEMO_TYPE = /* @__PURE__ */ Symbol.for("react.memo"), REACT_LAZY_TYPE = /* @__PURE__ */ Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = /* @__PURE__ */ Symbol.for("react.activity"), MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
  function getIteratorFn(maybeIterable) {
    if (null === maybeIterable || "object" !== typeof maybeIterable) return null;
    maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
    return "function" === typeof maybeIterable ? maybeIterable : null;
  }
  var ReactNoopUpdateQueue = {
    isMounted: function() {
      return false;
    },
    enqueueForceUpdate: function() {
    },
    enqueueReplaceState: function() {
    },
    enqueueSetState: function() {
    }
  }, assign = Object.assign, emptyObject = {};
  function Component(props, context, updater) {
    this.props = props;
    this.context = context;
    this.refs = emptyObject;
    this.updater = updater || ReactNoopUpdateQueue;
  }
  Component.prototype.isReactComponent = {};
  Component.prototype.setState = function(partialState, callback) {
    if ("object" !== typeof partialState && "function" !== typeof partialState && null != partialState)
      throw Error(
        "takes an object of state variables to update or a function which returns an object of state variables."
      );
    this.updater.enqueueSetState(this, partialState, callback, "setState");
  };
  Component.prototype.forceUpdate = function(callback) {
    this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
  };
  function ComponentDummy() {
  }
  ComponentDummy.prototype = Component.prototype;
  function PureComponent(props, context, updater) {
    this.props = props;
    this.context = context;
    this.refs = emptyObject;
    this.updater = updater || ReactNoopUpdateQueue;
  }
  var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
  pureComponentPrototype.constructor = PureComponent;
  assign(pureComponentPrototype, Component.prototype);
  pureComponentPrototype.isPureReactComponent = true;
  var isArrayImpl = Array.isArray;
  function noop() {
  }
  var ReactSharedInternals = { H: null, A: null, T: null, S: null }, hasOwnProperty = Object.prototype.hasOwnProperty;
  function ReactElement(type, key, props) {
    var refProp = props.ref;
    return {
      $$typeof: REACT_ELEMENT_TYPE,
      type,
      key,
      ref: void 0 !== refProp ? refProp : null,
      props
    };
  }
  function cloneAndReplaceKey(oldElement, newKey) {
    return ReactElement(oldElement.type, newKey, oldElement.props);
  }
  function isValidElement(object) {
    return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
  }
  function escape(key) {
    var escaperLookup = { "=": "=0", ":": "=2" };
    return "$" + key.replace(/[=:]/g, function(match) {
      return escaperLookup[match];
    });
  }
  var userProvidedKeyEscapeRegex = /\/+/g;
  function getElementKey(element, index) {
    return "object" === typeof element && null !== element && null != element.key ? escape("" + element.key) : index.toString(36);
  }
  function resolveThenable(thenable) {
    switch (thenable.status) {
      case "fulfilled":
        return thenable.value;
      case "rejected":
        throw thenable.reason;
      default:
        switch ("string" === typeof thenable.status ? thenable.then(noop, noop) : (thenable.status = "pending", thenable.then(
          function(fulfilledValue) {
            "pending" === thenable.status && (thenable.status = "fulfilled", thenable.value = fulfilledValue);
          },
          function(error) {
            "pending" === thenable.status && (thenable.status = "rejected", thenable.reason = error);
          }
        )), thenable.status) {
          case "fulfilled":
            return thenable.value;
          case "rejected":
            throw thenable.reason;
        }
    }
    throw thenable;
  }
  function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
    var type = typeof children;
    if ("undefined" === type || "boolean" === type) children = null;
    var invokeCallback = false;
    if (null === children) invokeCallback = true;
    else
      switch (type) {
        case "bigint":
        case "string":
        case "number":
          invokeCallback = true;
          break;
        case "object":
          switch (children.$$typeof) {
            case REACT_ELEMENT_TYPE:
            case REACT_PORTAL_TYPE:
              invokeCallback = true;
              break;
            case REACT_LAZY_TYPE:
              return invokeCallback = children._init, mapIntoArray(
                invokeCallback(children._payload),
                array,
                escapedPrefix,
                nameSoFar,
                callback
              );
          }
      }
    if (invokeCallback)
      return callback = callback(children), invokeCallback = "" === nameSoFar ? "." + getElementKey(children, 0) : nameSoFar, isArrayImpl(callback) ? (escapedPrefix = "", null != invokeCallback && (escapedPrefix = invokeCallback.replace(userProvidedKeyEscapeRegex, "$&/") + "/"), mapIntoArray(callback, array, escapedPrefix, "", function(c) {
        return c;
      })) : null != callback && (isValidElement(callback) && (callback = cloneAndReplaceKey(
        callback,
        escapedPrefix + (null == callback.key || children && children.key === callback.key ? "" : ("" + callback.key).replace(
          userProvidedKeyEscapeRegex,
          "$&/"
        ) + "/") + invokeCallback
      )), array.push(callback)), 1;
    invokeCallback = 0;
    var nextNamePrefix = "" === nameSoFar ? "." : nameSoFar + ":";
    if (isArrayImpl(children))
      for (var i = 0; i < children.length; i++)
        nameSoFar = children[i], type = nextNamePrefix + getElementKey(nameSoFar, i), invokeCallback += mapIntoArray(
          nameSoFar,
          array,
          escapedPrefix,
          type,
          callback
        );
    else if (i = getIteratorFn(children), "function" === typeof i)
      for (children = i.call(children), i = 0; !(nameSoFar = children.next()).done; )
        nameSoFar = nameSoFar.value, type = nextNamePrefix + getElementKey(nameSoFar, i++), invokeCallback += mapIntoArray(
          nameSoFar,
          array,
          escapedPrefix,
          type,
          callback
        );
    else if ("object" === type) {
      if ("function" === typeof children.then)
        return mapIntoArray(
          resolveThenable(children),
          array,
          escapedPrefix,
          nameSoFar,
          callback
        );
      array = String(children);
      throw Error(
        "Objects are not valid as a React child (found: " + ("[object Object]" === array ? "object with keys {" + Object.keys(children).join(", ") + "}" : array) + "). If you meant to render a collection of children, use an array instead."
      );
    }
    return invokeCallback;
  }
  function mapChildren(children, func, context) {
    if (null == children) return children;
    var result = [], count = 0;
    mapIntoArray(children, result, "", "", function(child) {
      return func.call(context, child, count++);
    });
    return result;
  }
  function lazyInitializer(payload) {
    if (-1 === payload._status) {
      var ctor = payload._result;
      ctor = ctor();
      ctor.then(
        function(moduleObject) {
          if (0 === payload._status || -1 === payload._status)
            payload._status = 1, payload._result = moduleObject;
        },
        function(error) {
          if (0 === payload._status || -1 === payload._status)
            payload._status = 2, payload._result = error;
        }
      );
      -1 === payload._status && (payload._status = 0, payload._result = ctor);
    }
    if (1 === payload._status) return payload._result.default;
    throw payload._result;
  }
  var reportGlobalError = "function" === typeof reportError ? reportError : function(error) {
    if ("object" === typeof window && "function" === typeof window.ErrorEvent) {
      var event = new window.ErrorEvent("error", {
        bubbles: true,
        cancelable: true,
        message: "object" === typeof error && null !== error && "string" === typeof error.message ? String(error.message) : String(error),
        error
      });
      if (!window.dispatchEvent(event)) return;
    } else if ("object" === typeof process && "function" === typeof process.emit) {
      process.emit("uncaughtException", error);
      return;
    }
    console.error(error);
  }, Children = {
    map: mapChildren,
    forEach: function(children, forEachFunc, forEachContext) {
      mapChildren(
        children,
        function() {
          forEachFunc.apply(this, arguments);
        },
        forEachContext
      );
    },
    count: function(children) {
      var n = 0;
      mapChildren(children, function() {
        n++;
      });
      return n;
    },
    toArray: function(children) {
      return mapChildren(children, function(child) {
        return child;
      }) || [];
    },
    only: function(children) {
      if (!isValidElement(children))
        throw Error(
          "React.Children.only expected to receive a single React element child."
        );
      return children;
    }
  };
  react_production.Activity = REACT_ACTIVITY_TYPE;
  react_production.Children = Children;
  react_production.Component = Component;
  react_production.Fragment = REACT_FRAGMENT_TYPE;
  react_production.Profiler = REACT_PROFILER_TYPE;
  react_production.PureComponent = PureComponent;
  react_production.StrictMode = REACT_STRICT_MODE_TYPE;
  react_production.Suspense = REACT_SUSPENSE_TYPE;
  react_production.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ReactSharedInternals;
  react_production.__COMPILER_RUNTIME = {
    __proto__: null,
    c: function(size) {
      return ReactSharedInternals.H.useMemoCache(size);
    }
  };
  react_production.cache = function(fn) {
    return function() {
      return fn.apply(null, arguments);
    };
  };
  react_production.cacheSignal = function() {
    return null;
  };
  react_production.cloneElement = function(element, config, children) {
    if (null === element || void 0 === element)
      throw Error(
        "The argument must be a React element, but you passed " + element + "."
      );
    var props = assign({}, element.props), key = element.key;
    if (null != config)
      for (propName in void 0 !== config.key && (key = "" + config.key), config)
        !hasOwnProperty.call(config, propName) || "key" === propName || "__self" === propName || "__source" === propName || "ref" === propName && void 0 === config.ref || (props[propName] = config[propName]);
    var propName = arguments.length - 2;
    if (1 === propName) props.children = children;
    else if (1 < propName) {
      for (var childArray = Array(propName), i = 0; i < propName; i++)
        childArray[i] = arguments[i + 2];
      props.children = childArray;
    }
    return ReactElement(element.type, key, props);
  };
  react_production.createContext = function(defaultValue) {
    defaultValue = {
      $$typeof: REACT_CONTEXT_TYPE,
      _currentValue: defaultValue,
      _currentValue2: defaultValue,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    };
    defaultValue.Provider = defaultValue;
    defaultValue.Consumer = {
      $$typeof: REACT_CONSUMER_TYPE,
      _context: defaultValue
    };
    return defaultValue;
  };
  react_production.createElement = function(type, config, children) {
    var propName, props = {}, key = null;
    if (null != config)
      for (propName in void 0 !== config.key && (key = "" + config.key), config)
        hasOwnProperty.call(config, propName) && "key" !== propName && "__self" !== propName && "__source" !== propName && (props[propName] = config[propName]);
    var childrenLength = arguments.length - 2;
    if (1 === childrenLength) props.children = children;
    else if (1 < childrenLength) {
      for (var childArray = Array(childrenLength), i = 0; i < childrenLength; i++)
        childArray[i] = arguments[i + 2];
      props.children = childArray;
    }
    if (type && type.defaultProps)
      for (propName in childrenLength = type.defaultProps, childrenLength)
        void 0 === props[propName] && (props[propName] = childrenLength[propName]);
    return ReactElement(type, key, props);
  };
  react_production.createRef = function() {
    return { current: null };
  };
  react_production.forwardRef = function(render) {
    return { $$typeof: REACT_FORWARD_REF_TYPE, render };
  };
  react_production.isValidElement = isValidElement;
  react_production.lazy = function(ctor) {
    return {
      $$typeof: REACT_LAZY_TYPE,
      _payload: { _status: -1, _result: ctor },
      _init: lazyInitializer
    };
  };
  react_production.memo = function(type, compare) {
    return {
      $$typeof: REACT_MEMO_TYPE,
      type,
      compare: void 0 === compare ? null : compare
    };
  };
  react_production.startTransition = function(scope) {
    var prevTransition = ReactSharedInternals.T, currentTransition = {};
    ReactSharedInternals.T = currentTransition;
    try {
      var returnValue = scope(), onStartTransitionFinish = ReactSharedInternals.S;
      null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
      "object" === typeof returnValue && null !== returnValue && "function" === typeof returnValue.then && returnValue.then(noop, reportGlobalError);
    } catch (error) {
      reportGlobalError(error);
    } finally {
      null !== prevTransition && null !== currentTransition.types && (prevTransition.types = currentTransition.types), ReactSharedInternals.T = prevTransition;
    }
  };
  react_production.unstable_useCacheRefresh = function() {
    return ReactSharedInternals.H.useCacheRefresh();
  };
  react_production.use = function(usable) {
    return ReactSharedInternals.H.use(usable);
  };
  react_production.useActionState = function(action, initialState, permalink) {
    return ReactSharedInternals.H.useActionState(action, initialState, permalink);
  };
  react_production.useCallback = function(callback, deps) {
    return ReactSharedInternals.H.useCallback(callback, deps);
  };
  react_production.useContext = function(Context) {
    return ReactSharedInternals.H.useContext(Context);
  };
  react_production.useDebugValue = function() {
  };
  react_production.useDeferredValue = function(value, initialValue) {
    return ReactSharedInternals.H.useDeferredValue(value, initialValue);
  };
  react_production.useEffect = function(create, deps) {
    return ReactSharedInternals.H.useEffect(create, deps);
  };
  react_production.useEffectEvent = function(callback) {
    return ReactSharedInternals.H.useEffectEvent(callback);
  };
  react_production.useId = function() {
    return ReactSharedInternals.H.useId();
  };
  react_production.useImperativeHandle = function(ref, create, deps) {
    return ReactSharedInternals.H.useImperativeHandle(ref, create, deps);
  };
  react_production.useInsertionEffect = function(create, deps) {
    return ReactSharedInternals.H.useInsertionEffect(create, deps);
  };
  react_production.useLayoutEffect = function(create, deps) {
    return ReactSharedInternals.H.useLayoutEffect(create, deps);
  };
  react_production.useMemo = function(create, deps) {
    return ReactSharedInternals.H.useMemo(create, deps);
  };
  react_production.useOptimistic = function(passthrough, reducer) {
    return ReactSharedInternals.H.useOptimistic(passthrough, reducer);
  };
  react_production.useReducer = function(reducer, initialArg, init) {
    return ReactSharedInternals.H.useReducer(reducer, initialArg, init);
  };
  react_production.useRef = function(initialValue) {
    return ReactSharedInternals.H.useRef(initialValue);
  };
  react_production.useState = function(initialState) {
    return ReactSharedInternals.H.useState(initialState);
  };
  react_production.useSyncExternalStore = function(subscribe, getSnapshot, getServerSnapshot) {
    return ReactSharedInternals.H.useSyncExternalStore(
      subscribe,
      getSnapshot,
      getServerSnapshot
    );
  };
  react_production.useTransition = function() {
    return ReactSharedInternals.H.useTransition();
  };
  react_production.version = "19.2.7";
  return react_production;
}
var hasRequiredReact;
function requireReact() {
  if (hasRequiredReact) return react.exports;
  hasRequiredReact = 1;
  {
    react.exports = requireReact_production();
  }
  return react.exports;
}
var reactExports = requireReact();
var client = { exports: {} };
var reactDomClient_production = {};
var scheduler = { exports: {} };
var scheduler_production = {};
var hasRequiredScheduler_production;
function requireScheduler_production() {
  if (hasRequiredScheduler_production) return scheduler_production;
  hasRequiredScheduler_production = 1;
  (function(exports) {
    function push(heap, node) {
      var index = heap.length;
      heap.push(node);
      a: for (; 0 < index; ) {
        var parentIndex = index - 1 >>> 1, parent = heap[parentIndex];
        if (0 < compare(parent, node))
          heap[parentIndex] = node, heap[index] = parent, index = parentIndex;
        else break a;
      }
    }
    function peek(heap) {
      return 0 === heap.length ? null : heap[0];
    }
    function pop(heap) {
      if (0 === heap.length) return null;
      var first = heap[0], last = heap.pop();
      if (last !== first) {
        heap[0] = last;
        a: for (var index = 0, length = heap.length, halfLength = length >>> 1; index < halfLength; ) {
          var leftIndex = 2 * (index + 1) - 1, left = heap[leftIndex], rightIndex = leftIndex + 1, right = heap[rightIndex];
          if (0 > compare(left, last))
            rightIndex < length && 0 > compare(right, left) ? (heap[index] = right, heap[rightIndex] = last, index = rightIndex) : (heap[index] = left, heap[leftIndex] = last, index = leftIndex);
          else if (rightIndex < length && 0 > compare(right, last))
            heap[index] = right, heap[rightIndex] = last, index = rightIndex;
          else break a;
        }
      }
      return first;
    }
    function compare(a, b) {
      var diff = a.sortIndex - b.sortIndex;
      return 0 !== diff ? diff : a.id - b.id;
    }
    exports.unstable_now = void 0;
    if ("object" === typeof performance && "function" === typeof performance.now) {
      var localPerformance = performance;
      exports.unstable_now = function() {
        return localPerformance.now();
      };
    } else {
      var localDate = Date, initialTime = localDate.now();
      exports.unstable_now = function() {
        return localDate.now() - initialTime;
      };
    }
    var taskQueue = [], timerQueue = [], taskIdCounter = 1, currentTask = null, currentPriorityLevel = 3, isPerformingWork = false, isHostCallbackScheduled = false, isHostTimeoutScheduled = false, needsPaint = false, localSetTimeout = "function" === typeof setTimeout ? setTimeout : null, localClearTimeout = "function" === typeof clearTimeout ? clearTimeout : null, localSetImmediate = "undefined" !== typeof setImmediate ? setImmediate : null;
    function advanceTimers(currentTime) {
      for (var timer = peek(timerQueue); null !== timer; ) {
        if (null === timer.callback) pop(timerQueue);
        else if (timer.startTime <= currentTime)
          pop(timerQueue), timer.sortIndex = timer.expirationTime, push(taskQueue, timer);
        else break;
        timer = peek(timerQueue);
      }
    }
    function handleTimeout(currentTime) {
      isHostTimeoutScheduled = false;
      advanceTimers(currentTime);
      if (!isHostCallbackScheduled)
        if (null !== peek(taskQueue))
          isHostCallbackScheduled = true, isMessageLoopRunning || (isMessageLoopRunning = true, schedulePerformWorkUntilDeadline());
        else {
          var firstTimer = peek(timerQueue);
          null !== firstTimer && requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime);
        }
    }
    var isMessageLoopRunning = false, taskTimeoutID = -1, frameInterval = 5, startTime = -1;
    function shouldYieldToHost() {
      return needsPaint ? true : exports.unstable_now() - startTime < frameInterval ? false : true;
    }
    function performWorkUntilDeadline() {
      needsPaint = false;
      if (isMessageLoopRunning) {
        var currentTime = exports.unstable_now();
        startTime = currentTime;
        var hasMoreWork = true;
        try {
          a: {
            isHostCallbackScheduled = false;
            isHostTimeoutScheduled && (isHostTimeoutScheduled = false, localClearTimeout(taskTimeoutID), taskTimeoutID = -1);
            isPerformingWork = true;
            var previousPriorityLevel = currentPriorityLevel;
            try {
              b: {
                advanceTimers(currentTime);
                for (currentTask = peek(taskQueue); null !== currentTask && !(currentTask.expirationTime > currentTime && shouldYieldToHost()); ) {
                  var callback = currentTask.callback;
                  if ("function" === typeof callback) {
                    currentTask.callback = null;
                    currentPriorityLevel = currentTask.priorityLevel;
                    var continuationCallback = callback(
                      currentTask.expirationTime <= currentTime
                    );
                    currentTime = exports.unstable_now();
                    if ("function" === typeof continuationCallback) {
                      currentTask.callback = continuationCallback;
                      advanceTimers(currentTime);
                      hasMoreWork = true;
                      break b;
                    }
                    currentTask === peek(taskQueue) && pop(taskQueue);
                    advanceTimers(currentTime);
                  } else pop(taskQueue);
                  currentTask = peek(taskQueue);
                }
                if (null !== currentTask) hasMoreWork = true;
                else {
                  var firstTimer = peek(timerQueue);
                  null !== firstTimer && requestHostTimeout(
                    handleTimeout,
                    firstTimer.startTime - currentTime
                  );
                  hasMoreWork = false;
                }
              }
              break a;
            } finally {
              currentTask = null, currentPriorityLevel = previousPriorityLevel, isPerformingWork = false;
            }
            hasMoreWork = void 0;
          }
        } finally {
          hasMoreWork ? schedulePerformWorkUntilDeadline() : isMessageLoopRunning = false;
        }
      }
    }
    var schedulePerformWorkUntilDeadline;
    if ("function" === typeof localSetImmediate)
      schedulePerformWorkUntilDeadline = function() {
        localSetImmediate(performWorkUntilDeadline);
      };
    else if ("undefined" !== typeof MessageChannel) {
      var channel = new MessageChannel(), port = channel.port2;
      channel.port1.onmessage = performWorkUntilDeadline;
      schedulePerformWorkUntilDeadline = function() {
        port.postMessage(null);
      };
    } else
      schedulePerformWorkUntilDeadline = function() {
        localSetTimeout(performWorkUntilDeadline, 0);
      };
    function requestHostTimeout(callback, ms) {
      taskTimeoutID = localSetTimeout(function() {
        callback(exports.unstable_now());
      }, ms);
    }
    exports.unstable_IdlePriority = 5;
    exports.unstable_ImmediatePriority = 1;
    exports.unstable_LowPriority = 4;
    exports.unstable_NormalPriority = 3;
    exports.unstable_Profiling = null;
    exports.unstable_UserBlockingPriority = 2;
    exports.unstable_cancelCallback = function(task) {
      task.callback = null;
    };
    exports.unstable_forceFrameRate = function(fps) {
      0 > fps || 125 < fps ? console.error(
        "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
      ) : frameInterval = 0 < fps ? Math.floor(1e3 / fps) : 5;
    };
    exports.unstable_getCurrentPriorityLevel = function() {
      return currentPriorityLevel;
    };
    exports.unstable_next = function(eventHandler) {
      switch (currentPriorityLevel) {
        case 1:
        case 2:
        case 3:
          var priorityLevel = 3;
          break;
        default:
          priorityLevel = currentPriorityLevel;
      }
      var previousPriorityLevel = currentPriorityLevel;
      currentPriorityLevel = priorityLevel;
      try {
        return eventHandler();
      } finally {
        currentPriorityLevel = previousPriorityLevel;
      }
    };
    exports.unstable_requestPaint = function() {
      needsPaint = true;
    };
    exports.unstable_runWithPriority = function(priorityLevel, eventHandler) {
      switch (priorityLevel) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          priorityLevel = 3;
      }
      var previousPriorityLevel = currentPriorityLevel;
      currentPriorityLevel = priorityLevel;
      try {
        return eventHandler();
      } finally {
        currentPriorityLevel = previousPriorityLevel;
      }
    };
    exports.unstable_scheduleCallback = function(priorityLevel, callback, options) {
      var currentTime = exports.unstable_now();
      "object" === typeof options && null !== options ? (options = options.delay, options = "number" === typeof options && 0 < options ? currentTime + options : currentTime) : options = currentTime;
      switch (priorityLevel) {
        case 1:
          var timeout = -1;
          break;
        case 2:
          timeout = 250;
          break;
        case 5:
          timeout = 1073741823;
          break;
        case 4:
          timeout = 1e4;
          break;
        default:
          timeout = 5e3;
      }
      timeout = options + timeout;
      priorityLevel = {
        id: taskIdCounter++,
        callback,
        priorityLevel,
        startTime: options,
        expirationTime: timeout,
        sortIndex: -1
      };
      options > currentTime ? (priorityLevel.sortIndex = options, push(timerQueue, priorityLevel), null === peek(taskQueue) && priorityLevel === peek(timerQueue) && (isHostTimeoutScheduled ? (localClearTimeout(taskTimeoutID), taskTimeoutID = -1) : isHostTimeoutScheduled = true, requestHostTimeout(handleTimeout, options - currentTime))) : (priorityLevel.sortIndex = timeout, push(taskQueue, priorityLevel), isHostCallbackScheduled || isPerformingWork || (isHostCallbackScheduled = true, isMessageLoopRunning || (isMessageLoopRunning = true, schedulePerformWorkUntilDeadline())));
      return priorityLevel;
    };
    exports.unstable_shouldYield = shouldYieldToHost;
    exports.unstable_wrapCallback = function(callback) {
      var parentPriorityLevel = currentPriorityLevel;
      return function() {
        var previousPriorityLevel = currentPriorityLevel;
        currentPriorityLevel = parentPriorityLevel;
        try {
          return callback.apply(this, arguments);
        } finally {
          currentPriorityLevel = previousPriorityLevel;
        }
      };
    };
  })(scheduler_production);
  return scheduler_production;
}
var hasRequiredScheduler;
function requireScheduler() {
  if (hasRequiredScheduler) return scheduler.exports;
  hasRequiredScheduler = 1;
  {
    scheduler.exports = requireScheduler_production();
  }
  return scheduler.exports;
}
var reactDom = { exports: {} };
var reactDom_production = {};
var hasRequiredReactDom_production;
function requireReactDom_production() {
  if (hasRequiredReactDom_production) return reactDom_production;
  hasRequiredReactDom_production = 1;
  var React = requireReact();
  function formatProdErrorMessage(code) {
    var url = "https://react.dev/errors/" + code;
    if (1 < arguments.length) {
      url += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var i = 2; i < arguments.length; i++)
        url += "&args[]=" + encodeURIComponent(arguments[i]);
    }
    return "Minified React error #" + code + "; visit " + url + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function noop() {
  }
  var Internals = {
    d: {
      f: noop,
      r: function() {
        throw Error(formatProdErrorMessage(522));
      },
      D: noop,
      C: noop,
      L: noop,
      m: noop,
      X: noop,
      S: noop,
      M: noop
    },
    p: 0,
    findDOMNode: null
  }, REACT_PORTAL_TYPE = /* @__PURE__ */ Symbol.for("react.portal");
  function createPortal$1(children, containerInfo, implementation) {
    var key = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
    return {
      $$typeof: REACT_PORTAL_TYPE,
      key: null == key ? null : "" + key,
      children,
      containerInfo,
      implementation
    };
  }
  var ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function getCrossOriginStringAs(as, input) {
    if ("font" === as) return "";
    if ("string" === typeof input)
      return "use-credentials" === input ? input : "";
  }
  reactDom_production.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = Internals;
  reactDom_production.createPortal = function(children, container) {
    var key = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
    if (!container || 1 !== container.nodeType && 9 !== container.nodeType && 11 !== container.nodeType)
      throw Error(formatProdErrorMessage(299));
    return createPortal$1(children, container, null, key);
  };
  reactDom_production.flushSync = function(fn) {
    var previousTransition = ReactSharedInternals.T, previousUpdatePriority = Internals.p;
    try {
      if (ReactSharedInternals.T = null, Internals.p = 2, fn) return fn();
    } finally {
      ReactSharedInternals.T = previousTransition, Internals.p = previousUpdatePriority, Internals.d.f();
    }
  };
  reactDom_production.preconnect = function(href, options) {
    "string" === typeof href && (options ? (options = options.crossOrigin, options = "string" === typeof options ? "use-credentials" === options ? options : "" : void 0) : options = null, Internals.d.C(href, options));
  };
  reactDom_production.prefetchDNS = function(href) {
    "string" === typeof href && Internals.d.D(href);
  };
  reactDom_production.preinit = function(href, options) {
    if ("string" === typeof href && options && "string" === typeof options.as) {
      var as = options.as, crossOrigin = getCrossOriginStringAs(as, options.crossOrigin), integrity = "string" === typeof options.integrity ? options.integrity : void 0, fetchPriority = "string" === typeof options.fetchPriority ? options.fetchPriority : void 0;
      "style" === as ? Internals.d.S(
        href,
        "string" === typeof options.precedence ? options.precedence : void 0,
        {
          crossOrigin,
          integrity,
          fetchPriority
        }
      ) : "script" === as && Internals.d.X(href, {
        crossOrigin,
        integrity,
        fetchPriority,
        nonce: "string" === typeof options.nonce ? options.nonce : void 0
      });
    }
  };
  reactDom_production.preinitModule = function(href, options) {
    if ("string" === typeof href)
      if ("object" === typeof options && null !== options) {
        if (null == options.as || "script" === options.as) {
          var crossOrigin = getCrossOriginStringAs(
            options.as,
            options.crossOrigin
          );
          Internals.d.M(href, {
            crossOrigin,
            integrity: "string" === typeof options.integrity ? options.integrity : void 0,
            nonce: "string" === typeof options.nonce ? options.nonce : void 0
          });
        }
      } else null == options && Internals.d.M(href);
  };
  reactDom_production.preload = function(href, options) {
    if ("string" === typeof href && "object" === typeof options && null !== options && "string" === typeof options.as) {
      var as = options.as, crossOrigin = getCrossOriginStringAs(as, options.crossOrigin);
      Internals.d.L(href, as, {
        crossOrigin,
        integrity: "string" === typeof options.integrity ? options.integrity : void 0,
        nonce: "string" === typeof options.nonce ? options.nonce : void 0,
        type: "string" === typeof options.type ? options.type : void 0,
        fetchPriority: "string" === typeof options.fetchPriority ? options.fetchPriority : void 0,
        referrerPolicy: "string" === typeof options.referrerPolicy ? options.referrerPolicy : void 0,
        imageSrcSet: "string" === typeof options.imageSrcSet ? options.imageSrcSet : void 0,
        imageSizes: "string" === typeof options.imageSizes ? options.imageSizes : void 0,
        media: "string" === typeof options.media ? options.media : void 0
      });
    }
  };
  reactDom_production.preloadModule = function(href, options) {
    if ("string" === typeof href)
      if (options) {
        var crossOrigin = getCrossOriginStringAs(options.as, options.crossOrigin);
        Internals.d.m(href, {
          as: "string" === typeof options.as && "script" !== options.as ? options.as : void 0,
          crossOrigin,
          integrity: "string" === typeof options.integrity ? options.integrity : void 0
        });
      } else Internals.d.m(href);
  };
  reactDom_production.requestFormReset = function(form) {
    Internals.d.r(form);
  };
  reactDom_production.unstable_batchedUpdates = function(fn, a) {
    return fn(a);
  };
  reactDom_production.useFormState = function(action, initialState, permalink) {
    return ReactSharedInternals.H.useFormState(action, initialState, permalink);
  };
  reactDom_production.useFormStatus = function() {
    return ReactSharedInternals.H.useHostTransitionStatus();
  };
  reactDom_production.version = "19.2.7";
  return reactDom_production;
}
var hasRequiredReactDom;
function requireReactDom() {
  if (hasRequiredReactDom) return reactDom.exports;
  hasRequiredReactDom = 1;
  function checkDCE() {
    if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function") {
      return;
    }
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
    } catch (err) {
      console.error(err);
    }
  }
  {
    checkDCE();
    reactDom.exports = requireReactDom_production();
  }
  return reactDom.exports;
}
var hasRequiredReactDomClient_production;
function requireReactDomClient_production() {
  if (hasRequiredReactDomClient_production) return reactDomClient_production;
  hasRequiredReactDomClient_production = 1;
  var Scheduler = requireScheduler(), React = requireReact(), ReactDOM = requireReactDom();
  function formatProdErrorMessage(code) {
    var url = "https://react.dev/errors/" + code;
    if (1 < arguments.length) {
      url += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var i = 2; i < arguments.length; i++)
        url += "&args[]=" + encodeURIComponent(arguments[i]);
    }
    return "Minified React error #" + code + "; visit " + url + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function isValidContainer(node) {
    return !(!node || 1 !== node.nodeType && 9 !== node.nodeType && 11 !== node.nodeType);
  }
  function getNearestMountedFiber(fiber) {
    var node = fiber, nearestMounted = fiber;
    if (fiber.alternate) for (; node.return; ) node = node.return;
    else {
      fiber = node;
      do
        node = fiber, 0 !== (node.flags & 4098) && (nearestMounted = node.return), fiber = node.return;
      while (fiber);
    }
    return 3 === node.tag ? nearestMounted : null;
  }
  function getSuspenseInstanceFromFiber(fiber) {
    if (13 === fiber.tag) {
      var suspenseState = fiber.memoizedState;
      null === suspenseState && (fiber = fiber.alternate, null !== fiber && (suspenseState = fiber.memoizedState));
      if (null !== suspenseState) return suspenseState.dehydrated;
    }
    return null;
  }
  function getActivityInstanceFromFiber(fiber) {
    if (31 === fiber.tag) {
      var activityState = fiber.memoizedState;
      null === activityState && (fiber = fiber.alternate, null !== fiber && (activityState = fiber.memoizedState));
      if (null !== activityState) return activityState.dehydrated;
    }
    return null;
  }
  function assertIsMounted(fiber) {
    if (getNearestMountedFiber(fiber) !== fiber)
      throw Error(formatProdErrorMessage(188));
  }
  function findCurrentFiberUsingSlowPath(fiber) {
    var alternate = fiber.alternate;
    if (!alternate) {
      alternate = getNearestMountedFiber(fiber);
      if (null === alternate) throw Error(formatProdErrorMessage(188));
      return alternate !== fiber ? null : fiber;
    }
    for (var a = fiber, b = alternate; ; ) {
      var parentA = a.return;
      if (null === parentA) break;
      var parentB = parentA.alternate;
      if (null === parentB) {
        b = parentA.return;
        if (null !== b) {
          a = b;
          continue;
        }
        break;
      }
      if (parentA.child === parentB.child) {
        for (parentB = parentA.child; parentB; ) {
          if (parentB === a) return assertIsMounted(parentA), fiber;
          if (parentB === b) return assertIsMounted(parentA), alternate;
          parentB = parentB.sibling;
        }
        throw Error(formatProdErrorMessage(188));
      }
      if (a.return !== b.return) a = parentA, b = parentB;
      else {
        for (var didFindChild = false, child$0 = parentA.child; child$0; ) {
          if (child$0 === a) {
            didFindChild = true;
            a = parentA;
            b = parentB;
            break;
          }
          if (child$0 === b) {
            didFindChild = true;
            b = parentA;
            a = parentB;
            break;
          }
          child$0 = child$0.sibling;
        }
        if (!didFindChild) {
          for (child$0 = parentB.child; child$0; ) {
            if (child$0 === a) {
              didFindChild = true;
              a = parentB;
              b = parentA;
              break;
            }
            if (child$0 === b) {
              didFindChild = true;
              b = parentB;
              a = parentA;
              break;
            }
            child$0 = child$0.sibling;
          }
          if (!didFindChild) throw Error(formatProdErrorMessage(189));
        }
      }
      if (a.alternate !== b) throw Error(formatProdErrorMessage(190));
    }
    if (3 !== a.tag) throw Error(formatProdErrorMessage(188));
    return a.stateNode.current === a ? fiber : alternate;
  }
  function findCurrentHostFiberImpl(node) {
    var tag = node.tag;
    if (5 === tag || 26 === tag || 27 === tag || 6 === tag) return node;
    for (node = node.child; null !== node; ) {
      tag = findCurrentHostFiberImpl(node);
      if (null !== tag) return tag;
      node = node.sibling;
    }
    return null;
  }
  var assign = Object.assign, REACT_LEGACY_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.element"), REACT_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = /* @__PURE__ */ Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = /* @__PURE__ */ Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = /* @__PURE__ */ Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = /* @__PURE__ */ Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = /* @__PURE__ */ Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = /* @__PURE__ */ Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = /* @__PURE__ */ Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = /* @__PURE__ */ Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = /* @__PURE__ */ Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = /* @__PURE__ */ Symbol.for("react.memo"), REACT_LAZY_TYPE = /* @__PURE__ */ Symbol.for("react.lazy");
  var REACT_ACTIVITY_TYPE = /* @__PURE__ */ Symbol.for("react.activity");
  var REACT_MEMO_CACHE_SENTINEL = /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel");
  var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
  function getIteratorFn(maybeIterable) {
    if (null === maybeIterable || "object" !== typeof maybeIterable) return null;
    maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
    return "function" === typeof maybeIterable ? maybeIterable : null;
  }
  var REACT_CLIENT_REFERENCE = /* @__PURE__ */ Symbol.for("react.client.reference");
  function getComponentNameFromType(type) {
    if (null == type) return null;
    if ("function" === typeof type)
      return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
    if ("string" === typeof type) return type;
    switch (type) {
      case REACT_FRAGMENT_TYPE:
        return "Fragment";
      case REACT_PROFILER_TYPE:
        return "Profiler";
      case REACT_STRICT_MODE_TYPE:
        return "StrictMode";
      case REACT_SUSPENSE_TYPE:
        return "Suspense";
      case REACT_SUSPENSE_LIST_TYPE:
        return "SuspenseList";
      case REACT_ACTIVITY_TYPE:
        return "Activity";
    }
    if ("object" === typeof type)
      switch (type.$$typeof) {
        case REACT_PORTAL_TYPE:
          return "Portal";
        case REACT_CONTEXT_TYPE:
          return type.displayName || "Context";
        case REACT_CONSUMER_TYPE:
          return (type._context.displayName || "Context") + ".Consumer";
        case REACT_FORWARD_REF_TYPE:
          var innerType = type.render;
          type = type.displayName;
          type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
          return type;
        case REACT_MEMO_TYPE:
          return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
        case REACT_LAZY_TYPE:
          innerType = type._payload;
          type = type._init;
          try {
            return getComponentNameFromType(type(innerType));
          } catch (x) {
          }
      }
    return null;
  }
  var isArrayImpl = Array.isArray, ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, ReactDOMSharedInternals = ReactDOM.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, sharedNotPendingObject = {
    pending: false,
    data: null,
    method: null,
    action: null
  }, valueStack = [], index = -1;
  function createCursor(defaultValue) {
    return { current: defaultValue };
  }
  function pop(cursor) {
    0 > index || (cursor.current = valueStack[index], valueStack[index] = null, index--);
  }
  function push(cursor, value) {
    index++;
    valueStack[index] = cursor.current;
    cursor.current = value;
  }
  var contextStackCursor = createCursor(null), contextFiberStackCursor = createCursor(null), rootInstanceStackCursor = createCursor(null), hostTransitionProviderCursor = createCursor(null);
  function pushHostContainer(fiber, nextRootInstance) {
    push(rootInstanceStackCursor, nextRootInstance);
    push(contextFiberStackCursor, fiber);
    push(contextStackCursor, null);
    switch (nextRootInstance.nodeType) {
      case 9:
      case 11:
        fiber = (fiber = nextRootInstance.documentElement) ? (fiber = fiber.namespaceURI) ? getOwnHostContext(fiber) : 0 : 0;
        break;
      default:
        if (fiber = nextRootInstance.tagName, nextRootInstance = nextRootInstance.namespaceURI)
          nextRootInstance = getOwnHostContext(nextRootInstance), fiber = getChildHostContextProd(nextRootInstance, fiber);
        else
          switch (fiber) {
            case "svg":
              fiber = 1;
              break;
            case "math":
              fiber = 2;
              break;
            default:
              fiber = 0;
          }
    }
    pop(contextStackCursor);
    push(contextStackCursor, fiber);
  }
  function popHostContainer() {
    pop(contextStackCursor);
    pop(contextFiberStackCursor);
    pop(rootInstanceStackCursor);
  }
  function pushHostContext(fiber) {
    null !== fiber.memoizedState && push(hostTransitionProviderCursor, fiber);
    var context = contextStackCursor.current;
    var JSCompiler_inline_result = getChildHostContextProd(context, fiber.type);
    context !== JSCompiler_inline_result && (push(contextFiberStackCursor, fiber), push(contextStackCursor, JSCompiler_inline_result));
  }
  function popHostContext(fiber) {
    contextFiberStackCursor.current === fiber && (pop(contextStackCursor), pop(contextFiberStackCursor));
    hostTransitionProviderCursor.current === fiber && (pop(hostTransitionProviderCursor), HostTransitionContext._currentValue = sharedNotPendingObject);
  }
  var prefix, suffix;
  function describeBuiltInComponentFrame(name) {
    if (void 0 === prefix)
      try {
        throw Error();
      } catch (x) {
        var match = x.stack.trim().match(/\n( *(at )?)/);
        prefix = match && match[1] || "";
        suffix = -1 < x.stack.indexOf("\n    at") ? " (<anonymous>)" : -1 < x.stack.indexOf("@") ? "@unknown:0:0" : "";
      }
    return "\n" + prefix + name + suffix;
  }
  var reentry = false;
  function describeNativeComponentFrame(fn, construct) {
    if (!fn || reentry) return "";
    reentry = true;
    var previousPrepareStackTrace = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var RunInRootFrame = {
        DetermineComponentFrameRoot: function() {
          try {
            if (construct) {
              var Fake = function() {
                throw Error();
              };
              Object.defineProperty(Fake.prototype, "props", {
                set: function() {
                  throw Error();
                }
              });
              if ("object" === typeof Reflect && Reflect.construct) {
                try {
                  Reflect.construct(Fake, []);
                } catch (x) {
                  var control = x;
                }
                Reflect.construct(fn, [], Fake);
              } else {
                try {
                  Fake.call();
                } catch (x$1) {
                  control = x$1;
                }
                fn.call(Fake.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (x$2) {
                control = x$2;
              }
              (Fake = fn()) && "function" === typeof Fake.catch && Fake.catch(function() {
              });
            }
          } catch (sample) {
            if (sample && control && "string" === typeof sample.stack)
              return [sample.stack, control.stack];
          }
          return [null, null];
        }
      };
      RunInRootFrame.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
      var namePropDescriptor = Object.getOwnPropertyDescriptor(
        RunInRootFrame.DetermineComponentFrameRoot,
        "name"
      );
      namePropDescriptor && namePropDescriptor.configurable && Object.defineProperty(
        RunInRootFrame.DetermineComponentFrameRoot,
        "name",
        { value: "DetermineComponentFrameRoot" }
      );
      var _RunInRootFrame$Deter = RunInRootFrame.DetermineComponentFrameRoot(), sampleStack = _RunInRootFrame$Deter[0], controlStack = _RunInRootFrame$Deter[1];
      if (sampleStack && controlStack) {
        var sampleLines = sampleStack.split("\n"), controlLines = controlStack.split("\n");
        for (namePropDescriptor = RunInRootFrame = 0; RunInRootFrame < sampleLines.length && !sampleLines[RunInRootFrame].includes("DetermineComponentFrameRoot"); )
          RunInRootFrame++;
        for (; namePropDescriptor < controlLines.length && !controlLines[namePropDescriptor].includes(
          "DetermineComponentFrameRoot"
        ); )
          namePropDescriptor++;
        if (RunInRootFrame === sampleLines.length || namePropDescriptor === controlLines.length)
          for (RunInRootFrame = sampleLines.length - 1, namePropDescriptor = controlLines.length - 1; 1 <= RunInRootFrame && 0 <= namePropDescriptor && sampleLines[RunInRootFrame] !== controlLines[namePropDescriptor]; )
            namePropDescriptor--;
        for (; 1 <= RunInRootFrame && 0 <= namePropDescriptor; RunInRootFrame--, namePropDescriptor--)
          if (sampleLines[RunInRootFrame] !== controlLines[namePropDescriptor]) {
            if (1 !== RunInRootFrame || 1 !== namePropDescriptor) {
              do
                if (RunInRootFrame--, namePropDescriptor--, 0 > namePropDescriptor || sampleLines[RunInRootFrame] !== controlLines[namePropDescriptor]) {
                  var frame = "\n" + sampleLines[RunInRootFrame].replace(" at new ", " at ");
                  fn.displayName && frame.includes("<anonymous>") && (frame = frame.replace("<anonymous>", fn.displayName));
                  return frame;
                }
              while (1 <= RunInRootFrame && 0 <= namePropDescriptor);
            }
            break;
          }
      }
    } finally {
      reentry = false, Error.prepareStackTrace = previousPrepareStackTrace;
    }
    return (previousPrepareStackTrace = fn ? fn.displayName || fn.name : "") ? describeBuiltInComponentFrame(previousPrepareStackTrace) : "";
  }
  function describeFiber(fiber, childFiber) {
    switch (fiber.tag) {
      case 26:
      case 27:
      case 5:
        return describeBuiltInComponentFrame(fiber.type);
      case 16:
        return describeBuiltInComponentFrame("Lazy");
      case 13:
        return fiber.child !== childFiber && null !== childFiber ? describeBuiltInComponentFrame("Suspense Fallback") : describeBuiltInComponentFrame("Suspense");
      case 19:
        return describeBuiltInComponentFrame("SuspenseList");
      case 0:
      case 15:
        return describeNativeComponentFrame(fiber.type, false);
      case 11:
        return describeNativeComponentFrame(fiber.type.render, false);
      case 1:
        return describeNativeComponentFrame(fiber.type, true);
      case 31:
        return describeBuiltInComponentFrame("Activity");
      default:
        return "";
    }
  }
  function getStackByFiberInDevAndProd(workInProgress2) {
    try {
      var info = "", previous = null;
      do
        info += describeFiber(workInProgress2, previous), previous = workInProgress2, workInProgress2 = workInProgress2.return;
      while (workInProgress2);
      return info;
    } catch (x) {
      return "\nError generating stack: " + x.message + "\n" + x.stack;
    }
  }
  var hasOwnProperty = Object.prototype.hasOwnProperty, scheduleCallback$3 = Scheduler.unstable_scheduleCallback, cancelCallback$1 = Scheduler.unstable_cancelCallback, shouldYield = Scheduler.unstable_shouldYield, requestPaint = Scheduler.unstable_requestPaint, now = Scheduler.unstable_now, getCurrentPriorityLevel = Scheduler.unstable_getCurrentPriorityLevel, ImmediatePriority = Scheduler.unstable_ImmediatePriority, UserBlockingPriority = Scheduler.unstable_UserBlockingPriority, NormalPriority$1 = Scheduler.unstable_NormalPriority, LowPriority = Scheduler.unstable_LowPriority, IdlePriority = Scheduler.unstable_IdlePriority, log$1 = Scheduler.log, unstable_setDisableYieldValue = Scheduler.unstable_setDisableYieldValue, rendererID = null, injectedHook = null;
  function setIsStrictModeForDevtools(newIsStrictMode) {
    "function" === typeof log$1 && unstable_setDisableYieldValue(newIsStrictMode);
    if (injectedHook && "function" === typeof injectedHook.setStrictMode)
      try {
        injectedHook.setStrictMode(rendererID, newIsStrictMode);
      } catch (err) {
      }
  }
  var clz32 = Math.clz32 ? Math.clz32 : clz32Fallback, log = Math.log, LN2 = Math.LN2;
  function clz32Fallback(x) {
    x >>>= 0;
    return 0 === x ? 32 : 31 - (log(x) / LN2 | 0) | 0;
  }
  var nextTransitionUpdateLane = 256, nextTransitionDeferredLane = 262144, nextRetryLane = 4194304;
  function getHighestPriorityLanes(lanes) {
    var pendingSyncLanes = lanes & 42;
    if (0 !== pendingSyncLanes) return pendingSyncLanes;
    switch (lanes & -lanes) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
        return 64;
      case 128:
        return 128;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
        return lanes & 261888;
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return lanes & 3932160;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return lanes & 62914560;
      case 67108864:
        return 67108864;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 0;
      default:
        return lanes;
    }
  }
  function getNextLanes(root2, wipLanes, rootHasPendingCommit) {
    var pendingLanes = root2.pendingLanes;
    if (0 === pendingLanes) return 0;
    var nextLanes = 0, suspendedLanes = root2.suspendedLanes, pingedLanes = root2.pingedLanes;
    root2 = root2.warmLanes;
    var nonIdlePendingLanes = pendingLanes & 134217727;
    0 !== nonIdlePendingLanes ? (pendingLanes = nonIdlePendingLanes & ~suspendedLanes, 0 !== pendingLanes ? nextLanes = getHighestPriorityLanes(pendingLanes) : (pingedLanes &= nonIdlePendingLanes, 0 !== pingedLanes ? nextLanes = getHighestPriorityLanes(pingedLanes) : rootHasPendingCommit || (rootHasPendingCommit = nonIdlePendingLanes & ~root2, 0 !== rootHasPendingCommit && (nextLanes = getHighestPriorityLanes(rootHasPendingCommit))))) : (nonIdlePendingLanes = pendingLanes & ~suspendedLanes, 0 !== nonIdlePendingLanes ? nextLanes = getHighestPriorityLanes(nonIdlePendingLanes) : 0 !== pingedLanes ? nextLanes = getHighestPriorityLanes(pingedLanes) : rootHasPendingCommit || (rootHasPendingCommit = pendingLanes & ~root2, 0 !== rootHasPendingCommit && (nextLanes = getHighestPriorityLanes(rootHasPendingCommit))));
    return 0 === nextLanes ? 0 : 0 !== wipLanes && wipLanes !== nextLanes && 0 === (wipLanes & suspendedLanes) && (suspendedLanes = nextLanes & -nextLanes, rootHasPendingCommit = wipLanes & -wipLanes, suspendedLanes >= rootHasPendingCommit || 32 === suspendedLanes && 0 !== (rootHasPendingCommit & 4194048)) ? wipLanes : nextLanes;
  }
  function checkIfRootIsPrerendering(root2, renderLanes2) {
    return 0 === (root2.pendingLanes & ~(root2.suspendedLanes & ~root2.pingedLanes) & renderLanes2);
  }
  function computeExpirationTime(lane, currentTime) {
    switch (lane) {
      case 1:
      case 2:
      case 4:
      case 8:
      case 64:
        return currentTime + 250;
      case 16:
      case 32:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return currentTime + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return -1;
      case 67108864:
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function claimNextRetryLane() {
    var lane = nextRetryLane;
    nextRetryLane <<= 1;
    0 === (nextRetryLane & 62914560) && (nextRetryLane = 4194304);
    return lane;
  }
  function createLaneMap(initial) {
    for (var laneMap = [], i = 0; 31 > i; i++) laneMap.push(initial);
    return laneMap;
  }
  function markRootUpdated$1(root2, updateLane) {
    root2.pendingLanes |= updateLane;
    268435456 !== updateLane && (root2.suspendedLanes = 0, root2.pingedLanes = 0, root2.warmLanes = 0);
  }
  function markRootFinished(root2, finishedLanes, remainingLanes, spawnedLane, updatedLanes, suspendedRetryLanes) {
    var previouslyPendingLanes = root2.pendingLanes;
    root2.pendingLanes = remainingLanes;
    root2.suspendedLanes = 0;
    root2.pingedLanes = 0;
    root2.warmLanes = 0;
    root2.expiredLanes &= remainingLanes;
    root2.entangledLanes &= remainingLanes;
    root2.errorRecoveryDisabledLanes &= remainingLanes;
    root2.shellSuspendCounter = 0;
    var entanglements = root2.entanglements, expirationTimes = root2.expirationTimes, hiddenUpdates = root2.hiddenUpdates;
    for (remainingLanes = previouslyPendingLanes & ~remainingLanes; 0 < remainingLanes; ) {
      var index$7 = 31 - clz32(remainingLanes), lane = 1 << index$7;
      entanglements[index$7] = 0;
      expirationTimes[index$7] = -1;
      var hiddenUpdatesForLane = hiddenUpdates[index$7];
      if (null !== hiddenUpdatesForLane)
        for (hiddenUpdates[index$7] = null, index$7 = 0; index$7 < hiddenUpdatesForLane.length; index$7++) {
          var update = hiddenUpdatesForLane[index$7];
          null !== update && (update.lane &= -536870913);
        }
      remainingLanes &= ~lane;
    }
    0 !== spawnedLane && markSpawnedDeferredLane(root2, spawnedLane, 0);
    0 !== suspendedRetryLanes && 0 === updatedLanes && 0 !== root2.tag && (root2.suspendedLanes |= suspendedRetryLanes & ~(previouslyPendingLanes & ~finishedLanes));
  }
  function markSpawnedDeferredLane(root2, spawnedLane, entangledLanes) {
    root2.pendingLanes |= spawnedLane;
    root2.suspendedLanes &= ~spawnedLane;
    var spawnedLaneIndex = 31 - clz32(spawnedLane);
    root2.entangledLanes |= spawnedLane;
    root2.entanglements[spawnedLaneIndex] = root2.entanglements[spawnedLaneIndex] | 1073741824 | entangledLanes & 261930;
  }
  function markRootEntangled(root2, entangledLanes) {
    var rootEntangledLanes = root2.entangledLanes |= entangledLanes;
    for (root2 = root2.entanglements; rootEntangledLanes; ) {
      var index$8 = 31 - clz32(rootEntangledLanes), lane = 1 << index$8;
      lane & entangledLanes | root2[index$8] & entangledLanes && (root2[index$8] |= entangledLanes);
      rootEntangledLanes &= ~lane;
    }
  }
  function getBumpedLaneForHydration(root2, renderLanes2) {
    var renderLane = renderLanes2 & -renderLanes2;
    renderLane = 0 !== (renderLane & 42) ? 1 : getBumpedLaneForHydrationByLane(renderLane);
    return 0 !== (renderLane & (root2.suspendedLanes | renderLanes2)) ? 0 : renderLane;
  }
  function getBumpedLaneForHydrationByLane(lane) {
    switch (lane) {
      case 2:
        lane = 1;
        break;
      case 8:
        lane = 4;
        break;
      case 32:
        lane = 16;
        break;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        lane = 128;
        break;
      case 268435456:
        lane = 134217728;
        break;
      default:
        lane = 0;
    }
    return lane;
  }
  function lanesToEventPriority(lanes) {
    lanes &= -lanes;
    return 2 < lanes ? 8 < lanes ? 0 !== (lanes & 134217727) ? 32 : 268435456 : 8 : 2;
  }
  function resolveUpdatePriority() {
    var updatePriority = ReactDOMSharedInternals.p;
    if (0 !== updatePriority) return updatePriority;
    updatePriority = window.event;
    return void 0 === updatePriority ? 32 : getEventPriority(updatePriority.type);
  }
  function runWithPriority(priority, fn) {
    var previousPriority = ReactDOMSharedInternals.p;
    try {
      return ReactDOMSharedInternals.p = priority, fn();
    } finally {
      ReactDOMSharedInternals.p = previousPriority;
    }
  }
  var randomKey = Math.random().toString(36).slice(2), internalInstanceKey = "__reactFiber$" + randomKey, internalPropsKey = "__reactProps$" + randomKey, internalContainerInstanceKey = "__reactContainer$" + randomKey, internalEventHandlersKey = "__reactEvents$" + randomKey, internalEventHandlerListenersKey = "__reactListeners$" + randomKey, internalEventHandlesSetKey = "__reactHandles$" + randomKey, internalRootNodeResourcesKey = "__reactResources$" + randomKey, internalHoistableMarker = "__reactMarker$" + randomKey;
  function detachDeletedInstance(node) {
    delete node[internalInstanceKey];
    delete node[internalPropsKey];
    delete node[internalEventHandlersKey];
    delete node[internalEventHandlerListenersKey];
    delete node[internalEventHandlesSetKey];
  }
  function getClosestInstanceFromNode(targetNode) {
    var targetInst = targetNode[internalInstanceKey];
    if (targetInst) return targetInst;
    for (var parentNode = targetNode.parentNode; parentNode; ) {
      if (targetInst = parentNode[internalContainerInstanceKey] || parentNode[internalInstanceKey]) {
        parentNode = targetInst.alternate;
        if (null !== targetInst.child || null !== parentNode && null !== parentNode.child)
          for (targetNode = getParentHydrationBoundary(targetNode); null !== targetNode; ) {
            if (parentNode = targetNode[internalInstanceKey]) return parentNode;
            targetNode = getParentHydrationBoundary(targetNode);
          }
        return targetInst;
      }
      targetNode = parentNode;
      parentNode = targetNode.parentNode;
    }
    return null;
  }
  function getInstanceFromNode(node) {
    if (node = node[internalInstanceKey] || node[internalContainerInstanceKey]) {
      var tag = node.tag;
      if (5 === tag || 6 === tag || 13 === tag || 31 === tag || 26 === tag || 27 === tag || 3 === tag)
        return node;
    }
    return null;
  }
  function getNodeFromInstance(inst) {
    var tag = inst.tag;
    if (5 === tag || 26 === tag || 27 === tag || 6 === tag) return inst.stateNode;
    throw Error(formatProdErrorMessage(33));
  }
  function getResourcesFromRoot(root2) {
    var resources = root2[internalRootNodeResourcesKey];
    resources || (resources = root2[internalRootNodeResourcesKey] = { hoistableStyles: /* @__PURE__ */ new Map(), hoistableScripts: /* @__PURE__ */ new Map() });
    return resources;
  }
  function markNodeAsHoistable(node) {
    node[internalHoistableMarker] = true;
  }
  var allNativeEvents = /* @__PURE__ */ new Set(), registrationNameDependencies = {};
  function registerTwoPhaseEvent(registrationName, dependencies) {
    registerDirectEvent(registrationName, dependencies);
    registerDirectEvent(registrationName + "Capture", dependencies);
  }
  function registerDirectEvent(registrationName, dependencies) {
    registrationNameDependencies[registrationName] = dependencies;
    for (registrationName = 0; registrationName < dependencies.length; registrationName++)
      allNativeEvents.add(dependencies[registrationName]);
  }
  var VALID_ATTRIBUTE_NAME_REGEX = RegExp(
    "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
  ), illegalAttributeNameCache = {}, validatedAttributeNameCache = {};
  function isAttributeNameSafe(attributeName) {
    if (hasOwnProperty.call(validatedAttributeNameCache, attributeName))
      return true;
    if (hasOwnProperty.call(illegalAttributeNameCache, attributeName)) return false;
    if (VALID_ATTRIBUTE_NAME_REGEX.test(attributeName))
      return validatedAttributeNameCache[attributeName] = true;
    illegalAttributeNameCache[attributeName] = true;
    return false;
  }
  function setValueForAttribute(node, name, value) {
    if (isAttributeNameSafe(name))
      if (null === value) node.removeAttribute(name);
      else {
        switch (typeof value) {
          case "undefined":
          case "function":
          case "symbol":
            node.removeAttribute(name);
            return;
          case "boolean":
            var prefix$10 = name.toLowerCase().slice(0, 5);
            if ("data-" !== prefix$10 && "aria-" !== prefix$10) {
              node.removeAttribute(name);
              return;
            }
        }
        node.setAttribute(name, "" + value);
      }
  }
  function setValueForKnownAttribute(node, name, value) {
    if (null === value) node.removeAttribute(name);
    else {
      switch (typeof value) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          node.removeAttribute(name);
          return;
      }
      node.setAttribute(name, "" + value);
    }
  }
  function setValueForNamespacedAttribute(node, namespace, name, value) {
    if (null === value) node.removeAttribute(name);
    else {
      switch (typeof value) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          node.removeAttribute(name);
          return;
      }
      node.setAttributeNS(namespace, name, "" + value);
    }
  }
  function getToStringValue(value) {
    switch (typeof value) {
      case "bigint":
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return value;
      case "object":
        return value;
      default:
        return "";
    }
  }
  function isCheckable(elem) {
    var type = elem.type;
    return (elem = elem.nodeName) && "input" === elem.toLowerCase() && ("checkbox" === type || "radio" === type);
  }
  function trackValueOnNode(node, valueField, currentValue) {
    var descriptor = Object.getOwnPropertyDescriptor(
      node.constructor.prototype,
      valueField
    );
    if (!node.hasOwnProperty(valueField) && "undefined" !== typeof descriptor && "function" === typeof descriptor.get && "function" === typeof descriptor.set) {
      var get = descriptor.get, set = descriptor.set;
      Object.defineProperty(node, valueField, {
        configurable: true,
        get: function() {
          return get.call(this);
        },
        set: function(value) {
          currentValue = "" + value;
          set.call(this, value);
        }
      });
      Object.defineProperty(node, valueField, {
        enumerable: descriptor.enumerable
      });
      return {
        getValue: function() {
          return currentValue;
        },
        setValue: function(value) {
          currentValue = "" + value;
        },
        stopTracking: function() {
          node._valueTracker = null;
          delete node[valueField];
        }
      };
    }
  }
  function track(node) {
    if (!node._valueTracker) {
      var valueField = isCheckable(node) ? "checked" : "value";
      node._valueTracker = trackValueOnNode(
        node,
        valueField,
        "" + node[valueField]
      );
    }
  }
  function updateValueIfChanged(node) {
    if (!node) return false;
    var tracker = node._valueTracker;
    if (!tracker) return true;
    var lastValue = tracker.getValue();
    var value = "";
    node && (value = isCheckable(node) ? node.checked ? "true" : "false" : node.value);
    node = value;
    return node !== lastValue ? (tracker.setValue(node), true) : false;
  }
  function getActiveElement(doc) {
    doc = doc || ("undefined" !== typeof document ? document : void 0);
    if ("undefined" === typeof doc) return null;
    try {
      return doc.activeElement || doc.body;
    } catch (e) {
      return doc.body;
    }
  }
  var escapeSelectorAttributeValueInsideDoubleQuotesRegex = /[\n"\\]/g;
  function escapeSelectorAttributeValueInsideDoubleQuotes(value) {
    return value.replace(
      escapeSelectorAttributeValueInsideDoubleQuotesRegex,
      function(ch) {
        return "\\" + ch.charCodeAt(0).toString(16) + " ";
      }
    );
  }
  function updateInput(element, value, defaultValue, lastDefaultValue, checked, defaultChecked, type, name) {
    element.name = "";
    null != type && "function" !== typeof type && "symbol" !== typeof type && "boolean" !== typeof type ? element.type = type : element.removeAttribute("type");
    if (null != value)
      if ("number" === type) {
        if (0 === value && "" === element.value || element.value != value)
          element.value = "" + getToStringValue(value);
      } else
        element.value !== "" + getToStringValue(value) && (element.value = "" + getToStringValue(value));
    else
      "submit" !== type && "reset" !== type || element.removeAttribute("value");
    null != value ? setDefaultValue(element, type, getToStringValue(value)) : null != defaultValue ? setDefaultValue(element, type, getToStringValue(defaultValue)) : null != lastDefaultValue && element.removeAttribute("value");
    null == checked && null != defaultChecked && (element.defaultChecked = !!defaultChecked);
    null != checked && (element.checked = checked && "function" !== typeof checked && "symbol" !== typeof checked);
    null != name && "function" !== typeof name && "symbol" !== typeof name && "boolean" !== typeof name ? element.name = "" + getToStringValue(name) : element.removeAttribute("name");
  }
  function initInput(element, value, defaultValue, checked, defaultChecked, type, name, isHydrating2) {
    null != type && "function" !== typeof type && "symbol" !== typeof type && "boolean" !== typeof type && (element.type = type);
    if (null != value || null != defaultValue) {
      if (!("submit" !== type && "reset" !== type || void 0 !== value && null !== value)) {
        track(element);
        return;
      }
      defaultValue = null != defaultValue ? "" + getToStringValue(defaultValue) : "";
      value = null != value ? "" + getToStringValue(value) : defaultValue;
      isHydrating2 || value === element.value || (element.value = value);
      element.defaultValue = value;
    }
    checked = null != checked ? checked : defaultChecked;
    checked = "function" !== typeof checked && "symbol" !== typeof checked && !!checked;
    element.checked = isHydrating2 ? element.checked : !!checked;
    element.defaultChecked = !!checked;
    null != name && "function" !== typeof name && "symbol" !== typeof name && "boolean" !== typeof name && (element.name = name);
    track(element);
  }
  function setDefaultValue(node, type, value) {
    "number" === type && getActiveElement(node.ownerDocument) === node || node.defaultValue === "" + value || (node.defaultValue = "" + value);
  }
  function updateOptions(node, multiple, propValue, setDefaultSelected) {
    node = node.options;
    if (multiple) {
      multiple = {};
      for (var i = 0; i < propValue.length; i++)
        multiple["$" + propValue[i]] = true;
      for (propValue = 0; propValue < node.length; propValue++)
        i = multiple.hasOwnProperty("$" + node[propValue].value), node[propValue].selected !== i && (node[propValue].selected = i), i && setDefaultSelected && (node[propValue].defaultSelected = true);
    } else {
      propValue = "" + getToStringValue(propValue);
      multiple = null;
      for (i = 0; i < node.length; i++) {
        if (node[i].value === propValue) {
          node[i].selected = true;
          setDefaultSelected && (node[i].defaultSelected = true);
          return;
        }
        null !== multiple || node[i].disabled || (multiple = node[i]);
      }
      null !== multiple && (multiple.selected = true);
    }
  }
  function updateTextarea(element, value, defaultValue) {
    if (null != value && (value = "" + getToStringValue(value), value !== element.value && (element.value = value), null == defaultValue)) {
      element.defaultValue !== value && (element.defaultValue = value);
      return;
    }
    element.defaultValue = null != defaultValue ? "" + getToStringValue(defaultValue) : "";
  }
  function initTextarea(element, value, defaultValue, children) {
    if (null == value) {
      if (null != children) {
        if (null != defaultValue) throw Error(formatProdErrorMessage(92));
        if (isArrayImpl(children)) {
          if (1 < children.length) throw Error(formatProdErrorMessage(93));
          children = children[0];
        }
        defaultValue = children;
      }
      null == defaultValue && (defaultValue = "");
      value = defaultValue;
    }
    defaultValue = getToStringValue(value);
    element.defaultValue = defaultValue;
    children = element.textContent;
    children === defaultValue && "" !== children && null !== children && (element.value = children);
    track(element);
  }
  function setTextContent(node, text) {
    if (text) {
      var firstChild = node.firstChild;
      if (firstChild && firstChild === node.lastChild && 3 === firstChild.nodeType) {
        firstChild.nodeValue = text;
        return;
      }
    }
    node.textContent = text;
  }
  var unitlessNumbers = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " "
    )
  );
  function setValueForStyle(style2, styleName, value) {
    var isCustomProperty = 0 === styleName.indexOf("--");
    null == value || "boolean" === typeof value || "" === value ? isCustomProperty ? style2.setProperty(styleName, "") : "float" === styleName ? style2.cssFloat = "" : style2[styleName] = "" : isCustomProperty ? style2.setProperty(styleName, value) : "number" !== typeof value || 0 === value || unitlessNumbers.has(styleName) ? "float" === styleName ? style2.cssFloat = value : style2[styleName] = ("" + value).trim() : style2[styleName] = value + "px";
  }
  function setValueForStyles(node, styles, prevStyles) {
    if (null != styles && "object" !== typeof styles)
      throw Error(formatProdErrorMessage(62));
    node = node.style;
    if (null != prevStyles) {
      for (var styleName in prevStyles)
        !prevStyles.hasOwnProperty(styleName) || null != styles && styles.hasOwnProperty(styleName) || (0 === styleName.indexOf("--") ? node.setProperty(styleName, "") : "float" === styleName ? node.cssFloat = "" : node[styleName] = "");
      for (var styleName$16 in styles)
        styleName = styles[styleName$16], styles.hasOwnProperty(styleName$16) && prevStyles[styleName$16] !== styleName && setValueForStyle(node, styleName$16, styleName);
    } else
      for (var styleName$17 in styles)
        styles.hasOwnProperty(styleName$17) && setValueForStyle(node, styleName$17, styles[styleName$17]);
  }
  function isCustomElement(tagName) {
    if (-1 === tagName.indexOf("-")) return false;
    switch (tagName) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return false;
      default:
        return true;
    }
  }
  var aliases = /* @__PURE__ */ new Map([
    ["acceptCharset", "accept-charset"],
    ["htmlFor", "for"],
    ["httpEquiv", "http-equiv"],
    ["crossOrigin", "crossorigin"],
    ["accentHeight", "accent-height"],
    ["alignmentBaseline", "alignment-baseline"],
    ["arabicForm", "arabic-form"],
    ["baselineShift", "baseline-shift"],
    ["capHeight", "cap-height"],
    ["clipPath", "clip-path"],
    ["clipRule", "clip-rule"],
    ["colorInterpolation", "color-interpolation"],
    ["colorInterpolationFilters", "color-interpolation-filters"],
    ["colorProfile", "color-profile"],
    ["colorRendering", "color-rendering"],
    ["dominantBaseline", "dominant-baseline"],
    ["enableBackground", "enable-background"],
    ["fillOpacity", "fill-opacity"],
    ["fillRule", "fill-rule"],
    ["floodColor", "flood-color"],
    ["floodOpacity", "flood-opacity"],
    ["fontFamily", "font-family"],
    ["fontSize", "font-size"],
    ["fontSizeAdjust", "font-size-adjust"],
    ["fontStretch", "font-stretch"],
    ["fontStyle", "font-style"],
    ["fontVariant", "font-variant"],
    ["fontWeight", "font-weight"],
    ["glyphName", "glyph-name"],
    ["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
    ["glyphOrientationVertical", "glyph-orientation-vertical"],
    ["horizAdvX", "horiz-adv-x"],
    ["horizOriginX", "horiz-origin-x"],
    ["imageRendering", "image-rendering"],
    ["letterSpacing", "letter-spacing"],
    ["lightingColor", "lighting-color"],
    ["markerEnd", "marker-end"],
    ["markerMid", "marker-mid"],
    ["markerStart", "marker-start"],
    ["overlinePosition", "overline-position"],
    ["overlineThickness", "overline-thickness"],
    ["paintOrder", "paint-order"],
    ["panose-1", "panose-1"],
    ["pointerEvents", "pointer-events"],
    ["renderingIntent", "rendering-intent"],
    ["shapeRendering", "shape-rendering"],
    ["stopColor", "stop-color"],
    ["stopOpacity", "stop-opacity"],
    ["strikethroughPosition", "strikethrough-position"],
    ["strikethroughThickness", "strikethrough-thickness"],
    ["strokeDasharray", "stroke-dasharray"],
    ["strokeDashoffset", "stroke-dashoffset"],
    ["strokeLinecap", "stroke-linecap"],
    ["strokeLinejoin", "stroke-linejoin"],
    ["strokeMiterlimit", "stroke-miterlimit"],
    ["strokeOpacity", "stroke-opacity"],
    ["strokeWidth", "stroke-width"],
    ["textAnchor", "text-anchor"],
    ["textDecoration", "text-decoration"],
    ["textRendering", "text-rendering"],
    ["transformOrigin", "transform-origin"],
    ["underlinePosition", "underline-position"],
    ["underlineThickness", "underline-thickness"],
    ["unicodeBidi", "unicode-bidi"],
    ["unicodeRange", "unicode-range"],
    ["unitsPerEm", "units-per-em"],
    ["vAlphabetic", "v-alphabetic"],
    ["vHanging", "v-hanging"],
    ["vIdeographic", "v-ideographic"],
    ["vMathematical", "v-mathematical"],
    ["vectorEffect", "vector-effect"],
    ["vertAdvY", "vert-adv-y"],
    ["vertOriginX", "vert-origin-x"],
    ["vertOriginY", "vert-origin-y"],
    ["wordSpacing", "word-spacing"],
    ["writingMode", "writing-mode"],
    ["xmlnsXlink", "xmlns:xlink"],
    ["xHeight", "x-height"]
  ]), isJavaScriptProtocol = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function sanitizeURL(url) {
    return isJavaScriptProtocol.test("" + url) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : url;
  }
  function noop$1() {
  }
  var currentReplayingEvent = null;
  function getEventTarget(nativeEvent) {
    nativeEvent = nativeEvent.target || nativeEvent.srcElement || window;
    nativeEvent.correspondingUseElement && (nativeEvent = nativeEvent.correspondingUseElement);
    return 3 === nativeEvent.nodeType ? nativeEvent.parentNode : nativeEvent;
  }
  var restoreTarget = null, restoreQueue = null;
  function restoreStateOfTarget(target) {
    var internalInstance = getInstanceFromNode(target);
    if (internalInstance && (target = internalInstance.stateNode)) {
      var props = target[internalPropsKey] || null;
      a: switch (target = internalInstance.stateNode, internalInstance.type) {
        case "input":
          updateInput(
            target,
            props.value,
            props.defaultValue,
            props.defaultValue,
            props.checked,
            props.defaultChecked,
            props.type,
            props.name
          );
          internalInstance = props.name;
          if ("radio" === props.type && null != internalInstance) {
            for (props = target; props.parentNode; ) props = props.parentNode;
            props = props.querySelectorAll(
              'input[name="' + escapeSelectorAttributeValueInsideDoubleQuotes(
                "" + internalInstance
              ) + '"][type="radio"]'
            );
            for (internalInstance = 0; internalInstance < props.length; internalInstance++) {
              var otherNode = props[internalInstance];
              if (otherNode !== target && otherNode.form === target.form) {
                var otherProps = otherNode[internalPropsKey] || null;
                if (!otherProps) throw Error(formatProdErrorMessage(90));
                updateInput(
                  otherNode,
                  otherProps.value,
                  otherProps.defaultValue,
                  otherProps.defaultValue,
                  otherProps.checked,
                  otherProps.defaultChecked,
                  otherProps.type,
                  otherProps.name
                );
              }
            }
            for (internalInstance = 0; internalInstance < props.length; internalInstance++)
              otherNode = props[internalInstance], otherNode.form === target.form && updateValueIfChanged(otherNode);
          }
          break a;
        case "textarea":
          updateTextarea(target, props.value, props.defaultValue);
          break a;
        case "select":
          internalInstance = props.value, null != internalInstance && updateOptions(target, !!props.multiple, internalInstance, false);
      }
    }
  }
  var isInsideEventHandler = false;
  function batchedUpdates$1(fn, a, b) {
    if (isInsideEventHandler) return fn(a, b);
    isInsideEventHandler = true;
    try {
      var JSCompiler_inline_result = fn(a);
      return JSCompiler_inline_result;
    } finally {
      if (isInsideEventHandler = false, null !== restoreTarget || null !== restoreQueue) {
        if (flushSyncWork$1(), restoreTarget && (a = restoreTarget, fn = restoreQueue, restoreQueue = restoreTarget = null, restoreStateOfTarget(a), fn))
          for (a = 0; a < fn.length; a++) restoreStateOfTarget(fn[a]);
      }
    }
  }
  function getListener(inst, registrationName) {
    var stateNode = inst.stateNode;
    if (null === stateNode) return null;
    var props = stateNode[internalPropsKey] || null;
    if (null === props) return null;
    stateNode = props[registrationName];
    a: switch (registrationName) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        (props = !props.disabled) || (inst = inst.type, props = !("button" === inst || "input" === inst || "select" === inst || "textarea" === inst));
        inst = !props;
        break a;
      default:
        inst = false;
    }
    if (inst) return null;
    if (stateNode && "function" !== typeof stateNode)
      throw Error(
        formatProdErrorMessage(231, registrationName, typeof stateNode)
      );
    return stateNode;
  }
  var canUseDOM = !("undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement), passiveBrowserEventsSupported = false;
  if (canUseDOM)
    try {
      var options = {};
      Object.defineProperty(options, "passive", {
        get: function() {
          passiveBrowserEventsSupported = true;
        }
      });
      window.addEventListener("test", options, options);
      window.removeEventListener("test", options, options);
    } catch (e) {
      passiveBrowserEventsSupported = false;
    }
  var root = null, startText = null, fallbackText = null;
  function getData() {
    if (fallbackText) return fallbackText;
    var start, startValue = startText, startLength = startValue.length, end, endValue = "value" in root ? root.value : root.textContent, endLength = endValue.length;
    for (start = 0; start < startLength && startValue[start] === endValue[start]; start++) ;
    var minEnd = startLength - start;
    for (end = 1; end <= minEnd && startValue[startLength - end] === endValue[endLength - end]; end++) ;
    return fallbackText = endValue.slice(start, 1 < end ? 1 - end : void 0);
  }
  function getEventCharCode(nativeEvent) {
    var keyCode = nativeEvent.keyCode;
    "charCode" in nativeEvent ? (nativeEvent = nativeEvent.charCode, 0 === nativeEvent && 13 === keyCode && (nativeEvent = 13)) : nativeEvent = keyCode;
    10 === nativeEvent && (nativeEvent = 13);
    return 32 <= nativeEvent || 13 === nativeEvent ? nativeEvent : 0;
  }
  function functionThatReturnsTrue() {
    return true;
  }
  function functionThatReturnsFalse() {
    return false;
  }
  function createSyntheticEvent(Interface) {
    function SyntheticBaseEvent(reactName, reactEventType, targetInst, nativeEvent, nativeEventTarget) {
      this._reactName = reactName;
      this._targetInst = targetInst;
      this.type = reactEventType;
      this.nativeEvent = nativeEvent;
      this.target = nativeEventTarget;
      this.currentTarget = null;
      for (var propName in Interface)
        Interface.hasOwnProperty(propName) && (reactName = Interface[propName], this[propName] = reactName ? reactName(nativeEvent) : nativeEvent[propName]);
      this.isDefaultPrevented = (null != nativeEvent.defaultPrevented ? nativeEvent.defaultPrevented : false === nativeEvent.returnValue) ? functionThatReturnsTrue : functionThatReturnsFalse;
      this.isPropagationStopped = functionThatReturnsFalse;
      return this;
    }
    assign(SyntheticBaseEvent.prototype, {
      preventDefault: function() {
        this.defaultPrevented = true;
        var event = this.nativeEvent;
        event && (event.preventDefault ? event.preventDefault() : "unknown" !== typeof event.returnValue && (event.returnValue = false), this.isDefaultPrevented = functionThatReturnsTrue);
      },
      stopPropagation: function() {
        var event = this.nativeEvent;
        event && (event.stopPropagation ? event.stopPropagation() : "unknown" !== typeof event.cancelBubble && (event.cancelBubble = true), this.isPropagationStopped = functionThatReturnsTrue);
      },
      persist: function() {
      },
      isPersistent: functionThatReturnsTrue
    });
    return SyntheticBaseEvent;
  }
  var EventInterface = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function(event) {
      return event.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0
  }, SyntheticEvent = createSyntheticEvent(EventInterface), UIEventInterface = assign({}, EventInterface, { view: 0, detail: 0 }), SyntheticUIEvent = createSyntheticEvent(UIEventInterface), lastMovementX, lastMovementY, lastMouseEvent, MouseEventInterface = assign({}, UIEventInterface, {
    screenX: 0,
    screenY: 0,
    clientX: 0,
    clientY: 0,
    pageX: 0,
    pageY: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    getModifierState: getEventModifierState,
    button: 0,
    buttons: 0,
    relatedTarget: function(event) {
      return void 0 === event.relatedTarget ? event.fromElement === event.srcElement ? event.toElement : event.fromElement : event.relatedTarget;
    },
    movementX: function(event) {
      if ("movementX" in event) return event.movementX;
      event !== lastMouseEvent && (lastMouseEvent && "mousemove" === event.type ? (lastMovementX = event.screenX - lastMouseEvent.screenX, lastMovementY = event.screenY - lastMouseEvent.screenY) : lastMovementY = lastMovementX = 0, lastMouseEvent = event);
      return lastMovementX;
    },
    movementY: function(event) {
      return "movementY" in event ? event.movementY : lastMovementY;
    }
  }), SyntheticMouseEvent = createSyntheticEvent(MouseEventInterface), DragEventInterface = assign({}, MouseEventInterface, { dataTransfer: 0 }), SyntheticDragEvent = createSyntheticEvent(DragEventInterface), FocusEventInterface = assign({}, UIEventInterface, { relatedTarget: 0 }), SyntheticFocusEvent = createSyntheticEvent(FocusEventInterface), AnimationEventInterface = assign({}, EventInterface, {
    animationName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), SyntheticAnimationEvent = createSyntheticEvent(AnimationEventInterface), ClipboardEventInterface = assign({}, EventInterface, {
    clipboardData: function(event) {
      return "clipboardData" in event ? event.clipboardData : window.clipboardData;
    }
  }), SyntheticClipboardEvent = createSyntheticEvent(ClipboardEventInterface), CompositionEventInterface = assign({}, EventInterface, { data: 0 }), SyntheticCompositionEvent = createSyntheticEvent(CompositionEventInterface), normalizeKey = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified"
  }, translateToKey = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta"
  }, modifierKeyToProp = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey"
  };
  function modifierStateGetter(keyArg) {
    var nativeEvent = this.nativeEvent;
    return nativeEvent.getModifierState ? nativeEvent.getModifierState(keyArg) : (keyArg = modifierKeyToProp[keyArg]) ? !!nativeEvent[keyArg] : false;
  }
  function getEventModifierState() {
    return modifierStateGetter;
  }
  var KeyboardEventInterface = assign({}, UIEventInterface, {
    key: function(nativeEvent) {
      if (nativeEvent.key) {
        var key = normalizeKey[nativeEvent.key] || nativeEvent.key;
        if ("Unidentified" !== key) return key;
      }
      return "keypress" === nativeEvent.type ? (nativeEvent = getEventCharCode(nativeEvent), 13 === nativeEvent ? "Enter" : String.fromCharCode(nativeEvent)) : "keydown" === nativeEvent.type || "keyup" === nativeEvent.type ? translateToKey[nativeEvent.keyCode] || "Unidentified" : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: getEventModifierState,
    charCode: function(event) {
      return "keypress" === event.type ? getEventCharCode(event) : 0;
    },
    keyCode: function(event) {
      return "keydown" === event.type || "keyup" === event.type ? event.keyCode : 0;
    },
    which: function(event) {
      return "keypress" === event.type ? getEventCharCode(event) : "keydown" === event.type || "keyup" === event.type ? event.keyCode : 0;
    }
  }), SyntheticKeyboardEvent = createSyntheticEvent(KeyboardEventInterface), PointerEventInterface = assign({}, MouseEventInterface, {
    pointerId: 0,
    width: 0,
    height: 0,
    pressure: 0,
    tangentialPressure: 0,
    tiltX: 0,
    tiltY: 0,
    twist: 0,
    pointerType: 0,
    isPrimary: 0
  }), SyntheticPointerEvent = createSyntheticEvent(PointerEventInterface), TouchEventInterface = assign({}, UIEventInterface, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: getEventModifierState
  }), SyntheticTouchEvent = createSyntheticEvent(TouchEventInterface), TransitionEventInterface = assign({}, EventInterface, {
    propertyName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), SyntheticTransitionEvent = createSyntheticEvent(TransitionEventInterface), WheelEventInterface = assign({}, MouseEventInterface, {
    deltaX: function(event) {
      return "deltaX" in event ? event.deltaX : "wheelDeltaX" in event ? -event.wheelDeltaX : 0;
    },
    deltaY: function(event) {
      return "deltaY" in event ? event.deltaY : "wheelDeltaY" in event ? -event.wheelDeltaY : "wheelDelta" in event ? -event.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), SyntheticWheelEvent = createSyntheticEvent(WheelEventInterface), ToggleEventInterface = assign({}, EventInterface, {
    newState: 0,
    oldState: 0
  }), SyntheticToggleEvent = createSyntheticEvent(ToggleEventInterface), END_KEYCODES = [9, 13, 27, 32], canUseCompositionEvent = canUseDOM && "CompositionEvent" in window, documentMode = null;
  canUseDOM && "documentMode" in document && (documentMode = document.documentMode);
  var canUseTextInputEvent = canUseDOM && "TextEvent" in window && !documentMode, useFallbackCompositionData = canUseDOM && (!canUseCompositionEvent || documentMode && 8 < documentMode && 11 >= documentMode), SPACEBAR_CHAR = String.fromCharCode(32), hasSpaceKeypress = false;
  function isFallbackCompositionEnd(domEventName, nativeEvent) {
    switch (domEventName) {
      case "keyup":
        return -1 !== END_KEYCODES.indexOf(nativeEvent.keyCode);
      case "keydown":
        return 229 !== nativeEvent.keyCode;
      case "keypress":
      case "mousedown":
      case "focusout":
        return true;
      default:
        return false;
    }
  }
  function getDataFromCustomEvent(nativeEvent) {
    nativeEvent = nativeEvent.detail;
    return "object" === typeof nativeEvent && "data" in nativeEvent ? nativeEvent.data : null;
  }
  var isComposing = false;
  function getNativeBeforeInputChars(domEventName, nativeEvent) {
    switch (domEventName) {
      case "compositionend":
        return getDataFromCustomEvent(nativeEvent);
      case "keypress":
        if (32 !== nativeEvent.which) return null;
        hasSpaceKeypress = true;
        return SPACEBAR_CHAR;
      case "textInput":
        return domEventName = nativeEvent.data, domEventName === SPACEBAR_CHAR && hasSpaceKeypress ? null : domEventName;
      default:
        return null;
    }
  }
  function getFallbackBeforeInputChars(domEventName, nativeEvent) {
    if (isComposing)
      return "compositionend" === domEventName || !canUseCompositionEvent && isFallbackCompositionEnd(domEventName, nativeEvent) ? (domEventName = getData(), fallbackText = startText = root = null, isComposing = false, domEventName) : null;
    switch (domEventName) {
      case "paste":
        return null;
      case "keypress":
        if (!(nativeEvent.ctrlKey || nativeEvent.altKey || nativeEvent.metaKey) || nativeEvent.ctrlKey && nativeEvent.altKey) {
          if (nativeEvent.char && 1 < nativeEvent.char.length)
            return nativeEvent.char;
          if (nativeEvent.which) return String.fromCharCode(nativeEvent.which);
        }
        return null;
      case "compositionend":
        return useFallbackCompositionData && "ko" !== nativeEvent.locale ? null : nativeEvent.data;
      default:
        return null;
    }
  }
  var supportedInputTypes = {
    color: true,
    date: true,
    datetime: true,
    "datetime-local": true,
    email: true,
    month: true,
    number: true,
    password: true,
    range: true,
    search: true,
    tel: true,
    text: true,
    time: true,
    url: true,
    week: true
  };
  function isTextInputElement(elem) {
    var nodeName = elem && elem.nodeName && elem.nodeName.toLowerCase();
    return "input" === nodeName ? !!supportedInputTypes[elem.type] : "textarea" === nodeName ? true : false;
  }
  function createAndAccumulateChangeEvent(dispatchQueue, inst, nativeEvent, target) {
    restoreTarget ? restoreQueue ? restoreQueue.push(target) : restoreQueue = [target] : restoreTarget = target;
    inst = accumulateTwoPhaseListeners(inst, "onChange");
    0 < inst.length && (nativeEvent = new SyntheticEvent(
      "onChange",
      "change",
      null,
      nativeEvent,
      target
    ), dispatchQueue.push({ event: nativeEvent, listeners: inst }));
  }
  var activeElement$1 = null, activeElementInst$1 = null;
  function runEventInBatch(dispatchQueue) {
    processDispatchQueue(dispatchQueue, 0);
  }
  function getInstIfValueChanged(targetInst) {
    var targetNode = getNodeFromInstance(targetInst);
    if (updateValueIfChanged(targetNode)) return targetInst;
  }
  function getTargetInstForChangeEvent(domEventName, targetInst) {
    if ("change" === domEventName) return targetInst;
  }
  var isInputEventSupported = false;
  if (canUseDOM) {
    var JSCompiler_inline_result$jscomp$286;
    if (canUseDOM) {
      var isSupported$jscomp$inline_427 = "oninput" in document;
      if (!isSupported$jscomp$inline_427) {
        var element$jscomp$inline_428 = document.createElement("div");
        element$jscomp$inline_428.setAttribute("oninput", "return;");
        isSupported$jscomp$inline_427 = "function" === typeof element$jscomp$inline_428.oninput;
      }
      JSCompiler_inline_result$jscomp$286 = isSupported$jscomp$inline_427;
    } else JSCompiler_inline_result$jscomp$286 = false;
    isInputEventSupported = JSCompiler_inline_result$jscomp$286 && (!document.documentMode || 9 < document.documentMode);
  }
  function stopWatchingForValueChange() {
    activeElement$1 && (activeElement$1.detachEvent("onpropertychange", handlePropertyChange), activeElementInst$1 = activeElement$1 = null);
  }
  function handlePropertyChange(nativeEvent) {
    if ("value" === nativeEvent.propertyName && getInstIfValueChanged(activeElementInst$1)) {
      var dispatchQueue = [];
      createAndAccumulateChangeEvent(
        dispatchQueue,
        activeElementInst$1,
        nativeEvent,
        getEventTarget(nativeEvent)
      );
      batchedUpdates$1(runEventInBatch, dispatchQueue);
    }
  }
  function handleEventsForInputEventPolyfill(domEventName, target, targetInst) {
    "focusin" === domEventName ? (stopWatchingForValueChange(), activeElement$1 = target, activeElementInst$1 = targetInst, activeElement$1.attachEvent("onpropertychange", handlePropertyChange)) : "focusout" === domEventName && stopWatchingForValueChange();
  }
  function getTargetInstForInputEventPolyfill(domEventName) {
    if ("selectionchange" === domEventName || "keyup" === domEventName || "keydown" === domEventName)
      return getInstIfValueChanged(activeElementInst$1);
  }
  function getTargetInstForClickEvent(domEventName, targetInst) {
    if ("click" === domEventName) return getInstIfValueChanged(targetInst);
  }
  function getTargetInstForInputOrChangeEvent(domEventName, targetInst) {
    if ("input" === domEventName || "change" === domEventName)
      return getInstIfValueChanged(targetInst);
  }
  function is(x, y) {
    return x === y && (0 !== x || 1 / x === 1 / y) || x !== x && y !== y;
  }
  var objectIs = "function" === typeof Object.is ? Object.is : is;
  function shallowEqual(objA, objB) {
    if (objectIs(objA, objB)) return true;
    if ("object" !== typeof objA || null === objA || "object" !== typeof objB || null === objB)
      return false;
    var keysA = Object.keys(objA), keysB = Object.keys(objB);
    if (keysA.length !== keysB.length) return false;
    for (keysB = 0; keysB < keysA.length; keysB++) {
      var currentKey = keysA[keysB];
      if (!hasOwnProperty.call(objB, currentKey) || !objectIs(objA[currentKey], objB[currentKey]))
        return false;
    }
    return true;
  }
  function getLeafNode(node) {
    for (; node && node.firstChild; ) node = node.firstChild;
    return node;
  }
  function getNodeForCharacterOffset(root2, offset) {
    var node = getLeafNode(root2);
    root2 = 0;
    for (var nodeEnd; node; ) {
      if (3 === node.nodeType) {
        nodeEnd = root2 + node.textContent.length;
        if (root2 <= offset && nodeEnd >= offset)
          return { node, offset: offset - root2 };
        root2 = nodeEnd;
      }
      a: {
        for (; node; ) {
          if (node.nextSibling) {
            node = node.nextSibling;
            break a;
          }
          node = node.parentNode;
        }
        node = void 0;
      }
      node = getLeafNode(node);
    }
  }
  function containsNode(outerNode, innerNode) {
    return outerNode && innerNode ? outerNode === innerNode ? true : outerNode && 3 === outerNode.nodeType ? false : innerNode && 3 === innerNode.nodeType ? containsNode(outerNode, innerNode.parentNode) : "contains" in outerNode ? outerNode.contains(innerNode) : outerNode.compareDocumentPosition ? !!(outerNode.compareDocumentPosition(innerNode) & 16) : false : false;
  }
  function getActiveElementDeep(containerInfo) {
    containerInfo = null != containerInfo && null != containerInfo.ownerDocument && null != containerInfo.ownerDocument.defaultView ? containerInfo.ownerDocument.defaultView : window;
    for (var element = getActiveElement(containerInfo.document); element instanceof containerInfo.HTMLIFrameElement; ) {
      try {
        var JSCompiler_inline_result = "string" === typeof element.contentWindow.location.href;
      } catch (err) {
        JSCompiler_inline_result = false;
      }
      if (JSCompiler_inline_result) containerInfo = element.contentWindow;
      else break;
      element = getActiveElement(containerInfo.document);
    }
    return element;
  }
  function hasSelectionCapabilities(elem) {
    var nodeName = elem && elem.nodeName && elem.nodeName.toLowerCase();
    return nodeName && ("input" === nodeName && ("text" === elem.type || "search" === elem.type || "tel" === elem.type || "url" === elem.type || "password" === elem.type) || "textarea" === nodeName || "true" === elem.contentEditable);
  }
  var skipSelectionChangeEvent = canUseDOM && "documentMode" in document && 11 >= document.documentMode, activeElement = null, activeElementInst = null, lastSelection = null, mouseDown = false;
  function constructSelectEvent(dispatchQueue, nativeEvent, nativeEventTarget) {
    var doc = nativeEventTarget.window === nativeEventTarget ? nativeEventTarget.document : 9 === nativeEventTarget.nodeType ? nativeEventTarget : nativeEventTarget.ownerDocument;
    mouseDown || null == activeElement || activeElement !== getActiveElement(doc) || (doc = activeElement, "selectionStart" in doc && hasSelectionCapabilities(doc) ? doc = { start: doc.selectionStart, end: doc.selectionEnd } : (doc = (doc.ownerDocument && doc.ownerDocument.defaultView || window).getSelection(), doc = {
      anchorNode: doc.anchorNode,
      anchorOffset: doc.anchorOffset,
      focusNode: doc.focusNode,
      focusOffset: doc.focusOffset
    }), lastSelection && shallowEqual(lastSelection, doc) || (lastSelection = doc, doc = accumulateTwoPhaseListeners(activeElementInst, "onSelect"), 0 < doc.length && (nativeEvent = new SyntheticEvent(
      "onSelect",
      "select",
      null,
      nativeEvent,
      nativeEventTarget
    ), dispatchQueue.push({ event: nativeEvent, listeners: doc }), nativeEvent.target = activeElement)));
  }
  function makePrefixMap(styleProp, eventName) {
    var prefixes = {};
    prefixes[styleProp.toLowerCase()] = eventName.toLowerCase();
    prefixes["Webkit" + styleProp] = "webkit" + eventName;
    prefixes["Moz" + styleProp] = "moz" + eventName;
    return prefixes;
  }
  var vendorPrefixes = {
    animationend: makePrefixMap("Animation", "AnimationEnd"),
    animationiteration: makePrefixMap("Animation", "AnimationIteration"),
    animationstart: makePrefixMap("Animation", "AnimationStart"),
    transitionrun: makePrefixMap("Transition", "TransitionRun"),
    transitionstart: makePrefixMap("Transition", "TransitionStart"),
    transitioncancel: makePrefixMap("Transition", "TransitionCancel"),
    transitionend: makePrefixMap("Transition", "TransitionEnd")
  }, prefixedEventNames = {}, style = {};
  canUseDOM && (style = document.createElement("div").style, "AnimationEvent" in window || (delete vendorPrefixes.animationend.animation, delete vendorPrefixes.animationiteration.animation, delete vendorPrefixes.animationstart.animation), "TransitionEvent" in window || delete vendorPrefixes.transitionend.transition);
  function getVendorPrefixedEventName(eventName) {
    if (prefixedEventNames[eventName]) return prefixedEventNames[eventName];
    if (!vendorPrefixes[eventName]) return eventName;
    var prefixMap = vendorPrefixes[eventName], styleProp;
    for (styleProp in prefixMap)
      if (prefixMap.hasOwnProperty(styleProp) && styleProp in style)
        return prefixedEventNames[eventName] = prefixMap[styleProp];
    return eventName;
  }
  var ANIMATION_END = getVendorPrefixedEventName("animationend"), ANIMATION_ITERATION = getVendorPrefixedEventName("animationiteration"), ANIMATION_START = getVendorPrefixedEventName("animationstart"), TRANSITION_RUN = getVendorPrefixedEventName("transitionrun"), TRANSITION_START = getVendorPrefixedEventName("transitionstart"), TRANSITION_CANCEL = getVendorPrefixedEventName("transitioncancel"), TRANSITION_END = getVendorPrefixedEventName("transitionend"), topLevelEventsToReactNames = /* @__PURE__ */ new Map(), simpleEventPluginEvents = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
    " "
  );
  simpleEventPluginEvents.push("scrollEnd");
  function registerSimpleEvent(domEventName, reactName) {
    topLevelEventsToReactNames.set(domEventName, reactName);
    registerTwoPhaseEvent(reactName, [domEventName]);
  }
  var reportGlobalError = "function" === typeof reportError ? reportError : function(error) {
    if ("object" === typeof window && "function" === typeof window.ErrorEvent) {
      var event = new window.ErrorEvent("error", {
        bubbles: true,
        cancelable: true,
        message: "object" === typeof error && null !== error && "string" === typeof error.message ? String(error.message) : String(error),
        error
      });
      if (!window.dispatchEvent(event)) return;
    } else if ("object" === typeof process && "function" === typeof process.emit) {
      process.emit("uncaughtException", error);
      return;
    }
    console.error(error);
  }, concurrentQueues = [], concurrentQueuesIndex = 0, concurrentlyUpdatedLanes = 0;
  function finishQueueingConcurrentUpdates() {
    for (var endIndex = concurrentQueuesIndex, i = concurrentlyUpdatedLanes = concurrentQueuesIndex = 0; i < endIndex; ) {
      var fiber = concurrentQueues[i];
      concurrentQueues[i++] = null;
      var queue = concurrentQueues[i];
      concurrentQueues[i++] = null;
      var update = concurrentQueues[i];
      concurrentQueues[i++] = null;
      var lane = concurrentQueues[i];
      concurrentQueues[i++] = null;
      if (null !== queue && null !== update) {
        var pending = queue.pending;
        null === pending ? update.next = update : (update.next = pending.next, pending.next = update);
        queue.pending = update;
      }
      0 !== lane && markUpdateLaneFromFiberToRoot(fiber, update, lane);
    }
  }
  function enqueueUpdate$1(fiber, queue, update, lane) {
    concurrentQueues[concurrentQueuesIndex++] = fiber;
    concurrentQueues[concurrentQueuesIndex++] = queue;
    concurrentQueues[concurrentQueuesIndex++] = update;
    concurrentQueues[concurrentQueuesIndex++] = lane;
    concurrentlyUpdatedLanes |= lane;
    fiber.lanes |= lane;
    fiber = fiber.alternate;
    null !== fiber && (fiber.lanes |= lane);
  }
  function enqueueConcurrentHookUpdate(fiber, queue, update, lane) {
    enqueueUpdate$1(fiber, queue, update, lane);
    return getRootForUpdatedFiber(fiber);
  }
  function enqueueConcurrentRenderForLane(fiber, lane) {
    enqueueUpdate$1(fiber, null, null, lane);
    return getRootForUpdatedFiber(fiber);
  }
  function markUpdateLaneFromFiberToRoot(sourceFiber, update, lane) {
    sourceFiber.lanes |= lane;
    var alternate = sourceFiber.alternate;
    null !== alternate && (alternate.lanes |= lane);
    for (var isHidden = false, parent = sourceFiber.return; null !== parent; )
      parent.childLanes |= lane, alternate = parent.alternate, null !== alternate && (alternate.childLanes |= lane), 22 === parent.tag && (sourceFiber = parent.stateNode, null === sourceFiber || sourceFiber._visibility & 1 || (isHidden = true)), sourceFiber = parent, parent = parent.return;
    return 3 === sourceFiber.tag ? (parent = sourceFiber.stateNode, isHidden && null !== update && (isHidden = 31 - clz32(lane), sourceFiber = parent.hiddenUpdates, alternate = sourceFiber[isHidden], null === alternate ? sourceFiber[isHidden] = [update] : alternate.push(update), update.lane = lane | 536870912), parent) : null;
  }
  function getRootForUpdatedFiber(sourceFiber) {
    if (50 < nestedUpdateCount)
      throw nestedUpdateCount = 0, rootWithNestedUpdates = null, Error(formatProdErrorMessage(185));
    for (var parent = sourceFiber.return; null !== parent; )
      sourceFiber = parent, parent = sourceFiber.return;
    return 3 === sourceFiber.tag ? sourceFiber.stateNode : null;
  }
  var emptyContextObject = {};
  function FiberNode(tag, pendingProps, key, mode) {
    this.tag = tag;
    this.key = key;
    this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null;
    this.index = 0;
    this.refCleanup = this.ref = null;
    this.pendingProps = pendingProps;
    this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null;
    this.mode = mode;
    this.subtreeFlags = this.flags = 0;
    this.deletions = null;
    this.childLanes = this.lanes = 0;
    this.alternate = null;
  }
  function createFiberImplClass(tag, pendingProps, key, mode) {
    return new FiberNode(tag, pendingProps, key, mode);
  }
  function shouldConstruct(Component) {
    Component = Component.prototype;
    return !(!Component || !Component.isReactComponent);
  }
  function createWorkInProgress(current, pendingProps) {
    var workInProgress2 = current.alternate;
    null === workInProgress2 ? (workInProgress2 = createFiberImplClass(
      current.tag,
      pendingProps,
      current.key,
      current.mode
    ), workInProgress2.elementType = current.elementType, workInProgress2.type = current.type, workInProgress2.stateNode = current.stateNode, workInProgress2.alternate = current, current.alternate = workInProgress2) : (workInProgress2.pendingProps = pendingProps, workInProgress2.type = current.type, workInProgress2.flags = 0, workInProgress2.subtreeFlags = 0, workInProgress2.deletions = null);
    workInProgress2.flags = current.flags & 65011712;
    workInProgress2.childLanes = current.childLanes;
    workInProgress2.lanes = current.lanes;
    workInProgress2.child = current.child;
    workInProgress2.memoizedProps = current.memoizedProps;
    workInProgress2.memoizedState = current.memoizedState;
    workInProgress2.updateQueue = current.updateQueue;
    pendingProps = current.dependencies;
    workInProgress2.dependencies = null === pendingProps ? null : { lanes: pendingProps.lanes, firstContext: pendingProps.firstContext };
    workInProgress2.sibling = current.sibling;
    workInProgress2.index = current.index;
    workInProgress2.ref = current.ref;
    workInProgress2.refCleanup = current.refCleanup;
    return workInProgress2;
  }
  function resetWorkInProgress(workInProgress2, renderLanes2) {
    workInProgress2.flags &= 65011714;
    var current = workInProgress2.alternate;
    null === current ? (workInProgress2.childLanes = 0, workInProgress2.lanes = renderLanes2, workInProgress2.child = null, workInProgress2.subtreeFlags = 0, workInProgress2.memoizedProps = null, workInProgress2.memoizedState = null, workInProgress2.updateQueue = null, workInProgress2.dependencies = null, workInProgress2.stateNode = null) : (workInProgress2.childLanes = current.childLanes, workInProgress2.lanes = current.lanes, workInProgress2.child = current.child, workInProgress2.subtreeFlags = 0, workInProgress2.deletions = null, workInProgress2.memoizedProps = current.memoizedProps, workInProgress2.memoizedState = current.memoizedState, workInProgress2.updateQueue = current.updateQueue, workInProgress2.type = current.type, renderLanes2 = current.dependencies, workInProgress2.dependencies = null === renderLanes2 ? null : {
      lanes: renderLanes2.lanes,
      firstContext: renderLanes2.firstContext
    });
    return workInProgress2;
  }
  function createFiberFromTypeAndProps(type, key, pendingProps, owner, mode, lanes) {
    var fiberTag = 0;
    owner = type;
    if ("function" === typeof type) shouldConstruct(type) && (fiberTag = 1);
    else if ("string" === typeof type)
      fiberTag = isHostHoistableType(
        type,
        pendingProps,
        contextStackCursor.current
      ) ? 26 : "html" === type || "head" === type || "body" === type ? 27 : 5;
    else
      a: switch (type) {
        case REACT_ACTIVITY_TYPE:
          return type = createFiberImplClass(31, pendingProps, key, mode), type.elementType = REACT_ACTIVITY_TYPE, type.lanes = lanes, type;
        case REACT_FRAGMENT_TYPE:
          return createFiberFromFragment(pendingProps.children, mode, lanes, key);
        case REACT_STRICT_MODE_TYPE:
          fiberTag = 8;
          mode |= 24;
          break;
        case REACT_PROFILER_TYPE:
          return type = createFiberImplClass(12, pendingProps, key, mode | 2), type.elementType = REACT_PROFILER_TYPE, type.lanes = lanes, type;
        case REACT_SUSPENSE_TYPE:
          return type = createFiberImplClass(13, pendingProps, key, mode), type.elementType = REACT_SUSPENSE_TYPE, type.lanes = lanes, type;
        case REACT_SUSPENSE_LIST_TYPE:
          return type = createFiberImplClass(19, pendingProps, key, mode), type.elementType = REACT_SUSPENSE_LIST_TYPE, type.lanes = lanes, type;
        default:
          if ("object" === typeof type && null !== type)
            switch (type.$$typeof) {
              case REACT_CONTEXT_TYPE:
                fiberTag = 10;
                break a;
              case REACT_CONSUMER_TYPE:
                fiberTag = 9;
                break a;
              case REACT_FORWARD_REF_TYPE:
                fiberTag = 11;
                break a;
              case REACT_MEMO_TYPE:
                fiberTag = 14;
                break a;
              case REACT_LAZY_TYPE:
                fiberTag = 16;
                owner = null;
                break a;
            }
          fiberTag = 29;
          pendingProps = Error(
            formatProdErrorMessage(130, null === type ? "null" : typeof type, "")
          );
          owner = null;
      }
    key = createFiberImplClass(fiberTag, pendingProps, key, mode);
    key.elementType = type;
    key.type = owner;
    key.lanes = lanes;
    return key;
  }
  function createFiberFromFragment(elements, mode, lanes, key) {
    elements = createFiberImplClass(7, elements, key, mode);
    elements.lanes = lanes;
    return elements;
  }
  function createFiberFromText(content, mode, lanes) {
    content = createFiberImplClass(6, content, null, mode);
    content.lanes = lanes;
    return content;
  }
  function createFiberFromDehydratedFragment(dehydratedNode) {
    var fiber = createFiberImplClass(18, null, null, 0);
    fiber.stateNode = dehydratedNode;
    return fiber;
  }
  function createFiberFromPortal(portal, mode, lanes) {
    mode = createFiberImplClass(
      4,
      null !== portal.children ? portal.children : [],
      portal.key,
      mode
    );
    mode.lanes = lanes;
    mode.stateNode = {
      containerInfo: portal.containerInfo,
      pendingChildren: null,
      implementation: portal.implementation
    };
    return mode;
  }
  var CapturedStacks = /* @__PURE__ */ new WeakMap();
  function createCapturedValueAtFiber(value, source) {
    if ("object" === typeof value && null !== value) {
      var existing = CapturedStacks.get(value);
      if (void 0 !== existing) return existing;
      source = {
        value,
        source,
        stack: getStackByFiberInDevAndProd(source)
      };
      CapturedStacks.set(value, source);
      return source;
    }
    return {
      value,
      source,
      stack: getStackByFiberInDevAndProd(source)
    };
  }
  var forkStack = [], forkStackIndex = 0, treeForkProvider = null, treeForkCount = 0, idStack = [], idStackIndex = 0, treeContextProvider = null, treeContextId = 1, treeContextOverflow = "";
  function pushTreeFork(workInProgress2, totalChildren) {
    forkStack[forkStackIndex++] = treeForkCount;
    forkStack[forkStackIndex++] = treeForkProvider;
    treeForkProvider = workInProgress2;
    treeForkCount = totalChildren;
  }
  function pushTreeId(workInProgress2, totalChildren, index2) {
    idStack[idStackIndex++] = treeContextId;
    idStack[idStackIndex++] = treeContextOverflow;
    idStack[idStackIndex++] = treeContextProvider;
    treeContextProvider = workInProgress2;
    var baseIdWithLeadingBit = treeContextId;
    workInProgress2 = treeContextOverflow;
    var baseLength = 32 - clz32(baseIdWithLeadingBit) - 1;
    baseIdWithLeadingBit &= ~(1 << baseLength);
    index2 += 1;
    var length = 32 - clz32(totalChildren) + baseLength;
    if (30 < length) {
      var numberOfOverflowBits = baseLength - baseLength % 5;
      length = (baseIdWithLeadingBit & (1 << numberOfOverflowBits) - 1).toString(32);
      baseIdWithLeadingBit >>= numberOfOverflowBits;
      baseLength -= numberOfOverflowBits;
      treeContextId = 1 << 32 - clz32(totalChildren) + baseLength | index2 << baseLength | baseIdWithLeadingBit;
      treeContextOverflow = length + workInProgress2;
    } else
      treeContextId = 1 << length | index2 << baseLength | baseIdWithLeadingBit, treeContextOverflow = workInProgress2;
  }
  function pushMaterializedTreeId(workInProgress2) {
    null !== workInProgress2.return && (pushTreeFork(workInProgress2, 1), pushTreeId(workInProgress2, 1, 0));
  }
  function popTreeContext(workInProgress2) {
    for (; workInProgress2 === treeForkProvider; )
      treeForkProvider = forkStack[--forkStackIndex], forkStack[forkStackIndex] = null, treeForkCount = forkStack[--forkStackIndex], forkStack[forkStackIndex] = null;
    for (; workInProgress2 === treeContextProvider; )
      treeContextProvider = idStack[--idStackIndex], idStack[idStackIndex] = null, treeContextOverflow = idStack[--idStackIndex], idStack[idStackIndex] = null, treeContextId = idStack[--idStackIndex], idStack[idStackIndex] = null;
  }
  function restoreSuspendedTreeContext(workInProgress2, suspendedContext) {
    idStack[idStackIndex++] = treeContextId;
    idStack[idStackIndex++] = treeContextOverflow;
    idStack[idStackIndex++] = treeContextProvider;
    treeContextId = suspendedContext.id;
    treeContextOverflow = suspendedContext.overflow;
    treeContextProvider = workInProgress2;
  }
  var hydrationParentFiber = null, nextHydratableInstance = null, isHydrating = false, hydrationErrors = null, rootOrSingletonContext = false, HydrationMismatchException = Error(formatProdErrorMessage(519));
  function throwOnHydrationMismatch(fiber) {
    var error = Error(
      formatProdErrorMessage(
        418,
        1 < arguments.length && void 0 !== arguments[1] && arguments[1] ? "text" : "HTML",
        ""
      )
    );
    queueHydrationError(createCapturedValueAtFiber(error, fiber));
    throw HydrationMismatchException;
  }
  function prepareToHydrateHostInstance(fiber) {
    var instance = fiber.stateNode, type = fiber.type, props = fiber.memoizedProps;
    instance[internalInstanceKey] = fiber;
    instance[internalPropsKey] = props;
    switch (type) {
      case "dialog":
        listenToNonDelegatedEvent("cancel", instance);
        listenToNonDelegatedEvent("close", instance);
        break;
      case "iframe":
      case "object":
      case "embed":
        listenToNonDelegatedEvent("load", instance);
        break;
      case "video":
      case "audio":
        for (type = 0; type < mediaEventTypes.length; type++)
          listenToNonDelegatedEvent(mediaEventTypes[type], instance);
        break;
      case "source":
        listenToNonDelegatedEvent("error", instance);
        break;
      case "img":
      case "image":
      case "link":
        listenToNonDelegatedEvent("error", instance);
        listenToNonDelegatedEvent("load", instance);
        break;
      case "details":
        listenToNonDelegatedEvent("toggle", instance);
        break;
      case "input":
        listenToNonDelegatedEvent("invalid", instance);
        initInput(
          instance,
          props.value,
          props.defaultValue,
          props.checked,
          props.defaultChecked,
          props.type,
          props.name,
          true
        );
        break;
      case "select":
        listenToNonDelegatedEvent("invalid", instance);
        break;
      case "textarea":
        listenToNonDelegatedEvent("invalid", instance), initTextarea(instance, props.value, props.defaultValue, props.children);
    }
    type = props.children;
    "string" !== typeof type && "number" !== typeof type && "bigint" !== typeof type || instance.textContent === "" + type || true === props.suppressHydrationWarning || checkForUnmatchedText(instance.textContent, type) ? (null != props.popover && (listenToNonDelegatedEvent("beforetoggle", instance), listenToNonDelegatedEvent("toggle", instance)), null != props.onScroll && listenToNonDelegatedEvent("scroll", instance), null != props.onScrollEnd && listenToNonDelegatedEvent("scrollend", instance), null != props.onClick && (instance.onclick = noop$1), instance = true) : instance = false;
    instance || throwOnHydrationMismatch(fiber, true);
  }
  function popToNextHostParent(fiber) {
    for (hydrationParentFiber = fiber.return; hydrationParentFiber; )
      switch (hydrationParentFiber.tag) {
        case 5:
        case 31:
        case 13:
          rootOrSingletonContext = false;
          return;
        case 27:
        case 3:
          rootOrSingletonContext = true;
          return;
        default:
          hydrationParentFiber = hydrationParentFiber.return;
      }
  }
  function popHydrationState(fiber) {
    if (fiber !== hydrationParentFiber) return false;
    if (!isHydrating) return popToNextHostParent(fiber), isHydrating = true, false;
    var tag = fiber.tag, JSCompiler_temp;
    if (JSCompiler_temp = 3 !== tag && 27 !== tag) {
      if (JSCompiler_temp = 5 === tag)
        JSCompiler_temp = fiber.type, JSCompiler_temp = !("form" !== JSCompiler_temp && "button" !== JSCompiler_temp) || shouldSetTextContent(fiber.type, fiber.memoizedProps);
      JSCompiler_temp = !JSCompiler_temp;
    }
    JSCompiler_temp && nextHydratableInstance && throwOnHydrationMismatch(fiber);
    popToNextHostParent(fiber);
    if (13 === tag) {
      fiber = fiber.memoizedState;
      fiber = null !== fiber ? fiber.dehydrated : null;
      if (!fiber) throw Error(formatProdErrorMessage(317));
      nextHydratableInstance = getNextHydratableInstanceAfterHydrationBoundary(fiber);
    } else if (31 === tag) {
      fiber = fiber.memoizedState;
      fiber = null !== fiber ? fiber.dehydrated : null;
      if (!fiber) throw Error(formatProdErrorMessage(317));
      nextHydratableInstance = getNextHydratableInstanceAfterHydrationBoundary(fiber);
    } else
      27 === tag ? (tag = nextHydratableInstance, isSingletonScope(fiber.type) ? (fiber = previousHydratableOnEnteringScopedSingleton, previousHydratableOnEnteringScopedSingleton = null, nextHydratableInstance = fiber) : nextHydratableInstance = tag) : nextHydratableInstance = hydrationParentFiber ? getNextHydratable(fiber.stateNode.nextSibling) : null;
    return true;
  }
  function resetHydrationState() {
    nextHydratableInstance = hydrationParentFiber = null;
    isHydrating = false;
  }
  function upgradeHydrationErrorsToRecoverable() {
    var queuedErrors = hydrationErrors;
    null !== queuedErrors && (null === workInProgressRootRecoverableErrors ? workInProgressRootRecoverableErrors = queuedErrors : workInProgressRootRecoverableErrors.push.apply(
      workInProgressRootRecoverableErrors,
      queuedErrors
    ), hydrationErrors = null);
    return queuedErrors;
  }
  function queueHydrationError(error) {
    null === hydrationErrors ? hydrationErrors = [error] : hydrationErrors.push(error);
  }
  var valueCursor = createCursor(null), currentlyRenderingFiber$1 = null, lastContextDependency = null;
  function pushProvider(providerFiber, context, nextValue) {
    push(valueCursor, context._currentValue);
    context._currentValue = nextValue;
  }
  function popProvider(context) {
    context._currentValue = valueCursor.current;
    pop(valueCursor);
  }
  function scheduleContextWorkOnParentPath(parent, renderLanes2, propagationRoot) {
    for (; null !== parent; ) {
      var alternate = parent.alternate;
      (parent.childLanes & renderLanes2) !== renderLanes2 ? (parent.childLanes |= renderLanes2, null !== alternate && (alternate.childLanes |= renderLanes2)) : null !== alternate && (alternate.childLanes & renderLanes2) !== renderLanes2 && (alternate.childLanes |= renderLanes2);
      if (parent === propagationRoot) break;
      parent = parent.return;
    }
  }
  function propagateContextChanges(workInProgress2, contexts, renderLanes2, forcePropagateEntireTree) {
    var fiber = workInProgress2.child;
    null !== fiber && (fiber.return = workInProgress2);
    for (; null !== fiber; ) {
      var list = fiber.dependencies;
      if (null !== list) {
        var nextFiber = fiber.child;
        list = list.firstContext;
        a: for (; null !== list; ) {
          var dependency = list;
          list = fiber;
          for (var i = 0; i < contexts.length; i++)
            if (dependency.context === contexts[i]) {
              list.lanes |= renderLanes2;
              dependency = list.alternate;
              null !== dependency && (dependency.lanes |= renderLanes2);
              scheduleContextWorkOnParentPath(
                list.return,
                renderLanes2,
                workInProgress2
              );
              forcePropagateEntireTree || (nextFiber = null);
              break a;
            }
          list = dependency.next;
        }
      } else if (18 === fiber.tag) {
        nextFiber = fiber.return;
        if (null === nextFiber) throw Error(formatProdErrorMessage(341));
        nextFiber.lanes |= renderLanes2;
        list = nextFiber.alternate;
        null !== list && (list.lanes |= renderLanes2);
        scheduleContextWorkOnParentPath(nextFiber, renderLanes2, workInProgress2);
        nextFiber = null;
      } else nextFiber = fiber.child;
      if (null !== nextFiber) nextFiber.return = fiber;
      else
        for (nextFiber = fiber; null !== nextFiber; ) {
          if (nextFiber === workInProgress2) {
            nextFiber = null;
            break;
          }
          fiber = nextFiber.sibling;
          if (null !== fiber) {
            fiber.return = nextFiber.return;
            nextFiber = fiber;
            break;
          }
          nextFiber = nextFiber.return;
        }
      fiber = nextFiber;
    }
  }
  function propagateParentContextChanges(current, workInProgress2, renderLanes2, forcePropagateEntireTree) {
    current = null;
    for (var parent = workInProgress2, isInsidePropagationBailout = false; null !== parent; ) {
      if (!isInsidePropagationBailout) {
        if (0 !== (parent.flags & 524288)) isInsidePropagationBailout = true;
        else if (0 !== (parent.flags & 262144)) break;
      }
      if (10 === parent.tag) {
        var currentParent = parent.alternate;
        if (null === currentParent) throw Error(formatProdErrorMessage(387));
        currentParent = currentParent.memoizedProps;
        if (null !== currentParent) {
          var context = parent.type;
          objectIs(parent.pendingProps.value, currentParent.value) || (null !== current ? current.push(context) : current = [context]);
        }
      } else if (parent === hostTransitionProviderCursor.current) {
        currentParent = parent.alternate;
        if (null === currentParent) throw Error(formatProdErrorMessage(387));
        currentParent.memoizedState.memoizedState !== parent.memoizedState.memoizedState && (null !== current ? current.push(HostTransitionContext) : current = [HostTransitionContext]);
      }
      parent = parent.return;
    }
    null !== current && propagateContextChanges(
      workInProgress2,
      current,
      renderLanes2,
      forcePropagateEntireTree
    );
    workInProgress2.flags |= 262144;
  }
  function checkIfContextChanged(currentDependencies) {
    for (currentDependencies = currentDependencies.firstContext; null !== currentDependencies; ) {
      if (!objectIs(
        currentDependencies.context._currentValue,
        currentDependencies.memoizedValue
      ))
        return true;
      currentDependencies = currentDependencies.next;
    }
    return false;
  }
  function prepareToReadContext(workInProgress2) {
    currentlyRenderingFiber$1 = workInProgress2;
    lastContextDependency = null;
    workInProgress2 = workInProgress2.dependencies;
    null !== workInProgress2 && (workInProgress2.firstContext = null);
  }
  function readContext(context) {
    return readContextForConsumer(currentlyRenderingFiber$1, context);
  }
  function readContextDuringReconciliation(consumer, context) {
    null === currentlyRenderingFiber$1 && prepareToReadContext(consumer);
    return readContextForConsumer(consumer, context);
  }
  function readContextForConsumer(consumer, context) {
    var value = context._currentValue;
    context = { context, memoizedValue: value, next: null };
    if (null === lastContextDependency) {
      if (null === consumer) throw Error(formatProdErrorMessage(308));
      lastContextDependency = context;
      consumer.dependencies = { lanes: 0, firstContext: context };
      consumer.flags |= 524288;
    } else lastContextDependency = lastContextDependency.next = context;
    return value;
  }
  var AbortControllerLocal = "undefined" !== typeof AbortController ? AbortController : function() {
    var listeners = [], signal = this.signal = {
      aborted: false,
      addEventListener: function(type, listener) {
        listeners.push(listener);
      }
    };
    this.abort = function() {
      signal.aborted = true;
      listeners.forEach(function(listener) {
        return listener();
      });
    };
  }, scheduleCallback$2 = Scheduler.unstable_scheduleCallback, NormalPriority = Scheduler.unstable_NormalPriority, CacheContext = {
    $$typeof: REACT_CONTEXT_TYPE,
    Consumer: null,
    Provider: null,
    _currentValue: null,
    _currentValue2: null,
    _threadCount: 0
  };
  function createCache() {
    return {
      controller: new AbortControllerLocal(),
      data: /* @__PURE__ */ new Map(),
      refCount: 0
    };
  }
  function releaseCache(cache) {
    cache.refCount--;
    0 === cache.refCount && scheduleCallback$2(NormalPriority, function() {
      cache.controller.abort();
    });
  }
  var currentEntangledListeners = null, currentEntangledPendingCount = 0, currentEntangledLane = 0, currentEntangledActionThenable = null;
  function entangleAsyncAction(transition, thenable) {
    if (null === currentEntangledListeners) {
      var entangledListeners = currentEntangledListeners = [];
      currentEntangledPendingCount = 0;
      currentEntangledLane = requestTransitionLane();
      currentEntangledActionThenable = {
        status: "pending",
        value: void 0,
        then: function(resolve) {
          entangledListeners.push(resolve);
        }
      };
    }
    currentEntangledPendingCount++;
    thenable.then(pingEngtangledActionScope, pingEngtangledActionScope);
    return thenable;
  }
  function pingEngtangledActionScope() {
    if (0 === --currentEntangledPendingCount && null !== currentEntangledListeners) {
      null !== currentEntangledActionThenable && (currentEntangledActionThenable.status = "fulfilled");
      var listeners = currentEntangledListeners;
      currentEntangledListeners = null;
      currentEntangledLane = 0;
      currentEntangledActionThenable = null;
      for (var i = 0; i < listeners.length; i++) (0, listeners[i])();
    }
  }
  function chainThenableValue(thenable, result) {
    var listeners = [], thenableWithOverride = {
      status: "pending",
      value: null,
      reason: null,
      then: function(resolve) {
        listeners.push(resolve);
      }
    };
    thenable.then(
      function() {
        thenableWithOverride.status = "fulfilled";
        thenableWithOverride.value = result;
        for (var i = 0; i < listeners.length; i++) (0, listeners[i])(result);
      },
      function(error) {
        thenableWithOverride.status = "rejected";
        thenableWithOverride.reason = error;
        for (error = 0; error < listeners.length; error++)
          (0, listeners[error])(void 0);
      }
    );
    return thenableWithOverride;
  }
  var prevOnStartTransitionFinish = ReactSharedInternals.S;
  ReactSharedInternals.S = function(transition, returnValue) {
    globalMostRecentTransitionTime = now();
    "object" === typeof returnValue && null !== returnValue && "function" === typeof returnValue.then && entangleAsyncAction(transition, returnValue);
    null !== prevOnStartTransitionFinish && prevOnStartTransitionFinish(transition, returnValue);
  };
  var resumedCache = createCursor(null);
  function peekCacheFromPool() {
    var cacheResumedFromPreviousRender = resumedCache.current;
    return null !== cacheResumedFromPreviousRender ? cacheResumedFromPreviousRender : workInProgressRoot.pooledCache;
  }
  function pushTransition(offscreenWorkInProgress, prevCachePool) {
    null === prevCachePool ? push(resumedCache, resumedCache.current) : push(resumedCache, prevCachePool.pool);
  }
  function getSuspendedCache() {
    var cacheFromPool = peekCacheFromPool();
    return null === cacheFromPool ? null : { parent: CacheContext._currentValue, pool: cacheFromPool };
  }
  var SuspenseException = Error(formatProdErrorMessage(460)), SuspenseyCommitException = Error(formatProdErrorMessage(474)), SuspenseActionException = Error(formatProdErrorMessage(542)), noopSuspenseyCommitThenable = { then: function() {
  } };
  function isThenableResolved(thenable) {
    thenable = thenable.status;
    return "fulfilled" === thenable || "rejected" === thenable;
  }
  function trackUsedThenable(thenableState2, thenable, index2) {
    index2 = thenableState2[index2];
    void 0 === index2 ? thenableState2.push(thenable) : index2 !== thenable && (thenable.then(noop$1, noop$1), thenable = index2);
    switch (thenable.status) {
      case "fulfilled":
        return thenable.value;
      case "rejected":
        throw thenableState2 = thenable.reason, checkIfUseWrappedInAsyncCatch(thenableState2), thenableState2;
      default:
        if ("string" === typeof thenable.status) thenable.then(noop$1, noop$1);
        else {
          thenableState2 = workInProgressRoot;
          if (null !== thenableState2 && 100 < thenableState2.shellSuspendCounter)
            throw Error(formatProdErrorMessage(482));
          thenableState2 = thenable;
          thenableState2.status = "pending";
          thenableState2.then(
            function(fulfilledValue) {
              if ("pending" === thenable.status) {
                var fulfilledThenable = thenable;
                fulfilledThenable.status = "fulfilled";
                fulfilledThenable.value = fulfilledValue;
              }
            },
            function(error) {
              if ("pending" === thenable.status) {
                var rejectedThenable = thenable;
                rejectedThenable.status = "rejected";
                rejectedThenable.reason = error;
              }
            }
          );
        }
        switch (thenable.status) {
          case "fulfilled":
            return thenable.value;
          case "rejected":
            throw thenableState2 = thenable.reason, checkIfUseWrappedInAsyncCatch(thenableState2), thenableState2;
        }
        suspendedThenable = thenable;
        throw SuspenseException;
    }
  }
  function resolveLazy(lazyType) {
    try {
      var init = lazyType._init;
      return init(lazyType._payload);
    } catch (x) {
      if (null !== x && "object" === typeof x && "function" === typeof x.then)
        throw suspendedThenable = x, SuspenseException;
      throw x;
    }
  }
  var suspendedThenable = null;
  function getSuspendedThenable() {
    if (null === suspendedThenable) throw Error(formatProdErrorMessage(459));
    var thenable = suspendedThenable;
    suspendedThenable = null;
    return thenable;
  }
  function checkIfUseWrappedInAsyncCatch(rejectedReason) {
    if (rejectedReason === SuspenseException || rejectedReason === SuspenseActionException)
      throw Error(formatProdErrorMessage(483));
  }
  var thenableState$1 = null, thenableIndexCounter$1 = 0;
  function unwrapThenable(thenable) {
    var index2 = thenableIndexCounter$1;
    thenableIndexCounter$1 += 1;
    null === thenableState$1 && (thenableState$1 = []);
    return trackUsedThenable(thenableState$1, thenable, index2);
  }
  function coerceRef(workInProgress2, element) {
    element = element.props.ref;
    workInProgress2.ref = void 0 !== element ? element : null;
  }
  function throwOnInvalidObjectTypeImpl(returnFiber, newChild) {
    if (newChild.$$typeof === REACT_LEGACY_ELEMENT_TYPE)
      throw Error(formatProdErrorMessage(525));
    returnFiber = Object.prototype.toString.call(newChild);
    throw Error(
      formatProdErrorMessage(
        31,
        "[object Object]" === returnFiber ? "object with keys {" + Object.keys(newChild).join(", ") + "}" : returnFiber
      )
    );
  }
  function createChildReconciler(shouldTrackSideEffects) {
    function deleteChild(returnFiber, childToDelete) {
      if (shouldTrackSideEffects) {
        var deletions = returnFiber.deletions;
        null === deletions ? (returnFiber.deletions = [childToDelete], returnFiber.flags |= 16) : deletions.push(childToDelete);
      }
    }
    function deleteRemainingChildren(returnFiber, currentFirstChild) {
      if (!shouldTrackSideEffects) return null;
      for (; null !== currentFirstChild; )
        deleteChild(returnFiber, currentFirstChild), currentFirstChild = currentFirstChild.sibling;
      return null;
    }
    function mapRemainingChildren(currentFirstChild) {
      for (var existingChildren = /* @__PURE__ */ new Map(); null !== currentFirstChild; )
        null !== currentFirstChild.key ? existingChildren.set(currentFirstChild.key, currentFirstChild) : existingChildren.set(currentFirstChild.index, currentFirstChild), currentFirstChild = currentFirstChild.sibling;
      return existingChildren;
    }
    function useFiber(fiber, pendingProps) {
      fiber = createWorkInProgress(fiber, pendingProps);
      fiber.index = 0;
      fiber.sibling = null;
      return fiber;
    }
    function placeChild(newFiber, lastPlacedIndex, newIndex) {
      newFiber.index = newIndex;
      if (!shouldTrackSideEffects)
        return newFiber.flags |= 1048576, lastPlacedIndex;
      newIndex = newFiber.alternate;
      if (null !== newIndex)
        return newIndex = newIndex.index, newIndex < lastPlacedIndex ? (newFiber.flags |= 67108866, lastPlacedIndex) : newIndex;
      newFiber.flags |= 67108866;
      return lastPlacedIndex;
    }
    function placeSingleChild(newFiber) {
      shouldTrackSideEffects && null === newFiber.alternate && (newFiber.flags |= 67108866);
      return newFiber;
    }
    function updateTextNode(returnFiber, current, textContent, lanes) {
      if (null === current || 6 !== current.tag)
        return current = createFiberFromText(textContent, returnFiber.mode, lanes), current.return = returnFiber, current;
      current = useFiber(current, textContent);
      current.return = returnFiber;
      return current;
    }
    function updateElement(returnFiber, current, element, lanes) {
      var elementType = element.type;
      if (elementType === REACT_FRAGMENT_TYPE)
        return updateFragment(
          returnFiber,
          current,
          element.props.children,
          lanes,
          element.key
        );
      if (null !== current && (current.elementType === elementType || "object" === typeof elementType && null !== elementType && elementType.$$typeof === REACT_LAZY_TYPE && resolveLazy(elementType) === current.type))
        return current = useFiber(current, element.props), coerceRef(current, element), current.return = returnFiber, current;
      current = createFiberFromTypeAndProps(
        element.type,
        element.key,
        element.props,
        null,
        returnFiber.mode,
        lanes
      );
      coerceRef(current, element);
      current.return = returnFiber;
      return current;
    }
    function updatePortal(returnFiber, current, portal, lanes) {
      if (null === current || 4 !== current.tag || current.stateNode.containerInfo !== portal.containerInfo || current.stateNode.implementation !== portal.implementation)
        return current = createFiberFromPortal(portal, returnFiber.mode, lanes), current.return = returnFiber, current;
      current = useFiber(current, portal.children || []);
      current.return = returnFiber;
      return current;
    }
    function updateFragment(returnFiber, current, fragment, lanes, key) {
      if (null === current || 7 !== current.tag)
        return current = createFiberFromFragment(
          fragment,
          returnFiber.mode,
          lanes,
          key
        ), current.return = returnFiber, current;
      current = useFiber(current, fragment);
      current.return = returnFiber;
      return current;
    }
    function createChild(returnFiber, newChild, lanes) {
      if ("string" === typeof newChild && "" !== newChild || "number" === typeof newChild || "bigint" === typeof newChild)
        return newChild = createFiberFromText(
          "" + newChild,
          returnFiber.mode,
          lanes
        ), newChild.return = returnFiber, newChild;
      if ("object" === typeof newChild && null !== newChild) {
        switch (newChild.$$typeof) {
          case REACT_ELEMENT_TYPE:
            return lanes = createFiberFromTypeAndProps(
              newChild.type,
              newChild.key,
              newChild.props,
              null,
              returnFiber.mode,
              lanes
            ), coerceRef(lanes, newChild), lanes.return = returnFiber, lanes;
          case REACT_PORTAL_TYPE:
            return newChild = createFiberFromPortal(
              newChild,
              returnFiber.mode,
              lanes
            ), newChild.return = returnFiber, newChild;
          case REACT_LAZY_TYPE:
            return newChild = resolveLazy(newChild), createChild(returnFiber, newChild, lanes);
        }
        if (isArrayImpl(newChild) || getIteratorFn(newChild))
          return newChild = createFiberFromFragment(
            newChild,
            returnFiber.mode,
            lanes,
            null
          ), newChild.return = returnFiber, newChild;
        if ("function" === typeof newChild.then)
          return createChild(returnFiber, unwrapThenable(newChild), lanes);
        if (newChild.$$typeof === REACT_CONTEXT_TYPE)
          return createChild(
            returnFiber,
            readContextDuringReconciliation(returnFiber, newChild),
            lanes
          );
        throwOnInvalidObjectTypeImpl(returnFiber, newChild);
      }
      return null;
    }
    function updateSlot(returnFiber, oldFiber, newChild, lanes) {
      var key = null !== oldFiber ? oldFiber.key : null;
      if ("string" === typeof newChild && "" !== newChild || "number" === typeof newChild || "bigint" === typeof newChild)
        return null !== key ? null : updateTextNode(returnFiber, oldFiber, "" + newChild, lanes);
      if ("object" === typeof newChild && null !== newChild) {
        switch (newChild.$$typeof) {
          case REACT_ELEMENT_TYPE:
            return newChild.key === key ? updateElement(returnFiber, oldFiber, newChild, lanes) : null;
          case REACT_PORTAL_TYPE:
            return newChild.key === key ? updatePortal(returnFiber, oldFiber, newChild, lanes) : null;
          case REACT_LAZY_TYPE:
            return newChild = resolveLazy(newChild), updateSlot(returnFiber, oldFiber, newChild, lanes);
        }
        if (isArrayImpl(newChild) || getIteratorFn(newChild))
          return null !== key ? null : updateFragment(returnFiber, oldFiber, newChild, lanes, null);
        if ("function" === typeof newChild.then)
          return updateSlot(
            returnFiber,
            oldFiber,
            unwrapThenable(newChild),
            lanes
          );
        if (newChild.$$typeof === REACT_CONTEXT_TYPE)
          return updateSlot(
            returnFiber,
            oldFiber,
            readContextDuringReconciliation(returnFiber, newChild),
            lanes
          );
        throwOnInvalidObjectTypeImpl(returnFiber, newChild);
      }
      return null;
    }
    function updateFromMap(existingChildren, returnFiber, newIdx, newChild, lanes) {
      if ("string" === typeof newChild && "" !== newChild || "number" === typeof newChild || "bigint" === typeof newChild)
        return existingChildren = existingChildren.get(newIdx) || null, updateTextNode(returnFiber, existingChildren, "" + newChild, lanes);
      if ("object" === typeof newChild && null !== newChild) {
        switch (newChild.$$typeof) {
          case REACT_ELEMENT_TYPE:
            return existingChildren = existingChildren.get(
              null === newChild.key ? newIdx : newChild.key
            ) || null, updateElement(returnFiber, existingChildren, newChild, lanes);
          case REACT_PORTAL_TYPE:
            return existingChildren = existingChildren.get(
              null === newChild.key ? newIdx : newChild.key
            ) || null, updatePortal(returnFiber, existingChildren, newChild, lanes);
          case REACT_LAZY_TYPE:
            return newChild = resolveLazy(newChild), updateFromMap(
              existingChildren,
              returnFiber,
              newIdx,
              newChild,
              lanes
            );
        }
        if (isArrayImpl(newChild) || getIteratorFn(newChild))
          return existingChildren = existingChildren.get(newIdx) || null, updateFragment(returnFiber, existingChildren, newChild, lanes, null);
        if ("function" === typeof newChild.then)
          return updateFromMap(
            existingChildren,
            returnFiber,
            newIdx,
            unwrapThenable(newChild),
            lanes
          );
        if (newChild.$$typeof === REACT_CONTEXT_TYPE)
          return updateFromMap(
            existingChildren,
            returnFiber,
            newIdx,
            readContextDuringReconciliation(returnFiber, newChild),
            lanes
          );
        throwOnInvalidObjectTypeImpl(returnFiber, newChild);
      }
      return null;
    }
    function reconcileChildrenArray(returnFiber, currentFirstChild, newChildren, lanes) {
      for (var resultingFirstChild = null, previousNewFiber = null, oldFiber = currentFirstChild, newIdx = currentFirstChild = 0, nextOldFiber = null; null !== oldFiber && newIdx < newChildren.length; newIdx++) {
        oldFiber.index > newIdx ? (nextOldFiber = oldFiber, oldFiber = null) : nextOldFiber = oldFiber.sibling;
        var newFiber = updateSlot(
          returnFiber,
          oldFiber,
          newChildren[newIdx],
          lanes
        );
        if (null === newFiber) {
          null === oldFiber && (oldFiber = nextOldFiber);
          break;
        }
        shouldTrackSideEffects && oldFiber && null === newFiber.alternate && deleteChild(returnFiber, oldFiber);
        currentFirstChild = placeChild(newFiber, currentFirstChild, newIdx);
        null === previousNewFiber ? resultingFirstChild = newFiber : previousNewFiber.sibling = newFiber;
        previousNewFiber = newFiber;
        oldFiber = nextOldFiber;
      }
      if (newIdx === newChildren.length)
        return deleteRemainingChildren(returnFiber, oldFiber), isHydrating && pushTreeFork(returnFiber, newIdx), resultingFirstChild;
      if (null === oldFiber) {
        for (; newIdx < newChildren.length; newIdx++)
          oldFiber = createChild(returnFiber, newChildren[newIdx], lanes), null !== oldFiber && (currentFirstChild = placeChild(
            oldFiber,
            currentFirstChild,
            newIdx
          ), null === previousNewFiber ? resultingFirstChild = oldFiber : previousNewFiber.sibling = oldFiber, previousNewFiber = oldFiber);
        isHydrating && pushTreeFork(returnFiber, newIdx);
        return resultingFirstChild;
      }
      for (oldFiber = mapRemainingChildren(oldFiber); newIdx < newChildren.length; newIdx++)
        nextOldFiber = updateFromMap(
          oldFiber,
          returnFiber,
          newIdx,
          newChildren[newIdx],
          lanes
        ), null !== nextOldFiber && (shouldTrackSideEffects && null !== nextOldFiber.alternate && oldFiber.delete(
          null === nextOldFiber.key ? newIdx : nextOldFiber.key
        ), currentFirstChild = placeChild(
          nextOldFiber,
          currentFirstChild,
          newIdx
        ), null === previousNewFiber ? resultingFirstChild = nextOldFiber : previousNewFiber.sibling = nextOldFiber, previousNewFiber = nextOldFiber);
      shouldTrackSideEffects && oldFiber.forEach(function(child) {
        return deleteChild(returnFiber, child);
      });
      isHydrating && pushTreeFork(returnFiber, newIdx);
      return resultingFirstChild;
    }
    function reconcileChildrenIterator(returnFiber, currentFirstChild, newChildren, lanes) {
      if (null == newChildren) throw Error(formatProdErrorMessage(151));
      for (var resultingFirstChild = null, previousNewFiber = null, oldFiber = currentFirstChild, newIdx = currentFirstChild = 0, nextOldFiber = null, step = newChildren.next(); null !== oldFiber && !step.done; newIdx++, step = newChildren.next()) {
        oldFiber.index > newIdx ? (nextOldFiber = oldFiber, oldFiber = null) : nextOldFiber = oldFiber.sibling;
        var newFiber = updateSlot(returnFiber, oldFiber, step.value, lanes);
        if (null === newFiber) {
          null === oldFiber && (oldFiber = nextOldFiber);
          break;
        }
        shouldTrackSideEffects && oldFiber && null === newFiber.alternate && deleteChild(returnFiber, oldFiber);
        currentFirstChild = placeChild(newFiber, currentFirstChild, newIdx);
        null === previousNewFiber ? resultingFirstChild = newFiber : previousNewFiber.sibling = newFiber;
        previousNewFiber = newFiber;
        oldFiber = nextOldFiber;
      }
      if (step.done)
        return deleteRemainingChildren(returnFiber, oldFiber), isHydrating && pushTreeFork(returnFiber, newIdx), resultingFirstChild;
      if (null === oldFiber) {
        for (; !step.done; newIdx++, step = newChildren.next())
          step = createChild(returnFiber, step.value, lanes), null !== step && (currentFirstChild = placeChild(step, currentFirstChild, newIdx), null === previousNewFiber ? resultingFirstChild = step : previousNewFiber.sibling = step, previousNewFiber = step);
        isHydrating && pushTreeFork(returnFiber, newIdx);
        return resultingFirstChild;
      }
      for (oldFiber = mapRemainingChildren(oldFiber); !step.done; newIdx++, step = newChildren.next())
        step = updateFromMap(oldFiber, returnFiber, newIdx, step.value, lanes), null !== step && (shouldTrackSideEffects && null !== step.alternate && oldFiber.delete(null === step.key ? newIdx : step.key), currentFirstChild = placeChild(step, currentFirstChild, newIdx), null === previousNewFiber ? resultingFirstChild = step : previousNewFiber.sibling = step, previousNewFiber = step);
      shouldTrackSideEffects && oldFiber.forEach(function(child) {
        return deleteChild(returnFiber, child);
      });
      isHydrating && pushTreeFork(returnFiber, newIdx);
      return resultingFirstChild;
    }
    function reconcileChildFibersImpl(returnFiber, currentFirstChild, newChild, lanes) {
      "object" === typeof newChild && null !== newChild && newChild.type === REACT_FRAGMENT_TYPE && null === newChild.key && (newChild = newChild.props.children);
      if ("object" === typeof newChild && null !== newChild) {
        switch (newChild.$$typeof) {
          case REACT_ELEMENT_TYPE:
            a: {
              for (var key = newChild.key; null !== currentFirstChild; ) {
                if (currentFirstChild.key === key) {
                  key = newChild.type;
                  if (key === REACT_FRAGMENT_TYPE) {
                    if (7 === currentFirstChild.tag) {
                      deleteRemainingChildren(
                        returnFiber,
                        currentFirstChild.sibling
                      );
                      lanes = useFiber(
                        currentFirstChild,
                        newChild.props.children
                      );
                      lanes.return = returnFiber;
                      returnFiber = lanes;
                      break a;
                    }
                  } else if (currentFirstChild.elementType === key || "object" === typeof key && null !== key && key.$$typeof === REACT_LAZY_TYPE && resolveLazy(key) === currentFirstChild.type) {
                    deleteRemainingChildren(
                      returnFiber,
                      currentFirstChild.sibling
                    );
                    lanes = useFiber(currentFirstChild, newChild.props);
                    coerceRef(lanes, newChild);
                    lanes.return = returnFiber;
                    returnFiber = lanes;
                    break a;
                  }
                  deleteRemainingChildren(returnFiber, currentFirstChild);
                  break;
                } else deleteChild(returnFiber, currentFirstChild);
                currentFirstChild = currentFirstChild.sibling;
              }
              newChild.type === REACT_FRAGMENT_TYPE ? (lanes = createFiberFromFragment(
                newChild.props.children,
                returnFiber.mode,
                lanes,
                newChild.key
              ), lanes.return = returnFiber, returnFiber = lanes) : (lanes = createFiberFromTypeAndProps(
                newChild.type,
                newChild.key,
                newChild.props,
                null,
                returnFiber.mode,
                lanes
              ), coerceRef(lanes, newChild), lanes.return = returnFiber, returnFiber = lanes);
            }
            return placeSingleChild(returnFiber);
          case REACT_PORTAL_TYPE:
            a: {
              for (key = newChild.key; null !== currentFirstChild; ) {
                if (currentFirstChild.key === key)
                  if (4 === currentFirstChild.tag && currentFirstChild.stateNode.containerInfo === newChild.containerInfo && currentFirstChild.stateNode.implementation === newChild.implementation) {
                    deleteRemainingChildren(
                      returnFiber,
                      currentFirstChild.sibling
                    );
                    lanes = useFiber(currentFirstChild, newChild.children || []);
                    lanes.return = returnFiber;
                    returnFiber = lanes;
                    break a;
                  } else {
                    deleteRemainingChildren(returnFiber, currentFirstChild);
                    break;
                  }
                else deleteChild(returnFiber, currentFirstChild);
                currentFirstChild = currentFirstChild.sibling;
              }
              lanes = createFiberFromPortal(newChild, returnFiber.mode, lanes);
              lanes.return = returnFiber;
              returnFiber = lanes;
            }
            return placeSingleChild(returnFiber);
          case REACT_LAZY_TYPE:
            return newChild = resolveLazy(newChild), reconcileChildFibersImpl(
              returnFiber,
              currentFirstChild,
              newChild,
              lanes
            );
        }
        if (isArrayImpl(newChild))
          return reconcileChildrenArray(
            returnFiber,
            currentFirstChild,
            newChild,
            lanes
          );
        if (getIteratorFn(newChild)) {
          key = getIteratorFn(newChild);
          if ("function" !== typeof key) throw Error(formatProdErrorMessage(150));
          newChild = key.call(newChild);
          return reconcileChildrenIterator(
            returnFiber,
            currentFirstChild,
            newChild,
            lanes
          );
        }
        if ("function" === typeof newChild.then)
          return reconcileChildFibersImpl(
            returnFiber,
            currentFirstChild,
            unwrapThenable(newChild),
            lanes
          );
        if (newChild.$$typeof === REACT_CONTEXT_TYPE)
          return reconcileChildFibersImpl(
            returnFiber,
            currentFirstChild,
            readContextDuringReconciliation(returnFiber, newChild),
            lanes
          );
        throwOnInvalidObjectTypeImpl(returnFiber, newChild);
      }
      return "string" === typeof newChild && "" !== newChild || "number" === typeof newChild || "bigint" === typeof newChild ? (newChild = "" + newChild, null !== currentFirstChild && 6 === currentFirstChild.tag ? (deleteRemainingChildren(returnFiber, currentFirstChild.sibling), lanes = useFiber(currentFirstChild, newChild), lanes.return = returnFiber, returnFiber = lanes) : (deleteRemainingChildren(returnFiber, currentFirstChild), lanes = createFiberFromText(newChild, returnFiber.mode, lanes), lanes.return = returnFiber, returnFiber = lanes), placeSingleChild(returnFiber)) : deleteRemainingChildren(returnFiber, currentFirstChild);
    }
    return function(returnFiber, currentFirstChild, newChild, lanes) {
      try {
        thenableIndexCounter$1 = 0;
        var firstChildFiber = reconcileChildFibersImpl(
          returnFiber,
          currentFirstChild,
          newChild,
          lanes
        );
        thenableState$1 = null;
        return firstChildFiber;
      } catch (x) {
        if (x === SuspenseException || x === SuspenseActionException) throw x;
        var fiber = createFiberImplClass(29, x, null, returnFiber.mode);
        fiber.lanes = lanes;
        fiber.return = returnFiber;
        return fiber;
      } finally {
      }
    };
  }
  var reconcileChildFibers = createChildReconciler(true), mountChildFibers = createChildReconciler(false), hasForceUpdate = false;
  function initializeUpdateQueue(fiber) {
    fiber.updateQueue = {
      baseState: fiber.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null
    };
  }
  function cloneUpdateQueue(current, workInProgress2) {
    current = current.updateQueue;
    workInProgress2.updateQueue === current && (workInProgress2.updateQueue = {
      baseState: current.baseState,
      firstBaseUpdate: current.firstBaseUpdate,
      lastBaseUpdate: current.lastBaseUpdate,
      shared: current.shared,
      callbacks: null
    });
  }
  function createUpdate(lane) {
    return { lane, tag: 0, payload: null, callback: null, next: null };
  }
  function enqueueUpdate(fiber, update, lane) {
    var updateQueue = fiber.updateQueue;
    if (null === updateQueue) return null;
    updateQueue = updateQueue.shared;
    if (0 !== (executionContext & 2)) {
      var pending = updateQueue.pending;
      null === pending ? update.next = update : (update.next = pending.next, pending.next = update);
      updateQueue.pending = update;
      update = getRootForUpdatedFiber(fiber);
      markUpdateLaneFromFiberToRoot(fiber, null, lane);
      return update;
    }
    enqueueUpdate$1(fiber, updateQueue, update, lane);
    return getRootForUpdatedFiber(fiber);
  }
  function entangleTransitions(root2, fiber, lane) {
    fiber = fiber.updateQueue;
    if (null !== fiber && (fiber = fiber.shared, 0 !== (lane & 4194048))) {
      var queueLanes = fiber.lanes;
      queueLanes &= root2.pendingLanes;
      lane |= queueLanes;
      fiber.lanes = lane;
      markRootEntangled(root2, lane);
    }
  }
  function enqueueCapturedUpdate(workInProgress2, capturedUpdate) {
    var queue = workInProgress2.updateQueue, current = workInProgress2.alternate;
    if (null !== current && (current = current.updateQueue, queue === current)) {
      var newFirst = null, newLast = null;
      queue = queue.firstBaseUpdate;
      if (null !== queue) {
        do {
          var clone = {
            lane: queue.lane,
            tag: queue.tag,
            payload: queue.payload,
            callback: null,
            next: null
          };
          null === newLast ? newFirst = newLast = clone : newLast = newLast.next = clone;
          queue = queue.next;
        } while (null !== queue);
        null === newLast ? newFirst = newLast = capturedUpdate : newLast = newLast.next = capturedUpdate;
      } else newFirst = newLast = capturedUpdate;
      queue = {
        baseState: current.baseState,
        firstBaseUpdate: newFirst,
        lastBaseUpdate: newLast,
        shared: current.shared,
        callbacks: current.callbacks
      };
      workInProgress2.updateQueue = queue;
      return;
    }
    workInProgress2 = queue.lastBaseUpdate;
    null === workInProgress2 ? queue.firstBaseUpdate = capturedUpdate : workInProgress2.next = capturedUpdate;
    queue.lastBaseUpdate = capturedUpdate;
  }
  var didReadFromEntangledAsyncAction = false;
  function suspendIfUpdateReadFromEntangledAsyncAction() {
    if (didReadFromEntangledAsyncAction) {
      var entangledActionThenable = currentEntangledActionThenable;
      if (null !== entangledActionThenable) throw entangledActionThenable;
    }
  }
  function processUpdateQueue(workInProgress$jscomp$0, props, instance$jscomp$0, renderLanes2) {
    didReadFromEntangledAsyncAction = false;
    var queue = workInProgress$jscomp$0.updateQueue;
    hasForceUpdate = false;
    var firstBaseUpdate = queue.firstBaseUpdate, lastBaseUpdate = queue.lastBaseUpdate, pendingQueue = queue.shared.pending;
    if (null !== pendingQueue) {
      queue.shared.pending = null;
      var lastPendingUpdate = pendingQueue, firstPendingUpdate = lastPendingUpdate.next;
      lastPendingUpdate.next = null;
      null === lastBaseUpdate ? firstBaseUpdate = firstPendingUpdate : lastBaseUpdate.next = firstPendingUpdate;
      lastBaseUpdate = lastPendingUpdate;
      var current = workInProgress$jscomp$0.alternate;
      null !== current && (current = current.updateQueue, pendingQueue = current.lastBaseUpdate, pendingQueue !== lastBaseUpdate && (null === pendingQueue ? current.firstBaseUpdate = firstPendingUpdate : pendingQueue.next = firstPendingUpdate, current.lastBaseUpdate = lastPendingUpdate));
    }
    if (null !== firstBaseUpdate) {
      var newState = queue.baseState;
      lastBaseUpdate = 0;
      current = firstPendingUpdate = lastPendingUpdate = null;
      pendingQueue = firstBaseUpdate;
      do {
        var updateLane = pendingQueue.lane & -536870913, isHiddenUpdate = updateLane !== pendingQueue.lane;
        if (isHiddenUpdate ? (workInProgressRootRenderLanes & updateLane) === updateLane : (renderLanes2 & updateLane) === updateLane) {
          0 !== updateLane && updateLane === currentEntangledLane && (didReadFromEntangledAsyncAction = true);
          null !== current && (current = current.next = {
            lane: 0,
            tag: pendingQueue.tag,
            payload: pendingQueue.payload,
            callback: null,
            next: null
          });
          a: {
            var workInProgress2 = workInProgress$jscomp$0, update = pendingQueue;
            updateLane = props;
            var instance = instance$jscomp$0;
            switch (update.tag) {
              case 1:
                workInProgress2 = update.payload;
                if ("function" === typeof workInProgress2) {
                  newState = workInProgress2.call(instance, newState, updateLane);
                  break a;
                }
                newState = workInProgress2;
                break a;
              case 3:
                workInProgress2.flags = workInProgress2.flags & -65537 | 128;
              case 0:
                workInProgress2 = update.payload;
                updateLane = "function" === typeof workInProgress2 ? workInProgress2.call(instance, newState, updateLane) : workInProgress2;
                if (null === updateLane || void 0 === updateLane) break a;
                newState = assign({}, newState, updateLane);
                break a;
              case 2:
                hasForceUpdate = true;
            }
          }
          updateLane = pendingQueue.callback;
          null !== updateLane && (workInProgress$jscomp$0.flags |= 64, isHiddenUpdate && (workInProgress$jscomp$0.flags |= 8192), isHiddenUpdate = queue.callbacks, null === isHiddenUpdate ? queue.callbacks = [updateLane] : isHiddenUpdate.push(updateLane));
        } else
          isHiddenUpdate = {
            lane: updateLane,
            tag: pendingQueue.tag,
            payload: pendingQueue.payload,
            callback: pendingQueue.callback,
            next: null
          }, null === current ? (firstPendingUpdate = current = isHiddenUpdate, lastPendingUpdate = newState) : current = current.next = isHiddenUpdate, lastBaseUpdate |= updateLane;
        pendingQueue = pendingQueue.next;
        if (null === pendingQueue)
          if (pendingQueue = queue.shared.pending, null === pendingQueue)
            break;
          else
            isHiddenUpdate = pendingQueue, pendingQueue = isHiddenUpdate.next, isHiddenUpdate.next = null, queue.lastBaseUpdate = isHiddenUpdate, queue.shared.pending = null;
      } while (1);
      null === current && (lastPendingUpdate = newState);
      queue.baseState = lastPendingUpdate;
      queue.firstBaseUpdate = firstPendingUpdate;
      queue.lastBaseUpdate = current;
      null === firstBaseUpdate && (queue.shared.lanes = 0);
      workInProgressRootSkippedLanes |= lastBaseUpdate;
      workInProgress$jscomp$0.lanes = lastBaseUpdate;
      workInProgress$jscomp$0.memoizedState = newState;
    }
  }
  function callCallback(callback, context) {
    if ("function" !== typeof callback)
      throw Error(formatProdErrorMessage(191, callback));
    callback.call(context);
  }
  function commitCallbacks(updateQueue, context) {
    var callbacks = updateQueue.callbacks;
    if (null !== callbacks)
      for (updateQueue.callbacks = null, updateQueue = 0; updateQueue < callbacks.length; updateQueue++)
        callCallback(callbacks[updateQueue], context);
  }
  var currentTreeHiddenStackCursor = createCursor(null), prevEntangledRenderLanesCursor = createCursor(0);
  function pushHiddenContext(fiber, context) {
    fiber = entangledRenderLanes;
    push(prevEntangledRenderLanesCursor, fiber);
    push(currentTreeHiddenStackCursor, context);
    entangledRenderLanes = fiber | context.baseLanes;
  }
  function reuseHiddenContextOnStack() {
    push(prevEntangledRenderLanesCursor, entangledRenderLanes);
    push(currentTreeHiddenStackCursor, currentTreeHiddenStackCursor.current);
  }
  function popHiddenContext() {
    entangledRenderLanes = prevEntangledRenderLanesCursor.current;
    pop(currentTreeHiddenStackCursor);
    pop(prevEntangledRenderLanesCursor);
  }
  var suspenseHandlerStackCursor = createCursor(null), shellBoundary = null;
  function pushPrimaryTreeSuspenseHandler(handler) {
    var current = handler.alternate;
    push(suspenseStackCursor, suspenseStackCursor.current & 1);
    push(suspenseHandlerStackCursor, handler);
    null === shellBoundary && (null === current || null !== currentTreeHiddenStackCursor.current ? shellBoundary = handler : null !== current.memoizedState && (shellBoundary = handler));
  }
  function pushDehydratedActivitySuspenseHandler(fiber) {
    push(suspenseStackCursor, suspenseStackCursor.current);
    push(suspenseHandlerStackCursor, fiber);
    null === shellBoundary && (shellBoundary = fiber);
  }
  function pushOffscreenSuspenseHandler(fiber) {
    22 === fiber.tag ? (push(suspenseStackCursor, suspenseStackCursor.current), push(suspenseHandlerStackCursor, fiber), null === shellBoundary && (shellBoundary = fiber)) : reuseSuspenseHandlerOnStack();
  }
  function reuseSuspenseHandlerOnStack() {
    push(suspenseStackCursor, suspenseStackCursor.current);
    push(suspenseHandlerStackCursor, suspenseHandlerStackCursor.current);
  }
  function popSuspenseHandler(fiber) {
    pop(suspenseHandlerStackCursor);
    shellBoundary === fiber && (shellBoundary = null);
    pop(suspenseStackCursor);
  }
  var suspenseStackCursor = createCursor(0);
  function findFirstSuspended(row) {
    for (var node = row; null !== node; ) {
      if (13 === node.tag) {
        var state = node.memoizedState;
        if (null !== state && (state = state.dehydrated, null === state || isSuspenseInstancePending(state) || isSuspenseInstanceFallback(state)))
          return node;
      } else if (19 === node.tag && ("forwards" === node.memoizedProps.revealOrder || "backwards" === node.memoizedProps.revealOrder || "unstable_legacy-backwards" === node.memoizedProps.revealOrder || "together" === node.memoizedProps.revealOrder)) {
        if (0 !== (node.flags & 128)) return node;
      } else if (null !== node.child) {
        node.child.return = node;
        node = node.child;
        continue;
      }
      if (node === row) break;
      for (; null === node.sibling; ) {
        if (null === node.return || node.return === row) return null;
        node = node.return;
      }
      node.sibling.return = node.return;
      node = node.sibling;
    }
    return null;
  }
  var renderLanes = 0, currentlyRenderingFiber = null, currentHook = null, workInProgressHook = null, didScheduleRenderPhaseUpdate = false, didScheduleRenderPhaseUpdateDuringThisPass = false, shouldDoubleInvokeUserFnsInHooksDEV = false, localIdCounter = 0, thenableIndexCounter = 0, thenableState = null, globalClientIdCounter = 0;
  function throwInvalidHookError() {
    throw Error(formatProdErrorMessage(321));
  }
  function areHookInputsEqual(nextDeps, prevDeps) {
    if (null === prevDeps) return false;
    for (var i = 0; i < prevDeps.length && i < nextDeps.length; i++)
      if (!objectIs(nextDeps[i], prevDeps[i])) return false;
    return true;
  }
  function renderWithHooks(current, workInProgress2, Component, props, secondArg, nextRenderLanes) {
    renderLanes = nextRenderLanes;
    currentlyRenderingFiber = workInProgress2;
    workInProgress2.memoizedState = null;
    workInProgress2.updateQueue = null;
    workInProgress2.lanes = 0;
    ReactSharedInternals.H = null === current || null === current.memoizedState ? HooksDispatcherOnMount : HooksDispatcherOnUpdate;
    shouldDoubleInvokeUserFnsInHooksDEV = false;
    nextRenderLanes = Component(props, secondArg);
    shouldDoubleInvokeUserFnsInHooksDEV = false;
    didScheduleRenderPhaseUpdateDuringThisPass && (nextRenderLanes = renderWithHooksAgain(
      workInProgress2,
      Component,
      props,
      secondArg
    ));
    finishRenderingHooks(current);
    return nextRenderLanes;
  }
  function finishRenderingHooks(current) {
    ReactSharedInternals.H = ContextOnlyDispatcher;
    var didRenderTooFewHooks = null !== currentHook && null !== currentHook.next;
    renderLanes = 0;
    workInProgressHook = currentHook = currentlyRenderingFiber = null;
    didScheduleRenderPhaseUpdate = false;
    thenableIndexCounter = 0;
    thenableState = null;
    if (didRenderTooFewHooks) throw Error(formatProdErrorMessage(300));
    null === current || didReceiveUpdate || (current = current.dependencies, null !== current && checkIfContextChanged(current) && (didReceiveUpdate = true));
  }
  function renderWithHooksAgain(workInProgress2, Component, props, secondArg) {
    currentlyRenderingFiber = workInProgress2;
    var numberOfReRenders = 0;
    do {
      didScheduleRenderPhaseUpdateDuringThisPass && (thenableState = null);
      thenableIndexCounter = 0;
      didScheduleRenderPhaseUpdateDuringThisPass = false;
      if (25 <= numberOfReRenders) throw Error(formatProdErrorMessage(301));
      numberOfReRenders += 1;
      workInProgressHook = currentHook = null;
      if (null != workInProgress2.updateQueue) {
        var children = workInProgress2.updateQueue;
        children.lastEffect = null;
        children.events = null;
        children.stores = null;
        null != children.memoCache && (children.memoCache.index = 0);
      }
      ReactSharedInternals.H = HooksDispatcherOnRerender;
      children = Component(props, secondArg);
    } while (didScheduleRenderPhaseUpdateDuringThisPass);
    return children;
  }
  function TransitionAwareHostComponent() {
    var dispatcher = ReactSharedInternals.H, maybeThenable = dispatcher.useState()[0];
    maybeThenable = "function" === typeof maybeThenable.then ? useThenable(maybeThenable) : maybeThenable;
    dispatcher = dispatcher.useState()[0];
    (null !== currentHook ? currentHook.memoizedState : null) !== dispatcher && (currentlyRenderingFiber.flags |= 1024);
    return maybeThenable;
  }
  function checkDidRenderIdHook() {
    var didRenderIdHook = 0 !== localIdCounter;
    localIdCounter = 0;
    return didRenderIdHook;
  }
  function bailoutHooks(current, workInProgress2, lanes) {
    workInProgress2.updateQueue = current.updateQueue;
    workInProgress2.flags &= -2053;
    current.lanes &= ~lanes;
  }
  function resetHooksOnUnwind(workInProgress2) {
    if (didScheduleRenderPhaseUpdate) {
      for (workInProgress2 = workInProgress2.memoizedState; null !== workInProgress2; ) {
        var queue = workInProgress2.queue;
        null !== queue && (queue.pending = null);
        workInProgress2 = workInProgress2.next;
      }
      didScheduleRenderPhaseUpdate = false;
    }
    renderLanes = 0;
    workInProgressHook = currentHook = currentlyRenderingFiber = null;
    didScheduleRenderPhaseUpdateDuringThisPass = false;
    thenableIndexCounter = localIdCounter = 0;
    thenableState = null;
  }
  function mountWorkInProgressHook() {
    var hook = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null
    };
    null === workInProgressHook ? currentlyRenderingFiber.memoizedState = workInProgressHook = hook : workInProgressHook = workInProgressHook.next = hook;
    return workInProgressHook;
  }
  function updateWorkInProgressHook() {
    if (null === currentHook) {
      var nextCurrentHook = currentlyRenderingFiber.alternate;
      nextCurrentHook = null !== nextCurrentHook ? nextCurrentHook.memoizedState : null;
    } else nextCurrentHook = currentHook.next;
    var nextWorkInProgressHook = null === workInProgressHook ? currentlyRenderingFiber.memoizedState : workInProgressHook.next;
    if (null !== nextWorkInProgressHook)
      workInProgressHook = nextWorkInProgressHook, currentHook = nextCurrentHook;
    else {
      if (null === nextCurrentHook) {
        if (null === currentlyRenderingFiber.alternate)
          throw Error(formatProdErrorMessage(467));
        throw Error(formatProdErrorMessage(310));
      }
      currentHook = nextCurrentHook;
      nextCurrentHook = {
        memoizedState: currentHook.memoizedState,
        baseState: currentHook.baseState,
        baseQueue: currentHook.baseQueue,
        queue: currentHook.queue,
        next: null
      };
      null === workInProgressHook ? currentlyRenderingFiber.memoizedState = workInProgressHook = nextCurrentHook : workInProgressHook = workInProgressHook.next = nextCurrentHook;
    }
    return workInProgressHook;
  }
  function createFunctionComponentUpdateQueue() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function useThenable(thenable) {
    var index2 = thenableIndexCounter;
    thenableIndexCounter += 1;
    null === thenableState && (thenableState = []);
    thenable = trackUsedThenable(thenableState, thenable, index2);
    index2 = currentlyRenderingFiber;
    null === (null === workInProgressHook ? index2.memoizedState : workInProgressHook.next) && (index2 = index2.alternate, ReactSharedInternals.H = null === index2 || null === index2.memoizedState ? HooksDispatcherOnMount : HooksDispatcherOnUpdate);
    return thenable;
  }
  function use(usable) {
    if (null !== usable && "object" === typeof usable) {
      if ("function" === typeof usable.then) return useThenable(usable);
      if (usable.$$typeof === REACT_CONTEXT_TYPE) return readContext(usable);
    }
    throw Error(formatProdErrorMessage(438, String(usable)));
  }
  function useMemoCache(size) {
    var memoCache = null, updateQueue = currentlyRenderingFiber.updateQueue;
    null !== updateQueue && (memoCache = updateQueue.memoCache);
    if (null == memoCache) {
      var current = currentlyRenderingFiber.alternate;
      null !== current && (current = current.updateQueue, null !== current && (current = current.memoCache, null != current && (memoCache = {
        data: current.data.map(function(array) {
          return array.slice();
        }),
        index: 0
      })));
    }
    null == memoCache && (memoCache = { data: [], index: 0 });
    null === updateQueue && (updateQueue = createFunctionComponentUpdateQueue(), currentlyRenderingFiber.updateQueue = updateQueue);
    updateQueue.memoCache = memoCache;
    updateQueue = memoCache.data[memoCache.index];
    if (void 0 === updateQueue)
      for (updateQueue = memoCache.data[memoCache.index] = Array(size), current = 0; current < size; current++)
        updateQueue[current] = REACT_MEMO_CACHE_SENTINEL;
    memoCache.index++;
    return updateQueue;
  }
  function basicStateReducer(state, action) {
    return "function" === typeof action ? action(state) : action;
  }
  function updateReducer(reducer) {
    var hook = updateWorkInProgressHook();
    return updateReducerImpl(hook, currentHook, reducer);
  }
  function updateReducerImpl(hook, current, reducer) {
    var queue = hook.queue;
    if (null === queue) throw Error(formatProdErrorMessage(311));
    queue.lastRenderedReducer = reducer;
    var baseQueue = hook.baseQueue, pendingQueue = queue.pending;
    if (null !== pendingQueue) {
      if (null !== baseQueue) {
        var baseFirst = baseQueue.next;
        baseQueue.next = pendingQueue.next;
        pendingQueue.next = baseFirst;
      }
      current.baseQueue = baseQueue = pendingQueue;
      queue.pending = null;
    }
    pendingQueue = hook.baseState;
    if (null === baseQueue) hook.memoizedState = pendingQueue;
    else {
      current = baseQueue.next;
      var newBaseQueueFirst = baseFirst = null, newBaseQueueLast = null, update = current, didReadFromEntangledAsyncAction$60 = false;
      do {
        var updateLane = update.lane & -536870913;
        if (updateLane !== update.lane ? (workInProgressRootRenderLanes & updateLane) === updateLane : (renderLanes & updateLane) === updateLane) {
          var revertLane = update.revertLane;
          if (0 === revertLane)
            null !== newBaseQueueLast && (newBaseQueueLast = newBaseQueueLast.next = {
              lane: 0,
              revertLane: 0,
              gesture: null,
              action: update.action,
              hasEagerState: update.hasEagerState,
              eagerState: update.eagerState,
              next: null
            }), updateLane === currentEntangledLane && (didReadFromEntangledAsyncAction$60 = true);
          else if ((renderLanes & revertLane) === revertLane) {
            update = update.next;
            revertLane === currentEntangledLane && (didReadFromEntangledAsyncAction$60 = true);
            continue;
          } else
            updateLane = {
              lane: 0,
              revertLane: update.revertLane,
              gesture: null,
              action: update.action,
              hasEagerState: update.hasEagerState,
              eagerState: update.eagerState,
              next: null
            }, null === newBaseQueueLast ? (newBaseQueueFirst = newBaseQueueLast = updateLane, baseFirst = pendingQueue) : newBaseQueueLast = newBaseQueueLast.next = updateLane, currentlyRenderingFiber.lanes |= revertLane, workInProgressRootSkippedLanes |= revertLane;
          updateLane = update.action;
          shouldDoubleInvokeUserFnsInHooksDEV && reducer(pendingQueue, updateLane);
          pendingQueue = update.hasEagerState ? update.eagerState : reducer(pendingQueue, updateLane);
        } else
          revertLane = {
            lane: updateLane,
            revertLane: update.revertLane,
            gesture: update.gesture,
            action: update.action,
            hasEagerState: update.hasEagerState,
            eagerState: update.eagerState,
            next: null
          }, null === newBaseQueueLast ? (newBaseQueueFirst = newBaseQueueLast = revertLane, baseFirst = pendingQueue) : newBaseQueueLast = newBaseQueueLast.next = revertLane, currentlyRenderingFiber.lanes |= updateLane, workInProgressRootSkippedLanes |= updateLane;
        update = update.next;
      } while (null !== update && update !== current);
      null === newBaseQueueLast ? baseFirst = pendingQueue : newBaseQueueLast.next = newBaseQueueFirst;
      if (!objectIs(pendingQueue, hook.memoizedState) && (didReceiveUpdate = true, didReadFromEntangledAsyncAction$60 && (reducer = currentEntangledActionThenable, null !== reducer)))
        throw reducer;
      hook.memoizedState = pendingQueue;
      hook.baseState = baseFirst;
      hook.baseQueue = newBaseQueueLast;
      queue.lastRenderedState = pendingQueue;
    }
    null === baseQueue && (queue.lanes = 0);
    return [hook.memoizedState, queue.dispatch];
  }
  function rerenderReducer(reducer) {
    var hook = updateWorkInProgressHook(), queue = hook.queue;
    if (null === queue) throw Error(formatProdErrorMessage(311));
    queue.lastRenderedReducer = reducer;
    var dispatch = queue.dispatch, lastRenderPhaseUpdate = queue.pending, newState = hook.memoizedState;
    if (null !== lastRenderPhaseUpdate) {
      queue.pending = null;
      var update = lastRenderPhaseUpdate = lastRenderPhaseUpdate.next;
      do
        newState = reducer(newState, update.action), update = update.next;
      while (update !== lastRenderPhaseUpdate);
      objectIs(newState, hook.memoizedState) || (didReceiveUpdate = true);
      hook.memoizedState = newState;
      null === hook.baseQueue && (hook.baseState = newState);
      queue.lastRenderedState = newState;
    }
    return [newState, dispatch];
  }
  function updateSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) {
    var fiber = currentlyRenderingFiber, hook = updateWorkInProgressHook(), isHydrating$jscomp$0 = isHydrating;
    if (isHydrating$jscomp$0) {
      if (void 0 === getServerSnapshot) throw Error(formatProdErrorMessage(407));
      getServerSnapshot = getServerSnapshot();
    } else getServerSnapshot = getSnapshot();
    var snapshotChanged = !objectIs(
      (currentHook || hook).memoizedState,
      getServerSnapshot
    );
    snapshotChanged && (hook.memoizedState = getServerSnapshot, didReceiveUpdate = true);
    hook = hook.queue;
    updateEffect(subscribeToStore.bind(null, fiber, hook, subscribe), [
      subscribe
    ]);
    if (hook.getSnapshot !== getSnapshot || snapshotChanged || null !== workInProgressHook && workInProgressHook.memoizedState.tag & 1) {
      fiber.flags |= 2048;
      pushSimpleEffect(
        9,
        { destroy: void 0 },
        updateStoreInstance.bind(
          null,
          fiber,
          hook,
          getServerSnapshot,
          getSnapshot
        ),
        null
      );
      if (null === workInProgressRoot) throw Error(formatProdErrorMessage(349));
      isHydrating$jscomp$0 || 0 !== (renderLanes & 127) || pushStoreConsistencyCheck(fiber, getSnapshot, getServerSnapshot);
    }
    return getServerSnapshot;
  }
  function pushStoreConsistencyCheck(fiber, getSnapshot, renderedSnapshot) {
    fiber.flags |= 16384;
    fiber = { getSnapshot, value: renderedSnapshot };
    getSnapshot = currentlyRenderingFiber.updateQueue;
    null === getSnapshot ? (getSnapshot = createFunctionComponentUpdateQueue(), currentlyRenderingFiber.updateQueue = getSnapshot, getSnapshot.stores = [fiber]) : (renderedSnapshot = getSnapshot.stores, null === renderedSnapshot ? getSnapshot.stores = [fiber] : renderedSnapshot.push(fiber));
  }
  function updateStoreInstance(fiber, inst, nextSnapshot, getSnapshot) {
    inst.value = nextSnapshot;
    inst.getSnapshot = getSnapshot;
    checkIfSnapshotChanged(inst) && forceStoreRerender(fiber);
  }
  function subscribeToStore(fiber, inst, subscribe) {
    return subscribe(function() {
      checkIfSnapshotChanged(inst) && forceStoreRerender(fiber);
    });
  }
  function checkIfSnapshotChanged(inst) {
    var latestGetSnapshot = inst.getSnapshot;
    inst = inst.value;
    try {
      var nextValue = latestGetSnapshot();
      return !objectIs(inst, nextValue);
    } catch (error) {
      return true;
    }
  }
  function forceStoreRerender(fiber) {
    var root2 = enqueueConcurrentRenderForLane(fiber, 2);
    null !== root2 && scheduleUpdateOnFiber(root2, fiber, 2);
  }
  function mountStateImpl(initialState) {
    var hook = mountWorkInProgressHook();
    if ("function" === typeof initialState) {
      var initialStateInitializer = initialState;
      initialState = initialStateInitializer();
      if (shouldDoubleInvokeUserFnsInHooksDEV) {
        setIsStrictModeForDevtools(true);
        try {
          initialStateInitializer();
        } finally {
          setIsStrictModeForDevtools(false);
        }
      }
    }
    hook.memoizedState = hook.baseState = initialState;
    hook.queue = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: basicStateReducer,
      lastRenderedState: initialState
    };
    return hook;
  }
  function updateOptimisticImpl(hook, current, passthrough, reducer) {
    hook.baseState = passthrough;
    return updateReducerImpl(
      hook,
      currentHook,
      "function" === typeof reducer ? reducer : basicStateReducer
    );
  }
  function dispatchActionState(fiber, actionQueue, setPendingState, setState, payload) {
    if (isRenderPhaseUpdate(fiber)) throw Error(formatProdErrorMessage(485));
    fiber = actionQueue.action;
    if (null !== fiber) {
      var actionNode = {
        payload,
        action: fiber,
        next: null,
        isTransition: true,
        status: "pending",
        value: null,
        reason: null,
        listeners: [],
        then: function(listener) {
          actionNode.listeners.push(listener);
        }
      };
      null !== ReactSharedInternals.T ? setPendingState(true) : actionNode.isTransition = false;
      setState(actionNode);
      setPendingState = actionQueue.pending;
      null === setPendingState ? (actionNode.next = actionQueue.pending = actionNode, runActionStateAction(actionQueue, actionNode)) : (actionNode.next = setPendingState.next, actionQueue.pending = setPendingState.next = actionNode);
    }
  }
  function runActionStateAction(actionQueue, node) {
    var action = node.action, payload = node.payload, prevState = actionQueue.state;
    if (node.isTransition) {
      var prevTransition = ReactSharedInternals.T, currentTransition = {};
      ReactSharedInternals.T = currentTransition;
      try {
        var returnValue = action(prevState, payload), onStartTransitionFinish = ReactSharedInternals.S;
        null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
        handleActionReturnValue(actionQueue, node, returnValue);
      } catch (error) {
        onActionError(actionQueue, node, error);
      } finally {
        null !== prevTransition && null !== currentTransition.types && (prevTransition.types = currentTransition.types), ReactSharedInternals.T = prevTransition;
      }
    } else
      try {
        prevTransition = action(prevState, payload), handleActionReturnValue(actionQueue, node, prevTransition);
      } catch (error$66) {
        onActionError(actionQueue, node, error$66);
      }
  }
  function handleActionReturnValue(actionQueue, node, returnValue) {
    null !== returnValue && "object" === typeof returnValue && "function" === typeof returnValue.then ? returnValue.then(
      function(nextState) {
        onActionSuccess(actionQueue, node, nextState);
      },
      function(error) {
        return onActionError(actionQueue, node, error);
      }
    ) : onActionSuccess(actionQueue, node, returnValue);
  }
  function onActionSuccess(actionQueue, actionNode, nextState) {
    actionNode.status = "fulfilled";
    actionNode.value = nextState;
    notifyActionListeners(actionNode);
    actionQueue.state = nextState;
    actionNode = actionQueue.pending;
    null !== actionNode && (nextState = actionNode.next, nextState === actionNode ? actionQueue.pending = null : (nextState = nextState.next, actionNode.next = nextState, runActionStateAction(actionQueue, nextState)));
  }
  function onActionError(actionQueue, actionNode, error) {
    var last = actionQueue.pending;
    actionQueue.pending = null;
    if (null !== last) {
      last = last.next;
      do
        actionNode.status = "rejected", actionNode.reason = error, notifyActionListeners(actionNode), actionNode = actionNode.next;
      while (actionNode !== last);
    }
    actionQueue.action = null;
  }
  function notifyActionListeners(actionNode) {
    actionNode = actionNode.listeners;
    for (var i = 0; i < actionNode.length; i++) (0, actionNode[i])();
  }
  function actionStateReducer(oldState, newState) {
    return newState;
  }
  function mountActionState(action, initialStateProp) {
    if (isHydrating) {
      var ssrFormState = workInProgressRoot.formState;
      if (null !== ssrFormState) {
        a: {
          var JSCompiler_inline_result = currentlyRenderingFiber;
          if (isHydrating) {
            if (nextHydratableInstance) {
              b: {
                var JSCompiler_inline_result$jscomp$0 = nextHydratableInstance;
                for (var inRootOrSingleton = rootOrSingletonContext; 8 !== JSCompiler_inline_result$jscomp$0.nodeType; ) {
                  if (!inRootOrSingleton) {
                    JSCompiler_inline_result$jscomp$0 = null;
                    break b;
                  }
                  JSCompiler_inline_result$jscomp$0 = getNextHydratable(
                    JSCompiler_inline_result$jscomp$0.nextSibling
                  );
                  if (null === JSCompiler_inline_result$jscomp$0) {
                    JSCompiler_inline_result$jscomp$0 = null;
                    break b;
                  }
                }
                inRootOrSingleton = JSCompiler_inline_result$jscomp$0.data;
                JSCompiler_inline_result$jscomp$0 = "F!" === inRootOrSingleton || "F" === inRootOrSingleton ? JSCompiler_inline_result$jscomp$0 : null;
              }
              if (JSCompiler_inline_result$jscomp$0) {
                nextHydratableInstance = getNextHydratable(
                  JSCompiler_inline_result$jscomp$0.nextSibling
                );
                JSCompiler_inline_result = "F!" === JSCompiler_inline_result$jscomp$0.data;
                break a;
              }
            }
            throwOnHydrationMismatch(JSCompiler_inline_result);
          }
          JSCompiler_inline_result = false;
        }
        JSCompiler_inline_result && (initialStateProp = ssrFormState[0]);
      }
    }
    ssrFormState = mountWorkInProgressHook();
    ssrFormState.memoizedState = ssrFormState.baseState = initialStateProp;
    JSCompiler_inline_result = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: actionStateReducer,
      lastRenderedState: initialStateProp
    };
    ssrFormState.queue = JSCompiler_inline_result;
    ssrFormState = dispatchSetState.bind(
      null,
      currentlyRenderingFiber,
      JSCompiler_inline_result
    );
    JSCompiler_inline_result.dispatch = ssrFormState;
    JSCompiler_inline_result = mountStateImpl(false);
    inRootOrSingleton = dispatchOptimisticSetState.bind(
      null,
      currentlyRenderingFiber,
      false,
      JSCompiler_inline_result.queue
    );
    JSCompiler_inline_result = mountWorkInProgressHook();
    JSCompiler_inline_result$jscomp$0 = {
      state: initialStateProp,
      dispatch: null,
      action,
      pending: null
    };
    JSCompiler_inline_result.queue = JSCompiler_inline_result$jscomp$0;
    ssrFormState = dispatchActionState.bind(
      null,
      currentlyRenderingFiber,
      JSCompiler_inline_result$jscomp$0,
      inRootOrSingleton,
      ssrFormState
    );
    JSCompiler_inline_result$jscomp$0.dispatch = ssrFormState;
    JSCompiler_inline_result.memoizedState = action;
    return [initialStateProp, ssrFormState, false];
  }
  function updateActionState(action) {
    var stateHook = updateWorkInProgressHook();
    return updateActionStateImpl(stateHook, currentHook, action);
  }
  function updateActionStateImpl(stateHook, currentStateHook, action) {
    currentStateHook = updateReducerImpl(
      stateHook,
      currentStateHook,
      actionStateReducer
    )[0];
    stateHook = updateReducer(basicStateReducer)[0];
    if ("object" === typeof currentStateHook && null !== currentStateHook && "function" === typeof currentStateHook.then)
      try {
        var state = useThenable(currentStateHook);
      } catch (x) {
        if (x === SuspenseException) throw SuspenseActionException;
        throw x;
      }
    else state = currentStateHook;
    currentStateHook = updateWorkInProgressHook();
    var actionQueue = currentStateHook.queue, dispatch = actionQueue.dispatch;
    action !== currentStateHook.memoizedState && (currentlyRenderingFiber.flags |= 2048, pushSimpleEffect(
      9,
      { destroy: void 0 },
      actionStateActionEffect.bind(null, actionQueue, action),
      null
    ));
    return [state, dispatch, stateHook];
  }
  function actionStateActionEffect(actionQueue, action) {
    actionQueue.action = action;
  }
  function rerenderActionState(action) {
    var stateHook = updateWorkInProgressHook(), currentStateHook = currentHook;
    if (null !== currentStateHook)
      return updateActionStateImpl(stateHook, currentStateHook, action);
    updateWorkInProgressHook();
    stateHook = stateHook.memoizedState;
    currentStateHook = updateWorkInProgressHook();
    var dispatch = currentStateHook.queue.dispatch;
    currentStateHook.memoizedState = action;
    return [stateHook, dispatch, false];
  }
  function pushSimpleEffect(tag, inst, create, deps) {
    tag = { tag, create, deps, inst, next: null };
    inst = currentlyRenderingFiber.updateQueue;
    null === inst && (inst = createFunctionComponentUpdateQueue(), currentlyRenderingFiber.updateQueue = inst);
    create = inst.lastEffect;
    null === create ? inst.lastEffect = tag.next = tag : (deps = create.next, create.next = tag, tag.next = deps, inst.lastEffect = tag);
    return tag;
  }
  function updateRef() {
    return updateWorkInProgressHook().memoizedState;
  }
  function mountEffectImpl(fiberFlags, hookFlags, create, deps) {
    var hook = mountWorkInProgressHook();
    currentlyRenderingFiber.flags |= fiberFlags;
    hook.memoizedState = pushSimpleEffect(
      1 | hookFlags,
      { destroy: void 0 },
      create,
      void 0 === deps ? null : deps
    );
  }
  function updateEffectImpl(fiberFlags, hookFlags, create, deps) {
    var hook = updateWorkInProgressHook();
    deps = void 0 === deps ? null : deps;
    var inst = hook.memoizedState.inst;
    null !== currentHook && null !== deps && areHookInputsEqual(deps, currentHook.memoizedState.deps) ? hook.memoizedState = pushSimpleEffect(hookFlags, inst, create, deps) : (currentlyRenderingFiber.flags |= fiberFlags, hook.memoizedState = pushSimpleEffect(
      1 | hookFlags,
      inst,
      create,
      deps
    ));
  }
  function mountEffect(create, deps) {
    mountEffectImpl(8390656, 8, create, deps);
  }
  function updateEffect(create, deps) {
    updateEffectImpl(2048, 8, create, deps);
  }
  function useEffectEventImpl(payload) {
    currentlyRenderingFiber.flags |= 4;
    var componentUpdateQueue = currentlyRenderingFiber.updateQueue;
    if (null === componentUpdateQueue)
      componentUpdateQueue = createFunctionComponentUpdateQueue(), currentlyRenderingFiber.updateQueue = componentUpdateQueue, componentUpdateQueue.events = [payload];
    else {
      var events = componentUpdateQueue.events;
      null === events ? componentUpdateQueue.events = [payload] : events.push(payload);
    }
  }
  function updateEvent(callback) {
    var ref = updateWorkInProgressHook().memoizedState;
    useEffectEventImpl({ ref, nextImpl: callback });
    return function() {
      if (0 !== (executionContext & 2)) throw Error(formatProdErrorMessage(440));
      return ref.impl.apply(void 0, arguments);
    };
  }
  function updateInsertionEffect(create, deps) {
    return updateEffectImpl(4, 2, create, deps);
  }
  function updateLayoutEffect(create, deps) {
    return updateEffectImpl(4, 4, create, deps);
  }
  function imperativeHandleEffect(create, ref) {
    if ("function" === typeof ref) {
      create = create();
      var refCleanup = ref(create);
      return function() {
        "function" === typeof refCleanup ? refCleanup() : ref(null);
      };
    }
    if (null !== ref && void 0 !== ref)
      return create = create(), ref.current = create, function() {
        ref.current = null;
      };
  }
  function updateImperativeHandle(ref, create, deps) {
    deps = null !== deps && void 0 !== deps ? deps.concat([ref]) : null;
    updateEffectImpl(4, 4, imperativeHandleEffect.bind(null, create, ref), deps);
  }
  function mountDebugValue() {
  }
  function updateCallback(callback, deps) {
    var hook = updateWorkInProgressHook();
    deps = void 0 === deps ? null : deps;
    var prevState = hook.memoizedState;
    if (null !== deps && areHookInputsEqual(deps, prevState[1]))
      return prevState[0];
    hook.memoizedState = [callback, deps];
    return callback;
  }
  function updateMemo(nextCreate, deps) {
    var hook = updateWorkInProgressHook();
    deps = void 0 === deps ? null : deps;
    var prevState = hook.memoizedState;
    if (null !== deps && areHookInputsEqual(deps, prevState[1]))
      return prevState[0];
    prevState = nextCreate();
    if (shouldDoubleInvokeUserFnsInHooksDEV) {
      setIsStrictModeForDevtools(true);
      try {
        nextCreate();
      } finally {
        setIsStrictModeForDevtools(false);
      }
    }
    hook.memoizedState = [prevState, deps];
    return prevState;
  }
  function mountDeferredValueImpl(hook, value, initialValue) {
    if (void 0 === initialValue || 0 !== (renderLanes & 1073741824) && 0 === (workInProgressRootRenderLanes & 261930))
      return hook.memoizedState = value;
    hook.memoizedState = initialValue;
    hook = requestDeferredLane();
    currentlyRenderingFiber.lanes |= hook;
    workInProgressRootSkippedLanes |= hook;
    return initialValue;
  }
  function updateDeferredValueImpl(hook, prevValue, value, initialValue) {
    if (objectIs(value, prevValue)) return value;
    if (null !== currentTreeHiddenStackCursor.current)
      return hook = mountDeferredValueImpl(hook, value, initialValue), objectIs(hook, prevValue) || (didReceiveUpdate = true), hook;
    if (0 === (renderLanes & 42) || 0 !== (renderLanes & 1073741824) && 0 === (workInProgressRootRenderLanes & 261930))
      return didReceiveUpdate = true, hook.memoizedState = value;
    hook = requestDeferredLane();
    currentlyRenderingFiber.lanes |= hook;
    workInProgressRootSkippedLanes |= hook;
    return prevValue;
  }
  function startTransition(fiber, queue, pendingState, finishedState, callback) {
    var previousPriority = ReactDOMSharedInternals.p;
    ReactDOMSharedInternals.p = 0 !== previousPriority && 8 > previousPriority ? previousPriority : 8;
    var prevTransition = ReactSharedInternals.T, currentTransition = {};
    ReactSharedInternals.T = currentTransition;
    dispatchOptimisticSetState(fiber, false, queue, pendingState);
    try {
      var returnValue = callback(), onStartTransitionFinish = ReactSharedInternals.S;
      null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
      if (null !== returnValue && "object" === typeof returnValue && "function" === typeof returnValue.then) {
        var thenableForFinishedState = chainThenableValue(
          returnValue,
          finishedState
        );
        dispatchSetStateInternal(
          fiber,
          queue,
          thenableForFinishedState,
          requestUpdateLane(fiber)
        );
      } else
        dispatchSetStateInternal(
          fiber,
          queue,
          finishedState,
          requestUpdateLane(fiber)
        );
    } catch (error) {
      dispatchSetStateInternal(
        fiber,
        queue,
        { then: function() {
        }, status: "rejected", reason: error },
        requestUpdateLane()
      );
    } finally {
      ReactDOMSharedInternals.p = previousPriority, null !== prevTransition && null !== currentTransition.types && (prevTransition.types = currentTransition.types), ReactSharedInternals.T = prevTransition;
    }
  }
  function noop() {
  }
  function startHostTransition(formFiber, pendingState, action, formData) {
    if (5 !== formFiber.tag) throw Error(formatProdErrorMessage(476));
    var queue = ensureFormComponentIsStateful(formFiber).queue;
    startTransition(
      formFiber,
      queue,
      pendingState,
      sharedNotPendingObject,
      null === action ? noop : function() {
        requestFormReset$1(formFiber);
        return action(formData);
      }
    );
  }
  function ensureFormComponentIsStateful(formFiber) {
    var existingStateHook = formFiber.memoizedState;
    if (null !== existingStateHook) return existingStateHook;
    existingStateHook = {
      memoizedState: sharedNotPendingObject,
      baseState: sharedNotPendingObject,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: basicStateReducer,
        lastRenderedState: sharedNotPendingObject
      },
      next: null
    };
    var initialResetState = {};
    existingStateHook.next = {
      memoizedState: initialResetState,
      baseState: initialResetState,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: basicStateReducer,
        lastRenderedState: initialResetState
      },
      next: null
    };
    formFiber.memoizedState = existingStateHook;
    formFiber = formFiber.alternate;
    null !== formFiber && (formFiber.memoizedState = existingStateHook);
    return existingStateHook;
  }
  function requestFormReset$1(formFiber) {
    var stateHook = ensureFormComponentIsStateful(formFiber);
    null === stateHook.next && (stateHook = formFiber.alternate.memoizedState);
    dispatchSetStateInternal(
      formFiber,
      stateHook.next.queue,
      {},
      requestUpdateLane()
    );
  }
  function useHostTransitionStatus() {
    return readContext(HostTransitionContext);
  }
  function updateId() {
    return updateWorkInProgressHook().memoizedState;
  }
  function updateRefresh() {
    return updateWorkInProgressHook().memoizedState;
  }
  function refreshCache(fiber) {
    for (var provider = fiber.return; null !== provider; ) {
      switch (provider.tag) {
        case 24:
        case 3:
          var lane = requestUpdateLane();
          fiber = createUpdate(lane);
          var root$69 = enqueueUpdate(provider, fiber, lane);
          null !== root$69 && (scheduleUpdateOnFiber(root$69, provider, lane), entangleTransitions(root$69, provider, lane));
          provider = { cache: createCache() };
          fiber.payload = provider;
          return;
      }
      provider = provider.return;
    }
  }
  function dispatchReducerAction(fiber, queue, action) {
    var lane = requestUpdateLane();
    action = {
      lane,
      revertLane: 0,
      gesture: null,
      action,
      hasEagerState: false,
      eagerState: null,
      next: null
    };
    isRenderPhaseUpdate(fiber) ? enqueueRenderPhaseUpdate(queue, action) : (action = enqueueConcurrentHookUpdate(fiber, queue, action, lane), null !== action && (scheduleUpdateOnFiber(action, fiber, lane), entangleTransitionUpdate(action, queue, lane)));
  }
  function dispatchSetState(fiber, queue, action) {
    var lane = requestUpdateLane();
    dispatchSetStateInternal(fiber, queue, action, lane);
  }
  function dispatchSetStateInternal(fiber, queue, action, lane) {
    var update = {
      lane,
      revertLane: 0,
      gesture: null,
      action,
      hasEagerState: false,
      eagerState: null,
      next: null
    };
    if (isRenderPhaseUpdate(fiber)) enqueueRenderPhaseUpdate(queue, update);
    else {
      var alternate = fiber.alternate;
      if (0 === fiber.lanes && (null === alternate || 0 === alternate.lanes) && (alternate = queue.lastRenderedReducer, null !== alternate))
        try {
          var currentState = queue.lastRenderedState, eagerState = alternate(currentState, action);
          update.hasEagerState = true;
          update.eagerState = eagerState;
          if (objectIs(eagerState, currentState))
            return enqueueUpdate$1(fiber, queue, update, 0), null === workInProgressRoot && finishQueueingConcurrentUpdates(), false;
        } catch (error) {
        } finally {
        }
      action = enqueueConcurrentHookUpdate(fiber, queue, update, lane);
      if (null !== action)
        return scheduleUpdateOnFiber(action, fiber, lane), entangleTransitionUpdate(action, queue, lane), true;
    }
    return false;
  }
  function dispatchOptimisticSetState(fiber, throwIfDuringRender, queue, action) {
    action = {
      lane: 2,
      revertLane: requestTransitionLane(),
      gesture: null,
      action,
      hasEagerState: false,
      eagerState: null,
      next: null
    };
    if (isRenderPhaseUpdate(fiber)) {
      if (throwIfDuringRender) throw Error(formatProdErrorMessage(479));
    } else
      throwIfDuringRender = enqueueConcurrentHookUpdate(
        fiber,
        queue,
        action,
        2
      ), null !== throwIfDuringRender && scheduleUpdateOnFiber(throwIfDuringRender, fiber, 2);
  }
  function isRenderPhaseUpdate(fiber) {
    var alternate = fiber.alternate;
    return fiber === currentlyRenderingFiber || null !== alternate && alternate === currentlyRenderingFiber;
  }
  function enqueueRenderPhaseUpdate(queue, update) {
    didScheduleRenderPhaseUpdateDuringThisPass = didScheduleRenderPhaseUpdate = true;
    var pending = queue.pending;
    null === pending ? update.next = update : (update.next = pending.next, pending.next = update);
    queue.pending = update;
  }
  function entangleTransitionUpdate(root2, queue, lane) {
    if (0 !== (lane & 4194048)) {
      var queueLanes = queue.lanes;
      queueLanes &= root2.pendingLanes;
      lane |= queueLanes;
      queue.lanes = lane;
      markRootEntangled(root2, lane);
    }
  }
  var ContextOnlyDispatcher = {
    readContext,
    use,
    useCallback: throwInvalidHookError,
    useContext: throwInvalidHookError,
    useEffect: throwInvalidHookError,
    useImperativeHandle: throwInvalidHookError,
    useLayoutEffect: throwInvalidHookError,
    useInsertionEffect: throwInvalidHookError,
    useMemo: throwInvalidHookError,
    useReducer: throwInvalidHookError,
    useRef: throwInvalidHookError,
    useState: throwInvalidHookError,
    useDebugValue: throwInvalidHookError,
    useDeferredValue: throwInvalidHookError,
    useTransition: throwInvalidHookError,
    useSyncExternalStore: throwInvalidHookError,
    useId: throwInvalidHookError,
    useHostTransitionStatus: throwInvalidHookError,
    useFormState: throwInvalidHookError,
    useActionState: throwInvalidHookError,
    useOptimistic: throwInvalidHookError,
    useMemoCache: throwInvalidHookError,
    useCacheRefresh: throwInvalidHookError
  };
  ContextOnlyDispatcher.useEffectEvent = throwInvalidHookError;
  var HooksDispatcherOnMount = {
    readContext,
    use,
    useCallback: function(callback, deps) {
      mountWorkInProgressHook().memoizedState = [
        callback,
        void 0 === deps ? null : deps
      ];
      return callback;
    },
    useContext: readContext,
    useEffect: mountEffect,
    useImperativeHandle: function(ref, create, deps) {
      deps = null !== deps && void 0 !== deps ? deps.concat([ref]) : null;
      mountEffectImpl(
        4194308,
        4,
        imperativeHandleEffect.bind(null, create, ref),
        deps
      );
    },
    useLayoutEffect: function(create, deps) {
      return mountEffectImpl(4194308, 4, create, deps);
    },
    useInsertionEffect: function(create, deps) {
      mountEffectImpl(4, 2, create, deps);
    },
    useMemo: function(nextCreate, deps) {
      var hook = mountWorkInProgressHook();
      deps = void 0 === deps ? null : deps;
      var nextValue = nextCreate();
      if (shouldDoubleInvokeUserFnsInHooksDEV) {
        setIsStrictModeForDevtools(true);
        try {
          nextCreate();
        } finally {
          setIsStrictModeForDevtools(false);
        }
      }
      hook.memoizedState = [nextValue, deps];
      return nextValue;
    },
    useReducer: function(reducer, initialArg, init) {
      var hook = mountWorkInProgressHook();
      if (void 0 !== init) {
        var initialState = init(initialArg);
        if (shouldDoubleInvokeUserFnsInHooksDEV) {
          setIsStrictModeForDevtools(true);
          try {
            init(initialArg);
          } finally {
            setIsStrictModeForDevtools(false);
          }
        }
      } else initialState = initialArg;
      hook.memoizedState = hook.baseState = initialState;
      reducer = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: reducer,
        lastRenderedState: initialState
      };
      hook.queue = reducer;
      reducer = reducer.dispatch = dispatchReducerAction.bind(
        null,
        currentlyRenderingFiber,
        reducer
      );
      return [hook.memoizedState, reducer];
    },
    useRef: function(initialValue) {
      var hook = mountWorkInProgressHook();
      initialValue = { current: initialValue };
      return hook.memoizedState = initialValue;
    },
    useState: function(initialState) {
      initialState = mountStateImpl(initialState);
      var queue = initialState.queue, dispatch = dispatchSetState.bind(null, currentlyRenderingFiber, queue);
      queue.dispatch = dispatch;
      return [initialState.memoizedState, dispatch];
    },
    useDebugValue: mountDebugValue,
    useDeferredValue: function(value, initialValue) {
      var hook = mountWorkInProgressHook();
      return mountDeferredValueImpl(hook, value, initialValue);
    },
    useTransition: function() {
      var stateHook = mountStateImpl(false);
      stateHook = startTransition.bind(
        null,
        currentlyRenderingFiber,
        stateHook.queue,
        true,
        false
      );
      mountWorkInProgressHook().memoizedState = stateHook;
      return [false, stateHook];
    },
    useSyncExternalStore: function(subscribe, getSnapshot, getServerSnapshot) {
      var fiber = currentlyRenderingFiber, hook = mountWorkInProgressHook();
      if (isHydrating) {
        if (void 0 === getServerSnapshot)
          throw Error(formatProdErrorMessage(407));
        getServerSnapshot = getServerSnapshot();
      } else {
        getServerSnapshot = getSnapshot();
        if (null === workInProgressRoot)
          throw Error(formatProdErrorMessage(349));
        0 !== (workInProgressRootRenderLanes & 127) || pushStoreConsistencyCheck(fiber, getSnapshot, getServerSnapshot);
      }
      hook.memoizedState = getServerSnapshot;
      var inst = { value: getServerSnapshot, getSnapshot };
      hook.queue = inst;
      mountEffect(subscribeToStore.bind(null, fiber, inst, subscribe), [
        subscribe
      ]);
      fiber.flags |= 2048;
      pushSimpleEffect(
        9,
        { destroy: void 0 },
        updateStoreInstance.bind(
          null,
          fiber,
          inst,
          getServerSnapshot,
          getSnapshot
        ),
        null
      );
      return getServerSnapshot;
    },
    useId: function() {
      var hook = mountWorkInProgressHook(), identifierPrefix = workInProgressRoot.identifierPrefix;
      if (isHydrating) {
        var JSCompiler_inline_result = treeContextOverflow;
        var idWithLeadingBit = treeContextId;
        JSCompiler_inline_result = (idWithLeadingBit & ~(1 << 32 - clz32(idWithLeadingBit) - 1)).toString(32) + JSCompiler_inline_result;
        identifierPrefix = "_" + identifierPrefix + "R_" + JSCompiler_inline_result;
        JSCompiler_inline_result = localIdCounter++;
        0 < JSCompiler_inline_result && (identifierPrefix += "H" + JSCompiler_inline_result.toString(32));
        identifierPrefix += "_";
      } else
        JSCompiler_inline_result = globalClientIdCounter++, identifierPrefix = "_" + identifierPrefix + "r_" + JSCompiler_inline_result.toString(32) + "_";
      return hook.memoizedState = identifierPrefix;
    },
    useHostTransitionStatus,
    useFormState: mountActionState,
    useActionState: mountActionState,
    useOptimistic: function(passthrough) {
      var hook = mountWorkInProgressHook();
      hook.memoizedState = hook.baseState = passthrough;
      var queue = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: null,
        lastRenderedState: null
      };
      hook.queue = queue;
      hook = dispatchOptimisticSetState.bind(
        null,
        currentlyRenderingFiber,
        true,
        queue
      );
      queue.dispatch = hook;
      return [passthrough, hook];
    },
    useMemoCache,
    useCacheRefresh: function() {
      return mountWorkInProgressHook().memoizedState = refreshCache.bind(
        null,
        currentlyRenderingFiber
      );
    },
    useEffectEvent: function(callback) {
      var hook = mountWorkInProgressHook(), ref = { impl: callback };
      hook.memoizedState = ref;
      return function() {
        if (0 !== (executionContext & 2))
          throw Error(formatProdErrorMessage(440));
        return ref.impl.apply(void 0, arguments);
      };
    }
  }, HooksDispatcherOnUpdate = {
    readContext,
    use,
    useCallback: updateCallback,
    useContext: readContext,
    useEffect: updateEffect,
    useImperativeHandle: updateImperativeHandle,
    useInsertionEffect: updateInsertionEffect,
    useLayoutEffect: updateLayoutEffect,
    useMemo: updateMemo,
    useReducer: updateReducer,
    useRef: updateRef,
    useState: function() {
      return updateReducer(basicStateReducer);
    },
    useDebugValue: mountDebugValue,
    useDeferredValue: function(value, initialValue) {
      var hook = updateWorkInProgressHook();
      return updateDeferredValueImpl(
        hook,
        currentHook.memoizedState,
        value,
        initialValue
      );
    },
    useTransition: function() {
      var booleanOrThenable = updateReducer(basicStateReducer)[0], start = updateWorkInProgressHook().memoizedState;
      return [
        "boolean" === typeof booleanOrThenable ? booleanOrThenable : useThenable(booleanOrThenable),
        start
      ];
    },
    useSyncExternalStore: updateSyncExternalStore,
    useId: updateId,
    useHostTransitionStatus,
    useFormState: updateActionState,
    useActionState: updateActionState,
    useOptimistic: function(passthrough, reducer) {
      var hook = updateWorkInProgressHook();
      return updateOptimisticImpl(hook, currentHook, passthrough, reducer);
    },
    useMemoCache,
    useCacheRefresh: updateRefresh
  };
  HooksDispatcherOnUpdate.useEffectEvent = updateEvent;
  var HooksDispatcherOnRerender = {
    readContext,
    use,
    useCallback: updateCallback,
    useContext: readContext,
    useEffect: updateEffect,
    useImperativeHandle: updateImperativeHandle,
    useInsertionEffect: updateInsertionEffect,
    useLayoutEffect: updateLayoutEffect,
    useMemo: updateMemo,
    useReducer: rerenderReducer,
    useRef: updateRef,
    useState: function() {
      return rerenderReducer(basicStateReducer);
    },
    useDebugValue: mountDebugValue,
    useDeferredValue: function(value, initialValue) {
      var hook = updateWorkInProgressHook();
      return null === currentHook ? mountDeferredValueImpl(hook, value, initialValue) : updateDeferredValueImpl(
        hook,
        currentHook.memoizedState,
        value,
        initialValue
      );
    },
    useTransition: function() {
      var booleanOrThenable = rerenderReducer(basicStateReducer)[0], start = updateWorkInProgressHook().memoizedState;
      return [
        "boolean" === typeof booleanOrThenable ? booleanOrThenable : useThenable(booleanOrThenable),
        start
      ];
    },
    useSyncExternalStore: updateSyncExternalStore,
    useId: updateId,
    useHostTransitionStatus,
    useFormState: rerenderActionState,
    useActionState: rerenderActionState,
    useOptimistic: function(passthrough, reducer) {
      var hook = updateWorkInProgressHook();
      if (null !== currentHook)
        return updateOptimisticImpl(hook, currentHook, passthrough, reducer);
      hook.baseState = passthrough;
      return [passthrough, hook.queue.dispatch];
    },
    useMemoCache,
    useCacheRefresh: updateRefresh
  };
  HooksDispatcherOnRerender.useEffectEvent = updateEvent;
  function applyDerivedStateFromProps(workInProgress2, ctor, getDerivedStateFromProps, nextProps) {
    ctor = workInProgress2.memoizedState;
    getDerivedStateFromProps = getDerivedStateFromProps(nextProps, ctor);
    getDerivedStateFromProps = null === getDerivedStateFromProps || void 0 === getDerivedStateFromProps ? ctor : assign({}, ctor, getDerivedStateFromProps);
    workInProgress2.memoizedState = getDerivedStateFromProps;
    0 === workInProgress2.lanes && (workInProgress2.updateQueue.baseState = getDerivedStateFromProps);
  }
  var classComponentUpdater = {
    enqueueSetState: function(inst, payload, callback) {
      inst = inst._reactInternals;
      var lane = requestUpdateLane(), update = createUpdate(lane);
      update.payload = payload;
      void 0 !== callback && null !== callback && (update.callback = callback);
      payload = enqueueUpdate(inst, update, lane);
      null !== payload && (scheduleUpdateOnFiber(payload, inst, lane), entangleTransitions(payload, inst, lane));
    },
    enqueueReplaceState: function(inst, payload, callback) {
      inst = inst._reactInternals;
      var lane = requestUpdateLane(), update = createUpdate(lane);
      update.tag = 1;
      update.payload = payload;
      void 0 !== callback && null !== callback && (update.callback = callback);
      payload = enqueueUpdate(inst, update, lane);
      null !== payload && (scheduleUpdateOnFiber(payload, inst, lane), entangleTransitions(payload, inst, lane));
    },
    enqueueForceUpdate: function(inst, callback) {
      inst = inst._reactInternals;
      var lane = requestUpdateLane(), update = createUpdate(lane);
      update.tag = 2;
      void 0 !== callback && null !== callback && (update.callback = callback);
      callback = enqueueUpdate(inst, update, lane);
      null !== callback && (scheduleUpdateOnFiber(callback, inst, lane), entangleTransitions(callback, inst, lane));
    }
  };
  function checkShouldComponentUpdate(workInProgress2, ctor, oldProps, newProps, oldState, newState, nextContext) {
    workInProgress2 = workInProgress2.stateNode;
    return "function" === typeof workInProgress2.shouldComponentUpdate ? workInProgress2.shouldComponentUpdate(newProps, newState, nextContext) : ctor.prototype && ctor.prototype.isPureReactComponent ? !shallowEqual(oldProps, newProps) || !shallowEqual(oldState, newState) : true;
  }
  function callComponentWillReceiveProps(workInProgress2, instance, newProps, nextContext) {
    workInProgress2 = instance.state;
    "function" === typeof instance.componentWillReceiveProps && instance.componentWillReceiveProps(newProps, nextContext);
    "function" === typeof instance.UNSAFE_componentWillReceiveProps && instance.UNSAFE_componentWillReceiveProps(newProps, nextContext);
    instance.state !== workInProgress2 && classComponentUpdater.enqueueReplaceState(instance, instance.state, null);
  }
  function resolveClassComponentProps(Component, baseProps) {
    var newProps = baseProps;
    if ("ref" in baseProps) {
      newProps = {};
      for (var propName in baseProps)
        "ref" !== propName && (newProps[propName] = baseProps[propName]);
    }
    if (Component = Component.defaultProps) {
      newProps === baseProps && (newProps = assign({}, newProps));
      for (var propName$73 in Component)
        void 0 === newProps[propName$73] && (newProps[propName$73] = Component[propName$73]);
    }
    return newProps;
  }
  function defaultOnUncaughtError(error) {
    reportGlobalError(error);
  }
  function defaultOnCaughtError(error) {
    console.error(error);
  }
  function defaultOnRecoverableError(error) {
    reportGlobalError(error);
  }
  function logUncaughtError(root2, errorInfo) {
    try {
      var onUncaughtError = root2.onUncaughtError;
      onUncaughtError(errorInfo.value, { componentStack: errorInfo.stack });
    } catch (e$74) {
      setTimeout(function() {
        throw e$74;
      });
    }
  }
  function logCaughtError(root2, boundary, errorInfo) {
    try {
      var onCaughtError = root2.onCaughtError;
      onCaughtError(errorInfo.value, {
        componentStack: errorInfo.stack,
        errorBoundary: 1 === boundary.tag ? boundary.stateNode : null
      });
    } catch (e$75) {
      setTimeout(function() {
        throw e$75;
      });
    }
  }
  function createRootErrorUpdate(root2, errorInfo, lane) {
    lane = createUpdate(lane);
    lane.tag = 3;
    lane.payload = { element: null };
    lane.callback = function() {
      logUncaughtError(root2, errorInfo);
    };
    return lane;
  }
  function createClassErrorUpdate(lane) {
    lane = createUpdate(lane);
    lane.tag = 3;
    return lane;
  }
  function initializeClassErrorUpdate(update, root2, fiber, errorInfo) {
    var getDerivedStateFromError = fiber.type.getDerivedStateFromError;
    if ("function" === typeof getDerivedStateFromError) {
      var error = errorInfo.value;
      update.payload = function() {
        return getDerivedStateFromError(error);
      };
      update.callback = function() {
        logCaughtError(root2, fiber, errorInfo);
      };
    }
    var inst = fiber.stateNode;
    null !== inst && "function" === typeof inst.componentDidCatch && (update.callback = function() {
      logCaughtError(root2, fiber, errorInfo);
      "function" !== typeof getDerivedStateFromError && (null === legacyErrorBoundariesThatAlreadyFailed ? legacyErrorBoundariesThatAlreadyFailed = /* @__PURE__ */ new Set([this]) : legacyErrorBoundariesThatAlreadyFailed.add(this));
      var stack = errorInfo.stack;
      this.componentDidCatch(errorInfo.value, {
        componentStack: null !== stack ? stack : ""
      });
    });
  }
  function throwException(root2, returnFiber, sourceFiber, value, rootRenderLanes) {
    sourceFiber.flags |= 32768;
    if (null !== value && "object" === typeof value && "function" === typeof value.then) {
      returnFiber = sourceFiber.alternate;
      null !== returnFiber && propagateParentContextChanges(
        returnFiber,
        sourceFiber,
        rootRenderLanes,
        true
      );
      sourceFiber = suspenseHandlerStackCursor.current;
      if (null !== sourceFiber) {
        switch (sourceFiber.tag) {
          case 31:
          case 13:
            return null === shellBoundary ? renderDidSuspendDelayIfPossible() : null === sourceFiber.alternate && 0 === workInProgressRootExitStatus && (workInProgressRootExitStatus = 3), sourceFiber.flags &= -257, sourceFiber.flags |= 65536, sourceFiber.lanes = rootRenderLanes, value === noopSuspenseyCommitThenable ? sourceFiber.flags |= 16384 : (returnFiber = sourceFiber.updateQueue, null === returnFiber ? sourceFiber.updateQueue = /* @__PURE__ */ new Set([value]) : returnFiber.add(value), attachPingListener(root2, value, rootRenderLanes)), false;
          case 22:
            return sourceFiber.flags |= 65536, value === noopSuspenseyCommitThenable ? sourceFiber.flags |= 16384 : (returnFiber = sourceFiber.updateQueue, null === returnFiber ? (returnFiber = {
              transitions: null,
              markerInstances: null,
              retryQueue: /* @__PURE__ */ new Set([value])
            }, sourceFiber.updateQueue = returnFiber) : (sourceFiber = returnFiber.retryQueue, null === sourceFiber ? returnFiber.retryQueue = /* @__PURE__ */ new Set([value]) : sourceFiber.add(value)), attachPingListener(root2, value, rootRenderLanes)), false;
        }
        throw Error(formatProdErrorMessage(435, sourceFiber.tag));
      }
      attachPingListener(root2, value, rootRenderLanes);
      renderDidSuspendDelayIfPossible();
      return false;
    }
    if (isHydrating)
      return returnFiber = suspenseHandlerStackCursor.current, null !== returnFiber ? (0 === (returnFiber.flags & 65536) && (returnFiber.flags |= 256), returnFiber.flags |= 65536, returnFiber.lanes = rootRenderLanes, value !== HydrationMismatchException && (root2 = Error(formatProdErrorMessage(422), { cause: value }), queueHydrationError(createCapturedValueAtFiber(root2, sourceFiber)))) : (value !== HydrationMismatchException && (returnFiber = Error(formatProdErrorMessage(423), {
        cause: value
      }), queueHydrationError(
        createCapturedValueAtFiber(returnFiber, sourceFiber)
      )), root2 = root2.current.alternate, root2.flags |= 65536, rootRenderLanes &= -rootRenderLanes, root2.lanes |= rootRenderLanes, value = createCapturedValueAtFiber(value, sourceFiber), rootRenderLanes = createRootErrorUpdate(
        root2.stateNode,
        value,
        rootRenderLanes
      ), enqueueCapturedUpdate(root2, rootRenderLanes), 4 !== workInProgressRootExitStatus && (workInProgressRootExitStatus = 2)), false;
    var wrapperError = Error(formatProdErrorMessage(520), { cause: value });
    wrapperError = createCapturedValueAtFiber(wrapperError, sourceFiber);
    null === workInProgressRootConcurrentErrors ? workInProgressRootConcurrentErrors = [wrapperError] : workInProgressRootConcurrentErrors.push(wrapperError);
    4 !== workInProgressRootExitStatus && (workInProgressRootExitStatus = 2);
    if (null === returnFiber) return true;
    value = createCapturedValueAtFiber(value, sourceFiber);
    sourceFiber = returnFiber;
    do {
      switch (sourceFiber.tag) {
        case 3:
          return sourceFiber.flags |= 65536, root2 = rootRenderLanes & -rootRenderLanes, sourceFiber.lanes |= root2, root2 = createRootErrorUpdate(sourceFiber.stateNode, value, root2), enqueueCapturedUpdate(sourceFiber, root2), false;
        case 1:
          if (returnFiber = sourceFiber.type, wrapperError = sourceFiber.stateNode, 0 === (sourceFiber.flags & 128) && ("function" === typeof returnFiber.getDerivedStateFromError || null !== wrapperError && "function" === typeof wrapperError.componentDidCatch && (null === legacyErrorBoundariesThatAlreadyFailed || !legacyErrorBoundariesThatAlreadyFailed.has(wrapperError))))
            return sourceFiber.flags |= 65536, rootRenderLanes &= -rootRenderLanes, sourceFiber.lanes |= rootRenderLanes, rootRenderLanes = createClassErrorUpdate(rootRenderLanes), initializeClassErrorUpdate(
              rootRenderLanes,
              root2,
              sourceFiber,
              value
            ), enqueueCapturedUpdate(sourceFiber, rootRenderLanes), false;
      }
      sourceFiber = sourceFiber.return;
    } while (null !== sourceFiber);
    return false;
  }
  var SelectiveHydrationException = Error(formatProdErrorMessage(461)), didReceiveUpdate = false;
  function reconcileChildren(current, workInProgress2, nextChildren, renderLanes2) {
    workInProgress2.child = null === current ? mountChildFibers(workInProgress2, null, nextChildren, renderLanes2) : reconcileChildFibers(
      workInProgress2,
      current.child,
      nextChildren,
      renderLanes2
    );
  }
  function updateForwardRef(current, workInProgress2, Component, nextProps, renderLanes2) {
    Component = Component.render;
    var ref = workInProgress2.ref;
    if ("ref" in nextProps) {
      var propsWithoutRef = {};
      for (var key in nextProps)
        "ref" !== key && (propsWithoutRef[key] = nextProps[key]);
    } else propsWithoutRef = nextProps;
    prepareToReadContext(workInProgress2);
    nextProps = renderWithHooks(
      current,
      workInProgress2,
      Component,
      propsWithoutRef,
      ref,
      renderLanes2
    );
    key = checkDidRenderIdHook();
    if (null !== current && !didReceiveUpdate)
      return bailoutHooks(current, workInProgress2, renderLanes2), bailoutOnAlreadyFinishedWork(current, workInProgress2, renderLanes2);
    isHydrating && key && pushMaterializedTreeId(workInProgress2);
    workInProgress2.flags |= 1;
    reconcileChildren(current, workInProgress2, nextProps, renderLanes2);
    return workInProgress2.child;
  }
  function updateMemoComponent(current, workInProgress2, Component, nextProps, renderLanes2) {
    if (null === current) {
      var type = Component.type;
      if ("function" === typeof type && !shouldConstruct(type) && void 0 === type.defaultProps && null === Component.compare)
        return workInProgress2.tag = 15, workInProgress2.type = type, updateSimpleMemoComponent(
          current,
          workInProgress2,
          type,
          nextProps,
          renderLanes2
        );
      current = createFiberFromTypeAndProps(
        Component.type,
        null,
        nextProps,
        workInProgress2,
        workInProgress2.mode,
        renderLanes2
      );
      current.ref = workInProgress2.ref;
      current.return = workInProgress2;
      return workInProgress2.child = current;
    }
    type = current.child;
    if (!checkScheduledUpdateOrContext(current, renderLanes2)) {
      var prevProps = type.memoizedProps;
      Component = Component.compare;
      Component = null !== Component ? Component : shallowEqual;
      if (Component(prevProps, nextProps) && current.ref === workInProgress2.ref)
        return bailoutOnAlreadyFinishedWork(current, workInProgress2, renderLanes2);
    }
    workInProgress2.flags |= 1;
    current = createWorkInProgress(type, nextProps);
    current.ref = workInProgress2.ref;
    current.return = workInProgress2;
    return workInProgress2.child = current;
  }
  function updateSimpleMemoComponent(current, workInProgress2, Component, nextProps, renderLanes2) {
    if (null !== current) {
      var prevProps = current.memoizedProps;
      if (shallowEqual(prevProps, nextProps) && current.ref === workInProgress2.ref)
        if (didReceiveUpdate = false, workInProgress2.pendingProps = nextProps = prevProps, checkScheduledUpdateOrContext(current, renderLanes2))
          0 !== (current.flags & 131072) && (didReceiveUpdate = true);
        else
          return workInProgress2.lanes = current.lanes, bailoutOnAlreadyFinishedWork(current, workInProgress2, renderLanes2);
    }
    return updateFunctionComponent(
      current,
      workInProgress2,
      Component,
      nextProps,
      renderLanes2
    );
  }
  function updateOffscreenComponent(current, workInProgress2, renderLanes2, nextProps) {
    var nextChildren = nextProps.children, prevState = null !== current ? current.memoizedState : null;
    null === current && null === workInProgress2.stateNode && (workInProgress2.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    });
    if ("hidden" === nextProps.mode) {
      if (0 !== (workInProgress2.flags & 128)) {
        prevState = null !== prevState ? prevState.baseLanes | renderLanes2 : renderLanes2;
        if (null !== current) {
          nextProps = workInProgress2.child = current.child;
          for (nextChildren = 0; null !== nextProps; )
            nextChildren = nextChildren | nextProps.lanes | nextProps.childLanes, nextProps = nextProps.sibling;
          nextProps = nextChildren & ~prevState;
        } else nextProps = 0, workInProgress2.child = null;
        return deferHiddenOffscreenComponent(
          current,
          workInProgress2,
          prevState,
          renderLanes2,
          nextProps
        );
      }
      if (0 !== (renderLanes2 & 536870912))
        workInProgress2.memoizedState = { baseLanes: 0, cachePool: null }, null !== current && pushTransition(
          workInProgress2,
          null !== prevState ? prevState.cachePool : null
        ), null !== prevState ? pushHiddenContext(workInProgress2, prevState) : reuseHiddenContextOnStack(), pushOffscreenSuspenseHandler(workInProgress2);
      else
        return nextProps = workInProgress2.lanes = 536870912, deferHiddenOffscreenComponent(
          current,
          workInProgress2,
          null !== prevState ? prevState.baseLanes | renderLanes2 : renderLanes2,
          renderLanes2,
          nextProps
        );
    } else
      null !== prevState ? (pushTransition(workInProgress2, prevState.cachePool), pushHiddenContext(workInProgress2, prevState), reuseSuspenseHandlerOnStack(), workInProgress2.memoizedState = null) : (null !== current && pushTransition(workInProgress2, null), reuseHiddenContextOnStack(), reuseSuspenseHandlerOnStack());
    reconcileChildren(current, workInProgress2, nextChildren, renderLanes2);
    return workInProgress2.child;
  }
  function bailoutOffscreenComponent(current, workInProgress2) {
    null !== current && 22 === current.tag || null !== workInProgress2.stateNode || (workInProgress2.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    });
    return workInProgress2.sibling;
  }
  function deferHiddenOffscreenComponent(current, workInProgress2, nextBaseLanes, renderLanes2, remainingChildLanes) {
    var JSCompiler_inline_result = peekCacheFromPool();
    JSCompiler_inline_result = null === JSCompiler_inline_result ? null : { parent: CacheContext._currentValue, pool: JSCompiler_inline_result };
    workInProgress2.memoizedState = {
      baseLanes: nextBaseLanes,
      cachePool: JSCompiler_inline_result
    };
    null !== current && pushTransition(workInProgress2, null);
    reuseHiddenContextOnStack();
    pushOffscreenSuspenseHandler(workInProgress2);
    null !== current && propagateParentContextChanges(current, workInProgress2, renderLanes2, true);
    workInProgress2.childLanes = remainingChildLanes;
    return null;
  }
  function mountActivityChildren(workInProgress2, nextProps) {
    nextProps = mountWorkInProgressOffscreenFiber(
      { mode: nextProps.mode, children: nextProps.children },
      workInProgress2.mode
    );
    nextProps.ref = workInProgress2.ref;
    workInProgress2.child = nextProps;
    nextProps.return = workInProgress2;
    return nextProps;
  }
  function retryActivityComponentWithoutHydrating(current, workInProgress2, renderLanes2) {
    reconcileChildFibers(workInProgress2, current.child, null, renderLanes2);
    current = mountActivityChildren(workInProgress2, workInProgress2.pendingProps);
    current.flags |= 2;
    popSuspenseHandler(workInProgress2);
    workInProgress2.memoizedState = null;
    return current;
  }
  function updateActivityComponent(current, workInProgress2, renderLanes2) {
    var nextProps = workInProgress2.pendingProps, didSuspend = 0 !== (workInProgress2.flags & 128);
    workInProgress2.flags &= -129;
    if (null === current) {
      if (isHydrating) {
        if ("hidden" === nextProps.mode)
          return current = mountActivityChildren(workInProgress2, nextProps), workInProgress2.lanes = 536870912, bailoutOffscreenComponent(null, current);
        pushDehydratedActivitySuspenseHandler(workInProgress2);
        (current = nextHydratableInstance) ? (current = canHydrateHydrationBoundary(
          current,
          rootOrSingletonContext
        ), current = null !== current && "&" === current.data ? current : null, null !== current && (workInProgress2.memoizedState = {
          dehydrated: current,
          treeContext: null !== treeContextProvider ? { id: treeContextId, overflow: treeContextOverflow } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, renderLanes2 = createFiberFromDehydratedFragment(current), renderLanes2.return = workInProgress2, workInProgress2.child = renderLanes2, hydrationParentFiber = workInProgress2, nextHydratableInstance = null)) : current = null;
        if (null === current) throw throwOnHydrationMismatch(workInProgress2);
        workInProgress2.lanes = 536870912;
        return null;
      }
      return mountActivityChildren(workInProgress2, nextProps);
    }
    var prevState = current.memoizedState;
    if (null !== prevState) {
      var dehydrated = prevState.dehydrated;
      pushDehydratedActivitySuspenseHandler(workInProgress2);
      if (didSuspend)
        if (workInProgress2.flags & 256)
          workInProgress2.flags &= -257, workInProgress2 = retryActivityComponentWithoutHydrating(
            current,
            workInProgress2,
            renderLanes2
          );
        else if (null !== workInProgress2.memoizedState)
          workInProgress2.child = current.child, workInProgress2.flags |= 128, workInProgress2 = null;
        else throw Error(formatProdErrorMessage(558));
      else if (didReceiveUpdate || propagateParentContextChanges(current, workInProgress2, renderLanes2, false), didSuspend = 0 !== (renderLanes2 & current.childLanes), didReceiveUpdate || didSuspend) {
        nextProps = workInProgressRoot;
        if (null !== nextProps && (dehydrated = getBumpedLaneForHydration(nextProps, renderLanes2), 0 !== dehydrated && dehydrated !== prevState.retryLane))
          throw prevState.retryLane = dehydrated, enqueueConcurrentRenderForLane(current, dehydrated), scheduleUpdateOnFiber(nextProps, current, dehydrated), SelectiveHydrationException;
        renderDidSuspendDelayIfPossible();
        workInProgress2 = retryActivityComponentWithoutHydrating(
          current,
          workInProgress2,
          renderLanes2
        );
      } else
        current = prevState.treeContext, nextHydratableInstance = getNextHydratable(dehydrated.nextSibling), hydrationParentFiber = workInProgress2, isHydrating = true, hydrationErrors = null, rootOrSingletonContext = false, null !== current && restoreSuspendedTreeContext(workInProgress2, current), workInProgress2 = mountActivityChildren(workInProgress2, nextProps), workInProgress2.flags |= 4096;
      return workInProgress2;
    }
    current = createWorkInProgress(current.child, {
      mode: nextProps.mode,
      children: nextProps.children
    });
    current.ref = workInProgress2.ref;
    workInProgress2.child = current;
    current.return = workInProgress2;
    return current;
  }
  function markRef(current, workInProgress2) {
    var ref = workInProgress2.ref;
    if (null === ref)
      null !== current && null !== current.ref && (workInProgress2.flags |= 4194816);
    else {
      if ("function" !== typeof ref && "object" !== typeof ref)
        throw Error(formatProdErrorMessage(284));
      if (null === current || current.ref !== ref)
        workInProgress2.flags |= 4194816;
    }
  }
  function updateFunctionComponent(current, workInProgress2, Component, nextProps, renderLanes2) {
    prepareToReadContext(workInProgress2);
    Component = renderWithHooks(
      current,
      workInProgress2,
      Component,
      nextProps,
      void 0,
      renderLanes2
    );
    nextProps = checkDidRenderIdHook();
    if (null !== current && !didReceiveUpdate)
      return bailoutHooks(current, workInProgress2, renderLanes2), bailoutOnAlreadyFinishedWork(current, workInProgress2, renderLanes2);
    isHydrating && nextProps && pushMaterializedTreeId(workInProgress2);
    workInProgress2.flags |= 1;
    reconcileChildren(current, workInProgress2, Component, renderLanes2);
    return workInProgress2.child;
  }
  function replayFunctionComponent(current, workInProgress2, nextProps, Component, secondArg, renderLanes2) {
    prepareToReadContext(workInProgress2);
    workInProgress2.updateQueue = null;
    nextProps = renderWithHooksAgain(
      workInProgress2,
      Component,
      nextProps,
      secondArg
    );
    finishRenderingHooks(current);
    Component = checkDidRenderIdHook();
    if (null !== current && !didReceiveUpdate)
      return bailoutHooks(current, workInProgress2, renderLanes2), bailoutOnAlreadyFinishedWork(current, workInProgress2, renderLanes2);
    isHydrating && Component && pushMaterializedTreeId(workInProgress2);
    workInProgress2.flags |= 1;
    reconcileChildren(current, workInProgress2, nextProps, renderLanes2);
    return workInProgress2.child;
  }
  function updateClassComponent(current, workInProgress2, Component, nextProps, renderLanes2) {
    prepareToReadContext(workInProgress2);
    if (null === workInProgress2.stateNode) {
      var context = emptyContextObject, contextType = Component.contextType;
      "object" === typeof contextType && null !== contextType && (context = readContext(contextType));
      context = new Component(nextProps, context);
      workInProgress2.memoizedState = null !== context.state && void 0 !== context.state ? context.state : null;
      context.updater = classComponentUpdater;
      workInProgress2.stateNode = context;
      context._reactInternals = workInProgress2;
      context = workInProgress2.stateNode;
      context.props = nextProps;
      context.state = workInProgress2.memoizedState;
      context.refs = {};
      initializeUpdateQueue(workInProgress2);
      contextType = Component.contextType;
      context.context = "object" === typeof contextType && null !== contextType ? readContext(contextType) : emptyContextObject;
      context.state = workInProgress2.memoizedState;
      contextType = Component.getDerivedStateFromProps;
      "function" === typeof contextType && (applyDerivedStateFromProps(
        workInProgress2,
        Component,
        contextType,
        nextProps
      ), context.state = workInProgress2.memoizedState);
      "function" === typeof Component.getDerivedStateFromProps || "function" === typeof context.getSnapshotBeforeUpdate || "function" !== typeof context.UNSAFE_componentWillMount && "function" !== typeof context.componentWillMount || (contextType = context.state, "function" === typeof context.componentWillMount && context.componentWillMount(), "function" === typeof context.UNSAFE_componentWillMount && context.UNSAFE_componentWillMount(), contextType !== context.state && classComponentUpdater.enqueueReplaceState(context, context.state, null), processUpdateQueue(workInProgress2, nextProps, context, renderLanes2), suspendIfUpdateReadFromEntangledAsyncAction(), context.state = workInProgress2.memoizedState);
      "function" === typeof context.componentDidMount && (workInProgress2.flags |= 4194308);
      nextProps = true;
    } else if (null === current) {
      context = workInProgress2.stateNode;
      var unresolvedOldProps = workInProgress2.memoizedProps, oldProps = resolveClassComponentProps(Component, unresolvedOldProps);
      context.props = oldProps;
      var oldContext = context.context, contextType$jscomp$0 = Component.contextType;
      contextType = emptyContextObject;
      "object" === typeof contextType$jscomp$0 && null !== contextType$jscomp$0 && (contextType = readContext(contextType$jscomp$0));
      var getDerivedStateFromProps = Component.getDerivedStateFromProps;
      contextType$jscomp$0 = "function" === typeof getDerivedStateFromProps || "function" === typeof context.getSnapshotBeforeUpdate;
      unresolvedOldProps = workInProgress2.pendingProps !== unresolvedOldProps;
      contextType$jscomp$0 || "function" !== typeof context.UNSAFE_componentWillReceiveProps && "function" !== typeof context.componentWillReceiveProps || (unresolvedOldProps || oldContext !== contextType) && callComponentWillReceiveProps(
        workInProgress2,
        context,
        nextProps,
        contextType
      );
      hasForceUpdate = false;
      var oldState = workInProgress2.memoizedState;
      context.state = oldState;
      processUpdateQueue(workInProgress2, nextProps, context, renderLanes2);
      suspendIfUpdateReadFromEntangledAsyncAction();
      oldContext = workInProgress2.memoizedState;
      unresolvedOldProps || oldState !== oldContext || hasForceUpdate ? ("function" === typeof getDerivedStateFromProps && (applyDerivedStateFromProps(
        workInProgress2,
        Component,
        getDerivedStateFromProps,
        nextProps
      ), oldContext = workInProgress2.memoizedState), (oldProps = hasForceUpdate || checkShouldComponentUpdate(
        workInProgress2,
        Component,
        oldProps,
        nextProps,
        oldState,
        oldContext,
        contextType
      )) ? (contextType$jscomp$0 || "function" !== typeof context.UNSAFE_componentWillMount && "function" !== typeof context.componentWillMount || ("function" === typeof context.componentWillMount && context.componentWillMount(), "function" === typeof context.UNSAFE_componentWillMount && context.UNSAFE_componentWillMount()), "function" === typeof context.componentDidMount && (workInProgress2.flags |= 4194308)) : ("function" === typeof context.componentDidMount && (workInProgress2.flags |= 4194308), workInProgress2.memoizedProps = nextProps, workInProgress2.memoizedState = oldContext), context.props = nextProps, context.state = oldContext, context.context = contextType, nextProps = oldProps) : ("function" === typeof context.componentDidMount && (workInProgress2.flags |= 4194308), nextProps = false);
    } else {
      context = workInProgress2.stateNode;
      cloneUpdateQueue(current, workInProgress2);
      contextType = workInProgress2.memoizedProps;
      contextType$jscomp$0 = resolveClassComponentProps(Component, contextType);
      context.props = contextType$jscomp$0;
      getDerivedStateFromProps = workInProgress2.pendingProps;
      oldState = context.context;
      oldContext = Component.contextType;
      oldProps = emptyContextObject;
      "object" === typeof oldContext && null !== oldContext && (oldProps = readContext(oldContext));
      unresolvedOldProps = Component.getDerivedStateFromProps;
      (oldContext = "function" === typeof unresolvedOldProps || "function" === typeof context.getSnapshotBeforeUpdate) || "function" !== typeof context.UNSAFE_componentWillReceiveProps && "function" !== typeof context.componentWillReceiveProps || (contextType !== getDerivedStateFromProps || oldState !== oldProps) && callComponentWillReceiveProps(
        workInProgress2,
        context,
        nextProps,
        oldProps
      );
      hasForceUpdate = false;
      oldState = workInProgress2.memoizedState;
      context.state = oldState;
      processUpdateQueue(workInProgress2, nextProps, context, renderLanes2);
      suspendIfUpdateReadFromEntangledAsyncAction();
      var newState = workInProgress2.memoizedState;
      contextType !== getDerivedStateFromProps || oldState !== newState || hasForceUpdate || null !== current && null !== current.dependencies && checkIfContextChanged(current.dependencies) ? ("function" === typeof unresolvedOldProps && (applyDerivedStateFromProps(
        workInProgress2,
        Component,
        unresolvedOldProps,
        nextProps
      ), newState = workInProgress2.memoizedState), (contextType$jscomp$0 = hasForceUpdate || checkShouldComponentUpdate(
        workInProgress2,
        Component,
        contextType$jscomp$0,
        nextProps,
        oldState,
        newState,
        oldProps
      ) || null !== current && null !== current.dependencies && checkIfContextChanged(current.dependencies)) ? (oldContext || "function" !== typeof context.UNSAFE_componentWillUpdate && "function" !== typeof context.componentWillUpdate || ("function" === typeof context.componentWillUpdate && context.componentWillUpdate(nextProps, newState, oldProps), "function" === typeof context.UNSAFE_componentWillUpdate && context.UNSAFE_componentWillUpdate(
        nextProps,
        newState,
        oldProps
      )), "function" === typeof context.componentDidUpdate && (workInProgress2.flags |= 4), "function" === typeof context.getSnapshotBeforeUpdate && (workInProgress2.flags |= 1024)) : ("function" !== typeof context.componentDidUpdate || contextType === current.memoizedProps && oldState === current.memoizedState || (workInProgress2.flags |= 4), "function" !== typeof context.getSnapshotBeforeUpdate || contextType === current.memoizedProps && oldState === current.memoizedState || (workInProgress2.flags |= 1024), workInProgress2.memoizedProps = nextProps, workInProgress2.memoizedState = newState), context.props = nextProps, context.state = newState, context.context = oldProps, nextProps = contextType$jscomp$0) : ("function" !== typeof context.componentDidUpdate || contextType === current.memoizedProps && oldState === current.memoizedState || (workInProgress2.flags |= 4), "function" !== typeof context.getSnapshotBeforeUpdate || contextType === current.memoizedProps && oldState === current.memoizedState || (workInProgress2.flags |= 1024), nextProps = false);
    }
    context = nextProps;
    markRef(current, workInProgress2);
    nextProps = 0 !== (workInProgress2.flags & 128);
    context || nextProps ? (context = workInProgress2.stateNode, Component = nextProps && "function" !== typeof Component.getDerivedStateFromError ? null : context.render(), workInProgress2.flags |= 1, null !== current && nextProps ? (workInProgress2.child = reconcileChildFibers(
      workInProgress2,
      current.child,
      null,
      renderLanes2
    ), workInProgress2.child = reconcileChildFibers(
      workInProgress2,
      null,
      Component,
      renderLanes2
    )) : reconcileChildren(current, workInProgress2, Component, renderLanes2), workInProgress2.memoizedState = context.state, current = workInProgress2.child) : current = bailoutOnAlreadyFinishedWork(
      current,
      workInProgress2,
      renderLanes2
    );
    return current;
  }
  function mountHostRootWithoutHydrating(current, workInProgress2, nextChildren, renderLanes2) {
    resetHydrationState();
    workInProgress2.flags |= 256;
    reconcileChildren(current, workInProgress2, nextChildren, renderLanes2);
    return workInProgress2.child;
  }
  var SUSPENDED_MARKER = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null
  };
  function mountSuspenseOffscreenState(renderLanes2) {
    return { baseLanes: renderLanes2, cachePool: getSuspendedCache() };
  }
  function getRemainingWorkInPrimaryTree(current, primaryTreeDidDefer, renderLanes2) {
    current = null !== current ? current.childLanes & ~renderLanes2 : 0;
    primaryTreeDidDefer && (current |= workInProgressDeferredLane);
    return current;
  }
  function updateSuspenseComponent(current, workInProgress2, renderLanes2) {
    var nextProps = workInProgress2.pendingProps, showFallback = false, didSuspend = 0 !== (workInProgress2.flags & 128), JSCompiler_temp;
    (JSCompiler_temp = didSuspend) || (JSCompiler_temp = null !== current && null === current.memoizedState ? false : 0 !== (suspenseStackCursor.current & 2));
    JSCompiler_temp && (showFallback = true, workInProgress2.flags &= -129);
    JSCompiler_temp = 0 !== (workInProgress2.flags & 32);
    workInProgress2.flags &= -33;
    if (null === current) {
      if (isHydrating) {
        showFallback ? pushPrimaryTreeSuspenseHandler(workInProgress2) : reuseSuspenseHandlerOnStack();
        (current = nextHydratableInstance) ? (current = canHydrateHydrationBoundary(
          current,
          rootOrSingletonContext
        ), current = null !== current && "&" !== current.data ? current : null, null !== current && (workInProgress2.memoizedState = {
          dehydrated: current,
          treeContext: null !== treeContextProvider ? { id: treeContextId, overflow: treeContextOverflow } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, renderLanes2 = createFiberFromDehydratedFragment(current), renderLanes2.return = workInProgress2, workInProgress2.child = renderLanes2, hydrationParentFiber = workInProgress2, nextHydratableInstance = null)) : current = null;
        if (null === current) throw throwOnHydrationMismatch(workInProgress2);
        isSuspenseInstanceFallback(current) ? workInProgress2.lanes = 32 : workInProgress2.lanes = 536870912;
        return null;
      }
      var nextPrimaryChildren = nextProps.children;
      nextProps = nextProps.fallback;
      if (showFallback)
        return reuseSuspenseHandlerOnStack(), showFallback = workInProgress2.mode, nextPrimaryChildren = mountWorkInProgressOffscreenFiber(
          { mode: "hidden", children: nextPrimaryChildren },
          showFallback
        ), nextProps = createFiberFromFragment(
          nextProps,
          showFallback,
          renderLanes2,
          null
        ), nextPrimaryChildren.return = workInProgress2, nextProps.return = workInProgress2, nextPrimaryChildren.sibling = nextProps, workInProgress2.child = nextPrimaryChildren, nextProps = workInProgress2.child, nextProps.memoizedState = mountSuspenseOffscreenState(renderLanes2), nextProps.childLanes = getRemainingWorkInPrimaryTree(
          current,
          JSCompiler_temp,
          renderLanes2
        ), workInProgress2.memoizedState = SUSPENDED_MARKER, bailoutOffscreenComponent(null, nextProps);
      pushPrimaryTreeSuspenseHandler(workInProgress2);
      return mountSuspensePrimaryChildren(workInProgress2, nextPrimaryChildren);
    }
    var prevState = current.memoizedState;
    if (null !== prevState && (nextPrimaryChildren = prevState.dehydrated, null !== nextPrimaryChildren)) {
      if (didSuspend)
        workInProgress2.flags & 256 ? (pushPrimaryTreeSuspenseHandler(workInProgress2), workInProgress2.flags &= -257, workInProgress2 = retrySuspenseComponentWithoutHydrating(
          current,
          workInProgress2,
          renderLanes2
        )) : null !== workInProgress2.memoizedState ? (reuseSuspenseHandlerOnStack(), workInProgress2.child = current.child, workInProgress2.flags |= 128, workInProgress2 = null) : (reuseSuspenseHandlerOnStack(), nextPrimaryChildren = nextProps.fallback, showFallback = workInProgress2.mode, nextProps = mountWorkInProgressOffscreenFiber(
          { mode: "visible", children: nextProps.children },
          showFallback
        ), nextPrimaryChildren = createFiberFromFragment(
          nextPrimaryChildren,
          showFallback,
          renderLanes2,
          null
        ), nextPrimaryChildren.flags |= 2, nextProps.return = workInProgress2, nextPrimaryChildren.return = workInProgress2, nextProps.sibling = nextPrimaryChildren, workInProgress2.child = nextProps, reconcileChildFibers(
          workInProgress2,
          current.child,
          null,
          renderLanes2
        ), nextProps = workInProgress2.child, nextProps.memoizedState = mountSuspenseOffscreenState(renderLanes2), nextProps.childLanes = getRemainingWorkInPrimaryTree(
          current,
          JSCompiler_temp,
          renderLanes2
        ), workInProgress2.memoizedState = SUSPENDED_MARKER, workInProgress2 = bailoutOffscreenComponent(null, nextProps));
      else if (pushPrimaryTreeSuspenseHandler(workInProgress2), isSuspenseInstanceFallback(nextPrimaryChildren)) {
        JSCompiler_temp = nextPrimaryChildren.nextSibling && nextPrimaryChildren.nextSibling.dataset;
        if (JSCompiler_temp) var digest = JSCompiler_temp.dgst;
        JSCompiler_temp = digest;
        nextProps = Error(formatProdErrorMessage(419));
        nextProps.stack = "";
        nextProps.digest = JSCompiler_temp;
        queueHydrationError({ value: nextProps, source: null, stack: null });
        workInProgress2 = retrySuspenseComponentWithoutHydrating(
          current,
          workInProgress2,
          renderLanes2
        );
      } else if (didReceiveUpdate || propagateParentContextChanges(current, workInProgress2, renderLanes2, false), JSCompiler_temp = 0 !== (renderLanes2 & current.childLanes), didReceiveUpdate || JSCompiler_temp) {
        JSCompiler_temp = workInProgressRoot;
        if (null !== JSCompiler_temp && (nextProps = getBumpedLaneForHydration(JSCompiler_temp, renderLanes2), 0 !== nextProps && nextProps !== prevState.retryLane))
          throw prevState.retryLane = nextProps, enqueueConcurrentRenderForLane(current, nextProps), scheduleUpdateOnFiber(JSCompiler_temp, current, nextProps), SelectiveHydrationException;
        isSuspenseInstancePending(nextPrimaryChildren) || renderDidSuspendDelayIfPossible();
        workInProgress2 = retrySuspenseComponentWithoutHydrating(
          current,
          workInProgress2,
          renderLanes2
        );
      } else
        isSuspenseInstancePending(nextPrimaryChildren) ? (workInProgress2.flags |= 192, workInProgress2.child = current.child, workInProgress2 = null) : (current = prevState.treeContext, nextHydratableInstance = getNextHydratable(
          nextPrimaryChildren.nextSibling
        ), hydrationParentFiber = workInProgress2, isHydrating = true, hydrationErrors = null, rootOrSingletonContext = false, null !== current && restoreSuspendedTreeContext(workInProgress2, current), workInProgress2 = mountSuspensePrimaryChildren(
          workInProgress2,
          nextProps.children
        ), workInProgress2.flags |= 4096);
      return workInProgress2;
    }
    if (showFallback)
      return reuseSuspenseHandlerOnStack(), nextPrimaryChildren = nextProps.fallback, showFallback = workInProgress2.mode, prevState = current.child, digest = prevState.sibling, nextProps = createWorkInProgress(prevState, {
        mode: "hidden",
        children: nextProps.children
      }), nextProps.subtreeFlags = prevState.subtreeFlags & 65011712, null !== digest ? nextPrimaryChildren = createWorkInProgress(
        digest,
        nextPrimaryChildren
      ) : (nextPrimaryChildren = createFiberFromFragment(
        nextPrimaryChildren,
        showFallback,
        renderLanes2,
        null
      ), nextPrimaryChildren.flags |= 2), nextPrimaryChildren.return = workInProgress2, nextProps.return = workInProgress2, nextProps.sibling = nextPrimaryChildren, workInProgress2.child = nextProps, bailoutOffscreenComponent(null, nextProps), nextProps = workInProgress2.child, nextPrimaryChildren = current.child.memoizedState, null === nextPrimaryChildren ? nextPrimaryChildren = mountSuspenseOffscreenState(renderLanes2) : (showFallback = nextPrimaryChildren.cachePool, null !== showFallback ? (prevState = CacheContext._currentValue, showFallback = showFallback.parent !== prevState ? { parent: prevState, pool: prevState } : showFallback) : showFallback = getSuspendedCache(), nextPrimaryChildren = {
        baseLanes: nextPrimaryChildren.baseLanes | renderLanes2,
        cachePool: showFallback
      }), nextProps.memoizedState = nextPrimaryChildren, nextProps.childLanes = getRemainingWorkInPrimaryTree(
        current,
        JSCompiler_temp,
        renderLanes2
      ), workInProgress2.memoizedState = SUSPENDED_MARKER, bailoutOffscreenComponent(current.child, nextProps);
    pushPrimaryTreeSuspenseHandler(workInProgress2);
    renderLanes2 = current.child;
    current = renderLanes2.sibling;
    renderLanes2 = createWorkInProgress(renderLanes2, {
      mode: "visible",
      children: nextProps.children
    });
    renderLanes2.return = workInProgress2;
    renderLanes2.sibling = null;
    null !== current && (JSCompiler_temp = workInProgress2.deletions, null === JSCompiler_temp ? (workInProgress2.deletions = [current], workInProgress2.flags |= 16) : JSCompiler_temp.push(current));
    workInProgress2.child = renderLanes2;
    workInProgress2.memoizedState = null;
    return renderLanes2;
  }
  function mountSuspensePrimaryChildren(workInProgress2, primaryChildren) {
    primaryChildren = mountWorkInProgressOffscreenFiber(
      { mode: "visible", children: primaryChildren },
      workInProgress2.mode
    );
    primaryChildren.return = workInProgress2;
    return workInProgress2.child = primaryChildren;
  }
  function mountWorkInProgressOffscreenFiber(offscreenProps, mode) {
    offscreenProps = createFiberImplClass(22, offscreenProps, null, mode);
    offscreenProps.lanes = 0;
    return offscreenProps;
  }
  function retrySuspenseComponentWithoutHydrating(current, workInProgress2, renderLanes2) {
    reconcileChildFibers(workInProgress2, current.child, null, renderLanes2);
    current = mountSuspensePrimaryChildren(
      workInProgress2,
      workInProgress2.pendingProps.children
    );
    current.flags |= 2;
    workInProgress2.memoizedState = null;
    return current;
  }
  function scheduleSuspenseWorkOnFiber(fiber, renderLanes2, propagationRoot) {
    fiber.lanes |= renderLanes2;
    var alternate = fiber.alternate;
    null !== alternate && (alternate.lanes |= renderLanes2);
    scheduleContextWorkOnParentPath(fiber.return, renderLanes2, propagationRoot);
  }
  function initSuspenseListRenderState(workInProgress2, isBackwards, tail, lastContentRow, tailMode, treeForkCount2) {
    var renderState = workInProgress2.memoizedState;
    null === renderState ? workInProgress2.memoizedState = {
      isBackwards,
      rendering: null,
      renderingStartTime: 0,
      last: lastContentRow,
      tail,
      tailMode,
      treeForkCount: treeForkCount2
    } : (renderState.isBackwards = isBackwards, renderState.rendering = null, renderState.renderingStartTime = 0, renderState.last = lastContentRow, renderState.tail = tail, renderState.tailMode = tailMode, renderState.treeForkCount = treeForkCount2);
  }
  function updateSuspenseListComponent(current, workInProgress2, renderLanes2) {
    var nextProps = workInProgress2.pendingProps, revealOrder = nextProps.revealOrder, tailMode = nextProps.tail;
    nextProps = nextProps.children;
    var suspenseContext = suspenseStackCursor.current, shouldForceFallback = 0 !== (suspenseContext & 2);
    shouldForceFallback ? (suspenseContext = suspenseContext & 1 | 2, workInProgress2.flags |= 128) : suspenseContext &= 1;
    push(suspenseStackCursor, suspenseContext);
    reconcileChildren(current, workInProgress2, nextProps, renderLanes2);
    nextProps = isHydrating ? treeForkCount : 0;
    if (!shouldForceFallback && null !== current && 0 !== (current.flags & 128))
      a: for (current = workInProgress2.child; null !== current; ) {
        if (13 === current.tag)
          null !== current.memoizedState && scheduleSuspenseWorkOnFiber(current, renderLanes2, workInProgress2);
        else if (19 === current.tag)
          scheduleSuspenseWorkOnFiber(current, renderLanes2, workInProgress2);
        else if (null !== current.child) {
          current.child.return = current;
          current = current.child;
          continue;
        }
        if (current === workInProgress2) break a;
        for (; null === current.sibling; ) {
          if (null === current.return || current.return === workInProgress2)
            break a;
          current = current.return;
        }
        current.sibling.return = current.return;
        current = current.sibling;
      }
    switch (revealOrder) {
      case "forwards":
        renderLanes2 = workInProgress2.child;
        for (revealOrder = null; null !== renderLanes2; )
          current = renderLanes2.alternate, null !== current && null === findFirstSuspended(current) && (revealOrder = renderLanes2), renderLanes2 = renderLanes2.sibling;
        renderLanes2 = revealOrder;
        null === renderLanes2 ? (revealOrder = workInProgress2.child, workInProgress2.child = null) : (revealOrder = renderLanes2.sibling, renderLanes2.sibling = null);
        initSuspenseListRenderState(
          workInProgress2,
          false,
          revealOrder,
          renderLanes2,
          tailMode,
          nextProps
        );
        break;
      case "backwards":
      case "unstable_legacy-backwards":
        renderLanes2 = null;
        revealOrder = workInProgress2.child;
        for (workInProgress2.child = null; null !== revealOrder; ) {
          current = revealOrder.alternate;
          if (null !== current && null === findFirstSuspended(current)) {
            workInProgress2.child = revealOrder;
            break;
          }
          current = revealOrder.sibling;
          revealOrder.sibling = renderLanes2;
          renderLanes2 = revealOrder;
          revealOrder = current;
        }
        initSuspenseListRenderState(
          workInProgress2,
          true,
          renderLanes2,
          null,
          tailMode,
          nextProps
        );
        break;
      case "together":
        initSuspenseListRenderState(
          workInProgress2,
          false,
          null,
          null,
          void 0,
          nextProps
        );
        break;
      default:
        workInProgress2.memoizedState = null;
    }
    return workInProgress2.child;
  }
  function bailoutOnAlreadyFinishedWork(current, workInProgress2, renderLanes2) {
    null !== current && (workInProgress2.dependencies = current.dependencies);
    workInProgressRootSkippedLanes |= workInProgress2.lanes;
    if (0 === (renderLanes2 & workInProgress2.childLanes))
      if (null !== current) {
        if (propagateParentContextChanges(
          current,
          workInProgress2,
          renderLanes2,
          false
        ), 0 === (renderLanes2 & workInProgress2.childLanes))
          return null;
      } else return null;
    if (null !== current && workInProgress2.child !== current.child)
      throw Error(formatProdErrorMessage(153));
    if (null !== workInProgress2.child) {
      current = workInProgress2.child;
      renderLanes2 = createWorkInProgress(current, current.pendingProps);
      workInProgress2.child = renderLanes2;
      for (renderLanes2.return = workInProgress2; null !== current.sibling; )
        current = current.sibling, renderLanes2 = renderLanes2.sibling = createWorkInProgress(current, current.pendingProps), renderLanes2.return = workInProgress2;
      renderLanes2.sibling = null;
    }
    return workInProgress2.child;
  }
  function checkScheduledUpdateOrContext(current, renderLanes2) {
    if (0 !== (current.lanes & renderLanes2)) return true;
    current = current.dependencies;
    return null !== current && checkIfContextChanged(current) ? true : false;
  }
  function attemptEarlyBailoutIfNoScheduledUpdate(current, workInProgress2, renderLanes2) {
    switch (workInProgress2.tag) {
      case 3:
        pushHostContainer(workInProgress2, workInProgress2.stateNode.containerInfo);
        pushProvider(workInProgress2, CacheContext, current.memoizedState.cache);
        resetHydrationState();
        break;
      case 27:
      case 5:
        pushHostContext(workInProgress2);
        break;
      case 4:
        pushHostContainer(workInProgress2, workInProgress2.stateNode.containerInfo);
        break;
      case 10:
        pushProvider(
          workInProgress2,
          workInProgress2.type,
          workInProgress2.memoizedProps.value
        );
        break;
      case 31:
        if (null !== workInProgress2.memoizedState)
          return workInProgress2.flags |= 128, pushDehydratedActivitySuspenseHandler(workInProgress2), null;
        break;
      case 13:
        var state$102 = workInProgress2.memoizedState;
        if (null !== state$102) {
          if (null !== state$102.dehydrated)
            return pushPrimaryTreeSuspenseHandler(workInProgress2), workInProgress2.flags |= 128, null;
          if (0 !== (renderLanes2 & workInProgress2.child.childLanes))
            return updateSuspenseComponent(current, workInProgress2, renderLanes2);
          pushPrimaryTreeSuspenseHandler(workInProgress2);
          current = bailoutOnAlreadyFinishedWork(
            current,
            workInProgress2,
            renderLanes2
          );
          return null !== current ? current.sibling : null;
        }
        pushPrimaryTreeSuspenseHandler(workInProgress2);
        break;
      case 19:
        var didSuspendBefore = 0 !== (current.flags & 128);
        state$102 = 0 !== (renderLanes2 & workInProgress2.childLanes);
        state$102 || (propagateParentContextChanges(
          current,
          workInProgress2,
          renderLanes2,
          false
        ), state$102 = 0 !== (renderLanes2 & workInProgress2.childLanes));
        if (didSuspendBefore) {
          if (state$102)
            return updateSuspenseListComponent(
              current,
              workInProgress2,
              renderLanes2
            );
          workInProgress2.flags |= 128;
        }
        didSuspendBefore = workInProgress2.memoizedState;
        null !== didSuspendBefore && (didSuspendBefore.rendering = null, didSuspendBefore.tail = null, didSuspendBefore.lastEffect = null);
        push(suspenseStackCursor, suspenseStackCursor.current);
        if (state$102) break;
        else return null;
      case 22:
        return workInProgress2.lanes = 0, updateOffscreenComponent(
          current,
          workInProgress2,
          renderLanes2,
          workInProgress2.pendingProps
        );
      case 24:
        pushProvider(workInProgress2, CacheContext, current.memoizedState.cache);
    }
    return bailoutOnAlreadyFinishedWork(current, workInProgress2, renderLanes2);
  }
  function beginWork(current, workInProgress2, renderLanes2) {
    if (null !== current)
      if (current.memoizedProps !== workInProgress2.pendingProps)
        didReceiveUpdate = true;
      else {
        if (!checkScheduledUpdateOrContext(current, renderLanes2) && 0 === (workInProgress2.flags & 128))
          return didReceiveUpdate = false, attemptEarlyBailoutIfNoScheduledUpdate(
            current,
            workInProgress2,
            renderLanes2
          );
        didReceiveUpdate = 0 !== (current.flags & 131072) ? true : false;
      }
    else
      didReceiveUpdate = false, isHydrating && 0 !== (workInProgress2.flags & 1048576) && pushTreeId(workInProgress2, treeForkCount, workInProgress2.index);
    workInProgress2.lanes = 0;
    switch (workInProgress2.tag) {
      case 16:
        a: {
          var props = workInProgress2.pendingProps;
          current = resolveLazy(workInProgress2.elementType);
          workInProgress2.type = current;
          if ("function" === typeof current)
            shouldConstruct(current) ? (props = resolveClassComponentProps(current, props), workInProgress2.tag = 1, workInProgress2 = updateClassComponent(
              null,
              workInProgress2,
              current,
              props,
              renderLanes2
            )) : (workInProgress2.tag = 0, workInProgress2 = updateFunctionComponent(
              null,
              workInProgress2,
              current,
              props,
              renderLanes2
            ));
          else {
            if (void 0 !== current && null !== current) {
              var $$typeof = current.$$typeof;
              if ($$typeof === REACT_FORWARD_REF_TYPE) {
                workInProgress2.tag = 11;
                workInProgress2 = updateForwardRef(
                  null,
                  workInProgress2,
                  current,
                  props,
                  renderLanes2
                );
                break a;
              } else if ($$typeof === REACT_MEMO_TYPE) {
                workInProgress2.tag = 14;
                workInProgress2 = updateMemoComponent(
                  null,
                  workInProgress2,
                  current,
                  props,
                  renderLanes2
                );
                break a;
              }
            }
            workInProgress2 = getComponentNameFromType(current) || current;
            throw Error(formatProdErrorMessage(306, workInProgress2, ""));
          }
        }
        return workInProgress2;
      case 0:
        return updateFunctionComponent(
          current,
          workInProgress2,
          workInProgress2.type,
          workInProgress2.pendingProps,
          renderLanes2
        );
      case 1:
        return props = workInProgress2.type, $$typeof = resolveClassComponentProps(
          props,
          workInProgress2.pendingProps
        ), updateClassComponent(
          current,
          workInProgress2,
          props,
          $$typeof,
          renderLanes2
        );
      case 3:
        a: {
          pushHostContainer(
            workInProgress2,
            workInProgress2.stateNode.containerInfo
          );
          if (null === current) throw Error(formatProdErrorMessage(387));
          props = workInProgress2.pendingProps;
          var prevState = workInProgress2.memoizedState;
          $$typeof = prevState.element;
          cloneUpdateQueue(current, workInProgress2);
          processUpdateQueue(workInProgress2, props, null, renderLanes2);
          var nextState = workInProgress2.memoizedState;
          props = nextState.cache;
          pushProvider(workInProgress2, CacheContext, props);
          props !== prevState.cache && propagateContextChanges(
            workInProgress2,
            [CacheContext],
            renderLanes2,
            true
          );
          suspendIfUpdateReadFromEntangledAsyncAction();
          props = nextState.element;
          if (prevState.isDehydrated)
            if (prevState = {
              element: props,
              isDehydrated: false,
              cache: nextState.cache
            }, workInProgress2.updateQueue.baseState = prevState, workInProgress2.memoizedState = prevState, workInProgress2.flags & 256) {
              workInProgress2 = mountHostRootWithoutHydrating(
                current,
                workInProgress2,
                props,
                renderLanes2
              );
              break a;
            } else if (props !== $$typeof) {
              $$typeof = createCapturedValueAtFiber(
                Error(formatProdErrorMessage(424)),
                workInProgress2
              );
              queueHydrationError($$typeof);
              workInProgress2 = mountHostRootWithoutHydrating(
                current,
                workInProgress2,
                props,
                renderLanes2
              );
              break a;
            } else {
              current = workInProgress2.stateNode.containerInfo;
              switch (current.nodeType) {
                case 9:
                  current = current.body;
                  break;
                default:
                  current = "HTML" === current.nodeName ? current.ownerDocument.body : current;
              }
              nextHydratableInstance = getNextHydratable(current.firstChild);
              hydrationParentFiber = workInProgress2;
              isHydrating = true;
              hydrationErrors = null;
              rootOrSingletonContext = true;
              renderLanes2 = mountChildFibers(
                workInProgress2,
                null,
                props,
                renderLanes2
              );
              for (workInProgress2.child = renderLanes2; renderLanes2; )
                renderLanes2.flags = renderLanes2.flags & -3 | 4096, renderLanes2 = renderLanes2.sibling;
            }
          else {
            resetHydrationState();
            if (props === $$typeof) {
              workInProgress2 = bailoutOnAlreadyFinishedWork(
                current,
                workInProgress2,
                renderLanes2
              );
              break a;
            }
            reconcileChildren(current, workInProgress2, props, renderLanes2);
          }
          workInProgress2 = workInProgress2.child;
        }
        return workInProgress2;
      case 26:
        return markRef(current, workInProgress2), null === current ? (renderLanes2 = getResource(
          workInProgress2.type,
          null,
          workInProgress2.pendingProps,
          null
        )) ? workInProgress2.memoizedState = renderLanes2 : isHydrating || (renderLanes2 = workInProgress2.type, current = workInProgress2.pendingProps, props = getOwnerDocumentFromRootContainer(
          rootInstanceStackCursor.current
        ).createElement(renderLanes2), props[internalInstanceKey] = workInProgress2, props[internalPropsKey] = current, setInitialProperties(props, renderLanes2, current), markNodeAsHoistable(props), workInProgress2.stateNode = props) : workInProgress2.memoizedState = getResource(
          workInProgress2.type,
          current.memoizedProps,
          workInProgress2.pendingProps,
          current.memoizedState
        ), null;
      case 27:
        return pushHostContext(workInProgress2), null === current && isHydrating && (props = workInProgress2.stateNode = resolveSingletonInstance(
          workInProgress2.type,
          workInProgress2.pendingProps,
          rootInstanceStackCursor.current
        ), hydrationParentFiber = workInProgress2, rootOrSingletonContext = true, $$typeof = nextHydratableInstance, isSingletonScope(workInProgress2.type) ? (previousHydratableOnEnteringScopedSingleton = $$typeof, nextHydratableInstance = getNextHydratable(props.firstChild)) : nextHydratableInstance = $$typeof), reconcileChildren(
          current,
          workInProgress2,
          workInProgress2.pendingProps.children,
          renderLanes2
        ), markRef(current, workInProgress2), null === current && (workInProgress2.flags |= 4194304), workInProgress2.child;
      case 5:
        if (null === current && isHydrating) {
          if ($$typeof = props = nextHydratableInstance)
            props = canHydrateInstance(
              props,
              workInProgress2.type,
              workInProgress2.pendingProps,
              rootOrSingletonContext
            ), null !== props ? (workInProgress2.stateNode = props, hydrationParentFiber = workInProgress2, nextHydratableInstance = getNextHydratable(props.firstChild), rootOrSingletonContext = false, $$typeof = true) : $$typeof = false;
          $$typeof || throwOnHydrationMismatch(workInProgress2);
        }
        pushHostContext(workInProgress2);
        $$typeof = workInProgress2.type;
        prevState = workInProgress2.pendingProps;
        nextState = null !== current ? current.memoizedProps : null;
        props = prevState.children;
        shouldSetTextContent($$typeof, prevState) ? props = null : null !== nextState && shouldSetTextContent($$typeof, nextState) && (workInProgress2.flags |= 32);
        null !== workInProgress2.memoizedState && ($$typeof = renderWithHooks(
          current,
          workInProgress2,
          TransitionAwareHostComponent,
          null,
          null,
          renderLanes2
        ), HostTransitionContext._currentValue = $$typeof);
        markRef(current, workInProgress2);
        reconcileChildren(current, workInProgress2, props, renderLanes2);
        return workInProgress2.child;
      case 6:
        if (null === current && isHydrating) {
          if (current = renderLanes2 = nextHydratableInstance)
            renderLanes2 = canHydrateTextInstance(
              renderLanes2,
              workInProgress2.pendingProps,
              rootOrSingletonContext
            ), null !== renderLanes2 ? (workInProgress2.stateNode = renderLanes2, hydrationParentFiber = workInProgress2, nextHydratableInstance = null, current = true) : current = false;
          current || throwOnHydrationMismatch(workInProgress2);
        }
        return null;
      case 13:
        return updateSuspenseComponent(current, workInProgress2, renderLanes2);
      case 4:
        return pushHostContainer(
          workInProgress2,
          workInProgress2.stateNode.containerInfo
        ), props = workInProgress2.pendingProps, null === current ? workInProgress2.child = reconcileChildFibers(
          workInProgress2,
          null,
          props,
          renderLanes2
        ) : reconcileChildren(current, workInProgress2, props, renderLanes2), workInProgress2.child;
      case 11:
        return updateForwardRef(
          current,
          workInProgress2,
          workInProgress2.type,
          workInProgress2.pendingProps,
          renderLanes2
        );
      case 7:
        return reconcileChildren(
          current,
          workInProgress2,
          workInProgress2.pendingProps,
          renderLanes2
        ), workInProgress2.child;
      case 8:
        return reconcileChildren(
          current,
          workInProgress2,
          workInProgress2.pendingProps.children,
          renderLanes2
        ), workInProgress2.child;
      case 12:
        return reconcileChildren(
          current,
          workInProgress2,
          workInProgress2.pendingProps.children,
          renderLanes2
        ), workInProgress2.child;
      case 10:
        return props = workInProgress2.pendingProps, pushProvider(workInProgress2, workInProgress2.type, props.value), reconcileChildren(current, workInProgress2, props.children, renderLanes2), workInProgress2.child;
      case 9:
        return $$typeof = workInProgress2.type._context, props = workInProgress2.pendingProps.children, prepareToReadContext(workInProgress2), $$typeof = readContext($$typeof), props = props($$typeof), workInProgress2.flags |= 1, reconcileChildren(current, workInProgress2, props, renderLanes2), workInProgress2.child;
      case 14:
        return updateMemoComponent(
          current,
          workInProgress2,
          workInProgress2.type,
          workInProgress2.pendingProps,
          renderLanes2
        );
      case 15:
        return updateSimpleMemoComponent(
          current,
          workInProgress2,
          workInProgress2.type,
          workInProgress2.pendingProps,
          renderLanes2
        );
      case 19:
        return updateSuspenseListComponent(current, workInProgress2, renderLanes2);
      case 31:
        return updateActivityComponent(current, workInProgress2, renderLanes2);
      case 22:
        return updateOffscreenComponent(
          current,
          workInProgress2,
          renderLanes2,
          workInProgress2.pendingProps
        );
      case 24:
        return prepareToReadContext(workInProgress2), props = readContext(CacheContext), null === current ? ($$typeof = peekCacheFromPool(), null === $$typeof && ($$typeof = workInProgressRoot, prevState = createCache(), $$typeof.pooledCache = prevState, prevState.refCount++, null !== prevState && ($$typeof.pooledCacheLanes |= renderLanes2), $$typeof = prevState), workInProgress2.memoizedState = { parent: props, cache: $$typeof }, initializeUpdateQueue(workInProgress2), pushProvider(workInProgress2, CacheContext, $$typeof)) : (0 !== (current.lanes & renderLanes2) && (cloneUpdateQueue(current, workInProgress2), processUpdateQueue(workInProgress2, null, null, renderLanes2), suspendIfUpdateReadFromEntangledAsyncAction()), $$typeof = current.memoizedState, prevState = workInProgress2.memoizedState, $$typeof.parent !== props ? ($$typeof = { parent: props, cache: props }, workInProgress2.memoizedState = $$typeof, 0 === workInProgress2.lanes && (workInProgress2.memoizedState = workInProgress2.updateQueue.baseState = $$typeof), pushProvider(workInProgress2, CacheContext, props)) : (props = prevState.cache, pushProvider(workInProgress2, CacheContext, props), props !== $$typeof.cache && propagateContextChanges(
          workInProgress2,
          [CacheContext],
          renderLanes2,
          true
        ))), reconcileChildren(
          current,
          workInProgress2,
          workInProgress2.pendingProps.children,
          renderLanes2
        ), workInProgress2.child;
      case 29:
        throw workInProgress2.pendingProps;
    }
    throw Error(formatProdErrorMessage(156, workInProgress2.tag));
  }
  function markUpdate(workInProgress2) {
    workInProgress2.flags |= 4;
  }
  function preloadInstanceAndSuspendIfNeeded(workInProgress2, type, oldProps, newProps, renderLanes2) {
    if (type = 0 !== (workInProgress2.mode & 32)) type = false;
    if (type) {
      if (workInProgress2.flags |= 16777216, (renderLanes2 & 335544128) === renderLanes2)
        if (workInProgress2.stateNode.complete) workInProgress2.flags |= 8192;
        else if (shouldRemainOnPreviousScreen()) workInProgress2.flags |= 8192;
        else
          throw suspendedThenable = noopSuspenseyCommitThenable, SuspenseyCommitException;
    } else workInProgress2.flags &= -16777217;
  }
  function preloadResourceAndSuspendIfNeeded(workInProgress2, resource) {
    if ("stylesheet" !== resource.type || 0 !== (resource.state.loading & 4))
      workInProgress2.flags &= -16777217;
    else if (workInProgress2.flags |= 16777216, !preloadResource(resource))
      if (shouldRemainOnPreviousScreen()) workInProgress2.flags |= 8192;
      else
        throw suspendedThenable = noopSuspenseyCommitThenable, SuspenseyCommitException;
  }
  function scheduleRetryEffect(workInProgress2, retryQueue) {
    null !== retryQueue && (workInProgress2.flags |= 4);
    workInProgress2.flags & 16384 && (retryQueue = 22 !== workInProgress2.tag ? claimNextRetryLane() : 536870912, workInProgress2.lanes |= retryQueue, workInProgressSuspendedRetryLanes |= retryQueue);
  }
  function cutOffTailIfNeeded(renderState, hasRenderedATailFallback) {
    if (!isHydrating)
      switch (renderState.tailMode) {
        case "hidden":
          hasRenderedATailFallback = renderState.tail;
          for (var lastTailNode = null; null !== hasRenderedATailFallback; )
            null !== hasRenderedATailFallback.alternate && (lastTailNode = hasRenderedATailFallback), hasRenderedATailFallback = hasRenderedATailFallback.sibling;
          null === lastTailNode ? renderState.tail = null : lastTailNode.sibling = null;
          break;
        case "collapsed":
          lastTailNode = renderState.tail;
          for (var lastTailNode$106 = null; null !== lastTailNode; )
            null !== lastTailNode.alternate && (lastTailNode$106 = lastTailNode), lastTailNode = lastTailNode.sibling;
          null === lastTailNode$106 ? hasRenderedATailFallback || null === renderState.tail ? renderState.tail = null : renderState.tail.sibling = null : lastTailNode$106.sibling = null;
      }
  }
  function bubbleProperties(completedWork) {
    var didBailout = null !== completedWork.alternate && completedWork.alternate.child === completedWork.child, newChildLanes = 0, subtreeFlags = 0;
    if (didBailout)
      for (var child$107 = completedWork.child; null !== child$107; )
        newChildLanes |= child$107.lanes | child$107.childLanes, subtreeFlags |= child$107.subtreeFlags & 65011712, subtreeFlags |= child$107.flags & 65011712, child$107.return = completedWork, child$107 = child$107.sibling;
    else
      for (child$107 = completedWork.child; null !== child$107; )
        newChildLanes |= child$107.lanes | child$107.childLanes, subtreeFlags |= child$107.subtreeFlags, subtreeFlags |= child$107.flags, child$107.return = completedWork, child$107 = child$107.sibling;
    completedWork.subtreeFlags |= subtreeFlags;
    completedWork.childLanes = newChildLanes;
    return didBailout;
  }
  function completeWork(current, workInProgress2, renderLanes2) {
    var newProps = workInProgress2.pendingProps;
    popTreeContext(workInProgress2);
    switch (workInProgress2.tag) {
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return bubbleProperties(workInProgress2), null;
      case 1:
        return bubbleProperties(workInProgress2), null;
      case 3:
        renderLanes2 = workInProgress2.stateNode;
        newProps = null;
        null !== current && (newProps = current.memoizedState.cache);
        workInProgress2.memoizedState.cache !== newProps && (workInProgress2.flags |= 2048);
        popProvider(CacheContext);
        popHostContainer();
        renderLanes2.pendingContext && (renderLanes2.context = renderLanes2.pendingContext, renderLanes2.pendingContext = null);
        if (null === current || null === current.child)
          popHydrationState(workInProgress2) ? markUpdate(workInProgress2) : null === current || current.memoizedState.isDehydrated && 0 === (workInProgress2.flags & 256) || (workInProgress2.flags |= 1024, upgradeHydrationErrorsToRecoverable());
        bubbleProperties(workInProgress2);
        return null;
      case 26:
        var type = workInProgress2.type, nextResource = workInProgress2.memoizedState;
        null === current ? (markUpdate(workInProgress2), null !== nextResource ? (bubbleProperties(workInProgress2), preloadResourceAndSuspendIfNeeded(workInProgress2, nextResource)) : (bubbleProperties(workInProgress2), preloadInstanceAndSuspendIfNeeded(
          workInProgress2,
          type,
          null,
          newProps,
          renderLanes2
        ))) : nextResource ? nextResource !== current.memoizedState ? (markUpdate(workInProgress2), bubbleProperties(workInProgress2), preloadResourceAndSuspendIfNeeded(workInProgress2, nextResource)) : (bubbleProperties(workInProgress2), workInProgress2.flags &= -16777217) : (current = current.memoizedProps, current !== newProps && markUpdate(workInProgress2), bubbleProperties(workInProgress2), preloadInstanceAndSuspendIfNeeded(
          workInProgress2,
          type,
          current,
          newProps,
          renderLanes2
        ));
        return null;
      case 27:
        popHostContext(workInProgress2);
        renderLanes2 = rootInstanceStackCursor.current;
        type = workInProgress2.type;
        if (null !== current && null != workInProgress2.stateNode)
          current.memoizedProps !== newProps && markUpdate(workInProgress2);
        else {
          if (!newProps) {
            if (null === workInProgress2.stateNode)
              throw Error(formatProdErrorMessage(166));
            bubbleProperties(workInProgress2);
            return null;
          }
          current = contextStackCursor.current;
          popHydrationState(workInProgress2) ? prepareToHydrateHostInstance(workInProgress2) : (current = resolveSingletonInstance(type, newProps, renderLanes2), workInProgress2.stateNode = current, markUpdate(workInProgress2));
        }
        bubbleProperties(workInProgress2);
        return null;
      case 5:
        popHostContext(workInProgress2);
        type = workInProgress2.type;
        if (null !== current && null != workInProgress2.stateNode)
          current.memoizedProps !== newProps && markUpdate(workInProgress2);
        else {
          if (!newProps) {
            if (null === workInProgress2.stateNode)
              throw Error(formatProdErrorMessage(166));
            bubbleProperties(workInProgress2);
            return null;
          }
          nextResource = contextStackCursor.current;
          if (popHydrationState(workInProgress2))
            prepareToHydrateHostInstance(workInProgress2);
          else {
            var ownerDocument = getOwnerDocumentFromRootContainer(
              rootInstanceStackCursor.current
            );
            switch (nextResource) {
              case 1:
                nextResource = ownerDocument.createElementNS(
                  "http://www.w3.org/2000/svg",
                  type
                );
                break;
              case 2:
                nextResource = ownerDocument.createElementNS(
                  "http://www.w3.org/1998/Math/MathML",
                  type
                );
                break;
              default:
                switch (type) {
                  case "svg":
                    nextResource = ownerDocument.createElementNS(
                      "http://www.w3.org/2000/svg",
                      type
                    );
                    break;
                  case "math":
                    nextResource = ownerDocument.createElementNS(
                      "http://www.w3.org/1998/Math/MathML",
                      type
                    );
                    break;
                  case "script":
                    nextResource = ownerDocument.createElement("div");
                    nextResource.innerHTML = "<script><\/script>";
                    nextResource = nextResource.removeChild(
                      nextResource.firstChild
                    );
                    break;
                  case "select":
                    nextResource = "string" === typeof newProps.is ? ownerDocument.createElement("select", {
                      is: newProps.is
                    }) : ownerDocument.createElement("select");
                    newProps.multiple ? nextResource.multiple = true : newProps.size && (nextResource.size = newProps.size);
                    break;
                  default:
                    nextResource = "string" === typeof newProps.is ? ownerDocument.createElement(type, { is: newProps.is }) : ownerDocument.createElement(type);
                }
            }
            nextResource[internalInstanceKey] = workInProgress2;
            nextResource[internalPropsKey] = newProps;
            a: for (ownerDocument = workInProgress2.child; null !== ownerDocument; ) {
              if (5 === ownerDocument.tag || 6 === ownerDocument.tag)
                nextResource.appendChild(ownerDocument.stateNode);
              else if (4 !== ownerDocument.tag && 27 !== ownerDocument.tag && null !== ownerDocument.child) {
                ownerDocument.child.return = ownerDocument;
                ownerDocument = ownerDocument.child;
                continue;
              }
              if (ownerDocument === workInProgress2) break a;
              for (; null === ownerDocument.sibling; ) {
                if (null === ownerDocument.return || ownerDocument.return === workInProgress2)
                  break a;
                ownerDocument = ownerDocument.return;
              }
              ownerDocument.sibling.return = ownerDocument.return;
              ownerDocument = ownerDocument.sibling;
            }
            workInProgress2.stateNode = nextResource;
            a: switch (setInitialProperties(nextResource, type, newProps), type) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                newProps = !!newProps.autoFocus;
                break a;
              case "img":
                newProps = true;
                break a;
              default:
                newProps = false;
            }
            newProps && markUpdate(workInProgress2);
          }
        }
        bubbleProperties(workInProgress2);
        preloadInstanceAndSuspendIfNeeded(
          workInProgress2,
          workInProgress2.type,
          null === current ? null : current.memoizedProps,
          workInProgress2.pendingProps,
          renderLanes2
        );
        return null;
      case 6:
        if (current && null != workInProgress2.stateNode)
          current.memoizedProps !== newProps && markUpdate(workInProgress2);
        else {
          if ("string" !== typeof newProps && null === workInProgress2.stateNode)
            throw Error(formatProdErrorMessage(166));
          current = rootInstanceStackCursor.current;
          if (popHydrationState(workInProgress2)) {
            current = workInProgress2.stateNode;
            renderLanes2 = workInProgress2.memoizedProps;
            newProps = null;
            type = hydrationParentFiber;
            if (null !== type)
              switch (type.tag) {
                case 27:
                case 5:
                  newProps = type.memoizedProps;
              }
            current[internalInstanceKey] = workInProgress2;
            current = current.nodeValue === renderLanes2 || null !== newProps && true === newProps.suppressHydrationWarning || checkForUnmatchedText(current.nodeValue, renderLanes2) ? true : false;
            current || throwOnHydrationMismatch(workInProgress2, true);
          } else
            current = getOwnerDocumentFromRootContainer(current).createTextNode(
              newProps
            ), current[internalInstanceKey] = workInProgress2, workInProgress2.stateNode = current;
        }
        bubbleProperties(workInProgress2);
        return null;
      case 31:
        renderLanes2 = workInProgress2.memoizedState;
        if (null === current || null !== current.memoizedState) {
          newProps = popHydrationState(workInProgress2);
          if (null !== renderLanes2) {
            if (null === current) {
              if (!newProps) throw Error(formatProdErrorMessage(318));
              current = workInProgress2.memoizedState;
              current = null !== current ? current.dehydrated : null;
              if (!current) throw Error(formatProdErrorMessage(557));
              current[internalInstanceKey] = workInProgress2;
            } else
              resetHydrationState(), 0 === (workInProgress2.flags & 128) && (workInProgress2.memoizedState = null), workInProgress2.flags |= 4;
            bubbleProperties(workInProgress2);
            current = false;
          } else
            renderLanes2 = upgradeHydrationErrorsToRecoverable(), null !== current && null !== current.memoizedState && (current.memoizedState.hydrationErrors = renderLanes2), current = true;
          if (!current) {
            if (workInProgress2.flags & 256)
              return popSuspenseHandler(workInProgress2), workInProgress2;
            popSuspenseHandler(workInProgress2);
            return null;
          }
          if (0 !== (workInProgress2.flags & 128))
            throw Error(formatProdErrorMessage(558));
        }
        bubbleProperties(workInProgress2);
        return null;
      case 13:
        newProps = workInProgress2.memoizedState;
        if (null === current || null !== current.memoizedState && null !== current.memoizedState.dehydrated) {
          type = popHydrationState(workInProgress2);
          if (null !== newProps && null !== newProps.dehydrated) {
            if (null === current) {
              if (!type) throw Error(formatProdErrorMessage(318));
              type = workInProgress2.memoizedState;
              type = null !== type ? type.dehydrated : null;
              if (!type) throw Error(formatProdErrorMessage(317));
              type[internalInstanceKey] = workInProgress2;
            } else
              resetHydrationState(), 0 === (workInProgress2.flags & 128) && (workInProgress2.memoizedState = null), workInProgress2.flags |= 4;
            bubbleProperties(workInProgress2);
            type = false;
          } else
            type = upgradeHydrationErrorsToRecoverable(), null !== current && null !== current.memoizedState && (current.memoizedState.hydrationErrors = type), type = true;
          if (!type) {
            if (workInProgress2.flags & 256)
              return popSuspenseHandler(workInProgress2), workInProgress2;
            popSuspenseHandler(workInProgress2);
            return null;
          }
        }
        popSuspenseHandler(workInProgress2);
        if (0 !== (workInProgress2.flags & 128))
          return workInProgress2.lanes = renderLanes2, workInProgress2;
        renderLanes2 = null !== newProps;
        current = null !== current && null !== current.memoizedState;
        renderLanes2 && (newProps = workInProgress2.child, type = null, null !== newProps.alternate && null !== newProps.alternate.memoizedState && null !== newProps.alternate.memoizedState.cachePool && (type = newProps.alternate.memoizedState.cachePool.pool), nextResource = null, null !== newProps.memoizedState && null !== newProps.memoizedState.cachePool && (nextResource = newProps.memoizedState.cachePool.pool), nextResource !== type && (newProps.flags |= 2048));
        renderLanes2 !== current && renderLanes2 && (workInProgress2.child.flags |= 8192);
        scheduleRetryEffect(workInProgress2, workInProgress2.updateQueue);
        bubbleProperties(workInProgress2);
        return null;
      case 4:
        return popHostContainer(), null === current && listenToAllSupportedEvents(workInProgress2.stateNode.containerInfo), bubbleProperties(workInProgress2), null;
      case 10:
        return popProvider(workInProgress2.type), bubbleProperties(workInProgress2), null;
      case 19:
        pop(suspenseStackCursor);
        newProps = workInProgress2.memoizedState;
        if (null === newProps) return bubbleProperties(workInProgress2), null;
        type = 0 !== (workInProgress2.flags & 128);
        nextResource = newProps.rendering;
        if (null === nextResource)
          if (type) cutOffTailIfNeeded(newProps, false);
          else {
            if (0 !== workInProgressRootExitStatus || null !== current && 0 !== (current.flags & 128))
              for (current = workInProgress2.child; null !== current; ) {
                nextResource = findFirstSuspended(current);
                if (null !== nextResource) {
                  workInProgress2.flags |= 128;
                  cutOffTailIfNeeded(newProps, false);
                  current = nextResource.updateQueue;
                  workInProgress2.updateQueue = current;
                  scheduleRetryEffect(workInProgress2, current);
                  workInProgress2.subtreeFlags = 0;
                  current = renderLanes2;
                  for (renderLanes2 = workInProgress2.child; null !== renderLanes2; )
                    resetWorkInProgress(renderLanes2, current), renderLanes2 = renderLanes2.sibling;
                  push(
                    suspenseStackCursor,
                    suspenseStackCursor.current & 1 | 2
                  );
                  isHydrating && pushTreeFork(workInProgress2, newProps.treeForkCount);
                  return workInProgress2.child;
                }
                current = current.sibling;
              }
            null !== newProps.tail && now() > workInProgressRootRenderTargetTime && (workInProgress2.flags |= 128, type = true, cutOffTailIfNeeded(newProps, false), workInProgress2.lanes = 4194304);
          }
        else {
          if (!type)
            if (current = findFirstSuspended(nextResource), null !== current) {
              if (workInProgress2.flags |= 128, type = true, current = current.updateQueue, workInProgress2.updateQueue = current, scheduleRetryEffect(workInProgress2, current), cutOffTailIfNeeded(newProps, true), null === newProps.tail && "hidden" === newProps.tailMode && !nextResource.alternate && !isHydrating)
                return bubbleProperties(workInProgress2), null;
            } else
              2 * now() - newProps.renderingStartTime > workInProgressRootRenderTargetTime && 536870912 !== renderLanes2 && (workInProgress2.flags |= 128, type = true, cutOffTailIfNeeded(newProps, false), workInProgress2.lanes = 4194304);
          newProps.isBackwards ? (nextResource.sibling = workInProgress2.child, workInProgress2.child = nextResource) : (current = newProps.last, null !== current ? current.sibling = nextResource : workInProgress2.child = nextResource, newProps.last = nextResource);
        }
        if (null !== newProps.tail)
          return current = newProps.tail, newProps.rendering = current, newProps.tail = current.sibling, newProps.renderingStartTime = now(), current.sibling = null, renderLanes2 = suspenseStackCursor.current, push(
            suspenseStackCursor,
            type ? renderLanes2 & 1 | 2 : renderLanes2 & 1
          ), isHydrating && pushTreeFork(workInProgress2, newProps.treeForkCount), current;
        bubbleProperties(workInProgress2);
        return null;
      case 22:
      case 23:
        return popSuspenseHandler(workInProgress2), popHiddenContext(), newProps = null !== workInProgress2.memoizedState, null !== current ? null !== current.memoizedState !== newProps && (workInProgress2.flags |= 8192) : newProps && (workInProgress2.flags |= 8192), newProps ? 0 !== (renderLanes2 & 536870912) && 0 === (workInProgress2.flags & 128) && (bubbleProperties(workInProgress2), workInProgress2.subtreeFlags & 6 && (workInProgress2.flags |= 8192)) : bubbleProperties(workInProgress2), renderLanes2 = workInProgress2.updateQueue, null !== renderLanes2 && scheduleRetryEffect(workInProgress2, renderLanes2.retryQueue), renderLanes2 = null, null !== current && null !== current.memoizedState && null !== current.memoizedState.cachePool && (renderLanes2 = current.memoizedState.cachePool.pool), newProps = null, null !== workInProgress2.memoizedState && null !== workInProgress2.memoizedState.cachePool && (newProps = workInProgress2.memoizedState.cachePool.pool), newProps !== renderLanes2 && (workInProgress2.flags |= 2048), null !== current && pop(resumedCache), null;
      case 24:
        return renderLanes2 = null, null !== current && (renderLanes2 = current.memoizedState.cache), workInProgress2.memoizedState.cache !== renderLanes2 && (workInProgress2.flags |= 2048), popProvider(CacheContext), bubbleProperties(workInProgress2), null;
      case 25:
        return null;
      case 30:
        return null;
    }
    throw Error(formatProdErrorMessage(156, workInProgress2.tag));
  }
  function unwindWork(current, workInProgress2) {
    popTreeContext(workInProgress2);
    switch (workInProgress2.tag) {
      case 1:
        return current = workInProgress2.flags, current & 65536 ? (workInProgress2.flags = current & -65537 | 128, workInProgress2) : null;
      case 3:
        return popProvider(CacheContext), popHostContainer(), current = workInProgress2.flags, 0 !== (current & 65536) && 0 === (current & 128) ? (workInProgress2.flags = current & -65537 | 128, workInProgress2) : null;
      case 26:
      case 27:
      case 5:
        return popHostContext(workInProgress2), null;
      case 31:
        if (null !== workInProgress2.memoizedState) {
          popSuspenseHandler(workInProgress2);
          if (null === workInProgress2.alternate)
            throw Error(formatProdErrorMessage(340));
          resetHydrationState();
        }
        current = workInProgress2.flags;
        return current & 65536 ? (workInProgress2.flags = current & -65537 | 128, workInProgress2) : null;
      case 13:
        popSuspenseHandler(workInProgress2);
        current = workInProgress2.memoizedState;
        if (null !== current && null !== current.dehydrated) {
          if (null === workInProgress2.alternate)
            throw Error(formatProdErrorMessage(340));
          resetHydrationState();
        }
        current = workInProgress2.flags;
        return current & 65536 ? (workInProgress2.flags = current & -65537 | 128, workInProgress2) : null;
      case 19:
        return pop(suspenseStackCursor), null;
      case 4:
        return popHostContainer(), null;
      case 10:
        return popProvider(workInProgress2.type), null;
      case 22:
      case 23:
        return popSuspenseHandler(workInProgress2), popHiddenContext(), null !== current && pop(resumedCache), current = workInProgress2.flags, current & 65536 ? (workInProgress2.flags = current & -65537 | 128, workInProgress2) : null;
      case 24:
        return popProvider(CacheContext), null;
      case 25:
        return null;
      default:
        return null;
    }
  }
  function unwindInterruptedWork(current, interruptedWork) {
    popTreeContext(interruptedWork);
    switch (interruptedWork.tag) {
      case 3:
        popProvider(CacheContext);
        popHostContainer();
        break;
      case 26:
      case 27:
      case 5:
        popHostContext(interruptedWork);
        break;
      case 4:
        popHostContainer();
        break;
      case 31:
        null !== interruptedWork.memoizedState && popSuspenseHandler(interruptedWork);
        break;
      case 13:
        popSuspenseHandler(interruptedWork);
        break;
      case 19:
        pop(suspenseStackCursor);
        break;
      case 10:
        popProvider(interruptedWork.type);
        break;
      case 22:
      case 23:
        popSuspenseHandler(interruptedWork);
        popHiddenContext();
        null !== current && pop(resumedCache);
        break;
      case 24:
        popProvider(CacheContext);
    }
  }
  function commitHookEffectListMount(flags, finishedWork) {
    try {
      var updateQueue = finishedWork.updateQueue, lastEffect = null !== updateQueue ? updateQueue.lastEffect : null;
      if (null !== lastEffect) {
        var firstEffect = lastEffect.next;
        updateQueue = firstEffect;
        do {
          if ((updateQueue.tag & flags) === flags) {
            lastEffect = void 0;
            var create = updateQueue.create, inst = updateQueue.inst;
            lastEffect = create();
            inst.destroy = lastEffect;
          }
          updateQueue = updateQueue.next;
        } while (updateQueue !== firstEffect);
      }
    } catch (error) {
      captureCommitPhaseError(finishedWork, finishedWork.return, error);
    }
  }
  function commitHookEffectListUnmount(flags, finishedWork, nearestMountedAncestor$jscomp$0) {
    try {
      var updateQueue = finishedWork.updateQueue, lastEffect = null !== updateQueue ? updateQueue.lastEffect : null;
      if (null !== lastEffect) {
        var firstEffect = lastEffect.next;
        updateQueue = firstEffect;
        do {
          if ((updateQueue.tag & flags) === flags) {
            var inst = updateQueue.inst, destroy = inst.destroy;
            if (void 0 !== destroy) {
              inst.destroy = void 0;
              lastEffect = finishedWork;
              var nearestMountedAncestor = nearestMountedAncestor$jscomp$0, destroy_ = destroy;
              try {
                destroy_();
              } catch (error) {
                captureCommitPhaseError(
                  lastEffect,
                  nearestMountedAncestor,
                  error
                );
              }
            }
          }
          updateQueue = updateQueue.next;
        } while (updateQueue !== firstEffect);
      }
    } catch (error) {
      captureCommitPhaseError(finishedWork, finishedWork.return, error);
    }
  }
  function commitClassCallbacks(finishedWork) {
    var updateQueue = finishedWork.updateQueue;
    if (null !== updateQueue) {
      var instance = finishedWork.stateNode;
      try {
        commitCallbacks(updateQueue, instance);
      } catch (error) {
        captureCommitPhaseError(finishedWork, finishedWork.return, error);
      }
    }
  }
  function safelyCallComponentWillUnmount(current, nearestMountedAncestor, instance) {
    instance.props = resolveClassComponentProps(
      current.type,
      current.memoizedProps
    );
    instance.state = current.memoizedState;
    try {
      instance.componentWillUnmount();
    } catch (error) {
      captureCommitPhaseError(current, nearestMountedAncestor, error);
    }
  }
  function safelyAttachRef(current, nearestMountedAncestor) {
    try {
      var ref = current.ref;
      if (null !== ref) {
        switch (current.tag) {
          case 26:
          case 27:
          case 5:
            var instanceToUse = current.stateNode;
            break;
          case 30:
            instanceToUse = current.stateNode;
            break;
          default:
            instanceToUse = current.stateNode;
        }
        "function" === typeof ref ? current.refCleanup = ref(instanceToUse) : ref.current = instanceToUse;
      }
    } catch (error) {
      captureCommitPhaseError(current, nearestMountedAncestor, error);
    }
  }
  function safelyDetachRef(current, nearestMountedAncestor) {
    var ref = current.ref, refCleanup = current.refCleanup;
    if (null !== ref)
      if ("function" === typeof refCleanup)
        try {
          refCleanup();
        } catch (error) {
          captureCommitPhaseError(current, nearestMountedAncestor, error);
        } finally {
          current.refCleanup = null, current = current.alternate, null != current && (current.refCleanup = null);
        }
      else if ("function" === typeof ref)
        try {
          ref(null);
        } catch (error$140) {
          captureCommitPhaseError(current, nearestMountedAncestor, error$140);
        }
      else ref.current = null;
  }
  function commitHostMount(finishedWork) {
    var type = finishedWork.type, props = finishedWork.memoizedProps, instance = finishedWork.stateNode;
    try {
      a: switch (type) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          props.autoFocus && instance.focus();
          break a;
        case "img":
          props.src ? instance.src = props.src : props.srcSet && (instance.srcset = props.srcSet);
      }
    } catch (error) {
      captureCommitPhaseError(finishedWork, finishedWork.return, error);
    }
  }
  function commitHostUpdate(finishedWork, newProps, oldProps) {
    try {
      var domElement = finishedWork.stateNode;
      updateProperties(domElement, finishedWork.type, oldProps, newProps);
      domElement[internalPropsKey] = newProps;
    } catch (error) {
      captureCommitPhaseError(finishedWork, finishedWork.return, error);
    }
  }
  function isHostParent(fiber) {
    return 5 === fiber.tag || 3 === fiber.tag || 26 === fiber.tag || 27 === fiber.tag && isSingletonScope(fiber.type) || 4 === fiber.tag;
  }
  function getHostSibling(fiber) {
    a: for (; ; ) {
      for (; null === fiber.sibling; ) {
        if (null === fiber.return || isHostParent(fiber.return)) return null;
        fiber = fiber.return;
      }
      fiber.sibling.return = fiber.return;
      for (fiber = fiber.sibling; 5 !== fiber.tag && 6 !== fiber.tag && 18 !== fiber.tag; ) {
        if (27 === fiber.tag && isSingletonScope(fiber.type)) continue a;
        if (fiber.flags & 2) continue a;
        if (null === fiber.child || 4 === fiber.tag) continue a;
        else fiber.child.return = fiber, fiber = fiber.child;
      }
      if (!(fiber.flags & 2)) return fiber.stateNode;
    }
  }
  function insertOrAppendPlacementNodeIntoContainer(node, before, parent) {
    var tag = node.tag;
    if (5 === tag || 6 === tag)
      node = node.stateNode, before ? (9 === parent.nodeType ? parent.body : "HTML" === parent.nodeName ? parent.ownerDocument.body : parent).insertBefore(node, before) : (before = 9 === parent.nodeType ? parent.body : "HTML" === parent.nodeName ? parent.ownerDocument.body : parent, before.appendChild(node), parent = parent._reactRootContainer, null !== parent && void 0 !== parent || null !== before.onclick || (before.onclick = noop$1));
    else if (4 !== tag && (27 === tag && isSingletonScope(node.type) && (parent = node.stateNode, before = null), node = node.child, null !== node))
      for (insertOrAppendPlacementNodeIntoContainer(node, before, parent), node = node.sibling; null !== node; )
        insertOrAppendPlacementNodeIntoContainer(node, before, parent), node = node.sibling;
  }
  function insertOrAppendPlacementNode(node, before, parent) {
    var tag = node.tag;
    if (5 === tag || 6 === tag)
      node = node.stateNode, before ? parent.insertBefore(node, before) : parent.appendChild(node);
    else if (4 !== tag && (27 === tag && isSingletonScope(node.type) && (parent = node.stateNode), node = node.child, null !== node))
      for (insertOrAppendPlacementNode(node, before, parent), node = node.sibling; null !== node; )
        insertOrAppendPlacementNode(node, before, parent), node = node.sibling;
  }
  function commitHostSingletonAcquisition(finishedWork) {
    var singleton = finishedWork.stateNode, props = finishedWork.memoizedProps;
    try {
      for (var type = finishedWork.type, attributes = singleton.attributes; attributes.length; )
        singleton.removeAttributeNode(attributes[0]);
      setInitialProperties(singleton, type, props);
      singleton[internalInstanceKey] = finishedWork;
      singleton[internalPropsKey] = props;
    } catch (error) {
      captureCommitPhaseError(finishedWork, finishedWork.return, error);
    }
  }
  var offscreenSubtreeIsHidden = false, offscreenSubtreeWasHidden = false, needsFormReset = false, PossiblyWeakSet = "function" === typeof WeakSet ? WeakSet : Set, nextEffect = null;
  function commitBeforeMutationEffects(root2, firstChild) {
    root2 = root2.containerInfo;
    eventsEnabled = _enabled;
    root2 = getActiveElementDeep(root2);
    if (hasSelectionCapabilities(root2)) {
      if ("selectionStart" in root2)
        var JSCompiler_temp = {
          start: root2.selectionStart,
          end: root2.selectionEnd
        };
      else
        a: {
          JSCompiler_temp = (JSCompiler_temp = root2.ownerDocument) && JSCompiler_temp.defaultView || window;
          var selection = JSCompiler_temp.getSelection && JSCompiler_temp.getSelection();
          if (selection && 0 !== selection.rangeCount) {
            JSCompiler_temp = selection.anchorNode;
            var anchorOffset = selection.anchorOffset, focusNode = selection.focusNode;
            selection = selection.focusOffset;
            try {
              JSCompiler_temp.nodeType, focusNode.nodeType;
            } catch (e$20) {
              JSCompiler_temp = null;
              break a;
            }
            var length = 0, start = -1, end = -1, indexWithinAnchor = 0, indexWithinFocus = 0, node = root2, parentNode = null;
            b: for (; ; ) {
              for (var next; ; ) {
                node !== JSCompiler_temp || 0 !== anchorOffset && 3 !== node.nodeType || (start = length + anchorOffset);
                node !== focusNode || 0 !== selection && 3 !== node.nodeType || (end = length + selection);
                3 === node.nodeType && (length += node.nodeValue.length);
                if (null === (next = node.firstChild)) break;
                parentNode = node;
                node = next;
              }
              for (; ; ) {
                if (node === root2) break b;
                parentNode === JSCompiler_temp && ++indexWithinAnchor === anchorOffset && (start = length);
                parentNode === focusNode && ++indexWithinFocus === selection && (end = length);
                if (null !== (next = node.nextSibling)) break;
                node = parentNode;
                parentNode = node.parentNode;
              }
              node = next;
            }
            JSCompiler_temp = -1 === start || -1 === end ? null : { start, end };
          } else JSCompiler_temp = null;
        }
      JSCompiler_temp = JSCompiler_temp || { start: 0, end: 0 };
    } else JSCompiler_temp = null;
    selectionInformation = { focusedElem: root2, selectionRange: JSCompiler_temp };
    _enabled = false;
    for (nextEffect = firstChild; null !== nextEffect; )
      if (firstChild = nextEffect, root2 = firstChild.child, 0 !== (firstChild.subtreeFlags & 1028) && null !== root2)
        root2.return = firstChild, nextEffect = root2;
      else
        for (; null !== nextEffect; ) {
          firstChild = nextEffect;
          focusNode = firstChild.alternate;
          root2 = firstChild.flags;
          switch (firstChild.tag) {
            case 0:
              if (0 !== (root2 & 4) && (root2 = firstChild.updateQueue, root2 = null !== root2 ? root2.events : null, null !== root2))
                for (JSCompiler_temp = 0; JSCompiler_temp < root2.length; JSCompiler_temp++)
                  anchorOffset = root2[JSCompiler_temp], anchorOffset.ref.impl = anchorOffset.nextImpl;
              break;
            case 11:
            case 15:
              break;
            case 1:
              if (0 !== (root2 & 1024) && null !== focusNode) {
                root2 = void 0;
                JSCompiler_temp = firstChild;
                anchorOffset = focusNode.memoizedProps;
                focusNode = focusNode.memoizedState;
                selection = JSCompiler_temp.stateNode;
                try {
                  var resolvedPrevProps = resolveClassComponentProps(
                    JSCompiler_temp.type,
                    anchorOffset
                  );
                  root2 = selection.getSnapshotBeforeUpdate(
                    resolvedPrevProps,
                    focusNode
                  );
                  selection.__reactInternalSnapshotBeforeUpdate = root2;
                } catch (error) {
                  captureCommitPhaseError(
                    JSCompiler_temp,
                    JSCompiler_temp.return,
                    error
                  );
                }
              }
              break;
            case 3:
              if (0 !== (root2 & 1024)) {
                if (root2 = firstChild.stateNode.containerInfo, JSCompiler_temp = root2.nodeType, 9 === JSCompiler_temp)
                  clearContainerSparingly(root2);
                else if (1 === JSCompiler_temp)
                  switch (root2.nodeName) {
                    case "HEAD":
                    case "HTML":
                    case "BODY":
                      clearContainerSparingly(root2);
                      break;
                    default:
                      root2.textContent = "";
                  }
              }
              break;
            case 5:
            case 26:
            case 27:
            case 6:
            case 4:
            case 17:
              break;
            default:
              if (0 !== (root2 & 1024)) throw Error(formatProdErrorMessage(163));
          }
          root2 = firstChild.sibling;
          if (null !== root2) {
            root2.return = firstChild.return;
            nextEffect = root2;
            break;
          }
          nextEffect = firstChild.return;
        }
  }
  function commitLayoutEffectOnFiber(finishedRoot, current, finishedWork) {
    var flags = finishedWork.flags;
    switch (finishedWork.tag) {
      case 0:
      case 11:
      case 15:
        recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
        flags & 4 && commitHookEffectListMount(5, finishedWork);
        break;
      case 1:
        recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
        if (flags & 4)
          if (finishedRoot = finishedWork.stateNode, null === current)
            try {
              finishedRoot.componentDidMount();
            } catch (error) {
              captureCommitPhaseError(finishedWork, finishedWork.return, error);
            }
          else {
            var prevProps = resolveClassComponentProps(
              finishedWork.type,
              current.memoizedProps
            );
            current = current.memoizedState;
            try {
              finishedRoot.componentDidUpdate(
                prevProps,
                current,
                finishedRoot.__reactInternalSnapshotBeforeUpdate
              );
            } catch (error$139) {
              captureCommitPhaseError(
                finishedWork,
                finishedWork.return,
                error$139
              );
            }
          }
        flags & 64 && commitClassCallbacks(finishedWork);
        flags & 512 && safelyAttachRef(finishedWork, finishedWork.return);
        break;
      case 3:
        recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
        if (flags & 64 && (finishedRoot = finishedWork.updateQueue, null !== finishedRoot)) {
          current = null;
          if (null !== finishedWork.child)
            switch (finishedWork.child.tag) {
              case 27:
              case 5:
                current = finishedWork.child.stateNode;
                break;
              case 1:
                current = finishedWork.child.stateNode;
            }
          try {
            commitCallbacks(finishedRoot, current);
          } catch (error) {
            captureCommitPhaseError(finishedWork, finishedWork.return, error);
          }
        }
        break;
      case 27:
        null === current && flags & 4 && commitHostSingletonAcquisition(finishedWork);
      case 26:
      case 5:
        recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
        null === current && flags & 4 && commitHostMount(finishedWork);
        flags & 512 && safelyAttachRef(finishedWork, finishedWork.return);
        break;
      case 12:
        recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
        break;
      case 31:
        recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
        flags & 4 && commitActivityHydrationCallbacks(finishedRoot, finishedWork);
        break;
      case 13:
        recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
        flags & 4 && commitSuspenseHydrationCallbacks(finishedRoot, finishedWork);
        flags & 64 && (finishedRoot = finishedWork.memoizedState, null !== finishedRoot && (finishedRoot = finishedRoot.dehydrated, null !== finishedRoot && (finishedWork = retryDehydratedSuspenseBoundary.bind(
          null,
          finishedWork
        ), registerSuspenseInstanceRetry(finishedRoot, finishedWork))));
        break;
      case 22:
        flags = null !== finishedWork.memoizedState || offscreenSubtreeIsHidden;
        if (!flags) {
          current = null !== current && null !== current.memoizedState || offscreenSubtreeWasHidden;
          prevProps = offscreenSubtreeIsHidden;
          var prevOffscreenSubtreeWasHidden = offscreenSubtreeWasHidden;
          offscreenSubtreeIsHidden = flags;
          (offscreenSubtreeWasHidden = current) && !prevOffscreenSubtreeWasHidden ? recursivelyTraverseReappearLayoutEffects(
            finishedRoot,
            finishedWork,
            0 !== (finishedWork.subtreeFlags & 8772)
          ) : recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
          offscreenSubtreeIsHidden = prevProps;
          offscreenSubtreeWasHidden = prevOffscreenSubtreeWasHidden;
        }
        break;
      case 30:
        break;
      default:
        recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
    }
  }
  function detachFiberAfterEffects(fiber) {
    var alternate = fiber.alternate;
    null !== alternate && (fiber.alternate = null, detachFiberAfterEffects(alternate));
    fiber.child = null;
    fiber.deletions = null;
    fiber.sibling = null;
    5 === fiber.tag && (alternate = fiber.stateNode, null !== alternate && detachDeletedInstance(alternate));
    fiber.stateNode = null;
    fiber.return = null;
    fiber.dependencies = null;
    fiber.memoizedProps = null;
    fiber.memoizedState = null;
    fiber.pendingProps = null;
    fiber.stateNode = null;
    fiber.updateQueue = null;
  }
  var hostParent = null, hostParentIsContainer = false;
  function recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, parent) {
    for (parent = parent.child; null !== parent; )
      commitDeletionEffectsOnFiber(finishedRoot, nearestMountedAncestor, parent), parent = parent.sibling;
  }
  function commitDeletionEffectsOnFiber(finishedRoot, nearestMountedAncestor, deletedFiber) {
    if (injectedHook && "function" === typeof injectedHook.onCommitFiberUnmount)
      try {
        injectedHook.onCommitFiberUnmount(rendererID, deletedFiber);
      } catch (err) {
      }
    switch (deletedFiber.tag) {
      case 26:
        offscreenSubtreeWasHidden || safelyDetachRef(deletedFiber, nearestMountedAncestor);
        recursivelyTraverseDeletionEffects(
          finishedRoot,
          nearestMountedAncestor,
          deletedFiber
        );
        deletedFiber.memoizedState ? deletedFiber.memoizedState.count-- : deletedFiber.stateNode && (deletedFiber = deletedFiber.stateNode, deletedFiber.parentNode.removeChild(deletedFiber));
        break;
      case 27:
        offscreenSubtreeWasHidden || safelyDetachRef(deletedFiber, nearestMountedAncestor);
        var prevHostParent = hostParent, prevHostParentIsContainer = hostParentIsContainer;
        isSingletonScope(deletedFiber.type) && (hostParent = deletedFiber.stateNode, hostParentIsContainer = false);
        recursivelyTraverseDeletionEffects(
          finishedRoot,
          nearestMountedAncestor,
          deletedFiber
        );
        releaseSingletonInstance(deletedFiber.stateNode);
        hostParent = prevHostParent;
        hostParentIsContainer = prevHostParentIsContainer;
        break;
      case 5:
        offscreenSubtreeWasHidden || safelyDetachRef(deletedFiber, nearestMountedAncestor);
      case 6:
        prevHostParent = hostParent;
        prevHostParentIsContainer = hostParentIsContainer;
        hostParent = null;
        recursivelyTraverseDeletionEffects(
          finishedRoot,
          nearestMountedAncestor,
          deletedFiber
        );
        hostParent = prevHostParent;
        hostParentIsContainer = prevHostParentIsContainer;
        if (null !== hostParent)
          if (hostParentIsContainer)
            try {
              (9 === hostParent.nodeType ? hostParent.body : "HTML" === hostParent.nodeName ? hostParent.ownerDocument.body : hostParent).removeChild(deletedFiber.stateNode);
            } catch (error) {
              captureCommitPhaseError(
                deletedFiber,
                nearestMountedAncestor,
                error
              );
            }
          else
            try {
              hostParent.removeChild(deletedFiber.stateNode);
            } catch (error) {
              captureCommitPhaseError(
                deletedFiber,
                nearestMountedAncestor,
                error
              );
            }
        break;
      case 18:
        null !== hostParent && (hostParentIsContainer ? (finishedRoot = hostParent, clearHydrationBoundary(
          9 === finishedRoot.nodeType ? finishedRoot.body : "HTML" === finishedRoot.nodeName ? finishedRoot.ownerDocument.body : finishedRoot,
          deletedFiber.stateNode
        ), retryIfBlockedOn(finishedRoot)) : clearHydrationBoundary(hostParent, deletedFiber.stateNode));
        break;
      case 4:
        prevHostParent = hostParent;
        prevHostParentIsContainer = hostParentIsContainer;
        hostParent = deletedFiber.stateNode.containerInfo;
        hostParentIsContainer = true;
        recursivelyTraverseDeletionEffects(
          finishedRoot,
          nearestMountedAncestor,
          deletedFiber
        );
        hostParent = prevHostParent;
        hostParentIsContainer = prevHostParentIsContainer;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        commitHookEffectListUnmount(2, deletedFiber, nearestMountedAncestor);
        offscreenSubtreeWasHidden || commitHookEffectListUnmount(4, deletedFiber, nearestMountedAncestor);
        recursivelyTraverseDeletionEffects(
          finishedRoot,
          nearestMountedAncestor,
          deletedFiber
        );
        break;
      case 1:
        offscreenSubtreeWasHidden || (safelyDetachRef(deletedFiber, nearestMountedAncestor), prevHostParent = deletedFiber.stateNode, "function" === typeof prevHostParent.componentWillUnmount && safelyCallComponentWillUnmount(
          deletedFiber,
          nearestMountedAncestor,
          prevHostParent
        ));
        recursivelyTraverseDeletionEffects(
          finishedRoot,
          nearestMountedAncestor,
          deletedFiber
        );
        break;
      case 21:
        recursivelyTraverseDeletionEffects(
          finishedRoot,
          nearestMountedAncestor,
          deletedFiber
        );
        break;
      case 22:
        offscreenSubtreeWasHidden = (prevHostParent = offscreenSubtreeWasHidden) || null !== deletedFiber.memoizedState;
        recursivelyTraverseDeletionEffects(
          finishedRoot,
          nearestMountedAncestor,
          deletedFiber
        );
        offscreenSubtreeWasHidden = prevHostParent;
        break;
      default:
        recursivelyTraverseDeletionEffects(
          finishedRoot,
          nearestMountedAncestor,
          deletedFiber
        );
    }
  }
  function commitActivityHydrationCallbacks(finishedRoot, finishedWork) {
    if (null === finishedWork.memoizedState && (finishedRoot = finishedWork.alternate, null !== finishedRoot && (finishedRoot = finishedRoot.memoizedState, null !== finishedRoot))) {
      finishedRoot = finishedRoot.dehydrated;
      try {
        retryIfBlockedOn(finishedRoot);
      } catch (error) {
        captureCommitPhaseError(finishedWork, finishedWork.return, error);
      }
    }
  }
  function commitSuspenseHydrationCallbacks(finishedRoot, finishedWork) {
    if (null === finishedWork.memoizedState && (finishedRoot = finishedWork.alternate, null !== finishedRoot && (finishedRoot = finishedRoot.memoizedState, null !== finishedRoot && (finishedRoot = finishedRoot.dehydrated, null !== finishedRoot))))
      try {
        retryIfBlockedOn(finishedRoot);
      } catch (error) {
        captureCommitPhaseError(finishedWork, finishedWork.return, error);
      }
  }
  function getRetryCache(finishedWork) {
    switch (finishedWork.tag) {
      case 31:
      case 13:
      case 19:
        var retryCache = finishedWork.stateNode;
        null === retryCache && (retryCache = finishedWork.stateNode = new PossiblyWeakSet());
        return retryCache;
      case 22:
        return finishedWork = finishedWork.stateNode, retryCache = finishedWork._retryCache, null === retryCache && (retryCache = finishedWork._retryCache = new PossiblyWeakSet()), retryCache;
      default:
        throw Error(formatProdErrorMessage(435, finishedWork.tag));
    }
  }
  function attachSuspenseRetryListeners(finishedWork, wakeables) {
    var retryCache = getRetryCache(finishedWork);
    wakeables.forEach(function(wakeable) {
      if (!retryCache.has(wakeable)) {
        retryCache.add(wakeable);
        var retry = resolveRetryWakeable.bind(null, finishedWork, wakeable);
        wakeable.then(retry, retry);
      }
    });
  }
  function recursivelyTraverseMutationEffects(root$jscomp$0, parentFiber) {
    var deletions = parentFiber.deletions;
    if (null !== deletions)
      for (var i = 0; i < deletions.length; i++) {
        var childToDelete = deletions[i], root2 = root$jscomp$0, returnFiber = parentFiber, parent = returnFiber;
        a: for (; null !== parent; ) {
          switch (parent.tag) {
            case 27:
              if (isSingletonScope(parent.type)) {
                hostParent = parent.stateNode;
                hostParentIsContainer = false;
                break a;
              }
              break;
            case 5:
              hostParent = parent.stateNode;
              hostParentIsContainer = false;
              break a;
            case 3:
            case 4:
              hostParent = parent.stateNode.containerInfo;
              hostParentIsContainer = true;
              break a;
          }
          parent = parent.return;
        }
        if (null === hostParent) throw Error(formatProdErrorMessage(160));
        commitDeletionEffectsOnFiber(root2, returnFiber, childToDelete);
        hostParent = null;
        hostParentIsContainer = false;
        root2 = childToDelete.alternate;
        null !== root2 && (root2.return = null);
        childToDelete.return = null;
      }
    if (parentFiber.subtreeFlags & 13886)
      for (parentFiber = parentFiber.child; null !== parentFiber; )
        commitMutationEffectsOnFiber(parentFiber, root$jscomp$0), parentFiber = parentFiber.sibling;
  }
  var currentHoistableRoot = null;
  function commitMutationEffectsOnFiber(finishedWork, root2) {
    var current = finishedWork.alternate, flags = finishedWork.flags;
    switch (finishedWork.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        recursivelyTraverseMutationEffects(root2, finishedWork);
        commitReconciliationEffects(finishedWork);
        flags & 4 && (commitHookEffectListUnmount(3, finishedWork, finishedWork.return), commitHookEffectListMount(3, finishedWork), commitHookEffectListUnmount(5, finishedWork, finishedWork.return));
        break;
      case 1:
        recursivelyTraverseMutationEffects(root2, finishedWork);
        commitReconciliationEffects(finishedWork);
        flags & 512 && (offscreenSubtreeWasHidden || null === current || safelyDetachRef(current, current.return));
        flags & 64 && offscreenSubtreeIsHidden && (finishedWork = finishedWork.updateQueue, null !== finishedWork && (flags = finishedWork.callbacks, null !== flags && (current = finishedWork.shared.hiddenCallbacks, finishedWork.shared.hiddenCallbacks = null === current ? flags : current.concat(flags))));
        break;
      case 26:
        var hoistableRoot = currentHoistableRoot;
        recursivelyTraverseMutationEffects(root2, finishedWork);
        commitReconciliationEffects(finishedWork);
        flags & 512 && (offscreenSubtreeWasHidden || null === current || safelyDetachRef(current, current.return));
        if (flags & 4) {
          var currentResource = null !== current ? current.memoizedState : null;
          flags = finishedWork.memoizedState;
          if (null === current)
            if (null === flags)
              if (null === finishedWork.stateNode) {
                a: {
                  flags = finishedWork.type;
                  current = finishedWork.memoizedProps;
                  hoistableRoot = hoistableRoot.ownerDocument || hoistableRoot;
                  b: switch (flags) {
                    case "title":
                      currentResource = hoistableRoot.getElementsByTagName("title")[0];
                      if (!currentResource || currentResource[internalHoistableMarker] || currentResource[internalInstanceKey] || "http://www.w3.org/2000/svg" === currentResource.namespaceURI || currentResource.hasAttribute("itemprop"))
                        currentResource = hoistableRoot.createElement(flags), hoistableRoot.head.insertBefore(
                          currentResource,
                          hoistableRoot.querySelector("head > title")
                        );
                      setInitialProperties(currentResource, flags, current);
                      currentResource[internalInstanceKey] = finishedWork;
                      markNodeAsHoistable(currentResource);
                      flags = currentResource;
                      break a;
                    case "link":
                      var maybeNodes = getHydratableHoistableCache(
                        "link",
                        "href",
                        hoistableRoot
                      ).get(flags + (current.href || ""));
                      if (maybeNodes) {
                        for (var i = 0; i < maybeNodes.length; i++)
                          if (currentResource = maybeNodes[i], currentResource.getAttribute("href") === (null == current.href || "" === current.href ? null : current.href) && currentResource.getAttribute("rel") === (null == current.rel ? null : current.rel) && currentResource.getAttribute("title") === (null == current.title ? null : current.title) && currentResource.getAttribute("crossorigin") === (null == current.crossOrigin ? null : current.crossOrigin)) {
                            maybeNodes.splice(i, 1);
                            break b;
                          }
                      }
                      currentResource = hoistableRoot.createElement(flags);
                      setInitialProperties(currentResource, flags, current);
                      hoistableRoot.head.appendChild(currentResource);
                      break;
                    case "meta":
                      if (maybeNodes = getHydratableHoistableCache(
                        "meta",
                        "content",
                        hoistableRoot
                      ).get(flags + (current.content || ""))) {
                        for (i = 0; i < maybeNodes.length; i++)
                          if (currentResource = maybeNodes[i], currentResource.getAttribute("content") === (null == current.content ? null : "" + current.content) && currentResource.getAttribute("name") === (null == current.name ? null : current.name) && currentResource.getAttribute("property") === (null == current.property ? null : current.property) && currentResource.getAttribute("http-equiv") === (null == current.httpEquiv ? null : current.httpEquiv) && currentResource.getAttribute("charset") === (null == current.charSet ? null : current.charSet)) {
                            maybeNodes.splice(i, 1);
                            break b;
                          }
                      }
                      currentResource = hoistableRoot.createElement(flags);
                      setInitialProperties(currentResource, flags, current);
                      hoistableRoot.head.appendChild(currentResource);
                      break;
                    default:
                      throw Error(formatProdErrorMessage(468, flags));
                  }
                  currentResource[internalInstanceKey] = finishedWork;
                  markNodeAsHoistable(currentResource);
                  flags = currentResource;
                }
                finishedWork.stateNode = flags;
              } else
                mountHoistable(
                  hoistableRoot,
                  finishedWork.type,
                  finishedWork.stateNode
                );
            else
              finishedWork.stateNode = acquireResource(
                hoistableRoot,
                flags,
                finishedWork.memoizedProps
              );
          else
            currentResource !== flags ? (null === currentResource ? null !== current.stateNode && (current = current.stateNode, current.parentNode.removeChild(current)) : currentResource.count--, null === flags ? mountHoistable(
              hoistableRoot,
              finishedWork.type,
              finishedWork.stateNode
            ) : acquireResource(
              hoistableRoot,
              flags,
              finishedWork.memoizedProps
            )) : null === flags && null !== finishedWork.stateNode && commitHostUpdate(
              finishedWork,
              finishedWork.memoizedProps,
              current.memoizedProps
            );
        }
        break;
      case 27:
        recursivelyTraverseMutationEffects(root2, finishedWork);
        commitReconciliationEffects(finishedWork);
        flags & 512 && (offscreenSubtreeWasHidden || null === current || safelyDetachRef(current, current.return));
        null !== current && flags & 4 && commitHostUpdate(
          finishedWork,
          finishedWork.memoizedProps,
          current.memoizedProps
        );
        break;
      case 5:
        recursivelyTraverseMutationEffects(root2, finishedWork);
        commitReconciliationEffects(finishedWork);
        flags & 512 && (offscreenSubtreeWasHidden || null === current || safelyDetachRef(current, current.return));
        if (finishedWork.flags & 32) {
          hoistableRoot = finishedWork.stateNode;
          try {
            setTextContent(hoistableRoot, "");
          } catch (error) {
            captureCommitPhaseError(finishedWork, finishedWork.return, error);
          }
        }
        flags & 4 && null != finishedWork.stateNode && (hoistableRoot = finishedWork.memoizedProps, commitHostUpdate(
          finishedWork,
          hoistableRoot,
          null !== current ? current.memoizedProps : hoistableRoot
        ));
        flags & 1024 && (needsFormReset = true);
        break;
      case 6:
        recursivelyTraverseMutationEffects(root2, finishedWork);
        commitReconciliationEffects(finishedWork);
        if (flags & 4) {
          if (null === finishedWork.stateNode)
            throw Error(formatProdErrorMessage(162));
          flags = finishedWork.memoizedProps;
          current = finishedWork.stateNode;
          try {
            current.nodeValue = flags;
          } catch (error) {
            captureCommitPhaseError(finishedWork, finishedWork.return, error);
          }
        }
        break;
      case 3:
        tagCaches = null;
        hoistableRoot = currentHoistableRoot;
        currentHoistableRoot = getHoistableRoot(root2.containerInfo);
        recursivelyTraverseMutationEffects(root2, finishedWork);
        currentHoistableRoot = hoistableRoot;
        commitReconciliationEffects(finishedWork);
        if (flags & 4 && null !== current && current.memoizedState.isDehydrated)
          try {
            retryIfBlockedOn(root2.containerInfo);
          } catch (error) {
            captureCommitPhaseError(finishedWork, finishedWork.return, error);
          }
        needsFormReset && (needsFormReset = false, recursivelyResetForms(finishedWork));
        break;
      case 4:
        flags = currentHoistableRoot;
        currentHoistableRoot = getHoistableRoot(
          finishedWork.stateNode.containerInfo
        );
        recursivelyTraverseMutationEffects(root2, finishedWork);
        commitReconciliationEffects(finishedWork);
        currentHoistableRoot = flags;
        break;
      case 12:
        recursivelyTraverseMutationEffects(root2, finishedWork);
        commitReconciliationEffects(finishedWork);
        break;
      case 31:
        recursivelyTraverseMutationEffects(root2, finishedWork);
        commitReconciliationEffects(finishedWork);
        flags & 4 && (flags = finishedWork.updateQueue, null !== flags && (finishedWork.updateQueue = null, attachSuspenseRetryListeners(finishedWork, flags)));
        break;
      case 13:
        recursivelyTraverseMutationEffects(root2, finishedWork);
        commitReconciliationEffects(finishedWork);
        finishedWork.child.flags & 8192 && null !== finishedWork.memoizedState !== (null !== current && null !== current.memoizedState) && (globalMostRecentFallbackTime = now());
        flags & 4 && (flags = finishedWork.updateQueue, null !== flags && (finishedWork.updateQueue = null, attachSuspenseRetryListeners(finishedWork, flags)));
        break;
      case 22:
        hoistableRoot = null !== finishedWork.memoizedState;
        var wasHidden = null !== current && null !== current.memoizedState, prevOffscreenSubtreeIsHidden = offscreenSubtreeIsHidden, prevOffscreenSubtreeWasHidden = offscreenSubtreeWasHidden;
        offscreenSubtreeIsHidden = prevOffscreenSubtreeIsHidden || hoistableRoot;
        offscreenSubtreeWasHidden = prevOffscreenSubtreeWasHidden || wasHidden;
        recursivelyTraverseMutationEffects(root2, finishedWork);
        offscreenSubtreeWasHidden = prevOffscreenSubtreeWasHidden;
        offscreenSubtreeIsHidden = prevOffscreenSubtreeIsHidden;
        commitReconciliationEffects(finishedWork);
        if (flags & 8192)
          a: for (root2 = finishedWork.stateNode, root2._visibility = hoistableRoot ? root2._visibility & -2 : root2._visibility | 1, hoistableRoot && (null === current || wasHidden || offscreenSubtreeIsHidden || offscreenSubtreeWasHidden || recursivelyTraverseDisappearLayoutEffects(finishedWork)), current = null, root2 = finishedWork; ; ) {
            if (5 === root2.tag || 26 === root2.tag) {
              if (null === current) {
                wasHidden = current = root2;
                try {
                  if (currentResource = wasHidden.stateNode, hoistableRoot)
                    maybeNodes = currentResource.style, "function" === typeof maybeNodes.setProperty ? maybeNodes.setProperty("display", "none", "important") : maybeNodes.display = "none";
                  else {
                    i = wasHidden.stateNode;
                    var styleProp = wasHidden.memoizedProps.style, display = void 0 !== styleProp && null !== styleProp && styleProp.hasOwnProperty("display") ? styleProp.display : null;
                    i.style.display = null == display || "boolean" === typeof display ? "" : ("" + display).trim();
                  }
                } catch (error) {
                  captureCommitPhaseError(wasHidden, wasHidden.return, error);
                }
              }
            } else if (6 === root2.tag) {
              if (null === current) {
                wasHidden = root2;
                try {
                  wasHidden.stateNode.nodeValue = hoistableRoot ? "" : wasHidden.memoizedProps;
                } catch (error) {
                  captureCommitPhaseError(wasHidden, wasHidden.return, error);
                }
              }
            } else if (18 === root2.tag) {
              if (null === current) {
                wasHidden = root2;
                try {
                  var instance = wasHidden.stateNode;
                  hoistableRoot ? hideOrUnhideDehydratedBoundary(instance, true) : hideOrUnhideDehydratedBoundary(wasHidden.stateNode, false);
                } catch (error) {
                  captureCommitPhaseError(wasHidden, wasHidden.return, error);
                }
              }
            } else if ((22 !== root2.tag && 23 !== root2.tag || null === root2.memoizedState || root2 === finishedWork) && null !== root2.child) {
              root2.child.return = root2;
              root2 = root2.child;
              continue;
            }
            if (root2 === finishedWork) break a;
            for (; null === root2.sibling; ) {
              if (null === root2.return || root2.return === finishedWork) break a;
              current === root2 && (current = null);
              root2 = root2.return;
            }
            current === root2 && (current = null);
            root2.sibling.return = root2.return;
            root2 = root2.sibling;
          }
        flags & 4 && (flags = finishedWork.updateQueue, null !== flags && (current = flags.retryQueue, null !== current && (flags.retryQueue = null, attachSuspenseRetryListeners(finishedWork, current))));
        break;
      case 19:
        recursivelyTraverseMutationEffects(root2, finishedWork);
        commitReconciliationEffects(finishedWork);
        flags & 4 && (flags = finishedWork.updateQueue, null !== flags && (finishedWork.updateQueue = null, attachSuspenseRetryListeners(finishedWork, flags)));
        break;
      case 30:
        break;
      case 21:
        break;
      default:
        recursivelyTraverseMutationEffects(root2, finishedWork), commitReconciliationEffects(finishedWork);
    }
  }
  function commitReconciliationEffects(finishedWork) {
    var flags = finishedWork.flags;
    if (flags & 2) {
      try {
        for (var hostParentFiber, parentFiber = finishedWork.return; null !== parentFiber; ) {
          if (isHostParent(parentFiber)) {
            hostParentFiber = parentFiber;
            break;
          }
          parentFiber = parentFiber.return;
        }
        if (null == hostParentFiber) throw Error(formatProdErrorMessage(160));
        switch (hostParentFiber.tag) {
          case 27:
            var parent = hostParentFiber.stateNode, before = getHostSibling(finishedWork);
            insertOrAppendPlacementNode(finishedWork, before, parent);
            break;
          case 5:
            var parent$141 = hostParentFiber.stateNode;
            hostParentFiber.flags & 32 && (setTextContent(parent$141, ""), hostParentFiber.flags &= -33);
            var before$142 = getHostSibling(finishedWork);
            insertOrAppendPlacementNode(finishedWork, before$142, parent$141);
            break;
          case 3:
          case 4:
            var parent$143 = hostParentFiber.stateNode.containerInfo, before$144 = getHostSibling(finishedWork);
            insertOrAppendPlacementNodeIntoContainer(
              finishedWork,
              before$144,
              parent$143
            );
            break;
          default:
            throw Error(formatProdErrorMessage(161));
        }
      } catch (error) {
        captureCommitPhaseError(finishedWork, finishedWork.return, error);
      }
      finishedWork.flags &= -3;
    }
    flags & 4096 && (finishedWork.flags &= -4097);
  }
  function recursivelyResetForms(parentFiber) {
    if (parentFiber.subtreeFlags & 1024)
      for (parentFiber = parentFiber.child; null !== parentFiber; ) {
        var fiber = parentFiber;
        recursivelyResetForms(fiber);
        5 === fiber.tag && fiber.flags & 1024 && fiber.stateNode.reset();
        parentFiber = parentFiber.sibling;
      }
  }
  function recursivelyTraverseLayoutEffects(root2, parentFiber) {
    if (parentFiber.subtreeFlags & 8772)
      for (parentFiber = parentFiber.child; null !== parentFiber; )
        commitLayoutEffectOnFiber(root2, parentFiber.alternate, parentFiber), parentFiber = parentFiber.sibling;
  }
  function recursivelyTraverseDisappearLayoutEffects(parentFiber) {
    for (parentFiber = parentFiber.child; null !== parentFiber; ) {
      var finishedWork = parentFiber;
      switch (finishedWork.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          commitHookEffectListUnmount(4, finishedWork, finishedWork.return);
          recursivelyTraverseDisappearLayoutEffects(finishedWork);
          break;
        case 1:
          safelyDetachRef(finishedWork, finishedWork.return);
          var instance = finishedWork.stateNode;
          "function" === typeof instance.componentWillUnmount && safelyCallComponentWillUnmount(
            finishedWork,
            finishedWork.return,
            instance
          );
          recursivelyTraverseDisappearLayoutEffects(finishedWork);
          break;
        case 27:
          releaseSingletonInstance(finishedWork.stateNode);
        case 26:
        case 5:
          safelyDetachRef(finishedWork, finishedWork.return);
          recursivelyTraverseDisappearLayoutEffects(finishedWork);
          break;
        case 22:
          null === finishedWork.memoizedState && recursivelyTraverseDisappearLayoutEffects(finishedWork);
          break;
        case 30:
          recursivelyTraverseDisappearLayoutEffects(finishedWork);
          break;
        default:
          recursivelyTraverseDisappearLayoutEffects(finishedWork);
      }
      parentFiber = parentFiber.sibling;
    }
  }
  function recursivelyTraverseReappearLayoutEffects(finishedRoot$jscomp$0, parentFiber, includeWorkInProgressEffects) {
    includeWorkInProgressEffects = includeWorkInProgressEffects && 0 !== (parentFiber.subtreeFlags & 8772);
    for (parentFiber = parentFiber.child; null !== parentFiber; ) {
      var current = parentFiber.alternate, finishedRoot = finishedRoot$jscomp$0, finishedWork = parentFiber, flags = finishedWork.flags;
      switch (finishedWork.tag) {
        case 0:
        case 11:
        case 15:
          recursivelyTraverseReappearLayoutEffects(
            finishedRoot,
            finishedWork,
            includeWorkInProgressEffects
          );
          commitHookEffectListMount(4, finishedWork);
          break;
        case 1:
          recursivelyTraverseReappearLayoutEffects(
            finishedRoot,
            finishedWork,
            includeWorkInProgressEffects
          );
          current = finishedWork;
          finishedRoot = current.stateNode;
          if ("function" === typeof finishedRoot.componentDidMount)
            try {
              finishedRoot.componentDidMount();
            } catch (error) {
              captureCommitPhaseError(current, current.return, error);
            }
          current = finishedWork;
          finishedRoot = current.updateQueue;
          if (null !== finishedRoot) {
            var instance = current.stateNode;
            try {
              var hiddenCallbacks = finishedRoot.shared.hiddenCallbacks;
              if (null !== hiddenCallbacks)
                for (finishedRoot.shared.hiddenCallbacks = null, finishedRoot = 0; finishedRoot < hiddenCallbacks.length; finishedRoot++)
                  callCallback(hiddenCallbacks[finishedRoot], instance);
            } catch (error) {
              captureCommitPhaseError(current, current.return, error);
            }
          }
          includeWorkInProgressEffects && flags & 64 && commitClassCallbacks(finishedWork);
          safelyAttachRef(finishedWork, finishedWork.return);
          break;
        case 27:
          commitHostSingletonAcquisition(finishedWork);
        case 26:
        case 5:
          recursivelyTraverseReappearLayoutEffects(
            finishedRoot,
            finishedWork,
            includeWorkInProgressEffects
          );
          includeWorkInProgressEffects && null === current && flags & 4 && commitHostMount(finishedWork);
          safelyAttachRef(finishedWork, finishedWork.return);
          break;
        case 12:
          recursivelyTraverseReappearLayoutEffects(
            finishedRoot,
            finishedWork,
            includeWorkInProgressEffects
          );
          break;
        case 31:
          recursivelyTraverseReappearLayoutEffects(
            finishedRoot,
            finishedWork,
            includeWorkInProgressEffects
          );
          includeWorkInProgressEffects && flags & 4 && commitActivityHydrationCallbacks(finishedRoot, finishedWork);
          break;
        case 13:
          recursivelyTraverseReappearLayoutEffects(
            finishedRoot,
            finishedWork,
            includeWorkInProgressEffects
          );
          includeWorkInProgressEffects && flags & 4 && commitSuspenseHydrationCallbacks(finishedRoot, finishedWork);
          break;
        case 22:
          null === finishedWork.memoizedState && recursivelyTraverseReappearLayoutEffects(
            finishedRoot,
            finishedWork,
            includeWorkInProgressEffects
          );
          safelyAttachRef(finishedWork, finishedWork.return);
          break;
        case 30:
          break;
        default:
          recursivelyTraverseReappearLayoutEffects(
            finishedRoot,
            finishedWork,
            includeWorkInProgressEffects
          );
      }
      parentFiber = parentFiber.sibling;
    }
  }
  function commitOffscreenPassiveMountEffects(current, finishedWork) {
    var previousCache = null;
    null !== current && null !== current.memoizedState && null !== current.memoizedState.cachePool && (previousCache = current.memoizedState.cachePool.pool);
    current = null;
    null !== finishedWork.memoizedState && null !== finishedWork.memoizedState.cachePool && (current = finishedWork.memoizedState.cachePool.pool);
    current !== previousCache && (null != current && current.refCount++, null != previousCache && releaseCache(previousCache));
  }
  function commitCachePassiveMountEffect(current, finishedWork) {
    current = null;
    null !== finishedWork.alternate && (current = finishedWork.alternate.memoizedState.cache);
    finishedWork = finishedWork.memoizedState.cache;
    finishedWork !== current && (finishedWork.refCount++, null != current && releaseCache(current));
  }
  function recursivelyTraversePassiveMountEffects(root2, parentFiber, committedLanes, committedTransitions) {
    if (parentFiber.subtreeFlags & 10256)
      for (parentFiber = parentFiber.child; null !== parentFiber; )
        commitPassiveMountOnFiber(
          root2,
          parentFiber,
          committedLanes,
          committedTransitions
        ), parentFiber = parentFiber.sibling;
  }
  function commitPassiveMountOnFiber(finishedRoot, finishedWork, committedLanes, committedTransitions) {
    var flags = finishedWork.flags;
    switch (finishedWork.tag) {
      case 0:
      case 11:
      case 15:
        recursivelyTraversePassiveMountEffects(
          finishedRoot,
          finishedWork,
          committedLanes,
          committedTransitions
        );
        flags & 2048 && commitHookEffectListMount(9, finishedWork);
        break;
      case 1:
        recursivelyTraversePassiveMountEffects(
          finishedRoot,
          finishedWork,
          committedLanes,
          committedTransitions
        );
        break;
      case 3:
        recursivelyTraversePassiveMountEffects(
          finishedRoot,
          finishedWork,
          committedLanes,
          committedTransitions
        );
        flags & 2048 && (finishedRoot = null, null !== finishedWork.alternate && (finishedRoot = finishedWork.alternate.memoizedState.cache), finishedWork = finishedWork.memoizedState.cache, finishedWork !== finishedRoot && (finishedWork.refCount++, null != finishedRoot && releaseCache(finishedRoot)));
        break;
      case 12:
        if (flags & 2048) {
          recursivelyTraversePassiveMountEffects(
            finishedRoot,
            finishedWork,
            committedLanes,
            committedTransitions
          );
          finishedRoot = finishedWork.stateNode;
          try {
            var _finishedWork$memoize2 = finishedWork.memoizedProps, id = _finishedWork$memoize2.id, onPostCommit = _finishedWork$memoize2.onPostCommit;
            "function" === typeof onPostCommit && onPostCommit(
              id,
              null === finishedWork.alternate ? "mount" : "update",
              finishedRoot.passiveEffectDuration,
              -0
            );
          } catch (error) {
            captureCommitPhaseError(finishedWork, finishedWork.return, error);
          }
        } else
          recursivelyTraversePassiveMountEffects(
            finishedRoot,
            finishedWork,
            committedLanes,
            committedTransitions
          );
        break;
      case 31:
        recursivelyTraversePassiveMountEffects(
          finishedRoot,
          finishedWork,
          committedLanes,
          committedTransitions
        );
        break;
      case 13:
        recursivelyTraversePassiveMountEffects(
          finishedRoot,
          finishedWork,
          committedLanes,
          committedTransitions
        );
        break;
      case 23:
        break;
      case 22:
        _finishedWork$memoize2 = finishedWork.stateNode;
        id = finishedWork.alternate;
        null !== finishedWork.memoizedState ? _finishedWork$memoize2._visibility & 2 ? recursivelyTraversePassiveMountEffects(
          finishedRoot,
          finishedWork,
          committedLanes,
          committedTransitions
        ) : recursivelyTraverseAtomicPassiveEffects(finishedRoot, finishedWork) : _finishedWork$memoize2._visibility & 2 ? recursivelyTraversePassiveMountEffects(
          finishedRoot,
          finishedWork,
          committedLanes,
          committedTransitions
        ) : (_finishedWork$memoize2._visibility |= 2, recursivelyTraverseReconnectPassiveEffects(
          finishedRoot,
          finishedWork,
          committedLanes,
          committedTransitions,
          0 !== (finishedWork.subtreeFlags & 10256) || false
        ));
        flags & 2048 && commitOffscreenPassiveMountEffects(id, finishedWork);
        break;
      case 24:
        recursivelyTraversePassiveMountEffects(
          finishedRoot,
          finishedWork,
          committedLanes,
          committedTransitions
        );
        flags & 2048 && commitCachePassiveMountEffect(finishedWork.alternate, finishedWork);
        break;
      default:
        recursivelyTraversePassiveMountEffects(
          finishedRoot,
          finishedWork,
          committedLanes,
          committedTransitions
        );
    }
  }
  function recursivelyTraverseReconnectPassiveEffects(finishedRoot$jscomp$0, parentFiber, committedLanes$jscomp$0, committedTransitions$jscomp$0, includeWorkInProgressEffects) {
    includeWorkInProgressEffects = includeWorkInProgressEffects && (0 !== (parentFiber.subtreeFlags & 10256) || false);
    for (parentFiber = parentFiber.child; null !== parentFiber; ) {
      var finishedRoot = finishedRoot$jscomp$0, finishedWork = parentFiber, committedLanes = committedLanes$jscomp$0, committedTransitions = committedTransitions$jscomp$0, flags = finishedWork.flags;
      switch (finishedWork.tag) {
        case 0:
        case 11:
        case 15:
          recursivelyTraverseReconnectPassiveEffects(
            finishedRoot,
            finishedWork,
            committedLanes,
            committedTransitions,
            includeWorkInProgressEffects
          );
          commitHookEffectListMount(8, finishedWork);
          break;
        case 23:
          break;
        case 22:
          var instance = finishedWork.stateNode;
          null !== finishedWork.memoizedState ? instance._visibility & 2 ? recursivelyTraverseReconnectPassiveEffects(
            finishedRoot,
            finishedWork,
            committedLanes,
            committedTransitions,
            includeWorkInProgressEffects
          ) : recursivelyTraverseAtomicPassiveEffects(
            finishedRoot,
            finishedWork
          ) : (instance._visibility |= 2, recursivelyTraverseReconnectPassiveEffects(
            finishedRoot,
            finishedWork,
            committedLanes,
            committedTransitions,
            includeWorkInProgressEffects
          ));
          includeWorkInProgressEffects && flags & 2048 && commitOffscreenPassiveMountEffects(
            finishedWork.alternate,
            finishedWork
          );
          break;
        case 24:
          recursivelyTraverseReconnectPassiveEffects(
            finishedRoot,
            finishedWork,
            committedLanes,
            committedTransitions,
            includeWorkInProgressEffects
          );
          includeWorkInProgressEffects && flags & 2048 && commitCachePassiveMountEffect(finishedWork.alternate, finishedWork);
          break;
        default:
          recursivelyTraverseReconnectPassiveEffects(
            finishedRoot,
            finishedWork,
            committedLanes,
            committedTransitions,
            includeWorkInProgressEffects
          );
      }
      parentFiber = parentFiber.sibling;
    }
  }
  function recursivelyTraverseAtomicPassiveEffects(finishedRoot$jscomp$0, parentFiber) {
    if (parentFiber.subtreeFlags & 10256)
      for (parentFiber = parentFiber.child; null !== parentFiber; ) {
        var finishedRoot = finishedRoot$jscomp$0, finishedWork = parentFiber, flags = finishedWork.flags;
        switch (finishedWork.tag) {
          case 22:
            recursivelyTraverseAtomicPassiveEffects(finishedRoot, finishedWork);
            flags & 2048 && commitOffscreenPassiveMountEffects(
              finishedWork.alternate,
              finishedWork
            );
            break;
          case 24:
            recursivelyTraverseAtomicPassiveEffects(finishedRoot, finishedWork);
            flags & 2048 && commitCachePassiveMountEffect(finishedWork.alternate, finishedWork);
            break;
          default:
            recursivelyTraverseAtomicPassiveEffects(finishedRoot, finishedWork);
        }
        parentFiber = parentFiber.sibling;
      }
  }
  var suspenseyCommitFlag = 8192;
  function recursivelyAccumulateSuspenseyCommit(parentFiber, committedLanes, suspendedState) {
    if (parentFiber.subtreeFlags & suspenseyCommitFlag)
      for (parentFiber = parentFiber.child; null !== parentFiber; )
        accumulateSuspenseyCommitOnFiber(
          parentFiber,
          committedLanes,
          suspendedState
        ), parentFiber = parentFiber.sibling;
  }
  function accumulateSuspenseyCommitOnFiber(fiber, committedLanes, suspendedState) {
    switch (fiber.tag) {
      case 26:
        recursivelyAccumulateSuspenseyCommit(
          fiber,
          committedLanes,
          suspendedState
        );
        fiber.flags & suspenseyCommitFlag && null !== fiber.memoizedState && suspendResource(
          suspendedState,
          currentHoistableRoot,
          fiber.memoizedState,
          fiber.memoizedProps
        );
        break;
      case 5:
        recursivelyAccumulateSuspenseyCommit(
          fiber,
          committedLanes,
          suspendedState
        );
        break;
      case 3:
      case 4:
        var previousHoistableRoot = currentHoistableRoot;
        currentHoistableRoot = getHoistableRoot(fiber.stateNode.containerInfo);
        recursivelyAccumulateSuspenseyCommit(
          fiber,
          committedLanes,
          suspendedState
        );
        currentHoistableRoot = previousHoistableRoot;
        break;
      case 22:
        null === fiber.memoizedState && (previousHoistableRoot = fiber.alternate, null !== previousHoistableRoot && null !== previousHoistableRoot.memoizedState ? (previousHoistableRoot = suspenseyCommitFlag, suspenseyCommitFlag = 16777216, recursivelyAccumulateSuspenseyCommit(
          fiber,
          committedLanes,
          suspendedState
        ), suspenseyCommitFlag = previousHoistableRoot) : recursivelyAccumulateSuspenseyCommit(
          fiber,
          committedLanes,
          suspendedState
        ));
        break;
      default:
        recursivelyAccumulateSuspenseyCommit(
          fiber,
          committedLanes,
          suspendedState
        );
    }
  }
  function detachAlternateSiblings(parentFiber) {
    var previousFiber = parentFiber.alternate;
    if (null !== previousFiber && (parentFiber = previousFiber.child, null !== parentFiber)) {
      previousFiber.child = null;
      do
        previousFiber = parentFiber.sibling, parentFiber.sibling = null, parentFiber = previousFiber;
      while (null !== parentFiber);
    }
  }
  function recursivelyTraversePassiveUnmountEffects(parentFiber) {
    var deletions = parentFiber.deletions;
    if (0 !== (parentFiber.flags & 16)) {
      if (null !== deletions)
        for (var i = 0; i < deletions.length; i++) {
          var childToDelete = deletions[i];
          nextEffect = childToDelete;
          commitPassiveUnmountEffectsInsideOfDeletedTree_begin(
            childToDelete,
            parentFiber
          );
        }
      detachAlternateSiblings(parentFiber);
    }
    if (parentFiber.subtreeFlags & 10256)
      for (parentFiber = parentFiber.child; null !== parentFiber; )
        commitPassiveUnmountOnFiber(parentFiber), parentFiber = parentFiber.sibling;
  }
  function commitPassiveUnmountOnFiber(finishedWork) {
    switch (finishedWork.tag) {
      case 0:
      case 11:
      case 15:
        recursivelyTraversePassiveUnmountEffects(finishedWork);
        finishedWork.flags & 2048 && commitHookEffectListUnmount(9, finishedWork, finishedWork.return);
        break;
      case 3:
        recursivelyTraversePassiveUnmountEffects(finishedWork);
        break;
      case 12:
        recursivelyTraversePassiveUnmountEffects(finishedWork);
        break;
      case 22:
        var instance = finishedWork.stateNode;
        null !== finishedWork.memoizedState && instance._visibility & 2 && (null === finishedWork.return || 13 !== finishedWork.return.tag) ? (instance._visibility &= -3, recursivelyTraverseDisconnectPassiveEffects(finishedWork)) : recursivelyTraversePassiveUnmountEffects(finishedWork);
        break;
      default:
        recursivelyTraversePassiveUnmountEffects(finishedWork);
    }
  }
  function recursivelyTraverseDisconnectPassiveEffects(parentFiber) {
    var deletions = parentFiber.deletions;
    if (0 !== (parentFiber.flags & 16)) {
      if (null !== deletions)
        for (var i = 0; i < deletions.length; i++) {
          var childToDelete = deletions[i];
          nextEffect = childToDelete;
          commitPassiveUnmountEffectsInsideOfDeletedTree_begin(
            childToDelete,
            parentFiber
          );
        }
      detachAlternateSiblings(parentFiber);
    }
    for (parentFiber = parentFiber.child; null !== parentFiber; ) {
      deletions = parentFiber;
      switch (deletions.tag) {
        case 0:
        case 11:
        case 15:
          commitHookEffectListUnmount(8, deletions, deletions.return);
          recursivelyTraverseDisconnectPassiveEffects(deletions);
          break;
        case 22:
          i = deletions.stateNode;
          i._visibility & 2 && (i._visibility &= -3, recursivelyTraverseDisconnectPassiveEffects(deletions));
          break;
        default:
          recursivelyTraverseDisconnectPassiveEffects(deletions);
      }
      parentFiber = parentFiber.sibling;
    }
  }
  function commitPassiveUnmountEffectsInsideOfDeletedTree_begin(deletedSubtreeRoot, nearestMountedAncestor) {
    for (; null !== nextEffect; ) {
      var fiber = nextEffect;
      switch (fiber.tag) {
        case 0:
        case 11:
        case 15:
          commitHookEffectListUnmount(8, fiber, nearestMountedAncestor);
          break;
        case 23:
        case 22:
          if (null !== fiber.memoizedState && null !== fiber.memoizedState.cachePool) {
            var cache = fiber.memoizedState.cachePool.pool;
            null != cache && cache.refCount++;
          }
          break;
        case 24:
          releaseCache(fiber.memoizedState.cache);
      }
      cache = fiber.child;
      if (null !== cache) cache.return = fiber, nextEffect = cache;
      else
        a: for (fiber = deletedSubtreeRoot; null !== nextEffect; ) {
          cache = nextEffect;
          var sibling = cache.sibling, returnFiber = cache.return;
          detachFiberAfterEffects(cache);
          if (cache === fiber) {
            nextEffect = null;
            break a;
          }
          if (null !== sibling) {
            sibling.return = returnFiber;
            nextEffect = sibling;
            break a;
          }
          nextEffect = returnFiber;
        }
    }
  }
  var DefaultAsyncDispatcher = {
    getCacheForType: function(resourceType) {
      var cache = readContext(CacheContext), cacheForType = cache.data.get(resourceType);
      void 0 === cacheForType && (cacheForType = resourceType(), cache.data.set(resourceType, cacheForType));
      return cacheForType;
    },
    cacheSignal: function() {
      return readContext(CacheContext).controller.signal;
    }
  }, PossiblyWeakMap = "function" === typeof WeakMap ? WeakMap : Map, executionContext = 0, workInProgressRoot = null, workInProgress = null, workInProgressRootRenderLanes = 0, workInProgressSuspendedReason = 0, workInProgressThrownValue = null, workInProgressRootDidSkipSuspendedSiblings = false, workInProgressRootIsPrerendering = false, workInProgressRootDidAttachPingListener = false, entangledRenderLanes = 0, workInProgressRootExitStatus = 0, workInProgressRootSkippedLanes = 0, workInProgressRootInterleavedUpdatedLanes = 0, workInProgressRootPingedLanes = 0, workInProgressDeferredLane = 0, workInProgressSuspendedRetryLanes = 0, workInProgressRootConcurrentErrors = null, workInProgressRootRecoverableErrors = null, workInProgressRootDidIncludeRecursiveRenderUpdate = false, globalMostRecentFallbackTime = 0, globalMostRecentTransitionTime = 0, workInProgressRootRenderTargetTime = Infinity, workInProgressTransitions = null, legacyErrorBoundariesThatAlreadyFailed = null, pendingEffectsStatus = 0, pendingEffectsRoot = null, pendingFinishedWork = null, pendingEffectsLanes = 0, pendingEffectsRemainingLanes = 0, pendingPassiveTransitions = null, pendingRecoverableErrors = null, nestedUpdateCount = 0, rootWithNestedUpdates = null;
  function requestUpdateLane() {
    return 0 !== (executionContext & 2) && 0 !== workInProgressRootRenderLanes ? workInProgressRootRenderLanes & -workInProgressRootRenderLanes : null !== ReactSharedInternals.T ? requestTransitionLane() : resolveUpdatePriority();
  }
  function requestDeferredLane() {
    if (0 === workInProgressDeferredLane)
      if (0 === (workInProgressRootRenderLanes & 536870912) || isHydrating) {
        var lane = nextTransitionDeferredLane;
        nextTransitionDeferredLane <<= 1;
        0 === (nextTransitionDeferredLane & 3932160) && (nextTransitionDeferredLane = 262144);
        workInProgressDeferredLane = lane;
      } else workInProgressDeferredLane = 536870912;
    lane = suspenseHandlerStackCursor.current;
    null !== lane && (lane.flags |= 32);
    return workInProgressDeferredLane;
  }
  function scheduleUpdateOnFiber(root2, fiber, lane) {
    if (root2 === workInProgressRoot && (2 === workInProgressSuspendedReason || 9 === workInProgressSuspendedReason) || null !== root2.cancelPendingCommit)
      prepareFreshStack(root2, 0), markRootSuspended(
        root2,
        workInProgressRootRenderLanes,
        workInProgressDeferredLane,
        false
      );
    markRootUpdated$1(root2, lane);
    if (0 === (executionContext & 2) || root2 !== workInProgressRoot)
      root2 === workInProgressRoot && (0 === (executionContext & 2) && (workInProgressRootInterleavedUpdatedLanes |= lane), 4 === workInProgressRootExitStatus && markRootSuspended(
        root2,
        workInProgressRootRenderLanes,
        workInProgressDeferredLane,
        false
      )), ensureRootIsScheduled(root2);
  }
  function performWorkOnRoot(root$jscomp$0, lanes, forceSync) {
    if (0 !== (executionContext & 6)) throw Error(formatProdErrorMessage(327));
    var shouldTimeSlice = !forceSync && 0 === (lanes & 127) && 0 === (lanes & root$jscomp$0.expiredLanes) || checkIfRootIsPrerendering(root$jscomp$0, lanes), exitStatus = shouldTimeSlice ? renderRootConcurrent(root$jscomp$0, lanes) : renderRootSync(root$jscomp$0, lanes, true), renderWasConcurrent = shouldTimeSlice;
    do {
      if (0 === exitStatus) {
        workInProgressRootIsPrerendering && !shouldTimeSlice && markRootSuspended(root$jscomp$0, lanes, 0, false);
        break;
      } else {
        forceSync = root$jscomp$0.current.alternate;
        if (renderWasConcurrent && !isRenderConsistentWithExternalStores(forceSync)) {
          exitStatus = renderRootSync(root$jscomp$0, lanes, false);
          renderWasConcurrent = false;
          continue;
        }
        if (2 === exitStatus) {
          renderWasConcurrent = lanes;
          if (root$jscomp$0.errorRecoveryDisabledLanes & renderWasConcurrent)
            var JSCompiler_inline_result = 0;
          else
            JSCompiler_inline_result = root$jscomp$0.pendingLanes & -536870913, JSCompiler_inline_result = 0 !== JSCompiler_inline_result ? JSCompiler_inline_result : JSCompiler_inline_result & 536870912 ? 536870912 : 0;
          if (0 !== JSCompiler_inline_result) {
            lanes = JSCompiler_inline_result;
            a: {
              var root2 = root$jscomp$0;
              exitStatus = workInProgressRootConcurrentErrors;
              var wasRootDehydrated = root2.current.memoizedState.isDehydrated;
              wasRootDehydrated && (prepareFreshStack(root2, JSCompiler_inline_result).flags |= 256);
              JSCompiler_inline_result = renderRootSync(
                root2,
                JSCompiler_inline_result,
                false
              );
              if (2 !== JSCompiler_inline_result) {
                if (workInProgressRootDidAttachPingListener && !wasRootDehydrated) {
                  root2.errorRecoveryDisabledLanes |= renderWasConcurrent;
                  workInProgressRootInterleavedUpdatedLanes |= renderWasConcurrent;
                  exitStatus = 4;
                  break a;
                }
                renderWasConcurrent = workInProgressRootRecoverableErrors;
                workInProgressRootRecoverableErrors = exitStatus;
                null !== renderWasConcurrent && (null === workInProgressRootRecoverableErrors ? workInProgressRootRecoverableErrors = renderWasConcurrent : workInProgressRootRecoverableErrors.push.apply(
                  workInProgressRootRecoverableErrors,
                  renderWasConcurrent
                ));
              }
              exitStatus = JSCompiler_inline_result;
            }
            renderWasConcurrent = false;
            if (2 !== exitStatus) continue;
          }
        }
        if (1 === exitStatus) {
          prepareFreshStack(root$jscomp$0, 0);
          markRootSuspended(root$jscomp$0, lanes, 0, true);
          break;
        }
        a: {
          shouldTimeSlice = root$jscomp$0;
          renderWasConcurrent = exitStatus;
          switch (renderWasConcurrent) {
            case 0:
            case 1:
              throw Error(formatProdErrorMessage(345));
            case 4:
              if ((lanes & 4194048) !== lanes) break;
            case 6:
              markRootSuspended(
                shouldTimeSlice,
                lanes,
                workInProgressDeferredLane,
                !workInProgressRootDidSkipSuspendedSiblings
              );
              break a;
            case 2:
              workInProgressRootRecoverableErrors = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(formatProdErrorMessage(329));
          }
          if ((lanes & 62914560) === lanes && (exitStatus = globalMostRecentFallbackTime + 300 - now(), 10 < exitStatus)) {
            markRootSuspended(
              shouldTimeSlice,
              lanes,
              workInProgressDeferredLane,
              !workInProgressRootDidSkipSuspendedSiblings
            );
            if (0 !== getNextLanes(shouldTimeSlice, 0, true)) break a;
            pendingEffectsLanes = lanes;
            shouldTimeSlice.timeoutHandle = scheduleTimeout(
              commitRootWhenReady.bind(
                null,
                shouldTimeSlice,
                forceSync,
                workInProgressRootRecoverableErrors,
                workInProgressTransitions,
                workInProgressRootDidIncludeRecursiveRenderUpdate,
                lanes,
                workInProgressDeferredLane,
                workInProgressRootInterleavedUpdatedLanes,
                workInProgressSuspendedRetryLanes,
                workInProgressRootDidSkipSuspendedSiblings,
                renderWasConcurrent,
                "Throttled",
                -0,
                0
              ),
              exitStatus
            );
            break a;
          }
          commitRootWhenReady(
            shouldTimeSlice,
            forceSync,
            workInProgressRootRecoverableErrors,
            workInProgressTransitions,
            workInProgressRootDidIncludeRecursiveRenderUpdate,
            lanes,
            workInProgressDeferredLane,
            workInProgressRootInterleavedUpdatedLanes,
            workInProgressSuspendedRetryLanes,
            workInProgressRootDidSkipSuspendedSiblings,
            renderWasConcurrent,
            null,
            -0,
            0
          );
        }
      }
      break;
    } while (1);
    ensureRootIsScheduled(root$jscomp$0);
  }
  function commitRootWhenReady(root2, finishedWork, recoverableErrors, transitions, didIncludeRenderPhaseUpdate, lanes, spawnedLane, updatedLanes, suspendedRetryLanes, didSkipSuspendedSiblings, exitStatus, suspendedCommitReason, completedRenderStartTime, completedRenderEndTime) {
    root2.timeoutHandle = -1;
    suspendedCommitReason = finishedWork.subtreeFlags;
    if (suspendedCommitReason & 8192 || 16785408 === (suspendedCommitReason & 16785408)) {
      suspendedCommitReason = {
        stylesheets: null,
        count: 0,
        imgCount: 0,
        imgBytes: 0,
        suspenseyImages: [],
        waitingForImages: true,
        waitingForViewTransition: false,
        unsuspend: noop$1
      };
      accumulateSuspenseyCommitOnFiber(
        finishedWork,
        lanes,
        suspendedCommitReason
      );
      var timeoutOffset = (lanes & 62914560) === lanes ? globalMostRecentFallbackTime - now() : (lanes & 4194048) === lanes ? globalMostRecentTransitionTime - now() : 0;
      timeoutOffset = waitForCommitToBeReady(
        suspendedCommitReason,
        timeoutOffset
      );
      if (null !== timeoutOffset) {
        pendingEffectsLanes = lanes;
        root2.cancelPendingCommit = timeoutOffset(
          commitRoot.bind(
            null,
            root2,
            finishedWork,
            lanes,
            recoverableErrors,
            transitions,
            didIncludeRenderPhaseUpdate,
            spawnedLane,
            updatedLanes,
            suspendedRetryLanes,
            exitStatus,
            suspendedCommitReason,
            null,
            completedRenderStartTime,
            completedRenderEndTime
          )
        );
        markRootSuspended(root2, lanes, spawnedLane, !didSkipSuspendedSiblings);
        return;
      }
    }
    commitRoot(
      root2,
      finishedWork,
      lanes,
      recoverableErrors,
      transitions,
      didIncludeRenderPhaseUpdate,
      spawnedLane,
      updatedLanes,
      suspendedRetryLanes
    );
  }
  function isRenderConsistentWithExternalStores(finishedWork) {
    for (var node = finishedWork; ; ) {
      var tag = node.tag;
      if ((0 === tag || 11 === tag || 15 === tag) && node.flags & 16384 && (tag = node.updateQueue, null !== tag && (tag = tag.stores, null !== tag)))
        for (var i = 0; i < tag.length; i++) {
          var check = tag[i], getSnapshot = check.getSnapshot;
          check = check.value;
          try {
            if (!objectIs(getSnapshot(), check)) return false;
          } catch (error) {
            return false;
          }
        }
      tag = node.child;
      if (node.subtreeFlags & 16384 && null !== tag)
        tag.return = node, node = tag;
      else {
        if (node === finishedWork) break;
        for (; null === node.sibling; ) {
          if (null === node.return || node.return === finishedWork) return true;
          node = node.return;
        }
        node.sibling.return = node.return;
        node = node.sibling;
      }
    }
    return true;
  }
  function markRootSuspended(root2, suspendedLanes, spawnedLane, didAttemptEntireTree) {
    suspendedLanes &= ~workInProgressRootPingedLanes;
    suspendedLanes &= ~workInProgressRootInterleavedUpdatedLanes;
    root2.suspendedLanes |= suspendedLanes;
    root2.pingedLanes &= ~suspendedLanes;
    didAttemptEntireTree && (root2.warmLanes |= suspendedLanes);
    didAttemptEntireTree = root2.expirationTimes;
    for (var lanes = suspendedLanes; 0 < lanes; ) {
      var index$6 = 31 - clz32(lanes), lane = 1 << index$6;
      didAttemptEntireTree[index$6] = -1;
      lanes &= ~lane;
    }
    0 !== spawnedLane && markSpawnedDeferredLane(root2, spawnedLane, suspendedLanes);
  }
  function flushSyncWork$1() {
    return 0 === (executionContext & 6) ? (flushSyncWorkAcrossRoots_impl(0), false) : true;
  }
  function resetWorkInProgressStack() {
    if (null !== workInProgress) {
      if (0 === workInProgressSuspendedReason)
        var interruptedWork = workInProgress.return;
      else
        interruptedWork = workInProgress, lastContextDependency = currentlyRenderingFiber$1 = null, resetHooksOnUnwind(interruptedWork), thenableState$1 = null, thenableIndexCounter$1 = 0, interruptedWork = workInProgress;
      for (; null !== interruptedWork; )
        unwindInterruptedWork(interruptedWork.alternate, interruptedWork), interruptedWork = interruptedWork.return;
      workInProgress = null;
    }
  }
  function prepareFreshStack(root2, lanes) {
    var timeoutHandle = root2.timeoutHandle;
    -1 !== timeoutHandle && (root2.timeoutHandle = -1, cancelTimeout(timeoutHandle));
    timeoutHandle = root2.cancelPendingCommit;
    null !== timeoutHandle && (root2.cancelPendingCommit = null, timeoutHandle());
    pendingEffectsLanes = 0;
    resetWorkInProgressStack();
    workInProgressRoot = root2;
    workInProgress = timeoutHandle = createWorkInProgress(root2.current, null);
    workInProgressRootRenderLanes = lanes;
    workInProgressSuspendedReason = 0;
    workInProgressThrownValue = null;
    workInProgressRootDidSkipSuspendedSiblings = false;
    workInProgressRootIsPrerendering = checkIfRootIsPrerendering(root2, lanes);
    workInProgressRootDidAttachPingListener = false;
    workInProgressSuspendedRetryLanes = workInProgressDeferredLane = workInProgressRootPingedLanes = workInProgressRootInterleavedUpdatedLanes = workInProgressRootSkippedLanes = workInProgressRootExitStatus = 0;
    workInProgressRootRecoverableErrors = workInProgressRootConcurrentErrors = null;
    workInProgressRootDidIncludeRecursiveRenderUpdate = false;
    0 !== (lanes & 8) && (lanes |= lanes & 32);
    var allEntangledLanes = root2.entangledLanes;
    if (0 !== allEntangledLanes)
      for (root2 = root2.entanglements, allEntangledLanes &= lanes; 0 < allEntangledLanes; ) {
        var index$4 = 31 - clz32(allEntangledLanes), lane = 1 << index$4;
        lanes |= root2[index$4];
        allEntangledLanes &= ~lane;
      }
    entangledRenderLanes = lanes;
    finishQueueingConcurrentUpdates();
    return timeoutHandle;
  }
  function handleThrow(root2, thrownValue) {
    currentlyRenderingFiber = null;
    ReactSharedInternals.H = ContextOnlyDispatcher;
    thrownValue === SuspenseException || thrownValue === SuspenseActionException ? (thrownValue = getSuspendedThenable(), workInProgressSuspendedReason = 3) : thrownValue === SuspenseyCommitException ? (thrownValue = getSuspendedThenable(), workInProgressSuspendedReason = 4) : workInProgressSuspendedReason = thrownValue === SelectiveHydrationException ? 8 : null !== thrownValue && "object" === typeof thrownValue && "function" === typeof thrownValue.then ? 6 : 1;
    workInProgressThrownValue = thrownValue;
    null === workInProgress && (workInProgressRootExitStatus = 1, logUncaughtError(
      root2,
      createCapturedValueAtFiber(thrownValue, root2.current)
    ));
  }
  function shouldRemainOnPreviousScreen() {
    var handler = suspenseHandlerStackCursor.current;
    return null === handler ? true : (workInProgressRootRenderLanes & 4194048) === workInProgressRootRenderLanes ? null === shellBoundary ? true : false : (workInProgressRootRenderLanes & 62914560) === workInProgressRootRenderLanes || 0 !== (workInProgressRootRenderLanes & 536870912) ? handler === shellBoundary : false;
  }
  function pushDispatcher() {
    var prevDispatcher = ReactSharedInternals.H;
    ReactSharedInternals.H = ContextOnlyDispatcher;
    return null === prevDispatcher ? ContextOnlyDispatcher : prevDispatcher;
  }
  function pushAsyncDispatcher() {
    var prevAsyncDispatcher = ReactSharedInternals.A;
    ReactSharedInternals.A = DefaultAsyncDispatcher;
    return prevAsyncDispatcher;
  }
  function renderDidSuspendDelayIfPossible() {
    workInProgressRootExitStatus = 4;
    workInProgressRootDidSkipSuspendedSiblings || (workInProgressRootRenderLanes & 4194048) !== workInProgressRootRenderLanes && null !== suspenseHandlerStackCursor.current || (workInProgressRootIsPrerendering = true);
    0 === (workInProgressRootSkippedLanes & 134217727) && 0 === (workInProgressRootInterleavedUpdatedLanes & 134217727) || null === workInProgressRoot || markRootSuspended(
      workInProgressRoot,
      workInProgressRootRenderLanes,
      workInProgressDeferredLane,
      false
    );
  }
  function renderRootSync(root2, lanes, shouldYieldForPrerendering) {
    var prevExecutionContext = executionContext;
    executionContext |= 2;
    var prevDispatcher = pushDispatcher(), prevAsyncDispatcher = pushAsyncDispatcher();
    if (workInProgressRoot !== root2 || workInProgressRootRenderLanes !== lanes)
      workInProgressTransitions = null, prepareFreshStack(root2, lanes);
    lanes = false;
    var exitStatus = workInProgressRootExitStatus;
    a: do
      try {
        if (0 !== workInProgressSuspendedReason && null !== workInProgress) {
          var unitOfWork = workInProgress, thrownValue = workInProgressThrownValue;
          switch (workInProgressSuspendedReason) {
            case 8:
              resetWorkInProgressStack();
              exitStatus = 6;
              break a;
            case 3:
            case 2:
            case 9:
            case 6:
              null === suspenseHandlerStackCursor.current && (lanes = true);
              var reason = workInProgressSuspendedReason;
              workInProgressSuspendedReason = 0;
              workInProgressThrownValue = null;
              throwAndUnwindWorkLoop(root2, unitOfWork, thrownValue, reason);
              if (shouldYieldForPrerendering && workInProgressRootIsPrerendering) {
                exitStatus = 0;
                break a;
              }
              break;
            default:
              reason = workInProgressSuspendedReason, workInProgressSuspendedReason = 0, workInProgressThrownValue = null, throwAndUnwindWorkLoop(root2, unitOfWork, thrownValue, reason);
          }
        }
        workLoopSync();
        exitStatus = workInProgressRootExitStatus;
        break;
      } catch (thrownValue$165) {
        handleThrow(root2, thrownValue$165);
      }
    while (1);
    lanes && root2.shellSuspendCounter++;
    lastContextDependency = currentlyRenderingFiber$1 = null;
    executionContext = prevExecutionContext;
    ReactSharedInternals.H = prevDispatcher;
    ReactSharedInternals.A = prevAsyncDispatcher;
    null === workInProgress && (workInProgressRoot = null, workInProgressRootRenderLanes = 0, finishQueueingConcurrentUpdates());
    return exitStatus;
  }
  function workLoopSync() {
    for (; null !== workInProgress; ) performUnitOfWork(workInProgress);
  }
  function renderRootConcurrent(root2, lanes) {
    var prevExecutionContext = executionContext;
    executionContext |= 2;
    var prevDispatcher = pushDispatcher(), prevAsyncDispatcher = pushAsyncDispatcher();
    workInProgressRoot !== root2 || workInProgressRootRenderLanes !== lanes ? (workInProgressTransitions = null, workInProgressRootRenderTargetTime = now() + 500, prepareFreshStack(root2, lanes)) : workInProgressRootIsPrerendering = checkIfRootIsPrerendering(
      root2,
      lanes
    );
    a: do
      try {
        if (0 !== workInProgressSuspendedReason && null !== workInProgress) {
          lanes = workInProgress;
          var thrownValue = workInProgressThrownValue;
          b: switch (workInProgressSuspendedReason) {
            case 1:
              workInProgressSuspendedReason = 0;
              workInProgressThrownValue = null;
              throwAndUnwindWorkLoop(root2, lanes, thrownValue, 1);
              break;
            case 2:
            case 9:
              if (isThenableResolved(thrownValue)) {
                workInProgressSuspendedReason = 0;
                workInProgressThrownValue = null;
                replaySuspendedUnitOfWork(lanes);
                break;
              }
              lanes = function() {
                2 !== workInProgressSuspendedReason && 9 !== workInProgressSuspendedReason || workInProgressRoot !== root2 || (workInProgressSuspendedReason = 7);
                ensureRootIsScheduled(root2);
              };
              thrownValue.then(lanes, lanes);
              break a;
            case 3:
              workInProgressSuspendedReason = 7;
              break a;
            case 4:
              workInProgressSuspendedReason = 5;
              break a;
            case 7:
              isThenableResolved(thrownValue) ? (workInProgressSuspendedReason = 0, workInProgressThrownValue = null, replaySuspendedUnitOfWork(lanes)) : (workInProgressSuspendedReason = 0, workInProgressThrownValue = null, throwAndUnwindWorkLoop(root2, lanes, thrownValue, 7));
              break;
            case 5:
              var resource = null;
              switch (workInProgress.tag) {
                case 26:
                  resource = workInProgress.memoizedState;
                case 5:
                case 27:
                  var hostFiber = workInProgress;
                  if (resource ? preloadResource(resource) : hostFiber.stateNode.complete) {
                    workInProgressSuspendedReason = 0;
                    workInProgressThrownValue = null;
                    var sibling = hostFiber.sibling;
                    if (null !== sibling) workInProgress = sibling;
                    else {
                      var returnFiber = hostFiber.return;
                      null !== returnFiber ? (workInProgress = returnFiber, completeUnitOfWork(returnFiber)) : workInProgress = null;
                    }
                    break b;
                  }
              }
              workInProgressSuspendedReason = 0;
              workInProgressThrownValue = null;
              throwAndUnwindWorkLoop(root2, lanes, thrownValue, 5);
              break;
            case 6:
              workInProgressSuspendedReason = 0;
              workInProgressThrownValue = null;
              throwAndUnwindWorkLoop(root2, lanes, thrownValue, 6);
              break;
            case 8:
              resetWorkInProgressStack();
              workInProgressRootExitStatus = 6;
              break a;
            default:
              throw Error(formatProdErrorMessage(462));
          }
        }
        workLoopConcurrentByScheduler();
        break;
      } catch (thrownValue$167) {
        handleThrow(root2, thrownValue$167);
      }
    while (1);
    lastContextDependency = currentlyRenderingFiber$1 = null;
    ReactSharedInternals.H = prevDispatcher;
    ReactSharedInternals.A = prevAsyncDispatcher;
    executionContext = prevExecutionContext;
    if (null !== workInProgress) return 0;
    workInProgressRoot = null;
    workInProgressRootRenderLanes = 0;
    finishQueueingConcurrentUpdates();
    return workInProgressRootExitStatus;
  }
  function workLoopConcurrentByScheduler() {
    for (; null !== workInProgress && !shouldYield(); )
      performUnitOfWork(workInProgress);
  }
  function performUnitOfWork(unitOfWork) {
    var next = beginWork(unitOfWork.alternate, unitOfWork, entangledRenderLanes);
    unitOfWork.memoizedProps = unitOfWork.pendingProps;
    null === next ? completeUnitOfWork(unitOfWork) : workInProgress = next;
  }
  function replaySuspendedUnitOfWork(unitOfWork) {
    var next = unitOfWork;
    var current = next.alternate;
    switch (next.tag) {
      case 15:
      case 0:
        next = replayFunctionComponent(
          current,
          next,
          next.pendingProps,
          next.type,
          void 0,
          workInProgressRootRenderLanes
        );
        break;
      case 11:
        next = replayFunctionComponent(
          current,
          next,
          next.pendingProps,
          next.type.render,
          next.ref,
          workInProgressRootRenderLanes
        );
        break;
      case 5:
        resetHooksOnUnwind(next);
      default:
        unwindInterruptedWork(current, next), next = workInProgress = resetWorkInProgress(next, entangledRenderLanes), next = beginWork(current, next, entangledRenderLanes);
    }
    unitOfWork.memoizedProps = unitOfWork.pendingProps;
    null === next ? completeUnitOfWork(unitOfWork) : workInProgress = next;
  }
  function throwAndUnwindWorkLoop(root2, unitOfWork, thrownValue, suspendedReason) {
    lastContextDependency = currentlyRenderingFiber$1 = null;
    resetHooksOnUnwind(unitOfWork);
    thenableState$1 = null;
    thenableIndexCounter$1 = 0;
    var returnFiber = unitOfWork.return;
    try {
      if (throwException(
        root2,
        returnFiber,
        unitOfWork,
        thrownValue,
        workInProgressRootRenderLanes
      )) {
        workInProgressRootExitStatus = 1;
        logUncaughtError(
          root2,
          createCapturedValueAtFiber(thrownValue, root2.current)
        );
        workInProgress = null;
        return;
      }
    } catch (error) {
      if (null !== returnFiber) throw workInProgress = returnFiber, error;
      workInProgressRootExitStatus = 1;
      logUncaughtError(
        root2,
        createCapturedValueAtFiber(thrownValue, root2.current)
      );
      workInProgress = null;
      return;
    }
    if (unitOfWork.flags & 32768) {
      if (isHydrating || 1 === suspendedReason) root2 = true;
      else if (workInProgressRootIsPrerendering || 0 !== (workInProgressRootRenderLanes & 536870912))
        root2 = false;
      else if (workInProgressRootDidSkipSuspendedSiblings = root2 = true, 2 === suspendedReason || 9 === suspendedReason || 3 === suspendedReason || 6 === suspendedReason)
        suspendedReason = suspenseHandlerStackCursor.current, null !== suspendedReason && 13 === suspendedReason.tag && (suspendedReason.flags |= 16384);
      unwindUnitOfWork(unitOfWork, root2);
    } else completeUnitOfWork(unitOfWork);
  }
  function completeUnitOfWork(unitOfWork) {
    var completedWork = unitOfWork;
    do {
      if (0 !== (completedWork.flags & 32768)) {
        unwindUnitOfWork(
          completedWork,
          workInProgressRootDidSkipSuspendedSiblings
        );
        return;
      }
      unitOfWork = completedWork.return;
      var next = completeWork(
        completedWork.alternate,
        completedWork,
        entangledRenderLanes
      );
      if (null !== next) {
        workInProgress = next;
        return;
      }
      completedWork = completedWork.sibling;
      if (null !== completedWork) {
        workInProgress = completedWork;
        return;
      }
      workInProgress = completedWork = unitOfWork;
    } while (null !== completedWork);
    0 === workInProgressRootExitStatus && (workInProgressRootExitStatus = 5);
  }
  function unwindUnitOfWork(unitOfWork, skipSiblings) {
    do {
      var next = unwindWork(unitOfWork.alternate, unitOfWork);
      if (null !== next) {
        next.flags &= 32767;
        workInProgress = next;
        return;
      }
      next = unitOfWork.return;
      null !== next && (next.flags |= 32768, next.subtreeFlags = 0, next.deletions = null);
      if (!skipSiblings && (unitOfWork = unitOfWork.sibling, null !== unitOfWork)) {
        workInProgress = unitOfWork;
        return;
      }
      workInProgress = unitOfWork = next;
    } while (null !== unitOfWork);
    workInProgressRootExitStatus = 6;
    workInProgress = null;
  }
  function commitRoot(root2, finishedWork, lanes, recoverableErrors, transitions, didIncludeRenderPhaseUpdate, spawnedLane, updatedLanes, suspendedRetryLanes) {
    root2.cancelPendingCommit = null;
    do
      flushPendingEffects();
    while (0 !== pendingEffectsStatus);
    if (0 !== (executionContext & 6)) throw Error(formatProdErrorMessage(327));
    if (null !== finishedWork) {
      if (finishedWork === root2.current) throw Error(formatProdErrorMessage(177));
      didIncludeRenderPhaseUpdate = finishedWork.lanes | finishedWork.childLanes;
      didIncludeRenderPhaseUpdate |= concurrentlyUpdatedLanes;
      markRootFinished(
        root2,
        lanes,
        didIncludeRenderPhaseUpdate,
        spawnedLane,
        updatedLanes,
        suspendedRetryLanes
      );
      root2 === workInProgressRoot && (workInProgress = workInProgressRoot = null, workInProgressRootRenderLanes = 0);
      pendingFinishedWork = finishedWork;
      pendingEffectsRoot = root2;
      pendingEffectsLanes = lanes;
      pendingEffectsRemainingLanes = didIncludeRenderPhaseUpdate;
      pendingPassiveTransitions = transitions;
      pendingRecoverableErrors = recoverableErrors;
      0 !== (finishedWork.subtreeFlags & 10256) || 0 !== (finishedWork.flags & 10256) ? (root2.callbackNode = null, root2.callbackPriority = 0, scheduleCallback$1(NormalPriority$1, function() {
        flushPassiveEffects();
        return null;
      })) : (root2.callbackNode = null, root2.callbackPriority = 0);
      recoverableErrors = 0 !== (finishedWork.flags & 13878);
      if (0 !== (finishedWork.subtreeFlags & 13878) || recoverableErrors) {
        recoverableErrors = ReactSharedInternals.T;
        ReactSharedInternals.T = null;
        transitions = ReactDOMSharedInternals.p;
        ReactDOMSharedInternals.p = 2;
        spawnedLane = executionContext;
        executionContext |= 4;
        try {
          commitBeforeMutationEffects(root2, finishedWork, lanes);
        } finally {
          executionContext = spawnedLane, ReactDOMSharedInternals.p = transitions, ReactSharedInternals.T = recoverableErrors;
        }
      }
      pendingEffectsStatus = 1;
      flushMutationEffects();
      flushLayoutEffects();
      flushSpawnedWork();
    }
  }
  function flushMutationEffects() {
    if (1 === pendingEffectsStatus) {
      pendingEffectsStatus = 0;
      var root2 = pendingEffectsRoot, finishedWork = pendingFinishedWork, rootMutationHasEffect = 0 !== (finishedWork.flags & 13878);
      if (0 !== (finishedWork.subtreeFlags & 13878) || rootMutationHasEffect) {
        rootMutationHasEffect = ReactSharedInternals.T;
        ReactSharedInternals.T = null;
        var previousPriority = ReactDOMSharedInternals.p;
        ReactDOMSharedInternals.p = 2;
        var prevExecutionContext = executionContext;
        executionContext |= 4;
        try {
          commitMutationEffectsOnFiber(finishedWork, root2);
          var priorSelectionInformation = selectionInformation, curFocusedElem = getActiveElementDeep(root2.containerInfo), priorFocusedElem = priorSelectionInformation.focusedElem, priorSelectionRange = priorSelectionInformation.selectionRange;
          if (curFocusedElem !== priorFocusedElem && priorFocusedElem && priorFocusedElem.ownerDocument && containsNode(
            priorFocusedElem.ownerDocument.documentElement,
            priorFocusedElem
          )) {
            if (null !== priorSelectionRange && hasSelectionCapabilities(priorFocusedElem)) {
              var start = priorSelectionRange.start, end = priorSelectionRange.end;
              void 0 === end && (end = start);
              if ("selectionStart" in priorFocusedElem)
                priorFocusedElem.selectionStart = start, priorFocusedElem.selectionEnd = Math.min(
                  end,
                  priorFocusedElem.value.length
                );
              else {
                var doc = priorFocusedElem.ownerDocument || document, win = doc && doc.defaultView || window;
                if (win.getSelection) {
                  var selection = win.getSelection(), length = priorFocusedElem.textContent.length, start$jscomp$0 = Math.min(priorSelectionRange.start, length), end$jscomp$0 = void 0 === priorSelectionRange.end ? start$jscomp$0 : Math.min(priorSelectionRange.end, length);
                  !selection.extend && start$jscomp$0 > end$jscomp$0 && (curFocusedElem = end$jscomp$0, end$jscomp$0 = start$jscomp$0, start$jscomp$0 = curFocusedElem);
                  var startMarker = getNodeForCharacterOffset(
                    priorFocusedElem,
                    start$jscomp$0
                  ), endMarker = getNodeForCharacterOffset(
                    priorFocusedElem,
                    end$jscomp$0
                  );
                  if (startMarker && endMarker && (1 !== selection.rangeCount || selection.anchorNode !== startMarker.node || selection.anchorOffset !== startMarker.offset || selection.focusNode !== endMarker.node || selection.focusOffset !== endMarker.offset)) {
                    var range = doc.createRange();
                    range.setStart(startMarker.node, startMarker.offset);
                    selection.removeAllRanges();
                    start$jscomp$0 > end$jscomp$0 ? (selection.addRange(range), selection.extend(endMarker.node, endMarker.offset)) : (range.setEnd(endMarker.node, endMarker.offset), selection.addRange(range));
                  }
                }
              }
            }
            doc = [];
            for (selection = priorFocusedElem; selection = selection.parentNode; )
              1 === selection.nodeType && doc.push({
                element: selection,
                left: selection.scrollLeft,
                top: selection.scrollTop
              });
            "function" === typeof priorFocusedElem.focus && priorFocusedElem.focus();
            for (priorFocusedElem = 0; priorFocusedElem < doc.length; priorFocusedElem++) {
              var info = doc[priorFocusedElem];
              info.element.scrollLeft = info.left;
              info.element.scrollTop = info.top;
            }
          }
          _enabled = !!eventsEnabled;
          selectionInformation = eventsEnabled = null;
        } finally {
          executionContext = prevExecutionContext, ReactDOMSharedInternals.p = previousPriority, ReactSharedInternals.T = rootMutationHasEffect;
        }
      }
      root2.current = finishedWork;
      pendingEffectsStatus = 2;
    }
  }
  function flushLayoutEffects() {
    if (2 === pendingEffectsStatus) {
      pendingEffectsStatus = 0;
      var root2 = pendingEffectsRoot, finishedWork = pendingFinishedWork, rootHasLayoutEffect = 0 !== (finishedWork.flags & 8772);
      if (0 !== (finishedWork.subtreeFlags & 8772) || rootHasLayoutEffect) {
        rootHasLayoutEffect = ReactSharedInternals.T;
        ReactSharedInternals.T = null;
        var previousPriority = ReactDOMSharedInternals.p;
        ReactDOMSharedInternals.p = 2;
        var prevExecutionContext = executionContext;
        executionContext |= 4;
        try {
          commitLayoutEffectOnFiber(root2, finishedWork.alternate, finishedWork);
        } finally {
          executionContext = prevExecutionContext, ReactDOMSharedInternals.p = previousPriority, ReactSharedInternals.T = rootHasLayoutEffect;
        }
      }
      pendingEffectsStatus = 3;
    }
  }
  function flushSpawnedWork() {
    if (4 === pendingEffectsStatus || 3 === pendingEffectsStatus) {
      pendingEffectsStatus = 0;
      requestPaint();
      var root2 = pendingEffectsRoot, finishedWork = pendingFinishedWork, lanes = pendingEffectsLanes, recoverableErrors = pendingRecoverableErrors;
      0 !== (finishedWork.subtreeFlags & 10256) || 0 !== (finishedWork.flags & 10256) ? pendingEffectsStatus = 5 : (pendingEffectsStatus = 0, pendingFinishedWork = pendingEffectsRoot = null, releaseRootPooledCache(root2, root2.pendingLanes));
      var remainingLanes = root2.pendingLanes;
      0 === remainingLanes && (legacyErrorBoundariesThatAlreadyFailed = null);
      lanesToEventPriority(lanes);
      finishedWork = finishedWork.stateNode;
      if (injectedHook && "function" === typeof injectedHook.onCommitFiberRoot)
        try {
          injectedHook.onCommitFiberRoot(
            rendererID,
            finishedWork,
            void 0,
            128 === (finishedWork.current.flags & 128)
          );
        } catch (err) {
        }
      if (null !== recoverableErrors) {
        finishedWork = ReactSharedInternals.T;
        remainingLanes = ReactDOMSharedInternals.p;
        ReactDOMSharedInternals.p = 2;
        ReactSharedInternals.T = null;
        try {
          for (var onRecoverableError = root2.onRecoverableError, i = 0; i < recoverableErrors.length; i++) {
            var recoverableError = recoverableErrors[i];
            onRecoverableError(recoverableError.value, {
              componentStack: recoverableError.stack
            });
          }
        } finally {
          ReactSharedInternals.T = finishedWork, ReactDOMSharedInternals.p = remainingLanes;
        }
      }
      0 !== (pendingEffectsLanes & 3) && flushPendingEffects();
      ensureRootIsScheduled(root2);
      remainingLanes = root2.pendingLanes;
      0 !== (lanes & 261930) && 0 !== (remainingLanes & 42) ? root2 === rootWithNestedUpdates ? nestedUpdateCount++ : (nestedUpdateCount = 0, rootWithNestedUpdates = root2) : nestedUpdateCount = 0;
      flushSyncWorkAcrossRoots_impl(0);
    }
  }
  function releaseRootPooledCache(root2, remainingLanes) {
    0 === (root2.pooledCacheLanes &= remainingLanes) && (remainingLanes = root2.pooledCache, null != remainingLanes && (root2.pooledCache = null, releaseCache(remainingLanes)));
  }
  function flushPendingEffects() {
    flushMutationEffects();
    flushLayoutEffects();
    flushSpawnedWork();
    return flushPassiveEffects();
  }
  function flushPassiveEffects() {
    if (5 !== pendingEffectsStatus) return false;
    var root2 = pendingEffectsRoot, remainingLanes = pendingEffectsRemainingLanes;
    pendingEffectsRemainingLanes = 0;
    var renderPriority = lanesToEventPriority(pendingEffectsLanes), prevTransition = ReactSharedInternals.T, previousPriority = ReactDOMSharedInternals.p;
    try {
      ReactDOMSharedInternals.p = 32 > renderPriority ? 32 : renderPriority;
      ReactSharedInternals.T = null;
      renderPriority = pendingPassiveTransitions;
      pendingPassiveTransitions = null;
      var root$jscomp$0 = pendingEffectsRoot, lanes = pendingEffectsLanes;
      pendingEffectsStatus = 0;
      pendingFinishedWork = pendingEffectsRoot = null;
      pendingEffectsLanes = 0;
      if (0 !== (executionContext & 6)) throw Error(formatProdErrorMessage(331));
      var prevExecutionContext = executionContext;
      executionContext |= 4;
      commitPassiveUnmountOnFiber(root$jscomp$0.current);
      commitPassiveMountOnFiber(
        root$jscomp$0,
        root$jscomp$0.current,
        lanes,
        renderPriority
      );
      executionContext = prevExecutionContext;
      flushSyncWorkAcrossRoots_impl(0, false);
      if (injectedHook && "function" === typeof injectedHook.onPostCommitFiberRoot)
        try {
          injectedHook.onPostCommitFiberRoot(rendererID, root$jscomp$0);
        } catch (err) {
        }
      return true;
    } finally {
      ReactDOMSharedInternals.p = previousPriority, ReactSharedInternals.T = prevTransition, releaseRootPooledCache(root2, remainingLanes);
    }
  }
  function captureCommitPhaseErrorOnRoot(rootFiber, sourceFiber, error) {
    sourceFiber = createCapturedValueAtFiber(error, sourceFiber);
    sourceFiber = createRootErrorUpdate(rootFiber.stateNode, sourceFiber, 2);
    rootFiber = enqueueUpdate(rootFiber, sourceFiber, 2);
    null !== rootFiber && (markRootUpdated$1(rootFiber, 2), ensureRootIsScheduled(rootFiber));
  }
  function captureCommitPhaseError(sourceFiber, nearestMountedAncestor, error) {
    if (3 === sourceFiber.tag)
      captureCommitPhaseErrorOnRoot(sourceFiber, sourceFiber, error);
    else
      for (; null !== nearestMountedAncestor; ) {
        if (3 === nearestMountedAncestor.tag) {
          captureCommitPhaseErrorOnRoot(
            nearestMountedAncestor,
            sourceFiber,
            error
          );
          break;
        } else if (1 === nearestMountedAncestor.tag) {
          var instance = nearestMountedAncestor.stateNode;
          if ("function" === typeof nearestMountedAncestor.type.getDerivedStateFromError || "function" === typeof instance.componentDidCatch && (null === legacyErrorBoundariesThatAlreadyFailed || !legacyErrorBoundariesThatAlreadyFailed.has(instance))) {
            sourceFiber = createCapturedValueAtFiber(error, sourceFiber);
            error = createClassErrorUpdate(2);
            instance = enqueueUpdate(nearestMountedAncestor, error, 2);
            null !== instance && (initializeClassErrorUpdate(
              error,
              instance,
              nearestMountedAncestor,
              sourceFiber
            ), markRootUpdated$1(instance, 2), ensureRootIsScheduled(instance));
            break;
          }
        }
        nearestMountedAncestor = nearestMountedAncestor.return;
      }
  }
  function attachPingListener(root2, wakeable, lanes) {
    var pingCache = root2.pingCache;
    if (null === pingCache) {
      pingCache = root2.pingCache = new PossiblyWeakMap();
      var threadIDs = /* @__PURE__ */ new Set();
      pingCache.set(wakeable, threadIDs);
    } else
      threadIDs = pingCache.get(wakeable), void 0 === threadIDs && (threadIDs = /* @__PURE__ */ new Set(), pingCache.set(wakeable, threadIDs));
    threadIDs.has(lanes) || (workInProgressRootDidAttachPingListener = true, threadIDs.add(lanes), root2 = pingSuspendedRoot.bind(null, root2, wakeable, lanes), wakeable.then(root2, root2));
  }
  function pingSuspendedRoot(root2, wakeable, pingedLanes) {
    var pingCache = root2.pingCache;
    null !== pingCache && pingCache.delete(wakeable);
    root2.pingedLanes |= root2.suspendedLanes & pingedLanes;
    root2.warmLanes &= ~pingedLanes;
    workInProgressRoot === root2 && (workInProgressRootRenderLanes & pingedLanes) === pingedLanes && (4 === workInProgressRootExitStatus || 3 === workInProgressRootExitStatus && (workInProgressRootRenderLanes & 62914560) === workInProgressRootRenderLanes && 300 > now() - globalMostRecentFallbackTime ? 0 === (executionContext & 2) && prepareFreshStack(root2, 0) : workInProgressRootPingedLanes |= pingedLanes, workInProgressSuspendedRetryLanes === workInProgressRootRenderLanes && (workInProgressSuspendedRetryLanes = 0));
    ensureRootIsScheduled(root2);
  }
  function retryTimedOutBoundary(boundaryFiber, retryLane) {
    0 === retryLane && (retryLane = claimNextRetryLane());
    boundaryFiber = enqueueConcurrentRenderForLane(boundaryFiber, retryLane);
    null !== boundaryFiber && (markRootUpdated$1(boundaryFiber, retryLane), ensureRootIsScheduled(boundaryFiber));
  }
  function retryDehydratedSuspenseBoundary(boundaryFiber) {
    var suspenseState = boundaryFiber.memoizedState, retryLane = 0;
    null !== suspenseState && (retryLane = suspenseState.retryLane);
    retryTimedOutBoundary(boundaryFiber, retryLane);
  }
  function resolveRetryWakeable(boundaryFiber, wakeable) {
    var retryLane = 0;
    switch (boundaryFiber.tag) {
      case 31:
      case 13:
        var retryCache = boundaryFiber.stateNode;
        var suspenseState = boundaryFiber.memoizedState;
        null !== suspenseState && (retryLane = suspenseState.retryLane);
        break;
      case 19:
        retryCache = boundaryFiber.stateNode;
        break;
      case 22:
        retryCache = boundaryFiber.stateNode._retryCache;
        break;
      default:
        throw Error(formatProdErrorMessage(314));
    }
    null !== retryCache && retryCache.delete(wakeable);
    retryTimedOutBoundary(boundaryFiber, retryLane);
  }
  function scheduleCallback$1(priorityLevel, callback) {
    return scheduleCallback$3(priorityLevel, callback);
  }
  var firstScheduledRoot = null, lastScheduledRoot = null, didScheduleMicrotask = false, mightHavePendingSyncWork = false, isFlushingWork = false, currentEventTransitionLane = 0;
  function ensureRootIsScheduled(root2) {
    root2 !== lastScheduledRoot && null === root2.next && (null === lastScheduledRoot ? firstScheduledRoot = lastScheduledRoot = root2 : lastScheduledRoot = lastScheduledRoot.next = root2);
    mightHavePendingSyncWork = true;
    didScheduleMicrotask || (didScheduleMicrotask = true, scheduleImmediateRootScheduleTask());
  }
  function flushSyncWorkAcrossRoots_impl(syncTransitionLanes, onlyLegacy) {
    if (!isFlushingWork && mightHavePendingSyncWork) {
      isFlushingWork = true;
      do {
        var didPerformSomeWork = false;
        for (var root$170 = firstScheduledRoot; null !== root$170; ) {
          if (0 !== syncTransitionLanes) {
            var pendingLanes = root$170.pendingLanes;
            if (0 === pendingLanes) var JSCompiler_inline_result = 0;
            else {
              var suspendedLanes = root$170.suspendedLanes, pingedLanes = root$170.pingedLanes;
              JSCompiler_inline_result = (1 << 31 - clz32(42 | syncTransitionLanes) + 1) - 1;
              JSCompiler_inline_result &= pendingLanes & ~(suspendedLanes & ~pingedLanes);
              JSCompiler_inline_result = JSCompiler_inline_result & 201326741 ? JSCompiler_inline_result & 201326741 | 1 : JSCompiler_inline_result ? JSCompiler_inline_result | 2 : 0;
            }
            0 !== JSCompiler_inline_result && (didPerformSomeWork = true, performSyncWorkOnRoot(root$170, JSCompiler_inline_result));
          } else
            JSCompiler_inline_result = workInProgressRootRenderLanes, JSCompiler_inline_result = getNextLanes(
              root$170,
              root$170 === workInProgressRoot ? JSCompiler_inline_result : 0,
              null !== root$170.cancelPendingCommit || -1 !== root$170.timeoutHandle
            ), 0 === (JSCompiler_inline_result & 3) || checkIfRootIsPrerendering(root$170, JSCompiler_inline_result) || (didPerformSomeWork = true, performSyncWorkOnRoot(root$170, JSCompiler_inline_result));
          root$170 = root$170.next;
        }
      } while (didPerformSomeWork);
      isFlushingWork = false;
    }
  }
  function processRootScheduleInImmediateTask() {
    processRootScheduleInMicrotask();
  }
  function processRootScheduleInMicrotask() {
    mightHavePendingSyncWork = didScheduleMicrotask = false;
    var syncTransitionLanes = 0;
    0 !== currentEventTransitionLane && shouldAttemptEagerTransition() && (syncTransitionLanes = currentEventTransitionLane);
    for (var currentTime = now(), prev = null, root2 = firstScheduledRoot; null !== root2; ) {
      var next = root2.next, nextLanes = scheduleTaskForRootDuringMicrotask(root2, currentTime);
      if (0 === nextLanes)
        root2.next = null, null === prev ? firstScheduledRoot = next : prev.next = next, null === next && (lastScheduledRoot = prev);
      else if (prev = root2, 0 !== syncTransitionLanes || 0 !== (nextLanes & 3))
        mightHavePendingSyncWork = true;
      root2 = next;
    }
    0 !== pendingEffectsStatus && 5 !== pendingEffectsStatus || flushSyncWorkAcrossRoots_impl(syncTransitionLanes);
    0 !== currentEventTransitionLane && (currentEventTransitionLane = 0);
  }
  function scheduleTaskForRootDuringMicrotask(root2, currentTime) {
    for (var suspendedLanes = root2.suspendedLanes, pingedLanes = root2.pingedLanes, expirationTimes = root2.expirationTimes, lanes = root2.pendingLanes & -62914561; 0 < lanes; ) {
      var index$5 = 31 - clz32(lanes), lane = 1 << index$5, expirationTime = expirationTimes[index$5];
      if (-1 === expirationTime) {
        if (0 === (lane & suspendedLanes) || 0 !== (lane & pingedLanes))
          expirationTimes[index$5] = computeExpirationTime(lane, currentTime);
      } else expirationTime <= currentTime && (root2.expiredLanes |= lane);
      lanes &= ~lane;
    }
    currentTime = workInProgressRoot;
    suspendedLanes = workInProgressRootRenderLanes;
    suspendedLanes = getNextLanes(
      root2,
      root2 === currentTime ? suspendedLanes : 0,
      null !== root2.cancelPendingCommit || -1 !== root2.timeoutHandle
    );
    pingedLanes = root2.callbackNode;
    if (0 === suspendedLanes || root2 === currentTime && (2 === workInProgressSuspendedReason || 9 === workInProgressSuspendedReason) || null !== root2.cancelPendingCommit)
      return null !== pingedLanes && null !== pingedLanes && cancelCallback$1(pingedLanes), root2.callbackNode = null, root2.callbackPriority = 0;
    if (0 === (suspendedLanes & 3) || checkIfRootIsPrerendering(root2, suspendedLanes)) {
      currentTime = suspendedLanes & -suspendedLanes;
      if (currentTime === root2.callbackPriority) return currentTime;
      null !== pingedLanes && cancelCallback$1(pingedLanes);
      switch (lanesToEventPriority(suspendedLanes)) {
        case 2:
        case 8:
          suspendedLanes = UserBlockingPriority;
          break;
        case 32:
          suspendedLanes = NormalPriority$1;
          break;
        case 268435456:
          suspendedLanes = IdlePriority;
          break;
        default:
          suspendedLanes = NormalPriority$1;
      }
      pingedLanes = performWorkOnRootViaSchedulerTask.bind(null, root2);
      suspendedLanes = scheduleCallback$3(suspendedLanes, pingedLanes);
      root2.callbackPriority = currentTime;
      root2.callbackNode = suspendedLanes;
      return currentTime;
    }
    null !== pingedLanes && null !== pingedLanes && cancelCallback$1(pingedLanes);
    root2.callbackPriority = 2;
    root2.callbackNode = null;
    return 2;
  }
  function performWorkOnRootViaSchedulerTask(root2, didTimeout) {
    if (0 !== pendingEffectsStatus && 5 !== pendingEffectsStatus)
      return root2.callbackNode = null, root2.callbackPriority = 0, null;
    var originalCallbackNode = root2.callbackNode;
    if (flushPendingEffects() && root2.callbackNode !== originalCallbackNode)
      return null;
    var workInProgressRootRenderLanes$jscomp$0 = workInProgressRootRenderLanes;
    workInProgressRootRenderLanes$jscomp$0 = getNextLanes(
      root2,
      root2 === workInProgressRoot ? workInProgressRootRenderLanes$jscomp$0 : 0,
      null !== root2.cancelPendingCommit || -1 !== root2.timeoutHandle
    );
    if (0 === workInProgressRootRenderLanes$jscomp$0) return null;
    performWorkOnRoot(root2, workInProgressRootRenderLanes$jscomp$0, didTimeout);
    scheduleTaskForRootDuringMicrotask(root2, now());
    return null != root2.callbackNode && root2.callbackNode === originalCallbackNode ? performWorkOnRootViaSchedulerTask.bind(null, root2) : null;
  }
  function performSyncWorkOnRoot(root2, lanes) {
    if (flushPendingEffects()) return null;
    performWorkOnRoot(root2, lanes, true);
  }
  function scheduleImmediateRootScheduleTask() {
    scheduleMicrotask(function() {
      0 !== (executionContext & 6) ? scheduleCallback$3(
        ImmediatePriority,
        processRootScheduleInImmediateTask
      ) : processRootScheduleInMicrotask();
    });
  }
  function requestTransitionLane() {
    if (0 === currentEventTransitionLane) {
      var actionScopeLane = currentEntangledLane;
      0 === actionScopeLane && (actionScopeLane = nextTransitionUpdateLane, nextTransitionUpdateLane <<= 1, 0 === (nextTransitionUpdateLane & 261888) && (nextTransitionUpdateLane = 256));
      currentEventTransitionLane = actionScopeLane;
    }
    return currentEventTransitionLane;
  }
  function coerceFormActionProp(actionProp) {
    return null == actionProp || "symbol" === typeof actionProp || "boolean" === typeof actionProp ? null : "function" === typeof actionProp ? actionProp : sanitizeURL("" + actionProp);
  }
  function createFormDataWithSubmitter(form, submitter) {
    var temp = submitter.ownerDocument.createElement("input");
    temp.name = submitter.name;
    temp.value = submitter.value;
    form.id && temp.setAttribute("form", form.id);
    submitter.parentNode.insertBefore(temp, submitter);
    form = new FormData(form);
    temp.parentNode.removeChild(temp);
    return form;
  }
  function extractEvents$1(dispatchQueue, domEventName, maybeTargetInst, nativeEvent, nativeEventTarget) {
    if ("submit" === domEventName && maybeTargetInst && maybeTargetInst.stateNode === nativeEventTarget) {
      var action = coerceFormActionProp(
        (nativeEventTarget[internalPropsKey] || null).action
      ), submitter = nativeEvent.submitter;
      submitter && (domEventName = (domEventName = submitter[internalPropsKey] || null) ? coerceFormActionProp(domEventName.formAction) : submitter.getAttribute("formAction"), null !== domEventName && (action = domEventName, submitter = null));
      var event = new SyntheticEvent(
        "action",
        "action",
        null,
        nativeEvent,
        nativeEventTarget
      );
      dispatchQueue.push({
        event,
        listeners: [
          {
            instance: null,
            listener: function() {
              if (nativeEvent.defaultPrevented) {
                if (0 !== currentEventTransitionLane) {
                  var formData = submitter ? createFormDataWithSubmitter(nativeEventTarget, submitter) : new FormData(nativeEventTarget);
                  startHostTransition(
                    maybeTargetInst,
                    {
                      pending: true,
                      data: formData,
                      method: nativeEventTarget.method,
                      action
                    },
                    null,
                    formData
                  );
                }
              } else
                "function" === typeof action && (event.preventDefault(), formData = submitter ? createFormDataWithSubmitter(nativeEventTarget, submitter) : new FormData(nativeEventTarget), startHostTransition(
                  maybeTargetInst,
                  {
                    pending: true,
                    data: formData,
                    method: nativeEventTarget.method,
                    action
                  },
                  action,
                  formData
                ));
            },
            currentTarget: nativeEventTarget
          }
        ]
      });
    }
  }
  for (var i$jscomp$inline_1577 = 0; i$jscomp$inline_1577 < simpleEventPluginEvents.length; i$jscomp$inline_1577++) {
    var eventName$jscomp$inline_1578 = simpleEventPluginEvents[i$jscomp$inline_1577], domEventName$jscomp$inline_1579 = eventName$jscomp$inline_1578.toLowerCase(), capitalizedEvent$jscomp$inline_1580 = eventName$jscomp$inline_1578[0].toUpperCase() + eventName$jscomp$inline_1578.slice(1);
    registerSimpleEvent(
      domEventName$jscomp$inline_1579,
      "on" + capitalizedEvent$jscomp$inline_1580
    );
  }
  registerSimpleEvent(ANIMATION_END, "onAnimationEnd");
  registerSimpleEvent(ANIMATION_ITERATION, "onAnimationIteration");
  registerSimpleEvent(ANIMATION_START, "onAnimationStart");
  registerSimpleEvent("dblclick", "onDoubleClick");
  registerSimpleEvent("focusin", "onFocus");
  registerSimpleEvent("focusout", "onBlur");
  registerSimpleEvent(TRANSITION_RUN, "onTransitionRun");
  registerSimpleEvent(TRANSITION_START, "onTransitionStart");
  registerSimpleEvent(TRANSITION_CANCEL, "onTransitionCancel");
  registerSimpleEvent(TRANSITION_END, "onTransitionEnd");
  registerDirectEvent("onMouseEnter", ["mouseout", "mouseover"]);
  registerDirectEvent("onMouseLeave", ["mouseout", "mouseover"]);
  registerDirectEvent("onPointerEnter", ["pointerout", "pointerover"]);
  registerDirectEvent("onPointerLeave", ["pointerout", "pointerover"]);
  registerTwoPhaseEvent(
    "onChange",
    "change click focusin focusout input keydown keyup selectionchange".split(" ")
  );
  registerTwoPhaseEvent(
    "onSelect",
    "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
      " "
    )
  );
  registerTwoPhaseEvent("onBeforeInput", [
    "compositionend",
    "keypress",
    "textInput",
    "paste"
  ]);
  registerTwoPhaseEvent(
    "onCompositionEnd",
    "compositionend focusout keydown keypress keyup mousedown".split(" ")
  );
  registerTwoPhaseEvent(
    "onCompositionStart",
    "compositionstart focusout keydown keypress keyup mousedown".split(" ")
  );
  registerTwoPhaseEvent(
    "onCompositionUpdate",
    "compositionupdate focusout keydown keypress keyup mousedown".split(" ")
  );
  var mediaEventTypes = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
    " "
  ), nonDelegatedEvents = new Set(
    "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(mediaEventTypes)
  );
  function processDispatchQueue(dispatchQueue, eventSystemFlags) {
    eventSystemFlags = 0 !== (eventSystemFlags & 4);
    for (var i = 0; i < dispatchQueue.length; i++) {
      var _dispatchQueue$i = dispatchQueue[i], event = _dispatchQueue$i.event;
      _dispatchQueue$i = _dispatchQueue$i.listeners;
      a: {
        var previousInstance = void 0;
        if (eventSystemFlags)
          for (var i$jscomp$0 = _dispatchQueue$i.length - 1; 0 <= i$jscomp$0; i$jscomp$0--) {
            var _dispatchListeners$i = _dispatchQueue$i[i$jscomp$0], instance = _dispatchListeners$i.instance, currentTarget = _dispatchListeners$i.currentTarget;
            _dispatchListeners$i = _dispatchListeners$i.listener;
            if (instance !== previousInstance && event.isPropagationStopped())
              break a;
            previousInstance = _dispatchListeners$i;
            event.currentTarget = currentTarget;
            try {
              previousInstance(event);
            } catch (error) {
              reportGlobalError(error);
            }
            event.currentTarget = null;
            previousInstance = instance;
          }
        else
          for (i$jscomp$0 = 0; i$jscomp$0 < _dispatchQueue$i.length; i$jscomp$0++) {
            _dispatchListeners$i = _dispatchQueue$i[i$jscomp$0];
            instance = _dispatchListeners$i.instance;
            currentTarget = _dispatchListeners$i.currentTarget;
            _dispatchListeners$i = _dispatchListeners$i.listener;
            if (instance !== previousInstance && event.isPropagationStopped())
              break a;
            previousInstance = _dispatchListeners$i;
            event.currentTarget = currentTarget;
            try {
              previousInstance(event);
            } catch (error) {
              reportGlobalError(error);
            }
            event.currentTarget = null;
            previousInstance = instance;
          }
      }
    }
  }
  function listenToNonDelegatedEvent(domEventName, targetElement) {
    var JSCompiler_inline_result = targetElement[internalEventHandlersKey];
    void 0 === JSCompiler_inline_result && (JSCompiler_inline_result = targetElement[internalEventHandlersKey] = /* @__PURE__ */ new Set());
    var listenerSetKey = domEventName + "__bubble";
    JSCompiler_inline_result.has(listenerSetKey) || (addTrappedEventListener(targetElement, domEventName, 2, false), JSCompiler_inline_result.add(listenerSetKey));
  }
  function listenToNativeEvent(domEventName, isCapturePhaseListener, target) {
    var eventSystemFlags = 0;
    isCapturePhaseListener && (eventSystemFlags |= 4);
    addTrappedEventListener(
      target,
      domEventName,
      eventSystemFlags,
      isCapturePhaseListener
    );
  }
  var listeningMarker = "_reactListening" + Math.random().toString(36).slice(2);
  function listenToAllSupportedEvents(rootContainerElement) {
    if (!rootContainerElement[listeningMarker]) {
      rootContainerElement[listeningMarker] = true;
      allNativeEvents.forEach(function(domEventName) {
        "selectionchange" !== domEventName && (nonDelegatedEvents.has(domEventName) || listenToNativeEvent(domEventName, false, rootContainerElement), listenToNativeEvent(domEventName, true, rootContainerElement));
      });
      var ownerDocument = 9 === rootContainerElement.nodeType ? rootContainerElement : rootContainerElement.ownerDocument;
      null === ownerDocument || ownerDocument[listeningMarker] || (ownerDocument[listeningMarker] = true, listenToNativeEvent("selectionchange", false, ownerDocument));
    }
  }
  function addTrappedEventListener(targetContainer, domEventName, eventSystemFlags, isCapturePhaseListener) {
    switch (getEventPriority(domEventName)) {
      case 2:
        var listenerWrapper = dispatchDiscreteEvent;
        break;
      case 8:
        listenerWrapper = dispatchContinuousEvent;
        break;
      default:
        listenerWrapper = dispatchEvent;
    }
    eventSystemFlags = listenerWrapper.bind(
      null,
      domEventName,
      eventSystemFlags,
      targetContainer
    );
    listenerWrapper = void 0;
    !passiveBrowserEventsSupported || "touchstart" !== domEventName && "touchmove" !== domEventName && "wheel" !== domEventName || (listenerWrapper = true);
    isCapturePhaseListener ? void 0 !== listenerWrapper ? targetContainer.addEventListener(domEventName, eventSystemFlags, {
      capture: true,
      passive: listenerWrapper
    }) : targetContainer.addEventListener(domEventName, eventSystemFlags, true) : void 0 !== listenerWrapper ? targetContainer.addEventListener(domEventName, eventSystemFlags, {
      passive: listenerWrapper
    }) : targetContainer.addEventListener(domEventName, eventSystemFlags, false);
  }
  function dispatchEventForPluginEventSystem(domEventName, eventSystemFlags, nativeEvent, targetInst$jscomp$0, targetContainer) {
    var ancestorInst = targetInst$jscomp$0;
    if (0 === (eventSystemFlags & 1) && 0 === (eventSystemFlags & 2) && null !== targetInst$jscomp$0)
      a: for (; ; ) {
        if (null === targetInst$jscomp$0) return;
        var nodeTag = targetInst$jscomp$0.tag;
        if (3 === nodeTag || 4 === nodeTag) {
          var container = targetInst$jscomp$0.stateNode.containerInfo;
          if (container === targetContainer) break;
          if (4 === nodeTag)
            for (nodeTag = targetInst$jscomp$0.return; null !== nodeTag; ) {
              var grandTag = nodeTag.tag;
              if ((3 === grandTag || 4 === grandTag) && nodeTag.stateNode.containerInfo === targetContainer)
                return;
              nodeTag = nodeTag.return;
            }
          for (; null !== container; ) {
            nodeTag = getClosestInstanceFromNode(container);
            if (null === nodeTag) return;
            grandTag = nodeTag.tag;
            if (5 === grandTag || 6 === grandTag || 26 === grandTag || 27 === grandTag) {
              targetInst$jscomp$0 = ancestorInst = nodeTag;
              continue a;
            }
            container = container.parentNode;
          }
        }
        targetInst$jscomp$0 = targetInst$jscomp$0.return;
      }
    batchedUpdates$1(function() {
      var targetInst = ancestorInst, nativeEventTarget = getEventTarget(nativeEvent), dispatchQueue = [];
      a: {
        var reactName = topLevelEventsToReactNames.get(domEventName);
        if (void 0 !== reactName) {
          var SyntheticEventCtor = SyntheticEvent, reactEventType = domEventName;
          switch (domEventName) {
            case "keypress":
              if (0 === getEventCharCode(nativeEvent)) break a;
            case "keydown":
            case "keyup":
              SyntheticEventCtor = SyntheticKeyboardEvent;
              break;
            case "focusin":
              reactEventType = "focus";
              SyntheticEventCtor = SyntheticFocusEvent;
              break;
            case "focusout":
              reactEventType = "blur";
              SyntheticEventCtor = SyntheticFocusEvent;
              break;
            case "beforeblur":
            case "afterblur":
              SyntheticEventCtor = SyntheticFocusEvent;
              break;
            case "click":
              if (2 === nativeEvent.button) break a;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              SyntheticEventCtor = SyntheticMouseEvent;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              SyntheticEventCtor = SyntheticDragEvent;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              SyntheticEventCtor = SyntheticTouchEvent;
              break;
            case ANIMATION_END:
            case ANIMATION_ITERATION:
            case ANIMATION_START:
              SyntheticEventCtor = SyntheticAnimationEvent;
              break;
            case TRANSITION_END:
              SyntheticEventCtor = SyntheticTransitionEvent;
              break;
            case "scroll":
            case "scrollend":
              SyntheticEventCtor = SyntheticUIEvent;
              break;
            case "wheel":
              SyntheticEventCtor = SyntheticWheelEvent;
              break;
            case "copy":
            case "cut":
            case "paste":
              SyntheticEventCtor = SyntheticClipboardEvent;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              SyntheticEventCtor = SyntheticPointerEvent;
              break;
            case "toggle":
            case "beforetoggle":
              SyntheticEventCtor = SyntheticToggleEvent;
          }
          var inCapturePhase = 0 !== (eventSystemFlags & 4), accumulateTargetOnly = !inCapturePhase && ("scroll" === domEventName || "scrollend" === domEventName), reactEventName = inCapturePhase ? null !== reactName ? reactName + "Capture" : null : reactName;
          inCapturePhase = [];
          for (var instance = targetInst, lastHostComponent; null !== instance; ) {
            var _instance = instance;
            lastHostComponent = _instance.stateNode;
            _instance = _instance.tag;
            5 !== _instance && 26 !== _instance && 27 !== _instance || null === lastHostComponent || null === reactEventName || (_instance = getListener(instance, reactEventName), null != _instance && inCapturePhase.push(
              createDispatchListener(instance, _instance, lastHostComponent)
            ));
            if (accumulateTargetOnly) break;
            instance = instance.return;
          }
          0 < inCapturePhase.length && (reactName = new SyntheticEventCtor(
            reactName,
            reactEventType,
            null,
            nativeEvent,
            nativeEventTarget
          ), dispatchQueue.push({ event: reactName, listeners: inCapturePhase }));
        }
      }
      if (0 === (eventSystemFlags & 7)) {
        a: {
          reactName = "mouseover" === domEventName || "pointerover" === domEventName;
          SyntheticEventCtor = "mouseout" === domEventName || "pointerout" === domEventName;
          if (reactName && nativeEvent !== currentReplayingEvent && (reactEventType = nativeEvent.relatedTarget || nativeEvent.fromElement) && (getClosestInstanceFromNode(reactEventType) || reactEventType[internalContainerInstanceKey]))
            break a;
          if (SyntheticEventCtor || reactName) {
            reactName = nativeEventTarget.window === nativeEventTarget ? nativeEventTarget : (reactName = nativeEventTarget.ownerDocument) ? reactName.defaultView || reactName.parentWindow : window;
            if (SyntheticEventCtor) {
              if (reactEventType = nativeEvent.relatedTarget || nativeEvent.toElement, SyntheticEventCtor = targetInst, reactEventType = reactEventType ? getClosestInstanceFromNode(reactEventType) : null, null !== reactEventType && (accumulateTargetOnly = getNearestMountedFiber(reactEventType), inCapturePhase = reactEventType.tag, reactEventType !== accumulateTargetOnly || 5 !== inCapturePhase && 27 !== inCapturePhase && 6 !== inCapturePhase))
                reactEventType = null;
            } else SyntheticEventCtor = null, reactEventType = targetInst;
            if (SyntheticEventCtor !== reactEventType) {
              inCapturePhase = SyntheticMouseEvent;
              _instance = "onMouseLeave";
              reactEventName = "onMouseEnter";
              instance = "mouse";
              if ("pointerout" === domEventName || "pointerover" === domEventName)
                inCapturePhase = SyntheticPointerEvent, _instance = "onPointerLeave", reactEventName = "onPointerEnter", instance = "pointer";
              accumulateTargetOnly = null == SyntheticEventCtor ? reactName : getNodeFromInstance(SyntheticEventCtor);
              lastHostComponent = null == reactEventType ? reactName : getNodeFromInstance(reactEventType);
              reactName = new inCapturePhase(
                _instance,
                instance + "leave",
                SyntheticEventCtor,
                nativeEvent,
                nativeEventTarget
              );
              reactName.target = accumulateTargetOnly;
              reactName.relatedTarget = lastHostComponent;
              _instance = null;
              getClosestInstanceFromNode(nativeEventTarget) === targetInst && (inCapturePhase = new inCapturePhase(
                reactEventName,
                instance + "enter",
                reactEventType,
                nativeEvent,
                nativeEventTarget
              ), inCapturePhase.target = lastHostComponent, inCapturePhase.relatedTarget = accumulateTargetOnly, _instance = inCapturePhase);
              accumulateTargetOnly = _instance;
              if (SyntheticEventCtor && reactEventType)
                b: {
                  inCapturePhase = getParent;
                  reactEventName = SyntheticEventCtor;
                  instance = reactEventType;
                  lastHostComponent = 0;
                  for (_instance = reactEventName; _instance; _instance = inCapturePhase(_instance))
                    lastHostComponent++;
                  _instance = 0;
                  for (var tempB = instance; tempB; tempB = inCapturePhase(tempB))
                    _instance++;
                  for (; 0 < lastHostComponent - _instance; )
                    reactEventName = inCapturePhase(reactEventName), lastHostComponent--;
                  for (; 0 < _instance - lastHostComponent; )
                    instance = inCapturePhase(instance), _instance--;
                  for (; lastHostComponent--; ) {
                    if (reactEventName === instance || null !== instance && reactEventName === instance.alternate) {
                      inCapturePhase = reactEventName;
                      break b;
                    }
                    reactEventName = inCapturePhase(reactEventName);
                    instance = inCapturePhase(instance);
                  }
                  inCapturePhase = null;
                }
              else inCapturePhase = null;
              null !== SyntheticEventCtor && accumulateEnterLeaveListenersForEvent(
                dispatchQueue,
                reactName,
                SyntheticEventCtor,
                inCapturePhase,
                false
              );
              null !== reactEventType && null !== accumulateTargetOnly && accumulateEnterLeaveListenersForEvent(
                dispatchQueue,
                accumulateTargetOnly,
                reactEventType,
                inCapturePhase,
                true
              );
            }
          }
        }
        a: {
          reactName = targetInst ? getNodeFromInstance(targetInst) : window;
          SyntheticEventCtor = reactName.nodeName && reactName.nodeName.toLowerCase();
          if ("select" === SyntheticEventCtor || "input" === SyntheticEventCtor && "file" === reactName.type)
            var getTargetInstFunc = getTargetInstForChangeEvent;
          else if (isTextInputElement(reactName))
            if (isInputEventSupported)
              getTargetInstFunc = getTargetInstForInputOrChangeEvent;
            else {
              getTargetInstFunc = getTargetInstForInputEventPolyfill;
              var handleEventFunc = handleEventsForInputEventPolyfill;
            }
          else
            SyntheticEventCtor = reactName.nodeName, !SyntheticEventCtor || "input" !== SyntheticEventCtor.toLowerCase() || "checkbox" !== reactName.type && "radio" !== reactName.type ? targetInst && isCustomElement(targetInst.elementType) && (getTargetInstFunc = getTargetInstForChangeEvent) : getTargetInstFunc = getTargetInstForClickEvent;
          if (getTargetInstFunc && (getTargetInstFunc = getTargetInstFunc(domEventName, targetInst))) {
            createAndAccumulateChangeEvent(
              dispatchQueue,
              getTargetInstFunc,
              nativeEvent,
              nativeEventTarget
            );
            break a;
          }
          handleEventFunc && handleEventFunc(domEventName, reactName, targetInst);
          "focusout" === domEventName && targetInst && "number" === reactName.type && null != targetInst.memoizedProps.value && setDefaultValue(reactName, "number", reactName.value);
        }
        handleEventFunc = targetInst ? getNodeFromInstance(targetInst) : window;
        switch (domEventName) {
          case "focusin":
            if (isTextInputElement(handleEventFunc) || "true" === handleEventFunc.contentEditable)
              activeElement = handleEventFunc, activeElementInst = targetInst, lastSelection = null;
            break;
          case "focusout":
            lastSelection = activeElementInst = activeElement = null;
            break;
          case "mousedown":
            mouseDown = true;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            mouseDown = false;
            constructSelectEvent(dispatchQueue, nativeEvent, nativeEventTarget);
            break;
          case "selectionchange":
            if (skipSelectionChangeEvent) break;
          case "keydown":
          case "keyup":
            constructSelectEvent(dispatchQueue, nativeEvent, nativeEventTarget);
        }
        var fallbackData;
        if (canUseCompositionEvent)
          b: {
            switch (domEventName) {
              case "compositionstart":
                var eventType = "onCompositionStart";
                break b;
              case "compositionend":
                eventType = "onCompositionEnd";
                break b;
              case "compositionupdate":
                eventType = "onCompositionUpdate";
                break b;
            }
            eventType = void 0;
          }
        else
          isComposing ? isFallbackCompositionEnd(domEventName, nativeEvent) && (eventType = "onCompositionEnd") : "keydown" === domEventName && 229 === nativeEvent.keyCode && (eventType = "onCompositionStart");
        eventType && (useFallbackCompositionData && "ko" !== nativeEvent.locale && (isComposing || "onCompositionStart" !== eventType ? "onCompositionEnd" === eventType && isComposing && (fallbackData = getData()) : (root = nativeEventTarget, startText = "value" in root ? root.value : root.textContent, isComposing = true)), handleEventFunc = accumulateTwoPhaseListeners(targetInst, eventType), 0 < handleEventFunc.length && (eventType = new SyntheticCompositionEvent(
          eventType,
          domEventName,
          null,
          nativeEvent,
          nativeEventTarget
        ), dispatchQueue.push({ event: eventType, listeners: handleEventFunc }), fallbackData ? eventType.data = fallbackData : (fallbackData = getDataFromCustomEvent(nativeEvent), null !== fallbackData && (eventType.data = fallbackData))));
        if (fallbackData = canUseTextInputEvent ? getNativeBeforeInputChars(domEventName, nativeEvent) : getFallbackBeforeInputChars(domEventName, nativeEvent))
          eventType = accumulateTwoPhaseListeners(targetInst, "onBeforeInput"), 0 < eventType.length && (handleEventFunc = new SyntheticCompositionEvent(
            "onBeforeInput",
            "beforeinput",
            null,
            nativeEvent,
            nativeEventTarget
          ), dispatchQueue.push({
            event: handleEventFunc,
            listeners: eventType
          }), handleEventFunc.data = fallbackData);
        extractEvents$1(
          dispatchQueue,
          domEventName,
          targetInst,
          nativeEvent,
          nativeEventTarget
        );
      }
      processDispatchQueue(dispatchQueue, eventSystemFlags);
    });
  }
  function createDispatchListener(instance, listener, currentTarget) {
    return {
      instance,
      listener,
      currentTarget
    };
  }
  function accumulateTwoPhaseListeners(targetFiber, reactName) {
    for (var captureName = reactName + "Capture", listeners = []; null !== targetFiber; ) {
      var _instance2 = targetFiber, stateNode = _instance2.stateNode;
      _instance2 = _instance2.tag;
      5 !== _instance2 && 26 !== _instance2 && 27 !== _instance2 || null === stateNode || (_instance2 = getListener(targetFiber, captureName), null != _instance2 && listeners.unshift(
        createDispatchListener(targetFiber, _instance2, stateNode)
      ), _instance2 = getListener(targetFiber, reactName), null != _instance2 && listeners.push(
        createDispatchListener(targetFiber, _instance2, stateNode)
      ));
      if (3 === targetFiber.tag) return listeners;
      targetFiber = targetFiber.return;
    }
    return [];
  }
  function getParent(inst) {
    if (null === inst) return null;
    do
      inst = inst.return;
    while (inst && 5 !== inst.tag && 27 !== inst.tag);
    return inst ? inst : null;
  }
  function accumulateEnterLeaveListenersForEvent(dispatchQueue, event, target, common, inCapturePhase) {
    for (var registrationName = event._reactName, listeners = []; null !== target && target !== common; ) {
      var _instance3 = target, alternate = _instance3.alternate, stateNode = _instance3.stateNode;
      _instance3 = _instance3.tag;
      if (null !== alternate && alternate === common) break;
      5 !== _instance3 && 26 !== _instance3 && 27 !== _instance3 || null === stateNode || (alternate = stateNode, inCapturePhase ? (stateNode = getListener(target, registrationName), null != stateNode && listeners.unshift(
        createDispatchListener(target, stateNode, alternate)
      )) : inCapturePhase || (stateNode = getListener(target, registrationName), null != stateNode && listeners.push(
        createDispatchListener(target, stateNode, alternate)
      )));
      target = target.return;
    }
    0 !== listeners.length && dispatchQueue.push({ event, listeners });
  }
  var NORMALIZE_NEWLINES_REGEX = /\r\n?/g, NORMALIZE_NULL_AND_REPLACEMENT_REGEX = /\u0000|\uFFFD/g;
  function normalizeMarkupForTextOrAttribute(markup) {
    return ("string" === typeof markup ? markup : "" + markup).replace(NORMALIZE_NEWLINES_REGEX, "\n").replace(NORMALIZE_NULL_AND_REPLACEMENT_REGEX, "");
  }
  function checkForUnmatchedText(serverText, clientText) {
    clientText = normalizeMarkupForTextOrAttribute(clientText);
    return normalizeMarkupForTextOrAttribute(serverText) === clientText ? true : false;
  }
  function setProp(domElement, tag, key, value, props, prevValue) {
    switch (key) {
      case "children":
        "string" === typeof value ? "body" === tag || "textarea" === tag && "" === value || setTextContent(domElement, value) : ("number" === typeof value || "bigint" === typeof value) && "body" !== tag && setTextContent(domElement, "" + value);
        break;
      case "className":
        setValueForKnownAttribute(domElement, "class", value);
        break;
      case "tabIndex":
        setValueForKnownAttribute(domElement, "tabindex", value);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        setValueForKnownAttribute(domElement, key, value);
        break;
      case "style":
        setValueForStyles(domElement, value, prevValue);
        break;
      case "data":
        if ("object" !== tag) {
          setValueForKnownAttribute(domElement, "data", value);
          break;
        }
      case "src":
      case "href":
        if ("" === value && ("a" !== tag || "href" !== key)) {
          domElement.removeAttribute(key);
          break;
        }
        if (null == value || "function" === typeof value || "symbol" === typeof value || "boolean" === typeof value) {
          domElement.removeAttribute(key);
          break;
        }
        value = sanitizeURL("" + value);
        domElement.setAttribute(key, value);
        break;
      case "action":
      case "formAction":
        if ("function" === typeof value) {
          domElement.setAttribute(
            key,
            "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')"
          );
          break;
        } else
          "function" === typeof prevValue && ("formAction" === key ? ("input" !== tag && setProp(domElement, tag, "name", props.name, props, null), setProp(
            domElement,
            tag,
            "formEncType",
            props.formEncType,
            props,
            null
          ), setProp(
            domElement,
            tag,
            "formMethod",
            props.formMethod,
            props,
            null
          ), setProp(
            domElement,
            tag,
            "formTarget",
            props.formTarget,
            props,
            null
          )) : (setProp(domElement, tag, "encType", props.encType, props, null), setProp(domElement, tag, "method", props.method, props, null), setProp(domElement, tag, "target", props.target, props, null)));
        if (null == value || "symbol" === typeof value || "boolean" === typeof value) {
          domElement.removeAttribute(key);
          break;
        }
        value = sanitizeURL("" + value);
        domElement.setAttribute(key, value);
        break;
      case "onClick":
        null != value && (domElement.onclick = noop$1);
        break;
      case "onScroll":
        null != value && listenToNonDelegatedEvent("scroll", domElement);
        break;
      case "onScrollEnd":
        null != value && listenToNonDelegatedEvent("scrollend", domElement);
        break;
      case "dangerouslySetInnerHTML":
        if (null != value) {
          if ("object" !== typeof value || !("__html" in value))
            throw Error(formatProdErrorMessage(61));
          key = value.__html;
          if (null != key) {
            if (null != props.children) throw Error(formatProdErrorMessage(60));
            domElement.innerHTML = key;
          }
        }
        break;
      case "multiple":
        domElement.multiple = value && "function" !== typeof value && "symbol" !== typeof value;
        break;
      case "muted":
        domElement.muted = value && "function" !== typeof value && "symbol" !== typeof value;
        break;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "defaultValue":
      case "defaultChecked":
      case "innerHTML":
      case "ref":
        break;
      case "autoFocus":
        break;
      case "xlinkHref":
        if (null == value || "function" === typeof value || "boolean" === typeof value || "symbol" === typeof value) {
          domElement.removeAttribute("xlink:href");
          break;
        }
        key = sanitizeURL("" + value);
        domElement.setAttributeNS(
          "http://www.w3.org/1999/xlink",
          "xlink:href",
          key
        );
        break;
      case "contentEditable":
      case "spellCheck":
      case "draggable":
      case "value":
      case "autoReverse":
      case "externalResourcesRequired":
      case "focusable":
      case "preserveAlpha":
        null != value && "function" !== typeof value && "symbol" !== typeof value ? domElement.setAttribute(key, "" + value) : domElement.removeAttribute(key);
        break;
      case "inert":
      case "allowFullScreen":
      case "async":
      case "autoPlay":
      case "controls":
      case "default":
      case "defer":
      case "disabled":
      case "disablePictureInPicture":
      case "disableRemotePlayback":
      case "formNoValidate":
      case "hidden":
      case "loop":
      case "noModule":
      case "noValidate":
      case "open":
      case "playsInline":
      case "readOnly":
      case "required":
      case "reversed":
      case "scoped":
      case "seamless":
      case "itemScope":
        value && "function" !== typeof value && "symbol" !== typeof value ? domElement.setAttribute(key, "") : domElement.removeAttribute(key);
        break;
      case "capture":
      case "download":
        true === value ? domElement.setAttribute(key, "") : false !== value && null != value && "function" !== typeof value && "symbol" !== typeof value ? domElement.setAttribute(key, value) : domElement.removeAttribute(key);
        break;
      case "cols":
      case "rows":
      case "size":
      case "span":
        null != value && "function" !== typeof value && "symbol" !== typeof value && !isNaN(value) && 1 <= value ? domElement.setAttribute(key, value) : domElement.removeAttribute(key);
        break;
      case "rowSpan":
      case "start":
        null == value || "function" === typeof value || "symbol" === typeof value || isNaN(value) ? domElement.removeAttribute(key) : domElement.setAttribute(key, value);
        break;
      case "popover":
        listenToNonDelegatedEvent("beforetoggle", domElement);
        listenToNonDelegatedEvent("toggle", domElement);
        setValueForAttribute(domElement, "popover", value);
        break;
      case "xlinkActuate":
        setValueForNamespacedAttribute(
          domElement,
          "http://www.w3.org/1999/xlink",
          "xlink:actuate",
          value
        );
        break;
      case "xlinkArcrole":
        setValueForNamespacedAttribute(
          domElement,
          "http://www.w3.org/1999/xlink",
          "xlink:arcrole",
          value
        );
        break;
      case "xlinkRole":
        setValueForNamespacedAttribute(
          domElement,
          "http://www.w3.org/1999/xlink",
          "xlink:role",
          value
        );
        break;
      case "xlinkShow":
        setValueForNamespacedAttribute(
          domElement,
          "http://www.w3.org/1999/xlink",
          "xlink:show",
          value
        );
        break;
      case "xlinkTitle":
        setValueForNamespacedAttribute(
          domElement,
          "http://www.w3.org/1999/xlink",
          "xlink:title",
          value
        );
        break;
      case "xlinkType":
        setValueForNamespacedAttribute(
          domElement,
          "http://www.w3.org/1999/xlink",
          "xlink:type",
          value
        );
        break;
      case "xmlBase":
        setValueForNamespacedAttribute(
          domElement,
          "http://www.w3.org/XML/1998/namespace",
          "xml:base",
          value
        );
        break;
      case "xmlLang":
        setValueForNamespacedAttribute(
          domElement,
          "http://www.w3.org/XML/1998/namespace",
          "xml:lang",
          value
        );
        break;
      case "xmlSpace":
        setValueForNamespacedAttribute(
          domElement,
          "http://www.w3.org/XML/1998/namespace",
          "xml:space",
          value
        );
        break;
      case "is":
        setValueForAttribute(domElement, "is", value);
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        if (!(2 < key.length) || "o" !== key[0] && "O" !== key[0] || "n" !== key[1] && "N" !== key[1])
          key = aliases.get(key) || key, setValueForAttribute(domElement, key, value);
    }
  }
  function setPropOnCustomElement(domElement, tag, key, value, props, prevValue) {
    switch (key) {
      case "style":
        setValueForStyles(domElement, value, prevValue);
        break;
      case "dangerouslySetInnerHTML":
        if (null != value) {
          if ("object" !== typeof value || !("__html" in value))
            throw Error(formatProdErrorMessage(61));
          key = value.__html;
          if (null != key) {
            if (null != props.children) throw Error(formatProdErrorMessage(60));
            domElement.innerHTML = key;
          }
        }
        break;
      case "children":
        "string" === typeof value ? setTextContent(domElement, value) : ("number" === typeof value || "bigint" === typeof value) && setTextContent(domElement, "" + value);
        break;
      case "onScroll":
        null != value && listenToNonDelegatedEvent("scroll", domElement);
        break;
      case "onScrollEnd":
        null != value && listenToNonDelegatedEvent("scrollend", domElement);
        break;
      case "onClick":
        null != value && (domElement.onclick = noop$1);
        break;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "innerHTML":
      case "ref":
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        if (!registrationNameDependencies.hasOwnProperty(key))
          a: {
            if ("o" === key[0] && "n" === key[1] && (props = key.endsWith("Capture"), tag = key.slice(2, props ? key.length - 7 : void 0), prevValue = domElement[internalPropsKey] || null, prevValue = null != prevValue ? prevValue[key] : null, "function" === typeof prevValue && domElement.removeEventListener(tag, prevValue, props), "function" === typeof value)) {
              "function" !== typeof prevValue && null !== prevValue && (key in domElement ? domElement[key] = null : domElement.hasAttribute(key) && domElement.removeAttribute(key));
              domElement.addEventListener(tag, value, props);
              break a;
            }
            key in domElement ? domElement[key] = value : true === value ? domElement.setAttribute(key, "") : setValueForAttribute(domElement, key, value);
          }
    }
  }
  function setInitialProperties(domElement, tag, props) {
    switch (tag) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "img":
        listenToNonDelegatedEvent("error", domElement);
        listenToNonDelegatedEvent("load", domElement);
        var hasSrc = false, hasSrcSet = false, propKey;
        for (propKey in props)
          if (props.hasOwnProperty(propKey)) {
            var propValue = props[propKey];
            if (null != propValue)
              switch (propKey) {
                case "src":
                  hasSrc = true;
                  break;
                case "srcSet":
                  hasSrcSet = true;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(formatProdErrorMessage(137, tag));
                default:
                  setProp(domElement, tag, propKey, propValue, props, null);
              }
          }
        hasSrcSet && setProp(domElement, tag, "srcSet", props.srcSet, props, null);
        hasSrc && setProp(domElement, tag, "src", props.src, props, null);
        return;
      case "input":
        listenToNonDelegatedEvent("invalid", domElement);
        var defaultValue = propKey = propValue = hasSrcSet = null, checked = null, defaultChecked = null;
        for (hasSrc in props)
          if (props.hasOwnProperty(hasSrc)) {
            var propValue$184 = props[hasSrc];
            if (null != propValue$184)
              switch (hasSrc) {
                case "name":
                  hasSrcSet = propValue$184;
                  break;
                case "type":
                  propValue = propValue$184;
                  break;
                case "checked":
                  checked = propValue$184;
                  break;
                case "defaultChecked":
                  defaultChecked = propValue$184;
                  break;
                case "value":
                  propKey = propValue$184;
                  break;
                case "defaultValue":
                  defaultValue = propValue$184;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (null != propValue$184)
                    throw Error(formatProdErrorMessage(137, tag));
                  break;
                default:
                  setProp(domElement, tag, hasSrc, propValue$184, props, null);
              }
          }
        initInput(
          domElement,
          propKey,
          defaultValue,
          checked,
          defaultChecked,
          propValue,
          hasSrcSet,
          false
        );
        return;
      case "select":
        listenToNonDelegatedEvent("invalid", domElement);
        hasSrc = propValue = propKey = null;
        for (hasSrcSet in props)
          if (props.hasOwnProperty(hasSrcSet) && (defaultValue = props[hasSrcSet], null != defaultValue))
            switch (hasSrcSet) {
              case "value":
                propKey = defaultValue;
                break;
              case "defaultValue":
                propValue = defaultValue;
                break;
              case "multiple":
                hasSrc = defaultValue;
              default:
                setProp(domElement, tag, hasSrcSet, defaultValue, props, null);
            }
        tag = propKey;
        props = propValue;
        domElement.multiple = !!hasSrc;
        null != tag ? updateOptions(domElement, !!hasSrc, tag, false) : null != props && updateOptions(domElement, !!hasSrc, props, true);
        return;
      case "textarea":
        listenToNonDelegatedEvent("invalid", domElement);
        propKey = hasSrcSet = hasSrc = null;
        for (propValue in props)
          if (props.hasOwnProperty(propValue) && (defaultValue = props[propValue], null != defaultValue))
            switch (propValue) {
              case "value":
                hasSrc = defaultValue;
                break;
              case "defaultValue":
                hasSrcSet = defaultValue;
                break;
              case "children":
                propKey = defaultValue;
                break;
              case "dangerouslySetInnerHTML":
                if (null != defaultValue) throw Error(formatProdErrorMessage(91));
                break;
              default:
                setProp(domElement, tag, propValue, defaultValue, props, null);
            }
        initTextarea(domElement, hasSrc, hasSrcSet, propKey);
        return;
      case "option":
        for (checked in props)
          if (props.hasOwnProperty(checked) && (hasSrc = props[checked], null != hasSrc))
            switch (checked) {
              case "selected":
                domElement.selected = hasSrc && "function" !== typeof hasSrc && "symbol" !== typeof hasSrc;
                break;
              default:
                setProp(domElement, tag, checked, hasSrc, props, null);
            }
        return;
      case "dialog":
        listenToNonDelegatedEvent("beforetoggle", domElement);
        listenToNonDelegatedEvent("toggle", domElement);
        listenToNonDelegatedEvent("cancel", domElement);
        listenToNonDelegatedEvent("close", domElement);
        break;
      case "iframe":
      case "object":
        listenToNonDelegatedEvent("load", domElement);
        break;
      case "video":
      case "audio":
        for (hasSrc = 0; hasSrc < mediaEventTypes.length; hasSrc++)
          listenToNonDelegatedEvent(mediaEventTypes[hasSrc], domElement);
        break;
      case "image":
        listenToNonDelegatedEvent("error", domElement);
        listenToNonDelegatedEvent("load", domElement);
        break;
      case "details":
        listenToNonDelegatedEvent("toggle", domElement);
        break;
      case "embed":
      case "source":
      case "link":
        listenToNonDelegatedEvent("error", domElement), listenToNonDelegatedEvent("load", domElement);
      case "area":
      case "base":
      case "br":
      case "col":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "track":
      case "wbr":
      case "menuitem":
        for (defaultChecked in props)
          if (props.hasOwnProperty(defaultChecked) && (hasSrc = props[defaultChecked], null != hasSrc))
            switch (defaultChecked) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(formatProdErrorMessage(137, tag));
              default:
                setProp(domElement, tag, defaultChecked, hasSrc, props, null);
            }
        return;
      default:
        if (isCustomElement(tag)) {
          for (propValue$184 in props)
            props.hasOwnProperty(propValue$184) && (hasSrc = props[propValue$184], void 0 !== hasSrc && setPropOnCustomElement(
              domElement,
              tag,
              propValue$184,
              hasSrc,
              props,
              void 0
            ));
          return;
        }
    }
    for (defaultValue in props)
      props.hasOwnProperty(defaultValue) && (hasSrc = props[defaultValue], null != hasSrc && setProp(domElement, tag, defaultValue, hasSrc, props, null));
  }
  function updateProperties(domElement, tag, lastProps, nextProps) {
    switch (tag) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "input":
        var name = null, type = null, value = null, defaultValue = null, lastDefaultValue = null, checked = null, defaultChecked = null;
        for (propKey in lastProps) {
          var lastProp = lastProps[propKey];
          if (lastProps.hasOwnProperty(propKey) && null != lastProp)
            switch (propKey) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                lastDefaultValue = lastProp;
              default:
                nextProps.hasOwnProperty(propKey) || setProp(domElement, tag, propKey, null, nextProps, lastProp);
            }
        }
        for (var propKey$201 in nextProps) {
          var propKey = nextProps[propKey$201];
          lastProp = lastProps[propKey$201];
          if (nextProps.hasOwnProperty(propKey$201) && (null != propKey || null != lastProp))
            switch (propKey$201) {
              case "type":
                type = propKey;
                break;
              case "name":
                name = propKey;
                break;
              case "checked":
                checked = propKey;
                break;
              case "defaultChecked":
                defaultChecked = propKey;
                break;
              case "value":
                value = propKey;
                break;
              case "defaultValue":
                defaultValue = propKey;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (null != propKey)
                  throw Error(formatProdErrorMessage(137, tag));
                break;
              default:
                propKey !== lastProp && setProp(
                  domElement,
                  tag,
                  propKey$201,
                  propKey,
                  nextProps,
                  lastProp
                );
            }
        }
        updateInput(
          domElement,
          value,
          defaultValue,
          lastDefaultValue,
          checked,
          defaultChecked,
          type,
          name
        );
        return;
      case "select":
        propKey = value = defaultValue = propKey$201 = null;
        for (type in lastProps)
          if (lastDefaultValue = lastProps[type], lastProps.hasOwnProperty(type) && null != lastDefaultValue)
            switch (type) {
              case "value":
                break;
              case "multiple":
                propKey = lastDefaultValue;
              default:
                nextProps.hasOwnProperty(type) || setProp(
                  domElement,
                  tag,
                  type,
                  null,
                  nextProps,
                  lastDefaultValue
                );
            }
        for (name in nextProps)
          if (type = nextProps[name], lastDefaultValue = lastProps[name], nextProps.hasOwnProperty(name) && (null != type || null != lastDefaultValue))
            switch (name) {
              case "value":
                propKey$201 = type;
                break;
              case "defaultValue":
                defaultValue = type;
                break;
              case "multiple":
                value = type;
              default:
                type !== lastDefaultValue && setProp(
                  domElement,
                  tag,
                  name,
                  type,
                  nextProps,
                  lastDefaultValue
                );
            }
        tag = defaultValue;
        lastProps = value;
        nextProps = propKey;
        null != propKey$201 ? updateOptions(domElement, !!lastProps, propKey$201, false) : !!nextProps !== !!lastProps && (null != tag ? updateOptions(domElement, !!lastProps, tag, true) : updateOptions(domElement, !!lastProps, lastProps ? [] : "", false));
        return;
      case "textarea":
        propKey = propKey$201 = null;
        for (defaultValue in lastProps)
          if (name = lastProps[defaultValue], lastProps.hasOwnProperty(defaultValue) && null != name && !nextProps.hasOwnProperty(defaultValue))
            switch (defaultValue) {
              case "value":
                break;
              case "children":
                break;
              default:
                setProp(domElement, tag, defaultValue, null, nextProps, name);
            }
        for (value in nextProps)
          if (name = nextProps[value], type = lastProps[value], nextProps.hasOwnProperty(value) && (null != name || null != type))
            switch (value) {
              case "value":
                propKey$201 = name;
                break;
              case "defaultValue":
                propKey = name;
                break;
              case "children":
                break;
              case "dangerouslySetInnerHTML":
                if (null != name) throw Error(formatProdErrorMessage(91));
                break;
              default:
                name !== type && setProp(domElement, tag, value, name, nextProps, type);
            }
        updateTextarea(domElement, propKey$201, propKey);
        return;
      case "option":
        for (var propKey$217 in lastProps)
          if (propKey$201 = lastProps[propKey$217], lastProps.hasOwnProperty(propKey$217) && null != propKey$201 && !nextProps.hasOwnProperty(propKey$217))
            switch (propKey$217) {
              case "selected":
                domElement.selected = false;
                break;
              default:
                setProp(
                  domElement,
                  tag,
                  propKey$217,
                  null,
                  nextProps,
                  propKey$201
                );
            }
        for (lastDefaultValue in nextProps)
          if (propKey$201 = nextProps[lastDefaultValue], propKey = lastProps[lastDefaultValue], nextProps.hasOwnProperty(lastDefaultValue) && propKey$201 !== propKey && (null != propKey$201 || null != propKey))
            switch (lastDefaultValue) {
              case "selected":
                domElement.selected = propKey$201 && "function" !== typeof propKey$201 && "symbol" !== typeof propKey$201;
                break;
              default:
                setProp(
                  domElement,
                  tag,
                  lastDefaultValue,
                  propKey$201,
                  nextProps,
                  propKey
                );
            }
        return;
      case "img":
      case "link":
      case "area":
      case "base":
      case "br":
      case "col":
      case "embed":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "source":
      case "track":
      case "wbr":
      case "menuitem":
        for (var propKey$222 in lastProps)
          propKey$201 = lastProps[propKey$222], lastProps.hasOwnProperty(propKey$222) && null != propKey$201 && !nextProps.hasOwnProperty(propKey$222) && setProp(domElement, tag, propKey$222, null, nextProps, propKey$201);
        for (checked in nextProps)
          if (propKey$201 = nextProps[checked], propKey = lastProps[checked], nextProps.hasOwnProperty(checked) && propKey$201 !== propKey && (null != propKey$201 || null != propKey))
            switch (checked) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (null != propKey$201)
                  throw Error(formatProdErrorMessage(137, tag));
                break;
              default:
                setProp(
                  domElement,
                  tag,
                  checked,
                  propKey$201,
                  nextProps,
                  propKey
                );
            }
        return;
      default:
        if (isCustomElement(tag)) {
          for (var propKey$227 in lastProps)
            propKey$201 = lastProps[propKey$227], lastProps.hasOwnProperty(propKey$227) && void 0 !== propKey$201 && !nextProps.hasOwnProperty(propKey$227) && setPropOnCustomElement(
              domElement,
              tag,
              propKey$227,
              void 0,
              nextProps,
              propKey$201
            );
          for (defaultChecked in nextProps)
            propKey$201 = nextProps[defaultChecked], propKey = lastProps[defaultChecked], !nextProps.hasOwnProperty(defaultChecked) || propKey$201 === propKey || void 0 === propKey$201 && void 0 === propKey || setPropOnCustomElement(
              domElement,
              tag,
              defaultChecked,
              propKey$201,
              nextProps,
              propKey
            );
          return;
        }
    }
    for (var propKey$232 in lastProps)
      propKey$201 = lastProps[propKey$232], lastProps.hasOwnProperty(propKey$232) && null != propKey$201 && !nextProps.hasOwnProperty(propKey$232) && setProp(domElement, tag, propKey$232, null, nextProps, propKey$201);
    for (lastProp in nextProps)
      propKey$201 = nextProps[lastProp], propKey = lastProps[lastProp], !nextProps.hasOwnProperty(lastProp) || propKey$201 === propKey || null == propKey$201 && null == propKey || setProp(domElement, tag, lastProp, propKey$201, nextProps, propKey);
  }
  function isLikelyStaticResource(initiatorType) {
    switch (initiatorType) {
      case "css":
      case "script":
      case "font":
      case "img":
      case "image":
      case "input":
      case "link":
        return true;
      default:
        return false;
    }
  }
  function estimateBandwidth() {
    if ("function" === typeof performance.getEntriesByType) {
      for (var count = 0, bits = 0, resourceEntries = performance.getEntriesByType("resource"), i = 0; i < resourceEntries.length; i++) {
        var entry = resourceEntries[i], transferSize = entry.transferSize, initiatorType = entry.initiatorType, duration = entry.duration;
        if (transferSize && duration && isLikelyStaticResource(initiatorType)) {
          initiatorType = 0;
          duration = entry.responseEnd;
          for (i += 1; i < resourceEntries.length; i++) {
            var overlapEntry = resourceEntries[i], overlapStartTime = overlapEntry.startTime;
            if (overlapStartTime > duration) break;
            var overlapTransferSize = overlapEntry.transferSize, overlapInitiatorType = overlapEntry.initiatorType;
            overlapTransferSize && isLikelyStaticResource(overlapInitiatorType) && (overlapEntry = overlapEntry.responseEnd, initiatorType += overlapTransferSize * (overlapEntry < duration ? 1 : (duration - overlapStartTime) / (overlapEntry - overlapStartTime)));
          }
          --i;
          bits += 8 * (transferSize + initiatorType) / (entry.duration / 1e3);
          count++;
          if (10 < count) break;
        }
      }
      if (0 < count) return bits / count / 1e6;
    }
    return navigator.connection && (count = navigator.connection.downlink, "number" === typeof count) ? count : 5;
  }
  var eventsEnabled = null, selectionInformation = null;
  function getOwnerDocumentFromRootContainer(rootContainerElement) {
    return 9 === rootContainerElement.nodeType ? rootContainerElement : rootContainerElement.ownerDocument;
  }
  function getOwnHostContext(namespaceURI) {
    switch (namespaceURI) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function getChildHostContextProd(parentNamespace, type) {
    if (0 === parentNamespace)
      switch (type) {
        case "svg":
          return 1;
        case "math":
          return 2;
        default:
          return 0;
      }
    return 1 === parentNamespace && "foreignObject" === type ? 0 : parentNamespace;
  }
  function shouldSetTextContent(type, props) {
    return "textarea" === type || "noscript" === type || "string" === typeof props.children || "number" === typeof props.children || "bigint" === typeof props.children || "object" === typeof props.dangerouslySetInnerHTML && null !== props.dangerouslySetInnerHTML && null != props.dangerouslySetInnerHTML.__html;
  }
  var currentPopstateTransitionEvent = null;
  function shouldAttemptEagerTransition() {
    var event = window.event;
    if (event && "popstate" === event.type) {
      if (event === currentPopstateTransitionEvent) return false;
      currentPopstateTransitionEvent = event;
      return true;
    }
    currentPopstateTransitionEvent = null;
    return false;
  }
  var scheduleTimeout = "function" === typeof setTimeout ? setTimeout : void 0, cancelTimeout = "function" === typeof clearTimeout ? clearTimeout : void 0, localPromise = "function" === typeof Promise ? Promise : void 0, scheduleMicrotask = "function" === typeof queueMicrotask ? queueMicrotask : "undefined" !== typeof localPromise ? function(callback) {
    return localPromise.resolve(null).then(callback).catch(handleErrorInNextTick);
  } : scheduleTimeout;
  function handleErrorInNextTick(error) {
    setTimeout(function() {
      throw error;
    });
  }
  function isSingletonScope(type) {
    return "head" === type;
  }
  function clearHydrationBoundary(parentInstance, hydrationInstance) {
    var node = hydrationInstance, depth = 0;
    do {
      var nextNode = node.nextSibling;
      parentInstance.removeChild(node);
      if (nextNode && 8 === nextNode.nodeType)
        if (node = nextNode.data, "/$" === node || "/&" === node) {
          if (0 === depth) {
            parentInstance.removeChild(nextNode);
            retryIfBlockedOn(hydrationInstance);
            return;
          }
          depth--;
        } else if ("$" === node || "$?" === node || "$~" === node || "$!" === node || "&" === node)
          depth++;
        else if ("html" === node)
          releaseSingletonInstance(parentInstance.ownerDocument.documentElement);
        else if ("head" === node) {
          node = parentInstance.ownerDocument.head;
          releaseSingletonInstance(node);
          for (var node$jscomp$0 = node.firstChild; node$jscomp$0; ) {
            var nextNode$jscomp$0 = node$jscomp$0.nextSibling, nodeName = node$jscomp$0.nodeName;
            node$jscomp$0[internalHoistableMarker] || "SCRIPT" === nodeName || "STYLE" === nodeName || "LINK" === nodeName && "stylesheet" === node$jscomp$0.rel.toLowerCase() || node.removeChild(node$jscomp$0);
            node$jscomp$0 = nextNode$jscomp$0;
          }
        } else
          "body" === node && releaseSingletonInstance(parentInstance.ownerDocument.body);
      node = nextNode;
    } while (node);
    retryIfBlockedOn(hydrationInstance);
  }
  function hideOrUnhideDehydratedBoundary(suspenseInstance, isHidden) {
    var node = suspenseInstance;
    suspenseInstance = 0;
    do {
      var nextNode = node.nextSibling;
      1 === node.nodeType ? isHidden ? (node._stashedDisplay = node.style.display, node.style.display = "none") : (node.style.display = node._stashedDisplay || "", "" === node.getAttribute("style") && node.removeAttribute("style")) : 3 === node.nodeType && (isHidden ? (node._stashedText = node.nodeValue, node.nodeValue = "") : node.nodeValue = node._stashedText || "");
      if (nextNode && 8 === nextNode.nodeType)
        if (node = nextNode.data, "/$" === node)
          if (0 === suspenseInstance) break;
          else suspenseInstance--;
        else
          "$" !== node && "$?" !== node && "$~" !== node && "$!" !== node || suspenseInstance++;
      node = nextNode;
    } while (node);
  }
  function clearContainerSparingly(container) {
    var nextNode = container.firstChild;
    nextNode && 10 === nextNode.nodeType && (nextNode = nextNode.nextSibling);
    for (; nextNode; ) {
      var node = nextNode;
      nextNode = nextNode.nextSibling;
      switch (node.nodeName) {
        case "HTML":
        case "HEAD":
        case "BODY":
          clearContainerSparingly(node);
          detachDeletedInstance(node);
          continue;
        case "SCRIPT":
        case "STYLE":
          continue;
        case "LINK":
          if ("stylesheet" === node.rel.toLowerCase()) continue;
      }
      container.removeChild(node);
    }
  }
  function canHydrateInstance(instance, type, props, inRootOrSingleton) {
    for (; 1 === instance.nodeType; ) {
      var anyProps = props;
      if (instance.nodeName.toLowerCase() !== type.toLowerCase()) {
        if (!inRootOrSingleton && ("INPUT" !== instance.nodeName || "hidden" !== instance.type))
          break;
      } else if (!inRootOrSingleton)
        if ("input" === type && "hidden" === instance.type) {
          var name = null == anyProps.name ? null : "" + anyProps.name;
          if ("hidden" === anyProps.type && instance.getAttribute("name") === name)
            return instance;
        } else return instance;
      else if (!instance[internalHoistableMarker])
        switch (type) {
          case "meta":
            if (!instance.hasAttribute("itemprop")) break;
            return instance;
          case "link":
            name = instance.getAttribute("rel");
            if ("stylesheet" === name && instance.hasAttribute("data-precedence"))
              break;
            else if (name !== anyProps.rel || instance.getAttribute("href") !== (null == anyProps.href || "" === anyProps.href ? null : anyProps.href) || instance.getAttribute("crossorigin") !== (null == anyProps.crossOrigin ? null : anyProps.crossOrigin) || instance.getAttribute("title") !== (null == anyProps.title ? null : anyProps.title))
              break;
            return instance;
          case "style":
            if (instance.hasAttribute("data-precedence")) break;
            return instance;
          case "script":
            name = instance.getAttribute("src");
            if ((name !== (null == anyProps.src ? null : anyProps.src) || instance.getAttribute("type") !== (null == anyProps.type ? null : anyProps.type) || instance.getAttribute("crossorigin") !== (null == anyProps.crossOrigin ? null : anyProps.crossOrigin)) && name && instance.hasAttribute("async") && !instance.hasAttribute("itemprop"))
              break;
            return instance;
          default:
            return instance;
        }
      instance = getNextHydratable(instance.nextSibling);
      if (null === instance) break;
    }
    return null;
  }
  function canHydrateTextInstance(instance, text, inRootOrSingleton) {
    if ("" === text) return null;
    for (; 3 !== instance.nodeType; ) {
      if ((1 !== instance.nodeType || "INPUT" !== instance.nodeName || "hidden" !== instance.type) && !inRootOrSingleton)
        return null;
      instance = getNextHydratable(instance.nextSibling);
      if (null === instance) return null;
    }
    return instance;
  }
  function canHydrateHydrationBoundary(instance, inRootOrSingleton) {
    for (; 8 !== instance.nodeType; ) {
      if ((1 !== instance.nodeType || "INPUT" !== instance.nodeName || "hidden" !== instance.type) && !inRootOrSingleton)
        return null;
      instance = getNextHydratable(instance.nextSibling);
      if (null === instance) return null;
    }
    return instance;
  }
  function isSuspenseInstancePending(instance) {
    return "$?" === instance.data || "$~" === instance.data;
  }
  function isSuspenseInstanceFallback(instance) {
    return "$!" === instance.data || "$?" === instance.data && "loading" !== instance.ownerDocument.readyState;
  }
  function registerSuspenseInstanceRetry(instance, callback) {
    var ownerDocument = instance.ownerDocument;
    if ("$~" === instance.data) instance._reactRetry = callback;
    else if ("$?" !== instance.data || "loading" !== ownerDocument.readyState)
      callback();
    else {
      var listener = function() {
        callback();
        ownerDocument.removeEventListener("DOMContentLoaded", listener);
      };
      ownerDocument.addEventListener("DOMContentLoaded", listener);
      instance._reactRetry = listener;
    }
  }
  function getNextHydratable(node) {
    for (; null != node; node = node.nextSibling) {
      var nodeType = node.nodeType;
      if (1 === nodeType || 3 === nodeType) break;
      if (8 === nodeType) {
        nodeType = node.data;
        if ("$" === nodeType || "$!" === nodeType || "$?" === nodeType || "$~" === nodeType || "&" === nodeType || "F!" === nodeType || "F" === nodeType)
          break;
        if ("/$" === nodeType || "/&" === nodeType) return null;
      }
    }
    return node;
  }
  var previousHydratableOnEnteringScopedSingleton = null;
  function getNextHydratableInstanceAfterHydrationBoundary(hydrationInstance) {
    hydrationInstance = hydrationInstance.nextSibling;
    for (var depth = 0; hydrationInstance; ) {
      if (8 === hydrationInstance.nodeType) {
        var data = hydrationInstance.data;
        if ("/$" === data || "/&" === data) {
          if (0 === depth)
            return getNextHydratable(hydrationInstance.nextSibling);
          depth--;
        } else
          "$" !== data && "$!" !== data && "$?" !== data && "$~" !== data && "&" !== data || depth++;
      }
      hydrationInstance = hydrationInstance.nextSibling;
    }
    return null;
  }
  function getParentHydrationBoundary(targetInstance) {
    targetInstance = targetInstance.previousSibling;
    for (var depth = 0; targetInstance; ) {
      if (8 === targetInstance.nodeType) {
        var data = targetInstance.data;
        if ("$" === data || "$!" === data || "$?" === data || "$~" === data || "&" === data) {
          if (0 === depth) return targetInstance;
          depth--;
        } else "/$" !== data && "/&" !== data || depth++;
      }
      targetInstance = targetInstance.previousSibling;
    }
    return null;
  }
  function resolveSingletonInstance(type, props, rootContainerInstance) {
    props = getOwnerDocumentFromRootContainer(rootContainerInstance);
    switch (type) {
      case "html":
        type = props.documentElement;
        if (!type) throw Error(formatProdErrorMessage(452));
        return type;
      case "head":
        type = props.head;
        if (!type) throw Error(formatProdErrorMessage(453));
        return type;
      case "body":
        type = props.body;
        if (!type) throw Error(formatProdErrorMessage(454));
        return type;
      default:
        throw Error(formatProdErrorMessage(451));
    }
  }
  function releaseSingletonInstance(instance) {
    for (var attributes = instance.attributes; attributes.length; )
      instance.removeAttributeNode(attributes[0]);
    detachDeletedInstance(instance);
  }
  var preloadPropsMap = /* @__PURE__ */ new Map(), preconnectsSet = /* @__PURE__ */ new Set();
  function getHoistableRoot(container) {
    return "function" === typeof container.getRootNode ? container.getRootNode() : 9 === container.nodeType ? container : container.ownerDocument;
  }
  var previousDispatcher = ReactDOMSharedInternals.d;
  ReactDOMSharedInternals.d = {
    f: flushSyncWork,
    r: requestFormReset,
    D: prefetchDNS,
    C: preconnect,
    L: preload2,
    m: preloadModule,
    X: preinitScript,
    S: preinitStyle,
    M: preinitModuleScript
  };
  function flushSyncWork() {
    var previousWasRendering = previousDispatcher.f(), wasRendering = flushSyncWork$1();
    return previousWasRendering || wasRendering;
  }
  function requestFormReset(form) {
    var formInst = getInstanceFromNode(form);
    null !== formInst && 5 === formInst.tag && "form" === formInst.type ? requestFormReset$1(formInst) : previousDispatcher.r(form);
  }
  var globalDocument = "undefined" === typeof document ? null : document;
  function preconnectAs(rel, href, crossOrigin) {
    var ownerDocument = globalDocument;
    if (ownerDocument && "string" === typeof href && href) {
      var limitedEscapedHref = escapeSelectorAttributeValueInsideDoubleQuotes(href);
      limitedEscapedHref = 'link[rel="' + rel + '"][href="' + limitedEscapedHref + '"]';
      "string" === typeof crossOrigin && (limitedEscapedHref += '[crossorigin="' + crossOrigin + '"]');
      preconnectsSet.has(limitedEscapedHref) || (preconnectsSet.add(limitedEscapedHref), rel = { rel, crossOrigin, href }, null === ownerDocument.querySelector(limitedEscapedHref) && (href = ownerDocument.createElement("link"), setInitialProperties(href, "link", rel), markNodeAsHoistable(href), ownerDocument.head.appendChild(href)));
    }
  }
  function prefetchDNS(href) {
    previousDispatcher.D(href);
    preconnectAs("dns-prefetch", href, null);
  }
  function preconnect(href, crossOrigin) {
    previousDispatcher.C(href, crossOrigin);
    preconnectAs("preconnect", href, crossOrigin);
  }
  function preload2(href, as, options2) {
    previousDispatcher.L(href, as, options2);
    var ownerDocument = globalDocument;
    if (ownerDocument && href && as) {
      var preloadSelector = 'link[rel="preload"][as="' + escapeSelectorAttributeValueInsideDoubleQuotes(as) + '"]';
      "image" === as ? options2 && options2.imageSrcSet ? (preloadSelector += '[imagesrcset="' + escapeSelectorAttributeValueInsideDoubleQuotes(
        options2.imageSrcSet
      ) + '"]', "string" === typeof options2.imageSizes && (preloadSelector += '[imagesizes="' + escapeSelectorAttributeValueInsideDoubleQuotes(
        options2.imageSizes
      ) + '"]')) : preloadSelector += '[href="' + escapeSelectorAttributeValueInsideDoubleQuotes(href) + '"]' : preloadSelector += '[href="' + escapeSelectorAttributeValueInsideDoubleQuotes(href) + '"]';
      var key = preloadSelector;
      switch (as) {
        case "style":
          key = getStyleKey(href);
          break;
        case "script":
          key = getScriptKey(href);
      }
      preloadPropsMap.has(key) || (href = assign(
        {
          rel: "preload",
          href: "image" === as && options2 && options2.imageSrcSet ? void 0 : href,
          as
        },
        options2
      ), preloadPropsMap.set(key, href), null !== ownerDocument.querySelector(preloadSelector) || "style" === as && ownerDocument.querySelector(getStylesheetSelectorFromKey(key)) || "script" === as && ownerDocument.querySelector(getScriptSelectorFromKey(key)) || (as = ownerDocument.createElement("link"), setInitialProperties(as, "link", href), markNodeAsHoistable(as), ownerDocument.head.appendChild(as)));
    }
  }
  function preloadModule(href, options2) {
    previousDispatcher.m(href, options2);
    var ownerDocument = globalDocument;
    if (ownerDocument && href) {
      var as = options2 && "string" === typeof options2.as ? options2.as : "script", preloadSelector = 'link[rel="modulepreload"][as="' + escapeSelectorAttributeValueInsideDoubleQuotes(as) + '"][href="' + escapeSelectorAttributeValueInsideDoubleQuotes(href) + '"]', key = preloadSelector;
      switch (as) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          key = getScriptKey(href);
      }
      if (!preloadPropsMap.has(key) && (href = assign({ rel: "modulepreload", href }, options2), preloadPropsMap.set(key, href), null === ownerDocument.querySelector(preloadSelector))) {
        switch (as) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (ownerDocument.querySelector(getScriptSelectorFromKey(key)))
              return;
        }
        as = ownerDocument.createElement("link");
        setInitialProperties(as, "link", href);
        markNodeAsHoistable(as);
        ownerDocument.head.appendChild(as);
      }
    }
  }
  function preinitStyle(href, precedence, options2) {
    previousDispatcher.S(href, precedence, options2);
    var ownerDocument = globalDocument;
    if (ownerDocument && href) {
      var styles = getResourcesFromRoot(ownerDocument).hoistableStyles, key = getStyleKey(href);
      precedence = precedence || "default";
      var resource = styles.get(key);
      if (!resource) {
        var state = { loading: 0, preload: null };
        if (resource = ownerDocument.querySelector(
          getStylesheetSelectorFromKey(key)
        ))
          state.loading = 5;
        else {
          href = assign(
            { rel: "stylesheet", href, "data-precedence": precedence },
            options2
          );
          (options2 = preloadPropsMap.get(key)) && adoptPreloadPropsForStylesheet(href, options2);
          var link = resource = ownerDocument.createElement("link");
          markNodeAsHoistable(link);
          setInitialProperties(link, "link", href);
          link._p = new Promise(function(resolve, reject) {
            link.onload = resolve;
            link.onerror = reject;
          });
          link.addEventListener("load", function() {
            state.loading |= 1;
          });
          link.addEventListener("error", function() {
            state.loading |= 2;
          });
          state.loading |= 4;
          insertStylesheet(resource, precedence, ownerDocument);
        }
        resource = {
          type: "stylesheet",
          instance: resource,
          count: 1,
          state
        };
        styles.set(key, resource);
      }
    }
  }
  function preinitScript(src, options2) {
    previousDispatcher.X(src, options2);
    var ownerDocument = globalDocument;
    if (ownerDocument && src) {
      var scripts = getResourcesFromRoot(ownerDocument).hoistableScripts, key = getScriptKey(src), resource = scripts.get(key);
      resource || (resource = ownerDocument.querySelector(getScriptSelectorFromKey(key)), resource || (src = assign({ src, async: true }, options2), (options2 = preloadPropsMap.get(key)) && adoptPreloadPropsForScript(src, options2), resource = ownerDocument.createElement("script"), markNodeAsHoistable(resource), setInitialProperties(resource, "link", src), ownerDocument.head.appendChild(resource)), resource = {
        type: "script",
        instance: resource,
        count: 1,
        state: null
      }, scripts.set(key, resource));
    }
  }
  function preinitModuleScript(src, options2) {
    previousDispatcher.M(src, options2);
    var ownerDocument = globalDocument;
    if (ownerDocument && src) {
      var scripts = getResourcesFromRoot(ownerDocument).hoistableScripts, key = getScriptKey(src), resource = scripts.get(key);
      resource || (resource = ownerDocument.querySelector(getScriptSelectorFromKey(key)), resource || (src = assign({ src, async: true, type: "module" }, options2), (options2 = preloadPropsMap.get(key)) && adoptPreloadPropsForScript(src, options2), resource = ownerDocument.createElement("script"), markNodeAsHoistable(resource), setInitialProperties(resource, "link", src), ownerDocument.head.appendChild(resource)), resource = {
        type: "script",
        instance: resource,
        count: 1,
        state: null
      }, scripts.set(key, resource));
    }
  }
  function getResource(type, currentProps, pendingProps, currentResource) {
    var JSCompiler_inline_result = (JSCompiler_inline_result = rootInstanceStackCursor.current) ? getHoistableRoot(JSCompiler_inline_result) : null;
    if (!JSCompiler_inline_result) throw Error(formatProdErrorMessage(446));
    switch (type) {
      case "meta":
      case "title":
        return null;
      case "style":
        return "string" === typeof pendingProps.precedence && "string" === typeof pendingProps.href ? (currentProps = getStyleKey(pendingProps.href), pendingProps = getResourcesFromRoot(
          JSCompiler_inline_result
        ).hoistableStyles, currentResource = pendingProps.get(currentProps), currentResource || (currentResource = {
          type: "style",
          instance: null,
          count: 0,
          state: null
        }, pendingProps.set(currentProps, currentResource)), currentResource) : { type: "void", instance: null, count: 0, state: null };
      case "link":
        if ("stylesheet" === pendingProps.rel && "string" === typeof pendingProps.href && "string" === typeof pendingProps.precedence) {
          type = getStyleKey(pendingProps.href);
          var styles$243 = getResourcesFromRoot(
            JSCompiler_inline_result
          ).hoistableStyles, resource$244 = styles$243.get(type);
          resource$244 || (JSCompiler_inline_result = JSCompiler_inline_result.ownerDocument || JSCompiler_inline_result, resource$244 = {
            type: "stylesheet",
            instance: null,
            count: 0,
            state: { loading: 0, preload: null }
          }, styles$243.set(type, resource$244), (styles$243 = JSCompiler_inline_result.querySelector(
            getStylesheetSelectorFromKey(type)
          )) && !styles$243._p && (resource$244.instance = styles$243, resource$244.state.loading = 5), preloadPropsMap.has(type) || (pendingProps = {
            rel: "preload",
            as: "style",
            href: pendingProps.href,
            crossOrigin: pendingProps.crossOrigin,
            integrity: pendingProps.integrity,
            media: pendingProps.media,
            hrefLang: pendingProps.hrefLang,
            referrerPolicy: pendingProps.referrerPolicy
          }, preloadPropsMap.set(type, pendingProps), styles$243 || preloadStylesheet(
            JSCompiler_inline_result,
            type,
            pendingProps,
            resource$244.state
          )));
          if (currentProps && null === currentResource)
            throw Error(formatProdErrorMessage(528, ""));
          return resource$244;
        }
        if (currentProps && null !== currentResource)
          throw Error(formatProdErrorMessage(529, ""));
        return null;
      case "script":
        return currentProps = pendingProps.async, pendingProps = pendingProps.src, "string" === typeof pendingProps && currentProps && "function" !== typeof currentProps && "symbol" !== typeof currentProps ? (currentProps = getScriptKey(pendingProps), pendingProps = getResourcesFromRoot(
          JSCompiler_inline_result
        ).hoistableScripts, currentResource = pendingProps.get(currentProps), currentResource || (currentResource = {
          type: "script",
          instance: null,
          count: 0,
          state: null
        }, pendingProps.set(currentProps, currentResource)), currentResource) : { type: "void", instance: null, count: 0, state: null };
      default:
        throw Error(formatProdErrorMessage(444, type));
    }
  }
  function getStyleKey(href) {
    return 'href="' + escapeSelectorAttributeValueInsideDoubleQuotes(href) + '"';
  }
  function getStylesheetSelectorFromKey(key) {
    return 'link[rel="stylesheet"][' + key + "]";
  }
  function stylesheetPropsFromRawProps(rawProps) {
    return assign({}, rawProps, {
      "data-precedence": rawProps.precedence,
      precedence: null
    });
  }
  function preloadStylesheet(ownerDocument, key, preloadProps, state) {
    ownerDocument.querySelector('link[rel="preload"][as="style"][' + key + "]") ? state.loading = 1 : (key = ownerDocument.createElement("link"), state.preload = key, key.addEventListener("load", function() {
      return state.loading |= 1;
    }), key.addEventListener("error", function() {
      return state.loading |= 2;
    }), setInitialProperties(key, "link", preloadProps), markNodeAsHoistable(key), ownerDocument.head.appendChild(key));
  }
  function getScriptKey(src) {
    return '[src="' + escapeSelectorAttributeValueInsideDoubleQuotes(src) + '"]';
  }
  function getScriptSelectorFromKey(key) {
    return "script[async]" + key;
  }
  function acquireResource(hoistableRoot, resource, props) {
    resource.count++;
    if (null === resource.instance)
      switch (resource.type) {
        case "style":
          var instance = hoistableRoot.querySelector(
            'style[data-href~="' + escapeSelectorAttributeValueInsideDoubleQuotes(props.href) + '"]'
          );
          if (instance)
            return resource.instance = instance, markNodeAsHoistable(instance), instance;
          var styleProps = assign({}, props, {
            "data-href": props.href,
            "data-precedence": props.precedence,
            href: null,
            precedence: null
          });
          instance = (hoistableRoot.ownerDocument || hoistableRoot).createElement(
            "style"
          );
          markNodeAsHoistable(instance);
          setInitialProperties(instance, "style", styleProps);
          insertStylesheet(instance, props.precedence, hoistableRoot);
          return resource.instance = instance;
        case "stylesheet":
          styleProps = getStyleKey(props.href);
          var instance$249 = hoistableRoot.querySelector(
            getStylesheetSelectorFromKey(styleProps)
          );
          if (instance$249)
            return resource.state.loading |= 4, resource.instance = instance$249, markNodeAsHoistable(instance$249), instance$249;
          instance = stylesheetPropsFromRawProps(props);
          (styleProps = preloadPropsMap.get(styleProps)) && adoptPreloadPropsForStylesheet(instance, styleProps);
          instance$249 = (hoistableRoot.ownerDocument || hoistableRoot).createElement("link");
          markNodeAsHoistable(instance$249);
          var linkInstance = instance$249;
          linkInstance._p = new Promise(function(resolve, reject) {
            linkInstance.onload = resolve;
            linkInstance.onerror = reject;
          });
          setInitialProperties(instance$249, "link", instance);
          resource.state.loading |= 4;
          insertStylesheet(instance$249, props.precedence, hoistableRoot);
          return resource.instance = instance$249;
        case "script":
          instance$249 = getScriptKey(props.src);
          if (styleProps = hoistableRoot.querySelector(
            getScriptSelectorFromKey(instance$249)
          ))
            return resource.instance = styleProps, markNodeAsHoistable(styleProps), styleProps;
          instance = props;
          if (styleProps = preloadPropsMap.get(instance$249))
            instance = assign({}, props), adoptPreloadPropsForScript(instance, styleProps);
          hoistableRoot = hoistableRoot.ownerDocument || hoistableRoot;
          styleProps = hoistableRoot.createElement("script");
          markNodeAsHoistable(styleProps);
          setInitialProperties(styleProps, "link", instance);
          hoistableRoot.head.appendChild(styleProps);
          return resource.instance = styleProps;
        case "void":
          return null;
        default:
          throw Error(formatProdErrorMessage(443, resource.type));
      }
    else
      "stylesheet" === resource.type && 0 === (resource.state.loading & 4) && (instance = resource.instance, resource.state.loading |= 4, insertStylesheet(instance, props.precedence, hoistableRoot));
    return resource.instance;
  }
  function insertStylesheet(instance, precedence, root2) {
    for (var nodes = root2.querySelectorAll(
      'link[rel="stylesheet"][data-precedence],style[data-precedence]'
    ), last = nodes.length ? nodes[nodes.length - 1] : null, prior = last, i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      if (node.dataset.precedence === precedence) prior = node;
      else if (prior !== last) break;
    }
    prior ? prior.parentNode.insertBefore(instance, prior.nextSibling) : (precedence = 9 === root2.nodeType ? root2.head : root2, precedence.insertBefore(instance, precedence.firstChild));
  }
  function adoptPreloadPropsForStylesheet(stylesheetProps, preloadProps) {
    null == stylesheetProps.crossOrigin && (stylesheetProps.crossOrigin = preloadProps.crossOrigin);
    null == stylesheetProps.referrerPolicy && (stylesheetProps.referrerPolicy = preloadProps.referrerPolicy);
    null == stylesheetProps.title && (stylesheetProps.title = preloadProps.title);
  }
  function adoptPreloadPropsForScript(scriptProps, preloadProps) {
    null == scriptProps.crossOrigin && (scriptProps.crossOrigin = preloadProps.crossOrigin);
    null == scriptProps.referrerPolicy && (scriptProps.referrerPolicy = preloadProps.referrerPolicy);
    null == scriptProps.integrity && (scriptProps.integrity = preloadProps.integrity);
  }
  var tagCaches = null;
  function getHydratableHoistableCache(type, keyAttribute, ownerDocument) {
    if (null === tagCaches) {
      var cache = /* @__PURE__ */ new Map();
      var caches = tagCaches = /* @__PURE__ */ new Map();
      caches.set(ownerDocument, cache);
    } else
      caches = tagCaches, cache = caches.get(ownerDocument), cache || (cache = /* @__PURE__ */ new Map(), caches.set(ownerDocument, cache));
    if (cache.has(type)) return cache;
    cache.set(type, null);
    ownerDocument = ownerDocument.getElementsByTagName(type);
    for (caches = 0; caches < ownerDocument.length; caches++) {
      var node = ownerDocument[caches];
      if (!(node[internalHoistableMarker] || node[internalInstanceKey] || "link" === type && "stylesheet" === node.getAttribute("rel")) && "http://www.w3.org/2000/svg" !== node.namespaceURI) {
        var nodeKey = node.getAttribute(keyAttribute) || "";
        nodeKey = type + nodeKey;
        var existing = cache.get(nodeKey);
        existing ? existing.push(node) : cache.set(nodeKey, [node]);
      }
    }
    return cache;
  }
  function mountHoistable(hoistableRoot, type, instance) {
    hoistableRoot = hoistableRoot.ownerDocument || hoistableRoot;
    hoistableRoot.head.insertBefore(
      instance,
      "title" === type ? hoistableRoot.querySelector("head > title") : null
    );
  }
  function isHostHoistableType(type, props, hostContext) {
    if (1 === hostContext || null != props.itemProp) return false;
    switch (type) {
      case "meta":
      case "title":
        return true;
      case "style":
        if ("string" !== typeof props.precedence || "string" !== typeof props.href || "" === props.href)
          break;
        return true;
      case "link":
        if ("string" !== typeof props.rel || "string" !== typeof props.href || "" === props.href || props.onLoad || props.onError)
          break;
        switch (props.rel) {
          case "stylesheet":
            return type = props.disabled, "string" === typeof props.precedence && null == type;
          default:
            return true;
        }
      case "script":
        if (props.async && "function" !== typeof props.async && "symbol" !== typeof props.async && !props.onLoad && !props.onError && props.src && "string" === typeof props.src)
          return true;
    }
    return false;
  }
  function preloadResource(resource) {
    return "stylesheet" === resource.type && 0 === (resource.state.loading & 3) ? false : true;
  }
  function suspendResource(state, hoistableRoot, resource, props) {
    if ("stylesheet" === resource.type && ("string" !== typeof props.media || false !== matchMedia(props.media).matches) && 0 === (resource.state.loading & 4)) {
      if (null === resource.instance) {
        var key = getStyleKey(props.href), instance = hoistableRoot.querySelector(
          getStylesheetSelectorFromKey(key)
        );
        if (instance) {
          hoistableRoot = instance._p;
          null !== hoistableRoot && "object" === typeof hoistableRoot && "function" === typeof hoistableRoot.then && (state.count++, state = onUnsuspend.bind(state), hoistableRoot.then(state, state));
          resource.state.loading |= 4;
          resource.instance = instance;
          markNodeAsHoistable(instance);
          return;
        }
        instance = hoistableRoot.ownerDocument || hoistableRoot;
        props = stylesheetPropsFromRawProps(props);
        (key = preloadPropsMap.get(key)) && adoptPreloadPropsForStylesheet(props, key);
        instance = instance.createElement("link");
        markNodeAsHoistable(instance);
        var linkInstance = instance;
        linkInstance._p = new Promise(function(resolve, reject) {
          linkInstance.onload = resolve;
          linkInstance.onerror = reject;
        });
        setInitialProperties(instance, "link", props);
        resource.instance = instance;
      }
      null === state.stylesheets && (state.stylesheets = /* @__PURE__ */ new Map());
      state.stylesheets.set(resource, hoistableRoot);
      (hoistableRoot = resource.state.preload) && 0 === (resource.state.loading & 3) && (state.count++, resource = onUnsuspend.bind(state), hoistableRoot.addEventListener("load", resource), hoistableRoot.addEventListener("error", resource));
    }
  }
  var estimatedBytesWithinLimit = 0;
  function waitForCommitToBeReady(state, timeoutOffset) {
    state.stylesheets && 0 === state.count && insertSuspendedStylesheets(state, state.stylesheets);
    return 0 < state.count || 0 < state.imgCount ? function(commit) {
      var stylesheetTimer = setTimeout(function() {
        state.stylesheets && insertSuspendedStylesheets(state, state.stylesheets);
        if (state.unsuspend) {
          var unsuspend = state.unsuspend;
          state.unsuspend = null;
          unsuspend();
        }
      }, 6e4 + timeoutOffset);
      0 < state.imgBytes && 0 === estimatedBytesWithinLimit && (estimatedBytesWithinLimit = 62500 * estimateBandwidth());
      var imgTimer = setTimeout(
        function() {
          state.waitingForImages = false;
          if (0 === state.count && (state.stylesheets && insertSuspendedStylesheets(state, state.stylesheets), state.unsuspend)) {
            var unsuspend = state.unsuspend;
            state.unsuspend = null;
            unsuspend();
          }
        },
        (state.imgBytes > estimatedBytesWithinLimit ? 50 : 800) + timeoutOffset
      );
      state.unsuspend = commit;
      return function() {
        state.unsuspend = null;
        clearTimeout(stylesheetTimer);
        clearTimeout(imgTimer);
      };
    } : null;
  }
  function onUnsuspend() {
    this.count--;
    if (0 === this.count && (0 === this.imgCount || !this.waitingForImages)) {
      if (this.stylesheets) insertSuspendedStylesheets(this, this.stylesheets);
      else if (this.unsuspend) {
        var unsuspend = this.unsuspend;
        this.unsuspend = null;
        unsuspend();
      }
    }
  }
  var precedencesByRoot = null;
  function insertSuspendedStylesheets(state, resources) {
    state.stylesheets = null;
    null !== state.unsuspend && (state.count++, precedencesByRoot = /* @__PURE__ */ new Map(), resources.forEach(insertStylesheetIntoRoot, state), precedencesByRoot = null, onUnsuspend.call(state));
  }
  function insertStylesheetIntoRoot(root2, resource) {
    if (!(resource.state.loading & 4)) {
      var precedences = precedencesByRoot.get(root2);
      if (precedences) var last = precedences.get(null);
      else {
        precedences = /* @__PURE__ */ new Map();
        precedencesByRoot.set(root2, precedences);
        for (var nodes = root2.querySelectorAll(
          "link[data-precedence],style[data-precedence]"
        ), i = 0; i < nodes.length; i++) {
          var node = nodes[i];
          if ("LINK" === node.nodeName || "not all" !== node.getAttribute("media"))
            precedences.set(node.dataset.precedence, node), last = node;
        }
        last && precedences.set(null, last);
      }
      nodes = resource.instance;
      node = nodes.getAttribute("data-precedence");
      i = precedences.get(node) || last;
      i === last && precedences.set(null, nodes);
      precedences.set(node, nodes);
      this.count++;
      last = onUnsuspend.bind(this);
      nodes.addEventListener("load", last);
      nodes.addEventListener("error", last);
      i ? i.parentNode.insertBefore(nodes, i.nextSibling) : (root2 = 9 === root2.nodeType ? root2.head : root2, root2.insertBefore(nodes, root2.firstChild));
      resource.state.loading |= 4;
    }
  }
  var HostTransitionContext = {
    $$typeof: REACT_CONTEXT_TYPE,
    Provider: null,
    Consumer: null,
    _currentValue: sharedNotPendingObject,
    _currentValue2: sharedNotPendingObject,
    _threadCount: 0
  };
  function FiberRootNode(containerInfo, tag, hydrate, identifierPrefix, onUncaughtError, onCaughtError, onRecoverableError, onDefaultTransitionIndicator, formState) {
    this.tag = 1;
    this.containerInfo = containerInfo;
    this.pingCache = this.current = this.pendingChildren = null;
    this.timeoutHandle = -1;
    this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null;
    this.callbackPriority = 0;
    this.expirationTimes = createLaneMap(-1);
    this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0;
    this.entanglements = createLaneMap(0);
    this.hiddenUpdates = createLaneMap(null);
    this.identifierPrefix = identifierPrefix;
    this.onUncaughtError = onUncaughtError;
    this.onCaughtError = onCaughtError;
    this.onRecoverableError = onRecoverableError;
    this.pooledCache = null;
    this.pooledCacheLanes = 0;
    this.formState = formState;
    this.incompleteTransitions = /* @__PURE__ */ new Map();
  }
  function createFiberRoot(containerInfo, tag, hydrate, initialChildren, hydrationCallbacks, isStrictMode, identifierPrefix, formState, onUncaughtError, onCaughtError, onRecoverableError, onDefaultTransitionIndicator) {
    containerInfo = new FiberRootNode(
      containerInfo,
      tag,
      hydrate,
      identifierPrefix,
      onUncaughtError,
      onCaughtError,
      onRecoverableError,
      onDefaultTransitionIndicator,
      formState
    );
    tag = 1;
    true === isStrictMode && (tag |= 24);
    isStrictMode = createFiberImplClass(3, null, null, tag);
    containerInfo.current = isStrictMode;
    isStrictMode.stateNode = containerInfo;
    tag = createCache();
    tag.refCount++;
    containerInfo.pooledCache = tag;
    tag.refCount++;
    isStrictMode.memoizedState = {
      element: initialChildren,
      isDehydrated: hydrate,
      cache: tag
    };
    initializeUpdateQueue(isStrictMode);
    return containerInfo;
  }
  function getContextForSubtree(parentComponent) {
    if (!parentComponent) return emptyContextObject;
    parentComponent = emptyContextObject;
    return parentComponent;
  }
  function updateContainerImpl(rootFiber, lane, element, container, parentComponent, callback) {
    parentComponent = getContextForSubtree(parentComponent);
    null === container.context ? container.context = parentComponent : container.pendingContext = parentComponent;
    container = createUpdate(lane);
    container.payload = { element };
    callback = void 0 === callback ? null : callback;
    null !== callback && (container.callback = callback);
    element = enqueueUpdate(rootFiber, container, lane);
    null !== element && (scheduleUpdateOnFiber(element, rootFiber, lane), entangleTransitions(element, rootFiber, lane));
  }
  function markRetryLaneImpl(fiber, retryLane) {
    fiber = fiber.memoizedState;
    if (null !== fiber && null !== fiber.dehydrated) {
      var a = fiber.retryLane;
      fiber.retryLane = 0 !== a && a < retryLane ? a : retryLane;
    }
  }
  function markRetryLaneIfNotHydrated(fiber, retryLane) {
    markRetryLaneImpl(fiber, retryLane);
    (fiber = fiber.alternate) && markRetryLaneImpl(fiber, retryLane);
  }
  function attemptContinuousHydration(fiber) {
    if (13 === fiber.tag || 31 === fiber.tag) {
      var root2 = enqueueConcurrentRenderForLane(fiber, 67108864);
      null !== root2 && scheduleUpdateOnFiber(root2, fiber, 67108864);
      markRetryLaneIfNotHydrated(fiber, 67108864);
    }
  }
  function attemptHydrationAtCurrentPriority(fiber) {
    if (13 === fiber.tag || 31 === fiber.tag) {
      var lane = requestUpdateLane();
      lane = getBumpedLaneForHydrationByLane(lane);
      var root2 = enqueueConcurrentRenderForLane(fiber, lane);
      null !== root2 && scheduleUpdateOnFiber(root2, fiber, lane);
      markRetryLaneIfNotHydrated(fiber, lane);
    }
  }
  var _enabled = true;
  function dispatchDiscreteEvent(domEventName, eventSystemFlags, container, nativeEvent) {
    var prevTransition = ReactSharedInternals.T;
    ReactSharedInternals.T = null;
    var previousPriority = ReactDOMSharedInternals.p;
    try {
      ReactDOMSharedInternals.p = 2, dispatchEvent(domEventName, eventSystemFlags, container, nativeEvent);
    } finally {
      ReactDOMSharedInternals.p = previousPriority, ReactSharedInternals.T = prevTransition;
    }
  }
  function dispatchContinuousEvent(domEventName, eventSystemFlags, container, nativeEvent) {
    var prevTransition = ReactSharedInternals.T;
    ReactSharedInternals.T = null;
    var previousPriority = ReactDOMSharedInternals.p;
    try {
      ReactDOMSharedInternals.p = 8, dispatchEvent(domEventName, eventSystemFlags, container, nativeEvent);
    } finally {
      ReactDOMSharedInternals.p = previousPriority, ReactSharedInternals.T = prevTransition;
    }
  }
  function dispatchEvent(domEventName, eventSystemFlags, targetContainer, nativeEvent) {
    if (_enabled) {
      var blockedOn = findInstanceBlockingEvent(nativeEvent);
      if (null === blockedOn)
        dispatchEventForPluginEventSystem(
          domEventName,
          eventSystemFlags,
          nativeEvent,
          return_targetInst,
          targetContainer
        ), clearIfContinuousEvent(domEventName, nativeEvent);
      else if (queueIfContinuousEvent(
        blockedOn,
        domEventName,
        eventSystemFlags,
        targetContainer,
        nativeEvent
      ))
        nativeEvent.stopPropagation();
      else if (clearIfContinuousEvent(domEventName, nativeEvent), eventSystemFlags & 4 && -1 < discreteReplayableEvents.indexOf(domEventName)) {
        for (; null !== blockedOn; ) {
          var fiber = getInstanceFromNode(blockedOn);
          if (null !== fiber)
            switch (fiber.tag) {
              case 3:
                fiber = fiber.stateNode;
                if (fiber.current.memoizedState.isDehydrated) {
                  var lanes = getHighestPriorityLanes(fiber.pendingLanes);
                  if (0 !== lanes) {
                    var root2 = fiber;
                    root2.pendingLanes |= 2;
                    for (root2.entangledLanes |= 2; lanes; ) {
                      var lane = 1 << 31 - clz32(lanes);
                      root2.entanglements[1] |= lane;
                      lanes &= ~lane;
                    }
                    ensureRootIsScheduled(fiber);
                    0 === (executionContext & 6) && (workInProgressRootRenderTargetTime = now() + 500, flushSyncWorkAcrossRoots_impl(0));
                  }
                }
                break;
              case 31:
              case 13:
                root2 = enqueueConcurrentRenderForLane(fiber, 2), null !== root2 && scheduleUpdateOnFiber(root2, fiber, 2), flushSyncWork$1(), markRetryLaneIfNotHydrated(fiber, 2);
            }
          fiber = findInstanceBlockingEvent(nativeEvent);
          null === fiber && dispatchEventForPluginEventSystem(
            domEventName,
            eventSystemFlags,
            nativeEvent,
            return_targetInst,
            targetContainer
          );
          if (fiber === blockedOn) break;
          blockedOn = fiber;
        }
        null !== blockedOn && nativeEvent.stopPropagation();
      } else
        dispatchEventForPluginEventSystem(
          domEventName,
          eventSystemFlags,
          nativeEvent,
          null,
          targetContainer
        );
    }
  }
  function findInstanceBlockingEvent(nativeEvent) {
    nativeEvent = getEventTarget(nativeEvent);
    return findInstanceBlockingTarget(nativeEvent);
  }
  var return_targetInst = null;
  function findInstanceBlockingTarget(targetNode) {
    return_targetInst = null;
    targetNode = getClosestInstanceFromNode(targetNode);
    if (null !== targetNode) {
      var nearestMounted = getNearestMountedFiber(targetNode);
      if (null === nearestMounted) targetNode = null;
      else {
        var tag = nearestMounted.tag;
        if (13 === tag) {
          targetNode = getSuspenseInstanceFromFiber(nearestMounted);
          if (null !== targetNode) return targetNode;
          targetNode = null;
        } else if (31 === tag) {
          targetNode = getActivityInstanceFromFiber(nearestMounted);
          if (null !== targetNode) return targetNode;
          targetNode = null;
        } else if (3 === tag) {
          if (nearestMounted.stateNode.current.memoizedState.isDehydrated)
            return 3 === nearestMounted.tag ? nearestMounted.stateNode.containerInfo : null;
          targetNode = null;
        } else nearestMounted !== targetNode && (targetNode = null);
      }
    }
    return_targetInst = targetNode;
    return null;
  }
  function getEventPriority(domEventName) {
    switch (domEventName) {
      case "beforetoggle":
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "resize":
      case "seeked":
      case "submit":
      case "toggle":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 2;
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "scroll":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 8;
      case "message":
        switch (getCurrentPriorityLevel()) {
          case ImmediatePriority:
            return 2;
          case UserBlockingPriority:
            return 8;
          case NormalPriority$1:
          case LowPriority:
            return 32;
          case IdlePriority:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var hasScheduledReplayAttempt = false, queuedFocus = null, queuedDrag = null, queuedMouse = null, queuedPointers = /* @__PURE__ */ new Map(), queuedPointerCaptures = /* @__PURE__ */ new Map(), queuedExplicitHydrationTargets = [], discreteReplayableEvents = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
    " "
  );
  function clearIfContinuousEvent(domEventName, nativeEvent) {
    switch (domEventName) {
      case "focusin":
      case "focusout":
        queuedFocus = null;
        break;
      case "dragenter":
      case "dragleave":
        queuedDrag = null;
        break;
      case "mouseover":
      case "mouseout":
        queuedMouse = null;
        break;
      case "pointerover":
      case "pointerout":
        queuedPointers.delete(nativeEvent.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        queuedPointerCaptures.delete(nativeEvent.pointerId);
    }
  }
  function accumulateOrCreateContinuousQueuedReplayableEvent(existingQueuedEvent, blockedOn, domEventName, eventSystemFlags, targetContainer, nativeEvent) {
    if (null === existingQueuedEvent || existingQueuedEvent.nativeEvent !== nativeEvent)
      return existingQueuedEvent = {
        blockedOn,
        domEventName,
        eventSystemFlags,
        nativeEvent,
        targetContainers: [targetContainer]
      }, null !== blockedOn && (blockedOn = getInstanceFromNode(blockedOn), null !== blockedOn && attemptContinuousHydration(blockedOn)), existingQueuedEvent;
    existingQueuedEvent.eventSystemFlags |= eventSystemFlags;
    blockedOn = existingQueuedEvent.targetContainers;
    null !== targetContainer && -1 === blockedOn.indexOf(targetContainer) && blockedOn.push(targetContainer);
    return existingQueuedEvent;
  }
  function queueIfContinuousEvent(blockedOn, domEventName, eventSystemFlags, targetContainer, nativeEvent) {
    switch (domEventName) {
      case "focusin":
        return queuedFocus = accumulateOrCreateContinuousQueuedReplayableEvent(
          queuedFocus,
          blockedOn,
          domEventName,
          eventSystemFlags,
          targetContainer,
          nativeEvent
        ), true;
      case "dragenter":
        return queuedDrag = accumulateOrCreateContinuousQueuedReplayableEvent(
          queuedDrag,
          blockedOn,
          domEventName,
          eventSystemFlags,
          targetContainer,
          nativeEvent
        ), true;
      case "mouseover":
        return queuedMouse = accumulateOrCreateContinuousQueuedReplayableEvent(
          queuedMouse,
          blockedOn,
          domEventName,
          eventSystemFlags,
          targetContainer,
          nativeEvent
        ), true;
      case "pointerover":
        var pointerId = nativeEvent.pointerId;
        queuedPointers.set(
          pointerId,
          accumulateOrCreateContinuousQueuedReplayableEvent(
            queuedPointers.get(pointerId) || null,
            blockedOn,
            domEventName,
            eventSystemFlags,
            targetContainer,
            nativeEvent
          )
        );
        return true;
      case "gotpointercapture":
        return pointerId = nativeEvent.pointerId, queuedPointerCaptures.set(
          pointerId,
          accumulateOrCreateContinuousQueuedReplayableEvent(
            queuedPointerCaptures.get(pointerId) || null,
            blockedOn,
            domEventName,
            eventSystemFlags,
            targetContainer,
            nativeEvent
          )
        ), true;
    }
    return false;
  }
  function attemptExplicitHydrationTarget(queuedTarget) {
    var targetInst = getClosestInstanceFromNode(queuedTarget.target);
    if (null !== targetInst) {
      var nearestMounted = getNearestMountedFiber(targetInst);
      if (null !== nearestMounted) {
        if (targetInst = nearestMounted.tag, 13 === targetInst) {
          if (targetInst = getSuspenseInstanceFromFiber(nearestMounted), null !== targetInst) {
            queuedTarget.blockedOn = targetInst;
            runWithPriority(queuedTarget.priority, function() {
              attemptHydrationAtCurrentPriority(nearestMounted);
            });
            return;
          }
        } else if (31 === targetInst) {
          if (targetInst = getActivityInstanceFromFiber(nearestMounted), null !== targetInst) {
            queuedTarget.blockedOn = targetInst;
            runWithPriority(queuedTarget.priority, function() {
              attemptHydrationAtCurrentPriority(nearestMounted);
            });
            return;
          }
        } else if (3 === targetInst && nearestMounted.stateNode.current.memoizedState.isDehydrated) {
          queuedTarget.blockedOn = 3 === nearestMounted.tag ? nearestMounted.stateNode.containerInfo : null;
          return;
        }
      }
    }
    queuedTarget.blockedOn = null;
  }
  function attemptReplayContinuousQueuedEvent(queuedEvent) {
    if (null !== queuedEvent.blockedOn) return false;
    for (var targetContainers = queuedEvent.targetContainers; 0 < targetContainers.length; ) {
      var nextBlockedOn = findInstanceBlockingEvent(queuedEvent.nativeEvent);
      if (null === nextBlockedOn) {
        nextBlockedOn = queuedEvent.nativeEvent;
        var nativeEventClone = new nextBlockedOn.constructor(
          nextBlockedOn.type,
          nextBlockedOn
        );
        currentReplayingEvent = nativeEventClone;
        nextBlockedOn.target.dispatchEvent(nativeEventClone);
        currentReplayingEvent = null;
      } else
        return targetContainers = getInstanceFromNode(nextBlockedOn), null !== targetContainers && attemptContinuousHydration(targetContainers), queuedEvent.blockedOn = nextBlockedOn, false;
      targetContainers.shift();
    }
    return true;
  }
  function attemptReplayContinuousQueuedEventInMap(queuedEvent, key, map) {
    attemptReplayContinuousQueuedEvent(queuedEvent) && map.delete(key);
  }
  function replayUnblockedEvents() {
    hasScheduledReplayAttempt = false;
    null !== queuedFocus && attemptReplayContinuousQueuedEvent(queuedFocus) && (queuedFocus = null);
    null !== queuedDrag && attemptReplayContinuousQueuedEvent(queuedDrag) && (queuedDrag = null);
    null !== queuedMouse && attemptReplayContinuousQueuedEvent(queuedMouse) && (queuedMouse = null);
    queuedPointers.forEach(attemptReplayContinuousQueuedEventInMap);
    queuedPointerCaptures.forEach(attemptReplayContinuousQueuedEventInMap);
  }
  function scheduleCallbackIfUnblocked(queuedEvent, unblocked) {
    queuedEvent.blockedOn === unblocked && (queuedEvent.blockedOn = null, hasScheduledReplayAttempt || (hasScheduledReplayAttempt = true, Scheduler.unstable_scheduleCallback(
      Scheduler.unstable_NormalPriority,
      replayUnblockedEvents
    )));
  }
  var lastScheduledReplayQueue = null;
  function scheduleReplayQueueIfNeeded(formReplayingQueue) {
    lastScheduledReplayQueue !== formReplayingQueue && (lastScheduledReplayQueue = formReplayingQueue, Scheduler.unstable_scheduleCallback(
      Scheduler.unstable_NormalPriority,
      function() {
        lastScheduledReplayQueue === formReplayingQueue && (lastScheduledReplayQueue = null);
        for (var i = 0; i < formReplayingQueue.length; i += 3) {
          var form = formReplayingQueue[i], submitterOrAction = formReplayingQueue[i + 1], formData = formReplayingQueue[i + 2];
          if ("function" !== typeof submitterOrAction)
            if (null === findInstanceBlockingTarget(submitterOrAction || form))
              continue;
            else break;
          var formInst = getInstanceFromNode(form);
          null !== formInst && (formReplayingQueue.splice(i, 3), i -= 3, startHostTransition(
            formInst,
            {
              pending: true,
              data: formData,
              method: form.method,
              action: submitterOrAction
            },
            submitterOrAction,
            formData
          ));
        }
      }
    ));
  }
  function retryIfBlockedOn(unblocked) {
    function unblock(queuedEvent) {
      return scheduleCallbackIfUnblocked(queuedEvent, unblocked);
    }
    null !== queuedFocus && scheduleCallbackIfUnblocked(queuedFocus, unblocked);
    null !== queuedDrag && scheduleCallbackIfUnblocked(queuedDrag, unblocked);
    null !== queuedMouse && scheduleCallbackIfUnblocked(queuedMouse, unblocked);
    queuedPointers.forEach(unblock);
    queuedPointerCaptures.forEach(unblock);
    for (var i = 0; i < queuedExplicitHydrationTargets.length; i++) {
      var queuedTarget = queuedExplicitHydrationTargets[i];
      queuedTarget.blockedOn === unblocked && (queuedTarget.blockedOn = null);
    }
    for (; 0 < queuedExplicitHydrationTargets.length && (i = queuedExplicitHydrationTargets[0], null === i.blockedOn); )
      attemptExplicitHydrationTarget(i), null === i.blockedOn && queuedExplicitHydrationTargets.shift();
    i = (unblocked.ownerDocument || unblocked).$$reactFormReplay;
    if (null != i)
      for (queuedTarget = 0; queuedTarget < i.length; queuedTarget += 3) {
        var form = i[queuedTarget], submitterOrAction = i[queuedTarget + 1], formProps = form[internalPropsKey] || null;
        if ("function" === typeof submitterOrAction)
          formProps || scheduleReplayQueueIfNeeded(i);
        else if (formProps) {
          var action = null;
          if (submitterOrAction && submitterOrAction.hasAttribute("formAction"))
            if (form = submitterOrAction, formProps = submitterOrAction[internalPropsKey] || null)
              action = formProps.formAction;
            else {
              if (null !== findInstanceBlockingTarget(form)) continue;
            }
          else action = formProps.action;
          "function" === typeof action ? i[queuedTarget + 1] = action : (i.splice(queuedTarget, 3), queuedTarget -= 3);
          scheduleReplayQueueIfNeeded(i);
        }
      }
  }
  function defaultOnDefaultTransitionIndicator() {
    function handleNavigate(event) {
      event.canIntercept && "react-transition" === event.info && event.intercept({
        handler: function() {
          return new Promise(function(resolve) {
            return pendingResolve = resolve;
          });
        },
        focusReset: "manual",
        scroll: "manual"
      });
    }
    function handleNavigateComplete() {
      null !== pendingResolve && (pendingResolve(), pendingResolve = null);
      isCancelled || setTimeout(startFakeNavigation, 20);
    }
    function startFakeNavigation() {
      if (!isCancelled && !navigation.transition) {
        var currentEntry = navigation.currentEntry;
        currentEntry && null != currentEntry.url && navigation.navigate(currentEntry.url, {
          state: currentEntry.getState(),
          info: "react-transition",
          history: "replace"
        });
      }
    }
    if ("object" === typeof navigation) {
      var isCancelled = false, pendingResolve = null;
      navigation.addEventListener("navigate", handleNavigate);
      navigation.addEventListener("navigatesuccess", handleNavigateComplete);
      navigation.addEventListener("navigateerror", handleNavigateComplete);
      setTimeout(startFakeNavigation, 100);
      return function() {
        isCancelled = true;
        navigation.removeEventListener("navigate", handleNavigate);
        navigation.removeEventListener("navigatesuccess", handleNavigateComplete);
        navigation.removeEventListener("navigateerror", handleNavigateComplete);
        null !== pendingResolve && (pendingResolve(), pendingResolve = null);
      };
    }
  }
  function ReactDOMRoot(internalRoot) {
    this._internalRoot = internalRoot;
  }
  ReactDOMHydrationRoot.prototype.render = ReactDOMRoot.prototype.render = function(children) {
    var root2 = this._internalRoot;
    if (null === root2) throw Error(formatProdErrorMessage(409));
    var current = root2.current, lane = requestUpdateLane();
    updateContainerImpl(current, lane, children, root2, null, null);
  };
  ReactDOMHydrationRoot.prototype.unmount = ReactDOMRoot.prototype.unmount = function() {
    var root2 = this._internalRoot;
    if (null !== root2) {
      this._internalRoot = null;
      var container = root2.containerInfo;
      updateContainerImpl(root2.current, 2, null, root2, null, null);
      flushSyncWork$1();
      container[internalContainerInstanceKey] = null;
    }
  };
  function ReactDOMHydrationRoot(internalRoot) {
    this._internalRoot = internalRoot;
  }
  ReactDOMHydrationRoot.prototype.unstable_scheduleHydration = function(target) {
    if (target) {
      var updatePriority = resolveUpdatePriority();
      target = { blockedOn: null, target, priority: updatePriority };
      for (var i = 0; i < queuedExplicitHydrationTargets.length && 0 !== updatePriority && updatePriority < queuedExplicitHydrationTargets[i].priority; i++) ;
      queuedExplicitHydrationTargets.splice(i, 0, target);
      0 === i && attemptExplicitHydrationTarget(target);
    }
  };
  var isomorphicReactPackageVersion$jscomp$inline_1840 = React.version;
  if ("19.2.7" !== isomorphicReactPackageVersion$jscomp$inline_1840)
    throw Error(
      formatProdErrorMessage(
        527,
        isomorphicReactPackageVersion$jscomp$inline_1840,
        "19.2.7"
      )
    );
  ReactDOMSharedInternals.findDOMNode = function(componentOrElement) {
    var fiber = componentOrElement._reactInternals;
    if (void 0 === fiber) {
      if ("function" === typeof componentOrElement.render)
        throw Error(formatProdErrorMessage(188));
      componentOrElement = Object.keys(componentOrElement).join(",");
      throw Error(formatProdErrorMessage(268, componentOrElement));
    }
    componentOrElement = findCurrentFiberUsingSlowPath(fiber);
    componentOrElement = null !== componentOrElement ? findCurrentHostFiberImpl(componentOrElement) : null;
    componentOrElement = null === componentOrElement ? null : componentOrElement.stateNode;
    return componentOrElement;
  };
  var internals$jscomp$inline_2347 = {
    bundleType: 0,
    version: "19.2.7",
    rendererPackageName: "react-dom",
    currentDispatcherRef: ReactSharedInternals,
    reconcilerVersion: "19.2.7"
  };
  if ("undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__) {
    var hook$jscomp$inline_2348 = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!hook$jscomp$inline_2348.isDisabled && hook$jscomp$inline_2348.supportsFiber)
      try {
        rendererID = hook$jscomp$inline_2348.inject(
          internals$jscomp$inline_2347
        ), injectedHook = hook$jscomp$inline_2348;
      } catch (err) {
      }
  }
  reactDomClient_production.createRoot = function(container, options2) {
    if (!isValidContainer(container)) throw Error(formatProdErrorMessage(299));
    var isStrictMode = false, identifierPrefix = "", onUncaughtError = defaultOnUncaughtError, onCaughtError = defaultOnCaughtError, onRecoverableError = defaultOnRecoverableError;
    null !== options2 && void 0 !== options2 && (true === options2.unstable_strictMode && (isStrictMode = true), void 0 !== options2.identifierPrefix && (identifierPrefix = options2.identifierPrefix), void 0 !== options2.onUncaughtError && (onUncaughtError = options2.onUncaughtError), void 0 !== options2.onCaughtError && (onCaughtError = options2.onCaughtError), void 0 !== options2.onRecoverableError && (onRecoverableError = options2.onRecoverableError));
    options2 = createFiberRoot(
      container,
      1,
      false,
      null,
      null,
      isStrictMode,
      identifierPrefix,
      null,
      onUncaughtError,
      onCaughtError,
      onRecoverableError,
      defaultOnDefaultTransitionIndicator
    );
    container[internalContainerInstanceKey] = options2.current;
    listenToAllSupportedEvents(container);
    return new ReactDOMRoot(options2);
  };
  reactDomClient_production.hydrateRoot = function(container, initialChildren, options2) {
    if (!isValidContainer(container)) throw Error(formatProdErrorMessage(299));
    var isStrictMode = false, identifierPrefix = "", onUncaughtError = defaultOnUncaughtError, onCaughtError = defaultOnCaughtError, onRecoverableError = defaultOnRecoverableError, formState = null;
    null !== options2 && void 0 !== options2 && (true === options2.unstable_strictMode && (isStrictMode = true), void 0 !== options2.identifierPrefix && (identifierPrefix = options2.identifierPrefix), void 0 !== options2.onUncaughtError && (onUncaughtError = options2.onUncaughtError), void 0 !== options2.onCaughtError && (onCaughtError = options2.onCaughtError), void 0 !== options2.onRecoverableError && (onRecoverableError = options2.onRecoverableError), void 0 !== options2.formState && (formState = options2.formState));
    initialChildren = createFiberRoot(
      container,
      1,
      true,
      initialChildren,
      null != options2 ? options2 : null,
      isStrictMode,
      identifierPrefix,
      formState,
      onUncaughtError,
      onCaughtError,
      onRecoverableError,
      defaultOnDefaultTransitionIndicator
    );
    initialChildren.context = getContextForSubtree(null);
    options2 = initialChildren.current;
    isStrictMode = requestUpdateLane();
    isStrictMode = getBumpedLaneForHydrationByLane(isStrictMode);
    identifierPrefix = createUpdate(isStrictMode);
    identifierPrefix.callback = null;
    enqueueUpdate(options2, identifierPrefix, isStrictMode);
    options2 = isStrictMode;
    initialChildren.current.lanes = options2;
    markRootUpdated$1(initialChildren, options2);
    ensureRootIsScheduled(initialChildren);
    container[internalContainerInstanceKey] = initialChildren.current;
    listenToAllSupportedEvents(container);
    return new ReactDOMHydrationRoot(initialChildren);
  };
  reactDomClient_production.version = "19.2.7";
  return reactDomClient_production;
}
var hasRequiredClient;
function requireClient() {
  if (hasRequiredClient) return client.exports;
  hasRequiredClient = 1;
  function checkDCE() {
    if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function") {
      return;
    }
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
    } catch (err) {
      console.error(err);
    }
  }
  {
    checkDCE();
    client.exports = requireReactDomClient_production();
  }
  return client.exports;
}
var clientExports = requireClient();
const scriptRel = "modulepreload";
const assetsURL = function(dep, importerUrl) {
  return new URL(dep, importerUrl).href;
};
const seen = {};
const __vitePreload = function preload(baseModule, deps, importerUrl) {
  let promise = Promise.resolve();
  if (deps && deps.length > 0) {
    let allSettled = function(promises$2) {
      return Promise.all(promises$2.map((p) => Promise.resolve(p).then((value$1) => ({
        status: "fulfilled",
        value: value$1
      }), (reason) => ({
        status: "rejected",
        reason
      }))));
    };
    const links = document.getElementsByTagName("link");
    const cspNonceMeta = document.querySelector("meta[property=csp-nonce]");
    const cspNonce = cspNonceMeta?.nonce || cspNonceMeta?.getAttribute("nonce");
    promise = allSettled(deps.map((dep) => {
      dep = assetsURL(dep, importerUrl);
      if (dep in seen) return;
      seen[dep] = true;
      const isCss = dep.endsWith(".css");
      const cssSelector = isCss ? '[rel="stylesheet"]' : "";
      if (!!importerUrl) for (let i$1 = links.length - 1; i$1 >= 0; i$1--) {
        const link$1 = links[i$1];
        if (link$1.href === dep && (!isCss || link$1.rel === "stylesheet")) return;
      }
      else if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) return;
      const link = document.createElement("link");
      link.rel = isCss ? "stylesheet" : scriptRel;
      if (!isCss) link.as = "script";
      link.crossOrigin = "";
      link.href = dep;
      if (cspNonce) link.setAttribute("nonce", cspNonce);
      document.head.appendChild(link);
      if (isCss) return new Promise((res, rej) => {
        link.addEventListener("load", res);
        link.addEventListener("error", () => rej(/* @__PURE__ */ new Error(`Unable to preload CSS for ${dep}`)));
      });
    }));
  }
  function handlePreloadError(err$2) {
    const e$1 = new Event("vite:preloadError", { cancelable: true });
    e$1.payload = err$2;
    window.dispatchEvent(e$1);
    if (!e$1.defaultPrevented) throw err$2;
  }
  return promise.then((res) => {
    for (const item of res || []) {
      if (item.status !== "rejected") continue;
      handlePreloadError(item.reason);
    }
    return baseModule().catch(handlePreloadError);
  });
};
const initialDocuments = [
  {
    id: 1,
    title: "深度学习报告",
    location: "我的空间/研究",
    owner: "张三",
    createdAt: "2026-04-15 10:30",
    visitedAt: "2026-04-15 10:30",
    size: "1.3 MB",
    kind: "在线文档",
    favorite: false,
    owned: true,
    shared: false,
    description: "汇总卷积神经网络、注意力机制与科研数据分类实验，对不同模型的准确率和训练效率进行比较。",
    keywords: ["深度学习", "注意力机制", "模型训练", "科研数据"],
    content: "实验采用统一的数据集划分和随机种子，对卷积网络与注意力模型进行对照。结果显示，小样本条件下注意力机制提升了分类准确率，但训练稳定性仍需通过消融实验进一步验证。"
  },
  {
    id: 2,
    title: "科研项目进度表",
    location: "AI研究团队/管理",
    owner: "李四",
    createdAt: "2026-04-15 10:30",
    visitedAt: "2026-04-15 10:30",
    size: "2.3 MB",
    kind: "在线文档",
    favorite: true,
    owned: true,
    shared: true,
    description: "记录 AI 研究团队的阶段目标、实验排期、负责人以及风险跟踪情况。",
    keywords: ["项目管理", "里程碑", "实验排期", "AI研究团队"],
    content: "本阶段完成数据清洗和基线模型复现，下一里程碑为特征工程与模型调优。样本标注数量不足被列为主要风险项，需要明确补充数据的来源、负责人和完成时间。"
  },
  {
    id: 3,
    title: "项目需求文档",
    location: "产品研发部/产品",
    owner: "王五",
    createdAt: "2026-04-15 10:30",
    visitedAt: "2026-04-15 10:30",
    size: "16 MB",
    kind: "PDF文档",
    favorite: false,
    owned: true,
    shared: false,
    description: "面向科研协作平台整理用户需求、核心流程、权限模型和交付验收标准。",
    keywords: ["产品需求", "权限", "协作", "验收标准"],
    content: "平台需要支持科研资料集中管理、团队协作和跨内容检索。用户可搜索文档信息和笔记正文，搜索结果必须标明来源，并在权限校验后提供定位操作。"
  },
  {
    id: 4,
    title: "实验数据分析",
    location: "产品研发部/产品",
    owner: "王五",
    createdAt: "2026-04-15 10:30",
    visitedAt: "2026-04-15 10:30",
    size: "856 KB",
    kind: "Word文档",
    favorite: false,
    owned: false,
    shared: true,
    description: "整理电化学实验数据，包含异常值处理、统计检验与关键指标对比。",
    keywords: ["实验数据", "异常值", "统计分析", "电化学"],
    content: "循环测试数据按温度、倍率和材料批次分组。异常值使用四分位距方法标记，不直接删除原始记录，并同时输出处理前后的统计指标作为对照。"
  },
  {
    id: 5,
    title: "技术架构设计",
    location: "产品研发部/产品",
    owner: "王五",
    createdAt: "2026-04-15 10:30",
    visitedAt: "2026-04-15 10:30",
    size: "4.6 MB",
    kind: "Excel文档",
    favorite: false,
    owned: false,
    shared: true,
    description: "说明科研门户的前端、服务层、检索索引和权限模块之间的技术关系。",
    keywords: ["技术架构", "检索索引", "权限模块", "服务层"],
    content: "系统采用分层架构，前端负责交互与状态反馈，服务层统一编排空间、文档与笔记数据。检索请求先执行权限过滤，再进行相关性排序和高亮摘要生成。"
  },
  {
    id: 6,
    title: "文献综述整理",
    location: "产品研发部/产品",
    owner: "王五",
    createdAt: "2026-04-15 10:30",
    visitedAt: "2026-04-15 10:30",
    size: "5.0 MB",
    kind: "Excel文档",
    favorite: false,
    owned: false,
    shared: true,
    description: "围绕储能材料与锂硫电池方向归纳代表性研究、方法演进和待解决问题。",
    keywords: ["文献综述", "储能材料", "锂硫电池", "研究现状"],
    content: "现有研究主要通过多孔碳载体、极性吸附位点和催化界面抑制多硫化物穿梭效应。后续需要比较不同材料体系在高硫载量条件下的循环稳定性。"
  },
  {
    id: 7,
    title: "科研项目数据与进度表",
    location: "我的空间/研究项目",
    owner: "张研究员",
    createdAt: "2026-08-18 09:30",
    visitedAt: "2026-08-24 16:45",
    size: "18 KB",
    kind: "数据表格",
    favorite: true,
    owned: true,
    shared: true,
    description: "集中跟踪储能材料项目的实验任务、负责人、项目进度、截止日期与数据文件。",
    keywords: ["数据表格", "项目进度", "科研数据", "多人协作", "文件上传"],
    content: "储能材料项目进度、实验数据和阶段成果汇总。文献语义检索模型复现由张三负责，医学知识图谱实体标注由李四负责，实验组样本质量核验由王五负责，消融实验与误差分析由赵敏负责，基线数据清洗与去重已完成，阶段成果评审材料整理进行中。数据文件包括 retrieval-evaluation.csv、entity-annotation.xlsx、sample-qc.csv、baseline-clean-v3.csv 与 review-materials.xlsx；原始数据、分析结果与任务责任人可在表格视图和表单视图中统一管理。"
  },
  {
    id: 9,
    title: "固态电解质材料实验数据表",
    location: "科研数据管理/材料实验",
    owner: "周岚",
    createdAt: "2026-07-28 09:10",
    visitedAt: "2026-08-26 09:00",
    size: "5.2 MB",
    kind: "数据表格",
    favorite: false,
    owned: true,
    shared: true,
    description: "集中管理固态电解质实验批次、材料体系、烧结温度、电导率、测试进度与原始数据文件。",
    keywords: ["材料实验", "固态电解质", "实验批次", "离子电导率", "数据表格"],
    content: "Li₆PS₅Cl、LLZO、LATP 与 LGPS 等固态电解质材料的实验批次、性能测试、数据复核、负责人和数据文件汇总。"
  },
  {
    id: 10,
    title: "多中心临床与调研项目总表",
    location: "科研数据管理/临床调研",
    owner: "李医生",
    createdAt: "2026-07-15 08:30",
    visitedAt: "2026-08-26 09:10",
    size: "7.5 MB",
    kind: "数据表格",
    favorite: false,
    owned: true,
    shared: true,
    description: "统一监控多中心队列与调研项目的样本纳入、阶段状态、负责人、截止时间和数据文件。",
    keywords: ["临床队列", "调研项目", "多中心", "样本进度", "数据表格"],
    content: "社区高血压、糖尿病随访、睡眠质量、屏幕使用、慢阻肺依从性和基层医务人员 AI 使用等项目的跨中心进度与数据文件。"
  }
];
const initialResearchNotes = [
  {
    id: 1,
    documentId: 1,
    title: "模型训练结论",
    content: "注意力机制在小样本科研数据上的准确率提升明显，但需要继续观察过拟合和训练稳定性。下一轮补充消融实验，并统一随机种子。",
    createdAt: "2026-04-16 09:20",
    updatedAt: "2026-05-06 14:35",
    tags: ["模型训练", "实验结论"]
  },
  {
    id: 2,
    documentId: 2,
    title: "本周里程碑复盘",
    content: "数据清洗已完成，特征工程进度达到 80%。风险项是标注样本不足，需要在周三前确认新增数据来源和负责人。",
    createdAt: "2026-04-18 16:10",
    updatedAt: "2026-05-05 11:08",
    tags: ["里程碑", "风险跟踪"]
  },
  {
    id: 3,
    documentId: 3,
    title: "需求评审重点",
    content: "全文搜索需要同时覆盖文档信息与用户笔记，搜索结果应标明来源，并支持从结果返回所在空间。个人设置需保留未保存提醒。",
    createdAt: "2026-04-20 13:40",
    updatedAt: "2026-05-04 17:22",
    tags: ["需求评审", "全文搜索"]
  },
  {
    id: 4,
    documentId: 4,
    title: "异常数据处理记录",
    content: "第 7 组循环测试存在温度漂移，暂不删除原始数据。采用四分位距标记异常值，并在统计结果中保留处理前后对照。",
    createdAt: "2026-04-22 10:05",
    updatedAt: "2026-05-03 09:45",
    tags: ["实验数据", "异常值"]
  },
  {
    id: 5,
    documentId: 5,
    title: "架构选型记录",
    content: "检索索引与业务数据分层维护，权限过滤必须先于结果排序。前端只保存查询历史，不缓存无权限的文档摘要。",
    createdAt: "2026-04-24 15:18",
    updatedAt: "2026-05-02 18:30",
    tags: ["技术架构", "检索索引"]
  }
];
const initialFolders = [
  { id: 1, name: "研究项目", count: 15, updatedAt: "2026-04-30 14:20" },
  { id: 2, name: "实验数据", count: 8, updatedAt: "2026-04-30 14:20" },
  { id: 3, name: "研究项目", count: 15, updatedAt: "2026-04-30 14:20" }
];
const initialTodos = [
  { id: 1, title: "完成储能材料综述第三章初稿", due: "2024-06-28", level: "danger", done: false },
  { id: 2, title: "审阅李助理的实验数据整理报告", due: "2024-06-27", level: "warning", done: false },
  { id: 3, title: "更新锂硫电池专利数据库", due: "2024-06-25", level: "warning", done: false },
  { id: 4, title: "准备7月研讨会演讲PPT", due: "2024-07-05", level: "muted", done: false }
];
const initialComments = [
  { id: 1, author: "李助理", content: "第3章的实验参数表格需要补充原料来源信息", time: "2小时前", attachment: "储能材料专利分析报告_v3.pdf" },
  { id: 2, author: "陈博士", content: "图5的坐标轴标注有误，建议修正", time: "昨天", attachment: "锂硫电池实验数据集.xlsx" },
  { id: 3, author: "王分析师", content: "政策汇编已更新至2024年6月最新版本", time: "2天前", attachment: "深圳未来产业政策汇编.pdf" }
];
const initialMembers = [
  { id: 1, name: "张研究员", role: "管理员", initials: "张", color: "#5b8ff9", status: "在线", joinedAt: "2025-12-05" },
  { id: 2, name: "李助理", role: "编辑者", initials: "李", color: "#7c3aed", status: "在线", joinedAt: "2025-12-05" },
  { id: 3, name: "陈博士", role: "编辑者", initials: "陈", color: "#0891b2", status: "离线", joinedAt: "2025-12-02" },
  { id: 4, name: "王分析师", role: "查看员", initials: "王", color: "#f97316", status: "在线", joinedAt: "2025-12-01" },
  { id: 5, name: "刘研究员", role: "查看员", initials: "刘", color: "#14b8a6", status: "离线", joinedAt: "2025-12-01" }
];
const teamNames = ["AI研究团队", "产品研发部", "数据分析组", "技术架构组", "实验室管理"];
var reactDomExports = requireReactDom();
function KindTag({ kind }) {
  const variant = kind === "在线文档" ? "online" : kind === "数据表格" ? "sheet" : "file";
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `kind-tag kind-tag--${variant}`, children: kind });
}
const isNativeDocument = (documentItem) => documentItem.kind === "在线文档" || documentItem.kind === "数据表格";
function Pagination({
  page,
  pageSize,
  totalItems,
  onChange,
  onPageSizeChange
}) {
  const [pageSizeOpen, setPageSizeOpen] = reactExports.useState(false);
  const pageSizeRef = reactExports.useRef(null);
  const totalPages2 = Math.max(1, Math.ceil(totalItems / pageSize));
  const firstPage = Math.max(1, Math.min(page - 2, totalPages2 - 4));
  const pageNumbers = Array.from({ length: Math.min(5, totalPages2) }, (_, index) => firstPage + index);
  reactExports.useEffect(() => {
    const close = (event) => {
      if (!pageSizeRef.current?.contains(event.target)) setPageSizeOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setPageSizeOpen(false);
    };
    window.addEventListener("click", close);
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      window.removeEventListener("click", close);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pagination", "aria-label": "分页", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", disabled: page === 1, onClick: () => onChange(Math.max(1, page - 1)), "aria-label": "上一页", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "pager-chevron pager-chevron--prev", "aria-hidden": "true" }) }),
    pageNumbers.map((number) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        className: page === number ? "is-current" : "",
        onClick: () => onChange(number),
        "aria-current": page === number ? "page" : void 0,
        children: number
      },
      number
    )),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", disabled: page === totalPages2, onClick: () => onChange(Math.min(totalPages2, page + 1)), "aria-label": "下一页", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "pager-chevron", "aria-hidden": "true" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page-size", ref: pageSizeRef, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", className: `page-size-trigger${pageSizeOpen ? " is-open" : ""}`, "aria-haspopup": "listbox", "aria-expanded": pageSizeOpen, onClick: () => setPageSizeOpen((open) => !open), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          pageSize,
          "条/页"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "page-size-chevron", "aria-hidden": "true" })
      ] }),
      pageSizeOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "page-size-menu", role: "listbox", "aria-label": "每页显示数量", children: [10, 20, 50].map((size) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", role: "option", "aria-selected": pageSize === size, className: pageSize === size ? "is-active" : "", onClick: () => {
        onPageSizeChange(size);
        setPageSizeOpen(false);
      }, children: [
        size,
        "条/页"
      ] }, size)) })
    ] })
  ] });
}
function DocumentTable({
  documents,
  mode,
  workbenchTab = "recent",
  page,
  onPageChange,
  onToggleFavorite,
  onDelete,
  onShare,
  onRestore,
  onRename,
  onCreateNote,
  onOpenDocument,
  highlightedDocumentId = null
}) {
  const [spaceMenuId, setSpaceMenuId] = reactExports.useState(null);
  const [pageSize, setPageSize] = reactExports.useState(10);
  const [spaceMenuPosition, setSpaceMenuPosition] = reactExports.useState({ top: 0, left: 0 });
  const [renamingDocumentId, setRenamingDocumentId] = reactExports.useState(null);
  const [renameValue, setRenameValue] = reactExports.useState("");
  const spaceMenuRef = reactExports.useRef(null);
  const tableRegionRef = reactExports.useRef(null);
  const isWorkbench = mode === "workbench";
  const isFavorites = isWorkbench && workbenchTab === "favorites";
  const isRecycle = mode === "recycle";
  const columnCount = 4 + (isWorkbench ? 1 : 0) + (!isWorkbench && !isRecycle ? 1 : 0) + (isWorkbench ? 1 : 0) + (!isFavorites ? 1 : 0);
  const totalPages2 = Math.max(1, Math.ceil(documents.length / pageSize));
  const paginatedDocuments = documents.slice((page - 1) * pageSize, page * pageSize);
  reactExports.useEffect(() => {
    if (page > totalPages2) onPageChange(totalPages2);
  }, [onPageChange, page, totalPages2]);
  reactExports.useEffect(() => {
    if (spaceMenuId == null) return;
    const close = () => setSpaceMenuId(null);
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setSpaceMenuId(null);
    };
    const focusTimer = window.setTimeout(() => spaceMenuRef.current?.querySelector("button")?.focus(), 0);
    window.addEventListener("click", close);
    window.addEventListener("keydown", closeOnEscape);
    window.addEventListener("resize", close);
    window.addEventListener("scroll", close, true);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("click", close);
      window.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("resize", close);
      window.removeEventListener("scroll", close, true);
    };
  }, [spaceMenuId]);
  reactExports.useEffect(() => {
    if (highlightedDocumentId == null) return;
    const frame = window.requestAnimationFrame(() => {
      tableRegionRef.current?.querySelector(`[data-document-id="${highlightedDocumentId}"]`)?.scrollIntoView({ block: "nearest", inline: "nearest" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [highlightedDocumentId]);
  const openSpaceMenu = (event, documentId) => {
    event.stopPropagation();
    if (spaceMenuId === documentId) {
      setSpaceMenuId(null);
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    const menuWidth = 96;
    const menuDocument = documents.find((item) => item.id === documentId);
    const menuHeight = menuDocument && isNativeDocument(menuDocument) ? 266 : 224;
    const viewportGap = 8;
    const left = Math.min(window.innerWidth - menuWidth - viewportGap, Math.max(viewportGap, rect.right - menuWidth));
    const belowTop = rect.bottom + 2;
    const top = belowTop + menuHeight <= window.innerHeight - viewportGap ? belowTop : Math.max(viewportGap, rect.top - menuHeight - 2);
    setSpaceMenuPosition({ top, left });
    setSpaceMenuId(documentId);
  };
  const beginRename = (documentItem) => {
    setRenamingDocumentId(documentItem.id);
    setRenameValue(documentItem.title);
    setSpaceMenuId(null);
  };
  const finishRename = (documentItem) => {
    const nextTitle = renameValue.trim();
    if (nextTitle && nextTitle !== documentItem.title) onRename?.(documentItem.id, nextTitle);
    setRenamingDocumentId(null);
    setRenameValue("");
  };
  const downloadFallback = (documentItem) => {
    const body = `${documentItem.title}

${documentItem.content?.trim() || "暂无正文内容"}

所有者：${documentItem.owner}
类型：${documentItem.kind}`;
    const url = URL.createObjectURL(new Blob([body], { type: "text/plain;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${documentItem.title}.txt`;
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "table-region", ref: tableRegionRef, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "table-scroll", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "document-table", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "标题" }),
        isWorkbench && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "位置" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "所有者" }),
        !isWorkbench && !isRecycle && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "大小" }),
        isWorkbench && !isFavorites && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "创建时间" }),
        isFavorites && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "收藏时间" }),
        !isFavorites && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: isRecycle ? "删除时间" : "最近访问" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "文档属性" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "操作" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: documents.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "empty-cell", colSpan: columnCount, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "empty-mark", children: "⌁" }),
        "暂无文档"
      ] }) }) : paginatedDocuments.map((doc) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "tr",
        {
          "data-document-id": doc.id,
          className: highlightedDocumentId === doc.id ? "is-search-target" : void 0,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "title-cell", children: renamingDocumentId === doc.id ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                className: "document-title-rename",
                value: renameValue,
                autoFocus: true,
                maxLength: 50,
                "aria-label": "文档新名称",
                onChange: (event) => setRenameValue(event.target.value),
                onBlur: () => finishRename(doc),
                onKeyDown: (event) => {
                  if (event.key === "Enter") finishRename(doc);
                  if (event.key === "Escape") {
                    setRenamingDocumentId(null);
                    setRenameValue("");
                  }
                }
              }
            ) : isNativeDocument(doc) && !isRecycle && onOpenDocument ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                className: `document-title-link${doc.kind === "数据表格" ? " document-title-link--sheet" : ""}`,
                type: "button",
                onClick: () => onOpenDocument(doc),
                "aria-label": `${doc.kind === "数据表格" ? "打开表格" : "编辑"}“${doc.title}”`,
                children: [
                  doc.kind === "数据表格" && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { className: "document-title-sheet-icon", src: "./assets/document-sheet.svg", alt: "", width: "18", height: "18" }),
                  doc.title
                ]
              }
            ) : doc.title }),
            isWorkbench && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: doc.location }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "owner-cell", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "./assets/avatar-owner.svg", alt: "" }),
              doc.owner
            ] }) }),
            !isWorkbench && !isRecycle && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: doc.size }),
            isWorkbench && !isFavorites && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: doc.createdAt }),
            isFavorites && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: doc.createdAt }),
            !isFavorites && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: doc.visitedAt }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(KindTag, { kind: doc.kind }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "row-actions", children: isRecycle ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => onRestore?.(doc.id), children: "恢复" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "danger-link", type: "button", onClick: () => onDelete(doc.id), children: "彻底删除" })
            ] }) : isWorkbench ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              workbenchTab === "owned" || workbenchTab === "shared" ? /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => onShare(doc.id), children: "共享到团队" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => onToggleFavorite(doc.id), children: workbenchTab === "favorites" || doc.favorite ? "取消收藏" : "收藏" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "danger-link", type: "button", onClick: () => onDelete(doc.id), children: workbenchTab === "recent" && doc.id !== 1 ? "从列表移除" : "删除" })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => onShare(doc.id), children: "分享" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "document-space-menu-wrap", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "more-button", type: "button", "aria-label": `${doc.title}更多操作`, "aria-haspopup": "menu", "aria-expanded": spaceMenuId === doc.id, onClick: (event) => openSpaceMenu(event, doc.id), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "more-dots", "aria-hidden": "true", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("i", {}),
                /* @__PURE__ */ jsxRuntimeExports.jsx("i", {}),
                /* @__PURE__ */ jsxRuntimeExports.jsx("i", {})
              ] }) }) })
            ] }) }) })
          ]
        },
        doc.id
      )) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Pagination,
      {
        page,
        pageSize,
        totalItems: documents.length,
        onChange: onPageChange,
        onPageSizeChange: (size) => {
          setPageSize(size);
          onPageChange(1);
        }
      }
    ),
    spaceMenuId != null && typeof document !== "undefined" && reactDomExports.createPortal((() => {
      const documentItem = documents.find((item) => item.id === spaceMenuId);
      if (!documentItem) return null;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "document-space-menu",
          ref: spaceMenuRef,
          role: "menu",
          "aria-label": `${documentItem.title}更多操作`,
          style: { top: spaceMenuPosition.top, left: spaceMenuPosition.left },
          onClick: (event) => event.stopPropagation(),
          children: [
            isNativeDocument(documentItem) && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", role: "menuitem", onClick: () => {
              onOpenDocument?.(documentItem);
              setSpaceMenuId(null);
            }, children: documentItem.kind === "数据表格" ? "打开表格" : "编辑文档" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", role: "menuitem", onClick: () => {
              onCreateNote?.(documentItem);
              setSpaceMenuId(null);
            }, children: "笔记" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", role: "menuitem", onClick: () => {
              onToggleFavorite(documentItem.id);
              setSpaceMenuId(null);
            }, children: documentItem.favorite ? "取消收藏" : "收藏" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", role: "menuitem", onClick: () => {
              downloadFallback(documentItem);
              setSpaceMenuId(null);
            }, children: "下载" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", role: "menuitem", onClick: () => beginRename(documentItem), children: "重命名" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", role: "menuitem", className: "danger-link", onClick: () => {
              onDelete(documentItem.id);
              setSpaceMenuId(null);
            }, children: "删除" })
          ]
        }
      );
    })(), document.body)
  ] });
}
const STORAGE_KEY$2 = "intelligent-research-portal:data-tables:v1";
const STORAGE_VERSION$2 = 1;
const MAX_STORAGE_CHARACTERS$1 = 42e5;
const MAX_ATTACHMENTS = 30;
const MAX_COLLABORATORS = 50;
const MAX_DATA_URL_CHARACTERS = 29e5;
const safeAttachmentDataUrl = /^data:(?:text\/(?:csv|tab-separated-values|plain)|application\/(?:json|csv|vnd\.ms-excel|vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet|octet-stream))(?:;[^,]*)?;base64,[a-z0-9+/=]+$/i;
const DATA_TABLE_IMPORT_LIMITS = {
  maxFileBytes: 2 * 1024 * 1024,
  maxRows: 500,
  maxColumns: 30,
  maxCellCharacters: 2e3
};
const columnTypes = /* @__PURE__ */ new Set(["text", "number", "select", "date", "percent", "file"]);
const shareAccessValues = /* @__PURE__ */ new Set(["private", "team-view", "team-edit"]);
let generatedIdCounter = 0;
const cleanString$1 = (value, maximum) => typeof value === "string" ? value.slice(0, maximum) : "";
const cleanTimestamp = (value, fallback) => {
  const candidate = cleanString$1(value, 40).trim();
  return candidate || fallback;
};
const formatTimestamp = (date = /* @__PURE__ */ new Date()) => {
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};
const createId = (prefix) => {
  generatedIdCounter += 1;
  return `${prefix}-${Date.now().toString(36)}-${generatedIdCounter.toString(36)}`;
};
const uniqueStrings = (values, maximum, itemMaximum) => {
  if (!Array.isArray(values)) return [];
  const seen2 = /* @__PURE__ */ new Set();
  return values.slice(0, maximum).flatMap((value) => {
    const candidate = cleanString$1(value, itemMaximum).trim();
    const key = candidate.toLocaleLowerCase();
    if (!candidate || seen2.has(key)) return [];
    seen2.add(key);
    return [candidate];
  });
};
const projectProgressColumns = () => [
  { id: "project", name: "项目 / 任务", type: "text", required: true },
  { id: "owner", name: "负责人", type: "text", required: true },
  { id: "status", name: "状态", type: "select", required: true, options: ["未开始", "进行中", "有风险", "已完成"] },
  { id: "progress", name: "进度", type: "percent", required: true },
  { id: "dueDate", name: "截止日期", type: "date", required: false },
  { id: "dataFile", name: "数据文件", type: "file", required: false }
];
const researchDataColumns = () => [
  { id: "sample", name: "数据 / 样本名称", type: "text", required: true },
  { id: "category", name: "数据类型", type: "select", required: true, options: ["原始数据", "实验数据", "分析结果", "其他"] },
  { id: "value", name: "数值 / 结果", type: "text", required: false },
  { id: "unit", name: "单位", type: "text", required: false },
  { id: "owner", name: "记录人", type: "text", required: true },
  { id: "collectedAt", name: "采集日期", type: "date", required: false },
  { id: "dataFile", name: "数据文件", type: "file", required: false }
];
const cloneResearchDataTable = (table) => ({
  ...table,
  columns: table.columns.map((column) => ({
    ...column,
    options: column.options ? [...column.options] : void 0
  })),
  rows: table.rows.map((row) => ({ ...row, values: { ...row.values } })),
  attachments: table.attachments.map((attachment) => ({ ...attachment })),
  share: { ...table.share, collaborators: [...table.share.collaborators] }
});
const sanitizeColumns = (value) => {
  if (!Array.isArray(value)) return [];
  const usedIds = /* @__PURE__ */ new Set();
  const usedNames = /* @__PURE__ */ new Set();
  return value.slice(0, DATA_TABLE_IMPORT_LIMITS.maxColumns).flatMap((entry, index) => {
    if (!entry || typeof entry !== "object") return [];
    const column = entry;
    const name = cleanString$1(column.name, 80).trim();
    const nameKey = name.toLocaleLowerCase();
    if (!name || usedNames.has(nameKey) || !columnTypes.has(column.type)) return [];
    const rawId = cleanString$1(column.id, 80).trim() || `column-${index + 1}`;
    let id = rawId;
    let suffix = 2;
    while (usedIds.has(id)) {
      id = `${rawId}-${suffix}`;
      suffix += 1;
    }
    usedIds.add(id);
    usedNames.add(nameKey);
    const type = column.type;
    const options = type === "select" ? uniqueStrings(column.options, 30, 60) : void 0;
    return [{ id, name, type, required: Boolean(column.required), ...options?.length ? { options } : {} }];
  });
};
const sanitizeRows = (value, columns, fallbackTimestamp) => {
  if (!Array.isArray(value)) return [];
  const usedIds = /* @__PURE__ */ new Set();
  const allowedColumnIds = new Set(columns.map((column) => column.id));
  return value.slice(0, DATA_TABLE_IMPORT_LIMITS.maxRows).flatMap((entry, index) => {
    if (!entry || typeof entry !== "object") return [];
    const row = entry;
    const rawId = cleanString$1(row.id, 100).trim() || `row-${index + 1}`;
    let id = rawId;
    let suffix = 2;
    while (usedIds.has(id)) {
      id = `${rawId}-${suffix}`;
      suffix += 1;
    }
    usedIds.add(id);
    const rawValues = row.values && typeof row.values === "object" ? row.values : {};
    const values = Object.fromEntries(
      Object.entries(rawValues).filter(([columnId]) => allowedColumnIds.has(columnId)).map(([columnId, cell]) => [columnId, cleanString$1(cell, DATA_TABLE_IMPORT_LIMITS.maxCellCharacters)])
    );
    return [{
      id,
      values,
      updatedAt: cleanTimestamp(row.updatedAt, fallbackTimestamp),
      updatedBy: cleanString$1(row.updatedBy, 60).trim() || "未知用户"
    }];
  });
};
const sanitizeAttachment = (value, fallbackTimestamp) => {
  if (!value || typeof value !== "object") return null;
  const attachment = value;
  const name = cleanString$1(attachment.name, 180).trim();
  const size = Number(attachment.size);
  if (!name || !Number.isFinite(size) || size < 0 || size > DATA_TABLE_IMPORT_LIMITS.maxFileBytes) return null;
  const rawDataUrl = cleanString$1(attachment.dataUrl, MAX_DATA_URL_CHARACTERS);
  const dataUrl = safeAttachmentDataUrl.test(rawDataUrl) ? rawDataUrl : void 0;
  const source = attachment.source === "import" ? "import" : "upload";
  return {
    id: cleanString$1(attachment.id, 100).trim() || createId("attachment"),
    name,
    size,
    mimeType: cleanString$1(attachment.mimeType, 120).trim() || "application/octet-stream",
    uploadedAt: cleanTimestamp(attachment.uploadedAt, fallbackTimestamp),
    uploadedBy: cleanString$1(attachment.uploadedBy, 60).trim() || "未知用户",
    rowCount: Math.max(0, Math.min(DATA_TABLE_IMPORT_LIMITS.maxRows, Math.trunc(Number(attachment.rowCount) || 0))),
    source,
    ...dataUrl ? { dataUrl } : {},
    ...typeof attachment.previewText === "string" ? { previewText: attachment.previewText.slice(0, 2e4) } : {}
  };
};
const sanitizeShare = (value, fallbackTimestamp, fallbackActor) => {
  const share = value && typeof value === "object" ? value : {};
  const access = shareAccessValues.has(share.access) ? share.access : "private";
  return {
    access,
    collaborators: uniqueStrings(share.collaborators, MAX_COLLABORATORS, 60),
    updatedAt: cleanTimestamp(share.updatedAt, fallbackTimestamp),
    updatedBy: cleanString$1(share.updatedBy, 60).trim() || fallbackActor
  };
};
const sanitizeResearchDataTable = (value) => {
  if (!value || typeof value !== "object") return null;
  const table = value;
  const documentId = Number(table.documentId);
  if (!Number.isInteger(documentId) || documentId <= 0) return null;
  const template = table.template === "research-data" ? "research-data" : "project-progress";
  const columns = sanitizeColumns(table.columns);
  if (!columns.length) return null;
  const fallbackTimestamp = formatTimestamp();
  const updatedBy = cleanString$1(table.updatedBy, 60).trim() || "未知用户";
  const attachments = Array.isArray(table.attachments) ? table.attachments.slice(0, MAX_ATTACHMENTS).map((attachment) => sanitizeAttachment(attachment, fallbackTimestamp)).filter((attachment) => attachment != null) : [];
  return {
    documentId,
    template,
    columns,
    rows: sanitizeRows(table.rows, columns, fallbackTimestamp),
    attachments,
    share: sanitizeShare(table.share, fallbackTimestamp, updatedBy),
    createdAt: cleanTimestamp(table.createdAt, fallbackTimestamp),
    updatedAt: cleanTimestamp(table.updatedAt, fallbackTimestamp),
    updatedBy
  };
};
const createBlankResearchDataTable = (documentId, template = "project-progress", actor = "张三", timestamp = formatTimestamp()) => {
  if (!Number.isInteger(documentId) || documentId <= 0) {
    throw new Error("数据表格必须关联有效文档。");
  }
  const safeActor = actor.trim().slice(0, 60) || "未知用户";
  return {
    documentId,
    template,
    columns: template === "research-data" ? researchDataColumns() : projectProgressColumns(),
    rows: [],
    attachments: [],
    share: {
      access: "private",
      collaborators: [],
      updatedAt: timestamp,
      updatedBy: safeActor
    },
    createdAt: timestamp,
    updatedAt: timestamp,
    updatedBy: safeActor
  };
};
const createDemoResearchDataTable = (documentId = 7) => {
  const timestamp = "2026-08-25 10:30";
  const table = createBlankResearchDataTable(documentId, "project-progress", "张三", "2026-08-18 09:20");
  const rows = [
    {
      id: "progress-row-1",
      values: { project: "文献语义检索模型复现", owner: "张三", status: "进行中", progress: "72", dueDate: "2026-09-12", dataFile: "retrieval-evaluation.csv" },
      updatedAt: timestamp,
      updatedBy: "张三"
    },
    {
      id: "progress-row-2",
      values: { project: "医学知识图谱实体标注", owner: "李四", status: "进行中", progress: "58", dueDate: "2026-09-20", dataFile: "entity-annotation.xlsx" },
      updatedAt: "2026-08-24 16:10",
      updatedBy: "李四"
    },
    {
      id: "progress-row-3",
      values: { project: "实验组样本质量核验", owner: "王五", status: "有风险", progress: "41", dueDate: "2026-08-30", dataFile: "sample-qc.csv" },
      updatedAt: "2026-08-24 11:45",
      updatedBy: "王五"
    },
    {
      id: "progress-row-4",
      values: { project: "消融实验与误差分析", owner: "赵敏", status: "未开始", progress: "0", dueDate: "2026-10-08", dataFile: "" },
      updatedAt: "2026-08-23 14:20",
      updatedBy: "赵敏"
    },
    {
      id: "progress-row-5",
      values: { project: "基线数据清洗与去重", owner: "陈晨", status: "已完成", progress: "100", dueDate: "2026-08-22", dataFile: "baseline-clean-v3.csv" },
      updatedAt: "2026-08-22 18:05",
      updatedBy: "陈晨"
    },
    {
      id: "progress-row-6",
      values: { project: "阶段成果评审材料整理", owner: "张三", status: "进行中", progress: "86", dueDate: "2026-08-28", dataFile: "review-materials.xlsx" },
      updatedAt: "2026-08-25 09:35",
      updatedBy: "张三"
    }
  ];
  return {
    ...table,
    rows,
    attachments: [
      {
        id: "demo-attachment-1",
        name: "retrieval-evaluation.csv",
        size: 184320,
        mimeType: "text/csv",
        uploadedAt: "2026-08-25 09:40",
        uploadedBy: "张三",
        rowCount: 126,
        source: "import",
        previewText: "query_id,precision,recall\nQ001,0.86,0.82\nQ002,0.91,0.88"
      },
      {
        id: "demo-attachment-2",
        name: "entity-annotation.xlsx",
        size: 842752,
        mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        uploadedAt: "2026-08-24 16:10",
        uploadedBy: "李四",
        rowCount: 238,
        source: "upload"
      },
      {
        id: "demo-attachment-3",
        name: "sample-qc.csv",
        size: 96256,
        mimeType: "text/csv",
        uploadedAt: "2026-08-24 11:45",
        uploadedBy: "王五",
        rowCount: 64,
        source: "import",
        previewText: "sample_id,completeness,quality_flag\nS001,98.4,pass\nS002,72.1,review"
      }
    ],
    share: {
      access: "team-edit",
      collaborators: ["李四", "王五", "赵敏", "陈晨"],
      updatedAt: "2026-08-25 09:50",
      updatedBy: "张三"
    },
    updatedAt: timestamp,
    updatedBy: "张三"
  };
};
const createMaterialsExperimentDataTable = (documentId = 9) => {
  const table = createBlankResearchDataTable(documentId, "research-data", "周岚", "2026-07-28 09:10");
  const columns = [
    { id: "batch", name: "实验批次", type: "text", required: true },
    { id: "material", name: "材料体系", type: "text", required: true },
    { id: "temperature", name: "烧结温度（℃）", type: "number", required: true },
    { id: "conductivity", name: "室温离子电导率（mS/cm）", type: "number", required: true },
    { id: "owner", name: "负责人", type: "text", required: true },
    { id: "status", name: "实验状态", type: "select", required: true, options: ["样品制备", "性能测试", "数据复核", "有风险", "已完成"] },
    { id: "progress", name: "实验进度", type: "percent", required: true },
    { id: "testDate", name: "测试日期", type: "date", required: true },
    { id: "dataFile", name: "数据文件", type: "file", required: true }
  ];
  const rows = [
    {
      id: "material-row-1",
      values: { batch: "MSE-2608-01", material: "Li₆PS₅Cl", temperature: "550", conductivity: "3.82", owner: "周岚", status: "已完成", progress: "100", testDate: "2026-08-03", dataFile: "MSE-2608-01-impedance.csv" },
      updatedAt: "2026-08-04 10:20",
      updatedBy: "周岚"
    },
    {
      id: "material-row-2",
      values: { batch: "MSE-2608-02", material: "Li₆PS₅Cl-0.2LiI", temperature: "520", conductivity: "4.31", owner: "孙昊", status: "数据复核", progress: "92", testDate: "2026-08-08", dataFile: "MSE-2608-02-cycle.xlsx" },
      updatedAt: "2026-08-24 15:45",
      updatedBy: "孙昊"
    },
    {
      id: "material-row-3",
      values: { batch: "MSE-2608-03", material: "LLZO-Ta0.2", temperature: "1180", conductivity: "0.86", owner: "周岚", status: "性能测试", progress: "68", testDate: "2026-08-15", dataFile: "MSE-2608-03-eis.csv" },
      updatedAt: "2026-08-25 11:30",
      updatedBy: "周岚"
    },
    {
      id: "material-row-4",
      values: { batch: "MSE-2608-04", material: "LATP-Al0.3", temperature: "850", conductivity: "1.24", owner: "韩梅", status: "性能测试", progress: "55", testDate: "2026-08-18", dataFile: "MSE-2608-04-xrd.csv" },
      updatedAt: "2026-08-25 14:10",
      updatedBy: "韩梅"
    },
    {
      id: "material-row-5",
      values: { batch: "MSE-2608-05", material: "LPSCl-CPE 复合电解质", temperature: "180", conductivity: "2.16", owner: "孙昊", status: "样品制备", progress: "34", testDate: "2026-08-22", dataFile: "MSE-2608-05-formulation.xlsx" },
      updatedAt: "2026-08-25 16:25",
      updatedBy: "孙昊"
    },
    {
      id: "material-row-6",
      values: { batch: "MSE-2608-06", material: "LGPS-Si0.1", temperature: "620", conductivity: "5.02", owner: "韩梅", status: "有风险", progress: "47", testDate: "2026-08-24", dataFile: "MSE-2608-06-stability.csv" },
      updatedAt: "2026-08-26 08:50",
      updatedBy: "韩梅"
    }
  ];
  const attachments = [
    { id: "material-file-1", name: "MSE-2608-01-impedance.csv", size: 286720, mimeType: "text/csv", uploadedAt: "2026-08-04 10:20", uploadedBy: "周岚", rowCount: 96, source: "import", previewText: "frequency_hz,z_real,z_imag\n1000000,12.4,-1.8\n100000,13.1,-3.2" },
    { id: "material-file-2", name: "MSE-2608-02-cycle.xlsx", size: 1248256, mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", uploadedAt: "2026-08-24 15:45", uploadedBy: "孙昊", rowCount: 220, source: "upload" },
    { id: "material-file-3", name: "MSE-2608-03-eis.csv", size: 338944, mimeType: "text/csv", uploadedAt: "2026-08-25 11:30", uploadedBy: "周岚", rowCount: 112, source: "import", previewText: "frequency_hz,z_real,z_imag\n1000000,18.2,-2.1\n100000,19.7,-4.6" },
    { id: "material-file-4", name: "MSE-2608-04-xrd.csv", size: 724992, mimeType: "text/csv", uploadedAt: "2026-08-25 14:10", uploadedBy: "韩梅", rowCount: 360, source: "import", previewText: "two_theta,intensity\n10.00,126\n10.02,131" },
    { id: "material-file-5", name: "MSE-2608-05-formulation.xlsx", size: 958464, mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", uploadedAt: "2026-08-25 16:25", uploadedBy: "孙昊", rowCount: 48, source: "upload" },
    { id: "material-file-6", name: "MSE-2608-06-stability.csv", size: 412672, mimeType: "text/csv", uploadedAt: "2026-08-26 08:50", uploadedBy: "韩梅", rowCount: 144, source: "import", previewText: "time_h,conductivity,retention\n0,5.02,100\n24,4.76,94.8" }
  ];
  return {
    ...table,
    columns,
    rows,
    attachments,
    share: {
      access: "team-edit",
      collaborators: ["孙昊", "韩梅", "林工"],
      updatedAt: "2026-08-26 09:00",
      updatedBy: "周岚"
    },
    updatedAt: "2026-08-26 09:00",
    updatedBy: "周岚"
  };
};
const createClinicalSurveyDataTable = (documentId = 10) => {
  const table = createBlankResearchDataTable(documentId, "project-progress", "李医生", "2026-07-15 08:30");
  const columns = [
    { id: "project", name: "队列 / 调研任务", type: "text", required: true },
    { id: "site", name: "中心 / 地区", type: "text", required: true },
    { id: "sampleSize", name: "已纳入样本", type: "number", required: true },
    { id: "owner", name: "负责人", type: "text", required: true },
    { id: "status", name: "项目状态", type: "select", required: true, options: ["招募中", "随访中", "数据清洗", "有风险", "已完成"] },
    { id: "progress", name: "项目进度", type: "percent", required: true },
    { id: "dueDate", name: "阶段截止日期", type: "date", required: true },
    { id: "dataFile", name: "数据文件", type: "file", required: true }
  ];
  const rows = [
    {
      id: "clinical-row-1",
      values: { project: "社区高血压基线队列", site: "上海中心", sampleSize: "326", owner: "李医生", status: "数据清洗", progress: "82", dueDate: "2026-09-05", dataFile: "hypertension-baseline-sh.xlsx" },
      updatedAt: "2026-08-25 17:20",
      updatedBy: "李医生"
    },
    {
      id: "clinical-row-2",
      values: { project: "2 型糖尿病生活方式随访", site: "江苏中心", sampleSize: "248", owner: "王医生", status: "随访中", progress: "64", dueDate: "2026-10-15", dataFile: "diabetes-followup-js.csv" },
      updatedAt: "2026-08-25 13:40",
      updatedBy: "王医生"
    },
    {
      id: "clinical-row-3",
      values: { project: "老年睡眠质量横断面调查", site: "浙江中心", sampleSize: "412", owner: "陈研究员", status: "已完成", progress: "100", dueDate: "2026-08-20", dataFile: "sleep-quality-zj.xlsx" },
      updatedAt: "2026-08-21 09:15",
      updatedBy: "陈研究员"
    },
    {
      id: "clinical-row-4",
      values: { project: "青少年屏幕使用行为调查", site: "广东调研组", sampleSize: "587", owner: "刘老师", status: "数据清洗", progress: "76", dueDate: "2026-09-18", dataFile: "screen-time-gd.csv" },
      updatedAt: "2026-08-24 16:35",
      updatedBy: "刘老师"
    },
    {
      id: "clinical-row-5",
      values: { project: "慢阻肺用药依从性队列", site: "四川中心", sampleSize: "193", owner: "赵医生", status: "招募中", progress: "45", dueDate: "2026-11-30", dataFile: "copd-adherence-sc.xlsx" },
      updatedAt: "2026-08-25 10:55",
      updatedBy: "赵医生"
    },
    {
      id: "clinical-row-6",
      values: { project: "基层医务人员 AI 使用调查", site: "华北五省", sampleSize: "765", owner: "吴老师", status: "有风险", progress: "58", dueDate: "2026-09-28", dataFile: "primary-care-ai-north.csv" },
      updatedAt: "2026-08-26 09:05",
      updatedBy: "吴老师"
    }
  ];
  const attachments = [
    { id: "clinical-file-1", name: "hypertension-baseline-sh.xlsx", size: 1462272, mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", uploadedAt: "2026-08-25 17:20", uploadedBy: "李医生", rowCount: 326, source: "upload" },
    { id: "clinical-file-2", name: "diabetes-followup-js.csv", size: 684032, mimeType: "text/csv", uploadedAt: "2026-08-25 13:40", uploadedBy: "王医生", rowCount: 248, source: "import", previewText: "subject_id,visit_month,hba1c\nJS001,6,6.8\nJS002,6,7.1" },
    { id: "clinical-file-3", name: "sleep-quality-zj.xlsx", size: 1826816, mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", uploadedAt: "2026-08-21 09:15", uploadedBy: "陈研究员", rowCount: 412, source: "upload" },
    { id: "clinical-file-4", name: "screen-time-gd.csv", size: 1205248, mimeType: "text/csv", uploadedAt: "2026-08-24 16:35", uploadedBy: "刘老师", rowCount: 487, source: "import", previewText: "participant_id,daily_screen_hours,sleep_hours\nGD001,4.6,7.2\nGD002,6.1,6.5" },
    { id: "clinical-file-5", name: "copd-adherence-sc.xlsx", size: 912384, mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", uploadedAt: "2026-08-25 10:55", uploadedBy: "赵医生", rowCount: 193, source: "upload" },
    { id: "clinical-file-6", name: "primary-care-ai-north.csv", size: 1548288, mimeType: "text/csv", uploadedAt: "2026-08-26 09:05", uploadedBy: "吴老师", rowCount: 465, source: "import", previewText: "respondent_id,province,usage_frequency\nHB001,河北,weekly\nSX001,山西,daily" }
  ];
  return {
    ...table,
    columns,
    rows,
    attachments,
    share: {
      access: "team-edit",
      collaborators: ["王医生", "陈研究员", "刘老师", "赵医生", "吴老师"],
      updatedAt: "2026-08-26 09:10",
      updatedBy: "李医生"
    },
    updatedAt: "2026-08-26 09:10",
    updatedBy: "李医生"
  };
};
const initialResearchDataTables = [
  createDemoResearchDataTable(7),
  createMaterialsExperimentDataTable(9),
  createClinicalSurveyDataTable(10)
];
const emptyStoredState$1 = () => ({
  tables: {},
  deletedDocumentIds: []
});
const readStoredState$1 = () => {
  if (typeof window === "undefined") return emptyStoredState$1();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY$2);
    if (!raw) return emptyStoredState$1();
    const parsed = JSON.parse(raw);
    if (parsed.version !== STORAGE_VERSION$2 || !parsed.tables || typeof parsed.tables !== "object") {
      return emptyStoredState$1();
    }
    const tables = Object.fromEntries(
      Object.values(parsed.tables).flatMap((candidate) => {
        const table = sanitizeResearchDataTable(candidate);
        return table ? [[String(table.documentId), table]] : [];
      })
    );
    const tableIds = new Set(Object.keys(tables).map(Number));
    const deletedDocumentIds = Array.from(new Set(
      (Array.isArray(parsed.deletedDocumentIds) ? parsed.deletedDocumentIds : []).filter((id) => Number.isInteger(id) && id > 0 && !tableIds.has(id))
    ));
    return { tables, deletedDocumentIds };
  } catch {
    return emptyStoredState$1();
  }
};
const writeStoredState$1 = (state) => {
  if (typeof window === "undefined") {
    return { ok: false, error: "当前环境不支持本地存储，数据尚未保存。" };
  }
  try {
    const serialized = JSON.stringify({ version: STORAGE_VERSION$2, ...state });
    if (serialized.length > MAX_STORAGE_CHARACTERS$1) {
      return { ok: false, error: "数据文件占用空间较大，请移除部分文件后重试。" };
    }
    window.localStorage.setItem(STORAGE_KEY$2, serialized);
    return { ok: true };
  } catch {
    return { ok: false, error: "当前浏览器存储空间不足，数据尚未保存。" };
  }
};
const loadResearchDataTables = (fallbackTables = initialResearchDataTables) => {
  const sanitizedFallbacks = fallbackTables.map(sanitizeResearchDataTable).filter((table) => table != null);
  if (typeof window === "undefined") return sanitizedFallbacks.map(cloneResearchDataTable);
  const stored = readStoredState$1();
  const deletedIds = new Set(stored.deletedDocumentIds);
  const fallbackIds = new Set(sanitizedFallbacks.map((table) => table.documentId));
  const persistedNewTables = Object.values(stored.tables).filter((table) => !fallbackIds.has(table.documentId) && !deletedIds.has(table.documentId));
  const mergedFallbacks = sanitizedFallbacks.filter((table) => !deletedIds.has(table.documentId)).map((table) => stored.tables[String(table.documentId)] ?? table);
  return [...persistedNewTables, ...mergedFallbacks].map(cloneResearchDataTable);
};
const persistResearchDataTable = (table) => {
  if (table.columns.length > DATA_TABLE_IMPORT_LIMITS.maxColumns) {
    return { ok: false, error: `数据表格最多支持 ${DATA_TABLE_IMPORT_LIMITS.maxColumns} 个字段，请精简后重试。` };
  }
  if (table.rows.length > DATA_TABLE_IMPORT_LIMITS.maxRows) {
    return { ok: false, error: `数据表格最多支持 ${DATA_TABLE_IMPORT_LIMITS.maxRows} 条记录，请精简后重试。` };
  }
  if (table.attachments.length > MAX_ATTACHMENTS) {
    return { ok: false, error: `单个数据表格最多保留 ${MAX_ATTACHMENTS} 条文件记录，请移除部分文件后重试。` };
  }
  if (table.rows.some((row) => Object.values(row.values).some(
    (cell) => cell.length > DATA_TABLE_IMPORT_LIMITS.maxCellCharacters
  ))) {
    return { ok: false, error: `单元格内容不能超过 ${DATA_TABLE_IMPORT_LIMITS.maxCellCharacters} 字，请精简后重试。` };
  }
  if (table.attachments.some((attachment) => attachment.size > DATA_TABLE_IMPORT_LIMITS.maxFileBytes)) {
    return { ok: false, error: "存在超过 2 MiB 的数据文件记录，请移除后重试。" };
  }
  const sanitized = sanitizeResearchDataTable(table);
  if (!sanitized) return { ok: false, error: "数据表格结构无效，操作尚未保存。" };
  const stored = readStoredState$1();
  return writeStoredState$1({
    tables: { ...stored.tables, [String(sanitized.documentId)]: sanitized },
    deletedDocumentIds: stored.deletedDocumentIds.filter((id) => id !== sanitized.documentId)
  });
};
const removeResearchDataTable = (documentId) => {
  if (!Number.isInteger(documentId) || documentId <= 0) {
    return { ok: false, error: "无法识别要删除的数据表格。" };
  }
  const stored = readStoredState$1();
  const tables = { ...stored.tables };
  delete tables[String(documentId)];
  return writeStoredState$1({
    tables,
    deletedDocumentIds: [documentId, ...stored.deletedDocumentIds.filter((id) => id !== documentId)]
  });
};
const getResearchDataTableSearchText = (table) => [
  table.template === "project-progress" ? "科研项目 项目进度 数据表格" : "科研数据 实验数据 数据表格",
  ...table.columns.flatMap((column) => [column.name, ...column.options ?? []]),
  ...table.rows.flatMap((row) => [row.updatedBy, ...Object.values(row.values)]),
  ...table.attachments.flatMap((attachment) => [attachment.name, attachment.uploadedBy]),
  ...table.share.collaborators
].map((value) => value.trim()).filter(Boolean).join(" ");
const escapeDelimitedCell = (value) => /[",\r\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
const exportResearchDataTableCsv = (table) => {
  const header = table.columns.map((column) => escapeDelimitedCell(column.name)).join(",");
  const rows = table.rows.map((row) => table.columns.map((column) => escapeDelimitedCell(row.values[column.id] ?? "")).join(","));
  return `\uFEFF${[header, ...rows].join("\r\n")}`;
};
const inferDelimiter = (input) => {
  let commas = 0;
  let tabs2 = 0;
  let inQuotes = false;
  for (let index = 0; index < input.length; index += 1) {
    const character = input[index];
    if (character === '"') {
      if (inQuotes && input[index + 1] === '"') index += 1;
      else inQuotes = !inQuotes;
    } else if (!inQuotes && (character === "\n" || character === "\r")) {
      break;
    } else if (!inQuotes && character === ",") {
      commas += 1;
    } else if (!inQuotes && character === "	") {
      tabs2 += 1;
    }
  }
  return tabs2 > commas ? "	" : ",";
};
const parseDelimitedRows = (input, delimiter) => {
  const parsedRows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;
  let quoteClosed = false;
  let rowHasSyntax = false;
  const finishCell = () => {
    row.push(cell);
    cell = "";
    quoteClosed = false;
  };
  const finishRow = () => {
    finishCell();
    parsedRows.push(row);
    row = [];
    rowHasSyntax = false;
  };
  for (let index = 0; index < input.length; index += 1) {
    const character = input[index];
    if (inQuotes) {
      if (character === '"') {
        if (input[index + 1] === '"') {
          cell += '"';
          index += 1;
        } else {
          inQuotes = false;
          quoteClosed = true;
        }
      } else {
        cell += character;
      }
    } else if (quoteClosed) {
      if (character === delimiter) {
        finishCell();
        rowHasSyntax = true;
      } else if (character === "\n" || character === "\r") {
        if (character === "\r" && input[index + 1] === "\n") index += 1;
        finishRow();
      } else if (character !== " " && character !== "	") {
        return `第 ${parsedRows.length + 1} 行的引号后存在无效字符。`;
      }
    } else if (character === '"') {
      if (cell.length > 0) return `第 ${parsedRows.length + 1} 行存在位置错误的引号。`;
      inQuotes = true;
      rowHasSyntax = true;
    } else if (character === delimiter) {
      finishCell();
      rowHasSyntax = true;
    } else if (character === "\n" || character === "\r") {
      if (character === "\r" && input[index + 1] === "\n") index += 1;
      finishRow();
    } else {
      cell += character;
      rowHasSyntax = true;
    }
    if (cell.length > DATA_TABLE_IMPORT_LIMITS.maxCellCharacters) {
      return `第 ${parsedRows.length + 1} 行存在超过 ${DATA_TABLE_IMPORT_LIMITS.maxCellCharacters} 字的单元格。`;
    }
  }
  if (inQuotes) return `第 ${parsedRows.length + 1} 行存在未闭合的引号。`;
  if (rowHasSyntax || row.length > 0 || cell.length > 0 || quoteClosed) finishRow();
  return parsedRows;
};
const parseDelimitedData = (source, preferredDelimiter) => {
  const input = source.replace(/^\uFEFF/, "");
  if (!input.trim()) return { ok: false, error: "文件内容为空，未导入任何数据。" };
  const delimiter = preferredDelimiter ?? inferDelimiter(input);
  const result = parseDelimitedRows(input, delimiter);
  if (typeof result === "string") return { ok: false, error: result };
  const nonEmptyRows = result.filter((row) => row.some((cell) => cell.trim()));
  if (!nonEmptyRows.length) return { ok: false, error: "文件内容为空，未导入任何数据。" };
  const headers = nonEmptyRows[0].map((header) => header.trim());
  if (headers.length > DATA_TABLE_IMPORT_LIMITS.maxColumns) {
    return { ok: false, error: `最多支持 ${DATA_TABLE_IMPORT_LIMITS.maxColumns} 列，请精简后重试。` };
  }
  if (headers.some((header) => !header)) {
    return { ok: false, error: "表头存在空名称，请补齐后重试。" };
  }
  const normalizedHeaders = headers.map((header) => header.toLocaleLowerCase());
  if (new Set(normalizedHeaders).size !== normalizedHeaders.length) {
    return { ok: false, error: "表头名称不能重复，请修改后重试。" };
  }
  const rows = nonEmptyRows.slice(1);
  if (rows.length > DATA_TABLE_IMPORT_LIMITS.maxRows) {
    return { ok: false, error: `单次最多导入 ${DATA_TABLE_IMPORT_LIMITS.maxRows} 行，请拆分文件后重试。` };
  }
  const normalizedRows = [];
  for (let index = 0; index < rows.length; index += 1) {
    const row = rows[index];
    if (row.length > headers.length) {
      return { ok: false, error: `第 ${index + 2} 行的列数超过表头，请检查分隔符或内容。` };
    }
    const cells = Array.from({ length: headers.length }, (_, columnIndex) => row[columnIndex] ?? "");
    if (cells.some((cell) => cell.length > DATA_TABLE_IMPORT_LIMITS.maxCellCharacters)) {
      return { ok: false, error: `第 ${index + 2} 行存在超过 ${DATA_TABLE_IMPORT_LIMITS.maxCellCharacters} 字的单元格。` };
    }
    normalizedRows.push(cells);
  }
  return { ok: true, headers, rows: normalizedRows, delimiter };
};
const estimateResearchDataTableSize = (table) => {
  const bytes = new TextEncoder().encode(JSON.stringify(table)).byteLength;
  if (bytes < 1024) return `${Math.max(1, bytes)} B`;
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
function Modal({
  title,
  children,
  onClose,
  onSubmit,
  confirmText = "确定",
  confirmDisabled = false,
  wide = false,
  tall = false,
  extraWide = false,
  hideFooter = false,
  cancelText = "取消",
  confirmDanger = false,
  bodyClassName = ""
}) {
  const dialogRef = reactExports.useRef(null);
  const onCloseRef = reactExports.useRef(onClose);
  reactExports.useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);
  reactExports.useEffect(() => {
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusFrame = window.requestAnimationFrame(() => {
      const dialog = dialogRef.current;
      if (!dialog || dialog.contains(document.activeElement)) return;
      const preferred = dialog.querySelector(
        "input:not([disabled]), textarea:not([disabled]), select:not([disabled]), button:not([disabled]):not(.modal-close)"
      );
      const fallback = dialog.querySelector("button:not([disabled])");
      (preferred ?? fallback ?? dialog).focus();
    });
    const onKeyDown = (event) => {
      if (event.defaultPrevented) return;
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = Array.from(dialogRef.current?.querySelectorAll(
        'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      ) ?? []).filter((element) => element.offsetParent !== null);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      window.removeEventListener("keydown", onKeyDown);
      window.requestAnimationFrame(() => previouslyFocused?.focus());
    };
  }, [title]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "modal-backdrop", role: "presentation", onMouseDown: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "form",
    {
      ref: dialogRef,
      className: `modal-card${wide ? " modal-card--wide" : ""}${extraWide ? " modal-card--extra-wide" : ""}${tall ? " modal-card--tall" : ""}`,
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": "modal-title",
      tabIndex: -1,
      onMouseDown: (event) => event.stopPropagation(),
      onSubmit,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "modal-header", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { id: "modal-title", children: title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "icon-button modal-close", type: "button", "aria-label": "关闭", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "./assets/figma/modal-close.svg", alt: "" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `modal-body${bodyClassName ? ` ${bodyClassName}` : ""}`, children }),
        !hideFooter && /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "modal-footer", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "button button--secondary", type: "button", onClick: onClose, children: cancelText }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: `button ${confirmDanger ? "button--danger" : "button--primary"}`, type: "submit", disabled: confirmDisabled, children: confirmText })
        ] })
      ]
    }
  ) });
}
const scopeOptions$1 = [
  { value: "all", label: "全部表格" },
  { value: "project-progress", label: "项目进度" },
  { value: "research-data", label: "科研数据" }
];
const statusOptions = [
  "全部状态",
  "有风险",
  "进行中",
  "持续更新",
  "已完成",
  "未开始"
];
const accessLabels = {
  private: "仅自己可见",
  "team-view": "团队可查看",
  "team-edit": "团队可编辑"
};
const normalizedValue = (value) => value.normalize("NFC").trim().toLocaleLowerCase("zh-CN");
const shortDateTime = (value) => value.length >= 16 ? value.slice(0, 16) : value;
const isCompletedStatus = (value) => /完成|已归档|结项/.test(value);
const isRiskStatus = (value) => /风险|阻塞|延期|失败/.test(value);
const isNotStartedStatus = (value) => /未开始|待开始|待处理/.test(value);
const getTableStatus = (table) => {
  if (!table.rows.length) return "未开始";
  if (table.template === "research-data") return "持续更新";
  const statusColumn = table.columns.find((column) => column.type === "select" && /状态|阶段/.test(column.name));
  if (!statusColumn) return "进行中";
  const statuses = table.rows.map((row) => row.values[statusColumn.id]?.trim() ?? "");
  if (statuses.some(isRiskStatus)) return "有风险";
  if (statuses.every(isCompletedStatus)) return "已完成";
  if (statuses.every((value) => !value || isNotStartedStatus(value))) return "未开始";
  return "进行中";
};
const getStatusClass = (status) => {
  if (status === "有风险") return "risk";
  if (status === "已完成") return "success";
  if (status === "未开始") return "idle";
  if (status === "持续更新") return "updating";
  return "active";
};
function DataTableHub({
  documents,
  tables,
  suspended = false,
  onClose,
  onOpenTable,
  onCreateTable,
  onImportToTable,
  onShareTable,
  onMoveToRecycle
}) {
  const [query, setQuery] = reactExports.useState("");
  const [scope, setScope] = reactExports.useState("all");
  const [statusFilter, setStatusFilter] = reactExports.useState("全部状态");
  const [recycleTarget, setRecycleTarget] = reactExports.useState(null);
  const [openMenuId, setOpenMenuId] = reactExports.useState(null);
  const backButtonRef = reactExports.useRef(null);
  const menuRef = reactExports.useRef(null);
  const menuTriggerRefs = reactExports.useRef(/* @__PURE__ */ new Map());
  const openMenuIdRef = reactExports.useRef(openMenuId);
  const onCloseRef = reactExports.useRef(onClose);
  openMenuIdRef.current = openMenuId;
  onCloseRef.current = onClose;
  reactExports.useEffect(() => {
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const frame = window.requestAnimationFrame(() => backButtonRef.current?.focus());
    const closeMenu = (restoreTriggerFocus) => {
      const menuId = openMenuIdRef.current;
      if (menuId == null) return false;
      setOpenMenuId(null);
      if (restoreTriggerFocus) window.requestAnimationFrame(() => menuTriggerRefs.current.get(menuId)?.focus());
      return true;
    };
    const closeMenuFromOutside = (event) => {
      const menuId = openMenuIdRef.current;
      if (menuId == null) return;
      const target = event.target;
      if (menuRef.current?.contains(target) || menuTriggerRefs.current.get(menuId)?.contains(target)) return;
      closeMenu(false);
    };
    const closeMenuFromFocusChange = (event) => {
      const menuId = openMenuIdRef.current;
      if (menuId == null) return;
      const target = event.target;
      if (menuRef.current?.contains(target) || menuTriggerRefs.current.get(menuId)?.contains(target)) return;
      closeMenu(false);
    };
    const closeFromKeyboard = (event) => {
      if (event.key !== "Escape" || event.defaultPrevented) return;
      if (closeMenu(true)) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      if (document.querySelector(".modal-backdrop, .data-sheet-workspace")) return;
      event.preventDefault();
      onCloseRef.current();
    };
    document.addEventListener("pointerdown", closeMenuFromOutside, true);
    document.addEventListener("focusin", closeMenuFromFocusChange);
    window.addEventListener("keydown", closeFromKeyboard);
    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("pointerdown", closeMenuFromOutside, true);
      document.removeEventListener("focusin", closeMenuFromFocusChange);
      window.removeEventListener("keydown", closeFromKeyboard);
      window.requestAnimationFrame(() => previouslyFocused?.focus());
    };
  }, []);
  reactExports.useEffect(() => {
    if (openMenuId == null) return;
    const frame = window.requestAnimationFrame(() => menuRef.current?.querySelector('[role="menuitem"]')?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [openMenuId]);
  const documentById = reactExports.useMemo(
    () => new Map(documents.map((documentItem) => [documentItem.id, documentItem])),
    [documents]
  );
  const items = reactExports.useMemo(() => tables.map((table) => {
    const documentItem = documentById.get(table.documentId);
    const title = documentItem?.title || `数据表格 #${table.documentId}`;
    const location = documentItem?.location || "未关联空间";
    const owner = documentItem?.owner || table.updatedBy || "未知用户";
    return {
      documentId: table.documentId,
      documentItem,
      table,
      title,
      location,
      owner,
      status: getTableStatus(table),
      searchText: normalizedValue([title, location, owner, getResearchDataTableSearchText(table)].join(" "))
    };
  }).sort((first, second) => second.table.updatedAt.localeCompare(first.table.updatedAt, "zh-CN") || first.title.localeCompare(second.title, "zh-CN")), [documentById, tables]);
  const scopeCounts = reactExports.useMemo(() => ({
    all: items.length,
    "project-progress": items.filter((item) => item.table.template === "project-progress").length,
    "research-data": items.filter((item) => item.table.template === "research-data").length
  }), [items]);
  const normalizedQuery = normalizedValue(query);
  const visibleItems = reactExports.useMemo(() => items.filter((item) => {
    const matchesQuery = !normalizedQuery || item.searchText.includes(normalizedQuery);
    const matchesScope = scope === "all" || item.table.template === scope;
    const matchesStatus = statusFilter === "全部状态" || item.status === statusFilter;
    return matchesQuery && matchesScope && matchesStatus;
  }), [items, normalizedQuery, scope, statusFilter]);
  reactExports.useEffect(() => {
    if (openMenuId != null && !visibleItems.some((item) => item.documentId === openMenuId)) setOpenMenuId(null);
  }, [openMenuId, visibleItems]);
  const clearFilters = () => {
    setQuery("");
    setScope("all");
    setStatusFilter("全部状态");
  };
  const handleMenuKeyDown = (event) => {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    const menuItems = Array.from(event.currentTarget.querySelectorAll('[role="menuitem"]:not(:disabled)'));
    if (!menuItems.length) return;
    event.preventDefault();
    const currentIndex = menuItems.indexOf(document.activeElement);
    if (event.key === "Home") menuItems[0].focus();
    else if (event.key === "End") menuItems.at(-1)?.focus();
    else if (event.key === "ArrowDown") menuItems[(currentIndex + 1 + menuItems.length) % menuItems.length].focus();
    else menuItems[(currentIndex - 1 + menuItems.length) % menuItems.length].focus();
  };
  const runMenuAction = (action) => {
    setOpenMenuId(null);
    action();
  };
  const confirmRecycle = (event) => {
    event.preventDefault();
    if (!recycleTarget) return;
    const target = recycleTarget;
    setRecycleTarget(null);
    onMoveToRecycle(target);
  };
  const hubInert = recycleTarget ? true : void 0;
  const hubDialogSuppressed = suspended || Boolean(recycleTarget);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      className: "data-hub",
      role: hubDialogSuppressed ? void 0 : "dialog",
      "aria-modal": hubDialogSuppressed ? void 0 : true,
      "aria-labelledby": hubDialogSuppressed ? void 0 : "data-hub-title",
      "aria-hidden": suspended ? true : void 0,
      inert: suspended ? true : void 0,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "data-hub-header", "aria-hidden": hubInert, inert: hubInert, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "data-hub-heading", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { ref: backButtonRef, className: "data-hub-back", type: "button", onClick: onClose, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "./assets/iconpark/left.svg", alt: "" }),
              "返回"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "data-hub-breadcrumb", children: "工作台  /  数据表格" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { id: "data-hub-title", children: "数据表格" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "button button--primary", type: "button", onClick: onCreateTable, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "icon-plus", "aria-hidden": "true" }),
            "新建数据表格"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "data-hub-body", "aria-hidden": hubInert, inert: hubInert, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "data-hub-library", "aria-labelledby": "data-hub-library-title", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "data-hub-section-header", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { id: "data-hub-library-title", children: "科研数据管理" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "集中查看和管理科研项目数据、项目进度、导入文件与共享权限" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "共 ",
              items.length,
              " 个表格"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "data-hub-controls", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "data-hub-search", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "搜索数据表格" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "./assets/reading/search.svg", alt: "" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "search", value: query, maxLength: 100, placeholder: "搜索表格、记录、文件或成员", onChange: (event) => setQuery(event.target.value) }),
              query && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setQuery(""), children: "清空" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("select", { "aria-label": "筛选项目状态", value: statusFilter, onChange: (event) => setStatusFilter(event.target.value), children: statusOptions.map((option) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: option, children: option }, option)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "data-hub-scopes", role: "group", "aria-label": "数据表格类型", children: [
            scopeOptions$1.map((option) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: scope === option.value ? "is-active" : "", type: "button", "aria-pressed": scope === option.value, onClick: () => setScope(option.value), children: [
              option.label,
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: scopeCounts[option.value] })
            ] }, option.value)),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { role: "status", "aria-live": "polite", children: [
              "当前显示 ",
              visibleItems.length,
              " 个数据表格"
            ] })
          ] }),
          visibleItems.length ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "data-hub-table-scroll", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "data-hub-table", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "名称" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "类型" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "状态" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "数据规模" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "共享权限" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "最近更新" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "操作" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: visibleItems.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { "data-label": "名称", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "data-hub-name-cell", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "./assets/iconpark/grid-nine.svg", alt: "" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => onOpenTable(item), children: item.title }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: item.location })
                ] })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { "data-label": "类型", children: item.table.template === "project-progress" ? "项目进度" : "科研数据" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { "data-label": "状态", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `data-hub-status data-hub-status--${getStatusClass(item.status)}`, children: item.status }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { "data-label": "数据规模", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  item.table.rows.length,
                  " 条记录"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("small", { children: [
                  item.table.attachments.length,
                  " 个文件"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { "data-label": "共享权限", children: accessLabels[item.table.share.access] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { "data-label": "最近更新", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("time", { dateTime: item.table.updatedAt, children: shortDateTime(item.table.updatedAt) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: item.table.updatedBy })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { "data-label": "操作", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "data-hub-table-actions", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => onOpenTable(item), children: "打开" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => onImportToTable(item), children: "导入" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "data-hub-more", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      ref: (node) => {
                        if (node) menuTriggerRefs.current.set(item.documentId, node);
                        else menuTriggerRefs.current.delete(item.documentId);
                      },
                      className: "data-hub-more-trigger",
                      type: "button",
                      "aria-label": `${item.title}更多操作`,
                      "aria-haspopup": "menu",
                      "aria-expanded": openMenuId === item.documentId,
                      "aria-controls": `data-hub-menu-${item.documentId}`,
                      onClick: () => setOpenMenuId((current) => current === item.documentId ? null : item.documentId),
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "./assets/iconpark/more.svg", alt: "" })
                    }
                  ),
                  openMenuId === item.documentId && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: menuRef, className: "data-hub-more-menu", id: `data-hub-menu-${item.documentId}`, role: "menu", "aria-label": `${item.title}操作`, onKeyDown: handleMenuKeyDown, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", role: "menuitem", onClick: () => runMenuAction(() => onShareTable(item)), children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "./assets/iconpark/share.svg", alt: "" }),
                      "分享与权限"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "danger-link", type: "button", role: "menuitem", onClick: () => runMenuAction(() => setRecycleTarget(item)), children: "移入回收站" })
                  ] })
                ] })
              ] }) })
            ] }, item.documentId)) })
          ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "data-hub-empty", role: "status", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "./assets/iconpark/grid-nine.svg", alt: "" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: items.length ? "未找到匹配的数据表格" : "还没有数据表格" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: items.length ? "请更换搜索词或调整类型、状态筛选条件。" : "新建第一个表格，开始管理科研数据和项目进度。" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              items.length ? /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "button button--secondary", type: "button", onClick: clearFilters, children: "重置筛选" }) : null,
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "button button--primary", type: "button", onClick: onCreateTable, children: "新建数据表格" })
            ] })
          ] })
        ] }) }),
        recycleTarget && /* @__PURE__ */ jsxRuntimeExports.jsx(Modal, { title: "移入回收站", onClose: () => setRecycleTarget(null), onSubmit: confirmRecycle, confirmText: "移入回收站", confirmDanger: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "data-hub-recycle-confirm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            "确定将“",
            recycleTarget.title,
            "”移入回收站吗？"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: "表格、记录和文件将一并移入回收站，之后可以从回收站恢复。" })
        ] }) })
      ]
    }
  );
}
const kindOrder = {
  document: 0,
  note: 1
};
function normalize(value) {
  return value.trim().toLocaleLowerCase("zh-CN");
}
function getResearchSearchTerms(query) {
  return Array.from(new Set(query.trim().split(/\s+/).map(normalize).filter(Boolean)));
}
function fieldMatchScore(field, term) {
  const normalizedValue2 = normalize(field.value);
  if (!normalizedValue2.includes(term)) return 0;
  if (normalizedValue2 === term) return field.weight + 80;
  if (normalizedValue2.startsWith(term)) return field.weight + 40;
  return field.weight;
}
function evaluateFields(fields, query) {
  const terms = getResearchSearchTerms(query);
  if (terms.length === 0) return null;
  const matchedFields = /* @__PURE__ */ new Set();
  let score = 0;
  for (const term of terms) {
    let bestScore = 0;
    for (const field of fields) {
      const nextScore = fieldMatchScore(field, term);
      if (nextScore > 0) matchedFields.add(field.label);
      bestScore = Math.max(bestScore, nextScore);
    }
    if (bestScore === 0) return null;
    score += bestScore;
  }
  const normalizedQuery = normalize(query);
  if (normalizedQuery.includes(" ") && fields.some((field) => normalize(field.value).includes(normalizedQuery))) {
    score += 100;
  }
  const bestField = fields.filter((field) => terms.some((term) => normalize(field.value).includes(term))).sort((first, second) => second.weight - first.weight)[0];
  return {
    matchedFields: Array.from(matchedFields),
    score,
    snippet: bestField?.value ?? ""
  };
}
function makeResearchSearchSnippet(text, terms, maximumLength = 148) {
  if (text.length <= maximumLength) return text;
  const normalizedText = text.toLocaleLowerCase("zh-CN");
  const matchIndex = terms.reduce((closest, term) => {
    const index = normalizedText.indexOf(term);
    if (index < 0) return closest;
    return closest < 0 ? index : Math.min(closest, index);
  }, -1);
  if (matchIndex < 0) return `${text.slice(0, maximumLength).trimEnd()}…`;
  const contextBefore = Math.floor(maximumLength * 0.35);
  const start = Math.max(0, matchIndex - contextBefore);
  const end = Math.min(text.length, start + maximumLength);
  return `${start > 0 ? "…" : ""}${text.slice(start, end).trim()}${end < text.length ? "…" : ""}`;
}
function documentFields(document2) {
  return [
    { label: "标题", value: document2.title, weight: 360 },
    { label: "描述", value: document2.description ?? "", weight: 230 },
    { label: "正文", value: document2.content ?? "", weight: 220 },
    ...(document2.keywords ?? []).map((keyword) => ({ label: "关键词", value: keyword, weight: 280 })),
    { label: "位置", value: document2.location, weight: 160 },
    { label: "所有者", value: document2.owner, weight: 150 },
    { label: "类型", value: document2.kind, weight: 130 },
    { label: "创建时间", value: document2.createdAt, weight: 80 },
    { label: "最近访问", value: document2.visitedAt, weight: 80 },
    { label: "大小", value: document2.size, weight: 60 }
  ];
}
function noteFields(note, documentTitle) {
  return [
    { label: "标题", value: note.title, weight: 340 },
    { label: "正文", value: note.content, weight: 240 },
    ...note.tags.map((tag) => ({ label: "标签", value: tag, weight: 290 })),
    { label: "所属文档", value: documentTitle, weight: 120 },
    { label: "创建时间", value: note.createdAt, weight: 70 },
    { label: "更新时间", value: note.updatedAt, weight: 80 }
  ];
}
function blockSearchText(block) {
  if (block.type === "text") return block.text;
  if (block.type === "list") return block.items.join(" ");
  if (block.type === "image") return `${block.alt} ${block.caption}`;
  if (block.type === "formula") return block.latex;
  if (block.type === "bookmark") return `${block.title} ${block.description} ${block.url}`;
  return "";
}
function documentBrowseSnippet(document2) {
  const blockContent = document2.blocks?.map(blockSearchText).filter(Boolean).join(" ");
  return document2.description?.trim() || document2.content?.trim() || blockContent?.trim() || `${document2.location} · ${document2.owner}`;
}
function listResearchContent(documents, notes) {
  const documentsById = new Map(documents.map((document2) => [document2.id, document2]));
  const documentResults = documents.map((document2, sourceIndex) => ({
    id: `document:${document2.id}`,
    type: "document",
    documentId: document2.id,
    documentTitle: document2.title,
    document: document2,
    matchedFields: [],
    score: 0,
    sourceIndex,
    snippet: makeResearchSearchSnippet(documentBrowseSnippet(document2), [])
  }));
  const noteResults = notes.flatMap((note, sourceIndex) => {
    const parentDocument = documentsById.get(note.documentId);
    if (!parentDocument) return [];
    return [{
      id: `note:${note.id}`,
      type: "note",
      documentId: note.documentId,
      documentTitle: parentDocument.title,
      note,
      matchedFields: [],
      score: 0,
      sourceIndex,
      snippet: makeResearchSearchSnippet(note.content.trim() || `来自「${parentDocument.title}」的笔记`, [])
    }];
  });
  return [...documentResults, ...noteResults].sort((first, second) => kindOrder[first.type] - kindOrder[second.type] || first.sourceIndex - second.sourceIndex || first.id.localeCompare(second.id));
}
function documentSearchTarget(document2, terms) {
  const targetBlockId = document2.blocks?.find((block) => terms.some((term) => normalize(blockSearchText(block)).includes(term)))?.id;
  return { targetBlockId };
}
function searchResearchContent(documents, notes, query) {
  const terms = getResearchSearchTerms(query);
  if (terms.length === 0) return [];
  const documentsById = new Map(documents.map((document2) => [document2.id, document2]));
  const documentResults = documents.flatMap((document2, sourceIndex) => {
    const match = evaluateFields(documentFields(document2), query);
    if (!match) return [];
    const snippetSource = document2.description && terms.some((term) => normalize(document2.description ?? "").includes(term)) ? document2.description : match.snippet;
    const target = documentSearchTarget(document2, terms);
    return [{
      id: `document:${document2.id}`,
      type: "document",
      documentId: document2.id,
      documentTitle: document2.title,
      document: document2,
      matchedFields: match.matchedFields,
      score: match.score,
      sourceIndex,
      snippet: makeResearchSearchSnippet(snippetSource, terms),
      ...target
    }];
  });
  const noteResults = notes.flatMap((note, sourceIndex) => {
    const parentDocument = documentsById.get(note.documentId);
    if (!parentDocument) return [];
    const documentTitle = parentDocument.title;
    const match = evaluateFields(noteFields(note, documentTitle), query);
    if (!match) return [];
    const snippetSource = terms.some((term) => normalize(note.content).includes(term)) ? note.content : match.snippet;
    return [{
      id: `note:${note.id}`,
      type: "note",
      documentId: note.documentId,
      documentTitle,
      note,
      matchedFields: match.matchedFields,
      score: match.score,
      sourceIndex,
      snippet: makeResearchSearchSnippet(snippetSource, terms)
    }];
  });
  return [...documentResults, ...noteResults].sort((first, second) => second.score - first.score || kindOrder[first.type] - kindOrder[second.type] || first.sourceIndex - second.sourceIndex || first.id.localeCompare(second.id));
}
function countResearchSearchResults(results) {
  const documents = results.filter((result) => result.type === "document").length;
  const notes = results.length - documents;
  return { all: results.length, documents, notes };
}
function filterResearchSearchResults(results, scope) {
  if (scope === "all") return results;
  const type = scope === "documents" ? "document" : "note";
  return results.filter((result) => result.type === type);
}
const recentSearchesStorageKey = "intelligent-research-portal:recent-searches:v1";
const maximumRecentSearches = 6;
const searchResultsPageSize = 10;
const documentResultIcons = {
  在线文档: "./assets/document-word.svg",
  数据表格: "./assets/document-sheet.svg",
  PDF文档: "./assets/action-pdf.svg",
  Word文档: "./assets/action-word.svg",
  Excel文档: "./assets/document-sheet.svg"
};
const scopeOptions = [
  { value: "all", label: "全部" },
  { value: "documents", label: "文档" },
  { value: "notes", label: "笔记" }
];
function loadRecentSearches() {
  try {
    const stored = window.localStorage.getItem(recentSearchesStorageKey);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return Array.from(new Set(parsed.filter((item) => typeof item === "string").map((item) => item.trim()).filter(Boolean))).slice(0, maximumRecentSearches);
  } catch {
    return [];
  }
}
function saveRecentSearches(searches) {
  try {
    window.localStorage.setItem(recentSearchesStorageKey, JSON.stringify(searches));
  } catch {
  }
}
function HighlightedText({ text, terms }) {
  if (!text || terms.length === 0) return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: text });
  const normalizedText = text.toLocaleLowerCase("zh-CN");
  const parts = [];
  let cursor = 0;
  while (cursor < text.length) {
    let matchStart = -1;
    let matchTerm = "";
    for (const term of terms) {
      const index = normalizedText.indexOf(term, cursor);
      if (index < 0) continue;
      if (matchStart < 0 || index < matchStart || index === matchStart && term.length > matchTerm.length) {
        matchStart = index;
        matchTerm = term;
      }
    }
    if (matchStart < 0) {
      parts.push(text.slice(cursor));
      break;
    }
    if (matchStart > cursor) parts.push(text.slice(cursor, matchStart));
    const matchEnd = matchStart + matchTerm.length;
    parts.push(/* @__PURE__ */ jsxRuntimeExports.jsx("mark", { className: "global-search-highlight", children: text.slice(matchStart, matchEnd) }, `${matchStart}-${matchEnd}`));
    cursor = matchEnd;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: parts });
}
function ResultMetadata({ result, terms }) {
  if (result.type === "document") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "global-search-result-metadata", "aria-label": "文档信息", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "文档类型：" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(HighlightedText, { text: result.document.kind, terms })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "所有者：" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(HighlightedText, { text: result.document.owner, terms })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "创建时间：" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(HighlightedText, { text: result.document.createdAt, terms })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "文件大小：" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(HighlightedText, { text: result.document.size, terms })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "global-search-result-metadata", "aria-label": "笔记信息", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "信息类型：" }),
      "笔记"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "所属文档：" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(HighlightedText, { text: result.documentTitle, terms })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "更新时间：" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(HighlightedText, { text: result.note.updatedAt, terms })
    ] })
  ] });
}
function ResultTags({ result, terms }) {
  const tags = result.type === "document" ? result.document.keywords ?? [] : result.note.tags;
  if (tags.length === 0) return null;
  const visibleTags = tags.slice(0, 3);
  const remainingTagCount = tags.length - visibleTags.length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "global-search-result-tags", "aria-label": result.type === "document" ? "文档关键词" : "笔记标签", children: [
    visibleTags.map((tag, index) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { title: tag, children: /* @__PURE__ */ jsxRuntimeExports.jsx(HighlightedText, { text: tag, terms }) }, `${tag}-${index}`)),
    remainingTagCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "global-search-result-tag-count", title: `另有 ${remainingTagCount} 个标签`, children: [
      "+",
      remainingTagCount
    ] })
  ] });
}
function ResultIcon({ result }) {
  if (result.type === "note") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "global-search-result-icon global-search-result-icon--note", "aria-hidden": "true", children: /* @__PURE__ */ jsxRuntimeExports.jsx("i", {}) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `global-search-result-icon global-search-result-icon--${result.document.kind === "在线文档" ? "online" : result.document.kind === "数据表格" ? "sheet" : "file"}`, "aria-hidden": "true", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: documentResultIcons[result.document.kind], alt: "" }) });
}
function resultActionLabel(result) {
  if (result.type === "note") return "查看笔记";
  if (result.document.kind === "数据表格") return "打开表格";
  if (result.document.kind !== "在线文档") return "定位文档";
  return result.targetBlockId || result.matchedFields.includes("正文") ? "打开并定位" : "打开文档";
}
function GlobalSearchDialog({
  documents,
  notes,
  onClose,
  onOpenDocument,
  onLocateDocument,
  onOpenNote
}) {
  const [draftQuery, setDraftQuery] = reactExports.useState("");
  const [submittedQuery, setSubmittedQuery] = reactExports.useState("");
  const [scope, setScope] = reactExports.useState("all");
  const [resultPage, setResultPage] = reactExports.useState(1);
  const [recentSearches, setRecentSearches] = reactExports.useState(loadRecentSearches);
  const inputRef = reactExports.useRef(null);
  const resultListRef = reactExports.useRef(null);
  const hasSubmittedQuery = Boolean(submittedQuery);
  const allResults = reactExports.useMemo(() => hasSubmittedQuery ? searchResearchContent(documents, notes, submittedQuery) : listResearchContent(documents, notes), [documents, hasSubmittedQuery, notes, submittedQuery]);
  const counts = reactExports.useMemo(() => countResearchSearchResults(allResults), [allResults]);
  const visibleResults = reactExports.useMemo(() => filterResearchSearchResults(allResults, scope), [allResults, scope]);
  const terms = reactExports.useMemo(() => getResearchSearchTerms(submittedQuery), [submittedQuery]);
  const totalResultPages = Math.max(1, Math.ceil(visibleResults.length / searchResultsPageSize));
  const paginatedResults = reactExports.useMemo(
    () => visibleResults.slice((resultPage - 1) * searchResultsPageSize, resultPage * searchResultsPageSize),
    [resultPage, visibleResults]
  );
  const resultPageNumbers = reactExports.useMemo(() => {
    const firstPage = Math.max(1, Math.min(resultPage - 2, totalResultPages - 4));
    return Array.from({ length: Math.min(5, totalResultPages) }, (_, index) => firstPage + index);
  }, [resultPage, totalResultPages]);
  const currentScopeLabel = scope === "documents" ? "全部文档" : scope === "notes" ? "全部笔记" : "全部科研内容";
  reactExports.useEffect(() => {
    const animationFrame = window.requestAnimationFrame(() => inputRef.current?.focus());
    return () => window.cancelAnimationFrame(animationFrame);
  }, []);
  reactExports.useEffect(() => {
    if (resultPage > totalResultPages) setResultPage(totalResultPages);
  }, [resultPage, totalResultPages]);
  const rememberSearch = (query) => {
    const next = [query, ...recentSearches.filter((item) => item.toLocaleLowerCase("zh-CN") !== query.toLocaleLowerCase("zh-CN"))].slice(0, maximumRecentSearches);
    setRecentSearches(next);
    saveRecentSearches(next);
  };
  const runSearch = (query) => {
    const value = query.trim();
    if (!value) return;
    setDraftQuery(value);
    setSubmittedQuery(value);
    setResultPage(1);
    rememberSearch(value);
  };
  const submitSearch = (event) => {
    event.preventDefault();
    runSearch(draftQuery);
  };
  const clearSearch = () => {
    setDraftQuery("");
    setSubmittedQuery("");
    setScope("all");
    setResultPage(1);
    window.requestAnimationFrame(() => inputRef.current?.focus());
  };
  const clearRecentSearches = () => {
    setRecentSearches([]);
    try {
      window.localStorage.removeItem(recentSearchesStorageKey);
    } catch {
    }
  };
  const openResult = (result) => {
    if (result.type === "document") {
      if (result.document.kind === "在线文档" || result.document.kind === "数据表格") {
        onOpenDocument(result.document, {
          blockId: result.targetBlockId,
          query: submittedQuery || void 0
        });
      } else onLocateDocument(result.document);
    } else onOpenNote(result.note);
    onClose();
  };
  const changeResultPage = (nextPage) => {
    setResultPage(Math.max(1, Math.min(totalResultPages, nextPage)));
    window.requestAnimationFrame(() => {
      if (resultListRef.current) resultListRef.current.scrollTop = 0;
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Modal,
    {
      title: "全文搜索",
      onClose,
      onSubmit: submitSearch,
      extraWide: true,
      tall: true,
      hideFooter: true,
      bodyClassName: "global-search-body",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "global-search-layout", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "global-search-controls", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "global-search-input-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "global-search-input-label", children: "搜索科研文档和笔记" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                ref: inputRef,
                className: "global-search-input",
                type: "search",
                value: draftQuery,
                maxLength: 100,
                placeholder: "输入标题、关键词、文档信息或笔记内容",
                autoComplete: "off",
                onChange: (event) => setDraftQuery(event.target.value)
              }
            )
          ] }),
          (draftQuery || submittedQuery) && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "global-search-clear", type: "button", onClick: clearSearch, "aria-label": "清空搜索", children: "清空" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "global-search-submit", type: "submit", disabled: !draftQuery.trim(), children: "搜索" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "global-search-scopes", role: "group", "aria-label": "搜索范围", children: scopeOptions.map((option) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: `global-search-scope${scope === option.value ? " global-search-scope--active" : ""}`,
            type: "button",
            "aria-pressed": scope === option.value,
            onClick: () => {
              setScope(option.value);
              setResultPage(1);
            },
            children: [
              option.label,
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: counts[option.value] })
            ]
          },
          option.value
        )) }),
        visibleResults.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "global-search-empty", role: "status", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: hasSubmittedQuery ? "未找到匹配内容" : "暂无可浏览内容" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: hasSubmittedQuery ? "尝试更换关键词或切换搜索范围。" : "新建文档或笔记后，将在这里统一展示。" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "global-search-results", "aria-label": hasSubmittedQuery ? "搜索结果" : "科研内容列表", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "global-search-summary", role: "status", "aria-live": "polite", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              hasSubmittedQuery ? "找到" : currentScopeLabel,
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: visibleResults.length }),
              " 条",
              hasSubmittedQuery ? "结果" : ""
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: hasSubmittedQuery ? `搜索“${submittedQuery}”` : "打开即可浏览，输入关键词可全文检索" })
          ] }),
          !hasSubmittedQuery && recentSearches.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "global-search-recent-inline", "aria-label": "最近搜索", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "最近搜索" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: recentSearches.slice(0, 3).map((query) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => runSearch(query), children: query }, query)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "global-search-recent-clear", type: "button", onClick: clearRecentSearches, children: "清除" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "global-search-result-list", ref: resultListRef, children: paginatedResults.map((result) => {
            const title = result.type === "document" ? result.document.title : result.note.title;
            const actionLabel = resultActionLabel(result);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: `global-search-result global-search-result--${result.type}`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ResultIcon, { result }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "global-search-result-main", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "global-search-result-header", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { title, children: /* @__PURE__ */ jsxRuntimeExports.jsx(HighlightedText, { text: title, terms }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ResultTags, { result, terms })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(ResultMetadata, { result, terms }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "global-search-result-match", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: hasSubmittedQuery ? `命中：${result.matchedFields.join("、")}` : result.type === "document" ? "文档摘要" : "笔记摘要" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HighlightedText, { text: result.snippet, terms }) })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  className: `global-search-result-action${result.type === "note" || result.type === "document" && (result.document.kind === "在线文档" || result.document.kind === "数据表格") ? " global-search-result-action--primary" : ""}`,
                  type: "button",
                  "aria-label": `${actionLabel}“${title}”`,
                  onClick: () => openResult(result),
                  children: actionLabel
                }
              )
            ] }, result.id);
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "global-search-pagination", "aria-label": "搜索结果分页", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", disabled: resultPage === 1, "aria-label": "上一页", onClick: () => changeResultPage(resultPage - 1), children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "pager-chevron pager-chevron--prev", "aria-hidden": "true" }) }),
            resultPageNumbers.map((pageNumber) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                className: resultPage === pageNumber ? "is-current" : "",
                "aria-current": resultPage === pageNumber ? "page" : void 0,
                onClick: () => changeResultPage(pageNumber),
                children: pageNumber
              },
              pageNumber
            )),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", disabled: resultPage === totalResultPages, "aria-label": "下一页", onClick: () => changeResultPage(resultPage + 1), children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "pager-chevron", "aria-hidden": "true" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "global-search-page-size", children: [
              searchResultsPageSize,
              "条/页"
            ] })
          ] })
        ] })
      ] })
    }
  );
}
const roleOptions = ["管理员", "编辑者", "查看员"];
const roleMenuHeight = 104;
function MemberPicker({
  candidates,
  selectedIds,
  roles,
  search,
  onSearchChange,
  onToggle,
  onRemove,
  onRoleChange
}) {
  const [openRoleId, setOpenRoleId] = reactExports.useState(null);
  const [roleMenuPlacement, setRoleMenuPlacement] = reactExports.useState("down");
  const roleTriggerRefs = reactExports.useRef(/* @__PURE__ */ new Map());
  const roleMenuRef = reactExports.useRef(null);
  const normalizedSearch = search.trim().toLocaleLowerCase();
  const filteredCandidates = reactExports.useMemo(() => candidates.filter((candidate) => !normalizedSearch || candidate.name.toLocaleLowerCase().includes(normalizedSearch) || candidate.email.toLocaleLowerCase().includes(normalizedSearch)), [candidates, normalizedSearch]);
  const selectedCandidates = candidates.filter((candidate) => selectedIds.includes(candidate.id));
  reactExports.useEffect(() => {
    if (openRoleId == null) return;
    const closeRoleMenu2 = () => setOpenRoleId(null);
    window.addEventListener("click", closeRoleMenu2);
    return () => window.removeEventListener("click", closeRoleMenu2);
  }, [openRoleId]);
  reactExports.useEffect(() => {
    if (openRoleId == null || selectedIds.includes(openRoleId)) return;
    setOpenRoleId(null);
  }, [openRoleId, selectedIds]);
  reactExports.useEffect(() => {
    if (openRoleId == null) return;
    const currentRole = roles[openRoleId] ?? "查看员";
    const currentOption = roleMenuRef.current?.querySelector(`button[data-role="${currentRole}"]`);
    currentOption?.focus();
  }, [openRoleId, roles]);
  const closeRoleMenu = (restoreFocus = false) => {
    const trigger = openRoleId == null ? null : roleTriggerRefs.current.get(openRoleId);
    setOpenRoleId(null);
    if (restoreFocus) window.requestAnimationFrame(() => trigger?.focus());
  };
  const openRoleMenu = (id, trigger) => {
    const list = trigger.closest(".selected-member-list");
    const listRect = list?.getBoundingClientRect();
    const triggerRect = trigger.getBoundingClientRect();
    const availableBelow = listRect ? listRect.bottom - triggerRect.bottom : roleMenuHeight;
    const availableAbove = listRect ? triggerRect.top - listRect.top : 0;
    setRoleMenuPlacement(availableBelow < roleMenuHeight && availableAbove > availableBelow ? "up" : "down");
    setOpenRoleId(id);
  };
  const handleRoleMenuKeyDown = (event) => {
    const options = Array.from(roleMenuRef.current?.querySelectorAll('[role="menuitemradio"]') ?? []);
    const currentIndex = options.indexOf(document.activeElement);
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      closeRoleMenu(true);
      return;
    }
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key) || options.length === 0) return;
    event.preventDefault();
    event.stopPropagation();
    if (event.key === "Home") options[0]?.focus();
    else if (event.key === "End") options.at(-1)?.focus();
    else {
      const direction = event.key === "ArrowDown" ? 1 : -1;
      const nextIndex = (Math.max(currentIndex, 0) + direction + options.length) % options.length;
      options[nextIndex]?.focus();
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "member-selector", "aria-label": "成员选择区域", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "member-selector-column member-selector-candidates", "aria-label": "全部成员", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          className: "text-field member-search",
          value: search,
          onChange: (event) => onSearchChange(event.target.value),
          onKeyDown: (event) => {
            if (event.key !== "Enter") return;
            event.preventDefault();
            event.stopPropagation();
          },
          placeholder: "请输入",
          "aria-label": "搜索成员",
          autoFocus: true
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "全部成员·80人" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "candidate-list", role: "list", children: filteredCandidates.map((candidate) => {
        const selected = selectedIds.includes(candidate.id);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: `candidate-row${selected ? " is-selected" : ""}`,
            type: "button",
            role: "checkbox",
            "aria-checked": selected,
            onClick: () => onToggle(candidate.id),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "member-checkbox", "aria-hidden": "true", children: selected && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "./assets/figma/checkbox-check.svg", alt: "" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "member-avatar", style: { background: candidate.color }, children: candidate.name[0] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "member-identity", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: candidate.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: candidate.email })
              ] })
            ]
          },
          candidate.id
        );
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "member-selector-column member-selector-selected", "aria-label": "已选成员", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
        "已选：",
        /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: selectedCandidates.length }),
        " 人"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "selected-member-list", role: "list", children: selectedCandidates.map((candidate) => {
        const role = roles[candidate.id] ?? "查看员";
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { role: "listitem", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "member-avatar", style: { background: candidate.color }, children: candidate.name[0] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "member-identity", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: candidate.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: candidate.email })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "selected-member-controls", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "selected-member-remove", type: "button", "aria-label": `移除${candidate.name}`, onClick: () => onRemove(candidate.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "./assets/figma/modal-close.svg", alt: "" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "selected-member-role-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  className: "selected-member-role",
                  type: "button",
                  "aria-label": `${candidate.name}权限，当前${role}`,
                  "aria-expanded": openRoleId === candidate.id,
                  "aria-haspopup": "menu",
                  "aria-controls": `member-role-menu-${candidate.id}`,
                  ref: (node) => {
                    if (node) roleTriggerRefs.current.set(candidate.id, node);
                    else roleTriggerRefs.current.delete(candidate.id);
                  },
                  onClick: (event) => {
                    event.stopPropagation();
                    if (openRoleId === candidate.id) closeRoleMenu();
                    else openRoleMenu(candidate.id, event.currentTarget);
                  },
                  onKeyDown: (event) => {
                    if (event.key === "Escape" && openRoleId === candidate.id) {
                      event.preventDefault();
                      event.stopPropagation();
                      closeRoleMenu(true);
                    } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                      event.preventDefault();
                      event.stopPropagation();
                      openRoleMenu(candidate.id, event.currentTarget);
                    }
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "selected-member-role-label", children: role }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "selected-member-role-chevron", "aria-hidden": "true", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "./assets/figma/role-chevron.svg", alt: "" }) })
                  ]
                }
              ),
              openRoleId === candidate.id && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `selected-member-role-menu${roleMenuPlacement === "up" ? " is-up" : ""}`,
                  id: `member-role-menu-${candidate.id}`,
                  ref: roleMenuRef,
                  role: "menu",
                  "aria-label": `${candidate.name}权限选项`,
                  onClick: (event) => event.stopPropagation(),
                  onKeyDown: handleRoleMenuKeyDown,
                  children: roleOptions.map((option) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      role: "menuitemradio",
                      "aria-checked": role === option,
                      "data-role": option,
                      className: role === option ? "is-current" : "",
                      onClick: () => {
                        onRoleChange(candidate.id, option);
                        closeRoleMenu(true);
                      },
                      children: option
                    },
                    option
                  ))
                }
              )
            ] })
          ] })
        ] }, candidate.id);
      }) })
    ] })
  ] });
}
const stats = [
  { section: "workbench", label: "工作台", count: 85, icon: "./assets/nav-workbench.svg", tone: "blue" },
  { section: "personal", label: "我的空间", count: 128, icon: "./assets/nav-personal.svg", tone: "cyan" },
  { section: "team", label: "团队空间", count: 342, icon: "./assets/nav-team.svg", tone: "purple" },
  { section: "recycle", label: "回收站", count: 12, icon: "./assets/nav-trash.svg", tone: "orange" }
];
function TopNavigation({
  activeSection,
  onSelect,
  onReadingSelect,
  onSearchOpen,
  onProfileOpen,
  profileName,
  profileAvatar
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "product-row", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "product-tabs", role: "tablist", "aria-label": "产品切换", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "product-tab product-tab--active", type: "button", role: "tab", "aria-selected": "true", children: "智能科研" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "product-tab", type: "button", role: "tab", "aria-selected": "false", onClick: onReadingSelect, children: "智能阅读" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "top-utilities", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: "global-search-trigger",
            type: "button",
            "aria-label": "全文搜索笔记和文档",
            "aria-haspopup": "dialog",
            "aria-keyshortcuts": "Meta+K Control+K",
            onClick: onSearchOpen,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "./assets/reading/search.svg", alt: "" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "搜索笔记、文档" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { children: "⌘ K" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "profile-button",
            type: "button",
            "aria-label": `打开个人信息设置（${profileName}）`,
            "aria-haspopup": "dialog",
            onClick: onProfileOpen,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { className: profileAvatar ? "is-custom-avatar" : void 0, src: profileAvatar || "./assets/avatar-user.svg", alt: "" })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "stats-nav", "aria-label": "科研空间概览", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "stats-track", children: stats.map((item, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "stat-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          className: `stat-item${activeSection === item.section ? " is-current" : ""}`,
          onClick: () => onSelect(item.section),
          "aria-current": activeSection === item.section ? "page" : void 0,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `stat-icon stat-icon--${item.tone}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: item.icon, alt: "" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: item.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: item.count })
          ]
        }
      ),
      index < stats.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "stat-divider", "aria-hidden": "true" })
    ] }, item.section)) }) })
  ] });
}
const primaryItems = [
  { section: "workbench", label: "工作台" },
  { section: "personal", label: "我的空间" },
  { section: "team", label: "团队空间" },
  { section: "recycle", label: "回收站" }
];
function Sidebar({
  activeSection,
  activeTeam,
  teamNames: teamNames2,
  teamTreeExpanded,
  onSectionSelect,
  onTeamTreeToggle,
  onTeamSelect,
  onNewTeam
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("aside", { className: "sidebar", "aria-label": "功能导航", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sidebar-scroll", children: primaryItems.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sidebar-group", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: item.section === "team" ? "sidebar-parent-row" : void 0, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          className: `sidebar-item${activeSection === item.section && item.section !== "team" ? " is-active" : ""}${activeSection === item.section && item.section === "team" ? " is-parent-active" : ""}`,
          onClick: () => item.section === "team" ? onTeamTreeToggle() : onSectionSelect(item.section),
          "aria-current": activeSection === item.section ? "page" : void 0,
          "aria-expanded": item.section === "team" ? teamTreeExpanded : void 0,
          "aria-controls": item.section === "team" ? "team-space-tree" : void 0,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: item.label }),
            item.section === "team" && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { className: `sidebar-chevron${teamTreeExpanded ? " is-open" : ""}`, src: "./assets/direction-down.svg", alt: "" })
          ]
        }
      ),
      item.section === "team" && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "sidebar-team-add", "aria-label": "新增团队空间", onClick: onNewTeam, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true" }) })
    ] }),
    item.section === "team" && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        id: "team-space-tree",
        className: `team-tree-disclosure${teamTreeExpanded ? " is-open" : ""}`,
        "aria-hidden": !teamTreeExpanded,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "team-tree", children: teamNames2.map((team) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            tabIndex: teamTreeExpanded ? void 0 : -1,
            className: `sidebar-item sidebar-item--child${activeTeam === team ? " is-active" : ""}`,
            onClick: () => onTeamSelect(team),
            children: team
          },
          team
        )) })
      }
    )
  ] }, item.section)) }) });
}
const MAX_AVATAR_BYTES = 2 * 1024 * 1024;
const AVATAR_SIZE = 256;
const ALLOWED_AVATAR_TYPES = /* @__PURE__ */ new Set(["image/jpeg", "image/png", "image/webp"]);
const CONTROL_CHARACTERS$1 = /[\u0000-\u001f\u007f]/;
const fieldOrder = [
  "name",
  "email",
  "phone",
  "organization",
  "title",
  "researchInterests"
];
const textLimits = {
  name: 30,
  email: 254,
  phone: 30,
  organization: 60,
  title: 40,
  researchInterests: 200
};
const fieldLabels = {
  name: "姓名",
  email: "邮箱",
  phone: "手机号",
  organization: "所属机构",
  title: "职务职称",
  researchInterests: "研究方向"
};
const errorStyle = {
  margin: "6px 0 0",
  color: "var(--danger)",
  fontSize: "12px",
  lineHeight: "18px"
};
const visuallyHiddenStyle = {
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: 0,
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0
};
const normalizeText$1 = (value) => value.normalize("NFC").trim();
const normalizedProfile = (profile) => ({
  avatarDataUrl: profile.avatarDataUrl,
  name: normalizeText$1(profile.name),
  email: normalizeText$1(profile.email),
  phone: normalizeText$1(profile.phone),
  organization: normalizeText$1(profile.organization),
  title: normalizeText$1(profile.title),
  researchInterests: normalizeText$1(profile.researchInterests)
});
const profilesEqual = (first, second) => first.avatarDataUrl === second.avatarDataUrl && fieldOrder.every((field) => first[field] === second[field]);
const validateField = (field, rawValue) => {
  const value = normalizeText$1(rawValue);
  const label = fieldLabels[field];
  if (field === "name" && value.length === 0) return "请输入姓名。";
  if (CONTROL_CHARACTERS$1.test(value)) return `${label}不能包含控制字符。`;
  if (Array.from(value).length > textLimits[field]) return `${label}最多${textLimits[field]}个字符。`;
  if (field === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return "请输入有效的邮箱地址。";
  }
  if (field === "phone" && value) {
    const normalizedPhone = value.replace(/[\s()-]/g, "");
    if (!/^\+?\d{7,15}$/.test(normalizedPhone)) return "请输入7至15位有效电话号码。";
  }
  return void 0;
};
const validateProfile = (profile) => {
  const errors = {};
  for (const field of fieldOrder) {
    const error = validateField(field, profile[field]);
    if (error) errors[field] = error;
  }
  return errors;
};
const readFileAsDataUrl = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onerror = () => reject(new Error("read-failed"));
  reader.onload = () => typeof reader.result === "string" ? resolve(reader.result) : reject(new Error("read-failed"));
  reader.readAsDataURL(file);
});
const loadImage = (source) => new Promise((resolve, reject) => {
  const image = new Image();
  image.onload = () => resolve(image);
  image.onerror = () => reject(new Error("decode-failed"));
  image.src = source;
});
const prepareAvatar = async (file) => {
  const source = await readFileAsDataUrl(file);
  const image = await loadImage(source);
  if (!image.naturalWidth || !image.naturalHeight) throw new Error("decode-failed");
  const cropSize = Math.min(image.naturalWidth, image.naturalHeight);
  const sourceX = (image.naturalWidth - cropSize) / 2;
  const sourceY = (image.naturalHeight - cropSize) / 2;
  const canvas = document.createElement("canvas");
  canvas.width = AVATAR_SIZE;
  canvas.height = AVATAR_SIZE;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("process-failed");
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, AVATAR_SIZE, AVATAR_SIZE);
  context.drawImage(
    image,
    sourceX,
    sourceY,
    cropSize,
    cropSize,
    0,
    0,
    AVATAR_SIZE,
    AVATAR_SIZE
  );
  const result = canvas.toDataURL("image/jpeg", 0.86);
  if (!result.startsWith("data:image/jpeg;base64,") || result.length > 5e5) {
    throw new Error("process-failed");
  }
  return result;
};
function ProfileSettingsModal({ profile, onClose, onSave }) {
  const [draft, setDraft] = reactExports.useState(() => ({ ...profile }));
  const [errors, setErrors] = reactExports.useState({});
  const [avatarError, setAvatarError] = reactExports.useState("");
  const [formError, setFormError] = reactExports.useState("");
  const [confirmClose, setConfirmClose] = reactExports.useState(false);
  const [avatarBusy, setAvatarBusy] = reactExports.useState(false);
  const avatarRequestRef = reactExports.useRef(0);
  const avatarInputRef = reactExports.useRef(null);
  const avatarButtonRef = reactExports.useRef(null);
  const discardMessageRef = reactExports.useRef(null);
  const fieldRefs = reactExports.useRef({});
  const dirty = reactExports.useMemo(() => !profilesEqual(draft, profile), [draft, profile]);
  const researchInterestCount = Array.from(draft.researchInterests).length;
  reactExports.useEffect(() => () => {
    avatarRequestRef.current += 1;
  }, []);
  reactExports.useEffect(() => {
    if (!confirmClose) return;
    const frame = window.requestAnimationFrame(() => discardMessageRef.current?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [confirmClose]);
  const updateField = (field, value) => {
    setDraft((current) => ({ ...current, [field]: value }));
    setFormError("");
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: validateField(field, value) }));
    }
  };
  const validateOnBlur = (field) => {
    setErrors((current) => ({ ...current, [field]: validateField(field, draft[field]) }));
  };
  const requestClose = () => {
    if (dirty) {
      setConfirmClose(true);
      return;
    }
    onClose();
  };
  const discardChanges = (event) => {
    event.preventDefault();
    onClose();
  };
  const selectAvatar = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setAvatarError("");
    setFormError("");
    if (!ALLOWED_AVATAR_TYPES.has(file.type)) {
      setAvatarError("请选择 PNG、JPEG 或 WebP 图片。");
      avatarButtonRef.current?.focus();
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      setAvatarError("图片大小不能超过 2 MiB。");
      avatarButtonRef.current?.focus();
      return;
    }
    const requestId = avatarRequestRef.current + 1;
    avatarRequestRef.current = requestId;
    setAvatarBusy(true);
    try {
      const avatarDataUrl = await prepareAvatar(file);
      if (avatarRequestRef.current !== requestId) return;
      setDraft((current) => ({ ...current, avatarDataUrl }));
    } catch {
      if (avatarRequestRef.current === requestId) {
        setAvatarError("无法读取这张图片，请选择其他图片。");
        avatarButtonRef.current?.focus();
      }
    } finally {
      if (avatarRequestRef.current === requestId) setAvatarBusy(false);
    }
  };
  const removeAvatar = () => {
    avatarRequestRef.current += 1;
    setAvatarBusy(false);
    setAvatarError("");
    setFormError("");
    setDraft((current) => ({ ...current, avatarDataUrl: null }));
  };
  const submitProfile = (event) => {
    event.preventDefault();
    if (avatarBusy) return;
    const normalized = normalizedProfile(draft);
    const nextErrors = validateProfile(normalized);
    setDraft(normalized);
    setErrors(nextErrors);
    setFormError("");
    const firstInvalidField = fieldOrder.find((field) => nextErrors[field]);
    if (firstInvalidField) {
      window.requestAnimationFrame(() => fieldRefs.current[firstInvalidField]?.focus());
      return;
    }
    try {
      const saveError = onSave(normalized);
      if (saveError) {
        setFormError(saveError);
        return;
      }
      onClose();
    } catch {
      setFormError("保存个人资料时发生错误，请重试。");
    }
  };
  if (confirmClose) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Modal,
      {
        title: "放弃修改？",
        onClose: () => setConfirmClose(false),
        onSubmit: discardChanges,
        cancelText: "继续编辑",
        confirmText: "放弃修改",
        confirmDanger: true,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            ref: discardMessageRef,
            tabIndex: -1,
            style: { margin: 0, color: "var(--text-2)", lineHeight: "22px", outline: "none" },
            children: "个人资料尚未保存，放弃后本次修改将无法恢复。"
          }
        )
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Modal,
    {
      title: "个人信息设置",
      onClose: requestClose,
      onSubmit: submitProfile,
      confirmText: "保存",
      confirmDisabled: avatarBusy || !dirty,
      children: [
        formError && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            role: "alert",
            style: { marginBottom: "14px", padding: "8px 12px", borderRadius: "4px", color: "var(--danger)", background: "#fff2f0" },
            children: formError
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: draft.avatarDataUrl ?? "./assets/avatar-user.svg",
              alt: "头像预览",
              style: { width: "64px", height: "64px", flex: "0 0 64px", borderRadius: "50%", objectFit: "cover", outline: "1px solid rgba(0, 0, 0, 0.1)" }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexWrap: "wrap", gap: "8px" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  ref: avatarInputRef,
                  type: "file",
                  accept: "image/png,image/jpeg,image/webp",
                  "aria-label": "选择头像图片",
                  style: visuallyHiddenStyle,
                  onChange: (event) => void selectAvatar(event)
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  ref: avatarButtonRef,
                  className: "button button--secondary",
                  type: "button",
                  disabled: avatarBusy,
                  onClick: () => avatarInputRef.current?.click(),
                  children: avatarBusy ? "处理中…" : "更换头像"
                }
              ),
              draft.avatarDataUrl && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "button button--secondary", type: "button", disabled: avatarBusy, onClick: removeAvatar, children: "恢复默认" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "field-help", children: "支持 PNG、JPEG、WebP，文件不超过 2 MiB" }),
            avatarError && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { role: "alert", style: errorStyle, children: avatarError })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "field-label", htmlFor: "profile-name", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "required-mark", children: "*" }),
          " 姓名："
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            ref: (element) => {
              fieldRefs.current.name = element ?? void 0;
            },
            className: "text-field",
            id: "profile-name",
            value: draft.name,
            maxLength: 30,
            autoComplete: "name",
            autoFocus: true,
            "aria-invalid": Boolean(errors.name),
            "aria-describedby": errors.name ? "profile-name-error" : void 0,
            onChange: (event) => updateField("name", event.target.value),
            onBlur: () => validateOnBlur("name")
          }
        ),
        errors.name && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { id: "profile-name-error", role: "alert", style: errorStyle, children: errors.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "field-label", htmlFor: "profile-email", children: "邮箱：" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            ref: (element) => {
              fieldRefs.current.email = element ?? void 0;
            },
            className: "text-field",
            id: "profile-email",
            value: draft.email,
            maxLength: 254,
            inputMode: "email",
            autoComplete: "email",
            "aria-invalid": Boolean(errors.email),
            "aria-describedby": errors.email ? "profile-email-error" : void 0,
            placeholder: "name@example.com",
            onChange: (event) => updateField("email", event.target.value),
            onBlur: () => validateOnBlur("email")
          }
        ),
        errors.email && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { id: "profile-email-error", role: "alert", style: errorStyle, children: errors.email }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "field-label", htmlFor: "profile-phone", children: "手机号：" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            ref: (element) => {
              fieldRefs.current.phone = element ?? void 0;
            },
            className: "text-field",
            id: "profile-phone",
            value: draft.phone,
            maxLength: 30,
            inputMode: "tel",
            autoComplete: "tel",
            "aria-invalid": Boolean(errors.phone),
            "aria-describedby": errors.phone ? "profile-phone-error" : void 0,
            placeholder: "请输入手机号",
            onChange: (event) => updateField("phone", event.target.value),
            onBlur: () => validateOnBlur("phone")
          }
        ),
        errors.phone && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { id: "profile-phone-error", role: "alert", style: errorStyle, children: errors.phone }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "field-label", htmlFor: "profile-organization", children: "所属机构：" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            ref: (element) => {
              fieldRefs.current.organization = element ?? void 0;
            },
            className: "text-field",
            id: "profile-organization",
            value: draft.organization,
            maxLength: 60,
            autoComplete: "organization",
            "aria-invalid": Boolean(errors.organization),
            "aria-describedby": errors.organization ? "profile-organization-error" : void 0,
            placeholder: "请输入所属机构",
            onChange: (event) => updateField("organization", event.target.value),
            onBlur: () => validateOnBlur("organization")
          }
        ),
        errors.organization && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { id: "profile-organization-error", role: "alert", style: errorStyle, children: errors.organization }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "field-label", htmlFor: "profile-title", children: "职务职称：" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            ref: (element) => {
              fieldRefs.current.title = element ?? void 0;
            },
            className: "text-field",
            id: "profile-title",
            value: draft.title,
            maxLength: 40,
            autoComplete: "organization-title",
            "aria-invalid": Boolean(errors.title),
            "aria-describedby": errors.title ? "profile-title-error" : void 0,
            placeholder: "请输入职务或职称",
            onChange: (event) => updateField("title", event.target.value),
            onBlur: () => validateOnBlur("title")
          }
        ),
        errors.title && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { id: "profile-title-error", role: "alert", style: errorStyle, children: errors.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "field-label", htmlFor: "profile-research-interests", children: "研究方向：" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "textarea",
          {
            ref: (element) => {
              fieldRefs.current.researchInterests = element ?? void 0;
            },
            className: "text-field",
            id: "profile-research-interests",
            value: draft.researchInterests,
            maxLength: 200,
            rows: 3,
            "aria-invalid": Boolean(errors.researchInterests),
            "aria-describedby": errors.researchInterests ? "profile-research-interests-error" : "profile-research-interests-help",
            placeholder: "请输入研究方向",
            style: { height: "76px", resize: "vertical" },
            onChange: (event) => updateField("researchInterests", event.target.value),
            onBlur: () => validateOnBlur("researchInterests")
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { id: "profile-research-interests-help", className: "field-help", style: { textAlign: "right", fontVariantNumeric: "tabular-nums" }, children: [
          researchInterestCount,
          "/200"
        ] }),
        errors.researchInterests && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { id: "profile-research-interests-error", role: "alert", style: errorStyle, children: errors.researchInterests })
      ]
    }
  );
}
const readingDocuments = [
  {
    id: 1,
    title: "锂硫电池中多硫化物穿梭效应的抑制机制研究：基于功能化碳纳米管界面的储能材料",
    authors: "刘建国、陈思远、王磊",
    journal: "Advanced Energy Materials",
    year: "2023",
    type: "Word",
    size: "12.5 MB",
    favorite: false,
    folder: "我的笔记库1"
  },
  {
    id: 2,
    title: "高离子电导率硫化物固态电解质的界面稳定化策略",
    authors: "周明、李若晨",
    journal: "Nature Energy",
    year: "2024",
    type: "PDF",
    size: "15.8 MB",
    favorite: true,
    folder: "我的笔记库1"
  },
  {
    id: 3,
    title: "一种高比能锂离子电池硅碳复合负极材料及其制备方法",
    authors: "王磊、赵启航",
    journal: "中国发明专利",
    year: "2024",
    type: "PDF",
    size: "15.0 MB",
    favorite: false,
    folder: "我的笔记库1"
  },
  {
    id: 4,
    title: "全球储能材料技术趋势与市场格局分析报告(2024年上半年)",
    authors: "陈思远、孙悦",
    journal: "储能产业研究院",
    year: "2023",
    type: "Word",
    size: "12.5 MB",
    favorite: false,
    folder: "我的笔记库1"
  }
];
const initialReadingNotes = [
  {
    id: 1,
    title: "多硫化物穿梭效应",
    excerpt: "多硫化物穿梭效应通常出现在锂硫电池中，...",
    createdAt: "",
    color: "#FFE4BA"
  },
  {
    id: 2,
    title: "多硫化物穿梭效应",
    excerpt: "多硫化物穿梭效应通常出现在锂硫电池中，...",
    createdAt: "",
    color: "#FABFBD"
  },
  {
    id: 3,
    title: "多硫化物穿梭效应",
    excerpt: "多硫化物穿梭效应通常出现在锂硫电池中，...",
    createdAt: "",
    color: "#C6EFC1"
  },
  {
    id: 4,
    title: "多硫化物穿梭效应",
    excerpt: "多硫化物穿梭效应通常出现在锂硫电池中，...",
    createdAt: "",
    color: "#DCC9FB"
  }
];
const outlineGroups = [
  { title: "摘要", children: [] },
  { title: "1.引言", children: ["1.1.研究背景与意义", "1.2.研究现状"] },
  { title: "2.实验材料与方法", children: ["2.1.原料制备", "2.2.表征手段", "2.3.电化学测试"] },
  { title: "3.结果与讨论", children: ["3.1.材料形貌分析", "3.2.储能机制研究", "3.3.电化学性能评估"] },
  { title: "4.结论", children: [] },
  { title: "参考文献", children: [] }
];
const articleSections = [
  {
    title: "1.引言",
    parts: [
      {
        title: "1.1.研究背景与意义",
        body: "锂硫电池因具有较高的理论比容量和能量密度，被认为是具有应用前景的新一代储能体系。然而，在实际充放电过程中，硫正极会生成可溶性的长链多硫化物 Li₂Sₙ（4≤n≤8），这些多硫化物容易在正负极之间迁移，产生典型的“穿梭效应”。该过程会导致活性物质流失、库仑效率下降、容量快速衰减，并严重影响锂硫电池的循环寿命。"
      },
      {
        title: "1.2.研究现状",
        body: "针对这一问题，本研究以功能化碳纳米管作为正极宿主材料，通过在其表面引入羧基、氨基等官能团，增强其对长链多硫化物的化学吸附能力。研究功能化碳纳米管界面对多硫化物迁移行为的抑制机制，为提升锂硫电池稳定性提供依据。"
      }
    ]
  },
  {
    title: "2.实验材料与方法",
    parts: [
      {
        title: "2.1.原料制备",
        body: "采用酸化处理与表面接枝相结合的方法制备功能化碳纳米管。通过控制反应温度、时间及官能团比例，使材料在保持连续导电网络的同时获得均匀的极性活性位点。"
      },
      {
        title: "2.2.表征手段",
        body: "利用原位 XRD、冷冻电子显微镜与密度泛函理论计算，对多硫化物在充放电过程中的演化和界面吸附行为进行联合分析，实验表征与理论计算结果相互印证。"
      },
      {
        title: "2.3.电化学测试",
        body: "测试结果显示，功能化碳纳米管正极宿主材料相比对照组使比容量提升 186%，并在 1000 次循环后保持 92.3% 的容量，表现出优异的长循环稳定性。"
      }
    ]
  },
  {
    title: "3.结果与讨论",
    parts: [
      {
        title: "3.1.材料形貌分析",
        body: "功能化碳纳米管保留了一维导电网络结构，表面羧基、氨基官能团使其由单纯导电载体转变为兼具导电性和化学吸附能力的功能界面材料。"
      },
      {
        title: "3.2.储能机制研究",
        body: "极性官能团与长链多硫化物之间形成稳定的界面相互作用，使多硫化物更倾向于停留在正极区域，并促进其向低阶硫化锂物种可逆转化。"
      },
      {
        title: "3.3.电化学性能评估",
        body: "功能化界面长期限制多硫化物迁移，降低活性物质损失并减缓电极结构退化，显著改善硫正极反应活性、电荷传输效率和容量保持率。"
      }
    ]
  },
  {
    title: "4.结论",
    parts: [
      {
        title: "",
        body: "本研究系统揭示了功能化碳纳米管界面调控多硫化物吸附与转化的作用机制，为高性能锂硫电池正极宿主材料的设计提供了有效思路。"
      }
    ]
  }
];
const documentMeta = {
  1: { date: "2026.07.09", uploadedAt: "2026-07-09T10:00:00", editedAt: "2026-07-10T15:30:00", tag: "论文" },
  2: { date: "2026.07.08", uploadedAt: "2026-07-08T10:00:00", editedAt: "2026-07-11T09:20:00", tag: "专利" },
  3: { date: "2026.07.07", uploadedAt: "2026-07-07T10:00:00", editedAt: "2026-07-09T16:10:00", tag: "报告" },
  4: { date: "2026.07.06", uploadedAt: "2026-07-06T10:00:00", editedAt: "2026-07-12T11:45:00", tag: "论文" }
};
const libraryTagClass = {
  论文: "paper",
  专利: "patent",
  报告: "report"
};
const trapDialogFocus = (event) => {
  if (event.key !== "Tab") return;
  const focusable = Array.from(event.currentTarget.querySelectorAll('button:not(:disabled), input:not(:disabled), select:not(:disabled), [tabindex]:not([tabindex="-1"])'));
  if (focusable.length === 0) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
};
function OverflowLabel({ text, className = "" }) {
  const labelRef = reactExports.useRef(null);
  const [tooltip, setTooltip] = reactExports.useState(null);
  const hideTooltip = () => setTooltip(null);
  const showTooltip = () => {
    const label = labelRef.current;
    if (!label || label.scrollWidth <= label.clientWidth + 1) return;
    const rect = label.getBoundingClientRect();
    const maxWidth = Math.min(360, Math.max(180, Math.ceil(text.length * 14)));
    const left = Math.min(Math.max(12, rect.left), Math.max(12, window.innerWidth - maxWidth - 12));
    const above = rect.bottom + 64 > window.innerHeight;
    setTooltip({ top: above ? rect.top - 8 : rect.bottom + 8, left, maxWidth, above });
  };
  reactExports.useEffect(() => {
    const label = labelRef.current;
    const owner = label?.closest("button");
    if (!label || !owner) return;
    owner.addEventListener("focus", showTooltip);
    owner.addEventListener("blur", hideTooltip);
    window.addEventListener("resize", hideTooltip);
    window.addEventListener("scroll", hideTooltip, true);
    const observer = new ResizeObserver(() => {
      if (label.scrollWidth <= label.clientWidth + 1) hideTooltip();
    });
    observer.observe(label);
    return () => {
      owner.removeEventListener("focus", showTooltip);
      owner.removeEventListener("blur", hideTooltip);
      window.removeEventListener("resize", hideTooltip);
      window.removeEventListener("scroll", hideTooltip, true);
      observer.disconnect();
    };
  }, [text]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { ref: labelRef, className: `reading-overflow-label${className ? ` ${className}` : ""}`, onPointerEnter: showTooltip, onPointerLeave: hideTooltip, children: text }),
    tooltip && reactDomExports.createPortal(
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: `reading-field-tooltip${tooltip.above ? " is-above" : ""}`,
          role: "tooltip",
          style: { top: tooltip.top, left: tooltip.left, maxWidth: tooltip.maxWidth },
          children: text
        }
      ),
      document.body
    )
  ] });
}
function ReadingLibrary({
  documents,
  onDocumentsChange,
  selectedDocumentId,
  onSelectDocument,
  onOpenDocument,
  onBack,
  onUpload,
  onToast,
  folders,
  onFoldersChange
}) {
  const [section, setSection] = reactExports.useState("all");
  const [filter, setFilter] = reactExports.useState("全部");
  const [filterOpen, setFilterOpen] = reactExports.useState(false);
  const [search, setSearch] = reactExports.useState("");
  const [sortMode, setSortMode] = reactExports.useState("最近上传");
  const [sortOpen, setSortOpen] = reactExports.useState(false);
  const [page, setPage] = reactExports.useState(1);
  const [pageSize, setPageSize] = reactExports.useState(10);
  const [pageSizeOpen, setPageSizeOpen] = reactExports.useState(false);
  const [activeFolder, setActiveFolder] = reactExports.useState("我的笔记库1");
  const [expandedFolder, setExpandedFolder] = reactExports.useState("我的笔记库1");
  const [newFolderOpen, setNewFolderOpen] = reactExports.useState(false);
  const [newFolderName, setNewFolderName] = reactExports.useState("");
  const [newFolderError, setNewFolderError] = reactExports.useState("");
  const [renamingFolder, setRenamingFolder] = reactExports.useState(null);
  const [renameFolderValue, setRenameFolderValue] = reactExports.useState("");
  const [menuDocumentId, setMenuDocumentId] = reactExports.useState(null);
  const [moveDocumentId, setMoveDocumentId] = reactExports.useState(null);
  const [moveTarget, setMoveTarget] = reactExports.useState("我的笔记库1");
  const [moveSearch, setMoveSearch] = reactExports.useState("");
  const [moveTab, setMoveTab] = reactExports.useState("全部");
  const libraryRef = reactExports.useRef(null);
  const newFolderInputRef = reactExports.useRef(null);
  const newFolderCancelledRef = reactExports.useRef(false);
  const newFolderCommittedRef = reactExports.useRef(false);
  const sortTriggerRef = reactExports.useRef(null);
  const sortOptionRefs = reactExports.useRef([]);
  const focusNewFolderInput = (select = false) => {
    window.requestAnimationFrame(() => {
      newFolderInputRef.current?.focus();
      if (select) newFolderInputRef.current?.select();
    });
  };
  const startNewFolder = () => {
    if (section !== "all") return;
    if (newFolderOpen) {
      focusNewFolderInput();
      return;
    }
    newFolderCancelledRef.current = false;
    newFolderCommittedRef.current = false;
    setNewFolderName("");
    setNewFolderError("");
    setRenamingFolder(null);
    setNewFolderOpen(true);
  };
  const cancelNewFolder = () => {
    newFolderCancelledRef.current = true;
    setNewFolderOpen(false);
    setNewFolderName("");
    setNewFolderError("");
  };
  const closeSortMenu = (restoreFocus = false) => {
    setSortOpen(false);
    if (restoreFocus) window.requestAnimationFrame(() => sortTriggerRef.current?.focus());
  };
  const focusSortOption = (index) => {
    window.requestAnimationFrame(() => sortOptionRefs.current[index]?.focus());
  };
  reactExports.useEffect(() => {
    const closeMenus = (event) => {
      const target = event.target;
      if (!libraryRef.current?.contains(target)) {
        setFilterOpen(false);
        setSortOpen(false);
        setPageSizeOpen(false);
        setMenuDocumentId(null);
        return;
      }
      if (!target.closest(".reading-library-filter-wrap") && !target.closest(".reading-library-sort-wrap") && !target.closest(".reading-library-page-size-wrap") && !target.closest(".reading-library-card-menu-wrap")) {
        setFilterOpen(false);
        setSortOpen(false);
        setPageSizeOpen(false);
        setMenuDocumentId(null);
      }
    };
    window.addEventListener("click", closeMenus);
    return () => window.removeEventListener("click", closeMenus);
  }, []);
  reactExports.useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key !== "Escape") return;
      setFilterOpen(false);
      if (sortOpen) closeSortMenu(true);
      setPageSizeOpen(false);
      setMenuDocumentId(null);
      setMoveDocumentId(null);
      if (newFolderOpen) cancelNewFolder();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [newFolderOpen, sortOpen]);
  const visibleDocuments = reactExports.useMemo(() => {
    let list = section === "favorites" ? documents.filter((document2) => document2.favorite) : documents;
    if (filter !== "全部") list = list.filter((document2) => (documentMeta[document2.id]?.tag ?? "论文") === filter);
    const keyword = search.trim().toLowerCase();
    if (keyword) list = list.filter((document2) => `${document2.title}${document2.authors}${document2.journal}`.toLowerCase().includes(keyword));
    const field = sortMode === "最近上传" ? "uploadedAt" : "editedAt";
    return list.slice().sort((first, second) => {
      const firstValue = documentMeta[first.id]?.[field] ?? "";
      const secondValue = documentMeta[second.id]?.[field] ?? "";
      return secondValue.localeCompare(firstValue) || first.title.localeCompare(second.title, "zh-CN");
    });
  }, [documents, filter, search, section, sortMode]);
  const toggleFavorite = (documentId) => {
    onDocumentsChange(documents.map((document2) => document2.id === documentId ? { ...document2, favorite: !document2.favorite } : document2));
  };
  const commitNewFolder = (origin) => {
    if (newFolderCancelledRef.current || newFolderCommittedRef.current) return;
    const name = newFolderName.trim();
    if (!name) {
      if (origin === "enter") {
        setNewFolderError("请输入文件夹名称");
        focusNewFolderInput();
      } else {
        cancelNewFolder();
      }
      return;
    }
    if (folders.some((folder) => folder.toLocaleLowerCase() === name.toLocaleLowerCase())) {
      setNewFolderError("文件夹名称已存在");
      onToast("文件夹名称已存在");
      focusNewFolderInput(true);
      return;
    }
    newFolderCommittedRef.current = true;
    onFoldersChange([name, ...folders]);
    setNewFolderName("");
    setNewFolderError("");
    setNewFolderOpen(false);
    onToast(`已新建“${name}”`);
  };
  const commitFolderRename = () => {
    if (renamingFolder == null) return;
    const value = renameFolderValue.trim();
    if (value && value !== renamingFolder) {
      onFoldersChange(folders.map((folder) => folder === renamingFolder ? value : folder));
      if (activeFolder === renamingFolder) setActiveFolder(value);
      if (expandedFolder === renamingFolder) setExpandedFolder(value);
    }
    setRenamingFolder(null);
    setRenameFolderValue("");
  };
  const confirmMove = () => {
    if (moveDocumentId == null) return;
    onDocumentsChange(documents.map((document2) => document2.id === moveDocumentId ? { ...document2, folder: moveTarget } : document2));
    setMoveDocumentId(null);
    setActiveFolder(moveTarget);
  };
  const downloadDocument = (documentItem) => {
    const body = [
      documentItem.title,
      `作者：${documentItem.authors}`,
      `来源：${documentItem.journal}（${documentItem.year}）`,
      `文件类型：${documentItem.type}`
    ].join("\n");
    const url = URL.createObjectURL(new Blob([body], { type: "text/plain;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${documentItem.title}.txt`;
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  };
  const folderDocuments = documents.filter((document2) => document2.folder === activeFolder).slice(0, 4);
  const selectLibraryDocument = (documentItem) => {
    setFilter("全部");
    setSearch("");
    setPage(1);
    onSelectDocument(documentItem.id);
    window.requestAnimationFrame(() => {
      window.document.getElementById(`reading-library-card-${documentItem.id}`)?.scrollIntoView({ block: "nearest" });
    });
  };
  const selectSortMode = (mode) => {
    setSortMode(mode);
    closeSortMenu(true);
  };
  const handleSortTriggerKeyDown = (event) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    setSortOpen(true);
    focusSortOption(event.key === "ArrowDown" ? 0 : 1);
  };
  const handleSortMenuKeyDown = (event) => {
    const activeIndex = sortOptionRefs.current.findIndex((option) => option === document.activeElement);
    if (event.key === "Escape") {
      event.preventDefault();
      closeSortMenu(true);
      return;
    }
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    if (event.key === "Home") focusSortOption(0);
    else if (event.key === "End") focusSortOption(1);
    else focusSortOption(event.key === "ArrowDown" ? (activeIndex + 1 + 2) % 2 : (activeIndex - 1 + 2) % 2);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "reading-library-frame", ref: libraryRef, "aria-label": "智能阅读库", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "reading-library-header", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", "aria-label": "返回阅读", onClick: onBack, children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { className: "reading-library-back", src: "./assets/reading/back.svg", alt: "" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: "智能阅读库" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "reading-library-search", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "./assets/reading/search.svg", alt: "" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: search, onChange: (event) => setSearch(event.target.value), placeholder: "搜索文献标题、作者或期刊", "aria-label": "搜索智能阅读库" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "reading-library-sidebar", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reading-library-rail", role: "tablist", "aria-label": "阅读库分类", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", role: "tab", "aria-selected": section === "all", className: section === "all" ? "is-active" : "", onClick: () => setSection("all"), "aria-label": "全部笔记", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "./assets/reading/library-note.svg", alt: "" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", role: "tab", "aria-selected": section === "favorites", className: section === "favorites" ? "is-active" : "", onClick: () => setSection("favorites"), "aria-label": "我的收藏", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "./assets/reading/library-favorite.svg", alt: "" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reading-library-tree", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reading-library-tree-heading", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: section === "favorites" ? "收藏" : "笔记" }),
          section === "all" && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", "aria-label": "新建文件夹", "aria-expanded": newFolderOpen, onClick: startNewFolder, children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "./assets/reading/create-folder.svg", alt: "" }) })
        ] }),
        section === "all" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reading-folder-tree", children: [
          newFolderOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `reading-new-folder-row${newFolderError ? " has-error" : ""}`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("img", { className: "reading-folder-chevron is-collapsed", src: "./assets/reading/library-folder.svg", alt: "" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("img", { className: "reading-folder-icon", src: "./assets/reading/library-folder-shape.svg", alt: "" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: newFolderInputRef, value: newFolderName, maxLength: 30, "aria-label": "新文件夹名称", "aria-invalid": Boolean(newFolderError), "aria-describedby": newFolderError ? "reading-new-folder-error" : void 0, onChange: (event) => {
                setNewFolderName(event.target.value);
                if (newFolderError) setNewFolderError("");
              }, onKeyDown: (event) => {
                if (event.nativeEvent.isComposing) return;
                if (event.key === "Enter") {
                  event.preventDefault();
                  commitNewFolder("enter");
                } else if (event.key === "Escape") {
                  event.preventDefault();
                  cancelNewFolder();
                }
              }, onBlur: () => commitNewFolder("blur"), autoFocus: true })
            ] }),
            newFolderError && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", role: "alert", id: "reading-new-folder-error", children: newFolderError })
          ] }),
          folders.map((folder) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            renamingFolder === folder ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reading-new-folder-row is-renaming", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("img", { className: `reading-folder-chevron${expandedFolder === folder ? "" : " is-collapsed"}`, src: "./assets/reading/library-folder.svg", alt: "" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: renameFolderValue, onChange: (event) => setRenameFolderValue(event.target.value), onKeyDown: (event) => {
                if (event.key === "Enter") commitFolderRename();
                if (event.key === "Escape") setRenamingFolder(null);
              }, onBlur: commitFolderRename, autoFocus: true })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                className: `reading-folder-row${activeFolder === folder ? " is-active" : ""}`,
                "aria-expanded": expandedFolder === folder,
                "aria-label": folder,
                onClick: () => {
                  setActiveFolder(folder);
                  setExpandedFolder((current) => current === folder ? "" : folder);
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("img", { className: `reading-folder-chevron${expandedFolder === folder ? "" : " is-collapsed"}`, src: "./assets/reading/library-folder.svg", alt: "" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("img", { className: "reading-folder-icon", src: "./assets/reading/library-folder-shape.svg", alt: "" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(OverflowLabel, { text: folder })
                ]
              }
            ),
            expandedFolder === folder && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "reading-folder-docs", children: folderDocuments.map((document2) => {
              const selected = document2.id === selectedDocumentId;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", "aria-label": document2.title, "aria-current": selected ? "true" : void 0, "aria-controls": `reading-library-card-${document2.id}`, className: selected ? "is-active" : "", onClick: () => selectLibraryDocument(document2), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: selected ? "./assets/reading/notes-active.svg" : "./assets/reading/notes.svg", alt: "" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(OverflowLabel, { text: document2.title })
              ] }, document2.id);
            }) })
          ] }, folder))
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "reading-folder-tree", children: ["我的收藏1", "我的收藏2"].map((folder, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", "aria-label": folder, className: `reading-folder-row${index === 0 ? " is-active" : ""}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { className: `reading-folder-chevron${index === 0 ? "" : " is-collapsed"}`, src: "./assets/reading/library-folder.svg", alt: "" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { className: "reading-folder-icon", src: "./assets/reading/library-folder-shape.svg", alt: "" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(OverflowLabel, { text: folder })
          ] }),
          index === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "reading-folder-docs", children: documents.filter((document2) => document2.favorite).map((document2) => {
            const selected = document2.id === selectedDocumentId;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", "aria-label": document2.title, "aria-current": selected ? "true" : void 0, "aria-controls": `reading-library-card-${document2.id}`, className: selected ? "is-active" : "", onClick: () => selectLibraryDocument(document2), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: selected ? "./assets/reading/notes-active.svg" : "./assets/reading/notes.svg", alt: "" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(OverflowLabel, { text: document2.title })
            ] }, document2.id);
          }) })
        ] }, folder)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "reading-library-main", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reading-library-toolbar", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reading-library-filter-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", className: filterOpen ? "is-open" : "", onClick: (event) => {
            event.stopPropagation();
            setSortOpen(false);
            setPageSizeOpen(false);
            setFilterOpen((open) => !open);
          }, children: [
            filter,
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { className: filterOpen ? "is-open" : "", src: "./assets/direction-down.svg", alt: "" })
          ] }),
          filterOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "reading-library-filter-menu", role: "menu", children: ["全部", "论文", "专利", "报告"].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", role: "menuitem", className: filter === item ? "is-active" : "", onClick: () => {
            setFilter(item);
            setFilterOpen(false);
          }, children: item }, item)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reading-library-sort-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { ref: sortTriggerRef, type: "button", className: `reading-library-sort${sortOpen ? " is-open" : ""}`, "aria-haspopup": "listbox", "aria-expanded": sortOpen, "aria-controls": "reading-library-sort-list", onKeyDown: handleSortTriggerKeyDown, onClick: (event) => {
            event.stopPropagation();
            setFilterOpen(false);
            setPageSizeOpen(false);
            if (sortOpen) closeSortMenu();
            else setSortOpen(true);
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "排序" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("i", {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx("b", { className: "reading-library-sort-value", children: sortMode }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { className: sortOpen ? "is-open" : "", src: "./assets/reading/sort-chevron.svg", alt: "" })
          ] }),
          sortOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { id: "reading-library-sort-list", className: "reading-library-sort-menu", role: "listbox", "aria-label": "选择排序方式", onKeyDown: handleSortMenuKeyDown, children: ["最近上传", "最后编辑"].map((mode, index) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { ref: (option) => {
            sortOptionRefs.current[index] = option;
          }, type: "button", role: "option", "aria-selected": sortMode === mode, className: sortMode === mode ? "is-active" : "", onClick: () => selectSortMode(mode), children: mode }, mode)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reading-library-card-grid", children: [
        visibleDocuments.map((document2) => {
          const meta = documentMeta[document2.id] ?? { date: "2026.07.10", tag: "论文" };
          const selected = document2.id === selectedDocumentId;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { id: `reading-library-card-${document2.id}`, className: `reading-library-card${selected ? " is-selected" : ""}`, "aria-current": selected ? "true" : void 0, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { className: "reading-library-file-icon", src: document2.type === "PDF" ? "./assets/reading/pdf.svg" : "./assets/reading/docx.svg", alt: "" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reading-library-card-body", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "reading-library-card-title", children: document2.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reading-library-card-meta", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: `reading-library-star${document2.favorite ? " is-active" : ""}`, "aria-label": document2.favorite ? "取消收藏" : "收藏", onClick: () => toggleFavorite(document2.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: document2.favorite ? "./assets/reading/star.svg" : "./assets/reading/star-outline.svg", alt: "" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `reading-library-tag reading-library-tag--${libraryTagClass[meta.tag]}`, children: meta.tag }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: meta.date }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: document2.size.replace(" ", "") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "reading-library-card-spacer" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "reading-library-edit", "aria-label": `编辑${document2.title}`, onClick: () => onOpenDocument(document2), children: "编辑" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reading-library-card-menu-wrap", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", "aria-label": `${document2.title}更多操作`, onClick: (event) => {
                    event.stopPropagation();
                    setMenuDocumentId((current) => current === document2.id ? null : document2.id);
                  }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "reading-more-dots", "aria-hidden": "true" }) }),
                  menuDocumentId === document2.id && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reading-library-more-menu", role: "menu", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", role: "menuitem", onClick: () => {
                      setMoveDocumentId(document2.id);
                      setMoveTarget(document2.folder);
                      setMenuDocumentId(null);
                    }, children: "移动" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", role: "menuitem", onClick: () => {
                      setMenuDocumentId(null);
                      downloadDocument(document2);
                    }, children: "下载" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", role: "menuitem", onClick: () => {
                      onDocumentsChange(documents.filter((item) => item.id !== document2.id));
                      setMenuDocumentId(null);
                    }, children: "删除" })
                  ] })
                ] })
              ] })
            ] })
          ] }, document2.id);
        }),
        visibleDocuments.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reading-library-empty", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "./assets/reading/notes-empty.svg", alt: "" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "暂无文献" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "上传文件或切换筛选条件查看内容" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: onUpload, children: "上传文件" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reading-library-pagination", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", disabled: page === 1, "aria-label": "上一页", onClick: () => setPage((current) => Math.max(1, current - 1)), children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "reading-page-chevron is-prev" }) }),
        [1, 2, 3, 4, 5].map((number) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: page === number ? "is-active" : "", "aria-current": page === number ? "page" : void 0, onClick: () => setPage(number), children: number }, number)),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", disabled: page === 5, "aria-label": "下一页", onClick: () => setPage((current) => Math.min(5, current + 1)), children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "reading-page-chevron" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reading-library-page-size-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", className: `reading-page-size-trigger${pageSizeOpen ? " is-open" : ""}`, "aria-haspopup": "listbox", "aria-expanded": pageSizeOpen, onClick: () => setPageSizeOpen((open) => !open), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              pageSize,
              "条/页"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "reading-page-size-chevron", "aria-hidden": "true" })
          ] }),
          pageSizeOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "reading-page-size-menu", role: "listbox", "aria-label": "每页显示数量", children: [10, 20].map((size) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", role: "option", "aria-selected": pageSize === size, className: pageSize === size ? "is-active" : "", onClick: () => {
            setPageSize(size);
            setPage(1);
            setPageSizeOpen(false);
          }, children: [
            size,
            "条/页"
          ] }, size)) })
        ] })
      ] })
    ] }),
    moveDocumentId != null && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "reading-library-overlay", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "reading-move-modal", role: "dialog", "aria-modal": "true", "aria-labelledby": "reading-move-title", onKeyDown: trapDialogFocus, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { id: "reading-move-title", children: "移动笔记" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "reading-dialog-close", "aria-label": "关闭移动笔记", onClick: () => setMoveDocumentId(null) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "reading-move-search", value: moveSearch, onChange: (event) => setMoveSearch(event.target.value), placeholder: "搜索", autoFocus: true }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reading-move-tabs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: moveTab === "全部" ? "is-active" : "", onClick: () => setMoveTab("全部"), children: "全部" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: moveTab === "收藏" ? "is-active" : "", onClick: () => setMoveTab("收藏"), children: "收藏" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "reading-move-folders", children: folders.filter((folder) => folder.includes(moveSearch.trim())).map((folder) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", className: moveTarget === folder ? "is-active" : "", onClick: () => setMoveTarget(folder), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "reading-folder-shape", "aria-hidden": "true" }),
        folder,
        moveTarget === folder && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "./assets/selected-check.svg", alt: "" })
      ] }, folder)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setMoveDocumentId(null), children: "取消" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "reading-primary-button", onClick: confirmMove, children: "移动" })
      ] })
    ] }) })
  ] });
}
const insightTabs = [
  { id: "ai", label: "AI解读" },
  { id: "charts", label: "图表" },
  { id: "references", label: "参考文献" },
  { id: "metadata", label: "元数据" },
  { id: "graph", label: "图谱" }
];
const highlightColors = ["transparent", "#F2F3F5", "#FABFBD", "#FFE4BA", "#FADC19", "#C6EFC1", "#BDE3FF", "#DCC9FB", "#E5E6EB", "#C9CDD4", "#F76965", "#FF9A2E", "#FADC19", "#62C554", "#7BC0FC", "#B8A1FF"];
const aiSearchResults = [
  { page: 1, text: "最佳性能的模型也通过注意力机制连接编码器和解码器，我们提出了一种新的简单网络架构" },
  { page: 5, text: "Transformer模型架构完全基于注意力机制，完全摒弃了递归和卷积" },
  { page: 6, text: "我们在模型中以三种不同的方式使用多头注意力" },
  { page: 8, text: "我们的实验表明，基于注意力的方法优于之前最先进的模型" }
];
const aiSearchTargetSections = ["1.1.研究背景与意义", "2.1.原料制备", "2.2.表征手段", "3.1.材料形貌分析"];
const totalPages = 24;
const zoomPresets = [25, 50, 75, 100];
const translatedExcerpt = "Lithium-sulfur batteries are considered to be a promising new generation of energy storage systems due to their high theoretical specific capacity and energy density. However, during the actual charging and discharging process";
const explainedExcerpt = "多硫化物穿梭效应是指锂硫电池充放电过程中，可溶性锂多硫化物在正负极之间反复迁移并发生副反应的现象。它会造成活性硫流失、锂负极腐蚀、容量衰减、库伦效率降低和自放电加剧，是限制锂硫电池商业化应用的核心问题之一。";
const expandedNoteExcerpt = "多硫化物穿梭效应通常出现在锂硫电池中，是锂硫电池容量衰减、库伦效率低、自放电严重的重要原因之一。在放电阶段，正极硫被还原生成可溶性多硫化锂，这些中间产物溶入电解液后，在浓度梯度和电场作用下向锂负极迁移。到达负极后，它们可能与金属锂发生副反应，被进一步还原成短链多硫化物甚至 Li₂S / Li₂S₂，并沉积...全部";
const articleAbstract = "本研究系统性探究了功能化碳纳米管界面对锂硫电池中多硫化物穿梭效应的抑制机理。通过原位X射线衍射（in-situ XRD）、冷冻电子显微镜（cryo-EM）等先进表征手段，结合密度泛函理论（DFT）计算，揭示了碳纳米管表面羧基、氨基官能团与长链多硫化物（Li₂Sₙ，4≤n≤8）之间的化学吸附机制。实验结果表明，所制备的功能化碳纳米管正极宿主材料相比对照组使比容量提升186%，1000次循环后容量保持率达92.3%，展示了优异的长循环稳定性。";
const searchTranslation = "ThiosulfateThe model with the best performance also connects the encoder and decoder through an attention mechanism, and we propose a new simple network architecture. shuttle effect";
function sectionSlug(sectionTitle) {
  return sectionTitle.replace(/[^\d\u4e00-\u9fa5]/g, "");
}
function safeFileName(value) {
  return value.replace(/[\\/:*?"<>|]/g, "-").slice(0, 80);
}
function downloadLocalBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}
async function captureViewportCrop(rect) {
  const width = Math.max(1, Math.round(rect.width));
  const height = Math.max(1, Math.round(rect.height));
  const scale = Math.min(2, window.devicePixelRatio || 1);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas unavailable");
  context.scale(scale, scale);
  context.translate(-rect.left, -rect.top);
  context.beginPath();
  context.rect(rect.left, rect.top, width, height);
  context.clip();
  const excludedSelector = ".reading-screenshot-layer, .reading-screenshot-drag-rect, .reading-screenshot-crosshair, .reading-selection-toolbar";
  const elements = Array.from(document.body.querySelectorAll("*"));
  for (const element of elements) {
    if (element.matches(excludedSelector) || element.closest(excludedSelector)) continue;
    const bounds = element.getBoundingClientRect();
    if (bounds.right <= rect.left || bounds.left >= rect.left + width || bounds.bottom <= rect.top || bounds.top >= rect.top + height || bounds.width === 0 || bounds.height === 0) continue;
    const style = window.getComputedStyle(element);
    if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0) continue;
    context.globalAlpha = Number(style.opacity) || 1;
    if (style.backgroundColor !== "transparent" && style.backgroundColor !== "rgba(0, 0, 0, 0)") {
      context.fillStyle = style.backgroundColor;
      context.fillRect(bounds.left, bounds.top, bounds.width, bounds.height);
    }
    const borderSides = [
      ["top", bounds.left, bounds.top, bounds.right, bounds.top],
      ["right", bounds.right, bounds.top, bounds.right, bounds.bottom],
      ["bottom", bounds.left, bounds.bottom, bounds.right, bounds.bottom],
      ["left", bounds.left, bounds.top, bounds.left, bounds.bottom]
    ];
    borderSides.forEach(([side, x1, y1, x2, y2]) => {
      const borderWidth = Number.parseFloat(style[`border${side[0].toUpperCase()}${side.slice(1)}Width`]);
      const borderColor = style[`border${side[0].toUpperCase()}${side.slice(1)}Color`];
      if (!borderWidth || borderColor === "transparent" || borderColor === "rgba(0, 0, 0, 0)") return;
      context.strokeStyle = borderColor;
      context.lineWidth = borderWidth;
      context.beginPath();
      context.moveTo(x1, y1);
      context.lineTo(x2, y2);
      context.stroke();
    });
    if (element instanceof HTMLImageElement && element.complete && element.naturalWidth > 0) {
      try {
        context.drawImage(element, bounds.left, bounds.top, bounds.width, bounds.height);
      } catch {
      }
    }
    for (const node of Array.from(element.childNodes)) {
      if (node.nodeType !== Node.TEXT_NODE || !node.textContent?.trim()) continue;
      const lineGroups = /* @__PURE__ */ new Map();
      for (let index = 0; index < node.textContent.length; index += 1) {
        const character = node.textContent[index];
        const range = document.createRange();
        range.setStart(node, index);
        range.setEnd(node, index + 1);
        const characterBounds = range.getBoundingClientRect();
        if (characterBounds.width === 0 && !character.trim()) continue;
        const lineKey = Math.round(characterBounds.top * 2) / 2;
        const line = lineGroups.get(lineKey);
        if (line) line.text += character;
        else lineGroups.set(lineKey, { text: character, left: characterBounds.left, bottom: characterBounds.bottom, height: characterBounds.height });
      }
      context.fillStyle = style.color;
      context.textBaseline = "alphabetic";
      lineGroups.forEach((line) => {
        context.font = `${style.fontWeight} ${Math.max(1, line.height)}px ${style.fontFamily}`;
        context.fillText(line.text, line.left, line.bottom - Math.max(1, line.height * 0.12));
      });
    }
  }
  context.globalAlpha = 1;
  return await new Promise((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Unable to encode screenshot")), "image/png"));
}
function ReadingReader({
  documents,
  activeDocumentId,
  documentTitle,
  favorite,
  notes,
  onSelectDocument,
  onFavorite,
  onNotesChange,
  onEditingNoteChange,
  onToast
}) {
  const [leftPanel, setLeftPanel] = reactExports.useState("outline");
  const [outlineMainExpanded, setOutlineMainExpanded] = reactExports.useState(true);
  const [rightPanel, setRightPanel] = reactExports.useState("ai");
  const [page, setPage] = reactExports.useState(1);
  const [zoom, setZoom] = reactExports.useState(50);
  const [zoomMenuOpen, setZoomMenuOpen] = reactExports.useState(false);
  const [zoomMenuActiveIndex, setZoomMenuActiveIndex] = reactExports.useState(1);
  const [zoomDragging, setZoomDragging] = reactExports.useState(false);
  const [thumbnailZoom, setThumbnailZoom] = reactExports.useState(25);
  const [contextAction, setContextAction] = reactExports.useState(null);
  const [resultCards, setResultCards] = reactExports.useState({
    translationVisible: false,
    translationExpanded: false,
    explanationVisible: false,
    explanationExpanded: false
  });
  const [highlightColorIndex, setHighlightColorIndex] = reactExports.useState(3);
  const [colorMenuOpen, setColorMenuOpen] = reactExports.useState(false);
  const [activeTool, setActiveTool] = reactExports.useState(null);
  const [searchOpen, setSearchOpen] = reactExports.useState(false);
  const [searchMode, setSearchMode] = reactExports.useState("全文搜索");
  const [searchModeOpen, setSearchModeOpen] = reactExports.useState(false);
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [searchedQuery, setSearchedQuery] = reactExports.useState("");
  const [translatedResult, setTranslatedResult] = reactExports.useState(null);
  const [locatedResult, setLocatedResult] = reactExports.useState(null);
  const [aiQuestion, setAiQuestion] = reactExports.useState("");
  const [aiExchange, setAiExchange] = reactExports.useState(null);
  const [documentMenuOpen, setDocumentMenuOpen] = reactExports.useState(false);
  const [maximized, setMaximized] = reactExports.useState(false);
  const [noteDetailId, setNoteDetailId] = reactExports.useState(null);
  const [editingNoteId, setEditingNoteId] = reactExports.useState(null);
  const [noteEditStage, setNoteEditStage] = reactExports.useState(0);
  const [noteEditorExpanded, setNoteEditorExpanded] = reactExports.useState(false);
  const [editingNoteText, setEditingNoteText] = reactExports.useState("");
  const [pendingAddedNote, setPendingAddedNote] = reactExports.useState("");
  const [uploadedNoteImages, setUploadedNoteImages] = reactExports.useState([]);
  const [noteSelection, setNoteSelection] = reactExports.useState(null);
  const [contextMenuPosition, setContextMenuPosition] = reactExports.useState({ left: 8, top: 8 });
  const [screenshotPointer, setScreenshotPointer] = reactExports.useState(null);
  const [screenshotDragStart, setScreenshotDragStart] = reactExports.useState(null);
  const [cropRect, setCropRect] = reactExports.useState(null);
  const [mobileInsightsOpen, setMobileInsightsOpen] = reactExports.useState(false);
  const [mobileLeftOpen, setMobileLeftOpen] = reactExports.useState(false);
  const [compactLayout, setCompactLayout] = reactExports.useState(() => window.matchMedia("(max-width: 1180px)").matches);
  const [leftOverlayLayout, setLeftOverlayLayout] = reactExports.useState(() => window.matchMedia("(max-width: 900px)").matches);
  const paperRef = reactExports.useRef(null);
  const paperScrollRef = reactExports.useRef(null);
  const paperZoomStageRef = reactExports.useRef(null);
  const readingFrameRef = reactExports.useRef(null);
  const canvasRef = reactExports.useRef(null);
  const noteImageInputRef = reactExports.useRef(null);
  const noteTextareaRef = reactExports.useRef(null);
  const searchInputRef = reactExports.useRef(null);
  const leftContentRef = reactExports.useRef(null);
  const thumbnailListRef = reactExports.useRef(null);
  const locationOriginRef = reactExports.useRef(null);
  const screenshotDragStartRef = reactExports.useRef(null);
  const screenshotPendingPointRef = reactExports.useRef(null);
  const screenshotAnimationFrameRef = reactExports.useRef(null);
  const pageSyncAnimationFrameRef = reactExports.useRef(null);
  const zoomInputAnimationFrameRef = reactExports.useRef(null);
  const zoomRestoreAnimationFrameRef = reactExports.useRef(null);
  const zoomRestoreUnlockAnimationFrameRef = reactExports.useRef(null);
  const zoomTransactionRef = reactExports.useRef(0);
  const zoomValueRef = reactExports.useRef(50);
  const zoomPointerIdRef = reactExports.useRef(null);
  const zoomSelectorRef = reactExports.useRef(null);
  const zoomTriggerRef = reactExports.useRef(null);
  const zoomOptionRefs = reactExports.useRef([]);
  const pendingZoomRef = reactExports.useRef(null);
  const suppressPageSyncRef = reactExports.useRef(false);
  const fullscreenFallbackRef = reactExports.useRef(false);
  const screenshotResizeRef = reactExports.useRef(null);
  const noteRangeHandledRef = reactExports.useRef(false);
  const notePointerStartRef = reactExports.useRef(null);
  const pageLabel = `${page}/${totalPages}`;
  const filteredNotes = reactExports.useMemo(() => notes.slice(), [notes]);
  const detailedNote = notes.find((note) => note.id === noteDetailId);
  reactExports.useEffect(() => {
    onEditingNoteChange(editingNoteId != null);
    if (editingNoteId != null) window.requestAnimationFrame(() => {
      leftContentRef.current?.scrollTo({ top: 0, behavior: "auto" });
      noteTextareaRef.current?.focus({ preventScroll: true });
    });
  }, [editingNoteId, onEditingNoteChange]);
  reactExports.useEffect(() => {
    if (!searchOpen) return;
    window.requestAnimationFrame(() => searchInputRef.current?.focus({ preventScroll: true }));
  }, [searchOpen]);
  reactExports.useEffect(() => () => {
    if (screenshotAnimationFrameRef.current != null) window.cancelAnimationFrame(screenshotAnimationFrameRef.current);
    if (pageSyncAnimationFrameRef.current != null) window.cancelAnimationFrame(pageSyncAnimationFrameRef.current);
    if (zoomInputAnimationFrameRef.current != null) window.cancelAnimationFrame(zoomInputAnimationFrameRef.current);
    if (zoomRestoreAnimationFrameRef.current != null) window.cancelAnimationFrame(zoomRestoreAnimationFrameRef.current);
    if (zoomRestoreUnlockAnimationFrameRef.current != null) window.cancelAnimationFrame(zoomRestoreUnlockAnimationFrameRef.current);
  }, []);
  reactExports.useEffect(() => {
    const syncFullscreenState = () => {
      if (document.fullscreenElement === readingFrameRef.current) {
        fullscreenFallbackRef.current = false;
        setMaximized(true);
      } else if (!fullscreenFallbackRef.current) {
        setMaximized(false);
      }
    };
    const closeFallbackFullscreen = (event) => {
      if (event.key !== "Escape" || !fullscreenFallbackRef.current) return;
      fullscreenFallbackRef.current = false;
      setMaximized(false);
    };
    document.addEventListener("fullscreenchange", syncFullscreenState);
    document.addEventListener("keydown", closeFallbackFullscreen);
    return () => {
      document.removeEventListener("fullscreenchange", syncFullscreenState);
      document.removeEventListener("keydown", closeFallbackFullscreen);
    };
  }, []);
  reactExports.useEffect(() => {
    if (leftPanel !== "thumbnails") return;
    window.requestAnimationFrame(() => {
      thumbnailListRef.current?.querySelector('[aria-current="page"]')?.scrollIntoView({ block: "nearest", behavior: "auto" });
    });
  }, [leftPanel, page]);
  reactExports.useEffect(() => {
    const query = window.matchMedia("(max-width: 1180px)");
    const syncLayout = () => {
      setCompactLayout(query.matches);
      if (!query.matches) setMobileInsightsOpen(false);
    };
    query.addEventListener("change", syncLayout);
    return () => query.removeEventListener("change", syncLayout);
  }, []);
  reactExports.useEffect(() => {
    const query = window.matchMedia("(max-width: 900px)");
    const syncLayout = () => {
      setLeftOverlayLayout(query.matches);
      if (!query.matches) setMobileLeftOpen(false);
    };
    query.addEventListener("change", syncLayout);
    return () => query.removeEventListener("change", syncLayout);
  }, []);
  const scrollPaperToSection = (sectionTitle, behavior = "auto") => {
    const scroller = paperScrollRef.current;
    const target = paperRef.current?.querySelector(`[data-section="${sectionSlug(sectionTitle)}"]`);
    if (!scroller || !target) return;
    const top = scroller.scrollTop + target.getBoundingClientRect().top - scroller.getBoundingClientRect().top - 72;
    scroller.scrollTo({ top: Math.max(0, top), behavior });
  };
  const goToPage = (targetPage, options) => {
    const nextPage = Math.min(totalPages, Math.max(1, targetPage));
    setPage(nextPage);
    if (options?.scroll === false) return;
    window.requestAnimationFrame(() => {
      if (options?.sectionTitle) {
        scrollPaperToSection(options.sectionTitle);
        return;
      }
      const scroller = paperScrollRef.current;
      if (!scroller) return;
      const availableScroll = Math.max(0, scroller.scrollHeight - scroller.clientHeight);
      const pageProgress = (nextPage - 1) / (totalPages - 1);
      scroller.scrollTo({ top: availableScroll * pageProgress, behavior: "auto" });
    });
  };
  const closeZoomMenu = (restoreFocus = false) => {
    setZoomMenuOpen(false);
    if (restoreFocus) window.requestAnimationFrame(() => zoomTriggerRef.current?.focus({ preventScroll: true }));
  };
  const openZoomMenu = () => {
    const exactIndex = zoomPresets.findIndex((preset) => preset === zoomValueRef.current);
    const nearestIndex = zoomPresets.reduce((bestIndex, preset, index) => Math.abs(preset - zoomValueRef.current) < Math.abs(zoomPresets[bestIndex] - zoomValueRef.current) ? index : bestIndex, 0);
    setZoomMenuActiveIndex(exactIndex >= 0 ? exactIndex : nearestIndex);
    setZoomMenuOpen(true);
  };
  const moveZoomMenuFocus = (nextIndex) => {
    const normalizedIndex = (nextIndex + zoomPresets.length) % zoomPresets.length;
    setZoomMenuActiveIndex(normalizedIndex);
    zoomOptionRefs.current[normalizedIndex]?.focus({ preventScroll: true });
  };
  const applyZoom = (requestedZoom) => {
    const nextZoom = Math.min(100, Math.max(25, Math.round(requestedZoom / 5) * 5));
    closeZoomMenu();
    if (nextZoom === zoomValueRef.current) return;
    const scroller = paperScrollRef.current;
    const stage = paperZoomStageRef.current;
    const scrollerBounds = scroller?.getBoundingClientRect();
    const stageBounds = stage?.getBoundingClientRect();
    const renderedScale = stageBounds && stageBounds.width > 0 ? stageBounds.width / 812 : zoomValueRef.current / 100;
    const viewportCenterX = scrollerBounds ? scrollerBounds.left + scrollerBounds.width / 2 : 0;
    const viewportCenterY = scrollerBounds ? scrollerBounds.top + scrollerBounds.height / 2 : 0;
    const paperAnchorX = stageBounds ? (viewportCenterX - stageBounds.left) / renderedScale : 406;
    const paperAnchorY = stageBounds ? (viewportCenterY - stageBounds.top) / renderedScale : 0;
    const transaction = zoomTransactionRef.current + 1;
    zoomTransactionRef.current = transaction;
    suppressPageSyncRef.current = true;
    zoomValueRef.current = nextZoom;
    setZoom(nextZoom);
    if (zoomRestoreAnimationFrameRef.current != null) window.cancelAnimationFrame(zoomRestoreAnimationFrameRef.current);
    if (zoomRestoreUnlockAnimationFrameRef.current != null) window.cancelAnimationFrame(zoomRestoreUnlockAnimationFrameRef.current);
    zoomRestoreAnimationFrameRef.current = window.requestAnimationFrame(() => {
      zoomRestoreAnimationFrameRef.current = null;
      if (transaction !== zoomTransactionRef.current) return;
      const updatedScroller = paperScrollRef.current;
      const updatedStageBounds = paperZoomStageRef.current?.getBoundingClientRect();
      const updatedScrollerBounds = updatedScroller?.getBoundingClientRect();
      if (updatedScroller && updatedStageBounds && updatedScrollerBounds) {
        const updatedScale = updatedStageBounds.width > 0 ? updatedStageBounds.width / 812 : nextZoom / 100;
        const updatedCenterX = updatedScrollerBounds.left + updatedScrollerBounds.width / 2;
        const updatedCenterY = updatedScrollerBounds.top + updatedScrollerBounds.height / 2;
        const horizontalDelta = updatedStageBounds.left + paperAnchorX * updatedScale - updatedCenterX;
        const verticalDelta = updatedStageBounds.top + paperAnchorY * updatedScale - updatedCenterY;
        updatedScroller.scrollLeft = Math.min(
          Math.max(0, updatedScroller.scrollWidth - updatedScroller.clientWidth),
          Math.max(0, updatedScroller.scrollLeft + horizontalDelta)
        );
        updatedScroller.scrollTop = Math.min(
          Math.max(0, updatedScroller.scrollHeight - updatedScroller.clientHeight),
          Math.max(0, updatedScroller.scrollTop + verticalDelta)
        );
      }
      zoomRestoreUnlockAnimationFrameRef.current = window.requestAnimationFrame(() => {
        zoomRestoreUnlockAnimationFrameRef.current = null;
        if (transaction !== zoomTransactionRef.current) return;
        suppressPageSyncRef.current = false;
      });
    });
  };
  const scheduleZoom = (requestedZoom) => {
    pendingZoomRef.current = requestedZoom;
    if (zoomInputAnimationFrameRef.current != null) return;
    zoomInputAnimationFrameRef.current = window.requestAnimationFrame(() => {
      zoomInputAnimationFrameRef.current = null;
      if (pendingZoomRef.current != null) applyZoom(pendingZoomRef.current);
      pendingZoomRef.current = null;
    });
  };
  const selectZoomPreset = (preset, restoreFocus = true) => {
    applyZoom(preset);
    closeZoomMenu(restoreFocus);
  };
  const handleZoomTriggerKeyDown = (event) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!zoomMenuOpen) openZoomMenu();
      window.requestAnimationFrame(() => zoomOptionRefs.current[zoomMenuActiveIndex]?.focus({ preventScroll: true }));
      return;
    }
    if (event.key === "Escape" && zoomMenuOpen) {
      event.preventDefault();
      closeZoomMenu(true);
    }
  };
  const handleZoomOptionKeyDown = (event, index) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveZoomMenuFocus(index + 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      moveZoomMenuFocus(index - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      moveZoomMenuFocus(0);
    } else if (event.key === "End") {
      event.preventDefault();
      moveZoomMenuFocus(zoomPresets.length - 1);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectZoomPreset(zoomPresets[index]);
    } else if (event.key === "Tab") {
      setZoomMenuOpen(false);
    }
  };
  const updateZoomFromPointer = (clientX, target) => {
    const bounds = target.getBoundingClientRect();
    if (bounds.width <= 0) return;
    const visualPercent = (clientX - bounds.left) / bounds.width * 100;
    scheduleZoom(visualPercent);
  };
  const handleZoomRangePointerDown = (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    closeZoomMenu();
    zoomPointerIdRef.current = event.pointerId;
    event.currentTarget.setPointerCapture(event.pointerId);
    setZoomDragging(true);
    updateZoomFromPointer(event.clientX, event.currentTarget);
  };
  const handleZoomRangePointerMove = (event) => {
    if (zoomPointerIdRef.current !== event.pointerId) return;
    updateZoomFromPointer(event.clientX, event.currentTarget);
  };
  const finishZoomRangePointer = (event) => {
    if (zoomPointerIdRef.current !== event.pointerId) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    zoomPointerIdRef.current = null;
    setZoomDragging(false);
  };
  const handleZoomRangeKeyDown = (event) => {
    const keySteps = {
      ArrowLeft: -5,
      ArrowDown: -5,
      ArrowRight: 5,
      ArrowUp: 5,
      PageDown: -10,
      PageUp: 10
    };
    if (event.key in keySteps) {
      event.preventDefault();
      applyZoom(zoomValueRef.current + (keySteps[event.key] ?? 0));
    } else if (event.key === "Home") {
      event.preventDefault();
      applyZoom(25);
    } else if (event.key === "End") {
      event.preventDefault();
      applyZoom(100);
    }
  };
  reactExports.useEffect(() => {
    if (!zoomMenuOpen) return;
    const handleOutsidePointerDown = (event) => {
      if (!zoomSelectorRef.current?.contains(event.target)) setZoomMenuOpen(false);
    };
    const handleEscape = (event) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      closeZoomMenu(true);
    };
    document.addEventListener("pointerdown", handleOutsidePointerDown);
    document.addEventListener("keydown", handleEscape);
    window.requestAnimationFrame(() => zoomOptionRefs.current[zoomMenuActiveIndex]?.focus({ preventScroll: true }));
    return () => {
      document.removeEventListener("pointerdown", handleOutsidePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [zoomMenuActiveIndex, zoomMenuOpen]);
  const syncPageFromPaperScroll = () => {
    if (suppressPageSyncRef.current) return;
    if (contextAction === "highlight") {
      setContextAction(null);
      setColorMenuOpen(false);
    }
    if (pageSyncAnimationFrameRef.current != null) return;
    pageSyncAnimationFrameRef.current = window.requestAnimationFrame(() => {
      pageSyncAnimationFrameRef.current = null;
      const scroller = paperScrollRef.current;
      if (!scroller) return;
      const availableScroll = Math.max(0, scroller.scrollHeight - scroller.clientHeight);
      const nextPage = availableScroll === 0 ? 1 : Math.round(scroller.scrollTop / availableScroll * (totalPages - 1)) + 1;
      setPage((current) => current === nextPage ? current : nextPage);
    });
  };
  const toggleReaderFullscreen = async () => {
    const frame = readingFrameRef.current;
    if (!frame) return;
    if (fullscreenFallbackRef.current) {
      fullscreenFallbackRef.current = false;
      setMaximized(false);
      return;
    }
    if (!frame.requestFullscreen) {
      fullscreenFallbackRef.current = true;
      setMaximized(true);
      return;
    }
    try {
      if (document.fullscreenElement === frame) await document.exitFullscreen();
      else await frame.requestFullscreen();
    } catch {
      fullscreenFallbackRef.current = true;
      setMaximized(true);
    }
  };
  const jumpToSection = (sectionTitle) => {
    scrollPaperToSection(sectionTitle);
  };
  const selectLeftPanel = (panel) => {
    if (panel !== "notes") setNoteEditorExpanded(false);
    if (leftOverlayLayout) {
      const willClose = panel === leftPanel && mobileLeftOpen;
      setMobileLeftOpen(!willClose);
      setMobileInsightsOpen(false);
      if (willClose) setNoteEditorExpanded(false);
    }
    setLeftPanel(panel);
  };
  const locateSearchResult = (index, targetPage) => {
    const scroller = paperScrollRef.current;
    const sectionTitle = aiSearchTargetSections[index];
    if (!locationOriginRef.current) {
      locationOriginRef.current = { page, scrollTop: scroller?.scrollTop ?? 0 };
    }
    setLocatedResult(index);
    goToPage(targetPage, { sectionTitle });
    onToast("已定位到原文出处");
  };
  const returnFromLocation = () => {
    const origin = locationOriginRef.current;
    setLocatedResult(null);
    if (origin) {
      goToPage(origin.page, { scroll: false });
      paperScrollRef.current?.scrollTo({ top: origin.scrollTop, behavior: "auto" });
    }
    locationOriginRef.current = null;
  };
  const submitAiQuestion = () => {
    const question = aiQuestion.trim();
    if (!question) return;
    setAiExchange({
      question,
      answer: "功能化碳纳米管通过表面羧基、氨基对多硫化物进行多位点化学锚定，降低穿梭迁移并改善循环稳定性；论文以原位XRD、冷冻电镜和DFT计算共同验证了这一机制。"
    });
    setAiQuestion("");
    onToast("问题已提交");
  };
  const closeSearchDrawer = () => {
    setSearchOpen(false);
    setActiveTool((current) => current === "search" ? null : current);
    setSearchModeOpen(false);
    setTranslatedResult(null);
    returnFromLocation();
  };
  const submitSearch = () => {
    const value = searchQuery.trim();
    if (!value) return;
    setSearchedQuery(value);
  };
  const resetToolSurfaces = () => {
    setContextAction(null);
    setResultCards({
      translationVisible: false,
      translationExpanded: false,
      explanationVisible: false,
      explanationExpanded: false
    });
    setColorMenuOpen(false);
    setNoteSelection(null);
    setScreenshotDragStart(null);
    setScreenshotPointer(null);
    setCropRect(null);
    setSearchModeOpen(false);
    setTranslatedResult(null);
    setSearchOpen(false);
    screenshotDragStartRef.current = null;
    screenshotPendingPointRef.current = null;
    screenshotResizeRef.current = null;
    noteRangeHandledRef.current = false;
    notePointerStartRef.current = null;
    window.getSelection()?.removeAllRanges();
    if (screenshotAnimationFrameRef.current != null) {
      window.cancelAnimationFrame(screenshotAnimationFrameRef.current);
      screenshotAnimationFrameRef.current = null;
    }
    if (locatedResult != null) returnFromLocation();
  };
  const activateSearch = () => {
    if (searchOpen) {
      closeSearchDrawer();
      return;
    }
    resetToolSurfaces();
    setActiveTool("search");
    setSearchOpen(true);
  };
  const activateNoteTool = () => {
    if (activeTool === "note") {
      resetToolSurfaces();
      setActiveTool(null);
      return;
    }
    resetToolSurfaces();
    setActiveTool("note");
    setLeftPanel("notes");
    if (leftOverlayLayout) {
      setMobileLeftOpen(true);
      setMobileInsightsOpen(false);
    }
  };
  const activateScreenshotTool = () => {
    if (activeTool === "screenshot") {
      resetToolSurfaces();
      setActiveTool(null);
      return;
    }
    resetToolSurfaces();
    window.getSelection()?.removeAllRanges();
    setActiveTool("screenshot");
  };
  const placeContextMenu = (bounds) => {
    const canvasBounds = canvasRef.current?.getBoundingClientRect();
    if (!canvasBounds) return;
    const menuWidth = 156;
    const menuHeight = 28;
    setContextMenuPosition({
      left: Math.max(8, Math.min(canvasBounds.width - menuWidth - 8, bounds.left - canvasBounds.left)),
      top: Math.max(8, Math.min(canvasBounds.height - menuHeight - 8, bounds.top - canvasBounds.top - menuHeight - 8))
    });
  };
  const hitPaperLine = (event, sectionTitle) => {
    if (activeTool !== "note") return;
    if (noteRangeHandledRef.current) {
      noteRangeHandledRef.current = false;
      return;
    }
    const browserSelection = window.getSelection();
    if (browserSelection && !browserSelection.isCollapsed && browserSelection.toString().trim()) return;
    const text = event.currentTarget.textContent?.trim() ?? "";
    window.getSelection()?.removeAllRanges();
    placeContextMenu(event.currentTarget.getBoundingClientRect());
    setResultCards({
      translationVisible: false,
      translationExpanded: false,
      explanationVisible: false,
      explanationExpanded: false
    });
    setNoteSelection({ kind: "field", sectionTitle, text, start: 0, end: text.length });
    setContextAction("highlight");
  };
  const textIndexAtPoint = (target, clientX, clientY) => {
    const documentWithCaret = document;
    const caretPosition = document.caretPositionFromPoint?.(clientX, clientY);
    const caretRange = caretPosition ? null : documentWithCaret.caretRangeFromPoint?.(clientX, clientY);
    const node = caretPosition?.offsetNode ?? caretRange?.startContainer;
    const offset = caretPosition?.offset ?? caretRange?.startOffset;
    if (!node || offset == null || !target.contains(node)) return null;
    const prefix = document.createRange();
    prefix.selectNodeContents(target);
    prefix.setEnd(node, offset);
    return prefix.toString().length;
  };
  const beginPaperRange = (event, sectionTitle) => {
    noteRangeHandledRef.current = false;
    notePointerStartRef.current = null;
    if (activeTool !== "note" || event.button !== 0) return;
    const index = textIndexAtPoint(event.currentTarget, event.clientX, event.clientY);
    if (index == null) return;
    event.preventDefault();
    window.getSelection()?.removeAllRanges();
    notePointerStartRef.current = { sectionTitle, index, x: event.clientX, y: event.clientY };
  };
  const selectPaperRange = (event, sectionTitle) => {
    if (activeTool !== "note") return;
    const pointerStart = notePointerStartRef.current;
    notePointerStartRef.current = null;
    if (pointerStart?.sectionTitle === sectionTitle && Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y) >= 4) {
      const endIndex = textIndexAtPoint(event.currentTarget, event.clientX, event.clientY);
      const fullText = event.currentTarget.textContent ?? "";
      if (endIndex != null && endIndex !== pointerStart.index) {
        const start2 = Math.min(pointerStart.index, endIndex);
        const end2 = Math.max(pointerStart.index, endIndex);
        noteRangeHandledRef.current = true;
        setResultCards({
          translationVisible: false,
          translationExpanded: false,
          explanationVisible: false,
          explanationExpanded: false
        });
        setNoteSelection({ kind: "range", sectionTitle, text: fullText.slice(start2, end2), start: start2, end: end2 });
        const bounds2 = event.currentTarget.getBoundingClientRect();
        placeContextMenu(new DOMRect(event.clientX, Math.min(event.clientY, bounds2.bottom), 0, 0));
        setContextAction("highlight");
        return;
      }
    }
    const browserSelection = window.getSelection();
    if (!browserSelection || browserSelection.isCollapsed || browserSelection.rangeCount === 0) return;
    const anchorNode = browserSelection.anchorNode;
    const focusNode = browserSelection.focusNode;
    if (!anchorNode || !focusNode || !event.currentTarget.contains(anchorNode) || !event.currentTarget.contains(focusNode)) return;
    const selectedText = browserSelection.toString();
    if (!selectedText.trim()) return;
    const indexAt = (node, offset) => {
      const prefix = document.createRange();
      prefix.selectNodeContents(event.currentTarget);
      prefix.setEnd(node, offset);
      return prefix.toString().length;
    };
    const anchorIndex = indexAt(anchorNode, browserSelection.anchorOffset);
    const focusIndex = indexAt(focusNode, browserSelection.focusOffset);
    const start = Math.min(anchorIndex, focusIndex);
    const end = Math.max(anchorIndex, focusIndex);
    const bounds = browserSelection.getRangeAt(0).getBoundingClientRect();
    noteRangeHandledRef.current = true;
    setResultCards({
      translationVisible: false,
      translationExpanded: false,
      explanationVisible: false,
      explanationExpanded: false
    });
    setNoteSelection({ kind: "range", sectionTitle, text: selectedText, start, end });
    placeContextMenu(bounds);
    setContextAction("highlight");
    window.requestAnimationFrame(() => window.getSelection()?.removeAllRanges());
  };
  const renderSelectableText = (text, sectionTitle) => {
    const selectionActive = noteSelection?.sectionTitle === sectionTitle && contextAction != null && contextAction !== "screenshot";
    if (!selectionActive || !noteSelection) return text;
    const start = Math.max(0, Math.min(text.length, noteSelection.start));
    const end = Math.max(start, Math.min(text.length, noteSelection.end));
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      text.slice(0, start),
      /* @__PURE__ */ jsxRuntimeExports.jsx("mark", { className: `paper-note-selection is-${noteSelection.kind}`, style: { "--selected-line-color": highlightColors[highlightColorIndex] }, children: text.slice(start, end) }),
      text.slice(end)
    ] });
  };
  const screenshotPoint = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    return {
      clientX: event.clientX,
      clientY: event.clientY,
      localX: Math.max(0, Math.min(bounds.width - 148, event.clientX - bounds.left)),
      localY: Math.max(0, Math.min(bounds.height - 168, event.clientY - bounds.top))
    };
  };
  const beginScreenshotDrag = (event) => {
    if (activeTool !== "screenshot" || contextAction === "screenshot") return;
    if (event.button !== 0 || !event.isPrimary) return;
    if (event.target.closest("button, input, textarea, .reading-selection-toolbar")) return;
    event.preventDefault();
    window.getSelection()?.removeAllRanges();
    const point = screenshotPoint(event);
    event.currentTarget.setPointerCapture(event.pointerId);
    setScreenshotPointer(point);
    screenshotDragStartRef.current = { x: point.clientX, y: point.clientY };
    setScreenshotDragStart({ x: point.clientX, y: point.clientY });
    setCropRect({ left: point.clientX, top: point.clientY, width: 0, height: 0 });
  };
  const moveScreenshotPointer = (event) => {
    if (activeTool !== "screenshot" || contextAction === "screenshot") return;
    event.preventDefault();
    const point = screenshotPoint(event);
    screenshotPendingPointRef.current = point;
    if (screenshotAnimationFrameRef.current != null) return;
    screenshotAnimationFrameRef.current = window.requestAnimationFrame(() => {
      screenshotAnimationFrameRef.current = null;
      const nextPoint = screenshotPendingPointRef.current;
      if (!nextPoint) return;
      setScreenshotPointer(nextPoint);
      const start = screenshotDragStartRef.current;
      if (!start) return;
      setCropRect({
        left: Math.min(start.x, nextPoint.clientX),
        top: Math.min(start.y, nextPoint.clientY),
        width: Math.abs(nextPoint.clientX - start.x),
        height: Math.abs(nextPoint.clientY - start.y)
      });
    });
  };
  const finishScreenshotDrag = (event) => {
    const dragStart = screenshotDragStartRef.current;
    if (activeTool !== "screenshot" || !dragStart) return;
    event.preventDefault();
    window.getSelection()?.removeAllRanges();
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (screenshotAnimationFrameRef.current != null) {
      window.cancelAnimationFrame(screenshotAnimationFrameRef.current);
      screenshotAnimationFrameRef.current = null;
    }
    const point = screenshotPoint(event);
    const finalRect = {
      left: Math.min(dragStart.x, point.clientX),
      top: Math.min(dragStart.y, point.clientY),
      width: Math.abs(point.clientX - dragStart.x),
      height: Math.abs(point.clientY - dragStart.y)
    };
    screenshotDragStartRef.current = null;
    screenshotPendingPointRef.current = point;
    setCropRect(finalRect);
    setScreenshotDragStart(null);
    if (finalRect.width >= 12 && finalRect.height >= 12) setContextAction("screenshot");
    else setCropRect(null);
  };
  const beginCropResize = (event, handle) => {
    if (!cropRect) return;
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    screenshotResizeRef.current = { handle, startX: event.clientX, startY: event.clientY, rect: cropRect };
  };
  const updateCropResize = (clientX, clientY) => {
    const resize = screenshotResizeRef.current;
    if (!resize) return;
    const dx = clientX - resize.startX;
    const dy = clientY - resize.startY;
    let left = resize.rect.left;
    let top = resize.rect.top;
    let right = resize.rect.left + resize.rect.width;
    let bottom = resize.rect.top + resize.rect.height;
    if (resize.handle.includes("w")) left = Math.min(right - 12, Math.max(0, left + dx));
    if (resize.handle.includes("e")) right = Math.max(left + 12, Math.min(window.innerWidth, right + dx));
    if (resize.handle.includes("n")) top = Math.min(bottom - 12, Math.max(0, top + dy));
    if (resize.handle.includes("s")) bottom = Math.max(top + 12, Math.min(window.innerHeight, bottom + dy));
    setCropRect({ left, top, width: right - left, height: bottom - top });
  };
  const moveCropResize = (event) => {
    event.preventDefault();
    updateCropResize(event.clientX, event.clientY);
  };
  const finishCropResize = (event) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    screenshotResizeRef.current = null;
  };
  reactExports.useEffect(() => {
    if (contextAction !== "screenshot") return;
    const moveResize = (event) => updateCropResize(event.clientX, event.clientY);
    const stopResize = () => {
      screenshotResizeRef.current = null;
    };
    window.addEventListener("pointermove", moveResize);
    window.addEventListener("pointerup", stopResize);
    window.addEventListener("pointercancel", stopResize);
    return () => {
      window.removeEventListener("pointermove", moveResize);
      window.removeEventListener("pointerup", stopResize);
      window.removeEventListener("pointercancel", stopResize);
    };
  }, [contextAction]);
  const cancelScreenshotDrag = (event) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (screenshotAnimationFrameRef.current != null) {
      window.cancelAnimationFrame(screenshotAnimationFrameRef.current);
      screenshotAnimationFrameRef.current = null;
    }
    screenshotDragStartRef.current = null;
    screenshotPendingPointRef.current = null;
    setScreenshotDragStart(null);
    setScreenshotPointer(null);
    setCropRect(null);
  };
  const cancelScreenshot = () => {
    setContextAction(null);
    setActiveTool(null);
    setScreenshotDragStart(null);
    setScreenshotPointer(null);
    setCropRect(null);
    screenshotDragStartRef.current = null;
    screenshotPendingPointRef.current = null;
    screenshotResizeRef.current = null;
    window.getSelection()?.removeAllRanges();
    if (screenshotAnimationFrameRef.current != null) {
      window.cancelAnimationFrame(screenshotAnimationFrameRef.current);
      screenshotAnimationFrameRef.current = null;
    }
  };
  const completeScreenshot = async () => {
    if (!cropRect) return;
    const addedToNote = editingNoteId != null;
    if (addedToNote) {
      try {
        const blob = await captureViewportCrop(cropRect);
        const imageUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result));
          reader.onerror = () => reject(reader.error);
          reader.readAsDataURL(blob);
        });
        setUploadedNoteImages((current) => [...current, imageUrl]);
        setNoteEditStage((stage) => Math.max(stage, 3));
      } catch (error) {
        console.error("Screenshot generation failed", error);
        onToast("截图生成失败，请重新选择");
        return;
      }
    }
    cancelScreenshot();
    onToast(addedToNote ? "截图已添加到笔记" : "截图已完成");
  };
  const downloadScreenshot = async () => {
    if (!cropRect) return;
    try {
      downloadLocalBlob(await captureViewportCrop(cropRect), "科研阅读截图.png");
      onToast("截图已下载");
    } catch (error) {
      console.error("Screenshot download failed", error);
      onToast("截图下载失败");
    }
  };
  const startEditingNote = (note) => {
    setEditingNoteId(note.id);
    setEditingNoteText("");
    setPendingAddedNote(note.excerpt);
    setNoteDetailId(null);
    setLeftPanel("notes");
    if (leftOverlayLayout) setMobileLeftOpen(true);
    setNoteEditStage(4);
    setUploadedNoteImages([]);
    setNoteEditorExpanded(false);
  };
  const openNoteEditor = (source) => {
    setEditingNoteId(0);
    setEditingNoteText("");
    setPendingAddedNote(source === "translation" ? translatedExcerpt : source === "explanation" ? explainedExcerpt : noteSelection?.text ?? "");
    setNoteEditStage(source === "translation" ? 1 : source === "explanation" ? 2 : 0);
    setUploadedNoteImages([]);
    setNoteEditorExpanded(false);
    setLeftPanel("notes");
    if (leftOverlayLayout) setMobileLeftOpen(true);
    setContextAction(null);
    setResultCards({
      translationVisible: false,
      translationExpanded: false,
      explanationVisible: false,
      explanationExpanded: false
    });
    setActiveTool(null);
    setNoteSelection(null);
    window.getSelection()?.removeAllRanges();
    setColorMenuOpen(false);
  };
  const startAddingNote = () => openNoteEditor("selection");
  const commitEditedNote = () => {
    if (editingNoteId == null) return;
    const value = editingNoteText.trim() || pendingAddedNote.trim();
    if (!value) return;
    if (editingNoteId === 0) {
      onNotesChange([...notes, { id: Math.max(0, ...notes.map((note) => note.id)) + 1, title: value.slice(0, 18), excerpt: value, createdAt: "", color: highlightColors[highlightColorIndex] }]);
    } else {
      onNotesChange(notes.map((note) => note.id === editingNoteId ? { ...note, title: value.slice(0, 18), excerpt: value, createdAt: "" } : note));
    }
    setEditingNoteId(null);
    setContextAction(null);
    setResultCards({
      translationVisible: false,
      translationExpanded: false,
      explanationVisible: false,
      explanationExpanded: false
    });
    setActiveTool(null);
    setNoteSelection(null);
    setNoteEditStage(0);
    setNoteEditorExpanded(false);
    setPendingAddedNote("");
    onToast("笔记已更新");
  };
  const addNoteDraft = () => {
    const value = editingNoteText.trim();
    if (!value) return;
    setPendingAddedNote(value);
    setEditingNoteText("");
    setNoteEditStage(4);
  };
  const uploadNoteImages = (files) => {
    if (!files?.length) return;
    setUploadedNoteImages(Array.from(files).slice(0, 3).map((file) => URL.createObjectURL(file)));
    setNoteEditStage((stage) => Math.max(stage, 3));
  };
  const copyText = async (text, successMessage) => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard API unavailable");
      await navigator.clipboard.writeText(text);
      onToast(successMessage);
    } catch {
      onToast("复制失败，请手动复制");
    }
  };
  const showTranslation = () => {
    setColorMenuOpen(false);
    setContextAction("translate");
    setResultCards({
      translationVisible: true,
      translationExpanded: true,
      explanationVisible: false,
      explanationExpanded: false
    });
  };
  const showExplanation = () => {
    setColorMenuOpen(false);
    setContextAction("explain");
    setResultCards({
      translationVisible: true,
      translationExpanded: false,
      explanationVisible: true,
      explanationExpanded: true
    });
  };
  const closeResultCard = (card) => {
    setResultCards((current) => {
      const next = card === "translation" ? { ...current, translationVisible: false, translationExpanded: false, explanationExpanded: current.explanationVisible } : { ...current, explanationVisible: false, explanationExpanded: false, translationExpanded: current.translationVisible };
      if (!next.translationVisible && !next.explanationVisible) {
        setContextAction(null);
        setNoteSelection(null);
      } else {
        setContextAction(next.explanationVisible ? "explain" : "translate");
      }
      return next;
    });
  };
  const toggleResultCard = (card) => {
    setResultCards((current) => {
      if (card === "translation") {
        const expanding2 = !current.translationExpanded;
        return {
          ...current,
          translationExpanded: expanding2,
          explanationExpanded: current.explanationVisible ? !expanding2 : false
        };
      }
      const expanding = !current.explanationExpanded;
      return {
        ...current,
        explanationExpanded: expanding,
        translationExpanded: current.translationVisible ? !expanding : false
      };
    });
  };
  const downloadDocument = () => {
    const documentText = [
      documentTitle,
      "",
      "摘要",
      "本研究系统性探究了功能化碳纳米管界面对锂硫电池中多硫化物穿梭效应的抑制机理。",
      "",
      ...articleSections.flatMap((section) => [
        section.title,
        ...section.parts.flatMap((part) => [part.title, part.body].filter(Boolean)),
        ""
      ])
    ].join("\n");
    downloadLocalBlob(new Blob([documentText], { type: "text/plain;charset=utf-8" }), `${safeFileName(documentTitle)}.txt`);
    onToast("文档已下载");
  };
  const exportChart = (title, index) => {
    const escapedTitle = title.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
    const bars = [108, 176, 132, 224, 188].map((height, barIndex) => `<rect x="${74 + barIndex * 82}" y="${310 - height}" width="48" height="${height}" rx="8" fill="${barIndex === index % 5 ? "#4f67ff" : "#9da9ff"}"/>`).join("");
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="560" height="360" viewBox="0 0 560 360"><rect width="560" height="360" fill="#fff"/><text x="32" y="46" font-family="Arial, sans-serif" font-size="20" font-weight="700" fill="#1f2430">${escapedTitle}</text><line x1="54" y1="310" x2="520" y2="310" stroke="#dfe3ec" stroke-width="2"/>${bars}<text x="32" y="340" font-family="Arial, sans-serif" font-size="13" fill="#747b8c">智能阅读 · 图表提取</text></svg>`;
    downloadLocalBlob(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }), `${safeFileName(title)}.svg`);
    onToast("图表已导出");
  };
  const saveReadingProgress = () => {
    try {
      window.localStorage.setItem(`reading-progress:${activeDocumentId}`, JSON.stringify({
        documentId: activeDocumentId,
        page,
        zoom,
        scrollTop: paperScrollRef.current?.scrollTop ?? 0,
        savedAt: (/* @__PURE__ */ new Date()).toISOString()
      }));
      onToast("阅读进度已保存");
    } catch {
      onToast("阅读进度保存失败");
    }
  };
  const selectInsightPanel = (panel) => {
    setRightPanel(panel);
    if (panel === "charts") goToPage(3, { sectionTitle: "2.2.表征手段" });
  };
  reactExports.useEffect(() => {
    const closeTemporaryUi = (event) => {
      if (event.key !== "Escape" || event.defaultPrevented) return;
      const hasTemporaryUi = Boolean(
        contextAction || colorMenuOpen || activeTool || documentMenuOpen || noteDetailId != null || searchOpen || searchModeOpen || translatedResult != null || locatedResult != null || mobileInsightsOpen || mobileLeftOpen || noteEditorExpanded
      );
      if (!hasTemporaryUi) return;
      event.preventDefault();
      setContextAction(null);
      setResultCards({
        translationVisible: false,
        translationExpanded: false,
        explanationVisible: false,
        explanationExpanded: false
      });
      setColorMenuOpen(false);
      setActiveTool(null);
      setNoteSelection(null);
      window.getSelection()?.removeAllRanges();
      setScreenshotDragStart(null);
      setScreenshotPointer(null);
      setCropRect(null);
      setDocumentMenuOpen(false);
      setNoteDetailId(null);
      setSearchModeOpen(false);
      setTranslatedResult(null);
      setMobileInsightsOpen(false);
      setMobileLeftOpen(false);
      setNoteEditorExpanded(false);
      if (searchOpen || locatedResult != null) closeSearchDrawer();
    };
    document.addEventListener("keydown", closeTemporaryUi);
    return () => document.removeEventListener("keydown", closeTemporaryUi);
  }, [activeTool, colorMenuOpen, contextAction, documentMenuOpen, locatedResult, mobileInsightsOpen, mobileLeftOpen, noteDetailId, noteEditorExpanded, searchModeOpen, searchOpen, translatedResult]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { ref: readingFrameRef, className: `reading-frame${maximized ? " reading-frame--maximized" : ""}${editingNoteId != null && leftPanel === "notes" && noteEditorExpanded ? " reading-frame--notes-expanded" : ""}${activeTool === "screenshot" ? " reading-frame--screenshot-armed" : ""}`, "aria-label": "智能阅读器", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "reading-document-header", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reading-document-picker", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            className: "reading-document-title",
            "aria-expanded": documentMenuOpen,
            "aria-controls": "reading-document-menu",
            onClick: () => setDocumentMenuOpen((open) => !open),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: documentTitle }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `reading-chevron${documentMenuOpen ? " is-open" : ""}`, "aria-hidden": "true" })
            ]
          }
        ),
        documentMenuOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "reading-document-menu", id: "reading-document-menu", role: "menu", children: documents.map((readingDocument) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            role: "menuitemradio",
            "aria-checked": readingDocument.id === activeDocumentId,
            onClick: () => {
              onSelectDocument(readingDocument.id);
              setDocumentMenuOpen(false);
            },
            children: readingDocument.title
          },
          readingDocument.id
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reading-document-actions", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", className: favorite ? "is-active" : "", onClick: onFavorite, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "./assets/reading/favorite.svg", alt: "" }),
          favorite ? "已收藏" : "收藏"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => void copyText(window.location.href, "分享链接已复制"), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "./assets/reading/share.svg", alt: "" }),
          "分享"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: downloadDocument, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "./assets/reading/download.svg", alt: "" }),
          "下载"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "reading-primary-button", onClick: saveReadingProgress, children: "保存" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "reading-mobile-insight-button", onClick: () => setMobileInsightsOpen(true), children: "AI解读" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: `reading-left-panel${mobileLeftOpen ? " is-mobile-open" : ""}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reading-left-rail", role: "tablist", "aria-label": "阅读辅助栏", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", id: "reading-left-tab-outline", role: "tab", "aria-controls": "reading-left-panel-outline", "aria-selected": leftPanel === "outline", "aria-expanded": leftOverlayLayout ? mobileLeftOpen && leftPanel === "outline" : void 0, tabIndex: leftPanel === "outline" ? 0 : -1, className: leftPanel === "outline" ? "is-active" : "", onClick: () => selectLeftPanel("outline"), "aria-label": "目录", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: leftPanel === "outline" ? "./assets/reading/outline.svg" : "./assets/reading/outline-inactive.svg", alt: "" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", id: "reading-left-tab-thumbnails", role: "tab", "aria-controls": "reading-left-panel-thumbnails", "aria-selected": leftPanel === "thumbnails", "aria-expanded": leftOverlayLayout ? mobileLeftOpen && leftPanel === "thumbnails" : void 0, tabIndex: leftPanel === "thumbnails" ? 0 : -1, className: leftPanel === "thumbnails" ? "is-active" : "", onClick: () => selectLeftPanel("thumbnails"), "aria-label": "缩略图", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: leftPanel === "thumbnails" ? "./assets/reading/thumbnails-active.svg" : "./assets/reading/thumbnails.svg", alt: "" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", id: "reading-left-tab-notes", role: "tab", "aria-controls": "reading-left-panel-notes", "aria-selected": leftPanel === "notes", "aria-expanded": leftOverlayLayout ? mobileLeftOpen && leftPanel === "notes" : void 0, tabIndex: leftPanel === "notes" ? 0 : -1, className: leftPanel === "notes" ? "is-active" : "", onClick: () => selectLeftPanel("notes"), "aria-label": "笔记", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: leftPanel === "notes" ? "./assets/reading/notes-active.svg" : "./assets/reading/notes.svg", alt: "" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `reading-left-content${leftPanel === "thumbnails" ? " is-thumbnails" : ""}`, ref: leftContentRef, children: [
        leftPanel === "outline" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reading-outline", id: "reading-left-panel-outline", role: "tabpanel", "aria-labelledby": "reading-left-tab-outline", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "目录" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reading-outline-list", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reading-outline-disclosure", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  className: "is-emphasis",
                  "aria-expanded": outlineMainExpanded,
                  "aria-controls": "reading-outline-main-sections",
                  onClick: () => setOutlineMainExpanded((expanded) => !expanded),
                  children: [
                    "摘要",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `reading-inline-chevron${outlineMainExpanded ? "" : " is-right"}`, "aria-hidden": "true" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `reading-outline-collapse${outlineMainExpanded ? " is-expanded" : ""}`, id: "reading-outline-main-sections", "aria-hidden": !outlineMainExpanded, inert: outlineMainExpanded ? void 0 : true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: outlineGroups.slice(1, -1).map((group) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reading-outline-group", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => jumpToSection(group.title), children: group.title }),
                group.children.map((child) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "is-child", onClick: () => jumpToSection(child), children: child }, child))
              ] }, group.title)) }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "reading-outline-disclosure", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reading-outline-static is-emphasis", children: [
              "参考文献",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "reading-inline-chevron is-right", "aria-hidden": "true" })
            ] }) })
          ] })
        ] }),
        leftPanel === "thumbnails" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reading-thumbnails", id: "reading-left-panel-thumbnails", role: "tabpanel", "aria-labelledby": "reading-left-tab-thumbnails", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reading-thumbnail-tools", "aria-label": "缩略图大小", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", "aria-label": "缩小缩略图", disabled: thumbnailZoom === 25, onClick: () => setThumbnailZoom((current) => Math.max(25, current - 25)), children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "./assets/reading/thumbnail-zoom-out.svg", alt: "" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "range", min: "25", max: "100", step: "25", value: thumbnailZoom, "aria-label": "缩略图大小", onChange: (event) => setThumbnailZoom(Number(event.target.value)), style: { "--thumbnail-progress": `${(thumbnailZoom - 25) / 75 * 100}%` } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", "aria-label": "放大缩略图", disabled: thumbnailZoom === 100, onClick: () => setThumbnailZoom((current) => Math.min(100, current + 25)), children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "./assets/reading/thumbnail-zoom-in.svg", alt: "" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "reading-thumbnail-list",
              ref: thumbnailListRef,
              style: {
                "--thumbnail-preview-width": `${thumbnailZoom * 1.28}px`,
                "--thumbnail-card-width": `${48 + thumbnailZoom * 1.28}px`,
                "--thumbnail-card-height": `${44 + thumbnailZoom * 1.28 * 2246 / 812}px`
              },
              children: Array.from({ length: totalPages }, (_, index) => index + 1).map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", "aria-current": page === item ? "page" : void 0, onClick: () => goToPage(item), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "thumbnail-paper", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "./assets/reading/paper-thumbnail.png", alt: "" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  "第",
                  item,
                  "页"
                ] })
              ] }, item))
            }
          )
        ] }),
        leftPanel === "notes" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reading-notes", id: "reading-left-panel-notes", role: "tabpanel", "aria-labelledby": "reading-left-tab-notes", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reading-panel-heading", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "笔记" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", "aria-label": "添加笔记", onClick: startAddingNote, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "icon-plus", "aria-hidden": "true" }) })
          ] }),
          editingNoteId == null ? filteredNotes.length > 0 ? filteredNotes.map((note) => /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: `reading-note-card${noteDetailId === note.id ? " is-active" : ""}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "reading-note-color", style: { background: note.color } }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reading-note-card-content", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("i", {}),
                note.title
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reading-note-label", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "笔记：" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", "aria-label": "复制笔记", onClick: () => void copyText(note.excerpt, "笔记已复制"), children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "./assets/reading/copy.svg", alt: "" }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "reading-note-excerpt", children: note.excerpt }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setNoteDetailId(note.id), children: "详情" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", {}),
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => startEditingNote(note), children: "编辑" })
              ] })
            ] })
          ] }, note.id)) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reading-notes-empty", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "./assets/reading/notes-empty.svg", alt: "" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "暂无笔记" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
              "请 ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: activateNoteTool, children: "唤醒笔记" }),
              " 进行添加"
            ] })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: `reading-note-edit-card${noteEditorExpanded ? " is-expanded" : ""}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "reading-note-color", style: { background: notes.find((note) => note.id === editingNoteId)?.color ?? "#FFE4BA" } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("header", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: notes.find((note) => note.id === editingNoteId)?.title ?? "多硫化物穿梭效应" }) }),
            noteEditStage >= 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reading-note-source", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "英译：" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Thiosulfate shuttle effect" })
              ] }),
              noteEditStage >= 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "解释：" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: explainedExcerpt })
              ] }),
              noteEditStage >= 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "图片：" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "reading-note-images", children: (uploadedNoteImages.length ? uploadedNoteImages : ["./assets/reading/note-image-1.png", "./assets/reading/note-image-2.png", "./assets/reading/note-image-3.png"]).map((src, index) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `reading-note-image-tile reading-note-image-tile--${index + 1}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src, alt: `笔记图片 ${index + 1}` }) }, src)) })
              ] }),
              noteEditStage >= 4 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "笔记：" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "reading-note-existing", children: pendingAddedNote || expandedNoteExcerpt })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reading-note-compose", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { ref: noteTextareaRef, value: editingNoteText, onChange: (event) => setEditingNoteText(event.target.value), placeholder: "输入笔记内容", "aria-label": "编辑笔记内容" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: noteImageInputRef, className: "reading-note-image-input", type: "file", accept: "image/*", multiple: true, onChange: (event) => {
                uploadNoteImages(event.target.files);
                event.target.value = "";
              } }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reading-note-editor-tools", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", "aria-label": "翻译笔记", onClick: () => setNoteEditStage((stage) => Math.max(stage, 1)), children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "./assets/reading/editor-translate.svg", alt: "" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", "aria-label": "AI 解释笔记", onClick: () => setNoteEditStage((stage) => Math.max(stage, 2)), children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "./assets/reading/editor-ai.svg", alt: "" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", "aria-label": "插入笔记图片", onClick: () => noteImageInputRef.current?.click(), children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "./assets/reading/editor-image.svg", alt: "" }) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: addNoteDraft, children: "添加" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
                setEditingNoteId(null);
                setNoteEditorExpanded(false);
                setContextAction(null);
                setActiveTool(null);
                setNoteSelection(null);
                setNoteEditStage(0);
                setPendingAddedNote("");
              }, children: "取消" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: commitEditedNote, children: "保存" })
            ] })
          ] })
        ] })
      ] })
    ] }),
    editingNoteId != null && leftPanel === "notes" && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: `reading-note-panel-handle${noteEditorExpanded ? " is-expanded" : ""}`, "aria-label": noteEditorExpanded ? "收起笔记区域" : "拓展笔记区域", "aria-expanded": noteEditorExpanded, onClick: () => {
      setMobileInsightsOpen(false);
      if (leftOverlayLayout) setMobileLeftOpen(true);
      setNoteEditorExpanded((expanded) => !expanded);
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "./assets/reading/note-expand.svg", alt: "" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: `reading-canvas${activeTool === "note" ? " is-note-tool-active" : ""}${activeTool === "screenshot" ? " is-screenshot-tool-active" : ""}`, ref: canvasRef, onPointerDown: beginScreenshotDrag, onPointerMove: moveScreenshotPointer, onPointerUp: finishScreenshotDrag, onPointerCancel: cancelScreenshotDrag, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "reading-paper-scroll", ref: paperScrollRef, onScroll: syncPageFromPaperScroll, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: paperZoomStageRef, className: "reading-paper-zoom-stage", style: { "--paper-scale": zoom / 100, width: 812 * zoom / 100, minHeight: 2246 * zoom / 100 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "article",
        {
          className: "reading-paper",
          ref: paperRef,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { className: "reading-paper-figma-top", src: "./assets/reading/paper-top.png", alt: "" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reading-paper-page-number", children: [
              "第 ",
              Math.min(page, 18),
              " 页 / 18"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "paper-masthead", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Advanced Energy Materials" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "DOI: 10.1002/aenm.202301847" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "paper-title-block", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { children: [
                "锂硫电池中多硫化物穿梭效应的抑制机制研究：",
                /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                "基于功能化碳纳米管界面的储能材料"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "刘建国｜陈思远｜王磊" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: "南方科技大学材料科学与工程系｜中科院深圳先进院" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "paper-abstract", "data-section": "摘要", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "摘要" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  "data-note-selectable": "true",
                  onMouseDown: (event) => beginPaperRange(event, "摘要"),
                  onMouseUp: (event) => selectPaperRange(event, "摘要"),
                  onClick: (event) => hitPaperLine(event, "摘要"),
                  children: renderSelectableText(articleAbstract, "摘要")
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "paper-body", children: articleSections.map((section) => /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-section": section.title.replace(/[^\d\u4e00-\u9fa5]/g, ""), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: section.title }),
              section.parts.map((part) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-section": part.title.replace(/[^\d\u4e00-\u9fa5]/g, ""), children: [
                part.title && /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: part.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { "data-note-selectable": "true", onMouseDown: (event) => beginPaperRange(event, part.title), onMouseUp: (event) => selectPaperRange(event, part.title), onClick: (event) => hitPaperLine(event, part.title), className: [
                  locatedResult != null && part.title === aiSearchTargetSections[locatedResult] ? "paper-selected-line is-located" : ""
                ].filter(Boolean).join(" "), children: renderSelectableText(part.body, part.title) }),
                part.title === "2.2.表征手段" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reading-paper-chart", "aria-label": "不同循环次数下的比容量对比图", children: [
                  [42, 64, 78, 61, 72, 88, 66].map((height, index) => /* @__PURE__ */ jsxRuntimeExports.jsx("i", { style: { height }, className: index === 5 ? "is-dark" : "" }, index)),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: "图3. 不同循环次数下的比容量对比（mAh g⁻¹）" })
                ] })
              ] }, part.title || section.title))
            ] }, section.title)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "paper-keywords", children: "关键词：储能材料 · 锂硫电池 · 碳纳米管 · 多硫化物 · 穿梭效应" })
          ]
        }
      ) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reading-selection-toolbar", role: "toolbar", "aria-label": "划词工具", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", "aria-label": "AI检索", "aria-pressed": activeTool === "search", className: activeTool === "search" ? "is-active" : "", onClick: activateSearch, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "reading-search-tool-glyph", "aria-hidden": "true" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", "aria-label": "标注与添加笔记", "aria-pressed": activeTool === "note", className: activeTool === "note" ? "is-active" : "", onClick: activateNoteTool, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "reading-note-tool-glyph", "aria-hidden": "true" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", "aria-label": "截图", "aria-pressed": activeTool === "screenshot", className: activeTool === "screenshot" ? "is-active" : "", onClick: activateScreenshotTool, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "reading-camera-tool-glyph", "aria-hidden": "true" }) })
      ] }),
      activeTool === "screenshot" && contextAction !== "screenshot" && screenshotPointer && !screenshotDragStart && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reading-screenshot-crosshair", style: { left: screenshotPointer.localX, top: screenshotPointer.localY }, "aria-hidden": "true", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("i", {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx("i", {}),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("small", { children: [
          "坐标　",
          Math.round(screenshotPointer.clientX),
          ", ",
          Math.round(screenshotPointer.clientY),
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          "色值　#E5E6EB"
        ] })
      ] }),
      activeTool === "screenshot" && screenshotDragStart && cropRect && reactDomExports.createPortal(/* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "reading-screenshot-drag-rect", style: { left: cropRect.left, top: cropRect.top, width: cropRect.width, height: cropRect.height }, "aria-hidden": "true" }), document.body),
      contextAction === "highlight" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reading-context-menu", style: { left: contextMenuPosition.left, top: contextMenuPosition.top, right: "auto" }, onMouseDown: (event) => event.preventDefault(), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: showTranslation, children: "翻译" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: showExplanation, children: "解释" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", className: "reading-context-color", "aria-label": "选择背景颜色", onClick: () => setColorMenuOpen((open) => !open), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("i", { style: { background: highlightColors[highlightColorIndex] } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `reading-inline-chevron${colorMenuOpen ? " is-up" : ""}`, "aria-hidden": "true" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "reading-context-note", "aria-label": "添加笔记", onClick: startAddingNote, children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "./assets/reading/note-tool.svg", alt: "" }) })
      ] }),
      contextAction === "highlight" && colorMenuOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reading-color-palette", style: { left: Math.max(8, contextMenuPosition.left - 54), top: contextMenuPosition.top + 32, right: "auto" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "背景颜色" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: highlightColors.map((color, index) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: highlightColorIndex === index ? "is-active" : "", style: { background: color === "transparent" ? "#fff" : color }, "aria-label": `背景色 ${index + 1}`, onClick: () => {
          setHighlightColorIndex(index);
          setColorMenuOpen(false);
        } }, `${color}-${index}`)) })
      ] }),
      (resultCards.translationVisible || resultCards.explanationVisible) && contextAction !== "highlight" && contextAction !== "screenshot" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reading-result-stack", children: [
        resultCards.translationVisible && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `reading-float-card reading-float-card--translate${resultCards.translationExpanded ? "" : " reading-float-card--collapsed"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "reading-result-title-icon", "aria-hidden": "true" }),
              "实时翻译"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "reading-icon-close", "aria-label": "关闭实时翻译", onClick: () => closeResultCard("translation") })
          ] }),
          resultCards.translationExpanded && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "原文：" }),
              "锂硫电池因具有较高的理论比容量和能量密度，被认为是具有应用前景的新一代储能体系。然而，在实际充放电过程"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reading-translation", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "译文：" }),
              translatedExcerpt
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => void copyText(translatedExcerpt, "译文已复制"), children: "复制译文" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => openNoteEditor("translation"), children: "添加笔记" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "reading-result-toggle", "aria-label": resultCards.translationExpanded ? "收起实时翻译" : "展开实时翻译", onClick: () => toggleResultCard("translation"), children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { className: resultCards.translationExpanded ? "" : "is-collapsed", src: "./assets/reading/result-toggle.svg", alt: "" }) })
          ] })
        ] }),
        resultCards.explanationVisible && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `reading-float-card reading-float-card--explain${resultCards.explanationExpanded ? "" : " reading-float-card--collapsed"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "reading-result-title-icon", "aria-hidden": "true" }),
              "AI解释"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "reading-icon-close", "aria-label": "关闭 AI 解释", onClick: () => closeResultCard("explanation") })
          ] }),
          resultCards.explanationExpanded && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "原文：" }),
              "锂硫电池因具有较高的理论比容量和能量密度，被认为是具有应用前景的新一代储能体系。"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reading-ai-explain", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "解释：" }),
              explainedExcerpt
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => void copyText(explainedExcerpt, "解释已复制"), children: "复制解释" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => openNoteEditor("explanation"), children: "添加笔记" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "reading-result-toggle", "aria-label": resultCards.explanationExpanded ? "收起 AI 解释" : "展开 AI 解释", onClick: () => toggleResultCard("explanation"), children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { className: resultCards.explanationExpanded ? "" : "is-collapsed", src: "./assets/reading/result-toggle.svg", alt: "" }) })
          ] })
        ] })
      ] }),
      contextAction === "screenshot" && cropRect && reactDomExports.createPortal(/* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "reading-screenshot-layer", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reading-crop-area", style: { left: cropRect.left, top: cropRect.top, width: cropRect.width, height: cropRect.height }, children: [
        ["nw", "n", "ne", "e", "se", "s", "sw", "w"].map((handle) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `reading-crop-handle is-${handle}`, "aria-hidden": "true", onPointerDown: (event) => beginCropResize(event, handle), onPointerMove: moveCropResize, onPointerUp: finishCropResize, onPointerCancel: finishCropResize }, handle)),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `reading-crop-actions${cropRect.top + cropRect.height + 36 > window.innerHeight ? " is-above" : ""}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", "aria-label": "下载截图", onClick: () => void downloadScreenshot(), children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "./assets/reading/download.svg", alt: "" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", "aria-label": "取消截图", onClick: cancelScreenshot, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "reading-icon-close" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", "aria-label": "完成截图", onClick: () => void completeScreenshot(), children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "./assets/selected-check.svg", alt: "" }) })
        ] })
      ] }) }), document.body)
    ] }),
    searchOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "reading-search-drawer", "aria-label": "AI检索", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "AI检索" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "reading-icon-close", "aria-label": "关闭 AI 检索抽屉", onClick: closeSearchDrawer })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reading-search-controls", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reading-search-mode", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", className: searchModeOpen ? "is-open" : "", onClick: () => setSearchModeOpen((open) => !open), children: [
            searchMode,
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `reading-inline-chevron${searchModeOpen ? " is-up" : ""}`, "aria-hidden": "true" })
          ] }),
          searchModeOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "reading-search-mode-menu", children: ["全文搜索", "智能关联", "AI语义", "关键词"].map((mode) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: searchMode === mode ? "is-active" : "", onClick: () => {
            setSearchMode(mode);
            setSearchModeOpen(false);
          }, children: mode }, mode)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reading-search-input", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: searchInputRef, value: searchQuery, onChange: (event) => setSearchQuery(event.target.value), onKeyDown: (event) => {
            if (event.key === "Enter") submitSearch();
          }, placeholder: "请输入" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", "aria-label": "提交检索", disabled: !searchQuery.trim(), onClick: submitSearch, children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "./assets/reading/search-submit.svg", alt: "" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "reading-search-help", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "i" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("b", { children: [
          searchMode,
          "："
        ] }),
        searchMode === "全文搜索" ? "在整个文档中搜索匹配的关键词，显示所有包含该词的段落" : "根据当前语义在论文中发现相关内容与概念"
      ] }),
      !searchedQuery ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reading-search-empty", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "./assets/reading/ai-empty.png", alt: "" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "支持全文搜索、智能关联、AI语义、关键词四种模式" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reading-search-results", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
          "检索 ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "4" }),
          " 个结果"
        ] }),
        aiSearchResults.map((result, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: translatedResult === index ? "is-translated" : "", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", {}),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
              "结果 ",
              index + 1,
              "/4"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("small", { children: [
              "第",
              result.page,
              "页"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: result.text.split("注意力").map((part, partIndex, parts) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            part,
            partIndex < parts.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("mark", { children: "注意力" })
          ] }, `${part}-${partIndex}`)) }),
          translatedResult === index && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reading-search-translation", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "英译：" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => void copyText(searchTranslation, "英译已复制"), children: "复制" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "reading-icon-close", "aria-label": "关闭英译", onClick: () => setTranslatedResult(null) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: searchTranslation })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setTranslatedResult((current) => current === index ? null : index), children: "翻译" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", {}),
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => locateSearchResult(index, result.page), children: "定位" })
          ] })
        ] }, result.page))
      ] }),
      locatedResult != null && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "reading-location-tip", onClick: returnFromLocation, children: "取消定位，返回原处" })
    ] }),
    detailedNote && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "reading-note-detail", role: "dialog", "aria-modal": "false", "aria-labelledby": "reading-note-detail-title", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { id: "reading-note-detail-title", children: "笔记详情" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "reading-icon-close", "aria-label": "关闭笔记详情", onClick: () => setNoteDetailId(null) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reading-note-detail-title", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("i", {}),
        detailedNote.title
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("dl", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "英译" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: "Thiosulfate shuttle effect" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => void copyText("Thiosulfate shuttle effect", "英译已复制"), children: "复制" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "解释" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: explainedExcerpt }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => void copyText(explainedExcerpt, "解释已复制"), children: "复制" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "图片" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("dd", { className: "reading-note-detail-images", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "./assets/reading/note-image-1.png", alt: "实验表征图" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "./assets/reading/note-image-2.png", alt: "材料形貌图" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "./assets/reading/note-image-3.png", alt: "论文示意图" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "笔记" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("dd", { className: "reading-note-detail-copy", children: [
            detailedNote.excerpt,
            " 多硫化物穿梭效应通常出现在锂硫电池中，功能化界面能够通过多位点锚定提升稳定性。",
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => onToast("已展开完整笔记"), children: "全部" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
          setNoteDetailId(null);
          startEditingNote(detailedNote);
        }, children: "编辑" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "is-danger", onClick: () => {
          onNotesChange(notes.filter((note) => note.id !== detailedNote.id));
          setNoteDetailId(null);
          onToast("笔记已删除");
        }, children: "删除" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: `reading-right-panel${mobileInsightsOpen ? " is-mobile-open" : ""}`, "aria-hidden": compactLayout && !mobileInsightsOpen, inert: compactLayout && !mobileInsightsOpen ? true : void 0, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "reading-mobile-insight-close reading-icon-close", "aria-label": "关闭智能解读面板", onClick: () => setMobileInsightsOpen(false) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "reading-insight-tabs", role: "tablist", "aria-label": "智能阅读分析", children: insightTabs.map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", id: `reading-insight-tab-${tab.id}`, role: "tab", "aria-controls": `reading-insight-panel-${tab.id}`, "aria-selected": rightPanel === tab.id, tabIndex: rightPanel === tab.id ? 0 : -1, className: rightPanel === tab.id ? "is-active" : "", onClick: () => selectInsightPanel(tab.id), children: tab.label }, tab.id)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reading-insight-content", id: `reading-insight-panel-${rightPanel}`, role: "tabpanel", "aria-labelledby": `reading-insight-tab-${rightPanel}`, children: [
        rightPanel === "ai" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reading-ai-panel", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "reading-insight-card reading-insight-card--summary", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "AI总结" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "功能化碳纳米管通过表面羧基、氨基对多硫化物的化学吸附，有效抑制锂硫电池穿梭效应，从而显著提升电池容量和长循环稳定性" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "reading-insight-card reading-insight-card--contribution", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "核心贡献" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "本文首次系统揭示了功能化CNT表面官能团与多硫化物的化学吸附机理，提出了基于多位点锚定的穿梭抑制策略，实现了186%的比容量提升" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "reading-insight-card reading-insight-card--innovation", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "创新点" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "原位XRD追踪充放电过程中多硫化物演化" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "DFT计算揭示化学吸附能垒" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "1000次长循环验证稳定性" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "reading-insight-card reading-insight-card--limit", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "研究局限" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "原位XRD追踪充放电过程中多硫化物演化" }) })
          ] }),
          aiExchange && /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "reading-ai-exchange", "aria-live": "polite", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "reading-ai-exchange-question", children: aiExchange.question }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "reading-ai-exchange-answer", children: aiExchange.answer })
          ] })
        ] }),
        rightPanel === "charts" && /* @__PURE__ */ jsxRuntimeExports.jsx(ReadingCharts, { onExport: exportChart }),
        rightPanel === "references" && /* @__PURE__ */ jsxRuntimeExports.jsx(ReadingReferences, { onView: () => onToast("已打开参考文献详情") }),
        rightPanel === "metadata" && /* @__PURE__ */ jsxRuntimeExports.jsx(ReadingMetadata, {}),
        rightPanel === "graph" && /* @__PURE__ */ jsxRuntimeExports.jsx(ReadingGraph, { onView: () => onToast("已打开关联论文详情") })
      ] }),
      rightPanel === "ai" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reading-ai-question", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { htmlFor: "reading-ai-question", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "./assets/reading/ai.svg", alt: "" }),
          "AI问答"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "reading-ai-question",
              value: aiQuestion,
              onChange: (event) => setAiQuestion(event.target.value),
              onKeyDown: (event) => {
                if (event.key === "Enter" && !event.nativeEvent.isComposing) submitAiQuestion();
              },
              placeholder: "向AI提问关于这篇论文..."
            }
          ),
          aiQuestion.trim() && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", "aria-label": "提交问题", onClick: submitAiQuestion, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "reading-submit-arrow", "aria-hidden": "true" }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "reading-footer", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reading-page-controls", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => goToPage(1), "aria-label": "第一页", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "reading-first-page-icon" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => goToPage(page - 1), "aria-label": "上一页", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "pager-chevron pager-chevron--prev" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: pageLabel }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => goToPage(page + 1), "aria-label": "下一页", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "pager-chevron" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => goToPage(totalPages), "aria-label": "最后一页", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "reading-last-page-icon" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "reading-back-first", onClick: () => goToPage(1), children: "回到第1页" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reading-zoom-controls", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reading-zoom-selector", ref: zoomSelectorRef, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              ref: zoomTriggerRef,
              type: "button",
              className: `reading-zoom-trigger${zoomMenuOpen ? " is-open" : ""}${zoom === 100 ? " is-wide-value" : ""}`,
              "aria-label": `缩放比例，当前 ${zoom}%`,
              "aria-haspopup": "listbox",
              "aria-expanded": zoomMenuOpen,
              "aria-controls": "reading-zoom-menu",
              onClick: () => zoomMenuOpen ? closeZoomMenu() : openZoomMenu(),
              onKeyDown: handleZoomTriggerKeyDown,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  zoom,
                  "%"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "reading-zoom-trigger-chevron", "aria-hidden": "true", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "./assets/reading/zoom-chevron-vector.svg", alt: "" }) })
              ]
            }
          ),
          zoomMenuOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "reading-zoom-menu", id: "reading-zoom-menu", role: "listbox", "aria-label": "选择缩放比例", children: zoomPresets.map((preset, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              ref: (node) => {
                zoomOptionRefs.current[index] = node;
              },
              type: "button",
              role: "option",
              "aria-selected": zoom === preset,
              className: zoom === preset ? "is-active" : "",
              tabIndex: index === zoomMenuActiveIndex ? 0 : -1,
              onFocus: () => setZoomMenuActiveIndex(index),
              onClick: () => selectZoomPreset(preset, false),
              onKeyDown: (event) => handleZoomOptionKeyDown(event, index),
              children: [
                preset,
                "%"
              ]
            },
            preset
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reading-zoom-slider", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "reading-zoom-step", type: "button", "aria-label": "缩小", disabled: zoom === 25, onClick: () => applyZoom(zoom - 5), children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "./assets/reading/zoom-minus.svg", alt: "" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: `reading-zoom-range${zoomDragging ? " is-dragging" : ""}`,
              role: "slider",
              tabIndex: 0,
              "aria-label": "页面缩放",
              "aria-valuemin": 25,
              "aria-valuemax": 100,
              "aria-valuenow": zoom,
              "aria-valuetext": `${zoom}%`,
              style: { "--zoom-progress": `${zoom}%` },
              onPointerDown: handleZoomRangePointerDown,
              onPointerMove: handleZoomRangePointerMove,
              onPointerUp: finishZoomRangePointer,
              onPointerCancel: finishZoomRangePointer,
              onKeyDown: handleZoomRangeKeyDown,
              onBlur: () => setZoomDragging(false),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "reading-zoom-track", "aria-hidden": "true" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "reading-zoom-progress", "aria-hidden": "true" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "reading-zoom-thumb", "aria-hidden": "true", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "./assets/reading/zoom-thumb.svg", alt: "" }) })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "reading-zoom-step", type: "button", "aria-label": "放大", disabled: zoom === 100, onClick: () => applyZoom(zoom + 5), children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "./assets/reading/zoom-plus.svg", alt: "" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "reading-fullscreen-button", type: "button", "aria-label": maximized ? "退出全屏" : "全屏", onClick: () => void toggleReaderFullscreen(), children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "./assets/reading/zoom-fullscreen.svg", alt: "" }) })
      ] })
    ] })
  ] });
}
function ReadingCharts({ onExport }) {
  const charts = [
    ["图1. F-CNT SEM形貌图", "第1页"],
    ["图2. XPS表征图谱", "第1页"],
    ["图3. 循环性能曲线", "第3页"],
    ["图4. 倍率性能对比", "第4页"],
    ["图5. DFT计算结果", "第5页"]
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reading-figure-panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "图表提取" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "5 张" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: charts.map(([title, page], index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `reading-figure-thumb reading-figure-thumb--${index % 3}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "./assets/reading/chart-exact.png", alt: title }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: page })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => onExport(title, index), children: "导出" })
    ] }, title)) })
  ] });
}
function ReadingReferences({ onView }) {
  const references = [
    ["Sulfide solid electrolytes for all...", "Nature Energy ｜ 2023"],
    ["硅碳负极材料的研究进展", "化学学报 ｜ 2024"],
    ["Sulfide solid electrolytes for all...", "Nature Energy ｜ 2023"],
    ["硅碳负极材料的研究进展", "化学学报 ｜ 2024"],
    ["Sulfide solid electrolytes for all...", "Nature Energy ｜ 2023"]
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reading-reference-panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "文献解析" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "32 条" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: references.map(([title, detail], index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        "[",
        index + 1,
        "]"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: detail }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "被引用·58" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: onView, children: "查看" })
      ] })
    ] }, `${title}-${index}`)) })
  ] });
}
function ReadingMetadata() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reading-metadata-panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "数据提炼" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "9 条" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("dl", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "期刊" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: "Advanced Energy Materials" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "影响因子" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: "27.8（2023）" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "发表年份" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: "2024" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "DOI" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: "10.1002/aenm.202301847" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "被引次数" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: "47" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "访问类型" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: "开放获取（OA）" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "语言" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: "英文" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "页数" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: "18页" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { children: "数据共享" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: "GitHub:github.com/liulab" })
      ] })
    ] })
  ] });
}
function ReadingGraph({ onView }) {
  const recommendations = [["MXene基复合材料在锂硫电池中...", "Adv Energy Mater ｜ 2023"], ["固态电解质界面工程与锂金属负...", "Nature Energy ｜ 2024"], ["钠离子电池层状氧化物正极材料...", "Energy Environ Sci ｜ 2025"]];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reading-graph-panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "图谱关联" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "4 个" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "reading-graph", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: "0 0 236 137", role: "img", "aria-label": "论文知识图谱", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "118", y1: "68", x2: "38", y2: "30" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "118", y1: "68", x2: "198", y2: "30" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "118", y1: "68", x2: "38", y2: "108" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "118", y1: "68", x2: "198", y2: "108" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { className: "node-main", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "118", cy: "68", r: "20" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("text", { x: "118", y: "72", children: "CNT" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { className: "node-cyan", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "38", cy: "30", r: "16" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("text", { x: "38", y: "34", children: "锂硫" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { className: "node-blue", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "198", cy: "30", r: "16" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("text", { x: "198", y: "34", children: "锂金属" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { className: "node-pink", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "38", cy: "108", r: "16" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("text", { x: "38", y: "112", children: "多硫化物" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { className: "node-yellow", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "198", cy: "108", r: "16" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("text", { x: "198", y: "112", children: "储能" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reading-related-heading", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "关联论文推荐" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "4 篇" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "reading-related-list", children: recommendations.map(([title, detail]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: detail }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "被引用·58" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: onView, children: "查看" })
      ] })
    ] }, title)) })
  ] });
}
function ReadingWorkspace({ onSwitchToResearch, onProfileOpen, profileName, profileAvatar }) {
  const [view, setView] = reactExports.useState("reader");
  const [documents, setDocuments] = reactExports.useState(readingDocuments);
  const [activeDocumentId, setActiveDocumentId] = reactExports.useState(1);
  const [librarySelectedDocumentId, setLibrarySelectedDocumentId] = reactExports.useState(1);
  const [notes, setNotes] = reactExports.useState(initialReadingNotes);
  const [readerEditingNote, setReaderEditingNote] = reactExports.useState(false);
  const [uploadFile, setUploadFile] = reactExports.useState(null);
  const [uploadFolder, setUploadFolder] = reactExports.useState("我的笔记库1");
  const [uploadFolderOpen, setUploadFolderOpen] = reactExports.useState(false);
  const [uploadFolders, setUploadFolders] = reactExports.useState(["我的笔记库1", "我的笔记库2", "我的笔记库3", "我的笔记库4"]);
  const [uploadNewFolderOpen, setUploadNewFolderOpen] = reactExports.useState(false);
  const [isUploading, setIsUploading] = reactExports.useState(false);
  const [toast, setToast] = reactExports.useState("");
  const toastTimerRef = reactExports.useRef(null);
  const activeDocument = documents.find((document2) => document2.id === activeDocumentId) ?? documents[0];
  const showToast = (message) => {
    if (toastTimerRef.current != null) window.clearTimeout(toastTimerRef.current);
    setToast(message);
    toastTimerRef.current = window.setTimeout(() => {
      setToast("");
      toastTimerRef.current = null;
    }, 2200);
  };
  reactExports.useEffect(() => () => {
    if (toastTimerRef.current != null) window.clearTimeout(toastTimerRef.current);
  }, []);
  reactExports.useEffect(() => {
    if (librarySelectedDocumentId != null && documents.some((document2) => document2.id === librarySelectedDocumentId)) return;
    setLibrarySelectedDocumentId(documents[0]?.id ?? null);
  }, [documents, librarySelectedDocumentId]);
  const toggleFavorite = (id) => {
    setDocuments((current) => current.map((document2) => document2.id === id ? { ...document2, favorite: !document2.favorite } : document2));
    showToast("收藏状态已更新");
  };
  const openDocument = (document2) => {
    setLibrarySelectedDocumentId(document2.id);
    setActiveDocumentId(document2.id);
    setView("reader");
  };
  const handleFile = (event) => {
    setUploadFile(event.target.files?.[0] ?? null);
  };
  const submitUpload = (event) => {
    event.preventDefault();
    if (!uploadFile) return;
    if (isUploading) return;
    setIsUploading(true);
  };
  const createUploadFolder = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("folderName") ?? "").trim();
    if (!name) return;
    if (uploadFolders.some((folder) => folder.toLocaleLowerCase() === name.toLocaleLowerCase())) {
      showToast("文件夹名称已存在");
      return;
    }
    setUploadFolders((current) => [name, ...current]);
    setUploadFolder(name);
    setUploadNewFolderOpen(false);
    showToast(`已新建“${name}”`);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "product-row reading-product-row", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "product-tabs", role: "tablist", "aria-label": "产品切换", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "product-tab", type: "button", role: "tab", "aria-selected": "false", onClick: onSwitchToResearch, children: "智能科研" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "product-tab product-tab--active", type: "button", role: "tab", "aria-selected": "true", children: "智能阅读" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reading-product-actions", children: [
        (view === "reader" || view === "upload") && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "reading-library-launch", type: "button", onClick: () => setView("library"), children: "智能阅读库" }),
        (view === "library" || readerEditingNote) && view !== "upload" && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "reading-upload-button", type: "button", onClick: () => {
          setUploadFolderOpen(false);
          setIsUploading(false);
          setView("upload");
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "./assets/reading/upload.svg", alt: "" }),
          "上传文件"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "profile-button",
            type: "button",
            "aria-label": `打开个人信息设置（${profileName}）`,
            "aria-haspopup": "dialog",
            onClick: onProfileOpen,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { className: profileAvatar ? "is-custom-avatar" : void 0, src: profileAvatar || "./assets/avatar-user.svg", alt: "" })
          }
        )
      ] })
    ] }),
    view === "reader" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      ReadingReader,
      {
        documents,
        activeDocumentId: activeDocument.id,
        documentTitle: activeDocument.title,
        favorite: activeDocument.favorite,
        notes,
        onSelectDocument: setActiveDocumentId,
        onFavorite: () => toggleFavorite(activeDocument.id),
        onNotesChange: setNotes,
        onEditingNoteChange: setReaderEditingNote,
        onToast: showToast
      }
    ) : view === "library" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      ReadingLibrary,
      {
        documents,
        onDocumentsChange: setDocuments,
        selectedDocumentId: librarySelectedDocumentId,
        onSelectDocument: setLibrarySelectedDocumentId,
        onOpenDocument: openDocument,
        onBack: () => setView("reader"),
        onUpload: () => {
          setUploadFolderOpen(false);
          setIsUploading(false);
          setView("upload");
        },
        onToast: showToast,
        folders: uploadFolders,
        onFoldersChange: setUploadFolders
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "reading-upload-page", "aria-label": "上传文件", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: "智能阅读" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "上传PDF论文、享受智能解析、实时翻译、图表提取、知识图谱等增强阅读体验" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submitUpload, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: `reading-upload-page-dropzone${uploadFile ? " has-file" : ""}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "./assets/reading/docx.svg", alt: "" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "./assets/reading/pdf.svg", alt: "" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: uploadFile?.name || "点击或拖拽上传文件，支持Word、Pdf格式" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", accept: ".pdf,.doc,.docx", disabled: isUploading, onChange: handleFile })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reading-upload-page-folder", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "上传至：" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reading-upload-folder-control", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", className: uploadFolderOpen ? "is-open" : "", "aria-label": "选择笔记库", "aria-expanded": uploadFolderOpen, onClick: () => setUploadFolderOpen((open) => !open), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: uploadFolder }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "./assets/direction-down.svg", alt: "" })
            ] }),
            uploadFolderOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "reading-upload-folder-menu", children: uploadFolders.map((folder) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: uploadFolder === folder ? "is-active" : "", onClick: () => {
              setUploadFolder(folder);
              setUploadFolderOpen(false);
            }, children: folder }, folder)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "reading-upload-new-folder", type: "button", "aria-label": "新建文件夹", onClick: () => setUploadNewFolderOpen(true), children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "./assets/reading/create-folder.svg", alt: "" }) })
        ] }),
        uploadFile && !isUploading && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "reading-upload-page-submit reading-primary-button", type: "submit", children: "上传文件" }),
        isUploading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "reading-upload-page-progress", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: uploadFile?.name.toLowerCase().endsWith(".docx") ? "./assets/reading/docx.svg" : "./assets/reading/pdf.svg", alt: "" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: uploadFile?.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: "共15页｜15.8M" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("i", {}) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "55%" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "./assets/reading/docx.svg", alt: "" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "锂硫电池中多硫化物穿梭效应的抑制机制研究：基...docx" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: "共18页｜12.5M" })
            ] })
          ] })
        ] })
      ] })
    ] }),
    uploadNewFolderOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs(Modal, { title: "新建文件夹", onClose: () => setUploadNewFolderOpen(false), onSubmit: createUploadFolder, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "field-label", htmlFor: "reading-upload-folder-name", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "required-mark", children: "*" }),
        " 文件夹名称："
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "text-field", id: "reading-upload-folder-name", name: "folderName", autoFocus: true, placeholder: "请输入" })
    ] }),
    toast && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "reading-toast", role: "status", "aria-live": "polite", children: toast })
  ] });
}
function NoteDetailDialog({ note, documentItem, onClose, onEdit, onOpenDocument }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Modal,
    {
      title: "笔记详情",
      onClose,
      onSubmit: (event) => {
        event.preventDefault();
        onEdit();
      },
      cancelText: "关闭",
      confirmText: "编辑笔记",
      wide: true,
      bodyClassName: "research-note-detail-body",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "research-note-detail", "aria-label": note.title, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "research-note-heading", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "research-note-type", children: "笔记" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: note.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            "更新于 ",
            note.updatedAt
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "research-note-source", type: "button", onClick: onOpenDocument, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "来源文档" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: documentItem.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: documentItem.location }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("i", { "aria-hidden": "true" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "research-note-content", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "笔记内容" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: note.content })
        ] }),
        note.tags.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "research-note-tags", "aria-label": "笔记标签", children: note.tags.map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: tag }, tag)) })
      ] })
    }
  );
}
function NoteEditorDialog({ note, documentItem, onClose, onSave }) {
  const initial = reactExports.useMemo(() => ({
    title: note?.title ?? "",
    content: note?.content ?? "",
    tags: note?.tags.join("，") ?? ""
  }), [note]);
  const [title, setTitle] = reactExports.useState(initial.title);
  const [content, setContent] = reactExports.useState(initial.content);
  const [tags, setTags] = reactExports.useState(initial.tags);
  const [errors, setErrors] = reactExports.useState({});
  const [confirmDiscard, setConfirmDiscard] = reactExports.useState(false);
  const titleRef = reactExports.useRef(null);
  const contentRef = reactExports.useRef(null);
  const tagsRef = reactExports.useRef(null);
  const isDirty = title !== initial.title || content !== initial.content || tags !== initial.tags;
  const requestClose = () => {
    if (isDirty) {
      setConfirmDiscard(true);
      return;
    }
    onClose();
  };
  const submit = (event) => {
    event.preventDefault();
    const normalizedTitle = title.normalize("NFC").trim();
    const normalizedContent = content.normalize("NFC").trim();
    const normalizedTags = Array.from(new Set(tags.split(/[，,]/).map((tag) => tag.normalize("NFC").trim()).filter(Boolean)));
    const nextErrors = {};
    if (!normalizedTitle) nextErrors.title = "请输入笔记标题";
    if (!normalizedContent) nextErrors.content = "请输入笔记内容";
    if (normalizedTags.length > 6) nextErrors.tags = "最多添加 6 个标签";
    setErrors(nextErrors);
    if (nextErrors.title) {
      titleRef.current?.focus();
      return;
    }
    if (nextErrors.content) {
      contentRef.current?.focus();
      return;
    }
    if (nextErrors.tags) {
      tagsRef.current?.focus();
      return;
    }
    onSave({ title: normalizedTitle, content: normalizedContent, tags: normalizedTags });
  };
  if (confirmDiscard) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Modal,
      {
        title: "放弃未保存的笔记？",
        onClose: () => setConfirmDiscard(false),
        onSubmit: (event) => {
          event.preventDefault();
          onClose();
        },
        cancelText: "继续编辑",
        confirmText: "放弃修改",
        confirmDanger: true,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "discard-message", children: "当前笔记还有未保存的修改，放弃后无法恢复。" })
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Modal,
    {
      title: note ? "编辑笔记" : "新建笔记",
      onClose: requestClose,
      onSubmit: submit,
      confirmText: note ? "保存修改" : "保存笔记",
      wide: true,
      bodyClassName: "research-note-editor-body",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "research-note-document-context", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "关联文档" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: documentItem.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: documentItem.location })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "field-label", htmlFor: "research-note-title", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "required-mark", children: "*" }),
          " 笔记标题："
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            ref: titleRef,
            className: "text-field",
            id: "research-note-title",
            value: title,
            autoFocus: true,
            maxLength: 50,
            "aria-invalid": Boolean(errors.title),
            "aria-describedby": errors.title ? "research-note-title-error" : void 0,
            placeholder: "请输入笔记标题",
            onChange: (event) => {
              setTitle(event.target.value);
              if (errors.title) setErrors((current) => ({ ...current, title: void 0 }));
            }
          }
        ),
        errors.title && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "field-error", id: "research-note-title-error", children: errors.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "field-label", htmlFor: "research-note-content", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "required-mark", children: "*" }),
          " 笔记内容："
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "textarea",
          {
            ref: contentRef,
            className: "text-field research-note-textarea",
            id: "research-note-content",
            value: content,
            maxLength: 1e3,
            "aria-invalid": Boolean(errors.content),
            "aria-describedby": errors.content ? "research-note-content-error" : "research-note-content-count",
            placeholder: "记录关键结论、待办或研究想法",
            onChange: (event) => {
              setContent(event.target.value);
              if (errors.content) setErrors((current) => ({ ...current, content: void 0 }));
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "field-meta-row", children: [
          errors.content ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "field-error", id: "research-note-content-error", children: errors.content }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", {}),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("small", { id: "research-note-content-count", children: [
            content.length,
            "/1000"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "field-label", htmlFor: "research-note-tags", children: "标签：" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            ref: tagsRef,
            className: "text-field",
            id: "research-note-tags",
            value: tags,
            maxLength: 80,
            "aria-invalid": Boolean(errors.tags),
            "aria-describedby": errors.tags ? "research-note-tags-error" : "research-note-tags-help",
            placeholder: "多个标签请用逗号分隔",
            onChange: (event) => {
              setTags(event.target.value);
              if (errors.tags) setErrors((current) => ({ ...current, tags: void 0 }));
            }
          }
        ),
        errors.tags ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "field-error", id: "research-note-tags-error", children: errors.tags }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "field-help", id: "research-note-tags-help", children: "最多保存 6 个标签，便于后续检索。" })
      ]
    }
  );
}
function SpaceView({
  mode,
  teamName,
  folders,
  documents,
  openFolderName,
  page,
  onPageChange,
  onOpenFolder,
  onRenameFolder,
  onDeleteFolder,
  onBack,
  onNewFolder,
  onNewDocument,
  onImportDocument,
  onToggleFavorite,
  onDelete,
  onShare,
  onRenameDocument,
  onCreateNote,
  onOpenDocument,
  emptyTeam = false
}) {
  const label = mode === "personal" ? "我的空间" : teamName ?? "AI研究团队";
  const [menuFolderId, setMenuFolderId] = reactExports.useState(null);
  const [menuPosition, setMenuPosition] = reactExports.useState(null);
  const [renamingFolderId, setRenamingFolderId] = reactExports.useState(null);
  const [renameValue, setRenameValue] = reactExports.useState("");
  const menuRef = reactExports.useRef(null);
  const menuTriggerRefs = reactExports.useRef(/* @__PURE__ */ new Map());
  const closeFolderMenu = (restoreFocus = false) => {
    const trigger = menuFolderId == null ? null : menuTriggerRefs.current.get(menuFolderId);
    setMenuFolderId(null);
    setMenuPosition(null);
    if (restoreFocus) window.requestAnimationFrame(() => trigger?.focus());
  };
  reactExports.useEffect(() => {
    if (menuFolderId === null) return;
    const trigger = menuTriggerRefs.current.get(menuFolderId);
    const closeFromOutside = (event) => {
      const target = event.target;
      if (menuRef.current?.contains(target) || trigger?.contains(target)) return;
      closeFolderMenu();
    };
    const closeFromKeyboard = (event) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      closeFolderMenu(true);
    };
    const closeFromViewportChange = () => closeFolderMenu();
    document.addEventListener("pointerdown", closeFromOutside, true);
    document.addEventListener("keydown", closeFromKeyboard);
    window.addEventListener("resize", closeFromViewportChange);
    window.addEventListener("scroll", closeFromViewportChange, true);
    return () => {
      document.removeEventListener("pointerdown", closeFromOutside, true);
      document.removeEventListener("keydown", closeFromKeyboard);
      window.removeEventListener("resize", closeFromViewportChange);
      window.removeEventListener("scroll", closeFromViewportChange, true);
    };
  }, [menuFolderId]);
  reactExports.useEffect(() => {
    setMenuFolderId(null);
    setMenuPosition(null);
  }, [mode, teamName, openFolderName]);
  const toggleFolderMenu = (folderId, trigger) => {
    if (menuFolderId === folderId) {
      closeFolderMenu();
      return;
    }
    const rect = trigger.getBoundingClientRect();
    const menuWidth = 94;
    const menuHeight = 140;
    const viewportGap = 8;
    const anchorGap = 10;
    const left = Math.min(
      Math.max(viewportGap, rect.left),
      Math.max(viewportGap, window.innerWidth - menuWidth - viewportGap)
    );
    const preferredTop = rect.bottom + anchorGap;
    const top = preferredTop + menuHeight <= window.innerHeight - viewportGap ? preferredTop : Math.max(viewportGap, rect.top - anchorGap - menuHeight);
    setMenuPosition({ left, top });
    setMenuFolderId(folderId);
  };
  const finishRename = (folder) => {
    const nextName = renameValue.trim();
    if (nextName && nextName !== folder.name) onRenameFolder(folder.id, nextName);
    setRenamingFolderId(null);
    setRenameValue("");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: `view view--space${mode === "team" ? " view--team" : ""}${emptyTeam ? " view--empty-team" : ""}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "view-header view-header--actions", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "title-accent" }),
        mode === "team" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "breadcrumb", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "团队空间" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "/" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: label })
        ] }) : label
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "header-actions", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "button button--secondary", type: "button", onClick: onImportDocument, children: "导入文档" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "button button--secondary", type: "button", onClick: onNewDocument, children: "新建内容" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "button button--primary", type: "button", onClick: onNewFolder, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "button-plus icon-plus", "aria-hidden": "true" }),
          "新建文件夹"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `view-body space-body${openFolderName ? " space-body--folder" : ""}${emptyTeam ? " space-body--empty" : ""}`, children: [
      emptyTeam ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "empty-team-view", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "empty-team-actions", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: onImportDocument, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "empty-action-icon", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "./assets/action-pdf.svg", alt: "" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "导入" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: "导入PDF文档" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: onNewDocument, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "empty-action-icon", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "./assets/action-word.svg", alt: "" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "新建" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: "新建文档或表格" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: onNewFolder, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "empty-action-icon", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "./assets/action-folder.svg", alt: "" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "添加" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: "添加文件夹" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "empty-action-icon", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "./assets/action-manage.svg", alt: "" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "管理" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: "管理团队空间" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "empty-state", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "./assets/empty-team.svg", alt: "" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "这里暂无数据，点击上面按钮增添内容" })
        ] })
      ] }) : !openFolderName ? /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "folder-section", "aria-labelledby": "folder-title", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { id: "folder-title", children: "文件夹" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "folder-grid", children: folders.map((folder) => /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: `folder-card${menuFolderId === folder.id ? " is-selected" : ""}`, children: [
          renamingFolderId === folder.id ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "folder-open", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: folder.id % 2 === 0 ? "./assets/folder-data.svg" : "./assets/folder-research.svg", alt: "" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                className: "folder-rename-input",
                autoFocus: true,
                value: renameValue,
                "aria-label": "文件夹新名称",
                onClick: (event) => event.stopPropagation(),
                onChange: (event) => setRenameValue(event.target.value),
                onBlur: () => finishRename(folder),
                onKeyDown: (event) => {
                  if (event.key === "Enter") finishRename(folder);
                  if (event.key === "Escape") setRenamingFolderId(null);
                }
              }
            )
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "folder-open", type: "button", onClick: () => onOpenFolder(folder), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: folder.id % 2 === 0 ? "./assets/folder-data.svg" : "./assets/folder-research.svg", alt: "" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "folder-copy", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: folder.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("small", { children: [
                folder.count,
                " 个项目  更新于 ",
                folder.updatedAt
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              className: "folder-more",
              ref: (node) => {
                if (node) menuTriggerRefs.current.set(folder.id, node);
                else menuTriggerRefs.current.delete(folder.id);
              },
              "aria-label": `${folder.name}更多操作`,
              "aria-haspopup": "menu",
              "aria-expanded": menuFolderId === folder.id,
              onClick: (event) => {
                event.stopPropagation();
                toggleFolderMenu(folder.id, event.currentTarget);
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "more-dots", "aria-hidden": "true", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("i", {}),
                /* @__PURE__ */ jsxRuntimeExports.jsx("i", {}),
                /* @__PURE__ */ jsxRuntimeExports.jsx("i", {})
              ] })
            }
          )
        ] }, folder.id)) })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "folder-breadcrumb", "aria-label": "文件夹路径", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: onBack, children: "文件夹" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "/" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: onBack, children: openFolderName }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "/" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "文档" })
      ] }),
      !emptyTeam && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "documents-section", "aria-labelledby": "documents-title", children: [
        !openFolderName && /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { id: "documents-title", children: "文档" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          DocumentTable,
          {
            documents,
            mode: "space",
            page,
            onPageChange,
            onToggleFavorite,
            onDelete,
            onShare,
            onRename: onRenameDocument,
            onCreateNote,
            onOpenDocument
          }
        )
      ] })
    ] }),
    menuFolderId != null && menuPosition && (() => {
      const folder = folders.find((item) => item.id === menuFolderId);
      if (!folder) return null;
      return reactDomExports.createPortal(
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            ref: menuRef,
            className: "folder-menu folder-menu--portal",
            role: "menu",
            "aria-label": `${folder.name}操作`,
            style: { left: menuPosition.left, top: menuPosition.top },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", role: "menuitem", onClick: () => {
                closeFolderMenu();
                onOpenFolder(folder);
              }, children: "查看" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", role: "menuitem", onClick: () => {
                closeFolderMenu();
                setRenamingFolderId(folder.id);
                setRenameValue(folder.name);
              }, children: "重命名" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", role: "menuitem", className: "danger-link", onClick: () => {
                closeFolderMenu();
                onDeleteFolder(folder.id);
              }, children: "删除" })
            ]
          }
        ),
        document.body
      );
    })()
  ] });
}
const tabs$1 = [
  { id: "todo", label: "待办" },
  { id: "comments", label: "评论" },
  { id: "members", label: "成员" }
];
const commentRanges = [
  { id: "week", label: "最近1周", days: 7 },
  { id: "month", label: "最近1月", days: 31 },
  { id: "quarter", label: "最近3月", days: 93 },
  { id: "all", label: "全部评论", days: Number.POSITIVE_INFINITY }
];
function commentAgeInDays(time) {
  if (time === "刚刚") return 0;
  if (time === "昨天") return 1;
  const amount = Number.parseInt(time, 10);
  if (!Number.isFinite(amount)) return 0;
  if (time.includes("分钟") || time.includes("小时")) return amount / 24;
  if (time.includes("周")) return amount * 7;
  if (time.includes("月")) return amount * 30;
  return amount;
}
function TeamPanel({
  tab,
  todos,
  comments,
  members,
  onTabChange,
  onToggleTodo,
  onDeleteTodo,
  onAddTodoRequest,
  onAddComment,
  onInvite,
  onMemberRoleChange,
  onRemoveMember
}) {
  const [comment, setComment] = reactExports.useState("");
  const [attachment, setAttachment] = reactExports.useState("");
  const [replyToId, setReplyToId] = reactExports.useState(null);
  const [replyText, setReplyText] = reactExports.useState("");
  const [commentRange, setCommentRange] = reactExports.useState("month");
  const [commentRangeOpen, setCommentRangeOpen] = reactExports.useState(false);
  const [roleMenuMemberId, setRoleMenuMemberId] = reactExports.useState(null);
  const commentRangeRef = reactExports.useRef(null);
  const completedCount = todos.filter((item) => item.done).length;
  const selectedCommentRange = commentRanges.find((item) => item.id === commentRange) ?? commentRanges[1];
  const visibleComments = reactExports.useMemo(() => comments.filter((item) => item.parentCommentId == null && commentAgeInDays(item.time) <= selectedCommentRange.days).sort((first, second) => commentAgeInDays(first.time) - commentAgeInDays(second.time)), [comments, selectedCommentRange.days]);
  reactExports.useEffect(() => {
    if (roleMenuMemberId == null) return;
    const close = () => setRoleMenuMemberId(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [roleMenuMemberId]);
  reactExports.useEffect(() => {
    if (!commentRangeOpen) return;
    const closeOnPointerDown = (event) => {
      if (!commentRangeRef.current?.contains(event.target)) setCommentRangeOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setCommentRangeOpen(false);
    };
    window.addEventListener("pointerdown", closeOnPointerDown);
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      window.removeEventListener("pointerdown", closeOnPointerDown);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [commentRangeOpen]);
  const submitComment = () => {
    if (!comment.trim() && !attachment) return;
    onAddComment(comment.trim() || "已上传附件", attachment || void 0);
    setComment("");
    setAttachment("");
  };
  const submitReply = (item) => {
    const value = replyText.trim();
    if (!value) return;
    onAddComment(value, void 0, item.author, item.id);
    setReplyToId(null);
    setReplyText("");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "team-panel", "aria-label": "团队协作面板", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "team-panel-tabs", role: "tablist", children: tabs$1.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        role: "tab",
        className: tab === item.id ? "is-active" : "",
        "aria-selected": tab === item.id,
        onClick: () => onTabChange(item.id),
        children: item.label
      },
      item.id
    )) }),
    tab === "todo" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel-content todo-panel", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel-heading-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
          "待办事项·",
          todos.length,
          "项"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "quiet-select", type: "button", children: [
          "最近1月",
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "./assets/direction-down.svg", alt: "" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "todo-list", children: todos.map((todo) => /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: `todo-item${todo.done ? " is-done" : ""}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "todo-title", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `priority-dot priority-dot--${todo.level}` }),
          todo.title
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "todo-meta", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "截止：",
            todo.due
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "todo-actions", children: todo.done ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "todo-complete-label", children: "已完成" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", "aria-label": "删除待办", onClick: () => onDeleteTodo(todo.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "icon-close", "aria-hidden": "true" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", "aria-label": "完成待办", onClick: () => onToggleTodo(todo.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "icon-check", "aria-hidden": "true" }) })
          ] }) })
        ] })
      ] }, todo.id)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "todo-summary", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "已完成 ",
          completedCount,
          "/",
          todos.length,
          " 项"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: onAddTodoRequest, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "icon-plus", "aria-hidden": "true" }),
          "添加"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "progress-track", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { width: `${todos.length ? completedCount / todos.length * 100 : 0}%` } }) })
      ] })
    ] }),
    tab === "comments" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel-content comments-panel", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel-heading-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { className: "panel-title", children: [
          "近期评论·",
          visibleComments.length,
          "条"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "comment-range", ref: commentRangeRef, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: "comment-range-trigger",
              type: "button",
              "aria-haspopup": "menu",
              "aria-expanded": commentRangeOpen,
              onClick: () => setCommentRangeOpen((open) => !open),
              children: [
                selectedCommentRange.label,
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `comment-range-chevron${commentRangeOpen ? " is-open" : ""}`, "aria-hidden": "true", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "./assets/figma/comment-filter-chevron.svg", alt: "" }) })
              ]
            }
          ),
          commentRangeOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "comment-range-menu", role: "menu", "aria-label": "评论时间范围", children: commentRanges.map((range) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              role: "menuitemradio",
              "aria-checked": range.id === commentRange,
              className: range.id === commentRange ? "is-selected" : "",
              onClick: () => {
                setCommentRange(range.id);
                setCommentRangeOpen(false);
              },
              children: range.label
            },
            range.id
          )) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "comment-list", children: visibleComments.map((item) => {
        const replyCount = comments.filter((commentItem) => commentItem.parentCommentId === item.id).length;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "comment-item", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "comment-head", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "comment-avatar", children: item.author.slice(0, 1) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "comment-identity", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "comment-author", children: item.author }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("time", { children: item.time })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", className: "comment-reply-trigger", onClick: () => {
              setReplyToId(item.id);
              setReplyText("");
            }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "./assets/figma/comment-reply.svg", alt: "" }),
              "回复"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: item.content }),
          item.attachment && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", className: "attachment-chip", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "./assets/figma/comment-attachment.svg", alt: "" }),
            item.attachment
          ] }),
          replyCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "comment-replies-count", type: "button", children: [
            replyCount,
            "条回复",
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "./assets/figma/comment-filter-chevron.svg", alt: "" })
          ] }),
          replyToId === item.id && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "comment-inline-reply", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: replyText, onChange: (event) => setReplyText(event.target.value), autoFocus: true, "aria-label": `回复${item.author}`, placeholder: "回复" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
                setReplyToId(null);
                setReplyText("");
              }, children: "取消" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("i", { "aria-hidden": "true" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", disabled: !replyText.trim(), onClick: () => submitReply(item), children: "确定" })
            ] })
          ] })
        ] }, item.id);
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "comment-composer", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "comment-editor-box", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: comment, onChange: (event) => setComment(event.target.value), placeholder: "添加评论..." }),
          attachment && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "attachment-preview", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("i", { children: "PDF" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: attachment }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", "aria-label": "移除附件", onClick: () => setAttachment(""), children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "comment-tools", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "upload-link", "aria-label": "添加附件", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "./assets/figma/comment-composer-attachment.svg", alt: "" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", onChange: (event) => setAttachment(event.target.files?.[0]?.name ?? "") })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "button button--primary comment-send", type: "button", onClick: submitComment, children: "发送评论" })
      ] })
    ] }),
    tab === "members" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel-content members-panel", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel-heading-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
          "团队成员·",
          members.length,
          "人"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", className: "primary-link", onClick: onInvite, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "./assets/figma/invite-member.svg", alt: "" }),
          "邀请"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "member-list", children: members.map((member) => /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "member-item", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "member-avatar member-avatar--status", style: { background: member.color }, children: [
          member.initials,
          /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: member.status === "在线" ? "is-online" : "" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: member.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: member.status })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "member-role-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              className: `role-badge role-badge--${member.role === "管理员" ? "admin" : member.role === "编辑者" ? "editor" : "viewer"}`,
              "aria-label": `${member.name}权限设置`,
              "aria-expanded": roleMenuMemberId === member.id,
              disabled: member.role === "管理员",
              onClick: (event) => {
                event.stopPropagation();
                setRoleMenuMemberId((current) => current === member.id ? null : member.id);
              },
              children: [
                member.role,
                member.role !== "管理员" && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "./assets/direction-down.svg", alt: "" })
              ]
            }
          ),
          roleMenuMemberId === member.id && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "member-role-menu", role: "menu", onClick: (event) => event.stopPropagation(), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", role: "menuitem", onClick: () => {
              onMemberRoleChange(member.id, "管理员");
              setRoleMenuMemberId(null);
            }, children: "管理员" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", role: "menuitem", className: member.role === "编辑者" ? "is-current" : "", onClick: () => {
              onMemberRoleChange(member.id, "编辑者");
              setRoleMenuMemberId(null);
            }, children: "编辑者" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", role: "menuitem", className: member.role === "查看员" ? "is-current" : "", onClick: () => {
              onMemberRoleChange(member.id, "查看员");
              setRoleMenuMemberId(null);
            }, children: "查看员" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", role: "menuitem", className: "is-danger", onClick: () => {
              onRemoveMember(member.id);
              setRoleMenuMemberId(null);
            }, children: "可移除" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("small", { className: "member-joined-at", children: member.joinedAt })
        ] })
      ] }, member.id)) })
    ] })
  ] });
}
const tabs = [
  { id: "recent", label: "最近浏览" },
  { id: "favorites", label: "我的收藏" },
  { id: "owned", label: "归我所有" },
  { id: "shared", label: "与我共享" }
];
function WorkspaceView({
  documents,
  tab,
  page,
  onTabChange,
  onPageChange,
  onToggleFavorite,
  onDelete,
  onShare,
  onOpenDocument,
  onOpenDataTableHub,
  dataTableCount,
  dataRecordCount,
  highlightedDocumentId
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "view view--workbench", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "view-header", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "title-accent" }),
        "工作台"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "workbench-data-hub-entry", type: "button", onClick: onOpenDataTableHub, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "./assets/iconpark/grid-nine.svg", alt: "" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "数据表格" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("small", { children: [
            dataTableCount,
            " 个表格 · ",
            dataRecordCount,
            " 条记录"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("i", { "aria-hidden": "true", children: "›" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "view-body workbench-body", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "subtabs", role: "tablist", "aria-label": "工作台筛选", children: tabs.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          className: tab === item.id ? "is-active" : "",
          role: "tab",
          "aria-selected": tab === item.id,
          onClick: () => onTabChange(item.id),
          children: item.label
        },
        item.id
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DocumentTable,
        {
          documents,
          mode: "workbench",
          workbenchTab: tab,
          page,
          onPageChange,
          onToggleFavorite,
          onDelete,
          onShare,
          onOpenDocument,
          highlightedDocumentId
        }
      )
    ] })
  ] });
}
const STORAGE_KEY$1 = "intelligent-research-portal:user-profile:v1";
const STORAGE_VERSION$1 = 1;
const MAX_AVATAR_DATA_URL_LENGTH = 5e5;
const CONTROL_CHARACTERS = /[\u0000-\u001f\u007f]/;
const defaultUserProfile = {
  avatarDataUrl: null,
  name: "张三",
  email: "",
  phone: "",
  organization: "",
  title: "",
  researchInterests: ""
};
const cloneDefaultProfile = () => ({ ...defaultUserProfile });
const isRecord = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
const normalizeText = (value) => value.normalize("NFC").trim();
const isSafeAvatarDataUrl = (value) => {
  if (value === null) return true;
  if (typeof value !== "string" || value.length > MAX_AVATAR_DATA_URL_LENGTH) return false;
  return /^data:image\/(?:jpeg|png|webp);base64,[a-zA-Z0-9+/]+={0,2}$/.test(value);
};
const readString = (source, key, maxLength) => {
  const value = source[key];
  if (typeof value !== "string") return null;
  const normalized = normalizeText(value);
  if (Array.from(normalized).length > maxLength) return null;
  return normalized;
};
const parseUserProfile = (value) => {
  if (!isRecord(value) || !isSafeAvatarDataUrl(value.avatarDataUrl)) return null;
  const name = readString(value, "name", 30);
  const email = readString(value, "email", 254);
  const phone = readString(value, "phone", 30);
  const organization = readString(value, "organization", 60);
  const title = readString(value, "title", 40);
  const researchInterests = readString(value, "researchInterests", 200);
  if (name === null || email === null || phone === null || organization === null || title === null || researchInterests === null || name.length === 0) return null;
  if ([name, email, phone, organization, title, researchInterests].some((field) => CONTROL_CHARACTERS.test(field)) || email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  if (phone.length > 0) {
    const normalizedPhone = phone.replace(/[\s()-]/g, "");
    if (!/^\+?\d{7,15}$/.test(normalizedPhone)) return null;
  }
  return {
    avatarDataUrl: value.avatarDataUrl,
    name,
    email,
    phone,
    organization,
    title,
    researchInterests
  };
};
const readStoredProfile = (value) => {
  if (!isRecord(value)) return null;
  if (value.version === STORAGE_VERSION$1 && isRecord(value.data)) {
    return parseUserProfile(value.data);
  }
  return parseUserProfile(value);
};
function loadUserProfile() {
  if (typeof window === "undefined") return cloneDefaultProfile();
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY$1);
    if (!stored) return cloneDefaultProfile();
    return readStoredProfile(JSON.parse(stored)) ?? cloneDefaultProfile();
  } catch {
    return cloneDefaultProfile();
  }
}
function saveUserProfile(profile) {
  if (typeof window === "undefined") {
    return { ok: false, error: "当前环境不支持本地存储。" };
  }
  const normalized = parseUserProfile(profile);
  if (!normalized) {
    return { ok: false, error: "个人资料格式无效，请检查后重试。" };
  }
  const stored = {
    version: STORAGE_VERSION$1,
    updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    data: normalized
  };
  try {
    window.localStorage.setItem(STORAGE_KEY$1, JSON.stringify(stored));
    return { ok: true };
  } catch {
    return { ok: false, error: "无法保存到本机，请释放浏览器存储空间后重试。" };
  }
}
const STORAGE_KEY = "intelligent-research-portal:documents:v1";
const STORAGE_VERSION = 1;
const MAX_STORAGE_CHARACTERS = 42e5;
const documentKinds = /* @__PURE__ */ new Set(["在线文档", "数据表格", "PDF文档", "Word文档", "Excel文档"]);
let blockCounter = 0;
const emptyStoredState = () => ({
  documents: [],
  recycledDocuments: [],
  deletedDocumentIds: []
});
const nextBlockId = () => {
  blockCounter += 1;
  return `block-${Date.now().toString(36)}-${blockCounter.toString(36)}`;
};
const cleanString = (value, maximum = 1e4) => typeof value === "string" ? value.slice(0, maximum) : "";
const cleanBlockId = (value) => {
  const candidate = cleanString(value, 120).trim();
  return candidate || nextBlockId();
};
const safeImageSource = (value) => typeof value === "string" && /^data:image\/(?:png|jpeg|webp);base64,[a-z0-9+/=]+$/i.test(value) ? value : "";
const sanitizeBlock = (value) => {
  if (!value || typeof value !== "object") return null;
  const block = value;
  const id = cleanBlockId(block.id);
  if (block.type === "text") {
    const style = block.style === "heading-1" || block.style === "heading-2" || block.style === "quote" ? block.style : "paragraph";
    return {
      id,
      type: "text",
      text: cleanString(block.text, 2e4),
      style,
      bold: Boolean(block.bold),
      italic: Boolean(block.italic),
      underline: Boolean(block.underline)
    };
  }
  if (block.type === "list") {
    const items = Array.isArray(block.items) ? block.items.slice(0, 100).map((item) => cleanString(item, 1e3)) : [""];
    return { id, type: "list", ordered: Boolean(block.ordered), items: items.length ? items : [""] };
  }
  if (block.type === "image") {
    return {
      id,
      type: "image",
      src: safeImageSource(block.src),
      alt: cleanString(block.alt, 200),
      caption: cleanString(block.caption, 300)
    };
  }
  if (block.type === "formula") {
    return { id, type: "formula", latex: cleanString(block.latex, 2e3) };
  }
  if (block.type === "bookmark") {
    return {
      id,
      type: "bookmark",
      url: cleanString(block.url, 2e3),
      title: cleanString(block.title, 200),
      description: cleanString(block.description, 500)
    };
  }
  if (block.type === "divider") {
    return { id, type: "divider", style: block.style === "dashed" ? "dashed" : "solid" };
  }
  return null;
};
const sanitizeBlocks = (value) => {
  if (!Array.isArray(value)) return [];
  return value.slice(0, 200).map(sanitizeBlock).filter((block) => Boolean(block));
};
const sanitizeDocument = (value) => {
  if (!value || typeof value !== "object") return null;
  const item = value;
  if (item.pdfArchive && typeof item.pdfArchive === "object") return null;
  if (!Number.isInteger(item.id) || Number(item.id) <= 0) return null;
  if (!documentKinds.has(String(item.kind))) return null;
  const title = cleanString(item.title, 50).trim();
  if (!title) return null;
  return {
    id: Number(item.id),
    title,
    location: cleanString(item.location, 160) || "我的空间/研究",
    owner: cleanString(item.owner, 60) || "未知用户",
    createdAt: cleanString(item.createdAt, 40),
    visitedAt: cleanString(item.visitedAt, 40),
    size: cleanString(item.size, 30) || "0 KB",
    kind: item.kind,
    favorite: Boolean(item.favorite),
    owned: Boolean(item.owned),
    shared: Boolean(item.shared),
    description: cleanString(item.description, 500),
    keywords: Array.isArray(item.keywords) ? item.keywords.slice(0, 20).map((keyword) => cleanString(keyword, 60)).filter(Boolean) : [],
    content: cleanString(item.content, 12e4),
    blocks: sanitizeBlocks(item.blocks)
  };
};
const uniqueDocuments = (documents) => {
  const seen2 = /* @__PURE__ */ new Set();
  return documents.filter((documentItem) => {
    if (seen2.has(documentItem.id)) return false;
    seen2.add(documentItem.id);
    return true;
  });
};
const readStoredState = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyStoredState();
    const parsed = JSON.parse(raw);
    if (parsed.version !== STORAGE_VERSION || !Array.isArray(parsed.documents)) return emptyStoredState();
    const documents = uniqueDocuments(parsed.documents.map(sanitizeDocument).filter((item) => Boolean(item)));
    const activeIds = new Set(documents.map((item) => item.id));
    const recycledDocuments = uniqueDocuments(
      (Array.isArray(parsed.recycledDocuments) ? parsed.recycledDocuments : []).map(sanitizeDocument).filter((item) => item != null && !activeIds.has(item.id))
    );
    const recycledIds = new Set(recycledDocuments.map((item) => item.id));
    const deletedDocumentIds = Array.from(new Set(
      (Array.isArray(parsed.deletedDocumentIds) ? parsed.deletedDocumentIds : []).filter((id) => Number.isInteger(id) && id > 0).filter((id) => !activeIds.has(id) && !recycledIds.has(id))
    ));
    return { documents, recycledDocuments, deletedDocumentIds };
  } catch {
    return emptyStoredState();
  }
};
const writeStoredState = (state) => {
  try {
    const serialized = JSON.stringify({ version: STORAGE_VERSION, ...state });
    if (serialized.length > MAX_STORAGE_CHARACTERS) {
      return { ok: false, error: "文档图片占用空间较大，请压缩或删除部分图片后再保存。" };
    }
    window.localStorage.setItem(STORAGE_KEY, serialized);
    return { ok: true };
  } catch {
    return { ok: false, error: "当前浏览器存储空间不足，操作尚未保存。" };
  }
};
const createDocumentBlock = (type) => {
  const id = nextBlockId();
  if (type === "text") {
    return { id, type, text: "", style: "paragraph", bold: false, italic: false, underline: false };
  }
  if (type === "list") return { id, type, ordered: false, items: [""] };
  if (type === "image") return { id, type, src: "", alt: "", caption: "" };
  if (type === "formula") return { id, type, latex: "" };
  if (type === "bookmark") return { id, type, url: "", title: "", description: "" };
  return { id, type: "divider", style: "solid" };
};
const cloneDocumentBlocks = (blocks) => blocks.map((block) => {
  if (block.type === "list") return { ...block, items: [...block.items] };
  return { ...block };
});
const getDocumentBlocks = (documentItem) => {
  const stored = sanitizeBlocks(documentItem.blocks);
  if (stored.length) return cloneDocumentBlocks(stored);
  const block = createDocumentBlock("text");
  block.text = documentItem.content ?? "";
  return [block];
};
const documentBlocksToText = (blocks) => blocks.flatMap((block) => {
  if (block.type === "text") return [block.text];
  if (block.type === "list") return block.items;
  if (block.type === "image") return [block.alt, block.caption];
  if (block.type === "formula") return [block.latex];
  if (block.type === "bookmark") return [block.title, block.description, block.url];
  return [];
}).map((part) => part.trim()).filter(Boolean).join("\n");
const estimateDocumentSize = (blocks) => {
  const bytes = new Blob([JSON.stringify(blocks)]).size;
  if (bytes < 1024) return `${Math.max(1, bytes)} B`;
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
const normalizeHttpUrl = (rawValue) => {
  const trimmed = rawValue.trim();
  if (!trimmed) return null;
  try {
    const candidate = /^[a-z][a-z0-9+.-]*:/i.test(trimmed) ? trimmed : `https://${trimmed}`;
    const url = new URL(candidate);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
};
const loadResearchDocuments = (fallbackDocuments) => {
  if (typeof window === "undefined") return fallbackDocuments;
  const storedState = readStoredState();
  const excludedIds = /* @__PURE__ */ new Set([
    ...storedState.recycledDocuments.map((item) => item.id),
    ...storedState.deletedDocumentIds
  ]);
  const fallbackIds = new Set(fallbackDocuments.map((item) => item.id));
  const storedById = new Map(storedState.documents.map((item) => [item.id, item]));
  const restoredNewDocuments = storedState.documents.filter((item) => !fallbackIds.has(item.id) && !excludedIds.has(item.id));
  const mergedFallbacks = fallbackDocuments.filter((item) => !excludedIds.has(item.id)).map((item) => storedById.get(item.id) ?? item);
  return [...restoredNewDocuments, ...mergedFallbacks];
};
const loadRecycledResearchDocuments = () => {
  if (typeof window === "undefined") return [];
  return readStoredState().recycledDocuments;
};
const persistResearchDocument = (documentItem) => {
  const state = readStoredState();
  return writeStoredState({
    documents: [documentItem, ...state.documents.filter((item) => item.id !== documentItem.id)],
    recycledDocuments: state.recycledDocuments.filter((item) => item.id !== documentItem.id),
    deletedDocumentIds: state.deletedDocumentIds.filter((id) => id !== documentItem.id)
  });
};
const persistRecycledResearchDocument = (documentItem) => {
  const state = readStoredState();
  return writeStoredState({
    documents: state.documents.filter((item) => item.id !== documentItem.id),
    recycledDocuments: [documentItem, ...state.recycledDocuments.filter((item) => item.id !== documentItem.id)],
    deletedDocumentIds: state.deletedDocumentIds.filter((id) => id !== documentItem.id)
  });
};
const removePersistedResearchDocument = (documentId) => {
  const state = readStoredState();
  return writeStoredState({
    documents: state.documents.filter((item) => item.id !== documentId),
    recycledDocuments: state.recycledDocuments.filter((item) => item.id !== documentId),
    deletedDocumentIds: [documentId, ...state.deletedDocumentIds.filter((id) => id !== documentId)]
  });
};
const nextId = (items) => Math.max(0, ...items.map((item) => item.id)) + 1;
const ResearchDocumentEditor = reactExports.lazy(() => __vitePreload(() => import("./ResearchDocumentEditor-C86Msm8q.js"), true ? __vite__mapDeps([0,1]) : void 0, import.meta.url).then((module) => ({ default: module.ResearchDocumentEditor })));
const DataTableWorkspace = reactExports.lazy(() => __vitePreload(() => import("./DataTableWorkspace-C85wU9oT.js"), true ? [] : void 0, import.meta.url).then((module) => ({ default: module.DataTableWorkspace })));
const formatDateTime = (date) => {
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};
const formatLocalDateTime = () => formatDateTime(/* @__PURE__ */ new Date());
const memberCandidates = [
  { id: "member-zhang-1", name: "张三", email: "zhangsan@example.com", date: "2025-12-05", color: "#3e84f5" },
  { id: "member-li-1", name: "李四", email: "lisi@example.com", date: "2025-12-05", color: "#17b981" },
  { id: "member-wang-1", name: "王五", email: "wangwu@example.com", date: "2025-12-02", color: "#8b5ef5" },
  { id: "member-zhao-1", name: "赵六", email: "zhaoliu@example.com", date: "2025-12-02", color: "#f49e14" },
  { id: "member-sun-1", name: "孙七", email: "sunqi@example.com", date: "2025-12-01", color: "#ee4546" },
  { id: "member-zhang-2", name: "张三", email: "zhangsan@example.com", date: "2025-11-28", color: "#3e84f5" },
  { id: "member-li-2", name: "李四", email: "lisi@example.com", date: "2025-11-26", color: "#17b981" },
  { id: "member-wang-2", name: "王五", email: "wangwu@example.com", date: "2025-12-01", color: "#8b5ef5" },
  { id: "member-zhao-2", name: "赵六", email: "zhaoliu@example.com", date: "2025-11-22", color: "#f49e14" },
  { id: "member-sun-2", name: "孙七", email: "sunqi@example.com", date: "2025-11-20", color: "#ee4546" }
];
const defaultInviteSelection = ["member-zhang-1", "member-li-1", "member-zhao-1", "member-sun-1", "member-wang-2"];
const defaultRoles = (ids) => Object.fromEntries(ids.map((id) => [id, "查看员"]));
const currentDataTableHistoryState = () => {
  const state = window.history.state;
  return state && typeof state === "object" ? state : {};
};
const dataTableHistoryState = (value) => ({
  ...currentDataTableHistoryState(),
  ...value
});
const getInitialProduct = () => new URLSearchParams(window.location.search).get("view") === "reading" ? "reading" : "research";
function App() {
  const [activeProduct, setActiveProduct] = reactExports.useState(getInitialProduct);
  const [activeSection, setActiveSection] = reactExports.useState("workbench");
  const [teamTreeExpanded, setTeamTreeExpanded] = reactExports.useState(false);
  const [workbenchTab, setWorkbenchTab] = reactExports.useState("recent");
  const [teamPanelTab, setTeamPanelTab] = reactExports.useState("todo");
  const [documents, setDocuments] = reactExports.useState(() => loadResearchDocuments(initialDocuments));
  const [researchDataTables, setResearchDataTables] = reactExports.useState(() => loadResearchDataTables(initialResearchDataTables));
  const [researchNotes, setResearchNotes] = reactExports.useState(initialResearchNotes);
  const [recycledDocuments, setRecycledDocuments] = reactExports.useState(() => loadRecycledResearchDocuments());
  const [folders, setFolders] = reactExports.useState(initialFolders);
  const [teamFolders, setTeamFolders] = reactExports.useState(initialFolders);
  const [todos, setTodos] = reactExports.useState(initialTodos);
  const [comments, setComments] = reactExports.useState(initialComments);
  const [members, setMembers] = reactExports.useState(initialMembers);
  const [teamNames$1, setTeamNames] = reactExports.useState(teamNames);
  const [activeTeam, setActiveTeam] = reactExports.useState(teamNames[0]);
  const [openFolderName, setOpenFolderName] = reactExports.useState(null);
  const [modal, setModal] = reactExports.useState(null);
  const [searchOpen, setSearchOpen] = reactExports.useState(false);
  const [highlightedDocumentId, setHighlightedDocumentId] = reactExports.useState(null);
  const [activeNoteId, setActiveNoteId] = reactExports.useState(null);
  const [noteDocumentId, setNoteDocumentId] = reactExports.useState(null);
  const [activeDocumentId, setActiveDocumentId] = reactExports.useState(null);
  const [dataTableHubOpen, setDataTableHubOpen] = reactExports.useState(false);
  const [activeDataTableAction, setActiveDataTableAction] = reactExports.useState();
  const [activeDocumentSearchTarget, setActiveDocumentSearchTarget] = reactExports.useState(null);
  const [profile, setProfile] = reactExports.useState(() => loadUserProfile());
  const [page, setPage] = reactExports.useState(1);
  const [toast, setToast] = reactExports.useState("");
  const [isImporting, setIsImporting] = reactExports.useState(false);
  const [importProgress, setImportProgress] = reactExports.useState(0);
  const [importFileName, setImportFileName] = reactExports.useState("");
  const [documentType, setDocumentType] = reactExports.useState("document");
  const [newContentSource, setNewContentSource] = reactExports.useState("space");
  const [dataTableTemplate, setDataTableTemplate] = reactExports.useState("project-progress");
  const [newDocumentTitle, setNewDocumentTitle] = reactExports.useState("");
  const [newDocumentError, setNewDocumentError] = reactExports.useState("");
  const [newDocumentStorageError, setNewDocumentStorageError] = reactExports.useState("");
  const [inviteSelection, setInviteSelection] = reactExports.useState(defaultInviteSelection);
  const [inviteRoles, setInviteRoles] = reactExports.useState(() => defaultRoles(defaultInviteSelection));
  const [teamName, setTeamName] = reactExports.useState("");
  const [teamInviteSelection, setTeamInviteSelection] = reactExports.useState([]);
  const [teamInviteRoles, setTeamInviteRoles] = reactExports.useState({});
  const [teamInviteDraftSelection, setTeamInviteDraftSelection] = reactExports.useState([]);
  const [teamInviteDraftRoles, setTeamInviteDraftRoles] = reactExports.useState({});
  const [teamMemberPickerOpen, setTeamMemberPickerOpen] = reactExports.useState(false);
  const [memberSearch, setMemberSearch] = reactExports.useState("");
  const [createdTeams, setCreatedTeams] = reactExports.useState([]);
  const toastTimer = reactExports.useRef(null);
  const highlightTimer = reactExports.useRef(null);
  const teamNameInputRef = reactExports.useRef(null);
  const newDocumentTitleRef = reactExports.useRef(null);
  const documentIdCounterRef = reactExports.useRef(Math.max(0, ...documents.map((item) => item.id), ...recycledDocuments.map((item) => item.id)) + 1);
  const activeDocumentIdRef = reactExports.useRef(activeDocumentId);
  const dataTableHubOpenRef = reactExports.useRef(dataTableHubOpen);
  const activeDataTableFromHubRef = reactExports.useRef(false);
  const dataTableNavigationGuardRef = reactExports.useRef(null);
  activeDocumentIdRef.current = activeDocumentId;
  dataTableHubOpenRef.current = dataTableHubOpen;
  const registerDataTableNavigationGuard = reactExports.useCallback((guard) => {
    dataTableNavigationGuardRef.current = guard;
  }, []);
  const showToast = (message) => {
    setToast(message);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(""), 2300);
  };
  reactExports.useEffect(() => () => {
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    if (highlightTimer.current) window.clearTimeout(highlightTimer.current);
  }, []);
  reactExports.useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("view", activeProduct);
    window.history.replaceState(window.history.state, "", url);
    document.title = activeProduct === "reading" ? "智能阅读" : "智能科研";
  }, [activeProduct]);
  reactExports.useEffect(() => {
    const openSearchFromKeyboard = (event) => {
      if (activeProduct !== "research" || activeDocumentId !== null || dataTableHubOpen || event.defaultPrevented || modal !== null || searchOpen) return;
      if (!(event.metaKey || event.ctrlKey) || event.key.toLocaleLowerCase() !== "k") return;
      event.preventDefault();
      setSearchOpen(true);
    };
    window.addEventListener("keydown", openSearchFromKeyboard);
    return () => window.removeEventListener("keydown", openSearchFromKeyboard);
  }, [activeDocumentId, activeProduct, dataTableHubOpen, modal, searchOpen]);
  const selectSection = (section) => {
    setActiveSection(section);
    if (section === "team") setTeamTreeExpanded(true);
    setOpenFolderName(null);
    setPage(1);
  };
  const openGlobalSearch = () => {
    setModal(null);
    setSearchOpen(true);
  };
  const openProfileSettings = () => {
    setSearchOpen(false);
    setModal("profile-settings");
  };
  const openDocument = (documentItem, target, dataTableAction, historyMode = "push") => {
    if (documentItem.kind !== "在线文档" && documentItem.kind !== "数据表格") {
      showToast("当前文件类型暂不支持在线打开");
      return;
    }
    const timestamp = formatLocalDateTime();
    const visitedDocument = { ...documentItem, visitedAt: timestamp };
    persistResearchDocument(visitedDocument);
    setDocuments((current) => current.map((item) => item.id === documentItem.id ? visitedDocument : item));
    setSearchOpen(false);
    setModal(null);
    setActiveDocumentSearchTarget(target ? { ...target, documentId: documentItem.id } : null);
    setActiveDataTableAction(documentItem.kind === "数据表格" ? dataTableAction : void 0);
    if (documentItem.kind === "数据表格") {
      const linkedHistoryState = currentDataTableHistoryState();
      const openedFromHub = historyMode === "none" ? Boolean(linkedHistoryState.fromHub) : dataTableHubOpenRef.current;
      activeDataTableFromHubRef.current = openedFromHub;
      const existingTable = researchDataTables.find((item) => item.documentId === documentItem.id);
      if (!existingTable) {
        const blankTable = createBlankResearchDataTable(documentItem.id, "project-progress", profile.name, timestamp);
        const tableResult = persistResearchDataTable(blankTable);
        if (!tableResult.ok) {
          showToast(tableResult.error);
          return;
        }
        setResearchDataTables((current) => [blankTable, ...current]);
      }
      const tableHash = `#table=${documentItem.id}`;
      if (historyMode === "push" && window.location.hash !== tableHash) {
        window.history.pushState(
          dataTableHistoryState({ researchPortalSurface: "data-table", fromHub: openedFromHub, hubEntry: false }),
          "",
          `${window.location.pathname}${window.location.search}${tableHash}`
        );
      }
    }
    activeDocumentIdRef.current = documentItem.id;
    setActiveDocumentId(documentItem.id);
  };
  reactExports.useEffect(() => {
    const syncLinkedDataTableSurface = () => {
      const match = window.location.hash.match(/^#table=(\d+)$/);
      const destinationTableId = match ? Number(match[1]) : null;
      const currentDocumentId = activeDocumentIdRef.current;
      const currentDocument = documents.find((item) => item.id === currentDocumentId);
      const leavingCurrentTable = currentDocument?.kind === "数据表格" && destinationTableId !== currentDocumentId;
      if (leavingCurrentTable && dataTableNavigationGuardRef.current) {
        if (!dataTableNavigationGuardRef.current()) {
          window.history.pushState(
            dataTableHistoryState({
              researchPortalSurface: "data-table",
              fromHub: activeDataTableFromHubRef.current,
              hubEntry: false
            }),
            "",
            `${window.location.pathname}${window.location.search}#table=${currentDocumentId}`
          );
          return;
        }
        dataTableNavigationGuardRef.current = null;
      }
      if (window.location.hash === "#data-tables") {
        setActiveProduct("research");
        setActiveSection("workbench");
        activeDocumentIdRef.current = null;
        setActiveDocumentId(null);
        setActiveDocumentSearchTarget(null);
        setActiveDataTableAction(void 0);
        dataTableHubOpenRef.current = true;
        setDataTableHubOpen(true);
        return;
      }
      if (match) {
        const linkedDocument = documents.find((item) => item.id === destinationTableId && item.kind === "数据表格");
        if (linkedDocument && activeDocumentIdRef.current !== linkedDocument.id) {
          const openedFromHub = Boolean(currentDataTableHistoryState().fromHub);
          dataTableHubOpenRef.current = openedFromHub;
          setDataTableHubOpen(openedFromHub);
          openDocument(linkedDocument, void 0, void 0, "none");
        } else if (!linkedDocument) {
          activeDocumentIdRef.current = null;
          setActiveDocumentId(null);
          setActiveDocumentSearchTarget(null);
          setActiveDataTableAction(void 0);
          dataTableHubOpenRef.current = true;
          setDataTableHubOpen(true);
          window.history.replaceState(
            dataTableHistoryState({ researchPortalSurface: "data-table-hub", fromHub: false, hubEntry: false }),
            "",
            `${window.location.pathname}${window.location.search}#data-tables`
          );
          showToast("该数据表格已不存在，已返回数据表格列表");
        }
        return;
      }
      const activeDocument = documents.find((item) => item.id === activeDocumentIdRef.current);
      if (activeDocument?.kind === "数据表格") {
        activeDocumentIdRef.current = null;
        setActiveDocumentId(null);
        setActiveDocumentSearchTarget(null);
        setActiveDataTableAction(void 0);
      }
      dataTableHubOpenRef.current = false;
      setDataTableHubOpen(false);
    };
    syncLinkedDataTableSurface();
    window.addEventListener("hashchange", syncLinkedDataTableSurface);
    window.addEventListener("popstate", syncLinkedDataTableSurface);
    return () => {
      window.removeEventListener("hashchange", syncLinkedDataTableSurface);
      window.removeEventListener("popstate", syncLinkedDataTableSurface);
    };
  }, [documents, profile.name, researchDataTables]);
  const closeActiveDocument = () => {
    dataTableNavigationGuardRef.current = null;
    if (/^#table=\d+$/.test(window.location.hash)) {
      const historyState = currentDataTableHistoryState();
      if (historyState.researchPortalSurface === "data-table") {
        window.history.back();
        return;
      } else {
        window.history.replaceState(
          dataTableHubOpen ? dataTableHistoryState({ researchPortalSurface: "data-table-hub", fromHub: false, hubEntry: false }) : null,
          "",
          `${window.location.pathname}${window.location.search}${dataTableHubOpen ? "#data-tables" : ""}`
        );
      }
    }
    activeDocumentIdRef.current = null;
    setActiveDocumentId(null);
    setActiveDocumentSearchTarget(null);
    setActiveDataTableAction(void 0);
  };
  const saveDocumentContent = (value) => {
    if (activeDocumentId == null) return "无法确认当前文档，请返回列表后重试。";
    const target = documents.find((item) => item.id === activeDocumentId);
    if (!target) return "文档已不存在，请返回列表刷新后重试。";
    const timestamp = formatLocalDateTime();
    const nextDocument = {
      ...target,
      title: value.title,
      blocks: value.blocks,
      content: value.content,
      size: value.size,
      visitedAt: timestamp,
      description: value.content.trim() ? value.content.trim().replace(/\s+/g, " ").slice(0, 120) : "空白在线文档，尚未添加内容摘要。"
    };
    const result = persistResearchDocument(nextDocument);
    if (!result.ok) return result.error;
    setDocuments((current) => current.map((item) => item.id === activeDocumentId ? nextDocument : item));
    return null;
  };
  const saveDataTableContent = (value) => {
    if (activeDocumentId == null) return "无法确认当前数据表格，请返回列表后重试。";
    const target = documents.find((item) => item.id === activeDocumentId);
    if (!target || target.kind !== "数据表格") return "数据表格已不存在，请返回列表刷新后重试。";
    if (value.table.documentId !== target.id) return "检测到表格与文档不匹配，已阻止保存，请返回列表后重新打开。";
    const previousTable = researchDataTables.find((item) => item.documentId === target.id);
    const tableResult = persistResearchDataTable(value.table);
    if (!tableResult.ok) return tableResult.error;
    const timestamp = formatLocalDateTime();
    const searchText = getResearchDataTableSearchText(value.table);
    const nextDocument = {
      ...target,
      title: value.title,
      visitedAt: timestamp,
      size: estimateResearchDataTableSize(value.table),
      shared: value.table.share.access !== "private",
      description: value.table.rows.length ? `包含 ${value.table.rows.length} 条科研记录、${value.table.columns.length} 个字段和 ${value.table.attachments.length} 个数据文件。` : "空白数据表格，尚未添加科研记录。",
      content: searchText.slice(0, 8e4),
      keywords: Array.from(/* @__PURE__ */ new Set([
        "数据表格",
        value.table.template === "project-progress" ? "项目进度" : "科研数据",
        ...value.table.columns.map((column) => column.name)
      ])).slice(0, 24)
    };
    const documentResult = persistResearchDocument(nextDocument);
    if (!documentResult.ok) {
      const rollbackResult = previousTable ? persistResearchDataTable(previousTable) : removeResearchDataTable(value.table.documentId);
      return rollbackResult.ok ? `${documentResult.error} 表格数据已回滚，可修正后重试。` : `${documentResult.error} 表格索引同步失败，请先导出备份后再刷新。`;
    }
    setResearchDataTables((current) => [
      value.table,
      ...current.filter((item) => item.documentId !== value.table.documentId)
    ]);
    setDocuments((current) => current.map((item) => item.id === activeDocumentId ? nextDocument : item));
    return null;
  };
  const openNewDocumentDialog = () => {
    setNewContentSource("space");
    setDocumentType("document");
    setDataTableTemplate("project-progress");
    setNewDocumentTitle("");
    setNewDocumentError("");
    setNewDocumentStorageError("");
    setModal("new-document");
  };
  const openNewDataTableDialog = () => {
    setNewContentSource("data-hub");
    setDocumentType("sheet");
    setDataTableTemplate("project-progress");
    setNewDocumentTitle("");
    setNewDocumentError("");
    setNewDocumentStorageError("");
    setModal("new-document");
  };
  const openDataTableHub = () => {
    setActiveProduct("research");
    setActiveSection("workbench");
    setOpenFolderName(null);
    setSearchOpen(false);
    setModal(null);
    setDataTableHubOpen(true);
    if (window.location.hash !== "#data-tables") {
      window.history.pushState(
        dataTableHistoryState({ researchPortalSurface: "data-table-hub", fromHub: false, hubEntry: true }),
        "",
        `${window.location.pathname}${window.location.search}#data-tables`
      );
    }
  };
  const closeDataTableHub = () => {
    setDataTableHubOpen(false);
    if (window.location.hash === "#data-tables") {
      if (currentDataTableHistoryState().hubEntry) {
        window.history.back();
      } else {
        window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
      }
    }
  };
  const openHubTable = (target, action) => {
    if (!target.documentItem) {
      showToast("该表格缺少索引信息，暂时无法打开");
      return;
    }
    openDocument(target.documentItem, void 0, action);
  };
  const locateDocument = (documentItem) => {
    if (documentItem.kind === "数据表格") {
      openDataTableHub();
      showToast(`已在科研数据管理中定位“${documentItem.title}”`);
      return;
    }
    setSearchOpen(false);
    setModal(null);
    setActiveProduct("research");
    setActiveSection("workbench");
    setWorkbenchTab("recent");
    setOpenFolderName(null);
    setPage(1);
    setHighlightedDocumentId(documentItem.id);
    if (highlightTimer.current) window.clearTimeout(highlightTimer.current);
    highlightTimer.current = window.setTimeout(() => setHighlightedDocumentId(null), 2800);
    showToast(`已定位“${documentItem.title}”`);
  };
  const openNoteDetail = (note) => {
    setSearchOpen(false);
    setActiveNoteId(note.id);
    setNoteDocumentId(note.documentId);
    setModal("note-detail");
  };
  const saveProfile = (nextProfile) => {
    const result = saveUserProfile(nextProfile);
    if (!result.ok) return result.error;
    setProfile(nextProfile);
    setModal(null);
    showToast("个人信息已保存");
    return null;
  };
  const toggleTeamTree = () => {
    if (activeSection !== "team") {
      selectSection("team");
      return;
    }
    setTeamTreeExpanded((expanded) => !expanded);
  };
  const standardDocuments = reactExports.useMemo(
    () => documents.filter((documentItem) => documentItem.kind !== "数据表格"),
    [documents]
  );
  const activeDataTableDocuments = reactExports.useMemo(
    () => documents.filter((documentItem) => documentItem.kind === "数据表格"),
    [documents]
  );
  const hubDataTables = reactExports.useMemo(() => {
    const activeIds = new Set(activeDataTableDocuments.map((documentItem) => documentItem.id));
    return researchDataTables.filter((table) => activeIds.has(table.documentId));
  }, [activeDataTableDocuments, researchDataTables]);
  const visibleDocuments = reactExports.useMemo(() => {
    if (activeSection !== "workbench") return standardDocuments;
    if (workbenchTab === "favorites") return standardDocuments.filter((documentItem) => documentItem.favorite);
    if (workbenchTab === "owned") return standardDocuments.filter((documentItem) => documentItem.owned);
    if (workbenchTab === "shared") return standardDocuments.filter((documentItem) => documentItem.shared && !documentItem.owned);
    return [...standardDocuments].sort((first, second) => second.visitedAt.localeCompare(first.visitedAt));
  }, [activeSection, standardDocuments, workbenchTab]);
  const toggleFavorite = (id) => {
    const target = documents.find((doc) => doc.id === id);
    if (!target) return;
    const nextDocument = { ...target, favorite: !target.favorite };
    const result = persistResearchDocument(nextDocument);
    if (!result.ok) {
      showToast(result.error);
      return;
    }
    setDocuments((current) => current.map((doc) => doc.id === id ? nextDocument : doc));
    showToast("收藏状态已更新");
  };
  const deleteDocument = (id) => {
    const target = documents.find((doc) => doc.id === id);
    if (!target) return;
    const recycledDocument = { ...target, visitedAt: formatLocalDateTime() };
    const result = persistRecycledResearchDocument(recycledDocument);
    if (!result.ok) {
      showToast(result.error);
      return;
    }
    setDocuments((current) => current.filter((doc) => doc.id !== id));
    setRecycledDocuments((current) => [recycledDocument, ...current.filter((doc) => doc.id !== id)]);
    showToast(target.kind === "数据表格" ? "数据表格已移入回收站" : "文档已移入回收站");
  };
  const permanentlyDeleteDocument = (id) => {
    const target = recycledDocuments.find((doc) => doc.id === id);
    if (!target || !window.confirm(`彻底删除“${target.title}”？该操作无法恢复。`)) return;
    const result = removePersistedResearchDocument(id);
    if (!result.ok) {
      showToast(result.error);
      return;
    }
    setRecycledDocuments((current) => current.filter((doc) => doc.id !== id));
    setResearchNotes((current) => current.filter((note) => note.documentId !== id));
    if (target.kind === "数据表格") {
      const tableResult = removeResearchDataTable(id);
      if (!tableResult.ok) {
        showToast(`文档已删除，但表格缓存清理失败：${tableResult.error}`);
        return;
      }
      setResearchDataTables((current) => current.filter((table) => table.documentId !== id));
    }
    showToast("文档已彻底删除");
  };
  const restoreDocument = (id) => {
    const target = recycledDocuments.find((doc) => doc.id === id);
    if (!target) return;
    const result = persistResearchDocument(target);
    if (!result.ok) {
      showToast(result.error);
      return;
    }
    setRecycledDocuments((current) => current.filter((doc) => doc.id !== id));
    setDocuments((current) => [target, ...current.filter((doc) => doc.id !== id)]);
    showToast("文档已恢复");
  };
  const shareDocument = (id) => {
    const target = documents.find((doc) => doc.id === id);
    if (!target) return;
    const nextDocument = { ...target, shared: true };
    let nextDataTable;
    let previousDataTable;
    if (target.kind === "数据表格") {
      previousDataTable = researchDataTables.find((table) => table.documentId === id);
      if (!previousDataTable) {
        showToast("无法读取数据表格，请先打开表格后重试");
        return;
      }
      const timestamp = formatLocalDateTime();
      const fallbackCollaborators = members.map((member) => member.name).filter((name) => name !== profile.name);
      nextDataTable = {
        ...previousDataTable,
        share: {
          access: previousDataTable.share.access === "private" ? "team-view" : previousDataTable.share.access,
          collaborators: previousDataTable.share.collaborators.length ? previousDataTable.share.collaborators : fallbackCollaborators,
          updatedAt: timestamp,
          updatedBy: profile.name
        },
        updatedAt: timestamp,
        updatedBy: profile.name
      };
      const tableResult = persistResearchDataTable(nextDataTable);
      if (!tableResult.ok) {
        showToast(tableResult.error);
        return;
      }
    }
    const result = persistResearchDocument(nextDocument);
    if (!result.ok) {
      const rollbackResult = previousDataTable ? persistResearchDataTable(previousDataTable) : null;
      showToast(rollbackResult && !rollbackResult.ok ? `${result.error} 表格共享状态回滚失败，请打开表格核对权限。` : result.error);
      return;
    }
    if (nextDataTable) {
      setResearchDataTables((current) => current.map((table) => table.documentId === id ? nextDataTable : table));
    }
    setDocuments((current) => current.map((doc) => doc.id === id ? nextDocument : doc));
    showToast(`已共享到${activeTeam}`);
  };
  const renameDocument = (id, title) => {
    const target = documents.find((doc) => doc.id === id);
    if (!target) return;
    const normalizedTitle = title.normalize("NFC").trim();
    if (!normalizedTitle || Array.from(normalizedTitle).length > 50) {
      showToast("文档名称应为 1 至 50 个字符");
      return;
    }
    const nextDocument = { ...target, title: normalizedTitle };
    const result = persistResearchDocument(nextDocument);
    if (!result.ok) {
      showToast(result.error);
      return;
    }
    setDocuments((current) => current.map((doc) => doc.id === id ? nextDocument : doc));
    showToast("文档已重命名");
  };
  const createDocumentNote = (documentItem) => {
    setActiveNoteId(null);
    setNoteDocumentId(documentItem.id);
    setModal("note-editor");
  };
  const saveResearchNote = (value) => {
    if (noteDocumentId == null) return;
    const timestamp = formatLocalDateTime();
    const noteId = activeNoteId ?? nextId(researchNotes);
    setResearchNotes((current) => activeNoteId == null ? [{ id: noteId, documentId: noteDocumentId, createdAt: timestamp, updatedAt: timestamp, ...value }, ...current] : current.map((note) => note.id === activeNoteId ? { ...note, ...value, updatedAt: timestamp } : note));
    setActiveNoteId(noteId);
    setModal("note-detail");
    showToast(activeNoteId == null ? "笔记已保存，可通过全文搜索找到" : "笔记修改已保存");
  };
  const submitTodo = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get("todoTitle") ?? "").trim();
    const due = String(form.get("todoDue") ?? "");
    const level = String(form.get("todoLevel") ?? "warning");
    if (!title || !due) return;
    setTodos((current) => [...current, { id: nextId(current), title, due, level, done: false }]);
    setModal(null);
    showToast("待办已添加");
  };
  const addComment = (content, attachment, replyTo, parentCommentId) => {
    setComments((current) => [...current, {
      id: nextId(current),
      author: profile.name,
      content,
      time: "刚刚",
      attachment,
      replyTo,
      parentCommentId
    }]);
    showToast("评论发送成功");
  };
  const submitNewFolder = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("folderName") ?? "").trim();
    if (!name) return;
    const setter = activeSection === "team" ? setTeamFolders : setFolders;
    setter((current) => [...current, { id: nextId(current), name, count: 0, updatedAt: "2026-05-08 16:20" }]);
    if (activeSection === "team") setCreatedTeams((current) => current.filter((team) => team !== activeTeam));
    setModal(null);
    showToast(`文件夹“${name}”创建成功`);
  };
  const submitNewDocument = (event) => {
    event.preventDefault();
    setNewDocumentStorageError("");
    const title = newDocumentTitle.normalize("NFC").trim();
    if (!title) {
      setNewDocumentError("请输入文档名称。");
      newDocumentTitleRef.current?.focus();
      return;
    }
    const timestamp = formatLocalDateTime();
    const documentId = documentIdCounterRef.current;
    documentIdCounterRef.current += 1;
    const createdDocument = {
      id: documentId,
      title,
      location: newContentSource === "data-hub" ? "科研数据管理/全部数据表" : activeSection === "team" ? `${activeTeam}/${openFolderName ?? "文档"}` : `我的空间/${openFolderName ?? "研究"}`,
      owner: profile.name,
      createdAt: timestamp,
      visitedAt: timestamp,
      size: "0 KB",
      kind: documentType === "document" ? "在线文档" : "数据表格",
      favorite: false,
      owned: true,
      shared: activeSection === "team",
      description: documentType === "document" ? "空白在线文档，尚未添加内容摘要。" : "新建的数据表格。",
      keywords: [],
      content: "",
      blocks: documentType === "document" ? [createDocumentBlock("text")] : void 0
    };
    const documentResult = persistResearchDocument(createdDocument);
    if (!documentResult.ok) {
      setNewDocumentStorageError(documentResult.error);
      return;
    }
    let createdDataTable = null;
    if (createdDocument.kind === "数据表格") {
      createdDataTable = createBlankResearchDataTable(documentId, dataTableTemplate, profile.name, timestamp);
      if (activeSection === "team") {
        createdDataTable = {
          ...createdDataTable,
          share: {
            access: "team-edit",
            collaborators: members.map((member) => member.name).filter((name) => name !== profile.name),
            updatedAt: timestamp,
            updatedBy: profile.name
          }
        };
      }
      const tableResult = persistResearchDataTable(createdDataTable);
      if (!tableResult.ok) {
        const rollbackResult = removePersistedResearchDocument(documentId);
        setNewDocumentStorageError(rollbackResult.ok ? tableResult.error : `${tableResult.error} 新建文档索引清理失败，请返回列表刷新后重试。`);
        return;
      }
      setResearchDataTables((current) => [createdDataTable, ...current]);
    }
    setDocuments((current) => [createdDocument, ...current]);
    if (activeSection === "team") setCreatedTeams((current) => current.filter((team) => team !== activeTeam));
    setModal(null);
    setNewDocumentTitle("");
    setNewDocumentError("");
    setNewDocumentStorageError("");
    setActiveDocumentId(createdDocument.id);
    if (createdDocument.kind === "数据表格") {
      window.history.pushState(
        dataTableHistoryState({ researchPortalSurface: "data-table", fromHub: dataTableHubOpen }),
        "",
        `${window.location.pathname}${window.location.search}#table=${createdDocument.id}`
      );
      showToast(`数据表格“${title}”已创建，已进入编辑`);
    } else showToast(`在线文档“${title}”已创建`);
  };
  const submitImport = (event) => {
    event.preventDefault();
    if (!importFileName || isImporting) return;
    setImportProgress(55);
    setIsImporting(true);
  };
  const submitNewTeam = (event) => {
    event.preventDefault();
    const name = teamName.trim();
    if (!name) {
      teamNameInputRef.current?.focus();
      return;
    }
    if (!teamInviteSelection.length) {
      setTeamInviteDraftSelection([]);
      setTeamInviteDraftRoles({});
      setMemberSearch("");
      setTeamMemberPickerOpen(true);
      return;
    }
    const selectedMembers = memberCandidates.filter((candidate) => teamInviteSelection.includes(candidate.id));
    setTeamNames((current) => [...current, name]);
    setCreatedTeams((current) => [...current, name]);
    setMembers(selectedMembers.map((candidate, index) => ({
      id: index + 1,
      name: candidate.name,
      role: teamInviteRoles[candidate.id] ?? "查看员",
      initials: candidate.name.slice(0, 1),
      color: candidate.color,
      status: "在线",
      joinedAt: candidate.date
    })));
    setActiveTeam(name);
    setActiveSection("team");
    setTeamPanelTab("members");
    setTeamName("");
    setTeamInviteSelection([]);
    setTeamInviteRoles({});
    setTeamMemberPickerOpen(false);
    setModal(null);
    showToast(`团队空间“${name}”创建成功`);
  };
  const openTeamMemberPicker = () => {
    setTeamInviteDraftSelection(teamInviteSelection);
    setTeamInviteDraftRoles(teamInviteRoles);
    setMemberSearch("");
    setTeamMemberPickerOpen(true);
  };
  const cancelTeamMemberPicker = () => {
    setTeamMemberPickerOpen(false);
    setMemberSearch("");
  };
  const submitTeamMemberPicker = (event) => {
    event.preventDefault();
    setTeamInviteSelection(teamInviteDraftSelection);
    setTeamInviteRoles(teamInviteDraftRoles);
    setTeamMemberPickerOpen(false);
    setMemberSearch("");
  };
  const submitInvite = (event) => {
    event.preventDefault();
    const selected = memberCandidates.filter((candidate) => inviteSelection.includes(candidate.id));
    if (!selected.length) return;
    setMembers((current) => [
      ...current,
      ...selected.filter((candidate) => !current.some((member) => member.name === candidate.name)).map((candidate, index) => ({
        id: nextId(current) + index,
        name: candidate.name,
        role: inviteRoles[candidate.id] ?? "查看员",
        initials: candidate.name.slice(0, 1),
        color: candidate.color,
        status: "在线",
        joinedAt: candidate.date
      }))
    ]);
    setModal(null);
    setTeamPanelTab("members");
    showToast(`已邀请 ${selected.length} 位成员`);
  };
  const renameFolder = (id, name) => {
    const setter = activeSection === "team" ? setTeamFolders : setFolders;
    setter((current) => current.map((folder) => folder.id === id ? { ...folder, name } : folder));
    showToast("文件夹已重命名");
  };
  const deleteFolder = (id) => {
    const setter = activeSection === "team" ? setTeamFolders : setFolders;
    setter((current) => current.filter((folder) => folder.id !== id));
    showToast("文件夹已删除");
  };
  const activeResearchNote = activeNoteId == null ? void 0 : researchNotes.find((note) => note.id === activeNoteId);
  const noteDocument = noteDocumentId == null ? void 0 : documents.find((documentItem) => documentItem.id === noteDocumentId);
  const activeEditingDocument = activeDocumentId == null ? void 0 : documents.find((documentItem) => documentItem.id === activeDocumentId);
  const activeEditingDataTable = activeEditingDocument?.kind === "数据表格" ? researchDataTables.find((table) => table.documentId === activeEditingDocument.id) : void 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: `app-stage${activeProduct === "reading" ? " app-stage--reading" : ""}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ambient ambient--left", "aria-hidden": "true" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ambient ambient--top", "aria-hidden": "true" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "app-shell", "aria-hidden": activeEditingDocument || dataTableHubOpen ? true : void 0, inert: activeEditingDocument || dataTableHubOpen ? true : void 0, children: activeProduct === "reading" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      ReadingWorkspace,
      {
        onSwitchToResearch: () => setActiveProduct("research"),
        onProfileOpen: openProfileSettings,
        profileName: profile.name,
        profileAvatar: profile.avatarDataUrl
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        TopNavigation,
        {
          activeSection,
          onSelect: selectSection,
          onReadingSelect: () => {
            setModal(null);
            setSearchOpen(false);
            setActiveProduct("reading");
          },
          onSearchOpen: openGlobalSearch,
          onProfileOpen: openProfileSettings,
          profileName: profile.name,
          profileAvatar: profile.avatarDataUrl
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `workspace-grid${activeSection === "team" ? " workspace-grid--team" : ""}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Sidebar,
          {
            activeSection,
            activeTeam,
            teamNames: teamNames$1,
            teamTreeExpanded,
            onSectionSelect: selectSection,
            onTeamTreeToggle: toggleTeamTree,
            onTeamSelect: (team) => {
              setActiveTeam(team);
              setTeamTreeExpanded(true);
              setOpenFolderName(null);
            },
            onNewTeam: () => {
              setTeamName("");
              setTeamInviteSelection([]);
              setTeamInviteRoles({});
              setTeamMemberPickerOpen(false);
              setModal("new-team");
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "main-pane", children: [
          activeSection === "workbench" && /* @__PURE__ */ jsxRuntimeExports.jsx(
            WorkspaceView,
            {
              documents: visibleDocuments,
              tab: workbenchTab,
              page,
              onTabChange: (tab) => {
                setWorkbenchTab(tab);
                setPage(1);
              },
              onPageChange: setPage,
              onToggleFavorite: toggleFavorite,
              onDelete: deleteDocument,
              onShare: shareDocument,
              onOpenDocument: openDocument,
              onOpenDataTableHub: openDataTableHub,
              dataTableCount: hubDataTables.length,
              dataRecordCount: hubDataTables.reduce((total, table) => total + table.rows.length, 0),
              highlightedDocumentId
            }
          ),
          activeSection === "personal" && /* @__PURE__ */ jsxRuntimeExports.jsx(
            SpaceView,
            {
              mode: "personal",
              folders,
              documents: standardDocuments,
              openFolderName,
              page,
              onPageChange: setPage,
              onOpenFolder: (folder) => setOpenFolderName(folder.name),
              onRenameFolder: renameFolder,
              onDeleteFolder: deleteFolder,
              onBack: () => setOpenFolderName(null),
              onNewFolder: () => setModal("new-folder"),
              onNewDocument: openNewDocumentDialog,
              onImportDocument: () => setModal("import-document"),
              onToggleFavorite: toggleFavorite,
              onDelete: deleteDocument,
              onShare: shareDocument,
              onRenameDocument: renameDocument,
              onCreateNote: createDocumentNote,
              onOpenDocument: openDocument
            }
          ),
          activeSection === "team" && /* @__PURE__ */ jsxRuntimeExports.jsx(
            SpaceView,
            {
              mode: "team",
              teamName: activeTeam,
              folders: createdTeams.includes(activeTeam) ? [] : teamFolders,
              documents: createdTeams.includes(activeTeam) ? [] : standardDocuments,
              openFolderName,
              page,
              onPageChange: setPage,
              onOpenFolder: (folder) => setOpenFolderName(folder.name),
              onRenameFolder: renameFolder,
              onDeleteFolder: deleteFolder,
              onBack: () => setOpenFolderName(null),
              onNewFolder: () => setModal("new-folder"),
              onNewDocument: openNewDocumentDialog,
              onImportDocument: () => setModal("import-document"),
              onToggleFavorite: toggleFavorite,
              onDelete: deleteDocument,
              onShare: shareDocument,
              onRenameDocument: renameDocument,
              onCreateNote: createDocumentNote,
              onOpenDocument: openDocument,
              emptyTeam: createdTeams.includes(activeTeam)
            }
          ),
          activeSection === "recycle" && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "view view--recycle", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "view-header", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "title-accent" }),
              "回收站"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "view-body recycle-body", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "recycle-note", children: "回收站中的内容将在 30 天后自动清除" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                DocumentTable,
                {
                  documents: recycledDocuments,
                  mode: "recycle",
                  page,
                  onPageChange: setPage,
                  onToggleFavorite: () => void 0,
                  onDelete: permanentlyDeleteDocument,
                  onShare: () => void 0,
                  onRestore: restoreDocument
                }
              )
            ] })
          ] })
        ] }),
        activeSection === "team" && /* @__PURE__ */ jsxRuntimeExports.jsx(
          TeamPanel,
          {
            tab: teamPanelTab,
            todos,
            comments,
            members,
            onTabChange: setTeamPanelTab,
            onToggleTodo: (id) => setTodos((current) => current.map((todo) => todo.id === id ? { ...todo, done: !todo.done } : todo)),
            onDeleteTodo: (id) => setTodos((current) => current.filter((todo) => todo.id !== id)),
            onAddTodoRequest: () => setModal("add-todo"),
            onAddComment: addComment,
            onInvite: () => {
              setInviteSelection(defaultInviteSelection);
              setInviteRoles(defaultRoles(defaultInviteSelection));
              setMemberSearch("");
              setModal("invite-member");
            },
            onMemberRoleChange: (id, role) => setMembers((current) => current.map((member) => member.id === id ? { ...member, role } : member)),
            onRemoveMember: (id) => setMembers((current) => current.filter((member) => member.id !== id))
          }
        )
      ] })
    ] }) }),
    dataTableHubOpen && !activeEditingDocument && /* @__PURE__ */ jsxRuntimeExports.jsx(
      DataTableHub,
      {
        documents: activeDataTableDocuments,
        tables: hubDataTables,
        currentUser: profile.name,
        suspended: modal !== null,
        onClose: closeDataTableHub,
        onOpenTable: (target) => openHubTable(target),
        onCreateTable: openNewDataTableDialog,
        onImportToTable: (target) => openHubTable(target, "import"),
        onShareTable: (target) => openHubTable(target, "share"),
        onMoveToRecycle: (target) => deleteDocument(target.documentId)
      }
    ),
    activeEditingDocument?.kind === "在线文档" && /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "document-editor-loading", role: "status", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "正在打开文档编辑器…" })
    ] }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      ResearchDocumentEditor,
      {
        documentItem: activeEditingDocument,
        initialBlockId: activeDocumentSearchTarget?.documentId === activeEditingDocument.id ? activeDocumentSearchTarget.blockId : void 0,
        initialSearchQuery: activeDocumentSearchTarget?.documentId === activeEditingDocument.id ? activeDocumentSearchTarget.query : void 0,
        onClose: closeActiveDocument,
        onSave: saveDocumentContent
      }
    ) }),
    activeEditingDocument?.kind === "数据表格" && activeEditingDataTable && /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "document-editor-loading", role: "status", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "正在打开数据表格…" })
    ] }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      DataTableWorkspace,
      {
        documentItem: activeEditingDocument,
        table: activeEditingDataTable,
        currentUser: profile.name,
        teamName: activeTeam,
        collaboratorOptions: Array.from(new Set([
          ...activeEditingDataTable.share.collaborators,
          ...members.map((member) => member.name)
        ].filter((name) => name !== profile.name))),
        initialSearchQuery: activeDocumentSearchTarget?.documentId === activeEditingDocument.id ? activeDocumentSearchTarget.query : void 0,
        initialAction: activeDataTableAction,
        onClose: closeActiveDocument,
        onSave: saveDataTableContent,
        onToast: showToast,
        onNavigationGuardChange: registerDataTableNavigationGuard
      },
      `data-table-workspace-${activeEditingDocument.id}`
    ) }),
    searchOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
      GlobalSearchDialog,
      {
        documents,
        notes: researchNotes,
        onClose: () => setSearchOpen(false),
        onOpenDocument: openDocument,
        onLocateDocument: locateDocument,
        onOpenNote: openNoteDetail
      }
    ),
    modal === "profile-settings" && /* @__PURE__ */ jsxRuntimeExports.jsx(
      ProfileSettingsModal,
      {
        profile,
        onClose: () => setModal(null),
        onSave: saveProfile
      }
    ),
    modal === "note-detail" && activeResearchNote && noteDocument && /* @__PURE__ */ jsxRuntimeExports.jsx(
      NoteDetailDialog,
      {
        note: activeResearchNote,
        documentItem: noteDocument,
        onClose: () => setModal(null),
        onEdit: () => setModal("note-editor"),
        onOpenDocument: () => openDocument(noteDocument)
      }
    ),
    modal === "note-editor" && noteDocument && /* @__PURE__ */ jsxRuntimeExports.jsx(
      NoteEditorDialog,
      {
        note: activeResearchNote,
        documentItem: noteDocument,
        onClose: () => setModal(activeResearchNote ? "note-detail" : null),
        onSave: saveResearchNote
      }
    ),
    activeProduct === "research" && modal === "new-folder" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Modal, { title: "新建文件夹", onClose: () => setModal(null), onSubmit: submitNewFolder, confirmText: "确定", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "field-label", htmlFor: "folder-name", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "required-mark", children: "*" }),
        " 文件夹名称："
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "text-field", id: "folder-name", name: "folderName", autoFocus: true, maxLength: 30, placeholder: "请输入" })
    ] }),
    activeProduct === "research" && modal === "new-document" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Modal, { title: newContentSource === "data-hub" ? "新建数据表格" : "新建在线文档", onClose: () => {
      setModal(null);
      setNewDocumentError("");
      setNewDocumentStorageError("");
    }, onSubmit: submitNewDocument, confirmText: "创建并编辑", children: [
      newDocumentStorageError && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "field-error", role: "alert", children: newDocumentStorageError }),
      newContentSource === "space" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "field-label", children: "内容类型：" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "document-type-list", "aria-label": "在线文档类型", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", className: "is-selected", "aria-pressed": "true", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { className: "document-type-icon", src: "./assets/document-word.svg", alt: "" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "在线文档" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: "创建支持富文本编辑的科研笔记文档" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { className: "document-type-check", src: "./assets/selected-check.svg", alt: "" })
        ] }) })
      ] }),
      newContentSource === "data-hub" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "data-sheet-modal-intro", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "统一纳入科研数据管理" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "创建后可集中管理记录、导入文件和共享权限。" })
      ] }),
      documentType === "sheet" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "field-label", children: "数据表格模板：" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "data-sheet-template-options", role: "radiogroup", "aria-label": "数据表格模板", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", role: "radio", "aria-checked": dataTableTemplate === "project-progress", className: dataTableTemplate === "project-progress" ? "is-selected" : "", onClick: () => setDataTableTemplate("project-progress"), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { className: "data-sheet-template-icon", src: "./assets/iconpark/grid-nine.svg", alt: "" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "项目进度管理" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: "任务、负责人、状态、进度和截止时间" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", role: "radio", "aria-checked": dataTableTemplate === "research-data", className: dataTableTemplate === "research-data" ? "is-selected" : "", onClick: () => setDataTableTemplate("research-data"), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { className: "data-sheet-template-icon", src: "./assets/iconpark/form-one.svg", alt: "" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "科研数据收集" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: "样本、类型、结果、单位和采集时间" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "field-label", htmlFor: "document-title", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "required-mark", children: "*" }),
        " ",
        documentType === "sheet" ? "表格名称" : "文档名称",
        "："
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          ref: newDocumentTitleRef,
          className: "text-field",
          id: "document-title",
          name: "documentTitle",
          value: newDocumentTitle,
          autoFocus: true,
          maxLength: 50,
          "aria-invalid": Boolean(newDocumentError),
          "aria-describedby": newDocumentError ? "new-document-title-error" : void 0,
          placeholder: "请输入",
          onChange: (event) => {
            setNewDocumentTitle(event.target.value);
            setNewDocumentError("");
            setNewDocumentStorageError("");
          }
        }
      ),
      newDocumentError && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "field-error", id: "new-document-title-error", children: newDocumentError })
    ] }),
    activeProduct === "research" && modal === "import-document" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Modal,
      {
        title: "导入文档",
        onClose: () => {
          if (!isImporting) setModal(null);
        },
        onSubmit: submitImport,
        confirmText: "确定",
        confirmDisabled: !importFileName,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: `upload-zone${importFileName ? " has-file" : ""}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "upload-icon", "aria-hidden": "true" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "点击或拖拽文件到此处上传" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: "支持Word、Pdf格式文件" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", accept: ".pdf,.doc,.docx", onChange: (event) => setImportFileName(event.target.files?.[0]?.name ?? "") })
          ] }),
          isImporting && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "import-file-list", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "import-file-row is-progress", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "./assets/reading/pdf.svg", alt: "" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "高离子电导率硫化物固态电解质的界面稳定化策略.pdf" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: "共15页｜15.8M" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("i", { style: { width: `${importProgress}%` } }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("b", { children: [
                importProgress,
                "%"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "import-file-row", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "./assets/reading/docx.svg", alt: "" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "锂硫电池中多硫化物穿梭效应的抑制机制研究：基...docx" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: "共18页｜12.5M" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", "aria-label": "移除待导入文档", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true" }) })
            ] })
          ] })
        ]
      }
    ),
    activeProduct === "research" && modal === "add-todo" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Modal, { title: "添加待办", onClose: () => setModal(null), onSubmit: submitTodo, confirmText: "确定", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "field-label", htmlFor: "todo-level", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "required-mark", children: "*" }),
        " 紧急程度："
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "text-field", id: "todo-level", name: "todoLevel", defaultValue: "warning", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "danger", children: "高" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "warning", children: "中" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "muted", children: "低" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "field-label", htmlFor: "todo-title", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "required-mark", children: "*" }),
        " 待办事项："
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "text-field", id: "todo-title", name: "todoTitle", defaultValue: "完成固态电解质论文初稿" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "field-label", htmlFor: "todo-due", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "required-mark", children: "*" }),
        " 截止时间："
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "text-field", id: "todo-due", name: "todoDue", type: "date", defaultValue: "2024-06-28" })
    ] }),
    activeProduct === "research" && modal === "new-team" && !teamMemberPickerOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Modal,
      {
        title: "新建团队空间",
        onClose: () => {
          setTeamMemberPickerOpen(false);
          setModal(null);
        },
        onSubmit: submitNewTeam,
        confirmText: "确定",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "field-label", htmlFor: "team-name", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "required-mark", children: "*" }),
            " 空间名称："
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              className: "text-field",
              id: "team-name",
              ref: teamNameInputRef,
              value: teamName,
              onChange: (event) => setTeamName(event.target.value),
              autoFocus: true,
              maxLength: 30,
              placeholder: "请输入"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "field-label", id: "team-invite-label", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "required-mark", children: "*" }),
            " 邀请成员："
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "invite-compound", id: "team-invite", role: "group", "aria-labelledby": "team-invite-label", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "invite-compound-content", children: teamInviteSelection.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "invite-placeholder", children: "请输入" }) : memberCandidates.filter((candidate) => teamInviteSelection.includes(candidate.id)).map((candidate) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "invite-chip", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("i", { style: { background: candidate.color }, children: candidate.name[0] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: candidate.name })
            ] }, candidate.id)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", "aria-label": "选择邀请成员", onClick: openTeamMemberPicker, children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "./assets/figma/add-member.svg", alt: "" }) })
          ] })
        ]
      }
    ),
    activeProduct === "research" && modal === "new-team" && teamMemberPickerOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
      Modal,
      {
        title: "选择成员",
        onClose: cancelTeamMemberPicker,
        onSubmit: submitTeamMemberPicker,
        confirmText: "确定",
        confirmDisabled: teamInviteDraftSelection.length === 0,
        wide: true,
        tall: true,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          MemberPicker,
          {
            candidates: memberCandidates,
            selectedIds: teamInviteDraftSelection,
            roles: teamInviteDraftRoles,
            search: memberSearch,
            onSearchChange: setMemberSearch,
            onToggle: (id) => {
              setTeamInviteDraftSelection((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
              setTeamInviteDraftRoles((current) => ({ ...current, [id]: current[id] ?? "查看员" }));
            },
            onRemove: (id) => setTeamInviteDraftSelection((current) => current.filter((item) => item !== id)),
            onRoleChange: (id, role) => setTeamInviteDraftRoles((current) => ({ ...current, [id]: role }))
          }
        )
      }
    ),
    activeProduct === "research" && modal === "invite-member" && !teamMemberPickerOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
      Modal,
      {
        title: "选择成员",
        onClose: () => setModal(null),
        onSubmit: submitInvite,
        confirmText: "确定",
        confirmDisabled: inviteSelection.length === 0,
        wide: true,
        tall: true,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          MemberPicker,
          {
            candidates: memberCandidates,
            selectedIds: inviteSelection,
            roles: inviteRoles,
            search: memberSearch,
            onSearchChange: setMemberSearch,
            onToggle: (id) => {
              setInviteSelection((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
              setInviteRoles((current) => ({ ...current, [id]: current[id] ?? "查看员" }));
            },
            onRemove: (id) => setInviteSelection((current) => current.filter((item) => item !== id)),
            onRoleChange: (id, role) => setInviteRoles((current) => ({ ...current, [id]: role }))
          }
        )
      }
    ),
    toast && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "toast", role: "status", "aria-live": "polite", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "icon-check", "aria-hidden": "true" }),
      toast
    ] })
  ] });
}
clientExports.createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(App, {}) })
);
export {
  Modal as M,
  createDocumentBlock as a,
  exportResearchDataTableCsv as b,
  cloneDocumentBlocks as c,
  documentBlocksToText as d,
  estimateDocumentSize as e,
  getDocumentBlocks as g,
  jsxRuntimeExports as j,
  normalizeHttpUrl as n,
  parseDelimitedData as p,
  reactExports as r
};
