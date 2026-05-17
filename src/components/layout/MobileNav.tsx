import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { navItems } from "./navItems";

type MobileNavProps = {
  open: boolean;
  onClose: () => void;
};

export default function MobileNav({ open, onClose }: MobileNavProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button className="absolute inset-0 bg-slate-950/60" type="button" aria-label="Close navigation" onClick={onClose} />
          <motion.aside
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className="relative h-full w-80 max-w-[86vw] overflow-y-auto bg-white p-5 pb-8 shadow-2xl dark:bg-slate-950"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-lg font-bold">Math Universe</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Visual learning space</p>
              </div>
              <button type="button" onClick={onClose} className="rounded-full p-2 transition hover:bg-slate-100 dark:hover:bg-white/10" aria-label="Close navigation">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="space-y-1">
              {navItems.map(({ title, route, icon: Icon, isExternal }) =>
                isExternal ? (
                  <a
                    key={route}
                    href={route}
                    onClick={onClose}
                    className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-600 transition dark:text-slate-300"
                  >
                    <Icon className="h-5 w-5" />
                    {title}
                  </a>
                ) : (
                  <NavLink
                    key={route}
                    to={route}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                        isActive ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950" : "text-slate-600 dark:text-slate-300"
                      }`
                    }
                  >
                    <Icon className="h-5 w-5" />
                    {title}
                  </NavLink>
                ),
              )}
            </nav>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
