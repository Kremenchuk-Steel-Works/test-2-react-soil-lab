interface CenteredWrapperProps {
  children: React.ReactNode
}

export const CenteredWrapper: React.FC<CenteredWrapperProps> = ({
  children,
}) => {
  return (
    <div
      className="
        flex                /* включаем flex-контейнер */
        items-center        /* центрируем по вертикали */ :contentReference[oaicite:0]{index=0}
        justify-center      /* центрируем по горизонтали */ :contentReference[oaicite:1]{index=1}
        h-full              /* заполняем доступную высоту родителя */ :contentReference[oaicite:2]{index=2}
        w-full              /* заполняем доступную ширину родителя */
        p-4                 /* отступы по краям */
      "
    >
      <div className="pointer-events-auto">{children}</div>
    </div>
  )
}
