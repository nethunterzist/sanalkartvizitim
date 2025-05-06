import NextAuth from "next-auth";
import { authOptions } from "../../../../pages/api/auth/[...nextauth]";

// Pages Router'dan authOptions'ı kullanarak NextAuth handler'ı oluştur
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };