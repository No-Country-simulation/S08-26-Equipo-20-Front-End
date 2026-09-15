"use client";

import { Loader2, Pencil, Search, UserCheck, UserX } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { Badge, roleBadgeVariant } from "@/components/ui/Badge";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingState } from "@/components/ui/LoadingState";
import { Modal } from "@/components/ui/Modal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ROLE_IDS } from "@/types/roles";
import type { Team } from "@/types/teams";
import type { SystemUser, UserFormPayload } from "@/types/users";
import { errorMessage } from "@/utils/error";
import { listTeams } from "@/services/teams";
import {
  activateUser,
  createUser,
  deactivateUser,
  listUsers,
  updateUser,
} from "@/services/users";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ROLE_OPTIONS = Object.entries(ROLE_IDS) as Array<[string, number]>;

const INPUT_CLASS =
  "w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white placeholder-zinc-700 transition-colors focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600";

const LABEL_CLASS = "mb-1.5 block text-xs text-gray-400";

interface UserFormProps {
  initial?: SystemUser;
  teams: Team[];
  isPending: boolean;
  onSubmit: (payload: UserFormPayload) => Promise<void>;
  onClose: () => void;
}

function UserForm({ initial, teams, isPending, onSubmit, onClose }: UserFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [roleId, setRoleId] = useState(
    initial ? String(initial.role_id) : String(ROLE_IDS.USER),
  );
  const [teamId, setTeamId] = useState(
    initial?.team_id != null ? String(initial.team_id) : "",
  );
  const [password, setPassword] = useState("");
  const [isActive, setIsActive] = useState(initial?.is_active ?? true);
  const [error, setError] = useState<string | null>(null);

  function validate(): string | null {
    if (!name.trim()) {
      return "Ingresá un nombre";
    }
    if (!email.trim()) {
      return "Ingresá un email";
    }
    if (!EMAIL_PATTERN.test(email.trim())) {
      return "Ingresá un email válido";
    }
    if (!initial && password && password.length < 8) {
      return "La contraseña debe tener al menos 8 caracteres";
    }
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isPending) {
      return;
    }
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    await onSubmit({
      name: name.trim(),
      email: email.trim(),
      role_id: Number(roleId),
      team_id: teamId ? Number(teamId) : null,
      password: initial ? undefined : password || undefined,
      is_active: initial ? isActive : undefined,
    });
  }

  return (
    <Modal title={initial ? "Editar Usuario" : "Crear Usuario"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {error && (
          <p role="alert" className="text-xs text-red-500">
            {error}
          </p>
        )}
        <div>
          <label htmlFor="user-name" className={LABEL_CLASS}>
            Nombre
          </label>
          <input
            id="user-name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={INPUT_CLASS}
            placeholder="Nombre y apellido"
          />
        </div>
        <div>
          <label htmlFor="user-email" className={LABEL_CLASS}>
            Email
          </label>
          <input
            id="user-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={INPUT_CLASS}
            placeholder="usuario@empresa.com"
          />
        </div>
        <div>
          <label htmlFor="user-role" className={LABEL_CLASS}>
            Rol
          </label>
          <select
            id="user-role"
            value={roleId}
            onChange={(event) => setRoleId(event.target.value)}
            className={INPUT_CLASS}
          >
            {ROLE_OPTIONS.map(([label, id]) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="user-team" className={LABEL_CLASS}>
            Equipo
          </label>
          <select
            id="user-team"
            value={teamId}
            onChange={(event) => setTeamId(event.target.value)}
            className={INPUT_CLASS}
          >
            <option value="">Sin equipo</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>
        {initial ? (
          <label className="flex items-center gap-2 text-sm text-zinc-200">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(event) => setIsActive(event.target.checked)}
              className="h-4 w-4 rounded border-zinc-800 bg-zinc-950 accent-white"
            />
            Usuario activo
          </label>
        ) : (
          <div>
            <label htmlFor="user-password" className={LABEL_CLASS}>
              Contraseña
            </label>
            <input
              id="user-password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={INPUT_CLASS}
              placeholder="Si la dejás vacía se genera una temporal"
            />
          </div>
        )}
        <button
          type="submit"
          disabled={isPending}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-md bg-white text-sm font-medium text-black transition-colors hover:bg-gray-200 disabled:opacity-60"
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {isPending ? "Guardando..." : initial ? "Guardar Cambios" : "Crear Usuario"}
        </button>
      </form>
    </Modal>
  );
}

export function UsersSection() {
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<SystemUser | null>(null);
  const [target, setTarget] = useState<SystemUser | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [temporaryPassword, setTemporaryPassword] = useState<string | null>(null);
  const [formKey, setFormKey] = useState<number>(0);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      listUsers({
        search: appliedSearch || undefined,
        role: (roleFilter as "ADMIN" | "AGENT" | "USER") || undefined,
      }),
      listTeams(),
    ])
      .then(([userList, teamList]) => {
        if (cancelled) return;
        setUsers(userList.items);
        setTeams(teamList.items);
        setError(null);
      })
      .catch((cause: unknown) => {
        if (!cancelled) {
          setError(errorMessage(cause, "No se pudo cargar la información"));
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [appliedSearch, roleFilter]);

  async function reload() {
    setLoading(true);
    try {
      const [userList, teamList] = await Promise.all([
        listUsers({
          search: appliedSearch || undefined,
          role: (roleFilter as "ADMIN" | "AGENT" | "USER") || undefined,
        }),
        listTeams(),
      ]);
      setUsers(userList.items);
      setTeams(teamList.items);
      setError(null);
    } catch (cause) {
      setError(errorMessage(cause, "No se pudo cargar la información"));
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAppliedSearch(search.trim());
  }

  async function handleCreate(payload: UserFormPayload) {
    setIsPending(true);
    try {
      const created = await createUser({
        name: payload.name,
        email: payload.email,
        role_id: payload.role_id,
        team_id: payload.team_id,
        password: payload.password,
      });
      setCreateOpen(false);
      setFormKey((k) => k + 1);
      await reload();
      if (created.temporary_password) {
        setTemporaryPassword(created.temporary_password);
      }
    } catch (cause) {
      setError(errorMessage(cause, "No se pudo crear el usuario"));
    } finally {
      setIsPending(false);
    }
  }

  async function handleUpdate(payload: UserFormPayload) {
    if (editing === null) {
      return;
    }
    setIsPending(true);
    try {
      await updateUser(editing.id, {
        name: payload.name,
        role_id: payload.role_id,
        team_id: payload.team_id,
        is_active: payload.is_active,
      });
      setEditing(null);
      await reload();
    } catch (cause) {
      setError(errorMessage(cause, "No se pudo actualizar el usuario"));
    } finally {
      setIsPending(false);
    }
  }

  async function handleConfirmTarget() {
    if (target === null) {
      return;
    }
    setIsPending(true);
    try {
      if (target.is_active) {
        await deactivateUser(target.id);
      } else {
        await activateUser(target.id);
      }
      setTarget(null);
      await reload();
    } catch (cause) {
      setError(errorMessage(cause, "No se pudo actualizar el usuario"));
    } finally {
      setIsPending(false);
    }
  }

  return (
    <>
      <SectionHeader
        title="Usuarios"
        actionLabel="Crear Usuario"
        onAction={() => setCreateOpen(true)}
      />
      {error && (
        <p role="alert" className="mb-6 text-xs text-red-500">
          {error}
        </p>
      )}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <form onSubmit={handleSearch} className="flex flex-1 gap-2">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por nombre o email"
            className={INPUT_CLASS}
          />
          <button
            type="submit"
            aria-label="Buscar usuarios"
            className="flex items-center gap-2 rounded-md border border-zinc-800 px-4 py-2 text-sm text-zinc-300 transition-colors hover:bg-zinc-900 hover:text-white"
          >
            <Search className="h-4 w-4" />
          </button>
        </form>
        <select
          aria-label="Filtrar por rol"
          value={roleFilter}
          onChange={(event) => setRoleFilter(event.target.value)}
          className={`${INPUT_CLASS} sm:w-44`}
        >
          <option value="">Todos los roles</option>
          <option value="ADMIN">ADMIN</option>
          <option value="AGENT">AGENT</option>
          <option value="USER">USER</option>
        </select>
      </div>
      <div className="overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-900">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="px-4 py-3 text-xs text-gray-400">Usuario</th>
              <th className="px-4 py-3 text-xs text-gray-400">Email</th>
              <th className="px-4 py-3 text-xs text-gray-400">Rol</th>
              <th className="px-4 py-3 text-xs text-gray-400">Equipo</th>
              <th className="px-4 py-3 text-xs text-gray-400">Estado</th>
              <th className="px-4 py-3 text-right text-xs text-gray-400">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6}>
                  <LoadingState />
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <EmptyState message="No hay usuarios" />
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="border-b border-zinc-800 transition-colors hover:bg-zinc-900">
                  <td className="px-4 py-3 text-sm text-zinc-200">{user.name}</td>
                  <td className="px-4 py-3 text-sm text-zinc-200">{user.email}</td>
                  <td className="px-4 py-3">
                    <Badge variant={roleBadgeVariant(user.role)}>{user.role}</Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-zinc-200">{user.team ?? "—"}</td>
                  <td className="px-4 py-3">
                    <Badge variant={user.is_active ? "active" : "inactive"}>
                      {user.is_active ? "Activo" : "Inactivo"}
                    </Badge>
                  </td>
                  <td className="flex justify-end gap-1 px-4 py-3">
                    <button
                      type="button"
                      onClick={() => setEditing(user)}
                      aria-label={`Editar usuario ${user.name}`}
                      className="text-zinc-500 transition-colors hover:text-zinc-300"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setTarget(user)}
                      aria-label={user.is_active ? `Desactivar usuario ${user.name}` : `Activar usuario ${user.name}`}
                      className="text-zinc-500 transition-colors hover:text-zinc-300"
                    >
                      {user.is_active ? (
                        <UserX className="h-4 w-4" />
                      ) : (
                        <UserCheck className="h-4 w-4" />
                      )}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {createOpen && (
        <UserForm
          key={`new-${formKey}`}
          teams={teams}
          isPending={isPending}
          onSubmit={handleCreate}
          onClose={() => setCreateOpen(false)}
        />
      )}
      {editing && (
        <UserForm
          key={editing.id}
          initial={editing}
          teams={teams}
          isPending={isPending}
          onSubmit={handleUpdate}
          onClose={() => setEditing(null)}
        />
      )}
      {target && (
        <ConfirmDialog
          title={target.is_active ? "Desactivar Usuario" : "Activar Usuario"}
          description={
            target.is_active
              ? `¿Deseás desactivar a "${target.name}"? El usuario no podrá iniciar sesión.`
              : `¿Deseás activar a "${target.name}"?`
          }
          confirmLabel={target.is_active ? "Desactivar" : "Activar"}
          isPending={isPending}
          onConfirm={handleConfirmTarget}
          onCancel={() => setTarget(null)}
        />
      )}
      {temporaryPassword && (
        <Modal title="Contraseña Temporal" onClose={() => setTemporaryPassword(null)}>
          <div className="space-y-4">
            <p className="text-sm text-zinc-200">
              El usuario fue creado. Esta contraseña temporal se muestra una única vez:
            </p>
            <p className="rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 font-mono text-sm text-white">
              {temporaryPassword}
            </p>
            <p className="text-xs text-gray-400">
              El usuario deberá cambiarla en su primer acceso.
            </p>
            <button
              type="button"
              onClick={() => setTemporaryPassword(null)}
              className="flex h-10 w-full items-center justify-center rounded-md bg-white text-sm font-medium text-black transition-colors hover:bg-gray-200"
            >
              Listo
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}