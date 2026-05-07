import {
  IconButton,
  InputAdornment,
  OutlinedInput,
  Toolbar,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useRef } from "react";

export function MainToolbar({
  keyword,
  setKeyword,
}: Readonly<{
  keyword: string;
  setKeyword: (v: string) => void;
}>) {
  const toolbarRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <Toolbar
      ref={toolbarRef}
      disableGutters
      sx={{ p: 0, display: "flex", flexDirection: "row", alignItems: "center" }}
    >
      <OutlinedInput
        inputRef={inputRef}
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Buscar por placa, evento..."
        startAdornment={
          <InputAdornment position="start">
            <IconButton edge="start" disabled sx={{ color: "var(--color-text-muted)" }}>
              <SearchIcon fontSize="small" />
            </IconButton>
          </InputAdornment>
        }
        fullWidth
        sx={{
          height: 40,
          borderRadius: 3,
          backgroundColor: "var(--scada-input-bg, var(--color-background))",
          color: "var(--color-text)",
          boxShadow: "none",
          ".MuiOutlinedInput-notchedOutline": { borderColor: "var(--color-border-subtle)" },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "color-mix(in oklab, var(--color-primary) 35%, var(--color-border-subtle))",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "var(--color-primary)" },
          ".MuiInputBase-input::placeholder": { color: "var(--color-text-muted)", opacity: 1 },
          ".MuiSvgIcon-root": { color: "var(--color-text-muted)" },
        }}
      />
    </Toolbar>
  );
}

