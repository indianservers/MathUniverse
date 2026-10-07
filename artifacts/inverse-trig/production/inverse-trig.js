import It, { forwardRef as zt, createElement as Ve, useState as _, useEffect as Me, useId as Dt, useRef as xa } from "react";
import { useLocation as wa, useSearchParams as Aa, Navigate as St, Link as te, NavLink as Tt } from "react-router-dom";
var Re = { exports: {} }, be = {};
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var qt;
function Ca() {
  if (qt) return be;
  qt = 1;
  var t = It, n = Symbol.for("react.element"), r = Symbol.for("react.fragment"), l = Object.prototype.hasOwnProperty, h = t.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p = { key: !0, ref: !0, __self: !0, __source: !0 };
  function u(v, m, w) {
    var d, A = {}, D = null, T = null;
    w !== void 0 && (D = "" + w), m.key !== void 0 && (D = "" + m.key), m.ref !== void 0 && (T = m.ref);
    for (d in m) l.call(m, d) && !p.hasOwnProperty(d) && (A[d] = m[d]);
    if (v && v.defaultProps) for (d in m = v.defaultProps, m) A[d] === void 0 && (A[d] = m[d]);
    return { $$typeof: n, type: v, key: D, ref: T, props: A, _owner: h.current };
  }
  return be.Fragment = r, be.jsx = u, be.jsxs = u, be;
}
var xe = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Pt;
function ka() {
  return Pt || (Pt = 1, process.env.NODE_ENV !== "production" && (function() {
    var t = It, n = Symbol.for("react.element"), r = Symbol.for("react.portal"), l = Symbol.for("react.fragment"), h = Symbol.for("react.strict_mode"), p = Symbol.for("react.profiler"), u = Symbol.for("react.provider"), v = Symbol.for("react.context"), m = Symbol.for("react.forward_ref"), w = Symbol.for("react.suspense"), d = Symbol.for("react.suspense_list"), A = Symbol.for("react.memo"), D = Symbol.for("react.lazy"), T = Symbol.for("react.offscreen"), q = Symbol.iterator, O = "@@iterator";
    function f(a) {
      if (a === null || typeof a != "object")
        return null;
      var c = q && a[q] || a[O];
      return typeof c == "function" ? c : null;
    }
    var I = t.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    function E(a) {
      {
        for (var c = arguments.length, g = new Array(c > 1 ? c - 1 : 0), x = 1; x < c; x++)
          g[x - 1] = arguments[x];
        b("error", a, g);
      }
    }
    function b(a, c, g) {
      {
        var x = I.ReactDebugCurrentFrame, R = x.getStackAddendum();
        R !== "" && (c += "%s", g = g.concat([R]));
        var M = g.map(function(S) {
          return String(S);
        });
        M.unshift("Warning: " + c), Function.prototype.apply.call(console[a], console, M);
      }
    }
    var j = !1, P = !1, z = !1, $ = !1, y = !1, ie;
    ie = Symbol.for("react.module.reference");
    function oe(a) {
      return !!(typeof a == "string" || typeof a == "function" || a === l || a === p || y || a === h || a === w || a === d || $ || a === T || j || P || z || typeof a == "object" && a !== null && (a.$$typeof === D || a.$$typeof === A || a.$$typeof === u || a.$$typeof === v || a.$$typeof === m || // This needs to include all possible module reference object
      // types supported by any Flight configuration anywhere since
      // we don't know which Flight build this will end up being used
      // with.
      a.$$typeof === ie || a.getModuleId !== void 0));
    }
    function Ut(a, c, g) {
      var x = a.displayName;
      if (x)
        return x;
      var R = c.displayName || c.name || "";
      return R !== "" ? g + "(" + R + ")" : g;
    }
    function at(a) {
      return a.displayName || "Context";
    }
    function ne(a) {
      if (a == null)
        return null;
      if (typeof a.tag == "number" && E("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof a == "function")
        return a.displayName || a.name || null;
      if (typeof a == "string")
        return a;
      switch (a) {
        case l:
          return "Fragment";
        case r:
          return "Portal";
        case p:
          return "Profiler";
        case h:
          return "StrictMode";
        case w:
          return "Suspense";
        case d:
          return "SuspenseList";
      }
      if (typeof a == "object")
        switch (a.$$typeof) {
          case v:
            var c = a;
            return at(c) + ".Consumer";
          case u:
            var g = a;
            return at(g._context) + ".Provider";
          case m:
            return Ut(a, a.render, "ForwardRef");
          case A:
            var x = a.displayName || null;
            return x !== null ? x : ne(a.type) || "Memo";
          case D: {
            var R = a, M = R._payload, S = R._init;
            try {
              return ne(S(M));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    var le = Object.assign, ye = 0, it, nt, rt, st, ot, lt, ct;
    function dt() {
    }
    dt.__reactDisabledLog = !0;
    function Gt() {
      {
        if (ye === 0) {
          it = console.log, nt = console.info, rt = console.warn, st = console.error, ot = console.group, lt = console.groupCollapsed, ct = console.groupEnd;
          var a = {
            configurable: !0,
            enumerable: !0,
            value: dt,
            writable: !0
          };
          Object.defineProperties(console, {
            info: a,
            log: a,
            warn: a,
            error: a,
            group: a,
            groupCollapsed: a,
            groupEnd: a
          });
        }
        ye++;
      }
    }
    function Kt() {
      {
        if (ye--, ye === 0) {
          var a = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: le({}, a, {
              value: it
            }),
            info: le({}, a, {
              value: nt
            }),
            warn: le({}, a, {
              value: rt
            }),
            error: le({}, a, {
              value: st
            }),
            group: le({}, a, {
              value: ot
            }),
            groupCollapsed: le({}, a, {
              value: lt
            }),
            groupEnd: le({}, a, {
              value: ct
            })
          });
        }
        ye < 0 && E("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var Le = I.ReactCurrentDispatcher, Ne;
    function Se(a, c, g) {
      {
        if (Ne === void 0)
          try {
            throw Error();
          } catch (R) {
            var x = R.stack.trim().match(/\n( *(at )?)/);
            Ne = x && x[1] || "";
          }
        return `
` + Ne + a;
      }
    }
    var Be = !1, Te;
    {
      var Qt = typeof WeakMap == "function" ? WeakMap : Map;
      Te = new Qt();
    }
    function ht(a, c) {
      if (!a || Be)
        return "";
      {
        var g = Te.get(a);
        if (g !== void 0)
          return g;
      }
      var x;
      Be = !0;
      var R = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var M;
      M = Le.current, Le.current = null, Gt();
      try {
        if (c) {
          var S = function() {
            throw Error();
          };
          if (Object.defineProperty(S.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(S, []);
            } catch (U) {
              x = U;
            }
            Reflect.construct(a, [], S);
          } else {
            try {
              S.call();
            } catch (U) {
              x = U;
            }
            a.call(S.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (U) {
            x = U;
          }
          a();
        }
      } catch (U) {
        if (U && x && typeof U.stack == "string") {
          for (var k = U.stack.split(`
`), V = x.stack.split(`
`), F = k.length - 1, N = V.length - 1; F >= 1 && N >= 0 && k[F] !== V[N]; )
            N--;
          for (; F >= 1 && N >= 0; F--, N--)
            if (k[F] !== V[N]) {
              if (F !== 1 || N !== 1)
                do
                  if (F--, N--, N < 0 || k[F] !== V[N]) {
                    var Q = `
` + k[F].replace(" at new ", " at ");
                    return a.displayName && Q.includes("<anonymous>") && (Q = Q.replace("<anonymous>", a.displayName)), typeof a == "function" && Te.set(a, Q), Q;
                  }
                while (F >= 1 && N >= 0);
              break;
            }
        }
      } finally {
        Be = !1, Le.current = M, Kt(), Error.prepareStackTrace = R;
      }
      var me = a ? a.displayName || a.name : "", ce = me ? Se(me) : "";
      return typeof a == "function" && Te.set(a, ce), ce;
    }
    function Jt(a, c, g) {
      return ht(a, !1);
    }
    function Yt(a) {
      var c = a.prototype;
      return !!(c && c.isReactComponent);
    }
    function qe(a, c, g) {
      if (a == null)
        return "";
      if (typeof a == "function")
        return ht(a, Yt(a));
      if (typeof a == "string")
        return Se(a);
      switch (a) {
        case w:
          return Se("Suspense");
        case d:
          return Se("SuspenseList");
      }
      if (typeof a == "object")
        switch (a.$$typeof) {
          case m:
            return Jt(a.render);
          case A:
            return qe(a.type, c, g);
          case D: {
            var x = a, R = x._payload, M = x._init;
            try {
              return qe(M(R), c, g);
            } catch {
            }
          }
        }
      return "";
    }
    var ve = Object.prototype.hasOwnProperty, ut = {}, pt = I.ReactDebugCurrentFrame;
    function Pe(a) {
      if (a) {
        var c = a._owner, g = qe(a.type, a._source, c ? c.type : null);
        pt.setExtraStackFrame(g);
      } else
        pt.setExtraStackFrame(null);
    }
    function Zt(a, c, g, x, R) {
      {
        var M = Function.call.bind(ve);
        for (var S in a)
          if (M(a, S)) {
            var k = void 0;
            try {
              if (typeof a[S] != "function") {
                var V = Error((x || "React class") + ": " + g + " type `" + S + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof a[S] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw V.name = "Invariant Violation", V;
              }
              k = a[S](c, S, x, g, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (F) {
              k = F;
            }
            k && !(k instanceof Error) && (Pe(R), E("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", x || "React class", g, S, typeof k), Pe(null)), k instanceof Error && !(k.message in ut) && (ut[k.message] = !0, Pe(R), E("Failed %s type: %s", g, k.message), Pe(null));
          }
      }
    }
    var Xt = Array.isArray;
    function Oe(a) {
      return Xt(a);
    }
    function ea(a) {
      {
        var c = typeof Symbol == "function" && Symbol.toStringTag, g = c && a[Symbol.toStringTag] || a.constructor.name || "Object";
        return g;
      }
    }
    function ta(a) {
      try {
        return mt(a), !1;
      } catch {
        return !0;
      }
    }
    function mt(a) {
      return "" + a;
    }
    function gt(a) {
      if (ta(a))
        return E("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", ea(a)), mt(a);
    }
    var ft = I.ReactCurrentOwner, aa = {
      key: !0,
      ref: !0,
      __self: !0,
      __source: !0
    }, yt, vt;
    function ia(a) {
      if (ve.call(a, "ref")) {
        var c = Object.getOwnPropertyDescriptor(a, "ref").get;
        if (c && c.isReactWarning)
          return !1;
      }
      return a.ref !== void 0;
    }
    function na(a) {
      if (ve.call(a, "key")) {
        var c = Object.getOwnPropertyDescriptor(a, "key").get;
        if (c && c.isReactWarning)
          return !1;
      }
      return a.key !== void 0;
    }
    function ra(a, c) {
      typeof a.ref == "string" && ft.current;
    }
    function sa(a, c) {
      {
        var g = function() {
          yt || (yt = !0, E("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", c));
        };
        g.isReactWarning = !0, Object.defineProperty(a, "key", {
          get: g,
          configurable: !0
        });
      }
    }
    function oa(a, c) {
      {
        var g = function() {
          vt || (vt = !0, E("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", c));
        };
        g.isReactWarning = !0, Object.defineProperty(a, "ref", {
          get: g,
          configurable: !0
        });
      }
    }
    var la = function(a, c, g, x, R, M, S) {
      var k = {
        // This tag allows us to uniquely identify this as a React Element
        $$typeof: n,
        // Built-in properties that belong on the element
        type: a,
        key: c,
        ref: g,
        props: S,
        // Record the component responsible for creating this element.
        _owner: M
      };
      return k._store = {}, Object.defineProperty(k._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: !1
      }), Object.defineProperty(k, "_self", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: x
      }), Object.defineProperty(k, "_source", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: R
      }), Object.freeze && (Object.freeze(k.props), Object.freeze(k)), k;
    };
    function ca(a, c, g, x, R) {
      {
        var M, S = {}, k = null, V = null;
        g !== void 0 && (gt(g), k = "" + g), na(c) && (gt(c.key), k = "" + c.key), ia(c) && (V = c.ref, ra(c, R));
        for (M in c)
          ve.call(c, M) && !aa.hasOwnProperty(M) && (S[M] = c[M]);
        if (a && a.defaultProps) {
          var F = a.defaultProps;
          for (M in F)
            S[M] === void 0 && (S[M] = F[M]);
        }
        if (k || V) {
          var N = typeof a == "function" ? a.displayName || a.name || "Unknown" : a;
          k && sa(S, N), V && oa(S, N);
        }
        return la(a, k, V, R, x, ft.current, S);
      }
    }
    var $e = I.ReactCurrentOwner, bt = I.ReactDebugCurrentFrame;
    function pe(a) {
      if (a) {
        var c = a._owner, g = qe(a.type, a._source, c ? c.type : null);
        bt.setExtraStackFrame(g);
      } else
        bt.setExtraStackFrame(null);
    }
    var We;
    We = !1;
    function _e(a) {
      return typeof a == "object" && a !== null && a.$$typeof === n;
    }
    function xt() {
      {
        if ($e.current) {
          var a = ne($e.current.type);
          if (a)
            return `

Check the render method of \`` + a + "`.";
        }
        return "";
      }
    }
    function da(a) {
      return "";
    }
    var wt = {};
    function ha(a) {
      {
        var c = xt();
        if (!c) {
          var g = typeof a == "string" ? a : a.displayName || a.name;
          g && (c = `

Check the top-level render call using <` + g + ">.");
        }
        return c;
      }
    }
    function At(a, c) {
      {
        if (!a._store || a._store.validated || a.key != null)
          return;
        a._store.validated = !0;
        var g = ha(c);
        if (wt[g])
          return;
        wt[g] = !0;
        var x = "";
        a && a._owner && a._owner !== $e.current && (x = " It was passed a child from " + ne(a._owner.type) + "."), pe(a), E('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', g, x), pe(null);
      }
    }
    function Ct(a, c) {
      {
        if (typeof a != "object")
          return;
        if (Oe(a))
          for (var g = 0; g < a.length; g++) {
            var x = a[g];
            _e(x) && At(x, c);
          }
        else if (_e(a))
          a._store && (a._store.validated = !0);
        else if (a) {
          var R = f(a);
          if (typeof R == "function" && R !== a.entries)
            for (var M = R.call(a), S; !(S = M.next()).done; )
              _e(S.value) && At(S.value, c);
        }
      }
    }
    function ua(a) {
      {
        var c = a.type;
        if (c == null || typeof c == "string")
          return;
        var g;
        if (typeof c == "function")
          g = c.propTypes;
        else if (typeof c == "object" && (c.$$typeof === m || // Note: Memo only checks outer props here.
        // Inner props are checked in the reconciler.
        c.$$typeof === A))
          g = c.propTypes;
        else
          return;
        if (g) {
          var x = ne(c);
          Zt(g, a.props, "prop", x, a);
        } else if (c.PropTypes !== void 0 && !We) {
          We = !0;
          var R = ne(c);
          E("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", R || "Unknown");
        }
        typeof c.getDefaultProps == "function" && !c.getDefaultProps.isReactClassApproved && E("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
      }
    }
    function pa(a) {
      {
        for (var c = Object.keys(a.props), g = 0; g < c.length; g++) {
          var x = c[g];
          if (x !== "children" && x !== "key") {
            pe(a), E("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", x), pe(null);
            break;
          }
        }
        a.ref !== null && (pe(a), E("Invalid attribute `ref` supplied to `React.Fragment`."), pe(null));
      }
    }
    var kt = {};
    function jt(a, c, g, x, R, M) {
      {
        var S = oe(a);
        if (!S) {
          var k = "";
          (a === void 0 || typeof a == "object" && a !== null && Object.keys(a).length === 0) && (k += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var V = da();
          V ? k += V : k += xt();
          var F;
          a === null ? F = "null" : Oe(a) ? F = "array" : a !== void 0 && a.$$typeof === n ? (F = "<" + (ne(a.type) || "Unknown") + " />", k = " Did you accidentally export a JSX literal instead of a component?") : F = typeof a, E("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", F, k);
        }
        var N = ca(a, c, g, R, M);
        if (N == null)
          return N;
        if (S) {
          var Q = c.children;
          if (Q !== void 0)
            if (x)
              if (Oe(Q)) {
                for (var me = 0; me < Q.length; me++)
                  Ct(Q[me], a);
                Object.freeze && Object.freeze(Q);
              } else
                E("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
            else
              Ct(Q, a);
        }
        if (ve.call(c, "key")) {
          var ce = ne(a), U = Object.keys(c).filter(function(ba) {
            return ba !== "key";
          }), He = U.length > 0 ? "{key: someKey, " + U.join(": ..., ") + ": ...}" : "{key: someKey}";
          if (!kt[ce + He]) {
            var va = U.length > 0 ? "{" + U.join(": ..., ") + ": ...}" : "{}";
            E(`A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`, He, ce, va, ce), kt[ce + He] = !0;
          }
        }
        return a === l ? pa(N) : ua(N), N;
      }
    }
    function ma(a, c, g) {
      return jt(a, c, g, !0);
    }
    function ga(a, c, g) {
      return jt(a, c, g, !1);
    }
    var fa = ga, ya = ma;
    xe.Fragment = l, xe.jsx = fa, xe.jsxs = ya;
  })()), xe;
}
var Rt;
function ja() {
  return Rt || (Rt = 1, process.env.NODE_ENV === "production" ? Re.exports = Ca() : Re.exports = ka()), Re.exports;
}
var e = ja();
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Sa = (t) => t.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), Ft = (...t) => t.filter((n, r, l) => !!n && n.trim() !== "" && l.indexOf(n) === r).join(" ").trim();
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var Ta = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const qa = zt(
  ({
    color: t = "currentColor",
    size: n = 24,
    strokeWidth: r = 2,
    absoluteStrokeWidth: l,
    className: h = "",
    children: p,
    iconNode: u,
    ...v
  }, m) => Ve(
    "svg",
    {
      ref: m,
      ...Ta,
      width: n,
      height: n,
      stroke: t,
      strokeWidth: l ? Number(r) * 24 / Number(n) : r,
      className: Ft("lucide", h),
      ...v
    },
    [
      ...u.map(([w, d]) => Ve(w, d)),
      ...Array.isArray(p) ? p : [p]
    ]
  )
);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const B = (t, n) => {
  const r = zt(
    ({ className: l, ...h }, p) => Ve(qa, {
      ref: p,
      iconNode: n,
      className: Ft(`lucide-${Sa(t)}`, l),
      ...h
    })
  );
  return r.displayName = `${t}`, r;
};
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Pa = B("ArrowLeft", [
  ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
  ["path", { d: "M19 12H5", key: "x3x0zl" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const J = B("ArrowRight", [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ae = B("BookOpen", [
  ["path", { d: "M12 7v14", key: "1akyts" }],
  [
    "path",
    {
      d: "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",
      key: "ruj8y"
    }
  ]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ie = B("ChartNoAxesColumnIncreasing", [
  ["line", { x1: "12", x2: "12", y1: "20", y2: "10", key: "1vz5eb" }],
  ["line", { x1: "18", x2: "18", y1: "20", y2: "4", key: "cun8e5" }],
  ["line", { x1: "6", x2: "6", y1: "20", y2: "16", key: "hq0ia6" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ue = B("CircleCheck", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const he = B("CircleDot", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["circle", { cx: "12", cy: "12", r: "1", key: "41hilf" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ze = B("Compass", [
  [
    "path",
    {
      d: "m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z",
      key: "9ktpf1"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ra = B("GitBranch", [
  ["line", { x1: "6", x2: "6", y1: "3", y2: "15", key: "17qcm7" }],
  ["circle", { cx: "18", cy: "6", r: "3", key: "1h7g24" }],
  ["circle", { cx: "6", cy: "18", r: "3", key: "fqmcym" }],
  ["path", { d: "M18 9a9 9 0 0 1-9 9", key: "n2h4wq" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ea = B("Grid2x2", [
  ["path", { d: "M12 3v18", key: "108xh3" }],
  ["path", { d: "M3 12h18", key: "1i2n21" }],
  ["rect", { x: "3", y: "3", width: "18", height: "18", rx: "2", key: "h1oib" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ma = B("House", [
  ["path", { d: "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8", key: "5wwlr5" }],
  [
    "path",
    {
      d: "M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
      key: "1d0kgt"
    }
  ]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ce = B("Lightbulb", [
  [
    "path",
    {
      d: "M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5",
      key: "1gvzjb"
    }
  ],
  ["path", { d: "M9 18h6", key: "x1upvd" }],
  ["path", { d: "M10 22h4", key: "ceow96" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ia = B("Link2", [
  ["path", { d: "M9 17H7A5 5 0 0 1 7 7h2", key: "8i5ue5" }],
  ["path", { d: "M15 7h2a5 5 0 1 1 0 10h-2", key: "1b9ql8" }],
  ["line", { x1: "8", x2: "16", y1: "12", y2: "12", key: "1jonct" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ke = B("MoveUpRight", [
  ["path", { d: "M13 5H19V11", key: "1n1gyv" }],
  ["path", { d: "M19 5L5 19", key: "72u4yj" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Qe = B("Pi", [
  ["line", { x1: "9", x2: "9", y1: "4", y2: "20", key: "ovs5a5" }],
  ["path", { d: "M4 7c0-1.7 1.3-3 3-3h13", key: "10pag4" }],
  ["path", { d: "M18 20c-1.7 0-3-1.3-3-3V4", key: "1gaosr" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Je = B("RotateCcw", [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Lt = B("Sparkles", [
  [
    "path",
    {
      d: "M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",
      key: "4pj2yx"
    }
  ],
  ["path", { d: "M20 3v4", key: "1olli1" }],
  ["path", { d: "M22 5h-4", key: "1gvqau" }],
  ["path", { d: "M4 17v2", key: "vumght" }],
  ["path", { d: "M5 18H3", key: "zchphs" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ye = B("Target", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["circle", { cx: "12", cy: "12", r: "6", key: "1vlfrh" }],
  ["circle", { cx: "12", cy: "12", r: "2", key: "1c9p78" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Nt = B("Triangle", [
  [
    "path",
    { d: "M13.73 4a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z", key: "14u9p9" }
  ]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ze = B("Trophy", [
  ["path", { d: "M6 9H4.5a2.5 2.5 0 0 1 0-5H6", key: "17hqa7" }],
  ["path", { d: "M18 9h1.5a2.5 2.5 0 0 0 0-5H18", key: "lmptdp" }],
  ["path", { d: "M4 22h16", key: "57wxv0" }],
  ["path", { d: "M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22", key: "1nw9bq" }],
  ["path", { d: "M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22", key: "1np0yb" }],
  ["path", { d: "M18 2H6v7a6 6 0 0 0 12 0V2Z", key: "u46fv3" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ke = B("Waves", [
  [
    "path",
    {
      d: "M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1",
      key: "knzxuh"
    }
  ],
  [
    "path",
    {
      d: "M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1",
      key: "2jd2cc"
    }
  ],
  [
    "path",
    {
      d: "M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1",
      key: "rd2r6e"
    }
  ]
]), za = {
  "differential-equations": {
    laplace: "A Laplace transform repackages a changing signal into a form where derivatives become algebra. Keep the starting value, solve the algebraic equation, then transform back. A delayed input appears only after its switch-on time.",
    pde: "Heat and waves change across both space and time. A sine shape fits between fixed zero endpoints. Heat smooths the shape away, while an ideal wave makes it oscillate. More complicated shapes need many modes together.",
    "boundary-values": "Fixing both ends of a curve can allow only special shapes. For a vibrating string those shapes are sine waves that fit exactly inside the interval. Their allowed eigenvalues depend on the mode number and the interval length.",
    home: "A differential equation tells us how something changes. If we know its starting value and the rule for its change, we can predict its future path. Think of temperature cooling, money growing, or a spring moving.",
    explorer: "First ask what is changing and which derivative appears. A first derivative describes a rate; a second derivative often describes acceleration. Some equations are linear and easier to solve, while others need different tools.",
    "slope-fields": "Imagine a tiny arrow at every point on a graph. Each arrow shows which way a solution should move there. Follow the arrows from a starting point to sketch the solution without finding a formula.",
    "initial-value": "The equation gives a whole family of possible paths. A starting value picks one path. For a moving object described by a second derivative, you usually need both its starting position and speed.",
    separable: "Sometimes the x parts and y parts of a rate equation can be moved to opposite sides. Then each side can be integrated. Check for flat, unchanging solutions before dividing by y.",
    "homogeneous-first-order": "Here the slope depends on the ratio y/x rather than on x and y separately. Points on the same ray from the origin behave alike. Replacing y/x with a new letter turns the equation into an easier one.",
    exact: "An exact equation hides a single quantity that stays constant. Find that quantity by putting its x and y changes together. A solution then follows a level curve of the constant quantity.",
    "linear-first-order": "A linear first-order equation combines a changing amount with a term proportional to that amount. An integrating factor turns the two terms into one product derivative, so ordinary integration finishes the job.",
    bernoulli: "A Bernoulli equation looks nonlinear because y has a power. A carefully chosen replacement for that power turns it into a linear equation. Always check whether y=0 is also a solution.",
    "method-selector": "Different equations have different shortcuts. Look for parts that separate, a hidden constant quantity, a linear pattern, or a power that can be replaced. Choose the shortcut that makes the fewest steps.",
    euler: "Euler's method predicts the next value by using the slope right now. It takes a small straight step, then repeats. Smaller steps usually follow a curved solution better, but they take more work.",
    heun: "Heun's method improves a straight-step guess. It checks the slope at the start and at a guessed end, then uses their average. That usually gives a better next value than Euler's single slope.",
    rk4: "RK4 checks the slope four times during one step and blends those checks. It follows smooth changing curves much more closely than a simple Euler step of the same size.",
    "growth-models": "Exponential growth keeps growing at the same percentage rate. Logistic growth begins quickly but slows as it approaches a limit set by resources. Change the limit or growth rate to see different futures.",
    "higher-order-linear": "A second-order equation often describes motion: position, speed, and acceleration are linked. Solve a small algebra equation for the possible motion patterns, then use the starting position and speed to choose their mixture.",
    "undetermined-coefficients": "When a regular outside force acts on a linear system, guess a response with the same kind of shape: a polynomial, exponential, or wave. Put the guess into the equation and solve its unknown numbers.",
    "variation-of-parameters": "First solve the system with no outside force. Then let the amounts of those basic solutions change over time to account for a new force. This works for many forces that simple guessing cannot handle.",
    "cauchy-euler": "In this equation, powers of x fit naturally. Try y=x raised to an unknown power and solve for that power. Work away from x=0, where the equation changes character.",
    systems: "Several quantities may change together. A matrix tells how each one affects the others. Its special directions show whether paths move toward a balance point, away from it, or around it.",
    "phase-plane": "Instead of drawing a value against time, draw one changing quantity against another. Each point is a state, and arrows show where the state goes next. You can see cycles, stable points, and escapes.",
    "mechanical-oscillations": "A spring pulls a mass back toward its resting place. Damping removes energy, so the bouncing fades. The balance among mass, spring strength, and damping decides whether it swings or settles without overshooting.",
    "lcr-circuit": "An inductor and capacitor exchange electrical energy, much like a mass and spring exchange motion energy. Resistance drains energy. Their sizes decide whether charge oscillates or simply settles.",
    "newton-cooling": "The bigger the temperature gap between an object and its surroundings, the faster it changes temperature. As the gap shrinks, the change slows. The object approaches room temperature rather than jumping to it."
  },
  geometry: {
    shapes: "Every shape has measurements that answer different questions. Length goes around a boundary, area covers a flat region, surface area covers the outside of a solid, and volume measures the space inside.",
    segment: "A circular segment is the small region between a straight chord and the curved edge of a circle. Find its area by taking a circular slice and subtracting the triangle inside that slice.",
    home: "Geometry is about shapes and the rules that always hold for them. Move points and measure what changes, then look for a reason why some lengths or angles stay the same.",
    construction: "A construction links objects together. If you build a midpoint from two endpoints, moving either endpoint should move the midpoint automatically while keeping both halves equal.",
    triangles: "A triangle's sides and angles constrain one another. Changing a corner changes measurements, but the angles still add to 180 degrees on a flat plane. Matching enough parts can prove two triangles identical.",
    circles: "Every point on a circle is the same distance from its center. Chords, tangents, and angles follow rules because of that shared radius. Move a point to see which rule stays true.",
    polygons: "A polygon is a shape made from straight edges. Splitting it into triangles helps find its angle sum and area. For a regular polygon, all sides and angles match.",
    transformations: "A transformation moves or resizes a shape. Sliding, turning, and flipping keep lengths unchanged; scaling changes lengths by the same factor. Watch what happens when you apply two moves in different orders.",
    coordinate: "Coordinates give every point an address. From two addresses you can find distance, midpoint, and slope, then write an equation for the line through them.",
    measurement: "Measurement puts numbers on a shape. Pick the correct unit and formula for what you need: a distance, an angle, an area, or a volume. A drawing alone may not be to scale.",
    proofs: "A proof explains why a geometry claim works for every valid figure. Start from given facts, use known rules, and justify each step instead of relying only on how a drawing looks.",
    solids: "A solid takes up three-dimensional space. Surface area tells how much material covers it; volume tells how much it can hold. A net unfolds its faces so you can count the outside area.",
    ar: "An AR overlay places geometry on a camera view. Measure a distance and an angle to estimate a height, then check that the virtual triangle matches the real scene."
  },
  trigonometry: {
    home: "Trigonometry connects angles with side lengths and repeating waves. A right triangle and a turning point on a circle are two ways to see the same sine and cosine values.",
    "unit-circle": "Put a point on a circle of radius one. Its horizontal position is cosine and its vertical position is sine. As the point turns, the signs and values change in a predictable pattern.",
    "right-triangle": "For one angle in a right triangle, sine compares opposite side with the long side, cosine compares adjacent side with the long side, and tangent compares opposite with adjacent.",
    graphs: "Sine and cosine graphs trace a point going around a circle. Height controls amplitude, speed of turning controls period, and shifting the graph moves its peaks and midline.",
    identities: "A trigonometric identity is a relationship that stays true for every allowed angle. For example, the horizontal and vertical coordinates on the unit circle make cos²θ+sin²θ=1.",
    inverse: "Inverse trig works backward: it finds an angle from a known sine, cosine, or tangent value. Each inverse uses a chosen angle range so it returns one answer.",
    oblique: "A triangle does not need a right angle to be solvable. The sine law compares sides with their opposite angles; the cosine law connects all three sides with one included angle.",
    waves: "A wave repeats a pattern. Combining waves can make louder peaks, cancellations, or slow beats. Change their size, timing, or frequency to hear and see the difference.",
    applications: "Use an angle and a measured distance to find a height or another distance you cannot reach directly. Draw the triangle first so you choose the right sides and ratio.",
    ar: "The camera supplies a real scene while the overlay supplies a triangle or wave. Measure carefully: a small angle error can make a distant height estimate quite different."
  },
  "linear-algebra": {
    home: "Linear algebra studies vectors, matrices, and how they move or combine information. A matrix can stretch, turn, shear, or flatten a grid, and the same numbers can solve a system of equations.",
    vectors: "A vector is an arrow with size and direction. You can add arrows, scale them, or measure how much one points along another using the dot product.",
    matrices: "A matrix is a table of numbers that can act like a machine for moving vectors. Multiplying matrices means applying one machine and then another, so order often changes the result.",
    "row-reduction": "Row reduction rewrites a system of equations without changing its answers. Clear entries step by step until you can see which variables are fixed and which can vary.",
    "linear-transforms": "A linear transformation moves the whole plane according to what it does to the basic horizontal and vertical arrows. Once you know those two images, you can predict every other point.",
    determinants: "A determinant tells how a matrix scales area or volume. Zero means the shape is flattened and information is lost. A negative sign means the transformation flips orientation.",
    "vector-spaces": "A vector space is a collection where adding vectors and scaling them keeps you inside the collection. A basis is a small set of building-block directions that can create every vector there.",
    eigenvectors: "An eigenvector points in a direction that a matrix does not turn; it only stretches, shrinks, or reverses it. Its eigenvalue says how much.",
    orthogonality: "Orthogonal vectors meet at a right angle. Projecting one arrow onto another shows the part that points along it; the leftover part points across it.",
    "least-squares": "When data do not fit an equation exactly, least squares finds the answer with the smallest total squared errors. It is the line or model that lands closest to the observations overall.",
    playground: "Try a matrix and watch the grid move. Apply two matrices in different orders and compare the pictures. The transformed basis arrows explain what happens to the whole grid.",
    "cayley-hamilton": "A square matrix obeys its own characteristic equation. That lets you replace large matrix powers with simpler combinations of the matrix and the identity.",
    diagonalization: "If a matrix has enough independent special directions, change coordinates to those directions. In that view it simply scales each coordinate, making repeated actions easier to understand.",
    "quadratic-forms": "A quadratic form assigns a number to each point, often drawing a bowl, ridge, or saddle. Its signs tell whether the value rises in every direction or rises in some and falls in others.",
    "principal-axes": "A tilted ellipse or bowl becomes easier to measure if you rotate to its natural directions. In those directions, the mixed term disappears and each axis has its own stretch.",
    "matrix-factorizations": "A matrix factorization breaks a complicated matrix into simpler pieces. Different factorizations help solve equations, find stable directions, or compress data.",
    similarity: "Similar matrices describe the same transformation using different coordinate labels. They have the same eigenvalues even though their entries may look different.",
    "jordan-form": "Sometimes a matrix cannot be reduced to independent scaling directions. Jordan form keeps a nearly diagonal picture with extra links that show how one direction pushes another."
  },
  "complex-numbers": {
    home: "A complex number has a horizontal real part and a vertical imaginary part. Treat it as a point or arrow: then adding, multiplying, rotating, and taking roots become visible moves.",
    "argand-plane": "Plot a complex number by walking its real part horizontally and its imaginary part vertically. Its distance from zero is its size, and its angle tells its direction.",
    arithmetic: "Add complex numbers by adding their horizontal and vertical parts. Multiplication combines both sizes and angles, so it can stretch and rotate an arrow.",
    "polar-forms": "Instead of saying how far right and up a complex point is, say how far it is from zero and which way it points. That distance-and-angle form makes multiplication easier.",
    rotation: "Multiplying by a complex number of size one turns an arrow without changing its length. Multiplying by i makes a quarter turn counterclockwise.",
    roots: "A complex root asks which arrows become a given number after repeated multiplication. Their angles spread evenly around a circle, which is why roots form regular patterns.",
    euler: "Euler's formula connects a turning arrow with sine and cosine. It packages a rotation into one compact expression, making wave and circuit calculations easier.",
    loci: "A locus is the set of all complex points that obey one rule, such as staying a fixed distance from a point. Transformations move the entire set to a new place.",
    fractals: "A fractal grows from repeating a simple rule many times. Some starting points stay bounded while nearby ones escape, creating a detailed boundary when you color the results.",
    "waves-circuits": "A rotating complex arrow can represent a repeating wave. Its length gives amplitude and its angle gives phase, so adding arrows helps explain combined signals or alternating-current circuits."
  },
  modelling: {
    home: "A model is a simplified story told with numbers. Choose the important quantities, make a rule for how they connect, compare its predictions with real data, and improve it when it misses.",
    motion: "A motion model tracks where something is, how fast it moves, and how its speed changes. Draw or change the inputs to see how the predicted journey responds.",
    population: "A population can grow quickly when resources are plentiful and slow near a limit. The model helps compare short-term growth with long-term crowding.",
    epidemics: "An epidemic model moves people among groups such as susceptible, infected, and recovered. Contact and recovery rates decide whether cases rise or fall.",
    finance: "A finance model follows money through deposits, interest, and time. Small changes in rate or duration can compound into a large difference later.",
    optimization: "Optimization looks for the best possible choice under limits. Write down what you want to improve, list what restricts you, and compare feasible choices.",
    networks: "A network turns places or people into dots and their connections into lines. You can find short routes, strong links, bottlenecks, or ways to move flow through it.",
    regression: "Regression fits a simple relationship to observed data. Use the fitted line for a prediction, but inspect the errors to see where the story breaks down.",
    periodic: "A periodic model repeats after a set time, like tides or seasons. Its height, timing, and period explain different parts of the pattern.",
    numerical: "A numerical model takes small steps when an exact formula is hard to find. Smaller steps may improve accuracy, but the method and step size still matter.",
    comparison: "Two models can fit the same data differently. Compare prediction errors, assumptions, and behavior outside the observed range before choosing one."
  },
  discrete: {
    home: "Discrete mathematics studies separate objects you can count: whole numbers, choices, logical statements, and networks. Patterns and rules help explain very large sets without listing every item.",
    "number-sense": "Numbers can be viewed as points, groups, fractions, or place-value digits. Switching views helps estimate an answer and check whether a calculation makes sense.",
    primes: "A prime number has no smaller positive factors except one. Primes are the building blocks of whole-number multiplication, and their patterns matter in coding and security.",
    "modular-arithmetic": "Modular arithmetic wraps numbers around after a fixed count, like a clock after twelve hours. It is useful for remainders, repeating schedules, and simple cryptography.",
    "number-patterns": "A number pattern follows a rule from one term to the next or from the term's position. Look for a rule, test later terms, and explain why it continues.",
    combinatorics: "Counting methods answer how many choices are possible without listing them all. Ask whether order matters and whether an item may be chosen more than once.",
    logic: "Logic tests whether a conclusion really follows from given statements. Truth tables show every possible true-or-false case, making hidden exceptions easy to spot.",
    sets: "A set is a collection of distinct objects. Union joins collections, intersection keeps what they share, and complement keeps what lies outside a chosen collection.",
    graphs: "A graph is a network of dots and links. Its paths, cycles, and connections help solve routing, scheduling, and relationship problems.",
    algorithms: "An algorithm is a precise list of steps. Compare not just whether it gives the right answer, but how much work it needs as the input gets larger.",
    cryptography: "Cryptography transforms messages so only someone with the right key can read them. Number patterns, especially remainders and primes, supply many of its tools."
  },
  statistics: {
    home: "Statistics helps turn messy observations into useful decisions. Describe the data first, then use probability to say how uncertain a conclusion or prediction is.",
    "data-explorer": "Explore a dataset by looking at individual points and overall patterns. Filtering a group or brushing a region changes which observations your summaries describe.",
    descriptive: "The mean and median describe center, while spread tells how varied values are. A graph can reveal skew or outliers that one summary number hides.",
    "interactive-distributions": "A distribution describes which outcomes are common and rare. Bars represent chances for separate outcomes; area under a smooth curve represents chance for measured values.",
    experiments: "A probability experiment repeats a random action, such as rolling dice. As trials accumulate, the observed share of an outcome often moves closer to its theoretical chance.",
    counting: "To find a probability, first count all possible outcomes and then count the favorable ones. Check whether order matters and whether choices can repeat.",
    clt: "A sample mean varies from sample to sample. Larger samples make those means cluster more tightly, and their pattern often becomes bell-shaped even when the original data do not.",
    "confidence-intervals": "A confidence interval gives an estimate plus room for sampling uncertainty. Wider intervals usually offer more confidence; larger samples usually make intervals narrower.",
    hypothesis: "A hypothesis test asks whether the observed data would be surprising if a starting claim were true. A small p-value signals conflict with that claim, not proof of a different one.",
    correlation: "Correlation tells how strongly two quantities move together. Regression draws a prediction line. Always check the leftover errors and remember that a link does not prove one causes the other.",
    anova: "ANOVA compares variation between group averages with variation inside groups. If the between-group difference is large relative to ordinary noise, at least one group may differ."
  },
  algebra: {
    home: "Algebra uses letters to describe numbers we do not yet know or values that can change. Its rules let us simplify expressions, solve equations, and describe whole families of patterns.",
    expressions: "An expression is a recipe of numbers and letters. Combine matching parts, expand brackets, or factor it into pieces without changing its value.",
    equations: "An equation says two expressions are equal. Keep the two sides balanced while you isolate the unknown, then put the answer back to check it.",
    functions: "A function gives exactly one output for each allowed input. Its graph shows how outputs change; shifting or stretching the rule changes the graph in predictable ways.",
    polynomials: "A polynomial combines powers of a variable. Its roots are places where the graph reaches zero. Factoring shows the roots, while degree and leading sign guide the far ends.",
    systems: "A system asks for values that satisfy several equations at once. On a graph, solutions are intersections. You can also substitute, eliminate, or use matrices.",
    exponents: "An exponent means repeated multiplication. A logarithm asks what exponent produced a number. Their rules make large growth, tiny scales, and unknown powers easier to work with.",
    sequences: "A sequence is an ordered list built by a rule. An arithmetic sequence adds a fixed amount; a geometric sequence multiplies by a fixed factor.",
    proof: "An algebraic proof shows that a claim follows from valid steps for every allowed value. One example can support a guess; a counterexample can disprove it.",
    cas: "A computer algebra system can simplify or solve symbolic expressions. Read each step and check its conditions, because dividing or taking roots can lose or add possible answers.",
    advanced: "Advanced algebra combines familiar rules in harder settings: functions, inequalities, equations, and structures. Break a problem into parts and check where each transformation is allowed.",
    classic: "Classic algebra problems turn a story into variables and equations. Choose what the letters mean, solve the relationships, then check whether the answer fits the original story."
  },
  "algebraic-structures": {
    home: "An algebraic structure starts with a set of objects and a rule for combining them. Different properties of that rule create useful families such as groups, rings, and lattices.",
    "structure-test": "To identify a structure, test its rules one at a time: does combining stay inside the set, does grouping matter, is there a do-nothing element, and can actions be undone?",
    "cayley-tables": "A Cayley table lists the result of combining every pair of elements. Scan its rows and columns to spot closure, an identity, inverses, and patterns.",
    "semigroups-monoids": "A semigroup has an associative combination rule. A monoid adds an identity element that changes nothing. You do not need every element to have an inverse.",
    "posets-lattices": "A partial order says when one object is below another, though some pairs may be incomparable. A lattice has a best common lower bound and least common upper bound for every pair.",
    "boolean-algebra": "Boolean algebra works with true and false, or with sets under and, or, and not. Its simple laws are the foundation of logic circuits and search filters."
  },
  "number-systems": {
    home: "Different number systems answer different needs. Whole numbers count, integers include negatives, fractions express ratios, and real numbers fill the number line.",
    rational: "A rational number can be written as one integer divided by another nonzero integer. Its decimal either stops or repeats forever.",
    irrational: "An irrational number cannot be written as a fraction of two integers. Its decimal continues without a repeating block, even though it has a precise place on the number line.",
    "real-line": "The real number line places every rational and irrational value in order. Distance from zero is absolute value; an interval selects a stretch of the line.",
    hierarchy: "Each larger number family includes smaller ones: counting numbers sit inside integers, integers inside fractions, and fractions inside real numbers. Classify a value by the smallest family it fits.",
    concepts: "A number system has rules about order, operations, and gaps. Fractions are dense, meaning another fraction lies between any two, but they still miss values such as √2.",
    practice: "Keep fractions and roots exact while calculating, then round only at the end. Estimate first so an impossible decimal answer is easy to catch."
  },
  calculus: {
    home: "Calculus studies two big ideas: how fast something changes right now and how much accumulates over time. Derivatives answer the first question; integrals answer the second.",
    limits: "A limit asks what value a function approaches near a point, even if the function is missing at that exact point. Look from both sides to see whether they agree.",
    derivatives: "A derivative is the slope at one instant. For a moving object, it turns position into speed. On a graph, it tells whether the curve is rising, falling, or flat.",
    "derivative-applications": "Use a derivative to find a best value or a changing rate. First write the quantity you care about, then find where its slope is zero or where its allowed range ends.",
    integration: "An integral adds up tiny contributions. It can measure area under a curve, distance from speed, or total change from a changing rate.",
    "integration-techniques": "Some integrals need a change of viewpoint. Substitution undoes a chain rule, integration by parts undoes a product rule, and partial fractions split a rational expression into simpler pieces.",
    "integral-applications": "Break a changing object or process into thin slices. Add each slice's area, volume, work, or mass with an integral, keeping the units attached.",
    "differential-equations": "A differential equation gives a rule for change instead of the final function. Starting from one value, solve or step forward to see the path that follows that rule.",
    "series-parametric-polar": "A series builds a value by adding many terms. Parametric curves describe a path using time; polar curves describe a point using distance and angle. Each view makes different patterns easier to see.",
    "multivariable-vector": "When an output depends on several inputs, you can change one input at a time or move in any direction. The gradient arrow points toward the steepest local increase.",
    jacobians: "A coordinate change redraws the same region with new labels. The Jacobian tells how much a tiny area or volume stretches, so an integral still counts the right amount.",
    "beta-gamma": "Gamma extends the factorial pattern beyond whole numbers. Beta combines two powers on an interval and is useful for probability models whose values stay between zero and one.",
    "series-tests": "An infinite series can settle to a finite total or keep growing. A convergence test checks the pattern of its terms so you know whether adding forever makes sense.",
    "curve-tracing": "To understand a curve, check where it exists, crosses axes, turns, bends, and approaches a line. Put those clues together before sketching.",
    "taylor-two-variables": "Near a chosen point, a smooth surface can be approximated by a tilted plane plus a bend. The approximation is best close to that point.",
    "lagrange-multipliers": "If you must stay on a boundary while looking for the highest or lowest value, the best point often occurs where the objective and boundary point in matching directions.",
    "change-order": "A double integral adds values over a region. You may sweep across it horizontally or vertically, but you must redraw the limits so both sweeps cover exactly the same region.",
    centroid: "A centroid is a balancing point. Give each tiny piece of an object a weight, average its position, and divide by the total weight.",
    "moments-of-inertia": "Moment of inertia measures how hard it is to spin an object around an axis. Mass farther from the axis matters much more than mass close to it.",
    "integral-engineering": "Multiple integrals add tiny pieces across a surface or solid. They can find mass, average temperature, or material use when density changes from place to place.",
    advanced: "Advanced calculus brings limits, rates, accumulation, and several variables together. Draw the situation, check the theorem's conditions, and pay attention to boundaries or points where a formula fails."
  },
  "advanced-concepts": {
    "continued-fractions": "A continued fraction repeatedly takes a whole part and turns the remaining fraction upside down. Cutting the process short gives fractions that often approximate a number remarkably well.",
    "famous-problems": "Some mathematical questions are solved, and others remain open. Try small cases to understand a claim, but remember that many successful examples are not a proof for every case.",
    "stats-inference": "A sample gives a clue about a larger population. An interval shows how uncertain that clue is, while a test asks whether the sample conflicts with a chosen starting claim.",
    "differential-equations": "This lab starts with a rule for how a quantity changes. Use a starting value to trace its future, then compare an exact formula with small-step estimates.",
    "special-functions": "Some useful curves and totals cannot be written with familiar elementary functions. Mathematicians give them names, such as Gamma or the error function, so their values and patterns can still be studied."
  },
  "statistics-extended": {
    "survey-sampling": "A survey must represent the people it claims to describe. Split a population into useful groups, sample within them, and combine answers using the groups' real sizes.",
    "design-of-experiments": "An experiment changes one or more conditions to see what they cause. Random assignment reduces bias, repeated trials show noise, and blocks make fair comparisons within similar groups.",
    "quality-control": "A control chart watches whether a process stays steady over time. Customer limits ask a different question: even a steady process may make products outside the allowed range.",
    "time-series": "Time-series data arrive in order. Look for a long-term direction, repeating seasons, and leftover noise, then test forecasts on later dates rather than mixing past and future.",
    nonparametric: "When exact values are unreliable or strongly skewed, compare order and ranks instead. The right test depends on whether observations are paired, in two groups, or in several groups.",
    "multivariate-analysis": "Several measurements can move together. Multivariate methods study them as a group, finding shared directions, unusual combinations, or differences that separate groups.",
    "advanced-inference": "Inference turns observations into estimates while keeping track of uncertainty. Compare different estimators and intervals by how they behave across many possible samples.",
    "official-statistics": "Official statistics summarize populations using surveys and records. Read the definition, time period, and weighting before comparing two published numbers.",
    "survival-analysis": "Survival analysis studies time until an event, such as failure or recovery. Someone who leaves a study early still tells us they lasted at least that long.",
    "actuarial-reliability": "Insurance and reliability models combine the chance of an event with its cost or timing. Average expected loss is a starting point, but large rare losses also matter.",
    "statistical-computing": "When a formula is hard to work out, let a computer repeat the experiment. Resampling and simulation show how a statistic might vary and how surprising an observed result is.",
    "applied-modelling": "Choose a model that matches the outcome: a number, a yes-or-no event, or a count. Fit it on data, then check its predictions and errors on new cases.",
    "school-statistics": "Organize data so you can see what is typical and what varies. Use a table or picture, find a useful center, and check whether a few unusual values distort it."
  },
  "statistics-phase": {
    module: "Probability describes possible outcomes and their chances. Statistics starts with observed outcomes and works backward to learn about the process that produced them.",
    distributions: "A distribution is a map of likely and unlikely outcomes. Choose one by asking what can happen: a count, a wait, a measurement, or a choice among categories.",
    sampling: "Different random samples give different answers. A sampling distribution shows that variation, and a larger sample usually makes the answer more stable.",
    inference: "Inference uses a sample to make a careful claim about a population. Report both the estimate and its uncertainty, then say what a test result does and does not show.",
    regression: "A regression line predicts an outcome from inputs. The distances between observed and predicted values are residuals; their pattern can reveal a poor model.",
    bayesian: "Bayesian reasoning starts with an earlier belief and updates it using new evidence. The same positive test can mean different things when the condition is common or rare.",
    stochastic: "A stochastic process changes over time with randomness. A state can lead to different next states, so we describe chances for paths rather than one certain path.",
    "advanced-models": "Real data can have linked measurements or several hidden groups. Advanced models represent those links and groups instead of forcing every observation into one simple bell curve."
  },
  "distribution-detail": {
    bernoulli: "A Bernoulli outcome is one yes-or-no result, such as one click or one missed shot. Its success chance is p, and its failure chance is what remains: one minus p.",
    categorical: "A categorical outcome picks one named group, such as basic, pro, or enterprise. Each group has a chance, and all those chances must add up to one.",
    "discrete-uniform": "A discrete uniform model gives the same chance to each separate outcome. A fair six-sided die is an example: each face has probability one sixth.",
    binomial: "A binomial count tells how many successes occur in a fixed number of independent yes-or-no trials, each with the same success chance.",
    geometric: "A geometric model counts how many tries you need until the first success. If each try has the same chance and is independent, a long wait becomes less likely.",
    "negative-binomial": "This model counts the tries needed to reach a chosen number of successes, such as calls until a fifth sale. It extends the first-success idea of the geometric model.",
    hypergeometric: "Use this when drawing from a fixed group without putting items back. Each draw changes what remains, so later chances depend on earlier results.",
    poisson: "A Poisson model counts events in a fixed time or area when events arrive independently at an average rate, such as calls in one hour.",
    "poisson-binomial": "This counts successes across independent yes-or-no trials whose success chances differ. It fits a group of customers with different click probabilities better than an ordinary binomial model.",
    "beta-binomial": "A beta-binomial model counts successes when the success chance itself varies between groups or batches. That extra variation makes extreme counts more common than a simple binomial predicts.",
    zipf: "Zipf describes ranked items when the top few are very common and many others are rare. Word frequencies and city sizes often show this steep rank pattern.",
    "continuous-uniform": "A continuous uniform model spreads probability evenly across an interval. Equal-length parts of the interval have equal chance, but any one exact point has probability zero.",
    normal: "A normal distribution is the familiar bell curve. Values near the center are common, while values far away on either side become rarer.",
    exponential: "An exponential model describes the wait until the next event when events arrive at a steady average rate. It does not remember how long you have already waited.",
    gamma: "Gamma models the wait until several events have happened. It adds together waiting times, so changing the required event count changes the curve's shape.",
    beta: "A beta distribution lives between zero and one, making it useful for uncertain probabilities or proportions. Its two settings can favor low values, high values, or values near the middle.",
    "chi-square": "A chi-square value adds squared normal deviations. It cannot be negative and appears when measuring variation or comparing observed counts with expected counts.",
    "student-t": "Student's t looks like a bell curve with heavier tails. It accounts for extra uncertainty when a sample is small and the population spread must be estimated.",
    f: "An F value compares two estimates of variation. A large value can mean one source of variation is much bigger than the ordinary noise used for comparison.",
    lognormal: "A lognormal value is always positive and often has a long right tail. It appears when many small multiplying effects build a size, price, or duration.",
    weibull: "Weibull models how long something lasts before failure. Changing its shape can represent early defects, roughly steady risk, or wear that increases with age.",
    cauchy: "A Cauchy curve has a center but extremely heavy tails. Very large values happen often enough that an ordinary average does not settle to a stable number.",
    laplace: "A Laplace curve rises to a sharper peak than a normal bell and falls away on both sides. It is linked to methods that care about absolute rather than squared errors.",
    logistic: "The logistic curve is a smooth S-shaped way to turn a score into a probability. Its related distribution describes how values spread around a center.",
    pareto: "A Pareto model describes many modest values and a few very large ones, such as some wealth or loss sizes. Its tail setting controls how common the extremes are.",
    rayleigh: "A Rayleigh value is a distance from zero made from two independent sideways measurements. It is useful for random signal strength or position error magnitude.",
    triangular: "A triangular model uses a smallest value, largest value, and most likely value. It is a simple choice when you know those three points but have little data."
  },
  "geometry-concepts": {
    "points-lines-rays": "A point marks a place. A line continues both ways, a ray starts at one point and continues one way, and a segment has two endpoints and a length.",
    angles: "An angle measures a turn between two rays. A full turn is 360 degrees, a straight turn is 180 degrees, and a square corner is 90 degrees.",
    "parallel-lines": "Parallel lines stay the same distance apart and never meet on a flat plane. A line crossing them creates matching angle pairs that help solve unknown angles.",
    triangles: "Three sides form a triangle only when each pair adds to more than the third side. Its three inside angles always total 180 degrees on a flat plane.",
    "pythagorean-theorem": "In a right triangle, the two shorter sides' squares add to the longest side's square. Use this rule to find a missing side, then check which side is longest.",
    "triangle-congruence": "Congruent triangles are the same size and shape. Enough matching sides and angles prove they fit exactly, even if one is turned or flipped.",
    "similar-triangles": "Similar triangles have matching angles but may differ in size. Corresponding sides grow by the same scale factor, letting you find an unknown length.",
    quadrilaterals: "A quadrilateral has four sides. Rectangles, squares, parallelograms, and other families have extra rules about equal sides, parallel sides, or right angles.",
    polygons: "A polygon is a closed shape built from straight edges. Break it into triangles to understand its angle sum and area.",
    circles: "A circle contains all points the same distance from a center. That distance is the radius; it controls circumference, area, chords, and arcs.",
    "arcs-sectors": "An arc is part of a circle's curved edge. A sector is the slice between two radii and that arc; its angle tells what fraction of the whole circle it uses.",
    "chords-secants": "A chord joins two points on a circle. A secant is a line that crosses the circle twice. Their intersections create useful length and angle relationships.",
    tangents: "A tangent touches a circle at exactly one point. The radius to that touching point meets the tangent at a right angle.",
    "coordinate-geometry": "Coordinates give each point a pair of numbers. Use them to calculate slope, distance, midpoint, and where lines meet.",
    transformations: "Move a figure by sliding, turning, flipping, or scaling. Compare the original and image to see which lengths, angles, and directions stay the same.",
    symmetry: "A figure is symmetric when a reflection or turn makes it match itself. A symmetry line splits mirror halves; rotational symmetry repeats after a turn.",
    "area-perimeter": "Perimeter measures distance around a flat shape. Area measures how much surface it covers. Keep their units different: length units versus square units.",
    "mensuration-3d": "Three-dimensional measurement covers a solid's outside and inside. Use surface area for wrapping and volume for how much space the solid occupies.",
    "surface-area-volume": "Surface area adds the areas of all exposed faces. Volume counts space inside. Doubling every length multiplies surface area by four and volume by eight.",
    "geometric-constructions": "A construction uses exact steps to create a figure, such as a bisector or perpendicular line. The result should keep its rule when the starting points move.",
    loci: "A locus is the collection of all points that obey one condition. Points a fixed distance from one center form a circle; points equally far from two centers form a bisector.",
    "trig-in-geometry": "An angle and one side can tell you another length in a triangle. Sine, cosine, and tangent turn a geometry drawing into a calculation."
  },
  "trigonometry-concepts": {
    "unit-circle": "A point turning around a circle of radius one has horizontal coordinate cosine and vertical coordinate sine. Read both values from the point's position.",
    "trigonometric-functions": "Sine, cosine, and tangent turn an angle into a number. A triangle gives side ratios, while a circle explains values for angles of any size.",
    "right-triangle-ratios": "Choose one acute angle in a right triangle. Sine uses opposite over hypotenuse, cosine uses adjacent over hypotenuse, and tangent uses opposite over adjacent.",
    "degree-radian": "Degrees and radians are two ways to measure the same turn. A full circle is 360 degrees or 2π radians.",
    "special-angles": "Angles such as 30, 45, and 60 degrees come from simple right triangles. Their sine and cosine values can be found exactly instead of rounded.",
    "quadrant-signs": "The quadrant tells whether the horizontal cosine and vertical sine coordinates are positive or negative. Tangent's sign follows from their ratio.",
    "sine-graph": "The sine graph records the vertical position of a point going around a circle. It rises and falls between minus one and one, repeating after a full turn.",
    "cosine-graph": "The cosine graph records the horizontal position of a turning point. It starts at one, reaches minus one halfway around, and repeats every full turn.",
    "tangent-graph": "Tangent compares sine with cosine. Its graph shoots up or down near angles where cosine is zero, so it has breaks rather than a fixed height.",
    "reciprocal-graphs": "Secant, cosecant, and cotangent are the upside-down values of cosine, sine, and tangent. Their graphs break wherever the original value is zero.",
    "reciprocal-ratios": "A reciprocal ratio flips a fraction. Cosecant is one over sine, secant is one over cosine, and cotangent is one over tangent.",
    "pythagorean-identity": "The unit circle's horizontal and vertical distances make a right triangle with long side one. That is why cosine squared plus sine squared always equals one.",
    "complementary-angles": "Two angles are complementary when they add to 90 degrees. In a right triangle, swapping those two angles swaps opposite and adjacent sides, linking sine with cosine.",
    "sum-difference": "The sine or cosine of two angles added together can be found from the sine and cosine of each angle. Picture two rotations happening one after the other.",
    "double-angle": "A double-angle rule describes a turn twice as large. It can turn a product such as two sine times cosine into the sine of twice the angle.",
    "half-angle": "A half-angle rule works backward from a known angle to half of it. Check the new angle's quadrant before choosing a positive or negative square root.",
    "product-to-sum": "A product of two waves can be rewritten as a sum of waves. This helps reveal the frequencies hidden inside a combined signal.",
    "triple-angle": "A triple-angle rule describes three copies of the same turn. It rewrites the sine or cosine of three times an angle using the original angle.",
    "inverse-trig": "Inverse trigonometry finds an angle from a ratio. Because many angles share a sine or cosine, the inverse chooses one standard answer range.",
    "inverse-principal-values": "A principal value is the one angle an inverse trig function is allowed to return. Restricting the output range makes the inverse a true function.",
    "trig-equations": "A trig equation asks which angles make a ratio equal a chosen value. Find one angle, then use symmetry and repetition to find the rest.",
    "general-solutions": "Sine and cosine repeat after a full turn. A general solution includes every matching angle by adding whole numbers of full turns.",
    "trig-inequalities": "A trig inequality asks where a wave is above or below a chosen level. Mark crossings on one cycle, select the correct intervals, then repeat them.",
    "height-distance": "Measure a horizontal distance and an angle of elevation to find a height. Draw a right triangle and use tangent when height is opposite the angle.",
    "bearings-navigation": "A bearing is a direction measured clockwise from north. Draw the direction and distance as a triangle before calculating east and north movement.",
    "law-of-sines": "In any triangle, each side divided by the sine of its opposite angle has the same value. Use a known side-and-opposite-angle pair to find another.",
    "law-of-cosines": "The cosine law extends the right-triangle square rule to any triangle. It relates three sides and the angle between two of them.",
    "ambiguous-case": "With two sides and an angle opposite one side, a triangle problem may have zero, one, or two answers. Draw the possible triangles before choosing an angle.",
    "trig-triangle-area": "Two sides and their included angle determine a triangle's area. Take half their product and multiply by the angle's sine.",
    "polar-coordinates": "Polar coordinates locate a point by how far it is from the origin and which direction it lies. They can make circles and rotating patterns easier to describe.",
    "polar-roses": "A polar rose is a flower-like curve made by a repeating sine or cosine radius. Its frequency controls how many petals appear.",
    "complex-de-moivre": "A complex number written as length and angle becomes easy to raise to a power: raise the length and multiply the angle. This is De Moivre's idea.",
    "trig-limits": "Trig limits describe how sine, cosine, or tangent behave near an angle. Near zero radians, sine is close to the angle itself, which helps with many limit calculations.",
    "trig-derivatives": "A trig derivative tells how quickly a sine or cosine wave changes at one point. Sine changes like cosine, while cosine changes like negative sine.",
    "trig-integrals": "A trig integral adds up the values of a wave over an interval. Positive and negative parts can cancel, so signed total and physical area may differ.",
    orthogonality: "Two waves are orthogonal over an interval when their positive and negative products cancel out. This makes it possible to separate different frequencies in a mixed signal.",
    "fourier-trig-series": "A Fourier series builds a repeating pattern by adding sine and cosine waves of different frequencies. Each wave contributes its own amount to the final shape.",
    "spherical-trigonometry": "Triangles drawn on a sphere follow curved great-circle paths. Their angles can add to more than 180 degrees, unlike triangles on a flat sheet.",
    "hyperbolic-functions": "Hyperbolic sine and cosine resemble ordinary sine and cosine in their formulas but describe different curves. They appear in hanging cables and some growth equations.",
    "wave-amplitude": "Amplitude measures how far a wave rises above or falls below its middle line. Doubling amplitude makes the peaks and troughs twice as far from that line.",
    "wave-period-frequency": "A period is the time for one full repeat. Frequency counts repeats per unit time, so a shorter period means a higher frequency.",
    "phase-shift": "A phase shift moves a wave left or right without changing its shape. It tells whether one repeating event leads or follows another.",
    "eclipse-trigonometry": "Eclipse geometry uses angles and distances to describe how one body blocks light from another. Similar triangles connect the sizes of the bodies and shadows.",
    "real-world-waves": "Sound, light, tides, and alternating current can all repeat like waves. Amplitude, frequency, and phase describe how large, how fast, and when each wave peaks.",
    "inquiry-experiments": "Change one wave or angle setting at a time, predict what should happen, and compare the picture with your prediction. A good experiment explains both matches and surprises."
  }
}, i = (t, n, r, l, h, p) => {
  const u = (v) => {
    const [m, w, d] = v.split(" :: ");
    return { title: m, setup: w, result: d };
  };
  return { principle: t, method: n, caution: r, examples: [u(l), u(h), u(p)] };
}, De = {
  "differential-equations": {
    laplace: i("The Laplace transform converts a time-domain initial-value differential equation into an algebraic relation in s. Delayed forcing carries an exponential factor e^(-sτ).", "For y′+ay=b u(t−τ), transform to (s+a)Y(s)=y₀+b e^(-sτ)/s; invert the initial decay and delayed response separately.", "Transforms need convergence assumptions; a formula for this constant-coefficient family does not solve arbitrary nonlinear equations.", "Unforced decay :: y′+2y=0, y₀=3. :: Y=3/(s+2), so y=3e^(-2t).", "Step forcing :: y′+2y=4u(t), y₀=0. :: y=2(1-e^(-2t)) for t≥0.", "Delayed switch :: Same forcing starts at τ=1. :: Response is zero before 1 and 2(1-e^(-2(t−1))) afterward."),
    pde: i("A partial differential equation relates derivatives in several independent variables. Separated sine modes satisfy homogeneous Dirichlet boundaries on a finite interval.", "For heat, multiply sin(nπx/L) by exp(−κ(nπ/L)²t). For a wave with zero initial velocity, multiply it by cos(cnπt/L).", "A separated mode is one special solution. General initial data require a convergent series of modes; boundary and initial conditions determine coefficients.", "Heat mode :: L=π, n=1, κ=1, amplitude=1. :: u=e^(−t)sin x.", "Wave mode :: L=π, n=2, c=1. :: u=cos(2t)sin(2x), with zero initial velocity.", "Boundary check :: Evaluate any sine mode at x=0 and x=L. :: Both values are zero for integer n."),
    "boundary-values": i("Boundary-value problems prescribe values at different spatial points, rather than all data at one initial point. Nonzero solutions of an eigenvalue problem exist only at allowed spectral values.", "For −u″=λu with u(0)=u(L)=0, use sine solutions: λₙ=(nπ/L)² and uₙ=A sin(nπx/L), n≥1.", "A zero function satisfies the homogeneous equation for every λ; an eigenfunction must be nonzero. Other boundary conditions give different spectra.", "First mode :: L=π, n=1. :: λ=1 and u=sin x.", "Second mode :: L=π, n=2. :: λ=4 and u=sin(2x), with one interior zero.", "Interval scale :: Double L with fixed n. :: λ_new=λ_old/4; the eigenvalue becomes one quarter as large."),
    home: i("A differential equation relates an unknown function to its rates of change. Its order is the highest derivative; a family of solutions becomes one trajectory when enough initial conditions are supplied.", "Start by identifying order, linearity, and the source of each term. Use a slope field or phase portrait to check that the predicted behavior agrees with the equation.", "A numerical curve that looks plausible is not proof: substitute it into the equation and check initial data.", "Cooling tea :: T′=-0.2(T-22), T(0)=82 °C. :: T(t)=22+60e^(-0.2t); the temperature approaches 22 °C.", "Bank balance :: B′=0.05B with B(0)=1000. :: B(t)=1000e^(0.05t); growth is proportional to the balance.", "Spring :: x″+4x=0, x(0)=1, x′(0)=0. :: x(t)=cos(2t); the natural period is π."),
    explorer: i("Order counts the highest derivative, while linearity asks whether y and its derivatives appear only to the first power with coefficients depending on the independent variable. A general solution carries arbitrary constants; an initial value fixes them.", "Rewrite the equation in standard form before classifying it. For a first-order equation, compare the right-hand side with f(x)g(y), P(x)y+Q(x), and Mdx+Ndy structures.", "A nonlinear forcing function of x alone does not make an equation nonlinear in y.", "Drug elimination :: C′=-0.3C is first-order linear and separable. :: C(t)=C₀e^(-0.3t); one initial concentration fixes C₀.", "Damped spring :: x″+2x′+5x=0 is second-order linear. :: Two independent initial values, position and velocity, select a motion.", "Crowded population :: P′=rP(1-P/K) is first-order nonlinear. :: The P² term breaks linearity and K is an equilibrium."),
    "slope-fields": i("For y′=f(x,y), each point (x,y) gets a small line segment of slope f(x,y). A solution curve is tangent to every segment it passes through; equilibrium curves have zero slope.", "Evaluate f at a grid of points, draw short equal-length ticks, then trace curves following their direction. Compare several initial points to see the solution family.", "A direction field shows local slope, not the speed along a parametrized trajectory.", "Exponential growth :: y′=y has horizontal ticks at y=0. :: Curves above zero rise, and y=Ce^x stays tangent to the field.", "Cooling field :: T′=-0.2(T-20). :: T=20 is horizontal; trajectories above it slope down and below it slope up.", "Slope depends on x :: y′=x gives the same tick across each vertical line. :: Integrating yields y=x²/2+C, a family of parabolas."),
    "initial-value": i("An initial value problem pairs an ODE with data such as y(x₀)=y₀. Under local continuity and a suitable Lipschitz condition in y, the initial point determines one nearby solution.", "Solve for the arbitrary constant after obtaining a general family, or start a numerical integrator exactly at (x₀,y₀). Verify both the equation and the initial condition.", "For a second-order equation one position alone is usually insufficient; velocity is also needed.", "Cooling :: T′=-0.1(T-20), T(0)=80. :: T(t)=20+60e^(-0.1t).", "Falling with drag :: v′=10-2v, v(0)=0. :: v(t)=5(1-e^(-2t)); terminal speed is 5.", "Second-order launch :: x″=-9.8, x(0)=0, x′(0)=20. :: x(t)=20t-4.9t²; both initial data are used."),
    separable: i("An equation y′=f(x)g(y) is separable where g(y) is nonzero: dy/g(y)=f(x)dx. Integrating both sides produces an implicit or explicit solution family.", "Find equilibria from g(y)=0 before dividing, then separate and integrate. Apply an initial value only after retaining the possible constant solutions.", "Dividing by y can discard y=0, which may be a valid solution.", "Population :: P′=0.4P, P(0)=50. :: ln|P|=0.4t+C gives P=50e^(0.4t).", "Mixing :: y′=xy, y(0)=2. :: ln|y|=x²/2+C gives y=2e^(x²/2).", "Saturation :: y′=y(1-y), y(0)=1/2. :: Partial fractions give y=1/(1+e^(-t)); y=0 and y=1 are equilibria."),
    "homogeneous-first-order": i("A first-order slope f(x,y) is homogeneous of degree zero when f(tx,ty)=f(x,y). Then it depends only on y/x, so y=vx reduces the equation to one in v and x.", "Set v=y/x and use y′=v+xv′. After substitution, separate the resulting equation, integrate, and replace v by y/x.", "This use of 'homogeneous' differs from the zero-forcing term in linear ODEs; the substitution also requires x≠0.", "Scale-invariant field :: y′=y/x, x>0. :: v+xv′=v, so v=C and y=Cx.", "Mixed ray slope :: y′=1+y/x. :: xv′=1; v=ln x+C, giving y=x(ln x+C).", "Quadratic ratio :: y′=(x²+y²)/(xy). :: With v=y/x, xv′=1/v; v²=2ln|x|+C."),
    exact: i("M(x,y)dx+N(x,y)dy=0 is exact when it is dF=0 for a potential F. On a simply connected region with continuous partials, M_y=N_x is the local test.", "Integrate M in x to get F(x,y)=∫Mdx+g(y), differentiate in y, and choose g so F_y=N. The solution is F(x,y)=C.", "The matching-partials test can fail to guarantee one global potential if the domain has a hole.", "Circular levels :: 2x dx+2y dy=0. :: M_y=N_x=0; F=x²+y² and solutions are circles x²+y²=C.", "Product levels :: y dx+x dy=0. :: F=xy, so xy=C; the field follows hyperbolas.", "Missing y term :: (2xy+3)dx+(x²+4y)dy=0. :: Integrate M: F=x²y+3x+g(y); g′=4y, so F=x²y+3x+2y²=C."),
    "linear-first-order": i("The standard linear equation y′+P(x)y=Q(x) has an integrating factor μ=e^(∫P dx). Multiplication makes the left side (μy)′.", "Identify P and Q, compute μ, integrate μQ, then divide by μ. Check the result by differentiation and apply initial data.", "Normalize the coefficient of y′ first; an equation can be linear even when P(x) is not constant.", "Charging circuit :: q′+2q=6, q(0)=0. :: μ=e^(2t); q=3(1-e^(-2t)).", "Variable coefficient :: y′+(1/x)y=x for x>0. :: μ=x; (xy)′=x², so y=x²/3+C/x.", "Decay with input :: y′+y=e^(-t), y(0)=0. :: (e^t y)′=1, hence y=te^(-t)."),
    bernoulli: i("A Bernoulli equation y′+P(x)y=Q(x)yⁿ is nonlinear for n other than 0 or 1 but becomes linear under v=y^(1-n).", "Multiply by (1-n)y^(-n), use v′=(1-n)y^(-n)y′, solve the new first-order linear equation, then substitute back.", "The transformation may divide by y; check y=0 separately and restrict the domain when fractional powers occur.", "Quadratic response :: y′+y=y². :: Let v=1/y; v′-v=-1, so v=1+Ce^t and y=1/(1+Ce^t).", "Inverse decay :: y′-2y=3y³. :: v=y^(-2) gives v′+4v=-6, a linear equation.", "Degenerate case :: y′+2y=3y with n=1. :: This is already linear: y′=y, so y=Ce^t."),
    "method-selector": i("A solving method follows the equation's structure. More than one label may apply; choose the method that produces the simplest valid transformation.", "Test separability, homogeneous ratio y/x, exactness, linear standard form, and Bernoulli power in that order. State the required domain and verify the result.", "Do not classify by appearance alone: multiplying an equation by a factor can reveal exactness or separability.", "Tank concentration :: C′=-kC. :: Separable and linear; separation immediately gives C=C₀e^(-kt).", "Implicit contour :: 2xy dx+x²dy=0. :: M_y=N_x=2x, so exactness gives x²y=C.", "Nonlinear power :: y′+y=xy². :: Bernoulli n=2; v=1/y converts it to a linear equation."),
    euler: i("Euler's method advances y′=f(x,y) by y_(n+1)=y_n+h f(x_n,y_n). It follows the starting tangent for a whole step, so curvature creates truncation error.", "Evaluate the slope at the current point, multiply by step h, update x and y, and repeat. Halving h generally reduces first-order global error by about a factor of two.", "A small step does not guarantee stability for every equation; stiff decay can make explicit Euler oscillate or blow up.", "Growth :: y′=y, y(0)=1, h=0.1. :: First step y₁=1.1; exact e^0.1≈1.1052.", "Cooling :: T′=-0.2(T-20), T₀=80, h=1. :: Slope is -12 °C/min; Euler predicts T₁=68 °C.", "Stability :: y′=-10y, h=0.3. :: Update factor 1-10h=-2, so numerical values alternate and grow despite exact decay."),
    heun: i("Heun's improved Euler method predicts an endpoint with Euler and averages the slopes at the start and predicted endpoint. It is an explicit second-order Runge–Kutta method.", "Compute k₁=f(x_n,y_n), y*=y_n+hk₁, k₂=f(x_n+h,y*), then y_(n+1)=y_n+h(k₁+k₂)/2.", "The second slope uses the predicted endpoint, not an exact future value.", "Growth :: y′=y, y₀=1, h=0.1. :: k₁=1, y*=1.1, k₂=1.1; y₁=1.105, close to e^0.1.", "Constant acceleration :: v′=2t, v(0)=0, h=1. :: Start/end slopes 0 and 2 average to 1; v₁=1, exact here.", "Cooling :: T′=-0.2(T-20), T₀=80, h=1. :: Predictor 68 gives end slope -9.6; corrected T₁=69.2."),
    rk4: i("Classical RK4 samples four slopes: at the start, twice near the midpoint, and at the endpoint. Weighted average (k₁+2k₂+2k₃+k₄)/6 gives fourth-order global accuracy for smooth problems.", "Use k₁=f(x,y), k₂=f(x+h/2,y+hk₁/2), k₃=f(x+h/2,y+hk₂/2), k₄=f(x+h,y+hk₃), then advance by h times their weighted mean.", "Fourth-order accuracy does not remove stability restrictions or guarantee accuracy at discontinuities.", "Growth :: y′=y, y₀=1, h=0.1. :: RK4 gives 1.1051708, agreeing with e^0.1 to displayed precision.", "Cooling :: T′=-0.2(T-20), T₀=80, h=1. :: RK4 gives about 69.124 °C; exact value is 20+60e^(-0.2).", "Oscillation :: y″=-y becomes (y,v)′=(v,-y). :: RK4 follows the circular phase trajectory more closely than Euler at equal h."),
    "growth-models": i("Exponential growth P′=rP assumes a constant per-capita rate. Logistic growth P′=rP(1-P/K) reduces that rate as population approaches carrying capacity K.", "Find equilibria first, separate variables or integrate numerically, then compare early-time growth with the limiting behavior.", "K is an environmental model parameter, not a fixed law; changing resources changes the forecast.", "Bacteria :: P′=0.4P, P(0)=100. :: After 5 hours P=100e²≈739 cells in the idealized model.", "Resource limit :: P′=0.4P(1-P/1000), P(0)=100. :: P(t)=1000/(1+9e^(-0.4t)); growth slows near 1000.", "Drug clearance :: C′=-0.3C, C(0)=20. :: The half-life is ln2/0.3≈2.31 time units."),
    "higher-order-linear": i("A constant-coefficient equation ay″+by′+cy=0 has characteristic polynomial ar²+br+c. Distinct real roots give exponentials, a repeated root adds xe^(rx), and complex roots give damped sine and cosine.", "Find roots, choose the matching basis of independent solutions, then solve constants from position and derivative initial data.", "A repeated root does not give two copies of the same exponential; the second independent solution needs x.", "Two decay rates :: y″+3y′+2y=0. :: Roots -1,-2 yield y=C₁e^(-t)+C₂e^(-2t).", "Repeated root :: y″+2y′+y=0. :: (r+1)²=0 gives y=(C₁+C₂t)e^(-t).", "Oscillation :: y″+4y=0, y(0)=1, y′(0)=0. :: Roots ±2i give y=cos(2t)."),
    "undetermined-coefficients": i("For constant-coefficient linear ODEs with polynomial, exponential, sine, or cosine forcing, a finite trial family is closed under differentiation. Substitute a matching trial for the particular solution.", "Find y_h, choose a trial matching the forcing, multiply by t enough times if it overlaps y_h, solve coefficients, and set y=y_h+y_p.", "This method does not generally handle arbitrary forcing such as ln t or tan t; use variation of parameters instead.", "Constant input :: y″+y=1. :: Trial y_p=A gives A=1, so y=C₁cos t+C₂sin t+1.", "Resonance :: y″+y=cos t. :: Cos t belongs to y_h; trial t(A sin t+B cos t) yields y_p=(t/2)sin t.", "Exponential forcing :: y′+2y=e^t. :: Trial Ae^t gives 3A=1, so y_p=e^t/3."),
    "variation-of-parameters": i("Variation of parameters works for general forcing in a linear equation y″+p(x)y′+q(x)y=g(x). It lets the homogeneous coefficients vary with x.", "For independent y₁,y₂ and W=y₁y₂′-y₁′y₂, compute u₁′=-y₂g/W and u₂′=y₁g/W, then y_p=u₁y₁+u₂y₂.", "First divide by the coefficient of y″; the formulas assume the normalized forcing g and W≠0 on the interval.", "Non-polynomial input :: y″+y=sec t on |t|<π/2. :: With y₁=cos t, y₂=sin t, W=1; the method integrates -tan t and 1.", "Constant input :: y″+y=1. :: Integrals give a particular solution y_p=1, matching undetermined coefficients.", "Exponential input :: y″-y=e^(2t). :: y₁=e^t, y₂=e^(-t); a particular solution is e^(2t)/3."),
    "cauchy-euler": i("In a Cauchy–Euler equation x²y″+axy′+by=0, powers y=x^m are eigenfunctions of the differential operator. Substitution gives m(m-1)+am+b=0.", "Solve the indicial quadratic. Distinct real roots give x^m; a repeated root adds x^m ln x; complex roots yield powers times sin and cos of ln x.", "Use an interval excluding x=0; ln x formulas conventionally work on x>0.", "Distinct powers :: x²y″-2xy′+2y=0. :: m²-3m+2=0, so y=C₁x+C₂x².", "Repeated power :: x²y″-xy′+y=0. :: (m-1)²=0, so y=x(C₁+C₂ln x).", "Log oscillation :: x²y″+xy′+y=0. :: m²+1=0, so y=C₁cos(ln x)+C₂sin(ln x)."),
    systems: i("A linear system z′=Az is governed by the eigenvalues and eigenvectors of A. Real parts control growth or decay; imaginary parts create rotation in phase space.", "Compute trace, determinant, and eigenvalues, then sketch invariant directions and trajectories. Use z(0) to select a particular solution.", "A zero real part alone is inconclusive for nonlinear systems; linearization can require higher-order analysis.", "Saddle :: A=diag(1,-2). :: x=C₁e^t grows while y=C₂e^(-2t) decays; axes are invariant.", "Stable node :: A=diag(-1,-3). :: Both components decay toward the origin.", "Center :: A=[[0,-1],[1,0]]. :: Eigenvalues ±i yield circular trajectories with constant radius."),
    "phase-plane": i("The phase plane places a system's state (x,y) at one point and draws vector arrows (x′,y′). A trajectory follows the arrows as time advances.", "Find equilibria by solving x′=y′=0, inspect the Jacobian near each, and trace several initial states to see basins and invariant curves.", "Trajectories of a well-posed autonomous system cannot cross at the same state and time direction.", "Predator–prey :: x′=x(1-y), y′=y(x-1). :: (1,1) is an equilibrium surrounded by cycles in this ideal model.", "Damped spring :: x′=v, v′=-x-0.2v. :: Trajectories spiral inward as energy dissipates.", "Saddle :: x′=x, y′=-y. :: Initial states move away along x and toward zero along y."),
    "mechanical-oscillations": i("A mass–spring–damper obeys mx″+cx′+kx=F(t). The undamped natural frequency is √(k/m); ζ=c/(2√(mk)) separates underdamped, critical, and overdamped motion.", "Set m,k,c and initial displacement/velocity. Compare the roots of mr²+cr+k with the animation and the x(t) graph.", "Critical damping returns fastest without oscillation for this linear model; larger damping returns more slowly.", "Car suspension :: m=1,c=0.4,k=4. :: ζ=0.1; the motion oscillates while its envelope decays.", "Critical return :: m=1,k=4,c=4. :: ζ=1; the spring returns without overshoot.", "Undamped clock :: m=1,c=0,k=4. :: ω₀=2 rad/s and period π s."),
    "lcr-circuit": i("A series LCR circuit follows Lq″+Rq′+q/C=E(t), where charge q is analogous to displacement, inductance L to mass, R to damping, and 1/C to stiffness.", "Compute natural angular frequency 1/√(LC) and damping ratio (R/2)√(C/L). Current is i=q′; inspect both charge and current when changing R.", "A charge peak is not a current peak: current is the time derivative of charge.", "Underdamped circuit :: L=1 H,C=0.25 F,R=1 Ω. :: ω₀=2 rad/s, ζ=0.25; charge rings down.", "Critical resistance :: L=1 H,C=0.25 F. :: R_crit=2√(L/C)=4 Ω.", "Initial capacitor :: q(0)=1 C,i(0)=0,E=0. :: Energy begins in the capacitor, then exchanges with the inductor."),
    "newton-cooling": i("Newton's law models the rate of temperature change as T′=-k(T-T_a), where T_a is the ambient temperature and k>0 summarizes heat-transfer conditions.", "Separate or solve the linear equation: T(t)=T_a+(T₀-T_a)e^(-kt). The temperature gap halves after ln2/k.", "The model assumes a roughly constant ambient temperature and heat-transfer coefficient; a changing room needs a different forcing term.", "Hot coffee :: T₀=80 °C,T_a=20 °C,k=0.1/min. :: After 10 min, T≈42.1 °C.", "Warming bottle :: T₀=5 °C,T_a=25 °C,k=0.2/min. :: After 5 min, T≈17.6 °C, approaching from below.", "Half-gap time :: k=0.14/min. :: t_half=ln2/0.14≈4.95 min, independent of starting gap.")
  },
  geometry: {
    shapes: i("A shape is defined by geometric constraints, dimensions, and position. Perimeter and surface area measure boundary; area and volume measure occupied space. Scaling every length by k multiplies area by k² and volume by k³.", "Identify whether the object is a 2D figure or 3D solid, name the dimensions and units, then choose a formula derived from its construction. Check the result by decomposing it into familiar pieces or by changing one dimension in the explorer.", "A line segment has length but zero area; a flat circle has area but zero 3D volume. Surface area and volume use different powers of the length unit.", "Garden rectangle :: A 6 m by 4 m plot needs fencing and turf. :: Perimeter is 2(6+4)=20 m; area is 6·4=24 m².", "Water tank :: A cylinder has radius 2 m and height 3 m. :: Capacity is πr²h=12π m³≈37.7 m³; closed surface area is 2πr(r+h)=20π m².", "Scaled model :: A cube's side changes from 2 cm to 4 cm. :: Volume rises from 8 cm³ to 64 cm³, an eightfold increase because the scale factor is 2."),
    segment: i("A circular segment is the region between a chord and its arc. For a minor segment with radius r and central angle θ in radians, area is r²(θ−sinθ)/2: sector area minus the isosceles triangle.", "Measure radius and central angle, convert degrees to radians, compute sector and triangle areas separately, then subtract. Chord length is 2r sin(θ/2), and the segment height is r[1−cos(θ/2)].", "The area formula needs θ in radians. A major segment has area πr² minus the corresponding minor segment.", "Bridge arch :: A circular arch has r=10 m and θ=60°. :: The segment area is 50(π/3−√3/2)≈9.06 m².", "Lens chord :: A circular lens edge has r=10 cm and θ=60°. :: Chord length is 20sin30°=10 cm; segment height is 10(1−cos30°)≈1.34 cm.", "Major cap :: A disk has r=10 cm and its minor segment has θ=60°. :: Major segment area is 100π−9.06≈305.10 cm²."),
    home: i("Geometry studies properties that survive a construction or transformation. A useful investigation starts with a conjecture from measurement and ends with a reason it must hold.", "Drag dependent points, track invariant lengths and angles, then connect the picture to a congruence, similarity, or coordinate argument.", "A diagram can suggest a theorem but cannot prove it for every configuration.", "Bridge brace :: A triangular brace with sides 3,4,5 is rigid by SSS. :: Moving the frame without changing sides preserves its angles.", "Floor plan :: A 6 m by 4 m room has area 24 m². :: Doubling both dimensions quadruples area to 96 m².", "Wheel :: A wheel of radius 0.35 m travels 2πr≈2.20 m per revolution. :: Radius is a measurement, circumference is a derived distance."),
    construction: i("A geometric construction records dependencies: a midpoint depends on endpoints, and a perpendicular bisector depends on a segment. Dragging a parent recomputes all children while preserving the defining constraints.", "Create free points first, attach lines or circles to them, then test each invariant by dragging the free points. Identify which object is constrained by which theorem.", "A point that merely looks centered is not a constructed midpoint unless its dependency enforces equal halves.", "Perpendicular bisector :: Segment AB runs from (0,0) to (4,0). :: Midpoint is (2,0); its perpendicular bisector is x=2.", "Circle through a point :: Center O=(1,1), A=(4,5). :: Radius OA=5; every point on the circle stays 5 units from O.", "Angle bisector :: A 60° angle is bisected by a ray. :: The dependent rays each form 30° with the original sides."),
    triangles: i("Triangle rigidity follows from three non-collinear sides. Congruence preserves all lengths and angles; similarity preserves angles and scales every length by one factor.", "Use SSS, SAS, ASA, or AAS for congruence, and AA or proportional sides for similarity. Centers arise from intersecting special lines: medians, perpendicular bisectors, or altitudes.", "SSA does not always determine a unique triangle; it can produce two configurations.", "Roof truss :: Sides 3,4,5 make a right triangle because 3²+4²=5². :: Area is 3·4/2=6 square units.", "Scale model :: A 2-3-4 triangle enlarged by factor 3 becomes 6-9-12. :: Perimeter triples while area grows ninefold.", "Centroid :: Vertices (0,0),(6,0),(0,3). :: Median intersection is ((0+6+0)/3,(0+0+3)/3)=(2,1)."),
    circles: i("A chord subtends a central angle twice the inscribed angle on the same arc. A tangent is perpendicular to the radius at contact, and secant products express power of a point.", "Identify the intercepted arc and whether the vertex lies at center, circle, or outside. Convert angle information to arcs before calculating lengths or areas.", "The inscribed-angle relation requires both angles to intercept the same arc.", "Clock face :: A 100° central arc gives a 50° inscribed angle. :: Moving the point around the opposite arc preserves 50°.", "Wheel sector :: r=6 cm and central angle 60°. :: Arc length is (60/360)·2π·6=2π cm; sector area is 6π cm².", "Tangent :: Circle center (0,0), contact (3,4). :: Radius vector (3,4); tangent direction can be (-4,3), whose dot product is zero."),
    polygons: i("An n-gon can be triangulated into n−2 triangles, so its interior-angle sum is (n−2)180°. For a regular polygon each exterior turn is 360°/n.", "Count sides and diagonals, decompose area into triangles, and test whether a regular interior angle can fit an integer number around a point for tessellation.", "A regular pentagon does not tile the plane by copies meeting edge to edge because 108° does not divide 360°.", "Hexagonal tile :: n=6 gives interior angle 120°. :: Three tiles meet around a point because 3·120°=360°.", "Octagon :: n=8 has angle sum 1080°. :: Number of diagonals is n(n−3)/2=20.", "Regular square :: Side 5 cm. :: Area 25 cm²; perimeter 20 cm; apothem 2.5 cm."),
    transformations: i("Translations, rotations, and reflections preserve distances and angles; they are isometries. A dilation of factor k preserves angles but multiplies lengths by |k| and areas by k².", "Represent a map by a rule or matrix, apply it to each vertex, then compare preimage and image. For compositions, respect order: applying A then B means B(A(P)).", "Reflection followed by rotation usually differs from rotation followed by reflection.", "Map pin :: Translate (2,3) by (-5,4). :: Image is (-3,7); segment lengths are unchanged.", "Quarter turn :: Rotate (3,1) 90° anticlockwise about origin. :: Image is (-1,3).", "Scale drawing :: Dilate a 3×4 rectangle by k=2. :: New dimensions 6×8; area rises from 12 to 48."),
    coordinate: i("Coordinates turn geometric relationships into algebra. Distance comes from Pythagoras, midpoint averages endpoints, and slope measures rise per horizontal run.", "For A(x₁,y₁), B(x₂,y₂), compute Δx,Δy; then distance √(Δx²+Δy²), midpoint ((x₁+x₂)/2,(y₁+y₂)/2), and slope Δy/Δx when Δx≠0.", "Vertical lines have undefined slope, not slope zero.", "City blocks :: A=(1,2), B=(4,6). :: Straight-line distance √(3²+4²)=5; midpoint (2.5,4).", "Road grade :: Rise 3 m over run 60 m. :: Slope 3/60=0.05, or a 5% grade.", "Equal-distance locus :: Points equidistant from (0,0) and (4,0). :: Squaring distances yields x=2, the perpendicular bisector."),
    measurement: i("Length is one-dimensional, area is two-dimensional, and volume is three-dimensional; scaling a figure by k changes these by k, k², and k³. Composite areas add, but internal edges do not add to outer perimeter.", "Choose units before calculating, decompose irregular figures into known shapes, and report uncertainty to match input precision.", "Adding the perimeters of pieces double-counts their shared boundary.", "L-shaped room :: A 6×4 rectangle loses a 2×1 corner. :: Area is 24−2=22 m².", "Scale map :: 1 cm represents 5 km; two towns are 3.2 cm apart. :: Actual distance is 16 km.", "Measurement uncertainty :: Length 10.0±0.1 cm and width 5.0±0.1 cm. :: Nominal area 50 cm²; uncertainty is approximately 1.5 cm² by first-order propagation."),
    proofs: i("A visual proof isolates an invariant such as conserved area, equal angles, or a similarity ratio. The figure supports the argument; the written logic states why each step holds for all valid configurations.", "List givens, state the desired claim, and justify each transition with a definition or theorem. Use rearrangement only when pieces neither overlap nor leave gaps.", "Measuring one picture to many decimal places is still experimental evidence, not a proof.", "Pythagoras :: Four copies of a right triangle with legs a,b surround a center square. :: Comparing outer area gives a²+b²=c².", "Angle sum :: Draw a parallel through one triangle vertex. :: Alternate angles plus the vertex angle form a straight 180° line.", "Similarity :: Two triangles share angles 40° and 60°. :: Their third angles are 80° and AA establishes similarity; side ratios are equal."),
    solids: i("A solid's net preserves the area of each face but changes their spatial arrangement. Surface area sums exposed faces; volume measures the space inside.", "Identify the base and height, choose a volume formula, then unfold the surface to count lateral and base areas separately.", "Slant height is needed for cone and pyramid surface area, while perpendicular height determines volume.", "Shipping cube :: Side 3 cm. :: Volume 27 cm³ and surface area 54 cm².", "Water tank :: Cylinder radius 2 m, height 5 m. :: Volume πr²h=20π m³; curved area 2πrh=20π m².", "Cone :: Radius 3, height 4. :: Slant height 5; total area πr(r+l)=24π, volume 12π."),
    ar: i("AR geometry projects world points through a camera pose onto image pixels. To measure a physical length, the overlay needs a known scale or calibrated depth; apparent pixel length alone is insufficient.", "Anchor points to stable scene features, choose a reference measurement, and check camera movement before interpreting angles or lengths.", "Perspective makes parallel lines converge in the image, although they stay parallel in space.", "Room corner :: Calibrate a known 1 m floor edge spanning 200 px locally. :: A nearby 300 px edge is about 1.5 m at the same depth.", "Vertical wall :: A calibrated horizontal and vertical ray meet. :: Their world angle is 90° even if perspective distorts the image.", "Triangle overlay :: Measure sides 3,4,5 in one plane. :: The reconstructed angle opposite side 5 is 90°.")
  },
  trigonometry: {
    home: i("Trigonometry connects an angle to a point on the unit circle. Cosine is horizontal projection, sine is vertical projection, and tangent is their ratio where cosine is nonzero.", "Use a reference triangle or unit circle to establish sign and magnitude, then carry the same ratios into waves, bearings, and measurements.", "Angles measured in degrees and radians are interchangeable only after conversion; derivative formulas normally assume radians.", "Ladder :: A 5 m ladder at 60° reaches 5sin60°≈4.33 m high. :: Projection converts length to height.", "Rotating wheel :: A point of radius 2 at 30° has coordinates (√3,1). :: x=2cos30°, y=2sin30°.", "Wave :: y=3sin(2πt) has amplitude 3 and period 1 s. :: One circle rotation corresponds to one cycle."),
    "unit-circle": i("On the unit circle, the point at angle θ is (cosθ,sinθ). The signs come from the quadrant, and reference angles let one reuse first-quadrant exact values.", "Reduce an angle modulo 360° or 2π, find its reference angle, apply quadrant signs, and read coordinates. Use tanθ=sinθ/cosθ where defined.", "Tangent is undefined at 90° and 270° because cosθ=0.", "Reference angle :: θ=150° has reference angle 30°. :: (cosθ,sinθ)=(-√3/2,1/2).", "Full rotation :: 450° is coterminal with 90°. :: The terminal point is (0,1).", "Radians :: θ=5π/4. :: The point is (-√2/2,-√2/2), in quadrant III."),
    "right-triangle": i("For an acute angle in a right triangle, sin=opposite/hypotenuse, cos=adjacent/hypotenuse, and tan=opposite/adjacent. Similar triangles show these ratios depend on angle, not size.", "Label the sides relative to the chosen angle before selecting a ratio; use a²+b²=c² to recover a missing side.", "The word 'opposite' changes when the reference angle changes.", "Surveying :: A 30° sightline over 20 m horizontal ground. :: Height difference is 20tan30°≈11.55 m.", "Ladder :: Hypotenuse 10 m and wall reach 8 m. :: Ground distance √(10²−8²)=6 m.", "Special triangle :: A 30-60-90 triangle has hypotenuse 12. :: Short leg 6 and long leg 6√3."),
    graphs: i("For y=A sin(B(x−C))+D, |A| is amplitude, 2π/|B| is period, C is horizontal shift, and D is midline. Cosine starts at an extremum; tangent has period π and vertical asymptotes.", "Start from the parent function, scale vertically, adjust frequency, then shift. Mark midline, extrema, zeroes, and asymptotes before plotting.", "Tangent has no finite amplitude because it is unbounded.", "Daily temperature :: T(t)=20+5sin(2πt/24). :: Midline 20 °C, amplitude 5 °C, period 24 h.", "Compressed wave :: y=2cos(3x). :: Amplitude 2 and period 2π/3.", "Shifted wave :: y=sin(x−π/2). :: It equals −cos x and shifts π/2 to the right."),
    identities: i("An identity is true on every point of its domain. The unit-circle equation x²+y²=1 becomes cos²θ+sin²θ=1; angle-sum rules follow from composing rotations.", "Transform one side of an identity at a time using known identities, keeping domain restrictions explicit before cancelling or dividing.", "Checking a few angles cannot prove an identity; dividing by sinθ can also discard cases where sinθ=0.", "Pythagorean :: θ=30°. :: sin²θ+cos²θ=1/4+3/4=1.", "Double angle :: θ=30°. :: sin(60°)=2sin30°cos30°=√3/2.", "Angle sum :: sin(45°+45°). :: sin45°cos45°+cos45°sin45°=1."),
    inverse: i("Inverse trig functions return principal angles after restricting the original function to a one-to-one branch. Arcsin returns [-π/2,π/2], arccos [0,π], and arctan (-π/2,π/2).", "Check the input domain, find the reference angle, then select the principal value in the inverse function's range.", "arcsin(sinθ) need not equal θ outside the principal range.", "Slope angle :: Rise/run=1. :: arctan(1)=45°.", "Principal branch :: sin150°=1/2. :: arcsin(1/2)=30°, not 150°.", "Negative cosine :: arccos(-1/2). :: Principal value is 120°."),
    oblique: i("The sine law relates sides to opposite-angle sines; the cosine law extends Pythagoras to a non-right included angle. An SSA specification can admit zero, one, or two triangles.", "Use cosine law for SAS/SSS, sine law for AAS/ASA, and check both possible angles in SSA. For two sides and included angle use area ab sinC/2.", "The arcsin key returns one principal angle; SSA may also permit its supplement.", "Survey triangle :: a=7,b=10,C=60°. :: c²=49+100−140cos60°=79, so c≈8.89.", "Land area :: Sides 20 m and 30 m include 45°. :: Area=20·30·sin45°/2≈212.1 m².", "Ambiguous case :: a=6,b=10,A=30°. :: sinB=10sin30°/6=5/6; both B≈56.4° and 123.6° fit."),
    waves: i("A sinusoidal wave combines amplitude, frequency, and phase. Superposition adds displacements pointwise; nearby frequencies make beats with envelope frequency |f₁−f₂|.", "Write each signal as A sin(2πft+φ), add samples at the same time, and compare phase alignment, destructive interference, and Fourier harmonics.", "A beat frequency is the difference in frequencies, not their sum.", "Sound beat :: 440 Hz and 444 Hz tones. :: The loudness envelope pulses 4 times per second.", "Standing wave :: Two equal opposite-traveling waves. :: Their sum forms fixed nodes and oscillating antinodes.", "Second harmonic :: Fundamental 100 Hz. :: The second harmonic is 200 Hz and repeats twice per base cycle."),
    applications: i("Trigonometric ratios turn measured angles and known baselines into inaccessible heights and distances. Bearings require a stated reference direction; periodic models require a period and phase origin.", "Draw the right triangle or coordinate axes, label known values and units, choose sine/cosine/tangent, then check that the answer is geometrically plausible.", "An angle of elevation is measured from horizontal, not from the vertical wall.", "Building height :: Stand 30 m away and measure elevation 40°. :: Height above eye level is 30tan40°≈25.2 m.", "Navigation :: Travel 10 km at bearing 060° from north. :: East component 10sin60°≈8.66 km; north component 5 km.", "Tide :: Water height 2+1.5cos(2πt/12). :: Range is 0.5–3.5 m and cycle is 12 h."),
    ar: i("Camera-based trigonometry uses projected rays and a calibrated baseline to infer angles and lengths. The unit circle or triangle overlay visualizes ratios, but measurements depend on pose and scale.", "Calibrate horizontal distance, estimate an elevation angle from the camera, and apply h=d tanθ with an eye-height correction.", "A tilt or perspective error in the camera can dominate a small-angle height estimate.", "Tree :: Ground distance 12 m, elevation 35°, eye height 1.6 m. :: Tree height≈12tan35°+1.6≈10.0 m.", "Roof :: Ground distance 20 m, elevation 45°. :: Height above camera is 20 m.", "Wave projection :: Unit-circle marker rotates once in 2 s. :: The vertical screen trace is sinusoidal with frequency 0.5 Hz.")
  },
  "linear-algebra": {
    home: i("Linear algebra studies vectors and maps that preserve addition and scalar multiplication. Matrix columns tell where basis vectors go; their combinations determine every transformed point.", "Begin with vectors, then compose matrices, solve linear systems, and inspect eigenvectors or factorizations to understand a map's structure.", "A matrix is a representation of a map relative to chosen bases; its entries alone are not the whole geometry.", "Image rotation :: R=[[0,-1],[1,0]]. :: R(1,0)=(0,1), a quarter turn.", "Mixture :: 2x+y=7 and x−y=2. :: Row reduction gives x=3,y=1.", "Area scale :: A=[[2,0],[0,3]]. :: det A=6, so a unit square maps to area 6."),
    vectors: i("A vector encodes magnitude and direction. Dot product measures alignment and projection, while the 3D cross product gives a perpendicular direction whose length is parallelogram area.", "Add components coordinatewise; compute a·b=Σaᵢbᵢ, projection of a on b=(a·b/|b|²)b, and a×b by the determinant rule.", "A zero dot product means orthogonality only when the Euclidean inner product is being used.", "Wind and flight :: Airspeed (100,0) plus wind (0,20). :: Ground velocity (100,20), speed √10400≈102.", "Work :: Force (3,4) N moves an object (2,0) m. :: Work F·d=6 J; vertical force does no work here.", "Area :: a=(2,0,0), b=(0,3,0). :: |a×b|=6 square units."),
    matrices: i("Matrix multiplication composes linear maps; entry (i,j) is row i of A dotted with column j of B. The inverse reverses a nonsingular map, while transpose swaps rows and columns.", "Check dimensions before multiplying, compute products in order, and verify A A⁻¹=I when an inverse exists.", "AB generally differs from BA; reversing order reverses the sequence of transformations.", "Rotate then stretch :: R=[[0,-1],[1,0]], S=diag(2,1). :: SR(1,0)=(0,1), while RS(1,0)=(0,2).", "Image pixels :: A 2×2 brightness mixing matrix acts on RGB-free two-channel data. :: Multiplying A by each pixel column applies the same linear rule.", "Inverse :: A=diag(2,4). :: A⁻¹=diag(1/2,1/4), restoring scaled coordinates."),
    "row-reduction": i("Elementary row operations preserve a linear system's solution set. Pivots identify constrained variables; columns without pivots correspond to free parameters.", "Form [A|b], choose nonzero pivots, eliminate below and above, and inspect rows of zeros or contradictions before back-substitution.", "A row [0 0 | 1] means inconsistent, whereas [0 0 | 0] means an equation was redundant.", "Unique intersection :: x+y=5, x−y=1. :: Row reduction yields x=3,y=2.", "Parallel lines :: x+y=2, 2x+2y=5. :: Elimination produces 0=1; no solution.", "Infinite family :: x+y=2, 2x+2y=4. :: One pivot leaves y=2−x free."),
    "linear-transforms": i("A linear map obeys T(u+v)=T(u)+T(v) and T(cu)=cT(u), so T(0)=0. Its matrix columns are the images of basis vectors.", "Move the basis vectors, assemble them as columns, then apply the matrix to a point or shape. Use determinant to track signed area change.", "A translation is affine rather than linear because it moves the origin.", "Shear :: A=[[1,2],[0,1]]. :: A(1,1)=(3,1); area scale det A=1.", "Reflection :: Swap-coordinate matrix [[0,1],[1,0]]. :: (2,5) maps to (5,2), reflection across y=x.", "Collapse :: A=[[1,0],[0,0]]. :: Every point maps onto the x-axis; determinant 0."),
    determinants: i("The determinant is a signed area or volume scale. Its absolute value gives scale, sign gives orientation, and zero means the map collapses dimension.", "For 2×2, det[[a,b],[c,d]]=ad−bc. For higher dimensions, use elimination or cofactor expansion; det(AB)=det A det B.", "A negative determinant does not mean negative physical area; it records orientation reversal.", "Map scale :: A=diag(2,3). :: A unit square becomes area 6 because det A=6.", "Reflection :: A=diag(-1,1). :: det A=-1: area unchanged, orientation reversed.", "Dependent columns :: A=[[1,2],[2,4]]. :: det A=0, so the image of the unit square lies on a line."),
    "vector-spaces": i("A span is the set of all linear combinations of given vectors. Independence means no nontrivial combination gives zero; a basis is independent and spans the space.", "Place vectors as columns, row-reduce, and count pivots for rank. Express a target vector in basis coordinates by solving Bc=v.", "More vectors than the ambient dimension are necessarily dependent, but fewer vectors need not be independent.", "Plane basis :: (1,0,0) and (0,1,0). :: Their span is the xy-plane and has dimension 2.", "Dependent set :: (1,2) and (2,4). :: The second is twice the first, so rank is 1.", "Coordinates :: Basis b₁=(1,1), b₂=(1,-1), target (4,2). :: Solve c₁=3,c₂=1."),
    eigenvectors: i("An eigenvector v is a nonzero direction preserved by A: Av=λv. The eigenvalue λ tells the stretch or reversal along that direction.", "Solve det(A−λI)=0 for eigenvalues, then null(A−λI) for directions. Compare real and complex eigenvalues with the transformed grid and phase portrait.", "A rotation by 90° has no real eigenvector in the plane, though it has complex eigenvalues.", "Stretch :: A=diag(3,1/2). :: e₁ and e₂ are eigenvectors with λ=3 and 1/2.", "Reflection :: A=diag(1,-1). :: Along x the eigenvalue is 1; along y it is -1.", "Repeated eigenvalue :: A=[[2,1],[0,2]]. :: λ=2 twice but only one independent eigenvector."),
    orthogonality: i("Orthogonal vectors have dot product zero. Projection decomposes a vector into a component along a subspace and an orthogonal residual; orthonormal bases make coordinates dot products.", "Normalize the target direction u, compute (v·u)u, subtract it from v, and check the residual dot u is zero.", "Projection onto the zero vector is undefined because its squared length is zero.", "Ramp force :: F=(3,4), horizontal direction (1,0). :: Horizontal projection is (3,0); residual (0,4).", "Diagonal direction :: v=(3,1), u=(1,1). :: Projection is (2,2) and residual (1,-1).", "Pythagoras :: v=(3,4), basis axes. :: Orthogonal components have squared lengths 9+16=25."),
    "least-squares": i("When Ax=b has no exact solution, least squares minimizes ||Ax−b||². The fitted vector is the orthogonal projection of b onto the column space of A.", "Solve normal equations AᵀAx=Aᵀb when well-conditioned, or use QR/SVD for better numerical stability. Inspect residuals before trusting predictions.", "A low residual does not establish causation or justify extrapolation outside observed x-values.", "Line fit :: Points (0,1),(1,2),(2,2). :: Least-squares line is y≈1.167+0.5x.", "Overdetermined sensor :: Readings 4,5,6 for one constant value. :: Least-squares estimate is the mean 5.", "Projection :: A=(1,1)ᵀ, b=(2,0)ᵀ. :: Fitted vector is (1,1)ᵀ; residual (1,-1)ᵀ is orthogonal."),
    playground: i("Composing transformations lets one study how a grid, unit square, or 3D object changes under successive linear maps. Order matters unless the matrices commute.", "Start with a simple basis, apply one map at a time, compare the product matrix, and track determinant and eigen-directions after composition.", "Visual similarity of two transformed shapes does not imply the matrices are equal on every vector.", "Rotate then scale :: R90 followed by S=diag(2,1). :: (1,0) maps to (0,1), while reversing order maps it to (0,2).", "3D mirror :: diag(-1,1,1) reflects across the yz-plane. :: Volume magnitude is preserved, orientation flips.", "Two shears :: [[1,1],[0,1]] squared. :: The product is [[1,2],[0,1]], doubling the shear amount."),
    "cayley-hamilton": i("Every square matrix satisfies its own characteristic polynomial. For a 2×2 matrix, A²−tr(A)A+det(A)I=0, allowing high powers to reduce to I and A.", "Compute the characteristic polynomial, substitute A, verify the zero matrix, then rearrange to calculate powers or the inverse when det A≠0.", "The theorem applies to square matrices; it does not say each matrix entry individually satisfies the polynomial.", "Diagonal example :: A=diag(2,3), p(λ)=λ²−5λ+6. :: A²−5A+6I=0 entrywise.", "Inverse :: det A=6 and tr A=5 for diag(2,3). :: A⁻¹=(5I−A)/6=diag(1/2,1/3).", "High power :: A²=5A−6I. :: A³=5A²−6A=19A−30I."),
    diagonalization: i("If A has a full basis of eigenvectors, A=PDP⁻¹ with D diagonal. Powers and exponentials become easy because D acts independently on each eigen-coordinate.", "Find eigenvalues, collect independent eigenvectors as P columns, verify AP=PD, and transform a vector into eigen-coordinates before applying D.", "A repeated eigenvalue does not guarantee enough eigenvectors for diagonalization.", "Two-axis stretch :: A=diag(2,3). :: Aⁿ=diag(2ⁿ,3ⁿ).", "Population steps :: A=P diag(1,0.8)P⁻¹. :: The 0.8 mode decays while the 1 mode persists.", "Defective case :: A=[[2,1],[0,2]]. :: One eigendirection prevents a 2×2 diagonalization."),
    "quadratic-forms": i("A quadratic form xᵀAx describes conics or energy surfaces. For symmetric A, eigenvalue signs classify positive definite, negative definite, or indefinite behavior.", "Symmetrize coefficients, compute eigenvalues, rotate to eigenvector axes, and read the signs in the diagonal form.", "A zero determinant alone does not distinguish a flat valley from a saddle; inspect all eigenvalues.", "Bowl :: q=x²+2y². :: Both eigenvalues positive; level curves are ellipses and the origin is a minimum.", "Saddle :: q=x²−y². :: One positive and one negative eigenvalue; zero contours are y=±x.", "Rotated ellipse :: q=2x²+2xy+2y². :: Eigenvalues 3 and 1; principal axes lie along (1,1) and (1,-1)."),
    "principal-axes": i("A symmetric matrix's orthogonal eigenvectors rotate a quadratic form into diagonal coordinates. The mixed xy term disappears on principal axes.", "Form the symmetric coefficient matrix, find its orthonormal eigenvectors Q, substitute x=Qu, and obtain uᵀ(QᵀAQ)u.", "The eigenvectors fix axis directions, but translation may also be needed when linear terms are present.", "Tilted ellipse :: x²+2xy+y²+2y²=1. :: Eigenvectors rotate axes; the cross term disappears in eigen-coordinates.", "Inertia :: Principal moments 2 and 5. :: Along eigen-axes, rotational energy has no mixed product term.", "Covariance :: Σ=[[2,1],[1,2]]. :: Eigenvalues 3 and 1; major data axis is (1,1)."),
    "matrix-factorizations": i("Matrix factorizations expose different structure: LU organizes elimination, QR separates orthogonal directions from triangular weights, and SVD reveals input/output axes and singular scales.", "Choose LU for repeated square solves, pivoted LU for stability, QR for least squares, and SVD for rank or ill-conditioned problems.", "A small determinant does not by itself quantify numerical conditioning; singular values do.", "Repeated solves :: A=LU and many right-hand sides b. :: Solve Ly=b then Ux=y without refactoring A.", "Line fit :: Tall data matrix A=QR. :: Solve Rx=Qᵀb; QR avoids forming AᵀA.", "Image compression :: A≈U_kΣ_kV_kᵀ. :: Keeping the largest k singular values yields a rank-k approximation."),
    similarity: i("Similar matrices B=P⁻¹AP represent the same linear map in different bases. They share characteristic polynomial, trace, determinant, and eigenvalues.", "Build P from new basis vectors, transform coordinates with P⁻¹, and verify B=P⁻¹AP. Compare invariant quantities before and after.", "Similar matrices need not have the same entries or eigenvectors expressed in the old coordinates.", "Axis swap :: A=diag(2,3), P swaps axes. :: B=diag(3,2), with the same eigenvalues.", "Trace :: A=[[1,2],[0,4]]. :: Every similar B has trace 5 and determinant 4.", "System state :: x′=Ax and x=Pz. :: New coordinates obey z′=(P⁻¹AP)z."),
    "jordan-form": i("A defective matrix lacks a full eigenbasis. Jordan chains add generalized eigenvectors, producing blocks J=λI+N with nilpotent N.", "Solve (A−λI)v₁=0, then (A−λI)v₂=v₁. Use the chain as columns of P and verify P⁻¹AP has a Jordan block.", "Jordan form is mathematically revealing but numerically unstable near repeated eigenvalues.", "Two-state chain :: A=[[2,1],[0,2]]. :: v₁=(1,0), v₂=(0,1) form a length-two Jordan chain.", "Matrix powers :: J=2I+N with N²=0. :: Jⁿ=2ⁿI+n2^(n−1)N.", "ODE system :: x′=Jx. :: e^(Jt)=e^(2t)(I+tN), so one solution contains te^(2t).")
  },
  "complex-numbers": {
    home: i("A complex number z=a+bi is both an algebraic quantity and a point (a,b). Addition moves vectors, multiplication scales by moduli and adds arguments.", "Switch between rectangular a+bi and polar r(cosθ+i sinθ), choosing the form that simplifies the operation.", "Argument is multi-valued up to 2π; a principal argument chooses one branch.", "Navigation :: Move 3 east and 4 north. :: Displacement is 3+4i with modulus 5 and argument arctan(4/3).", "Rotation :: Multiply 2+i by i. :: i(2+i)=-1+2i, a 90° anticlockwise turn.", "Signal :: Phasor 5e^(iπ/3). :: Rectangular form is 2.5+(5√3/2)i."),
    "argand-plane": i("The Argand plane places Re z on the horizontal axis and Im z vertically. Distance between z and w is |z−w|; conjugation reflects across the real axis.", "Plot coordinates, form a difference for distance, and use a modulus equation to identify circles or lines as loci.", "Argument depends on quadrant; plain arctan(b/a) can give the wrong quadrant.", "Distance :: z=3+4i and w=1−2i. :: |z−w|=|2+6i|=√40.", "Conjugate :: z=−2+5i. :: z̄=−2−5i and z z̄=29.", "Locus :: |z−(2+i)|=3. :: Points form a circle centered (2,1) with radius 3."),
    arithmetic: i("Complex addition combines real and imaginary parts, while multiplication uses i²=−1. Division multiplies numerator and denominator by the denominator's conjugate.", "Carry out algebra in a+bi form; for multiplication or repeated powers, consider polar form because moduli multiply and arguments add.", "Never divide real and imaginary parts separately; (a+bi)/(c+di) is one quotient.", "AC phasors :: (2+3i)+(1−5i). :: Result is 3−2i.", "Rotation and scale :: (1+i)(2+i). :: Result 1+3i, since i²=−1.", "Impedance quotient :: (3+4i)/(1−i). :: Multiply by 1+i to get (-1+7i)/2."),
    "polar-forms": i("Polar form z=r(cosθ+i sinθ)=re^(iθ) records magnitude r=|z| and direction θ=arg z. Multiplication multiplies radii and adds angles.", "Compute r=√(a²+b²), choose θ with the correct quadrant, then apply De Moivre's rule for powers or roots.", "At z=0 the argument is undefined; it is not zero degrees by convention.", "Convert :: z=−1+i. :: r=√2, θ=3π/4, so z=√2e^(3πi/4).", "Multiply :: 2e^(iπ/6)·3e^(iπ/3). :: Product 6e^(iπ/2)=6i.", "Power :: (cos30°+i sin30°)^3. :: Result cos90°+i sin90°=i."),
    rotation: i("Multiplying by e^(iθ) rotates every complex point by θ about the origin without changing modulus; multiplying by re^(iθ) also scales by r.", "Represent each transform as a complex factor, multiply factors to compose transformations, then apply the product to z.", "Complex multiplication gives direct rotations about the origin; rotation about another center needs translation before and after.", "Quarter turn :: z=3+2i, multiply by i. :: Result -2+3i.", "Rotate about center :: Rotate z=2 around c=1 by 180°. :: c+(-1)(z-c)=0.", "Two turns :: Rotate 30° then 45°. :: Combined factor e^(i75°), so total turn is 75°."),
    roots: i("The n roots of a nonzero complex number re^(iθ) have modulus r^(1/n) and arguments (θ+2πk)/n for k=0,…,n−1. They are evenly spaced on a circle.", "Convert to polar form, compute all k values, plot the roots, and verify by raising each to the nth power.", "Taking only the principal root misses n−1 other solutions.", "Square roots :: Solve z²=−1. :: Roots are i and −i.", "Cube roots of unity :: z³=1. :: Angles 0°,120°,240° give 1 and the two nonreal roots.", "Fourth roots :: z⁴=16. :: Modulus 2 and angles 0°,90°,180°,270° give ±2, ±2i."),
    euler: i("Euler's formula e^(iθ)=cosθ+i sinθ connects exponential growth with circular rotation. The cosine and sine parts arise by grouping even and odd terms of the exponential Taylor series.", "Follow the unit-circle point while θ varies, then compare its real and imaginary projections or sum complex exponentials to recover trig identities.", "The exponent θ is in radians; replacing it with a degree number without conversion changes the value.", "Half turn :: e^(iπ)=−1. :: A π-radian rotation sends 1 to -1.", "Quarter turn :: e^(iπ/2)=i. :: The real projection is 0 and imaginary projection 1.", "Cosine from exponentials :: (e^(iθ)+e^(-iθ))/2. :: Imaginary parts cancel, leaving cosθ."),
    loci: i("A complex locus is a set of points satisfying an equation such as |z-a|=r or |z-a|=|z-b|. Möbius maps (az+b)/(cz+d) send generalized circles to generalized circles where defined.", "Translate modulus or argument conditions into Cartesian geometry, mark excluded denominator zeros, and test representative points before drawing the entire set.", "An equation with a zero denominator excludes that point even if the rest of the curve looks continuous.", "Distance locus :: |z−(1+i)|=2. :: Circle center (1,1), radius 2.", "Bisector :: |z−1|=|z+1|. :: Squaring gives Re z=0, the imaginary axis.", "Inversion :: w=1/z maps |z|=2. :: Image circle has radius 1/2 around origin."),
    fractals: i("Mandelbrot iteration uses z_(n+1)=z_n²+c starting at z₀=0; bounded orbits define the set. A Julia set fixes c and varies z₀ instead.", "Choose c, iterate, color by escape time when |z| exceeds 2, and zoom near the boundary to see new structure.", "Finite iteration cannot prove a point is in the set; it can only detect escape or give stronger evidence of boundedness.", "Outside point :: c=2. :: z₁=2,z₂=6; escape is immediate.", "Inside candidate :: c=0. :: Every iterate stays 0, so c is in the Mandelbrot set.", "Period-two orbit :: c=−1. :: Sequence 0,−1,0,−1,… remains bounded."),
    "waves-circuits": i("A sinusoidal signal Re(Ae^(iωt)) is represented by phasor A. In AC analysis, impedance combines resistance and reactance: Z_R=R, Z_L=iωL, Z_C=1/(iωC).", "Add series impedances, divide voltage phasor by total impedance for current, and read magnitude and argument for amplitude and phase delay.", "Phasor analysis assumes a steady sinusoid at one frequency; transients require time-domain equations.", "Resistor :: V=10∠0° V, R=5 Ω. :: I=V/R=2∠0° A, in phase.", "Inductor :: ω=100 rad/s, L=0.1 H. :: Z_L=10i Ω; current lags voltage by 90°.", "Series RC :: R=3 Ω, capacitive reactance -4i Ω. :: |Z|=5 Ω; 10 V amplitude gives 2 A current amplitude.")
  },
  modelling: {
    home: i("Mathematical modelling turns assumptions into equations, predictions, and tests against data. A model is useful when its variables, units, domain, and limitations are explicit.", "Define a measurable question, choose a mechanism, estimate parameters, compare predictions with observations, and revise when residual patterns reveal missing structure.", "A close fit to training data alone does not establish that a model predicts new conditions.", "Travel :: Constant speed 60 km/h for 2.5 h. :: Distance model d=vt predicts 150 km before stops or traffic.", "Population :: P′=0.1P, P₀=1000. :: Exponential model predicts P(10)≈2718, assuming constant per-capita growth.", "Forecast check :: Model predicts 20,22,24; observations are 19,22,26. :: Residuals -1,0,2 suggest a trend worth investigating."),
    motion: i("Motion models connect position, velocity, and acceleration by x′=v and v′=a. Forces such as gravity and drag determine acceleration; numerical integration is needed when the forces depend on speed.", "Choose coordinates, state initial position and velocity, write force balance, solve or integrate, then compare the predicted path and energy changes.", "Ignoring air resistance can badly overpredict long-range projectile distance.", "Projectile :: Launch at 20 m/s and 30° with g=9.8 m/s². :: Ideal flight time 2v sin30°/g≈2.04 s.", "Braking :: Vehicle slows from 20 m/s at 5 m/s². :: Stop time 4 s and distance 40 m.", "Drag :: v′=10−2v from rest. :: Terminal speed is 5 m/s, not unbounded growth."),
    population: i("Exponential growth assumes unlimited resources; logistic growth adds carrying capacity K. Harvesting subtracts a removal term, and age-structured models replace one count with linked cohorts.", "State births, deaths, resource limit, and intervention rates, then locate equilibria and test sensitivity to parameters.", "A carrying capacity estimated in one environment may change with climate or resource use.", "Exponential :: P₀=100,r=0.2/year. :: After 5 years P≈272 in the constant-rate model.", "Logistic :: K=1000,P₀=100,r=0.2/year. :: P(5)=1000/(1+9e^(-1))≈232.", "Harvest :: P′=0.2P(1-P/1000)−30. :: Equilibria solve 0.2P(1-P/1000)=30, and excessive harvest can remove positive equilibrium."),
    epidemics: i("In SIR models S+I+R is conserved for a closed population. Infection transfers susceptible people to I at rate βSI/N, and recovery transfers I to R at rate γI.", "Estimate β and γ, calculate R₀≈β/γ near a fully susceptible start, and compare intervention scenarios by changing contact or removal rates.", "A lower peak does not necessarily mean fewer total infections without examining the entire trajectory and assumptions.", "Early spread :: β=0.3/day, γ=0.1/day. :: R₀≈3 when nearly everyone is susceptible.", "Vaccination :: If 70% are immune initially and R₀=3. :: Effective reproduction is about 0.9, below one.", "Recovery :: I=100, γ=0.1/day. :: About 10 people/day transfer from I to R at that instant."),
    finance: i("Finance models track cash flows through time. Compounding grows balances, amortization splits each payment into interest and principal, and inflation changes purchasing power.", "Choose a period and effective rate, align payment timing with that period, and compute the balance after each contribution or repayment.", "A quoted annual rate is not the same as an effective annual rate when compounding occurs monthly.", "Savings :: ₹10,000 at 6% annual compounded yearly for 3 years. :: Future value 10000(1.06)³≈₹11,910.", "Loan :: ₹100,000 at 12% nominal annual with monthly rate 1%. :: First-month interest ₹1,000 before any principal repayment.", "Inflation :: A ₹100 basket rises 5% yearly for 2 years. :: Nominal cost ≈₹110.25; purchasing power falls."),
    optimization: i("Optimization chooses decision variables to maximize or minimize an objective while satisfying constraints. Feasible solutions obey every resource, capacity, and timing bound.", "Write variables with units, objective and inequalities, inspect the feasible region, then test the optimum against active constraints and sensitivity.", "An unconstrained optimum can be physically impossible if it violates a resource limit.", "Production :: Profit 3x+2y with x+y≤10, x,y≥0. :: Producing 10 of x yields profit 30 if no other constraint binds.", "Transport :: Ship 5 units at ₹2 each and 3 units at ₹4 each. :: Route cost is ₹22; capacity constraints decide feasibility.", "Design :: Fence 40 m on all sides of a rectangle. :: Area x(20−x) peaks at x=10, a square of area 100 m²."),
    networks: i("A weighted graph represents places or states as nodes and costs as edges. Dijkstra finds shortest paths with nonnegative weights; A* uses a heuristic lower bound to guide search.", "Define edge meanings and units, initialize distances, relax neighbors, and inspect the predecessor chain. For A*, use an admissible heuristic.", "Dijkstra is not valid with negative edge weights; an overestimating A* heuristic can lose optimality.", "Delivery :: A→B cost 2, B→C cost 3, A→C cost 8. :: Shortest A→C route is A→B→C with cost 5.", "Grid path :: Manhattan distance to goal is 6 steps. :: It is an admissible A* heuristic when each grid move costs at least 1.", "Road closure :: Edge B→C becomes cost 10. :: Direct A→C cost 8 becomes preferable."),
    regression: i("Regression estimates how a response changes with predictors. In linear least squares, coefficients minimize squared residuals; residual plots reveal curvature, unequal variance, or outliers.", "Fit on observed data, inspect residuals, quantify prediction error, and validate on held-out or later observations.", "Correlation and a high R² do not prove a causal relationship.", "Sales :: Points (1,3),(2,5),(3,7). :: Fitted line y=2x+1 predicts 9 at x=4 if trend continues.", "Residual :: Model predicts 10 for observed 13. :: Residual observed−predicted is +3.", "Outlier :: Four points lie near y=x but one is (10,0). :: The influential point can strongly rotate the fitted line."),
    periodic: i("Periodic models repeat after period T: f(t+T)=f(t). A harmonic model A sin(2πt/T+φ)+D captures a dominant cycle; multiple harmonics represent richer patterns.", "Estimate mean D, period T, amplitude A, and phase from landmarks; fit remaining error and test future cycles.", "A long-term upward trend cannot be represented by a pure sinusoid with fixed mean.", "Tide :: Mean 2 m, range 1–3 m, period 12 h. :: h(t)=2+cos(2πt/12) if high tide is t=0.", "Daylight :: Approximate annual mean 12 h and amplitude 3 h. :: A 365-day sinusoid spans roughly 9–15 h.", "Sound :: A 440 Hz tone. :: Period is 1/440≈2.27 ms."),
    numerical: i("Numerical models approximate outcomes when exact formulas are impractical. Monte Carlo uses repeated random trials, iteration advances a recurrence, and sensitivity tests how input uncertainty affects predictions.", "Define the estimator or update rule, record seeds and step sizes, run repeated trials, then compare convergence and error.", "A larger number of simulations reduces random error slowly, typically in proportion to 1/√N.", "Monte Carlo π :: Sample points uniformly in a unit square. :: Four times the fraction inside the quarter circle estimates π.", "Euler cooling :: T′=-0.1(T-20), T₀=80, h=1. :: First numerical update is 74 °C.", "Sensitivity :: Travel d=vt at v=60±2 km/h over 2 h. :: Predicted distance is 120±4 km."),
    comparison: i("Competing models should be judged on fit, complexity, plausibility, and predictions outside the fitting window. Residual patterns often reveal missing mechanisms.", "Fit candidates to the same training data, compare errors on held-out observations, then examine parameter meaning and sensitivity.", "The model with the smallest training error may overfit and perform worse on new data.", "Growth models :: Early population doubles rapidly, then flattens. :: Logistic fit captures a limit that exponential growth misses.", "Residual pattern :: Linear forecast errors are -3,-1,1,3 over time. :: Systematic trend suggests a missing curvature term.", "Model choice :: Two models have validation errors 4 and 5 but one uses ten extra parameters. :: Simpler model may be preferable if uncertainty overlaps.")
  },
  discrete: {
    home: i("Discrete mathematics studies countable structures such as integers, sets, logical statements, and graphs. Proof often proceeds by cases, counting, induction, or invariants.", "Specify the objects and operations, test small cases, then justify a rule symbolically or with an algorithm and a correctness argument.", "A pattern seen in the first few integers is a conjecture, not a proof for all integers.", "Handshake network :: Four people each shake every other person's hand. :: Number of handshakes is C(4,2)=6.", "Clock :: 10 hours after 8 o'clock on a 12-hour clock. :: 8+10≡6 (mod 12).", "Route graph :: A tree with 7 vertices. :: It has exactly 6 edges if connected and acyclic."),
    "number-sense": i("Integers, fractions, decimals, ratios, and powers represent quantities at different scales. Equivalent forms preserve value even when notation changes.", "Estimate order of magnitude first, convert to a common representation, then calculate and check units or sign.", "Adding fractions requires a common denominator; adding numerators and denominators directly is wrong.", "Recipe :: 3/4 cup plus 1/2 cup. :: Convert to quarters: 3/4+2/4=5/4 cups.", "Discount :: 20% of ₹750. :: 0.2·750=₹150; final price ₹600.", "Scientific scale :: 3×10⁵ divided by 6×10². :: Result 0.5×10³=500."),
    primes: i("A prime has exactly two positive divisors, 1 and itself. Unique prime factorization underlies gcd, lcm, divisibility, and many cryptographic constructions.", "Sieve candidates up to √n for primality; factor composite numbers, then take minimum prime exponents for gcd and maximum exponents for lcm.", "The number 1 is neither prime nor composite.", "Sieve :: Test 97. :: No prime divisor ≤√97≈9.85 divides it; 97 is prime.", "Schedules :: 12=2²·3 and 18=2·3². :: gcd=6 and lcm=36, so cycles coincide every 36 units.", "Factor tree :: 84=2²·3·7. :: Its positive divisors count is (2+1)(1+1)(1+1)=12."),
    "modular-arithmetic": i("Congruence a≡b (mod n) means n divides a−b. Residues wrap around a finite clock; a has an inverse mod n exactly when gcd(a,n)=1.", "Reduce residues, use the Euclidean algorithm for inverses, and solve linear congruences only after checking gcd(a,n) divides b.", "Division modulo n is not ordinary division; it requires a modular inverse.", "Clock :: 17 hours after 9 on a 12-hour clock. :: 9+17≡2 (mod 12).", "Inverse :: Solve 3x≡1 (mod 7). :: x≡5 because 3·5=15≡1.", "No solution :: Solve 4x≡3 (mod 6). :: gcd(4,6)=2 does not divide 3, so there is no residue solution."),
    "number-patterns": i("Recursive sequences specify the next term from earlier terms; closed forms specify the nth term directly. Figurate numbers and Pascal's triangle have combinatorial interpretations.", "List initial terms, identify a recurrence, derive a formula when possible, and prove it by induction or counting.", "Matching the first few terms does not uniquely determine a sequence.", "Triangular dots :: 1+2+…+n. :: T_n=n(n+1)/2; T_5=15.", "Rabbit recurrence :: F₁=F₂=1, F_n=F_(n−1)+F_(n−2). :: The sixth term is 8.", "Pascal row :: Row 4 is 1,4,6,4,1. :: Entries count ways to choose k objects from 4."),
    combinatorics: i("Counting depends on whether order matters, repetition is allowed, and choices are independent. Permutations arrange, combinations select, and inclusion–exclusion corrects overlap.", "Define the sample object precisely, apply product/sum rules, then divide by symmetry only when each object is counted the same number of times.", "Using n!/(n−r)! for an unordered committee overcounts by r!.", "Seats :: Assign 3 distinct roles from 5 students. :: 5·4·3=60 ordered outcomes.", "Committee :: Choose 3 from 5 without roles. :: C(5,3)=10.", "Overlap :: 20 study algebra, 15 study geometry, 8 study both. :: Number studying at least one is 20+15−8=27."),
    logic: i("Propositional logic assigns truth values to statements. Equivalence means two expressions agree on every assignment; CNF is an AND of OR clauses, useful for SAT solving.", "Construct a truth table, compare columns, and use De Morgan's laws or distributivity to transform forms while preserving all truth assignments.", "A statement p→q is false only when p is true and q is false.", "Alarm :: p=door open, q=alarm sounds. :: p→q fails only if the door opens and alarm stays silent.", "De Morgan :: Not (rain AND cold). :: Equivalent to (not rain) OR (not cold).", "SAT :: (p∨q)∧(¬p∨q). :: q=true satisfies both clauses regardless of p."),
    sets: i("Sets collect distinct elements. Union joins membership, intersection requires both memberships, Cartesian products form ordered pairs, and equivalence relations partition a set into classes.", "Write membership conditions, shade Venn regions or enumerate finite examples, and check reflexive, symmetric, and transitive properties for equivalence.", "An ordered pair (a,b) is generally different from (b,a); a set ignores order but a Cartesian product does not.", "Enrollment :: A={1,2,3}, B={3,4}. :: A∪B={1,2,3,4}, A∩B={3}.", "Product :: A={red,blue}, B={S,M}. :: A×B has four ordered size-color choices.", "Parity classes :: a~b when a−b is even. :: Integers split into even and odd equivalence classes."),
    graphs: i("A graph contains vertices and edges. Connectivity, paths, trees, coloring, and flows answer different questions about the same network.", "Choose directed or undirected edges, label weights/capacities where needed, then use traversal, shortest-path, or flow algorithms that match those assumptions.", "A shortest path is not necessarily a minimum spanning tree; they optimize different objectives.", "Route :: A→B weight 2, B→C weight 3, A→C weight 9. :: Shortest A→C path costs 5 via B.", "Tree :: A connected acyclic graph on 8 vertices. :: It has 7 edges.", "Coloring :: A triangle graph. :: Three colors are required when adjacent vertices must differ."),
    algorithms: i("An algorithm is a finite procedure with a correctness argument and cost model. Sorting, searching, Euclid's gcd, and graph traversal have different complexity bounds.", "State input assumptions, trace the steps on a small example, identify an invariant, and count operations as input size grows.", "A fast average case does not guarantee a fast worst case; complexity depends on the algorithm and input model.", "Binary search :: Sorted list of 1024 items. :: At most about 10 halvings locate an item.", "Euclid :: gcd(84,30). :: 84=2·30+24, 30=1·24+6, 24=4·6; gcd=6.", "Breadth-first search :: Unweighted route graph. :: The first visit to a node gives its shortest edge-count distance."),
    cryptography: i("Classical ciphers transform symbols, while public-key systems use hard inverse problems. RSA relies on modular exponentiation and private exponent d satisfying ed≡1 mod φ(n).", "Work with small educational integers to see key generation, encryption, and decryption, then distinguish mathematical mechanism from real-world security practice.", "Tiny keys and textbook RSA are insecure; real systems require vetted padding and large keys.", "Caesar :: Shift A by 3 positions. :: A→D, Z→C after wrapping mod 26.", "RSA toy :: p=3,q=11,n=33,φ=20,e=3,d=7. :: Message 2 encrypts to 8; 8^7 mod 33 returns 2.", "Diffie–Hellman toy :: Modulus 23, generator 5, secrets 2 and 3. :: Public values 2 and 10 yield shared 8 mod 23.")
  },
  statistics: {
    home: i("Statistics separates variation in a sample from uncertainty about a population. Descriptive summaries show observed data; inference uses a sampling model to estimate or test wider claims.", "Describe collection and units, visualize distribution and outliers, choose an estimator, then state its uncertainty and assumptions.", "A representative sample matters more than a large biased sample.", "Commute times :: 10,12,13,15,50 minutes. :: Median is 13; mean is 20, pulled upward by 50.", "Coin :: 52 heads in 100 flips. :: Sample proportion 0.52, not proof the coin's true probability is 0.52.", "Survey :: 60 of 100 support a policy. :: Estimate 0.60 with sampling uncertainty about √(0.6·0.4/100)≈0.049."),
    "data-explorer": i("Exploratory data analysis inspects variable type, missingness, distribution, and relationships before fitting a model. Pairwise plots reveal association and outliers but not causality.", "Check units and missing values, plot marginal distributions, compare two-variable scatter or grouped views, and look for patterns that suggest a formal question.", "A striking scatter plot can be driven by one influential point or a hidden grouping variable.", "Shop data :: Prices 10,12,14 and units sold 9,7,5. :: A downward pairwise pattern suggests lower sales at higher price.", "Missing data :: 20 of 100 ages are blank. :: Report 20% missingness before calculating an age mean.", "Mixed groups :: Two classes each have positive study-score association but different baselines. :: Pooling may conceal the within-class pattern."),
    descriptive: i("Center summarizes typical value, spread quantifies variation, and shape identifies skew or tails. Mean and standard deviation respond strongly to outliers; median and IQR are more resistant.", "Sort values for median and quartiles, compute mean and variance with the correct sample/population denominator, then compare multiple summaries.", "An outlier is not automatically an error; investigate its source before removal.", "Income :: 20,22,25,28,100 (thousands). :: Median 25 while mean 39, revealing right skew.", "Spread :: Data 2,4,6. :: Mean 4; sample variance [(−2)²+0²+2²]/2=4.", "IQR :: Q1=10,Q3=18. :: IQR=8; usual upper fence is 18+1.5·8=30."),
    "interactive-distributions": i("A probability distribution assigns mass or density to possible outcomes. Discrete models sum point probabilities; continuous probabilities are areas under a density curve.", "Match mechanism to model: fixed trials for binomial, event counts for Poisson, waiting times for exponential, and bell-shaped measurements for normal.", "For a continuous distribution, probability at one exact point is zero even when density there is positive.", "Quality control :: X~Binomial(10,0.1). :: P(X=0)=0.9^10≈0.349.", "Calls :: X~Poisson(3) per hour. :: P(X=0)=e^(−3)≈0.050.", "Heights :: X~Normal(170,10²) cm. :: P(160<X<180)≈0.683 by the ±1σ rule."),
    experiments: i("An experiment estimates probability by repeated outcomes. Relative frequency approaches theoretical probability under independent, identically distributed trials; conditional probability updates when information is known.", "Define the sample space, run trials, compare observed and theoretical frequencies, and use P(A|B)=P(A∩B)/P(B) for conditional events.", "A short run can deviate substantially from expected proportions without indicating a biased device.", "Coin :: 100 fair flips. :: Expected heads 50 but 46 or 54 are ordinary sample variation.", "Dice :: Sum 7 on two dice. :: Six of 36 equally likely pairs give probability 1/6.", "Medical test :: Prevalence 1%, sensitivity 90%, false-positive rate 5%. :: P(disease|positive)=0.009/(0.009+0.0495)≈15.4%."),
    counting: i("Permutations count ordered selections; combinations count unordered selections. Factorials and Pascal's identity connect both, while tree diagrams expose staged choices.", "Ask whether order or repetition matters, multiply choices stage by stage, and divide by symmetry only when arrangements are equally represented.", "A probability numerator and denominator must count outcomes at the same granularity.", "Podium :: Top 3 from 5 runners. :: P(5,3)=5·4·3=60 ordered podiums.", "Team :: Choose 3 of 5 volunteers. :: C(5,3)=10 teams.", "Binomial coefficient :: Coefficient of x² in (1+x)^4. :: C(4,2)=6."),
    clt: i("The sample mean has expected value μ and standard error σ/√n for independent draws. Under broad conditions, its distribution approaches normal as n grows even when the population is skewed.", "Draw many samples of the same size, compute each mean, plot their distribution, and compare its center and width with μ and σ/√n.", "The central limit theorem does not say the raw observations become normally distributed.", "Wait times :: Population σ=12 min, sample size n=36. :: Standard error of mean is 12/6=2 min.", "Sample size :: Increase n from 25 to 100. :: Standard error halves because √n doubles.", "Skewed population :: Individual service times are right-skewed. :: Means of large independent samples become more bell-shaped."),
    "confidence-intervals": i("A confidence interval is a data-dependent procedure with a stated long-run capture rate. For a mean with known σ, estimate x̄±z*σ/√n; wider confidence or higher noise makes wider intervals.", "Choose the estimand and sampling model, compute a standard error, choose a critical value, and interpret the interval as a plausible parameter range.", "A fixed 95% interval does not assign 95% probability to the fixed population parameter in the usual frequentist interpretation.", "Mean :: x̄=50,σ=10,n=100. :: Approximate 95% interval 50±1.96=48.04 to 51.96.", "Proportion :: 60 successes in 100 trials. :: p̂=0.60, SE≈0.049, approximate 95% margin ≈0.096.", "Coverage simulation :: Build 100 independent 95% intervals. :: About 95 should contain μ on average, but any run may differ."),
    hypothesis: i("A hypothesis test compares data with a null model. The p-value is the probability, under that null, of a result at least as extreme as the observed one.", "State H₀ and H₁, choose a statistic and null distribution, compute p, compare with α, then discuss effect size and study design.", "A p-value is not the probability that H₀ is true, and statistical significance is not practical importance.", "Mean test :: H₀:μ=10, sample estimate 12, SE=1. :: z=2 and two-sided p≈0.0455.", "Decision :: p=0.02 with α=0.05. :: Reject H₀ at 5%; this does not prove H₁ exactly.", "Power :: True effect grows while noise stays fixed. :: Rejection becomes more likely under the alternative."),
    correlation: i("Correlation r summarizes linear association between two numeric variables; least-squares regression fits a prediction line by minimizing squared vertical residuals.", "Plot the scatter first, fit the line, inspect residuals and influential points, and limit predictions to a defensible x-range.", "A strong r may hide nonlinear structure, confounding, or an influential outlier.", "Perfect line :: (1,2),(2,4),(3,6). :: r=1 and fitted y=2x.", "Prediction :: Fit y=3+2x. :: At x=4 the predicted response is 11, provided x=4 is in scope.", "Residual :: Observed 14, predicted 11. :: Residual is +3; positive means the point lies above the line."),
    anova: i("ANOVA compares between-group variation with within-group variation. Under equal means, the F ratio MS_between/MS_within is typically near one; large values challenge the null.", "Define groups and randomization, calculate sums of squares and degrees of freedom, form F, then inspect residuals and follow-up comparisons.", "A significant F says at least one mean differs, not which specific pair differs.", "Three treatments :: Group means 10,10,10 with similar spread. :: Between-group sum of squares is near zero, so F is small.", "Changed treatment :: Means 10,10,20 with low within-group noise. :: Between-group variation rises and F becomes large.", "Design :: Randomly assign 30 plots equally to 3 fertilizers. :: Each treatment gets 10 plots, reducing selection bias.")
  },
  algebra: {
    home: i("Algebra represents unknown quantities and relationships with symbols. An identity is true for every allowed value; an equation asks which values make a statement true.", "Keep the domain visible, transform expressions with reversible rules, and check candidate solutions in the original problem.", "Squaring or multiplying by an expression that can be zero can add or lose solutions.", "Budget :: Three tickets cost ₹450. :: 3x=450 gives x=₹150 per ticket.", "Rectangle :: Length x+2, width x. :: Area x(x+2)=x²+2x.", "Growth :: Deposit ₹1000 at 5% yearly. :: Balance after n years is 1000(1.05)^n."),
    expressions: i("Like terms have the same variable powers, so their coefficients combine. Expansion uses distributivity; factorization reverses it.", "Identify terms and domain restrictions, combine coefficients, distribute products, then verify an equivalent form by expansion.", "2x and 2x² are unlike terms; their exponents cannot be merged.", "Shop bill :: 3 notebooks at x each plus 2 more. :: 3x+2x=5x.", "Area :: Rectangle sides x+3 and x+2. :: Area (x+3)(x+2)=x²+5x+6.", "Factor :: x²+7x+12. :: (x+3)(x+4) because 3+4=7 and 3·4=12."),
    equations: i("An equation stays equivalent when the same reversible operation is applied to both sides. Linear equations isolate x; quadratics may need factoring or the quadratic formula; inequalities reverse direction after multiplying by a negative.", "Simplify both sides, preserve balance, solve, and substitute each candidate into the original equation.", "Squaring √x=-2 would produce x=4, but the original equation has no real solution.", "Taxi fare :: 50+12d=170. :: Subtract 50 and divide by 12: d=10 km.", "Quadratic :: x²−5x+6=0. :: Factor (x−2)(x−3)=0; roots 2 and 3.", "Inequality :: −2x<6. :: Divide by −2 and reverse sign: x>−3."),
    functions: i("A function assigns one output to each allowed input. Transformations change a graph predictably; composition applies one function after another, while an inverse reverses a one-to-one function.", "State domain, evaluate and graph parent behavior, then apply shifts/scales in the correct order. For an inverse, swap x and y and solve.", "A relation can fail to be a function if one input has two outputs; an inverse may require a restricted domain.", "Pricing :: f(n)=20n+50. :: Five items cost f(5)=₹150.", "Shift :: g(x)=(x−2)²+3. :: The parabola x² moves right 2 and up 3.", "Composition :: f(x)=2x, g(x)=x+1. :: f(g(3))=8, while g(f(3))=7."),
    polynomials: i("The factor theorem links roots and factors: f(r)=0 iff (x−r) divides f(x). Degree and leading coefficient determine end behavior; multiplicity determines whether a graph crosses or touches an axis.", "Factor or divide, count roots with multiplicity, and check signs around each root before sketching.", "A repeated even-multiplicity root touches the axis without changing sign.", "Roots :: x²−9=(x−3)(x+3). :: Zeroes are ±3.", "Multiplicity :: f(x)=(x−2)²(x+1). :: At x=2 the graph touches; at x=-1 it crosses.", "End behavior :: f(x)=−2x³+x. :: As x→∞, f(x)→−∞ because the leading term dominates."),
    systems: i("A solution of a system satisfies every equation simultaneously. Graph intersections, substitution, elimination, and row reduction are equivalent ways to find the same feasible set.", "Choose an efficient method based on coefficients, inspect whether equations are dependent or inconsistent, and check the solution in all originals.", "Parallel lines have no solution; identical lines have infinitely many.", "Tickets :: Adult x plus child y: x+y=10, 5x+3y=42. :: Eliminate y to get x=6,y=4.", "Intersection :: y=2x+1 and y=−x+7. :: 2x+1=−x+7 gives (2,5).", "Dependent :: 2x+2y=8 and x+y=4. :: Same line, so infinitely many solutions."),
    exponents: i("Exponent laws follow from repeated multiplication, while logarithms invert exponentials. For a>0,a≠1, log_a(a^x)=x on the relevant domain.", "Use common bases to solve exponential equations or take logarithms; enforce positive log arguments and check transformed equations.", "log(x+y) is not log x+log y; logarithm addition corresponds to multiplication.", "Doubling :: 2^x=32. :: x=5.", "Compound interest :: 1000(1.1)^t=2000. :: t=ln2/ln1.1≈7.27 years.", "Log domain :: log₁₀(x−3)=2. :: x−3=100, so x=103>3."),
    sequences: i("An arithmetic sequence changes by constant difference d; a geometric sequence changes by constant ratio r. A recurrence gives the next term, while a closed form gives term n directly.", "Inspect consecutive differences and ratios, write the nth term, and use a sum formula when accumulating values.", "A sequence with ratio zero or changing signs needs careful indexing before applying a geometric sum formula.", "Savings :: Add ₹100 each month starting at ₹500. :: Month n amount a_n=500+100(n−1).", "Doubling :: Start 3, multiply by 2. :: Fifth term 3·2⁴=48.", "Arithmetic sum :: 1+2+…+20. :: Sum=20·21/2=210."),
    proof: i("Algebraic proof establishes a claim for every allowed value using definitions and valid transformations. A counterexample disproves a universal claim with one valid case.", "State assumptions, justify each equality or implication, and separate one-way implications from equivalences.", "Testing many values can support a conjecture but cannot prove a universal identity.", "Odd square :: n=2k+1. :: n²=4k(k+1)+1, so every odd square is odd.", "Identity :: (a+b)². :: Distributivity gives a²+2ab+b² for all real a,b.", "Counterexample :: Claim: all primes are odd. :: The prime 2 disproves the claim."),
    cas: i("A computer algebra system manipulates symbolic expressions under stated assumptions. Exact simplification, factorization, solving, and differentiation are different operations with different domains.", "Enter an expression with variables and assumptions, choose the operation, then verify the result by substitution or differentiation.", "A symbolic answer can omit branch or domain restrictions unless those assumptions are supplied.", "Factor :: Input x²−5x+6. :: CAS returns (x−2)(x−3); expanding verifies it.", "Differentiate :: Input x³−2x. :: Output 3x²−2, checked by power rule.", "Solve :: Input x²=4 over reals. :: Solutions are x=−2 and x=2, not only the principal square root."),
    advanced: i("Advanced algebra connects systems, functions, polynomial structure, and symbolic proof. A useful workflow alternates between exact manipulation, visualization, and numeric checking.", "Identify the algebraic structure first, choose a symbolic method, and verify special cases or boundary values.", "A numerical match at sampled points is evidence, not an identity proof.", "Parametric root :: x²−(a+1)x+a=0. :: Factor (x−1)(x−a); roots 1,a, coincident when a=1.", "Matrix system :: [[2,1],[1,2]](x,y)=(3,3). :: Solution x=y=1.", "Inverse composition :: f(x)=3x−2. :: f⁻¹(x)=(x+2)/3 and f⁻¹(f(t))=t."),
    classic: i("Classic algebra uses balance, substitution, and equivalent expressions to solve unknowns. The central rule is to preserve equality while simplifying both sides.", "Collect like terms, isolate the variable, and check the result in the original equation or expression.", "A transformation that divides by a variable needs a separate check when that variable is zero.", "Balance :: 3x+4=19. :: Subtract 4 and divide by 3 to get x=5.", "Factor :: x²−16. :: Difference of squares gives (x−4)(x+4).", "Substitute :: y=2x+1 and x=3. :: y=7, the coordinate is (3,7).")
  },
  "algebraic-structures": {
    home: i("An algebraic structure is a set together with operations satisfying axioms. Closure, associativity, identity, inverses, and order laws distinguish semigroups, monoids, groups, rings, and lattices.", "State the carrier set and operation, test each axiom with symbols or a complete finite table, then look for counterexamples.", "An identity element depends on the operation: 0 for addition, 1 for multiplication.", "Integers :: (ℤ,+) has identity 0 and inverse −a for each a. :: It forms a group under addition.", "Natural numbers :: (ℕ,+) has 0 if included but lacks additive inverses. :: It is a monoid, not a group.", "Subsets :: Power set under union. :: Identity is empty set and union is associative and idempotent."),
    "structure-test": i("A structure test checks axioms in the right order: closure, associativity, identity, and inverses. A single counterexample is enough to reject an axiom.", "Choose a set and operation, evaluate all pairs for closure and all triples for associativity when finite, then locate an identity and each inverse.", "Commutativity is not required for a group; it is an extra property of abelian groups.", "Even integers :: Even+even is even. :: Closure holds; 0 and negatives also remain even, giving an additive group.", "Subtraction :: On integers, (5−3)−1=1 but 5−(3−1)=3. :: Associativity fails.", "Nonzero rationals :: Under multiplication, identity 1 and inverse 1/a exist. :: This is an abelian group."),
    "cayley-tables": i("A Cayley table lists every output of a finite binary operation. Rows and columns reveal closure, identity, inverses, and commutativity; associativity requires checking triples.", "Label elements consistently, fill each cell a*b, locate an identity row and column, then search each row for the identity to find inverses.", "A symmetric table proves commutativity, not associativity.", "Mod 3 addition :: Elements 0,1,2. :: Row for 2 is 2,0,1; identity is 0 and inverse of 2 is 1.", "XOR :: Elements 0,1 with bitwise XOR. :: Table has 0 as identity and each element self-inverse.", "Left projection :: Define a*b=a on {0,1}. :: Table rows are constant; no two-sided identity exists."),
    "semigroups-monoids": i("A semigroup has an associative operation. A monoid is a semigroup with an identity; inverses are not required.", "Check closure and associativity, then test a candidate identity on both sides of every element.", "A left identity need not be a right identity, so test both directions.", "Strings :: Concatenation is associative. :: Empty string is identity, so strings form a monoid.", "Positive integers :: Multiplication is associative with identity 1. :: It is a monoid; most elements lack inverses within positive integers.", "Max operation :: max(a,b) on nonnegative integers. :: Identity is 0 because max(0,a)=a."),
    "posets-lattices": i("A partial order is reflexive, antisymmetric, and transitive. A lattice additionally has a meet (greatest lower bound) and join (least upper bound) for each pair.", "Draw a Hasse diagram without reflexive and transitive edges, then find meet and join from the order.", "Incomparable elements are allowed in a poset; a total order requires every pair to be comparable.", "Divisibility :: On {1,2,3,6}, a≤b when a divides b. :: Meet of 2 and 3 is gcd=1; join is lcm=6.", "Subsets :: Under inclusion, meet is intersection and join is union. :: {1,2}∧{2,3}={2}.", "Schedule priority :: Tasks A and B can be incomparable. :: A partial order can still place both before task C."),
    "boolean-algebra": i("Boolean algebra combines AND, OR, and NOT with identities such as distributivity and De Morgan's laws. Sets and digital circuits provide concrete models.", "Build a truth table for the expression, simplify with identities, then check the resulting circuit or set operation.", "The distributive laws work in both directions; a visual circuit simplification must preserve every input row.", "Access rule :: A AND (B OR C). :: Equivalent to (A AND B) OR (A AND C).", "De Morgan :: NOT(A AND B). :: Equivalent to (NOT A) OR (NOT B).", "Absorption :: A OR (A AND B). :: Always equals A, so one gate branch can be removed.")
  },
  "number-systems": {
    home: i("Number systems expand to support new operations: natural numbers count, integers include negatives, rationals express ratios, and reals include limits such as √2.", "Place each number in the smallest familiar set that contains it, convert representations, and compare locations on the real line.", "A finite decimal is rational; an infinite nonrepeating decimal can be irrational.", "Temperature :: −5 °C requires an integer below zero. :: Natural counting numbers cannot represent it.", "Recipe :: 3/4 cup is rational. :: Its decimal 0.75 terminates.", "Diagonal :: A unit square diagonal is √2. :: It is real and irrational, not expressible as a fraction of integers."),
    rational: i("A rational number has form p/q with integers p,q and q≠0. Its decimal expansion terminates or repeats; arithmetic is closed under addition, subtraction, multiplication, and division by nonzero rationals.", "Use a common denominator for addition, reduce by gcd, and connect fraction, decimal, and point on the number line.", "The denominator cannot be zero; 0/0 is not a rational number.", "Shared pizza :: 2/3+1/4. :: Common denominator 12 gives 8/12+3/12=11/12.", "Repeating decimal :: 0.333… . :: Let x=0.333…; 10x−x=3, so x=1/3.", "Scale :: 3/5 of 20 km. :: Distance is 12 km."),
    irrational: i("An irrational real cannot equal p/q for integers p,q≠0. Its decimal expansion neither terminates nor repeats; common examples include √2, π, and e.", "Use geometric constructions or bounds to locate irrationals, and distinguish exact symbols from rounded measurements.", "A decimal approximation such as 1.414 is rational even though it approximates irrational √2.", "Square diagonal :: Side 1 gives diagonal √2 by Pythagoras. :: √2≈1.4142 but has no exact fraction form.", "Circle :: Circumference divided by diameter is π. :: A radius-1 circle has exact circumference 2π.", "Sum :: √2+(2−√2). :: Result 2 is rational; sums involving irrationals need not be irrational."),
    "real-line": i("Every real number has a position on the number line. Order compares positions, absolute value measures distance from zero, and intervals encode sets of positions.", "Place reference integers, estimate irrational positions, then use inequalities and interval notation to show ranges.", "A strict inequality excludes endpoints; a closed interval includes them.", "Distance :: |-3−2|. :: Points -3 and 2 are 5 units apart.", "Bound :: -2≤x<4. :: Interval is [-2,4), including -2 but excluding 4.", "Root :: √5≈2.236. :: It lies between 2 and 3 because 4<5<9."),
    hierarchy: i("The standard containment chain is ℕ⊂ℤ⊂ℚ⊂ℝ, with irrationals in ℝ outside ℚ. Complex numbers extend ℝ by adding i with i²=−1.", "Classify a number by exact definition rather than its appearance, and distinguish a number's value from one representation of it.", "Depending on convention, 0 may or may not be included in ℕ; state the chosen convention.", "Negative count :: −7 is integer, rational (-7/1), and real. :: It is not natural.", "Fraction :: 0.125=1/8. :: It is rational despite decimal notation.", "Complex root :: Solve x²+1=0. :: Solutions ±i are complex but not real."),
    concepts: i("Number concepts include closure, order, density, completeness, and representation. Between two distinct rationals lies another rational; real completeness also fills limits missing from ℚ.", "Test an operation on a chosen set, compare neighboring values with averages, and use sequences to understand limiting behavior.", "A dense subset can still omit points: rationals are dense in reals but do not contain √2.", "Between fractions :: Between 1/3 and 1/2. :: Their average 5/12 lies strictly between them.", "Closure :: Integers under subtraction. :: 3−5=−2 remains an integer.", "Limit :: Decimal approximations 1.4,1.41,1.414,… . :: They approach √2, which is not rational."),
    practice: i("Reliable number-system practice combines exact calculation with estimation. Fractions and roots should be simplified before rounding; reported precision should match the task.", "Classify values, perform operations in exact form, estimate magnitude, then convert to decimals only when needed.", "Premature rounding can accumulate error across repeated operations.", "Fraction sum :: 5/6−1/4. :: 10/12−3/12=7/12≈0.5833.", "Radical :: √50. :: Factor 25·2 to obtain exact 5√2≈7.071.", "Percent error :: Approximate π as 3.14. :: Absolute error ≈0.00159 and relative error ≈0.051%.")
  },
  calculus: {
    home: i("Calculus studies limits, instantaneous change, accumulation, and multivariable variation. Derivatives describe local rates; integrals aggregate continuously varying quantities.", "Read the units and geometry first, form a limit or sum, apply the relevant theorem, and check the result against a graph or physical interpretation.", "A memorized derivative or integral without its domain and initial conditions may answer the wrong question.", "Velocity :: s(t)=t² metres. :: Instantaneous velocity s′(3)=6 m/s.", "Distance :: v(t)=2t m/s for 0≤t≤3. :: ∫₀³2t dt=9 m traveled.", "Optimization :: A(x)=x(10−x). :: A′=10−2x=0 at x=5, the maximum area 25."),
    limits: i("A limit describes the value approached near a point, regardless of the function's value exactly there. Continuity requires the two-sided limit to equal that value.", "Test from left and right, simplify removable factors only for x near the point, and use a graph or table to check the algebra.", "Substituting x=a into a 0/0 form gives indeterminacy, not a numeric limit.", "Removable hole :: f(x)=(x²−4)/(x−2). :: For x≠2, f=x+2, so lim(x→2)f=4.", "One-sided jump :: f(x)=|x|/x near 0. :: Left limit -1 and right limit 1; two-sided limit does not exist.", "Infinite limit :: f(x)=1/x² near 0. :: Values grow without bound on both sides; no finite limit."),
    derivatives: i("The derivative f′(x) is the limit of average slopes [f(x+h)−f(x)]/h as h→0. It gives tangent slope and instantaneous rate.", "Differentiate with product, chain, and quotient rules as needed, then interpret sign and units at a point.", "The derivative of a product is not the product of derivatives; use (fg)′=f′g+fg′.", "Motion :: s=t³ metres. :: v=s′=3t² and v(2)=12 m/s.", "Tangent :: f=x² at x=3. :: Slope f′(3)=6, so tangent y−9=6(x−3).", "Chain rule :: f(x)=sin(x²). :: f′(x)=2x cos(x²)."),
    "derivative-applications": i("Derivative signs identify increasing/decreasing intervals, while critical points and endpoint checks locate extrema. Second derivatives describe curvature and acceleration.", "Form an objective with a domain, differentiate, solve f′=0, test critical points and endpoints, then interpret units.", "A critical point can be a minimum, maximum, or neither; f′=0 alone is not enough.", "Fencing :: Fixed perimeter 40 m gives A=x(20−x). :: Maximum at x=10 m with area 100 m².", "Acceleration :: s=t³−3t². :: v=3t²−6t and a=6t−6; acceleration vanishes at t=1.", "Related rates :: A=πr² and dr/dt=2 cm/s at r=3 cm. :: dA/dt=2πr·dr/dt=12π cm²/s."),
    integration: i("An integral accumulates infinitesimal contributions. The Fundamental Theorem of Calculus links accumulation to antiderivatives: ∫_a^b f(x)dx=F(b)−F(a) when F′=f.", "Choose signed area or physical accumulation, find an antiderivative or numerical approximation, and include bounds and units.", "A definite integral may be negative; physical area uses absolute values where the graph crosses the axis.", "Velocity :: v=2t on 0≤t≤3. :: Displacement ∫₀³2t dt=9 m.", "Area :: f=x² on [0,2]. :: ∫₀²x²dx=8/3 square units.", "Net change :: Flow rate 5−t L/min from 0 to 4. :: Accumulated volume ∫₀⁴(5−t)dt=12 L."),
    "integration-techniques": i("Integration techniques reverse differentiation patterns. Substitution handles composition, integration by parts reverses a product rule, and partial fractions split rational functions.", "Inspect the integrand's structure, choose a substitution or decomposition, integrate, and differentiate the answer to verify.", "A substitution in a definite integral must also transform the limits or return to the original variable.", "Substitution :: ∫2x cos(x²)dx. :: Let u=x²; result sin(x²)+C.", "By parts :: ∫x e^x dx. :: x e^x−∫e^x dx=(x−1)e^x+C.", "Partial fractions :: ∫1/(x²−1)dx. :: Split into 1/2[1/(x−1)−1/(x+1)] and integrate logs."),
    "integral-applications": i("Integrals compute volume, work, mass, and average value by summing thin pieces. The integrand must include the correct cross-sectional geometry and units.", "Draw a representative slice, write its differential contribution, choose limits, then integrate.", "Using radius where the formula needs radius squared can produce a dimensional error in volume.", "Disk solid :: Rotate y=x on [0,2] about x-axis. :: V=π∫₀²x²dx=8π/3.", "Work :: Force F(x)=3x N moves from x=0 to 2 m. :: Work ∫₀²3x dx=6 J.", "Average :: Temperature T(t)=20+2t over 0–4 h. :: Average (1/4)∫₀⁴Tdt=24 °C."),
    "differential-equations": i("A differential equation in calculus connects an unknown function with its derivative. Slope fields visualize first-order solutions; initial data select a trajectory.", "Classify separable or linear structure, solve symbolically when possible, then compare with Euler or RK4 approximations.", "A slope field is local; a curve must be tangent to its arrows at every point.", "Growth :: y′=0.2y, y(0)=5. :: y=5e^(0.2t).", "Cooling :: T′=-0.1(T−20), T₀=80. :: T(t)=20+60e^(-0.1t).", "Euler :: y′=y, y₀=1, h=0.1. :: First approximation 1.1 versus exact e^0.1≈1.1052."),
    "series-parametric-polar": i("A series approximates a function by sums; parametric curves specify x(t),y(t), and polar curves specify radius r(θ). Convergence and coordinate choice determine what conclusions are valid.", "For a series, identify a convergence test and its hypotheses. For curves, compute derivatives from the chosen parameter and check where denominators vanish.", "An alternating series may converge conditionally even when its absolute-value series diverges.", "Geometric series :: Σ_(n=0)^∞(1/2)^n. :: Sum is 1/(1−1/2)=2.", "Parametric tangent :: x=t²,y=t³ at t=2. :: dy/dx=(3t²)/(2t)=3.", "Polar circle :: r=2cosθ. :: x²+y²=2x, a circle centered (1,0) with radius 1."),
    "multivariable-vector": i("A multivariable function changes along many directions. Partial derivatives hold other variables fixed; the gradient points toward steepest local increase.", "Compute each partial, assemble ∇f, and use directional derivative ∇f·u for a unit direction u.", "The gradient is a vector of rates; a directional derivative requires a unit direction to represent rate per unit distance.", "Hill :: f(x,y)=x²+y². :: At (1,2), ∇f=(2,4), pointing outward.", "Temperature :: T=20+3x−2y. :: Moving one unit east changes T by +3; north by -2.", "Directional rate :: ∇f=(2,4), u=(3/5,4/5). :: D_u f=6/5+16/5=22/5."),
    jacobians: i("The Jacobian matrix contains all first partial derivatives of a coordinate map. Its determinant gives local signed area or volume scaling, so change of variables uses its absolute value.", "Write the transformation and domain, calculate the Jacobian determinant, transform boundaries, and integrate with |J|.", "For polar coordinates the area element is r dr dθ, not simply dr dθ.", "Polar :: x=r cosθ,y=r sinθ. :: |J|=r, so a radius-R disk area is ∫₀²π∫₀ᴿr dr dθ=πR².", "Scaling :: x=2u,y=3v. :: |J|=6; a unit uv-square maps to area 6.", "Shear :: x=u+v,y=v. :: |J|=1, so area is preserved."),
    "beta-gamma": i("Gamma extends factorial: Γ(n+1)=n! for nonnegative integers. Beta integrates powers on [0,1] and satisfies B(p,q)=Γ(p)Γ(q)/Γ(p+q).", "Check parameter positivity, use recurrence or substitution to simplify, and relate special values to known integrals.", "Γ(0) is undefined; factorial extension does not remove poles at nonpositive integers.", "Factorial :: Γ(5). :: Γ(5)=4!=24.", "Half value :: Γ(1/2). :: It equals √π through the Gaussian integral.", "Beta :: B(2,3)=∫₀¹t(1−t)²dt. :: Γ(2)Γ(3)/Γ(5)=1/12."),
    "series-tests": i("A series Σa_n converges when its partial sums approach a finite limit. Comparison, ratio, root, alternating, and integral tests apply under different hypotheses.", "Check whether a_n→0 first, identify sign and growth type, then select a test and state what it proves.", "a_n→0 is necessary but not sufficient: the harmonic series diverges.", "Geometric :: Σ_(n=0)^∞(1/3)^n. :: Converges to 3/2 because |r|<1.", "Harmonic :: Σ1/n. :: Diverges even though 1/n→0.", "Alternating :: Σ(-1)^(n+1)/n. :: Converges by alternating test but not absolutely."),
    "curve-tracing": i("Curve tracing combines domain, intercepts, symmetry, first derivative, second derivative, and asymptotes into a coherent graph.", "Find undefined points and limits, solve f′=0 for turning points, use f″ for concavity, then compare with sampled values.", "A vertical asymptote is a limit statement; a small denominator alone does not prove one if the numerator also vanishes.", "Cubic :: f=x³−3x. :: f′=3x²−3 gives extrema at x=±1.", "Rational :: f=1/(x−2). :: Domain excludes 2 and x=2 is a vertical asymptote.", "Inflection :: f=x³. :: f″=6x changes sign at 0, so the origin is an inflection point."),
    "taylor-two-variables": i("A two-variable Taylor approximation uses value, gradient, and Hessian near a base point. The quadratic term captures local curvature and mixed interaction.", "At (a,b), compute f, ∇f, and Hessian; then evaluate f(a,b)+∇f·h+(1/2)hᵀHh for a small displacement h.", "Local approximations can become inaccurate far from the expansion point.", "Surface :: f=x²+y² near (1,1). :: For h=(0.1,0.2), exact second-order Taylor gives 2+0.6+0.05=2.65.", "Mixed term :: f=xy near (1,2). :: Expansion 2+2h_x+h_y+h_xh_y is exact.", "Plane :: f=sin x+y near (0,0). :: First-order approximation is x+y."),
    "lagrange-multipliers": i("At a smooth constrained extremum of f subject to g=c, the objective gradient is parallel to the constraint gradient: ∇f=λ∇g.", "Solve the multiplier equations together with the constraint, then compare all candidates and boundary cases.", "The multiplier condition finds candidates, not automatically maxima; singular constraints need separate inspection.", "Fence :: Maximize xy with x+y=10. :: x=y=5 gives maximum area 25.", "Nearest point :: Minimize x²+y² subject to x+y=2. :: Point (1,1) has minimum squared distance 2.", "Sphere :: Maximize z subject to x²+y²+z²=9. :: Top point (0,0,3) is the maximum."),
    "change-order": i("A double integral over a region can be computed in either order when the integrand is integrable. Changing order means describing the same region with new inner and outer bounds.", "Sketch the region from the original bounds, project it on the new outer axis, and solve boundary curves for the new inner variable.", "Swapping integral symbols without changing limits usually changes the region.", "Triangle :: 0≤x≤1, 0≤y≤x. :: Reversed order is 0≤y≤1, y≤x≤1.", "Area :: ∫₀¹∫₀ˣ1 dy dx. :: Value is 1/2 in either order.", "Curved region :: 0≤x≤1, x²≤y≤1. :: Reversed: 0≤y≤1, 0≤x≤√y."),
    centroid: i("The centroid is the mass-weighted average position. For uniform planar density, x̄=(1/A)∫∫_R x dA and ȳ=(1/A)∫∫_R y dA.", "Determine area or mass first, then compute first moments and divide by total. Use symmetry to avoid unnecessary integration.", "A centroid can lie outside a concave region; it is not always a point inside the material.", "Rectangle :: Uniform 6×4 plate. :: Centroid is (3,2) from one corner.", "Triangle :: Vertices (0,0),(6,0),(0,3). :: Centroid is average of vertices, (2,1).", "Two masses :: 2 kg at x=0 and 1 kg at x=6. :: Center of mass x̄=(2·0+1·6)/3=2."),
    "moments-of-inertia": i("Moment of inertia measures mass distribution about an axis: I=∫r²dm. Material farther from the axis contributes quadratically more.", "Choose the axis, express perpendicular distance r, specify density, and integrate over the object; use the parallel-axis theorem when shifting axes.", "Area moment of inertia in structural engineering and mass moment of inertia have different units and interpretations.", "Point masses :: 1 kg at radius 2 m and 2 kg at radius 1 m. :: I=1·4+2·1=6 kg·m².", "Thin rod :: Uniform mass M, length L about center. :: I=ML²/12.", "Parallel axis :: Disk has I_center=MR²/2. :: About tangent axis, I=MR²/2+MR²=3MR²/2."),
    "integral-engineering": i("Multiple integrals accumulate density over regions or volumes. They compute mass, average fields, probability, and engineering properties when a single-variable slice is insufficient.", "Describe the domain, choose Cartesian/polar/cylindrical coordinates, include the Jacobian, and integrate density or the required moment.", "A coordinate change without its Jacobian gives the wrong physical units and total.", "Plate mass :: Uniform density 2 kg/m² over a 3×4 m plate. :: Mass ∫∫2 dA=24 kg.", "Disk area :: Radius 2 disk in polar coordinates. :: ∫₀²π∫₀²r dr dθ=4π.", "Mean temperature :: T=x+y on unit square. :: Average ∫₀¹∫₀¹(x+y)dxdy=1."),
    advanced: i("Advanced calculus combines convergence, multivariable derivatives, optimization, and coordinate changes. Each method is valid only under its continuity, differentiability, or domain assumptions.", "Translate a problem into geometry and notation, choose a theorem with matching hypotheses, compute, then inspect limiting or boundary cases.", "A symbolic result can be wrong at singular points or omitted boundaries even when algebra elsewhere is correct.", "Critical point :: f=x²+y² under x+y=2. :: Constrained minimum at (1,1), value 2.", "Jacobian :: x=2u,y=3v. :: Unit square area scales by 6.", "Series :: Σ_(n=1)^∞1/n². :: It converges by p-series test with p=2.")
  }
};
De["advanced-concepts"] = {
  "continued-fractions": i("A continued fraction writes a real number as a₀+1/(a₁+1/(a₂+⋯)). Truncating it gives convergents pₙ/qₙ, often exceptionally accurate for their denominator.", "Take the integer part, invert the fractional remainder, and repeat. Build convergents with pₙ=aₙpₙ₋₁+pₙ₋₂ and the same recurrence for q.", "A decimal rounded before expansion can change later partial quotients dramatically.", "Rational sensor ratio :: Apply Euclid to 13/8: 13=1·8+5, 8=1·5+3, 5=1·3+2, 3=1·2+1. :: 13/8=[1;1,1,1,2], and the final convergent is exact.", "Square-root estimate :: √2=[1;2,2,2,…]. :: Convergents 1, 3/2, 7/5, 17/12 progressively approach 1.4142.", "Gear ratio :: Approximate π by a small-denominator fraction. :: The convergent 22/7≈3.14286 errs by about 0.00126."),
  "famous-problems": i("A famous problem may be a proved theorem, an open conjecture, or a paradox resolved by changing axioms. Examples connect elementary statements to deep proof methods.", "State the claim with its quantifiers, test small cases to build intuition, then separate numerical evidence from a proof covering every case.", "A billion successful trials do not prove a universal claim over infinitely many integers.", "Collatz orbit :: Start at 6 and apply n/2 for even n or 3n+1 for odd n. :: 6→3→10→5→16→8→4→2→1, one observed orbit but no general proof.", "Four colors :: A planar map has adjacent regions sharing an edge. :: The four-color theorem guarantees a coloring with at most four colors, regardless of map size.", "Fermat equation :: Test n=3 and x=3,y=4. :: 3³+4³=91, not a cube; Fermat's theorem rules out every positive integer triple for all n>2."),
  "stats-inference": i("Inference uses a sample statistic to estimate an unknown population quantity. A confidence interval adds uncertainty from repeated sampling; a hypothesis test measures conflict with a specified null.", "Check how the data were sampled, compute the estimate and standard error, select a justified critical value, and interpret the interval in population terms.", "A 95% confidence interval does not assign 95% probability to a fixed parameter after the data are observed.", "Election share :: 600 of 1000 sampled voters support a proposal. :: p̂=0.6; approximate 95% margin 1.96√(0.6·0.4/1000)≈0.0304.", "Conversion test :: 55 conversions in 100 visits, test p₀=0.5. :: z=(0.55−0.5)/√(0.25/100)=1; this is weak two-sided evidence.", "Sample planning :: Want margin 0.05 for a proportion near 0.5 at 95%. :: n≈1.96²·0.25/0.05²≈385 independent responses."),
  "differential-equations": i("A first-order initial value model y′=f(t,y), y(t₀)=y₀ predicts how a state changes from its current value. Exact solutions serve as a check for numerical stepping.", "Identify units and an equilibrium, solve analytically when separable or linear, then compare Euler's yₙ₊₁=yₙ+hf(tₙ,yₙ) with the exact curve.", "Euler's error grows when the step is large relative to the model's time scale.", "Cooling :: T′=−0.2(T−20), T(0)=80. :: T(5)=20+60e⁻¹≈42.1 °C.", "Growth :: P′=0.3P, P(0)=100. :: P(2)=100e⁰·⁶≈182.2.", "Euler check :: y′=y, y(0)=1, h=0.1. :: One Euler step is 1.1; exact y(0.1)=e⁰·¹≈1.1052."),
  "special-functions": i("Special functions extend elementary operations: Gamma generalizes factorial, Beta normalizes power-law densities, erf integrates the Gaussian kernel, and zeta sums reciprocal powers.", "Check each function's domain, use identities and recurrence relations, and compare numeric values against a known special case.", "A named function can have poles or branch restrictions; evaluating outside the defining integral may require analytic continuation.", "Factorial extension :: Γ(5)=∫₀∞t⁴e⁻ᵗdt. :: Γ(5)=4!=24.", "Beta probability :: B(2,3)=∫₀¹t(1−t)²dt. :: B(2,3)=1/12, so density 12t(1−t)² integrates to 1.", "Basel sum :: ζ(2)=Σₙ₌₁∞1/n². :: ζ(2)=π²/6≈1.645.")
};
De["statistics-extended"] = {
  "survey-sampling": i("Stratified sampling estimates a population mean as ΣWₕȳₕ. Independent samples within strata contribute variance ΣWₕ²Sₕ²/nₕ; a finite population correction matters for large sampling fractions.", "Choose strata before sampling, allocate observations using size and within-stratum variation, then weight each stratum estimate by its population share.", "Equal sample sizes across unequal strata generally require weights; an unweighted overall average can be biased.", "District poll :: Urban share 0.6 has 55% support and rural share 0.4 has 45%. :: Weighted support is 0.6·0.55+0.4·0.45=0.51.", "Finite census :: Sample 200 without replacement from N=1000. :: Standard error multiplier is √((1000−200)/(1000−1))≈0.895.", "Neyman allocation :: Two equally sized strata have SDs 10 and 20; total n=90. :: Allocate 30 and 60 observations in proportion to NₕSₕ."),
  "design-of-experiments": i("An experiment estimates treatment effects by random assignment. Blocking removes known nuisance variation; replication estimates residual noise; factorial designs expose interactions.", "Specify response and factors, randomize within blocks, compute treatment and error sums of squares, then compare mean squares with an F ratio.", "A significant main effect may hide opposing effects across levels of a second factor; inspect interaction first.", "Fertilizer blocks :: Three fields each receive A and B; paired yield differences are 2,3,1. :: Mean treatment gain is 2 units after field blocking.", "Website factorial :: A button adds 2% conversion on desktop but −1% on mobile. :: Device modifies the button effect, so report an interaction.", "ANOVA :: Treatment MS=18, error MS=3. :: F=18/3=6; compare with an F reference distribution for the design's degrees of freedom."),
  "quality-control": i("A control chart tests whether process variation is stable over time. Capability compares stable process spread with customer specification limits; control and specification limits answer different questions.", "Estimate the process center and σ from stable data, plot time-ordered observations against control limits, then compute Cp and Cpk against specifications.", "A process can be stable yet produce many defects if it is centered poorly or too variable.", "Fill volume :: Target 500 mL, σ=2, specs 494–506. :: Cp=(506−494)/(6·2)=1; the spread exactly fills the tolerance.", "Off-center process :: Mean 503 mL with same specs and σ=2. :: Cpk=min(506−503,503−494)/(3·2)=0.5.", "p chart :: Defect fraction p̄=0.02 in samples of 100. :: Approximate 3σ upper limit is 0.02+3√(0.02·0.98/100)≈0.062."),
  "time-series": i("A time series combines level, trend, seasonal repetition, and irregular error. Forecasts must respect temporal order; smoothing trades noise reduction for lag.", "Plot by time, choose a seasonal period, fit level or trend, inspect residual autocorrelation, and score forecasts on future observations.", "Random train/test shuffling leaks future information into a forecast evaluation.", "Store sales :: Months show 100,110,120 units. :: Three-month moving average after month 3 is 110 units.", "Exponential smoothing :: Prior forecast 100, observed 120, α=0.25. :: Updated forecast is 0.25·120+0.75·100=105.", "Forecast error :: Actuals 10,12 and forecasts 9,15. :: MAE=(1+3)/2=2 units."),
  nonparametric: i("Rank and sign tests compare samples with fewer distributional assumptions than parametric mean tests. The test statistic depends on pairing and number of groups.", "For paired measurements use signs or signed ranks; for independent groups rank all observations together and compute Mann–Whitney U or Kruskal–Wallis.", "Mann–Whitney U is not automatically a test of medians when group shapes differ.", "Pain before/after :: Five patients all improve. :: Two-sided sign-test probability is 2/2⁵=0.0625 under equal improvement/worsening chance.", "Two groups :: Scores A={1,2}, B={3,4}. :: A has rank sum 3 and U_A=3−2·3/2=0, complete separation.", "Runs :: Binary outcomes H,H,H,T,T,T form two runs. :: Few runs may suggest clustering versus random order."),
  "multivariate-analysis": i("Multivariate analysis handles correlated outcomes jointly. PCA diagonalizes covariance; Hotelling's T² generalizes a mean-distance test; MANOVA compares vector means.", "Standardize when units differ, estimate covariance, inspect eigenvalues and eigenvectors, and check whether a joint test adds information beyond separate tests.", "A principal component explains variance, not necessarily a causal mechanism or a meaningful label.", "Correlated sensors :: Covariance [[2,1],[1,2]]. :: Eigenvalues 3 and 1; direction (1,1) captures 75% of total variance.", "Portfolio :: Two assets each have variance 4 and covariance 2. :: Equal-weight portfolio variance is 0.25(4+4+2·2)=3.", "Joint biomarkers :: Treatment shifts two correlated measures by (1,1). :: Mahalanobis distance uses Σ⁻¹ so shared variation is not counted twice."),
  "advanced-inference": i("Advanced inference compares estimator bias, variance, coverage, and decision error. Likelihood combines evidence from observations; Bayesian updating combines it with a prior.", "Write the sampling model and likelihood, identify the estimand, derive or simulate an interval, and check coverage under repeated synthetic samples.", "A narrow interval can still be unreliable if model assumptions or selection mechanisms are wrong.", "Binomial estimate :: 8 successes in 10 trials. :: Maximum-likelihood p̂=0.8.", "Beta update :: Prior Beta(2,2), then 8 successes and 2 failures. :: Posterior is Beta(10,4), mean 10/14≈0.714.", "Normal mean :: σ=4 known, n=64, sample mean 20. :: Standard error is 0.5; approximate 95% interval is 20±0.98."),
  "official-statistics": i("Official statistics turn survey and administrative records into comparable population indicators. Definitions, reference periods, weights, and revisions determine what an index means.", "Read the metadata, identify numerator and denominator, apply weights or base-year scaling, and state the population and time period.", "A change in a published rate may reflect a changed definition or sampling frame rather than only real-world change.", "Price index :: Basket costs ₹120 now versus ₹100 in base year. :: Index is 120, implying 20% cumulative basket inflation.", "Birth rate :: 1200 births among 100,000 residents in one year. :: Crude birth rate is 12 per 1000 residents.", "District average :: 60% of people live in A with rate 10%, 40% in B with rate 20%. :: Population-weighted rate is 14%, not 15%."),
  "survival-analysis": i("Survival analysis models time until an event while retaining right-censored observations. Kaplan–Meier multiplies conditional survival proportions at event times; hazards describe instantaneous event rates.", "Order event times, count subjects at risk just before each event, multiply (1−dᵢ/nᵢ), and mark censoring without treating it as a failure.", "Dropping censored subjects entirely biases estimates when they carried valid follow-up information.", "Machine lifetime :: At day 5, 2 of 10 machines fail. :: Kaplan–Meier survival drops to 8/10=0.8.", "Later event :: One unit is censored after day 5; at day 8, 1 of 7 at risk fails. :: Survival becomes 0.8·6/7≈0.686.", "Constant hazard :: λ=0.1 per year. :: Exponential survival at 5 years is e⁻⁰·⁵≈0.607."),
  "actuarial-reliability": i("Actuarial models price uncertain future claims and failures using event probabilities, severities, and timing. Expected loss is frequency times average severity before loading and expenses.", "Estimate exposure, claim frequency, claim amount, and uncertainty; discount future payments and test sensitivity to rate changes.", "Expected value alone misses tail risk and does not include administration, capital, or profit loading.", "Warranty reserve :: 1000 devices each have 2% failure probability and ₹500 repair cost. :: Expected repair reserve is 1000·0.02·500=₹10,000.", "Premium :: Expected claims ₹800, expenses ₹100, loading ₹100. :: Indicated premium is ₹1000 per policy.", "Reliability :: Constant failure hazard 0.02 per month. :: Probability of surviving 12 months is e⁻⁰·²⁴≈0.787."),
  "statistical-computing": i("Statistical computing approximates uncertainty when algebra is difficult. Bootstrap resamples observed units with replacement; permutation tests reshuffle labels under a null of exchangeability.", "Choose the statistic and resampling unit, repeat many simulated samples, inspect the empirical distribution, and report Monte Carlo uncertainty.", "Resampling individual rows is invalid when observations are clustered or serially dependent; resample at the independent unit.", "Bootstrap mean :: Data {2,4,6}; one resample {2,2,6}. :: Resample mean is 10/3 versus observed mean 4.", "Permutation :: Group A={1,2}, B={3,4}; observed mean difference is −2. :: Relabel all 6 possible 2-versus-2 assignments to form an exact null distribution.", "Monte Carlo π :: Uniform points in unit square; 7854 of 10,000 lie inside quarter circle. :: π≈4·0.7854=3.1416."),
  "applied-modelling": i("Applied models link predictors to outcomes while quantifying error. Linear regression predicts continuous values, logistic regression predicts event probability, and Poisson regression predicts counts.", "Define target and predictors, split data by the intended deployment setting, fit the appropriate link function, then check calibration and residual patterns.", "A strong fitted association does not establish causality, and accuracy on training data can conceal overfitting.", "Hospital odds :: Logistic intercept 0 gives baseline p=0.5; coefficient ln2 for risk factor. :: With factor present, odds double from 1 to 2, so p=2/3.", "Calls :: Poisson model predicts λ=3 arrivals/hour. :: Probability of zero calls is e⁻³≈0.0498.", "Linear demand :: Model sales=20+3·advertising (₹1000 units). :: At advertising=4, prediction is 32 sales units."),
  "school-statistics": i("School statistics introduces data displays, center, spread, and chance through concrete counts. The right summary depends on data type and skew.", "Organize observations into a frequency table, calculate median or mean as appropriate, visualize honestly, and distinguish replacement from no replacement in probability.", "An average can hide an outlier; always inspect the original distribution or a plot.", "Class marks :: Sorted marks 4,5,7,8,10. :: Median is 7 and mean is 34/5=6.8.", "Library pictograph :: One icon represents 5 books; a row has 6 icons. :: The row represents 30 books.", "Bag draw :: 3 red and 2 blue balls; draw two without replacement. :: P(both red)=(3/5)(2/4)=3/10.")
};
De["statistics-phase"] = {
  module: i("A probability model specifies possible outcomes and their chances; statistical inference works in reverse from observed data to unknown model parameters. Discrete mass sums to one, while continuous density integrates to one.", "Start with the outcome type and support, choose a distribution whose assumptions fit, estimate parameters, then compare predictions with observed frequencies.", "Matching a histogram visually is insufficient when observations are dependent or the model's support excludes possible outcomes.", "Quality test :: Each item is defective with probability 0.02 independently. :: Defect count among 100 items is binomial with mean 2.", "Waiting time :: Arrivals occur at rate 3/hour. :: Exponential mean waiting time is 1/3 hour, or 20 minutes.", "Survey :: 240 of 400 respondents agree. :: Sample proportion is 0.6; approximate SE is √(0.6·0.4/400)≈0.0245."),
  distributions: i("A distribution maps outcomes to probability. Discrete models assign mass to individual values; continuous models assign density whose area over an interval is probability.", "Choose support first, then identify mechanism such as fixed trials, waiting time, sampling without replacement, or symmetric measurement noise. Compare mean, variance, and tail behavior.", "For a continuous variable P(X=a)=0 even if its density at a is positive.", "Dice :: A fair die has six equally likely outcomes. :: P(X≥5)=2/6=1/3.", "Poisson calls :: Average 2 calls per hour. :: P(X=0)=e⁻²≈0.135.", "Normal measurement :: X~N(100,10²). :: P(90<X<110)≈0.6827, the central one-SD area."),
  sampling: i("A sampling distribution describes how a statistic varies across repeated samples. For independent observations, the mean's standard error is σ/√n; the Central Limit Theorem often makes its standardized shape nearly normal.", "Choose a population model, repeatedly sample the same size, calculate a statistic per sample, and compare the empirical spread with its standard-error formula.", "The CLT concerns the distribution of sample means, not a claim that the original population is normal.", "Factory output :: Individual measurements have σ=12 and n=36. :: Sample-mean standard error is 12/√36=2.", "Sample planning :: Want SE at most 1 with σ=10. :: Need n≥(10/1)²=100 independent measurements.", "Polling :: p=0.4 and n=400. :: Proportion standard error is √(0.4·0.6/400)≈0.0245."),
  inference: i("A hypothesis test compares observed data with a specified null model; its p-value is a tail probability assuming that null. Confidence intervals report a range of estimates compatible with the data and procedure.", "Write null and alternative first, choose an appropriate standard error and test statistic, calculate a p-value, then report effect size and uncertainty.", "The p-value is not the probability that the null hypothesis is true.", "Coin test :: 60 heads in 100 tosses, H₀:p=0.5. :: z=(0.6−0.5)/√(0.25/100)=2; two-sided p≈0.0455.", "Mean interval :: Sample mean 50, known σ=10, n=100. :: 95% interval is 50±1.96·1=48.04 to 51.96.", "Power :: True proportion 0.6 versus null 0.5. :: Increasing n shrinks SE, making that 0.1 difference easier to detect."),
  regression: i("Regression predicts an outcome from predictors; residuals are observed minus predicted values. A good fit needs both an appropriate trend and residual behavior consistent with model assumptions.", "Fit coefficients, plot residuals against predictions and time, compute SSE and R², then validate on new data.", "A high R² can coexist with curved residuals or influential points and does not show causation.", "Sales line :: ŷ=5+2x and x=3. :: Predicted sales are 11; if observed y=13, residual is +2.", "Fit quality :: SST=100 and SSE=20. :: R²=1−20/100=0.8, so the fit accounts for 80% of sample variation.", "Outlier :: Four points lie near y=x; add (100,0). :: The far point can pull a least-squares line strongly, so inspect leverage."),
  bayesian: i("Bayesian inference updates prior probability with likelihood: posterior odds equal prior odds times the likelihood ratio. In low-base-rate settings, false positives can dominate positive results.", "Construct a contingency table or Bayes numerator and denominator, calculate posterior probability, then test sensitivity to prior and test accuracy.", "Sensitivity is P(positive|condition), while positive predictive value is P(condition|positive); they are not interchangeable.", "Screening :: Prevalence 1%, sensitivity 90%, false-positive rate 10%. :: P(condition|positive)=0.009/(0.009+0.099)=1/12≈8.3%.", "Spam filter :: Prior spam 20%, P(flag|spam)=0.8, P(flag|legitimate)=0.05. :: P(spam|flag)=0.16/(0.16+0.04)=0.8.", "Beta coin :: Prior Beta(2,2), observe 3 heads and 1 tail. :: Posterior Beta(5,3) has mean 5/8."),
  stochastic: i("A stochastic process tracks a state that evolves randomly. Markov chains use transition probabilities; Poisson processes model independent arrivals; queue utilization compares arrival and service rates.", "Identify states and time steps, build a transition matrix or rate model, iterate it, and inspect long-run behavior and parameter sensitivity.", "A stationary distribution depends on the transition model and may not exist uniquely for a reducible chain.", "Weather chain :: Sunny→sunny 0.8, rainy→sunny 0.4. :: If today is sunny, tomorrow's sun probability is 0.8.", "Call arrivals :: Poisson rate 2/hour. :: P(no calls in 1 hour)=e⁻²≈0.135.", "Queue :: Arrival rate 8/hour, service rate 10/hour. :: Utilization ρ=8/10=0.8; a single-server queue is stable only when ρ<1."),
  "advanced-models": i("Advanced statistical models handle correlated measurements, multimodal data, and information loss. A covariance matrix shapes multivariate-normal ellipses; mixtures combine component densities; KL divergence compares distributions asymmetrically.", "Inspect covariance eigenvectors, compare candidate component counts on held-out data, and quantify uncertainty or divergence with clearly stated reference distribution.", "Adding mixture components can always improve training likelihood yet worsen prediction; validate complexity.", "Covariance ellipse :: Σ=diag(4,1). :: One-standard-deviation contours are twice as wide in x as y.", "Mixture :: 30% of observations come from mean 0 and 70% from mean 10. :: Overall mean is 0.3·0+0.7·10=7.", "Entropy :: Fair binary event has p=0.5. :: H=−2(0.5 log₂0.5)=1 bit.")
};
const Da = {
  "trigonometry/waves": ["fbeat = |f₁ − f₂|", "y = 2A sin(kx) cos(ωt)", "fₙ = n f₁"],
  "linear-algebra/vector-spaces": ["span(v₁,v₂) = {c₁v₁ + c₂v₂}", "rank([v₁ v₂]) = number of independent columns", "v = c₁b₁ + c₂b₂"],
  "linear-algebra/playground": ["AB ≠ BA in general", "det(A) < 0 reverses orientation", "S² = S · S"],
  "modelling/comparison": ["RMSE = √(Σ(yᵢ − ŷᵢ)² / n)", "residualᵢ = yᵢ − ŷᵢ", "AIC = 2k − 2 ln(L̂)"],
  "discrete/graphs": ["cost(path) = Σ edge weights", "|E| = |V| − 1 for a tree", "χ(K₃) = 3"],
  "discrete/algorithms": ["binary-search steps ≈ ⌈log₂ n⌉", "gcd(a,b) = gcd(b, a mod b)", "BFS distance = minimum edge count from source"],
  "statistics/home": ["mean = Σxᵢ / n", "sample proportion p̂ = successes / trials", "SE(p̂) ≈ √(p̂(1−p̂)/n)"],
  "statistics/data-explorer": ["cov(x,y) = Σ(xᵢ−x̄)(yᵢ−ȳ)/(n−1)", "missing rate = missing observations / all observations", "slope b = cov(x,y)/var(x)"],
  "statistics/experiments": ["E[heads] = n/2 for a fair coin", "P(A) = favorable outcomes / equally likely outcomes", "P(D|+) = P(+|D)P(D)/P(+)"],
  "statistics/anova": ["F = MSbetween / MSwithin", "MSbetween = SSbetween / (k−1)", "MSwithin = SSwithin / (N−k)"],
  "algebraic-structures/cayley-tables": ["Tᵢⱼ = aᵢ ∘ aⱼ", "(a∘b)∘c = a∘(b∘c)", "e∘a = a∘e = a"],
  "algebraic-structures/semigroups-monoids": ["(a∘b)∘c = a∘(b∘c)", "e∘a = a∘e = a", "max(0,a) = a for a ≥ 0"],
  "algebraic-structures/boolean-algebra": ["A∧(B∨C) = (A∧B)∨(A∧C)", "¬(A∧B) = ¬A∨¬B", "A∨(A∧B) = A"],
  "statistics-phase/module": ["E[X] = np for X∼Binomial(n,p)", "E[T] = 1/λ for T∼Exponential(λ)", "SE(p̂) ≈ √(p̂(1−p̂)/n)"]
}, Fa = {
  "geometry/home/0": "SSS: (a,b,c) fixed ⇒ all three angles fixed",
  "geometry/triangles/1": "Pnew = kPold; Anew = k²Aold (k = 3)",
  "geometry/circles/2": "radius · tangent = (3,4) · (−4,3) = 0",
  "geometry/transformations/0": "(x′,y′) = (x+a,y+b) = (2−5,3+4) = (−3,7)",
  "geometry/measurement/1": "actual distance = map distance × scale = 3.2 × 5 = 16 km",
  "geometry/ar/0": "estimated length = 1 m × (300 px / 200 px) = 1.5 m",
  "trigonometry/ar/2": "frequency = 1 / period = 1 / 2 s = 0.5 Hz",
  "linear-algebra/least-squares/1": "constant least-squares fit = (4+5+6)/3 = 5",
  "linear-algebra/playground/0": "S·R₉₀(1,0) = (0,1), but R₉₀·S(1,0) = (0,2)",
  "linear-algebra/principal-axes/1": "T = ½(I₁ω₁² + I₂ω₂²); no ω₁ω₂ term in principal axes",
  "modelling/home/2": "residual = observed − predicted = (−1,0,2)",
  "modelling/optimization/1": "route cost = 5×₹2 + 3×₹4 = ₹22",
  "modelling/networks/1": "h(n) = |Δx| + |Δy| ≤ cheapest remaining route cost",
  "modelling/periodic/1": "H(t) = 12 + 3 sin(2πt/365) hours",
  "modelling/numerical/0": "π ≈ 4 × (points inside quarter circle / total points)",
  "discrete/home/2": "tree edge count = |V| − 1 = 7 − 1 = 6",
  "discrete/number-patterns/2": "Pascal row entry C(4,k) = 4!/[k!(4−k)!]",
  "discrete/logic/1": "¬(rain ∧ cold) = ¬rain ∨ ¬cold",
  "discrete/cryptography/2": "shared key = g^(ab) mod p = 5^(2·3) mod 23 = 8",
  "statistics/descriptive/0": "median = 25; mean = (20+22+25+28+100)/5 = 39",
  "statistics/clt/2": "SE(sample mean) = σ/√n; standardized means approach N(0,1)",
  "statistics/hypothesis/2": "signal-to-noise = effect / SE; SE shrinks as sample size grows",
  "algebra/proof/2": "2 ∈ primes and 2 is even ⇒ ‘all primes are odd’ is false",
  "algebraic-structures/home/2": "A ∪ ∅ = A; A ∪ A = A",
  "algebraic-structures/structure-test/2": "a·(1/a) = 1; ab = ba for nonzero real numbers",
  "algebraic-structures/posets-lattices/2": "A ≺ C and B ≺ C, while A ∥ B (incomparable)",
  "number-systems/home/1": "3/4 = 0.75",
  "number-systems/rational/2": "distance = (3/5) × 20 km = 12 km",
  "number-systems/irrational/1": "C = 2πr = 2π when r = 1",
  "number-systems/concepts/0": "midpoint = (1/3 + 1/2)/2 = 5/12",
  "calculus/centroid/1": "G = (A+B+C)/3 = ((0,0)+(6,0)+(0,3))/3 = (2,1)",
  "advanced-concepts/famous-problems/1": "χ(G) ≤ 4 for every planar map adjacency graph G",
  "statistics-extended/design-of-experiments/0": "paired mean difference = (2+3+1)/3 = 2",
  "statistics-extended/time-series/0": "MA₃ = (100+110+120)/3 = 110",
  "statistics-extended/nonparametric/2": "number of runs in H,H,H,T,T,T = 2",
  "statistics-extended/multivariate-analysis/2": "Mahalanobis distance² = ΔᵀΣ⁻¹Δ",
  "statistics-extended/official-statistics/1": "crude birth rate = (1200/100000)×1000 = 12 per 1000",
  "statistics-extended/actuarial-reliability/1": "premium = expected claims + expenses + loading = ₹1000",
  "statistics-extended/statistical-computing/0": "bootstrap mean = (2+2+6)/3 = 10/3",
  "statistics-extended/school-statistics/1": "represented books = 6 icons × 5 books/icon = 30",
  "statistics-phase/inference/2": "SE(p̂) ≈ √[p(1−p)/n]; larger n makes 0.6−0.5 easier to detect",
  "statistics-phase/bayesian/2": "Beta(2,2) + 3 heads + 1 tail ⇒ Beta(5,3); posterior mean = 5/8"
}, La = (t) => /[=≈≠∝≤≥<>→⇒+−×÷√∫∑^²³%°∈∪∥∧∨¬π]/.test(t), Et = (t) => t.split(";").map((n) => n.trim()).find(La);
function Na(t, n, r) {
  const l = Da[`${t}/${n}`];
  return r.examples.map((h, p) => ({
    title: h.title,
    expression: Fa[`${t}/${n}/${p}`] ?? (l == null ? void 0 : l[p]) ?? Et(h.result) ?? Et(h.setup) ?? h.result,
    context: h.setup,
    result: h.result
  }));
}
const Ba = (t, n) => `studio-theory-${t}-${n}`, de = [
  { id: "theory", label: "Theory & examples" },
  { id: "simple", label: "In Simple words" },
  { id: "formulas", label: "Formulas" },
  { id: "live", label: "Real-time examples" },
  { id: "practice", label: "Try these" }
];
function Oa({ studioId: t, page: n, mode: r }) {
  var q, O, f, I, E;
  const [l, h] = _("theory"), [p, u] = _(0);
  Me(() => {
    h("theory"), u(0);
  }, [t, n.id]);
  const v = (q = De[t]) == null ? void 0 : q[n.id], m = (O = za[t]) == null ? void 0 : O[n.id];
  if (!v || !m) return null;
  const w = r && n.modes.includes(r) ? r : n.modes[0], d = Ba(t, n.id), A = Na(t, n.id, v), D = (b) => {
    let j = b.parentElement;
    for (; j && j.scrollHeight <= j.clientHeight + 1; ) j = j.parentElement;
    j ? j.scrollTo({ top: 0, behavior: "smooth" }) : window.scrollTo({ top: 0, behavior: "smooth" });
  }, T = (b) => {
    var z;
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(b.key)) return;
    b.preventDefault();
    const j = de.findIndex(($) => $.id === l), P = b.key === "Home" ? de[0].id : b.key === "End" ? de.at(-1).id : de[(j + (b.key === "ArrowRight" ? 1 : -1) + de.length) % de.length].id;
    h(P), (z = document.getElementById(`${d}-tab-${P}`)) == null || z.focus();
  };
  return /* @__PURE__ */ e.jsxs("section", { id: d, className: "studio-theory", "aria-label": `${n.label} learning content`, children: [
    /* @__PURE__ */ e.jsxs("div", { className: "studio-theory-heading", children: [
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("span", { className: "studio-theory-kicker", children: "LEARN THE WHY" }),
        /* @__PURE__ */ e.jsxs("h2", { children: [
          n.label,
          ": learn and explore"
        ] })
      ] }),
      w ? /* @__PURE__ */ e.jsxs("span", { className: "studio-theory-mode", children: [
        "Current lab mode: ",
        w
      ] }) : null
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "studio-theory-tabs", role: "tablist", "aria-label": `${n.label} explanations`, children: de.map((b) => /* @__PURE__ */ e.jsx("button", { id: `${d}-tab-${b.id}`, type: "button", role: "tab", "aria-selected": l === b.id, "aria-controls": `${d}-panel-${b.id}`, tabIndex: l === b.id ? 0 : -1, onClick: () => h(b.id), onKeyDown: T, children: b.label }, b.id)) }),
    /* @__PURE__ */ e.jsxs("div", { id: `${d}-panel-simple`, className: "studio-theory-simple", role: "tabpanel", "aria-labelledby": `${d}-tab-simple`, hidden: l !== "simple", children: [
      /* @__PURE__ */ e.jsx("span", { className: "studio-theory-kicker", children: "THE SAME IDEA, PLAINLY" }),
      /* @__PURE__ */ e.jsx("p", { children: m })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { id: `${d}-panel-theory`, role: "tabpanel", "aria-labelledby": `${d}-tab-theory`, hidden: l !== "theory", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "studio-theory-principles", children: [
        /* @__PURE__ */ e.jsxs("article", { children: [
          /* @__PURE__ */ e.jsx("h3", { children: "Core idea" }),
          /* @__PURE__ */ e.jsx("p", { children: v.principle })
        ] }),
        /* @__PURE__ */ e.jsxs("article", { children: [
          /* @__PURE__ */ e.jsx("h3", { children: "How to work it" }),
          /* @__PURE__ */ e.jsx("p", { children: v.method })
        ] }),
        /* @__PURE__ */ e.jsxs("article", { className: "studio-theory-caution", children: [
          /* @__PURE__ */ e.jsx("h3", { children: "Watch for" }),
          /* @__PURE__ */ e.jsx("p", { children: v.caution })
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "studio-theory-example-heading", children: [
        /* @__PURE__ */ e.jsx("h3", { children: "Three worked examples" }),
        /* @__PURE__ */ e.jsx("p", { children: "Use the lab controls to test these relationships." })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "studio-theory-examples", children: v.examples.map((b, j) => /* @__PURE__ */ e.jsxs("article", { children: [
        /* @__PURE__ */ e.jsx("span", { className: "studio-theory-number", children: j + 1 }),
        /* @__PURE__ */ e.jsx("h4", { children: b.title }),
        /* @__PURE__ */ e.jsx("p", { children: b.setup }),
        /* @__PURE__ */ e.jsx("strong", { children: b.result })
      ] }, b.title)) }),
      n.learning && n.id !== "home" ? /* @__PURE__ */ e.jsxs("div", { className: "studio-theory-experiment", children: [
        /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx("h3", { children: "Test it in the live lab" }),
          /* @__PURE__ */ e.jsx("p", { children: n.learning.try }),
          /* @__PURE__ */ e.jsx("strong", { children: n.learning.why })
        ] }),
        /* @__PURE__ */ e.jsx("button", { type: "button", onClick: (b) => D(b.currentTarget), children: "Back to lab controls ↑" })
      ] }) : null
    ] }),
    /* @__PURE__ */ e.jsxs("div", { id: `${d}-panel-formulas`, role: "tabpanel", "aria-labelledby": `${d}-tab-formulas`, hidden: l !== "formulas", children: [
      /* @__PURE__ */ e.jsxs("p", { className: "studio-theory-tab-intro", children: [
        "Relationships used in ",
        n.label,
        ". Each card shows the setup that makes the relationship useful."
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "studio-theory-formula-grid", children: A.map((b, j) => /* @__PURE__ */ e.jsxs("article", { children: [
        /* @__PURE__ */ e.jsx("span", { className: "studio-theory-number", children: j + 1 }),
        /* @__PURE__ */ e.jsx("h3", { children: b.title }),
        /* @__PURE__ */ e.jsx("div", { className: "studio-theory-formula", "aria-label": `${b.title} relationship`, children: b.expression }),
        /* @__PURE__ */ e.jsxs("p", { children: [
          /* @__PURE__ */ e.jsx("strong", { children: "Given:" }),
          " ",
          b.context
        ] }),
        b.result !== b.expression && /* @__PURE__ */ e.jsxs("p", { children: [
          /* @__PURE__ */ e.jsx("strong", { children: "What it tells us:" }),
          " ",
          b.result
        ] })
      ] }, `${b.title}-${j}`)) })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { id: `${d}-panel-live`, role: "tabpanel", "aria-labelledby": `${d}-tab-live`, hidden: l !== "live", children: [
      /* @__PURE__ */ e.jsx("p", { className: "studio-theory-tab-intro", children: "Choose a situation, then change the matching quantities in the lab and compare its displayed result." }),
      /* @__PURE__ */ e.jsx("div", { className: "studio-theory-example-chooser", role: "group", "aria-label": `${n.label} example situations`, children: v.examples.map((b, j) => /* @__PURE__ */ e.jsxs("button", { type: "button", "aria-pressed": p === j, onClick: () => u(j), children: [
        j + 1,
        ". ",
        b.title
      ] }, b.title)) }),
      /* @__PURE__ */ e.jsxs("article", { className: "studio-theory-live-card", children: [
        /* @__PURE__ */ e.jsxs("span", { className: "studio-theory-kicker", children: [
          "EXAMPLE ",
          p + 1,
          " OF 3"
        ] }),
        /* @__PURE__ */ e.jsx("h3", { children: v.examples[p].title }),
        /* @__PURE__ */ e.jsxs("p", { children: [
          /* @__PURE__ */ e.jsx("strong", { children: "Set up:" }),
          " ",
          v.examples[p].setup
        ] }),
        /* @__PURE__ */ e.jsxs("p", { children: [
          /* @__PURE__ */ e.jsx("strong", { children: "Expected result:" }),
          " ",
          v.examples[p].result
        ] }),
        ((f = n.learning) == null ? void 0 : f.observe) && /* @__PURE__ */ e.jsxs("p", { children: [
          /* @__PURE__ */ e.jsx("strong", { children: "Observe in this lab:" }),
          " ",
          n.learning.observe
        ] }),
        ((I = n.learning) == null ? void 0 : I.try) && /* @__PURE__ */ e.jsxs("p", { children: [
          /* @__PURE__ */ e.jsx("strong", { children: "Change next:" }),
          " ",
          n.learning.try
        ] }),
        /* @__PURE__ */ e.jsx("button", { type: "button", onClick: (b) => D(b.currentTarget), children: "Open lab controls ↑" })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { id: `${d}-panel-practice`, role: "tabpanel", "aria-labelledby": `${d}-tab-practice`, hidden: l !== "practice", children: [
      /* @__PURE__ */ e.jsx("p", { className: "studio-theory-tab-intro", children: "Work each setup before opening its result. Use the lab to check your reasoning." }),
      /* @__PURE__ */ e.jsx("div", { className: "studio-theory-practice-list", children: v.examples.map((b, j) => /* @__PURE__ */ e.jsxs("details", { children: [
        /* @__PURE__ */ e.jsxs("summary", { children: [
          /* @__PURE__ */ e.jsx("span", { className: "studio-theory-number", children: j + 1 }),
          /* @__PURE__ */ e.jsxs("span", { children: [
            /* @__PURE__ */ e.jsx("strong", { children: b.title }),
            /* @__PURE__ */ e.jsx("small", { children: b.setup })
          ] })
        ] }),
        /* @__PURE__ */ e.jsx("p", { children: b.result })
      ] }, `${b.title}-${j}`)) }),
      ((E = n.learning) == null ? void 0 : E.challenge) && /* @__PURE__ */ e.jsxs("div", { className: "studio-theory-practice-challenge", children: [
        /* @__PURE__ */ e.jsx("h3", { children: "Extend the idea" }),
        /* @__PURE__ */ e.jsx("p", { children: n.learning.challenge })
      ] })
    ] })
  ] });
}
const s = (t, n, r, l, h) => ({
  observe: t,
  understand: n,
  why: r,
  try: l,
  challenge: h
});
function o(t, n, r, l, h, p, u, v, m) {
  return { id: t, label: n, route: t === "home" ? r : `${r}/${t}`, title: l, subtitle: h, description: p, modes: u, challenge: v, learning: m };
}
const Bt = {
  geometry: {
    id: "geometry",
    name: "Geometry Studio",
    mark: "G",
    homeTitle: "Geometry Studio",
    homeSubtitle: "Construct, measure, transform, and prove with interactive figures.",
    searchPlaceholder: "Search constructions, theorems, or shapes...",
    basePath: "/geometry",
    continueLabel: "Triangles & Congruence",
    continueRoute: "/geometry/triangles",
    pages: [
      o("home", "Studio Home", "/geometry", "Geometry Studio", "Explore shape, measure, and proof.", "Launch a geometry lab.", [], { prompt: "0", expected: 0, hint: "" }, s("Pick a lab and watch one figure respond when you drag a point.", "Read the live measures and name what stays constant.", "A construction, a measure, and a theorem are the same relationship.", "Start with Triangles Explorer, then open Circles.", "Prove one claim in Theorems & Proofs after you can measure it.")),
      o("construction", "Construction", "/geometry", "Construction Workspace", "Build figures with dependent objects.", "Point, line, circle, and polygon tools that stay linked as you drag.", ["Live Object Tree", "Measurements", "Dependencies", "Proof Explanation"], { prompt: "How many degrees in a straight angle?", expected: 180, hint: "A straight line is a half turn." }, s("Watch objects appear.", "Read the object tree.", "Dependencies keep the figure consistent.", "Add a circle through two points.", "Reconstruct a perpendicular bisector.")),
      o("triangles", "Triangles", "/geometry", "Triangles Lab", "Explore triangle geometry through dynamic constructions, measurements and proofs.", "Drag vertices to classify triangles and test congruence, similarity, centers, and inequalities.", ["Triangle Explorer", "Congruence", "Similarity", "Centers", "Inequalities"], { prompt: "Angle sum of a triangle (degrees)?", expected: 180, hint: "Interior angles of a Euclidean triangle." }, s("Drag vertices to explore how side lengths and angles change.", "Notice if parts remain constant under different movements.", "Why does SSS guarantee triangle congruence?", "Use transformations to move one triangle onto the other.", "Create two non-congruent triangles that look similar.")),
      o("circles", "Circles", "/geometry", "Circles Lab", "Explore circle geometry through constructions, measurements and dynamic relationships.", "Chord, tangent, and inscribed-angle theorems in motion.", ["Chords", "Tangents", "Angles", "Power of a Point", "Arcs & Sectors"], { prompt: "Angle in a semicircle (degrees)?", expected: 90, hint: "Thales' theorem." }, s("Move the inscribed point.", "Read the intercepted arc.", "Inscribed angle is half the center.", "Drag a tangent.", "Find an angle from an arc.")),
      o("polygons", "Polygons", "/geometry", "Polygons Lab", "Explore polygon structure, angles, tessellations, area and diagonals through interactive constructions.", "Regular n-gons with interior sum, tessellation, area, and diagonals.", ["Regular Polygon", "Interior Angles", "Tessellation", "Area", "Diagonals"], { prompt: "Interior angle of a regular hexagon?", expected: 120, hint: "((n-2)×180)/n." }, s("Change n and watch the regular n-gon rebuild.", "Interior sum is (n−2)×180°; exteriors always close 360°.", "Only triangles, squares, and hexagons tessellate regularly.", "Decompose area into triangles or use the shoelace formula.", "Count n(n−3)/2 diagonals of an octagon.")),
      o("transformations", "Transformations", "/geometry", "Transformations Lab", "Translate, rotate, reflect, dilate, and compose maps.", "See the image of a shape under each isometry and dilation.", ["Translate", "Rotate", "Reflect", "Dilate", "Compose"], { prompt: "Rotation of 180° around origin sends (1,0) to x=?", expected: -1, hint: "Halfway around the origin." }, s("Move the pre-image.", "Read the image coordinates.", "Isometries preserve distance.", "Compose reflect then rotate.", "Map a triangle onto another.")),
      o("coordinate", "Coordinate Geometry", "/geometry", "Coordinate Geometry Lab", "Explore analytic geometry with points, lines, equations, or loci.", "Distance, midpoint, slope, and loci on a live coordinate plane.", ["Distance", "Midpoint", "Slope", "Section Formula", "Locus"], { prompt: "Distance from (0,0) to (3,4)?", expected: 5, hint: "3-4-5 triangle." }, s("Drag points A, B & C or lines to see relationships update in real time.", "Explore slopes, equations, distances, and intersections.", "See how algebraic forms connect to geometric ideas.", "Create your own lines, loci, and solve challenges.", "Find the locus of points equidistant from A and B.")),
      o("measurement", "Measurement", "/geometry", "Measurement Lab", "Measure length, angle, area, perimeter, scale, and uncertainty.", "Live length, angle, area, and perimeter with units and scale.", ["Length", "Angle", "Area", "Perimeter", "Scale", "Error"], { prompt: "Area of a 6 by 4 rectangle?", expected: 24, hint: "length × width." }, s("The shape is composite and can be decomposed into 4 rectangles for easy measurement.", "Area is the sum of parts. Perimeter is the total around the outer boundary.", "Decomposition simplifies complex shapes. Additive properties ensure accurate total measurements.", "Drag orange points to modify the shape. Switch to other modes to measure angles and more.", "Create a shape with the same area but different perimeter. Can you minimize the perimeter?")),
      o("proofs", "Theorems & Proofs", "/geometry", "Theorem & Visual Proof", "See why classic theorems hold.", "Visual proofs for Pythagoras, angle sum, circles, and similarity.", ["Pythagoras", "Angle Sum", "Circle Theorems", "Similarity", "Area Proofs"], { prompt: "In a 3-4-5 triangle, hypotenuse is?", expected: 5, hint: "3²+4²=c²." }, s("Watch the rearrangement.", "Read each proof step.", "Area is conserved under dissection.", "Rearrange the squares.", "Write a two-column proof.")),
      { ...o("solids", "Shapes Explorer", "/geometry", "2D & 3D Shapes Explorer", "Measure 2D shapes and 3D solids with live formulas.", "Cylinders, cones, spheres, nets, and cross-sections in the Shapes Explorer.", ["Cylinders", "Cones", "Spheres", "Nets", "Cross-sections"], { prompt: "Volume of a cube of side 3?", expected: 27, hint: "s³." }, s("Rotate the solid.", "Read surface area and volume.", "Nets fold without overlap.", "Unfold a cylinder.", "Sketch a cross-section.")), route: "/shapes" },
      o("ar", "Geometry AR", "/geometry", "Geometry AR Lab", "Overlay constructions on the camera plane.", "Camera overlay for points, lines, polygons, and 3D solids.", ["Select", "Point", "Line", "Circle", "Polygon", "3D Solid", "Plane", "Measure"], { prompt: "A full turn in degrees?", expected: 360, hint: "One complete rotation." }, s("Place a point in AR.", "Measure a live length.", "Camera pose maps world to screen.", "Measure a room corner.", "Capture a triangle overlay."))
    ]
  },
  trigonometry: {
    id: "trigonometry",
    name: "Trigonometry Studio",
    mark: "θ",
    homeTitle: "Trigonometry Studio",
    homeSubtitle: "Explore angles, triangles, circles and waves.",
    searchPlaceholder: "Search angles, identities, or waves...",
    basePath: "/trigonometry",
    continueLabel: "Unit Circle",
    continueRoute: "/trigonometry/unit-circle",
    pages: [
      o("home", "Studio Home", "/trigonometry", "Trigonometry Studio", "Explore angles, triangles, circles and waves.", "", [], { prompt: "0", expected: 0, hint: "" }, s("Watch the circle.", "Read sine and cosine.", "Projection explains the graphs.", "Change the angle.", "Solve a triangle.")),
      o("unit-circle", "Unit Circle", "/trigonometry", "Unit Circle & Angle Studio", "Explore angles, unit circle relationships, and exact trig values.", "Drag the terminal ray.", ["Angles", "Unit Circle", "Quadrants", "Exact Values", "Reference Angles"], { prompt: "sin(90°) = ?", expected: 1, hint: "The point is (0,1)." }, s("See how the point moves on the unit circle as θ changes.", "Understand projections, signs, and exact values.", "Discover the meaning behind the relationships.", "Practice with angles and check your understanding.", "Solve problems and apply trig concepts.")),
      o("right-triangle", "Right Triangle", "/trigonometry", "Right Triangle Studio", "Solve, explore, and master right triangles.", "SOH-CAH-TOA in motion.", ["Solve Triangle", "Ratios", "Pythagoras", "Similarity", "Special Triangles"], { prompt: "In a 30-60-90 triangle, short leg if hypotenuse is 2?", expected: 1, hint: "Short leg is half the hypotenuse." }, s("Move points and see how sides and angles change in real time.", "Explore ratios, the Pythagorean theorem, and right triangle facts.", "Discover the relationships behind the calculations.", "Change inputs or drag vertices to create your own problems.", "Solve triangle puzzles and beat your best time.")),
      o("graphs", "Functions & Graphs", "/trigonometry", "Trigonometric Functions & Graphs Studio", "Explore how transformations shape sine, cosine, and tangent graphs.", "Amplitude, period, phase.", ["Sine", "Cosine", "Tangent", "Transformations", "Comparison"], { prompt: "Period of sin(2x) in π units? Enter 1 for π.", expected: 1, hint: "Period is 2π/|b|." }, s("Drag a point on the unit circle or the graph to see them synchronize.", "Amplitude controls height. B controls period. C shifts left/right. D moves up/down.", "Transformations come from stretching and shifting the parent function.", "Change B to 2 and C to −π/2. What happens to the graph?", "Can you make the graph pass through (0, 1.5) with a period of π?")),
      o("identities", "Identities", "/trigonometry", "Identities & Visual Proofs Studio", "Explore and prove trigonometric identities with interactive visuals.", "Prove with the circle.", ["Pythagorean", "Angle Sum", "Double Angle", "Half Angle", "Product-Sum"], { prompt: "sin²θ + cos²θ = ?", expected: 1, hint: "Unit circle radius." }, s("Move θ.", "See the identity hold.", "The radius is identically 1.", "Expand sin(2θ).", "Verify a double-angle value.")),
      o("inverse", "Inverse Trig", "/trigonometry", "Inverse Trigonometry Studio", "Explore inverse trig functions, their restrictions, and geometric interpretations.", "Arcsin, arccos, arctan.", ["Arcsin", "Arccos", "Arctan", "Principal Values", "Compositions"], { prompt: "arcsin(1) in degrees?", expected: 90, hint: "Sine of 90° is 1." }, s("Restrict the range.", "Read the principal value.", "Inverse undoes on the principal branch.", "Compose sin(arcsin x).", "Find arctan(1).")),
      o("oblique", "Sine & Cosine Laws", "/trigonometry", "Oblique Triangle Studio", "Explore and solve non-right triangles using the Sine Law and Cosine Law.", "Sine and cosine laws.", ["Sine Law", "Cosine Law", "Area", "SSA Ambiguous Case", "Solve Triangle"], { prompt: "Area of SAS triangle a=2, b=2, included 90°?", expected: 2, hint: "(1/2)ab sin C." }, s("Manipulate the triangle and watch how sides and angles respond together.", "See how the Sine Law and Cosine Law connect sides and angles.", "Explore why the laws hold true for any triangle.", "Change the known values and solve new triangles.", "Test yourself with real-world problems and puzzles.")),
      o("waves", "Waves & Harmonics", "/trigonometry", "Waves & Harmonics Studio", "Explore, combine, and analyze periodic motion and harmonic phenomena.", "Build a wave.", ["Simple Wave", "Superposition", "Harmonics", "Beats", "Phase"], { prompt: "Beat frequency for 10 Hz and 12 Hz?", expected: 2, hint: "|f1 − f2|." }, s("Watch how changing frequency or phase alters the pattern.", "Learn how superposition creates interference and beats.", "Explore the connection between waves and circular motion.", "Adjust parameters to matching a target waveform.", "Build a waveform using specific harmonic coefficients.")),
      o("applications", "Applications", "/trigonometry", "Trigonometry Applications Studio", "Solve real-world measurement problems using right triangles and trigonometric relationships.", "Real-world triangles.", ["Heights & Distances", "Bearings", "Navigation", "Surveying", "Periodic Models"], { prompt: "Height if tan(45°)=h/10 with adjacent 10?", expected: 10, hint: "tan 45° = 1." }, s("Change the angle of elevation.", "Read the height.", "Tangent is opposite over adjacent.", "Work a bearing problem.", "Model a tide.")),
      o("ar", "AR Lab", "/trigonometry", "Trigonometry AR Lab", "Measure height and project waves in AR.", "Camera overlays.", ["Height Measurement", "Distance", "Angle", "Triangle Overlay", "Unit Circle", "Wave Projection"], { prompt: "If angle of elevation is 45° and distance is 8, height is?", expected: 8, hint: "tan 45° = 1." }, s("Point the camera.", "Read live angle.", "The overlay is a similar triangle.", "Measure a building.", "Project a unit circle."))
    ]
  },
  "linear-algebra": {
    id: "linear-algebra",
    name: "Linear Algebra Studio",
    mark: "LA",
    homeTitle: "Linear Algebra Studio",
    homeSubtitle: "Explore vectors, matrices, transformations, and the geometry of linear systems.",
    searchPlaceholder: "Search topics, tools, or examples...",
    basePath: "/linear-algebra",
    continueLabel: "Eigenvectors",
    continueRoute: "/linear-algebra/eigenvectors",
    pages: [
      o("home", "Studio Home", "/linear-algebra", "Linear Algebra Studio", "See linear maps in 2D and 3D.", "", [], { prompt: "0", expected: 0, hint: "" }, s("See patterns and visual structures.", "Connect ideas with concepts.", "Uncover the reasoning behind the math.", "Experiment and test your understanding.", "Push your skills and solve advanced problems.")),
      o("vectors", "Vectors", "/linear-algebra", "Vectors Lab", "Explore vectors in 3D: components, operations, dot & cross products, projections.", "2D and 3D vector ops.", ["Dot", "Cross", "Projections", "Add", "Subtract", "Scale"], { prompt: "Dot product of (1,0) and (0,1)?", expected: 0, hint: "Orthogonal vectors." }, s("Drag vector endpoints to explore operations and see values update in real time.", "Study relationships between vectors, angles, and how projections work geometrically.", "Dot product measures alignment. Cross product gives a perpendicular vector and area.", "Change vectors, compute projections, or test a × (b + c) = a × b + a × c.", "Can you make a · b = 0? What maximizes |a × b|?")),
      o("matrices", "Matrices", "/linear-algebra", "Matrices & Operations Lab", "Explore matrix arithmetic, properties, and geometric transformations.", "Live matrix algebra.", ["Multiply", "Add", "Inverse", "Transpose", "Block"], { prompt: "det([[1,0],[0,1]])?", expected: 1, hint: "Identity." }, s("See how A transforms the unit square, then B applies another transformation.", "Track how rows of A combine with columns of B to form the result.", "Determinants multiply: det(A × B) = det(A) · det(B).", "Edit entries, switch operations, or try non-square matrices.", "Find matrices A, B where A × B = I (but A and B are not square).")),
      o("row-reduction", "Row Reduction", "/linear-algebra", "Systems & Row Reduction Lab", "Solve Ax = b by row reducing the augmented matrix and visualize the solution set.", "3D / 2D / pivot map.", ["3D View", "2D View", "Pivot Map"], { prompt: "Rank of identity 2×2?", expected: 2, hint: "Two pivots." }, s("Watch how row operations preserve the solution set.", "See pivots form a staircase and free variables emerge.", "Row operations are elementary matrices — they don't change Ax = b.", "Modify the matrix or add a free variable. What happens?", "Create a system with infinitely many solutions.")),
      o("linear-transforms", "Linear Transforms", "/linear-algebra", "Linear Transformations Lab", "Explore how linear transformations map vectors, shapes, and bases.", "Presets and 2D/3D.", ["Identity", "R90", "Scale X", "Shear", "2D", "3D"], { prompt: "Rotation by 90° sends (1,0) to y=?", expected: 1, hint: "(0,1)." }, s("Adjust A, the basis, or move the interpolation slider to see the transformation in action.", "Linear transformations preserve lines and the origin, but change lengths, angles, and areas.", "Matrix multiplication encodes how basis vectors move—everything else follows.", "Create your own matrix, compose transforms, and predict the result before seeing it.", "Find a matrix that reflects across the line y = x and then stretches by 2 in the y-direction.")),
      o("determinants", "Determinants", "/linear-algebra", "Determinants Lab", "Explore area, volume, orientation, and singularity through determinants.", "Signed scale of maps.", ["2D Area", "3D Volume", "Cofactor", "Orientation", "Singularity"], { prompt: "det of a 90° rotation?", expected: 1, hint: "Rotation preserves area and orientation." }, s("Drag v1 and v2 to create different parallelograms. Watch the area change.", "The determinant tells how A scales area and whether it flips orientation.", "det(A) is the signed area factor: det(AB) = det(A) det(B).", "Create a matrix with det(A) = −2. What happens to area & orientation?", "Find a matrix with det(A) = −1 that swaps the axes.")),
      o("vector-spaces", "Vector Spaces", "/linear-algebra", "Vector Spaces & Basis Lab", "Explore spans, independence, bases, subspaces, and coordinates in R³.", "Live spanning set.", ["Span", "Independence", "Basis", "Subspaces", "Coordinates"], { prompt: "Dimension of R²?", expected: 2, hint: "Two independent directions." }, s("Toggle vectors and see how the span changes. Notice the plane they form.", "Rank tells you the dimension of the span. A basis is a minimal independent set.", "Dependence means one vector is a combination of others.", "Add or remove vectors to find a basis for the plane or for all of R³.", "Can you find a basis that includes v3 instead of v1 or v2?")),
      o("eigenvectors", "Eigenvectors", "/linear-algebra", "Eigenvalues & Eigenvectors Lab", "Transform a field of arrows and unit circle/ellipse; eigenvectors remain on invariant directions.", "2D, 3D, phase portrait.", ["2D View", "3D View", "Phase Portrait"], { prompt: "Eigenvalue of I₂ (either)?", expected: 1, hint: "Identity scales by 1." }, s("Watch how the circle transforms and eigenvectors remain fixed.", "See how eigenvalues scale along eigen directions.", "Learn why eigenvectors don't change direction under A.", "Adjust the matrix and explore different behaviors.", "Find a matrix with complex eigenvalues.")),
      o("orthogonality", "Orthogonality", "/linear-algebra", "Orthogonality & Projections Lab", "Project vectors onto lines and planes, build orthonormal bases with Gram-Schmidt.", "3D and 2D views.", ["3D View", "Vector Decomp", "2D Projections"], { prompt: "Length of a unit vector?", expected: 1, hint: "Normalized." }, s("v projects onto line span(u) at a right angle. The residual is orthogonal to u.", "Orthogonal projections minimize distance. They decompose v into independent parts.", "Orthogonality simplifies computations: dot products decouple components.", "Change vectors, switch steps, or try random examples.", "Can you build an ON basis from these vectors in a different order?")),
      o("least-squares", "Least Squares", "/linear-algebra", "Least Squares Lab", "Fit a line to data using least squares. Minimize the sum of squared residuals.", "Fit a line to data.", ["Fit", "Residuals", "Column Space"], { prompt: "Slope of least squares for points (0,0) and (1,2)?", expected: 2, hint: "The line through the origin and (1,2)." }, s("Drag points to see how the best-fit line and residuals update.", "See how projections onto the column space minimize error.", "Least squares solves min_x ||Ax − b||². Normal equations give x = (AᵀA)⁻¹ Aᵀb.", "Change the data or add noise to test the robustness.", "Add outliers or try a quadratic model. Can you do better?")),
      o("playground", "Transform Playground", "/linear-algebra", "2D & 3D Transformation Playground", "Explore linear transformations. Edit the matrix, drag the object, and see geometry come alive.", "Presets and a stack.", ["2D Canvas", "3D Canvas", "Compose"], { prompt: "Identity composed n times still has det?", expected: 1, hint: "det I = 1." }, s("What happens to lengths, angles, areas, and volumes?", "How does the matrix create this transformation?", "Why does det(A) control area/volume scale?", "Experiment with different matrices and objects.", "Can you build a transformation with a specific effect?")),
      o("cayley-hamilton", "Cayley–Hamilton", "/linear-algebra", "Cayley–Hamilton Lab", "Every square matrix satisfies its characteristic polynomial.", "Powers and inverses from p(A) = 0.", ["Theorem", "Powers", "Inverse", "Three by three"], { prompt: "A singular matrix has det 0. Enter 0.", expected: 0, hint: "The inverse formula divides by det(A)." }, s("Read the characteristic polynomial.", "Replace λ by A.", "Check that p(A) is the zero matrix.", "Reduce a power.", "Stop if the determinant is zero.")),
      o("diagonalization", "Diagonalization", "/linear-algebra", "Diagonalization Lab", "Build A = P D P⁻¹ when enough eigenvectors exist.", "2×2 workflow and 3×3 presets.", ["Workflow", "Visual", "Three by three"], { prompt: "A defective matrix is not diagonalizable. Enter 0.", expected: 0, hint: "Geometric multiplicity is too small." }, s("Find the eigenvalues.", "Count independent eigenvectors.", "Build P and D.", "Multiply back.", "Reject a defective example.")),
      o("quadratic-forms", "Quadratic Forms", "/linear-algebra", "Quadratic Forms Lab", "Classify xᵀ A x from eigenvalues and leading minors.", "Definite, semidefinite, and indefinite forms.", ["Classify", "Contours"], { prompt: "A negative determinant means indefinite. Enter 1.", expected: 1, hint: "The eigenvalues have opposite signs." }, s("Edit the symmetric matrix.", "Read the eigenvalues.", "Apply Sylvester only when the minors decide.", "Leave the semidefinite case to the eigenvalues.", "Move the test vector.")),
      o("principal-axes", "Principal Axes", "/linear-algebra", "Principal Axes Lab", "Rotate a conic onto its eigenvector axes.", "Orthogonal diagonalization of a symmetric matrix.", ["Axes", "Canonical"], { prompt: "A real symmetric matrix has an orthonormal eigenbasis. Enter 1.", expected: 1, hint: "Distinct eigenvalues are orthogonal." }, s("Read ax² + 2hxy + by².", "Find orthonormal eigenvectors.", "Form the rotation.", "Read λ₁ u² + λ₂ v².", "Watch the axes turn.")),
      o("matrix-factorizations", "Matrix Factorizations", "/linear-algebra", "Matrix Factorizations Lab", "Build LU, QR, and SVD from the elimination steps.", "Pivoting, orthonormal columns, and singular values.", ["LU", "Pivoted LU", "QR", "SVD"], { prompt: "A zero pivot needs a row swap. Enter 1.", expected: 1, hint: "That is partial pivoting." }, s("Watch the multipliers.", "Read L and U.", "Orthonormalize the columns.", "Read the singular values.", "Reject a singular pivot.")),
      o("similarity", "Similarity", "/linear-algebra", "Similar Matrices Lab", "Change basis without changing the linear map.", "Trace, determinant, and the characteristic polynomial.", ["Invariants", "Bases"], { prompt: "Similar matrices share a trace. Enter 1.", expected: 1, hint: "Trace is a similarity invariant." }, s("Choose A and an invertible P.", "Compute B.", "Compare the invariants.", "Reject a singular P.", "Open diagonalization as a special case.")),
      o("jordan-form", "Jordan Form", "/linear-algebra", "Jordan Form Lab", "Replace a missing eigenvector with a chain.", "2×2 blocks and one 3×3 block.", ["Chain", "Block"], { prompt: "A Jordan block of size 2 has geometric multiplicity 1. Enter 1.", expected: 1, hint: "Only one independent eigenvector." }, s("Compare algebraic and geometric multiplicity.", "Build the chain.", "Write the block.", "Rebuild A.", "Do not force a diagonal form."))
    ]
  },
  "complex-numbers": {
    id: "complex-numbers",
    name: "Complex Numbers Studio",
    mark: "i",
    homeTitle: "Welcome to Complex Numbers Studio",
    homeSubtitle: "Explore, visualize, and master complex numbers through interactive experiments.",
    searchPlaceholder: "Search topics, e.g. z = a + bi, roots, Euler formula...",
    basePath: "/complex-numbers",
    continueLabel: "Argand Plane",
    continueRoute: "/complex-numbers/argand-plane",
    pages: [
      o("home", "Studio Home", "/complex-numbers", "Complex Numbers Studio", "Plot, rotate, and transform z.", "", [], { prompt: "0", expected: 0, hint: "" }, s("Watch z move.", "Read modulus and argument.", "Geometry is algebra.", "Rotate by i.", "Find cube roots of −1.")),
      o("argand-plane", "Argand Plane", "/complex-numbers", "Argand Plane Lab", "Plot z, conjugate, modulus, argument, locus.", "Drag the blue point.", ["Plot", "Modulus", "Argument", "Conjugate", "Distance", "Locus"], { prompt: "|3+4i| = ?", expected: 5, hint: "3-4-5." }, s("Drag z.", "Read r and θ.", "Modulus is distance from origin.", "Show the conjugate.", "Open locus |z|=2.")),
      o("arithmetic", "Arithmetic", "/complex-numbers", "Complex Arithmetic & Geometry Lab", "Operate on complex numbers as vectors in the Argand plane.", "Parallelogram addition.", ["Add", "Subtract", "Multiply", "Divide", "Conjugate"], { prompt: "Re((2+i)+(1+2i))?", expected: 3, hint: "Add real parts." }, s("Drag points P and Q. Watch the sum update in real time.", "Vector addition uses the parallelogram rule in ℂ.", "Complex arithmetic — geometry in the Argand plane.", "Switch operations and explore products, quotients, and more.", "Can you make z₁ × z₂ purely imaginary?")),
      o("polar-forms", "Polar Forms", "/complex-numbers", "Polar & Exponential Forms Lab", "Convert between rectangular, polar, and exponential forms on the Argand plane.", "Linked sliders.", ["Rectangular", "Polar", "Exponential"], { prompt: "Argument of i in degrees?", expected: 90, hint: "Positive imaginary axis." }, s("Watch how forms stay in sync as you move sliders.", "See the geometry of modulus and argument clearly.", "Euler connects rotation on the unit circle to exponentials.", "Pick a point, change branch, see what happens.", "Convert tricky numbers and explore multiple branches.")),
      o("rotation", "Rotation", "/complex-numbers", "Multiplication as Rotation Lab", "Visualize z × w as a rotation and scaling in the complex plane.", "Spiral of powers.", ["Rotate", "Scale", "Sequence"], { prompt: "arg(i) in degrees?", expected: 90, hint: "Multiplying by i is +90°." }, s("Multiplication rotates by arg(w) and scales by |w|.", "Complex multiplication is similarity transform in the plane.", "Because r e^{iθ} = r (cos θ + i sin θ) represents rotation and scaling.", "Change θ to −60° and see rotation in the opposite direction.", "Find w such that wz = −z for any nonzero z.")),
      o("roots", "Roots", "/complex-numbers", "Roots of Complex Numbers Lab", "Explore nth roots, roots of unity, and polynomial roots on the Argand plane.", "De Moivre in action.", ["Square Roots", "nth Roots", "Roots of Unity", "Polynomial Roots"], { prompt: "How many 6th roots does a nonzero z have?", expected: 6, hint: "n distinct nth roots." }, s("The n roots lie on a circle of radius r^{1/n}, equally spaced by 360°/n.", "Roots are symmetric: angles differ by 360°/n. The polygon connects roots in order of increasing k.", "De Moivre's theorem links powers and roots via polar form, turning multiplication into angle addition.", "Change n, drag the angle θ, or try random z. Explore patterns and special cases.", "Find z such that one of its cube roots is purely imaginary. What about fourth roots?")),
      o("euler", "Euler Formula", "/complex-numbers", "Euler's Formula Lab", "Explore e^{iθ} = cos θ + i sin θ, its series, and the beautiful identity e^{iπ} + 1 = 0.", "Four linked views.", ["Unit Circle", "Helix", "Projections", "Taylor"], { prompt: "e^{iπ} + 1 = ?", expected: 0, hint: "Euler's identity." }, s("Watch e^{iθ} move on the unit circle and trace the helix in 3D.", "e^{iθ} has constant magnitude 1 and encodes pure rotation by θ.", "Taylor series of e^x extends to x=iθ, linking exponentials and trig.", "Change θ, terms, and trace length. Predict where e^{iθ} goes next.", "Prove e^{iπ} + 1 = 0 and explore e^{i2π} = 1. Can you generalize?")),
      o("loci", "Loci & Transforms", "/complex-numbers", "Loci & Transformations Lab", "Explore loci and how transformations reshape the complex plane.", "Before and after planes.", ["Circle Loci", "Line Loci", "Möbius", "Inversion", "Affine Map"], { prompt: "Möbius maps send generalized circles to circles. How many fixed points can a non-identity Möbius have at most?", expected: 2, hint: "Quadratic equation." }, s("See how the locus and grid transform in real time.", "Explore invariants, fixed points, and domain behavior.", "Möbius maps preserve cross-ratios and map generalized circles.", "Change the transformation, drag points, and experiment.", "Can you map this circle to a line? Find parameters to try.")),
      o("fractals", "Fractals", "/complex-numbers", "Mandelbrot & Julia Sets Lab", "Explore complex dynamics and fractal beauty.", "Linked Mandelbrot and Julia.", ["Mandelbrot Set", "Julia Set"], { prompt: "For c=0, is 0 in the Mandelbrot set? Enter 1 for yes.", expected: 1, hint: "Orbit stays at 0." }, s("See how varying c changes the Julia set.", "Points inside the set stay bounded; outside escape.", "Iterating z² + c reveals deep structure and chaos.", "Drag c, change iterations and palette.", "Find a c where the Julia set is disconnected.")),
      o("waves-circuits", "Waves & Circuits", "/complex-numbers", "Applications to Waves & Circuits Lab", "Unify phasors, AC circuits, and complex numbers. Visualize steady-state behavior.", "RLC in the complex plane.", ["Phasors", "AC Circuits", "Signal Rotation", "Impedance"], { prompt: "Power factor if φ=0°?", expected: 1, hint: "cos 0° = 1." }, s("Explore phasors, waves, and circuit response in real time.", "See how complex impedance controls magnitude and phase.", "Impedance encodes opposition and phase shift in AC circuits.", "Adjust components, frequency, and observe the effects.", "Match a target power factor and minimize current."))
    ]
  },
  modelling: {
    id: "modelling",
    name: "Modelling Studio",
    mark: "M",
    homeTitle: "Mathematical Modelling Studio",
    homeSubtitle: "Explore • Simulate • Compare • Understand",
    searchPlaceholder: "Search datasets, scenarios or models...",
    basePath: "/mathematical-modelling",
    continueLabel: "Epidemic Spread",
    continueRoute: "/mathematical-modelling/epidemics",
    pages: [
      o("home", "Studio Home", "/mathematical-modelling", "Mathematical Modelling Studio", "Build, fit, and compare models.", "", [], { prompt: "0", expected: 0, hint: "" }, s("Explore real-world patterns and data.", "Build models that explain what's happening.", "Interpret results and uncover the reasoning.", "Experiment with assumptions and parameters.", "Test your thinking with real modelling tasks.")),
      o("motion", "Motion", "/mathematical-modelling", "Motion Modelling Lab", "Simulate motion, compare models, and assess prediction error.", "Compare models to data.", ["Projectile", "Vehicle", "Pursuit", "Drag"], { prompt: "Time of flight scale: if g doubles, hang time of a vertical toss falls by about what factor? Enter 0.71 for 1/√2.", expected: 0.71, hint: "t ~ 1/√g." }, s("Explore the motion and compare models to data.", "See how parameters and forces affect the motion.", "Learn the physics behind projectile motion.", "Adjust parameters and test your own scenarios.", "Can you minimize the error with the best model?")),
      o("population", "Population", "/mathematical-modelling", "Population Growth Lab", "Explore, compare, and simulate population models under different scenarios.", "Carrying capacity in view.", ["Exponential", "Logistic", "Harvesting", "Age Structured"], { prompt: "Logistic equilibrium is at K. If K=5000, equilibrium P=?", expected: 5e3, hint: "dP/dt=0 at K." }, s("What patterns do you see in the data and model curves?", "How do r and K affect long-term population size?", "Why does the logistic model level off while exponential does not?", "Test different scenarios and see how sensitive the outcomes are.", "Can you keep the population near K using harvesting?")),
      o("epidemics", "Epidemics", "/mathematical-modelling", "Epidemic Modelling Lab", "Explore, simulate, and compare epidemic models.", "Compartment flow.", ["SIR", "SEIR", "Vaccination", "Interventions"], { prompt: "If R0 < 1, outbreak dies out. Enter 1 if that statement is true.", expected: 1, hint: "Each case produces fewer than one new case." }, s("Explore the live dynamics and compare scenarios.", "Learn how parameters and interventions shape outcomes.", "Discover the mechanisms behind epidemic behavior.", "Test your own scenarios and see the impact.", "Can you keep Rₑ < 1 and stay within hospital capacity?")),
      o("finance", "Finance", "/mathematical-modelling", "Finance & Compound Interest Lab", "Model savings, loans, investments, inflation, and annuities.", "Nominal vs real value.", ["Savings", "Loans", "Investments", "Inflation", "Annuities"], { prompt: "If interest is 0%, $100 after 5 years is?", expected: 100, hint: "No growth." }, s("What patterns do you see in the growth curves?", "Why does compounding create exponential growth?", "How does inflation affect the real value?", "What if you increase contributions or the interest rate?", "Can you reach $2M in real value within 30 years?")),
      o("optimization", "Optimization", "/mathematical-modelling", "Optimization Modelling Lab", "Find the best decision under constraints. Compare models, evaluate trade-offs, and understand resources.", "Feasible region.", ["Production Planning", "Transport", "Design", "Allocation", "Scheduling"], { prompt: "If Max Z=50x+40y and (x,y)=(0,0), Z=?", expected: 0, hint: "Origin." }, s("Explore the feasible region, constraints and objective line.", "Identify binding constraints and shadow values.", "See how resources impact profit and solutions.", "Adjust resources, move objective line, and test scenarios.", "Can you increase profit with the same resources?")),
      o("networks", "Networks & Routing", "/mathematical-modelling", "Networks & Routing Lab", "Find optimal routes on networks using shortest path algorithms and traffic conditions.", "Live route search.", ["Dijkstra", "A*"], { prompt: "Shortest path in a graph of equal weights uses fewest hops. Enter 1 if true.", expected: 1, hint: "BFS/Dijkstra on unit weights." }, s("See how algorithms explore the network and find routes.", "Why some paths are better under current traffic and costs.", "How do heuristics reduce search time while preserving optimality?", "Change traffic, close roads, or switch algorithms and compare.", "Can you find a faster route with different assumptions?")),
      o("regression", "Regression", "/mathematical-modelling", "Regression & Prediction Lab", "Explore relationships, fit models, assess error, and make predictions.", "Train/validation split.", ["Scatter & Fit", "Residuals", "Diagnostics", "Prediction"], { prompt: "A perfect linear fit has R² = ?", expected: 1, hint: "All variance explained." }, s("Scatter shows a curved relationship with a peak around 28–30 °C.", "Polynomial model explains more variance with lower error.", "Linear misses the curvature; polynomial captures it.", "Adjust degree, handle outliers, or transform variables.", "Can you improve predictions and reduce extrapolation risk?")),
      o("periodic", "Periodic Models", "/mathematical-modelling", "Periodic Phenomena Lab", "Explore, model and predict repeating patterns in the real world.", "Harmonic comparison.", ["Tides", "Seasons", "Daylight", "Sound", "Cycles"], { prompt: "A sine with period 12 hours has frequency 1/12. Enter 12 for the period.", expected: 12, hint: "Period is on the slider." }, s("What patterns do you see? Zoom, inspect and measure.", "What drives these patterns? Explore parameters and theory.", "Why do the models differ? Link assumptions to fit quality.", "Test new models or change assumptions.", "Can you improve the model or predict further ahead?")),
      o("numerical", "Numerical Experiments", "/mathematical-modelling", "Numerical Experiments Lab", "Explore stochastic and deterministic computation through simulation and approximation.", "Estimate π.", ["Monte Carlo", "Iteration", "Random Walk", "Differential Approx.", "Sensitivity"], { prompt: "Monte Carlo π uses 4×(inside/total). If half the points are inside, estimate?", expected: 2, hint: "4×0.5." }, s("Watch random points fall and see the estimate emerge.", "Why does this work? Connect area, probability, and limits.", "What affects accuracy and convergence speed?", "Change N, seeds, and settings. Run batches and compare.", "Can you reach 6-digit accuracy for π? Optimize the experiment.")),
      o("comparison", "Model Comparison", "/mathematical-modelling", "Model Comparison & Error Lab", "Compare candidate models, evaluate error, and choose the best explanatory model.", "Pick the best model.", ["Compare", "Residuals", "Selection"], { prompt: "Lower RMSE is better. Enter 1 if true.", expected: 1, hint: "Error metric." }, s("Which model follows the data best? Check the fit and residuals.", "Why does one model outperform others? Explore assumptions.", "What causes underfit or overfit? Compare complexity and error.", "Adjust models, parameters, and see how performance changes.", "Can you build a better model with justified assumptions?"))
    ]
  },
  discrete: {
    id: "discrete",
    name: "Number & Discrete Studio",
    mark: "#",
    homeTitle: "Number & Discrete Mathematics Studio",
    homeSubtitle: "Explore the language of numbers, structures, and logic.",
    searchPlaceholder: "Search topics, tools, or problems...",
    basePath: "/discrete-world",
    continueLabel: "Modular Arithmetic",
    continueRoute: "/discrete-world/modular-arithmetic",
    pages: [
      o("home", "Studio Home", "/discrete-world", "Number & Discrete Mathematics Studio", "Numbers, logic, graphs, algorithms, crypto.", "", [], { prompt: "0", expected: 0, hint: "" }, s("Spot structure.", "Connect ideas.", "Prove a small claim.", "Run a tool.", "Solve the daily puzzle.")),
      o("number-sense", "Number Sense", "/discrete-world", "Number Sense & Number Lines Lab", "Compare and measure numbers on one line.", "Drag values on a line.", ["Integers", "Fractions", "Decimals", "Ratios", "Powers", "Scales"], { prompt: "Which is greater, −7 or −2? Enter the greater number.", expected: -2, hint: "Farther left is smaller." }, s("Watch unit ticks and hops.", "Order is position, not digit size.", "Distance is |a−b|.", "Drag a point or add a hop.", "Which is greater, −7 or −2?")),
      o("primes", "Primes & Factors", "/discrete-world", "Factors, Primes & Divisibility Lab", "Sieve, factor trees, GCD and LCM.", "Visual proofs of uniqueness.", ["Sieve of Eratosthenes", "Factor Tree", "GCD & LCM", "Divisibility Rules", "Prime Patterns"], { prompt: "gcd(84,60)?", expected: 12, hint: "Common primes with min powers." }, s("Run the sieve.", "See primes remain.", "Unique factorization.", "Change the range.", "Find a number with 18 divisors.")),
      o("modular-arithmetic", "Modular Arithmetic", "/discrete-world", "Modular Arithmetic Lab", "Clock arithmetic, inverses, linear congruences.", "Hops on a circle.", ["Clock Arithmetic", "Congruence", "Inverses", "Linear Congruences", "Cycles"], { prompt: "5×2 mod 12?", expected: 10, hint: "10 < 12." }, s("Animate hops.", "See the cycle length.", "Inverses exist when gcd(a,n)=1.", "Solve 5x≡10 (mod 12).", "Prove a congruence.")),
      o("number-patterns", "Number Patterns", "/discrete-world", "Number Patterns Lab", "Explore beautiful patterns in numbers — figurate numbers, recurrences, Pascal's triangle and fractals.", "Grow a pattern.", ["Figurate", "Recursive", "Pascal Triangle", "Fractals"], { prompt: "6th triangular number?", expected: 21, hint: "n(n+1)/2." }, s("See how each new row adds one more point.", "The nth triangular number is the total of the first n positive integers.", "Two copies of the triangle form an n × (n+1) rectangle.", "Change n and animate the construction.", "Find T20 without counting every dot.")),
      o("combinatorics", "Combinatorics", "/discrete-world", "Combinatorics Lab", "Arrangements, selections, inclusion-exclusion.", "Generating tree.", ["Arrangements", "Selections", "Pigeonhole", "Inclusion-Exclusion", "Generating Tree"], { prompt: "4 distinct items, all orders: 4! = ?", expected: 24, hint: "4×3×2×1." }, s("Toggle order.", "Watch the count.", "Order matters for permutations.", "Allow repeats.", "Count with no adjacent repeats.")),
      o("logic", "Logic", "/discrete-world", "Mathematical Logic Lab", "Gates, truth tables, satisfiability.", "Build a circuit.", ["Circuit", "Truth Table", "Equivalence", "CNF/DNF", "SAT"], { prompt: "True AND False is 0. Enter 0.", expected: 0, hint: "AND needs both true." }, s("Flip an input.", "See the table highlight.", "Gates compose formulas.", "Build XOR.", "Find a counterexample.")),
      o("sets", "Sets & Relations", "/discrete-world", "Sets & Relations Lab", "Venn, operations, relations, functions, equivalence.", "Drag elements.", ["Venn Diagram", "Operations", "Cartesian Products", "Relations", "Functions", "Equivalence"], { prompt: "|{1,2,3} ∪ {3,4}|?", expected: 4, hint: "1,2,3,4." }, s("Drag into a region.", "Read union and intersection.", "Functions pair each input once.", "Test symmetry.", "Make R an equivalence.")),
      o("graphs", "Graph Networks", "/discrete-world", "Graph Theory & Networks Lab", "Paths, coloring, spanning trees, flows.", "Run Dijkstra.", ["Paths", "Connectivity", "Coloring", "Spanning Trees", "Flows"], { prompt: "A tree with 5 vertices has how many edges?", expected: 4, hint: "n−1." }, s("Run the path.", "Read the cost.", "Dijkstra is optimal on nonnegative weights.", "Color the graph.", "Find a spanning tree.")),
      o("algorithms", "Algorithms", "/discrete-world", "Algorithms Lab", "Sorting, searching, Euclid, complexity.", "Step through Merge Sort.", ["Sorting", "Searching", "Euclid", "Graph Traversal", "Complexity"], { prompt: "Comparisons grow like n log n for merge sort. Enter 1 if true.", expected: 1, hint: "Divide and conquer." }, s("Step the sort.", "Read the pseudocode.", "Divide and conquer is O(n log n).", "Switch to bubble sort.", "Compare complexity curves.")),
      o("cryptography", "Cryptography", "/discrete-world", "Cryptography Playground", "Classic ciphers and RSA as number theory.", "Educational keys only.", ["Caesar", "Affine", "Vigenère", "RSA Concept", "Diffie-Hellman", "Hashing"], { prompt: "Caesar shift 0 leaves A as A. Enter 0.", expected: 0, hint: "Identity shift." }, s("Generate p and q.", "Watch modular exponentiation.", "RSA security is factoring n.", "Encrypt a letter.", "Decrypt with d."))
    ]
  },
  statistics: {
    id: "statistics",
    name: "Statistics Studio",
    mark: "σ",
    homeTitle: "Statistics & Probability Studio",
    homeSubtitle: "Explore data. Model uncertainty. Draw conclusions.",
    searchPlaceholder: "Search datasets...",
    basePath: "/probability-statistics",
    continueLabel: "Distributions",
    continueRoute: "/probability-statistics/interactive-distributions",
    pages: [
      o("home", "Studio Home", "/probability-statistics", "Statistics & Probability Studio", "From data to decisions.", "", [], { prompt: "0", expected: 0, hint: "" }, s("Explore a dataset.", "Summarize center and spread.", "See why CLT works.", "Run a test.", "Open a challenge.")),
      o("data-explorer", "Data Explorer", "/probability-statistics", "Data Explorer", "Import, filter, brush, and visualize.", "Histograms, scatter, box plots.", ["Overview", "Pairwise"], { prompt: "Median of 1,2,3?", expected: 2, hint: "Middle value." }, s("Brush a region.", "Read the selected summary.", "Association appears in the scatter.", "Filter a category.", "Name a pattern.")),
      o("descriptive", "Descriptive Stats", "/probability-statistics", "Descriptive Statistics Lab", "Center, spread, shape, outliers.", "Dot, box, histogram, Q-Q.", ["Center", "Spread", "Shape", "Outliers", "Grouped"], { prompt: "IQR if Q1=2 and Q3=6?", expected: 4, hint: "Q3−Q1." }, s("Drag an outlier.", "Watch the mean move.", "The median is resistant.", "Show ±2σ bands.", "Build a skewed set.")),
      o("interactive-distributions", "Distributions", "/probability-statistics", "Interactive Distributions Lab", "Normal, binomial, Poisson, t, chi-square.", "Shade probability.", ["Normal", "Binomial", "Poisson", "Exponential", "t", "Chi-square"], { prompt: "P(−1<Z<1) for standard normal is about 0.68. Enter 0.68.", expected: 0.68, hint: "68-95-99.7." }, s("Shade between a and b.", "Read the live probability.", "σ stretches the bell.", "Switch to binomial.", "Match a scenario.")),
      o("experiments", "Probability Experiments", "/probability-statistics", "Probability Experiments Lab", "Coins, dice, cards, Bayes.", "Empirical vs theoretical.", ["Coins", "Dice", "Cards", "Spinner", "Conditional", "Bayes"], { prompt: "P(sum=7) with two fair dice = 6/36. Enter 0.167.", expected: 0.167, hint: "Six outcomes out of 36." }, s("Run many trials.", "See the histogram fill.", "Relative frequency settles.", "Build an event.", "Estimate a rare event.")),
      o("counting", "Combinatorics", "/probability-statistics", "Combinatorics Lab", "Permutations, combinations, Pascal.", "Counting tree.", ["Permutations", "Combinations", "Arrangements", "Multisets", "Counting Tree", "Binomial Coefficients"], { prompt: "P(5,4) = 5!/(5-4)! = ?", expected: 120, hint: "5×4×3×2." }, s("Toggle order.", "Watch nPr vs nCr.", "Order matters for permutations.", "Read Pascal's row.", "Count with restrictions.")),
      o("clt", "Sampling & CLT", "/probability-statistics", "Sampling & Central Limit Theorem Lab", "Sampling distributions of the mean.", "Repeated samples.", ["Population", "Sampling", "CLT"], { prompt: "SE = σ/√n. If σ=10 and n=25, SE=?", expected: 2, hint: "10/5." }, s("Draw samples.", "Watch the mean-dot strip.", "Averages become normal.", "Increase n.", "Get an almost-normal sampling distribution.")),
      o("confidence-intervals", "Confidence Intervals", "/probability-statistics", "Confidence Intervals Lab", "Capture rate of repeated intervals.", "Mean, proportion, bootstrap.", ["Mean", "Proportion", "Two-sample", "Bootstrap"], { prompt: "A 95% CI aims to capture μ in 95 of 100 samples. Enter 95.", expected: 95, hint: "Confidence level." }, s("Run simulations.", "Count blue vs red intervals.", "Width grows with confidence.", "Change n.", "Get margin of error under 2.")),
      o("hypothesis", "Hypothesis Testing", "/probability-statistics", "Hypothesis Testing Lab", "p-values, power, Type I/II.", "One and two samples.", ["One Sample Mean", "Two Sample Mean", "Proportion", "Chi-Square", "Permutation Test"], { prompt: "If p=0.02 and α=0.05, reject H0? Enter 1 for yes.", expected: 1, hint: "p < α." }, s("Shift the null.", "See p-value change.", "Small p is evidence against H0.", "Change n.", "Inspect Type I / II.")),
      o("correlation", "Regression", "/probability-statistics", "Correlation & Regression Lab", "Fit, residuals, influential points.", "Drag points on the plot.", ["Linear Fit", "Residuals", "Prediction"], { prompt: "If all points are on a line with positive slope, r is 1. Enter 1.", expected: 1, hint: "Perfect correlation." }, s("Drag a point.", "Watch r and R².", "Residuals diagnose the fit.", "Show the confidence band.", "Predict at a new x.")),
      o("anova", "ANOVA & Design", "/probability-statistics", "ANOVA & Experimental Design Lab", "Group means, variation, CRD.", "Between vs within.", ["Group Comparison", "Variation Decomposition", "Design Canvas", "Diagnostics"], { prompt: "If observed group means are exactly equal and within-group variance is positive, F = ?", expected: 0, hint: "SSB is zero, so MSB/MSW is zero." }, s("Randomize treatments.", "Watch between vs within.", "F compares those mean squares.", "Add a group.", "Run post-hoc."))
    ]
  },
  "differential-equations": {
    id: "differential-equations",
    name: "Differential Equations Studio",
    mark: "y'",
    homeTitle: "Differential Equations Studio",
    homeSubtitle: "Model change, solve equations, visualize solution families, and connect mathematics to engineering systems.",
    searchPlaceholder: "Search slope fields, exact equations, integrating factors...",
    basePath: "/differential-equations",
    continueLabel: "Method selector",
    continueRoute: "/differential-equations/method-selector",
    pages: [
      o("home", "Studio Home", "/differential-equations", "Differential Equations Studio", "Model change and visualize solution families.", "", [], { prompt: "0", expected: 0, hint: "" }, s("Read a slope as a local rule.", "Classify the equation before solving.", "A method matches a structure.", "Step through a substitution.", "Check a solution against a slope field.")),
      o("laplace", "Laplace Transforms", "/differential-equations", "Laplace Transforms & Step Responses", "Transform derivatives, retain initial data and model delayed forcing.", "Time and transform domains.", ["Time domain", "Transform domain"], { prompt: "L(y′) includes −y(0). Enter 1 if true.", expected: 1, hint: "Integration by parts retains the initial value." }, s("Move the input onset.", "Compare the exact response with Y(s).", "A time delay contributes e^(−τs).", "Change the forcing and decay.", "Predict the steady state.")),
      o("pde", "Heat & Wave Equations", "/differential-equations", "Heat & Wave Equation Modes", "Compare decay and oscillation under fixed endpoint conditions.", "Separated spatial eigenmodes.", ["Heat equation", "Wave equation"], { prompt: "A heat mode with positive diffusivity decays. Enter 1 if true.", expected: 1, hint: "The time factor is e^(−κλt)." }, s("Move time.", "Inspect endpoint values.", "Spatial eigenvalues determine time scales.", "Change the mode number.", "Verify the PDE by differentiation.")),
      o("boundary-values", "Boundary Values", "/differential-equations", "Boundary-Value Eigenfunctions", "Learn how endpoint conditions select nonzero modes.", "Dirichlet eigenfunctions.", ["Eigenvalues", "Eigenfunctions"], { prompt: "For L=π, the first eigenvalue is 1. Enter 1.", expected: 1, hint: "λ₁=(π/L)²." }, s("Select a mode.", "Check both boundary conditions.", "Only discrete eigenvalues admit nonzero modes.", "Change the domain length.", "Predict how λ scales with L.")),
      o("explorer", "Equation Explorer", "/differential-equations", "Differential Equation Explorer", "See what an equation claims before choosing a method.", "Order, linearity, and solution family.", ["Order", "Linear", "Family"], { prompt: "Order of y'' + 3y' + 2y = 0?", expected: 2, hint: "The highest derivative is the second." }, s("Pick an equation.", "Read order and linearity.", "A solution is a curve, not a slope.", "Compare a family with one initial condition.", "Name what is still unknown.")),
      o("slope-fields", "Direction Fields", "/differential-equations", "Direction Fields & Solution Curves", "Local slopes assemble into solution families.", "Click an initial condition on the field.", ["Slope field", "Curves"], { prompt: "For y'=y, the equilibrium is y=?", expected: 0, hint: "The slope is zero when y is zero." }, s("Watch the ticks.", "A curve must follow them.", "Nearby ticks reveal the family.", "Click a new initial point.", "Find where the slope vanishes.")),
      o("initial-value", "Initial Value Problems", "/differential-equations", "Initial Value Problems", "One admissible point selects one solution.", "Trace the curve through (x0, y0).", ["IVP"], { prompt: "How many initial values does y'=x-y need?", expected: 1, hint: "First order." }, s("Move the initial point.", "One curve is selected.", "The field still shows the family.", "Change y0.", "Keep the curve on the ticks.")),
      o("separable", "Separable Equations", "/differential-equations", "Separable Equations", "Split dy/dx = f(x)g(y) into two integrals.", "Separate, integrate, and compare with the field.", ["Separate"], { prompt: "For dy/dx = xy, separation uses dy/y = ? Enter 1 if it equals x dx.", expected: 1, hint: "Divide by y and multiply by dx." }, s("See the product slope.", "Separate the variables.", "Integration introduces C.", "Watch the family.", "Mark the singular solution y=0.")),
      o("homogeneous-first-order", "Homogeneous First-Order", "/differential-equations", "Homogeneous First-Order Equations", "Reduce a scale-invariant slope with y = vx.", "Substitution, separation, and back-substitution.", ["v = y/x"], { prompt: "The substitution uses v = y/x. Enter 1 if that is correct.", expected: 1, hint: "v measures the ray." }, s("Check equal degree.", "Introduce v.", "Differentiate y = vx.", "Separate the new equation.", "Return to x and y.")),
      o("exact", "Exact Equations", "/differential-equations", "Exact Differential Equations", "Test ∂M/∂y against ∂N/∂x and draw level curves.", "Potential functions and contours.", ["Exactness", "Potential"], { prompt: "If ∂M/∂y = ∂N/∂x, enter 1.", expected: 1, hint: "That is the exactness test." }, s("Read M and N.", "Compare the partials.", "Integrate M in x.", "Solve for g(y).", "Contours of F are solutions.")),
      o("linear-first-order", "Linear First-Order", "/differential-equations", "Linear Equations & Integrating Factor", "Turn the left side into a product derivative.", "P(x), Q(x), and the integrating factor.", ["Integrating factor"], { prompt: "For y'+y=x, the integrating factor is e^x. Enter 1.", expected: 1, hint: "∫P dx = x." }, s("Write standard form.", "Name P and Q.", "Build the integrating factor.", "Recognize a product derivative.", "Solve for y.")),
      o("bernoulli", "Bernoulli Equations", "/differential-equations", "Bernoulli Equations", "Change v = y^(1-n) into a linear equation.", "See n = 0 and n = 1 collapse.", ["Substitution"], { prompt: "For n=2, v = y to the power 1-n. Enter -1.", expected: -1, hint: "1-2 = -1." }, s("Read n.", "Skip the substitution when n is 0 or 1.", "Set v = y^(1-n).", "Solve the linear equation.", "Substitute back.")),
      o("method-selector", "Method Selector", "/differential-equations", "First-Order Method Selector", "Test structure, then open the matching lab.", "Separable, homogeneous, exact, linear, Bernoulli.", ["Diagnose"], { prompt: "dy/dx + y = y^2 is Bernoulli. Enter 1.", expected: 1, hint: "The power on y is not 0 or 1." }, s("Look before guessing.", "Commit to one method.", "Read the structural test.", "Open the lab.", "Try another preset.")),
      o("euler", "Euler Method", "/differential-equations", "Euler Method", "Follow the tangent for one step of size h.", "Compare the polygon with the exact curve.", ["Euler"], { prompt: "Smaller h usually cuts Euler error. Enter 1.", expected: 1, hint: "The local error is order h²." }, s("Take one tangent step.", "Shrink h.", "Watch the polygon approach the curve.", "Read the error.", "Compare with RK4.")),
      o("heun", "Improved Euler", "/differential-equations", "Improved Euler / Heun", "Average the starting slope with the predicted slope.", "Compare Euler, Heun, and RK4.", ["Heun"], { prompt: "Heun uses a predictor and a corrector. Enter 2.", expected: 2, hint: "Two slope evaluations." }, s("Predict with Euler.", "Sample the slope at the prediction.", "Average the two slopes.", "Compare errors.", "Shrink h.")),
      o("rk4", "Runge–Kutta RK4", "/differential-equations", "Runge–Kutta RK4", "Four slope samples per step.", "Stay close to the exact curve at larger h.", ["RK4"], { prompt: "How many slope samples does one RK4 step use?", expected: 4, hint: "k1 through k4." }, s("Read the four slopes.", "Compare with Euler at the same h.", "Shrink h.", "Watch the error drop.", "Keep the curve on the field.")),
      o("growth-models", "Growth & Decay", "/differential-equations", "Growth and Decay", "Exponential and logistic models from a slope rule.", "Carrying capacity flattens growth.", ["Growth"], { prompt: "Logistic growth levels off at the carrying capacity. Enter 1.", expected: 1, hint: "The factor (1-y/K) vanishes at y=K." }, s("Start near zero.", "Watch early exponential growth.", "Raise the carrying capacity.", "See the curve flatten.", "Compare with pure exponential growth.")),
      o("higher-order-linear", "Higher-Order Linear", "/differential-equations", "Higher-Order Linear ODEs", "Watch characteristic roots change the solution family.", "Distinct, repeated, and complex roots.", ["Roots", "Initial conditions"], { prompt: "A repeated root needs an extra factor of x. Enter 1.", expected: 1, hint: "The second solution is x e^{rx}." }, s("Move a, b, and c.", "Read the discriminant.", "Place the roots in the plane.", "Match the solution form.", "Set an initial condition.")),
      o("undetermined-coefficients", "Undetermined Coefficients", "/differential-equations", "Method of Undetermined Coefficients", "Match a trial to the forcing, then fix resonance.", "Polynomial, exponential, and trigonometric forcing.", ["Trial", "Resonance"], { prompt: "If the forcing is already a homogeneous solution, multiply the trial by x. Enter 1.", expected: 1, hint: "That is resonance." }, s("Solve the complementary function.", "Inspect the forcing.", "Reject a resonant trial.", "Equate coefficients.", "Write the general solution.")),
      o("variation-of-parameters", "Variation of Parameters", "/differential-equations", "Variation of Parameters", "Build a particular solution from the Wronskian.", "Two independent solutions and two integrals.", ["Wronskian"], { prompt: "A zero Wronskian means the two solutions are dependent. Enter 0.", expected: 0, hint: "Independence needs W ≠ 0." }, s("Name y1 and y2.", "Compute W.", "Form u1' and u2'.", "Integrate.", "Add the complementary function.")),
      o("cauchy-euler", "Cauchy–Euler", "/differential-equations", "Cauchy–Euler Equations", "Turn x^m into an algebraic equation for m.", "Real, repeated, and complex indicial roots.", ["Indicial"], { prompt: "The log substitution uses t = ln x and needs x > 0. Enter 1.", expected: 1, hint: "Stay on the positive axis." }, s("Substitute y = x^m.", "Read the indicial equation.", "Choose the solution form.", "Stay on x > 0.", "Compare with constant coefficients.")),
      o("systems", "Linear Systems", "/differential-equations", "Systems of First-Order ODEs", "Classify the origin from the eigenvalues of A.", "Nodes, saddles, spirals, and centers.", ["Eigenvalues", "Portrait"], { prompt: "Opposite-sign eigenvalues make a saddle. Enter 1.", expected: 1, hint: "One direction approaches and one leaves." }, s("Read the matrix.", "Compute trace and determinant.", "Name the equilibrium.", "Follow a trajectory.", "Compare with eigenvectors.")),
      o("phase-plane", "Phase Plane", "/differential-equations", "Phase Plane Explorer", "Click an initial condition and follow the vector field.", "Trajectories, arrows, and equilibrium type.", ["Click", "Field"], { prompt: "A center keeps trajectories on closed curves. Enter 1.", expected: 1, hint: "Pure rotation does not spiral in." }, s("Choose a preset.", "Click a point.", "Watch the direction of time.", "Toggle the field.", "Compare with the eigenvalue label.")),
      o("mechanical-oscillations", "Mechanical Oscillations", "/differential-equations", "Mechanical Oscillations", "See mass, damping, and stiffness move a spring.", "Underdamped, critical, and overdamped motion.", ["Damping ratio"], { prompt: "Critical damping has zeta equal to 1. Enter 1.", expected: 1, hint: "ζ = c / (2 sqrt(mk))." }, s("Set the mass.", "Raise damping through zeta = 1.", "Read the natural frequency.", "Add a force.", "Compare x(t) with the picture.")),
      o("lcr-circuit", "LCR Circuit", "/differential-equations", "LCR Circuits", "Map a series circuit onto the same second-order equation.", "Charge, current, and damping.", ["RLC"], { prompt: "Inductance plays the role of mass. Enter 1.", expected: 1, hint: "L q'' matches m x''." }, s("Read the schematic.", "Change R.", "Watch zeta.", "Compare charge and current.", "Open the mechanical twin.")),
      o("newton-cooling", "Newton Cooling", "/differential-equations", "Newton Cooling", "Watch a temperature gap decay toward the room.", "Cooling, warming, and half-gap time.", ["Exponential"], { prompt: "The half-gap time is ln 2 over k. Enter 1 if that is the formula.", expected: 1, hint: "Solve e^{-kt} = 1/2." }, s("Set the initial temperature.", "Move the room temperature.", "Change k.", "Read the half-gap time.", "Start below the room and watch warming."))
    ]
  }
};
Object.values(Bt).flatMap(
  (t) => t.pages.map((n) => ({ studio: t.id, path: n.route.replace(/^\//, ""), pageId: n.id }))
);
const ee = ["arcsin", "arccos", "arctan"], $a = { arcsin: "Arcsin", arccos: "Arccos", arctan: "Arctan" }, G = { arcsin: "#e92265", arccos: "#087cff", arctan: "#008c69" }, ae = { arcsin: "[−π/2, π/2]", arccos: "[0, π]", arctan: "(−π/2, π/2)" }, Ot = { arcsin: [-Math.PI / 2, Math.PI / 2], arccos: [0, Math.PI], arctan: [-Math.PI / 2, Math.PI / 2] }, W = { arcsin: "sin", arccos: "cos", arctan: "tan" }, K = (t, n, r) => Math.max(n, Math.min(r, t)), H = (t) => t * 180 / Math.PI, Ge = (t) => t * Math.PI / 180, C = (t, n = 4) => Number.isFinite(t) ? (Math.abs(t) < 1e-12 ? 0 : t).toFixed(n) : "undefined";
function ue(t, n) {
  if (!Number.isFinite(n) || t !== "arctan" && Math.abs(n) > 1) return null;
  const r = t === "arcsin" ? Math.asin(n) : t === "arccos" ? Math.acos(n) : Math.atan(n);
  return t === "arctan" ? K(r, -Math.PI / 2 + Number.EPSILON, Math.PI / 2 - Number.EPSILON) : r;
}
function Fe(t, n) {
  return !Number.isFinite(n) || t === "arctan" && Math.abs(Math.cos(n)) < 1e-12 ? null : t === "arcsin" ? Math.sin(n) : t === "arccos" ? Math.cos(n) : Math.tan(n);
}
function $t(t, n, r) {
  const l = n ? Fe(t, r) : ue(t, r), h = l === null ? null : n ? ue(t, Wa(t, l)) : r;
  return { intermediate: l, output: h, identity: h !== null && Math.abs(h - r) < 1e-9 };
}
function Wa(t, n) {
  return t === "arctan" ? n : K(n, -1, 1);
}
function Z(t) {
  if (Math.abs(t) < 1e-9) return "0";
  for (const n of [1, 2, 3, 4, 6, 12]) {
    const r = Math.round(t / Math.PI * n);
    if (Math.abs(t - r * Math.PI / n) < 1e-8) return `${r < 0 ? "−" : ""}${Math.abs(r) === 1 ? "" : Math.abs(r)}π${n === 1 ? "" : `/${n}`}`;
  }
  return `${C(t)} rad`;
}
function _a(t) {
  const n = t == null ? void 0 : t.toLowerCase().replace(/[\s_-]+/g, ""), r = { arcsin: "arcsin", arccos: "arccos", arctan: "arctan", principalvalues: "principal-values", compositions: "compositions" };
  return n && r[n] ? `/trigonometry/inverse/${r[n]}` : null;
}
const Ha = 540, Va = 310, re = 55, se = 510, Ee = 27, we = 270;
function Wt(t) {
  const n = t.currentTarget.getScreenCTM();
  if (!n) return null;
  const r = new DOMPoint(t.clientX, t.clientY).matrixTransform(n.inverse());
  return { x: r.x, y: r.y };
}
function Xe({ kind: t, value: n, onChange: r, asymptotes: l = !0, preview: h = !1, reverse: p, composed: u = !1 }) {
  const v = Dt().replace(/:/g, ""), m = u && p ? Math.max(Math.PI * 2, Math.abs(n) * 1.1) : t === "arctan" ? Math.max(5, Math.abs(n) * 1.15) : 1.15, w = -m, d = m, A = u && !p ? -m : t === "arccos" ? -0.15 : -Math.PI / 2 - 0.2, D = u && !p ? m : t === "arccos" ? Math.PI + 0.2 : Math.PI / 2 + 0.2, T = (y) => re + (y - w) / (d - w) * (se - re), q = (y) => we - (y - A) / (D - A) * (we - Ee), O = (y) => u ? $t(t, !!p, y).output : ue(t, y), f = u && p || t === "arctan" ? w : -1, I = u && p || t === "arctan" ? d : 1;
  let E = "", b = null;
  for (let y = 0; y <= 360; y++) {
    const ie = f + (I - f) * y / 360, oe = O(ie);
    if (oe === null || !Number.isFinite(oe)) {
      b = null;
      continue;
    }
    E += `${b === null || Math.abs(oe - b) > 1 ? "M" : "L"}${T(ie).toFixed(2)},${q(oe).toFixed(2)} `, b = oe;
  }
  const j = O(n), P = (y) => {
    const ie = Wt(y);
    !ie || !r || r(K(w + (ie.x - re) / (se - re) * (d - w), f, I));
  }, z = u && p || t === "arctan" ? [-m, -m / 2, 0, m / 2, m] : [-1, -0.5, 0, 0.5, 1], $ = u && !p ? [-m, 0, m] : t === "arccos" ? [0, Math.PI / 2, Math.PI] : [-Math.PI / 2, 0, Math.PI / 2];
  return /* @__PURE__ */ e.jsxs(
    "svg",
    {
      viewBox: `0 0 ${Ha} ${Va}`,
      className: `ivt-graph ${h ? "ivt-preview" : ""}`,
      role: "img",
      "aria-label": `${t} ${u ? p ? "reverse composition" : "direct composition" : "function"} graph. ${j === null ? "Undefined at current input." : `Input ${C(n)}, output ${C(j)}.`}`,
      onPointerDown: r ? (y) => {
        y.currentTarget.setPointerCapture(y.pointerId), P(y);
      } : void 0,
      onPointerMove: r ? (y) => {
        y.currentTarget.hasPointerCapture(y.pointerId) && P(y);
      } : void 0,
      onPointerUp: r ? (y) => {
        y.currentTarget.hasPointerCapture(y.pointerId) && y.currentTarget.releasePointerCapture(y.pointerId);
      } : void 0,
      children: [
        /* @__PURE__ */ e.jsx("defs", { children: /* @__PURE__ */ e.jsx("marker", { id: v, viewBox: "0 0 10 10", refX: "8", refY: "5", markerWidth: "6", markerHeight: "6", orient: "auto", children: /* @__PURE__ */ e.jsx("path", { d: "M0 0 10 5 0 10Z", fill: "#172955" }) }) }),
        z.map((y) => /* @__PURE__ */ e.jsx("line", { x1: T(y), x2: T(y), y1: Ee, y2: we, className: "ivt-gridline" }, y)),
        $.map((y) => /* @__PURE__ */ e.jsx("line", { x1: re, x2: se, y1: q(y), y2: q(y), className: "ivt-gridline" }, y)),
        /* @__PURE__ */ e.jsx("path", { d: `M${re - 8} ${q(0)}H${se + 8}M${T(0)} ${we + 12}V${Ee - 10}`, className: "ivt-axis", markerEnd: `url(#${v})` }),
        /* @__PURE__ */ e.jsx("path", { d: `M${re} ${q(0)}H${se + 8}`, className: "ivt-axis", markerEnd: `url(#${v})` }),
        z.map((y) => /* @__PURE__ */ e.jsxs("g", { children: [
          /* @__PURE__ */ e.jsx("path", { d: `M${T(y)} ${q(0) - 4}v8`, className: "ivt-axis" }),
          /* @__PURE__ */ e.jsx("text", { x: T(y), y: q(0) + 23, textAnchor: "middle", children: u && p ? Z(y) : Number(y.toFixed(1)) })
        ] }, y)),
        $.filter((y) => y !== 0).map((y) => /* @__PURE__ */ e.jsx("text", { x: T(0) - 12, y: q(y) + 5, textAnchor: "end", children: u && !p ? Number(y.toFixed(1)) : Z(y) }, y)),
        /* @__PURE__ */ e.jsx("text", { x: se + 14, y: q(0) + 5, children: "x" }),
        /* @__PURE__ */ e.jsx("text", { x: T(0) + 12, y: Ee - 10, children: u && !p ? "y" : "y (radians)" }),
        t === "arctan" && !u && l && [-Math.PI / 2, Math.PI / 2].map((y) => /* @__PURE__ */ e.jsxs("g", { children: [
          /* @__PURE__ */ e.jsx("line", { x1: re, x2: se, y1: q(y), y2: q(y), stroke: G[t], strokeDasharray: "7 5", opacity: ".5" }),
          /* @__PURE__ */ e.jsxs("text", { x: se, y: q(y) - 6, textAnchor: "end", fill: G[t], children: [
            "y = ",
            Z(y)
          ] })
        ] }, y)),
        /* @__PURE__ */ e.jsx("path", { d: E, fill: "none", stroke: G[t], strokeWidth: "3.2", strokeLinecap: "round" }),
        t !== "arctan" && !(u && p) && [-1, 1].map((y) => /* @__PURE__ */ e.jsx("circle", { cx: T(y), cy: q(O(y)), r: "4.5", fill: G[t] }, y)),
        j !== null && Math.abs(n) <= m && /* @__PURE__ */ e.jsxs("g", { className: "ivt-active-point", children: [
          /* @__PURE__ */ e.jsx("path", { d: `M${T(n)} ${q(0)}V${q(j)}H${T(0)}`, fill: "none", stroke: "#167bff", strokeDasharray: "5 5", strokeWidth: "1.5" }),
          /* @__PURE__ */ e.jsx("circle", { cx: T(n), cy: q(j), r: "10", fill: "#fff", stroke: "#9bc9ff", strokeWidth: "2" }),
          /* @__PURE__ */ e.jsx("circle", { cx: T(n), cy: q(j), r: "6", fill: G[t] }),
          !h && /* @__PURE__ */ e.jsxs("text", { x: K(T(n), 125, 420), y: K(q(j) - 17, 18, we - 10), textAnchor: "middle", className: "ivt-point-label", children: [
            "(",
            C(n, 2),
            ", ",
            C(j, 3),
            ")"
          ] })
        ] })
      ]
    }
  );
}
function je({ kind: t, theta: n, onChange: r, comparisonAngle: l, preview: h = !1 }) {
  const [m, w] = Ot[t], d = (P, z = 98) => [155 + z * Math.cos(P), 148 - z * Math.sin(P)], [A, D] = d(m), [T, q] = d(w), [O, f] = d(n), [I, E] = d(n, 29), b = `M155 148L${A} ${D}A98 98 0 0 0 ${T} ${q}Z`, j = (P) => {
    const z = Wt(P);
    if (!z || !r) return;
    let $ = Math.atan2(148 - z.y, z.x - 155);
    t === "arccos" && $ < 0 ? $ = z.x < 155 ? Math.PI : 0 : t !== "arccos" && Math.abs($) > Math.PI / 2 && ($ = Math.sign($) * Math.PI / 2), $ = K($, m + (t === "arctan" ? 1e-3 : 0), w - (t === "arctan" ? 1e-3 : 0)), r($);
  };
  return /* @__PURE__ */ e.jsxs(
    "svg",
    {
      viewBox: "0 0 310 282",
      className: `ivt-circle ${h ? "ivt-preview" : ""}`,
      role: "img",
      "aria-label": `${t} principal sector ${t === "arccos" ? "upper" : "right"} semicircle; angle ${C(H(n), 2)} degrees, coordinate (${C(Math.cos(n), 3)}, ${C(Math.sin(n), 3)}).`,
      onPointerDown: r ? (P) => {
        P.currentTarget.setPointerCapture(P.pointerId), j(P);
      } : void 0,
      onPointerMove: r ? (P) => {
        P.currentTarget.hasPointerCapture(P.pointerId) && j(P);
      } : void 0,
      onPointerUp: r ? (P) => {
        P.currentTarget.hasPointerCapture(P.pointerId) && P.currentTarget.releasePointerCapture(P.pointerId);
      } : void 0,
      children: [
        /* @__PURE__ */ e.jsx("path", { d: b, fill: G[t], fillOpacity: ".085" }),
        /* @__PURE__ */ e.jsx("circle", { cx: 155, cy: 148, r: 98, fill: "none", stroke: "#1f376b", strokeWidth: "1.4" }),
        /* @__PURE__ */ e.jsx("path", { d: `M${A} ${D}A98 98 0 0 0 ${T} ${q}`, fill: "none", stroke: G[t], strokeWidth: "2.5" }),
        [m, w].map((P) => {
          const [z, $] = d(P);
          return /* @__PURE__ */ e.jsx("circle", { cx: z, cy: $, r: "4", fill: t === "arctan" ? "#fff" : G[t], stroke: G[t], strokeWidth: "1.8" }, P);
        }),
        /* @__PURE__ */ e.jsx("path", { d: "M30 148H280M155 268V22", className: "ivt-axis" }),
        /* @__PURE__ */ e.jsx("path", { d: "M273 143l8 5-8 5M150 29l5-8 5 8", className: "ivt-axis" }),
        /* @__PURE__ */ e.jsx("text", { x: "286", y: "151", children: "x" }),
        /* @__PURE__ */ e.jsx("text", { x: "165", y: "23", children: "y" }),
        /* @__PURE__ */ e.jsx("text", { x: "257", y: "169", children: "1" }),
        /* @__PURE__ */ e.jsx("text", { x: "35", y: "169", children: "−1" }),
        /* @__PURE__ */ e.jsx("text", { x: "164", y: "48", children: "1" }),
        /* @__PURE__ */ e.jsx("text", { x: "166", y: "261", children: "−1" }),
        l !== void 0 && (() => {
          const [P, z] = d(l);
          return /* @__PURE__ */ e.jsxs("g", { children: [
            /* @__PURE__ */ e.jsx("path", { d: `M155 148L${P} ${z}`, stroke: "#8997b2", strokeDasharray: "4 4" }),
            /* @__PURE__ */ e.jsx("circle", { cx: P, cy: z, r: "5", fill: "#8f9bb5" }),
            /* @__PURE__ */ e.jsxs("text", { x: P, y: z < 148 ? z - 13 : z + 22, textAnchor: "middle", fontSize: "13", children: [
              Z(l),
              " (original)"
            ] })
          ] });
        })(),
        /* @__PURE__ */ e.jsx("path", { d: `M155 148L${O} ${f}M${O} ${f}V148M${O} ${f}H155`, fill: "none", stroke: "#087cff", strokeWidth: "1.8", strokeDasharray: "0 0 4 4" }),
        /* @__PURE__ */ e.jsx("path", { d: `M155 148L${O} ${f}`, stroke: "#087cff", strokeWidth: "2.4" }),
        Math.abs(n) > 1e-8 && /* @__PURE__ */ e.jsx("path", { d: `M184 148A29 29 0 ${Math.abs(n) > Math.PI ? 1 : 0} ${n < 0 ? 1 : 0} ${I} ${E}`, fill: "none", stroke: "#087cff", strokeWidth: "1.5" }),
        /* @__PURE__ */ e.jsx("circle", { cx: O, cy: f, r: "6", fill: G[t], stroke: "#fff", strokeWidth: "2" }),
        /* @__PURE__ */ e.jsx("text", { x: 155 + 35 * Math.cos(n / 2), y: 148 - 35 * Math.sin(n / 2) - 4, fill: "#087cff", children: "θ" }),
        !h && /* @__PURE__ */ e.jsxs("text", { x: "155", y: "281", textAnchor: "middle", fontSize: "13", children: [
          "(cos θ, sin θ) = (",
          C(Math.cos(n), 2),
          ", ",
          C(Math.sin(n), 2),
          ")"
        ] })
      ]
    }
  );
}
function _t({ kind: t }) {
  const [n, r] = Ot[t], l = (h) => 35 + (h + Math.PI / 2) / (Math.PI * 1.5) * 230;
  return /* @__PURE__ */ e.jsxs("svg", { viewBox: "0 0 300 86", className: "ivt-numberline", role: "img", "aria-label": `${t}: ${t === "arctan" ? "open" : "closed"} endpoints, ${t === "arccos" ? "0 to π" : "−π/2 to π/2"}`, children: [
    /* @__PURE__ */ e.jsx("path", { d: "M15 35H285", className: "ivt-axis" }),
    /* @__PURE__ */ e.jsx("path", { d: `M${l(n)} 35H${l(r)}`, stroke: G[t], strokeWidth: "4" }),
    [n, r].map((h) => /* @__PURE__ */ e.jsxs("g", { children: [
      /* @__PURE__ */ e.jsx("circle", { cx: l(h), cy: "35", r: "5", fill: t === "arctan" ? "#fff" : G[t], stroke: G[t], strokeWidth: "2" }),
      /* @__PURE__ */ e.jsx("text", { x: l(h), y: "64", textAnchor: "middle", children: Z(h) })
    ] }, h)),
    n !== 0 && /* @__PURE__ */ e.jsx("text", { x: l(0), y: "64", textAnchor: "middle", children: "0" })
  ] });
}
function Ua({ value: t }) {
  const n = 140 / Math.max(1, Math.abs(t)), r = 65, l = t >= 0 ? 185 : 65, h = r + n, p = l - t * n, u = Math.atan(t), v = r + 27 * Math.cos(u), m = l - 27 * Math.sin(u);
  return /* @__PURE__ */ e.jsxs("svg", { viewBox: "0 0 320 270", className: "ivt-triangle", role: "img", "aria-label": `Right triangle with adjacent 1 and signed opposite ${C(t, 2)}. Angle ${C(H(u), 2)} degrees.`, children: [
    /* @__PURE__ */ e.jsx("path", { d: `M${r} ${l}L${h} ${p}V${l}Z`, fill: "#00b982", fillOpacity: ".12", stroke: "#008c69", strokeWidth: "2.5" }),
    /* @__PURE__ */ e.jsx("path", { d: `M${h - 10} ${l}v${t < 0 ? 10 : -10}h10`, className: "ivt-axis" }),
    /* @__PURE__ */ e.jsx("circle", { cx: h, cy: p, r: "5", fill: "#008c69" }),
    /* @__PURE__ */ e.jsx("path", { d: `M${r + 27} ${l}A27 27 0 0 ${u < 0 ? 1 : 0} ${v} ${m}`, stroke: "#008c69", fill: "none" }),
    /* @__PURE__ */ e.jsx("text", { x: r + 32, y: l + (t < 0 ? 24 : -12), children: "θ" }),
    /* @__PURE__ */ e.jsx("text", { x: (r + h) / 2, y: l + (t < 0 ? -17 : 24), textAnchor: "middle", children: "adjacent = 1" }),
    /* @__PURE__ */ e.jsx("text", { x: h + 10, y: (l + p) / 2, children: "opposite" }),
    /* @__PURE__ */ e.jsxs("text", { x: h + 10, y: (l + p) / 2 + 22, children: [
      "= ",
      C(t, 2)
    ] }),
    /* @__PURE__ */ e.jsx("text", { x: "160", y: "252", textAnchor: "middle", children: "tan θ = x / 1 = x (signed ratio)" })
  ] });
}
function Ga() {
  const t = Dt().replace(/:/g, "");
  return /* @__PURE__ */ e.jsxs("svg", { className: "ivt-alpine", viewBox: "0 0 1000 290", preserveAspectRatio: "xMidYMid slice", "aria-hidden": "true", children: [
    /* @__PURE__ */ e.jsx("defs", { children: /* @__PURE__ */ e.jsxs("linearGradient", { id: t, x2: "0", y2: "1", children: [
      /* @__PURE__ */ e.jsx("stop", { stopColor: "#85b8eb" }),
      /* @__PURE__ */ e.jsx("stop", { offset: "1", stopColor: "#eef8ff" })
    ] }) }),
    /* @__PURE__ */ e.jsx("rect", { width: "1000", height: "290", fill: `url(#${t})` }),
    /* @__PURE__ */ e.jsx("circle", { cx: "190", cy: "70", r: "48", fill: "#fff", opacity: ".22" }),
    /* @__PURE__ */ e.jsx("path", { d: "M0 245 120 150 178 196 300 45 380 159 445 92 540 190 630 35 700 145 770 90 910 212 1000 130V290H0Z", fill: "#8cb6df", opacity: ".6" }),
    /* @__PURE__ */ e.jsx("path", { d: "m180 196 120-151 80 114-38-19-28-51-20 32-27-7-38 65Zm360-6 90-155 70 110-32-18-27-53-24 45-20-12-31 51ZM700 145l70-55 58 78-34-17-28-35-22 29Z", fill: "#fff", opacity: ".85" }),
    /* @__PURE__ */ e.jsx("path", { d: "M0 280 215 228 318 258 480 167 560 238 675 189 850 264 1000 223V290H0Z", fill: "#c4e1f2" }),
    /* @__PURE__ */ e.jsx("path", { d: "M0 279q250-25 450 3t550-14v22H0Z", fill: "#f5fbff", opacity: ".8" })
  ] });
}
const X = "/trigonometry/inverse", Ka = Bt.trigonometry.pages.find((t) => t.id === "inverse"), ge = [["arcsin", "Arcsin"], ["arccos", "Arccos"], ["arctan", "Arctan"], ["principal-values", "Principal Values"], ["compositions", "Compositions"]], Qa = { arcsin: ke, arccos: he, arctan: Ke, "principal-values": Qe, compositions: Ia }, Ht = { arcsin: "Maps a value to the angle whose sine is that value.", arccos: "Find the angle whose cosine is a given value.", arctan: "Maps a ratio to the angle whose tangent is that ratio." };
function L({ title: t, subtitle: n, icon: r = Ae, children: l, className: h = "", id: p }) {
  return /* @__PURE__ */ e.jsxs("section", { id: p, className: `ivt-panel ${h}`, children: [
    /* @__PURE__ */ e.jsxs("div", { className: "ivt-panel-heading", children: [
      /* @__PURE__ */ e.jsx("span", { className: "ivt-icon", children: /* @__PURE__ */ e.jsx(r, {}) }),
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("h2", { children: t }),
        n && /* @__PURE__ */ e.jsx("p", { children: n })
      ] })
    ] }),
    l
  ] });
}
function et({ value: t, onChange: n, id: r, label: l, min: h, max: p }) {
  const [u, v] = _(String(Number(t.toFixed(6))));
  return Me(() => v(String(Number(t.toFixed(6)))), [t]), /* @__PURE__ */ e.jsx("input", { id: r, "aria-label": l, type: "number", min: h, max: p, step: "any", value: u, onChange: (m) => {
    if (v(m.target.value), m.target.value !== "" && Number.isFinite(m.target.valueAsNumber)) {
      const w = n(m.target.valueAsNumber);
      typeof w == "number" && w !== m.target.valueAsNumber && v(String(Number(w.toFixed(6))));
    }
  }, onBlur: () => v(String(Number(t.toFixed(6)))) });
}
function Y({ children: t }) {
  return /* @__PURE__ */ e.jsx("div", { className: "ivt-formula", children: t });
}
function fe(t) {
  var n, r, l;
  (n = document.getElementById(t)) == null || n.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" }), (l = (r = document.getElementById(t)) == null ? void 0 : r.querySelector("input,button")) == null || l.focus({ preventScroll: !0 });
}
function Vt({ middle: t = "Try Examples", middleId: n = "ivt-examples" }) {
  return /* @__PURE__ */ e.jsx(L, { title: "Continue Learning", subtitle: "Explore, experiment, and build confidence with inverse trigonometry.", icon: Lt, className: "ivt-continue", children: /* @__PURE__ */ e.jsxs("div", { className: "ivt-action-grid", children: [
    /* @__PURE__ */ e.jsxs("button", { onClick: () => fe("ivt-live-graph"), children: [
      /* @__PURE__ */ e.jsx(Ie, {}),
      /* @__PURE__ */ e.jsxs("span", { children: [
        "Explore Graph",
        /* @__PURE__ */ e.jsx("small", { children: "Interact with the live point" })
      ] }),
      /* @__PURE__ */ e.jsx(J, {})
    ] }),
    /* @__PURE__ */ e.jsxs("button", { onClick: () => fe(n), children: [
      /* @__PURE__ */ e.jsx(Ae, {}),
      /* @__PURE__ */ e.jsxs("span", { children: [
        t,
        /* @__PURE__ */ e.jsx("small", { children: "Connect values and angles" })
      ] }),
      /* @__PURE__ */ e.jsx(J, {})
    ] }),
    /* @__PURE__ */ e.jsxs("button", { onClick: () => fe("ivt-quiz"), children: [
      /* @__PURE__ */ e.jsx(Ze, {}),
      /* @__PURE__ */ e.jsxs("span", { children: [
        "Take Quiz",
        /* @__PURE__ */ e.jsx("small", { children: "Test the current model" })
      ] }),
      /* @__PURE__ */ e.jsx(J, {})
    ] })
  ] }) });
}
function si() {
  var p;
  const t = wa(), [n] = Aa(), r = t.pathname.slice(X.length).replace(/^\/+|\/+$/g, ""), l = _a(n.get("mode"));
  if (Me(() => {
    var u;
    document.title = `${((u = ge.find(([v]) => v === r)) == null ? void 0 : u[1]) ?? "Inverse Trigonometry"} | Trigonometry Studio`;
  }, [r]), Me(() => {
    if (t.hash) {
      const u = window.setTimeout(() => fe(t.hash.slice(1)), 100);
      return () => window.clearTimeout(u);
    }
  }, [t.hash, r]), !r && l) {
    const u = new URLSearchParams(n);
    return u.delete("mode"), /* @__PURE__ */ e.jsx(St, { to: `${l}${u.size ? `?${u}` : ""}${t.hash}`, replace: !0 });
  }
  if (r && !ge.some(([u]) => u === r)) return /* @__PURE__ */ e.jsx(St, { to: X, replace: !0 });
  const h = (p = ge.find(([u]) => u === r)) == null ? void 0 : p[1];
  return /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsxs("div", { className: "ivt-studio", "data-inverse-page": r || "overview", children: [
      /* @__PURE__ */ e.jsxs("header", { className: "ivt-header", children: [
        /* @__PURE__ */ e.jsxs(te, { className: "ivt-brand", to: "/trigonometry", children: [
          /* @__PURE__ */ e.jsx(Nt, {}),
          /* @__PURE__ */ e.jsxs("span", { children: [
            "Trigonometry Studio",
            /* @__PURE__ */ e.jsx("small", { children: "Visualize · Explore · Master" })
          ] })
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: "ivt-header-description", children: "Values become angles. Insight becomes intuition." }),
        /* @__PURE__ */ e.jsxs("nav", { "aria-label": "Studio navigation", children: [
          /* @__PURE__ */ e.jsxs(te, { to: "/trigonometry", children: [
            /* @__PURE__ */ e.jsx(Ma, {}),
            "Studio Home"
          ] }),
          /* @__PURE__ */ e.jsxs(te, { to: "/", className: "ivt-primary", children: [
            /* @__PURE__ */ e.jsx(Ea, {}),
            "Main App Home"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("nav", { className: "ivt-subnav", "aria-label": "Inverse Trigonometry pages", children: [
        /* @__PURE__ */ e.jsx(Tt, { end: !0, to: X, children: "Overview" }),
        ge.map(([u, v]) => /* @__PURE__ */ e.jsx(Tt, { to: `${X}/${u}`, children: v }, u))
      ] }),
      /* @__PURE__ */ e.jsxs("main", { children: [
        /* @__PURE__ */ e.jsx(Ja, { slug: r }),
        r ? ee.includes(r) ? /* @__PURE__ */ e.jsx(Za, { kind: r }, r) : r === "principal-values" ? /* @__PURE__ */ e.jsx(ti, {}) : /* @__PURE__ */ e.jsx(ai, {}) : /* @__PURE__ */ e.jsx(Ya, {})
      ] }),
      /* @__PURE__ */ e.jsxs("footer", { className: "ivt-footer", children: [
        /* @__PURE__ */ e.jsx(ze, {}),
        "Visualize the concept",
        /* @__PURE__ */ e.jsx("span", { children: "Explore · Understand · Apply" }),
        /* @__PURE__ */ e.jsx(Ae, {}),
        "Strengthen understanding"
      ] })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "ivt-preserved-learning", children: /* @__PURE__ */ e.jsx(Oa, { studioId: "trigonometry", page: Ka, mode: h }) })
  ] });
}
function Ja({ slug: t }) {
  var h;
  const n = ((h = ge.find(([p]) => p === t)) == null ? void 0 : h[1]) ?? "Inverse Trigonometry", r = t === "arcsin" ? "Understand how inverse sine maps a value back to an angle." : t === "arccos" ? "Understand how inverse cosine maps an x-value to an angle on the principal branch." : t === "arctan" ? "Understand how inverse tangent converts a ratio into an angle." : t === "principal-values" ? "Learn why inverse trigonometric functions need restricted ranges to return a unique angle." : t === "compositions" ? "See what happens when trigonometric and inverse trigonometric functions are composed." : "Explore arcsin, arccos, arctan, principal values, and compositions through visual intuition and interactive learning.", l = ee.includes(t) ? t : null;
  return /* @__PURE__ */ e.jsxs("section", { className: `ivt-hero ${t ? "" : "ivt-hero-home"}`, children: [
    /* @__PURE__ */ e.jsx(Ga, {}),
    /* @__PURE__ */ e.jsxs("div", { className: "ivt-hero-copy", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "ivt-breadcrumb", children: [
        /* @__PURE__ */ e.jsxs(te, { to: t ? X : "/trigonometry", children: [
          /* @__PURE__ */ e.jsx(Pa, {}),
          t ? "Inverse Trig Home" : "Back to Studio"
        ] }),
        /* @__PURE__ */ e.jsx("span", { children: "Inverse Trigonometry Lab" })
      ] }),
      /* @__PURE__ */ e.jsx("h1", { children: n }),
      /* @__PURE__ */ e.jsx("p", { children: r }),
      !t && /* @__PURE__ */ e.jsxs("div", { className: "ivt-features", children: [
        /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx(Ie, {}),
          /* @__PURE__ */ e.jsxs("span", { children: [
            "Interactive Visualizations",
            /* @__PURE__ */ e.jsx("small", { children: "See the mathematics come to life" })
          ] })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx(Ce, {}),
          /* @__PURE__ */ e.jsxs("span", { children: [
            "Build Intuition",
            /* @__PURE__ */ e.jsx("small", { children: "From graphs to geometric meaning" })
          ] })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx(Ye, {}),
          /* @__PURE__ */ e.jsxs("span", { children: [
            "Practice & Master",
            /* @__PURE__ */ e.jsx("small", { children: "Real calculations and challenges" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "ivt-hero-math", children: l ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      /* @__PURE__ */ e.jsxs(Y, { children: [
        "y = ",
        W[l],
        /* @__PURE__ */ e.jsx("sup", { children: "−1" }),
        "(x)"
      ] }),
      /* @__PURE__ */ e.jsxs("p", { children: [
        "“",
        l === "arctan" ? "A ratio becomes an angle." : "From a value to its unique principal angle.",
        "”"
      ] })
    ] }) : t === "compositions" ? /* @__PURE__ */ e.jsxs("div", { className: "ivt-hero-pipeline", children: [
      /* @__PURE__ */ e.jsx("span", { children: "f" }),
      /* @__PURE__ */ e.jsx(Ra, {}),
      /* @__PURE__ */ e.jsxs("span", { children: [
        "f",
        /* @__PURE__ */ e.jsx("sup", { children: "−1" })
      ] }),
      /* @__PURE__ */ e.jsx("small", { children: "Functions undo each other — within the right domain." })
    ] }) : t === "principal-values" ? /* @__PURE__ */ e.jsxs("blockquote", { children: [
      "Same value.",
      /* @__PURE__ */ e.jsx("br", {}),
      "Many angles.",
      /* @__PURE__ */ e.jsx("br", {}),
      "One principal output."
    ] }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      /* @__PURE__ */ e.jsx(je, { kind: "arccos", theta: Math.PI / 4, preview: !0 }),
      /* @__PURE__ */ e.jsxs("div", { className: "ivt-hero-equations", children: [
        "θ = arcsin(y)",
        /* @__PURE__ */ e.jsx("br", {}),
        "θ = arccos(x)",
        /* @__PURE__ */ e.jsx("br", {}),
        "θ = arctan(y/x)",
        /* @__PURE__ */ e.jsx("small", { children: "with the appropriate principal branch" })
      ] })
    ] }) })
  ] });
}
function Ya() {
  return /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx("div", { className: "ivt-home-grid", children: ge.map(([t, n]) => {
      const r = Qa[t];
      return /* @__PURE__ */ e.jsxs(te, { to: `${X}/${t}`, className: `ivt-topic ivt-${t}`, children: [
        /* @__PURE__ */ e.jsxs("div", { className: "ivt-topic-heading", children: [
          /* @__PURE__ */ e.jsx("span", { className: "ivt-icon", children: /* @__PURE__ */ e.jsx(r, {}) }),
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsxs("h2", { children: [
              n,
              /* @__PURE__ */ e.jsx(J, {})
            ] }),
            /* @__PURE__ */ e.jsx("p", { children: t === "principal-values" ? "Understand ranges and uniqueness" : t === "compositions" ? "Combine functions and simplify" : `Explore y = ${W[t]}⁻¹(x)` })
          ] })
        ] }),
        t === "principal-values" ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
          /* @__PURE__ */ e.jsx(_t, { kind: "arcsin" }),
          /* @__PURE__ */ e.jsx("div", { className: "ivt-range-preview", children: ee.map((l) => /* @__PURE__ */ e.jsxs("span", { style: { color: G[l] }, children: [
            l,
            "(x) ∈ ",
            ae[l]
          ] }, l)) })
        ] }) : t === "compositions" ? /* @__PURE__ */ e.jsx("div", { className: "ivt-composition-preview", children: ee.map((l) => /* @__PURE__ */ e.jsxs(Y, { children: [
          W[l],
          "(",
          l,
          " x) = x",
          /* @__PURE__ */ e.jsxs("small", { children: [
            "x ∈ ",
            l === "arctan" ? "ℝ" : "[−1, 1]"
          ] })
        ] }, l)) }) : t === "arccos" ? /* @__PURE__ */ e.jsx(je, { kind: t, theta: Math.PI / 3, preview: !0 }) : /* @__PURE__ */ e.jsx(Xe, { kind: t, value: t === "arcsin" ? 0.6 : 1.5, preview: !0 }),
        /* @__PURE__ */ e.jsx("p", { className: "ivt-topic-description", children: t === "principal-values" ? "Learn why we restrict the range and how it ensures uniqueness." : t === "compositions" ? "Explore identities and what happens outside the principal range." : Ht[t] }),
        ee.includes(t) && /* @__PURE__ */ e.jsxs("small", { className: "ivt-domain-cue", children: [
          "Domain: ",
          t === "arctan" ? "ℝ" : "[−1, 1]",
          " · Range: ",
          ae[t]
        ] })
      ] }, t);
    }) }),
    /* @__PURE__ */ e.jsxs("div", { className: "ivt-home-bottom", children: [
      /* @__PURE__ */ e.jsx(L, { title: "What you’ll learn", subtitle: "Build a deeper understanding through visualization and practice.", icon: Ce, children: /* @__PURE__ */ e.jsx("div", { className: "ivt-outcomes", children: ["Understand arcsin, arccos, and arctan graphically", "Learn principal values and ranges", "Explore geometric meaning on the unit circle", "Work with compositions and identities", "Build problem-solving skills"].map((t) => /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx(Ue, {}),
        t
      ] }, t)) }) }),
      /* @__PURE__ */ e.jsx(L, { title: "Get Started", subtitle: "Jump into interactive tools, guided examples, and practice.", icon: Lt, className: "ivt-get-started", children: /* @__PURE__ */ e.jsxs("div", { className: "ivt-cta-links", children: [
        /* @__PURE__ */ e.jsxs(te, { to: `${X}/arcsin`, children: [
          /* @__PURE__ */ e.jsx(Ae, {}),
          "Start Learning",
          /* @__PURE__ */ e.jsx(J, {})
        ] }),
        /* @__PURE__ */ e.jsxs(te, { to: `${X}/principal-values`, children: [
          /* @__PURE__ */ e.jsx(he, {}),
          "Open Visual Explorer",
          /* @__PURE__ */ e.jsx(J, {})
        ] }),
        /* @__PURE__ */ e.jsxs(te, { to: `${X}/arctan#ivt-live-graph`, children: [
          /* @__PURE__ */ e.jsx(ke, {}),
          "Try Interactive Graph",
          /* @__PURE__ */ e.jsx(J, {})
        ] }),
        /* @__PURE__ */ e.jsxs(te, { to: `${X}/arcsin#ivt-quiz`, children: [
          /* @__PURE__ */ e.jsx(Ze, {}),
          "Take Quiz",
          /* @__PURE__ */ e.jsx(J, {})
        ] })
      ] }) })
    ] })
  ] });
}
function Za({ kind: t }) {
  const n = t === "arcsin" ? 0.6 : t === "arccos" ? 0.5 : 1.5, [r, l] = _(n), [h, p] = _(!0), [u, v] = _(""), m = ue(t, r), w = (d) => {
    if (!Number.isFinite(d)) {
      v("Enter a finite number.");
      return;
    }
    const A = t === "arctan" ? K(d, -1e6, 1e6) : K(d, -1, 1);
    return v(A !== d ? t === "arctan" ? "The numeric explorer supports −1,000,000 to 1,000,000; the mathematical domain is all real numbers." : "Input was clamped to the valid domain [−1, 1]." : ""), l(A), A;
  };
  return /* @__PURE__ */ e.jsxs("div", { className: `ivt-function-layout ivt-${t}`, children: [
    /* @__PURE__ */ e.jsxs("aside", { className: "ivt-facts", children: [
      /* @__PURE__ */ e.jsxs(L, { title: "Domain", subtitle: "Allowed input values.", icon: t === "arctan" ? ze : ke, children: [
        /* @__PURE__ */ e.jsxs(Y, { children: [
          "x ∈ ",
          t === "arctan" ? "ℝ" : "[−1, 1]"
        ] }),
        /* @__PURE__ */ e.jsx("p", { children: t === "arctan" ? "Any real ratio determines one principal angle." : "A sine or cosine value lies between −1 and 1, so this inverse is defined only on that interval." })
      ] }),
      /* @__PURE__ */ e.jsxs(L, { title: "Range", subtitle: "Possible output angles.", icon: Ye, children: [
        /* @__PURE__ */ e.jsxs(Y, { children: [
          "θ ∈ ",
          ae[t]
        ] }),
        /* @__PURE__ */ e.jsx("p", { children: t === "arctan" ? "The endpoints are open: a finite ratio cannot produce ±90°." : "The endpoints are included. Restricting the forward function to this range gives one unique angle per input." })
      ] }),
      /* @__PURE__ */ e.jsxs(L, { title: t === "arctan" ? "Key Properties" : "Key Formula", icon: t === "arctan" ? Ue : Qe, children: [
        /* @__PURE__ */ e.jsxs(Y, { children: [
          "y = ",
          W[t],
          /* @__PURE__ */ e.jsx("sup", { children: "−1" }),
          "(x)"
        ] }),
        /* @__PURE__ */ e.jsx("p", { children: t === "arccos" ? "Cosine decreases from 1 to −1 on [0, π], so arccos decreases from π to 0." : t === "arctan" ? "Continuous and increasing for all real x, with horizontal asymptotes y = ±π/2." : "Arcsin is continuous and strictly increasing on [−1, 1]." }),
        /* @__PURE__ */ e.jsx("p", { children: "The exponent −1 means inverse function, never reciprocal." })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs(L, { id: "ivt-live-graph", title: t === "arccos" ? "Graph of y = cos⁻¹(x)" : "Interactive Graph", subtitle: `Drag the point or adjust x to explore ${t}(x).`, icon: Ie, className: "ivt-live-panel", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "ivt-graph-toolbar", children: [
        /* @__PURE__ */ e.jsxs("button", { onClick: () => {
          w(n), p(!0);
        }, children: [
          /* @__PURE__ */ e.jsx(Je, {}),
          "Reset"
        ] }),
        t === "arctan" && /* @__PURE__ */ e.jsxs("label", { children: [
          /* @__PURE__ */ e.jsx("input", { type: "checkbox", checked: h, onChange: (d) => p(d.target.checked) }),
          "Show asymptotes"
        ] })
      ] }),
      /* @__PURE__ */ e.jsx(Xe, { kind: t, value: r, onChange: w, asymptotes: h }),
      /* @__PURE__ */ e.jsxs("div", { className: "ivt-controls-readout", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "ivt-input-control", children: [
          /* @__PURE__ */ e.jsx("label", { htmlFor: "ivt-x", children: "x value" }),
          /* @__PURE__ */ e.jsx(et, { id: "ivt-x", label: "Function input x", min: t === "arctan" ? -1e6 : -1, max: t === "arctan" ? 1e6 : 1, value: r, onChange: w }),
          /* @__PURE__ */ e.jsx("input", { "aria-label": "Adjust function input x", type: "range", min: t === "arctan" ? -10 : -1, max: t === "arctan" ? 10 : 1, step: ".001", value: K(r, t === "arctan" ? -10 : -1, t === "arctan" ? 10 : 1), onChange: (d) => w(d.target.valueAsNumber) }),
          /* @__PURE__ */ e.jsxs("div", { className: "ivt-slider-ends", children: [
            /* @__PURE__ */ e.jsx("span", { children: t === "arctan" ? "−10" : "−1" }),
            /* @__PURE__ */ e.jsx("span", { children: t === "arctan" ? "10" : "1" })
          ] }),
          t === "arctan" && Math.abs(r) > 10 && /* @__PURE__ */ e.jsxs("small", { children: [
            "Slider covers [−10, 10]. Numeric input and graph show x = ",
            C(r, 2),
            "."
          ] }),
          u && /* @__PURE__ */ e.jsx("small", { role: "status", children: u })
        ] }),
        /* @__PURE__ */ e.jsx(Xa, { kind: t, value: r, theta: m })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "ivt-geometry-column", children: [
      /* @__PURE__ */ e.jsxs(L, { id: "ivt-geometry", title: t === "arctan" ? "Geometric Interpretation" : t === "arccos" ? "Unit Circle Interpretation" : "Unit Circle Intuition", subtitle: t === "arctan" ? "A signed ratio x determines the ray’s angle." : "Drag on the principal semicircle to change the linked graph.", icon: t === "arctan" ? Nt : he, children: [
        t === "arctan" ? /* @__PURE__ */ e.jsx(Ua, { value: r }) : /* @__PURE__ */ e.jsx(je, { kind: t, theta: m, onChange: (d) => w(Fe(t, d)) }),
        /* @__PURE__ */ e.jsx(Y, { children: t === "arctan" ? "tan θ = opposite / adjacent = x / 1" : t === "arcsin" ? "sin θ = x (vertical coordinate)" : "cos θ = x (horizontal coordinate)" }),
        /* @__PURE__ */ e.jsxs("p", { children: [
          "θ = ",
          Z(m),
          " = ",
          C(H(m), 2),
          "°"
        ] })
      ] }),
      t !== "arctan" && /* @__PURE__ */ e.jsx(Mt, { kind: t, onSelect: w })
    ] }),
    /* @__PURE__ */ e.jsxs("aside", { className: "ivt-concepts", children: [
      /* @__PURE__ */ e.jsx(L, { title: t === "arctan" ? "Why Horizontal Asymptotes?" : "Key Concepts", subtitle: "One input, one chosen output.", icon: Ce, children: t === "arctan" ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsx("p", { children: "As x → ∞, θ approaches π/2; as x → −∞, θ approaches −π/2. Neither endpoint is attained at finite x." }),
        /* @__PURE__ */ e.jsx(Y, { children: "−90° < θ < 90°" })
      ] }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsxs("article", { children: [
          /* @__PURE__ */ e.jsx("h3", { children: "Principal Branch" }),
          /* @__PURE__ */ e.jsx("p", { children: t === "arcsin" ? "Sine repeats on the full real line. We restrict it to [−π/2, π/2], where it is one-to-one." : "Cosine repeats and cos θ = cos(−θ). Restricting it to [0, π], where it is strictly decreasing, makes its inverse a function." })
        ] }),
        /* @__PURE__ */ e.jsxs("article", { children: [
          /* @__PURE__ */ e.jsx("h3", { children: t === "arcsin" ? "Increasing Function" : "Decreasing Function" }),
          /* @__PURE__ */ e.jsx("p", { children: t === "arcsin" ? "Increasing x always increases the returned principal angle." : "Increasing x always decreases the returned principal angle." })
        ] }),
        /* @__PURE__ */ e.jsxs("article", { children: [
          /* @__PURE__ */ e.jsx("h3", { children: "Geometric Meaning" }),
          /* @__PURE__ */ e.jsxs("p", { children: [
            Ht[t],
            " Its unit-circle coordinate is (",
            C(Math.cos(m), 3),
            ", ",
            C(Math.sin(m), 3),
            ")."
          ] })
        ] })
      ] }) }),
      t === "arccos" && /* @__PURE__ */ e.jsxs(L, { title: "Key Takeaways", icon: Ue, children: [
        /* @__PURE__ */ e.jsx("p", { children: "Arccos(1) = 0, arccos(0) = π/2, and arccos(−1) = π." }),
        /* @__PURE__ */ e.jsx("p", { children: "Every allowed input has exactly one output in [0, π]." })
      ] })
    ] }),
    t === "arctan" && /* @__PURE__ */ e.jsx(Mt, { kind: t, onSelect: w }),
    /* @__PURE__ */ e.jsx(Vt, { middle: t === "arctan" ? "Angle From Ratio" : "Try Examples", middleId: t === "arctan" ? "ivt-geometry" : "ivt-examples" }),
    /* @__PURE__ */ e.jsx(tt, { expected: H(m), prompt: `For the current x = ${C(r, 3)}, what is ${t}(x) in degrees?`, hint: `Choose an angle in ${ae[t]}; read the graph or linked geometric model.` }, t)
  ] });
}
function Xa({ kind: t, value: n, theta: r }) {
  return /* @__PURE__ */ e.jsxs("output", { className: "ivt-angle-readout", "aria-live": "polite", "aria-label": "Live principal angle", children: [
    /* @__PURE__ */ e.jsxs("span", { children: [
      "θ = ",
      t,
      "(",
      C(n, 2),
      ")"
    ] }),
    /* @__PURE__ */ e.jsxs("strong", { children: [
      C(r),
      " rad"
    ] }),
    /* @__PURE__ */ e.jsxs("strong", { children: [
      C(H(r), 2),
      "°"
    ] }),
    /* @__PURE__ */ e.jsxs("small", { children: [
      "Principal angle: ",
      Z(r)
    ] })
  ] });
}
const ei = { arcsin: [0, 0.5, 1, -1], arccos: [1, 0.5, 0, -1], arctan: [0, 1, Math.sqrt(3), -1, -Math.sqrt(3)] };
function Mt({ kind: t, onSelect: n }) {
  return /* @__PURE__ */ e.jsx(L, { id: "ivt-examples", title: "Common Examples", subtitle: "Select a value to test it in the live model.", icon: Ae, className: "ivt-examples", children: /* @__PURE__ */ e.jsx("div", { children: ei[t].map((r) => /* @__PURE__ */ e.jsxs("button", { onClick: () => n(r), children: [
    t,
    "(",
    Math.abs(Math.abs(r) - Math.sqrt(3)) < 1e-8 ? `${r < 0 ? "−" : ""}√3` : r,
    ") = ",
    Z(ue(t, r)),
    /* @__PURE__ */ e.jsxs("small", { children: [
      "(",
      C(H(ue(t, r)), 0),
      "°)"
    ] })
  ] }, r)) }) });
}
function tt({ expected: t, prompt: n, hint: r }) {
  const [l, h] = _(""), [p, u] = _(null), v = xa(null), m = p && t !== null && Math.abs(p.expected - t) < 1e-9, w = m && Math.abs(p.answer - t) <= 0.05;
  return /* @__PURE__ */ e.jsxs(L, { id: "ivt-quiz", title: "Try the Live Challenge", subtitle: "This question is calculated from the model you are exploring.", icon: Ze, className: "ivt-quiz", children: [
    /* @__PURE__ */ e.jsx("p", { children: n }),
    /* @__PURE__ */ e.jsxs("form", { onSubmit: (d) => {
      var D;
      d.preventDefault();
      const A = Number(l);
      t !== null && l.trim() && Number.isFinite(A) ? u({ expected: t, answer: A }) : (D = v.current) == null || D.focus();
    }, children: [
      /* @__PURE__ */ e.jsx("label", { htmlFor: "ivt-answer", children: "Your answer (rounded to 2 decimal places)" }),
      /* @__PURE__ */ e.jsx("input", { id: "ivt-answer", ref: v, type: "number", step: "any", value: l, onChange: (d) => h(d.target.value), disabled: t === null }),
      /* @__PURE__ */ e.jsx("button", { type: "submit", className: "ivt-primary", disabled: t === null, children: "Check Answer" })
    ] }),
    t === null ? /* @__PURE__ */ e.jsx("p", { role: "status", children: "This composition is undefined. Select a defined input to try the challenge." }) : m ? /* @__PURE__ */ e.jsx("p", { role: "status", className: w ? "ivt-correct" : "ivt-retry", children: w ? "Correct — your answer matches the live model." : `Try again. ${r}` }) : p ? /* @__PURE__ */ e.jsx("p", { role: "status", children: "The model changed. Check your answer for the new input." }) : /* @__PURE__ */ e.jsx("p", { children: r })
  ] });
}
function ti() {
  const [t, n] = _("arcsin"), [r, l] = _(!0), [h, p] = _(150), u = Ge(h), v = Fe(t, u), m = v === null ? null : ue(t, t === "arctan" ? v : K(v, -1, 1)), w = (d) => {
    n(d), p(d === "arcsin" ? 150 : d === "arccos" ? 300 : 225);
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "ivt-principal-page", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "ivt-principal-toolbar", children: [
      /* @__PURE__ */ e.jsx("div", { role: "group", "aria-label": "Choose principal function", children: ee.map((d) => /* @__PURE__ */ e.jsx("button", { "aria-pressed": d === t, onClick: () => w(d), children: $a[d] }, d)) }),
      /* @__PURE__ */ e.jsxs("label", { children: [
        /* @__PURE__ */ e.jsx("input", { type: "checkbox", checked: r, onChange: (d) => l(d.target.checked) }),
        "Compare all three ranges"
      ] }),
      /* @__PURE__ */ e.jsxs("button", { onClick: () => {
        w("arcsin"), l(!0);
      }, children: [
        /* @__PURE__ */ e.jsx(Je, {}),
        "Reset"
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "ivt-principal-grid", children: [
      /* @__PURE__ */ e.jsx(L, { title: "Principal Ranges for Inverse Trigonometric Functions", subtitle: "Each restricted range gives a unique angle. Filled endpoints are included; hollow endpoints are excluded.", icon: Qe, className: "ivt-ranges-panel", children: /* @__PURE__ */ e.jsx("div", { className: "ivt-range-cards", children: (r ? ee : [t]).map((d) => /* @__PURE__ */ e.jsxs("button", { onClick: () => w(d), "aria-pressed": t === d, className: `ivt-range-card ivt-${d}`, children: [
        /* @__PURE__ */ e.jsx("span", { className: "ivt-icon", children: d === "arcsin" ? /* @__PURE__ */ e.jsx(ke, {}) : d === "arccos" ? /* @__PURE__ */ e.jsx(he, {}) : /* @__PURE__ */ e.jsx(Ke, {}) }),
        /* @__PURE__ */ e.jsxs("h3", { children: [
          d,
          "(x)"
        ] }),
        /* @__PURE__ */ e.jsx("p", { children: "Principal range:" }),
        /* @__PURE__ */ e.jsx(Y, { children: ae[d] }),
        /* @__PURE__ */ e.jsx(_t, { kind: d }),
        /* @__PURE__ */ e.jsx("p", { children: d === "arctan" ? "Open endpoints: ±π/2 are never outputs." : "Closed endpoints: both boundary angles are valid outputs." })
      ] }, d)) }) }),
      /* @__PURE__ */ e.jsx(L, { id: "ivt-geometry", title: "Visualizing Principal Values on the Unit Circle", subtitle: "Many original angles share a trig value. The inverse chooses its principal angle.", icon: he, children: /* @__PURE__ */ e.jsxs("div", { className: "ivt-principal-visual", children: [
        /* @__PURE__ */ e.jsx(je, { kind: t, theta: m ?? 0, comparisonAngle: u, onChange: (d) => p(H(d)) }),
        /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsxs("h3", { children: [
            "Example: ",
            W[t]
          ] }),
          /* @__PURE__ */ e.jsx("label", { htmlFor: "ivt-original-angle", children: "Original angle θ (degrees)" }),
          /* @__PURE__ */ e.jsx(et, { id: "ivt-original-angle", min: -720, max: 720, value: h, onChange: (d) => {
            const A = K(d, -720, 720);
            return p(A), A;
          } }),
          /* @__PURE__ */ e.jsx("input", { type: "range", "aria-label": "Adjust original angle", min: "-360", max: "360", value: K(h, -360, 360), onChange: (d) => p(d.target.valueAsNumber) }),
          m === null ? /* @__PURE__ */ e.jsx("p", { role: "alert", children: "Tangent is undefined at this angle. No principal value exists for this composition." }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
            /* @__PURE__ */ e.jsxs(Y, { children: [
              W[t],
              "(",
              Z(u),
              ") = ",
              C(v, 3)
            ] }),
            /* @__PURE__ */ e.jsxs(Y, { children: [
              t,
              "(",
              C(v, 3),
              ") = ",
              Z(m)
            ] }),
            /* @__PURE__ */ e.jsxs("p", { children: [
              "Selected angle: ",
              C(H(m), 2),
              "°. It lies in ",
              ae[t],
              "."
            ] }),
            /* @__PURE__ */ e.jsx("p", { children: Math.abs(m - u) < 1e-9 ? "The original angle is already in the principal range." : "The original angle lies outside the principal range, so the inverse returns a different angle with the same trig value." })
          ] })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "ivt-principal-notes", children: [
      /* @__PURE__ */ e.jsx(L, { title: "Why Restrict the Range?", icon: Ce, children: /* @__PURE__ */ e.jsx("p", { children: "Trigonometric functions are periodic and are not one-to-one on the whole real line. Restricting their input angles lets the inverse return a single, well-defined principal angle." }) }),
      /* @__PURE__ */ e.jsxs(L, { title: "One Input, One Chosen Output", icon: Ye, children: [
        /* @__PURE__ */ e.jsx("p", { children: "sin(π/6) = sin(5π/6) = 1/2, but arcsin(1/2) = π/6." }),
        /* @__PURE__ */ e.jsx("p", { children: "cos(π/3) = cos(5π/3) = 1/2, but arccos(1/2) = π/3." }),
        /* @__PURE__ */ e.jsx("p", { children: "tan(π/4) = tan(5π/4) = 1, but arctan(1) = π/4." })
      ] }),
      /* @__PURE__ */ e.jsx(L, { title: "Explore Principal Values", icon: ze, children: /* @__PURE__ */ e.jsxs("div", { className: "ivt-action-stack", children: [
        /* @__PURE__ */ e.jsxs("button", { onClick: () => fe("ivt-geometry"), children: [
          "See Unit Circle",
          /* @__PURE__ */ e.jsx(J, {})
        ] }),
        /* @__PURE__ */ e.jsxs("button", { onClick: () => l((d) => !d), children: [
          r ? "Focus Selected Range" : "Compare Ranges",
          /* @__PURE__ */ e.jsx(J, {})
        ] }),
        /* @__PURE__ */ e.jsxs("button", { onClick: () => fe("ivt-quiz"), children: [
          "Practice",
          /* @__PURE__ */ e.jsx(J, {})
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ e.jsx(tt, { expected: m === null ? null : H(m), prompt: `What principal angle in degrees does ${t}(${W[t]}(${h}°)) return?`, hint: `Use the chosen range ${ae[t]}, not an unrestricted original angle.` })
  ] });
}
function ai() {
  const [t, n] = _("arcsin"), [r, l] = _(!1), [h, p] = _(0.5), [u, v] = _("degrees"), [m, w] = _(""), d = r && u === "degrees" ? Ge(h) : h, A = $t(t, r, d), D = r ? A.output : A.intermediate, T = (f, I) => {
    n(f), l(I), p(I ? u === "degrees" ? 135 : 3 * Math.PI / 4 : f === "arctan" ? 2 : 0.5), w("");
  }, q = (f) => {
    if (!Number.isFinite(f)) return;
    const I = r ? u === "degrees" ? -720 : -4 * Math.PI : t === "arctan" ? -1e6 : -1, E = -I, b = K(f, I, E);
    return w(b !== f ? "Input was clamped to the explorer’s valid interval." : ""), p(b), b;
  }, O = r ? `${t}(${W[t]} θ)` : `${W[t]}(${t} x)`;
  return /* @__PURE__ */ e.jsxs("div", { className: "ivt-compositions-page", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "ivt-identities", children: [
      ee.map((f) => /* @__PURE__ */ e.jsxs("button", { className: `ivt-identity ivt-${f}`, onClick: () => T(f, !1), "aria-pressed": !r && t === f, children: [
        /* @__PURE__ */ e.jsx("span", { className: "ivt-icon", children: f === "arcsin" ? /* @__PURE__ */ e.jsx(ke, {}) : f === "arccos" ? /* @__PURE__ */ e.jsx(he, {}) : /* @__PURE__ */ e.jsx(Ke, {}) }),
        /* @__PURE__ */ e.jsxs("h2", { children: [
          W[f],
          "(",
          f,
          " x) = x"
        ] }),
        /* @__PURE__ */ e.jsx("p", { children: f === "arctan" ? "For all real numbers" : "For x ∈ [−1, 1]" }),
        /* @__PURE__ */ e.jsxs(Y, { children: [
          W[f],
          "(",
          f,
          " x) = x"
        ] }),
        /* @__PURE__ */ e.jsxs("p", { children: [
          f,
          " returns one principal angle. Applying ",
          W[f],
          " to that angle returns the original input."
        ] })
      ] }, f)),
      /* @__PURE__ */ e.jsxs(L, { title: "Visual on the Unit Circle", icon: he, children: [
        D !== null ? /* @__PURE__ */ e.jsx(je, { kind: t, theta: D, comparisonAngle: r ? d : void 0, onChange: (f) => q(r ? u === "degrees" ? H(f) : f : Fe(t, f)), preview: !0 }) : /* @__PURE__ */ e.jsx("p", { children: "This input is undefined. Select a finite tangent value." }),
        /* @__PURE__ */ e.jsx("p", { children: "Inverse trig functions return principal angles." })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "ivt-composition-workbench", children: [
      /* @__PURE__ */ e.jsxs(L, { id: "ivt-live-graph", title: "Composition Explorer", subtitle: "Trace an input through both functions. Change the order to see branch folding.", icon: ze, className: "ivt-composition-controls", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "ivt-composition-fields", children: [
          /* @__PURE__ */ e.jsxs("label", { children: [
            "Choose a composition",
            /* @__PURE__ */ e.jsx("select", { "aria-label": "Choose a composition", value: `${t}:${r ? "reverse" : "direct"}`, onChange: (f) => {
              const [I, E] = f.target.value.split(":");
              T(I, E === "reverse");
            }, children: ee.flatMap((f) => [/* @__PURE__ */ e.jsxs("option", { value: `${f}:direct`, children: [
              W[f],
              " ∘ ",
              f
            ] }, `${f}:direct`), /* @__PURE__ */ e.jsxs("option", { value: `${f}:reverse`, children: [
              f,
              " ∘ ",
              W[f]
            ] }, `${f}:reverse`)]) })
          ] }),
          /* @__PURE__ */ e.jsxs("label", { children: [
            r ? "Original angle θ" : "Input x",
            /* @__PURE__ */ e.jsx(et, { label: "Composition input", value: h, onChange: q })
          ] }),
          r && /* @__PURE__ */ e.jsxs("label", { children: [
            "Angle unit",
            /* @__PURE__ */ e.jsxs("select", { "aria-label": "Composition angle unit", value: u, onChange: (f) => {
              const I = f.target.value;
              p(I === "degrees" ? H(h) : Ge(h)), v(I);
            }, children: [
              /* @__PURE__ */ e.jsx("option", { value: "degrees", children: "Degrees" }),
              /* @__PURE__ */ e.jsx("option", { value: "radians", children: "Radians" })
            ] })
          ] }),
          /* @__PURE__ */ e.jsxs("button", { onClick: () => T("arcsin", !1), children: [
            /* @__PURE__ */ e.jsx(Je, {}),
            "Reset"
          ] })
        ] }),
        /* @__PURE__ */ e.jsx("input", { "aria-label": "Adjust composition input", type: "range", min: r ? u === "degrees" ? -360 : -2 * Math.PI : t === "arctan" ? -10 : -1, max: r ? u === "degrees" ? 360 : 2 * Math.PI : t === "arctan" ? 10 : 1, step: r ? 0.01 : 1e-3, value: h, onChange: (f) => q(f.target.valueAsNumber) }),
        m && /* @__PURE__ */ e.jsx("p", { role: "status", children: m }),
        /* @__PURE__ */ e.jsx(ii, { kind: t, reverse: r, input: d, intermediate: A.intermediate, output: A.output }),
        /* @__PURE__ */ e.jsxs("output", { className: "ivt-composition-result", "aria-live": "polite", children: [
          O,
          " = ",
          A.output === null ? "undefined" : r ? `${Z(A.output)} (${C(H(A.output), 2)}°)` : C(A.output),
          /* @__PURE__ */ e.jsx("small", { children: A.output === null ? "Tangent is undefined at odd multiples of π/2." : A.identity ? "Both functions undo each other for this input." : "The result folds into the principal range; it is not the original angle." })
        ] }),
        /* @__PURE__ */ e.jsx("p", { children: r ? `The reverse identity holds only for θ ∈ ${ae[t]}.` : `Valid domain: x ∈ ${t === "arctan" ? "ℝ" : "[−1, 1]"}.` }),
        /* @__PURE__ */ e.jsxs("div", { className: "ivt-composition-presets", id: "ivt-examples", children: [
          /* @__PURE__ */ e.jsx("span", { children: "Try a worked example:" }),
          /* @__PURE__ */ e.jsx("button", { onClick: () => {
            T("arcsin", !0), p(u === "degrees" ? 135 : 3 * Math.PI / 4);
          }, children: "arcsin(sin 3π/4)" }),
          /* @__PURE__ */ e.jsx("button", { onClick: () => {
            T("arccos", !0), p(u === "degrees" ? 225 : 5 * Math.PI / 4);
          }, children: "arccos(cos 5π/4)" }),
          /* @__PURE__ */ e.jsx("button", { onClick: () => {
            T("arctan", !0), p(u === "degrees" ? 135 : 3 * Math.PI / 4);
          }, children: "arctan(tan 3π/4)" })
        ] })
      ] }),
      /* @__PURE__ */ e.jsx(L, { title: `Graph: y = ${O}`, subtitle: r ? "Horizontal axis: original angle in radians." : "Identity graph drawn only on the valid input domain.", icon: Ie, children: /* @__PURE__ */ e.jsx(Xe, { kind: t, value: d, onChange: (f) => q(r && u === "degrees" ? H(f) : f), composed: !0, reverse: r }) }),
      /* @__PURE__ */ e.jsxs(L, { title: "Caution: Reverse Compositions", icon: Ce, className: "ivt-reverse-caution", children: [
        ee.map((f) => /* @__PURE__ */ e.jsxs("button", { onClick: () => T(f, !0), className: `ivt-${f}`, children: [
          /* @__PURE__ */ e.jsxs(Y, { children: [
            f,
            "(",
            W[f],
            " θ) = θ"
          ] }),
          /* @__PURE__ */ e.jsxs("small", { children: [
            "only for θ ∈ ",
            ae[f]
          ] })
        ] }, f)),
        /* @__PURE__ */ e.jsx("p", { children: "Outside the principal range, the inverse returns the principal angle with the same trig value." }),
        /* @__PURE__ */ e.jsx("p", { children: "For example, arcsin(sin 3π/4) = π/4, not 3π/4." })
      ] })
    ] }),
    /* @__PURE__ */ e.jsx(Vt, { middle: "Try Reverse Examples" }),
    /* @__PURE__ */ e.jsx(tt, { expected: A.output === null ? null : r ? H(A.output) : A.output, prompt: `For the current input ${r ? `${C(h, 2)} ${u}` : C(h, 3)}, what is ${O}? ${r ? "Answer in degrees." : "Answer as a number."}`, hint: "Follow the pipeline and check the principal range before returning the original input." })
  ] });
}
function ii({ kind: t, reverse: n, input: r, intermediate: l, output: h }) {
  const p = [["INPUT", n ? `${C(H(r), 2)}°` : C(r, 3)], [n ? W[t] : t, l === null ? "undefined" : n ? C(l, 4) : `${C(l)} rad`], [n ? t : W[t], h === null ? "undefined" : n ? `${C(h)} rad` : C(h, 4)], ["OUTPUT", h === null ? "undefined" : n ? `${C(H(h), 2)}°` : C(h, 4)]];
  return /* @__PURE__ */ e.jsx("div", { className: "ivt-flow", "aria-label": "Live function pipeline", children: p.map(([u, v], m) => /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("small", { children: u }),
    /* @__PURE__ */ e.jsx("strong", { children: v }),
    m < p.length - 1 && /* @__PURE__ */ e.jsx(J, {})
  ] }, u + m)) });
}
export {
  si as default
};
