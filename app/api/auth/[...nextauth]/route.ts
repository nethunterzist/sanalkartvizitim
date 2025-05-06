import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { prisma } from "@/app/lib/db";

// Kullanıcı tipini genişlet
declare module "next-auth" {
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
  }
  
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Kullanıcı Adı", type: "text" },
        password: { label: "Şifre", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }
        
        try {
          // Kullanıcıyı bul
          const admin = await prisma.admins.findUnique({
            where: { 
              username: credentials.username 
            }
          });
          
          if (!admin) {
            console.log('Kullanıcı bulunamadı:', credentials.username);
            return null;
          }
          
          // Şifre kontrolü
          const isValid = await bcrypt.compare(credentials.password, admin.password);
          
          if (!isValid) {
            console.log('Geçersiz şifre');
            return null;
          }
          
          // Giriş başarılı
          console.log('Giriş başarılı:', admin.username);
          return {
            id: String(admin.id),
            name: admin.username,
            email: null,
            image: null
          };
        } catch (error) {
          console.error('Giriş hatası:', error);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET || "my-secret-key",
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60 // 30 gün
  }
});

export { handler as GET, handler as POST };