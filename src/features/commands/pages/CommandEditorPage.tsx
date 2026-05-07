import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button, Card, Input } from "../../../shared/ui/atoms";
import { useScada } from "../../../app/remote/ScadaProvider";
import type { SavedCommand } from "../types";

type CommandDraft = {
  id?: number;
  description: string;
  type: string;
  textChannel: boolean;
  attributes: Record<string, unknown>;
};

const COMMAND_TYPE_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "custom", label: "Personalizado" },
  { value: "deviceConfig", label: "Configuración" },
  { value: "outputControl", label: "Control de salida" },
  { value: "requestPhoto", label: "Solicitar foto" },
  { value: "engineStop", label: "Corte de motor" },
  { value: "engineResume", label: "Restaurar motor" },
];

function coerceDraft(item: SavedCommand | null | undefined): CommandDraft {
  return {
    id: typeof item?.id === "number" ? item.id : undefined,
    description: String(item?.description ?? ""),
    type: String(item?.type ?? "custom"),
    textChannel: Boolean(item?.textChannel),
    attributes: item?.attributes && typeof item.attributes === "object" ? item.attributes : {},
  };
}

export function CommandEditorPage() {
  const { api } = useScada();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const isNew = id == null || id === "new";
  const numericId = useMemo(() => (id && /^\d+$/.test(id) ? Number(id) : null), [id]);

  const [draft, setDraft] = useState<CommandDraft>(() =>
    coerceDraft(
      // allow prefill via navigation state (optional)
      (location.state as { command?: SavedCommand } | null)?.command,
    ),
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isNew || numericId == null) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    api
      .get<SavedCommand>(`/api/commands/${numericId}`)
      .then((data) => {
        if (cancelled) return;
        setDraft(coerceDraft(data));
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Unknown error");
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [api, isNew, numericId]);

  const isValid = draft.description.trim().length > 0 && draft.type.trim().length > 0;

  const onSave = async () => {
    if (isValid === false) return;
    setLoading(true);
    setError(null);
    try {
      const payload: CommandDraft = {
        description: draft.description.trim(),
        type: draft.type,
        textChannel: draft.textChannel,
        attributes: draft.attributes ?? {},
      };
      if (numericId === null) {
        await api.post("/api/commands", payload);
      } else {
        await api.put(`/api/commands/${numericId}`, payload);
      }
      setSaved(true);
      setTimeout(() => navigate("/scada/commands"), 650);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-[--color-text]">
            {numericId === null ? "Nuevo comando" : "Editar comando"}
          </h2>
          <p className="mt-1 text-sm text-[--color-text-muted]">
            Guardado en <span className="font-mono">/api/commands</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="ghost" onClick={() => navigate(-1)} disabled={loading}>
            Cancelar
          </Button>
          <Button type="button" onClick={onSave} disabled={!isValid || loading || saved}>
            {saved ? "Guardado" : "Guardar"}
          </Button>
        </div>
      </div>

      {error && (
        <Card className="p-3 border border-red-500/30 bg-red-950/20">
          <div className="text-sm text-red-200">{error}</div>
        </Card>
      )}

      <Card className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <div className="text-xs font-semibold text-[--color-text-muted]">Descripción</div>
            <Input
              value={draft.description}
              onChange={(e) => setDraft((p) => ({ ...p, description: e.target.value }))}
              placeholder="Ej: Corte de motor"
              disabled={loading}
            />
          </div>

          <div className="space-y-1">
            <div className="text-xs font-semibold text-[--color-text-muted]">Tipo</div>
            <select
              className="h-10 w-full rounded-xl border border-[--color-border-subtle] bg-[--color-surface] px-3 text-sm text-[--color-text] outline-none focus:ring-2 focus:ring-[--color-primary]"
              value={draft.type}
              onChange={(e) => setDraft((p) => ({ ...p, type: e.target.value }))}
              disabled={loading}
            >
              {COMMAND_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="inline-flex items-center gap-2 text-sm text-[--color-text]">
            <input
              type="checkbox"
              className="h-4 w-4 accent-[--color-primary]"
              checked={draft.textChannel}
              onChange={(e) => setDraft((p) => ({ ...p, textChannel: e.target.checked }))}
              disabled={loading}
            />{" "}
            Enviar por SMS
          </label>
          <div className="text-xs text-[--color-text-muted]">
            {draft.textChannel ? "Canal: SMS" : "Canal: GPRS"}
          </div>
        </div>

        {draft.type === "custom" && (
          <div className="space-y-1">
            <div className="text-xs font-semibold text-[--color-text-muted]">Datos del comando</div>
            <Input
              value={
                typeof draft.attributes.data === "string" ? draft.attributes.data : ""
              }
              onChange={(e) =>
                setDraft((p) => ({ ...p, attributes: { ...p.attributes, data: e.target.value } }))
              }
              placeholder="Ej: comando raw"
              disabled={loading}
            />
          </div>
        )}
      </Card>
    </div>
  );
}
