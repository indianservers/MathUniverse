var So = Object.defineProperty;
var ko = (a, e, t) => e in a ? So(a, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : a[e] = t;
var Fe = (a, e, t) => ko(a, typeof e != "symbol" ? e + "" : e, t);
import On, { forwardRef as Hn, createElement as Vr, useState as ce, useEffect as ea, createContext as Co, useLayoutEffect as $n, useCallback as Gr, useMemo as Yr, useContext as Wn, useSyncExternalStore as To, useRef as _a, useId as Un } from "react";
import { useSearchParams as Vn, useLocation as Gn, Link as ot, Navigate as $i, NavLink as Wi } from "react-router-dom";
var Fa = { exports: {} }, ga = {};
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Ui;
function Mo() {
  if (Ui) return ga;
  Ui = 1;
  var a = On, e = Symbol.for("react.element"), t = Symbol.for("react.fragment"), r = Object.prototype.hasOwnProperty, i = a.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, n = { key: !0, ref: !0, __self: !0, __source: !0 };
  function l(u, d, p) {
    var f, b = {}, S = null, w = null;
    p !== void 0 && (S = "" + p), d.key !== void 0 && (S = "" + d.key), d.ref !== void 0 && (w = d.ref);
    for (f in d) r.call(d, f) && !n.hasOwnProperty(f) && (b[f] = d[f]);
    if (u && u.defaultProps) for (f in d = u.defaultProps, d) b[f] === void 0 && (b[f] = d[f]);
    return { $$typeof: e, type: u, key: S, ref: w, props: b, _owner: i.current };
  }
  return ga.Fragment = t, ga.jsx = l, ga.jsxs = l, ga;
}
var va = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Vi;
function zo() {
  return Vi || (Vi = 1, process.env.NODE_ENV !== "production" && (function() {
    var a = On, e = Symbol.for("react.element"), t = Symbol.for("react.portal"), r = Symbol.for("react.fragment"), i = Symbol.for("react.strict_mode"), n = Symbol.for("react.profiler"), l = Symbol.for("react.provider"), u = Symbol.for("react.context"), d = Symbol.for("react.forward_ref"), p = Symbol.for("react.suspense"), f = Symbol.for("react.suspense_list"), b = Symbol.for("react.memo"), S = Symbol.for("react.lazy"), w = Symbol.for("react.offscreen"), j = Symbol.iterator, R = "@@iterator";
    function N(y) {
      if (y === null || typeof y != "object")
        return null;
      var D = j && y[j] || y[R];
      return typeof D == "function" ? D : null;
    }
    var I = a.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    function O(y) {
      {
        for (var D = arguments.length, W = new Array(D > 1 ? D - 1 : 0), Z = 1; Z < D; Z++)
          W[Z - 1] = arguments[Z];
        k("error", y, W);
      }
    }
    function k(y, D, W) {
      {
        var Z = I.ReactDebugCurrentFrame, le = Z.getStackAddendum();
        le !== "" && (D += "%s", W = W.concat([le]));
        var de = W.map(function(ie) {
          return String(ie);
        });
        de.unshift("Warning: " + D), Function.prototype.apply.call(console[y], console, de);
      }
    }
    var L = !1, V = !1, X = !1, ae = !1, G = !1, J;
    J = Symbol.for("react.module.reference");
    function me(y) {
      return !!(typeof y == "string" || typeof y == "function" || y === r || y === n || G || y === i || y === p || y === f || ae || y === w || L || V || X || typeof y == "object" && y !== null && (y.$$typeof === S || y.$$typeof === b || y.$$typeof === l || y.$$typeof === u || y.$$typeof === d || // This needs to include all possible module reference object
      // types supported by any Flight configuration anywhere since
      // we don't know which Flight build this will end up being used
      // with.
      y.$$typeof === J || y.getModuleId !== void 0));
    }
    function _(y, D, W) {
      var Z = y.displayName;
      if (Z)
        return Z;
      var le = D.displayName || D.name || "";
      return le !== "" ? W + "(" + le + ")" : W;
    }
    function ne(y) {
      return y.displayName || "Context";
    }
    function Pe(y) {
      if (y == null)
        return null;
      if (typeof y.tag == "number" && O("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof y == "function")
        return y.displayName || y.name || null;
      if (typeof y == "string")
        return y;
      switch (y) {
        case r:
          return "Fragment";
        case t:
          return "Portal";
        case n:
          return "Profiler";
        case i:
          return "StrictMode";
        case p:
          return "Suspense";
        case f:
          return "SuspenseList";
      }
      if (typeof y == "object")
        switch (y.$$typeof) {
          case u:
            var D = y;
            return ne(D) + ".Consumer";
          case l:
            var W = y;
            return ne(W._context) + ".Provider";
          case d:
            return _(y, y.render, "ForwardRef");
          case b:
            var Z = y.displayName || null;
            return Z !== null ? Z : Pe(y.type) || "Memo";
          case S: {
            var le = y, de = le._payload, ie = le._init;
            try {
              return Pe(ie(de));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    var Ae = Object.assign, Te = 0, Ve, Me, Je, mt, ye, ze, U;
    function Le() {
    }
    Le.__reactDisabledLog = !0;
    function kt() {
      {
        if (Te === 0) {
          Ve = console.log, Me = console.info, Je = console.warn, mt = console.error, ye = console.group, ze = console.groupCollapsed, U = console.groupEnd;
          var y = {
            configurable: !0,
            enumerable: !0,
            value: Le,
            writable: !0
          };
          Object.defineProperties(console, {
            info: y,
            log: y,
            warn: y,
            error: y,
            group: y,
            groupCollapsed: y,
            groupEnd: y
          });
        }
        Te++;
      }
    }
    function C() {
      {
        if (Te--, Te === 0) {
          var y = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: Ae({}, y, {
              value: Ve
            }),
            info: Ae({}, y, {
              value: Me
            }),
            warn: Ae({}, y, {
              value: Je
            }),
            error: Ae({}, y, {
              value: mt
            }),
            group: Ae({}, y, {
              value: ye
            }),
            groupCollapsed: Ae({}, y, {
              value: ze
            }),
            groupEnd: Ae({}, y, {
              value: U
            })
          });
        }
        Te < 0 && O("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var Q = I.ReactCurrentDispatcher, ue;
    function pe(y, D, W) {
      {
        if (ue === void 0)
          try {
            throw Error();
          } catch (le) {
            var Z = le.stack.trim().match(/\n( *(at )?)/);
            ue = Z && Z[1] || "";
          }
        return `
` + ue + y;
      }
    }
    var ke = !1, Qe;
    {
      var Pt = typeof WeakMap == "function" ? WeakMap : Map;
      Qe = new Pt();
    }
    function Ct(y, D) {
      if (!y || ke)
        return "";
      {
        var W = Qe.get(y);
        if (W !== void 0)
          return W;
      }
      var Z;
      ke = !0;
      var le = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var de;
      de = Q.current, Q.current = null, kt();
      try {
        if (D) {
          var ie = function() {
            throw Error();
          };
          if (Object.defineProperty(ie.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(ie, []);
            } catch (Ge) {
              Z = Ge;
            }
            Reflect.construct(y, [], ie);
          } else {
            try {
              ie.call();
            } catch (Ge) {
              Z = Ge;
            }
            y.call(ie.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (Ge) {
            Z = Ge;
          }
          y();
        }
      } catch (Ge) {
        if (Ge && Z && typeof Ge.stack == "string") {
          for (var re = Ge.stack.split(`
`), Oe = Z.stack.split(`
`), Ce = re.length - 1, qe = Oe.length - 1; Ce >= 1 && qe >= 0 && re[Ce] !== Oe[qe]; )
            qe--;
          for (; Ce >= 1 && qe >= 0; Ce--, qe--)
            if (re[Ce] !== Oe[qe]) {
              if (Ce !== 1 || qe !== 1)
                do
                  if (Ce--, qe--, qe < 0 || re[Ce] !== Oe[qe]) {
                    var tt = `
` + re[Ce].replace(" at new ", " at ");
                    return y.displayName && tt.includes("<anonymous>") && (tt = tt.replace("<anonymous>", y.displayName)), typeof y == "function" && Qe.set(y, tt), tt;
                  }
                while (Ce >= 1 && qe >= 0);
              break;
            }
        }
      } finally {
        ke = !1, Q.current = de, C(), Error.prepareStackTrace = le;
      }
      var Jt = y ? y.displayName || y.name : "", Nt = Jt ? pe(Jt) : "";
      return typeof y == "function" && Qe.set(y, Nt), Nt;
    }
    function pt(y, D, W) {
      return Ct(y, !1);
    }
    function et(y) {
      var D = y.prototype;
      return !!(D && D.isReactComponent);
    }
    function Kt(y, D, W) {
      if (y == null)
        return "";
      if (typeof y == "function")
        return Ct(y, et(y));
      if (typeof y == "string")
        return pe(y);
      switch (y) {
        case p:
          return pe("Suspense");
        case f:
          return pe("SuspenseList");
      }
      if (typeof y == "object")
        switch (y.$$typeof) {
          case d:
            return pt(y.render);
          case b:
            return Kt(y.type, D, W);
          case S: {
            var Z = y, le = Z._payload, de = Z._init;
            try {
              return Kt(de(le), D, W);
            } catch {
            }
          }
        }
      return "";
    }
    var It = Object.prototype.hasOwnProperty, Ba = {}, ha = I.ReactDebugCurrentFrame;
    function Lt(y) {
      if (y) {
        var D = y._owner, W = Kt(y.type, y._source, D ? D.type : null);
        ha.setExtraStackFrame(W);
      } else
        ha.setExtraStackFrame(null);
    }
    function Xt(y, D, W, Z, le) {
      {
        var de = Function.call.bind(It);
        for (var ie in y)
          if (de(y, ie)) {
            var re = void 0;
            try {
              if (typeof y[ie] != "function") {
                var Oe = Error((Z || "React class") + ": " + W + " type `" + ie + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof y[ie] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw Oe.name = "Invariant Violation", Oe;
              }
              re = y[ie](D, ie, Z, W, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (Ce) {
              re = Ce;
            }
            re && !(re instanceof Error) && (Lt(le), O("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", Z || "React class", W, ie, typeof re), Lt(null)), re instanceof Error && !(re.message in Ba) && (Ba[re.message] = !0, Lt(le), O("Failed %s type: %s", W, re.message), Lt(null));
          }
      }
    }
    var wr = Array.isArray;
    function ma(y) {
      return wr(y);
    }
    function pa(y) {
      {
        var D = typeof Symbol == "function" && Symbol.toStringTag, W = D && y[Symbol.toStringTag] || y.constructor.name || "Object";
        return W;
      }
    }
    function Pa(y) {
      try {
        return fa(y), !1;
      } catch {
        return !0;
      }
    }
    function fa(y) {
      return "" + y;
    }
    function Ia(y) {
      if (Pa(y))
        return O("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", pa(y)), fa(y);
    }
    var La = I.ReactCurrentOwner, _t = {
      key: !0,
      ref: !0,
      __self: !0,
      __source: !0
    }, Ft, Bi;
    function no(y) {
      if (It.call(y, "ref")) {
        var D = Object.getOwnPropertyDescriptor(y, "ref").get;
        if (D && D.isReactWarning)
          return !1;
      }
      return y.ref !== void 0;
    }
    function so(y) {
      if (It.call(y, "key")) {
        var D = Object.getOwnPropertyDescriptor(y, "key").get;
        if (D && D.isReactWarning)
          return !1;
      }
      return y.key !== void 0;
    }
    function oo(y, D) {
      typeof y.ref == "string" && La.current;
    }
    function lo(y, D) {
      {
        var W = function() {
          Ft || (Ft = !0, O("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", D));
        };
        W.isReactWarning = !0, Object.defineProperty(y, "key", {
          get: W,
          configurable: !0
        });
      }
    }
    function co(y, D) {
      {
        var W = function() {
          Bi || (Bi = !0, O("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", D));
        };
        W.isReactWarning = !0, Object.defineProperty(y, "ref", {
          get: W,
          configurable: !0
        });
      }
    }
    var uo = function(y, D, W, Z, le, de, ie) {
      var re = {
        // This tag allows us to uniquely identify this as a React Element
        $$typeof: e,
        // Built-in properties that belong on the element
        type: y,
        key: D,
        ref: W,
        props: ie,
        // Record the component responsible for creating this element.
        _owner: de
      };
      return re._store = {}, Object.defineProperty(re._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: !1
      }), Object.defineProperty(re, "_self", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: Z
      }), Object.defineProperty(re, "_source", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: le
      }), Object.freeze && (Object.freeze(re.props), Object.freeze(re)), re;
    };
    function ho(y, D, W, Z, le) {
      {
        var de, ie = {}, re = null, Oe = null;
        W !== void 0 && (Ia(W), re = "" + W), so(D) && (Ia(D.key), re = "" + D.key), no(D) && (Oe = D.ref, oo(D, le));
        for (de in D)
          It.call(D, de) && !_t.hasOwnProperty(de) && (ie[de] = D[de]);
        if (y && y.defaultProps) {
          var Ce = y.defaultProps;
          for (de in Ce)
            ie[de] === void 0 && (ie[de] = Ce[de]);
        }
        if (re || Oe) {
          var qe = typeof y == "function" ? y.displayName || y.name || "Unknown" : y;
          re && lo(ie, qe), Oe && co(ie, qe);
        }
        return uo(y, re, Oe, le, Z, La.current, ie);
      }
    }
    var Ar = I.ReactCurrentOwner, Pi = I.ReactDebugCurrentFrame;
    function Zt(y) {
      if (y) {
        var D = y._owner, W = Kt(y.type, y._source, D ? D.type : null);
        Pi.setExtraStackFrame(W);
      } else
        Pi.setExtraStackFrame(null);
    }
    var Sr;
    Sr = !1;
    function kr(y) {
      return typeof y == "object" && y !== null && y.$$typeof === e;
    }
    function Ii() {
      {
        if (Ar.current) {
          var y = Pe(Ar.current.type);
          if (y)
            return `

Check the render method of \`` + y + "`.";
        }
        return "";
      }
    }
    function mo(y) {
      return "";
    }
    var Li = {};
    function po(y) {
      {
        var D = Ii();
        if (!D) {
          var W = typeof y == "string" ? y : y.displayName || y.name;
          W && (D = `

Check the top-level render call using <` + W + ">.");
        }
        return D;
      }
    }
    function Fi(y, D) {
      {
        if (!y._store || y._store.validated || y.key != null)
          return;
        y._store.validated = !0;
        var W = po(D);
        if (Li[W])
          return;
        Li[W] = !0;
        var Z = "";
        y && y._owner && y._owner !== Ar.current && (Z = " It was passed a child from " + Pe(y._owner.type) + "."), Zt(y), O('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', W, Z), Zt(null);
      }
    }
    function Ni(y, D) {
      {
        if (typeof y != "object")
          return;
        if (ma(y))
          for (var W = 0; W < y.length; W++) {
            var Z = y[W];
            kr(Z) && Fi(Z, D);
          }
        else if (kr(y))
          y._store && (y._store.validated = !0);
        else if (y) {
          var le = N(y);
          if (typeof le == "function" && le !== y.entries)
            for (var de = le.call(y), ie; !(ie = de.next()).done; )
              kr(ie.value) && Fi(ie.value, D);
        }
      }
    }
    function fo(y) {
      {
        var D = y.type;
        if (D == null || typeof D == "string")
          return;
        var W;
        if (typeof D == "function")
          W = D.propTypes;
        else if (typeof D == "object" && (D.$$typeof === d || // Note: Memo only checks outer props here.
        // Inner props are checked in the reconciler.
        D.$$typeof === b))
          W = D.propTypes;
        else
          return;
        if (W) {
          var Z = Pe(D);
          Xt(W, y.props, "prop", Z, y);
        } else if (D.PropTypes !== void 0 && !Sr) {
          Sr = !0;
          var le = Pe(D);
          O("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", le || "Unknown");
        }
        typeof D.getDefaultProps == "function" && !D.getDefaultProps.isReactClassApproved && O("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
      }
    }
    function go(y) {
      {
        for (var D = Object.keys(y.props), W = 0; W < D.length; W++) {
          var Z = D[W];
          if (Z !== "children" && Z !== "key") {
            Zt(y), O("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", Z), Zt(null);
            break;
          }
        }
        y.ref !== null && (Zt(y), O("Invalid attribute `ref` supplied to `React.Fragment`."), Zt(null));
      }
    }
    var Oi = {};
    function Hi(y, D, W, Z, le, de) {
      {
        var ie = me(y);
        if (!ie) {
          var re = "";
          (y === void 0 || typeof y == "object" && y !== null && Object.keys(y).length === 0) && (re += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var Oe = mo();
          Oe ? re += Oe : re += Ii();
          var Ce;
          y === null ? Ce = "null" : ma(y) ? Ce = "array" : y !== void 0 && y.$$typeof === e ? (Ce = "<" + (Pe(y.type) || "Unknown") + " />", re = " Did you accidentally export a JSX literal instead of a component?") : Ce = typeof y, O("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", Ce, re);
        }
        var qe = ho(y, D, W, le, de);
        if (qe == null)
          return qe;
        if (ie) {
          var tt = D.children;
          if (tt !== void 0)
            if (Z)
              if (ma(tt)) {
                for (var Jt = 0; Jt < tt.length; Jt++)
                  Ni(tt[Jt], y);
                Object.freeze && Object.freeze(tt);
              } else
                O("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
            else
              Ni(tt, y);
        }
        if (It.call(D, "key")) {
          var Nt = Pe(y), Ge = Object.keys(D).filter(function(Ao) {
            return Ao !== "key";
          }), Cr = Ge.length > 0 ? "{key: someKey, " + Ge.join(": ..., ") + ": ...}" : "{key: someKey}";
          if (!Oi[Nt + Cr]) {
            var wo = Ge.length > 0 ? "{" + Ge.join(": ..., ") + ": ...}" : "{}";
            O(`A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`, Cr, Nt, wo, Nt), Oi[Nt + Cr] = !0;
          }
        }
        return y === r ? go(qe) : fo(qe), qe;
      }
    }
    function vo(y, D, W) {
      return Hi(y, D, W, !0);
    }
    function bo(y, D, W) {
      return Hi(y, D, W, !1);
    }
    var yo = bo, xo = vo;
    va.Fragment = r, va.jsx = yo, va.jsxs = xo;
  })()), va;
}
var Gi;
function qo() {
  return Gi || (Gi = 1, process.env.NODE_ENV === "production" ? Fa.exports = Mo() : Fa.exports = zo()), Fa.exports;
}
var o = qo();
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const jo = (a) => a.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), Yn = (...a) => a.filter((e, t, r) => !!e && e.trim() !== "" && r.indexOf(e) === t).join(" ").trim();
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var Eo = {
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
const Ro = Hn(
  ({
    color: a = "currentColor",
    size: e = 24,
    strokeWidth: t = 2,
    absoluteStrokeWidth: r,
    className: i = "",
    children: n,
    iconNode: l,
    ...u
  }, d) => Vr(
    "svg",
    {
      ref: d,
      ...Eo,
      width: e,
      height: e,
      stroke: a,
      strokeWidth: r ? Number(t) * 24 / Number(e) : t,
      className: Yn("lucide", i),
      ...u
    },
    [
      ...l.map(([p, f]) => Vr(p, f)),
      ...Array.isArray(n) ? n : [n]
    ]
  )
);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ie = (a, e) => {
  const t = Hn(
    ({ className: r, ...i }, n) => Vr(Ro, {
      ref: n,
      iconNode: e,
      className: Yn(`lucide-${jo(a)}`, r),
      ...i
    })
  );
  return t.displayName = `${a}`, t;
};
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Do = Ie("ArrowRight", [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Kn = Ie("BookOpen", [
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
const Xn = Ie("Building2", [
  ["path", { d: "M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z", key: "1b4qmf" }],
  ["path", { d: "M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2", key: "i71pzd" }],
  ["path", { d: "M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2", key: "10jefs" }],
  ["path", { d: "M10 6h4", key: "1itunk" }],
  ["path", { d: "M10 10h4", key: "tcdvrf" }],
  ["path", { d: "M10 14h4", key: "kelpxr" }],
  ["path", { d: "M10 18h4", key: "1ulq68" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const _n = Ie("Compass", [
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
const Bo = Ie("Grid2x2", [
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
const Po = Ie("House", [
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
const Zn = Ie("Lightbulb", [
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
const Jn = Ie("Map", [
  [
    "path",
    {
      d: "M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z",
      key: "169xi5"
    }
  ],
  ["path", { d: "M15 5.764v15", key: "1pn4in" }],
  ["path", { d: "M9 3.236v15", key: "1uimfh" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Za = Ie("Mountain", [
  ["path", { d: "m8 3 4 8 5-5 5 15H2L8 3z", key: "otkl63" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Qn = Ie("Navigation", [
  ["polygon", { points: "3 11 22 2 13 21 11 13 3 11", key: "1ltx0t" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Io = Ie("Redo2", [
  ["path", { d: "m15 14 5-5-5-5", key: "12vg1m" }],
  ["path", { d: "M20 9H9.5A5.5 5.5 0 0 0 4 14.5A5.5 5.5 0 0 0 9.5 20H13", key: "6uklza" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Lo = Ie("RotateCcw", [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Fo = Ie("Search", [
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }],
  ["path", { d: "m21 21-4.3-4.3", key: "1qie3q" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const No = Ie("Share2", [
  ["circle", { cx: "18", cy: "5", r: "3", key: "gq8acd" }],
  ["circle", { cx: "6", cy: "12", r: "3", key: "w7nqdw" }],
  ["circle", { cx: "18", cy: "19", r: "3", key: "1xt0gg" }],
  ["line", { x1: "8.59", x2: "15.42", y1: "13.51", y2: "17.49", key: "47mynk" }],
  ["line", { x1: "15.41", x2: "8.59", y1: "6.51", y2: "10.49", key: "1n3mei" }]
]);
/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Oo = Ie("Target", [
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
const Ho = Ie("Triangle", [
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
const $o = Ie("Trophy", [
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
const Wo = Ie("Undo2", [
  ["path", { d: "M9 14 4 9l5-5", key: "102s5s" }],
  ["path", { d: "M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11", key: "f3b9sd" }]
]), Uo = {
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
}, A = (a, e, t, r, i, n) => {
  const l = (u) => {
    const [d, p, f] = u.split(" :: ");
    return { title: d, setup: p, result: f };
  };
  return { principle: a, method: e, caution: t, examples: [l(r), l(i), l(n)] };
}, ir = {
  "differential-equations": {
    laplace: A("The Laplace transform converts a time-domain initial-value differential equation into an algebraic relation in s. Delayed forcing carries an exponential factor e^(-sτ).", "For y′+ay=b u(t−τ), transform to (s+a)Y(s)=y₀+b e^(-sτ)/s; invert the initial decay and delayed response separately.", "Transforms need convergence assumptions; a formula for this constant-coefficient family does not solve arbitrary nonlinear equations.", "Unforced decay :: y′+2y=0, y₀=3. :: Y=3/(s+2), so y=3e^(-2t).", "Step forcing :: y′+2y=4u(t), y₀=0. :: y=2(1-e^(-2t)) for t≥0.", "Delayed switch :: Same forcing starts at τ=1. :: Response is zero before 1 and 2(1-e^(-2(t−1))) afterward."),
    pde: A("A partial differential equation relates derivatives in several independent variables. Separated sine modes satisfy homogeneous Dirichlet boundaries on a finite interval.", "For heat, multiply sin(nπx/L) by exp(−κ(nπ/L)²t). For a wave with zero initial velocity, multiply it by cos(cnπt/L).", "A separated mode is one special solution. General initial data require a convergent series of modes; boundary and initial conditions determine coefficients.", "Heat mode :: L=π, n=1, κ=1, amplitude=1. :: u=e^(−t)sin x.", "Wave mode :: L=π, n=2, c=1. :: u=cos(2t)sin(2x), with zero initial velocity.", "Boundary check :: Evaluate any sine mode at x=0 and x=L. :: Both values are zero for integer n."),
    "boundary-values": A("Boundary-value problems prescribe values at different spatial points, rather than all data at one initial point. Nonzero solutions of an eigenvalue problem exist only at allowed spectral values.", "For −u″=λu with u(0)=u(L)=0, use sine solutions: λₙ=(nπ/L)² and uₙ=A sin(nπx/L), n≥1.", "A zero function satisfies the homogeneous equation for every λ; an eigenfunction must be nonzero. Other boundary conditions give different spectra.", "First mode :: L=π, n=1. :: λ=1 and u=sin x.", "Second mode :: L=π, n=2. :: λ=4 and u=sin(2x), with one interior zero.", "Interval scale :: Double L with fixed n. :: λ_new=λ_old/4; the eigenvalue becomes one quarter as large."),
    home: A("A differential equation relates an unknown function to its rates of change. Its order is the highest derivative; a family of solutions becomes one trajectory when enough initial conditions are supplied.", "Start by identifying order, linearity, and the source of each term. Use a slope field or phase portrait to check that the predicted behavior agrees with the equation.", "A numerical curve that looks plausible is not proof: substitute it into the equation and check initial data.", "Cooling tea :: T′=-0.2(T-22), T(0)=82 °C. :: T(t)=22+60e^(-0.2t); the temperature approaches 22 °C.", "Bank balance :: B′=0.05B with B(0)=1000. :: B(t)=1000e^(0.05t); growth is proportional to the balance.", "Spring :: x″+4x=0, x(0)=1, x′(0)=0. :: x(t)=cos(2t); the natural period is π."),
    explorer: A("Order counts the highest derivative, while linearity asks whether y and its derivatives appear only to the first power with coefficients depending on the independent variable. A general solution carries arbitrary constants; an initial value fixes them.", "Rewrite the equation in standard form before classifying it. For a first-order equation, compare the right-hand side with f(x)g(y), P(x)y+Q(x), and Mdx+Ndy structures.", "A nonlinear forcing function of x alone does not make an equation nonlinear in y.", "Drug elimination :: C′=-0.3C is first-order linear and separable. :: C(t)=C₀e^(-0.3t); one initial concentration fixes C₀.", "Damped spring :: x″+2x′+5x=0 is second-order linear. :: Two independent initial values, position and velocity, select a motion.", "Crowded population :: P′=rP(1-P/K) is first-order nonlinear. :: The P² term breaks linearity and K is an equilibrium."),
    "slope-fields": A("For y′=f(x,y), each point (x,y) gets a small line segment of slope f(x,y). A solution curve is tangent to every segment it passes through; equilibrium curves have zero slope.", "Evaluate f at a grid of points, draw short equal-length ticks, then trace curves following their direction. Compare several initial points to see the solution family.", "A direction field shows local slope, not the speed along a parametrized trajectory.", "Exponential growth :: y′=y has horizontal ticks at y=0. :: Curves above zero rise, and y=Ce^x stays tangent to the field.", "Cooling field :: T′=-0.2(T-20). :: T=20 is horizontal; trajectories above it slope down and below it slope up.", "Slope depends on x :: y′=x gives the same tick across each vertical line. :: Integrating yields y=x²/2+C, a family of parabolas."),
    "initial-value": A("An initial value problem pairs an ODE with data such as y(x₀)=y₀. Under local continuity and a suitable Lipschitz condition in y, the initial point determines one nearby solution.", "Solve for the arbitrary constant after obtaining a general family, or start a numerical integrator exactly at (x₀,y₀). Verify both the equation and the initial condition.", "For a second-order equation one position alone is usually insufficient; velocity is also needed.", "Cooling :: T′=-0.1(T-20), T(0)=80. :: T(t)=20+60e^(-0.1t).", "Falling with drag :: v′=10-2v, v(0)=0. :: v(t)=5(1-e^(-2t)); terminal speed is 5.", "Second-order launch :: x″=-9.8, x(0)=0, x′(0)=20. :: x(t)=20t-4.9t²; both initial data are used."),
    separable: A("An equation y′=f(x)g(y) is separable where g(y) is nonzero: dy/g(y)=f(x)dx. Integrating both sides produces an implicit or explicit solution family.", "Find equilibria from g(y)=0 before dividing, then separate and integrate. Apply an initial value only after retaining the possible constant solutions.", "Dividing by y can discard y=0, which may be a valid solution.", "Population :: P′=0.4P, P(0)=50. :: ln|P|=0.4t+C gives P=50e^(0.4t).", "Mixing :: y′=xy, y(0)=2. :: ln|y|=x²/2+C gives y=2e^(x²/2).", "Saturation :: y′=y(1-y), y(0)=1/2. :: Partial fractions give y=1/(1+e^(-t)); y=0 and y=1 are equilibria."),
    "homogeneous-first-order": A("A first-order slope f(x,y) is homogeneous of degree zero when f(tx,ty)=f(x,y). Then it depends only on y/x, so y=vx reduces the equation to one in v and x.", "Set v=y/x and use y′=v+xv′. After substitution, separate the resulting equation, integrate, and replace v by y/x.", "This use of 'homogeneous' differs from the zero-forcing term in linear ODEs; the substitution also requires x≠0.", "Scale-invariant field :: y′=y/x, x>0. :: v+xv′=v, so v=C and y=Cx.", "Mixed ray slope :: y′=1+y/x. :: xv′=1; v=ln x+C, giving y=x(ln x+C).", "Quadratic ratio :: y′=(x²+y²)/(xy). :: With v=y/x, xv′=1/v; v²=2ln|x|+C."),
    exact: A("M(x,y)dx+N(x,y)dy=0 is exact when it is dF=0 for a potential F. On a simply connected region with continuous partials, M_y=N_x is the local test.", "Integrate M in x to get F(x,y)=∫Mdx+g(y), differentiate in y, and choose g so F_y=N. The solution is F(x,y)=C.", "The matching-partials test can fail to guarantee one global potential if the domain has a hole.", "Circular levels :: 2x dx+2y dy=0. :: M_y=N_x=0; F=x²+y² and solutions are circles x²+y²=C.", "Product levels :: y dx+x dy=0. :: F=xy, so xy=C; the field follows hyperbolas.", "Missing y term :: (2xy+3)dx+(x²+4y)dy=0. :: Integrate M: F=x²y+3x+g(y); g′=4y, so F=x²y+3x+2y²=C."),
    "linear-first-order": A("The standard linear equation y′+P(x)y=Q(x) has an integrating factor μ=e^(∫P dx). Multiplication makes the left side (μy)′.", "Identify P and Q, compute μ, integrate μQ, then divide by μ. Check the result by differentiation and apply initial data.", "Normalize the coefficient of y′ first; an equation can be linear even when P(x) is not constant.", "Charging circuit :: q′+2q=6, q(0)=0. :: μ=e^(2t); q=3(1-e^(-2t)).", "Variable coefficient :: y′+(1/x)y=x for x>0. :: μ=x; (xy)′=x², so y=x²/3+C/x.", "Decay with input :: y′+y=e^(-t), y(0)=0. :: (e^t y)′=1, hence y=te^(-t)."),
    bernoulli: A("A Bernoulli equation y′+P(x)y=Q(x)yⁿ is nonlinear for n other than 0 or 1 but becomes linear under v=y^(1-n).", "Multiply by (1-n)y^(-n), use v′=(1-n)y^(-n)y′, solve the new first-order linear equation, then substitute back.", "The transformation may divide by y; check y=0 separately and restrict the domain when fractional powers occur.", "Quadratic response :: y′+y=y². :: Let v=1/y; v′-v=-1, so v=1+Ce^t and y=1/(1+Ce^t).", "Inverse decay :: y′-2y=3y³. :: v=y^(-2) gives v′+4v=-6, a linear equation.", "Degenerate case :: y′+2y=3y with n=1. :: This is already linear: y′=y, so y=Ce^t."),
    "method-selector": A("A solving method follows the equation's structure. More than one label may apply; choose the method that produces the simplest valid transformation.", "Test separability, homogeneous ratio y/x, exactness, linear standard form, and Bernoulli power in that order. State the required domain and verify the result.", "Do not classify by appearance alone: multiplying an equation by a factor can reveal exactness or separability.", "Tank concentration :: C′=-kC. :: Separable and linear; separation immediately gives C=C₀e^(-kt).", "Implicit contour :: 2xy dx+x²dy=0. :: M_y=N_x=2x, so exactness gives x²y=C.", "Nonlinear power :: y′+y=xy². :: Bernoulli n=2; v=1/y converts it to a linear equation."),
    euler: A("Euler's method advances y′=f(x,y) by y_(n+1)=y_n+h f(x_n,y_n). It follows the starting tangent for a whole step, so curvature creates truncation error.", "Evaluate the slope at the current point, multiply by step h, update x and y, and repeat. Halving h generally reduces first-order global error by about a factor of two.", "A small step does not guarantee stability for every equation; stiff decay can make explicit Euler oscillate or blow up.", "Growth :: y′=y, y(0)=1, h=0.1. :: First step y₁=1.1; exact e^0.1≈1.1052.", "Cooling :: T′=-0.2(T-20), T₀=80, h=1. :: Slope is -12 °C/min; Euler predicts T₁=68 °C.", "Stability :: y′=-10y, h=0.3. :: Update factor 1-10h=-2, so numerical values alternate and grow despite exact decay."),
    heun: A("Heun's improved Euler method predicts an endpoint with Euler and averages the slopes at the start and predicted endpoint. It is an explicit second-order Runge–Kutta method.", "Compute k₁=f(x_n,y_n), y*=y_n+hk₁, k₂=f(x_n+h,y*), then y_(n+1)=y_n+h(k₁+k₂)/2.", "The second slope uses the predicted endpoint, not an exact future value.", "Growth :: y′=y, y₀=1, h=0.1. :: k₁=1, y*=1.1, k₂=1.1; y₁=1.105, close to e^0.1.", "Constant acceleration :: v′=2t, v(0)=0, h=1. :: Start/end slopes 0 and 2 average to 1; v₁=1, exact here.", "Cooling :: T′=-0.2(T-20), T₀=80, h=1. :: Predictor 68 gives end slope -9.6; corrected T₁=69.2."),
    rk4: A("Classical RK4 samples four slopes: at the start, twice near the midpoint, and at the endpoint. Weighted average (k₁+2k₂+2k₃+k₄)/6 gives fourth-order global accuracy for smooth problems.", "Use k₁=f(x,y), k₂=f(x+h/2,y+hk₁/2), k₃=f(x+h/2,y+hk₂/2), k₄=f(x+h,y+hk₃), then advance by h times their weighted mean.", "Fourth-order accuracy does not remove stability restrictions or guarantee accuracy at discontinuities.", "Growth :: y′=y, y₀=1, h=0.1. :: RK4 gives 1.1051708, agreeing with e^0.1 to displayed precision.", "Cooling :: T′=-0.2(T-20), T₀=80, h=1. :: RK4 gives about 69.124 °C; exact value is 20+60e^(-0.2).", "Oscillation :: y″=-y becomes (y,v)′=(v,-y). :: RK4 follows the circular phase trajectory more closely than Euler at equal h."),
    "growth-models": A("Exponential growth P′=rP assumes a constant per-capita rate. Logistic growth P′=rP(1-P/K) reduces that rate as population approaches carrying capacity K.", "Find equilibria first, separate variables or integrate numerically, then compare early-time growth with the limiting behavior.", "K is an environmental model parameter, not a fixed law; changing resources changes the forecast.", "Bacteria :: P′=0.4P, P(0)=100. :: After 5 hours P=100e²≈739 cells in the idealized model.", "Resource limit :: P′=0.4P(1-P/1000), P(0)=100. :: P(t)=1000/(1+9e^(-0.4t)); growth slows near 1000.", "Drug clearance :: C′=-0.3C, C(0)=20. :: The half-life is ln2/0.3≈2.31 time units."),
    "higher-order-linear": A("A constant-coefficient equation ay″+by′+cy=0 has characteristic polynomial ar²+br+c. Distinct real roots give exponentials, a repeated root adds xe^(rx), and complex roots give damped sine and cosine.", "Find roots, choose the matching basis of independent solutions, then solve constants from position and derivative initial data.", "A repeated root does not give two copies of the same exponential; the second independent solution needs x.", "Two decay rates :: y″+3y′+2y=0. :: Roots -1,-2 yield y=C₁e^(-t)+C₂e^(-2t).", "Repeated root :: y″+2y′+y=0. :: (r+1)²=0 gives y=(C₁+C₂t)e^(-t).", "Oscillation :: y″+4y=0, y(0)=1, y′(0)=0. :: Roots ±2i give y=cos(2t)."),
    "undetermined-coefficients": A("For constant-coefficient linear ODEs with polynomial, exponential, sine, or cosine forcing, a finite trial family is closed under differentiation. Substitute a matching trial for the particular solution.", "Find y_h, choose a trial matching the forcing, multiply by t enough times if it overlaps y_h, solve coefficients, and set y=y_h+y_p.", "This method does not generally handle arbitrary forcing such as ln t or tan t; use variation of parameters instead.", "Constant input :: y″+y=1. :: Trial y_p=A gives A=1, so y=C₁cos t+C₂sin t+1.", "Resonance :: y″+y=cos t. :: Cos t belongs to y_h; trial t(A sin t+B cos t) yields y_p=(t/2)sin t.", "Exponential forcing :: y′+2y=e^t. :: Trial Ae^t gives 3A=1, so y_p=e^t/3."),
    "variation-of-parameters": A("Variation of parameters works for general forcing in a linear equation y″+p(x)y′+q(x)y=g(x). It lets the homogeneous coefficients vary with x.", "For independent y₁,y₂ and W=y₁y₂′-y₁′y₂, compute u₁′=-y₂g/W and u₂′=y₁g/W, then y_p=u₁y₁+u₂y₂.", "First divide by the coefficient of y″; the formulas assume the normalized forcing g and W≠0 on the interval.", "Non-polynomial input :: y″+y=sec t on |t|<π/2. :: With y₁=cos t, y₂=sin t, W=1; the method integrates -tan t and 1.", "Constant input :: y″+y=1. :: Integrals give a particular solution y_p=1, matching undetermined coefficients.", "Exponential input :: y″-y=e^(2t). :: y₁=e^t, y₂=e^(-t); a particular solution is e^(2t)/3."),
    "cauchy-euler": A("In a Cauchy–Euler equation x²y″+axy′+by=0, powers y=x^m are eigenfunctions of the differential operator. Substitution gives m(m-1)+am+b=0.", "Solve the indicial quadratic. Distinct real roots give x^m; a repeated root adds x^m ln x; complex roots yield powers times sin and cos of ln x.", "Use an interval excluding x=0; ln x formulas conventionally work on x>0.", "Distinct powers :: x²y″-2xy′+2y=0. :: m²-3m+2=0, so y=C₁x+C₂x².", "Repeated power :: x²y″-xy′+y=0. :: (m-1)²=0, so y=x(C₁+C₂ln x).", "Log oscillation :: x²y″+xy′+y=0. :: m²+1=0, so y=C₁cos(ln x)+C₂sin(ln x)."),
    systems: A("A linear system z′=Az is governed by the eigenvalues and eigenvectors of A. Real parts control growth or decay; imaginary parts create rotation in phase space.", "Compute trace, determinant, and eigenvalues, then sketch invariant directions and trajectories. Use z(0) to select a particular solution.", "A zero real part alone is inconclusive for nonlinear systems; linearization can require higher-order analysis.", "Saddle :: A=diag(1,-2). :: x=C₁e^t grows while y=C₂e^(-2t) decays; axes are invariant.", "Stable node :: A=diag(-1,-3). :: Both components decay toward the origin.", "Center :: A=[[0,-1],[1,0]]. :: Eigenvalues ±i yield circular trajectories with constant radius."),
    "phase-plane": A("The phase plane places a system's state (x,y) at one point and draws vector arrows (x′,y′). A trajectory follows the arrows as time advances.", "Find equilibria by solving x′=y′=0, inspect the Jacobian near each, and trace several initial states to see basins and invariant curves.", "Trajectories of a well-posed autonomous system cannot cross at the same state and time direction.", "Predator–prey :: x′=x(1-y), y′=y(x-1). :: (1,1) is an equilibrium surrounded by cycles in this ideal model.", "Damped spring :: x′=v, v′=-x-0.2v. :: Trajectories spiral inward as energy dissipates.", "Saddle :: x′=x, y′=-y. :: Initial states move away along x and toward zero along y."),
    "mechanical-oscillations": A("A mass–spring–damper obeys mx″+cx′+kx=F(t). The undamped natural frequency is √(k/m); ζ=c/(2√(mk)) separates underdamped, critical, and overdamped motion.", "Set m,k,c and initial displacement/velocity. Compare the roots of mr²+cr+k with the animation and the x(t) graph.", "Critical damping returns fastest without oscillation for this linear model; larger damping returns more slowly.", "Car suspension :: m=1,c=0.4,k=4. :: ζ=0.1; the motion oscillates while its envelope decays.", "Critical return :: m=1,k=4,c=4. :: ζ=1; the spring returns without overshoot.", "Undamped clock :: m=1,c=0,k=4. :: ω₀=2 rad/s and period π s."),
    "lcr-circuit": A("A series LCR circuit follows Lq″+Rq′+q/C=E(t), where charge q is analogous to displacement, inductance L to mass, R to damping, and 1/C to stiffness.", "Compute natural angular frequency 1/√(LC) and damping ratio (R/2)√(C/L). Current is i=q′; inspect both charge and current when changing R.", "A charge peak is not a current peak: current is the time derivative of charge.", "Underdamped circuit :: L=1 H,C=0.25 F,R=1 Ω. :: ω₀=2 rad/s, ζ=0.25; charge rings down.", "Critical resistance :: L=1 H,C=0.25 F. :: R_crit=2√(L/C)=4 Ω.", "Initial capacitor :: q(0)=1 C,i(0)=0,E=0. :: Energy begins in the capacitor, then exchanges with the inductor."),
    "newton-cooling": A("Newton's law models the rate of temperature change as T′=-k(T-T_a), where T_a is the ambient temperature and k>0 summarizes heat-transfer conditions.", "Separate or solve the linear equation: T(t)=T_a+(T₀-T_a)e^(-kt). The temperature gap halves after ln2/k.", "The model assumes a roughly constant ambient temperature and heat-transfer coefficient; a changing room needs a different forcing term.", "Hot coffee :: T₀=80 °C,T_a=20 °C,k=0.1/min. :: After 10 min, T≈42.1 °C.", "Warming bottle :: T₀=5 °C,T_a=25 °C,k=0.2/min. :: After 5 min, T≈17.6 °C, approaching from below.", "Half-gap time :: k=0.14/min. :: t_half=ln2/0.14≈4.95 min, independent of starting gap.")
  },
  geometry: {
    shapes: A("A shape is defined by geometric constraints, dimensions, and position. Perimeter and surface area measure boundary; area and volume measure occupied space. Scaling every length by k multiplies area by k² and volume by k³.", "Identify whether the object is a 2D figure or 3D solid, name the dimensions and units, then choose a formula derived from its construction. Check the result by decomposing it into familiar pieces or by changing one dimension in the explorer.", "A line segment has length but zero area; a flat circle has area but zero 3D volume. Surface area and volume use different powers of the length unit.", "Garden rectangle :: A 6 m by 4 m plot needs fencing and turf. :: Perimeter is 2(6+4)=20 m; area is 6·4=24 m².", "Water tank :: A cylinder has radius 2 m and height 3 m. :: Capacity is πr²h=12π m³≈37.7 m³; closed surface area is 2πr(r+h)=20π m².", "Scaled model :: A cube's side changes from 2 cm to 4 cm. :: Volume rises from 8 cm³ to 64 cm³, an eightfold increase because the scale factor is 2."),
    segment: A("A circular segment is the region between a chord and its arc. For a minor segment with radius r and central angle θ in radians, area is r²(θ−sinθ)/2: sector area minus the isosceles triangle.", "Measure radius and central angle, convert degrees to radians, compute sector and triangle areas separately, then subtract. Chord length is 2r sin(θ/2), and the segment height is r[1−cos(θ/2)].", "The area formula needs θ in radians. A major segment has area πr² minus the corresponding minor segment.", "Bridge arch :: A circular arch has r=10 m and θ=60°. :: The segment area is 50(π/3−√3/2)≈9.06 m².", "Lens chord :: A circular lens edge has r=10 cm and θ=60°. :: Chord length is 20sin30°=10 cm; segment height is 10(1−cos30°)≈1.34 cm.", "Major cap :: A disk has r=10 cm and its minor segment has θ=60°. :: Major segment area is 100π−9.06≈305.10 cm²."),
    home: A("Geometry studies properties that survive a construction or transformation. A useful investigation starts with a conjecture from measurement and ends with a reason it must hold.", "Drag dependent points, track invariant lengths and angles, then connect the picture to a congruence, similarity, or coordinate argument.", "A diagram can suggest a theorem but cannot prove it for every configuration.", "Bridge brace :: A triangular brace with sides 3,4,5 is rigid by SSS. :: Moving the frame without changing sides preserves its angles.", "Floor plan :: A 6 m by 4 m room has area 24 m². :: Doubling both dimensions quadruples area to 96 m².", "Wheel :: A wheel of radius 0.35 m travels 2πr≈2.20 m per revolution. :: Radius is a measurement, circumference is a derived distance."),
    construction: A("A geometric construction records dependencies: a midpoint depends on endpoints, and a perpendicular bisector depends on a segment. Dragging a parent recomputes all children while preserving the defining constraints.", "Create free points first, attach lines or circles to them, then test each invariant by dragging the free points. Identify which object is constrained by which theorem.", "A point that merely looks centered is not a constructed midpoint unless its dependency enforces equal halves.", "Perpendicular bisector :: Segment AB runs from (0,0) to (4,0). :: Midpoint is (2,0); its perpendicular bisector is x=2.", "Circle through a point :: Center O=(1,1), A=(4,5). :: Radius OA=5; every point on the circle stays 5 units from O.", "Angle bisector :: A 60° angle is bisected by a ray. :: The dependent rays each form 30° with the original sides."),
    triangles: A("Triangle rigidity follows from three non-collinear sides. Congruence preserves all lengths and angles; similarity preserves angles and scales every length by one factor.", "Use SSS, SAS, ASA, or AAS for congruence, and AA or proportional sides for similarity. Centers arise from intersecting special lines: medians, perpendicular bisectors, or altitudes.", "SSA does not always determine a unique triangle; it can produce two configurations.", "Roof truss :: Sides 3,4,5 make a right triangle because 3²+4²=5². :: Area is 3·4/2=6 square units.", "Scale model :: A 2-3-4 triangle enlarged by factor 3 becomes 6-9-12. :: Perimeter triples while area grows ninefold.", "Centroid :: Vertices (0,0),(6,0),(0,3). :: Median intersection is ((0+6+0)/3,(0+0+3)/3)=(2,1)."),
    circles: A("A chord subtends a central angle twice the inscribed angle on the same arc. A tangent is perpendicular to the radius at contact, and secant products express power of a point.", "Identify the intercepted arc and whether the vertex lies at center, circle, or outside. Convert angle information to arcs before calculating lengths or areas.", "The inscribed-angle relation requires both angles to intercept the same arc.", "Clock face :: A 100° central arc gives a 50° inscribed angle. :: Moving the point around the opposite arc preserves 50°.", "Wheel sector :: r=6 cm and central angle 60°. :: Arc length is (60/360)·2π·6=2π cm; sector area is 6π cm².", "Tangent :: Circle center (0,0), contact (3,4). :: Radius vector (3,4); tangent direction can be (-4,3), whose dot product is zero."),
    polygons: A("An n-gon can be triangulated into n−2 triangles, so its interior-angle sum is (n−2)180°. For a regular polygon each exterior turn is 360°/n.", "Count sides and diagonals, decompose area into triangles, and test whether a regular interior angle can fit an integer number around a point for tessellation.", "A regular pentagon does not tile the plane by copies meeting edge to edge because 108° does not divide 360°.", "Hexagonal tile :: n=6 gives interior angle 120°. :: Three tiles meet around a point because 3·120°=360°.", "Octagon :: n=8 has angle sum 1080°. :: Number of diagonals is n(n−3)/2=20.", "Regular square :: Side 5 cm. :: Area 25 cm²; perimeter 20 cm; apothem 2.5 cm."),
    transformations: A("Translations, rotations, and reflections preserve distances and angles; they are isometries. A dilation of factor k preserves angles but multiplies lengths by |k| and areas by k².", "Represent a map by a rule or matrix, apply it to each vertex, then compare preimage and image. For compositions, respect order: applying A then B means B(A(P)).", "Reflection followed by rotation usually differs from rotation followed by reflection.", "Map pin :: Translate (2,3) by (-5,4). :: Image is (-3,7); segment lengths are unchanged.", "Quarter turn :: Rotate (3,1) 90° anticlockwise about origin. :: Image is (-1,3).", "Scale drawing :: Dilate a 3×4 rectangle by k=2. :: New dimensions 6×8; area rises from 12 to 48."),
    coordinate: A("Coordinates turn geometric relationships into algebra. Distance comes from Pythagoras, midpoint averages endpoints, and slope measures rise per horizontal run.", "For A(x₁,y₁), B(x₂,y₂), compute Δx,Δy; then distance √(Δx²+Δy²), midpoint ((x₁+x₂)/2,(y₁+y₂)/2), and slope Δy/Δx when Δx≠0.", "Vertical lines have undefined slope, not slope zero.", "City blocks :: A=(1,2), B=(4,6). :: Straight-line distance √(3²+4²)=5; midpoint (2.5,4).", "Road grade :: Rise 3 m over run 60 m. :: Slope 3/60=0.05, or a 5% grade.", "Equal-distance locus :: Points equidistant from (0,0) and (4,0). :: Squaring distances yields x=2, the perpendicular bisector."),
    measurement: A("Length is one-dimensional, area is two-dimensional, and volume is three-dimensional; scaling a figure by k changes these by k, k², and k³. Composite areas add, but internal edges do not add to outer perimeter.", "Choose units before calculating, decompose irregular figures into known shapes, and report uncertainty to match input precision.", "Adding the perimeters of pieces double-counts their shared boundary.", "L-shaped room :: A 6×4 rectangle loses a 2×1 corner. :: Area is 24−2=22 m².", "Scale map :: 1 cm represents 5 km; two towns are 3.2 cm apart. :: Actual distance is 16 km.", "Measurement uncertainty :: Length 10.0±0.1 cm and width 5.0±0.1 cm. :: Nominal area 50 cm²; uncertainty is approximately 1.5 cm² by first-order propagation."),
    proofs: A("A visual proof isolates an invariant such as conserved area, equal angles, or a similarity ratio. The figure supports the argument; the written logic states why each step holds for all valid configurations.", "List givens, state the desired claim, and justify each transition with a definition or theorem. Use rearrangement only when pieces neither overlap nor leave gaps.", "Measuring one picture to many decimal places is still experimental evidence, not a proof.", "Pythagoras :: Four copies of a right triangle with legs a,b surround a center square. :: Comparing outer area gives a²+b²=c².", "Angle sum :: Draw a parallel through one triangle vertex. :: Alternate angles plus the vertex angle form a straight 180° line.", "Similarity :: Two triangles share angles 40° and 60°. :: Their third angles are 80° and AA establishes similarity; side ratios are equal."),
    solids: A("A solid's net preserves the area of each face but changes their spatial arrangement. Surface area sums exposed faces; volume measures the space inside.", "Identify the base and height, choose a volume formula, then unfold the surface to count lateral and base areas separately.", "Slant height is needed for cone and pyramid surface area, while perpendicular height determines volume.", "Shipping cube :: Side 3 cm. :: Volume 27 cm³ and surface area 54 cm².", "Water tank :: Cylinder radius 2 m, height 5 m. :: Volume πr²h=20π m³; curved area 2πrh=20π m².", "Cone :: Radius 3, height 4. :: Slant height 5; total area πr(r+l)=24π, volume 12π."),
    ar: A("AR geometry projects world points through a camera pose onto image pixels. To measure a physical length, the overlay needs a known scale or calibrated depth; apparent pixel length alone is insufficient.", "Anchor points to stable scene features, choose a reference measurement, and check camera movement before interpreting angles or lengths.", "Perspective makes parallel lines converge in the image, although they stay parallel in space.", "Room corner :: Calibrate a known 1 m floor edge spanning 200 px locally. :: A nearby 300 px edge is about 1.5 m at the same depth.", "Vertical wall :: A calibrated horizontal and vertical ray meet. :: Their world angle is 90° even if perspective distorts the image.", "Triangle overlay :: Measure sides 3,4,5 in one plane. :: The reconstructed angle opposite side 5 is 90°.")
  },
  trigonometry: {
    home: A("Trigonometry connects an angle to a point on the unit circle. Cosine is horizontal projection, sine is vertical projection, and tangent is their ratio where cosine is nonzero.", "Use a reference triangle or unit circle to establish sign and magnitude, then carry the same ratios into waves, bearings, and measurements.", "Angles measured in degrees and radians are interchangeable only after conversion; derivative formulas normally assume radians.", "Ladder :: A 5 m ladder at 60° reaches 5sin60°≈4.33 m high. :: Projection converts length to height.", "Rotating wheel :: A point of radius 2 at 30° has coordinates (√3,1). :: x=2cos30°, y=2sin30°.", "Wave :: y=3sin(2πt) has amplitude 3 and period 1 s. :: One circle rotation corresponds to one cycle."),
    "unit-circle": A("On the unit circle, the point at angle θ is (cosθ,sinθ). The signs come from the quadrant, and reference angles let one reuse first-quadrant exact values.", "Reduce an angle modulo 360° or 2π, find its reference angle, apply quadrant signs, and read coordinates. Use tanθ=sinθ/cosθ where defined.", "Tangent is undefined at 90° and 270° because cosθ=0.", "Reference angle :: θ=150° has reference angle 30°. :: (cosθ,sinθ)=(-√3/2,1/2).", "Full rotation :: 450° is coterminal with 90°. :: The terminal point is (0,1).", "Radians :: θ=5π/4. :: The point is (-√2/2,-√2/2), in quadrant III."),
    "right-triangle": A("For an acute angle in a right triangle, sin=opposite/hypotenuse, cos=adjacent/hypotenuse, and tan=opposite/adjacent. Similar triangles show these ratios depend on angle, not size.", "Label the sides relative to the chosen angle before selecting a ratio; use a²+b²=c² to recover a missing side.", "The word 'opposite' changes when the reference angle changes.", "Surveying :: A 30° sightline over 20 m horizontal ground. :: Height difference is 20tan30°≈11.55 m.", "Ladder :: Hypotenuse 10 m and wall reach 8 m. :: Ground distance √(10²−8²)=6 m.", "Special triangle :: A 30-60-90 triangle has hypotenuse 12. :: Short leg 6 and long leg 6√3."),
    graphs: A("For y=A sin(B(x−C))+D, |A| is amplitude, 2π/|B| is period, C is horizontal shift, and D is midline. Cosine starts at an extremum; tangent has period π and vertical asymptotes.", "Start from the parent function, scale vertically, adjust frequency, then shift. Mark midline, extrema, zeroes, and asymptotes before plotting.", "Tangent has no finite amplitude because it is unbounded.", "Daily temperature :: T(t)=20+5sin(2πt/24). :: Midline 20 °C, amplitude 5 °C, period 24 h.", "Compressed wave :: y=2cos(3x). :: Amplitude 2 and period 2π/3.", "Shifted wave :: y=sin(x−π/2). :: It equals −cos x and shifts π/2 to the right."),
    identities: A("An identity is true on every point of its domain. The unit-circle equation x²+y²=1 becomes cos²θ+sin²θ=1; angle-sum rules follow from composing rotations.", "Transform one side of an identity at a time using known identities, keeping domain restrictions explicit before cancelling or dividing.", "Checking a few angles cannot prove an identity; dividing by sinθ can also discard cases where sinθ=0.", "Pythagorean :: θ=30°. :: sin²θ+cos²θ=1/4+3/4=1.", "Double angle :: θ=30°. :: sin(60°)=2sin30°cos30°=√3/2.", "Angle sum :: sin(45°+45°). :: sin45°cos45°+cos45°sin45°=1."),
    inverse: A("Inverse trig functions return principal angles after restricting the original function to a one-to-one branch. Arcsin returns [-π/2,π/2], arccos [0,π], and arctan (-π/2,π/2).", "Check the input domain, find the reference angle, then select the principal value in the inverse function's range.", "arcsin(sinθ) need not equal θ outside the principal range.", "Slope angle :: Rise/run=1. :: arctan(1)=45°.", "Principal branch :: sin150°=1/2. :: arcsin(1/2)=30°, not 150°.", "Negative cosine :: arccos(-1/2). :: Principal value is 120°."),
    oblique: A("The sine law relates sides to opposite-angle sines; the cosine law extends Pythagoras to a non-right included angle. An SSA specification can admit zero, one, or two triangles.", "Use cosine law for SAS/SSS, sine law for AAS/ASA, and check both possible angles in SSA. For two sides and included angle use area ab sinC/2.", "The arcsin key returns one principal angle; SSA may also permit its supplement.", "Survey triangle :: a=7,b=10,C=60°. :: c²=49+100−140cos60°=79, so c≈8.89.", "Land area :: Sides 20 m and 30 m include 45°. :: Area=20·30·sin45°/2≈212.1 m².", "Ambiguous case :: a=6,b=10,A=30°. :: sinB=10sin30°/6=5/6; both B≈56.4° and 123.6° fit."),
    waves: A("A sinusoidal wave combines amplitude, frequency, and phase. Superposition adds displacements pointwise; nearby frequencies make beats with envelope frequency |f₁−f₂|.", "Write each signal as A sin(2πft+φ), add samples at the same time, and compare phase alignment, destructive interference, and Fourier harmonics.", "A beat frequency is the difference in frequencies, not their sum.", "Sound beat :: 440 Hz and 444 Hz tones. :: The loudness envelope pulses 4 times per second.", "Standing wave :: Two equal opposite-traveling waves. :: Their sum forms fixed nodes and oscillating antinodes.", "Second harmonic :: Fundamental 100 Hz. :: The second harmonic is 200 Hz and repeats twice per base cycle."),
    applications: A("Trigonometric ratios turn measured angles and known baselines into inaccessible heights and distances. Bearings require a stated reference direction; periodic models require a period and phase origin.", "Draw the right triangle or coordinate axes, label known values and units, choose sine/cosine/tangent, then check that the answer is geometrically plausible.", "An angle of elevation is measured from horizontal, not from the vertical wall.", "Building height :: Stand 30 m away and measure elevation 40°. :: Height above eye level is 30tan40°≈25.2 m.", "Navigation :: Travel 10 km at bearing 060° from north. :: East component 10sin60°≈8.66 km; north component 5 km.", "Tide :: Water height 2+1.5cos(2πt/12). :: Range is 0.5–3.5 m and cycle is 12 h."),
    ar: A("Camera-based trigonometry uses projected rays and a calibrated baseline to infer angles and lengths. The unit circle or triangle overlay visualizes ratios, but measurements depend on pose and scale.", "Calibrate horizontal distance, estimate an elevation angle from the camera, and apply h=d tanθ with an eye-height correction.", "A tilt or perspective error in the camera can dominate a small-angle height estimate.", "Tree :: Ground distance 12 m, elevation 35°, eye height 1.6 m. :: Tree height≈12tan35°+1.6≈10.0 m.", "Roof :: Ground distance 20 m, elevation 45°. :: Height above camera is 20 m.", "Wave projection :: Unit-circle marker rotates once in 2 s. :: The vertical screen trace is sinusoidal with frequency 0.5 Hz.")
  },
  "linear-algebra": {
    home: A("Linear algebra studies vectors and maps that preserve addition and scalar multiplication. Matrix columns tell where basis vectors go; their combinations determine every transformed point.", "Begin with vectors, then compose matrices, solve linear systems, and inspect eigenvectors or factorizations to understand a map's structure.", "A matrix is a representation of a map relative to chosen bases; its entries alone are not the whole geometry.", "Image rotation :: R=[[0,-1],[1,0]]. :: R(1,0)=(0,1), a quarter turn.", "Mixture :: 2x+y=7 and x−y=2. :: Row reduction gives x=3,y=1.", "Area scale :: A=[[2,0],[0,3]]. :: det A=6, so a unit square maps to area 6."),
    vectors: A("A vector encodes magnitude and direction. Dot product measures alignment and projection, while the 3D cross product gives a perpendicular direction whose length is parallelogram area.", "Add components coordinatewise; compute a·b=Σaᵢbᵢ, projection of a on b=(a·b/|b|²)b, and a×b by the determinant rule.", "A zero dot product means orthogonality only when the Euclidean inner product is being used.", "Wind and flight :: Airspeed (100,0) plus wind (0,20). :: Ground velocity (100,20), speed √10400≈102.", "Work :: Force (3,4) N moves an object (2,0) m. :: Work F·d=6 J; vertical force does no work here.", "Area :: a=(2,0,0), b=(0,3,0). :: |a×b|=6 square units."),
    matrices: A("Matrix multiplication composes linear maps; entry (i,j) is row i of A dotted with column j of B. The inverse reverses a nonsingular map, while transpose swaps rows and columns.", "Check dimensions before multiplying, compute products in order, and verify A A⁻¹=I when an inverse exists.", "AB generally differs from BA; reversing order reverses the sequence of transformations.", "Rotate then stretch :: R=[[0,-1],[1,0]], S=diag(2,1). :: SR(1,0)=(0,1), while RS(1,0)=(0,2).", "Image pixels :: A 2×2 brightness mixing matrix acts on RGB-free two-channel data. :: Multiplying A by each pixel column applies the same linear rule.", "Inverse :: A=diag(2,4). :: A⁻¹=diag(1/2,1/4), restoring scaled coordinates."),
    "row-reduction": A("Elementary row operations preserve a linear system's solution set. Pivots identify constrained variables; columns without pivots correspond to free parameters.", "Form [A|b], choose nonzero pivots, eliminate below and above, and inspect rows of zeros or contradictions before back-substitution.", "A row [0 0 | 1] means inconsistent, whereas [0 0 | 0] means an equation was redundant.", "Unique intersection :: x+y=5, x−y=1. :: Row reduction yields x=3,y=2.", "Parallel lines :: x+y=2, 2x+2y=5. :: Elimination produces 0=1; no solution.", "Infinite family :: x+y=2, 2x+2y=4. :: One pivot leaves y=2−x free."),
    "linear-transforms": A("A linear map obeys T(u+v)=T(u)+T(v) and T(cu)=cT(u), so T(0)=0. Its matrix columns are the images of basis vectors.", "Move the basis vectors, assemble them as columns, then apply the matrix to a point or shape. Use determinant to track signed area change.", "A translation is affine rather than linear because it moves the origin.", "Shear :: A=[[1,2],[0,1]]. :: A(1,1)=(3,1); area scale det A=1.", "Reflection :: Swap-coordinate matrix [[0,1],[1,0]]. :: (2,5) maps to (5,2), reflection across y=x.", "Collapse :: A=[[1,0],[0,0]]. :: Every point maps onto the x-axis; determinant 0."),
    determinants: A("The determinant is a signed area or volume scale. Its absolute value gives scale, sign gives orientation, and zero means the map collapses dimension.", "For 2×2, det[[a,b],[c,d]]=ad−bc. For higher dimensions, use elimination or cofactor expansion; det(AB)=det A det B.", "A negative determinant does not mean negative physical area; it records orientation reversal.", "Map scale :: A=diag(2,3). :: A unit square becomes area 6 because det A=6.", "Reflection :: A=diag(-1,1). :: det A=-1: area unchanged, orientation reversed.", "Dependent columns :: A=[[1,2],[2,4]]. :: det A=0, so the image of the unit square lies on a line."),
    "vector-spaces": A("A span is the set of all linear combinations of given vectors. Independence means no nontrivial combination gives zero; a basis is independent and spans the space.", "Place vectors as columns, row-reduce, and count pivots for rank. Express a target vector in basis coordinates by solving Bc=v.", "More vectors than the ambient dimension are necessarily dependent, but fewer vectors need not be independent.", "Plane basis :: (1,0,0) and (0,1,0). :: Their span is the xy-plane and has dimension 2.", "Dependent set :: (1,2) and (2,4). :: The second is twice the first, so rank is 1.", "Coordinates :: Basis b₁=(1,1), b₂=(1,-1), target (4,2). :: Solve c₁=3,c₂=1."),
    eigenvectors: A("An eigenvector v is a nonzero direction preserved by A: Av=λv. The eigenvalue λ tells the stretch or reversal along that direction.", "Solve det(A−λI)=0 for eigenvalues, then null(A−λI) for directions. Compare real and complex eigenvalues with the transformed grid and phase portrait.", "A rotation by 90° has no real eigenvector in the plane, though it has complex eigenvalues.", "Stretch :: A=diag(3,1/2). :: e₁ and e₂ are eigenvectors with λ=3 and 1/2.", "Reflection :: A=diag(1,-1). :: Along x the eigenvalue is 1; along y it is -1.", "Repeated eigenvalue :: A=[[2,1],[0,2]]. :: λ=2 twice but only one independent eigenvector."),
    orthogonality: A("Orthogonal vectors have dot product zero. Projection decomposes a vector into a component along a subspace and an orthogonal residual; orthonormal bases make coordinates dot products.", "Normalize the target direction u, compute (v·u)u, subtract it from v, and check the residual dot u is zero.", "Projection onto the zero vector is undefined because its squared length is zero.", "Ramp force :: F=(3,4), horizontal direction (1,0). :: Horizontal projection is (3,0); residual (0,4).", "Diagonal direction :: v=(3,1), u=(1,1). :: Projection is (2,2) and residual (1,-1).", "Pythagoras :: v=(3,4), basis axes. :: Orthogonal components have squared lengths 9+16=25."),
    "least-squares": A("When Ax=b has no exact solution, least squares minimizes ||Ax−b||². The fitted vector is the orthogonal projection of b onto the column space of A.", "Solve normal equations AᵀAx=Aᵀb when well-conditioned, or use QR/SVD for better numerical stability. Inspect residuals before trusting predictions.", "A low residual does not establish causation or justify extrapolation outside observed x-values.", "Line fit :: Points (0,1),(1,2),(2,2). :: Least-squares line is y≈1.167+0.5x.", "Overdetermined sensor :: Readings 4,5,6 for one constant value. :: Least-squares estimate is the mean 5.", "Projection :: A=(1,1)ᵀ, b=(2,0)ᵀ. :: Fitted vector is (1,1)ᵀ; residual (1,-1)ᵀ is orthogonal."),
    playground: A("Composing transformations lets one study how a grid, unit square, or 3D object changes under successive linear maps. Order matters unless the matrices commute.", "Start with a simple basis, apply one map at a time, compare the product matrix, and track determinant and eigen-directions after composition.", "Visual similarity of two transformed shapes does not imply the matrices are equal on every vector.", "Rotate then scale :: R90 followed by S=diag(2,1). :: (1,0) maps to (0,1), while reversing order maps it to (0,2).", "3D mirror :: diag(-1,1,1) reflects across the yz-plane. :: Volume magnitude is preserved, orientation flips.", "Two shears :: [[1,1],[0,1]] squared. :: The product is [[1,2],[0,1]], doubling the shear amount."),
    "cayley-hamilton": A("Every square matrix satisfies its own characteristic polynomial. For a 2×2 matrix, A²−tr(A)A+det(A)I=0, allowing high powers to reduce to I and A.", "Compute the characteristic polynomial, substitute A, verify the zero matrix, then rearrange to calculate powers or the inverse when det A≠0.", "The theorem applies to square matrices; it does not say each matrix entry individually satisfies the polynomial.", "Diagonal example :: A=diag(2,3), p(λ)=λ²−5λ+6. :: A²−5A+6I=0 entrywise.", "Inverse :: det A=6 and tr A=5 for diag(2,3). :: A⁻¹=(5I−A)/6=diag(1/2,1/3).", "High power :: A²=5A−6I. :: A³=5A²−6A=19A−30I."),
    diagonalization: A("If A has a full basis of eigenvectors, A=PDP⁻¹ with D diagonal. Powers and exponentials become easy because D acts independently on each eigen-coordinate.", "Find eigenvalues, collect independent eigenvectors as P columns, verify AP=PD, and transform a vector into eigen-coordinates before applying D.", "A repeated eigenvalue does not guarantee enough eigenvectors for diagonalization.", "Two-axis stretch :: A=diag(2,3). :: Aⁿ=diag(2ⁿ,3ⁿ).", "Population steps :: A=P diag(1,0.8)P⁻¹. :: The 0.8 mode decays while the 1 mode persists.", "Defective case :: A=[[2,1],[0,2]]. :: One eigendirection prevents a 2×2 diagonalization."),
    "quadratic-forms": A("A quadratic form xᵀAx describes conics or energy surfaces. For symmetric A, eigenvalue signs classify positive definite, negative definite, or indefinite behavior.", "Symmetrize coefficients, compute eigenvalues, rotate to eigenvector axes, and read the signs in the diagonal form.", "A zero determinant alone does not distinguish a flat valley from a saddle; inspect all eigenvalues.", "Bowl :: q=x²+2y². :: Both eigenvalues positive; level curves are ellipses and the origin is a minimum.", "Saddle :: q=x²−y². :: One positive and one negative eigenvalue; zero contours are y=±x.", "Rotated ellipse :: q=2x²+2xy+2y². :: Eigenvalues 3 and 1; principal axes lie along (1,1) and (1,-1)."),
    "principal-axes": A("A symmetric matrix's orthogonal eigenvectors rotate a quadratic form into diagonal coordinates. The mixed xy term disappears on principal axes.", "Form the symmetric coefficient matrix, find its orthonormal eigenvectors Q, substitute x=Qu, and obtain uᵀ(QᵀAQ)u.", "The eigenvectors fix axis directions, but translation may also be needed when linear terms are present.", "Tilted ellipse :: x²+2xy+y²+2y²=1. :: Eigenvectors rotate axes; the cross term disappears in eigen-coordinates.", "Inertia :: Principal moments 2 and 5. :: Along eigen-axes, rotational energy has no mixed product term.", "Covariance :: Σ=[[2,1],[1,2]]. :: Eigenvalues 3 and 1; major data axis is (1,1)."),
    "matrix-factorizations": A("Matrix factorizations expose different structure: LU organizes elimination, QR separates orthogonal directions from triangular weights, and SVD reveals input/output axes and singular scales.", "Choose LU for repeated square solves, pivoted LU for stability, QR for least squares, and SVD for rank or ill-conditioned problems.", "A small determinant does not by itself quantify numerical conditioning; singular values do.", "Repeated solves :: A=LU and many right-hand sides b. :: Solve Ly=b then Ux=y without refactoring A.", "Line fit :: Tall data matrix A=QR. :: Solve Rx=Qᵀb; QR avoids forming AᵀA.", "Image compression :: A≈U_kΣ_kV_kᵀ. :: Keeping the largest k singular values yields a rank-k approximation."),
    similarity: A("Similar matrices B=P⁻¹AP represent the same linear map in different bases. They share characteristic polynomial, trace, determinant, and eigenvalues.", "Build P from new basis vectors, transform coordinates with P⁻¹, and verify B=P⁻¹AP. Compare invariant quantities before and after.", "Similar matrices need not have the same entries or eigenvectors expressed in the old coordinates.", "Axis swap :: A=diag(2,3), P swaps axes. :: B=diag(3,2), with the same eigenvalues.", "Trace :: A=[[1,2],[0,4]]. :: Every similar B has trace 5 and determinant 4.", "System state :: x′=Ax and x=Pz. :: New coordinates obey z′=(P⁻¹AP)z."),
    "jordan-form": A("A defective matrix lacks a full eigenbasis. Jordan chains add generalized eigenvectors, producing blocks J=λI+N with nilpotent N.", "Solve (A−λI)v₁=0, then (A−λI)v₂=v₁. Use the chain as columns of P and verify P⁻¹AP has a Jordan block.", "Jordan form is mathematically revealing but numerically unstable near repeated eigenvalues.", "Two-state chain :: A=[[2,1],[0,2]]. :: v₁=(1,0), v₂=(0,1) form a length-two Jordan chain.", "Matrix powers :: J=2I+N with N²=0. :: Jⁿ=2ⁿI+n2^(n−1)N.", "ODE system :: x′=Jx. :: e^(Jt)=e^(2t)(I+tN), so one solution contains te^(2t).")
  },
  "complex-numbers": {
    home: A("A complex number z=a+bi is both an algebraic quantity and a point (a,b). Addition moves vectors, multiplication scales by moduli and adds arguments.", "Switch between rectangular a+bi and polar r(cosθ+i sinθ), choosing the form that simplifies the operation.", "Argument is multi-valued up to 2π; a principal argument chooses one branch.", "Navigation :: Move 3 east and 4 north. :: Displacement is 3+4i with modulus 5 and argument arctan(4/3).", "Rotation :: Multiply 2+i by i. :: i(2+i)=-1+2i, a 90° anticlockwise turn.", "Signal :: Phasor 5e^(iπ/3). :: Rectangular form is 2.5+(5√3/2)i."),
    "argand-plane": A("The Argand plane places Re z on the horizontal axis and Im z vertically. Distance between z and w is |z−w|; conjugation reflects across the real axis.", "Plot coordinates, form a difference for distance, and use a modulus equation to identify circles or lines as loci.", "Argument depends on quadrant; plain arctan(b/a) can give the wrong quadrant.", "Distance :: z=3+4i and w=1−2i. :: |z−w|=|2+6i|=√40.", "Conjugate :: z=−2+5i. :: z̄=−2−5i and z z̄=29.", "Locus :: |z−(2+i)|=3. :: Points form a circle centered (2,1) with radius 3."),
    arithmetic: A("Complex addition combines real and imaginary parts, while multiplication uses i²=−1. Division multiplies numerator and denominator by the denominator's conjugate.", "Carry out algebra in a+bi form; for multiplication or repeated powers, consider polar form because moduli multiply and arguments add.", "Never divide real and imaginary parts separately; (a+bi)/(c+di) is one quotient.", "AC phasors :: (2+3i)+(1−5i). :: Result is 3−2i.", "Rotation and scale :: (1+i)(2+i). :: Result 1+3i, since i²=−1.", "Impedance quotient :: (3+4i)/(1−i). :: Multiply by 1+i to get (-1+7i)/2."),
    "polar-forms": A("Polar form z=r(cosθ+i sinθ)=re^(iθ) records magnitude r=|z| and direction θ=arg z. Multiplication multiplies radii and adds angles.", "Compute r=√(a²+b²), choose θ with the correct quadrant, then apply De Moivre's rule for powers or roots.", "At z=0 the argument is undefined; it is not zero degrees by convention.", "Convert :: z=−1+i. :: r=√2, θ=3π/4, so z=√2e^(3πi/4).", "Multiply :: 2e^(iπ/6)·3e^(iπ/3). :: Product 6e^(iπ/2)=6i.", "Power :: (cos30°+i sin30°)^3. :: Result cos90°+i sin90°=i."),
    rotation: A("Multiplying by e^(iθ) rotates every complex point by θ about the origin without changing modulus; multiplying by re^(iθ) also scales by r.", "Represent each transform as a complex factor, multiply factors to compose transformations, then apply the product to z.", "Complex multiplication gives direct rotations about the origin; rotation about another center needs translation before and after.", "Quarter turn :: z=3+2i, multiply by i. :: Result -2+3i.", "Rotate about center :: Rotate z=2 around c=1 by 180°. :: c+(-1)(z-c)=0.", "Two turns :: Rotate 30° then 45°. :: Combined factor e^(i75°), so total turn is 75°."),
    roots: A("The n roots of a nonzero complex number re^(iθ) have modulus r^(1/n) and arguments (θ+2πk)/n for k=0,…,n−1. They are evenly spaced on a circle.", "Convert to polar form, compute all k values, plot the roots, and verify by raising each to the nth power.", "Taking only the principal root misses n−1 other solutions.", "Square roots :: Solve z²=−1. :: Roots are i and −i.", "Cube roots of unity :: z³=1. :: Angles 0°,120°,240° give 1 and the two nonreal roots.", "Fourth roots :: z⁴=16. :: Modulus 2 and angles 0°,90°,180°,270° give ±2, ±2i."),
    euler: A("Euler's formula e^(iθ)=cosθ+i sinθ connects exponential growth with circular rotation. The cosine and sine parts arise by grouping even and odd terms of the exponential Taylor series.", "Follow the unit-circle point while θ varies, then compare its real and imaginary projections or sum complex exponentials to recover trig identities.", "The exponent θ is in radians; replacing it with a degree number without conversion changes the value.", "Half turn :: e^(iπ)=−1. :: A π-radian rotation sends 1 to -1.", "Quarter turn :: e^(iπ/2)=i. :: The real projection is 0 and imaginary projection 1.", "Cosine from exponentials :: (e^(iθ)+e^(-iθ))/2. :: Imaginary parts cancel, leaving cosθ."),
    loci: A("A complex locus is a set of points satisfying an equation such as |z-a|=r or |z-a|=|z-b|. Möbius maps (az+b)/(cz+d) send generalized circles to generalized circles where defined.", "Translate modulus or argument conditions into Cartesian geometry, mark excluded denominator zeros, and test representative points before drawing the entire set.", "An equation with a zero denominator excludes that point even if the rest of the curve looks continuous.", "Distance locus :: |z−(1+i)|=2. :: Circle center (1,1), radius 2.", "Bisector :: |z−1|=|z+1|. :: Squaring gives Re z=0, the imaginary axis.", "Inversion :: w=1/z maps |z|=2. :: Image circle has radius 1/2 around origin."),
    fractals: A("Mandelbrot iteration uses z_(n+1)=z_n²+c starting at z₀=0; bounded orbits define the set. A Julia set fixes c and varies z₀ instead.", "Choose c, iterate, color by escape time when |z| exceeds 2, and zoom near the boundary to see new structure.", "Finite iteration cannot prove a point is in the set; it can only detect escape or give stronger evidence of boundedness.", "Outside point :: c=2. :: z₁=2,z₂=6; escape is immediate.", "Inside candidate :: c=0. :: Every iterate stays 0, so c is in the Mandelbrot set.", "Period-two orbit :: c=−1. :: Sequence 0,−1,0,−1,… remains bounded."),
    "waves-circuits": A("A sinusoidal signal Re(Ae^(iωt)) is represented by phasor A. In AC analysis, impedance combines resistance and reactance: Z_R=R, Z_L=iωL, Z_C=1/(iωC).", "Add series impedances, divide voltage phasor by total impedance for current, and read magnitude and argument for amplitude and phase delay.", "Phasor analysis assumes a steady sinusoid at one frequency; transients require time-domain equations.", "Resistor :: V=10∠0° V, R=5 Ω. :: I=V/R=2∠0° A, in phase.", "Inductor :: ω=100 rad/s, L=0.1 H. :: Z_L=10i Ω; current lags voltage by 90°.", "Series RC :: R=3 Ω, capacitive reactance -4i Ω. :: |Z|=5 Ω; 10 V amplitude gives 2 A current amplitude.")
  },
  modelling: {
    home: A("Mathematical modelling turns assumptions into equations, predictions, and tests against data. A model is useful when its variables, units, domain, and limitations are explicit.", "Define a measurable question, choose a mechanism, estimate parameters, compare predictions with observations, and revise when residual patterns reveal missing structure.", "A close fit to training data alone does not establish that a model predicts new conditions.", "Travel :: Constant speed 60 km/h for 2.5 h. :: Distance model d=vt predicts 150 km before stops or traffic.", "Population :: P′=0.1P, P₀=1000. :: Exponential model predicts P(10)≈2718, assuming constant per-capita growth.", "Forecast check :: Model predicts 20,22,24; observations are 19,22,26. :: Residuals -1,0,2 suggest a trend worth investigating."),
    motion: A("Motion models connect position, velocity, and acceleration by x′=v and v′=a. Forces such as gravity and drag determine acceleration; numerical integration is needed when the forces depend on speed.", "Choose coordinates, state initial position and velocity, write force balance, solve or integrate, then compare the predicted path and energy changes.", "Ignoring air resistance can badly overpredict long-range projectile distance.", "Projectile :: Launch at 20 m/s and 30° with g=9.8 m/s². :: Ideal flight time 2v sin30°/g≈2.04 s.", "Braking :: Vehicle slows from 20 m/s at 5 m/s². :: Stop time 4 s and distance 40 m.", "Drag :: v′=10−2v from rest. :: Terminal speed is 5 m/s, not unbounded growth."),
    population: A("Exponential growth assumes unlimited resources; logistic growth adds carrying capacity K. Harvesting subtracts a removal term, and age-structured models replace one count with linked cohorts.", "State births, deaths, resource limit, and intervention rates, then locate equilibria and test sensitivity to parameters.", "A carrying capacity estimated in one environment may change with climate or resource use.", "Exponential :: P₀=100,r=0.2/year. :: After 5 years P≈272 in the constant-rate model.", "Logistic :: K=1000,P₀=100,r=0.2/year. :: P(5)=1000/(1+9e^(-1))≈232.", "Harvest :: P′=0.2P(1-P/1000)−30. :: Equilibria solve 0.2P(1-P/1000)=30, and excessive harvest can remove positive equilibrium."),
    epidemics: A("In SIR models S+I+R is conserved for a closed population. Infection transfers susceptible people to I at rate βSI/N, and recovery transfers I to R at rate γI.", "Estimate β and γ, calculate R₀≈β/γ near a fully susceptible start, and compare intervention scenarios by changing contact or removal rates.", "A lower peak does not necessarily mean fewer total infections without examining the entire trajectory and assumptions.", "Early spread :: β=0.3/day, γ=0.1/day. :: R₀≈3 when nearly everyone is susceptible.", "Vaccination :: If 70% are immune initially and R₀=3. :: Effective reproduction is about 0.9, below one.", "Recovery :: I=100, γ=0.1/day. :: About 10 people/day transfer from I to R at that instant."),
    finance: A("Finance models track cash flows through time. Compounding grows balances, amortization splits each payment into interest and principal, and inflation changes purchasing power.", "Choose a period and effective rate, align payment timing with that period, and compute the balance after each contribution or repayment.", "A quoted annual rate is not the same as an effective annual rate when compounding occurs monthly.", "Savings :: ₹10,000 at 6% annual compounded yearly for 3 years. :: Future value 10000(1.06)³≈₹11,910.", "Loan :: ₹100,000 at 12% nominal annual with monthly rate 1%. :: First-month interest ₹1,000 before any principal repayment.", "Inflation :: A ₹100 basket rises 5% yearly for 2 years. :: Nominal cost ≈₹110.25; purchasing power falls."),
    optimization: A("Optimization chooses decision variables to maximize or minimize an objective while satisfying constraints. Feasible solutions obey every resource, capacity, and timing bound.", "Write variables with units, objective and inequalities, inspect the feasible region, then test the optimum against active constraints and sensitivity.", "An unconstrained optimum can be physically impossible if it violates a resource limit.", "Production :: Profit 3x+2y with x+y≤10, x,y≥0. :: Producing 10 of x yields profit 30 if no other constraint binds.", "Transport :: Ship 5 units at ₹2 each and 3 units at ₹4 each. :: Route cost is ₹22; capacity constraints decide feasibility.", "Design :: Fence 40 m on all sides of a rectangle. :: Area x(20−x) peaks at x=10, a square of area 100 m²."),
    networks: A("A weighted graph represents places or states as nodes and costs as edges. Dijkstra finds shortest paths with nonnegative weights; A* uses a heuristic lower bound to guide search.", "Define edge meanings and units, initialize distances, relax neighbors, and inspect the predecessor chain. For A*, use an admissible heuristic.", "Dijkstra is not valid with negative edge weights; an overestimating A* heuristic can lose optimality.", "Delivery :: A→B cost 2, B→C cost 3, A→C cost 8. :: Shortest A→C route is A→B→C with cost 5.", "Grid path :: Manhattan distance to goal is 6 steps. :: It is an admissible A* heuristic when each grid move costs at least 1.", "Road closure :: Edge B→C becomes cost 10. :: Direct A→C cost 8 becomes preferable."),
    regression: A("Regression estimates how a response changes with predictors. In linear least squares, coefficients minimize squared residuals; residual plots reveal curvature, unequal variance, or outliers.", "Fit on observed data, inspect residuals, quantify prediction error, and validate on held-out or later observations.", "Correlation and a high R² do not prove a causal relationship.", "Sales :: Points (1,3),(2,5),(3,7). :: Fitted line y=2x+1 predicts 9 at x=4 if trend continues.", "Residual :: Model predicts 10 for observed 13. :: Residual observed−predicted is +3.", "Outlier :: Four points lie near y=x but one is (10,0). :: The influential point can strongly rotate the fitted line."),
    periodic: A("Periodic models repeat after period T: f(t+T)=f(t). A harmonic model A sin(2πt/T+φ)+D captures a dominant cycle; multiple harmonics represent richer patterns.", "Estimate mean D, period T, amplitude A, and phase from landmarks; fit remaining error and test future cycles.", "A long-term upward trend cannot be represented by a pure sinusoid with fixed mean.", "Tide :: Mean 2 m, range 1–3 m, period 12 h. :: h(t)=2+cos(2πt/12) if high tide is t=0.", "Daylight :: Approximate annual mean 12 h and amplitude 3 h. :: A 365-day sinusoid spans roughly 9–15 h.", "Sound :: A 440 Hz tone. :: Period is 1/440≈2.27 ms."),
    numerical: A("Numerical models approximate outcomes when exact formulas are impractical. Monte Carlo uses repeated random trials, iteration advances a recurrence, and sensitivity tests how input uncertainty affects predictions.", "Define the estimator or update rule, record seeds and step sizes, run repeated trials, then compare convergence and error.", "A larger number of simulations reduces random error slowly, typically in proportion to 1/√N.", "Monte Carlo π :: Sample points uniformly in a unit square. :: Four times the fraction inside the quarter circle estimates π.", "Euler cooling :: T′=-0.1(T-20), T₀=80, h=1. :: First numerical update is 74 °C.", "Sensitivity :: Travel d=vt at v=60±2 km/h over 2 h. :: Predicted distance is 120±4 km."),
    comparison: A("Competing models should be judged on fit, complexity, plausibility, and predictions outside the fitting window. Residual patterns often reveal missing mechanisms.", "Fit candidates to the same training data, compare errors on held-out observations, then examine parameter meaning and sensitivity.", "The model with the smallest training error may overfit and perform worse on new data.", "Growth models :: Early population doubles rapidly, then flattens. :: Logistic fit captures a limit that exponential growth misses.", "Residual pattern :: Linear forecast errors are -3,-1,1,3 over time. :: Systematic trend suggests a missing curvature term.", "Model choice :: Two models have validation errors 4 and 5 but one uses ten extra parameters. :: Simpler model may be preferable if uncertainty overlaps.")
  },
  discrete: {
    home: A("Discrete mathematics studies countable structures such as integers, sets, logical statements, and graphs. Proof often proceeds by cases, counting, induction, or invariants.", "Specify the objects and operations, test small cases, then justify a rule symbolically or with an algorithm and a correctness argument.", "A pattern seen in the first few integers is a conjecture, not a proof for all integers.", "Handshake network :: Four people each shake every other person's hand. :: Number of handshakes is C(4,2)=6.", "Clock :: 10 hours after 8 o'clock on a 12-hour clock. :: 8+10≡6 (mod 12).", "Route graph :: A tree with 7 vertices. :: It has exactly 6 edges if connected and acyclic."),
    "number-sense": A("Integers, fractions, decimals, ratios, and powers represent quantities at different scales. Equivalent forms preserve value even when notation changes.", "Estimate order of magnitude first, convert to a common representation, then calculate and check units or sign.", "Adding fractions requires a common denominator; adding numerators and denominators directly is wrong.", "Recipe :: 3/4 cup plus 1/2 cup. :: Convert to quarters: 3/4+2/4=5/4 cups.", "Discount :: 20% of ₹750. :: 0.2·750=₹150; final price ₹600.", "Scientific scale :: 3×10⁵ divided by 6×10². :: Result 0.5×10³=500."),
    primes: A("A prime has exactly two positive divisors, 1 and itself. Unique prime factorization underlies gcd, lcm, divisibility, and many cryptographic constructions.", "Sieve candidates up to √n for primality; factor composite numbers, then take minimum prime exponents for gcd and maximum exponents for lcm.", "The number 1 is neither prime nor composite.", "Sieve :: Test 97. :: No prime divisor ≤√97≈9.85 divides it; 97 is prime.", "Schedules :: 12=2²·3 and 18=2·3². :: gcd=6 and lcm=36, so cycles coincide every 36 units.", "Factor tree :: 84=2²·3·7. :: Its positive divisors count is (2+1)(1+1)(1+1)=12."),
    "modular-arithmetic": A("Congruence a≡b (mod n) means n divides a−b. Residues wrap around a finite clock; a has an inverse mod n exactly when gcd(a,n)=1.", "Reduce residues, use the Euclidean algorithm for inverses, and solve linear congruences only after checking gcd(a,n) divides b.", "Division modulo n is not ordinary division; it requires a modular inverse.", "Clock :: 17 hours after 9 on a 12-hour clock. :: 9+17≡2 (mod 12).", "Inverse :: Solve 3x≡1 (mod 7). :: x≡5 because 3·5=15≡1.", "No solution :: Solve 4x≡3 (mod 6). :: gcd(4,6)=2 does not divide 3, so there is no residue solution."),
    "number-patterns": A("Recursive sequences specify the next term from earlier terms; closed forms specify the nth term directly. Figurate numbers and Pascal's triangle have combinatorial interpretations.", "List initial terms, identify a recurrence, derive a formula when possible, and prove it by induction or counting.", "Matching the first few terms does not uniquely determine a sequence.", "Triangular dots :: 1+2+…+n. :: T_n=n(n+1)/2; T_5=15.", "Rabbit recurrence :: F₁=F₂=1, F_n=F_(n−1)+F_(n−2). :: The sixth term is 8.", "Pascal row :: Row 4 is 1,4,6,4,1. :: Entries count ways to choose k objects from 4."),
    combinatorics: A("Counting depends on whether order matters, repetition is allowed, and choices are independent. Permutations arrange, combinations select, and inclusion–exclusion corrects overlap.", "Define the sample object precisely, apply product/sum rules, then divide by symmetry only when each object is counted the same number of times.", "Using n!/(n−r)! for an unordered committee overcounts by r!.", "Seats :: Assign 3 distinct roles from 5 students. :: 5·4·3=60 ordered outcomes.", "Committee :: Choose 3 from 5 without roles. :: C(5,3)=10.", "Overlap :: 20 study algebra, 15 study geometry, 8 study both. :: Number studying at least one is 20+15−8=27."),
    logic: A("Propositional logic assigns truth values to statements. Equivalence means two expressions agree on every assignment; CNF is an AND of OR clauses, useful for SAT solving.", "Construct a truth table, compare columns, and use De Morgan's laws or distributivity to transform forms while preserving all truth assignments.", "A statement p→q is false only when p is true and q is false.", "Alarm :: p=door open, q=alarm sounds. :: p→q fails only if the door opens and alarm stays silent.", "De Morgan :: Not (rain AND cold). :: Equivalent to (not rain) OR (not cold).", "SAT :: (p∨q)∧(¬p∨q). :: q=true satisfies both clauses regardless of p."),
    sets: A("Sets collect distinct elements. Union joins membership, intersection requires both memberships, Cartesian products form ordered pairs, and equivalence relations partition a set into classes.", "Write membership conditions, shade Venn regions or enumerate finite examples, and check reflexive, symmetric, and transitive properties for equivalence.", "An ordered pair (a,b) is generally different from (b,a); a set ignores order but a Cartesian product does not.", "Enrollment :: A={1,2,3}, B={3,4}. :: A∪B={1,2,3,4}, A∩B={3}.", "Product :: A={red,blue}, B={S,M}. :: A×B has four ordered size-color choices.", "Parity classes :: a~b when a−b is even. :: Integers split into even and odd equivalence classes."),
    graphs: A("A graph contains vertices and edges. Connectivity, paths, trees, coloring, and flows answer different questions about the same network.", "Choose directed or undirected edges, label weights/capacities where needed, then use traversal, shortest-path, or flow algorithms that match those assumptions.", "A shortest path is not necessarily a minimum spanning tree; they optimize different objectives.", "Route :: A→B weight 2, B→C weight 3, A→C weight 9. :: Shortest A→C path costs 5 via B.", "Tree :: A connected acyclic graph on 8 vertices. :: It has 7 edges.", "Coloring :: A triangle graph. :: Three colors are required when adjacent vertices must differ."),
    algorithms: A("An algorithm is a finite procedure with a correctness argument and cost model. Sorting, searching, Euclid's gcd, and graph traversal have different complexity bounds.", "State input assumptions, trace the steps on a small example, identify an invariant, and count operations as input size grows.", "A fast average case does not guarantee a fast worst case; complexity depends on the algorithm and input model.", "Binary search :: Sorted list of 1024 items. :: At most about 10 halvings locate an item.", "Euclid :: gcd(84,30). :: 84=2·30+24, 30=1·24+6, 24=4·6; gcd=6.", "Breadth-first search :: Unweighted route graph. :: The first visit to a node gives its shortest edge-count distance."),
    cryptography: A("Classical ciphers transform symbols, while public-key systems use hard inverse problems. RSA relies on modular exponentiation and private exponent d satisfying ed≡1 mod φ(n).", "Work with small educational integers to see key generation, encryption, and decryption, then distinguish mathematical mechanism from real-world security practice.", "Tiny keys and textbook RSA are insecure; real systems require vetted padding and large keys.", "Caesar :: Shift A by 3 positions. :: A→D, Z→C after wrapping mod 26.", "RSA toy :: p=3,q=11,n=33,φ=20,e=3,d=7. :: Message 2 encrypts to 8; 8^7 mod 33 returns 2.", "Diffie–Hellman toy :: Modulus 23, generator 5, secrets 2 and 3. :: Public values 2 and 10 yield shared 8 mod 23.")
  },
  statistics: {
    home: A("Statistics separates variation in a sample from uncertainty about a population. Descriptive summaries show observed data; inference uses a sampling model to estimate or test wider claims.", "Describe collection and units, visualize distribution and outliers, choose an estimator, then state its uncertainty and assumptions.", "A representative sample matters more than a large biased sample.", "Commute times :: 10,12,13,15,50 minutes. :: Median is 13; mean is 20, pulled upward by 50.", "Coin :: 52 heads in 100 flips. :: Sample proportion 0.52, not proof the coin's true probability is 0.52.", "Survey :: 60 of 100 support a policy. :: Estimate 0.60 with sampling uncertainty about √(0.6·0.4/100)≈0.049."),
    "data-explorer": A("Exploratory data analysis inspects variable type, missingness, distribution, and relationships before fitting a model. Pairwise plots reveal association and outliers but not causality.", "Check units and missing values, plot marginal distributions, compare two-variable scatter or grouped views, and look for patterns that suggest a formal question.", "A striking scatter plot can be driven by one influential point or a hidden grouping variable.", "Shop data :: Prices 10,12,14 and units sold 9,7,5. :: A downward pairwise pattern suggests lower sales at higher price.", "Missing data :: 20 of 100 ages are blank. :: Report 20% missingness before calculating an age mean.", "Mixed groups :: Two classes each have positive study-score association but different baselines. :: Pooling may conceal the within-class pattern."),
    descriptive: A("Center summarizes typical value, spread quantifies variation, and shape identifies skew or tails. Mean and standard deviation respond strongly to outliers; median and IQR are more resistant.", "Sort values for median and quartiles, compute mean and variance with the correct sample/population denominator, then compare multiple summaries.", "An outlier is not automatically an error; investigate its source before removal.", "Income :: 20,22,25,28,100 (thousands). :: Median 25 while mean 39, revealing right skew.", "Spread :: Data 2,4,6. :: Mean 4; sample variance [(−2)²+0²+2²]/2=4.", "IQR :: Q1=10,Q3=18. :: IQR=8; usual upper fence is 18+1.5·8=30."),
    "interactive-distributions": A("A probability distribution assigns mass or density to possible outcomes. Discrete models sum point probabilities; continuous probabilities are areas under a density curve.", "Match mechanism to model: fixed trials for binomial, event counts for Poisson, waiting times for exponential, and bell-shaped measurements for normal.", "For a continuous distribution, probability at one exact point is zero even when density there is positive.", "Quality control :: X~Binomial(10,0.1). :: P(X=0)=0.9^10≈0.349.", "Calls :: X~Poisson(3) per hour. :: P(X=0)=e^(−3)≈0.050.", "Heights :: X~Normal(170,10²) cm. :: P(160<X<180)≈0.683 by the ±1σ rule."),
    experiments: A("An experiment estimates probability by repeated outcomes. Relative frequency approaches theoretical probability under independent, identically distributed trials; conditional probability updates when information is known.", "Define the sample space, run trials, compare observed and theoretical frequencies, and use P(A|B)=P(A∩B)/P(B) for conditional events.", "A short run can deviate substantially from expected proportions without indicating a biased device.", "Coin :: 100 fair flips. :: Expected heads 50 but 46 or 54 are ordinary sample variation.", "Dice :: Sum 7 on two dice. :: Six of 36 equally likely pairs give probability 1/6.", "Medical test :: Prevalence 1%, sensitivity 90%, false-positive rate 5%. :: P(disease|positive)=0.009/(0.009+0.0495)≈15.4%."),
    counting: A("Permutations count ordered selections; combinations count unordered selections. Factorials and Pascal's identity connect both, while tree diagrams expose staged choices.", "Ask whether order or repetition matters, multiply choices stage by stage, and divide by symmetry only when arrangements are equally represented.", "A probability numerator and denominator must count outcomes at the same granularity.", "Podium :: Top 3 from 5 runners. :: P(5,3)=5·4·3=60 ordered podiums.", "Team :: Choose 3 of 5 volunteers. :: C(5,3)=10 teams.", "Binomial coefficient :: Coefficient of x² in (1+x)^4. :: C(4,2)=6."),
    clt: A("The sample mean has expected value μ and standard error σ/√n for independent draws. Under broad conditions, its distribution approaches normal as n grows even when the population is skewed.", "Draw many samples of the same size, compute each mean, plot their distribution, and compare its center and width with μ and σ/√n.", "The central limit theorem does not say the raw observations become normally distributed.", "Wait times :: Population σ=12 min, sample size n=36. :: Standard error of mean is 12/6=2 min.", "Sample size :: Increase n from 25 to 100. :: Standard error halves because √n doubles.", "Skewed population :: Individual service times are right-skewed. :: Means of large independent samples become more bell-shaped."),
    "confidence-intervals": A("A confidence interval is a data-dependent procedure with a stated long-run capture rate. For a mean with known σ, estimate x̄±z*σ/√n; wider confidence or higher noise makes wider intervals.", "Choose the estimand and sampling model, compute a standard error, choose a critical value, and interpret the interval as a plausible parameter range.", "A fixed 95% interval does not assign 95% probability to the fixed population parameter in the usual frequentist interpretation.", "Mean :: x̄=50,σ=10,n=100. :: Approximate 95% interval 50±1.96=48.04 to 51.96.", "Proportion :: 60 successes in 100 trials. :: p̂=0.60, SE≈0.049, approximate 95% margin ≈0.096.", "Coverage simulation :: Build 100 independent 95% intervals. :: About 95 should contain μ on average, but any run may differ."),
    hypothesis: A("A hypothesis test compares data with a null model. The p-value is the probability, under that null, of a result at least as extreme as the observed one.", "State H₀ and H₁, choose a statistic and null distribution, compute p, compare with α, then discuss effect size and study design.", "A p-value is not the probability that H₀ is true, and statistical significance is not practical importance.", "Mean test :: H₀:μ=10, sample estimate 12, SE=1. :: z=2 and two-sided p≈0.0455.", "Decision :: p=0.02 with α=0.05. :: Reject H₀ at 5%; this does not prove H₁ exactly.", "Power :: True effect grows while noise stays fixed. :: Rejection becomes more likely under the alternative."),
    correlation: A("Correlation r summarizes linear association between two numeric variables; least-squares regression fits a prediction line by minimizing squared vertical residuals.", "Plot the scatter first, fit the line, inspect residuals and influential points, and limit predictions to a defensible x-range.", "A strong r may hide nonlinear structure, confounding, or an influential outlier.", "Perfect line :: (1,2),(2,4),(3,6). :: r=1 and fitted y=2x.", "Prediction :: Fit y=3+2x. :: At x=4 the predicted response is 11, provided x=4 is in scope.", "Residual :: Observed 14, predicted 11. :: Residual is +3; positive means the point lies above the line."),
    anova: A("ANOVA compares between-group variation with within-group variation. Under equal means, the F ratio MS_between/MS_within is typically near one; large values challenge the null.", "Define groups and randomization, calculate sums of squares and degrees of freedom, form F, then inspect residuals and follow-up comparisons.", "A significant F says at least one mean differs, not which specific pair differs.", "Three treatments :: Group means 10,10,10 with similar spread. :: Between-group sum of squares is near zero, so F is small.", "Changed treatment :: Means 10,10,20 with low within-group noise. :: Between-group variation rises and F becomes large.", "Design :: Randomly assign 30 plots equally to 3 fertilizers. :: Each treatment gets 10 plots, reducing selection bias.")
  },
  algebra: {
    home: A("Algebra represents unknown quantities and relationships with symbols. An identity is true for every allowed value; an equation asks which values make a statement true.", "Keep the domain visible, transform expressions with reversible rules, and check candidate solutions in the original problem.", "Squaring or multiplying by an expression that can be zero can add or lose solutions.", "Budget :: Three tickets cost ₹450. :: 3x=450 gives x=₹150 per ticket.", "Rectangle :: Length x+2, width x. :: Area x(x+2)=x²+2x.", "Growth :: Deposit ₹1000 at 5% yearly. :: Balance after n years is 1000(1.05)^n."),
    expressions: A("Like terms have the same variable powers, so their coefficients combine. Expansion uses distributivity; factorization reverses it.", "Identify terms and domain restrictions, combine coefficients, distribute products, then verify an equivalent form by expansion.", "2x and 2x² are unlike terms; their exponents cannot be merged.", "Shop bill :: 3 notebooks at x each plus 2 more. :: 3x+2x=5x.", "Area :: Rectangle sides x+3 and x+2. :: Area (x+3)(x+2)=x²+5x+6.", "Factor :: x²+7x+12. :: (x+3)(x+4) because 3+4=7 and 3·4=12."),
    equations: A("An equation stays equivalent when the same reversible operation is applied to both sides. Linear equations isolate x; quadratics may need factoring or the quadratic formula; inequalities reverse direction after multiplying by a negative.", "Simplify both sides, preserve balance, solve, and substitute each candidate into the original equation.", "Squaring √x=-2 would produce x=4, but the original equation has no real solution.", "Taxi fare :: 50+12d=170. :: Subtract 50 and divide by 12: d=10 km.", "Quadratic :: x²−5x+6=0. :: Factor (x−2)(x−3)=0; roots 2 and 3.", "Inequality :: −2x<6. :: Divide by −2 and reverse sign: x>−3."),
    functions: A("A function assigns one output to each allowed input. Transformations change a graph predictably; composition applies one function after another, while an inverse reverses a one-to-one function.", "State domain, evaluate and graph parent behavior, then apply shifts/scales in the correct order. For an inverse, swap x and y and solve.", "A relation can fail to be a function if one input has two outputs; an inverse may require a restricted domain.", "Pricing :: f(n)=20n+50. :: Five items cost f(5)=₹150.", "Shift :: g(x)=(x−2)²+3. :: The parabola x² moves right 2 and up 3.", "Composition :: f(x)=2x, g(x)=x+1. :: f(g(3))=8, while g(f(3))=7."),
    polynomials: A("The factor theorem links roots and factors: f(r)=0 iff (x−r) divides f(x). Degree and leading coefficient determine end behavior; multiplicity determines whether a graph crosses or touches an axis.", "Factor or divide, count roots with multiplicity, and check signs around each root before sketching.", "A repeated even-multiplicity root touches the axis without changing sign.", "Roots :: x²−9=(x−3)(x+3). :: Zeroes are ±3.", "Multiplicity :: f(x)=(x−2)²(x+1). :: At x=2 the graph touches; at x=-1 it crosses.", "End behavior :: f(x)=−2x³+x. :: As x→∞, f(x)→−∞ because the leading term dominates."),
    systems: A("A solution of a system satisfies every equation simultaneously. Graph intersections, substitution, elimination, and row reduction are equivalent ways to find the same feasible set.", "Choose an efficient method based on coefficients, inspect whether equations are dependent or inconsistent, and check the solution in all originals.", "Parallel lines have no solution; identical lines have infinitely many.", "Tickets :: Adult x plus child y: x+y=10, 5x+3y=42. :: Eliminate y to get x=6,y=4.", "Intersection :: y=2x+1 and y=−x+7. :: 2x+1=−x+7 gives (2,5).", "Dependent :: 2x+2y=8 and x+y=4. :: Same line, so infinitely many solutions."),
    exponents: A("Exponent laws follow from repeated multiplication, while logarithms invert exponentials. For a>0,a≠1, log_a(a^x)=x on the relevant domain.", "Use common bases to solve exponential equations or take logarithms; enforce positive log arguments and check transformed equations.", "log(x+y) is not log x+log y; logarithm addition corresponds to multiplication.", "Doubling :: 2^x=32. :: x=5.", "Compound interest :: 1000(1.1)^t=2000. :: t=ln2/ln1.1≈7.27 years.", "Log domain :: log₁₀(x−3)=2. :: x−3=100, so x=103>3."),
    sequences: A("An arithmetic sequence changes by constant difference d; a geometric sequence changes by constant ratio r. A recurrence gives the next term, while a closed form gives term n directly.", "Inspect consecutive differences and ratios, write the nth term, and use a sum formula when accumulating values.", "A sequence with ratio zero or changing signs needs careful indexing before applying a geometric sum formula.", "Savings :: Add ₹100 each month starting at ₹500. :: Month n amount a_n=500+100(n−1).", "Doubling :: Start 3, multiply by 2. :: Fifth term 3·2⁴=48.", "Arithmetic sum :: 1+2+…+20. :: Sum=20·21/2=210."),
    proof: A("Algebraic proof establishes a claim for every allowed value using definitions and valid transformations. A counterexample disproves a universal claim with one valid case.", "State assumptions, justify each equality or implication, and separate one-way implications from equivalences.", "Testing many values can support a conjecture but cannot prove a universal identity.", "Odd square :: n=2k+1. :: n²=4k(k+1)+1, so every odd square is odd.", "Identity :: (a+b)². :: Distributivity gives a²+2ab+b² for all real a,b.", "Counterexample :: Claim: all primes are odd. :: The prime 2 disproves the claim."),
    cas: A("A computer algebra system manipulates symbolic expressions under stated assumptions. Exact simplification, factorization, solving, and differentiation are different operations with different domains.", "Enter an expression with variables and assumptions, choose the operation, then verify the result by substitution or differentiation.", "A symbolic answer can omit branch or domain restrictions unless those assumptions are supplied.", "Factor :: Input x²−5x+6. :: CAS returns (x−2)(x−3); expanding verifies it.", "Differentiate :: Input x³−2x. :: Output 3x²−2, checked by power rule.", "Solve :: Input x²=4 over reals. :: Solutions are x=−2 and x=2, not only the principal square root."),
    advanced: A("Advanced algebra connects systems, functions, polynomial structure, and symbolic proof. A useful workflow alternates between exact manipulation, visualization, and numeric checking.", "Identify the algebraic structure first, choose a symbolic method, and verify special cases or boundary values.", "A numerical match at sampled points is evidence, not an identity proof.", "Parametric root :: x²−(a+1)x+a=0. :: Factor (x−1)(x−a); roots 1,a, coincident when a=1.", "Matrix system :: [[2,1],[1,2]](x,y)=(3,3). :: Solution x=y=1.", "Inverse composition :: f(x)=3x−2. :: f⁻¹(x)=(x+2)/3 and f⁻¹(f(t))=t."),
    classic: A("Classic algebra uses balance, substitution, and equivalent expressions to solve unknowns. The central rule is to preserve equality while simplifying both sides.", "Collect like terms, isolate the variable, and check the result in the original equation or expression.", "A transformation that divides by a variable needs a separate check when that variable is zero.", "Balance :: 3x+4=19. :: Subtract 4 and divide by 3 to get x=5.", "Factor :: x²−16. :: Difference of squares gives (x−4)(x+4).", "Substitute :: y=2x+1 and x=3. :: y=7, the coordinate is (3,7).")
  },
  "algebraic-structures": {
    home: A("An algebraic structure is a set together with operations satisfying axioms. Closure, associativity, identity, inverses, and order laws distinguish semigroups, monoids, groups, rings, and lattices.", "State the carrier set and operation, test each axiom with symbols or a complete finite table, then look for counterexamples.", "An identity element depends on the operation: 0 for addition, 1 for multiplication.", "Integers :: (ℤ,+) has identity 0 and inverse −a for each a. :: It forms a group under addition.", "Natural numbers :: (ℕ,+) has 0 if included but lacks additive inverses. :: It is a monoid, not a group.", "Subsets :: Power set under union. :: Identity is empty set and union is associative and idempotent."),
    "structure-test": A("A structure test checks axioms in the right order: closure, associativity, identity, and inverses. A single counterexample is enough to reject an axiom.", "Choose a set and operation, evaluate all pairs for closure and all triples for associativity when finite, then locate an identity and each inverse.", "Commutativity is not required for a group; it is an extra property of abelian groups.", "Even integers :: Even+even is even. :: Closure holds; 0 and negatives also remain even, giving an additive group.", "Subtraction :: On integers, (5−3)−1=1 but 5−(3−1)=3. :: Associativity fails.", "Nonzero rationals :: Under multiplication, identity 1 and inverse 1/a exist. :: This is an abelian group."),
    "cayley-tables": A("A Cayley table lists every output of a finite binary operation. Rows and columns reveal closure, identity, inverses, and commutativity; associativity requires checking triples.", "Label elements consistently, fill each cell a*b, locate an identity row and column, then search each row for the identity to find inverses.", "A symmetric table proves commutativity, not associativity.", "Mod 3 addition :: Elements 0,1,2. :: Row for 2 is 2,0,1; identity is 0 and inverse of 2 is 1.", "XOR :: Elements 0,1 with bitwise XOR. :: Table has 0 as identity and each element self-inverse.", "Left projection :: Define a*b=a on {0,1}. :: Table rows are constant; no two-sided identity exists."),
    "semigroups-monoids": A("A semigroup has an associative operation. A monoid is a semigroup with an identity; inverses are not required.", "Check closure and associativity, then test a candidate identity on both sides of every element.", "A left identity need not be a right identity, so test both directions.", "Strings :: Concatenation is associative. :: Empty string is identity, so strings form a monoid.", "Positive integers :: Multiplication is associative with identity 1. :: It is a monoid; most elements lack inverses within positive integers.", "Max operation :: max(a,b) on nonnegative integers. :: Identity is 0 because max(0,a)=a."),
    "posets-lattices": A("A partial order is reflexive, antisymmetric, and transitive. A lattice additionally has a meet (greatest lower bound) and join (least upper bound) for each pair.", "Draw a Hasse diagram without reflexive and transitive edges, then find meet and join from the order.", "Incomparable elements are allowed in a poset; a total order requires every pair to be comparable.", "Divisibility :: On {1,2,3,6}, a≤b when a divides b. :: Meet of 2 and 3 is gcd=1; join is lcm=6.", "Subsets :: Under inclusion, meet is intersection and join is union. :: {1,2}∧{2,3}={2}.", "Schedule priority :: Tasks A and B can be incomparable. :: A partial order can still place both before task C."),
    "boolean-algebra": A("Boolean algebra combines AND, OR, and NOT with identities such as distributivity and De Morgan's laws. Sets and digital circuits provide concrete models.", "Build a truth table for the expression, simplify with identities, then check the resulting circuit or set operation.", "The distributive laws work in both directions; a visual circuit simplification must preserve every input row.", "Access rule :: A AND (B OR C). :: Equivalent to (A AND B) OR (A AND C).", "De Morgan :: NOT(A AND B). :: Equivalent to (NOT A) OR (NOT B).", "Absorption :: A OR (A AND B). :: Always equals A, so one gate branch can be removed.")
  },
  "number-systems": {
    home: A("Number systems expand to support new operations: natural numbers count, integers include negatives, rationals express ratios, and reals include limits such as √2.", "Place each number in the smallest familiar set that contains it, convert representations, and compare locations on the real line.", "A finite decimal is rational; an infinite nonrepeating decimal can be irrational.", "Temperature :: −5 °C requires an integer below zero. :: Natural counting numbers cannot represent it.", "Recipe :: 3/4 cup is rational. :: Its decimal 0.75 terminates.", "Diagonal :: A unit square diagonal is √2. :: It is real and irrational, not expressible as a fraction of integers."),
    rational: A("A rational number has form p/q with integers p,q and q≠0. Its decimal expansion terminates or repeats; arithmetic is closed under addition, subtraction, multiplication, and division by nonzero rationals.", "Use a common denominator for addition, reduce by gcd, and connect fraction, decimal, and point on the number line.", "The denominator cannot be zero; 0/0 is not a rational number.", "Shared pizza :: 2/3+1/4. :: Common denominator 12 gives 8/12+3/12=11/12.", "Repeating decimal :: 0.333… . :: Let x=0.333…; 10x−x=3, so x=1/3.", "Scale :: 3/5 of 20 km. :: Distance is 12 km."),
    irrational: A("An irrational real cannot equal p/q for integers p,q≠0. Its decimal expansion neither terminates nor repeats; common examples include √2, π, and e.", "Use geometric constructions or bounds to locate irrationals, and distinguish exact symbols from rounded measurements.", "A decimal approximation such as 1.414 is rational even though it approximates irrational √2.", "Square diagonal :: Side 1 gives diagonal √2 by Pythagoras. :: √2≈1.4142 but has no exact fraction form.", "Circle :: Circumference divided by diameter is π. :: A radius-1 circle has exact circumference 2π.", "Sum :: √2+(2−√2). :: Result 2 is rational; sums involving irrationals need not be irrational."),
    "real-line": A("Every real number has a position on the number line. Order compares positions, absolute value measures distance from zero, and intervals encode sets of positions.", "Place reference integers, estimate irrational positions, then use inequalities and interval notation to show ranges.", "A strict inequality excludes endpoints; a closed interval includes them.", "Distance :: |-3−2|. :: Points -3 and 2 are 5 units apart.", "Bound :: -2≤x<4. :: Interval is [-2,4), including -2 but excluding 4.", "Root :: √5≈2.236. :: It lies between 2 and 3 because 4<5<9."),
    hierarchy: A("The standard containment chain is ℕ⊂ℤ⊂ℚ⊂ℝ, with irrationals in ℝ outside ℚ. Complex numbers extend ℝ by adding i with i²=−1.", "Classify a number by exact definition rather than its appearance, and distinguish a number's value from one representation of it.", "Depending on convention, 0 may or may not be included in ℕ; state the chosen convention.", "Negative count :: −7 is integer, rational (-7/1), and real. :: It is not natural.", "Fraction :: 0.125=1/8. :: It is rational despite decimal notation.", "Complex root :: Solve x²+1=0. :: Solutions ±i are complex but not real."),
    concepts: A("Number concepts include closure, order, density, completeness, and representation. Between two distinct rationals lies another rational; real completeness also fills limits missing from ℚ.", "Test an operation on a chosen set, compare neighboring values with averages, and use sequences to understand limiting behavior.", "A dense subset can still omit points: rationals are dense in reals but do not contain √2.", "Between fractions :: Between 1/3 and 1/2. :: Their average 5/12 lies strictly between them.", "Closure :: Integers under subtraction. :: 3−5=−2 remains an integer.", "Limit :: Decimal approximations 1.4,1.41,1.414,… . :: They approach √2, which is not rational."),
    practice: A("Reliable number-system practice combines exact calculation with estimation. Fractions and roots should be simplified before rounding; reported precision should match the task.", "Classify values, perform operations in exact form, estimate magnitude, then convert to decimals only when needed.", "Premature rounding can accumulate error across repeated operations.", "Fraction sum :: 5/6−1/4. :: 10/12−3/12=7/12≈0.5833.", "Radical :: √50. :: Factor 25·2 to obtain exact 5√2≈7.071.", "Percent error :: Approximate π as 3.14. :: Absolute error ≈0.00159 and relative error ≈0.051%.")
  },
  calculus: {
    home: A("Calculus studies limits, instantaneous change, accumulation, and multivariable variation. Derivatives describe local rates; integrals aggregate continuously varying quantities.", "Read the units and geometry first, form a limit or sum, apply the relevant theorem, and check the result against a graph or physical interpretation.", "A memorized derivative or integral without its domain and initial conditions may answer the wrong question.", "Velocity :: s(t)=t² metres. :: Instantaneous velocity s′(3)=6 m/s.", "Distance :: v(t)=2t m/s for 0≤t≤3. :: ∫₀³2t dt=9 m traveled.", "Optimization :: A(x)=x(10−x). :: A′=10−2x=0 at x=5, the maximum area 25."),
    limits: A("A limit describes the value approached near a point, regardless of the function's value exactly there. Continuity requires the two-sided limit to equal that value.", "Test from left and right, simplify removable factors only for x near the point, and use a graph or table to check the algebra.", "Substituting x=a into a 0/0 form gives indeterminacy, not a numeric limit.", "Removable hole :: f(x)=(x²−4)/(x−2). :: For x≠2, f=x+2, so lim(x→2)f=4.", "One-sided jump :: f(x)=|x|/x near 0. :: Left limit -1 and right limit 1; two-sided limit does not exist.", "Infinite limit :: f(x)=1/x² near 0. :: Values grow without bound on both sides; no finite limit."),
    derivatives: A("The derivative f′(x) is the limit of average slopes [f(x+h)−f(x)]/h as h→0. It gives tangent slope and instantaneous rate.", "Differentiate with product, chain, and quotient rules as needed, then interpret sign and units at a point.", "The derivative of a product is not the product of derivatives; use (fg)′=f′g+fg′.", "Motion :: s=t³ metres. :: v=s′=3t² and v(2)=12 m/s.", "Tangent :: f=x² at x=3. :: Slope f′(3)=6, so tangent y−9=6(x−3).", "Chain rule :: f(x)=sin(x²). :: f′(x)=2x cos(x²)."),
    "derivative-applications": A("Derivative signs identify increasing/decreasing intervals, while critical points and endpoint checks locate extrema. Second derivatives describe curvature and acceleration.", "Form an objective with a domain, differentiate, solve f′=0, test critical points and endpoints, then interpret units.", "A critical point can be a minimum, maximum, or neither; f′=0 alone is not enough.", "Fencing :: Fixed perimeter 40 m gives A=x(20−x). :: Maximum at x=10 m with area 100 m².", "Acceleration :: s=t³−3t². :: v=3t²−6t and a=6t−6; acceleration vanishes at t=1.", "Related rates :: A=πr² and dr/dt=2 cm/s at r=3 cm. :: dA/dt=2πr·dr/dt=12π cm²/s."),
    integration: A("An integral accumulates infinitesimal contributions. The Fundamental Theorem of Calculus links accumulation to antiderivatives: ∫_a^b f(x)dx=F(b)−F(a) when F′=f.", "Choose signed area or physical accumulation, find an antiderivative or numerical approximation, and include bounds and units.", "A definite integral may be negative; physical area uses absolute values where the graph crosses the axis.", "Velocity :: v=2t on 0≤t≤3. :: Displacement ∫₀³2t dt=9 m.", "Area :: f=x² on [0,2]. :: ∫₀²x²dx=8/3 square units.", "Net change :: Flow rate 5−t L/min from 0 to 4. :: Accumulated volume ∫₀⁴(5−t)dt=12 L."),
    "integration-techniques": A("Integration techniques reverse differentiation patterns. Substitution handles composition, integration by parts reverses a product rule, and partial fractions split rational functions.", "Inspect the integrand's structure, choose a substitution or decomposition, integrate, and differentiate the answer to verify.", "A substitution in a definite integral must also transform the limits or return to the original variable.", "Substitution :: ∫2x cos(x²)dx. :: Let u=x²; result sin(x²)+C.", "By parts :: ∫x e^x dx. :: x e^x−∫e^x dx=(x−1)e^x+C.", "Partial fractions :: ∫1/(x²−1)dx. :: Split into 1/2[1/(x−1)−1/(x+1)] and integrate logs."),
    "integral-applications": A("Integrals compute volume, work, mass, and average value by summing thin pieces. The integrand must include the correct cross-sectional geometry and units.", "Draw a representative slice, write its differential contribution, choose limits, then integrate.", "Using radius where the formula needs radius squared can produce a dimensional error in volume.", "Disk solid :: Rotate y=x on [0,2] about x-axis. :: V=π∫₀²x²dx=8π/3.", "Work :: Force F(x)=3x N moves from x=0 to 2 m. :: Work ∫₀²3x dx=6 J.", "Average :: Temperature T(t)=20+2t over 0–4 h. :: Average (1/4)∫₀⁴Tdt=24 °C."),
    "differential-equations": A("A differential equation in calculus connects an unknown function with its derivative. Slope fields visualize first-order solutions; initial data select a trajectory.", "Classify separable or linear structure, solve symbolically when possible, then compare with Euler or RK4 approximations.", "A slope field is local; a curve must be tangent to its arrows at every point.", "Growth :: y′=0.2y, y(0)=5. :: y=5e^(0.2t).", "Cooling :: T′=-0.1(T−20), T₀=80. :: T(t)=20+60e^(-0.1t).", "Euler :: y′=y, y₀=1, h=0.1. :: First approximation 1.1 versus exact e^0.1≈1.1052."),
    "series-parametric-polar": A("A series approximates a function by sums; parametric curves specify x(t),y(t), and polar curves specify radius r(θ). Convergence and coordinate choice determine what conclusions are valid.", "For a series, identify a convergence test and its hypotheses. For curves, compute derivatives from the chosen parameter and check where denominators vanish.", "An alternating series may converge conditionally even when its absolute-value series diverges.", "Geometric series :: Σ_(n=0)^∞(1/2)^n. :: Sum is 1/(1−1/2)=2.", "Parametric tangent :: x=t²,y=t³ at t=2. :: dy/dx=(3t²)/(2t)=3.", "Polar circle :: r=2cosθ. :: x²+y²=2x, a circle centered (1,0) with radius 1."),
    "multivariable-vector": A("A multivariable function changes along many directions. Partial derivatives hold other variables fixed; the gradient points toward steepest local increase.", "Compute each partial, assemble ∇f, and use directional derivative ∇f·u for a unit direction u.", "The gradient is a vector of rates; a directional derivative requires a unit direction to represent rate per unit distance.", "Hill :: f(x,y)=x²+y². :: At (1,2), ∇f=(2,4), pointing outward.", "Temperature :: T=20+3x−2y. :: Moving one unit east changes T by +3; north by -2.", "Directional rate :: ∇f=(2,4), u=(3/5,4/5). :: D_u f=6/5+16/5=22/5."),
    jacobians: A("The Jacobian matrix contains all first partial derivatives of a coordinate map. Its determinant gives local signed area or volume scaling, so change of variables uses its absolute value.", "Write the transformation and domain, calculate the Jacobian determinant, transform boundaries, and integrate with |J|.", "For polar coordinates the area element is r dr dθ, not simply dr dθ.", "Polar :: x=r cosθ,y=r sinθ. :: |J|=r, so a radius-R disk area is ∫₀²π∫₀ᴿr dr dθ=πR².", "Scaling :: x=2u,y=3v. :: |J|=6; a unit uv-square maps to area 6.", "Shear :: x=u+v,y=v. :: |J|=1, so area is preserved."),
    "beta-gamma": A("Gamma extends factorial: Γ(n+1)=n! for nonnegative integers. Beta integrates powers on [0,1] and satisfies B(p,q)=Γ(p)Γ(q)/Γ(p+q).", "Check parameter positivity, use recurrence or substitution to simplify, and relate special values to known integrals.", "Γ(0) is undefined; factorial extension does not remove poles at nonpositive integers.", "Factorial :: Γ(5). :: Γ(5)=4!=24.", "Half value :: Γ(1/2). :: It equals √π through the Gaussian integral.", "Beta :: B(2,3)=∫₀¹t(1−t)²dt. :: Γ(2)Γ(3)/Γ(5)=1/12."),
    "series-tests": A("A series Σa_n converges when its partial sums approach a finite limit. Comparison, ratio, root, alternating, and integral tests apply under different hypotheses.", "Check whether a_n→0 first, identify sign and growth type, then select a test and state what it proves.", "a_n→0 is necessary but not sufficient: the harmonic series diverges.", "Geometric :: Σ_(n=0)^∞(1/3)^n. :: Converges to 3/2 because |r|<1.", "Harmonic :: Σ1/n. :: Diverges even though 1/n→0.", "Alternating :: Σ(-1)^(n+1)/n. :: Converges by alternating test but not absolutely."),
    "curve-tracing": A("Curve tracing combines domain, intercepts, symmetry, first derivative, second derivative, and asymptotes into a coherent graph.", "Find undefined points and limits, solve f′=0 for turning points, use f″ for concavity, then compare with sampled values.", "A vertical asymptote is a limit statement; a small denominator alone does not prove one if the numerator also vanishes.", "Cubic :: f=x³−3x. :: f′=3x²−3 gives extrema at x=±1.", "Rational :: f=1/(x−2). :: Domain excludes 2 and x=2 is a vertical asymptote.", "Inflection :: f=x³. :: f″=6x changes sign at 0, so the origin is an inflection point."),
    "taylor-two-variables": A("A two-variable Taylor approximation uses value, gradient, and Hessian near a base point. The quadratic term captures local curvature and mixed interaction.", "At (a,b), compute f, ∇f, and Hessian; then evaluate f(a,b)+∇f·h+(1/2)hᵀHh for a small displacement h.", "Local approximations can become inaccurate far from the expansion point.", "Surface :: f=x²+y² near (1,1). :: For h=(0.1,0.2), exact second-order Taylor gives 2+0.6+0.05=2.65.", "Mixed term :: f=xy near (1,2). :: Expansion 2+2h_x+h_y+h_xh_y is exact.", "Plane :: f=sin x+y near (0,0). :: First-order approximation is x+y."),
    "lagrange-multipliers": A("At a smooth constrained extremum of f subject to g=c, the objective gradient is parallel to the constraint gradient: ∇f=λ∇g.", "Solve the multiplier equations together with the constraint, then compare all candidates and boundary cases.", "The multiplier condition finds candidates, not automatically maxima; singular constraints need separate inspection.", "Fence :: Maximize xy with x+y=10. :: x=y=5 gives maximum area 25.", "Nearest point :: Minimize x²+y² subject to x+y=2. :: Point (1,1) has minimum squared distance 2.", "Sphere :: Maximize z subject to x²+y²+z²=9. :: Top point (0,0,3) is the maximum."),
    "change-order": A("A double integral over a region can be computed in either order when the integrand is integrable. Changing order means describing the same region with new inner and outer bounds.", "Sketch the region from the original bounds, project it on the new outer axis, and solve boundary curves for the new inner variable.", "Swapping integral symbols without changing limits usually changes the region.", "Triangle :: 0≤x≤1, 0≤y≤x. :: Reversed order is 0≤y≤1, y≤x≤1.", "Area :: ∫₀¹∫₀ˣ1 dy dx. :: Value is 1/2 in either order.", "Curved region :: 0≤x≤1, x²≤y≤1. :: Reversed: 0≤y≤1, 0≤x≤√y."),
    centroid: A("The centroid is the mass-weighted average position. For uniform planar density, x̄=(1/A)∫∫_R x dA and ȳ=(1/A)∫∫_R y dA.", "Determine area or mass first, then compute first moments and divide by total. Use symmetry to avoid unnecessary integration.", "A centroid can lie outside a concave region; it is not always a point inside the material.", "Rectangle :: Uniform 6×4 plate. :: Centroid is (3,2) from one corner.", "Triangle :: Vertices (0,0),(6,0),(0,3). :: Centroid is average of vertices, (2,1).", "Two masses :: 2 kg at x=0 and 1 kg at x=6. :: Center of mass x̄=(2·0+1·6)/3=2."),
    "moments-of-inertia": A("Moment of inertia measures mass distribution about an axis: I=∫r²dm. Material farther from the axis contributes quadratically more.", "Choose the axis, express perpendicular distance r, specify density, and integrate over the object; use the parallel-axis theorem when shifting axes.", "Area moment of inertia in structural engineering and mass moment of inertia have different units and interpretations.", "Point masses :: 1 kg at radius 2 m and 2 kg at radius 1 m. :: I=1·4+2·1=6 kg·m².", "Thin rod :: Uniform mass M, length L about center. :: I=ML²/12.", "Parallel axis :: Disk has I_center=MR²/2. :: About tangent axis, I=MR²/2+MR²=3MR²/2."),
    "integral-engineering": A("Multiple integrals accumulate density over regions or volumes. They compute mass, average fields, probability, and engineering properties when a single-variable slice is insufficient.", "Describe the domain, choose Cartesian/polar/cylindrical coordinates, include the Jacobian, and integrate density or the required moment.", "A coordinate change without its Jacobian gives the wrong physical units and total.", "Plate mass :: Uniform density 2 kg/m² over a 3×4 m plate. :: Mass ∫∫2 dA=24 kg.", "Disk area :: Radius 2 disk in polar coordinates. :: ∫₀²π∫₀²r dr dθ=4π.", "Mean temperature :: T=x+y on unit square. :: Average ∫₀¹∫₀¹(x+y)dxdy=1."),
    advanced: A("Advanced calculus combines convergence, multivariable derivatives, optimization, and coordinate changes. Each method is valid only under its continuity, differentiability, or domain assumptions.", "Translate a problem into geometry and notation, choose a theorem with matching hypotheses, compute, then inspect limiting or boundary cases.", "A symbolic result can be wrong at singular points or omitted boundaries even when algebra elsewhere is correct.", "Critical point :: f=x²+y² under x+y=2. :: Constrained minimum at (1,1), value 2.", "Jacobian :: x=2u,y=3v. :: Unit square area scales by 6.", "Series :: Σ_(n=1)^∞1/n². :: It converges by p-series test with p=2.")
  }
};
ir["advanced-concepts"] = {
  "continued-fractions": A("A continued fraction writes a real number as a₀+1/(a₁+1/(a₂+⋯)). Truncating it gives convergents pₙ/qₙ, often exceptionally accurate for their denominator.", "Take the integer part, invert the fractional remainder, and repeat. Build convergents with pₙ=aₙpₙ₋₁+pₙ₋₂ and the same recurrence for q.", "A decimal rounded before expansion can change later partial quotients dramatically.", "Rational sensor ratio :: Apply Euclid to 13/8: 13=1·8+5, 8=1·5+3, 5=1·3+2, 3=1·2+1. :: 13/8=[1;1,1,1,2], and the final convergent is exact.", "Square-root estimate :: √2=[1;2,2,2,…]. :: Convergents 1, 3/2, 7/5, 17/12 progressively approach 1.4142.", "Gear ratio :: Approximate π by a small-denominator fraction. :: The convergent 22/7≈3.14286 errs by about 0.00126."),
  "famous-problems": A("A famous problem may be a proved theorem, an open conjecture, or a paradox resolved by changing axioms. Examples connect elementary statements to deep proof methods.", "State the claim with its quantifiers, test small cases to build intuition, then separate numerical evidence from a proof covering every case.", "A billion successful trials do not prove a universal claim over infinitely many integers.", "Collatz orbit :: Start at 6 and apply n/2 for even n or 3n+1 for odd n. :: 6→3→10→5→16→8→4→2→1, one observed orbit but no general proof.", "Four colors :: A planar map has adjacent regions sharing an edge. :: The four-color theorem guarantees a coloring with at most four colors, regardless of map size.", "Fermat equation :: Test n=3 and x=3,y=4. :: 3³+4³=91, not a cube; Fermat's theorem rules out every positive integer triple for all n>2."),
  "stats-inference": A("Inference uses a sample statistic to estimate an unknown population quantity. A confidence interval adds uncertainty from repeated sampling; a hypothesis test measures conflict with a specified null.", "Check how the data were sampled, compute the estimate and standard error, select a justified critical value, and interpret the interval in population terms.", "A 95% confidence interval does not assign 95% probability to a fixed parameter after the data are observed.", "Election share :: 600 of 1000 sampled voters support a proposal. :: p̂=0.6; approximate 95% margin 1.96√(0.6·0.4/1000)≈0.0304.", "Conversion test :: 55 conversions in 100 visits, test p₀=0.5. :: z=(0.55−0.5)/√(0.25/100)=1; this is weak two-sided evidence.", "Sample planning :: Want margin 0.05 for a proportion near 0.5 at 95%. :: n≈1.96²·0.25/0.05²≈385 independent responses."),
  "differential-equations": A("A first-order initial value model y′=f(t,y), y(t₀)=y₀ predicts how a state changes from its current value. Exact solutions serve as a check for numerical stepping.", "Identify units and an equilibrium, solve analytically when separable or linear, then compare Euler's yₙ₊₁=yₙ+hf(tₙ,yₙ) with the exact curve.", "Euler's error grows when the step is large relative to the model's time scale.", "Cooling :: T′=−0.2(T−20), T(0)=80. :: T(5)=20+60e⁻¹≈42.1 °C.", "Growth :: P′=0.3P, P(0)=100. :: P(2)=100e⁰·⁶≈182.2.", "Euler check :: y′=y, y(0)=1, h=0.1. :: One Euler step is 1.1; exact y(0.1)=e⁰·¹≈1.1052."),
  "special-functions": A("Special functions extend elementary operations: Gamma generalizes factorial, Beta normalizes power-law densities, erf integrates the Gaussian kernel, and zeta sums reciprocal powers.", "Check each function's domain, use identities and recurrence relations, and compare numeric values against a known special case.", "A named function can have poles or branch restrictions; evaluating outside the defining integral may require analytic continuation.", "Factorial extension :: Γ(5)=∫₀∞t⁴e⁻ᵗdt. :: Γ(5)=4!=24.", "Beta probability :: B(2,3)=∫₀¹t(1−t)²dt. :: B(2,3)=1/12, so density 12t(1−t)² integrates to 1.", "Basel sum :: ζ(2)=Σₙ₌₁∞1/n². :: ζ(2)=π²/6≈1.645.")
};
ir["statistics-extended"] = {
  "survey-sampling": A("Stratified sampling estimates a population mean as ΣWₕȳₕ. Independent samples within strata contribute variance ΣWₕ²Sₕ²/nₕ; a finite population correction matters for large sampling fractions.", "Choose strata before sampling, allocate observations using size and within-stratum variation, then weight each stratum estimate by its population share.", "Equal sample sizes across unequal strata generally require weights; an unweighted overall average can be biased.", "District poll :: Urban share 0.6 has 55% support and rural share 0.4 has 45%. :: Weighted support is 0.6·0.55+0.4·0.45=0.51.", "Finite census :: Sample 200 without replacement from N=1000. :: Standard error multiplier is √((1000−200)/(1000−1))≈0.895.", "Neyman allocation :: Two equally sized strata have SDs 10 and 20; total n=90. :: Allocate 30 and 60 observations in proportion to NₕSₕ."),
  "design-of-experiments": A("An experiment estimates treatment effects by random assignment. Blocking removes known nuisance variation; replication estimates residual noise; factorial designs expose interactions.", "Specify response and factors, randomize within blocks, compute treatment and error sums of squares, then compare mean squares with an F ratio.", "A significant main effect may hide opposing effects across levels of a second factor; inspect interaction first.", "Fertilizer blocks :: Three fields each receive A and B; paired yield differences are 2,3,1. :: Mean treatment gain is 2 units after field blocking.", "Website factorial :: A button adds 2% conversion on desktop but −1% on mobile. :: Device modifies the button effect, so report an interaction.", "ANOVA :: Treatment MS=18, error MS=3. :: F=18/3=6; compare with an F reference distribution for the design's degrees of freedom."),
  "quality-control": A("A control chart tests whether process variation is stable over time. Capability compares stable process spread with customer specification limits; control and specification limits answer different questions.", "Estimate the process center and σ from stable data, plot time-ordered observations against control limits, then compute Cp and Cpk against specifications.", "A process can be stable yet produce many defects if it is centered poorly or too variable.", "Fill volume :: Target 500 mL, σ=2, specs 494–506. :: Cp=(506−494)/(6·2)=1; the spread exactly fills the tolerance.", "Off-center process :: Mean 503 mL with same specs and σ=2. :: Cpk=min(506−503,503−494)/(3·2)=0.5.", "p chart :: Defect fraction p̄=0.02 in samples of 100. :: Approximate 3σ upper limit is 0.02+3√(0.02·0.98/100)≈0.062."),
  "time-series": A("A time series combines level, trend, seasonal repetition, and irregular error. Forecasts must respect temporal order; smoothing trades noise reduction for lag.", "Plot by time, choose a seasonal period, fit level or trend, inspect residual autocorrelation, and score forecasts on future observations.", "Random train/test shuffling leaks future information into a forecast evaluation.", "Store sales :: Months show 100,110,120 units. :: Three-month moving average after month 3 is 110 units.", "Exponential smoothing :: Prior forecast 100, observed 120, α=0.25. :: Updated forecast is 0.25·120+0.75·100=105.", "Forecast error :: Actuals 10,12 and forecasts 9,15. :: MAE=(1+3)/2=2 units."),
  nonparametric: A("Rank and sign tests compare samples with fewer distributional assumptions than parametric mean tests. The test statistic depends on pairing and number of groups.", "For paired measurements use signs or signed ranks; for independent groups rank all observations together and compute Mann–Whitney U or Kruskal–Wallis.", "Mann–Whitney U is not automatically a test of medians when group shapes differ.", "Pain before/after :: Five patients all improve. :: Two-sided sign-test probability is 2/2⁵=0.0625 under equal improvement/worsening chance.", "Two groups :: Scores A={1,2}, B={3,4}. :: A has rank sum 3 and U_A=3−2·3/2=0, complete separation.", "Runs :: Binary outcomes H,H,H,T,T,T form two runs. :: Few runs may suggest clustering versus random order."),
  "multivariate-analysis": A("Multivariate analysis handles correlated outcomes jointly. PCA diagonalizes covariance; Hotelling's T² generalizes a mean-distance test; MANOVA compares vector means.", "Standardize when units differ, estimate covariance, inspect eigenvalues and eigenvectors, and check whether a joint test adds information beyond separate tests.", "A principal component explains variance, not necessarily a causal mechanism or a meaningful label.", "Correlated sensors :: Covariance [[2,1],[1,2]]. :: Eigenvalues 3 and 1; direction (1,1) captures 75% of total variance.", "Portfolio :: Two assets each have variance 4 and covariance 2. :: Equal-weight portfolio variance is 0.25(4+4+2·2)=3.", "Joint biomarkers :: Treatment shifts two correlated measures by (1,1). :: Mahalanobis distance uses Σ⁻¹ so shared variation is not counted twice."),
  "advanced-inference": A("Advanced inference compares estimator bias, variance, coverage, and decision error. Likelihood combines evidence from observations; Bayesian updating combines it with a prior.", "Write the sampling model and likelihood, identify the estimand, derive or simulate an interval, and check coverage under repeated synthetic samples.", "A narrow interval can still be unreliable if model assumptions or selection mechanisms are wrong.", "Binomial estimate :: 8 successes in 10 trials. :: Maximum-likelihood p̂=0.8.", "Beta update :: Prior Beta(2,2), then 8 successes and 2 failures. :: Posterior is Beta(10,4), mean 10/14≈0.714.", "Normal mean :: σ=4 known, n=64, sample mean 20. :: Standard error is 0.5; approximate 95% interval is 20±0.98."),
  "official-statistics": A("Official statistics turn survey and administrative records into comparable population indicators. Definitions, reference periods, weights, and revisions determine what an index means.", "Read the metadata, identify numerator and denominator, apply weights or base-year scaling, and state the population and time period.", "A change in a published rate may reflect a changed definition or sampling frame rather than only real-world change.", "Price index :: Basket costs ₹120 now versus ₹100 in base year. :: Index is 120, implying 20% cumulative basket inflation.", "Birth rate :: 1200 births among 100,000 residents in one year. :: Crude birth rate is 12 per 1000 residents.", "District average :: 60% of people live in A with rate 10%, 40% in B with rate 20%. :: Population-weighted rate is 14%, not 15%."),
  "survival-analysis": A("Survival analysis models time until an event while retaining right-censored observations. Kaplan–Meier multiplies conditional survival proportions at event times; hazards describe instantaneous event rates.", "Order event times, count subjects at risk just before each event, multiply (1−dᵢ/nᵢ), and mark censoring without treating it as a failure.", "Dropping censored subjects entirely biases estimates when they carried valid follow-up information.", "Machine lifetime :: At day 5, 2 of 10 machines fail. :: Kaplan–Meier survival drops to 8/10=0.8.", "Later event :: One unit is censored after day 5; at day 8, 1 of 7 at risk fails. :: Survival becomes 0.8·6/7≈0.686.", "Constant hazard :: λ=0.1 per year. :: Exponential survival at 5 years is e⁻⁰·⁵≈0.607."),
  "actuarial-reliability": A("Actuarial models price uncertain future claims and failures using event probabilities, severities, and timing. Expected loss is frequency times average severity before loading and expenses.", "Estimate exposure, claim frequency, claim amount, and uncertainty; discount future payments and test sensitivity to rate changes.", "Expected value alone misses tail risk and does not include administration, capital, or profit loading.", "Warranty reserve :: 1000 devices each have 2% failure probability and ₹500 repair cost. :: Expected repair reserve is 1000·0.02·500=₹10,000.", "Premium :: Expected claims ₹800, expenses ₹100, loading ₹100. :: Indicated premium is ₹1000 per policy.", "Reliability :: Constant failure hazard 0.02 per month. :: Probability of surviving 12 months is e⁻⁰·²⁴≈0.787."),
  "statistical-computing": A("Statistical computing approximates uncertainty when algebra is difficult. Bootstrap resamples observed units with replacement; permutation tests reshuffle labels under a null of exchangeability.", "Choose the statistic and resampling unit, repeat many simulated samples, inspect the empirical distribution, and report Monte Carlo uncertainty.", "Resampling individual rows is invalid when observations are clustered or serially dependent; resample at the independent unit.", "Bootstrap mean :: Data {2,4,6}; one resample {2,2,6}. :: Resample mean is 10/3 versus observed mean 4.", "Permutation :: Group A={1,2}, B={3,4}; observed mean difference is −2. :: Relabel all 6 possible 2-versus-2 assignments to form an exact null distribution.", "Monte Carlo π :: Uniform points in unit square; 7854 of 10,000 lie inside quarter circle. :: π≈4·0.7854=3.1416."),
  "applied-modelling": A("Applied models link predictors to outcomes while quantifying error. Linear regression predicts continuous values, logistic regression predicts event probability, and Poisson regression predicts counts.", "Define target and predictors, split data by the intended deployment setting, fit the appropriate link function, then check calibration and residual patterns.", "A strong fitted association does not establish causality, and accuracy on training data can conceal overfitting.", "Hospital odds :: Logistic intercept 0 gives baseline p=0.5; coefficient ln2 for risk factor. :: With factor present, odds double from 1 to 2, so p=2/3.", "Calls :: Poisson model predicts λ=3 arrivals/hour. :: Probability of zero calls is e⁻³≈0.0498.", "Linear demand :: Model sales=20+3·advertising (₹1000 units). :: At advertising=4, prediction is 32 sales units."),
  "school-statistics": A("School statistics introduces data displays, center, spread, and chance through concrete counts. The right summary depends on data type and skew.", "Organize observations into a frequency table, calculate median or mean as appropriate, visualize honestly, and distinguish replacement from no replacement in probability.", "An average can hide an outlier; always inspect the original distribution or a plot.", "Class marks :: Sorted marks 4,5,7,8,10. :: Median is 7 and mean is 34/5=6.8.", "Library pictograph :: One icon represents 5 books; a row has 6 icons. :: The row represents 30 books.", "Bag draw :: 3 red and 2 blue balls; draw two without replacement. :: P(both red)=(3/5)(2/4)=3/10.")
};
ir["statistics-phase"] = {
  module: A("A probability model specifies possible outcomes and their chances; statistical inference works in reverse from observed data to unknown model parameters. Discrete mass sums to one, while continuous density integrates to one.", "Start with the outcome type and support, choose a distribution whose assumptions fit, estimate parameters, then compare predictions with observed frequencies.", "Matching a histogram visually is insufficient when observations are dependent or the model's support excludes possible outcomes.", "Quality test :: Each item is defective with probability 0.02 independently. :: Defect count among 100 items is binomial with mean 2.", "Waiting time :: Arrivals occur at rate 3/hour. :: Exponential mean waiting time is 1/3 hour, or 20 minutes.", "Survey :: 240 of 400 respondents agree. :: Sample proportion is 0.6; approximate SE is √(0.6·0.4/400)≈0.0245."),
  distributions: A("A distribution maps outcomes to probability. Discrete models assign mass to individual values; continuous models assign density whose area over an interval is probability.", "Choose support first, then identify mechanism such as fixed trials, waiting time, sampling without replacement, or symmetric measurement noise. Compare mean, variance, and tail behavior.", "For a continuous variable P(X=a)=0 even if its density at a is positive.", "Dice :: A fair die has six equally likely outcomes. :: P(X≥5)=2/6=1/3.", "Poisson calls :: Average 2 calls per hour. :: P(X=0)=e⁻²≈0.135.", "Normal measurement :: X~N(100,10²). :: P(90<X<110)≈0.6827, the central one-SD area."),
  sampling: A("A sampling distribution describes how a statistic varies across repeated samples. For independent observations, the mean's standard error is σ/√n; the Central Limit Theorem often makes its standardized shape nearly normal.", "Choose a population model, repeatedly sample the same size, calculate a statistic per sample, and compare the empirical spread with its standard-error formula.", "The CLT concerns the distribution of sample means, not a claim that the original population is normal.", "Factory output :: Individual measurements have σ=12 and n=36. :: Sample-mean standard error is 12/√36=2.", "Sample planning :: Want SE at most 1 with σ=10. :: Need n≥(10/1)²=100 independent measurements.", "Polling :: p=0.4 and n=400. :: Proportion standard error is √(0.4·0.6/400)≈0.0245."),
  inference: A("A hypothesis test compares observed data with a specified null model; its p-value is a tail probability assuming that null. Confidence intervals report a range of estimates compatible with the data and procedure.", "Write null and alternative first, choose an appropriate standard error and test statistic, calculate a p-value, then report effect size and uncertainty.", "The p-value is not the probability that the null hypothesis is true.", "Coin test :: 60 heads in 100 tosses, H₀:p=0.5. :: z=(0.6−0.5)/√(0.25/100)=2; two-sided p≈0.0455.", "Mean interval :: Sample mean 50, known σ=10, n=100. :: 95% interval is 50±1.96·1=48.04 to 51.96.", "Power :: True proportion 0.6 versus null 0.5. :: Increasing n shrinks SE, making that 0.1 difference easier to detect."),
  regression: A("Regression predicts an outcome from predictors; residuals are observed minus predicted values. A good fit needs both an appropriate trend and residual behavior consistent with model assumptions.", "Fit coefficients, plot residuals against predictions and time, compute SSE and R², then validate on new data.", "A high R² can coexist with curved residuals or influential points and does not show causation.", "Sales line :: ŷ=5+2x and x=3. :: Predicted sales are 11; if observed y=13, residual is +2.", "Fit quality :: SST=100 and SSE=20. :: R²=1−20/100=0.8, so the fit accounts for 80% of sample variation.", "Outlier :: Four points lie near y=x; add (100,0). :: The far point can pull a least-squares line strongly, so inspect leverage."),
  bayesian: A("Bayesian inference updates prior probability with likelihood: posterior odds equal prior odds times the likelihood ratio. In low-base-rate settings, false positives can dominate positive results.", "Construct a contingency table or Bayes numerator and denominator, calculate posterior probability, then test sensitivity to prior and test accuracy.", "Sensitivity is P(positive|condition), while positive predictive value is P(condition|positive); they are not interchangeable.", "Screening :: Prevalence 1%, sensitivity 90%, false-positive rate 10%. :: P(condition|positive)=0.009/(0.009+0.099)=1/12≈8.3%.", "Spam filter :: Prior spam 20%, P(flag|spam)=0.8, P(flag|legitimate)=0.05. :: P(spam|flag)=0.16/(0.16+0.04)=0.8.", "Beta coin :: Prior Beta(2,2), observe 3 heads and 1 tail. :: Posterior Beta(5,3) has mean 5/8."),
  stochastic: A("A stochastic process tracks a state that evolves randomly. Markov chains use transition probabilities; Poisson processes model independent arrivals; queue utilization compares arrival and service rates.", "Identify states and time steps, build a transition matrix or rate model, iterate it, and inspect long-run behavior and parameter sensitivity.", "A stationary distribution depends on the transition model and may not exist uniquely for a reducible chain.", "Weather chain :: Sunny→sunny 0.8, rainy→sunny 0.4. :: If today is sunny, tomorrow's sun probability is 0.8.", "Call arrivals :: Poisson rate 2/hour. :: P(no calls in 1 hour)=e⁻²≈0.135.", "Queue :: Arrival rate 8/hour, service rate 10/hour. :: Utilization ρ=8/10=0.8; a single-server queue is stable only when ρ<1."),
  "advanced-models": A("Advanced statistical models handle correlated measurements, multimodal data, and information loss. A covariance matrix shapes multivariate-normal ellipses; mixtures combine component densities; KL divergence compares distributions asymmetrically.", "Inspect covariance eigenvectors, compare candidate component counts on held-out data, and quantify uncertainty or divergence with clearly stated reference distribution.", "Adding mixture components can always improve training likelihood yet worsen prediction; validate complexity.", "Covariance ellipse :: Σ=diag(4,1). :: One-standard-deviation contours are twice as wide in x as y.", "Mixture :: 30% of observations come from mean 0 and 70% from mean 10. :: Overall mean is 0.3·0+0.7·10=7.", "Entropy :: Fair binary event has p=0.5. :: H=−2(0.5 log₂0.5)=1 bit.")
};
const Vo = {
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
}, Go = {
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
}, Yo = (a) => /[=≈≠∝≤≥<>→⇒+−×÷√∫∑^²³%°∈∪∥∧∨¬π]/.test(a), Yi = (a) => a.split(";").map((e) => e.trim()).find(Yo);
function Ko(a, e, t) {
  const r = Vo[`${a}/${e}`];
  return t.examples.map((i, n) => ({
    title: i.title,
    expression: Go[`${a}/${e}/${n}`] ?? (r == null ? void 0 : r[n]) ?? Yi(i.result) ?? Yi(i.setup) ?? i.result,
    context: i.setup,
    result: i.result
  }));
}
const Xo = (a, e) => `studio-theory-${a}-${e}`, Ot = [
  { id: "theory", label: "Theory & examples" },
  { id: "simple", label: "In Simple words" },
  { id: "formulas", label: "Formulas" },
  { id: "live", label: "Real-time examples" },
  { id: "practice", label: "Try these" }
];
function _o({ studioId: a, page: e, mode: t }) {
  var j, R, N, I, O;
  const [r, i] = ce("theory"), [n, l] = ce(0);
  ea(() => {
    i("theory"), l(0);
  }, [a, e.id]);
  const u = (j = ir[a]) == null ? void 0 : j[e.id], d = (R = Uo[a]) == null ? void 0 : R[e.id];
  if (!u || !d) return null;
  const p = t && e.modes.includes(t) ? t : e.modes[0], f = Xo(a, e.id), b = Ko(a, e.id, u), S = (k) => {
    let L = k.parentElement;
    for (; L && L.scrollHeight <= L.clientHeight + 1; ) L = L.parentElement;
    L ? L.scrollTo({ top: 0, behavior: "smooth" }) : window.scrollTo({ top: 0, behavior: "smooth" });
  }, w = (k) => {
    var X;
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(k.key)) return;
    k.preventDefault();
    const L = Ot.findIndex((ae) => ae.id === r), V = k.key === "Home" ? Ot[0].id : k.key === "End" ? Ot.at(-1).id : Ot[(L + (k.key === "ArrowRight" ? 1 : -1) + Ot.length) % Ot.length].id;
    i(V), (X = document.getElementById(`${f}-tab-${V}`)) == null || X.focus();
  };
  return /* @__PURE__ */ o.jsxs("section", { id: f, className: "studio-theory", "aria-label": `${e.label} learning content`, children: [
    /* @__PURE__ */ o.jsxs("div", { className: "studio-theory-heading", children: [
      /* @__PURE__ */ o.jsxs("div", { children: [
        /* @__PURE__ */ o.jsx("span", { className: "studio-theory-kicker", children: "LEARN THE WHY" }),
        /* @__PURE__ */ o.jsxs("h2", { children: [
          e.label,
          ": learn and explore"
        ] })
      ] }),
      p ? /* @__PURE__ */ o.jsxs("span", { className: "studio-theory-mode", children: [
        "Current lab mode: ",
        p
      ] }) : null
    ] }),
    /* @__PURE__ */ o.jsx("div", { className: "studio-theory-tabs", role: "tablist", "aria-label": `${e.label} explanations`, children: Ot.map((k) => /* @__PURE__ */ o.jsx("button", { id: `${f}-tab-${k.id}`, type: "button", role: "tab", "aria-selected": r === k.id, "aria-controls": `${f}-panel-${k.id}`, tabIndex: r === k.id ? 0 : -1, onClick: () => i(k.id), onKeyDown: w, children: k.label }, k.id)) }),
    /* @__PURE__ */ o.jsxs("div", { id: `${f}-panel-simple`, className: "studio-theory-simple", role: "tabpanel", "aria-labelledby": `${f}-tab-simple`, hidden: r !== "simple", children: [
      /* @__PURE__ */ o.jsx("span", { className: "studio-theory-kicker", children: "THE SAME IDEA, PLAINLY" }),
      /* @__PURE__ */ o.jsx("p", { children: d })
    ] }),
    /* @__PURE__ */ o.jsxs("div", { id: `${f}-panel-theory`, role: "tabpanel", "aria-labelledby": `${f}-tab-theory`, hidden: r !== "theory", children: [
      /* @__PURE__ */ o.jsxs("div", { className: "studio-theory-principles", children: [
        /* @__PURE__ */ o.jsxs("article", { children: [
          /* @__PURE__ */ o.jsx("h3", { children: "Core idea" }),
          /* @__PURE__ */ o.jsx("p", { children: u.principle })
        ] }),
        /* @__PURE__ */ o.jsxs("article", { children: [
          /* @__PURE__ */ o.jsx("h3", { children: "How to work it" }),
          /* @__PURE__ */ o.jsx("p", { children: u.method })
        ] }),
        /* @__PURE__ */ o.jsxs("article", { className: "studio-theory-caution", children: [
          /* @__PURE__ */ o.jsx("h3", { children: "Watch for" }),
          /* @__PURE__ */ o.jsx("p", { children: u.caution })
        ] })
      ] }),
      /* @__PURE__ */ o.jsxs("div", { className: "studio-theory-example-heading", children: [
        /* @__PURE__ */ o.jsx("h3", { children: "Three worked examples" }),
        /* @__PURE__ */ o.jsx("p", { children: "Use the lab controls to test these relationships." })
      ] }),
      /* @__PURE__ */ o.jsx("div", { className: "studio-theory-examples", children: u.examples.map((k, L) => /* @__PURE__ */ o.jsxs("article", { children: [
        /* @__PURE__ */ o.jsx("span", { className: "studio-theory-number", children: L + 1 }),
        /* @__PURE__ */ o.jsx("h4", { children: k.title }),
        /* @__PURE__ */ o.jsx("p", { children: k.setup }),
        /* @__PURE__ */ o.jsx("strong", { children: k.result })
      ] }, k.title)) }),
      e.learning && e.id !== "home" ? /* @__PURE__ */ o.jsxs("div", { className: "studio-theory-experiment", children: [
        /* @__PURE__ */ o.jsxs("div", { children: [
          /* @__PURE__ */ o.jsx("h3", { children: "Test it in the live lab" }),
          /* @__PURE__ */ o.jsx("p", { children: e.learning.try }),
          /* @__PURE__ */ o.jsx("strong", { children: e.learning.why })
        ] }),
        /* @__PURE__ */ o.jsx("button", { type: "button", onClick: (k) => S(k.currentTarget), children: "Back to lab controls ↑" })
      ] }) : null
    ] }),
    /* @__PURE__ */ o.jsxs("div", { id: `${f}-panel-formulas`, role: "tabpanel", "aria-labelledby": `${f}-tab-formulas`, hidden: r !== "formulas", children: [
      /* @__PURE__ */ o.jsxs("p", { className: "studio-theory-tab-intro", children: [
        "Relationships used in ",
        e.label,
        ". Each card shows the setup that makes the relationship useful."
      ] }),
      /* @__PURE__ */ o.jsx("div", { className: "studio-theory-formula-grid", children: b.map((k, L) => /* @__PURE__ */ o.jsxs("article", { children: [
        /* @__PURE__ */ o.jsx("span", { className: "studio-theory-number", children: L + 1 }),
        /* @__PURE__ */ o.jsx("h3", { children: k.title }),
        /* @__PURE__ */ o.jsx("div", { className: "studio-theory-formula", "aria-label": `${k.title} relationship`, children: k.expression }),
        /* @__PURE__ */ o.jsxs("p", { children: [
          /* @__PURE__ */ o.jsx("strong", { children: "Given:" }),
          " ",
          k.context
        ] }),
        k.result !== k.expression && /* @__PURE__ */ o.jsxs("p", { children: [
          /* @__PURE__ */ o.jsx("strong", { children: "What it tells us:" }),
          " ",
          k.result
        ] })
      ] }, `${k.title}-${L}`)) })
    ] }),
    /* @__PURE__ */ o.jsxs("div", { id: `${f}-panel-live`, role: "tabpanel", "aria-labelledby": `${f}-tab-live`, hidden: r !== "live", children: [
      /* @__PURE__ */ o.jsx("p", { className: "studio-theory-tab-intro", children: "Choose a situation, then change the matching quantities in the lab and compare its displayed result." }),
      /* @__PURE__ */ o.jsx("div", { className: "studio-theory-example-chooser", role: "group", "aria-label": `${e.label} example situations`, children: u.examples.map((k, L) => /* @__PURE__ */ o.jsxs("button", { type: "button", "aria-pressed": n === L, onClick: () => l(L), children: [
        L + 1,
        ". ",
        k.title
      ] }, k.title)) }),
      /* @__PURE__ */ o.jsxs("article", { className: "studio-theory-live-card", children: [
        /* @__PURE__ */ o.jsxs("span", { className: "studio-theory-kicker", children: [
          "EXAMPLE ",
          n + 1,
          " OF 3"
        ] }),
        /* @__PURE__ */ o.jsx("h3", { children: u.examples[n].title }),
        /* @__PURE__ */ o.jsxs("p", { children: [
          /* @__PURE__ */ o.jsx("strong", { children: "Set up:" }),
          " ",
          u.examples[n].setup
        ] }),
        /* @__PURE__ */ o.jsxs("p", { children: [
          /* @__PURE__ */ o.jsx("strong", { children: "Expected result:" }),
          " ",
          u.examples[n].result
        ] }),
        ((N = e.learning) == null ? void 0 : N.observe) && /* @__PURE__ */ o.jsxs("p", { children: [
          /* @__PURE__ */ o.jsx("strong", { children: "Observe in this lab:" }),
          " ",
          e.learning.observe
        ] }),
        ((I = e.learning) == null ? void 0 : I.try) && /* @__PURE__ */ o.jsxs("p", { children: [
          /* @__PURE__ */ o.jsx("strong", { children: "Change next:" }),
          " ",
          e.learning.try
        ] }),
        /* @__PURE__ */ o.jsx("button", { type: "button", onClick: (k) => S(k.currentTarget), children: "Open lab controls ↑" })
      ] })
    ] }),
    /* @__PURE__ */ o.jsxs("div", { id: `${f}-panel-practice`, role: "tabpanel", "aria-labelledby": `${f}-tab-practice`, hidden: r !== "practice", children: [
      /* @__PURE__ */ o.jsx("p", { className: "studio-theory-tab-intro", children: "Work each setup before opening its result. Use the lab to check your reasoning." }),
      /* @__PURE__ */ o.jsx("div", { className: "studio-theory-practice-list", children: u.examples.map((k, L) => /* @__PURE__ */ o.jsxs("details", { children: [
        /* @__PURE__ */ o.jsxs("summary", { children: [
          /* @__PURE__ */ o.jsx("span", { className: "studio-theory-number", children: L + 1 }),
          /* @__PURE__ */ o.jsxs("span", { children: [
            /* @__PURE__ */ o.jsx("strong", { children: k.title }),
            /* @__PURE__ */ o.jsx("small", { children: k.setup })
          ] })
        ] }),
        /* @__PURE__ */ o.jsx("p", { children: k.result })
      ] }, `${k.title}-${L}`)) }),
      ((O = e.learning) == null ? void 0 : O.challenge) && /* @__PURE__ */ o.jsxs("div", { className: "studio-theory-practice-challenge", children: [
        /* @__PURE__ */ o.jsx("h3", { children: "Extend the idea" }),
        /* @__PURE__ */ o.jsx("p", { children: e.learning.challenge })
      ] })
    ] })
  ] });
}
const T = (a, e, t, r, i) => ({
  observe: a,
  understand: e,
  why: t,
  try: r,
  challenge: i
});
function M(a, e, t, r, i, n, l, u, d) {
  return { id: a, label: e, route: a === "home" ? t : `${t}/${a}`, title: r, subtitle: i, description: n, modes: l, challenge: u, learning: d };
}
const es = {
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
      M("home", "Studio Home", "/geometry", "Geometry Studio", "Explore shape, measure, and proof.", "Launch a geometry lab.", [], { prompt: "0", expected: 0, hint: "" }, T("Pick a lab and watch one figure respond when you drag a point.", "Read the live measures and name what stays constant.", "A construction, a measure, and a theorem are the same relationship.", "Start with Triangles Explorer, then open Circles.", "Prove one claim in Theorems & Proofs after you can measure it.")),
      M("construction", "Construction", "/geometry", "Construction Workspace", "Build figures with dependent objects.", "Point, line, circle, and polygon tools that stay linked as you drag.", ["Live Object Tree", "Measurements", "Dependencies", "Proof Explanation"], { prompt: "How many degrees in a straight angle?", expected: 180, hint: "A straight line is a half turn." }, T("Watch objects appear.", "Read the object tree.", "Dependencies keep the figure consistent.", "Add a circle through two points.", "Reconstruct a perpendicular bisector.")),
      M("triangles", "Triangles", "/geometry", "Triangles Lab", "Explore triangle geometry through dynamic constructions, measurements and proofs.", "Drag vertices to classify triangles and test congruence, similarity, centers, and inequalities.", ["Triangle Explorer", "Congruence", "Similarity", "Centers", "Inequalities"], { prompt: "Angle sum of a triangle (degrees)?", expected: 180, hint: "Interior angles of a Euclidean triangle." }, T("Drag vertices to explore how side lengths and angles change.", "Notice if parts remain constant under different movements.", "Why does SSS guarantee triangle congruence?", "Use transformations to move one triangle onto the other.", "Create two non-congruent triangles that look similar.")),
      M("circles", "Circles", "/geometry", "Circles Lab", "Explore circle geometry through constructions, measurements and dynamic relationships.", "Chord, tangent, and inscribed-angle theorems in motion.", ["Chords", "Tangents", "Angles", "Power of a Point", "Arcs & Sectors"], { prompt: "Angle in a semicircle (degrees)?", expected: 90, hint: "Thales' theorem." }, T("Move the inscribed point.", "Read the intercepted arc.", "Inscribed angle is half the center.", "Drag a tangent.", "Find an angle from an arc.")),
      M("polygons", "Polygons", "/geometry", "Polygons Lab", "Explore polygon structure, angles, tessellations, area and diagonals through interactive constructions.", "Regular n-gons with interior sum, tessellation, area, and diagonals.", ["Regular Polygon", "Interior Angles", "Tessellation", "Area", "Diagonals"], { prompt: "Interior angle of a regular hexagon?", expected: 120, hint: "((n-2)×180)/n." }, T("Change n and watch the regular n-gon rebuild.", "Interior sum is (n−2)×180°; exteriors always close 360°.", "Only triangles, squares, and hexagons tessellate regularly.", "Decompose area into triangles or use the shoelace formula.", "Count n(n−3)/2 diagonals of an octagon.")),
      M("transformations", "Transformations", "/geometry", "Transformations Lab", "Translate, rotate, reflect, dilate, and compose maps.", "See the image of a shape under each isometry and dilation.", ["Translate", "Rotate", "Reflect", "Dilate", "Compose"], { prompt: "Rotation of 180° around origin sends (1,0) to x=?", expected: -1, hint: "Halfway around the origin." }, T("Move the pre-image.", "Read the image coordinates.", "Isometries preserve distance.", "Compose reflect then rotate.", "Map a triangle onto another.")),
      M("coordinate", "Coordinate Geometry", "/geometry", "Coordinate Geometry Lab", "Explore analytic geometry with points, lines, equations, or loci.", "Distance, midpoint, slope, and loci on a live coordinate plane.", ["Distance", "Midpoint", "Slope", "Section Formula", "Locus"], { prompt: "Distance from (0,0) to (3,4)?", expected: 5, hint: "3-4-5 triangle." }, T("Drag points A, B & C or lines to see relationships update in real time.", "Explore slopes, equations, distances, and intersections.", "See how algebraic forms connect to geometric ideas.", "Create your own lines, loci, and solve challenges.", "Find the locus of points equidistant from A and B.")),
      M("measurement", "Measurement", "/geometry", "Measurement Lab", "Measure length, angle, area, perimeter, scale, and uncertainty.", "Live length, angle, area, and perimeter with units and scale.", ["Length", "Angle", "Area", "Perimeter", "Scale", "Error"], { prompt: "Area of a 6 by 4 rectangle?", expected: 24, hint: "length × width." }, T("The shape is composite and can be decomposed into 4 rectangles for easy measurement.", "Area is the sum of parts. Perimeter is the total around the outer boundary.", "Decomposition simplifies complex shapes. Additive properties ensure accurate total measurements.", "Drag orange points to modify the shape. Switch to other modes to measure angles and more.", "Create a shape with the same area but different perimeter. Can you minimize the perimeter?")),
      M("proofs", "Theorems & Proofs", "/geometry", "Theorem & Visual Proof", "See why classic theorems hold.", "Visual proofs for Pythagoras, angle sum, circles, and similarity.", ["Pythagoras", "Angle Sum", "Circle Theorems", "Similarity", "Area Proofs"], { prompt: "In a 3-4-5 triangle, hypotenuse is?", expected: 5, hint: "3²+4²=c²." }, T("Watch the rearrangement.", "Read each proof step.", "Area is conserved under dissection.", "Rearrange the squares.", "Write a two-column proof.")),
      { ...M("solids", "Shapes Explorer", "/geometry", "2D & 3D Shapes Explorer", "Measure 2D shapes and 3D solids with live formulas.", "Cylinders, cones, spheres, nets, and cross-sections in the Shapes Explorer.", ["Cylinders", "Cones", "Spheres", "Nets", "Cross-sections"], { prompt: "Volume of a cube of side 3?", expected: 27, hint: "s³." }, T("Rotate the solid.", "Read surface area and volume.", "Nets fold without overlap.", "Unfold a cylinder.", "Sketch a cross-section.")), route: "/shapes" },
      M("ar", "Geometry AR", "/geometry", "Geometry AR Lab", "Overlay constructions on the camera plane.", "Camera overlay for points, lines, polygons, and 3D solids.", ["Select", "Point", "Line", "Circle", "Polygon", "3D Solid", "Plane", "Measure"], { prompt: "A full turn in degrees?", expected: 360, hint: "One complete rotation." }, T("Place a point in AR.", "Measure a live length.", "Camera pose maps world to screen.", "Measure a room corner.", "Capture a triangle overlay."))
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
      M("home", "Studio Home", "/trigonometry", "Trigonometry Studio", "Explore angles, triangles, circles and waves.", "", [], { prompt: "0", expected: 0, hint: "" }, T("Watch the circle.", "Read sine and cosine.", "Projection explains the graphs.", "Change the angle.", "Solve a triangle.")),
      M("unit-circle", "Unit Circle", "/trigonometry", "Unit Circle & Angle Studio", "Explore angles, unit circle relationships, and exact trig values.", "Drag the terminal ray.", ["Angles", "Unit Circle", "Quadrants", "Exact Values", "Reference Angles"], { prompt: "sin(90°) = ?", expected: 1, hint: "The point is (0,1)." }, T("See how the point moves on the unit circle as θ changes.", "Understand projections, signs, and exact values.", "Discover the meaning behind the relationships.", "Practice with angles and check your understanding.", "Solve problems and apply trig concepts.")),
      M("right-triangle", "Right Triangle", "/trigonometry", "Right Triangle Studio", "Solve, explore, and master right triangles.", "SOH-CAH-TOA in motion.", ["Solve Triangle", "Ratios", "Pythagoras", "Similarity", "Special Triangles"], { prompt: "In a 30-60-90 triangle, short leg if hypotenuse is 2?", expected: 1, hint: "Short leg is half the hypotenuse." }, T("Move points and see how sides and angles change in real time.", "Explore ratios, the Pythagorean theorem, and right triangle facts.", "Discover the relationships behind the calculations.", "Change inputs or drag vertices to create your own problems.", "Solve triangle puzzles and beat your best time.")),
      M("graphs", "Functions & Graphs", "/trigonometry", "Trigonometric Functions & Graphs Studio", "Explore how transformations shape sine, cosine, and tangent graphs.", "Amplitude, period, phase.", ["Sine", "Cosine", "Tangent", "Transformations", "Comparison"], { prompt: "Period of sin(2x) in π units? Enter 1 for π.", expected: 1, hint: "Period is 2π/|b|." }, T("Drag a point on the unit circle or the graph to see them synchronize.", "Amplitude controls height. B controls period. C shifts left/right. D moves up/down.", "Transformations come from stretching and shifting the parent function.", "Change B to 2 and C to −π/2. What happens to the graph?", "Can you make the graph pass through (0, 1.5) with a period of π?")),
      M("identities", "Identities", "/trigonometry", "Identities & Visual Proofs Studio", "Explore and prove trigonometric identities with interactive visuals.", "Prove with the circle.", ["Pythagorean", "Angle Sum", "Double Angle", "Half Angle", "Product-Sum"], { prompt: "sin²θ + cos²θ = ?", expected: 1, hint: "Unit circle radius." }, T("Move θ.", "See the identity hold.", "The radius is identically 1.", "Expand sin(2θ).", "Verify a double-angle value.")),
      M("inverse", "Inverse Trig", "/trigonometry", "Inverse Trigonometry Studio", "Explore inverse trig functions, their restrictions, and geometric interpretations.", "Arcsin, arccos, arctan.", ["Arcsin", "Arccos", "Arctan", "Principal Values", "Compositions"], { prompt: "arcsin(1) in degrees?", expected: 90, hint: "Sine of 90° is 1." }, T("Restrict the range.", "Read the principal value.", "Inverse undoes on the principal branch.", "Compose sin(arcsin x).", "Find arctan(1).")),
      M("oblique", "Sine & Cosine Laws", "/trigonometry", "Oblique Triangle Studio", "Explore and solve non-right triangles using the Sine Law and Cosine Law.", "Sine and cosine laws.", ["Sine Law", "Cosine Law", "Area", "SSA Ambiguous Case", "Solve Triangle"], { prompt: "Area of SAS triangle a=2, b=2, included 90°?", expected: 2, hint: "(1/2)ab sin C." }, T("Manipulate the triangle and watch how sides and angles respond together.", "See how the Sine Law and Cosine Law connect sides and angles.", "Explore why the laws hold true for any triangle.", "Change the known values and solve new triangles.", "Test yourself with real-world problems and puzzles.")),
      M("waves", "Waves & Harmonics", "/trigonometry", "Waves & Harmonics Studio", "Explore, combine, and analyze periodic motion and harmonic phenomena.", "Build a wave.", ["Simple Wave", "Superposition", "Harmonics", "Beats", "Phase"], { prompt: "Beat frequency for 10 Hz and 12 Hz?", expected: 2, hint: "|f1 − f2|." }, T("Watch how changing frequency or phase alters the pattern.", "Learn how superposition creates interference and beats.", "Explore the connection between waves and circular motion.", "Adjust parameters to matching a target waveform.", "Build a waveform using specific harmonic coefficients.")),
      M("applications", "Applications", "/trigonometry", "Trigonometry Applications Studio", "Solve real-world measurement problems using right triangles and trigonometric relationships.", "Real-world triangles.", ["Heights & Distances", "Bearings", "Navigation", "Surveying", "Periodic Models"], { prompt: "Height if tan(45°)=h/10 with adjacent 10?", expected: 10, hint: "tan 45° = 1." }, T("Change the angle of elevation.", "Read the height.", "Tangent is opposite over adjacent.", "Work a bearing problem.", "Model a tide.")),
      M("ar", "AR Lab", "/trigonometry", "Trigonometry AR Lab", "Measure height and project waves in AR.", "Camera overlays.", ["Height Measurement", "Distance", "Angle", "Triangle Overlay", "Unit Circle", "Wave Projection"], { prompt: "If angle of elevation is 45° and distance is 8, height is?", expected: 8, hint: "tan 45° = 1." }, T("Point the camera.", "Read live angle.", "The overlay is a similar triangle.", "Measure a building.", "Project a unit circle."))
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
      M("home", "Studio Home", "/linear-algebra", "Linear Algebra Studio", "See linear maps in 2D and 3D.", "", [], { prompt: "0", expected: 0, hint: "" }, T("See patterns and visual structures.", "Connect ideas with concepts.", "Uncover the reasoning behind the math.", "Experiment and test your understanding.", "Push your skills and solve advanced problems.")),
      M("vectors", "Vectors", "/linear-algebra", "Vectors Lab", "Explore vectors in 3D: components, operations, dot & cross products, projections.", "2D and 3D vector ops.", ["Dot", "Cross", "Projections", "Add", "Subtract", "Scale"], { prompt: "Dot product of (1,0) and (0,1)?", expected: 0, hint: "Orthogonal vectors." }, T("Drag vector endpoints to explore operations and see values update in real time.", "Study relationships between vectors, angles, and how projections work geometrically.", "Dot product measures alignment. Cross product gives a perpendicular vector and area.", "Change vectors, compute projections, or test a × (b + c) = a × b + a × c.", "Can you make a · b = 0? What maximizes |a × b|?")),
      M("matrices", "Matrices", "/linear-algebra", "Matrices & Operations Lab", "Explore matrix arithmetic, properties, and geometric transformations.", "Live matrix algebra.", ["Multiply", "Add", "Inverse", "Transpose", "Block"], { prompt: "det([[1,0],[0,1]])?", expected: 1, hint: "Identity." }, T("See how A transforms the unit square, then B applies another transformation.", "Track how rows of A combine with columns of B to form the result.", "Determinants multiply: det(A × B) = det(A) · det(B).", "Edit entries, switch operations, or try non-square matrices.", "Find matrices A, B where A × B = I (but A and B are not square).")),
      M("row-reduction", "Row Reduction", "/linear-algebra", "Systems & Row Reduction Lab", "Solve Ax = b by row reducing the augmented matrix and visualize the solution set.", "3D / 2D / pivot map.", ["3D View", "2D View", "Pivot Map"], { prompt: "Rank of identity 2×2?", expected: 2, hint: "Two pivots." }, T("Watch how row operations preserve the solution set.", "See pivots form a staircase and free variables emerge.", "Row operations are elementary matrices — they don't change Ax = b.", "Modify the matrix or add a free variable. What happens?", "Create a system with infinitely many solutions.")),
      M("linear-transforms", "Linear Transforms", "/linear-algebra", "Linear Transformations Lab", "Explore how linear transformations map vectors, shapes, and bases.", "Presets and 2D/3D.", ["Identity", "R90", "Scale X", "Shear", "2D", "3D"], { prompt: "Rotation by 90° sends (1,0) to y=?", expected: 1, hint: "(0,1)." }, T("Adjust A, the basis, or move the interpolation slider to see the transformation in action.", "Linear transformations preserve lines and the origin, but change lengths, angles, and areas.", "Matrix multiplication encodes how basis vectors move—everything else follows.", "Create your own matrix, compose transforms, and predict the result before seeing it.", "Find a matrix that reflects across the line y = x and then stretches by 2 in the y-direction.")),
      M("determinants", "Determinants", "/linear-algebra", "Determinants Lab", "Explore area, volume, orientation, and singularity through determinants.", "Signed scale of maps.", ["2D Area", "3D Volume", "Cofactor", "Orientation", "Singularity"], { prompt: "det of a 90° rotation?", expected: 1, hint: "Rotation preserves area and orientation." }, T("Drag v1 and v2 to create different parallelograms. Watch the area change.", "The determinant tells how A scales area and whether it flips orientation.", "det(A) is the signed area factor: det(AB) = det(A) det(B).", "Create a matrix with det(A) = −2. What happens to area & orientation?", "Find a matrix with det(A) = −1 that swaps the axes.")),
      M("vector-spaces", "Vector Spaces", "/linear-algebra", "Vector Spaces & Basis Lab", "Explore spans, independence, bases, subspaces, and coordinates in R³.", "Live spanning set.", ["Span", "Independence", "Basis", "Subspaces", "Coordinates"], { prompt: "Dimension of R²?", expected: 2, hint: "Two independent directions." }, T("Toggle vectors and see how the span changes. Notice the plane they form.", "Rank tells you the dimension of the span. A basis is a minimal independent set.", "Dependence means one vector is a combination of others.", "Add or remove vectors to find a basis for the plane or for all of R³.", "Can you find a basis that includes v3 instead of v1 or v2?")),
      M("eigenvectors", "Eigenvectors", "/linear-algebra", "Eigenvalues & Eigenvectors Lab", "Transform a field of arrows and unit circle/ellipse; eigenvectors remain on invariant directions.", "2D, 3D, phase portrait.", ["2D View", "3D View", "Phase Portrait"], { prompt: "Eigenvalue of I₂ (either)?", expected: 1, hint: "Identity scales by 1." }, T("Watch how the circle transforms and eigenvectors remain fixed.", "See how eigenvalues scale along eigen directions.", "Learn why eigenvectors don't change direction under A.", "Adjust the matrix and explore different behaviors.", "Find a matrix with complex eigenvalues.")),
      M("orthogonality", "Orthogonality", "/linear-algebra", "Orthogonality & Projections Lab", "Project vectors onto lines and planes, build orthonormal bases with Gram-Schmidt.", "3D and 2D views.", ["3D View", "Vector Decomp", "2D Projections"], { prompt: "Length of a unit vector?", expected: 1, hint: "Normalized." }, T("v projects onto line span(u) at a right angle. The residual is orthogonal to u.", "Orthogonal projections minimize distance. They decompose v into independent parts.", "Orthogonality simplifies computations: dot products decouple components.", "Change vectors, switch steps, or try random examples.", "Can you build an ON basis from these vectors in a different order?")),
      M("least-squares", "Least Squares", "/linear-algebra", "Least Squares Lab", "Fit a line to data using least squares. Minimize the sum of squared residuals.", "Fit a line to data.", ["Fit", "Residuals", "Column Space"], { prompt: "Slope of least squares for points (0,0) and (1,2)?", expected: 2, hint: "The line through the origin and (1,2)." }, T("Drag points to see how the best-fit line and residuals update.", "See how projections onto the column space minimize error.", "Least squares solves min_x ||Ax − b||². Normal equations give x = (AᵀA)⁻¹ Aᵀb.", "Change the data or add noise to test the robustness.", "Add outliers or try a quadratic model. Can you do better?")),
      M("playground", "Transform Playground", "/linear-algebra", "2D & 3D Transformation Playground", "Explore linear transformations. Edit the matrix, drag the object, and see geometry come alive.", "Presets and a stack.", ["2D Canvas", "3D Canvas", "Compose"], { prompt: "Identity composed n times still has det?", expected: 1, hint: "det I = 1." }, T("What happens to lengths, angles, areas, and volumes?", "How does the matrix create this transformation?", "Why does det(A) control area/volume scale?", "Experiment with different matrices and objects.", "Can you build a transformation with a specific effect?")),
      M("cayley-hamilton", "Cayley–Hamilton", "/linear-algebra", "Cayley–Hamilton Lab", "Every square matrix satisfies its characteristic polynomial.", "Powers and inverses from p(A) = 0.", ["Theorem", "Powers", "Inverse", "Three by three"], { prompt: "A singular matrix has det 0. Enter 0.", expected: 0, hint: "The inverse formula divides by det(A)." }, T("Read the characteristic polynomial.", "Replace λ by A.", "Check that p(A) is the zero matrix.", "Reduce a power.", "Stop if the determinant is zero.")),
      M("diagonalization", "Diagonalization", "/linear-algebra", "Diagonalization Lab", "Build A = P D P⁻¹ when enough eigenvectors exist.", "2×2 workflow and 3×3 presets.", ["Workflow", "Visual", "Three by three"], { prompt: "A defective matrix is not diagonalizable. Enter 0.", expected: 0, hint: "Geometric multiplicity is too small." }, T("Find the eigenvalues.", "Count independent eigenvectors.", "Build P and D.", "Multiply back.", "Reject a defective example.")),
      M("quadratic-forms", "Quadratic Forms", "/linear-algebra", "Quadratic Forms Lab", "Classify xᵀ A x from eigenvalues and leading minors.", "Definite, semidefinite, and indefinite forms.", ["Classify", "Contours"], { prompt: "A negative determinant means indefinite. Enter 1.", expected: 1, hint: "The eigenvalues have opposite signs." }, T("Edit the symmetric matrix.", "Read the eigenvalues.", "Apply Sylvester only when the minors decide.", "Leave the semidefinite case to the eigenvalues.", "Move the test vector.")),
      M("principal-axes", "Principal Axes", "/linear-algebra", "Principal Axes Lab", "Rotate a conic onto its eigenvector axes.", "Orthogonal diagonalization of a symmetric matrix.", ["Axes", "Canonical"], { prompt: "A real symmetric matrix has an orthonormal eigenbasis. Enter 1.", expected: 1, hint: "Distinct eigenvalues are orthogonal." }, T("Read ax² + 2hxy + by².", "Find orthonormal eigenvectors.", "Form the rotation.", "Read λ₁ u² + λ₂ v².", "Watch the axes turn.")),
      M("matrix-factorizations", "Matrix Factorizations", "/linear-algebra", "Matrix Factorizations Lab", "Build LU, QR, and SVD from the elimination steps.", "Pivoting, orthonormal columns, and singular values.", ["LU", "Pivoted LU", "QR", "SVD"], { prompt: "A zero pivot needs a row swap. Enter 1.", expected: 1, hint: "That is partial pivoting." }, T("Watch the multipliers.", "Read L and U.", "Orthonormalize the columns.", "Read the singular values.", "Reject a singular pivot.")),
      M("similarity", "Similarity", "/linear-algebra", "Similar Matrices Lab", "Change basis without changing the linear map.", "Trace, determinant, and the characteristic polynomial.", ["Invariants", "Bases"], { prompt: "Similar matrices share a trace. Enter 1.", expected: 1, hint: "Trace is a similarity invariant." }, T("Choose A and an invertible P.", "Compute B.", "Compare the invariants.", "Reject a singular P.", "Open diagonalization as a special case.")),
      M("jordan-form", "Jordan Form", "/linear-algebra", "Jordan Form Lab", "Replace a missing eigenvector with a chain.", "2×2 blocks and one 3×3 block.", ["Chain", "Block"], { prompt: "A Jordan block of size 2 has geometric multiplicity 1. Enter 1.", expected: 1, hint: "Only one independent eigenvector." }, T("Compare algebraic and geometric multiplicity.", "Build the chain.", "Write the block.", "Rebuild A.", "Do not force a diagonal form."))
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
      M("home", "Studio Home", "/complex-numbers", "Complex Numbers Studio", "Plot, rotate, and transform z.", "", [], { prompt: "0", expected: 0, hint: "" }, T("Watch z move.", "Read modulus and argument.", "Geometry is algebra.", "Rotate by i.", "Find cube roots of −1.")),
      M("argand-plane", "Argand Plane", "/complex-numbers", "Argand Plane Lab", "Plot z, conjugate, modulus, argument, locus.", "Drag the blue point.", ["Plot", "Modulus", "Argument", "Conjugate", "Distance", "Locus"], { prompt: "|3+4i| = ?", expected: 5, hint: "3-4-5." }, T("Drag z.", "Read r and θ.", "Modulus is distance from origin.", "Show the conjugate.", "Open locus |z|=2.")),
      M("arithmetic", "Arithmetic", "/complex-numbers", "Complex Arithmetic & Geometry Lab", "Operate on complex numbers as vectors in the Argand plane.", "Parallelogram addition.", ["Add", "Subtract", "Multiply", "Divide", "Conjugate"], { prompt: "Re((2+i)+(1+2i))?", expected: 3, hint: "Add real parts." }, T("Drag points P and Q. Watch the sum update in real time.", "Vector addition uses the parallelogram rule in ℂ.", "Complex arithmetic — geometry in the Argand plane.", "Switch operations and explore products, quotients, and more.", "Can you make z₁ × z₂ purely imaginary?")),
      M("polar-forms", "Polar Forms", "/complex-numbers", "Polar & Exponential Forms Lab", "Convert between rectangular, polar, and exponential forms on the Argand plane.", "Linked sliders.", ["Rectangular", "Polar", "Exponential"], { prompt: "Argument of i in degrees?", expected: 90, hint: "Positive imaginary axis." }, T("Watch how forms stay in sync as you move sliders.", "See the geometry of modulus and argument clearly.", "Euler connects rotation on the unit circle to exponentials.", "Pick a point, change branch, see what happens.", "Convert tricky numbers and explore multiple branches.")),
      M("rotation", "Rotation", "/complex-numbers", "Multiplication as Rotation Lab", "Visualize z × w as a rotation and scaling in the complex plane.", "Spiral of powers.", ["Rotate", "Scale", "Sequence"], { prompt: "arg(i) in degrees?", expected: 90, hint: "Multiplying by i is +90°." }, T("Multiplication rotates by arg(w) and scales by |w|.", "Complex multiplication is similarity transform in the plane.", "Because r e^{iθ} = r (cos θ + i sin θ) represents rotation and scaling.", "Change θ to −60° and see rotation in the opposite direction.", "Find w such that wz = −z for any nonzero z.")),
      M("roots", "Roots", "/complex-numbers", "Roots of Complex Numbers Lab", "Explore nth roots, roots of unity, and polynomial roots on the Argand plane.", "De Moivre in action.", ["Square Roots", "nth Roots", "Roots of Unity", "Polynomial Roots"], { prompt: "How many 6th roots does a nonzero z have?", expected: 6, hint: "n distinct nth roots." }, T("The n roots lie on a circle of radius r^{1/n}, equally spaced by 360°/n.", "Roots are symmetric: angles differ by 360°/n. The polygon connects roots in order of increasing k.", "De Moivre's theorem links powers and roots via polar form, turning multiplication into angle addition.", "Change n, drag the angle θ, or try random z. Explore patterns and special cases.", "Find z such that one of its cube roots is purely imaginary. What about fourth roots?")),
      M("euler", "Euler Formula", "/complex-numbers", "Euler's Formula Lab", "Explore e^{iθ} = cos θ + i sin θ, its series, and the beautiful identity e^{iπ} + 1 = 0.", "Four linked views.", ["Unit Circle", "Helix", "Projections", "Taylor"], { prompt: "e^{iπ} + 1 = ?", expected: 0, hint: "Euler's identity." }, T("Watch e^{iθ} move on the unit circle and trace the helix in 3D.", "e^{iθ} has constant magnitude 1 and encodes pure rotation by θ.", "Taylor series of e^x extends to x=iθ, linking exponentials and trig.", "Change θ, terms, and trace length. Predict where e^{iθ} goes next.", "Prove e^{iπ} + 1 = 0 and explore e^{i2π} = 1. Can you generalize?")),
      M("loci", "Loci & Transforms", "/complex-numbers", "Loci & Transformations Lab", "Explore loci and how transformations reshape the complex plane.", "Before and after planes.", ["Circle Loci", "Line Loci", "Möbius", "Inversion", "Affine Map"], { prompt: "Möbius maps send generalized circles to circles. How many fixed points can a non-identity Möbius have at most?", expected: 2, hint: "Quadratic equation." }, T("See how the locus and grid transform in real time.", "Explore invariants, fixed points, and domain behavior.", "Möbius maps preserve cross-ratios and map generalized circles.", "Change the transformation, drag points, and experiment.", "Can you map this circle to a line? Find parameters to try.")),
      M("fractals", "Fractals", "/complex-numbers", "Mandelbrot & Julia Sets Lab", "Explore complex dynamics and fractal beauty.", "Linked Mandelbrot and Julia.", ["Mandelbrot Set", "Julia Set"], { prompt: "For c=0, is 0 in the Mandelbrot set? Enter 1 for yes.", expected: 1, hint: "Orbit stays at 0." }, T("See how varying c changes the Julia set.", "Points inside the set stay bounded; outside escape.", "Iterating z² + c reveals deep structure and chaos.", "Drag c, change iterations and palette.", "Find a c where the Julia set is disconnected.")),
      M("waves-circuits", "Waves & Circuits", "/complex-numbers", "Applications to Waves & Circuits Lab", "Unify phasors, AC circuits, and complex numbers. Visualize steady-state behavior.", "RLC in the complex plane.", ["Phasors", "AC Circuits", "Signal Rotation", "Impedance"], { prompt: "Power factor if φ=0°?", expected: 1, hint: "cos 0° = 1." }, T("Explore phasors, waves, and circuit response in real time.", "See how complex impedance controls magnitude and phase.", "Impedance encodes opposition and phase shift in AC circuits.", "Adjust components, frequency, and observe the effects.", "Match a target power factor and minimize current."))
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
      M("home", "Studio Home", "/mathematical-modelling", "Mathematical Modelling Studio", "Build, fit, and compare models.", "", [], { prompt: "0", expected: 0, hint: "" }, T("Explore real-world patterns and data.", "Build models that explain what's happening.", "Interpret results and uncover the reasoning.", "Experiment with assumptions and parameters.", "Test your thinking with real modelling tasks.")),
      M("motion", "Motion", "/mathematical-modelling", "Motion Modelling Lab", "Simulate motion, compare models, and assess prediction error.", "Compare models to data.", ["Projectile", "Vehicle", "Pursuit", "Drag"], { prompt: "Time of flight scale: if g doubles, hang time of a vertical toss falls by about what factor? Enter 0.71 for 1/√2.", expected: 0.71, hint: "t ~ 1/√g." }, T("Explore the motion and compare models to data.", "See how parameters and forces affect the motion.", "Learn the physics behind projectile motion.", "Adjust parameters and test your own scenarios.", "Can you minimize the error with the best model?")),
      M("population", "Population", "/mathematical-modelling", "Population Growth Lab", "Explore, compare, and simulate population models under different scenarios.", "Carrying capacity in view.", ["Exponential", "Logistic", "Harvesting", "Age Structured"], { prompt: "Logistic equilibrium is at K. If K=5000, equilibrium P=?", expected: 5e3, hint: "dP/dt=0 at K." }, T("What patterns do you see in the data and model curves?", "How do r and K affect long-term population size?", "Why does the logistic model level off while exponential does not?", "Test different scenarios and see how sensitive the outcomes are.", "Can you keep the population near K using harvesting?")),
      M("epidemics", "Epidemics", "/mathematical-modelling", "Epidemic Modelling Lab", "Explore, simulate, and compare epidemic models.", "Compartment flow.", ["SIR", "SEIR", "Vaccination", "Interventions"], { prompt: "If R0 < 1, outbreak dies out. Enter 1 if that statement is true.", expected: 1, hint: "Each case produces fewer than one new case." }, T("Explore the live dynamics and compare scenarios.", "Learn how parameters and interventions shape outcomes.", "Discover the mechanisms behind epidemic behavior.", "Test your own scenarios and see the impact.", "Can you keep Rₑ < 1 and stay within hospital capacity?")),
      M("finance", "Finance", "/mathematical-modelling", "Finance & Compound Interest Lab", "Model savings, loans, investments, inflation, and annuities.", "Nominal vs real value.", ["Savings", "Loans", "Investments", "Inflation", "Annuities"], { prompt: "If interest is 0%, $100 after 5 years is?", expected: 100, hint: "No growth." }, T("What patterns do you see in the growth curves?", "Why does compounding create exponential growth?", "How does inflation affect the real value?", "What if you increase contributions or the interest rate?", "Can you reach $2M in real value within 30 years?")),
      M("optimization", "Optimization", "/mathematical-modelling", "Optimization Modelling Lab", "Find the best decision under constraints. Compare models, evaluate trade-offs, and understand resources.", "Feasible region.", ["Production Planning", "Transport", "Design", "Allocation", "Scheduling"], { prompt: "If Max Z=50x+40y and (x,y)=(0,0), Z=?", expected: 0, hint: "Origin." }, T("Explore the feasible region, constraints and objective line.", "Identify binding constraints and shadow values.", "See how resources impact profit and solutions.", "Adjust resources, move objective line, and test scenarios.", "Can you increase profit with the same resources?")),
      M("networks", "Networks & Routing", "/mathematical-modelling", "Networks & Routing Lab", "Find optimal routes on networks using shortest path algorithms and traffic conditions.", "Live route search.", ["Dijkstra", "A*"], { prompt: "Shortest path in a graph of equal weights uses fewest hops. Enter 1 if true.", expected: 1, hint: "BFS/Dijkstra on unit weights." }, T("See how algorithms explore the network and find routes.", "Why some paths are better under current traffic and costs.", "How do heuristics reduce search time while preserving optimality?", "Change traffic, close roads, or switch algorithms and compare.", "Can you find a faster route with different assumptions?")),
      M("regression", "Regression", "/mathematical-modelling", "Regression & Prediction Lab", "Explore relationships, fit models, assess error, and make predictions.", "Train/validation split.", ["Scatter & Fit", "Residuals", "Diagnostics", "Prediction"], { prompt: "A perfect linear fit has R² = ?", expected: 1, hint: "All variance explained." }, T("Scatter shows a curved relationship with a peak around 28–30 °C.", "Polynomial model explains more variance with lower error.", "Linear misses the curvature; polynomial captures it.", "Adjust degree, handle outliers, or transform variables.", "Can you improve predictions and reduce extrapolation risk?")),
      M("periodic", "Periodic Models", "/mathematical-modelling", "Periodic Phenomena Lab", "Explore, model and predict repeating patterns in the real world.", "Harmonic comparison.", ["Tides", "Seasons", "Daylight", "Sound", "Cycles"], { prompt: "A sine with period 12 hours has frequency 1/12. Enter 12 for the period.", expected: 12, hint: "Period is on the slider." }, T("What patterns do you see? Zoom, inspect and measure.", "What drives these patterns? Explore parameters and theory.", "Why do the models differ? Link assumptions to fit quality.", "Test new models or change assumptions.", "Can you improve the model or predict further ahead?")),
      M("numerical", "Numerical Experiments", "/mathematical-modelling", "Numerical Experiments Lab", "Explore stochastic and deterministic computation through simulation and approximation.", "Estimate π.", ["Monte Carlo", "Iteration", "Random Walk", "Differential Approx.", "Sensitivity"], { prompt: "Monte Carlo π uses 4×(inside/total). If half the points are inside, estimate?", expected: 2, hint: "4×0.5." }, T("Watch random points fall and see the estimate emerge.", "Why does this work? Connect area, probability, and limits.", "What affects accuracy and convergence speed?", "Change N, seeds, and settings. Run batches and compare.", "Can you reach 6-digit accuracy for π? Optimize the experiment.")),
      M("comparison", "Model Comparison", "/mathematical-modelling", "Model Comparison & Error Lab", "Compare candidate models, evaluate error, and choose the best explanatory model.", "Pick the best model.", ["Compare", "Residuals", "Selection"], { prompt: "Lower RMSE is better. Enter 1 if true.", expected: 1, hint: "Error metric." }, T("Which model follows the data best? Check the fit and residuals.", "Why does one model outperform others? Explore assumptions.", "What causes underfit or overfit? Compare complexity and error.", "Adjust models, parameters, and see how performance changes.", "Can you build a better model with justified assumptions?"))
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
      M("home", "Studio Home", "/discrete-world", "Number & Discrete Mathematics Studio", "Numbers, logic, graphs, algorithms, crypto.", "", [], { prompt: "0", expected: 0, hint: "" }, T("Spot structure.", "Connect ideas.", "Prove a small claim.", "Run a tool.", "Solve the daily puzzle.")),
      M("number-sense", "Number Sense", "/discrete-world", "Number Sense & Number Lines Lab", "Compare and measure numbers on one line.", "Drag values on a line.", ["Integers", "Fractions", "Decimals", "Ratios", "Powers", "Scales"], { prompt: "Which is greater, −7 or −2? Enter the greater number.", expected: -2, hint: "Farther left is smaller." }, T("Watch unit ticks and hops.", "Order is position, not digit size.", "Distance is |a−b|.", "Drag a point or add a hop.", "Which is greater, −7 or −2?")),
      M("primes", "Primes & Factors", "/discrete-world", "Factors, Primes & Divisibility Lab", "Sieve, factor trees, GCD and LCM.", "Visual proofs of uniqueness.", ["Sieve of Eratosthenes", "Factor Tree", "GCD & LCM", "Divisibility Rules", "Prime Patterns"], { prompt: "gcd(84,60)?", expected: 12, hint: "Common primes with min powers." }, T("Run the sieve.", "See primes remain.", "Unique factorization.", "Change the range.", "Find a number with 18 divisors.")),
      M("modular-arithmetic", "Modular Arithmetic", "/discrete-world", "Modular Arithmetic Lab", "Clock arithmetic, inverses, linear congruences.", "Hops on a circle.", ["Clock Arithmetic", "Congruence", "Inverses", "Linear Congruences", "Cycles"], { prompt: "5×2 mod 12?", expected: 10, hint: "10 < 12." }, T("Animate hops.", "See the cycle length.", "Inverses exist when gcd(a,n)=1.", "Solve 5x≡10 (mod 12).", "Prove a congruence.")),
      M("number-patterns", "Number Patterns", "/discrete-world", "Number Patterns Lab", "Explore beautiful patterns in numbers — figurate numbers, recurrences, Pascal's triangle and fractals.", "Grow a pattern.", ["Figurate", "Recursive", "Pascal Triangle", "Fractals"], { prompt: "6th triangular number?", expected: 21, hint: "n(n+1)/2." }, T("See how each new row adds one more point.", "The nth triangular number is the total of the first n positive integers.", "Two copies of the triangle form an n × (n+1) rectangle.", "Change n and animate the construction.", "Find T20 without counting every dot.")),
      M("combinatorics", "Combinatorics", "/discrete-world", "Combinatorics Lab", "Arrangements, selections, inclusion-exclusion.", "Generating tree.", ["Arrangements", "Selections", "Pigeonhole", "Inclusion-Exclusion", "Generating Tree"], { prompt: "4 distinct items, all orders: 4! = ?", expected: 24, hint: "4×3×2×1." }, T("Toggle order.", "Watch the count.", "Order matters for permutations.", "Allow repeats.", "Count with no adjacent repeats.")),
      M("logic", "Logic", "/discrete-world", "Mathematical Logic Lab", "Gates, truth tables, satisfiability.", "Build a circuit.", ["Circuit", "Truth Table", "Equivalence", "CNF/DNF", "SAT"], { prompt: "True AND False is 0. Enter 0.", expected: 0, hint: "AND needs both true." }, T("Flip an input.", "See the table highlight.", "Gates compose formulas.", "Build XOR.", "Find a counterexample.")),
      M("sets", "Sets & Relations", "/discrete-world", "Sets & Relations Lab", "Venn, operations, relations, functions, equivalence.", "Drag elements.", ["Venn Diagram", "Operations", "Cartesian Products", "Relations", "Functions", "Equivalence"], { prompt: "|{1,2,3} ∪ {3,4}|?", expected: 4, hint: "1,2,3,4." }, T("Drag into a region.", "Read union and intersection.", "Functions pair each input once.", "Test symmetry.", "Make R an equivalence.")),
      M("graphs", "Graph Networks", "/discrete-world", "Graph Theory & Networks Lab", "Paths, coloring, spanning trees, flows.", "Run Dijkstra.", ["Paths", "Connectivity", "Coloring", "Spanning Trees", "Flows"], { prompt: "A tree with 5 vertices has how many edges?", expected: 4, hint: "n−1." }, T("Run the path.", "Read the cost.", "Dijkstra is optimal on nonnegative weights.", "Color the graph.", "Find a spanning tree.")),
      M("algorithms", "Algorithms", "/discrete-world", "Algorithms Lab", "Sorting, searching, Euclid, complexity.", "Step through Merge Sort.", ["Sorting", "Searching", "Euclid", "Graph Traversal", "Complexity"], { prompt: "Comparisons grow like n log n for merge sort. Enter 1 if true.", expected: 1, hint: "Divide and conquer." }, T("Step the sort.", "Read the pseudocode.", "Divide and conquer is O(n log n).", "Switch to bubble sort.", "Compare complexity curves.")),
      M("cryptography", "Cryptography", "/discrete-world", "Cryptography Playground", "Classic ciphers and RSA as number theory.", "Educational keys only.", ["Caesar", "Affine", "Vigenère", "RSA Concept", "Diffie-Hellman", "Hashing"], { prompt: "Caesar shift 0 leaves A as A. Enter 0.", expected: 0, hint: "Identity shift." }, T("Generate p and q.", "Watch modular exponentiation.", "RSA security is factoring n.", "Encrypt a letter.", "Decrypt with d."))
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
      M("home", "Studio Home", "/probability-statistics", "Statistics & Probability Studio", "From data to decisions.", "", [], { prompt: "0", expected: 0, hint: "" }, T("Explore a dataset.", "Summarize center and spread.", "See why CLT works.", "Run a test.", "Open a challenge.")),
      M("data-explorer", "Data Explorer", "/probability-statistics", "Data Explorer", "Import, filter, brush, and visualize.", "Histograms, scatter, box plots.", ["Overview", "Pairwise"], { prompt: "Median of 1,2,3?", expected: 2, hint: "Middle value." }, T("Brush a region.", "Read the selected summary.", "Association appears in the scatter.", "Filter a category.", "Name a pattern.")),
      M("descriptive", "Descriptive Stats", "/probability-statistics", "Descriptive Statistics Lab", "Center, spread, shape, outliers.", "Dot, box, histogram, Q-Q.", ["Center", "Spread", "Shape", "Outliers", "Grouped"], { prompt: "IQR if Q1=2 and Q3=6?", expected: 4, hint: "Q3−Q1." }, T("Drag an outlier.", "Watch the mean move.", "The median is resistant.", "Show ±2σ bands.", "Build a skewed set.")),
      M("interactive-distributions", "Distributions", "/probability-statistics", "Interactive Distributions Lab", "Normal, binomial, Poisson, t, chi-square.", "Shade probability.", ["Normal", "Binomial", "Poisson", "Exponential", "t", "Chi-square"], { prompt: "P(−1<Z<1) for standard normal is about 0.68. Enter 0.68.", expected: 0.68, hint: "68-95-99.7." }, T("Shade between a and b.", "Read the live probability.", "σ stretches the bell.", "Switch to binomial.", "Match a scenario.")),
      M("experiments", "Probability Experiments", "/probability-statistics", "Probability Experiments Lab", "Coins, dice, cards, Bayes.", "Empirical vs theoretical.", ["Coins", "Dice", "Cards", "Spinner", "Conditional", "Bayes"], { prompt: "P(sum=7) with two fair dice = 6/36. Enter 0.167.", expected: 0.167, hint: "Six outcomes out of 36." }, T("Run many trials.", "See the histogram fill.", "Relative frequency settles.", "Build an event.", "Estimate a rare event.")),
      M("counting", "Combinatorics", "/probability-statistics", "Combinatorics Lab", "Permutations, combinations, Pascal.", "Counting tree.", ["Permutations", "Combinations", "Arrangements", "Multisets", "Counting Tree", "Binomial Coefficients"], { prompt: "P(5,4) = 5!/(5-4)! = ?", expected: 120, hint: "5×4×3×2." }, T("Toggle order.", "Watch nPr vs nCr.", "Order matters for permutations.", "Read Pascal's row.", "Count with restrictions.")),
      M("clt", "Sampling & CLT", "/probability-statistics", "Sampling & Central Limit Theorem Lab", "Sampling distributions of the mean.", "Repeated samples.", ["Population", "Sampling", "CLT"], { prompt: "SE = σ/√n. If σ=10 and n=25, SE=?", expected: 2, hint: "10/5." }, T("Draw samples.", "Watch the mean-dot strip.", "Averages become normal.", "Increase n.", "Get an almost-normal sampling distribution.")),
      M("confidence-intervals", "Confidence Intervals", "/probability-statistics", "Confidence Intervals Lab", "Capture rate of repeated intervals.", "Mean, proportion, bootstrap.", ["Mean", "Proportion", "Two-sample", "Bootstrap"], { prompt: "A 95% CI aims to capture μ in 95 of 100 samples. Enter 95.", expected: 95, hint: "Confidence level." }, T("Run simulations.", "Count blue vs red intervals.", "Width grows with confidence.", "Change n.", "Get margin of error under 2.")),
      M("hypothesis", "Hypothesis Testing", "/probability-statistics", "Hypothesis Testing Lab", "p-values, power, Type I/II.", "One and two samples.", ["One Sample Mean", "Two Sample Mean", "Proportion", "Chi-Square", "Permutation Test"], { prompt: "If p=0.02 and α=0.05, reject H0? Enter 1 for yes.", expected: 1, hint: "p < α." }, T("Shift the null.", "See p-value change.", "Small p is evidence against H0.", "Change n.", "Inspect Type I / II.")),
      M("correlation", "Regression", "/probability-statistics", "Correlation & Regression Lab", "Fit, residuals, influential points.", "Drag points on the plot.", ["Linear Fit", "Residuals", "Prediction"], { prompt: "If all points are on a line with positive slope, r is 1. Enter 1.", expected: 1, hint: "Perfect correlation." }, T("Drag a point.", "Watch r and R².", "Residuals diagnose the fit.", "Show the confidence band.", "Predict at a new x.")),
      M("anova", "ANOVA & Design", "/probability-statistics", "ANOVA & Experimental Design Lab", "Group means, variation, CRD.", "Between vs within.", ["Group Comparison", "Variation Decomposition", "Design Canvas", "Diagnostics"], { prompt: "If observed group means are exactly equal and within-group variance is positive, F = ?", expected: 0, hint: "SSB is zero, so MSB/MSW is zero." }, T("Randomize treatments.", "Watch between vs within.", "F compares those mean squares.", "Add a group.", "Run post-hoc."))
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
      M("home", "Studio Home", "/differential-equations", "Differential Equations Studio", "Model change and visualize solution families.", "", [], { prompt: "0", expected: 0, hint: "" }, T("Read a slope as a local rule.", "Classify the equation before solving.", "A method matches a structure.", "Step through a substitution.", "Check a solution against a slope field.")),
      M("laplace", "Laplace Transforms", "/differential-equations", "Laplace Transforms & Step Responses", "Transform derivatives, retain initial data and model delayed forcing.", "Time and transform domains.", ["Time domain", "Transform domain"], { prompt: "L(y′) includes −y(0). Enter 1 if true.", expected: 1, hint: "Integration by parts retains the initial value." }, T("Move the input onset.", "Compare the exact response with Y(s).", "A time delay contributes e^(−τs).", "Change the forcing and decay.", "Predict the steady state.")),
      M("pde", "Heat & Wave Equations", "/differential-equations", "Heat & Wave Equation Modes", "Compare decay and oscillation under fixed endpoint conditions.", "Separated spatial eigenmodes.", ["Heat equation", "Wave equation"], { prompt: "A heat mode with positive diffusivity decays. Enter 1 if true.", expected: 1, hint: "The time factor is e^(−κλt)." }, T("Move time.", "Inspect endpoint values.", "Spatial eigenvalues determine time scales.", "Change the mode number.", "Verify the PDE by differentiation.")),
      M("boundary-values", "Boundary Values", "/differential-equations", "Boundary-Value Eigenfunctions", "Learn how endpoint conditions select nonzero modes.", "Dirichlet eigenfunctions.", ["Eigenvalues", "Eigenfunctions"], { prompt: "For L=π, the first eigenvalue is 1. Enter 1.", expected: 1, hint: "λ₁=(π/L)²." }, T("Select a mode.", "Check both boundary conditions.", "Only discrete eigenvalues admit nonzero modes.", "Change the domain length.", "Predict how λ scales with L.")),
      M("explorer", "Equation Explorer", "/differential-equations", "Differential Equation Explorer", "See what an equation claims before choosing a method.", "Order, linearity, and solution family.", ["Order", "Linear", "Family"], { prompt: "Order of y'' + 3y' + 2y = 0?", expected: 2, hint: "The highest derivative is the second." }, T("Pick an equation.", "Read order and linearity.", "A solution is a curve, not a slope.", "Compare a family with one initial condition.", "Name what is still unknown.")),
      M("slope-fields", "Direction Fields", "/differential-equations", "Direction Fields & Solution Curves", "Local slopes assemble into solution families.", "Click an initial condition on the field.", ["Slope field", "Curves"], { prompt: "For y'=y, the equilibrium is y=?", expected: 0, hint: "The slope is zero when y is zero." }, T("Watch the ticks.", "A curve must follow them.", "Nearby ticks reveal the family.", "Click a new initial point.", "Find where the slope vanishes.")),
      M("initial-value", "Initial Value Problems", "/differential-equations", "Initial Value Problems", "One admissible point selects one solution.", "Trace the curve through (x0, y0).", ["IVP"], { prompt: "How many initial values does y'=x-y need?", expected: 1, hint: "First order." }, T("Move the initial point.", "One curve is selected.", "The field still shows the family.", "Change y0.", "Keep the curve on the ticks.")),
      M("separable", "Separable Equations", "/differential-equations", "Separable Equations", "Split dy/dx = f(x)g(y) into two integrals.", "Separate, integrate, and compare with the field.", ["Separate"], { prompt: "For dy/dx = xy, separation uses dy/y = ? Enter 1 if it equals x dx.", expected: 1, hint: "Divide by y and multiply by dx." }, T("See the product slope.", "Separate the variables.", "Integration introduces C.", "Watch the family.", "Mark the singular solution y=0.")),
      M("homogeneous-first-order", "Homogeneous First-Order", "/differential-equations", "Homogeneous First-Order Equations", "Reduce a scale-invariant slope with y = vx.", "Substitution, separation, and back-substitution.", ["v = y/x"], { prompt: "The substitution uses v = y/x. Enter 1 if that is correct.", expected: 1, hint: "v measures the ray." }, T("Check equal degree.", "Introduce v.", "Differentiate y = vx.", "Separate the new equation.", "Return to x and y.")),
      M("exact", "Exact Equations", "/differential-equations", "Exact Differential Equations", "Test ∂M/∂y against ∂N/∂x and draw level curves.", "Potential functions and contours.", ["Exactness", "Potential"], { prompt: "If ∂M/∂y = ∂N/∂x, enter 1.", expected: 1, hint: "That is the exactness test." }, T("Read M and N.", "Compare the partials.", "Integrate M in x.", "Solve for g(y).", "Contours of F are solutions.")),
      M("linear-first-order", "Linear First-Order", "/differential-equations", "Linear Equations & Integrating Factor", "Turn the left side into a product derivative.", "P(x), Q(x), and the integrating factor.", ["Integrating factor"], { prompt: "For y'+y=x, the integrating factor is e^x. Enter 1.", expected: 1, hint: "∫P dx = x." }, T("Write standard form.", "Name P and Q.", "Build the integrating factor.", "Recognize a product derivative.", "Solve for y.")),
      M("bernoulli", "Bernoulli Equations", "/differential-equations", "Bernoulli Equations", "Change v = y^(1-n) into a linear equation.", "See n = 0 and n = 1 collapse.", ["Substitution"], { prompt: "For n=2, v = y to the power 1-n. Enter -1.", expected: -1, hint: "1-2 = -1." }, T("Read n.", "Skip the substitution when n is 0 or 1.", "Set v = y^(1-n).", "Solve the linear equation.", "Substitute back.")),
      M("method-selector", "Method Selector", "/differential-equations", "First-Order Method Selector", "Test structure, then open the matching lab.", "Separable, homogeneous, exact, linear, Bernoulli.", ["Diagnose"], { prompt: "dy/dx + y = y^2 is Bernoulli. Enter 1.", expected: 1, hint: "The power on y is not 0 or 1." }, T("Look before guessing.", "Commit to one method.", "Read the structural test.", "Open the lab.", "Try another preset.")),
      M("euler", "Euler Method", "/differential-equations", "Euler Method", "Follow the tangent for one step of size h.", "Compare the polygon with the exact curve.", ["Euler"], { prompt: "Smaller h usually cuts Euler error. Enter 1.", expected: 1, hint: "The local error is order h²." }, T("Take one tangent step.", "Shrink h.", "Watch the polygon approach the curve.", "Read the error.", "Compare with RK4.")),
      M("heun", "Improved Euler", "/differential-equations", "Improved Euler / Heun", "Average the starting slope with the predicted slope.", "Compare Euler, Heun, and RK4.", ["Heun"], { prompt: "Heun uses a predictor and a corrector. Enter 2.", expected: 2, hint: "Two slope evaluations." }, T("Predict with Euler.", "Sample the slope at the prediction.", "Average the two slopes.", "Compare errors.", "Shrink h.")),
      M("rk4", "Runge–Kutta RK4", "/differential-equations", "Runge–Kutta RK4", "Four slope samples per step.", "Stay close to the exact curve at larger h.", ["RK4"], { prompt: "How many slope samples does one RK4 step use?", expected: 4, hint: "k1 through k4." }, T("Read the four slopes.", "Compare with Euler at the same h.", "Shrink h.", "Watch the error drop.", "Keep the curve on the field.")),
      M("growth-models", "Growth & Decay", "/differential-equations", "Growth and Decay", "Exponential and logistic models from a slope rule.", "Carrying capacity flattens growth.", ["Growth"], { prompt: "Logistic growth levels off at the carrying capacity. Enter 1.", expected: 1, hint: "The factor (1-y/K) vanishes at y=K." }, T("Start near zero.", "Watch early exponential growth.", "Raise the carrying capacity.", "See the curve flatten.", "Compare with pure exponential growth.")),
      M("higher-order-linear", "Higher-Order Linear", "/differential-equations", "Higher-Order Linear ODEs", "Watch characteristic roots change the solution family.", "Distinct, repeated, and complex roots.", ["Roots", "Initial conditions"], { prompt: "A repeated root needs an extra factor of x. Enter 1.", expected: 1, hint: "The second solution is x e^{rx}." }, T("Move a, b, and c.", "Read the discriminant.", "Place the roots in the plane.", "Match the solution form.", "Set an initial condition.")),
      M("undetermined-coefficients", "Undetermined Coefficients", "/differential-equations", "Method of Undetermined Coefficients", "Match a trial to the forcing, then fix resonance.", "Polynomial, exponential, and trigonometric forcing.", ["Trial", "Resonance"], { prompt: "If the forcing is already a homogeneous solution, multiply the trial by x. Enter 1.", expected: 1, hint: "That is resonance." }, T("Solve the complementary function.", "Inspect the forcing.", "Reject a resonant trial.", "Equate coefficients.", "Write the general solution.")),
      M("variation-of-parameters", "Variation of Parameters", "/differential-equations", "Variation of Parameters", "Build a particular solution from the Wronskian.", "Two independent solutions and two integrals.", ["Wronskian"], { prompt: "A zero Wronskian means the two solutions are dependent. Enter 0.", expected: 0, hint: "Independence needs W ≠ 0." }, T("Name y1 and y2.", "Compute W.", "Form u1' and u2'.", "Integrate.", "Add the complementary function.")),
      M("cauchy-euler", "Cauchy–Euler", "/differential-equations", "Cauchy–Euler Equations", "Turn x^m into an algebraic equation for m.", "Real, repeated, and complex indicial roots.", ["Indicial"], { prompt: "The log substitution uses t = ln x and needs x > 0. Enter 1.", expected: 1, hint: "Stay on the positive axis." }, T("Substitute y = x^m.", "Read the indicial equation.", "Choose the solution form.", "Stay on x > 0.", "Compare with constant coefficients.")),
      M("systems", "Linear Systems", "/differential-equations", "Systems of First-Order ODEs", "Classify the origin from the eigenvalues of A.", "Nodes, saddles, spirals, and centers.", ["Eigenvalues", "Portrait"], { prompt: "Opposite-sign eigenvalues make a saddle. Enter 1.", expected: 1, hint: "One direction approaches and one leaves." }, T("Read the matrix.", "Compute trace and determinant.", "Name the equilibrium.", "Follow a trajectory.", "Compare with eigenvectors.")),
      M("phase-plane", "Phase Plane", "/differential-equations", "Phase Plane Explorer", "Click an initial condition and follow the vector field.", "Trajectories, arrows, and equilibrium type.", ["Click", "Field"], { prompt: "A center keeps trajectories on closed curves. Enter 1.", expected: 1, hint: "Pure rotation does not spiral in." }, T("Choose a preset.", "Click a point.", "Watch the direction of time.", "Toggle the field.", "Compare with the eigenvalue label.")),
      M("mechanical-oscillations", "Mechanical Oscillations", "/differential-equations", "Mechanical Oscillations", "See mass, damping, and stiffness move a spring.", "Underdamped, critical, and overdamped motion.", ["Damping ratio"], { prompt: "Critical damping has zeta equal to 1. Enter 1.", expected: 1, hint: "ζ = c / (2 sqrt(mk))." }, T("Set the mass.", "Raise damping through zeta = 1.", "Read the natural frequency.", "Add a force.", "Compare x(t) with the picture.")),
      M("lcr-circuit", "LCR Circuit", "/differential-equations", "LCR Circuits", "Map a series circuit onto the same second-order equation.", "Charge, current, and damping.", ["RLC"], { prompt: "Inductance plays the role of mass. Enter 1.", expected: 1, hint: "L q'' matches m x''." }, T("Read the schematic.", "Change R.", "Watch zeta.", "Compare charge and current.", "Open the mechanical twin.")),
      M("newton-cooling", "Newton Cooling", "/differential-equations", "Newton Cooling", "Watch a temperature gap decay toward the room.", "Cooling, warming, and half-gap time.", ["Exponential"], { prompt: "The half-gap time is ln 2 over k. Enter 1 if that is the formula.", expected: 1, hint: "Solve e^{-kt} = 1/2." }, T("Set the initial temperature.", "Move the room temperature.", "Change k.", "Read the half-gap time.", "Start below the room and watch warming."))
    ]
  }
};
Object.values(es).flatMap(
  (a) => a.pages.map((e) => ({ studio: a.id, path: e.route.replace(/^\//, ""), pageId: e.id }))
);
function aa(a) {
  return a == null || typeof a == "string" || typeof a == "boolean" ? !0 : typeof a == "number" ? Number.isFinite(a) : Array.isArray(a) ? a.every(aa) : typeof a == "object" && Object.getPrototypeOf(a) === Object.prototype && Object.values(a).every(aa);
}
function Sa(a, e) {
  return aa(e) ? a == null ? !0 : Array.isArray(a) ? Array.isArray(e) && (a.length === 0 || e.every((t) => Sa(a[0], t))) : typeof a == "object" ? !!e && typeof e == "object" && !Array.isArray(e) && Object.entries(a).every(([t, r]) => t in e && Sa(r, e[t])) : typeof a == typeof e : !1;
}
const ba = (a) => Object.fromEntries(Object.entries(a).map(([e, t]) => [e, t === void 0 ? void 0 : structuredClone(t)]));
class Zo {
  constructor(e = {}) {
    Fe(this, "values", {});
    Fe(this, "bindings", /* @__PURE__ */ new Map());
    Fe(this, "past", []);
    Fe(this, "future", []);
    Fe(this, "defaults", {});
    Fe(this, "coalescing", !1);
    Fe(this, "gestureActive", !1);
    Fe(this, "beginGesture", () => {
      this.gestureActive = !0, this.coalescing = !1;
    });
    Fe(this, "endGesture", () => {
      this.gestureActive = !1, this.coalescing = !1;
    });
    Fe(this, "revision", 0);
    Fe(this, "listeners", /* @__PURE__ */ new Set());
    Fe(this, "subscribe", (e) => (this.listeners.add(e), () => {
      this.listeners.delete(e);
    }));
    Fe(this, "version", () => this.revision);
    Fe(this, "undo", () => {
      this.coalescing = !1;
      const e = this.past.pop();
      e && (this.future.push(ba(this.values)), this.apply(e));
    });
    Fe(this, "redo", () => {
      this.coalescing = !1;
      const e = this.future.pop();
      e && (this.past.push(ba(this.values)), this.apply(e));
    });
    Fe(this, "reset", () => {
      this.coalescing = !1;
      const e = { ...this.values };
      Object.entries(this.defaults).forEach(([t, r]) => {
        e[t] = r;
      }), JSON.stringify(e) !== JSON.stringify(this.values) && (this.past.push(ba(this.values)), this.future = [], this.apply(e));
    });
    this.saved = e;
  }
  notify() {
    this.revision++, this.listeners.forEach((e) => e());
  }
  initial(e, t) {
    const r = Object.prototype.hasOwnProperty.call(this.values, e) ? this.values : this.saved;
    return Object.prototype.hasOwnProperty.call(r, e) && Sa(t, r[e]) ? r[e] : t;
  }
  register(e, t, r, i) {
    return this.bindings.set(e, { initial: t, set: i }), this.defaults[e] = t, Object.prototype.hasOwnProperty.call(this.values, e) || (this.values[e] = r, this.past.forEach((n) => {
      n[e] = r;
    }), this.future.forEach((n) => {
      n[e] = r;
    })), this.notify(), () => {
      this.bindings.delete(e);
    };
  }
  commit(e, t, r = !1) {
    var i;
    aa(t) && JSON.stringify(this.values[e]) !== JSON.stringify(t) && ((!r || !this.coalescing) && this.past.push(ba(this.values)), r && !this.coalescing && (this.coalescing = !0, queueMicrotask(() => {
      this.gestureActive || (this.coalescing = !1);
    })), this.past.length > 100 && this.past.shift(), this.future = [], this.values = { ...this.values, [e]: t }, (i = this.bindings.get(e)) == null || i.set(t), this.notify());
  }
  apply(e) {
    this.values = ba(e), this.bindings.forEach((t, r) => {
      r in e && Sa(t.initial, e[r]) && t.set(e[r]);
    }), this.notify();
  }
}
function Jo(a) {
  const e = JSON.stringify(a), t = new TextEncoder().encode(e);
  let r = "";
  return t.forEach((i) => {
    r += String.fromCharCode(i);
  }), btoa(r).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function Qo(a, e) {
  if (!a) return e;
  try {
    const t = a.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(a.length / 4) * 4, "="), r = atob(t), i = new TextDecoder().decode(Uint8Array.from(r, (l) => e0(l))), n = JSON.parse(i);
    return n && typeof n == "object" ? { ...e, ...n } : e;
  } catch {
    return e;
  }
}
function e0(a) {
  return a.charCodeAt(0);
}
const fi = Co(null);
function t0({ children: a }) {
  const [e, t] = Vn(), { pathname: r } = Gn(), [i] = ce(() => {
    const S = Qo(e.get("fig"), { version: 1, values: {} });
    return new Zo(S.version === 1 && S.values && aa(S.values) ? S.values : {});
  }), [n, l] = ce(e.get("exact") === "1"), [u, d] = ce("");
  $n(() => () => {
  }, [n]);
  const p = Gr((S) => {
    l(S);
  }, []), f = Gr(async () => {
    const S = new URLSearchParams(window.location.search);
    S.set("fig", Jo({ version: 1, values: i.values })), n ? S.set("exact", "1") : S.delete("exact");
    const w = `${window.location.origin}${r}?${S}`;
    t(S, { replace: !0 });
    try {
      await navigator.clipboard.writeText(w), d("Link copied with the current model values and selected mode.");
    } catch {
      d("Figure saved in this page URL. Copy the address to share it.");
    }
  }, [n, i, r, t]), b = Yr(() => ({ ledger: i, exact: n, setExact: p, share: f, status: u }), [i, n, p, f, u]);
  return /* @__PURE__ */ o.jsx(fi.Provider, { value: b, children: a });
}
function nr() {
  const a = Wn(fi), e = (a == null ? void 0 : a.ledger.subscribe) ?? (() => () => {
  }), t = (a == null ? void 0 : a.ledger.version) ?? (() => 0);
  return To(e, t, t), a;
}
function Ja(a, e, t = !0) {
  const r = Wn(fi), i = _a(null);
  i.current || (i.current = { value: typeof e == "function" ? e() : e });
  const n = i.current.value, [l, u] = ce(() => t && r ? r.ledger.initial(a, n) : n), d = _a(l);
  d.current = l;
  const p = t && !!r && aa(n);
  $n(() => {
    if (!(!p || !r))
      return r.ledger.register(a, n, d.current, (b) => {
        d.current = b, u(b);
      });
  }, [r == null ? void 0 : r.ledger, n, a, p]);
  const f = Gr((b) => {
    const S = typeof b == "function" ? b(d.current) : b;
    p && r && Sa(n, S) ? r.ledger.commit(a, S, !0) : (d.current = S, u(S));
  }, [r == null ? void 0 : r.ledger, n, a, p]);
  return [l, f];
}
class B extends Error {
  // The underlying error message without any context added.
  constructor(e, t) {
    var r = "KaTeX parse error: " + e, i, n, l = t && t.loc;
    if (l && l.start <= l.end) {
      var u = l.lexer.input;
      i = l.start, n = l.end, i === u.length ? r += " at end of input: " : r += " at position " + (i + 1) + ": ";
      var d = u.slice(i, n).replace(/[^]/g, "$&̲"), p;
      i > 15 ? p = "…" + u.slice(i - 15, i) : p = u.slice(0, i);
      var f;
      n + 15 < u.length ? f = u.slice(n, n + 15) + "…" : f = u.slice(n), r += p + d + f;
    }
    super(r), this.name = "ParseError", this.position = void 0, this.length = void 0, this.rawMessage = void 0, Object.setPrototypeOf(this, B.prototype), this.position = i, i != null && n != null && (this.length = n - i), this.rawMessage = e;
  }
}
var a0 = /([A-Z])/g, r0 = (a) => a.replace(a0, "-$1").toLowerCase(), i0 = {
  "&": "&amp;",
  ">": "&gt;",
  "<": "&lt;",
  '"': "&quot;",
  "'": "&#x27;"
}, n0 = /[&><"']/g, Ne = (a) => String(a).replace(n0, (e) => i0[e]), Ka = (a) => a.type === "ordgroup" || a.type === "color" ? a.body.length === 1 ? Ka(a.body[0]) : a : a.type === "font" ? Ka(a.body) : a, s0 = /* @__PURE__ */ new Set(["mathord", "textord", "atom"]), wt = (a) => s0.has(Ka(a).type), o0 = (a) => {
  var e = /^[\x00-\x20]*([^\\/#?]*?)(:|&#0*58|&#x0*3a|&colon)/i.exec(a);
  return e ? e[2] !== ":" || !/^[a-zA-Z][a-zA-Z0-9+\-.]*$/.test(e[1]) ? null : e[1].toLowerCase() : "_relative";
}, Kr = {
  displayMode: {
    type: "boolean",
    description: "Render math in display mode, which puts the math in display style (so \\int and \\sum are large, for example), and centers the math on the page on its own line.",
    cli: "-d, --display-mode"
  },
  output: {
    type: {
      enum: ["htmlAndMathml", "html", "mathml"]
    },
    description: "Determines the markup language of the output.",
    cli: "-F, --format <type>"
  },
  leqno: {
    type: "boolean",
    description: "Render display math in leqno style (left-justified tags)."
  },
  fleqn: {
    type: "boolean",
    description: "Render display math flush left."
  },
  throwOnError: {
    type: "boolean",
    default: !0,
    cli: "-t, --no-throw-on-error",
    cliDescription: "Render errors (in the color given by --error-color) instead of throwing a ParseError exception when encountering an error."
  },
  errorColor: {
    type: "string",
    default: "#cc0000",
    cli: "-c, --error-color <color>",
    cliDescription: "A color string given in the format 'rgb' or 'rrggbb' (no #). This option determines the color of errors rendered by the -t option.",
    cliProcessor: (a) => "#" + a
  },
  macros: {
    type: "object",
    cli: "-m, --macro <def>",
    cliDescription: "Define custom macro of the form '\\foo:expansion' (use multiple -m arguments for multiple macros).",
    cliDefault: [],
    cliProcessor: (a, e) => (e.push(a), e)
  },
  minRuleThickness: {
    type: "number",
    description: "Specifies a minimum thickness, in ems, for fraction lines, `\\sqrt` top lines, `{array}` vertical lines, `\\hline`, `\\hdashline`, `\\underline`, `\\overline`, and the borders of `\\fbox`, `\\boxed`, and `\\fcolorbox`.",
    processor: (a) => Math.max(0, a),
    cli: "--min-rule-thickness <size>",
    cliProcessor: parseFloat
  },
  colorIsTextColor: {
    type: "boolean",
    description: "Makes \\color behave like LaTeX's 2-argument \\textcolor, instead of LaTeX's one-argument \\color mode change.",
    cli: "-b, --color-is-text-color"
  },
  strict: {
    type: [{
      enum: ["warn", "ignore", "error"]
    }, "boolean", "function"],
    description: "Turn on strict / LaTeX faithfulness mode, which throws an error if the input uses features that are not supported by LaTeX.",
    cli: "-S, --strict",
    cliDefault: !1
  },
  trust: {
    type: ["boolean", "function"],
    description: "Trust the input, enabling all HTML features such as \\url.",
    cli: "-T, --trust"
  },
  maxSize: {
    type: "number",
    default: 1 / 0,
    description: "If non-zero, all user-specified sizes, e.g. in \\rule{500em}{500em}, will be capped to maxSize ems. Otherwise, elements and spaces can be arbitrarily large",
    processor: (a) => Math.max(0, a),
    cli: "-s, --max-size <n>",
    cliProcessor: parseInt
  },
  maxExpand: {
    type: "number",
    default: 1e3,
    description: "Limit the number of macro expansions to the specified number, to prevent e.g. infinite macro loops. If set to Infinity, the macro expander will try to fully expand as in LaTeX.",
    processor: (a) => Math.max(0, a),
    cli: "-e, --max-expand <n>",
    cliProcessor: (a) => a === "Infinity" ? 1 / 0 : parseInt(a)
  },
  globalGroup: {
    type: "boolean",
    cli: !1
  }
};
function l0(a) {
  if (typeof a != "string")
    return a.enum[0];
  switch (a) {
    case "boolean":
      return !1;
    case "string":
      return "";
    case "number":
      return 0;
    case "object":
      return {};
    default:
      throw new Error("Unexpected schema type; settings must declare an explicit default.");
  }
}
function c0(a) {
  if (a.default !== void 0)
    return a.default;
  var e = Array.isArray(a.type) ? a.type[0] : a.type;
  return l0(e);
}
function u0(a, e, t, r) {
  var i = t[e];
  a[e] = i !== void 0 ? r.processor ? r.processor(i) : i : c0(r);
}
class gi {
  constructor(e) {
    e === void 0 && (e = {}), this.displayMode = void 0, this.output = void 0, this.leqno = void 0, this.fleqn = void 0, this.throwOnError = void 0, this.errorColor = void 0, this.macros = void 0, this.minRuleThickness = void 0, this.colorIsTextColor = void 0, this.strict = void 0, this.trust = void 0, this.maxSize = void 0, this.maxExpand = void 0, this.globalGroup = void 0, e = e || {};
    for (var t of Object.keys(Kr)) {
      var r = Kr[t];
      r && u0(this, t, e, r);
    }
  }
  /**
   * Report nonstrict (non-LaTeX-compatible) input.
   * Can safely not be called if `this.strict` is false in JavaScript.
   */
  reportNonstrict(e, t, r) {
    var i = this.strict;
    if (typeof i == "function" && (i = i(e, t, r)), !(!i || i === "ignore")) {
      if (i === !0 || i === "error")
        throw new B("LaTeX-incompatible input and strict mode is set to 'error': " + (t + " [" + e + "]"), r);
      i === "warn" ? typeof console < "u" && console.warn("LaTeX-incompatible input and strict mode is set to 'warn': " + (t + " [" + e + "]")) : typeof console < "u" && console.warn("LaTeX-incompatible input and strict mode is set to " + ("unrecognized '" + i + "': " + t + " [" + e + "]"));
    }
  }
  /**
   * Check whether to apply strict (LaTeX-adhering) behavior for unusual
   * input (like `\\`).  Unlike `nonstrict`, will not throw an error;
   * instead, "error" translates to a return value of `true`, while "ignore"
   * translates to a return value of `false`.  May still print a warning:
   * "warn" prints a warning and returns `false`.
   * This is for the second category of `errorCode`s listed in the README.
   */
  useStrictBehavior(e, t, r) {
    var i = this.strict;
    if (typeof i == "function")
      try {
        i = i(e, t, r);
      } catch {
        i = "error";
      }
    return !i || i === "ignore" ? !1 : i === !0 || i === "error" ? !0 : i === "warn" ? (typeof console < "u" && console.warn("LaTeX-incompatible input and strict mode is set to 'warn': " + (t + " [" + e + "]")), !1) : (typeof console < "u" && console.warn("LaTeX-incompatible input and strict mode is set to " + ("unrecognized '" + i + "': " + t + " [" + e + "]")), !1);
  }
  /**
   * Check whether to test potentially dangerous input, and return
   * `true` (trusted) or `false` (untrusted).  The sole argument `context`
   * should be an object with `command` field specifying the relevant LaTeX
   * command (as a string starting with `\`), and any other arguments, etc.
   * If `context` has a `url` field, a `protocol` field will automatically
   * get added by this function (changing the specified object).
   */
  isTrusted(e) {
    if ("url" in e && e.url && !e.protocol) {
      var t = o0(e.url);
      if (t == null)
        return !1;
      e.protocol = t;
    }
    var r = typeof this.trust == "function" ? this.trust(e) : this.trust;
    return !!r;
  }
}
class Tt {
  constructor(e, t, r) {
    this.id = void 0, this.size = void 0, this.cramped = void 0, this.id = e, this.size = t, this.cramped = r;
  }
  /**
   * Get the style of a superscript given a base in the current style.
   */
  sup() {
    return st[d0[this.id]];
  }
  /**
   * Get the style of a subscript given a base in the current style.
   */
  sub() {
    return st[h0[this.id]];
  }
  /**
   * Get the style of a fraction numerator given the fraction in the current
   * style.
   */
  fracNum() {
    return st[m0[this.id]];
  }
  /**
   * Get the style of a fraction denominator given the fraction in the current
   * style.
   */
  fracDen() {
    return st[p0[this.id]];
  }
  /**
   * Get the cramped version of a style (in particular, cramping a cramped style
   * doesn't change the style).
   */
  cramp() {
    return st[f0[this.id]];
  }
  /**
   * Get a text or display version of this style.
   */
  text() {
    return st[g0[this.id]];
  }
  /**
   * Return true if this style is tightly spaced (scriptstyle/scriptscriptstyle)
   */
  isTight() {
    return this.size >= 2;
  }
}
var vi = 0, Qa = 1, ta = 2, bt = 3, ka = 4, at = 5, ra = 6, We = 7, st = [new Tt(vi, 0, !1), new Tt(Qa, 0, !0), new Tt(ta, 1, !1), new Tt(bt, 1, !0), new Tt(ka, 2, !1), new Tt(at, 2, !0), new Tt(ra, 3, !1), new Tt(We, 3, !0)], d0 = [ka, at, ka, at, ra, We, ra, We], h0 = [at, at, at, at, We, We, We, We], m0 = [ta, bt, ka, at, ra, We, ra, We], p0 = [bt, bt, at, at, We, We, We, We], f0 = [Qa, Qa, bt, bt, at, at, We, We], g0 = [vi, Qa, ta, bt, ta, bt, ta, bt], ee = {
  DISPLAY: st[vi],
  TEXT: st[ta],
  SCRIPT: st[ka],
  SCRIPTSCRIPT: st[ra]
}, Xr = [{
  // Latin characters beyond the Latin-1 characters we have metrics for.
  // Needed for Czech, Hungarian and Turkish text, for example.
  name: "latin",
  blocks: [
    [256, 591],
    // Latin Extended-A and Latin Extended-B
    [768, 879]
    // Combining Diacritical marks
  ]
}, {
  // The Cyrillic script used by Russian and related languages.
  // A Cyrillic subset used to be supported as explicitly defined
  // symbols in symbols.js
  name: "cyrillic",
  blocks: [[1024, 1279]]
}, {
  // Armenian
  name: "armenian",
  blocks: [[1328, 1423]]
}, {
  // The Brahmic scripts of South and Southeast Asia
  // Devanagari (0900–097F)
  // Bengali (0980–09FF)
  // Gurmukhi (0A00–0A7F)
  // Gujarati (0A80–0AFF)
  // Oriya (0B00–0B7F)
  // Tamil (0B80–0BFF)
  // Telugu (0C00–0C7F)
  // Kannada (0C80–0CFF)
  // Malayalam (0D00–0D7F)
  // Sinhala (0D80–0DFF)
  // Thai (0E00–0E7F)
  // Lao (0E80–0EFF)
  // Tibetan (0F00–0FFF)
  // Myanmar (1000–109F)
  name: "brahmic",
  blocks: [[2304, 4255]]
}, {
  name: "georgian",
  blocks: [[4256, 4351]]
}, {
  // Chinese and Japanese.
  // The "k" in cjk is for Korean, but we've separated Korean out
  name: "cjk",
  blocks: [
    [12288, 12543],
    // CJK symbols and punctuation, Hiragana, Katakana
    [19968, 40879],
    // CJK ideograms
    [65280, 65376]
    // Fullwidth punctuation
    // TODO: add halfwidth Katakana and Romanji glyphs
  ]
}, {
  // Korean
  name: "hangul",
  blocks: [[44032, 55215]]
}];
function v0(a) {
  for (var e = 0; e < Xr.length; e++)
    for (var t = Xr[e], r = 0; r < t.blocks.length; r++) {
      var i = t.blocks[r];
      if (a >= i[0] && a <= i[1])
        return t.name;
    }
  return null;
}
var Xa = [];
Xr.forEach((a) => a.blocks.forEach((e) => Xa.push(...e)));
function ts(a) {
  for (var e = 0; e < Xa.length; e += 2)
    if (a >= Xa[e] && a <= Xa[e + 1])
      return !0;
  return !1;
}
var De = (a) => a + " " + a, Qt = 80, b0 = function(e, t) {
  return "M95," + (622 + e + t) + `
c-2.7,0,-7.17,-2.7,-13.5,-8c-5.8,-5.3,-9.5,-10,-9.5,-14
c0,-2,0.3,-3.3,1,-4c1.3,-2.7,23.83,-20.7,67.5,-54
c44.2,-33.3,65.8,-50.3,66.5,-51c1.3,-1.3,3,-2,5,-2c4.7,0,8.7,3.3,12,10
s173,378,173,378c0.7,0,35.3,-71,104,-213c68.7,-142,137.5,-285,206.5,-429
c69,-144,104.5,-217.7,106.5,-221
l` + e / 2.075 + " -" + e + `
c5.3,-9.3,12,-14,20,-14
H400000v` + (40 + e) + `H845.2724
s-225.272,467,-225.272,467s-235,486,-235,486c-2.7,4.7,-9,7,-19,7
c-6,0,-10,-1,-12,-3s-194,-422,-194,-422s-65,47,-65,47z
M` + (834 + e) + " " + t + "h400000v" + (40 + e) + "h-400000z";
}, y0 = function(e, t) {
  return "M263," + (601 + e + t) + `c0.7,0,18,39.7,52,119
c34,79.3,68.167,158.7,102.5,238c34.3,79.3,51.8,119.3,52.5,120
c340,-704.7,510.7,-1060.3,512,-1067
l` + e / 2.084 + " -" + e + `
c4.7,-7.3,11,-11,19,-11
H40000v` + (40 + e) + `H1012.3
s-271.3,567,-271.3,567c-38.7,80.7,-84,175,-136,283c-52,108,-89.167,185.3,-111.5,232
c-22.3,46.7,-33.8,70.3,-34.5,71c-4.7,4.7,-12.3,7,-23,7s-12,-1,-12,-1
s-109,-253,-109,-253c-72.7,-168,-109.3,-252,-110,-252c-10.7,8,-22,16.7,-34,26
c-22,17.3,-33.3,26,-34,26s-26,-26,-26,-26s76,-59,76,-59s76,-60,76,-60z
M` + (1001 + e) + " " + t + "h400000v" + (40 + e) + "h-400000z";
}, x0 = function(e, t) {
  return "M983 " + (10 + e + t) + `
l` + e / 3.13 + " -" + e + `
c4,-6.7,10,-10,18,-10 H400000v` + (40 + e) + `
H1013.1s-83.4,268,-264.1,840c-180.7,572,-277,876.3,-289,913c-4.7,4.7,-12.7,7,-24,7
s-12,0,-12,0c-1.3,-3.3,-3.7,-11.7,-7,-25c-35.3,-125.3,-106.7,-373.3,-214,-744
c-10,12,-21,25,-33,39s-32,39,-32,39c-6,-5.3,-15,-14,-27,-26s25,-30,25,-30
c26.7,-32.7,52,-63,76,-91s52,-60,52,-60s208,722,208,722
c56,-175.3,126.3,-397.3,211,-666c84.7,-268.7,153.8,-488.2,207.5,-658.5
c53.7,-170.3,84.5,-266.8,92.5,-289.5z
M` + (1001 + e) + " " + t + "h400000v" + (40 + e) + "h-400000z";
}, w0 = function(e, t) {
  return "M424," + (2398 + e + t) + `
c-1.3,-0.7,-38.5,-172,-111.5,-514c-73,-342,-109.8,-513.3,-110.5,-514
c0,-2,-10.7,14.3,-32,49c-4.7,7.3,-9.8,15.7,-15.5,25c-5.7,9.3,-9.8,16,-12.5,20
s-5,7,-5,7c-4,-3.3,-8.3,-7.7,-13,-13s-13,-13,-13,-13s76,-122,76,-122s77,-121,77,-121
s209,968,209,968c0,-2,84.7,-361.7,254,-1079c169.3,-717.3,254.7,-1077.7,256,-1081
l` + e / 4.223 + " -" + e + `c4,-6.7,10,-10,18,-10 H400000
v` + (40 + e) + `H1014.6
s-87.3,378.7,-272.6,1166c-185.3,787.3,-279.3,1182.3,-282,1185
c-2,6,-10,9,-24,9
c-8,0,-12,-0.7,-12,-2z M` + (1001 + e) + " " + t + `
h400000v` + (40 + e) + "h-400000z";
}, A0 = function(e, t) {
  return "M473," + (2713 + e + t) + `
c339.3,-1799.3,509.3,-2700,510,-2702 l` + e / 5.298 + " -" + e + `
c3.3,-7.3,9.3,-11,18,-11 H400000v` + (40 + e) + `H1017.7
s-90.5,478,-276.2,1466c-185.7,988,-279.5,1483,-281.5,1485c-2,6,-10,9,-24,9
c-8,0,-12,-0.7,-12,-2c0,-1.3,-5.3,-32,-16,-92c-50.7,-293.3,-119.7,-693.3,-207,-1200
c0,-1.3,-5.3,8.7,-16,30c-10.7,21.3,-21.3,42.7,-32,64s-16,33,-16,33s-26,-26,-26,-26
s76,-153,76,-153s77,-151,77,-151c0.7,0.7,35.7,202,105,604c67.3,400.7,102,602.7,104,
606zM` + (1001 + e) + " " + t + "h400000v" + (40 + e) + "H1017.7z";
}, S0 = function(e) {
  var t = e / 2;
  return "M400000 " + e + " H0 L" + t + " 0 l65 45 L145 " + (e - 80) + " H400000z";
}, k0 = function(e, t, r) {
  var i = r - 54 - t - e;
  return "M702 " + (e + t) + "H400000" + (40 + e) + `
H742v` + i + `l-4 4-4 4c-.667.7 -2 1.5-4 2.5s-4.167 1.833-6.5 2.5-5.5 1-9.5 1
h-12l-28-84c-16.667-52-96.667 -294.333-240-727l-212 -643 -85 170
c-4-3.333-8.333-7.667-13 -13l-13-13l77-155 77-156c66 199.333 139 419.667
219 661 l218 661zM702 ` + t + "H400000v" + (40 + e) + "H742z";
}, C0 = function(e, t, r) {
  t = 1e3 * t;
  var i = "";
  switch (e) {
    case "sqrtMain":
      i = b0(t, Qt);
      break;
    case "sqrtSize1":
      i = y0(t, Qt);
      break;
    case "sqrtSize2":
      i = x0(t, Qt);
      break;
    case "sqrtSize3":
      i = w0(t, Qt);
      break;
    case "sqrtSize4":
      i = A0(t, Qt);
      break;
    case "sqrtTall":
      i = k0(t, Qt, r);
  }
  return i;
}, T0 = function(e, t) {
  switch (e) {
    case "⎜":
      return De("M291 0 H417 V" + t + " H291z");
    case "∣":
      return De("M145 0 H188 V" + t + " H145z");
    case "∥":
      return De("M145 0 H188 V" + t + " H145z") + De("M367 0 H410 V" + t + " H367z");
    case "⎟":
      return De("M457 0 H583 V" + t + " H457z");
    case "⎢":
      return De("M319 0 H403 V" + t + " H319z");
    case "⎥":
      return De("M263 0 H347 V" + t + " H263z");
    case "⎪":
      return De("M384 0 H504 V" + t + " H384z");
    case "⏐":
      return De("M312 0 H355 V" + t + " H312z");
    case "‖":
      return De("M257 0 H300 V" + t + " H257z") + De("M478 0 H521 V" + t + " H478z");
    default:
      return "";
  }
}, Ki = {
  // The doubleleftarrow geometry is from glyph U+21D0 in the font KaTeX Main
  doubleleftarrow: `M262 157
l10-10c34-36 62.7-77 86-123 3.3-8 5-13.3 5-16 0-5.3-6.7-8-20-8-7.3
 0-12.2.5-14.5 1.5-2.3 1-4.8 4.5-7.5 10.5-49.3 97.3-121.7 169.3-217 216-28
 14-57.3 25-88 33-6.7 2-11 3.8-13 5.5-2 1.7-3 4.2-3 7.5s1 5.8 3 7.5
c2 1.7 6.3 3.5 13 5.5 68 17.3 128.2 47.8 180.5 91.5 52.3 43.7 93.8 96.2 124.5
 157.5 9.3 8 15.3 12.3 18 13h6c12-.7 18-4 18-10 0-2-1.7-7-5-15-23.3-46-52-87
-86-123l-10-10h399738v-40H218c328 0 0 0 0 0l-10-8c-26.7-20-65.7-43-117-69 2.7
-2 6-3.7 10-5 36.7-16 72.3-37.3 107-64l10-8h399782v-40z
m8 0v40h399730v-40zm0 194v40h399730v-40z`,
  // doublerightarrow is from glyph U+21D2 in font KaTeX Main
  doublerightarrow: `M399738 392l
-10 10c-34 36-62.7 77-86 123-3.3 8-5 13.3-5 16 0 5.3 6.7 8 20 8 7.3 0 12.2-.5
 14.5-1.5 2.3-1 4.8-4.5 7.5-10.5 49.3-97.3 121.7-169.3 217-216 28-14 57.3-25 88
-33 6.7-2 11-3.8 13-5.5 2-1.7 3-4.2 3-7.5s-1-5.8-3-7.5c-2-1.7-6.3-3.5-13-5.5-68
-17.3-128.2-47.8-180.5-91.5-52.3-43.7-93.8-96.2-124.5-157.5-9.3-8-15.3-12.3-18
-13h-6c-12 .7-18 4-18 10 0 2 1.7 7 5 15 23.3 46 52 87 86 123l10 10H0v40h399782
c-328 0 0 0 0 0l10 8c26.7 20 65.7 43 117 69-2.7 2-6 3.7-10 5-36.7 16-72.3 37.3
-107 64l-10 8H0v40zM0 157v40h399730v-40zm0 194v40h399730v-40z`,
  // leftarrow is from glyph U+2190 in font KaTeX Main
  leftarrow: `M400000 241H110l3-3c68.7-52.7 113.7-120
 135-202 4-14.7 6-23 6-25 0-7.3-7-11-21-11-8 0-13.2.8-15.5 2.5-2.3 1.7-4.2 5.8
-5.5 12.5-1.3 4.7-2.7 10.3-4 17-12 48.7-34.8 92-68.5 130S65.3 228.3 18 247
c-10 4-16 7.7-18 11 0 8.7 6 14.3 18 17 47.3 18.7 87.8 47 121.5 85S196 441.3 208
 490c.7 2 1.3 5 2 9s1.2 6.7 1.5 8c.3 1.3 1 3.3 2 6s2.2 4.5 3.5 5.5c1.3 1 3.3
 1.8 6 2.5s6 1 10 1c14 0 21-3.7 21-11 0-2-2-10.3-6-25-20-79.3-65-146.7-135-202
 l-3-3h399890zM100 241v40h399900v-40z`,
  // overbrace is from glyphs U+23A9/23A8/23A7 in font KaTeX_Size4-Regular
  leftbrace: `M6 548l-6-6v-35l6-11c56-104 135.3-181.3 238-232 57.3-28.7 117
-45 179-50h399577v120H403c-43.3 7-81 15-113 26-100.7 33-179.7 91-237 174-2.7
 5-6 9-10 13-.7 1-7.3 1-20 1H6z`,
  leftbraceunder: `M0 6l6-6h17c12.688 0 19.313.3 20 1 4 4 7.313 8.3 10 13
 35.313 51.3 80.813 93.8 136.5 127.5 55.688 33.7 117.188 55.8 184.5 66.5.688
 0 2 .3 4 1 18.688 2.7 76 4.3 172 5h399450v120H429l-6-1c-124.688-8-235-61.7
-331-161C60.687 138.7 32.312 99.3 7 54L0 41V6z`,
  // overgroup is from the MnSymbol package (public domain)
  leftgroup: `M400000 80
H435C64 80 168.3 229.4 21 260c-5.9 1.2-18 0-18 0-2 0-3-1-3-3v-38C76 61 257 0
 435 0h399565z`,
  leftgroupunder: `M400000 262
H435C64 262 168.3 112.6 21 82c-5.9-1.2-18 0-18 0-2 0-3 1-3 3v38c76 158 257 219
 435 219h399565z`,
  // Harpoons are from glyph U+21BD in font KaTeX Main
  leftharpoon: `M0 267c.7 5.3 3 10 7 14h399993v-40H93c3.3
-3.3 10.2-9.5 20.5-18.5s17.8-15.8 22.5-20.5c50.7-52 88-110.3 112-175 4-11.3 5
-18.3 3-21-1.3-4-7.3-6-18-6-8 0-13 .7-15 2s-4.7 6.7-8 16c-42 98.7-107.3 174.7
-196 228-6.7 4.7-10.7 8-12 10-1.3 2-2 5.7-2 11zm100-26v40h399900v-40z`,
  leftharpoonplus: `M0 267c.7 5.3 3 10 7 14h399993v-40H93c3.3-3.3 10.2-9.5
 20.5-18.5s17.8-15.8 22.5-20.5c50.7-52 88-110.3 112-175 4-11.3 5-18.3 3-21-1.3
-4-7.3-6-18-6-8 0-13 .7-15 2s-4.7 6.7-8 16c-42 98.7-107.3 174.7-196 228-6.7 4.7
-10.7 8-12 10-1.3 2-2 5.7-2 11zm100-26v40h399900v-40zM0 435v40h400000v-40z
m0 0v40h400000v-40z`,
  leftharpoondown: `M7 241c-4 4-6.333 8.667-7 14 0 5.333.667 9 2 11s5.333
 5.333 12 10c90.667 54 156 130 196 228 3.333 10.667 6.333 16.333 9 17 2 .667 5
 1 9 1h5c10.667 0 16.667-2 18-6 2-2.667 1-9.667-3-21-32-87.333-82.667-157.667
-152-211l-3-3h399907v-40zM93 281 H400000 v-40L7 241z`,
  leftharpoondownplus: `M7 435c-4 4-6.3 8.7-7 14 0 5.3.7 9 2 11s5.3 5.3 12
 10c90.7 54 156 130 196 228 3.3 10.7 6.3 16.3 9 17 2 .7 5 1 9 1h5c10.7 0 16.7
-2 18-6 2-2.7 1-9.7-3-21-32-87.3-82.7-157.7-152-211l-3-3h399907v-40H7zm93 0
v40h399900v-40zM0 241v40h399900v-40zm0 0v40h399900v-40z`,
  // hook is from glyph U+21A9 in font KaTeX Main
  lefthook: `M400000 281 H103s-33-11.2-61-33.5S0 197.3 0 164s14.2-61.2 42.5
-83.5C70.8 58.2 104 47 142 47 c16.7 0 25 6.7 25 20 0 12-8.7 18.7-26 20-40 3.3
-68.7 15.7-86 37-10 12-15 25.3-15 40 0 22.7 9.8 40.7 29.5 54 19.7 13.3 43.5 21
 71.5 23h399859zM103 281v-40h399897v40z`,
  leftlinesegment: De("M40 281 V428 H0 V94 H40 V241 H400000 v40z"),
  leftbracketunder: De("M0 0 h120 V290 H399995 v120 H0z"),
  leftbracketover: De("M0 440 h120 V150 H399995 v-120 H0z"),
  leftmapsto: De("M40 281 V448H0V74H40V241H400000v40z"),
  // tofrom is from glyph U+21C4 in font KaTeX AMS Regular
  leftToFrom: `M0 147h400000v40H0zm0 214c68 40 115.7 95.7 143 167h22c15.3 0 23
-.3 23-1 0-1.3-5.3-13.7-16-37-18-35.3-41.3-69-70-101l-7-8h399905v-40H95l7-8
c28.7-32 52-65.7 70-101 10.7-23.3 16-35.7 16-37 0-.7-7.7-1-23-1h-22C115.7 265.3
 68 321 0 361zm0-174v-40h399900v40zm100 154v40h399900v-40z`,
  longequal: De("M0 50 h400000 v40H0z m0 194h40000v40H0z"),
  midbrace: `M200428 334
c-100.7-8.3-195.3-44-280-108-55.3-42-101.7-93-139-153l-9-14c-2.7 4-5.7 8.7-9 14
-53.3 86.7-123.7 153-211 199-66.7 36-137.3 56.3-212 62H0V214h199568c178.3-11.7
 311.7-78.3 403-201 6-8 9.7-12 11-12 .7-.7 6.7-1 18-1s17.3.3 18 1c1.3 0 5 4 11
 12 44.7 59.3 101.3 106.3 170 141s145.3 54.3 229 60h199572v120z`,
  midbraceunder: `M199572 214
c100.7 8.3 195.3 44 280 108 55.3 42 101.7 93 139 153l9 14c2.7-4 5.7-8.7 9-14
 53.3-86.7 123.7-153 211-199 66.7-36 137.3-56.3 212-62h199568v120H200432c-178.3
 11.7-311.7 78.3-403 201-6 8-9.7 12-11 12-.7.7-6.7 1-18 1s-17.3-.3-18-1c-1.3 0
-5-4-11-12-44.7-59.3-101.3-106.3-170-141s-145.3-54.3-229-60H0V214z`,
  oiintSize1: `M512.6 71.6c272.6 0 320.3 106.8 320.3 178.2 0 70.8-47.7 177.6
-320.3 177.6S193.1 320.6 193.1 249.8c0-71.4 46.9-178.2 319.5-178.2z
m368.1 178.2c0-86.4-60.9-215.4-368.1-215.4-306.4 0-367.3 129-367.3 215.4 0 85.8
60.9 214.8 367.3 214.8 307.2 0 368.1-129 368.1-214.8z`,
  oiintSize2: `M757.8 100.1c384.7 0 451.1 137.6 451.1 230 0 91.3-66.4 228.8
-451.1 228.8-386.3 0-452.7-137.5-452.7-228.8 0-92.4 66.4-230 452.7-230z
m502.4 230c0-111.2-82.4-277.2-502.4-277.2s-504 166-504 277.2
c0 110 84 276 504 276s502.4-166 502.4-276z`,
  oiiintSize1: `M681.4 71.6c408.9 0 480.5 106.8 480.5 178.2 0 70.8-71.6 177.6
-480.5 177.6S202.1 320.6 202.1 249.8c0-71.4 70.5-178.2 479.3-178.2z
m525.8 178.2c0-86.4-86.8-215.4-525.7-215.4-437.9 0-524.7 129-524.7 215.4 0
85.8 86.8 214.8 524.7 214.8 438.9 0 525.7-129 525.7-214.8z`,
  oiiintSize2: `M1021.2 53c603.6 0 707.8 165.8 707.8 277.2 0 110-104.2 275.8
-707.8 275.8-606 0-710.2-165.8-710.2-275.8C311 218.8 415.2 53 1021.2 53z
m770.4 277.1c0-131.2-126.4-327.6-770.5-327.6S248.4 198.9 248.4 330.1
c0 130 128.8 326.4 772.7 326.4s770.5-196.4 770.5-326.4z`,
  rightarrow: `M0 241v40h399891c-47.3 35.3-84 78-110 128
-16.7 32-27.7 63.7-33 95 0 1.3-.2 2.7-.5 4-.3 1.3-.5 2.3-.5 3 0 7.3 6.7 11 20
 11 8 0 13.2-.8 15.5-2.5 2.3-1.7 4.2-5.5 5.5-11.5 2-13.3 5.7-27 11-41 14.7-44.7
 39-84.5 73-119.5s73.7-60.2 119-75.5c6-2 9-5.7 9-11s-3-9-9-11c-45.3-15.3-85
-40.5-119-75.5s-58.3-74.8-73-119.5c-4.7-14-8.3-27.3-11-40-1.3-6.7-3.2-10.8-5.5
-12.5-2.3-1.7-7.5-2.5-15.5-2.5-14 0-21 3.7-21 11 0 2 2 10.3 6 25 20.7 83.3 67
 151.7 139 205zm0 0v40h399900v-40z`,
  rightbrace: `M400000 542l
-6 6h-17c-12.7 0-19.3-.3-20-1-4-4-7.3-8.3-10-13-35.3-51.3-80.8-93.8-136.5-127.5
s-117.2-55.8-184.5-66.5c-.7 0-2-.3-4-1-18.7-2.7-76-4.3-172-5H0V214h399571l6 1
c124.7 8 235 61.7 331 161 31.3 33.3 59.7 72.7 85 118l7 13v35z`,
  rightbraceunder: `M399994 0l6 6v35l-6 11c-56 104-135.3 181.3-238 232-57.3
 28.7-117 45-179 50H-300V214h399897c43.3-7 81-15 113-26 100.7-33 179.7-91 237
-174 2.7-5 6-9 10-13 .7-1 7.3-1 20-1h17z`,
  rightgroup: `M0 80h399565c371 0 266.7 149.4 414 180 5.9 1.2 18 0 18 0 2 0
 3-1 3-3v-38c-76-158-257-219-435-219H0z`,
  rightgroupunder: `M0 262h399565c371 0 266.7-149.4 414-180 5.9-1.2 18 0 18
 0 2 0 3 1 3 3v38c-76 158-257 219-435 219H0z`,
  rightharpoon: `M0 241v40h399993c4.7-4.7 7-9.3 7-14 0-9.3
-3.7-15.3-11-18-92.7-56.7-159-133.7-199-231-3.3-9.3-6-14.7-8-16-2-1.3-7-2-15-2
-10.7 0-16.7 2-18 6-2 2.7-1 9.7 3 21 15.3 42 36.7 81.8 64 119.5 27.3 37.7 58
 69.2 92 94.5zm0 0v40h399900v-40z`,
  rightharpoonplus: `M0 241v40h399993c4.7-4.7 7-9.3 7-14 0-9.3-3.7-15.3-11
-18-92.7-56.7-159-133.7-199-231-3.3-9.3-6-14.7-8-16-2-1.3-7-2-15-2-10.7 0-16.7
 2-18 6-2 2.7-1 9.7 3 21 15.3 42 36.7 81.8 64 119.5 27.3 37.7 58 69.2 92 94.5z
m0 0v40h399900v-40z m100 194v40h399900v-40zm0 0v40h399900v-40z`,
  rightharpoondown: `M399747 511c0 7.3 6.7 11 20 11 8 0 13-.8 15-2.5s4.7-6.8
 8-15.5c40-94 99.3-166.3 178-217 13.3-8 20.3-12.3 21-13 5.3-3.3 8.5-5.8 9.5
-7.5 1-1.7 1.5-5.2 1.5-10.5s-2.3-10.3-7-15H0v40h399908c-34 25.3-64.7 57-92 95
-27.3 38-48.7 77.7-64 119-3.3 8.7-5 14-5 16zM0 241v40h399900v-40z`,
  rightharpoondownplus: `M399747 705c0 7.3 6.7 11 20 11 8 0 13-.8
 15-2.5s4.7-6.8 8-15.5c40-94 99.3-166.3 178-217 13.3-8 20.3-12.3 21-13 5.3-3.3
 8.5-5.8 9.5-7.5 1-1.7 1.5-5.2 1.5-10.5s-2.3-10.3-7-15H0v40h399908c-34 25.3
-64.7 57-92 95-27.3 38-48.7 77.7-64 119-3.3 8.7-5 14-5 16zM0 435v40h399900v-40z
m0-194v40h400000v-40zm0 0v40h400000v-40z`,
  righthook: `M399859 241c-764 0 0 0 0 0 40-3.3 68.7-15.7 86-37 10-12 15-25.3
 15-40 0-22.7-9.8-40.7-29.5-54-19.7-13.3-43.5-21-71.5-23-17.3-1.3-26-8-26-20 0
-13.3 8.7-20 26-20 38 0 71 11.2 99 33.5 0 0 7 5.6 21 16.7 14 11.2 21 33.5 21
 66.8s-14 61.2-42 83.5c-28 22.3-61 33.5-99 33.5L0 241z M0 281v-40h399859v40z`,
  rightlinesegment: De("M399960 241 V94 h40 V428 h-40 V281 H0 v-40z"),
  rightbracketunder: De("M399995 0 h-120 V290 H0 v120 H400000z"),
  rightbracketover: De("M399995 440 h-120 V150 H0 v-120 H399995z"),
  rightToFrom: `M400000 167c-70.7-42-118-97.7-142-167h-23c-15.3 0-23 .3-23
 1 0 1.3 5.3 13.7 16 37 18 35.3 41.3 69 70 101l7 8H0v40h399905l-7 8c-28.7 32
-52 65.7-70 101-10.7 23.3-16 35.7-16 37 0 .7 7.7 1 23 1h23c24-69.3 71.3-125 142
-167z M100 147v40h399900v-40zM0 341v40h399900v-40z`,
  // twoheadleftarrow is from glyph U+219E in font KaTeX AMS Regular
  twoheadleftarrow: `M0 167c68 40
 115.7 95.7 143 167h22c15.3 0 23-.3 23-1 0-1.3-5.3-13.7-16-37-18-35.3-41.3-69
-70-101l-7-8h125l9 7c50.7 39.3 85 86 103 140h46c0-4.7-6.3-18.7-19-42-18-35.3
-40-67.3-66-96l-9-9h399716v-40H284l9-9c26-28.7 48-60.7 66-96 12.7-23.333 19
-37.333 19-42h-46c-18 54-52.3 100.7-103 140l-9 7H95l7-8c28.7-32 52-65.7 70-101
 10.7-23.333 16-35.7 16-37 0-.7-7.7-1-23-1h-22C115.7 71.3 68 127 0 167z`,
  twoheadrightarrow: `M400000 167
c-68-40-115.7-95.7-143-167h-22c-15.3 0-23 .3-23 1 0 1.3 5.3 13.7 16 37 18 35.3
 41.3 69 70 101l7 8h-125l-9-7c-50.7-39.3-85-86-103-140h-46c0 4.7 6.3 18.7 19 42
 18 35.3 40 67.3 66 96l9 9H0v40h399716l-9 9c-26 28.7-48 60.7-66 96-12.7 23.333
-19 37.333-19 42h46c18-54 52.3-100.7 103-140l9-7h125l-7 8c-28.7 32-52 65.7-70
 101-10.7 23.333-16 35.7-16 37 0 .7 7.7 1 23 1h22c27.3-71.3 75-127 143-167z`,
  // tilde1 is a modified version of a glyph from the MnSymbol package
  tilde1: `M200 55.538c-77 0-168 73.953-177 73.953-3 0-7
-2.175-9-5.437L2 97c-1-2-2-4-2-6 0-4 2-7 5-9l20-12C116 12 171 0 207 0c86 0
 114 68 191 68 78 0 168-68 177-68 4 0 7 2 9 5l12 19c1 2.175 2 4.35 2 6.525 0
 4.35-2 7.613-5 9.788l-19 13.05c-92 63.077-116.937 75.308-183 76.128
-68.267.847-113-73.952-191-73.952z`,
  // ditto tilde2, tilde3, & tilde4
  tilde2: `M344 55.266c-142 0-300.638 81.316-311.5 86.418
-8.01 3.762-22.5 10.91-23.5 5.562L1 120c-1-2-1-3-1-4 0-5 3-9 8-10l18.4-9C160.9
 31.9 283 0 358 0c148 0 188 122 331 122s314-97 326-97c4 0 8 2 10 7l7 21.114
c1 2.14 1 3.21 1 4.28 0 5.347-3 9.626-7 10.696l-22.3 12.622C852.6 158.372 751
 181.476 676 181.476c-149 0-189-126.21-332-126.21z`,
  tilde3: `M786 59C457 59 32 175.242 13 175.242c-6 0-10-3.457
-11-10.37L.15 138c-1-7 3-12 10-13l19.2-6.4C378.4 40.7 634.3 0 804.3 0c337 0
 411.8 157 746.8 157 328 0 754-112 773-112 5 0 10 3 11 9l1 14.075c1 8.066-.697
 16.595-6.697 17.492l-21.052 7.31c-367.9 98.146-609.15 122.696-778.15 122.696
 -338 0-409-156.573-744-156.573z`,
  tilde4: `M786 58C457 58 32 177.487 13 177.487c-6 0-10-3.345
-11-10.035L.15 143c-1-7 3-12 10-13l22-6.7C381.2 35 637.15 0 807.15 0c337 0 409
 177 744 177 328 0 754-127 773-127 5 0 10 3 11 9l1 14.794c1 7.805-3 13.38-9
 14.495l-20.7 5.574c-366.85 99.79-607.3 139.372-776.3 139.372-338 0-409
 -175.236-744-175.236z`,
  // vec is from glyph U+20D7 in font KaTeX Main
  vec: `M377 20c0-5.333 1.833-10 5.5-14S391 0 397 0c4.667 0 8.667 1.667 12 5
3.333 2.667 6.667 9 10 19 6.667 24.667 20.333 43.667 41 57 7.333 4.667 11
10.667 11 18 0 6-1 10-3 12s-6.667 5-14 9c-28.667 14.667-53.667 35.667-75 63
-1.333 1.333-3.167 3.5-5.5 6.5s-4 4.833-5 5.5c-1 .667-2.5 1.333-4.5 2s-4.333 1
-7 1c-4.667 0-9.167-1.833-13.5-5.5S337 184 337 178c0-12.667 15.667-32.333 47-59
H213l-171-1c-8.667-6-13-12.333-13-19 0-4.667 4.333-11.333 13-20h359
c-16-25.333-24-45-24-59z`,
  // widehat1 is a modified version of a glyph from the MnSymbol package
  widehat1: `M529 0h5l519 115c5 1 9 5 9 10 0 1-1 2-1 3l-4 22
c-1 5-5 9-11 9h-2L532 67 19 159h-2c-5 0-9-4-11-9l-5-22c-1-6 2-12 8-13z`,
  // ditto widehat2, widehat3, & widehat4
  widehat2: `M1181 0h2l1171 176c6 0 10 5 10 11l-2 23c-1 6-5 10
-11 10h-1L1182 67 15 220h-1c-6 0-10-4-11-10l-2-23c-1-6 4-11 10-11z`,
  widehat3: `M1181 0h2l1171 236c6 0 10 5 10 11l-2 23c-1 6-5 10
-11 10h-1L1182 67 15 280h-1c-6 0-10-4-11-10l-2-23c-1-6 4-11 10-11z`,
  widehat4: `M1181 0h2l1171 296c6 0 10 5 10 11l-2 23c-1 6-5 10
-11 10h-1L1182 67 15 340h-1c-6 0-10-4-11-10l-2-23c-1-6 4-11 10-11z`,
  // widecheck paths are all inverted versions of widehat
  widecheck1: `M529,159h5l519,-115c5,-1,9,-5,9,-10c0,-1,-1,-2,-1,-3l-4,-22c-1,
-5,-5,-9,-11,-9h-2l-512,92l-513,-92h-2c-5,0,-9,4,-11,9l-5,22c-1,6,2,12,8,13z`,
  widecheck2: `M1181,220h2l1171,-176c6,0,10,-5,10,-11l-2,-23c-1,-6,-5,-10,
-11,-10h-1l-1168,153l-1167,-153h-1c-6,0,-10,4,-11,10l-2,23c-1,6,4,11,10,11z`,
  widecheck3: `M1181,280h2l1171,-236c6,0,10,-5,10,-11l-2,-23c-1,-6,-5,-10,
-11,-10h-1l-1168,213l-1167,-213h-1c-6,0,-10,4,-11,10l-2,23c-1,6,4,11,10,11z`,
  widecheck4: `M1181,340h2l1171,-296c6,0,10,-5,10,-11l-2,-23c-1,-6,-5,-10,
-11,-10h-1l-1168,273l-1167,-273h-1c-6,0,-10,4,-11,10l-2,23c-1,6,4,11,10,11z`,
  // The next ten paths support reaction arrows from the mhchem package.
  // Arrows for \ce{<-->} are offset from xAxis by 0.22ex, per mhchem in LaTeX
  // baraboveleftarrow is mostly from glyph U+2190 in font KaTeX Main
  baraboveleftarrow: `M400000 620h-399890l3 -3c68.7 -52.7 113.7 -120 135 -202
c4 -14.7 6 -23 6 -25c0 -7.3 -7 -11 -21 -11c-8 0 -13.2 0.8 -15.5 2.5
c-2.3 1.7 -4.2 5.8 -5.5 12.5c-1.3 4.7 -2.7 10.3 -4 17c-12 48.7 -34.8 92 -68.5 130
s-74.2 66.3 -121.5 85c-10 4 -16 7.7 -18 11c0 8.7 6 14.3 18 17c47.3 18.7 87.8 47
121.5 85s56.5 81.3 68.5 130c0.7 2 1.3 5 2 9s1.2 6.7 1.5 8c0.3 1.3 1 3.3 2 6
s2.2 4.5 3.5 5.5c1.3 1 3.3 1.8 6 2.5s6 1 10 1c14 0 21 -3.7 21 -11
c0 -2 -2 -10.3 -6 -25c-20 -79.3 -65 -146.7 -135 -202l-3 -3h399890z
M100 620v40h399900v-40z M0 241v40h399900v-40zM0 241v40h399900v-40z`,
  // rightarrowabovebar is mostly from glyph U+2192, KaTeX Main
  rightarrowabovebar: `M0 241v40h399891c-47.3 35.3-84 78-110 128-16.7 32
-27.7 63.7-33 95 0 1.3-.2 2.7-.5 4-.3 1.3-.5 2.3-.5 3 0 7.3 6.7 11 20 11 8 0
13.2-.8 15.5-2.5 2.3-1.7 4.2-5.5 5.5-11.5 2-13.3 5.7-27 11-41 14.7-44.7 39
-84.5 73-119.5s73.7-60.2 119-75.5c6-2 9-5.7 9-11s-3-9-9-11c-45.3-15.3-85-40.5
-119-75.5s-58.3-74.8-73-119.5c-4.7-14-8.3-27.3-11-40-1.3-6.7-3.2-10.8-5.5
-12.5-2.3-1.7-7.5-2.5-15.5-2.5-14 0-21 3.7-21 11 0 2 2 10.3 6 25 20.7 83.3 67
151.7 139 205zm96 379h399894v40H0zm0 0h399904v40H0z`,
  // The short left harpoon has 0.5em (i.e. 500 units) kern on the left end.
  // Ref from mhchem.sty: \rlap{\raisebox{-.22ex}{$\kern0.5em
  baraboveshortleftharpoon: `M507,435c-4,4,-6.3,8.7,-7,14c0,5.3,0.7,9,2,11
c1.3,2,5.3,5.3,12,10c90.7,54,156,130,196,228c3.3,10.7,6.3,16.3,9,17
c2,0.7,5,1,9,1c0,0,5,0,5,0c10.7,0,16.7,-2,18,-6c2,-2.7,1,-9.7,-3,-21
c-32,-87.3,-82.7,-157.7,-152,-211c0,0,-3,-3,-3,-3l399351,0l0,-40
c-398570,0,-399437,0,-399437,0z M593 435 v40 H399500 v-40z
M0 281 v-40 H399908 v40z M0 281 v-40 H399908 v40z`,
  rightharpoonaboveshortbar: `M0,241 l0,40c399126,0,399993,0,399993,0
c4.7,-4.7,7,-9.3,7,-14c0,-9.3,-3.7,-15.3,-11,-18c-92.7,-56.7,-159,-133.7,-199,
-231c-3.3,-9.3,-6,-14.7,-8,-16c-2,-1.3,-7,-2,-15,-2c-10.7,0,-16.7,2,-18,6
c-2,2.7,-1,9.7,3,21c15.3,42,36.7,81.8,64,119.5c27.3,37.7,58,69.2,92,94.5z
M0 241 v40 H399908 v-40z M0 475 v-40 H399500 v40z M0 475 v-40 H399500 v40z`,
  shortbaraboveleftharpoon: `M7,435c-4,4,-6.3,8.7,-7,14c0,5.3,0.7,9,2,11
c1.3,2,5.3,5.3,12,10c90.7,54,156,130,196,228c3.3,10.7,6.3,16.3,9,17c2,0.7,5,1,9,
1c0,0,5,0,5,0c10.7,0,16.7,-2,18,-6c2,-2.7,1,-9.7,-3,-21c-32,-87.3,-82.7,-157.7,
-152,-211c0,0,-3,-3,-3,-3l399907,0l0,-40c-399126,0,-399993,0,-399993,0z
M93 435 v40 H400000 v-40z M500 241 v40 H400000 v-40z M500 241 v40 H400000 v-40z`,
  shortrightharpoonabovebar: `M53,241l0,40c398570,0,399437,0,399437,0
c4.7,-4.7,7,-9.3,7,-14c0,-9.3,-3.7,-15.3,-11,-18c-92.7,-56.7,-159,-133.7,-199,
-231c-3.3,-9.3,-6,-14.7,-8,-16c-2,-1.3,-7,-2,-15,-2c-10.7,0,-16.7,2,-18,6
c-2,2.7,-1,9.7,3,21c15.3,42,36.7,81.8,64,119.5c27.3,37.7,58,69.2,92,94.5z
M500 241 v40 H399408 v-40z M500 435 v40 H400000 v-40z`
}, M0 = function(e, t) {
  switch (e) {
    case "lbrack":
      return "M403 1759 V84 H666 V0 H319 V1759 v" + t + ` v1759 v84 h347 v-84
H403z M403 1759 V0 H319 V1759 v` + t + " v1759 v84 h84z";
    case "rbrack":
      return "M347 1759 V0 H0 V84 H263 V1759 v" + t + ` v1759 H0 v84 H347z
M347 1759 V0 H263 V1759 v` + t + " v1759 h84z";
    case "vert":
      return "M145 15 v585 v" + t + ` v585 c2.667,10,9.667,15,21,15
c10,0,16.667,-5,20,-15 v-585 v` + -t + ` v-585 c-2.667,-10,-9.667,-15,-21,-15
c-10,0,-16.667,5,-20,15z M188 15 H145 v585 v` + t + " v585 h43z";
    case "doublevert":
      return "M145 15 v585 v" + t + ` v585 c2.667,10,9.667,15,21,15
c10,0,16.667,-5,20,-15 v-585 v` + -t + ` v-585 c-2.667,-10,-9.667,-15,-21,-15
c-10,0,-16.667,5,-20,15z M188 15 H145 v585 v` + t + ` v585 h43z
M367 15 v585 v` + t + ` v585 c2.667,10,9.667,15,21,15
c10,0,16.667,-5,20,-15 v-585 v` + -t + ` v-585 c-2.667,-10,-9.667,-15,-21,-15
c-10,0,-16.667,5,-20,15z M410 15 H367 v585 v` + t + " v585 h43z";
    case "lfloor":
      return "M319 602 V0 H403 V602 v" + t + ` v1715 h263 v84 H319z
MM319 602 V0 H403 V602 v` + t + " v1715 H319z";
    case "rfloor":
      return "M319 602 V0 H403 V602 v" + t + ` v1799 H0 v-84 H319z
MM319 602 V0 H403 V602 v` + t + " v1715 H319z";
    case "lceil":
      return "M403 1759 V84 H666 V0 H319 V1759 v" + t + ` v602 h84z
M403 1759 V0 H319 V1759 v` + t + " v602 h84z";
    case "rceil":
      return "M347 1759 V0 H0 V84 H263 V1759 v" + t + ` v602 h84z
M347 1759 V0 h-84 V1759 v` + t + " v602 h84z";
    case "lparen":
      return `M863,9c0,-2,-2,-5,-6,-9c0,0,-17,0,-17,0c-12.7,0,-19.3,0.3,-20,1
c-5.3,5.3,-10.3,11,-15,17c-242.7,294.7,-395.3,682,-458,1162c-21.3,163.3,-33.3,349,
-36,557 l0,` + (t + 84) + `c0.2,6,0,26,0,60c2,159.3,10,310.7,24,454c53.3,528,210,
949.7,470,1265c4.7,6,9.7,11.7,15,17c0.7,0.7,7,1,19,1c0,0,18,0,18,0c4,-4,6,-7,6,-9
c0,-2.7,-3.3,-8.7,-10,-18c-135.3,-192.7,-235.5,-414.3,-300.5,-665c-65,-250.7,-102.5,
-544.7,-112.5,-882c-2,-104,-3,-167,-3,-189
l0,-` + (t + 92) + `c0,-162.7,5.7,-314,17,-454c20.7,-272,63.7,-513,129,-723c65.3,
-210,155.3,-396.3,270,-559c6.7,-9.3,10,-15.3,10,-18z`;
    case "rparen":
      return `M76,0c-16.7,0,-25,3,-25,9c0,2,2,6.3,6,13c21.3,28.7,42.3,60.3,
63,95c96.7,156.7,172.8,332.5,228.5,527.5c55.7,195,92.8,416.5,111.5,664.5
c11.3,139.3,17,290.7,17,454c0,28,1.7,43,3.3,45l0,` + (t + 9) + `
c-3,4,-3.3,16.7,-3.3,38c0,162,-5.7,313.7,-17,455c-18.7,248,-55.8,469.3,-111.5,664
c-55.7,194.7,-131.8,370.3,-228.5,527c-20.7,34.7,-41.7,66.3,-63,95c-2,3.3,-4,7,-6,11
c0,7.3,5.7,11,17,11c0,0,11,0,11,0c9.3,0,14.3,-0.3,15,-1c5.3,-5.3,10.3,-11,15,-17
c242.7,-294.7,395.3,-681.7,458,-1161c21.3,-164.7,33.3,-350.7,36,-558
l0,-` + (t + 144) + `c-2,-159.3,-10,-310.7,-24,-454c-53.3,-528,-210,-949.7,
-470,-1265c-4.7,-6,-9.7,-11.7,-15,-17c-0.7,-0.7,-6.7,-1,-18,-1z`;
    default:
      throw new Error("Unknown stretchy delimiter.");
  }
};
function z0(a) {
  return "toText" in a;
}
class oa {
  // Never used; needed for satisfying interface.
  constructor(e) {
    this.children = void 0, this.classes = void 0, this.height = void 0, this.depth = void 0, this.maxFontSize = void 0, this.style = void 0, this.children = e, this.classes = [], this.height = 0, this.depth = 0, this.maxFontSize = 0, this.style = {};
  }
  hasClass(e) {
    return this.classes.includes(e);
  }
  /** Convert the fragment into a node. */
  toNode() {
    for (var e = document.createDocumentFragment(), t = 0; t < this.children.length; t++)
      e.appendChild(this.children[t].toNode());
    return e;
  }
  /** Convert the fragment into HTML markup. */
  toMarkup() {
    for (var e = "", t = 0; t < this.children.length; t++)
      e += this.children[t].toMarkup();
    return e;
  }
  /**
   * Converts the math node into a string, similar to innerText. Applies to
   * MathDomNode's only.
   */
  toText() {
    return this.children.map((e) => {
      if (z0(e))
        return e.toText();
      throw new Error("Expected MathDomNode with toText, got " + e.constructor.name);
    }).join("");
  }
}
var _r = {
  // https://en.wikibooks.org/wiki/LaTeX/Lengths and
  // https://tex.stackexchange.com/a/8263
  pt: 1,
  // TeX point
  mm: 7227 / 2540,
  // millimeter
  cm: 7227 / 254,
  // centimeter
  in: 72.27,
  // inch
  bp: 803 / 800,
  // big (PostScript) points
  pc: 12,
  // pica
  dd: 1238 / 1157,
  // didot
  cc: 14856 / 1157,
  // cicero (12 didot)
  nd: 685 / 642,
  // new didot
  nc: 1370 / 107,
  // new cicero (12 new didot)
  sp: 1 / 65536,
  // scaled point (TeX's internal smallest unit)
  // https://tex.stackexchange.com/a/41371
  px: 803 / 800
  // \pdfpxdimen defaults to 1 bp in pdfTeX and LuaTeX
}, q0 = {
  ex: !0,
  em: !0,
  mu: !0
}, as = function(e) {
  return typeof e != "string" && (e = e.unit), e in _r || e in q0 || e === "ex";
}, we = function(e, t) {
  var r;
  if (e.unit in _r)
    r = _r[e.unit] / t.fontMetrics().ptPerEm / t.sizeMultiplier;
  else if (e.unit === "mu")
    r = t.fontMetrics().cssEmPerMu;
  else {
    var i;
    if (t.style.isTight() ? i = t.havingStyle(t.style.text()) : i = t, e.unit === "ex")
      r = i.fontMetrics().xHeight;
    else if (e.unit === "em")
      r = i.fontMetrics().quad;
    else
      throw new B("Invalid unit: '" + e.unit + "'");
    i !== t && (r *= i.sizeMultiplier / t.sizeMultiplier);
  }
  return Math.min(e.number * r, t.maxSize);
}, F = function(e) {
  return +e.toFixed(4) + "em";
}, qt = function(e) {
  return e.filter((t) => t).join(" ");
}, bi = function(e) {
  var t = "";
  for (var r of Object.keys(e)) {
    var i = e[r];
    i !== void 0 && (t += r0(r) + ":" + i + ";");
  }
  return t;
}, rs = function(e, t, r) {
  if (this.classes = e || [], this.attributes = {}, this.height = 0, this.depth = 0, this.maxFontSize = 0, this.style = r || {}, t) {
    t.style.isTight() && this.classes.push("mtight");
    var i = t.getColor();
    i && (this.style.color = i);
  }
}, is = function(e) {
  var t = document.createElement(e);
  t.className = qt(this.classes), Object.assign(t.style, this.style);
  for (var r of Object.keys(this.attributes))
    t.setAttribute(r, this.attributes[r]);
  for (var i = 0; i < this.children.length; i++)
    t.appendChild(this.children[i].toNode());
  return t;
}, j0 = /[\s"'>/=\x00-\x1f]/, ns = function(e) {
  var t = "<" + e;
  this.classes.length && (t += ' class="' + Ne(qt(this.classes)) + '"');
  var r = bi(this.style);
  r && (t += ' style="' + Ne(r) + '"');
  for (var i of Object.keys(this.attributes)) {
    if (j0.test(i))
      throw new B("Invalid attribute name '" + i + "'");
    t += " " + i + '="' + Ne(this.attributes[i]) + '"';
  }
  t += ">";
  for (var n = 0; n < this.children.length; n++)
    t += this.children[n].toMarkup();
  return t += "</" + e + ">", t;
};
class la {
  constructor(e, t, r, i) {
    this.children = void 0, this.attributes = void 0, this.classes = void 0, this.height = void 0, this.depth = void 0, this.width = void 0, this.maxFontSize = void 0, this.style = void 0, this.italic = void 0, rs.call(this, e, r, i), this.children = t || [];
  }
  /**
   * Sets an arbitrary attribute on the span. Warning: use this wisely. Not
   * all browsers support attributes the same, and having too many custom
   * attributes is probably bad.
   */
  setAttribute(e, t) {
    this.attributes[e] = t;
  }
  hasClass(e) {
    return this.classes.includes(e);
  }
  toNode() {
    return is.call(this, "span");
  }
  toMarkup() {
    return ns.call(this, "span");
  }
}
class sr {
  constructor(e, t, r, i) {
    this.children = void 0, this.attributes = void 0, this.classes = void 0, this.height = void 0, this.depth = void 0, this.maxFontSize = void 0, this.style = void 0, rs.call(this, t, i), this.children = r || [], this.setAttribute("href", e);
  }
  setAttribute(e, t) {
    this.attributes[e] = t;
  }
  hasClass(e) {
    return this.classes.includes(e);
  }
  toNode() {
    return is.call(this, "a");
  }
  toMarkup() {
    return ns.call(this, "a");
  }
}
class E0 {
  constructor(e, t, r) {
    this.src = void 0, this.alt = void 0, this.classes = void 0, this.height = void 0, this.depth = void 0, this.maxFontSize = void 0, this.style = void 0, this.alt = t, this.src = e, this.classes = ["mord"], this.height = 0, this.depth = 0, this.maxFontSize = 0, this.style = r;
  }
  hasClass(e) {
    return this.classes.includes(e);
  }
  toNode() {
    var e = document.createElement("img");
    return e.src = this.src, e.alt = this.alt, e.className = "mord", Object.assign(e.style, this.style), e;
  }
  toMarkup() {
    var e = '<img src="' + Ne(this.src) + '"' + (' alt="' + Ne(this.alt) + '"'), t = bi(this.style);
    return t && (e += ' style="' + Ne(t) + '"'), e += "'/>", e;
  }
}
var R0 = {
  î: "ı̂",
  ï: "ı̈",
  í: "ı́",
  // 'ī': '\u0131\u0304', // enable when we add Extended Latin
  ì: "ı̀"
};
class Xe {
  constructor(e, t, r, i, n, l, u, d) {
    this.text = void 0, this.height = void 0, this.depth = void 0, this.italic = void 0, this.skew = void 0, this.width = void 0, this.maxFontSize = void 0, this.classes = void 0, this.style = void 0, this.text = e, this.height = t || 0, this.depth = r || 0, this.italic = i || 0, this.skew = n || 0, this.width = l || 0, this.classes = u || [], this.style = d || {}, this.maxFontSize = 0;
    var p = v0(this.text.charCodeAt(0));
    p && this.classes.push(p + "_fallback"), /[îïíì]/.test(this.text) && (this.text = R0[this.text]);
  }
  hasClass(e) {
    return this.classes.includes(e);
  }
  /**
   * Creates a text node or span from a symbol node. Note that a span is only
   * created if it is needed.
   */
  toNode() {
    var e = document.createTextNode(this.text), t = null;
    return this.italic > 0 && (t = document.createElement("span"), t.style.marginRight = F(this.italic)), this.classes.length > 0 && (t = t || document.createElement("span"), t.className = qt(this.classes)), Object.keys(this.style).length > 0 && (t = t || document.createElement("span"), Object.assign(t.style, this.style)), t ? (t.appendChild(e), t) : e;
  }
  /**
   * Creates markup for a symbol node.
   */
  toMarkup() {
    var e = !1, t = "<span";
    this.classes.length && (e = !0, t += ' class="', t += Ne(qt(this.classes)), t += '"');
    var r = "";
    this.italic > 0 && (r += "margin-right:" + F(this.italic) + ";"), r += bi(this.style), r && (e = !0, t += ' style="' + Ne(r) + '"');
    var i = Ne(this.text);
    return e ? (t += ">", t += i, t += "</span>", t) : i;
  }
}
class xt {
  constructor(e, t) {
    this.children = void 0, this.attributes = void 0, this.children = e || [], this.attributes = t || {};
  }
  toNode() {
    var e = "http://www.w3.org/2000/svg", t = document.createElementNS(e, "svg");
    for (var r of Object.keys(this.attributes))
      t.setAttribute(r, this.attributes[r]);
    for (var i = 0; i < this.children.length; i++)
      t.appendChild(this.children[i].toNode());
    return t;
  }
  toMarkup() {
    var e = '<svg xmlns="http://www.w3.org/2000/svg"';
    for (var t of Object.keys(this.attributes))
      e += " " + t + '="' + Ne(this.attributes[t]) + '"';
    e += ">";
    for (var r = 0; r < this.children.length; r++)
      e += this.children[r].toMarkup();
    return e += "</svg>", e;
  }
}
class jt {
  constructor(e, t) {
    this.pathName = void 0, this.alternate = void 0, this.pathName = e, this.alternate = t;
  }
  toNode() {
    var e = "http://www.w3.org/2000/svg", t = document.createElementNS(e, "path");
    return this.alternate ? t.setAttribute("d", this.alternate) : t.setAttribute("d", Ki[this.pathName]), t;
  }
  toMarkup() {
    return this.alternate ? '<path d="' + Ne(this.alternate) + '"/>' : '<path d="' + Ne(Ki[this.pathName]) + '"/>';
  }
}
class Zr {
  constructor(e) {
    this.attributes = void 0, this.attributes = e || {};
  }
  toNode() {
    var e = "http://www.w3.org/2000/svg", t = document.createElementNS(e, "line");
    for (var r of Object.keys(this.attributes))
      t.setAttribute(r, this.attributes[r]);
    return t;
  }
  toMarkup() {
    var e = "<line";
    for (var t of Object.keys(this.attributes))
      e += " " + t + '="' + Ne(this.attributes[t]) + '"';
    return e += "/>", e;
  }
}
function D0(a) {
  if (a instanceof Xe)
    return a;
  throw new Error("Expected symbolNode but got " + String(a) + ".");
}
function B0(a) {
  if (a instanceof la)
    return a;
  throw new Error("Expected span<HtmlDomNode> but got " + String(a) + ".");
}
var P0 = (a) => a instanceof la || a instanceof sr || a instanceof oa, lt = {
  "AMS-Regular": {
    32: [0, 0, 0, 0, 0.25],
    65: [0, 0.68889, 0, 0, 0.72222],
    66: [0, 0.68889, 0, 0, 0.66667],
    67: [0, 0.68889, 0, 0, 0.72222],
    68: [0, 0.68889, 0, 0, 0.72222],
    69: [0, 0.68889, 0, 0, 0.66667],
    70: [0, 0.68889, 0, 0, 0.61111],
    71: [0, 0.68889, 0, 0, 0.77778],
    72: [0, 0.68889, 0, 0, 0.77778],
    73: [0, 0.68889, 0, 0, 0.38889],
    74: [0.16667, 0.68889, 0, 0, 0.5],
    75: [0, 0.68889, 0, 0, 0.77778],
    76: [0, 0.68889, 0, 0, 0.66667],
    77: [0, 0.68889, 0, 0, 0.94445],
    78: [0, 0.68889, 0, 0, 0.72222],
    79: [0.16667, 0.68889, 0, 0, 0.77778],
    80: [0, 0.68889, 0, 0, 0.61111],
    81: [0.16667, 0.68889, 0, 0, 0.77778],
    82: [0, 0.68889, 0, 0, 0.72222],
    83: [0, 0.68889, 0, 0, 0.55556],
    84: [0, 0.68889, 0, 0, 0.66667],
    85: [0, 0.68889, 0, 0, 0.72222],
    86: [0, 0.68889, 0, 0, 0.72222],
    87: [0, 0.68889, 0, 0, 1],
    88: [0, 0.68889, 0, 0, 0.72222],
    89: [0, 0.68889, 0, 0, 0.72222],
    90: [0, 0.68889, 0, 0, 0.66667],
    107: [0, 0.68889, 0, 0, 0.55556],
    160: [0, 0, 0, 0, 0.25],
    165: [0, 0.675, 0.025, 0, 0.75],
    174: [0.15559, 0.69224, 0, 0, 0.94666],
    240: [0, 0.68889, 0, 0, 0.55556],
    295: [0, 0.68889, 0, 0, 0.54028],
    710: [0, 0.825, 0, 0, 2.33334],
    732: [0, 0.9, 0, 0, 2.33334],
    770: [0, 0.825, 0, 0, 2.33334],
    771: [0, 0.9, 0, 0, 2.33334],
    989: [0.08167, 0.58167, 0, 0, 0.77778],
    1008: [0, 0.43056, 0.04028, 0, 0.66667],
    8245: [0, 0.54986, 0, 0, 0.275],
    8463: [0, 0.68889, 0, 0, 0.54028],
    8487: [0, 0.68889, 0, 0, 0.72222],
    8498: [0, 0.68889, 0, 0, 0.55556],
    8502: [0, 0.68889, 0, 0, 0.66667],
    8503: [0, 0.68889, 0, 0, 0.44445],
    8504: [0, 0.68889, 0, 0, 0.66667],
    8513: [0, 0.68889, 0, 0, 0.63889],
    8592: [-0.03598, 0.46402, 0, 0, 0.5],
    8594: [-0.03598, 0.46402, 0, 0, 0.5],
    8602: [-0.13313, 0.36687, 0, 0, 1],
    8603: [-0.13313, 0.36687, 0, 0, 1],
    8606: [0.01354, 0.52239, 0, 0, 1],
    8608: [0.01354, 0.52239, 0, 0, 1],
    8610: [0.01354, 0.52239, 0, 0, 1.11111],
    8611: [0.01354, 0.52239, 0, 0, 1.11111],
    8619: [0, 0.54986, 0, 0, 1],
    8620: [0, 0.54986, 0, 0, 1],
    8621: [-0.13313, 0.37788, 0, 0, 1.38889],
    8622: [-0.13313, 0.36687, 0, 0, 1],
    8624: [0, 0.69224, 0, 0, 0.5],
    8625: [0, 0.69224, 0, 0, 0.5],
    8630: [0, 0.43056, 0, 0, 1],
    8631: [0, 0.43056, 0, 0, 1],
    8634: [0.08198, 0.58198, 0, 0, 0.77778],
    8635: [0.08198, 0.58198, 0, 0, 0.77778],
    8638: [0.19444, 0.69224, 0, 0, 0.41667],
    8639: [0.19444, 0.69224, 0, 0, 0.41667],
    8642: [0.19444, 0.69224, 0, 0, 0.41667],
    8643: [0.19444, 0.69224, 0, 0, 0.41667],
    8644: [0.1808, 0.675, 0, 0, 1],
    8646: [0.1808, 0.675, 0, 0, 1],
    8647: [0.1808, 0.675, 0, 0, 1],
    8648: [0.19444, 0.69224, 0, 0, 0.83334],
    8649: [0.1808, 0.675, 0, 0, 1],
    8650: [0.19444, 0.69224, 0, 0, 0.83334],
    8651: [0.01354, 0.52239, 0, 0, 1],
    8652: [0.01354, 0.52239, 0, 0, 1],
    8653: [-0.13313, 0.36687, 0, 0, 1],
    8654: [-0.13313, 0.36687, 0, 0, 1],
    8655: [-0.13313, 0.36687, 0, 0, 1],
    8666: [0.13667, 0.63667, 0, 0, 1],
    8667: [0.13667, 0.63667, 0, 0, 1],
    8669: [-0.13313, 0.37788, 0, 0, 1],
    8672: [-0.064, 0.437, 0, 0, 1.334],
    8674: [-0.064, 0.437, 0, 0, 1.334],
    8705: [0, 0.825, 0, 0, 0.5],
    8708: [0, 0.68889, 0, 0, 0.55556],
    8709: [0.08167, 0.58167, 0, 0, 0.77778],
    8717: [0, 0.43056, 0, 0, 0.42917],
    8722: [-0.03598, 0.46402, 0, 0, 0.5],
    8724: [0.08198, 0.69224, 0, 0, 0.77778],
    8726: [0.08167, 0.58167, 0, 0, 0.77778],
    8733: [0, 0.69224, 0, 0, 0.77778],
    8736: [0, 0.69224, 0, 0, 0.72222],
    8737: [0, 0.69224, 0, 0, 0.72222],
    8738: [0.03517, 0.52239, 0, 0, 0.72222],
    8739: [0.08167, 0.58167, 0, 0, 0.22222],
    8740: [0.25142, 0.74111, 0, 0, 0.27778],
    8741: [0.08167, 0.58167, 0, 0, 0.38889],
    8742: [0.25142, 0.74111, 0, 0, 0.5],
    8756: [0, 0.69224, 0, 0, 0.66667],
    8757: [0, 0.69224, 0, 0, 0.66667],
    8764: [-0.13313, 0.36687, 0, 0, 0.77778],
    8765: [-0.13313, 0.37788, 0, 0, 0.77778],
    8769: [-0.13313, 0.36687, 0, 0, 0.77778],
    8770: [-0.03625, 0.46375, 0, 0, 0.77778],
    8774: [0.30274, 0.79383, 0, 0, 0.77778],
    8776: [-0.01688, 0.48312, 0, 0, 0.77778],
    8778: [0.08167, 0.58167, 0, 0, 0.77778],
    8782: [0.06062, 0.54986, 0, 0, 0.77778],
    8783: [0.06062, 0.54986, 0, 0, 0.77778],
    8785: [0.08198, 0.58198, 0, 0, 0.77778],
    8786: [0.08198, 0.58198, 0, 0, 0.77778],
    8787: [0.08198, 0.58198, 0, 0, 0.77778],
    8790: [0, 0.69224, 0, 0, 0.77778],
    8791: [0.22958, 0.72958, 0, 0, 0.77778],
    8796: [0.08198, 0.91667, 0, 0, 0.77778],
    8806: [0.25583, 0.75583, 0, 0, 0.77778],
    8807: [0.25583, 0.75583, 0, 0, 0.77778],
    8808: [0.25142, 0.75726, 0, 0, 0.77778],
    8809: [0.25142, 0.75726, 0, 0, 0.77778],
    8812: [0.25583, 0.75583, 0, 0, 0.5],
    8814: [0.20576, 0.70576, 0, 0, 0.77778],
    8815: [0.20576, 0.70576, 0, 0, 0.77778],
    8816: [0.30274, 0.79383, 0, 0, 0.77778],
    8817: [0.30274, 0.79383, 0, 0, 0.77778],
    8818: [0.22958, 0.72958, 0, 0, 0.77778],
    8819: [0.22958, 0.72958, 0, 0, 0.77778],
    8822: [0.1808, 0.675, 0, 0, 0.77778],
    8823: [0.1808, 0.675, 0, 0, 0.77778],
    8828: [0.13667, 0.63667, 0, 0, 0.77778],
    8829: [0.13667, 0.63667, 0, 0, 0.77778],
    8830: [0.22958, 0.72958, 0, 0, 0.77778],
    8831: [0.22958, 0.72958, 0, 0, 0.77778],
    8832: [0.20576, 0.70576, 0, 0, 0.77778],
    8833: [0.20576, 0.70576, 0, 0, 0.77778],
    8840: [0.30274, 0.79383, 0, 0, 0.77778],
    8841: [0.30274, 0.79383, 0, 0, 0.77778],
    8842: [0.13597, 0.63597, 0, 0, 0.77778],
    8843: [0.13597, 0.63597, 0, 0, 0.77778],
    8847: [0.03517, 0.54986, 0, 0, 0.77778],
    8848: [0.03517, 0.54986, 0, 0, 0.77778],
    8858: [0.08198, 0.58198, 0, 0, 0.77778],
    8859: [0.08198, 0.58198, 0, 0, 0.77778],
    8861: [0.08198, 0.58198, 0, 0, 0.77778],
    8862: [0, 0.675, 0, 0, 0.77778],
    8863: [0, 0.675, 0, 0, 0.77778],
    8864: [0, 0.675, 0, 0, 0.77778],
    8865: [0, 0.675, 0, 0, 0.77778],
    8872: [0, 0.69224, 0, 0, 0.61111],
    8873: [0, 0.69224, 0, 0, 0.72222],
    8874: [0, 0.69224, 0, 0, 0.88889],
    8876: [0, 0.68889, 0, 0, 0.61111],
    8877: [0, 0.68889, 0, 0, 0.61111],
    8878: [0, 0.68889, 0, 0, 0.72222],
    8879: [0, 0.68889, 0, 0, 0.72222],
    8882: [0.03517, 0.54986, 0, 0, 0.77778],
    8883: [0.03517, 0.54986, 0, 0, 0.77778],
    8884: [0.13667, 0.63667, 0, 0, 0.77778],
    8885: [0.13667, 0.63667, 0, 0, 0.77778],
    8888: [0, 0.54986, 0, 0, 1.11111],
    8890: [0.19444, 0.43056, 0, 0, 0.55556],
    8891: [0.19444, 0.69224, 0, 0, 0.61111],
    8892: [0.19444, 0.69224, 0, 0, 0.61111],
    8901: [0, 0.54986, 0, 0, 0.27778],
    8903: [0.08167, 0.58167, 0, 0, 0.77778],
    8905: [0.08167, 0.58167, 0, 0, 0.77778],
    8906: [0.08167, 0.58167, 0, 0, 0.77778],
    8907: [0, 0.69224, 0, 0, 0.77778],
    8908: [0, 0.69224, 0, 0, 0.77778],
    8909: [-0.03598, 0.46402, 0, 0, 0.77778],
    8910: [0, 0.54986, 0, 0, 0.76042],
    8911: [0, 0.54986, 0, 0, 0.76042],
    8912: [0.03517, 0.54986, 0, 0, 0.77778],
    8913: [0.03517, 0.54986, 0, 0, 0.77778],
    8914: [0, 0.54986, 0, 0, 0.66667],
    8915: [0, 0.54986, 0, 0, 0.66667],
    8916: [0, 0.69224, 0, 0, 0.66667],
    8918: [0.0391, 0.5391, 0, 0, 0.77778],
    8919: [0.0391, 0.5391, 0, 0, 0.77778],
    8920: [0.03517, 0.54986, 0, 0, 1.33334],
    8921: [0.03517, 0.54986, 0, 0, 1.33334],
    8922: [0.38569, 0.88569, 0, 0, 0.77778],
    8923: [0.38569, 0.88569, 0, 0, 0.77778],
    8926: [0.13667, 0.63667, 0, 0, 0.77778],
    8927: [0.13667, 0.63667, 0, 0, 0.77778],
    8928: [0.30274, 0.79383, 0, 0, 0.77778],
    8929: [0.30274, 0.79383, 0, 0, 0.77778],
    8934: [0.23222, 0.74111, 0, 0, 0.77778],
    8935: [0.23222, 0.74111, 0, 0, 0.77778],
    8936: [0.23222, 0.74111, 0, 0, 0.77778],
    8937: [0.23222, 0.74111, 0, 0, 0.77778],
    8938: [0.20576, 0.70576, 0, 0, 0.77778],
    8939: [0.20576, 0.70576, 0, 0, 0.77778],
    8940: [0.30274, 0.79383, 0, 0, 0.77778],
    8941: [0.30274, 0.79383, 0, 0, 0.77778],
    8994: [0.19444, 0.69224, 0, 0, 0.77778],
    8995: [0.19444, 0.69224, 0, 0, 0.77778],
    9416: [0.15559, 0.69224, 0, 0, 0.90222],
    9484: [0, 0.69224, 0, 0, 0.5],
    9488: [0, 0.69224, 0, 0, 0.5],
    9492: [0, 0.37788, 0, 0, 0.5],
    9496: [0, 0.37788, 0, 0, 0.5],
    9585: [0.19444, 0.68889, 0, 0, 0.88889],
    9586: [0.19444, 0.74111, 0, 0, 0.88889],
    9632: [0, 0.675, 0, 0, 0.77778],
    9633: [0, 0.675, 0, 0, 0.77778],
    9650: [0, 0.54986, 0, 0, 0.72222],
    9651: [0, 0.54986, 0, 0, 0.72222],
    9654: [0.03517, 0.54986, 0, 0, 0.77778],
    9660: [0, 0.54986, 0, 0, 0.72222],
    9661: [0, 0.54986, 0, 0, 0.72222],
    9664: [0.03517, 0.54986, 0, 0, 0.77778],
    9674: [0.11111, 0.69224, 0, 0, 0.66667],
    9733: [0.19444, 0.69224, 0, 0, 0.94445],
    10003: [0, 0.69224, 0, 0, 0.83334],
    10016: [0, 0.69224, 0, 0, 0.83334],
    10731: [0.11111, 0.69224, 0, 0, 0.66667],
    10846: [0.19444, 0.75583, 0, 0, 0.61111],
    10877: [0.13667, 0.63667, 0, 0, 0.77778],
    10878: [0.13667, 0.63667, 0, 0, 0.77778],
    10885: [0.25583, 0.75583, 0, 0, 0.77778],
    10886: [0.25583, 0.75583, 0, 0, 0.77778],
    10887: [0.13597, 0.63597, 0, 0, 0.77778],
    10888: [0.13597, 0.63597, 0, 0, 0.77778],
    10889: [0.26167, 0.75726, 0, 0, 0.77778],
    10890: [0.26167, 0.75726, 0, 0, 0.77778],
    10891: [0.48256, 0.98256, 0, 0, 0.77778],
    10892: [0.48256, 0.98256, 0, 0, 0.77778],
    10901: [0.13667, 0.63667, 0, 0, 0.77778],
    10902: [0.13667, 0.63667, 0, 0, 0.77778],
    10933: [0.25142, 0.75726, 0, 0, 0.77778],
    10934: [0.25142, 0.75726, 0, 0, 0.77778],
    10935: [0.26167, 0.75726, 0, 0, 0.77778],
    10936: [0.26167, 0.75726, 0, 0, 0.77778],
    10937: [0.26167, 0.75726, 0, 0, 0.77778],
    10938: [0.26167, 0.75726, 0, 0, 0.77778],
    10949: [0.25583, 0.75583, 0, 0, 0.77778],
    10950: [0.25583, 0.75583, 0, 0, 0.77778],
    10955: [0.28481, 0.79383, 0, 0, 0.77778],
    10956: [0.28481, 0.79383, 0, 0, 0.77778],
    57350: [0.08167, 0.58167, 0, 0, 0.22222],
    57351: [0.08167, 0.58167, 0, 0, 0.38889],
    57352: [0.08167, 0.58167, 0, 0, 0.77778],
    57353: [0, 0.43056, 0.04028, 0, 0.66667],
    57356: [0.25142, 0.75726, 0, 0, 0.77778],
    57357: [0.25142, 0.75726, 0, 0, 0.77778],
    57358: [0.41951, 0.91951, 0, 0, 0.77778],
    57359: [0.30274, 0.79383, 0, 0, 0.77778],
    57360: [0.30274, 0.79383, 0, 0, 0.77778],
    57361: [0.41951, 0.91951, 0, 0, 0.77778],
    57366: [0.25142, 0.75726, 0, 0, 0.77778],
    57367: [0.25142, 0.75726, 0, 0, 0.77778],
    57368: [0.25142, 0.75726, 0, 0, 0.77778],
    57369: [0.25142, 0.75726, 0, 0, 0.77778],
    57370: [0.13597, 0.63597, 0, 0, 0.77778],
    57371: [0.13597, 0.63597, 0, 0, 0.77778]
  },
  "Caligraphic-Regular": {
    32: [0, 0, 0, 0, 0.25],
    65: [0, 0.68333, 0, 0.19445, 0.79847],
    66: [0, 0.68333, 0.03041, 0.13889, 0.65681],
    67: [0, 0.68333, 0.05834, 0.13889, 0.52653],
    68: [0, 0.68333, 0.02778, 0.08334, 0.77139],
    69: [0, 0.68333, 0.08944, 0.11111, 0.52778],
    70: [0, 0.68333, 0.09931, 0.11111, 0.71875],
    71: [0.09722, 0.68333, 0.0593, 0.11111, 0.59487],
    72: [0, 0.68333, 965e-5, 0.11111, 0.84452],
    73: [0, 0.68333, 0.07382, 0, 0.54452],
    74: [0.09722, 0.68333, 0.18472, 0.16667, 0.67778],
    75: [0, 0.68333, 0.01445, 0.05556, 0.76195],
    76: [0, 0.68333, 0, 0.13889, 0.68972],
    77: [0, 0.68333, 0, 0.13889, 1.2009],
    78: [0, 0.68333, 0.14736, 0.08334, 0.82049],
    79: [0, 0.68333, 0.02778, 0.11111, 0.79611],
    80: [0, 0.68333, 0.08222, 0.08334, 0.69556],
    81: [0.09722, 0.68333, 0, 0.11111, 0.81667],
    82: [0, 0.68333, 0, 0.08334, 0.8475],
    83: [0, 0.68333, 0.075, 0.13889, 0.60556],
    84: [0, 0.68333, 0.25417, 0, 0.54464],
    85: [0, 0.68333, 0.09931, 0.08334, 0.62583],
    86: [0, 0.68333, 0.08222, 0, 0.61278],
    87: [0, 0.68333, 0.08222, 0.08334, 0.98778],
    88: [0, 0.68333, 0.14643, 0.13889, 0.7133],
    89: [0.09722, 0.68333, 0.08222, 0.08334, 0.66834],
    90: [0, 0.68333, 0.07944, 0.13889, 0.72473],
    160: [0, 0, 0, 0, 0.25]
  },
  "Fraktur-Regular": {
    32: [0, 0, 0, 0, 0.25],
    33: [0, 0.69141, 0, 0, 0.29574],
    34: [0, 0.69141, 0, 0, 0.21471],
    38: [0, 0.69141, 0, 0, 0.73786],
    39: [0, 0.69141, 0, 0, 0.21201],
    40: [0.24982, 0.74947, 0, 0, 0.38865],
    41: [0.24982, 0.74947, 0, 0, 0.38865],
    42: [0, 0.62119, 0, 0, 0.27764],
    43: [0.08319, 0.58283, 0, 0, 0.75623],
    44: [0, 0.10803, 0, 0, 0.27764],
    45: [0.08319, 0.58283, 0, 0, 0.75623],
    46: [0, 0.10803, 0, 0, 0.27764],
    47: [0.24982, 0.74947, 0, 0, 0.50181],
    48: [0, 0.47534, 0, 0, 0.50181],
    49: [0, 0.47534, 0, 0, 0.50181],
    50: [0, 0.47534, 0, 0, 0.50181],
    51: [0.18906, 0.47534, 0, 0, 0.50181],
    52: [0.18906, 0.47534, 0, 0, 0.50181],
    53: [0.18906, 0.47534, 0, 0, 0.50181],
    54: [0, 0.69141, 0, 0, 0.50181],
    55: [0.18906, 0.47534, 0, 0, 0.50181],
    56: [0, 0.69141, 0, 0, 0.50181],
    57: [0.18906, 0.47534, 0, 0, 0.50181],
    58: [0, 0.47534, 0, 0, 0.21606],
    59: [0.12604, 0.47534, 0, 0, 0.21606],
    61: [-0.13099, 0.36866, 0, 0, 0.75623],
    63: [0, 0.69141, 0, 0, 0.36245],
    65: [0, 0.69141, 0, 0, 0.7176],
    66: [0, 0.69141, 0, 0, 0.88397],
    67: [0, 0.69141, 0, 0, 0.61254],
    68: [0, 0.69141, 0, 0, 0.83158],
    69: [0, 0.69141, 0, 0, 0.66278],
    70: [0.12604, 0.69141, 0, 0, 0.61119],
    71: [0, 0.69141, 0, 0, 0.78539],
    72: [0.06302, 0.69141, 0, 0, 0.7203],
    73: [0, 0.69141, 0, 0, 0.55448],
    74: [0.12604, 0.69141, 0, 0, 0.55231],
    75: [0, 0.69141, 0, 0, 0.66845],
    76: [0, 0.69141, 0, 0, 0.66602],
    77: [0, 0.69141, 0, 0, 1.04953],
    78: [0, 0.69141, 0, 0, 0.83212],
    79: [0, 0.69141, 0, 0, 0.82699],
    80: [0.18906, 0.69141, 0, 0, 0.82753],
    81: [0.03781, 0.69141, 0, 0, 0.82699],
    82: [0, 0.69141, 0, 0, 0.82807],
    83: [0, 0.69141, 0, 0, 0.82861],
    84: [0, 0.69141, 0, 0, 0.66899],
    85: [0, 0.69141, 0, 0, 0.64576],
    86: [0, 0.69141, 0, 0, 0.83131],
    87: [0, 0.69141, 0, 0, 1.04602],
    88: [0, 0.69141, 0, 0, 0.71922],
    89: [0.18906, 0.69141, 0, 0, 0.83293],
    90: [0.12604, 0.69141, 0, 0, 0.60201],
    91: [0.24982, 0.74947, 0, 0, 0.27764],
    93: [0.24982, 0.74947, 0, 0, 0.27764],
    94: [0, 0.69141, 0, 0, 0.49965],
    97: [0, 0.47534, 0, 0, 0.50046],
    98: [0, 0.69141, 0, 0, 0.51315],
    99: [0, 0.47534, 0, 0, 0.38946],
    100: [0, 0.62119, 0, 0, 0.49857],
    101: [0, 0.47534, 0, 0, 0.40053],
    102: [0.18906, 0.69141, 0, 0, 0.32626],
    103: [0.18906, 0.47534, 0, 0, 0.5037],
    104: [0.18906, 0.69141, 0, 0, 0.52126],
    105: [0, 0.69141, 0, 0, 0.27899],
    106: [0, 0.69141, 0, 0, 0.28088],
    107: [0, 0.69141, 0, 0, 0.38946],
    108: [0, 0.69141, 0, 0, 0.27953],
    109: [0, 0.47534, 0, 0, 0.76676],
    110: [0, 0.47534, 0, 0, 0.52666],
    111: [0, 0.47534, 0, 0, 0.48885],
    112: [0.18906, 0.52396, 0, 0, 0.50046],
    113: [0.18906, 0.47534, 0, 0, 0.48912],
    114: [0, 0.47534, 0, 0, 0.38919],
    115: [0, 0.47534, 0, 0, 0.44266],
    116: [0, 0.62119, 0, 0, 0.33301],
    117: [0, 0.47534, 0, 0, 0.5172],
    118: [0, 0.52396, 0, 0, 0.5118],
    119: [0, 0.52396, 0, 0, 0.77351],
    120: [0.18906, 0.47534, 0, 0, 0.38865],
    121: [0.18906, 0.47534, 0, 0, 0.49884],
    122: [0.18906, 0.47534, 0, 0, 0.39054],
    160: [0, 0, 0, 0, 0.25],
    8216: [0, 0.69141, 0, 0, 0.21471],
    8217: [0, 0.69141, 0, 0, 0.21471],
    58112: [0, 0.62119, 0, 0, 0.49749],
    58113: [0, 0.62119, 0, 0, 0.4983],
    58114: [0.18906, 0.69141, 0, 0, 0.33328],
    58115: [0.18906, 0.69141, 0, 0, 0.32923],
    58116: [0.18906, 0.47534, 0, 0, 0.50343],
    58117: [0, 0.69141, 0, 0, 0.33301],
    58118: [0, 0.62119, 0, 0, 0.33409],
    58119: [0, 0.47534, 0, 0, 0.50073]
  },
  "Main-Bold": {
    32: [0, 0, 0, 0, 0.25],
    33: [0, 0.69444, 0, 0, 0.35],
    34: [0, 0.69444, 0, 0, 0.60278],
    35: [0.19444, 0.69444, 0, 0, 0.95833],
    36: [0.05556, 0.75, 0, 0, 0.575],
    37: [0.05556, 0.75, 0, 0, 0.95833],
    38: [0, 0.69444, 0, 0, 0.89444],
    39: [0, 0.69444, 0, 0, 0.31944],
    40: [0.25, 0.75, 0, 0, 0.44722],
    41: [0.25, 0.75, 0, 0, 0.44722],
    42: [0, 0.75, 0, 0, 0.575],
    43: [0.13333, 0.63333, 0, 0, 0.89444],
    44: [0.19444, 0.15556, 0, 0, 0.31944],
    45: [0, 0.44444, 0, 0, 0.38333],
    46: [0, 0.15556, 0, 0, 0.31944],
    47: [0.25, 0.75, 0, 0, 0.575],
    48: [0, 0.64444, 0, 0, 0.575],
    49: [0, 0.64444, 0, 0, 0.575],
    50: [0, 0.64444, 0, 0, 0.575],
    51: [0, 0.64444, 0, 0, 0.575],
    52: [0, 0.64444, 0, 0, 0.575],
    53: [0, 0.64444, 0, 0, 0.575],
    54: [0, 0.64444, 0, 0, 0.575],
    55: [0, 0.64444, 0, 0, 0.575],
    56: [0, 0.64444, 0, 0, 0.575],
    57: [0, 0.64444, 0, 0, 0.575],
    58: [0, 0.44444, 0, 0, 0.31944],
    59: [0.19444, 0.44444, 0, 0, 0.31944],
    60: [0.08556, 0.58556, 0, 0, 0.89444],
    61: [-0.10889, 0.39111, 0, 0, 0.89444],
    62: [0.08556, 0.58556, 0, 0, 0.89444],
    63: [0, 0.69444, 0, 0, 0.54305],
    64: [0, 0.69444, 0, 0, 0.89444],
    65: [0, 0.68611, 0, 0, 0.86944],
    66: [0, 0.68611, 0, 0, 0.81805],
    67: [0, 0.68611, 0, 0, 0.83055],
    68: [0, 0.68611, 0, 0, 0.88194],
    69: [0, 0.68611, 0, 0, 0.75555],
    70: [0, 0.68611, 0, 0, 0.72361],
    71: [0, 0.68611, 0, 0, 0.90416],
    72: [0, 0.68611, 0, 0, 0.9],
    73: [0, 0.68611, 0, 0, 0.43611],
    74: [0, 0.68611, 0, 0, 0.59444],
    75: [0, 0.68611, 0, 0, 0.90138],
    76: [0, 0.68611, 0, 0, 0.69166],
    77: [0, 0.68611, 0, 0, 1.09166],
    78: [0, 0.68611, 0, 0, 0.9],
    79: [0, 0.68611, 0, 0, 0.86388],
    80: [0, 0.68611, 0, 0, 0.78611],
    81: [0.19444, 0.68611, 0, 0, 0.86388],
    82: [0, 0.68611, 0, 0, 0.8625],
    83: [0, 0.68611, 0, 0, 0.63889],
    84: [0, 0.68611, 0, 0, 0.8],
    85: [0, 0.68611, 0, 0, 0.88472],
    86: [0, 0.68611, 0.01597, 0, 0.86944],
    87: [0, 0.68611, 0.01597, 0, 1.18888],
    88: [0, 0.68611, 0, 0, 0.86944],
    89: [0, 0.68611, 0.02875, 0, 0.86944],
    90: [0, 0.68611, 0, 0, 0.70277],
    91: [0.25, 0.75, 0, 0, 0.31944],
    92: [0.25, 0.75, 0, 0, 0.575],
    93: [0.25, 0.75, 0, 0, 0.31944],
    94: [0, 0.69444, 0, 0, 0.575],
    95: [0.31, 0.13444, 0.03194, 0, 0.575],
    97: [0, 0.44444, 0, 0, 0.55902],
    98: [0, 0.69444, 0, 0, 0.63889],
    99: [0, 0.44444, 0, 0, 0.51111],
    100: [0, 0.69444, 0, 0, 0.63889],
    101: [0, 0.44444, 0, 0, 0.52708],
    102: [0, 0.69444, 0.10903, 0, 0.35139],
    103: [0.19444, 0.44444, 0.01597, 0, 0.575],
    104: [0, 0.69444, 0, 0, 0.63889],
    105: [0, 0.69444, 0, 0, 0.31944],
    106: [0.19444, 0.69444, 0, 0, 0.35139],
    107: [0, 0.69444, 0, 0, 0.60694],
    108: [0, 0.69444, 0, 0, 0.31944],
    109: [0, 0.44444, 0, 0, 0.95833],
    110: [0, 0.44444, 0, 0, 0.63889],
    111: [0, 0.44444, 0, 0, 0.575],
    112: [0.19444, 0.44444, 0, 0, 0.63889],
    113: [0.19444, 0.44444, 0, 0, 0.60694],
    114: [0, 0.44444, 0, 0, 0.47361],
    115: [0, 0.44444, 0, 0, 0.45361],
    116: [0, 0.63492, 0, 0, 0.44722],
    117: [0, 0.44444, 0, 0, 0.63889],
    118: [0, 0.44444, 0.01597, 0, 0.60694],
    119: [0, 0.44444, 0.01597, 0, 0.83055],
    120: [0, 0.44444, 0, 0, 0.60694],
    121: [0.19444, 0.44444, 0.01597, 0, 0.60694],
    122: [0, 0.44444, 0, 0, 0.51111],
    123: [0.25, 0.75, 0, 0, 0.575],
    124: [0.25, 0.75, 0, 0, 0.31944],
    125: [0.25, 0.75, 0, 0, 0.575],
    126: [0.35, 0.34444, 0, 0, 0.575],
    160: [0, 0, 0, 0, 0.25],
    163: [0, 0.69444, 0, 0, 0.86853],
    168: [0, 0.69444, 0, 0, 0.575],
    172: [0, 0.44444, 0, 0, 0.76666],
    176: [0, 0.69444, 0, 0, 0.86944],
    177: [0.13333, 0.63333, 0, 0, 0.89444],
    184: [0.17014, 0, 0, 0, 0.51111],
    198: [0, 0.68611, 0, 0, 1.04166],
    215: [0.13333, 0.63333, 0, 0, 0.89444],
    216: [0.04861, 0.73472, 0, 0, 0.89444],
    223: [0, 0.69444, 0, 0, 0.59722],
    230: [0, 0.44444, 0, 0, 0.83055],
    247: [0.13333, 0.63333, 0, 0, 0.89444],
    248: [0.09722, 0.54167, 0, 0, 0.575],
    305: [0, 0.44444, 0, 0, 0.31944],
    338: [0, 0.68611, 0, 0, 1.16944],
    339: [0, 0.44444, 0, 0, 0.89444],
    567: [0.19444, 0.44444, 0, 0, 0.35139],
    710: [0, 0.69444, 0, 0, 0.575],
    711: [0, 0.63194, 0, 0, 0.575],
    713: [0, 0.59611, 0, 0, 0.575],
    714: [0, 0.69444, 0, 0, 0.575],
    715: [0, 0.69444, 0, 0, 0.575],
    728: [0, 0.69444, 0, 0, 0.575],
    729: [0, 0.69444, 0, 0, 0.31944],
    730: [0, 0.69444, 0, 0, 0.86944],
    732: [0, 0.69444, 0, 0, 0.575],
    733: [0, 0.69444, 0, 0, 0.575],
    915: [0, 0.68611, 0, 0, 0.69166],
    916: [0, 0.68611, 0, 0, 0.95833],
    920: [0, 0.68611, 0, 0, 0.89444],
    923: [0, 0.68611, 0, 0, 0.80555],
    926: [0, 0.68611, 0, 0, 0.76666],
    928: [0, 0.68611, 0, 0, 0.9],
    931: [0, 0.68611, 0, 0, 0.83055],
    933: [0, 0.68611, 0, 0, 0.89444],
    934: [0, 0.68611, 0, 0, 0.83055],
    936: [0, 0.68611, 0, 0, 0.89444],
    937: [0, 0.68611, 0, 0, 0.83055],
    8211: [0, 0.44444, 0.03194, 0, 0.575],
    8212: [0, 0.44444, 0.03194, 0, 1.14999],
    8216: [0, 0.69444, 0, 0, 0.31944],
    8217: [0, 0.69444, 0, 0, 0.31944],
    8220: [0, 0.69444, 0, 0, 0.60278],
    8221: [0, 0.69444, 0, 0, 0.60278],
    8224: [0.19444, 0.69444, 0, 0, 0.51111],
    8225: [0.19444, 0.69444, 0, 0, 0.51111],
    8242: [0, 0.55556, 0, 0, 0.34444],
    8407: [0, 0.72444, 0.15486, 0, 0.575],
    8463: [0, 0.69444, 0, 0, 0.66759],
    8465: [0, 0.69444, 0, 0, 0.83055],
    8467: [0, 0.69444, 0, 0, 0.47361],
    8472: [0.19444, 0.44444, 0, 0, 0.74027],
    8476: [0, 0.69444, 0, 0, 0.83055],
    8501: [0, 0.69444, 0, 0, 0.70277],
    8592: [-0.10889, 0.39111, 0, 0, 1.14999],
    8593: [0.19444, 0.69444, 0, 0, 0.575],
    8594: [-0.10889, 0.39111, 0, 0, 1.14999],
    8595: [0.19444, 0.69444, 0, 0, 0.575],
    8596: [-0.10889, 0.39111, 0, 0, 1.14999],
    8597: [0.25, 0.75, 0, 0, 0.575],
    8598: [0.19444, 0.69444, 0, 0, 1.14999],
    8599: [0.19444, 0.69444, 0, 0, 1.14999],
    8600: [0.19444, 0.69444, 0, 0, 1.14999],
    8601: [0.19444, 0.69444, 0, 0, 1.14999],
    8636: [-0.10889, 0.39111, 0, 0, 1.14999],
    8637: [-0.10889, 0.39111, 0, 0, 1.14999],
    8640: [-0.10889, 0.39111, 0, 0, 1.14999],
    8641: [-0.10889, 0.39111, 0, 0, 1.14999],
    8656: [-0.10889, 0.39111, 0, 0, 1.14999],
    8657: [0.19444, 0.69444, 0, 0, 0.70277],
    8658: [-0.10889, 0.39111, 0, 0, 1.14999],
    8659: [0.19444, 0.69444, 0, 0, 0.70277],
    8660: [-0.10889, 0.39111, 0, 0, 1.14999],
    8661: [0.25, 0.75, 0, 0, 0.70277],
    8704: [0, 0.69444, 0, 0, 0.63889],
    8706: [0, 0.69444, 0.06389, 0, 0.62847],
    8707: [0, 0.69444, 0, 0, 0.63889],
    8709: [0.05556, 0.75, 0, 0, 0.575],
    8711: [0, 0.68611, 0, 0, 0.95833],
    8712: [0.08556, 0.58556, 0, 0, 0.76666],
    8715: [0.08556, 0.58556, 0, 0, 0.76666],
    8722: [0.13333, 0.63333, 0, 0, 0.89444],
    8723: [0.13333, 0.63333, 0, 0, 0.89444],
    8725: [0.25, 0.75, 0, 0, 0.575],
    8726: [0.25, 0.75, 0, 0, 0.575],
    8727: [-0.02778, 0.47222, 0, 0, 0.575],
    8728: [-0.02639, 0.47361, 0, 0, 0.575],
    8729: [-0.02639, 0.47361, 0, 0, 0.575],
    8730: [0.18, 0.82, 0, 0, 0.95833],
    8733: [0, 0.44444, 0, 0, 0.89444],
    8734: [0, 0.44444, 0, 0, 1.14999],
    8736: [0, 0.69224, 0, 0, 0.72222],
    8739: [0.25, 0.75, 0, 0, 0.31944],
    8741: [0.25, 0.75, 0, 0, 0.575],
    8743: [0, 0.55556, 0, 0, 0.76666],
    8744: [0, 0.55556, 0, 0, 0.76666],
    8745: [0, 0.55556, 0, 0, 0.76666],
    8746: [0, 0.55556, 0, 0, 0.76666],
    8747: [0.19444, 0.69444, 0.12778, 0, 0.56875],
    8764: [-0.10889, 0.39111, 0, 0, 0.89444],
    8768: [0.19444, 0.69444, 0, 0, 0.31944],
    8771: [222e-5, 0.50222, 0, 0, 0.89444],
    8773: [0.027, 0.638, 0, 0, 0.894],
    8776: [0.02444, 0.52444, 0, 0, 0.89444],
    8781: [222e-5, 0.50222, 0, 0, 0.89444],
    8801: [222e-5, 0.50222, 0, 0, 0.89444],
    8804: [0.19667, 0.69667, 0, 0, 0.89444],
    8805: [0.19667, 0.69667, 0, 0, 0.89444],
    8810: [0.08556, 0.58556, 0, 0, 1.14999],
    8811: [0.08556, 0.58556, 0, 0, 1.14999],
    8826: [0.08556, 0.58556, 0, 0, 0.89444],
    8827: [0.08556, 0.58556, 0, 0, 0.89444],
    8834: [0.08556, 0.58556, 0, 0, 0.89444],
    8835: [0.08556, 0.58556, 0, 0, 0.89444],
    8838: [0.19667, 0.69667, 0, 0, 0.89444],
    8839: [0.19667, 0.69667, 0, 0, 0.89444],
    8846: [0, 0.55556, 0, 0, 0.76666],
    8849: [0.19667, 0.69667, 0, 0, 0.89444],
    8850: [0.19667, 0.69667, 0, 0, 0.89444],
    8851: [0, 0.55556, 0, 0, 0.76666],
    8852: [0, 0.55556, 0, 0, 0.76666],
    8853: [0.13333, 0.63333, 0, 0, 0.89444],
    8854: [0.13333, 0.63333, 0, 0, 0.89444],
    8855: [0.13333, 0.63333, 0, 0, 0.89444],
    8856: [0.13333, 0.63333, 0, 0, 0.89444],
    8857: [0.13333, 0.63333, 0, 0, 0.89444],
    8866: [0, 0.69444, 0, 0, 0.70277],
    8867: [0, 0.69444, 0, 0, 0.70277],
    8868: [0, 0.69444, 0, 0, 0.89444],
    8869: [0, 0.69444, 0, 0, 0.89444],
    8900: [-0.02639, 0.47361, 0, 0, 0.575],
    8901: [-0.02639, 0.47361, 0, 0, 0.31944],
    8902: [-0.02778, 0.47222, 0, 0, 0.575],
    8968: [0.25, 0.75, 0, 0, 0.51111],
    8969: [0.25, 0.75, 0, 0, 0.51111],
    8970: [0.25, 0.75, 0, 0, 0.51111],
    8971: [0.25, 0.75, 0, 0, 0.51111],
    8994: [-0.13889, 0.36111, 0, 0, 1.14999],
    8995: [-0.13889, 0.36111, 0, 0, 1.14999],
    9651: [0.19444, 0.69444, 0, 0, 1.02222],
    9657: [-0.02778, 0.47222, 0, 0, 0.575],
    9661: [0.19444, 0.69444, 0, 0, 1.02222],
    9667: [-0.02778, 0.47222, 0, 0, 0.575],
    9711: [0.19444, 0.69444, 0, 0, 1.14999],
    9824: [0.12963, 0.69444, 0, 0, 0.89444],
    9825: [0.12963, 0.69444, 0, 0, 0.89444],
    9826: [0.12963, 0.69444, 0, 0, 0.89444],
    9827: [0.12963, 0.69444, 0, 0, 0.89444],
    9837: [0, 0.75, 0, 0, 0.44722],
    9838: [0.19444, 0.69444, 0, 0, 0.44722],
    9839: [0.19444, 0.69444, 0, 0, 0.44722],
    10216: [0.25, 0.75, 0, 0, 0.44722],
    10217: [0.25, 0.75, 0, 0, 0.44722],
    10815: [0, 0.68611, 0, 0, 0.9],
    10927: [0.19667, 0.69667, 0, 0, 0.89444],
    10928: [0.19667, 0.69667, 0, 0, 0.89444],
    57376: [0.19444, 0.69444, 0, 0, 0]
  },
  "Main-BoldItalic": {
    32: [0, 0, 0, 0, 0.25],
    33: [0, 0.69444, 0.11417, 0, 0.38611],
    34: [0, 0.69444, 0.07939, 0, 0.62055],
    35: [0.19444, 0.69444, 0.06833, 0, 0.94444],
    37: [0.05556, 0.75, 0.12861, 0, 0.94444],
    38: [0, 0.69444, 0.08528, 0, 0.88555],
    39: [0, 0.69444, 0.12945, 0, 0.35555],
    40: [0.25, 0.75, 0.15806, 0, 0.47333],
    41: [0.25, 0.75, 0.03306, 0, 0.47333],
    42: [0, 0.75, 0.14333, 0, 0.59111],
    43: [0.10333, 0.60333, 0.03306, 0, 0.88555],
    44: [0.19444, 0.14722, 0, 0, 0.35555],
    45: [0, 0.44444, 0.02611, 0, 0.41444],
    46: [0, 0.14722, 0, 0, 0.35555],
    47: [0.25, 0.75, 0.15806, 0, 0.59111],
    48: [0, 0.64444, 0.13167, 0, 0.59111],
    49: [0, 0.64444, 0.13167, 0, 0.59111],
    50: [0, 0.64444, 0.13167, 0, 0.59111],
    51: [0, 0.64444, 0.13167, 0, 0.59111],
    52: [0.19444, 0.64444, 0.13167, 0, 0.59111],
    53: [0, 0.64444, 0.13167, 0, 0.59111],
    54: [0, 0.64444, 0.13167, 0, 0.59111],
    55: [0.19444, 0.64444, 0.13167, 0, 0.59111],
    56: [0, 0.64444, 0.13167, 0, 0.59111],
    57: [0, 0.64444, 0.13167, 0, 0.59111],
    58: [0, 0.44444, 0.06695, 0, 0.35555],
    59: [0.19444, 0.44444, 0.06695, 0, 0.35555],
    61: [-0.10889, 0.39111, 0.06833, 0, 0.88555],
    63: [0, 0.69444, 0.11472, 0, 0.59111],
    64: [0, 0.69444, 0.09208, 0, 0.88555],
    65: [0, 0.68611, 0, 0, 0.86555],
    66: [0, 0.68611, 0.0992, 0, 0.81666],
    67: [0, 0.68611, 0.14208, 0, 0.82666],
    68: [0, 0.68611, 0.09062, 0, 0.87555],
    69: [0, 0.68611, 0.11431, 0, 0.75666],
    70: [0, 0.68611, 0.12903, 0, 0.72722],
    71: [0, 0.68611, 0.07347, 0, 0.89527],
    72: [0, 0.68611, 0.17208, 0, 0.8961],
    73: [0, 0.68611, 0.15681, 0, 0.47166],
    74: [0, 0.68611, 0.145, 0, 0.61055],
    75: [0, 0.68611, 0.14208, 0, 0.89499],
    76: [0, 0.68611, 0, 0, 0.69777],
    77: [0, 0.68611, 0.17208, 0, 1.07277],
    78: [0, 0.68611, 0.17208, 0, 0.8961],
    79: [0, 0.68611, 0.09062, 0, 0.85499],
    80: [0, 0.68611, 0.0992, 0, 0.78721],
    81: [0.19444, 0.68611, 0.09062, 0, 0.85499],
    82: [0, 0.68611, 0.02559, 0, 0.85944],
    83: [0, 0.68611, 0.11264, 0, 0.64999],
    84: [0, 0.68611, 0.12903, 0, 0.7961],
    85: [0, 0.68611, 0.17208, 0, 0.88083],
    86: [0, 0.68611, 0.18625, 0, 0.86555],
    87: [0, 0.68611, 0.18625, 0, 1.15999],
    88: [0, 0.68611, 0.15681, 0, 0.86555],
    89: [0, 0.68611, 0.19803, 0, 0.86555],
    90: [0, 0.68611, 0.14208, 0, 0.70888],
    91: [0.25, 0.75, 0.1875, 0, 0.35611],
    93: [0.25, 0.75, 0.09972, 0, 0.35611],
    94: [0, 0.69444, 0.06709, 0, 0.59111],
    95: [0.31, 0.13444, 0.09811, 0, 0.59111],
    97: [0, 0.44444, 0.09426, 0, 0.59111],
    98: [0, 0.69444, 0.07861, 0, 0.53222],
    99: [0, 0.44444, 0.05222, 0, 0.53222],
    100: [0, 0.69444, 0.10861, 0, 0.59111],
    101: [0, 0.44444, 0.085, 0, 0.53222],
    102: [0.19444, 0.69444, 0.21778, 0, 0.4],
    103: [0.19444, 0.44444, 0.105, 0, 0.53222],
    104: [0, 0.69444, 0.09426, 0, 0.59111],
    105: [0, 0.69326, 0.11387, 0, 0.35555],
    106: [0.19444, 0.69326, 0.1672, 0, 0.35555],
    107: [0, 0.69444, 0.11111, 0, 0.53222],
    108: [0, 0.69444, 0.10861, 0, 0.29666],
    109: [0, 0.44444, 0.09426, 0, 0.94444],
    110: [0, 0.44444, 0.09426, 0, 0.64999],
    111: [0, 0.44444, 0.07861, 0, 0.59111],
    112: [0.19444, 0.44444, 0.07861, 0, 0.59111],
    113: [0.19444, 0.44444, 0.105, 0, 0.53222],
    114: [0, 0.44444, 0.11111, 0, 0.50167],
    115: [0, 0.44444, 0.08167, 0, 0.48694],
    116: [0, 0.63492, 0.09639, 0, 0.385],
    117: [0, 0.44444, 0.09426, 0, 0.62055],
    118: [0, 0.44444, 0.11111, 0, 0.53222],
    119: [0, 0.44444, 0.11111, 0, 0.76777],
    120: [0, 0.44444, 0.12583, 0, 0.56055],
    121: [0.19444, 0.44444, 0.105, 0, 0.56166],
    122: [0, 0.44444, 0.13889, 0, 0.49055],
    126: [0.35, 0.34444, 0.11472, 0, 0.59111],
    160: [0, 0, 0, 0, 0.25],
    168: [0, 0.69444, 0.11473, 0, 0.59111],
    176: [0, 0.69444, 0, 0, 0.94888],
    184: [0.17014, 0, 0, 0, 0.53222],
    198: [0, 0.68611, 0.11431, 0, 1.02277],
    216: [0.04861, 0.73472, 0.09062, 0, 0.88555],
    223: [0.19444, 0.69444, 0.09736, 0, 0.665],
    230: [0, 0.44444, 0.085, 0, 0.82666],
    248: [0.09722, 0.54167, 0.09458, 0, 0.59111],
    305: [0, 0.44444, 0.09426, 0, 0.35555],
    338: [0, 0.68611, 0.11431, 0, 1.14054],
    339: [0, 0.44444, 0.085, 0, 0.82666],
    567: [0.19444, 0.44444, 0.04611, 0, 0.385],
    710: [0, 0.69444, 0.06709, 0, 0.59111],
    711: [0, 0.63194, 0.08271, 0, 0.59111],
    713: [0, 0.59444, 0.10444, 0, 0.59111],
    714: [0, 0.69444, 0.08528, 0, 0.59111],
    715: [0, 0.69444, 0, 0, 0.59111],
    728: [0, 0.69444, 0.10333, 0, 0.59111],
    729: [0, 0.69444, 0.12945, 0, 0.35555],
    730: [0, 0.69444, 0, 0, 0.94888],
    732: [0, 0.69444, 0.11472, 0, 0.59111],
    733: [0, 0.69444, 0.11472, 0, 0.59111],
    915: [0, 0.68611, 0.12903, 0, 0.69777],
    916: [0, 0.68611, 0, 0, 0.94444],
    920: [0, 0.68611, 0.09062, 0, 0.88555],
    923: [0, 0.68611, 0, 0, 0.80666],
    926: [0, 0.68611, 0.15092, 0, 0.76777],
    928: [0, 0.68611, 0.17208, 0, 0.8961],
    931: [0, 0.68611, 0.11431, 0, 0.82666],
    933: [0, 0.68611, 0.10778, 0, 0.88555],
    934: [0, 0.68611, 0.05632, 0, 0.82666],
    936: [0, 0.68611, 0.10778, 0, 0.88555],
    937: [0, 0.68611, 0.0992, 0, 0.82666],
    8211: [0, 0.44444, 0.09811, 0, 0.59111],
    8212: [0, 0.44444, 0.09811, 0, 1.18221],
    8216: [0, 0.69444, 0.12945, 0, 0.35555],
    8217: [0, 0.69444, 0.12945, 0, 0.35555],
    8220: [0, 0.69444, 0.16772, 0, 0.62055],
    8221: [0, 0.69444, 0.07939, 0, 0.62055]
  },
  "Main-Italic": {
    32: [0, 0, 0, 0, 0.25],
    33: [0, 0.69444, 0.12417, 0, 0.30667],
    34: [0, 0.69444, 0.06961, 0, 0.51444],
    35: [0.19444, 0.69444, 0.06616, 0, 0.81777],
    37: [0.05556, 0.75, 0.13639, 0, 0.81777],
    38: [0, 0.69444, 0.09694, 0, 0.76666],
    39: [0, 0.69444, 0.12417, 0, 0.30667],
    40: [0.25, 0.75, 0.16194, 0, 0.40889],
    41: [0.25, 0.75, 0.03694, 0, 0.40889],
    42: [0, 0.75, 0.14917, 0, 0.51111],
    43: [0.05667, 0.56167, 0.03694, 0, 0.76666],
    44: [0.19444, 0.10556, 0, 0, 0.30667],
    45: [0, 0.43056, 0.02826, 0, 0.35778],
    46: [0, 0.10556, 0, 0, 0.30667],
    47: [0.25, 0.75, 0.16194, 0, 0.51111],
    48: [0, 0.64444, 0.13556, 0, 0.51111],
    49: [0, 0.64444, 0.13556, 0, 0.51111],
    50: [0, 0.64444, 0.13556, 0, 0.51111],
    51: [0, 0.64444, 0.13556, 0, 0.51111],
    52: [0.19444, 0.64444, 0.13556, 0, 0.51111],
    53: [0, 0.64444, 0.13556, 0, 0.51111],
    54: [0, 0.64444, 0.13556, 0, 0.51111],
    55: [0.19444, 0.64444, 0.13556, 0, 0.51111],
    56: [0, 0.64444, 0.13556, 0, 0.51111],
    57: [0, 0.64444, 0.13556, 0, 0.51111],
    58: [0, 0.43056, 0.0582, 0, 0.30667],
    59: [0.19444, 0.43056, 0.0582, 0, 0.30667],
    61: [-0.13313, 0.36687, 0.06616, 0, 0.76666],
    63: [0, 0.69444, 0.1225, 0, 0.51111],
    64: [0, 0.69444, 0.09597, 0, 0.76666],
    65: [0, 0.68333, 0, 0, 0.74333],
    66: [0, 0.68333, 0.10257, 0, 0.70389],
    67: [0, 0.68333, 0.14528, 0, 0.71555],
    68: [0, 0.68333, 0.09403, 0, 0.755],
    69: [0, 0.68333, 0.12028, 0, 0.67833],
    70: [0, 0.68333, 0.13305, 0, 0.65277],
    71: [0, 0.68333, 0.08722, 0, 0.77361],
    72: [0, 0.68333, 0.16389, 0, 0.74333],
    73: [0, 0.68333, 0.15806, 0, 0.38555],
    74: [0, 0.68333, 0.14028, 0, 0.525],
    75: [0, 0.68333, 0.14528, 0, 0.76888],
    76: [0, 0.68333, 0, 0, 0.62722],
    77: [0, 0.68333, 0.16389, 0, 0.89666],
    78: [0, 0.68333, 0.16389, 0, 0.74333],
    79: [0, 0.68333, 0.09403, 0, 0.76666],
    80: [0, 0.68333, 0.10257, 0, 0.67833],
    81: [0.19444, 0.68333, 0.09403, 0, 0.76666],
    82: [0, 0.68333, 0.03868, 0, 0.72944],
    83: [0, 0.68333, 0.11972, 0, 0.56222],
    84: [0, 0.68333, 0.13305, 0, 0.71555],
    85: [0, 0.68333, 0.16389, 0, 0.74333],
    86: [0, 0.68333, 0.18361, 0, 0.74333],
    87: [0, 0.68333, 0.18361, 0, 0.99888],
    88: [0, 0.68333, 0.15806, 0, 0.74333],
    89: [0, 0.68333, 0.19383, 0, 0.74333],
    90: [0, 0.68333, 0.14528, 0, 0.61333],
    91: [0.25, 0.75, 0.1875, 0, 0.30667],
    93: [0.25, 0.75, 0.10528, 0, 0.30667],
    94: [0, 0.69444, 0.06646, 0, 0.51111],
    95: [0.31, 0.12056, 0.09208, 0, 0.51111],
    97: [0, 0.43056, 0.07671, 0, 0.51111],
    98: [0, 0.69444, 0.06312, 0, 0.46],
    99: [0, 0.43056, 0.05653, 0, 0.46],
    100: [0, 0.69444, 0.10333, 0, 0.51111],
    101: [0, 0.43056, 0.07514, 0, 0.46],
    102: [0.19444, 0.69444, 0.21194, 0, 0.30667],
    103: [0.19444, 0.43056, 0.08847, 0, 0.46],
    104: [0, 0.69444, 0.07671, 0, 0.51111],
    105: [0, 0.65536, 0.1019, 0, 0.30667],
    106: [0.19444, 0.65536, 0.14467, 0, 0.30667],
    107: [0, 0.69444, 0.10764, 0, 0.46],
    108: [0, 0.69444, 0.10333, 0, 0.25555],
    109: [0, 0.43056, 0.07671, 0, 0.81777],
    110: [0, 0.43056, 0.07671, 0, 0.56222],
    111: [0, 0.43056, 0.06312, 0, 0.51111],
    112: [0.19444, 0.43056, 0.06312, 0, 0.51111],
    113: [0.19444, 0.43056, 0.08847, 0, 0.46],
    114: [0, 0.43056, 0.10764, 0, 0.42166],
    115: [0, 0.43056, 0.08208, 0, 0.40889],
    116: [0, 0.61508, 0.09486, 0, 0.33222],
    117: [0, 0.43056, 0.07671, 0, 0.53666],
    118: [0, 0.43056, 0.10764, 0, 0.46],
    119: [0, 0.43056, 0.10764, 0, 0.66444],
    120: [0, 0.43056, 0.12042, 0, 0.46389],
    121: [0.19444, 0.43056, 0.08847, 0, 0.48555],
    122: [0, 0.43056, 0.12292, 0, 0.40889],
    126: [0.35, 0.31786, 0.11585, 0, 0.51111],
    160: [0, 0, 0, 0, 0.25],
    168: [0, 0.66786, 0.10474, 0, 0.51111],
    176: [0, 0.69444, 0, 0, 0.83129],
    184: [0.17014, 0, 0, 0, 0.46],
    198: [0, 0.68333, 0.12028, 0, 0.88277],
    216: [0.04861, 0.73194, 0.09403, 0, 0.76666],
    223: [0.19444, 0.69444, 0.10514, 0, 0.53666],
    230: [0, 0.43056, 0.07514, 0, 0.71555],
    248: [0.09722, 0.52778, 0.09194, 0, 0.51111],
    338: [0, 0.68333, 0.12028, 0, 0.98499],
    339: [0, 0.43056, 0.07514, 0, 0.71555],
    710: [0, 0.69444, 0.06646, 0, 0.51111],
    711: [0, 0.62847, 0.08295, 0, 0.51111],
    713: [0, 0.56167, 0.10333, 0, 0.51111],
    714: [0, 0.69444, 0.09694, 0, 0.51111],
    715: [0, 0.69444, 0, 0, 0.51111],
    728: [0, 0.69444, 0.10806, 0, 0.51111],
    729: [0, 0.66786, 0.11752, 0, 0.30667],
    730: [0, 0.69444, 0, 0, 0.83129],
    732: [0, 0.66786, 0.11585, 0, 0.51111],
    733: [0, 0.69444, 0.1225, 0, 0.51111],
    915: [0, 0.68333, 0.13305, 0, 0.62722],
    916: [0, 0.68333, 0, 0, 0.81777],
    920: [0, 0.68333, 0.09403, 0, 0.76666],
    923: [0, 0.68333, 0, 0, 0.69222],
    926: [0, 0.68333, 0.15294, 0, 0.66444],
    928: [0, 0.68333, 0.16389, 0, 0.74333],
    931: [0, 0.68333, 0.12028, 0, 0.71555],
    933: [0, 0.68333, 0.11111, 0, 0.76666],
    934: [0, 0.68333, 0.05986, 0, 0.71555],
    936: [0, 0.68333, 0.11111, 0, 0.76666],
    937: [0, 0.68333, 0.10257, 0, 0.71555],
    8211: [0, 0.43056, 0.09208, 0, 0.51111],
    8212: [0, 0.43056, 0.09208, 0, 1.02222],
    8216: [0, 0.69444, 0.12417, 0, 0.30667],
    8217: [0, 0.69444, 0.12417, 0, 0.30667],
    8220: [0, 0.69444, 0.1685, 0, 0.51444],
    8221: [0, 0.69444, 0.06961, 0, 0.51444],
    8463: [0, 0.68889, 0, 0, 0.54028]
  },
  "Main-Regular": {
    32: [0, 0, 0, 0, 0.25],
    33: [0, 0.69444, 0, 0, 0.27778],
    34: [0, 0.69444, 0, 0, 0.5],
    35: [0.19444, 0.69444, 0, 0, 0.83334],
    36: [0.05556, 0.75, 0, 0, 0.5],
    37: [0.05556, 0.75, 0, 0, 0.83334],
    38: [0, 0.69444, 0, 0, 0.77778],
    39: [0, 0.69444, 0, 0, 0.27778],
    40: [0.25, 0.75, 0, 0, 0.38889],
    41: [0.25, 0.75, 0, 0, 0.38889],
    42: [0, 0.75, 0, 0, 0.5],
    43: [0.08333, 0.58333, 0, 0, 0.77778],
    44: [0.19444, 0.10556, 0, 0, 0.27778],
    45: [0, 0.43056, 0, 0, 0.33333],
    46: [0, 0.10556, 0, 0, 0.27778],
    47: [0.25, 0.75, 0, 0, 0.5],
    48: [0, 0.64444, 0, 0, 0.5],
    49: [0, 0.64444, 0, 0, 0.5],
    50: [0, 0.64444, 0, 0, 0.5],
    51: [0, 0.64444, 0, 0, 0.5],
    52: [0, 0.64444, 0, 0, 0.5],
    53: [0, 0.64444, 0, 0, 0.5],
    54: [0, 0.64444, 0, 0, 0.5],
    55: [0, 0.64444, 0, 0, 0.5],
    56: [0, 0.64444, 0, 0, 0.5],
    57: [0, 0.64444, 0, 0, 0.5],
    58: [0, 0.43056, 0, 0, 0.27778],
    59: [0.19444, 0.43056, 0, 0, 0.27778],
    60: [0.0391, 0.5391, 0, 0, 0.77778],
    61: [-0.13313, 0.36687, 0, 0, 0.77778],
    62: [0.0391, 0.5391, 0, 0, 0.77778],
    63: [0, 0.69444, 0, 0, 0.47222],
    64: [0, 0.69444, 0, 0, 0.77778],
    65: [0, 0.68333, 0, 0, 0.75],
    66: [0, 0.68333, 0, 0, 0.70834],
    67: [0, 0.68333, 0, 0, 0.72222],
    68: [0, 0.68333, 0, 0, 0.76389],
    69: [0, 0.68333, 0, 0, 0.68056],
    70: [0, 0.68333, 0, 0, 0.65278],
    71: [0, 0.68333, 0, 0, 0.78472],
    72: [0, 0.68333, 0, 0, 0.75],
    73: [0, 0.68333, 0, 0, 0.36111],
    74: [0, 0.68333, 0, 0, 0.51389],
    75: [0, 0.68333, 0, 0, 0.77778],
    76: [0, 0.68333, 0, 0, 0.625],
    77: [0, 0.68333, 0, 0, 0.91667],
    78: [0, 0.68333, 0, 0, 0.75],
    79: [0, 0.68333, 0, 0, 0.77778],
    80: [0, 0.68333, 0, 0, 0.68056],
    81: [0.19444, 0.68333, 0, 0, 0.77778],
    82: [0, 0.68333, 0, 0, 0.73611],
    83: [0, 0.68333, 0, 0, 0.55556],
    84: [0, 0.68333, 0, 0, 0.72222],
    85: [0, 0.68333, 0, 0, 0.75],
    86: [0, 0.68333, 0.01389, 0, 0.75],
    87: [0, 0.68333, 0.01389, 0, 1.02778],
    88: [0, 0.68333, 0, 0, 0.75],
    89: [0, 0.68333, 0.025, 0, 0.75],
    90: [0, 0.68333, 0, 0, 0.61111],
    91: [0.25, 0.75, 0, 0, 0.27778],
    92: [0.25, 0.75, 0, 0, 0.5],
    93: [0.25, 0.75, 0, 0, 0.27778],
    94: [0, 0.69444, 0, 0, 0.5],
    95: [0.31, 0.12056, 0.02778, 0, 0.5],
    97: [0, 0.43056, 0, 0, 0.5],
    98: [0, 0.69444, 0, 0, 0.55556],
    99: [0, 0.43056, 0, 0, 0.44445],
    100: [0, 0.69444, 0, 0, 0.55556],
    101: [0, 0.43056, 0, 0, 0.44445],
    102: [0, 0.69444, 0.07778, 0, 0.30556],
    103: [0.19444, 0.43056, 0.01389, 0, 0.5],
    104: [0, 0.69444, 0, 0, 0.55556],
    105: [0, 0.66786, 0, 0, 0.27778],
    106: [0.19444, 0.66786, 0, 0, 0.30556],
    107: [0, 0.69444, 0, 0, 0.52778],
    108: [0, 0.69444, 0, 0, 0.27778],
    109: [0, 0.43056, 0, 0, 0.83334],
    110: [0, 0.43056, 0, 0, 0.55556],
    111: [0, 0.43056, 0, 0, 0.5],
    112: [0.19444, 0.43056, 0, 0, 0.55556],
    113: [0.19444, 0.43056, 0, 0, 0.52778],
    114: [0, 0.43056, 0, 0, 0.39167],
    115: [0, 0.43056, 0, 0, 0.39445],
    116: [0, 0.61508, 0, 0, 0.38889],
    117: [0, 0.43056, 0, 0, 0.55556],
    118: [0, 0.43056, 0.01389, 0, 0.52778],
    119: [0, 0.43056, 0.01389, 0, 0.72222],
    120: [0, 0.43056, 0, 0, 0.52778],
    121: [0.19444, 0.43056, 0.01389, 0, 0.52778],
    122: [0, 0.43056, 0, 0, 0.44445],
    123: [0.25, 0.75, 0, 0, 0.5],
    124: [0.25, 0.75, 0, 0, 0.27778],
    125: [0.25, 0.75, 0, 0, 0.5],
    126: [0.35, 0.31786, 0, 0, 0.5],
    160: [0, 0, 0, 0, 0.25],
    163: [0, 0.69444, 0, 0, 0.76909],
    167: [0.19444, 0.69444, 0, 0, 0.44445],
    168: [0, 0.66786, 0, 0, 0.5],
    172: [0, 0.43056, 0, 0, 0.66667],
    176: [0, 0.69444, 0, 0, 0.75],
    177: [0.08333, 0.58333, 0, 0, 0.77778],
    182: [0.19444, 0.69444, 0, 0, 0.61111],
    184: [0.17014, 0, 0, 0, 0.44445],
    198: [0, 0.68333, 0, 0, 0.90278],
    215: [0.08333, 0.58333, 0, 0, 0.77778],
    216: [0.04861, 0.73194, 0, 0, 0.77778],
    223: [0, 0.69444, 0, 0, 0.5],
    230: [0, 0.43056, 0, 0, 0.72222],
    247: [0.08333, 0.58333, 0, 0, 0.77778],
    248: [0.09722, 0.52778, 0, 0, 0.5],
    305: [0, 0.43056, 0, 0, 0.27778],
    338: [0, 0.68333, 0, 0, 1.01389],
    339: [0, 0.43056, 0, 0, 0.77778],
    567: [0.19444, 0.43056, 0, 0, 0.30556],
    710: [0, 0.69444, 0, 0, 0.5],
    711: [0, 0.62847, 0, 0, 0.5],
    713: [0, 0.56778, 0, 0, 0.5],
    714: [0, 0.69444, 0, 0, 0.5],
    715: [0, 0.69444, 0, 0, 0.5],
    728: [0, 0.69444, 0, 0, 0.5],
    729: [0, 0.66786, 0, 0, 0.27778],
    730: [0, 0.69444, 0, 0, 0.75],
    732: [0, 0.66786, 0, 0, 0.5],
    733: [0, 0.69444, 0, 0, 0.5],
    915: [0, 0.68333, 0, 0, 0.625],
    916: [0, 0.68333, 0, 0, 0.83334],
    920: [0, 0.68333, 0, 0, 0.77778],
    923: [0, 0.68333, 0, 0, 0.69445],
    926: [0, 0.68333, 0, 0, 0.66667],
    928: [0, 0.68333, 0, 0, 0.75],
    931: [0, 0.68333, 0, 0, 0.72222],
    933: [0, 0.68333, 0, 0, 0.77778],
    934: [0, 0.68333, 0, 0, 0.72222],
    936: [0, 0.68333, 0, 0, 0.77778],
    937: [0, 0.68333, 0, 0, 0.72222],
    8211: [0, 0.43056, 0.02778, 0, 0.5],
    8212: [0, 0.43056, 0.02778, 0, 1],
    8216: [0, 0.69444, 0, 0, 0.27778],
    8217: [0, 0.69444, 0, 0, 0.27778],
    8220: [0, 0.69444, 0, 0, 0.5],
    8221: [0, 0.69444, 0, 0, 0.5],
    8224: [0.19444, 0.69444, 0, 0, 0.44445],
    8225: [0.19444, 0.69444, 0, 0, 0.44445],
    8230: [0, 0.123, 0, 0, 1.172],
    8242: [0, 0.55556, 0, 0, 0.275],
    8407: [0, 0.71444, 0.15382, 0, 0.5],
    8463: [0, 0.68889, 0, 0, 0.54028],
    8465: [0, 0.69444, 0, 0, 0.72222],
    8467: [0, 0.69444, 0, 0.11111, 0.41667],
    8472: [0.19444, 0.43056, 0, 0.11111, 0.63646],
    8476: [0, 0.69444, 0, 0, 0.72222],
    8501: [0, 0.69444, 0, 0, 0.61111],
    8592: [-0.13313, 0.36687, 0, 0, 1],
    8593: [0.19444, 0.69444, 0, 0, 0.5],
    8594: [-0.13313, 0.36687, 0, 0, 1],
    8595: [0.19444, 0.69444, 0, 0, 0.5],
    8596: [-0.13313, 0.36687, 0, 0, 1],
    8597: [0.25, 0.75, 0, 0, 0.5],
    8598: [0.19444, 0.69444, 0, 0, 1],
    8599: [0.19444, 0.69444, 0, 0, 1],
    8600: [0.19444, 0.69444, 0, 0, 1],
    8601: [0.19444, 0.69444, 0, 0, 1],
    8614: [0.011, 0.511, 0, 0, 1],
    8617: [0.011, 0.511, 0, 0, 1.126],
    8618: [0.011, 0.511, 0, 0, 1.126],
    8636: [-0.13313, 0.36687, 0, 0, 1],
    8637: [-0.13313, 0.36687, 0, 0, 1],
    8640: [-0.13313, 0.36687, 0, 0, 1],
    8641: [-0.13313, 0.36687, 0, 0, 1],
    8652: [0.011, 0.671, 0, 0, 1],
    8656: [-0.13313, 0.36687, 0, 0, 1],
    8657: [0.19444, 0.69444, 0, 0, 0.61111],
    8658: [-0.13313, 0.36687, 0, 0, 1],
    8659: [0.19444, 0.69444, 0, 0, 0.61111],
    8660: [-0.13313, 0.36687, 0, 0, 1],
    8661: [0.25, 0.75, 0, 0, 0.61111],
    8704: [0, 0.69444, 0, 0, 0.55556],
    8706: [0, 0.69444, 0.05556, 0.08334, 0.5309],
    8707: [0, 0.69444, 0, 0, 0.55556],
    8709: [0.05556, 0.75, 0, 0, 0.5],
    8711: [0, 0.68333, 0, 0, 0.83334],
    8712: [0.0391, 0.5391, 0, 0, 0.66667],
    8715: [0.0391, 0.5391, 0, 0, 0.66667],
    8722: [0.08333, 0.58333, 0, 0, 0.77778],
    8723: [0.08333, 0.58333, 0, 0, 0.77778],
    8725: [0.25, 0.75, 0, 0, 0.5],
    8726: [0.25, 0.75, 0, 0, 0.5],
    8727: [-0.03472, 0.46528, 0, 0, 0.5],
    8728: [-0.05555, 0.44445, 0, 0, 0.5],
    8729: [-0.05555, 0.44445, 0, 0, 0.5],
    8730: [0.2, 0.8, 0, 0, 0.83334],
    8733: [0, 0.43056, 0, 0, 0.77778],
    8734: [0, 0.43056, 0, 0, 1],
    8736: [0, 0.69224, 0, 0, 0.72222],
    8739: [0.25, 0.75, 0, 0, 0.27778],
    8741: [0.25, 0.75, 0, 0, 0.5],
    8743: [0, 0.55556, 0, 0, 0.66667],
    8744: [0, 0.55556, 0, 0, 0.66667],
    8745: [0, 0.55556, 0, 0, 0.66667],
    8746: [0, 0.55556, 0, 0, 0.66667],
    8747: [0.19444, 0.69444, 0.11111, 0, 0.41667],
    8764: [-0.13313, 0.36687, 0, 0, 0.77778],
    8768: [0.19444, 0.69444, 0, 0, 0.27778],
    8771: [-0.03625, 0.46375, 0, 0, 0.77778],
    8773: [-0.022, 0.589, 0, 0, 0.778],
    8776: [-0.01688, 0.48312, 0, 0, 0.77778],
    8781: [-0.03625, 0.46375, 0, 0, 0.77778],
    8784: [-0.133, 0.673, 0, 0, 0.778],
    8801: [-0.03625, 0.46375, 0, 0, 0.77778],
    8804: [0.13597, 0.63597, 0, 0, 0.77778],
    8805: [0.13597, 0.63597, 0, 0, 0.77778],
    8810: [0.0391, 0.5391, 0, 0, 1],
    8811: [0.0391, 0.5391, 0, 0, 1],
    8826: [0.0391, 0.5391, 0, 0, 0.77778],
    8827: [0.0391, 0.5391, 0, 0, 0.77778],
    8834: [0.0391, 0.5391, 0, 0, 0.77778],
    8835: [0.0391, 0.5391, 0, 0, 0.77778],
    8838: [0.13597, 0.63597, 0, 0, 0.77778],
    8839: [0.13597, 0.63597, 0, 0, 0.77778],
    8846: [0, 0.55556, 0, 0, 0.66667],
    8849: [0.13597, 0.63597, 0, 0, 0.77778],
    8850: [0.13597, 0.63597, 0, 0, 0.77778],
    8851: [0, 0.55556, 0, 0, 0.66667],
    8852: [0, 0.55556, 0, 0, 0.66667],
    8853: [0.08333, 0.58333, 0, 0, 0.77778],
    8854: [0.08333, 0.58333, 0, 0, 0.77778],
    8855: [0.08333, 0.58333, 0, 0, 0.77778],
    8856: [0.08333, 0.58333, 0, 0, 0.77778],
    8857: [0.08333, 0.58333, 0, 0, 0.77778],
    8866: [0, 0.69444, 0, 0, 0.61111],
    8867: [0, 0.69444, 0, 0, 0.61111],
    8868: [0, 0.69444, 0, 0, 0.77778],
    8869: [0, 0.69444, 0, 0, 0.77778],
    8872: [0.249, 0.75, 0, 0, 0.867],
    8900: [-0.05555, 0.44445, 0, 0, 0.5],
    8901: [-0.05555, 0.44445, 0, 0, 0.27778],
    8902: [-0.03472, 0.46528, 0, 0, 0.5],
    8904: [5e-3, 0.505, 0, 0, 0.9],
    8942: [0.03, 0.903, 0, 0, 0.278],
    8943: [-0.19, 0.313, 0, 0, 1.172],
    8945: [-0.1, 0.823, 0, 0, 1.282],
    8968: [0.25, 0.75, 0, 0, 0.44445],
    8969: [0.25, 0.75, 0, 0, 0.44445],
    8970: [0.25, 0.75, 0, 0, 0.44445],
    8971: [0.25, 0.75, 0, 0, 0.44445],
    8994: [-0.14236, 0.35764, 0, 0, 1],
    8995: [-0.14236, 0.35764, 0, 0, 1],
    9136: [0.244, 0.744, 0, 0, 0.412],
    9137: [0.244, 0.745, 0, 0, 0.412],
    9651: [0.19444, 0.69444, 0, 0, 0.88889],
    9657: [-0.03472, 0.46528, 0, 0, 0.5],
    9661: [0.19444, 0.69444, 0, 0, 0.88889],
    9667: [-0.03472, 0.46528, 0, 0, 0.5],
    9711: [0.19444, 0.69444, 0, 0, 1],
    9824: [0.12963, 0.69444, 0, 0, 0.77778],
    9825: [0.12963, 0.69444, 0, 0, 0.77778],
    9826: [0.12963, 0.69444, 0, 0, 0.77778],
    9827: [0.12963, 0.69444, 0, 0, 0.77778],
    9837: [0, 0.75, 0, 0, 0.38889],
    9838: [0.19444, 0.69444, 0, 0, 0.38889],
    9839: [0.19444, 0.69444, 0, 0, 0.38889],
    10216: [0.25, 0.75, 0, 0, 0.38889],
    10217: [0.25, 0.75, 0, 0, 0.38889],
    10222: [0.244, 0.744, 0, 0, 0.412],
    10223: [0.244, 0.745, 0, 0, 0.412],
    10229: [0.011, 0.511, 0, 0, 1.609],
    10230: [0.011, 0.511, 0, 0, 1.638],
    10231: [0.011, 0.511, 0, 0, 1.859],
    10232: [0.024, 0.525, 0, 0, 1.609],
    10233: [0.024, 0.525, 0, 0, 1.638],
    10234: [0.024, 0.525, 0, 0, 1.858],
    10236: [0.011, 0.511, 0, 0, 1.638],
    10815: [0, 0.68333, 0, 0, 0.75],
    10927: [0.13597, 0.63597, 0, 0, 0.77778],
    10928: [0.13597, 0.63597, 0, 0, 0.77778],
    57376: [0.19444, 0.69444, 0, 0, 0]
  },
  "Math-BoldItalic": {
    32: [0, 0, 0, 0, 0.25],
    48: [0, 0.44444, 0, 0, 0.575],
    49: [0, 0.44444, 0, 0, 0.575],
    50: [0, 0.44444, 0, 0, 0.575],
    51: [0.19444, 0.44444, 0, 0, 0.575],
    52: [0.19444, 0.44444, 0, 0, 0.575],
    53: [0.19444, 0.44444, 0, 0, 0.575],
    54: [0, 0.64444, 0, 0, 0.575],
    55: [0.19444, 0.44444, 0, 0, 0.575],
    56: [0, 0.64444, 0, 0, 0.575],
    57: [0.19444, 0.44444, 0, 0, 0.575],
    65: [0, 0.68611, 0, 0, 0.86944],
    66: [0, 0.68611, 0.04835, 0, 0.8664],
    67: [0, 0.68611, 0.06979, 0, 0.81694],
    68: [0, 0.68611, 0.03194, 0, 0.93812],
    69: [0, 0.68611, 0.05451, 0, 0.81007],
    70: [0, 0.68611, 0.15972, 0, 0.68889],
    71: [0, 0.68611, 0, 0, 0.88673],
    72: [0, 0.68611, 0.08229, 0, 0.98229],
    73: [0, 0.68611, 0.07778, 0, 0.51111],
    74: [0, 0.68611, 0.10069, 0, 0.63125],
    75: [0, 0.68611, 0.06979, 0, 0.97118],
    76: [0, 0.68611, 0, 0, 0.75555],
    77: [0, 0.68611, 0.11424, 0, 1.14201],
    78: [0, 0.68611, 0.11424, 0, 0.95034],
    79: [0, 0.68611, 0.03194, 0, 0.83666],
    80: [0, 0.68611, 0.15972, 0, 0.72309],
    81: [0.19444, 0.68611, 0, 0, 0.86861],
    82: [0, 0.68611, 421e-5, 0, 0.87235],
    83: [0, 0.68611, 0.05382, 0, 0.69271],
    84: [0, 0.68611, 0.15972, 0, 0.63663],
    85: [0, 0.68611, 0.11424, 0, 0.80027],
    86: [0, 0.68611, 0.25555, 0, 0.67778],
    87: [0, 0.68611, 0.15972, 0, 1.09305],
    88: [0, 0.68611, 0.07778, 0, 0.94722],
    89: [0, 0.68611, 0.25555, 0, 0.67458],
    90: [0, 0.68611, 0.06979, 0, 0.77257],
    97: [0, 0.44444, 0, 0, 0.63287],
    98: [0, 0.69444, 0, 0, 0.52083],
    99: [0, 0.44444, 0, 0, 0.51342],
    100: [0, 0.69444, 0, 0, 0.60972],
    101: [0, 0.44444, 0, 0, 0.55361],
    102: [0.19444, 0.69444, 0.11042, 0, 0.56806],
    103: [0.19444, 0.44444, 0.03704, 0, 0.5449],
    104: [0, 0.69444, 0, 0, 0.66759],
    105: [0, 0.69326, 0, 0, 0.4048],
    106: [0.19444, 0.69326, 0.0622, 0, 0.47083],
    107: [0, 0.69444, 0.01852, 0, 0.6037],
    108: [0, 0.69444, 88e-4, 0, 0.34815],
    109: [0, 0.44444, 0, 0, 1.0324],
    110: [0, 0.44444, 0, 0, 0.71296],
    111: [0, 0.44444, 0, 0, 0.58472],
    112: [0.19444, 0.44444, 0, 0, 0.60092],
    113: [0.19444, 0.44444, 0.03704, 0, 0.54213],
    114: [0, 0.44444, 0.03194, 0, 0.5287],
    115: [0, 0.44444, 0, 0, 0.53125],
    116: [0, 0.63492, 0, 0, 0.41528],
    117: [0, 0.44444, 0, 0, 0.68102],
    118: [0, 0.44444, 0.03704, 0, 0.56666],
    119: [0, 0.44444, 0.02778, 0, 0.83148],
    120: [0, 0.44444, 0, 0, 0.65903],
    121: [0.19444, 0.44444, 0.03704, 0, 0.59028],
    122: [0, 0.44444, 0.04213, 0, 0.55509],
    160: [0, 0, 0, 0, 0.25],
    915: [0, 0.68611, 0.15972, 0, 0.65694],
    916: [0, 0.68611, 0, 0, 0.95833],
    920: [0, 0.68611, 0.03194, 0, 0.86722],
    923: [0, 0.68611, 0, 0, 0.80555],
    926: [0, 0.68611, 0.07458, 0, 0.84125],
    928: [0, 0.68611, 0.08229, 0, 0.98229],
    931: [0, 0.68611, 0.05451, 0, 0.88507],
    933: [0, 0.68611, 0.15972, 0, 0.67083],
    934: [0, 0.68611, 0, 0, 0.76666],
    936: [0, 0.68611, 0.11653, 0, 0.71402],
    937: [0, 0.68611, 0.04835, 0, 0.8789],
    945: [0, 0.44444, 0, 0, 0.76064],
    946: [0.19444, 0.69444, 0.03403, 0, 0.65972],
    947: [0.19444, 0.44444, 0.06389, 0, 0.59003],
    948: [0, 0.69444, 0.03819, 0, 0.52222],
    949: [0, 0.44444, 0, 0, 0.52882],
    950: [0.19444, 0.69444, 0.06215, 0, 0.50833],
    951: [0.19444, 0.44444, 0.03704, 0, 0.6],
    952: [0, 0.69444, 0.03194, 0, 0.5618],
    953: [0, 0.44444, 0, 0, 0.41204],
    954: [0, 0.44444, 0, 0, 0.66759],
    955: [0, 0.69444, 0, 0, 0.67083],
    956: [0.19444, 0.44444, 0, 0, 0.70787],
    957: [0, 0.44444, 0.06898, 0, 0.57685],
    958: [0.19444, 0.69444, 0.03021, 0, 0.50833],
    959: [0, 0.44444, 0, 0, 0.58472],
    960: [0, 0.44444, 0.03704, 0, 0.68241],
    961: [0.19444, 0.44444, 0, 0, 0.6118],
    962: [0.09722, 0.44444, 0.07917, 0, 0.42361],
    963: [0, 0.44444, 0.03704, 0, 0.68588],
    964: [0, 0.44444, 0.13472, 0, 0.52083],
    965: [0, 0.44444, 0.03704, 0, 0.63055],
    966: [0.19444, 0.44444, 0, 0, 0.74722],
    967: [0.19444, 0.44444, 0, 0, 0.71805],
    968: [0.19444, 0.69444, 0.03704, 0, 0.75833],
    969: [0, 0.44444, 0.03704, 0, 0.71782],
    977: [0, 0.69444, 0, 0, 0.69155],
    981: [0.19444, 0.69444, 0, 0, 0.7125],
    982: [0, 0.44444, 0.03194, 0, 0.975],
    1009: [0.19444, 0.44444, 0, 0, 0.6118],
    1013: [0, 0.44444, 0, 0, 0.48333],
    57649: [0, 0.44444, 0, 0, 0.39352],
    57911: [0.19444, 0.44444, 0, 0, 0.43889]
  },
  "Math-Italic": {
    32: [0, 0, 0, 0, 0.25],
    48: [0, 0.43056, 0, 0, 0.5],
    49: [0, 0.43056, 0, 0, 0.5],
    50: [0, 0.43056, 0, 0, 0.5],
    51: [0.19444, 0.43056, 0, 0, 0.5],
    52: [0.19444, 0.43056, 0, 0, 0.5],
    53: [0.19444, 0.43056, 0, 0, 0.5],
    54: [0, 0.64444, 0, 0, 0.5],
    55: [0.19444, 0.43056, 0, 0, 0.5],
    56: [0, 0.64444, 0, 0, 0.5],
    57: [0.19444, 0.43056, 0, 0, 0.5],
    65: [0, 0.68333, 0, 0.13889, 0.75],
    66: [0, 0.68333, 0.05017, 0.08334, 0.75851],
    67: [0, 0.68333, 0.07153, 0.08334, 0.71472],
    68: [0, 0.68333, 0.02778, 0.05556, 0.82792],
    69: [0, 0.68333, 0.05764, 0.08334, 0.7382],
    70: [0, 0.68333, 0.13889, 0.08334, 0.64306],
    71: [0, 0.68333, 0, 0.08334, 0.78625],
    72: [0, 0.68333, 0.08125, 0.05556, 0.83125],
    73: [0, 0.68333, 0.07847, 0.11111, 0.43958],
    74: [0, 0.68333, 0.09618, 0.16667, 0.55451],
    75: [0, 0.68333, 0.07153, 0.05556, 0.84931],
    76: [0, 0.68333, 0, 0.02778, 0.68056],
    77: [0, 0.68333, 0.10903, 0.08334, 0.97014],
    78: [0, 0.68333, 0.10903, 0.08334, 0.80347],
    79: [0, 0.68333, 0.02778, 0.08334, 0.76278],
    80: [0, 0.68333, 0.13889, 0.08334, 0.64201],
    81: [0.19444, 0.68333, 0, 0.08334, 0.79056],
    82: [0, 0.68333, 773e-5, 0.08334, 0.75929],
    83: [0, 0.68333, 0.05764, 0.08334, 0.6132],
    84: [0, 0.68333, 0.13889, 0.08334, 0.58438],
    85: [0, 0.68333, 0.10903, 0.02778, 0.68278],
    86: [0, 0.68333, 0.22222, 0, 0.58333],
    87: [0, 0.68333, 0.13889, 0, 0.94445],
    88: [0, 0.68333, 0.07847, 0.08334, 0.82847],
    89: [0, 0.68333, 0.22222, 0, 0.58056],
    90: [0, 0.68333, 0.07153, 0.08334, 0.68264],
    97: [0, 0.43056, 0, 0, 0.52859],
    98: [0, 0.69444, 0, 0, 0.42917],
    99: [0, 0.43056, 0, 0.05556, 0.43276],
    100: [0, 0.69444, 0, 0.16667, 0.52049],
    101: [0, 0.43056, 0, 0.05556, 0.46563],
    102: [0.19444, 0.69444, 0.10764, 0.16667, 0.48959],
    103: [0.19444, 0.43056, 0.03588, 0.02778, 0.47697],
    104: [0, 0.69444, 0, 0, 0.57616],
    105: [0, 0.65952, 0, 0, 0.34451],
    106: [0.19444, 0.65952, 0.05724, 0, 0.41181],
    107: [0, 0.69444, 0.03148, 0, 0.5206],
    108: [0, 0.69444, 0.01968, 0.08334, 0.29838],
    109: [0, 0.43056, 0, 0, 0.87801],
    110: [0, 0.43056, 0, 0, 0.60023],
    111: [0, 0.43056, 0, 0.05556, 0.48472],
    112: [0.19444, 0.43056, 0, 0.08334, 0.50313],
    113: [0.19444, 0.43056, 0.03588, 0.08334, 0.44641],
    114: [0, 0.43056, 0.02778, 0.05556, 0.45116],
    115: [0, 0.43056, 0, 0.05556, 0.46875],
    116: [0, 0.61508, 0, 0.08334, 0.36111],
    117: [0, 0.43056, 0, 0.02778, 0.57246],
    118: [0, 0.43056, 0.03588, 0.02778, 0.48472],
    119: [0, 0.43056, 0.02691, 0.08334, 0.71592],
    120: [0, 0.43056, 0, 0.02778, 0.57153],
    121: [0.19444, 0.43056, 0.03588, 0.05556, 0.49028],
    122: [0, 0.43056, 0.04398, 0.05556, 0.46505],
    160: [0, 0, 0, 0, 0.25],
    915: [0, 0.68333, 0.13889, 0.08334, 0.61528],
    916: [0, 0.68333, 0, 0.16667, 0.83334],
    920: [0, 0.68333, 0.02778, 0.08334, 0.76278],
    923: [0, 0.68333, 0, 0.16667, 0.69445],
    926: [0, 0.68333, 0.07569, 0.08334, 0.74236],
    928: [0, 0.68333, 0.08125, 0.05556, 0.83125],
    931: [0, 0.68333, 0.05764, 0.08334, 0.77986],
    933: [0, 0.68333, 0.13889, 0.05556, 0.58333],
    934: [0, 0.68333, 0, 0.08334, 0.66667],
    936: [0, 0.68333, 0.11, 0.05556, 0.61222],
    937: [0, 0.68333, 0.05017, 0.08334, 0.7724],
    945: [0, 0.43056, 37e-4, 0.02778, 0.6397],
    946: [0.19444, 0.69444, 0.05278, 0.08334, 0.56563],
    947: [0.19444, 0.43056, 0.05556, 0, 0.51773],
    948: [0, 0.69444, 0.03785, 0.05556, 0.44444],
    949: [0, 0.43056, 0, 0.08334, 0.46632],
    950: [0.19444, 0.69444, 0.07378, 0.08334, 0.4375],
    951: [0.19444, 0.43056, 0.03588, 0.05556, 0.49653],
    952: [0, 0.69444, 0.02778, 0.08334, 0.46944],
    953: [0, 0.43056, 0, 0.05556, 0.35394],
    954: [0, 0.43056, 0, 0, 0.57616],
    955: [0, 0.69444, 0, 0, 0.58334],
    956: [0.19444, 0.43056, 0, 0.02778, 0.60255],
    957: [0, 0.43056, 0.06366, 0.02778, 0.49398],
    958: [0.19444, 0.69444, 0.04601, 0.11111, 0.4375],
    959: [0, 0.43056, 0, 0.05556, 0.48472],
    960: [0, 0.43056, 0.03588, 0, 0.57003],
    961: [0.19444, 0.43056, 0, 0.08334, 0.51702],
    962: [0.09722, 0.43056, 0.07986, 0.08334, 0.36285],
    963: [0, 0.43056, 0.03588, 0, 0.57141],
    964: [0, 0.43056, 0.1132, 0.02778, 0.43715],
    965: [0, 0.43056, 0.03588, 0.02778, 0.54028],
    966: [0.19444, 0.43056, 0, 0.08334, 0.65417],
    967: [0.19444, 0.43056, 0, 0.05556, 0.62569],
    968: [0.19444, 0.69444, 0.03588, 0.11111, 0.65139],
    969: [0, 0.43056, 0.03588, 0, 0.62245],
    977: [0, 0.69444, 0, 0.08334, 0.59144],
    981: [0.19444, 0.69444, 0, 0.08334, 0.59583],
    982: [0, 0.43056, 0.02778, 0, 0.82813],
    1009: [0.19444, 0.43056, 0, 0.08334, 0.51702],
    1013: [0, 0.43056, 0, 0.05556, 0.4059],
    57649: [0, 0.43056, 0, 0.02778, 0.32246],
    57911: [0.19444, 0.43056, 0, 0.08334, 0.38403]
  },
  "SansSerif-Bold": {
    32: [0, 0, 0, 0, 0.25],
    33: [0, 0.69444, 0, 0, 0.36667],
    34: [0, 0.69444, 0, 0, 0.55834],
    35: [0.19444, 0.69444, 0, 0, 0.91667],
    36: [0.05556, 0.75, 0, 0, 0.55],
    37: [0.05556, 0.75, 0, 0, 1.02912],
    38: [0, 0.69444, 0, 0, 0.83056],
    39: [0, 0.69444, 0, 0, 0.30556],
    40: [0.25, 0.75, 0, 0, 0.42778],
    41: [0.25, 0.75, 0, 0, 0.42778],
    42: [0, 0.75, 0, 0, 0.55],
    43: [0.11667, 0.61667, 0, 0, 0.85556],
    44: [0.10556, 0.13056, 0, 0, 0.30556],
    45: [0, 0.45833, 0, 0, 0.36667],
    46: [0, 0.13056, 0, 0, 0.30556],
    47: [0.25, 0.75, 0, 0, 0.55],
    48: [0, 0.69444, 0, 0, 0.55],
    49: [0, 0.69444, 0, 0, 0.55],
    50: [0, 0.69444, 0, 0, 0.55],
    51: [0, 0.69444, 0, 0, 0.55],
    52: [0, 0.69444, 0, 0, 0.55],
    53: [0, 0.69444, 0, 0, 0.55],
    54: [0, 0.69444, 0, 0, 0.55],
    55: [0, 0.69444, 0, 0, 0.55],
    56: [0, 0.69444, 0, 0, 0.55],
    57: [0, 0.69444, 0, 0, 0.55],
    58: [0, 0.45833, 0, 0, 0.30556],
    59: [0.10556, 0.45833, 0, 0, 0.30556],
    61: [-0.09375, 0.40625, 0, 0, 0.85556],
    63: [0, 0.69444, 0, 0, 0.51945],
    64: [0, 0.69444, 0, 0, 0.73334],
    65: [0, 0.69444, 0, 0, 0.73334],
    66: [0, 0.69444, 0, 0, 0.73334],
    67: [0, 0.69444, 0, 0, 0.70278],
    68: [0, 0.69444, 0, 0, 0.79445],
    69: [0, 0.69444, 0, 0, 0.64167],
    70: [0, 0.69444, 0, 0, 0.61111],
    71: [0, 0.69444, 0, 0, 0.73334],
    72: [0, 0.69444, 0, 0, 0.79445],
    73: [0, 0.69444, 0, 0, 0.33056],
    74: [0, 0.69444, 0, 0, 0.51945],
    75: [0, 0.69444, 0, 0, 0.76389],
    76: [0, 0.69444, 0, 0, 0.58056],
    77: [0, 0.69444, 0, 0, 0.97778],
    78: [0, 0.69444, 0, 0, 0.79445],
    79: [0, 0.69444, 0, 0, 0.79445],
    80: [0, 0.69444, 0, 0, 0.70278],
    81: [0.10556, 0.69444, 0, 0, 0.79445],
    82: [0, 0.69444, 0, 0, 0.70278],
    83: [0, 0.69444, 0, 0, 0.61111],
    84: [0, 0.69444, 0, 0, 0.73334],
    85: [0, 0.69444, 0, 0, 0.76389],
    86: [0, 0.69444, 0.01528, 0, 0.73334],
    87: [0, 0.69444, 0.01528, 0, 1.03889],
    88: [0, 0.69444, 0, 0, 0.73334],
    89: [0, 0.69444, 0.0275, 0, 0.73334],
    90: [0, 0.69444, 0, 0, 0.67223],
    91: [0.25, 0.75, 0, 0, 0.34306],
    93: [0.25, 0.75, 0, 0, 0.34306],
    94: [0, 0.69444, 0, 0, 0.55],
    95: [0.35, 0.10833, 0.03056, 0, 0.55],
    97: [0, 0.45833, 0, 0, 0.525],
    98: [0, 0.69444, 0, 0, 0.56111],
    99: [0, 0.45833, 0, 0, 0.48889],
    100: [0, 0.69444, 0, 0, 0.56111],
    101: [0, 0.45833, 0, 0, 0.51111],
    102: [0, 0.69444, 0.07639, 0, 0.33611],
    103: [0.19444, 0.45833, 0.01528, 0, 0.55],
    104: [0, 0.69444, 0, 0, 0.56111],
    105: [0, 0.69444, 0, 0, 0.25556],
    106: [0.19444, 0.69444, 0, 0, 0.28611],
    107: [0, 0.69444, 0, 0, 0.53056],
    108: [0, 0.69444, 0, 0, 0.25556],
    109: [0, 0.45833, 0, 0, 0.86667],
    110: [0, 0.45833, 0, 0, 0.56111],
    111: [0, 0.45833, 0, 0, 0.55],
    112: [0.19444, 0.45833, 0, 0, 0.56111],
    113: [0.19444, 0.45833, 0, 0, 0.56111],
    114: [0, 0.45833, 0.01528, 0, 0.37222],
    115: [0, 0.45833, 0, 0, 0.42167],
    116: [0, 0.58929, 0, 0, 0.40417],
    117: [0, 0.45833, 0, 0, 0.56111],
    118: [0, 0.45833, 0.01528, 0, 0.5],
    119: [0, 0.45833, 0.01528, 0, 0.74445],
    120: [0, 0.45833, 0, 0, 0.5],
    121: [0.19444, 0.45833, 0.01528, 0, 0.5],
    122: [0, 0.45833, 0, 0, 0.47639],
    126: [0.35, 0.34444, 0, 0, 0.55],
    160: [0, 0, 0, 0, 0.25],
    168: [0, 0.69444, 0, 0, 0.55],
    176: [0, 0.69444, 0, 0, 0.73334],
    180: [0, 0.69444, 0, 0, 0.55],
    184: [0.17014, 0, 0, 0, 0.48889],
    305: [0, 0.45833, 0, 0, 0.25556],
    567: [0.19444, 0.45833, 0, 0, 0.28611],
    710: [0, 0.69444, 0, 0, 0.55],
    711: [0, 0.63542, 0, 0, 0.55],
    713: [0, 0.63778, 0, 0, 0.55],
    728: [0, 0.69444, 0, 0, 0.55],
    729: [0, 0.69444, 0, 0, 0.30556],
    730: [0, 0.69444, 0, 0, 0.73334],
    732: [0, 0.69444, 0, 0, 0.55],
    733: [0, 0.69444, 0, 0, 0.55],
    915: [0, 0.69444, 0, 0, 0.58056],
    916: [0, 0.69444, 0, 0, 0.91667],
    920: [0, 0.69444, 0, 0, 0.85556],
    923: [0, 0.69444, 0, 0, 0.67223],
    926: [0, 0.69444, 0, 0, 0.73334],
    928: [0, 0.69444, 0, 0, 0.79445],
    931: [0, 0.69444, 0, 0, 0.79445],
    933: [0, 0.69444, 0, 0, 0.85556],
    934: [0, 0.69444, 0, 0, 0.79445],
    936: [0, 0.69444, 0, 0, 0.85556],
    937: [0, 0.69444, 0, 0, 0.79445],
    8211: [0, 0.45833, 0.03056, 0, 0.55],
    8212: [0, 0.45833, 0.03056, 0, 1.10001],
    8216: [0, 0.69444, 0, 0, 0.30556],
    8217: [0, 0.69444, 0, 0, 0.30556],
    8220: [0, 0.69444, 0, 0, 0.55834],
    8221: [0, 0.69444, 0, 0, 0.55834]
  },
  "SansSerif-Italic": {
    32: [0, 0, 0, 0, 0.25],
    33: [0, 0.69444, 0.05733, 0, 0.31945],
    34: [0, 0.69444, 316e-5, 0, 0.5],
    35: [0.19444, 0.69444, 0.05087, 0, 0.83334],
    36: [0.05556, 0.75, 0.11156, 0, 0.5],
    37: [0.05556, 0.75, 0.03126, 0, 0.83334],
    38: [0, 0.69444, 0.03058, 0, 0.75834],
    39: [0, 0.69444, 0.07816, 0, 0.27778],
    40: [0.25, 0.75, 0.13164, 0, 0.38889],
    41: [0.25, 0.75, 0.02536, 0, 0.38889],
    42: [0, 0.75, 0.11775, 0, 0.5],
    43: [0.08333, 0.58333, 0.02536, 0, 0.77778],
    44: [0.125, 0.08333, 0, 0, 0.27778],
    45: [0, 0.44444, 0.01946, 0, 0.33333],
    46: [0, 0.08333, 0, 0, 0.27778],
    47: [0.25, 0.75, 0.13164, 0, 0.5],
    48: [0, 0.65556, 0.11156, 0, 0.5],
    49: [0, 0.65556, 0.11156, 0, 0.5],
    50: [0, 0.65556, 0.11156, 0, 0.5],
    51: [0, 0.65556, 0.11156, 0, 0.5],
    52: [0, 0.65556, 0.11156, 0, 0.5],
    53: [0, 0.65556, 0.11156, 0, 0.5],
    54: [0, 0.65556, 0.11156, 0, 0.5],
    55: [0, 0.65556, 0.11156, 0, 0.5],
    56: [0, 0.65556, 0.11156, 0, 0.5],
    57: [0, 0.65556, 0.11156, 0, 0.5],
    58: [0, 0.44444, 0.02502, 0, 0.27778],
    59: [0.125, 0.44444, 0.02502, 0, 0.27778],
    61: [-0.13, 0.37, 0.05087, 0, 0.77778],
    63: [0, 0.69444, 0.11809, 0, 0.47222],
    64: [0, 0.69444, 0.07555, 0, 0.66667],
    65: [0, 0.69444, 0, 0, 0.66667],
    66: [0, 0.69444, 0.08293, 0, 0.66667],
    67: [0, 0.69444, 0.11983, 0, 0.63889],
    68: [0, 0.69444, 0.07555, 0, 0.72223],
    69: [0, 0.69444, 0.11983, 0, 0.59722],
    70: [0, 0.69444, 0.13372, 0, 0.56945],
    71: [0, 0.69444, 0.11983, 0, 0.66667],
    72: [0, 0.69444, 0.08094, 0, 0.70834],
    73: [0, 0.69444, 0.13372, 0, 0.27778],
    74: [0, 0.69444, 0.08094, 0, 0.47222],
    75: [0, 0.69444, 0.11983, 0, 0.69445],
    76: [0, 0.69444, 0, 0, 0.54167],
    77: [0, 0.69444, 0.08094, 0, 0.875],
    78: [0, 0.69444, 0.08094, 0, 0.70834],
    79: [0, 0.69444, 0.07555, 0, 0.73611],
    80: [0, 0.69444, 0.08293, 0, 0.63889],
    81: [0.125, 0.69444, 0.07555, 0, 0.73611],
    82: [0, 0.69444, 0.08293, 0, 0.64584],
    83: [0, 0.69444, 0.09205, 0, 0.55556],
    84: [0, 0.69444, 0.13372, 0, 0.68056],
    85: [0, 0.69444, 0.08094, 0, 0.6875],
    86: [0, 0.69444, 0.1615, 0, 0.66667],
    87: [0, 0.69444, 0.1615, 0, 0.94445],
    88: [0, 0.69444, 0.13372, 0, 0.66667],
    89: [0, 0.69444, 0.17261, 0, 0.66667],
    90: [0, 0.69444, 0.11983, 0, 0.61111],
    91: [0.25, 0.75, 0.15942, 0, 0.28889],
    93: [0.25, 0.75, 0.08719, 0, 0.28889],
    94: [0, 0.69444, 0.0799, 0, 0.5],
    95: [0.35, 0.09444, 0.08616, 0, 0.5],
    97: [0, 0.44444, 981e-5, 0, 0.48056],
    98: [0, 0.69444, 0.03057, 0, 0.51667],
    99: [0, 0.44444, 0.08336, 0, 0.44445],
    100: [0, 0.69444, 0.09483, 0, 0.51667],
    101: [0, 0.44444, 0.06778, 0, 0.44445],
    102: [0, 0.69444, 0.21705, 0, 0.30556],
    103: [0.19444, 0.44444, 0.10836, 0, 0.5],
    104: [0, 0.69444, 0.01778, 0, 0.51667],
    105: [0, 0.67937, 0.09718, 0, 0.23889],
    106: [0.19444, 0.67937, 0.09162, 0, 0.26667],
    107: [0, 0.69444, 0.08336, 0, 0.48889],
    108: [0, 0.69444, 0.09483, 0, 0.23889],
    109: [0, 0.44444, 0.01778, 0, 0.79445],
    110: [0, 0.44444, 0.01778, 0, 0.51667],
    111: [0, 0.44444, 0.06613, 0, 0.5],
    112: [0.19444, 0.44444, 0.0389, 0, 0.51667],
    113: [0.19444, 0.44444, 0.04169, 0, 0.51667],
    114: [0, 0.44444, 0.10836, 0, 0.34167],
    115: [0, 0.44444, 0.0778, 0, 0.38333],
    116: [0, 0.57143, 0.07225, 0, 0.36111],
    117: [0, 0.44444, 0.04169, 0, 0.51667],
    118: [0, 0.44444, 0.10836, 0, 0.46111],
    119: [0, 0.44444, 0.10836, 0, 0.68334],
    120: [0, 0.44444, 0.09169, 0, 0.46111],
    121: [0.19444, 0.44444, 0.10836, 0, 0.46111],
    122: [0, 0.44444, 0.08752, 0, 0.43472],
    126: [0.35, 0.32659, 0.08826, 0, 0.5],
    160: [0, 0, 0, 0, 0.25],
    168: [0, 0.67937, 0.06385, 0, 0.5],
    176: [0, 0.69444, 0, 0, 0.73752],
    184: [0.17014, 0, 0, 0, 0.44445],
    305: [0, 0.44444, 0.04169, 0, 0.23889],
    567: [0.19444, 0.44444, 0.04169, 0, 0.26667],
    710: [0, 0.69444, 0.0799, 0, 0.5],
    711: [0, 0.63194, 0.08432, 0, 0.5],
    713: [0, 0.60889, 0.08776, 0, 0.5],
    714: [0, 0.69444, 0.09205, 0, 0.5],
    715: [0, 0.69444, 0, 0, 0.5],
    728: [0, 0.69444, 0.09483, 0, 0.5],
    729: [0, 0.67937, 0.07774, 0, 0.27778],
    730: [0, 0.69444, 0, 0, 0.73752],
    732: [0, 0.67659, 0.08826, 0, 0.5],
    733: [0, 0.69444, 0.09205, 0, 0.5],
    915: [0, 0.69444, 0.13372, 0, 0.54167],
    916: [0, 0.69444, 0, 0, 0.83334],
    920: [0, 0.69444, 0.07555, 0, 0.77778],
    923: [0, 0.69444, 0, 0, 0.61111],
    926: [0, 0.69444, 0.12816, 0, 0.66667],
    928: [0, 0.69444, 0.08094, 0, 0.70834],
    931: [0, 0.69444, 0.11983, 0, 0.72222],
    933: [0, 0.69444, 0.09031, 0, 0.77778],
    934: [0, 0.69444, 0.04603, 0, 0.72222],
    936: [0, 0.69444, 0.09031, 0, 0.77778],
    937: [0, 0.69444, 0.08293, 0, 0.72222],
    8211: [0, 0.44444, 0.08616, 0, 0.5],
    8212: [0, 0.44444, 0.08616, 0, 1],
    8216: [0, 0.69444, 0.07816, 0, 0.27778],
    8217: [0, 0.69444, 0.07816, 0, 0.27778],
    8220: [0, 0.69444, 0.14205, 0, 0.5],
    8221: [0, 0.69444, 316e-5, 0, 0.5]
  },
  "SansSerif-Regular": {
    32: [0, 0, 0, 0, 0.25],
    33: [0, 0.69444, 0, 0, 0.31945],
    34: [0, 0.69444, 0, 0, 0.5],
    35: [0.19444, 0.69444, 0, 0, 0.83334],
    36: [0.05556, 0.75, 0, 0, 0.5],
    37: [0.05556, 0.75, 0, 0, 0.83334],
    38: [0, 0.69444, 0, 0, 0.75834],
    39: [0, 0.69444, 0, 0, 0.27778],
    40: [0.25, 0.75, 0, 0, 0.38889],
    41: [0.25, 0.75, 0, 0, 0.38889],
    42: [0, 0.75, 0, 0, 0.5],
    43: [0.08333, 0.58333, 0, 0, 0.77778],
    44: [0.125, 0.08333, 0, 0, 0.27778],
    45: [0, 0.44444, 0, 0, 0.33333],
    46: [0, 0.08333, 0, 0, 0.27778],
    47: [0.25, 0.75, 0, 0, 0.5],
    48: [0, 0.65556, 0, 0, 0.5],
    49: [0, 0.65556, 0, 0, 0.5],
    50: [0, 0.65556, 0, 0, 0.5],
    51: [0, 0.65556, 0, 0, 0.5],
    52: [0, 0.65556, 0, 0, 0.5],
    53: [0, 0.65556, 0, 0, 0.5],
    54: [0, 0.65556, 0, 0, 0.5],
    55: [0, 0.65556, 0, 0, 0.5],
    56: [0, 0.65556, 0, 0, 0.5],
    57: [0, 0.65556, 0, 0, 0.5],
    58: [0, 0.44444, 0, 0, 0.27778],
    59: [0.125, 0.44444, 0, 0, 0.27778],
    61: [-0.13, 0.37, 0, 0, 0.77778],
    63: [0, 0.69444, 0, 0, 0.47222],
    64: [0, 0.69444, 0, 0, 0.66667],
    65: [0, 0.69444, 0, 0, 0.66667],
    66: [0, 0.69444, 0, 0, 0.66667],
    67: [0, 0.69444, 0, 0, 0.63889],
    68: [0, 0.69444, 0, 0, 0.72223],
    69: [0, 0.69444, 0, 0, 0.59722],
    70: [0, 0.69444, 0, 0, 0.56945],
    71: [0, 0.69444, 0, 0, 0.66667],
    72: [0, 0.69444, 0, 0, 0.70834],
    73: [0, 0.69444, 0, 0, 0.27778],
    74: [0, 0.69444, 0, 0, 0.47222],
    75: [0, 0.69444, 0, 0, 0.69445],
    76: [0, 0.69444, 0, 0, 0.54167],
    77: [0, 0.69444, 0, 0, 0.875],
    78: [0, 0.69444, 0, 0, 0.70834],
    79: [0, 0.69444, 0, 0, 0.73611],
    80: [0, 0.69444, 0, 0, 0.63889],
    81: [0.125, 0.69444, 0, 0, 0.73611],
    82: [0, 0.69444, 0, 0, 0.64584],
    83: [0, 0.69444, 0, 0, 0.55556],
    84: [0, 0.69444, 0, 0, 0.68056],
    85: [0, 0.69444, 0, 0, 0.6875],
    86: [0, 0.69444, 0.01389, 0, 0.66667],
    87: [0, 0.69444, 0.01389, 0, 0.94445],
    88: [0, 0.69444, 0, 0, 0.66667],
    89: [0, 0.69444, 0.025, 0, 0.66667],
    90: [0, 0.69444, 0, 0, 0.61111],
    91: [0.25, 0.75, 0, 0, 0.28889],
    93: [0.25, 0.75, 0, 0, 0.28889],
    94: [0, 0.69444, 0, 0, 0.5],
    95: [0.35, 0.09444, 0.02778, 0, 0.5],
    97: [0, 0.44444, 0, 0, 0.48056],
    98: [0, 0.69444, 0, 0, 0.51667],
    99: [0, 0.44444, 0, 0, 0.44445],
    100: [0, 0.69444, 0, 0, 0.51667],
    101: [0, 0.44444, 0, 0, 0.44445],
    102: [0, 0.69444, 0.06944, 0, 0.30556],
    103: [0.19444, 0.44444, 0.01389, 0, 0.5],
    104: [0, 0.69444, 0, 0, 0.51667],
    105: [0, 0.67937, 0, 0, 0.23889],
    106: [0.19444, 0.67937, 0, 0, 0.26667],
    107: [0, 0.69444, 0, 0, 0.48889],
    108: [0, 0.69444, 0, 0, 0.23889],
    109: [0, 0.44444, 0, 0, 0.79445],
    110: [0, 0.44444, 0, 0, 0.51667],
    111: [0, 0.44444, 0, 0, 0.5],
    112: [0.19444, 0.44444, 0, 0, 0.51667],
    113: [0.19444, 0.44444, 0, 0, 0.51667],
    114: [0, 0.44444, 0.01389, 0, 0.34167],
    115: [0, 0.44444, 0, 0, 0.38333],
    116: [0, 0.57143, 0, 0, 0.36111],
    117: [0, 0.44444, 0, 0, 0.51667],
    118: [0, 0.44444, 0.01389, 0, 0.46111],
    119: [0, 0.44444, 0.01389, 0, 0.68334],
    120: [0, 0.44444, 0, 0, 0.46111],
    121: [0.19444, 0.44444, 0.01389, 0, 0.46111],
    122: [0, 0.44444, 0, 0, 0.43472],
    126: [0.35, 0.32659, 0, 0, 0.5],
    160: [0, 0, 0, 0, 0.25],
    168: [0, 0.67937, 0, 0, 0.5],
    176: [0, 0.69444, 0, 0, 0.66667],
    184: [0.17014, 0, 0, 0, 0.44445],
    305: [0, 0.44444, 0, 0, 0.23889],
    567: [0.19444, 0.44444, 0, 0, 0.26667],
    710: [0, 0.69444, 0, 0, 0.5],
    711: [0, 0.63194, 0, 0, 0.5],
    713: [0, 0.60889, 0, 0, 0.5],
    714: [0, 0.69444, 0, 0, 0.5],
    715: [0, 0.69444, 0, 0, 0.5],
    728: [0, 0.69444, 0, 0, 0.5],
    729: [0, 0.67937, 0, 0, 0.27778],
    730: [0, 0.69444, 0, 0, 0.66667],
    732: [0, 0.67659, 0, 0, 0.5],
    733: [0, 0.69444, 0, 0, 0.5],
    915: [0, 0.69444, 0, 0, 0.54167],
    916: [0, 0.69444, 0, 0, 0.83334],
    920: [0, 0.69444, 0, 0, 0.77778],
    923: [0, 0.69444, 0, 0, 0.61111],
    926: [0, 0.69444, 0, 0, 0.66667],
    928: [0, 0.69444, 0, 0, 0.70834],
    931: [0, 0.69444, 0, 0, 0.72222],
    933: [0, 0.69444, 0, 0, 0.77778],
    934: [0, 0.69444, 0, 0, 0.72222],
    936: [0, 0.69444, 0, 0, 0.77778],
    937: [0, 0.69444, 0, 0, 0.72222],
    8211: [0, 0.44444, 0.02778, 0, 0.5],
    8212: [0, 0.44444, 0.02778, 0, 1],
    8216: [0, 0.69444, 0, 0, 0.27778],
    8217: [0, 0.69444, 0, 0, 0.27778],
    8220: [0, 0.69444, 0, 0, 0.5],
    8221: [0, 0.69444, 0, 0, 0.5]
  },
  "Script-Regular": {
    32: [0, 0, 0, 0, 0.25],
    65: [0, 0.7, 0.22925, 0, 0.80253],
    66: [0, 0.7, 0.04087, 0, 0.90757],
    67: [0, 0.7, 0.1689, 0, 0.66619],
    68: [0, 0.7, 0.09371, 0, 0.77443],
    69: [0, 0.7, 0.18583, 0, 0.56162],
    70: [0, 0.7, 0.13634, 0, 0.89544],
    71: [0, 0.7, 0.17322, 0, 0.60961],
    72: [0, 0.7, 0.29694, 0, 0.96919],
    73: [0, 0.7, 0.19189, 0, 0.80907],
    74: [0.27778, 0.7, 0.19189, 0, 1.05159],
    75: [0, 0.7, 0.31259, 0, 0.91364],
    76: [0, 0.7, 0.19189, 0, 0.87373],
    77: [0, 0.7, 0.15981, 0, 1.08031],
    78: [0, 0.7, 0.3525, 0, 0.9015],
    79: [0, 0.7, 0.08078, 0, 0.73787],
    80: [0, 0.7, 0.08078, 0, 1.01262],
    81: [0, 0.7, 0.03305, 0, 0.88282],
    82: [0, 0.7, 0.06259, 0, 0.85],
    83: [0, 0.7, 0.19189, 0, 0.86767],
    84: [0, 0.7, 0.29087, 0, 0.74697],
    85: [0, 0.7, 0.25815, 0, 0.79996],
    86: [0, 0.7, 0.27523, 0, 0.62204],
    87: [0, 0.7, 0.27523, 0, 0.80532],
    88: [0, 0.7, 0.26006, 0, 0.94445],
    89: [0, 0.7, 0.2939, 0, 0.70961],
    90: [0, 0.7, 0.24037, 0, 0.8212],
    160: [0, 0, 0, 0, 0.25]
  },
  "Size1-Regular": {
    32: [0, 0, 0, 0, 0.25],
    40: [0.35001, 0.85, 0, 0, 0.45834],
    41: [0.35001, 0.85, 0, 0, 0.45834],
    47: [0.35001, 0.85, 0, 0, 0.57778],
    91: [0.35001, 0.85, 0, 0, 0.41667],
    92: [0.35001, 0.85, 0, 0, 0.57778],
    93: [0.35001, 0.85, 0, 0, 0.41667],
    123: [0.35001, 0.85, 0, 0, 0.58334],
    125: [0.35001, 0.85, 0, 0, 0.58334],
    160: [0, 0, 0, 0, 0.25],
    710: [0, 0.72222, 0, 0, 0.55556],
    732: [0, 0.72222, 0, 0, 0.55556],
    770: [0, 0.72222, 0, 0, 0.55556],
    771: [0, 0.72222, 0, 0, 0.55556],
    8214: [-99e-5, 0.601, 0, 0, 0.77778],
    8593: [1e-5, 0.6, 0, 0, 0.66667],
    8595: [1e-5, 0.6, 0, 0, 0.66667],
    8657: [1e-5, 0.6, 0, 0, 0.77778],
    8659: [1e-5, 0.6, 0, 0, 0.77778],
    8719: [0.25001, 0.75, 0, 0, 0.94445],
    8720: [0.25001, 0.75, 0, 0, 0.94445],
    8721: [0.25001, 0.75, 0, 0, 1.05556],
    8730: [0.35001, 0.85, 0, 0, 1],
    8739: [-599e-5, 0.606, 0, 0, 0.33333],
    8741: [-599e-5, 0.606, 0, 0, 0.55556],
    8747: [0.30612, 0.805, 0.19445, 0, 0.47222],
    8748: [0.306, 0.805, 0.19445, 0, 0.47222],
    8749: [0.306, 0.805, 0.19445, 0, 0.47222],
    8750: [0.30612, 0.805, 0.19445, 0, 0.47222],
    8896: [0.25001, 0.75, 0, 0, 0.83334],
    8897: [0.25001, 0.75, 0, 0, 0.83334],
    8898: [0.25001, 0.75, 0, 0, 0.83334],
    8899: [0.25001, 0.75, 0, 0, 0.83334],
    8968: [0.35001, 0.85, 0, 0, 0.47222],
    8969: [0.35001, 0.85, 0, 0, 0.47222],
    8970: [0.35001, 0.85, 0, 0, 0.47222],
    8971: [0.35001, 0.85, 0, 0, 0.47222],
    9168: [-99e-5, 0.601, 0, 0, 0.66667],
    10216: [0.35001, 0.85, 0, 0, 0.47222],
    10217: [0.35001, 0.85, 0, 0, 0.47222],
    10752: [0.25001, 0.75, 0, 0, 1.11111],
    10753: [0.25001, 0.75, 0, 0, 1.11111],
    10754: [0.25001, 0.75, 0, 0, 1.11111],
    10756: [0.25001, 0.75, 0, 0, 0.83334],
    10758: [0.25001, 0.75, 0, 0, 0.83334]
  },
  "Size2-Regular": {
    32: [0, 0, 0, 0, 0.25],
    40: [0.65002, 1.15, 0, 0, 0.59722],
    41: [0.65002, 1.15, 0, 0, 0.59722],
    47: [0.65002, 1.15, 0, 0, 0.81111],
    91: [0.65002, 1.15, 0, 0, 0.47222],
    92: [0.65002, 1.15, 0, 0, 0.81111],
    93: [0.65002, 1.15, 0, 0, 0.47222],
    123: [0.65002, 1.15, 0, 0, 0.66667],
    125: [0.65002, 1.15, 0, 0, 0.66667],
    160: [0, 0, 0, 0, 0.25],
    710: [0, 0.75, 0, 0, 1],
    732: [0, 0.75, 0, 0, 1],
    770: [0, 0.75, 0, 0, 1],
    771: [0, 0.75, 0, 0, 1],
    8719: [0.55001, 1.05, 0, 0, 1.27778],
    8720: [0.55001, 1.05, 0, 0, 1.27778],
    8721: [0.55001, 1.05, 0, 0, 1.44445],
    8730: [0.65002, 1.15, 0, 0, 1],
    8747: [0.86225, 1.36, 0.44445, 0, 0.55556],
    8748: [0.862, 1.36, 0.44445, 0, 0.55556],
    8749: [0.862, 1.36, 0.44445, 0, 0.55556],
    8750: [0.86225, 1.36, 0.44445, 0, 0.55556],
    8896: [0.55001, 1.05, 0, 0, 1.11111],
    8897: [0.55001, 1.05, 0, 0, 1.11111],
    8898: [0.55001, 1.05, 0, 0, 1.11111],
    8899: [0.55001, 1.05, 0, 0, 1.11111],
    8968: [0.65002, 1.15, 0, 0, 0.52778],
    8969: [0.65002, 1.15, 0, 0, 0.52778],
    8970: [0.65002, 1.15, 0, 0, 0.52778],
    8971: [0.65002, 1.15, 0, 0, 0.52778],
    10216: [0.65002, 1.15, 0, 0, 0.61111],
    10217: [0.65002, 1.15, 0, 0, 0.61111],
    10752: [0.55001, 1.05, 0, 0, 1.51112],
    10753: [0.55001, 1.05, 0, 0, 1.51112],
    10754: [0.55001, 1.05, 0, 0, 1.51112],
    10756: [0.55001, 1.05, 0, 0, 1.11111],
    10758: [0.55001, 1.05, 0, 0, 1.11111]
  },
  "Size3-Regular": {
    32: [0, 0, 0, 0, 0.25],
    40: [0.95003, 1.45, 0, 0, 0.73611],
    41: [0.95003, 1.45, 0, 0, 0.73611],
    47: [0.95003, 1.45, 0, 0, 1.04445],
    91: [0.95003, 1.45, 0, 0, 0.52778],
    92: [0.95003, 1.45, 0, 0, 1.04445],
    93: [0.95003, 1.45, 0, 0, 0.52778],
    123: [0.95003, 1.45, 0, 0, 0.75],
    125: [0.95003, 1.45, 0, 0, 0.75],
    160: [0, 0, 0, 0, 0.25],
    710: [0, 0.75, 0, 0, 1.44445],
    732: [0, 0.75, 0, 0, 1.44445],
    770: [0, 0.75, 0, 0, 1.44445],
    771: [0, 0.75, 0, 0, 1.44445],
    8730: [0.95003, 1.45, 0, 0, 1],
    8968: [0.95003, 1.45, 0, 0, 0.58334],
    8969: [0.95003, 1.45, 0, 0, 0.58334],
    8970: [0.95003, 1.45, 0, 0, 0.58334],
    8971: [0.95003, 1.45, 0, 0, 0.58334],
    10216: [0.95003, 1.45, 0, 0, 0.75],
    10217: [0.95003, 1.45, 0, 0, 0.75]
  },
  "Size4-Regular": {
    32: [0, 0, 0, 0, 0.25],
    40: [1.25003, 1.75, 0, 0, 0.79167],
    41: [1.25003, 1.75, 0, 0, 0.79167],
    47: [1.25003, 1.75, 0, 0, 1.27778],
    91: [1.25003, 1.75, 0, 0, 0.58334],
    92: [1.25003, 1.75, 0, 0, 1.27778],
    93: [1.25003, 1.75, 0, 0, 0.58334],
    123: [1.25003, 1.75, 0, 0, 0.80556],
    125: [1.25003, 1.75, 0, 0, 0.80556],
    160: [0, 0, 0, 0, 0.25],
    710: [0, 0.825, 0, 0, 1.8889],
    732: [0, 0.825, 0, 0, 1.8889],
    770: [0, 0.825, 0, 0, 1.8889],
    771: [0, 0.825, 0, 0, 1.8889],
    8730: [1.25003, 1.75, 0, 0, 1],
    8968: [1.25003, 1.75, 0, 0, 0.63889],
    8969: [1.25003, 1.75, 0, 0, 0.63889],
    8970: [1.25003, 1.75, 0, 0, 0.63889],
    8971: [1.25003, 1.75, 0, 0, 0.63889],
    9115: [0.64502, 1.155, 0, 0, 0.875],
    9116: [1e-5, 0.6, 0, 0, 0.875],
    9117: [0.64502, 1.155, 0, 0, 0.875],
    9118: [0.64502, 1.155, 0, 0, 0.875],
    9119: [1e-5, 0.6, 0, 0, 0.875],
    9120: [0.64502, 1.155, 0, 0, 0.875],
    9121: [0.64502, 1.155, 0, 0, 0.66667],
    9122: [-99e-5, 0.601, 0, 0, 0.66667],
    9123: [0.64502, 1.155, 0, 0, 0.66667],
    9124: [0.64502, 1.155, 0, 0, 0.66667],
    9125: [-99e-5, 0.601, 0, 0, 0.66667],
    9126: [0.64502, 1.155, 0, 0, 0.66667],
    9127: [1e-5, 0.9, 0, 0, 0.88889],
    9128: [0.65002, 1.15, 0, 0, 0.88889],
    9129: [0.90001, 0, 0, 0, 0.88889],
    9130: [0, 0.3, 0, 0, 0.88889],
    9131: [1e-5, 0.9, 0, 0, 0.88889],
    9132: [0.65002, 1.15, 0, 0, 0.88889],
    9133: [0.90001, 0, 0, 0, 0.88889],
    9143: [0.88502, 0.915, 0, 0, 1.05556],
    10216: [1.25003, 1.75, 0, 0, 0.80556],
    10217: [1.25003, 1.75, 0, 0, 0.80556],
    57344: [-499e-5, 0.605, 0, 0, 1.05556],
    57345: [-499e-5, 0.605, 0, 0, 1.05556],
    57680: [0, 0.12, 0, 0, 0.45],
    57681: [0, 0.12, 0, 0, 0.45],
    57682: [0, 0.12, 0, 0, 0.45],
    57683: [0, 0.12, 0, 0, 0.45]
  },
  "Typewriter-Regular": {
    32: [0, 0, 0, 0, 0.525],
    33: [0, 0.61111, 0, 0, 0.525],
    34: [0, 0.61111, 0, 0, 0.525],
    35: [0, 0.61111, 0, 0, 0.525],
    36: [0.08333, 0.69444, 0, 0, 0.525],
    37: [0.08333, 0.69444, 0, 0, 0.525],
    38: [0, 0.61111, 0, 0, 0.525],
    39: [0, 0.61111, 0, 0, 0.525],
    40: [0.08333, 0.69444, 0, 0, 0.525],
    41: [0.08333, 0.69444, 0, 0, 0.525],
    42: [0, 0.52083, 0, 0, 0.525],
    43: [-0.08056, 0.53055, 0, 0, 0.525],
    44: [0.13889, 0.125, 0, 0, 0.525],
    45: [-0.08056, 0.53055, 0, 0, 0.525],
    46: [0, 0.125, 0, 0, 0.525],
    47: [0.08333, 0.69444, 0, 0, 0.525],
    48: [0, 0.61111, 0, 0, 0.525],
    49: [0, 0.61111, 0, 0, 0.525],
    50: [0, 0.61111, 0, 0, 0.525],
    51: [0, 0.61111, 0, 0, 0.525],
    52: [0, 0.61111, 0, 0, 0.525],
    53: [0, 0.61111, 0, 0, 0.525],
    54: [0, 0.61111, 0, 0, 0.525],
    55: [0, 0.61111, 0, 0, 0.525],
    56: [0, 0.61111, 0, 0, 0.525],
    57: [0, 0.61111, 0, 0, 0.525],
    58: [0, 0.43056, 0, 0, 0.525],
    59: [0.13889, 0.43056, 0, 0, 0.525],
    60: [-0.05556, 0.55556, 0, 0, 0.525],
    61: [-0.19549, 0.41562, 0, 0, 0.525],
    62: [-0.05556, 0.55556, 0, 0, 0.525],
    63: [0, 0.61111, 0, 0, 0.525],
    64: [0, 0.61111, 0, 0, 0.525],
    65: [0, 0.61111, 0, 0, 0.525],
    66: [0, 0.61111, 0, 0, 0.525],
    67: [0, 0.61111, 0, 0, 0.525],
    68: [0, 0.61111, 0, 0, 0.525],
    69: [0, 0.61111, 0, 0, 0.525],
    70: [0, 0.61111, 0, 0, 0.525],
    71: [0, 0.61111, 0, 0, 0.525],
    72: [0, 0.61111, 0, 0, 0.525],
    73: [0, 0.61111, 0, 0, 0.525],
    74: [0, 0.61111, 0, 0, 0.525],
    75: [0, 0.61111, 0, 0, 0.525],
    76: [0, 0.61111, 0, 0, 0.525],
    77: [0, 0.61111, 0, 0, 0.525],
    78: [0, 0.61111, 0, 0, 0.525],
    79: [0, 0.61111, 0, 0, 0.525],
    80: [0, 0.61111, 0, 0, 0.525],
    81: [0.13889, 0.61111, 0, 0, 0.525],
    82: [0, 0.61111, 0, 0, 0.525],
    83: [0, 0.61111, 0, 0, 0.525],
    84: [0, 0.61111, 0, 0, 0.525],
    85: [0, 0.61111, 0, 0, 0.525],
    86: [0, 0.61111, 0, 0, 0.525],
    87: [0, 0.61111, 0, 0, 0.525],
    88: [0, 0.61111, 0, 0, 0.525],
    89: [0, 0.61111, 0, 0, 0.525],
    90: [0, 0.61111, 0, 0, 0.525],
    91: [0.08333, 0.69444, 0, 0, 0.525],
    92: [0.08333, 0.69444, 0, 0, 0.525],
    93: [0.08333, 0.69444, 0, 0, 0.525],
    94: [0, 0.61111, 0, 0, 0.525],
    95: [0.09514, 0, 0, 0, 0.525],
    96: [0, 0.61111, 0, 0, 0.525],
    97: [0, 0.43056, 0, 0, 0.525],
    98: [0, 0.61111, 0, 0, 0.525],
    99: [0, 0.43056, 0, 0, 0.525],
    100: [0, 0.61111, 0, 0, 0.525],
    101: [0, 0.43056, 0, 0, 0.525],
    102: [0, 0.61111, 0, 0, 0.525],
    103: [0.22222, 0.43056, 0, 0, 0.525],
    104: [0, 0.61111, 0, 0, 0.525],
    105: [0, 0.61111, 0, 0, 0.525],
    106: [0.22222, 0.61111, 0, 0, 0.525],
    107: [0, 0.61111, 0, 0, 0.525],
    108: [0, 0.61111, 0, 0, 0.525],
    109: [0, 0.43056, 0, 0, 0.525],
    110: [0, 0.43056, 0, 0, 0.525],
    111: [0, 0.43056, 0, 0, 0.525],
    112: [0.22222, 0.43056, 0, 0, 0.525],
    113: [0.22222, 0.43056, 0, 0, 0.525],
    114: [0, 0.43056, 0, 0, 0.525],
    115: [0, 0.43056, 0, 0, 0.525],
    116: [0, 0.55358, 0, 0, 0.525],
    117: [0, 0.43056, 0, 0, 0.525],
    118: [0, 0.43056, 0, 0, 0.525],
    119: [0, 0.43056, 0, 0, 0.525],
    120: [0, 0.43056, 0, 0, 0.525],
    121: [0.22222, 0.43056, 0, 0, 0.525],
    122: [0, 0.43056, 0, 0, 0.525],
    123: [0.08333, 0.69444, 0, 0, 0.525],
    124: [0.08333, 0.69444, 0, 0, 0.525],
    125: [0.08333, 0.69444, 0, 0, 0.525],
    126: [0, 0.61111, 0, 0, 0.525],
    127: [0, 0.61111, 0, 0, 0.525],
    160: [0, 0, 0, 0, 0.525],
    176: [0, 0.61111, 0, 0, 0.525],
    184: [0.19445, 0, 0, 0, 0.525],
    305: [0, 0.43056, 0, 0, 0.525],
    567: [0.22222, 0.43056, 0, 0, 0.525],
    711: [0, 0.56597, 0, 0, 0.525],
    713: [0, 0.56555, 0, 0, 0.525],
    714: [0, 0.61111, 0, 0, 0.525],
    715: [0, 0.61111, 0, 0, 0.525],
    728: [0, 0.61111, 0, 0, 0.525],
    730: [0, 0.61111, 0, 0, 0.525],
    770: [0, 0.61111, 0, 0, 0.525],
    771: [0, 0.61111, 0, 0, 0.525],
    776: [0, 0.61111, 0, 0, 0.525],
    915: [0, 0.61111, 0, 0, 0.525],
    916: [0, 0.61111, 0, 0, 0.525],
    920: [0, 0.61111, 0, 0, 0.525],
    923: [0, 0.61111, 0, 0, 0.525],
    926: [0, 0.61111, 0, 0, 0.525],
    928: [0, 0.61111, 0, 0, 0.525],
    931: [0, 0.61111, 0, 0, 0.525],
    933: [0, 0.61111, 0, 0, 0.525],
    934: [0, 0.61111, 0, 0, 0.525],
    936: [0, 0.61111, 0, 0, 0.525],
    937: [0, 0.61111, 0, 0, 0.525],
    8216: [0, 0.61111, 0, 0, 0.525],
    8217: [0, 0.61111, 0, 0, 0.525],
    8242: [0, 0.61111, 0, 0, 0.525],
    9251: [0.11111, 0.21944, 0, 0, 0.525]
  }
}, Na = {
  slant: [0.25, 0.25, 0.25],
  // sigma1
  space: [0, 0, 0],
  // sigma2
  stretch: [0, 0, 0],
  // sigma3
  shrink: [0, 0, 0],
  // sigma4
  xHeight: [0.431, 0.431, 0.431],
  // sigma5
  quad: [1, 1.171, 1.472],
  // sigma6
  extraSpace: [0, 0, 0],
  // sigma7
  num1: [0.677, 0.732, 0.925],
  // sigma8
  num2: [0.394, 0.384, 0.387],
  // sigma9
  num3: [0.444, 0.471, 0.504],
  // sigma10
  denom1: [0.686, 0.752, 1.025],
  // sigma11
  denom2: [0.345, 0.344, 0.532],
  // sigma12
  sup1: [0.413, 0.503, 0.504],
  // sigma13
  sup2: [0.363, 0.431, 0.404],
  // sigma14
  sup3: [0.289, 0.286, 0.294],
  // sigma15
  sub1: [0.15, 0.143, 0.2],
  // sigma16
  sub2: [0.247, 0.286, 0.4],
  // sigma17
  supDrop: [0.386, 0.353, 0.494],
  // sigma18
  subDrop: [0.05, 0.071, 0.1],
  // sigma19
  delim1: [2.39, 1.7, 1.98],
  // sigma20
  delim2: [1.01, 1.157, 1.42],
  // sigma21
  axisHeight: [0.25, 0.25, 0.25],
  // sigma22
  // These font metrics are extracted from TeX by using tftopl on cmex10.tfm;
  // they correspond to the font parameters of the extension fonts (family 3).
  // See the TeXbook, page 441. In AMSTeX, the extension fonts scale; to
  // match cmex7, we'd use cmex7.tfm values for script and scriptscript
  // values.
  defaultRuleThickness: [0.04, 0.049, 0.049],
  // xi8; cmex7: 0.049
  bigOpSpacing1: [0.111, 0.111, 0.111],
  // xi9
  bigOpSpacing2: [0.166, 0.166, 0.166],
  // xi10
  bigOpSpacing3: [0.2, 0.2, 0.2],
  // xi11
  bigOpSpacing4: [0.6, 0.611, 0.611],
  // xi12; cmex7: 0.611
  bigOpSpacing5: [0.1, 0.143, 0.143],
  // xi13; cmex7: 0.143
  // The \sqrt rule width is taken from the height of the surd character.
  // Since we use the same font at all sizes, this thickness doesn't scale.
  sqrtRuleThickness: [0.04, 0.04, 0.04],
  // This value determines how large a pt is, for metrics which are defined
  // in terms of pts.
  // This value is also used in katex.scss; if you change it make sure the
  // values match.
  ptPerEm: [10, 10, 10],
  // The space between adjacent `|` columns in an array definition. From
  // `\showthe\doublerulesep` in LaTeX. Equals 2.0 / ptPerEm.
  doubleRuleSep: [0.2, 0.2, 0.2],
  // The width of separator lines in {array} environments. From
  // `\showthe\arrayrulewidth` in LaTeX. Equals 0.4 / ptPerEm.
  arrayRuleWidth: [0.04, 0.04, 0.04],
  // Two values from LaTeX source2e:
  fboxsep: [0.3, 0.3, 0.3],
  //        3 pt / ptPerEm
  fboxrule: [0.04, 0.04, 0.04]
  // 0.4 pt / ptPerEm
}, Xi = {
  // Latin-1
  Å: "A",
  Ð: "D",
  Þ: "o",
  å: "a",
  ð: "d",
  þ: "o",
  // Cyrillic
  А: "A",
  Б: "B",
  В: "B",
  Г: "F",
  Д: "A",
  Е: "E",
  Ж: "K",
  З: "3",
  И: "N",
  Й: "N",
  К: "K",
  Л: "N",
  М: "M",
  Н: "H",
  О: "O",
  П: "N",
  Р: "P",
  С: "C",
  Т: "T",
  У: "y",
  Ф: "O",
  Х: "X",
  Ц: "U",
  Ч: "h",
  Ш: "W",
  Щ: "W",
  Ъ: "B",
  Ы: "X",
  Ь: "B",
  Э: "3",
  Ю: "X",
  Я: "R",
  а: "a",
  б: "b",
  в: "a",
  г: "r",
  д: "y",
  е: "e",
  ж: "m",
  з: "e",
  и: "n",
  й: "n",
  к: "n",
  л: "n",
  м: "m",
  н: "n",
  о: "o",
  п: "n",
  р: "p",
  с: "c",
  т: "o",
  у: "y",
  ф: "b",
  х: "x",
  ц: "n",
  ч: "n",
  ш: "w",
  щ: "w",
  ъ: "a",
  ы: "m",
  ь: "a",
  э: "e",
  ю: "m",
  я: "r"
};
function I0(a, e) {
  lt[a] = e;
}
function yi(a, e, t) {
  if (!lt[e])
    throw new Error("Font metrics not found for font: " + e + ".");
  var r = a.charCodeAt(0), i = lt[e][r];
  if (!i && a[0] in Xi && (r = Xi[a[0]].charCodeAt(0), i = lt[e][r]), !i && t === "text" && ts(r) && (i = lt[e][77]), i)
    return {
      depth: i[0],
      height: i[1],
      italic: i[2],
      skew: i[3],
      width: i[4]
    };
}
var Tr = {};
function L0(a) {
  var e;
  if (a >= 5 ? e = 0 : a >= 3 ? e = 1 : e = 2, !Tr[e]) {
    var t = Tr[e] = {
      cssEmPerMu: Na.quad[e] / 18
    };
    for (var r in Na)
      Na.hasOwnProperty(r) && (t[r] = Na[r][e]);
  }
  return Tr[e];
}
var ve = {
  math: {},
  text: {}
};
function s(a, e, t, r, i, n) {
  ve[a][i] = {
    font: e,
    group: t,
    replace: r
  }, n && r && (ve[a][r] = ve[a][i]);
}
var c = "math", z = "text", h = "main", g = "ams", be = "accent-token", $ = "bin", Ue = "close", ca = "inner", Y = "mathord", Re = "op-token", _e = "open", Ma = "punct", v = "rel", At = "spacing", x = "textord";
s(c, h, v, "≡", "\\equiv", !0);
s(c, h, v, "≺", "\\prec", !0);
s(c, h, v, "≻", "\\succ", !0);
s(c, h, v, "∼", "\\sim", !0);
s(c, h, v, "⊥", "\\perp");
s(c, h, v, "⪯", "\\preceq", !0);
s(c, h, v, "⪰", "\\succeq", !0);
s(c, h, v, "≃", "\\simeq", !0);
s(c, h, v, "∣", "\\mid", !0);
s(c, h, v, "≪", "\\ll", !0);
s(c, h, v, "≫", "\\gg", !0);
s(c, h, v, "≍", "\\asymp", !0);
s(c, h, v, "∥", "\\parallel");
s(c, h, v, "⋈", "\\bowtie", !0);
s(c, h, v, "⌣", "\\smile", !0);
s(c, h, v, "⊑", "\\sqsubseteq", !0);
s(c, h, v, "⊒", "\\sqsupseteq", !0);
s(c, h, v, "≐", "\\doteq", !0);
s(c, h, v, "⌢", "\\frown", !0);
s(c, h, v, "∋", "\\ni", !0);
s(c, h, v, "∝", "\\propto", !0);
s(c, h, v, "⊢", "\\vdash", !0);
s(c, h, v, "⊣", "\\dashv", !0);
s(c, h, v, "∋", "\\owns");
s(c, h, Ma, ".", "\\ldotp");
s(c, h, Ma, "⋅", "\\cdotp");
s(c, h, Ma, "⋅", "·");
s(z, h, x, "⋅", "·");
s(c, h, x, "#", "\\#");
s(z, h, x, "#", "\\#");
s(c, h, x, "&", "\\&");
s(z, h, x, "&", "\\&");
s(c, h, x, "ℵ", "\\aleph", !0);
s(c, h, x, "∀", "\\forall", !0);
s(c, h, x, "ℏ", "\\hbar", !0);
s(c, h, x, "∃", "\\exists", !0);
s(c, h, x, "∇", "\\nabla", !0);
s(c, h, x, "♭", "\\flat", !0);
s(c, h, x, "ℓ", "\\ell", !0);
s(c, h, x, "♮", "\\natural", !0);
s(c, h, x, "♣", "\\clubsuit", !0);
s(c, h, x, "℘", "\\wp", !0);
s(c, h, x, "♯", "\\sharp", !0);
s(c, h, x, "♢", "\\diamondsuit", !0);
s(c, h, x, "ℜ", "\\Re", !0);
s(c, h, x, "♡", "\\heartsuit", !0);
s(c, h, x, "ℑ", "\\Im", !0);
s(c, h, x, "♠", "\\spadesuit", !0);
s(c, h, x, "§", "\\S", !0);
s(z, h, x, "§", "\\S");
s(c, h, x, "¶", "\\P", !0);
s(z, h, x, "¶", "\\P");
s(c, h, x, "†", "\\dag");
s(z, h, x, "†", "\\dag");
s(z, h, x, "†", "\\textdagger");
s(c, h, x, "‡", "\\ddag");
s(z, h, x, "‡", "\\ddag");
s(z, h, x, "‡", "\\textdaggerdbl");
s(c, h, Ue, "⎱", "\\rmoustache", !0);
s(c, h, _e, "⎰", "\\lmoustache", !0);
s(c, h, Ue, "⟯", "\\rgroup", !0);
s(c, h, _e, "⟮", "\\lgroup", !0);
s(c, h, $, "∓", "\\mp", !0);
s(c, h, $, "⊖", "\\ominus", !0);
s(c, h, $, "⊎", "\\uplus", !0);
s(c, h, $, "⊓", "\\sqcap", !0);
s(c, h, $, "∗", "\\ast");
s(c, h, $, "⊔", "\\sqcup", !0);
s(c, h, $, "◯", "\\bigcirc", !0);
s(c, h, $, "∙", "\\bullet", !0);
s(c, h, $, "‡", "\\ddagger");
s(c, h, $, "≀", "\\wr", !0);
s(c, h, $, "⨿", "\\amalg");
s(c, h, $, "&", "\\And");
s(c, h, v, "⟵", "\\longleftarrow", !0);
s(c, h, v, "⇐", "\\Leftarrow", !0);
s(c, h, v, "⟸", "\\Longleftarrow", !0);
s(c, h, v, "⟶", "\\longrightarrow", !0);
s(c, h, v, "⇒", "\\Rightarrow", !0);
s(c, h, v, "⟹", "\\Longrightarrow", !0);
s(c, h, v, "↔", "\\leftrightarrow", !0);
s(c, h, v, "⟷", "\\longleftrightarrow", !0);
s(c, h, v, "⇔", "\\Leftrightarrow", !0);
s(c, h, v, "⟺", "\\Longleftrightarrow", !0);
s(c, h, v, "↦", "\\mapsto", !0);
s(c, h, v, "⟼", "\\longmapsto", !0);
s(c, h, v, "↗", "\\nearrow", !0);
s(c, h, v, "↩", "\\hookleftarrow", !0);
s(c, h, v, "↪", "\\hookrightarrow", !0);
s(c, h, v, "↘", "\\searrow", !0);
s(c, h, v, "↼", "\\leftharpoonup", !0);
s(c, h, v, "⇀", "\\rightharpoonup", !0);
s(c, h, v, "↙", "\\swarrow", !0);
s(c, h, v, "↽", "\\leftharpoondown", !0);
s(c, h, v, "⇁", "\\rightharpoondown", !0);
s(c, h, v, "↖", "\\nwarrow", !0);
s(c, h, v, "⇌", "\\rightleftharpoons", !0);
s(c, g, v, "≮", "\\nless", !0);
s(c, g, v, "", "\\@nleqslant");
s(c, g, v, "", "\\@nleqq");
s(c, g, v, "⪇", "\\lneq", !0);
s(c, g, v, "≨", "\\lneqq", !0);
s(c, g, v, "", "\\@lvertneqq");
s(c, g, v, "⋦", "\\lnsim", !0);
s(c, g, v, "⪉", "\\lnapprox", !0);
s(c, g, v, "⊀", "\\nprec", !0);
s(c, g, v, "⋠", "\\npreceq", !0);
s(c, g, v, "⋨", "\\precnsim", !0);
s(c, g, v, "⪹", "\\precnapprox", !0);
s(c, g, v, "≁", "\\nsim", !0);
s(c, g, v, "", "\\@nshortmid");
s(c, g, v, "∤", "\\nmid", !0);
s(c, g, v, "⊬", "\\nvdash", !0);
s(c, g, v, "⊭", "\\nvDash", !0);
s(c, g, v, "⋪", "\\ntriangleleft");
s(c, g, v, "⋬", "\\ntrianglelefteq", !0);
s(c, g, v, "⊊", "\\subsetneq", !0);
s(c, g, v, "", "\\@varsubsetneq");
s(c, g, v, "⫋", "\\subsetneqq", !0);
s(c, g, v, "", "\\@varsubsetneqq");
s(c, g, v, "≯", "\\ngtr", !0);
s(c, g, v, "", "\\@ngeqslant");
s(c, g, v, "", "\\@ngeqq");
s(c, g, v, "⪈", "\\gneq", !0);
s(c, g, v, "≩", "\\gneqq", !0);
s(c, g, v, "", "\\@gvertneqq");
s(c, g, v, "⋧", "\\gnsim", !0);
s(c, g, v, "⪊", "\\gnapprox", !0);
s(c, g, v, "⊁", "\\nsucc", !0);
s(c, g, v, "⋡", "\\nsucceq", !0);
s(c, g, v, "⋩", "\\succnsim", !0);
s(c, g, v, "⪺", "\\succnapprox", !0);
s(c, g, v, "≆", "\\ncong", !0);
s(c, g, v, "", "\\@nshortparallel");
s(c, g, v, "∦", "\\nparallel", !0);
s(c, g, v, "⊯", "\\nVDash", !0);
s(c, g, v, "⋫", "\\ntriangleright");
s(c, g, v, "⋭", "\\ntrianglerighteq", !0);
s(c, g, v, "", "\\@nsupseteqq");
s(c, g, v, "⊋", "\\supsetneq", !0);
s(c, g, v, "", "\\@varsupsetneq");
s(c, g, v, "⫌", "\\supsetneqq", !0);
s(c, g, v, "", "\\@varsupsetneqq");
s(c, g, v, "⊮", "\\nVdash", !0);
s(c, g, v, "⪵", "\\precneqq", !0);
s(c, g, v, "⪶", "\\succneqq", !0);
s(c, g, v, "", "\\@nsubseteqq");
s(c, g, $, "⊴", "\\unlhd");
s(c, g, $, "⊵", "\\unrhd");
s(c, g, v, "↚", "\\nleftarrow", !0);
s(c, g, v, "↛", "\\nrightarrow", !0);
s(c, g, v, "⇍", "\\nLeftarrow", !0);
s(c, g, v, "⇏", "\\nRightarrow", !0);
s(c, g, v, "↮", "\\nleftrightarrow", !0);
s(c, g, v, "⇎", "\\nLeftrightarrow", !0);
s(c, g, v, "△", "\\vartriangle");
s(c, g, x, "ℏ", "\\hslash");
s(c, g, x, "▽", "\\triangledown");
s(c, g, x, "◊", "\\lozenge");
s(c, g, x, "Ⓢ", "\\circledS");
s(c, g, x, "®", "\\circledR");
s(z, g, x, "®", "\\circledR");
s(c, g, x, "∡", "\\measuredangle", !0);
s(c, g, x, "∄", "\\nexists");
s(c, g, x, "℧", "\\mho");
s(c, g, x, "Ⅎ", "\\Finv", !0);
s(c, g, x, "⅁", "\\Game", !0);
s(c, g, x, "‵", "\\backprime");
s(c, g, x, "▲", "\\blacktriangle");
s(c, g, x, "▼", "\\blacktriangledown");
s(c, g, x, "■", "\\blacksquare");
s(c, g, x, "⧫", "\\blacklozenge");
s(c, g, x, "★", "\\bigstar");
s(c, g, x, "∢", "\\sphericalangle", !0);
s(c, g, x, "∁", "\\complement", !0);
s(c, g, x, "ð", "\\eth", !0);
s(z, h, x, "ð", "ð");
s(c, g, x, "╱", "\\diagup");
s(c, g, x, "╲", "\\diagdown");
s(c, g, x, "□", "\\square");
s(c, g, x, "□", "\\Box");
s(c, g, x, "◊", "\\Diamond");
s(c, g, x, "¥", "\\yen", !0);
s(z, g, x, "¥", "\\yen", !0);
s(c, g, x, "✓", "\\checkmark", !0);
s(z, g, x, "✓", "\\checkmark");
s(c, g, x, "ℶ", "\\beth", !0);
s(c, g, x, "ℸ", "\\daleth", !0);
s(c, g, x, "ℷ", "\\gimel", !0);
s(c, g, x, "ϝ", "\\digamma", !0);
s(c, g, x, "ϰ", "\\varkappa");
s(c, g, _e, "┌", "\\@ulcorner", !0);
s(c, g, Ue, "┐", "\\@urcorner", !0);
s(c, g, _e, "└", "\\@llcorner", !0);
s(c, g, Ue, "┘", "\\@lrcorner", !0);
s(c, g, v, "≦", "\\leqq", !0);
s(c, g, v, "⩽", "\\leqslant", !0);
s(c, g, v, "⪕", "\\eqslantless", !0);
s(c, g, v, "≲", "\\lesssim", !0);
s(c, g, v, "⪅", "\\lessapprox", !0);
s(c, g, v, "≊", "\\approxeq", !0);
s(c, g, $, "⋖", "\\lessdot");
s(c, g, v, "⋘", "\\lll", !0);
s(c, g, v, "≶", "\\lessgtr", !0);
s(c, g, v, "⋚", "\\lesseqgtr", !0);
s(c, g, v, "⪋", "\\lesseqqgtr", !0);
s(c, g, v, "≑", "\\doteqdot");
s(c, g, v, "≓", "\\risingdotseq", !0);
s(c, g, v, "≒", "\\fallingdotseq", !0);
s(c, g, v, "∽", "\\backsim", !0);
s(c, g, v, "⋍", "\\backsimeq", !0);
s(c, g, v, "⫅", "\\subseteqq", !0);
s(c, g, v, "⋐", "\\Subset", !0);
s(c, g, v, "⊏", "\\sqsubset", !0);
s(c, g, v, "≼", "\\preccurlyeq", !0);
s(c, g, v, "⋞", "\\curlyeqprec", !0);
s(c, g, v, "≾", "\\precsim", !0);
s(c, g, v, "⪷", "\\precapprox", !0);
s(c, g, v, "⊲", "\\vartriangleleft");
s(c, g, v, "⊴", "\\trianglelefteq");
s(c, g, v, "⊨", "\\vDash", !0);
s(c, g, v, "⊪", "\\Vvdash", !0);
s(c, g, v, "⌣", "\\smallsmile");
s(c, g, v, "⌢", "\\smallfrown");
s(c, g, v, "≏", "\\bumpeq", !0);
s(c, g, v, "≎", "\\Bumpeq", !0);
s(c, g, v, "≧", "\\geqq", !0);
s(c, g, v, "⩾", "\\geqslant", !0);
s(c, g, v, "⪖", "\\eqslantgtr", !0);
s(c, g, v, "≳", "\\gtrsim", !0);
s(c, g, v, "⪆", "\\gtrapprox", !0);
s(c, g, $, "⋗", "\\gtrdot");
s(c, g, v, "⋙", "\\ggg", !0);
s(c, g, v, "≷", "\\gtrless", !0);
s(c, g, v, "⋛", "\\gtreqless", !0);
s(c, g, v, "⪌", "\\gtreqqless", !0);
s(c, g, v, "≖", "\\eqcirc", !0);
s(c, g, v, "≗", "\\circeq", !0);
s(c, g, v, "≜", "\\triangleq", !0);
s(c, g, v, "∼", "\\thicksim");
s(c, g, v, "≈", "\\thickapprox");
s(c, g, v, "⫆", "\\supseteqq", !0);
s(c, g, v, "⋑", "\\Supset", !0);
s(c, g, v, "⊐", "\\sqsupset", !0);
s(c, g, v, "≽", "\\succcurlyeq", !0);
s(c, g, v, "⋟", "\\curlyeqsucc", !0);
s(c, g, v, "≿", "\\succsim", !0);
s(c, g, v, "⪸", "\\succapprox", !0);
s(c, g, v, "⊳", "\\vartriangleright");
s(c, g, v, "⊵", "\\trianglerighteq");
s(c, g, v, "⊩", "\\Vdash", !0);
s(c, g, v, "∣", "\\shortmid");
s(c, g, v, "∥", "\\shortparallel");
s(c, g, v, "≬", "\\between", !0);
s(c, g, v, "⋔", "\\pitchfork", !0);
s(c, g, v, "∝", "\\varpropto");
s(c, g, v, "◀", "\\blacktriangleleft");
s(c, g, v, "∴", "\\therefore", !0);
s(c, g, v, "∍", "\\backepsilon");
s(c, g, v, "▶", "\\blacktriangleright");
s(c, g, v, "∵", "\\because", !0);
s(c, g, v, "⋘", "\\llless");
s(c, g, v, "⋙", "\\gggtr");
s(c, g, $, "⊲", "\\lhd");
s(c, g, $, "⊳", "\\rhd");
s(c, g, v, "≂", "\\eqsim", !0);
s(c, h, v, "⋈", "\\Join");
s(c, g, v, "≑", "\\Doteq", !0);
s(c, g, $, "∔", "\\dotplus", !0);
s(c, g, $, "∖", "\\smallsetminus");
s(c, g, $, "⋒", "\\Cap", !0);
s(c, g, $, "⋓", "\\Cup", !0);
s(c, g, $, "⩞", "\\doublebarwedge", !0);
s(c, g, $, "⊟", "\\boxminus", !0);
s(c, g, $, "⊞", "\\boxplus", !0);
s(c, g, $, "⋇", "\\divideontimes", !0);
s(c, g, $, "⋉", "\\ltimes", !0);
s(c, g, $, "⋊", "\\rtimes", !0);
s(c, g, $, "⋋", "\\leftthreetimes", !0);
s(c, g, $, "⋌", "\\rightthreetimes", !0);
s(c, g, $, "⋏", "\\curlywedge", !0);
s(c, g, $, "⋎", "\\curlyvee", !0);
s(c, g, $, "⊝", "\\circleddash", !0);
s(c, g, $, "⊛", "\\circledast", !0);
s(c, g, $, "⋅", "\\centerdot");
s(c, g, $, "⊺", "\\intercal", !0);
s(c, g, $, "⋒", "\\doublecap");
s(c, g, $, "⋓", "\\doublecup");
s(c, g, $, "⊠", "\\boxtimes", !0);
s(c, g, v, "⇢", "\\dashrightarrow", !0);
s(c, g, v, "⇠", "\\dashleftarrow", !0);
s(c, g, v, "⇇", "\\leftleftarrows", !0);
s(c, g, v, "⇆", "\\leftrightarrows", !0);
s(c, g, v, "⇚", "\\Lleftarrow", !0);
s(c, g, v, "↞", "\\twoheadleftarrow", !0);
s(c, g, v, "↢", "\\leftarrowtail", !0);
s(c, g, v, "↫", "\\looparrowleft", !0);
s(c, g, v, "⇋", "\\leftrightharpoons", !0);
s(c, g, v, "↶", "\\curvearrowleft", !0);
s(c, g, v, "↺", "\\circlearrowleft", !0);
s(c, g, v, "↰", "\\Lsh", !0);
s(c, g, v, "⇈", "\\upuparrows", !0);
s(c, g, v, "↿", "\\upharpoonleft", !0);
s(c, g, v, "⇃", "\\downharpoonleft", !0);
s(c, h, v, "⊶", "\\origof", !0);
s(c, h, v, "⊷", "\\imageof", !0);
s(c, g, v, "⊸", "\\multimap", !0);
s(c, g, v, "↭", "\\leftrightsquigarrow", !0);
s(c, g, v, "⇉", "\\rightrightarrows", !0);
s(c, g, v, "⇄", "\\rightleftarrows", !0);
s(c, g, v, "↠", "\\twoheadrightarrow", !0);
s(c, g, v, "↣", "\\rightarrowtail", !0);
s(c, g, v, "↬", "\\looparrowright", !0);
s(c, g, v, "↷", "\\curvearrowright", !0);
s(c, g, v, "↻", "\\circlearrowright", !0);
s(c, g, v, "↱", "\\Rsh", !0);
s(c, g, v, "⇊", "\\downdownarrows", !0);
s(c, g, v, "↾", "\\upharpoonright", !0);
s(c, g, v, "⇂", "\\downharpoonright", !0);
s(c, g, v, "⇝", "\\rightsquigarrow", !0);
s(c, g, v, "⇝", "\\leadsto");
s(c, g, v, "⇛", "\\Rrightarrow", !0);
s(c, g, v, "↾", "\\restriction");
s(c, h, x, "‘", "`");
s(c, h, x, "$", "\\$");
s(z, h, x, "$", "\\$");
s(z, h, x, "$", "\\textdollar");
s(c, h, x, "%", "\\%");
s(z, h, x, "%", "\\%");
s(c, h, x, "_", "\\_");
s(z, h, x, "_", "\\_");
s(z, h, x, "_", "\\textunderscore");
s(c, h, x, "∠", "\\angle", !0);
s(c, h, x, "∞", "\\infty", !0);
s(c, h, x, "′", "\\prime");
s(c, h, x, "△", "\\triangle");
s(c, h, x, "Γ", "\\Gamma", !0);
s(c, h, x, "Δ", "\\Delta", !0);
s(c, h, x, "Θ", "\\Theta", !0);
s(c, h, x, "Λ", "\\Lambda", !0);
s(c, h, x, "Ξ", "\\Xi", !0);
s(c, h, x, "Π", "\\Pi", !0);
s(c, h, x, "Σ", "\\Sigma", !0);
s(c, h, x, "Υ", "\\Upsilon", !0);
s(c, h, x, "Φ", "\\Phi", !0);
s(c, h, x, "Ψ", "\\Psi", !0);
s(c, h, x, "Ω", "\\Omega", !0);
s(c, h, x, "A", "Α");
s(c, h, x, "B", "Β");
s(c, h, x, "E", "Ε");
s(c, h, x, "Z", "Ζ");
s(c, h, x, "H", "Η");
s(c, h, x, "I", "Ι");
s(c, h, x, "K", "Κ");
s(c, h, x, "M", "Μ");
s(c, h, x, "N", "Ν");
s(c, h, x, "O", "Ο");
s(c, h, x, "P", "Ρ");
s(c, h, x, "T", "Τ");
s(c, h, x, "X", "Χ");
s(c, h, x, "¬", "\\neg", !0);
s(c, h, x, "¬", "\\lnot");
s(c, h, x, "⊤", "\\top");
s(c, h, x, "⊥", "\\bot");
s(c, h, x, "∅", "\\emptyset");
s(c, g, x, "∅", "\\varnothing");
s(c, h, Y, "α", "\\alpha", !0);
s(c, h, Y, "β", "\\beta", !0);
s(c, h, Y, "γ", "\\gamma", !0);
s(c, h, Y, "δ", "\\delta", !0);
s(c, h, Y, "ϵ", "\\epsilon", !0);
s(c, h, Y, "ζ", "\\zeta", !0);
s(c, h, Y, "η", "\\eta", !0);
s(c, h, Y, "θ", "\\theta", !0);
s(c, h, Y, "ι", "\\iota", !0);
s(c, h, Y, "κ", "\\kappa", !0);
s(c, h, Y, "λ", "\\lambda", !0);
s(c, h, Y, "μ", "\\mu", !0);
s(c, h, Y, "ν", "\\nu", !0);
s(c, h, Y, "ξ", "\\xi", !0);
s(c, h, Y, "ο", "\\omicron", !0);
s(c, h, Y, "π", "\\pi", !0);
s(c, h, Y, "ρ", "\\rho", !0);
s(c, h, Y, "σ", "\\sigma", !0);
s(c, h, Y, "τ", "\\tau", !0);
s(c, h, Y, "υ", "\\upsilon", !0);
s(c, h, Y, "ϕ", "\\phi", !0);
s(c, h, Y, "χ", "\\chi", !0);
s(c, h, Y, "ψ", "\\psi", !0);
s(c, h, Y, "ω", "\\omega", !0);
s(c, h, Y, "ε", "\\varepsilon", !0);
s(c, h, Y, "ϑ", "\\vartheta", !0);
s(c, h, Y, "ϖ", "\\varpi", !0);
s(c, h, Y, "ϱ", "\\varrho", !0);
s(c, h, Y, "ς", "\\varsigma", !0);
s(c, h, Y, "φ", "\\varphi", !0);
s(c, h, $, "∗", "*", !0);
s(c, h, $, "+", "+");
s(c, h, $, "−", "-", !0);
s(c, h, $, "⋅", "\\cdot", !0);
s(c, h, $, "∘", "\\circ", !0);
s(c, h, $, "÷", "\\div", !0);
s(c, h, $, "±", "\\pm", !0);
s(c, h, $, "×", "\\times", !0);
s(c, h, $, "∩", "\\cap", !0);
s(c, h, $, "∪", "\\cup", !0);
s(c, h, $, "∖", "\\setminus", !0);
s(c, h, $, "∧", "\\land");
s(c, h, $, "∨", "\\lor");
s(c, h, $, "∧", "\\wedge", !0);
s(c, h, $, "∨", "\\vee", !0);
s(c, h, x, "√", "\\surd");
s(c, h, _e, "⟨", "\\langle", !0);
s(c, h, _e, "∣", "\\lvert");
s(c, h, _e, "∥", "\\lVert");
s(c, h, Ue, "?", "?");
s(c, h, Ue, "!", "!");
s(c, h, Ue, "⟩", "\\rangle", !0);
s(c, h, Ue, "∣", "\\rvert");
s(c, h, Ue, "∥", "\\rVert");
s(c, h, v, "=", "=");
s(c, h, v, ":", ":");
s(c, h, v, "≈", "\\approx", !0);
s(c, h, v, "≅", "\\cong", !0);
s(c, h, v, "≥", "\\ge");
s(c, h, v, "≥", "\\geq", !0);
s(c, h, v, "←", "\\gets");
s(c, h, v, ">", "\\gt", !0);
s(c, h, v, "∈", "\\in", !0);
s(c, h, v, "", "\\@not");
s(c, h, v, "⊂", "\\subset", !0);
s(c, h, v, "⊃", "\\supset", !0);
s(c, h, v, "⊆", "\\subseteq", !0);
s(c, h, v, "⊇", "\\supseteq", !0);
s(c, g, v, "⊈", "\\nsubseteq", !0);
s(c, g, v, "⊉", "\\nsupseteq", !0);
s(c, h, v, "⊨", "\\models");
s(c, h, v, "←", "\\leftarrow", !0);
s(c, h, v, "≤", "\\le");
s(c, h, v, "≤", "\\leq", !0);
s(c, h, v, "<", "\\lt", !0);
s(c, h, v, "→", "\\rightarrow", !0);
s(c, h, v, "→", "\\to");
s(c, g, v, "≱", "\\ngeq", !0);
s(c, g, v, "≰", "\\nleq", !0);
s(c, h, At, " ", "\\ ");
s(c, h, At, " ", "\\space");
s(c, h, At, " ", "\\nobreakspace");
s(z, h, At, " ", "\\ ");
s(z, h, At, " ", " ");
s(z, h, At, " ", "\\space");
s(z, h, At, " ", "\\nobreakspace");
s(c, h, At, "", "\\nobreak");
s(c, h, At, "", "\\allowbreak");
s(c, h, Ma, ",", ",");
s(c, h, Ma, ";", ";");
s(c, g, $, "⊼", "\\barwedge", !0);
s(c, g, $, "⊻", "\\veebar", !0);
s(c, h, $, "⊙", "\\odot", !0);
s(c, h, $, "⊕", "\\oplus", !0);
s(c, h, $, "⊗", "\\otimes", !0);
s(c, h, x, "∂", "\\partial", !0);
s(c, h, $, "⊘", "\\oslash", !0);
s(c, g, $, "⊚", "\\circledcirc", !0);
s(c, g, $, "⊡", "\\boxdot", !0);
s(c, h, $, "△", "\\bigtriangleup");
s(c, h, $, "▽", "\\bigtriangledown");
s(c, h, $, "†", "\\dagger");
s(c, h, $, "⋄", "\\diamond");
s(c, h, $, "⋆", "\\star");
s(c, h, $, "◃", "\\triangleleft");
s(c, h, $, "▹", "\\triangleright");
s(c, h, _e, "{", "\\{");
s(z, h, x, "{", "\\{");
s(z, h, x, "{", "\\textbraceleft");
s(c, h, Ue, "}", "\\}");
s(z, h, x, "}", "\\}");
s(z, h, x, "}", "\\textbraceright");
s(c, h, _e, "{", "\\lbrace");
s(c, h, Ue, "}", "\\rbrace");
s(c, h, _e, "[", "\\lbrack", !0);
s(z, h, x, "[", "\\lbrack", !0);
s(c, h, Ue, "]", "\\rbrack", !0);
s(z, h, x, "]", "\\rbrack", !0);
s(c, h, _e, "(", "\\lparen", !0);
s(c, h, Ue, ")", "\\rparen", !0);
s(z, h, x, "<", "\\textless", !0);
s(z, h, x, ">", "\\textgreater", !0);
s(c, h, _e, "⌊", "\\lfloor", !0);
s(c, h, Ue, "⌋", "\\rfloor", !0);
s(c, h, _e, "⌈", "\\lceil", !0);
s(c, h, Ue, "⌉", "\\rceil", !0);
s(c, h, x, "\\", "\\backslash");
s(c, h, x, "∣", "|");
s(c, h, x, "∣", "\\vert");
s(z, h, x, "|", "\\textbar", !0);
s(c, h, x, "∥", "\\|");
s(c, h, x, "∥", "\\Vert");
s(z, h, x, "∥", "\\textbardbl");
s(z, h, x, "~", "\\textasciitilde");
s(z, h, x, "\\", "\\textbackslash");
s(z, h, x, "^", "\\textasciicircum");
s(c, h, v, "↑", "\\uparrow", !0);
s(c, h, v, "⇑", "\\Uparrow", !0);
s(c, h, v, "↓", "\\downarrow", !0);
s(c, h, v, "⇓", "\\Downarrow", !0);
s(c, h, v, "↕", "\\updownarrow", !0);
s(c, h, v, "⇕", "\\Updownarrow", !0);
s(c, h, Re, "∐", "\\coprod");
s(c, h, Re, "⋁", "\\bigvee");
s(c, h, Re, "⋀", "\\bigwedge");
s(c, h, Re, "⨄", "\\biguplus");
s(c, h, Re, "⋂", "\\bigcap");
s(c, h, Re, "⋃", "\\bigcup");
s(c, h, Re, "∫", "\\int");
s(c, h, Re, "∫", "\\intop");
s(c, h, Re, "∬", "\\iint");
s(c, h, Re, "∭", "\\iiint");
s(c, h, Re, "∏", "\\prod");
s(c, h, Re, "∑", "\\sum");
s(c, h, Re, "⨂", "\\bigotimes");
s(c, h, Re, "⨁", "\\bigoplus");
s(c, h, Re, "⨀", "\\bigodot");
s(c, h, Re, "∮", "\\oint");
s(c, h, Re, "∯", "\\oiint");
s(c, h, Re, "∰", "\\oiiint");
s(c, h, Re, "⨆", "\\bigsqcup");
s(c, h, Re, "∫", "\\smallint");
s(z, h, ca, "…", "\\textellipsis");
s(c, h, ca, "…", "\\mathellipsis");
s(z, h, ca, "…", "\\ldots", !0);
s(c, h, ca, "…", "\\ldots", !0);
s(c, h, ca, "⋯", "\\@cdots", !0);
s(c, h, ca, "⋱", "\\ddots", !0);
s(c, h, x, "⋮", "\\varvdots");
s(z, h, x, "⋮", "\\varvdots");
s(c, h, be, "ˊ", "\\acute");
s(c, h, be, "ˋ", "\\grave");
s(c, h, be, "¨", "\\ddot");
s(c, h, be, "~", "\\tilde");
s(c, h, be, "ˉ", "\\bar");
s(c, h, be, "˘", "\\breve");
s(c, h, be, "ˇ", "\\check");
s(c, h, be, "^", "\\hat");
s(c, h, be, "⃗", "\\vec");
s(c, h, be, "˙", "\\dot");
s(c, h, be, "˚", "\\mathring");
s(c, h, Y, "", "\\@imath");
s(c, h, Y, "", "\\@jmath");
s(c, h, x, "ı", "ı");
s(c, h, x, "ȷ", "ȷ");
s(z, h, x, "ı", "\\i", !0);
s(z, h, x, "ȷ", "\\j", !0);
s(z, h, x, "ß", "\\ss", !0);
s(z, h, x, "æ", "\\ae", !0);
s(z, h, x, "œ", "\\oe", !0);
s(z, h, x, "ø", "\\o", !0);
s(z, h, x, "Æ", "\\AE", !0);
s(z, h, x, "Œ", "\\OE", !0);
s(z, h, x, "Ø", "\\O", !0);
s(z, h, be, "ˊ", "\\'");
s(z, h, be, "ˋ", "\\`");
s(z, h, be, "ˆ", "\\^");
s(z, h, be, "˜", "\\~");
s(z, h, be, "ˉ", "\\=");
s(z, h, be, "˘", "\\u");
s(z, h, be, "˙", "\\.");
s(z, h, be, "¸", "\\c");
s(z, h, be, "˚", "\\r");
s(z, h, be, "ˇ", "\\v");
s(z, h, be, "¨", '\\"');
s(z, h, be, "˝", "\\H");
s(z, h, be, "◯", "\\textcircled");
var ss = {
  "--": !0,
  "---": !0,
  "``": !0,
  "''": !0
};
s(z, h, x, "–", "--", !0);
s(z, h, x, "–", "\\textendash");
s(z, h, x, "—", "---", !0);
s(z, h, x, "—", "\\textemdash");
s(z, h, x, "‘", "`", !0);
s(z, h, x, "‘", "\\textquoteleft");
s(z, h, x, "’", "'", !0);
s(z, h, x, "’", "\\textquoteright");
s(z, h, x, "“", "``", !0);
s(z, h, x, "“", "\\textquotedblleft");
s(z, h, x, "”", "''", !0);
s(z, h, x, "”", "\\textquotedblright");
s(c, h, x, "°", "\\degree", !0);
s(z, h, x, "°", "\\degree");
s(z, h, x, "°", "\\textdegree", !0);
s(c, h, x, "£", "\\pounds");
s(c, h, x, "£", "\\mathsterling", !0);
s(z, h, x, "£", "\\pounds");
s(z, h, x, "£", "\\textsterling", !0);
s(c, g, x, "✠", "\\maltese");
s(z, g, x, "✠", "\\maltese");
var _i = '0123456789/@."';
for (var Mr = 0; Mr < _i.length; Mr++) {
  var Zi = _i.charAt(Mr);
  s(c, h, x, Zi, Zi);
}
var Ji = '0123456789!@*()-=+";:?/.,';
for (var zr = 0; zr < Ji.length; zr++) {
  var Qi = Ji.charAt(zr);
  s(z, h, x, Qi, Qi);
}
var er = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
for (var qr = 0; qr < er.length; qr++) {
  var Oa = er.charAt(qr);
  s(c, h, Y, Oa, Oa), s(z, h, x, Oa, Oa);
}
s(c, g, x, "C", "ℂ");
s(z, g, x, "C", "ℂ");
s(c, g, x, "H", "ℍ");
s(z, g, x, "H", "ℍ");
s(c, g, x, "N", "ℕ");
s(z, g, x, "N", "ℕ");
s(c, g, x, "P", "ℙ");
s(z, g, x, "P", "ℙ");
s(c, g, x, "Q", "ℚ");
s(z, g, x, "Q", "ℚ");
s(c, g, x, "R", "ℝ");
s(z, g, x, "R", "ℝ");
s(c, g, x, "Z", "ℤ");
s(z, g, x, "Z", "ℤ");
s(c, h, Y, "h", "ℎ");
s(z, h, Y, "h", "ℎ");
var K;
for (var He = 0; He < er.length; He++) {
  var Se = er.charAt(He);
  K = String.fromCharCode(55349, 56320 + He), s(c, h, Y, Se, K), s(z, h, x, Se, K), K = String.fromCharCode(55349, 56372 + He), s(c, h, Y, Se, K), s(z, h, x, Se, K), K = String.fromCharCode(55349, 56424 + He), s(c, h, Y, Se, K), s(z, h, x, Se, K), K = String.fromCharCode(55349, 56580 + He), s(c, h, Y, Se, K), s(z, h, x, Se, K), K = String.fromCharCode(55349, 56684 + He), s(c, h, Y, Se, K), s(z, h, x, Se, K), K = String.fromCharCode(55349, 56736 + He), s(c, h, Y, Se, K), s(z, h, x, Se, K), K = String.fromCharCode(55349, 56788 + He), s(c, h, Y, Se, K), s(z, h, x, Se, K), K = String.fromCharCode(55349, 56840 + He), s(c, h, Y, Se, K), s(z, h, x, Se, K), K = String.fromCharCode(55349, 56944 + He), s(c, h, Y, Se, K), s(z, h, x, Se, K), He < 26 && (K = String.fromCharCode(55349, 56632 + He), s(c, h, Y, Se, K), s(z, h, x, Se, K), K = String.fromCharCode(55349, 56476 + He), s(c, h, Y, Se, K), s(z, h, x, Se, K));
}
K = "𝕜";
s(c, h, Y, "k", K);
s(z, h, x, "k", K);
for (var Ht = 0; Ht < 10; Ht++) {
  var Mt = Ht.toString();
  K = String.fromCharCode(55349, 57294 + Ht), s(c, h, Y, Mt, K), s(z, h, x, Mt, K), K = String.fromCharCode(55349, 57314 + Ht), s(c, h, Y, Mt, K), s(z, h, x, Mt, K), K = String.fromCharCode(55349, 57324 + Ht), s(c, h, Y, Mt, K), s(z, h, x, Mt, K), K = String.fromCharCode(55349, 57334 + Ht), s(c, h, Y, Mt, K), s(z, h, x, Mt, K);
}
var Jr = "ÐÞþ";
for (var jr = 0; jr < Jr.length; jr++) {
  var Ha = Jr.charAt(jr);
  s(c, h, Y, Ha, Ha), s(z, h, x, Ha, Ha);
}
var Qr = {
  mathClass: "mathbf",
  textClass: "textbf",
  font: "Main-Bold"
}, en = {
  mathClass: "mathnormal",
  textClass: "textit",
  font: "Math-Italic"
}, tn = {
  mathClass: "boldsymbol",
  textClass: "boldsymbol",
  font: "Main-BoldItalic"
}, F0 = {
  mathClass: "mathscr",
  textClass: "textscr",
  font: "Script-Regular"
}, Ut = {
  mathClass: "",
  textClass: "",
  font: ""
}, an = {
  mathClass: "mathfrak",
  textClass: "textfrak",
  font: "Fraktur-Regular"
}, rn = {
  mathClass: "mathbb",
  textClass: "textbb",
  font: "AMS-Regular"
}, nn = {
  mathClass: "mathboldfrak",
  textClass: "textboldfrak",
  font: "Fraktur-Regular"
}, ei = {
  mathClass: "mathsf",
  textClass: "textsf",
  font: "SansSerif-Regular"
}, ti = {
  mathClass: "mathboldsf",
  textClass: "textboldsf",
  font: "SansSerif-Bold"
}, sn = {
  mathClass: "mathitsf",
  textClass: "textitsf",
  font: "SansSerif-Italic"
}, ai = {
  mathClass: "mathtt",
  textClass: "texttt",
  font: "Typewriter-Regular"
}, on = [
  Qr,
  Qr,
  // A-Z, a-z
  en,
  en,
  // A-Z, a-z
  tn,
  tn,
  // A-Z, a-z
  // Map fancy A-Z letters to script, not calligraphic.
  // This aligns with unicode-math and math fonts (except Cambria Math).
  F0,
  Ut,
  // A-Z script, a-z — no font
  Ut,
  Ut,
  // A-Z bold script, a-z bold script — no font
  an,
  an,
  // A-Z, a-z
  rn,
  rn,
  // A-Z double-struck, k double-struck
  // Note that we are using a bold font, but font metrics for regular Fraktur.
  nn,
  nn,
  // A-Z, a-z
  ei,
  ei,
  // A-Z, a-z
  ti,
  ti,
  // A-Z, a-z
  sn,
  sn,
  // A-Z, a-z
  Ut,
  Ut,
  // A-Z bold italic sans, a-z bold italic sans - no font
  ai,
  ai
  // A-Z, a-z
], N0 = [
  Qr,
  // 0-9
  Ut,
  // 0-9 double-struck. No KaTeX font.
  ei,
  // 0-9
  ti,
  // 0-9
  ai
  // 0-9
], O0 = (a) => {
  var e = a.charCodeAt(0), t = a.charCodeAt(1), r = (e - 55296) * 1024 + (t - 56320) + 65536;
  if (119808 <= r && r < 120484) {
    var i = Math.floor((r - 119808) / 26);
    return on[i];
  } else if (120782 <= r && r <= 120831) {
    var n = Math.floor((r - 120782) / 10);
    return N0[n];
  } else {
    if (r === 120485 || r === 120486)
      return on[0];
    if (120486 < r && r < 120782)
      return Ut;
    throw new B("Unsupported character: " + a);
  }
}, or = function(e, t, r) {
  if (ve[r][e]) {
    var i = ve[r][e].replace;
    i && (e = i);
  }
  return {
    value: e,
    metrics: yi(e, t, r)
  };
}, $e = function(e, t, r, i, n) {
  var l = or(e, t, r), u = l.metrics;
  e = l.value;
  var d;
  if (u) {
    var p = u.italic;
    (r === "text" || i && i.font === "mathit") && (p = 0), d = new Xe(e, u.height, u.depth, p, u.skew, u.width, n);
  } else
    typeof console < "u" && console.warn("No character metrics " + ("for '" + e + "' in style '" + t + "' and mode '" + r + "'")), d = new Xe(e, 0, 0, 0, 0, 0, n);
  if (i) {
    d.maxFontSize = i.sizeMultiplier, i.style.isTight() && d.classes.push("mtight");
    var f = i.getColor();
    f && (d.style.color = f);
  }
  return d;
}, xi = function(e, t, r, i) {
  return i === void 0 && (i = []), r.font === "boldsymbol" && or(e, "Main-Bold", t).metrics ? $e(e, "Main-Bold", t, r, i.concat(["mathbf"])) : e === "\\" || ve[t][e].font === "main" ? $e(e, "Main-Regular", t, r, i) : $e(e, "AMS-Regular", t, r, i.concat(["amsrm"]));
}, H0 = function(e, t, r) {
  return r !== "textord" && or(e, "Math-BoldItalic", t).metrics ? {
    fontName: "Math-BoldItalic",
    fontClass: "boldsymbol"
  } : {
    fontName: "Main-Bold",
    fontClass: "mathbf"
  };
}, lr = function(e, t, r) {
  var i = e.mode, n = e.text, l = ["mord"], {
    font: u,
    fontFamily: d,
    fontWeight: p,
    fontShape: f
  } = t, b = i === "math" || i === "text" && !!u, S = b ? u : d, w = "", j = "";
  if (n.charCodeAt(0) === 55349) {
    var R = O0(n);
    w = R.font, j = R[i + "Class"];
  }
  if (w)
    return $e(n, w, i, t, l.concat(j));
  if (S) {
    var N, I;
    if (S === "boldsymbol") {
      var O = H0(n, i, r);
      N = O.fontName, I = [O.fontClass];
    } else b ? (N = ri[u].fontName, I = [u]) : (N = $a(d, p, f), I = [d, p, f]);
    if (or(n, N, i).metrics)
      return $e(n, N, i, t, l.concat(I));
    if (ss.hasOwnProperty(n) && N.slice(0, 10) === "Typewriter") {
      for (var k = [], L = 0; L < n.length; L++)
        k.push($e(n[L], N, i, t, l.concat(I)));
      return St(k);
    }
  }
  if (r === "mathord")
    return $e(n, "Math-Italic", i, t, l.concat(["mathnormal"]));
  if (r === "textord") {
    var V = ve[i][n] && ve[i][n].font;
    if (V === "ams") {
      var X = $a("amsrm", p, f);
      return $e(n, X, i, t, l.concat("amsrm", p, f));
    } else if (V === "main" || !V) {
      var ae = $a("textrm", p, f);
      return $e(n, ae, i, t, l.concat(p, f));
    } else {
      var G = $a(V, p, f);
      return $e(n, G, i, t, l.concat(G, p, f));
    }
  } else
    throw new Error("unexpected type: " + r + " in makeOrd");
}, $0 = (a, e) => {
  if (qt(a.classes) !== qt(e.classes) || a.skew !== e.skew || a.maxFontSize !== e.maxFontSize || a.italic !== 0 && a.hasClass("mathnormal"))
    return !1;
  if (a.classes.length === 1) {
    var t = a.classes[0];
    if (t === "mbin" || t === "mord")
      return !1;
  }
  for (var r of Object.keys(a.style))
    if (a.style[r] !== e.style[r])
      return !1;
  for (var i of Object.keys(e.style))
    if (a.style[i] !== e.style[i])
      return !1;
  return !0;
}, os = (a) => {
  for (var e = 0; e < a.length - 1; e++) {
    var t = a[e], r = a[e + 1];
    t instanceof Xe && r instanceof Xe && $0(t, r) && (t.text += r.text, t.height = Math.max(t.height, r.height), t.depth = Math.max(t.depth, r.depth), t.italic = r.italic, a.splice(e + 1, 1), e--);
  }
  return a;
}, wi = function(e) {
  for (var t = 0, r = 0, i = 0, n = 0; n < e.children.length; n++) {
    var l = e.children[n];
    l.height > t && (t = l.height), l.depth > r && (r = l.depth), l.maxFontSize > i && (i = l.maxFontSize);
  }
  e.height = t, e.depth = r, e.maxFontSize = i;
}, E = function(e, t, r, i) {
  var n = new la(e, t, r, i);
  return wi(n), n;
}, Et = (a, e, t, r) => new la(a, e, t, r), ia = function(e, t, r) {
  var i = E([e], [], t);
  return i.height = Math.max(r || t.fontMetrics().defaultRuleThickness, t.minRuleThickness), i.style.borderBottomWidth = F(i.height), i.maxFontSize = 1, i;
}, W0 = function(e, t, r, i) {
  var n = new sr(e, t, r, i);
  return wi(n), n;
}, St = function(e) {
  var t = new oa(e);
  return wi(t), t;
}, na = function(e, t) {
  return e instanceof oa ? E([], [e], t) : e;
}, U0 = function(e) {
  if (e.positionType === "individualShift") {
    for (var t = e.children, r = [t[0]], i = -t[0].shift - t[0].elem.depth, n = i, l = 1; l < t.length; l++) {
      var u = -t[l].shift - n - t[l].elem.depth, d = u - (t[l - 1].elem.height + t[l - 1].elem.depth);
      n = n + u, r.push({
        type: "kern",
        size: d
      }), r.push(t[l]);
    }
    return {
      children: r,
      depth: i
    };
  }
  var p;
  if (e.positionType === "top") {
    for (var f = e.positionData, b = 0; b < e.children.length; b++) {
      var S = e.children[b];
      f -= S.type === "kern" ? S.size : S.elem.height + S.elem.depth;
    }
    p = f;
  } else if (e.positionType === "bottom")
    p = -e.positionData;
  else {
    var w = e.children[0];
    if (w.type !== "elem")
      throw new Error('First child must have type "elem".');
    if (e.positionType === "shift")
      p = -w.elem.depth - e.positionData;
    else if (e.positionType === "firstBaseline")
      p = -w.elem.depth;
    else
      throw new Error("Invalid positionType " + e.positionType + ".");
  }
  return {
    children: e.children,
    depth: p
  };
}, se = function(e, t) {
  for (var {
    children: r,
    depth: i
  } = U0(e), n = 0, l = 0; l < r.length; l++) {
    var u = r[l];
    if (u.type === "elem") {
      var d = u.elem;
      n = Math.max(n, d.maxFontSize, d.height);
    }
  }
  n += 2;
  var p = E(["pstrut"], []);
  p.style.height = F(n);
  for (var f = [], b = i, S = i, w = i, j = 0; j < r.length; j++) {
    var R = r[j];
    if (R.type === "kern")
      w += R.size;
    else {
      var N = R.elem, I = R.wrapperClasses || [], O = R.wrapperStyle || {}, k = E(I, [p, N], void 0, O);
      k.style.top = F(-n - w - N.depth), R.marginLeft && (k.style.marginLeft = R.marginLeft), R.marginRight && (k.style.marginRight = R.marginRight), f.push(k), w += N.height + N.depth;
    }
    b = Math.min(b, w), S = Math.max(S, w);
  }
  var L = E(["vlist"], f);
  L.style.height = F(S);
  var V;
  if (b < 0) {
    var X = E([], []), ae = E(["vlist"], [X]);
    ae.style.height = F(-b);
    var G = E(["vlist-s"], [new Xe("​")]);
    V = [E(["vlist-r"], [L, G]), E(["vlist-r"], [ae])];
  } else
    V = [E(["vlist-r"], [L])];
  var J = E(["vlist-t"], V);
  return V.length === 2 && J.classes.push("vlist-t2"), J.height = S, J.depth = -b, J;
}, ls = (a, e) => {
  var t = E(["mspace"], [], e), r = we(a, e);
  return t.style.marginRight = F(r), t;
}, $a = (a, e, t) => {
  var r, i;
  switch (a) {
    case "amsrm":
      r = "AMS";
      break;
    case "textrm":
      r = "Main";
      break;
    case "textsf":
      r = "SansSerif";
      break;
    case "texttt":
      r = "Typewriter";
      break;
    default:
      r = a;
  }
  return e === "textbf" && t === "textit" ? i = "BoldItalic" : e === "textbf" ? i = "Bold" : t === "textit" ? i = "Italic" : i = "Regular", r + "-" + i;
}, ri = {
  // styles
  mathbf: {
    variant: "bold",
    fontName: "Main-Bold"
  },
  mathrm: {
    variant: "normal",
    fontName: "Main-Regular"
  },
  textit: {
    variant: "italic",
    fontName: "Main-Italic"
  },
  mathit: {
    variant: "italic",
    fontName: "Main-Italic"
  },
  mathnormal: {
    variant: "italic",
    fontName: "Math-Italic"
  },
  mathsfit: {
    variant: "sans-serif-italic",
    fontName: "SansSerif-Italic"
  },
  // "boldsymbol" is missing because they require the use of multiple fonts:
  // Math-BoldItalic and Main-Bold.  This is handled by a special case in
  // makeOrd which ends up calling boldsymbol.
  // families
  mathbb: {
    variant: "double-struck",
    fontName: "AMS-Regular"
  },
  mathcal: {
    variant: "script",
    fontName: "Caligraphic-Regular"
  },
  mathfrak: {
    variant: "fraktur",
    fontName: "Fraktur-Regular"
  },
  mathscr: {
    variant: "script",
    fontName: "Script-Regular"
  },
  mathsf: {
    variant: "sans-serif",
    fontName: "SansSerif-Regular"
  },
  mathtt: {
    variant: "monospace",
    fontName: "Typewriter-Regular"
  }
}, cs = {
  //   path, width, height
  vec: ["vec", 0.471, 0.714],
  // values from the font glyph
  oiintSize1: ["oiintSize1", 0.957, 0.499],
  // oval to overlay the integrand
  oiintSize2: ["oiintSize2", 1.472, 0.659],
  oiiintSize1: ["oiiintSize1", 1.304, 0.499],
  oiiintSize2: ["oiiintSize2", 1.98, 0.659]
}, us = function(e, t) {
  var [r, i, n] = cs[e], l = new jt(r), u = new xt([l], {
    width: F(i),
    height: F(n),
    // Override CSS rule `.katex svg { width: 100% }`
    style: "width:" + F(i),
    viewBox: "0 0 " + 1e3 * i + " " + 1e3 * n,
    preserveAspectRatio: "xMinYMin"
  }), d = Et(["overlay"], [u], t);
  return d.height = n, d.style.height = F(n), d.style.width = F(i), d;
}, xe = {
  number: 3,
  unit: "mu"
}, $t = {
  number: 4,
  unit: "mu"
}, ft = {
  number: 5,
  unit: "mu"
}, V0 = {
  mord: {
    mop: xe,
    mbin: $t,
    mrel: ft,
    minner: xe
  },
  mop: {
    mord: xe,
    mop: xe,
    mrel: ft,
    minner: xe
  },
  mbin: {
    mord: $t,
    mop: $t,
    mopen: $t,
    minner: $t
  },
  mrel: {
    mord: ft,
    mop: ft,
    mopen: ft,
    minner: ft
  },
  mopen: {},
  mclose: {
    mop: xe,
    mbin: $t,
    mrel: ft,
    minner: xe
  },
  mpunct: {
    mord: xe,
    mop: xe,
    mrel: ft,
    mopen: xe,
    mclose: xe,
    mpunct: xe,
    minner: xe
  },
  minner: {
    mord: xe,
    mop: xe,
    mbin: $t,
    mrel: ft,
    mopen: xe,
    mpunct: xe,
    minner: xe
  }
}, G0 = {
  mord: {
    mop: xe
  },
  mop: {
    mord: xe,
    mop: xe
  },
  mbin: {},
  mrel: {},
  mopen: {},
  mclose: {
    mop: xe
  },
  mpunct: {},
  minner: {
    mop: xe
  }
}, ds = {}, tr = {}, ar = {};
function H(a) {
  for (var {
    type: e,
    names: t,
    props: r,
    handler: i,
    htmlBuilder: n,
    mathmlBuilder: l
  } = a, u = {
    type: e,
    numArgs: r.numArgs,
    argTypes: r.argTypes,
    allowedInArgument: !!r.allowedInArgument,
    allowedInText: !!r.allowedInText,
    allowedInMath: r.allowedInMath === void 0 ? !0 : r.allowedInMath,
    numOptionalArgs: r.numOptionalArgs || 0,
    infix: !!r.infix,
    primitive: !!r.primitive,
    handler: i
  }, d = 0; d < t.length; ++d)
    ds[t[d]] = u;
  e && (n && (tr[e] = n), l && (ar[e] = l));
}
function Gt(a) {
  var {
    type: e,
    htmlBuilder: t,
    mathmlBuilder: r
  } = a;
  H({
    type: e,
    names: [],
    props: {
      numArgs: 0
    },
    handler() {
      throw new Error("Should never be called.");
    },
    htmlBuilder: t,
    mathmlBuilder: r
  });
}
var rr = function(e) {
  return e.type === "ordgroup" && e.body.length === 1 ? e.body[0] : e;
}, je = function(e) {
  return e.type === "ordgroup" ? e.body : [e];
}, Y0 = /* @__PURE__ */ new Set(["leftmost", "mbin", "mopen", "mrel", "mop", "mpunct"]), K0 = /* @__PURE__ */ new Set(["rightmost", "mrel", "mclose", "mpunct"]), X0 = {
  display: ee.DISPLAY,
  text: ee.TEXT,
  script: ee.SCRIPT,
  scriptscript: ee.SCRIPTSCRIPT
}, _0 = {
  mord: "mord",
  mop: "mop",
  mbin: "mbin",
  mrel: "mrel",
  mopen: "mopen",
  mclose: "mclose",
  mpunct: "mpunct",
  minner: "minner"
}, Be = function(e, t, r, i) {
  i === void 0 && (i = [null, null]);
  for (var n = [], l = 0; l < e.length; l++) {
    var u = oe(e[l], t);
    if (u instanceof oa) {
      var d = u.children;
      n.push(...d);
    } else
      n.push(u);
  }
  if (os(n), !r)
    return n;
  var p = t;
  if (e.length === 1) {
    var f = e[0];
    f.type === "sizing" ? p = t.havingSize(f.size) : f.type === "styling" && (p = t.havingStyle(X0[f.style]));
  }
  var b = E([i[0] || "leftmost"], [], t), S = E([i[1] || "rightmost"], [], t), w = r === "root";
  return ii(n, (j, R) => {
    var N = R.classes[0], I = j.classes[0];
    N === "mbin" && K0.has(I) ? R.classes[0] = "mord" : I === "mbin" && Y0.has(N) && (j.classes[0] = "mord");
  }, {
    node: b
  }, S, w), ii(n, (j, R) => {
    var N, I, O = si(R), k = si(j), L = O && k ? j.hasClass("mtight") ? (N = G0[O]) == null ? void 0 : N[k] : (I = V0[O]) == null ? void 0 : I[k] : null;
    if (L)
      return ls(L, p);
  }, {
    node: b
  }, S, w), n;
}, ii = function(e, t, r, i, n) {
  i && e.push(i);
  for (var l = 0; l < e.length; l++) {
    var u = e[l], d = hs(u);
    if (d) {
      ii(d.children, t, r, null, n);
      continue;
    }
    var p = !u.hasClass("mspace");
    if (p) {
      var f = t(u, r.node);
      f && (r.insertAfter ? r.insertAfter(f) : (e.unshift(f), l++));
    }
    p ? r.node = u : n && u.hasClass("newline") && (r.node = E(["leftmost"])), r.insertAfter = /* @__PURE__ */ ((b) => (S) => {
      e.splice(b + 1, 0, S), l++;
    })(l);
  }
  i && e.pop();
}, hs = function(e) {
  return e instanceof oa || e instanceof sr || e instanceof la && e.hasClass("enclosing") ? e : null;
}, ni = function(e, t) {
  var r = hs(e);
  if (r) {
    var i = r.children;
    if (i.length) {
      if (t === "right")
        return ni(i[i.length - 1], "right");
      if (t === "left")
        return ni(i[0], "left");
    }
  }
  return e;
}, si = function(e, t) {
  if (!e)
    return null;
  t && (e = ni(e, t));
  var r = e.classes[0];
  return _0[r] || null;
}, Ca = function(e, t) {
  var r = ["nulldelimiter"].concat(e.baseSizingClasses());
  return E(t.concat(r));
}, oe = function(e, t, r) {
  if (!e)
    return E();
  if (tr[e.type]) {
    var i = tr[e.type](e, t);
    if (r && t.size !== r.size) {
      i = E(t.sizingClasses(r), [i], t);
      var n = t.sizeMultiplier / r.sizeMultiplier;
      i.height *= n, i.depth *= n;
    }
    return i;
  } else
    throw new B("Got group of unknown type: '" + e.type + "'");
};
function Wa(a, e) {
  var t = E(["base"], a, e), r = E(["strut"]);
  return r.style.height = F(t.height + t.depth), t.depth && (r.style.verticalAlign = F(-t.depth)), t.children.unshift(r), t;
}
function oi(a, e) {
  var t = null;
  a.length === 1 && a[0].type === "tag" && (t = a[0].tag, a = a[0].body);
  var r = Be(a, e, "root"), i;
  r.length === 2 && r[1].hasClass("tag") && (i = r.pop());
  for (var n = [], l = [], u = 0; u < r.length; u++)
    if (l.push(r[u]), r[u].hasClass("mbin") || r[u].hasClass("mrel") || r[u].hasClass("allowbreak")) {
      for (var d = !1; u < r.length - 1 && r[u + 1].hasClass("mspace") && !r[u + 1].hasClass("newline"); )
        u++, l.push(r[u]), r[u].hasClass("nobreak") && (d = !0);
      d || (n.push(Wa(l, e)), l = []);
    } else r[u].hasClass("newline") && (l.pop(), l.length > 0 && (n.push(Wa(l, e)), l = []), n.push(r[u]));
  l.length > 0 && n.push(Wa(l, e));
  var p;
  t ? (p = Wa(Be(t, e, !0), e), p.classes = ["tag"], n.push(p)) : i && n.push(i);
  var f = E(["katex-html"], n);
  if (f.setAttribute("aria-hidden", "true"), p) {
    var b = p.children[0];
    b.style.height = F(f.height + f.depth), f.depth && (b.style.verticalAlign = F(-f.depth));
  }
  return f;
}
function ms(a) {
  return new oa(a);
}
class P {
  constructor(e, t, r) {
    this.type = void 0, this.attributes = void 0, this.children = void 0, this.classes = void 0, this.type = e, this.attributes = {}, this.children = t || [], this.classes = r || [];
  }
  /**
   * Sets an attribute on a MathML node. MathML depends on attributes to convey a
   * semantic content, so this is used heavily.
   */
  setAttribute(e, t) {
    this.attributes[e] = t;
  }
  /**
   * Gets an attribute on a MathML node.
   */
  getAttribute(e) {
    return this.attributes[e];
  }
  /**
   * Converts the math node into a MathML-namespaced DOM element.
   */
  toNode() {
    var e = document.createElementNS("http://www.w3.org/1998/Math/MathML", this.type);
    for (var t in this.attributes)
      Object.prototype.hasOwnProperty.call(this.attributes, t) && e.setAttribute(t, this.attributes[t]);
    this.classes.length > 0 && (e.className = qt(this.classes));
    for (var r = 0; r < this.children.length; r++)
      if (this.children[r] instanceof Ee && this.children[r + 1] instanceof Ee) {
        for (var i = this.children[r].toText() + this.children[++r].toText(); this.children[r + 1] instanceof Ee; )
          i += this.children[++r].toText();
        e.appendChild(new Ee(i).toNode());
      } else
        e.appendChild(this.children[r].toNode());
    return e;
  }
  /**
   * Converts the math node into an HTML markup string.
   */
  toMarkup() {
    var e = "<" + this.type;
    for (var t in this.attributes)
      Object.prototype.hasOwnProperty.call(this.attributes, t) && (e += " " + t + '="', e += Ne(this.attributes[t]), e += '"');
    this.classes.length > 0 && (e += ' class ="' + Ne(qt(this.classes)) + '"'), e += ">";
    for (var r = 0; r < this.children.length; r++)
      e += this.children[r].toMarkup();
    return e += "</" + this.type + ">", e;
  }
  /**
   * Converts the math node into a string, similar to innerText, but escaped.
   */
  toText() {
    return this.children.map((e) => e.toText()).join("");
  }
}
class Ee {
  constructor(e) {
    this.text = void 0, this.text = e;
  }
  /**
   * Converts the text node into a DOM text node.
   */
  toNode() {
    return document.createTextNode(this.text);
  }
  /**
   * Converts the text node into escaped HTML markup
   * (representing the text itself).
   */
  toMarkup() {
    return Ne(this.toText());
  }
  /**
   * Converts the text node into a string
   * (representing the text itself).
   */
  toText() {
    return this.text;
  }
}
class ps {
  /**
   * Create a Space node with width given in CSS ems.
   */
  constructor(e) {
    this.width = void 0, this.character = void 0, this.width = e, e >= 0.05555 && e <= 0.05556 ? this.character = " " : e >= 0.1666 && e <= 0.1667 ? this.character = " " : e >= 0.2222 && e <= 0.2223 ? this.character = " " : e >= 0.2777 && e <= 0.2778 ? this.character = "  " : e >= -0.05556 && e <= -0.05555 ? this.character = " ⁣" : e >= -0.1667 && e <= -0.1666 ? this.character = " ⁣" : e >= -0.2223 && e <= -0.2222 ? this.character = " ⁣" : e >= -0.2778 && e <= -0.2777 ? this.character = " ⁣" : this.character = null;
  }
  /**
   * Converts the math node into a MathML-namespaced DOM element.
   */
  toNode() {
    if (this.character)
      return document.createTextNode(this.character);
    var e = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mspace");
    return e.setAttribute("width", F(this.width)), e;
  }
  /**
   * Converts the math node into an HTML markup string.
   */
  toMarkup() {
    return this.character ? "<mtext>" + this.character + "</mtext>" : '<mspace width="' + F(this.width) + '"/>';
  }
  /**
   * Converts the math node into a string, similar to innerText.
   */
  toText() {
    return this.character ? this.character : " ";
  }
}
var Z0 = /* @__PURE__ */ new Set(["\\imath", "\\jmath"]), J0 = /* @__PURE__ */ new Set(["mrow", "mtable"]), rt = function(e, t, r) {
  return ve[t][e] && ve[t][e].replace && e.charCodeAt(0) !== 55349 && !(ss.hasOwnProperty(e) && r && (r.fontFamily && r.fontFamily.slice(4, 6) === "tt" || r.font && r.font.slice(4, 6) === "tt")) && (e = ve[t][e].replace), new Ee(e);
}, Ai = function(e) {
  return e.length === 1 ? e[0] : new P("mrow", e);
}, Q0 = {
  mathit: "italic",
  boldsymbol: (a) => a.type === "textord" ? "bold" : "bold-italic",
  mathbf: "bold",
  mathbb: "double-struck",
  mathsfit: "sans-serif-italic",
  mathfrak: "fraktur",
  mathscr: "script",
  mathcal: "script",
  mathsf: "sans-serif",
  mathtt: "monospace"
}, Si = (a, e) => {
  if (a.mode === "text") {
    if (e.fontFamily === "texttt")
      return "monospace";
    if (e.fontFamily === "textsf")
      return e.fontShape === "textit" && e.fontWeight === "textbf" ? "sans-serif-bold-italic" : e.fontShape === "textit" ? "sans-serif-italic" : e.fontWeight === "textbf" ? "bold-sans-serif" : "sans-serif";
    if (e.fontShape === "textit" && e.fontWeight === "textbf")
      return "bold-italic";
    if (e.fontShape === "textit")
      return "italic";
    if (e.fontWeight === "textbf")
      return "bold";
  }
  var t = e.font;
  if (!t || t === "mathnormal")
    return null;
  var r = a.mode, i = Q0[t];
  if (i)
    return typeof i == "function" ? i(a) : i;
  var n = a.text;
  if (Z0.has(n))
    return null;
  if (ve[r][n]) {
    var l = ve[r][n].replace;
    l && (n = l);
  }
  var u = ri[t].fontName;
  return yi(n, u, r) ? ri[t].variant : null;
};
function Er(a) {
  if (!a)
    return !1;
  if (a.type === "mi" && a.children.length === 1) {
    var e = a.children[0];
    return e instanceof Ee && e.text === ".";
  } else if (a.type === "mo" && a.children.length === 1 && a.getAttribute("separator") === "true" && a.getAttribute("lspace") === "0em" && a.getAttribute("rspace") === "0em") {
    var t = a.children[0];
    return t instanceof Ee && t.text === ",";
  } else
    return !1;
}
var Ze = function(e, t, r) {
  if (e.length === 1) {
    var i = he(e[0], t);
    return r && i instanceof P && i.type === "mo" && (i.setAttribute("lspace", "0em"), i.setAttribute("rspace", "0em")), [i];
  }
  for (var n = [], l, u = 0; u < e.length; u++) {
    var d = he(e[u], t);
    if (d instanceof P && l instanceof P) {
      if (d.type === "mtext" && l.type === "mtext" && d.getAttribute("mathvariant") === l.getAttribute("mathvariant")) {
        l.children.push(...d.children);
        continue;
      } else if (d.type === "mn" && l.type === "mn") {
        l.children.push(...d.children);
        continue;
      } else if (Er(d) && l.type === "mn") {
        l.children.push(...d.children);
        continue;
      } else if (d.type === "mn" && Er(l))
        d.children = [...l.children, ...d.children], n.pop();
      else if ((d.type === "msup" || d.type === "msub") && d.children.length >= 1 && (l.type === "mn" || Er(l))) {
        var p = d.children[0];
        p instanceof P && p.type === "mn" && (p.children = [...l.children, ...p.children], n.pop());
      } else if (l.type === "mi" && l.children.length === 1) {
        var f = l.children[0];
        if (f instanceof Ee && f.text === "̸" && (d.type === "mo" || d.type === "mi" || d.type === "mn")) {
          var b = d.children[0];
          b instanceof Ee && b.text.length > 0 && (b.text = b.text.slice(0, 1) + "̸" + b.text.slice(1), n.pop());
        }
      }
    }
    n.push(d), l = d;
  }
  return n;
}, Rt = function(e, t, r) {
  return Ai(Ze(e, t, r));
}, he = function(e, t) {
  if (!e)
    return new P("mrow");
  if (ar[e.type])
    return ar[e.type](e, t);
  throw new B("Got group of unknown type: '" + e.type + "'");
};
function ln(a, e, t, r, i) {
  var n = Ze(a, t), l;
  n.length === 1 && n[0] instanceof P && J0.has(n[0].type) ? l = n[0] : l = new P("mrow", n);
  var u = new P("annotation", [new Ee(e)]);
  u.setAttribute("encoding", "application/x-tex");
  var d = new P("semantics", [l, u]), p = new P("math", [d]);
  p.setAttribute("xmlns", "http://www.w3.org/1998/Math/MathML"), r && p.setAttribute("display", "block");
  var f = i ? "katex" : "katex-mathml";
  return E([f], [p]);
}
var el = [
  // Each element contains [textsize, scriptsize, scriptscriptsize].
  // The size mappings are taken from TeX with \normalsize=10pt.
  [1, 1, 1],
  // size1: [5, 5, 5]              \tiny
  [2, 1, 1],
  // size2: [6, 5, 5]
  [3, 1, 1],
  // size3: [7, 5, 5]              \scriptsize
  [4, 2, 1],
  // size4: [8, 6, 5]              \footnotesize
  [5, 2, 1],
  // size5: [9, 6, 5]              \small
  [6, 3, 1],
  // size6: [10, 7, 5]             \normalsize
  [7, 4, 2],
  // size7: [12, 8, 6]             \large
  [8, 6, 3],
  // size8: [14.4, 10, 7]          \Large
  [9, 7, 6],
  // size9: [17.28, 12, 10]        \LARGE
  [10, 8, 7],
  // size10: [20.74, 14.4, 12]     \huge
  [11, 10, 9]
  // size11: [24.88, 20.74, 17.28] \HUGE
], cn = [
  // fontMetrics.js:getGlobalMetrics also uses size indexes, so if
  // you change size indexes, change that function.
  0.5,
  0.6,
  0.7,
  0.8,
  0.9,
  1,
  1.2,
  1.44,
  1.728,
  2.074,
  2.488
], un = function(e, t) {
  return t.size < 2 ? e : el[e - 1][t.size - 1];
};
class vt {
  constructor(e) {
    this.style = void 0, this.color = void 0, this.size = void 0, this.textSize = void 0, this.phantom = void 0, this.font = void 0, this.fontFamily = void 0, this.fontWeight = void 0, this.fontShape = void 0, this.sizeMultiplier = void 0, this.maxSize = void 0, this.minRuleThickness = void 0, this._fontMetrics = void 0, this.style = e.style, this.color = e.color, this.size = e.size || vt.BASESIZE, this.textSize = e.textSize || this.size, this.phantom = !!e.phantom, this.font = e.font || "", this.fontFamily = e.fontFamily || "", this.fontWeight = e.fontWeight || "", this.fontShape = e.fontShape || "", this.sizeMultiplier = cn[this.size - 1], this.maxSize = e.maxSize, this.minRuleThickness = e.minRuleThickness, this._fontMetrics = void 0;
  }
  /**
   * Returns a new options object with the same properties as "this".  Properties
   * from "extension" will be copied to the new options object.
   */
  extend(e) {
    var t = {
      style: this.style,
      size: this.size,
      textSize: this.textSize,
      color: this.color,
      phantom: this.phantom,
      font: this.font,
      fontFamily: this.fontFamily,
      fontWeight: this.fontWeight,
      fontShape: this.fontShape,
      maxSize: this.maxSize,
      minRuleThickness: this.minRuleThickness
    };
    return Object.assign(t, e), new vt(t);
  }
  /**
   * Return an options object with the given style. If `this.style === style`,
   * returns `this`.
   */
  havingStyle(e) {
    return this.style === e ? this : this.extend({
      style: e,
      size: un(this.textSize, e)
    });
  }
  /**
   * Return an options object with a cramped version of the current style. If
   * the current style is cramped, returns `this`.
   */
  havingCrampedStyle() {
    return this.havingStyle(this.style.cramp());
  }
  /**
   * Return an options object with the given size and in at least `\textstyle`.
   * Returns `this` if appropriate.
   */
  havingSize(e) {
    return this.size === e && this.textSize === e ? this : this.extend({
      style: this.style.text(),
      size: e,
      textSize: e,
      sizeMultiplier: cn[e - 1]
    });
  }
  /**
   * Like `this.havingSize(BASESIZE).havingStyle(style)`. If `style` is omitted,
   * changes to at least `\textstyle`.
   */
  havingBaseStyle(e) {
    e = e || this.style.text();
    var t = un(vt.BASESIZE, e);
    return this.size === t && this.textSize === vt.BASESIZE && this.style === e ? this : this.extend({
      style: e,
      size: t
    });
  }
  /**
   * Remove the effect of sizing changes such as \Huge.
   * Keep the effect of the current style, such as \scriptstyle.
   */
  havingBaseSizing() {
    var e;
    switch (this.style.id) {
      case 4:
      case 5:
        e = 3;
        break;
      case 6:
      case 7:
        e = 1;
        break;
      default:
        e = 6;
    }
    return this.extend({
      style: this.style.text(),
      size: e
    });
  }
  /**
   * Create a new options object with the given color.
   */
  withColor(e) {
    return this.extend({
      color: e
    });
  }
  /**
   * Create a new options object with "phantom" set to true.
   */
  withPhantom() {
    return this.extend({
      phantom: !0
    });
  }
  /**
   * Creates a new options object with the given math font or old text font.
   * @type {[type]}
   */
  withFont(e) {
    return this.extend({
      font: e
    });
  }
  /**
   * Create a new options objects with the given fontFamily.
   */
  withTextFontFamily(e) {
    return this.extend({
      fontFamily: e,
      font: ""
    });
  }
  /**
   * Creates a new options object with the given font weight
   */
  withTextFontWeight(e) {
    return this.extend({
      fontWeight: e,
      font: ""
    });
  }
  /**
   * Creates a new options object with the given font weight
   */
  withTextFontShape(e) {
    return this.extend({
      fontShape: e,
      font: ""
    });
  }
  /**
   * Return the CSS sizing classes required to switch from enclosing options
   * `oldOptions` to `this`. Returns an array of classes.
   */
  sizingClasses(e) {
    return e.size !== this.size ? ["sizing", "reset-size" + e.size, "size" + this.size] : [];
  }
  /**
   * Return the CSS sizing classes required to switch to the base size. Like
   * `this.havingSize(BASESIZE).sizingClasses(this)`.
   */
  baseSizingClasses() {
    return this.size !== vt.BASESIZE ? ["sizing", "reset-size" + this.size, "size" + vt.BASESIZE] : [];
  }
  /**
   * Return the font metrics for this size.
   */
  fontMetrics() {
    return this._fontMetrics || (this._fontMetrics = L0(this.size)), this._fontMetrics;
  }
  /**
   * Gets the CSS color of the current options object
   */
  getColor() {
    return this.phantom ? "transparent" : this.color;
  }
}
vt.BASESIZE = 6;
var fs = function(e) {
  return new vt({
    style: e.displayMode ? ee.DISPLAY : ee.TEXT,
    maxSize: e.maxSize,
    minRuleThickness: e.minRuleThickness
  });
}, gs = function(e, t) {
  if (t.displayMode) {
    var r = ["katex-display"];
    t.leqno && r.push("leqno"), t.fleqn && r.push("fleqn"), e = E(r, [e]);
  }
  return e;
}, tl = function(e, t, r) {
  var i = fs(r), n;
  if (r.output === "mathml")
    return ln(e, t, i, r.displayMode, !0);
  if (r.output === "html") {
    var l = oi(e, i);
    n = E(["katex"], [l]);
  } else {
    var u = ln(e, t, i, r.displayMode, !1), d = oi(e, i);
    n = E(["katex"], [u, d]);
  }
  return gs(n, r);
}, al = function(e, t, r) {
  var i = fs(r), n = oi(e, i), l = E(["katex"], [n]);
  return gs(l, r);
}, rl = {
  widehat: "^",
  widecheck: "ˇ",
  widetilde: "~",
  utilde: "~",
  overleftarrow: "←",
  underleftarrow: "←",
  xleftarrow: "←",
  overrightarrow: "→",
  underrightarrow: "→",
  xrightarrow: "→",
  underbrace: "⏟",
  overbrace: "⏞",
  underbracket: "⎵",
  overbracket: "⎴",
  overgroup: "⏠",
  undergroup: "⏡",
  overleftrightarrow: "↔",
  underleftrightarrow: "↔",
  xleftrightarrow: "↔",
  Overrightarrow: "⇒",
  xRightarrow: "⇒",
  overleftharpoon: "↼",
  xleftharpoonup: "↼",
  overrightharpoon: "⇀",
  xrightharpoonup: "⇀",
  xLeftarrow: "⇐",
  xLeftrightarrow: "⇔",
  xhookleftarrow: "↩",
  xhookrightarrow: "↪",
  xmapsto: "↦",
  xrightharpoondown: "⇁",
  xleftharpoondown: "↽",
  xrightleftharpoons: "⇌",
  xleftrightharpoons: "⇋",
  xtwoheadleftarrow: "↞",
  xtwoheadrightarrow: "↠",
  xlongequal: "=",
  xtofrom: "⇄",
  xrightleftarrows: "⇄",
  xrightequilibrium: "⇌",
  // Not a perfect match.
  xleftequilibrium: "⇋",
  // None better available.
  "\\cdrightarrow": "→",
  "\\cdleftarrow": "←",
  "\\cdlongequal": "="
}, cr = function(e) {
  var t = new P("mo", [new Ee(rl[e.replace(/^\\/, "")])]);
  return t.setAttribute("stretchy", "true"), t;
}, il = {
  //   path(s), minWidth, height, align
  overrightarrow: [["rightarrow"], 0.888, 522, "xMaxYMin"],
  overleftarrow: [["leftarrow"], 0.888, 522, "xMinYMin"],
  underrightarrow: [["rightarrow"], 0.888, 522, "xMaxYMin"],
  underleftarrow: [["leftarrow"], 0.888, 522, "xMinYMin"],
  xrightarrow: [["rightarrow"], 1.469, 522, "xMaxYMin"],
  "\\cdrightarrow": [["rightarrow"], 3, 522, "xMaxYMin"],
  // CD minwwidth2.5pc
  xleftarrow: [["leftarrow"], 1.469, 522, "xMinYMin"],
  "\\cdleftarrow": [["leftarrow"], 3, 522, "xMinYMin"],
  Overrightarrow: [["doublerightarrow"], 0.888, 560, "xMaxYMin"],
  xRightarrow: [["doublerightarrow"], 1.526, 560, "xMaxYMin"],
  xLeftarrow: [["doubleleftarrow"], 1.526, 560, "xMinYMin"],
  overleftharpoon: [["leftharpoon"], 0.888, 522, "xMinYMin"],
  xleftharpoonup: [["leftharpoon"], 0.888, 522, "xMinYMin"],
  xleftharpoondown: [["leftharpoondown"], 0.888, 522, "xMinYMin"],
  overrightharpoon: [["rightharpoon"], 0.888, 522, "xMaxYMin"],
  xrightharpoonup: [["rightharpoon"], 0.888, 522, "xMaxYMin"],
  xrightharpoondown: [["rightharpoondown"], 0.888, 522, "xMaxYMin"],
  xlongequal: [["longequal"], 0.888, 334, "xMinYMin"],
  "\\cdlongequal": [["longequal"], 3, 334, "xMinYMin"],
  xtwoheadleftarrow: [["twoheadleftarrow"], 0.888, 334, "xMinYMin"],
  xtwoheadrightarrow: [["twoheadrightarrow"], 0.888, 334, "xMaxYMin"],
  overleftrightarrow: [["leftarrow", "rightarrow"], 0.888, 522],
  overbrace: [["leftbrace", "midbrace", "rightbrace"], 1.6, 548],
  underbrace: [["leftbraceunder", "midbraceunder", "rightbraceunder"], 1.6, 548],
  underleftrightarrow: [["leftarrow", "rightarrow"], 0.888, 522],
  xleftrightarrow: [["leftarrow", "rightarrow"], 1.75, 522],
  xLeftrightarrow: [["doubleleftarrow", "doublerightarrow"], 1.75, 560],
  xrightleftharpoons: [["leftharpoondownplus", "rightharpoonplus"], 1.75, 716],
  xleftrightharpoons: [["leftharpoonplus", "rightharpoondownplus"], 1.75, 716],
  xhookleftarrow: [["leftarrow", "righthook"], 1.08, 522],
  xhookrightarrow: [["lefthook", "rightarrow"], 1.08, 522],
  overlinesegment: [["leftlinesegment", "rightlinesegment"], 0.888, 522],
  underlinesegment: [["leftlinesegment", "rightlinesegment"], 0.888, 522],
  overbracket: [["leftbracketover", "rightbracketover"], 1.6, 440],
  underbracket: [["leftbracketunder", "rightbracketunder"], 1.6, 410],
  overgroup: [["leftgroup", "rightgroup"], 0.888, 342],
  undergroup: [["leftgroupunder", "rightgroupunder"], 0.888, 342],
  xmapsto: [["leftmapsto", "rightarrow"], 1.5, 522],
  xtofrom: [["leftToFrom", "rightToFrom"], 1.75, 528],
  // The next three arrows are from the mhchem package.
  // In mhchem.sty, min-length is 2.0em. But these arrows might appear in the
  // document as \xrightarrow or \xrightleftharpoons. Those have
  // min-length = 1.75em, so we set min-length on these next three to match.
  xrightleftarrows: [["baraboveleftarrow", "rightarrowabovebar"], 1.75, 901],
  xrightequilibrium: [["baraboveshortleftharpoon", "rightharpoonaboveshortbar"], 1.75, 716],
  xleftequilibrium: [["shortbaraboveleftharpoon", "shortrightharpoonabovebar"], 1.75, 716]
}, nl = /* @__PURE__ */ new Set(["widehat", "widecheck", "widetilde", "utilde"]), ur = function(e, t) {
  function r() {
    var u = 4e5, d = e.label.slice(1);
    if (nl.has(d) && "base" in e) {
      var p = e.base.type === "ordgroup" ? e.base.body.length : 1, f, b, S;
      if (p > 5)
        d === "widehat" || d === "widecheck" ? (f = 420, u = 2364, S = 0.42, b = d + "4") : (f = 312, u = 2340, S = 0.34, b = "tilde4");
      else {
        var w = [1, 1, 2, 2, 3, 3][p];
        d === "widehat" || d === "widecheck" ? (u = [0, 1062, 2364, 2364, 2364][w], f = [0, 239, 300, 360, 420][w], S = [0, 0.24, 0.3, 0.3, 0.36, 0.42][w], b = d + w) : (u = [0, 600, 1033, 2339, 2340][w], f = [0, 260, 286, 306, 312][w], S = [0, 0.26, 0.286, 0.3, 0.306, 0.34][w], b = "tilde" + w);
      }
      var j = new jt(b), R = new xt([j], {
        width: "100%",
        height: F(S),
        viewBox: "0 0 " + u + " " + f,
        preserveAspectRatio: "none"
      });
      return {
        span: Et([], [R], t),
        minWidth: 0,
        height: S
      };
    } else {
      var N = [], I = il[d];
      if (!I)
        throw new Error('No SVG data for "' + d + '".');
      var [O, k, L] = I, V = L / 1e3, X = O.length, ae, G;
      if (X === 1) {
        if (I.length !== 4)
          throw new Error('Expected 4-tuple for single-path SVG data "' + d + '".');
        ae = ["hide-tail"], G = [I[3]];
      } else if (X === 2)
        ae = ["halfarrow-left", "halfarrow-right"], G = ["xMinYMin", "xMaxYMin"];
      else if (X === 3)
        ae = ["brace-left", "brace-center", "brace-right"], G = ["xMinYMin", "xMidYMin", "xMaxYMin"];
      else
        throw new Error(`Correct katexImagesData or update code here to support
                    ` + X + " children.");
      for (var J = 0; J < X; J++) {
        var me = new jt(O[J]), _ = new xt([me], {
          width: "400em",
          height: F(V),
          viewBox: "0 0 " + u + " " + L,
          preserveAspectRatio: G[J] + " slice"
        }), ne = Et([ae[J]], [_], t);
        if (X === 1)
          return {
            span: ne,
            minWidth: k,
            height: V
          };
        ne.style.height = F(V), N.push(ne);
      }
      return {
        span: E(["stretchy"], N, t),
        minWidth: k,
        height: V
      };
    }
  }
  var {
    span: i,
    minWidth: n,
    height: l
  } = r();
  return i.height = l, i.style.height = F(l), n > 0 && (i.style.minWidth = F(n)), i;
}, sl = function(e, t, r, i, n) {
  var l, u = e.height + e.depth + r + i;
  if (/fbox|color|angl/.test(t)) {
    if (l = E(["stretchy", t], [], n), t === "fbox") {
      var d = n.color && n.getColor();
      d && (l.style.borderColor = d);
    }
  } else {
    var p = [];
    /^[bx]cancel$/.test(t) && p.push(new Zr({
      x1: "0",
      y1: "0",
      x2: "100%",
      y2: "100%",
      "stroke-width": "0.046em"
    })), /^x?cancel$/.test(t) && p.push(new Zr({
      x1: "0",
      y1: "100%",
      x2: "100%",
      y2: "0",
      "stroke-width": "0.046em"
    }));
    var f = new xt(p, {
      width: "100%",
      height: F(u)
    });
    l = Et([], [f], n);
  }
  return l.height = u, l.style.height = F(u), l;
}, ol = {
  bin: 1,
  close: 1,
  inner: 1,
  open: 1,
  punct: 1,
  rel: 1
}, ll = {
  "accent-token": 1,
  mathord: 1,
  "op-token": 1,
  spacing: 1,
  textord: 1
};
function cl(a) {
  return a in ol;
}
function te(a, e) {
  if (!a || a.type !== e)
    throw new Error("Expected node of type " + e + ", but got " + (a ? "node of type " + a.type : String(a)));
  return a;
}
function dr(a) {
  var e = hr(a);
  if (!e)
    throw new Error("Expected node of symbol group type, but got " + (a ? "node of type " + a.type : String(a)));
  return e;
}
function hr(a) {
  return a && (a.type === "atom" || ll.hasOwnProperty(a.type)) ? a : null;
}
var vs = (a) => {
  if (a instanceof Xe)
    return a;
  if (P0(a) && a.children.length === 1)
    return vs(a.children[0]);
}, ki = (a, e) => {
  var t, r, i;
  a && a.type === "supsub" ? (r = te(a.base, "accent"), t = r.base, a.base = t, i = B0(oe(a, e)), a.base = r) : (r = te(a, "accent"), t = r.base);
  var n = oe(t, e.havingCrampedStyle()), l = r.isShifty && wt(t), u = 0;
  if (l) {
    var d, p;
    u = (d = (p = vs(n)) == null ? void 0 : p.skew) != null ? d : 0;
  }
  var f = r.label === "\\c", b = f ? n.height + n.depth : Math.min(n.height, e.fontMetrics().xHeight), S;
  if (r.isStretchy)
    S = ur(r, e), S = se({
      positionType: "firstBaseline",
      children: [{
        type: "elem",
        elem: n
      }, {
        type: "elem",
        elem: S,
        wrapperClasses: ["svg-align"],
        wrapperStyle: u > 0 ? {
          width: "calc(100% - " + F(2 * u) + ")",
          marginLeft: F(2 * u)
        } : void 0
      }]
    });
  else {
    var w, j;
    r.label === "\\vec" ? (w = us("vec", e), j = cs.vec[1]) : (w = lr({
      mode: r.mode,
      text: r.label
    }, e, "textord"), w = D0(w), w.italic = 0, j = w.width, f && (b += w.depth)), S = E(["accent-body"], [w]);
    var R = r.label === "\\textcircled";
    R && (S.classes.push("accent-full"), b = n.height);
    var N = u;
    R || (N -= j / 2), S.style.left = F(N), r.label === "\\textcircled" && (S.style.top = ".2em"), S = se({
      positionType: "firstBaseline",
      children: [{
        type: "elem",
        elem: n
      }, {
        type: "kern",
        size: -b
      }, {
        type: "elem",
        elem: S
      }]
    });
  }
  var I = E(["mord", "accent"], [S], e);
  return i ? (i.children[0] = I, i.height = Math.max(I.height, i.height), i.classes[0] = "mord", i) : I;
}, bs = (a, e) => {
  var t = a.isStretchy ? cr(a.label) : new P("mo", [rt(a.label, a.mode)]), r = new P("mover", [he(a.base, e), t]);
  return r.setAttribute("accent", "true"), r;
}, ul = new RegExp(["\\acute", "\\grave", "\\ddot", "\\tilde", "\\bar", "\\breve", "\\check", "\\hat", "\\vec", "\\dot", "\\mathring"].map((a) => "\\" + a).join("|"));
H({
  type: "accent",
  names: ["\\acute", "\\grave", "\\ddot", "\\tilde", "\\bar", "\\breve", "\\check", "\\hat", "\\vec", "\\dot", "\\mathring", "\\widecheck", "\\widehat", "\\widetilde", "\\overrightarrow", "\\overleftarrow", "\\Overrightarrow", "\\overleftrightarrow", "\\overgroup", "\\overlinesegment", "\\overleftharpoon", "\\overrightharpoon"],
  props: {
    numArgs: 1
  },
  handler: (a, e) => {
    var t = rr(e[0]), r = !ul.test(a.funcName), i = !r || a.funcName === "\\widehat" || a.funcName === "\\widetilde" || a.funcName === "\\widecheck";
    return {
      type: "accent",
      mode: a.parser.mode,
      label: a.funcName,
      isStretchy: r,
      isShifty: i,
      base: t
    };
  },
  htmlBuilder: ki,
  mathmlBuilder: bs
});
H({
  type: "accent",
  names: ["\\'", "\\`", "\\^", "\\~", "\\=", "\\u", "\\.", '\\"', "\\c", "\\r", "\\H", "\\v", "\\textcircled"],
  props: {
    numArgs: 1,
    allowedInText: !0,
    allowedInMath: !0,
    // unless in strict mode
    argTypes: ["primitive"]
  },
  handler: (a, e) => {
    var t = e[0], r = a.parser.mode;
    return r === "math" && (a.parser.settings.reportNonstrict("mathVsTextAccents", "LaTeX's accent " + a.funcName + " works only in text mode"), r = "text"), {
      type: "accent",
      mode: r,
      label: a.funcName,
      isStretchy: !1,
      isShifty: !0,
      base: t
    };
  },
  htmlBuilder: ki,
  mathmlBuilder: bs
});
H({
  type: "accentUnder",
  names: ["\\underleftarrow", "\\underrightarrow", "\\underleftrightarrow", "\\undergroup", "\\underlinesegment", "\\utilde"],
  props: {
    numArgs: 1
  },
  handler: (a, e) => {
    var {
      parser: t,
      funcName: r
    } = a, i = e[0];
    return {
      type: "accentUnder",
      mode: t.mode,
      label: r,
      base: i
    };
  },
  htmlBuilder: (a, e) => {
    var t = oe(a.base, e), r = ur(a, e), i = a.label === "\\utilde" ? 0.12 : 0, n = se({
      positionType: "top",
      positionData: t.height,
      children: [{
        type: "elem",
        elem: r,
        wrapperClasses: ["svg-align"]
      }, {
        type: "kern",
        size: i
      }, {
        type: "elem",
        elem: t
      }]
    });
    return E(["mord", "accentunder"], [n], e);
  },
  mathmlBuilder: (a, e) => {
    var t = cr(a.label), r = new P("munder", [he(a.base, e), t]);
    return r.setAttribute("accentunder", "true"), r;
  }
});
var Ua = (a) => {
  var e = new P("mpadded", a ? [a] : []);
  return e.setAttribute("width", "+0.6em"), e.setAttribute("lspace", "0.3em"), e;
};
H({
  type: "xArrow",
  names: [
    "\\xleftarrow",
    "\\xrightarrow",
    "\\xLeftarrow",
    "\\xRightarrow",
    "\\xleftrightarrow",
    "\\xLeftrightarrow",
    "\\xhookleftarrow",
    "\\xhookrightarrow",
    "\\xmapsto",
    "\\xrightharpoondown",
    "\\xrightharpoonup",
    "\\xleftharpoondown",
    "\\xleftharpoonup",
    "\\xrightleftharpoons",
    "\\xleftrightharpoons",
    "\\xlongequal",
    "\\xtwoheadrightarrow",
    "\\xtwoheadleftarrow",
    "\\xtofrom",
    // The next 3 functions are here to support the mhchem extension.
    // Direct use of these functions is discouraged and may break someday.
    "\\xrightleftarrows",
    "\\xrightequilibrium",
    "\\xleftequilibrium",
    // The next 3 functions are here only to support the {CD} environment.
    "\\\\cdrightarrow",
    "\\\\cdleftarrow",
    "\\\\cdlongequal"
  ],
  props: {
    numArgs: 1,
    numOptionalArgs: 1
  },
  handler(a, e, t) {
    var {
      parser: r,
      funcName: i
    } = a;
    return {
      type: "xArrow",
      mode: r.mode,
      label: i,
      body: e[0],
      below: t[0]
    };
  },
  htmlBuilder(a, e) {
    var t = e.style, r = e.havingStyle(t.sup()), i = na(oe(a.body, r, e), e), n = a.label.slice(0, 2) === "\\x" ? "x" : "cd";
    i.classes.push(n + "-arrow-pad");
    var l;
    a.below && (r = e.havingStyle(t.sub()), l = na(oe(a.below, r, e), e), l.classes.push(n + "-arrow-pad"));
    var u = ur(a, e), d = -e.fontMetrics().axisHeight + 0.5 * u.height, p = -e.fontMetrics().axisHeight - 0.5 * u.height - 0.111;
    (i.depth > 0.25 || a.label === "\\xleftequilibrium") && (p -= i.depth);
    var f;
    if (l) {
      var b = -e.fontMetrics().axisHeight + l.height + 0.5 * u.height + 0.111;
      f = se({
        positionType: "individualShift",
        children: [{
          type: "elem",
          elem: i,
          shift: p
        }, {
          type: "elem",
          elem: u,
          shift: d,
          wrapperClasses: ["svg-align"]
        }, {
          type: "elem",
          elem: l,
          shift: b
        }]
      });
    } else
      f = se({
        positionType: "individualShift",
        children: [{
          type: "elem",
          elem: i,
          shift: p
        }, {
          type: "elem",
          elem: u,
          shift: d,
          wrapperClasses: ["svg-align"]
        }]
      });
    return E(["mrel", "x-arrow"], [f], e);
  },
  mathmlBuilder(a, e) {
    var t = cr(a.label);
    t.setAttribute("minsize", a.label.charAt(0) === "x" ? "1.75em" : "3.0em");
    var r;
    if (a.body) {
      var i = Ua(he(a.body, e));
      if (a.below) {
        var n = Ua(he(a.below, e));
        r = new P("munderover", [t, n, i]);
      } else
        r = new P("mover", [t, i]);
    } else if (a.below) {
      var l = Ua(he(a.below, e));
      r = new P("munder", [t, l]);
    } else
      r = Ua(), r = new P("mover", [t, r]);
    return r;
  }
});
function ys(a, e) {
  var t = Be(a.body, e, !0);
  return E([a.mclass], t, e);
}
function xs(a, e) {
  var t, r = Ze(a.body, e);
  return a.mclass === "minner" ? t = new P("mpadded", r) : a.mclass === "mord" ? a.isCharacterBox ? (t = r[0], t.type = "mi") : t = new P("mi", r) : (a.isCharacterBox ? (t = r[0], t.type = "mo") : t = new P("mo", r), a.mclass === "mbin" ? (t.attributes.lspace = "0.22em", t.attributes.rspace = "0.22em") : a.mclass === "mpunct" ? (t.attributes.lspace = "0em", t.attributes.rspace = "0.17em") : a.mclass === "mopen" || a.mclass === "mclose" ? (t.attributes.lspace = "0em", t.attributes.rspace = "0em") : a.mclass === "minner" && (t.attributes.lspace = "0.0556em", t.attributes.width = "+0.1111em")), t;
}
H({
  type: "mclass",
  names: ["\\mathord", "\\mathbin", "\\mathrel", "\\mathopen", "\\mathclose", "\\mathpunct", "\\mathinner"],
  props: {
    numArgs: 1,
    primitive: !0
  },
  handler(a, e) {
    var {
      parser: t,
      funcName: r
    } = a, i = e[0];
    return {
      type: "mclass",
      mode: t.mode,
      mclass: "m" + r.slice(5),
      // TODO(kevinb): don't prefix with 'm'
      body: je(i),
      isCharacterBox: wt(i)
    };
  },
  htmlBuilder: ys,
  mathmlBuilder: xs
});
var mr = (a) => {
  var e = a.type === "ordgroup" && a.body.length ? a.body[0] : a;
  return e.type === "atom" && (e.family === "bin" || e.family === "rel") ? "m" + e.family : "mord";
};
H({
  type: "mclass",
  names: ["\\@binrel"],
  props: {
    numArgs: 2
  },
  handler(a, e) {
    var {
      parser: t
    } = a;
    return {
      type: "mclass",
      mode: t.mode,
      mclass: mr(e[0]),
      body: je(e[1]),
      isCharacterBox: wt(e[1])
    };
  }
});
H({
  type: "mclass",
  names: ["\\stackrel", "\\overset", "\\underset"],
  props: {
    numArgs: 2
  },
  handler(a, e) {
    var {
      parser: t,
      funcName: r
    } = a, i = e[1], n = e[0], l;
    r !== "\\stackrel" ? l = mr(i) : l = "mrel";
    var u = {
      type: "op",
      mode: i.mode,
      limits: !0,
      alwaysHandleSupSub: !0,
      parentIsSupSub: !1,
      symbol: !1,
      suppressBaseShift: r !== "\\stackrel",
      body: je(i)
    }, d = {
      type: "supsub",
      mode: n.mode,
      base: u,
      sup: r === "\\underset" ? null : n,
      sub: r === "\\underset" ? n : null
    };
    return {
      type: "mclass",
      mode: t.mode,
      mclass: l,
      body: [d],
      isCharacterBox: wt(d)
    };
  },
  htmlBuilder: ys,
  mathmlBuilder: xs
});
H({
  type: "pmb",
  names: ["\\pmb"],
  props: {
    numArgs: 1,
    allowedInText: !0
  },
  handler(a, e) {
    var {
      parser: t
    } = a;
    return {
      type: "pmb",
      mode: t.mode,
      mclass: mr(e[0]),
      body: je(e[0])
    };
  },
  htmlBuilder(a, e) {
    var t = Be(a.body, e, !0), r = E([a.mclass], t, e);
    return r.style.textShadow = "0.02em 0.01em 0.04px", r;
  },
  mathmlBuilder(a, e) {
    var t = Ze(a.body, e), r = new P("mstyle", t);
    return r.setAttribute("style", "text-shadow: 0.02em 0.01em 0.04px"), r;
  }
});
var dl = {
  ">": "\\\\cdrightarrow",
  "<": "\\\\cdleftarrow",
  "=": "\\\\cdlongequal",
  A: "\\uparrow",
  V: "\\downarrow",
  "|": "\\Vert",
  ".": "no arrow"
}, dn = () => ({
  type: "styling",
  body: [],
  mode: "math",
  style: "display",
  resetFont: !0
}), hn = (a) => a.type === "textord" && a.text === "@", hl = (a, e) => (a.type === "mathord" || a.type === "atom") && a.text === e;
function ml(a, e, t) {
  var r = dl[a];
  switch (r) {
    case "\\\\cdrightarrow":
    case "\\\\cdleftarrow":
      return t.callFunction(r, [e[0]], [e[1]]);
    case "\\uparrow":
    case "\\downarrow": {
      var i = t.callFunction("\\\\cdleft", [e[0]], []), n = {
        type: "atom",
        text: r,
        mode: "math",
        family: "rel"
      }, l = t.callFunction("\\Big", [n], []), u = t.callFunction("\\\\cdright", [e[1]], []), d = {
        type: "ordgroup",
        mode: "math",
        body: [i, l, u]
      };
      return t.callFunction("\\\\cdparent", [d], []);
    }
    case "\\\\cdlongequal":
      return t.callFunction("\\\\cdlongequal", [], []);
    case "\\Vert": {
      var p = {
        type: "textord",
        text: "\\Vert",
        mode: "math"
      };
      return t.callFunction("\\Big", [p], []);
    }
    default:
      return {
        type: "textord",
        text: " ",
        mode: "math"
      };
  }
}
function pl(a) {
  var e = [];
  for (a.gullet.beginGroup(), a.gullet.macros.set("\\cr", "\\\\\\relax"), a.gullet.beginGroup(); ; ) {
    e.push(a.parseExpression(!1, "\\\\")), a.gullet.endGroup(), a.gullet.beginGroup();
    var t = a.fetch().text;
    if (t === "&" || t === "\\\\")
      a.consume();
    else if (t === "\\end") {
      e[e.length - 1].length === 0 && e.pop();
      break;
    } else
      throw new B("Expected \\\\ or \\cr or \\end", a.nextToken);
  }
  for (var r = [], i = [r], n = 0; n < e.length; n++) {
    for (var l = e[n], u = dn(), d = 0; d < l.length; d++)
      if (!hn(l[d]))
        u.body.push(l[d]);
      else {
        r.push(u), d += 1;
        var p = dr(l[d]).text, f = new Array(2);
        if (f[0] = {
          type: "ordgroup",
          mode: "math",
          body: []
        }, f[1] = {
          type: "ordgroup",
          mode: "math",
          body: []
        }, !"=|.".includes(p)) if ("<>AV".includes(p))
          for (var b = 0; b < 2; b++) {
            for (var S = !0, w = d + 1; w < l.length; w++) {
              if (hl(l[w], p)) {
                S = !1, d = w;
                break;
              }
              if (hn(l[w]))
                throw new B("Missing a " + p + " character to complete a CD arrow.", l[w]);
              f[b].body.push(l[w]);
            }
            if (S)
              throw new B("Missing a " + p + " character to complete a CD arrow.", l[d]);
          }
        else
          throw new B('Expected one of "<>AV=|." after @', l[d]);
        var j = ml(p, f, a), R = {
          type: "styling",
          body: [j],
          mode: "math",
          style: "display",
          // CD is always displaystyle.
          resetFont: !0
        };
        r.push(R), u = dn();
      }
    n % 2 === 0 ? r.push(u) : r.shift(), r = [], i.push(r);
  }
  a.gullet.endGroup(), a.gullet.endGroup();
  var N = new Array(i[0].length).fill({
    type: "align",
    align: "c",
    pregap: 0.25,
    // CD package sets \enskip between columns.
    postgap: 0.25
    // So pre and post each get half an \enskip, i.e. 0.25em.
  });
  return {
    type: "array",
    mode: "math",
    body: i,
    arraystretch: 1,
    addJot: !0,
    rowGaps: [null],
    cols: N,
    colSeparationType: "CD",
    hLinesBeforeRow: new Array(i.length + 1).fill([])
  };
}
H({
  type: "cdlabel",
  names: ["\\\\cdleft", "\\\\cdright"],
  props: {
    numArgs: 1
  },
  handler(a, e) {
    var {
      parser: t,
      funcName: r
    } = a;
    return {
      type: "cdlabel",
      mode: t.mode,
      side: r.slice(4),
      label: e[0]
    };
  },
  htmlBuilder(a, e) {
    var t = e.havingStyle(e.style.sup()), r = na(oe(a.label, t, e), e);
    return r.classes.push("cd-label-" + a.side), r.style.bottom = F(0.8 - r.depth), r.height = 0, r.depth = 0, r;
  },
  mathmlBuilder(a, e) {
    var t = new P("mrow", [he(a.label, e)]);
    return t = new P("mpadded", [t]), t.setAttribute("width", "0"), a.side === "left" && t.setAttribute("lspace", "-1width"), t.setAttribute("voffset", "0.7em"), t = new P("mstyle", [t]), t.setAttribute("displaystyle", "false"), t.setAttribute("scriptlevel", "1"), t;
  }
});
H({
  type: "cdlabelparent",
  names: ["\\\\cdparent"],
  props: {
    numArgs: 1
  },
  handler(a, e) {
    var {
      parser: t
    } = a;
    return {
      type: "cdlabelparent",
      mode: t.mode,
      fragment: e[0]
    };
  },
  htmlBuilder(a, e) {
    var t = na(oe(a.fragment, e), e);
    return t.classes.push("cd-vert-arrow"), t;
  },
  mathmlBuilder(a, e) {
    return new P("mrow", [he(a.fragment, e)]);
  }
});
H({
  type: "textord",
  names: ["\\@char"],
  props: {
    numArgs: 1,
    allowedInText: !0
  },
  handler(a, e) {
    for (var {
      parser: t
    } = a, r = te(e[0], "ordgroup"), i = r.body, n = "", l = 0; l < i.length; l++) {
      var u = te(i[l], "textord");
      n += u.text;
    }
    var d = parseInt(n), p;
    if (isNaN(d))
      throw new B("\\@char has non-numeric argument " + n);
    if (d < 0 || d >= 1114111)
      throw new B("\\@char with invalid code point " + n);
    return d <= 65535 ? p = String.fromCharCode(d) : (d -= 65536, p = String.fromCharCode((d >> 10) + 55296, (d & 1023) + 56320)), {
      type: "textord",
      mode: t.mode,
      text: p
    };
  }
});
var ws = (a, e) => {
  var t = Be(a.body, e.withColor(a.color), !1);
  return St(t);
}, As = (a, e) => {
  var t = Ze(a.body, e.withColor(a.color)), r = new P("mstyle", t);
  return r.setAttribute("mathcolor", a.color), r;
};
H({
  type: "color",
  names: ["\\textcolor"],
  props: {
    numArgs: 2,
    allowedInText: !0,
    argTypes: ["color", "original"]
  },
  handler(a, e) {
    var {
      parser: t
    } = a, r = te(e[0], "color-token").color, i = e[1];
    return {
      type: "color",
      mode: t.mode,
      color: r,
      body: je(i)
    };
  },
  htmlBuilder: ws,
  mathmlBuilder: As
});
H({
  type: "color",
  names: ["\\color"],
  props: {
    numArgs: 1,
    allowedInText: !0,
    argTypes: ["color"]
  },
  handler(a, e) {
    var {
      parser: t,
      breakOnTokenText: r
    } = a, i = te(e[0], "color-token").color;
    t.gullet.macros.set("\\current@color", i);
    var n = t.parseExpression(!0, r);
    return {
      type: "color",
      mode: t.mode,
      color: i,
      body: n
    };
  },
  htmlBuilder: ws,
  mathmlBuilder: As
});
H({
  type: "cr",
  names: ["\\\\"],
  props: {
    numArgs: 0,
    numOptionalArgs: 0,
    allowedInText: !0
  },
  handler(a, e, t) {
    var {
      parser: r
    } = a, i = r.gullet.future().text === "[" ? r.parseSizeGroup(!0) : null, n = !r.settings.displayMode || !r.settings.useStrictBehavior("newLineInDisplayMode", "In LaTeX, \\\\ or \\newline does nothing in display mode");
    return {
      type: "cr",
      mode: r.mode,
      newLine: n,
      size: i && te(i, "size").value
    };
  },
  // The following builders are called only at the top level,
  // not within tabular/array environments.
  htmlBuilder(a, e) {
    var t = E(["mspace"], [], e);
    return a.newLine && (t.classes.push("newline"), a.size && (t.style.marginTop = F(we(a.size, e)))), t;
  },
  mathmlBuilder(a, e) {
    var t = new P("mspace");
    return a.newLine && (t.setAttribute("linebreak", "newline"), a.size && t.setAttribute("height", F(we(a.size, e)))), t;
  }
});
var li = {
  "\\global": "\\global",
  "\\long": "\\\\globallong",
  "\\\\globallong": "\\\\globallong",
  "\\def": "\\gdef",
  "\\gdef": "\\gdef",
  "\\edef": "\\xdef",
  "\\xdef": "\\xdef",
  "\\let": "\\\\globallet",
  "\\futurelet": "\\\\globalfuture"
}, Ss = (a) => {
  var e = a.text;
  if (/^(?:[\\{}$&#^_]|EOF)$/.test(e))
    throw new B("Expected a control sequence", a);
  return e;
}, fl = (a) => {
  var e = a.gullet.popToken();
  return e.text === "=" && (e = a.gullet.popToken(), e.text === " " && (e = a.gullet.popToken())), e;
}, ks = (a, e, t, r) => {
  var i = a.gullet.macros.get(t.text);
  i == null && (t.noexpand = !0, i = {
    tokens: [t],
    numArgs: 0,
    // reproduce the same behavior in expansion
    unexpandable: !a.gullet.isExpandable(t.text)
  }), a.gullet.macros.set(e, i, r);
};
H({
  type: "internal",
  names: [
    "\\global",
    "\\long",
    "\\\\globallong"
    // can’t be entered directly
  ],
  props: {
    numArgs: 0,
    allowedInText: !0
  },
  handler(a) {
    var {
      parser: e,
      funcName: t
    } = a;
    e.consumeSpaces();
    var r = e.fetch();
    if (li[r.text])
      return (t === "\\global" || t === "\\\\globallong") && (r.text = li[r.text]), te(e.parseFunction(), "internal");
    throw new B("Invalid token after macro prefix", r);
  }
});
H({
  type: "internal",
  names: ["\\def", "\\gdef", "\\edef", "\\xdef"],
  props: {
    numArgs: 0,
    allowedInText: !0,
    primitive: !0
  },
  handler(a) {
    var {
      parser: e,
      funcName: t
    } = a, r = e.gullet.popToken(), i = r.text;
    if (/^(?:[\\{}$&#^_]|EOF)$/.test(i))
      throw new B("Expected a control sequence", r);
    for (var n = 0, l, u = [[]]; e.gullet.future().text !== "{"; )
      if (r = e.gullet.popToken(), r.text === "#") {
        if (e.gullet.future().text === "{") {
          l = e.gullet.future(), u[n].push("{");
          break;
        }
        if (r = e.gullet.popToken(), !/^[1-9]$/.test(r.text))
          throw new B('Invalid argument number "' + r.text + '"');
        if (parseInt(r.text) !== n + 1)
          throw new B('Argument number "' + r.text + '" out of order');
        n++, u.push([]);
      } else {
        if (r.text === "EOF")
          throw new B("Expected a macro definition");
        u[n].push(r.text);
      }
    var {
      tokens: d
    } = e.gullet.consumeArg();
    return l && d.unshift(l), (t === "\\edef" || t === "\\xdef") && (d = e.gullet.expandTokens(d), d.reverse()), e.gullet.macros.set(i, {
      tokens: d,
      numArgs: n,
      delimiters: u
    }, t === li[t]), {
      type: "internal",
      mode: e.mode
    };
  }
});
H({
  type: "internal",
  names: [
    "\\let",
    "\\\\globallet"
    // can’t be entered directly
  ],
  props: {
    numArgs: 0,
    allowedInText: !0,
    primitive: !0
  },
  handler(a) {
    var {
      parser: e,
      funcName: t
    } = a, r = Ss(e.gullet.popToken());
    e.gullet.consumeSpaces();
    var i = fl(e);
    return ks(e, r, i, t === "\\\\globallet"), {
      type: "internal",
      mode: e.mode
    };
  }
});
H({
  type: "internal",
  names: [
    "\\futurelet",
    "\\\\globalfuture"
    // can’t be entered directly
  ],
  props: {
    numArgs: 0,
    allowedInText: !0,
    primitive: !0
  },
  handler(a) {
    var {
      parser: e,
      funcName: t
    } = a, r = Ss(e.gullet.popToken()), i = e.gullet.popToken(), n = e.gullet.popToken();
    return ks(e, r, n, t === "\\\\globalfuture"), e.gullet.pushToken(n), e.gullet.pushToken(i), {
      type: "internal",
      mode: e.mode
    };
  }
});
var xa = function(e, t, r) {
  var i = ve.math[e] && ve.math[e].replace, n = yi(i || e, t, r);
  if (!n)
    throw new Error("Unsupported symbol " + e + " and font size " + t + ".");
  return n;
}, Ci = function(e, t, r, i) {
  var n = r.havingBaseStyle(t), l = E(i.concat(n.sizingClasses(r)), [e], r), u = n.sizeMultiplier / r.sizeMultiplier;
  return l.height *= u, l.depth *= u, l.maxFontSize = n.sizeMultiplier, l;
}, Cs = function(e, t, r) {
  var i = t.havingBaseStyle(r), n = (1 - t.sizeMultiplier / i.sizeMultiplier) * t.fontMetrics().axisHeight;
  e.classes.push("delimcenter"), e.style.top = F(n), e.height -= n, e.depth += n;
}, gl = function(e, t, r, i, n, l) {
  var u = $e(e, "Main-Regular", n, i), d = Ci(u, t, i, l);
  return Cs(d, i, t), d;
}, vl = function(e, t, r, i) {
  return $e(e, "Size" + t + "-Regular", r, i);
}, Ts = function(e, t, r, i, n, l) {
  var u = vl(e, t, n, i), d = Ci(E(["delimsizing", "size" + t], [u], i), ee.TEXT, i, l);
  return r && Cs(d, i, ee.TEXT), d;
}, Rr = function(e, t, r) {
  var i;
  t === "Size1-Regular" ? i = "delim-size1" : i = "delim-size4";
  var n = E(["delimsizinginner", i], [E([], [$e(e, t, r)])]);
  return {
    type: "elem",
    elem: n
  };
}, Dr = function(e, t, r) {
  var i = lt["Size4-Regular"][e.charCodeAt(0)] ? lt["Size4-Regular"][e.charCodeAt(0)][4] : lt["Size1-Regular"][e.charCodeAt(0)][4], n = new jt("inner", T0(e, Math.round(1e3 * t))), l = new xt([n], {
    width: F(i),
    height: F(t),
    // Override CSS rule `.katex svg { width: 100% }`
    style: "width:" + F(i),
    viewBox: "0 0 " + 1e3 * i + " " + Math.round(1e3 * t),
    preserveAspectRatio: "xMinYMin"
  }), u = Et([], [l], r);
  return u.height = t, u.style.height = F(t), u.style.width = F(i), {
    type: "elem",
    elem: u
  };
}, ci = 8e-3, Va = {
  type: "kern",
  size: -1 * ci
}, bl = /* @__PURE__ */ new Set(["|", "\\lvert", "\\rvert", "\\vert"]), yl = /* @__PURE__ */ new Set(["\\|", "\\lVert", "\\rVert", "\\Vert"]), Ms = function(e, t, r, i, n, l) {
  var u, d, p, f, b = "", S = 0;
  u = p = f = e, d = null;
  var w = "Size1-Regular";
  e === "\\uparrow" ? p = f = "⏐" : e === "\\Uparrow" ? p = f = "‖" : e === "\\downarrow" ? u = p = "⏐" : e === "\\Downarrow" ? u = p = "‖" : e === "\\updownarrow" ? (u = "\\uparrow", p = "⏐", f = "\\downarrow") : e === "\\Updownarrow" ? (u = "\\Uparrow", p = "‖", f = "\\Downarrow") : bl.has(e) ? (p = "∣", b = "vert", S = 333) : yl.has(e) ? (p = "∥", b = "doublevert", S = 556) : e === "[" || e === "\\lbrack" ? (u = "⎡", p = "⎢", f = "⎣", w = "Size4-Regular", b = "lbrack", S = 667) : e === "]" || e === "\\rbrack" ? (u = "⎤", p = "⎥", f = "⎦", w = "Size4-Regular", b = "rbrack", S = 667) : e === "\\lfloor" || e === "⌊" ? (p = u = "⎢", f = "⎣", w = "Size4-Regular", b = "lfloor", S = 667) : e === "\\lceil" || e === "⌈" ? (u = "⎡", p = f = "⎢", w = "Size4-Regular", b = "lceil", S = 667) : e === "\\rfloor" || e === "⌋" ? (p = u = "⎥", f = "⎦", w = "Size4-Regular", b = "rfloor", S = 667) : e === "\\rceil" || e === "⌉" ? (u = "⎤", p = f = "⎥", w = "Size4-Regular", b = "rceil", S = 667) : e === "(" || e === "\\lparen" ? (u = "⎛", p = "⎜", f = "⎝", w = "Size4-Regular", b = "lparen", S = 875) : e === ")" || e === "\\rparen" ? (u = "⎞", p = "⎟", f = "⎠", w = "Size4-Regular", b = "rparen", S = 875) : e === "\\{" || e === "\\lbrace" ? (u = "⎧", d = "⎨", f = "⎩", p = "⎪", w = "Size4-Regular") : e === "\\}" || e === "\\rbrace" ? (u = "⎫", d = "⎬", f = "⎭", p = "⎪", w = "Size4-Regular") : e === "\\lgroup" || e === "⟮" ? (u = "⎧", f = "⎩", p = "⎪", w = "Size4-Regular") : e === "\\rgroup" || e === "⟯" ? (u = "⎫", f = "⎭", p = "⎪", w = "Size4-Regular") : e === "\\lmoustache" || e === "⎰" ? (u = "⎧", f = "⎭", p = "⎪", w = "Size4-Regular") : (e === "\\rmoustache" || e === "⎱") && (u = "⎫", f = "⎩", p = "⎪", w = "Size4-Regular");
  var j = xa(u, w, n), R = j.height + j.depth, N = xa(p, w, n), I = N.height + N.depth, O = xa(f, w, n), k = O.height + O.depth, L = 0, V = 1;
  if (d !== null) {
    var X = xa(d, w, n);
    L = X.height + X.depth, V = 2;
  }
  var ae = R + k + L, G = Math.max(0, Math.ceil((t - ae) / (V * I))), J = ae + G * V * I, me = i.fontMetrics().axisHeight;
  r && (me *= i.sizeMultiplier);
  var _ = J / 2 - me, ne = [];
  if (b.length > 0) {
    var Pe = J - R - k, Ae = Math.round(J * 1e3), Te = M0(b, Math.round(Pe * 1e3)), Ve = new jt(b, Te), Me = F(S / 1e3), Je = F(Ae / 1e3), mt = new xt([Ve], {
      width: Me,
      height: Je,
      viewBox: "0 0 " + S + " " + Ae
    }), ye = Et([], [mt], i);
    ye.height = Ae / 1e3, ye.style.width = Me, ye.style.height = Je, ne.push({
      type: "elem",
      elem: ye
    });
  } else {
    if (ne.push(Rr(f, w, n)), ne.push(Va), d === null) {
      var ze = J - R - k + 2 * ci;
      ne.push(Dr(p, ze, i));
    } else {
      var U = (J - R - k - L) / 2 + 2 * ci;
      ne.push(Dr(p, U, i)), ne.push(Va), ne.push(Rr(d, w, n)), ne.push(Va), ne.push(Dr(p, U, i));
    }
    ne.push(Va), ne.push(Rr(u, w, n));
  }
  var Le = i.havingBaseStyle(ee.TEXT), kt = se({
    positionType: "bottom",
    positionData: _,
    children: ne
  });
  return Ci(E(["delimsizing", "mult"], [kt], Le), ee.TEXT, i, l);
}, Br = 80, Pr = 0.08, Ir = function(e, t, r, i, n) {
  var l = C0(e, i, r), u = new jt(e, l), d = new xt([u], {
    // Note: 1000:1 ratio of viewBox to document em width.
    width: "400em",
    height: F(t),
    viewBox: "0 0 400000 " + r,
    preserveAspectRatio: "xMinYMin slice"
  });
  return Et(["hide-tail"], [d], n);
}, xl = function(e, t) {
  var r = t.havingBaseSizing(), i = Rs("\\surd", e * r.sizeMultiplier, Es, r), n = r.sizeMultiplier, l = Math.max(0, t.minRuleThickness - t.fontMetrics().sqrtRuleThickness), u, d, p, f, b;
  return i.type === "small" ? (f = 1e3 + 1e3 * l + Br, e < 1 ? n = 1 : e < 1.4 && (n = 0.7), d = (1 + l + Pr) / n, p = (1 + l) / n, u = Ir("sqrtMain", d, f, l, t), u.style.minWidth = "0.853em", b = 0.833 / n) : i.type === "large" ? (f = (1e3 + Br) * Aa[i.size], p = (Aa[i.size] + l) / n, d = (Aa[i.size] + l + Pr) / n, u = Ir("sqrtSize" + i.size, d, f, l, t), u.style.minWidth = "1.02em", b = 1 / n) : (d = e + l + Pr, p = e + l, f = Math.floor(1e3 * e + l) + Br, u = Ir("sqrtTall", d, f, l, t), u.style.minWidth = "0.742em", b = 1.056), u.height = p, u.style.height = F(d), {
    span: u,
    advanceWidth: b,
    // Calculate the actual line width.
    // This actually should depend on the chosen font -- e.g. \boldmath
    // should use the thicker surd symbols from e.g. KaTeX_Main-Bold, and
    // have thicker rules.
    ruleWidth: (t.fontMetrics().sqrtRuleThickness + l) * n
  };
}, zs = /* @__PURE__ */ new Set(["(", "\\lparen", ")", "\\rparen", "[", "\\lbrack", "]", "\\rbrack", "\\{", "\\lbrace", "\\}", "\\rbrace", "\\lfloor", "\\rfloor", "⌊", "⌋", "\\lceil", "\\rceil", "⌈", "⌉", "\\surd"]), wl = /* @__PURE__ */ new Set(["\\uparrow", "\\downarrow", "\\updownarrow", "\\Uparrow", "\\Downarrow", "\\Updownarrow", "|", "\\|", "\\vert", "\\Vert", "\\lvert", "\\rvert", "\\lVert", "\\rVert", "\\lgroup", "\\rgroup", "⟮", "⟯", "\\lmoustache", "\\rmoustache", "⎰", "⎱"]), qs = /* @__PURE__ */ new Set(["<", ">", "\\langle", "\\rangle", "/", "\\backslash", "\\lt", "\\gt"]), Aa = [0, 1.2, 1.8, 2.4, 3], js = function(e, t, r, i, n) {
  if (e === "<" || e === "\\lt" || e === "⟨" ? e = "\\langle" : (e === ">" || e === "\\gt" || e === "⟩") && (e = "\\rangle"), zs.has(e) || qs.has(e))
    return Ts(e, t, !1, r, i, n);
  if (wl.has(e))
    return Ms(e, Aa[t], !1, r, i, n);
  throw new B("Illegal delimiter: '" + e + "'");
}, Al = [{
  type: "small",
  style: ee.SCRIPTSCRIPT
}, {
  type: "small",
  style: ee.SCRIPT
}, {
  type: "small",
  style: ee.TEXT
}, {
  type: "large",
  size: 1
}, {
  type: "large",
  size: 2
}, {
  type: "large",
  size: 3
}, {
  type: "large",
  size: 4
}], Sl = [{
  type: "small",
  style: ee.SCRIPTSCRIPT
}, {
  type: "small",
  style: ee.SCRIPT
}, {
  type: "small",
  style: ee.TEXT
}, {
  type: "stack"
}], Es = [{
  type: "small",
  style: ee.SCRIPTSCRIPT
}, {
  type: "small",
  style: ee.SCRIPT
}, {
  type: "small",
  style: ee.TEXT
}, {
  type: "large",
  size: 1
}, {
  type: "large",
  size: 2
}, {
  type: "large",
  size: 3
}, {
  type: "large",
  size: 4
}, {
  type: "stack"
}], kl = function(e) {
  if (e.type === "small")
    return "Main-Regular";
  if (e.type === "large")
    return "Size" + e.size + "-Regular";
  if (e.type === "stack")
    return "Size4-Regular";
  var t = e.type;
  throw new Error("Add support for delim type '" + t + "' here.");
}, Rs = function(e, t, r, i) {
  for (var n = Math.min(2, 3 - i.style.size), l = n; l < r.length; l++) {
    var u = r[l];
    if (u.type === "stack")
      break;
    var d = xa(e, kl(u), "math"), p = d.height + d.depth;
    if (u.type === "small") {
      var f = i.havingBaseStyle(u.style);
      p *= f.sizeMultiplier;
    }
    if (p > t)
      return u;
  }
  return r[r.length - 1];
}, ui = function(e, t, r, i, n, l) {
  e === "<" || e === "\\lt" || e === "⟨" ? e = "\\langle" : (e === ">" || e === "\\gt" || e === "⟩") && (e = "\\rangle");
  var u;
  qs.has(e) ? u = Al : zs.has(e) ? u = Es : u = Sl;
  var d = Rs(e, t, u, i);
  return d.type === "small" ? gl(e, d.style, r, i, n, l) : d.type === "large" ? Ts(e, d.size, r, i, n, l) : Ms(e, t, r, i, n, l);
}, Lr = function(e, t, r, i, n, l) {
  var u = i.fontMetrics().axisHeight * i.sizeMultiplier, d = 901, p = 5 / i.fontMetrics().ptPerEm, f = Math.max(t - u, r + u), b = Math.max(
    // In real TeX, calculations are done using integral values which are
    // 65536 per pt, or 655360 per em. So, the division here truncates in
    // TeX but doesn't here, producing different results. If we wanted to
    // exactly match TeX's calculation, we could do
    //   Math.floor(655360 * maxDistFromAxis / 500) *
    //    delimiterFactor / 655360
    // (To see the difference, compare
    //    x^{x^{\left(\rule{0.1em}{0.68em}\right)}}
    // in TeX and KaTeX)
    f / 500 * d,
    2 * f - p
  );
  return ui(e, b, !0, i, n, l);
}, mn = {
  "\\bigl": {
    mclass: "mopen",
    size: 1
  },
  "\\Bigl": {
    mclass: "mopen",
    size: 2
  },
  "\\biggl": {
    mclass: "mopen",
    size: 3
  },
  "\\Biggl": {
    mclass: "mopen",
    size: 4
  },
  "\\bigr": {
    mclass: "mclose",
    size: 1
  },
  "\\Bigr": {
    mclass: "mclose",
    size: 2
  },
  "\\biggr": {
    mclass: "mclose",
    size: 3
  },
  "\\Biggr": {
    mclass: "mclose",
    size: 4
  },
  "\\bigm": {
    mclass: "mrel",
    size: 1
  },
  "\\Bigm": {
    mclass: "mrel",
    size: 2
  },
  "\\biggm": {
    mclass: "mrel",
    size: 3
  },
  "\\Biggm": {
    mclass: "mrel",
    size: 4
  },
  "\\big": {
    mclass: "mord",
    size: 1
  },
  "\\Big": {
    mclass: "mord",
    size: 2
  },
  "\\bigg": {
    mclass: "mord",
    size: 3
  },
  "\\Bigg": {
    mclass: "mord",
    size: 4
  }
}, Cl = /* @__PURE__ */ new Set(["(", "\\lparen", ")", "\\rparen", "[", "\\lbrack", "]", "\\rbrack", "\\{", "\\lbrace", "\\}", "\\rbrace", "\\lfloor", "\\rfloor", "⌊", "⌋", "\\lceil", "\\rceil", "⌈", "⌉", "<", ">", "\\langle", "⟨", "\\rangle", "⟩", "\\lt", "\\gt", "\\lvert", "\\rvert", "\\lVert", "\\rVert", "\\lgroup", "\\rgroup", "⟮", "⟯", "\\lmoustache", "\\rmoustache", "⎰", "⎱", "/", "\\backslash", "|", "\\vert", "\\|", "\\Vert", "\\uparrow", "\\Uparrow", "\\downarrow", "\\Downarrow", "\\updownarrow", "\\Updownarrow", "."]);
function pn(a) {
  return "isMiddle" in a;
}
function pr(a, e) {
  var t = hr(a);
  if (t && Cl.has(t.text))
    return t;
  throw t ? new B("Invalid delimiter '" + t.text + "' after '" + e.funcName + "'", a) : new B("Invalid delimiter type '" + a.type + "'", a);
}
H({
  type: "delimsizing",
  names: ["\\bigl", "\\Bigl", "\\biggl", "\\Biggl", "\\bigr", "\\Bigr", "\\biggr", "\\Biggr", "\\bigm", "\\Bigm", "\\biggm", "\\Biggm", "\\big", "\\Big", "\\bigg", "\\Bigg"],
  props: {
    numArgs: 1,
    argTypes: ["primitive"]
  },
  handler: (a, e) => {
    var t = pr(e[0], a);
    return {
      type: "delimsizing",
      mode: a.parser.mode,
      size: mn[a.funcName].size,
      mclass: mn[a.funcName].mclass,
      delim: t.text
    };
  },
  htmlBuilder: (a, e) => a.delim === "." ? E([a.mclass]) : js(a.delim, a.size, e, a.mode, [a.mclass]),
  mathmlBuilder: (a) => {
    var e = [];
    a.delim !== "." && e.push(rt(a.delim, a.mode));
    var t = new P("mo", e);
    a.mclass === "mopen" || a.mclass === "mclose" ? t.setAttribute("fence", "true") : t.setAttribute("fence", "false"), t.setAttribute("stretchy", "true");
    var r = F(Aa[a.size]);
    return t.setAttribute("minsize", r), t.setAttribute("maxsize", r), t;
  }
});
function fn(a) {
  if (!a.body)
    throw new Error("Bug: The leftright ParseNode wasn't fully parsed.");
}
H({
  type: "leftright-right",
  names: ["\\right"],
  props: {
    numArgs: 1,
    primitive: !0
  },
  handler: (a, e) => {
    var t = a.parser.gullet.macros.get("\\current@color");
    if (t && typeof t != "string")
      throw new B("\\current@color set to non-string in \\right");
    return {
      type: "leftright-right",
      mode: a.parser.mode,
      delim: pr(e[0], a).text,
      color: t
      // undefined if not set via \color
    };
  }
});
H({
  type: "leftright",
  names: ["\\left"],
  props: {
    numArgs: 1,
    primitive: !0
  },
  handler: (a, e) => {
    var t = pr(e[0], a), r = a.parser;
    ++r.leftrightDepth;
    var i = r.parseExpression(!1);
    --r.leftrightDepth, r.expect("\\right", !1);
    var n = te(r.parseFunction(), "leftright-right");
    return {
      type: "leftright",
      mode: r.mode,
      body: i,
      left: t.text,
      right: n.delim,
      rightColor: n.color
    };
  },
  htmlBuilder: (a, e) => {
    fn(a);
    for (var t = Be(a.body, e, !0, ["mopen", "mclose"]), r = 0, i = 0, n = !1, l = 0; l < t.length; l++) {
      var u = t[l];
      pn(u) ? n = !0 : (r = Math.max(t[l].height, r), i = Math.max(t[l].depth, i));
    }
    r *= e.sizeMultiplier, i *= e.sizeMultiplier;
    var d;
    if (a.left === "." ? d = Ca(e, ["mopen"]) : d = Lr(a.left, r, i, e, a.mode, ["mopen"]), t.unshift(d), n)
      for (var p = 1; p < t.length; p++) {
        var f = t[p];
        if (pn(f)) {
          var b = f.isMiddle;
          t[p] = Lr(b.delim, r, i, b.options, a.mode, []);
        }
      }
    var S;
    if (a.right === ".")
      S = Ca(e, ["mclose"]);
    else {
      var w = a.rightColor ? e.withColor(a.rightColor) : e;
      S = Lr(a.right, r, i, w, a.mode, ["mclose"]);
    }
    return t.push(S), E(["minner"], t, e);
  },
  mathmlBuilder: (a, e) => {
    fn(a);
    var t = Ze(a.body, e);
    if (a.left !== ".") {
      var r = new P("mo", [rt(a.left, a.mode)]);
      r.setAttribute("fence", "true"), t.unshift(r);
    }
    if (a.right !== ".") {
      var i = new P("mo", [rt(a.right, a.mode)]);
      i.setAttribute("fence", "true"), a.rightColor && i.setAttribute("mathcolor", a.rightColor), t.push(i);
    }
    return Ai(t);
  }
});
H({
  type: "middle",
  names: ["\\middle"],
  props: {
    numArgs: 1,
    primitive: !0
  },
  handler: (a, e) => {
    var t = pr(e[0], a);
    if (!a.parser.leftrightDepth)
      throw new B("\\middle without preceding \\left", t);
    return {
      type: "middle",
      mode: a.parser.mode,
      delim: t.text
    };
  },
  htmlBuilder: (a, e) => {
    var t;
    return a.delim === "." ? t = Ca(e, []) : (t = js(a.delim, 1, e, a.mode, []), t.isMiddle = {
      delim: a.delim,
      options: e
    }), t;
  },
  mathmlBuilder: (a, e) => {
    var t = a.delim === "\\vert" || a.delim === "|" ? rt("|", "text") : rt(a.delim, a.mode), r = new P("mo", [t]);
    return r.setAttribute("fence", "true"), r.setAttribute("lspace", "0.05em"), r.setAttribute("rspace", "0.05em"), r;
  }
});
var fr = (a, e) => {
  var t = na(oe(a.body, e), e), r = a.label.slice(1), i = e.sizeMultiplier, n, l, u = wt(a.body);
  if (r === "sout")
    n = E(["stretchy", "sout"]), n.height = e.fontMetrics().defaultRuleThickness / i, l = -0.5 * e.fontMetrics().xHeight;
  else if (r === "phase") {
    var d = we({
      number: 0.6,
      unit: "pt"
    }, e), p = we({
      number: 0.35,
      unit: "ex"
    }, e), f = e.havingBaseSizing();
    i = i / f.sizeMultiplier;
    var b = t.height + t.depth + d + p;
    t.style.paddingLeft = F(b / 2 + d);
    var S = Math.floor(1e3 * b * i), w = S0(S), j = new xt([new jt("phase", w)], {
      width: "400em",
      height: F(S / 1e3),
      viewBox: "0 0 400000 " + S,
      preserveAspectRatio: "xMinYMin slice"
    });
    n = Et(["hide-tail"], [j], e), n.style.height = F(b), l = t.depth + d + p;
  } else {
    /cancel/.test(r) ? u || t.classes.push("cancel-pad") : r === "angl" ? t.classes.push("anglpad") : t.classes.push("boxpad");
    var R, N, I = 0;
    /box/.test(r) ? (I = Math.max(
      e.fontMetrics().fboxrule,
      // default
      e.minRuleThickness
    ), R = e.fontMetrics().fboxsep + (r === "colorbox" ? 0 : I), N = R) : r === "angl" ? (I = Math.max(e.fontMetrics().defaultRuleThickness, e.minRuleThickness), R = 4 * I, N = Math.max(0, 0.25 - t.depth)) : (R = u ? 0.2 : 0, N = R), n = sl(t, r, R, N, e), /fbox|boxed|fcolorbox/.test(r) ? (n.style.borderStyle = "solid", n.style.borderWidth = F(I)) : r === "angl" && I !== 0.049 && (n.style.borderTopWidth = F(I), n.style.borderRightWidth = F(I)), l = t.depth + N, a.backgroundColor && (n.style.backgroundColor = a.backgroundColor, a.borderColor && (n.style.borderColor = a.borderColor));
  }
  var O;
  if (a.backgroundColor)
    O = se({
      positionType: "individualShift",
      children: [
        // Put the color background behind inner;
        {
          type: "elem",
          elem: n,
          shift: l
        },
        {
          type: "elem",
          elem: t,
          shift: 0
        }
      ]
    });
  else {
    var k = /cancel|phase/.test(r) ? ["svg-align"] : [];
    O = se({
      positionType: "individualShift",
      children: [
        // Write the \cancel stroke on top of inner.
        {
          type: "elem",
          elem: t,
          shift: 0
        },
        {
          type: "elem",
          elem: n,
          shift: l,
          wrapperClasses: k
        }
      ]
    });
  }
  return /cancel/.test(r) && (O.height = t.height, O.depth = t.depth), /cancel/.test(r) && !u ? E(["mord", "cancel-lap"], [O], e) : E(["mord"], [O], e);
}, gr = (a, e) => {
  var t, r = new P(a.label.includes("colorbox") ? "mpadded" : "menclose", [he(a.body, e)]);
  switch (a.label) {
    case "\\cancel":
      r.setAttribute("notation", "updiagonalstrike");
      break;
    case "\\bcancel":
      r.setAttribute("notation", "downdiagonalstrike");
      break;
    case "\\phase":
      r.setAttribute("notation", "phasorangle");
      break;
    case "\\sout":
      r.setAttribute("notation", "horizontalstrike");
      break;
    case "\\fbox":
      r.setAttribute("notation", "box");
      break;
    case "\\angl":
      r.setAttribute("notation", "actuarial");
      break;
    case "\\fcolorbox":
    case "\\colorbox":
      if (t = e.fontMetrics().fboxsep * e.fontMetrics().ptPerEm, r.setAttribute("width", "+" + 2 * t + "pt"), r.setAttribute("height", "+" + 2 * t + "pt"), r.setAttribute("lspace", t + "pt"), r.setAttribute("voffset", t + "pt"), a.label === "\\fcolorbox") {
        var i = Math.max(
          e.fontMetrics().fboxrule,
          // default
          e.minRuleThickness
        );
        r.setAttribute("style", "border: " + F(i) + " solid " + a.borderColor);
      }
      break;
    case "\\xcancel":
      r.setAttribute("notation", "updiagonalstrike downdiagonalstrike");
      break;
  }
  return a.backgroundColor && r.setAttribute("mathbackground", a.backgroundColor), r;
};
H({
  type: "enclose",
  names: ["\\colorbox"],
  props: {
    numArgs: 2,
    allowedInText: !0,
    argTypes: ["color", "hbox"]
  },
  handler(a, e, t) {
    var {
      parser: r,
      funcName: i
    } = a, n = te(e[0], "color-token").color, l = e[1];
    return {
      type: "enclose",
      mode: r.mode,
      label: i,
      backgroundColor: n,
      body: l
    };
  },
  htmlBuilder: fr,
  mathmlBuilder: gr
});
H({
  type: "enclose",
  names: ["\\fcolorbox"],
  props: {
    numArgs: 3,
    allowedInText: !0,
    argTypes: ["color", "color", "hbox"]
  },
  handler(a, e, t) {
    var {
      parser: r,
      funcName: i
    } = a, n = te(e[0], "color-token").color, l = te(e[1], "color-token").color, u = e[2];
    return {
      type: "enclose",
      mode: r.mode,
      label: i,
      backgroundColor: l,
      borderColor: n,
      body: u
    };
  },
  htmlBuilder: fr,
  mathmlBuilder: gr
});
H({
  type: "enclose",
  names: ["\\fbox"],
  props: {
    numArgs: 1,
    argTypes: ["hbox"],
    allowedInText: !0
  },
  handler(a, e) {
    var {
      parser: t
    } = a;
    return {
      type: "enclose",
      mode: t.mode,
      label: "\\fbox",
      body: e[0]
    };
  }
});
H({
  type: "enclose",
  names: ["\\cancel", "\\bcancel", "\\xcancel", "\\phase"],
  props: {
    numArgs: 1
  },
  handler(a, e) {
    var {
      parser: t,
      funcName: r
    } = a, i = e[0];
    return {
      type: "enclose",
      mode: t.mode,
      label: r,
      body: i
    };
  },
  htmlBuilder: fr,
  mathmlBuilder: gr
});
H({
  type: "enclose",
  names: ["\\sout"],
  props: {
    numArgs: 1,
    allowedInText: !0
  },
  handler(a, e) {
    var {
      parser: t,
      funcName: r
    } = a;
    t.mode === "math" && t.settings.reportNonstrict("mathVsSout", "LaTeX's \\sout works only in text mode");
    var i = e[0];
    return {
      type: "enclose",
      mode: t.mode,
      label: r,
      body: i
    };
  },
  htmlBuilder: fr,
  mathmlBuilder: gr
});
H({
  type: "enclose",
  names: ["\\angl"],
  props: {
    numArgs: 1,
    argTypes: ["hbox"],
    allowedInText: !1
  },
  handler(a, e) {
    var {
      parser: t
    } = a;
    return {
      type: "enclose",
      mode: t.mode,
      label: "\\angl",
      body: e[0]
    };
  }
});
var Ds = {};
function ut(a) {
  for (var {
    type: e,
    names: t,
    props: r,
    handler: i,
    htmlBuilder: n,
    mathmlBuilder: l
  } = a, u = {
    type: e,
    numArgs: r.numArgs || 0,
    allowedInText: !1,
    numOptionalArgs: 0,
    handler: i
  }, d = 0; d < t.length; ++d)
    Ds[t[d]] = u;
  n && (tr[e] = n), l && (ar[e] = l);
}
var Bs = {};
function m(a, e) {
  Bs[a] = e;
}
class Ye {
  // End offset, zero-based exclusive.
  constructor(e, t, r) {
    this.lexer = void 0, this.start = void 0, this.end = void 0, this.lexer = e, this.start = t, this.end = r;
  }
  /**
   * Merges two `SourceLocation`s from location providers, given they are
   * provided in order of appearance.
   * - Returns the first one's location if only the first is provided.
   * - Returns a merged range of the first and the last if both are provided
   *   and their lexers match.
   * - Otherwise, returns null.
   */
  static range(e, t) {
    return t ? !e || !e.loc || !t.loc || e.loc.lexer !== t.loc.lexer ? null : new Ye(e.loc.lexer, e.loc.start, t.loc.end) : e && e.loc;
  }
}
class Ke {
  // used in \noexpand
  constructor(e, t) {
    this.text = void 0, this.loc = void 0, this.noexpand = void 0, this.treatAsRelax = void 0, this.text = e, this.loc = t;
  }
  /**
   * Given a pair of tokens (this and endToken), compute a `Token` encompassing
   * the whole input range enclosed by these two.
   */
  range(e, t) {
    return new Ke(t, Ye.range(this, e));
  }
}
function gn(a) {
  var e = [];
  a.consumeSpaces();
  var t = a.fetch().text;
  for (t === "\\relax" && (a.consume(), a.consumeSpaces(), t = a.fetch().text); t === "\\hline" || t === "\\hdashline"; )
    a.consume(), e.push(t === "\\hdashline"), a.consumeSpaces(), t = a.fetch().text;
  return e;
}
var vr = (a) => {
  var e = a.parser.settings;
  if (!e.displayMode)
    throw new B("{" + a.envName + "} can be used only in display mode.");
}, Tl = /* @__PURE__ */ new Set(["gather", "gather*"]);
function Ti(a) {
  if (!a.includes("ed"))
    return !a.includes("*");
}
function Bt(a, e, t) {
  var {
    hskipBeforeAndAfter: r,
    addJot: i,
    cols: n,
    arraystretch: l,
    colSeparationType: u,
    autoTag: d,
    singleRow: p,
    emptySingleRow: f,
    maxNumCols: b,
    leqno: S
  } = e;
  if (a.gullet.beginGroup(), p || a.gullet.macros.set("\\cr", "\\\\\\relax"), !l) {
    var w = a.gullet.expandMacroAsText("\\arraystretch");
    if (w == null)
      l = 1;
    else if (l = parseFloat(w), !l || l < 0)
      throw new B("Invalid \\arraystretch: " + w);
  }
  a.gullet.beginGroup();
  var j = [], R = [j], N = [], I = [], O = d != null ? [] : void 0;
  function k() {
    d && a.gullet.macros.set("\\@eqnsw", "1", !0);
  }
  function L() {
    O && (a.gullet.macros.get("\\df@tag") ? (O.push(a.subparse([new Ke("\\df@tag")])), a.gullet.macros.set("\\df@tag", void 0, !0)) : O.push(!!d && a.gullet.macros.get("\\@eqnsw") === "1"));
  }
  for (k(), I.push(gn(a)); ; ) {
    var V = a.parseExpression(!1, p ? "\\end" : "\\\\");
    a.gullet.endGroup(), a.gullet.beginGroup();
    var X = {
      type: "ordgroup",
      mode: a.mode,
      body: V
    };
    t && (X = {
      type: "styling",
      mode: a.mode,
      style: t,
      resetFont: !0,
      body: [X]
    }), j.push(X);
    var ae = a.fetch().text;
    if (ae === "&") {
      if (b && j.length === b) {
        if (p || u)
          throw new B("Too many tab characters: &", a.nextToken);
        a.settings.reportNonstrict("textEnv", "Too few columns specified in the {array} column argument.");
      }
      a.consume();
    } else if (ae === "\\end") {
      L(), j.length === 1 && X.type === "styling" && X.body.length === 1 && X.body[0].type === "ordgroup" && X.body[0].body.length === 0 && (R.length > 1 || !f) && R.pop(), I.length < R.length + 1 && I.push([]);
      break;
    } else if (ae === "\\\\") {
      a.consume();
      var G = void 0;
      a.gullet.future().text !== " " && (G = a.parseSizeGroup(!0)), N.push(G ? G.value : null), L(), I.push(gn(a)), j = [], R.push(j), k();
    } else
      throw new B("Expected & or \\\\ or \\cr or \\end", a.nextToken);
  }
  return a.gullet.endGroup(), a.gullet.endGroup(), {
    type: "array",
    mode: a.mode,
    addJot: i,
    arraystretch: l,
    body: R,
    cols: n,
    rowGaps: N,
    hskipBeforeAndAfter: r,
    hLinesBeforeRow: I,
    colSeparationType: u,
    tags: O,
    leqno: S
  };
}
function Mi(a) {
  return a.slice(0, 1) === "d" ? "display" : "text";
}
var dt = function(e, t) {
  var r, i, n = e.body.length, l = e.hLinesBeforeRow, u = 0, d = new Array(n), p = [], f = Math.max(
    // From LaTeX \showthe\arrayrulewidth. Equals 0.04 em.
    t.fontMetrics().arrayRuleWidth,
    t.minRuleThickness
  ), b = 1 / t.fontMetrics().ptPerEm, S = 5 * b;
  if (e.colSeparationType && e.colSeparationType === "small") {
    var w = t.havingStyle(ee.SCRIPT).sizeMultiplier;
    S = 0.2778 * (w / t.sizeMultiplier);
  }
  var j = e.colSeparationType === "CD" ? we({
    number: 3,
    unit: "ex"
  }, t) : 12 * b, R = 3 * b, N = e.arraystretch * j, I = 0.7 * N, O = 0.3 * N, k = 0;
  function L(_t) {
    for (var Ft = 0; Ft < _t.length; ++Ft)
      Ft > 0 && (k += 0.25), p.push({
        pos: k,
        isDashed: _t[Ft]
      });
  }
  for (L(l[0]), r = 0; r < e.body.length; ++r) {
    var V = e.body[r], X = I, ae = O;
    u < V.length && (u = V.length);
    var G = {
      cells: new Array(V.length),
      height: 0,
      depth: 0,
      pos: 0
    };
    for (i = 0; i < V.length; ++i) {
      var J = oe(V[i], t);
      ae < J.depth && (ae = J.depth), X < J.height && (X = J.height), G.cells[i] = J;
    }
    var me = e.rowGaps[r], _ = 0;
    me && (_ = we(me, t), _ > 0 && (_ += O, ae < _ && (ae = _), _ = 0)), e.addJot && r < e.body.length - 1 && (ae += R), G.height = X, G.depth = ae, k += X, G.pos = k, k += ae + _, d[r] = G, L(l[r + 1]);
  }
  var ne = k / 2 + t.fontMetrics().axisHeight, Pe = e.cols || [], Ae = [], Te, Ve, Me = [];
  if (e.tags && e.tags.some((_t) => _t))
    for (r = 0; r < n; ++r) {
      var Je = d[r], mt = Je.pos - ne, ye = e.tags[r], ze = void 0;
      ye === !0 ? ze = E(["eqn-num"], [], t) : ye === !1 ? ze = E([], [], t) : ze = E([], Be(ye, t, !0), t), ze.depth = Je.depth, ze.height = Je.height, Me.push({
        type: "elem",
        elem: ze,
        shift: mt
      });
    }
  for (
    i = 0, Ve = 0;
    // Continue while either there are more columns or more column
    // descriptions, so trailing separators don't get lost.
    i < u || Ve < Pe.length;
    ++i, ++Ve
  ) {
    for (var U, Le = Pe[Ve], kt = !0; ((C = Le) == null ? void 0 : C.type) === "separator"; ) {
      var C;
      if (kt || (Te = E(["arraycolsep"], []), Te.style.width = F(t.fontMetrics().doubleRuleSep), Ae.push(Te)), Le.separator === "|" || Le.separator === ":") {
        var Q = Le.separator === "|" ? "solid" : "dashed", ue = E(["vertical-separator"], [], t);
        ue.style.height = F(k), ue.style.borderRightWidth = F(f), ue.style.borderRightStyle = Q, ue.style.margin = "0 " + F(-f / 2);
        var pe = k - ne;
        pe && (ue.style.verticalAlign = F(-pe)), Ae.push(ue);
      } else
        throw new B("Invalid separator type: " + Le.separator);
      Ve++, Le = Pe[Ve], kt = !1;
    }
    if (!(i >= u)) {
      var ke = void 0;
      if (i > 0 || e.hskipBeforeAndAfter) {
        var Qe, Pt;
        ke = (Qe = (Pt = Le) == null ? void 0 : Pt.pregap) != null ? Qe : S, ke !== 0 && (Te = E(["arraycolsep"], []), Te.style.width = F(ke), Ae.push(Te));
      }
      var Ct = [];
      for (r = 0; r < n; ++r) {
        var pt = d[r], et = pt.cells[i];
        if (et) {
          var Kt = pt.pos - ne;
          et.depth = pt.depth, et.height = pt.height, Ct.push({
            type: "elem",
            elem: et,
            shift: Kt
          });
        }
      }
      var It = se({
        positionType: "individualShift",
        children: Ct
      }), Ba = E(["col-align-" + (((U = Le) == null ? void 0 : U.align) || "c")], [It]);
      if (Ae.push(Ba), i < u - 1 || e.hskipBeforeAndAfter) {
        var ha, Lt;
        ke = (ha = (Lt = Le) == null ? void 0 : Lt.postgap) != null ? ha : S, ke !== 0 && (Te = E(["arraycolsep"], []), Te.style.width = F(ke), Ae.push(Te));
      }
    }
  }
  var Xt = E(["mtable"], Ae);
  if (p.length > 0) {
    for (var wr = ia("hline", t, f), ma = ia("hdashline", t, f), pa = [{
      type: "elem",
      elem: Xt,
      shift: 0
    }]; p.length > 0; ) {
      var Pa = p.pop(), fa = Pa.pos - ne;
      Pa.isDashed ? pa.push({
        type: "elem",
        elem: ma,
        shift: fa
      }) : pa.push({
        type: "elem",
        elem: wr,
        shift: fa
      });
    }
    Xt = se({
      positionType: "individualShift",
      children: pa
    });
  }
  if (Me.length === 0)
    return E(["mord"], [Xt], t);
  var Ia = se({
    positionType: "individualShift",
    children: Me
  }), La = E(["tag"], [Ia], t);
  return St([Xt, La]);
}, Ml = {
  c: "center ",
  l: "left ",
  r: "right "
}, ht = function(e, t) {
  for (var r = [], i = new P("mtd", [], ["mtr-glue"]), n = new P("mtd", [], ["mml-eqn-num"]), l = 0; l < e.body.length; l++) {
    for (var u = e.body[l], d = [], p = 0; p < u.length; p++)
      d.push(new P("mtd", [he(u[p], t)]));
    e.tags && e.tags[l] && (d.unshift(i), d.push(i), e.leqno ? d.unshift(n) : d.push(n)), r.push(new P("mtr", d));
  }
  var f = new P("mtable", r), b = e.arraystretch === 0.5 ? 0.1 : 0.16 + e.arraystretch - 1 + (e.addJot ? 0.09 : 0);
  f.setAttribute("rowspacing", F(b));
  var S = "", w = "";
  if (e.cols && e.cols.length > 0) {
    var j = e.cols, R = "", N = !1, I = 0, O = j.length;
    j[0].type === "separator" && (S += "top ", I = 1), j[j.length - 1].type === "separator" && (S += "bottom ", O -= 1);
    for (var k = I; k < O; k++) {
      var L = j[k];
      L.type === "align" ? (w += Ml[L.align], N && (R += "none "), N = !0) : L.type === "separator" && N && (R += L.separator === "|" ? "solid " : "dashed ", N = !1);
    }
    f.setAttribute("columnalign", w.trim()), /[sd]/.test(R) && f.setAttribute("columnlines", R.trim());
  }
  if (e.colSeparationType === "align") {
    for (var V = e.cols || [], X = "", ae = 1; ae < V.length; ae++)
      X += ae % 2 ? "0em " : "1em ";
    f.setAttribute("columnspacing", X.trim());
  } else e.colSeparationType === "alignat" || e.colSeparationType === "gather" ? f.setAttribute("columnspacing", "0em") : e.colSeparationType === "small" ? f.setAttribute("columnspacing", "0.2778em") : e.colSeparationType === "CD" ? f.setAttribute("columnspacing", "0.5em") : f.setAttribute("columnspacing", "1em");
  var G = "", J = e.hLinesBeforeRow;
  S += J[0].length > 0 ? "left " : "", S += J[J.length - 1].length > 0 ? "right " : "";
  for (var me = 1; me < J.length - 1; me++)
    G += J[me].length === 0 ? "none " : J[me][0] ? "dashed " : "solid ";
  return /[sd]/.test(G) && f.setAttribute("rowlines", G.trim()), S !== "" && (f = new P("menclose", [f]), f.setAttribute("notation", S.trim())), e.arraystretch && e.arraystretch < 1 && (f = new P("mstyle", [f]), f.setAttribute("scriptlevel", "1")), f;
}, Ps = function(e, t) {
  e.envName.includes("ed") || vr(e);
  var r = [], i = e.envName.includes("at") ? "alignat" : "align", n = e.envName === "split", l = Bt(e.parser, {
    cols: r,
    addJot: !0,
    autoTag: n ? void 0 : Ti(e.envName),
    emptySingleRow: !0,
    colSeparationType: i,
    maxNumCols: n ? 2 : void 0,
    leqno: e.parser.settings.leqno
  }, "display"), u = 0, d = 0, p = {
    type: "ordgroup",
    mode: e.mode,
    body: []
  };
  if (t[0] && t[0].type === "ordgroup") {
    for (var f = "", b = 0; b < t[0].body.length; b++) {
      var S = te(t[0].body[b], "textord");
      f += S.text;
    }
    u = Number(f), d = u * 2;
  }
  var w = !d;
  l.body.forEach(function(I) {
    for (var O = 1; O < I.length; O += 2) {
      var k = te(I[O], "styling"), L = te(k.body[0], "ordgroup");
      L.body.unshift(p);
    }
    if (w)
      d < I.length && (d = I.length);
    else {
      var V = I.length / 2;
      if (u < V)
        throw new B("Too many math in a row: " + ("expected " + u + ", but got " + V), I[0]);
    }
  });
  for (var j = 0; j < d; ++j) {
    var R = "r", N = 0;
    j % 2 === 1 ? R = "l" : j > 0 && w && (N = 1), r[j] = {
      type: "align",
      align: R,
      pregap: N,
      postgap: 0
    };
  }
  return l.colSeparationType = w ? "align" : "alignat", l;
};
ut({
  type: "array",
  names: ["array", "darray"],
  props: {
    numArgs: 1
  },
  handler(a, e) {
    var t = hr(e[0]), r = t ? [e[0]] : te(e[0], "ordgroup").body, i = r.map(function(l) {
      var u = dr(l), d = u.text;
      if ("lcr".includes(d))
        return {
          type: "align",
          align: d
        };
      if (d === "|")
        return {
          type: "separator",
          separator: "|"
        };
      if (d === ":")
        return {
          type: "separator",
          separator: ":"
        };
      throw new B("Unknown column alignment: " + d, l);
    }), n = {
      cols: i,
      hskipBeforeAndAfter: !0,
      // \@preamble in lttab.dtx
      maxNumCols: i.length
    };
    return Bt(a.parser, n, Mi(a.envName));
  },
  htmlBuilder: dt,
  mathmlBuilder: ht
});
ut({
  type: "array",
  names: ["matrix", "pmatrix", "bmatrix", "Bmatrix", "vmatrix", "Vmatrix", "matrix*", "pmatrix*", "bmatrix*", "Bmatrix*", "vmatrix*", "Vmatrix*"],
  props: {
    numArgs: 0
  },
  handler(a) {
    var e = {
      matrix: null,
      pmatrix: ["(", ")"],
      bmatrix: ["[", "]"],
      Bmatrix: ["\\{", "\\}"],
      vmatrix: ["|", "|"],
      Vmatrix: ["\\Vert", "\\Vert"]
    }[a.envName.replace("*", "")], t = "c", r = {
      hskipBeforeAndAfter: !1,
      cols: [{
        type: "align",
        align: t
      }]
    };
    if (a.envName.charAt(a.envName.length - 1) === "*") {
      var i = a.parser;
      if (i.consumeSpaces(), i.fetch().text === "[") {
        if (i.consume(), i.consumeSpaces(), t = i.fetch().text, !"lcr".includes(t))
          throw new B("Expected l or c or r", i.nextToken);
        i.consume(), i.consumeSpaces(), i.expect("]"), i.consume(), r.cols = [{
          type: "align",
          align: t
        }];
      }
    }
    var n = Bt(a.parser, r, Mi(a.envName)), l = Math.max(0, ...n.body.map((u) => u.length));
    return n.cols = new Array(l).fill({
      type: "align",
      align: t
    }), e ? {
      type: "leftright",
      mode: a.mode,
      body: [n],
      left: e[0],
      right: e[1],
      rightColor: void 0
      // \right uninfluenced by \color in array
    } : n;
  },
  htmlBuilder: dt,
  mathmlBuilder: ht
});
ut({
  type: "array",
  names: ["smallmatrix"],
  props: {
    numArgs: 0
  },
  handler(a) {
    var e = {
      arraystretch: 0.5
    }, t = Bt(a.parser, e, "script");
    return t.colSeparationType = "small", t;
  },
  htmlBuilder: dt,
  mathmlBuilder: ht
});
ut({
  type: "array",
  names: ["subarray"],
  props: {
    numArgs: 1
  },
  handler(a, e) {
    var t = hr(e[0]), r = t ? [e[0]] : te(e[0], "ordgroup").body, i = r.map(function(u) {
      var d = dr(u), p = d.text;
      if ("lc".includes(p))
        return {
          type: "align",
          align: p
        };
      throw new B("Unknown column alignment: " + p, u);
    });
    if (i.length > 1)
      throw new B("{subarray} can contain only one column");
    var n = {
      cols: i,
      hskipBeforeAndAfter: !1,
      arraystretch: 0.5
    }, l = Bt(a.parser, n, "script");
    if (l.body.length > 0 && l.body[0].length > 1)
      throw new B("{subarray} can contain only one column");
    return l;
  },
  htmlBuilder: dt,
  mathmlBuilder: ht
});
ut({
  type: "array",
  names: ["cases", "dcases", "rcases", "drcases"],
  props: {
    numArgs: 0
  },
  handler(a) {
    var e = {
      arraystretch: 1.2,
      cols: [{
        type: "align",
        align: "l",
        pregap: 0,
        // TODO(kevinb) get the current style.
        // For now we use the metrics for TEXT style which is what we were
        // doing before.  Before attempting to get the current style we
        // should look at TeX's behavior especially for \over and matrices.
        postgap: 1
        /* 1em quad */
      }, {
        type: "align",
        align: "l",
        pregap: 0,
        postgap: 0
      }]
    }, t = Bt(a.parser, e, Mi(a.envName));
    return {
      type: "leftright",
      mode: a.mode,
      body: [t],
      left: a.envName.includes("r") ? "." : "\\{",
      right: a.envName.includes("r") ? "\\}" : ".",
      rightColor: void 0
    };
  },
  htmlBuilder: dt,
  mathmlBuilder: ht
});
ut({
  type: "array",
  names: ["align", "align*", "aligned", "split"],
  props: {
    numArgs: 0
  },
  handler: Ps,
  htmlBuilder: dt,
  mathmlBuilder: ht
});
ut({
  type: "array",
  names: ["gathered", "gather", "gather*"],
  props: {
    numArgs: 0
  },
  handler(a) {
    Tl.has(a.envName) && vr(a);
    var e = {
      cols: [{
        type: "align",
        align: "c"
      }],
      addJot: !0,
      colSeparationType: "gather",
      autoTag: Ti(a.envName),
      emptySingleRow: !0,
      leqno: a.parser.settings.leqno
    };
    return Bt(a.parser, e, "display");
  },
  htmlBuilder: dt,
  mathmlBuilder: ht
});
ut({
  type: "array",
  names: ["alignat", "alignat*", "alignedat"],
  props: {
    numArgs: 1
  },
  handler: Ps,
  htmlBuilder: dt,
  mathmlBuilder: ht
});
ut({
  type: "array",
  names: ["equation", "equation*"],
  props: {
    numArgs: 0
  },
  handler(a) {
    vr(a);
    var e = {
      autoTag: Ti(a.envName),
      emptySingleRow: !0,
      singleRow: !0,
      maxNumCols: 1,
      leqno: a.parser.settings.leqno
    };
    return Bt(a.parser, e, "display");
  },
  htmlBuilder: dt,
  mathmlBuilder: ht
});
ut({
  type: "array",
  names: ["CD"],
  props: {
    numArgs: 0
  },
  handler(a) {
    return vr(a), pl(a.parser);
  },
  htmlBuilder: dt,
  mathmlBuilder: ht
});
m("\\nonumber", "\\gdef\\@eqnsw{0}");
m("\\notag", "\\nonumber");
H({
  type: "text",
  // Doesn't matter what this is.
  names: ["\\hline", "\\hdashline"],
  props: {
    numArgs: 0,
    allowedInText: !0,
    allowedInMath: !0
  },
  handler(a, e) {
    throw new B(a.funcName + " valid only within array environment");
  }
});
var vn = Ds;
H({
  type: "environment",
  names: ["\\begin", "\\end"],
  props: {
    numArgs: 1,
    argTypes: ["text"]
  },
  handler(a, e) {
    var {
      parser: t,
      funcName: r
    } = a, i = e[0];
    if (i.type !== "ordgroup")
      throw new B("Invalid environment name", i);
    for (var n = "", l = 0; l < i.body.length; ++l)
      n += te(i.body[l], "textord").text;
    if (r === "\\begin") {
      if (!vn.hasOwnProperty(n))
        throw new B("No such environment: " + n, i);
      var u = vn[n], {
        args: d,
        optArgs: p
      } = t.parseArguments("\\begin{" + n + "}", u), f = {
        mode: t.mode,
        envName: n,
        parser: t
      }, b = u.handler(f, d, p);
      t.expect("\\end", !1);
      var S = t.nextToken, w = te(t.parseFunction(), "environment");
      if (w.name !== n)
        throw new B("Mismatch: \\begin{" + n + "} matched by \\end{" + w.name + "}", S);
      return b;
    }
    return {
      type: "environment",
      mode: t.mode,
      name: n,
      nameGroup: i
    };
  }
});
var Is = (a, e) => {
  var t = a.font, r = e.withFont(t);
  return oe(a.body, r);
}, Ls = (a, e) => {
  var t = a.font, r = e.withFont(t);
  return he(a.body, r);
}, bn = {
  "\\Bbb": "\\mathbb",
  "\\bold": "\\mathbf",
  "\\frak": "\\mathfrak"
};
H({
  type: "font",
  names: [
    // styles, except \boldsymbol defined below
    "\\mathrm",
    "\\mathit",
    "\\mathbf",
    "\\mathnormal",
    "\\mathsfit",
    // families
    "\\mathbb",
    "\\mathcal",
    "\\mathfrak",
    "\\mathscr",
    "\\mathsf",
    "\\mathtt",
    // aliases, except \bm defined below
    "\\Bbb",
    "\\bold",
    "\\frak"
  ],
  props: {
    numArgs: 1,
    allowedInArgument: !0
  },
  handler: (a, e) => {
    var {
      parser: t,
      funcName: r
    } = a, i = rr(e[0]), n = r;
    return n in bn && (n = bn[n]), {
      type: "font",
      mode: t.mode,
      font: n.slice(1),
      body: i
    };
  },
  htmlBuilder: Is,
  mathmlBuilder: Ls
});
H({
  type: "mclass",
  names: ["\\boldsymbol", "\\bm"],
  props: {
    numArgs: 1
  },
  handler: (a, e) => {
    var {
      parser: t
    } = a, r = e[0];
    return {
      type: "mclass",
      mode: t.mode,
      mclass: mr(r),
      body: [{
        type: "font",
        mode: t.mode,
        font: "boldsymbol",
        body: r
      }],
      isCharacterBox: wt(r)
    };
  }
});
H({
  type: "font",
  names: ["\\rm", "\\sf", "\\tt", "\\bf", "\\it", "\\cal"],
  props: {
    numArgs: 0,
    allowedInText: !0
  },
  handler: (a, e) => {
    var {
      parser: t,
      funcName: r,
      breakOnTokenText: i
    } = a, {
      mode: n
    } = t, l = t.parseExpression(!0, i);
    return {
      type: "font",
      mode: n,
      font: "math" + r.slice(1),
      body: {
        type: "ordgroup",
        mode: t.mode,
        body: l
      }
    };
  },
  htmlBuilder: Is,
  mathmlBuilder: Ls
});
var zl = (a, e) => {
  var t = e.style, r = t.fracNum(), i = t.fracDen(), n;
  n = e.havingStyle(r);
  var l = oe(a.numer, n, e);
  if (a.continued) {
    var u = 8.5 / e.fontMetrics().ptPerEm, d = 3.5 / e.fontMetrics().ptPerEm;
    l.height = l.height < u ? u : l.height, l.depth = l.depth < d ? d : l.depth;
  }
  n = e.havingStyle(i);
  var p = oe(a.denom, n, e), f, b, S;
  a.hasBarLine ? (a.barSize ? (b = we(a.barSize, e), f = ia("frac-line", e, b)) : f = ia("frac-line", e), b = f.height, S = f.height) : (f = null, b = 0, S = e.fontMetrics().defaultRuleThickness);
  var w, j, R;
  t.size === ee.DISPLAY.size ? (w = e.fontMetrics().num1, b > 0 ? j = 3 * S : j = 7 * S, R = e.fontMetrics().denom1) : (b > 0 ? (w = e.fontMetrics().num2, j = S) : (w = e.fontMetrics().num3, j = 3 * S), R = e.fontMetrics().denom2);
  var N;
  if (f) {
    var O = e.fontMetrics().axisHeight;
    w - l.depth - (O + 0.5 * b) < j && (w += j - (w - l.depth - (O + 0.5 * b))), O - 0.5 * b - (p.height - R) < j && (R += j - (O - 0.5 * b - (p.height - R)));
    var k = -(O - 0.5 * b);
    N = se({
      positionType: "individualShift",
      children: [{
        type: "elem",
        elem: p,
        shift: R
      }, {
        type: "elem",
        elem: f,
        shift: k
      }, {
        type: "elem",
        elem: l,
        shift: -w
      }]
    });
  } else {
    var I = w - l.depth - (p.height - R);
    I < j && (w += 0.5 * (j - I), R += 0.5 * (j - I)), N = se({
      positionType: "individualShift",
      children: [{
        type: "elem",
        elem: p,
        shift: R
      }, {
        type: "elem",
        elem: l,
        shift: -w
      }]
    });
  }
  n = e.havingStyle(t), N.height *= n.sizeMultiplier / e.sizeMultiplier, N.depth *= n.sizeMultiplier / e.sizeMultiplier;
  var L;
  t.size === ee.DISPLAY.size ? L = e.fontMetrics().delim1 : t.size === ee.SCRIPTSCRIPT.size ? L = e.havingStyle(ee.SCRIPT).fontMetrics().delim2 : L = e.fontMetrics().delim2;
  var V, X;
  return a.leftDelim == null ? V = Ca(e, ["mopen"]) : V = ui(a.leftDelim, L, !0, e.havingStyle(t), a.mode, ["mopen"]), a.continued ? X = E([]) : a.rightDelim == null ? X = Ca(e, ["mclose"]) : X = ui(a.rightDelim, L, !0, e.havingStyle(t), a.mode, ["mclose"]), E(["mord"].concat(n.sizingClasses(e)), [V, E(["mfrac"], [N]), X], e);
}, ql = (a, e) => {
  var t = new P("mfrac", [he(a.numer, e), he(a.denom, e)]);
  if (!a.hasBarLine)
    t.setAttribute("linethickness", "0px");
  else if (a.barSize) {
    var r = we(a.barSize, e);
    t.setAttribute("linethickness", F(r));
  }
  if (a.leftDelim != null || a.rightDelim != null) {
    var i = [];
    if (a.leftDelim != null) {
      var n = new P("mo", [new Ee(a.leftDelim.replace("\\", ""))]);
      n.setAttribute("fence", "true"), i.push(n);
    }
    if (i.push(t), a.rightDelim != null) {
      var l = new P("mo", [new Ee(a.rightDelim.replace("\\", ""))]);
      l.setAttribute("fence", "true"), i.push(l);
    }
    return Ai(i);
  }
  return t;
}, Fs = (a, e) => {
  if (!e)
    return a;
  var t = {
    type: "styling",
    mode: a.mode,
    style: e,
    body: [a]
  };
  return t;
};
H({
  type: "genfrac",
  names: [
    "\\cfrac",
    "\\dfrac",
    "\\frac",
    "\\tfrac",
    "\\dbinom",
    "\\binom",
    "\\tbinom",
    "\\\\atopfrac",
    // can’t be entered directly
    "\\\\bracefrac",
    "\\\\brackfrac"
    // ditto
  ],
  props: {
    numArgs: 2,
    allowedInArgument: !0
  },
  handler: (a, e) => {
    var {
      parser: t,
      funcName: r
    } = a, i = e[0], n = e[1], l, u = null, d = null;
    switch (r) {
      case "\\cfrac":
      case "\\dfrac":
      case "\\frac":
      case "\\tfrac":
        l = !0;
        break;
      case "\\\\atopfrac":
        l = !1;
        break;
      case "\\dbinom":
      case "\\binom":
      case "\\tbinom":
        l = !1, u = "(", d = ")";
        break;
      case "\\\\bracefrac":
        l = !1, u = "\\{", d = "\\}";
        break;
      case "\\\\brackfrac":
        l = !1, u = "[", d = "]";
        break;
      default:
        throw new Error("Unrecognized genfrac command");
    }
    var p = r === "\\cfrac", f = null;
    return p || r.startsWith("\\d") ? f = "display" : r.startsWith("\\t") && (f = "text"), Fs({
      type: "genfrac",
      mode: t.mode,
      numer: i,
      denom: n,
      continued: p,
      hasBarLine: l,
      leftDelim: u,
      rightDelim: d,
      barSize: null
    }, f);
  },
  htmlBuilder: zl,
  mathmlBuilder: ql
});
H({
  type: "infix",
  names: ["\\over", "\\choose", "\\atop", "\\brace", "\\brack"],
  props: {
    numArgs: 0,
    infix: !0
  },
  handler(a) {
    var {
      parser: e,
      funcName: t,
      token: r
    } = a, i;
    switch (t) {
      case "\\over":
        i = "\\frac";
        break;
      case "\\choose":
        i = "\\binom";
        break;
      case "\\atop":
        i = "\\\\atopfrac";
        break;
      case "\\brace":
        i = "\\\\bracefrac";
        break;
      case "\\brack":
        i = "\\\\brackfrac";
        break;
      default:
        throw new Error("Unrecognized infix genfrac command");
    }
    return {
      type: "infix",
      mode: e.mode,
      replaceWith: i,
      token: r
    };
  }
});
var yn = ["display", "text", "script", "scriptscript"], xn = function(e) {
  var t = null;
  return e.length > 0 && (t = e, t = t === "." ? null : t), t;
};
H({
  type: "genfrac",
  names: ["\\genfrac"],
  props: {
    numArgs: 6,
    allowedInArgument: !0,
    argTypes: ["math", "math", "size", "text", "math", "math"]
  },
  handler(a, e) {
    var {
      parser: t
    } = a, r = e[4], i = e[5], n = rr(e[0]), l = n.type === "atom" && n.family === "open" ? xn(n.text) : null, u = rr(e[1]), d = u.type === "atom" && u.family === "close" ? xn(u.text) : null, p = te(e[2], "size"), f, b = null;
    p.isBlank ? f = !0 : (b = p.value, f = b.number > 0);
    var S = null, w = e[3];
    if (w.type === "ordgroup") {
      if (w.body.length > 0) {
        var j = te(w.body[0], "textord");
        S = yn[Number(j.text)];
      }
    } else
      w = te(w, "textord"), S = yn[Number(w.text)];
    return Fs({
      type: "genfrac",
      mode: t.mode,
      numer: r,
      denom: i,
      continued: !1,
      hasBarLine: f,
      barSize: b,
      leftDelim: l,
      rightDelim: d
    }, S);
  }
});
H({
  type: "infix",
  names: ["\\above"],
  props: {
    numArgs: 1,
    argTypes: ["size"],
    infix: !0
  },
  handler(a, e) {
    var {
      parser: t,
      funcName: r,
      token: i
    } = a;
    return {
      type: "infix",
      mode: t.mode,
      replaceWith: "\\\\abovefrac",
      size: te(e[0], "size").value,
      token: i
    };
  }
});
H({
  type: "genfrac",
  names: ["\\\\abovefrac"],
  props: {
    numArgs: 3,
    argTypes: ["math", "size", "math"]
  },
  handler: (a, e) => {
    var {
      parser: t,
      funcName: r
    } = a, i = e[0], n = te(e[1], "infix").size;
    if (!n)
      throw new Error("\\\\abovefrac expected size, but got " + String(n));
    var l = e[2], u = n.number > 0;
    return {
      type: "genfrac",
      mode: t.mode,
      numer: i,
      denom: l,
      continued: !1,
      hasBarLine: u,
      barSize: n,
      leftDelim: null,
      rightDelim: null
    };
  }
});
var Ns = (a, e) => {
  var t = e.style, r, i;
  a.type === "supsub" ? (r = a.sup ? oe(a.sup, e.havingStyle(t.sup()), e) : oe(a.sub, e.havingStyle(t.sub()), e), i = te(a.base, "horizBrace")) : i = te(a, "horizBrace");
  var n = oe(i.base, e.havingBaseStyle(ee.DISPLAY)), l = ur(i, e), u;
  if (i.isOver ? u = se({
    positionType: "firstBaseline",
    children: [{
      type: "elem",
      elem: n
    }, {
      type: "kern",
      size: 0.1
    }, {
      type: "elem",
      elem: l,
      wrapperClasses: ["svg-align"]
    }]
  }) : u = se({
    positionType: "bottom",
    positionData: n.depth + 0.1 + l.height,
    children: [{
      type: "elem",
      elem: l,
      wrapperClasses: ["svg-align"]
    }, {
      type: "kern",
      size: 0.1
    }, {
      type: "elem",
      elem: n
    }]
  }), r) {
    var d = E(["minner", i.isOver ? "mover" : "munder"], [u], e);
    i.isOver ? u = se({
      positionType: "firstBaseline",
      children: [{
        type: "elem",
        elem: d
      }, {
        type: "kern",
        size: 0.2
      }, {
        type: "elem",
        elem: r
      }]
    }) : u = se({
      positionType: "bottom",
      positionData: d.depth + 0.2 + r.height + r.depth,
      children: [{
        type: "elem",
        elem: r
      }, {
        type: "kern",
        size: 0.2
      }, {
        type: "elem",
        elem: d
      }]
    });
  }
  return E(["minner", i.isOver ? "mover" : "munder"], [u], e);
}, jl = (a, e) => {
  var t = cr(a.label);
  return new P(a.isOver ? "mover" : "munder", [he(a.base, e), t]);
};
H({
  type: "horizBrace",
  names: ["\\overbrace", "\\underbrace", "\\overbracket", "\\underbracket"],
  props: {
    numArgs: 1
  },
  handler(a, e) {
    var {
      parser: t,
      funcName: r
    } = a;
    return {
      type: "horizBrace",
      mode: t.mode,
      label: r,
      isOver: r.includes("\\over"),
      base: e[0]
    };
  },
  htmlBuilder: Ns,
  mathmlBuilder: jl
});
H({
  type: "href",
  names: ["\\href"],
  props: {
    numArgs: 2,
    argTypes: ["url", "original"],
    allowedInText: !0
  },
  handler: (a, e) => {
    var {
      parser: t
    } = a, r = e[1], i = te(e[0], "url").url;
    return t.settings.isTrusted({
      command: "\\href",
      url: i
    }) ? {
      type: "href",
      mode: t.mode,
      href: i,
      body: je(r)
    } : t.formatUnsupportedCmd("\\href");
  },
  htmlBuilder: (a, e) => {
    var t = Be(a.body, e, !1);
    return W0(a.href, [], t, e);
  },
  mathmlBuilder: (a, e) => {
    var t = Rt(a.body, e);
    return t instanceof P || (t = new P("mrow", [t])), t.setAttribute("href", a.href), t;
  }
});
H({
  type: "href",
  names: ["\\url"],
  props: {
    numArgs: 1,
    argTypes: ["url"],
    allowedInText: !0
  },
  handler: (a, e) => {
    var {
      parser: t
    } = a, r = te(e[0], "url").url;
    if (!t.settings.isTrusted({
      command: "\\url",
      url: r
    }))
      return t.formatUnsupportedCmd("\\url");
    for (var i = [], n = 0; n < r.length; n++) {
      var l = r[n];
      l === "~" && (l = "\\textasciitilde"), i.push({
        type: "textord",
        mode: "text",
        text: l
      });
    }
    var u = {
      type: "text",
      mode: t.mode,
      font: "\\texttt",
      body: i
    };
    return {
      type: "href",
      mode: t.mode,
      href: r,
      body: je(u)
    };
  }
});
H({
  type: "hbox",
  names: ["\\hbox"],
  props: {
    numArgs: 1,
    argTypes: ["text"],
    allowedInText: !0,
    primitive: !0
  },
  handler(a, e) {
    var {
      parser: t
    } = a;
    return {
      type: "hbox",
      mode: t.mode,
      body: je(e[0])
    };
  },
  htmlBuilder(a, e) {
    var t = Be(a.body, e.withFont(""), !1);
    return St(t);
  },
  mathmlBuilder(a, e) {
    return new P("mrow", Ze(a.body, e.withFont("")));
  }
});
H({
  type: "html",
  names: ["\\htmlClass", "\\htmlId", "\\htmlStyle", "\\htmlData"],
  props: {
    numArgs: 2,
    argTypes: ["raw", "original"],
    allowedInText: !0
  },
  handler: (a, e) => {
    var {
      parser: t,
      funcName: r,
      token: i
    } = a, n = te(e[0], "raw").string, l = e[1];
    t.settings.strict && t.settings.reportNonstrict("htmlExtension", "HTML extension is disabled on strict mode");
    var u, d = {};
    switch (r) {
      case "\\htmlClass":
        d.class = n, u = {
          command: "\\htmlClass",
          class: n
        };
        break;
      case "\\htmlId":
        d.id = n, u = {
          command: "\\htmlId",
          id: n
        };
        break;
      case "\\htmlStyle":
        d.style = n, u = {
          command: "\\htmlStyle",
          style: n
        };
        break;
      case "\\htmlData": {
        for (var p = n.split(","), f = 0; f < p.length; f++) {
          var b = p[f], S = b.indexOf("=");
          if (S < 0)
            throw new B("\\htmlData key/value '" + b + "' missing equals sign");
          var w = b.slice(0, S), j = b.slice(S + 1);
          d["data-" + w.trim()] = j;
        }
        u = {
          command: "\\htmlData",
          attributes: d
        };
        break;
      }
      default:
        throw new Error("Unrecognized html command");
    }
    return t.settings.isTrusted(u) ? {
      type: "html",
      mode: t.mode,
      attributes: d,
      body: je(l)
    } : t.formatUnsupportedCmd(r);
  },
  htmlBuilder: (a, e) => {
    var t = Be(a.body, e, !1), r = ["enclosing"];
    a.attributes.class && r.push(...a.attributes.class.trim().split(/\s+/));
    var i = E(r, t, e);
    for (var n in a.attributes)
      n !== "class" && a.attributes.hasOwnProperty(n) && i.setAttribute(n, a.attributes[n]);
    return i;
  },
  mathmlBuilder: (a, e) => Rt(a.body, e)
});
H({
  type: "htmlmathml",
  names: ["\\html@mathml"],
  props: {
    numArgs: 2,
    allowedInArgument: !0,
    allowedInText: !0
  },
  handler: (a, e) => {
    var {
      parser: t
    } = a;
    return {
      type: "htmlmathml",
      mode: t.mode,
      html: je(e[0]),
      mathml: je(e[1])
    };
  },
  htmlBuilder: (a, e) => {
    var t = Be(a.html, e, !1);
    return St(t);
  },
  mathmlBuilder: (a, e) => Rt(a.mathml, e)
});
var Fr = function(e) {
  if (/^[-+]? *(\d+(\.\d*)?|\.\d+)$/.test(e))
    return {
      number: +e,
      unit: "bp"
    };
  var t = /([-+]?) *(\d+(?:\.\d*)?|\.\d+) *([a-z]{2})/.exec(e);
  if (!t)
    throw new B("Invalid size: '" + e + "' in \\includegraphics");
  var r = {
    number: +(t[1] + t[2]),
    // sign + magnitude, cast to number
    unit: t[3]
  };
  if (!as(r))
    throw new B("Invalid unit: '" + r.unit + "' in \\includegraphics.");
  return r;
};
H({
  type: "includegraphics",
  names: ["\\includegraphics"],
  props: {
    numArgs: 1,
    numOptionalArgs: 1,
    argTypes: ["raw", "url"],
    allowedInText: !1
  },
  handler: (a, e, t) => {
    var {
      parser: r
    } = a, i = {
      number: 0,
      unit: "em"
    }, n = {
      number: 0.9,
      unit: "em"
    }, l = {
      number: 0,
      unit: "em"
    }, u = "";
    if (t[0])
      for (var d = te(t[0], "raw").string, p = d.split(","), f = 0; f < p.length; f++) {
        var b = p[f].split("=");
        if (b.length === 2) {
          var S = b[1].trim();
          switch (b[0].trim()) {
            case "alt":
              u = S;
              break;
            case "width":
              i = Fr(S);
              break;
            case "height":
              n = Fr(S);
              break;
            case "totalheight":
              l = Fr(S);
              break;
            default:
              throw new B("Invalid key: '" + b[0] + "' in \\includegraphics.");
          }
        }
      }
    var w = te(e[0], "url").url;
    return u === "" && (u = w, u = u.replace(/^.*[\\/]/, ""), u = u.substring(0, u.lastIndexOf("."))), r.settings.isTrusted({
      command: "\\includegraphics",
      url: w
    }) ? {
      type: "includegraphics",
      mode: r.mode,
      alt: u,
      width: i,
      height: n,
      totalheight: l,
      src: w
    } : r.formatUnsupportedCmd("\\includegraphics");
  },
  htmlBuilder: (a, e) => {
    var t = we(a.height, e), r = 0;
    a.totalheight.number > 0 && (r = we(a.totalheight, e) - t);
    var i = 0;
    a.width.number > 0 && (i = we(a.width, e));
    var n = {
      height: F(t + r)
    };
    i > 0 && (n.width = F(i)), r > 0 && (n.verticalAlign = F(-r));
    var l = new E0(a.src, a.alt, n);
    return l.height = t, l.depth = r, l;
  },
  mathmlBuilder: (a, e) => {
    var t = new P("mglyph", []);
    t.setAttribute("alt", a.alt);
    var r = we(a.height, e), i = 0;
    if (a.totalheight.number > 0 && (i = we(a.totalheight, e) - r, t.setAttribute("valign", F(-i))), t.setAttribute("height", F(r + i)), a.width.number > 0) {
      var n = we(a.width, e);
      t.setAttribute("width", F(n));
    }
    return t.setAttribute("src", a.src), t;
  }
});
H({
  type: "kern",
  names: ["\\kern", "\\mkern", "\\hskip", "\\mskip"],
  props: {
    numArgs: 1,
    argTypes: ["size"],
    primitive: !0,
    allowedInText: !0
  },
  handler(a, e) {
    var {
      parser: t,
      funcName: r
    } = a, i = te(e[0], "size");
    if (t.settings.strict) {
      var n = r[1] === "m", l = i.value.unit === "mu";
      n ? (l || t.settings.reportNonstrict("mathVsTextUnits", "LaTeX's " + r + " supports only mu units, " + ("not " + i.value.unit + " units")), t.mode !== "math" && t.settings.reportNonstrict("mathVsTextUnits", "LaTeX's " + r + " works only in math mode")) : l && t.settings.reportNonstrict("mathVsTextUnits", "LaTeX's " + r + " doesn't support mu units");
    }
    return {
      type: "kern",
      mode: t.mode,
      dimension: i.value
    };
  },
  htmlBuilder(a, e) {
    return ls(a.dimension, e);
  },
  mathmlBuilder(a, e) {
    var t = we(a.dimension, e);
    return new ps(t);
  }
});
H({
  type: "lap",
  names: ["\\mathllap", "\\mathrlap", "\\mathclap"],
  props: {
    numArgs: 1,
    allowedInText: !0
  },
  handler: (a, e) => {
    var {
      parser: t,
      funcName: r
    } = a, i = e[0];
    return {
      type: "lap",
      mode: t.mode,
      alignment: r.slice(5),
      body: i
    };
  },
  htmlBuilder: (a, e) => {
    var t;
    a.alignment === "clap" ? (t = E([], [oe(a.body, e)]), t = E(["inner"], [t], e)) : t = E(["inner"], [oe(a.body, e)]);
    var r = E(["fix"], []), i = E([a.alignment], [t, r], e), n = E(["strut"]);
    return n.style.height = F(i.height + i.depth), i.depth && (n.style.verticalAlign = F(-i.depth)), i.children.unshift(n), i = E(["thinbox"], [i], e), E(["mord", "vbox"], [i], e);
  },
  mathmlBuilder: (a, e) => {
    var t = new P("mpadded", [he(a.body, e)]);
    if (a.alignment !== "rlap") {
      var r = a.alignment === "llap" ? "-1" : "-0.5";
      t.setAttribute("lspace", r + "width");
    }
    return t.setAttribute("width", "0px"), t;
  }
});
H({
  type: "styling",
  names: ["\\(", "$"],
  props: {
    numArgs: 0,
    allowedInText: !0,
    allowedInMath: !1
  },
  handler(a, e) {
    var {
      funcName: t,
      parser: r
    } = a, i = r.mode;
    r.switchMode("math");
    var n = t === "\\(" ? "\\)" : "$", l = r.parseExpression(!1, n);
    return r.expect(n), r.switchMode(i), {
      type: "styling",
      mode: r.mode,
      style: "text",
      resetFont: !0,
      body: l
    };
  }
});
H({
  type: "text",
  // Doesn't matter what this is.
  names: ["\\)", "\\]"],
  props: {
    numArgs: 0,
    allowedInText: !0,
    allowedInMath: !1
  },
  handler(a, e) {
    throw new B("Mismatched " + a.funcName);
  }
});
var wn = (a, e) => {
  switch (e.style.size) {
    case ee.DISPLAY.size:
      return a.display;
    case ee.TEXT.size:
      return a.text;
    case ee.SCRIPT.size:
      return a.script;
    case ee.SCRIPTSCRIPT.size:
      return a.scriptscript;
    default:
      return a.text;
  }
};
H({
  type: "mathchoice",
  names: ["\\mathchoice"],
  props: {
    numArgs: 4,
    primitive: !0
  },
  handler: (a, e) => {
    var {
      parser: t
    } = a;
    return {
      type: "mathchoice",
      mode: t.mode,
      display: je(e[0]),
      text: je(e[1]),
      script: je(e[2]),
      scriptscript: je(e[3])
    };
  },
  htmlBuilder: (a, e) => {
    var t = wn(a, e), r = Be(t, e, !1);
    return St(r);
  },
  mathmlBuilder: (a, e) => {
    var t = wn(a, e);
    return Rt(t, e);
  }
});
var Os = (a, e, t, r, i, n, l) => {
  a = E([], [a]);
  var u = t && wt(t), d, p;
  if (e) {
    var f = oe(e, r.havingStyle(i.sup()), r);
    p = {
      elem: f,
      kern: Math.max(r.fontMetrics().bigOpSpacing1, r.fontMetrics().bigOpSpacing3 - f.depth)
    };
  }
  if (t) {
    var b = oe(t, r.havingStyle(i.sub()), r);
    d = {
      elem: b,
      kern: Math.max(r.fontMetrics().bigOpSpacing2, r.fontMetrics().bigOpSpacing4 - b.height)
    };
  }
  var S;
  if (p && d) {
    var w = r.fontMetrics().bigOpSpacing5 + d.elem.height + d.elem.depth + d.kern + a.depth + l;
    S = se({
      positionType: "bottom",
      positionData: w,
      children: [{
        type: "kern",
        size: r.fontMetrics().bigOpSpacing5
      }, {
        type: "elem",
        elem: d.elem,
        marginLeft: F(-n)
      }, {
        type: "kern",
        size: d.kern
      }, {
        type: "elem",
        elem: a
      }, {
        type: "kern",
        size: p.kern
      }, {
        type: "elem",
        elem: p.elem,
        marginLeft: F(n)
      }, {
        type: "kern",
        size: r.fontMetrics().bigOpSpacing5
      }]
    });
  } else if (d) {
    var j = a.height - l;
    S = se({
      positionType: "top",
      positionData: j,
      children: [{
        type: "kern",
        size: r.fontMetrics().bigOpSpacing5
      }, {
        type: "elem",
        elem: d.elem,
        marginLeft: F(-n)
      }, {
        type: "kern",
        size: d.kern
      }, {
        type: "elem",
        elem: a
      }]
    });
  } else if (p) {
    var R = a.depth + l;
    S = se({
      positionType: "bottom",
      positionData: R,
      children: [{
        type: "elem",
        elem: a
      }, {
        type: "kern",
        size: p.kern
      }, {
        type: "elem",
        elem: p.elem,
        marginLeft: F(n)
      }, {
        type: "kern",
        size: r.fontMetrics().bigOpSpacing5
      }]
    });
  } else
    return a;
  var N = [S];
  if (d && n !== 0 && !u) {
    var I = E(["mspace"], [], r);
    I.style.marginRight = F(n), N.unshift(I);
  }
  return E(["mop", "op-limits"], N, r);
}, Hs = /* @__PURE__ */ new Set(["\\smallint"]), ua = (a, e) => {
  var t, r, i = !1, n;
  a.type === "supsub" ? (t = a.sup, r = a.sub, n = te(a.base, "op"), i = !0) : n = te(a, "op");
  var l = e.style, u = !1;
  l.size === ee.DISPLAY.size && n.symbol && !Hs.has(n.name) && (u = !0);
  var d, p;
  if (n.symbol) {
    var f = u ? "Size2-Regular" : "Size1-Regular", b = "";
    if ((n.name === "\\oiint" || n.name === "\\oiiint") && (b = n.name.slice(1), n.name = b === "oiint" ? "\\iint" : "\\iiint"), d = $e(n.name, f, "math", e, ["mop", "op-symbol", u ? "large-op" : "small-op"]), p = d.italic, b.length > 0) {
      var S = us(b + "Size" + (u ? "2" : "1"), e);
      d = se({
        positionType: "individualShift",
        children: [{
          type: "elem",
          elem: d,
          shift: 0
        }, {
          type: "elem",
          elem: S,
          shift: u ? 0.08 : 0
        }]
      }), n.name = "\\" + b, d.classes.unshift("mop"), d.italic = p;
    }
  } else if (n.body) {
    var w = Be(n.body, e, !0);
    w.length === 1 && w[0] instanceof Xe ? (d = w[0], d.classes[0] = "mop") : d = E(["mop"], w, e);
  } else {
    for (var j = [], R = 1; R < n.name.length; R++)
      j.push(xi(n.name[R], n.mode, e));
    d = E(["mop"], j, e);
  }
  var N = 0, I = 0;
  if ((d instanceof Xe || n.name === "\\oiint" || n.name === "\\oiiint") && !n.suppressBaseShift) {
    var O;
    N = (d.height - d.depth) / 2 - e.fontMetrics().axisHeight, I = (O = d.italic) != null ? O : 0;
  }
  return i ? Os(d, t, r, e, l, I, N) : (N && (d.style.position = "relative", d.style.top = F(N)), d);
}, za = (a, e) => {
  var t;
  if (a.symbol)
    t = new P("mo", [rt(a.name, a.mode)]), Hs.has(a.name) && t.setAttribute("largeop", "false");
  else if (a.body)
    t = new P("mo", Ze(a.body, e));
  else {
    t = new P("mi", [new Ee(a.name.slice(1))]);
    var r = new P("mo", [rt("⁡", "text")]);
    a.parentIsSupSub ? t = new P("mrow", [t, r]) : t = ms([t, r]);
  }
  return t;
}, El = {
  "∏": "\\prod",
  "∐": "\\coprod",
  "∑": "\\sum",
  "⋀": "\\bigwedge",
  "⋁": "\\bigvee",
  "⋂": "\\bigcap",
  "⋃": "\\bigcup",
  "⨀": "\\bigodot",
  "⨁": "\\bigoplus",
  "⨂": "\\bigotimes",
  "⨄": "\\biguplus",
  "⨆": "\\bigsqcup"
};
H({
  type: "op",
  names: ["\\coprod", "\\bigvee", "\\bigwedge", "\\biguplus", "\\bigcap", "\\bigcup", "\\intop", "\\prod", "\\sum", "\\bigotimes", "\\bigoplus", "\\bigodot", "\\bigsqcup", "\\smallint", "∏", "∐", "∑", "⋀", "⋁", "⋂", "⋃", "⨀", "⨁", "⨂", "⨄", "⨆"],
  props: {
    numArgs: 0
  },
  handler: (a, e) => {
    var {
      parser: t,
      funcName: r
    } = a, i = r;
    return i.length === 1 && (i = El[i]), {
      type: "op",
      mode: t.mode,
      limits: !0,
      parentIsSupSub: !1,
      symbol: !0,
      name: i
    };
  },
  htmlBuilder: ua,
  mathmlBuilder: za
});
H({
  type: "op",
  names: ["\\mathop"],
  props: {
    numArgs: 1,
    primitive: !0
  },
  handler: (a, e) => {
    var {
      parser: t
    } = a, r = e[0];
    return {
      type: "op",
      mode: t.mode,
      limits: !1,
      parentIsSupSub: !1,
      symbol: !1,
      body: je(r)
    };
  },
  htmlBuilder: ua,
  mathmlBuilder: za
});
var Rl = {
  "∫": "\\int",
  "∬": "\\iint",
  "∭": "\\iiint",
  "∮": "\\oint",
  "∯": "\\oiint",
  "∰": "\\oiiint"
};
H({
  type: "op",
  names: ["\\arcsin", "\\arccos", "\\arctan", "\\arctg", "\\arcctg", "\\arg", "\\ch", "\\cos", "\\cosec", "\\cosh", "\\cot", "\\cotg", "\\coth", "\\csc", "\\ctg", "\\cth", "\\deg", "\\dim", "\\exp", "\\hom", "\\ker", "\\lg", "\\ln", "\\log", "\\sec", "\\sin", "\\sinh", "\\sh", "\\tan", "\\tanh", "\\tg", "\\th"],
  props: {
    numArgs: 0
  },
  handler(a) {
    var {
      parser: e,
      funcName: t
    } = a;
    return {
      type: "op",
      mode: e.mode,
      limits: !1,
      parentIsSupSub: !1,
      symbol: !1,
      name: t
    };
  },
  htmlBuilder: ua,
  mathmlBuilder: za
});
H({
  type: "op",
  names: ["\\det", "\\gcd", "\\inf", "\\lim", "\\max", "\\min", "\\Pr", "\\sup"],
  props: {
    numArgs: 0
  },
  handler(a) {
    var {
      parser: e,
      funcName: t
    } = a;
    return {
      type: "op",
      mode: e.mode,
      limits: !0,
      parentIsSupSub: !1,
      symbol: !1,
      name: t
    };
  },
  htmlBuilder: ua,
  mathmlBuilder: za
});
H({
  type: "op",
  names: ["\\int", "\\iint", "\\iiint", "\\oint", "\\oiint", "\\oiiint", "∫", "∬", "∭", "∮", "∯", "∰"],
  props: {
    numArgs: 0,
    allowedInArgument: !0
  },
  handler(a) {
    var {
      parser: e,
      funcName: t
    } = a, r = t;
    return r.length === 1 && (r = Rl[r]), {
      type: "op",
      mode: e.mode,
      limits: !1,
      parentIsSupSub: !1,
      symbol: !0,
      name: r
    };
  },
  htmlBuilder: ua,
  mathmlBuilder: za
});
var $s = (a, e) => {
  var t, r, i = !1, n;
  a.type === "supsub" ? (t = a.sup, r = a.sub, n = te(a.base, "operatorname"), i = !0) : n = te(a, "operatorname");
  var l;
  if (n.body.length > 0) {
    for (var u = n.body.map((b) => {
      var S = "text" in b ? b.text : void 0;
      return typeof S == "string" ? {
        type: "textord",
        mode: b.mode,
        text: S
      } : b;
    }), d = Be(u, e.withFont("mathrm"), !0), p = 0; p < d.length; p++) {
      var f = d[p];
      f instanceof Xe && (f.text = f.text.replace(/\u2212/, "-").replace(/\u2217/, "*"));
    }
    l = E(["mop"], d, e);
  } else
    l = E(["mop"], [], e);
  return i ? Os(l, t, r, e, e.style, 0, 0) : l;
}, Dl = (a, e) => {
  for (var t = Ze(a.body, e.withFont("mathrm")), r = !0, i = 0; i < t.length; i++) {
    var n = t[i];
    if (!(n instanceof ps)) if (n instanceof P)
      switch (n.type) {
        case "mi":
        case "mn":
        case "mspace":
        case "mtext":
          break;
        // Do nothing yet.
        case "mo": {
          var l = n.children[0];
          n.children.length === 1 && l instanceof Ee ? l.text = l.text.replace(/\u2212/, "-").replace(/\u2217/, "*") : r = !1;
          break;
        }
        default:
          r = !1;
      }
    else
      r = !1;
  }
  if (r) {
    var u = t.map((f) => f.toText()).join("");
    t = [new Ee(u)];
  }
  var d = new P("mi", t);
  d.setAttribute("mathvariant", "normal");
  var p = new P("mo", [rt("⁡", "text")]);
  return a.parentIsSupSub ? new P("mrow", [d, p]) : ms([d, p]);
};
H({
  type: "operatorname",
  names: ["\\operatorname@", "\\operatornamewithlimits"],
  props: {
    numArgs: 1
  },
  handler: (a, e) => {
    var {
      parser: t,
      funcName: r
    } = a, i = e[0];
    return {
      type: "operatorname",
      mode: t.mode,
      body: je(i),
      alwaysHandleSupSub: r === "\\operatornamewithlimits",
      limits: !1,
      parentIsSupSub: !1
    };
  },
  htmlBuilder: $s,
  mathmlBuilder: Dl
});
m("\\operatorname", "\\@ifstar\\operatornamewithlimits\\operatorname@");
Gt({
  type: "ordgroup",
  htmlBuilder(a, e) {
    return a.semisimple ? St(Be(a.body, e, !1)) : E(["mord"], Be(a.body, e, !0), e);
  },
  mathmlBuilder(a, e) {
    return Rt(a.body, e, !0);
  }
});
H({
  type: "overline",
  names: ["\\overline"],
  props: {
    numArgs: 1
  },
  handler(a, e) {
    var {
      parser: t
    } = a, r = e[0];
    return {
      type: "overline",
      mode: t.mode,
      body: r
    };
  },
  htmlBuilder(a, e) {
    var t = oe(a.body, e.havingCrampedStyle()), r = ia("overline-line", e), i = e.fontMetrics().defaultRuleThickness, n = se({
      positionType: "firstBaseline",
      children: [{
        type: "elem",
        elem: t
      }, {
        type: "kern",
        size: 3 * i
      }, {
        type: "elem",
        elem: r
      }, {
        type: "kern",
        size: i
      }]
    });
    return E(["mord", "overline"], [n], e);
  },
  mathmlBuilder(a, e) {
    var t = new P("mo", [new Ee("‾")]);
    t.setAttribute("stretchy", "true");
    var r = new P("mover", [he(a.body, e), t]);
    return r.setAttribute("accent", "true"), r;
  }
});
H({
  type: "phantom",
  names: ["\\phantom"],
  props: {
    numArgs: 1,
    allowedInText: !0
  },
  handler: (a, e) => {
    var {
      parser: t
    } = a, r = e[0];
    return {
      type: "phantom",
      mode: t.mode,
      body: je(r)
    };
  },
  htmlBuilder: (a, e) => {
    var t = Be(a.body, e.withPhantom(), !1);
    return St(t);
  },
  mathmlBuilder: (a, e) => {
    var t = Ze(a.body, e);
    return new P("mphantom", t);
  }
});
m("\\hphantom", "\\smash{\\phantom{#1}}");
H({
  type: "vphantom",
  names: ["\\vphantom"],
  props: {
    numArgs: 1,
    allowedInText: !0
  },
  handler: (a, e) => {
    var {
      parser: t
    } = a, r = e[0];
    return {
      type: "vphantom",
      mode: t.mode,
      body: r
    };
  },
  htmlBuilder: (a, e) => {
    var t = E(["inner"], [oe(a.body, e.withPhantom())]), r = E(["fix"], []);
    return E(["mord", "rlap"], [t, r], e);
  },
  mathmlBuilder: (a, e) => {
    var t = Ze(je(a.body), e), r = new P("mphantom", t), i = new P("mpadded", [r]);
    return i.setAttribute("width", "0px"), i;
  }
});
H({
  type: "raisebox",
  names: ["\\raisebox"],
  props: {
    numArgs: 2,
    argTypes: ["size", "hbox"],
    allowedInText: !0
  },
  handler(a, e) {
    var {
      parser: t
    } = a, r = te(e[0], "size").value, i = e[1];
    return {
      type: "raisebox",
      mode: t.mode,
      dy: r,
      body: i
    };
  },
  htmlBuilder(a, e) {
    var t = oe(a.body, e), r = we(a.dy, e);
    return se({
      positionType: "shift",
      positionData: -r,
      children: [{
        type: "elem",
        elem: t
      }]
    });
  },
  mathmlBuilder(a, e) {
    var t = new P("mpadded", [he(a.body, e)]), r = a.dy.number + a.dy.unit;
    return t.setAttribute("voffset", r), t;
  }
});
H({
  type: "internal",
  names: ["\\relax"],
  props: {
    numArgs: 0,
    allowedInText: !0,
    allowedInArgument: !0
  },
  handler(a) {
    var {
      parser: e
    } = a;
    return {
      type: "internal",
      mode: e.mode
    };
  }
});
H({
  type: "rule",
  names: ["\\rule"],
  props: {
    numArgs: 2,
    numOptionalArgs: 1,
    allowedInText: !0,
    allowedInMath: !0,
    argTypes: ["size", "size", "size"]
  },
  handler(a, e, t) {
    var {
      parser: r
    } = a, i = t[0], n = te(e[0], "size"), l = te(e[1], "size");
    return {
      type: "rule",
      mode: r.mode,
      shift: i && te(i, "size").value,
      width: n.value,
      height: l.value
    };
  },
  htmlBuilder(a, e) {
    var t = E(["mord", "rule"], [], e), r = we(a.width, e), i = we(a.height, e), n = a.shift ? we(a.shift, e) : 0;
    return t.style.borderRightWidth = F(r), t.style.borderTopWidth = F(i), t.style.bottom = F(n), t.width = r, t.height = i + n, t.depth = -n, t.maxFontSize = i * 1.125 * e.sizeMultiplier, t;
  },
  mathmlBuilder(a, e) {
    var t = we(a.width, e), r = we(a.height, e), i = a.shift ? we(a.shift, e) : 0, n = e.color && e.getColor() || "black", l = new P("mspace");
    l.setAttribute("mathbackground", n), l.setAttribute("width", F(t)), l.setAttribute("height", F(r));
    var u = new P("mpadded", [l]);
    return i >= 0 ? u.setAttribute("height", F(i)) : (u.setAttribute("height", F(i)), u.setAttribute("depth", F(-i))), u.setAttribute("voffset", F(i)), u;
  }
});
function Ws(a, e, t) {
  for (var r = Be(a, e, !1), i = e.sizeMultiplier / t.sizeMultiplier, n = 0; n < r.length; n++) {
    var l = r[n].classes.indexOf("sizing");
    l < 0 ? Array.prototype.push.apply(r[n].classes, e.sizingClasses(t)) : r[n].classes[l + 1] === "reset-size" + e.size && (r[n].classes[l + 1] = "reset-size" + t.size), r[n].height *= i, r[n].depth *= i;
  }
  return St(r);
}
var An = ["\\tiny", "\\sixptsize", "\\scriptsize", "\\footnotesize", "\\small", "\\normalsize", "\\large", "\\Large", "\\LARGE", "\\huge", "\\Huge"], Bl = (a, e) => {
  var t = e.havingSize(a.size);
  return Ws(a.body, t, e);
};
H({
  type: "sizing",
  names: An,
  props: {
    numArgs: 0,
    allowedInText: !0
  },
  handler: (a, e) => {
    var {
      breakOnTokenText: t,
      funcName: r,
      parser: i
    } = a, n = i.parseExpression(!1, t);
    return {
      type: "sizing",
      mode: i.mode,
      // Figure out what size to use based on the list of functions above
      size: An.indexOf(r) + 1,
      body: n
    };
  },
  htmlBuilder: Bl,
  mathmlBuilder: (a, e) => {
    var t = e.havingSize(a.size), r = Ze(a.body, t), i = new P("mstyle", r);
    return i.setAttribute("mathsize", F(t.sizeMultiplier)), i;
  }
});
H({
  type: "smash",
  names: ["\\smash"],
  props: {
    numArgs: 1,
    numOptionalArgs: 1,
    allowedInText: !0
  },
  handler: (a, e, t) => {
    var {
      parser: r
    } = a, i = !1, n = !1, l = t[0] && te(t[0], "ordgroup");
    if (l)
      for (var u, d = 0; d < l.body.length; ++d) {
        var p = l.body[d];
        if (u = dr(p).text, u === "t")
          i = !0;
        else if (u === "b")
          n = !0;
        else {
          i = !1, n = !1;
          break;
        }
      }
    else
      i = !0, n = !0;
    var f = e[0];
    return {
      type: "smash",
      mode: r.mode,
      body: f,
      smashHeight: i,
      smashDepth: n
    };
  },
  htmlBuilder: (a, e) => {
    var t = E([], [oe(a.body, e)]);
    if (!a.smashHeight && !a.smashDepth)
      return t;
    if (a.smashHeight && (t.height = 0), a.smashDepth && (t.depth = 0), a.smashHeight && a.smashDepth)
      return E(["mord", "smash"], [t], e);
    if (t.children)
      for (var r = 0; r < t.children.length; r++)
        a.smashHeight && (t.children[r].height = 0), a.smashDepth && (t.children[r].depth = 0);
    var i = se({
      positionType: "firstBaseline",
      children: [{
        type: "elem",
        elem: t
      }]
    });
    return E(["mord"], [i], e);
  },
  mathmlBuilder: (a, e) => {
    var t = new P("mpadded", [he(a.body, e)]);
    return a.smashHeight && t.setAttribute("height", "0px"), a.smashDepth && t.setAttribute("depth", "0px"), t;
  }
});
H({
  type: "sqrt",
  names: ["\\sqrt"],
  props: {
    numArgs: 1,
    numOptionalArgs: 1
  },
  handler(a, e, t) {
    var {
      parser: r
    } = a, i = t[0], n = e[0];
    return {
      type: "sqrt",
      mode: r.mode,
      body: n,
      index: i
    };
  },
  htmlBuilder(a, e) {
    var t = oe(a.body, e.havingCrampedStyle());
    t.height === 0 && (t.height = e.fontMetrics().xHeight), t = na(t, e);
    var r = e.fontMetrics(), i = r.defaultRuleThickness, n = i;
    e.style.id < ee.TEXT.id && (n = e.fontMetrics().xHeight);
    var l = i + n / 4, u = t.height + t.depth + l + i, {
      span: d,
      ruleWidth: p,
      advanceWidth: f
    } = xl(u, e), b = d.height - p;
    b > t.height + t.depth + l && (l = (l + b - t.height - t.depth) / 2);
    var S = d.height - t.height - l - p;
    t.style.paddingLeft = F(f);
    var w = se({
      positionType: "firstBaseline",
      children: [{
        type: "elem",
        elem: t,
        wrapperClasses: ["svg-align"]
      }, {
        type: "kern",
        size: -(t.height + S)
      }, {
        type: "elem",
        elem: d
      }, {
        type: "kern",
        size: p
      }]
    });
    if (a.index) {
      var j = e.havingStyle(ee.SCRIPTSCRIPT), R = oe(a.index, j, e), N = 0.6 * (w.height - w.depth), I = se({
        positionType: "shift",
        positionData: -N,
        children: [{
          type: "elem",
          elem: R
        }]
      }), O = E(["root"], [I]);
      return E(["mord", "sqrt"], [O, w], e);
    } else
      return E(["mord", "sqrt"], [w], e);
  },
  mathmlBuilder(a, e) {
    var {
      body: t,
      index: r
    } = a;
    return r ? new P("mroot", [he(t, e), he(r, e)]) : new P("msqrt", [he(t, e)]);
  }
});
var di = {
  display: ee.DISPLAY,
  text: ee.TEXT,
  script: ee.SCRIPT,
  scriptscript: ee.SCRIPTSCRIPT
};
function Pl(a) {
  return a in di;
}
H({
  type: "styling",
  names: ["\\displaystyle", "\\textstyle", "\\scriptstyle", "\\scriptscriptstyle"],
  props: {
    numArgs: 0,
    allowedInText: !0,
    primitive: !0
  },
  handler(a, e) {
    var {
      breakOnTokenText: t,
      funcName: r,
      parser: i
    } = a, n = i.parseExpression(!0, t), l = r.slice(1, r.length - 5);
    if (!Pl(l))
      throw new Error("Unknown style: " + l);
    return {
      type: "styling",
      mode: i.mode,
      // Figure out what style to use by pulling out the style from
      // the function name
      style: l,
      body: n
    };
  },
  htmlBuilder(a, e) {
    var t = di[a.style], r = e.havingStyle(t);
    return a.resetFont && (r = r.withFont("")), Ws(a.body, r, e);
  },
  mathmlBuilder(a, e) {
    var t = di[a.style], r = e.havingStyle(t);
    a.resetFont && (r = r.withFont(""));
    var i = Ze(a.body, r), n = new P("mstyle", i), l = {
      display: ["0", "true"],
      text: ["0", "false"],
      script: ["1", "false"],
      scriptscript: ["2", "false"]
    }, u = l[a.style];
    return n.setAttribute("scriptlevel", u[0]), n.setAttribute("displaystyle", u[1]), n;
  }
});
var Il = function(e, t) {
  var r = e.base;
  if (r)
    if (r.type === "op") {
      var i = r.limits && (t.style.size === ee.DISPLAY.size || r.alwaysHandleSupSub);
      return i ? ua : null;
    } else if (r.type === "operatorname") {
      var n = r.alwaysHandleSupSub && (t.style.size === ee.DISPLAY.size || r.limits);
      return n ? $s : null;
    } else {
      if (r.type === "accent")
        return wt(r.base) ? ki : null;
      if (r.type === "horizBrace") {
        var l = !e.sub;
        return l === r.isOver ? Ns : null;
      } else
        return null;
    }
  else return null;
};
Gt({
  type: "supsub",
  htmlBuilder(a, e) {
    var t = Il(a, e);
    if (t)
      return t(a, e);
    var {
      base: r,
      sup: i,
      sub: n
    } = a, l = oe(r, e), u, d, p = e.fontMetrics(), f = 0, b = 0, S = r && wt(r);
    if (i) {
      var w = e.havingStyle(e.style.sup());
      u = oe(i, w, e), S || (f = l.height - w.fontMetrics().supDrop * w.sizeMultiplier / e.sizeMultiplier);
    }
    if (n) {
      var j = e.havingStyle(e.style.sub());
      d = oe(n, j, e), S || (b = l.depth + j.fontMetrics().subDrop * j.sizeMultiplier / e.sizeMultiplier);
    }
    var R;
    e.style === ee.DISPLAY ? R = p.sup1 : e.style.cramped ? R = p.sup3 : R = p.sup2;
    var N = e.sizeMultiplier, I = F(0.5 / p.ptPerEm / N), O = null;
    if (d) {
      var k = a.base && a.base.type === "op" && a.base.name && (a.base.name === "\\oiint" || a.base.name === "\\oiiint");
      if (l instanceof Xe || k) {
        var L;
        O = F(-((L = l.italic) != null ? L : 0));
      }
    }
    var V;
    if (u && d) {
      f = Math.max(f, R, u.depth + 0.25 * p.xHeight), b = Math.max(b, p.sub2);
      var X = p.defaultRuleThickness, ae = 4 * X;
      if (f - u.depth - (d.height - b) < ae) {
        b = ae - (f - u.depth) + d.height;
        var G = 0.8 * p.xHeight - (f - u.depth);
        G > 0 && (f += G, b -= G);
      }
      var J = [{
        type: "elem",
        elem: d,
        shift: b,
        marginRight: I,
        marginLeft: O
      }, {
        type: "elem",
        elem: u,
        shift: -f,
        marginRight: I
      }];
      V = se({
        positionType: "individualShift",
        children: J
      });
    } else if (d) {
      b = Math.max(b, p.sub1, d.height - 0.8 * p.xHeight);
      var me = [{
        type: "elem",
        elem: d,
        marginLeft: O,
        marginRight: I
      }];
      V = se({
        positionType: "shift",
        positionData: b,
        children: me
      });
    } else if (u)
      f = Math.max(f, R, u.depth + 0.25 * p.xHeight), V = se({
        positionType: "shift",
        positionData: -f,
        children: [{
          type: "elem",
          elem: u,
          marginRight: I
        }]
      });
    else
      throw new Error("supsub must have either sup or sub.");
    var _ = si(l, "right") || "mord";
    return E([_], [l, E(["msupsub"], [V])], e);
  },
  mathmlBuilder(a, e) {
    var t = !1, r, i;
    a.base && a.base.type === "horizBrace" && (i = !!a.sup, i === a.base.isOver && (t = !0, r = a.base.isOver)), a.base && (a.base.type === "op" || a.base.type === "operatorname") && (a.base.parentIsSupSub = !0);
    var n = [he(a.base, e)];
    a.sub && n.push(he(a.sub, e)), a.sup && n.push(he(a.sup, e));
    var l;
    if (t)
      l = r ? "mover" : "munder";
    else if (a.sub)
      if (a.sup) {
        var p = a.base;
        p && p.type === "op" && p.limits && e.style === ee.DISPLAY || p && p.type === "operatorname" && p.alwaysHandleSupSub && (e.style === ee.DISPLAY || p.limits) ? l = "munderover" : l = "msubsup";
      } else {
        var d = a.base;
        d && d.type === "op" && d.limits && (e.style === ee.DISPLAY || d.alwaysHandleSupSub) || d && d.type === "operatorname" && d.alwaysHandleSupSub && (d.limits || e.style === ee.DISPLAY) ? l = "munder" : l = "msub";
      }
    else {
      var u = a.base;
      u && u.type === "op" && u.limits && (e.style === ee.DISPLAY || u.alwaysHandleSupSub) || u && u.type === "operatorname" && u.alwaysHandleSupSub && (u.limits || e.style === ee.DISPLAY) ? l = "mover" : l = "msup";
    }
    return new P(l, n);
  }
});
Gt({
  type: "atom",
  htmlBuilder(a, e) {
    return xi(a.text, a.mode, e, ["m" + a.family]);
  },
  mathmlBuilder(a, e) {
    var t = new P("mo", [rt(a.text, a.mode)]);
    if (a.family === "bin") {
      var r = Si(a, e);
      r === "bold-italic" && t.setAttribute("mathvariant", r);
    } else a.family === "punct" ? t.setAttribute("separator", "true") : (a.family === "open" || a.family === "close") && t.setAttribute("stretchy", "false");
    return t;
  }
});
var Us = {
  mi: "italic",
  mn: "normal",
  mtext: "normal"
};
Gt({
  type: "mathord",
  htmlBuilder(a, e) {
    return lr(a, e, "mathord");
  },
  mathmlBuilder(a, e) {
    var t = new P("mi", [rt(a.text, a.mode, e)]), r = Si(a, e) || "italic";
    return r !== Us[t.type] && t.setAttribute("mathvariant", r), t;
  }
});
Gt({
  type: "textord",
  htmlBuilder(a, e) {
    return lr(a, e, "textord");
  },
  mathmlBuilder(a, e) {
    var t = rt(a.text, a.mode, e), r = Si(a, e) || "normal", i;
    return a.mode === "text" ? i = new P("mtext", [t]) : /[0-9]/.test(a.text) ? i = new P("mn", [t]) : a.text === "\\prime" ? i = new P("mo", [t]) : i = new P("mi", [t]), r !== Us[i.type] && i.setAttribute("mathvariant", r), i;
  }
});
var Nr = {
  "\\nobreak": "nobreak",
  "\\allowbreak": "allowbreak"
}, Or = {
  " ": {},
  "\\ ": {},
  "~": {
    className: "nobreak"
  },
  "\\space": {},
  "\\nobreakspace": {
    className: "nobreak"
  }
};
Gt({
  type: "spacing",
  htmlBuilder(a, e) {
    if (Or.hasOwnProperty(a.text)) {
      var t = Or[a.text].className || "";
      if (a.mode === "text") {
        var r = lr(a, e, "textord");
        return r.classes.push(t), r;
      } else
        return E(["mspace", t], [xi(a.text, a.mode, e)], e);
    } else {
      if (Nr.hasOwnProperty(a.text))
        return E(["mspace", Nr[a.text]], [], e);
      throw new B('Unknown type of space "' + a.text + '"');
    }
  },
  mathmlBuilder(a, e) {
    var t;
    if (Or.hasOwnProperty(a.text))
      t = new P("mtext", [new Ee(" ")]);
    else {
      if (Nr.hasOwnProperty(a.text))
        return new P("mspace");
      throw new B('Unknown type of space "' + a.text + '"');
    }
    return t;
  }
});
var Sn = () => {
  var a = new P("mtd", []);
  return a.setAttribute("width", "50%"), a;
};
Gt({
  type: "tag",
  mathmlBuilder(a, e) {
    var t = new P("mtable", [new P("mtr", [Sn(), new P("mtd", [Rt(a.body, e)]), Sn(), new P("mtd", [Rt(a.tag, e)])])]);
    return t.setAttribute("width", "100%"), t;
  }
});
var kn = {
  "\\text": void 0,
  "\\textrm": "textrm",
  "\\textsf": "textsf",
  "\\texttt": "texttt",
  "\\textnormal": "textrm"
}, Cn = {
  "\\textbf": "textbf",
  "\\textmd": "textmd"
}, Ll = {
  "\\textit": "textit",
  "\\textup": "textup"
}, Tn = (a, e) => {
  var t = a.font;
  if (t) {
    if (kn[t])
      return e.withTextFontFamily(kn[t]);
    if (Cn[t])
      return e.withTextFontWeight(Cn[t]);
    if (t === "\\emph")
      return e.fontShape === "textit" ? e.withTextFontShape("textup") : e.withTextFontShape("textit");
  } else return e;
  return e.withTextFontShape(Ll[t]);
};
H({
  type: "text",
  names: [
    // Font families
    "\\text",
    "\\textrm",
    "\\textsf",
    "\\texttt",
    "\\textnormal",
    // Font weights
    "\\textbf",
    "\\textmd",
    // Font Shapes
    "\\textit",
    "\\textup",
    "\\emph"
  ],
  props: {
    numArgs: 1,
    argTypes: ["text"],
    allowedInArgument: !0,
    allowedInText: !0
  },
  handler(a, e) {
    var {
      parser: t,
      funcName: r
    } = a, i = e[0];
    return {
      type: "text",
      mode: t.mode,
      body: je(i),
      font: r
    };
  },
  htmlBuilder(a, e) {
    var t = Tn(a, e), r = Be(a.body, t, !0);
    return E(["mord", "text"], r, t);
  },
  mathmlBuilder(a, e) {
    var t = Tn(a, e);
    return Rt(a.body, t);
  }
});
H({
  type: "underline",
  names: ["\\underline"],
  props: {
    numArgs: 1,
    allowedInText: !0
  },
  handler(a, e) {
    var {
      parser: t
    } = a;
    return {
      type: "underline",
      mode: t.mode,
      body: e[0]
    };
  },
  htmlBuilder(a, e) {
    var t = oe(a.body, e), r = ia("underline-line", e), i = e.fontMetrics().defaultRuleThickness, n = se({
      positionType: "top",
      positionData: t.height,
      children: [{
        type: "kern",
        size: i
      }, {
        type: "elem",
        elem: r
      }, {
        type: "kern",
        size: 3 * i
      }, {
        type: "elem",
        elem: t
      }]
    });
    return E(["mord", "underline"], [n], e);
  },
  mathmlBuilder(a, e) {
    var t = new P("mo", [new Ee("‾")]);
    t.setAttribute("stretchy", "true");
    var r = new P("munder", [he(a.body, e), t]);
    return r.setAttribute("accentunder", "true"), r;
  }
});
H({
  type: "vcenter",
  names: ["\\vcenter"],
  props: {
    numArgs: 1,
    argTypes: ["original"],
    // In LaTeX, \vcenter can act only on a box.
    allowedInText: !1
  },
  handler(a, e) {
    var {
      parser: t
    } = a;
    return {
      type: "vcenter",
      mode: t.mode,
      body: e[0]
    };
  },
  htmlBuilder(a, e) {
    var t = oe(a.body, e), r = e.fontMetrics().axisHeight, i = 0.5 * (t.height - r - (t.depth + r));
    return se({
      positionType: "shift",
      positionData: i,
      children: [{
        type: "elem",
        elem: t
      }]
    });
  },
  mathmlBuilder(a, e) {
    var t = new P("mpadded", [he(a.body, e)], ["vcenter"]);
    return new P("mrow", [t]);
  }
});
H({
  type: "verb",
  names: ["\\verb"],
  props: {
    numArgs: 0,
    allowedInText: !0
  },
  handler(a, e, t) {
    throw new B("\\verb ended by end of line instead of matching delimiter");
  },
  htmlBuilder(a, e) {
    for (var t = Mn(a), r = [], i = e.havingStyle(e.style.text()), n = 0; n < t.length; n++) {
      var l = t[n];
      l === "~" && (l = "\\textasciitilde"), r.push($e(l, "Typewriter-Regular", a.mode, i, ["mord", "texttt"]));
    }
    return E(["mord", "text"].concat(i.sizingClasses(e)), os(r), i);
  },
  mathmlBuilder(a, e) {
    var t = new Ee(Mn(a)), r = new P("mtext", [t]);
    return r.setAttribute("mathvariant", "monospace"), r;
  }
});
var Mn = (a) => a.body.replace(/ /g, a.star ? "␣" : " "), zt = ds, Vs = `[ \r
	]`, Fl = "\\\\[a-zA-Z@]+", Nl = "\\\\[^\uD800-\uDFFF]", Ol = "(" + Fl + ")" + Vs + "*", Hl = `\\\\(
|[ \r	]+
?)[ \r	]*`, hi = "[̀-ͯ]", $l = new RegExp(hi + "+$"), Wl = "(" + Vs + "+)|" + // whitespace
(Hl + "|") + // \whitespace
"([!-\\[\\]-‧‪-퟿豈-￿]" + // single codepoint
(hi + "*") + // ...plus accents
"|[\uD800-\uDBFF][\uDC00-\uDFFF]" + // surrogate pair
(hi + "*") + // ...plus accents
"|\\\\verb\\*([^]).*?\\4|\\\\verb([^*a-zA-Z]).*?\\5" + // \verb unstarred
("|" + Ol) + // \macroName + spaces
("|" + Nl + ")");
class zn {
  constructor(e, t) {
    this.input = void 0, this.settings = void 0, this.tokenRegex = void 0, this.catcodes = void 0, this.input = e, this.settings = t, this.tokenRegex = new RegExp(Wl, "g"), this.catcodes = {
      "%": 14,
      // comment character
      "~": 13
      // active character
    };
  }
  setCatcode(e, t) {
    this.catcodes[e] = t;
  }
  /**
   * This function lexes a single token.
   */
  lex() {
    var e = this.input, t = this.tokenRegex.lastIndex;
    if (t === e.length)
      return new Ke("EOF", new Ye(this, t, t));
    var r = this.tokenRegex.exec(e);
    if (r === null || r.index !== t)
      throw new B("Unexpected character: '" + e[t] + "'", new Ke(e[t], new Ye(this, t, t + 1)));
    var i = r[6] || r[3] || (r[2] ? "\\ " : " ");
    if (this.catcodes[i] === 14) {
      var n = e.indexOf(`
`, this.tokenRegex.lastIndex);
      return n === -1 ? (this.tokenRegex.lastIndex = e.length, this.settings.reportNonstrict("commentAtEnd", "% comment has no terminating newline; LaTeX would fail because of commenting the end of math mode (e.g. $)")) : this.tokenRegex.lastIndex = n + 1, this.lex();
    }
    return new Ke(i, new Ye(this, t, this.tokenRegex.lastIndex));
  }
}
class Ul {
  /**
   * Both arguments are optional.  The first argument is an object of
   * built-in mappings which never change.  The second argument is an object
   * of initial (global-level) mappings, which will constantly change
   * according to any global/top-level `set`s done.
   */
  constructor(e, t) {
    e === void 0 && (e = {}), t === void 0 && (t = {}), this.current = void 0, this.builtins = void 0, this.undefStack = void 0, this.current = t, this.builtins = e, this.undefStack = [];
  }
  /**
   * Start a new nested group, affecting future local `set`s.
   */
  beginGroup() {
    this.undefStack.push({});
  }
  /**
   * End current nested group, restoring values before the group began.
   */
  endGroup() {
    if (this.undefStack.length === 0)
      throw new B("Unbalanced namespace destruction: attempt to pop global namespace; please report this as a bug");
    var e = this.undefStack.pop();
    for (var t in e)
      e.hasOwnProperty(t) && (e[t] == null ? delete this.current[t] : this.current[t] = e[t]);
  }
  /**
   * Ends all currently nested groups (if any), restoring values before the
   * groups began.  Useful in case of an error in the middle of parsing.
   */
  endGroups() {
    for (; this.undefStack.length > 0; )
      this.endGroup();
  }
  /**
   * Detect whether `name` has a definition.  Equivalent to
   * `get(name) != null`.
   */
  has(e) {
    return this.current.hasOwnProperty(e) || this.builtins.hasOwnProperty(e);
  }
  /**
   * Get the current value of a name, or `undefined` if there is no value.
   *
   * Note: Do not use `if (namespace.get(...))` to detect whether a macro
   * is defined, as the definition may be the empty string which evaluates
   * to `false` in JavaScript.  Use `if (namespace.get(...) != null)` or
   * `if (namespace.has(...))`.
   */
  get(e) {
    return this.current.hasOwnProperty(e) ? this.current[e] : this.builtins[e];
  }
  /**
   * Set the current value of a name, and optionally set it globally too.
   * Local set() sets the current value and (when appropriate) adds an undo
   * operation to the undo stack.  Global set() may change the undo
   * operation at every level, so takes time linear in their number.
   * A value of undefined means to delete existing definitions.
   */
  set(e, t, r) {
    if (r === void 0 && (r = !1), r) {
      for (var i = 0; i < this.undefStack.length; i++)
        delete this.undefStack[i][e];
      this.undefStack.length > 0 && (this.undefStack[this.undefStack.length - 1][e] = t);
    } else {
      var n = this.undefStack[this.undefStack.length - 1];
      n && !n.hasOwnProperty(e) && (n[e] = this.current[e]);
    }
    t == null ? delete this.current[e] : this.current[e] = t;
  }
}
var Vl = Bs;
m("\\noexpand", function(a) {
  var e = a.popToken();
  return a.isExpandable(e.text) && (e.noexpand = !0, e.treatAsRelax = !0), {
    tokens: [e],
    numArgs: 0
  };
});
m("\\expandafter", function(a) {
  var e = a.popToken();
  return a.expandOnce(!0), {
    tokens: [e],
    numArgs: 0
  };
});
m("\\@firstoftwo", function(a) {
  var e = a.consumeArgs(2);
  return {
    tokens: e[0],
    numArgs: 0
  };
});
m("\\@secondoftwo", function(a) {
  var e = a.consumeArgs(2);
  return {
    tokens: e[1],
    numArgs: 0
  };
});
m("\\@ifnextchar", function(a) {
  var e = a.consumeArgs(3);
  a.consumeSpaces();
  var t = a.future();
  return e[0].length === 1 && e[0][0].text === t.text ? {
    tokens: e[1],
    numArgs: 0
  } : {
    tokens: e[2],
    numArgs: 0
  };
});
m("\\@ifstar", "\\@ifnextchar *{\\@firstoftwo{#1}}");
m("\\TextOrMath", function(a) {
  var e = a.consumeArgs(2);
  return a.mode === "text" ? {
    tokens: e[0],
    numArgs: 0
  } : {
    tokens: e[1],
    numArgs: 0
  };
});
var qn = {
  0: 0,
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  a: 10,
  A: 10,
  b: 11,
  B: 11,
  c: 12,
  C: 12,
  d: 13,
  D: 13,
  e: 14,
  E: 14,
  f: 15,
  F: 15
};
m("\\char", function(a) {
  var e = a.popToken(), t, r = 0;
  if (e.text === "'")
    t = 8, e = a.popToken();
  else if (e.text === '"')
    t = 16, e = a.popToken();
  else if (e.text === "`")
    if (e = a.popToken(), e.text[0] === "\\")
      r = e.text.charCodeAt(1);
    else {
      if (e.text === "EOF")
        throw new B("\\char` missing argument");
      r = e.text.charCodeAt(0);
    }
  else
    t = 10;
  if (t) {
    if (r = qn[e.text], r == null || r >= t)
      throw new B("Invalid base-" + t + " digit " + e.text);
    for (var i; (i = qn[a.future().text]) != null && i < t; )
      r *= t, r += i, a.popToken();
  }
  return "\\@char{" + r + "}";
});
var zi = (a, e, t, r) => {
  var i = a.consumeArg().tokens;
  if (i.length !== 1)
    throw new B("\\newcommand's first argument must be a macro name");
  var n = i[0].text, l = a.isDefined(n);
  if (l && !e)
    throw new B("\\newcommand{" + n + "} attempting to redefine " + (n + "; use \\renewcommand"));
  if (!l && !t)
    throw new B("\\renewcommand{" + n + "} when command " + n + " does not yet exist; use \\newcommand");
  var u = 0;
  if (i = a.consumeArg().tokens, i.length === 1 && i[0].text === "[") {
    for (var d = "", p = a.expandNextToken(); p.text !== "]" && p.text !== "EOF"; )
      d += p.text, p = a.expandNextToken();
    if (!d.match(/^\s*[0-9]+\s*$/))
      throw new B("Invalid number of arguments: " + d);
    u = parseInt(d), i = a.consumeArg().tokens;
  }
  return l && r || a.macros.set(n, {
    tokens: i,
    numArgs: u
  }), "";
};
m("\\newcommand", (a) => zi(a, !1, !0, !1));
m("\\renewcommand", (a) => zi(a, !0, !1, !1));
m("\\providecommand", (a) => zi(a, !0, !0, !0));
m("\\message", (a) => {
  var e = a.consumeArgs(1)[0];
  return console.log(e.reverse().map((t) => t.text).join("")), "";
});
m("\\errmessage", (a) => {
  var e = a.consumeArgs(1)[0];
  return console.error(e.reverse().map((t) => t.text).join("")), "";
});
m("\\show", (a) => {
  var e = a.popToken(), t = e.text;
  return console.log(e, a.macros.get(t), zt[t], ve.math[t], ve.text[t]), "";
});
m("\\bgroup", "{");
m("\\egroup", "}");
m("~", "\\nobreakspace");
m("\\lq", "`");
m("\\rq", "'");
m("\\aa", "\\r a");
m("\\AA", "\\r A");
m("\\textcopyright", "\\html@mathml{\\textcircled{c}}{\\char`©}");
m("\\copyright", "\\TextOrMath{\\textcopyright}{\\text{\\textcopyright}}");
m("\\textregistered", "\\html@mathml{\\textcircled{\\scriptsize R}}{\\char`®}");
m("ℬ", "\\mathscr{B}");
m("ℰ", "\\mathscr{E}");
m("ℱ", "\\mathscr{F}");
m("ℋ", "\\mathscr{H}");
m("ℐ", "\\mathscr{I}");
m("ℒ", "\\mathscr{L}");
m("ℳ", "\\mathscr{M}");
m("ℛ", "\\mathscr{R}");
m("ℭ", "\\mathfrak{C}");
m("ℌ", "\\mathfrak{H}");
m("ℨ", "\\mathfrak{Z}");
m("\\Bbbk", "\\Bbb{k}");
m("\\llap", "\\mathllap{\\textrm{#1}}");
m("\\rlap", "\\mathrlap{\\textrm{#1}}");
m("\\clap", "\\mathclap{\\textrm{#1}}");
m("\\mathstrut", "\\vphantom{(}");
m("\\underbar", "\\underline{\\text{#1}}");
m("\\not", '\\html@mathml{\\mathrel{\\mathrlap\\@not}\\nobreak}{\\char"338}');
m("\\neq", "\\html@mathml{\\mathrel{\\not=}}{\\mathrel{\\char`≠}}");
m("\\ne", "\\neq");
m("≠", "\\neq");
m("\\notin", "\\html@mathml{\\mathrel{{\\in}\\mathllap{/\\mskip1mu}}}{\\mathrel{\\char`∉}}");
m("∉", "\\notin");
m("≘", "\\html@mathml{\\mathrel{=\\kern{-1em}\\raisebox{0.4em}{$\\scriptsize\\frown$}}}{\\mathrel{\\char`≘}}");
m("≙", "\\html@mathml{\\stackrel{\\tiny\\wedge}{=}}{\\mathrel{\\char`≘}}");
m("≚", "\\html@mathml{\\stackrel{\\tiny\\vee}{=}}{\\mathrel{\\char`≚}}");
m("≛", "\\html@mathml{\\stackrel{\\scriptsize\\star}{=}}{\\mathrel{\\char`≛}}");
m("≝", "\\html@mathml{\\stackrel{\\tiny\\mathrm{def}}{=}}{\\mathrel{\\char`≝}}");
m("≞", "\\html@mathml{\\stackrel{\\tiny\\mathrm{m}}{=}}{\\mathrel{\\char`≞}}");
m("≟", "\\html@mathml{\\stackrel{\\tiny?}{=}}{\\mathrel{\\char`≟}}");
m("⟂", "\\perp");
m("‼", "\\mathclose{!\\mkern-0.8mu!}");
m("∌", "\\notni");
m("⌜", "\\ulcorner");
m("⌝", "\\urcorner");
m("⌞", "\\llcorner");
m("⌟", "\\lrcorner");
m("©", "\\copyright");
m("®", "\\textregistered");
m("\\ulcorner", '\\html@mathml{\\@ulcorner}{\\mathop{\\char"231c}}');
m("\\urcorner", '\\html@mathml{\\@urcorner}{\\mathop{\\char"231d}}');
m("\\llcorner", '\\html@mathml{\\@llcorner}{\\mathop{\\char"231e}}');
m("\\lrcorner", '\\html@mathml{\\@lrcorner}{\\mathop{\\char"231f}}');
m("\\vdots", "{\\varvdots\\rule{0pt}{15pt}}");
m("⋮", "\\vdots");
m("\\varGamma", "\\mathit{\\Gamma}");
m("\\varDelta", "\\mathit{\\Delta}");
m("\\varTheta", "\\mathit{\\Theta}");
m("\\varLambda", "\\mathit{\\Lambda}");
m("\\varXi", "\\mathit{\\Xi}");
m("\\varPi", "\\mathit{\\Pi}");
m("\\varSigma", "\\mathit{\\Sigma}");
m("\\varUpsilon", "\\mathit{\\Upsilon}");
m("\\varPhi", "\\mathit{\\Phi}");
m("\\varPsi", "\\mathit{\\Psi}");
m("\\varOmega", "\\mathit{\\Omega}");
m("\\substack", "\\begin{subarray}{c}#1\\end{subarray}");
m("\\colon", "\\nobreak\\mskip2mu\\mathpunct{}\\mathchoice{\\mkern-3mu}{\\mkern-3mu}{}{}{:}\\mskip6mu\\relax");
m("\\boxed", "\\fbox{$\\displaystyle{#1}$}");
m("\\iff", "\\DOTSB\\;\\Longleftrightarrow\\;");
m("\\implies", "\\DOTSB\\;\\Longrightarrow\\;");
m("\\impliedby", "\\DOTSB\\;\\Longleftarrow\\;");
m("\\dddot", "{\\overset{\\raisebox{-0.1ex}{\\normalsize ...}}{#1}}");
m("\\ddddot", "{\\overset{\\raisebox{-0.1ex}{\\normalsize ....}}{#1}}");
var jn = {
  ",": "\\dotsc",
  "\\not": "\\dotsb",
  // \keybin@ checks for the following:
  "+": "\\dotsb",
  "=": "\\dotsb",
  "<": "\\dotsb",
  ">": "\\dotsb",
  "-": "\\dotsb",
  "*": "\\dotsb",
  ":": "\\dotsb",
  // Symbols whose definition starts with \DOTSB:
  "\\DOTSB": "\\dotsb",
  "\\coprod": "\\dotsb",
  "\\bigvee": "\\dotsb",
  "\\bigwedge": "\\dotsb",
  "\\biguplus": "\\dotsb",
  "\\bigcap": "\\dotsb",
  "\\bigcup": "\\dotsb",
  "\\prod": "\\dotsb",
  "\\sum": "\\dotsb",
  "\\bigotimes": "\\dotsb",
  "\\bigoplus": "\\dotsb",
  "\\bigodot": "\\dotsb",
  "\\bigsqcup": "\\dotsb",
  "\\And": "\\dotsb",
  "\\longrightarrow": "\\dotsb",
  "\\Longrightarrow": "\\dotsb",
  "\\longleftarrow": "\\dotsb",
  "\\Longleftarrow": "\\dotsb",
  "\\longleftrightarrow": "\\dotsb",
  "\\Longleftrightarrow": "\\dotsb",
  "\\mapsto": "\\dotsb",
  "\\longmapsto": "\\dotsb",
  "\\hookrightarrow": "\\dotsb",
  "\\doteq": "\\dotsb",
  // Symbols whose definition starts with \mathbin:
  "\\mathbin": "\\dotsb",
  // Symbols whose definition starts with \mathrel:
  "\\mathrel": "\\dotsb",
  "\\relbar": "\\dotsb",
  "\\Relbar": "\\dotsb",
  "\\xrightarrow": "\\dotsb",
  "\\xleftarrow": "\\dotsb",
  // Symbols whose definition starts with \DOTSI:
  "\\DOTSI": "\\dotsi",
  "\\int": "\\dotsi",
  "\\oint": "\\dotsi",
  "\\iint": "\\dotsi",
  "\\iiint": "\\dotsi",
  "\\iiiint": "\\dotsi",
  "\\idotsint": "\\dotsi",
  // Symbols whose definition starts with \DOTSX:
  "\\DOTSX": "\\dotsx"
}, Gl = /* @__PURE__ */ new Set(["bin", "rel"]);
m("\\dots", function(a) {
  var e = "\\dotso", t = a.expandAfterFuture().text;
  return t in jn ? e = jn[t] : (t.slice(0, 4) === "\\not" || t in ve.math && Gl.has(ve.math[t].group)) && (e = "\\dotsb"), e;
});
var qi = {
  // \rightdelim@ checks for the following:
  ")": !0,
  "]": !0,
  "\\rbrack": !0,
  "\\}": !0,
  "\\rbrace": !0,
  "\\rangle": !0,
  "\\rceil": !0,
  "\\rfloor": !0,
  "\\rgroup": !0,
  "\\rmoustache": !0,
  "\\right": !0,
  "\\bigr": !0,
  "\\biggr": !0,
  "\\Bigr": !0,
  "\\Biggr": !0,
  // \extra@ also tests for the following:
  $: !0,
  // \extrap@ checks for the following:
  ";": !0,
  ".": !0,
  ",": !0
};
m("\\dotso", function(a) {
  var e = a.future().text;
  return e in qi ? "\\ldots\\," : "\\ldots";
});
m("\\dotsc", function(a) {
  var e = a.future().text;
  return e in qi && e !== "," ? "\\ldots\\," : "\\ldots";
});
m("\\cdots", function(a) {
  var e = a.future().text;
  return e in qi ? "\\@cdots\\," : "\\@cdots";
});
m("\\dotsb", "\\cdots");
m("\\dotsm", "\\cdots");
m("\\dotsi", "\\!\\cdots");
m("\\dotsx", "\\ldots\\,");
m("\\DOTSI", "\\relax");
m("\\DOTSB", "\\relax");
m("\\DOTSX", "\\relax");
m("\\tmspace", "\\TextOrMath{\\kern#1#3}{\\mskip#1#2}\\relax");
m("\\,", "\\tmspace+{3mu}{.1667em}");
m("\\thinspace", "\\,");
m("\\>", "\\mskip{4mu}");
m("\\:", "\\tmspace+{4mu}{.2222em}");
m("\\medspace", "\\:");
m("\\;", "\\tmspace+{5mu}{.2777em}");
m("\\thickspace", "\\;");
m("\\!", "\\tmspace-{3mu}{.1667em}");
m("\\negthinspace", "\\!");
m("\\negmedspace", "\\tmspace-{4mu}{.2222em}");
m("\\negthickspace", "\\tmspace-{5mu}{.277em}");
m("\\enspace", "\\kern.5em ");
m("\\enskip", "\\hskip.5em\\relax");
m("\\quad", "\\hskip1em\\relax");
m("\\qquad", "\\hskip2em\\relax");
m("\\tag", "\\@ifstar\\tag@literal\\tag@paren");
m("\\tag@paren", "\\tag@literal{({#1})}");
m("\\tag@literal", (a) => {
  if (a.macros.get("\\df@tag"))
    throw new B("Multiple \\tag");
  return "\\gdef\\df@tag{\\text{#1}}";
});
m("\\bmod", "\\mathchoice{\\mskip1mu}{\\mskip1mu}{\\mskip5mu}{\\mskip5mu}\\mathbin{\\rm mod}\\mathchoice{\\mskip1mu}{\\mskip1mu}{\\mskip5mu}{\\mskip5mu}");
m("\\pod", "\\allowbreak\\mathchoice{\\mkern18mu}{\\mkern8mu}{\\mkern8mu}{\\mkern8mu}(#1)");
m("\\pmod", "\\pod{{\\rm mod}\\mkern6mu#1}");
m("\\mod", "\\allowbreak\\mathchoice{\\mkern18mu}{\\mkern12mu}{\\mkern12mu}{\\mkern12mu}{\\rm mod}\\,\\,#1");
m("\\newline", "\\\\\\relax");
m("\\TeX", "\\textrm{\\html@mathml{T\\kern-.1667em\\raisebox{-.5ex}{E}\\kern-.125emX}{TeX}}");
var Gs = F(lt["Main-Regular"][84][1] - 0.7 * lt["Main-Regular"][65][1]);
m("\\LaTeX", "\\textrm{\\html@mathml{" + ("L\\kern-.36em\\raisebox{" + Gs + "}{\\scriptstyle A}") + "\\kern-.15em\\TeX}{LaTeX}}");
m("\\KaTeX", "\\textrm{\\html@mathml{" + ("K\\kern-.17em\\raisebox{" + Gs + "}{\\scriptstyle A}") + "\\kern-.15em\\TeX}{KaTeX}}");
m("\\hspace", "\\@ifstar\\@hspacer\\@hspace");
m("\\@hspace", "\\hskip #1\\relax");
m("\\@hspacer", "\\rule{0pt}{0pt}\\hskip #1\\relax");
m("\\ordinarycolon", ":");
m("\\vcentcolon", "\\mathrel{\\mathop\\ordinarycolon}");
m("\\dblcolon", '\\html@mathml{\\mathrel{\\vcentcolon\\mathrel{\\mkern-.9mu}\\vcentcolon}}{\\mathop{\\char"2237}}');
m("\\coloneqq", '\\html@mathml{\\mathrel{\\vcentcolon\\mathrel{\\mkern-1.2mu}=}}{\\mathop{\\char"2254}}');
m("\\Coloneqq", '\\html@mathml{\\mathrel{\\dblcolon\\mathrel{\\mkern-1.2mu}=}}{\\mathop{\\char"2237\\char"3d}}');
m("\\coloneq", '\\html@mathml{\\mathrel{\\vcentcolon\\mathrel{\\mkern-1.2mu}\\mathrel{-}}}{\\mathop{\\char"3a\\char"2212}}');
m("\\Coloneq", '\\html@mathml{\\mathrel{\\dblcolon\\mathrel{\\mkern-1.2mu}\\mathrel{-}}}{\\mathop{\\char"2237\\char"2212}}');
m("\\eqqcolon", '\\html@mathml{\\mathrel{=\\mathrel{\\mkern-1.2mu}\\vcentcolon}}{\\mathop{\\char"2255}}');
m("\\Eqqcolon", '\\html@mathml{\\mathrel{=\\mathrel{\\mkern-1.2mu}\\dblcolon}}{\\mathop{\\char"3d\\char"2237}}');
m("\\eqcolon", '\\html@mathml{\\mathrel{\\mathrel{-}\\mathrel{\\mkern-1.2mu}\\vcentcolon}}{\\mathop{\\char"2239}}');
m("\\Eqcolon", '\\html@mathml{\\mathrel{\\mathrel{-}\\mathrel{\\mkern-1.2mu}\\dblcolon}}{\\mathop{\\char"2212\\char"2237}}');
m("\\colonapprox", '\\html@mathml{\\mathrel{\\vcentcolon\\mathrel{\\mkern-1.2mu}\\approx}}{\\mathop{\\char"3a\\char"2248}}');
m("\\Colonapprox", '\\html@mathml{\\mathrel{\\dblcolon\\mathrel{\\mkern-1.2mu}\\approx}}{\\mathop{\\char"2237\\char"2248}}');
m("\\colonsim", '\\html@mathml{\\mathrel{\\vcentcolon\\mathrel{\\mkern-1.2mu}\\sim}}{\\mathop{\\char"3a\\char"223c}}');
m("\\Colonsim", '\\html@mathml{\\mathrel{\\dblcolon\\mathrel{\\mkern-1.2mu}\\sim}}{\\mathop{\\char"2237\\char"223c}}');
m("∷", "\\dblcolon");
m("∹", "\\eqcolon");
m("≔", "\\coloneqq");
m("≕", "\\eqqcolon");
m("⩴", "\\Coloneqq");
m("\\ratio", "\\vcentcolon");
m("\\coloncolon", "\\dblcolon");
m("\\colonequals", "\\coloneqq");
m("\\coloncolonequals", "\\Coloneqq");
m("\\equalscolon", "\\eqqcolon");
m("\\equalscoloncolon", "\\Eqqcolon");
m("\\colonminus", "\\coloneq");
m("\\coloncolonminus", "\\Coloneq");
m("\\minuscolon", "\\eqcolon");
m("\\minuscoloncolon", "\\Eqcolon");
m("\\coloncolonapprox", "\\Colonapprox");
m("\\coloncolonsim", "\\Colonsim");
m("\\simcolon", "\\mathrel{\\sim\\mathrel{\\mkern-1.2mu}\\vcentcolon}");
m("\\simcoloncolon", "\\mathrel{\\sim\\mathrel{\\mkern-1.2mu}\\dblcolon}");
m("\\approxcolon", "\\mathrel{\\approx\\mathrel{\\mkern-1.2mu}\\vcentcolon}");
m("\\approxcoloncolon", "\\mathrel{\\approx\\mathrel{\\mkern-1.2mu}\\dblcolon}");
m("\\notni", "\\html@mathml{\\not\\ni}{\\mathrel{\\char`∌}}");
m("\\limsup", "\\DOTSB\\operatorname*{lim\\,sup}");
m("\\liminf", "\\DOTSB\\operatorname*{lim\\,inf}");
m("\\injlim", "\\DOTSB\\operatorname*{inj\\,lim}");
m("\\projlim", "\\DOTSB\\operatorname*{proj\\,lim}");
m("\\varlimsup", "\\DOTSB\\operatorname*{\\overline{lim}}");
m("\\varliminf", "\\DOTSB\\operatorname*{\\underline{lim}}");
m("\\varinjlim", "\\DOTSB\\operatorname*{\\underrightarrow{lim}}");
m("\\varprojlim", "\\DOTSB\\operatorname*{\\underleftarrow{lim}}");
m("\\gvertneqq", "\\html@mathml{\\@gvertneqq}{≩}");
m("\\lvertneqq", "\\html@mathml{\\@lvertneqq}{≨}");
m("\\ngeqq", "\\html@mathml{\\@ngeqq}{≱}");
m("\\ngeqslant", "\\html@mathml{\\@ngeqslant}{≱}");
m("\\nleqq", "\\html@mathml{\\@nleqq}{≰}");
m("\\nleqslant", "\\html@mathml{\\@nleqslant}{≰}");
m("\\nshortmid", "\\html@mathml{\\@nshortmid}{∤}");
m("\\nshortparallel", "\\html@mathml{\\@nshortparallel}{∦}");
m("\\nsubseteqq", "\\html@mathml{\\@nsubseteqq}{⊈}");
m("\\nsupseteqq", "\\html@mathml{\\@nsupseteqq}{⊉}");
m("\\varsubsetneq", "\\html@mathml{\\@varsubsetneq}{⊊}");
m("\\varsubsetneqq", "\\html@mathml{\\@varsubsetneqq}{⫋}");
m("\\varsupsetneq", "\\html@mathml{\\@varsupsetneq}{⊋}");
m("\\varsupsetneqq", "\\html@mathml{\\@varsupsetneqq}{⫌}");
m("\\imath", "\\html@mathml{\\@imath}{ı}");
m("\\jmath", "\\html@mathml{\\@jmath}{ȷ}");
m("\\llbracket", "\\html@mathml{\\mathopen{[\\mkern-3.2mu[}}{\\mathopen{\\char`⟦}}");
m("\\rrbracket", "\\html@mathml{\\mathclose{]\\mkern-3.2mu]}}{\\mathclose{\\char`⟧}}");
m("⟦", "\\llbracket");
m("⟧", "\\rrbracket");
m("\\lBrace", "\\html@mathml{\\mathopen{\\{\\mkern-3.2mu[}}{\\mathopen{\\char`⦃}}");
m("\\rBrace", "\\html@mathml{\\mathclose{]\\mkern-3.2mu\\}}}{\\mathclose{\\char`⦄}}");
m("⦃", "\\lBrace");
m("⦄", "\\rBrace");
m("\\minuso", "\\mathbin{\\html@mathml{{\\mathrlap{\\mathchoice{\\kern{0.145em}}{\\kern{0.145em}}{\\kern{0.1015em}}{\\kern{0.0725em}}\\circ}{-}}}{\\char`⦵}}");
m("⦵", "\\minuso");
m("\\darr", "\\downarrow");
m("\\dArr", "\\Downarrow");
m("\\Darr", "\\Downarrow");
m("\\lang", "\\langle");
m("\\rang", "\\rangle");
m("\\uarr", "\\uparrow");
m("\\uArr", "\\Uparrow");
m("\\Uarr", "\\Uparrow");
m("\\N", "\\mathbb{N}");
m("\\R", "\\mathbb{R}");
m("\\Z", "\\mathbb{Z}");
m("\\alef", "\\aleph");
m("\\alefsym", "\\aleph");
m("\\Alpha", "\\mathrm{A}");
m("\\Beta", "\\mathrm{B}");
m("\\bull", "\\bullet");
m("\\Chi", "\\mathrm{X}");
m("\\clubs", "\\clubsuit");
m("\\cnums", "\\mathbb{C}");
m("\\Complex", "\\mathbb{C}");
m("\\Dagger", "\\ddagger");
m("\\diamonds", "\\diamondsuit");
m("\\empty", "\\emptyset");
m("\\Epsilon", "\\mathrm{E}");
m("\\Eta", "\\mathrm{H}");
m("\\exist", "\\exists");
m("\\harr", "\\leftrightarrow");
m("\\hArr", "\\Leftrightarrow");
m("\\Harr", "\\Leftrightarrow");
m("\\hearts", "\\heartsuit");
m("\\image", "\\Im");
m("\\infin", "\\infty");
m("\\Iota", "\\mathrm{I}");
m("\\isin", "\\in");
m("\\Kappa", "\\mathrm{K}");
m("\\larr", "\\leftarrow");
m("\\lArr", "\\Leftarrow");
m("\\Larr", "\\Leftarrow");
m("\\lrarr", "\\leftrightarrow");
m("\\lrArr", "\\Leftrightarrow");
m("\\Lrarr", "\\Leftrightarrow");
m("\\Mu", "\\mathrm{M}");
m("\\natnums", "\\mathbb{N}");
m("\\Nu", "\\mathrm{N}");
m("\\Omicron", "\\mathrm{O}");
m("\\plusmn", "\\pm");
m("\\rarr", "\\rightarrow");
m("\\rArr", "\\Rightarrow");
m("\\Rarr", "\\Rightarrow");
m("\\real", "\\Re");
m("\\reals", "\\mathbb{R}");
m("\\Reals", "\\mathbb{R}");
m("\\Rho", "\\mathrm{P}");
m("\\sdot", "\\cdot");
m("\\sect", "\\S");
m("\\spades", "\\spadesuit");
m("\\sub", "\\subset");
m("\\sube", "\\subseteq");
m("\\supe", "\\supseteq");
m("\\Tau", "\\mathrm{T}");
m("\\thetasym", "\\vartheta");
m("\\weierp", "\\wp");
m("\\Zeta", "\\mathrm{Z}");
m("\\argmin", "\\DOTSB\\operatorname*{arg\\,min}");
m("\\argmax", "\\DOTSB\\operatorname*{arg\\,max}");
m("\\plim", "\\DOTSB\\mathop{\\operatorname{plim}}\\limits");
m("\\bra", "\\mathinner{\\langle{#1}|}");
m("\\ket", "\\mathinner{|{#1}\\rangle}");
m("\\braket", "\\mathinner{\\langle{#1}\\rangle}");
m("\\Bra", "\\left\\langle#1\\right|");
m("\\Ket", "\\left|#1\\right\\rangle");
var Ys = (a) => (e) => {
  var t = e.consumeArg().tokens, r = e.consumeArg().tokens, i = e.consumeArg().tokens, n = e.consumeArg().tokens, l = e.macros.get("|"), u = e.macros.get("\\|");
  e.macros.beginGroup();
  var d = (b) => (S) => {
    a && (S.macros.set("|", l), i.length && S.macros.set("\\|", u));
    var w = b;
    if (!b && i.length) {
      var j = S.future();
      j.text === "|" && (S.popToken(), w = !0);
    }
    return {
      tokens: w ? i : r,
      numArgs: 0
    };
  };
  e.macros.set("|", d(!1)), i.length && e.macros.set("\\|", d(!0));
  var p = e.consumeArg().tokens, f = e.expandTokens([
    ...n,
    ...p,
    ...t
    // reversed
  ]);
  return e.macros.endGroup(), {
    tokens: f.reverse(),
    numArgs: 0
  };
};
m("\\bra@ket", Ys(!1));
m("\\bra@set", Ys(!0));
m("\\Braket", "\\bra@ket{\\left\\langle}{\\,\\middle\\vert\\,}{\\,\\middle\\vert\\,}{\\right\\rangle}");
m("\\Set", "\\bra@set{\\left\\{\\:}{\\;\\middle\\vert\\;}{\\;\\middle\\Vert\\;}{\\:\\right\\}}");
m("\\set", "\\bra@set{\\{\\,}{\\mid}{}{\\,\\}}");
m("\\angln", "{\\angl n}");
m("\\blue", "\\textcolor{##6495ed}{#1}");
m("\\orange", "\\textcolor{##ffa500}{#1}");
m("\\pink", "\\textcolor{##ff00af}{#1}");
m("\\red", "\\textcolor{##df0030}{#1}");
m("\\green", "\\textcolor{##28ae7b}{#1}");
m("\\gray", "\\textcolor{gray}{#1}");
m("\\purple", "\\textcolor{##9d38bd}{#1}");
m("\\blueA", "\\textcolor{##ccfaff}{#1}");
m("\\blueB", "\\textcolor{##80f6ff}{#1}");
m("\\blueC", "\\textcolor{##63d9ea}{#1}");
m("\\blueD", "\\textcolor{##11accd}{#1}");
m("\\blueE", "\\textcolor{##0c7f99}{#1}");
m("\\tealA", "\\textcolor{##94fff5}{#1}");
m("\\tealB", "\\textcolor{##26edd5}{#1}");
m("\\tealC", "\\textcolor{##01d1c1}{#1}");
m("\\tealD", "\\textcolor{##01a995}{#1}");
m("\\tealE", "\\textcolor{##208170}{#1}");
m("\\greenA", "\\textcolor{##b6ffb0}{#1}");
m("\\greenB", "\\textcolor{##8af281}{#1}");
m("\\greenC", "\\textcolor{##74cf70}{#1}");
m("\\greenD", "\\textcolor{##1fab54}{#1}");
m("\\greenE", "\\textcolor{##0d923f}{#1}");
m("\\goldA", "\\textcolor{##ffd0a9}{#1}");
m("\\goldB", "\\textcolor{##ffbb71}{#1}");
m("\\goldC", "\\textcolor{##ff9c39}{#1}");
m("\\goldD", "\\textcolor{##e07d10}{#1}");
m("\\goldE", "\\textcolor{##a75a05}{#1}");
m("\\redA", "\\textcolor{##fca9a9}{#1}");
m("\\redB", "\\textcolor{##ff8482}{#1}");
m("\\redC", "\\textcolor{##f9685d}{#1}");
m("\\redD", "\\textcolor{##e84d39}{#1}");
m("\\redE", "\\textcolor{##bc2612}{#1}");
m("\\maroonA", "\\textcolor{##ffbde0}{#1}");
m("\\maroonB", "\\textcolor{##ff92c6}{#1}");
m("\\maroonC", "\\textcolor{##ed5fa6}{#1}");
m("\\maroonD", "\\textcolor{##ca337c}{#1}");
m("\\maroonE", "\\textcolor{##9e034e}{#1}");
m("\\purpleA", "\\textcolor{##ddd7ff}{#1}");
m("\\purpleB", "\\textcolor{##c6b9fc}{#1}");
m("\\purpleC", "\\textcolor{##aa87ff}{#1}");
m("\\purpleD", "\\textcolor{##7854ab}{#1}");
m("\\purpleE", "\\textcolor{##543b78}{#1}");
m("\\mintA", "\\textcolor{##f5f9e8}{#1}");
m("\\mintB", "\\textcolor{##edf2df}{#1}");
m("\\mintC", "\\textcolor{##e0e5cc}{#1}");
m("\\grayA", "\\textcolor{##f6f7f7}{#1}");
m("\\grayB", "\\textcolor{##f0f1f2}{#1}");
m("\\grayC", "\\textcolor{##e3e5e6}{#1}");
m("\\grayD", "\\textcolor{##d6d8da}{#1}");
m("\\grayE", "\\textcolor{##babec2}{#1}");
m("\\grayF", "\\textcolor{##888d93}{#1}");
m("\\grayG", "\\textcolor{##626569}{#1}");
m("\\grayH", "\\textcolor{##3b3e40}{#1}");
m("\\grayI", "\\textcolor{##21242c}{#1}");
m("\\kaBlue", "\\textcolor{##314453}{#1}");
m("\\kaGreen", "\\textcolor{##71B307}{#1}");
var Ks = {
  "^": !0,
  // Parser.js
  _: !0,
  // Parser.js
  "\\limits": !0,
  // Parser.js
  "\\nolimits": !0
  // Parser.js
};
class Yl {
  constructor(e, t, r) {
    this.settings = void 0, this.expansionCount = void 0, this.lexer = void 0, this.macros = void 0, this.stack = void 0, this.mode = void 0, this.settings = t, this.expansionCount = 0, this.feed(e), this.macros = new Ul(Vl, t.macros), this.mode = r, this.stack = [];
  }
  /**
   * Feed a new input string to the same MacroExpander
   * (with existing macros etc.).
   */
  feed(e) {
    this.lexer = new zn(e, this.settings);
  }
  /**
   * Switches between "text" and "math" modes.
   */
  switchMode(e) {
    this.mode = e;
  }
  /**
   * Start a new group nesting within all namespaces.
   */
  beginGroup() {
    this.macros.beginGroup();
  }
  /**
   * End current group nesting within all namespaces.
   */
  endGroup() {
    this.macros.endGroup();
  }
  /**
   * Ends all currently nested groups (if any), restoring values before the
   * groups began.  Useful in case of an error in the middle of parsing.
   */
  endGroups() {
    this.macros.endGroups();
  }
  /**
   * Returns the topmost token on the stack, without expanding it.
   * Similar in behavior to TeX's `\futurelet`.
   */
  future() {
    return this.stack.length === 0 && this.pushToken(this.lexer.lex()), this.stack[this.stack.length - 1];
  }
  /**
   * Remove and return the next unexpanded token.
   */
  popToken() {
    return this.future(), this.stack.pop();
  }
  /**
   * Add a given token to the token stack.  In particular, this get be used
   * to put back a token returned from one of the other methods.
   */
  pushToken(e) {
    this.stack.push(e);
  }
  /**
   * Append an array of tokens to the token stack.
   */
  pushTokens(e) {
    this.stack.push(...e);
  }
  /**
   * Find an macro argument without expanding tokens and append the array of
   * tokens to the token stack. Uses Token as a container for the result.
   */
  scanArgument(e) {
    var t, r, i;
    if (e) {
      if (this.consumeSpaces(), this.future().text !== "[")
        return null;
      t = this.popToken(), {
        tokens: i,
        end: r
      } = this.consumeArg(["]"]);
    } else
      ({
        tokens: i,
        start: t,
        end: r
      } = this.consumeArg());
    return this.pushToken(new Ke("EOF", r.loc)), this.pushTokens(i), new Ke("", Ye.range(t, r));
  }
  /**
   * Consume all following space tokens, without expansion.
   */
  consumeSpaces() {
    for (; ; ) {
      var e = this.future();
      if (e.text === " ")
        this.stack.pop();
      else
        break;
    }
  }
  /**
   * Consume an argument from the token stream, and return the resulting array
   * of tokens and start/end token.
   */
  consumeArg(e) {
    var t = [], r = e && e.length > 0;
    r || this.consumeSpaces();
    var i = this.future(), n, l = 0, u = 0;
    do {
      if (n = this.popToken(), t.push(n), n.text === "{")
        ++l;
      else if (n.text === "}") {
        if (--l, l === -1)
          throw new B("Extra }", n);
      } else if (n.text === "EOF")
        throw new B("Unexpected end of input in a macro argument, expected '" + (e && r ? e[u] : "}") + "'", n);
      if (e && r)
        if ((l === 0 || l === 1 && e[u] === "{") && n.text === e[u]) {
          if (++u, u === e.length) {
            t.splice(-u, u);
            break;
          }
        } else
          u = 0;
    } while (l !== 0 || r);
    return i.text === "{" && t[t.length - 1].text === "}" && (t.pop(), t.shift()), t.reverse(), {
      tokens: t,
      start: i,
      end: n
    };
  }
  /**
   * Consume the specified number of (delimited) arguments from the token
   * stream and return the resulting array of arguments.
   */
  consumeArgs(e, t) {
    if (t) {
      if (t.length !== e + 1)
        throw new B("The length of delimiters doesn't match the number of args!");
      for (var r = t[0], i = 0; i < r.length; i++) {
        var n = this.popToken();
        if (r[i] !== n.text)
          throw new B("Use of the macro doesn't match its definition", n);
      }
    }
    for (var l = [], u = 0; u < e; u++)
      l.push(this.consumeArg(t && t[u + 1]).tokens);
    return l;
  }
  /**
   * Increment `expansionCount` by the specified amount.
   * Throw an error if it exceeds `maxExpand`.
   */
  countExpansion(e) {
    if (this.expansionCount += e, this.expansionCount > this.settings.maxExpand)
      throw new B("Too many expansions: infinite loop or need to increase maxExpand setting");
  }
  /**
   * Expand the next token only once if possible.
   *
   * If the token is expanded, the resulting tokens will be pushed onto
   * the stack in reverse order, and the number of such tokens will be
   * returned.  This number might be zero or positive.
   *
   * If not, the return value is `false`, and the next token remains at the
   * top of the stack.
   *
   * In either case, the next token will be on the top of the stack,
   * or the stack will be empty (in case of empty expansion
   * and no other tokens).
   *
   * Used to implement `expandAfterFuture` and `expandNextToken`.
   *
   * If expandableOnly, only expandable tokens are expanded and
   * an undefined control sequence results in an error.
   */
  expandOnce(e) {
    var t = this.popToken(), r = t.text, i = t.noexpand ? null : this._getExpansion(r);
    if (i == null || e && i.unexpandable) {
      if (e && i == null && r[0] === "\\" && !this.isDefined(r))
        throw new B("Undefined control sequence: " + r);
      return this.pushToken(t), !1;
    }
    this.countExpansion(1);
    var n = i.tokens, l = this.consumeArgs(i.numArgs, i.delimiters);
    if (i.numArgs) {
      n = n.slice();
      for (var u = n.length - 1; u >= 0; --u) {
        var d = n[u];
        if (d.text === "#") {
          if (u === 0)
            throw new B("Incomplete placeholder at end of macro body", d);
          if (d = n[--u], d.text === "#")
            n.splice(u + 1, 1);
          else if (/^[1-9]$/.test(d.text))
            n.splice(u, 2, ...l[+d.text - 1]);
          else
            throw new B("Not a valid argument number", d);
        }
      }
    }
    return this.pushTokens(n), n.length;
  }
  /**
   * Expand the next token only once (if possible), and return the resulting
   * top token on the stack (without removing anything from the stack).
   * Similar in behavior to TeX's `\expandafter\futurelet`.
   * Equivalent to expandOnce() followed by future().
   */
  expandAfterFuture() {
    return this.expandOnce(), this.future();
  }
  /**
   * Recursively expand first token, then return first non-expandable token.
   */
  expandNextToken() {
    for (; ; )
      if (this.expandOnce() === !1) {
        var e = this.stack.pop();
        return e.treatAsRelax && (e.text = "\\relax"), e;
      }
  }
  /**
   * Fully expand the given macro name and return the resulting list of
   * tokens, or return `undefined` if no such macro is defined.
   */
  expandMacro(e) {
    return this.macros.has(e) ? this.expandTokens([new Ke(e)]) : void 0;
  }
  /**
   * Fully expand the given token stream and return the resulting list of
   * tokens.  Note that the input tokens are in reverse order, but the
   * output tokens are in forward order.
   */
  expandTokens(e) {
    var t = [], r = this.stack.length;
    for (this.pushTokens(e); this.stack.length > r; )
      if (this.expandOnce(!0) === !1) {
        var i = this.stack.pop();
        i.treatAsRelax && (i.noexpand = !1, i.treatAsRelax = !1), t.push(i);
      }
    return this.countExpansion(t.length), t;
  }
  /**
   * Fully expand the given macro name and return the result as a string,
   * or return `undefined` if no such macro is defined.
   */
  expandMacroAsText(e) {
    var t = this.expandMacro(e);
    return t && t.map((r) => r.text).join("");
  }
  /**
   * Returns the expanded macro as a reversed array of tokens and a macro
   * argument count.  Or returns `null` if no such macro.
   */
  _getExpansion(e) {
    var t = this.macros.get(e);
    if (t == null)
      return t;
    if (e.length === 1) {
      var r = this.lexer.catcodes[e];
      if (r != null && r !== 13)
        return;
    }
    var i = typeof t == "function" ? t(this) : t;
    if (typeof i == "string") {
      var n = 0;
      if (i.includes("#"))
        for (var l = i.replace(/##/g, ""); l.includes("#" + (n + 1)); )
          ++n;
      for (var u = new zn(i, this.settings), d = [], p = u.lex(); p.text !== "EOF"; )
        d.push(p), p = u.lex();
      d.reverse();
      var f = {
        tokens: d,
        numArgs: n
      };
      return f;
    }
    return i;
  }
  /**
   * Determine whether a command is currently "defined" (has some
   * functionality), meaning that it's a macro (in the current group),
   * a function, a symbol, or one of the special commands listed in
   * `implicitCommands`.
   */
  isDefined(e) {
    return this.macros.has(e) || zt.hasOwnProperty(e) || ve.math.hasOwnProperty(e) || ve.text.hasOwnProperty(e) || Ks.hasOwnProperty(e);
  }
  /**
   * Determine whether a command is expandable.
   */
  isExpandable(e) {
    var t = this.macros.get(e);
    return t != null ? typeof t == "string" || typeof t == "function" || !t.unexpandable : zt.hasOwnProperty(e) && !zt[e].primitive;
  }
}
var En = /^[₊₋₌₍₎₀₁₂₃₄₅₆₇₈₉ₐₑₕᵢⱼₖₗₘₙₒₚᵣₛₜᵤᵥₓᵦᵧᵨᵩᵪ]/, Ga = Object.freeze({
  "₊": "+",
  "₋": "-",
  "₌": "=",
  "₍": "(",
  "₎": ")",
  "₀": "0",
  "₁": "1",
  "₂": "2",
  "₃": "3",
  "₄": "4",
  "₅": "5",
  "₆": "6",
  "₇": "7",
  "₈": "8",
  "₉": "9",
  "ₐ": "a",
  "ₑ": "e",
  "ₕ": "h",
  "ᵢ": "i",
  "ⱼ": "j",
  "ₖ": "k",
  "ₗ": "l",
  "ₘ": "m",
  "ₙ": "n",
  "ₒ": "o",
  "ₚ": "p",
  "ᵣ": "r",
  "ₛ": "s",
  "ₜ": "t",
  "ᵤ": "u",
  "ᵥ": "v",
  "ₓ": "x",
  "ᵦ": "β",
  "ᵧ": "γ",
  "ᵨ": "ρ",
  "ᵩ": "ϕ",
  "ᵪ": "χ",
  "⁺": "+",
  "⁻": "-",
  "⁼": "=",
  "⁽": "(",
  "⁾": ")",
  "⁰": "0",
  "¹": "1",
  "²": "2",
  "³": "3",
  "⁴": "4",
  "⁵": "5",
  "⁶": "6",
  "⁷": "7",
  "⁸": "8",
  "⁹": "9",
  "ᴬ": "A",
  "ᴮ": "B",
  "ᴰ": "D",
  "ᴱ": "E",
  "ᴳ": "G",
  "ᴴ": "H",
  "ᴵ": "I",
  "ᴶ": "J",
  "ᴷ": "K",
  "ᴸ": "L",
  "ᴹ": "M",
  "ᴺ": "N",
  "ᴼ": "O",
  "ᴾ": "P",
  "ᴿ": "R",
  "ᵀ": "T",
  "ᵁ": "U",
  "ⱽ": "V",
  "ᵂ": "W",
  "ᵃ": "a",
  "ᵇ": "b",
  "ᶜ": "c",
  "ᵈ": "d",
  "ᵉ": "e",
  "ᶠ": "f",
  "ᵍ": "g",
  ʰ: "h",
  "ⁱ": "i",
  ʲ: "j",
  "ᵏ": "k",
  ˡ: "l",
  "ᵐ": "m",
  ⁿ: "n",
  "ᵒ": "o",
  "ᵖ": "p",
  ʳ: "r",
  ˢ: "s",
  "ᵗ": "t",
  "ᵘ": "u",
  "ᵛ": "v",
  ʷ: "w",
  ˣ: "x",
  ʸ: "y",
  "ᶻ": "z",
  "ᵝ": "β",
  "ᵞ": "γ",
  "ᵟ": "δ",
  "ᵠ": "ϕ",
  "ᵡ": "χ",
  "ᶿ": "θ"
}), Hr = {
  "́": {
    text: "\\'",
    math: "\\acute"
  },
  "̀": {
    text: "\\`",
    math: "\\grave"
  },
  "̈": {
    text: '\\"',
    math: "\\ddot"
  },
  "̃": {
    text: "\\~",
    math: "\\tilde"
  },
  "̄": {
    text: "\\=",
    math: "\\bar"
  },
  "̆": {
    text: "\\u",
    math: "\\breve"
  },
  "̌": {
    text: "\\v",
    math: "\\check"
  },
  "̂": {
    text: "\\^",
    math: "\\hat"
  },
  "̇": {
    text: "\\.",
    math: "\\dot"
  },
  "̊": {
    text: "\\r",
    math: "\\mathring"
  },
  "̋": {
    text: "\\H"
  },
  "̧": {
    text: "\\c"
  }
}, Rn = {
  á: "á",
  à: "à",
  ä: "ä",
  ǟ: "ǟ",
  ã: "ã",
  ā: "ā",
  ă: "ă",
  ắ: "ắ",
  ằ: "ằ",
  ẵ: "ẵ",
  ǎ: "ǎ",
  â: "â",
  ấ: "ấ",
  ầ: "ầ",
  ẫ: "ẫ",
  ȧ: "ȧ",
  ǡ: "ǡ",
  å: "å",
  ǻ: "ǻ",
  ḃ: "ḃ",
  ć: "ć",
  ḉ: "ḉ",
  č: "č",
  ĉ: "ĉ",
  ċ: "ċ",
  ç: "ç",
  ď: "ď",
  ḋ: "ḋ",
  ḑ: "ḑ",
  é: "é",
  è: "è",
  ë: "ë",
  ẽ: "ẽ",
  ē: "ē",
  ḗ: "ḗ",
  ḕ: "ḕ",
  ĕ: "ĕ",
  ḝ: "ḝ",
  ě: "ě",
  ê: "ê",
  ế: "ế",
  ề: "ề",
  ễ: "ễ",
  ė: "ė",
  ȩ: "ȩ",
  ḟ: "ḟ",
  ǵ: "ǵ",
  ḡ: "ḡ",
  ğ: "ğ",
  ǧ: "ǧ",
  ĝ: "ĝ",
  ġ: "ġ",
  ģ: "ģ",
  ḧ: "ḧ",
  ȟ: "ȟ",
  ĥ: "ĥ",
  ḣ: "ḣ",
  ḩ: "ḩ",
  í: "í",
  ì: "ì",
  ï: "ï",
  ḯ: "ḯ",
  ĩ: "ĩ",
  ī: "ī",
  ĭ: "ĭ",
  ǐ: "ǐ",
  î: "î",
  ǰ: "ǰ",
  ĵ: "ĵ",
  ḱ: "ḱ",
  ǩ: "ǩ",
  ķ: "ķ",
  ĺ: "ĺ",
  ľ: "ľ",
  ļ: "ļ",
  ḿ: "ḿ",
  ṁ: "ṁ",
  ń: "ń",
  ǹ: "ǹ",
  ñ: "ñ",
  ň: "ň",
  ṅ: "ṅ",
  ņ: "ņ",
  ó: "ó",
  ò: "ò",
  ö: "ö",
  ȫ: "ȫ",
  õ: "õ",
  ṍ: "ṍ",
  ṏ: "ṏ",
  ȭ: "ȭ",
  ō: "ō",
  ṓ: "ṓ",
  ṑ: "ṑ",
  ŏ: "ŏ",
  ǒ: "ǒ",
  ô: "ô",
  ố: "ố",
  ồ: "ồ",
  ỗ: "ỗ",
  ȯ: "ȯ",
  ȱ: "ȱ",
  ő: "ő",
  ṕ: "ṕ",
  ṗ: "ṗ",
  ŕ: "ŕ",
  ř: "ř",
  ṙ: "ṙ",
  ŗ: "ŗ",
  ś: "ś",
  ṥ: "ṥ",
  š: "š",
  ṧ: "ṧ",
  ŝ: "ŝ",
  ṡ: "ṡ",
  ş: "ş",
  ẗ: "ẗ",
  ť: "ť",
  ṫ: "ṫ",
  ţ: "ţ",
  ú: "ú",
  ù: "ù",
  ü: "ü",
  ǘ: "ǘ",
  ǜ: "ǜ",
  ǖ: "ǖ",
  ǚ: "ǚ",
  ũ: "ũ",
  ṹ: "ṹ",
  ū: "ū",
  ṻ: "ṻ",
  ŭ: "ŭ",
  ǔ: "ǔ",
  û: "û",
  ů: "ů",
  ű: "ű",
  ṽ: "ṽ",
  ẃ: "ẃ",
  ẁ: "ẁ",
  ẅ: "ẅ",
  ŵ: "ŵ",
  ẇ: "ẇ",
  ẘ: "ẘ",
  ẍ: "ẍ",
  ẋ: "ẋ",
  ý: "ý",
  ỳ: "ỳ",
  ÿ: "ÿ",
  ỹ: "ỹ",
  ȳ: "ȳ",
  ŷ: "ŷ",
  ẏ: "ẏ",
  ẙ: "ẙ",
  ź: "ź",
  ž: "ž",
  ẑ: "ẑ",
  ż: "ż",
  Á: "Á",
  À: "À",
  Ä: "Ä",
  Ǟ: "Ǟ",
  Ã: "Ã",
  Ā: "Ā",
  Ă: "Ă",
  Ắ: "Ắ",
  Ằ: "Ằ",
  Ẵ: "Ẵ",
  Ǎ: "Ǎ",
  Â: "Â",
  Ấ: "Ấ",
  Ầ: "Ầ",
  Ẫ: "Ẫ",
  Ȧ: "Ȧ",
  Ǡ: "Ǡ",
  Å: "Å",
  Ǻ: "Ǻ",
  Ḃ: "Ḃ",
  Ć: "Ć",
  Ḉ: "Ḉ",
  Č: "Č",
  Ĉ: "Ĉ",
  Ċ: "Ċ",
  Ç: "Ç",
  Ď: "Ď",
  Ḋ: "Ḋ",
  Ḑ: "Ḑ",
  É: "É",
  È: "È",
  Ë: "Ë",
  Ẽ: "Ẽ",
  Ē: "Ē",
  Ḗ: "Ḗ",
  Ḕ: "Ḕ",
  Ĕ: "Ĕ",
  Ḝ: "Ḝ",
  Ě: "Ě",
  Ê: "Ê",
  Ế: "Ế",
  Ề: "Ề",
  Ễ: "Ễ",
  Ė: "Ė",
  Ȩ: "Ȩ",
  Ḟ: "Ḟ",
  Ǵ: "Ǵ",
  Ḡ: "Ḡ",
  Ğ: "Ğ",
  Ǧ: "Ǧ",
  Ĝ: "Ĝ",
  Ġ: "Ġ",
  Ģ: "Ģ",
  Ḧ: "Ḧ",
  Ȟ: "Ȟ",
  Ĥ: "Ĥ",
  Ḣ: "Ḣ",
  Ḩ: "Ḩ",
  Í: "Í",
  Ì: "Ì",
  Ï: "Ï",
  Ḯ: "Ḯ",
  Ĩ: "Ĩ",
  Ī: "Ī",
  Ĭ: "Ĭ",
  Ǐ: "Ǐ",
  Î: "Î",
  İ: "İ",
  Ĵ: "Ĵ",
  Ḱ: "Ḱ",
  Ǩ: "Ǩ",
  Ķ: "Ķ",
  Ĺ: "Ĺ",
  Ľ: "Ľ",
  Ļ: "Ļ",
  Ḿ: "Ḿ",
  Ṁ: "Ṁ",
  Ń: "Ń",
  Ǹ: "Ǹ",
  Ñ: "Ñ",
  Ň: "Ň",
  Ṅ: "Ṅ",
  Ņ: "Ņ",
  Ó: "Ó",
  Ò: "Ò",
  Ö: "Ö",
  Ȫ: "Ȫ",
  Õ: "Õ",
  Ṍ: "Ṍ",
  Ṏ: "Ṏ",
  Ȭ: "Ȭ",
  Ō: "Ō",
  Ṓ: "Ṓ",
  Ṑ: "Ṑ",
  Ŏ: "Ŏ",
  Ǒ: "Ǒ",
  Ô: "Ô",
  Ố: "Ố",
  Ồ: "Ồ",
  Ỗ: "Ỗ",
  Ȯ: "Ȯ",
  Ȱ: "Ȱ",
  Ő: "Ő",
  Ṕ: "Ṕ",
  Ṗ: "Ṗ",
  Ŕ: "Ŕ",
  Ř: "Ř",
  Ṙ: "Ṙ",
  Ŗ: "Ŗ",
  Ś: "Ś",
  Ṥ: "Ṥ",
  Š: "Š",
  Ṧ: "Ṧ",
  Ŝ: "Ŝ",
  Ṡ: "Ṡ",
  Ş: "Ş",
  Ť: "Ť",
  Ṫ: "Ṫ",
  Ţ: "Ţ",
  Ú: "Ú",
  Ù: "Ù",
  Ü: "Ü",
  Ǘ: "Ǘ",
  Ǜ: "Ǜ",
  Ǖ: "Ǖ",
  Ǚ: "Ǚ",
  Ũ: "Ũ",
  Ṹ: "Ṹ",
  Ū: "Ū",
  Ṻ: "Ṻ",
  Ŭ: "Ŭ",
  Ǔ: "Ǔ",
  Û: "Û",
  Ů: "Ů",
  Ű: "Ű",
  Ṽ: "Ṽ",
  Ẃ: "Ẃ",
  Ẁ: "Ẁ",
  Ẅ: "Ẅ",
  Ŵ: "Ŵ",
  Ẇ: "Ẇ",
  Ẍ: "Ẍ",
  Ẋ: "Ẋ",
  Ý: "Ý",
  Ỳ: "Ỳ",
  Ÿ: "Ÿ",
  Ỹ: "Ỹ",
  Ȳ: "Ȳ",
  Ŷ: "Ŷ",
  Ẏ: "Ẏ",
  Ź: "Ź",
  Ž: "Ž",
  Ẑ: "Ẑ",
  Ż: "Ż",
  ά: "ά",
  ὰ: "ὰ",
  ᾱ: "ᾱ",
  ᾰ: "ᾰ",
  έ: "έ",
  ὲ: "ὲ",
  ή: "ή",
  ὴ: "ὴ",
  ί: "ί",
  ὶ: "ὶ",
  ϊ: "ϊ",
  ΐ: "ΐ",
  ῒ: "ῒ",
  ῑ: "ῑ",
  ῐ: "ῐ",
  ό: "ό",
  ὸ: "ὸ",
  ύ: "ύ",
  ὺ: "ὺ",
  ϋ: "ϋ",
  ΰ: "ΰ",
  ῢ: "ῢ",
  ῡ: "ῡ",
  ῠ: "ῠ",
  ώ: "ώ",
  ὼ: "ὼ",
  Ύ: "Ύ",
  Ὺ: "Ὺ",
  Ϋ: "Ϋ",
  Ῡ: "Ῡ",
  Ῠ: "Ῠ",
  Ώ: "Ώ",
  Ὼ: "Ὼ"
};
class br {
  constructor(e, t) {
    this.mode = void 0, this.gullet = void 0, this.settings = void 0, this.leftrightDepth = void 0, this.nextToken = void 0, this.mode = "math", this.gullet = new Yl(e, t, this.mode), this.settings = t, this.leftrightDepth = 0, this.nextToken = null;
  }
  /**
   * Checks a result to make sure it has the right type, and throws an
   * appropriate error otherwise.
   */
  expect(e, t) {
    if (t === void 0 && (t = !0), this.fetch().text !== e)
      throw new B("Expected '" + e + "', got '" + this.fetch().text + "'", this.fetch());
    t && this.consume();
  }
  /**
   * Discards the current lookahead token, considering it consumed.
   */
  consume() {
    this.nextToken = null;
  }
  /**
   * Return the current lookahead token, or if there isn't one (at the
   * beginning, or if the previous lookahead token was consume()d),
   * fetch the next token as the new lookahead token and return it.
   */
  fetch() {
    return this.nextToken == null && (this.nextToken = this.gullet.expandNextToken()), this.nextToken;
  }
  /**
   * Switches between "text" and "math" modes.
   */
  switchMode(e) {
    this.mode = e, this.gullet.switchMode(e);
  }
  /**
   * Main parsing function, which parses an entire input.
   */
  parse() {
    this.settings.globalGroup || this.gullet.beginGroup(), this.settings.colorIsTextColor && this.gullet.macros.set("\\color", "\\textcolor");
    try {
      var e = this.parseExpression(!1);
      return this.expect("EOF"), this.settings.globalGroup || this.gullet.endGroup(), e;
    } finally {
      this.gullet.endGroups();
    }
  }
  /**
   * Fully parse a separate sequence of tokens as a separate job.
   * Tokens should be specified in reverse order, as in a MacroDefinition.
   */
  subparse(e) {
    var t = this.nextToken;
    this.consume(), this.gullet.pushToken(new Ke("}")), this.gullet.pushTokens(e);
    var r = this.parseExpression(!1);
    return this.expect("}"), this.nextToken = t, r;
  }
  /**
   * Parses an "expression", which is a list of atoms.
   *
   * `breakOnInfix`: Should the parsing stop when we hit infix nodes? This
   *                 happens when functions have higher precedence than infix
   *                 nodes in implicit parses.
   *
   * `breakOnTokenText`: The text of the token that the expression should end
   *                     with, or `null` if something else should end the
   *                     expression.
   */
  parseExpression(e, t) {
    for (var r = []; ; ) {
      this.mode === "math" && this.consumeSpaces();
      var i = this.fetch();
      if (br.endOfExpression.has(i.text) || t && i.text === t || e && zt[i.text] && zt[i.text].infix)
        break;
      var n = this.parseAtom(t);
      if (n) {
        if (n.type === "internal")
          continue;
      } else break;
      r.push(n);
    }
    return this.mode === "text" && this.formLigatures(r), this.handleInfixNodes(r);
  }
  /**
   * Rewrites infix operators such as \over with corresponding commands such
   * as \frac.
   *
   * There can only be one infix operator per group.  If there's more than one
   * then the expression is ambiguous.  This can be resolved by adding {}.
   */
  handleInfixNodes(e) {
    for (var t = -1, r, i = 0; i < e.length; i++) {
      var n = e[i];
      if (n.type === "infix") {
        if (t !== -1)
          throw new B("only one infix operator per group", n.token);
        t = i, r = n.replaceWith;
      }
    }
    if (t !== -1 && r) {
      var l, u, d = e.slice(0, t), p = e.slice(t + 1);
      d.length === 1 && d[0].type === "ordgroup" ? l = d[0] : l = {
        type: "ordgroup",
        mode: this.mode,
        body: d
      }, p.length === 1 && p[0].type === "ordgroup" ? u = p[0] : u = {
        type: "ordgroup",
        mode: this.mode,
        body: p
      };
      var f;
      return r === "\\\\abovefrac" ? f = this.callFunction(r, [l, e[t], u], []) : f = this.callFunction(r, [l, u], []), [f];
    } else
      return e;
  }
  /**
   * Handle a subscript or superscript with nice errors.
   */
  handleSupSubscript(e) {
    var t = this.fetch(), r = t.text;
    this.consume(), this.consumeSpaces();
    var i;
    do {
      var n;
      i = this.parseGroup(e);
    } while (((n = i) == null ? void 0 : n.type) === "internal");
    if (!i)
      throw new B("Expected group after '" + r + "'", t);
    return i;
  }
  /**
   * Converts the textual input of an unsupported command into a text node
   * contained within a color node whose color is determined by errorColor
   */
  formatUnsupportedCmd(e) {
    for (var t = [], r = 0; r < e.length; r++)
      t.push({
        type: "textord",
        mode: "text",
        text: e[r]
      });
    var i = {
      type: "text",
      mode: this.mode,
      body: t
    }, n = {
      type: "color",
      mode: this.mode,
      color: this.settings.errorColor,
      body: [i]
    };
    return n;
  }
  /**
   * Parses a group with optional super/subscripts.
   */
  parseAtom(e) {
    var t = this.parseGroup("atom", e);
    if ((t == null ? void 0 : t.type) === "internal" || this.mode === "text")
      return t;
    for (var r, i; ; ) {
      this.consumeSpaces();
      var n = this.fetch();
      if (n.text === "\\limits" || n.text === "\\nolimits") {
        if (t && t.type === "op") {
          var l = n.text === "\\limits";
          t.limits = l, t.alwaysHandleSupSub = !0;
        } else if (t && t.type === "operatorname")
          t.alwaysHandleSupSub && (t.limits = n.text === "\\limits");
        else
          throw new B("Limit controls must follow a math operator", n);
        this.consume();
      } else if (n.text === "^") {
        if (r)
          throw new B("Double superscript", n);
        r = this.handleSupSubscript("superscript");
      } else if (n.text === "_") {
        if (i)
          throw new B("Double subscript", n);
        i = this.handleSupSubscript("subscript");
      } else if (n.text === "'") {
        if (r)
          throw new B("Double superscript", n);
        var u = {
          type: "textord",
          mode: this.mode,
          text: "\\prime"
        }, d = [u];
        for (this.consume(); this.fetch().text === "'"; )
          d.push(u), this.consume();
        this.fetch().text === "^" && d.push(this.handleSupSubscript("superscript")), r = {
          type: "ordgroup",
          mode: this.mode,
          body: d
        };
      } else if (Ga[n.text]) {
        var p = En.test(n.text), f = [];
        for (f.push(new Ke(Ga[n.text])), this.consume(); ; ) {
          var b = this.fetch().text;
          if (!Ga[b] || En.test(b) !== p)
            break;
          f.unshift(new Ke(Ga[b])), this.consume();
        }
        var S = this.subparse(f);
        p ? i = {
          type: "ordgroup",
          mode: "math",
          body: S
        } : r = {
          type: "ordgroup",
          mode: "math",
          body: S
        };
      } else
        break;
    }
    return r || i ? {
      type: "supsub",
      mode: this.mode,
      base: t,
      sup: r,
      sub: i
    } : t;
  }
  /**
   * Parses an entire function, including its base and all of its arguments.
   */
  parseFunction(e, t) {
    var r = this.fetch(), i = r.text, n = zt[i];
    if (!n)
      return null;
    if (this.consume(), t && t !== "atom" && !n.allowedInArgument)
      throw new B("Got function '" + i + "' with no arguments" + (t ? " as " + t : ""), r);
    if (this.mode === "text" && !n.allowedInText)
      throw new B("Can't use function '" + i + "' in text mode", r);
    if (this.mode === "math" && n.allowedInMath === !1)
      throw new B("Can't use function '" + i + "' in math mode", r);
    var {
      args: l,
      optArgs: u
    } = this.parseArguments(i, n);
    return this.callFunction(i, l, u, r, e);
  }
  /**
   * Call a function handler with a suitable context and arguments.
   */
  callFunction(e, t, r, i, n) {
    var l = {
      funcName: e,
      parser: this,
      token: i,
      breakOnTokenText: n
    }, u = zt[e];
    if (u && u.handler)
      return u.handler(l, t, r);
    throw new B("No function handler for " + e);
  }
  /**
   * Parses the arguments of a function or environment
   */
  parseArguments(e, t) {
    var r = t.numArgs + t.numOptionalArgs;
    if (r === 0)
      return {
        args: [],
        optArgs: []
      };
    for (var i = [], n = [], l = 0; l < r; l++) {
      var u = t.argTypes && t.argTypes[l], d = l < t.numOptionalArgs;
      ("primitive" in t && t.primitive && u == null || // \sqrt expands into primitive if optional argument doesn't exist
      t.type === "sqrt" && l === 1 && n[0] == null) && (u = "primitive");
      var p = this.parseGroupOfType("argument to '" + e + "'", u, d);
      if (d)
        n.push(p);
      else if (p != null)
        i.push(p);
      else
        throw new B("Null argument, please report this as a bug");
    }
    return {
      args: i,
      optArgs: n
    };
  }
  /**
   * Parses a group when the mode is changing.
   */
  parseGroupOfType(e, t, r) {
    switch (t) {
      case "color":
        return this.parseColorGroup(r);
      case "size":
        return this.parseSizeGroup(r);
      case "url":
        return this.parseUrlGroup(r);
      case "math":
      case "text":
        return this.parseArgumentGroup(r, t);
      case "hbox": {
        var i = this.parseArgumentGroup(r, "text");
        return i != null ? {
          type: "styling",
          mode: i.mode,
          body: [i],
          style: "text",
          // simulate \textstyle
          resetFont: !0
        } : null;
      }
      case "raw": {
        var n = this.parseStringGroup("raw", r);
        return n != null ? {
          type: "raw",
          mode: "text",
          string: n.text
        } : null;
      }
      case "primitive": {
        if (r)
          throw new B("A primitive argument cannot be optional");
        var l = this.parseGroup(e);
        if (l == null)
          throw new B("Expected group as " + e, this.fetch());
        return l;
      }
      case "original":
      case null:
      case void 0:
        return this.parseArgumentGroup(r);
      default:
        throw new B("Unknown group type as " + e, this.fetch());
    }
  }
  /**
   * Discard any space tokens, fetching the next non-space token.
   */
  consumeSpaces() {
    for (; this.fetch().text === " "; )
      this.consume();
  }
  /**
   * Parses a group, essentially returning the string formed by the
   * brace-enclosed tokens plus some position information.
   */
  parseStringGroup(e, t) {
    var r = this.gullet.scanArgument(t);
    if (r == null)
      return null;
    for (var i = "", n; (n = this.fetch()).text !== "EOF"; )
      i += n.text, this.consume();
    return this.consume(), r.text = i, r;
  }
  /**
   * Parses a regex-delimited group: the largest sequence of tokens
   * whose concatenated strings match `regex`. Returns the string
   * formed by the tokens plus some position information.
   */
  parseRegexGroup(e, t) {
    for (var r = this.fetch(), i = r, n = "", l; (l = this.fetch()).text !== "EOF" && e.test(n + l.text); )
      i = l, n += i.text, this.consume();
    if (n === "")
      throw new B("Invalid " + t + ": '" + r.text + "'", r);
    return r.range(i, n);
  }
  /**
   * Parses a color description.
   */
  parseColorGroup(e) {
    var t = this.parseStringGroup("color", e);
    if (t == null)
      return null;
    var r = /^(#[a-f0-9]{3,4}|#[a-f0-9]{6}|#[a-f0-9]{8}|[a-f0-9]{6}|[a-z]+)$/i.exec(t.text);
    if (!r)
      throw new B("Invalid color: '" + t.text + "'", t);
    var i = r[0];
    return /^[0-9a-f]{6}$/i.test(i) && (i = "#" + i), {
      type: "color-token",
      mode: this.mode,
      color: i
    };
  }
  /**
   * Parses a size specification, consisting of magnitude and unit.
   */
  parseSizeGroup(e) {
    var t, r = !1;
    if (this.gullet.consumeSpaces(), !e && this.gullet.future().text !== "{" ? t = this.parseRegexGroup(/^[-+]? *(?:$|\d+|\d+\.\d*|\.\d*) *[a-z]{0,2} *$/, "size") : t = this.parseStringGroup("size", e), !t)
      return null;
    !e && t.text.length === 0 && (t.text = "0pt", r = !0);
    var i = /([-+]?) *(\d+(?:\.\d*)?|\.\d+) *([a-z]{2})/.exec(t.text);
    if (!i)
      throw new B("Invalid size: '" + t.text + "'", t);
    var n = {
      number: +(i[1] + i[2]),
      // sign + magnitude, cast to number
      unit: i[3]
    };
    if (!as(n))
      throw new B("Invalid unit: '" + n.unit + "'", t);
    return {
      type: "size",
      mode: this.mode,
      value: n,
      isBlank: r
    };
  }
  /**
   * Parses an URL, checking escaped letters and allowed protocols,
   * and setting the catcode of % as an active character (as in \hyperref).
   */
  parseUrlGroup(e) {
    this.gullet.lexer.setCatcode("%", 13), this.gullet.lexer.setCatcode("~", 12);
    var t = this.parseStringGroup("url", e);
    if (this.gullet.lexer.setCatcode("%", 14), this.gullet.lexer.setCatcode("~", 13), t == null)
      return null;
    var r = t.text.replace(/\\([#$%&~_^{}])/g, "$1");
    return {
      type: "url",
      mode: this.mode,
      url: r
    };
  }
  /**
   * Parses an argument with the mode specified.
   */
  parseArgumentGroup(e, t) {
    var r = this.gullet.scanArgument(e);
    if (r == null)
      return null;
    var i = this.mode;
    t && this.switchMode(t), this.gullet.beginGroup();
    var n = this.parseExpression(!1, "EOF");
    this.expect("EOF"), this.gullet.endGroup();
    var l = {
      type: "ordgroup",
      mode: this.mode,
      loc: r.loc,
      body: n
    };
    return t && this.switchMode(i), l;
  }
  /**
   * Parses an ordinary group, which is either a single nucleus (like "x")
   * or an expression in braces (like "{x+y}") or an implicit group, a group
   * that starts at the current position, and ends right before a higher explicit
   * group ends, or at EOF.
   */
  parseGroup(e, t) {
    var r = this.fetch(), i = r.text, n;
    if (i === "{" || i === "\\begingroup") {
      this.consume();
      var l = i === "{" ? "}" : "\\endgroup";
      this.gullet.beginGroup();
      var u = this.parseExpression(!1, l), d = this.fetch();
      this.expect(l), this.gullet.endGroup(), n = {
        type: "ordgroup",
        mode: this.mode,
        loc: Ye.range(r, d),
        body: u,
        // A group formed by \begingroup...\endgroup is a semi-simple group
        // which doesn't affect spacing in math mode, i.e., is transparent.
        // https://tex.stackexchange.com/questions/1930/when-should-one-
        // use-begingroup-instead-of-bgroup
        semisimple: i === "\\begingroup" || void 0
      };
    } else if (n = this.parseFunction(t, e) || this.parseSymbol(), n == null && i[0] === "\\" && !Ks.hasOwnProperty(i)) {
      if (this.settings.throwOnError)
        throw new B("Undefined control sequence: " + i, r);
      n = this.formatUnsupportedCmd(i), this.consume();
    }
    return n;
  }
  /**
   * Form ligature-like combinations of characters for text mode.
   * This includes inputs like "--", "---", "``" and "''".
   * The result will simply replace multiple textord nodes with a single
   * character in each value by a single textord node having multiple
   * characters in its value.  The representation is still ASCII source.
   * The group will be modified in place.
   */
  formLigatures(e) {
    for (var t = e.length - 1, r = 0; r < t; ++r) {
      var i = e[r];
      if (i.type === "textord") {
        var n = i.text, l = e[r + 1];
        if (!(!l || l.type !== "textord")) {
          if (n === "-" && l.text === "-") {
            var u = e[r + 2];
            r + 1 < t && u && u.type === "textord" && u.text === "-" ? (e.splice(r, 3, {
              type: "textord",
              mode: "text",
              loc: Ye.range(i, u),
              text: "---"
            }), t -= 2) : (e.splice(r, 2, {
              type: "textord",
              mode: "text",
              loc: Ye.range(i, l),
              text: "--"
            }), t -= 1);
          }
          (n === "'" || n === "`") && l.text === n && (e.splice(r, 2, {
            type: "textord",
            mode: "text",
            loc: Ye.range(i, l),
            text: n + n
          }), t -= 1);
        }
      }
    }
  }
  /**
   * Parse a single symbol out of the string. Here, we handle single character
   * symbols and special functions like \verb.
   */
  parseSymbol() {
    var e = this.fetch(), t = e.text;
    if (/^\\verb[^a-zA-Z]/.test(t)) {
      this.consume();
      var r = t.slice(5), i = r.charAt(0) === "*";
      if (i && (r = r.slice(1)), r.length < 2 || r.charAt(0) !== r.slice(-1))
        throw new B(`\\verb assertion failed --
                    please report what input caused this bug`);
      return r = r.slice(1, -1), {
        type: "verb",
        mode: "text",
        body: r,
        star: i
      };
    }
    Rn.hasOwnProperty(t[0]) && !ve[this.mode][t[0]] && (this.settings.strict && this.mode === "math" && this.settings.reportNonstrict("unicodeTextInMathMode", 'Accented Unicode text character "' + t[0] + '" used in math mode', e), t = Rn[t[0]] + t.slice(1));
    var n = $l.exec(t);
    n && (t = t.substring(0, n.index), t === "i" ? t = "ı" : t === "j" && (t = "ȷ"));
    var l;
    if (ve[this.mode][t]) {
      this.settings.strict && this.mode === "math" && Jr.includes(t) && this.settings.reportNonstrict("unicodeTextInMathMode", 'Latin-1/Unicode text character "' + t[0] + '" used in math mode', e);
      var u = ve[this.mode][t].group, d = Ye.range(e), p;
      cl(u) ? p = {
        type: "atom",
        mode: this.mode,
        family: u,
        loc: d,
        text: t
      } : p = {
        type: u,
        mode: this.mode,
        loc: d,
        text: t
      }, l = p;
    } else if (t.charCodeAt(0) >= 128)
      this.settings.strict && (ts(t.charCodeAt(0)) ? this.mode === "math" && this.settings.reportNonstrict("unicodeTextInMathMode", 'Unicode text character "' + t[0] + '" used in math mode', e) : this.settings.reportNonstrict("unknownSymbol", 'Unrecognized Unicode character "' + t[0] + '"' + (" (" + t.charCodeAt(0) + ")"), e)), l = {
        type: "textord",
        mode: "text",
        loc: Ye.range(e),
        text: t
      };
    else
      return null;
    if (this.consume(), n)
      for (var f = 0; f < n[0].length; f++) {
        var b = n[0][f];
        if (!Hr[b])
          throw new B("Unknown accent ' " + b + "'", e);
        var S = Hr[b][this.mode] || Hr[b].text;
        if (!S)
          throw new B("Accent " + b + " unsupported in " + this.mode + " mode", e);
        l = {
          type: "accent",
          mode: this.mode,
          loc: Ye.range(e),
          label: S,
          isStretchy: !1,
          isShifty: !0,
          base: l
        };
      }
    return l;
  }
}
br.endOfExpression = /* @__PURE__ */ new Set(["}", "\\endgroup", "\\end", "\\right", "&"]);
var ji = function(e, t) {
  if (!(typeof e == "string" || e instanceof String))
    throw new TypeError("KaTeX can only parse string typed expression");
  var r = new br(e, t);
  delete r.gullet.macros.current["\\df@tag"];
  var i = r.parse();
  if (delete r.gullet.macros.current["\\current@color"], delete r.gullet.macros.current["\\color"], r.gullet.macros.get("\\df@tag")) {
    if (!t.displayMode)
      throw new B("\\tag works only in display equations");
    i = [{
      type: "tag",
      mode: "text",
      body: i,
      tag: r.subparse([new Ke("\\df@tag")])
    }];
  }
  return i;
}, Xs = function(e, t, r) {
  t.textContent = "";
  var i = Ei(e, r).toNode();
  t.appendChild(i);
};
typeof document < "u" && document.compatMode !== "CSS1Compat" && (typeof console < "u" && console.warn("Warning: KaTeX doesn't work in quirks mode. Make sure your website has a suitable doctype."), Xs = function() {
  throw new B("KaTeX doesn't work in quirks mode.");
});
var Kl = function(e, t) {
  var r = Ei(e, t).toMarkup();
  return r;
}, Xl = function(e, t) {
  var r = new gi(t);
  return ji(e, r);
}, _s = function(e, t, r) {
  if (r.throwOnError || !(e instanceof B))
    throw e;
  var i = E(["katex-error"], [new Xe(t)]);
  return i.setAttribute("title", e.toString()), i.setAttribute("style", "color:" + r.errorColor), i;
}, Ei = function(e, t) {
  var r = new gi(t);
  try {
    var i = ji(e, r);
    return tl(i, e, r);
  } catch (n) {
    return _s(n, e, r);
  }
}, _l = function(e, t) {
  var r = new gi(t);
  try {
    var i = ji(e, r);
    return al(i, e, r);
  } catch (n) {
    return _s(n, e, r);
  }
}, Zl = "0.16.47", Jl = {
  Span: la,
  Anchor: sr,
  SymbolNode: Xe,
  SvgNode: xt,
  PathNode: jt,
  LineNode: Zr
}, Ql = {
  /**
   * Current KaTeX version
   */
  version: Zl,
  /**
   * Renders the given LaTeX into an HTML+MathML combination, and adds
   * it as a child to the specified DOM node.
   */
  render: Xs,
  /**
   * Renders the given LaTeX into an HTML+MathML combination string,
   * for sending to the client.
   */
  renderToString: Kl,
  /**
   * KaTeX error, usually during parsing.
   */
  ParseError: B,
  /**
   * The schema of Settings
   */
  SETTINGS_SCHEMA: Kr,
  /**
   * Parses the given LaTeX into KaTeX's internal parse tree structure,
   * without rendering to HTML or MathML.
   *
   * NOTE: This method is not currently recommended for public use.
   * The internal tree representation is unstable and is very likely
   * to change. Use at your own risk.
   */
  __parse: Xl,
  /**
   * Renders the given LaTeX into an HTML+MathML internal DOM tree
   * representation, without flattening that representation to a string.
   *
   * NOTE: This method is not currently recommended for public use.
   * The internal tree representation is unstable and is very likely
   * to change. Use at your own risk.
   */
  __renderToDomTree: Ei,
  /**
   * Renders the given LaTeX into an HTML internal DOM tree representation,
   * without MathML and without flattening that representation to a string.
   *
   * NOTE: This method is not currently recommended for public use.
   * The internal tree representation is unstable and is very likely
   * to change. Use at your own risk.
   */
  __renderToHTMLTree: _l,
  /**
   * extends internal font metrics object with a new object
   * each key in the new object represents a font name
  */
  __setFontMetrics: I0,
  /**
   * adds a new symbol to builtin symbols table
   */
  __defineSymbol: s,
  /**
   * adds a new function to builtin function list,
   * which directly produce parse tree elements
   * and have their own html/mathml builders
   */
  __defineFunction: H,
  /**
   * adds a new macro to builtin macro list
   */
  __defineMacro: m,
  /**
   * Expose the dom tree node types, which can be useful for type checking nodes.
   *
   * NOTE: These methods are not currently recommended for public use.
   * The internal tree representation is unstable and is very likely
   * to change. Use at your own risk.
   */
  __domTree: Jl
};
function ec({
  value: a,
  display: e = !1,
  className: t = ""
}) {
  const r = Yr(() => tc(a), [a]), i = Yr(() => {
    try {
      return Ql.renderToString(r, {
        throwOnError: !1,
        displayMode: e
      });
    } catch {
      return null;
    }
  }, [e, r]);
  return i ? /* @__PURE__ */ o.jsx(
    "span",
    {
      className: `math-expression inline-block max-w-full overflow-x-auto overflow-y-hidden align-middle [&_.katex-display]:my-0 ${t}`,
      tabIndex: 0,
      dangerouslySetInnerHTML: { __html: i }
    }
  ) : /* @__PURE__ */ o.jsx("span", { className: t, children: a });
}
function tc(a) {
  return a.replace(/₹/g, String.raw`\text{Rs.}`).replace(new RegExp("(?<!\\\\)%", "g"), String.raw`\%`).replace(/[–—]/g, "-").replace(/∥/g, String.raw`\parallel{}`).replace(/′/g, "'").replace(/″/g, "''").replace(/√\(([^()]+)\)/g, String.raw`\sqrt{$1}`).replace(/√([A-Za-z0-9]+)/g, String.raw`\sqrt{$1}`).replace(/!=/g, "\\ne").replace(/<=/g, "\\le").replace(/>=/g, "\\ge").replace(/->|=>/g, "\\to ").replace(/\bIntegral\b/g, "\\int").replace(/\bintegral\b/g, "\\int").replace(/\bsum\b/g, "\\sum").replace(/\binf\b/g, "\\infty").replace(/\bDelta\b/g, "\\Delta").replace(new RegExp("(?<!\\\\)\\btheta\\b", "g"), "\\theta").replace(new RegExp("(?<!\\\\)\\balpha\\b", "g"), "\\alpha").replace(new RegExp("(?<!\\\\)\\bbeta\\b", "g"), "\\beta").replace(new RegExp("(?<!\\\\)\\bphi\\b", "g"), "\\phi").replace(new RegExp("(?<!\\\\)\\bmu\\b", "g"), "\\mu").replace(new RegExp("(?<!\\\\)\\bsigma\\b", "g"), "\\sigma").replace(new RegExp("(?<!\\\\)\\bpi\\b", "g"), "\\pi").replace(new RegExp("(?<!\\\\)\\bsin\\b", "g"), "\\sin").replace(new RegExp("(?<!\\\\)\\bcos\\b", "g"), "\\cos").replace(new RegExp("(?<!\\\\)\\btan\\b", "g"), "\\tan").replace(new RegExp("(?<!\\\\)\\bsec\\b", "g"), "\\sec").replace(new RegExp("(?<!\\\\)\\bcsc\\b", "g"), "\\csc").replace(new RegExp("(?<!\\\\)\\bcosec\\b", "g"), "\\csc").replace(new RegExp("(?<!\\\\)\\bcot\\b", "g"), "\\cot").replace(new RegExp("(?<!\\\\)\\blog\\b", "g"), "\\log").replace(new RegExp("(?<!\\\\)\\bln\\b", "g"), "\\ln").replace(/\(([^()]+)\)\s*\/\s*\(([^()]+)\)/g, "\\frac{$1}{$2}").replace(/\(([^()]+)\)\s*\/\s*(-?\d+(?:\.\d+)?)/g, "\\frac{$1}{$2}").replace(/(-?\d+(?:\.\d+)?)\s*\/\s*(-?\d+(?:\.\d+)?)/g, "\\frac{$1}{$2}").replace(/([A-Za-z0-9πθλμσ²³⁴⁵⁶⁷⁸⁹₀₁₂₃₄₅₆₇₈₉]+)\s*\/\s*(-?\d+(?:\.\d+)?)/g, "\\frac{$1}{$2}").replace(/(-?\d+(?:\.\d+)?)\s*\/\s*(\\sqrt\{[^{}]+\})/g, "\\frac{$1}{$2}").replace(/\b([A-Za-z][A-Za-z0-9_^{}]*)\s*\/\s*([A-Za-z][A-Za-z0-9_^{}]*)\b/g, "\\frac{$1}{$2}").replace(
    /([A-Za-z0-9]+)\s*\/\s*(\\(?:sin|cos|tan|sec|csc|cot)\s*[A-Za-z])/g,
    "\\frac{$1}{$2}"
  ).replace(/\\theta\s*\/\s*2/g, "\\frac{\\theta}{2}").replace(/\b2\s*pi\b/g, "2\\pi").replace(/\bsqrt\(([^()]+)\)/g, "\\sqrt{$1}").replace(/\bcbrt\(([^()]+)\)/g, "\\sqrt[3]{$1}").replace(/\bsin\^-1\b/g, "\\sin^{-1}").replace(/\bcos\^-1\b/g, "\\cos^{-1}").replace(/\btan\^-1\b/g, "\\tan^{-1}").replace(/\^\(([^()]+)\)/g, "^{$1}").replace(/\*/g, "\\cdot ");
}
const Dt = (a) => a * Math.PI / 180, Zs = (a) => a * 180 / Math.PI, q = (a, e = 2) => Number.isFinite(a) ? Number(a.toFixed(e)).toString() : "—", Vt = 1e-10, Yt = (...a) => a.every((e) => Number.isFinite(e) && e > 0), Js = (a) => Number.isFinite(a) && Math.abs(a) <= 1 + Vt ? Math.max(-1, Math.min(1, a)) : null;
function Ri(a, e, t) {
  const r = Math.max(a, e, t);
  return Yt(a, e, t) && a / r + e / r > t / r + Vt && a / r + t / r > e / r + Vt && e / r + t / r > a / r + Vt;
}
function Qs(a, e, t) {
  return Yt(a, e, t) && Math.abs(a + e + t - 180) < 1e-7;
}
function mi(a, e, t) {
  return Yt(a, e, t) && e < 180 && t < 180 ? a * Math.sin(Dt(t)) / Math.sin(Dt(e)) : NaN;
}
function ac(a, e, t) {
  return Yt(a, e, t) && t < 180 ? Math.hypot(a - e, 2 * Math.sqrt(a) * Math.sqrt(e) * Math.sin(Dt(t / 2))) : NaN;
}
function Dn(a, e, t) {
  if (!Ri(a, e, t)) return NaN;
  const r = Math.max(a, e, t), i = a / r, n = e / r, l = t / r, u = Js((n * n + l * l - i * i) / (2 * n * l));
  return u === null ? NaN : Zs(Math.acos(u));
}
const eo = (a, e, t) => Yt(a, e, t) && t < 180 ? 0.5 * a * e * Math.sin(Dt(t)) : NaN;
function yr(a, e, t) {
  if (!Ri(a, e, t)) return null;
  const r = Dn(a, e, t), i = Dn(e, t, a), n = 180 - r - i, l = eo(e, t, r);
  return Qs(r, i, n) && Number.isFinite(l) ? { a, b: e, c: t, A: r, B: i, C: n, area: l } : null;
}
function Ta(a, e, t) {
  const r = 180 - a - e;
  if (!Qs(a, e, r) || !Yt(t)) return null;
  const i = mi(t, a, e), n = mi(t, a, r), l = eo(i, n, a);
  return Ri(t, i, n) && Number.isFinite(l) ? { a: t, b: i, c: n, A: a, B: e, C: r, area: l } : null;
}
function Di(a, e, t) {
  const r = ac(a, e, t);
  return yr(r, a, e);
}
function sa(a, e, t) {
  if (!Yt(a, e, t) || a >= 180) return [];
  const r = Js(t / e * Math.sin(Dt(a)));
  if (r === null) return [];
  const i = Zs(Math.asin(Math.abs(1 - r) <= Vt ? 1 : r));
  return [i, 180 - i].filter((n, l, u) => n > Vt && a + n < 180 - Vt && (l === 0 || Math.abs(n - u[0]) > 1e-7)).map((n) => Ta(a, n, e)).filter((n) => n !== null);
}
function rc(a, e) {
  const { a: t, b: r, c: i, A: n, B: l } = e, u = a === "ASA" ? Ta(n, l, mi(i, 180 - n - l, n)) : a === "AAS" ? Ta(n, l, t) : a === "SAS" ? Di(r, i, n) : a === "SSS" ? yr(t, r, i) : null;
  return a === "SSA" ? sa(n, t, r) : u ? [u] : [];
}
function $r(a) {
  return { A: { x: 0, y: 0 }, B: { x: a.c, y: 0 }, C: { x: a.b * Math.cos(Dt(a.A)), y: -a.b * Math.sin(Dt(a.A)) } };
}
function to(a) {
  const e = (t, r) => Math.hypot(t.x - r.x, t.y - r.y);
  return yr(e(a.B, a.C), e(a.C, a.A), e(a.A, a.B));
}
function ic(a, e, t, r) {
  const i = Di(a, e, t);
  return i ? r === "A" ? i : r === "B" ? { a: i.c, b: i.a, c: i.b, A: i.C, B: i.A, C: i.B, area: i.area } : { a: i.b, b: i.c, c: i.a, A: i.B, B: i.C, C: i.A, area: i.area } : null;
}
function nc(a) {
  const { A: e, B: t, C: r } = a, i = 2 * (e.x * (t.y - r.y) + t.x * (r.y - e.y) + r.x * (e.y - t.y));
  if (Math.abs(i) < 1e-10) return null;
  const n = e.x * e.x + e.y * e.y, l = t.x * t.x + t.y * t.y, u = r.x * r.x + r.y * r.y, d = { x: (n * (t.y - r.y) + l * (r.y - e.y) + u * (e.y - t.y)) / i, y: (n * (r.x - t.x) + l * (e.x - r.x) + u * (t.x - e.x)) / i };
  return { center: d, radius: Math.hypot(d.x - e.x, d.y - e.y) };
}
function sc(a, e, t) {
  const r = t.x - e.x, i = t.y - e.y, n = ((a.x - e.x) * r + (a.y - e.y) * i) / (r * r + i * i);
  return { x: e.x + n * r, y: e.y + n * i };
}
function oc(a) {
  const e = a == null ? void 0 : a.toLowerCase().replace(/[^a-z]/g, "");
  return { sinelaw: "sine-law", cosinelaw: "cosine-law", area: "area", areaofatriangle: "area", ssa: "ssa-ambiguous-case", ssaambiguouscase: "ssa-ambiguous-case", solvetriangle: "solve-triangle" }[e ?? ""] ?? null;
}
const ya = { A: "#0864e8", B: "#dc3545", C: "#7948da" }, gt = ["A", "B", "C"];
function lc(a, e, t, r) {
  const i = Math.atan2(e.y - a.y, e.x - a.x);
  let n = Math.atan2(t.y - a.y, t.x - a.x) - i;
  for (; n > Math.PI; ) n -= 2 * Math.PI;
  for (; n < -Math.PI; ) n += 2 * Math.PI;
  return `M ${a.x + r * Math.cos(i)} ${a.y + r * Math.sin(i)} A ${r} ${r} 0 0 ${n > 0 ? 1 : 0} ${a.x + r * Math.cos(i + n)} ${a.y + r * Math.sin(i + n)}`;
}
function pi({ triangle: a, alternative: e, onChange: t, showValues: r = !0, showAngles: i = !0, showHeight: n = !1, showCircle: l = !1, showAltitudes: u = !1, selected: d = "A", onSelect: p, unit: f = "units", known: b = [], highlightSolved: S = !1, construction: w, apexA: j = !1 }) {
  const R = nr(), N = Un(), I = _a(null), [O, k] = ce(""), [L, V] = ce(null), X = L && a && ["a", "b", "c", "A", "B", "C"].every((C) => Math.abs(L.triangle[C] - a[C]) < 1e-7), G = a ? X ? L.points : j ? ((C) => {
    const Q = (C.c * C.c + C.a * C.a - C.b * C.b) / (2 * C.a);
    return { A: { x: Q, y: -Math.sqrt(Math.max(0, C.c * C.c - Q * Q)) }, B: { x: 0, y: 0 }, C: { x: C.a, y: 0 } };
  })(a) : $r(a) : w ? { A: { x: 0, y: 0 }, B: { x: w.b * Math.cos(w.A * Math.PI / 180), y: 0 }, C: { x: w.b * Math.cos(w.A * Math.PI / 180), y: -w.b * Math.sin(w.A * Math.PI / 180) } } : $r({ b: 8, c: 10, A: 50 }), J = Math.atan2(G.B.y - G.A.y, G.B.x - G.A.x), me = e ? Object.fromEntries(Object.entries($r(e)).map(([C, Q]) => [C, { x: G.A.x + Q.x * Math.cos(J) - Q.y * Math.sin(J), y: G.A.y + Q.x * Math.sin(J) + Q.y * Math.cos(J) }])) : null, _ = l && a ? nc(G) : null, ne = [...Object.values(G), ...me ? Object.values(me) : []];
  _ && ne.push({ x: _.center.x - _.radius, y: _.center.y - _.radius }, { x: _.center.x + _.radius, y: _.center.y + _.radius }), w && ne.push({ x: G.C.x - w.a, y: G.C.y - w.a }, { x: G.C.x + w.a, y: G.C.y + w.a });
  const Pe = Math.min(...ne.map((C) => C.x)), Ae = Math.min(...ne.map((C) => C.y)), Te = Math.max(...ne.map((C) => C.x)) - Pe, Ve = Math.max(...ne.map((C) => C.y)) - Ae, Me = Math.min(400 / Math.max(Te, 1e-3), 270 / Math.max(Ve, 1e-3)), Je = 50 + (400 - Te * Me) / 2, mt = 48 + (270 - Ve * Me) / 2, ye = I.current, ze = (C) => ye ? { x: ye.minX + C.x * ye.scale, y: ye.minY + C.y * ye.scale } : { x: Je + (C.x - Pe) * Me, y: mt + (C.y - Ae) * Me }, U = Object.fromEntries(gt.map((C) => [C, ze(G[C])])), Le = (C, Q, ue, pe = G) => {
    const ke = to({ ...pe, [C]: { x: Q, y: ue } });
    ke ? (V({ points: { ...pe, [C]: { x: Q, y: ue } }, triangle: ke }), t == null || t(ke), k("")) : k("Keep the vertices apart and off a straight line.");
  }, kt = a ? gt.map((C) => `${C} ${q(a[C])} degrees; ${C.toLowerCase()} ${q(a[C.toLowerCase()])}`).join("; ") : "No valid triangle for these inputs.";
  return /* @__PURE__ */ o.jsxs(o.Fragment, { children: [
    /* @__PURE__ */ o.jsxs("svg", { className: "obl-triangle", viewBox: "0 0 500 390", "aria-label": "Interactive oblique triangle", role: "group", onPointerMove: (C) => {
      const Q = I.current;
      if (!Q) return;
      const ue = C.currentTarget.getScreenCTM();
      if (!ue) return;
      const pe = new DOMPoint(C.clientX, C.clientY).matrixTransform(ue.inverse());
      Le(Q.vertex, (pe.x - Q.minX) / Q.scale, (pe.y - Q.minY) / Q.scale, Q.points);
    }, onPointerUp: () => {
      I.current = null, V((C) => C ? { ...C } : null), R == null || R.ledger.endGesture();
    }, onPointerCancel: () => {
      I.current = null, V((C) => C ? { ...C } : null), R == null || R.ledger.endGesture();
    }, children: [
      /* @__PURE__ */ o.jsx("title", { children: kt }),
      /* @__PURE__ */ o.jsx("defs", { children: /* @__PURE__ */ o.jsxs("linearGradient", { id: N, children: [
        /* @__PURE__ */ o.jsx("stop", { stopColor: "#edf7ff" }),
        /* @__PURE__ */ o.jsx("stop", { offset: "1", stopColor: "#dcecff" })
      ] }) }),
      w && /* @__PURE__ */ o.jsxs(o.Fragment, { children: [
        /* @__PURE__ */ o.jsx("line", { x1: U.A.x, y1: U.A.y, x2: U.A.x + (480 - U.A.x) * Math.cos(J), y2: U.A.y + (480 - U.A.x) * Math.sin(J), stroke: "#7b95b2", strokeDasharray: "5 4" }),
        /* @__PURE__ */ o.jsx("circle", { cx: U.C.x, cy: U.C.y, r: w.a * ((ye == null ? void 0 : ye.scale) ?? Me), fill: "none", stroke: "#9164ce", strokeDasharray: "5 5" }),
        /* @__PURE__ */ o.jsx("text", { x: "22", y: "22", fill: "#6a4f9d", fontSize: "13", children: "Side a swings about C; B lies on the ray from A." })
      ] }),
      _ && /* @__PURE__ */ o.jsx("circle", { cx: ze(_.center).x, cy: ze(_.center).y, r: _.radius * ((ye == null ? void 0 : ye.scale) ?? Me), fill: "none", stroke: "#7db8e2", strokeDasharray: "6 5" }),
      a && /* @__PURE__ */ o.jsx("polygon", { points: gt.map((C) => `${U[C].x},${U[C].y}`).join(" "), fill: `url(#${N})` }),
      me && /* @__PURE__ */ o.jsxs(o.Fragment, { children: [
        /* @__PURE__ */ o.jsx("polygon", { points: gt.map((C) => `${ze(me[C]).x},${ze(me[C]).y}`).join(" "), fill: "#eee5ff66", stroke: "#8052c9", strokeDasharray: "7 5", strokeWidth: "2" }),
        /* @__PURE__ */ o.jsx("text", { x: ze(me.B).x + 7, y: ze(me.B).y + 44, fill: "#8052c9", children: "B₂" })
      ] }),
      (n || u) && a && gt.filter((C) => u || C === "C").map((C) => {
        const [Q, ue] = gt.filter((ke) => ke !== C), pe = ze(sc(G[C], G[Q], G[ue]));
        return /* @__PURE__ */ o.jsxs("g", { children: [
          /* @__PURE__ */ o.jsx("line", { x1: U[C].x, y1: U[C].y, x2: pe.x, y2: pe.y, stroke: "#50708f", strokeDasharray: "5 4" }),
          /* @__PURE__ */ o.jsx("path", { d: `M ${pe.x - 7} ${pe.y} v -7 h 7`, stroke: "#50708f", fill: "none" }),
          C === "C" && /* @__PURE__ */ o.jsxs("text", { className: "obl-altitude-label", x: pe.x + 8, y: (U[C].y + pe.y) / 2 + 24, fill: "#3d5777", children: [
            "h",
            r ? ` = ${q(2 * a.area / a.c)}` : ""
          ] })
        ] }, C);
      }),
      a && gt.map((C) => {
        const [Q, ue] = gt.filter((et) => et !== C), pe = C.toLowerCase(), ke = { x: (U[Q].x + U[ue].x) / 2, y: (U[Q].y + U[ue].y) / 2 }, Qe = { x: (U.A.x + U.B.x + U.C.x) / 3, y: (U.A.y + U.B.y + U.C.y) / 3 }, Pt = ke.x - Qe.x, Ct = ke.y - Qe.y, pt = Math.hypot(Pt, Ct) || 1;
        return /* @__PURE__ */ o.jsxs("g", { role: p ? "button" : void 0, tabIndex: p ? 0 : void 0, "aria-label": p ? `Highlight side ${pe} and angle ${C}` : void 0, onKeyDown: (et) => {
          p && (et.key === "Enter" || et.key === " ") && (et.preventDefault(), p(C));
        }, onClick: () => p == null ? void 0 : p(C), children: [
          /* @__PURE__ */ o.jsx("line", { x1: U[Q].x, y1: U[Q].y, x2: U[ue].x, y2: U[ue].y, stroke: d === C || S && !b.includes(pe) ? ya[C] : "#13253e", strokeWidth: d === C ? 3.5 : 2.3 }),
          /* @__PURE__ */ o.jsxs("text", { className: "obl-svg-label", x: ke.x + Pt / pt * 23, y: ke.y + Ct / pt * 23 + 5, fill: ya[C], textAnchor: "middle", children: [
            pe,
            r && a ? ` = ${q(a[pe])}` : ""
          ] }),
          a && /* @__PURE__ */ o.jsx("path", { d: lc(U[C], U[Q], U[ue], 27), stroke: ya[C], fill: "none", strokeWidth: "1.6" }),
          i && a && /* @__PURE__ */ o.jsxs("text", { className: "obl-svg-angle", x: U[C].x + (Qe.x - U[C].x) * 0.24, y: U[C].y + (Qe.y - U[C].y) * 0.24 + 5, textAnchor: "middle", fill: ya[C], children: [
            q(a[C], 1),
            "°"
          ] })
        ] }, C);
      }),
      !a && w && /* @__PURE__ */ o.jsxs(o.Fragment, { children: [
        /* @__PURE__ */ o.jsx("line", { x1: U.A.x, y1: U.A.y, x2: U.C.x, y2: U.C.y, stroke: "#dc3545", strokeWidth: "2.5" }),
        /* @__PURE__ */ o.jsxs("text", { x: (U.A.x + U.C.x) / 2 - 20, y: (U.A.y + U.C.y) / 2, fill: "#dc3545", children: [
          "b = ",
          q(w.b)
        ] }),
        /* @__PURE__ */ o.jsx("line", { x1: U.C.x, y1: U.C.y, x2: U.C.x, y2: U.A.y, stroke: "#7893b2", strokeDasharray: "4 4" }),
        /* @__PURE__ */ o.jsxs("text", { x: U.C.x + 8, y: (U.C.y + U.A.y) / 2, children: [
          "h = ",
          q(w.b * Math.sin(w.A * Math.PI / 180))
        ] })
      ] }),
      (a ? gt : w ? ["A", "C"] : []).map((C) => /* @__PURE__ */ o.jsxs("g", { role: t ? "button" : void 0, tabIndex: t ? 0 : void 0, "aria-label": `Move vertex ${C} with arrow keys`, className: t ? "obl-drag" : "", onPointerDown: (Q) => {
        !t || !a || (Q.preventDefault(), R == null || R.ledger.beginGesture(), Q.currentTarget.setPointerCapture(Q.pointerId), I.current = { vertex: C, points: G, scale: Me, minX: Je - Pe * Me, minY: mt - Ae * Me }, p == null || p(C));
      }, onKeyDown: (Q) => {
        if (!t || !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(Q.key)) return;
        Q.preventDefault();
        const ue = (Q.shiftKey ? 10 : 2) / Me;
        Le(C, G[C].x + (Q.key === "ArrowLeft" ? -ue : Q.key === "ArrowRight" ? ue : 0), G[C].y + (Q.key === "ArrowUp" ? -ue : Q.key === "ArrowDown" ? ue : 0));
      }, children: [
        /* @__PURE__ */ o.jsx("circle", { cx: U[C].x, cy: U[C].y, r: "17", fill: "transparent" }),
        /* @__PURE__ */ o.jsx("circle", { cx: U[C].x, cy: U[C].y, r: "6", fill: ya[C], stroke: "white", strokeWidth: "2" }),
        /* @__PURE__ */ o.jsxs("text", { x: U[C].x + (C === "A" ? -14 : 12), y: U[C].y + (C === "C" ? -13 : 25), fill: "#13253e", fontSize: "22", fontFamily: "Georgia", children: [
          C,
          w && C === "B" && e ? "₁" : ""
        ] })
      ] }, C)),
      !a && !w && /* @__PURE__ */ o.jsx("text", { x: "250", y: "190", textAnchor: "middle", fill: "#933d32", children: "Enter valid data to draw a triangle." }),
      n && r && a && /* @__PURE__ */ o.jsxs("text", { x: "250", y: "369", textAnchor: "middle", fill: "#163863", fontSize: "17", children: [
        "Area = ",
        q(a.area),
        " ",
        f,
        "²"
      ] })
    ] }),
    /* @__PURE__ */ o.jsx("p", { className: "obl-graph-hint", role: "status", children: O || (a ? t ? "Drag a vertex or focus it and use arrow keys. Select a side to highlight its opposite angle." : "Sides are paired with their opposite angles." : "No triangle exists for this data.") })
  ] });
}
const it = "/trigonometry/oblique", wa = [["sine-law", "Sine Law", "Relate sides and opposite angles."], ["cosine-law", "Cosine Law", "Find a side or angle using the included angle."], ["area", "Area of a Triangle", "Find area from two sides and an included angle."], ["ssa-ambiguous-case", "SSA Ambiguous Case", "Discover when 0, 1 or 2 triangles are possible."], ["solve-triangle", "Solve Triangle", "Solve every side and angle, step by step."]];
function fe({ tex: a }) {
  return /* @__PURE__ */ o.jsx("div", { className: "obl-formula", children: /* @__PURE__ */ o.jsx(ec, { value: a, display: !0 }) });
}
function ge({ title: a, children: e, className: t = "", icon: r = "book", id: i }) {
  const n = r === "triangle" ? Ho : r === "idea" ? Zn : r === "quiz" ? $o : Kn;
  return /* @__PURE__ */ o.jsxs("section", { id: i, className: `obl-panel ${t}`, children: [
    /* @__PURE__ */ o.jsxs("h2", { children: [
      /* @__PURE__ */ o.jsx(n, {}),
      a
    ] }),
    e
  ] });
}
function yt({ label: a, value: e, onChange: t, unit: r, min: i, max: n }) {
  const [l, u] = ce(q(e, 6)), d = _a(!1);
  return ea(() => {
    d.current && e === 0 || u(q(e, 6));
  }, [e]), /* @__PURE__ */ o.jsxs("label", { className: "obl-number", children: [
    /* @__PURE__ */ o.jsx("span", { children: a }),
    /* @__PURE__ */ o.jsxs("span", { children: [
      /* @__PURE__ */ o.jsx("input", { "aria-label": a, type: "number", min: i, max: n, step: "any", value: l, onChange: (p) => {
        u(p.target.value), d.current = p.target.value === "", d.current ? t(0) : Number.isFinite(p.target.valueAsNumber) && t(p.target.valueAsNumber);
      }, onBlur: () => {
        d.current = !1, u(q(e, 6));
      } }),
      r && /* @__PURE__ */ o.jsx("small", { children: r })
    ] })
  ] });
}
function Wt({ children: a, value: e, onChange: t }) {
  return /* @__PURE__ */ o.jsxs("label", { className: "obl-toggle", children: [
    /* @__PURE__ */ o.jsx("input", { type: "checkbox", checked: e, onChange: (r) => t(r.target.checked) }),
    a
  ] });
}
function da({ children: a }) {
  return /* @__PURE__ */ o.jsxs("aside", { className: "obl-key", children: [
    /* @__PURE__ */ o.jsx(Zn, {}),
    /* @__PURE__ */ o.jsxs("div", { children: [
      /* @__PURE__ */ o.jsx("b", { children: "Key idea" }),
      /* @__PURE__ */ o.jsx("p", { children: a })
    ] })
  ] });
}
function qa() {
  const a = nr(), e = a == null ? void 0 : a.ledger.values["ObliqueStudio:unit"];
  return typeof e == "string" ? e : "units";
}
function ja(a, e) {
  const t = nr(), [r, i] = Ja(`ObliqueStudio:${a}:inputs`, () => {
    const u = (t == null ? void 0 : t.ledger.values["ObliqueTriangleLab:ObliqueTriangleLab:points"]) ?? (t == null ? void 0 : t.ledger.saved["ObliqueTriangleLab:ObliqueTriangleLab:points"]);
    if (u && typeof u == "object") {
      const d = u;
      if (d.A && d.B && d.C) {
        const p = to(d);
        if (p) return { A: p.A, B: p.B, C: p.C, a: p.a / 30, b: p.b / 30, c: p.c / 30 };
      }
    }
    return e;
  });
  return { values: r, set: (u, d) => i((p) => ({ ...p, [u]: d })), setValues: i, load: (u) => i({ ...u }), reset: () => i(e) };
}
function Ea({ triangle: a, alternative: e, onChange: t, reset: r, height: i = !1, circle: n = !1, construction: l, known: u = [], activePair: d }) {
  const [p, f] = ce(!0), [b, S] = ce(!0), [w, j] = ce(i), [R, N] = ce(!1), [I, O] = ce(!1), [k, L] = ce(!0), [V, X] = ce("A"), [ae, G] = ce(!0), [J, me] = Ja("ObliqueStudio:unit", "units");
  return ea(() => {
    d && X(d);
  }, [d]), /* @__PURE__ */ o.jsxs(ge, { title: l ? "Interactive Triangle Explorer" : "Interactive Triangle", icon: "triangle", className: "obl-explorer", children: [
    /* @__PURE__ */ o.jsx(pi, { triangle: a, alternative: k ? e : void 0, onChange: t, showValues: p, showAngles: b, showHeight: w, showCircle: R, showAltitudes: I, selected: V, onSelect: X, unit: J, known: u, highlightSolved: u.length > 0 && ae, construction: l }),
    /* @__PURE__ */ o.jsxs("div", { className: "obl-graph-controls", children: [
      /* @__PURE__ */ o.jsxs("button", { onClick: r, children: [
        /* @__PURE__ */ o.jsx(Lo, {}),
        "Reset"
      ] }),
      /* @__PURE__ */ o.jsx(Wt, { value: p, onChange: f, children: "Show values" }),
      /* @__PURE__ */ o.jsx(Wt, { value: b, onChange: S, children: "Show angles" }),
      i && /* @__PURE__ */ o.jsx(Wt, { value: w, onChange: j, children: "Show height" }),
      e && /* @__PURE__ */ o.jsx(Wt, { value: k, onChange: L, children: "Show both solutions" }),
      n && /* @__PURE__ */ o.jsx(Wt, { value: R, onChange: N, children: "Show circumcircle" }),
      /* @__PURE__ */ o.jsx(Wt, { value: I, onChange: O, children: "Show altitudes" }),
      u.length > 0 && /* @__PURE__ */ o.jsx(Wt, { value: ae, onChange: G, children: "Highlight solved parts" }),
      /* @__PURE__ */ o.jsxs("label", { children: [
        "Units",
        /* @__PURE__ */ o.jsx("select", { "aria-label": "Length units", value: J, onChange: (_) => me(_.target.value), children: ["units", "m", "cm", "km"].map((_) => /* @__PURE__ */ o.jsx("option", { children: _ }, _)) })
      ] })
    ] }),
    /* @__PURE__ */ o.jsx("div", { className: "obl-pair-buttons", children: ["A", "B", "C"].map((_) => /* @__PURE__ */ o.jsxs("button", { "aria-pressed": V === _, onClick: () => X(_), children: [
      "Side ",
      _.toLowerCase(),
      " ↔ ∠",
      _
    ] }, _)) }),
    a && /* @__PURE__ */ o.jsx("div", { className: "obl-live-values", "aria-label": "Live triangle values", children: ["a", "b", "c", "A", "B", "C"].map((_) => /* @__PURE__ */ o.jsxs("span", { children: [
      _,
      " = ",
      /* @__PURE__ */ o.jsxs("b", { children: [
        q(a[_]),
        _ === _.toUpperCase() ? "°" : ` ${J}`
      ] }),
      u.length > 0 && /* @__PURE__ */ o.jsx("small", { children: u.includes(_) ? "given" : "solved" })
    ] }, _)) })
  ] });
}
function Ra({ children: a }) {
  return /* @__PURE__ */ o.jsx("ol", { className: "obl-steps", children: a });
}
function ct({ children: a, error: e = !1 }) {
  return /* @__PURE__ */ o.jsx("div", { role: e ? "alert" : "status", className: `obl-answer ${e ? "obl-error" : ""}`, children: a });
}
function xr({ triangle: a }) {
  return /* @__PURE__ */ o.jsxs("details", { className: "obl-verification", children: [
    /* @__PURE__ */ o.jsx("summary", { children: "Verify: angles sum to 180° · all triangle inequalities hold" }),
    /* @__PURE__ */ o.jsxs("p", { children: [
      q(a.A, 5),
      "° + ",
      q(a.B, 5),
      "° + ",
      q(a.C, 5),
      "° = ",
      q(a.A + a.B + a.C, 6),
      "°"
    ] }),
    ["a", "b", "c"].map((e) => {
      const [t, r] = ["a", "b", "c"].filter((i) => i !== e);
      return /* @__PURE__ */ o.jsxs("p", { children: [
        q(a[t]),
        " + ",
        q(a[r]),
        " > ",
        q(a[e])
      ] }, e);
    }),
    /* @__PURE__ */ o.jsx("p", { children: "Full precision is used for the check; displayed values are rounded." })
  ] });
}
function ao({ prompt: a, expected: e, signature: t, hint: r, children: i, fixed: n = !1 }) {
  const [l, u] = ce(!1), [d, p] = ce(""), [f, b] = ce(null);
  return /* @__PURE__ */ o.jsxs(ge, { title: "Practice & Quiz", icon: "quiz", id: n ? "obl-concept-practice" : "obl-practice", children: [
    /* @__PURE__ */ o.jsx("p", { children: n ? "A concept question independent of the current triangle." : "Practice with the current triangle, then try a new example." }),
    /* @__PURE__ */ o.jsx("button", { className: "obl-primary", onClick: () => {
      u((S) => !S), b(null);
    }, children: l ? "Close Quiz" : "Take Quiz" }),
    l && /* @__PURE__ */ o.jsxs("form", { onSubmit: (S) => {
      S.preventDefault(), d.trim() && e !== null && b({ signature: t, correct: Math.abs(Number(d) - e) <= Math.max(0.02, Math.abs(e) * 1e-3) });
    }, children: [
      /* @__PURE__ */ o.jsx("p", { children: a }),
      /* @__PURE__ */ o.jsxs("label", { children: [
        "Your answer",
        /* @__PURE__ */ o.jsx("input", { "aria-label": "Quiz answer", type: "number", step: "any", value: d, onChange: (S) => p(S.target.value), required: !0, disabled: e === null })
      ] }),
      /* @__PURE__ */ o.jsx("button", { disabled: e === null, children: "Check Answer" }),
      /* @__PURE__ */ o.jsx("p", { role: "status", children: e === null ? "Enter valid data before starting this challenge." : (f == null ? void 0 : f.signature) === t ? f.correct ? n ? "Correct — matches the concept question." : "Correct — matches this model." : `Try again. ${r}` : f ? "The model changed. Check the new question." : r })
    ] }),
    i
  ] });
}
function cc({ onExample: a, children: e }) {
  const t = [[Za, "Land Surveying", "Measure distances across inaccessible terrain."], [Qn, "Navigation", "Infer positions and routes from bearings."], [Xn, "Engineering", "Design triangular supports and structures."], [Jn, "Mapping & Design", "Calculate areas and compare configurations."]];
  return /* @__PURE__ */ o.jsxs(ge, { title: "Common Use Cases", children: [
    /* @__PURE__ */ o.jsx("div", { className: "obl-applications", children: t.map(([r, i, n]) => /* @__PURE__ */ o.jsxs("article", { children: [
      /* @__PURE__ */ o.jsx(r, {}),
      /* @__PURE__ */ o.jsx("b", { children: i }),
      /* @__PURE__ */ o.jsx("p", { children: n })
    ] }, i)) }),
    /* @__PURE__ */ o.jsxs("button", { onClick: a, children: [
      /* @__PURE__ */ o.jsx(_n, {}),
      "Try a surveying example"
    ] }),
    e
  ] });
}
function Da({ expected: a, prompt: e, values: t, onExample: r, children: i }) {
  return /* @__PURE__ */ o.jsxs(o.Fragment, { children: [
    /* @__PURE__ */ o.jsxs("div", { className: "obl-bottom", children: [
      /* @__PURE__ */ o.jsx(cc, { onExample: r }),
      /* @__PURE__ */ o.jsx(ao, { expected: a, prompt: e, signature: JSON.stringify(t), hint: "Use the values and formula in the current model." })
    ] }),
    i
  ] });
}
function ro({ t: a }) {
  const e = (a.a + a.b + a.c) / 2, t = Math.sqrt(Math.max(0, e * (e - a.a) * (e - a.b) * (e - a.c)));
  return /* @__PURE__ */ o.jsxs(ge, { title: "Explore More: Three Ways to Find Area", children: [
    /* @__PURE__ */ o.jsx(fe, { tex: "K=\\tfrac12 bc\\sin A=\\tfrac12 ca\\sin B=\\tfrac12 ab\\sin C" }),
    /* @__PURE__ */ o.jsxs("p", { children: [
      "All three included-angle forms give ",
      q(a.area, 4),
      " square units."
    ] }),
    /* @__PURE__ */ o.jsx(fe, { tex: "s=\\frac{a+b+c}{2},\\qquad K=\\sqrt{s(s-a)(s-b)(s-c)}" }),
    /* @__PURE__ */ o.jsxs("p", { children: [
      "Semiperimeter s = ",
      q(e, 4),
      ". Heron’s formula = ",
      q(t, 4),
      "; base × height ÷ 2 = ",
      q(a.area, 4),
      "."
    ] })
  ] });
}
function io() {
  const a = Un();
  return /* @__PURE__ */ o.jsxs("svg", { className: "obl-landscape", viewBox: "0 0 1200 300", preserveAspectRatio: "xMidYMid slice", "aria-hidden": "true", children: [
    /* @__PURE__ */ o.jsxs("defs", { children: [
      /* @__PURE__ */ o.jsxs("linearGradient", { id: a, x2: "0", y2: "1", children: [
        /* @__PURE__ */ o.jsx("stop", { stopColor: "#acd4f7" }),
        /* @__PURE__ */ o.jsx("stop", { offset: ".6", stopColor: "#ecf7ff" }),
        /* @__PURE__ */ o.jsx("stop", { offset: "1", stopColor: "#80b5d4" })
      ] }),
      /* @__PURE__ */ o.jsxs("linearGradient", { id: a + "lake", x2: "0", y2: "1", children: [
        /* @__PURE__ */ o.jsx("stop", { stopColor: "#afd8e9" }),
        /* @__PURE__ */ o.jsx("stop", { offset: "1", stopColor: "#ecf9fd" })
      ] })
    ] }),
    /* @__PURE__ */ o.jsx("rect", { width: "1200", height: "300", fill: `url(#${a})` }),
    /* @__PURE__ */ o.jsx("path", { d: "M0 225L130 95L200 149L305 62L382 144L485 38L604 162L702 87L780 152L885 16L1015 168L1100 90L1200 206V300H0Z", fill: "#a2bdd1" }),
    /* @__PURE__ */ o.jsx("path", { d: "M270 232L480 82L545 150L650 60L785 196L884 18L1047 212L1160 113L1200 177V270Z", fill: "#7197b4" }),
    /* @__PURE__ */ o.jsx("path", { d: "M485 38L437 112L474 93L485 105L502 84L547 114Z M650 60L606 121L639 111L654 98L679 125L702 130Z M885 16L805 126L850 97L878 71L896 97L912 65L958 110Z M305 62L271 112L301 98L320 117L343 108Z", fill: "#f4fbff" }),
    /* @__PURE__ */ o.jsx("path", { d: "M885 16L900 69L878 116L930 177L963 207L889 157L852 181L811 198L859 116Z", fill: "#456d8d" }),
    /* @__PURE__ */ o.jsx("path", { d: "M885 16L900 69L879 113L866 97L880 64L855 77Z M480 82L468 124L490 114L521 138Z", fill: "white" }),
    /* @__PURE__ */ o.jsx("path", { d: "M0 240Q250 196 410 231T770 232T1200 217V300H0Z", fill: `url(#${a + "lake"})` }),
    /* @__PURE__ */ o.jsx("path", { d: "M50 253Q400 237 750 254T1180 263M320 277Q620 263 1090 284", fill: "none", stroke: "#fff", strokeOpacity: ".6", strokeWidth: "3" }),
    /* @__PURE__ */ o.jsx("g", { fill: "#4b7a89", opacity: ".8", children: Array.from({ length: 36 }, (e, t) => {
      const r = t * 36, i = 222 + t % 4 * 3, n = 12 + t % 7 * 4;
      return /* @__PURE__ */ o.jsx("path", { d: `M${r} ${i}l8 -${n}l8 ${n}h-4l6 8h-22l6 -8Z` }, t);
    }) })
  ] });
}
const Wr = [String.raw`\frac a{\sin A}=\frac b{\sin B}=\frac c{\sin C}`, String.raw`a^2=b^2+c^2-2bc\cos A`, String.raw`K=\tfrac12 bc\sin A`, String.raw`\text{Same SSA data: 0, 1 or 2 triangles}`, String.raw`A+B+C=180^\circ`];
function uc() {
  const [a, e] = ce("A"), t = Ta(48, 62, 6.7);
  return /* @__PURE__ */ o.jsxs(o.Fragment, { children: [
    /* @__PURE__ */ o.jsxs("section", { className: "obl-home-intro", children: [
      /* @__PURE__ */ o.jsx(io, {}),
      /* @__PURE__ */ o.jsxs("div", { children: [
        /* @__PURE__ */ o.jsx("span", { className: "obl-home-kicker", children: "TRIGONOMETRY STUDIO" }),
        /* @__PURE__ */ o.jsx("h1", { children: "Sine & Cosine Laws" }),
        /* @__PURE__ */ o.jsx("h3", { children: "Solve Any Triangle, Anywhere" }),
        /* @__PURE__ */ o.jsx("p", { children: "The Sine and Cosine Laws extend trigonometry beyond right triangles. Use them to find unknown sides and angles in oblique triangles and explore surveying, navigation and engineering." }),
        /* @__PURE__ */ o.jsxs("div", { className: "obl-benefits", children: [
          /* @__PURE__ */ o.jsxs("span", { children: [
            /* @__PURE__ */ o.jsx(Za, {}),
            "Real-World Applications"
          ] }),
          /* @__PURE__ */ o.jsxs("span", { children: [
            /* @__PURE__ */ o.jsx(Oo, {}),
            "Interactive Visualizations"
          ] }),
          /* @__PURE__ */ o.jsxs("span", { children: [
            /* @__PURE__ */ o.jsx(_n, {}),
            "Step-by-Step Solutions"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ o.jsx("div", { className: "obl-home-figure", children: /* @__PURE__ */ o.jsx(pi, { apexA: !0, triangle: t, selected: a, onSelect: e }) }),
      /* @__PURE__ */ o.jsxs("div", { className: "obl-home-equations", children: [
        /* @__PURE__ */ o.jsx("h3", { children: "Sine Law" }),
        /* @__PURE__ */ o.jsx(fe, { tex: Wr[0] }),
        /* @__PURE__ */ o.jsx("h3", { children: "Cosine Law" }),
        /* @__PURE__ */ o.jsx(fe, { tex: Wr[1] }),
        /* @__PURE__ */ o.jsx("p", { children: "Triangles help us measure the world." })
      ] })
    ] }),
    /* @__PURE__ */ o.jsx("div", { className: "obl-destinations", children: wa.map(([r, i, n], l) => /* @__PURE__ */ o.jsxs(ot, { className: `obl-destination obl-destination-${l}`, to: `${it}/${r}`, children: [
      /* @__PURE__ */ o.jsxs("h2", { children: [
        /* @__PURE__ */ o.jsx("span", { children: String(l + 1).padStart(2, "0") }),
        i
      ] }),
      /* @__PURE__ */ o.jsx("p", { children: n }),
      /* @__PURE__ */ o.jsx("div", { className: "obl-card-triangle", children: /* @__PURE__ */ o.jsx(pi, { apexA: l !== 3, triangle: l === 3 ? sa(35, 7, 10)[0] : t, alternative: l === 3 ? sa(35, 7, 10)[1] : void 0, selected: ["A", "B", "C"][l % 3], showValues: !1, showAngles: !1, showHeight: l === 2 }) }),
      /* @__PURE__ */ o.jsx(fe, { tex: Wr[l] }),
      /* @__PURE__ */ o.jsxs("span", { className: "obl-start", children: [
        "Start Learning",
        /* @__PURE__ */ o.jsx(Do, {})
      ] })
    ] }, r)) }),
    /* @__PURE__ */ o.jsxs("div", { className: "obl-dashboard-bottom", children: [
      /* @__PURE__ */ o.jsx(ge, { title: "Why Sine & Cosine Laws?", children: /* @__PURE__ */ o.jsxs("ul", { children: [
        /* @__PURE__ */ o.jsx("li", { children: "Work with non-right (oblique) triangles." }),
        /* @__PURE__ */ o.jsx("li", { children: "Find distances from accessible measurements." }),
        /* @__PURE__ */ o.jsx("li", { children: "Choose a method from the known sides and angles." }),
        /* @__PURE__ */ o.jsx("li", { children: "Check whether measurements determine one triangle." })
      ] }) }),
      /* @__PURE__ */ o.jsx(ge, { title: "Real-World Applications", children: /* @__PURE__ */ o.jsx("div", { className: "obl-home-apps", children: [[Za, "Surveying & Mapping", "sine-law"], [Qn, "Navigation & GPS", "ssa-ambiguous-case"], [Xn, "Architecture & Construction", "cosine-law"], [Jn, "Land Area & Design", "area"]].map(([r, i, n]) => {
        const l = r;
        return /* @__PURE__ */ o.jsxs(ot, { to: `${it}/${n}`, children: [
          /* @__PURE__ */ o.jsx(l, {}),
          /* @__PURE__ */ o.jsx("span", { children: String(i) })
        ] }, String(i));
      }) }) }),
      /* @__PURE__ */ o.jsx("aside", { className: "obl-quote", children: "From the mountains to the oceans, triangles help us measure and explore the world." })
    ] }),
    /* @__PURE__ */ o.jsxs(ge, { title: "Choose the Right Method", children: [
      /* @__PURE__ */ o.jsxs("div", { className: "obl-methods", children: [
        /* @__PURE__ */ o.jsxs(ot, { to: `${it}/sine-law`, children: [
          /* @__PURE__ */ o.jsx("b", { children: "ASA / AAS" }),
          "Two angles and one side → Sine Law"
        ] }),
        /* @__PURE__ */ o.jsxs(ot, { to: `${it}/cosine-law`, children: [
          /* @__PURE__ */ o.jsx("b", { children: "SAS / SSS" }),
          "Included angle or three sides → Cosine Law"
        ] }),
        /* @__PURE__ */ o.jsxs(ot, { to: `${it}/ssa-ambiguous-case`, children: [
          /* @__PURE__ */ o.jsx("b", { children: "SSA" }),
          "Non-included angle → Check ambiguity"
        ] })
      ] }),
      /* @__PURE__ */ o.jsx(da, { children: "Right-triangle ratios are a starting point. Sine and Cosine Laws extend them to arbitrary triangles; the complete solver combines both and verifies the result." })
    ] })
  ] });
}
const dc = { A: 48, B: 62, C: 70, a: 6.7, b: 8, c: 9 };
function hc() {
  const a = qa(), e = ja("sine-law", dc), [t, r] = ce("ASA"), { values: i } = e, n = t === "ASA" ? [Ta(i.A, i.B, i.a)].filter((u) => u !== null) : sa(i.A, i.a, i.b), l = n[0] ?? null;
  return /* @__PURE__ */ o.jsxs(o.Fragment, { children: [
    /* @__PURE__ */ o.jsxs("div", { className: "obl-lesson-grid", children: [
      /* @__PURE__ */ o.jsxs(ge, { title: "What it means", icon: "idea", children: [
        /* @__PURE__ */ o.jsx("p", { children: "In any oblique triangle, each side divided by the sine of its opposite angle gives the same ratio." }),
        /* @__PURE__ */ o.jsx(fe, { tex: "\\frac a{\\sin A}=\\frac b{\\sin B}=\\frac c{\\sin C}=2R" }),
        /* @__PURE__ */ o.jsx("p", { children: "This works for acute, obtuse, isosceles and scalene triangles. R is the circumradius." }),
        /* @__PURE__ */ o.jsx(da, { children: "Larger angles are opposite longer sides; equal angles are opposite equal sides. Select a pair below the diagram." }),
        /* @__PURE__ */ o.jsxs("details", { children: [
          /* @__PURE__ */ o.jsx("summary", { children: "Why the ratio is the circumdiameter" }),
          /* @__PURE__ */ o.jsx("p", { children: "Draw the circumcircle and a diameter through a vertex. The inscribed angle subtending the opposite chord gives sin A = a/(2R). The same construction gives b/(2R) and c/(2R)." })
        ] })
      ] }),
      /* @__PURE__ */ o.jsx(Ea, { triangle: l, alternative: n[1], onChange: e.load, reset: () => {
        e.reset(), r("ASA");
      }, circle: !0 }),
      /* @__PURE__ */ o.jsxs(ge, { title: "Solve a Triangle", className: "obl-solver", children: [
        /* @__PURE__ */ o.jsxs("div", { className: "obl-mode-buttons", children: [
          /* @__PURE__ */ o.jsx("button", { "aria-pressed": t === "ASA", onClick: () => r("ASA"), children: "Solve for a Side" }),
          /* @__PURE__ */ o.jsx("button", { "aria-pressed": t === "SSA", onClick: () => r("SSA"), children: "Solve for an Angle (SSA)" })
        ] }),
        /* @__PURE__ */ o.jsxs("div", { className: "obl-solver-grid", children: [
          /* @__PURE__ */ o.jsxs("div", { className: "obl-input-panel", children: [
            /* @__PURE__ */ o.jsx("h3", { children: "Known values" }),
            (t === "ASA" ? ["A", "B", "a"] : ["A", "a", "b"]).map((u) => /* @__PURE__ */ o.jsx(yt, { label: u === u.toUpperCase() ? `Angle ${u}` : `Side ${u} (opposite ${u.toUpperCase()})`, value: i[u], onChange: (d) => e.set(u, d), unit: u === u.toUpperCase() ? "°" : void 0 }, u)),
            /* @__PURE__ */ o.jsxs("button", { className: "obl-primary", onClick: () => {
              var u;
              return (u = document.getElementById("obl-sine-result")) == null ? void 0 : u.scrollIntoView({ block: "nearest" });
            }, children: [
              "Solve ",
              t === "ASA" ? "for side b" : "all possible angles"
            ] }),
            /* @__PURE__ */ o.jsx("button", { onClick: () => {
              r("ASA"), e.setValues({ A: 30, B: 45, C: 105, a: 10, b: 14, c: 19 });
            }, children: "Try Example" })
          ] }),
          /* @__PURE__ */ o.jsxs("div", { className: "obl-solution", id: "obl-sine-result", children: [
            /* @__PURE__ */ o.jsx("h3", { children: "Solution" }),
            l ? /* @__PURE__ */ o.jsxs(o.Fragment, { children: [
              /* @__PURE__ */ o.jsxs(Ra, { children: [
                /* @__PURE__ */ o.jsxs("li", { children: [
                  "Choose an opposite side-angle pair.",
                  /* @__PURE__ */ o.jsx(fe, { tex: "\\frac a{\\sin A}=\\frac b{\\sin B}" })
                ] }),
                t === "ASA" ? /* @__PURE__ */ o.jsxs(o.Fragment, { children: [
                  /* @__PURE__ */ o.jsxs("li", { children: [
                    "Find the third angle: C = 180° − ",
                    q(i.A),
                    "° − ",
                    q(i.B),
                    "° = ",
                    q(l.C),
                    "°."
                  ] }),
                  /* @__PURE__ */ o.jsxs("li", { children: [
                    "Substitute and isolate b.",
                    /* @__PURE__ */ o.jsx(fe, { tex: String.raw`b=\frac{${q(i.a)}\sin ${q(i.B)}^\circ}{\sin ${q(i.A)}^\circ}=${q(l.b, 4)}` })
                  ] }),
                  /* @__PURE__ */ o.jsxs("li", { children: [
                    "Similarly c = ",
                    q(l.c, 4),
                    "."
                  ] })
                ] }) : /* @__PURE__ */ o.jsxs(o.Fragment, { children: [
                  /* @__PURE__ */ o.jsxs("li", { children: [
                    "sin B = b sin A / a = ",
                    q(i.b * Math.sin(i.A * Math.PI / 180) / i.a, 5),
                    "."
                  ] }),
                  /* @__PURE__ */ o.jsx("li", { children: "Test both B = arcsin(value) and 180° − B. Keep only A + B < 180°." })
                ] })
              ] }),
              n.map((u, d) => /* @__PURE__ */ o.jsxs(ct, { children: [
                /* @__PURE__ */ o.jsxs("b", { children: [
                  n.length > 1 ? `Solution ${d + 1}: ` : "",
                  "b = ",
                  q(u.b, 4),
                  ", c = ",
                  q(u.c, 4),
                  " ",
                  a
                ] }),
                /* @__PURE__ */ o.jsxs("p", { children: [
                  "A = ",
                  q(u.A),
                  "°, B = ",
                  q(u.B),
                  "°, C = ",
                  q(u.C),
                  "°"
                ] }),
                /* @__PURE__ */ o.jsx(xr, { triangle: u })
              ] }, d))
            ] }) : /* @__PURE__ */ o.jsx(ct, { error: !0, children: "No valid triangle. Use positive sides and angles, A + B < 180°, and check SSA reach." })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ o.jsx(Da, { expected: (l == null ? void 0 : l.b) ?? null, prompt: "Find side b of the displayed triangle (to 2 decimals).", values: i, onExample: () => {
      r("ASA"), e.setValues({ A: 52, B: 71, C: 57, a: 120, b: 144, c: 128 });
    }, children: /* @__PURE__ */ o.jsxs(ge, { title: "Surveying Across a River", children: [
      /* @__PURE__ */ o.jsx("p", { children: "Measure a 120 m baseline opposite A = 52°, and a second bearing angle B = 71°. The Sine Law determines the inaccessible side b. Load this example using the surveying button above." }),
      /* @__PURE__ */ o.jsx("p", { children: "ASA and AAS both use two angles and one side. If the known side is b or c, use its opposite angle as the reference pair; every cyclic form works the same way." }),
      l && /* @__PURE__ */ o.jsxs("p", { children: [
        "Live ratios: a/sin A = ",
        q(l.a / Math.sin(l.A * Math.PI / 180), 4),
        ", b/sin B = ",
        q(l.b / Math.sin(l.B * Math.PI / 180), 4),
        ", c/sin C = ",
        q(l.c / Math.sin(l.C * Math.PI / 180), 4),
        "."
      ] })
    ] }) })
  ] });
}
const Ur = { A: 58, B: 62, C: 60, a: 8, b: 9.1, c: 7.5 };
function mc() {
  const a = qa(), e = ja("cosine-law", Ur), [t, r] = ce("SAS"), i = e.values, n = t === "SAS" ? Di(i.b, i.c, i.A) : yr(i.a, i.b, i.c);
  return /* @__PURE__ */ o.jsxs(o.Fragment, { children: [
    /* @__PURE__ */ o.jsxs("div", { className: "obl-lesson-grid", children: [
      /* @__PURE__ */ o.jsxs(ge, { title: "What it means", icon: "idea", children: [
        /* @__PURE__ */ o.jsx("p", { children: "The Cosine Law relates three sides and one included angle. Use SAS to find a side or SSS to find an angle." }),
        /* @__PURE__ */ o.jsx(fe, { tex: "a^2=b^2+c^2-2bc\\cos A" }),
        /* @__PURE__ */ o.jsx("p", { children: "It generalizes Pythagoras to every triangle." }),
        /* @__PURE__ */ o.jsx(da, { children: "For acute A, cos A is positive and a is shorter than the Pythagorean value. For obtuse A it is negative and a is longer." }),
        /* @__PURE__ */ o.jsxs("details", { children: [
          /* @__PURE__ */ o.jsx("summary", { children: "All cyclic forms and angle formula" }),
          /* @__PURE__ */ o.jsx(fe, { tex: "b^2=a^2+c^2-2ac\\cos B" }),
          /* @__PURE__ */ o.jsx(fe, { tex: "c^2=a^2+b^2-2ab\\cos C" }),
          /* @__PURE__ */ o.jsx(fe, { tex: "A=\\arccos\\left(\\frac{b^2+c^2-a^2}{2bc}\\right)" })
        ] })
      ] }),
      /* @__PURE__ */ o.jsx(Ea, { triangle: n, onChange: e.load, reset: () => {
        e.reset(), r("SAS");
      } }),
      /* @__PURE__ */ o.jsxs(ge, { title: "Solve a Triangle", className: "obl-solver", children: [
        /* @__PURE__ */ o.jsxs("div", { className: "obl-mode-buttons", children: [
          /* @__PURE__ */ o.jsx("button", { "aria-pressed": t === "SAS", onClick: () => r("SAS"), children: "Solve for a Side" }),
          /* @__PURE__ */ o.jsx("button", { "aria-pressed": t === "SSS", onClick: () => {
            n && e.load(n), r("SSS");
          }, children: "Solve for an Angle" })
        ] }),
        /* @__PURE__ */ o.jsxs("div", { className: "obl-solver-grid", children: [
          /* @__PURE__ */ o.jsxs("div", { className: "obl-input-panel", children: [
            /* @__PURE__ */ o.jsx("h3", { children: "Known values" }),
            (t === "SAS" ? ["b", "c", "A"] : ["a", "b", "c"]).map((l) => /* @__PURE__ */ o.jsx(yt, { label: l === "A" ? "Angle A" : `Side ${l}`, value: i[l], onChange: (u) => e.set(l, u), unit: l === "A" ? "°" : void 0 }, l)),
            /* @__PURE__ */ o.jsxs("button", { className: "obl-primary", onClick: () => {
              var l;
              return (l = document.getElementById("obl-cosine-result")) == null ? void 0 : l.scrollIntoView({ block: "nearest" });
            }, children: [
              "Solve for ",
              t === "SAS" ? "side a" : "angle A"
            ] }),
            /* @__PURE__ */ o.jsx("button", { onClick: () => {
              e.setValues(Ur), r("SAS");
            }, children: "Try Example" })
          ] }),
          /* @__PURE__ */ o.jsxs("div", { className: "obl-solution", id: "obl-cosine-result", children: [
            /* @__PURE__ */ o.jsx("h3", { children: "Solution" }),
            n ? /* @__PURE__ */ o.jsxs(o.Fragment, { children: [
              /* @__PURE__ */ o.jsx(Ra, { children: t === "SAS" ? /* @__PURE__ */ o.jsxs(o.Fragment, { children: [
                /* @__PURE__ */ o.jsxs("li", { children: [
                  "Use the included angle.",
                  /* @__PURE__ */ o.jsx(fe, { tex: "a^2=b^2+c^2-2bc\\cos A" })
                ] }),
                /* @__PURE__ */ o.jsxs("li", { children: [
                  "Substitute.",
                  /* @__PURE__ */ o.jsx(fe, { tex: String.raw`a^2=${q(i.b)}^2+${q(i.c)}^2-2(${q(i.b)})(${q(i.c)})\cos ${q(i.A)}^\circ` })
                ] }),
                /* @__PURE__ */ o.jsxs("li", { children: [
                  "cos A = ",
                  q(Math.cos(i.A * Math.PI / 180), 5),
                  "; a² = ",
                  q(n.a * n.a, 5),
                  "."
                ] }),
                /* @__PURE__ */ o.jsxs("li", { children: [
                  "Take the positive square root: a = ",
                  q(n.a, 5),
                  "."
                ] })
              ] }) : /* @__PURE__ */ o.jsxs(o.Fragment, { children: [
                /* @__PURE__ */ o.jsxs("li", { children: [
                  "Rearrange the Cosine Law.",
                  /* @__PURE__ */ o.jsx(fe, { tex: "\\cos A=\\frac{b^2+c^2-a^2}{2bc}" })
                ] }),
                /* @__PURE__ */ o.jsxs("li", { children: [
                  "Substitute: cos A = ",
                  q((i.b * i.b + i.c * i.c - i.a * i.a) / (2 * i.b * i.c), 6),
                  "."
                ] }),
                /* @__PURE__ */ o.jsxs("li", { children: [
                  "Take arccos: A = ",
                  q(n.A, 5),
                  "°."
                ] })
              ] }) }),
              /* @__PURE__ */ o.jsxs(ct, { children: [
                t === "SAS" ? `a = ${q(n.a, 4)} ${a}` : `A = ${q(n.A, 4)}°`,
                /* @__PURE__ */ o.jsx(xr, { triangle: n })
              ] })
            ] }) : /* @__PURE__ */ o.jsx(ct, { error: !0, children: "No triangle. Sides must be positive; the sum of any two must exceed the third. An included angle must be between 0° and 180°." })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ o.jsx(Da, { expected: n ? t === "SAS" ? n.a : n.A : null, prompt: `Find ${t === "SAS" ? "side a" : "angle A in degrees"} in the live triangle.`, values: { v: i, mode: t }, onExample: () => {
      r("SAS"), e.setValues({ ...Ur, b: 90, c: 70, A: 60 });
    }, children: /* @__PURE__ */ o.jsxs(ge, { title: "Discover Pythagoras and the Cosine Correction", children: [
      /* @__PURE__ */ o.jsx("p", { children: "Keep b and c fixed. Change the included angle and compare the third side." }),
      /* @__PURE__ */ o.jsx("div", { className: "obl-mode-buttons", children: [45, 90, 120].map((l) => /* @__PURE__ */ o.jsxs("button", { onClick: () => {
        r("SAS"), e.set("A", l);
      }, children: [
        l === 90 ? "Right" : l < 90 ? "Acute" : "Obtuse",
        " · ",
        l,
        "°"
      ] }, l)) }),
      /* @__PURE__ */ o.jsx(yt, { label: "Included angle A", value: i.A, onChange: (l) => {
        r("SAS"), e.set("A", l);
      }, unit: "°" }),
      /* @__PURE__ */ o.jsx("input", { "aria-label": "Adjust included angle A", type: "range", min: "1", max: "179", step: ".1", value: i.A, onChange: (l) => {
        r("SAS"), e.set("A", l.target.valueAsNumber);
      } }),
      /* @__PURE__ */ o.jsx(fe, { tex: "A=90^\\circ\\Rightarrow\\cos A=0\\Rightarrow a^2=b^2+c^2" }),
      n && /* @__PURE__ */ o.jsxs("p", { children: [
        "Live square decomposition: b² = ",
        q(n.b * n.b),
        ", c² = ",
        q(n.c * n.c),
        ", 2bc cos A = ",
        q(2 * n.b * n.c * Math.cos(n.A * Math.PI / 180)),
        ", a² = ",
        q(n.a * n.a),
        "."
      ] }),
      /* @__PURE__ */ o.jsxs("details", { children: [
        /* @__PURE__ */ o.jsx("summary", { children: "Derivation by dropping an altitude" }),
        /* @__PURE__ */ o.jsx("p", { children: "Place A at the origin, B at (c,0), C at (b cos A, b sin A). Then a² = (c − b cos A)² + (b sin A)². Expand and use sin² A + cos² A = 1." })
      ] })
    ] }) })
  ] });
}
const Bn = { A: 47, B: 63, C: 70, a: 7, b: 8.4, c: 10.2 }, Pn = { A: ["b", "c"], B: ["c", "a"], C: ["a", "b"] };
function pc() {
  const a = qa(), e = ja("area", Bn), [t, r] = ce("A"), i = e.values, [n, l] = Pn[t], u = ic(i[n], i[l], i[t], t);
  return /* @__PURE__ */ o.jsxs(o.Fragment, { children: [
    /* @__PURE__ */ o.jsxs("div", { className: "obl-lesson-grid", children: [
      /* @__PURE__ */ o.jsxs(ge, { title: "What it means", icon: "idea", children: [
        /* @__PURE__ */ o.jsx("p", { children: "Two sides and the angle between them determine the area. Always choose the included angle." }),
        /* @__PURE__ */ o.jsx(fe, { tex: "K=\\tfrac12 bc\\sin A" }),
        /* @__PURE__ */ o.jsx(fe, { tex: "=\\tfrac12 ca\\sin B=\\tfrac12 ab\\sin C" }),
        /* @__PURE__ */ o.jsx(da, { children: "The sine of the included angle supplies the height factor. Different-looking formulas give the same area." }),
        /* @__PURE__ */ o.jsx("p", { children: "Area is measured in square units. Scaling every side by k multiplies area by k²." })
      ] }),
      /* @__PURE__ */ o.jsx(Ea, { triangle: u, onChange: e.load, reset: () => {
        e.reset(), r("A");
      }, height: !0, activePair: t }),
      /* @__PURE__ */ o.jsxs(ge, { title: "Calculate the Area", className: "obl-solver", children: [
        /* @__PURE__ */ o.jsxs("label", { children: [
          "Formula choice",
          /* @__PURE__ */ o.jsx("select", { "aria-label": "Area formula choice", value: t, onChange: (d) => {
            u && e.load(u), r(d.target.value);
          }, children: ["A", "B", "C"].map((d) => /* @__PURE__ */ o.jsxs("option", { value: d, children: [
            "Using ",
            Pn[d].join(", "),
            " and ",
            d
          ] }, d)) })
        ] }),
        /* @__PURE__ */ o.jsxs("div", { className: "obl-solver-grid", children: [
          /* @__PURE__ */ o.jsxs("div", { className: "obl-input-panel", children: [
            /* @__PURE__ */ o.jsx("h3", { children: "Known values" }),
            [n, l].map((d) => /* @__PURE__ */ o.jsx(yt, { label: `Side ${d}`, value: i[d], onChange: (p) => e.set(d, p) }, d)),
            /* @__PURE__ */ o.jsx(yt, { label: `Angle ${t} (between ${n} and ${l})`, value: i[t], onChange: (d) => e.set(t, d), unit: "°" }),
            /* @__PURE__ */ o.jsx("button", { className: "obl-primary", onClick: () => {
              var d;
              return (d = document.getElementById("obl-area-result")) == null ? void 0 : d.scrollIntoView({ block: "nearest" });
            }, children: "Calculate Area" }),
            /* @__PURE__ */ o.jsx("button", { onClick: () => {
              e.reset(), r("A");
            }, children: "Try Example" })
          ] }),
          /* @__PURE__ */ o.jsxs("div", { className: "obl-solution", id: "obl-area-result", children: [
            /* @__PURE__ */ o.jsx("h3", { children: "Solution" }),
            u ? /* @__PURE__ */ o.jsxs(o.Fragment, { children: [
              /* @__PURE__ */ o.jsxs(Ra, { children: [
                /* @__PURE__ */ o.jsxs("li", { children: [
                  "Select the matching included-angle formula.",
                  /* @__PURE__ */ o.jsx(fe, { tex: String.raw`K=\tfrac12 ${n}${l}\sin ${t}` })
                ] }),
                /* @__PURE__ */ o.jsxs("li", { children: [
                  "Substitute.",
                  /* @__PURE__ */ o.jsx(fe, { tex: String.raw`K=\tfrac12 (${q(i[n])})(${q(i[l])})\sin ${q(i[t])}^\circ` })
                ] }),
                /* @__PURE__ */ o.jsxs("li", { children: [
                  "sin ",
                  t,
                  " = ",
                  q(Math.sin(i[t] * Math.PI / 180), 6),
                  "."
                ] }),
                /* @__PURE__ */ o.jsxs("li", { children: [
                  "Multiply: K = ",
                  q(u.area, 6),
                  "."
                ] })
              ] }),
              /* @__PURE__ */ o.jsxs(ct, { children: [
                "Area ≈ ",
                q(u.area),
                " ",
                a,
                "²."
              ] })
            ] }) : /* @__PURE__ */ o.jsx(ct, { error: !0, children: "Enter two positive sides and an included angle strictly between 0° and 180°." })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ o.jsxs(Da, { expected: (u == null ? void 0 : u.area) ?? null, prompt: "Find the area of the displayed triangle, in square units.", values: { v: i, vertex: t }, onExample: () => {
      r("A"), e.setValues({ ...Bn, b: 20, c: 30, A: 45 });
    }, children: [
      /* @__PURE__ */ o.jsxs(ge, { title: "Visual Derivation: Base × Height", children: [
        /* @__PURE__ */ o.jsx(fe, { tex: "h=b\\sin A,\\qquad K=\\tfrac12 ch=\\tfrac12 c(b\\sin A)" }),
        /* @__PURE__ */ o.jsx("p", { children: "Switch on “Show height” and drag C. The altitude falls perpendicular to base AB, even outside the triangle for an obtuse angle." }),
        /* @__PURE__ */ o.jsx("p", { children: "With two fixed sides, the largest area occurs at a 90° included angle. Supplementary included angles have equal sine and therefore equal area." }),
        /* @__PURE__ */ o.jsx("button", { onClick: () => {
          r("A"), e.set("A", 90);
        }, children: "Explore maximum area" }),
        /* @__PURE__ */ o.jsx("button", { onClick: () => e.set(t, 180 - i[t]), children: "Try supplementary angle" })
      ] }),
      u && /* @__PURE__ */ o.jsx(ro, { t: u })
    ] })
  ] });
}
const In = { A: 35, B: 0, C: 0, a: 7, b: 10, c: 0 }, Ya = [{ label: "No triangle", A: 30, a: 4, b: 10 }, { label: "One right triangle", A: 30, a: 5, b: 10 }, { label: "Two triangles", A: 35, a: 7, b: 10 }, { label: "One ordinary triangle", A: 35, a: 12, b: 10 }, { label: "Obtuse: no triangle", A: 110, a: 8, b: 10 }, { label: "Obtuse: one triangle", A: 110, a: 12, b: 10 }];
function fc() {
  const a = qa(), e = ja("ssa", In), [t, r] = ce(!1), [i, n] = ce(0), l = e.values, u = sa(l.A, l.a, l.b), d = l.b * Math.sin(Dt(l.A)), p = Number.isFinite(d) && l.A > 0 && l.A < 180 && l.a > 0 && l.b > 0, f = (b) => {
    n(b), e.setValues({ ...In, ...Ya[b] });
  };
  return /* @__PURE__ */ o.jsxs(o.Fragment, { children: [
    /* @__PURE__ */ o.jsxs("div", { className: "obl-lesson-grid", children: [
      /* @__PURE__ */ o.jsxs(ge, { title: "What it means", icon: "idea", children: [
        /* @__PURE__ */ o.jsx("p", { children: "SSA gives two sides and a non-included angle. A side can swing to reach the same baseline in zero, one or two places." }),
        /* @__PURE__ */ o.jsx(fe, { tex: "h=b\\sin A" }),
        /* @__PURE__ */ o.jsxs("div", { className: "obl-rule-table", children: [
          /* @__PURE__ */ o.jsx("b", { children: "For acute A only" }),
          /* @__PURE__ */ o.jsx("p", { children: "a < h → no triangle" }),
          /* @__PURE__ */ o.jsx("p", { children: "a = h → one right triangle" }),
          /* @__PURE__ */ o.jsx("p", { children: "h < a < b → two triangles" }),
          /* @__PURE__ */ o.jsx("p", { children: "a ≥ b → one triangle" })
        ] }),
        /* @__PURE__ */ o.jsx(da, { children: "For A ≥ 90°, a must be longer than b. If a > b, there is one solution; otherwise none. Height alone is not enough." }),
        /* @__PURE__ */ o.jsx("p", { children: "Standard notation: b = AC is fixed, a = BC swings about C, and B moves on the ray from A. This keeps a opposite A." })
      ] }),
      /* @__PURE__ */ o.jsx(Ea, { triangle: u[0] ?? null, alternative: u[1], onChange: e.load, reset: e.reset, height: !0, construction: p ? { A: l.A, a: l.a, b: l.b } : void 0 }),
      /* @__PURE__ */ o.jsxs(ge, { title: "Check the Case", className: "obl-solver", children: [
        /* @__PURE__ */ o.jsxs("div", { className: "obl-mode-buttons", children: [
          /* @__PURE__ */ o.jsx("button", { onClick: () => {
            var b;
            return (b = document.getElementById("obl-ssa-result")) == null ? void 0 : b.scrollIntoView({ block: "nearest" });
          }, children: "Analyze" }),
          /* @__PURE__ */ o.jsx("button", { onClick: () => f((i + 1) % Ya.length), children: "Try Values" }),
          /* @__PURE__ */ o.jsx("button", { "aria-pressed": t, onClick: () => r((b) => !b), children: "Compare Outcomes" })
        ] }),
        /* @__PURE__ */ o.jsxs("div", { className: "obl-solver-grid", children: [
          /* @__PURE__ */ o.jsxs("div", { className: "obl-input-panel", children: [
            /* @__PURE__ */ o.jsx("h3", { children: "Given values" }),
            /* @__PURE__ */ o.jsx(yt, { label: "Angle A", value: l.A, onChange: (b) => e.set("A", b), unit: "°" }),
            /* @__PURE__ */ o.jsx(yt, { label: "Side a (opposite A)", value: l.a, onChange: (b) => e.set("a", b) }),
            /* @__PURE__ */ o.jsx(yt, { label: "Side b", value: l.b, onChange: (b) => e.set("b", b) }),
            /* @__PURE__ */ o.jsx("button", { className: "obl-primary", onClick: () => {
              var b;
              return (b = document.getElementById("obl-ssa-result")) == null ? void 0 : b.scrollIntoView({ block: "nearest" });
            }, children: "Determine the Case" }),
            /* @__PURE__ */ o.jsx("button", { onClick: e.reset, children: "Try Example" })
          ] }),
          /* @__PURE__ */ o.jsxs("div", { className: "obl-solution", id: "obl-ssa-result", children: [
            /* @__PURE__ */ o.jsx("h3", { children: "Solution" }),
            p ? /* @__PURE__ */ o.jsxs(o.Fragment, { children: [
              /* @__PURE__ */ o.jsxs(Ra, { children: [
                /* @__PURE__ */ o.jsxs("li", { children: [
                  "Find height h = ",
                  q(l.b),
                  " sin ",
                  q(l.A),
                  "° = ",
                  q(d, 5),
                  "."
                ] }),
                /* @__PURE__ */ o.jsx("li", { children: l.A < 90 ? `Compare a = ${q(l.a)} with h = ${q(d, 5)} and b = ${q(l.b)}.` : `Angle A is ${l.A === 90 ? "right" : "obtuse"}: compare a with b. The opposite side a must be longer.` }),
                /* @__PURE__ */ o.jsxs("li", { children: [
                  "sin B = b sin A / a = ",
                  q(d / l.a, 6),
                  ". Test B and its supplement; reject A + B ≥ 180°."
                ] })
              ] }),
              /* @__PURE__ */ o.jsxs(ct, { error: u.length === 0, children: [
                u.length,
                " possible ",
                u.length === 1 ? "triangle" : "triangles",
                "."
              ] }),
              u.map((b, S) => /* @__PURE__ */ o.jsxs("div", { className: "obl-complete", children: [
                /* @__PURE__ */ o.jsxs("h4", { children: [
                  "Triangle ",
                  S + 1
                ] }),
                /* @__PURE__ */ o.jsxs("p", { children: [
                  "B = ",
                  q(b.B, 5),
                  "°, C = ",
                  q(b.C, 5),
                  "°, c = ",
                  q(b.c, 5),
                  " ",
                  a
                ] }),
                /* @__PURE__ */ o.jsxs("p", { children: [
                  "A = ",
                  q(b.A),
                  "°, a = ",
                  q(b.a),
                  ", b = ",
                  q(b.b)
                ] }),
                /* @__PURE__ */ o.jsx(xr, { triangle: b })
              ] }, S))
            ] }) : /* @__PURE__ */ o.jsx(ct, { error: !0, children: "Use positive sides and an angle strictly between 0° and 180°." })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ o.jsx("div", { className: "obl-presets", "aria-label": "SSA presets", children: Ya.map((b, S) => /* @__PURE__ */ o.jsx("button", { onClick: () => f(S), children: b.label }, b.label)) }),
    t && /* @__PURE__ */ o.jsx(ge, { title: "Compare Outcomes", children: /* @__PURE__ */ o.jsx("div", { className: "obl-outcomes", children: Ya.map((b, S) => /* @__PURE__ */ o.jsxs("button", { onClick: () => f(S), children: [
      /* @__PURE__ */ o.jsx("b", { children: b.label }),
      /* @__PURE__ */ o.jsxs("small", { children: [
        "A = ",
        b.A,
        "°, a = ",
        b.a,
        ", b = ",
        b.b
      ] }),
      /* @__PURE__ */ o.jsxs("strong", { children: [
        sa(b.A, b.a, b.b).length,
        " solutions"
      ] })
    ] }, b.label)) }) }),
    /* @__PURE__ */ o.jsx(Da, { expected: p ? u.length : null, prompt: "How many valid triangles are possible for the current A, a and b?", values: l, onExample: () => f(2), children: /* @__PURE__ */ o.jsxs(ge, { title: "Why the Second Solution Exists", children: [
      /* @__PURE__ */ o.jsx("p", { children: "The inverse sine returns an acute principal angle. But sin B = sin(180° − B). Both angles can fit the measured side ratio; only the angle-sum test tells us which are valid." }),
      /* @__PURE__ */ o.jsx("p", { children: "A right-angle tangent occurs when the swinging circle just touches the ray. The two intersections merge into one, rather than producing duplicate solutions." }),
      /* @__PURE__ */ o.jsx("p", { children: "Navigation and surveying can need an extra bearing or side measurement to distinguish the two configurations. Neither candidate should be silently discarded." }),
      /* @__PURE__ */ o.jsx(fe, { tex: "B_1=\\arcsin\\left(\\frac{b\\sin A}{a}\\right),\\quad B_2=180^\\circ-B_1" })
    ] }) })
  ] });
}
const nt = { A: 42, B: 71, C: 67, a: 8.6, b: 11.6, c: 12.8 }, Ln = { ASA: ["A", "B", "c"], AAS: ["A", "B", "a"], SAS: ["b", "c", "A"], SSS: ["a", "b", "c"], SSA: ["A", "a", "b"] }, Fn = { ASA: "Find the third angle, then use the Sine Law.", AAS: "Find the third angle, then use the Sine Law.", SAS: "Use the Cosine Law for the opposite side, then find angles.", SSS: "Use the Cosine Law to find angles.", SSA: "Use the Sine Law and test both possible angles." };
function gc() {
  const a = qa(), e = ja("solve-triangle", nt), [t, r] = Ja("ObliqueStudio:solve:case", "ASA"), [i, n] = ce(0), [l, u] = ce(0), [d, p] = ce(0), [f, b] = Ja("ObliqueTriangleLab:ObliqueTriangleLab:known", { a: !0, b: !0, c: !0, A: !0, B: !0, C: !1 }), S = e.values, w = rc(t, S), j = w[l] ?? w[0] ?? null, R = () => {
    const k = d + 1;
    p(k), n(0), u(0);
    const L = t === "SSS" ? { ...nt, a: 3, b: 4, c: 5 } : t === "SSA" ? { ...nt, A: 40, a: 8, b: 10 } : t === "SAS" ? { ...nt, A: 60, b: 9, c: 7 } : { ...nt, A: 30, B: 45, a: 10, c: 19.3185165258 };
    e.setValues(k % 2 ? L : nt);
  }, N = Ln[t], I = (k) => {
    r(k), n(0), u(0), k === "SSA" ? e.setValues({ ...nt, A: 35, a: 7, b: 10 }) : k === "SSS" ? e.setValues({ ...nt, a: 5, b: 6, c: 7 }) : k === "SAS" ? e.setValues({ ...nt, A: 58, b: 9.1, c: 7.5 }) : e.reset();
  }, O = (k) => t === "ASA" || t === "AAS" ? [`Find C = 180° − ${q(S.A)}° − ${q(S.B)}° = ${q(k.C)}°.`, t === "ASA" ? `Use a = c sin A / sin C = ${q(k.a, 5)}.` : `Use b = a sin B / sin A = ${q(k.b, 5)}.`, t === "ASA" ? `Use b = c sin B / sin C = ${q(k.b, 5)}.` : `Use c = a sin C / sin A = ${q(k.c, 5)}.`, "All six quantities found. Verify angle sum and triangle inequalities."] : t === "SAS" ? [`Use a² = b² + c² − 2bc cos A = ${q(k.a * k.a, 5)}.`, `Take the positive square root: a = ${q(k.a, 5)}.`, `Use arccos to find B = ${q(k.B, 5)}°; C = 180° − A − B = ${q(k.C, 5)}°.`, "Verify all six values and triangle inequalities."] : t === "SSS" ? [`Use cos A = (b²+c²−a²)/(2bc); A = ${q(k.A, 5)}°.`, `Use cos B = (a²+c²−b²)/(2ac); B = ${q(k.B, 5)}°.`, `Find C = 180° − A − B = ${q(k.C, 5)}°.`, "Verify all six values and triangle inequalities."] : ["Use sin B = b sin A / a; test both B and 180°−B.", `For this solution: B = ${q(k.B, 5)}°, C = ${q(k.C, 5)}°.`, `Use c = a sin C / sin A = ${q(k.c, 5)}.`, `Verify all ${w.length} valid solutions without silently selecting only one.`];
  return /* @__PURE__ */ o.jsxs(o.Fragment, { children: [
    /* @__PURE__ */ o.jsxs("div", { className: "obl-lesson-grid", children: [
      /* @__PURE__ */ o.jsxs(ge, { title: "Problem Types", children: [
        /* @__PURE__ */ o.jsx("p", { children: "Three independent measurements, including at least one side, can determine a triangle. SSA may be ambiguous; AAA determines only shape." }),
        /* @__PURE__ */ o.jsx("div", { className: "obl-case-list", children: ["ASA", "AAS", "SAS", "SSS", "SSA"].map((k) => /* @__PURE__ */ o.jsxs("button", { "aria-pressed": t === k, onClick: () => I(k), children: [
          /* @__PURE__ */ o.jsx("b", { children: k }),
          /* @__PURE__ */ o.jsx("span", { children: Fn[k] })
        ] }, k)) }),
        /* @__PURE__ */ o.jsx(da, { children: "Select the method from what is known. The included angle is essential in SAS; a non-included angle creates SSA." })
      ] }),
      /* @__PURE__ */ o.jsx(Ea, { triangle: j, alternative: w.length > 1 ? w[l === 0 ? 1 : 0] : void 0, onChange: e.load, reset: () => {
        e.reset(), r("ASA"), n(0);
      }, known: N, activePair: i === 0 ? "C" : i === 1 ? "A" : i === 2 ? "B" : "C" }),
      /* @__PURE__ */ o.jsx(ge, { title: "Step-by-Step Solver", className: "obl-solver", children: /* @__PURE__ */ o.jsxs("div", { className: "obl-solver-grid", children: [
        /* @__PURE__ */ o.jsxs("div", { className: "obl-input-panel", children: [
          /* @__PURE__ */ o.jsx("h3", { children: "Choose case" }),
          /* @__PURE__ */ o.jsx("select", { "aria-label": "Problem type", value: t, onChange: (k) => I(k.target.value), children: Object.keys(Ln).map((k) => /* @__PURE__ */ o.jsx("option", { children: k }, k)) }),
          /* @__PURE__ */ o.jsx("p", { children: Fn[t] }),
          /* @__PURE__ */ o.jsx("h3", { children: "Enter known values" }),
          N.map((k) => /* @__PURE__ */ o.jsx(yt, { label: k === k.toUpperCase() ? `Angle ${k}` : `Side ${k}`, value: S[k], onChange: (L) => {
            e.set(k, L), n(0);
          }, unit: k === k.toUpperCase() ? "°" : void 0 }, k)),
          /* @__PURE__ */ o.jsx("button", { className: "obl-primary", onClick: () => {
            var k;
            n(3), (k = document.getElementById("obl-full-solution")) == null || k.scrollIntoView({ block: "nearest" });
          }, children: "Solve Triangle" }),
          /* @__PURE__ */ o.jsx("button", { onClick: R, children: "Try Another Example" })
        ] }),
        /* @__PURE__ */ o.jsxs("div", { className: "obl-solution", id: "obl-full-solution", children: [
          /* @__PURE__ */ o.jsx("h3", { children: "Step-by-step solution" }),
          j ? /* @__PURE__ */ o.jsxs(o.Fragment, { children: [
            /* @__PURE__ */ o.jsx(Ra, { children: O(j).map((k, L) => /* @__PURE__ */ o.jsx("li", { className: L === i ? "obl-current-step" : "", children: /* @__PURE__ */ o.jsx("button", { className: "obl-step-button", onClick: () => n(L), "aria-pressed": i === L, children: k }) }, k)) }),
            /* @__PURE__ */ o.jsxs("div", { className: "obl-mode-buttons", children: [
              /* @__PURE__ */ o.jsx("button", { disabled: i === 0, onClick: () => n((k) => k - 1), children: "Previous Step" }),
              /* @__PURE__ */ o.jsx("button", { disabled: i === 3, onClick: () => n((k) => k + 1), children: "Next Step" })
            ] }),
            w.length > 1 && /* @__PURE__ */ o.jsx("div", { className: "obl-mode-buttons", children: w.map((k, L) => /* @__PURE__ */ o.jsxs("button", { "aria-pressed": l === L, onClick: () => {
              u(L), n(0);
            }, children: [
              "Solution ",
              L + 1
            ] }, L)) }),
            w.map((k, L) => /* @__PURE__ */ o.jsxs(ct, { children: [
              /* @__PURE__ */ o.jsxs("b", { children: [
                "Complete triangle ",
                w.length > 1 ? L + 1 : ""
              ] }),
              /* @__PURE__ */ o.jsxs("p", { children: [
                "A = ",
                q(k.A),
                "°, B = ",
                q(k.B),
                "°, C = ",
                q(k.C),
                "°"
              ] }),
              /* @__PURE__ */ o.jsxs("p", { children: [
                "a = ",
                q(k.a),
                ", b = ",
                q(k.b),
                ", c = ",
                q(k.c),
                " ",
                a
              ] }),
              /* @__PURE__ */ o.jsx(xr, { triangle: k })
            ] }, L))
          ] }) : /* @__PURE__ */ o.jsx(ct, { error: !0, children: t === "SSS" ? `${q(S.a)} + ${q(S.b)} must exceed ${q(S.c)}, and all three triangle inequalities must hold.` : "No valid solution. Check positive sides, valid angle sums, and SSA feasibility." })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ o.jsxs(Da, { expected: (j == null ? void 0 : j.C) ?? null, prompt: "Find the third angle C of the displayed solution, in degrees.", values: { v: S, kind: t, solution: l }, onExample: () => {
      r("AAS"), e.setValues({ ...nt, A: 52, B: 71, a: 120 });
    }, children: [
      /* @__PURE__ */ o.jsxs(ge, { title: "Known Values and Verification Workspace", children: [
        /* @__PURE__ */ o.jsx("p", { children: "Preserved known-value markers for planning a measurement problem. Select any three independent quantities, then choose the corresponding case above. Markers do not change the solver’s input requirements." }),
        /* @__PURE__ */ o.jsx("div", { className: "obl-known-grid", children: ["a", "b", "c", "A", "B", "C"].map((k) => /* @__PURE__ */ o.jsxs("label", { children: [
          /* @__PURE__ */ o.jsx("input", { type: "checkbox", checked: f[k], onChange: (L) => b((V) => ({ ...V, [k]: L.target.checked })) }),
          k,
          " known"
        ] }, k)) }),
        /* @__PURE__ */ o.jsxs("p", { children: [
          Object.values(f).filter(Boolean).length,
          " / 6 values marked."
        ] }),
        /* @__PURE__ */ o.jsx(fe, { tex: "A+B+C=180^\\circ,\\quad a+b>c,\\ a+c>b,\\ b+c>a" }),
        /* @__PURE__ */ o.jsx("p", { children: "AAA supplies no absolute size; fewer than three independent measurements cannot uniquely solve an oblique triangle. No solution is fabricated for insufficient or inconsistent data." })
      ] }),
      j && /* @__PURE__ */ o.jsx(ro, { t: j })
    ] })
  ] });
}
const vc = { "sine-law": hc, "cosine-law": mc, area: pc, "ssa-ambiguous-case": fc, "solve-triangle": gc }, Nn = es.trigonometry.pages.find((a) => a.id === "oblique"), bc = ["Relates sides and opposite angles in any oblique triangle.", "Find unknown sides or angles using the included-angle relationship.", "Use trigonometry to find the area of any oblique triangle.", "Discover when one set of measurements produces 0, 1 or 2 triangles.", "Find every side and angle, choose a method, and verify the result."];
function kc() {
  return /* @__PURE__ */ o.jsx(t0, { children: /* @__PURE__ */ o.jsx(yc, {}) });
}
function yc() {
  const a = Gn(), [e] = Vn(), t = a.pathname.slice(it.length).replace(/^\/+|\/+$/g, ""), r = oc(e.get("mode")), i = wa.findIndex(([w]) => w === t), n = i < 0 ? "Sine & Cosine Laws" : wa[i][1], [l, u] = ce(""), d = nr(), p = d == null ? void 0 : d.ledger;
  if (ea(() => {
    p && p.apply({ ...p.saved, ...p.values });
  }, [p]), ea(() => {
    document.title = `${n} | Trigonometry Studio`;
  }, [n]), ea(() => {
    var w;
    u(""), (w = document.querySelector(".obl-header")) == null || w.scrollIntoView({ block: "start" });
  }, [t]), !t && r) {
    const w = new URLSearchParams(e);
    return w.delete("mode"), /* @__PURE__ */ o.jsx($i, { replace: !0, to: `${it}/${r}${w.size ? "?" + w : ""}${a.hash}` });
  }
  if (t && i < 0) return /* @__PURE__ */ o.jsx($i, { replace: !0, to: it });
  const f = wa.filter(([, w, j]) => `${w} ${j}`.toLowerCase().includes(l.toLowerCase())), b = vc[t] ?? uc, S = i < 0 ? "Sine Law" : Nn.modes[i];
  return /* @__PURE__ */ o.jsxs(o.Fragment, { children: [
    /* @__PURE__ */ o.jsxs("div", { className: "obl-studio", "data-oblique-page": t || "overview", children: [
      /* @__PURE__ */ o.jsxs("header", { className: "obl-header", children: [
        /* @__PURE__ */ o.jsxs(ot, { to: "/trigonometry", className: "obl-brand", children: [
          /* @__PURE__ */ o.jsx(Za, {}),
          /* @__PURE__ */ o.jsxs("span", { children: [
            "Trigonometry ",
            /* @__PURE__ */ o.jsx("b", { children: "Studio" }),
            /* @__PURE__ */ o.jsx("small", { children: "EXPLORE · VISUALIZE · MASTER" })
          ] })
        ] }),
        /* @__PURE__ */ o.jsxs("div", { className: "obl-search", children: [
          /* @__PURE__ */ o.jsx(Fo, {}),
          /* @__PURE__ */ o.jsx("input", { "aria-label": "Search Sine and Cosine Laws topics", placeholder: "Search topics, skills or examples…", value: l, onChange: (w) => u(w.target.value) }),
          l && /* @__PURE__ */ o.jsx("div", { className: "obl-search-results", role: "region", "aria-label": "Search results", children: f.length ? f.map(([w, j]) => /* @__PURE__ */ o.jsx(ot, { to: `${it}/${w}`, children: j }, w)) : /* @__PURE__ */ o.jsx("p", { children: "No matching topics." }) })
        ] }),
        /* @__PURE__ */ o.jsxs("nav", { "aria-label": "Studio navigation", children: [
          /* @__PURE__ */ o.jsxs(ot, { to: "/trigonometry", children: [
            /* @__PURE__ */ o.jsx(Po, {}),
            "Studio Home"
          ] }),
          /* @__PURE__ */ o.jsxs(ot, { className: "obl-primary", to: "/", children: [
            /* @__PURE__ */ o.jsx(Bo, {}),
            "Main App Home"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ o.jsxs("nav", { className: "obl-subnav", "aria-label": "Sine & Cosine Laws pages", children: [
        /* @__PURE__ */ o.jsx(Wi, { end: !0, to: it, children: "Overview" }),
        wa.map(([w, j]) => /* @__PURE__ */ o.jsx(Wi, { to: `${it}/${w}`, children: j }, w)),
        /* @__PURE__ */ o.jsxs("div", { className: "obl-model-tools", children: [
          /* @__PURE__ */ o.jsx("button", { "aria-label": "Undo triangle change", disabled: !(d != null && d.ledger.past.length), onClick: () => d == null ? void 0 : d.ledger.undo(), children: /* @__PURE__ */ o.jsx(Wo, {}) }),
          /* @__PURE__ */ o.jsx("button", { "aria-label": "Redo triangle change", disabled: !(d != null && d.ledger.future.length), onClick: () => d == null ? void 0 : d.ledger.redo(), children: /* @__PURE__ */ o.jsx(Io, {}) }),
          /* @__PURE__ */ o.jsxs("button", { onClick: () => d == null ? void 0 : d.share(), children: [
            /* @__PURE__ */ o.jsx(No, {}),
            "Share"
          ] })
        ] })
      ] }),
      (d == null ? void 0 : d.status) && /* @__PURE__ */ o.jsx("p", { className: "obl-share-status", role: "status", children: d.status }),
      /* @__PURE__ */ o.jsxs("main", { children: [
        i >= 0 && /* @__PURE__ */ o.jsxs("section", { className: `obl-hero ${i < 0 ? "obl-home-hero" : ""}`, children: [
          /* @__PURE__ */ o.jsx(io, {}),
          /* @__PURE__ */ o.jsxs("div", { children: [
            /* @__PURE__ */ o.jsxs("span", { children: [
              "TRIGONOMETRY ",
              i < 0 ? "STUDIO" : "LAB"
            ] }),
            /* @__PURE__ */ o.jsx("h1", { children: n }),
            /* @__PURE__ */ o.jsx("p", { children: i < 0 ? "Solve Any Triangle, Anywhere" : bc[i] }),
            i >= 0 && /* @__PURE__ */ o.jsxs("div", { className: "obl-hero-tags", children: [
              /* @__PURE__ */ o.jsx("span", { children: "Explore visually" }),
              /* @__PURE__ */ o.jsx("span", { children: "Solve step by step" }),
              /* @__PURE__ */ o.jsx("span", { children: "Build real skills" })
            ] })
          ] }),
          /* @__PURE__ */ o.jsxs("aside", { children: [
            "Real triangles.",
            /* @__PURE__ */ o.jsx("br", {}),
            "Real world.",
            /* @__PURE__ */ o.jsx("br", {}),
            "Brighter futures."
          ] })
        ] }),
        /* @__PURE__ */ o.jsxs("div", { className: "obl-content", children: [
          /* @__PURE__ */ o.jsx(b, {}, t),
          /* @__PURE__ */ o.jsx(xc, { mode: S })
        ] })
      ] }),
      /* @__PURE__ */ o.jsxs("footer", { className: "obl-footer", children: [
        /* @__PURE__ */ o.jsxs(ot, { to: "/trigonometry", children: [
          /* @__PURE__ */ o.jsx(Kn, {}),
          "Trigonometry Studio"
        ] }),
        /* @__PURE__ */ o.jsx("span", { children: "Explore Triangles. Solve the World." })
      ] })
    ] }),
    /* @__PURE__ */ o.jsx("div", { className: "obl-preserved-learning", children: /* @__PURE__ */ o.jsx(_o, { studioId: "trigonometry", page: Nn, mode: S }) })
  ] });
}
function xc({ mode: a }) {
  const e = { "Sine Law": ["If A = B, what is a/b?", 1, "Equal angles have equal opposite sides."], "Cosine Law": ["If C = 90° and a = b = 1, what is c²?", 2, "Use Pythagoras."], Area: ["If a = b = 2 and C = 90°, what is the area?", 2, "Use ½ab sin C."], "SSA Ambiguous Case": ["For acute A, if a = h = b sin A, how many triangles exist?", 1, "The swinging circle is tangent to the ray."], "Solve Triangle": ["What is the angle sum of a Euclidean triangle in degrees?", 180, "Add its three interior angles."] }, [t, r, i] = e[a];
  return /* @__PURE__ */ o.jsxs("details", { className: "obl-preserved-practice", children: [
    /* @__PURE__ */ o.jsx("summary", { children: "Original Concept Practice & Learning Notes" }),
    /* @__PURE__ */ o.jsxs(ge, { title: "Observe · Understand · Why · Try", children: [
      /* @__PURE__ */ o.jsx("p", { children: a === "Sine Law" ? "Compare all three ratios; the circumdiameter is 2R = a/sin A." : a === "Cosine Law" ? "Set the included angle to 90° and observe Pythagoras; compare the square decomposition." : a === "Area" ? "Widen the included angle and compare the shaded area, height and Heron’s formula." : a === "SSA Ambiguous Case" ? "Lower a toward h = b sin A and watch the two solutions merge, then disappear. The acute rule does not apply to obtuse A." : "Read all three sides and angles; SAS gives a unique triangle and its angle sum is 180°." }),
      /* @__PURE__ */ o.jsx(ao, { fixed: !0, prompt: t + " This is a fixed concept question, independent of the live model.", expected: r, signature: a, hint: i })
    ] })
  ] });
}
export {
  kc as default
};
