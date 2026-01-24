import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        GithubProvider({
            clientId: process.env.GITHUB_ID || "",
            clientSecret: process.env.GITHUB_SECRET || "",
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const { data: user, error } = await supabase
                    .from('users')
                    .select('*')
                    .eq('email', credentials.email)
                    .single();

                if (error || !user || !user.password) return null;

                const isValid = await bcrypt.compare(credentials.password, user.password);
                if (!isValid) return null;

                return {
                    id: user.id,
                    email: user.email,
                    name: user.full_name,
                    username: user.username,
                };
            }
        })
    ],
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === 'google' || account?.provider === 'github') {
                const { data: existingUser } = await supabase
                    .from('users')
                    .select('*')
                    .eq('email', user.email)
                    .single();

                if (!existingUser) {
                    // Create user if doesn't exist
                    await supabase.from('users').insert({
                        email: user.email,
                        full_name: user.name,
                        username: user.email?.split('@')[0] + Math.floor(Math.random() * 1000),
                        [account.provider === 'google' ? 'google_id' : 'github_id']: user.id,
                    });
                } else {
                    // Link account if not linked
                    const updateData: any = {};
                    if (account.provider === 'google' && !existingUser.google_id) updateData.google_id = user.id;
                    if (account.provider === 'github' && !existingUser.github_id) updateData.github_id = user.id;

                    if (Object.keys(updateData).length > 0) {
                        await supabase.from('users').update(updateData).eq('id', existingUser.id);
                    }
                }
            }
            return true;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.sub;
                (session.user as any).username = token.username;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.username = (user as any).username;
            }
            return token;
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
