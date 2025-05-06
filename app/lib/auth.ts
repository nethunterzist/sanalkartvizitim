import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import { prisma } from './db';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Kullanıcı Adı / Şifre',
      credentials: {
        username: { label: 'Kullanıcı Adı', type: 'text', placeholder: 'admin' },
        password: { label: 'Şifre', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }
        
        try {
          // Kullanıcı adına göre admin bilgisini çek
          const user = await prisma.admins.findFirst({
            where: { username: credentials.username }
          });
          
          // Kullanıcı bulunmazsa null döndür
          if (!user) {
            return null;
          }
          
          // Şifre karşılaştırması yap
          const passwordMatch = await bcrypt.compare(credentials.password, user.password);
          
          if (passwordMatch) {
            // Eşleşirse kimlik bilgilerini döndür
            return {
              id: user.id.toString(),
              name: user.username,
              email: null
            };
          } else {
            // Eşleşmezse null döndür
            return null;
          }
        } catch (error) {
          console.error('Kimlik doğrulama hatası:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24 // 1 gün
  },
  pages: {
    signIn: '/login',
    error: '/login'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET || 'gizli-anahtar',
};

// Admin erişimi koruma fonksiyonu (middleware olarak kullanılabilir)
export async function isAdmin(req: any, res: any) {
  const session = req.session;
  if (!session || !session.user) {
    return false;
  }
  return true;
} 