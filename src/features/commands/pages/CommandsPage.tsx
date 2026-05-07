import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Input } from "../../../shared/ui/atoms";
import { useSavedCommands } from "../hooks/useSavedCommands";

export function CommandsPage() {
  const { items, loading, error, refresh, removeById } = useSavedCommands();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((it) => {
      const desc = String(it.description ?? "").toLowerCase();
      const type = String(it.type ?? "").toLowerCase();
      return desc.includes(q) || type.includes(q);
    });
  }, [items, query]);

  return (
    <div className="p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/scada/commands/new")}
          >
            Nuevo
          </Button>
          <Button type="button" variant="ghost" onClick={refresh}>
            Refrescar
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div className="max-w-md w-full">
          <Input
            placeholder="Buscar por descripción o tipo…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="text-xs text-[--color-text-muted]">
          Mostrando{" "}
          <span className="font-semibold text-[--color-text]">
            {filtered.length}
          </span>
        </div>
      </div>

      <Card className="overflow-hidden">
        {(() => {
          if (error) {
            return <div className="p-4 text-sm text-red-300">{error}</div>;
          }

          let body: React.ReactNode;
          if (loading) {
            body = (
              <tr>
                <td className="px-4 py-4 text-[--color-text-muted]" colSpan={4}>
                  Cargando…
                </td>
              </tr>
            );
          } else if (filtered.length === 0) {
            body = (
              <tr>
                <td
                  className="px-4 py-10 text-center text-[--color-text-muted]"
                  colSpan={4}
                >
                  Sin resultados.
                </td>
              </tr>
            );
          } else {
            body = filtered.map((it) => (
              <tr
                key={it.id}
                className="border-t border-[--color-border-subtle]"
              >
                <td className="px-4 py-3 text-[--color-text]">
                  {it.description ?? "-"}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-[--color-text-muted]">
                  {it.type ?? "-"}
                </td>
                <td className="px-4 py-3 text-[--color-text-muted]">
                  {it.textChannel ? "SMS" : "GPRS"}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      className="h-8 px-3"
                      onClick={() => navigate(`/scada/commands/${it.id}`)}
                    >
                      Editar
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="h-8 px-3"
                      onClick={() => {
                        if (!globalThis.confirm?.("¿Eliminar este comando?"))
                          return;
                        void removeById(it.id);
                      }}
                    >
                      Eliminar
                    </Button>
                  </div>
                </td>
              </tr>
            ));
          }

          return (
            <div className="w-full overflow-auto">
              <table className="w-full border-collapse text-sm">
                <thead className="bg-[--color-surface-elevated]">
                  <tr className="text-left text-[--color-text-muted]">
                    <th className="px-4 py-3 font-semibold">Descripción</th>
                    <th className="px-4 py-3 font-semibold">Tipo</th>
                    <th className="px-4 py-3 font-semibold">Canal</th>
                    <th className="px-4 py-3 font-semibold text-right">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>{body}</tbody>
              </table>
            </div>
          );
        })()}
      </Card>
    </div>
  );
}
