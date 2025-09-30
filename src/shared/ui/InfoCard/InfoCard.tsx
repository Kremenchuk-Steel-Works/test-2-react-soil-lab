export const InfoCard: React.FC<{
  label: string
  children: React.ReactNode
  className?: string
}> = ({ label, children, className }) => (
  <div
    className={
      'rounded-xl border border-slate-200 bg-white/60 p-2 shadow-sm dark:border-slate-700 dark:bg-slate-800/40 ' +
      (className ?? '')
    }
  >
    <div className="text-base text-slate-500 dark:text-slate-400">{label}</div>
    <div className="mt-1 text-base font-medium text-slate-900 dark:text-slate-100">{children}</div>
  </div>
)
