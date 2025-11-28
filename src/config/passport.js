import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import prisma from './db.js'; // Asegúrate que esto exporta tu instancia de PrismaClient
import bcrypt from 'bcryptjs';

passport.use('local.login', new LocalStrategy({
    usernameField: 'email',      // Usaremos email en lugar de username
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    try {
        // cambiar prisma.persona por el nombre de tu modelo
        const user = await prisma.persona.findFirst({ where: { email } });

        if (!user) {
            return done(null, false, { message: 'Usuario no encontrado.' });
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return done(null, false, { message: 'Contraseña incorrecta.' });
        }

        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

// Serialización: Guardar ID en la sesión
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialización: Recuperar usuario por ID
passport.deserializeUser(async (id, done) => {
    try {
        // cambiar prisma.persona por el nombre de tu modelo
        const user = await prisma.persona.findUnique({ where: { id } });
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});