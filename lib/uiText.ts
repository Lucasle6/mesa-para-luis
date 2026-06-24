import type { Locale } from './i18n';

// User-facing strings for the auth/account/blog features, kept separate from the
// large message JSON files. The admin panel itself is Spanish-only (owner tool).
export interface ExtraText {
  account: {
    signIn: string;
    signOut: string;
    signedInAs: string;
    role_admin: string;
    role_reader: string;
    adminPanel: string;
    account: string;
  };
  auth: {
    signInTitle: string;
    signInLede: string;
    signUpTitle: string;
    signUpLede: string;
    email: string;
    password: string;
    passwordHint: string;
    signInBtn: string;
    signUpBtn: string;
    switchToSignUp: string;
    switchToSignIn: string;
    working: string;
    errInvalid: string;
    signUpSuccess: string;
    checkEmail: string;
    readerNote: string;
  };
  blog: {
    nav: string;
    eyebrow: string;
    title: string;
    lede: string;
    empty: string;
    readMore: string;
    back: string;
    draft: string;
  };
}

const TEXT: Record<Locale, ExtraText> = {
  es: {
    account: { signIn: 'Iniciar sesión', signOut: 'Cerrar sesión', signedInAs: 'Tu cuenta', role_admin: 'Admin', role_reader: 'Lectura', adminPanel: 'Panel de admin', account: 'Cuenta' },
    auth: {
      signInTitle: 'Inicia sesión', signInLede: 'Entra para guardar y, si eres admin, gestionar el contenido.',
      signUpTitle: 'Crea tu cuenta', signUpLede: 'Las cuentas nuevas son de solo lectura.',
      email: 'Correo', password: 'Contraseña', passwordHint: 'Mínimo 6 caracteres',
      signInBtn: 'Entrar', signUpBtn: 'Registrarme',
      switchToSignUp: '¿No tienes cuenta? Regístrate', switchToSignIn: '¿Ya tienes cuenta? Inicia sesión',
      working: 'Un momento…', errInvalid: 'Correo o contraseña incorrectos.',
      signUpSuccess: '¡Cuenta creada! Ya puedes entrar.', checkEmail: 'Revisa tu correo para confirmar la cuenta.',
      readerNote: 'Solo el administrador puede editar recetas y entradas.',
    },
    blog: { nav: 'Blog', eyebrow: 'El cuaderno', title: 'Del cuaderno', lede: 'Notas, técnicas e historias entre receta y receta.', empty: 'Aún no hay entradas publicadas.', readMore: 'Leer', back: 'Volver al blog', draft: 'Borrador' },
  },
  en: {
    account: { signIn: 'Sign in', signOut: 'Sign out', signedInAs: 'Your account', role_admin: 'Admin', role_reader: 'Reader', adminPanel: 'Admin panel', account: 'Account' },
    auth: {
      signInTitle: 'Sign in', signInLede: "Sign in to save and, if you're an admin, manage content.",
      signUpTitle: 'Create your account', signUpLede: 'New accounts are read-only.',
      email: 'Email', password: 'Password', passwordHint: 'At least 6 characters',
      signInBtn: 'Sign in', signUpBtn: 'Sign up',
      switchToSignUp: 'No account? Sign up', switchToSignIn: 'Have an account? Sign in',
      working: 'One moment…', errInvalid: 'Wrong email or password.',
      signUpSuccess: 'Account created — you can sign in now.', checkEmail: 'Check your email to confirm your account.',
      readerNote: 'Only the admin can edit recipes and posts.',
    },
    blog: { nav: 'Blog', eyebrow: 'The notebook', title: 'From the notebook', lede: 'Notes, techniques and stories between recipes.', empty: 'No posts published yet.', readMore: 'Read', back: 'Back to the blog', draft: 'Draft' },
  },
  tr: {
    account: { signIn: 'Giriş yap', signOut: 'Çıkış yap', signedInAs: 'Hesabın', role_admin: 'Yönetici', role_reader: 'Okuyucu', adminPanel: 'Yönetim paneli', account: 'Hesap' },
    auth: {
      signInTitle: 'Giriş yap', signInLede: 'Kaydetmek ve yöneticiysen içeriği yönetmek için giriş yap.',
      signUpTitle: 'Hesabını oluştur', signUpLede: 'Yeni hesaplar yalnızca okuma içindir.',
      email: 'E-posta', password: 'Şifre', passwordHint: 'En az 6 karakter',
      signInBtn: 'Gir', signUpBtn: 'Kayıt ol',
      switchToSignUp: 'Hesabın yok mu? Kayıt ol', switchToSignIn: 'Hesabın var mı? Giriş yap',
      working: 'Bir saniye…', errInvalid: 'E-posta veya şifre hatalı.',
      signUpSuccess: 'Hesap oluşturuldu — artık giriş yapabilirsin.', checkEmail: 'Hesabını onaylamak için e-postanı kontrol et.',
      readerNote: 'Tarifleri ve yazıları yalnızca yönetici düzenleyebilir.',
    },
    blog: { nav: 'Blog', eyebrow: 'Defter', title: 'Defterden', lede: 'Tarifler arasında notlar, teknikler ve hikâyeler.', empty: 'Henüz yayımlanmış yazı yok.', readMore: 'Oku', back: 'Bloga dön', draft: 'Taslak' },
  },
  de: {
    account: { signIn: 'Anmelden', signOut: 'Abmelden', signedInAs: 'Dein Konto', role_admin: 'Admin', role_reader: 'Leser', adminPanel: 'Admin-Panel', account: 'Konto' },
    auth: {
      signInTitle: 'Anmelden', signInLede: 'Melde dich an, um zu speichern und – als Admin – Inhalte zu verwalten.',
      signUpTitle: 'Konto erstellen', signUpLede: 'Neue Konten sind schreibgeschützt (nur Lesen).',
      email: 'E-Mail', password: 'Passwort', passwordHint: 'Mindestens 6 Zeichen',
      signInBtn: 'Anmelden', signUpBtn: 'Registrieren',
      switchToSignUp: 'Kein Konto? Registrieren', switchToSignIn: 'Konto vorhanden? Anmelden',
      working: 'Einen Moment…', errInvalid: 'Falsche E-Mail oder Passwort.',
      signUpSuccess: 'Konto erstellt — du kannst dich jetzt anmelden.', checkEmail: 'Prüfe deine E-Mail, um dein Konto zu bestätigen.',
      readerNote: 'Nur der Admin kann Rezepte und Beiträge bearbeiten.',
    },
    blog: { nav: 'Blog', eyebrow: 'Das Notizbuch', title: 'Aus dem Notizbuch', lede: 'Notizen, Techniken und Geschichten zwischen den Rezepten.', empty: 'Noch keine Beiträge veröffentlicht.', readMore: 'Lesen', back: 'Zurück zum Blog', draft: 'Entwurf' },
  },
};

export function extra(locale: Locale): ExtraText {
  return TEXT[locale] ?? TEXT.es;
}
