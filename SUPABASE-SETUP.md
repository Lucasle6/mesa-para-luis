# Configuración de Supabase (base de datos + login)

Sigue estos pasos una sola vez. Te tomará ~5 minutos. Al final me pegas **2 valores**
y yo termino de conectar el login, el panel de admin y el blog.

## 1. Crear el proyecto (gratis)

1. Entra a **https://supabase.com** → *Start your project* → inicia sesión.
2. **New project**:
   - **Name:** `mesa-para-luis`
   - **Database Password:** genera una y **guárdala** (no la compartas conmigo).
   - **Region:** la más cercana a ti.
3. Espera ~1–2 min a que el proyecto termine de aprovisionarse.

## 2. Crear las tablas y la seguridad

1. En el proyecto, ve a **SQL Editor** → **New query**.
2. Abre el archivo [`supabase/schema.sql`](supabase/schema.sql) de este repo, **copia todo** y pégalo.
3. Pulsa **Run**. Debe decir *Success*. Esto crea las tablas (`profiles`, `posts`,
   `recipes`), el bucket de imágenes y las reglas de seguridad por roles.

## 3. Activar el registro por email

1. **Authentication → Providers → Email**: déjalo activado.
2. Para probar rápido sin verificar correos: **Authentication → Providers → Email →**
   desactiva *Confirm email* (puedes reactivarlo en producción).

## 4. Obtener las claves (esto es lo que me pegas)

Ve a **Project Settings → API** y copia:

- **Project URL** → algo como `https://abcd1234.supabase.co`
- **anon / public** key → una cadena larga que empieza por `ey…`

> Estas dos son **públicas** y seguras de compartir (la base de datos está protegida
> por las reglas RLS). **No** me pases la `service_role` key ni la contraseña de la DB.

Pégamelas así:

```
SUPABASE_URL = https://....supabase.co
SUPABASE_ANON_KEY = eyJ....
```

## 5. (Después) Hacerte admin

Cuando ya esté el login, te registras en el sitio con tu correo y luego, en el
**SQL Editor**, corres (con tu correo):

```sql
update public.profiles set role = 'admin' where email = 'tu-correo@ejemplo.com';
```

A partir de ahí tu cuenta puede editar; las demás cuentas quedan en solo lectura.

---

### Para desarrollo local

Copia `.env.local.example` a `.env.local` y rellena los 2 valores. Luego `npm run dev`.

### Para producción (Vercel)

En el proyecto de Vercel → **Settings → Environment Variables**, añade
`NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` con los mismos valores.
