/**
 * Небольшой хак против агрессивного автозаполнения.
 * Браузер/менеджер паролей "думает", что уже заполнил поля,
 * и не трогает реальные значения.
 */
export default function AutofillBait() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute top-0 -left-[9999px] h-px w-px opacity-0"
    >
      <input type="text" name="username" autoComplete="username" tabIndex={-1} readOnly />
      <input
        type="password"
        name="password"
        autoComplete="current-password"
        tabIndex={-1}
        readOnly
      />
    </div>
  )
}
