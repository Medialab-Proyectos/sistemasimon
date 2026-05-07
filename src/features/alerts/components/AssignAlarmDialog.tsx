import { useMemo, useState } from "react";
import { Button } from "../../../shared/ui/atoms";
import { Modal } from "./Modal";

export function AssignAlarmDialog({
  open,
  plate,
  userOptions,
  onClose,
  onConfirm,
}: Readonly<{
  open: boolean;
  plate: string;
  userOptions: Array<{ value: string; label: string }>;
  onClose: () => void;
  onConfirm: (userId: string) => void;
}>) {
  const [userId, setUserId] = useState<string>("");
  const canConfirm = useMemo(() => userId.trim().length > 0, [userId]);

  return (
    <Modal
      open={open}
      title="Asignar operador"
      onClose={onClose}
      footer={
        <div className="flex items-center justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="button" disabled={!canConfirm} onClick={() => onConfirm(userId)}>
            Confirmar
          </Button>
        </div>
      }
    >
      <div className="space-y-3">
        <p className="text-sm text-[--color-text-muted]">
          Seleccione el usuario que se encargará del seguimiento de la placa{" "}
          <span className="font-semibold text-[--color-text]">{plate}</span>.
        </p>
        <div className="space-y-1">
          <div className="text-xs font-semibold text-[--color-text-muted]">Operador</div>
          <select
            className="h-10 w-full rounded-xl border border-[--color-border-subtle] bg-[--color-surface] px-3 text-sm text-[--color-text] outline-none focus:ring-2 focus:ring-[--color-primary]"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          >
            <option value="">Seleccionar…</option>
            {userOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </Modal>
  );
}

