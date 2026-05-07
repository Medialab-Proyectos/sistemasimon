import { useMemo, useState } from "react";
import { Button } from "../../../shared/ui/atoms";
import { Modal } from "./Modal";

export function BulkAssignAlarmDialog({
  open,
  userOptions,
  onClose,
  onConfirm,
}: Readonly<{
  open: boolean;
  userOptions: Array<{ value: string; label: string }>;
  onClose: () => void;
  onConfirm: (userIds: string[]) => void;
}>) {
  const [selected, setSelected] = useState<string[]>([]);
  const canConfirm = useMemo(() => selected.length > 0, [selected.length]);

  return (
    <Modal
      open={open}
      title="Asignación masiva"
      onClose={onClose}
      footer={
        <div className="flex items-center justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="button" disabled={!canConfirm} onClick={() => onConfirm(selected)}>
            Asignar
          </Button>
        </div>
      }
    >
      <div className="space-y-3">
        <p className="text-sm text-[--color-text-muted]">
          Seleccione una lista de operadores. Las alarmas sin operador se repartirán de forma equitativa entre ellos.
        </p>
        <div className="max-h-64 overflow-auto rounded-xl border border-[--color-border-subtle] bg-[--color-surface] p-2">
          {userOptions.map((u) => {
            const checked = selected.includes(u.value);
            return (
              <label
                key={u.value}
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-[--color-text] hover:bg-[--color-surface-elevated]"
              >
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-[--color-primary]"
                  checked={checked}
                  onChange={(e) => {
                    const next = e.target.checked
                      ? [...selected, u.value]
                      : selected.filter((id) => id !== u.value);
                    setSelected(next);
                  }}
                />
                <span className="truncate">{u.label}</span>
              </label>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}

